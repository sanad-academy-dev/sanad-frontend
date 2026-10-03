import { IconMinus, IconPlus, IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { VitalsFreshnessBadge } from "@/features/services/vital-signs/components/vitals-freshness-badge";
import {
	formatVitalValue,
	VITALS_FIELDS,
	type VitalsFieldSpec,
} from "@/features/services/vital-signs/data/vitals-fields";
import { cn } from "@/lib/utils";
import type { VitalSignsRecordResponse } from "@/server/vital-signs/vital-signs.type";

interface VitalsLatestStripProps {
	/** بترتيب تنازلي بوقت القياس — الأحدث أولًا */
	records: VitalSignsRecordResponse[];
	onAdd: () => void;
	/** أزرار إضافية في شريط الرأس — منفذ عام حتى لا يعرف الشريط بالرسوم البيانية */
	actions?: ReactNode;
}

/**
 * آخر قيمة لكل مقياس مع فارقها عن القياس السابق الذي يحمل المقياس نفسه.
 * «السابق» ليس بالضرورة السجل السابق مباشرةً — قياس المختبر لا يحمل وزنًا،
 * فمقارنة الوزن تقفز إلى آخر سجل يحمل وزنًا فعلًا.
 */
export function VitalsLatestStrip({ records, onAdd, actions }: VitalsLatestStripProps) {
	const live = records.filter((r) => !r.correction);
	const newest = live[0];

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<p className="font-semibold text-sm">آخر قياس</p>
					{newest && <VitalsFreshnessBadge recordedAt={newest.recordedAt} />}
				</div>
				<div className="flex items-center gap-2">
					{actions}
					<Button
						size="sm"
						onClick={onAdd}
					>
						<IconPlus className="size-4" />
						قياس جديد
					</Button>
				</div>
			</div>

			{!newest ? (
				<p className="rounded-[4px] border p-6 text-center text-sm text-muted-foreground">
					لا توجد قياسات مسجّلة لهذا الطفل بعد
				</p>
			) : (
				<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
					{VITALS_FIELDS.map((spec) => (
						<MetricTile
							key={spec.key}
							spec={spec}
							records={live}
						/>
					))}
				</div>
			)}
		</div>
	);
}

function MetricTile({
	spec,
	records,
}: {
	spec: VitalsFieldSpec;
	records: VitalSignsRecordResponse[];
}) {
	const withValue = records.filter((r) => r[spec.key] != null);
	const current = withValue[0];
	const previous = withValue[1];

	if (!current) {
		return (
			<div className="flex flex-col gap-1 rounded-[4px] border p-3">
				<p className="text-xs text-muted-foreground">{spec.label}</p>
				<p className="text-xl font-bold text-muted-foreground">—</p>
			</div>
		);
	}

	const currentValue = Number(current[spec.key]);
	const previousValue = previous ? Number(previous[spec.key]) : null;
	const delta = previousValue == null ? null : currentValue - previousValue;
	// فرق أصغر من نصف وحدة عرض يُقرأ صفرًا بعد التقريب — نعرضه ثابتًا لا متغيّرًا
	const flat = delta != null && Math.abs(delta) < 0.5 / 10 ** spec.precision;

	const DeltaIcon = flat ? IconMinus : (delta ?? 0) > 0 ? IconTrendingUp : IconTrendingDown;

	return (
		<div className="flex flex-col gap-1 rounded-[4px] border p-3">
			<p className="text-xs text-muted-foreground">{spec.label}</p>
			<div className="flex items-baseline gap-1.5">
				<p className="text-xl font-bold tabular-nums">
					{formatVitalValue(current[spec.key] as string | number, spec)}
				</p>
				{spec.unit && <span className="text-xs text-muted-foreground">{spec.unit}</span>}
			</div>

			{delta != null && (
				<div
					className={cn(
						"flex items-center gap-1 text-xs tabular-nums",
						// اللون إشارة اتجاه لا حكم: ارتفاع الحرارة والوزن ليسا الشيء نفسه
						"text-muted-foreground",
					)}
				>
					<DeltaIcon className="size-3.5" />
					<span dir="ltr">
						{flat
							? "بلا تغيير"
							: `${delta > 0 ? "+" : "−"}${Math.abs(delta).toFixed(spec.precision)}`}
					</span>
				</div>
			)}
		</div>
	);
}
