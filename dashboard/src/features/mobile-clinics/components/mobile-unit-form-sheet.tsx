import { zodResolver } from "@hookform/resolvers/zod";
import { IconTruck } from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useEffect, useState } from "react";
import { Controller, type Resolver, type SubmitHandler, useForm } from "react-hook-form";

import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { Button } from "@/components/ui/button";
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
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useMobileUnitMutations } from "@/features/mobile-clinics/hooks/use-mobile-unit-mutations";
import { useBranches } from "@/features/settings/branches/hooks/use-branches";
import { useFormProgress } from "@/hooks/use-form-progress";
import {
	type CreateMobileUnitFormInput,
	createMobileUnitSchema,
	type MobileUnitResponse,
} from "@sanad/contracts/runtime/server/mobile-clinics/mobile-units/mobile-units.type";

interface MobileUnitFormSheetProps {
	open: boolean;
	onClose: () => void;
	unit?: MobileUnitResponse | null;
}

const EMPTY: CreateMobileUnitFormInput = {
	name: "",
	branchId: "",
	plateNumber: undefined,
	vehicleMake: undefined,
	vehicleModel: undefined,
	year: undefined,
	color: undefined,
	notes: undefined,
};

export function MobileUnitFormSheet({ open, onClose, unit }: MobileUnitFormSheetProps) {
	const isEdit = !!unit;
	const { branches, isLoading: branchesLoading } = useBranches();
	const { createUnit, updateUnit, isCreating, isUpdating } = useMobileUnitMutations(unit?.id);
	const isPending = isCreating || isUpdating;
	const [continueAdding, setContinueAdding] = useState(false);

	const {
		register,
		handleSubmit,
		control,
		reset,
		watch,
		formState: { errors, isValid },
	} = useForm<CreateMobileUnitFormInput>({
		resolver: zodResolver(createMobileUnitSchema) as Resolver<CreateMobileUnitFormInput>,
		mode: "onChange",
		defaultValues: EMPTY,
	});

	const values = watch();
	const formProgress = useFormProgress({ schema: createMobileUnitSchema, values });

	useEffect(() => {
		if (open && unit) {
			reset({
				name: unit.name,
				branchId: unit.branchId,
				plateNumber: unit.plateNumber ?? undefined,
				vehicleMake: unit.vehicleMake ?? undefined,
				vehicleModel: unit.vehicleModel ?? undefined,
				year: unit.year ?? undefined,
				color: unit.color ?? undefined,
				notes: unit.notes ?? undefined,
			});
		} else if (!open) {
			reset(EMPTY);
		}
	}, [open, unit, reset]);

	const onSubmit: SubmitHandler<CreateMobileUnitFormInput> = async (data) => {
		if (isEdit && unit) {
			// `branchId` مستبعد عمدًا — الفرع الأمّ ثابت بعد الإنشاء لأنّ مستودع المركبة
			// مرتبط به (انظر `updateMobileUnitSchema`).
			await updateUnit(unit.id, {
				name: data.name,
				plateNumber: data.plateNumber,
				vehicleMake: data.vehicleMake,
				vehicleModel: data.vehicleModel,
				year: data.year,
				color: data.color,
				notes: data.notes,
			});
		} else {
			await createUnit(data);
		}

		if (!isEdit && continueAdding) {
			reset(EMPTY);
			return;
		}
		onClose();
	};

	useHotkey("Mod+Enter", () => handleSubmit(onSubmit)(), { enabled: open });

	return (
		<Sheet
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<SheetContent
				side="left"
				showCloseButton={false}
				className="flex w-full flex-col gap-0 p-0 sm:max-w-[460px]!"
			>
				<FormHeader
					title={isEdit ? "تعديل وحدة متنقلة" : "إضافة وحدة متنقلة"}
					identity={unit ? { name: unit.name } : null}
					changesCount={unit?.editsCount ?? 0}
					progress={formProgress}
					onClose={onClose}
				/>

				<form
					id="mobile-unit-form"
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4"
					dir="rtl"
				>
					<div className="flex flex-col gap-1.5">
						<Label className="text-sm font-medium">اسم الوحدة</Label>
						<Field data-invalid={!!errors.name}>
							<Input
								placeholder="مثال: الوحدة المتنقلة ١"
								className="text-sm"
								aria-invalid={!!errors.name}
								disabled={isPending}
								{...register("name")}
							/>
							<FieldError errors={[errors.name]} />
						</Field>
					</div>

					<Controller
						name="branchId"
						control={control}
						render={({ field }) => (
							<div className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium">الفرع الأمّ</Label>
								<Field data-invalid={!!errors.branchId}>
									<Select
										dir="rtl"
										value={field.value || undefined}
										onValueChange={field.onChange}
										disabled={isPending || branchesLoading || isEdit}
									>
										<SelectTrigger
											className="w-full text-sm"
											aria-invalid={!!errors.branchId}
										>
											<SelectValue placeholder="اختر الفرع" />
										</SelectTrigger>
										{/* position="popper" ضروري في RTL — الافتراضي يُحاذي العنصر ويخرج خارج الشاشة */}
										<SelectContent position="popper">
											{branches.map((branch) => (
												<SelectItem
													key={branch.id}
													value={branch.id}
												>
													{branch.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FieldError errors={[errors.branchId]} />
								</Field>
								<span className="text-xs text-muted-foreground">
									{isEdit
										? "لا يمكن تغيير الفرع بعد الإنشاء — مستودع الوحدة مرتبط به."
										: "يُنشأ للوحدة مستودعها الخاص تحت هذا الفرع تلقائيًا."}
								</span>
							</div>
						)}
					/>

					<div className="flex flex-col gap-1.5">
						<Label className="text-sm font-medium">رقم اللوحة</Label>
						<Field data-invalid={!!errors.plateNumber}>
							{/* جزيرة LTR: أرقام وحروف لاتينية داخل صفحة RTL */}
							<Input
								dir="ltr"
								placeholder="ABC 1234"
								className="text-start font-mono text-sm"
								disabled={isPending}
								{...register("plateNumber")}
							/>
							<FieldError errors={[errors.plateNumber]} />
						</Field>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1.5">
							<Label className="text-sm font-medium">الصانع</Label>
							<Field data-invalid={!!errors.vehicleMake}>
								<Input
									placeholder="تويوتا"
									className="text-sm"
									disabled={isPending}
									{...register("vehicleMake")}
								/>
								<FieldError errors={[errors.vehicleMake]} />
							</Field>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label className="text-sm font-medium">الطراز</Label>
							<Field data-invalid={!!errors.vehicleModel}>
								<Input
									placeholder="هايس"
									className="text-sm"
									disabled={isPending}
									{...register("vehicleModel")}
								/>
								<FieldError errors={[errors.vehicleModel]} />
							</Field>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1.5">
							<Label className="text-sm font-medium">سنة الصنع</Label>
							<Field data-invalid={!!errors.year}>
								<Input
									type="number"
									inputMode="numeric"
									placeholder="2022"
									className="text-sm tabular-nums"
									disabled={isPending}
									{...register("year")}
								/>
								<FieldError errors={[errors.year]} />
							</Field>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label className="text-sm font-medium">اللون</Label>
							<Field data-invalid={!!errors.color}>
								<Input
									placeholder="أبيض"
									className="text-sm"
									disabled={isPending}
									{...register("color")}
								/>
								<FieldError errors={[errors.color]} />
							</Field>
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label className="text-sm font-medium">ملاحظات</Label>
						<Field data-invalid={!!errors.notes}>
							<Textarea
								rows={3}
								placeholder="أي ملاحظات عن المركبة أو تجهيزاتها..."
								className="text-sm"
								disabled={isPending}
								{...register("notes")}
							/>
							<FieldError errors={[errors.notes]} />
						</Field>
					</div>
				</form>

				<FormFooter
					continueAdding={continueAdding}
					onContinueAddingChange={isEdit ? undefined : setContinueAdding}
					disabled={isPending}
				>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onClose}
						disabled={isPending}
					>
						إلغاء
					</Button>
					<Button
						type="submit"
						form="mobile-unit-form"
						size="sm"
						disabled={isPending || !isValid}
					>
						<IconTruck className="size-3.5" />
						{isEdit ? "حفظ التعديلات" : "إضافة الوحدة"}
					</Button>
				</FormFooter>
			</SheetContent>
		</Sheet>
	);
}
