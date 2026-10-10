import { zodResolver } from "@hookform/resolvers/zod";
import { IconCalendar, IconPaperclip, IconPlus, IconX } from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { arSA, enUS } from "date-fns/locale";
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { DisabledReasonTooltip } from "@/components/common/disabled-reason-tooltip";
import { FieldLabel } from "@/components/common/field-label";
import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxTrigger,
	ComboboxValue,
} from "@/components/ui/combobox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldError } from "@/components/ui/field";
import {
	FileUpload,
	FileUploadItem,
	FileUploadItemDelete,
	FileUploadItemPreview,
	FileUploadList,
	FileUploadTrigger,
} from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useClinicUsers } from "@/features/dashboard/hooks/use-clinic-users";
import { DiscardTaskModal } from "@/features/tasks/components/discard-task-modal";
import {
	ADD_TASK_FORM_DEFAULTS,
	getTaskPriorityOptions,
	getTaskStatusOptions,
	getTaskTypeOptions,
} from "@/features/tasks/data/add-task-modal";
import { useAddTask } from "@/features/tasks/hooks/use-add-task";
import { useTaskSettings } from "@/features/tasks/hooks/use-task-settings";
import { useTaskDraftStore } from "@/features/tasks/stores/task-draft.store";
import type { SelectOption } from "@/features/tasks/types/add-task-modal.types";
import {
	type AddTaskFormInput,
	type AddTaskFormValues,
	getAddTaskSchema,
} from "@/features/tasks/types/form.types";
import { getDeadlineDate, getPresetDeadlineDate } from "@/features/tasks/utils/add-task-modal";
import { formatFileSize, trimFileName } from "@/features/tasks/utils/file";
import type { TaskPriority, TaskStatus, TaskType } from "@/generated/prisma/enums";
import { useFormProgress } from "@/hooks/use-form-progress";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

const DRAFT_DEBOUNCE_MS = 500;

/** حقول الشبكة تلتزم ارتفاع الإدخال الموحّد (h-10) كي تستوي الصفوف */
const TRIGGER_CLASS =
	"flex h-10 w-full items-center justify-between rounded-[4px] border border-input bg-transparent px-3 py-2 text-sm";

export function AddTaskModal({ trigger }: { trigger?: ReactNode }) {
	const { t, lang, isRtl } = useI18n();
	const [open, setOpen] = useState(false);
	const [discardOpen, setDiscardOpen] = useState(false);
	const [showDraftBanner, setShowDraftBanner] = useState(false);
	const [deadlineMenuOpen, setDeadlineMenuOpen] = useState(false);
	const { users, isLoading: isLoadingUsers } = useClinicUsers();
	const { addTask, isPending } = useAddTask();
	const draft = useTaskDraftStore();
	const dir = isRtl ? "rtl" : "ltr";
	const textAlignClass = "text-start";
	const calendarLocale = lang === "ar" ? arSA : enUS;
	const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const taskTypeOptions: SelectOption<TaskType>[] = getTaskTypeOptions(t);
	const { settings: taskSettings } = useTaskSettings(t);
	// الطابور مرحلة نظامية يُسندها الخادم — لا تُتاح كخيار يدوي عند الإنشاء
	const taskStatusOptions: SelectOption<TaskStatus>[] = getTaskStatusOptions(t).filter(
		(o) => o.value !== "QUEUE",
	);
	const taskPriorityOptions: SelectOption<TaskPriority>[] = getTaskPriorityOptions(t);
	const addTaskSchema = useMemo(
		() =>
			getAddTaskSchema({
				titleRequired: t("tasks.validation.titleRequired"),
				typeRequired: t("tasks.validation.typeRequired"),
				statusRequired: t("tasks.validation.statusRequired"),
				priorityRequired: t("tasks.validation.priorityRequired"),
				invalidDate: t("tasks.validation.invalidDate"),
			}),
		[t],
	);

	const form = useForm<AddTaskFormInput, unknown, AddTaskFormValues>({
		resolver: zodResolver(addTaskSchema),
		mode: "onChange",
		defaultValues: ADD_TASK_FORM_DEFAULTS,
	});

	const values = form.watch();
	const formProgress = useFormProgress({ schema: addTaskSchema, values });

	const taskType = form.watch("type");
	const taskStatus = form.watch("status");
	const taskPriority = form.watch("priority");
	const assigneeIds = form.watch("assigneeIds") as string[];
	const deadline = form.watch("deadline") as AddTaskFormValues["deadline"];
	const images = (form.watch("images") as File[] | undefined) ?? [];
	const createMultiple = form.watch("createMultiple") ?? false;

	const selectedTaskType = taskTypeOptions.find((o) => o.value === taskType);
	const selectedTaskStatus = taskStatusOptions.find((o) => o.value === taskStatus);
	const selectedTaskPriority = taskPriorityOptions.find((o) => o.value === taskPriority);
	const selectedUsers = users?.filter((u) => assigneeIds?.includes(u.id)) ?? [];
	const formattedDeadline = deadline
		? new Intl.DateTimeFormat(lang === "ar" ? "ar-SA" : "en-US", {
				day: "numeric",
				month: "long",
				year: "numeric",
			}).format(deadline)
		: undefined;

	// الحقول الناقصة تُذكر صراحة بدل ترك زر الإنشاء معطّلًا بلا سبب ظاهر
	const missingFieldLabels = [
		!values.title && t("dashboard.addTaskModal.fields.titleLabel"),
		!taskType && t("dashboard.addTaskModal.fields.typeLabel"),
		!taskPriority && t("dashboard.addTaskModal.fields.priorityLabel"),
	].filter((label): label is string => !!label);

	const isSubmitDisabled = isPending || !form.formState.isValid;

	// سبب تعطيل زر الإنشاء — يظهر كتلميح عند محاولة الضغط عليه فقط
	const missingFieldsReason = missingFieldLabels.length
		? t("dashboard.addTaskModal.missingFields", { fields: missingFieldLabels.join("، ") })
		: null;

	// Restore draft on modal open — only runs when `open` transitions to true,
	// not on every draft store update (which would show the banner mid-session).
	useEffect(() => {
		if (!open) return;
		if (!draft.hasDraft()) return;
		form.reset({
			title: draft.title || "",
			content: draft.content || "",
			type: (draft.type as TaskType | undefined) ?? undefined,
			status: (draft.status as TaskStatus | undefined) ?? undefined,
			priority: (draft.priority as TaskPriority | undefined) ?? undefined,
			assigneeIds: draft.assigneeIds ?? [],
			deadline: draft.deadline ? new Date(draft.deadline) : undefined,
			emailNotification: draft.emailNotification,
			images: [],
			createMultiple: false,
		});
		setShowDraftBanner(true);
	}, [
		open,
		form.reset,
		draft.type,
		draft.priority,
		draft.title,
		draft.hasDraft,
		draft.content,
		draft.status,
		draft.emailNotification,
		draft.deadline,
		draft.assigneeIds,
	]); // eslint-disable-line react-hooks/exhaustive-deps

	// Debounced draft save on form change
	const saveDraft = useCallback(() => {
		const values = form.getValues();
		draft.setFields({
			title: values.title ?? "",
			content: values.content ?? "",
			type: values.type ?? undefined,
			status: values.status ?? undefined,
			priority: values.priority ?? undefined,
			assigneeIds: (values.assigneeIds as string[] | undefined) ?? [],
			deadline: (values.deadline as Date | undefined)?.toISOString() ?? undefined,
			emailNotification: values.emailNotification ?? false,
		});
	}, [form, draft]);

	useEffect(() => {
		if (!open) return;
		const subscription = form.watch(() => {
			if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
			draftTimerRef.current = setTimeout(saveDraft, DRAFT_DEBOUNCE_MS);
		});
		return () => {
			subscription.unsubscribe();
			if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
		};
	}, [open, form, saveDraft]);

	const getFilledFields = (): string[] => {
		const values = form.getValues();
		const filled: string[] = [];
		if (values.title) filled.push("title");
		if (values.content) filled.push("content");
		if (values.type) filled.push("type");
		if (values.deadline) filled.push("deadline");
		if ((values.images as File[])?.length > 0) filled.push("images");
		if (values.priority) filled.push("priority");
		if ((values.assigneeIds as string[] | undefined)?.length) filled.push("assigneeIds");
		return filled;
	};

	const handleOpenChange = (value: boolean) => {
		if (!value && form.formState.isDirty) {
			setDiscardOpen(true);
			return;
		}
		if (!value) {
			form.reset(ADD_TASK_FORM_DEFAULTS);
			setShowDraftBanner(false);
		}
		setOpen(value);
	};

	const handleDiscard = () => {
		draft.reset();
		form.reset(ADD_TASK_FORM_DEFAULTS);
		setDiscardOpen(false);
		setShowDraftBanner(false);
		setOpen(false);
	};

	const handleContinue = () => {
		setDiscardOpen(false);
	};

	const onSubmit = async (data: AddTaskFormValues) => {
		await addTask(data);
		draft.reset();

		if (data.createMultiple) {
			form.reset(ADD_TASK_FORM_DEFAULTS);
			setDeadlineMenuOpen(false);
			setShowDraftBanner(false);
		} else {
			setOpen(false);
		}
	};

	const submitForm = form.handleSubmit(onSubmit);

	useHotkey(
		"Mod+Enter",
		() => {
			if (isSubmitDisabled) return;
			void submitForm();
		},
		{ enabled: open },
	);

	return (
		<>
			<Dialog
				open={open}
				onOpenChange={handleOpenChange}
			>
				<DialogTrigger asChild>
					{trigger ?? (
						<Button>
							<IconPlus className="size-4" />
							<span>{t("dashboard.addTaskModal.trigger")}</span>
						</Button>
					)}
				</DialogTrigger>

				<DialogContent
					dir={dir}
					showCloseButton={false}
					className={cn("max-w-4xl! gap-0 p-0")}
				>
					<FormHeader
						variant="dialog"
						title={t("dashboard.addTaskModal.title")}
						progress={formProgress}
						onClose={() => handleOpenChange(false)}
						actions={
							/* الأولوية تُحسم من الرأس — تلوّن المهمة كلها فلا تُدفن بين الحقول */
							<Controller
								control={form.control}
								name="priority"
								render={({ field }) => (
									<Select
										value={field.value ?? ""}
										onValueChange={(v) => field.onChange(v || undefined)}
										disabled={isPending}
									>
										<SelectTrigger
											dir={dir}
											className="h-8 w-auto gap-1.5 px-3"
											aria-label={t("dashboard.addTaskModal.fields.priorityLabel")}
										>
											{selectedTaskPriority ? (
												<div className="flex items-center gap-1.5">
													<selectedTaskPriority.icon
														className={cn("size-4", selectedTaskPriority.iconClassName)}
													/>
													<span className="truncate">{selectedTaskPriority.label}</span>
												</div>
											) : (
												<SelectValue
													placeholder={t("dashboard.addTaskModal.fields.priorityPlaceholder")}
												/>
											)}
										</SelectTrigger>
										<SelectContent
											dir={dir}
											position="popper"
										>
											<SelectGroup>
												{taskPriorityOptions.map(
													({ value, label, icon: Icon, iconClassName }) => (
														<SelectItem
															key={value}
															value={value}
															textValue={label}
														>
															<Icon className={cn("size-4 shrink-0", iconClassName)} />
															<span className="font-medium leading-none">{label}</span>
														</SelectItem>
													),
												)}
											</SelectGroup>
										</SelectContent>
									</Select>
								)}
							/>
						}
					/>

					{showDraftBanner && (
						<div className="flex items-center justify-between gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2">
							<span className="text-sm text-amber-800">
								{t("tasks.addTaskModal.draftRestored")}
							</span>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="text-amber-700 hover:bg-amber-100 hover:text-amber-900"
								onClick={() => {
									draft.reset();
									form.reset(ADD_TASK_FORM_DEFAULTS);
									setShowDraftBanner(false);
								}}
							>
								{t("tasks.addTaskModal.discardDraft")}
							</Button>
						</div>
					)}

					<form
						dir={dir}
						className={textAlignClass}
						onSubmit={submitForm}
					>
						<Controller
							control={form.control}
							name="images"
							render={({ field }) => (
								<FileUpload
									dir={dir}
									className="gap-0"
									value={field.value ?? []}
									onValueChange={field.onChange}
									accept="image/*"
									maxFiles={5}
									maxSize={4 * 1024 * 1024}
									multiple
									disabled={isPending}
									onFileReject={(file, message) => {
										toast(message, { description: file.name });
									}}
								>
									<div className="space-y-4 p-4">
										<div className="grid grid-cols-2 gap-3">
											<Field data-invalid={!!form.formState.errors.title}>
												<FieldLabel required>
													<Label htmlFor="task-title">
														{t("dashboard.addTaskModal.fields.titleLabel")}
													</Label>
												</FieldLabel>
												<Input
													id="task-title"
													autoFocus
													disabled={isPending}
													aria-invalid={!!form.formState.errors.title}
													placeholder={t("dashboard.addTaskModal.fields.titlePlaceholder")}
													{...form.register("title")}
												/>
												<FieldError errors={[form.formState.errors.title]} />
											</Field>

											<Field data-invalid={!!form.formState.errors.type}>
												<FieldLabel required>
													<Label>{t("dashboard.addTaskModal.fields.typeLabel")}</Label>
												</FieldLabel>
												<Controller
													control={form.control}
													name="type"
													render={({ field: f }) => (
														<Select
															value={f.value ?? ""}
															onValueChange={(v) => f.onChange(v || undefined)}
															disabled={isPending}
														>
															<SelectTrigger
																dir={dir}
																className={cn("h-10 w-full px-3", textAlignClass)}
															>
																{selectedTaskType ? (
																	<div className="flex min-w-0 flex-1 items-center gap-2">
																		<selectedTaskType.icon className="size-4 shrink-0" />
																		<span className="truncate">{selectedTaskType.label}</span>
																	</div>
																) : (
																	<SelectValue
																		placeholder={t(
																			"dashboard.addTaskModal.fields.typePlaceholder",
																		)}
																	/>
																)}
															</SelectTrigger>
															<SelectContent
																dir={dir}
																position="popper"
																className="w-(--radix-select-trigger-width)"
															>
																<SelectGroup>
																	{taskTypeOptions.map(({ value, label, icon: Icon }) => (
																		<SelectItem
																			key={value}
																			value={value}
																			textValue={label}
																		>
																			<Icon className="size-4 shrink-0" />
																			<span className="font-medium leading-none">{label}</span>
																		</SelectItem>
																	))}
																</SelectGroup>
															</SelectContent>
														</Select>
													)}
												/>
												<FieldError errors={[form.formState.errors.type]} />
											</Field>
										</div>

										<div className="grid grid-cols-2 gap-3">
											<Field>
												<FieldLabel>
													<Label>{t("dashboard.addTaskModal.fields.assigneeLabel")}</Label>
												</FieldLabel>
												<Controller
													control={form.control}
													name="assigneeIds"
													render={({ field: f }) => {
														const ids = (f.value as string[]) ?? [];
														return (
															<Combobox
																multiple
																value={ids}
																onValueChange={(v) =>
																	f.onChange(Array.isArray(v) ? v : v ? [v] : [])
																}
															>
																<ComboboxTrigger
																	className={cn(TRIGGER_CLASS, textAlignClass)}
																	disabled={isLoadingUsers || isPending}
																>
																	<ComboboxValue
																		placeholder={t(
																			"dashboard.addTaskModal.fields.assigneePlaceholder",
																		)}
																		className="truncate"
																	>
																		{selectedUsers.length > 0
																			? selectedUsers.map((u) => u.name).join("، ")
																			: undefined}
																	</ComboboxValue>
																</ComboboxTrigger>
																<ComboboxContent dir={dir}>
																	<ComboboxList>
																		{users?.length === 0 ? (
																			<ComboboxEmpty>
																				{t("tasks.declineDialog.noUsers")}
																			</ComboboxEmpty>
																		) : (
																			users?.map((user) => (
																				<ComboboxItem
																					key={user.id}
																					value={user.id}
																				>
																					<Avatar className="size-5">
																						<AvatarFallback className="text-[10px]">
																							{user.name.charAt(0)}
																						</AvatarFallback>
																					</Avatar>
																					<span className="truncate">{user.name}</span>
																				</ComboboxItem>
																			))
																		)}
																	</ComboboxList>
																</ComboboxContent>
															</Combobox>
														);
													}}
												/>
											</Field>

											<Field>
												<FieldLabel>
													<Label>{t("dashboard.addTaskModal.fields.deadlineLabel")}</Label>
												</FieldLabel>
												<Controller
													control={form.control}
													name="deadline"
													render={({ field: f }) => {
														const selectedDeadline = f.value as Date | undefined;
														return (
															<DropdownMenu
																open={deadlineMenuOpen}
																onOpenChange={setDeadlineMenuOpen}
																dir={dir}
															>
																<DropdownMenuTrigger asChild>
																	<Button
																		type="button"
																		variant="outline"
																		disabled={isPending}
																		className={cn(
																			"h-10 w-full justify-start px-3 font-normal",
																			!formattedDeadline && "text-muted-foreground",
																			textAlignClass,
																		)}
																	>
																		<IconCalendar className="size-4 shrink-0" />
																		<span className="truncate">
																			{formattedDeadline ??
																				t(
																					"dashboard.addTaskModal.fields.deadlineCalendarPlaceholder",
																				)}
																		</span>
																	</Button>
																</DropdownMenuTrigger>

																<DropdownMenuContent
																	align={isRtl ? "end" : "start"}
																	className="w-auto min-w-[320px] p-2"
																>
																	<div dir={dir}>
																		<DropdownMenuLabel className={textAlignClass}>
																			{t(
																				"dashboard.addTaskModal.fields.deadlinePresetPlaceholder",
																			)}
																		</DropdownMenuLabel>
																		<DropdownMenuItem
																			onSelect={() => {
																				setDeadlineMenuOpen(false);
																				f.onChange(getPresetDeadlineDate("today"));
																			}}
																		>
																			{t(
																				"dashboard.addTaskModal.fields.deadlinePresets.today",
																			)}
																		</DropdownMenuItem>
																		<DropdownMenuItem
																			onSelect={() => {
																				setDeadlineMenuOpen(false);
																				f.onChange(getPresetDeadlineDate("tomorrow"));
																			}}
																		>
																			{t(
																				"dashboard.addTaskModal.fields.deadlinePresets.tomorrow",
																			)}
																		</DropdownMenuItem>
																		<DropdownMenuItem
																			onSelect={() => {
																				setDeadlineMenuOpen(false);
																				f.onChange(getPresetDeadlineDate("afterWeek"));
																			}}
																		>
																			{t(
																				"dashboard.addTaskModal.fields.deadlinePresets.afterWeek",
																			)}
																		</DropdownMenuItem>
																		<DropdownMenuSub>
																			<DropdownMenuSubTrigger>
																				<span className="truncate">
																					{formattedDeadline ??
																						t(
																							"dashboard.addTaskModal.fields.deadlineCalendarPlaceholder",
																						)}
																				</span>
																				<IconCalendar className="size-4 shrink-0" />
																			</DropdownMenuSubTrigger>
																			<DropdownMenuSubContent
																				className="w-auto"
																				onPointerDown={(e) => e.stopPropagation()}
																				onKeyDown={(e) => e.stopPropagation()}
																			>
																				<div
																					dir={dir}
																					className="px-1 py-1"
																				>
																					<Calendar
																						mode="single"
																						selected={selectedDeadline}
																						onSelect={(date) => {
																							setDeadlineMenuOpen(false);
																							f.onChange(
																								date ? getDeadlineDate(date) : undefined,
																							);
																						}}
																						locale={calendarLocale}
																					/>
																				</div>
																				<Button
																					type="button"
																					variant="ghost"
																					className="w-full"
																					onClick={() => {
																						setDeadlineMenuOpen(false);
																						f.onChange(undefined);
																					}}
																				>
																					{t("dashboard.addTaskModal.fields.deadlineReset")}
																				</Button>
																			</DropdownMenuSubContent>
																		</DropdownMenuSub>
																	</div>
																</DropdownMenuContent>
															</DropdownMenu>
														);
													}}
												/>
											</Field>
										</div>

										<Field>
											<FieldLabel>
												<Label htmlFor="task-content">
													{t("dashboard.addTaskModal.fields.descriptionLabel")}
												</Label>
											</FieldLabel>
											<Textarea
												id="task-content"
												disabled={isPending}
												className="min-h-24"
												placeholder={t("dashboard.addTaskModal.fields.descriptionPlaceholder")}
												{...form.register("content")}
											/>
										</Field>
									</div>

									<Separator />

									{/* شريط التفاصيل — الحالة والمرفقات: خيارات ثانوية لا تستحق حقلًا كامل العرض */}
									<div className="flex flex-wrap gap-1 p-3.5">
										<Controller
											control={form.control}
											name="status"
											render={({ field: f }) => (
												<Select
													value={f.value ?? ""}
													onValueChange={(v) => f.onChange(v || undefined)}
													disabled={taskSettings.enabled || isPending}
												>
													<SelectTrigger
														dir={dir}
														disabled={taskSettings.enabled || isPending}
														className="h-9 w-auto gap-2 px-3"
														aria-label={t("dashboard.addTaskModal.fields.statusLabel")}
													>
														{selectedTaskStatus ? (
															<div className="flex items-center gap-2">
																<selectedTaskStatus.icon
																	className={cn("size-4", selectedTaskStatus.iconClassName)}
																/>
																<span className="truncate">{selectedTaskStatus.label}</span>
															</div>
														) : (
															<SelectValue
																placeholder={t(
																	"dashboard.addTaskModal.fields.statusPlaceholder",
																)}
															/>
														)}
													</SelectTrigger>
													<SelectContent
														dir={dir}
														position="popper"
														className="w-48"
													>
														<SelectGroup>
															{taskStatusOptions.map(
																({ value, label, priority, icon: Icon, iconClassName }) => (
																	<SelectItem
																		key={value}
																		value={value}
																		textValue={label}
																	>
																		<Icon className={cn("size-4 shrink-0", iconClassName)} />
																		<span className="min-w-0 flex-1 truncate font-medium leading-none">
																			{label}
																		</span>
																		<span className="ms-auto shrink-0 text-xs text-muted-foreground">
																			{priority}
																		</span>
																	</SelectItem>
																),
															)}
														</SelectGroup>
													</SelectContent>
												</Select>
											)}
										/>

										<FileUploadTrigger asChild>
											{/* h-10 لا h-9 — SelectTrigger يفرض 40px عبر data-[size=default] فيلزم التساوي */}
											<Button
												type="button"
												variant="outline"
												disabled={isPending}
												className="h-10 w-auto gap-2 px-3 font-normal"
											>
												<IconPaperclip className="size-4" />
												<span>{t("dashboard.addTaskModal.actions.attachFiles")}</span>
											</Button>
										</FileUploadTrigger>
									</div>

									{/* شريط ملخّص المرفقات — يوازي ملخّص التحاليل في طلب التحليل */}
									{images.length > 0 && (
										<div className="flex items-center justify-between gap-3 border-t bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
											<FileUploadList className="flex-row flex-wrap items-center gap-3 p-0">
												{field.value?.map((file) => (
													<FileUploadItem
														key={`${file.name}-${file.lastModified}`}
														value={file}
														className="w-auto gap-2 border-0 p-0"
													>
														<FileUploadItemPreview className="size-6 rounded-[4px]" />
														<span
															className="max-w-40 truncate font-medium text-foreground"
															dir="ltr"
															title={file.name}
														>
															{trimFileName(file.name)}
														</span>
														<span dir="ltr">{formatFileSize(file.size)}</span>
														<FileUploadItemDelete asChild>
															<Button
																variant="ghost"
																size="icon-xs"
																aria-label={t(
																	"dashboard.addTaskModal.actions.removeAttachment",
																)}
															>
																<IconX className="size-3" />
															</Button>
														</FileUploadItemDelete>
													</FileUploadItem>
												))}
											</FileUploadList>
											<span className="shrink-0">
												{t("dashboard.addTaskModal.fields.attachmentsTotal", {
													files: images.length,
													size: formatFileSize(
														images.reduce((sum, file) => sum + file.size, 0),
													),
												})}
											</span>
										</div>
									)}

									<Separator />

									<FormFooter
										continueAdding={createMultiple}
										onContinueAddingChange={(value) => form.setValue("createMultiple", value)}
										disabled={isPending}
										extra={
											<Controller
												control={form.control}
												name="emailNotification"
												render={({ field: f }) => (
													<Label className="flex cursor-pointer items-center gap-2 font-normal text-muted-foreground">
														<Checkbox
															checked={f.value}
															onCheckedChange={(v) => f.onChange(v === true)}
															disabled={isPending}
														/>
														{t("dashboard.addTaskModal.fields.emailNotification")}
													</Label>
												)}
											/>
										}
									>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											disabled={isPending}
											onClick={() => form.reset(ADD_TASK_FORM_DEFAULTS)}
										>
											{t("dashboard.addTaskModal.actions.reset")}
										</Button>
										<DisabledReasonTooltip reason={missingFieldsReason}>
											<Button
												type="submit"
												size="sm"
												disabled={isSubmitDisabled}
											>
												{t("dashboard.addTaskModal.submit")}
											</Button>
										</DisabledReasonTooltip>
									</FormFooter>
								</FileUpload>
							)}
						/>
					</form>
				</DialogContent>
			</Dialog>

			<DiscardTaskModal
				open={discardOpen}
				filledFields={getFilledFields()}
				onDiscard={handleDiscard}
				onContinue={handleContinue}
			/>
		</>
	);
}
