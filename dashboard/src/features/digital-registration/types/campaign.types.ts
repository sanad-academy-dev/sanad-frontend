export interface Campaign {
	id: string;
	name: string;
	code: string;
	ageGroup: string;
	targetClass?: string | null;
	requests: number;
	accepted: number;
	pending: number;
	rejected?: number;
	capacity: number;
	maxCapacity: number;
	status: "ACTIVE" | "COMPLETED" | "DRAFT" | "CLOSED";
	startDate?: string | null;
	endDate?: string | null;
	requireBirthCert?: boolean;
	requireVaccine?: boolean;
	requireId?: boolean;
	notes?: string | null;
	createdByName?: string;
	sourceStats?: Record<string, number>;
	createdAt?: string;
}

export interface CampaignSummaryStats {
	activeCampaigns: number;
	totalRequests: number;
	accepted: number;
	pending: number;
}
