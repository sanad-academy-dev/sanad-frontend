/**
 * تخزين الملفات المرفوعة — أُخرج من `uploads.controller` ليشاركه رفعُ صور الزيارات
 * المتنقلة وتوقيع وليّ الأمر ([A4]). المنطق واحد ولا يصحّ أن يُنسخ: نسخة ثانية تعني مسار
 * تخزين ثانيًا ينحرف عن الأول عند أوّل تغيير في إعداد S3.
 */
export declare function sanitizeFileName(name: string): string;
export declare const isS3Configured: () => boolean;
export declare const LOCAL_UPLOADS_DIR: string;
/**
 * يخزّن الملف ويعيد مفتاحه: مفتاح S3 ("uploads/…") أو مسارًا محليًا ("/uploads/…").
 * كلاهما يفهمه `getFileUrl` على الواجهة.
 */
export declare function storeFile(file: File): Promise<string>;
