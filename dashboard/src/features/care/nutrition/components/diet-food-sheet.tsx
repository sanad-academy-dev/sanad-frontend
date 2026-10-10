import { zodResolver } from "@hookform/resolvers/zod";
import { IconTrash } from "@tabler/icons-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { RequiredMark } from "@/components/common/required-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxTrigger,
	ComboboxValue,
} from "@/components/ui/combobox";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useNutritionMutations } from "@/features/care/nutrition/hooks/use-nutrition";
import { useInventory } from "@/features/inventory/hooks/use-inventory";
import {
	type DietFoodFormInput,
	type DietFoodResponse,
	dietFoodSchema,
	FOOD_FORM_LABELS,
	FOOD_KIND_LABELS,
	LIFE_STAGE_LABELS,
	MEASURE_UNIT_LABELS,
} from "@sanad/contracts/runtime/server/nutrition/nutrition.type";

// كتالوج الأغذية — سجلّ واحد يخدم كل الخطط.
//
// كثافة الطاقة (سعرة/كجم) إلزامية لأنها المقسوم عليه في كل تحويل من سعرات إلى
// جرامات. غياب دقيق لها لا يعني «تقدير أقل دقّة» بل كميّة خاطئة تُطعَم يوميًا،
// فلا يُقبل الحفظ بدونها.

const SPECIES_OPTIONS = [
	{ value: "DOG", label: "كلاب" },
	{ value: "CAT", label: "قطط" },
	{ value: "HORSE", label: "خيول" },
	{ value: "RABBIT", label: "أرانب" },
] as const;

export function DietFoodSheet({
	open,
	onOpenChange,
	food,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	food?: DietFoodResponse | null;
}) {
	const { saveFood, deleteFood, isPending } = useNutritionMutations();
	const { inventory: inventoryItems } = useInventory();

	const {
		register,
		handleSubmit,
		control,
		watch,
		reset,
		formState: { errors },
	} = useForm<DietFoodFormInput>({
		resolver: zodResolver(dietFoodSchema) as never,
		defaultValues: {
			form: "DRY",
			kind: "MAINTENANCE",
			householdUnit: "GRAM",
			species: [],
			indications: [],
			lifeStages: [],
			active: true,
		},
	});

	const values = watch();

	useEffect(() => {
		if (!open) return;
		reset(
			food
				? {
						name: food.name,
						nameEn: food.nameEn,
						brand: food.brand,
						form: food.form,
						kind: food.kind,
						metabolizableEnergyKcalPerKg: Number(food.metabolizableEnergyKcalPerKg),
						householdUnit: food.householdUnit,
						householdUnitGrams: food.householdUnitGrams
							? Number(food.householdUnitGrams)
							: null,
						proteinPercentDm: food.proteinPercentDm ? Number(food.proteinPercentDm) : null,
						fatPercentDm: food.fatPercentDm ? Number(food.fatPercentDm) : null,
						fiberPercentDm: food.fiberPercentDm ? Number(food.fiberPercentDm) : null,
						moisturePercent: food.moisturePercent ? Number(food.moisturePercent) : null,
						sodiumPercentDm: food.sodiumPercentDm ? Number(food.sodiumPercentDm) : null,
						phosphorusPercentDm: food.phosphorusPercentDm
							? Number(food.phosphorusPercentDm)
							: null,
						species: food.species,
						indications: food.indications,
						lifeStages: food.lifeStages,
						inventoryItemId: food.inventoryItemId,
						notes: food.notes,
						active: food.active,
					}
				: {
						name: "",
						form: "DRY",
						kind: "MAINTENANCE",
						householdUnit: "GRAM",
						species: [],
						indications: [],
						lifeStages: [],
						active: true,
					},
		);
	}, [open, food, reset]);

	const onSubmit = handleSubmit(async (formValues) => {
		await saveFood({ id: food?.id, body: formValues as never });
		onOpenChange(false);
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
					title={food ? "تعديل غذاء" : "غذاء جديد"}
					identity={food ? { name: food.name, code: food.code } : null}
					changesCount={food?.editsCount ?? 0}
					onClose={() => onOpenChange(false)}
					actions={
						food && (
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								title="حذف من الكتالوج"
								onClick={async () => {
									await deleteFood(food.id);
									onOpenChange(false);
								}}
							>
								<IconTrash className="size-4" />
							</Button>
						)
					}
				/>

				<form
					onSubmit={onSubmit}
					className="flex min-h-0 flex-1 flex-col"
				>
					<div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
						<div className="grid gap-3 sm:grid-cols-2">
							<Field data-invalid={!!errors.name}>
								<Label className="justify-start gap-1.5">
									اسم الغذاء
									<RequiredMark />
								</Label>
								<Input
									aria-invalid={!!errors.name}
									{...register("name")}
								/>
								<FieldError errors={[errors.name]} />
							</Field>

							<Field>
								<Label>العلامة التجارية</Label>
								<Input {...register("brand")} />
							</Field>

							<Controller
								name="kind"
								control={control}
								render={({ field }) => (
									<Field>
										<Label className="justify-start gap-1.5">
											التصنيف
											<RequiredMark />
										</Label>
										<Select
											value={field.value}
											onValueChange={field.onChange}
										>
											<SelectTrigger className="w-full">
												<SelectValue />
											</SelectTrigger>
											<SelectContent
												position="popper"
												dir="rtl"
											>
												{Object.entries(FOOD_KIND_LABELS).map(([value, label]) => (
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

							<Controller
								name="form"
								control={control}
								render={({ field }) => (
									<Field>
										<Label className="justify-start gap-1.5">
											الشكل
											<RequiredMark />
										</Label>
										<Select
											value={field.value}
											onValueChange={field.onChange}
										>
											<SelectTrigger className="w-full">
												<SelectValue />
											</SelectTrigger>
											<SelectContent
												position="popper"
												dir="rtl"
											>
												{Object.entries(FOOD_FORM_LABELS).map(([value, label]) => (
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
						</div>

						<Field data-invalid={!!errors.metabolizableEnergyKcalPerKg}>
							<Label className="justify-start gap-1.5">
								كثافة الطاقة الأيضية (سعرة/كجم كما هو)
								<RequiredMark />
							</Label>
							<Input
								type="number"
								step="1"
								placeholder="مثال: ٣٥٠٠ للجاف، ٩٠٠ للمعلّب"
								aria-invalid={!!errors.metabolizableEnergyKcalPerKg}
								{...register("metabolizableEnergyKcalPerKg")}
							/>
							<FieldError errors={[errors.metabolizableEnergyKcalPerKg]} />
							<p className="text-xs text-muted-foreground">
								اقرأها من ملصق المنتج. المعلّب يُدخَل بعد التحويل إلى «سعرة لكل كجم» لا «لكل
								علبة».
							</p>
						</Field>

						<div className="grid gap-3 sm:grid-cols-2">
							<Controller
								name="householdUnit"
								control={control}
								render={({ field }) => (
									<Field>
										<Label>وحدة المنزل</Label>
										<Select
											value={field.value}
											onValueChange={field.onChange}
										>
											<SelectTrigger className="w-full">
												<SelectValue />
											</SelectTrigger>
											<SelectContent
												position="popper"
												dir="rtl"
											>
												{Object.entries(MEASURE_UNIT_LABELS).map(([value, label]) => (
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
								<Label>وزن الوحدة (جم)</Label>
								<Input
									type="number"
									step="1"
									placeholder="وزن الكوب/العلبة بالجرام"
									{...register("householdUnitGrams")}
								/>
								<p className="text-xs text-muted-foreground">
									بها تُطبع الخطة للوليّ أمر بدل ميزان مطبخ
								</p>
							</Field>
						</div>

						<Separator />

						<Controller
							name="species"
							control={control}
							render={({ field }) => (
								<Field>
									<Label>الأنواع الطفلية</Label>
									<div className="flex flex-wrap gap-1.5">
										{SPECIES_OPTIONS.map((option) => {
											const active = field.value?.includes(option.value);
											return (
												<button
													key={option.value}
													type="button"
													onClick={() =>
														field.onChange(
															active
																? field.value.filter((v: string) => v !== option.value)
																: [...(field.value ?? []), option.value],
														)
													}
												>
													<Badge variant={active ? "default" : "outline"}>
														{option.label}
													</Badge>
												</button>
											);
										})}
									</div>
									<p className="text-xs text-muted-foreground">
										اترك الكل فارغًا ليظهر لكل الأنواع
									</p>
								</Field>
							)}
						/>

						<Controller
							name="lifeStages"
							control={control}
							render={({ field }) => (
								<Field>
									<Label>المراحل العمرية</Label>
									<div className="flex flex-wrap gap-1.5">
										{Object.entries(LIFE_STAGE_LABELS).map(([value, label]) => {
											const active = field.value?.includes(
												value as (typeof field.value)[number],
											);
											return (
												<button
													key={value}
													type="button"
													onClick={() =>
														field.onChange(
															active
																? field.value.filter((v: string) => v !== value)
																: [...(field.value ?? []), value],
														)
													}
												>
													<Badge variant={active ? "default" : "outline"}>{label}</Badge>
												</button>
											);
										})}
									</div>
								</Field>
							)}
						/>

						<Controller
							name="indications"
							control={control}
							render={({ field }) => (
								<Field>
									<Label>دواعي الاستعمال</Label>
									<Textarea
										rows={2}
										placeholder="كلوي، بولي، حساسية، سُمنة — افصل بفاصلة"
										value={(field.value ?? []).join("، ")}
										onChange={(e) =>
											field.onChange(
												e.target.value
													.split(/[،,]/)
													.map((s) => s.trim())
													.filter(Boolean),
											)
										}
									/>
								</Field>
							)}
						/>

						<Separator />

						{/* التركيب على أساس المادة الجافة — يُستعمل في مطابقة القيود العلاجية */}
						<div className="grid gap-3 sm:grid-cols-3">
							<Field>
								<Label>بروتين ٪ (DM)</Label>
								<Input
									type="number"
									step="0.1"
									{...register("proteinPercentDm")}
								/>
							</Field>
							<Field>
								<Label>دهن ٪ (DM)</Label>
								<Input
									type="number"
									step="0.1"
									{...register("fatPercentDm")}
								/>
							</Field>
							<Field>
								<Label>ألياف ٪ (DM)</Label>
								<Input
									type="number"
									step="0.1"
									{...register("fiberPercentDm")}
								/>
							</Field>
							<Field>
								<Label>رطوبة ٪</Label>
								<Input
									type="number"
									step="0.1"
									{...register("moisturePercent")}
								/>
							</Field>
							<Field>
								<Label>صوديوم ٪ (DM)</Label>
								<Input
									type="number"
									step="0.001"
									{...register("sodiumPercentDm")}
								/>
							</Field>
							<Field>
								<Label>فوسفور ٪ (DM)</Label>
								<Input
									type="number"
									step="0.001"
									{...register("phosphorusPercentDm")}
								/>
							</Field>
						</div>

						<Separator />

						<Controller
							name="inventoryItemId"
							control={control}
							render={({ field }) => (
								<Field>
									<Label>صنف المخزون المقابل</Label>
									<Combobox
										value={field.value ?? ""}
										onValueChange={(v) => field.onChange(typeof v === "string" ? v : null)}
									>
										<ComboboxTrigger className="flex h-9 w-full items-center justify-between rounded-[4px] border border-input px-3 text-sm">
											<ComboboxValue
												placeholder="غير مربوط"
												className="truncate"
											>
												{inventoryItems.find((i) => i.id === field.value)?.name}
											</ComboboxValue>
										</ComboboxTrigger>
										<ComboboxContent dir="rtl">
											<ComboboxList>
												{inventoryItems.length === 0 ? (
													<ComboboxEmpty>لا أصناف مخزون</ComboboxEmpty>
												) : (
													inventoryItems.map((item) => (
														<ComboboxItem
															key={item.id}
															value={item.id}
														>
															{item.name} — {item.code}
														</ComboboxItem>
													))
												)}
											</ComboboxList>
										</ComboboxContent>
									</Combobox>
									<p className="text-xs text-muted-foreground">
										الربط يجعل الخطة قابلة للصرف والتسعير من المخزن نفسه
									</p>
								</Field>
							)}
						/>

						<Field>
							<Label>ملاحظات</Label>
							<Textarea
								rows={2}
								{...register("notes")}
							/>
						</Field>

						<Controller
							name="active"
							control={control}
							render={({ field }) => (
								<Field>
									<div className="flex items-center gap-2">
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
										<Label>
											{field.value ? "مفعّل — يظهر عند وصف الخطط" : "معطّل — لا يظهر"}
										</Label>
									</div>
								</Field>
							)}
						/>
					</div>

					<FormFooter
						showShortcut
						extra={
							values.metabolizableEnergyKcalPerKg > 0 && values.householdUnitGrams ? (
								<span className="text-xs tabular-nums text-muted-foreground">
									الوحدة ≈{" "}
									{Math.round(
										(Number(values.metabolizableEnergyKcalPerKg) *
											Number(values.householdUnitGrams)) /
											1000,
									)}{" "}
									سعرة
								</span>
							) : null
						}
					>
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
							{food ? "حفظ التعديلات" : "إضافة"}
						</Button>
					</FormFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
}
