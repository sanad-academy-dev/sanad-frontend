export type PublicContractStatus =
	| "NOT_SENT"
	| "AWAITING_UPLOAD"
	| "PENDING_REVIEW"
	| "REJECTED_REUPLOAD"
	| "APPROVED"
	| "EXPIRED"
	| "CANCELLED";

export interface PublicContractSnapshot {
	agreementCode: string;
	issuedAt: string;
	representativeName: string;
	showStamp: boolean;
	programStartDate: string | null;
	programEndDate: string | null;
	includeMedicalDeclaration: boolean;
	additionalTerms: string | null;
	academy: {
		name: string;
		logoUrl: string | null;
		phone: string | null;
		email: string | null;
		address: string | null;
	};
	guardian: {
		name: string;
		nationalId: string | null;
		phone: string;
		email: string | null;
	};
	student: {
		requestCode: string;
		convertedPatientCode: string | null;
		name: string;
		gender: string;
		birthDate: string | null;
		ageLabel: string | null;
		targetClass: string | null;
		proposedTrack: string | null;
		learningMode: string | null;
		preferredShift: string | null;
		experienceLevel: string | null;
		medical: {
			bloodType: string | null;
			allergies: string | null;
			allergiesList: string[];
			hasChronicDiseases: boolean;
			chronicDiseases: string | null;
			medications: string[];
		} | null;
	};
	payment: {
		planId: string | null;
		planName: string | null;
		includeMeals: boolean;
		enableDailyStipend: boolean;
		amount: number | null;
		currency: string;
		currencyCode: string;
		paidAt: string | null;
		paymentMethodType: string | null;
		paymentMethodLabel: string;
		paymentReference: string | null;
		paymentGateway: string | null;
	};
}

export interface PublicContractViewData {
	code: string;
	agreementCode: string;
	contractStatus: PublicContractStatus;
	rawContractStatus: string;
	contractToken: string;
	expiresAt: string | null;
	isExpired: boolean;
	issuedAt: string | null;
	uploadedAt: string | null;
	reviewedAt: string | null;
	reviewNotes: string | null;
	signedFileUrl: string | null;
	signedFileName: string | null;
	signedFileSize: string | null;
	contract: PublicContractSnapshot;
	clinic: {
		id: string;
		name: string;
		logoUrl: string | null;
		phone: string | null;
		email: string | null;
		address: string | null;
	};
}
