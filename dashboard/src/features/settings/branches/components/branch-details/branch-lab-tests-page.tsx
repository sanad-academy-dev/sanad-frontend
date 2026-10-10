import {
	IconBarcode,
	IconChecklist,
	IconDeviceHeartMonitor,
	IconShieldCheck,
	IconSparkles,
	IconTestPipe,
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
import { WESTGARD_RULES } from "@/features/settings/branches/data/lab-settings";
import { useLabSettings } from "@/features/settings/branches/hooks/use-lab-settings";
import { cn } from "@/lib/utils";

export function BranchLabTestsPage({ branchId }: { branchId: string }) {
	const { branch, isLoading, isPending, lab, enabled, setEnabled } = useLabSettings(branchId);

	if (isLoading || !branch || !lab) {
		return (
			<div className="mx-auto flex w-full max-w-195 flex-col gap-4 px-4 pt-10">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-96 w-full rounded-[4px]" />
			</div>
		);
	}

	const connectedCount = lab.analyzers.filter((a) => a.connected).length;
	const aiCount = Object.values(lab.ai).filter(Boolean).length;
	const integrationsCount = [lab.lis, lab.barcode.enabled].filter(Boolean).length;

	const countLabel = (count: number, total: number) => (
		<span className="text-[11px] tabular-nums text-muted-foreground">
			{count} من {total}
		</span>
	);

	return (
		<BranchDetailsShell
			branchName={branch.name}
			branchId={branch.id}
			section="التحليلات"
		>
			<SectionHeading
				title="التحليلات"
				description="إدارة دورة التحاليل الطبية لهذا الفرع وإعدادات المختبر الخاصة بها."
			/>
			<SettingsCard>
				<SettingRow
					icon={<IconTestPipe className="size-4" />}
					title="تفعيل التحليلات لهذا الفرع"
					description="تظهر التحاليل في سير عمل الزيارة ويمكن للفريق إنشاء طلبات تحليل من هذا الفرع."
					trailing={
						<Switch
							checked={enabled}
							disabled={isPending}
							onCheckedChange={(checked) => void setEnabled(checked)}
							aria-label="تفعيل التحليلات لهذا الفرع"
						/>
					}
				/>
			</SettingsCard>

			{/* الأقسام تبقى قابلة للفتح والقراءة قبل التفعيل، والتعديل داخلها معطّل */}
			<div className={cn("flex flex-col gap-2.5", !enabled && "opacity-60")}>
				<SectionHeading title="إعدادات المختبر" />
				<SettingsCard>
					<NavRow
						icon={<IconTestPipe className="size-4" />}
						title="التحاليل"
						description="قائمة التحاليل المتاحة في المنشأة وأسعارها ومُحلِّلاتها."
						to="/management/settings/branch/$branchId/lab-tests/catalog"
						params={{ branchId: branch.id }}
					/>
					<NavRow
						icon={<IconChecklist className="size-4" />}
						title="بروتوكولات العمل القياسية"
						description="خطوات التنفيذ التي تظهر لفني المختبر داخل كل طلب — لكل تحليل بروتوكوله."
						to="/management/settings/branch/$branchId/sops"
						params={{ branchId: branch.id }}
					/>
					<NavRow
						icon={<IconDeviceHeartMonitor className="size-4" />}
						title="أجهزة التحليل"
						description="الأجهزة المربوطة بمختبر هذا الفرع ترسل النتائج تلقائيًا إلى طلبات التحليل."
						meta={countLabel(connectedCount, lab.analyzers.length)}
						to="/management/settings/branch/$branchId/lab-tests/analyzers"
						params={{ branchId: branch.id }}
					/>
					<NavRow
						icon={<IconSparkles className="size-4" />}
						title="ذكاء اصطناعي للمختبر"
						description="ميزات مساعدة تعمل على نتائج التحاليل الخاصة بهذا الفرع."
						meta={countLabel(aiCount, Object.keys(lab.ai).length)}
						to="/management/settings/branch/$branchId/lab-tests/ai"
						params={{ branchId: branch.id }}
					/>
					<NavRow
						icon={<IconShieldCheck className="size-4" />}
						title="قواعد ضبط الجودة (Westgard)"
						description="تحديد قواعد Westgard المطبقة على نتائج ضبط جودة المختبر."
						meta={countLabel(lab.westgardRules.length, WESTGARD_RULES.length)}
						to="/management/settings/branch/$branchId/lab-tests/quality"
						params={{ branchId: branch.id }}
					/>
					<NavRow
						icon={<IconBarcode className="size-4" />}
						title="التكاملات"
						description="ربط مختبر الفرع بالأنظمة والأجهزة الخارجية."
						meta={
							integrationsCount > 0 ? (
								countLabel(integrationsCount, 2)
							) : (
								<StatusDot
									on={false}
									offLabel="إيقاف"
								/>
							)
						}
						to="/management/settings/branch/$branchId/lab-tests/integrations"
						params={{ branchId: branch.id }}
					/>
				</SettingsCard>
			</div>
		</BranchDetailsShell>
	);
}
