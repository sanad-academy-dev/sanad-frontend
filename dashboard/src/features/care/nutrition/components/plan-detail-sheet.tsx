import {
	IconBan,
	IconCircleCheck,
	IconEdit,
	IconPlayerPlay,
	IconPrinter,
	IconScaleOutline,
} from "@tabler/icons-react";
import { useState } from "react";
import { FormHeader } from "@/components/common/form-header";
import { RequiredMark } from "@/components/common/required-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { WeightTrend } from "@/features/care/nutrition/components/weight-trend";
import {
	useNutritionMutations,
	useNutritionPlan,
	useWeightHistory,
} from "@/features/care/nutrition/hooks/use-nutrition";
import { printNutritionPlan } from "@/features/care/nutrition/utils/print-nutrition-plan";
import {
	ACTIVITY_LABELS,
	FEEDING_METHOD_LABELS,
	FOOD_FORM_LABELS,
	GOAL_LABELS,
	LIFE_STAGE_LABELS,
	MCS_LABELS,
	PLAN_STATUS_LABELS,
	RECHECK_OUTCOME_LABELS,
} from "@sanad/contracts/runtime/server/nutrition/nutrition.type";

const dateFmt = new Intl.DateTimeFormat("ar", { dateStyle: "medium" });
const at = (v: Date | string | null | undefined) => (v ? dateFmt.format(new Date(v)) : "—");
const num = (v: unknown) => (v == null ? "—" : String(Number(v)));

function Row({ label, value }: { label: string; value: string }) {
	return (
		// التسمية أولًا (يمين في RTL) ثم القيمة — بلا flex-1 يفصلهما
		<div className="flex items-baseline justify-between gap-3 text-sm">
			<span className="shrink-0 text-muted-foreground">{label}</span>
			<span className="text-end tabular-nums">{value}</span>
		</div>
	);
}

export function PlanDetailSheet({
	open,
	onOpenChange,
	planId,
	clinicName,
	onEdit,
	onRecheck,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	planId?: string;
	clinicName: string;
	onEdit: (planId: string) => void;
	onRecheck: (planId: string) => void;
}) {
	const { plan, isLoading } = useNutritionPlan(planId);
	const { points } = useWeightHistory(plan?.patient.id);
	const { activatePlan, completePlan, discontinuePlan, isPending } = useNutritionMutations();

	const [reason, setReason] = useState("");
	const [confirmStop, setConfirmStop] = useState(false);

	if (!plan) {
		return (
			<Sheet
				open={open}
				onOpenChange={onOpenChange}
			>
				<SheetContent
					side="left"
					showCloseButton={false}
					className="w-full gap-0 p-0 sm:max-w-2xl!"
				>
					<FormHeader
						title="خطة التغذية"
						onClose={() => onOpenChange(false)}
					/>
					<div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
						{isLoading ? "جارٍ التحميل..." : "الخطة غير موجودة"}
					</div>
				</SheetContent>
			</Sheet>
		);
	}

	const isDraft = plan.status === "DRAFT";
	const isActive = plan.status === "ACTIVE";
	const isWeightProgram = plan.goal === "WEIGHT_LOSS" || plan.goal === "WEIGHT_GAIN";

	return (
		<Sheet
			open={open}
			onOpenChange={onOpenChange}
		>
			<SheetContent
				side="left"
				showCloseButton={false}
				className="w-full gap-0 p-0 sm:max-w-2xl!"
			>
				<FormHeader
					title="خطة التغذية"
					identity={{ name: plan.patient.name, code: plan.code }}
					changesCount={plan.editsCount}
					onClose={() => onOpenChange(false)}
					actions={
						<>
							<Button
								variant="ghost"
								size="icon-sm"
								title="طباعة نشرة وليّ الأمر"
								onClick={() => printNutritionPlan(plan, clinicName)}
							>
								<IconPrinter className="size-4" />
							</Button>
							{isDraft && (
								<Button
									variant="ghost"
									size="icon-sm"
									title="تعديل"
									onClick={() => onEdit(plan.id)}
								>
									<IconEdit className="size-4" />
								</Button>
							)}
						</>
					}
				/>

				<div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
					<div className="flex flex-wrap items-center gap-2">
						<Badge variant={isActive ? "default" : isDraft ? "outline" : "secondary"}>
							{PLAN_STATUS_LABELS[plan.status]}
						</Badge>
						<Badge variant="outline">{GOAL_LABELS[plan.goal]}</Badge>
						{plan.draftedByAi && <Badge variant="secondary">مسودّة آلية</Badge>}
						{plan.prescriber && (
							<span className="text-xs text-muted-foreground">
								وصفها {plan.prescriber.name}
							</span>
						)}
					</div>

					{/* الحساب معروضًا كسلسلة — الرقم واشتقاقه معًا، كما في شاشة الإنشاء */}
					<div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
						<div className="rounded-[4px] border bg-muted/30 px-3 py-2">
							<div className="text-[11px] text-muted-foreground">وزن الحساب</div>
							<div className="text-sm font-semibold tabular-nums">
								{num(plan.calculationWeightKg)} كجم
							</div>
						</div>
						<div className="rounded-[4px] border bg-muted/30 px-3 py-2">
							<div className="text-[11px] text-muted-foreground">RER</div>
							<div className="text-sm font-semibold tabular-nums">{num(plan.rerKcal)}</div>
						</div>
						<div className="rounded-[4px] border bg-muted/30 px-3 py-2">
							<div className="text-[11px] text-muted-foreground">
								المعامل ({plan.derFactorSource === "manual" ? "يدوي" : "آلي"})
							</div>
							<div className="text-sm font-semibold tabular-nums">× {num(plan.derFactor)}</div>
						</div>
						<div className="rounded-[4px] border border-primary/40 bg-primary/5 px-3 py-2">
							<div className="text-[11px] text-muted-foreground">طاقة اليوم</div>
							<div className="text-base font-semibold tabular-nums text-primary">
								{num(plan.derKcal)}
							</div>
						</div>
					</div>

					{points.length > 1 && (
						<WeightTrend
							points={points}
							idealWeightKg={plan.idealWeightKg ? Number(plan.idealWeightKg) : null}
						/>
					)}

					<Separator />

					<div className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
						<Row
							label="الوزن الحالي"
							value={`${num(plan.currentWeightKg)} كجم`}
						/>
						<Row
							label="الوزن المثالي"
							value={plan.idealWeightKg ? `${num(plan.idealWeightKg)} كجم` : "—"}
						/>
						<Row
							label="درجة حالة الجسم"
							value={plan.bodyConditionScore ? `${plan.bodyConditionScore} / ٩` : "—"}
						/>
						<Row
							label="الكتلة العضلية"
							value={plan.muscleConditionScore ? MCS_LABELS[plan.muscleConditionScore] : "—"}
						/>
						<Row
							label="المرحلة العمرية"
							value={LIFE_STAGE_LABELS[plan.lifeStage]}
						/>
						<Row
							label="النشاط"
							value={ACTIVITY_LABELS[plan.activity]}
						/>
						<Row
							label="الخصاء"
							value={plan.isNeutered ? "خصيّ" : "سليم"}
						/>
						<Row
							label="أسلوب التغذية"
							value={`${FEEDING_METHOD_LABELS[plan.feedingMethod]} · ${plan.mealsPerDay} وجبات`}
						/>
						{isWeightProgram && (
							<>
								<Row
									label="المعدّل الأسبوعي"
									value={`${num(plan.targetWeeklyRatePercent)}٪`}
								/>
								<Row
									label="المدّة المتوقّعة"
									value={plan.estimatedWeeks ? `${plan.estimatedWeeks} أسبوعًا` : "—"}
								/>
							</>
						)}
						<Row
							label="المراجعة كل"
							value={`${plan.recheckIntervalDays} يومًا`}
						/>
						<Row
							label="الموعد القادم"
							value={at(plan.nextRecheckAt)}
						/>
					</div>

					{plan.riskFactors.length > 0 && (
						<div className="flex flex-col gap-1.5">
							<span className="text-xs font-semibold">عوامل الخطر</span>
							<div className="flex flex-wrap gap-1.5">
								{plan.riskFactors.map((factor) => (
									<Badge
										key={factor}
										variant="outline"
									>
										{factor}
									</Badge>
								))}
							</div>
						</div>
					)}

					<Separator />

					<div className="flex flex-col gap-2">
						<span className="text-sm font-semibold">الأغذية الموصوفة</span>
						{plan.items.length === 0 ? (
							<p className="text-xs text-muted-foreground">لا أغذية موصوفة</p>
						) : (
							plan.items.map((item) => (
								<div
									key={item.id}
									className="flex items-center justify-between gap-3 rounded-[4px] border px-3 py-2"
								>
									<div className="flex min-w-0 flex-col">
										<span className="truncate text-sm font-medium">
											{item.nameSnapshot}
											{item.isTreat && (
												<Badge
													variant="secondary"
													className="ms-1.5"
												>
													مكافآت
												</Badge>
											)}
										</span>
										<span className="text-xs text-muted-foreground">
											{FOOD_FORM_LABELS[item.formSnapshot]} ·{" "}
											{num(item.energyDensityKcalPerKgSnapshot)} سعرة/كجم ·{" "}
											{num(item.energySharePercent)}٪ من الطاقة
										</span>
									</div>
									<div className="shrink-0 text-end tabular-nums">
										<div className="text-sm font-semibold">{num(item.gramsPerDay)} جم/يوم</div>
										<div className="text-xs text-muted-foreground">
											{num(item.kcalPerDay)} سعرة
										</div>
									</div>
								</div>
							))
						)}
					</div>

					{plan.feedingInstructions && (
						<>
							<Separator />
							<div className="flex flex-col gap-1.5">
								<span className="text-sm font-semibold">تعليمات وليّ الأمر</span>
								<p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
									{plan.feedingInstructions}
								</p>
							</div>
						</>
					)}

					{plan.rechecks.length > 0 && (
						<>
							<Separator />
							<div className="flex flex-col gap-2">
								<span className="text-sm font-semibold">
									المراجعات ({plan.rechecks.length})
								</span>
								{plan.rechecks.map((recheck) => (
									<div
										key={recheck.id}
										className="flex flex-col gap-1 rounded-[4px] border px-3 py-2"
									>
										<div className="flex flex-wrap items-center gap-2">
											<span className="text-sm font-medium tabular-nums">
												{num(recheck.weightKg)} كجم
											</span>
											{recheck.outcome && (
												<Badge variant="outline">
													{RECHECK_OUTCOME_LABELS[recheck.outcome]}
												</Badge>
											)}
											{recheck.weeklyRatePercent != null && (
												<span className="text-xs tabular-nums text-muted-foreground">
													{num(recheck.weeklyRatePercent)}٪ أسبوعيًا
												</span>
											)}
											<span className="text-xs text-muted-foreground">
												{at(recheck.recheckedAt)}
											</span>
										</div>
										{recheck.adjustmentReason && (
											<p className="text-xs leading-relaxed text-muted-foreground">
												{recheck.adjustmentReason}
											</p>
										)}
										{recheck.newDerKcal != null && Number(recheck.adjustmentPercent) !== 0 && (
											<p className="text-xs tabular-nums">
												السعرات ← {num(recheck.newDerKcal)} (
												{Number(recheck.adjustmentPercent) > 0 ? "+" : ""}
												{num(recheck.adjustmentPercent)}٪)
											</p>
										)}
									</div>
								))}
							</div>
						</>
					)}

					{plan.status === "DISCONTINUED" && plan.discontinueReason && (
						<div className="rounded-[4px] border border-red-200 bg-red-50 p-3 text-xs text-red-900">
							أُوقفت في {at(plan.discontinuedAt)} — {plan.discontinueReason}
						</div>
					)}

					{confirmStop && (
						<div className="flex flex-col gap-2 rounded-[4px] border border-red-200 bg-red-50 p-3">
							<Label className="justify-start gap-1.5 text-xs">
								سبب الإيقاف
								<RequiredMark />
							</Label>
							<Input
								value={reason}
								onChange={(e) => setReason(e.target.value)}
								placeholder="تغيّر الحالة، رفض الطفل الغذاء، انتقال وليّ الأمر..."
							/>
							<div className="flex items-center gap-2">
								<Button
									size="sm"
									variant="destructive"
									disabled={!reason.trim() || isPending}
									onClick={async () => {
										await discontinuePlan({ id: plan.id, reason: reason.trim() });
										setConfirmStop(false);
										setReason("");
									}}
								>
									تأكيد الإيقاف
								</Button>
								<Button
									size="sm"
									variant="ghost"
									onClick={() => setConfirmStop(false)}
								>
									تراجع
								</Button>
							</div>
						</div>
					)}
				</div>

				{/* الإجراءات — التفعيل والمراجعة والإنهاء، كلٌّ في حالته فقط */}
				<div className="flex shrink-0 items-center justify-between gap-3 border-t px-4 py-2">
					<span className="text-xs text-muted-foreground">أُنشئت {at(plan.createdAt)}</span>
					<div className="flex items-center gap-2">
						{isActive && (
							<Button
								size="sm"
								variant="ghost"
								disabled={isPending}
								onClick={() => setConfirmStop(true)}
							>
								<IconBan className="size-4" />
								إيقاف
							</Button>
						)}
						{isActive && (
							<Button
								size="sm"
								variant="outline"
								disabled={isPending}
								onClick={() => void completePlan(plan.id)}
							>
								<IconCircleCheck className="size-4" />
								إنهاء
							</Button>
						)}
						{isActive && (
							<Button
								size="sm"
								disabled={isPending}
								onClick={() => onRecheck(plan.id)}
							>
								<IconScaleOutline className="size-4" />
								تسجيل مراجعة
							</Button>
						)}
						{isDraft && (
							<Button
								size="sm"
								disabled={isPending || plan.items.length === 0}
								title={
									plan.items.length === 0 ? "أضِف غذاءً واحدًا على الأقل قبل التفعيل" : undefined
								}
								onClick={() => void activatePlan(plan.id)}
							>
								<IconPlayerPlay className="size-4" />
								تفعيل الخطة
							</Button>
						)}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
