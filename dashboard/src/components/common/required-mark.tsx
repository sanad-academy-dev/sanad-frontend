import { cn } from "@/lib/utils";

/**
 * وسم «مطلوب» بجانب تسمية الحقل — بديل النجمة `*` في كل نماذج النظام.
 *
 * النجمة اصطلاح صامت: تعتمد على أن يعرف القارئ معناها، ولا يقرؤها قارئ الشاشة
 * كلمةً مفهومة. الوسم يقول الشرط صراحةً وبالعربية.
 *
 * كان مكرّرًا حرفيًا في ثلاثة نماذج (خطط الرعاية، الزيارات المتعدّدة، المصروفات)
 * قبل استخراجه هنا — نسخة واحدة تعني أن أي تعديل على الشكل يصل كل النماذج.
 * الاستعمال: داخل `<Label className="justify-start gap-1.5">` بعد نصّ التسمية.
 */
export function RequiredMark({ className }: { className?: string }) {
	return (
		<span
			className={cn(
				"rounded-[4px] bg-rose-600/[0.06] px-[4.5px] py-[1.5px] text-[8px] font-medium text-rose-600",
				className,
			)}
		>
			مطلوب
		</span>
	);
}
