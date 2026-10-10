import {
	IconAlertTriangleFilled,
	IconCalendar,
	IconCheck,
	IconChecklist,
	IconChevronRight,
	IconCircleCheck,
	IconCopy,
	IconEyeOff,
	IconFlask,
	IconMessage,
	IconShieldCheck,
	IconX,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PRIORITY_META } from "@/features/appointments/data/status-meta";
import { LabCustodyChain } from "@/features/services/lab-tests/components/lab-custody-chain";
import { LabInvoiceTab } from "@/features/services/lab-tests/components/lab-invoice-tab";
import { LabOrderActivity } from "@/features/services/lab-tests/components/lab-order-activity";
import { LabOrderComments } from "@/features/services/lab-tests/components/lab-order-comments";
import { LabOrderTestsTable } from "@/features/services/lab-tests/components/lab-order-tests-table";
import { LabQcReviewDialog } from "@/features/services/lab-tests/components/lab-qc-review-dialog";
import { LabTestConfirmDialog } from "@/features/services/lab-tests/components/lab-test-confirm-dialog";
import { LabTestDeclineDialog } from "@/features/services/lab-tests/components/lab-test-decline-dialog";
import { LabTestItemPanel } from "@/features/services/lab-tests/components/lab-test-item-panel";
import { useLabTest } from "@/features/services/lab-tests/hooks/use-lab-test";
import {
	type LabTestSheetTab,
	useSelectedLabTestStore,
} from "@/features/services/lab-tests/stores/selected-lab-test.store";
import { summarizeLabOrder } from "@/features/services/lab-tests/utils/lab-order-summary";
import { SopRunPanel } from "@/features/services/sops/components/sop-run-panel";
import { useSopRun } from "@/features/services/sops/hooks/use-sop-run";
import { LabTestStatus, SopDomain } from "@/generated/prisma/enums";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import {
	canLeaveQueue,
	LAB_PAYMENT_META,
	paymentBlockMessage,
} from "@sanad/contracts/runtime/server/lab-tests/lab-tests.type";
import { LAB_STATUS_LABELS } from "@sanad/contracts/runtime/server/lab-tests/lab-tests.workflow";

// لوحة طلب التحاليل — نفس بنية لوحة الزيارة: بيانات الطفل في العمود الجانبي
// وتبويبات في الأعلى، وجدول تحاليل الطلب داخل تبويب التفاصيل.

const dateLabel = (value: Date | string) =>
	new Date(value).toLocaleDateString("ar-EG", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

/** الحرفان الأولان من الاسم — بديل الصورة في الأفاتار */
const initialsOf = (name: string) =>
	name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((word) => word[0] ?? "")
		.join("")
		.toUpperCase();

/** كتلة جهة اتصال في العمود الجانبي — نفس تخطيط «وليّ الأمر/المدرّب» في لوحة الزيارة */
function ContactBlock({
	title,
	name,
	phone,
	avatarClassName,
}: {
	title: string;
	name: string;
	phone: string | null;
	avatarClassName: string;
}) {
	const initials = initialsOf(name);

	const copyPhone = () => {
		if (!phone) return;
		void navigator.clipboard.writeText(phone);
		toast.success("تم النسخ");
	};

	return (
		<div className="flex flex-col gap-3">
			<p className="text-sm font-semibold">{title}</p>
			<div className="flex items-center justify-between gap-2">
				<div className="flex min-w-0 items-center gap-1.5">
					<div
						className={cn(
							"flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white",
							avatarClassName,
						)}
					>
						{initials}
					</div>
					<span className="truncate text-sm font-medium">{name}</span>
				</div>
				{phone && (
					<Button
						asChild
						size="xs"
						variant="outline"
						className="h-7 text-xs"
					>
						<a href={`sms:${phone}`}>
							<IconMessage className="size-3" />
							إرسال رسالة
						</a>
					</Button>
				)}
			</div>

			{phone && (
				<div className="flex items-center justify-between gap-2">
					<span
						className="text-sm tabular-nums"
						dir="ltr"
					>
						{phone}
					</span>
					<Button
						size="xs"
						variant="outline"
						className="h-7 text-xs"
						onClick={copyPhone}
					>
						<IconCopy className="size-3" />
						نسخ
					</Button>
				</div>
			)}
		</div>
	);
}

export function LabTestSheet({
	labTestId,
	open,
	onClose,
}: {
	labTestId: string | null;
	open: boolean;
	onClose: () => void;
}) {
	const { isRtl } = useI18n();
	const side = isRtl ? "left" : "right";
	const { labTest: order } = useLabTest(labTestId);
	// وجهة الفتح القادمة من البطاقة — أي تبويب وأي تحليل تُفتح لوحته
	const intent = useSelectedLabTestStore((s) => s.intent);
	const [declineOpen, setDeclineOpen] = useState(false);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<LabTestSheetTab>("details");
	const [openItemId, setOpenItemId] = useState<string | null>(null);
	// التعليقات تُفتح من داخل لوحة التحليل: تُقلّص لوحة الطلب إلى النصف وتنزاح
	// لوحة التحليل يسارًا، فيظهر عمود التعليقات في المساحة المتحرّرة يمينًا
	const [commentsOpen, setCommentsOpen] = useState(false);
	// بروتوكول العمل القياسي — لكل تحليل بروتوكوله، والعلامات تُحفظ على الخادم
	const [sopOpen, setSopOpen] = useState(false);
	// مراجعة ضبط الجودة — الاعتماد يُحفظ على الطلب، فلا حالة محلية سوى الفتح
	const [qcOpen, setQcOpen] = useState(false);

	// نبدأ من وجهة الفتح عند تغيّر الطلب — والافتراضي "التفاصيل" بلا لوحة مفتوحة
	// biome-ignore lint/correctness/useExhaustiveDependencies: نُعيد الضبط عند تغيّر الطلب فقط
	useEffect(() => {
		setActiveTab(intent.tab ?? "details");
		setOpenItemId(intent.itemId ?? null);
		setCommentsOpen(false);
		setSopOpen(false);
		setQcOpen(false);
	}, [labTestId]);

	// البروتوكول يخصّ تحليلًا بعينه لا الطلب — التحليل المفتوح، أو الوحيد في
	// الطلب. الاستعلام هنا يغذّي شارة التقدّم على الزر ويتشارك ذاكرة اللوحة.
	const sopItem =
		order?.items.find((i) => i.id === openItemId) ??
		(order?.items.length === 1 ? order.items[0] : null);
	const sopTarget = useMemo(() => ({ labItemId: sopItem?.id ?? "" }), [sopItem?.id]);
	const { run: sopRun } = useSopRun(sopTarget, Boolean(sopItem) && open);

	if (!order) return null;

	// البطاقة بطاقة تحليل واحد — الشيت المفتوح منها ينحصر في ذلك التحليل،
	// وفتحه من غيرها (بلا وجهة) يعرض تحاليل الطلب كلها
	const focusItemId = intent.focusItemId ?? intent.itemId ?? null;
	const summary = summarizeLabOrder(order);
	const paymentMeta = LAB_PAYMENT_META[summary.payment];
	const priorityMeta = order.priority ? PRIORITY_META[order.priority] : null;
	const hasQueued = order.items.some((i) => i.status === LabTestStatus.QUEUE);

	const handleClose = () => {
		setOpenItemId(null);
		setCommentsOpen(false);
		onClose();
	};

	// عمود التعليقات ملحق بلوحة التحليل — إغلاقها يُغلقه معها فلا يبقى معلّقًا
	const closeItemPanel = () => {
		setOpenItemId(null);
		setCommentsOpen(false);
	};

	return (
		<>
			<Sheet
				open={open}
				onOpenChange={(isOpen) => {
					if (!isOpen) handleClose();
				}}
			>
				<SheetContent
					side={side}
					showCloseButton={false}
					className={cn(
						"w-full gap-0 transition-[max-width] duration-300 ease-out",
						// تُقلَّص إلى النصف لتفسح مكانًا لعمود التعليقات على اليمين
						commentsOpen ? "max-w-1/2!" : "max-w-2/3!",
					)}
					dir="rtl"
					// Escape يُغلق الأعمق أولًا: التعليقات ثم لوحة التحليل ثم اللوحة نفسها
					onEscapeKeyDown={(e) => {
						if (commentsOpen) {
							e.preventDefault();
							setCommentsOpen(false);
						} else if (openItemId) {
							e.preventDefault();
							setOpenItemId(null);
						}
					}}
				>
					<SheetHeader className="p-0">
						<div className="flex items-center justify-between gap-2 border-b px-4 py-2">
							<SheetTitle className="flex min-w-0 items-center gap-2 text-lg font-bold">
								<p>التحاليل</p>
								<IconChevronRight className="size-4 rtl:rotate-180" />
								<Avatar size="sm">
									<AvatarFallback className="bg-primary text-[10px] font-semibold text-white">
										{initialsOf(order.patient.name)}
									</AvatarFallback>
								</Avatar>
								<p className="truncate">{order.patient.name}</p>
								<span className="text-xs font-normal tabular-nums text-muted-foreground">
									{order.code}
								</span>
							</SheetTitle>

							<div className="flex items-center gap-1.5">
								{/* مراجعة ضبط الجودة — قواعد Westgard المفعّلة لفرع الطلب */}
								<Button
									size="sm"
									variant="outline"
									className={cn("gap-1.5", order.qcReviewedAt && "text-emerald-600")}
									onClick={() => setQcOpen(true)}
								>
									{order.qcReviewedAt ? (
										<IconCircleCheck className="size-3.5" />
									) : (
										<IconShieldCheck className="size-3.5" />
									)}
									مراجعة QC
								</Button>
								{/* بروتوكول العمل القياسي — يفتح لوحة جانبية كبروتوكول الزيارة */}
								{sopItem && (
									<Button
										size="sm"
										variant="outline"
										className="gap-1.5"
										aria-pressed={sopOpen}
										onClick={() => setSopOpen((v) => !v)}
									>
										<IconChecklist className="size-3.5" />
										SOP
										{sopRun && sopRun.steps.length > 0 && (
											<span className="tabular-nums text-muted-foreground">
												{sopRun.steps.filter((s) => s.response !== null).length}/
												{sopRun.steps.length}
											</span>
										)}
									</Button>
								)}
								{hasQueued && (
									<>
										<Button
											size="sm"
											className="gap-1.5 bg-indigo-600 primaryhover:bg-indigo-700"
											disabled={!canLeaveQueue(summary.payment)}
											title={
												canLeaveQueue(summary.payment)
													? undefined
													: paymentBlockMessage(summary.payment)
											}
											onClick={() => setConfirmOpen(true)}
										>
											<IconCheck className="size-3.5" />
											تأكيد الطلب
										</Button>
										<Button
											size="sm"
											variant="outline"
											className="gap-1.5 text-destructive"
											onClick={() => setDeclineOpen(true)}
										>
											<IconX className="size-3.5" />
											رفض الطلب
										</Button>
									</>
								)}
								<Button
									size="icon"
									variant="ghost"
									className="size-8"
									onClick={handleClose}
								>
									<IconX className="size-4" />
								</Button>
							</div>
						</div>
					</SheetHeader>

					{/* لا نمرّر dir هنا: جذر Tabs يلفّ الشبكة، وقلبه ينقل العمود الجانبي
					    إلى الجهة الأخرى. الاتجاه يُضبط على محتوى التبويب وحده أدناه. */}
					<Tabs
						value={activeTab}
						onValueChange={(v) => setActiveTab(v as LabTestSheetTab)}
						className="flex flex-1 flex-col gap-0 overflow-hidden"
					>
						<div className="px-3 py-2">
							{/* ترتيب DOM في RTL: الأول يظهر أقصى اليسار — كما في تبويبات الزيارة */}
							<TabsList className="w-full justify-end">
								<TabsTrigger
									className="flex-none px-2.5 py-2"
									value="invoice"
								>
									الفاتورة
									{/* نقطة حمراء ما دامت غير مسدَّدة — لأنها بوابة سير العمل */}
									{summary.payment !== "PAID" && summary.payment !== "INPATIENT" && (
										<span className="ms-1 size-1.5 shrink-0 rounded-full bg-red-500" />
									)}
								</TabsTrigger>

								<TabsTrigger
									className="flex-none px-2.5 py-2"
									value="details"
								>
									التفاصيل
									<span className="ms-1 inline-flex h-4 min-w-4 items-center justify-center rounded bg-muted px-1 text-[10px] font-medium tabular-nums text-muted-foreground">
										{order.items.length}
									</span>
								</TabsTrigger>
							</TabsList>
						</div>

						<Separator />

						<div className="grid min-h-0 flex-1 grid-cols-9 overflow-hidden">
							{/* العمود الجانبي — نفس بنية لوحة الزيارة: تفاصيل، وليّ أمر، مدرّب */}
							<div
								className="col-span-2 flex flex-col gap-6 overflow-y-auto border-s p-4"
								dir="rtl"
							>
								{/* حالة الطلب والسداد — مكانها العمود الجانبي كما في لوحة الزيارة،
								    لا ترويسة اللوحة */}
								<div className="flex flex-col gap-3">
									<p className="text-sm font-semibold">التفاصيل</p>
									<div className="flex flex-wrap items-center gap-1.5">
										<Badge
											variant="outline"
											className="text-[10px]"
										>
											{LAB_STATUS_LABELS[summary.status]}
										</Badge>
										{/* حالة السداد — شرط مغادرة الطابور */}
										<Badge
											variant="outline"
											className={cn("text-[10px]", paymentMeta.className)}
										>
											{paymentMeta.label}
										</Badge>
										{priorityMeta && (
											<Badge
												variant="outline"
												className={cn("text-[10px]", priorityMeta.className)}
											>
												{priorityMeta.label}
											</Badge>
										)}
										{order.isUrgent && (
											<Badge className="gap-1 border-red-200 bg-red-50 text-[10px] text-red-600">
												<IconAlertTriangleFilled className="size-3" />
												عاجل
											</Badge>
										)}
										{summary.wasRejected && (
											<Badge
												variant="outline"
												className="border-rose-200 bg-rose-50 text-[10px] text-rose-700"
											>
												تم رفضها
											</Badge>
										)}
									</div>
									<div className="flex items-center gap-1.5">
										<IconCalendar className="size-4 text-muted-foreground" />
										<span className="text-sm">{dateLabel(order.createdAt)}</span>
									</div>
									<div className="flex items-center gap-1.5">
										<IconFlask className="size-4 text-muted-foreground" />
										<span className="text-sm">{order.branch.name}</span>
									</div>
									{order.appointment && (
										<InfoRow
											label="الزيارة"
											value={order.appointment.code}
										/>
									)}
								</div>

								<div className="flex flex-col gap-3">
									<p className="text-sm font-semibold">الطفل</p>
									<div className="flex items-center gap-1.5">
										<Avatar size="sm">
											<AvatarFallback className="bg-primary text-[10px] font-semibold text-white">
												{initialsOf(order.patient.name)}
											</AvatarFallback>
										</Avatar>
										<span className="text-sm font-medium">{order.patient.name}</span>
										<span className="text-xs tabular-nums text-muted-foreground">
											{order.patient.code}
										</span>
									</div>
								</div>

								<ContactBlock
									title="وليّ الأمر"
									name={order.owner.name}
									phone={order.owner.phone}
									avatarClassName="bg-primary"
								/>

								{order.requestedBy && (
									<ContactBlock
										title="المدرّب"
										name={order.requestedBy.name}
										phone={order.requestedBy.phone}
										avatarClassName="bg-blue-600"
									/>
								)}

								{order.notes && (
									<div className="flex flex-col gap-3">
										<p className="text-sm font-semibold">ملاحظات</p>
										<p className="rounded-[4px] border bg-muted/30 p-2 text-[11px] leading-relaxed">
											{order.notes}
										</p>
									</div>
								)}
							</div>

							{/* Radix يضع dir="ltr" على جذر Tabs، فنُعيد الاتجاه هنا — على المحتوى
							    وحده لا على الشبكة، حتى يبقى العمود الجانبي في مكانه */}
							<div
								className="col-span-7 flex flex-col overflow-y-auto"
								dir="rtl"
							>
								{activeTab === "invoice" && <LabInvoiceTab order={order} />}
								{/* النتائج تُفتح من زر صف التحليل في الجدول (لوحة التحليل المفرد)،
								    والنشاط قسم داخل التفاصيل — تمامًا كتبويب معلومات الزيارة */}
								{activeTab === "details" && (
									<div className="flex flex-col gap-6 p-4">
										<LabOrderTestsTable
											order={order}
											activeItemId={openItemId}
											focusItemId={focusItemId}
											onOpenItem={setOpenItemId}
										/>
										<LabCustodyChain order={order} />
										<LabOrderActivity order={order} />
									</div>
								)}
								{activeTab === "comments" && (
									<div className="p-4">
										<LabOrderComments order={order} />
									</div>
								)}
							</div>
						</div>
					</Tabs>

					{/* لوحة التحليل المفرد — داخل لوحة الطلب لا فوقها، فتبقى غشاوة
					    اللوحة الأم كما هي ويعمل التمرير داخل الجانبية */}
					<LabTestItemPanel
						order={order}
						itemId={openItemId}
						open={!!openItemId}
						onClose={closeItemPanel}
						commentsOpen={commentsOpen}
						onToggleComments={() => setCommentsOpen((v) => !v)}
					/>

					{/* عمود التعليقات — يشغل المساحة التي تحرّرت بتقلّص اللوحة */}
					{openItemId && commentsOpen && (
						<aside
							dir="rtl"
							aria-label="تعليقات الطلب"
							className="fixed inset-y-2 left-[calc(75%+0.5rem)] right-2 z-50 flex flex-col gap-0 rounded-lg border bg-popover text-sm text-popover-foreground shadow-lg"
						>
							<div className="flex items-center justify-between gap-2 border-b px-4 py-2">
								<h2 className="flex min-w-0 items-center gap-2 text-base font-bold">
									<IconMessage className="size-4 shrink-0 text-muted-foreground" />
									<span className="truncate">التعليقات</span>
									{order.comments.length > 0 && (
										<span className="inline-flex h-4 min-w-4 items-center justify-center rounded bg-muted px-1 text-[10px] font-medium tabular-nums text-muted-foreground">
											{order.comments.length}
										</span>
									)}
									<Badge
										variant="secondary"
										className="shrink-0 text-[10px] font-normal"
									>
										<IconEyeOff className="size-3.5" />
										داخلية
									</Badge>
								</h2>
								<Button
									size="icon"
									variant="ghost"
									className="size-8"
									aria-label="إغلاق التعليقات"
									onClick={() => setCommentsOpen(false)}
								>
									<IconX className="size-4" />
								</Button>
							</div>

							<div className="min-h-0 flex-1 overflow-y-auto p-4">
								<LabOrderComments
									order={order}
									showHeader={false}
								/>
							</div>
						</aside>
					)}
				</SheetContent>
			</Sheet>

			{sopItem && (
				<SopRunPanel
					open={sopOpen && open}
					onClose={() => setSopOpen(false)}
					sheetFraction={commentsOpen ? 1 / 2 : 2 / 3}
					domain={SopDomain.LAB}
					serviceId={sopItem.serviceId}
					serviceName={sopItem.service.name}
					target={sopTarget}
				/>
			)}

			<LabQcReviewDialog
				order={order}
				open={qcOpen}
				onOpenChange={setQcOpen}
				onOpenItem={setOpenItemId}
			/>

			<LabTestConfirmDialog
				labTestId={order.id}
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
			/>

			{/* رفض من الطابور يحذف الطلب — نغلق اللوحة بعده لأنه لم يعد موجودًا */}
			<LabTestDeclineDialog
				labTestId={order.id}
				open={declineOpen}
				onOpenChange={setDeclineOpen}
				onDeclined={handleClose}
			/>
		</>
	);
}

function InfoRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center justify-between gap-2">
			<span className="text-[11px] text-muted-foreground">{label}</span>
			<span className="truncate text-sm font-medium">{value}</span>
		</div>
	);
}
