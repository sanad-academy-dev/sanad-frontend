import { zodResolver } from "@hookform/resolvers/zod";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { Badge } from "@/components/ui/badge";
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
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
	useLabParameterMutations,
	useLabParameters,
} from "@/features/services/lab-tests/hooks/use-lab-templates";
import { SopSettingsSection } from "@/features/settings/sops/components/sop-settings-section";
import { LabParameterType, SopDomain } from "@/generated/prisma/enums";
import { useFormProgress } from "@/hooks/use-form-progress";
import { useI18n } from "@/hooks/use-i18n";
import {
	type LabParameterFormInput,
	type LabParameterFormValues,
	type LabTestParameterResponse,
	labParameterSchema,
} from "@sanad/contracts/runtime/server/lab-test-parameters/lab-test-parameters.type";

/** Decimal يصل من الخادم كنص */
const toNumber = (value: unknown): number | null => {
	if (value == null || value === "") return null;
	const n = Number(value);
	return Number.isFinite(n) ? n : null;
};

const rangeLabel = (parameter: LabTestParameterResponse) => {
	if (parameter.type === LabParameterType.TEXT) return "نصي";
	const low = toNumber(parameter.refLow);
	const high = toNumber(parameter.refHigh);
	if (low == null && high == null) return "غير محدّد";
	if (low != null && high != null) return `${low} – ${high}`;
	return low != null ? `≥ ${low}` : `≤ ${high}`;
};

const TYPE_LABELS: Record<LabParameterType, string> = {
	[LabParameterType.NUMERIC]: "رقمي (له نطاق طبيعي)",
	[LabParameterType.TEXT]: "نصي (سالب/موجب)",
};

const EMPTY_FORM: LabParameterFormInput = {
	name: "",
	section: "",
	unit: "",
	type: LabParameterType.NUMERIC,
	refLow: null,
	refHigh: null,
	order: 0,
	active: true,
};

// إدارة مُحلِّلات تحليل واحد — تُفتح من زر بجانب التحليل في جدول الدورات.
// التحليل المركّب (مثل CBC) يضم عدة مُحلِّلات، لكلٍّ وحدة ونطاق طبيعي؛
// أي نتيجة خارج النطاق تُعلَّم كقيمة حرجة.
export function LabParametersSheet({
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
	const { parameters, isLoading } = useLabParameters(open ? serviceId : null);
	const { createParameter, updateParameter, deleteParameter, isPending } =
		useLabParameterMutations();
	// null = النموذج مغلق، "new" = إضافة، وإلا معرّف المُحلِّل قيد التعديل
	const [editing, setEditing] = useState<string | null>(null);

	// الأقسام المستدورة حاليًا — للاقتراح في حقل القسم
	const existingSections = useMemo(
		() => [...new Set(parameters.map((p) => p.section).filter((s): s is string => !!s))],
		[parameters],
	);

	// المُحلِّلات مجمّعة حسب القسم (بلا قسم تأتي أولًا)
	const groupedParameters = useMemo(() => {
		const groups = new Map<string, LabTestParameterResponse[]>();
		for (const parameter of parameters) {
			const key = parameter.section?.trim() || "";
			const list = groups.get(key) ?? [];
			list.push(parameter);
			groups.set(key, list);
		}
		return [...groups.entries()].sort(([a], [b]) => (a === "" ? -1 : b === "" ? 1 : 0));
	}, [parameters]);

	const {
		register,
		handleSubmit,
		control,
		reset,
		watch,
		formState: { errors },
	} = useForm<LabParameterFormInput, unknown, LabParameterFormValues>({
		resolver: zodResolver(labParameterSchema),
		defaultValues: EMPTY_FORM,
	});

	const values = watch();
	const formProgress = useFormProgress({ schema: labParameterSchema, values });
	// عدد مرات تعديل المُحلِّل قيد التحرير المحفوظ في قاعدة البيانات
	const changesCount =
		parameters.find((parameter) => parameter.id === editing)?.editsCount ?? 0;

	// إغلاق اللوحة يُنهي أي تحرير مفتوح
	useEffect(() => {
		if (!open) setEditing(null);
	}, [open]);

	const startAdd = () => {
		reset({ ...EMPTY_FORM, order: parameters.length });
		setEditing("new");
	};

	const startEdit = (parameter: LabTestParameterResponse) => {
		reset({
			name: parameter.name,
			section: parameter.section ?? "",
			unit: parameter.unit ?? "",
			type: parameter.type,
			refLow: toNumber(parameter.refLow),
			refHigh: toNumber(parameter.refHigh),
			order: parameter.order,
			active: parameter.active,
		});
		setEditing(parameter.id);
	};

	const type = values.type;
	const isNumeric = type === LabParameterType.NUMERIC;

	const onSubmit = handleSubmit(async (values) => {
		// النطاق لا معنى له للمُحلِّل النصي
		const payload = {
			...values,
			refLow: isNumeric ? (values.refLow ?? null) : null,
			refHigh: isNumeric ? (values.refHigh ?? null) : null,
		};
		try {
			if (editing && editing !== "new") await updateParameter({ id: editing, ...payload });
			else await createParameter({ ...payload, serviceId });
		} catch {
			return; // الفشل يُبقي النموذج مفتوحًا بقيمه (التوست يعرض السبب)
		}
		setEditing(null);
	});

	useHotkey("Mod+Enter", () => onSubmit(), { enabled: open && editing !== null });

	return (
		<Sheet
			open={open}
			onOpenChange={onOpenChange}
		>
			<SheetContent
				side={side}
				showCloseButton={false}
				className="w-full gap-0 p-0 sm:max-w-lg"
				dir="rtl"
			>
				<FormHeader
					title="المُحلِّلات"
					identity={serviceName ? { name: serviceName } : null}
					changesCount={changesCount}
					progress={formProgress}
					onClose={() => onOpenChange(false)}
				/>

				<div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
					<p className="text-[11px] text-muted-foreground">
						التحليل المركّب يضم عدة مُحلِّلات (مثل CBC: WBCs و RBCs و Platelets). أي نتيجة خارج
						النطاق الطبيعي تُعلَّم كقيمة حرجة. اتركه بلا مُحلِّلات ليُسجَّل بنتيجة واحدة.
					</p>

					{isLoading ? (
						<Skeleton className="h-32 w-full rounded-[4px]" />
					) : (
						<div className="rounded-[4px] border">
							<div className="grid grid-cols-[2fr_1fr_1.3fr_auto] gap-2 border-b px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
								<span>المُحلِّل</span>
								<span>الوحدة</span>
								<span>النطاق الطبيعي</span>
								<span />
							</div>

							{parameters.length === 0 ? (
								<p className="px-3 py-6 text-center text-xs text-muted-foreground">
									لا مُحلِّلات بعد
								</p>
							) : (
								groupedParameters.map(([section, items]) => (
									<div key={section || "__none__"}>
										{section && (
											<p className="border-b bg-muted/40 px-3 py-1 text-[11px] font-bold text-foreground">
												{section}
											</p>
										)}
										{items.map((parameter) => (
											<div
												key={parameter.id}
												className="grid grid-cols-[2fr_1fr_1.3fr_auto] items-center gap-2 border-b px-3 py-1.5 text-xs last:border-b-0"
											>
												<span className="flex items-center gap-1.5 truncate font-medium">
													{parameter.name}
													{!parameter.active && (
														<Badge
															variant="outline"
															className="text-[9px] text-muted-foreground"
														>
															معطّل
														</Badge>
													)}
												</span>
												<span className="truncate text-muted-foreground">
													{parameter.unit || "—"}
												</span>
												<span className="tabular-nums text-muted-foreground">
													{rangeLabel(parameter)}
												</span>
												<span className="flex items-center gap-1">
													<Button
														size="icon-xs"
														variant="ghost"
														aria-label={`تعديل ${parameter.name}`}
														disabled={isPending}
														onClick={() => startEdit(parameter)}
													>
														<IconPencil className="size-3.5" />
													</Button>
													<Button
														size="icon-xs"
														variant="ghost"
														className="text-muted-foreground hover:text-destructive"
														aria-label={`حذف ${parameter.name}`}
														disabled={isPending}
														onClick={() => {
															// التوست يعرض الخطأ — نبتلع الرفض حتى لا يبقى غير معالج
															void deleteParameter(parameter.id).catch(() => {});
														}}
													>
														<IconTrash className="size-3.5" />
													</Button>
												</span>
											</div>
										))}
									</div>
								))
							)}
						</div>
					)}

					{editing === null ? (
						<Button
							size="sm"
							variant="outline"
							className="w-fit"
							onClick={startAdd}
						>
							<IconPlus className="size-3.5" />
							إضافة مُحلِّل
						</Button>
					) : (
						<form
							onSubmit={onSubmit}
							className="flex flex-col gap-3 rounded-[4px] border p-3"
						>
							<p className="text-xs font-bold">
								{editing === "new" ? "مُحلِّل جديد" : "تعديل المُحلِّل"}
							</p>

							<div className="grid grid-cols-2 gap-3">
								<Field data-invalid={!!errors.name}>
									<Label
										htmlFor="param-name"
										className="text-xs font-semibold"
									>
										الاسم
									</Label>
									<Input
										id="param-name"
										placeholder="مثال: WBCs"
										disabled={isPending}
										aria-invalid={!!errors.name}
										{...register("name")}
									/>
									<FieldError errors={[errors.name]} />
								</Field>

								<Field data-invalid={!!errors.unit}>
									<Label
										htmlFor="param-unit"
										className="text-xs font-semibold"
									>
										وحدة القياس
									</Label>
									<Input
										id="param-unit"
										placeholder="مثال: 10^3/µL"
										disabled={isPending}
										{...register("unit")}
									/>
									<FieldError errors={[errors.unit]} />
								</Field>
							</div>

							{/* القسم — يُجمّع المُحلِّلات في واجهة إدخال النتائج */}
							<Field data-invalid={!!errors.section}>
								<Label
									htmlFor="param-section"
									className="text-xs font-semibold"
								>
									القسم
									<span className="ms-2 text-[11px] font-normal text-muted-foreground">
										اختياري — يُجمّع المُحلِّلات في واجهة النتائج
									</span>
								</Label>
								<Input
									id="param-section"
									list="lab-section-suggestions"
									placeholder="مثال: الفحص الجسدي، الفحص الكيميائي (Dipstick)"
									disabled={isPending}
									{...register("section")}
								/>
								{/* اقتراحات من الأقسام المستدورة في هذا التحليل */}
								<datalist id="lab-section-suggestions">
									{existingSections.map((s) => (
										<option
											key={s}
											value={s}
										/>
									))}
								</datalist>
								<FieldError errors={[errors.section]} />
							</Field>

							<Controller
								name="type"
								control={control}
								render={({ field }) => (
									<Field data-invalid={!!errors.type}>
										<Label className="text-xs font-semibold">نوع القيمة</Label>
										<Select
											dir="rtl"
											value={field.value}
											onValueChange={field.onChange}
											disabled={isPending}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											{/* popper إجباري: التموضع الافتراضي يظهر خارج الشاشة في RTL */}
											<SelectContent
												dir="rtl"
												position="popper"
											>
												{Object.values(LabParameterType).map((value) => (
													<SelectItem
														key={value}
														value={value}
													>
														{TYPE_LABELS[value]}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FieldError errors={[errors.type]} />
									</Field>
								)}
							/>

							{isNumeric && (
								<div className="grid grid-cols-2 gap-3">
									<Field data-invalid={!!errors.refLow}>
										<Label
											htmlFor="param-low"
											className="text-xs font-semibold"
										>
											الحد الأدنى
										</Label>
										<Input
											id="param-low"
											type="number"
											step="any"
											placeholder="4.0"
											disabled={isPending}
											aria-invalid={!!errors.refLow}
											{...register("refLow")}
										/>
										<FieldError errors={[errors.refLow]} />
									</Field>

									<Field data-invalid={!!errors.refHigh}>
										<Label
											htmlFor="param-high"
											className="text-xs font-semibold"
										>
											الحد الأعلى
										</Label>
										<Input
											id="param-high"
											type="number"
											step="any"
											placeholder="12.0"
											disabled={isPending}
											aria-invalid={!!errors.refHigh}
											{...register("refHigh")}
										/>
										<FieldError errors={[errors.refHigh]} />
									</Field>
								</div>
							)}

							<Controller
								name="active"
								control={control}
								render={({ field }) => (
									<div className="flex items-center justify-between gap-3">
										<span className="text-xs">
											مُفعَّل
											<span className="ms-2 text-[11px] text-muted-foreground">
												المعطّل لا يظهر في جدول إدخال النتائج
											</span>
										</span>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
											disabled={isPending}
											aria-label="تفعيل المُحلِّل"
										/>
									</div>
								)}
							/>

							<FormFooter className="border-t-0 px-0 py-0">
								<Button
									type="button"
									size="sm"
									variant="outline"
									disabled={isPending}
									onClick={() => setEditing(null)}
								>
									إلغاء
								</Button>
								<Button
									type="submit"
									size="sm"
									disabled={isPending}
								>
									{editing === "new" ? "إضافة" : "حفظ"}
								</Button>
							</FormFooter>
						</form>
					)}
					{/* بروتوكول العمل القياسي — قسم مكدّس بعد المُحلِّلات، وحفظه مستقل */}
					<SopSettingsSection
						domain={SopDomain.LAB}
						serviceId={serviceId}
						serviceName={serviceName}
					/>
				</div>

				<FormFooter showShortcut={false}>
					<Button
						size="sm"
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						إغلاق
					</Button>
				</FormFooter>
			</SheetContent>
		</Sheet>
	);
}
