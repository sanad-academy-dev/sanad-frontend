import { IconPrinter } from "@tabler/icons-react";
import { useState } from "react";
import { LuSyringe } from "react-icons/lu";

import { Button } from "@/components/ui/button";
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
import { usePatients } from "@/features/services/patients/hooks/use-patients";
import type { PatientTabProps } from "@/features/services/patients/types/tabs.types";
import { AdministerVaccinationSheet } from "@/features/services/vaccinations/components/administer-vaccination-sheet";
import { VaccinationRecordsTable } from "@/features/services/vaccinations/components/vaccination-records-table";
import { VaccinationStatusBadge } from "@/features/services/vaccinations/components/vaccination-status-badge";
import {
	usePatientVaccinationStatus,
	useVaccinationRecords,
} from "@/features/services/vaccinations/hooks/use-vaccinations";
import { printVaccinationCertificate } from "@/features/services/vaccinations/utils/print-vaccination-certificate";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";
import { DUE_STATUS_LABELS } from "@sanad/contracts/runtime/server/vaccinations/vaccinations.type";

const dateFmt = new Intl.DateTimeFormat("ar", { dateStyle: "medium" });

export function VaccinationsTab({ patientId }: PatientTabProps) {
	const [administerOpen, setAdministerOpen] = useState(false);
	const { status, isLoading } = usePatientVaccinationStatus(patientId || undefined);
	const { records, isLoading: recordsLoading } = useVaccinationRecords(
		patientId ? { patientId, includeVoided: true } : {},
	);
	const { clinicInfo } = useClinicInfo();
	const { patients } = usePatients();
	const patient = patients.find((p) => p.id === patientId);

	if (!patientId || isLoading) {
		return (
			<TabsContent value="vaccinations">
				<div className="space-y-2 p-4">
					<Skeleton className="h-8 w-full" />
					<Skeleton className="h-32 w-full" />
				</div>
			</TabsContent>
		);
	}

	const liveRecords = records.filter((r) => !r.isVoided);

	return (
		<TabsContent
			value="vaccinations"
			className="p-4"
		>
			<div className="flex items-center justify-between gap-2 pb-3">
				<div className="flex items-center gap-2">
					<VaccinationStatusBadge status={status?.status ?? null} />
					{status?.nextDueAt && (
						<span className="text-xs text-muted-foreground">
							الجرعة القادمة {dateFmt.format(new Date(status.nextDueAt))}
						</span>
					)}
					{status?.protocol && (
						<span className="text-xs text-muted-foreground">
							— بحسب «{status.protocol.name}»
						</span>
					)}
				</div>

				<div className="flex items-center gap-2">
					<Button
						size="sm"
						variant="outline"
						// الشهادة تحتاج جرعة واحدة على الأقل — مستند فارغ لا يُثبت شيئًا
						disabled={liveRecords.length === 0}
						onClick={() =>
							printVaccinationCertificate({
								clinic: {
									name: clinicInfo?.name ?? "الأكاديمية",
									logo: clinicInfo?.logo,
									licenseNumber: clinicInfo?.licenseNumber,
									phone: clinicInfo?.phone,
									address: clinicInfo?.address,
									city: clinicInfo?.city,
								},
								patient: {
									name: patient?.name ?? "",
									code: patient?.code ?? "",
									birthDate: status?.birthDate,
									animalTypeName: patient?.animalType?.arName,
									animalStrainName: patient?.animalStrain?.arName,
									ownerName: patient?.owner?.name,
									ownerPhone: patient?.owner?.phone,
								},
								records: liveRecords,
								nextDueAt: status?.nextDueAt,
							})
						}
					>
						<IconPrinter className="size-4" />
						شهادة تطعيم
					</Button>

					<Button
						size="sm"
						onClick={() => setAdministerOpen(true)}
					>
						<LuSyringe className="size-4" />
						تسجيل جرعة
					</Button>
				</div>
			</div>

			{!status?.protocol ? (
				<p className="rounded-[4px] border p-4 text-sm text-muted-foreground">
					لا بروتوكول تطعيم منطبق على نوع هذا الطفل — لا يمكن اشتقاق الجرعات المستحقة.
				</p>
			) : (
				<div className="rounded-[4px] border">
					<header className="border-b px-4 py-2">
						<h3 className="text-sm font-semibold">حالة الحماية لكل مرض</h3>
					</header>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>المرض</TableHead>
								<TableHead>الجرعات المعطاة</TableHead>
								<TableHead>الجرعة القادمة</TableHead>
								<TableHead>تاريخ الاستحقاق</TableHead>
								<TableHead>الحالة</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{status.projections.map((projection) => (
								<TableRow key={projection.antigenCode}>
									<TableCell>{projection.antigenCode}</TableCell>
									<TableCell className="tabular-nums">
										{projection.dosesGiven}
										{projection.lastGivenAt && (
											<span className="ms-2 text-xs text-muted-foreground">
												آخرها {dateFmt.format(new Date(projection.lastGivenAt))}
											</span>
										)}
									</TableCell>
									<TableCell>{projection.dose?.label ?? "مكتمل"}</TableCell>
									<TableCell className="whitespace-nowrap">
										{projection.dueAt
											? dateFmt.format(new Date(projection.dueAt))
											: projection.status === "UNKNOWN_AGE"
												? "يحتاج تاريخ ميلاد"
												: "—"}
									</TableCell>
									<TableCell>
										<VaccinationStatusBadge status={projection.status} />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}

			{status && !status.birthDate && (
				<p className="mt-3 rounded-[4px] bg-muted px-3 py-2 text-xs text-muted-foreground">
					تاريخ الميلاد غير مسجَّل، لذلك تظهر الجرعات التي لم تُعطَ بعد بحالة «
					{DUE_STATUS_LABELS.UNKNOWN_AGE}». أضِف تاريخ الميلاد من تبويب «نظرة عامة» لتُجدوَل
					تلقائيًا.
				</p>
			)}

			<div className="mt-4 rounded-[4px] border">
				<header className="border-b px-4 py-2">
					<h3 className="text-sm font-semibold">سجلّ الجرعات</h3>
				</header>
				<VaccinationRecordsTable
					records={records}
					isLoading={recordsLoading}
					showPatient={false}
					showToolbar={false}
				/>
			</div>

			<AdministerVaccinationSheet
				open={administerOpen}
				onOpenChange={setAdministerOpen}
				patientId={patientId}
			/>
		</TabsContent>
	);
}
