import { IconBrandWhatsapp, IconX } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDateTime, OUTBOX_STATUS_META } from "@/features/reminders/data/reminders";
import type { OutboxMessageResponse } from "@/server/reminders/reminders.type";

/**
 * [RC2] الصندوق الصادر — «ماذا أرسلنا، ولمن، ولماذا لم يصل هذا؟».
 *
 * الجسد المعروض هنا **لقطة** لا قالبٌ يُحلّ الآن: تعديل القالب غدًا لا يغيّر ما
 * أُرسل أمس. وهذا ما يجعل الشاشة سجلًّا يُحتجّ به لا عرضًا تقديريًّا.
 *
 * وسبب التعذّر يُعرض في العمود لا يُخفى خلف تلميح: «لا رقم جوال لدى وليّ الأمر» هو
 * بالضبط ما يحتاج الموظّف إصلاحه، وإخفاؤه يجعل الرسالة تبدو ضائعة بلا سبب.
 */
export function OutboxTable({
	messages,
	isLoading,
	triggerLabels,
	onMarkSent,
	onCancel,
	canAct,
}: {
	messages: OutboxMessageResponse[];
	isLoading: boolean;
	triggerLabels: Record<string, string>;
	onMarkSent: (id: string) => void;
	onCancel: (id: string) => void;
	canAct: boolean;
}) {
	if (isLoading) {
		return (
			<div className="flex flex-col gap-2 p-4">
				{Array.from({ length: 6 }).map((_, i) => (
					<Skeleton
						key={i}
						className="h-12 w-full rounded-md"
					/>
				))}
			</div>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>الحالة</TableHead>
					<TableHead>المستلِم</TableHead>
					<TableHead>السبب</TableHead>
					<TableHead>القناة</TableHead>
					<TableHead>الموعد</TableHead>
					<TableHead>الرسالة</TableHead>
					<TableHead className="w-[140px]" />
				</TableRow>
			</TableHeader>
			<TableBody>
				{messages.map((message) => {
					const meta = OUTBOX_STATUS_META[message.status];
					const pending = message.status === "QUEUED" || message.status === "AWAITING_MANUAL";
					return (
						<TableRow key={message.id}>
							<TableCell>
								<Badge
									variant={meta.variant}
									className="text-xs"
								>
									{meta.label}
								</Badge>
							</TableCell>

							<TableCell className="max-w-[180px]">
								<span className="block truncate text-sm">{message.owner?.name ?? "—"}</span>
								<span className="block truncate text-muted-foreground text-xs">
									{message.toAddress ?? "بلا عنوان"}
								</span>
							</TableCell>

							<TableCell>
								<Badge
									variant="outline"
									className="text-xs"
								>
									{message.trigger ? (triggerLabels[message.trigger] ?? message.trigger) : "—"}
								</Badge>
								{message.patient?.name && (
									<span className="block text-muted-foreground text-xs">
										{message.patient.name}
									</span>
								)}
							</TableCell>

							<TableCell className="whitespace-nowrap text-sm">
								{message.channel}
								{message.attempts > 1 && (
									<span className="block text-muted-foreground text-xs">
										{message.attempts} محاولات
									</span>
								)}
							</TableCell>

							<TableCell className="whitespace-nowrap text-muted-foreground text-xs">
								{message.sentAt
									? `أُرسلت ${formatDateTime(message.sentAt)}`
									: formatDateTime(message.scheduledFor)}
							</TableCell>

							<TableCell className="max-w-[280px]">
								<Tooltip>
									<TooltipTrigger asChild>
										<span className="block truncate text-sm">
											{message.subject ?? firstLine(message.body)}
										</span>
									</TooltipTrigger>
									<TooltipContent className="max-w-[420px]">
										<pre className="whitespace-pre-wrap font-sans text-xs">{message.body}</pre>
									</TooltipContent>
								</Tooltip>
								{message.lastError && (
									<span className="block truncate text-destructive text-xs">
										{message.lastError}
									</span>
								)}
							</TableCell>

							<TableCell>
								<div className="flex items-center justify-end gap-1">
									{message.manualLink && (
										<Button
											size="icon-sm"
											variant="ghost"
											asChild
										>
											<a
												href={message.manualLink}
												target="_blank"
												rel="noopener noreferrer"
												aria-label="فتح رسالة واتساب"
											>
												<IconBrandWhatsapp className="size-4" />
											</a>
										</Button>
									)}
									{canAct && message.status === "AWAITING_MANUAL" && (
										<Button
											size="sm"
											variant="ghost"
											onClick={() => onMarkSent(message.id)}
										>
											تمّ الإرسال
										</Button>
									)}
									{canAct && pending && (
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													size="icon-sm"
													variant="ghost"
													onClick={() => onCancel(message.id)}
												>
													<IconX className="size-4" />
												</Button>
											</TooltipTrigger>
											<TooltipContent>إلغاء الرسالة</TooltipContent>
										</Tooltip>
									)}
								</div>
							</TableCell>
						</TableRow>
					);
				})}

				{messages.length === 0 && (
					<TableRow>
						<TableCell
							colSpan={7}
							className="py-12 text-center text-muted-foreground text-sm"
						>
							لا رسائل بعد. شغّل قاعدة من تبويب «القواعد» لتظهر هنا.
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}

const firstLine = (body: string): string =>
	body.split("\n").find((line) => line.trim().length > 0) ?? "—";
