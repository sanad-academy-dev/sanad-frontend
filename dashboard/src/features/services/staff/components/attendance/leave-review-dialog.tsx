import {
	IconArrowUp,
	IconAt,
	IconCheck,
	IconCircleX,
	IconClock,
	IconDots,
	IconLink,
	IconMail,
	IconMoodSmile,
	IconPackageImport,
	IconPencil,
	IconPlus,
	IconRosetteDiscountCheck,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { LeaveAcceptDialog } from "@/features/services/staff/components/attendance/leave-accept-dialog";
import { LeaveEmailDialog } from "@/features/services/staff/components/attendance/leave-email-dialog";
import { LeaveRejectDialog } from "@/features/services/staff/components/attendance/leave-reject-dialog";
import { useLeaveBalance } from "@/features/services/staff/hooks/use-leave-balance";
import { useLeaveRequest } from "@/features/services/staff/hooks/use-leave-request";
import { cn } from "@/lib/utils";
import type { LeaveRequestResponse } from "@/server/leave-requests/leave-requests.type";

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
	PENDING: { label: "بالإنتظار", cls: "bg-[#3B82F6]/5 text-[#3B82F6]" },
	APPROVED: { label: "معتمد", cls: "bg-[#16A34A]/10 text-[#16A34A]" },
	REJECTED: { label: "مرفوض", cls: "bg-[#DC2626]/10 text-[#DC2626]" },
};

function initialsOf(name: string) {
	return name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
}

const fmtDate = (d: string | Date) => format(new Date(d), "d MMMM yyyy", { locale: arSA });

// بطاقة معلومة (قيمة + عنوان)
function StatCard({ value, label }: { value: string; label: string }) {
	return (
		<div className="flex h-[34px] flex-1 items-center justify-between rounded-[4px] border border-[#E5E5E5] px-1.5">
			<span className="text-[12px] text-[#9B9B9D]">{label}</span>
			<span className="text-[11px] font-medium text-[#08090A] tabular-nums">{value}</span>
		</div>
	);
}

// صف تفصيل (القيمة يسار، العنوان يمين)
function DetailRow({ value, label }: { value: string; label: string }) {
	return (
		<div className="flex items-center justify-between">
			<span className="text-[12px] font-medium text-[#08090A]">{label}</span>
			<span className="text-[12px] text-[#08090A]">{value || "—"}</span>
		</div>
	);
}

function ApprovalStep({
	step,
	isLast,
}: {
	step: LeaveRequestResponse["approvals"][number];
	isLast: boolean;
}) {
	const Icon = step.order === 1 ? IconPackageImport : step.order === 2 ? IconMail : IconCheck;
	const done = step.status === "done";
	const rejected = step.status === "rejected";
	return (
		<div className="flex items-start gap-3">
			<div className="flex flex-col items-center gap-1">
				<div className="flex size-6 items-center justify-center rounded-full bg-[#F4F4F4] text-[#0A0A0A]">
					<Icon className="size-3.5" />
				</div>
				{!isLast && <span className="h-[34px] w-px bg-[#E8E8E8]" />}
			</div>
			<div className="flex flex-1 flex-col gap-1">
				<span className="w-full text-right text-[12px] text-[#1E2939]">{step.title}</span>
				<div className="flex w-full items-center justify-between gap-1 text-[8px] text-[#5C5C5E]">
					<div className="flex items-center gap-1">
						{step.actorName && <span>بواسطة: {step.actorName}</span>}
						{step.at && (
							<span className="tabular-nums">
								{format(new Date(step.at), "dd/MM/yyyy HH:mm")}
							</span>
						)}
					</div>
					<span
						className={cn(
							"rounded-[4px] px-1 py-0.5 text-[8px] font-medium",
							done
								? "bg-[#16A34A]/10 text-[#16A34A]"
								: rejected
									? "bg-[#DC2626]/10 text-[#DC2626]"
									: "bg-[#3B82F6]/5 text-[#3B82F6]",
						)}
					>
						{done ? "تم" : rejected ? "مرفوض" : "معلق"}
					</span>
				</div>
			</div>
		</div>
	);
}

// جسم المراجعة القابل للتمرير (تفاصيل + مرفقات + سلسلة موافقات) — مُشترك بين المراجعة الفردية والجماعية
export function LeaveReviewScroll({ requestId }: { requestId: string | null }) {
	const { request } = useLeaveRequest(requestId);
	const { balance } = useLeaveBalance(request?.staff.id ?? null, !!requestId);
	const badge = request ? STATUS_BADGE[request.status] : null;
	const current = balance?.remaining ?? 0;
	const requested = request?.days ?? 0;

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-3 py-3">
			{/* صندوق التفاصيل */}
			<div className="flex flex-col gap-3 rounded-[4px] border-[0.5px] border-[#D8D8D8] p-3">
				{/* الحالة + الموظف */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-1.5">
						<span className="flex size-[17px] items-center justify-center rounded-full bg-[#6366F1] text-[9px] text-white">
							{request ? initialsOf(request.staff.name) : ""}
						</span>
						<span className="text-[13px] font-bold text-[#08090A]">{request?.staff.name}</span>
						<span className="font-mono text-[10px] text-[#9B9B9D]">{request?.staff.code}</span>
					</div>
					{badge && (
						<span
							className={cn("rounded-[4px] px-1.5 py-0.5 text-[8px] font-medium", badge.cls)}
						>
							{badge.label}
						</span>
					)}
				</div>

				{/* بطاقات الأرصدة */}
				<div className="flex items-center gap-1.5">
					<StatCard
						value={`${Math.max(0, current - requested)} أيام`}
						label="الرصيد المتبقي"
					/>
					<StatCard
						value={`${requested} أيام`}
						label="الأيام المطلوبة"
					/>
					<StatCard
						value={`${current} يوم`}
						label="الرصيد الحالي"
					/>
					<StatCard
						value={`${balance?.compensatoryDays ?? 0} يوم`}
						label="الرصيد التعويضي"
					/>
				</div>

				{/* تنبيه الرصيد */}
				<div className="flex items-center justify-start gap-2.5 rounded-[4px] bg-[#FFFBEA] px-2 py-3.5">
					<IconClock className="size-3.5 shrink-0 text-[#C34E00]" />
					<span className="text-[12px] text-[#C34E00]">
						{request?.staff.name} لدية رصيد أجازات {current} يوم
					</span>
				</div>

				{/* تفاصيل الأجازة */}
				<div className="flex flex-col gap-2.5">
					<span className="text-right text-[12px] font-medium text-[#8C8C8C]">
						تفاصيل الأجازة
					</span>
					<DetailRow
						label="نوع الإجازة"
						value={request?.type ?? ""}
					/>
					<DetailRow
						label="تاريخ البداية"
						value={request ? fmtDate(request.startDate) : ""}
					/>
					<DetailRow
						label="تاريخ النهاية"
						value={request ? fmtDate(request.endDate) : ""}
					/>
					<DetailRow
						label="عدد الأيام"
						value={request ? `${request.days} أيام` : ""}
					/>
					<DetailRow
						label="الموظف البديل"
						value={request?.substitute?.name ?? ""}
					/>
					<DetailRow
						label="ملاحظات"
						value={request?.notes ?? ""}
					/>
				</div>
			</div>

			{/* المرفقات */}
			{request && request.attachments.length > 0 && (
				<div className="flex flex-col gap-2">
					<span className="text-right text-[12px] font-medium text-[#08090A]">المرفقات</span>
					<div className="flex flex-col gap-2">
						{request.attachments.map((a) => (
							<div
								key={a.id}
								className="flex items-center justify-between rounded-[4px] border-[0.75px] border-[#E5E5E5] px-2 py-2.5"
							>
								<button
									type="button"
									className="flex h-5 w-7 items-center justify-center rounded-[4px] bg-[#EBEBEB] text-[#5C5C5E]"
									aria-label="خيارات"
								>
									<IconDots className="size-4" />
								</button>
								<div className="flex items-center gap-1.5">
									<span className="text-[13px] font-semibold text-[#08090A]">
										{a.name || (a.kind === "link" ? "رابط" : "مستند")}
									</span>
									<IconLink className="size-[18px] text-[#808080]" />
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* سلسلة الموافقات */}
			{request && request.approvals.length > 0 && (
				<div className="flex flex-col gap-4">
					<span className="text-right text-[16px] text-[#1B1B1B]">سلسله الموافقات</span>
					<div className="flex flex-col gap-1">
						{[...request.approvals]
							.sort((a, b) => a.order - b.order)
							.map((step, i, arr) => (
								<ApprovalStep
									key={step.id}
									step={step}
									isLast={i === arr.length - 1}
								/>
							))}
					</div>

					{/* صندوق التعليق */}
					<div className="flex items-start gap-2">
						<span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#6366F1] text-[9px] text-white">
							{request ? initialsOf(request.staff.name) : ""}
						</span>
						<div className="flex flex-1 flex-col gap-2 rounded-[4px] border border-[#E5E5E5] p-2.5">
							<textarea
								placeholder="اكتب تعليق..."
								className="h-9 w-full resize-none bg-transparent text-right text-[13px] text-[#08090A] outline-none placeholder:text-[#9B9B9D]"
							/>
							<div className="flex items-center gap-3 text-[#5C5C5E]">
								<IconArrowUp className="size-4" />
								<IconMoodSmile className="size-4" />
								<IconAt className="size-4" />
								<IconLink className="size-4" />
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export function LeaveReviewDialog({
	requestId,
	onClose,
}: {
	requestId: string | null;
	onClose: () => void;
}) {
	const { request } = useLeaveRequest(requestId);
	const [emailOpen, setEmailOpen] = useState(false);
	const [acceptOpen, setAcceptOpen] = useState(false);
	const [rejectOpen, setRejectOpen] = useState(false);
	const open = !!requestId;
	const anyDialogOpen = emailOpen || acceptOpen || rejectOpen;

	return (
		<>
			<Sheet
				open={open && !anyDialogOpen}
				onOpenChange={(o) => {
					if (!o && !anyDialogOpen) onClose();
				}}
			>
				<SheetContent
					side="left"
					dir="rtl"
					showCloseButton={false}
					className="flex w-[603px]! max-w-[603px]! flex-col gap-0 overflow-hidden p-0"
				>
					<SheetTitle className="sr-only">مراجعة طلب إجازة</SheetTitle>
					<SheetDescription className="sr-only">
						مراجعة تفاصيل طلب الإجازة وسلسلة الموافقات
					</SheetDescription>

					{/* الرأس */}
					<div className="flex items-center justify-between border-b px-4 py-2">
						<div className="flex items-center gap-1.5 text-[10px]">
							<span className="font-bold text-[#08090A]">مراجعة الطلب #{request?.code}</span>
							<span className="text-[#9B9B9D]">‹</span>
							<span className="text-[13px] font-bold text-[#08090A]">
								{request?.staff.name}
							</span>
							<span className="flex size-[17px] items-center justify-center rounded-full bg-[#6366F1] text-[9px] text-white">
								{request ? initialsOf(request.staff.name) : ""}
							</span>
							<span className="text-[#9B9B9D]">‹</span>
							<span className="font-bold text-[#08090A]">طلب إجازة</span>
						</div>
						<button
							type="button"
							onClick={onClose}
							aria-label="إغلاق"
							className="flex size-[18px] items-center justify-center rounded-[4px] text-[#9B9B9D] hover:bg-muted"
						>
							<IconPlus className="size-3.5 rotate-45" />
						</button>
					</div>

					<LeaveReviewScroll requestId={requestId} />

					{/* التذييل: تعديل / حفظ كمسودة / إرسال للموافقة (على اليسار) */}
					<div className="flex items-center justify-end gap-1.5 border-t px-4 py-2">
						<Button
							type="button"
							size="sm"
							variant="outline"
							onClick={onClose}
							className="h-[30px] gap-1.5 rounded-[4px] text-[12px] text-[#08090A]"
						>
							<IconPencil className="size-3.5" />
							تعديل الطلب
						</Button>
						<Button
							type="button"
							size="sm"
							variant="outline"
							onClick={() => setRejectOpen(true)}
							className="h-[22px] gap-1 rounded-[4px] border-[#E5E5E5] bg-white px-[7px] text-[10px] font-medium text-[#EF4444] hover:bg-muted hover:text-[#EF4444]"
						>
							رفض الإجازة
							<IconCircleX className="size-2.5" />
						</Button>
						<Button
							type="button"
							size="sm"
							onClick={() => setAcceptOpen(true)}
							className="h-6 gap-1.5 rounded-[4px] bg-[#506AE0] px-2 text-[10px] font-medium tracking-[-0.028px] hover:bg-[#506AE0]/90"
						>
							اعتماد الأجازة
							<IconRosetteDiscountCheck className="size-3.5" />
						</Button>
					</div>
				</SheetContent>
			</Sheet>

			<LeaveEmailDialog
				requestId={requestId}
				open={emailOpen}
				onClose={() => setEmailOpen(false)}
				onSent={onClose}
			/>

			{/* بعد القبول/الرفض: يُغلق الحوار فقط وتبقى المراجعة مفتوحة لتُحدَّث سلسلة الموافقات */}
			<LeaveAcceptDialog
				requestId={requestId}
				open={acceptOpen}
				onClose={() => setAcceptOpen(false)}
			/>

			<LeaveRejectDialog
				requestId={requestId}
				open={rejectOpen}
				onClose={() => setRejectOpen(false)}
			/>
		</>
	);
}
