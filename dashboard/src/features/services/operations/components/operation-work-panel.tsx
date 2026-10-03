import {
	IconArrowLeft,
	IconArrowRight,
	IconBed,
	IconCircleCheck,
	IconClipboardCheck,
	IconClipboardList,
	IconClock,
	IconDoorExit,
	IconFileText,
	IconHeartRateMonitor,
	IconInfoCircle,
	IconLock,
	IconMessage,
	IconNeedleThread,
	IconScissors,
	IconShieldCheck,
	IconStethoscope,
	IconVaccine,
	IconX,
} from "@tabler/icons-react";
import { useCallback, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Stepper,
	StepperIndicator,
	StepperItem,
	StepperNav,
	StepperSeparator,
	StepperTitle,
	StepperTrigger,
} from "@/components/ui/stepper";
import { ConsumablesSection } from "@/features/services/operations/components/operation-billing-tab";
import { OperationIntraopTab } from "@/features/services/operations/components/operation-intraop-tab";
import {
	OperationChecklistsSection,
	OperationPrepSection,
} from "@/features/services/operations/components/operation-prep-sections";
import { OperationRecoveryTab } from "@/features/services/operations/components/operation-recovery-tab";
import { OperationSummaryReport } from "@/features/services/operations/components/operation-summary-report";
import {
	useAdvanceStage,
	useMoveOperation,
} from "@/features/services/operations/hooks/use-operation-mutations";

import { OperationStage, OperationStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import type { OperationCaseDetailResponse } from "@/server/operations/operations.type";
import {
	nextOperationStage,
	OPERATION_GATE_BLOCKED_MESSAGES,
	OPERATION_STAGE_LABELS,
	OPERATION_STATUS_LABELS,
	OPERATION_TIER_LABELS,
	type OperationGateContext,
	operationPathwayFor,
	operationStagesFor,
	previousOperationStage,
	unmetOperationStageGate,
} from "@sanad/contracts/runtime/server/operations/operations.workflow";

// لوحة سير العمل الجراحي — الشريط الجانبي المنزلق داخل لوحة الحالة (نظيرة
// لوحة الفحص المفرد في الأشعة): مُدرِّج المراحل وجسم كل مرحلة وتذييل الإجراءات.
// الخادم يفرض البوابات G1–G10 — الرسائل تظهر كما هي عند الرفض.

const STAGE_ICONS: Record<OperationStage, typeof IconClipboardList> = {
	[OperationStage.CONSENT]: IconFileText,
	[OperationStage.FASTING_CHECK]: IconClock,
	[OperationStage.ASSESSMENT]: IconStethoscope,
	[OperationStage.PREMED]: IconVaccine,
	[OperationStage.SIGN_IN]: IconClipboardCheck,
	[OperationStage.INDUCTION]: IconVaccine,
	[OperationStage.MAINTENANCE]: IconHeartRateMonitor,
	[OperationStage.TIME_OUT]: IconShieldCheck,
	[OperationStage.IN_PROGRESS]: IconScissors,
	[OperationStage.CLOSING]: IconNeedleThread,
	[OperationStage.SIGN_OUT]: IconClipboardList,
	[OperationStage.MONITORING]: IconBed,
	[OperationStage.READY_FOR_DISCHARGE]: IconDoorExit,
};

// الترقيم متصل عبر المسار كله فلا يعود العدّاد إلى ١ بين الحالات
const STAGE_ORDER = Object.values(OperationStage);

export function OperationWorkPanel({
	operationCase: c,
	open,
	onClose,
	commentsOpen = false,
	onToggleComments,
}: {
	operationCase: OperationCaseDetailResponse;
	open: boolean;
	onClose: () => void;
	/** فتح التعليقات يُقلّص لوحة الحالة، فتنزاح هذه اللوحة ويظهر عمودها */
	commentsOpen?: boolean;
	onToggleComments?: () => void;
}) {
	const { moveOperation, isPending: isMovingStatus } = useMoveOperation();
	const { advanceStage, isPending: isMovingStage } = useAdvanceStage();

	// حفظ المرحلة الظاهرة — تسجّله المرحلة ويستدعيه «التالي» قبل التقدّم (نمط الأشعة)
	const saveRef = useRef<(() => Promise<unknown>) | null>(null);
	const registerSave = useCallback((fn: (() => Promise<unknown>) | null) => {
		saveRef.current = fn;
	}, []);

	if (!open) return null;

	/** حفظ المرحلة الظاهرة ثم الانتقال — فشل الحفظ يوقف الانتقال */
	const saveThen = async (move: () => Promise<unknown>) => {
		try {
			if (saveRef.current) await saveRef.current();
			await move();
		} catch {
			// التوست يُدار داخل الخطّافات
		}
	};

	const isBusy = isMovingStatus || isMovingStage;
	const isFinished =
		c.status === OperationStatus.COMPLETED || c.status === OperationStatus.CANCELLED;
	const pathway = operationPathwayFor(c.tier);
	const pathwayIndex = pathway.indexOf(c.status);
	const nextStatus =
		pathwayIndex >= 0 && pathwayIndex < pathway.length - 1 ? pathway[pathwayIndex + 1] : null;

	// خطوات الحالة الحالية — لكل حالة مراحلها الفرعية وحدها، والترقيم متصل
	const stageScope = operationStagesFor(c.status, c.tier);
	const stageSteps = stageScope.map((stage) => ({
		step: STAGE_ORDER.indexOf(stage) + 1,
		stage,
		title: OPERATION_STAGE_LABELS[stage],
		icon: STAGE_ICONS[stage],
	}));
	const currentStep = stageSteps.find((s) => s.stage === c.stage)?.step ?? 1;

	// لا تخطّي مرحلة قبل استيفاء متطلباتها — نفس منطق الخادم، والخادم يبقى الحكم
	const gateContext: OperationGateContext = {
		sedationPlanned: c.plannedAnesthesia !== "NONE",
	};
	const unmetGate = unmetOperationStageGate(c, c.tier, c.status, c.stage, gateContext);
	const unmetGateMessage = unmetGate ? OPERATION_GATE_BLOCKED_MESSAGES[unmetGate] : null;

	const goNextStage = () => {
		// الحفظ أولًا ثم يحكم الخادم بالبوابة — فحص الواجهة المسبق كان يحجب
		// قيم النموذج غير المحفوظة فيمنع التقدّم رغم تعبئة الحقول
		void saveThen(() => advanceStage({ id: c.id, direction: "next" }));
	};
	const goPreviousStage = () => {
		void saveThen(() => advanceStage({ id: c.id, direction: "previous" }));
	};
	/** الانتقال من المُدرِّج — خطوة واحدة فقط */
	const goToStep = (target: number) => {
		if (target === currentStep || Math.abs(target - currentStep) !== 1) return;
		void saveThen(() =>
			advanceStage({
				id: c.id,
				direction: target > currentStep ? "next" : "previous",
			}),
		);
	};
	const goNextStatus = () => {
		if (!nextStatus) return;
		void saveThen(() => moveOperation({ id: c.id, to: nextStatus }));
	};

	/** جسم المرحلة الظاهرة — أقسام التحضير والقوائم وسجلّا العملية والإفاقة */
	const stageBody = (() => {
		// الحالة المنتهية تُقرأ لا تُعمل — ملخّص كامل مكان أدوات المراحل
		if (isFinished) return <OperationSummaryReport operationCase={c} />;
		if (c.status === OperationStatus.SCHEDULED) return null;
		switch (c.stage) {
			case OperationStage.CONSENT:
				return (
					<OperationPrepSection
						operationCase={c}
						section="consents"
					/>
				);
			case OperationStage.FASTING_CHECK:
				return (
					<OperationPrepSection
						operationCase={c}
						section="fasting"
						registerSave={registerSave}
					/>
				);
			case OperationStage.ASSESSMENT:
				return (
					<OperationPrepSection
						operationCase={c}
						section="assessment"
						registerSave={registerSave}
					/>
				);
			case OperationStage.PREMED:
				return (
					<OperationPrepSection
						operationCase={c}
						section="premed"
						registerSave={registerSave}
					/>
				);
			case OperationStage.SIGN_IN:
				return (
					<OperationChecklistsSection
						operationCase={c}
						activeScope={c.tier === "MINOR" ? "OPERATION_MINOR_COMBINED" : "OPERATION_SIGN_IN"}
					/>
				);
			case OperationStage.TIME_OUT:
				return (
					<OperationChecklistsSection
						operationCase={c}
						activeScope="OPERATION_TIME_OUT"
					/>
				);
			// لكل خطوة أدواتها وحدها — النموذج المكرر أوهم المستخدمين أن الخطوة لم تتغير
			case OperationStage.INDUCTION:
				return (
					<OperationIntraopTab
						operationCase={c}
						part="induction"
					/>
				);
			case OperationStage.MAINTENANCE:
				return (
					<OperationIntraopTab
						operationCase={c}
						part="maintenance"
					/>
				);
			case OperationStage.IN_PROGRESS:
				return (
					<OperationIntraopTab
						operationCase={c}
						part="surgery"
					/>
				);
			case OperationStage.CLOSING:
				return (
					<OperationIntraopTab
						operationCase={c}
						part="closing"
						registerSave={registerSave}
					/>
				);
			case OperationStage.SIGN_OUT:
				return (
					<div className="flex flex-col gap-4">
						<OperationChecklistsSection
							operationCase={c}
							activeScope="OPERATION_SIGN_OUT"
						/>
						<Separator />
						{/* مراجعة المستهلكات النهائية — العدة والمحروقات والإضافي تُعدّل قبل الختام */}
						<ConsumablesSection operationCase={c} />
					</div>
				);
			case OperationStage.MONITORING:
				return (
					<OperationRecoveryTab
						operationCase={c}
						part="monitoring"
					/>
				);
			case OperationStage.READY_FOR_DISCHARGE:
				return (
					<OperationRecoveryTab
						operationCase={c}
						part="discharge"
					/>
				);
			default:
				break;
		}
		// حالات بلا مراحل فرعية: الخروج والمتابعة تعملان على أوامر ما بعد الجراحة
		if (c.status === OperationStatus.DISCHARGE || c.status === OperationStatus.FOLLOW_UP) {
			return (
				<OperationRecoveryTab
					operationCase={c}
					part="discharge"
				/>
			);
		}
		return null;
	})();

	/** تذييل الإجراءات حسب الحالة والمرحلة */
	const footer = (() => {
		// المنتهية بلا إجراءات — الملخّص يحمل زر الطباعة بنفسه
		if (isFinished) return null;

		if (c.status === OperationStatus.SCHEDULED) {
			return (
				<Button
					size="sm"
					className="gap-1.5 bg-indigo-600 primaryhover:bg-indigo-700"
					disabled={isBusy}
					onClick={goNextStatus}
				>
					بدء التحضير
				</Button>
			);
		}

		const next = c.stage ? nextOperationStage(c.status, c.tier, c.stage) : null;
		const previous = c.stage ? previousOperationStage(c.status, c.tier, c.stage) : null;
		return (
			<>
				{previous && (
					<Button
						size="sm"
						variant="outline"
						className="gap-1"
						disabled={isBusy}
						onClick={goPreviousStage}
					>
						<IconArrowRight className="size-3.5 rtl:rotate-180" />
						السابق
					</Button>
				)}
				{next ? (
					<Button
						size="sm"
						className="gap-1 bg-indigo-600 primaryhover:bg-indigo-700"
						disabled={isBusy}
						onClick={goNextStage}
					>
						التالي: {OPERATION_STAGE_LABELS[next]}
						<IconArrowLeft className="size-3.5 rtl:rotate-180" />
					</Button>
				) : nextStatus ? (
					<Button
						size="sm"
						className="gap-1.5 bg-indigo-600 primaryhover:bg-indigo-700"
						disabled={isBusy}
						onClick={goNextStatus}
					>
						<IconCircleCheck className="size-3.5" />
						الانتقال إلى «{OPERATION_STATUS_LABELS[nextStatus]}»
					</Button>
				) : null}
			</>
		);
	})();

	return (
		<aside
			dir="rtl"
			aria-label="لوحة سير العمل الجراحي"
			className={cn(
				"fixed inset-y-2 z-50 flex flex-col gap-0 rounded-lg border bg-popover text-sm text-popover-foreground shadow-lg",
				// تنزلق مع تقلّص لوحة الحالة بدل أن تقفز — نفس مدّة حركة اللوحة
				"transition-[left,right] duration-300 ease-out",
				commentsOpen
					? "left-[calc(50%+1rem)] right-[25%]"
					: "left-[calc(66.6667%+1rem)] right-2",
			)}
		>
			{/* الترويسة — الإجراءات والحالة وزر التعليقات */}
			<div className="flex items-center justify-between gap-2 border-b px-4 py-2">
				<div className="flex min-w-0 items-center gap-2">
					<h2 className="truncate text-base font-bold">
						{c.procedures.map((p) => p.nameSnapshot).join("، ") || c.code}
					</h2>
					<Badge
						variant="outline"
						className="shrink-0 text-[10px]"
					>
						{OPERATION_TIER_LABELS[c.tier]}
					</Badge>
					<span className="shrink-0 text-xs tabular-nums text-muted-foreground">{c.code}</span>
					{/* زر التعليقات — يفتح عمود تعليقات الحالة، كلوحتي التحاليل والأشعة */}
					{onToggleComments && (
						<Button
							size="sm"
							variant={commentsOpen ? "secondary" : "outline"}
							className="h-7 shrink-0 gap-1.5 text-xs font-normal"
							aria-pressed={commentsOpen}
							onClick={onToggleComments}
						>
							<IconMessage className="size-3.5" />
							التعليقات
							{c.comments.length > 0 && (
								<span className="inline-flex h-4 min-w-4 items-center justify-center rounded bg-muted px-1 text-[10px] font-medium tabular-nums text-muted-foreground">
									{c.comments.length}
								</span>
							)}
						</Button>
					)}
				</div>
				<Button
					size="icon"
					variant="ghost"
					className="size-8"
					aria-label="إغلاق لوحة سير العمل"
					onClick={onClose}
				>
					<IconX className="size-4" />
				</Button>
			</div>

			<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
				{/* حالة اللوحة الحالية */}
				<div className="flex items-center justify-between gap-2 rounded-md border bg-muted/30 p-3">
					<p className="flex items-center gap-1.5 text-xs text-muted-foreground">
						<IconInfoCircle className="size-4 shrink-0" />
						الحالة: {OPERATION_STATUS_LABELS[c.status]}
						{c.stage ? ` — ${OPERATION_STAGE_LABELS[c.stage]}` : ""}
					</p>
					<Badge
						variant="outline"
						className="shrink-0 text-[10px]"
					>
						{OPERATION_STATUS_LABELS[c.status]}
					</Badge>
				</div>

				{c.status === OperationStatus.SCHEDULED && (
					<p className="flex items-center gap-1.5 rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
						<IconInfoCircle className="size-4 shrink-0" />
						الحالة مجدولة — «بدء التحضير» يفتح مسار الموافقات والتقييم وقوائم الأمان.
					</p>
				)}

				{/* مُدرِّج المراحل — نفس مُدرِّج التحاليل والأشعة: ترقيم متصل وأيقونة لكل مرحلة */}
				{stageSteps.length > 0 && (
					<>
						<Stepper
							value={currentStep}
							onValueChange={(step) => goToStep(step)}
							className="flex flex-col"
						>
							<div className="shrink-0 overflow-x-auto pb-2">
								<StepperNav className="min-w-max flex-nowrap gap-3">
									{stageSteps.map((s, idx) => {
										const Icon = s.icon;
										const isDisabled = s.step > currentStep + 1;
										return (
											<StepperItem
												key={s.step}
												step={s.step}
												disabled={isDisabled}
												className="relative w-28 shrink-0 items-start"
											>
												<StepperTrigger
													className="flex grow flex-col items-start justify-center gap-2.5 rounded-md"
													disabled={isDisabled}
												>
													<StepperIndicator className="size-8 border-2 data-[state=inactive]:border-border data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground">
														<Icon className="size-4" />
													</StepperIndicator>
													<StepperTitle className="text-start text-sm font-semibold group-data-[state=inactive]/step:text-muted-foreground">
														{s.title}
													</StepperTitle>
												</StepperTrigger>
												{idx < stageSteps.length - 1 && (
													<StepperSeparator className="absolute inset-x-0 start-9 top-4 m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none group-data-[state=completed]/step:bg-primary" />
												)}
											</StepperItem>
										);
									})}
								</StepperNav>
							</div>
						</Stepper>

						<Separator />
					</>
				)}

				{/* جسم المرحلة الظاهرة */}
				{stageBody}
			</div>

			{footer && (
				<div className="flex items-center justify-between gap-2 border-t px-4 py-2">
					{/* سبب المنع مرئي دومًا — لا زر معطّل بلا تفسير */}
					{unmetGateMessage && footer ? (
						<p className="flex min-w-0 items-center gap-1 text-[11px] text-amber-700">
							<IconLock className="size-3.5 shrink-0" />
							<span className="truncate">{unmetGateMessage}</span>
						</p>
					) : (
						<span />
					)}
					<div className="flex shrink-0 items-center gap-2">{footer}</div>
				</div>
			)}
		</aside>
	);
}
