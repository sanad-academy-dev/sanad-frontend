import Elysia from "elysia";
export declare const crmDealsController: Elysia<"/crm/deals", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
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
        readonly "crmDeals.changeStatus": import("@sinclair/typebox").TObject<{
            statusId: import("@sinclair/typebox").TString;
            lostReasonId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            lostNotes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "crmDeals.assign": import("@sinclair/typebox").TObject<{
            ownerUserId: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>;
        }>;
        readonly "crmDeals.probability": import("@sinclair/typebox").TObject<{
            probability: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            reset: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "crmDeals.win": import("@sinclair/typebox").TObject<{
            statusId: import("@sinclair/typebox").TString;
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
            mine: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
    };
    error: {};
} & {
    typebox: {
        readonly "crmEmail.template.create": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            subject: import("@sinclair/typebox").TString;
            body: import("@sinclair/typebox").TString;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "crmEmail.template.update": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            subject: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            body: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "crmEmail.template.query": import("@sinclair/typebox").TObject<{
            includeInactive: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "crmEmail.send": import("@sinclair/typebox").TObject<{
            templateId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            subject: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            body: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            to: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
    };
    error: {};
} & {
    typebox: {
        readonly "crmWhatsapp.credentials": import("@sinclair/typebox").TObject<{
            instanceId: import("@sinclair/typebox").TString;
            apiToken: import("@sinclair/typebox").TString;
        }>;
        readonly "crmWhatsapp.send": import("@sinclair/typebox").TObject<{
            body: import("@sinclair/typebox").TString;
        }>;
    };
    error: {};
} & {
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
            mine: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            includeConverted: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
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
    macro: Partial<{
        readonly requireDealRead: boolean;
        readonly requireDealCreate: boolean;
        readonly requireDealEdit: boolean;
        readonly requireDealDelete: boolean;
        readonly requireDealTaskWrite: boolean;
        readonly requireDealAssign: boolean;
    }>;
    macroFn: {
        readonly requireDealRead: {
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
            }, 401> | import("elysia").ElysiaCustomStatusResponse<403, {
                readonly message: "لا تملك صلاحية عرض الصفقات";
            }, 403> | {
                clinicId: string;
                userId: string;
                scopeAll: boolean;
                scopedUserId: string | null;
            }>;
        };
        readonly requireDealCreate: {
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
            }, 401> | import("elysia").ElysiaCustomStatusResponse<403, {
                readonly message: "لا تملك صلاحية إضافة صفقة";
            }, 403> | {
                clinicId: string;
                userId: string;
            }>;
        };
        readonly requireDealEdit: {
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
            }, 401> | import("elysia").ElysiaCustomStatusResponse<403, {
                readonly message: "لا تملك صلاحية تعديل الصفقات";
            }, 403> | {
                clinicId: string;
                userId: string;
            }>;
        };
        readonly requireDealDelete: {
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
            }, 401> | import("elysia").ElysiaCustomStatusResponse<403, {
                readonly message: "لا تملك صلاحية حذف الصفقات";
            }, 403> | {
                clinicId: string;
                userId: string;
            }>;
        };
        readonly requireDealTaskWrite: {
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
            }, 401> | import("elysia").ElysiaCustomStatusResponse<403, {
                readonly message: "لا تملك صلاحية إضافة مهمة";
            }, 403> | {
                clinicId: string;
                userId: string;
            }>;
        };
        readonly requireDealAssign: {
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
            }, 401> | import("elysia").ElysiaCustomStatusResponse<403, {
                readonly message: "لا تملك صلاحية إسناد الصفقات";
            }, 403> | {
                clinicId: string;
                userId: string;
            }>;
        };
    };
    parser: {};
    response: {};
}, {
    crm: {
        deals: {};
    };
} & {
    crm: {
        deals: {
            get: {
                body: {};
                params: {};
                query: {
                    search?: string | undefined;
                    to?: string | undefined;
                    from?: string | undefined;
                    sourceId?: string | undefined;
                    mine?: boolean | undefined;
                    statusId?: string | undefined;
                    ownerUserId?: string | undefined;
                    closingFrom?: string | undefined;
                    closingTo?: string | undefined;
                };
                headers: {};
                response: {
                    200: {
                        id: string;
                        createdAt: Date;
                        email: string | null;
                        city: string | null;
                        code: string;
                        status: {
                            name: string;
                            id: string;
                            order: number;
                            kind: import("../../../../generated/prisma/enums").CrmDealStatusKind;
                            color: string;
                        };
                        sourceId: string | null;
                        ownerId: string | null;
                        source: {
                            name: string;
                            id: string;
                        } | null;
                        leadId: string | null;
                        statusId: string;
                        probability: import("@prisma/client-runtime-utils").Decimal;
                        expectedCloseDate: Date | null;
                        dealValue: import("@prisma/client-runtime-utils").Decimal;
                        ownerUserId: string | null;
                        mobile: string;
                        fullName: string;
                        expectedValue: import("@prisma/client-runtime-utils").Decimal;
                        closedDate: Date | null;
                        wonOwnerId: string | null;
                        slaPolicyId: string | null;
                        responseBy: Date | null;
                        firstRespondedAt: Date | null;
                        slaStatus: import("../../../../generated/prisma/enums").CrmSlaStatus | null;
                        ownerUser: {
                            name: string;
                            id: string;
                        } | null;
                    }[];
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض الصفقات";
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
    crm: {
        deals: {
            post: {
                body: {
                    address?: string | undefined;
                    email?: string | undefined;
                    phone?: string | undefined;
                    city?: string | undefined;
                    gender?: "MALE" | "FEMALE" | "UNKNOWN" | undefined;
                    notes?: string | undefined;
                    lastName?: string | undefined;
                    sourceId?: string | undefined;
                    ownerId?: string | undefined;
                    leadId?: string | undefined;
                    petNotes?: string | undefined;
                    probability?: number | undefined;
                    expectedCloseDate?: string | undefined;
                    dealValue?: string | undefined;
                    ownerUserId?: string | undefined;
                    petSpecies?: string | undefined;
                    petCount?: number | undefined;
                    firstName: string;
                    statusId: string;
                    mobile: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        owner: {
                            name: string;
                            id: string;
                            code: string;
                        } | null;
                        address: string | null;
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string | null;
                        phone: string | null;
                        city: string | null;
                        code: string;
                        gender: import("../../staff/staff.type").Gender | null;
                        notes: string | null;
                        status: {
                            name: string;
                            id: string;
                            order: number;
                            kind: import("../../../../generated/prisma/enums").CrmDealStatusKind;
                            color: string;
                        };
                        firstName: string;
                        lastName: string | null;
                        sourceId: string | null;
                        products: {
                            id: string;
                            qty: import("@prisma/client-runtime-utils").Decimal;
                            lineTotal: import("@prisma/client-runtime-utils").Decimal;
                            dealId: string;
                            itemId: string | null;
                            label: string;
                            itemType: import("../../../../generated/prisma/enums").CrmDealProductItemType;
                            unitPrice: import("@prisma/client-runtime-utils").Decimal;
                        }[];
                        ownerId: string | null;
                        source: {
                            name: string;
                            id: string;
                        } | null;
                        leadId: string | null;
                        lead: {
                            id: string;
                            code: string;
                            fullName: string;
                        } | null;
                        petNotes: string | null;
                        statusId: string;
                        probability: import("@prisma/client-runtime-utils").Decimal;
                        expectedCloseDate: Date | null;
                        dealValue: import("@prisma/client-runtime-utils").Decimal;
                        ownerUserId: string | null;
                        mobile: string;
                        petSpecies: string | null;
                        petCount: number | null;
                        lostReasonId: string | null;
                        lostNotes: string | null;
                        fullName: string;
                        expectedValue: import("@prisma/client-runtime-utils").Decimal;
                        closedDate: Date | null;
                        wonOwnerId: string | null;
                        slaPolicyId: string | null;
                        responseBy: Date | null;
                        firstRespondedAt: Date | null;
                        slaStatus: import("../../../../generated/prisma/enums").CrmSlaStatus | null;
                        ownerUser: {
                            name: string;
                            id: string;
                        } | null;
                        probabilityOverridden: boolean;
                        wonOwner: {
                            name: string;
                            id: string;
                            code: string;
                        } | null;
                        lostReason: {
                            name: string;
                            id: string;
                        } | null;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية إضافة صفقة";
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
    crm: {
        deals: {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            owner: {
                                name: string;
                                id: string;
                                code: string;
                            } | null;
                            address: string | null;
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            email: string | null;
                            phone: string | null;
                            city: string | null;
                            code: string;
                            gender: import("../../staff/staff.type").Gender | null;
                            notes: string | null;
                            status: {
                                name: string;
                                id: string;
                                order: number;
                                kind: import("../../../../generated/prisma/enums").CrmDealStatusKind;
                                color: string;
                            };
                            firstName: string;
                            lastName: string | null;
                            sourceId: string | null;
                            products: {
                                id: string;
                                qty: import("@prisma/client-runtime-utils").Decimal;
                                lineTotal: import("@prisma/client-runtime-utils").Decimal;
                                dealId: string;
                                itemId: string | null;
                                label: string;
                                itemType: import("../../../../generated/prisma/enums").CrmDealProductItemType;
                                unitPrice: import("@prisma/client-runtime-utils").Decimal;
                            }[];
                            ownerId: string | null;
                            source: {
                                name: string;
                                id: string;
                            } | null;
                            leadId: string | null;
                            lead: {
                                id: string;
                                code: string;
                                fullName: string;
                            } | null;
                            petNotes: string | null;
                            statusId: string;
                            probability: import("@prisma/client-runtime-utils").Decimal;
                            expectedCloseDate: Date | null;
                            dealValue: import("@prisma/client-runtime-utils").Decimal;
                            ownerUserId: string | null;
                            mobile: string;
                            petSpecies: string | null;
                            petCount: number | null;
                            lostReasonId: string | null;
                            lostNotes: string | null;
                            fullName: string;
                            expectedValue: import("@prisma/client-runtime-utils").Decimal;
                            closedDate: Date | null;
                            wonOwnerId: string | null;
                            slaPolicyId: string | null;
                            responseBy: Date | null;
                            firstRespondedAt: Date | null;
                            slaStatus: import("../../../../generated/prisma/enums").CrmSlaStatus | null;
                            ownerUser: {
                                name: string;
                                id: string;
                            } | null;
                            probabilityOverridden: boolean;
                            wonOwner: {
                                name: string;
                                id: string;
                                code: string;
                            } | null;
                            lostReason: {
                                name: string;
                                id: string;
                            } | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض الصفقات";
                        } | {
                            readonly message: "لا تملك صلاحية عرض هذه الصفقة";
                        };
                        404: {
                            readonly message: "الصفقة غير موجودة";
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
    crm: {
        deals: {
            ":id": {
                patch: {
                    body: {
                        address?: string | null | undefined;
                        email?: string | null | undefined;
                        phone?: string | null | undefined;
                        city?: string | null | undefined;
                        gender?: "MALE" | "FEMALE" | "UNKNOWN" | null | undefined;
                        notes?: string | null | undefined;
                        firstName?: string | undefined;
                        lastName?: string | null | undefined;
                        sourceId?: string | null | undefined;
                        petNotes?: string | null | undefined;
                        expectedCloseDate?: string | null | undefined;
                        mobile?: string | undefined;
                        petSpecies?: string | null | undefined;
                        petCount?: number | null | undefined;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            owner: {
                                name: string;
                                id: string;
                                code: string;
                            } | null;
                            address: string | null;
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            email: string | null;
                            phone: string | null;
                            city: string | null;
                            code: string;
                            gender: import("../../staff/staff.type").Gender | null;
                            notes: string | null;
                            status: {
                                name: string;
                                id: string;
                                order: number;
                                kind: import("../../../../generated/prisma/enums").CrmDealStatusKind;
                                color: string;
                            };
                            firstName: string;
                            lastName: string | null;
                            sourceId: string | null;
                            products: {
                                id: string;
                                qty: import("@prisma/client-runtime-utils").Decimal;
                                lineTotal: import("@prisma/client-runtime-utils").Decimal;
                                dealId: string;
                                itemId: string | null;
                                label: string;
                                itemType: import("../../../../generated/prisma/enums").CrmDealProductItemType;
                                unitPrice: import("@prisma/client-runtime-utils").Decimal;
                            }[];
                            ownerId: string | null;
                            source: {
                                name: string;
                                id: string;
                            } | null;
                            leadId: string | null;
                            lead: {
                                id: string;
                                code: string;
                                fullName: string;
                            } | null;
                            petNotes: string | null;
                            statusId: string;
                            probability: import("@prisma/client-runtime-utils").Decimal;
                            expectedCloseDate: Date | null;
                            dealValue: import("@prisma/client-runtime-utils").Decimal;
                            ownerUserId: string | null;
                            mobile: string;
                            petSpecies: string | null;
                            petCount: number | null;
                            lostReasonId: string | null;
                            lostNotes: string | null;
                            fullName: string;
                            expectedValue: import("@prisma/client-runtime-utils").Decimal;
                            closedDate: Date | null;
                            wonOwnerId: string | null;
                            slaPolicyId: string | null;
                            responseBy: Date | null;
                            firstRespondedAt: Date | null;
                            slaStatus: import("../../../../generated/prisma/enums").CrmSlaStatus | null;
                            ownerUser: {
                                name: string;
                                id: string;
                            } | null;
                            probabilityOverridden: boolean;
                            wonOwner: {
                                name: string;
                                id: string;
                                code: string;
                            } | null;
                            lostReason: {
                                name: string;
                                id: string;
                            } | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية تعديل الصفقات";
                        };
                        404: {
                            readonly message: "الصفقة غير موجودة";
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
    crm: {
        deals: {
            ":id": {
                delete: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            ok: boolean;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية حذف الصفقات";
                        };
                        404: {
                            readonly message: "الصفقة غير موجودة";
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
    crm: {
        deals: {
            ":id": {
                status: {
                    post: {
                        body: {
                            lostReasonId?: string | undefined;
                            lostNotes?: string | undefined;
                            statusId: string;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                owner: {
                                    name: string;
                                    id: string;
                                    code: string;
                                } | null;
                                address: string | null;
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                email: string | null;
                                phone: string | null;
                                city: string | null;
                                code: string;
                                gender: import("../../staff/staff.type").Gender | null;
                                notes: string | null;
                                status: {
                                    name: string;
                                    id: string;
                                    order: number;
                                    kind: import("../../../../generated/prisma/enums").CrmDealStatusKind;
                                    color: string;
                                };
                                firstName: string;
                                lastName: string | null;
                                sourceId: string | null;
                                products: {
                                    id: string;
                                    qty: import("@prisma/client-runtime-utils").Decimal;
                                    lineTotal: import("@prisma/client-runtime-utils").Decimal;
                                    dealId: string;
                                    itemId: string | null;
                                    label: string;
                                    itemType: import("../../../../generated/prisma/enums").CrmDealProductItemType;
                                    unitPrice: import("@prisma/client-runtime-utils").Decimal;
                                }[];
                                ownerId: string | null;
                                source: {
                                    name: string;
                                    id: string;
                                } | null;
                                leadId: string | null;
                                lead: {
                                    id: string;
                                    code: string;
                                    fullName: string;
                                } | null;
                                petNotes: string | null;
                                statusId: string;
                                probability: import("@prisma/client-runtime-utils").Decimal;
                                expectedCloseDate: Date | null;
                                dealValue: import("@prisma/client-runtime-utils").Decimal;
                                ownerUserId: string | null;
                                mobile: string;
                                petSpecies: string | null;
                                petCount: number | null;
                                lostReasonId: string | null;
                                lostNotes: string | null;
                                fullName: string;
                                expectedValue: import("@prisma/client-runtime-utils").Decimal;
                                closedDate: Date | null;
                                wonOwnerId: string | null;
                                slaPolicyId: string | null;
                                responseBy: Date | null;
                                firstRespondedAt: Date | null;
                                slaStatus: import("../../../../generated/prisma/enums").CrmSlaStatus | null;
                                ownerUser: {
                                    name: string;
                                    id: string;
                                } | null;
                                probabilityOverridden: boolean;
                                wonOwner: {
                                    name: string;
                                    id: string;
                                    code: string;
                                } | null;
                                lostReason: {
                                    name: string;
                                    id: string;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: "لا تملك صلاحية تعديل الصفقات";
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
    crm: {
        deals: {
            ":id": {
                assign: {
                    post: {
                        body: {
                            ownerUserId: string | null;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                owner: {
                                    name: string;
                                    id: string;
                                    code: string;
                                } | null;
                                address: string | null;
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                email: string | null;
                                phone: string | null;
                                city: string | null;
                                code: string;
                                gender: import("../../staff/staff.type").Gender | null;
                                notes: string | null;
                                status: {
                                    name: string;
                                    id: string;
                                    order: number;
                                    kind: import("../../../../generated/prisma/enums").CrmDealStatusKind;
                                    color: string;
                                };
                                firstName: string;
                                lastName: string | null;
                                sourceId: string | null;
                                products: {
                                    id: string;
                                    qty: import("@prisma/client-runtime-utils").Decimal;
                                    lineTotal: import("@prisma/client-runtime-utils").Decimal;
                                    dealId: string;
                                    itemId: string | null;
                                    label: string;
                                    itemType: import("../../../../generated/prisma/enums").CrmDealProductItemType;
                                    unitPrice: import("@prisma/client-runtime-utils").Decimal;
                                }[];
                                ownerId: string | null;
                                source: {
                                    name: string;
                                    id: string;
                                } | null;
                                leadId: string | null;
                                lead: {
                                    id: string;
                                    code: string;
                                    fullName: string;
                                } | null;
                                petNotes: string | null;
                                statusId: string;
                                probability: import("@prisma/client-runtime-utils").Decimal;
                                expectedCloseDate: Date | null;
                                dealValue: import("@prisma/client-runtime-utils").Decimal;
                                ownerUserId: string | null;
                                mobile: string;
                                petSpecies: string | null;
                                petCount: number | null;
                                lostReasonId: string | null;
                                lostNotes: string | null;
                                fullName: string;
                                expectedValue: import("@prisma/client-runtime-utils").Decimal;
                                closedDate: Date | null;
                                wonOwnerId: string | null;
                                slaPolicyId: string | null;
                                responseBy: Date | null;
                                firstRespondedAt: Date | null;
                                slaStatus: import("../../../../generated/prisma/enums").CrmSlaStatus | null;
                                ownerUser: {
                                    name: string;
                                    id: string;
                                } | null;
                                probabilityOverridden: boolean;
                                wonOwner: {
                                    name: string;
                                    id: string;
                                    code: string;
                                } | null;
                                lostReason: {
                                    name: string;
                                    id: string;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: "لا تملك صلاحية إسناد الصفقات";
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
    crm: {
        deals: {
            ":id": {
                win: {
                    post: {
                        body: {
                            ownerId?: string | undefined;
                            statusId: string;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                deal: import("@/server/crm/crm-deals/crm-deals.type").CrmDealDetailResponse;
                                membershipPrompt: import("@/server/crm/crm-deals/crm-win.service").MembershipPrompt;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: "لا تملك صلاحية تعديل الصفقات";
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
    crm: {
        deals: {
            ":id": {
                probability: {
                    post: {
                        body: {
                            probability?: number | undefined;
                            reset?: boolean | undefined;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                owner: {
                                    name: string;
                                    id: string;
                                    code: string;
                                } | null;
                                address: string | null;
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                email: string | null;
                                phone: string | null;
                                city: string | null;
                                code: string;
                                gender: import("../../staff/staff.type").Gender | null;
                                notes: string | null;
                                status: {
                                    name: string;
                                    id: string;
                                    order: number;
                                    kind: import("../../../../generated/prisma/enums").CrmDealStatusKind;
                                    color: string;
                                };
                                firstName: string;
                                lastName: string | null;
                                sourceId: string | null;
                                products: {
                                    id: string;
                                    qty: import("@prisma/client-runtime-utils").Decimal;
                                    lineTotal: import("@prisma/client-runtime-utils").Decimal;
                                    dealId: string;
                                    itemId: string | null;
                                    label: string;
                                    itemType: import("../../../../generated/prisma/enums").CrmDealProductItemType;
                                    unitPrice: import("@prisma/client-runtime-utils").Decimal;
                                }[];
                                ownerId: string | null;
                                source: {
                                    name: string;
                                    id: string;
                                } | null;
                                leadId: string | null;
                                lead: {
                                    id: string;
                                    code: string;
                                    fullName: string;
                                } | null;
                                petNotes: string | null;
                                statusId: string;
                                probability: import("@prisma/client-runtime-utils").Decimal;
                                expectedCloseDate: Date | null;
                                dealValue: import("@prisma/client-runtime-utils").Decimal;
                                ownerUserId: string | null;
                                mobile: string;
                                petSpecies: string | null;
                                petCount: number | null;
                                lostReasonId: string | null;
                                lostNotes: string | null;
                                fullName: string;
                                expectedValue: import("@prisma/client-runtime-utils").Decimal;
                                closedDate: Date | null;
                                wonOwnerId: string | null;
                                slaPolicyId: string | null;
                                responseBy: Date | null;
                                firstRespondedAt: Date | null;
                                slaStatus: import("../../../../generated/prisma/enums").CrmSlaStatus | null;
                                ownerUser: {
                                    name: string;
                                    id: string;
                                } | null;
                                probabilityOverridden: boolean;
                                wonOwner: {
                                    name: string;
                                    id: string;
                                    code: string;
                                } | null;
                                lostReason: {
                                    name: string;
                                    id: string;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: "لا تملك صلاحية تعديل الصفقات";
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
    crm: {
        deals: {
            ":id": {
                products: {
                    get: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                qty: import("@prisma/client-runtime-utils").Decimal;
                                lineTotal: import("@prisma/client-runtime-utils").Decimal;
                                dealId: string;
                                itemId: string | null;
                                label: string;
                                itemType: import("../../../../generated/prisma/enums").CrmDealProductItemType;
                                unitPrice: import("@prisma/client-runtime-utils").Decimal;
                            }[];
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: "لا تملك صلاحية عرض الصفقات";
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
    crm: {
        deals: {
            ":id": {
                products: {
                    put: {
                        body: {
                            manualDealValue?: string | undefined;
                            products: {
                                itemId?: string | undefined;
                                qty: string;
                                label: string;
                                itemType: "SERVICE" | "MEMBERSHIP_PLAN" | "FREE_TEXT";
                                unitPrice: string;
                            }[];
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                owner: {
                                    name: string;
                                    id: string;
                                    code: string;
                                } | null;
                                address: string | null;
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                email: string | null;
                                phone: string | null;
                                city: string | null;
                                code: string;
                                gender: import("../../staff/staff.type").Gender | null;
                                notes: string | null;
                                status: {
                                    name: string;
                                    id: string;
                                    order: number;
                                    kind: import("../../../../generated/prisma/enums").CrmDealStatusKind;
                                    color: string;
                                };
                                firstName: string;
                                lastName: string | null;
                                sourceId: string | null;
                                products: {
                                    id: string;
                                    qty: import("@prisma/client-runtime-utils").Decimal;
                                    lineTotal: import("@prisma/client-runtime-utils").Decimal;
                                    dealId: string;
                                    itemId: string | null;
                                    label: string;
                                    itemType: import("../../../../generated/prisma/enums").CrmDealProductItemType;
                                    unitPrice: import("@prisma/client-runtime-utils").Decimal;
                                }[];
                                ownerId: string | null;
                                source: {
                                    name: string;
                                    id: string;
                                } | null;
                                leadId: string | null;
                                lead: {
                                    id: string;
                                    code: string;
                                    fullName: string;
                                } | null;
                                petNotes: string | null;
                                statusId: string;
                                probability: import("@prisma/client-runtime-utils").Decimal;
                                expectedCloseDate: Date | null;
                                dealValue: import("@prisma/client-runtime-utils").Decimal;
                                ownerUserId: string | null;
                                mobile: string;
                                petSpecies: string | null;
                                petCount: number | null;
                                lostReasonId: string | null;
                                lostNotes: string | null;
                                fullName: string;
                                expectedValue: import("@prisma/client-runtime-utils").Decimal;
                                closedDate: Date | null;
                                wonOwnerId: string | null;
                                slaPolicyId: string | null;
                                responseBy: Date | null;
                                firstRespondedAt: Date | null;
                                slaStatus: import("../../../../generated/prisma/enums").CrmSlaStatus | null;
                                ownerUser: {
                                    name: string;
                                    id: string;
                                } | null;
                                probabilityOverridden: boolean;
                                wonOwner: {
                                    name: string;
                                    id: string;
                                    code: string;
                                } | null;
                                lostReason: {
                                    name: string;
                                    id: string;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: "لا تملك صلاحية تعديل الصفقات";
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
    crm: {
        deals: {
            ":id": {
                "status-log": {
                    get: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                at: Date;
                                id: string;
                                fromStatusId: string | null;
                                toStatusId: string;
                                durationInPrevious: number | null;
                                byUserId: string | null;
                                byUser: {
                                    name: string;
                                    id: string;
                                } | null;
                            }[];
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: "لا تملك صلاحية عرض الصفقات";
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
    crm: {
        deals: {
            ":id": {
                timeline: {
                    get: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {
                            types?: string | undefined;
                            cursor?: string | undefined;
                            limit?: number | undefined;
                        };
                        headers: {};
                        response: {
                            200: import("../crm-timeline/crm-timeline.type").CrmTimelinePage;
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: "لا تملك صلاحية عرض الصفقات";
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
    crm: {
        deals: {
            ":id": {
                email: {
                    post: {
                        body: {
                            to?: string | undefined;
                            subject?: string | undefined;
                            templateId?: string | undefined;
                            body?: string | undefined;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                subject: string;
                                replyTo: string | null;
                                id: string;
                                templateId: string | null;
                                status: import("../../../../generated/prisma/enums").CrmEmailStatus;
                                body: string;
                                failureReason: string | null;
                                sentBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                toAddress: string;
                                sentAt: Date;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: "لا تملك صلاحية تعديل الصفقات";
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
    crm: {
        deals: {
            ":id": {
                "mark-responded": {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                owner: {
                                    name: string;
                                    id: string;
                                    code: string;
                                } | null;
                                address: string | null;
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                email: string | null;
                                phone: string | null;
                                city: string | null;
                                code: string;
                                gender: import("../../staff/staff.type").Gender | null;
                                notes: string | null;
                                status: {
                                    name: string;
                                    id: string;
                                    order: number;
                                    kind: import("../../../../generated/prisma/enums").CrmDealStatusKind;
                                    color: string;
                                };
                                firstName: string;
                                lastName: string | null;
                                sourceId: string | null;
                                products: {
                                    id: string;
                                    qty: import("@prisma/client-runtime-utils").Decimal;
                                    lineTotal: import("@prisma/client-runtime-utils").Decimal;
                                    dealId: string;
                                    itemId: string | null;
                                    label: string;
                                    itemType: import("../../../../generated/prisma/enums").CrmDealProductItemType;
                                    unitPrice: import("@prisma/client-runtime-utils").Decimal;
                                }[];
                                ownerId: string | null;
                                source: {
                                    name: string;
                                    id: string;
                                } | null;
                                leadId: string | null;
                                lead: {
                                    id: string;
                                    code: string;
                                    fullName: string;
                                } | null;
                                petNotes: string | null;
                                statusId: string;
                                probability: import("@prisma/client-runtime-utils").Decimal;
                                expectedCloseDate: Date | null;
                                dealValue: import("@prisma/client-runtime-utils").Decimal;
                                ownerUserId: string | null;
                                mobile: string;
                                petSpecies: string | null;
                                petCount: number | null;
                                lostReasonId: string | null;
                                lostNotes: string | null;
                                fullName: string;
                                expectedValue: import("@prisma/client-runtime-utils").Decimal;
                                closedDate: Date | null;
                                wonOwnerId: string | null;
                                slaPolicyId: string | null;
                                responseBy: Date | null;
                                firstRespondedAt: Date | null;
                                slaStatus: import("../../../../generated/prisma/enums").CrmSlaStatus | null;
                                ownerUser: {
                                    name: string;
                                    id: string;
                                } | null;
                                probabilityOverridden: boolean;
                                wonOwner: {
                                    name: string;
                                    id: string;
                                    code: string;
                                } | null;
                                lostReason: {
                                    name: string;
                                    id: string;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: "لا تملك صلاحية تعديل الصفقات";
                            };
                            404: {
                                readonly message: "الصفقة غير موجودة";
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
    crm: {
        deals: {
            ":id": {
                whatsapp: {
                    post: {
                        body: {
                            body: string;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                at: Date;
                                id: string;
                                status: import("../../../../generated/prisma/enums").CrmWhatsappStatus | null;
                                body: string;
                                referenceType: import("../../../../generated/prisma/enums").CrmReferenceType | null;
                                referenceId: string | null;
                                direction: import("../../../../generated/prisma/enums").CrmWhatsappDirection;
                                failureReason: string | null;
                                chatId: string;
                                sentBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                providerMessageId: string | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: "لا تملك صلاحية تعديل الصفقات";
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
    crm: {
        deals: {
            ":id": {
                notes: {
                    get: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                createdAt: Date;
                                title: string | null;
                                content: string;
                                authorUserId: string | null;
                                author: {
                                    name: string;
                                    id: string;
                                } | null;
                            }[];
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: "لا تملك صلاحية عرض الصفقات";
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
    crm: {
        deals: {
            ":id": {
                notes: {
                    post: {
                        body: {
                            title?: string | undefined;
                            content: string;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                createdAt: Date;
                                title: string | null;
                                content: string;
                                authorUserId: string | null;
                                author: {
                                    name: string;
                                    id: string;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: "لا تملك صلاحية تعديل الصفقات";
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
    crm: {
        deals: {
            ":id": {
                tasks: {
                    get: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                priority: import("../../../../generated/prisma/enums").CrmTaskPriority;
                                id: string;
                                createdAt: Date;
                                description: string | null;
                                title: string;
                                status: import("../../../../generated/prisma/enums").CrmTaskStatus;
                                referenceId: string;
                                assignedTo: {
                                    name: string;
                                    id: string;
                                } | null;
                                dueAt: Date | null;
                                assignedToUserId: string | null;
                            }[];
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: "لا تملك صلاحية عرض الصفقات";
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
    crm: {
        deals: {
            ":id": {
                tasks: {
                    post: {
                        body: {
                            priority?: "MEDIUM" | "LOW" | "HIGH" | undefined;
                            description?: string | undefined;
                            status?: "CANCELLED" | "IN_PROGRESS" | "DONE" | "BACKLOG" | "TODO" | undefined;
                            dueAt?: string | undefined;
                            assignedToUserId?: string | undefined;
                            title: string;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                priority: import("../../../../generated/prisma/enums").CrmTaskPriority;
                                id: string;
                                createdAt: Date;
                                description: string | null;
                                title: string;
                                status: import("../../../../generated/prisma/enums").CrmTaskStatus;
                                referenceId: string;
                                assignedTo: {
                                    name: string;
                                    id: string;
                                } | null;
                                dueAt: Date | null;
                                assignedToUserId: string | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: "لا تملك صلاحية إضافة مهمة";
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
    crm: {
        deals: {
            ":id": {
                comments: {
                    get: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                createdAt: Date;
                                content: string;
                                authorUserId: string | null;
                                author: {
                                    name: string;
                                    id: string;
                                } | null;
                                mentionedUserIds: string[];
                            }[];
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: "لا تملك صلاحية عرض الصفقات";
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
    crm: {
        deals: {
            ":id": {
                comments: {
                    post: {
                        body: {
                            mentionedUserIds?: string[] | undefined;
                            content: string;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                createdAt: Date;
                                content: string;
                                authorUserId: string | null;
                                author: {
                                    name: string;
                                    id: string;
                                } | null;
                                mentionedUserIds: string[];
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: "لا تملك صلاحية تعديل الصفقات";
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
