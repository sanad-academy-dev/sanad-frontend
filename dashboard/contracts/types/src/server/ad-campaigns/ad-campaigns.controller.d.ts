import Elysia from "elysia";
export declare const adCampaignsController: Elysia<"/ad-campaigns", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "ad-campaigns.create": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            platform: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"FACEBOOK">, import("@sinclair/typebox").TLiteral<"INSTAGRAM">]>;
            objective: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"BRAND_AWARENESS">, import("@sinclair/typebox").TLiteral<"LEAD_GENERATION">, import("@sinclair/typebox").TLiteral<"STORE_VISITS">, import("@sinclair/typebox").TLiteral<"CUSTOMER_FEEDBACK">, import("@sinclair/typebox").TLiteral<"SALES">, import("@sinclair/typebox").TLiteral<"PRODUCT_AWARENESS">]>;
            socialAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            branchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "ad-campaigns.update": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            platform: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"FACEBOOK">, import("@sinclair/typebox").TLiteral<"INSTAGRAM">]>>;
            objective: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"BRAND_AWARENESS">, import("@sinclair/typebox").TLiteral<"LEAD_GENERATION">, import("@sinclair/typebox").TLiteral<"STORE_VISITS">, import("@sinclair/typebox").TLiteral<"CUSTOMER_FEEDBACK">, import("@sinclair/typebox").TLiteral<"SALES">, import("@sinclair/typebox").TLiteral<"PRODUCT_AWARENESS">]>>;
            socialAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            branchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            audienceId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "ad-campaigns.status": import("@sinclair/typebox").TObject<{
            status: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAFT">, import("@sinclair/typebox").TLiteral<"PENDING">, import("@sinclair/typebox").TLiteral<"SCHEDULED">, import("@sinclair/typebox").TLiteral<"ACTIVE">, import("@sinclair/typebox").TLiteral<"PAUSED">, import("@sinclair/typebox").TLiteral<"COMPLETED">, import("@sinclair/typebox").TLiteral<"FAILED">]>;
        }>;
        readonly "ad-campaigns.schedule": import("@sinclair/typebox").TObject<{
            startsAt: import("@sinclair/typebox").TString;
            endsAt: import("@sinclair/typebox").TString;
            budgetKind: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DAILY">, import("@sinclair/typebox").TLiteral<"LIFETIME">]>;
            budgetAmount: import("@sinclair/typebox").TNumber;
            currency: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "ad-campaigns.creative": import("@sinclair/typebox").TObject<{
            primaryText: import("@sinclair/typebox").TString;
            headline: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            linkUrl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            imageUrl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            source: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"AI_GENERATED">, import("@sinclair/typebox").TLiteral<"LIBRARY">, import("@sinclair/typebox").TLiteral<"UPLOAD">, import("@sinclair/typebox").TLiteral<"TEMPLATE">]>;
            aiPrompt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            aiStyle: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            toneFormal: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            toneFriendly: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            toneOptimist: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
        }>;
        readonly "ad-campaigns.list": import("@sinclair/typebox").TObject<{
            search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            platform: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"FACEBOOK">, import("@sinclair/typebox").TLiteral<"INSTAGRAM">, import("@sinclair/typebox").TLiteral<"LINKEDIN">, import("@sinclair/typebox").TLiteral<"TIKTOK">, import("@sinclair/typebox").TLiteral<"X">, import("@sinclair/typebox").TLiteral<"PINTEREST">, import("@sinclair/typebox").TLiteral<"SNAPCHAT">]>>;
            status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAFT">, import("@sinclair/typebox").TLiteral<"PENDING">, import("@sinclair/typebox").TLiteral<"SCHEDULED">, import("@sinclair/typebox").TLiteral<"ACTIVE">, import("@sinclair/typebox").TLiteral<"PAUSED">, import("@sinclair/typebox").TLiteral<"COMPLETED">, import("@sinclair/typebox").TLiteral<"FAILED">]>>;
            branchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
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
            }, 401> | import("elysia").ElysiaCustomStatusResponse<403, {
                readonly message: "لا تملك صلاحية عرض الحملات الاعلانية";
            }, 403> | {
                scopeAll: boolean;
                scopeBranchId: string | null;
                clinicId: string;
                userId: string;
                isAdmin: boolean;
                permissions: string[];
            }>;
        };
    };
    parser: {};
    response: {};
}, {
    "ad-campaigns": {};
} & {
    "ad-campaigns": {
        get: {
            body: {};
            params: {};
            query: {
                search?: string | undefined;
                branchId?: string | undefined;
                status?: "PENDING" | "ACTIVE" | "DRAFT" | "COMPLETED" | "FAILED" | "SCHEDULED" | "PAUSED" | undefined;
                platform?: "FACEBOOK" | "INSTAGRAM" | "LINKEDIN" | "TIKTOK" | "X" | "PINTEREST" | "SNAPCHAT" | undefined;
            };
            headers: {};
            response: {
                200: import("./ad-campaigns.type").AdCampaignListItem[];
                401: {
                    readonly message: "غير مصرح";
                };
                403: {
                    readonly message: "لا تملك صلاحية عرض الحملات الاعلانية";
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
} & {
    "ad-campaigns": {
        summary: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: import("./ad-campaigns.type").AdCampaignSummary;
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض الحملات الاعلانية";
                    };
                };
            };
        };
    };
} & {
    "ad-campaigns": {
        ":id": {
            get: {
                body: {};
                params: {
                    id: string;
                };
                query: {};
                headers: {};
                response: {
                    200: import("./ad-campaigns.type").AdCampaignDetail;
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض الحملات الاعلانية";
                    };
                    404: {
                        readonly message: "الحملة غير موجودة";
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
    "ad-campaigns": {
        post: {
            body: {
                branchId?: string | null | undefined;
                socialAccountId?: string | null | undefined;
                name: string;
                objective: "SALES" | "BRAND_AWARENESS" | "LEAD_GENERATION" | "STORE_VISITS" | "CUSTOMER_FEEDBACK" | "PRODUCT_AWARENESS";
                platform: "FACEBOOK" | "INSTAGRAM";
            };
            params: {};
            query: {};
            headers: {};
            response: {
                201: {
                    currency: string;
                    name: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    code: string;
                    branchId: string | null;
                    status: import("../../../generated/prisma/enums").AdCampaignStatus;
                    budgetAmount: import("@prisma/client-runtime-utils").Decimal | null;
                    totalAmount: import("@prisma/client-runtime-utils").Decimal | null;
                    startsAt: Date | null;
                    durationDays: number | null;
                    objective: import("../../../generated/prisma/enums").AdObjective;
                    createdByUserId: string | null;
                    platform: import("../../../generated/prisma/enums").AdPlatform;
                    endsAt: Date | null;
                    launchedAt: Date | null;
                    socialAccount: {
                        name: string;
                        id: string;
                        platform: import("../../../generated/prisma/enums").AdPlatform;
                    } | null;
                    audience: {
                        name: string;
                        id: string;
                        estimatedReach: number | null;
                    } | null;
                    budgetKind: import("../../../generated/prisma/enums").AdBudgetKind | null;
                    feeAmount: import("@prisma/client-runtime-utils").Decimal | null;
                    externalId: string | null;
                    externalError: string | null;
                    creatives: {
                        id: string;
                        description: string | null;
                        source: import("../../../generated/prisma/enums").AdCreativeSource;
                        primaryText: string;
                        headline: string | null;
                        linkUrl: string | null;
                        imageUrl: string | null;
                        aiPrompt: string | null;
                        aiStyle: string | null;
                        toneFormal: number | null;
                        toneFriendly: number | null;
                        toneOptimist: number | null;
                    }[];
                };
                401: {
                    readonly message: "غير مصرح";
                };
                403: {
                    readonly message: "لا تملك صلاحية عرض الحملات الاعلانية";
                } | {
                    readonly message: "لا تملك صلاحية إنشاء حملة اعلانية";
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
} & {
    "ad-campaigns": {
        ":id": {
            patch: {
                body: {
                    name?: string | undefined;
                    branchId?: string | null | undefined;
                    objective?: "SALES" | "BRAND_AWARENESS" | "LEAD_GENERATION" | "STORE_VISITS" | "CUSTOMER_FEEDBACK" | "PRODUCT_AWARENESS" | undefined;
                    platform?: "FACEBOOK" | "INSTAGRAM" | undefined;
                    socialAccountId?: string | null | undefined;
                    audienceId?: string | null | undefined;
                };
                params: {
                    id: string;
                };
                query: {};
                headers: {};
                response: {
                    200: import("./ad-campaigns.type").AdCampaignDetail;
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض الحملات الاعلانية";
                    } | {
                        readonly message: "لا تملك صلاحية تعديل الحملات الاعلانية";
                    };
                    404: {
                        readonly message: "الحملة غير موجودة";
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
    "ad-campaigns": {
        ":id": {
            status: {
                patch: {
                    body: {
                        status: "PENDING" | "ACTIVE" | "DRAFT" | "COMPLETED" | "FAILED" | "SCHEDULED" | "PAUSED";
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: import("./ad-campaigns.type").AdCampaignDetail;
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض الحملات الاعلانية";
                        } | {
                            readonly message: "لا تملك صلاحية تغيير حالة الحملة";
                        };
                        404: {
                            readonly message: "الحملة غير موجودة";
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
    "ad-campaigns": {
        ":id": {
            schedule: {
                patch: {
                    body: {
                        currency?: string | undefined;
                        budgetAmount: number;
                        startsAt: string;
                        endsAt: string;
                        budgetKind: "DAILY" | "LIFETIME";
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: import("./ad-campaigns.type").AdCampaignDetail;
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض الحملات الاعلانية";
                        } | {
                            readonly message: "لا تملك صلاحية تعديل الحملات الاعلانية";
                        };
                        404: {
                            readonly message: "الحملة غير موجودة";
                        };
                        422: {
                            readonly message: "تاريخ النهاية قبل تاريخ البداية";
                        } | {
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
    "ad-campaigns": {
        ":id": {
            readiness: {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: import("@/server/ad-campaigns/campaign-launcher").LaunchReadiness;
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض الحملات الاعلانية";
                        };
                        404: {
                            readonly message: "الحملة غير موجودة";
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
    "ad-campaigns": {
        ":id": {
            launch: {
                post: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            campaign: import("./ad-campaigns.type").AdCampaignDetail;
                            summary: string;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض الحملات الاعلانية";
                        } | {
                            readonly message: "لا تملك صلاحية إطلاق الحملات الاعلانية";
                        };
                        404: {
                            readonly message: "الحملة غير موجودة";
                        };
                        409: {
                            readonly message: "الحملة أُطلقت من قبل";
                        };
                        422: {
                            readonly message: `\u0627\u0644\u062D\u0645\u0644\u0629 \u063A\u064A\u0631 \u0645\u0643\u062A\u0645\u0644\u0629 \u2014 \u064A\u0646\u0642\u0635\u0647\u0627: ${string}`;
                        } | {
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
    "ad-campaigns": {
        ":id": {
            creative: {
                put: {
                    body: {
                        description?: string | null | undefined;
                        headline?: string | null | undefined;
                        linkUrl?: string | null | undefined;
                        imageUrl?: string | null | undefined;
                        aiPrompt?: string | null | undefined;
                        aiStyle?: string | null | undefined;
                        toneFormal?: number | null | undefined;
                        toneFriendly?: number | null | undefined;
                        toneOptimist?: number | null | undefined;
                        source: "AI_GENERATED" | "LIBRARY" | "UPLOAD" | "TEMPLATE";
                        primaryText: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: import("./ad-campaigns.type").AdCampaignDetail;
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض الحملات الاعلانية";
                        } | {
                            readonly message: "لا تملك صلاحية تعديل الحملات الاعلانية";
                        };
                        404: {
                            readonly message: "الحملة غير موجودة";
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
    "ad-campaigns": {
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
                        readonly message: "لا تملك صلاحية عرض الحملات الاعلانية";
                    } | {
                        readonly message: "لا تملك صلاحية حذف الحملات الاعلانية";
                    };
                    404: {
                        readonly message: "الحملة غير موجودة";
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
