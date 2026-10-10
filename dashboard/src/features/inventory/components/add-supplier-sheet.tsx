import { zodResolver } from "@hookform/resolvers/zod";
import { IconBuildingStore, IconUpload } from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useState } from "react";
import { Controller, type Resolver, type SubmitHandler, useForm } from "react-hook-form";

import { FieldLabel } from "@/components/common/field-label";
import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { Button } from "@/components/ui/button";
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { INVENTORY_CATEGORY_OPTIONS } from "@/features/inventory/data/constants";
import { useCreateSupplier } from "@/features/inventory/hooks/use-create-supplier";
import { useInventory } from "@/features/inventory/hooks/use-inventory";
import { useFormProgress } from "@/hooks/use-form-progress";
import {
	type CreateSupplierFormInput,
	createSupplierSchema,
	type SupplierResponse,
} from "@sanad/contracts/runtime/server/suppliers/suppliers.type";

const SUPPLIER_TYPES = ["مصنّع", "موزّع", "تاجر جملة", "مستورد", "أخرى"];

interface AddSupplierSheetProps {
	open: boolean;
	onClose: () => void;
	onCreated?: (supplier: SupplierResponse) => void;
	/** يفتحها كـ sheet عادي (overlay، بلا إزاحة) بدل الوضع المجاور لشاشة المنتج */
	standalone?: boolean;
}

function SectionTitle({ children }: { children: string }) {
	return <h3 className="text-[13px] font-semibold text-[#08090A]">{children}</h3>;
}

export function AddSupplierSheet({
	open,
	onClose,
	onCreated,
	standalone = false,
}: AddSupplierSheetProps) {
	const { createSupplier, isPending } = useCreateSupplier();
	const { inventory } = useInventory();
	const [continueAdding, setContinueAdding] = useState(false);

	const {
		register,
		handleSubmit,
		control,
		reset,
		watch,
		formState: { errors, isValid },
	} = useForm<CreateSupplierFormInput>({
		resolver: zodResolver(createSupplierSchema) as Resolver<CreateSupplierFormInput>,
		mode: "onChange",
		defaultValues: { categories: [], products: [], supportsReturns: false },
	});

	const values = watch();
	const formProgress = useFormProgress({ schema: createSupplierSchema, values });

	const onSubmit: SubmitHandler<CreateSupplierFormInput> = async (data) => {
		const supplier = await createSupplier(data);
		reset({ categories: [], products: [], supportsReturns: false });
		onCreated?.(supplier);
		if (continueAdding) return;
		onClose();
	};

	useHotkey("Mod+Enter", () => handleSubmit(onSubmit)(), { enabled: open });

	return (
		<Sheet
			open={open}
			modal={standalone ? undefined : false}
			onOpenChange={(o) => {
				if (!o) onClose();
			}}
		>
			<SheetContent
				side="left"
				showCloseButton={false}
				showOverlay={standalone}
				onInteractOutside={standalone ? undefined : (e) => e.preventDefault()}
				// في وضع المنتج: تُفتح على يمين شاشة المنتج (605px + فجوة ~16px). في الوضع المستقل: sheet عادي.
				style={standalone ? undefined : { left: "621px", right: "auto" }}
				className="flex w-full flex-col gap-0 p-0 shadow-xl sm:max-w-[620px]!"
			>
				<FormHeader
					title="إضافة مورد جديد"
					progress={formProgress}
					onClose={onClose}
				/>

				<form
					id="add-supplier-form"
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-4"
					dir="rtl"
				>
					{/* ─── معلومات الأساسية ─── */}
					<div className="flex flex-col gap-3">
						<SectionTitle>معلومات الأساسية</SectionTitle>

						<div className="grid grid-cols-2 gap-3">
							<div className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium">شعار المورد</Label>
								<button
									type="button"
									className="flex h-9 items-center justify-center gap-2 rounded-md border border-dashed border-input text-sm text-muted-foreground"
								>
									<IconUpload className="size-4" />
									رفع شعار
								</button>
							</div>
							<div className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium">المعرّف</Label>
								<Input
									value="يُولد تلقائيًا"
									disabled
									className="text-sm"
								/>
							</div>
						</div>

						<div className="flex flex-col gap-1.5">
							<FieldLabel required>
								<Label className="text-sm font-medium">اسم المورد القانوني</Label>
							</FieldLabel>
							<Field data-invalid={!!errors.legalName}>
								<Input
									placeholder="مثال: شركة للتجارة للأدوية"
									className="text-sm"
									aria-invalid={!!errors.legalName}
									disabled={isPending}
									{...register("legalName")}
								/>
								<FieldError errors={[errors.legalName]} />
							</Field>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label className="text-sm font-medium">نوع المورد</Label>
								</FieldLabel>
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
													<SelectValue placeholder="اختر..." />
												</SelectTrigger>
												<SelectContent dir="rtl">
													{SUPPLIER_TYPES.map((t) => (
														<SelectItem
															key={t}
															value={t}
														>
															{t}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FieldError errors={[errors.type]} />
										</Field>
									)}
								/>
							</div>
							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label className="text-sm font-medium">رقم السجل التجاري</Label>
								</FieldLabel>
								<Field data-invalid={!!errors.commercialReg}>
									<Input
										placeholder="مثال: 123476"
										className="text-sm"
										aria-invalid={!!errors.commercialReg}
										disabled={isPending}
										{...register("commercialReg")}
									/>
									<FieldError errors={[errors.commercialReg]} />
								</Field>
							</div>
						</div>

						<div className="flex flex-col gap-1.5">
							<FieldLabel required>
								<Label className="text-sm font-medium">كود المورد</Label>
							</FieldLabel>
							<Field data-invalid={!!errors.supplierCode}>
								<Input
									placeholder="مثال: 123476"
									className="text-sm"
									aria-invalid={!!errors.supplierCode}
									disabled={isPending}
									{...register("supplierCode")}
								/>
								<FieldError errors={[errors.supplierCode]} />
							</Field>
						</div>
					</div>

					<Separator />

					{/* ─── الوصف ─── */}
					<div className="flex flex-col gap-3">
						<SectionTitle>الوصف</SectionTitle>
						<Textarea
							placeholder="أضف نبذة عن المورد..."
							className="min-h-20 resize-none text-sm"
							disabled={isPending}
							{...register("description")}
						/>
					</div>

					<Separator />

					{/* ─── معلومات التوريد ─── */}
					<div className="flex flex-col gap-3">
						<SectionTitle>معلومات التوريد</SectionTitle>

						<div className="grid grid-cols-2 gap-3">
							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label className="text-sm font-medium">الفئات التي يوفرها</Label>
								</FieldLabel>
								<Controller
									name="categories"
									control={control}
									render={({ field }) => (
										<Field data-invalid={!!errors.categories}>
											<Combobox
												multiple
												value={field.value ?? []}
												onValueChange={(v) => field.onChange(v ?? [])}
											>
												<ComboboxChips>
													{(field.value ?? []).map((val) => {
														const opt = INVENTORY_CATEGORY_OPTIONS.find(
															(o) => o.value === val,
														);
														return (
															<ComboboxChip
																key={val}
																value={val}
															>
																{opt?.label ?? val}
															</ComboboxChip>
														);
													})}
													<ComboboxChipsInput placeholder="اختر..." />
												</ComboboxChips>
												<ComboboxContent>
													<ComboboxList>
														{INVENTORY_CATEGORY_OPTIONS.map((opt) => (
															<ComboboxItem
																key={opt.value}
																value={opt.value}
															>
																{opt.label}
															</ComboboxItem>
														))}
													</ComboboxList>
												</ComboboxContent>
											</Combobox>
											<FieldError
												errors={[
													errors.categories?.root ??
														(errors.categories as { message?: string } | undefined),
												]}
											/>
										</Field>
									)}
								/>
							</div>

							<div className="flex flex-col gap-1.5">
								<FieldLabel>
									<Label className="text-sm font-medium">المنتجات التي يوردها</Label>
								</FieldLabel>
								<Controller
									name="products"
									control={control}
									render={({ field }) => (
										<Field data-invalid={!!errors.products}>
											<Combobox
												multiple
												value={field.value ?? []}
												onValueChange={(v) => field.onChange(v ?? [])}
											>
												<ComboboxChips>
													{(field.value ?? []).map((id) => {
														const p = inventory.find((x) => x.id === id);
														return (
															<ComboboxChip
																key={id}
																value={id}
															>
																{p?.name ?? id}
															</ComboboxChip>
														);
													})}
													<ComboboxChipsInput placeholder="اختر..." />
												</ComboboxChips>
												<ComboboxContent>
													<ComboboxList>
														{inventory.length === 0 ? (
															<ComboboxEmpty>لا توجد منتجات</ComboboxEmpty>
														) : (
															inventory.map((p) => (
																<ComboboxItem
																	key={p.id}
																	value={p.id}
																>
																	{p.name}
																</ComboboxItem>
															))
														)}
													</ComboboxList>
												</ComboboxContent>
											</Combobox>
											<FieldError
												errors={[
													errors.products?.root ??
														(errors.products as { message?: string } | undefined),
												]}
											/>
										</Field>
									)}
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label className="text-sm font-medium">مدة التوريد المتوقعة</Label>
								</FieldLabel>
								<Field data-invalid={!!errors.leadTimeDays}>
									<Input
										type="number"
										min={0}
										placeholder="مثال: 4 أيام عمل"
										className="text-sm"
										aria-invalid={!!errors.leadTimeDays}
										disabled={isPending}
										{...register("leadTimeDays")}
									/>
									<FieldError errors={[errors.leadTimeDays]} />
								</Field>
							</div>
							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label className="text-sm font-medium">الحد الأدنى للطلب</Label>
								</FieldLabel>
								<Field data-invalid={!!errors.minOrderQty}>
									<Input
										type="number"
										min={0}
										placeholder="مثال: 100 وحدة"
										className="text-sm"
										aria-invalid={!!errors.minOrderQty}
										disabled={isPending}
										{...register("minOrderQty")}
									/>
									<FieldError errors={[errors.minOrderQty]} />
								</Field>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<Controller
								name="supportsReturns"
								control={control}
								render={({ field }) => (
									<Switch
										id="supports-returns"
										checked={field.value}
										onCheckedChange={field.onChange}
										disabled={isPending}
									/>
								)}
							/>
							<Label
								htmlFor="supports-returns"
								className="cursor-pointer text-sm font-normal text-muted-foreground"
							>
								يدعم الإرجاعات
							</Label>
						</div>
					</div>

					<Separator />

					{/* ─── سياسة الاستبدال ─── */}
					<div className="flex flex-col gap-3">
						<SectionTitle>سياسة الاستبدال</SectionTitle>
						<Textarea
							placeholder="أضف سياسة الاستبدال..."
							className="min-h-20 resize-none text-sm"
							disabled={isPending}
							{...register("returnPolicy")}
						/>
					</div>

					<Separator />

					{/* ─── معلومات التواصل ─── */}
					<div className="flex flex-col gap-3">
						<SectionTitle>معلومات التواصل</SectionTitle>

						<div className="grid grid-cols-2 gap-3">
							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label className="text-sm font-medium">اسم جهة الاتصال الأساسية</Label>
								</FieldLabel>
								<Field data-invalid={!!errors.contactName}>
									<Input
										placeholder="محمد عمر صلاح"
										className="text-sm"
										aria-invalid={!!errors.contactName}
										disabled={isPending}
										{...register("contactName")}
									/>
									<FieldError errors={[errors.contactName]} />
								</Field>
							</div>
							<div className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium">المسمى الوظيفي</Label>
								<Input
									placeholder="مثال: مدير الشركة"
									className="text-sm"
									disabled={isPending}
									{...register("contactTitle")}
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label className="text-sm font-medium">رقم الجوال</Label>
								</FieldLabel>
								<Field data-invalid={!!errors.phone}>
									<Controller
										name="phone"
										control={control}
										render={({ field }) => (
											<PhoneInput
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
								<Label className="text-sm font-medium">البريد الإلكتروني</Label>
								<Field data-invalid={!!errors.email}>
									<Input
										type="email"
										placeholder="محمد عمر صلاح"
										className="text-sm"
										disabled={isPending}
										{...register("email")}
									/>
									<FieldError errors={[errors.email]} />
								</Field>
							</div>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label className="text-sm font-medium">الموقع الإلكتروني</Label>
							<Input
								placeholder="مثال: www.united.com"
								className="text-sm"
								disabled={isPending}
								{...register("website")}
							/>
						</div>
					</div>

					<Separator />

					{/* ─── معلومات العنوان ─── */}
					<div className="flex flex-col gap-3">
						<SectionTitle>معلومات العنوان</SectionTitle>

						<div className="grid grid-cols-2 gap-3">
							<div className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium">الدولة</Label>
								<Input
									placeholder="اختر..."
									className="text-sm"
									disabled={isPending}
									{...register("country")}
								/>
							</div>
							<div className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium">المدينة</Label>
								<Input
									placeholder="اختر..."
									className="text-sm"
									disabled={isPending}
									{...register("city")}
								/>
							</div>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label className="text-sm font-medium">العنوان</Label>
							<Input
								placeholder="حي العزيزية"
								className="text-sm"
								disabled={isPending}
								{...register("address")}
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label className="text-sm font-medium">رابط الموقع على الخريطة</Label>
							<Input
								placeholder="مثال:"
								className="text-sm"
								disabled={isPending}
								{...register("mapUrl")}
							/>
						</div>
					</div>
				</form>

				<FormFooter
					continueAdding={continueAdding}
					onContinueAddingChange={setContinueAdding}
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
						form="add-supplier-form"
						size="sm"
						className="gap-1.5"
						disabled={isPending || !isValid}
					>
						<IconBuildingStore className="size-3.5" />
						إضافة المورد
					</Button>
				</FormFooter>
			</SheetContent>
		</Sheet>
	);
}
