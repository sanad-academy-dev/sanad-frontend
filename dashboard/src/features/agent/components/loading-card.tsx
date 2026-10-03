import { IconSparkles } from "@tabler/icons-react";

// حالة "قيد المعالجة" — مطابقة لتصميم Figma (frame 4090):
// عنوان "جاري العمل، يرجى الانتظار..." مع أيقونة، وأسفلها شريطا هيكل عظمي.
export const LoadingCard = () => (
	// المحتوى عربي دائمًا، لذا نثبّت الاتجاه RTL بغضّ النظر عن لغة الواجهة
	<div
		dir="rtl"
		className="flex w-full items-center rounded-[4px] bg-white py-[9px] pe-3 ps-px"
	>
		<div className="flex flex-1 flex-col items-start justify-center gap-2.5">
			{/* العنوان (يمين) + الأيقونة (يسار) */}
			<div className="flex items-center gap-2.5">
				<span className="text-[13px] font-semibold text-[#1a1a18]">
					جاري العمل، يرجى الانتظار...
				</span>
				<IconSparkles className="size-5 text-primary" />
			</div>

			{/* شريطا الهيكل العظمي */}
			<div className="flex w-full flex-col gap-2">
				<div className="h-3 w-full animate-pulse rounded-full bg-[#e3e1e1] opacity-70" />
				<div className="h-3 w-[85%] animate-pulse rounded-full bg-[#e3e1e1] opacity-70" />
			</div>
		</div>
	</div>
);
