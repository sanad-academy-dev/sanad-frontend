import { zodResolver } from "@hookform/resolvers/zod";
import { IconPackage, IconPlus, IconScissors, IconTrash, IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import { type Control, Controller, useFieldArray, useForm } from "react-hook-form";

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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useInventory } from "@/features/inventory/hooks/use-inventory";
import {
	useOperationProcedureTemplates,
	useUpsertOperationDefinition,
} from "@/features/services/operations/hooks/use-operation-procedures";
import { SopSettingsSection } from "@/features/settings/sops/components/sop-settings-section";
import { OperationTier, SedationLevel, SopDomain, WoundClass } from "@/generated/prisma/enums";
import { useI18n } from "@/hooks/use-i18n";
import type { InventoryResponse } from "@/server/inventory/inventory.type";
import {
	BODY_SYSTEM_OPTIONS,
	type OperationDefinitionFormInput,
	type OperationDefinitionFormValues,
	operationDefinitionSchema,
	WOUND_CLASS_LABELS,
} from "@sanad/contracts/runtime/server/operation-procedures/operation-procedures.type";
import { OPERATION_TIER_LABELS } from "@sanad/contracts/runtime/server/operations/operations.workflow";
import { SEDATION_LABELS } from "@sanad/contracts/runtime/server/radiology/radiology-procedure.type";

// لوحة تعريف الإجراء الجراحي — الدرجة والتخدير والخصائص الافتراضية التي تُنسخ
// لقطةً إلى الحالة عند إنشائها (نظيرة لوحة تعريف فحص الأشعة).
// الدرجة تحدد المسار والبوابات الإلزامية — docs/operations-module-plan.md §3.

const TIER_HINTS: Record<OperationTier, string> = {
	[OperationTier.MINOR]:
		"مسار مختصر: بلا عمود تخدير مستقل، قائمة تحقق موحدة — لخياطة الجروح وتصريف الخراجات ونحوها.",
	[OperationTier.INTERMEDIATE]:
		"المسار الكامل مع قوائم WHO الثلاث وسجل التخدير — للتعقيم واستئصال الكتل ونحوها.",
	[OperationTier.MAJOR]:
		"المسار الكامل بمراقبة مشددة وعدّ إلزامي ودرجة إفاقة — لفتح البطن وجراحات العظام ونحوها.",
};

export function OperationProcedureSheet({
	serviceId,
	serviceName,
	open,
	onOpenChange,
}: {
	serviceId: string;
	serviceName: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { isRtl } = useI18n();
	const side = isRtl ? "left" : "right";
	const { templates, isLoading: isTemplatesLoading } = useOperationProcedureTemplates();
	const { upsertDefinition, isPending } = useUpsertOperationDefinition();
	const { inventory } = useInventory();

	const template = templates.find((t) => t.serviceId === serviceId) ?? null;
	const definition = template?.definition ?? null;
	// بلا تعريف: INTERMEDIATE — الافتراض الآمن لا يخفّض متطلبات الأمان
	const fallbackTier = template?.effectiveTier ?? OperationTier.INTERMEDIATE;

	const {
		control,
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm<OperationDefinitionFormInput, unknown, OperationDefinitionFormValues>({
		resolver: zodResolver(operationDefinitionSchema),
		defaultValues: {
			defaultTier: definition?.defaultTier ?? fallbackTier,
			defaultAnesthesia: definition?.defaultAnesthesia ?? SedationLevel.GENERAL_ANESTHESIA,
			defaultWoundClass: definition?.defaultWoundClass ?? null,
			requiresLaterality: definition?.requiresLaterality ?? false,
			bodySystem: definition?.bodySystem ?? null,
			prepNotes: definition?.prepNotes ?? null,
			active: definition?.active ?? true,
			kitItems:
				definition?.kitItems.map((k) => ({
					inventoryItemId: k.inventoryItemId,
					quantity: k.quantity,
				})) ?? [],
		},
	});
	// عدة الإجراء — القائمة المُرسلة تستبدل المحفوظة بالكامل عند الحفظ
	const kitArray = useFieldArray({ control, name: "kitItems" });

	// إعادة الضبط تنتظر وصول القوالب — نفس منطق لوحة تعريف فحص الأشعة
	// biome-ignore lint/correctness/useExhaustiveDependencies: الضبط عند الفتح ووصول التعريف فقط
	useEffect(() => {
		if (!open || isTemplatesLoading) return;
		reset({
			defaultTier: definition?.defaultTier ?? fallbackTier,
			defaultAnesthesia: definition?.defaultAnesthesia ?? SedationLevel.GENERAL_ANESTHESIA,
			defaultWoundClass: definition?.defaultWoundClass ?? null,
			requiresLaterality: definition?.requiresLaterality ?? false,
			bodySystem: definition?.bodySystem ?? null,
			prepNotes: definition?.prepNotes ?? null,
			active: definition?.active ?? true,
			kitItems:
				definition?.kitItems.map((k) => ({
					inventoryItemId: k.inventoryItemId,
					quantity: k.quantity,
				})) ?? [],
		});
	}, [open, serviceId, isTemplatesLoading, definition?.id]);

	const tier = watch("defaultTier");

	const onSubmit = handleSubmit(async (values) => {
		try {
			await upsertDefinition({ ...values, serviceId });
			onOpenChange(false);
		} catch {
			// التوست يُدار داخل الخطّاف
		}
	});

	return (
		<Sheet
			open={open}
			onOpenChange={onOpenChange}
		>
			<SheetContent
				side={side}
				dir="rtl"
				showCloseButton={false}
				className="w-full max-w-md! gap-0 p-0"
			>
				<SheetHeader className="p-0">
					<div className="flex items-center justify-between gap-2 border-b px-4 py-2">
						<SheetTitle className="flex min-w-0 items-center gap-2 text-base font-bold">
							<IconScissors className="size-4 shrink-0 text-muted-foreground" />
							<span className="truncate">تعريف الإجراء — {serviceName}</span>
							{tier && (
								<Badge
									variant="outline"
									className="shrink-0 text-[10px]"
								>
									{OPERATION_TIER_LABELS[tier]}
								</Badge>
							)}
						</SheetTitle>
						<Button
							size="icon"
							variant="ghost"
							className="size-8"
							onClick={() => onOpenChange(false)}
						>
							<IconX className="size-4" />
						</Button>
					</div>
				</SheetHeader>

				<form
					className="flex min-h-0 flex-1 flex-col"
					onSubmit={onSubmit}
				>
					<div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
						<Controller
							name="defaultTier"
							control={control}
							render={({ field }) => (
								<Field data-invalid={!!errors.defaultTier}>
									<Label className="text-sm font-medium">درجة التعقيد</Label>
									<Select
										value={field.value}
										onValueChange={field.onChange}
										disabled={isPending}
									>
										<SelectTrigger dir="rtl">
											<SelectValue />
										</SelectTrigger>
										<SelectContent
											position="popper"
											dir="rtl"
										>
											{Object.values(OperationTier).map((value) => (
												<SelectItem
													key={value}
													value={value}
												>
													{OPERATION_TIER_LABELS[value]}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{tier && (
										<p className="rounded-md border bg-muted/30 px-2 py-1.5 text-[11px] text-muted-foreground">
											{TIER_HINTS[tier]}
										</p>
									)}
									{!definition && template?.tierInferred && (
										<p className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1.5 text-[11px] text-blue-800">
											بلا تعريف يُعامل الإجراء بدرجة «متوسطة» احتياطًا — احفظ التعريف لتثبيت
											الدرجة الصحيحة.
										</p>
									)}
									<FieldError errors={[errors.defaultTier]} />
								</Field>
							)}
						/>

						<Controller
							name="defaultAnesthesia"
							control={control}
							render={({ field }) => (
								<Field>
									<Label className="text-sm font-medium">التخدير الافتراضي</Label>
									<Select
										value={field.value ?? SedationLevel.GENERAL_ANESTHESIA}
										onValueChange={field.onChange}
										disabled={isPending}
									>
										<SelectTrigger dir="rtl">
											<SelectValue />
										</SelectTrigger>
										<SelectContent
											position="popper"
											dir="rtl"
										>
											{Object.values(SedationLevel).map((level) => (
												<SelectItem
													key={level}
													value={level}
												>
													{SEDATION_LABELS[level]}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</Field>
							)}
						/>

						<Controller
							name="defaultWoundClass"
							control={control}
							render={({ field }) => (
								<Field>
									<Label className="text-sm font-medium">تصنيف الجرح الافتراضي (CDC)</Label>
									<Select
										value={field.value ?? ""}
										onValueChange={(v) => field.onChange(v || null)}
										disabled={isPending}
									>
										<SelectTrigger dir="rtl">
											<SelectValue placeholder="اختر التصنيف" />
										</SelectTrigger>
										<SelectContent
											position="popper"
											dir="rtl"
										>
											{Object.values(WoundClass).map((value) => (
												<SelectItem
													key={value}
													value={value}
												>
													{WOUND_CLASS_LABELS[value]}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</Field>
							)}
						/>

						<Controller
							name="bodySystem"
							control={control}
							render={({ field }) => (
								<Field>
									<Label className="text-sm font-medium">الجهاز / المنطقة</Label>
									<Select
										value={field.value ?? ""}
										onValueChange={(v) => field.onChange(v || null)}
										disabled={isPending}
									>
										<SelectTrigger dir="rtl">
											<SelectValue placeholder="اختر الجهاز" />
										</SelectTrigger>
										<SelectContent
											position="popper"
											dir="rtl"
										>
											{BODY_SYSTEM_OPTIONS.map((system) => (
												<SelectItem
													key={system}
													value={system}
												>
													{system}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</Field>
							)}
						/>

						<div className="flex items-center justify-between gap-2 rounded-md border p-2.5">
							<Label className="text-sm">يتطلب تحديد الجهة (يمين/يسار)</Label>
							<Controller
								name="requiresLaterality"
								control={control}
								render={({ field }) => (
									<Switch
										checked={field.value ?? false}
										onCheckedChange={field.onChange}
										disabled={isPending}
									/>
								)}
							/>
						</div>

						<Field>
							<Label className="text-sm font-medium">تعليمات التحضير</Label>
							<Textarea
								rows={2}
								placeholder="مثال: صيام 8 ساعات، حلاقة موضع الجراحة وتعقيمه"
								disabled={isPending}
								{...register("prepNotes")}
							/>
						</Field>

						{/* عدة الإجراء — تُنسخ إلى الحالة بنودًا ضمن سعر العملية (KIT) وتُصرف من المخزون */}
						<div className="flex flex-col gap-2 rounded-md border p-2.5">
							<div className="flex items-center justify-between gap-2">
								<Label className="flex items-center gap-1.5 text-sm font-medium">
									<IconPackage className="size-4 text-muted-foreground" />
									عدة الإجراء — بنود ضمن السعر
								</Label>
								<Button
									type="button"
									size="sm"
									variant="outline"
									className="h-7"
									disabled={isPending}
									onClick={() => kitArray.append({ inventoryItemId: "", quantity: 1 })}
								>
									<IconPlus className="size-3.5" />
									إضافة صنف
								</Button>
							</div>
							<p className="text-[11px] text-muted-foreground">
								تُنسخ هذه الأصناف تلقائيًا إلى كل حالة جديدة — ضمن سعر العملية ولا تُفوتر منفصلة،
								وتُصرف من المخزون عند الخروج من «العملية».
							</p>
							{kitArray.fields.length === 0 && (
								<p className="rounded-md bg-muted/30 p-2 text-[11px] text-muted-foreground">
									لا أصناف في العدة — أضف الخيوط والشاش ونحوها لتُنسخ مع كل حالة
								</p>
							)}
							{kitArray.fields.map((row, index) => (
								<KitItemRow
									key={row.id}
									index={index}
									control={control}
									inventory={inventory}
									disabled={isPending}
									onRemove={() => kitArray.remove(index)}
								/>
							))}
						</div>

						<div className="flex items-center justify-between gap-2 rounded-md border p-2.5">
							<Label className="text-sm">التعريف فعّال</Label>
							<Controller
								name="active"
								control={control}
								render={({ field }) => (
									<Switch
										checked={field.value ?? true}
										onCheckedChange={field.onChange}
										disabled={isPending}
									/>
								)}
							/>
						</div>
						{/* بروتوكول العمل القياسي — قسم مكدّس كبقية أقسام الورقة، وحفظه مستقل */}
						<SopSettingsSection
							domain={SopDomain.OPERATION}
							serviceId={serviceId}
							serviceName={serviceName}
						/>
					</div>

					<div className="flex items-center justify-start gap-2 border-t px-4 py-2">
						<Button
							type="submit"
							size="sm"
							disabled={isPending}
						>
							حفظ التعريف
						</Button>
						<Button
							type="button"
							size="sm"
							variant="outline"
							disabled={isPending}
							onClick={() => onOpenChange(false)}
						>
							إلغاء
						</Button>
					</div>
				</form>
			</SheetContent>
		</Sheet>
	);
}

/** صف صنف في عدة الإجراء — اختيار من المخزون + الكمية */
function KitItemRow({
	index,
	control,
	inventory,
	disabled,
	onRemove,
}: {
	index: number;
	control: Control<OperationDefinitionFormInput>;
	inventory: InventoryResponse[];
	disabled: boolean;
	onRemove: () => void;
}) {
	const activeItems = inventory.filter((item) => item.active);

	return (
		<div className="flex items-center gap-1.5">
			<Controller
				name={`kitItems.${index}.inventoryItemId`}
				control={control}
				render={({ field }) => {
					const selected = activeItems.find((item) => item.id === field.value);
					return (
						<Combobox
							value={field.value ?? ""}
							onValueChange={(value) => field.onChange(typeof value === "string" ? value : "")}
						>
							<ComboboxTrigger
								className="flex h-8 flex-1 items-center justify-between rounded-md border border-input bg-transparent px-2.5 text-xs"
								disabled={disabled}
							>
								<ComboboxValue
									placeholder="اختر الصنف من المخزون..."
									className="truncate"
								>
									{selected?.name}
								</ComboboxValue>
							</ComboboxTrigger>
							<ComboboxContent dir="rtl">
								<ComboboxList>
									{activeItems.length === 0 ? (
										<ComboboxEmpty>لا أصناف في المخزون</ComboboxEmpty>
									) : (
										activeItems.map((item) => (
											<ComboboxItem
												key={item.id}
												value={item.id}
											>
												<span className="truncate">{item.name}</span>
											</ComboboxItem>
										))
									)}
								</ComboboxList>
							</ComboboxContent>
						</Combobox>
					);
				}}
			/>
			<Controller
				name={`kitItems.${index}.quantity`}
				control={control}
				render={({ field }) => (
					<Input
						className="h-8 w-16 text-xs"
						type="number"
						min={1}
						value={field.value == null ? "" : String(field.value)}
						onChange={(e) => field.onChange(e.target.value)}
						disabled={disabled}
						aria-label="الكمية"
					/>
				)}
			/>
			<Button
				type="button"
				size="icon"
				variant="ghost"
				className="size-7 shrink-0 text-red-600 hover:text-red-600"
				disabled={disabled}
				onClick={onRemove}
			>
				<IconTrash className="size-3.5" />
			</Button>
		</div>
	);
}
