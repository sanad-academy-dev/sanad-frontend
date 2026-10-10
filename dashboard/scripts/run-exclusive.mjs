#!/usr/bin/env bun
/**
 * run-exclusive — serialize the memory-heavy jobs (tsc, vite build) machine-wide.
 *
 * WHY: `bun run typecheck` is three `tsc` programs that each grow to ~6-9 GB, and
 * `bun run build` another ~8 GB. Two of them at once (parallel agents, or a pre-commit
 * hook firing while someone builds) does not just run slower — on Windows it pushes the
 * system past its COMMIT LIMIT (RAM + pagefile), and Windows then fails allocations in
 * whatever process asks next. That is what has been killing VS Code: the System event log
 * records "low virtual memory" (Event ID 2004) naming node.exe at 9.7-11.4 GB next to
 * Code.exe and vmmemWSL. CLAUDE.md rule 13 asks for this serialization by discipline;
 * this enforces it instead.
 *
 * Usage:  bun scripts/run-exclusive.mjs <label> <command> [args...]
 *
 * Behaviour: takes ONE machine-wide lock shared by every heavy job, waits for whoever
 * holds it, and warns when commit headroom is already low. It is FAIL-OPEN by design —
 * every failure path runs the command anyway, so it can never wedge a commit or a build.
 * Escapes: HEAVY_LOCK_DISABLE=1 skips it entirely; CI=true skips it (runners are alone).
 */
import { execFileSync, spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const [label, ...cmd] = process.argv.slice(2);
if (!label || cmd.length === 0) {
	console.error("usage: run-exclusive <label> <command> [args...]");
	process.exit(64);
}

const LOCK = path.join(os.tmpdir(), "elite-vet-heavy-job.lock");
const STALE_MS = 45 * 60 * 1000;
const MAX_WAIT_MS = Number(process.env.HEAVY_LOCK_MAX_WAIT_MS ?? 30 * 60 * 1000);
const MIN_FREE_MB = Number(process.env.HEAVY_MIN_FREE_MB ?? 12000);
const MEM_WAIT_MS = Number(process.env.HEAVY_MEM_WAIT_MS ?? 120 * 1000);
const DISABLED = process.env.HEAVY_LOCK_DISABLE === "1" || Boolean(process.env.CI);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const alive = (pid) => {
	if (!Number.isInteger(pid)) return false;
	try {
		process.kill(pid, 0);
		return true;
	} catch (err) {
		return err.code === "EPERM"; // exists, just not ours to signal
	}
};

/** Free COMMIT (not free RAM) in MB — the number that actually predicts the crash. */
const freeCommitMB = () => {
	if (process.platform !== "win32") return null;
	try {
		const out = execFileSync(
			"powershell.exe",
			[
				"-NoProfile",
				"-NonInteractive",
				"-Command",
				"[int]((Get-CimInstance Win32_OperatingSystem).FreeVirtualMemory/1KB)",
			],
			{ encoding: "utf8", timeout: 15000, stdio: ["ignore", "pipe", "ignore"] },
		);
		const n = Number(out.trim());
		return Number.isFinite(n) && n > 0 ? n : null;
	} catch {
		return null;
	}
};

let held = false;

const acquire = async () => {
	const start = Date.now();
	let announced = false;
	for (;;) {
		try {
			const fd = fs.openSync(LOCK, "wx");
			fs.writeSync(fd, JSON.stringify({ pid: process.pid, label, at: Date.now() }));
			fs.closeSync(fd);
			held = true;
			return;
		} catch (err) {
			if (err.code !== "EEXIST") return; // cannot lock at all — fail open
			let holder = null;
			try {
				holder = JSON.parse(fs.readFileSync(LOCK, "utf8"));
			} catch {
				/* unreadable/half-written lock — treat as stale below */
			}
			const stale = !holder || !alive(holder.pid) || Date.now() - holder.at > STALE_MS;
			if (stale) {
				try {
					fs.unlinkSync(LOCK);
					continue;
				} catch {
					return; // someone else got there first or we cannot unlink — fail open
				}
			}
			if (Date.now() - start > MAX_WAIT_MS) {
				console.warn(`⚠ run-exclusive: waited ${Math.round(MAX_WAIT_MS / 60000)} min for "${holder.label}" — proceeding unlocked.`);
				return;
			}
			if (!announced) {
				console.log(`⏳ run-exclusive: "${label}" is waiting — "${holder.label}" (pid ${holder.pid}) holds the heavy-job lock.`);
				announced = true;
			}
			await sleep(5000);
		}
	}
};

const release = () => {
	if (!held) return;
	held = false;
	try {
		const holder = JSON.parse(fs.readFileSync(LOCK, "utf8"));
		if (holder.pid === process.pid) fs.unlinkSync(LOCK);
	} catch {
		/* already gone */
	}
};

const waitForHeadroom = async () => {
	const start = Date.now();
	let warned = false;
	for (;;) {
		const free = freeCommitMB();
		if (free === null || free >= MIN_FREE_MB) return;
		if (!warned) {
			console.warn(
				`⚠ run-exclusive: only ${(free / 1024).toFixed(1)} GB of commit headroom (want ${(MIN_FREE_MB / 1024).toFixed(1)} GB).\n` +
					"  Close a browser/Docker/another editor, or this run can push Windows past its commit limit and take VS Code with it.",
			);
			warned = true;
		}
		if (Date.now() - start > MEM_WAIT_MS) {
			console.warn("⚠ run-exclusive: headroom did not recover — running anyway.");
			return;
		}
		await sleep(10000);
	}
};

const main = async () => {
	if (!DISABLED) {
		await acquire();
		await waitForHeadroom();
	}
	// shell:false — a Windows shell would re-split the arguments and, worse, swallow the
	// child's exit code, which would turn a failing typecheck into a passing commit.
	// bun/node are .exe, so libuv resolves them off PATH without a shell.
	const child = spawn(cmd[0], cmd.slice(1), { stdio: "inherit", shell: false });
	const forward = (sig) => {
		try {
			child.kill(sig);
		} catch {
			/* already dead */
		}
	};
	process.on("SIGINT", () => forward("SIGINT"));
	process.on("SIGTERM", () => forward("SIGTERM"));
	process.on("exit", release);
	child.on("error", (err) => {
		// Last-resort fallback: if the binary could not be resolved without a shell, retry
		// through one rather than failing the caller outright.
		if (err.code === "ENOENT" || err.code === "EINVAL") {
			const viaShell = spawn(cmd.join(" "), { stdio: "inherit", shell: true });
			viaShell.on("close", (code, signal) => {
				release();
				process.exit(signal ? 1 : (code ?? 1));
			});
			return;
		}
		release();
		console.error(`run-exclusive: failed to start ${cmd[0]}: ${err.message}`);
		process.exit(1);
	});
	child.on("close", (code, signal) => {
		release();
		process.exit(signal ? 1 : (code ?? 1));
	});
};

main();
