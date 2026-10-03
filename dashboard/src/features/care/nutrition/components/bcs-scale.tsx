import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { BCS_DESCRIPTIONS } from "@sanad/contracts/runtime/server/nutrition/nutrition-energy";

// مقياس درجة حالة الجسم (BCS) من ٩ نقاط — WSAVA.
//
// لماذا شريط لا قائمة منسدلة؟ لأن BCS مقياس متّصل لا مجموعة خيارات: المدرّب يرى
// موقع الطفل بين النحافة والسِّمنة، والقائمة تُخفي هذا الترتيب. اللون يحمل
// المعنى نفسه (أخضر = المدى المثالي ٤–٥) فيُقرأ الانحراف قبل قراءة الرقم.

const SCORES = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

/** ٤–٥ هو المدى المثالي؛ ما دونه نقص وما فوقه زيادة */
const toneFor = (score: number, selected: boolean) => {
	if (score >= 4 && score <= 5)
		return selected
			? "bg-emerald-600 primaryborder-emerald-600"
			: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100";
	if (score <= 3)
		return selected
			? "bg-sky-600 primaryborder-sky-600"
			: "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100";
	if (score <= 7)
		return selected
			? "bg-amber-500 primaryborder-amber-500"
			: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100";
	return selected
		? "bg-red-600 primaryborder-red-600"
		: "border-red-200 bg-red-50 text-red-700 hover:bg-red-100";
};

export function BcsScale({
	value,
	onChange,
	disabled,
	className,
}: {
	value: number | null | undefined;
	onChange: (score: number | null) => void;
	disabled?: boolean;
	className?: string;
}) {
	const selected = value ?? null;
	const description = selected ? BCS_DESCRIPTIONS[selected] : null;

	return (
		<div className={cn("flex flex-col gap-2", className)}>
			{/* في RTL أول عنصر يمين — والمقياس يُقرأ من ١ (نحيف) إلى ٩ (بدين) */}
			<TooltipProvider>
				<div className="flex items-center gap-1">
					{SCORES.map((score) => {
						const isSelected = selected === score;
						return (
							<Tooltip key={score}>
								<TooltipTrigger asChild>
									<button
										type="button"
										disabled={disabled}
										aria-pressed={isSelected}
										aria-label={`درجة ${score} — ${BCS_DESCRIPTIONS[score].label}`}
										// النقر على الدرجة المختارة يلغيها: BCS اختياري، والإلغاء
										// يجب أن يكون بنفس سهولة الاختيار
										onClick={() => onChange(isSelected ? null : score)}
										className={cn(
											"flex h-9 flex-1 items-center justify-center rounded-[4px] border text-sm font-semibold tabular-nums transition-colors disabled:opacity-50",
											toneFor(score, isSelected),
										)}
									>
										{score}
									</button>
								</TooltipTrigger>
								<TooltipContent
									dir="rtl"
									className="max-w-[280px]"
								>
									<p className="font-semibold">{BCS_DESCRIPTIONS[score].label}</p>
									<p className="text-xs leading-relaxed">{BCS_DESCRIPTIONS[score].detail}</p>
								</TooltipContent>
							</Tooltip>
						);
					})}
				</div>
			</TooltipProvider>

			{description ? (
				<p className="text-xs leading-relaxed text-muted-foreground">
					<span className="font-semibold text-foreground">{description.label}</span> —{" "}
					{description.detail}
				</p>
			) : (
				<p className="text-xs text-muted-foreground">
					اختر الدرجة من ١ (هزال) إلى ٩ (سِمنة مفرطة) — ٤ و٥ هما المدى المثالي
				</p>
			)}
		</div>
	);
}
