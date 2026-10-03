import { create } from "zustand";

// تبويبات لوحة الطلب — تُستخدم لفتح اللوحة على التبويب المقصود مباشرةً.
export type RadiologySheetTab = "details" | "comments" | "invoice";

/**
 * وجهة الفتح: أي تبويب، وأي فحص تُفتح لوحته الجانبية مباشرةً.
 * focusItemId يحصر الشيت في فحص بعينه (جدول الفحوصات يعرضه وحده) دون فتح
 * لوحته — البطاقة تمرّره دائمًا لأن كل بطاقة فحص واحد، وitemId يفتح اللوحة فوقه.
 */
export type RadiologySheetIntent = {
	tab?: RadiologySheetTab;
	itemId?: string | null;
	focusItemId?: string | null;
};

// الطلب المفتوح في لوحة التفاصيل — نخزّن المعرّف فقط والبيانات تُجلب طازجة
interface SelectedRadiologyOrderStore {
	selectedId: string | null;
	intent: RadiologySheetIntent;
	select: (id: string, intent?: RadiologySheetIntent) => void;
	close: () => void;
}

const DEFAULT_INTENT: RadiologySheetIntent = {
	tab: "details",
	itemId: null,
	focusItemId: null,
};

export const useSelectedRadiologyOrderStore = create<SelectedRadiologyOrderStore>()((set) => ({
	selectedId: null,
	intent: DEFAULT_INTENT,
	select: (id, intent) => set({ selectedId: id, intent: { ...DEFAULT_INTENT, ...intent } }),
	close: () => set({ selectedId: null, intent: DEFAULT_INTENT }),
}));
