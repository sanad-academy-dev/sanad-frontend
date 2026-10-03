/**
 * [CI-split] Generate `src/routeTree.gen.ts` WITHOUT running a full vite build.
 *
 * WHY. `src/routeTree.gen.ts` is gitignored and produced by the tanstackStart vite
 * plugin, so `tsc --noEmit` fails on every `createFileRoute("/...")` call until a build
 * has run. That is the only reason the CI typecheck used to sit behind a ~2-minute
 * production build — which, on a repo where CI minutes are a real constraint, meant every
 * intermediate commit paid for a bundle nobody looked at.
 *
 * The vite plugin is a thin wrapper around `@tanstack/router-generator`, so the fast CI
 * job calls the generator directly: seconds instead of minutes, byte-identical output.
 * The FULL job still runs the real `bun run build` — this does not replace the bundle
 * guard (CLAUDE.md rule 7), it only unblocks typechecking without one.
 *
 * Usage: bun run gen:routetree
 */

import { appendFileSync, readFileSync } from "node:fs";

import { Generator, getConfig } from "@tanstack/router-generator";

const config = getConfig({}, process.cwd());
const generator = new Generator({ config, root: process.cwd() });

await generator.run();

/**
 * The tanstackStart plugin appends this `Register` augmentation after the generator
 * runs; the bare generator does not. Typecheck passes without it, which is exactly the
 * danger — an absent `Register` makes `ssr`/`router` fall back to their defaults and can
 * HIDE type errors the real build would surface. Appending it keeps the fast job's view
 * identical to the bundle's.
 *
 * The FULL job's `bun run build` remains the authority: if the plugin's emitted shape
 * ever changes, that job fails and this block gets updated — the fast job is an early
 * warning, never the source of truth (CLAUDE.md rule 7).
 */
const REGISTER_BLOCK = `
import type { getRouter } from './router.tsx'
import type { createStart } from '@tanstack/react-start'
declare module '@tanstack/react-start' {
  interface Register {
    ssr: true
    router: Awaited<ReturnType<typeof getRouter>>
  }
}
`;

const generated = readFileSync(config.generatedRouteTree, "utf-8");
if (!generated.includes("declare module '@tanstack/react-start'")) {
	appendFileSync(config.generatedRouteTree, REGISTER_BLOCK);
}

console.log(`✓ generated ${config.generatedRouteTree} (+ Register augmentation)`);
