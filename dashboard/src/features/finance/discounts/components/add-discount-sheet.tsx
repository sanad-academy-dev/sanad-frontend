import { zodResolver } from "@hookform/resolvers/zod";
import { IconCalendar } from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { arSA } from "date-fns/locale";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { useServicesForPicker } from "@/features/appointments/hooks/use-services-for-picker";
import {
	CUSTOMER_TYPE_OPTIONS,
	DISCOUNT_FORM_DEFAULTS,
	DISCOUNT_TYPE_OPTIONS,
} from "@/features/finance/discounts/data/discounts";
import {
	toDiscountPayload,
	useDiscountMutations,
} from "@/features/finance/discounts/hooks/use-discount-mutations";
import { useFormProgress } from "@/hooks/use-form-progress";
import { cn } from "@/lib/utils";
import {
	type DiscountFormInput,
	type DiscountFormValues,
	type DiscountResponse,
	discountFormSchema,
} from "@sanad/contracts/runtime/server/discounts/discounts.type";

const formatDate = (date: Date) =>
	new Intl.DateTimeFormat("ar-SA", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(date);

function DateField({
	value,
	onChange,
	placeholder,
	disabled,
}: {
	value: Date | null | undefined;
	onChange: (date: Date | null) => void;
	placeholder: string;
	disabled?: boolean;
}) {
	const [open, setOpen] = useState(false);
	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="outline"
					disabled={disabled}
					className={cn(
						"h-9 w-full justify-start gap-2 font-normal",
						!value && "text-muted-foreground",
					)}
				>
					<IconCalendar className="size-4 shrink-0" />
					<span className="truncate">{value ? formatDate(value) : placeholder}</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-auto p-0"
				align="start"
			>
				<Calendar
					mode="single"
					selected={value ?? undefined}
					onSelect={(date) => {
						onChange(date ?? null);
						setOpen(false);
					}}
					locale={arSA}
				/>
			</PopoverContent>
		</Popover>
	);
}

function SectionTitle({ children }: { children: string }) {
	return <h3 className="text-[13px] font-semibold text-foreground">{children}</h3>;
}

export function AddDiscountSheet({
	open,
	onOpenChange,
	discount,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	discount?: DiscountResponse | null;
}) {
	const isEdit = !!discount;
	const { services, isLoading: isLoadingServices } = useServicesForPicker();
	const { create, update, isSaving } = useDiscountMutations();
	const [continueAdding, setContinueAdding] = useState(false);

	const form = useForm<DiscountFormInput, unknown, DiscountFormValues>({
		resolver: zodResolver(discountFormSchema),
		mode: "onChange",
		defaultValues: DISCOUNT_FORM_DEFAULTS,
	});

	const {
		register,
		control,
		handleSubmit,
		reset,
		watch,
		formState: { errors, isValid },
	} = form;

	// إعادة تعبئة النموذج عند فتح اللوحة (إنشاء أو تعديل)
	useEffect(() => {
		if (!open) return;
		if (discount) {
			reset({
				name: discount.name,
				couponCode: discount.couponCode,
				type: discount.type,
				value: Number(discount.value),
				validFrom: discount.validFrom ? new Date(discount.validFrom) : null,
				validTo: discount.validTo ? new Date(discount.validTo) : null,
				usageLimit: discount.usageLimit,
				perCustomerLimit: discount.perCustomerLimit,
				customerType: discount.customerType,
				serviceIds: discount.services.map((s) => s.id),
				notes: discount.notes,
			});
		} else {
			reset(DISCOUNT_FORM_DEFAULTS);
		}
		setContinueAdding(false);
	}, [open, discount, reset]);

	const type = watch("type");
	const watchedValues = watch();
	const valueUnit = type === "FIXED" ? "ر.س" : "%";

	const formProgress = useFormProgress({ schema: discountFormSchema, values: watchedValues });
	// عدد مرات تعديل السجل المحفوظ في قاعدة البيانات — لا علاقة له بالتغييرات الحالية
	const changesCount = discount?.editsCount ?? 0;

	const onSubmit = async (data: DiscountFormValues) => {
		const payload = toDiscountPayload(data);
		try {
			if (isEdit && discount) {
				await update(discount.id, payload);
				onOpenChange(false);
			} else {
				await create(payload);
				if (continueAdding) {
					reset(DISCOUNT_FORM_DEFAULTS);
				} else {
					onOpenChange(false);
				}
			}
		} catch {
			// toast handled by hook
		}
	};

	const submitForm = handleSubmit(onSubmit);

	useHotkey(
		"Mod+Enter",
		() => {
			if (isSaving || !isValid) return;
			void submitForm();
		},
		{ enabled: open },
	);

	return (
		<Sheet
			open={open}
			onOpenChange={onOpenChange}
		>
			<SheetContent
				side="left"
				dir="rtl"
				showCloseButton={false}
				className="w-full gap-0 p-0 sm:max-w-xl!"
			>
				<FormHeader
					title={isEdit ? "تعديل الخصم" : "أنشئ خصم جديد"}
					identity={discount ? { name: discount.name, code: discount.couponCode } : null}
					changesCount={changesCount}
					progress={formProgress}
					onClose={() => onOpenChange(false)}
				/>

				<form
					onSubmit={submitForm}
					className="flex min-h-0 flex-1 flex-col"
				>
					<div className="flex-1 space-y-5 overflow-y-auto p-4">
						{/* ─── معلومات الأساسية ─── */}
						<div className="space-y-3">
							<SectionTitle>معلومات الأساسية</SectionTitle>

							<Field data-invalid={!!errors.name}>
								<Label>
									اسم الخصم <span className="text-rose-500">*</span>
								</Label>
								<Input
									placeholder="مثال: خصم العملاء الجدد"
									aria-invalid={!!errors.name}
									disabled={isSaving}
									{...register("name")}
								/>
								<FieldError errors={[errors.name]} />
							</Field>

							<Field data-invalid={!!errors.couponCode}>
								<Label>
									كود الخصم <span className="text-rose-500">*</span>
								</Label>
								<Input
									placeholder="مثال: elite2026"
									aria-invalid={!!errors.couponCode}
									disabled={isSaving}
									{...register("couponCode")}
								/>
								<FieldError errors={[errors.couponCode]} />
							</Field>

							<div className="grid grid-cols-2 gap-3">
								<Field>
									<Label>
										نوع الخصم <span className="text-rose-500">*</span>
									</Label>
									<Controller
										control={control}
										name="type"
										render={({ field }) => (
											<RadioGroup
												value={field.value}
												onValueChange={field.onChange}
												className="flex items-center gap-4 pt-1"
												disabled={isSaving}
											>
												{DISCOUNT_TYPE_OPTIONS.map((opt) => (
													<Label
														key={opt.value}
														className="flex items-center gap-1.5 font-normal"
													>
														<RadioGroupItem value={opt.value} />
														{opt.label}
													</Label>
												))}
											</RadioGroup>
										)}
									/>
								</Field>

								<Field data-invalid={!!errors.value}>
									<Label>
										قيمة الخصم <span className="text-rose-500">*</span>
									</Label>
									<InputGroup>
										<InputGroupInput
											type="number"
											step="0.01"
											min={0}
											placeholder="00"
											aria-invalid={!!errors.value}
											disabled={isSaving}
											{...register("value")}
										/>
										<InputGroupAddon align="inline-end">{valueUnit}</InputGroupAddon>
									</InputGroup>
									<FieldError errors={[errors.value]} />
								</Field>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<Field>
									<Label>صالح من</Label>
									<Controller
										control={control}
										name="validFrom"
										render={({ field }) => (
											<DateField
												value={field.value}
												onChange={field.onChange}
												placeholder="اختر تاريخاً"
												disabled={isSaving}
											/>
										)}
									/>
								</Field>

								<Field data-invalid={!!errors.validTo}>
									<Label>صالح إلى</Label>
									<Controller
										control={control}
										name="validTo"
										render={({ field }) => (
											<DateField
												value={field.value}
												onChange={field.onChange}
												placeholder="اختر تاريخاً"
												disabled={isSaving}
											/>
										)}
									/>
									<FieldError errors={[errors.validTo]} />
								</Field>
							</div>
							<p className="text-xs text-muted-foreground">
								في حال لم تحدد تاريخاً فصلاحية الخصم غير محدودة.
							</p>
						</div>

						<Separator />

						{/* ─── شروط وصلاحيات الخصم ─── */}
						<div className="space-y-3">
							<SectionTitle>شروط وصلاحيات الخصم</SectionTitle>

							<div className="grid grid-cols-2 gap-3">
								<Field>
									<Label>حد الاستخدام</Label>
									<InputGroup>
										<InputGroupInput
											type="number"
											min={0}
											placeholder="00"
											disabled={isSaving}
											{...register("usageLimit")}
										/>
										<InputGroupAddon align="inline-end">مرة</InputGroupAddon>
									</InputGroup>
									<p className="text-xs text-muted-foreground">
										لا يوجد حد في حال القيمة صفر.
									</p>
								</Field>

								<Field>
									<Label>نوع العملاء</Label>
									<Controller
										control={control}
										name="customerType"
										render={({ field }) => (
											<Select
												value={field.value}
												onValueChange={field.onChange}
												disabled={isSaving}
												dir="rtl"
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="اختر..." />
												</SelectTrigger>
												<SelectContent>
													{CUSTOMER_TYPE_OPTIONS.map((opt) => (
														<SelectItem
															key={opt.value}
															value={opt.value}
														>
															{opt.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										)}
									/>
								</Field>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<Field>
									<Label>مرات الاستخدام لعميل واحد</Label>
									<InputGroup>
										<InputGroupInput
											type="number"
											min={0}
											placeholder="00"
											disabled={isSaving}
											{...register("perCustomerLimit")}
										/>
										<InputGroupAddon align="inline-end">مرة</InputGroupAddon>
									</InputGroup>
									<p className="text-xs text-muted-foreground">
										لا يوجد حد في حال القيمة صفر.
									</p>
								</Field>

								<Field>
									<Label>الدورات المشمولة</Label>
									<Controller
										control={control}
										name="serviceIds"
										render={({ field }) => {
											const ids = field.value ?? [];
											const selected = services.filter((s) => ids.includes(s.id));
											return (
												<Combobox
													multiple
													value={ids}
													onValueChange={(v) => field.onChange(v ?? [])}
												>
													<ComboboxChips className="min-h-9 gap-1 px-2 py-1">
														{selected.map((svc) => (
															<ComboboxChip
																key={svc.id}
																value={svc.id}
																className="text-xs"
															>
																{svc.name}
															</ComboboxChip>
														))}
														<ComboboxChipsInput
															disabled={isLoadingServices || isSaving}
															placeholder={ids.length === 0 ? "الجميع" : ""}
															className="text-sm"
														/>
													</ComboboxChips>
													<ComboboxContent>
														<ComboboxList>
															{services.length === 0 && (
																<ComboboxEmpty>لا توجد دورات</ComboboxEmpty>
															)}
															{services.map((svc) => (
																<ComboboxItem
																	key={svc.id}
																	value={svc.id}
																>
																	{svc.name}
																</ComboboxItem>
															))}
														</ComboboxList>
													</ComboboxContent>
												</Combobox>
											);
										}}
									/>
								</Field>
							</div>
						</div>

						<Separator />

						{/* ─── ملاحظات ─── */}
						<div className="space-y-3">
							<SectionTitle>ملاحظات</SectionTitle>
							<Field>
								<Textarea
									placeholder="أضف أي ملاحظات للخصم..."
									className="min-h-20"
									disabled={isSaving}
									{...register("notes")}
								/>
							</Field>
						</div>
					</div>

					{/* Footer */}
					<FormFooter
						continueAdding={continueAdding}
						onContinueAddingChange={isEdit ? undefined : setContinueAdding}
						disabled={isSaving}
					>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => onOpenChange(false)}
							disabled={isSaving}
						>
							إلغاء
						</Button>
						<Button
							type="submit"
							size="sm"
							disabled={isSaving || !isValid}
						>
							{isEdit ? "حفظ التغييرات" : "أضف الخصم"}
						</Button>
					</FormFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
}
