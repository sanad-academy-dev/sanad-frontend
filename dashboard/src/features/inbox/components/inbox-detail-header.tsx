// شريط تفاصيل الوارد يُحقَن في القسم الأوسط من هيدر النظام عبر portal
import {
	IconBellMinus,
	IconCheck,
	IconChevronLeft,
	IconMessageOff,
	IconPaw,
	IconStar,
	IconX,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { useApprovalAction } from "@/features/inbox/hooks/use-inbox-mutations";
import type { InboxPatientRef } from "@/features/inbox/types/inbox.type";

export function InboxDetailHeader({
	itemId,
	title,
	patient,
	isApproval = false,
}: {
	itemId: string;
	title: string;
	patient?: InboxPatientRef;
	// عند تبويب الموافقات: تظهر أزرار قبول/رفض على اليسار
	isApproval?: boolean;
}) {
	const [slot, setSlot] = useState<HTMLElement | null>(null);
	const { approve, reject, isPending } = useApprovalAction(itemId);

	useEffect(() => {
		setSlot(document.getElementById("page-header-center-slot"));
	}, []);

	// عنوان مختصر (الجزء قبل الشرطة الطويلة)
	const shortTitle = useMemo(() => title.split("—")[0].trim(), [title]);

	if (!slot) return null;

	return createPortal(
		<div
			className="flex h-full w-full items-center mr-[11px] ml-[56px] justify-between gap-2 border-s border-e border-border px-4"
			dir="rtl"
		>
			{/* اليمين (أول عنصر في تدفق RTL): مسار العنوان (الطفل ‹ العنوان) */}
			<div className="flex items-center gap-1.5 text-[12px]">
				{patient ? (
					<>
						<span className="text-[10px] text-muted-foreground">{patient.code} ·</span>
						<button
							type="button"
							aria-label="تمييز بنجمة"
							className="flex size-[17px] items-center justify-center rounded-[4px] text-muted-foreground hover:bg-muted"
						>
							<IconStar className="size-3" />
						</button>
						<span className="font-bold text-foreground">{patient.name}</span>
						<button
							type="button"
							aria-label="عرض الطفل"
							className="flex size-[17px] items-center justify-center rounded-[4px] bg-muted text-muted-foreground hover:bg-muted/80"
						>
							<IconPaw className="size-3" />
						</button>

						<IconChevronLeft className="size-3 text-muted-foreground" />
					</>
				) : null}
				<span className="flex items-center gap-1 font-bold text-foreground">
					<IconBellMinus className="size-3.5 text-muted-foreground" />
					{shortTitle}
				</span>
			</div>

			{/* اليسار (آخر عنصر في تدفق RTL) */}
			{isApproval ? (
				// أزرار قبول/رفض في وضع الموافقات
				<div className="flex items-center gap-1.5">
					<Button
						type="button"
						size="xs"
						disabled={isPending}
						onClick={() => void approve()}
						className="h-[22px] gap-1 rounded-[4px] bg-green-600 px-2 text-[11px] primaryhover:bg-green-600/90"
					>
						<IconCheck className="size-3" />
						قبول
					</Button>
					<Button
						type="button"
						variant="destructive"
						size="xs"
						disabled={isPending}
						onClick={() => void reject()}
						className="h-[22px] gap-1 rounded-[4px] px-2 text-[11px]"
					>
						<IconX className="size-3" />
						رفض
					</Button>
				</div>
			) : (
				// أيقونات المحادثة والإشعار + الإجراءات في وضع الإشعارات
				<div className="flex items-center gap-1 text-muted-foreground">
					<IconMessageOff className="size-3.5" />
					<IconBellMinus className="size-4" />
				</div>
			)}
		</div>,
		slot,
	);
}
