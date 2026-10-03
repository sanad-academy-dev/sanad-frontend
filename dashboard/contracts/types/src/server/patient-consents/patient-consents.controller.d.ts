import Elysia from "elysia";
import { ConsentStatus } from "@/generated/prisma/enums";
import { type ConsentFieldValues } from "@/server/patient-consents/patient-consents.type";
export declare const patientConsentsController: Elysia<"/patient-consents", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "patientConsents.list.query": import("@sinclair/typebox").TObject<{
            patientId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            operationCaseId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "patientConsents.templates.query": import("@sinclair/typebox").TObject<{
            speciesKey: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            activeOnly: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "patientConsents.create": import("@sinclair/typebox").TObject<{
            patientId: import("@sinclair/typebox").TString;
            templateKey: import("@sinclair/typebox").TString;
            locale: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"AR">, import("@sinclair/typebox").TLiteral<"EN">, import("@sinclair/typebox").TLiteral<"BOTH">]>>;
            operationCaseId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            appointmentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            inpatientStayId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "patientConsents.update": import("@sinclair/typebox").TObject<{
            fieldValues: import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>, import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>>;
            locale: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"AR">, import("@sinclair/typebox").TLiteral<"EN">, import("@sinclair/typebox").TLiteral<"BOTH">]>>;
        }>;
        readonly "patientConsents.sign": import("@sinclair/typebox").TObject<{
            signerName: import("@sinclair/typebox").TString;
            signerRelationship: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            signatureMethod: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAWN">, import("@sinclair/typebox").TLiteral<"TYPED">, import("@sinclair/typebox").TLiteral<"UPLOADED">, import("@sinclair/typebox").TLiteral<"VERBAL_WITNESSED">]>;
            signatureUrl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            witnessStaffId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "patientConsents.revoke": import("@sinclair/typebox").TObject<{
            reason: import("@sinclair/typebox").TString;
        }>;
        readonly "patientConsents.draftField": import("@sinclair/typebox").TObject<{
            fieldKey: import("@sinclair/typebox").TString;
        }>;
        readonly "patientConsents.extractScan": import("@sinclair/typebox").TObject<{
            imageDataUrl: import("@sinclair/typebox").TString;
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
    "patient-consents": {};
} & {
    "patient-consents": {
        templates: {
            get: {
                body: {};
                params: {};
                query: {
                    activeOnly?: boolean | undefined;
                    speciesKey?: string | undefined;
                };
                headers: {};
                response: {
                    200: {
                        type: import("@/generated/prisma/enums").ConsentType;
                        version: number;
                        key: string;
                        id: string;
                        isDefault: boolean;
                        active: boolean;
                        titleAr: string;
                        titleEn: string;
                        defaultLocale: import("@/generated/prisma/enums").ConsentLocale;
                        speciesKey: string | null;
                    }[];
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
    "patient-consents": {
        prices: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: import("@/server/patient-consents/consent-render.service").ConsentPriceMap;
                    401: {
                        readonly message: "غير مصرح";
                    };
                };
            };
        };
    };
} & {
    "patient-consents": {
        get: {
            body: {};
            params: {};
            query: {
                patientId?: string | undefined;
                operationCaseId?: string | undefined;
            };
            headers: {};
            response: {
                200: {
                    type: import("@/generated/prisma/enums").ConsentType;
                    owner: {
                        name: string;
                        id: string;
                        phone: string;
                    };
                    patient: {
                        name: string;
                        id: string;
                        code: string;
                    };
                    id: string;
                    createdAt: Date;
                    status: ConsentStatus;
                    appointmentId: string | null;
                    locale: import("@/generated/prisma/enums").ConsentLocale;
                    operationCaseId: string | null;
                    templateKey: string;
                    templateVersion: number;
                    revokedAt: Date | null;
                    signerName: string | null;
                    signedAt: Date | null;
                    revokeReason: string | null;
                    extractedByAi: boolean;
                }[];
                400: {
                    readonly message: "حدّد الطفل أو حالة العملية";
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
} & {
    "patient-consents": {
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
                        type: import("@/generated/prisma/enums").ConsentType;
                        owner: {
                            name: string;
                            id: string;
                            phone: string;
                        };
                        patient: {
                            name: string;
                            id: string;
                            code: string;
                        };
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        status: ConsentStatus;
                        appointmentId: string | null;
                        locale: import("@/generated/prisma/enums").ConsentLocale;
                        template: {
                            version: number;
                            key: string;
                            id: string;
                            blocks: import("@prisma/client/runtime/client").JsonValue;
                            titleAr: string;
                            titleEn: string;
                            defaultLocale: import("@/generated/prisma/enums").ConsentLocale;
                            speciesKey: string | null;
                        } | null;
                        operationCaseId: string | null;
                        signatureUrl: string | null;
                        templateKey: string;
                        templateVersion: number;
                        revokedAt: Date | null;
                        fieldValues: import("@prisma/client/runtime/client").JsonValue;
                        textSnapshot: string;
                        signerName: string | null;
                        signerRelationship: string | null;
                        signatureMethod: import("@/generated/prisma/enums").SignatureMethod | null;
                        signedAt: Date | null;
                        revokeReason: string | null;
                        sourceScanUrl: string | null;
                        extractedByAi: boolean;
                        witnessStaff: {
                            name: string;
                            id: string;
                        } | null;
                        signedByStaff: {
                            name: string;
                            id: string;
                        } | null;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    404: {
                        readonly message: "الموافقة غير موجودة";
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
    "patient-consents": {
        post: {
            body: {
                appointmentId?: string | null | undefined;
                inpatientStayId?: string | null | undefined;
                locale?: "BOTH" | "AR" | "EN" | undefined;
                operationCaseId?: string | null | undefined;
                patientId: string;
                templateKey: string;
            };
            params: {};
            query: {};
            headers: {};
            response: {
                200: {
                    type: import("@/generated/prisma/enums").ConsentType;
                    owner: {
                        name: string;
                        id: string;
                        phone: string;
                    };
                    patient: {
                        name: string;
                        id: string;
                        code: string;
                    };
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    status: ConsentStatus;
                    appointmentId: string | null;
                    locale: import("@/generated/prisma/enums").ConsentLocale;
                    template: {
                        version: number;
                        key: string;
                        id: string;
                        blocks: import("@prisma/client/runtime/client").JsonValue;
                        titleAr: string;
                        titleEn: string;
                        defaultLocale: import("@/generated/prisma/enums").ConsentLocale;
                        speciesKey: string | null;
                    } | null;
                    operationCaseId: string | null;
                    signatureUrl: string | null;
                    templateKey: string;
                    templateVersion: number;
                    revokedAt: Date | null;
                    fieldValues: import("@prisma/client/runtime/client").JsonValue;
                    textSnapshot: string;
                    signerName: string | null;
                    signerRelationship: string | null;
                    signatureMethod: import("@/generated/prisma/enums").SignatureMethod | null;
                    signedAt: Date | null;
                    revokeReason: string | null;
                    sourceScanUrl: string | null;
                    extractedByAi: boolean;
                    witnessStaff: {
                        name: string;
                        id: string;
                    } | null;
                    signedByStaff: {
                        name: string;
                        id: string;
                    } | null;
                };
                400: {
                    readonly message: "لا يمكن إنشاء موافقة لطفل بلا وليّ أمر";
                };
                401: {
                    readonly message: "غير مصرح";
                };
                404: {
                    readonly message: "القالب غير موجود";
                } | {
                    readonly message: "الطفل غير موجود";
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
    "patient-consents": {
        ":id": {
            patch: {
                body: {
                    locale?: "BOTH" | "AR" | "EN" | undefined;
                    fieldValues: {
                        [x: string]: string | boolean | string[] | null;
                    };
                };
                params: {
                    id: string;
                };
                query: {};
                headers: {};
                response: {
                    200: {
                        type: import("@/generated/prisma/enums").ConsentType;
                        owner: {
                            name: string;
                            id: string;
                            phone: string;
                        };
                        patient: {
                            name: string;
                            id: string;
                            code: string;
                        };
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        status: ConsentStatus;
                        appointmentId: string | null;
                        locale: import("@/generated/prisma/enums").ConsentLocale;
                        template: {
                            version: number;
                            key: string;
                            id: string;
                            blocks: import("@prisma/client/runtime/client").JsonValue;
                            titleAr: string;
                            titleEn: string;
                            defaultLocale: import("@/generated/prisma/enums").ConsentLocale;
                            speciesKey: string | null;
                        } | null;
                        operationCaseId: string | null;
                        signatureUrl: string | null;
                        templateKey: string;
                        templateVersion: number;
                        revokedAt: Date | null;
                        fieldValues: import("@prisma/client/runtime/client").JsonValue;
                        textSnapshot: string;
                        signerName: string | null;
                        signerRelationship: string | null;
                        signatureMethod: import("@/generated/prisma/enums").SignatureMethod | null;
                        signedAt: Date | null;
                        revokeReason: string | null;
                        sourceScanUrl: string | null;
                        extractedByAi: boolean;
                        witnessStaff: {
                            name: string;
                            id: string;
                        } | null;
                        signedByStaff: {
                            name: string;
                            id: string;
                        } | null;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    404: {
                        readonly message: "الموافقة غير موجودة";
                    };
                    409: {
                        readonly message: "الموافقة الموقَّعة لا تُعدَّل — أنشئ موافقة جديدة";
                    } | {
                        readonly message: "قالب الموافقة غير متاح";
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
    "patient-consents": {
        ":id": {
            sign: {
                post: {
                    body: {
                        signatureUrl?: string | null | undefined;
                        signerRelationship?: string | null | undefined;
                        witnessStaffId?: string | null | undefined;
                        signerName: string;
                        signatureMethod: "DRAWN" | "TYPED" | "UPLOADED" | "VERBAL_WITNESSED";
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            type: import("@/generated/prisma/enums").ConsentType;
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                            };
                            patient: {
                                name: string;
                                id: string;
                                code: string;
                            };
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            status: ConsentStatus;
                            appointmentId: string | null;
                            locale: import("@/generated/prisma/enums").ConsentLocale;
                            template: {
                                version: number;
                                key: string;
                                id: string;
                                blocks: import("@prisma/client/runtime/client").JsonValue;
                                titleAr: string;
                                titleEn: string;
                                defaultLocale: import("@/generated/prisma/enums").ConsentLocale;
                                speciesKey: string | null;
                            } | null;
                            operationCaseId: string | null;
                            signatureUrl: string | null;
                            templateKey: string;
                            templateVersion: number;
                            revokedAt: Date | null;
                            fieldValues: import("@prisma/client/runtime/client").JsonValue;
                            textSnapshot: string;
                            signerName: string | null;
                            signerRelationship: string | null;
                            signatureMethod: import("@/generated/prisma/enums").SignatureMethod | null;
                            signedAt: Date | null;
                            revokeReason: string | null;
                            sourceScanUrl: string | null;
                            extractedByAi: boolean;
                            witnessStaff: {
                                name: string;
                                id: string;
                            } | null;
                            signedByStaff: {
                                name: string;
                                id: string;
                            } | null;
                        };
                        400: {
                            readonly message: `\u0623\u0643\u0645\u0644 \u0627\u0644\u062D\u0642\u0648\u0644 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629: ${string}`;
                        } | {
                            readonly message: "الموافقة الشفهية تتطلب شاهدًا";
                        } | {
                            readonly message: "التوقيع المرسوم أو المرفوع يتطلب صورة";
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الموافقة غير موجودة";
                        };
                        409: {
                            readonly message: "الموافقة موقَّعة بالفعل";
                        } | {
                            readonly message: "الموافقة مُبطلة — أنشئ موافقة جديدة";
                        } | {
                            readonly message: "قالب الموافقة غير متاح";
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
    "patient-consents": {
        ":id": {
            revoke: {
                post: {
                    body: {
                        reason: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            type: import("@/generated/prisma/enums").ConsentType;
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                            };
                            patient: {
                                name: string;
                                id: string;
                                code: string;
                            };
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            status: ConsentStatus;
                            appointmentId: string | null;
                            locale: import("@/generated/prisma/enums").ConsentLocale;
                            template: {
                                version: number;
                                key: string;
                                id: string;
                                blocks: import("@prisma/client/runtime/client").JsonValue;
                                titleAr: string;
                                titleEn: string;
                                defaultLocale: import("@/generated/prisma/enums").ConsentLocale;
                                speciesKey: string | null;
                            } | null;
                            operationCaseId: string | null;
                            signatureUrl: string | null;
                            templateKey: string;
                            templateVersion: number;
                            revokedAt: Date | null;
                            fieldValues: import("@prisma/client/runtime/client").JsonValue;
                            textSnapshot: string;
                            signerName: string | null;
                            signerRelationship: string | null;
                            signatureMethod: import("@/generated/prisma/enums").SignatureMethod | null;
                            signedAt: Date | null;
                            revokeReason: string | null;
                            sourceScanUrl: string | null;
                            extractedByAi: boolean;
                            witnessStaff: {
                                name: string;
                                id: string;
                            } | null;
                            signedByStaff: {
                                name: string;
                                id: string;
                            } | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الموافقة غير موجودة";
                        };
                        409: {
                            readonly message: "لا تُبطل إلا موافقة موقَّعة";
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
    "patient-consents": {
        ":id": {
            "draft-field": {
                post: {
                    body: {
                        fieldKey: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            text: string;
                        };
                        400: {
                            readonly message: "هذا الحقل لا يقبل صياغة آلية";
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الموافقة غير موجودة";
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
                            readonly message: "تعذّر توليد المسودّة — حاول مجددًا";
                        };
                    };
                };
            };
        };
    };
} & {
    "patient-consents": {
        ":id": {
            "extract-scan": {
                post: {
                    body: {
                        imageDataUrl: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            ok: true;
                            fieldValues: ConsentFieldValues;
                            unreadableKeys: string[];
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الموافقة غير موجودة";
                        };
                        409: {
                            readonly message: "الموافقة الموقَّعة لا تُعدَّل";
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
                            readonly message: "تعذّر قراءة النموذج — حاول بصورة أوضح";
                        };
                    };
                };
            };
        };
    };
} & {
    "patient-consents": {
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
                        id: string;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    404: {
                        readonly message: "الموافقة غير موجودة";
                    };
                    409: {
                        readonly message: "الموافقة الموقَّعة تُبطل ولا تُحذف";
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
