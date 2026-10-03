import { IconBarcode, IconPlugConnected } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
	BranchDetailsShell,
	SectionHeading,
	SettingRow,
	SettingsCard,
} from "@/features/settings/branches/components/branch-details/shared";
import {
	BARCODE_LABEL_SIZES,
	COMPACT_INPUT_CLASS,
} from "@/features/settings/branches/data/lab-settings";
import { useLabSettings } from "@/features/settings/branches/hooks/use-lab-settings";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

export function BranchLabIntegrationsPage({ branchId }: { branchId: string }) {
	const { branch, isLoading, lab, configDisabled, update } = useLabSettings(branchId);
	const { isRtl: isArabic } = useI18n();

	if (isLoading || !branch || !lab) {
		return (
			<div className="mx-auto flex w-full max-w-195 flex-col gap-4 px-4 pt-10">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-80 w-full rounded-[4px]" />
			</div>
		);
	}

	const barcode = lab.barcode;

	return (
		<BranchDetailsShell
			branchName={branch.name}
			branchId={branch.id}
			section="التحليلات"
			sectionTo="/management/settings/branch/$branchId/lab-tests"
			subSection="التكاملات"
		>
			<SectionHeading
				title="التكاملات"
				description="ربط مختبر الفرع بالأنظمة والأجهزة الخارجية."
			/>
			<SettingsCard>
				<SettingRow
					icon={<IconPlugConnected className="size-4" />}
					title="تكامل LIS"
					description="ربط مع نظام معلومات المختبر الخارجي عبر HL7 v2.x"
					trailing={
						<Switch
							checked={lab.lis}
							disabled={configDisabled}
							onCheckedChange={(checked) => void update({ lis: checked })}
							aria-label="تكامل LIS"
						/>
					}
				/>
				<SettingRow
					icon={<IconBarcode className="size-4" />}
					title="تكامل الباركود"
					description="طباعة وقراءة باركود عينات المختبر"
					trailing={
						<Switch
							checked={barcode.enabled}
							disabled={configDisabled}
							onCheckedChange={(checked) =>
								void update({ barcode: { ...barcode, enabled: checked } })
							}
							aria-label="تكامل الباركود"
						/>
					}
				/>
				{barcode.enabled && (
					<>
						<SettingRow
							title="حجم الملصق"
							trailing={
								<Select
									value={barcode.labelSize}
									onValueChange={(value) =>
										void update({ barcode: { ...barcode, labelSize: value } })
									}
									disabled={configDisabled}
									dir={isArabic ? "rtl" : "ltr"}
								>
									<SelectTrigger
										size="sm"
										className="h-8 w-32 rounded-lg px-2 text-xs"
										aria-label="حجم الملصق"
									>
										<SelectValue />
									</SelectTrigger>
									<SelectContent
										position="popper"
										dir={isArabic ? "rtl" : "ltr"}
									>
										{BARCODE_LABEL_SIZES.map((size) => (
											<SelectItem
												key={size}
												value={size}
											>
												{size}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							}
						/>
						<SettingRow
							title="موديل الطابعة"
							trailing={
								<Input
									defaultValue={barcode.printerModel}
									placeholder="Zebra ZD420"
									disabled={configDisabled}
									aria-label="موديل الطابعة"
									onBlur={(e) => {
										const value = e.target.value.trim();
										if (value === barcode.printerModel) return;
										void update({ barcode: { ...barcode, printerModel: value } });
									}}
									className={cn(COMPACT_INPUT_CLASS, "w-40")}
								/>
							}
						/>
						<SettingRow
							title="عدد النسخ الافتراضي"
							trailing={
								<Input
									type="number"
									min={1}
									max={10}
									defaultValue={barcode.copies}
									disabled={configDisabled}
									aria-label="عدد النسخ الافتراضي"
									onBlur={(e) => {
										const value = Number(e.target.value);
										if (
											!Number.isFinite(value) ||
											value < 1 ||
											value > 10 ||
											value === barcode.copies
										) {
											e.target.value = String(barcode.copies);
											return;
										}
										void update({ barcode: { ...barcode, copies: Math.round(value) } });
									}}
									className={cn(COMPACT_INPUT_CLASS, "w-20")}
								/>
							}
						/>
					</>
				)}
			</SettingsCard>
		</BranchDetailsShell>
	);
}
