import { IconSparkles } from "@tabler/icons-react";

import { Spinner } from "@/components/ui/spinner";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * زرّ الصياغة الآلية داخل الحقل — يجلس في الزاوية العليا المقابلة لبداية النصّ
 * (اليسار في RTL) فوق حافّة `Textarea`.
 *
 * المبدأ الحاكم: **الزرّ يُعطَّل حين لا تكفي المعطيات**، ويقول في تلميحه ما ينقص
 * بالضبط. زرّ متاح دائمًا يُنتج نصًّا مُلفَّقًا من فراغ، والمستخدم لا يعرف لماذا
 * خرج رديئًا؛ وزرّ معطَّل بلا سبب يبدو عطلًا. الاثنان يفقدان الثقة — فالتعطيل
 * مقرونًا بالسبب هو الحلّ الوحيد الذي يُعلّم المستخدم بدل أن يُحبطه.
 *
 * الحقل الحاوي يجب أن يكون `relative`، والنصّ يحتاج حشوة علوية تكفي الزرّ
 * (`pt-8` عادةً) كي لا يركب الزرّ على السطر الأول.
 */
export function AiFieldButton({
	onClick,
	/** ما ينقص لتوليد نتيجة جيّدة — فارغ يعني أن الزرّ مفعّل */
	missing = [],
	isPending,
	label = "صِغ لي",
	className,
	/**
	 * أيقونة بلا نصّ. النصّ داخل حقلٍ ضيّق يزاحم المحتوى ويثقل الزاوية، والتلميح
	 * يقول الغرض على أي حال — فالتسمية تبقى في `aria-label` وحدها.
	 */
	iconOnly = false,
	/**
	 * الزاوية. الافتراضي مقابل بداية النصّ (اليسار في RTL) كي لا يركب الزرّ على أول
	 * سطر؛ و`"start"` يضعه عند بدايته لمن أراد ذلك صراحةً.
	 */
	corner = "end",
}: {
	onClick: () => void;
	missing?: string[];
	isPending?: boolean;
	label?: string;
	className?: string;
	iconOnly?: boolean;
	corner?: "start" | "end";
}) {
	const blocked = missing.length > 0;
	const disabled = blocked || isPending;

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					{/* الغلاف يستقبل المؤشّر: الزرّ المعطَّل لا يُطلق أحداثًا، فبدونه
					    يصمت التلميح تمامًا عند الحالة التي يهمّ فيها أكثر */}
					<span
						className={cn(
							"absolute top-1.5 z-10 inline-flex",
							corner === "start" ? "ltr:left-1.5 rtl:right-1.5" : "ltr:right-1.5 rtl:left-1.5",
							className,
						)}
					>
						<button
							type="button"
							disabled={disabled}
							onClick={onClick}
							aria-label={blocked ? `${label} — غير متاح بعد` : label}
							className={cn(
								"inline-flex items-center rounded-[4px] font-medium text-[11px] transition-colors",
								// أيقونة وحدها ⇒ مربّع شفّاف بلا إطار: داخل حقلٍ ضيّق تُثقل الخلفية
								// والإطار الزاويةَ وتُنافس النصّ. ومع التسمية ⇒ زرّ بحدود.
								iconOnly ? "size-6 justify-center" : "h-6 gap-1 border px-2",
								disabled
									? cn(
											"cursor-not-allowed text-muted-foreground",
											!iconOnly && "border-border bg-muted/60",
										)
									: cn(
											"text-primary hover:bg-primary/10",
											!iconOnly && "border-primary/30 bg-primary/5",
										),
							)}
						>
							{isPending ? (
								<Spinner className="size-3" />
							) : (
								<IconSparkles className="size-3" />
							)}
							{!iconOnly && label}
						</button>
					</span>
				</TooltipTrigger>
				<TooltipContent
					dir="rtl"
					className="max-w-[260px]"
				>
					{blocked ? (
						<div className="flex flex-col gap-1">
							<p className="font-semibold">لتفعيل الصياغة الآلية أكمل:</p>
							<ul className="list-inside list-disc text-xs leading-relaxed">
								{missing.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
						</div>
					) : (
						<p className="text-xs leading-relaxed">
							يصوغ نصًّا من معطيات الخطة المسجّلة. مسودّة تُراجَع وتُحرَّر — لا تُحفظ آليًا.
						</p>
					)}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
