import { createFileRoute, redirect } from "@tanstack/react-router";

import { DocumentsPage } from "@/features/documents/components/documents-page";
import { getSession } from "@/functions/get-session";
import { PERMISSIONS } from "@/lib/permissions";

export const Route = createFileRoute("/_pathless-layout/management/documents")({
	component: DocumentsPage,
	// الحارس يخفي الصفحة؛ التأمين الفعلي في clinic-documents.controller
	beforeLoad: async () => {
		const { session } = await getSession();
		const currentSession = session?.session;
		if (currentSession?.role === "MEMBER") {
			const perms: string[] = JSON.parse(currentSession.permissions ?? "[]");
			const canView =
				perms.includes(PERMISSIONS.DOCUMENTS_VIEW_LIMITED) ||
				perms.includes(PERMISSIONS.DOCUMENTS_VIEW_FULL);
			if (!canView) throw redirect({ to: "/dashboard" });
		}
	},
});
