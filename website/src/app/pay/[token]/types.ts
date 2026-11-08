export interface PaymentViewData {
	id: string;
	code: string;
	studentName: string;
	guardianName: string;
	guardianPhoneMasked: string;
	targetClass: string | null;
	status: "AWAITING_PAYMENT" | "PAID" | "EXPIRED" | "CANCELLED";
	rawStatus: string;
	paymentToken: string;
	expiresAt: string | null;
	isExpired: boolean;
	paidAt: string | null;
	paymentReference: string | null;
	paymentGateway: string | null;
	paymentReceiptUrl: string | null;
	paymentMethodType: string | null;
	pricing: {
		planId: string | null;
		planName: string;
		baseAmount: number;
		includeMeals: boolean;
		mealsAmount: number;
		enableDailyStipend: boolean;
		stipendAmount: number;
		totalAmount: number;
		currency: string;
	};
	clinic: {
		id: string;
		name: string;
		logoUrl?: string | null;
		phone?: string | null;
		email?: string | null;
		address?: string | null;
		bankDetails: {
			bankName: string;
			accountHolder: string;
			iban: string;
			accountNumber: string;
			instaPayHandle: string;
		};
	};
}
