# Why VS Code kept dying, and what was changed

**Symptom.** During a Claude session — generating a Prisma migration, committing, pushing —
a `node` process in Task Manager climbs to 10-15 GB and VS Code disappears. Random-looking,
never on other projects.

**It was never a leak.** Windows records the real cause in the System event log,
Event ID 2004 (Resource Exhaustion Detector). Eight of them in two days:

```
[2026-09-02 22:13] low virtual memory: Code.exe consumed 10,137,190,400 bytes,
                   vmmemWSL 6,437,470,208, node.exe 2,294,575,104
[2026-09-02 03:25] low virtual memory: node.exe consumed 11,425,853,440 bytes,
                   Code.exe 6,237,270,016, claude.exe 2,512,171,008
[2026-09-02 01:39] low virtual memory: node.exe consumed 9,736,531,968 bytes, ...
```

"Low virtual memory" is the **commit limit**, not free RAM: physical RAM + pagefile.
On this box that was 31.9 GB + a system-managed 32 GB pagefile ≈ 63.8 GB, with ~33 GB
already committed at rest. When commit runs out Windows does not pick a culprit — it fails
the next allocation whoever makes it, and VS Code is the one that dies.

Four things were stacking on that limit:

| Contributor | Size | Trigger |
|---|---|---|
| `tsc` (the pre-commit `bun run typecheck`) | 9.7-11.4 GB observed, ceiling was **12288 MB** | any commit staging `.ts/.tsx/.prisma/tsconfig*` — i.e. every migration commit |
| `vite build` (pre-push, UI surface touched) | ceiling 8192 MB | every push touching `src/features\|routes\|components\|…` |
| A VS Code helper re-indexing after file churn | 10.1 GB observed | `prisma generate` rewrites ~1,000 files under `generated/`; a build ~1,300 under `.output/` |
| `vmmemWSL` (Docker Desktop) | 4.7-6.4 GB, uncapped | always on |

Which is exactly why it looked random and why it clustered on "migration" and "git": those
are the two moments that fire a 9-12 GB `tsc`/build **and** a thousand-file rewrite that
wakes every watcher, on top of whatever Chrome, Discord and three `claude.exe` sessions
already hold.

## What is now in the repo

- **`scripts/run-exclusive.mjs`** — one machine-wide lock (`%TEMP%/elite-vet-heavy-job.lock`)
  shared by `typecheck` and the pre-push `build`, so two multi-GB programs can never overlap.
  It waits for the holder, steals a lock whose owner is dead, warns when commit headroom is
  already below ~12 GB, propagates the child's exit code, and is skipped when `CI` is set.
  Fail-open everywhere: a lock problem never blocks a commit.
  Escape hatch: `HEAVY_LOCK_DISABLE=1`.
- **`package.json`** — `typecheck` ceiling **12288 → 9216 MB** per program (the
  documented-passing figure in CLAUDE.md rule 14: peaks 5.56 / 8.11 / 8.66 GB). A lower
  ceiling makes V8 collect earlier, so it lowers real usage too. `typecheck:raw` is the
  unwrapped chain; `typecheck` is the locked entry point CI and the hook both call.
- **`.vscode/settings.json`** — `files.watcherExclude` / `search.exclude` for `generated/`,
  `tsbuild/`, `.output/`, `.nitro/`, `.tanstack/`, `dist/`, `node_modules/`; explicit
  `typescript.tsserver.maxTsServerMemory`; automatic type acquisition off. None of those
  directories is tracked by git, so nothing real is hidden — it stops a `prisma generate`
  from making the editor re-index the workspace.

## What is machine-level (not in the repo)

1. **`%USERPROFILE%\.wslconfig`** — written: caps WSL2/Docker at 8 GB + gradual reclaim.
   Applies after: quit Docker Desktop → `wsl --shutdown` → start Docker Desktop.
2. **Pagefile** — the single biggest lever, and it needs an elevated prompt. Replace the
   system-managed pagefile with a **fixed 32 GB..64 GB file on C:** (the SSD; `D:`/`E:` are
   the 1 TB spinning disk). Fixed matters as much as large: a system-managed file grows
   lazily and the crash lands before the growth does. New limit ≈ 96 GB.
3. **VS Code extensions worth disabling in this workspace** — `vue.volar` (+ the four Vue
   snippet packs and `volarjs-labs`): Volar injects `patch-tsserver.js` into *every*
   tsserver instance, and this repo has **zero** `.vue` files. `ms-python.vscode-pylance`
   (one `.py` file). `dbaeumer.vscode-eslint` + `rvest.vs-code-prettier-eslint` — the repo
   lints with Biome.

## If it happens again

```powershell
Get-WinEvent -FilterHashtable @{LogName='System'; Id=2004} -MaxEvents 5 |
  ForEach-Object { "$($_.TimeCreated): $($_.Message)" }
```
That names the three biggest consumers at the moment of the crash. Commit headroom right
now:
```powershell
$o = Get-CimInstance Win32_OperatingSystem
"free commit: {0:N1} GB of {1:N1} GB" -f ($o.FreeVirtualMemory/1MB), ($o.TotalVirtualMemorySize/1MB)
```
