import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Per-report view state, persisted locally.
 *
 * Reports themselves are code and cannot be edited from the UI — but *how you last looked at
 * one* is personal, not shared, so the «حفظ» action on the report page writes the current
 * date window and hidden widgets here rather than to the server. Reopening the report picks
 * the saved view back up; «إعادة الضبط» drops it.
 */
export type ReportView = {
	from: string;
	to: string;
	hiddenWidgets: string[];
};

type ReportsStore = {
	views: Record<string, ReportView>;
	saveView: (reportId: string, view: ReportView) => void;
	resetView: (reportId: string) => void;
	toggleWidget: (reportId: string, widgetKey: string, hidden: boolean) => void;
};

export const useReportsStore = create<ReportsStore>()(
	persist(
		(set, get) => ({
			views: {},
			saveView: (reportId, view) =>
				set({ views: { ...get().views, [reportId]: { ...view } } }),
			resetView: (reportId) => {
				const { [reportId]: _dropped, ...rest } = get().views;
				return set({ views: rest });
			},
			toggleWidget: (reportId, widgetKey, hidden) => {
				const current = get().views[reportId];
				const hiddenWidgets = new Set(current?.hiddenWidgets ?? []);
				if (hidden) hiddenWidgets.add(widgetKey);
				else hiddenWidgets.delete(widgetKey);
				set({
					views: {
						...get().views,
						[reportId]: {
							from: current?.from ?? "",
							to: current?.to ?? "",
							hiddenWidgets: [...hiddenWidgets],
						},
					},
				});
			},
		}),
		{ name: "elite-vet-reports" },
	),
);
