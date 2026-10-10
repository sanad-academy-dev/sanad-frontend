import { zodResolver } from "@hookform/resolvers/zod";
import { IconChevronDown, IconChevronLeft, IconUsers, IconX } from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { ChatAvatar } from "@/features/messages/components/chat-avatar";
import { MemberPicker } from "@/features/messages/components/member-picker";
import { useChatDirectory } from "@/features/messages/hooks/use-messages";
import { useMessagesStore } from "@/features/messages/stores/messages.store";
import type { ChatMember, ConversationKind } from "@/features/messages/types/messages.type";
import {
	type NewConversationFormInput,
	newConversationSchema,
} from "@/features/messages/types/new-conversation.schema";
import { useFormProgress } from "@/hooks/use-form-progress";
import { cn } from "@/lib/utils";

const EMPTY_FORM: NewConversationFormInput = { recipientIds: [], body: "" };

export function NewConversationSheet({
	onCreate,
}: {
	onCreate: (kind: ConversationKind, members: ChatMember[], body: string) => void;
}) {
	const kind = useMessagesStore((s) => s.composerKind);
	const close = useMessagesStore((s) => s.closeComposer);
	const [pickerOpen, setPickerOpen] = useState(false);
	const open = kind !== null;
	const isGroup = kind === "group";

	const {
		control,
		handleSubmit,
		reset,
		watch,
		formState: { errors, isValid },
	} = useForm<NewConversationFormInput>({
		resolver: zodResolver(newConversationSchema),
		mode: "onChange",
		defaultValues: EMPTY_FORM,
	});

	const values = watch();
	const progress = useFormProgress({ schema: newConversationSchema, values });
	const { directory } = useChatDirectory();
	const selected = directory.filter((m) => values.recipientIds.includes(m.id));

	// كل فتح جديد يبدأ بنموذج نظيف
	useEffect(() => {
		if (open) reset(EMPTY_FORM);
	}, [open, reset]);

	const submit = handleSubmit((data) => {
		const members = directory.filter((m) => data.recipientIds.includes(m.id));
		onCreate(kind ?? "direct", members, data.body.trim());
		close();
	});

	useHotkey("Mod+Enter", () => isValid && void submit(), { enabled: open });

	return (
		<Sheet
			open={open}
			onOpenChange={(next) => !next && close()}
		>
			<SheetContent
				side="left"
				dir="rtl"
				showCloseButton={false}
				className="w-full gap-0 p-0 sm:max-w-xl!"
			>
				<FormHeader
					title="الرسائل"
					titleActions={
						<span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
							<IconChevronLeft className="size-4" />
							محادثة جديدة
						</span>
					}
					onClose={close}
				/>

				{/* شريط اكتمال الحقول المطلوبة */}
				<div className="shrink-0 px-4 pt-1.5 pb-2">
					<div className="flex items-center justify-between gap-2">
						<span className="text-[12px] text-muted-foreground">
							{progress.isComplete
								? "جميع الحقول المطلوبة مكتملة — جاهز للإرسال"
								: `${progress.filledCount} من ${progress.requiredCount} حقول مطلوبة`}
						</span>
						<span className="text-[12px] font-medium text-foreground tabular-nums">
							{progress.progress}%
						</span>
					</div>
					<div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-muted">
						<div
							className={cn(
								"h-full rounded-full transition-all",
								progress.isComplete ? "bg-green-500" : "bg-primary",
							)}
							style={{ width: `${progress.progress}%` }}
						/>
					</div>
				</div>

				<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-3">
					{/* المستلم */}
					<Controller
						name="recipientIds"
						control={control}
						render={({ field }) => (
							<Field data-invalid={!!errors.recipientIds}>
								<Label className="gap-1.5">
									{isGroup ? "المستلمون" : "المستلم"}
									<RequiredBadge />
								</Label>

								<Popover
									open={pickerOpen}
									onOpenChange={setPickerOpen}
								>
									<PopoverTrigger asChild>
										<Button
											type="button"
											variant="outline"
											className="h-9 w-full justify-between gap-2 font-normal"
										>
											<span className="flex min-w-0 items-center gap-1.5">
												{selected.length === 0 ? (
													<span className="text-muted-foreground">اختر ...</span>
												) : isGroup ? (
													<>
														<IconUsers className="size-4 text-muted-foreground" />
														<span className="truncate">
															{selected.map((m) => m.name).join("، ")}
														</span>
													</>
												) : (
													<>
														<ChatAvatar
															name={selected[0].name}
															size={20}
														/>
														<span className="truncate">{selected[0].name}</span>
													</>
												)}
											</span>
											<IconChevronDown className="size-4 shrink-0 text-muted-foreground" />
										</Button>
									</PopoverTrigger>
									<PopoverContent
										align="start"
										dir="rtl"
										className="w-[262px] p-0"
									>
										<MemberPicker
											multiple={isGroup}
											selectedIds={field.value}
											onToggle={(member) => {
												if (!isGroup) {
													field.onChange([member.id]);
													setPickerOpen(false);
													return;
												}
												field.onChange(
													field.value.includes(member.id)
														? field.value.filter((id) => id !== member.id)
														: [...field.value, member.id],
												);
											}}
										/>
									</PopoverContent>
								</Popover>

								{/* المستلمون المختارون كشرائح قابلة للإزالة */}
								{isGroup && selected.length > 0 && (
									<div className="flex flex-wrap gap-1.5 pt-1">
										{selected.map((member) => (
											<span
												key={member.id}
												className="flex items-center gap-1 rounded-[4px] border px-1.5 py-0.5 text-[12px]"
											>
												{member.name}
												<button
													type="button"
													aria-label={`إزالة ${member.name}`}
													className="text-muted-foreground hover:text-destructive"
													onClick={() =>
														field.onChange(field.value.filter((id) => id !== member.id))
													}
												>
													<IconX className="size-3" />
												</button>
											</span>
										))}
									</div>
								)}

								<FieldError errors={[errors.recipientIds]} />
							</Field>
						)}
					/>

					{/* نص الرسالة */}
					<Controller
						name="body"
						control={control}
						render={({ field }) => (
							<Field data-invalid={!!errors.body}>
								<Label className="gap-1.5">
									نص الرسالة
									<RequiredBadge />
								</Label>
								<Textarea
									{...field}
									rows={5}
									placeholder="اكتب رسالتك الأولى..."
									aria-invalid={!!errors.body}
								/>
								<FieldError errors={[errors.body]} />
							</Field>
						)}
					/>
				</div>

				<FormFooter showShortcut={false}>
					<Button
						type="button"
						variant="outline"
						onClick={close}
					>
						إلغاء
					</Button>
					<Button
						type="button"
						disabled={!isValid}
						className="gap-2"
						onClick={() => void submit()}
					>
						<span>إرسال</span>
						<Kbd>⌘↵</Kbd>
					</Button>
				</FormFooter>
			</SheetContent>
		</Sheet>
	);
}

function RequiredBadge() {
	return (
		<span className="rounded-[4px] bg-destructive/10 px-1.5 py-0.5 text-[10px] font-medium text-destructive">
			مطلوب
		</span>
	);
}
