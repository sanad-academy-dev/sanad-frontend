/**
 * كلمة مرور مولَّدة: مجموعتان من أربعة، مفصولتان بشرطة — «K7MP-QX92».
 *
 * ٨ محارف من أبجدية ٣١ = نحو ٤٠ بتًا من العشوائية. هذا أضعف من كلمة سرّ دائمة، وهو
 * مقبول **لأنها مؤقّتة بحكم `mustChangePassword`** ولأن محاولات الدخول محدودة بالقفل
 * بعد خمس محاولات. لو أُلغي أيٌّ من الشرطين وجب رفع الطول.
 *
 * `randomInt` لا `Math.random`: الأخيرة ليست تشفيرية، وكلمة مرور مشتقّة منها قابلة
 * للتنبّؤ إذا عُرفت بذرة المولّد.
 */
export declare function generateOwnerPassword(): string;
/** يُنتج `salt:hash` بالنظام الستّ عشري — عمود واحد يحمل كل ما يلزم للتحقّق. */
export declare function hashOwnerPassword(password: string): Promise<string>;
/**
 * تحقّق بزمن ثابت.
 *
 * `timingSafeEqual` لا `===`: المقارنة العادية تخرج عند أوّل بايت مختلف، وفرق التوقيت
 * بين محاولتين يكشف كم بايتًا صحّ من التجزئة. الفارق ميكروثوانٍ، وهو كافٍ عبر آلاف
 * المحاولات.
 */
export declare function verifyOwnerPassword(password: string, stored: string): Promise<boolean>;
/** بادئة رمز الجلسة — رمزٌ مسرَّب في سجلّ أو لقطة شاشة يُعرف مصدره فورًا. */
export declare const PET_TOKEN_PREFIX = "PET_";
export declare function generateSessionToken(): {
    raw: string;
    tokenHash: string;
    tokenPrefix: string;
};
export declare function hashSessionToken(raw: string): string;
