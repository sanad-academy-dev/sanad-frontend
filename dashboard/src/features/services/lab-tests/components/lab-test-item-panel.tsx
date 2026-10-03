import {
	IconAlertTriangleFilled,
	IconCheck,
	IconDroplet,
	IconFlask,
	IconMessage,
	IconSparkles,
	IconX,
} from "@tabler/icons-react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";

import { FieldLabel } from "@/components/common/field-label";
import { IconArrowFromRight } from "@/components/common/icon-arrow-from-right";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	MentionTextarea,
	type MentionUser,
} from "@/features/appointments/components/tabs/visit-info/mention-textarea";
import { LabAnalyzerAssignment } from "@/features/services/lab-tests/components/lab-analyzer-assignment";
import { LabResultComparison } from "@/features/services/lab-tests/components/lab-result-comparison";
import { LabSampleCollection } from "@/features/services/lab-tests/components/lab-sample-collection";
import {
	LabSampleCustodySummary,
	LabSampleLabel,
} from "@/features/services/lab-tests/components/lab-sample-label";
import { LabTestApproveDialog } from "@/features/services/lab-tests/components/lab-test-approve-dialog";
import { LabTestRejectDialog } from "@/features/services/lab-tests/components/lab-test-reject-dialog";
import { LAB_STAGE_ICONS } from "@/features/services/lab-tests/data/lab-tests-data";
import { useLabParameters } from "@/features/services/lab-tests/hooks/use-lab-templates";
import {
	useGenerateLabReport,
	useSaveLabReport,
	useSaveLabResults,
	useUpdateLabSampleStage,
	useUpdateLabTestStatus,
} from "@/features/services/lab-tests/hooks/use-lab-test-mutations";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { LabResultFlag, LabSampleStage, LabTestStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import {
	canLeaveQueue,
	computeResultFlag,
	LAB_FLAG_LABELS,
	type LabResultEntryInput,
	type LabTestOrderResponse,
	labPaymentStatus,
	paymentBlockMessage,
} from "@sanad/contracts/runtime/server/lab-tests/lab-tests.type";
import {
	LAB_STAGE_LABELS,
	LAB_STAGE_ORDER,
	LAB_STATUS_LABELS,
	STAGES_BY_STATUS,
} from "@sanad/contracts/runtime/server/lab-tests/lab-tests.workflow";

// لوحة التحليل المفرد — تُفتح بجانب لوحة الطلب (كقائمة المستلزمات في الزيارة)
// وتحمل سير عمل التحليل كاملًا: السحب ثم التحليل ثم المراجعة.

/** Decimal يصل من الخادم كنص — نحوّله لرقم للمقارنة والعرض */
const toNumber = (value: unknown): number | null => {
	if (value == null || value === "") return null;
	const n = Number(value);
	return Number.isFinite(n) ? n : null;
};

const rangeLabel = (low: number | null, high: number | null) => {
	if (low == null && high == null) return "—";
	if (low != null && high != null) return `${low} – ${high}`;
	return low != null ? `≥ ${low}` : `≤ ${high}`;
};

/** يُبرز رموز الإشارة (@اسم) داخل نص التقرير — نفس سلوك ملاحظات الزيارة */
function renderReportBody(body: string, mentions: { staff: { id: string; name: string } }[]) {
	if (mentions.length === 0) return body;
	// أطول الأسماء أولًا لتفادي مطابقة جزئية لاسم يبدأ باسم آخر
	const names = mentions
		.map((m) => m.staff.name)
		.sort((a, b) => b.length - a.length)
		.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
	const pattern = new RegExp(`@(?:${names.join("|")})`, "g");
	const parts = body.split(pattern);
	const tokens = body.match(pattern) ?? [];
	return parts.flatMap((part, i) => {
		const token = tokens[i];
		return [
			part,
			token ? (
				<span
					key={`m-${i}`}
					className="font-medium text-primary"
				>
					{token}
				</span>
			) : null,
		];
	});
}

const FLAG_CLASS: Record<LabResultFlag, string> = {
	[LabResultFlag.NORMAL]: "border-emerald-200 bg-emerald-50 text-emerald-700",
	[LabResultFlag.LOW]: "border-amber-200 bg-amber-50 text-amber-700",
	[LabResultFlag.HIGH]: "border-red-200 bg-red-50 text-red-700",
};

export function LabTestItemPanel({
	order,
	itemId,
	open,
	onClose,
	commentsOpen = false,
	onToggleComments,
}: {
	order: LabTestOrderResponse;
	itemId: string | null;
	open: boolean;
	onClose: () => void;
	/** فتح التعليقات يُقلّص لوحة الطلب، فتنزاح هذه اللوحة يسارًا ويظهر عمودها يمينًا */
	commentsOpen?: boolean;
	onToggleComments?: () => void;
}) {
	const item = order.items.find((i) => i.id === itemId) ?? null;
	const { parameters, isLoading: parametersLoading } = useLabParameters(
		item?.serviceId ?? null,
	);
	const { updateStatus, isPending: isUpdatingStatus } = useUpdateLabTestStatus();
	const { updateStage, isPending: isUpdatingStage } = useUpdateLabSampleStage();
	const { saveResults, isPending: isSaving } = useSaveLabResults();
	// المسودّة تُحفظ عند الاعتماد — نبقي مؤشّر الحفظ وحده لقفل الأزرار أثناءه
	const { isPending: isSavingReport } = useSaveLabReport();
	const { generateReport, isPending: isGeneratingReport } = useGenerateLabReport();
	const [rejectOpen, setRejectOpen] = useState(false);
	const [approveOpen, setApproveOpen] = useState(false);
	const [rows, setRows] = useState<LabResultEntryInput[]>([]);
	// حفظ الخطوة الحالية — تُسجّله كل خطوة، ويستدعيه «التالي» قبل الانتقال
	const stepSaveRef = useRef<(() => Promise<unknown>) | null>(null);
	const registerStepSave = (fn: (() => Promise<unknown>) | null) => {
		stepSaveRef.current = fn;
	};
	// مسودّة تقرير المراجعة — تُحفظ يدويًا وتُستخدم كقيمة أولية في حوار الاعتماد
	const [reportDraft, setReportDraft] = useState("");
	const [_mentionedStaffIds, setMentionedStaffIds] = useState<string[]>([]);
	// نفس مصدر الإشارات في ملاحظات الزيارة — طاقم الأكاديمية
	const { staff } = useStaff();
	const mentionables = useMemo<MentionUser[]>(
		() => staff.map((s) => ({ id: s.id, name: s.name })),
		[staff],
	);

	// بصمة البيانات القادمة من الخادم — نُعيد بناء الصفوف عند تغيّرها فقط،
	// حتى لا يمحو أي إعادة جلب في الخلفية القيم التي يكتبها المستخدم.
	const seedSignature = useMemo(() => {
		if (!item) return "";
		// لا نبني الصفوف قبل وصول المُحلِّلات، وإلا ظهر صف التحليل المفرد ثم استُبدل
		if (parametersLoading) return "loading";
		const results = item.results.map((r) => `${r.id}:${r.value ?? ""}`).join("|");
		const params = parameters.map((p) => `${p.id}:${p.active}`).join("|");
		return `${item.id}#${results}#${params}`;
	}, [item, parameters, parametersLoading]);

	// قيم الصفوف كما وصلت من الخادم — نقارن بها لمعرفة وجود تعديل غير محفوظ
	const seededValuesRef = useRef("");
	const valuesKey = (list: LabResultEntryInput[]) =>
		JSON.stringify(list.map((r) => r.value ?? ""));

	const itemServiceName = item?.service.name ?? "";
	// biome-ignore lint/correctness/useExhaustiveDependencies: نُعيد البناء عند تغيّر بصمة الخادم فقط
	useEffect(() => {
		if (!item) {
			setRows([]);
			seededValuesRef.current = "";
			return;
		}
		if (parametersLoading) return;

		const next: LabResultEntryInput[] = (() => {
			// النتائج المحفوظة أولًا؛ وإن لم توجد نبدأ من مُحلِّلات قالب التحليل
			if (item.results.length > 0) {
				return [...item.results]
					.sort((a, b) => a.order - b.order)
					.map((r) => ({
						parameterId: r.parameterId,
						section: r.section,
						name: r.name,
						unit: r.unit,
						refLow: toNumber(r.refLow),
						refHigh: toNumber(r.refHigh),
						value: r.value ?? "",
						notes: r.notes,
						order: r.order,
					}));
			}
			const activeParameters = parameters.filter((p) => p.active);
			// تحليل مفرد (بلا مُحلِّلات) — صف نتيجة واحد باسم التحليل نفسه
			if (activeParameters.length === 0) {
				return [
					{
						parameterId: null,
						section: null,
						name: itemServiceName,
						unit: null,
						refLow: null,
						refHigh: null,
						value: "",
						notes: null,
						order: 0,
					},
				];
			}
			return activeParameters.map((p, index) => ({
				parameterId: p.id,
				section: p.section,
				name: p.name,
				unit: p.unit,
				refLow: toNumber(p.refLow),
				refHigh: toNumber(p.refHigh),
				value: "",
				notes: null,
				order: index,
			}));
		})();

		setRows(next);
		seededValuesRef.current = valuesKey(next);
	}, [seedSignature]);

	// التقرير المحفوظ على الخادم هو المصدر — نزامنه عند تغيّره فقط
	const serverReport = item?.report ?? "";
	useEffect(() => {
		setReportDraft(serverReport);
	}, [serverReport]);

	// فتح لوحة تحليل مجدول مدفوع يبدأ سحب العيّنة فورًا — الخطوة الأولى تظهر
	// مباشرةً بدل صفحة فارغة بانتظار زر. الحارس يمنع تكرار الطلب لكل تحليل.
	const autoStartedItemRef = useRef<string | null>(null);
	const itemStatus = item?.status ?? null;
	const isOrderPaid = canLeaveQueue(labPaymentStatus(order));
	useEffect(() => {
		if (!open || !item || itemStatus !== LabTestStatus.SCHEDULED || !isOrderPaid) return;
		if (autoStartedItemRef.current === item.id) return;
		autoStartedItemRef.current = item.id;
		void updateStatus({
			itemId: item.id,
			status: LabTestStatus.SAMPLE_COLLECTION,
		}).catch(() => {
			// فشل البدء (سباق سداد مثلًا) يسمح بمحاولة جديدة عند إعادة الفتح
			autoStartedItemRef.current = null;
		});
	}, [open, item, itemStatus, isOrderPaid, updateStatus]);

	if (!item || !open) return null;

	const status = item.status;
	const stage = item.sampleStage;
	const isCollecting = status === LabTestStatus.SAMPLE_COLLECTION;
	const isInLab = status === LabTestStatus.IN_LAB;
	const isUnderReview = status === LabTestStatus.UNDER_REVIEW;
	const isCompleted = status === LabTestStatus.COMPLETED;
	// النتائج تُدخَل داخل المختبر فقط؛ بعدها تُعرض للقراءة أثناء المراجعة وبعد الاعتماد
	const canEditResults = isInLab;

	// خطوات المرحلة الحالية — لكل حالة مراحلها الفرعية وحدها، لكن الترقيم متصل
	// عبر المسار كله (١..٨) فلا يعود العدّاد إلى ١ حين ينتقل التحليل للمختبر
	const stageScope = STAGES_BY_STATUS[status] ?? [];
	const stageSteps = stageScope.map((s) => ({
		step: LAB_STAGE_ORDER.indexOf(s) + 1,
		stage: s,
		title: LAB_STAGE_LABELS[s],
		icon: LAB_STAGE_ICONS[s],
	}));
	const currentStep = stageSteps.find((s) => s.stage === stage)?.step ?? 1;
	const nextStageStep = stageSteps.find((s) => s.step === currentStep + 1);
	const lastStepInScope = stageSteps.at(-1)?.step ?? 0;
	const isLastStage = stageSteps.length > 0 && currentStep === lastStepInScope;

	const criticalCount = rows.filter(
		(r) => computeResultFlag(r.value, r.refLow, r.refHigh) !== LabResultFlag.NORMAL,
	).length;
	const hasAnyValue = rows.some((r) => (r.value ?? "").trim() !== "");
	// تحليل مفرد: صف واحد بلا مُحلِّل مرتبط — النتيجة تُكتب في حقل حر
	const isSingleResult = rows.length === 1 && !rows[0]?.parameterId;
	const paymentStatus = labPaymentStatus(order);
	const tubeCode = `${order.code}-${order.items.findIndex((i) => i.id === item.id) + 1}`;

	// النتائج مجمّعة حسب القسم مع الاحتفاظ بالفهرس الأصلي (لازم لتحديث القيمة).
	// حساب بسيط بعد الحارس — لا يصلح useMemo هنا لأنه بعد return مبكر.
	const groupedRows = (() => {
		const groups = new Map<string, { row: LabResultEntryInput; index: number }[]>();
		rows.forEach((row, index) => {
			const key = row.section?.trim() || "";
			const list = groups.get(key) ?? [];
			list.push({ row, index });
			groups.set(key, list);
		});
		return [...groups.entries()];
	})();
	const isBusy = isUpdatingStatus || isUpdatingStage || isSaving || isSavingReport;

	// التذييل يظهر متى كان للتحليل إجراء — لا في مراحل السحب والمختبر فقط
	const hasFooterActions =
		status === LabTestStatus.SCHEDULED ||
		isUnderReview ||
		((isCollecting || isInLab) && stageSteps.length > 0);

	const setValue = (index: number, value: string) =>
		setRows((prev) => prev.map((row, i) => (i === index ? { ...row, value } : row)));

	const orderedRows = () => rows.map((r, i) => ({ ...r, order: i }));

	/** الأخطاء تُعرض عبر التوست في الخطّاف — نبتلعها هنا حتى لا يبقى رفض غير معالج */
	const run = (p: Promise<unknown>) => {
		void p.catch(() => {});
	};

	// لا يوجد زر حفظ — الحفظ يتم عند نقل المرحلة أو الإرسال للمراجعة.
	// وإغلاق اللوحة بتعديلات غير محفوظة يحفظها بصمت حتى لا يضيع الإدخال.
	const hasUnsavedValues = valuesKey(rows) !== seededValuesRef.current;
	const handleClose = () => {
		if (canEditResults && hasUnsavedValues) {
			run(saveResults({ itemId: item.id, results: orderedRows() }));
		}
		onClose();
	};

	// الانتقال بين مراحل العيّنة خطوة واحدة، مع حفظ ما أُدخل قبل المغادرة
	const goToStep = async (target: number) => {
		if (target === currentStep || Math.abs(target - currentStep) !== 1) return;
		const nextStage = stageSteps.find((s) => s.step === target)?.stage;
		if (!nextStage) return;
		try {
			// «التالي» يحفظ كل شيء: نتائج المختبر أو حقول خطوة السحب الحالية
			if (canEditResults && hasAnyValue) {
				await saveResults({ itemId: item.id, results: orderedRows() });
			}
			if (target > currentStep) await stepSaveRef.current?.();
			await updateStage({ itemId: item.id, sampleStage: nextStage });
		} catch {
			// فشل الحفظ يمنع تغيير المرحلة — التوست يعرض السبب
		}
	};

	// الإرسال إلى المختبر يحفظ آخر خطوة (الملخّص لا يحفظ شيئًا) ثم ينقل الحالة
	const handleSendToLab = async () => {
		try {
			await stepSaveRef.current?.();
			await updateStatus({ itemId: item.id, status: LabTestStatus.IN_LAB });
		} catch {
			// فشل الحفظ يمنع الانتقال
		}
	};

	// الإرسال للمراجعة يحفظ النتائج أولًا — وإلا ضاعت القيم غير المحفوظة
	const handleSendToReview = async () => {
		try {
			await saveResults({ itemId: item.id, results: orderedRows() });
			await updateStatus({ itemId: item.id, status: LabTestStatus.UNDER_REVIEW });
		} catch {
			// فشل الحفظ يمنع الانتقال للمراجعة
		}
	};

	return (
		<>
			{/* عنصر داخل لوحة الطلب لا حوارًا متداخلًا: يُبقي غشاوة لوحة الطلب
			    كما هي، ويجعل التمرير يعمل لأنه ضمن نطاق قفل التمرير نفسه. */}
			<aside
				dir="rtl"
				aria-label={`خطوات ${item.service.name}`}
				className={cn(
					"fixed inset-y-2 z-50 flex flex-col gap-0 rounded-lg border bg-popover text-sm text-popover-foreground shadow-lg",
					// تنزلق مع تقلّص لوحة الطلب بدل أن تقفز — نفس مدّة حركة اللوحة
					"transition-[left,right] duration-300 ease-out",
					commentsOpen
						? // لوحة الطلب تنتهي عند 50%: نشغل النصف الأول من المساحة المتبقية
							// والنصف الآخر (من 75%) لعمود التعليقات. الحدّ عند 25% تمامًا
							// ليكون الفراغ بين الأعمدة 0.5rem كباقي الفراغات
							"left-[calc(50%+1rem)] right-[25%]"
						: // لوحة الطلب تنتهي عند 66.6667% + 0.5rem، فنبدأ بعدها بـ0.5rem فاصلًا
							"left-[calc(66.6667%+1rem)] right-2",
				)}
			>
				<div className="border-b">
					<div className="flex items-center justify-between gap-2 px-4 py-2">
						<h2 className="flex min-w-0 items-center gap-2 text-base font-bold">
							<IconFlask className="size-4 shrink-0 text-muted-foreground" />
							<span className="truncate">{item.service.name}</span>
							<span className="text-xs font-normal tabular-nums text-muted-foreground">
								{tubeCode}
							</span>
							{/* زر التعليقات محلّ الوسوم: يفتح عمود تعليقات الطلب على اليمين */}
						</h2>

						<div className="flex items-center gap-1.5">
							<Button
								size="sm"
								variant={commentsOpen ? "secondary" : "outline"}
								className="h-7 gap-1.5 text-xs font-normal"
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
							{/* سهم الطيّ لا علامة إغلاق — اللوحة تنزوي جانبًا لا تُغلق نافذة */}
							<button
								type="button"
								onClick={handleClose}
								aria-label="إغلاق لوحة التحليل"
								className="flex size-6.25 items-center justify-center rounded-full bg-[#E5E5E5]"
							>
								<IconArrowFromRight className="size-3.25 scale-x-[-1]" />
							</button>
						</div>
					</div>
				</div>

				<div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
					{/* سبب الرفض — يبقى ظاهرًا حتى الاعتماد التالي */}
					{item.rejectedAt && item.rejectionReason && (
						<div className="p-4 pb-0">
							<div className="flex items-start gap-2 rounded-[4px] border border-rose-200 bg-rose-50 p-3">
								<IconAlertTriangleFilled className="mt-0.5 size-4 shrink-0 text-rose-600" />
								<div className="flex flex-col gap-0.5">
									<p className="text-xs font-bold text-rose-800">أُعيد التحليل من المراجعة</p>
									<p className="text-[11px] text-rose-700">{item.rejectionReason}</p>
								</div>
							</div>
						</div>
					)}

					{status === LabTestStatus.QUEUE && (
						<div className="p-4">
							<p className="rounded-[4px] border bg-muted/30 p-3 text-xs text-muted-foreground">
								{/* [IP3] طلب الإقامة بلا فاتورة هنا — إحالته إلى سدادٍ لا وجود له
								    تُوقف الطاقم أمام خطوة لا يستطيع أداءها */}
								{paymentStatus === "INPATIENT"
									? "هذا التحليل في الطابور. أكِّد الطلب من لوحة الطلب ليبدأ سير العمل — يُحاسَب على فاتورة الإقامة بلا سداد مسبق."
									: "هذا التحليل في الطابور. أكِّد الطلب من لوحة الطلب بعد سداد فاتورته ليبدأ سير العمل."}
							</p>
						</div>
					)}

					{/* مجدول: المدفوع يبدأ تلقائيًا (أعلاه) فتظهر رسالة عابرة فقط،
					    وغير المدفوع يعرف لماذا لا يتقدّم بدل لوحة فارغة */}
					{status === LabTestStatus.SCHEDULED && (
						<div className="p-4">
							<p className="rounded-[4px] border bg-muted/30 p-3 text-xs text-muted-foreground">
								{isOrderPaid
									? "جارٍ بدء سحب العيّنة..."
									: `هذا التحليل مجدول — ${paymentBlockMessage(paymentStatus)}`}
							</p>
						</div>
					)}

					{/* مسار مراحل العيّنة — نفس مُدرِّج الفحص السريري */}
					{(isCollecting || isInLab) && stageSteps.length > 0 && (
						<>
							<div className="flex items-center justify-between border-b px-4 py-2">
								<p className="text-sm font-bold">
									{isCollecting ? "مسار سحب العيّنة" : "مسار التحليل"}
								</p>
								<Badge
									variant="outline"
									className="text-[10px]"
								>
									خطوة {currentStep} من {LAB_STAGE_ORDER.length}
								</Badge>
							</div>

							<Stepper
								value={currentStep}
								onValueChange={(step) => {
									void goToStep(step);
								}}
								className="flex flex-col"
							>
								<div className="shrink-0 overflow-x-auto px-6 pt-6 pb-4">
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

							{/* لكل مرحلة لوحتها — لا تظهر الخطوات كلها دفعةً واحدة */}
							<div className="p-4">
								{stage === LabSampleStage.NOT_COLLECTED && (
									<LabSampleCollection
										order={order}
										item={item}
										step="pre-analytical"
										registerSave={registerStepSave}
									/>
								)}
								{stage === LabSampleStage.COLLECTED && (
									<LabSampleCollection
										order={order}
										item={item}
										step="collection"
										registerSave={registerStepSave}
									/>
								)}
								{stage === LabSampleStage.QUALITY_CHECK && (
									<LabSampleCollection
										order={order}
										item={item}
										step="quality"
										registerSave={registerStepSave}
									/>
								)}
								{stage === LabSampleStage.LABEL_PRINT && (
									<LabSampleLabel
										order={order}
										item={item}
										tubeCode={tubeCode}
										registerSave={registerStepSave}
									/>
								)}
								{stage === LabSampleStage.ANALYZER_ASSIGNMENT && (
									<LabAnalyzerAssignment
										item={item}
										registerSave={registerStepSave}
									/>
								)}
								{stage === LabSampleStage.HANDOVER_SUMMARY && (
									<LabSampleCustodySummary
										order={order}
										item={item}
									/>
								)}
							</div>
						</>
					)}

					{/* النتائج — لا تظهر إلا عند «ظهرت النتائج»، وتبقى مقروءة بعد المختبر */}
					{((isInLab && stage === LabSampleStage.RESULTS_READY) ||
						isUnderReview ||
						isCompleted) && (
						<>
							<Separator />
							<div className="flex flex-col gap-2 p-4">
								<div className="flex items-center justify-between">
									<p className="text-xs font-bold">
										النتائج
										{criticalCount > 0 && (
											<span className="ms-2 text-[11px] font-medium text-red-600">
												{criticalCount} قيمة حرجة
											</span>
										)}
									</p>
									{!canEditResults && rows.length > 0 ? (
										<span className="text-[11px] text-muted-foreground">
											{isCompleted ? "معتمدة — للقراءة فقط" : "للقراءة أثناء المراجعة"}
										</span>
									) : (
										isSingleResult && (
											<span className="text-[11px] text-muted-foreground">
												تحليل مفرد — لتقسيمه إلى بنود أضِف مُحلِّلات من زر «المُحلِّلات» في الدورات
											</span>
										)
									)}
								</div>

								<div className="rounded-[4px] border">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead className="text-start">المُحلِّل</TableHead>
												<TableHead className="text-center">الوحدة</TableHead>
												<TableHead className="text-center">النطاق الطبيعي</TableHead>
												<TableHead className="text-center">النتيجة</TableHead>
												<TableHead className="text-center">الحالة</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{rows.length === 0 && (
												<TableRow>
													<TableCell
														colSpan={5}
														className="text-center text-xs text-muted-foreground"
													>
														جارٍ تحضير حقول النتائج...
													</TableCell>
												</TableRow>
											)}
											{groupedRows.map(([section, entries]) => (
												<Fragment key={section || "__none__"}>
													{/* عنوان القسم — يُجمّع مُحلِّلات التحليل المركّب */}
													{section && (
														<TableRow className="bg-muted/40 hover:bg-muted/40">
															<TableCell
																colSpan={5}
																className="py-1.5 text-start text-xs font-bold text-foreground"
															>
																{section}
															</TableCell>
														</TableRow>
													)}
													{entries.map(({ row, index }) => {
														const flag = computeResultFlag(row.value, row.refLow, row.refHigh);
														const isCritical = flag !== LabResultFlag.NORMAL;
														const hasValue = (row.value ?? "").trim() !== "";
														return (
															<TableRow key={`${row.parameterId ?? row.name}-${index}`}>
																<TableCell className="text-sm font-medium">
																	{row.name}
																</TableCell>
																<TableCell className="text-center text-xs text-muted-foreground">
																	{row.unit || "—"}
																</TableCell>
																<TableCell className="text-center text-xs tabular-nums text-muted-foreground">
																	{rangeLabel(row.refLow ?? null, row.refHigh ?? null)}
																</TableCell>
																<TableCell className="text-center">
																	{canEditResults ? (
																		<Input
																			value={row.value ?? ""}
																			disabled={isSaving}
																			placeholder={
																				row.parameterId ? undefined : "مثال: 80 - 120"
																			}
																			onChange={(e) => setValue(index, e.target.value)}
																			className={cn(
																				"mx-auto h-7 text-center tabular-nums",
																				// التحليل المفرد يقبل نصًا حرًا (رقم أو مدى) فيحتاج حقلًا أوسع
																				row.parameterId ? "w-24" : "w-40",
																				isCritical && "border-red-300 text-red-700",
																			)}
																		/>
																	) : (
																		<span
																			className={cn(
																				"text-sm font-semibold tabular-nums",
																				isCritical && "text-red-700",
																			)}
																		>
																			{hasValue ? row.value : "—"}
																		</span>
																	)}
																</TableCell>
																<TableCell className="text-center">
																	{hasValue ? (
																		<Badge
																			variant="outline"
																			className={cn("gap-1 text-[10px]", FLAG_CLASS[flag])}
																		>
																			{isCritical && (
																				<IconAlertTriangleFilled className="size-3" />
																			)}
																			{LAB_FLAG_LABELS[flag]}
																		</Badge>
																	) : (
																		<span className="text-xs text-muted-foreground">—</span>
																	)}
																</TableCell>
															</TableRow>
														);
													})}
												</Fragment>
											))}
										</TableBody>
									</Table>
								</div>

								{/* المقارنة بنتيجة سابقة — بعد إدخال النتائج، لا أثناءه */}
								{!canEditResults && <LabResultComparison item={item} />}
							</div>
						</>
					)}

					{/* تقرير المراجعة — يُكتب قبل الاعتماد، ويبقى للقراءة بعده */}
					{(isUnderReview || (isCompleted && !!item.report)) && (
						<>
							<Separator />
							<div className="flex flex-col gap-2 p-4">
								<div className="flex items-center justify-between">
									<FieldLabel required={isUnderReview}>
										<p className="text-xs font-bold">تقرير المراجعة</p>
									</FieldLabel>
									{isUnderReview && (
										<div className="flex items-center gap-1.5">
											{/* يقرأ النتائج المحفوظة ويكتب مسودّة — تبقى للمراجعة والتعديل */}
											<Button
												size="sm"
												variant="outline"
												className="gap-1.5"
												disabled={isBusy || isGeneratingReport || !hasAnyValue}
												title={
													hasAnyValue ? undefined : "أدخل نتائج التحليل أولًا ليُصاغ التقرير"
												}
												onClick={() => {
													void generateReport({ itemId: item.id })
														.then(({ report }) => setReportDraft(report))
														.catch(() => {});
												}}
											>
												<IconSparkles className="size-3.5 text-amber-500" />
												{isGeneratingReport ? "جارٍ الصياغة..." : "كتابة بالذكاء الاصطناعي"}
											</Button>
										</div>
									)}
								</div>

								{isUnderReview ? (
									<MentionTextarea
										value={reportDraft}
										onChange={setReportDraft}
										users={mentionables}
										onMentionsChange={setMentionedStaffIds}
										disabled={isBusy}
										placeholder="اكتب خلاصة قراءة النتائج... استخدم @ للإشارة إلى زميل"
										className="min-h-24 text-start"
									/>
								) : (
									<p className="whitespace-pre-wrap rounded-[4px] border bg-muted/30 p-3 text-xs leading-relaxed">
										{renderReportBody(item.report ?? "", item.reportMentions)}
									</p>
								)}
							</div>
						</>
					)}
				</div>

				{/* تذييل الإجراءات — كل أزرار التحليل هنا لا في الرأس.
				    ترتيب DOM في RTL: الأول يمينًا، فـ«السابق» قبل «التالي». */}
				{hasFooterActions && (
					<div className="flex items-center justify-between gap-2 border-t px-4 py-2">
						<span className="text-[11px] text-muted-foreground">
							{isCollecting || isInLab
								? `خطوة ${currentStep} من ${stageSteps.length}`
								: LAB_STATUS_LABELS[status]}
						</span>
						<div className="flex items-center gap-1.5">
							{status === LabTestStatus.SCHEDULED && (
								<Button
									size="sm"
									className="gap-1.5 bg-indigo-600 primaryhover:bg-indigo-700"
									disabled={isBusy || !canLeaveQueue(paymentStatus)}
									title={
										canLeaveQueue(paymentStatus)
											? undefined
											: paymentBlockMessage(paymentStatus)
									}
									onClick={() =>
										run(
											updateStatus({
												itemId: item.id,
												status: LabTestStatus.SAMPLE_COLLECTION,
											}),
										)
									}
								>
									<IconDroplet className="size-3.5" />
									بدء سحب العيّنة
								</Button>
							)}
							{(isCollecting || isInLab) && currentStep > 1 && (
								<Button
									size="sm"
									variant="outline"
									disabled={isBusy}
									onClick={() => void goToStep(currentStep - 1)}
								>
									السابق
								</Button>
							)}
							{(isCollecting || isInLab) && nextStageStep && (
								<Button
									size="sm"
									className="gap-1.5 bg-indigo-600 primaryhover:bg-indigo-700"
									disabled={isBusy}
									onClick={() => void goToStep(currentStep + 1)}
								>
									{`التالي: ${nextStageStep.title}`}
								</Button>
							)}
							{/* آخر خطوة في السحب تُرسل للمختبر، وآخر خطوة فيه تُرسل للمراجعة */}
							{isCollecting && isLastStage && (
								<Button
									size="sm"
									className="gap-1.5 bg-indigo-600 primaryhover:bg-indigo-700"
									disabled={isBusy}
									onClick={() => void handleSendToLab()}
								>
									إرسال إلى المختبر
								</Button>
							)}
							{isInLab && isLastStage && (
								<Button
									size="sm"
									className="gap-1.5 bg-indigo-600 primaryhover:bg-indigo-700"
									disabled={isBusy || !hasAnyValue}
									title={!hasAnyValue ? "أدخل النتائج أولاً" : undefined}
									onClick={() => void handleSendToReview()}
								>
									إرسال للمراجعة
								</Button>
							)}
							{isUnderReview && (
								<>
									<Button
										size="sm"
										className="gap-1.5 bg-indigo-600 primaryhover:bg-indigo-700"
										disabled={isBusy}
										onClick={() => setApproveOpen(true)}
									>
										<IconCheck className="size-3.5" />
										اعتماد النتائج
									</Button>
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
								</>
							)}
						</div>
					</div>
				)}
			</aside>

			<LabTestRejectDialog
				order={order}
				item={item}
				open={rejectOpen}
				onOpenChange={setRejectOpen}
			/>

			<LabTestApproveDialog
				order={order}
				item={item}
				open={approveOpen}
				onOpenChange={setApproveOpen}
				initialReport={reportDraft}
			/>
		</>
	);
}
