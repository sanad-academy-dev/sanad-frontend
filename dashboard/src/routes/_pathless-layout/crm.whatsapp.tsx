import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	useCrmWhatsappSettings,
	useCrmWhatsappSettingsActions,
} from "@/features/crm/hooks/use-crm-whatsapp";
import { CrmModuleHeader } from "@/features/crm/navigation/crm-module-header";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/lib/permissions";
import {
	type WhatsappCredentialsFormInput,
	whatsappCredentialsSchema,
} from "@sanad/contracts/runtime/server/crm/crm-whatsapp/crm-whatsapp.type";

/**
 * [CRM-P4] «واتساب» (§9.2) — ربط رقم الأكاديمية بالقناة.
 *
 * الشاشة تلصق بيانات الاعتماد ولا تعرض رمز QR: الاقتران يتمّ في لوحة المزوّد نفسه
 * (قرار وليّ الأمر)، وما يلزم هنا هو `idInstance` و`apiTokenInstance` فقط.
 *
 * ولا مسار قراءةٍ يعيد ما لُصق: الحقلان يخرجان فارغين بعد الحفظ دائمًا، والشاشة تعرض
 * «مضبوطة» لا القيمة (§17.2 صفّ ١٩). فارغٌ هنا لا يعني «غير مضبوط» — تقرأ الحالة من
 * بطاقات الحالة لا من الحقل.
 *
 * [UI] على عقد `/services/staff` بقدر ما ينطبق على شاشة إعدادات:
 *   • ينطبق — شريط تبويبات الوحدة، شريط الحالة، شريط الأدوات بإجراءاته، وبنية النموذج
 *     (أقسام ثمّ أزرار) بمقاسات المرجع نفسها.
 *   • لا ينطبق — الجدول والترقيم وحالات «لا نتائج»: لا قائمة هنا تُرقَّم أو تُصفَّى،
 *     وشريط بحثٍ أو تصفيةٍ فوق نموذجٍ من حقلين زينةٌ لا وظيفة.
 * «حالة القناة» كانت بطاقة نصيّة فصارت شريط الحالة نفسه الذي تستخدمه الشاشات الخمس،
 * لأنّ ما تعرضه هو بالضبط ما يعرضه ذلك الشريط: أربع قيم موجزة تُقرأ بنظرة.
 */
export const Route = createFileRoute("/_pathless-layout/crm/whatsapp")({
	component: CrmWhatsappRoute,
});

const formatAt = (value: string | Date): string =>
	new Date(value).toLocaleString("ar", { dateStyle: "short", timeStyle: "short" });

function CrmWhatsappRoute() {
	const { hasPermission } = usePermissions();
	const canEdit = hasPermission(PERMISSIONS.CRM_SETTINGS_EDIT);

	const { settings, isLoading } = useCrmWhatsappSettings();
	const { saveCredentials, clearCredentials, isSaving } = useCrmWhatsappSettingsActions();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<WhatsappCredentialsFormInput>({
		resolver: zodResolver(whatsappCredentialsSchema),
		defaultValues: { instanceId: "", apiToken: "" },
	});

	const encryptionReady = settings?.encryptionReady ?? false;
	const configured = settings?.configured ?? false;
	const disabled = isSaving || !canEdit || !encryptionReady;

	const submit = handleSubmit(async (values) => {
		await saveCredentials(values);
		reset({ instanceId: "", apiToken: "" });
	});

	// شريط الحالة — قيم نصيّة عبر valueLabel، فبطاقة الإحصاء تعرضه كما تعرض العدد
	const stats = useMemo<StatItem[]>(
		() => [
			{
				title: "حالة القناة",
				value: 0,
				valueLabel: isLoading ? "…" : configured ? "مضبوطة" : "غير مضبوطة",
				tooltip:
					"«مضبوطة» تعني أنّ بيانات الاعتماد محفوظة مشفَّرة. ما دامت غير مضبوطة تبقى القناة يدويّة ولا تُرسَل رسالة.",
			},
			{
				title: "المزوّد",
				value: 0,
				valueLabel: settings?.provider ?? "MANUAL",
				tooltip: "المزوّد الذي تمرّ عبره الرسائل. MANUAL يعني التسجيل فقط بلا إرسال (§9.2).",
			},
			{
				title: "التشفير",
				value: 0,
				valueLabel: isLoading ? "…" : encryptionReady ? "جاهز" : "غير مُهيَّأ",
				tooltip:
					"مفتاح التشفير على الخادم. بدونه لا يمكن حفظ بيانات الاعتماد إطلاقًا، ويبقى الحقلان معطَّلين.",
			},
			{
				title: "حالة الاتصال",
				value: 0,
				valueLabel: settings?.connectionState ?? "—",
				tooltip: settings?.checkedAt
					? `آخر فحص ${formatAt(settings.checkedAt)}`
					: "لم يُفحص الاتصال بعد — يُفحص عند الحفظ ومع دورة المهام.",
			},
		],
		[isLoading, configured, encryptionReady, settings],
	);

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<CrmModuleHeader active="/crm/whatsapp" />

			<Stats
				className="px-4 grid-cols-4"
				stats={stats}
			/>

			<TableToolbar
				className="border-t"
				// لا قائمة هنا: لا بحث ولا تصفية ولا عرض ولا تصدير — شريط الأدوات يحمل الإجراءات وحدها
				showSearch={false}
				showFilter={false}
				showExport={false}
				showView={false}
				buttonSize="xs"
				actions={
					<>
						{!canEdit ? (
							<span className="text-[11px] text-muted-foreground">
								لا تملك صلاحية تعديل الإعدادات
							</span>
						) : null}
						{configured ? (
							<Button
								type="button"
								size="sm"
								variant="outline"
								disabled={isSaving || !canEdit}
								onClick={() => void clearCredentials()}
							>
								فصل الاتصال
							</Button>
						) : null}
						<Button
							type="button"
							size="sm"
							disabled={disabled}
							onClick={() => void submit()}
						>
							حفظ
						</Button>
					</>
				}
			/>

			{!encryptionReady && !isLoading ? (
				<div className="border-b bg-muted/30 px-4 py-2.5">
					<p className="font-medium text-destructive text-sm">التشفير غير مُهيَّأ على الخادم</p>
					<p className="text-muted-foreground text-xs">
						لا يمكن حفظ بيانات الاعتماد حتى يُضبط مفتاح التشفير — الحقلان أدناه معطَّلان.
					</p>
				</div>
			) : null}

			{!configured && !isLoading ? (
				<div className="border-b bg-muted/30 px-4 py-2.5">
					<p className="font-medium text-sm">القناة يدويّة الآن</p>
					<p className="text-muted-foreground text-xs">
						ما دامت غير مضبوطة تبقى القناة «يدويّة»: الرسائل تُسجَّل بحالة «فشل الإرسال» مع السبب،
						ولا تُرسَل.
					</p>
				</div>
			) : null}

			{/* بنية النموذج كبنية أوراق المرجع: أقسام في p-4/gap-4 بعنوان قسمٍ نصف عريض */}
			<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
				<p className="text-right font-semibold text-sm">بيانات الاتصال</p>

				{/* §17 — بوّابةٌ غير رسميّة: الرقم رقم الأكاديمية نفسه، والحظر خطرٌ مقبول في v1 */}
				<p className="text-[11px] text-muted-foreground">
					الاقتران يتمّ في لوحة المزوّد (مسح رمز QR برقم الأكاديمية)، ثمّ يُلصق هنا «معرّف النسخة»
					و«رمز الوصول». القيم تُحفظ مشفَّرة ولا تُعاد إلى الشاشة بعد الحفظ.
				</p>

				<Field data-invalid={!!errors.instanceId}>
					<FieldLabel htmlFor="wa-instance">معرّف النسخة</FieldLabel>
					<Input
						id="wa-instance"
						dir="ltr"
						autoComplete="off"
						placeholder={configured ? "محفوظ — اكتب قيمة جديدة لاستبداله" : "idInstance"}
						aria-invalid={!!errors.instanceId}
						disabled={disabled}
						{...register("instanceId")}
					/>
					<FieldError errors={[errors.instanceId]} />
				</Field>

				<Field data-invalid={!!errors.apiToken}>
					<FieldLabel htmlFor="wa-token">رمز الوصول</FieldLabel>
					<Input
						id="wa-token"
						type="password"
						dir="ltr"
						autoComplete="off"
						placeholder={configured ? "محفوظ — اكتب قيمة جديدة لاستبداله" : "apiTokenInstance"}
						aria-invalid={!!errors.apiToken}
						disabled={disabled}
						{...register("apiToken")}
					/>
					<FieldError errors={[errors.apiToken]} />
					<FieldDescription>
						رمز الوصول يفتح حساب واتساب الأكاديمية — تعامل معه كما تتعامل مع كلمة مرور.
					</FieldDescription>
				</Field>
			</div>
		</div>
	);
}
