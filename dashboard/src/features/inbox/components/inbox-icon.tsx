import {
	IconAt,
	IconBellMinus,
	IconCalendarCheck,
	IconCalendarPlus,
	IconCalendarX,
	IconChecklist,
	IconClock,
	IconFileInvoice,
	type IconProps,
	IconServer,
} from "@tabler/icons-react";
import type { ComponentType } from "react";

import type { InboxIcon } from "@/features/inbox/types/inbox.type";
import { cn } from "@/lib/utils";

// نبرة الشارة حسب طبيعة الإجراء: إيجابي (أخضر) / عادي (أزرق) / سلبي (أحمر)
type InboxTone = "positive" | "normal" | "negative";

const TONE_CLASSES: Record<InboxTone, string> = {
	positive: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
	normal: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
	negative: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400",
};

// خريطة نوع الإشعار إلى أيقونة ونبرة الشارة الدائرية في الصف
const ICON_MAP: Record<InboxIcon, { Icon: ComponentType<IconProps>; tone: InboxTone }> = {
	"appointment-cancelled": { Icon: IconCalendarX, tone: "negative" },
	"appointment-new": { Icon: IconCalendarPlus, tone: "normal" },
	"appointment-pending": { Icon: IconClock, tone: "normal" },
	"appointment-confirmed": { Icon: IconCalendarCheck, tone: "positive" },
	system: { Icon: IconServer, tone: "normal" },
	task: { Icon: IconChecklist, tone: "normal" },
	invoice: { Icon: IconFileInvoice, tone: "normal" },
	mention: { Icon: IconAt, tone: "normal" },
};

export function InboxIconBadge({ icon }: { icon: InboxIcon }) {
	const { Icon, tone } = ICON_MAP[icon] ?? { Icon: IconBellMinus, tone: "normal" };
	const className = TONE_CLASSES[tone];

	return (
		<span
			className={cn(
				"flex size-[22px] shrink-0 items-center justify-center rounded-full",
				className,
			)}
		>
			<Icon className="size-3" />
		</span>
	);
}
