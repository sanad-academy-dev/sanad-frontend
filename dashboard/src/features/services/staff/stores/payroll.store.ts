import { create } from "zustand";

import type {
	PayrollLine,
	PayrollLineStatus,
	PayrollSummary,
} from "@/features/services/staff/components/payroll/payroll-wizard.types";

// نتيجة آخر تشغيل لمسير الرواتب — يقرأ منها جدول مسير الرواتب لعرض القيم
// والحالات المحسوبة، ويكتب فيها معالج التشغيل (Wizard) عند انتهاء كل مرحلة.
interface PayrollRunResult {
	period: string; // "يوليو 2026"
	payDate: string; // "31 يوليو 2026"
	lines: PayrollLine[];
	summary: PayrollSummary;
}

interface PayrollStore {
	run: PayrollRunResult | null;
	// يثبّت نتيجة المسير (يُستدعى بعد الاحتساب) مع حالة موحّدة لكل الأسطر
	commitRun: (result: PayrollRunResult) => void;
	// ينقل كل الأسطر إلى حالة جديدة (مثلاً بعد الاعتماد → جاهز للصرف)
	setAllStatus: (status: PayrollLineStatus) => void;
	// يُعيد ضبط نتيجة المسير (لإلغاء تشغيل قيد التنفيذ)
	reset: () => void;
}

export const usePayrollStore = create<PayrollStore>()((set) => ({
	run: null,
	commitRun: (result) => set({ run: result }),
	setAllStatus: (status) =>
		set((state) =>
			state.run
				? {
						run: {
							...state.run,
							lines: state.run.lines.map((l) => ({ ...l, status })),
						},
					}
				: state,
		),
	reset: () => set({ run: null }),
}));
