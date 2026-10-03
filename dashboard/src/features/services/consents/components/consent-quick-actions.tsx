import { IconCircleCheckFilled, IconFilePlus } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ConsentSheet } from "@/features/services/consents/components/consent-sheet";
import {
	useConsentTemplates,
	usePatientConsentMutations,
	usePatientConsents,
} from "@/features/services/consents/hooks/use-patient-consents";
import { ConsentStatus } from "@/generated/prisma/enums";

// اختصار إنشاء الموافقة حيثما كانت ذات صلة (حالة عملية، موعد...). الموافقة
// تُنشأ على مستوى الطفل دائمًا وتُربط بالسياق، فلا تُحبس في وحدة بعينها.

export type ConsentQuickActionsProps = {
	patientId: string;
	/** القوالب المقترحة في هذا السياق، بالترتيب */
	templateKeys: string[];
	operationCaseId?: string | null;
	appointmentId?: string | null;
};

export const ConsentQuickActions = ({
	patientId,
	templateKeys,
	operationCaseId,
	appointmentId,
}: ConsentQuickActionsProps) => {
	const { templates } = useConsentTemplates();
	const { consents } = usePatientConsents(patientId || undefined);
	const mutations = usePatientConsentMutations(patientId);
	const [openConsentId, setOpenConsentId] = useState<string | null>(null);

	// الموقَّعة سارية لهذا القالب — لا يُعاد إنشاؤها، تُفتح
	const liveByKey = new Map(
		consents
			.filter((c) => c.status !== ConsentStatus.REVOKED)
			.map((c) => [c.templateKey, c] as const),
	);

	const suggested = templateKeys
		.map((key) => templates.find((t) => t.key === key))
		.filter((t): t is NonNullable<typeof t> => !!t);

	if (!patientId || !suggested.length) return null;

	return (
		<>
			<div className="flex flex-wrap items-center gap-1.5">
				{suggested.map((template) => {
					const existing = liveByKey.get(template.key);
					const signed = existing?.status === ConsentStatus.SIGNED;

					return (
						<Button
							key={template.key}
							size="sm"
							variant={signed ? "ghost" : "outline"}
							className="h-7 gap-1 text-xs"
							disabled={mutations.isPending}
							onClick={() => {
								// الموجودة تُفتح؛ وغير الموجودة تُنشأ مربوطةً بسياقها
								if (existing) {
									setOpenConsentId(existing.id);
									return;
								}
								void mutations
									.createConsent({
										templateKey: template.key,
										operationCaseId: operationCaseId ?? null,
										appointmentId: appointmentId ?? null,
									})
									.then((consent) => setOpenConsentId(consent.id))
									.catch(() => {});
							}}
						>
							{signed ? (
								<IconCircleCheckFilled className="size-3.5 text-emerald-600" />
							) : (
								<IconFilePlus className="size-3.5" />
							)}
							{template.titleAr}
						</Button>
					);
				})}
			</div>

			<ConsentSheet
				consentId={openConsentId}
				patientId={patientId}
				open={!!openConsentId}
				onOpenChange={(open) => !open && setOpenConsentId(null)}
			/>
		</>
	);
};
