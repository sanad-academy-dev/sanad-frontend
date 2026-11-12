import type { AppointmentColumnId } from "@/features/appointments/types/appointment.types";

export type RegistrationContractStatus =
	| "NOT_SENT"
	| "AWAITING_UPLOAD"
	| "PENDING_REVIEW"
	| "REJECTED_REUPLOAD"
	| "APPROVED";

export interface RegistrationContractSnapshot {
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
		phone?: string | null;
		email?: string | null;
		address?: string | null;
		logoUrl?: string | null;
	};
	guardian: {
		name: string;
		phone: string;
		email?: string | null;
		nationalId?: string | null;
	};
	student: {
		requestCode: string;
		convertedPatientCode?: string | null;
		name: string;
		gender: string;
		birthDate?: string | null;
		ageLabel?: string | null;
		targetClass?: string | null;
		proposedTrack?: string | null;
		learningMode?: string | null;
		preferredShift?: string | null;
		experienceLevel?: string | null;
		medical?: {
			bloodType?: string | null;
			allergies?: string | null;
			allergiesList?: string[];
			hasChronicDiseases?: boolean;
			chronicDiseases?: string | null;
			medications?: string[];
		} | null;
	};
	payment: {
		planId?: string | null;
		planName?: string | null;
		includeMeals: boolean;
		enableDailyStipend: boolean;
		amount: number | null;
		currency: string;
		currencyCode?: string | null;
		paidAt?: string | null;
		paymentMethodType?: string | null;
		paymentMethodLabel?: string;
		paymentReference?: string | null;
		paymentGateway?: string | null;
	};
}

export interface RegistrationDocumentItem {
	id: string;
	title: string;
	fileUrl: string;
	/** Stable storage value; fileUrl may be a short-lived protected display route. */
	storageKey?: string;
	fileSize?: string | null;
	type:
		| "BIRTH_CERTIFICATE"
		| "VACCINATION_CARD"
		| "GUARDIAN_ID"
		| "MEDICAL_REPORT"
		| "SERVICE_AGREEMENT"
		| "OTHER";
	uploadedAt?: string;
}

export interface RegistrationCommentItem {
	id: string;
	authorId?: string;
	authorName: string;
	body: string;
	createdAt: string;
}

export interface RegistrationTimelineItem {
	id: string;
	title: string;
	actorName: string;
	statusBadge?: string | null;
	isCompleted: boolean;
	completedAt?: string | null;
	order: number;
}

export interface AssessmentQuestionAnswer {
	id: string;
	category: string;
	question: string;
	answer: string;
	score?: number;
}

export interface AssessmentDataPayload {
	submittedAt: string;
	proposedTrack?: string | null;
	overallScore?: number;
	attendanceProbability?: number;
	answers: AssessmentQuestionAnswer[];
	guardianGoals?: string[];
	preferredShift?: string | null;
	rawNotes?: string | null;
}

export interface CampaignRequestItem {
	id: string;
	code: string;
	name: string;
	column: string;
	status:
		| "QUEUE"
		| "SHORTLIST"
		| "INTERVIEW"
		| "ACCEPTED"
		| "AWAITING_PAYMENT"
		| "REJECTED"
		| "DUPLICATE"
		| "IN_EVALUATION"
		| "WAITLIST"
		| "EVALUATION"
		| "REVIEW"
		| "AWAITING_REPLY";
	statusLabel: string;
	statusVariant: "warning" | "info" | "default" | "destructive";
	patientName: string;
	patientDetails: string;
	gender: "MALE" | "FEMALE" | "UNKNOWN";
	birthDate?: string | null;
	ageLabel?: string | null;
	targetClass?: string | null;
	bloodType?: string | null;
	allergies?: string | null;
	hasChronicDiseases?: boolean;
	chronicDiseases?: string | null;
	guardianName: string;
	guardianPhone: string;
	guardianEmail?: string | null;
	guardianNationalId?: string | null;
	source?: "WEBSITE" | "DIRECT_LINK" | "REFERRAL" | "SOCIAL" | "OTHER";
	interviewMode?: "IN_CLINIC" | "REMOTE";
	channel?: "CALL" | "ACADEMY";
	meetingUrl?: string | null;
	tags: { label: string; variant: "warning" | "destructive" | "default" }[];
	date: string;
	submittedAt?: string | null;
	documents: {
		count: number;
		total: number;
		status: string;
		items?: RegistrationDocumentItem[];
	};
	comments?: RegistrationCommentItem[];
	timeline?: RegistrationTimelineItem[];
	convertedPatientId?: string | null;
	convertedPatientCode?: string | null;
	convertedOwnerId?: string | null;
	convertedOwnerCode?: string | null;
	learningMode?: string | null;
	preferredShift?: string | null;
	experienceLevel?: string | null;
	priority?: string | null;
	appointmentDate?: string | null;
	appointmentId?: string | null;
	roomId?: string | null;
	roomName?: string | null;
	notes?: string | null;
	notifyWhatsapp?: boolean;
	links?: { id?: string; title?: string; url: string }[];
	assessmentData?: AssessmentDataPayload | null;
	assessmentAppointment?: {
		id: string;
		staffId: string;
		code: string;
		startsAt: string;
		status: string;
		durationMinutes: number;
		staffName?: string | null;
	} | null;
	proposedTrack?: string | null;
	interviewDurationMinutes?: number;
	attendanceProbability?: number;
	subscriptionPlanId?: string | null;
	subscriptionPlanName?: string | null;
	subscriptionAmount?: number | null;
	includeMeals?: boolean;
	enableDailyStipend?: boolean;
	paymentToken?: string | null;
	paymentTokenExpiresAt?: string | null;
	paidAt?: string | null;
	paymentReference?: string | null;
	paymentGateway?: string | null;
	paymentReceiptUrl?: string | null;
	paymentMethodType?: string | null;
	paymentNotes?: string | null;
	contractStatus?: RegistrationContractStatus | null;
	contractToken?: string | null;
	contractTokenExpiresAt?: string | null;
	contractData?: RegistrationContractSnapshot | null;
	contractIssuedAt?: string | null;
	contractSignedFileUrl?: string | null;
	contractSignedFileName?: string | null;
	contractSignedFileSize?: string | null;
	contractSignedMimeType?: string | null;
	contractUploadedAt?: string | null;
	contractReviewedAt?: string | null;
	contractReviewedBy?: string | null;
	contractReviewNotes?: string | null;
	medications?: Array<{ id?: string; name: string; dose?: string; timing?: string } | string>;
	allergiesList?: string[];
	assignedStaffId?: string | null;
	assignedStaff?: { id: string; name: string; image?: string | null } | null;
	reviewerId?: string | null;
	reviewerName?: string | null;
	referredToStaffId?: string | null;
	referredToStaff?: { id: string; name: string; image?: string | null } | null;
	referralReason?: string | null;
	rejectionReason?: string | null;
	rejectionNotes?: string | null;
	deletionReason?: string | null;
	deletionNotes?: string | null;
	queueRank?: number;
	estimatedWait?: string;
}

export interface RequestNotificationItem {
	id: string;
	channel: "WHATSAPP" | "EMAIL" | "SMS" | "INBOX" | "PUSH";
	status: "QUEUED" | "SENDING" | "SENT" | "FAILED" | "SKIPPED" | "CANCELLED" | "AWAITING_MANUAL";
	toAddress: string | null;
	subject: string | null;
	body: string;
	manualLink?: string | null;
	sentAt?: string | null;
	createdAt: string;
	attempts: number;
	metadata?: any;
}

export interface RegistrationPaymentReceiptData {
	requestId: string;
	code: string;
	studentName: string;
	studentCode?: string | null;
	guardianName: string;
	planId?: string | null;
	planName: string;
	includeMeals: boolean;
	enableDailyStipend: boolean;
	paidAt: string;
	paymentReference: string;
	paymentGateway: string;
	paymentMethodType: string;
	amount: number;
	cashReceived: number;
	changeAmount: number;
	discountAmount: number;
	currency: string;
	collectedBy?: string | null;
	notes?: string | null;
	clinicName?: string | null;
}

