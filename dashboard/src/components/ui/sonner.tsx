import {
	IconAlertOctagon,
	IconAlertTriangle,
	IconCircleCheckFilled,
	IconInfoCircle,
	IconLoader,
} from "@tabler/icons-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
	return (
		<Sonner
			theme="light"
			className="toaster group"
			position="bottom-left"
			duration={8000}
			icons={{
				success: <IconCircleCheckFilled className="size-4.5 text-emerald-600 dark:text-emerald-400" />,
				info: <IconInfoCircle className="size-4 text-blue-600 dark:text-blue-400" />,
				warning: <IconAlertTriangle className="size-4 text-yellow-600 dark:text-yellow-400" />,
				error: <IconAlertOctagon className="size-4 text-red-600 dark:text-red-400" />,
				loading: <IconLoader className="size-4 animate-spin" />,
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
					success: "text-foreground",
					error: "text-red-700 dark:text-red-300",
					info: "text-blue-700 dark:text-blue-300",
					warning: "text-yellow-700 dark:text-yellow-300",
					loading: "text-primary dark:text-primary-foreground",
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
