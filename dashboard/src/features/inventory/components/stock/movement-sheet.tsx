import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowsExchange, IconPlus, IconTrash } from "@tabler/icons-react";
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
import { MOVEMENT_TYPE_OPTIONS } from "@/features/inventory/data/constants";
import { useCreateMovement } from "@/features/inventory/hooks/use-create-movement";
import { useInventory } from "@/features/inventory/hooks/use-inventory";
import { useWarehouses } from "@/features/inventory/hooks/use-warehouses";
import { useFormProgress } from "@/hooks/use-form-progress";
import {
	type StockMovementFormInput,
	stockMovementFormSchema,
} from "@sanad/contracts/runtime/server/stock/stock.type";

interface MovementSheetProps {
	open: boolean;
	onClose: () => void;
	/** نوع الحركة عند الفتح — مثل TRANSFER من صفحة إعدادات مستودع الفرع */
	initialType?: StockMovementFormInput["type"];
	/** المستودع المصدر المسبق للتحويل */
	initialFromWarehouseId?: string;
}

function SectionTitle({ children }: { children: string }) {
	return <h3 className="text-[13px] font-semibold text-[#08090A]">{children}</h3>;
}

export function MovementSheet({
	open,
	onClose,
	initialType,
	initialFromWarehouseId,
}: MovementSheetProps) {
	const { warehouses } = useWarehouses();
	const { inventory } = useInventory();
	const { createMovement, isPending } = useCreateMovement();

	const {
		register,
		handleSubmit,
		control,
		reset,
		watch,
		formState: { errors, isValid },
	} = useForm<StockMovementFormInput>({
		resolver: zodResolver(stockMovementFormSchema) as Resolver<StockMovementFormInput>,
		mode: "onChange",
		defaultValues: {
			type: initialType ?? "RECEIPT",
			fromWarehouseId: initialFromWarehouseId,
			lines: [{ itemId: "", qty: 1 }],
		},
	});

	const { fields, append, remove } = useFieldArray({ control, name: "lines" });
	const values = watch();
	const formProgress = useFormProgress({ schema: stockMovementFormSchema, values });
	const type = values.type;
	const isTransfer = type === "TRANSFER";

	useEffect(() => {
		if (!open) {
			reset({
				type: initialType ?? "RECEIPT",
				fromWarehouseId: initialFromWarehouseId,
				lines: [{ itemId: "", qty: 1 }],
			});
		}
	}, [open, initialType, initialFromWarehouseId, reset]);

	const onSubmit: SubmitHandler<StockMovementFormInput> = async (data) => {
		await createMovement(data);
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
				className="flex w-full flex-col gap-0 p-0 sm:max-w-140!"
			>
				<FormHeader
					title="حركة مخزون جديدة"
					progress={formProgress}
					onClose={onClose}
				/>

				<form
					id="movement-form"
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-4"
					dir="rtl"
				>
					{/* ─── نوع الحركة + المستودعات ─── */}
					<div className="flex flex-col gap-3">
						<SectionTitle>نوع الحركة</SectionTitle>

						<Controller
							name="type"
							control={control}
							render={({ field }) => (
								<Field data-invalid={!!errors.type}>
									<Select
										value={field.value}
										onValueChange={field.onChange}
										dir="rtl"
										disabled={isPending}
									>
										<SelectTrigger className="text-sm">
											<SelectValue placeholder="اختر نوع الحركة..." />
										</SelectTrigger>
										<SelectContent dir="rtl">
											{MOVEMENT_TYPE_OPTIONS.map((opt) => (
												<SelectItem
													key={opt.value}
													value={opt.value}
												>
													{opt.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FieldError errors={[errors.type]} />
								</Field>
							)}
						/>

						{isTransfer ? (
							<div className="grid grid-cols-2 gap-3">
								<div className="flex flex-col gap-1.5">
									<FieldLabel required>
										<Label className="text-sm font-medium">من مستودع</Label>
									</FieldLabel>
									<Controller
										name="fromWarehouseId"
										control={control}
										render={({ field }) => (
											<Field data-invalid={!!errors.fromWarehouseId}>
												<Select
													value={field.value}
													onValueChange={field.onChange}
													dir="rtl"
													disabled={isPending}
												>
													<SelectTrigger className="text-sm">
														<SelectValue placeholder="المصدر..." />
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
												<FieldError errors={[errors.fromWarehouseId]} />
											</Field>
										)}
									/>
								</div>
								<div className="flex flex-col gap-1.5">
									<FieldLabel required>
										<Label className="text-sm font-medium">إلى مستودع</Label>
									</FieldLabel>
									<Controller
										name="toWarehouseId"
										control={control}
										render={({ field }) => (
											<Field data-invalid={!!errors.toWarehouseId}>
												<Select
													value={field.value}
													onValueChange={field.onChange}
													dir="rtl"
													disabled={isPending}
												>
													<SelectTrigger className="text-sm">
														<SelectValue placeholder="الهدف..." />
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
												<FieldError errors={[errors.toWarehouseId]} />
											</Field>
										)}
									/>
								</div>
							</div>
						) : (
							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label className="text-sm font-medium">المستودع</Label>
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
												disabled={isPending}
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
						)}
					</div>

					<Separator />

					{/* ─── المنتجات ─── */}
					<div className="flex flex-col gap-3">
						<div className="flex items-center justify-between">
							<SectionTitle>المنتجات</SectionTitle>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => append({ itemId: "", qty: 1 })}
								disabled={isPending}
							>
								<IconPlus className="size-3.5" />
								إضافة سطر
							</Button>
						</div>

						{typeof errors.lines?.message === "string" && (
							<span className="text-xs text-destructive">{errors.lines.message}</span>
						)}

						<div className="flex flex-col gap-2.5">
							{fields.map((f, i) => (
								<div
									key={f.id}
									className="grid grid-cols-[1fr_92px_auto] items-start gap-2"
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
													disabled={isPending}
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
									<Field data-invalid={!!errors.lines?.[i]?.qty}>
										<Input
											type="number"
											min={1}
											placeholder="الكمية"
											className="text-sm"
											aria-invalid={!!errors.lines?.[i]?.qty}
											disabled={isPending}
											{...register(`lines.${i}.qty`)}
										/>
										<FieldError errors={[errors.lines?.[i]?.qty]} />
									</Field>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="size-9 text-destructive"
										onClick={() => remove(i)}
										disabled={isPending || fields.length === 1}
									>
										<IconTrash className="size-4" />
									</Button>
								</div>
							))}
						</div>
					</div>

					<Separator />

					{/* ─── ملاحظات ─── */}
					<div className="flex flex-col gap-1.5">
						<Label className="text-sm font-medium">ملاحظات</Label>
						<Textarea
							placeholder="سبب الحركة أو أي ملاحظة..."
							className="min-h-16 resize-none text-sm"
							disabled={isPending}
							{...register("note")}
						/>
					</div>
				</form>

				<div
					className="flex items-center gap-2 border-t px-4 py-2"
					dir="ltr"
				>
					<Button
						type="submit"
						form="movement-form"
						size="sm"
						disabled={isPending || !isValid}
					>
						<IconArrowsExchange className="size-3.5" />
						تنفيذ الحركة
					</Button>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onClose}
						disabled={isPending}
					>
						إلغاء
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}
