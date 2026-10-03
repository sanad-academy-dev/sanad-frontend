import { IconChartLine } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TabsContent } from "@/components/ui/tabs";
import type { PatientTabProps } from "@/features/services/patients/types/tabs.types";
import { AddVitalsDialog } from "@/features/services/vital-signs/components/add-vitals-dialog";
import { VitalsCharts } from "@/features/services/vital-signs/components/vitals-charts";
import { VitalsHistoryTable } from "@/features/services/vital-signs/components/vitals-history-table";
import { VitalsLatestStrip } from "@/features/services/vital-signs/components/vitals-latest-strip";
import { useVitalSigns } from "@/features/services/vital-signs/hooks/use-vital-signs";
import type { VitalSignsRecordResponse } from "@/server/vital-signs/vital-signs.type";

export function VitalSignsTab({ patientId }: PatientTabProps) {
	// السقف مرتفع عمدًا: الرسم البياني يحتاج السلسلة كاملة، والجدول يُصفّح محليًا
	const { records, isLoading } = useVitalSigns(patientId, { limit: 200 });
	const [addOpen, setAddOpen] = useState(false);
	const [editing, setEditing] = useState<VitalSignsRecordResponse | null>(null);
	// الرسوم تحلّ محلّ محتوى التبويب بالكامل بدل أن تُضاف تحته — الرسم المثبَّت
	// يحتاج المساحة كاملةً ليُقرأ منه اتجاه، والعودة بزر «رجوع»
	const [showCharts, setShowCharts] = useState(false);

	if (!patientId || isLoading) {
		return (
			<TabsContent
				value="vital-signs"
				className="m-0 flex flex-col gap-4 p-4"
				dir="rtl"
			>
				<Skeleton className="h-24 w-full" />
				<div className="grid grid-cols-2 gap-3">
					<Skeleton className="h-40" />
					<Skeleton className="h-40" />
				</div>
				<Skeleton className="h-64 w-full" />
			</TabsContent>
		);
	}

	return (
		<TabsContent
			value="vital-signs"
			className="m-0 flex flex-col gap-6 overflow-y-auto p-4"
			dir="rtl"
		>
			{showCharts ? (
				<VitalsCharts
					records={records}
					onBack={() => setShowCharts(false)}
				/>
			) : (
				<>
					<VitalsLatestStrip
						records={records}
						onAdd={() => setAddOpen(true)}
						actions={
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowCharts(true)}
							>
								<IconChartLine className="size-4" />
								الرسوم البيانية
							</Button>
						}
					/>

					<VitalsHistoryTable
						patientId={patientId}
						records={records}
						onEdit={setEditing}
					/>
				</>
			)}

			<AddVitalsDialog
				patientId={patientId}
				open={addOpen}
				onOpenChange={setAddOpen}
				profile="FULL"
			/>
			<AddVitalsDialog
				patientId={patientId}
				open={!!editing}
				onOpenChange={(open) => !open && setEditing(null)}
				profile="FULL"
				editing={editing}
			/>
		</TabsContent>
	);
}
