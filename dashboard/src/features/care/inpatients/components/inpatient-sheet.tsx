import {
	IconAlertTriangle,
	IconBedFlat,
	IconCheck,
	IconChevronRight,
	IconPrinter,
	IconReceipt,
	IconSparkles,
	IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AdmitRequestDialog } from "@/features/care/inpatients/components/admit-request-dialog";
import { InpatientFlowsheetTab } from "@/features/care/inpatients/components/inpatient-flowsheet-tab";
import { InpatientMarTab } from "@/features/care/inpatients/components/inpatient-mar-tab";
import { InpatientOrdersTab } from "@/features/care/inpatients/components/inpatient-orders-tab";
import { ACUITY_META, STAY_KIND_META } from "@/features/care/inpatients/data/inpatients-data";
import {
	useAddInpatientNote,
	useAssignCage,
	useCages,
	useCreateInpatientConsent,
	useDischargeInpatient,
	useInpatientActivity,
	useInpatientConsents,
	useInpatientDraft,
	useInpatientInvoice,
	useInpatientStay,
	usePayInpatientInvoice,
	useTransitionInpatient,
	useUpdateInpatient,
} from "@/features/care/inpatients/hooks/use-inpatients";
import { printDischargeSummary } from "@/features/care/inpatients/utils/print-discharge-summary";
import { ConsentSheet } from "@/features/services/consents/components/consent-sheet";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import type { InpatientAcuity, InpatientStayStatus } from "@/generated/prisma/enums";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import {
	DISCHARGE_KIND_LABELS,
	INPATIENT_STATUS_LABELS,
} from "@sanad/contracts/runtime/server/inpatients/inpatients.workflow";
import type { InpatientInvoiceLine } from "@/server/inpatients/inpatients-invoice.service";

/**
 * ورقة الإقامة — العمود الفقري للوحدة.
 *
 * تتبع هيكل ورقة الزيارة: عمود يسار للتفاصيل الثابتة وألسنة للعمل. الفعل الرئيسي
 * في الرأس يتغيّر بالحالة، ورفضُ البوابة يُعرض نصًّا كما أعاده الخادم — لا رسالة
 * عامّة: «أسكِن الطفل في قفص» يقول ماذا يُفعل، و«فشل» لا يقول شيئًا.
 */

/**
 * ألسنة الورقة، والحالة التي يظهر عندها كلٌّ منها.
 *
 * «نظرة عامة» أوّلًا وافتراضيًّا: أوّل سؤال عند فتح إقامة هو «ما قصّة هذا
 * الطفل؟» لا «ما جرعته التالية؟». وفتحُ الورقة على ورقة العلاج كان يُقحم
 * من يريد الاطّلاع في شاشة تنفيذ.
 *
 * والألسنة تُخفى قبل أوانها لا تُعطَّل: طلبٌ لم يدخل لا ورقة علاج له ولا
 * متابعة ولا فاتورة إقامة — ولسانٌ فارغ يُعلّم الطاقم أن نصف الشاشة زينة.
 */
const TABS = [
	{ value: "overview", label: "نظرة عامة", showFrom: "REQUESTED" },
	{ value: "orders", label: "الطلبات والأوامر", showFrom: "ADMITTED" },
	{ value: "mar", label: "ورقة العلاج", showFrom: "ADMITTED" },
	{ value: "flowsheet", label: "المتابعة", showFrom: "ADMITTED" },
	{ value: "billing", label: "الفاتورة", showFrom: "ADMITTED" },
	{ value: "discharge", label: "الخروج", showFrom: "DISCHARGE_PENDING" },
] as const satisfies readonly {
	value: string;
	label: string;
	showFrom: InpatientStayStatus;
}[];

/** ترتيب الحالات على المسار — لمقارنة «بلغت هذه المرحلة أم لا» */
const STATUS_RANK: Record<InpatientStayStatus, number> = {
	REQUESTED: 0,
	ADMITTED: 1,
	IN_CARE: 2,
	DISCHARGE_PENDING: 3,
	DISCHARGED: 4,
	CANCELLED: 4,
};

const visibleTabs = (status: InpatientStayStatus | undefined) =>
	TABS.filter((t) => STATUS_RANK[status ?? "REQUESTED"] >= STATUS_RANK[t.showFrom]);

export function InpatientSheet({
	stayId,
	open,
	onOpenChange,
	initialTab,
}: {
	stayId: string | null;
	/** اللسان الذي تُفتح عليه الورقة — يستعمله «نفّذ» في قائمة المستحقّ */
	initialTab?: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { isRtl } = useI18n();
	const side = isRtl ? "left" : "right";
	const { stay, isLoading } = useInpatientStay(stayId);
	const [tab, setTab] = useState<string>(initialTab ?? "overview");

	// فتحةٌ جديدة على لسان مقصود — الفتح من قائمة المستحقّ يقصد لسانًا بعينه
	useEffect(() => {
		if (open && initialTab) setTab(initialTab);
	}, [open, initialTab]);

	const detail = stay as unknown as StayDetail | null;
	const readOnly = detail?.status === "DISCHARGED" || detail?.status === "CANCELLED";

	const tabs = visibleTabs(detail?.status);
	/**
	 * اللسان المفتوح قد يختفي تحت اليد: الإقامة تدخل فتظهر ألسنة، أو تُلغى
	 * فتُخفى — ولسانٌ مُحدَّد لا وجود له يترك المحتوى فارغًا بلا سبب ظاهر.
	 */
	useEffect(() => {
		if (tabs.length && !tabs.some((t) => t.value === tab)) setTab(tabs[0].value);
	}, [tabs, tab]);
	const acuity = detail ? ACUITY_META[detail.acuity] : null;
	const transition = useTransitionInpatient(detail?.id ?? "");

	const [admitOpen, setAdmitOpen] = useState(false);

	/**
	 * الفعل الرئيسي يتبع الحالة — زرّ واحد لا قائمة خيارات.
	 *
	 * «إدخال» ليس انتقالًا كالبقيّة: يحتاج قفصًا، فيفتح نافذته بدل أن يُرسل
	 * طلبًا يرفضه الخادم لغياب الإسكان.
	 */
	const nextAction =
		detail?.status === "ADMITTED"
			? { to: "IN_CARE" as const, label: "بدء الرعاية" }
			: detail?.status === "IN_CARE"
				? { to: "DISCHARGE_PENDING" as const, label: "تجهيز الخروج" }
				: null;

	return (
		<Sheet
			open={open}
			onOpenChange={onOpenChange}
		>
			<SheetContent
				side={side}
				showCloseButton={false}
				// `max-w-2/3!` بعلامة الأهمية — بدونها يفوز `sm:max-w-sm` المضمَّن في
				// `SheetContent` فتخرج الورقة شريطًا رفيعًا. نفس صنف ورقة الزيارة.
				className="max-w-2/3! w-full gap-0"
				dir="rtl"
			>
				<SheetHeader className="p-0">
					<div className="flex items-center justify-between gap-2 border-b px-4 py-2">
						<SheetTitle className="flex items-center gap-2 font-bold text-lg">
							<p>التنويم</p>
							<IconChevronRight className="size-4 rotate-180" />
							{detail && (
								<>
									{acuity && (
										<span
											className={cn("size-2 shrink-0 rounded-full", acuity.dot)}
											aria-hidden
										/>
									)}
									<p>{detail.patient.name}</p>
									<span className="font-normal text-muted-foreground text-xs tabular-nums">
										{detail.code}
									</span>
									<Badge
										variant="outline"
										className="h-5 shrink-0 font-normal text-[10px]"
									>
										{INPATIENT_STATUS_LABELS[detail.status]}
									</Badge>
								</>
							)}
						</SheetTitle>

						<div className="flex shrink-0 items-center gap-2">
							{detail?.status === "REQUESTED" && (
								<Button
									size="sm"
									onClick={() => setAdmitOpen(true)}
								>
									إدخال
								</Button>
							)}
							{detail && nextAction && (
								<Button
									size="sm"
									disabled={transition.isPending}
									onClick={() => transition.mutate({ to: nextAction.to })}
								>
									{nextAction.label}
								</Button>
							)}
							<Button
								size="icon"
								variant="ghost"
								className="size-7"
								onClick={() => onOpenChange(false)}
								aria-label="إغلاق"
							>
								<IconX className="size-4" />
							</Button>
						</div>
					</div>
				</SheetHeader>

				{isLoading || !detail ? (
					<div className="space-y-3 p-4">
						<Skeleton className="h-10 w-1/2" />
						<Skeleton className="h-64 w-full" />
					</div>
				) : (
					<Tabs
						value={tab}
						onValueChange={setTab}
						className="flex flex-1 flex-col gap-0 overflow-hidden"
					>
						<div className="px-3 py-2">
							{/* الترتيب معكوس كما في ورقة الزيارة: مع `justify-end` في RTL
							    يظهر آخر عنصر في الشيفرة أوّلًا على الشاشة */}
							<TabsList className="w-full justify-end">
								{[...tabs].reverse().map((t) => (
									<TabsTrigger
										key={t.value}
										className="flex-none px-2.5 py-2"
										value={t.value}
									>
										{t.label}
									</TabsTrigger>
								))}
							</TabsList>
						</div>

						<Separator />

						<div className="grid min-h-0 flex-1 grid-cols-10 overflow-hidden">
							<div
								className="col-span-2 flex flex-col gap-6 overflow-y-auto border-s p-4"
								dir="rtl"
							>
								<SideRail
									detail={detail}
									readOnly={readOnly}
								/>
							</div>

							{/* العمود لا يمرّر التمرير — كل لسان يملك تمريره وحشوته واتّجاهه،
							    كما في ورقة الزيارة. و`dir="rtl"` على كل `TabsContent` ضروري:
							    جذر Radix Tabs يختم `dir="ltr"` فيرث اللسان اتّجاهًا معكوسًا. */}
							<div className="col-span-8 flex flex-col overflow-hidden">
								<TabsContent
									value="mar"
									className="flex flex-col gap-6 overflow-y-auto p-6"
									dir="rtl"
								>
									<InpatientMarTab
										stayId={detail.id}
										readOnly={readOnly}
									/>
								</TabsContent>
								<TabsContent
									value="flowsheet"
									className="flex flex-col gap-6 overflow-y-auto p-6"
									dir="rtl"
								>
									<InpatientFlowsheetTab
										stayId={detail.id}
										readOnly={readOnly}
									/>
								</TabsContent>
								<TabsContent
									value="orders"
									className="flex flex-col gap-6 overflow-y-auto p-6"
									dir="rtl"
								>
									<InpatientOrdersTab
										stayId={detail.id}
										patientId={detail.patient.id}
										ownerId={detail.owner.id}
										branchId={detail.branchId}
										readOnly={readOnly}
									/>
								</TabsContent>
								<TabsContent
									value="overview"
									className="flex flex-col gap-6 overflow-y-auto p-6"
									dir="rtl"
								>
									<OverviewTab
										detail={detail}
										readOnly={readOnly}
									/>
								</TabsContent>
								<TabsContent
									value="billing"
									className="flex flex-col gap-6 overflow-y-auto p-6"
									dir="rtl"
								>
									<BillingTab
										detail={detail}
										readOnly={readOnly}
									/>
								</TabsContent>
								<TabsContent
									value="discharge"
									className="flex flex-col gap-6 overflow-y-auto p-6"
									dir="rtl"
								>
									<DischargeTab
										detail={detail}
										readOnly={readOnly}
									/>
								</TabsContent>
							</div>
						</div>
					</Tabs>
				)}
			</SheetContent>

			{detail && (
				<AdmitRequestDialog
					stayId={detail.id}
					stayCode={detail.code}
					patientName={detail.patient.name}
					branchId={detail.branchId}
					kind={detail.kind}
					open={admitOpen}
					onOpenChange={setAdmitOpen}
				/>
			)}
		</Sheet>
	);
}

type StayDetail = {
	id: string;
	code: string;
	status: keyof typeof INPATIENT_STATUS_LABELS;
	kind: keyof typeof STAY_KIND_META;
	acuity: InpatientAcuity;
	branchId: string;
	// فارغ ما دامت الإقامة طلبًا لم يدخل بعد
	admittedAt: string | null;
	dischargedAt: string | null;
	monitoringIntervalMinutes: number;
	admissionDiagnosis: string | null;
	presentingComplaint: string | null;
	isolationReason: string | null;
	dischargeKind: string | null;
	dischargeSummaryAr: string | null;
	dischargeInstructionsAr: string | null;
	dailyRateSnapshot: string | number | null;
	patient: { id: string; name: string; code: string; animalType: { arName: string } };
	owner: { id: string; name: string; phone: string };
	attendingStaff: { id: string; name: string };
	cageAssignments: { cage: { id: string; name: string; room: { name: string } } }[];
	invoice: {
		id: string;
		code: string;
		total: string;
		amountPaid: string;
		status: string;
	} | null;
	readiness: {
		ready: boolean;
		gates: { gate: string; satisfied: boolean; label: string; overridable: boolean }[];
	} | null;
	due: {
		status: string;
		overdue: { id: string; label: string; minutesLate: number }[];
	} | null;
};

function SideRail({ detail, readOnly }: { detail: StayDetail; readOnly: boolean }) {
	const update = useUpdateInpatient(detail.id);
	const assign = useAssignCage(detail.id);
	const { cages } = useCages({ onlyFree: true });
	const { staff } = useStaff();
	const cage = detail.cageAssignments[0]?.cage;
	/**
	 * طلبٌ لم يدخل لا مدّة إقامة له — صفر لا «يوم واحد».
	 * والعدّ بالأيام التقويمية لا بالساعات المنقضية: نفس قاعدة الفاتورة
	 * (`billableDayCount`)، وإلا قرأ الطاقم «٣ أيام» هنا و«٤ أيام» على الفاتورة
	 * لإقامة واحدة، وهو ما وقع فعلًا.
	 */
	const dayStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
	const days = detail.admittedAt
		? Math.floor(
				(dayStart(new Date(detail.dischargedAt ?? Date.now())) -
					dayStart(new Date(detail.admittedAt))) /
					86_400_000,
			) + 1
		: 0;

	return (
		<div className="space-y-4 text-sm">
			<Field label="الحالة">{INPATIENT_STATUS_LABELS[detail.status]}</Field>
			<Field label="النوع">{STAY_KIND_META[detail.kind].label}</Field>

			<div className="space-y-1.5">
				<span className="text-xs text-muted-foreground">درجة الحرجية</span>
				<Select
					value={detail.acuity}
					disabled={readOnly || update.isPending}
					onValueChange={(v) => update.mutate({ acuity: v })}
				>
					<SelectTrigger className="w-full">
						<SelectValue />
					</SelectTrigger>
					<SelectContent
						position="popper"
						dir="rtl"
					>
						{Object.entries(ACUITY_META).map(([value, meta]) => (
							<SelectItem
								key={value}
								value={value}
							>
								{meta.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<p className="text-[11px] text-muted-foreground">
					ترفع أو تخفض دورية المراقبة المقترحة
				</p>
			</div>

			<div className="space-y-1.5">
				<span className="text-xs text-muted-foreground">القفص</span>
				<Select
					value={cage?.id ?? ""}
					disabled={readOnly || assign.isPending}
					onValueChange={(v) => assign.mutate({ cageId: v })}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="بلا إسكان" />
					</SelectTrigger>
					<SelectContent
						position="popper"
						dir="rtl"
					>
						{cage && (
							<SelectItem value={cage.id}>
								{cage.name} · {cage.room.name}
							</SelectItem>
						)}
						{(cages as unknown as FreeCage[]).map((c) => (
							<SelectItem
								key={c.id}
								value={c.id}
							>
								{c.name} · {c.room.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="space-y-1.5">
				<span className="text-muted-foreground text-xs">المدرّب المعالج</span>
				<Select
					value={detail.attendingStaff.id}
					disabled={readOnly || update.isPending}
					onValueChange={(v) => update.mutate({ attendingStaffId: v })}
				>
					<SelectTrigger className="w-full">
						<SelectValue />
					</SelectTrigger>
					{/* position="popper" إلزامي — الافتراضي يخرج عن الشاشة في RTL */}
					<SelectContent
						position="popper"
						dir="rtl"
					>
						{(staff as unknown as { id: string; name: string }[]).map((member) => (
							<SelectItem
								key={member.id}
								value={member.id}
							>
								{member.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<p className="text-[11px] text-muted-foreground">إليه تُصعَّد القراءات الحرجة</p>
			</div>
			<Field label="دورية المراقبة">كل {detail.monitoringIntervalMinutes} دقيقة</Field>
			<Field label="تاريخ الدخول">
				{detail.admittedAt
					? new Date(detail.admittedAt).toLocaleString("ar", { dateStyle: "medium" })
					: "لم يدخل بعد"}
			</Field>
			{detail.admittedAt && <Field label="مدّة الإقامة">{Math.max(1, days)} يوم</Field>}
			{detail.admissionDiagnosis && <Field label="التشخيص">{detail.admissionDiagnosis}</Field>}
			{detail.isolationReason && <Field label="سبب العزل">{detail.isolationReason}</Field>}
			<Field label="هاتف وليّ الأمر">
				<span dir="ltr">{detail.owner.phone}</span>
			</Field>
		</div>
	);
}

type FreeCage = { id: string; name: string; room: { name: string } };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="space-y-0.5">
			<span className="text-xs text-muted-foreground">{label}</span>
			<div className="text-sm">{children}</div>
		</div>
	);
}

/** مفتاح قالب إقرار التنويم في نظام الموافقات */
const HOSPITALIZATION_TEMPLATE_KEY = "HOSPITALIZATION_V1";

/**
 * إقرار التنويم — البوابة G3 مجسَّدة في الشاشة.
 *
 * وُجد هذا القسم لأن البوابة كانت **غير قابلة للاستيفاء من المنتج**: الخادم يعدّ
 * الإقرارات التي تحمل `inpatientStayId`، ولم يكن في الواجهة ما يُنشئ إقرارًا
 * مربوطًا بإقامة — فكانت الرسالة «لا يمكن بدء الرعاية قبل توقيع إقرار التنويم»
 * طريقًا مسدودًا لا تعليمة. القاعدة هنا صريحة: بوابةٌ لا يمكن استيفاؤها من
 * المنتج عيبٌ في المنتج لا قاعدةُ أمان.
 */
function ConsentSection({ detail, readOnly }: { detail: StayDetail; readOnly: boolean }) {
	const { consents, isLoading } = useInpatientConsents(detail.id);
	const createConsent = useCreateInpatientConsent(detail.id);
	const [openConsentId, setOpenConsentId] = useState<string | null>(null);

	const rows = consents as unknown as {
		id: string;
		type: string;
		status: string;
		templateKey: string;
		signedAt: string | null;
		revokedAt: string | null;
		signerName: string | null;
	}[];

	const hospitalization = rows.find(
		(c) => c.templateKey === HOSPITALIZATION_TEMPLATE_KEY && !c.revokedAt,
	);
	const isSigned = hospitalization?.status === "SIGNED" && !hospitalization.revokedAt;

	if (isLoading) return <Skeleton className="h-16 w-full" />;

	return (
		<>
			<div
				className={cn(
					"flex items-center gap-3 rounded border p-3",
					isSigned
						? "border-emerald-500/30 bg-emerald-500/5"
						: "border-amber-500/30 bg-amber-500/5",
				)}
			>
				{isSigned ? (
					<IconCheck className="size-4 shrink-0 text-emerald-600" />
				) : (
					<IconAlertTriangle className="size-4 shrink-0 text-amber-600" />
				)}

				<div className="min-w-0 flex-1">
					<p className="font-medium text-sm">إقرار التنويم</p>
					<p className="text-muted-foreground text-xs">
						{isSigned
							? `وقّعه ${hospitalization?.signerName ?? "وليّ الأمر"}`
							: hospitalization
								? "أُنشئ الإقرار — أكمل التشخيص وخيار الرعاية الممتدّة ثم وقّعه"
								: "لم يُنشأ بعد — بدء الرعاية محجوب حتى يُوقَّع الإقرار"}
					</p>
				</div>

				{!readOnly && (
					<Button
						size="sm"
						variant={isSigned ? "outline" : "default"}
						disabled={createConsent.isPending}
						onClick={() => {
							if (hospitalization) {
								setOpenConsentId(hospitalization.id);
								return;
							}
							createConsent.mutate(
								{
									patientId: detail.patient.id,
									templateKey: HOSPITALIZATION_TEMPLATE_KEY,
								},
								{ onSuccess: (created) => setOpenConsentId(created.id) },
							);
						}}
					>
						{isSigned ? "عرض الإقرار" : hospitalization ? "توقيع الإقرار" : "إنشاء الإقرار"}
					</Button>
				)}
			</div>

			<ConsentSheet
				consentId={openConsentId}
				patientId={detail.patient.id}
				open={Boolean(openConsentId)}
				onOpenChange={(next) => !next && setOpenConsentId(null)}
			/>
		</>
	);
}

function OverviewTab({ detail, readOnly }: { detail: StayDetail; readOnly: boolean }) {
	const { activity, isLoading } = useInpatientActivity(detail.id);
	const addNote = useAddInpatientNote(detail.id);
	const draft = useInpatientDraft(detail.id);
	const [note, setNote] = useState("");
	const [handover, setHandover] = useState(false);

	return (
		<div className="space-y-4">
			<ConsentSection
				detail={detail}
				readOnly={readOnly}
			/>

			{!readOnly && (
				<div className="space-y-2 rounded border bg-muted/30 p-3">
					<div className="flex items-center justify-between">
						<Label
							htmlFor="note"
							className="text-xs"
						>
							ملاحظة أو تسليم وردية
						</Label>
						<Button
							size="sm"
							variant="ghost"
							className="h-7 text-xs"
							disabled={draft.isPending}
							onClick={() =>
								draft.mutate("handover", {
									onSuccess: (text) => {
										setNote(text);
										setHandover(true);
									},
								})
							}
						>
							<IconSparkles className="size-3.5" />
							{draft.isPending ? "يكتب…" : "مسودّة تسليم آخر ١٢ ساعة"}
						</Button>
					</div>
					<Textarea
						id="note"
						rows={3}
						value={note}
						onChange={(e) => setNote(e.target.value)}
						placeholder="ما يحتاج الوردية التالية أن تعرفه…"
						disabled={addNote.isPending}
					/>
					<div className="flex items-center gap-2">
						<Button
							size="sm"
							disabled={note.trim().length === 0 || addNote.isPending}
							onClick={() =>
								addNote.mutate({ body: note, handover }, { onSuccess: () => setNote("") })
							}
						>
							إضافة
						</Button>
						<label className="flex items-center gap-1.5 text-xs text-muted-foreground">
							<input
								type="checkbox"
								checked={handover}
								onChange={(e) => setHandover(e.target.checked)}
								className="size-3.5 accent-[var(--primary)]"
							/>
							تسليم وردية
						</label>
					</div>
				</div>
			)}

			<div>
				<h3 className="mb-2 text-sm font-medium">سجل الإقامة</h3>
				{isLoading ? (
					<Skeleton className="h-32 w-full" />
				) : activity.length === 0 ? (
					<p className="text-xs text-muted-foreground">لا نشاط بعد</p>
				) : (
					<ol className="space-y-2">
						{(activity as unknown as ActivityRow[]).map((row) => (
							<li
								key={row.id}
								className="flex gap-2.5 border-b pb-2 last:border-0"
							>
								<span
									className={cn(
										"mt-1.5 size-1.5 shrink-0 rounded-full",
										row.type === "ALERT" || row.type === "COMPLICATION"
											? "bg-destructive"
											: "bg-muted-foreground/40",
									)}
									aria-hidden
								/>
								<div className="min-w-0 flex-1">
									<p className="text-xs">{row.body ?? row.type}</p>
									<p className="text-[10px] text-muted-foreground">
										{row.author?.name ?? "النظام"} ·{" "}
										{new Date(row.createdAt).toLocaleString("ar", {
											dateStyle: "short",
											timeStyle: "short",
										})}
									</p>
								</div>
							</li>
						))}
					</ol>
				)}
			</div>
		</div>
	);
}

type ActivityRow = {
	id: string;
	type: string;
	body: string | null;
	createdAt: string;
	author: { name: string } | null;
};

const LINE_KIND_META: Record<
	InpatientInvoiceLine["kind"],
	{ label: string; className: string }
> = {
	ACCOMMODATION: { label: "إقامة", className: "border-slate-200 bg-slate-50 text-slate-700" },
	MEDICATION: { label: "دواء", className: "border-violet-200 bg-violet-50 text-violet-700" },
	LAB: { label: "تحليل", className: "border-sky-200 bg-sky-50 text-sky-700" },
	IMAGING: { label: "أشعّة", className: "border-amber-200 bg-amber-50 text-amber-700" },
};

/** Decimal يصل نصًّا — يُنسَّق بالنص لتفادي فقد الدقة */
const money = (v: unknown) => {
	const n = Number(v ?? 0);
	return Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "0";
};
const lineTimeFmt = new Intl.DateTimeFormat("ar", { dateStyle: "short", timeStyle: "short" });

/**
 * لسان الفاتورة — نفس بنية فاتورة المختبر: بطاقات، فشريط الإجمالي بزرّ الدفع،
 * فجدول البنود. الفرق الجوهري أنّ البنود هنا **تتراكم بالتنفيذ**: يوم إقامة
 * يُضاف كل يوم، وجرعة تُضاف حين تُعطى، وتحليل حين يكتمل — فالجدول يجيب عن
 * «لماذا هذا الرقم؟» لا يعرض رقمًا فقط.
 */
function BillingTab({ detail, readOnly }: { detail: StayDetail; readOnly: boolean }) {
	const { invoice, isLoading } = useInpatientInvoice(detail.id);
	const pay = usePayInpatientInvoice(detail.id);
	const [paying, setPaying] = useState(false);
	const [amount, setAmount] = useState("");
	const [method, setMethod] = useState("CASH");

	if (isLoading) return <Skeleton className="h-48 w-full" />;
	if (!invoice) return <p className="text-sm text-muted-foreground">لا فاتورة بعد</p>;

	const inv = invoice as unknown as {
		code: string;
		subtotal: string;
		vatRate: string;
		vatAmount: string;
		discount: string;
		total: string;
		amountPaid: string;
		status: string;
		days: number;
		/**
		 * `at` مُعلَن `string` على الخادم لكنّه يصل **كائن `Date`**: Eden Treaty
		 * يحوّل سلاسل ISO تلقائيًّا عند القراءة. لذلك تُوسَّع هنا كما في بقيّة
		 * أنواع هذه الوحدة (`startAt` و`admittedAt`) — ومقارنتها نصيًّا كانت
		 * تُسقط لسان الفاتورة كلّه بـ«localeCompare is not a function».
		 */
		lines: (Omit<InpatientInvoiceLine, "at"> & { at: string | Date | null })[];
	};
	const total = Number(inv.total);
	const paid = Number(inv.amountPaid);
	const remaining = Math.max(0, total - paid);
	const isPaid = inv.status === "PAID" || (total > 0 && remaining === 0);
	const isPartial = paid > 0 && !isPaid;
	const canPay = !readOnly && !isPaid && total > 0;
	const paymentMeta = isPaid
		? { label: "مدفوعة", className: "border-emerald-200 bg-emerald-50 text-emerald-700" }
		: isPartial
			? { label: "مدفوعة جزئيًا", className: "border-amber-200 bg-amber-50 text-amber-700" }
			: total > 0
				? { label: "غير مدفوعة", className: "border-red-200 bg-red-50 text-red-700" }
				: {
						label: "لا مستحقّات بعد",
						className: "border-border bg-muted text-muted-foreground",
					};
	// الترتيب بالطابع الزمني لا بمقارنة نصّية — النوع الواصل قد يكون نصًّا أو Date
	const atMs = (v: string | Date | null) => (v ? new Date(v).getTime() : 0);
	const lines = [...(inv.lines ?? [])].sort((a, b) => atMs(a.at) - atMs(b.at));

	return (
		<div className="flex flex-col gap-6">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div className="rounded-lg border bg-card p-4">
					<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
						<IconBedFlat className="size-3.5" />
						<span>أيام الإقامة</span>
					</div>
					<p className="mt-2 text-2xl font-semibold tabular-nums">{inv.days}</p>
				</div>
				<div className="rounded-lg border bg-card p-4">
					<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
						<IconReceipt className="size-3.5" />
						<span>رقم الفاتورة</span>
					</div>
					<p className="mt-2 text-2xl font-semibold tabular-nums">{inv.code}</p>
					<p className="mt-1 truncate text-xs text-muted-foreground">
						المسدَّد: {money(paid)} ر.س
					</p>
				</div>
				<div className="rounded-lg border bg-card p-4">
					<div className="flex items-center justify-between gap-2">
						<p className="text-xs text-muted-foreground">المتبقّي</p>
						<Badge
							variant="outline"
							className={cn("rounded-full px-2 py-0.5 text-[11px]", paymentMeta.className)}
						>
							{paymentMeta.label}
						</Badge>
					</div>
					<p className="mt-2 text-2xl font-semibold tabular-nums">{money(remaining)} ر.س</p>
				</div>
			</div>

			<div className="rounded-lg border bg-card">
				<div className="flex items-center justify-between gap-3 p-4">
					<div>
						<p className="text-xs text-muted-foreground">إجمالي الفاتورة</p>
						<p className="mt-2 text-2xl font-semibold tabular-nums">{money(total)} ر.س</p>
						<p className="mt-1 text-xs tabular-nums text-muted-foreground">
							قبل الضريبة {money(inv.subtotal)} · ضريبة {money(inv.vatAmount)}
							{Number(inv.discount) > 0 && ` · خصم ${money(inv.discount)}`}
						</p>
					</div>
					{canPay && (
						<Button
							type="button"
							size="sm"
							className="gap-1.5"
							onClick={() => setPaying((v) => !v)}
							disabled={pay.isPending}
						>
							<IconReceipt className="size-3.5" />
							{isPartial ? "تسجيل دفعة" : "دفع الكل"}
						</Button>
					)}
				</div>

				{canPay && paying && (
					<div className="space-y-3 border-t bg-muted/30 p-4">
						<div className="grid gap-3 sm:grid-cols-2">
							<div className="space-y-1.5">
								<Label
									htmlFor="pay-amount"
									className="text-xs"
								>
									المبلغ
								</Label>
								<Input
									id="pay-amount"
									inputMode="decimal"
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									placeholder={remaining.toFixed(2)}
									disabled={pay.isPending}
								/>
							</div>
							<div className="space-y-1.5">
								<Label className="text-xs">طريقة الدفع</Label>
								<Select
									value={method}
									onValueChange={setMethod}
								>
									<SelectTrigger className="w-full">
										<SelectValue />
									</SelectTrigger>
									<SelectContent
										position="popper"
										dir="rtl"
									>
										<SelectItem value="CASH">نقدًا</SelectItem>
										<SelectItem value="CARD">بطاقة</SelectItem>
										<SelectItem value="TRANSFER">تحويل</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Button
								size="sm"
								disabled={pay.isPending}
								onClick={() =>
									pay.mutate(
										{
											amountPaid: amount ? Number(amount) : remaining,
											paymentMethod: method as never,
										},
										{
											onSuccess: () => {
												setPaying(false);
												setAmount("");
											},
										},
									)
								}
							>
								تأكيد الدفعة
							</Button>
							<Button
								size="sm"
								variant="ghost"
								disabled={pay.isPending}
								onClick={() => setPaying(false)}
							>
								إلغاء
							</Button>
						</div>
					</div>
				)}
			</div>

			<div className="flex flex-col gap-3">
				<div className="flex items-center justify-between">
					<h3 className="text-base font-semibold">البنود</h3>
					<span className="text-xs text-muted-foreground">
						تُضاف بالتنفيذ: يوم الإقامة، الجرعة المُعطاة، التحليل المكتمل — لا دفع مسبق
					</span>
				</div>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-start">البند</TableHead>
								<TableHead className="text-center">النوع</TableHead>
								<TableHead className="text-center">الكمية</TableHead>
								<TableHead className="text-center">سعر الوحدة</TableHead>
								<TableHead className="text-center">الإجمالي</TableHead>
								<TableHead className="text-center">الوقت</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{lines.length === 0 && (
								<TableRow>
									<TableCell
										colSpan={6}
										className="text-center text-sm text-muted-foreground"
									>
										لا بنود بعد — تظهر هنا مع أوّل يوم إقامة أو أوّل جرعة تُعطى
									</TableCell>
								</TableRow>
							)}
							{lines.map((line, i) => {
								const meta = LINE_KIND_META[line.kind];
								return (
									<TableRow key={`${line.kind}-${line.at ?? i}-${line.label}`}>
										<TableCell className="text-sm font-medium">{line.label}</TableCell>
										<TableCell className="text-center">
											<Badge
												variant="outline"
												className={cn("rounded-full text-[11px]", meta.className)}
											>
												{meta.label}
											</Badge>
										</TableCell>
										<TableCell className="text-center text-sm tabular-nums">
											{line.qty}
											{line.kind === "ACCOMMODATION" && " يوم"}
										</TableCell>
										<TableCell className="text-center text-sm tabular-nums text-muted-foreground">
											{money(line.unitPrice)}
										</TableCell>
										<TableCell className="text-center text-sm font-medium tabular-nums">
											{money(line.amount)} ر.س
										</TableCell>
										<TableCell className="text-center text-xs text-muted-foreground tabular-nums">
											{line.at ? lineTimeFmt.format(new Date(line.at)) : "—"}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}

function DischargeTab({ detail, readOnly }: { detail: StayDetail; readOnly: boolean }) {
	const discharge = useDischargeInpatient(detail.id);
	const draft = useInpatientDraft(detail.id);
	const [kind, setKind] = useState("ROUTINE");
	const [summary, setSummary] = useState(detail.dischargeSummaryAr ?? "");
	const [instructions, setInstructions] = useState(detail.dischargeInstructionsAr ?? "");
	const [overrideReason, setOverrideReason] = useState("");

	if (readOnly) {
		return (
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<h3 className="text-sm font-medium">تقرير الخروج</h3>
					<Button
						size="sm"
						variant="outline"
						onClick={() =>
							printDischargeSummary({
								code: detail.code,
								patient: detail.patient,
								owner: detail.owner,
								attendingStaff: detail.attendingStaff,
								admittedAt: detail.admittedAt,
								dischargedAt: detail.dischargedAt,
								dischargeKindLabel:
									DISCHARGE_KIND_LABELS[
										detail.dischargeKind as keyof typeof DISCHARGE_KIND_LABELS
									] ?? "—",
								admissionDiagnosis: detail.admissionDiagnosis,
								dischargeSummaryAr: detail.dischargeSummaryAr,
								dischargeInstructionsAr: detail.dischargeInstructionsAr,
							})
						}
					>
						<IconPrinter className="size-4" />
						طباعة
					</Button>
				</div>
				<p className="whitespace-pre-wrap rounded border bg-muted/30 p-3 text-sm">
					{detail.dischargeSummaryAr ?? "—"}
				</p>
				{detail.dischargeInstructionsAr && (
					<>
						<h3 className="text-sm font-medium">تعليمات وليّ الأمر</h3>
						<p className="whitespace-pre-wrap rounded border bg-muted/30 p-3 text-sm">
							{detail.dischargeInstructionsAr}
						</p>
					</>
				)}
			</div>
		);
	}

	const gates = detail.readiness?.gates ?? [];
	const blocked = gates.filter((g) => !g.satisfied);

	return (
		<div className="space-y-4">
			{/* قائمة الجاهزية — اقتراح لا منع، والقرار للمدرّب */}
			<div className="rounded border">
				<div className="border-b px-4 py-2">
					<h3 className="text-sm font-medium">جاهزية الخروج</h3>
				</div>
				<ul className="divide-y">
					{gates.map((gate) => (
						<li
							key={gate.gate}
							className="flex items-start gap-2 px-4 py-2 text-xs"
						>
							{gate.satisfied ? (
								<IconCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
							) : (
								<IconAlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
							)}
							<span className={cn(gate.satisfied && "text-muted-foreground")}>
								{gate.label}
							</span>
							{!gate.satisfied && !gate.overridable && (
								<Badge
									variant="outline"
									className="ms-auto h-4 shrink-0 px-1 text-[10px]"
								>
									لا يُتجاوز
								</Badge>
							)}
						</li>
					))}
				</ul>
			</div>

			<div className="space-y-1.5">
				<Label className="text-xs">طريقة الخروج</Label>
				<Select
					value={kind}
					onValueChange={setKind}
				>
					<SelectTrigger className="w-full">
						<SelectValue />
					</SelectTrigger>
					<SelectContent
						position="popper"
						dir="rtl"
					>
						<SelectItem value="ROUTINE">خروج طبيعي</SelectItem>
						<SelectItem value="AGAINST_MEDICAL_ADVICE">خروج رغم المشورة الطبية</SelectItem>
						<SelectItem value="TRANSFERRED">تحويل لمنشأة أخرى</SelectItem>
						<SelectItem value="DIED">نفق</SelectItem>
						<SelectItem value="EUTHANIZED">تيسير الموت</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="space-y-1.5">
				<div className="flex items-center justify-between">
					<Label
						htmlFor="summary"
						className="text-xs"
					>
						تقرير الخروج <span className="text-destructive">*</span>
					</Label>
					{/* مسودّة تُكتب في الحقل ليعدّلها المدرّب — لا تُحفظ ولا تُقفل بها إقامة */}
					<Button
						size="sm"
						variant="ghost"
						className="h-7 text-xs"
						disabled={draft.isPending}
						onClick={() =>
							draft.mutate("discharge-summary", { onSuccess: (text) => setSummary(text) })
						}
					>
						<IconSparkles className="size-3.5" />
						{draft.isPending ? "يكتب…" : "مسودّة من وقائع الإقامة"}
					</Button>
				</div>
				<Textarea
					id="summary"
					rows={5}
					value={summary}
					onChange={(e) => setSummary(e.target.value)}
					placeholder="ما جرى خلال الإقامة، وما استجاب له الطفل، وحالته عند الخروج…"
					disabled={discharge.isPending}
				/>
			</div>

			<div className="space-y-1.5">
				<Label
					htmlFor="instructions"
					className="text-xs"
				>
					تعليمات وليّ الأمر
				</Label>
				<Textarea
					id="instructions"
					rows={4}
					value={instructions}
					onChange={(e) => setInstructions(e.target.value)}
					placeholder="الأدوية المنزلية، موعد المراجعة، علامات تستدعي العودة فورًا…"
					disabled={discharge.isPending}
				/>
			</div>

			{blocked.some((g) => g.overridable) && (
				<div className="space-y-1.5">
					<Label
						htmlFor="override"
						className="text-xs"
					>
						سبب التجاوز (للمتطلّبات القابلة للتجاوز)
					</Label>
					<Input
						id="override"
						value={overrideReason}
						onChange={(e) => setOverrideReason(e.target.value)}
						disabled={discharge.isPending}
					/>
				</div>
			)}

			<Button
				disabled={summary.trim().length < 10 || discharge.isPending}
				onClick={() =>
					discharge.mutate({
						dischargeKind: kind,
						dischargeSummaryAr: summary,
						dischargeInstructionsAr: instructions || null,
						overrideReason: overrideReason || null,
					})
				}
			>
				إنهاء الإقامة
			</Button>
		</div>
	);
}
