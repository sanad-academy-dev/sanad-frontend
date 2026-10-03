import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { ToggleChip } from "@/components/common/toggle-chip";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useSaveRadiologyAcquisition } from "@/features/services/radiology/hooks/use-radiology-procedure";
import { ContrastRoute } from "@/generated/prisma/enums";
import type { RadiologyItemResponse } from "@/server/radiology/radiology.type";
import { DOSE_FIELD_META, modalityCapabilities } from "@sanad/contracts/runtime/server/radiology/radiology-modality";
import {
	CONTRAST_ROUTE_LABELS,
	type RadiologyAcquisitionFormInput,
	radiologyAcquisitionSchema,
} from "@sanad/contracts/runtime/server/radiology/radiology-procedure.type";

// ⑤ الالتقاط — الإسقاطات المنفَّذة ومعاملات التعريض والجرعة الإشعاعية
// والتباين المعطى. أول حفظ يختم بداية التصوير على الخادم.

type RegisterSave = (save: (() => Promise<unknown>) | null) => void;

export function RadiologyAcquisitionStep({
	item,
	registerSave,
}: {
	item: RadiologyItemResponse;
	registerSave: RegisterSave;
}) {
	const { saveAcquisition, isPending } = useSaveRadiologyAcquisition();
	const execution = item.execution;

	const { control, register, getValues, watch, setValue } =
		useForm<RadiologyAcquisitionFormInput>({
			resolver: zodResolver(radiologyAcquisitionSchema),
			defaultValues: {
				performedById: execution?.performedBy?.id ?? null,
				// الإسقاطات المنفَّذة تبدأ من المطلوبة عند الطلب
				viewsPerformed: execution?.viewsPerformed?.length
					? execution.viewsPerformed
					: item.views,
				exposuresCount: execution?.exposuresCount ?? null,
				retakeCount: execution?.retakeCount ?? null,
				kvp: execution?.kvp != null ? Number(execution.kvp) : null,
				mas: execution?.mas != null ? Number(execution.mas) : null,
				doseDap: execution?.doseDap != null ? Number(execution.doseDap) : null,
				ctdiVol: execution?.ctdiVol != null ? Number(execution.ctdiVol) : null,
				dlp: execution?.dlp != null ? Number(execution.dlp) : null,
				contrastUsed: execution?.contrastUsed ?? (item.withContrast ? true : null),
				contrastAgent: execution?.contrastAgent ?? null,
				contrastRoute: execution?.contrastRoute ?? null,
				contrastVolumeMl:
					execution?.contrastVolumeMl != null ? Number(execution.contrastVolumeMl) : null,
				contrastLot: execution?.contrastLot ?? null,
				executionNotes: execution?.executionNotes ?? null,
			},
		});

	// المخطط يقسر مدخلات النصوص الرقمية (coerce) قبل الإرسال
	useEffect(() => {
		registerSave(() => {
			const values = radiologyAcquisitionSchema.parse(getValues());
			return saveAcquisition({ ...values, itemId: item.id });
		});
		return () => registerSave(null);
	}, [registerSave, getValues, saveAcquisition, item.id]);

	const viewsPerformed = watch("viewsPerformed") ?? [];
	const contrastUsed = watch("contrastUsed");
	// كل ما يظهر هنا مشتق من قدرات طريقة التصوير: السونار بلا جرعة ولا تباين،
	// والمقطعية تعرض CTDIvol/DLP، والأشعة السينية kVp/mAs/DAP
	const caps = modalityCapabilities(item.modality);

	const toggleView = (view: string, checked: boolean) => {
		setValue(
			"viewsPerformed",
			checked ? [...viewsPerformed, view] : viewsPerformed.filter((v) => v !== view),
		);
	};

	// المطلوب عند الطلب يتصدّر ثم المقترحات المصنّفة حسب طريقة التصوير
	const requestedViews = item.views.filter(Boolean);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2">
				<Label className="text-sm font-medium">{caps.protocolLabel} المُنفَّذة</Label>
				{requestedViews.length > 0 && (
					<div className="flex flex-wrap gap-1.5">
						{requestedViews.map((view) => (
							<ToggleChip
								key={view}
								active={viewsPerformed.includes(view)}
								disabled={isPending}
								onClick={() => toggleView(view, !viewsPerformed.includes(view))}
							>
								{view}
							</ToggleChip>
						))}
					</div>
				)}
				{caps.protocolGroups.map((group) => {
					const extras = group.options.filter((v) => !requestedViews.includes(v));
					if (extras.length === 0) return null;
					return (
						<details
							key={group.label}
							className="rounded-md border"
						>
							<summary className="cursor-pointer p-2 text-xs font-medium text-muted-foreground">
								{group.label}
							</summary>
							<div className="flex flex-wrap gap-1.5 p-2 pt-0">
								{extras.map((view) => (
									<ToggleChip
										key={view}
										active={viewsPerformed.includes(view)}
										disabled={isPending}
										onClick={() => toggleView(view, !viewsPerformed.includes(view))}
									>
										{view}
									</ToggleChip>
								))}
							</div>
						</details>
					);
				})}
			</div>

			<div className="grid grid-cols-2 gap-3">
				<Field>
					<Label className="text-xs">عدد التعريضات</Label>
					<Input
						type="number"
						min={0}
						disabled={isPending}
						{...register("exposuresCount")}
					/>
				</Field>
				<Field>
					<Label className="text-xs">عدد الإعادات</Label>
					<Input
						type="number"
						min={0}
						disabled={isPending}
						{...register("retakeCount")}
					/>
				</Field>
			</div>

			{/* الجرعة الإشعاعية — تظهر لطرق التصوير المؤيّنة وحدها بحقولها هي.
			    السونار والرنين لا إشعاع فيهما فلا معنى لعرض هذه الكتلة أصلًا. */}
			{caps.doseFields.length > 0 && (
				<div className="flex flex-col gap-2">
					<Label className="text-sm font-medium">التعريض والجرعة الإشعاعية</Label>
					<div className="grid grid-cols-3 gap-3">
						{caps.doseFields.map((field) => {
							const meta = DOSE_FIELD_META[field];
							return (
								<Field key={field}>
									<Label className="text-xs">{meta.unit}</Label>
									<Input
										type="number"
										step={meta.step}
										min={0}
										title={meta.label}
										disabled={isPending}
										{...register(field)}
									/>
								</Field>
							);
						})}
					</div>
				</div>
			)}

			{/* التباين — لطرق التصوير التي تقبله فقط (لا معنى له في السونار) */}
			{caps.contrast && (
				<div className="flex flex-col gap-2 rounded-md border p-3">
					<div className="flex items-center justify-between gap-2">
						<Label className="text-sm font-medium">أُعطي تباين؟</Label>
						<Controller
							name="contrastUsed"
							control={control}
							render={({ field }) => (
								<Switch
									checked={field.value === true}
									onCheckedChange={field.onChange}
									disabled={isPending}
								/>
							)}
						/>
					</div>
					{contrastUsed === true && (
						<div className="grid grid-cols-2 gap-3 pt-1">
							<Field>
								<Label className="text-xs">مادة التباين</Label>
								<Input
									placeholder="مثال: Iohexol 300"
									disabled={isPending}
									{...register("contrastAgent")}
								/>
							</Field>
							<Field>
								<Label className="text-xs">طريق الإعطاء</Label>
								<Controller
									name="contrastRoute"
									control={control}
									render={({ field }) => (
										<Select
											value={field.value ?? ""}
											onValueChange={(v) =>
												field.onChange((v || null) as ContrastRoute | null)
											}
											disabled={isPending}
										>
											<SelectTrigger dir="rtl">
												<SelectValue placeholder="اختر" />
											</SelectTrigger>
											<SelectContent
												position="popper"
												dir="rtl"
											>
												{Object.values(ContrastRoute).map((route) => (
													<SelectItem
														key={route}
														value={route}
													>
														{CONTRAST_ROUTE_LABELS[route]}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
							</Field>
							<Field>
								<Label className="text-xs">الحجم (مل)</Label>
								<Input
									type="number"
									step="0.1"
									min={0}
									disabled={isPending}
									{...register("contrastVolumeMl")}
								/>
							</Field>
							<Field>
								<Label className="text-xs">رقم التشغيلة</Label>
								<Input
									disabled={isPending}
									{...register("contrastLot")}
								/>
							</Field>
						</div>
					)}
				</div>
			)}

			<Field>
				<Label className="text-sm font-medium">ملاحظات التنفيذ</Label>
				<Textarea
					rows={2}
					disabled={isPending}
					{...register("executionNotes")}
				/>
			</Field>
		</div>
	);
}
