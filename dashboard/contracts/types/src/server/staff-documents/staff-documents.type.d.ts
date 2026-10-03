import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { DocumentKind, StaffDocumentCategory } from "@/generated/prisma/enums";
export { DocumentKind, StaffDocumentCategory };
export declare const createStaffDocumentSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    category: z.ZodEnum<{
        readonly DOCUMENT: "DOCUMENT";
        readonly CERTIFICATE: "CERTIFICATE";
        readonly IMAGE: "IMAGE";
    }>;
    kind: z.ZodLiteral<"FILE">;
    title: z.ZodString;
    url: z.ZodString;
    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sizeBytes: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>, z.ZodObject<{
    category: z.ZodEnum<{
        readonly DOCUMENT: "DOCUMENT";
        readonly CERTIFICATE: "CERTIFICATE";
        readonly IMAGE: "IMAGE";
    }>;
    kind: z.ZodLiteral<"LINK">;
    title: z.ZodString;
    url: z.ZodURL;
}, z.core.$strip>], "kind">;
export type CreateStaffDocumentFormInput = z.infer<typeof createStaffDocumentSchema>;
export type CreateStaffDocumentInput = Pick<Prisma.StaffDocumentUncheckedCreateInput, "category" | "title" | "kind" | "url"> & Partial<Pick<Prisma.StaffDocumentUncheckedCreateInput, "mimeType" | "sizeBytes">>;
declare const staffDocumentSelect: {
    id: true;
    staffId: true;
    category: true;
    title: true;
    kind: true;
    url: true;
    mimeType: true;
    sizeBytes: true;
    createdAt: true;
    author: {
        select: {
            id: true;
            name: true;
        };
    };
};
export declare const staffDocumentSelectShape: {
    id: true;
    staffId: true;
    category: true;
    title: true;
    kind: true;
    url: true;
    mimeType: true;
    sizeBytes: true;
    createdAt: true;
    author: {
        select: {
            id: true;
            name: true;
        };
    };
};
export type StaffDocumentResponse = Prisma.StaffDocumentGetPayload<{
    select: typeof staffDocumentSelect;
}>;
