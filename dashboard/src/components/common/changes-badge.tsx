import { cn } from "@/lib/utils";

/**
 * شارة عدد التعديلات غير المحفوظة — تظهر أعلى النموذج عند أي تغيير،
 * في الإضافة والتعديل على حد سواء. لا تُعِد بناءها داخل كل نموذج.
 */
export const ChangesBadge = ({ count, className }: { count: number; className?: string }) => {
	if (count <= 0) return null;

	return (
		<span
			className={cn(
				"flex shrink-0 items-center gap-1 rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold whitespace-nowrap text-amber-600 dark:text-amber-400",
				className,
			)}
		>
			<span className="size-1 shrink-0 rounded-full bg-current" />
			{count} تعديل
		</span>
	);
};
