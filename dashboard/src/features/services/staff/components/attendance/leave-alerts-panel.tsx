import {
	IconCheck,
	IconChevronLeft,
	IconMail,
	IconPackageImport,
	IconX,
} from "@tabler/icons-react";
import { Fragment, useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { LeaveReviewDialog } from "@/features/services/staff/components/attendance/leave-review-dialog";
import { useLeaveRequests } from "@/features/services/staff/hooks/use-leave-request";
import { cn } from "@/lib/utils";
import type { LeaveRequestResponse } from "@/server/leave-requests/leave-requests.type";

function initialsOf(name: string) {
	return name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
}

// شريط سلسلة الموافقات أفقيًا (أيقونة لكل خطوة + خط واصل)
function ApprovalStepper({ approvals }: { approvals: LeaveRequestResponse["approvals"] }) {
	const steps = [...approvals].sort((a, b) => a.order - b.order);
	return (
		<div
			className="flex items-center"
			dir="ltr"
		>
			{steps.map((step, i) => {
				const Icon =
					step.order === 1 ? IconPackageImport : step.order === 2 ? IconMail : IconCheck;
				const done = step.status === "done";
				const rejected = step.status === "rejected";
				return (
					<Fragment key={step.id}>
						<span
							className={cn(
								"flex size-6 shrink-0 items-center justify-center rounded-full",
								done
									? "bg-[#16A34A]/10 text-[#16A34A]"
									: rejected
										? "bg-[#DC2626]/10 text-[#DC2626]"
										: "bg-[#F4F4F4] text-[#0A0A0A]",
							)}
						>
							<Icon className="size-3.5" />
						</span>
						{i < steps.length - 1 && <span className="h-px flex-1 bg-[#E8E8E8]" />}
					</Fragment>
				);
			})}
		</div>
	);
}

export function LeaveAlertsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
	const { requests, refetch, isFetching } = useLeaveRequests();
	const [trackedId, setTrackedId] = useState<string | null>(null);

	// التنبيهات = الطلبات المعلّقة بانتظار الموافقة
	const pending = requests.filter((r) => r.status === "PENDING");

	return (
		<Sheet
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<SheetContent
				side="left"
				showCloseButton={false}
				className="flex w-full flex-col gap-0 p-0 sm:max-w-[605px]!"
			>
				{/* الهيدر */}
				<div
					className="flex items-center justify-between border-b px-4 py-2"
					dir="rtl"
				>
					<SheetTitle className="text-[13px] font-bold text-[#08090A]">
						تنبهات الطلبات الإجازات
					</SheetTitle>
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={onClose}
						type="button"
					>
						<IconX className="size-4" />
					</Button>
				</div>

				{/* القائمة */}
				<div
					className="flex flex-1 flex-col gap-3 overflow-y-auto px-3 pt-4"
					dir="rtl"
				>
					{pending.length === 0 && (
						<div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center">
							<span className="flex size-12 items-center justify-center rounded-full bg-emerald-50">
								<IconCheck className="size-6 text-emerald-500" />
							</span>
							<p className="text-sm font-medium text-[#08090A]">لا توجد تنبيهات</p>
							<p className="text-xs text-muted-foreground">
								لا توجد طلبات إجازة بانتظار الموافقة حاليًا.
							</p>
						</div>
					)}

					{pending.map((req) => (
						<div
							key={req.id}
							className="flex flex-col gap-3 rounded-[4px] border-[0.75px] border-[#E5E5E5] p-2.5"
						>
							<div className="flex items-center justify-between">
								{/* يمين: الأفاتار (يمين النص) + معلومات الطلب */}
								<div className="flex items-center gap-2">
									<span className="flex size-[23px] shrink-0 items-center justify-center rounded-full bg-[#4F6AE0] text-[9px] text-white">
										{initialsOf(req.staff.name)}
									</span>
									<div className="flex flex-col items-start gap-0.5 text-right">
										<span className="text-[11px] font-medium text-[#08090A]">
											{req.staff.name} · طلب أجازة #{req.code}
										</span>
										<span className="text-[9px] text-[#9B9B9D]">
											{req.staff.role?.name ?? "—"} · {req.staff.code}
										</span>
									</div>
								</div>

								{/* يسار: زر تتبع الطلب */}
								<button
									type="button"
									onClick={() => setTrackedId(req.id)}
									className="flex h-[22px] shrink-0 items-center gap-1 rounded-[4px] border-[0.75px] border-[#4F6AE0] px-[5px] text-[9px] font-medium text-[#4F6AE0]"
								>
									<IconChevronLeft className="size-[9px]" />
									تتبع الطلب
								</button>
							</div>

							<ApprovalStepper approvals={req.approvals} />
						</div>
					))}
				</div>

				{/* الفوتر */}
				<div
					className="flex items-center justify-between border-t px-4 py-2"
					dir="ltr"
				>
					<Button
						size="sm"
						onClick={() => refetch()}
						disabled={isFetching || pending.length === 0}
					>
						تجديد الكل
					</Button>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onClose}
					>
						إلغاء
					</Button>
				</div>
			</SheetContent>

			<LeaveReviewDialog
				requestId={trackedId}
				onClose={() => setTrackedId(null)}
			/>
		</Sheet>
	);
}
