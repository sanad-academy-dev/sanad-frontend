import { IconSparkles } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
	BranchDetailsShell,
	SectionHeading,
	SettingRow,
	SettingsCard,
} from "@/features/settings/branches/components/branch-details/shared";
import { RADIOLOGY_AI_FEATURES } from "@/features/settings/branches/data/radiology-settings";
import { useRadiologySettings } from "@/features/settings/branches/hooks/use-radiology-settings";

export function BranchRadiologyAiPage({ branchId }: { branchId: string }) {
	const { branch, isLoading, radiology, configDisabled, update } =
		useRadiologySettings(branchId);

	if (isLoading || !branch || !radiology) {
		return (
			<div className="mx-auto flex w-full max-w-195 flex-col gap-4 px-4 pt-10">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-96 w-full rounded-[4px]" />
			</div>
		);
	}

	return (
		<BranchDetailsShell
			branchName={branch.name}
			branchId={branch.id}
			section="الأشعة"
			sectionTo="/management/settings/branch/$branchId/radiology"
			subSection="ذكاء اصطناعي للأشعة"
		>
			<SectionHeading
				title="ذكاء اصطناعي للأشعة"
				description="ميزات مساعدة تعمل على فحوصات وتقارير هذا الفرع."
			/>
			<SettingsCard>
				{RADIOLOGY_AI_FEATURES.map((feature) => (
					<SettingRow
						key={feature.key}
						icon={<IconSparkles className="size-4" />}
						title={feature.title}
						description={feature.description}
						trailing={
							<Switch
								checked={radiology.ai[feature.key]}
								disabled={configDisabled}
								onCheckedChange={(checked) =>
									void update({ ai: { ...radiology.ai, [feature.key]: checked } })
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
