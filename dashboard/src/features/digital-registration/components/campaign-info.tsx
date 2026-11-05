import { useState } from "react";
import { IconCopy, IconCheck, IconExternalLink, IconFileCheck, IconShieldCheck, IconInfoCircle } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCampaignDetails } from "../hooks/use-digital-registration";
import { getRegistrationFormUrl } from "../utils/registration-urls";

export function CampaignInfo({ campaignId }: { campaignId?: string }) {
	const { data: campaign, isLoading } = useCampaignDetails(campaignId || "");
	const [copied, setCopied] = useState(false);
	const [linkType, setLinkType] = useState<"general" | "campaign">("general");

	const registrationUrl = getRegistrationFormUrl(
		campaign?.code,
		linkType === "campaign",
	);

	const handleCopy = () => {
		navigator.clipboard.writeText(registrationUrl);
		setCopied(true);
		toast.success("تم نسخ رابط استمارة التسجيل بنجاح");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="flex w-full flex-col gap-5 p-4 mt-2 max-w-5xl mx-auto" dir="rtl">
			{/* Public Link Card */}
			<div className="flex flex-col gap-3 rounded-lg border border-primary/20 bg-primary/5 p-5 text-start shadow-2xs">
				<div className="flex items-center justify-between flex-wrap gap-2">
					<div className="flex items-center gap-2">
						<IconInfoCircle className="size-5 text-primary" />
						<h3 className="text-sm font-bold text-foreground">رابط استمارة التسجيل الإلكتروني لأولياء الأمور</h3>
					</div>
					{campaign?.code && (
						<div className="flex items-center gap-1.5 bg-background/80 p-0.5 rounded-lg border border-border/60 text-xs">
							<button
								type="button"
								onClick={() => setLinkType("general")}
								className={cn(
									"px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer",
									linkType === "general"
										? "bg-primary text-primary-foreground shadow-2xs font-semibold"
										: "text-muted-foreground hover:text-foreground",
								)}
							>
								الاستمارة العامة (/register)
							</button>
							<button
								type="button"
								onClick={() => setLinkType("campaign")}
								className={cn(
									"px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer",
									linkType === "campaign"
										? "bg-primary text-primary-foreground shadow-2xs font-semibold"
										: "text-muted-foreground hover:text-foreground",
								)}
							>
								استمارة الحملة ({campaign.code})
							</button>
						</div>
					)}
				</div>
				<p className="text-xs text-muted-foreground leading-relaxed">
					شارك هذا الرابط مع أولياء الأمور لفتح استمارة التقديم على موقع المركز وتعبئة بيانات الطالب ورفع المرفقات مباشرة.
				</p>
				<div className="flex items-center gap-2 pt-1">
					<Input
						className="flex-1 text-xs text-muted-foreground bg-background border-border font-mono select-all"
						value={registrationUrl}
						readOnly
						dir="ltr"
					/>
					<Button
						variant="outline"
						size="sm"
						onClick={handleCopy}
						className="bg-background hover:bg-muted text-foreground px-4 text-xs font-semibold gap-1.5 h-9 cursor-pointer"
					>
						{copied ? <IconCheck className="size-3.5 text-emerald-600" /> : <IconCopy className="size-3.5" />}
						{copied ? "تم النسخ" : "نسخ الرابط"}
					</Button>
					<Button
						variant="outline"
						size="sm"
						asChild
						className="bg-background hover:bg-muted text-foreground px-3 text-xs h-9 cursor-pointer"
					>
						<a href={registrationUrl} target="_blank" rel="noopener noreferrer" title="فتح استمارة التسجيل في تبويب جديد">
							<IconExternalLink className="size-3.5" />
						</a>
					</Button>
				</div>
			</div>

			{/* Info Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="flex flex-col gap-2 rounded-lg border p-4 bg-card text-start shadow-2xs">
					<div className="flex items-center gap-2 text-xs font-bold text-foreground">
						<IconShieldCheck className="size-4 text-emerald-600" />
						<span>المسار والقبول الأكاديمي</span>
					</div>
					<p className="text-xs text-muted-foreground leading-relaxed">
						{campaign?.targetClass || "جميع المسارات التعليمية والتأهيلية المعتمدة"}
					</p>
					<span className="text-[11px] font-semibold text-primary pt-1">
						الفئة المستهدفة: {campaign?.ageGroup || "من سن سنتين وما فوق"}
					</span>
				</div>

				<div className="flex flex-col gap-2 rounded-lg border p-4 bg-card text-start shadow-2xs">
					<div className="flex items-center gap-2 text-xs font-bold text-foreground">
						<IconFileCheck className="size-4 text-blue-600" />
						<span>المستندات المطلوبة</span>
					</div>
					<ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
						<li>شهادة ميلاد الطفل</li>
						<li>الهوية الوطنية أو إقامة ولي الأمر</li>
						<li>كارت التطعيمات واللقاحات</li>
						<li>تقارير طبية سابقة (إن وُجدت)</li>
					</ul>
				</div>

				<div className="flex flex-col gap-2 rounded-lg border p-4 bg-card text-start shadow-2xs">
					<div className="flex items-center gap-2 text-xs font-bold text-foreground">
						<IconInfoCircle className="size-4 text-purple-600" />
						<span>دورة إجراءات القبول</span>
					</div>
					<ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
						<li>استلام الطلب والفرز الأولي</li>
						<li>حجز موعد جلسة الفحص والتقييم</li>
						<li>المراجعة الفنية واعتماد الإدارة</li>
						<li>ترحيل الطالب إلى النظام الرسمي</li>
					</ol>
				</div>
			</div>
		</div>
	);
}
