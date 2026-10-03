import { zodResolver } from "@hookform/resolvers/zod";
import { IconStethoscope } from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { type ReactNode, useEffect, useMemo, useState } from "react";
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useReferAppointment } from "@/features/appointments/hooks/use-refer-appointment";
import { useStaffForBooking } from "@/features/appointments/hooks/use-staff-for-booking";
import { useFormProgress } from "@/hooks/use-form-progress";
import { useI18n } from "@/hooks/use-i18n";
import {
	type ReferAppointmentFormInput,
	type ReferAppointmentFormValues,
	referAppointmentSchema,
} from "@sanad/contracts/runtime/server/appointments/appointments.type";

interface ReferAppointmentDialogProps {
	appointmentId: string;
	appointmentCode: string;
	patientName: string;
	currentStaffId: string;
	trigger: ReactNode;
}

export function ReferAppointmentDialog({
	appointmentId,
	appointmentCode,
	patientName,
	currentStaffId,
	trigger,
}: ReferAppointmentDialogProps) {
	const { isRtl } = useI18n();
	const dir = isRtl ? "rtl" : "ltr";

	const { referAppointment, isPending } = useReferAppointment(appointmentId);
	const { staff, isLoading: staffLoading } = useStaffForBooking();

	const [open, setOpen] = useState(false);
	const [staffPopoverOpen, setStaffPopoverOpen] = useState(false);

	const defaults = useMemo<ReferAppointmentFormInput>(
		() => ({ staffId: "", comment: "" }),
		[],
	);

	const form = useForm<ReferAppointmentFormInput, unknown, ReferAppointmentFormValues>({
		resolver: zodResolver(referAppointmentSchema),
		mode: "onChange",
		defaultValues: defaults,
	});

	useEffect(() => {
		if (open) form.reset(defaults);
	}, [open, defaults, form]);

	const values = form.watch();
	const formProgress = useFormProgress({ schema: referAppointmentSchema, values });

	const staffId = values.staffId;
	const selectableStaff = useMemo(
		() => staff.filter((s) => s.id !== currentStaffId),
		[staff, currentStaffId],
	);
	const selectedStaff = selectableStaff.find((s) => s.id === staffId);
	const staffLabel = (s: { name: string; prefix: string | null }) =>
		`${s.prefix ?? ""}${s.name}`.trim();

	const hasChange = !!staffId && staffId !== currentStaffId;

	const onSubmit = async (data: ReferAppointmentFormValues) => {
		await referAppointment({ staffId: data.staffId, comment: data.comment });
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
				<FormHeader
					variant="dialog"
					title="إحالة الزيارة"
					identity={patientName ? { name: patientName, code: appointmentCode } : null}
					progress={formProgress}
					onClose={() => setOpen(false)}
				/>

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
								open={staffPopoverOpen}
								onOpenChange={setStaffPopoverOpen}
							>
								<PopoverTrigger asChild>
									<Button
										type="button"
										variant="outline"
										size="sm"
										className="h-9 gap-2"
									>
										<IconStethoscope className="size-4" />
										{selectedStaff ? (
											<span className="truncate">{staffLabel(selectedStaff)}</span>
										) : (
											"إحالة إلى مدرّب..."
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
										name="staffId"
										render={({ field }) => (
											<Combobox
												value={field.value ?? ""}
												onValueChange={(value) => {
													const next = typeof value === "string" ? value : "";
													field.onChange(next);
													setStaffPopoverOpen(false);
												}}
											>
												<ComboboxTrigger className="flex w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm">
													<ComboboxValue
														placeholder="إحالة إلى مدرّب..."
														className="truncate"
													>
														{selectedStaff ? staffLabel(selectedStaff) : undefined}
													</ComboboxValue>
												</ComboboxTrigger>
												<ComboboxContent dir={dir}>
													<ComboboxList>
														{staffLoading ? (
															<ComboboxEmpty>جارٍ التحميل...</ComboboxEmpty>
														) : selectableStaff.length === 0 ? (
															<ComboboxEmpty>لا يوجد مدرّبين آخرون</ComboboxEmpty>
														) : (
															selectableStaff.map((s) => (
																<ComboboxItem
																	key={s.id}
																	value={s.id}
																>
																	<span className="truncate">{staffLabel(s)}</span>
																	<span className="ms-auto text-xs text-muted-foreground">
																		{s.role?.name}
																	</span>
																</ComboboxItem>
															))
														)}
													</ComboboxList>
												</ComboboxContent>
											</Combobox>
										)}
									/>
									<FieldError errors={[form.formState.errors.staffId]} />
								</PopoverContent>
							</Popover>

							<div className="flex items-center gap-2">
								<Switch
									id="refer-email"
									checked={false}
									disabled
								/>
								<Label
									htmlFor="refer-email"
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
