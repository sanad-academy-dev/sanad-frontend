import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
	BranchDetailsShell,
	SectionHeading,
	SettingRow,
	SettingsCard,
} from "@/features/settings/branches/components/branch-details/shared";
import { WESTGARD_RULES } from "@/features/settings/branches/data/lab-settings";
import { useLabSettings } from "@/features/settings/branches/hooks/use-lab-settings";

export function BranchLabQualityPage({ branchId }: { branchId: string }) {
	const { branch, isLoading, lab, configDisabled, update } = useLabSettings(branchId);

	if (isLoading || !branch || !lab) {
		return (
			<div className="mx-auto flex w-full max-w-195 flex-col gap-4 px-4 pt-10">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-80 w-full rounded-[4px]" />
			</div>
		);
	}

	const toggleRule = (id: string, on: boolean) =>
		update({
			westgardRules: on
				? [...lab.westgardRules, id]
				: lab.westgardRules.filter((rule) => rule !== id),
		});

	return (
		<BranchDetailsShell
			branchName={branch.name}
			branchId={branch.id}
			section="التحليلات"
			sectionTo="/management/settings/branch/$branchId/lab-tests"
			subSection="قواعد ضبط الجودة"
		>
			<SectionHeading
				title="قواعد ضبط الجودة (Westgard)"
				description="تحديد قواعد Westgard المطبقة على نتائج ضبط جودة المختبر."
			/>
			<SettingsCard>
				{WESTGARD_RULES.map((rule) => (
					<SettingRow
						key={rule.id}
						title={rule.id}
						description={rule.description}
						trailing={
							<Switch
								checked={lab.westgardRules.includes(rule.id)}
								disabled={configDisabled}
								onCheckedChange={(checked) => void toggleRule(rule.id, checked)}
								aria-label={`قاعدة ${rule.id}`}
							/>
						}
					/>
				))}
			</SettingsCard>
		</BranchDetailsShell>
	);
}
