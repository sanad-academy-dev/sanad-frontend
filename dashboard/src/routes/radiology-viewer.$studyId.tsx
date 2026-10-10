import { createFileRoute } from "@tanstack/react-router";

import { RadiologyViewerPage } from "@/features/services/radiology/viewer/viewer-page";

// عارض دراسة الأشعة — صفحة مستقلة بملء النافذة (تُفتح في تبويب جديد من لوحة
// الفحص). عميل فقط: Cornerstone3D يحتاج WebGL وWeb Workers فلا معنى لـ SSR.
export const Route = createFileRoute("/radiology-viewer/$studyId")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	const { studyId } = Route.useParams();
	return <RadiologyViewerPage studyId={studyId} />;
}
