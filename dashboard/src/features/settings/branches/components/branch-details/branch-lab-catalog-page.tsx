import { Skeleton } from "@/components/ui/skeleton";
import {
	BranchDetailsShell,
	SectionHeading,
} from "@/features/settings/branches/components/branch-details/shared";
import { useBranch } from "@/features/settings/branches/hooks/use-branch";
import { ServicesTable } from "@/features/settings/services/components/table";

export function BranchLabCatalogPage({ branchId }: { branchId: string }) {
	const { branch, isLoading } = useBranch(branchId);

	if (isLoading || !branch) {
		return (
			<div className="flex w-full flex-col gap-4 px-4 pt-10">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-96 w-full rounded-[4px]" />
			</div>
		);
	}

	return (
		<BranchDetailsShell
			branchName={branch.name}
			branchId={branch.id}
			section="التحليلات"
			sectionTo="/management/settings/branch/$branchId/lab-tests"
			subSection="التحاليل"
			wide
		>
			<SectionHeading
				title="التحاليل"
				description="قائمة التحاليل وأسعارها ومُحلِّلاتها. القائمة على مستوى المنشأة وتشترك فيها كل الفروع."
			/>
			<ServicesTable scope="lab" />
		</BranchDetailsShell>
	);
}
