import type * as React from "react";
import { cn } from "@/lib/utils";

export interface SanadLogoProps extends React.HTMLAttributes<HTMLDivElement> {
	/** عرض الأيقونة فقط (ثلاث كتل بنفسجية) بدون الاسم */
	iconOnly?: boolean;
}

export function SanadLogo({ className, iconOnly = false, style, ...props }: SanadLogoProps) {
	if (iconOnly) {
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 867 433.5"
				className={cn("shrink-0", className)}
				aria-label="شعار سند"
				role="img"
				style={style}
				{...(props as React.SVGProps<SVGSVGElement>)}
			>
				<g
					fill="#9b18e7"
					className="fill-[#9b18e7] dark:fill-[#c084fc]"
				>
					<polygon points="578,433.5 867,289 867,0 578,144.5" />
					<polygon points="289,433.5 578,289 578,0 289,144.5" />
					<polygon points="0,433.5 289,289 289,0 0,144.5" />
				</g>
			</svg>
		);
	}

	return (
		<div
			className={cn("inline-flex items-center gap-2 select-none", className)}
			style={{ direction: "ltr", ...style }}
			aria-label="شعار سند"
			role="img"
			{...props}
		>
			{/* اسم سند (عربي وإنجليزي) بخط واضح وأنيق */}
			<div className="flex flex-col items-start justify-center leading-none">
				<span
					className="font-black text-[#9b18e7] dark:text-[#c084fc] select-none"
					style={{
						fontFamily: "'IBM Plex Sans Arabic', system-ui, -apple-system, sans-serif",
						fontSize: "1.2rem",
						lineHeight: 1,
						fontWeight: 800,
					}}
				>
					سند
				</span>
				<span
					className="font-black text-[#9b18e7] dark:text-[#c084fc] select-none tracking-[0.24em] mt-0.5"
					style={{
						fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
						fontSize: "0.62rem",
						lineHeight: 1,
						fontWeight: 800,
					}}
				>
					SANAD
				</span>
			</div>

			{/* أيقونة سند: الكتل الهندسية الثلاث باللون البنفسجي */}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 867 433.5"
				className="h-7 w-auto shrink-0 fill-[#9b18e7] dark:fill-[#c084fc]"
				aria-hidden="true"
			>
				<polygon points="578,433.5 867,289 867,0 578,144.5" />
				<polygon points="289,433.5 578,289 578,0 289,144.5" />
				<polygon points="0,433.5 289,289 289,0 0,144.5" />
			</svg>
		</div>
	);
}
