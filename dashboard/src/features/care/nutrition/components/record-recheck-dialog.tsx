import { zodResolver } from "@hookform/resolvers/zod";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { RequiredMark } from "@/components/common/required-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BcsScale } from "@/features/care/nutrition/components/bcs-scale";
import {
	useNutritionMutations,
	useNutritionPlan,
} from "@/features/care/nutrition/hooks/use-nutrition";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import {
	GOAL_LABELS,
	MCS_LABELS,
	nutritionRecheckSchema,
	RECHECK_OUTCOME_LABELS,
} from "@sanad/contracts/runtime/server/nutrition/nutrition.type";
import { assessRecheck, energySpeciesOf } from "@sanad/contracts/runtime/server/nutrition/nutrition-energy";

// تسجيل مراجعة — وزنة واحدة، وقرار تعديل مبنيّ عليها.
//
// النظام يقترح التعديل من الوزن المقاس (مدى AAHA ‏٥–٢٠٪) ويعرض سببه قبل الحفظ.
// المدرّب يقبله أو يتجاوزه — لكنه لا يقرّر في فراغ: الرقم واشتقاقه أمامه معًا.

const toDateInput = (d: Date) =>
	`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const OUTCOME_TONE: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
	ON_TRACK: "default",
	GOAL_REACHED: "default",
	TOO_FAST: "destructive",
	TOO_SLOW: "secondary",
	STALLED: "secondary",
	REVERSED: "destructive",
};

export function RecordRecheckDialog({
	open,
	onOpenChange,
	planId,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	planId?: string;
}) {
	const { plan } = useNutritionPlan(planId);
	const { staff } = useStaff();
	const { recordRecheck, isPending } = useNutritionMutations();

	const {
		register,
		handleSubmit,
		control,
		watch,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(nutritionRecheckSchema),
		defaultValues: {
			weightKg: 0,
			recheckedAt: toDateInput(new Date()) as unknown as Date,
			applyAdjustment: true,
		},
	});

	const values = watch();

	useEffect(() => {
		if (!open) return;
		reset({
			weightKg: 0,
			recheckedAt: toDateInput(new Date()) as unknown as Date,
			applyAdjustment: true,
			bodyConditionScore: plan?.bodyConditionScore ?? null,
			muscleConditionScore: plan?.muscleConditionScore ?? null,
		});
	}, [open, plan, reset]);

	/**
	 * معاينة التقييم على العميل بالمحرّك نفسه الذي يقرّر على الخادم — لا نسخة
	 * ثانية من المنطق. الخادم يبقى الحَكَم؛ هذه معاينة تُري المدرّب النتيجة قبل
	 * الحفظ فلا يفاجئه رقم بعده.
	 */
	const preview = useMemo(() => {
		// `z.coerce` يجعل نوع دخل النموذج غير معروف — التحويل عند الاستعمال لا في المخطّط
		const weightKg = Number(values.weightKg);
		if (!plan || !weightKg || weightKg <= 0) return null;

		const previous = plan.rechecks[0];
		const previousWeightKg = previous
			? Number(previous.weightKg)
			: Number(plan.currentWeightKg);
		const previousAt = previous?.recheckedAt ?? plan.startedAt ?? plan.createdAt;
		const recheckedAt = values.recheckedAt ? new Date(String(values.recheckedAt)) : new Date();
		const daysElapsed = Math.max(
			0,
			Math.round((recheckedAt.getTime() - new Date(previousAt).getTime()) / 86_400_000),
		);

		return assessRecheck({
			// النوع من الطفل نفسه — بدونه تُقاس القطّة على مدى الكلب فتختلف
			// المعاينة عن قرار الخادم، وهو أسوأ من غياب المعاينة أصلًا
			species: energySpeciesOf(plan.patient.animalType?.species ?? null),
			goal: plan.goal,
			previousWeightKg,
			currentWeightKg: weightKg,
			idealWeightKg: plan.idealWeightKg ? Number(plan.idealWeightKg) : null,
			daysElapsed,
			currentDerKcal: Number(plan.derKcal),
			targetWeeklyRatePercent: plan.targetWeeklyRatePercent
				? Number(plan.targetWeeklyRatePercent)
				: null,
		});
	}, [plan, values.weightKg, values.recheckedAt]);

	const onSubmit = handleSubmit(async (formValues) => {
		if (!planId) return;
		await recordRecheck({
			id: planId,
			body: {
				...formValues,
				weightKg: Number(formValues.weightKg),
				recheckedAt: formValues.recheckedAt
					? new Date(formValues.recheckedAt).toISOString()
					: undefined,
			} as never,
		});
		onOpenChange(false);
	});

	const lastWeight = plan?.rechecks[0]
		? Number(plan.rechecks[0].weightKg)
		: plan
			? Number(plan.currentWeightKg)
			: null;
	const delta =
		lastWeight != null && values.weightKg ? Number(values.weightKg) - lastWeight : null;

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				showCloseButton={false}
				className="max-h-[90vh] gap-0 overflow-hidden p-0 sm:max-w-lg"
			>
				<FormHeader
					title="تسجيل مراجعة"
					variant="dialog"
					identity={plan ? { name: plan.patient.name, code: plan.patient.code } : null}
					onClose={() => onOpenChange(false)}
				/>

				<form onSubmit={onSubmit}>
					<div className="max-h-[60vh] space-y-4 overflow-y-auto p-4">
						{plan && (
							<div className="flex flex-wrap items-center gap-2 rounded-[4px] bg-muted/30 p-3 text-xs">
								<Badge variant="outline">{GOAL_LABELS[plan.goal]}</Badge>
								<span className="tabular-nums">
									آخر وزن {lastWeight} كجم
									{plan.idealWeightKg && ` · الهدف ${Number(plan.idealWeightKg)} كجم`}
								</span>
								<span className="tabular-nums">
									السعرات الحالية {Math.round(Number(plan.derKcal))}
								</span>
							</div>
						)}

						<div className="grid gap-3 sm:grid-cols-2">
							<Field data-invalid={!!errors.weightKg}>
								<Label className="justify-start gap-1.5">
									الوزن المقاس (كجم)
									<RequiredMark />
								</Label>
								<Input
									type="number"
									step="0.01"
									aria-invalid={!!errors.weightKg}
									{...register("weightKg")}
								/>
								<FieldError errors={[errors.weightKg]} />
								{delta != null && delta !== 0 && (
									<span
										className={`flex items-center gap-1 text-xs tabular-nums ${delta < 0 ? "text-emerald-600" : "text-amber-600"}`}
									>
										{delta < 0 ? (
											<IconTrendingDown className="size-3.5" />
										) : (
											<IconTrendingUp className="size-3.5" />
										)}
										{delta > 0 ? "+" : ""}
										{Math.round(delta * 100) / 100} كجم عن آخر قياس
									</span>
								)}
							</Field>

							<Field>
								<Label>تاريخ المراجعة</Label>
								<Input
									type="date"
									{...register("recheckedAt")}
								/>
							</Field>
						</div>

						<Controller
							name="bodyConditionScore"
							control={control}
							render={({ field }) => (
								<Field>
									<Label>درجة حالة الجسم (BCS)</Label>
									<BcsScale
										value={field.value as number | null}
										onChange={field.onChange}
									/>
								</Field>
							)}
						/>

						<div className="grid gap-3 sm:grid-cols-2">
							<Controller
								name="muscleConditionScore"
								control={control}
								render={({ field }) => (
									<Field>
										<Label>الكتلة العضلية</Label>
										<Select
											value={field.value ?? ""}
											onValueChange={field.onChange}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="غير مُقيَّمة" />
											</SelectTrigger>
											<SelectContent
												position="popper"
												dir="rtl"
											>
												{Object.entries(MCS_LABELS).map(([value, label]) => (
													<SelectItem
														key={value}
														value={value}
													>
														{label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Field>
								)}
							/>

							<Field>
								<Label>التزام وليّ الأمر (٪)</Label>
								<Input
									type="number"
									min={0}
									max={100}
									placeholder="كما أفاد به"
									{...register("ownerAdherence")}
								/>
							</Field>
						</div>

						{/* التقييم المقترح — الرقم وسببه معًا قبل القرار */}
						{preview && (
							<div className="flex flex-col gap-2 rounded-[4px] border p-3">
								<div className="flex flex-wrap items-center gap-2">
									<span className="text-xs font-semibold">التقييم المقترح</span>
									<Badge variant={OUTCOME_TONE[preview.outcome] ?? "outline"}>
										{RECHECK_OUTCOME_LABELS[preview.outcome]}
									</Badge>
									{preview.weeklyRatePercent != null && (
										<span className="text-xs tabular-nums text-muted-foreground">
											{preview.weeklyRatePercent}٪ أسبوعيًا
										</span>
									)}
								</div>
								<p className="text-xs leading-relaxed text-muted-foreground">
									{preview.reason}
								</p>
								{preview.adjustmentPercent !== 0 && (
									<p className="text-xs tabular-nums">
										السعرات: {Math.round(Number(plan?.derKcal ?? 0))} ←{" "}
										<span className="font-semibold">{Math.round(preview.newDerKcal)}</span> (
										{preview.adjustmentPercent > 0 ? "+" : ""}
										{preview.adjustmentPercent}٪)
									</p>
								)}
							</div>
						)}

						<div className="grid gap-3 sm:grid-cols-2">
							<Field>
								<Label>تعديل يدوي (٪)</Label>
								<Input
									type="number"
									step="1"
									placeholder="اتركه فارغًا لقبول المقترح"
									{...register("adjustmentPercent")}
								/>
							</Field>

							<Controller
								name="performedById"
								control={control}
								render={({ field }) => (
									<Field>
										<Label>نفّذها</Label>
										<Select
											value={field.value ?? ""}
											onValueChange={field.onChange}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="اختر الموظّف" />
											</SelectTrigger>
											<SelectContent
												position="popper"
												dir="rtl"
											>
												{staff.map((member) => (
													<SelectItem
														key={member.id}
														value={member.id}
													>
														{member.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Field>
								)}
							/>
						</div>

						<Field>
							<Label>سبب التعديل</Label>
							<Input
								placeholder="يُملأ آليًا من التقييم إن تُرك فارغًا"
								{...register("adjustmentReason")}
							/>
						</Field>

						<Field>
							<Label>ملاحظات</Label>
							<Textarea
								rows={2}
								{...register("notes")}
							/>
						</Field>
					</div>

					<FormFooter
						showShortcut
						extra={
							<Controller
								name="applyAdjustment"
								control={control}
								render={({ field }) => (
									<Label className="flex cursor-pointer items-center gap-2 font-normal text-muted-foreground">
										<Checkbox
											checked={field.value}
											onCheckedChange={(v) => field.onChange(v === true)}
										/>
										تطبيق التعديل على السعرات
									</Label>
								)}
							/>
						}
					>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => onOpenChange(false)}
							disabled={isPending}
						>
							إلغاء
						</Button>
						<Button
							type="submit"
							size="sm"
							disabled={isPending}
						>
							حفظ المراجعة
						</Button>
					</FormFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
