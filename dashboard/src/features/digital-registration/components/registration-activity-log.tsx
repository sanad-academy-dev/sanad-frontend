import { IconActivity, IconCalendar, IconCheck, IconClock, IconUser } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { useCampaignRequests } from "../hooks/use-digital-registration";

export function RegistrationActivityLog({ campaignId }: { campaignId?: string }) {
	const { data: requests = [], isLoading } = useCampaignRequests(campaignId || "");

	if (isLoading) {
		return (
			<div className="p-8 text-center text-xs text-muted-foreground">
				جاري تحميل سجل النشاط...
			</div>
		);
	}

	// Gather all timeline steps from all requests
	const allActivities = requests.flatMap((r) =>
		(r.timeline || []).map((step) => ({
			...step,
			studentName: r.patientName || r.name,
			studentCode: r.code,
			statusVariant: r.statusVariant,
		})),
	);

	if (allActivities.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center gap-2 p-12 text-center" dir="rtl">
				<IconActivity className="size-8 text-muted-foreground/50" />
				<h4 className="text-sm font-semibold text-foreground">لا يوجد نشاط مسجل حتى الآن</h4>
				<p className="text-xs text-muted-foreground">
					ستظهر هنا جميع الأنشطة والقرارات المتخذة بشأن طلبات التسجيل فور البدء بمعالجتها.
				</p>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto w-full p-4 mt-2 flex flex-col gap-3" dir="rtl">
			<h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
				<IconActivity className="size-4 text-primary" />
				<span>سجل الأنشطة والمتابعة المباشرة</span>
			</h3>

			<div className="flex flex-col gap-2">
				{allActivities.map((act) => (
					<div
						key={act.id}
						className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors shadow-2xs text-xs"
					>
						<div className="flex items-center gap-3">
							<div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
								<IconUser className="size-3.5" />
							</div>
							<div className="flex flex-col text-start">
								<div className="flex items-center gap-2">
									<span className="font-bold text-foreground">{act.studentName}</span>
									<span className="font-mono text-[10px] text-muted-foreground" dir="ltr">
										#{act.studentCode}
									</span>
								</div>
								<span className="text-[11px] text-muted-foreground">{act.title}</span>
							</div>
						</div>

						<div className="flex items-center gap-2 shrink-0">
							{act.statusBadge && (
								<Badge variant="outline" className="text-[10px] font-semibold py-0.5">
									{act.statusBadge}
								</Badge>
							)}
							<div className="flex items-center gap-1 text-[11px] text-muted-foreground">
								<IconClock className="size-3" />
								<span>{act.actorName}</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
