import { IconAlertTriangle, IconHistory, IconPlus } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AddVitalsDialog } from "@/features/services/vital-signs/components/add-vitals-dialog";
import { VitalsFreshnessBadge } from "@/features/services/vital-signs/components/vitals-freshness-badge";
import { VitalsHistoryDialog } from "@/features/services/vital-signs/components/vitals-history-dialog";
import { VitalsSnapshotCard } from "@/features/services/vital-signs/components/vitals-snapshot-card";
import {
	formatVitalValue,
	VITALS_FIELD_BY_KEY,
	VITALS_PROFILES,
	type VitalsProfile,
} from "@/features/services/vital-signs/data/vitals-fields";
import { useLatestVitalSigns } from "@/features/services/vital-signs/hooks/use-vital-signs";
import { useAttachVitalSigns } from "@/features/services/vital-signs/hooks/use-vital-signs-mutations";
import { cn } from "@/lib/utils";
import {
	type VitalSignsRecordResponse,
	type VitalsAttachTarget,
	vitalsFreshness,
} from "@sanad/contracts/runtime/server/vital-signs/vital-signs.type";

interface VitalsPickerProps {
	patientId: string;
	/** المستند الذي يُربط به القياس */
	target: VitalsAttachTarget;
	/** القياس المرتبط حاليًا — تمريره يعرض اللقطة بدل أدوات الاختيار */
	attached?: VitalSignsRecordResponse | null;
	profile?: VitalsProfile;
	/** المستند وصل حالة نهائية: اللقطة تُعرض بلا زر تغيير (§4) */
	frozen?: boolean;
	className?: string;
}

/**
 * نقطة الدخول الموحّدة للعلامات الحيوية في أي مستند. تجلب آخر قياس تلقائيًا مع
 * شارة عمره، وتتيح ثلاثة مسارات: استعماله، اختيار قياس أقدم من السجل، أو قياس
 * جديد. القياس الذي تجاوز 24 ساعة لا يُقترح استعماله بنفس البروز — التحذير وحده
 * لا يكفي حين يمضي يوم كامل (docs/vital-signs-plan.md §5).
 */
export function VitalsPicker({
	patientId,
	target,
	attached,
	profile = "FULL",
	frozen = false,
	className,
}: VitalsPickerProps) {
	const { latest, isLoading } = useLatestVitalSigns(patientId);
	const { attachVitalSigns, isPending: isAttaching } = useAttachVitalSigns(patientId);
	const [addOpen, setAddOpen] = useState(false);
	const [historyOpen, setHistoryOpen] = useState(false);

	if (attached) {
		return (
			<>
				<VitalsSnapshotCard
					record={attached}
					profile={profile}
					className={className}
					onChange={frozen ? undefined : () => setHistoryOpen(true)}
				/>
				<VitalsHistoryDialog
					patientId={patientId}
					open={historyOpen}
					onOpenChange={setHistoryOpen}
					onPick={async (record) => {
						await attachVitalSigns(record.id, target);
						setHistoryOpen(false);
					}}
					onCreateNew={() => {
						setHistoryOpen(false);
						setAddOpen(true);
					}}
				/>
				<AddVitalsDialog
					patientId={patientId}
					open={addOpen}
					onOpenChange={setAddOpen}
					profile={profile}
					attachTo={target}
				/>
			</>
		);
	}

	if (isLoading) return <Skeleton className={cn("h-28 w-full", className)} />;

	const stale = latest ? vitalsFreshness(latest.recordedAt) === "STALE" : false;
	const keys = VITALS_PROFILES[profile];

	return (
		<>
			<div className={cn("flex flex-col gap-3 rounded-[4px] border p-3", className)}>
				<div className="flex flex-wrap items-center gap-2">
					<span className="text-sm font-semibold">العلامات الحيوية</span>
					{latest ? (
						<>
							<VitalsFreshnessBadge recordedAt={latest.recordedAt} />
							<span
								className="text-xs text-muted-foreground tabular-nums"
								dir="ltr"
							>
								{latest.code}
							</span>
						</>
					) : (
						<span className="text-xs text-muted-foreground">
							لا يوجد قياس سابق لهذا الطفل
						</span>
					)}
				</div>

				{latest && (
					<div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
						{keys.map((key) => {
							const spec = VITALS_FIELD_BY_KEY.get(key);
							const value = latest[key];
							if (!spec || value == null) return null;
							return (
								<span
									key={key}
									className="tabular-nums"
								>
									<span className="text-muted-foreground">{spec.label}: </span>
									{formatVitalValue(value as string | number, spec)}
									{spec.unit && ` ${spec.unit}`}
								</span>
							);
						})}
					</div>
				)}

				{stale && (
					<p className="flex items-start gap-1.5 text-xs text-destructive">
						<IconAlertTriangle className="mt-0.5 size-3.5 shrink-0" />
						مضى أكثر من يوم على آخر قياس — يُنصح بقياس جديد قبل المتابعة.
					</p>
				)}

				<div className="flex flex-wrap items-center gap-2">
					{/* القياس القديم يفقد البروز: الزر الأساسي يصير «قياس جديد» */}
					{latest && (
						<Button
							size="sm"
							variant={stale ? "outline" : "default"}
							disabled={isAttaching}
							onClick={() => void attachVitalSigns(latest.id, target)}
						>
							استخدام هذا القياس
						</Button>
					)}
					<Button
						size="sm"
						variant={latest && !stale ? "outline" : "default"}
						onClick={() => setAddOpen(true)}
					>
						<IconPlus className="size-4" />
						قياس جديد
					</Button>
					<Button
						size="sm"
						variant="outline"
						onClick={() => setHistoryOpen(true)}
					>
						<IconHistory className="size-4" />
						اختيار من السجل
					</Button>
				</div>
			</div>

			<AddVitalsDialog
				patientId={patientId}
				open={addOpen}
				onOpenChange={setAddOpen}
				profile={profile}
				attachTo={target}
			/>
			<VitalsHistoryDialog
				patientId={patientId}
				open={historyOpen}
				onOpenChange={setHistoryOpen}
				onPick={async (record) => {
					await attachVitalSigns(record.id, target);
					setHistoryOpen(false);
				}}
				onCreateNew={() => {
					setHistoryOpen(false);
					setAddOpen(true);
				}}
			/>
		</>
	);
}
