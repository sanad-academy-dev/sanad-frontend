import {
	IconCash,
	IconClipboardHeart,
	IconCut,
	IconDeviceMobile,
	IconFileInvoice,
	IconHeartbeat,
	IconInfoCircle,
	IconPill,
	IconStethoscope,
	IconVaccine,
} from "@tabler/icons-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
	BranchDetailsShell,
	SectionHeading,
	SettingRow,
	SettingsCard,
} from "@/features/settings/branches/components/branch-details/shared";
import { useBranch } from "@/features/settings/branches/hooks/use-branch";
import { useUpdateBranchSettings } from "@/features/settings/branches/hooks/use-update-branch-settings";
import type { BranchSettings } from "@/server/branches/branches.type";
import { parseBranchSettings } from "@sanad/contracts/runtime/server/branches/branches.type";

type PortalKey = keyof BranchSettings["petPortal"];

/**
 * [PP] ما يعرضه تطبيق وليّ الأمر — مفاتيح إظهار/إخفاء لكل نوع معلومة.
 *
 * الصفحة ترسم قائمةً مُعرَّفة هنا، والمخطّط (`branchSettingsSchema.petPortal`) هو مصدر
 * المفاتيح وقيمها الافتراضية. **كل ميزة عرضٍ جديدة في التطبيق تُضاف سطرًا هنا ومفتاحًا
 * هناك** — هذا هو العقد الذي يجعل الإعدادات تنمو مع التطبيق بدل أن تتخلّف عنه.
 *
 * التطبيق يقرأ إعدادات **الفرع الرئيسي** وحده (انظر `pet-display.ts`): سجلّ الطفل
 * يجمع أحداثًا من كل الفروع، فلا معنى لأن يختلف الظاهر منه باختلاف فرعٍ لا يعرف
 * وليّ الأمر بوجوده أصلًا.
 */
const GROUPS: {
	title: string;
	description: string;
	rows: { key: PortalKey; title: string; description: string; icon: typeof IconVaccine }[];
}[] = [
	{
		title: "سجلّ الطفل",
		description: "أنواع الأحداث الظاهرة في الخطّ الزمني لكل طفل في التطبيق",
		rows: [
			{
				key: "timelineVaccinations",
				title: "التطعيمات",
				description: "جرعات اللقاح المعطاة وتقاريرها (الدفعة، المناعة، الجرعة التالية)",
				icon: IconVaccine,
			},
			{
				key: "timelineVitals",
				title: "القياسات",
				description: "الوزن والحرارة والنبض وبقيّة العلامات الحيوية المسجّلة",
				icon: IconHeartbeat,
			},
			{
				key: "timelineCarePlans",
				title: "خطط الرعاية",
				description: "اشتراكات الخطط وحالتها وزياراتها المشمولة",
				icon: IconClipboardHeart,
			},
			{
				key: "timelineGrooming",
				title: "جلسات التجميل",
				description: "الجلسات وحالتها ودوراتها",
				icon: IconCut,
			},
		],
	},
	{
		title: "تقرير الزيارة",
		description: "الأقسام الظاهرة عند فتح زيارة من التطبيق",
		rows: [
			{
				key: "reportServices",
				title: "الدورات المُقدَّمة",
				description: "ما أُدّي في الزيارة من دورات",
				icon: IconStethoscope,
			},
			{
				key: "reportProducts",
				title: "الأدوية والمستلزمات",
				description: "ما صُرف في الزيارة من أصناف",
				icon: IconPill,
			},
			{
				key: "reportVitals",
				title: "قياسات الزيارة",
				description: "العلامات الحيوية المأخوذة أثناء الزيارة",
				icon: IconHeartbeat,
			},
			{
				key: "reportVaccinations",
				title: "تطعيمات الزيارة",
				description: "الجرعات المعطاة أثناء الزيارة",
				icon: IconVaccine,
			},
			{
				key: "reportInvoice",
				title: "الفاتورة",
				description: "إجمالي الفاتورة وحالة سدادها",
				icon: IconFileInvoice,
			},
		],
	},
	{
		title: "عام",
		description: "",
		rows: [
			{
				key: "showPrices",
				title: "الأسعار",
				description: "أسعار الكشف في شاشة الحجز وأسعار البنود في التقارير",
				icon: IconCash,
			},
		],
	},
];

export function BranchPortalPage({ branchId }: { branchId: string }) {
	const { branch, isLoading } = useBranch(branchId);
	const { updateSettings, isPending } = useUpdateBranchSettings(branchId);

	if (isLoading || !branch) {
		return (
			<div className="mx-auto flex w-full max-w-195 flex-col gap-4 px-4 pt-10">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-80 w-full rounded-[4px]" />
			</div>
		);
	}

	const settings = parseBranchSettings(branch.settings);
	const toggle = (key: PortalKey, value: boolean) =>
		updateSettings({ ...settings, petPortal: { ...settings.petPortal, [key]: value } });

	return (
		<BranchDetailsShell
			branchName={branch.name}
			branchId={branch.id}
			section="تطبيق وليّ الأمر"
		>
			<div className="flex items-start gap-2 rounded-[4px] border bg-muted/30 p-3 text-sm">
				<IconDeviceMobile className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
				<p className="text-muted-foreground">
					كل ما هنا ظاهر افتراضيًّا — الإيقاف يخفيه من التطبيق فورًا.
					{branch.type !== "PRIMARY" ? (
						<span className="mt-1 flex items-start gap-1 text-amber-700 dark:text-amber-500">
							<IconInfoCircle className="mt-0.5 size-3.5 shrink-0" />
							التطبيق يقرأ إعدادات الفرع الرئيسي — ما تضبطه هنا لا أثر له حتى يُضبط هناك.
						</span>
					) : null}
				</p>
			</div>

			{GROUPS.map((group) => (
				<div
					key={group.title}
					className="flex flex-col gap-2.5"
				>
					<SectionHeading
						title={group.title}
						description={group.description || undefined}
					/>
					<SettingsCard>
						{group.rows.map((row) => (
							<SettingRow
								key={row.key}
								icon={<row.icon className="size-4" />}
								title={row.title}
								description={row.description}
								trailing={
									<Switch
										checked={settings.petPortal[row.key]}
										disabled={isPending}
										onCheckedChange={(checked) => void toggle(row.key, checked)}
									/>
								}
							/>
						))}
					</SettingsCard>
				</div>
			))}
		</BranchDetailsShell>
	);
}
