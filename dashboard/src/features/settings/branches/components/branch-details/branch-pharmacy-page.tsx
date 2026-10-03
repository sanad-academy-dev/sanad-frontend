import {
	IconAlertTriangle,
	IconClipboardList,
	IconPill,
	IconPrinter,
} from "@tabler/icons-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
	usePharmacySettings,
	useUpdatePharmacySettings,
} from "@/features/pharmacy/hooks/use-pharmacy";
import {
	BranchDetailsShell,
	SectionHeading,
	SettingRow,
	SettingsCard,
	StatusDot,
} from "@/features/settings/branches/components/branch-details/shared";
import { useBranch } from "@/features/settings/branches/hooks/use-branch";

/**
 * إعدادات الصيدلية.
 *
 * **نطاقها الأكاديمية كلّها لا هذا الفرع وحده**، وهذا مذكور في الشاشة صراحةً: النموذج
 * `ClinicPharmacySettings` مفتاحه `clinicId` على نمط `ClinicSchedulingSettings` و
 * `ClinicPayrollSettings`. وُضعت الشاشة هنا لأن هذا حيث يبحث عنها المستخدم (بجانب
 * التحاليل والأشعة والتجميل)، لكن الإيحاء بأنها تخصّ الفرع كان سيجعل مديرًا يظنّ
 * أنه أطفأ الوحدة في فرعه بينما أطفأها في الأكاديمية كلّها.
 */
export function BranchPharmacyPage({ branchId }: { branchId: string }) {
	const { branch, isLoading } = useBranch(branchId);
	const { settings, isLoading: settingsLoading, error } = usePharmacySettings();
	const { update, isPending } = useUpdatePharmacySettings();

	/**
	 * **الانتظار مشروط بالتحميل وحده، لا بوصول البيانات.**
	 *
	 * كان الشرط `settingsLoading || !settings`، وهو لا يخرج أبدًا عند الفشل: الاستعلام
	 * ينتهي، و`settings` تبقى `null`، فيظلّ الهيكل العظمي دائرًا إلى الأبد بلا رسالة.
	 * أي خطأ — 403 أو انقطاع شبكة — كان يظهر «تحميل لا ينتهي» بدل سببه.
	 */
	if (isLoading || settingsLoading) {
		return (
			<div className="mx-auto flex w-full max-w-195 flex-col gap-4 px-4 pt-10">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-96 w-full rounded-[4px]" />
			</div>
		);
	}

	if (!branch || error || !settings) {
		return (
			<div className="mx-auto flex w-full max-w-195 flex-col items-center gap-2 px-4 pt-16 text-center">
				<h2 className="font-semibold text-base">تعذّر تحميل إعدادات الصيدلية</h2>
				<p className="max-w-md text-muted-foreground text-xs leading-relaxed">
					{error instanceof Error ? error.message : "الفرع غير موجود أو تعذّر الوصول إليه."}
				</p>
			</div>
		);
	}

	return (
		<BranchDetailsShell
			branchName={branch.name}
			branchId={branch.id}
			section="الصيدلية"
		>
			<SectionHeading title="تفعيل الوحدة" />
			<SettingsCard>
				<SettingRow
					icon={<IconPill className="size-4" />}
					title="وحدة الصيدلية"
					description="الوصفات الطبية، حاسبة الجرعات، الصرف من المخزون، وملصقات الدواء. الإعداد يخصّ الأكاديمية كاملةً لا هذا الفرع وحده."
					status={<StatusDot on={settings.enabled} />}
					trailing={
						<Switch
							checked={settings.enabled}
							disabled={isPending}
							onCheckedChange={(enabled) => update({ enabled })}
						/>
					}
					highlighted
				/>
			</SettingsCard>

			<SectionHeading title="الصرف" />
			<SettingsCard>
				<SettingRow
					icon={<IconClipboardList className="size-4" />}
					title="اقتراح أقرب صلاحية أولًا (FEFO)"
					description="يرتّب الدفعات بالأقرب انتهاءً. اقتراح لا إلزام — القرار للصيدلي، والسجل يحفظ الدفعة التي خرجت فعلًا."
					trailing={
						<Switch
							checked={settings.fefoSuggestion}
							disabled={isPending}
							onCheckedChange={(fefoSuggestion) => update({ fefoSuggestion })}
						/>
					}
				/>
				<SettingRow
					icon={<IconAlertTriangle className="size-4" />}
					title="منع صرف الدفعات منتهية الصلاحية"
					description="لا يمكن تعطيله. صرف دواء منتهٍ ليس تفضيلًا للأكاديمية، ولذلك يُعرض هنا ولا يُفتح."
					status={<StatusDot on={settings.blockExpiredDispense} />}
					trailing={
						<Switch
							checked={settings.blockExpiredDispense}
							disabled
						/>
					}
				/>
				<SettingRow
					icon={<IconPrinter className="size-4" />}
					title="عدد نسخ ملصق الدواء"
					description="نسخة للعبوة، وأخرى للملفّ عند الحاجة."
					trailing={<span className="text-xs font-bold">{settings.defaultLabelCopies}</span>}
				/>
			</SettingsCard>

			<SectionHeading title="المواد المراقبة" />
			<SettingsCard>
				<SettingRow
					icon={<IconClipboardList className="size-4" />}
					title="سجل المواد المراقبة"
					description="سجل عهدة إلحاقي: كل استلام وصرف وإتلاف وتسوية. يبقى مطفأً حتى يُحدَّد مصدر جدول الجدولة الرقابي."
					status={<StatusDot on={settings.controlledRegisterEnabled} />}
					trailing={
						<Switch
							checked={settings.controlledRegisterEnabled}
							disabled={isPending || !settings.enabled}
							onCheckedChange={(controlledRegisterEnabled) =>
								update({ controlledRegisterEnabled })
							}
						/>
					}
				/>
				<SettingRow
					icon={<IconAlertTriangle className="size-4" />}
					title="اشتراط شاهد على الإتلاف"
					description="الشاهد يجب أن يكون غير المنفِّذ. التوقيع المنفرد على إتلاف مادة مراقبة هو الثغرة التي يوجد السجل لإغلاقها."
					trailing={
						<Switch
							checked={settings.requireWitnessOnWaste}
							disabled={isPending || !settings.controlledRegisterEnabled}
							onCheckedChange={(requireWitnessOnWaste) => update({ requireWitnessOnWaste })}
						/>
					}
				/>
			</SettingsCard>
		</BranchDetailsShell>
	);
}
