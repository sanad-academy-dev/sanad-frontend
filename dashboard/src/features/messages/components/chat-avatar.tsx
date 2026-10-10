import { IconUsers } from "@tabler/icons-react";

import type { ConversationKind } from "@/features/messages/types/messages.type";
import { cn } from "@/lib/utils";

const initialsOf = (name: string) =>
	name
		.trim()
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((word) => word[0])
		.join("");

/**
 * أفاتار المحادثة — أحرف أولى للفرد وأيقونة مجموعة للمحادثة الجماعية،
 * مع نقطة حالة خضراء في الزاوية السفلية من جهة النهاية (يسار في RTL).
 */
export function ChatAvatar({
	name,
	kind = "direct",
	online = false,
	size = 32,
	className,
}: {
	name: string;
	kind?: ConversationKind;
	online?: boolean;
	size?: number;
	className?: string;
}) {
	const dot = Math.max(8, Math.round(size * 0.28));

	return (
		<span
			className={cn("relative inline-flex shrink-0", className)}
			style={{ width: size, height: size }}
		>
			<span
				className="flex size-full items-center justify-center rounded-full bg-primary/10 font-semibold text-primary"
				style={{ fontSize: Math.max(10, Math.round(size * 0.36)) }}
			>
				{kind === "group" ? (
					<IconUsers
						className="text-primary"
						style={{ width: size * 0.5, height: size * 0.5 }}
						stroke={1.75}
					/>
				) : (
					initialsOf(name)
				)}
			</span>

			{online && (
				<span
					className="absolute bottom-0 inset-e-0 rounded-full bg-green-500 ring-2 ring-background"
					style={{ width: dot, height: dot }}
					title="متصل"
				/>
			)}
		</span>
	);
}
