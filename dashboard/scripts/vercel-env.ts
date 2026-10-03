#!/usr/bin/env bun
/**
 * Vercel environment variable management script.
 *
 * Usage:
 *   bun scripts/vercel-env.ts list
 *   bun scripts/vercel-env.ts add VITE_KEY VALUE [--env production,preview,development]
 *   bun scripts/vercel-env.ts remove VITE_KEY [--env production,preview,development]
 *   bun scripts/vercel-env.ts sync [--file .env.prod] [--env production,preview,development] [--dry-run]
 */

import { execSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const ALL_ENVS = ["production", "preview", "development"] as const;
type VercelEnv = (typeof ALL_ENVS)[number];

function assertPublicDashboardKey(key: string) {
	if (!key.startsWith("VITE_")) {
		throw new Error(
			"Dashboard only publishes VITE_* variables. Backend secrets belong in sanad-backend.",
		);
	}
}

// ─── helpers ────────────────────────────────────────────────────────────────

function parseEnvFile(filePath: string): Record<string, string> {
	if (!existsSync(filePath)) {
		console.error(`File not found: ${filePath}`);
		process.exit(1);
	}

	const vars: Record<string, string> = {};
	const lines = readFileSync(filePath, "utf-8").split("\n");

	for (const raw of lines) {
		const line = raw.trim();
		if (!line || line.startsWith("#")) continue;

		const eqIdx = line.indexOf("=");
		if (eqIdx === -1) continue;

		const key = line.slice(0, eqIdx).trim();
		let value = line.slice(eqIdx + 1).trim();

		// Strip surrounding quotes
		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}

		if (key) vars[key] = value;
	}

	return vars;
}

function parseEnvFlag(flag: string | undefined): VercelEnv[] {
	if (!flag) return [...ALL_ENVS];
	return flag.split(",").filter((e): e is VercelEnv =>
		(ALL_ENVS as readonly string[]).includes(e),
	);
}

function vercelAdd(
	key: string,
	value: string,
	envs: VercelEnv[],
	dryRun = false,
) {
	for (const env of envs) {
		console.log(`  → ${key} [${env}]${dryRun ? " (dry-run)" : ""}`);
		if (dryRun) continue;

		const result = spawnSync("vercel", ["env", "add", key, env], {
			input: `${value}\n`,
			encoding: "utf-8",
			stdio: ["pipe", "inherit", "inherit"],
		});

		if (result.status !== 0) {
			console.error(`  ✗ Failed to add ${key} [${env}]`);
		}
	}
}

function vercelRemove(key: string, envs: VercelEnv[], dryRun = false) {
	for (const env of envs) {
		console.log(`  → remove ${key} [${env}]${dryRun ? " (dry-run)" : ""}`);
		if (dryRun) continue;

		const result = spawnSync("vercel", ["env", "rm", key, env, "--yes"], {
			encoding: "utf-8",
			stdio: "inherit",
		});

		if (result.status !== 0) {
			console.warn(`  ⚠ Could not remove ${key} [${env}] (may not exist)`);
		}
	}
}

function vercelList() {
	execSync("vercel env ls", { stdio: "inherit" });
}

// ─── arg parsing ─────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const command = args[0];

function getFlag(name: string): string | undefined {
	const idx = args.indexOf(name);
	return idx !== -1 ? args[idx + 1] : undefined;
}

function hasFlag(name: string): boolean {
	return args.includes(name);
}

// ─── commands ────────────────────────────────────────────────────────────────

switch (command) {
	case "list": {
		vercelList();
		break;
	}

	case "add": {
		const key = args[1];
		const value = args[2];
		if (!key || value === undefined) {
			console.error("Usage: vercel-env add VITE_KEY VALUE [--env production,preview,development]");
			process.exit(1);
		}
		assertPublicDashboardKey(key);
		const envs = parseEnvFlag(getFlag("--env"));
		console.log(`Adding ${key}:`);
		vercelAdd(key, value, envs);
		console.log("Done.");
		break;
	}

	case "remove": {
		const key = args[1];
		if (!key) {
			console.error("Usage: vercel-env remove VITE_KEY [--env production,preview,development]");
			process.exit(1);
		}
		assertPublicDashboardKey(key);
		const envs = parseEnvFlag(getFlag("--env"));
		console.log(`Removing ${key}:`);
		vercelRemove(key, envs);
		console.log("Done.");
		break;
	}

	case "sync": {
		const filePath = getFlag("--file") ?? ".env.prod";
		const envs = parseEnvFlag(getFlag("--env"));
		const dryRun = hasFlag("--dry-run");

		console.log(
			`Syncing ${filePath} → Vercel [${envs.join(", ")}]${dryRun ? " (dry-run)" : ""}`,
		);

		const vars = parseEnvFile(filePath);
		const keys = Object.keys(vars);

		if (keys.length === 0) {
			console.log("No variables found.");
			break;
		}

		console.log(`\nFound ${keys.length} variable(s):\n`);

		for (const key of keys) {
			assertPublicDashboardKey(key);
		}

		console.log("\nPublic Dashboard variables (VITE_ — baked at build time):");
		for (const key of keys) {
			vercelAdd(key, vars[key], envs, dryRun);
		}

		console.log(dryRun ? "\nDry-run complete." : "\nSync complete.");
		break;
	}

	default: {
		console.log(`
Vercel env management

Commands:
  list                              List all Vercel env vars
  add VITE_KEY VALUE [--env ...]    Add a public Dashboard env var
  remove VITE_KEY [--env ...]       Remove a public Dashboard env var
  sync [--file .env.prod] [--env ...]    Bulk sync from .env.prod file
      [--dry-run]

--env flag accepts comma-separated values: production,preview,development
     Defaults to all three environments.

Examples:
  bun scripts/vercel-env.ts list
  bun scripts/vercel-env.ts add VITE_API_URL "https://api.example.com" --env production
  bun scripts/vercel-env.ts remove OLD_SECRET --env production,preview
  bun scripts/vercel-env.ts sync --file .env.prod --env production
  bun scripts/vercel-env.ts sync --dry-run
`);
	}
}
