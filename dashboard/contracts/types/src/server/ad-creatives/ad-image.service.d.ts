export declare class AdImageUnavailableError extends Error {
    constructor();
}
export type GenerateAdImageInput = {
    prompt: string;
    /** رقاقة النمط (بدون/سينمائي/فوتوغراف…) */
    style?: string | null;
    /** يُلغي التوليد حين يضغط المستخدم «إلغاء» في لوحة التقدّم */
    signal?: AbortSignal;
};
export declare function generateAdImage(input: GenerateAdImageInput): Promise<string>;
