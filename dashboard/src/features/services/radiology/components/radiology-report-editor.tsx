import { zodResolver } from "@hookform/resolvers/zod";
import { IconAlertTriangleFilled, IconFileText } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { UserSelectPopover } from "@/components/common/user-select-popover";
import { Field } from "@/components/ui/field";
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
import { useClinicUsers } from "@/features/dashboard/hooks/use-clinic-users";
import { RadiologyPriorsPanel } from "@/features/services/radiology/components/radiology-priors-panel";
import { useRadiologyTemplatesFor } from "@/features/services/radiology/hooks/use-radiology-extras";
import { useSaveRadiologyReport } from "@/features/services/radiology/hooks/use-radiology-mutations";
import {
	type RadiologyItemResponse,
	type RadiologyReportFormInput,
	radiologyReportSchema,
} from "@sanad/contracts/runtime/server/radiology/radiology.type";

// محرّر تقرير الأشعة — الأقسام الخمسة القياسية مع علم النتيجة الحرجة وتوثيق
// تبليغها. مساعدة الذكاء الاصطناعي ليست هنا: مكانها العارض حيث يحدّد المدرّب
// منطقة من الصورة ويسأل عنها، فالسؤال بلا صورة لا معنى له.

type RegisterSave = (save: (() => Promise<unknown>) | null) => void;

const SECTIONS: {
	key: "technique" | "comparison" | "findings" | "impression" | "recommendations";
	label: string;
	rows: number;
	required?: boolean;
	placeholder: string;
}[] = [
	{
		key: "technique",
		label: "التقنية",
		rows: 2,
		placeholder: "طريقة التصوير والإسقاطات والتباين المستخدم",
	},
	{
		key: "comparison",
		label: "المقارنة",
		rows: 1,
		placeholder: "الدراسات السابقة المقارَنة، إن وُجدت",
	},
	{
		key: "findings",
		label: "الموجودات",
		rows: 6,
		required: true,
		placeholder: "القراءة المنهجية للبنى الظاهرة في الصور",
	},
	{
		key: "impression",
		label: "الانطباع",
		rows: 3,
		required: true,
		placeholder: "الخلاصة التشخيصية",
	},
	{
		key: "recommendations",
		label: "التوصيات",
		rows: 2,
		placeholder: "متابعة، دراسات إضافية، أو ربط بالحالة السريرية",
	},
];

export function RadiologyReportEditor({
	item,
	registerSave,
}: {
	item: RadiologyItemResponse;
	registerSave: RegisterSave;
}) {
	const { saveReport, isPending } = useSaveRadiologyReport();
	// مَن أُبلغ بالنتيجة الحرجة يُختار من فريق الأكاديمية لا يُكتب نصًا
	const { users } = useClinicUsers();
	const report = item.report;

	const { control, register, getValues, setValue, watch } = useForm<RadiologyReportFormInput>({
		resolver: zodResolver(radiologyReportSchema),
		defaultValues: {
			technique: report?.technique ?? null,
			comparison: report?.comparison ?? null,
			findings: report?.findings ?? null,
			impression: report?.impression ?? null,
			recommendations: report?.recommendations ?? null,
			criticalFinding: report?.criticalFinding ?? false,
			criticalNotifiedTo: report?.criticalNotifiedTo ?? null,
			criticalNotifiedToId: report?.criticalNotifiedToId ?? null,
		},
	});

	// «إرسال للمراجعة» وإغلاق اللوحة يستدعيان هذا الحفظ — الحقول كلها اختيارية هنا،
	// واكتمال الموجودات والانطباع يُشترط عند الإرسال لا عند الحفظ
	useEffect(() => {
		registerSave(() => {
			const values = getValues();
			return saveReport({
				...values,
				criticalFinding: values.criticalFinding ?? false,
				itemId: item.id,
			});
		});
		return () => registerSave(null);
	}, [registerSave, getValues, saveReport, item.id]);

	const criticalFinding = watch("criticalFinding");

	// قوالب هذا الفحص أو طريقة تصويره — تملأ الأقسام بنقرة بدل إعادة الكتابة
	const { templates } = useRadiologyTemplatesFor({
		serviceId: item.serviceId,
		modality: item.modality,
	});
	const [appliedTemplateId, setAppliedTemplateId] = useState<string | null>(null);

	/**
	 * تطبيق قالب: لا يُمحى نصّ كتبه المدرّب. القالب يملأ الأقسام الفارغة فقط،
	 * فالنقر عليه بعد الكتابة إضافة لا إتلاف.
	 */
	const applyTemplate = (templateId: string) => {
		const tpl = templates.find((t) => t.id === templateId);
		if (!tpl) return;
		let filled = 0;
		for (const { key } of SECTIONS) {
			const incoming = tpl[key];
			if (!incoming) continue;
			const current = getValues(key);
			if (current && String(current).trim()) continue;
			setValue(key, incoming, { shouldDirty: true });
			filled++;
		}
		setAppliedTemplateId(templateId);
		toast.success(
			filled > 0
				? `طُبِّق قالب «${tpl.name}» على ${filled} قسم`
				: "الأقسام مكتوبة بالفعل — لم يُستبدل شيء",
		);
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<h4 className="text-sm font-semibold">تقرير الفحص</h4>
				{templates.length > 0 && (
					<div className="flex items-center gap-1.5">
						<IconFileText className="size-3.5 text-muted-foreground" />
						<Select
							value={appliedTemplateId ?? ""}
							onValueChange={applyTemplate}
							disabled={isPending}
							dir="rtl"
						>
							<SelectTrigger
								size="sm"
								className="h-7 min-w-44 text-[11px]"
								aria-label="تطبيق قالب تقرير"
							>
								<SelectValue placeholder="تطبيق قالب..." />
							</SelectTrigger>
							<SelectContent
								dir="rtl"
								position="popper"
							>
								{templates.map((tpl) => (
									<SelectItem
										key={tpl.id}
										value={tpl.id}
									>
										{tpl.name}
										{tpl.isDefault ? " (افتراضي)" : ""}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				)}
			</div>

			{/* الدراسات السابقة — تُقرأ قبل الكتابة وتُذكر في قسم المقارنة */}
			<RadiologyPriorsPanel itemId={item.id} />

			{SECTIONS.map(({ key, label, rows, required, placeholder }) => (
				<Field key={key}>
					<Label className="text-sm font-medium">
						{label}
						{required && <span className="ms-1 text-destructive">*</span>}
					</Label>
					<Textarea
						rows={rows}
						placeholder={placeholder}
						disabled={isPending}
						{...register(key)}
					/>
				</Field>
			))}

			{/* النتيجة الحرجة — تبليغها الموثَّق زمنيًا جزء من معيار التقارير */}
			<div className="flex flex-col gap-2 rounded-md border border-red-200 p-3">
				<div className="flex items-center justify-between gap-2">
					<Label className="flex items-center gap-1.5 text-sm font-medium text-red-700">
						<IconAlertTriangleFilled className="size-4" />
						نتيجة حرجة تستدعي تبليغًا فوريًا
					</Label>
					<Controller
						name="criticalFinding"
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
				{criticalFinding && (
					<Field>
						<Label className="text-xs">مَن أُبلغ بالنتيجة؟ (يُختم وقت التبليغ عند الحفظ)</Label>
						<Controller
							name="criticalNotifiedToId"
							control={control}
							render={({ field }) => (
								<UserSelectPopover
									users={users}
									value={field.value ?? null}
									disabled={isPending}
									placeholder="اختر المدرّب المُبلَّغ..."
									onChange={(user) => {
										field.onChange(user?.id ?? null);
										// لقطة الاسم تُحفظ مع المرجع — التبليغ وثيقة طبية
										setValue("criticalNotifiedTo", user?.name ?? null);
									}}
								/>
							)}
						/>
					</Field>
				)}
			</div>
		</div>
	);
}
