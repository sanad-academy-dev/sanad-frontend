export interface Campaign {
	id: string;
	name: string;
	code: string;
	ageGroup: string;
	requests: number;
	accepted: number;
	pending: number;
	capacity: number;
	maxCapacity: number;
	status: "ACTIVE" | "COMPLETED" | "DRAFT" | "CLOSED";
	startDate: string;
}
