import { IconAlertTriangleFilled } from "@tabler/icons-react";
import { LiveBadge } from "@/components/common/live-badge";
import { Badge } from "@/components/ui/badge";
import { useLabTestsList } from "@/features/services/lab-tests/hooks/use-lab-tests-list";
import { useLabTestsLive } from "@/features/services/lab-tests/hooks/use-lab-tests-live";
import { useSelectedLabTestStore } from "@/features/services/lab-tests/stores/selected-lab-test.store";
import { LabResultFlag } from "@/generated/prisma/enums";
import { Route as LabTestsRoute } from "@/routes/_pathless-layout/services/lab-tests";

const MAX_VISIBLE = 6;

// شريط القيم الحرجة — أي نتيجة خارج نطاقها الطبيعي تظهر هنا للفتح المباشر.
export function LabTestsAlertsStrip() {
	const { period, view } = LabTestsRoute.useSearch();
	const { labTests, isError, failureCount, dataUpdatedAt } = useLabTestsList(period, view);
	const { liveState } = useLabTestsLive({ isError, failureCount, dataUpdatedAt });
	const select = useSelectedLabTestStore((s) => s.select);

	const critical = labTests.flatMap((order) =>
		order.items.flatMap((item) =>
			item.results
				.filter((result) => result.flag !== LabResultFlag.NORMAL)
				.map((result) => ({
					orderId: order.id,
					resultId: result.id,
					patientName: order.patient.name,
					testName: item.service.name,
					parameterName: result.name,
					value: result.value,
					unit: result.unit,
					isHigh: result.flag === LabResultFlag.HIGH,
				})),
		),
	);

	const visible = critical.slice(0, MAX_VISIBLE);
	const overflow = critical.length - visible.length;

	return (
		<div className="flex items-center gap-3 px-4 min-h-8">
			<LiveBadge state={liveState} />

			{critical.length > 0 && (
				<Badge className="shrink-0 gap-1 border-red-200 bg-red-50 py-0.5 text-[10px] text-red-700">
					<IconAlertTriangleFilled className="size-3" />
					قيم حرجة
				</Badge>
			)}

			<div className="flex flex-wrap items-center gap-1.5">
				{visible.map((alert) => (
					<button
						key={alert.resultId}
						type="button"
						onClick={() => select(alert.orderId)}
						className="flex items-center gap-1.5 rounded-[4px] border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] text-red-700 hover:bg-red-100"
					>
						<span className="font-semibold">{alert.patientName}</span>
						<span className="text-red-600">•</span>
						<span>
							{alert.testName} / {alert.parameterName}
						</span>
						<span className="font-bold tabular-nums">
							{alert.isHigh ? "↑" : "↓"} {alert.value}
							{alert.unit ? ` ${alert.unit}` : ""}
						</span>
					</button>
				))}
				{overflow > 0 && (
					<span className="text-[11px] text-muted-foreground">+{overflow} أخرى</span>
				)}
			</div>
		</div>
	);
}
