import {
	IconCalendar,
	IconChecklist,
	IconChevronLeft,
	IconChevronRight,
	IconDoor,
	IconFileText,
	IconMessage,
	IconPrinter,
	IconX,
} from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { arSA } from "date-fns/locale";
import { useMemo, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OperationBillingTab } from "@/features/services/operations/components/operation-billing-tab";
import { OperationComments } from "@/features/services/operations/components/operation-comments";
import { OperationProceduresTable } from "@/features/services/operations/components/operation-procedures-table";
import { OperationWorkPanel } from "@/features/services/operations/components/operation-work-panel";
import { useOperationCase } from "@/features/services/operations/hooks/use-operation-case";
import {
	type OperationSheetTab,
	useSelectedOperationStore,
} from "@/features/services/operations/stores/selected-operation.store";
import { printOperationCase } from "@/features/services/operations/utils/print-operation-case";
import { SopRunPanel } from "@/features/services/sops/components/sop-run-panel";
import { useSopRun } from "@/features/services/sops/hooks/use-sop-run";
import type { OperationActivityType } from "@/generated/prisma/enums";
import { SopDomain } from "@/generated/prisma/enums";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import type { OperationCaseDetailResponse } from "@/server/operations/operations.type";
import {
	OPERATION_STAGE_LABELS,
	OPERATION_STATUS_LABELS,
	OPERATION_TIER_LABELS,
	OPERATION_URGENCY_LABELS,
} from "@sanad/contracts/runtime/server/operations/operations.workflow";
import { SEDATION_LABELS } from "@sanad/contracts/runtime/server/radiology/radiology-procedure.type";

const ACTIVITY_LABELS: Record<OperationActivityType, string> = {
	CREATED: "أُنشئت الحالة",
	STATUS_CHANGED: "تغيّرت الحالة",
	STAGE_CHANGED: "تقدّمت المرحلة",
	SCHEDULE_CHANGED: "تغيّر الموعد",
	TEAM_CHANGED: "تعدّل الفريق",
	URGENCY_CHANGED: "تغيّرت الأولوية",
	GATE_OVERRIDDEN: "تجاوز بوابة أمان",
	CANCELLED: "أُلغيت",
	NOTE: "ملاحظة",
	CONSENT_SIGNED: "وُقّعت موافقة",
	CONSENT_REVOKED: "أُبطلت موافقة",
	ASSESSMENT_UPDATED: "حُدّث التقييم",
	CHECKLIST_COMPLETED: "اكتملت قائمة تحقق",
	NOTE_SIGNED: "وُقّع التقرير الجراحي",
};

const TEAM_ROLE_LABELS: Record<string, string> = {
	PRIMARY_SURGEON: "الجرّاح الأساسي",
	ASSISTANT_SURGEON: "جرّاح مساعد",
	ANESTHETIST: "مدرّب التخدير",
	ANESTHESIA_TECH: "فنّي تخدير",
	SCRUB_NURSE: "ممرض معقّم",
	CIRCULATOR: "ممرض متجوّل",
	OBSERVER: "مراقب",
};

const dateTimeFormatter = new Intl.DateTimeFormat("ar", {
	dateStyle: "medium",
	timeStyle: "short",
});
const formatAt = (value: Date | string | null | undefined) =>
	value ? dateTimeFormatter.format(new Date(value)) : "—";

const initialsOf = (name: string) =>
	name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((word) => word[0] ?? "")
		.join("")
		.toUpperCase();

export function OperationCaseSheet() {
	const { isRtl } = useI18n();
	const { selectedCaseId, tab, setTab, close, workOpen, setWorkOpen } =
		useSelectedOperationStore();
	const [commentsOpen, setCommentsOpen] = useState(false);
	// بروتوكول العمل القياسي — تشغيل واحد لكل حالة، مبنيّ على الإجراء الأساسي
	const [sopOpen, setSopOpen] = useState(false);
	const { operationCase, isLoading } = useOperationCase(selectedCaseId);

	// الإجراء الأساسي هو أول إجراءات الحالة — منه تُحلّ الدورة وبروتوكولها
	const sopProcedure = operationCase?.procedures[0] ?? null;
	const sopTarget = useMemo(
		() => ({ operationCaseId: selectedCaseId ?? "" }),
		[selectedCaseId],
	);
	const { run: sopRun } = useSopRun(sopTarget, Boolean(sopProcedure) && !!selectedCaseId);

	const handleClose = () => {
		setCommentsOpen(false);
		setSopOpen(false);
		close();
	};

	return (
		<Sheet
			open={selectedCaseId !== null}
			onOpenChange={(open) => {
				if (!open) handleClose();
			}}
		>
			<SheetContent
				side={isRtl ? "left" : "right"}
				showCloseButton={false}
				className={cn(
					"w-full gap-0 transition-[max-width] duration-300 ease-out",
					// تُقلّص إلى النصف لتفسح مكانًا لعمود التعليقات
					commentsOpen ? "max-w-1/2!" : "max-w-2/3!",
				)}
				dir="rtl"
				// Escape يُغلق الأعمق أولًا: التعليقات ثم لوحة سير العمل ثم اللوحة
				onEscapeKeyDown={(e) => {
					if (commentsOpen) {
						e.preventDefault();
						setCommentsOpen(false);
					} else if (workOpen) {
						e.preventDefault();
						setWorkOpen(false);
					}
				}}
			>
				<SheetHeader className="p-0">
					<div className="flex items-center justify-between gap-2 border-b px-4 py-2">
						<SheetTitle className="flex min-w-0 items-center gap-2 text-lg font-bold">
							<p>العمليات</p>
							<IconChevronRight className="size-4 rtl:rotate-180" />
							{operationCase ? (
								<>
									<Avatar size="sm">
										<AvatarFallback className="bg-primary text-[10px] font-semibold text-white">
											{initialsOf(operationCase.patient.name)}
										</AvatarFallback>
									</Avatar>
									<p className="truncate">{operationCase.patient.name}</p>
									<span className="text-xs font-normal tabular-nums text-muted-foreground">
										{operationCase.code}
									</span>
								</>
							) : (
								<p>حالة العملية</p>
							)}
						</SheetTitle>

						<div className="flex items-center gap-1.5">
							{/* بروتوكول العمل القياسي — يكمّل قوائم التحقق الجراحية ولا يحلّ محلها */}
							{sopProcedure && (
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
							{/* الزر يحمل الخطوة الحالية لا عبارة عامة — والمنتهية تفتح ملخّصها */}
							{operationCase &&
								(operationCase.status === "COMPLETED" ||
								operationCase.status === "CANCELLED" ? (
									<Button
										size="sm"
										variant="outline"
										className="gap-1.5"
										onClick={() => setWorkOpen(true)}
									>
										<IconFileText className="size-3.5" />
										ملخّص الحالة
										<IconChevronLeft className="size-3.5 rtl:rotate-180" />
									</Button>
								) : (
									<Button
										size="sm"
										className="gap-1.5 bg-indigo-600 primaryhover:bg-indigo-700"
										onClick={() => setWorkOpen(true)}
									>
										{operationCase.status === "SCHEDULED"
											? "بدء التحضير"
											: operationCase.stage
												? OPERATION_STAGE_LABELS[operationCase.stage]
												: OPERATION_STATUS_LABELS[operationCase.status]}
										<IconChevronLeft className="size-3.5 rtl:rotate-180" />
									</Button>
								))}
							{operationCase && (
								<Button
									size="icon"
									variant="ghost"
									className="size-8"
									title="طباعة السجل المحيط بالجراحة"
									aria-label="طباعة السجل"
									onClick={() => printOperationCase(operationCase)}
								>
									<IconPrinter className="size-4" />
								</Button>
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

				{isLoading || !operationCase ? (
					<div className="flex flex-col gap-3 p-4">
						<Skeleton className="h-8 w-48" />
						<Skeleton className="h-64 w-full rounded-[4px]" />
					</div>
				) : (
					/* لا نمرّر dir هنا: جذر Tabs يلفّ الشبكة، وقلبه ينقل العمود الجانبي
					   إلى الجهة الأخرى. الاتجاه يُضبط على المحتوى وحده أدناه. */
					<Tabs
						value={tab}
						onValueChange={(v) => setTab(v as OperationSheetTab)}
						className="flex flex-1 flex-col gap-0 overflow-hidden"
					>
						<div className="px-3 py-2">
							{/* ترتيب DOM في RTL: الأول يظهر أقصى اليسار — «التفاصيل» آخرًا فتتصدر اليمين */}
							<TabsList className="w-full justify-end">
								<TabsTrigger
									className="flex-none px-2.5 py-2"
									value="billing"
								>
									الفاتورة
									{/* نقطة حمراء ما دامت غير مسدّدة */}
									{operationCase.invoice?.status !== "PAID" && (
										<span className="ms-1 size-1.5 shrink-0 rounded-full bg-red-500" />
									)}
								</TabsTrigger>

								<TabsTrigger
									className="flex-none px-2.5 py-2"
									value="comments"
								>
									التعليقات
									{operationCase.comments.length > 0 && (
										<span className="ms-1 inline-flex h-4 min-w-4 items-center justify-center rounded bg-muted px-1 text-[10px] font-medium tabular-nums text-muted-foreground">
											{operationCase.comments.length}
										</span>
									)}
								</TabsTrigger>

								<TabsTrigger
									className="flex-none px-2.5 py-2"
									value="details"
								>
									التفاصيل
									<span className="ms-1 inline-flex h-4 min-w-4 items-center justify-center rounded bg-muted px-1 text-[10px] font-medium tabular-nums text-muted-foreground">
										{operationCase.procedures.length}
									</span>
								</TabsTrigger>
							</TabsList>
						</div>

						<Separator />

						<div className="grid min-h-0 flex-1 grid-cols-9 overflow-hidden">
							{/* العمود الجانبي — نفس بنية لوحتي التحاليل والأشعة */}
							<div
								className="col-span-2 flex flex-col gap-6 overflow-y-auto border-s p-4"
								dir="rtl"
							>
								<CaseSidebar operationCase={operationCase} />
							</div>

							{/* Radix يضع dir="ltr" على جذر Tabs، فنُعيد الاتجاه على المحتوى وحده */}
							<div
								className="col-span-7 flex flex-col overflow-y-auto"
								dir="rtl"
							>
								<div className="flex flex-col gap-6 p-4">
									{tab === "details" && <DetailsTab operationCase={operationCase} />}
									{tab === "billing" && <OperationBillingTab operationCase={operationCase} />}
									{tab === "comments" && (
										<OperationComments
											operationCase={operationCase}
											showHeader={false}
										/>
									)}
								</div>
							</div>
						</div>
					</Tabs>
				)}

				{sopProcedure && (
					<SopRunPanel
						open={sopOpen && !!selectedCaseId}
						onClose={() => setSopOpen(false)}
						sheetFraction={commentsOpen ? 1 / 2 : 2 / 3}
						domain={SopDomain.OPERATION}
						serviceId={sopProcedure.serviceId}
						serviceName={sopProcedure.nameSnapshot}
						target={sopTarget}
					/>
				)}

				{/* لوحة سير العمل — داخل لوحة الحالة لا فوقها، كلوحة الفحص المفرد في الأشعة */}
				{operationCase && (
					<OperationWorkPanel
						operationCase={operationCase}
						open={workOpen}
						onClose={() => setWorkOpen(false)}
						commentsOpen={commentsOpen}
						onToggleComments={() => setCommentsOpen((v) => !v)}
					/>
				)}

				{/* عمود التعليقات — يفتح بجوار لوحة سير العمل كما في التحاليل والأشعة */}
				{operationCase && workOpen && commentsOpen && (
					<aside
						dir="rtl"
						aria-label="تعليقات الحالة"
						className="fixed inset-y-2 left-[calc(75%+0.5rem)] right-2 z-50 flex flex-col gap-0 rounded-lg border bg-popover text-sm text-popover-foreground shadow-lg"
					>
						<div className="flex items-center justify-between gap-2 border-b px-4 py-2">
							<h2 className="flex min-w-0 items-center gap-2 text-base font-bold">
								<IconMessage className="size-4 shrink-0 text-muted-foreground" />
								<span className="truncate">التعليقات</span>
								{operationCase.comments.length > 0 && (
									<span className="inline-flex h-4 min-w-4 items-center justify-center rounded bg-muted px-1 text-[10px] font-medium tabular-nums text-muted-foreground">
										{operationCase.comments.length}
									</span>
								)}
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
							<OperationComments
								operationCase={operationCase}
								showHeader={false}
							/>
						</div>
					</aside>
				)}
			</SheetContent>
		</Sheet>
	);
}

// ── العمود الجانبي — التفاصيل والطفل ووليّ الأمر والفريق (نمط لوحة الأشعة) ────

function ContactBlock({
	title,
	name,
	phone,
	avatarClassName,
}: {
	title: string;
	name: string;
	phone?: string | null;
	avatarClassName: string;
}) {
	return (
		<div className="flex flex-col gap-3">
			<p className="text-sm font-semibold">{title}</p>
			<div className="flex items-center gap-1.5">
				<Avatar size="sm">
					<AvatarFallback
						className={cn("text-[10px] font-semibold text-white", avatarClassName)}
					>
						{initialsOf(name)}
					</AvatarFallback>
				</Avatar>
				<span className="truncate text-sm font-medium">{name}</span>
				{phone && (
					<span
						className="text-xs tabular-nums text-muted-foreground"
						dir="ltr"
					>
						{phone}
					</span>
				)}
			</div>
		</div>
	);
}

function CaseSidebar({ operationCase: c }: { operationCase: OperationCaseDetailResponse }) {
	const surgeon = c.team.find((m) => m.role === "PRIMARY_SURGEON")?.staff ?? null;
	const anesthetist = c.team.find((m) => m.role === "ANESTHETIST")?.staff ?? null;
	const others = c.team.filter(
		(m) => m.role !== "PRIMARY_SURGEON" && m.role !== "ANESTHETIST",
	);
	const isUrgent = c.urgency === "IMMEDIATE" || c.urgency === "URGENT";

	return (
		<>
			<div className="flex flex-col gap-3">
				<p className="text-sm font-semibold">التفاصيل</p>
				<div className="flex flex-wrap items-center gap-1.5">
					<Badge
						variant="outline"
						className="text-[10px]"
					>
						{OPERATION_STATUS_LABELS[c.status]}
					</Badge>
					{c.stage && (
						<Badge
							variant="outline"
							className="text-[10px]"
						>
							{OPERATION_STAGE_LABELS[c.stage]}
						</Badge>
					)}
					<Badge
						variant="outline"
						className="text-[10px]"
					>
						{OPERATION_TIER_LABELS[c.tier]}
					</Badge>
					<Badge
						variant="outline"
						className="text-[10px]"
					>
						{OPERATION_URGENCY_LABELS[c.urgency]}
					</Badge>
					<Badge
						variant="outline"
						className="text-[10px]"
					>
						{SEDATION_LABELS[c.plannedAnesthesia]}
					</Badge>
					{isUrgent && (
						<Badge className="gap-1 border-red-200 bg-red-50 text-[10px] text-red-600">
							عاجلة
						</Badge>
					)}
				</div>
				<div className="flex items-center gap-1.5">
					<IconCalendar className="size-4 text-muted-foreground" />
					<span className="text-sm">
						{c.scheduledAt ? formatAt(c.scheduledAt) : "غير مجدولة"}
					</span>
				</div>
				<div className="flex items-center gap-1.5">
					<IconDoor className="size-4 text-muted-foreground" />
					<span className="text-sm">
						{c.room?.name ?? "بلا قاعة"} — {c.estimatedDurationMin} دقيقة
					</span>
				</div>
			</div>

			{/* التشخيص — مبرِّر الجراحة، يقرؤه الفريق كله */}
			{c.diagnosis && (
				<div className="flex flex-col gap-3">
					<p className="text-sm font-semibold">التشخيص</p>
					<p className="rounded-[4px] border border-blue-200 bg-blue-50/50 p-2 text-[11px] leading-relaxed">
						{c.diagnosis}
					</p>
				</div>
			)}

			<div className="flex flex-col gap-3">
				<p className="text-sm font-semibold">الطفل</p>
				<div className="flex items-center gap-1.5">
					<Avatar size="sm">
						<AvatarFallback className="bg-primary text-[10px] font-semibold text-white">
							{initialsOf(c.patient.name)}
						</AvatarFallback>
					</Avatar>
					<span className="truncate text-sm font-medium">{c.patient.name}</span>
					<span className="text-xs tabular-nums text-muted-foreground">{c.patient.code}</span>
				</div>
			</div>

			<ContactBlock
				title="وليّ الأمر"
				name={c.owner.name}
				phone={c.owner.phone}
				avatarClassName="bg-primary"
			/>

			{surgeon && (
				<ContactBlock
					title="الجرّاح الأساسي"
					name={surgeon.name}
					avatarClassName="bg-blue-600"
				/>
			)}
			{anesthetist && (
				<ContactBlock
					title="مدرّب التخدير"
					name={anesthetist.name}
					avatarClassName="bg-blue-600"
				/>
			)}
			{others.length > 0 && (
				<div className="flex flex-col gap-3">
					<p className="text-sm font-semibold">بقية الفريق</p>
					{others.map((m) => (
						<div
							key={m.id}
							className="flex items-center justify-between gap-2 text-xs"
						>
							<span className="truncate">{m.staff.name}</span>
							<span className="shrink-0 text-muted-foreground">
								{TEAM_ROLE_LABELS[m.role] ?? m.role}
							</span>
						</div>
					))}
				</div>
			)}
		</>
	);
}

// ── التفاصيل — الإجراءات وسجل النشاط ───────────────────────────────────────

function DetailsTab({ operationCase: c }: { operationCase: OperationCaseDetailResponse }) {
	const setWorkOpen = useSelectedOperationStore((state) => state.setWorkOpen);
	return (
		<>
			<OperationProceduresTable
				operationCase={c}
				onOpenWork={() => setWorkOpen(true)}
			/>
			<CaseActivity operationCase={c} />
		</>
	);
}

function CaseActivity({ operationCase: c }: { operationCase: OperationCaseDetailResponse }) {
	return (
		<section className="flex flex-col gap-3">
			<p className="text-sm font-semibold">سجل النشاط</p>
			{c.activity.length === 0 ? (
				<p className="text-xs text-muted-foreground">لا نشاط بعد</p>
			) : (
				<div className="flex flex-col gap-2.5">
					{c.activity.map((entry) => (
						<div
							key={entry.id}
							className="flex items-start gap-2 text-xs"
						>
							<Avatar size="sm">
								<AvatarFallback className="bg-primary text-[10px] font-semibold text-white">
									{entry.author ? initialsOf(entry.author.name) : "ن"}
								</AvatarFallback>
							</Avatar>
							<div className="flex min-w-0 flex-col gap-0.5">
								<div className="flex flex-wrap items-center gap-1 text-muted-foreground">
									<span className="font-semibold text-foreground">
										{entry.author?.name ?? "النظام"}
									</span>
									<span
										className={
											entry.type === "GATE_OVERRIDDEN" ? "font-medium text-red-600" : undefined
										}
									>
										{ACTIVITY_LABELS[entry.type]}
									</span>
									<span>•</span>
									<span className="shrink-0">
										{formatDistanceToNow(new Date(entry.createdAt), {
											addSuffix: true,
											locale: arSA,
										})}
									</span>
								</div>
								{entry.detail && (
									<p
										className={
											entry.type === "GATE_OVERRIDDEN"
												? "text-red-600"
												: "text-muted-foreground"
										}
									>
										{entry.detail}
									</p>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</section>
	);
}
