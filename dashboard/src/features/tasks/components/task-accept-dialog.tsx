import { zodResolver } from "@hookform/resolvers/zod";
import {
	IconAlertCircle,
	IconArrowDown,
	IconArrowUp,
	IconCalendarEvent,
	IconChartBar,
	IconChevronLeft,
	IconClockHour4,
	IconX,
} from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { arSA, enUS } from "date-fns/locale";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { getTaskPriorityLabel } from "@/features/tasks/data/task-columns";
import type { TaskCardData } from "@/features/tasks/types/task.types";
import type { TaskPriority } from "@/generated/prisma/enums";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import { type AcceptTaskFormInput, acceptTaskSchema } from "@sanad/contracts/runtime/server/tasks/tasks.type";

const PRIORITY_OPTIONS: {
	value: TaskPriority;
	icon: typeof IconAlertCircle;
	className: string;
}[] = [
	{ value: "URGENT", icon: IconAlertCircle, className: "text-red-500" },
	{ value: "HIGH", icon: IconArrowUp, className: "text-orange-500" },
	{ value: "MEDIUM", icon: IconChartBar, className: "text-amber-500" },
	{ value: "LOW", icon: IconArrowDown, className: "text-slate-400" },
];

export type TaskAcceptDialogProps = {
	card: TaskCardData | null;
	open: boolean;
	onClose: () => void;
	onSubmit: (data: AcceptTaskFormInput) => void;
	isPending: boolean;
};

export function TaskAcceptDialog({
	card,
	open,
	onClose,
	onSubmit,
	isPending,
}: TaskAcceptDialogProps) {
	const { t, lang, isRtl } = useI18n();
	const dir = isRtl ? "rtl" : "ltr";
	const [deadlineOpen, setDeadlineOpen] = useState(false);
	const [priorityOpen, setPriorityOpen] = useState(false);

	const form = useForm<AcceptTaskFormInput>({
		resolver: zodResolver(acceptTaskSchema),
		defaultValues: { comment: "", deadline: undefined, priority: undefined },
	});

	const deadline = form.watch("deadline");
	const priority = form.watch("priority");
	const selectedPriority = PRIORITY_OPTIONS.find((o) => o.value === priority);

	const formattedDeadline = deadline
		? new Intl.DateTimeFormat(lang === "ar" ? "ar-SA" : "en-US", {
				day: "numeric",
				month: "long",
				year: "numeric",
			}).format(deadline)
		: undefined;

	const handleSubmit = form.handleSubmit((data) => {
		onSubmit(data);
		form.reset();
	});

	useHotkey("Mod+Enter", () => void handleSubmit(), { enabled: open && !isPending });

	const handleOpenChange = (v: boolean) => {
		if (!v) {
			form.reset();
			onClose();
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={handleOpenChange}
		>
			<DialogContent
				dir={dir}
				className="p-0 max-w-2xl! gap-0"
			>
				<DialogHeader className="border-b px-4 py-2">
					<DialogTitle className="flex items-center gap-2 text-base font-semibold">
						<span>{t("tasks.acceptDialog.title")}</span>
						<IconChevronLeft
							className={cn("size-4 text-muted-foreground", !isRtl && "rotate-180")}
						/>
						<span className="max-w-[280px] truncate font-normal">{card?.title}</span>
						<span className="text-xs font-normal tabular-nums text-muted-foreground">
							· {card?.code}
						</span>
					</DialogTitle>
				</DialogHeader>

				<div className="px-4 py-3">
					<Textarea
						placeholder={t("tasks.activity.commentPlaceholder")}
						className="min-h-[120px] resize-none border-none p-0 text-sm shadow-none focus-visible:ring-0"
						disabled={isPending}
						{...form.register("comment")}
					/>
				</div>

				<Separator />

				<div className="flex items-center gap-2 p-3">
					<Controller
						control={form.control}
						name="deadline"
						render={({ field }) => (
							<DropdownMenu
								open={deadlineOpen}
								onOpenChange={setDeadlineOpen}
							>
								<DropdownMenuTrigger asChild>
									<Button
										size="sm"
										variant="outline"
										className="h-8 gap-1.5 text-xs"
										type="button"
									>
										<IconCalendarEvent className="size-3.5" />
										{formattedDeadline ?? t("tasks.acceptDialog.deadline")}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="start"
									className="w-auto p-2"
								>
									<Calendar
										mode="single"
										selected={field.value}
										onSelect={(date) => {
											setDeadlineOpen(false);
											field.onChange(date);
										}}
										dir={dir}
										locale={lang === "ar" ? arSA : enUS}
									/>
									{field.value && (
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="w-full"
											onClick={() => {
												setDeadlineOpen(false);
												field.onChange(undefined);
											}}
										>
											{t("tasks.acceptDialog.clearDate")}
										</Button>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					/>

					<Controller
						control={form.control}
						name="priority"
						render={({ field }) => (
							<DropdownMenu
								open={priorityOpen}
								onOpenChange={setPriorityOpen}
								dir={dir}
							>
								<DropdownMenuTrigger asChild>
									<Button
										size="sm"
										variant="outline"
										className="h-8 gap-1.5 text-xs"
										type="button"
									>
										{selectedPriority ? (
											<>
												<selectedPriority.icon
													className={`size-3.5 ${selectedPriority.className}`}
												/>
												{getTaskPriorityLabel(t, selectedPriority.value)}
											</>
										) : (
											t("tasks.acceptDialog.noPriority")
										)}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									{PRIORITY_OPTIONS.map((opt) => (
										<DropdownMenuItem
											key={opt.value}
											onSelect={() => {
												setPriorityOpen(false);
												field.onChange(opt.value);
											}}
										>
											<opt.icon className={`size-4 ${opt.className}`} />
											{getTaskPriorityLabel(t, opt.value)}
										</DropdownMenuItem>
									))}
									{field.value && (
										<DropdownMenuItem
											onSelect={() => {
												setPriorityOpen(false);
												field.onChange(undefined);
											}}
										>
											<IconX className="size-4 text-muted-foreground" />
											{t("tasks.acceptDialog.noPriority")}
										</DropdownMenuItem>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					/>

					<div className="flex h-8 items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 text-xs text-amber-600">
						<IconClockHour4 className="size-3.5" />
						{t("tasks.labels.status.PENDING")}
					</div>
				</div>

				<Separator />

				<div className="flex items-center justify-between p-3">
					<p className="text-xs text-muted-foreground">{t("tasks.acceptDialog.helper")}</p>

					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2 opacity-50">
							<Switch
								id="accept-email-notification"
								disabled
							/>
							<Label
								htmlFor="accept-email-notification"
								className="cursor-not-allowed text-xs"
							>
								{t("tasks.acceptDialog.emailNotification")}
							</Label>
						</div>

						<Button
							disabled={isPending}
							onClick={() => void handleSubmit()}
						>
							<Kbd className="text-white">⌘↵</Kbd>
							{t("tasks.acceptDialog.submit")}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
