import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * [P12.11] Named report presets — saved filter sets, persisted per browser.
 *
 * WHY CLIENT-SIDE (owner scoping at the M3 gate). A preset is "how I like to look at this
 * report", not a company record: it has no audit meaning, no permission story, and syncing it
 * would mean a table, a controller and a per-user scope for something nobody reconciles. It
 * lives in localStorage via Zustand `persist`, the same call the clinic store already makes.
 * The cost, stated plainly: presets do not follow an accountant to another machine. If that
 * ever matters, this store is the seam to move server-side — the components never touch
 * storage directly.
 *
 * Values are stored as a plain string map so ONE store serves every report. A typed shape per
 * report would need a store per report and a migration each time a filter is added, which is
 * how a convenience feature turns into maintenance.
 */

export type ReportPreset = {
	id: string;
	name: string;
	/** filter name → serialized value, exactly as the screen's own state holds it */
	values: Record<string, string>;
	createdAt: string;
};

/** One shared frozen instance — the "no presets yet" answer must be reference-stable. */
const EMPTY: readonly ReportPreset[] = Object.freeze([]);

type ReportPresetsState = {
	/** report key → its presets */
	presets: Record<string, ReportPreset[]>;
	savePreset: (reportKey: string, name: string, values: Record<string, string>) => void;
	deletePreset: (reportKey: string, id: string) => void;
};

export const useReportPresetsStore = create<ReportPresetsState>()(
	persist(
		(set, get) => ({
			presets: {},
			savePreset: (reportKey, name, values) => {
				const trimmed = name.trim();
				if (!trimmed) return;
				const existing = get().presets[reportKey] ?? [];
				// الحفظ باسمٍ قائم يستبدله: المستخدم يقصد «حدِّث هذا» لا «أنشئ توأمًا»
				const withoutSameName = existing.filter((row) => row.name !== trimmed);
				set({
					presets: {
						...get().presets,
						[reportKey]: [
							...withoutSameName,
							{
								id: `${reportKey}-${trimmed}`,
								name: trimmed,
								values,
								createdAt: new Date().toISOString(),
							},
						],
					},
				});
			},
			deletePreset: (reportKey, id) => {
				set({
					presets: {
						...get().presets,
						[reportKey]: (get().presets[reportKey] ?? []).filter((row) => row.id !== id),
					},
				});
			},
		}),
		{ name: "elite-vet-report-presets" },
	),
);

/**
 * The subscription selector, exported so the reference-stability invariant below can be
 * tested without mounting React — the store test suite is pure and stays that way.
 */
export const selectPresets =
	(reportKey: string) =>
	(state: ReportPresetsState): readonly ReportPreset[] =>
		state.presets[reportKey] ?? EMPTY;

export const useReportPresets = (reportKey: string) => {
	// `?? EMPTY` and NOT `?? []`. Zustand 5 subscribes through `useSyncExternalStore` and
	// compares the selector's result with `Object.is` only — the shallow comparison that
	// used to be the default is gone. A literal `[]` is a fresh reference on every call, so
	// React sees the store as changed on every check, re-renders, gets another new array,
	// and never settles: `forceStoreRerender` → "Maximum update depth exceeded" (React
	// #185), which in a production build is an unreadable minified code.
	//
	// The trap is that it only fires when this report has NO saved preset — the key is
	// absent, so the `??` branch is taken. Anyone who had ever saved one got a stable
	// persisted array back and never saw it, which is why this reached production and
	// crashed the Financial Statements screen for every user of a fresh install.
	const presets = useReportPresetsStore(selectPresets(reportKey));
	const savePreset = useReportPresetsStore((state) => state.savePreset);
	const deletePreset = useReportPresetsStore((state) => state.deletePreset);
	return {
		presets,
		savePreset: (name: string, values: Record<string, string>) =>
			savePreset(reportKey, name, values),
		deletePreset: (id: string) => deletePreset(reportKey, id),
	};
};
