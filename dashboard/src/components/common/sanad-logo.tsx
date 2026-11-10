import type * as React from "react";
import { cn } from "@/lib/utils";

export interface SanadLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
	/** عرض الأيقونة في الحالة المصغرة */
	iconOnly?: boolean;
}

export function SanadLogo({
	className,
	iconOnly = false,
	alt = "شعار سند",
	...props
}: SanadLogoProps) {
	return (
		<img
			src="/Logo%20dashboard.png"
			alt={alt}
			className={cn(
				"object-contain shrink-0 select-none",
				iconOnly ? "size-8" : "h-5 w-auto",
				className
			)}
			{...props}
		/>
	);
}
