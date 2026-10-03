import { ImSpinner7 } from "react-icons/im";
import { cn } from "@/lib/utils";

export function Spinner({
	className,
	containerClassName,
}: {
	className?: string;
	containerClassName?: string;
}) {
	return (
		<div className={cn("flex min-h-dvh items-center justify-center", containerClassName)}>
			<ImSpinner7 className={cn("size-10 animate-spin text-primary", className)} />
		</div>
	);
}
