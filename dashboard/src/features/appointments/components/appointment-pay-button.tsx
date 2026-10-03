import { IconReceipt2 } from "@tabler/icons-react";
import type { MouseEvent } from "react";

import { Button } from "@/components/ui/button";
import { usePayAppointmentStore } from "@/features/appointments/stores/pay-appointment.store";

// زر "جاهز للدفع" على بطاقة الزيارة (عمود "بإنتظار الدفع").
// لا يعرض النافذة داخل البطاقة — بل يطلب فتحها على مستوى الكانبان عبر المتجر،
// حتى لا تصل أي نقرة إلى البطاقة وتفتح لوحة الزيارة بعد الدفع.
export function AppointmentPayButton({ appointmentId }: { appointmentId: string }) {
	const openPay = usePayAppointmentStore((s) => s.openPay);

	const handleClick = (e: MouseEvent) => {
		e.stopPropagation();
		openPay(appointmentId);
	};

	return (
		<Button
			size="sm"
			className="bg-blue-600 primaryhover:bg-blue-700"
			onClick={handleClick}
		>
			<IconReceipt2 />
			جاهز للدفع
		</Button>
	);
}
