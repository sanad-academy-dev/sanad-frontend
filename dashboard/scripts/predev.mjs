// Runs automatically before `bun dev` (npm/bun `pre` lifecycle hook).
//
// Prevents the recurring Windows crash:
//   EPERM: operation not permitted, rename '.tanstack/tmp/...' -> 'src/routeTree.gen.ts'
//
// Two causes are handled:
//   1. Stale temp files left behind by a crashed router-generator.
//   2. An orphaned dev server still listening on the port — a second `bun dev`
//      then races it writing routeTree.gen.ts, and one instance dies with EPERM.
import { execSync } from "node:child_process";
import { rmSync } from "node:fs";

const PORT = 3001;

// 1. Clear the router-generator temp dir so a leftover temp file can never
//    break the atomic tmp -> routeTree.gen.ts rename.
rmSync(".tanstack/tmp", { recursive: true, force: true });

// 2. Free the dev port by killing whatever is still listening on it.
function killPort(port) {
	const isWindows = process.platform === "win32";
	try {
		if (isWindows) {
			const out = execSync(`netstat -ano`, { encoding: "utf8" });
			const pids = new Set();
			for (const line of out.split("\n")) {
				if (!line.includes("LISTENING")) continue;
				const cols = line.trim().split(/\s+/);
				// cols: [proto, localAddr, foreignAddr, state, pid]
				const localAddr = cols[1] ?? "";
				const pid = cols[cols.length - 1];
				if (localAddr.endsWith(`:${port}`) && pid && pid !== "0") {
					pids.add(pid);
				}
			}
			for (const pid of pids) {
				try {
					execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
					console.log(`[predev] freed port ${port} (killed PID ${pid})`);
				} catch {}
			}
		} else {
			execSync(`lsof -ti tcp:${port} | xargs -r kill -9`, { stdio: "ignore" });
		}
	} catch {
		// netstat/lsof returning non-zero (nothing listening) is fine.
	}
}

killPort(PORT);
