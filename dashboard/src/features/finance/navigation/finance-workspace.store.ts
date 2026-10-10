import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { FinanceNavGroupKey } from "@/features/finance/navigation/finance-nav";
import type { WorkspaceTarget } from "@/features/finance/navigation/finance-workspace";

/**
 * [NAV-2] Last-visited memory for the «المالية» workspace: entering the area lands on the
 * last destination, switching sub-workspaces lands on that group's remembered tab. Persisted
 * so the memory survives a reload — permission changes are handled at READ time (`landingFor`
 * validates the remembered target against the filtered group before using it).
 */

interface FinanceWorkspaceStore {
	lastGroupKey: FinanceNavGroupKey | null;
	lastByGroup: Partial<Record<FinanceNavGroupKey, WorkspaceTarget>>;
	remember: (groupKey: FinanceNavGroupKey, target: WorkspaceTarget) => void;
}

export const useFinanceWorkspaceStore = create<FinanceWorkspaceStore>()(
	persist(
		(set) => ({
			lastGroupKey: null,
			lastByGroup: {},
			remember: (groupKey, target) =>
				set((state) => ({
					lastGroupKey: groupKey,
					lastByGroup: { ...state.lastByGroup, [groupKey]: target },
				})),
		}),
		{ name: "elite-vet-finance-workspace" },
	),
);
