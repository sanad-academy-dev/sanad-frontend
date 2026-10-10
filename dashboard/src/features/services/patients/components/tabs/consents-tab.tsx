import { IconCircleCheckFilled, IconFileText, IconPlus } from "@tabler/icons-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
import { ConsentSheet } from "@/features/services/consents/components/consent-sheet";
import {
	useConsentTemplates,
	usePatientConsentMutations,
	usePatientConsents,
} from "@/features/services/consents/hooks/use-patient-consents";
import type { PatientTabProps } from "@/features/services/patients/types/tabs.types";
import { ConsentStatus } from "@/generated/prisma/enums";
import { CONSENT_STATUS_LABELS } from "@sanad/contracts/runtime/server/patient-consents/patient-consents.type";

const dateFmt = new Intl.DateTimeFormat("ar", { dateStyle: "medium" });

const STATUS_STYLES: Record<ConsentStatus, string> = {
	[ConsentStatus.DRAFT]: "",
	[ConsentStatus.AWAITING_SIGNATURE]: "",
	[ConsentStatus.SIGNED]: "border-emerald-200 bg-emerald-50 text-emerald-700",
	[ConsentStatus.REVOKED]: "border-red-200 bg-red-50 text-red-700",
};

export function ConsentsTab({ patientId }: PatientTabProps) {
	const { consents, isLoading } = usePatientConsents(patientId || undefined);
	const { templates } = useConsentTemplates();
	const mutations = usePatientConsentMutations(patientId);

	const [templateKey, setTemplateKey] = useState("");
	const [openConsentId, setOpenConsentId] = useState<string | null>(null);

	if (!patientId || isLoading) {
		return (
			<TabsContent
				value="consents"
				dir="rtl"
			>
				<div className="space-y-2 p-4">
					<Skeleton className="h-8 w-full" />
					<Skeleton className="h-32 w-full" />
				</div>
			</TabsContent>
		);
	}

	return (
		<TabsContent
			value="consents"
			className="p-4"
			dir="rtl"
		>
			<div className="flex items-center justify-between gap-2 pb-3">
				<span className="text-xs text-muted-foreground">
					النماذج تُعبّأ آليًا من ملف الطفل ووليّ الأمر — راجعها قبل التوقيع
				</span>
				<div className="flex items-center gap-1.5">
					<Select
						value={templateKey}
						onValueChange={setTemplateKey}
					>
						<SelectTrigger
							size="sm"
							dir="rtl"
							className="h-7 w-56 text-xs"
						>
							<SelectValue placeholder="اختر النموذج" />
						</SelectTrigger>
						<SelectContent
							position="popper"
							dir="rtl"
						>
							{templates.map((t) => (
								<SelectItem
									key={t.key}
									value={t.key}
								>
									{t.titleAr}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button
						size="sm"
						variant="outline"
						className="h-7"
						disabled={!templateKey || mutations.isPending}
						onClick={() =>
							void mutations
								.createConsent({ templateKey })
								.then((consent) => {
									setTemplateKey("");
									setOpenConsentId(consent.id);
								})
								.catch(() => {})
						}
					>
						<IconPlus className="size-3.5" />
						إنشاء
					</Button>
				</div>
			</div>

			{consents.length === 0 ? (
				<div className="flex flex-col items-center gap-2 rounded-md border bg-muted/30 p-8 text-center">
					<IconFileText className="size-6 text-muted-foreground" />
					<p className="text-xs text-muted-foreground">
						لا موافقات بعد — اختر نموذجًا أعلاه ليُجهَّز معبّأً بالبيانات المسجّلة
					</p>
				</div>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>النموذج</TableHead>
							<TableHead>الحالة</TableHead>
							<TableHead>الموقِّع</TableHead>
							<TableHead>التاريخ</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{consents.map((consent) => (
							<TableRow
								key={consent.id}
								className="cursor-pointer"
								onClick={() => setOpenConsentId(consent.id)}
							>
								<TableCell className="text-xs font-medium">
									{templates.find((t) => t.key === consent.templateKey)?.titleAr ??
										consent.templateKey}
								</TableCell>
								<TableCell>
									<Badge
										variant="outline"
										className={`gap-1 text-[10px] ${STATUS_STYLES[consent.status]}`}
									>
										{consent.status === ConsentStatus.SIGNED && (
											<IconCircleCheckFilled className="size-3" />
										)}
										{CONSENT_STATUS_LABELS[consent.status]}
									</Badge>
								</TableCell>
								<TableCell className="text-xs text-muted-foreground">
									{consent.signerName ?? "—"}
								</TableCell>
								<TableCell className="text-xs text-muted-foreground">
									{dateFmt.format(new Date(consent.signedAt ?? consent.createdAt))}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}

			<ConsentSheet
				consentId={openConsentId}
				patientId={patientId}
				open={!!openConsentId}
				onOpenChange={(open) => !open && setOpenConsentId(null)}
			/>
		</TabsContent>
	);
}
