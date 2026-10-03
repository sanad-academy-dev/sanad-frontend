import { createFileRoute, redirect } from "@tanstack/react-router";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DispatchBoard } from "@/features/mobile-clinics/components/dispatch-board";
import { FleetLiveView } from "@/features/mobile-clinics/components/fleet-live-view";
import { MobileServicesView } from "@/features/mobile-clinics/components/mobile-services-view";
import { MobileUnitsView } from "@/features/mobile-clinics/components/mobile-units-view";
import { RequestsQueue } from "@/features/mobile-clinics/components/requests-queue";
import { getSession } from "@/functions/get-session";
import { useI18n } from "@/hooks/use-i18n";
import { PERMISSIONS } from "@/lib/permissions";

/**
 * [MC1.3] أسطول الأكاديميات المتنقلة، [MC3.5] الخريطة الحيّة، [MC5.2] لوحة الإرسال.
 *
 * مقطع ساكن يسبق `care.$slug` الديناميكي، فيحلّ محلّ الصفحة النائبة التي كان الشريط
 * الجانبي يشير إليها منذ ما قبل الوحدة. لوحة الإرسال تنضمّ كتبويب ثالث في [MC5.2].
 */
export const Route = createFileRoute("/_pathless-layout/care/mobile-clinic")({
	component: MobileClinicPage,
	// الحارس يُخفي الصفحة؛ التأمين الفعلي في mobile-units.controller
	beforeLoad: async () => {
		const { session } = await getSession();
		if (session?.session.role === "MEMBER") {
			const perms: string[] = JSON.parse(session.session.permissions ?? "[]");
			const canView =
				perms.includes(PERMISSIONS.MOBILE_CLINICS_VIEW_LIMITED) ||
				perms.includes(PERMISSIONS.MOBILE_CLINICS_VIEW_FULL);
			if (!canView) throw redirect({ to: "/dashboard" });
		}
	},
});

function MobileClinicPage() {
	const { t } = useI18n();

	return (
		<Tabs
			/* بدونها يفرض Radix dir="ltr" على جذر التبويبات فينقلب محتوى كل تبويب */
			dir="rtl"
			defaultValue="live"
			className="flex min-h-0 flex-1 flex-col gap-0"
		>
			<div className="flex items-center justify-between gap-4 border-b px-4 py-2">
				<div className="flex flex-col">
					{/*
					  الاسم يأتي من مفتاح الشريط الجانبي نفسه لا من نصّ مكرَّر: نسختان
					  مستقلّتان هما ما جعل الشريط يقول «الأكاديمية المتنقلة» والصفحة التي
					  يفتحها تقول «الأكاديميات المتنقلة». مصدرٌ واحد يمنع تكرار ذلك.
					*/}
					<h1 className="text-sm font-semibold">{t("sidebar.items.mobileClinic")}</h1>
					<span className="text-xs text-muted-foreground">
						متابعة المركبات مباشرة وإدارة الأسطول وطواقمه ومستودعاته
					</span>
				</div>
				<TabsList className="w-fit">
					<TabsTrigger value="live">الخريطة الحيّة</TabsTrigger>
					<TabsTrigger value="dispatch">لوحة الإرسال</TabsTrigger>
					<TabsTrigger value="requests">الطلبات</TabsTrigger>
					<TabsTrigger value="fleet">الأسطول</TabsTrigger>
					<TabsTrigger value="services">الدورات</TabsTrigger>
				</TabsList>
			</div>

			<TabsContent
				value="live"
				className="flex min-h-0 flex-1 flex-col"
			>
				<FleetLiveView />
			</TabsContent>

			<TabsContent
				value="dispatch"
				className="flex min-h-0 flex-1 flex-col"
			>
				<DispatchBoard />
			</TabsContent>

			<TabsContent
				value="requests"
				className="flex min-h-0 flex-1 flex-col"
			>
				<RequestsQueue />
			</TabsContent>

			<TabsContent
				value="fleet"
				className="flex min-h-0 flex-1 flex-col"
			>
				<MobileUnitsView />
			</TabsContent>

			<TabsContent
				value="services"
				className="flex min-h-0 flex-1 flex-col"
			>
				<MobileServicesView />
			</TabsContent>
		</Tabs>
	);
}
