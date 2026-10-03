import { IconAlertTriangleFilled } from "@tabler/icons-react";
import { LiveBadge } from "@/components/common/live-badge";
import { Badge } from "@/components/ui/badge";
import { useRadiologyList } from "@/features/services/radiology/hooks/use-radiology-list";
import { useRadiologyLive } from "@/features/services/radiology/hooks/use-radiology-live";
import { useSelectedRadiologyOrderStore } from "@/features/services/radiology/stores/selected-radiology-order.store";
import { Route as RadiologyRoute } from "@/routes/_pathless-layout/services/radiology";

const MAX_VISIBLE = 6;

// شريط النتائج الحرجة — التقارير المُعلَّمة بنتيجة حرجة لم يُوثَّق تبليغها بعد
// تظهر هنا للفتح المباشر والتصعيد الفوري.
export function RadiologyAlertsStrip() {
	const { period, view } = RadiologyRoute.useSearch();
	const { radiologyOrders, isError, failureCount, dataUpdatedAt } = useRadiologyList(
		period,
		view,
	);
	const { liveState } = useRadiologyLive({ isError, failureCount, dataUpdatedAt });
	const select = useSelectedRadiologyOrderStore((s) => s.select);

	const critical = radiologyOrders.flatMap((order) =>
		order.items
			.filter((item) => item.report?.criticalFinding && !item.report.criticalNotifiedAt)
			.map((item) => ({
				orderId: order.id,
				itemId: item.id,
				patientName: order.patient.name,
				examName: item.service.name,
				impression: item.report?.impression ?? null,
			})),
	);

	const visible = critical.slice(0, MAX_VISIBLE);
	const overflow = critical.length - visible.length;

	return (
		<div className="flex items-center gap-3 px-4 min-h-8">
			<LiveBadge state={liveState} />

			{critical.length > 0 && (
				<Badge className="shrink-0 gap-1 border-red-200 bg-red-50 py-0.5 text-[10px] text-red-700">
					<IconAlertTriangleFilled className="size-3" />
					نتائج حرجة غير مبلَّغة
				</Badge>
			)}

			<div className="flex flex-wrap items-center gap-1.5">
				{visible.map((alert) => (
					<button
						key={alert.itemId}
						type="button"
						onClick={() =>
							select(alert.orderId, { itemId: alert.itemId, focusItemId: alert.itemId })
						}
						className="flex items-center gap-1.5 rounded-[4px] border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] text-red-700 hover:bg-red-100"
					>
						<span className="font-semibold">{alert.patientName}</span>
						<span className="text-red-600">•</span>
						<span>{alert.examName}</span>
						{alert.impression && (
							<span className="max-w-40 truncate text-red-600/80">{alert.impression}</span>
						)}
					</button>
				))}
				{overflow > 0 && (
					<span className="text-[11px] text-muted-foreground">+{overflow} أخرى</span>
				)}
			</div>
		</div>
	);
}
