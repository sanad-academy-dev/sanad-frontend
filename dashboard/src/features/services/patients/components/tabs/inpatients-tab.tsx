import { IconBedFlat } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

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
import {
	type ACUITY_META,
	STAY_KIND_META,
} from "@/features/care/inpatients/data/inpatients-data";
import type { PatientTabProps } from "@/features/services/patients/types/tabs.types";
import { api } from "@/lib/api";
import {
	DISCHARGE_KIND_LABELS,
	INPATIENT_STATUS_LABELS,
} from "@sanad/contracts/runtime/server/inpatients/inpatients.workflow";

/**
 * [IP5] لسان التنويم في ملفّ الطفل — تاريخ إقاماته.
 *
 * السؤال الذي يجيبه: «هل نُوّم هذا الطفل من قبل، ولماذا، وكم بقي؟» — وهو أوّل
 * ما يُسأل عند تنويم متكرّر. الإقامة الجارية تتصدّر بلافتة، والمنتهية تُقرأ
 * بطريقة خروجها لا بحالتها وحدها: «نفق» و«خروج طبيعي» ليسا الشيء نفسه.
 */

const dateFmt = new Intl.DateTimeFormat("ar", { dateStyle: "medium" });
const at = (v: Date | string | null | undefined) => (v ? dateFmt.format(new Date(v)) : "—");

type PatientStayRow = {
	id: string;
	code: string;
	kind: keyof typeof STAY_KIND_META;
	status: keyof typeof INPATIENT_STATUS_LABELS;
	acuity: keyof typeof ACUITY_META;
	admittedAt: string;
	dischargedAt: string | null;
	dischargeKind: string | null;
	admissionDiagnosis: string | null;
	attendingStaff: { name: string };
	cageAssignments: { cage: { name: string; room: { name: string } } }[];
	invoice: { code: string; total: string; status: string } | null;
};

const usePatientStays = (patientId: string) => {
	const { data, isLoading } = useQuery({
		queryKey: ["inpatients", "patient", patientId],
		enabled: Boolean(patientId),
		queryFn: async () => {
			const { data, error } = await api.inpatients.patient({ patientId }).get();
			// لسانٌ في ملفّ الطفل — من لا يملك صلاحية التنويم يراه فارغًا لا مكسورًا
			if (error) return [] as PatientStayRow[];
			return data as unknown as PatientStayRow[];
		},
		staleTime: 1000 * 60,
	});
	return { stays: data ?? [], isLoading };
};

const daysOf = (from: string, to: string | null) =>
	Math.max(
		1,
		Math.floor(
			(new Date(to ?? Date.now()).getTime() - new Date(from).getTime()) / 86_400_000,
		) + 1,
	);

export function InpatientsTab({ patientId }: PatientTabProps) {
	const { stays, isLoading } = usePatientStays(patientId);

	return (
		<TabsContent
			value="inpatients"
			className="p-4"
		>
			{isLoading ? (
				<div className="space-y-2">
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
				</div>
			) : stays.length === 0 ? (
				<div className="flex flex-col items-center gap-2 py-12 text-center">
					<IconBedFlat className="size-8 text-muted-foreground" />
					<p className="text-sm text-muted-foreground">لم يُنوَّم هذا الطفل من قبل</p>
				</div>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-start">الإقامة</TableHead>
							<TableHead className="text-start">النوع</TableHead>
							<TableHead className="text-start">الدخول</TableHead>
							<TableHead className="text-start">المدّة</TableHead>
							<TableHead className="text-start">التشخيص</TableHead>
							<TableHead className="text-start">المدرّب</TableHead>
							<TableHead className="text-start">الحالة</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{stays.map((stay) => {
							const isActive =
								stay.status === "ADMITTED" ||
								stay.status === "IN_CARE" ||
								stay.status === "DISCHARGE_PENDING";
							return (
								<TableRow key={stay.id}>
									<TableCell className="font-mono text-xs">{stay.code}</TableCell>
									<TableCell className="text-xs">
										{STAY_KIND_META[stay.kind]?.label ?? stay.kind}
									</TableCell>
									<TableCell className="text-xs">{at(stay.admittedAt)}</TableCell>
									<TableCell className="text-xs tabular-nums">
										{daysOf(stay.admittedAt, stay.dischargedAt)} يوم
									</TableCell>
									<TableCell className="max-w-40 truncate text-xs">
										{stay.admissionDiagnosis ?? "—"}
									</TableCell>
									<TableCell className="text-xs">{stay.attendingStaff.name}</TableCell>
									<TableCell>
										{isActive ? (
											<Badge variant="default">{INPATIENT_STATUS_LABELS[stay.status]}</Badge>
										) : (
											<Badge
												variant={
													stay.dischargeKind === "DIED" || stay.dischargeKind === "EUTHANIZED"
														? "destructive"
														: "secondary"
												}
											>
												{stay.dischargeKind
													? (DISCHARGE_KIND_LABELS[
															stay.dischargeKind as keyof typeof DISCHARGE_KIND_LABELS
														] ?? INPATIENT_STATUS_LABELS[stay.status])
													: INPATIENT_STATUS_LABELS[stay.status]}
											</Badge>
										)}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			)}
		</TabsContent>
	);
}
