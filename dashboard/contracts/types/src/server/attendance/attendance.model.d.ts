import Elysia from "elysia";
export declare const attendanceModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "attendance.list": import("@sinclair/typebox").TObject<{
            start: import("@sinclair/typebox").TString;
            end: import("@sinclair/typebox").TString;
        }>;
        readonly "attendance.leaveBalance": import("@sinclair/typebox").TObject<{
            staffId: import("@sinclair/typebox").TString;
            year: import("@sinclair/typebox").TString;
        }>;
        readonly "attendance.upsert": import("@sinclair/typebox").TObject<{
            staffId: import("@sinclair/typebox").TString;
            date: import("@sinclair/typebox").TString;
            status: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PRESENT">, import("@sinclair/typebox").TLiteral<"ABSENT">, import("@sinclair/typebox").TLiteral<"LATE">, import("@sinclair/typebox").TLiteral<"LEAVE">, import("@sinclair/typebox").TLiteral<"MISSION">, import("@sinclair/typebox").TLiteral<"OVERTIME">]>;
            hours: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            checkIn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            checkOut: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
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
