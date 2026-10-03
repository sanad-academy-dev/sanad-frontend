import Elysia from "elysia";
export declare const crmDealsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "crmDeals.create": import("@sinclair/typebox").TObject<{
            firstName: import("@sinclair/typebox").TString;
            lastName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            gender: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MALE">, import("@sinclair/typebox").TLiteral<"FEMALE">, import("@sinclair/typebox").TLiteral<"UNKNOWN">]>>;
            mobile: import("@sinclair/typebox").TString;
            phone: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            email: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            city: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            address: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            petSpecies: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            petCount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            petNotes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            leadId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            ownerId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            sourceId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            statusId: import("@sinclair/typebox").TString;
            probability: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            expectedCloseDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            dealValue: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            ownerUserId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "crmDeals.update": import("@sinclair/typebox").TObject<{
            firstName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            lastName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            gender: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MALE">, import("@sinclair/typebox").TLiteral<"FEMALE">, import("@sinclair/typebox").TLiteral<"UNKNOWN">]>]>>;
            mobile: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            phone: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            email: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            city: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            address: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            petSpecies: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            petCount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            petNotes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            expectedCloseDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            sourceId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        /** مسار تغيير الحالة الوحيد — تناديه اللوحة والصفحة معًا (WON مستثناة، BR-C4.1). */
        readonly "crmDeals.changeStatus": import("@sinclair/typebox").TObject<{
            statusId: import("@sinclair/typebox").TString;
            lostReasonId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            lostNotes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "crmDeals.assign": import("@sinclair/typebox").TObject<{
            ownerUserId: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>;
        }>;
        /** BR-C4.2 — تعديل النسبة يرفع علم التجاوز، و`reset` يخفضه. */
        readonly "crmDeals.probability": import("@sinclair/typebox").TObject<{
            probability: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            reset: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        /** §7 — الفوز إجراءٌ مستقلّ عن قائمة الحالات (BR-C4.1). */
        readonly "crmDeals.win": import("@sinclair/typebox").TObject<{
            statusId: import("@sinclair/typebox").TString;
            /** BR-C5.3 — ربط وليّ أمرٍ قائم بدل إنشاء واحدٍ جديد بنفس الرقم. */
            ownerId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "crmDeals.products": import("@sinclair/typebox").TObject<{
            products: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                itemType: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"SERVICE">, import("@sinclair/typebox").TLiteral<"MEMBERSHIP_PLAN">, import("@sinclair/typebox").TLiteral<"FREE_TEXT">]>;
                itemId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                label: import("@sinclair/typebox").TString;
                qty: import("@sinclair/typebox").TString;
                unitPrice: import("@sinclair/typebox").TString;
            }>>;
            manualDealValue: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "crmDeals.list.query": import("@sinclair/typebox").TObject<{
            statusId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            sourceId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            ownerUserId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            from: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            to: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            closingFrom: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            closingTo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            /** «صفقاتي» — نفس فلتر العملاء المحتملين (§3.2). */
            mine: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
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
