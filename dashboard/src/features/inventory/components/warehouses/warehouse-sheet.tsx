import { zodResolver } from "@hookform/resolvers/zod";
import { IconBuildingWarehouse } from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useEffect, useState } from "react";
import { Controller, type Resolver, type SubmitHandler, useForm } from "react-hook-form";

import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useWarehouseMutations } from "@/features/inventory/hooks/use-warehouse-mutations";
import { useFormProgress } from "@/hooks/use-form-progress";
import {
	type CreateWarehouseFormInput,
	createWarehouseSchema,
	type WarehouseResponse,
} from "@sanad/contracts/runtime/server/stock/stock.type";

interface WarehouseSheetProps {
	open: boolean;
	onClose: () => void;
	warehouse?: WarehouseResponse | null;
}

export function WarehouseSheet({ open, onClose, warehouse }: WarehouseSheetProps) {
	const isEdit = !!warehouse;
	const { createWarehouse, updateWarehouse, isCreating, isUpdating } = useWarehouseMutations();
	const isPending = isCreating || isUpdating;
	const [continueAdding, setContinueAdding] = useState(false);

	const {
		register,
		handleSubmit,
		control,
		reset,
		watch,
		formState: { errors, isValid },
	} = useForm<CreateWarehouseFormInput>({
		resolver: zodResolver(createWarehouseSchema) as Resolver<CreateWarehouseFormInput>,
		mode: "onChange",
		defaultValues: { name: "", isDefault: false },
	});

	const values = watch();
	const formProgress = useFormProgress({ schema: createWarehouseSchema, values });
	// عدد مرات تعديل السجل المحفوظ في قاعدة البيانات — لا علاقة له بالتغييرات الحالية
	const changesCount = warehouse?.editsCount ?? 0;

	useEffect(() => {
		if (open && warehouse) {
			reset({ name: warehouse.name, isDefault: warehouse.isDefault });
		} else if (!open) {
			reset({ name: "", isDefault: false });
		}
	}, [open, warehouse, reset]);

	const onSubmit: SubmitHandler<CreateWarehouseFormInput> = async (data) => {
		if (isEdit && warehouse) {
			await updateWarehouse(warehouse.id, { name: data.name, isDefault: data.isDefault });
		} else {
			await createWarehouse(data);
		}
		// «حفظ ومتابعة الإضافة» — متاح في وضع الإضافة فقط
		if (!isEdit && continueAdding) {
			reset({ name: "", isDefault: false });
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
					title={isEdit ? "تعديل مستودع" : "إضافة مستودع جديد"}
					identity={warehouse ? { name: warehouse.name } : null}
					changesCount={changesCount}
					progress={formProgress}
					onClose={onClose}
				/>

				<form
					id="warehouse-form"
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4"
					dir="rtl"
				>
					<div className="flex flex-col gap-1.5">
						<Label className="text-sm font-medium">اسم المستودع</Label>
						<Field data-invalid={!!errors.name}>
							<Input
								placeholder="مثال: صيدلية الفرع، العربة المتنقّلة..."
								className="text-sm"
								aria-invalid={!!errors.name}
								disabled={isPending}
								{...register("name")}
							/>
							<FieldError errors={[errors.name]} />
						</Field>
					</div>

					<Controller
						name="isDefault"
						control={control}
						render={({ field }) => (
							<div className="flex items-center justify-between rounded-[4px] border border-[#E5E5E5] p-3">
								<div className="flex flex-col gap-0.5">
									<Label className="text-sm font-medium">المستودع الافتراضي</Label>
									<span className="text-xs text-muted-foreground">
										يستقبل حركات نقطة البيع والرصيد الافتتاحي
									</span>
								</div>
								<Switch
									checked={field.value ?? false}
									onCheckedChange={field.onChange}
									disabled={isPending}
								/>
							</div>
						)}
					/>
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
						form="warehouse-form"
						size="sm"
						disabled={isPending || !isValid}
					>
						<IconBuildingWarehouse className="size-3.5" />
						{isEdit ? "حفظ التعديلات" : "إضافة المستودع"}
					</Button>
				</FormFooter>
			</SheetContent>
		</Sheet>
	);
}
