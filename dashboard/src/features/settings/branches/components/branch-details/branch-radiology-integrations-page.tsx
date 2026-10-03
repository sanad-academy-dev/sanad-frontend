import { IconPlugConnected, IconRadioactive } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
	BranchDetailsShell,
	SectionHeading,
	SettingRow,
	SettingsCard,
} from "@/features/settings/branches/components/branch-details/shared";
import { COMPACT_INPUT_CLASS } from "@/features/settings/branches/data/lab-settings";
import { useRadiologySettings } from "@/features/settings/branches/hooks/use-radiology-settings";
import { cn } from "@/lib/utils";

export function BranchRadiologyIntegrationsPage({ branchId }: { branchId: string }) {
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

	const pacsDisabled = configDisabled || !radiology.pacs.enabled;

	return (
		<BranchDetailsShell
			branchName={branch.name}
			branchId={branch.id}
			section="الأشعة"
			sectionTo="/management/settings/branch/$branchId/radiology"
			subSection="التكاملات والجرعة"
		>
			<SectionHeading
				title="التكاملات والجرعة"
				description="ربط أنظمة PACS/DICOM الخارجية وإعدادات تتبّع الجرعة الإشعاعية."
			/>

			<SettingsCard>
				<SettingRow
					icon={<IconPlugConnected className="size-4" />}
					title="تكامل PACS / DICOM"
					description="بيانات اتصال خادم الأرشفة — تُستخدم عند ربط أجهزة التصوير مباشرةً."
					trailing={
						<Switch
							checked={radiology.pacs.enabled}
							disabled={configDisabled}
							onCheckedChange={(checked) =>
								void update({ pacs: { ...radiology.pacs, enabled: checked } })
							}
							aria-label="تفعيل تكامل PACS"
						/>
					}
				/>
				{/* حقول الاتصال — تُحفظ عند مغادرة الحقل حتى لا يُرسل طلب لكل حرف */}
				<div className={cn("grid grid-cols-3 gap-3 px-1 py-3", pacsDisabled && "opacity-60")}>
					<div className="flex flex-col gap-1.5">
						<Label
							htmlFor="pacs-ae-title"
							className="text-[11px] text-muted-foreground"
						>
							AE Title
						</Label>
						<Input
							id="pacs-ae-title"
							key={`ae-${radiology.pacs.aeTitle}`}
							dir="ltr"
							defaultValue={radiology.pacs.aeTitle}
							disabled={pacsDisabled}
							className={COMPACT_INPUT_CLASS}
							onBlur={(e) =>
								void update({ pacs: { ...radiology.pacs, aeTitle: e.target.value.trim() } })
							}
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<Label
							htmlFor="pacs-host"
							className="text-[11px] text-muted-foreground"
						>
							المضيف (Host)
						</Label>
						<Input
							id="pacs-host"
							key={`host-${radiology.pacs.host}`}
							dir="ltr"
							defaultValue={radiology.pacs.host}
							disabled={pacsDisabled}
							className={COMPACT_INPUT_CLASS}
							onBlur={(e) =>
								void update({ pacs: { ...radiology.pacs, host: e.target.value.trim() } })
							}
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<Label
							htmlFor="pacs-port"
							className="text-[11px] text-muted-foreground"
						>
							المنفذ (Port)
						</Label>
						{/* المفتاح مربوط بالقيمة المحفوظة: بعد كل حفظ يُعاد تركيب الحقل
						    بقيمة الخادم، فلا يبقى المعروض مخالفًا للمحفوظ */}
						<Input
							id="pacs-port"
							key={`port-${radiology.pacs.port}`}
							dir="ltr"
							type="number"
							min={1}
							max={65535}
							defaultValue={radiology.pacs.port}
							disabled={pacsDisabled}
							className={cn(COMPACT_INPUT_CLASS, "tabular-nums")}
							onBlur={(e) => {
								const raw = e.target.value.trim();
								// الحقل الفارغ يعني «لم يُغيَّر» لا «أعد إلى 104»
								if (!raw) {
									e.target.value = String(radiology.pacs.port);
									return;
								}
								const port = Math.min(65535, Math.max(1, Number(raw) || 104));
								e.target.value = String(port);
								void update({ pacs: { ...radiology.pacs, port } });
							}}
						/>
					</div>
				</div>
			</SettingsCard>

			<SettingsCard>
				<SettingRow
					icon={<IconRadioactive className="size-4" />}
					title="تتبّع الجرعة الإشعاعية"
					description="إظهار حقول kVp/mAs/DAP في خطوة الالتقاط وتوثيقها على الفحص."
					trailing={
						<Switch
							checked={radiology.dose.trackDose}
							disabled={configDisabled}
							onCheckedChange={(checked) =>
								void update({ dose: { ...radiology.dose, trackDose: checked } })
							}
							aria-label="تتبّع الجرعة الإشعاعية"
						/>
					}
				/>
				<SettingRow
					icon={<IconRadioactive className="size-4" />}
					title="إلزام توثيق الجرعة للأشعة السينية"
					description="لا يكتمل الالتقاط في فحوصات الأشعة السينية دون تسجيل معاملات التعريض."
					trailing={
						<Switch
							checked={radiology.dose.requireForXray}
							disabled={configDisabled || !radiology.dose.trackDose}
							onCheckedChange={(checked) =>
								void update({ dose: { ...radiology.dose, requireForXray: checked } })
							}
							aria-label="إلزام توثيق الجرعة"
						/>
					}
				/>
			</SettingsCard>
		</BranchDetailsShell>
	);
}
