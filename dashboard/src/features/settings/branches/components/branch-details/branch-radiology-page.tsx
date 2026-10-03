import {
	IconBodyScan,
	IconChecklist,
	IconDeviceDesktopAnalytics,
	IconFileText,
	IconPlugConnected,
	IconSparkles,
} from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
	BranchDetailsShell,
	NavRow,
	SectionHeading,
	SettingRow,
	SettingsCard,
	StatusDot,
} from "@/features/settings/branches/components/branch-details/shared";
import { RADIOLOGY_AI_FEATURES } from "@/features/settings/branches/data/radiology-settings";
import { useRadiologySettings } from "@/features/settings/branches/hooks/use-radiology-settings";
import { cn } from "@/lib/utils";

export function BranchRadiologyPage({ branchId }: { branchId: string }) {
	const { branch, isLoading, isPending, radiology, enabled, setEnabled } =
		useRadiologySettings(branchId);

	if (isLoading || !branch || !radiology) {
		return (
			<div className="mx-auto flex w-full max-w-195 flex-col gap-4 px-4 pt-10">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-96 w-full rounded-[4px]" />
			</div>
		);
	}

	const connectedCount = radiology.machines.filter((m) => m.connected).length;
	const aiCount = Object.values(radiology.ai).filter(Boolean).length;

	const countLabel = (count: number, total: number) => (
		<span className="text-[11px] tabular-nums text-muted-foreground">
			{count} من {total}
		</span>
	);

	return (
		<BranchDetailsShell
			branchName={branch.name}
			branchId={branch.id}
			section="الأشعة"
		>
			<SectionHeading
				title="الأشعة"
				description="إدارة دورة التصوير الطبي لهذا الفرع: الفحوصات والأجهزة وسير عمل التقارير."
			/>
			<SettingsCard>
				<SettingRow
					icon={<IconBodyScan className="size-4" />}
					title="تفعيل الأشعة لهذا الفرع"
					description="تظهر الأشعة في سير عمل الزيارة ويمكن للفريق إنشاء طلبات تصوير من هذا الفرع."
					trailing={
						<Switch
							checked={enabled}
							disabled={isPending}
							onCheckedChange={(checked) => void setEnabled(checked)}
							aria-label="تفعيل الأشعة لهذا الفرع"
						/>
					}
				/>
			</SettingsCard>

			{/* الأقسام تبقى قابلة للفتح والقراءة قبل التفعيل، والتعديل داخلها معطّل */}
			<div className={cn("flex flex-col gap-2.5", !enabled && "opacity-60")}>
				<SectionHeading title="إعدادات الأشعة" />
				<SettingsCard>
					<NavRow
						icon={<IconBodyScan className="size-4" />}
						title="فحوصات الأشعة"
						description="قائمة الفحوصات المتاحة في المنشأة وأسعارها وتعريفاتها (طريقة التصوير والإسقاطات)."
						to="/management/settings/branch/$branchId/radiology/catalog"
						params={{ branchId: branch.id }}
					/>
					<NavRow
						icon={<IconChecklist className="size-4" />}
						title="بروتوكولات العمل القياسية"
						description="خطوات التنفيذ التي تظهر لفني الأشعة داخل كل طلب — لكل فحص بروتوكوله."
						to="/management/settings/branch/$branchId/sops"
						params={{ branchId: branch.id }}
					/>
					<NavRow
						icon={<IconDeviceDesktopAnalytics className="size-4" />}
						title="أجهزة التصوير"
						description="أجهزة هذا الفرع وغرفها — تُعيَّن للفحوصات في خطوة التحضير ويُحسب إشغالها."
						meta={countLabel(connectedCount, radiology.machines.length)}
						to="/management/settings/branch/$branchId/radiology/machines"
						params={{ branchId: branch.id }}
					/>
					<NavRow
						icon={<IconFileText className="size-4" />}
						title="قوالب التقارير"
						description="نصوص جاهزة تملأ أقسام التقرير بنقرة — للدراسات الطبيعية المتكرّرة."
						to="/management/settings/branch/$branchId/radiology/templates"
						params={{ branchId: branch.id }}
					/>
					<NavRow
						icon={<IconSparkles className="size-4" />}
						title="ذكاء اصطناعي للأشعة"
						description="ميزات مساعدة تعمل على فحوصات وتقارير هذا الفرع."
						meta={countLabel(aiCount, RADIOLOGY_AI_FEATURES.length)}
						to="/management/settings/branch/$branchId/radiology/ai"
						params={{ branchId: branch.id }}
					/>
					<NavRow
						icon={<IconPlugConnected className="size-4" />}
						title="التكاملات والجرعة"
						description="ربط PACS/DICOM وإعدادات تتبّع الجرعة الإشعاعية."
						meta={
							<StatusDot
								on={radiology.pacs.enabled}
								onLabel="PACS متصل"
								offLabel="إيقاف"
							/>
						}
						to="/management/settings/branch/$branchId/radiology/integrations"
						params={{ branchId: branch.id }}
					/>
				</SettingsCard>
			</div>
		</BranchDetailsShell>
	);
}
