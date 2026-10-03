import { IconPlus, IconX } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { VitalsFreshnessBadge } from "@/features/services/vital-signs/components/vitals-freshness-badge";
import {
	formatVitalValue,
	VITALS_FIELD_BY_KEY,
	VITALS_PROFILES,
	VITALS_SOURCE_LABELS,
} from "@/features/services/vital-signs/data/vitals-fields";
import { useVitalSigns } from "@/features/services/vital-signs/hooks/use-vital-signs";
import type { VitalSignsRecordResponse } from "@/server/vital-signs/vital-signs.type";

interface VitalsHistoryDialogProps {
	patientId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onPick: (record: VitalSignsRecordResponse) => void | Promise<void>;
	onCreateNew?: () => void;
}

/**
 * اختيار قياس سابق لربطه بمستند — الحالة التي وصفها المستخدم بـ«قبول قياس أقدم».
 * السجلات المُصحَّحة تظهر مكتومة وغير قابلة للاختيار: ربط مستند جديد بقياس عُرف
 * أنه خاطئ يعيد الخطأ نفسه إلى مستند آخر.
 */
export function VitalsHistoryDialog({
	patientId,
	open,
	onOpenChange,
	onPick,
	onCreateNew,
}: VitalsHistoryDialogProps) {
	const { records, isLoading } = useVitalSigns(open ? patientId : "", { limit: 100 });
	const keys = VITALS_PROFILES.BASIC;

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				showCloseButton={false}
				className="max-h-[85vh] gap-0 overflow-hidden p-0 sm:max-w-2xl"
				dir="rtl"
			>
				<DialogTitle className="sr-only">اختيار قياس من السجل</DialogTitle>

				<div className="flex items-center justify-between gap-2 border-b px-4 py-2">
					<span className="text-sm font-semibold">اختيار قياس من السجل</span>
					<div className="flex items-center gap-1">
						{onCreateNew && (
							<Button
								size="xs"
								variant="outline"
								className="h-7 text-xs"
								onClick={onCreateNew}
							>
								<IconPlus className="size-3.5" />
								قياس جديد
							</Button>
						)}
						<button
							type="button"
							onClick={() => onOpenChange(false)}
							className="flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
						>
							<IconX className="size-4" />
							<span className="sr-only">إغلاق</span>
						</button>
					</div>
				</div>

				<div className="max-h-[65vh] flex-1 space-y-2 overflow-y-auto p-3">
					{isLoading && (
						<>
							<Skeleton className="h-16 w-full" />
							<Skeleton className="h-16 w-full" />
							<Skeleton className="h-16 w-full" />
						</>
					)}

					{!isLoading && records.length === 0 && (
						<p className="py-8 text-center text-sm text-muted-foreground">
							لا توجد قياسات سابقة لهذا الطفل
						</p>
					)}

					{records.map((record) => {
						const superseded = !!record.correction;
						return (
							<div
								key={record.id}
								className={`flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[4px] border p-3 ${
									superseded ? "opacity-60" : ""
								}`}
							>
								<div className="flex items-center gap-2">
									<VitalsFreshnessBadge
										recordedAt={record.recordedAt}
										iconless
									/>
									<Badge variant="outline">{VITALS_SOURCE_LABELS[record.source]}</Badge>
									{superseded && <Badge variant="sub">مُصحَّح</Badge>}
								</div>

								<div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
									{keys.map((key) => {
										const spec = VITALS_FIELD_BY_KEY.get(key);
										const value = record[key];
										if (!spec || value == null) return null;
										return (
											<span
												key={key}
												className="tabular-nums"
											>
												<span className="text-muted-foreground">{spec.label}: </span>
												{formatVitalValue(value as string | number, spec)}
											</span>
										);
									})}
								</div>

								<span
									className="text-xs text-muted-foreground tabular-nums"
									dir="ltr"
								>
									{new Date(record.recordedAt).toLocaleString("en-GB")}
								</span>

								<Button
									size="xs"
									variant={superseded ? "ghost" : "outline"}
									className="ms-auto h-7 text-xs"
									disabled={superseded}
									title={superseded ? "أُنشئ تصحيح أحدث لهذا القياس" : undefined}
									onClick={() => void onPick(record)}
								>
									استخدام
								</Button>
							</div>
						);
					})}
				</div>
			</DialogContent>
		</Dialog>
	);
}
