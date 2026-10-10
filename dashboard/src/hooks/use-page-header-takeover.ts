import { create } from "zustand";

// تسمح لصفحة بأخذ مكان بداية الهيدر العلوي (زر الشريط الجانبي + المسار) وعرض محتواها بدلًا منه.
// الصفحة تحقن محتواها في #page-header-slot وتُفعّل هذا المفتاح عند التركيب وتُطفئه عند المغادرة.
interface PageHeaderTakeoverStore {
	takeover: boolean;
	setTakeover: (takeover: boolean) => void;
	/**
	 * تُخفي عنوان الصفحة المشتق من آخر مقطع في المسار — دون إخفاء الهيدر كله.
	 *
	 * الهيدر يشتق عنوانه من آخر مقطع (`sidebar.items.<key>`)، وهذا يصيب الصفحات ذات
	 * المقاطع الديناميكية: `/management/reports/staff` يطابق مفتاح «الموارد البشرية»
	 * فيظهر عنوان لا علاقة له بالصفحة. الصفحة التي ترسم مسارها بنفسها في
	 * `#page-header-slot` ترفع هذه الراية فيصمت العنوان المشتق.
	 */
	titleSuppressed: boolean;
	setTitleSuppressed: (suppressed: boolean) => void;
}

export const usePageHeaderTakeover = create<PageHeaderTakeoverStore>()((set) => ({
	takeover: false,
	setTakeover: (takeover) => set({ takeover }),
	titleSuppressed: false,
	setTitleSuppressed: (titleSuppressed) => set({ titleSuppressed }),
}));
