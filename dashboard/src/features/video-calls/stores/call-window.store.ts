import { create } from "zustand";

/**
 * نافذة المكالمة العائمة (نمط تيليجرام/واتساب): تُفتح فوق أي صفحة، تُسحب
 * بالمؤشر، وتُصغَّر لشريط صغير مع بقاء الصوت — تعيش في تخطيط الصفحات المحمية
 * فتصمد أثناء التنقل داخل النظام.
 */
interface CallWindowStore {
	/** قاعة LiveKit النشطة — null يعني لا مكالمة */
	room: string | null;
	/** عنوان يظهر في ترويسة النافذة (اسم المحادثة/الطرف الآخر) */
	title: string;
	minimized: boolean;
	open: (room: string, title: string) => void;
	minimize: () => void;
	restore: () => void;
	close: () => void;
}

export const useCallWindowStore = create<CallWindowStore>()((set) => ({
	room: null,
	title: "",
	minimized: false,
	open: (room, title) => set({ room, title, minimized: false }),
	minimize: () => set({ minimized: true }),
	restore: () => set({ minimized: false }),
	close: () => set({ room: null, title: "", minimized: false }),
}));
