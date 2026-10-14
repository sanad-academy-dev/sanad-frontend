import { useState } from "react";
import { IconCopy, IconCheck, IconExternalLink } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCampaignDetails } from "../hooks/use-digital-registration";

export function CampaignInfo({ campaignId }: { campaignId: string }) {
	const { data: campaign, isLoading } = useCampaignDetails(campaignId);
	const [copied, setCopied] = useState(false);

	if (isLoading) {
		return <div className="p-8 text-center text-sm text-muted-foreground">جاري تحميل بيانات الحملة...</div>;
	}

	if (!campaign) {
		return <div className="p-8 text-center text-sm text-destructive">الحملة غير موجودة</div>;
	}

	const registrationUrl = typeof window !== "undefined"
		? window.location.port === "3001"
			? `${window.location.protocol}//${window.location.hostname}:3000/register/${campaign.code}`
			: `${window.location.origin}/register/${campaign.code}`
		: `https://sanad.app/register/${campaign.code}`;

	const handleCopy = () => {
		navigator.clipboard.writeText(registrationUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const remaining = Math.max(0, (campaign.maxCapacity || campaign.capacity || 0) - (campaign.accepted || 0));

	const requirements: string[] = [];
	if (campaign.requireBirthCert) requirements.push("شهادة ميلاد الطفل");
	if (campaign.requireId) requirements.push("الهوية الوطنية لولي الأمر");
	if (campaign.requireVaccine) requirements.push("كارت التطعيمات واللقاحات");

	return (
		<div className="flex w-full flex-col gap-4 p-4 mt-4" dir="rtl">
			{/* Grid Info */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="flex flex-col gap-1.5 rounded-md border p-4 bg-card text-start">
					<span className="text-[11px] text-muted-foreground font-medium">الفئة العمرية</span>
					<span className="text-sm font-bold text-foreground">{campaign.ageGroup}</span>
				</div>
				<div className="flex flex-col gap-1.5 rounded-md border p-4 bg-card text-start">
					<span className="text-[11px] text-muted-foreground font-medium">الفصل / المسار</span>
					<span className="text-sm font-bold text-foreground">{campaign.targetClass || "غير محدد"}</span>
				</div>

				<div className="flex flex-col gap-1.5 rounded-md border p-4 bg-card text-start">
					<span className="text-[11px] text-muted-foreground font-medium">السعة الإجمالية</span>
					<span className="text-sm font-bold text-foreground">{campaign.maxCapacity || campaign.capacity} مقعد</span>
				</div>
				<div className="flex flex-col gap-1.5 rounded-md border p-4 bg-card text-start">
					<span className="text-[11px] text-muted-foreground font-medium">المقاعد المتبقية</span>
					<span className="text-sm font-bold text-emerald-600">{remaining}</span>
				</div>

				<div className="flex flex-col gap-1.5 rounded-md border p-4 bg-card text-start">
					<span className="text-[11px] text-muted-foreground font-medium">تاريخ البدء</span>
					<span className="text-sm font-bold text-foreground">
						{campaign.startDate ? campaign.startDate.split("T")[0] : "غير محدد"}
					</span>
				</div>
				<div className="flex flex-col gap-1.5 rounded-md border p-4 bg-card text-start">
					<span className="text-[11px] text-muted-foreground font-medium">تاريخ الانتهاء</span>
					<span className="text-sm font-bold text-foreground">
						{campaign.endDate ? campaign.endDate.split("T")[0] : "مستمر"}
					</span>
				</div>

				<div className="flex flex-col gap-1.5 rounded-md border p-4 bg-card text-start">
					<span className="text-[11px] text-muted-foreground font-medium">المنشئ</span>
					<span className="text-sm font-bold text-foreground">{campaign.createdByName || "المشرف"}</span>
				</div>
				<div className="hidden lg:block"></div>
			</div>

			{/* Registration Link */}
			<div className="flex flex-col gap-3 rounded-md border p-4 bg-muted/40 text-start">
				<span className="text-sm font-bold text-foreground">رابط التسجيل الرقمي المباشر</span>
				<div className="flex items-center gap-2">
					<Input 
						className="flex-1 text-muted-foreground bg-background border-border" 
						value={registrationUrl} 
						readOnly 
						dir="ltr"
					/>
					<Button 
						variant="outline" 
						size="sm" 
						onClick={handleCopy}
						className="bg-background hover:bg-muted text-foreground px-4"
					>
						{copied ? <IconCheck className="me-1.5 size-4 text-emerald-600" /> : <IconCopy className="me-1.5 size-4" />}
						{copied ? "تم النسخ" : "نسخ"}
					</Button>
					<Button 
						variant="outline" 
						size="sm" 
						onClick={() => window.open(registrationUrl, "_blank")}
						className="bg-background hover:bg-muted text-foreground px-4"
					>
						<IconExternalLink className="me-1.5 size-4" />
						فتح
					</Button>
				</div>
			</div>

			{/* Requirements */}
			<div className="flex flex-col gap-2 rounded-md border p-4 bg-card text-start">
				<span className="text-sm font-bold text-foreground">المستندات المطلوبة للقبول</span>
				<span className="text-sm text-muted-foreground font-medium">
					{requirements.length > 0 ? requirements.join("، ") : "لا توجد مستندات مشروطة"}
				</span>
			</div>
		</div>
	);
}
