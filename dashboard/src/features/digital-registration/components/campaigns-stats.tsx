import { useMemo } from "react";

import { Stats } from "@/components/common/stats";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";

export function CampaignsStats() {
	const stats = useMemo<StatItem[]>(() => {
		return [
			{ title: "الحملات النشطة", value: 4, tooltip: "إجمالي الحملات النشطة حالياً" },
			{ title: "إجمالي الطلبات", value: 200, tooltip: "إجمالي عدد الطلبات المستقبلة" },
			{ title: "مقبول", value: 144, tooltip: "عدد الطلبات المقبولة" },
			{ title: "قيد المراجعة", value: 26, tooltip: "عدد الطلبات قيد المراجعة" },
		];
	}, []);

	return <Stats className="px-4 py-4 grid-cols-4 border-b" stats={stats} />;
}
