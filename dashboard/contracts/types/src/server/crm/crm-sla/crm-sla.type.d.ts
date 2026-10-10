import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
export declare const crmSlaPolicySchema: z.ZodObject<{
    name: z.ZodString;
    appliesTo: z.ZodEnum<{
        readonly LEAD: "LEAD";
        readonly DEAL: "DEAL";
        readonly BOTH: "BOTH";
    }>;
    firstResponseMinutes: z.ZodCoercedNumber<unknown>;
    order: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    sources: z.ZodOptional<z.ZodArray<z.ZodObject<{
        sourceId: z.ZodString;
        firstResponseMinutes: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type CrmSlaPolicyFormInput = z.infer<typeof crmSlaPolicySchema>;
export declare const crmSavedViewSchema: z.ZodObject<{
    entity: z.ZodEnum<{
        readonly LEAD: "LEAD";
        readonly DEAL: "DEAL";
    }>;
    name: z.ZodString;
    filters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    sort: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        field: z.ZodString;
        direction: z.ZodEnum<{
            asc: "asc";
            desc: "desc";
        }>;
    }, z.core.$strip>>>;
    visibleColumns: z.ZodOptional<z.ZodArray<z.ZodString>>;
    layout: z.ZodOptional<z.ZodEnum<{
        readonly LIST: "LIST";
        readonly KANBAN: "KANBAN";
    }>>;
    isPinned: z.ZodOptional<z.ZodBoolean>;
    isPublic: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type CrmSavedViewFormInput = z.infer<typeof crmSavedViewSchema>;
export declare const slaPolicySelect: {
    readonly id: true;
    readonly name: true;
    readonly appliesTo: true;
    readonly firstResponseMinutes: true;
    readonly order: true;
    readonly isActive: true;
    readonly createdAt: true;
    readonly sources: {
        readonly select: {
            readonly id: true;
            readonly sourceId: true;
            readonly firstResponseMinutes: true;
            readonly source: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
    };
};
export type CrmSlaPolicyResponse = Prisma.CrmSlaPolicyGetPayload<{
    select: typeof slaPolicySelect;
}>;
export declare const savedViewSelect: {
    readonly id: true;
    readonly userId: true;
    readonly entity: true;
    readonly name: true;
    readonly filters: true;
    readonly sort: true;
    readonly visibleColumns: true;
    readonly layout: true;
    readonly isPinned: true;
    readonly isPublic: true;
    readonly createdAt: true;
    readonly user: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export type CrmSavedViewResponse = Prisma.CrmSavedViewGetPayload<{
    select: typeof savedViewSelect;
}>;
