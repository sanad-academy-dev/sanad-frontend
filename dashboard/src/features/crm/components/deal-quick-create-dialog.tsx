import { zodResolver } from "@hookform/resolvers/zod";
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
import { useCreateDeal } from "@/features/crm/hooks/use-crm-deals";
import { useCrmDealStatuses, useCrmLeadSources } from "@/features/crm/hooks/use-crm-masters";
import {
	type CreateDealFormInput,
	type CreateDealFormValues,
	createDealSchema,
} from "@sanad/contracts/runtime/server/crm/crm-deals/crm-deals.type";

/**
 * [CRM-P2] §11.2 — quick-create for a deal opened without a lead behind it (a walk-in that
 * is already a negotiation). Same mobile-first spirit as the lead dialog: name + mobile +
 * stage, everything else on the deal page.
 *
 * WON-kind stages are filtered OUT of the picker (BR-C4.1): a deal cannot be BORN won —
 * winning must resolve the Owner in the win transaction, and the server refuses it here too.
 */
export const DealQuickCreateDialog = ({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) => {
	const { statuses } = useCrmDealStatuses();
	const { sources } = useCrmLeadSources();
	const { createDeal, isCreating } = useCreateDeal();

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<CreateDealFormValues, unknown, CreateDealFormInput>({
		resolver: zodResolver(createDealSchema),
	});

	const selectable = [...statuses]
		.filter((status) => status.active && status.kind !== "WON")
		.sort((a, b) => a.order - b.order);
	/** The entry column. Set in an effect: masters land after the first render. */
	const entryStatusId = selectable[0]?.id;

	useEffect(() => {
		if (open) reset({ statusId: entryStatusId ?? "" } as CreateDealFormValues);
	}, [open, entryStatusId, reset]);

	const submit = handleSubmit(async (values) => {
		await createDeal(values);
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
					<DialogTitle>صفقة جديدة</DialogTitle>
					<DialogDescription>
						الاسم الأول والجوال يكفيان للبدء؛ البنود والقيمة تُستكمل من صفحة الصفقة.
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={submit}
					className="space-y-4"
				>
					<div className="grid gap-4 sm:grid-cols-2">
						<Field data-invalid={!!errors.firstName}>
							<Label htmlFor="crm-deal-first-name">الاسم الأول</Label>
							<Input
								id="crm-deal-first-name"
								aria-invalid={!!errors.firstName}
								disabled={isCreating}
								{...register("firstName")}
							/>
							<FieldError errors={[errors.firstName]} />
						</Field>

						<Field data-invalid={!!errors.lastName}>
							<Label htmlFor="crm-deal-last-name">اسم العائلة</Label>
							<Input
								id="crm-deal-last-name"
								disabled={isCreating}
								{...register("lastName")}
							/>
							<FieldError errors={[errors.lastName]} />
						</Field>

						<Field data-invalid={!!errors.mobile}>
							<Label htmlFor="crm-deal-mobile">الجوال</Label>
							<Input
								id="crm-deal-mobile"
								dir="ltr"
								className="text-start"
								aria-invalid={!!errors.mobile}
								disabled={isCreating}
								{...register("mobile")}
							/>
							<FieldError errors={[errors.mobile]} />
						</Field>

						<Field data-invalid={!!errors.dealValue}>
							<Label htmlFor="crm-deal-value">القيمة التقديرية</Label>
							<Input
								id="crm-deal-value"
								dir="ltr"
								inputMode="decimal"
								className="text-start"
								placeholder="0.00"
								disabled={isCreating}
								{...register("dealValue")}
							/>
							<FieldError errors={[errors.dealValue]} />
						</Field>

						<Controller
							name="statusId"
							control={control}
							render={({ field }) => (
								<Field data-invalid={!!errors.statusId}>
									<Label htmlFor="crm-deal-status">المرحلة</Label>
									<Select
										value={field.value ?? ""}
										onValueChange={field.onChange}
										disabled={isCreating}
									>
										<SelectTrigger
											id="crm-deal-status"
											className="w-full"
										>
											<SelectValue placeholder="اختر المرحلة" />
										</SelectTrigger>
										<SelectContent dir="rtl">
											{selectable.map((status) => (
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

						{/* §5 — a deal opened without a lead behind it still has a source; it is
						    picked here rather than inherited, since there is nothing to inherit from. */}
						<Controller
							name="sourceId"
							control={control}
							render={({ field }) => (
								<Field data-invalid={!!errors.sourceId}>
									<Label htmlFor="crm-deal-source">المصدر</Label>
									<Select
										value={field.value ?? ""}
										onValueChange={field.onChange}
										disabled={isCreating}
									>
										<SelectTrigger
											id="crm-deal-source"
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
									<FieldError errors={[errors.sourceId]} />
								</Field>
							)}
						/>

						<Field data-invalid={!!errors.expectedCloseDate}>
							<Label htmlFor="crm-deal-close">تاريخ الإغلاق المتوقّع</Label>
							<Input
								id="crm-deal-close"
								type="date"
								disabled={isCreating}
								{...register("expectedCloseDate")}
							/>
							<FieldError errors={[errors.expectedCloseDate]} />
						</Field>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							disabled={isCreating}
							onClick={() => onOpenChange(false)}
						>
							إلغاء
						</Button>
						<Button
							type="submit"
							disabled={isCreating}
						>
							إنشاء
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
