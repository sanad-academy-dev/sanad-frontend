import {
	IconBedFlat,
	IconClipboardText,
	IconCut,
	IconDeviceDesktopAnalytics,
	IconPill,
	IconScissors,
	IconShieldHalf,
	IconStethoscope,
	IconTestPipe,
	IconVaccine,
} from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePharmacySettings } from "@/features/pharmacy/hooks/use-pharmacy";
import {
	BranchDetailsShell,
	ComingSoonPill,
	NavRow,
	SectionHeading,
	SettingsCard,
	StatusDot,
} from "@/features/settings/branches/components/branch-details/shared";
import { useBranch } from "@/features/settings/branches/hooks/use-branch";
import { parseBranchSettings } from "@sanad/contracts/runtime/server/branches/branches.type";

export const SERVICE_CATEGORIES = [
	{
		key: "vaccination",
		title: "التطعيم",
		description: "إدارة الفحوصات والتحاليل الطبية الخاصة بالفرع.",
		icon: IconVaccine,
	},
	{
		key: "hospitalization",
		title: "التنويم",
		description: "إدارة حالات الإقامة والرعاية الطبية داخل الفرع.",
		icon: IconBedFlat,
	},
	{
		key: "isolation",
		title: "العزل",
		description: "إدارة الأطفال التي تحتاج إلى عزل طبي أو وقائي.",
		icon: IconShieldHalf,
	},
];

export function BranchServicesPage({ branchId }: { branchId: string }) {
	const { branch, isLoading } = useBranch(branchId);
	// حالة الوحدة تُقرأ من إعدادات الأكاديمية لا من `branch.settings`: الراية على مستوى
	// الأكاديمية (`ClinicPharmacySettings`)، فعرضُها من مصدر الفرع كان سيكذب.
	const { enabled: pharmacyEnabled } = usePharmacySettings();

	if (isLoading || !branch) {
		return (
			<div className="mx-auto flex w-full max-w-195 flex-col gap-4 px-4 pt-10">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-96 w-full rounded-[4px]" />
			</div>
		);
	}

	const settings = parseBranchSettings(branch.settings);

	return (
		<BranchDetailsShell
			branchName={branch.name}
			branchId={branch.id}
			section="الدورات"
		>
			<SectionHeading title="سير العمل" />
			<SettingsCard>
				{/* أنواع الكشف وقوالبه — أوّل ما يُضبط في الفرع: الكشف يقرّر السعر،
				    والقالب يقرّر شكل الملاحظة التي تُكتب فيه. */}
				<NavRow
					icon={<IconStethoscope className="size-4" />}
					title="أنواع الكشف"
					description="أنواع الكشف وأسعارها، وقالب الفحص الذي يُفتح لكل نوع."
					to="/management/settings/branch/$branchId/consultation-types"
					params={{ branchId: branch.id }}
				/>
				<NavRow
					icon={<IconClipboardText className="size-4" />}
					title="قوالب الفحص"
					description="قوالب SOAP التي تُبنى منها ملاحظة الزيارة — لكل شكوى قالبها."
					to="/management/settings/branch/$branchId/exam-templates"
					params={{ branchId: branch.id }}
				/>
				<NavRow
					icon={<IconTestPipe className="size-4" />}
					title="التحليلات"
					description="تفعيل دورة التحاليل الطبية لهذا الفرع وإعدادات المختبر والأجهزة."
					meta={
						<StatusDot
							on={settings.services.labTests}
							offLabel="إيقاف"
						/>
					}
					to="/management/settings/branch/$branchId/lab-tests"
					params={{ branchId: branch.id }}
				/>
				<NavRow
					icon={<IconDeviceDesktopAnalytics className="size-4" />}
					title="الأشعة"
					description="تفعيل دورة الأشعة لهذا الفرع وإدارة الفحوصات وأجهزة التصوير."
					meta={
						<StatusDot
							on={settings.services.radiology}
							offLabel="إيقاف"
						/>
					}
					to="/management/settings/branch/$branchId/radiology"
					params={{ branchId: branch.id }}
				/>
				<NavRow
					icon={<IconCut className="size-4" />}
					title="العمليات الجراحية"
					description="كتالوج الإجراءات وبوابات الأمان وقوائم تحقق WHO القابلة للتخصيص."
					to="/management/settings/branch/$branchId/operations"
					params={{ branchId: branch.id }}
				/>
				<NavRow
					icon={<IconScissors className="size-4" />}
					title="التجميل"
					description="كتالوج دورات التجميل ومصفوفة السعر حسب السلالة والحجم ونوع الفرو، وسعة الفرع وبوابات السلامة."
					to="/management/settings/branch/$branchId/grooming"
					params={{ branchId: branch.id }}
				/>
				<NavRow
					icon={<IconPill className="size-4" />}
					title="الصيدلية"
					description="الوصفات وحاسبة الجرعات والصرف من المخزون وملصقات الدواء وسجل المواد المراقبة."
					meta={
						<StatusDot
							on={pharmacyEnabled}
							offLabel="إيقاف"
						/>
					}
					to="/management/settings/branch/$branchId/pharmacy"
					params={{ branchId: branch.id }}
				/>
				{SERVICE_CATEGORIES.map((service) => (
					<NavRow
						key={service.key}
						icon={<service.icon className="size-4" />}
						title={service.title}
						description={service.description}
						meta={<ComingSoonPill />}
						disabled
					/>
				))}
			</SettingsCard>
		</BranchDetailsShell>
	);
}
