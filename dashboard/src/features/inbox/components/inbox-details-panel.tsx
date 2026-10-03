import {
	IconCalendarEvent,
	IconCircleCheckFilled,
	IconCopy,
	IconFlag,
	IconMessage,
	IconPhoneCall,
} from "@tabler/icons-react";
import type { ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { InboxNotification } from "@/features/inbox/types/inbox.type";

// صف في لوحة التفاصيل: الملصق (والأيقونة) على اليمين، الإجراء/القيمة على اليسار
function DetailRow({
	label,
	icon,
	action,
}: {
	label: ReactNode;
	icon?: ReactNode;
	action: ReactNode;
}) {
	return (
		<div className="flex items-center gap-2">
			{/* الملصق أولًا ليبقى ملاصقًا لليمين (تدفق RTL) */}
			<span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
				{icon}
				<span className="text-foreground">{label}</span>
			</span>
			<span className="ms-auto">{action}</span>
		</div>
	);
}

const IMPORTANCE_LABEL: Record<InboxNotification["importance"], string> = {
	high: "عالية",
	normal: "متوسطة",
	low: "منخفضة",
};

export function InboxDetailsPanel({ notification }: { notification: InboxNotification }) {
	const staff = notification.contacts.find((c) => c.kind === "staff");
	const owner = notification.contacts.find((c) => c.kind === "owner");

	const copyPhone = () => {
		if (!owner?.phone) return;
		void navigator.clipboard.writeText(owner.phone);
		toast.success("تم النسخ");
	};

	return (
		<div className="flex h-full w-[249px] shrink-0 flex-col gap-6 overflow-y-auto border-s p-3">
			{/* التفاصيل */}
			<section className="flex flex-col gap-2.5">
				<h3 className="text-[13px] font-semibold text-foreground">التفاصيل</h3>

				<DetailRow
					label="مسودة"
					icon={<span className="size-2.5 rounded-full border border-muted-foreground/50" />}
					action={
						<Button
							variant="outline"
							size="xs"
							className="h-[18px] rounded-[4px] px-2 text-[10px]"
						>
							إشعار
						</Button>
					}
				/>

				<DetailRow
					label="تصنيف كـ"
					icon={<IconFlag className="size-3" />}
					action={null}
				/>

				<DetailRow
					label="الأهمية"
					icon={<IconFlag className="size-3" />}
					action={
						<span className="flex items-center gap-1.5 rounded-[4px] border px-2 py-0.5 text-[10px]">
							<span className="size-1.5 rounded-full bg-red-500" />
							{IMPORTANCE_LABEL[notification.importance]}
						</span>
					}
				/>

				<DetailRow
					label="اليوم"
					icon={<IconCalendarEvent className="size-3" />}
					action={
						<Button
							variant="outline"
							size="xs"
							className="h-[18px] rounded-[4px] px-2 text-[10px]"
						>
							إعادة الجدولة
						</Button>
					}
				/>
			</section>

			{/* المعنيون */}
			<section className="flex flex-col gap-2.5">
				<h3 className="text-[13px] font-semibold text-foreground">المعنيون</h3>

				{staff ? (
					<DetailRow
						label={staff.name}
						icon={<IconCircleCheckFilled className="size-3.5 text-primary" />}
						action={
							<Button
								variant="outline"
								size="xs"
								className="h-[18px] rounded-[4px] px-2 text-[10px]"
							>
								<IconMessage className="size-3" />
								إرسال رسالة
							</Button>
						}
					/>
				) : null}

				{owner?.phone ? (
					<DetailRow
						label={owner.phone}
						icon={<IconPhoneCall className="size-3 rtl:-scale-x-100" />}
						action={
							<Button
								variant="outline"
								size="xs"
								onClick={copyPhone}
								className="h-[18px] rounded-[4px] px-2 text-[10px]"
							>
								<IconCopy className="size-3" />
								نسخ
							</Button>
						}
					/>
				) : null}
			</section>
		</div>
	);
}
