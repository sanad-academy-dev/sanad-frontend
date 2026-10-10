import { IconSparkles } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
	BranchDetailsShell,
	SectionHeading,
	SettingRow,
	SettingsCard,
} from "@/features/settings/branches/components/branch-details/shared";
import { AI_FEATURES } from "@/features/settings/branches/data/lab-settings";
import { useLabSettings } from "@/features/settings/branches/hooks/use-lab-settings";

export function BranchLabAiPage({ branchId }: { branchId: string }) {
	const { branch, isLoading, lab, configDisabled, update } = useLabSettings(branchId);

	if (isLoading || !branch || !lab) {
		return (
			<div className="mx-auto flex w-full max-w-195 flex-col gap-4 px-4 pt-10">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-80 w-full rounded-[4px]" />
			</div>
		);
	}

	return (
		<BranchDetailsShell
			branchName={branch.name}
			branchId={branch.id}
			section="التحليلات"
			sectionTo="/management/settings/branch/$branchId/lab-tests"
			subSection="ذكاء اصطناعي للمختبر"
		>
			<SectionHeading
				title="ذكاء اصطناعي للمختبر"
				description="ميزات مساعدة تعمل على نتائج التحاليل الخاصة بهذا الفرع."
			/>
			<SettingsCard>
				{AI_FEATURES.map((feature) => (
					<SettingRow
						key={feature.key}
						icon={<IconSparkles className="size-4" />}
						title={feature.title}
						description={feature.description}
						trailing={
							<Switch
								checked={lab.ai[feature.key]}
								disabled={configDisabled}
								onCheckedChange={(checked) =>
									void update({ ai: { ...lab.ai, [feature.key]: checked } })
								}
								aria-label={feature.title}
							/>
						}
					/>
				))}
			</SettingsCard>
		</BranchDetailsShell>
	);
}
