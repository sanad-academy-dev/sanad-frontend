import { IconExternalLink } from "@tabler/icons-react";
import { format } from "date-fns";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { AdPreviewCard } from "@/features/marketing/ad-campaigns/components/ad-preview-card";
import { PlatformBadge } from "@/features/marketing/ad-campaigns/components/platform-badge";
import { useAdCampaignDetail } from "@/features/marketing/ad-campaigns/hooks/use-ad-campaign-mutations";
import { useI18n } from "@/hooks/use-i18n";
import { getFileUrl } from "@/lib/file-url";
import {
	AD_CAMPAIGN_STATUS_LABELS,
	AD_OBJECTIVE_LABELS,
} from "@sanad/contracts/runtime/server/ad-campaigns/ad-campaigns.type";

const numberFormat = new Intl.NumberFormat("en-US");

/**
 * [MK7] تفاصيل الحملة وأداؤها — **غير مرسومة في Figma** (الفجوة G4).
 *
 * الجدول يعرض «عدد الظهور / التفاعل / الوصول» بلا وجهة للنقر، وكل منافس يملك هذه
 * الشاشة. المعروض هنا ما نملكه فعلًا فقط:
 *
 * - **لا رسم بياني زمني.** تحت القرار D1 لا تُسحب أرقام من المنصّة، فسلسلة
 *   `AdCampaignMetric` تبقى فارغة في الغالب. رسمٌ لخطٍّ مسطّح على صفر يُوحي بأن
 *   الحملة فشلت، لا بأننا لا نقيس. الأرقام تُعرض مجاميع مع سطر يقول من أين تأتي.
 * - **لا «الإنفاق مقابل الميزانية».** الإنفاق الحقيقي عند المنصّة؛ نسبةٌ نحسبها
 *   من صفر ستقرأ «0% مستهلك» وهو ادّعاء لا نملكه.
 */
export function CampaignDetailSheet({
	campaignId,
	onOpenChange,
}: {
	campaignId: string | null;
	onOpenChange: (open: boolean) => void;
}) {
	const { isRtl } = useI18n();
	const { campaign, isLoading } = useAdCampaignDetail(campaignId);
	const creative = campaign?.creatives[0];

	return (
		<Sheet
			open={!!campaignId}
			onOpenChange={onOpenChange}
		>
			{/* محتوى Radix في portal — الاتجاه صراحةً. و`side="left"` هو اصطلاح
			    الألواح الجانبية في التطبيق كلّه تحت RTL (المحاسبة، الجلسات، التغذية) */}
			<SheetContent
				side="left"
				dir={isRtl ? "rtl" : "ltr"}
				className="w-[min(560px,95vw)] gap-0 p-0 sm:max-w-[560px]"
			>
				<div className="border-b px-4 py-2">
					<SheetTitle className="text-base">{campaign?.name ?? "تفاصيل الحملة"}</SheetTitle>
					{campaign && (
						<p className="text-muted-foreground text-xs">
							<span dir="ltr">{campaign.code}</span> ·{" "}
							{AD_OBJECTIVE_LABELS[campaign.objective]}
						</p>
					)}
				</div>

				<div className="max-h-[calc(100vh-6rem)] overflow-y-auto p-4">
					{isLoading && (
						<div className="flex justify-center py-10">
							<Spinner className="size-5" />
						</div>
					)}

					{campaign && (
						<div className="flex flex-col gap-4">
							<section>
								<h3 className="mb-2 font-medium text-sm">الحالة</h3>
								<dl className="rounded-[4px] border text-sm">
									<Row label="المنصّة">
										<PlatformBadge platform={campaign.platform} />
									</Row>
									<Row label="الحالة">{AD_CAMPAIGN_STATUS_LABELS[campaign.status]}</Row>
									<Row label="المدة">
										{campaign.durationDays ? `${campaign.durationDays} يوم` : "—"}
									</Row>
									<Row label="النافذة الزمنية">
										{campaign.startsAt && campaign.endsAt ? (
											<span dir="ltr">
												{format(new Date(campaign.startsAt), "yyyy/MM/dd")} →{" "}
												{format(new Date(campaign.endsAt), "yyyy/MM/dd")}
											</span>
										) : (
											"—"
										)}
									</Row>
									<Row label="الميزانية">
										{campaign.budgetAmount !== null ? (
											<span dir="ltr">
												{numberFormat.format(Number(campaign.budgetAmount))} ر.س
												{campaign.budgetKind === "DAILY" ? " / يوم" : ""}
											</span>
										) : (
											"—"
										)}
									</Row>
									<Row label="أُطلقت في">
										{campaign.launchedAt ? (
											<span dir="ltr">
												{format(new Date(campaign.launchedAt), "yyyy/MM/dd")}
											</span>
										) : (
											"—"
										)}
									</Row>
								</dl>
							</section>

							<section>
								<h3 className="mb-2 font-medium text-sm">الأداء</h3>
								<p className="mb-2 rounded-[4px] bg-muted/50 p-2.5 text-muted-foreground text-xs leading-relaxed">
									الأرقام تأتي من مدير إعلانات المنصّة ولا تُسحب تلقائيًّا في هذا الإصدار — تبقى
									صفرًا حتى تُدخَل أو تُستورد.
								</p>
								<dl className="grid grid-cols-2 gap-2">
									<Metric
										label="عدد الظهور"
										value={campaign.metricsTotals?.impressions ?? 0}
									/>
									<Metric
										label="التفاعل"
										value={campaign.metricsTotals?.engagements ?? 0}
									/>
									<Metric
										label="الوصول"
										value={campaign.metricsTotals?.reach ?? 0}
									/>
									<Metric
										label="الإنفاق المسجَّل"
										value={campaign.metricsTotals?.spend ?? 0}
										suffix=" ر.س"
									/>
								</dl>
							</section>

							{campaign.externalError && (
								<section>
									<h3 className="mb-2 font-medium text-destructive text-sm">خطأ الإطلاق</h3>
									<p className="rounded-[4px] border border-destructive/40 bg-destructive/5 p-2.5 text-xs">
										{campaign.externalError}
									</p>
								</section>
							)}

							<section>
								<h3 className="mb-2 font-medium text-sm">الإعلان</h3>
								{creative ? (
									<AdPreviewCard
										pageName={campaign.socialAccount?.name}
										primaryText={creative.primaryText}
										headline={creative.headline}
										description={creative.description}
										linkUrl={creative.linkUrl}
										imageUrl={
											creative.imageUrl
												? (getFileUrl(creative.imageUrl) ?? creative.imageUrl)
												: null
										}
									/>
								) : (
									<p className="rounded-[4px] border border-dashed p-3 text-muted-foreground text-xs">
										لم تُضَف مادّة إعلانية بعد.
									</p>
								)}
							</section>

							{campaign.audience && (
								<section>
									<h3 className="mb-2 font-medium text-sm">الجمهور</h3>
									<p className="rounded-[4px] border p-3 text-sm">{campaign.audience.name}</p>
								</section>
							)}

							{campaign.externalId && (
								<p className="flex items-center gap-1.5 text-muted-foreground text-xs">
									<IconExternalLink className="size-3.5" />
									معرّف المنصّة: <span dir="ltr">{campaign.externalId}</span>
								</p>
							)}
						</div>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="flex items-center justify-between gap-3 border-b px-3 py-2 last:border-b-0">
			<dt className="shrink-0 text-muted-foreground text-xs">{label}</dt>
			<dd className="min-w-0 truncate text-sm">{children}</dd>
		</div>
	);
}

function Metric({
	label,
	value,
	suffix = "",
}: {
	label: string;
	value: number;
	suffix?: string;
}) {
	return (
		<div className="rounded-[4px] border p-3">
			<dt className="text-muted-foreground text-xs">{label}</dt>
			<dd
				dir="ltr"
				className="font-semibold text-lg"
			>
				{numberFormat.format(value)}
				{suffix}
			</dd>
		</div>
	);
}
