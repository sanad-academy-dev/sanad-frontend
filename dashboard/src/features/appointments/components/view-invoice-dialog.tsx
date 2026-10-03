import { PaymentSuccessModal } from "@/features/appointments/components/invoice/payment-success-modal";
import { useAppointment } from "@/features/appointments/hooks/use-appointment";
import { useAppointmentProducts } from "@/features/appointments/hooks/use-appointment-products";
import { useAppointmentServices } from "@/features/appointments/hooks/use-appointment-services";
import { useInvoice } from "@/features/appointments/hooks/use-invoice";
import { useViewInvoiceStore } from "@/features/appointments/stores/view-invoice.store";

// يستضيف نافذة عرض "الفاتورة المدفوعة" على مستوى الكانبان — خارج بطاقة الزيارة —
// فلا تصل نقرات النافذة إلى البطاقة ولا تفتح لوحة الزيارة.
export function ViewInvoiceDialog() {
	const appointmentId = useViewInvoiceStore((s) => s.viewInvoiceAppointmentId);
	const closeInvoice = useViewInvoiceStore((s) => s.closeInvoice);

	if (!appointmentId) return null;
	return (
		<ViewInvoiceInner
			key={appointmentId}
			appointmentId={appointmentId}
			onClose={closeInvoice}
		/>
	);
}

function ViewInvoiceInner({
	appointmentId,
	onClose,
}: {
	appointmentId: string;
	onClose: () => void;
}) {
	const { appointment } = useAppointment(appointmentId);
	const { services } = useAppointmentServices(appointmentId);
	const { products } = useAppointmentProducts(appointmentId);
	const { invoice } = useInvoice(appointmentId);

	if (!appointment || !invoice) return null;

	return (
		<PaymentSuccessModal
			open
			onClose={onClose}
			invoice={invoice}
			services={services}
			products={products}
			appointment={appointment}
			ownerName={appointment.owner.name}
			patientName={appointment.patient.name}
		/>
	);
}
