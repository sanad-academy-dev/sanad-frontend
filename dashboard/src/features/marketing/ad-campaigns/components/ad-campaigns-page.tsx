import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { AdCampaignsTable } from "@/features/marketing/ad-campaigns/components/ad-campaigns-table";
import { CampaignDetailSheet } from "@/features/marketing/ad-campaigns/components/campaign-detail-sheet";
import { CampaignWizardDialog } from "@/features/marketing/ad-campaigns/components/campaign-wizard-dialog";
import { CreateCampaignMenu } from "@/features/marketing/ad-campaigns/components/create-campaign-menu";
import {
	useDeleteAdCampaign,
	useUpdateAdCampaignStatus,
} from "@/features/marketing/ad-campaigns/hooks/use-ad-campaign-mutations";
import {
	useAdCampaigns,
	useAdCampaignsSummary,
} from "@/features/marketing/ad-campaigns/hooks/use-ad-campaigns";
import type { AdCampaignStatus } from "@/generated/prisma/enums";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useI18n } from "@/hooks/use-i18n";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/lib/permissions";
import type {
	AdCampaignListItem,
	SupportedAdPlatform,
} from "@/server/ad-campaigns/ad-campaigns.type";

const currencyFormatter = new Intl.NumberFormat("en-US", {
	maximumFractionDigits: 0,
});

/**
 * [MK1] صفحة الحملات الاعلانية — الشاشتان 537787 (مملوءة) و548053 (فارغة).
 *
 * التركيب أعلى الصفحة يطابق بقيّة وجهات الإدارة: بطاقات إحصائيات، ثم شريط أدوات،
 * ثم الجدول. لا مكوّنات جديدة هنا — التصميم يقع على `Stats` و`TableToolbar`
 * و`TableDataView` القائمة واحدًا لواحد.
 */
export function AdCampaignsPage() {
	const { isRtl } = useI18n();
	const { hasPermission, isAdmin } = usePermissions();

	const [search, setSearch] = useState("");
	const [deleting, setDeleting] = useState<AdCampaignListItem | null>(null);
	const [wizardPlatform, setWizardPlatform] = useState<SupportedAdPlatform | null>(null);
	const [detailId, setDetailId] = useState<string | null>(null);

	// البحث يمرّ على الخادم — بلا تأخير كانت كل ضغطة مفتاح طلبًا
	const debouncedSearch = useDebouncedValue(search, 300);

	const { campaigns, isLoading } = useAdCampaigns(
		debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {},
	);
	const { summary } = useAdCampaignsSummary();
	const { updateStatus } = useUpdateAdCampaignStatus();
	const { deleteCampaign, isPending: isDeleting } = useDeleteAdCampaign();

	const canCreate = isAdmin || hasPermission(PERMISSIONS.MARKETING_CREATE);
	const canEdit = isAdmin || hasPermission(PERMISSIONS.MARKETING_EDIT);
	const canDelete = isAdmin || hasPermission(PERMISSIONS.MARKETING_DELETE);

	const stats = useMemo<StatItem[]>(
		() => [
			{
				title: "إجمالي الحملات الاعلانية",
				value: summary?.total ?? 0,
				tooltip: "كل الحملات الاعلانية في نطاق عرضك، بأي حالة.",
			},
			{
				title: "الحملات النشطة",
				value: summary?.active ?? 0,
				tooltip: "الحملات الجارية حاليًا أو المجدولة للانطلاق.",
			},
			{
				title: "الحملات غير النشطة",
				value: summary?.inactive ?? 0,
				tooltip: "المسودات والحملات الموقوفة والمنتهية وما فشل إطلاقه.",
			},
			{
				title: "اجمالي المصروفات",
				value: summary?.totalSpend ?? 0,
				// المبلغ يُعرض منسّقًا؛ `value` يبقى رقمًا كي لا تنكسر أي حسبة تعتمده
				valueLabel: currencyFormatter.format(summary?.totalSpend ?? 0),
				tooltip: "مجموع الإنفاق المسجَّل على حملات نطاق عرضك.",
			},
		],
		[summary],
	);

	const openWizard = (platform: SupportedAdPlatform) => setWizardPlatform(platform);

	const confirmDelete = async () => {
		if (!deleting) return;
		await deleteCampaign(deleting.id);
		setDeleting(null);
	};

	const createButton = (
		<CreateCampaignMenu
			size="xs"
			onSelect={openWizard}
			disabled={!canCreate}
			disabledReason={
				canCreate ? undefined : "لا تملك صلاحية إنشاء حملة اعلانية — راجع مدير النظام"
			}
		/>
	);

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<Stats
				className="gap-3 px-3 py-3"
				variant="compact"
				stats={stats}
			/>

			<TableToolbar
				className="border-y"
				buttonSize="xs"
				searchValue={search}
				onSearchChange={setSearch}
				searchPlaceholder="ابحث عن حملة اعلانية..."
				actions={createButton}
			/>

			<div className="min-h-0 flex-1 overflow-auto">
				<AdCampaignsTable
					campaigns={campaigns}
					isLoading={isLoading}
					canEdit={canEdit}
					canDelete={canDelete}
					onStatusChange={(id: string, status: AdCampaignStatus) =>
						void updateStatus(id, status)
					}
					onDelete={setDeleting}
					onOpenDetail={(campaign) => setDetailId(campaign.id)}
					{...(canCreate
						? {
								emptyAction: {
									label: "انشاء حملة اعلانية",
									onClick: () => openWizard("FACEBOOK"),
								},
							}
						: {})}
				/>
			</div>

			<CampaignWizardDialog
				platform={wizardPlatform}
				open={!!wizardPlatform}
				onOpenChange={(open) => !open && setWizardPlatform(null)}
				onLaunched={(summary) =>
					toast.success("تم اطلاق الحملة بنجاح", { description: summary })
				}
			/>

			<CampaignDetailSheet
				campaignId={detailId}
				onOpenChange={(open) => !open && setDetailId(null)}
			/>

			<Dialog
				open={!!deleting}
				onOpenChange={(open) => !open && setDeleting(null)}
			>
				{/* محتوى Radix يُنقَل خارج الشجرة (portal) فلا يرث اتجاه الصفحة — يُمرَّر صراحة */}
				<DialogContent dir={isRtl ? "rtl" : "ltr"}>
					<DialogHeader>
						<DialogTitle>حذف الحملة الاعلانية</DialogTitle>
						<DialogDescription>
							سيُحذف «{deleting?.name}» وكل نصوصه وصوره وأرقام أدائه. لا يمكن التراجع.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="gap-2 sm:justify-start">
						<Button
							variant="destructive"
							onClick={confirmDelete}
							disabled={isDeleting}
						>
							حذف
						</Button>
						<Button
							variant="outline"
							onClick={() => setDeleting(null)}
							disabled={isDeleting}
						>
							إلغاء
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
