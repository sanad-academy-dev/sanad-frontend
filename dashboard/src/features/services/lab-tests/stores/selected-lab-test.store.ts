import { create } from "zustand";

// تبويبات لوحة الطلب — تُستخدم لفتح اللوحة على التبويب المقصود مباشرةً.
// النتائج تُعرض من زر صف التحليل، والنشاط قسم داخل التفاصيل — فلا تبويب لهما.
export type LabTestSheetTab = "details" | "comments" | "invoice";

/**
 * وجهة الفتح: أي تبويب، وأي تحليل تُفتح لوحته الجانبية مباشرةً.
 * focusItemId يحصر الشيت في تحليل بعينه (جدول التحاليل يعرضه وحده) دون فتح
 * لوحته — البطاقة تمرّره دائمًا لأن كل بطاقة تحليل واحد، وitemId يفتح اللوحة فوقه.
 */
export type LabTestSheetIntent = {
	tab?: LabTestSheetTab;
	itemId?: string | null;
	focusItemId?: string | null;
};

// الطلب المفتوح في لوحة التفاصيل — نخزّن المعرّف فقط والبيانات تُجلب طازجة
interface SelectedLabTestStore {
	selectedId: string | null;
	intent: LabTestSheetIntent;
	select: (id: string, intent?: LabTestSheetIntent) => void;
	close: () => void;
}

const DEFAULT_INTENT: LabTestSheetIntent = { tab: "details", itemId: null, focusItemId: null };

export const useSelectedLabTestStore = create<SelectedLabTestStore>()((set) => ({
	selectedId: null,
	intent: DEFAULT_INTENT,
	select: (id, intent) => set({ selectedId: id, intent: { ...DEFAULT_INTENT, ...intent } }),
	close: () => set({ selectedId: null, intent: DEFAULT_INTENT }),
}));
