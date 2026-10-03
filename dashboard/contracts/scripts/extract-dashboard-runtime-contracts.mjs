import { createRequire } from "node:module";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const contractsRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(contractsRoot, "../../..");
const dashboardRoot = resolve(contractsRoot, "..");
const dashboardSource = join(dashboardRoot, "src");
const backendSource = join(workspaceRoot, "sanad-backend", "src");
const outputRoot = join(contractsRoot, "runtime");
const requireFromBackend = createRequire(join(workspaceRoot, "sanad-backend", "package.json"));
const ts = requireFromBackend("typescript");

const clientRoots = ["components", "features", "hooks", "routes"].map((part) =>
	join(dashboardSource, part),
);
const sourceExtensions = [".ts", ".tsx", "/index.ts", "/index.tsx"];
const supportModules = new Map([
	["lib/validation/phone", join(backendSource, "lib", "validation", "phone.ts")],
	["lib/rbac/rbac-registry", join(backendSource, "lib", "rbac", "rbac-registry.ts")],
	["lib/rbac/rbac-catalogue", join(backendSource, "lib", "rbac", "rbac-catalogue.ts")],
]);
const supportImportRewrites = new Map(
	[...supportModules.keys()].map((module) => [`@/${module}`, `@sanad/contracts/runtime/${module}`]),
);

const walk = (directory, files = []) => {
	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		const path = join(directory, entry.name);
		if (entry.isDirectory()) walk(path, files);
		else if (/\.(?:ts|tsx)$/.test(entry.name) && !path.endsWith("routeTree.gen.ts")) files.push(path);
	}
	return files;
};

const resolveServerSource = (specifier) => {
	const base = join(backendSource, specifier.slice(2));
	for (const extension of sourceExtensions) {
		if (existsSync(`${base}${extension}`)) return `${base}${extension}`;
	}
	throw new Error(`Cannot resolve dashboard source for ${specifier}`);
};

const isRuntimeImport = (declaration) => {
	const clause = declaration.importClause;
	if (!clause || clause.isTypeOnly) return false;
	if (clause.name) return true;
	if (!clause.namedBindings) return false;
	return (
		ts.isNamespaceImport(clause.namedBindings) ||
		clause.namedBindings.elements.some((element) => !element.isTypeOnly)
	);
};

const serverImports = (file) => {
	const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
	const imports = [];
	source.forEachChild((node) => {
		const moduleSpecifier =
			ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)
				? node.moduleSpecifier.text
				: null;
		const legacyServerSpecifier = moduleSpecifier?.startsWith("@/server/")
			? moduleSpecifier
			: moduleSpecifier?.startsWith("@sanad/contracts/runtime/server/")
				? `@/${moduleSpecifier.slice("@sanad/contracts/runtime/".length)}`
				: null;
		if (
			ts.isImportDeclaration(node) &&
			legacyServerSpecifier
		) {
			imports.push({
				specifier: legacyServerSpecifier,
				runtime: isRuntimeImport(node),
				start: node.moduleSpecifier.getStart(source) + 1,
				end: node.moduleSpecifier.getEnd() - 1,
			});
		}
	});
	return imports;
};

const rewriteRuntimeImports = (file, runtimeSpecifiers) => {
	const original = readFileSync(file, "utf8");
	const replacements = serverImports(file)
		.filter(({ runtime, specifier }) => runtime && runtimeSpecifiers.has(specifier))
		.map(({ specifier, start, end }) => ({
			start,
			end,
			value: `@sanad/contracts/runtime/${specifier.slice(2)}`,
		}));
	for (const [from, to] of supportImportRewrites) {
		let offset = 0;
		while (true) {
			const start = original.indexOf(from, offset);
			if (start < 0) break;
			replacements.push({ start, end: start + from.length, value: to });
			offset = start + from.length;
		}
	}

	if (!replacements.length) return original;
	return replacements
		.toSorted((left, right) => right.start - left.start)
		.reduce((text, replacement) => text.slice(0, replacement.start) + replacement.value + text.slice(replacement.end), original);
};

const clientFiles = clientRoots.flatMap((directory) => walk(directory));
const runtimeSpecifiers = new Set();

for (const file of clientFiles) {
	for (const entry of serverImports(file)) if (entry.runtime) runtimeSpecifiers.add(entry.specifier);
}

const pending = [...runtimeSpecifiers];
const copied = new Map();
while (pending.length) {
	const specifier = pending.pop();
	if (copied.has(specifier)) continue;

	const sourceFile = resolveServerSource(specifier);
	const sourceText = readFileSync(sourceFile, "utf8");
	if (
		sourceText.includes('from "@/lib/db"') ||
		sourceText.includes("from '@/lib/db'") ||
		sourceText.includes('from "elysia"') ||
		sourceText.includes("from 'elysia'") ||
		sourceText.includes("better-auth") ||
		sourceText.includes("node:")
	) {
		throw new Error(`Refusing to place server-only source in contracts: ${specifier}`);
	}

	copied.set(specifier, sourceFile);
	for (const dependency of serverImports(sourceFile)) {
		if (dependency.runtime && !copied.has(dependency.specifier)) {
			runtimeSpecifiers.add(dependency.specifier);
			pending.push(dependency.specifier);
		}
	}
}

rmSync(outputRoot, { recursive: true, force: true });
for (const [specifier, sourceFile] of copied) {
	const destination = join(outputRoot, specifier.slice(2));
	mkdirSync(dirname(destination), { recursive: true });
	writeFileSync(destination + sourceFile.slice(sourceFile.lastIndexOf(".")), rewriteRuntimeImports(sourceFile, runtimeSpecifiers));
}

for (const [module, sourceFile] of supportModules) {
	const destination = join(outputRoot, module);
	mkdirSync(dirname(destination), { recursive: true });
	writeFileSync(destination + sourceFile.slice(sourceFile.lastIndexOf(".")), rewriteRuntimeImports(sourceFile, runtimeSpecifiers));
}

for (const file of clientFiles) {
	writeFileSync(file, rewriteRuntimeImports(file, runtimeSpecifiers));
}

console.log(
	`Extracted ${copied.size} browser-safe runtime modules and rewrote ${clientFiles.length} Dashboard source files.`,
);
