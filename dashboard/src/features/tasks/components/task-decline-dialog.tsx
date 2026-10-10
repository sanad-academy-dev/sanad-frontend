import { zodResolver } from "@hookform/resolvers/zod";
import { IconChevronLeft } from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { Controller, useForm } from "react-hook-form";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/combobox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useClinicUsers } from "@/features/dashboard/hooks/use-clinic-users";
import type { TaskCardData } from "@/features/tasks/types/task.types";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import { type DeclineTaskFormInput, declineTaskSchema } from "@sanad/contracts/runtime/server/tasks/tasks.type";

export type TaskDeclineDialogProps = {
	card: TaskCardData | null;
	open: boolean;
	onClose: () => void;
	onSubmit: (data: DeclineTaskFormInput) => void;
	isPending: boolean;
};

export function TaskDeclineDialog({
	card,
	open,
	onClose,
	onSubmit,
	isPending,
}: TaskDeclineDialogProps) {
	const { t, isRtl } = useI18n();
	const dir = isRtl ? "rtl" : "ltr";
	const { users } = useClinicUsers();

	const form = useForm<DeclineTaskFormInput>({
		resolver: zodResolver(declineTaskSchema),
		defaultValues: { comment: "", reason: "", assigneeIds: [] },
	});

	const assigneeIds = form.watch("assigneeIds") ?? [];
	const selectedUsers = users.filter((u) => assigneeIds.includes(u.id));

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
						<span>{t("tasks.declineDialog.title")}</span>
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
						name="assigneeIds"
						render={({ field }) => {
							const ids = (field.value as string[]) ?? [];
							return (
								<Combobox
									multiple
									value={ids}
									onValueChange={(v) => field.onChange(v ?? [])}
								>
									<ComboboxChips className="min-h-8 px-2 py-1 gap-1 flex-1">
										{selectedUsers.map((user) => (
											<ComboboxChip
												key={user.id}
												value={user.id}
												className="text-xs"
											>
												<Avatar className="size-4">
													<AvatarFallback className="text-[9px]">
														{user.name.charAt(0)}
													</AvatarFallback>
												</Avatar>
												{user.name}
											</ComboboxChip>
										))}
										<ComboboxChipsInput
											placeholder={ids.length === 0 ? t("tasks.declineDialog.assignTo") : ""}
											className="text-xs"
										/>
									</ComboboxChips>
									<ComboboxContent>
										<ComboboxList>
											{users.length === 0 && (
												<ComboboxEmpty>{t("tasks.declineDialog.noUsers")}</ComboboxEmpty>
											)}
											{users.map((user) => (
												<ComboboxItem
													key={user.id}
													value={user.id}
												>
													<Avatar className="size-5">
														<AvatarFallback className="text-[10px]">
															{user.name.charAt(0)}
														</AvatarFallback>
													</Avatar>
													{user.name}
												</ComboboxItem>
											))}
										</ComboboxList>
									</ComboboxContent>
								</Combobox>
							);
						}}
					/>

					<Input
						placeholder={t("tasks.declineDialog.noReason")}
						className="h-8 flex-1 text-xs"
						disabled={isPending}
						{...form.register("reason")}
					/>
				</div>

				<Separator />

				<div className="flex items-center justify-between p-3">
					<p className="text-xs text-muted-foreground">{t("tasks.declineDialog.helper")}</p>
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2 opacity-50">
							<Switch
								id="decline-email-notification"
								disabled
							/>
							<Label
								htmlFor="decline-email-notification"
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
							{t("tasks.declineDialog.submit")}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
