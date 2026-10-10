import Elysia from "elysia";
export declare const crmLeadsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "crmLeads.create": import("@sinclair/typebox").TObject<{
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
            statusId: import("@sinclair/typebox").TString;
            sourceId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            ownerUserId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "crmLeads.update": import("@sinclair/typebox").TObject<{
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
            sourceId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        /** مسار تغيير الحالة الوحيد — تناديه اللوحة والصفحة معًا. */
        readonly "crmLeads.changeStatus": import("@sinclair/typebox").TObject<{
            statusId: import("@sinclair/typebox").TString;
            lostReasonId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            lostNotes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "crmLeads.assign": import("@sinclair/typebox").TObject<{
            ownerUserId: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>;
        }>;
        readonly "crmLeads.list.query": import("@sinclair/typebox").TObject<{
            statusId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            sourceId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            ownerUserId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            from: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            to: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            /** «عملائي» — الفلتر الافتراضي الذي يقوده `ownerUserId` (§3.2) */
            mine: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            /** BR-C3.5 — إظهار المحوَّلين، وهم خارج القائمة افتراضًا */
            includeConverted: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        /** §5 — نافذة التحويل تسمح بالتعديل قبل التأكيد، فكل حقول اللقطة اختيارية هنا. */
        readonly "crmLeads.convert": import("@sinclair/typebox").TObject<{
            statusId: import("@sinclair/typebox").TString;
            ownerId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            probability: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            expectedCloseDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            dealValue: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            firstName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            lastName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            gender: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MALE">, import("@sinclair/typebox").TLiteral<"FEMALE">, import("@sinclair/typebox").TLiteral<"UNKNOWN">]>>;
            mobile: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            phone: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            email: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            city: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            address: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            petSpecies: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            petCount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            petNotes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            ownerUserId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "crmLeads.note": import("@sinclair/typebox").TObject<{
            title: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            content: import("@sinclair/typebox").TString;
        }>;
        readonly "crmLeads.task": import("@sinclair/typebox").TObject<{
            title: import("@sinclair/typebox").TString;
            description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            priority: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LOW">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"HIGH">]>>;
            status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"BACKLOG">, import("@sinclair/typebox").TLiteral<"TODO">, import("@sinclair/typebox").TLiteral<"IN_PROGRESS">, import("@sinclair/typebox").TLiteral<"DONE">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>>;
            dueAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            assignedToUserId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "crmLeads.taskUpdate": import("@sinclair/typebox").TObject<{
            title: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            priority: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LOW">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"HIGH">]>>;
            status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"BACKLOG">, import("@sinclair/typebox").TLiteral<"TODO">, import("@sinclair/typebox").TLiteral<"IN_PROGRESS">, import("@sinclair/typebox").TLiteral<"DONE">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>>;
            dueAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            assignedToUserId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "crmLeads.comment": import("@sinclair/typebox").TObject<{
            content: import("@sinclair/typebox").TString;
            mentionedUserIds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        }>;
        readonly "crmLeads.tasks.query": import("@sinclair/typebox").TObject<{
            mine: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        /** §8.3 — نفس شكل الاستعلام للعميل المحتمل والصفقة. */
        readonly "crm.timeline.query": import("@sinclair/typebox").TObject<{
            types: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            cursor: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            limit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
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
