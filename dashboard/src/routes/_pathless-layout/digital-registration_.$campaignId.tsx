import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * رابط توافق فقط: التسجيل الرقمي أصبح لوحة Kanban موحدة لكل أكاديمية.
 * لا نحمّل واجهة أو بيانات مرتبطة بـ campaignId من الرابط القديم.
 */
export const Route = createFileRoute("/_pathless-layout/digital-registration_/$campaignId")({
	beforeLoad: () => {
		throw redirect({ to: "/digital-registration" });
	},
	component: () => null,
});
