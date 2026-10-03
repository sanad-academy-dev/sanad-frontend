#!/usr/bin/env node
/**
 * Runs the Dashboard browser-program typecheck with one configurable heap ceiling.
 *
 * ── Why this file exists ─────────────────────────────────────────────────────────────
 *
 * The ceiling used to be hardcoded three times inside a package.json script. That made it a
 * single number for two environments with genuinely different limits:
 *
 *   · The dev box. Rule 13: a 12 GB `tsc` on top of VS Code, WSL/Docker and a dev server
 *     exhausts a 32 GB Windows machine's COMMIT limit and Windows kills VS Code. 9216 is
 *     the ceiling that stopped that, set 2026-09-03.
 *
 *   · CI's `typecheck-cold` job. It gets its OWN runner, alone, plus 8 GB of provisioned
 *     swap — and it builds the whole graph from scratch, which is the expensive case.
 *
 * Lowering the shared number to 9216 for the dev box therefore also lowered it for the cold
 * CI job, which then OOMed. Measured cold on 2026-09-04, one process per program:
 *
 *   generated 7,582 MB · server 8,886 MB · client 9,819 MB
 *
 * The client program alone needs more than 9216 — and it does so WITHOUT the reminders
 * module too (9,571 MB with it removed), so the cold gate had already outgrown the ceiling
 * before that work: the inpatients and emergency modules landed after the 8.66 GB figure in
 * rule 14's table was measured.
 *
 * So the ceiling is now one value with one default, overridable per environment:
 *   TYPECHECK_HEAP_MB — defaults to 9216 (the dev box's safe limit, unchanged).
 *   CI's cold job sets it higher; nothing else does.
 *
 * `NODE_OPTIONS` is NOT read from the environment here: a package.json script that sets it
 * inline overrides whatever the caller exported, which is exactly the trap this replaces.
 * Bun's shell has no `${VAR:-default}` expansion (verified — it passes the literal through),
 * which is why this is a script rather than a longer script line.
 */

import { spawnSync } from "node:child_process";

const PROGRAMS = [["-p", "tsconfig.client.json"]];

const heapMb = Number(process.env.TYPECHECK_HEAP_MB) || 9216;

for (const args of PROGRAMS) {
	const label = args[1];
	const started = Date.now();

	const result = spawnSync("tsc", args, {
		stdio: "inherit",
		shell: true,
		env: {
			...process.env,
			// Replaces any inherited NODE_OPTIONS rather than appending: two
			// --max-old-space-size flags is not an error, it is a silent last-one-wins.
			NODE_OPTIONS: `--max-old-space-size=${heapMb}`,
		},
	});

	const seconds = ((Date.now() - started) / 1000).toFixed(1);

	if (result.status !== 0) {
		// 134 = SIGABRT, how a V8 heap OOM surfaces. It prints no `error TS` line, so a
		// grep for that pattern reports success on a run that checked nothing — name it.
		const oom = result.status === 134;
		console.error(
			`\n[typecheck] ${label} failed after ${seconds}s (exit ${result.status})` +
				(oom
					? ` — V8 heap OOM at ${heapMb} MB.\n` +
						"[typecheck] Raise TYPECHECK_HEAP_MB, or fix the type errors first: error\n" +
						"[typecheck] recovery inflates the graph, so an OOM is often a symptom, not a budget."
					: ""),
		);
		process.exit(result.status ?? 1);
	}

	console.log(`[typecheck] ${label} ok in ${seconds}s (ceiling ${heapMb} MB)`);
}
