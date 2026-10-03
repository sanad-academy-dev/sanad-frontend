import { createFileRoute } from "@tanstack/react-router";

import { CourseDetailView } from "@/features/services/training/components/course-detail-view";

// صفحة تفاصيل الدورة — ضمن تخطيط الشريط الجانبي (Figma node 4413-475459)
export const Route = createFileRoute("/_pathless-layout/services/training/course/$courseId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { courseId } = Route.useParams();
	return <CourseDetailView courseId={courseId} />;
}
