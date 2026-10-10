import {
	IconCalendarEvent,
	IconCalendarX,
	IconChevronLeft,
	IconCircle,
	IconCircleCheck,
	IconCircleX,
	IconClockHour4,
	IconCopy,
	IconDots,
	IconInbox,
	IconMessage,
	IconPlayerPlay,
	IconPlus,
	IconX,
} from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ElementType } from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { AddDocumentModal } from "@/features/appointments/components/tabs/visit-info/add-document-modal";
import { ConfirmDiscard } from "@/features/settings/components/confirm-discard";
import { TaskAcceptDialog } from "@/features/tasks/components/task-accept-dialog";
import { TaskActivitySection } from "@/features/tasks/components/task-activity-section";
import { TaskDeclineDialog } from "@/features/tasks/components/task-decline-dialog";
import { getTaskStatusLabel } from "@/features/tasks/data/task-columns";
import { useAcceptTask } from "@/features/tasks/hooks/use-accept-task";
import { useDeclineTask } from "@/features/tasks/hooks/use-decline-task";
import { useTask } from "@/features/tasks/hooks/use-task";
import type { TaskCardData } from "@/features/tasks/types/task.types";
import type { TaskStatus } from "@/generated/prisma/enums";
import { useI18n } from "@/hooks/use-i18n";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

const TASK_STATUS_META: Record<string, { icon: ElementType; className: string }> = {
	PENDING: { icon: IconClockHour4, className: "text-amber-500" },
	NOT_YET_STARTED: { icon: IconCircle, className: "text-slate-400" },
	IN_PROGRESS: { icon: IconPlayerPlay, className: "text-blue-500" },
	COMPLETED: { icon: IconCircleCheck, className: "text-green-500" },
	CANCELLED: { icon: IconCircleX, className: "text-red-500" },
	DUPLICATE: { icon: IconCopy, className: "text-rose-500" },
	QUEUE: { icon: IconInbox, className: "text-pink-500" },
};

function Initials({ name, className }: { name: string; className?: string }) {
	const initials = name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
	return (
		<div
			className={
				className ??
				"flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white"
			}
		>
			{initials}
		</div>
	);
}

function formatDate(date: Date | string | null | undefined, locale: string): string {
	if (!date) return "—";
	return new Intl.DateTimeFormat(locale, {
		day: "numeric",
		month: "numeric",
		year: "numeric",
	}).format(new Date(date));
}

export type TaskSheetProps = {
	card: TaskCardData | null;
	open: boolean;
	onClose: () => void;
};

export function TaskSheet({ card, open, onClose }: TaskSheetProps) {
	const { t, lang, isRtl } = useI18n();
	const side = isRtl ? "left" : "right";
	const dir = isRtl ? "rtl" : "ltr";
	const locale = lang === "ar" ? "ar-SA" : "en-US";
	const { task } = useTask(card?.id ?? null);
	const queryClient = useQueryClient();
	const [newSubtaskText, setNewSubtaskText] = useState("");
	const [addingSubtask, setAddingSubtask] = useState(false);
	const subtaskInputRef = useRef<HTMLInputElement>(null);
	const [acceptOpen, setAcceptOpen] = useState(false);
	const [declineOpen, setDeclineOpen] = useState(false);

	const statusMeta = task ? (TASK_STATUS_META[task.status] ?? null) : null;
	const StatusIcon = statusMeta?.icon ?? null;

	const assignees = task?.assignees ?? [];

	const { mutate: toggleSubtask } = useMutation({
		mutationFn: async ({
			subtaskId,
			isCompleted,
		}: {
			subtaskId: string;
			isCompleted: boolean;
		}) => {
			if (!card) return;
			const res = await api
				.tasks({ id: card.id })
				.subtasks({ subtaskId })
				.patch({ isCompleted });
			if (res.error) throw new Error(t("tasks.errors.updateSubtask"));
			return isCompleted;
		},
		onSuccess: (isCompleted) => {
			void queryClient.invalidateQueries({ queryKey: ["task", card?.id] });
			void queryClient.invalidateQueries({ queryKey: ["tasks"] });
			if (isCompleted) toast.success(t("tasks.toasts.subtaskCompleted"));
		},
		onError: () => toast.error(t("tasks.errors.updateSubtask")),
	});

	const { mutate: addSubtask, isPending: isAddingSubtask } = useMutation({
		mutationFn: async (title: string) => {
			if (!card) return;
			const res = await api.tasks({ id: card.id }).subtasks.post({ title });
			if (res.error) throw new Error(t("tasks.errors.addSubtask"));
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["task", card?.id] });
			void queryClient.invalidateQueries({ queryKey: ["tasks"] });
			setNewSubtaskText("");
			setAddingSubtask(false);
		},
		onError: () => toast.error(t("tasks.errors.addSubtask")),
	});

	const { acceptTask, isAccepting } = useAcceptTask(card?.id ?? null, {
		onSuccess: () => setAcceptOpen(false),
	});

	const { declineTask, isDeclining } = useDeclineTask(card?.id ?? null, {
		onSuccess: () => setDeclineOpen(false),
	});

	const { mutateAsync: updateStatusAsync, isPending: isUpdatingStatus } = useMutation({
		mutationFn: async (newStatus: TaskStatus) => {
			if (!card) return;
			const res = await api.tasks({ id: card.id }).patch({ status: newStatus });
			if (res.error) throw new Error(t("tasks.toasts.updateStatusError"));
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["task", card?.id] });
			void queryClient.invalidateQueries({ queryKey: ["tasks"] });
			void queryClient.invalidateQueries({ queryKey: ["task-activity", card?.id] });
		},
	});

	const handleStatusChange = (value: string) => {
		toast.promise(updateStatusAsync(value as TaskStatus), {
			loading: t("tasks.toasts.updateStatusLoading"),
			success: t("tasks.toasts.updateStatusSuccess"),
			error: (err: Error) => err.message || t("tasks.toasts.updateStatusError"),
		});
	};

	const handleAddSubtask = () => {
		const title = newSubtaskText.trim();
		if (!title) return;
		addSubtask(title);
	};

	return (
		<>
			<Sheet
				open={open}
				onOpenChange={(isOpen) => {
					if (!isOpen) onClose();
				}}
			>
				<SheetContent
					side={side}
					showCloseButton={false}
					className="max-w-2/3! w-full gap-0"
					dir={dir}
				>
					<SheetHeader className="p-0">
						<div className="flex items-center justify-between gap-2 border-b px-4 py-2">
							<SheetTitle className="flex items-center gap-2 font-bold text-lg">
								<p>{t("tasks.title")}</p>
								<IconChevronLeft className={cn("size-4", !isRtl && "rotate-180")} />
								{card && (
									<>
										<p className="max-w-[240px] truncate">{card.title}</p>
										<span className="text-xs font-normal tabular-nums text-muted-foreground">
											{card.code}
										</span>
									</>
								)}
							</SheetTitle>

							<div className="flex items-center gap-1">
								{card && (
									<Button
										size="icon"
										variant="ghost"
										className="size-8"
										onClick={() => {
											void navigator.clipboard.writeText(card.code);
											toast.success(t("tasks.toasts.copyTaskCode"));
										}}
									>
										<IconCopy className="size-4" />
									</Button>
								)}

								{/* الطابور = صندوق الموافقات — القبول/الرفض متاح فقط قبل دخول سير العمل */}
								{task?.status === "QUEUE" && (
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												size="icon"
												variant="ghost"
												className="size-8"
											>
												<IconDots className="size-4" />
											</Button>
										</DropdownMenuTrigger>

										<DropdownMenuContent align="start">
											<DropdownMenuItem onSelect={() => setAcceptOpen(true)}>
												<IconCalendarEvent className="size-4" />
												{t("tasks.sheet.acceptTask")}
											</DropdownMenuItem>
											<DropdownMenuItem
												onSelect={() => setDeclineOpen(true)}
												className="text-destructive focus:text-destructive"
											>
												<IconCalendarX className="size-4" />
												{t("tasks.sheet.declineTask")}
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								)}

								<Button
									size="icon"
									variant="ghost"
									className="size-8"
									onClick={onClose}
								>
									<IconX className="size-4" />
								</Button>
							</div>
						</div>
					</SheetHeader>

					<div className="grid min-h-0 flex-1 grid-cols-7 overflow-hidden">
						<div
							className="col-span-5 flex flex-col gap-0 overflow-y-auto"
							dir={dir}
						>
							{task && (
								<div className="flex flex-col gap-6 p-4">
									{/* Description */}
									<div className="flex flex-col gap-2">
										<p className="font-semibold text-sm">{t("tasks.sheet.description")}</p>
										<Textarea
											readOnly
											value={task.content ?? ""}
											placeholder={t("tasks.sheet.noDescription")}
											className="min-h-[80px] resize-none border-muted bg-muted/30 text-sm"
										/>
									</div>

									{/* Subtasks */}
									<div className="flex flex-col gap-3">
										<div className="flex items-center justify-between gap-2">
											<p className="font-semibold text-sm">{t("tasks.sheet.subtasks")}</p>
											<Button
												size="xs"
												variant="outline"
												className="h-7 text-xs"
												onClick={() => {
													setAddingSubtask(true);
													setTimeout(() => subtaskInputRef.current?.focus(), 50);
												}}
											>
												<IconPlus className="size-3" />
												{t("tasks.sheet.addSubtask")}
											</Button>
										</div>

										<div className="flex flex-col gap-2">
											{task.subtasks.map((sub) => (
												<div
													key={sub.id}
													className="flex items-center gap-2 rounded-md border px-3 py-2 hover:bg-muted/30"
												>
													<Checkbox
														checked={sub.isCompleted}
														onCheckedChange={(checked) =>
															toggleSubtask({ subtaskId: sub.id, isCompleted: !!checked })
														}
													/>
													<span
														className={`text-sm ${sub.isCompleted ? "text-muted-foreground line-through" : ""}`}
													>
														{sub.title}
													</span>
												</div>
											))}

											{addingSubtask && (
												<div className="flex items-center gap-2 rounded-md border px-3 py-2">
													<Checkbox disabled />
													<input
														ref={subtaskInputRef}
														className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
														placeholder={t("tasks.sheet.subtaskPlaceholder")}
														value={newSubtaskText}
														onChange={(e) => setNewSubtaskText(e.target.value)}
														onKeyDown={(e) => {
															if (e.key === "Enter") handleAddSubtask();
															if (e.key === "Escape") {
																setAddingSubtask(false);
																setNewSubtaskText("");
															}
														}}
														disabled={isAddingSubtask}
													/>
													<ConfirmDiscard
														onConfirm={handleAddSubtask}
														onDiscard={() => {
															setAddingSubtask(false);
															setNewSubtaskText("");
														}}
														disabled={isAddingSubtask}
														confirmDisabled={isAddingSubtask || !newSubtaskText.trim()}
													/>
												</div>
											)}
										</div>
									</div>

									{/* Attachments */}
									<div className="flex flex-col gap-3">
										<div className="flex items-center justify-between gap-2">
											<p className="font-semibold text-sm">{t("tasks.sheet.attachments")}</p>
											<AddDocumentModal
												appointmentId={card?.id ?? ""}
												trigger={
													<Button
														size="xs"
														variant="outline"
														className="h-7 text-xs"
													>
														<IconPlus className="size-3" />
														{t("tasks.sheet.addAttachment")}
													</Button>
												}
											/>
										</div>
									</div>

									<Separator />

									<TaskActivitySection taskId={task.id} />
								</div>
							)}
						</div>

						<div
							className="col-span-2 flex flex-col gap-6 overflow-y-auto border-s p-4"
							dir={dir}
						>
							{/* Details */}
							<div className="flex flex-col gap-3">
								<p className="font-semibold text-sm">{t("tasks.sheet.details")}</p>

								<div className="flex items-center justify-between gap-2">
									<div className="flex items-center gap-1.5">
										<IconClockHour4 className="size-4 text-muted-foreground" />
										<span className="text-sm">
											{task?.deadline
												? formatDate(task.deadline, locale)
												: t("tasks.dates.today")}
										</span>
									</div>
									<div className="flex items-center gap-1.5">
										<Button
											size="xs"
											variant="outline"
											className="h-7 text-xs"
										>
											<IconCalendarEvent className="size-3" />
											{t("tasks.sheet.reschedule")}
										</Button>
										<Button
											size="xs"
											variant="outline"
											className="h-7 border-destructive text-destructive text-xs hover:bg-destructive/5 hover:text-destructive"
										>
											<IconCalendarX className="size-3" />
											{t("tasks.sheet.cancelTask")}
										</Button>
									</div>
								</div>

								{task && statusMeta && StatusIcon && (
									<div className="flex items-center gap-1.5">
										<Select
											dir={dir}
											value={task.status}
											onValueChange={handleStatusChange}
											disabled={isUpdatingStatus}
										>
											<SelectTrigger className="h-7 w-auto gap-1.5 border-0 bg-transparent p-0 shadow-none focus:ring-0">
												<div className={`flex items-center gap-1.5 ${statusMeta.className}`}>
													<StatusIcon className="size-4 shrink-0" />
													<span className="text-sm font-medium">
														{getTaskStatusLabel(t, task.status)}
													</span>
												</div>
											</SelectTrigger>
											<SelectContent
												position="popper"
												className="z-[100]"
											>
												{Object.entries(TASK_STATUS_META).map(([value, meta]) => {
													const Icon = meta.icon;
													return (
														<SelectItem
															key={value}
															value={value}
														>
															<div className={`flex items-center gap-1.5 ${meta.className}`}>
																<Icon className="size-4 shrink-0" />
																<span>{getTaskStatusLabel(t, value)}</span>
															</div>
														</SelectItem>
													);
												})}
											</SelectContent>
										</Select>
									</div>
								)}
							</div>

							{/* Assignees */}
							{assignees.length > 0 && (
								<div className="flex flex-col gap-3">
									<p className="font-semibold text-sm">{t("tasks.sheet.assignees")}</p>
									{assignees.map((assignee) => (
										<div
											key={assignee.id}
											className="flex flex-col gap-1.5"
										>
											<div className="flex items-center justify-between gap-2">
												<div className="flex items-center gap-1.5">
													<Initials name={assignee.name} />
													<span className="text-sm font-medium">{assignee.name}</span>
												</div>
												{assignee.phone && (
													<Button
														asChild
														size="xs"
														variant="outline"
														className="h-7 text-xs"
													>
														<a href={`sms:${assignee.phone}`}>
															<IconMessage className="size-3" />
															{t("tasks.sheet.sendMessage")}
														</a>
													</Button>
												)}
											</div>
											{assignee.phone && (
												<div className="flex items-center justify-between gap-2">
													<span
														className="text-sm tabular-nums"
														dir="ltr"
													>
														{assignee.phone}
													</span>
													<Button
														size="xs"
														variant="outline"
														className="h-7 text-xs"
														onClick={() => {
															if (!assignee.phone) return;
															void navigator.clipboard.writeText(assignee.phone);
															toast.success(t("tasks.toasts.copied"));
														}}
													>
														<IconCopy className="size-3" />
														{t("common.actions.copy")}
													</Button>
												</div>
											)}
										</div>
									))}
								</div>
							)}

							{/* Created at */}
							{task && (
								<div className="flex items-center justify-between gap-2">
									<span className="text-sm font-medium text-muted-foreground">
										{t("tasks.sheet.createdAt")}
									</span>
									<span
										className="text-sm tabular-nums"
										dir="ltr"
									>
										{formatDate(task.createdAt, locale)}
									</span>
								</div>
							)}
						</div>
					</div>
				</SheetContent>
			</Sheet>

			<TaskAcceptDialog
				card={card}
				open={acceptOpen}
				onClose={() => setAcceptOpen(false)}
				onSubmit={(data) => acceptTask(data)}
				isPending={isAccepting}
			/>

			<TaskDeclineDialog
				card={card}
				open={declineOpen}
				onClose={() => setDeclineOpen(false)}
				onSubmit={(data) => declineTask(data)}
				isPending={isDeclining}
			/>
		</>
	);
}
