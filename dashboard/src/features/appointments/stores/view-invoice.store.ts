import { create } from "zustand";

interface ViewInvoiceStore {
	// معرّف الموعد المطلوب عرض فاتورته المدفوعة من بطاقة الكانبان (خارج لوحة الزيارة)
	viewInvoiceAppointmentId: string | null;
	openInvoice: (appointmentId: string) => void;
	closeInvoice: () => void;
}

export const useViewInvoiceStore = create<ViewInvoiceStore>()((set) => ({
	viewInvoiceAppointmentId: null,
	openInvoice: (appointmentId) => set({ viewInvoiceAppointmentId: appointmentId }),
	closeInvoice: () => set({ viewInvoiceAppointmentId: null }),
}));
