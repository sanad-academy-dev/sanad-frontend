import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
export declare const productCommentSelect: {
    readonly id: true;
    readonly body: true;
    readonly createdAt: true;
    readonly author: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly image: true;
        };
    };
};
export type ProductCommentResponse = Prisma.ProductCommentGetPayload<{
    select: typeof productCommentSelect;
}>;
export declare const createProductCommentSchema: z.ZodObject<{
    itemId: z.ZodString;
    body: z.ZodString;
}, z.core.$strip>;
export type CreateProductCommentFormInput = z.infer<typeof createProductCommentSchema>;
export type CreateProductCommentInput = Pick<Prisma.ProductCommentUncheckedCreateInput, "clinicId" | "itemId" | "authorId" | "body">;
