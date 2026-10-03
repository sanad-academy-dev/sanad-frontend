import { create } from "zustand";

interface PayAppointmentStore {
	// معرّف الموعد المطلوب دفع فاتورته من بطاقة الكانبان (خارج لوحة الزيارة)
	payAppointmentId: string | null;
	openPay: (appointmentId: string) => void;
	closePay: () => void;
}

export const usePayAppointmentStore = create<PayAppointmentStore>()((set) => ({
	payAppointmentId: null,
	openPay: (appointmentId) => set({ payAppointmentId: appointmentId }),
	closePay: () => set({ payAppointmentId: null }),
}));
