import { zodResolver } from "@hookform/resolvers/zod";
import { useHotkey } from "@tanstack/react-hotkeys";
import { Controller, useForm } from "react-hook-form";
import { FieldLabel } from "@/components/common/field-label";
import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useCreateOwner } from "@/features/services/patients/hooks/use-create-owner";
import { useFormProgress } from "@/hooks/use-form-progress";
import { type CreateOwnerFormInput, createOwnerSchema } from "@sanad/contracts/runtime/server/owners/owners.type";

interface AddOwnerDialogProps {
	open: boolean;
	onClose: () => void;
	onSuccess?: (ownerId: string) => void;
}

export function AddOwnerDialog({ open, onClose, onSuccess }: AddOwnerDialogProps) {
	const { createOwner, isPending } = useCreateOwner();

	const {
		register,
		handleSubmit,
		control,
		reset,
		watch,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(createOwnerSchema),
		defaultValues: { active: true },
	});

	const values = watch();
	const formProgress = useFormProgress({ schema: createOwnerSchema, values });

	const onSubmit = async (data: CreateOwnerFormInput) => {
		const owner = await createOwner(data);
		reset();
		onClose();
		onSuccess?.(owner.id);
	};

	const handleClose = () => {
		reset();
		onClose();
	};

	useHotkey("Mod+Enter", () => handleSubmit(onSubmit)(), { enabled: open });

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) handleClose();
			}}
		>
			<DialogContent
				showCloseButton={false}
				className="sm:max-w-xl p-0 gap-0"
				dir="rtl"
			>
				<FormHeader
					variant="dialog"
					title="إضافة وليّ أمر جديد"
					progress={formProgress}
					onClose={handleClose}
				/>

				<form
					id="add-owner-form"
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-4 px-4 py-4"
				>
					<div className="flex flex-col gap-1.5">
						<FieldLabel required>
							<Label
								className="text-sm font-medium"
								htmlFor="owner-name"
							>
								اسم وليّ الأمر
							</Label>
						</FieldLabel>
						<Field data-invalid={!!errors.name}>
							<Input
								id="owner-name"
								placeholder="مثال: محمد عمر صلاح"
								className="text-sm"
								aria-invalid={!!errors.name}
								disabled={isPending}
								{...register("name")}
							/>
							<FieldError errors={[errors.name]} />
						</Field>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1.5">
							<FieldLabel required>
								<Label
									className="text-sm font-medium"
									htmlFor="owner-phone"
								>
									رقم الجوال
								</Label>
							</FieldLabel>
							<Field data-invalid={!!errors.phone}>
								<Controller
									name="phone"
									control={control}
									render={({ field }) => (
										<PhoneInput
											id="owner-phone"
											defaultCountry="SA"
											placeholder="05XXXXXXXX"
											aria-invalid={!!errors.phone}
											disabled={isPending}
											value={field.value ?? undefined}
											onChange={(v) => field.onChange(v ?? "")}
										/>
									)}
								/>
								<FieldError errors={[errors.phone]} />
							</Field>
						</div>

						<div className="flex flex-col gap-1.5">
							<FieldLabel required>
								<Label
									className="text-sm font-medium"
									htmlFor="owner-email"
								>
									البريد الإلكتروني
								</Label>
							</FieldLabel>
							<Field data-invalid={!!errors.email}>
								<Input
									id="owner-email"
									type="email"
									placeholder="example@email.com"
									className="text-sm"
									aria-invalid={!!errors.email}
									disabled={isPending}
									{...register("email")}
								/>
								<FieldError errors={[errors.email]} />
							</Field>
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label className="text-sm font-medium">الجنس</Label>
						<Controller
							name="gender"
							control={control}
							render={({ field }) => (
								<Tabs
									value={field.value ?? ""}
									onValueChange={field.onChange}
								>
									<TabsList className="w-full bg-transparent gap-3">
										<TabsTrigger
											value="MALE"
											className="flex-1 border border-border h-9"
											disabled={isPending}
										>
											ذكر
										</TabsTrigger>
										<TabsTrigger
											value="FEMALE"
											className="flex-1 border border-border h-9"
											disabled={isPending}
										>
											أنثى
										</TabsTrigger>
									</TabsList>
								</Tabs>
							)}
						/>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1.5">
							<Label
								className="text-sm font-medium"
								htmlFor="owner-country"
							>
								الدولة
							</Label>
							<Field data-invalid={!!errors.country}>
								<Input
									id="owner-country"
									placeholder="مثال: السعودية"
									className="text-sm"
									disabled={isPending}
									{...register("country")}
								/>
								<FieldError errors={[errors.country]} />
							</Field>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label
								className="text-sm font-medium"
								htmlFor="owner-city"
							>
								المدينة
							</Label>
							<Field data-invalid={!!errors.city}>
								<Input
									id="owner-city"
									placeholder="مثال: الرياض"
									className="text-sm"
									disabled={isPending}
									{...register("city")}
								/>
								<FieldError errors={[errors.city]} />
							</Field>
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label
							className="text-sm font-medium"
							htmlFor="owner-address"
						>
							العنوان
						</Label>
						<Field data-invalid={!!errors.address}>
							<Input
								id="owner-address"
								placeholder="مثال: حي العزيزية"
								className="text-sm"
								disabled={isPending}
								{...register("address")}
							/>
							<FieldError errors={[errors.address]} />
						</Field>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label
							className="text-sm font-medium"
							htmlFor="owner-notes"
						>
							ملاحظات
						</Label>
						<Textarea
							id="owner-notes"
							placeholder="أضف أي ملاحظات..."
							className="text-sm min-h-20 resize-none"
							disabled={isPending}
							{...register("notes")}
						/>
					</div>
				</form>

				<FormFooter>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={handleClose}
						disabled={isPending}
					>
						إلغاء
					</Button>
					<Button
						type="submit"
						form="add-owner-form"
						size="sm"
						disabled={isPending}
					>
						إضافة وليّ الأمر
					</Button>
				</FormFooter>
			</DialogContent>
		</Dialog>
	);
}
