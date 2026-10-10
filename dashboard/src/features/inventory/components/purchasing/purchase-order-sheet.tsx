import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus, IconShoppingCart, IconTrash } from "@tabler/icons-react";
import { useEffect } from "react";
import {
	Controller,
	type Resolver,
	type SubmitHandler,
	useFieldArray,
	useForm,
} from "react-hook-form";

import { FieldLabel } from "@/components/common/field-label";
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
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useInventory } from "@/features/inventory/hooks/use-inventory";
import { usePurchaseOrderMutations } from "@/features/inventory/hooks/use-purchase-order-mutations";
import { useSuppliers } from "@/features/inventory/hooks/use-suppliers";
import { useWarehouses } from "@/features/inventory/hooks/use-warehouses";
import { useFormProgress } from "@/hooks/use-form-progress";
import {
	type CreatePurchaseOrderFormInput,
	createPurchaseOrderSchema,
} from "@sanad/contracts/runtime/server/purchasing/purchasing.type";

interface PurchaseOrderSheetProps {
	open: boolean;
	onClose: () => void;
}

function SectionTitle({ children }: { children: string }) {
	return <h3 className="text-[13px] font-semibold text-[#08090A]">{children}</h3>;
}

export function PurchaseOrderSheet({ open, onClose }: PurchaseOrderSheetProps) {
	const { suppliers } = useSuppliers();
	const { warehouses } = useWarehouses();
	const { inventory } = useInventory();
	const { createPurchaseOrder, isCreating } = usePurchaseOrderMutations();

	const {
		register,
		handleSubmit,
		control,
		reset,
		watch,
		formState: { errors, isValid },
	} = useForm<CreatePurchaseOrderFormInput>({
		resolver: zodResolver(createPurchaseOrderSchema) as Resolver<CreatePurchaseOrderFormInput>,
		mode: "onChange",
		defaultValues: { lines: [{ itemId: "", qtyOrdered: 1, unitCost: 0 }] },
	});

	const { fields, append, remove } = useFieldArray({ control, name: "lines" });

	useEffect(() => {
		if (!open) reset({ lines: [{ itemId: "", qtyOrdered: 1, unitCost: 0 }] });
	}, [open, reset]);

	const values = watch();
	const formProgress = useFormProgress({ schema: createPurchaseOrderSchema, values });

	const lines = values.lines;
	const total = (lines ?? []).reduce(
		(sum, l) => sum + (Number(l?.qtyOrdered) || 0) * (Number(l?.unitCost) || 0),
		0,
	);

	const onSubmit: SubmitHandler<CreatePurchaseOrderFormInput> = async (data) => {
		await createPurchaseOrder(data);
		onClose();
	};

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
				className="flex w-full flex-col gap-0 p-0 sm:max-w-[620px]!"
			>
				<FormHeader
					title="أمر شراء جديد"
					progress={formProgress}
					onClose={onClose}
				/>

				<form
					id="po-form"
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-4"
					dir="rtl"
				>
					{/* المورد + المستودع */}
					<div className="flex flex-col gap-3">
						<SectionTitle>بيانات الأمر</SectionTitle>
						<div className="grid grid-cols-2 gap-3">
							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label className="text-sm font-medium">المورد</Label>
								</FieldLabel>
								<Controller
									name="supplierId"
									control={control}
									render={({ field }) => (
										<Field data-invalid={!!errors.supplierId}>
											<Select
												value={field.value}
												onValueChange={field.onChange}
												dir="rtl"
												disabled={isCreating}
											>
												<SelectTrigger className="text-sm">
													<SelectValue placeholder="اختر المورد..." />
												</SelectTrigger>
												<SelectContent dir="rtl">
													{suppliers.map((s) => (
														<SelectItem
															key={s.id}
															value={s.id}
														>
															{s.legalName}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FieldError errors={[errors.supplierId]} />
										</Field>
									)}
								/>
							</div>
							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label className="text-sm font-medium">المستودع المستهدف</Label>
								</FieldLabel>
								<Controller
									name="warehouseId"
									control={control}
									render={({ field }) => (
										<Field data-invalid={!!errors.warehouseId}>
											<Select
												value={field.value}
												onValueChange={field.onChange}
												dir="rtl"
												disabled={isCreating}
											>
												<SelectTrigger className="text-sm">
													<SelectValue placeholder="اختر المستودع..." />
												</SelectTrigger>
												<SelectContent dir="rtl">
													{warehouses.map((w) => (
														<SelectItem
															key={w.id}
															value={w.id}
														>
															{w.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FieldError errors={[errors.warehouseId]} />
										</Field>
									)}
								/>
							</div>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label className="text-sm font-medium">تاريخ التوريد المتوقّع</Label>
							<Input
								type="date"
								className="text-sm"
								disabled={isCreating}
								{...register("expectedAt")}
							/>
						</div>
					</div>

					<Separator />

					{/* المنتجات */}
					<div className="flex flex-col gap-3">
						<div className="flex items-center justify-between">
							<SectionTitle>المنتجات</SectionTitle>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => append({ itemId: "", qtyOrdered: 1, unitCost: 0 })}
								disabled={isCreating}
							>
								<IconPlus className="size-3.5" />
								إضافة سطر
							</Button>
						</div>

						{typeof errors.lines?.message === "string" && (
							<span className="text-xs text-destructive">{errors.lines.message}</span>
						)}

						{/* رؤوس */}
						<div className="grid grid-cols-[1fr_72px_92px_auto] gap-2 text-[11px] text-muted-foreground">
							<span>المنتج</span>
							<span>الكمية</span>
							<span>التكلفة</span>
							<span />
						</div>

						<div className="flex flex-col gap-2.5">
							{fields.map((f, i) => (
								<div
									key={f.id}
									className="grid grid-cols-[1fr_72px_92px_auto] items-start gap-2"
								>
									<Controller
										name={`lines.${i}.itemId`}
										control={control}
										render={({ field }) => (
											<Field data-invalid={!!errors.lines?.[i]?.itemId}>
												<Select
													value={field.value}
													onValueChange={field.onChange}
													dir="rtl"
													disabled={isCreating}
												>
													<SelectTrigger className="text-sm">
														<SelectValue placeholder="اختر المنتج..." />
													</SelectTrigger>
													<SelectContent dir="rtl">
														{inventory.map((p) => (
															<SelectItem
																key={p.id}
																value={p.id}
															>
																{p.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FieldError errors={[errors.lines?.[i]?.itemId]} />
											</Field>
										)}
									/>
									<Field data-invalid={!!errors.lines?.[i]?.qtyOrdered}>
										<Input
											type="number"
											min={1}
											className="text-sm"
											disabled={isCreating}
											{...register(`lines.${i}.qtyOrdered`)}
										/>
										<FieldError errors={[errors.lines?.[i]?.qtyOrdered]} />
									</Field>
									<Field data-invalid={!!errors.lines?.[i]?.unitCost}>
										<Input
											type="number"
											min={0}
											step="0.01"
											className="text-sm"
											disabled={isCreating}
											{...register(`lines.${i}.unitCost`)}
										/>
										<FieldError errors={[errors.lines?.[i]?.unitCost]} />
									</Field>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="size-9 text-destructive"
										onClick={() => remove(i)}
										disabled={isCreating || fields.length === 1}
									>
										<IconTrash className="size-4" />
									</Button>
								</div>
							))}
						</div>

						<div className="flex items-center justify-between rounded-md bg-muted px-3 py-2">
							<span className="text-sm font-semibold tabular-nums">
								{total.toLocaleString("ar-EG")} ر.س
							</span>
							<span className="text-sm text-muted-foreground">الإجمالي التقديري</span>
						</div>
					</div>

					<Separator />

					<div className="flex flex-col gap-1.5">
						<Label className="text-sm font-medium">ملاحظات</Label>
						<Textarea
							placeholder="ملاحظات على الأمر..."
							className="min-h-16 resize-none text-sm"
							disabled={isCreating}
							{...register("notes")}
						/>
					</div>
				</form>

				<div
					className="flex items-center gap-2 border-t px-4 py-2"
					dir="ltr"
				>
					<Button
						type="submit"
						form="po-form"
						size="sm"
						disabled={isCreating || !isValid}
					>
						<IconShoppingCart className="size-3.5" />
						إنشاء الأمر
					</Button>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onClose}
						disabled={isCreating}
					>
						إلغاء
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}
