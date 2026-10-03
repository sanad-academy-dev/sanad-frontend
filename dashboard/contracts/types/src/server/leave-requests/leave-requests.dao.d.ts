type CreateLeaveRequestInput = {
    staffId: string;
    type: string;
    startDate: string;
    endDate: string;
    days: number;
    notes?: string | null;
    substituteStaffId?: string | null;
    attachments?: {
        kind: string;
        name?: string | null;
        url: string;
    }[];
};
type SendLeaveEmailInput = {
    recipients: string[];
    subject: string;
    message: string;
};
export declare const leaveRequestsDao: {
    list(clinicId: string): import("../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
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
        status: import("@/generated/prisma/enums").LeaveRequestStatus;
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
    }[]>;
    get(id: string, clinicId: string): import("../../../generated/prisma/models").Prisma__LeaveRequestClient<{
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
        status: import("@/generated/prisma/enums").LeaveRequestStatus;
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
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    create(clinicId: string, userId: string, input: CreateLeaveRequestInput, creatorName: string): Promise<{
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
        status: import("@/generated/prisma/enums").LeaveRequestStatus;
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
    }>;
    sendApprovalEmail(id: string, clinicId: string, input: SendLeaveEmailInput, actorName: string): Promise<{
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
        status: import("@/generated/prisma/enums").LeaveRequestStatus;
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
    approve(id: string, clinicId: string, actorName: string): Promise<{
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
        status: import("@/generated/prisma/enums").LeaveRequestStatus;
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
    reject(id: string, clinicId: string, actorName: string): Promise<{
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
        status: import("@/generated/prisma/enums").LeaveRequestStatus;
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
};
export {};
