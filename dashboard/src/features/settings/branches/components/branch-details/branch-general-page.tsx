import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
	BranchDetailsShell,
	SectionHeading,
	SettingRow,
	SettingsCard,
} from "@/features/settings/branches/components/branch-details/shared";
import { useBranch } from "@/features/settings/branches/hooks/use-branch";
import { useUpdateBranch } from "@/features/settings/branches/hooks/use-update-branch";

export function BranchGeneralPage({ branchId }: { branchId: string }) {
	const { branch, isLoading } = useBranch(branchId);
	const { updateBranch, isPending } = useUpdateBranch(branchId);

	if (isLoading || !branch) {
		return (
			<div className="mx-auto flex w-full max-w-195 flex-col gap-4 px-4 pt-10">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-24 w-full rounded-[4px]" />
			</div>
		);
	}

	return (
		<BranchDetailsShell
			branchName={branch.name}
			branchId={branch.id}
			section="عام"
		>
			<SectionHeading title="عام" />
			<SettingsCard>
				<SettingRow
					title="إشعارات الطوارئ"
					description="إرسال تنبيهات فورية للفريق عند وجود حالات حرجة"
					trailing={
						<Switch
							checked={branch.emergencyNotifications}
							disabled={isPending}
							onCheckedChange={(checked) => updateBranch({ emergencyNotifications: checked })}
							aria-label="إشعارات الطوارئ"
						/>
					}
				/>
			</SettingsCard>
		</BranchDetailsShell>
	);
}
