import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useCreateLead, useLeadDuplicateCheck } from "@/features/crm/hooks/use-crm-leads";
import { useCrmLeadSources, useCrmLeadStatuses } from "@/features/crm/hooks/use-crm-masters";
import {
	type CreateLeadFormInput,
	type CreateLeadFormValues,
	createLeadSchema,
} from "@sanad/contracts/runtime/server/crm/crm-leads/crm-leads.type";

/**
 * [CRM-P1] §11.4 — the quick-create modal, MOBILE-FIRST: reception logs a phone call before
 * it knows a surname, so only first name + mobile + status are required and everything else
 * can be filled in later on the lead page.
 */
export const LeadQuickCreateDialog = ({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) => {
	const { statuses } = useCrmLeadStatuses();
	const { sources } = useCrmLeadSources();
	const { createLead, isCreating } = useCreateLead();

	const {
		register,
		handleSubmit,
		control,
		reset,
		watch,
		formState: { errors },
	} = useForm<CreateLeadFormValues, unknown, CreateLeadFormInput>({
		resolver: zodResolver(createLeadSchema),
	});

	/**
	 * Default to the FIRST status in pipeline order — the entry column. Done in an effect
	 * because the masters arrive after the first render, so a defaultValue would be stale.
	 */
	const entryStatusId = [...statuses]
		.filter((status) => status.active)
		.sort((a, b) => a.order - b.order)[0]?.id;

	useEffect(() => {
		if (open) reset({ statusId: entryStatusId ?? "" } as CreateLeadFormValues);
	}, [open, entryStatusId, reset]);

	// BR-C3.2 — يُسأل أثناء الكتابة، فيرى الموظّف المطابِق قبل أن يصنع نسخةً ثانية لا بعدها
	const { duplicate } = useLeadDuplicateCheck(watch("mobile") ?? "");

	const submit = handleSubmit(async (values) => {
		await createLead(values);
		onOpenChange(false);
	});

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				dir="rtl"
				className="max-h-[85vh] overflow-y-auto sm:max-w-lg"
			>
				<DialogHeader>
					<DialogTitle>عميل محتمل جديد</DialogTitle>
					<DialogDescription>
						الاسم الأول والجوال يكفيان للبدء؛ بقيّة التفاصيل تُستكمل من صفحة العميل.
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={submit}
					className="space-y-4"
				>
					<div className="grid gap-4 sm:grid-cols-2">
						<Field data-invalid={!!errors.firstName}>
							<Label htmlFor="crm-first-name">الاسم الأول</Label>
							<Input
								id="crm-first-name"
								aria-invalid={!!errors.firstName}
								disabled={isCreating}
								{...register("firstName")}
							/>
							<FieldError errors={[errors.firstName]} />
						</Field>

						<Field data-invalid={!!errors.lastName}>
							<Label htmlFor="crm-last-name">اسم العائلة</Label>
							<Input
								id="crm-last-name"
								disabled={isCreating}
								{...register("lastName")}
							/>
							<FieldError errors={[errors.lastName]} />
						</Field>

						<Field data-invalid={!!errors.mobile}>
							<Label htmlFor="crm-mobile">الجوال</Label>
							<Input
								id="crm-mobile"
								dir="ltr"
								className="text-start"
								aria-invalid={!!errors.mobile}
								disabled={isCreating}
								{...register("mobile")}
							/>
							<FieldError errors={[errors.mobile]} />
							{/* BR-C3.2 — تحذيرٌ مربوط، لا رفض: الحفظ يبقى متاحًا لأنّ الرفض يدفع
							    الاستقبال إلى تزوير الرقم، والرابط يجعل «هل هو نفسه؟» سؤالًا يُجاب */}
							{duplicate ? (
								<p className="text-[11px] text-amber-600 dark:text-amber-500">
									رقم مطابق لعميل محتمل قائم:{" "}
									<Link
										to="/crm/leads/$leadId"
										params={{ leadId: duplicate.duplicateOf.id }}
										className="font-medium underline underline-offset-2"
										onClick={() => onOpenChange(false)}
									>
										{duplicate.duplicateOf.fullName} ({duplicate.duplicateOf.code})
									</Link>{" "}
									— يمكنك المتابعة إن كان شخصًا آخر.
								</p>
							) : null}
						</Field>

						<Field data-invalid={!!errors.city}>
							<Label htmlFor="crm-city">المدينة</Label>
							<Input
								id="crm-city"
								disabled={isCreating}
								{...register("city")}
							/>
							<FieldError errors={[errors.city]} />
						</Field>

						<Controller
							name="statusId"
							control={control}
							render={({ field }) => (
								<Field data-invalid={!!errors.statusId}>
									<Label htmlFor="crm-status">الحالة</Label>
									<Select
										value={field.value ?? ""}
										onValueChange={field.onChange}
										disabled={isCreating}
									>
										<SelectTrigger
											id="crm-status"
											className="w-full"
										>
											<SelectValue placeholder="اختر الحالة" />
										</SelectTrigger>
										<SelectContent dir="rtl">
											{[...statuses]
												.filter((status) => status.active)
												.sort((a, b) => a.order - b.order)
												.map((status) => (
													<SelectItem
														key={status.id}
														value={status.id}
													>
														{status.name}
													</SelectItem>
												))}
										</SelectContent>
									</Select>
									<FieldError errors={[errors.statusId]} />
								</Field>
							)}
						/>

						<Controller
							name="sourceId"
							control={control}
							render={({ field }) => (
								<Field>
									<Label htmlFor="crm-source">المصدر</Label>
									<Select
										value={field.value ?? ""}
										onValueChange={field.onChange}
										disabled={isCreating}
									>
										<SelectTrigger
											id="crm-source"
											className="w-full"
										>
											<SelectValue placeholder="اختر المصدر" />
										</SelectTrigger>
										<SelectContent dir="rtl">
											{sources
												.filter((source) => source.active)
												.map((source) => (
													<SelectItem
														key={source.id}
														value={source.id}
													>
														{source.name}
													</SelectItem>
												))}
										</SelectContent>
									</Select>
								</Field>
							)}
						/>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isCreating}
						>
							إلغاء
						</Button>
						<Button
							type="submit"
							disabled={isCreating}
						>
							حفظ
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
