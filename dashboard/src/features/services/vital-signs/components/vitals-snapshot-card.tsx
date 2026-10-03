import { IconHistory, IconUser } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VitalsFreshnessBadge } from "@/features/services/vital-signs/components/vitals-freshness-badge";
import {
	formatVitalValue,
	MUCOUS_MEMBRANE_LABELS,
	VITALS_FIELD_BY_KEY,
	VITALS_PROFILES,
	VITALS_SOURCE_LABELS,
	type VitalsProfile,
} from "@/features/services/vital-signs/data/vitals-fields";
import { cn } from "@/lib/utils";
import type { VitalSignsRecordResponse } from "@/server/vital-signs/vital-signs.type";

interface VitalsSnapshotCardProps {
	record: VitalSignsRecordResponse;
	profile?: VitalsProfile;
	/** يظهر زر «تغيير» ما دام المستند قابلًا للتحرير */
	onChange?: () => void;
	className?: string;
}

/**
 * عرض القياس المرتبط بمستند كما كان وقت الربط. القيم تُقرأ من السجل لا من نسخة
 * محليّة — وإذا صُحِّح السجل لاحقًا تظهر شارة «مُصحَّح» دون أن تتغيّر الأرقام هنا،
 * فهذا هو معنى اللقطة (docs/vital-signs-plan.md §4).
 */
export function VitalsSnapshotCard({
	record,
	profile = "FULL",
	onChange,
	className,
}: VitalsSnapshotCardProps) {
	const keys = VITALS_PROFILES[profile];
	const shown = keys
		.map((key) => ({ spec: VITALS_FIELD_BY_KEY.get(key), value: record[key] }))
		.filter((f) => f.spec && f.value != null);

	return (
		<div className={cn("flex flex-col gap-3 rounded-[4px] border p-3", className)}>
			<div className="flex flex-wrap items-center gap-2">
				<span className="text-sm font-semibold">العلامات الحيوية</span>
				<VitalsFreshnessBadge recordedAt={record.recordedAt} />
				<Badge variant="outline">{VITALS_SOURCE_LABELS[record.source]}</Badge>
				<span
					className="text-xs text-muted-foreground tabular-nums"
					dir="ltr"
				>
					{record.code}
				</span>

				{record.correction && (
					<Badge
						variant="sub"
						className="gap-1"
						title="أُنشئ تصحيح أحدث لهذا القياس — الأرقام هنا هي ما رآه المستند وقت الربط"
					>
						<IconHistory />
						مُصحَّح
					</Badge>
				)}

				{onChange && (
					<Button
						size="xs"
						variant="outline"
						className="ms-auto h-7 text-xs"
						onClick={onChange}
					>
						تغيير
					</Button>
				)}
			</div>

			{shown.length === 0 && record.bloodPressure == null && record.mucousMembrane == null ? (
				<p className="text-sm text-muted-foreground">لا توجد قياسات مسجّلة</p>
			) : (
				<div className="grid grid-cols-2 gap-2 md:grid-cols-4">
					{shown.map(({ spec, value }) =>
						spec ? (
							<ValueTile
								key={spec.key}
								label={spec.label}
								value={`${formatVitalValue(value as string | number, spec)}${spec.unit ? ` ${spec.unit}` : ""}`}
							/>
						) : null,
					)}
					{record.bloodPressure && (
						<ValueTile
							label="ضغط الدم"
							value={`${record.bloodPressure} mmHg`}
						/>
					)}
					{record.mucousMembrane && (
						<ValueTile
							label="الأغشية المخاطية"
							value={MUCOUS_MEMBRANE_LABELS[record.mucousMembrane]}
						/>
					)}
				</div>
			)}

			<div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
				<span
					className="tabular-nums"
					dir="ltr"
				>
					{new Date(record.recordedAt).toLocaleString("en-GB")}
				</span>
				{record.recordedBy && (
					<span className="flex items-center gap-1">
						<IconUser className="size-3.5" />
						{record.recordedBy.name}
					</span>
				)}
				{record.notes && <span className="truncate">{record.notes}</span>}
			</div>
		</div>
	);
}

function ValueTile({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex flex-col gap-0.5 rounded-[4px] bg-muted/50 px-2 py-1.5">
			<span className="text-[11px] text-muted-foreground">{label}</span>
			<span className="text-sm font-medium tabular-nums">{value}</span>
		</div>
	);
}
