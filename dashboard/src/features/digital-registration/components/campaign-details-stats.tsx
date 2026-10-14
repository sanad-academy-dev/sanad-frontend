import { Card } from "@/components/ui/card";
import { useCampaignDetails } from "../hooks/use-digital-registration";

export function CampaignDetailsStats({ campaignId }: { campaignId: string }) {
	const { data: campaign, isLoading } = useCampaignDetails(campaignId);

	if (isLoading) {
		return <div className="p-8 text-center text-sm text-muted-foreground">جاري تحميل إحصائيات الحملة...</div>;
	}

	if (!campaign) {
		return <div className="p-8 text-center text-sm text-destructive">الحملة غير موجودة</div>;
	}

	const max = campaign.maxCapacity || campaign.capacity || 1;
	const accepted = campaign.accepted || 0;
	const fillRatio = Math.min(100, Math.round((accepted / max) * 100));

	const sourceStats = campaign.sourceStats || {};

	return (
		<div className="flex w-full flex-col gap-4 p-4 mt-4" dir="rtl">
			{/* Top Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card className="flex flex-col items-center justify-center p-6 gap-2 rounded-md shadow-none">
					<span className="text-3xl font-bold text-foreground">{campaign.requests}</span>
					<span className="text-sm text-muted-foreground">الطلبات الكلية</span>
				</Card>
				<Card className="flex flex-col items-center justify-center p-6 gap-2 rounded-md shadow-none">
					<span className="text-3xl font-bold text-emerald-600">{campaign.accepted}</span>
					<span className="text-sm text-muted-foreground">مقبول</span>
				</Card>
				<Card className="flex flex-col items-center justify-center p-6 gap-2 rounded-md shadow-none">
					<span className="text-3xl font-bold text-amber-500">{campaign.pending}</span>
					<span className="text-sm text-muted-foreground">قيد المراجعة</span>
				</Card>
				<Card className="flex flex-col items-center justify-center p-6 gap-2 rounded-md shadow-none">
					<span className="text-3xl font-bold text-red-500">{campaign.rejected || 0}</span>
					<span className="text-sm text-muted-foreground">مرفوض</span>
				</Card>
			</div>

			{/* Middle Progress */}
			<Card className="flex flex-col p-6 gap-4 rounded-md shadow-none">
				<div className="flex justify-between items-center w-full">
					<span className="text-sm font-medium text-muted-foreground">نسبة الامتلاء</span>
					<span className="text-[15px] font-bold text-emerald-600">{fillRatio}%</span>
				</div>
				<div className="h-3 w-full rounded-full bg-muted overflow-hidden flex" dir="ltr">
					<div
						className="h-full bg-emerald-600 rounded-e-full transition-all duration-500"
						style={{ width: `${fillRatio}%` }}
					/>
				</div>
				<div className="flex justify-between items-center w-full text-xs text-muted-foreground">
					<span>{accepted} مقبول</span>
					<span>{max} مقعد إجمالي</span>
				</div>
			</Card>

			{/* Bottom Sources */}
			<Card className="flex flex-col p-6 gap-4 rounded-md shadow-none">
				<span className="text-[15px] font-bold text-foreground self-start mb-2">مصادر التسجيل</span>
				<div className="flex flex-col gap-3">
					<div className="flex justify-between items-center">
						<span className="text-[13px] text-muted-foreground">الموقع الإلكتروني</span>
						<span className="text-sm font-bold text-foreground">{sourceStats.WEBSITE || 0}</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-[13px] text-muted-foreground">رابط مباشر</span>
						<span className="text-sm font-bold text-foreground">{sourceStats.DIRECT_LINK || 0}</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-[13px] text-muted-foreground">إحالة</span>
						<span className="text-sm font-bold text-foreground">{sourceStats.REFERRAL || 0}</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-[13px] text-muted-foreground">تواصل اجتماعي</span>
						<span className="text-sm font-bold text-foreground">{sourceStats.SOCIAL || 0}</span>
					</div>
				</div>
			</Card>
		</div>
	);
}
