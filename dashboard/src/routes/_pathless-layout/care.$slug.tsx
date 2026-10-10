import { createFileRoute } from "@tanstack/react-router";
import { SidebarPage } from "@/components/sidebar/sidebar-page";

/**
 * جذع احتياطي لأي وجهة تحت «الرعاية» لم تُبنَ بعد.
 *
 * صار لكل وحدات القسم مسارها الثابت — `care.mobile-clinic.tsx` و`care/nutrition.tsx`
 * و`care/grooming.tsx` — وهي تسبق هذا المسار المتغيّر. إبقاء عنوان وحدة مبنيّة هنا
 * يترك لها اسمًا ثانيًا لا يعرضه شيء، وهو بالضبط ما جعل الشريط الجانبي يقول
 * «الأكاديمية المتنقلة» بينما الصفحة التي يفتحها تقول «الأكاديميات المتنقلة».
 */
export const Route = createFileRoute("/_pathless-layout/care/$slug")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<SidebarPage
			title="الرعاية"
			description="هذه الصفحة ضمن قسم الرعاية."
		/>
	);
}
