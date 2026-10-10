// PARKED: reference implementation. Feature UIs will be rebuilt in our own design.
// Backend endpoints it uses are production — do not delete.
// لا يوجد مدخل ظاهر لهذا المسار في الواجهة؛ يُبلَغ فقط بكتابة الرابط، وهو مرجعنا العامل
// لإعادة تصميم واجهات «تعيين المتدربين» و«الإكمال» لاحقًا بأسلوب التطبيق.
import { createFileRoute, redirect } from "@tanstack/react-router";

import { CourseWizard } from "@/features/services/training/wizard/course-wizard";
import { wizardSearchSchema } from "@/features/services/training/wizard/wizard.types";
import { getOnboardingStatus } from "@/functions/get-onboarding-status";

// معالج إنشاء/تعديل الدورة — تخطيط استحواذ كامل الشاشة (بلا شريط جانبي)، مصادَق عليه.
export const Route = createFileRoute("/training/course/$courseId")({
	component: RouteComponent,
	ssr: false,
	validateSearch: (search) => {
		const parsed = wizardSearchSchema.safeParse(search);
		return parsed.success ? parsed.data : {};
	},
	beforeLoad: async () => {
		const { session, onboardingCompleted } = await getOnboardingStatus();
		if (!session) throw redirect({ to: "/login" });
		if (!onboardingCompleted) throw redirect({ to: "/onboarding" });
	},
});

function RouteComponent() {
	const { courseId } = Route.useParams();
	return <CourseWizard courseId={courseId} />;
}
