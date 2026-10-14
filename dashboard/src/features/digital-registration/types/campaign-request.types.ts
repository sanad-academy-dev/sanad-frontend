import type { AppointmentColumnId } from "@/features/appointments/types/appointment.types";

export interface RegistrationDocumentItem {
	id: string;
	title: string;
	fileUrl: string;
	fileSize?: string | null;
	type: "BIRTH_CERTIFICATE" | "VACCINATION_CARD" | "GUARDIAN_ID" | "MEDICAL_REPORT" | "OTHER";
	uploadedAt?: string;
}

export interface RegistrationCommentItem {
	id: string;
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

export interface CampaignRequestItem {
	id: string;
	code: string;
	name: string;
	column: AppointmentColumnId;
	status: "QUEUE" | "EVALUATION" | "REVIEW" | "AWAITING_REPLY" | "ACCEPTED" | "REJECTED";
	statusLabel: string;
	statusVariant: "warning" | "info" | "default";
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
	tags: { label: string; variant: "warning" | "destructive" | "default" }[];
	date: string;
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
	assessmentAppointment?: {
		id: string;
		code: string;
		startsAt: string;
		status: string;
		durationMinutes: number;
		staffName?: string | null;
	} | null;
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

