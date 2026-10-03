import { cn } from "@/lib/utils";

// دائرة الأحرف الأولى — تُستخدم للطفل/وليّ الأمر في الجداول ورؤوس اللوحات.
export function InitialsAvatar({ name, className }: { name: string; className?: string }) {
	const initials = name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();

	return (
		<div
			className={cn(
				"flex size-6 shrink-0 items-center justify-center rounded-full bg-primary primarytext-[10px] font-semibold",
				className,
			)}
		>
			{initials}
		</div>
	);
}
