import { zodResolver } from "@hookform/resolvers/zod";
import { IconUserPlus } from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { FormHeader } from "@/components/common/form-header";
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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useOwners } from "@/features/services/patients/hooks/use-owners";
import { useTransferPatientOwnership } from "@/features/services/patients/hooks/use-transfer-patient-ownership";
import { useFormProgress } from "@/hooks/use-form-progress";
import { useI18n } from "@/hooks/use-i18n";
import {
	type PatientResponse,
	type TransferPatientOwnershipFormInput,
	type TransferPatientOwnershipFormValues,
	transferPatientOwnershipSchema,
} from "@sanad/contracts/runtime/server/patients/patients.type";

interface TransferOwnershipDialogProps {
	patient: PatientResponse | null;
	onClose: () => void;
}

export function TransferOwnershipDialog({ patient, onClose }: TransferOwnershipDialogProps) {
	const { isRtl } = useI18n();
	const dir = isRtl ? "rtl" : "ltr";

	const open = !!patient;
	const patientId = patient?.id ?? "";
	const currentOwnerId = patient?.owner?.id ?? "";

	const { transferOwnership, isPending } = useTransferPatientOwnership(patientId);
	const { owners, isLoading: ownersLoading } = useOwners();

	const [ownerPopoverOpen, setOwnerPopoverOpen] = useState(false);

	const defaults = useMemo<TransferPatientOwnershipFormInput>(
		() => ({ ownerId: "", comment: "" }),
		[],
	);

	const form = useForm<
		TransferPatientOwnershipFormInput,
		unknown,
		TransferPatientOwnershipFormValues
	>({
		resolver: zodResolver(transferPatientOwnershipSchema),
		mode: "onChange",
		defaultValues: defaults,
	});

	useEffect(() => {
		if (open) form.reset(defaults);
	}, [open, defaults, form]);

	const values = form.watch();
	const formProgress = useFormProgress({
		schema: transferPatientOwnershipSchema,
		values,
	});

	const ownerId = values.ownerId;
	const selectableOwners = useMemo(
		() => owners.filter((o) => o.id !== currentOwnerId),
		[owners, currentOwnerId],
	);
	const selectedOwner = selectableOwners.find((o) => o.id === ownerId);

	const hasChange = !!ownerId && ownerId !== currentOwnerId;

	const onSubmit = async (data: TransferPatientOwnershipFormValues) => {
		await transferOwnership({ ownerId: data.ownerId, comment: data.comment });
		onClose();
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
			onOpenChange={(next) => {
				if (!next) onClose();
			}}
		>
			<DialogContent
				dir={dir}
				className="p-0 gap-0 max-w-2xl!"
				showCloseButton={false}
			>
				<FormHeader
					variant="dialog"
					title="نقل ملكية"
					identity={patient ? { name: patient.name, code: patient.code } : null}
					progress={formProgress}
					onClose={onClose}
				/>

				<form
					dir={dir}
					onSubmit={submitForm}
				>
					<div className="p-4">
						<Field data-invalid={!!form.formState.errors.comment}>
							<Label className="text-sm text-muted-foreground">اضف سبب النقل</Label>
							<Textarea
								className="min-h-24"
								placeholder="سبب نقل الملكية..."
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
							onClick={onClose}
							disabled={isPending}
						>
							إلغاء
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
											"نقل إلى..."
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
														placeholder="نقل إلى..."
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
									id="transfer-email"
									checked={false}
									disabled
								/>
								<Label
									htmlFor="transfer-email"
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
								<span>نقل</span>
							</Button>
						</div>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
