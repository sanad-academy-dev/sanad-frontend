import { IconEye, IconLayoutSidebarRightExpand } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
	describeHistoryEntry,
	historyTimeLabel,
} from "@/features/services/patients/utils/patient-history";
import { cn } from "@/lib/utils";
import type { PatientHistoryEntry } from "@/server/patients/patients.type";

interface PatientHistoryRowProps {
	entry: PatientHistoryEntry;
	/** معاينة سريعة داخل نافذة — لا تُغادر ملف الطفل */
	onPreview: () => void;
	/** فتح السجل الأصلي في لوحته الجانبية */
	onOpenRecord: () => void;
}

/**
 * صف واحد على الخط الزمني. جسم الصف نفسه يفتح المعاينة السريعة (الهدف الأكبر
 * والأكثر طلبًا)، والزرّان في الطرف يصرّحان بالإجراءين لمن يبحث عنهما.
 */
export function PatientHistoryRow({ entry, onPreview, onOpenRecord }: PatientHistoryRowProps) {
	const meta = describeHistoryEntry(entry);
	const Icon = meta.icon;

	return (
		<div
			className={cn(
				"group relative flex items-center gap-2 rounded-[4px] border bg-card ps-2 pe-1 py-2 transition-colors hover:bg-muted/50",
				meta.isCancelled && "opacity-60",
			)}
		>
			{/*
			  النقطة على الخط الزمني. الإزاحة = حشوة عمود السجلات (16px) + حدّ الصف
			  (1px) + نصف قطر النقطة (5px) فتستقرّ على الخط تمامًا؛ تغيير ps-4 في
			  التبويب يستلزم تغييرها معه.
			*/}
			<span
				aria-hidden
				className={cn(
					"absolute start-[-22px] top-1/2 size-2.5 -translate-y-1/2 rounded-full ring-2 ring-background",
					meta.dotClassName,
				)}
			/>

			<button
				type="button"
				onClick={onPreview}
				className="flex min-w-0 flex-1 items-center gap-2.5 text-start"
			>
				<span
					className={cn(
						"flex size-8 shrink-0 items-center justify-center rounded-[4px]",
						meta.iconClassName,
					)}
				>
					<Icon className="size-4" />
				</span>

				<span className="flex min-w-0 flex-1 flex-col gap-0.5">
					<span className="flex items-center gap-1.5">
						<span
							className={cn(
								"truncate text-sm font-medium",
								meta.isCancelled && "line-through",
							)}
						>
							{meta.title}
						</span>
						<span
							className="shrink-0 text-[11px] text-muted-foreground tabular-nums"
							dir="ltr"
						>
							{meta.code}
						</span>
					</span>

					<span className="flex items-center gap-1.5 text-xs text-muted-foreground">
						<span className="tabular-nums">{historyTimeLabel(entry.occurredAt)}</span>
						<span aria-hidden>·</span>
						<span>{meta.kindLabel}</span>
						{meta.subtitle && (
							<>
								<span aria-hidden>·</span>
								<span className="truncate">{meta.subtitle}</span>
							</>
						)}
					</span>
				</span>

				<Badge
					variant="outline"
					className="shrink-0 font-normal"
				>
					{meta.statusLabel}
				</Badge>
			</button>

			<div className="flex shrink-0 items-center">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							size="icon"
							variant="ghost"
							className="size-7"
							onClick={onPreview}
							aria-label="معاينة سريعة"
						>
							<IconEye className="size-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>معاينة سريعة</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							size="icon"
							variant="ghost"
							className="size-7"
							onClick={onOpenRecord}
							aria-label="فتح السجل"
						>
							<IconLayoutSidebarRightExpand className="size-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>فتح السجل</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
}
