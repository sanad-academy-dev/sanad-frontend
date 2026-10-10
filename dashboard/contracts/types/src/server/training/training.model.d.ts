import Elysia from "elysia";
export declare const trainingModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "training.createCourse": import("@sinclair/typebox").TObject<{
            targetRoleId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            category: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            priority: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"URGENT">, import("@sinclair/typebox").TLiteral<"NORMAL">]>>;
            estimatedDurationWeeks: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            language: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"AR">, import("@sinclair/typebox").TLiteral<"EN">]>>;
            orderMode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"SEQUENTIAL">, import("@sinclair/typebox").TLiteral<"FREE">]>>;
            description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            coverKey: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAFT">, import("@sinclair/typebox").TLiteral<"PUBLISHED">, import("@sinclair/typebox").TLiteral<"ARCHIVED">]>>;
            startDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            dueDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            timezone: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            trainingCost: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            institution: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            locationMode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ONSITE">, import("@sinclair/typebox").TLiteral<"ONLINE">, import("@sinclair/typebox").TLiteral<"HYBRID">]>]>>;
            name: import("@sinclair/typebox").TString;
            type: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"INTERNAL">, import("@sinclair/typebox").TLiteral<"WORKSHOP">, import("@sinclair/typebox").TLiteral<"ONLINE">, import("@sinclair/typebox").TLiteral<"CERTIFICATION">, import("@sinclair/typebox").TLiteral<"CONFERENCE">]>;
            department: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "training.updateCourse": import("@sinclair/typebox").TObject<{
            targetRoleId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            category: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            priority: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"URGENT">, import("@sinclair/typebox").TLiteral<"NORMAL">]>>;
            estimatedDurationWeeks: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            language: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"AR">, import("@sinclair/typebox").TLiteral<"EN">]>>;
            orderMode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"SEQUENTIAL">, import("@sinclair/typebox").TLiteral<"FREE">]>>;
            description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            coverKey: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAFT">, import("@sinclair/typebox").TLiteral<"PUBLISHED">, import("@sinclair/typebox").TLiteral<"ARCHIVED">]>>;
            startDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            dueDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            timezone: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            trainingCost: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            institution: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            locationMode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ONSITE">, import("@sinclair/typebox").TLiteral<"ONLINE">, import("@sinclair/typebox").TLiteral<"HYBRID">]>]>>;
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            department: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"INTERNAL">, import("@sinclair/typebox").TLiteral<"WORKSHOP">, import("@sinclair/typebox").TLiteral<"ONLINE">, import("@sinclair/typebox").TLiteral<"CERTIFICATION">, import("@sinclair/typebox").TLiteral<"CONFERENCE">]>>;
        }>;
        readonly "training.setTrainers": import("@sinclair/typebox").TObject<{
            staffIds: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
        }>;
        readonly "training.createReview": import("@sinclair/typebox").TObject<{
            rating: import("@sinclair/typebox").TInteger;
            comment: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "training.aiBrief": import("@sinclair/typebox").TObject<{
            brief: import("@sinclair/typebox").TString;
        }>;
        readonly "training.aiGenerate": import("@sinclair/typebox").TObject<{
            brief: import("@sinclair/typebox").TString;
            options: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
                levelCount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
                difficulty: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                language: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                courseType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                includeQuizzes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                depth: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                suggestMedia: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            }>>;
        }>;
        readonly "training.aiSave": import("@sinclair/typebox").TObject<{
            course: import("@sinclair/typebox").TUnknown;
        }>;
        readonly "training.createLevel": import("@sinclair/typebox").TObject<{
            courseId: import("@sinclair/typebox").TString;
            name: import("@sinclair/typebox").TString;
        }>;
        readonly "training.updateLevel": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
        }>;
        readonly "training.completionSettings": import("@sinclair/typebox").TObject<{
            certificateEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            certReferencePattern: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            certValidityDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            certSignatureName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            certPassMark: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            reEnrollMode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NONE">, import("@sinclair/typebox").TLiteral<"AFTER_COMPLETION">, import("@sinclair/typebox").TLiteral<"BEFORE_EXPIRY">]>>;
            reEnrollDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            gamificationPoints: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            reviewEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "training.createUnit": import("@sinclair/typebox").TObject<{
            courseId: import("@sinclair/typebox").TString;
            title: import("@sinclair/typebox").TString;
            levelId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            contentType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PAGE">, import("@sinclair/typebox").TLiteral<"LESSON">, import("@sinclair/typebox").TLiteral<"QUIZ">]>>;
            status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAFT">, import("@sinclair/typebox").TLiteral<"PUBLISHED">]>>;
            lessons: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                title: import("@sinclair/typebox").TString;
                type: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"TEXT">, import("@sinclair/typebox").TLiteral<"VIDEO">, import("@sinclair/typebox").TLiteral<"DOCUMENT">, import("@sinclair/typebox").TLiteral<"QUIZ">, import("@sinclair/typebox").TLiteral<"SURVEY">, import("@sinclair/typebox").TLiteral<"AUDIO">]>;
                description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                mediaSource: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DEVICE">, import("@sinclair/typebox").TLiteral<"URL">]>]>>;
                mediaKey: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                mediaUrl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                durationSeconds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
                content: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            }>>>;
        }>;
        readonly "training.updateUnit": import("@sinclair/typebox").TObject<{
            title: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            levelId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            contentType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PAGE">, import("@sinclair/typebox").TLiteral<"LESSON">, import("@sinclair/typebox").TLiteral<"QUIZ">]>>;
            status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAFT">, import("@sinclair/typebox").TLiteral<"PUBLISHED">]>>;
        }>;
        readonly "training.reorderContents": import("@sinclair/typebox").TObject<{
            items: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                unitId: import("@sinclair/typebox").TString;
                levelId: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>;
                position: import("@sinclair/typebox").TInteger;
            }>>;
        }>;
        readonly "training.createLesson": import("@sinclair/typebox").TObject<{
            unitId: import("@sinclair/typebox").TString;
            title: import("@sinclair/typebox").TString;
            type: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"TEXT">, import("@sinclair/typebox").TLiteral<"VIDEO">, import("@sinclair/typebox").TLiteral<"DOCUMENT">, import("@sinclair/typebox").TLiteral<"QUIZ">, import("@sinclair/typebox").TLiteral<"SURVEY">, import("@sinclair/typebox").TLiteral<"AUDIO">]>;
            description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            mediaSource: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DEVICE">, import("@sinclair/typebox").TLiteral<"URL">]>]>>;
            mediaKey: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            mediaUrl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            durationSeconds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            content: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "training.updateLesson": import("@sinclair/typebox").TObject<{
            title: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"TEXT">, import("@sinclair/typebox").TLiteral<"VIDEO">, import("@sinclair/typebox").TLiteral<"DOCUMENT">, import("@sinclair/typebox").TLiteral<"QUIZ">, import("@sinclair/typebox").TLiteral<"SURVEY">, import("@sinclair/typebox").TLiteral<"AUDIO">]>>;
            description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            mediaSource: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DEVICE">, import("@sinclair/typebox").TLiteral<"URL">]>]>>;
            mediaKey: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            mediaUrl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            durationSeconds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            content: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
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
