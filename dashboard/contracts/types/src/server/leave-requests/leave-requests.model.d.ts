import Elysia from "elysia";
export declare const leaveRequestsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "leaveRequest.create": import("@sinclair/typebox").TObject<{
            staffId: import("@sinclair/typebox").TString;
            type: import("@sinclair/typebox").TString;
            startDate: import("@sinclair/typebox").TString;
            endDate: import("@sinclair/typebox").TString;
            days: import("@sinclair/typebox").TNumber;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            substituteStaffId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            attachments: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                kind: import("@sinclair/typebox").TString;
                name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                url: import("@sinclair/typebox").TString;
            }>>>;
        }>;
        readonly "leaveRequest.sendEmail": import("@sinclair/typebox").TObject<{
            recipients: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
            subject: import("@sinclair/typebox").TString;
            message: import("@sinclair/typebox").TString;
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
