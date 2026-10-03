import { createFileRoute } from "@tanstack/react-router";
import { AddBranchPage } from "@/features/settings/branches/components/add-branch-page";

export const Route = createFileRoute("/_pathless-layout/add-branch")({
	component: AddBranchPage,
});
