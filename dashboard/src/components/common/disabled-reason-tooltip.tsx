import { type ReactNode, useEffect, useRef, useState } from "react";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/** مدة بقاء التلميح ظاهرًا بعد الضغط (مللي ثانية) */
const AUTO_HIDE_MS = 4000;

/**
 * يشرح سبب تعطيل زر — لا يظهر إلا عند محاولة الضغط عليه.
 *
 * الزر المعطّل لا يستقبل أحداث المؤشر (disabled:pointer-events-none) فتلتقط
 * الحاويةُ الضغطةَ نيابةً عنه. ومرساة التلميح عنصر شفاف بلا أحداث مؤشر، لأن
 * TooltipTrigger من Radix يغلق التلميح تلقائيًا عند أي ضغط عليه.
 */
export function DisabledReasonTooltip({
	reason,
	side = "top",
	className,
	children,
}: {
	/** نص السبب — اتركه فارغًا عندما يكون الزر مُفعّلًا فلا يُلفّ بشيء */
	reason?: string | null;
	side?: "top" | "bottom" | "left" | "right";
	className?: string;
	children: ReactNode;
}) {
	const [open, setOpen] = useState(false);
	const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (hideTimer.current) clearTimeout(hideTimer.current);
		};
	}, []);

	// اكتمل النموذج فزال السبب — أغلق التلميح إن كان ظاهرًا
	useEffect(() => {
		if (!reason) setOpen(false);
	}, [reason]);

	if (!reason) return children;

	const show = () => {
		setOpen(true);
		if (hideTimer.current) clearTimeout(hideTimer.current);
		hideTimer.current = setTimeout(() => setOpen(false), AUTO_HIDE_MS);
	};

	return (
		// حاوية تلتقط الضغط نيابة عن الزر المعطّل، وليست عنصرًا تفاعليًا بذاته
		<span
			className={cn("relative inline-flex", className)}
			onPointerDown={show}
		>
			<TooltipProvider>
				{/* مُتحكَّم به: التمرير بالماوس لا يفتحه، الضغط وحده يفعل */}
				<Tooltip
					open={open}
					onOpenChange={(next) => {
						if (!next) setOpen(false);
					}}
				>
					<TooltipTrigger asChild>
						<span
							aria-hidden
							className="pointer-events-none absolute inset-0"
						/>
					</TooltipTrigger>
					<TooltipContent
						side={side}
						sideOffset={6}
						className="max-w-sm text-center"
					>
						{reason}
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			{children}
		</span>
	);
}
