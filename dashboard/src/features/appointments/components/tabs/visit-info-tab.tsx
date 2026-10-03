import { TabsContent } from "@/components/ui/tabs";
import { ActivitySection } from "@/features/appointments/components/tabs/visit-info/activity-section";
import { DocumentsSection } from "@/features/appointments/components/tabs/visit-info/documents-section";
import { InternalNotesSection } from "@/features/appointments/components/tabs/visit-info/internal-notes-section";
import { VisitReasonSection } from "@/features/appointments/components/tabs/visit-info/visit-reason-section";
import { VisitSummarySection } from "@/features/appointments/components/tabs/visit-info/visit-summary-section";
import { useAppointment } from "@/features/appointments/hooks/use-appointment";

interface VisitInfoTabProps {
	appointmentId: string;
}

export function VisitInfoTab({ appointmentId }: VisitInfoTabProps) {
	const { appointment, isLoading } = useAppointment(appointmentId);

	// نص افتراضي لسبب الزيارة: أسماء الدورات أو نوع الكشف عند غياب سبب مكتوب
	const serviceLabel =
		appointment?.services.map((s) => s.service.name).join("، ") ||
		appointment?.consultationType?.name ||
		"";

	return (
		<TabsContent
			value="visit-info"
			className="flex flex-col gap-6 overflow-y-auto px-6 py-5"
			dir="rtl"
		>
			{isLoading || !appointment ? (
				<p className="text-muted-foreground text-sm">جاري التحميل...</p>
			) : (
				<>
					<VisitSummarySection appointment={appointment} />
					<VisitReasonSection
						reason={appointment.reason}
						serviceLabel={serviceLabel}
					/>
					<DocumentsSection appointmentId={appointment.id} />
					<InternalNotesSection appointmentId={appointment.id} />
					<ActivitySection appointmentId={appointment.id} />
				</>
			)}
		</TabsContent>
	);
}
