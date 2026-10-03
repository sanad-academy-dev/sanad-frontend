import type { LeaveRequestStatus } from "@/generated/prisma/enums";
import { type AgentConversationDetail, type AgentConversationListItem, type AgentPatientResult, type AgentSettingsResponse, type AppendAgentMessageInput, type UpdateAgentSettingsInput } from "@/server/agent/agent.type";
import type { CreatePatientInput, UpdatePatientInput } from "@/server/patients/patients.type";
import { staffDao } from "@/server/staff/staff.dao";
import type { CreateStaffInput, UpdateStaffInput } from "@/server/staff/staff.type";
export declare const agentDao: {
    searchPatients(clinicId: string, query: string, enabledGuardrails?: string[]): Promise<AgentPatientResult[]>;
    searchOwners(clinicId: string, query: string, enabledGuardrails?: string[]): Promise<{
        name: string;
        id: string;
        phone: string;
        code: string;
    }[]>;
    listAnimalTypes(clinicId: string): Promise<{
        id: string;
        arName: string;
        enName: string;
    }[]>;
    searchStrains(clinicId: string, query: string, animalTypeId?: string): Promise<{
        id: string;
        arName: string;
        enName: string;
        animalTypeId: string;
    }[]>;
    createPatient(input: CreatePatientInput): Promise<{
        animalType: {
            id: string;
            arName: string;
            enName: string;
        };
        animalStrain: {
            id: string;
            arName: string;
            enName: string;
        } | null;
        owner: {
            name: string;
            id: string;
            email: string | null;
            phone: string;
            code: string;
        } | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        gender: import("@/generated/prisma/enums").Gender;
        age: number | null;
        notes: string | null;
        active: boolean;
        editsCount: number;
        birthDate: Date | null;
        weight: number | null;
    }>;
    updatePatient(id: string, clinicId: string, data: UpdatePatientInput): Promise<{
        animalType: {
            id: string;
            arName: string;
            enName: string;
        };
        animalStrain: {
            id: string;
            arName: string;
            enName: string;
        } | null;
        owner: {
            name: string;
            id: string;
            email: string | null;
            phone: string;
            code: string;
        } | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        gender: import("@/generated/prisma/enums").Gender;
        age: number | null;
        notes: string | null;
        active: boolean;
        editsCount: number;
        birthDate: Date | null;
        weight: number | null;
    } | null>;
    getPatientCard(id: string, clinicId: string): Promise<{
        animalType: {
            arName: string;
            enName: string;
        };
        animalStrain: {
            arName: string;
            enName: string;
        } | null;
        owner: {
            name: string;
            phone: string;
        } | null;
        name: string;
        code: string;
        gender: import("@/generated/prisma/enums").Gender;
        age: number | null;
        active: boolean;
        weight: number | null;
    } | null>;
    getSettings(clinicId: string): Promise<AgentSettingsResponse>;
    updateSettings(clinicId: string, data: UpdateAgentSettingsInput): Promise<AgentSettingsResponse>;
    listConversations(clinicId: string, userId: string): Promise<AgentConversationListItem[]>;
    getConversation(id: string, clinicId: string, userId: string): Promise<AgentConversationDetail | null>;
    createConversation(clinicId: string, userId: string, title: string): Promise<AgentConversationDetail>;
    appendMessage(conversationId: string, clinicId: string, userId: string, input: AppendAgentMessageInput): Promise<{
        id: string;
    } | null>;
    deleteConversation(id: string, clinicId: string, userId: string): Promise<boolean>;
    getCurrentUser(clinicId: string, userId: string, enabledGuardrails?: string[]): Promise<{
        name: string | null;
        email: string | null;
        phone: string | null;
        role: string;
        isAdmin: boolean;
        clinicName: string | null;
        staffCode: string | null;
        jobRole: string | null;
        branch: string | null;
        specialization: string | null;
    }>;
    createOwner(input: {
        clinicId: string;
        name: string;
        phone: string;
        email: string;
        gender?: string | null;
        city?: string | null;
        address?: string | null;
        notes?: string | null;
    }): Promise<{
        name: string;
        address: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        phone: string;
        city: string | null;
        code: string;
        patients: {
            animalType: {
                arName: string;
                enName: string;
            };
            id: string;
        }[];
        gender: import("@/generated/prisma/enums").Gender | null;
        country: string | null;
        notes: string | null;
        active: boolean;
        editsCount: number;
        ownerType: import("@/generated/prisma/enums").OwnerType;
        relationship: import("@/generated/prisma/enums").OwnerRelationship | null;
    }>;
    resolveBranchId(clinicId: string, userId: string): Promise<string | null>;
    getPatientOwnerId(clinicId: string, patientId: string): Promise<string | null>;
    weeklySnapshot(clinicId: string): Promise<{
        rangeDays: number;
        visitsByStatus: {
            status: import("@/generated/prisma/enums").AppointmentStatus;
            count: number;
        }[];
        newPatients: number;
        newOwners: number;
        tasksCreated: number;
        tasksCompleted: number;
        pendingLeaveRequests: number;
    }>;
    listVisitsByDate(clinicId: string, date: string, staffId?: string): Promise<{
        staff: {
            name: string;
        };
        owner: {
            name: string;
        };
        patient: {
            name: string;
        };
        id: string;
        code: string;
        services: {
            service: {
                name: string;
            };
        }[];
        status: import("@/generated/prisma/enums").AppointmentStatus;
        startsAt: Date;
        durationMinutes: number;
        isEmergency: boolean;
    }[] | null>;
    resolveAppointmentId(clinicId: string, ref: string): Promise<string | null>;
    resolveTaskId(clinicId: string, ref: string): Promise<{
        id: string;
    } | {
        error: string;
    }>;
    getMyStaffId(clinicId: string, userId: string): Promise<string>;
    listClinicMembers(clinicId: string): Promise<{
        userId: string;
        name: string;
        role: import("@/generated/prisma/enums").Role;
    }[]>;
    isClinicAdmin(clinicId: string, userId: string): Promise<boolean>;
    listStaffRoles(clinicId: string): Promise<{
        name: string;
        id: string;
    }[]>;
    listBranches(clinicId: string): Promise<{
        type: import("@/generated/prisma/enums").BranchType;
        name: string;
        id: string;
    }[]>;
    listSpecializations(clinicId: string): Promise<{
        id: string;
        name: string;
        category: string;
    }[]>;
    listStaff(clinicId: string, enabledGuardrails?: string[]): Promise<{
        branch: {
            name: string;
        };
        name: string;
        id: string;
        email: string;
        phone: string | null;
        code: string;
        status: import("@/generated/prisma/enums").StaffStatus;
        role: {
            name: string;
        };
    }[]>;
    searchStaff(clinicId: string, query: string, enabledGuardrails?: string[]): Promise<{
        branch: {
            name: string;
        };
        name: string;
        id: string;
        email: string;
        phone: string | null;
        code: string;
        status: import("@/generated/prisma/enums").StaffStatus;
        role: {
            name: string;
        };
    }[]>;
    createStaffWithInvite(rawInput: CreateStaffInput, invitedById: string): Promise<{
        ok: true;
        staff: Awaited<ReturnType<typeof staffDao.create>>;
        inviteLink: string;
    } | {
        ok: false;
        error: string;
    }>;
    updateStaff(staffId: string, clinicId: string, rawData: UpdateStaffInput): Promise<{
        ok: true;
        staff: NonNullable<Awaited<ReturnType<typeof staffDao.update>>>;
    } | {
        ok: false;
        error: string;
    }>;
    listLeaveRequests(clinicId: string, statusFilter?: LeaveRequestStatus): Promise<{
        type: string;
        staff: {
            name: string;
        };
        id: string;
        code: string;
        status: LeaveRequestStatus;
        days: number;
        startDate: Date;
        endDate: Date;
    }[]>;
    decideLeaveRequest(leaveRequestId: string, clinicId: string, decision: "approve" | "reject", userId: string): Promise<{
        type: string;
        staff: {
            name: string;
            id: string;
            email: string;
            code: string;
            role: {
                name: string;
            };
        };
        attachments: {
            name: string | null;
            url: string;
            id: string;
            createdAt: Date;
            kind: string;
        }[];
        id: string;
        createdAt: Date;
        code: string;
        notes: string | null;
        status: LeaveRequestStatus;
        days: number;
        startDate: Date;
        endDate: Date;
        substitute: {
            name: string;
            id: string;
        } | null;
        approvals: {
            at: Date | null;
            id: string;
            title: string;
            order: number;
            status: string;
            actorName: string | null;
        }[];
    } | null>;
    ensureStaffInvite(staffId: string, clinicId: string, invitedById: string): Promise<{
        kind: "not-found";
        invite?: undefined;
    } | {
        kind: "already-active";
        invite?: undefined;
    } | {
        kind: "ok";
        link: string;
    }>;
};
