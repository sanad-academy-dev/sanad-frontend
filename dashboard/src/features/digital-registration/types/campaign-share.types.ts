export type ShareAccessLevel = "full" | "can_edit" | "can_view";

export interface ShareAccessMember {
	id: string;
	name: string;
	email: string;
	image?: string | null;
	title?: string;
	accessLevel: ShareAccessLevel;
	isCurrent?: boolean;
	isPending?: boolean;
}

export interface ShareGeneralAccess {
	level: "everyone_view" | "everyone_edit" | "restricted";
	label: string;
	description: string;
}

export interface ShareAccessResponse {
	clinicName: string;
	currentUser: ShareAccessMember;
	canManage?: boolean;
	members: ShareAccessMember[];
	generalAccess: ShareGeneralAccess;
}

export interface StaffCandidate {
	id: string;
	name: string;
	email: string;
	image?: string | null;
	title?: string;
}
