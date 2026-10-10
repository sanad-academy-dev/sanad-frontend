import Elysia from "elysia";
export declare const sopsController: Elysia<"/sops", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "sops.saveTemplate": import("@sinclair/typebox").TObject<{
            domain: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LAB">, import("@sinclair/typebox").TLiteral<"RADIOLOGY">, import("@sinclair/typebox").TLiteral<"OPERATION">]>;
            serviceId: import("@sinclair/typebox").TString;
            titleAr: import("@sinclair/typebox").TString;
            titleEn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            reference: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            sections: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                titleAr: import("@sinclair/typebox").TString;
                titleEn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                steps: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                    textAr: import("@sinclair/typebox").TString;
                    textEn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                    ownerRole: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                    duration: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                    critical: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                    required: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                    note: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                    responseType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"CONFIRM">, import("@sinclair/typebox").TLiteral<"YES_NO_NA">, import("@sinclair/typebox").TLiteral<"TEXT">, import("@sinclair/typebox").TLiteral<"NUMBER">]>>;
                }>>;
            }>>;
        }>;
        readonly "sops.domainQuery": import("@sinclair/typebox").TObject<{
            domain: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LAB">, import("@sinclair/typebox").TLiteral<"RADIOLOGY">, import("@sinclair/typebox").TLiteral<"OPERATION">]>;
        }>;
        readonly "sops.runQuery": import("@sinclair/typebox").TObject<{
            labItemId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            radiologyItemId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            operationCaseId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "sops.ensureRun": import("@sinclair/typebox").TObject<{
            domain: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LAB">, import("@sinclair/typebox").TLiteral<"RADIOLOGY">, import("@sinclair/typebox").TLiteral<"OPERATION">]>;
            serviceId: import("@sinclair/typebox").TString;
            labItemId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            radiologyItemId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            operationCaseId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "sops.respondStep": import("@sinclair/typebox").TObject<{
            response: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"CONFIRMED">, import("@sinclair/typebox").TLiteral<"YES">, import("@sinclair/typebox").TLiteral<"NO">, import("@sinclair/typebox").TLiteral<"NA">]>]>;
            valueText: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            valueNumber: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
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
    sops: {};
} & {
    sops: {
        library: {
            get: {
                body: {};
                params: {};
                query: {
                    domain: "LAB" | "RADIOLOGY" | "OPERATION";
                };
                headers: {};
                response: {
                    200: import("@/server/sops/sops.type").SopLibraryRowResponse[];
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
    sops: {
        runs: {
            get: {
                body: {};
                params: {};
                query: {
                    operationCaseId?: string | undefined;
                    labItemId?: string | undefined;
                    radiologyItemId?: string | undefined;
                };
                headers: {};
                response: {
                    200: {
                        run: {
                            id: string;
                            createdAt: Date;
                            templateId: string;
                            steps: {
                                id: string;
                                order: number;
                                duration: string | null;
                                required: boolean;
                                response: import("../../../generated/prisma/enums").ChecklistItemResponse | null;
                                responseType: import("../../../generated/prisma/enums").ChecklistResponseType;
                                textSnapshot: string;
                                valueText: string | null;
                                valueNumber: import("@prisma/client-runtime-utils").Decimal | null;
                                respondedAt: Date | null;
                                ownerRole: string | null;
                                critical: boolean;
                                sectionTitle: string;
                                respondedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                            }[];
                            completedAt: Date | null;
                            operationCaseId: string | null;
                            templateVersion: number;
                            domain: import("../../../generated/prisma/enums").SopDomain;
                            labItemId: string | null;
                            radiologyItemId: string | null;
                        } | null;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    422: {
                        readonly message: "حدّد هدف البروتوكول (تحليل أو فحص أشعة أو حالة عملية)";
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
} & {
    sops: {
        runs: {
            post: {
                body: {
                    operationCaseId?: string | undefined;
                    labItemId?: string | undefined;
                    radiologyItemId?: string | undefined;
                    serviceId: string;
                    domain: "LAB" | "RADIOLOGY" | "OPERATION";
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        id: string;
                        createdAt: Date;
                        templateId: string;
                        steps: {
                            id: string;
                            order: number;
                            duration: string | null;
                            required: boolean;
                            response: import("../../../generated/prisma/enums").ChecklistItemResponse | null;
                            responseType: import("../../../generated/prisma/enums").ChecklistResponseType;
                            textSnapshot: string;
                            valueText: string | null;
                            valueNumber: import("@prisma/client-runtime-utils").Decimal | null;
                            respondedAt: Date | null;
                            ownerRole: string | null;
                            critical: boolean;
                            sectionTitle: string;
                            respondedBy: {
                                name: string;
                                id: string;
                            } | null;
                        }[];
                        completedAt: Date | null;
                        operationCaseId: string | null;
                        templateVersion: number;
                        domain: import("../../../generated/prisma/enums").SopDomain;
                        labItemId: string | null;
                        radiologyItemId: string | null;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    404: {
                        readonly message: string;
                    };
                    422: {
                        readonly message: "حدّد هدف البروتوكول (تحليل أو فحص أشعة أو حالة عملية)";
                    } | {
                        readonly message: string;
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
} & {
    sops: {
        runs: {
            ":runId": {
                steps: {
                    ":stepId": {
                        post: {
                            body: {
                                valueText?: string | null | undefined;
                                valueNumber?: number | null | undefined;
                                response: "CONFIRMED" | "NA" | "NO" | "YES" | null;
                            };
                            params: {
                                runId: string;
                                stepId: string;
                            };
                            query: {};
                            headers: {};
                            response: {
                                200: {
                                    id: string;
                                    createdAt: Date;
                                    templateId: string;
                                    steps: {
                                        id: string;
                                        order: number;
                                        duration: string | null;
                                        required: boolean;
                                        response: import("../../../generated/prisma/enums").ChecklistItemResponse | null;
                                        responseType: import("../../../generated/prisma/enums").ChecklistResponseType;
                                        textSnapshot: string;
                                        valueText: string | null;
                                        valueNumber: import("@prisma/client-runtime-utils").Decimal | null;
                                        respondedAt: Date | null;
                                        ownerRole: string | null;
                                        critical: boolean;
                                        sectionTitle: string;
                                        respondedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                    }[];
                                    completedAt: Date | null;
                                    operationCaseId: string | null;
                                    templateVersion: number;
                                    domain: import("../../../generated/prisma/enums").SopDomain;
                                    labItemId: string | null;
                                    radiologyItemId: string | null;
                                };
                                401: {
                                    readonly message: "غير مصرح";
                                };
                                404: {
                                    readonly message: string;
                                };
                                422: {
                                    readonly message: string;
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
        };
    };
} & {
    sops: {
        runs: {
            ":runId": {
                complete: {
                    post: {
                        body: {};
                        params: {
                            runId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                createdAt: Date;
                                templateId: string;
                                steps: {
                                    id: string;
                                    order: number;
                                    duration: string | null;
                                    required: boolean;
                                    response: import("../../../generated/prisma/enums").ChecklistItemResponse | null;
                                    responseType: import("../../../generated/prisma/enums").ChecklistResponseType;
                                    textSnapshot: string;
                                    valueText: string | null;
                                    valueNumber: import("@prisma/client-runtime-utils").Decimal | null;
                                    respondedAt: Date | null;
                                    ownerRole: string | null;
                                    critical: boolean;
                                    sectionTitle: string;
                                    respondedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                                completedAt: Date | null;
                                operationCaseId: string | null;
                                templateVersion: number;
                                domain: import("../../../generated/prisma/enums").SopDomain;
                                labItemId: string | null;
                                radiologyItemId: string | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                readonly message: string;
                            };
                            422: {
                                readonly message: string;
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
    };
} & {
    sops: {
        templates: {
            post: {
                body: {
                    reference?: string | null | undefined;
                    titleEn?: string | null | undefined;
                    serviceId: string;
                    titleAr: string;
                    sections: {
                        titleEn?: string | null | undefined;
                        steps: {
                            duration?: string | null | undefined;
                            required?: boolean | undefined;
                            note?: string | null | undefined;
                            textEn?: string | null | undefined;
                            responseType?: "TEXT" | "CONFIRM" | "YES_NO_NA" | "NUMBER" | undefined;
                            ownerRole?: string | null | undefined;
                            critical?: boolean | undefined;
                            textAr: string;
                        }[];
                        titleAr: string;
                    }[];
                    domain: "LAB" | "RADIOLOGY" | "OPERATION";
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        service: {
                            level: import("../../../generated/prisma/enums").ServiceLevel;
                            name: string;
                            id: string;
                            parentId: string | null;
                        };
                        version: number;
                        id: string;
                        clinicId: string | null;
                        updatedAt: Date;
                        active: boolean;
                        serviceId: string;
                        reference: string | null;
                        titleAr: string;
                        titleEn: string | null;
                        sections: {
                            id: string;
                            order: number;
                            steps: {
                                id: string;
                                order: number;
                                duration: string | null;
                                required: boolean;
                                note: string | null;
                                textAr: string;
                                textEn: string | null;
                                responseType: import("../../../generated/prisma/enums").ChecklistResponseType;
                                ownerRole: string | null;
                                critical: boolean;
                            }[];
                            titleAr: string;
                            titleEn: string | null;
                        }[];
                        domain: import("../../../generated/prisma/enums").SopDomain;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    404: {
                        readonly message: string;
                    };
                    422: {
                        readonly message: string;
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
} & {
    sops: {
        service: {
            ":serviceId": {
                get: {
                    body: {};
                    params: {
                        serviceId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: import("@/server/sops/sops.type").ResolvedSopResponse;
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: string;
                        };
                        422: {
                            readonly message: string;
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
    sops: {
        service: {
            ":serviceId": {
                delete: {
                    body: {};
                    params: {
                        serviceId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            reverted: number;
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
