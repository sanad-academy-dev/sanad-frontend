import Elysia from "elysia";
export declare const trainingController: Elysia<"/training", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
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
    macro: Partial<{
        readonly requireClinic: boolean;
    }>;
    macroFn: {
        readonly requireClinic: {
            readonly resolve: ({ request }: {
                body: unknown;
                query: Record<string, string>;
                params: {};
                headers: Record<string, string | undefined>;
                cookie: Record<string, import("elysia").Cookie<unknown>>;
                server: import("elysia/universal/server").Server | null;
                redirect: import("elysia").redirect;
                set: {
                    headers: import("elysia").HTTPHeaders;
                    status?: number | keyof import("elysia").StatusMap;
                    redirect?: string;
                    cookie?: Record<string, import("elysia/cookies").ElysiaCookie>;
                };
                path: string;
                route: string;
                request: Request;
                store: {};
                status: <const Code extends number | keyof import("elysia").StatusMap, const T = Code extends 200 | 100 | 101 | 102 | 103 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 300 | 301 | 302 | 303 | 304 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 420 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 ? {
                    readonly 100: "Continue";
                    readonly 101: "Switching Protocols";
                    readonly 102: "Processing";
                    readonly 103: "Early Hints";
                    readonly 200: "OK";
                    readonly 201: "Created";
                    readonly 202: "Accepted";
                    readonly 203: "Non-Authoritative Information";
                    readonly 204: "No Content";
                    readonly 205: "Reset Content";
                    readonly 206: "Partial Content";
                    readonly 207: "Multi-Status";
                    readonly 208: "Already Reported";
                    readonly 300: "Multiple Choices";
                    readonly 301: "Moved Permanently";
                    readonly 302: "Found";
                    readonly 303: "See Other";
                    readonly 304: "Not Modified";
                    readonly 307: "Temporary Redirect";
                    readonly 308: "Permanent Redirect";
                    readonly 400: "Bad Request";
                    readonly 401: "Unauthorized";
                    readonly 402: "Payment Required";
                    readonly 403: "Forbidden";
                    readonly 404: "Not Found";
                    readonly 405: "Method Not Allowed";
                    readonly 406: "Not Acceptable";
                    readonly 407: "Proxy Authentication Required";
                    readonly 408: "Request Timeout";
                    readonly 409: "Conflict";
                    readonly 410: "Gone";
                    readonly 411: "Length Required";
                    readonly 412: "Precondition Failed";
                    readonly 413: "Payload Too Large";
                    readonly 414: "URI Too Long";
                    readonly 415: "Unsupported Media Type";
                    readonly 416: "Range Not Satisfiable";
                    readonly 417: "Expectation Failed";
                    readonly 418: "I'm a teapot";
                    readonly 420: "Enhance Your Calm";
                    readonly 421: "Misdirected Request";
                    readonly 422: "Unprocessable Content";
                    readonly 423: "Locked";
                    readonly 424: "Failed Dependency";
                    readonly 425: "Too Early";
                    readonly 426: "Upgrade Required";
                    readonly 428: "Precondition Required";
                    readonly 429: "Too Many Requests";
                    readonly 431: "Request Header Fields Too Large";
                    readonly 451: "Unavailable For Legal Reasons";
                    readonly 500: "Internal Server Error";
                    readonly 501: "Not Implemented";
                    readonly 502: "Bad Gateway";
                    readonly 503: "Service Unavailable";
                    readonly 504: "Gateway Timeout";
                    readonly 505: "HTTP Version Not Supported";
                    readonly 506: "Variant Also Negotiates";
                    readonly 507: "Insufficient Storage";
                    readonly 508: "Loop Detected";
                    readonly 510: "Not Extended";
                    readonly 511: "Network Authentication Required";
                }[Code] : Code>(code: Code, response?: T) => import("elysia").ElysiaCustomStatusResponse<Code, T, Code extends "Continue" | "Switching Protocols" | "Processing" | "Early Hints" | "OK" | "Created" | "Accepted" | "Non-Authoritative Information" | "No Content" | "Reset Content" | "Partial Content" | "Multi-Status" | "Already Reported" | "Multiple Choices" | "Moved Permanently" | "Found" | "See Other" | "Not Modified" | "Temporary Redirect" | "Permanent Redirect" | "Bad Request" | "Unauthorized" | "Payment Required" | "Forbidden" | "Not Found" | "Method Not Allowed" | "Not Acceptable" | "Proxy Authentication Required" | "Request Timeout" | "Conflict" | "Gone" | "Length Required" | "Precondition Failed" | "Payload Too Large" | "URI Too Long" | "Unsupported Media Type" | "Range Not Satisfiable" | "Expectation Failed" | "I'm a teapot" | "Enhance Your Calm" | "Misdirected Request" | "Unprocessable Content" | "Locked" | "Failed Dependency" | "Too Early" | "Upgrade Required" | "Precondition Required" | "Too Many Requests" | "Request Header Fields Too Large" | "Unavailable For Legal Reasons" | "Internal Server Error" | "Not Implemented" | "Bad Gateway" | "Service Unavailable" | "Gateway Timeout" | "HTTP Version Not Supported" | "Variant Also Negotiates" | "Insufficient Storage" | "Loop Detected" | "Not Extended" | "Network Authentication Required" ? {
                    readonly Continue: 100;
                    readonly "Switching Protocols": 101;
                    readonly Processing: 102;
                    readonly "Early Hints": 103;
                    readonly OK: 200;
                    readonly Created: 201;
                    readonly Accepted: 202;
                    readonly "Non-Authoritative Information": 203;
                    readonly "No Content": 204;
                    readonly "Reset Content": 205;
                    readonly "Partial Content": 206;
                    readonly "Multi-Status": 207;
                    readonly "Already Reported": 208;
                    readonly "Multiple Choices": 300;
                    readonly "Moved Permanently": 301;
                    readonly Found: 302;
                    readonly "See Other": 303;
                    readonly "Not Modified": 304;
                    readonly "Temporary Redirect": 307;
                    readonly "Permanent Redirect": 308;
                    readonly "Bad Request": 400;
                    readonly Unauthorized: 401;
                    readonly "Payment Required": 402;
                    readonly Forbidden: 403;
                    readonly "Not Found": 404;
                    readonly "Method Not Allowed": 405;
                    readonly "Not Acceptable": 406;
                    readonly "Proxy Authentication Required": 407;
                    readonly "Request Timeout": 408;
                    readonly Conflict: 409;
                    readonly Gone: 410;
                    readonly "Length Required": 411;
                    readonly "Precondition Failed": 412;
                    readonly "Payload Too Large": 413;
                    readonly "URI Too Long": 414;
                    readonly "Unsupported Media Type": 415;
                    readonly "Range Not Satisfiable": 416;
                    readonly "Expectation Failed": 417;
                    readonly "I'm a teapot": 418;
                    readonly "Enhance Your Calm": 420;
                    readonly "Misdirected Request": 421;
                    readonly "Unprocessable Content": 422;
                    readonly Locked: 423;
                    readonly "Failed Dependency": 424;
                    readonly "Too Early": 425;
                    readonly "Upgrade Required": 426;
                    readonly "Precondition Required": 428;
                    readonly "Too Many Requests": 429;
                    readonly "Request Header Fields Too Large": 431;
                    readonly "Unavailable For Legal Reasons": 451;
                    readonly "Internal Server Error": 500;
                    readonly "Not Implemented": 501;
                    readonly "Bad Gateway": 502;
                    readonly "Service Unavailable": 503;
                    readonly "Gateway Timeout": 504;
                    readonly "HTTP Version Not Supported": 505;
                    readonly "Variant Also Negotiates": 506;
                    readonly "Insufficient Storage": 507;
                    readonly "Loop Detected": 508;
                    readonly "Not Extended": 510;
                    readonly "Network Authentication Required": 511;
                }[Code] : Code>;
            }) => Promise<import("elysia").ElysiaCustomStatusResponse<401, {
                readonly message: "غير مصرح";
            }, 401> | {
                clinicId: string;
                userId: string;
            }>;
        };
    };
    parser: {};
    response: {};
}, {
    training: {};
} & {
    training: {
        courses: {
            stats: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: import("@/server/training/training.type").CourseStatsResponse;
                        401: {
                            readonly message: "غير مصرح";
                        };
                    };
                };
            };
        };
    };
} & {
    training: {
        courses: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: import("@/server/training/training.type").CourseListItemResponse[];
                    401: {
                        readonly message: "غير مصرح";
                    };
                };
            };
        };
    };
} & {
    training: {
        courses: {
            post: {
                body: {
                    priority?: "NORMAL" | "URGENT" | undefined;
                    description?: string | null | undefined;
                    timezone?: string | null | undefined;
                    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED" | undefined;
                    dueDate?: string | null | undefined;
                    startDate?: string | null | undefined;
                    category?: string | null | undefined;
                    department?: string | undefined;
                    targetRoleId?: string | null | undefined;
                    coverKey?: string | null | undefined;
                    estimatedDurationWeeks?: number | null | undefined;
                    language?: "AR" | "EN" | undefined;
                    orderMode?: "FREE" | "SEQUENTIAL" | undefined;
                    trainingCost?: number | null | undefined;
                    institution?: string | null | undefined;
                    locationMode?: "ONLINE" | "ONSITE" | "HYBRID" | null | undefined;
                    type: "INTERNAL" | "WORKSHOP" | "ONLINE" | "CERTIFICATION" | "CONFERENCE";
                    name: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        type: import("@/server/training/training.type").CourseType;
                        name: string;
                        priority: import("@/server/training/training.type").CoursePriority;
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        description: string | null;
                        timezone: string | null;
                        code: string;
                        status: import("@/server/training/training.type").CourseStatus;
                        editsCount: number;
                        dueDate: Date | null;
                        startDate: Date | null;
                        category: string | null;
                        department: string;
                        targetRoleId: string | null;
                        coverKey: string | null;
                        estimatedDurationWeeks: number | null;
                        language: import("@/server/training/training.type").CourseLanguage;
                        orderMode: import("@/server/training/training.type").CourseOrderMode;
                        trainingCost: number | null;
                        institution: string | null;
                        locationMode: import("@/server/training/training.type").CourseLocationMode | null;
                        targetRole: {
                            name: string;
                            id: string;
                        } | null;
                    };
                    400: {
                        readonly message: "القسم المستهدف غير صالح";
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    422: {
                        type: "validation";
                        on: string;
                        summary?: string;
                        message?: string;
                        found?: unknown;
                        property?: string;
                        expected?: string;
                    };
                };
            };
        };
    };
} & {
    training: {
        ai: {
            questions: {
                post: {
                    body: {
                        brief: string;
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            questions: string[];
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                        502: {
                            readonly message: string;
                        };
                    };
                };
            };
        };
    };
} & {
    training: {
        ai: {
            generate: {
                post: {
                    body: {
                        options?: {
                            depth?: string | undefined;
                            language?: string | undefined;
                            difficulty?: string | undefined;
                            levelCount?: number | undefined;
                            courseType?: string | undefined;
                            includeQuizzes?: boolean | undefined;
                            suggestMedia?: boolean | undefined;
                        } | undefined;
                        brief: string;
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            name: string;
                            description: string;
                            type: "INTERNAL" | "WORKSHOP" | "ONLINE" | "CERTIFICATION" | "CONFERENCE";
                            category: string;
                            language: "AR" | "EN";
                            estimatedDurationWeeks: number;
                            levels: {
                                name: string;
                                units: {
                                    title: string;
                                    contentType: "QUIZ" | "PAGE" | "LESSON";
                                    lessons: {
                                        title: string;
                                        type: "TEXT" | "DOCUMENT" | "VIDEO" | "QUIZ" | "SURVEY" | "AUDIO";
                                        content: string;
                                        questions: {
                                            text: string;
                                            answerType: "TEXT" | "MULTIPLE" | "SINGLE";
                                            options: {
                                                text: string;
                                                correct: boolean;
                                            }[];
                                            answerText: string;
                                        }[];
                                        resources: {
                                            title: string;
                                            url: string;
                                        }[];
                                    }[];
                                }[];
                            }[];
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                        502: {
                            readonly message: string;
                        };
                    };
                };
            };
        };
    };
} & {
    training: {
        ai: {
            save: {
                post: {
                    body: {
                        course: unknown;
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            id: string;
                        };
                        400: {
                            readonly message: "بنية الدورة المولّدة غير صالحة";
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    training: {
        courses: {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        401: {
                            readonly message: "غير مصرح";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    training: {
        courses: {
            ":id": {
                patch: {
                    body: {
                        type?: "INTERNAL" | "WORKSHOP" | "ONLINE" | "CERTIFICATION" | "CONFERENCE" | undefined;
                        name?: string | undefined;
                        priority?: "NORMAL" | "URGENT" | undefined;
                        description?: string | null | undefined;
                        timezone?: string | null | undefined;
                        status?: "DRAFT" | "PUBLISHED" | "ARCHIVED" | undefined;
                        dueDate?: string | null | undefined;
                        startDate?: string | null | undefined;
                        category?: string | null | undefined;
                        department?: string | undefined;
                        targetRoleId?: string | null | undefined;
                        coverKey?: string | null | undefined;
                        estimatedDurationWeeks?: number | null | undefined;
                        language?: "AR" | "EN" | undefined;
                        orderMode?: "FREE" | "SEQUENTIAL" | undefined;
                        trainingCost?: number | null | undefined;
                        institution?: string | null | undefined;
                        locationMode?: "ONLINE" | "ONSITE" | "HYBRID" | null | undefined;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        401: {
                            readonly message: "غير مصرح";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    training: {
        courses: {
            ":id": {
                duplicate: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            201: {};
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                readonly message: "الدورة غير موجودة";
                            };
                            422: {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    training: {
        courses: {
            ":id": {
                completion: {
                    get: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            401: {
                                readonly message: "غير مصرح";
                            };
                            422: {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    training: {
        courses: {
            ":id": {
                completion: {
                    put: {
                        body: {
                            certificateEnabled?: boolean | undefined;
                            certReferencePattern?: string | null | undefined;
                            certValidityDays?: number | null | undefined;
                            certSignatureName?: string | null | undefined;
                            certPassMark?: number | null | undefined;
                            reEnrollMode?: "NONE" | "AFTER_COMPLETION" | "BEFORE_EXPIRY" | undefined;
                            reEnrollDays?: number | null | undefined;
                            gamificationPoints?: number | undefined;
                            reviewEnabled?: boolean | undefined;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            401: {
                                readonly message: "غير مصرح";
                            };
                            422: {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    training: {
        courses: {
            ":id": {
                trainers: {
                    put: {
                        body: {
                            staffIds: string[];
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                count: number;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                readonly message: "الدورة غير موجودة";
                            };
                            422: {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    training: {
        courses: {
            ":id": {
                reviews: {
                    post: {
                        body: {
                            comment?: string | null | undefined;
                            rating: number;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            201: {
                                id: string;
                            };
                            400: {
                                readonly message: "التقييم غير مفعّل لهذه الدورة";
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: "لا يمكنك تقييم هذه الدورة";
                            } | {
                                readonly message: "يمكن تقييم الدورة بعد إكمالها فقط";
                            };
                            404: {
                                readonly message: "الدورة غير موجودة";
                            };
                            422: {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    training: {
        courses: {
            ":id": {
                levels: {
                    get: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            401: {
                                readonly message: "غير مصرح";
                            };
                            422: {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    training: {
        levels: {
            post: {
                body: {
                    name: string;
                    courseId: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {};
                    401: {
                        readonly message: "غير مصرح";
                    };
                    404: {
                        readonly message: "الدورة غير موجودة";
                    };
                    422: {
                        type: "validation";
                        on: string;
                        summary?: string;
                        message?: string;
                        found?: unknown;
                        property?: string;
                        expected?: string;
                    };
                };
            };
        };
    };
} & {
    training: {
        levels: {
            ":id": {
                patch: {
                    body: {
                        name: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        401: {
                            readonly message: "غير مصرح";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    training: {
        levels: {
            ":id": {
                delete: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        204: "No Content";
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "المستوى غير موجود";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    training: {
        courses: {
            ":id": {
                delete: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        204: "No Content";
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الدورة غير موجودة";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    training: {
        units: {
            post: {
                body: {
                    status?: "DRAFT" | "PUBLISHED" | undefined;
                    levelId?: string | null | undefined;
                    contentType?: "QUIZ" | "PAGE" | "LESSON" | undefined;
                    lessons?: {
                        description?: string | null | undefined;
                        content?: string | null | undefined;
                        mediaSource?: "DEVICE" | "URL" | null | undefined;
                        mediaKey?: string | null | undefined;
                        mediaUrl?: string | null | undefined;
                        durationSeconds?: number | null | undefined;
                        type: "TEXT" | "DOCUMENT" | "VIDEO" | "QUIZ" | "SURVEY" | "AUDIO";
                        title: string;
                    }[] | undefined;
                    title: string;
                    courseId: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {};
                    400: {
                        readonly message: "المستوى لا ينتمي إلى هذه الدورة";
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    404: {
                        readonly message: "الدورة غير موجودة";
                    };
                    422: {
                        type: "validation";
                        on: string;
                        summary?: string;
                        message?: string;
                        found?: unknown;
                        property?: string;
                        expected?: string;
                    };
                };
            };
        };
    };
} & {
    training: {
        units: {
            ":id": {
                patch: {
                    body: {
                        title?: string | undefined;
                        status?: "DRAFT" | "PUBLISHED" | undefined;
                        levelId?: string | null | undefined;
                        contentType?: "QUIZ" | "PAGE" | "LESSON" | undefined;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        401: {
                            readonly message: "غير مصرح";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    training: {
        courses: {
            ":id": {
                contents: {
                    reorder: {
                        patch: {
                            body: {
                                items: {
                                    unitId: string;
                                    levelId: string | null;
                                    position: number;
                                }[];
                            };
                            params: {
                                id: string;
                            };
                            query: {};
                            headers: {};
                            response: {
                                401: {
                                    readonly message: "غير مصرح";
                                };
                                422: {
                                    type: "validation";
                                    on: string;
                                    summary?: string;
                                    message?: string;
                                    found?: unknown;
                                    property?: string;
                                    expected?: string;
                                };
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    training: {
        units: {
            ":id": {
                duplicate: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            201: {};
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                readonly message: "الوحدة غير موجودة";
                            };
                            422: {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    training: {
        units: {
            ":id": {
                delete: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        204: "No Content";
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الوحدة غير موجودة";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    training: {
        lessons: {
            post: {
                body: {
                    description?: string | null | undefined;
                    content?: string | null | undefined;
                    mediaSource?: "DEVICE" | "URL" | null | undefined;
                    mediaKey?: string | null | undefined;
                    mediaUrl?: string | null | undefined;
                    durationSeconds?: number | null | undefined;
                    type: "TEXT" | "DOCUMENT" | "VIDEO" | "QUIZ" | "SURVEY" | "AUDIO";
                    title: string;
                    unitId: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {};
                    401: {
                        readonly message: "غير مصرح";
                    };
                    404: {
                        readonly message: "الوحدة غير موجودة";
                    };
                    422: {
                        type: "validation";
                        on: string;
                        summary?: string;
                        message?: string;
                        found?: unknown;
                        property?: string;
                        expected?: string;
                    };
                };
            };
        };
    };
} & {
    training: {
        lessons: {
            ":id": {
                patch: {
                    body: {
                        type?: "TEXT" | "DOCUMENT" | "VIDEO" | "QUIZ" | "SURVEY" | "AUDIO" | undefined;
                        description?: string | null | undefined;
                        title?: string | undefined;
                        content?: string | null | undefined;
                        mediaSource?: "DEVICE" | "URL" | null | undefined;
                        mediaKey?: string | null | undefined;
                        mediaUrl?: string | null | undefined;
                        durationSeconds?: number | null | undefined;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        401: {
                            readonly message: "غير مصرح";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    training: {
        lessons: {
            ":id": {
                delete: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        204: "No Content";
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الدرس غير موجود";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
}, {
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
} & {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
}>;
