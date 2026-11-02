import { createFileRoute, redirect } from "@tanstack/react-router";

// إعادة توجيه مسار التقييمات القديم إلى التبويب الداخلي لوحدة إدارة المحتوى
export const Route = createFileRoute("/_pathless-layout/services/quizzes")({
	beforeLoad: () => {
		throw redirect({
			to: "/services/training",
			search: { tab: "quizzes" },
		});
	},
	component: () => null,
});
