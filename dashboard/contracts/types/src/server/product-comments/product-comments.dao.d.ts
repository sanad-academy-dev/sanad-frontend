import { type CreateProductCommentInput, type ProductCommentResponse } from "@/server/product-comments/product-comments.type";
export declare const productCommentsDao: {
    list(itemId: string, clinicId: string): Promise<ProductCommentResponse[]>;
    create(input: CreateProductCommentInput): Promise<ProductCommentResponse>;
};
