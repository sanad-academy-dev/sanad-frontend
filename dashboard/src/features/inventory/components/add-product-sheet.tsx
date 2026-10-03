import { zodResolver } from "@hookform/resolvers/zod";
import { IconCertificate, IconPackage, IconPencil, IconVaccine } from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useEffect, useState } from "react";
import { Controller, type Resolver, type SubmitHandler, useForm } from "react-hook-form";

import { FieldLabel } from "@/components/common/field-label";
import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useItemTaxTemplates } from "@/features/accounting/taxes/hooks/use-taxes";
import { CatalogPickerSheet } from "@/features/inventory/components/catalog/catalog-picker-sheet";
import { SupplierField } from "@/features/inventory/components/supplier-field";
import { UnsavedChangesDialog } from "@/features/inventory/components/unsaved-changes-dialog";
import { INVENTORY_CATEGORY_OPTIONS } from "@/features/inventory/data/constants";
import { useCreateInventory } from "@/features/inventory/hooks/use-create-inventory";
import { useUpdateInventory } from "@/features/inventory/hooks/use-update-inventory";
import { useWarehouses } from "@/features/inventory/hooks/use-warehouses";
import { useFormProgress } from "@/hooks/use-form-progress";
import {
	type CatalogProductResponse,
	toCatalogPrefill,
} from "@sanad/contracts/runtime/server/drug-catalog/drug-catalog.type";
import {
	type CreateInventoryFormInput,
	createInventorySchema,
	type InventoryResponse,
} from "@sanad/contracts/runtime/server/inventory/inventory.type";

interface AddProductSheetProps {
	open: boolean;
	onClose: () => void;
	product?: InventoryResponse | null;
	readOnly?: boolean;
}

// التواريخ تصل كنص ISO عبر JSON — نقتطع جزء التاريخ لحقل <input type="date">
const toDateInput = (value: InventoryResponse["productionDate"]) =>
	value ? new Date(value).toISOString().slice(0, 10) : "";

function SectionTitle({ children }: { children: string }) {
	return <h3 className="text-[13px] font-semibold text-[#08090A]">{children}</h3>;
}

/** Select لا يقبل قيمة فارغة — صفٌّ حارس يُترجَم إلى null عند الاختيار. */
const NO_ITEM_TAX_TEMPLATE = "__none__";

export function AddProductSheet({
	open,
	onClose,
	product,
	readOnly = false,
}: AddProductSheetProps) {
	const isEdit = !!product && !readOnly;
	const [saveAndContinue, setSaveAndContinue] = useState(false);
	const [unsavedOpen, setUnsavedOpen] = useState(false);
	const [catalogOpen, setCatalogOpen] = useState(false);
	// ملخّص التسجيل المرتبط — يُعرض بجانب الاسم بعد الاختيار من الكتالوج
	const [catalogLink, setCatalogLink] = useState<{
		registerNumber: string;
		standardName: string;
	} | null>(null);

	const { createInventory, isPending: isCreating } = useCreateInventory();
	const { updateInventory, isPending: isUpdating } = useUpdateInventory();
	const { warehouses } = useWarehouses();
	// القوالب المعطَّلة لا تُعرض — لا معنى لإسنادها إلى صنف
	const { rows: allItemTaxTemplates } = useItemTaxTemplates();
	const itemTaxTemplates = allItemTaxTemplates.filter((template) => !template.disabled);
	const isPending = isCreating || isUpdating;

	const activeWarehouses = warehouses.filter((w) => w.active);

	const {
		register,
		handleSubmit,
		control,
		reset,
		watch,
		setValue,
		formState: { errors, isValid, isDirty, dirtyFields },
	} = useForm<CreateInventoryFormInput>({
		resolver: zodResolver(createInventorySchema) as Resolver<CreateInventoryFormInput>,
		mode: "onChange",
		defaultValues: { active: true },
	});

	const modifiedFields = Object.keys(dirtyFields);

	// عند الإغلاق في وضع التعديل مع وجود تغييرات → نطلب التأكيد بدل الإغلاق المباشر
	const requestClose = () => {
		if (isEdit && isDirty) {
			setUnsavedOpen(true);
			return;
		}
		onClose();
	};

	const discardAndClose = () => {
		setUnsavedOpen(false);
		reset({ active: true });
		onClose();
	};

	useEffect(() => {
		if (open && product) {
			reset({
				name: product.name,
				category: product.category,
				supplier: product.supplier ?? "",
				sku: product.sku ?? "",
				barcode: product.barcode ?? "",
				stock: product.stock,
				reorderPoint: product.reorderPoint,
				maxQuantity: product.maxQuantity ?? undefined,
				unitCost: product.unitCost != null ? Number(product.unitCost) : undefined,
				price: Number(product.price),
				expiryDate: toDateInput(product.expiryDate),
				location: product.location ?? "",
				notes: product.notes ?? "",
				tracksBatches: product.tracksBatches,
				active: product.active,
				catalogProductId: product.catalogProductId ?? undefined,
				itemTaxTemplateId: product.itemTaxTemplateId ?? null,
			});
			setCatalogLink(
				product.catalogProduct
					? {
							registerNumber: product.catalogProduct.registerNumber,
							standardName: product.catalogProduct.standard.nameAr,
						}
					: null,
			);
		} else if (!open) {
			reset({ active: true });
			setCatalogLink(null);
		}
	}, [open, product, reset]);

	const values = watch();
	const formProgress = useFormProgress({ schema: createInventorySchema, values });

	// يملأ الوصف من التسجيل الرسمي فقط: الاسم، الشركة الصانعة، وتفاصيل المستحضر.
	// السعر والكمية والصلاحية بيانات تجارية خاصة بالأكاديمية ولا يعرفها السجل.
	const applyCatalogProduct = (catalogProduct: CatalogProductResponse) => {
		const prefill = toCatalogPrefill(catalogProduct);

		setValue("name", prefill.tradeName, { shouldDirty: true, shouldValidate: true });
		setValue("catalogProductId", prefill.catalogProductId, { shouldDirty: true });
		if (prefill.manufacturerName) {
			setValue("supplier", prefill.manufacturerName, { shouldDirty: true });
		}

		// المادة الفعّالة وتفاصيل الشكل الصيدلاني تُحفظ في الملاحظات — لا عمود لها
		// على صنف المخزون، وضياعها يعني فقدان أهم ما يميّز المستحضر.
		const details = [
			`المادة الفعّالة: ${prefill.genericName}`,
			prefill.strengthLabel ? `التركيز: ${prefill.strengthLabel}` : null,
			prefill.dosageForm ? `الشكل: ${prefill.dosageForm}` : null,
			prefill.routeOfAdministration ? `طريق الإعطاء: ${prefill.routeOfAdministration}` : null,
			prefill.packageLabel ? `العبوة: ${prefill.packageLabel}` : null,
			`رقم التسجيل: ${catalogProduct.registerNumber} (${catalogProduct.standard.nameAr})`,
		]
			.filter(Boolean)
			.join("\n");
		setValue("notes", details, { shouldDirty: true });

		setCatalogLink({
			registerNumber: catalogProduct.registerNumber,
			standardName: catalogProduct.standard.nameAr,
		});
	};

	const onSubmit: SubmitHandler<CreateInventoryFormInput> = async (data) => {
		if (isEdit) {
			await updateInventory(product.id, {
				name: data.name,
				category: data.category,
				supplier: data.supplier,
				sku: data.sku || null,
				barcode: data.barcode || null,
				reorderPoint: data.reorderPoint,
				maxQuantity: data.maxQuantity ?? null,
				unitCost: data.unitCost ?? null,
				price: data.price,
				expiryDate: data.expiryDate || null,
				location: data.location || null,
				notes: data.notes || null,
				tracksBatches: data.tracksBatches,
				active: data.active,
				itemTaxTemplateId: data.itemTaxTemplateId ?? null,
			});
			reset({ active: true });
			onClose();
			return;
		}
		await createInventory(data);
		reset({ active: true });
		if (!saveAndContinue) onClose();
	};

	useHotkey("Mod+Enter", () => handleSubmit(onSubmit)(), {
		enabled: open && !readOnly,
	});

	const title = readOnly
		? "بيانات المنتج"
		: isEdit
			? "تعديل بيانات المنتج"
			: "إضافة منتج جديد";

	return (
		<Sheet
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) requestClose();
			}}
		>
			<SheetContent
				side="left"
				showCloseButton={false}
				className="flex w-full flex-col gap-0 p-0 sm:max-w-[605px]!"
			>
				<FormHeader
					title={title}
					identity={product ? { name: product.name, code: product.code } : null}
					changesCount={product?.editsCount ?? 0}
					progress={readOnly ? null : formProgress}
					onClose={requestClose}
				/>

				<form
					id="add-product-form"
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-4"
					dir="rtl"
				>
					{/* ─── معلومات الأساسية ─── */}
					<div className="flex flex-col gap-3">
						<div className="flex items-center justify-between gap-2">
							<SectionTitle>معلومات الأساسية</SectionTitle>
							{!readOnly && (
								<Button
									type="button"
									variant="outline"
									size="sm"
									disabled={isPending}
									onClick={() => setCatalogOpen(true)}
								>
									<IconVaccine className="size-4" />
									اختيار من الكتالوج المسجَّل
								</Button>
							)}
						</div>

						{catalogLink && (
							<div className="flex items-center gap-1.5 rounded-[4px] border border-border bg-muted/40 px-3 py-2 text-xs">
								<IconCertificate className="size-3.5 shrink-0 text-muted-foreground" />
								<span className="text-muted-foreground">
									مرتبط بتسجيل {catalogLink.registerNumber} — {catalogLink.standardName}
								</span>
							</div>
						)}

						<div className="flex flex-col gap-1.5">
							<div className="flex items-center justify-between">
								<FieldLabel required={!readOnly}>
									<Label className="text-sm font-medium">اسم المنتج</Label>
								</FieldLabel>
								<span className="text-xs text-muted-foreground">
									المعرّف: {product?.code ?? "يُولد تلقائيًا"}
								</span>
							</div>
							<Field data-invalid={!!errors.name}>
								<Input
									placeholder="مثال: Amoxicillin 250mg"
									className="text-sm"
									aria-invalid={!!errors.name}
									disabled={isPending || readOnly}
									{...register("name")}
								/>
								<FieldError errors={[errors.name]} />
							</Field>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div className="flex flex-col gap-1.5">
								<FieldLabel required={!readOnly}>
									<Label className="text-sm font-medium">الفئة</Label>
								</FieldLabel>
								<Controller
									name="category"
									control={control}
									render={({ field }) => (
										<Field data-invalid={!!errors.category}>
											<Select
												value={field.value}
												onValueChange={readOnly ? undefined : field.onChange}
												dir="rtl"
												disabled={isPending || readOnly}
											>
												<SelectTrigger className="text-sm">
													<SelectValue placeholder="اختر..." />
												</SelectTrigger>
												<SelectContent dir="rtl">
													<SelectGroup>
														<SelectLabel className="text-muted-foreground">
															حدّد فئة المنتج...
														</SelectLabel>
														{INVENTORY_CATEGORY_OPTIONS.map((opt) => (
															<SelectItem
																key={opt.value}
																value={opt.value}
															>
																{opt.label}
															</SelectItem>
														))}
													</SelectGroup>
												</SelectContent>
											</Select>
											<FieldError errors={[errors.category]} />
										</Field>
									)}
								/>
							</div>

							<div className="flex flex-col gap-1.5">
								<FieldLabel>
									<Label className="text-sm font-medium">المورد</Label>
								</FieldLabel>
								<Controller
									name="supplier"
									control={control}
									render={({ field }) => (
										<Field data-invalid={!!errors.supplier}>
											<SupplierField
												value={field.value}
												onChange={field.onChange}
												disabled={isPending || readOnly}
												invalid={!!errors.supplier}
											/>
											<FieldError errors={[errors.supplier]} />
										</Field>
									)}
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium">رمز المنتج (SKU)</Label>
								<Input
									placeholder="مثال: AMX250"
									className="text-sm"
									disabled={isPending || readOnly}
									{...register("sku")}
								/>
							</div>

							<div className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium">الباركود</Label>
								<Input
									placeholder="0127564849302020"
									className="text-sm"
									disabled={isPending || readOnly}
									{...register("barcode")}
								/>
							</div>
						</div>
					</div>

					<Separator />

					{/* ─── التسعير ─── */}
					<div className="flex flex-col gap-3">
						<SectionTitle>التسعير</SectionTitle>

						<div className="grid grid-cols-3 gap-3">
							<div className="flex flex-col gap-1.5">
								<FieldLabel required={!readOnly && !isEdit}>
									<Label className="text-sm font-medium">
										{isEdit ? "الكمية الحالية" : "الكمية الافتتاحية"}
									</Label>
								</FieldLabel>
								<Field data-invalid={!!errors.stock}>
									<Input
										type="number"
										min={0}
										placeholder="مثال: 10"
										className="text-sm"
										aria-invalid={!!errors.stock}
										disabled={isPending || readOnly || isEdit}
										{...register("stock")}
									/>
									{isEdit ? (
										<span className="text-[10px] text-muted-foreground">
											تُعدّل عبر الحركات والجرد فقط
										</span>
									) : (
										<FieldError errors={[errors.stock]} />
									)}
								</Field>
							</div>

							<div className="flex flex-col gap-1.5">
								<FieldLabel required={!readOnly}>
									<Label className="text-sm font-medium">نقطة إعادة الطلب</Label>
								</FieldLabel>
								<Field data-invalid={!!errors.reorderPoint}>
									<Input
										type="number"
										min={0}
										placeholder="حد الكمية..."
										className="text-sm"
										aria-invalid={!!errors.reorderPoint}
										disabled={isPending || readOnly}
										{...register("reorderPoint")}
									/>
									<FieldError errors={[errors.reorderPoint]} />
								</Field>
							</div>

							<div className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium">الحد الأقصى</Label>
								<Field data-invalid={!!errors.maxQuantity}>
									<Input
										type="number"
										min={0}
										placeholder="مثال: 100"
										className="text-sm"
										disabled={isPending || readOnly}
										{...register("maxQuantity")}
									/>
									<FieldError errors={[errors.maxQuantity]} />
								</Field>
							</div>
						</div>

						{/* [P12B.3] قالب ضريبة الصنف — يتجاوز نسبة قالب المستند لهذا الصنف في
						    نقطة البيع. بدونه لا يمكن لسلّة فيها صنف معفى وصنف خاضع أن تكون
						    صحيحة: القالب العامّ يفرض نسبةً واحدة على الجميع. */}
						<div className="flex flex-col gap-1.5">
							<Label className="text-sm font-medium">قالب ضريبة الصنف</Label>
							<Controller
								name="itemTaxTemplateId"
								control={control}
								render={({ field }) => (
									<Field data-invalid={!!errors.itemTaxTemplateId}>
										<Select
											value={field.value ?? NO_ITEM_TAX_TEMPLATE}
											onValueChange={(value) =>
												field.onChange(value === NO_ITEM_TAX_TEMPLATE ? null : value)
											}
											dir="rtl"
											disabled={isPending || readOnly}
										>
											<SelectTrigger className="text-sm">
												<SelectValue placeholder="نسبة قالب المستند" />
											</SelectTrigger>
											<SelectContent dir="rtl">
												<SelectGroup>
													<SelectLabel className="text-muted-foreground">
														يتجاوز نسبة قالب الضريبة العامّ لهذا الصنف وحده
													</SelectLabel>
													<SelectItem value={NO_ITEM_TAX_TEMPLATE}>
														— نسبة قالب المستند —
													</SelectItem>
													{itemTaxTemplates.map((template) => (
														<SelectItem
															key={template.id}
															value={template.id}
														>
															{template.title}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
										<FieldError errors={[errors.itemTaxTemplateId]} />
									</Field>
								)}
							/>
						</div>

						{/* مستودع الرصيد الافتتاحي — عند الإنشاء فقط؛ الكمية بعدها تُدار عبر الحركات */}
						{!isEdit && !readOnly && (
							<div className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium">مستودع الرصيد الافتتاحي</Label>
								<Controller
									name="warehouseId"
									control={control}
									render={({ field }) => (
										<Field data-invalid={!!errors.warehouseId}>
											<Select
												value={field.value ?? undefined}
												onValueChange={field.onChange}
												dir="rtl"
												disabled={isPending}
											>
												<SelectTrigger className="text-sm">
													<SelectValue placeholder="المستودع الافتراضي" />
												</SelectTrigger>
												<SelectContent dir="rtl">
													<SelectGroup>
														<SelectLabel className="text-muted-foreground">
															اختر مستودع استلام الكمية الافتتاحية...
														</SelectLabel>
														{activeWarehouses.map((warehouse) => (
															<SelectItem
																key={warehouse.id}
																value={warehouse.id}
															>
																{warehouse.name}
																{warehouse.isDefault ? " (الافتراضي)" : ""}
															</SelectItem>
														))}
													</SelectGroup>
												</SelectContent>
											</Select>
											<FieldError errors={[errors.warehouseId]} />
										</Field>
									)}
								/>
							</div>
						)}

						<div className="grid grid-cols-2 gap-3">
							<div className="flex flex-col gap-1.5">
								<FieldLabel required={!readOnly}>
									<Label className="text-sm font-medium">تكلفة الوحدة (ر.س)</Label>
								</FieldLabel>
								<Field data-invalid={!!errors.unitCost}>
									<Input
										type="number"
										min={0}
										step="0.01"
										placeholder="مثال: 100 ر.س"
										className="text-sm"
										aria-invalid={!!errors.unitCost}
										disabled={isPending || readOnly}
										{...register("unitCost")}
									/>
									<FieldError errors={[errors.unitCost]} />
								</Field>
							</div>

							<div className="flex flex-col gap-1.5">
								<FieldLabel required={!readOnly}>
									<Label className="text-sm font-medium">سعر البيع (ر.س)</Label>
								</FieldLabel>
								<Field data-invalid={!!errors.price}>
									<Input
										type="number"
										min={0}
										step="0.01"
										placeholder="مثال: 100 ر.س"
										className="text-sm"
										aria-invalid={!!errors.price}
										disabled={isPending || readOnly}
										{...register("price")}
									/>
									<FieldError errors={[errors.price]} />
								</Field>
							</div>
						</div>
					</div>

					<Separator />

					{/* ─── تفاصيل إضافية ─── */}
					<div className="flex flex-col gap-3">
						<SectionTitle>تفاصيل إضافية</SectionTitle>

						<div className="grid grid-cols-2 gap-3">
							<div className="flex flex-col gap-1.5">
								<FieldLabel required={!readOnly}>
									<Label className="text-sm font-medium">تاريخ مدة الصلاحية</Label>
								</FieldLabel>
								<Field data-invalid={!!errors.expiryDate}>
									<Input
										type="date"
										className="text-sm"
										aria-invalid={!!errors.expiryDate}
										disabled={isPending || readOnly}
										{...register("expiryDate")}
									/>
									<FieldError errors={[errors.expiryDate]} />
								</Field>
							</div>

							<div className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium">موقع المنتج</Label>
								<Input
									placeholder="مثال: رف A صف 3"
									className="text-sm"
									disabled={isPending || readOnly}
									{...register("location")}
								/>
							</div>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label className="text-sm font-medium">ملاحظات</Label>
							<Textarea
								placeholder="أضف أي ملاحظات للمنتج..."
								className="min-h-20 resize-none text-sm"
								disabled={isPending || readOnly}
								{...register("notes")}
							/>
						</div>

						{/* تتبّع الدُفعات والصلاحية */}
						<Controller
							name="tracksBatches"
							control={control}
							render={({ field }) => (
								<div className="flex items-center justify-between rounded-[4px] border border-[#E5E5E5] p-3">
									<div className="flex flex-col gap-0.5">
										<Label className="text-sm font-medium">تتبّع الدُفعات والصلاحية</Label>
										<span className="text-xs text-muted-foreground">
											يُنشئ دفعة عند كل استلام ويصرف الأقرب انتهاءً أولًا (FEFO)
										</span>
									</div>
									<Switch
										checked={field.value ?? false}
										onCheckedChange={readOnly ? undefined : field.onChange}
										disabled={isPending || readOnly}
									/>
								</div>
							)}
						/>
					</div>
				</form>

				{/* الفوتر */}
				<FormFooter
					continueAdding={saveAndContinue}
					onContinueAddingChange={readOnly || isEdit ? undefined : setSaveAndContinue}
					disabled={isPending}
					showShortcut={!readOnly}
				>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={readOnly ? onClose : requestClose}
						disabled={isPending}
					>
						{readOnly ? "إغلاق" : "إلغاء"}
					</Button>
					{!readOnly && (
						<Button
							type="submit"
							form="add-product-form"
							size="sm"
							disabled={isPending || !isValid}
						>
							{isEdit ? (
								<>
									<IconPencil className="size-3.5" />
									حفظ التعديلات
								</>
							) : (
								<>
									<IconPackage className="size-3.5" />
									أضف المنتج
								</>
							)}
						</Button>
					)}
				</FormFooter>
			</SheetContent>

			<UnsavedChangesDialog
				open={unsavedOpen}
				productName={product?.name}
				productCode={product?.code}
				modifiedFields={modifiedFields}
				onResume={() => setUnsavedOpen(false)}
				onDiscard={discardAndClose}
			/>

			<CatalogPickerSheet
				open={catalogOpen}
				onClose={() => setCatalogOpen(false)}
				onSelect={applyCatalogProduct}
			/>
		</Sheet>
	);
}
