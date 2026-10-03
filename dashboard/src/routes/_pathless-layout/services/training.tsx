import { createFileRoute, Outlet } from "@tanstack/react-router";

// تخطيط وحدة الدورات — يعرض المسار الفرعي المطابق (القائمة/تفاصيل الدورة) عبر Outlet.
// محتوى القائمة في training.index.tsx، وتفاصيل الدورة في training.course.$courseId.tsx.
export const Route = createFileRoute("/_pathless-layout/services/training")({
	component: () => <Outlet />,
});
