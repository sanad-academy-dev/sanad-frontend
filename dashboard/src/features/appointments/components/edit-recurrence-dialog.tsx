import { zodResolver } from "@hookform/resolvers/zod";
import { useHotkey } from "@tanstack/react-hotkeys";
import { type ReactNode, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useEditRecurrence } from "@/features/appointments/hooks/use-edit-recurrence";
import { RepeatUnit } from "@/generated/prisma/enums";
import { useFormProgress } from "@/hooks/use-form-progress";
import {
	type EditRecurrenceFormInput,
	type EditRecurrenceFormValues,
	editRecurrenceSchema,
	REPEAT_UNIT_LABELS,
} from "@sanad/contracts/runtime/server/appointments/appointments.type";

interface EditRecurrenceDialogProps {
	appointmentId: string;
	recurringGroupId: string;
	currentRepeatUnit: RepeatUnit;
	currentRepeatTotal: number;
	trigger: ReactNode;
}

export function EditRecurrenceDialog({
	appointmentId,
	recurringGroupId,
	currentRepeatUnit,
	currentRepeatTotal,
	trigger,
}: EditRecurrenceDialogProps) {
	const [open, setOpen] = useState(false);
	const { editRecurrence, isPending } = useEditRecurrence(appointmentId);

	const form = useForm<EditRecurrenceFormInput, unknown, EditRecurrenceFormValues>({
		resolver: zodResolver(editRecurrenceSchema),
		defaultValues: { repeatUnit: currentRepeatUnit, repeatCount: currentRepeatTotal },
	});

	useEffect(() => {
		if (open) form.reset({ repeatUnit: currentRepeatUnit, repeatCount: currentRepeatTotal });
	}, [open, currentRepeatUnit, currentRepeatTotal, form]);

	const values = form.watch();
	const formProgress = useFormProgress({ schema: editRecurrenceSchema, values });

	const watchedCount = values.repeatCount;
	const willDelete = typeof watchedCount === "number" && watchedCount < currentRepeatTotal;

	const onSubmit = async (data: EditRecurrenceFormValues) => {
		await editRecurrence({
			groupId: recurringGroupId,
			repeatUnit: data.repeatUnit,
			repeatCount: data.repeatCount,
		});
		setOpen(false);
	};

	useHotkey("Mod+Enter", () => form.handleSubmit(onSubmit)(), { enabled: open });

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogTrigger asChild>{trigger}</DialogTrigger>

			<DialogContent
				dir="rtl"
				className="max-w-md! p-0 gap-0"
				showCloseButton={false}
			>
				<FormHeader
					variant="dialog"
					title="تعديل التكرار"
					progress={formProgress}
					onClose={() => setOpen(false)}
				/>

				<form
					dir="rtl"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<div className="p-4 space-y-6">
						<p className="text-sm text-muted-foreground">
							سيتم تطبيق التغيير على جميع الزيارات في هذه المجموعة.
						</p>

						<div className="grid grid-cols-2 gap-3">
							<Controller
								name="repeatUnit"
								control={form.control}
								render={({ field }) => (
									<Field data-invalid={!!form.formState.errors.repeatUnit}>
										<Label>وحدة التكرار</Label>
										<Select
											dir="rtl"
											value={field.value}
											onValueChange={field.onChange}
											disabled={isPending}
										>
											<SelectTrigger>
												<SelectValue placeholder="اختر وحدة التكرار" />
											</SelectTrigger>
											<SelectContent>
												{Object.values(RepeatUnit).map((unit) => (
													<SelectItem
														key={unit}
														value={unit}
													>
														{REPEAT_UNIT_LABELS[unit]}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FieldError errors={[form.formState.errors.repeatUnit]} />
									</Field>
								)}
							/>

							<Controller
								name="repeatCount"
								control={form.control}
								render={({ field }) => (
									<Field data-invalid={!!form.formState.errors.repeatCount}>
										<Label>عدد مرات التكرار</Label>
										<Select
											dir="rtl"
											value={String(field.value)}
											onValueChange={(v) => field.onChange(Number(v))}
											disabled={isPending}
										>
											<SelectTrigger>
												<SelectValue placeholder="اختر العدد" />
											</SelectTrigger>
											<SelectContent>
												{Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
													<SelectItem
														key={n}
														value={String(n)}
													>
														{n}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FieldError errors={[form.formState.errors.repeatCount]} />
									</Field>
								)}
							/>

							{willDelete && (
								<p className="text-xs text-destructive">
									سيتم حذف {currentRepeatTotal - watchedCount} زيارة من نهاية المجموعة.
								</p>
							)}
						</div>
					</div>

					<FormFooter disabled={isPending}>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => setOpen(false)}
							disabled={isPending}
						>
							إلغاء
						</Button>
						<Button
							type="submit"
							size="sm"
							disabled={isPending || !form.formState.isDirty}
						>
							حفظ التغييرات
						</Button>
					</FormFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
