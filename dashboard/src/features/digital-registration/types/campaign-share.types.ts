export type ShareAccessLevel = "full" | "can_edit" | "can_view";

export interface DigitalRegistrationCapabilities {
	canView: boolean;
	canEdit: boolean;
	canManageTeam: boolean;
	canCreateRequest: boolean;
	canChangeStatus: boolean;
	canSchedule: boolean;
	canComment: boolean;
	canRefer: boolean;
	canAcceptOrReject: boolean;
	canDeleteRequest: boolean;
	canExport: boolean;
	canDownloadDocuments: boolean;
}

export const SAFE_READONLY_CAPABILITIES: DigitalRegistrationCapabilities = {
	canView: false,
	canEdit: false,
	canManageTeam: false,
	canCreateRequest: false,
	canChangeStatus: false,
	canSchedule: false,
	canComment: false,
	canRefer: false,
	canAcceptOrReject: false,
	canDeleteRequest: false,
	canExport: false,
	canDownloadDocuments: false,
};

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
	level: "restricted";
	label: string;
	description: string;
}

export interface ShareAccessResponse {
	clinicName: string;
	currentUser: ShareAccessMember;
	capabilities?: DigitalRegistrationCapabilities;
	canManage?: boolean;
	members: ShareAccessMember[];
	generalAccess: ShareGeneralAccess;
}

export interface StaffCandidate {
	staffId: string;
	userId: string;
	id?: string;
	name: string;
	email: string;
	image?: string | null;
	title?: string;
}

export interface UpdateMemberAccessResult {
	success: boolean;
	accessLevel?: "can_edit" | "can_view";
	removedType?: "active_member" | "pending_invitation" | "legacy_pending_collaborator";
	inviteRevoked?: boolean;
	warning?: string;
}

export type ShareAccessAuditAction =
	| "member.added"
	| "member.access_changed"
	| "member.removed";

export interface ShareAccessAuditEntry {
	id: string;
	action: ShareAccessAuditAction;
	actorId?: string | null;
	actorName?: string | null;
	targetUserId?: string | null;
	targetStaffId?: string | null;
	targetName?: string | null;
	targetEmail?: string | null;
	before?: Record<string, unknown> | null;
	after?: Record<string, unknown> | null;
	createdAt: string;
}
