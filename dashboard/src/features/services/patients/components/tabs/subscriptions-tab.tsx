import { TabsContent } from "@/components/ui/tabs";
import { CarePlanEnrollmentsPanel } from "@/features/finance/care-plans/components/care-plan-enrollments-panel";
import type { PatientTabProps } from "@/features/services/patients/types/tabs.types";

export function SubscriptionsTab({ patientId }: PatientTabProps) {
	return (
		<TabsContent
			value="subscriptions"
			className="m-0 p-3"
			dir="rtl"
		>
			<CarePlanEnrollmentsPanel patientId={patientId} />
		</TabsContent>
	);
}
