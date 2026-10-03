import { IconLink } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Container, ContainerRow } from "@/components/common/container";
import { Spinner } from "@/components/common/spinner";
import { showSuccessToast } from "@/components/common/success-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SettingsPageWrapper } from "@/features/settings/components/settings-page-wrapper";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";
import { useUpdateClinicInfo } from "@/features/settings/services/hooks/use-update-clinic-info";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_pathless-layout/management/settings/attendance")({
	component: RouteComponent,
});

// رمز PIN لوضع الكشك مكوّن من 5 أرقام بالضبط — يطابق شاشة الإدخال في الكشك
const PIN_LENGTH = 5;

function RouteComponent() {
	const { clinicInfo, isLoading } = useClinicInfo();
	const { updateClinicInfo, isPending } = useUpdateClinicInfo();

	const attendanceEnabled = clinicInfo?.attendanceEnabled ?? false;
	const kioskEnabled = clinicInfo?.kioskEnabled ?? false;
	// وضع الكشك لا يُفعَّل إلا بعد حفظ رمز PIN صالح (5 أرقام)
	const hasValidPin = (clinicInfo?.kioskPin ?? "").length === PIN_LENGTH;

	// رمز PIN كحالة محلية حتى يمكن تعديله ثم حفظه عند الخروج من الحقل
	const [pin, setPin] = useState("");
	useEffect(() => {
		if (clinicInfo) setPin(clinicInfo.kioskPin ?? "");
	}, [clinicInfo]);
	const pinInvalid = attendanceEnabled && pin.length !== PIN_LENGTH;

	// رابط شاشة الكشك على نفس أصل الخادم — يُصحَّح إلى الأصل الحقيقي بعد التحميل
	const [origin, setOrigin] = useState("");
	useEffect(() => {
		setOrigin(window.location.origin);
	}, []);
	const kioskUrl = origin ? `${origin.replace(/\/$/, "")}/services/staff` : "";

	const savePin = () => {
		const next = pin.replace(/\D/g, "");
		// لا نحفظ إلا رمزًا صالحًا (5 أرقام)؛ خلاف ذلك نُعيد القيمة المحفوظة
		if (next.length !== PIN_LENGTH) {
			setPin(clinicInfo?.kioskPin ?? "");
			return;
		}
		if (next === (clinicInfo?.kioskPin ?? "")) return;
		updateClinicInfo({ kioskPin: next });
	};

	// منع تفعيل وضع الكشك قبل حفظ رمز PIN صالح
	const handleKioskToggle = (checked: boolean) => {
		if (checked && !hasValidPin) {
			toast.error("أدخل رمز PIN المكوّن من 5 أرقام أولًا لتفعيل وضع الكشك");
			return;
		}
		updateClinicInfo({ kioskEnabled: checked });
	};

	const copyKioskUrl = async () => {
		if (!kioskUrl) return;

		const markCopied = () => showSuccessToast("تم نسخ الرابط بنجاح");

		// المسار الحديث — متاح فقط في سياق آمن (HTTPS أو localhost)
		if (navigator.clipboard?.writeText) {
			try {
				await navigator.clipboard.writeText(kioskUrl);
				markCopied();
				return;
			} catch {
				// يفشل خارج السياق الآمن — نكمل للحل البديل
			}
		}

		// حل بديل يعمل على HTTP عبر textarea مؤقت + execCommand
		try {
			const textarea = document.createElement("textarea");
			textarea.value = kioskUrl;
			textarea.setAttribute("readonly", "");
			textarea.style.position = "fixed";
			textarea.style.opacity = "0";
			document.body.appendChild(textarea);
			textarea.focus();
			textarea.select();
			const ok = document.execCommand("copy");
			document.body.removeChild(textarea);
			if (ok) markCopied();
		} catch {
			// تعذّر النسخ — تجاهل بصمت
		}
	};

	if (isLoading) {
		return (
			<SettingsPageWrapper>
				<Spinner />
			</SettingsPageWrapper>
		);
	}

	return (
		<SettingsPageWrapper>
			<Container
				title="الحضور والانصراف"
				description="تخصيص أيام وساعات العمل لاستقبال الجلسات في الأكاديمية / المركز / المستشفى."
			>
				<ContainerRow
					title="فتح الحضور والانصراف"
					subtitle="بمجرد النقر على الزر، يمكنك تفعيل الحضور والانصراف بالمنشأة."
					action={
						<Switch
							checked={attendanceEnabled}
							onCheckedChange={(checked) =>
								// إيقاف الحضور يُطفئ وضع الكشك تلقائيًا حتى تبقى الحالة متسقة
								updateClinicInfo(
									checked
										? { attendanceEnabled: true }
										: { attendanceEnabled: false, kioskEnabled: false },
								)
							}
							disabled={isPending}
						/>
					}
				/>

				<ContainerRow
					title="تفعيل وضع الكشك"
					subtitle="السماح بتفعيل وضع الكشك لتسجيل دخول الموظفين برمز الـ PIN Code."
					// معطّل حتى يُفعَّل الحضور والانصراف أولًا
					className={cn(!attendanceEnabled && "opacity-50")}
					action={
						<div className="flex items-center gap-2">
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={copyKioskUrl}
								disabled={!kioskUrl || !attendanceEnabled}
								className="gap-1.5"
							>
								<IconLink className="size-3.5" />
								نسخ الرابط
							</Button>

							<Input
								value={pin}
								onChange={(e) =>
									setPin(e.target.value.replace(/\D/g, "").slice(0, PIN_LENGTH))
								}
								onBlur={savePin}
								inputMode="numeric"
								dir="ltr"
								required
								maxLength={PIN_LENGTH}
								placeholder="5 أرقام"
								aria-label="رمز PIN لوضع الكشك"
								aria-invalid={pinInvalid}
								disabled={isPending || !attendanceEnabled}
								className="h-8 w-20 text-center"
							/>

							<Switch
								checked={kioskEnabled}
								onCheckedChange={handleKioskToggle}
								disabled={isPending || !attendanceEnabled}
							/>
						</div>
					}
				/>
			</Container>
		</SettingsPageWrapper>
	);
}
