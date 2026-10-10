import { useEffect, useRef, useState } from "react";

import { PaymentModal } from "@/features/appointments/components/invoice/payment-modal";
import { PaymentSuccessModal } from "@/features/appointments/components/invoice/payment-success-modal";
import { useAppointment } from "@/features/appointments/hooks/use-appointment";
import { useAppointmentProducts } from "@/features/appointments/hooks/use-appointment-products";
import { useAppointmentServices } from "@/features/appointments/hooks/use-appointment-services";
import { useInvoice } from "@/features/appointments/hooks/use-invoice";
import { usePayAppointmentStore } from "@/features/appointments/stores/pay-appointment.store";
import { appointmentPaymentSubject } from "@/features/appointments/utils/payment-subject";
import type { InvoiceResponse } from "@/server/invoices/invoices.type";

// يستضيف نافذة "طلب دفع فاتورة زيارة" على مستوى الكانبان — خارج بطاقة الزيارة —
// فلا تصل نقرات النافذة إلى البطاقة ولا تفتح لوحة الزيارة بعد الدفع.
export function AppointmentPayDialog() {
	const appointmentId = usePayAppointmentStore((s) => s.payAppointmentId);
	const closePay = usePayAppointmentStore((s) => s.closePay);

	if (!appointmentId) return null;
	return (
		<PayDialogInner
			key={appointmentId}
			appointmentId={appointmentId}
			onClose={closePay}
		/>
	);
}

function PayDialogInner({
	appointmentId,
	onClose,
}: {
	appointmentId: string;
	onClose: () => void;
}) {
	const { appointment } = useAppointment(appointmentId);
	const { services } = useAppointmentServices(appointmentId);
	const { products } = useAppointmentProducts(appointmentId);
	const { invoice, ensureInvoice, payInvoice, isPaying } = useInvoice(appointmentId);

	const [isPaymentOpen, setIsPaymentOpen] = useState(false);
	const [successInvoice, setSuccessInvoice] = useState<InvoiceResponse | null>(null);
	const ensuredRef = useRef(false);

	// عند فتح الدفع لموعد ما: أصدر/حدّث الفاتورة مرة واحدة ثم اعرض النافذة
	useEffect(() => {
		if (ensuredRef.current) return;
		ensuredRef.current = true;
		ensureInvoice()
			.then(() => setIsPaymentOpen(true))
			.catch(() => onClose()); // الخطأ يُبلَّغ عبر التوست داخل الخطّاف
	}, [ensureInvoice, onClose]);

	const handlePay = async (
		amountPaid: number,
		insurance?: { apply: boolean; excludedLineRefs: string[] },
	) => {
		try {
			const paid = await payInvoice("CASH", amountPaid, undefined, insurance);
			setIsPaymentOpen(false);
			if (paid.status === "PAID") {
				setSuccessInvoice(paid);
			} else {
				onClose();
			}
		} catch {
			// التوست يُدار داخل الخطّاف
		}
	};

	return (
		<>
			{appointment && invoice && isPaymentOpen && (
				<PaymentModal
					open={isPaymentOpen}
					onClose={onClose}
					invoice={invoice}
					subject={appointmentPaymentSubject({ appointment, services, products })}
					onPay={handlePay}
					isPaying={isPaying}
				/>
			)}

			{appointment && successInvoice && (
				<PaymentSuccessModal
					open={!!successInvoice}
					onClose={onClose}
					invoice={successInvoice}
					services={services}
					products={products}
					appointment={appointment}
					ownerName={appointment.owner.name}
					patientName={appointment.patient.name}
				/>
			)}
		</>
	);
}
