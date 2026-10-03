import { create } from "zustand";
import { persist } from "zustand/middleware";

// الفرع النشط المختار من محوّل الفروع (في قائمة المستخدم).
// حاليًا مجرد اختيار واجهة يُحفظ محليًا — منطق حصر البيانات على الفرع يُضاف لاحقًا.
interface ActiveBranchStore {
	activeBranchId: string | null;
	setActiveBranchId: (branchId: string | null) => void;
}

export const useActiveBranchStore = create<ActiveBranchStore>()(
	persist(
		(set) => ({
			activeBranchId: null,
			setActiveBranchId: (branchId) => set({ activeBranchId: branchId }),
		}),
		{ name: "elite-vet-active-branch" },
	),
);
