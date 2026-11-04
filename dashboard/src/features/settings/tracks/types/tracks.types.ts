export interface TrackClassificationItem {
	id: string;
	name: string;
	description: string;
	tracksCount: number;
	usageCount: number;
	isActive: boolean;
	createdAt?: string;
	isDefault?: boolean;
}

export interface TrackClassificationDraft {
	name: string;
	description: string;
}

