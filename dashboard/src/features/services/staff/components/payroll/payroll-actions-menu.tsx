import {
	IconCalculator,
	IconChevronDown,
	IconHistory,
	IconPlayerPlay,
	type IconProps,
	IconReceipt2,
} from "@tabler/icons-react";
import type { ComponentType } from "react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type Action = {
	label: string;
	hint: string;
	icon: ComponentType<IconProps>;
	onSelect: () => void;
	/** الإجراء الرئيسي — يُبرز بلون العلامة داخل القائمة */
	primary?: boolean;
};

// صف واحد داخل القائمة: أيقونة في مربّع + عنوان فوق وصف مختصر.
// في RTL أول عنصر يمينًا، فالأيقونة تسبق النص في ترتيب DOM.
function ActionRow({ action }: { action: Action }) {
	const Icon = action.icon;
	return (
		<DropdownMenuItem
			onSelect={action.onSelect}
			className="items-start gap-2.5 rounded-md px-2 py-2"
		>
			<span
				className={cn(
					"mt-px flex size-7 shrink-0 items-center justify-center rounded-[4px] border transition-colors",
					action.primary
						? "border-primary/25 bg-primary/10 text-primary"
						: "border-border bg-muted/60 text-muted-foreground group-hover/dropdown-menu-item:text-foreground",
				)}
			>
				<Icon className="size-4" />
			</span>
			<span className="flex min-w-0 flex-col gap-0.5">
				<span
					className={cn("text-xs leading-4", action.primary ? "font-bold" : "font-medium")}
				>
					{action.label}
				</span>
				<span className="text-[10px] leading-[14px] text-muted-foreground">{action.hint}</span>
			</span>
		</DropdownMenuItem>
	);
}

export function PayrollActionsMenu({
	hasCurrentRun,
	onRun,
	onOffCycle,
	onEndOfService,
	onHistory,
}: {
	hasCurrentRun: boolean;
	onRun: () => void;
	onOffCycle: () => void;
	onEndOfService: () => void;
	onHistory: () => void;
}) {
	const primary: Action = {
		label: hasCurrentRun ? "متابعة الإعداد" : "تشغيل الرواتب",
		hint: hasCurrentRun
			? "استئناف مسير هذا الشهر من حيث توقّفت"
			: "بدء مسير الرواتب الشهري خطوة بخطوة",
		icon: IconPlayerPlay,
		onSelect: onRun,
		primary: true,
	};

	const secondary: Action[] = [
		{
			label: "مسير خارج الدورة",
			hint: "صرف استثنائي بمبالغ يدوية خارج المسير الشهري",
			icon: IconReceipt2,
			onSelect: onOffCycle,
		},
		{
			label: "حاسبة نهاية الدورة",
			hint: "احتساب مستحقات موظف عند انتهاء عقده",
			icon: IconCalculator,
			onSelect: onEndOfService,
		},
		{
			label: "السجل التاريخي",
			hint: "استعراض المسيرات السابقة وتقاريرها",
			icon: IconHistory,
			onSelect: onHistory,
		},
	];

	return (
		// dir="rtl" لازم: القائمة تُعرض في portal خارج شجرة الصفحة فلا ترث اتجاهها
		<DropdownMenu dir="rtl">
			<DropdownMenuTrigger asChild>
				<Button
					type="button"
					size="sm"
					className="h-[30px] gap-1.5 text-xs font-bold"
				>
					<IconPlayerPlay className="size-3.5" />
					إجراءات المسير
					<IconChevronDown className="size-3.5 opacity-70 transition-transform group-aria-expanded/button:rotate-180" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="start"
				className="w-[268px] p-1.5"
			>
				<ActionRow action={primary} />
				<DropdownMenuSeparator className="my-1.5" />
				{secondary.map((action) => (
					<ActionRow
						key={action.label}
						action={action}
					/>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
