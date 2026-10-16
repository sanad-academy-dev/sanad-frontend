import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowsExchange, IconUserCheck } from "@tabler/icons-react";
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
	onSuccess?: (patient: PatientResponse) => void;
}

export function TransferOwnershipDialog({
	patient,
	onClose,
	onSuccess,
}: TransferOwnershipDialogProps) {
	const { isRtl } = useI18n();
	const dir = isRtl ? "rtl" : "ltr";

	const open = !!patient;
	const patientId = patient?.id ?? "";
	const currentOwnerId = patient?.owner?.id ?? "";

	const { transferOwnership, isPending } = useTransferPatientOwnership(patientId);
	const { owners, isLoading: ownersLoading } = useOwners();

	const [notifyOwner, setNotifyOwner] = useState(true);

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
		try {
			const updated = await transferOwnership({ ownerId: data.ownerId, comment: data.comment });
			onSuccess?.(updated as unknown as PatientResponse);
			onClose();
		} catch {
			// Toast notification is managed by hook
		}
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
				className="p-0 gap-0 max-w-xl!"
				showCloseButton={false}
			>
				<FormHeader
					variant="dialog"
					title="نقل ملكية الطفل"
					identity={patient ? { name: patient.name, code: patient.code } : null}
					progress={formProgress}
					onClose={onClose}
				/>

				<form
					dir={dir}
					onSubmit={submitForm}
				>
					<div className="p-5 flex flex-col gap-4">
						{/* ولي الأمر الحالي */}
						<div className="rounded-lg border bg-muted/30 p-3.5 flex flex-col gap-1.5">
							<span className="text-xs font-semibold text-muted-foreground">
								وليّ الأمر الحالي
							</span>
							{patient?.owner ? (
								<div className="flex items-center justify-between gap-2">
									<div className="flex items-center gap-2">
										<div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
											{patient.owner.name.slice(0, 2)}
										</div>
										<div className="flex flex-col">
											<span className="text-sm font-medium">{patient.owner.name}</span>
											{patient.owner.code && (
												<span className="text-xs text-muted-foreground">
													{patient.owner.code}
												</span>
											)}
										</div>
									</div>
									{patient.owner.phone && (
										<span
											className="text-xs text-muted-foreground tabular-nums font-mono"
											dir="ltr"
										>
											{patient.owner.phone}
										</span>
									)}
								</div>
							) : (
								<p className="text-xs text-muted-foreground">
									لا يوجد وليّ أمر مسجل حالياً لهذا الطفل
								</p>
							)}
						</div>

						{/* ولي الأمر الجديد */}
						<Field data-invalid={!!form.formState.errors.ownerId}>
							<Label className="text-sm font-medium">
								وليّ الأمر الجديد <span className="text-destructive">*</span>
							</Label>
							<Controller
								control={form.control}
								name="ownerId"
								render={({ field }) => (
									<Combobox
										value={field.value ?? ""}
										onValueChange={(value) => {
											const next = typeof value === "string" ? value : "";
											field.onChange(next);
										}}
									>
										<ComboboxTrigger
											className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
											disabled={isPending || ownersLoading}
										>
											<ComboboxValue
												placeholder="اختر وليّ الأمر الجديد..."
												className="truncate"
											>
												{selectedOwner ? (
													<span className="flex items-center gap-2">
														<IconUserCheck className="size-4 text-primary shrink-0" />
														<span className="font-medium">{selectedOwner.name}</span>
														{selectedOwner.phone && (
															<span
																className="text-xs text-muted-foreground font-mono"
																dir="ltr"
															>
																({selectedOwner.phone})
															</span>
														)}
													</span>
												) : undefined}
											</ComboboxValue>
										</ComboboxTrigger>
										<ComboboxContent
											dir={dir}
											className="w-[--radix-combobox-trigger-width]"
										>
											<ComboboxList>
												{ownersLoading ? (
													<ComboboxEmpty>جارٍ التحميل...</ComboboxEmpty>
												) : selectableOwners.length === 0 ? (
													<ComboboxEmpty>لا يوجد أولياء أمور آخرون</ComboboxEmpty>
												) : (
													selectableOwners.map((o) => (
														<ComboboxItem
															key={o.id}
															value={o.id}
														>
															<div className="flex items-center justify-between w-full gap-2">
																<span className="truncate font-medium">{o.name}</span>
																{o.phone && (
																	<span
																		className="text-xs text-muted-foreground tabular-nums font-mono"
																		dir="ltr"
																	>
																		{o.phone}
																	</span>
																)}
															</div>
														</ComboboxItem>
													))
												)}
											</ComboboxList>
										</ComboboxContent>
									</Combobox>
								)}
							/>
							<FieldError errors={[form.formState.errors.ownerId]} />
						</Field>

						{/* سبب النقل */}
						<Field data-invalid={!!form.formState.errors.comment}>
							<Label className="text-sm text-muted-foreground">سبب نقل الملكية (اختياري)</Label>
							<Textarea
								className="min-h-20 resize-none text-sm"
								placeholder="اذكر سبب نقل ملف الطفل أو أية ملاحظات إدارية..."
								disabled={isPending}
								{...form.register("comment")}
							/>
							<FieldError errors={[form.formState.errors.comment]} />
						</Field>

						<div className="flex items-center justify-between pt-1">
							<Label
								htmlFor="transfer-notify"
								className="flex flex-col gap-0.5 cursor-pointer"
							>
								<span className="text-sm font-medium">إشعار وليّ الأمر</span>
								<span className="text-xs text-muted-foreground">
									إرسال إشعار بتحديث ملف الطفل إلى وليّ الأمر الجديد
								</span>
							</Label>
							<Switch
								id="transfer-notify"
								checked={notifyOwner}
								onCheckedChange={setNotifyOwner}
								disabled={isPending}
							/>
						</div>
					</div>

					<Separator />

					<div className="flex items-center justify-end gap-2 p-3.5 bg-muted/10">
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="h-9 px-4"
							onClick={onClose}
							disabled={isPending}
						>
							إلغاء
						</Button>

						<Button
							type="submit"
							size="sm"
							className="h-9 gap-2 px-4"
							disabled={isSubmitDisabled}
						>
							<IconArrowsExchange className="size-4" />
							<span>تأكيد نقل الملكية</span>
							<Kbd className="text-white">⌘↵</Kbd>
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
