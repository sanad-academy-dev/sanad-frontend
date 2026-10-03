import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { LeaveRequestStatus } from "@/generated/prisma/enums";
export { LeaveRequestStatus };
export declare const leaveRequestSelect: {
    readonly id: true;
    readonly code: true;
    readonly type: true;
    readonly startDate: true;
    readonly endDate: true;
    readonly days: true;
    readonly notes: true;
    readonly status: true;
    readonly createdAt: true;
    readonly staff: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly code: true;
            readonly email: true;
            readonly role: {
                readonly select: {
                    readonly name: true;
                };
            };
        };
    };
    readonly substitute: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly attachments: {
        readonly select: {
            readonly id: true;
            readonly kind: true;
            readonly name: true;
            readonly url: true;
            readonly createdAt: true;
        };
    };
    readonly approvals: {
        readonly select: {
            readonly id: true;
            readonly order: true;
            readonly title: true;
            readonly status: true;
            readonly actorName: true;
            readonly at: true;
        };
    };
};
export type LeaveRequestResponse = Prisma.LeaveRequestGetPayload<{
    select: typeof leaveRequestSelect;
}>;
export declare const createLeaveRequestSchema: z.ZodObject<{
    staffId: z.ZodString;
    type: z.ZodString;
    startDate: z.ZodString;
    endDate: z.ZodString;
    days: z.ZodCoercedNumber<unknown>;
    notes: z.ZodOptional<z.ZodString>;
    substituteStaffId: z.ZodOptional<z.ZodString>;
    attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<{
            link: "link";
            document: "document";
        }>;
        name: z.ZodOptional<z.ZodString>;
        url: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type CreateLeaveRequestFormInput = z.infer<typeof createLeaveRequestSchema>;
export declare const sendLeaveEmailSchema: z.ZodObject<{
    recipients: z.ZodArray<z.ZodEmail>;
    subject: z.ZodString;
    message: z.ZodString;
}, z.core.$strip>;
export type SendLeaveEmailFormInput = z.infer<typeof sendLeaveEmailSchema>;
