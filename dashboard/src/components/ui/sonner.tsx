import {
	IconAlertOctagon,
	IconAlertTriangle,
	IconCircleCheckFilled,
	IconInfoCircle,
	IconLoader,
	IconX,
} from "@tabler/icons-react";
import React, { useEffect } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
	// منع مشكلة الـ Pointer Capture من ابتلاع أحداث النقر على زر إغلاق التوست
	useEffect(() => {
		const handlePointerDown = (e: PointerEvent) => {
			const target = e.target as HTMLElement | null;
			if (target?.closest?.("[data-close-button]")) {
				e.stopPropagation();
			}
		};
		window.addEventListener("pointerdown", handlePointerDown, true);
		return () => window.removeEventListener("pointerdown", handlePointerDown, true);
	}, []);

	return (
		<Sonner
			theme="light"
			className="toaster group"
			position="bottom-left"
			duration={6000}
			closeButton={true}
			icons={{
				success: <IconCircleCheckFilled className="size-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
				info: <IconInfoCircle className="size-4 text-blue-600 dark:text-blue-400 shrink-0" />,
				warning: <IconAlertTriangle className="size-4 text-yellow-600 dark:text-yellow-400 shrink-0" />,
				error: <IconAlertOctagon className="size-4 text-red-600 dark:text-red-400 shrink-0" />,
				loading: <IconLoader className="size-4 animate-spin shrink-0" />,
				close: (
					<IconX className="size-3.5 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors pointer-events-none" />
				),
			}}
			dir="rtl"
			style={
				{
					"--normal-bg": "var(--popover)",
					"--normal-text": "var(--popover-foreground)",
					"--normal-border": "var(--border)",
					"--border-radius": "8px",
				} as React.CSSProperties
			}
			toastOptions={{
				style: {
					fontFamily: "'IBM Plex Sans Arabic', 'Inter Variable', sans-serif",
				},
				classNames: {
					toast: "cn-toast text-right!",
					title: "text-[13px] font-medium text-foreground",
					success: "text-foreground",
					error: "text-red-700 dark:text-red-300",
					info: "text-blue-700 dark:text-blue-300",
					warning: "text-yellow-700 dark:text-yellow-300",
					loading: "text-primary dark:text-primary-foreground",
					closeButton:
						"!border-0 !bg-transparent text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 !shadow-none hover:!bg-zinc-100 dark:hover:!bg-zinc-800 transition-colors cursor-pointer",
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
