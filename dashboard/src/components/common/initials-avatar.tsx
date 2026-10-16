import { cn } from "@/lib/utils";

// دائرة الأحرف الأولى — تُستخدم للطفل/وليّ الأمر في الجداول ورؤوس اللوحات.
export function InitialsAvatar({
	name,
	className,
}: {
	name?: string | null;
	className?: string;
}) {
	const safeName = typeof name === "string" ? name.trim() : "";
	const initials =
		safeName
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((w) => w[0])
			.join("")
			.toUpperCase() || "—";

	return (
		<div
			className={cn(
				"flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-semibold select-none",
				className,
			)}
		>
			{initials}
		</div>
	);
}
