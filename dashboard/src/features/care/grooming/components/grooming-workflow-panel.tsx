import {
	IconAlertTriangle,
	IconArrowLeft,
	IconChevronDown,
	IconCircleCheck,
	IconCircleDashed,
	IconX,
} from "@tabler/icons-react";
import { type ReactNode, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	type BlockedMove,
	GroomingGateOverrideDialog,
} from "@/features/care/grooming/components/grooming-gate-override-dialog";
import { GroomingIntakeForm } from "@/features/care/grooming/components/grooming-intake-form";
import { GroomingPhotoPanel } from "@/features/care/grooming/components/grooming-photo-panel";
import { GroomingReportCardForm } from "@/features/care/grooming/components/grooming-report-card-form";
import { GroomingStepper } from "@/features/care/grooming/components/grooming-stepper";
import { GroomingSummaryReport } from "@/features/care/grooming/components/grooming-summary-report";
import {
	GroomingGateError,
	isGateOverridable,
	useGroomingMutations,
} from "@/features/care/grooming/hooks/use-grooming";
import {
	GroomingDryingMethod,
	GroomingPhotoKind,
	GroomingStatus,
} from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import type { GroomingSessionDetail } from "@/server/grooming/grooming.type";
import {
	GROOMING_DRYING_METHOD_LABELS,
	GROOMING_PATHWAY,
	GROOMING_STATUS_LABELS,
	HEAT_SAFE_DRYING_METHODS,
	isGroomingTerminalStatus,
} from "@sanad/contracts/runtime/server/grooming/grooming.workflow";

const dtFmt = new Intl.DateTimeFormat("ar", { dateStyle: "short", timeStyle: "short" });
const fmt = (v: Date | string | null) => (v ? dtFmt.format(new Date(v)) : "—");

const nextStatusOf = (status: GroomingStatus): GroomingStatus | null => {
	const i = (GROOMING_PATHWAY as readonly GroomingStatus[]).indexOf(status);
	return i >= 0 && i < GROOMING_PATHWAY.length - 1 ? GROOMING_PATHWAY[i + 1] : null;
};

/** بند متطلَّب — علامة صحّ خضراء أو دائرة رمادية، فيُقرأ الاستيفاء بنظرة */
function Requirement({ met, children }: { met: boolean; children: ReactNode }) {
	return (
		<div className="flex items-start gap-2 py-1 text-sm">
			{met ? (
				<IconCircleCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
			) : (
				<IconCircleDashed className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
			)}
			<span className={cn("min-w-0", !met && "text-muted-foreground")}>{children}</span>
		</div>
	);
}

function StepSection({ title, children }: { title: string; children: ReactNode }) {
	return (
		<div className="flex flex-col gap-2">
			<p className="font-medium text-sm">{title}</p>
			{children}
		</div>
	);
}

/**
 * تفاصيل ثانوية خلف زر «معلومات إضافية» — لا تُعرض إلا عند الطلب.
 *
 * ما يُطوى هنا ليس اختياريًا بالضرورة، بل *مقروء بسطر واحد بعد استيفائه*: طريقة
 * التجفيف تُختار مرّة ثم تصبح حقيقة تُقرأ لا قرارًا يُتّخذ، فيبقى منها سطر الخلاصة
 * ويختفي صفّ الأزرار.
 *
 * وما دام `incomplete` يُعرض مكشوفًا **بلا زر أصلًا**. لا لأن الطيّ يضرّ فحسب —
 * بوابةٌ تمنع الانتقال وسببها خلف نقرة لا يعرف المستخدم أنها هناك — بل لأن زرًّا
 * يظهر ولا يطوي شيئًا يُقرأ عُطلًا. الزر يظهر حين يصير له معنى: بعد الاستيفاء.
 */
function ExtraInfoSection({
	summary,
	incomplete,
	children,
}: {
	/** سطر الخلاصة المعروض وهو مطويّ — ما استُوفي فعلًا */
	summary: ReactNode;
	/** المطلوب داخله ما زال ناقصًا: يُعرض مكشوفًا بلا زر */
	incomplete: boolean;
	children: ReactNode;
}) {
	const [open, setOpen] = useState(false);

	if (incomplete) return <div className="flex flex-col gap-2">{children}</div>;

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-2">
				<Button
					type="button"
					size="sm"
					variant="ghost"
					className="h-7 gap-1.5 px-2 text-muted-foreground text-xs"
					aria-expanded={open}
					onClick={() => setOpen((v) => !v)}
				>
					{/* شيفرون رأسيّ — لا يُعكس في RTL فلا يحتاج rtl:rotate-180 */}
					<IconChevronDown
						className={cn("size-3.5 transition-transform", open && "rotate-180")}
					/>
					معلومات إضافية
				</Button>
				{!open && <div className="min-w-0 text-muted-foreground text-xs">{summary}</div>}
			</div>
			{open && <div className="flex flex-col gap-2">{children}</div>}
		</div>
	);
}

/**
 * لوحة سير العمل — لوحة جانبية ثانية بجوار ورقة الجلسة، لا فوقها.
 *
 * نفس نمط لوحة الفحص في الأشعّة: تُرسم داخل الورقة الأم فتبقى غشاوتها كما هي،
 * وتنزلق إلى جانب الورقة بدل أن تحجبها — المُجمِّل يقرأ بيانات الطفل وهو ينفّذ.
 *
 * **لكل خطوة صفحتها**، حتى الخطوة التي لا فعل فيها: المسار الذي يعرض شيئًا في
 * خطوة ولا شيء في أخرى يبدو معطوبًا، ويترك المستخدم يحزر أين ذهب المحتوى.
 * الخطوة الفارغة تقول صراحةً ما المنتظَر فيها ومَن ينتظره.
 */
export function GroomingWorkflowPanel({
	session,
	open,
	onClose,
}: {
	session: GroomingSessionDetail;
	open: boolean;
	onClose: () => void;
}) {
	const {
		moveSession,
		setDryingMethod,
		approveQuote,
		approveShaveDown,
		issueInvoice,
		isPending,
	} = useGroomingMutations();
	const [blocked, setBlocked] = useState<BlockedMove | null>(null);
	// الخطوة المعروضة تتبع حالة الجلسة، ويستطيع المستخدم تصفّح غيرها من المسار
	const [step, setStep] = useState<GroomingStatus>(session.status);

	useEffect(() => {
		setStep(session.status);
	}, [session.status]);

	if (!open) return null;

	const next = nextStatusOf(session.status);
	const intake = session.intake;
	const heatProhibited = intake?.heatDryProhibitedSnapshot === true;
	const permittedMethods = heatProhibited
		? HEAT_SAFE_DRYING_METHODS
		: (Object.values(GroomingDryingMethod) as GroomingDryingMethod[]);
	// البوابة G5 نفسها، مقروءةً على العميل: بها وحدها يُعرف هل بقيت طريقة التجفيف
	// قرارًا مُعلَّقًا (فيُفتح قسم «معلومات إضافية») أم صارت حقيقة تُقرأ بسطر.
	const dryingMethodSettled =
		session.dryingMethod != null &&
		(!heatProhibited ||
			(HEAT_SAFE_DRYING_METHODS as readonly GroomingDryingMethod[]).includes(
				session.dryingMethod,
			));
	const afterPhotos = session.photos.filter((p) => p.kind === "AFTER").length;
	const openIncidents = session.incidents.filter(
		(i) => i.severity !== "MINOR" && !i.resolvedAt,
	).length;

	const advance = () => {
		if (!next) return;
		void moveSession({ id: session.id, to: next }).catch((e: unknown) => {
			if (e instanceof GroomingGateError && isGateOverridable(e.gate)) {
				setBlocked({
					sessionId: session.id,
					to: next,
					gate: e.gate as string,
					message: e.message,
				});
			}
		});
	};

	/** صفحة الخطوة المختارة — لكل خطوة محتواها، ولا خطوة بلا صفحة */
	const stepPage = (() => {
		switch (step) {
			case GroomingStatus.SCHEDULED:
				return (
					<StepSection title="الحجز">
						<Requirement met>الموعد: {fmt(session.scheduledAt)}</Requirement>
						<Requirement met={!!session.groomer?.user?.name}>
							المُجمِّل: {session.groomer?.user?.name ?? "غير مُسنَد"}
						</Requirement>
						<Requirement met={session.items.length > 0}>
							{session.items.length} دورة محجوزة
						</Requirement>
						<p className="pt-1 text-muted-foreground text-xs leading-relaxed">
							الخطوة التالية تبدأ بوصول الطفل — انقل الجلسة إلى «الاستلام» عند حضور وليّ الأمر.
						</p>
					</StepSection>
				);

			case GroomingStatus.CHECK_IN:
				return (
					<StepSection title="متطلّبات الاستلام">
						<Requirement met={intake?.rabiesValidUntil != null}>
							تطعيم السعار سارٍ ومكتمل المناعة
							{intake?.rabiesValidUntil ? ` حتى ${fmt(intake.rabiesValidUntil)}` : ""}
						</Requirement>
						<Requirement met={!!intake?.vaccinationOverrideReason}>
							أو تجاوز مسجَّل بسببه
						</Requirement>
						<Requirement met={false}>إقرار التجميل موقَّع من وليّ الأمر</Requirement>
						<p className="pt-1 text-muted-foreground text-xs leading-relaxed">
							يُفحص التطعيم والإقرار على الخادم عند الانتقال إلى «الفحص القبلي». الجرعة ليست
							حماية لحظة حقنها: لا تُحتسب قبل انقضاء فترة اكتساب المناعة المسجَّلة على اللقاح (٢١
							يومًا للسعار)، وسبب الرفض يذكر تاريخ بدء الحماية. البوابة تقبل تجاوزًا بسبب مسجَّل إن
							لزم.
						</p>
					</StepSection>
				);

			case GroomingStatus.INTAKE:
				return (
					<div className="flex flex-col gap-4">
						<StepSection title="الفحص القبلي">
							<GroomingIntakeForm session={session} />
						</StepSection>

						{/* صور «قبل» تُثبت حالة الفرو التي بُني عليها السعر والرسوم */}
						<GroomingPhotoPanel
							session={session}
							kind={GroomingPhotoKind.BEFORE}
							title="صور «قبل»"
							description="حالة الفرو عند الاستلام — عليها تقوم رسوم التعقّد وقرار الحلاقة الاضطرارية."
						/>
					</div>
				);

			case GroomingStatus.IN_PROGRESS:
				return (
					<div className="flex flex-col gap-4">
						<StepSection title="الدورات المنفَّذة">
							{session.items.length === 0 ? (
								<p className="text-muted-foreground text-xs">لا دورات على الجلسة</p>
							) : (
								session.items.map((item) => (
									<Requirement
										key={item.id}
										met={item.performed}
									>
										{item.nameSnapshot}
									</Requirement>
								))
							)}
						</StepSection>

						{intake?.shaveDownRecommended && !intake.shaveDownApprovedAt && (
							<div className="rounded-[4px] border border-destructive/40 bg-destructive/5 p-3">
								<p className="mb-2 flex items-center gap-1.5 font-medium text-sm">
									<IconAlertTriangle className="size-4" />
									الفرو يستلزم حلاقة اضطرارية
								</p>
								<Button
									size="sm"
									disabled={isPending}
									onClick={() => {
										void approveShaveDown(session.id).catch(() => {});
									}}
								>
									تسجيل موافقة وليّ الأمر
								</Button>
							</div>
						)}
					</div>
				);

			case GroomingStatus.FINISHING:
				return (
					<div className="flex flex-col gap-4">
						<ExtraInfoSection
							incomplete={!dryingMethodSettled}
							summary={
								session.dryingMethod
									? `طريقة التجفيف: ${GROOMING_DRYING_METHOD_LABELS[session.dryingMethod]}`
									: "طريقة التجفيف"
							}
						>
							<p className="font-medium text-sm">طريقة التجفيف</p>
							{heatProhibited && (
								<p className="text-destructive text-xs">
									ممنوع التجفيف الحارّ — {intake?.heatDryReasonsSnapshot?.join(" · ")}
								</p>
							)}
							<div className="flex flex-wrap gap-2">
								{permittedMethods.map((method) => (
									<Button
										key={method}
										size="sm"
										variant={session.dryingMethod === method ? "default" : "outline"}
										disabled={isPending}
										onClick={() => {
											void setDryingMethod({ id: session.id, method }).catch(() => {});
										}}
									>
										{GROOMING_DRYING_METHOD_LABELS[method]}
									</Button>
								))}
							</div>
						</ExtraInfoSection>

						<StepSection title="فحص ما بعد التجميل">
							<Requirement met={afterPhotos > 0}>صور «بعد» موثَّقة ({afterPhotos})</Requirement>
							<Requirement met={session.items.every((i) => i.performed)}>
								كل دورة مُعلَّمة منفَّذة ({session.items.filter((i) => i.performed).length} من{" "}
								{session.items.length})
							</Requirement>
						</StepSection>

						{/* الصور تُلتقط هنا لا في صفحة منفصلة: بعد هذه الخطوة يغادر الطفل،
						    ولا أحد يعود لتوثيق حالةٍ لم تعد أمامه */}
						<GroomingPhotoPanel
							session={session}
							kind={GroomingPhotoKind.AFTER}
							title="صور «بعد»"
							description="وثّق النتيجة قبل التسليم — هذه الصور هي ما يُحتكم إليه إن اختلف وليّ الأمر على ما جرى."
						/>
					</div>
				);

			case GroomingStatus.READY:
				return (
					<StepSection title="جاهز للاستلام">
						<Requirement met={session.ownerApprovedQuoteAt != null}>
							إقرار وليّ الأمر للتسعيرة
						</Requirement>
						{!session.ownerApprovedQuoteAt && (
							<Button
								size="sm"
								variant="outline"
								disabled={isPending}
								onClick={() => {
									void approveQuote(session.id).catch(() => {});
								}}
							>
								تسجيل إقرار وليّ الأمر
							</Button>
						)}
						<Requirement met={session.invoice != null}>
							الفاتورة صادرة
							{session.invoice ? ` — ${Number(session.invoice.total)} ر.س` : ""}
						</Requirement>
						{!session.invoice && (
							<Button
								size="sm"
								variant="outline"
								disabled={isPending}
								onClick={() => {
									void issueInvoice(session.id).catch(() => {});
								}}
							>
								إصدار الفاتورة الآن
							</Button>
						)}
						<Requirement met={session.invoice?.status === "PAID"}>مسدَّدة</Requirement>
						<p className="pt-1 text-muted-foreground text-xs leading-relaxed">
							التحصيل وتفصيل البنود في تبويب «الفاتورة» من ورقة الجلسة.
						</p>
					</StepSection>
				);

			case GroomingStatus.PICKED_UP:
				return (
					<div className="flex flex-col gap-4">
						<StepSection title="التسليم والإقفال">
							<Requirement met={session.pickedUpAt != null}>
								سُلِّم في {fmt(session.pickedUpAt)}
							</Requirement>
							<Requirement met={openIncidents === 0}>
								لا حوادث مفتوحة{openIncidents > 0 ? ` (${openIncidents})` : ""}
							</Requirement>
							<Requirement met={session.reportCard != null}>تقرير الجلسة صادر</Requirement>
							<p className="pt-1 text-muted-foreground text-xs leading-relaxed">
								الإقفال يتطلب إغلاق كل حادثة متوسطة فأعلى بتقييم مدرّب وإبلاغ وليّ الأمر — بوابة لا
								تقبل تجاوزًا.
							</p>
						</StepSection>

						{/* التقرير شرطُ الإقفال، ولم يكن له نموذج — متطلَّب يُعرض ولا يُستوفى */}
						<StepSection title="تقرير الجلسة للوليّ أمر">
							<GroomingReportCardForm session={session} />
						</StepSection>
					</div>
				);

			case GroomingStatus.COMPLETED:
				return session.status === GroomingStatus.COMPLETED ? (
					<GroomingSummaryReport session={session} />
				) : (
					<StepSection title="الإقفال">
						<p className="text-muted-foreground text-xs leading-relaxed">
							تُقفل الجلسة بعد التسليم، فيصدر تقريرها الكامل هنا ويصير قابلًا للطباعة والتسليم
							للوليّ أمر.
						</p>
						<Requirement met={session.pickedUpAt != null}>سُلِّم الطفل</Requirement>
						<Requirement met={session.reportCard != null}>تقرير الجلسة صادر</Requirement>
						<Requirement met={openIncidents === 0}>لا حوادث مفتوحة</Requirement>
					</StepSection>
				);

			default:
				return (
					<StepSection title={GROOMING_STATUS_LABELS[step]}>
						<p className="text-muted-foreground text-xs">لا إجراءات في هذه الخطوة.</p>
					</StepSection>
				);
		}
	})();

	return (
		<>
			<aside
				dir="rtl"
				aria-label="سير عمل الجلسة"
				className={cn(
					"fixed inset-y-2 z-50 flex flex-col gap-0 rounded-lg border bg-popover text-popover-foreground text-sm shadow-lg",
					"transition-[left,right] duration-300 ease-out",
					"left-[calc(66.6667%+1rem)] right-2",
				)}
			>
				<div className="flex items-center justify-between gap-2 border-b px-4 py-2">
					<div className="flex min-w-0 items-center gap-2">
						<h2 className="truncate font-bold text-base">سير العمل</h2>
						<Badge
							variant="outline"
							className="shrink-0 text-[10px]"
						>
							{GROOMING_STATUS_LABELS[step]}
						</Badge>
					</div>
					<Button
						size="sm"
						variant="ghost"
						onClick={onClose}
					>
						<IconX className="size-4" />
					</Button>
				</div>

				<div className="border-b px-4 py-3">
					<GroomingStepper
						status={session.status}
						selected={step}
						interrupted={
							isGroomingTerminalStatus(session.status) &&
							session.status !== GroomingStatus.COMPLETED
						}
						onStepClick={setStep}
					/>
				</div>

				<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
					{step !== session.status && (
						<p className="rounded-[4px] bg-muted p-2 text-muted-foreground text-xs">
							تعرض خطوة «{GROOMING_STATUS_LABELS[step]}» — الجلسة الآن في «
							{GROOMING_STATUS_LABELS[session.status]}».
						</p>
					)}
					{stepPage}
				</div>

				<div className="flex items-center gap-2 border-t px-4 py-2">
					{next && (
						<Button
							size="sm"
							className="gap-1.5 bg-indigo-600 primaryhover:bg-indigo-700"
							disabled={isPending}
							onClick={advance}
						>
							<IconArrowLeft className="size-3.5 rtl:rotate-180" />
							نقل إلى «{GROOMING_STATUS_LABELS[next]}»
						</Button>
					)}
					<Button
						size="sm"
						variant="outline"
						onClick={onClose}
					>
						إغلاق
					</Button>
				</div>
			</aside>

			<GroomingGateOverrideDialog
				blocked={blocked}
				onClose={() => setBlocked(null)}
			/>
		</>
	);
}
