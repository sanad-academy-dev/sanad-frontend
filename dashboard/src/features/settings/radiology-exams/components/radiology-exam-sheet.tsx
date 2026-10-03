import { zodResolver } from "@hookform/resolvers/zod";
import { IconBodyScan, IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { ToggleChip } from "@/components/common/toggle-chip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
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
import {
	useRadiologyTemplates,
	useUpsertRadiologyDefinition,
} from "@/features/services/radiology/hooks/use-radiology-templates";
import { SopSettingsSection } from "@/features/settings/sops/components/sop-settings-section";
import { RadiologyModality, SedationLevel, SopDomain } from "@/generated/prisma/enums";
import { useI18n } from "@/hooks/use-i18n";
import {
	modalityCapabilities,
	SEDATION_NEED_HINT,
} from "@sanad/contracts/runtime/server/radiology/radiology-modality";
import {
	BODY_PART_OPTIONS,
	MODALITY_META,
	SEDATION_LABELS,
} from "@sanad/contracts/runtime/server/radiology/radiology-procedure.type";
import {
	type RadiologyDefinitionFormInput,
	type RadiologyDefinitionFormValues,
	radiologyDefinitionSchema,
} from "@sanad/contracts/runtime/server/radiology-exams/radiology-exams.type";

// لوحة تعريف فحص الأشعة — طريقة التصوير وخصائص الفحص الافتراضية التي تُنسخ
// لقطةً عند كل طلب (نظيرة لوحة مُحلِّلات التحليل في المختبر).

export function RadiologyExamSheet({
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
	const { templates, isLoading: isTemplatesLoading } = useRadiologyTemplates();
	const { upsertDefinition, isPending } = useUpsertRadiologyDefinition();

	const template = templates.find((t) => t.serviceId === serviceId) ?? null;
	const definition = template?.definition ?? null;
	// أول فتح لفحص بلا تعريف يبدأ من الطريقة المستنتَجة من اسمه لا من XRAY
	const fallbackModality = template?.effectiveModality ?? RadiologyModality.XRAY;

	const {
		control,
		register,
		handleSubmit,
		reset,
		watch,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<RadiologyDefinitionFormInput, unknown, RadiologyDefinitionFormValues>({
		resolver: zodResolver(radiologyDefinitionSchema),
		defaultValues: {
			modality: definition?.modality ?? fallbackModality,
			bodyPart: definition?.bodyPart ?? null,
			defaultViews: definition?.defaultViews ?? [],
			lateralityRequired: definition?.lateralityRequired ?? false,
			contrastDefault: definition?.contrastDefault ?? false,
			sedationDefault: definition?.sedationDefault ?? SedationLevel.NONE,
			prepNotes: definition?.prepNotes ?? null,
			active: definition?.active ?? true,
		},
	});

	// إعادة الضبط تنتظر وصول القوالب: الفتح قبل اكتمال الجلب كان يملأ النموذج
	// بقيم افتراضية ثم لا يُعاد ضبطه عند وصول التعريف المحفوظ، فيُحفظ فوقه.
	// المفتاح يشمل معرّف التعريف كي يُعاد الضبط فور وصوله.
	// biome-ignore lint/correctness/useExhaustiveDependencies: الضبط عند الفتح ووصول التعريف فقط
	useEffect(() => {
		if (!open || isTemplatesLoading) return;
		reset({
			modality: definition?.modality ?? fallbackModality,
			bodyPart: definition?.bodyPart ?? null,
			defaultViews: definition?.defaultViews ?? [],
			lateralityRequired: definition?.lateralityRequired ?? false,
			contrastDefault: definition?.contrastDefault ?? false,
			sedationDefault: definition?.sedationDefault ?? SedationLevel.NONE,
			prepNotes: definition?.prepNotes ?? null,
			active: definition?.active ?? true,
		});
	}, [open, serviceId, isTemplatesLoading, definition?.id]);

	const modality = watch("modality");
	// الشاشة تتكيّف فور تبديل طريقة التصوير: تسمية المجموعة وخياراتها،
	// وإخفاء التباين لما لا يقبله، وتلميح التهدئة المناسب
	const caps = modalityCapabilities(modality);
	const selectedViews = watch("defaultViews") ?? [];

	// تبديل الطريقة يُسقط ما لم يعد ينطبق: تباينًا لطريقة لا تقبله، وإسقاطات
	// تخصّ طريقة أخرى (لا تظهر في الرقاقات فيتعذّر حذفها يدويًا).
	// biome-ignore lint/correctness/useExhaustiveDependencies: التنظيف عند تبديل الطريقة فقط
	useEffect(() => {
		if (!open) return;
		if (!caps.contrast) setValue("contrastDefault", false);
		const allowed = new Set(caps.protocolGroups.flatMap((g) => g.options));
		const current = getValues("defaultViews") ?? [];
		const kept = current.filter((v) => allowed.has(v));
		if (kept.length !== current.length) setValue("defaultViews", kept);
	}, [modality]);

	const toggleView = (view: string, checked: boolean) => {
		setValue(
			"defaultViews",
			checked ? [...selectedViews, view] : selectedViews.filter((v) => v !== view),
		);
	};

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
							<IconBodyScan className="size-4 shrink-0 text-muted-foreground" />
							<span className="truncate">تعريف الفحص — {serviceName}</span>
							{modality && (
								<Badge
									variant="outline"
									className="shrink-0 text-[10px]"
									dir="ltr"
								>
									{MODALITY_META[modality]?.dicomCode}
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
							name="modality"
							control={control}
							render={({ field }) => (
								<Field data-invalid={!!errors.modality}>
									<Label className="text-sm font-medium">طريقة التصوير</Label>
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
											{Object.values(RadiologyModality).map((value) => (
												<SelectItem
													key={value}
													value={value}
												>
													{MODALITY_META[value].label} ({MODALITY_META[value].dicomCode})
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{!definition && template?.modalityInferred && (
										<p className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1.5 text-[11px] text-blue-800">
											استُنتِجت من اسم الفحص — احفظ التعريف لتثبيتها.
										</p>
									)}
									<FieldError errors={[errors.modality]} />
								</Field>
							)}
						/>

						<Field>
							<Label className="text-sm font-medium">منطقة التصوير الافتراضية</Label>
							<Controller
								name="bodyPart"
								control={control}
								render={({ field }) => (
									<Select
										value={field.value ?? ""}
										onValueChange={(v) => field.onChange(v || null)}
										disabled={isPending}
									>
										<SelectTrigger dir="rtl">
											<SelectValue placeholder="اختر المنطقة" />
										</SelectTrigger>
										<SelectContent
											position="popper"
											dir="rtl"
										>
											{BODY_PART_OPTIONS.map((part) => (
												<SelectItem
													key={part}
													value={part}
												>
													{part}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
						</Field>

						{/* المجموعة الافتراضية — تسميتها وخياراتها تتبعان طريقة التصوير:
						    إسقاطات للأشعة، تسلسلات للرنين، أطوار للمقطعية، أعضاء للسونار */}
						<div className="flex flex-col gap-2">
							<Label className="text-sm font-medium">{caps.protocolLabel} الافتراضية</Label>
							{caps.protocolGroups.map((group) => (
								<div
									key={group.label}
									className="flex flex-col gap-1"
								>
									<p className="text-[11px] text-muted-foreground">{group.label}</p>
									<div className="flex flex-wrap gap-1.5">
										{group.options.map((view) => (
											<ToggleChip
												key={view}
												active={selectedViews.includes(view)}
												disabled={isPending}
												onClick={() => toggleView(view, !selectedViews.includes(view))}
											>
												{view}
											</ToggleChip>
										))}
									</div>
								</div>
							))}
						</div>

						<div className="flex items-center justify-between gap-2 rounded-md border p-2.5">
							<Label className="text-sm">يتطلب تحديد الجهة (يمين/يسار)</Label>
							<Controller
								name="lateralityRequired"
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

						{/* التباين لا يُعرض لطريقة تصوير لا تستخدمه */}
						{caps.contrast && (
							<div className="flex items-center justify-between gap-2 rounded-md border p-2.5">
								<Label className="text-sm">بالتباين افتراضيًا</Label>
								<Controller
									name="contrastDefault"
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
						)}

						<Controller
							name="sedationDefault"
							control={control}
							render={({ field }) => (
								<Field>
									<Label className="text-sm font-medium">التهدئة الافتراضية</Label>
									<p className="rounded-md border bg-muted/30 px-2 py-1.5 text-[11px] text-muted-foreground">
										{SEDATION_NEED_HINT[caps.sedation]}
									</p>
									<Select
										value={field.value ?? SedationLevel.NONE}
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

						<Field>
							<Label className="text-sm font-medium">تعليمات التحضير</Label>
							<Textarea
								rows={2}
								placeholder="مثال: صيام 12 ساعة قبل سونار البطن"
								disabled={isPending}
								{...register("prepNotes")}
							/>
						</Field>

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
							domain={SopDomain.RADIOLOGY}
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
