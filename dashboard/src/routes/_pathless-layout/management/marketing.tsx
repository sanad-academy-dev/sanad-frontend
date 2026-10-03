import { createFileRoute, redirect } from "@tanstack/react-router";

import { AdCampaignsPage } from "@/features/marketing/ad-campaigns/components/ad-campaigns-page";
import { getSession } from "@/functions/get-session";
import { PERMISSIONS } from "@/lib/permissions";

/**
 * [MK0.3] وجهة التسويق. الشريط الجانبي يعلن «التسويق» منذ ما قبل الوحدة، وكان الرابط
 * يشير إلى مسار غير موجود — هذا الملف هو ما يجعله يصل إلى شيء.
 *
 * الوحدة اليوم = الحملات الاعلانية وحدها (§1.4 من الخطة: بقية الفروع مبحوثة لكن غير
 * مرسومة). حين تصل الفروع الأخرى تتحول هذه الوجهة إلى صفحة أمّ بتبويبات.
 */
export const Route = createFileRoute("/_pathless-layout/management/marketing")({
	component: AdCampaignsPage,
	// الحارس يخفي الصفحة؛ التأمين الفعلي في ad-campaigns.controller
	beforeLoad: async () => {
		const { session } = await getSession();
		if (session?.session.role === "MEMBER") {
			const perms: string[] = JSON.parse(session.session.permissions ?? "[]");
			const canView =
				perms.includes(PERMISSIONS.MARKETING_VIEW_LIMITED) ||
				perms.includes(PERMISSIONS.MARKETING_VIEW_FULL);
			if (!canView) throw redirect({ to: "/dashboard" });
		}
	},
});
