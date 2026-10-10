import { IconAlertTriangle, IconFlame } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import type { NutritionCalculation } from "@/features/care/nutrition/hooks/use-nutrition";
import { cn } from "@/lib/utils";

// لوحة الحساب الحيّة — تعرض السلسلة كاملة: الوزن ← RER ← المعامل ← سعرات اليوم.
//
// لماذا تُعرض الخطوات لا النتيجة وحدها؟ لأن المدرّب يوقّع على الرقم ويسلّمه لوليّ أمر.
// رقم بلا اشتقاق مرئي لا يُراجَع — وهذا بالضبط ما يجعل حاسبات الويب غير صالحة
// للسجل السريري: تعطي ٦٣٠ ولا تقول لماذا.

// أرقام لاتينية مع tabular-nums — عُرف الجداول والبطاقات في هذا المستودع.
// خلط النظامين داخل البطاقة الواحدة (٨٦٦ بجانب 0.8) يقرأ كعطل لا كأسلوب.
const kcal = (value: number | null | undefined) =>
	value == null ? "—" : `${Math.round(value)} سعرة`;

const kg = (value: number | null | undefined) =>
	value == null ? "—" : `${Number(value)} كجم`;

function Step({
	label,
	value,
	hint,
	emphasis,
}: {
	label: string;
	value: string;
	hint?: string | null;
	emphasis?: boolean;
}) {
	return (
		<div
			className={cn(
				"flex flex-col gap-0.5 rounded-[4px] border px-3 py-2",
				emphasis ? "border-primary/40 bg-primary/5" : "bg-muted/30",
			)}
		>
			<span className="text-[11px] text-muted-foreground">{label}</span>
			<span
				className={cn(
					"font-semibold tabular-nums",
					emphasis ? "text-base text-primary" : "text-sm",
				)}
			>
				{value}
			</span>
			{hint && <span className="text-[11px] leading-tight text-muted-foreground">{hint}</span>}
		</div>
	);
}

export function EnergyPanel({
	calculation,
	isCalculating,
	className,
}: {
	calculation: NutritionCalculation | undefined;
	isCalculating?: boolean;
	className?: string;
}) {
	if (!calculation) {
		return (
			<div
				className={cn(
					"flex items-center justify-center rounded-[4px] border border-dashed px-4 py-8 text-sm text-muted-foreground",
					className,
				)}
			>
				أدخل الوزن والهدف والنشاط لعرض الحساب
			</div>
		);
	}

	const program = calculation.weightProgram;

	return (
		<div className={cn("flex flex-col gap-3", isCalculating && "opacity-60", className)}>
			<div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
				<Step
					label="وزن الحساب"
					value={kg(calculation.calculationWeightKg)}
					hint={
						calculation.calculationWeightBasis === "ideal"
							? "الوزن المثالي — لا الحالي"
							: "الوزن الحالي"
					}
				/>
				<Step
					label="طاقة الراحة (RER)"
					value={kcal(calculation.rerKcal)}
					hint="70 × الوزن^0.75"
				/>
				<Step
					label="المعامل"
					value={`× ${calculation.derFactor}`}
					hint={calculation.derFactorRationale}
				/>
				<Step
					label="طاقة اليوم"
					value={kcal(calculation.derKcal)}
					hint={`المكافآت ≤ ${Math.round(calculation.treatKcalAllowance)} سعرة`}
					emphasis
				/>
			</div>

			{/* المدى المرجعي — الرقم الواحد يُقرأ كيقين، والمدى يصارح بأنه تقدير */}
			<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
				<IconFlame className="size-3.5" />
				<span>
					المدى المرجعي للمعامل: {calculation.derFactorBand.min} –{" "}
					{calculation.derFactorBand.max}
				</span>
				{calculation.derFactorSource === "manual" && (
					<Badge variant="secondary">معامل يدوي</Badge>
				)}
				{calculation.estimatedBodyFatPercent != null && (
					<span>· دهن الجسم التقديري {calculation.estimatedBodyFatPercent}٪</span>
				)}
				{calculation.percentOverIdeal != null && calculation.percentOverIdeal !== 0 && (
					<span>
						· {calculation.percentOverIdeal > 0 ? "فوق" : "تحت"} المثالي{" "}
						{Math.abs(calculation.percentOverIdeal)}٪
					</span>
				)}
			</div>

			{program && (
				<div className="flex flex-col gap-2 rounded-[4px] border bg-muted/20 p-3">
					<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
						<span className="font-semibold">برنامج الوزن</span>
						<span className="tabular-nums">
							{program.weeklyRatePercent}٪ أسبوعيًا ({program.weeklyChangeKg} كجم)
						</span>
						<span className="tabular-nums">
							الإجمالي {Math.abs(program.totalChangeKg)} كجم
						</span>
						<span className="tabular-nums">
							المدّة المتوقّعة {program.estimatedWeeks} أسبوعًا
						</span>
					</div>

					{/* المحطّات — وليّ الأمر يحتاج أهدافًا وسيطة لا رقمًا نهائيًا بعيدًا */}
					<div className="flex flex-wrap gap-1.5">
						{program.milestones.map((milestone) => (
							<Badge
								key={milestone.week}
								variant="outline"
								className="tabular-nums font-normal"
							>
								أسبوع {milestone.week}: {milestone.weightKg} كجم
							</Badge>
						))}
					</div>
				</div>
			)}

			{calculation.warnings.length > 0 && (
				<ul className="flex flex-col gap-1.5 rounded-[4px] border border-amber-200 bg-amber-50 p-3">
					{calculation.warnings.map((warning) => (
						<li
							key={warning}
							className="flex items-start gap-2 text-xs leading-relaxed text-amber-900"
						>
							<IconAlertTriangle className="mt-px size-3.5 shrink-0" />
							<span>{warning}</span>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
