import {
	IconBrandWhatsapp,
	IconChevronDown,
	IconCircleCheck,
	IconClockPause,
	IconPhone,
} from "@tabler/icons-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
	formatDate,
	formatDateTime,
	latenessLabel,
	latenessTone,
} from "@/features/reminders/data/reminders";
import { cn } from "@/lib/utils";
import type { RecallItem, RecallOwnerRow } from "@/server/reminders/reminders.type";

/**
 * [RC4] طاولة الاستدعاء — **صفٌّ لكل وليّ أمر، لا لكل طفل**.
 *
 * هذه هي الفكرة كلّها. قبل هذه الوحدة كانت الاستحقاقات موزّعة على أربع شاشات
 * مفاتيحُها الطفل، فوليّ أمرٌ له ثلاثة كلاب مستحقّة يظهر ثلاث مرّات في ثلاثة أماكن —
 * ويُكلَّم ثلاث مكالمات أو لا يُكلَّم أصلًا. هنا مكالمةٌ واحدة تُغلق بنوده كلّها.
 *
 * وليست جدولًا بأعمدة: الصفّ يُقرأ ويُتصرَّف فيه أثناء مكالمة، فالرقم والأزرار
 * على مستوى وليّ الأمر في الأعلى، والبنود تُفتح تحته عند الحاجة.
 */

export function RecallBoard({
	rows,
	isLoading,
	onLogContact,
	onMarkSent,
	canAct,
}: {
	rows: RecallOwnerRow[];
	isLoading: boolean;
	onLogContact: (row: RecallOwnerRow, item: RecallItem | null) => void;
	onMarkSent: (outboxId: string) => void;
	/** بلا صلاحية الإرسال تبقى الشاشة قابلة للقراءة وأزرارُ الفعل مخفيّة */
	canAct: boolean;
}) {
	if (isLoading) {
		return (
			<div className="flex flex-col gap-2 p-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Skeleton
						key={i}
						className="h-20 w-full rounded-md"
					/>
				))}
			</div>
		);
	}

	if (rows.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center gap-2 p-16 text-center">
				<IconCircleCheck className="size-8 text-muted-foreground" />
				<p className="font-medium text-sm">لا استدعاءات معلّقة</p>
				<p className="max-w-md text-muted-foreground text-xs">
					لا يوجد وليّ أمر لديه استحقاق لم يُعالَج ضمن المدى المحدَّد. جرّب توسيع المدى أو إظهار ما عُولج
					من شريط الأدوات.
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col divide-y">
			{rows.map((row) => (
				<OwnerRow
					key={row.ownerId}
					row={row}
					onLogContact={onLogContact}
					onMarkSent={onMarkSent}
					canAct={canAct}
				/>
			))}
		</div>
	);
}

function OwnerRow({
	row,
	onLogContact,
	onMarkSent,
	canAct,
}: {
	row: RecallOwnerRow;
	onLogContact: (row: RecallOwnerRow, item: RecallItem | null) => void;
	onMarkSent: (outboxId: string) => void;
	canAct: boolean;
}) {
	// أوّل وليّ أمرٍ في القائمة مفتوح: الشاشة تُفتح على عملٍ جاهز لا على قائمة مطويّة
	const [open, setOpen] = useState(false);

	return (
		<div className="flex flex-col">
			<div className="flex items-center gap-3 px-4 py-3">
				<button
					type="button"
					onClick={() => setOpen((v) => !v)}
					className="flex min-w-0 flex-1 items-center gap-3 text-start"
				>
					<IconChevronDown
						className={cn(
							"size-4 shrink-0 text-muted-foreground transition-transform",
							// السهم يدور لا يُستبدل — والدوران محايد اتجاهيًّا فلا يحتاج rtl:
							!open && "-rotate-90 rtl:rotate-90",
						)}
					/>
					<div className="flex min-w-0 flex-col">
						<span className="truncate font-medium text-sm">{row.ownerName}</span>
						<span className="truncate text-muted-foreground text-xs">
							{row.items.length} استحقاق ·{" "}
							<span className={latenessTone(row.worstDaysUntilDue)}>
								{latenessLabel(row.worstDaysUntilDue)}
							</span>
						</span>
					</div>
				</button>

				<div className="flex shrink-0 items-center gap-1.5">
					{row.items.slice(0, 3).map((item) => (
						<Badge
							key={item.dedupeKey}
							variant="outline"
							className="hidden text-xs sm:inline-flex"
						>
							{item.triggerLabel}
						</Badge>
					))}
					{row.items.length > 3 && (
						<Badge
							variant="outline"
							className="hidden text-xs sm:inline-flex"
						>
							+{row.items.length - 3}
						</Badge>
					)}

					{/*
					  رقم وليّ الأمر بصيغة E.164 هو ما يفتح به واتساب — نفس الرقم الذي يستعمله
					  الإرسال الآلي بالضبط. رقمٌ لا يُفهم ⇒ زرّ معطّل بسببٍ مُفصح، لا زرّ
					  صامت يفتح محادثةً مع لا أحد.
					*/}
					<Tooltip>
						<TooltipTrigger asChild>
							<span>
								<Button
									size="icon-sm"
									variant="ghost"
									disabled={!row.ownerPhoneE164}
									asChild={Boolean(row.ownerPhoneE164)}
								>
									{row.ownerPhoneE164 ? (
										<a
											href={`tel:${row.ownerPhoneE164}`}
											aria-label={`اتصال بـ${row.ownerName}`}
										>
											<IconPhone className="size-4" />
										</a>
									) : (
										<IconPhone className="size-4" />
									)}
								</Button>
							</span>
						</TooltipTrigger>
						<TooltipContent>
							{row.ownerPhoneE164 ? row.ownerPhoneE164 : "لا رقم جوال صالح لهذا وليّ الأمر"}
						</TooltipContent>
					</Tooltip>

					{canAct && (
						<Button
							size="sm"
							variant="outline"
							onClick={() => onLogContact(row, null)}
						>
							سجّل تواصلًا
						</Button>
					)}
				</div>
			</div>

			{open && (
				<div className="flex flex-col gap-2 border-t bg-muted/30 px-4 py-3">
					{row.items.map((item) => (
						<ItemRow
							key={item.dedupeKey}
							row={row}
							item={item}
							onLogContact={onLogContact}
							onMarkSent={onMarkSent}
							canAct={canAct}
						/>
					))}
				</div>
			)}
		</div>
	);
}

function ItemRow({
	row,
	item,
	onLogContact,
	onMarkSent,
	canAct,
}: {
	row: RecallOwnerRow;
	item: RecallItem;
	onLogContact: (row: RecallOwnerRow, item: RecallItem | null) => void;
	onMarkSent: (outboxId: string) => void;
	canAct: boolean;
}) {
	return (
		<div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-md bg-background px-3 py-2">
			<Badge
				variant="outline"
				className="text-xs"
			>
				{item.triggerLabel}
			</Badge>

			<span className="min-w-0 flex-1 truncate text-sm">
				{item.patientName ?? "—"}
				{item.details ? (
					<span className="text-muted-foreground"> — {item.details}</span>
				) : null}
			</span>

			<span className="whitespace-nowrap text-muted-foreground text-xs">
				{formatDate(item.dueAt)}
			</span>
			<span className={cn("whitespace-nowrap text-xs", latenessTone(item.daysUntilDue))}>
				{latenessLabel(item.daysUntilDue)}
			</span>

			{item.snoozedUntil && (
				<Badge
					variant="secondary"
					className="gap-1 text-xs"
				>
					<IconClockPause className="size-3" />
					مؤجَّل حتى {formatDate(item.snoozedUntil)}
				</Badge>
			)}

			{item.lastContactAt && (
				<Tooltip>
					<TooltipTrigger asChild>
						<Badge
							variant="secondary"
							className="text-xs"
						>
							كُلِّم {item.contactCount > 1 ? `×${item.contactCount}` : ""}
						</Badge>
					</TooltipTrigger>
					<TooltipContent>آخر تواصل: {formatDateTime(item.lastContactAt)}</TooltipContent>
				</Tooltip>
			)}

			<div className="flex items-center gap-1">
				{/*
				  رابط واتساب جاهز برسالته — لا مرسِل آليّ لواتساب في هذه النسخة، فالضغطة
				  هي الإرسال. و«تمّ الإرسال» فعلٌ صريح بعده: فتحُ الرابط لا يُثبت شيئًا.
				*/}
				{item.manualLink && (
					<Button
						size="icon-sm"
						variant="ghost"
						asChild
					>
						<a
							href={item.manualLink}
							target="_blank"
							rel="noopener noreferrer"
							aria-label="فتح رسالة واتساب الجاهزة"
						>
							<IconBrandWhatsapp className="size-4" />
						</a>
					</Button>
				)}
				{canAct && item.manualLink && item.outboxId && (
					<Button
						size="sm"
						variant="ghost"
						onClick={() => onMarkSent(item.outboxId as string)}
					>
						تمّ الإرسال
					</Button>
				)}
				{canAct && (
					<Button
						size="sm"
						variant="ghost"
						onClick={() => onLogContact(row, item)}
					>
						سجّل
					</Button>
				)}
			</div>
		</div>
	);
}
