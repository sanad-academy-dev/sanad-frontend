import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

// Dashboard tests are browser-facing unit tests. API and database tests belong
// to sanad-backend and are not discovered from this project.
export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		environment: "jsdom",
		include: ["src/**/*.test.{ts,tsx}"],
		env: { VITE_API_URL: "http://localhost:5180" },
	},
});
