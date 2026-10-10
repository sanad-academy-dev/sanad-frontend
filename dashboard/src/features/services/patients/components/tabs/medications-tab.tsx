import { IconPill } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { PRESCRIPTION_STATUS_LABELS } from "@/features/pharmacy/components/prescriptions-table";
import {
	usePatientPrescriptions,
	usePharmacySettings,
} from "@/features/pharmacy/hooks/use-pharmacy";
import type { PatientTabProps } from "@/features/services/patients/types/tabs.types";
import type { PrescriptionStatus } from "@/generated/prisma/enums";

/**
 * [PH14.1] تبويب الأدوية في ملف الطفل — BRD §11.5.
 *
 * سؤال المدرّب عند فتح الملف هو «ماذا يأخذ الآن؟» قبل «ماذا أخذ قبل سنة؟»، فالصادرة
 * أولًا ثم البقيّة — نفس ترتيب تبويب التغذية.
 *
 * التبويب يظهر حتى مع إطفاء الوحدة، لكن بلا استعلام: الوصفات القديمة لا تختفي لأن
 * الوحدة أُطفئت، والسجل الطبي لا يُخفي ما حدث.
 */

const dateFmt = new Intl.DateTimeFormat("ar", { dateStyle: "medium" });
const at = (v: Date | string | null | undefined) => (v ? dateFmt.format(new Date(v)) : "—");

const STATUS_TONE = (status: PrescriptionStatus) => {
	if (status === "ACTIVE") return "default" as const;
	if (status === "CANCELLED") return "destructive" as const;
	if (status === "COMPLETED") return "secondary" as const;
	return "outline" as const;
};

export function MedicationsTab({ patientId }: PatientTabProps) {
	const { enabled } = usePharmacySettings();
	const { prescriptions, isLoading } = usePatientPrescriptions(patientId, !!patientId);

	return (
		<TabsContent
			value="medications"
			className="flex flex-col gap-4 overflow-y-auto p-4"
			dir="rtl"
		>
			{!enabled && (
				<p className="rounded-[4px] border border-dashed p-3 text-[11px] text-muted-foreground">
					وحدة الصيدلية غير مفعّلة — يُعرض السجل السابق ولا تُكتب وصفات جديدة.
				</p>
			)}

			{isLoading ? (
				<div className="flex flex-col gap-2">
					<Skeleton className="h-8 w-full" />
					<Skeleton className="h-24 w-full" />
				</div>
			) : prescriptions.length === 0 ? (
				<div className="flex flex-col items-center gap-1.5 rounded-[4px] border border-dashed py-10 text-center">
					<IconPill className="size-6 text-muted-foreground/50" />
					<p className="text-muted-foreground text-xs">
						لا وصفات لهذا الطفل — تُكتب من داخل الفحص السريري
					</p>
				</div>
			) : (
				<div className="rounded-[4px] border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>الوصفة</TableHead>
								<TableHead>البنود</TableHead>
								<TableHead>المدرّب</TableHead>
								<TableHead>الحالة</TableHead>
								<TableHead>التاريخ</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{prescriptions.map((rx) => (
								<TableRow key={rx.id}>
									<TableCell className="font-medium tabular-nums">{rx.code}</TableCell>
									<TableCell className="tabular-nums">{rx._count.items}</TableCell>
									<TableCell>{rx.prescriber?.name ?? "—"}</TableCell>
									<TableCell>
										<Badge variant={STATUS_TONE(rx.status)}>
											{PRESCRIPTION_STATUS_LABELS[rx.status]}
										</Badge>
									</TableCell>
									<TableCell className="text-muted-foreground text-xs tabular-nums">
										{at(rx.issuedAt ?? rx.createdAt)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
		</TabsContent>
	);
}
