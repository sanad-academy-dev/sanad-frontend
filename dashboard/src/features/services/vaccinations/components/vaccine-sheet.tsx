import { zodResolver } from "@hookform/resolvers/zod";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

import { FieldLabel } from "@/components/common/field-label";
import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { INVENTORY_CATEGORY_LABELS } from "@/features/inventory/data/constants";
import { useInventory } from "@/features/inventory/hooks/use-inventory";
import {
	useAntigens,
	useSaveVaccine,
} from "@/features/services/vaccinations/hooks/use-vaccinations";
import { CatalogSpecies } from "@/generated/prisma/enums";
import {
	INJECTION_SITE_LABELS,
	VACCINE_KIND_LABELS,
	VACCINE_ROUTE_LABELS,
	type VaccineFormInput,
	type VaccineResponse,
	vaccineSchema,
} from "@sanad/contracts/runtime/server/vaccinations/vaccinations.type";

const SPECIES_LABELS: Record<string, string> = {
	DOG: "كلاب",
	CAT: "قطط",
	HORSE: "خيول",
	CATTLE: "أبقار",
	SHEEP: "أغنام",
	GOAT: "ماعز",
	CAMEL: "إبل",
	POULTRY: "دواجن وطيور",
	RABBIT: "أرانب",
	SWINE: "خنازير",
	FISH: "أسماك",
	BEE: "نحل",
};

const EMPTY: VaccineFormInput = {
	name: "",
	kind: "OTHER",
	antigenCodes: [],
	species: [],
	primarySeriesDoses: 1,
	// الافتراضي المحافظ للسعار وأغلب اللقاحات المسجَّلة — يُصحَّح من نشرة المستحضر،
	// ويُقترح آليًا من مُستضِدّات اللقاح فور اختيارها (انظر التأثير أدناه).
	immunityOnsetDays: 21,
	defaultRoute: "SUBCUTANEOUS",
	active: true,
};

export function VaccineSheet({
	open,
	onOpenChange,
	vaccine,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	vaccine?: VaccineResponse | null;
}) {
	const { antigens } = useAntigens();
	// اللقاحات مستهلَكات مثل غيرها — نفس قائمة المخزون، بلا مصدر بيانات مستقلّ
	const { inventory } = useInventory();

	// أصناف فئة «تطعيم» أولًا — الفئة موجودة في النظام أصلًا (InventoryCategory.VACCINE)
	// فترتيبها في المقدّمة يجعل الاختيار الصحيح هو الأقرب، دون منع الحالات المشروعة
	// (لقاح مسجَّل تحت فئة أخرى يبقى قابلًا للاختيار).
	const items = useMemo(
		() =>
			[...inventory].sort((a, b) => {
				const rank = (category: string) => (category === "VACCINE" ? 0 : 1);
				return rank(a.category) - rank(b.category) || a.name.localeCompare(b.name, "ar");
			}),
		[inventory],
	);
	const { saveVaccine, isPending } = useSaveVaccine();

	const {
		register,
		handleSubmit,
		control,
		watch,
		reset,
		setValue,
		formState: { errors, dirtyFields },
		// بلا وسيط نوع صريح — z.coerce يجعل نوع الدخل مغايرًا لنوع الخرج
	} = useForm({
		resolver: zodResolver(vaccineSchema),
		defaultValues: EMPTY,
	});

	useEffect(() => {
		if (!open) return;
		reset(
			vaccine
				? {
						name: vaccine.name,
						nameEn: vaccine.nameEn ?? undefined,
						kind: vaccine.kind,
						manufacturerName: vaccine.manufacturerName ?? undefined,
						inventoryItemId: vaccine.inventoryItem?.id ?? undefined,
						antigenCodes: vaccine.antigens.map((a) => a.antigenCode),
						species: vaccine.species.map((s) => s.species),
						primarySeriesDoses: vaccine.primarySeriesDoses,
						primarySeriesIntervalDays: vaccine.primarySeriesIntervalDays ?? undefined,
						boosterIntervalDays: vaccine.boosterIntervalDays ?? undefined,
						immunityOnsetDays: vaccine.immunityOnsetDays,
						defaultRoute: vaccine.defaultRoute,
						defaultSite: vaccine.defaultSite ?? undefined,
						defaultDoseVolumeMl: vaccine.defaultDoseVolumeMl
							? Number(vaccine.defaultDoseVolumeMl)
							: undefined,
						notes: vaccine.notes ?? undefined,
						active: vaccine.active,
					}
				: EMPTY,
		);
	}, [open, vaccine, reset]);

	const selectedAntigenCodes = watch("antigenCodes");

	/**
	 * اقتراح فترة اكتساب المناعة من مُستضِدّات اللقاح — الأقصى لا المتوسط.
	 *
	 * اللقاح المركّب لا يحمي كاملًا قبل أن يكتسب أبطأ مكوّناته مناعته. والاقتراح
	 * يتوقّف عند أول تعديل يدوي (`dirtyFields`) وعند التحرير: رقمٌ من نشرة المستحضر
	 * لا يُدهَس باشتقاق مرجعي كلما لُمست قائمة المُستضِدّات.
	 */
	useEffect(() => {
		if (!open || vaccine || dirtyFields.immunityOnsetDays) return;
		const days = antigens
			.filter((a) => selectedAntigenCodes?.includes(a.code))
			.map((a) => a.immunityOnsetDays);
		if (days.length === 0) return;
		setValue("immunityOnsetDays", Math.max(...days), { shouldDirty: false });
	}, [open, vaccine, antigens, selectedAntigenCodes, dirtyFields.immunityOnsetDays, setValue]);

	const selectedItemId = watch("inventoryItemId");
	const selectedItem = items.find((i) => i.id === selectedItemId);

	const onSubmit = handleSubmit((values) => {
		void saveVaccine({ id: vaccine?.id, ...values }, { onSuccess: () => onOpenChange(false) });
	});

	return (
		<Sheet
			open={open}
			onOpenChange={onOpenChange}
		>
			<SheetContent
				side="left"
				showCloseButton={false}
				className="w-full gap-0 p-0 sm:max-w-xl!"
			>
				<FormHeader
					title={vaccine ? "تعديل لقاح" : "إضافة لقاح"}
					identity={vaccine ? { name: vaccine.name, code: vaccine.code } : null}
					changesCount={vaccine?.editsCount ?? 0}
					onClose={() => onOpenChange(false)}
				/>

				<form
					onSubmit={onSubmit}
					className="flex min-h-0 flex-1 flex-col"
				>
					<div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
						<div className="grid grid-cols-2 gap-3">
							<Field data-invalid={!!errors.name}>
								<FieldLabel required>
									<Label>اسم اللقاح</Label>
								</FieldLabel>
								<Input
									{...register("name")}
									disabled={isPending}
								/>
								<FieldError errors={[errors.name]} />
							</Field>

							<Field>
								<FieldLabel>
									<Label>الاسم بالإنجليزية</Label>
								</FieldLabel>
								<Input
									dir="ltr"
									{...register("nameEn")}
									disabled={isPending}
								/>
							</Field>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<Controller
								name="kind"
								control={control}
								render={({ field }) => (
									<Field data-invalid={!!errors.kind}>
										<FieldLabel required>
											<Label>نوع اللقاح</Label>
										</FieldLabel>
										<Select
											value={field.value}
											onValueChange={field.onChange}
											disabled={isPending}
										>
											<SelectTrigger className="w-full">
												<SelectValue />
											</SelectTrigger>
											<SelectContent position="popper">
												{Object.entries(VACCINE_KIND_LABELS).map(([value, label]) => (
													<SelectItem
														key={value}
														value={value}
													>
														{label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FieldError errors={[errors.kind]} />
									</Field>
								)}
							/>

							<Field>
								<FieldLabel>
									<Label>الشركة المصنّعة</Label>
								</FieldLabel>
								<Input
									{...register("manufacturerName")}
									disabled={isPending}
								/>
							</Field>
						</div>

						{/* المُستضِدّات ليست وسمًا وصفيًا: عليها يقوم حساب الجرعة القادمة، ولذلك
						    يُطلب واحد على الأقل. لقاح رباعي بمُستضِدّ واحد يكسر كل جدول لاحق. */}
						<Controller
							name="antigenCodes"
							control={control}
							render={({ field }) => (
								<Field data-invalid={!!errors.antigenCodes}>
									<FieldLabel required>
										<Label>المُستضِدّات المشمولة</Label>
									</FieldLabel>
									<p className="text-xs text-muted-foreground">
										ما يحمي منه اللقاح فعلًا. عليها يُحسب استحقاق الجرعة القادمة لكل مرض على حدة.
									</p>
									<div className="grid max-h-52 grid-cols-2 gap-1.5 overflow-y-auto rounded-[4px] border p-2">
										{antigens.map((antigen) => {
											const checked = field.value.includes(antigen.code);
											return (
												<Label
													key={antigen.code}
													className="flex cursor-pointer items-center gap-2 font-normal"
												>
													<Checkbox
														checked={checked}
														disabled={isPending}
														onCheckedChange={(v) =>
															field.onChange(
																v === true
																	? [...field.value, antigen.code]
																	: field.value.filter((c) => c !== antigen.code),
															)
														}
													/>
													<span className="truncate text-sm">{antigen.nameAr}</span>
												</Label>
											);
										})}
									</div>
									<FieldError errors={[errors.antigenCodes]} />
								</Field>
							)}
						/>

						<Controller
							name="species"
							control={control}
							render={({ field }) => (
								<Field data-invalid={!!errors.species}>
									<FieldLabel required>
										<Label>الأنواع المستهدفة</Label>
									</FieldLabel>
									<div className="grid grid-cols-3 gap-1.5 rounded-[4px] border p-2">
										{Object.values(CatalogSpecies).map((species) => {
											const checked = field.value.includes(species);
											return (
												<Label
													key={species}
													className="flex cursor-pointer items-center gap-2 font-normal"
												>
													<Checkbox
														checked={checked}
														disabled={isPending}
														onCheckedChange={(v) =>
															field.onChange(
																v === true
																	? [...field.value, species]
																	: field.value.filter((s) => s !== species),
															)
														}
													/>
													<span className="truncate text-sm">
														{SPECIES_LABELS[species] ?? species}
													</span>
												</Label>
											);
										})}
									</div>
									<FieldError errors={[errors.species]} />
								</Field>
							)}
						/>

						{/* الربط بالمخزون هو ما يجعل رقم الدفعة موجودًا أصلًا — StockBatch مُفهرس
						    على الصنف. بلا ربط لا دفعة، وبلا دفعة السجل لا يُثبت أي عبوة أُعطيت. */}
						<Controller
							name="inventoryItemId"
							control={control}
							render={({ field }) => (
								<Field>
									<FieldLabel>
										<Label>صنف المخزون المقابل</Label>
									</FieldLabel>
									<Select
										value={field.value ?? ""}
										onValueChange={field.onChange}
										disabled={isPending}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="اختر الصنف" />
										</SelectTrigger>
										<SelectContent position="popper">
											{items.map((item) => (
												<SelectItem
													key={item.id}
													value={item.id}
												>
													{item.name}
													<span className="text-muted-foreground">
														{" — "}
														{INVENTORY_CATEGORY_LABELS[item.category]}
														{item.tracksBatches ? " · متتبَّع بالدُفعات" : ""}
													</span>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{!selectedItemId && (
										<p className="flex items-start gap-2 text-xs text-muted-foreground">
											<IconAlertTriangle className="mt-0.5 size-3.5 shrink-0" />
											بلا ربط بالمخزون لن يُخصم اللقاح عند الإعطاء ولن يُسجَّل رقم دفعته.
										</p>
									)}
									{selectedItem && !selectedItem.tracksBatches && (
										<p className="flex items-start gap-2 text-xs text-[#B45309]">
											<IconAlertTriangle className="mt-0.5 size-3.5 shrink-0" />
											هذا الصنف غير متتبَّع بالدُفعات. فعّل «تتبّع الدُفعات» من صفحة المنتج ليصبح رقم
											الدفعة إلزاميًا عند الإعطاء.
										</p>
									)}
								</Field>
							)}
						/>

						<div className="grid grid-cols-3 gap-3">
							<Field data-invalid={!!errors.primarySeriesDoses}>
								<FieldLabel required>
									<Label>جرعات السلسلة</Label>
								</FieldLabel>
								<Input
									type="number"
									min={1}
									{...register("primarySeriesDoses")}
									disabled={isPending}
								/>
								<FieldError errors={[errors.primarySeriesDoses]} />
							</Field>

							<Field>
								<FieldLabel>
									<Label>الفاصل (يوم)</Label>
								</FieldLabel>
								<Input
									type="number"
									min={0}
									{...register("primarySeriesIntervalDays")}
									disabled={isPending}
								/>
							</Field>

							<Field>
								<FieldLabel>
									<Label>المنشّطة (يوم)</Label>
								</FieldLabel>
								<Input
									type="number"
									min={0}
									{...register("boosterIntervalDays")}
									disabled={isPending}
								/>
							</Field>
						</div>

						{/* فترة اكتساب المناعة — الجرعة ليست حماية لحظة حقنها. عليها تقوم نافذة
						    الحماية المثبَّتة على كل سجل، وتقرأها بوابة قبول التجميل. */}
						<Field data-invalid={!!errors.immunityOnsetDays}>
							<FieldLabel required>
								<Label>فترة اكتساب المناعة (يوم)</Label>
							</FieldLabel>
							<Input
								type="number"
								min={0}
								max={365}
								aria-invalid={!!errors.immunityOnsetDays}
								{...register("immunityOnsetDays")}
								disabled={isPending}
							/>
							<p className="text-muted-foreground text-xs leading-relaxed">
								الأيام بين إعطاء الجرعة وبدء حمايتها الفعلية، من نشرة المستحضر. يُقترح الرقم
								تلقائيًا من أبطأ مُستضِدّات اللقاح، وصحّحه من النشرة عند اختلافها. عليه تُحسب لحظة
								بدء الحماية على كل جرعة، وتقرأها بوابة قبول التجميل.
							</p>
							<FieldError errors={[errors.immunityOnsetDays]} />
						</Field>

						<div className="grid grid-cols-3 gap-3">
							<Controller
								name="defaultRoute"
								control={control}
								render={({ field }) => (
									<Field data-invalid={!!errors.defaultRoute}>
										<FieldLabel required>
											<Label>طريق الإعطاء</Label>
										</FieldLabel>
										<Select
											value={field.value}
											onValueChange={field.onChange}
											disabled={isPending}
										>
											<SelectTrigger className="w-full">
												<SelectValue />
											</SelectTrigger>
											<SelectContent position="popper">
												{Object.entries(VACCINE_ROUTE_LABELS).map(([value, label]) => (
													<SelectItem
														key={value}
														value={value}
													>
														{label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FieldError errors={[errors.defaultRoute]} />
									</Field>
								)}
							/>

							<Controller
								name="defaultSite"
								control={control}
								render={({ field }) => (
									<Field>
										<FieldLabel>
											<Label>الموضع الافتراضي</Label>
										</FieldLabel>
										<Select
											value={field.value ?? ""}
											onValueChange={field.onChange}
											disabled={isPending}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="—" />
											</SelectTrigger>
											<SelectContent position="popper">
												{Object.entries(INJECTION_SITE_LABELS).map(([value, label]) => (
													<SelectItem
														key={value}
														value={value}
													>
														{label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Field>
								)}
							/>

							<Field>
								<FieldLabel>
									<Label>الحجم (مل)</Label>
								</FieldLabel>
								<Input
									type="number"
									step="0.01"
									min={0}
									{...register("defaultDoseVolumeMl")}
									disabled={isPending}
								/>
							</Field>
						</div>

						<Field>
							<FieldLabel>
								<Label>ملاحظات</Label>
							</FieldLabel>
							<Textarea
								rows={2}
								{...register("notes")}
								disabled={isPending}
							/>
						</Field>
					</div>

					<FormFooter disabled={isPending}>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => onOpenChange(false)}
							disabled={isPending}
						>
							إلغاء
						</Button>
						<Button
							type="submit"
							size="sm"
							disabled={isPending}
						>
							حفظ
						</Button>
					</FormFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
}
