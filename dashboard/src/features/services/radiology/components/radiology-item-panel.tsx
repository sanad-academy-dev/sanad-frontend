import {
	IconAlertTriangleFilled,
	IconArrowLeft,
	IconArrowRight,
	IconCircleCheck,
	IconInfoCircle,
	IconMessage,
	IconX,
} from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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
import { RadiologyAcquisitionStep } from "@/features/services/radiology/components/radiology-acquisition-step";
import { RadiologyApproveDialog } from "@/features/services/radiology/components/radiology-approve-dialog";
import { RadiologyImageQc } from "@/features/services/radiology/components/radiology-image-qc";
import { RadiologyImageUpload } from "@/features/services/radiology/components/radiology-image-upload";
import { RadiologyMachineAssignment } from "@/features/services/radiology/components/radiology-machine-assignment";
import { RadiologyPrepSteps } from "@/features/services/radiology/components/radiology-prep-steps";
import { RadiologyReadySummary } from "@/features/services/radiology/components/radiology-ready-summary";
import { RadiologyRejectDialog } from "@/features/services/radiology/components/radiology-reject-dialog";
import { RadiologyReportEditor } from "@/features/services/radiology/components/radiology-report-editor";
import { RadiologyReportView } from "@/features/services/radiology/components/radiology-report-view";
import { RadiologyRescheduleDialog } from "@/features/services/radiology/components/radiology-reschedule-dialog";
import { RADIOLOGY_STAGE_ICONS } from "@/features/services/radiology/data/radiology-data";
import {
	useUpdateRadiologyStage,
	useUpdateRadiologyStatus,
} from "@/features/services/radiology/hooks/use-radiology-mutations";
import { formatScheduleLabel } from "@/features/services/radiology/utils/schedule-label";
import { RadiologyStage, RadiologyStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import {
	canLeaveRadiologyQueue,
	type RadiologyOrderResponse,
	radiologyPaymentBlockMessage,
	radiologyPaymentStatus,
} from "@sanad/contracts/runtime/server/radiology/radiology.type";
import {
	isRadiologyDue,
	nextRadiologyStage,
	previousRadiologyStage,
	RADIOLOGY_STAGE_LABELS,
	RADIOLOGY_STAGE_ORDER,
	RADIOLOGY_REVIEW_BLOCKED_MESSAGE as REVIEW_BLOCKED,
	STAGES_BY_RADIOLOGY_STATUS,
} from "@sanad/contracts/runtime/server/radiology/radiology.workflow";
import { MODALITY_META } from "@sanad/contracts/runtime/server/radiology/radiology-procedure.type";

// لوحة الفحص المفرد — الشريط الجانبي المنزلق داخل لوحة الطلب: مُدرِّج المراحل
// وجسم كل مرحلة وتذييل الإجراءات. لا أزرار حفظ داخل المراحل: «التالي» يستدعي
// الحفظ المسجَّل عبر registerSave ثم يتقدّم خطوة واحدة.

type SaveFn = (() => Promise<unknown>) | null;

export function RadiologyItemPanel({
	order,
	itemId,
	open,
	onClose,
	commentsOpen = false,
	onToggleComments,
}: {
	order: RadiologyOrderResponse;
	itemId: string | null;
	open: boolean;
	onClose: () => void;
	/** فتح التعليقات يُقلّص لوحة الطلب، فتنزاح هذه اللوحة ويظهر عمودها */
	commentsOpen?: boolean;
	onToggleComments?: () => void;
}) {
	const item = order.items.find((i) => i.id === itemId) ?? null;
	const { updateStatus, isPending: isMovingStatus } = useUpdateRadiologyStatus();
	const { updateStage, isPending: isMovingStage } = useUpdateRadiologyStage();
	const [approveOpen, setApproveOpen] = useState(false);
	const [rejectOpen, setRejectOpen] = useState(false);
	const [rescheduleOpen, setRescheduleOpen] = useState(false);

	// حفظ المرحلة الظاهرة — تسجّله المرحلة وتستدعيه أزرار التنقّل قبل التقدّم
	const saveRef = useRef<SaveFn>(null);
	const registerSave = useCallback((fn: SaveFn) => {
		saveRef.current = fn;
	}, []);

	const payment = radiologyPaymentStatus(order);

	// «مجدول» يتقدّم تلقائيًا إلى «تحضير الطفل» فور السداد — لكن لا قبل موعده:
	// الفحص المجدول لغدٍ يبقى مجدولًا وإن سُدِّد اليوم. الفنّي يبدأه يدويًا عند
	// الوصول المبكّر. مرة واحدة لكل فحص حتى لا يعيد فتح اللوحة نقل فحص أُعيد عمدًا.
	const autoStartedItemRef = useRef<string | null>(null);
	useEffect(() => {
		if (!open || !item) return;
		if (item.status !== RadiologyStatus.SCHEDULED) return;
		if (!canLeaveRadiologyQueue(payment)) return;
		if (!isRadiologyDue(item.scheduledAt)) return;
		if (autoStartedItemRef.current === item.id) return;
		autoStartedItemRef.current = item.id;
		void updateStatus({ itemId: item.id, status: RadiologyStatus.PREPARATION }).catch(
			() => {},
		);
	}, [open, item, payment, updateStatus]);

	// إغلاق اللوحة يحفظ المرحلة الظاهرة بصمت — كما تفعل لوحة التحاليل بالنتائج
	const handleClose = () => {
		void saveRef.current?.().catch(() => {});
		onClose();
	};

	if (!open || !item) return null;

	const isBusy = isMovingStatus || isMovingStage;
	const isDue = isRadiologyDue(item.scheduledAt);
	// خطوات المرحلة الحالية — لكل حالة مراحلها الفرعية وحدها، لكن الترقيم متصل
	// عبر المسار كله (١..٧) فلا يعود العدّاد إلى ١ حين ينتقل الفحص إلى التصوير
	const stageScope = STAGES_BY_RADIOLOGY_STATUS[item.status] ?? [];
	const stageSteps = stageScope.map((s) => ({
		step: RADIOLOGY_STAGE_ORDER.indexOf(s) + 1,
		stage: s,
		title: RADIOLOGY_STAGE_LABELS[s],
		icon: RADIOLOGY_STAGE_ICONS[s],
	}));
	const currentStep = stageSteps.find((s) => s.stage === item.stage)?.step ?? 1;
	const imagesCount = item.studies.reduce(
		(sum, study) => sum + study.series.reduce((s, series) => s + series.instances.length, 0),
		0,
	);

	/** حفظ المرحلة الظاهرة ثم تنفيذ الانتقال — الحفظ الفاشل يوقف الانتقال */
	const saveThen = async (move: () => Promise<unknown>) => {
		try {
			if (saveRef.current) await saveRef.current();
			await move();
		} catch {
			// التوست يُدار داخل الخطّافات
		}
	};

	const goNextStage = () => {
		const next = nextRadiologyStage(item.stage, item.status);
		if (!next) return;
		void saveThen(() => updateStage({ itemId: item.id, stage: next }));
	};

	/** الانتقال من المُدرِّج — خطوة واحدة فقط، والتقدّم يحفظ الخطوة الحالية */
	const goToStep = (target: number) => {
		if (target === currentStep || Math.abs(target - currentStep) !== 1) return;
		const targetStage = stageSteps.find((s) => s.step === target)?.stage;
		if (!targetStage) return;
		void saveThen(() => updateStage({ itemId: item.id, stage: targetStage }));
	};

	const goPreviousStage = () => {
		const previous = previousRadiologyStage(item.stage, item.status);
		if (!previous) return;
		void saveThen(() => updateStage({ itemId: item.id, stage: previous }));
	};

	const sendToImaging = () =>
		void saveThen(() => updateStatus({ itemId: item.id, status: RadiologyStatus.IMAGING }));

	const sendToReporting = () => {
		// نفس بوابتي الخادم — برسالتيهما نفسيهما، قبل نداء يفشل حتمًا
		if (imagesCount === 0) {
			toast.error("ارفع صور الفحص أولًا قبل الانتقال إلى التقرير");
			return;
		}
		void saveThen(() => updateStatus({ itemId: item.id, status: RadiologyStatus.REPORTING }));
	};

	const sendToReview = () => {
		void saveThen(async () => {
			// الحفظ سبق للتوّ — لكن قيم المحرّر لم تصل للخادم إلا الآن، فنتحقّق محليًا
			await updateStatus({ itemId: item.id, status: RadiologyStatus.UNDER_REVIEW });
		});
	};

	const startPreparation = () => {
		if (!canLeaveRadiologyQueue(payment)) {
			toast.error(radiologyPaymentBlockMessage(payment));
			return;
		}
		void updateStatus({ itemId: item.id, status: RadiologyStatus.PREPARATION }).catch(
			() => {},
		);
	};

	/** جسم المرحلة الظاهرة داخل التحضير أو التصوير */
	const stageBody = (() => {
		switch (item.stage) {
			case RadiologyStage.SAFETY_SCREENING:
				return (
					<RadiologyPrepSteps
						step="safety"
						order={order}
						item={item}
						registerSave={registerSave}
					/>
				);
			case RadiologyStage.PATIENT_PREP:
				return (
					<RadiologyPrepSteps
						step="prep"
						order={order}
						item={item}
						registerSave={registerSave}
					/>
				);
			case RadiologyStage.ROOM_ASSIGNMENT:
				return <RadiologyMachineAssignment item={item} />;
			case RadiologyStage.READY_CHECK:
				return (
					<RadiologyReadySummary
						order={order}
						item={item}
					/>
				);
			case RadiologyStage.ACQUISITION:
				return (
					<RadiologyAcquisitionStep
						item={item}
						registerSave={registerSave}
					/>
				);
			case RadiologyStage.IMAGE_UPLOAD:
				return (
					<RadiologyImageUpload
						item={item}
						orderId={order.id}
					/>
				);
			case RadiologyStage.IMAGE_QC:
				return (
					<RadiologyImageQc
						item={item}
						orderId={order.id}
						registerSave={registerSave}
					/>
				);
			default:
				return null;
		}
	})();

	/** تذييل الإجراءات حسب الحالة والمرحلة */
	const footer = (() => {
		if (item.status === RadiologyStatus.SCHEDULED) {
			return (
				<Button
					size="sm"
					className="gap-1.5 bg-indigo-600 primaryhover:bg-indigo-700"
					disabled={isBusy || !canLeaveRadiologyQueue(payment)}
					title={
						canLeaveRadiologyQueue(payment) ? undefined : radiologyPaymentBlockMessage(payment)
					}
					onClick={startPreparation}
				>
					{isDue ? "بدء تحضير الطفل" : "بدء الآن (قبل الموعد)"}
				</Button>
			);
		}

		if (item.status === RadiologyStatus.PREPARATION && stageSteps.length > 0) {
			const next = nextRadiologyStage(item.stage, item.status);
			const previous = previousRadiologyStage(item.stage, item.status);
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
							التالي: {RADIOLOGY_STAGE_LABELS[next]}
							<IconArrowLeft className="size-3.5 rtl:rotate-180" />
						</Button>
					) : (
						<Button
							size="sm"
							className="gap-1.5 bg-indigo-600 primaryhover:bg-indigo-700"
							disabled={isBusy || !item.execution?.machineId}
							title={item.execution?.machineId ? undefined : "عيّن جهاز التصوير قبل التسليم"}
							onClick={sendToImaging}
						>
							إرسال إلى التصوير
						</Button>
					)}
				</>
			);
		}

		if (item.status === RadiologyStatus.IMAGING && stageSteps.length > 0) {
			const next = nextRadiologyStage(item.stage, item.status);
			const previous = previousRadiologyStage(item.stage, item.status);
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
							disabled={isBusy || (next === RadiologyStage.IMAGE_QC && imagesCount === 0)}
							title={
								next === RadiologyStage.IMAGE_QC && imagesCount === 0
									? "ارفع صور الفحص أولًا قبل فحص جودتها"
									: undefined
							}
							onClick={goNextStage}
						>
							التالي: {RADIOLOGY_STAGE_LABELS[next]}
							<IconArrowLeft className="size-3.5 rtl:rotate-180" />
						</Button>
					) : (
						<Button
							size="sm"
							className="gap-1.5 bg-indigo-600 primaryhover:bg-indigo-700"
							disabled={isBusy}
							onClick={sendToReporting}
						>
							إرسال إلى كتابة التقرير
						</Button>
					)}
				</>
			);
		}

		if (item.status === RadiologyStatus.REPORTING) {
			return (
				<Button
					size="sm"
					className="gap-1.5 bg-indigo-600 primaryhover:bg-indigo-700"
					disabled={isBusy}
					title={REVIEW_BLOCKED}
					onClick={sendToReview}
				>
					إرسال للمراجعة
				</Button>
			);
		}

		if (item.status === RadiologyStatus.UNDER_REVIEW) {
			return (
				<>
					<Button
						size="sm"
						variant="outline"
						className="gap-1.5 text-destructive"
						disabled={isBusy}
						onClick={() => setRejectOpen(true)}
					>
						<IconX className="size-3.5" />
						رفض
					</Button>
					<Button
						size="sm"
						className="gap-1.5 bg-emerald-600 primaryhover:bg-emerald-700"
						disabled={isBusy}
						onClick={() => setApproveOpen(true)}
					>
						<IconCircleCheck className="size-3.5" />
						اعتماد التقرير
					</Button>
				</>
			);
		}

		return null;
	})();

	return (
		<>
			<aside
				dir="rtl"
				aria-label="لوحة الفحص"
				className={cn(
					"fixed inset-y-2 z-50 flex flex-col gap-0 rounded-lg border bg-popover text-sm text-popover-foreground shadow-lg",
					// تنزلق مع تقلّص لوحة الطلب بدل أن تبقى فوق عمود التعليقات (نمط التحاليل)
					"transition-[left,right] duration-300 ease-out",
					commentsOpen
						? "left-[calc(50%+1rem)] right-[25%]"
						: "left-[calc(66.6667%+1rem)] right-2",
				)}
			>
				{/* الترويسة — الفحص ورقم الوصول وطريقة التصوير */}
				<div className="flex items-center justify-between gap-2 border-b px-4 py-2">
					<div className="flex min-w-0 items-center gap-2">
						<h2 className="truncate text-base font-bold">{item.service.name}</h2>
						<Badge
							variant="outline"
							className="shrink-0 text-[10px]"
						>
							{MODALITY_META[item.modality].label}
						</Badge>
						<span className="shrink-0 text-xs tabular-nums text-muted-foreground">
							{item.accession}
						</span>
						{/* زر التعليقات — يفتح عمود تعليقات الطلب، كلوحة التحاليل */}
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
								{order.comments.length > 0 && (
									<span className="inline-flex h-4 min-w-4 items-center justify-center rounded bg-muted px-1 text-[10px] font-medium tabular-nums text-muted-foreground">
										{order.comments.length}
									</span>
								)}
							</Button>
						)}
					</div>
					<Button
						size="icon"
						variant="ghost"
						className="size-8"
						aria-label="إغلاق لوحة الفحص"
						onClick={handleClose}
					>
						<IconX className="size-4" />
					</Button>
				</div>

				<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
					{/* شارة الرفض — تبقى حتى المراجعة التالية */}
					{item.rejectedAt !== null && (
						<div className="flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 p-3">
							<IconAlertTriangleFilled className="mt-0.5 size-4 shrink-0 text-rose-600" />
							<div className="flex flex-col gap-0.5">
								<p className="text-sm font-medium text-rose-700">
									أُعيد التقرير من المراجعة{item.rejectedBy ? ` — ${item.rejectedBy.name}` : ""}
								</p>
								{item.rejectionReason && (
									<p className="text-xs text-rose-700/80">{item.rejectionReason}</p>
								)}
							</div>
						</div>
					)}

					{item.status === RadiologyStatus.QUEUE && (
						<p className="flex items-center gap-1.5 rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
							<IconInfoCircle className="size-4 shrink-0" />
							الطلب في «الطلبات» — أكِّده من ترويسة اللوحة بعد سداد الفاتورة ليبدأ التحضير.
						</p>
					)}

					{item.status === RadiologyStatus.SCHEDULED && (
						<div className="flex items-center justify-between gap-2 rounded-md border bg-muted/30 p-3">
							<p className="flex items-center gap-1.5 text-xs text-muted-foreground">
								<IconInfoCircle className="size-4 shrink-0" />
								{!canLeaveRadiologyQueue(payment)
									? radiologyPaymentBlockMessage(payment)
									: isDue
										? "حان موعد الفحص — جارٍ بدء تحضير الطفل..."
										: `الفحص مجدول ${item.scheduledAt ? formatScheduleLabel(item.scheduledAt) : ""} — يبقى هنا حتى موعده، ويمكنك بدؤه الآن عند الوصول المبكّر.`}
							</p>
							<Button
								type="button"
								size="sm"
								variant="outline"
								disabled={isBusy}
								onClick={() => setRescheduleOpen(true)}
								className="shrink-0"
							>
								تغيير الموعد
							</Button>
						</div>
					)}

					{/* مُدرِّج المراحل — نفس مُدرِّج التحاليل: ترقيم متصل وأيقونة لكل مرحلة */}
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
					{stageSteps.length > 0 && stageBody}

					{/* محرّر التقرير — في «كتابة التقرير» فقط، والقراءة بعدها.
					    الصور فوقه: قد تنكشف حاجة لإسقاط إضافي أثناء الكتابة. */}
					{item.status === RadiologyStatus.REPORTING && (
						<>
							<RadiologyImageUpload
								item={item}
								orderId={order.id}
							/>
							<RadiologyReportEditor
								item={item}
								registerSave={registerSave}
							/>
						</>
					)}

					{(item.status === RadiologyStatus.UNDER_REVIEW ||
						item.status === RadiologyStatus.COMPLETED) && (
						<div className="flex flex-col gap-4">
							<RadiologyReportView
								item={item}
								order={order}
							/>
							{/* الصور — للمراجعة جنب التقرير */}
							<RadiologyImageUpload
								item={item}
								orderId={order.id}
								readOnly
							/>
						</div>
					)}
				</div>

				{footer && (
					<div className="flex items-center justify-end gap-2 border-t px-4 py-2">
						{footer}
					</div>
				)}
			</aside>

			<RadiologyApproveDialog
				order={order}
				item={item}
				open={approveOpen}
				onOpenChange={setApproveOpen}
			/>
			<RadiologyRejectDialog
				order={order}
				item={item}
				open={rejectOpen}
				onOpenChange={setRejectOpen}
			/>
			<RadiologyRescheduleDialog
				item={item}
				open={rescheduleOpen}
				onOpenChange={setRescheduleOpen}
			/>
		</>
	);
}
