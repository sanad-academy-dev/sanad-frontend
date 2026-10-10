export declare function generateUniqueCode({ prefix, isUnique, length, maxRetries, }: {
    prefix: string;
    isUnique: (code: string) => Promise<boolean>;
    length?: number;
    maxRetries?: number;
}): Promise<string>;
