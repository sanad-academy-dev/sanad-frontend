export declare class SecretBoxError extends Error {
}
/**
 * النواة الخالصة: المفتاح يُمرَّر صراحةً، فلا تلمس البيئة وتعمل في الحزمة السريعة.
 * كل استدعاءٍ يولّد nonce جديدًا — إعادة استعمال nonce مع نفس المفتاح تكسر XChaCha20.
 */
export declare function sealWith(key: Uint8Array, plaintext: string): string;
/**
 * الفكّ. أيّ عبثٍ بالنصّ المشفَّر يرمي — وهذا سلوك AEAD المقصود: قيمةٌ مُعدَّلة تُرفض
 * بدل أن تُفَكّ إلى قمامةٍ تُرسَل إلى مزوّدٍ خارجي.
 */
export declare function openWith(key: Uint8Array, sealed: string): string;
/** يميّز القيمة المشفَّرة عن النصّ الصريح، لترحيلٍ آمنٍ لو خُزّن شيءٌ صريحًا يومًا. */
export declare const isSealed: (value: string) => boolean;
