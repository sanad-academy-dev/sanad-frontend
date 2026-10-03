import Elysia from "elysia";
/**
 * [MC10] مخطّطات التحقّق لسجلّ الدورات المتنقلة.
 *
 * السعر والمدّة `__nullable__` عمدًا لا `Optional` وحدها: «امسح السعر الخاصّ» فعلٌ مختلف
 * عن «لا تغيّره»، والأوّل يحتاج `null` صريحة.
 */
export declare const mobileServicesModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "mobileServices.upsert": import("@sinclair/typebox").TObject<{
            serviceId: import("@sinclair/typebox").TString;
            price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNumber, import("@sinclair/typebox").TNull]>>;
            duration: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>>;
            isActive: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        }>;
        readonly "mobileServices.bulkAdd": import("@sinclair/typebox").TObject<{
            serviceIds: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
        }>;
        readonly "mobileServices.record": import("@sinclair/typebox").TObject<{
            serviceId: import("@sinclair/typebox").TString;
            quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        }>;
        readonly "mobileServices.quantity": import("@sinclair/typebox").TObject<{
            quantity: import("@sinclair/typebox").TInteger;
        }>;
    };
    error: {};
}, {
    schema: {};
    standaloneSchema: {};
    macro: {};
    macroFn: {};
    parser: {};
    response: {};
}, {}, {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
}, {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
}>;
