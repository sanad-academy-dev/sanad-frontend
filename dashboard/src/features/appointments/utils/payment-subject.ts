import type {
	PaymentLine,
	PaymentSubject,
} from "@/features/appointments/components/invoice/payment-modal";
import type {
	AppointmentProductResponse,
	AppointmentResponse,
	AppointmentServiceResponse,
} from "@/server/appointments/appointments.type";
import { billableProductQty } from "@sanad/contracts/runtime/server/invoices/invoice-sections";

const money = (value: unknown) =>
	Number(value ?? 0).toLocaleString("en-US", { maximumFractionDigits: 2 });

/**
 * بنود فاتورة الزيارة بشكل نافذة الدفع المحايد. مبنيّة مرّة واحدة هنا لأن ثلاث
 * شاشات تفتح النافذة نفسها (تبويب الفاتورة، الدفع من الكانبان، صفحة المالية).
 */
export const appointmentPaymentSubject = ({
	appointment,
	services,
	products = [],
}: {
	appointment: AppointmentResponse;
	services: AppointmentServiceResponse[];
	products?: AppointmentProductResponse[];
}): PaymentSubject => {
	const consultationFee = Number(appointment.consultationFeeSnapshot ?? 0);

	const lines: PaymentLine[] = [
		...(consultationFee > 0
			? [
					{
						id: "consultation",
						name: appointment.consultationType?.name ?? "كشف",
						badge: "كشف",
						amountLabel: `${money(consultationFee)} ر.س`,
					},
				]
			: []),
		...services.map((row) => ({
			id: row.id,
			name: row.service.name,
			badge: "دورة",
			amountLabel: `${money(Number(row.priceSnapshot) * row.quantity)} ر.س`,
		})),
		...products.map((row) => ({
			id: row.id,
			name: row.nameSnapshot,
			badge: "صنف",
			// الصنف المجاني بالكامل يظهر بلا مبلغ بدل صفر يوهم بخطأ سعر
			amountLabel:
				billableProductQty(row) === 0
					? "مجاني"
					: `${money(Number(row.priceSnapshot) * billableProductQty(row))} ر.س`,
		})),
	];

	return {
		heading: "طلب دفع فاتورة زيارة",
		ownerName: appointment.owner.name,
		// [MI-P2] شارة العضوية على نافذة الدفع تحتاج هوية وليّ الأمر لا اسمه
		ownerId: appointment.owner.id,
		date: appointment.startsAt,
		lines,
	};
};
