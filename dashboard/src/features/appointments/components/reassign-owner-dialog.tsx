import { zodResolver } from "@hookform/resolvers/zod";
import {
	IconChevronLeft,
	IconPaw,
	IconSparkles,
	IconUserPlus,
	IconX,
} from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxTrigger,
	ComboboxValue,
} from "@/components/ui/combobox";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useReassignOwner } from "@/features/appointments/hooks/use-reassign-owner";
import { useOwners } from "@/features/services/patients/hooks/use-owners";
import { useI18n } from "@/hooks/use-i18n";
import {
	type ReassignOwnerFormInput,
	type ReassignOwnerFormValues,
	reassignOwnerSchema,
} from "@sanad/contracts/runtime/server/appointments/appointments.type";

interface ReassignOwnerDialogProps {
	appointmentId: string;
	appointmentCode: string;
	patientName: string;
	currentOwnerId: string;
	trigger: ReactNode;
}

export function ReassignOwnerDialog({
	appointmentId,
	appointmentCode,
	patientName,
	currentOwnerId,
	trigger,
}: ReassignOwnerDialogProps) {
	const { isRtl } = useI18n();
	const dir = isRtl ? "rtl" : "ltr";

	const { reassignOwner, isPending } = useReassignOwner(appointmentId);
	const { owners, isLoading: ownersLoading } = useOwners();

	const [open, setOpen] = useState(false);
	const [ownerPopoverOpen, setOwnerPopoverOpen] = useState(false);

	const defaults = useMemo<ReassignOwnerFormInput>(() => ({ ownerId: "", comment: "" }), []);

	const form = useForm<ReassignOwnerFormInput, unknown, ReassignOwnerFormValues>({
		resolver: zodResolver(reassignOwnerSchema),
		mode: "onChange",
		defaultValues: defaults,
	});

	useEffect(() => {
		if (open) form.reset(defaults);
	}, [open, defaults, form]);

	const ownerId = form.watch("ownerId");
	const selectableOwners = useMemo(
		() => owners.filter((o) => o.id !== currentOwnerId),
		[owners, currentOwnerId],
	);
	const selectedOwner = selectableOwners.find((o) => o.id === ownerId);

	const hasChange = !!ownerId && ownerId !== currentOwnerId;

	const onSubmit = async (data: ReassignOwnerFormValues) => {
		await reassignOwner({ ownerId: data.ownerId, comment: data.comment });
		setOpen(false);
		form.reset(defaults);
	};

	const submitForm = form.handleSubmit(onSubmit);
	const isSubmitDisabled = isPending || !form.formState.isValid || !hasChange;

	useHotkey(
		"Mod+Enter",
		() => {
			if (isSubmitDisabled) return;
			void submitForm();
		},
		{ enabled: open },
	);

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogTrigger asChild>{trigger}</DialogTrigger>

			<DialogContent
				dir={dir}
				className="p-0 gap-0 max-w-2xl!"
				showCloseButton={false}
			>
				<DialogHeader className="border-b p-4 flex flex-row items-center justify-between gap-3">
					<DialogTitle className="text-base flex items-center gap-2">
						<span>إحالة للطفل</span>
						<IconChevronLeft className="size-4" />
						<IconPaw className="size-4 text-muted-foreground" />
						<span>{patientName}</span>
						<IconSparkles className="size-4 text-amber-500" />
						<span className="text-xs font-normal text-muted-foreground tabular-nums">
							{appointmentCode}
						</span>
					</DialogTitle>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="size-8"
						onClick={() => setOpen(false)}
						aria-label="إغلاق"
					>
						<IconX className="size-4" />
					</Button>
				</DialogHeader>

				<form
					dir={dir}
					onSubmit={submitForm}
				>
					<div className="p-4">
						<Field data-invalid={!!form.formState.errors.comment}>
							<Label className="text-sm text-muted-foreground">اضف سبب الإحالة</Label>
							<Textarea
								className="min-h-24"
								placeholder="سبب الإحالة..."
								disabled={isPending}
								{...form.register("comment")}
							/>
							<FieldError errors={[form.formState.errors.comment]} />
						</Field>
					</div>

					<Separator />

					<div className="flex flex-wrap items-center justify-between gap-2 p-3.5">
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="h-9"
							onClick={() => setOpen(false)}
							disabled={isPending}
						>
							رفض
						</Button>

						<div className="flex items-center gap-3">
							<Popover
								open={ownerPopoverOpen}
								onOpenChange={setOwnerPopoverOpen}
							>
								<PopoverTrigger asChild>
									<Button
										type="button"
										variant="outline"
										size="sm"
										className="h-9 gap-2"
									>
										<IconUserPlus className="size-4" />
										{selectedOwner ? (
											<span className="truncate">{selectedOwner.name}</span>
										) : (
											"إحالة إلى..."
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent
									align={isRtl ? "end" : "start"}
									dir={dir}
									className="w-[280px] p-2"
								>
									<Controller
										control={form.control}
										name="ownerId"
										render={({ field }) => (
											<Combobox
												value={field.value ?? ""}
												onValueChange={(value) => {
													const next = typeof value === "string" ? value : "";
													field.onChange(next);
													setOwnerPopoverOpen(false);
												}}
											>
												<ComboboxTrigger className="flex w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm">
													<ComboboxValue
														placeholder="إحالة إلى..."
														className="truncate"
													>
														{selectedOwner?.name}
													</ComboboxValue>
												</ComboboxTrigger>
												<ComboboxContent dir={dir}>
													<ComboboxList>
														{ownersLoading ? (
															<ComboboxEmpty>جارٍ التحميل...</ComboboxEmpty>
														) : selectableOwners.length === 0 ? (
															<ComboboxEmpty>لا يوجد ملاك آخرون</ComboboxEmpty>
														) : (
															selectableOwners.map((o) => (
																<ComboboxItem
																	key={o.id}
																	value={o.id}
																>
																	<span className="truncate">{o.name}</span>
																	<span className="ms-auto text-xs text-muted-foreground">
																		{o.phone}
																	</span>
																</ComboboxItem>
															))
														)}
													</ComboboxList>
												</ComboboxContent>
											</Combobox>
										)}
									/>
									<FieldError errors={[form.formState.errors.ownerId]} />
								</PopoverContent>
							</Popover>

							<div className="flex items-center gap-2">
								<Switch
									id="reassign-email"
									checked={false}
									disabled
								/>
								<Label
									htmlFor="reassign-email"
									className="text-sm text-muted-foreground"
								>
									إشعار عبر البريد
								</Label>
							</div>

							<Button
								type="submit"
								disabled={isSubmitDisabled}
							>
								<Kbd className="text-white">⌘↵</Kbd>
								<span>إحالة</span>
							</Button>
						</div>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
