import Elysia from "elysia";
import { LabTestStatus } from "@/generated/prisma/enums";
export declare const labTestsController: Elysia<"/lab-tests", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "labTests.create": import("@sinclair/typebox").TObject<{
            branchId: import("@sinclair/typebox").TString;
            patientId: import("@sinclair/typebox").TString;
            ownerId: import("@sinclair/typebox").TString;
            serviceIds: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
            appointmentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            inpatientStayId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            assignedToId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            requestedById: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            priority: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LOW">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"HIGH">, import("@sinclair/typebox").TLiteral<"URGENT">]>]>>;
            isUrgent: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            origin: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"VISIT">, import("@sinclair/typebox").TLiteral<"DIRECT">]>>;
        }>;
        readonly "labTests.updateStatus": import("@sinclair/typebox").TObject<{
            status: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"QUEUE">, import("@sinclair/typebox").TLiteral<"SCHEDULED">, import("@sinclair/typebox").TLiteral<"SAMPLE_COLLECTION">, import("@sinclair/typebox").TLiteral<"IN_LAB">, import("@sinclair/typebox").TLiteral<"UNDER_REVIEW">, import("@sinclair/typebox").TLiteral<"COMPLETED">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>;
        }>;
        readonly "labTests.updateStage": import("@sinclair/typebox").TObject<{
            sampleStage: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NOT_COLLECTED">, import("@sinclair/typebox").TLiteral<"COLLECTED">, import("@sinclair/typebox").TLiteral<"QUALITY_CHECK">, import("@sinclair/typebox").TLiteral<"LABEL_PRINT">, import("@sinclair/typebox").TLiteral<"ANALYZER_ASSIGNMENT">, import("@sinclair/typebox").TLiteral<"HANDOVER_SUMMARY">, import("@sinclair/typebox").TLiteral<"ANALYZING">, import("@sinclair/typebox").TLiteral<"RESULTS_READY">]>;
        }>;
        readonly "labTests.assign": import("@sinclair/typebox").TObject<{
            assignedToId: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>;
        }>;
        readonly "labTests.saveResults": import("@sinclair/typebox").TObject<{
            results: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                parameterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                section: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                name: import("@sinclair/typebox").TString;
                unit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                refLow: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
                refHigh: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
                value: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                order: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            }>>;
        }>;
        readonly "labTests.reject": import("@sinclair/typebox").TObject<{
            reason: import("@sinclair/typebox").TString;
        }>;
        readonly "labTests.decline": import("@sinclair/typebox").TObject<{
            reason: import("@sinclair/typebox").TString;
        }>;
        readonly "labTests.preAnalytical": import("@sinclair/typebox").TObject<{
            fastingStatus: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"FASTED">, import("@sinclair/typebox").TLiteral<"PARTIAL">, import("@sinclair/typebox").TLiteral<"NOT_FASTED">]>]>>;
            fastingHours: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            medications: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            ivFluids24h: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TBoolean]>>;
        }>;
        readonly "labTests.collection": import("@sinclair/typebox").TObject<{
            tubeType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"EDTA">, import("@sinclair/typebox").TLiteral<"SST">, import("@sinclair/typebox").TLiteral<"CITRATE">, import("@sinclair/typebox").TLiteral<"HEPARIN">, import("@sinclair/typebox").TLiteral<"URINE">, import("@sinclair/typebox").TLiteral<"SWAB">]>]>>;
            collectedById: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            drawSite: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            volumeMl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            attempts: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            collectedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            quality: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"EXCELLENT">, import("@sinclair/typebox").TLiteral<"GOOD">, import("@sinclair/typebox").TLiteral<"ACCEPTABLE">, import("@sinclair/typebox").TLiteral<"REJECTED">]>]>>;
            collectionNotes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "labTests.handover": import("@sinclair/typebox").TObject<{
            labelsPrinted: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        readonly "labTests.confirm": import("@sinclair/typebox").TObject<{
            assignedToId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            priority: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LOW">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"HIGH">, import("@sinclair/typebox").TLiteral<"URGENT">]>]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "labTests.reviewQc": import("@sinclair/typebox").TObject<{
            rules: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
        }>;
        readonly "labTests.approve": import("@sinclair/typebox").TObject<{
            report: import("@sinclair/typebox").TString;
            mentionedStaffIds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        }>;
        readonly "labTests.saveReport": import("@sinclair/typebox").TObject<{
            report: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>;
            mentionedStaffIds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        }>;
        readonly "labTests.updatePriority": import("@sinclair/typebox").TObject<{
            priority: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LOW">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"HIGH">, import("@sinclair/typebox").TLiteral<"URGENT">]>]>;
        }>;
        readonly "labTests.assignAnalyzer": import("@sinclair/typebox").TObject<{
            analyzerId: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>;
        }>;
        readonly "labTests.comment": import("@sinclair/typebox").TObject<{
            body: import("@sinclair/typebox").TString;
            mentionedStaffIds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        }>;
        readonly "labTests.payInvoice": import("@sinclair/typebox").TObject<{
            amountPaid: import("@sinclair/typebox").TNumber;
            paymentMethod: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"CASH">, import("@sinclair/typebox").TLiteral<"CARD">, import("@sinclair/typebox").TLiteral<"TRANSFER">]>;
            itemId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            insurance: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
                apply: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                excludedLineRefs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            }>>;
        }>;
        readonly "labTests.listQuery": import("@sinclair/typebox").TObject<{
            period: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"day">, import("@sinclair/typebox").TLiteral<"week">, import("@sinclair/typebox").TLiteral<"all">]>>;
            view: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"all">, import("@sinclair/typebox").TLiteral<"for-me">]>>;
            branchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            appointmentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
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
    "lab-tests": {};
} & {
    "lab-tests": {
        stats: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        total: number;
                        queue: number;
                        scheduled: number;
                        sampleCollection: number;
                        inLab: number;
                        underReview: number;
                        completed: number;
                        urgent: number;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                };
            };
        };
    };
} & {
    "lab-tests": {
        get: {
            body: {};
            params: {};
            query: {
                branchId?: string | undefined;
                period?: "week" | "day" | "all" | undefined;
                appointmentId?: string | undefined;
                view?: "all" | "for-me" | undefined;
            };
            headers: {};
            response: {
                200: {
                    comments: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        body: string;
                        author: {
                            name: string;
                            id: string;
                        };
                        mentions: {
                            staff: {
                                name: string;
                                id: string;
                            };
                        }[];
                    }[];
                    branch: {
                        name: string;
                        id: string;
                    };
                    owner: {
                        name: string;
                        id: string;
                        phone: string;
                    };
                    patient: {
                        animalType: {
                            id: string;
                            arName: string;
                        };
                        animalStrain: {
                            id: string;
                            arName: string;
                        } | null;
                        name: string;
                        id: string;
                        code: string;
                        gender: import("@/generated/prisma/enums").Gender;
                        age: number | null;
                    };
                    appointment: {
                        id: string;
                        code: string;
                        startsAt: Date;
                    } | null;
                    invoice: {
                        discount: import("@prisma/client-runtime-utils").Decimal;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        vatRate: import("@prisma/client-runtime-utils").Decimal;
                        currencyCode: string;
                        code: string;
                        status: import("@/generated/prisma/enums").InvoiceStatus;
                        total: import("@prisma/client-runtime-utils").Decimal;
                        vatAmount: import("@prisma/client-runtime-utils").Decimal;
                        paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                        paidAt: Date | null;
                        appointmentId: string | null;
                        labOrderId: string | null;
                        subtotal: import("@prisma/client-runtime-utils").Decimal;
                        amountPaid: import("@prisma/client-runtime-utils").Decimal;
                        membershipId: string | null;
                        refundedAt: Date | null;
                        refundReason: string | null;
                        membershipAdjustments: {
                            id: string;
                            amount: import("@prisma/client-runtime-utils").Decimal;
                            lineRef: string;
                            benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                            unitsConsumed: number;
                        }[];
                    } | null;
                    priority: import("@/generated/prisma/enums").TaskPriority | null;
                    id: string;
                    clinicId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    code: string;
                    branchId: string;
                    notes: string | null;
                    items: {
                        service: {
                            name: string;
                            id: string;
                        };
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        report: string | null;
                        status: LabTestStatus;
                        serviceId: string;
                        results: {
                            value: string | null;
                            name: string;
                            id: string;
                            order: number;
                            notes: string | null;
                            section: string | null;
                            unit: string | null;
                            refLow: import("@prisma/client-runtime-utils").Decimal | null;
                            refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                            parameterId: string | null;
                            numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                            flag: import("@/generated/prisma/enums").LabResultFlag;
                        }[];
                        paidAt: Date | null;
                        rejectionReason: string | null;
                        completedAt: Date | null;
                        orderId: string;
                        priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                        sampleStage: import("@/generated/prisma/enums").LabSampleStage;
                        scheduledAt: Date | null;
                        reviewedAt: Date | null;
                        rejectedAt: Date | null;
                        assignedTo: {
                            name: string;
                            id: string;
                        } | null;
                        reviewedBy: {
                            name: string;
                            id: string;
                        } | null;
                        rejectedBy: {
                            name: string;
                            id: string;
                        } | null;
                        reportMentions: {
                            staff: {
                                name: string;
                                id: string;
                            };
                        }[];
                        sampleCollection: {
                            id: string;
                            attempts: number | null;
                            itemId: string;
                            tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                            drawSite: string | null;
                            volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                            collectedAt: Date | null;
                            quality: import("@/generated/prisma/enums").LabSampleQuality | null;
                            collectionNotes: string | null;
                            analyzerId: string | null;
                            analyzerName: string | null;
                            handedOverAt: Date | null;
                            labelsPrinted: number | null;
                            collectedBy: {
                                name: string;
                                id: string;
                            } | null;
                        } | null;
                    }[];
                    appointmentId: string | null;
                    inpatientStayId: string | null;
                    patientId: string;
                    ownerId: string;
                    activity: {
                        type: import("@/generated/prisma/enums").LabActivityType;
                        id: string;
                        createdAt: Date;
                        detail: string | null;
                        itemId: string | null;
                        author: {
                            name: string;
                            id: string;
                        } | null;
                    }[];
                    isUrgent: boolean;
                    qcReviewedAt: Date | null;
                    qcRules: string[];
                    requestedBy: {
                        name: string;
                        id: string;
                        phone: string | null;
                    } | null;
                    qcReviewedBy: {
                        name: string;
                        id: string;
                    } | null;
                    preAnalytical: {
                        id: string;
                        vitalsRecordId: string | null;
                        vitalsRecord: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            code: string;
                            branchId: string | null;
                            notes: string | null;
                            editsCount: number;
                            operationId: string | null;
                            appointmentId: string | null;
                            labOrderId: string | null;
                            radiologyOrderId: string | null;
                            patientId: string;
                            source: import("@/generated/prisma/enums").VitalSignsSource;
                            weight: import("@prisma/client-runtime-utils").Decimal | null;
                            recordedAt: Date;
                            temperature: import("@prisma/client-runtime-utils").Decimal | null;
                            heartRate: number | null;
                            respiratoryRate: number | null;
                            oxygenSaturation: number | null;
                            bloodPressure: string | null;
                            painScore: number | null;
                            bodyConditionScore: number | null;
                            capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                            mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                            correctsId: string | null;
                            recordedBy: {
                                name: string;
                                id: string;
                            } | null;
                            correction: {
                                id: string;
                                code: string;
                                recordedAt: Date;
                            } | null;
                        } | null;
                        orderId: string;
                        fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                        fastingHours: number | null;
                        medications: string[];
                        ivFluids24h: boolean | null;
                    } | null;
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
} & {
    "lab-tests": {
        items: {
            ":itemId": {
                status: {
                    patch: {
                        body: {
                            status: "CANCELLED" | "COMPLETED" | "SCHEDULED" | "QUEUE" | "SAMPLE_COLLECTION" | "IN_LAB" | "UNDER_REVIEW";
                        };
                        params: {
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                comments: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    body: string;
                                    author: {
                                        name: string;
                                        id: string;
                                    };
                                    mentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                }[];
                                branch: {
                                    name: string;
                                    id: string;
                                };
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                };
                                patient: {
                                    animalType: {
                                        id: string;
                                        arName: string;
                                    };
                                    animalStrain: {
                                        id: string;
                                        arName: string;
                                    } | null;
                                    name: string;
                                    id: string;
                                    code: string;
                                    gender: import("@/generated/prisma/enums").Gender;
                                    age: number | null;
                                };
                                appointment: {
                                    id: string;
                                    code: string;
                                    startsAt: Date;
                                } | null;
                                invoice: {
                                    discount: import("@prisma/client-runtime-utils").Decimal;
                                    id: string;
                                    clinicId: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    vatRate: import("@prisma/client-runtime-utils").Decimal;
                                    currencyCode: string;
                                    code: string;
                                    status: import("@/generated/prisma/enums").InvoiceStatus;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                    paidAt: Date | null;
                                    appointmentId: string | null;
                                    labOrderId: string | null;
                                    subtotal: import("@prisma/client-runtime-utils").Decimal;
                                    amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                    membershipId: string | null;
                                    refundedAt: Date | null;
                                    refundReason: string | null;
                                    membershipAdjustments: {
                                        id: string;
                                        amount: import("@prisma/client-runtime-utils").Decimal;
                                        lineRef: string;
                                        benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                        unitsConsumed: number;
                                    }[];
                                } | null;
                                priority: import("@/generated/prisma/enums").TaskPriority | null;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                branchId: string;
                                notes: string | null;
                                items: {
                                    service: {
                                        name: string;
                                        id: string;
                                    };
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    report: string | null;
                                    status: LabTestStatus;
                                    serviceId: string;
                                    results: {
                                        value: string | null;
                                        name: string;
                                        id: string;
                                        order: number;
                                        notes: string | null;
                                        section: string | null;
                                        unit: string | null;
                                        refLow: import("@prisma/client-runtime-utils").Decimal | null;
                                        refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                                        parameterId: string | null;
                                        numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                                        flag: import("@/generated/prisma/enums").LabResultFlag;
                                    }[];
                                    paidAt: Date | null;
                                    rejectionReason: string | null;
                                    completedAt: Date | null;
                                    orderId: string;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    sampleStage: import("@/generated/prisma/enums").LabSampleStage;
                                    scheduledAt: Date | null;
                                    reviewedAt: Date | null;
                                    rejectedAt: Date | null;
                                    assignedTo: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reviewedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    rejectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reportMentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                    sampleCollection: {
                                        id: string;
                                        attempts: number | null;
                                        itemId: string;
                                        tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                                        drawSite: string | null;
                                        volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                        collectedAt: Date | null;
                                        quality: import("@/generated/prisma/enums").LabSampleQuality | null;
                                        collectionNotes: string | null;
                                        analyzerId: string | null;
                                        analyzerName: string | null;
                                        handedOverAt: Date | null;
                                        labelsPrinted: number | null;
                                        collectedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                    } | null;
                                }[];
                                appointmentId: string | null;
                                inpatientStayId: string | null;
                                patientId: string;
                                ownerId: string;
                                activity: {
                                    type: import("@/generated/prisma/enums").LabActivityType;
                                    id: string;
                                    createdAt: Date;
                                    detail: string | null;
                                    itemId: string | null;
                                    author: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                                isUrgent: boolean;
                                qcReviewedAt: Date | null;
                                qcRules: string[];
                                requestedBy: {
                                    name: string;
                                    id: string;
                                    phone: string | null;
                                } | null;
                                qcReviewedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                preAnalytical: {
                                    id: string;
                                    vitalsRecordId: string | null;
                                    vitalsRecord: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        code: string;
                                        branchId: string | null;
                                        notes: string | null;
                                        editsCount: number;
                                        operationId: string | null;
                                        appointmentId: string | null;
                                        labOrderId: string | null;
                                        radiologyOrderId: string | null;
                                        patientId: string;
                                        source: import("@/generated/prisma/enums").VitalSignsSource;
                                        weight: import("@prisma/client-runtime-utils").Decimal | null;
                                        recordedAt: Date;
                                        temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                        heartRate: number | null;
                                        respiratoryRate: number | null;
                                        oxygenSaturation: number | null;
                                        bloodPressure: string | null;
                                        painScore: number | null;
                                        bodyConditionScore: number | null;
                                        capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                        mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                        correctsId: string | null;
                                        recordedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        correction: {
                                            id: string;
                                            code: string;
                                            recordedAt: Date;
                                        } | null;
                                    } | null;
                                    orderId: string;
                                    fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                    fastingHours: number | null;
                                    medications: string[];
                                    ivFluids24h: boolean | null;
                                } | null;
                            } | null;
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
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
    "lab-tests": {
        items: {
            ":itemId": {
                stage: {
                    patch: {
                        body: {
                            sampleStage: "NOT_COLLECTED" | "COLLECTED" | "QUALITY_CHECK" | "LABEL_PRINT" | "ANALYZER_ASSIGNMENT" | "HANDOVER_SUMMARY" | "ANALYZING" | "RESULTS_READY";
                        };
                        params: {
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                comments: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    body: string;
                                    author: {
                                        name: string;
                                        id: string;
                                    };
                                    mentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                }[];
                                branch: {
                                    name: string;
                                    id: string;
                                };
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                };
                                patient: {
                                    animalType: {
                                        id: string;
                                        arName: string;
                                    };
                                    animalStrain: {
                                        id: string;
                                        arName: string;
                                    } | null;
                                    name: string;
                                    id: string;
                                    code: string;
                                    gender: import("@/generated/prisma/enums").Gender;
                                    age: number | null;
                                };
                                appointment: {
                                    id: string;
                                    code: string;
                                    startsAt: Date;
                                } | null;
                                invoice: {
                                    discount: import("@prisma/client-runtime-utils").Decimal;
                                    id: string;
                                    clinicId: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    vatRate: import("@prisma/client-runtime-utils").Decimal;
                                    currencyCode: string;
                                    code: string;
                                    status: import("@/generated/prisma/enums").InvoiceStatus;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                    paidAt: Date | null;
                                    appointmentId: string | null;
                                    labOrderId: string | null;
                                    subtotal: import("@prisma/client-runtime-utils").Decimal;
                                    amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                    membershipId: string | null;
                                    refundedAt: Date | null;
                                    refundReason: string | null;
                                    membershipAdjustments: {
                                        id: string;
                                        amount: import("@prisma/client-runtime-utils").Decimal;
                                        lineRef: string;
                                        benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                        unitsConsumed: number;
                                    }[];
                                } | null;
                                priority: import("@/generated/prisma/enums").TaskPriority | null;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                branchId: string;
                                notes: string | null;
                                items: {
                                    service: {
                                        name: string;
                                        id: string;
                                    };
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    report: string | null;
                                    status: LabTestStatus;
                                    serviceId: string;
                                    results: {
                                        value: string | null;
                                        name: string;
                                        id: string;
                                        order: number;
                                        notes: string | null;
                                        section: string | null;
                                        unit: string | null;
                                        refLow: import("@prisma/client-runtime-utils").Decimal | null;
                                        refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                                        parameterId: string | null;
                                        numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                                        flag: import("@/generated/prisma/enums").LabResultFlag;
                                    }[];
                                    paidAt: Date | null;
                                    rejectionReason: string | null;
                                    completedAt: Date | null;
                                    orderId: string;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    sampleStage: import("@/generated/prisma/enums").LabSampleStage;
                                    scheduledAt: Date | null;
                                    reviewedAt: Date | null;
                                    rejectedAt: Date | null;
                                    assignedTo: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reviewedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    rejectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reportMentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                    sampleCollection: {
                                        id: string;
                                        attempts: number | null;
                                        itemId: string;
                                        tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                                        drawSite: string | null;
                                        volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                        collectedAt: Date | null;
                                        quality: import("@/generated/prisma/enums").LabSampleQuality | null;
                                        collectionNotes: string | null;
                                        analyzerId: string | null;
                                        analyzerName: string | null;
                                        handedOverAt: Date | null;
                                        labelsPrinted: number | null;
                                        collectedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                    } | null;
                                }[];
                                appointmentId: string | null;
                                inpatientStayId: string | null;
                                patientId: string;
                                ownerId: string;
                                activity: {
                                    type: import("@/generated/prisma/enums").LabActivityType;
                                    id: string;
                                    createdAt: Date;
                                    detail: string | null;
                                    itemId: string | null;
                                    author: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                                isUrgent: boolean;
                                qcReviewedAt: Date | null;
                                qcRules: string[];
                                requestedBy: {
                                    name: string;
                                    id: string;
                                    phone: string | null;
                                } | null;
                                qcReviewedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                preAnalytical: {
                                    id: string;
                                    vitalsRecordId: string | null;
                                    vitalsRecord: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        code: string;
                                        branchId: string | null;
                                        notes: string | null;
                                        editsCount: number;
                                        operationId: string | null;
                                        appointmentId: string | null;
                                        labOrderId: string | null;
                                        radiologyOrderId: string | null;
                                        patientId: string;
                                        source: import("@/generated/prisma/enums").VitalSignsSource;
                                        weight: import("@prisma/client-runtime-utils").Decimal | null;
                                        recordedAt: Date;
                                        temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                        heartRate: number | null;
                                        respiratoryRate: number | null;
                                        oxygenSaturation: number | null;
                                        bloodPressure: string | null;
                                        painScore: number | null;
                                        bodyConditionScore: number | null;
                                        capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                        mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                        correctsId: string | null;
                                        recordedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        correction: {
                                            id: string;
                                            code: string;
                                            recordedAt: Date;
                                        } | null;
                                    } | null;
                                    orderId: string;
                                    fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                    fastingHours: number | null;
                                    medications: string[];
                                    ivFluids24h: boolean | null;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
                            };
                            422: {
                                readonly message: "مراحل العيّنة متاحة داخل «سحب العينة» و«في المختبر» فقط";
                            } | {
                                readonly message: "هذه المرحلة لا تنتمي إلى حالة التحليل الحالية";
                            } | {
                                readonly message: "يمكن الانتقال خطوة واحدة بين المراحل";
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
    "lab-tests": {
        items: {
            ":itemId": {
                assign: {
                    patch: {
                        body: {
                            assignedToId: string | null;
                        };
                        params: {
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                comments: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    body: string;
                                    author: {
                                        name: string;
                                        id: string;
                                    };
                                    mentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                }[];
                                branch: {
                                    name: string;
                                    id: string;
                                };
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                };
                                patient: {
                                    animalType: {
                                        id: string;
                                        arName: string;
                                    };
                                    animalStrain: {
                                        id: string;
                                        arName: string;
                                    } | null;
                                    name: string;
                                    id: string;
                                    code: string;
                                    gender: import("@/generated/prisma/enums").Gender;
                                    age: number | null;
                                };
                                appointment: {
                                    id: string;
                                    code: string;
                                    startsAt: Date;
                                } | null;
                                invoice: {
                                    discount: import("@prisma/client-runtime-utils").Decimal;
                                    id: string;
                                    clinicId: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    vatRate: import("@prisma/client-runtime-utils").Decimal;
                                    currencyCode: string;
                                    code: string;
                                    status: import("@/generated/prisma/enums").InvoiceStatus;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                    paidAt: Date | null;
                                    appointmentId: string | null;
                                    labOrderId: string | null;
                                    subtotal: import("@prisma/client-runtime-utils").Decimal;
                                    amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                    membershipId: string | null;
                                    refundedAt: Date | null;
                                    refundReason: string | null;
                                    membershipAdjustments: {
                                        id: string;
                                        amount: import("@prisma/client-runtime-utils").Decimal;
                                        lineRef: string;
                                        benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                        unitsConsumed: number;
                                    }[];
                                } | null;
                                priority: import("@/generated/prisma/enums").TaskPriority | null;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                branchId: string;
                                notes: string | null;
                                items: {
                                    service: {
                                        name: string;
                                        id: string;
                                    };
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    report: string | null;
                                    status: LabTestStatus;
                                    serviceId: string;
                                    results: {
                                        value: string | null;
                                        name: string;
                                        id: string;
                                        order: number;
                                        notes: string | null;
                                        section: string | null;
                                        unit: string | null;
                                        refLow: import("@prisma/client-runtime-utils").Decimal | null;
                                        refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                                        parameterId: string | null;
                                        numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                                        flag: import("@/generated/prisma/enums").LabResultFlag;
                                    }[];
                                    paidAt: Date | null;
                                    rejectionReason: string | null;
                                    completedAt: Date | null;
                                    orderId: string;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    sampleStage: import("@/generated/prisma/enums").LabSampleStage;
                                    scheduledAt: Date | null;
                                    reviewedAt: Date | null;
                                    rejectedAt: Date | null;
                                    assignedTo: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reviewedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    rejectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reportMentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                    sampleCollection: {
                                        id: string;
                                        attempts: number | null;
                                        itemId: string;
                                        tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                                        drawSite: string | null;
                                        volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                        collectedAt: Date | null;
                                        quality: import("@/generated/prisma/enums").LabSampleQuality | null;
                                        collectionNotes: string | null;
                                        analyzerId: string | null;
                                        analyzerName: string | null;
                                        handedOverAt: Date | null;
                                        labelsPrinted: number | null;
                                        collectedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                    } | null;
                                }[];
                                appointmentId: string | null;
                                inpatientStayId: string | null;
                                patientId: string;
                                ownerId: string;
                                activity: {
                                    type: import("@/generated/prisma/enums").LabActivityType;
                                    id: string;
                                    createdAt: Date;
                                    detail: string | null;
                                    itemId: string | null;
                                    author: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                                isUrgent: boolean;
                                qcReviewedAt: Date | null;
                                qcRules: string[];
                                requestedBy: {
                                    name: string;
                                    id: string;
                                    phone: string | null;
                                } | null;
                                qcReviewedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                preAnalytical: {
                                    id: string;
                                    vitalsRecordId: string | null;
                                    vitalsRecord: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        code: string;
                                        branchId: string | null;
                                        notes: string | null;
                                        editsCount: number;
                                        operationId: string | null;
                                        appointmentId: string | null;
                                        labOrderId: string | null;
                                        radiologyOrderId: string | null;
                                        patientId: string;
                                        source: import("@/generated/prisma/enums").VitalSignsSource;
                                        weight: import("@prisma/client-runtime-utils").Decimal | null;
                                        recordedAt: Date;
                                        temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                        heartRate: number | null;
                                        respiratoryRate: number | null;
                                        oxygenSaturation: number | null;
                                        bloodPressure: string | null;
                                        painScore: number | null;
                                        bodyConditionScore: number | null;
                                        capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                        mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                        correctsId: string | null;
                                        recordedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        correction: {
                                            id: string;
                                            code: string;
                                            recordedAt: Date;
                                        } | null;
                                    } | null;
                                    orderId: string;
                                    fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                    fastingHours: number | null;
                                    medications: string[];
                                    ivFluids24h: boolean | null;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
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
    "lab-tests": {
        items: {
            ":itemId": {
                results: {
                    put: {
                        body: {
                            results: {
                                value?: string | null | undefined;
                                order?: number | undefined;
                                notes?: string | null | undefined;
                                section?: string | null | undefined;
                                unit?: string | null | undefined;
                                refLow?: number | null | undefined;
                                refHigh?: number | null | undefined;
                                parameterId?: string | null | undefined;
                                name: string;
                            }[];
                        };
                        params: {
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                comments: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    body: string;
                                    author: {
                                        name: string;
                                        id: string;
                                    };
                                    mentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                }[];
                                branch: {
                                    name: string;
                                    id: string;
                                };
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                };
                                patient: {
                                    animalType: {
                                        id: string;
                                        arName: string;
                                    };
                                    animalStrain: {
                                        id: string;
                                        arName: string;
                                    } | null;
                                    name: string;
                                    id: string;
                                    code: string;
                                    gender: import("@/generated/prisma/enums").Gender;
                                    age: number | null;
                                };
                                appointment: {
                                    id: string;
                                    code: string;
                                    startsAt: Date;
                                } | null;
                                invoice: {
                                    discount: import("@prisma/client-runtime-utils").Decimal;
                                    id: string;
                                    clinicId: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    vatRate: import("@prisma/client-runtime-utils").Decimal;
                                    currencyCode: string;
                                    code: string;
                                    status: import("@/generated/prisma/enums").InvoiceStatus;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                    paidAt: Date | null;
                                    appointmentId: string | null;
                                    labOrderId: string | null;
                                    subtotal: import("@prisma/client-runtime-utils").Decimal;
                                    amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                    membershipId: string | null;
                                    refundedAt: Date | null;
                                    refundReason: string | null;
                                    membershipAdjustments: {
                                        id: string;
                                        amount: import("@prisma/client-runtime-utils").Decimal;
                                        lineRef: string;
                                        benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                        unitsConsumed: number;
                                    }[];
                                } | null;
                                priority: import("@/generated/prisma/enums").TaskPriority | null;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                branchId: string;
                                notes: string | null;
                                items: {
                                    service: {
                                        name: string;
                                        id: string;
                                    };
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    report: string | null;
                                    status: LabTestStatus;
                                    serviceId: string;
                                    results: {
                                        value: string | null;
                                        name: string;
                                        id: string;
                                        order: number;
                                        notes: string | null;
                                        section: string | null;
                                        unit: string | null;
                                        refLow: import("@prisma/client-runtime-utils").Decimal | null;
                                        refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                                        parameterId: string | null;
                                        numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                                        flag: import("@/generated/prisma/enums").LabResultFlag;
                                    }[];
                                    paidAt: Date | null;
                                    rejectionReason: string | null;
                                    completedAt: Date | null;
                                    orderId: string;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    sampleStage: import("@/generated/prisma/enums").LabSampleStage;
                                    scheduledAt: Date | null;
                                    reviewedAt: Date | null;
                                    rejectedAt: Date | null;
                                    assignedTo: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reviewedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    rejectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reportMentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                    sampleCollection: {
                                        id: string;
                                        attempts: number | null;
                                        itemId: string;
                                        tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                                        drawSite: string | null;
                                        volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                        collectedAt: Date | null;
                                        quality: import("@/generated/prisma/enums").LabSampleQuality | null;
                                        collectionNotes: string | null;
                                        analyzerId: string | null;
                                        analyzerName: string | null;
                                        handedOverAt: Date | null;
                                        labelsPrinted: number | null;
                                        collectedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                    } | null;
                                }[];
                                appointmentId: string | null;
                                inpatientStayId: string | null;
                                patientId: string;
                                ownerId: string;
                                activity: {
                                    type: import("@/generated/prisma/enums").LabActivityType;
                                    id: string;
                                    createdAt: Date;
                                    detail: string | null;
                                    itemId: string | null;
                                    author: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                                isUrgent: boolean;
                                qcReviewedAt: Date | null;
                                qcRules: string[];
                                requestedBy: {
                                    name: string;
                                    id: string;
                                    phone: string | null;
                                } | null;
                                qcReviewedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                preAnalytical: {
                                    id: string;
                                    vitalsRecordId: string | null;
                                    vitalsRecord: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        code: string;
                                        branchId: string | null;
                                        notes: string | null;
                                        editsCount: number;
                                        operationId: string | null;
                                        appointmentId: string | null;
                                        labOrderId: string | null;
                                        radiologyOrderId: string | null;
                                        patientId: string;
                                        source: import("@/generated/prisma/enums").VitalSignsSource;
                                        weight: import("@prisma/client-runtime-utils").Decimal | null;
                                        recordedAt: Date;
                                        temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                        heartRate: number | null;
                                        respiratoryRate: number | null;
                                        oxygenSaturation: number | null;
                                        bloodPressure: string | null;
                                        painScore: number | null;
                                        bodyConditionScore: number | null;
                                        capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                        mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                        correctsId: string | null;
                                        recordedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        correction: {
                                            id: string;
                                            code: string;
                                            recordedAt: Date;
                                        } | null;
                                    } | null;
                                    orderId: string;
                                    fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                    fastingHours: number | null;
                                    medications: string[];
                                    ivFluids24h: boolean | null;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
                            };
                            422: {
                                readonly message: "لا يمكن تعديل نتائج تحليل مكتمل";
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
    "lab-tests": {
        items: {
            ":itemId": {
                report: {
                    patch: {
                        body: {
                            mentionedStaffIds?: string[] | undefined;
                            report: string | null;
                        };
                        params: {
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                comments: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    body: string;
                                    author: {
                                        name: string;
                                        id: string;
                                    };
                                    mentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                }[];
                                branch: {
                                    name: string;
                                    id: string;
                                };
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                };
                                patient: {
                                    animalType: {
                                        id: string;
                                        arName: string;
                                    };
                                    animalStrain: {
                                        id: string;
                                        arName: string;
                                    } | null;
                                    name: string;
                                    id: string;
                                    code: string;
                                    gender: import("@/generated/prisma/enums").Gender;
                                    age: number | null;
                                };
                                appointment: {
                                    id: string;
                                    code: string;
                                    startsAt: Date;
                                } | null;
                                invoice: {
                                    discount: import("@prisma/client-runtime-utils").Decimal;
                                    id: string;
                                    clinicId: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    vatRate: import("@prisma/client-runtime-utils").Decimal;
                                    currencyCode: string;
                                    code: string;
                                    status: import("@/generated/prisma/enums").InvoiceStatus;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                    paidAt: Date | null;
                                    appointmentId: string | null;
                                    labOrderId: string | null;
                                    subtotal: import("@prisma/client-runtime-utils").Decimal;
                                    amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                    membershipId: string | null;
                                    refundedAt: Date | null;
                                    refundReason: string | null;
                                    membershipAdjustments: {
                                        id: string;
                                        amount: import("@prisma/client-runtime-utils").Decimal;
                                        lineRef: string;
                                        benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                        unitsConsumed: number;
                                    }[];
                                } | null;
                                priority: import("@/generated/prisma/enums").TaskPriority | null;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                branchId: string;
                                notes: string | null;
                                items: {
                                    service: {
                                        name: string;
                                        id: string;
                                    };
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    report: string | null;
                                    status: LabTestStatus;
                                    serviceId: string;
                                    results: {
                                        value: string | null;
                                        name: string;
                                        id: string;
                                        order: number;
                                        notes: string | null;
                                        section: string | null;
                                        unit: string | null;
                                        refLow: import("@prisma/client-runtime-utils").Decimal | null;
                                        refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                                        parameterId: string | null;
                                        numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                                        flag: import("@/generated/prisma/enums").LabResultFlag;
                                    }[];
                                    paidAt: Date | null;
                                    rejectionReason: string | null;
                                    completedAt: Date | null;
                                    orderId: string;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    sampleStage: import("@/generated/prisma/enums").LabSampleStage;
                                    scheduledAt: Date | null;
                                    reviewedAt: Date | null;
                                    rejectedAt: Date | null;
                                    assignedTo: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reviewedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    rejectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reportMentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                    sampleCollection: {
                                        id: string;
                                        attempts: number | null;
                                        itemId: string;
                                        tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                                        drawSite: string | null;
                                        volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                        collectedAt: Date | null;
                                        quality: import("@/generated/prisma/enums").LabSampleQuality | null;
                                        collectionNotes: string | null;
                                        analyzerId: string | null;
                                        analyzerName: string | null;
                                        handedOverAt: Date | null;
                                        labelsPrinted: number | null;
                                        collectedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                    } | null;
                                }[];
                                appointmentId: string | null;
                                inpatientStayId: string | null;
                                patientId: string;
                                ownerId: string;
                                activity: {
                                    type: import("@/generated/prisma/enums").LabActivityType;
                                    id: string;
                                    createdAt: Date;
                                    detail: string | null;
                                    itemId: string | null;
                                    author: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                                isUrgent: boolean;
                                qcReviewedAt: Date | null;
                                qcRules: string[];
                                requestedBy: {
                                    name: string;
                                    id: string;
                                    phone: string | null;
                                } | null;
                                qcReviewedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                preAnalytical: {
                                    id: string;
                                    vitalsRecordId: string | null;
                                    vitalsRecord: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        code: string;
                                        branchId: string | null;
                                        notes: string | null;
                                        editsCount: number;
                                        operationId: string | null;
                                        appointmentId: string | null;
                                        labOrderId: string | null;
                                        radiologyOrderId: string | null;
                                        patientId: string;
                                        source: import("@/generated/prisma/enums").VitalSignsSource;
                                        weight: import("@prisma/client-runtime-utils").Decimal | null;
                                        recordedAt: Date;
                                        temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                        heartRate: number | null;
                                        respiratoryRate: number | null;
                                        oxygenSaturation: number | null;
                                        bloodPressure: string | null;
                                        painScore: number | null;
                                        bodyConditionScore: number | null;
                                        capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                        mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                        correctsId: string | null;
                                        recordedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        correction: {
                                            id: string;
                                            code: string;
                                            recordedAt: Date;
                                        } | null;
                                    } | null;
                                    orderId: string;
                                    fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                    fastingHours: number | null;
                                    medications: string[];
                                    ivFluids24h: boolean | null;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
                            };
                            422: {
                                readonly message: "لا يمكن تعديل تقرير تحليل مكتمل";
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
    "lab-tests": {
        items: {
            ":itemId": {
                report: {
                    generate: {
                        post: {
                            body: {};
                            params: {
                                itemId: string;
                            };
                            query: {};
                            headers: {};
                            response: {
                                200: {
                                    report: string;
                                };
                                401: {
                                    readonly message: "غير مصرح";
                                };
                                404: {
                                    message: string;
                                };
                                422: {
                                    readonly message: "لا يمكن تعديل تقرير تحليل مكتمل";
                                } | {
                                    readonly message: "أدخل نتائج التحليل أولًا ليُصاغ التقرير";
                                } | {
                                    type: "validation";
                                    on: string;
                                    summary?: string;
                                    message?: string;
                                    found?: unknown;
                                    property?: string;
                                    expected?: string;
                                };
                                502: {
                                    readonly message: "تعذّر توليد التقرير — اكتبه يدويًا أو أعد المحاولة";
                                };
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    "lab-tests": {
        items: {
            ":itemId": {
                approve: {
                    post: {
                        body: {
                            mentionedStaffIds?: string[] | undefined;
                            report: string;
                        };
                        params: {
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                comments: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    body: string;
                                    author: {
                                        name: string;
                                        id: string;
                                    };
                                    mentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                }[];
                                branch: {
                                    name: string;
                                    id: string;
                                };
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                };
                                patient: {
                                    animalType: {
                                        id: string;
                                        arName: string;
                                    };
                                    animalStrain: {
                                        id: string;
                                        arName: string;
                                    } | null;
                                    name: string;
                                    id: string;
                                    code: string;
                                    gender: import("@/generated/prisma/enums").Gender;
                                    age: number | null;
                                };
                                appointment: {
                                    id: string;
                                    code: string;
                                    startsAt: Date;
                                } | null;
                                invoice: {
                                    discount: import("@prisma/client-runtime-utils").Decimal;
                                    id: string;
                                    clinicId: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    vatRate: import("@prisma/client-runtime-utils").Decimal;
                                    currencyCode: string;
                                    code: string;
                                    status: import("@/generated/prisma/enums").InvoiceStatus;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                    paidAt: Date | null;
                                    appointmentId: string | null;
                                    labOrderId: string | null;
                                    subtotal: import("@prisma/client-runtime-utils").Decimal;
                                    amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                    membershipId: string | null;
                                    refundedAt: Date | null;
                                    refundReason: string | null;
                                    membershipAdjustments: {
                                        id: string;
                                        amount: import("@prisma/client-runtime-utils").Decimal;
                                        lineRef: string;
                                        benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                        unitsConsumed: number;
                                    }[];
                                } | null;
                                priority: import("@/generated/prisma/enums").TaskPriority | null;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                branchId: string;
                                notes: string | null;
                                items: {
                                    service: {
                                        name: string;
                                        id: string;
                                    };
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    report: string | null;
                                    status: LabTestStatus;
                                    serviceId: string;
                                    results: {
                                        value: string | null;
                                        name: string;
                                        id: string;
                                        order: number;
                                        notes: string | null;
                                        section: string | null;
                                        unit: string | null;
                                        refLow: import("@prisma/client-runtime-utils").Decimal | null;
                                        refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                                        parameterId: string | null;
                                        numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                                        flag: import("@/generated/prisma/enums").LabResultFlag;
                                    }[];
                                    paidAt: Date | null;
                                    rejectionReason: string | null;
                                    completedAt: Date | null;
                                    orderId: string;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    sampleStage: import("@/generated/prisma/enums").LabSampleStage;
                                    scheduledAt: Date | null;
                                    reviewedAt: Date | null;
                                    rejectedAt: Date | null;
                                    assignedTo: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reviewedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    rejectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reportMentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                    sampleCollection: {
                                        id: string;
                                        attempts: number | null;
                                        itemId: string;
                                        tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                                        drawSite: string | null;
                                        volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                        collectedAt: Date | null;
                                        quality: import("@/generated/prisma/enums").LabSampleQuality | null;
                                        collectionNotes: string | null;
                                        analyzerId: string | null;
                                        analyzerName: string | null;
                                        handedOverAt: Date | null;
                                        labelsPrinted: number | null;
                                        collectedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                    } | null;
                                }[];
                                appointmentId: string | null;
                                inpatientStayId: string | null;
                                patientId: string;
                                ownerId: string;
                                activity: {
                                    type: import("@/generated/prisma/enums").LabActivityType;
                                    id: string;
                                    createdAt: Date;
                                    detail: string | null;
                                    itemId: string | null;
                                    author: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                                isUrgent: boolean;
                                qcReviewedAt: Date | null;
                                qcRules: string[];
                                requestedBy: {
                                    name: string;
                                    id: string;
                                    phone: string | null;
                                } | null;
                                qcReviewedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                preAnalytical: {
                                    id: string;
                                    vitalsRecordId: string | null;
                                    vitalsRecord: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        code: string;
                                        branchId: string | null;
                                        notes: string | null;
                                        editsCount: number;
                                        operationId: string | null;
                                        appointmentId: string | null;
                                        labOrderId: string | null;
                                        radiologyOrderId: string | null;
                                        patientId: string;
                                        source: import("@/generated/prisma/enums").VitalSignsSource;
                                        weight: import("@prisma/client-runtime-utils").Decimal | null;
                                        recordedAt: Date;
                                        temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                        heartRate: number | null;
                                        respiratoryRate: number | null;
                                        oxygenSaturation: number | null;
                                        bloodPressure: string | null;
                                        painScore: number | null;
                                        bodyConditionScore: number | null;
                                        capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                        mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                        correctsId: string | null;
                                        recordedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        correction: {
                                            id: string;
                                            code: string;
                                            recordedAt: Date;
                                        } | null;
                                    } | null;
                                    orderId: string;
                                    fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                    fastingHours: number | null;
                                    medications: string[];
                                    ivFluids24h: boolean | null;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
                            };
                            422: {
                                readonly message: "القبول متاح للتحاليل قيد المراجعة فقط";
                            } | {
                                readonly message: "اكتب تقرير المراجعة قبل الاعتماد";
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
    "lab-tests": {
        items: {
            ":itemId": {
                reject: {
                    post: {
                        body: {
                            reason: string;
                        };
                        params: {
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                comments: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    body: string;
                                    author: {
                                        name: string;
                                        id: string;
                                    };
                                    mentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                }[];
                                branch: {
                                    name: string;
                                    id: string;
                                };
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                };
                                patient: {
                                    animalType: {
                                        id: string;
                                        arName: string;
                                    };
                                    animalStrain: {
                                        id: string;
                                        arName: string;
                                    } | null;
                                    name: string;
                                    id: string;
                                    code: string;
                                    gender: import("@/generated/prisma/enums").Gender;
                                    age: number | null;
                                };
                                appointment: {
                                    id: string;
                                    code: string;
                                    startsAt: Date;
                                } | null;
                                invoice: {
                                    discount: import("@prisma/client-runtime-utils").Decimal;
                                    id: string;
                                    clinicId: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    vatRate: import("@prisma/client-runtime-utils").Decimal;
                                    currencyCode: string;
                                    code: string;
                                    status: import("@/generated/prisma/enums").InvoiceStatus;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                    paidAt: Date | null;
                                    appointmentId: string | null;
                                    labOrderId: string | null;
                                    subtotal: import("@prisma/client-runtime-utils").Decimal;
                                    amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                    membershipId: string | null;
                                    refundedAt: Date | null;
                                    refundReason: string | null;
                                    membershipAdjustments: {
                                        id: string;
                                        amount: import("@prisma/client-runtime-utils").Decimal;
                                        lineRef: string;
                                        benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                        unitsConsumed: number;
                                    }[];
                                } | null;
                                priority: import("@/generated/prisma/enums").TaskPriority | null;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                branchId: string;
                                notes: string | null;
                                items: {
                                    service: {
                                        name: string;
                                        id: string;
                                    };
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    report: string | null;
                                    status: LabTestStatus;
                                    serviceId: string;
                                    results: {
                                        value: string | null;
                                        name: string;
                                        id: string;
                                        order: number;
                                        notes: string | null;
                                        section: string | null;
                                        unit: string | null;
                                        refLow: import("@prisma/client-runtime-utils").Decimal | null;
                                        refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                                        parameterId: string | null;
                                        numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                                        flag: import("@/generated/prisma/enums").LabResultFlag;
                                    }[];
                                    paidAt: Date | null;
                                    rejectionReason: string | null;
                                    completedAt: Date | null;
                                    orderId: string;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    sampleStage: import("@/generated/prisma/enums").LabSampleStage;
                                    scheduledAt: Date | null;
                                    reviewedAt: Date | null;
                                    rejectedAt: Date | null;
                                    assignedTo: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reviewedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    rejectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reportMentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                    sampleCollection: {
                                        id: string;
                                        attempts: number | null;
                                        itemId: string;
                                        tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                                        drawSite: string | null;
                                        volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                        collectedAt: Date | null;
                                        quality: import("@/generated/prisma/enums").LabSampleQuality | null;
                                        collectionNotes: string | null;
                                        analyzerId: string | null;
                                        analyzerName: string | null;
                                        handedOverAt: Date | null;
                                        labelsPrinted: number | null;
                                        collectedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                    } | null;
                                }[];
                                appointmentId: string | null;
                                inpatientStayId: string | null;
                                patientId: string;
                                ownerId: string;
                                activity: {
                                    type: import("@/generated/prisma/enums").LabActivityType;
                                    id: string;
                                    createdAt: Date;
                                    detail: string | null;
                                    itemId: string | null;
                                    author: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                                isUrgent: boolean;
                                qcReviewedAt: Date | null;
                                qcRules: string[];
                                requestedBy: {
                                    name: string;
                                    id: string;
                                    phone: string | null;
                                } | null;
                                qcReviewedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                preAnalytical: {
                                    id: string;
                                    vitalsRecordId: string | null;
                                    vitalsRecord: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        code: string;
                                        branchId: string | null;
                                        notes: string | null;
                                        editsCount: number;
                                        operationId: string | null;
                                        appointmentId: string | null;
                                        labOrderId: string | null;
                                        radiologyOrderId: string | null;
                                        patientId: string;
                                        source: import("@/generated/prisma/enums").VitalSignsSource;
                                        weight: import("@prisma/client-runtime-utils").Decimal | null;
                                        recordedAt: Date;
                                        temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                        heartRate: number | null;
                                        respiratoryRate: number | null;
                                        oxygenSaturation: number | null;
                                        bloodPressure: string | null;
                                        painScore: number | null;
                                        bodyConditionScore: number | null;
                                        capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                        mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                        correctsId: string | null;
                                        recordedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        correction: {
                                            id: string;
                                            code: string;
                                            recordedAt: Date;
                                        } | null;
                                    } | null;
                                    orderId: string;
                                    fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                    fastingHours: number | null;
                                    medications: string[];
                                    ivFluids24h: boolean | null;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
                            };
                            422: {
                                readonly message: "الرفض متاح للتحاليل قيد المراجعة فقط";
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
    "lab-tests": {
        items: {
            ":itemId": {
                collection: {
                    patch: {
                        body: {
                            attempts?: number | null | undefined;
                            tubeType?: "EDTA" | "SST" | "CITRATE" | "HEPARIN" | "URINE" | "SWAB" | null | undefined;
                            drawSite?: string | null | undefined;
                            volumeMl?: number | null | undefined;
                            collectedAt?: string | null | undefined;
                            quality?: "REJECTED" | "EXCELLENT" | "GOOD" | "ACCEPTABLE" | null | undefined;
                            collectionNotes?: string | null | undefined;
                            collectedById?: string | null | undefined;
                        };
                        params: {
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                comments: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    body: string;
                                    author: {
                                        name: string;
                                        id: string;
                                    };
                                    mentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                }[];
                                branch: {
                                    name: string;
                                    id: string;
                                };
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                };
                                patient: {
                                    animalType: {
                                        id: string;
                                        arName: string;
                                    };
                                    animalStrain: {
                                        id: string;
                                        arName: string;
                                    } | null;
                                    name: string;
                                    id: string;
                                    code: string;
                                    gender: import("@/generated/prisma/enums").Gender;
                                    age: number | null;
                                };
                                appointment: {
                                    id: string;
                                    code: string;
                                    startsAt: Date;
                                } | null;
                                invoice: {
                                    discount: import("@prisma/client-runtime-utils").Decimal;
                                    id: string;
                                    clinicId: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    vatRate: import("@prisma/client-runtime-utils").Decimal;
                                    currencyCode: string;
                                    code: string;
                                    status: import("@/generated/prisma/enums").InvoiceStatus;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                    paidAt: Date | null;
                                    appointmentId: string | null;
                                    labOrderId: string | null;
                                    subtotal: import("@prisma/client-runtime-utils").Decimal;
                                    amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                    membershipId: string | null;
                                    refundedAt: Date | null;
                                    refundReason: string | null;
                                    membershipAdjustments: {
                                        id: string;
                                        amount: import("@prisma/client-runtime-utils").Decimal;
                                        lineRef: string;
                                        benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                        unitsConsumed: number;
                                    }[];
                                } | null;
                                priority: import("@/generated/prisma/enums").TaskPriority | null;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                branchId: string;
                                notes: string | null;
                                items: {
                                    service: {
                                        name: string;
                                        id: string;
                                    };
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    report: string | null;
                                    status: LabTestStatus;
                                    serviceId: string;
                                    results: {
                                        value: string | null;
                                        name: string;
                                        id: string;
                                        order: number;
                                        notes: string | null;
                                        section: string | null;
                                        unit: string | null;
                                        refLow: import("@prisma/client-runtime-utils").Decimal | null;
                                        refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                                        parameterId: string | null;
                                        numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                                        flag: import("@/generated/prisma/enums").LabResultFlag;
                                    }[];
                                    paidAt: Date | null;
                                    rejectionReason: string | null;
                                    completedAt: Date | null;
                                    orderId: string;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    sampleStage: import("@/generated/prisma/enums").LabSampleStage;
                                    scheduledAt: Date | null;
                                    reviewedAt: Date | null;
                                    rejectedAt: Date | null;
                                    assignedTo: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reviewedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    rejectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reportMentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                    sampleCollection: {
                                        id: string;
                                        attempts: number | null;
                                        itemId: string;
                                        tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                                        drawSite: string | null;
                                        volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                        collectedAt: Date | null;
                                        quality: import("@/generated/prisma/enums").LabSampleQuality | null;
                                        collectionNotes: string | null;
                                        analyzerId: string | null;
                                        analyzerName: string | null;
                                        handedOverAt: Date | null;
                                        labelsPrinted: number | null;
                                        collectedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                    } | null;
                                }[];
                                appointmentId: string | null;
                                inpatientStayId: string | null;
                                patientId: string;
                                ownerId: string;
                                activity: {
                                    type: import("@/generated/prisma/enums").LabActivityType;
                                    id: string;
                                    createdAt: Date;
                                    detail: string | null;
                                    itemId: string | null;
                                    author: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                                isUrgent: boolean;
                                qcReviewedAt: Date | null;
                                qcRules: string[];
                                requestedBy: {
                                    name: string;
                                    id: string;
                                    phone: string | null;
                                } | null;
                                qcReviewedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                preAnalytical: {
                                    id: string;
                                    vitalsRecordId: string | null;
                                    vitalsRecord: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        code: string;
                                        branchId: string | null;
                                        notes: string | null;
                                        editsCount: number;
                                        operationId: string | null;
                                        appointmentId: string | null;
                                        labOrderId: string | null;
                                        radiologyOrderId: string | null;
                                        patientId: string;
                                        source: import("@/generated/prisma/enums").VitalSignsSource;
                                        weight: import("@prisma/client-runtime-utils").Decimal | null;
                                        recordedAt: Date;
                                        temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                        heartRate: number | null;
                                        respiratoryRate: number | null;
                                        oxygenSaturation: number | null;
                                        bloodPressure: string | null;
                                        painScore: number | null;
                                        bodyConditionScore: number | null;
                                        capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                        mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                        correctsId: string | null;
                                        recordedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        correction: {
                                            id: string;
                                            code: string;
                                            recordedAt: Date;
                                        } | null;
                                    } | null;
                                    orderId: string;
                                    fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                    fastingHours: number | null;
                                    medications: string[];
                                    ivFluids24h: boolean | null;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
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
    "lab-tests": {
        items: {
            ":itemId": {
                handover: {
                    post: {
                        body: {
                            labelsPrinted?: number | undefined;
                        };
                        params: {
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                comments: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    body: string;
                                    author: {
                                        name: string;
                                        id: string;
                                    };
                                    mentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                }[];
                                branch: {
                                    name: string;
                                    id: string;
                                };
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                };
                                patient: {
                                    animalType: {
                                        id: string;
                                        arName: string;
                                    };
                                    animalStrain: {
                                        id: string;
                                        arName: string;
                                    } | null;
                                    name: string;
                                    id: string;
                                    code: string;
                                    gender: import("@/generated/prisma/enums").Gender;
                                    age: number | null;
                                };
                                appointment: {
                                    id: string;
                                    code: string;
                                    startsAt: Date;
                                } | null;
                                invoice: {
                                    discount: import("@prisma/client-runtime-utils").Decimal;
                                    id: string;
                                    clinicId: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    vatRate: import("@prisma/client-runtime-utils").Decimal;
                                    currencyCode: string;
                                    code: string;
                                    status: import("@/generated/prisma/enums").InvoiceStatus;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                    paidAt: Date | null;
                                    appointmentId: string | null;
                                    labOrderId: string | null;
                                    subtotal: import("@prisma/client-runtime-utils").Decimal;
                                    amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                    membershipId: string | null;
                                    refundedAt: Date | null;
                                    refundReason: string | null;
                                    membershipAdjustments: {
                                        id: string;
                                        amount: import("@prisma/client-runtime-utils").Decimal;
                                        lineRef: string;
                                        benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                        unitsConsumed: number;
                                    }[];
                                } | null;
                                priority: import("@/generated/prisma/enums").TaskPriority | null;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                branchId: string;
                                notes: string | null;
                                items: {
                                    service: {
                                        name: string;
                                        id: string;
                                    };
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    report: string | null;
                                    status: LabTestStatus;
                                    serviceId: string;
                                    results: {
                                        value: string | null;
                                        name: string;
                                        id: string;
                                        order: number;
                                        notes: string | null;
                                        section: string | null;
                                        unit: string | null;
                                        refLow: import("@prisma/client-runtime-utils").Decimal | null;
                                        refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                                        parameterId: string | null;
                                        numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                                        flag: import("@/generated/prisma/enums").LabResultFlag;
                                    }[];
                                    paidAt: Date | null;
                                    rejectionReason: string | null;
                                    completedAt: Date | null;
                                    orderId: string;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    sampleStage: import("@/generated/prisma/enums").LabSampleStage;
                                    scheduledAt: Date | null;
                                    reviewedAt: Date | null;
                                    rejectedAt: Date | null;
                                    assignedTo: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reviewedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    rejectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reportMentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                    sampleCollection: {
                                        id: string;
                                        attempts: number | null;
                                        itemId: string;
                                        tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                                        drawSite: string | null;
                                        volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                        collectedAt: Date | null;
                                        quality: import("@/generated/prisma/enums").LabSampleQuality | null;
                                        collectionNotes: string | null;
                                        analyzerId: string | null;
                                        analyzerName: string | null;
                                        handedOverAt: Date | null;
                                        labelsPrinted: number | null;
                                        collectedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                    } | null;
                                }[];
                                appointmentId: string | null;
                                inpatientStayId: string | null;
                                patientId: string;
                                ownerId: string;
                                activity: {
                                    type: import("@/generated/prisma/enums").LabActivityType;
                                    id: string;
                                    createdAt: Date;
                                    detail: string | null;
                                    itemId: string | null;
                                    author: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                                isUrgent: boolean;
                                qcReviewedAt: Date | null;
                                qcRules: string[];
                                requestedBy: {
                                    name: string;
                                    id: string;
                                    phone: string | null;
                                } | null;
                                qcReviewedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                preAnalytical: {
                                    id: string;
                                    vitalsRecordId: string | null;
                                    vitalsRecord: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        code: string;
                                        branchId: string | null;
                                        notes: string | null;
                                        editsCount: number;
                                        operationId: string | null;
                                        appointmentId: string | null;
                                        labOrderId: string | null;
                                        radiologyOrderId: string | null;
                                        patientId: string;
                                        source: import("@/generated/prisma/enums").VitalSignsSource;
                                        weight: import("@prisma/client-runtime-utils").Decimal | null;
                                        recordedAt: Date;
                                        temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                        heartRate: number | null;
                                        respiratoryRate: number | null;
                                        oxygenSaturation: number | null;
                                        bloodPressure: string | null;
                                        painScore: number | null;
                                        bodyConditionScore: number | null;
                                        capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                        mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                        correctsId: string | null;
                                        recordedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        correction: {
                                            id: string;
                                            code: string;
                                            recordedAt: Date;
                                        } | null;
                                    } | null;
                                    orderId: string;
                                    fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                    fastingHours: number | null;
                                    medications: string[];
                                    ivFluids24h: boolean | null;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
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
    "lab-tests": {
        comments: {
            ":commentId": {
                patch: {
                    body: {
                        mentionedStaffIds?: string[] | undefined;
                        body: string;
                    };
                    params: {
                        commentId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            comments: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                body: string;
                                author: {
                                    name: string;
                                    id: string;
                                };
                                mentions: {
                                    staff: {
                                        name: string;
                                        id: string;
                                    };
                                }[];
                            }[];
                            branch: {
                                name: string;
                                id: string;
                            };
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                            };
                            patient: {
                                animalType: {
                                    id: string;
                                    arName: string;
                                };
                                animalStrain: {
                                    id: string;
                                    arName: string;
                                } | null;
                                name: string;
                                id: string;
                                code: string;
                                gender: import("@/generated/prisma/enums").Gender;
                                age: number | null;
                            };
                            appointment: {
                                id: string;
                                code: string;
                                startsAt: Date;
                            } | null;
                            invoice: {
                                discount: import("@prisma/client-runtime-utils").Decimal;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                vatRate: import("@prisma/client-runtime-utils").Decimal;
                                currencyCode: string;
                                code: string;
                                status: import("@/generated/prisma/enums").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                                vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                paidAt: Date | null;
                                appointmentId: string | null;
                                labOrderId: string | null;
                                subtotal: import("@prisma/client-runtime-utils").Decimal;
                                amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                membershipId: string | null;
                                refundedAt: Date | null;
                                refundReason: string | null;
                                membershipAdjustments: {
                                    id: string;
                                    amount: import("@prisma/client-runtime-utils").Decimal;
                                    lineRef: string;
                                    benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                    unitsConsumed: number;
                                }[];
                            } | null;
                            priority: import("@/generated/prisma/enums").TaskPriority | null;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            code: string;
                            branchId: string;
                            notes: string | null;
                            items: {
                                service: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                report: string | null;
                                status: LabTestStatus;
                                serviceId: string;
                                results: {
                                    value: string | null;
                                    name: string;
                                    id: string;
                                    order: number;
                                    notes: string | null;
                                    section: string | null;
                                    unit: string | null;
                                    refLow: import("@prisma/client-runtime-utils").Decimal | null;
                                    refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                                    parameterId: string | null;
                                    numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                                    flag: import("@/generated/prisma/enums").LabResultFlag;
                                }[];
                                paidAt: Date | null;
                                rejectionReason: string | null;
                                completedAt: Date | null;
                                orderId: string;
                                priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                sampleStage: import("@/generated/prisma/enums").LabSampleStage;
                                scheduledAt: Date | null;
                                reviewedAt: Date | null;
                                rejectedAt: Date | null;
                                assignedTo: {
                                    name: string;
                                    id: string;
                                } | null;
                                reviewedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                rejectedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                reportMentions: {
                                    staff: {
                                        name: string;
                                        id: string;
                                    };
                                }[];
                                sampleCollection: {
                                    id: string;
                                    attempts: number | null;
                                    itemId: string;
                                    tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                                    drawSite: string | null;
                                    volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                    collectedAt: Date | null;
                                    quality: import("@/generated/prisma/enums").LabSampleQuality | null;
                                    collectionNotes: string | null;
                                    analyzerId: string | null;
                                    analyzerName: string | null;
                                    handedOverAt: Date | null;
                                    labelsPrinted: number | null;
                                    collectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                } | null;
                            }[];
                            appointmentId: string | null;
                            inpatientStayId: string | null;
                            patientId: string;
                            ownerId: string;
                            activity: {
                                type: import("@/generated/prisma/enums").LabActivityType;
                                id: string;
                                createdAt: Date;
                                detail: string | null;
                                itemId: string | null;
                                author: {
                                    name: string;
                                    id: string;
                                } | null;
                            }[];
                            isUrgent: boolean;
                            qcReviewedAt: Date | null;
                            qcRules: string[];
                            requestedBy: {
                                name: string;
                                id: string;
                                phone: string | null;
                            } | null;
                            qcReviewedBy: {
                                name: string;
                                id: string;
                            } | null;
                            preAnalytical: {
                                id: string;
                                vitalsRecordId: string | null;
                                vitalsRecord: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    code: string;
                                    branchId: string | null;
                                    notes: string | null;
                                    editsCount: number;
                                    operationId: string | null;
                                    appointmentId: string | null;
                                    labOrderId: string | null;
                                    radiologyOrderId: string | null;
                                    patientId: string;
                                    source: import("@/generated/prisma/enums").VitalSignsSource;
                                    weight: import("@prisma/client-runtime-utils").Decimal | null;
                                    recordedAt: Date;
                                    temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                    heartRate: number | null;
                                    respiratoryRate: number | null;
                                    oxygenSaturation: number | null;
                                    bloodPressure: string | null;
                                    painScore: number | null;
                                    bodyConditionScore: number | null;
                                    capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                    mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                    correctsId: string | null;
                                    recordedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    correction: {
                                        id: string;
                                        code: string;
                                        recordedAt: Date;
                                    } | null;
                                } | null;
                                orderId: string;
                                fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                fastingHours: number | null;
                                medications: string[];
                                ivFluids24h: boolean | null;
                            } | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا يمكنك تعديل تعليق غيرك";
                        };
                        404: {
                            readonly message: "التعليق غير موجود";
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
    "lab-tests": {
        comments: {
            ":commentId": {
                delete: {
                    body: {};
                    params: {
                        commentId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            comments: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                body: string;
                                author: {
                                    name: string;
                                    id: string;
                                };
                                mentions: {
                                    staff: {
                                        name: string;
                                        id: string;
                                    };
                                }[];
                            }[];
                            branch: {
                                name: string;
                                id: string;
                            };
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                            };
                            patient: {
                                animalType: {
                                    id: string;
                                    arName: string;
                                };
                                animalStrain: {
                                    id: string;
                                    arName: string;
                                } | null;
                                name: string;
                                id: string;
                                code: string;
                                gender: import("@/generated/prisma/enums").Gender;
                                age: number | null;
                            };
                            appointment: {
                                id: string;
                                code: string;
                                startsAt: Date;
                            } | null;
                            invoice: {
                                discount: import("@prisma/client-runtime-utils").Decimal;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                vatRate: import("@prisma/client-runtime-utils").Decimal;
                                currencyCode: string;
                                code: string;
                                status: import("@/generated/prisma/enums").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                                vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                paidAt: Date | null;
                                appointmentId: string | null;
                                labOrderId: string | null;
                                subtotal: import("@prisma/client-runtime-utils").Decimal;
                                amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                membershipId: string | null;
                                refundedAt: Date | null;
                                refundReason: string | null;
                                membershipAdjustments: {
                                    id: string;
                                    amount: import("@prisma/client-runtime-utils").Decimal;
                                    lineRef: string;
                                    benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                    unitsConsumed: number;
                                }[];
                            } | null;
                            priority: import("@/generated/prisma/enums").TaskPriority | null;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            code: string;
                            branchId: string;
                            notes: string | null;
                            items: {
                                service: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                report: string | null;
                                status: LabTestStatus;
                                serviceId: string;
                                results: {
                                    value: string | null;
                                    name: string;
                                    id: string;
                                    order: number;
                                    notes: string | null;
                                    section: string | null;
                                    unit: string | null;
                                    refLow: import("@prisma/client-runtime-utils").Decimal | null;
                                    refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                                    parameterId: string | null;
                                    numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                                    flag: import("@/generated/prisma/enums").LabResultFlag;
                                }[];
                                paidAt: Date | null;
                                rejectionReason: string | null;
                                completedAt: Date | null;
                                orderId: string;
                                priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                sampleStage: import("@/generated/prisma/enums").LabSampleStage;
                                scheduledAt: Date | null;
                                reviewedAt: Date | null;
                                rejectedAt: Date | null;
                                assignedTo: {
                                    name: string;
                                    id: string;
                                } | null;
                                reviewedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                rejectedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                reportMentions: {
                                    staff: {
                                        name: string;
                                        id: string;
                                    };
                                }[];
                                sampleCollection: {
                                    id: string;
                                    attempts: number | null;
                                    itemId: string;
                                    tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                                    drawSite: string | null;
                                    volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                    collectedAt: Date | null;
                                    quality: import("@/generated/prisma/enums").LabSampleQuality | null;
                                    collectionNotes: string | null;
                                    analyzerId: string | null;
                                    analyzerName: string | null;
                                    handedOverAt: Date | null;
                                    labelsPrinted: number | null;
                                    collectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                } | null;
                            }[];
                            appointmentId: string | null;
                            inpatientStayId: string | null;
                            patientId: string;
                            ownerId: string;
                            activity: {
                                type: import("@/generated/prisma/enums").LabActivityType;
                                id: string;
                                createdAt: Date;
                                detail: string | null;
                                itemId: string | null;
                                author: {
                                    name: string;
                                    id: string;
                                } | null;
                            }[];
                            isUrgent: boolean;
                            qcReviewedAt: Date | null;
                            qcRules: string[];
                            requestedBy: {
                                name: string;
                                id: string;
                                phone: string | null;
                            } | null;
                            qcReviewedBy: {
                                name: string;
                                id: string;
                            } | null;
                            preAnalytical: {
                                id: string;
                                vitalsRecordId: string | null;
                                vitalsRecord: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    code: string;
                                    branchId: string | null;
                                    notes: string | null;
                                    editsCount: number;
                                    operationId: string | null;
                                    appointmentId: string | null;
                                    labOrderId: string | null;
                                    radiologyOrderId: string | null;
                                    patientId: string;
                                    source: import("@/generated/prisma/enums").VitalSignsSource;
                                    weight: import("@prisma/client-runtime-utils").Decimal | null;
                                    recordedAt: Date;
                                    temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                    heartRate: number | null;
                                    respiratoryRate: number | null;
                                    oxygenSaturation: number | null;
                                    bloodPressure: string | null;
                                    painScore: number | null;
                                    bodyConditionScore: number | null;
                                    capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                    mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                    correctsId: string | null;
                                    recordedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    correction: {
                                        id: string;
                                        code: string;
                                        recordedAt: Date;
                                    } | null;
                                } | null;
                                orderId: string;
                                fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                fastingHours: number | null;
                                medications: string[];
                                ivFluids24h: boolean | null;
                            } | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا يمكنك حذف تعليق غيرك";
                        };
                        404: {
                            readonly message: "التعليق غير موجود";
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
    "lab-tests": {
        items: {
            ":itemId": {
                analyzers: {
                    get: {
                        body: {};
                        params: {
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("@/server/lab-tests/lab-analyzers.service").LabAnalyzerAvailability[];
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
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
    "lab-tests": {
        items: {
            ":itemId": {
                analyzer: {
                    patch: {
                        body: {
                            analyzerId: string | null;
                        };
                        params: {
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                comments: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    body: string;
                                    author: {
                                        name: string;
                                        id: string;
                                    };
                                    mentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                }[];
                                branch: {
                                    name: string;
                                    id: string;
                                };
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                };
                                patient: {
                                    animalType: {
                                        id: string;
                                        arName: string;
                                    };
                                    animalStrain: {
                                        id: string;
                                        arName: string;
                                    } | null;
                                    name: string;
                                    id: string;
                                    code: string;
                                    gender: import("@/generated/prisma/enums").Gender;
                                    age: number | null;
                                };
                                appointment: {
                                    id: string;
                                    code: string;
                                    startsAt: Date;
                                } | null;
                                invoice: {
                                    discount: import("@prisma/client-runtime-utils").Decimal;
                                    id: string;
                                    clinicId: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    vatRate: import("@prisma/client-runtime-utils").Decimal;
                                    currencyCode: string;
                                    code: string;
                                    status: import("@/generated/prisma/enums").InvoiceStatus;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                    paidAt: Date | null;
                                    appointmentId: string | null;
                                    labOrderId: string | null;
                                    subtotal: import("@prisma/client-runtime-utils").Decimal;
                                    amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                    membershipId: string | null;
                                    refundedAt: Date | null;
                                    refundReason: string | null;
                                    membershipAdjustments: {
                                        id: string;
                                        amount: import("@prisma/client-runtime-utils").Decimal;
                                        lineRef: string;
                                        benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                        unitsConsumed: number;
                                    }[];
                                } | null;
                                priority: import("@/generated/prisma/enums").TaskPriority | null;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                branchId: string;
                                notes: string | null;
                                items: {
                                    service: {
                                        name: string;
                                        id: string;
                                    };
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    report: string | null;
                                    status: LabTestStatus;
                                    serviceId: string;
                                    results: {
                                        value: string | null;
                                        name: string;
                                        id: string;
                                        order: number;
                                        notes: string | null;
                                        section: string | null;
                                        unit: string | null;
                                        refLow: import("@prisma/client-runtime-utils").Decimal | null;
                                        refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                                        parameterId: string | null;
                                        numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                                        flag: import("@/generated/prisma/enums").LabResultFlag;
                                    }[];
                                    paidAt: Date | null;
                                    rejectionReason: string | null;
                                    completedAt: Date | null;
                                    orderId: string;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    sampleStage: import("@/generated/prisma/enums").LabSampleStage;
                                    scheduledAt: Date | null;
                                    reviewedAt: Date | null;
                                    rejectedAt: Date | null;
                                    assignedTo: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reviewedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    rejectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reportMentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                    sampleCollection: {
                                        id: string;
                                        attempts: number | null;
                                        itemId: string;
                                        tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                                        drawSite: string | null;
                                        volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                        collectedAt: Date | null;
                                        quality: import("@/generated/prisma/enums").LabSampleQuality | null;
                                        collectionNotes: string | null;
                                        analyzerId: string | null;
                                        analyzerName: string | null;
                                        handedOverAt: Date | null;
                                        labelsPrinted: number | null;
                                        collectedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                    } | null;
                                }[];
                                appointmentId: string | null;
                                inpatientStayId: string | null;
                                patientId: string;
                                ownerId: string;
                                activity: {
                                    type: import("@/generated/prisma/enums").LabActivityType;
                                    id: string;
                                    createdAt: Date;
                                    detail: string | null;
                                    itemId: string | null;
                                    author: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                                isUrgent: boolean;
                                qcReviewedAt: Date | null;
                                qcRules: string[];
                                requestedBy: {
                                    name: string;
                                    id: string;
                                    phone: string | null;
                                } | null;
                                qcReviewedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                preAnalytical: {
                                    id: string;
                                    vitalsRecordId: string | null;
                                    vitalsRecord: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        code: string;
                                        branchId: string | null;
                                        notes: string | null;
                                        editsCount: number;
                                        operationId: string | null;
                                        appointmentId: string | null;
                                        labOrderId: string | null;
                                        radiologyOrderId: string | null;
                                        patientId: string;
                                        source: import("@/generated/prisma/enums").VitalSignsSource;
                                        weight: import("@prisma/client-runtime-utils").Decimal | null;
                                        recordedAt: Date;
                                        temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                        heartRate: number | null;
                                        respiratoryRate: number | null;
                                        oxygenSaturation: number | null;
                                        bloodPressure: string | null;
                                        painScore: number | null;
                                        bodyConditionScore: number | null;
                                        capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                        mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                        correctsId: string | null;
                                        recordedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        correction: {
                                            id: string;
                                            code: string;
                                            recordedAt: Date;
                                        } | null;
                                    } | null;
                                    orderId: string;
                                    fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                    fastingHours: number | null;
                                    medications: string[];
                                    ivFluids24h: boolean | null;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
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
    "lab-tests": {
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
                        comments: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            body: string;
                            author: {
                                name: string;
                                id: string;
                            };
                            mentions: {
                                staff: {
                                    name: string;
                                    id: string;
                                };
                            }[];
                        }[];
                        branch: {
                            name: string;
                            id: string;
                        };
                        owner: {
                            name: string;
                            id: string;
                            phone: string;
                        };
                        patient: {
                            animalType: {
                                id: string;
                                arName: string;
                            };
                            animalStrain: {
                                id: string;
                                arName: string;
                            } | null;
                            name: string;
                            id: string;
                            code: string;
                            gender: import("@/generated/prisma/enums").Gender;
                            age: number | null;
                        };
                        appointment: {
                            id: string;
                            code: string;
                            startsAt: Date;
                        } | null;
                        invoice: {
                            discount: import("@prisma/client-runtime-utils").Decimal;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            vatRate: import("@prisma/client-runtime-utils").Decimal;
                            currencyCode: string;
                            code: string;
                            status: import("@/generated/prisma/enums").InvoiceStatus;
                            total: import("@prisma/client-runtime-utils").Decimal;
                            vatAmount: import("@prisma/client-runtime-utils").Decimal;
                            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                            paidAt: Date | null;
                            appointmentId: string | null;
                            labOrderId: string | null;
                            subtotal: import("@prisma/client-runtime-utils").Decimal;
                            amountPaid: import("@prisma/client-runtime-utils").Decimal;
                            membershipId: string | null;
                            refundedAt: Date | null;
                            refundReason: string | null;
                            membershipAdjustments: {
                                id: string;
                                amount: import("@prisma/client-runtime-utils").Decimal;
                                lineRef: string;
                                benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                unitsConsumed: number;
                            }[];
                        } | null;
                        priority: import("@/generated/prisma/enums").TaskPriority | null;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        code: string;
                        branchId: string;
                        notes: string | null;
                        items: {
                            service: {
                                name: string;
                                id: string;
                            };
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            report: string | null;
                            status: LabTestStatus;
                            serviceId: string;
                            results: {
                                value: string | null;
                                name: string;
                                id: string;
                                order: number;
                                notes: string | null;
                                section: string | null;
                                unit: string | null;
                                refLow: import("@prisma/client-runtime-utils").Decimal | null;
                                refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                                parameterId: string | null;
                                numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                                flag: import("@/generated/prisma/enums").LabResultFlag;
                            }[];
                            paidAt: Date | null;
                            rejectionReason: string | null;
                            completedAt: Date | null;
                            orderId: string;
                            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                            sampleStage: import("@/generated/prisma/enums").LabSampleStage;
                            scheduledAt: Date | null;
                            reviewedAt: Date | null;
                            rejectedAt: Date | null;
                            assignedTo: {
                                name: string;
                                id: string;
                            } | null;
                            reviewedBy: {
                                name: string;
                                id: string;
                            } | null;
                            rejectedBy: {
                                name: string;
                                id: string;
                            } | null;
                            reportMentions: {
                                staff: {
                                    name: string;
                                    id: string;
                                };
                            }[];
                            sampleCollection: {
                                id: string;
                                attempts: number | null;
                                itemId: string;
                                tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                                drawSite: string | null;
                                volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                collectedAt: Date | null;
                                quality: import("@/generated/prisma/enums").LabSampleQuality | null;
                                collectionNotes: string | null;
                                analyzerId: string | null;
                                analyzerName: string | null;
                                handedOverAt: Date | null;
                                labelsPrinted: number | null;
                                collectedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                            } | null;
                        }[];
                        appointmentId: string | null;
                        inpatientStayId: string | null;
                        patientId: string;
                        ownerId: string;
                        activity: {
                            type: import("@/generated/prisma/enums").LabActivityType;
                            id: string;
                            createdAt: Date;
                            detail: string | null;
                            itemId: string | null;
                            author: {
                                name: string;
                                id: string;
                            } | null;
                        }[];
                        isUrgent: boolean;
                        qcReviewedAt: Date | null;
                        qcRules: string[];
                        requestedBy: {
                            name: string;
                            id: string;
                            phone: string | null;
                        } | null;
                        qcReviewedBy: {
                            name: string;
                            id: string;
                        } | null;
                        preAnalytical: {
                            id: string;
                            vitalsRecordId: string | null;
                            vitalsRecord: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                branchId: string | null;
                                notes: string | null;
                                editsCount: number;
                                operationId: string | null;
                                appointmentId: string | null;
                                labOrderId: string | null;
                                radiologyOrderId: string | null;
                                patientId: string;
                                source: import("@/generated/prisma/enums").VitalSignsSource;
                                weight: import("@prisma/client-runtime-utils").Decimal | null;
                                recordedAt: Date;
                                temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                heartRate: number | null;
                                respiratoryRate: number | null;
                                oxygenSaturation: number | null;
                                bloodPressure: string | null;
                                painScore: number | null;
                                bodyConditionScore: number | null;
                                capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                correctsId: string | null;
                                recordedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                correction: {
                                    id: string;
                                    code: string;
                                    recordedAt: Date;
                                } | null;
                            } | null;
                            orderId: string;
                            fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                            fastingHours: number | null;
                            medications: string[];
                            ivFluids24h: boolean | null;
                        } | null;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    404: {
                        message: string;
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
    "lab-tests": {
        post: {
            body: {
                priority?: "MEDIUM" | "LOW" | "HIGH" | "URGENT" | null | undefined;
                notes?: string | null | undefined;
                origin?: "VISIT" | "DIRECT" | undefined;
                appointmentId?: string | null | undefined;
                inpatientStayId?: string | null | undefined;
                requestedById?: string | null | undefined;
                isUrgent?: boolean | undefined;
                assignedToId?: string | null | undefined;
                branchId: string;
                patientId: string;
                ownerId: string;
                serviceIds: string[];
            };
            params: {};
            query: {};
            headers: {};
            response: {
                201: {
                    comments: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        body: string;
                        author: {
                            name: string;
                            id: string;
                        };
                        mentions: {
                            staff: {
                                name: string;
                                id: string;
                            };
                        }[];
                    }[];
                    branch: {
                        name: string;
                        id: string;
                    };
                    owner: {
                        name: string;
                        id: string;
                        phone: string;
                    };
                    patient: {
                        animalType: {
                            id: string;
                            arName: string;
                        };
                        animalStrain: {
                            id: string;
                            arName: string;
                        } | null;
                        name: string;
                        id: string;
                        code: string;
                        gender: import("@/generated/prisma/enums").Gender;
                        age: number | null;
                    };
                    appointment: {
                        id: string;
                        code: string;
                        startsAt: Date;
                    } | null;
                    invoice: {
                        discount: import("@prisma/client-runtime-utils").Decimal;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        vatRate: import("@prisma/client-runtime-utils").Decimal;
                        currencyCode: string;
                        code: string;
                        status: import("@/generated/prisma/enums").InvoiceStatus;
                        total: import("@prisma/client-runtime-utils").Decimal;
                        vatAmount: import("@prisma/client-runtime-utils").Decimal;
                        paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                        paidAt: Date | null;
                        appointmentId: string | null;
                        labOrderId: string | null;
                        subtotal: import("@prisma/client-runtime-utils").Decimal;
                        amountPaid: import("@prisma/client-runtime-utils").Decimal;
                        membershipId: string | null;
                        refundedAt: Date | null;
                        refundReason: string | null;
                        membershipAdjustments: {
                            id: string;
                            amount: import("@prisma/client-runtime-utils").Decimal;
                            lineRef: string;
                            benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                            unitsConsumed: number;
                        }[];
                    } | null;
                    priority: import("@/generated/prisma/enums").TaskPriority | null;
                    id: string;
                    clinicId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    code: string;
                    branchId: string;
                    notes: string | null;
                    items: {
                        service: {
                            name: string;
                            id: string;
                        };
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        report: string | null;
                        status: LabTestStatus;
                        serviceId: string;
                        results: {
                            value: string | null;
                            name: string;
                            id: string;
                            order: number;
                            notes: string | null;
                            section: string | null;
                            unit: string | null;
                            refLow: import("@prisma/client-runtime-utils").Decimal | null;
                            refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                            parameterId: string | null;
                            numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                            flag: import("@/generated/prisma/enums").LabResultFlag;
                        }[];
                        paidAt: Date | null;
                        rejectionReason: string | null;
                        completedAt: Date | null;
                        orderId: string;
                        priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                        sampleStage: import("@/generated/prisma/enums").LabSampleStage;
                        scheduledAt: Date | null;
                        reviewedAt: Date | null;
                        rejectedAt: Date | null;
                        assignedTo: {
                            name: string;
                            id: string;
                        } | null;
                        reviewedBy: {
                            name: string;
                            id: string;
                        } | null;
                        rejectedBy: {
                            name: string;
                            id: string;
                        } | null;
                        reportMentions: {
                            staff: {
                                name: string;
                                id: string;
                            };
                        }[];
                        sampleCollection: {
                            id: string;
                            attempts: number | null;
                            itemId: string;
                            tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                            drawSite: string | null;
                            volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                            collectedAt: Date | null;
                            quality: import("@/generated/prisma/enums").LabSampleQuality | null;
                            collectionNotes: string | null;
                            analyzerId: string | null;
                            analyzerName: string | null;
                            handedOverAt: Date | null;
                            labelsPrinted: number | null;
                            collectedBy: {
                                name: string;
                                id: string;
                            } | null;
                        } | null;
                    }[];
                    appointmentId: string | null;
                    inpatientStayId: string | null;
                    patientId: string;
                    ownerId: string;
                    activity: {
                        type: import("@/generated/prisma/enums").LabActivityType;
                        id: string;
                        createdAt: Date;
                        detail: string | null;
                        itemId: string | null;
                        author: {
                            name: string;
                            id: string;
                        } | null;
                    }[];
                    isUrgent: boolean;
                    qcReviewedAt: Date | null;
                    qcRules: string[];
                    requestedBy: {
                        name: string;
                        id: string;
                        phone: string | null;
                    } | null;
                    qcReviewedBy: {
                        name: string;
                        id: string;
                    } | null;
                    preAnalytical: {
                        id: string;
                        vitalsRecordId: string | null;
                        vitalsRecord: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            code: string;
                            branchId: string | null;
                            notes: string | null;
                            editsCount: number;
                            operationId: string | null;
                            appointmentId: string | null;
                            labOrderId: string | null;
                            radiologyOrderId: string | null;
                            patientId: string;
                            source: import("@/generated/prisma/enums").VitalSignsSource;
                            weight: import("@prisma/client-runtime-utils").Decimal | null;
                            recordedAt: Date;
                            temperature: import("@prisma/client-runtime-utils").Decimal | null;
                            heartRate: number | null;
                            respiratoryRate: number | null;
                            oxygenSaturation: number | null;
                            bloodPressure: string | null;
                            painScore: number | null;
                            bodyConditionScore: number | null;
                            capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                            mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                            correctsId: string | null;
                            recordedBy: {
                                name: string;
                                id: string;
                            } | null;
                            correction: {
                                id: string;
                                code: string;
                                recordedAt: Date;
                            } | null;
                        } | null;
                        orderId: string;
                        fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                        fastingHours: number | null;
                        medications: string[];
                        ivFluids24h: boolean | null;
                    } | null;
                } | null;
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
    "lab-tests": {
        ":id": {
            "pre-analytical": {
                patch: {
                    body: {
                        fastingStatus?: "PARTIAL" | "FASTED" | "NOT_FASTED" | null | undefined;
                        fastingHours?: number | null | undefined;
                        medications?: string[] | undefined;
                        ivFluids24h?: boolean | null | undefined;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            comments: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                body: string;
                                author: {
                                    name: string;
                                    id: string;
                                };
                                mentions: {
                                    staff: {
                                        name: string;
                                        id: string;
                                    };
                                }[];
                            }[];
                            branch: {
                                name: string;
                                id: string;
                            };
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                            };
                            patient: {
                                animalType: {
                                    id: string;
                                    arName: string;
                                };
                                animalStrain: {
                                    id: string;
                                    arName: string;
                                } | null;
                                name: string;
                                id: string;
                                code: string;
                                gender: import("@/generated/prisma/enums").Gender;
                                age: number | null;
                            };
                            appointment: {
                                id: string;
                                code: string;
                                startsAt: Date;
                            } | null;
                            invoice: {
                                discount: import("@prisma/client-runtime-utils").Decimal;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                vatRate: import("@prisma/client-runtime-utils").Decimal;
                                currencyCode: string;
                                code: string;
                                status: import("@/generated/prisma/enums").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                                vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                paidAt: Date | null;
                                appointmentId: string | null;
                                labOrderId: string | null;
                                subtotal: import("@prisma/client-runtime-utils").Decimal;
                                amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                membershipId: string | null;
                                refundedAt: Date | null;
                                refundReason: string | null;
                                membershipAdjustments: {
                                    id: string;
                                    amount: import("@prisma/client-runtime-utils").Decimal;
                                    lineRef: string;
                                    benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                    unitsConsumed: number;
                                }[];
                            } | null;
                            priority: import("@/generated/prisma/enums").TaskPriority | null;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            code: string;
                            branchId: string;
                            notes: string | null;
                            items: {
                                service: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                report: string | null;
                                status: LabTestStatus;
                                serviceId: string;
                                results: {
                                    value: string | null;
                                    name: string;
                                    id: string;
                                    order: number;
                                    notes: string | null;
                                    section: string | null;
                                    unit: string | null;
                                    refLow: import("@prisma/client-runtime-utils").Decimal | null;
                                    refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                                    parameterId: string | null;
                                    numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                                    flag: import("@/generated/prisma/enums").LabResultFlag;
                                }[];
                                paidAt: Date | null;
                                rejectionReason: string | null;
                                completedAt: Date | null;
                                orderId: string;
                                priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                sampleStage: import("@/generated/prisma/enums").LabSampleStage;
                                scheduledAt: Date | null;
                                reviewedAt: Date | null;
                                rejectedAt: Date | null;
                                assignedTo: {
                                    name: string;
                                    id: string;
                                } | null;
                                reviewedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                rejectedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                reportMentions: {
                                    staff: {
                                        name: string;
                                        id: string;
                                    };
                                }[];
                                sampleCollection: {
                                    id: string;
                                    attempts: number | null;
                                    itemId: string;
                                    tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                                    drawSite: string | null;
                                    volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                    collectedAt: Date | null;
                                    quality: import("@/generated/prisma/enums").LabSampleQuality | null;
                                    collectionNotes: string | null;
                                    analyzerId: string | null;
                                    analyzerName: string | null;
                                    handedOverAt: Date | null;
                                    labelsPrinted: number | null;
                                    collectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                } | null;
                            }[];
                            appointmentId: string | null;
                            inpatientStayId: string | null;
                            patientId: string;
                            ownerId: string;
                            activity: {
                                type: import("@/generated/prisma/enums").LabActivityType;
                                id: string;
                                createdAt: Date;
                                detail: string | null;
                                itemId: string | null;
                                author: {
                                    name: string;
                                    id: string;
                                } | null;
                            }[];
                            isUrgent: boolean;
                            qcReviewedAt: Date | null;
                            qcRules: string[];
                            requestedBy: {
                                name: string;
                                id: string;
                                phone: string | null;
                            } | null;
                            qcReviewedBy: {
                                name: string;
                                id: string;
                            } | null;
                            preAnalytical: {
                                id: string;
                                vitalsRecordId: string | null;
                                vitalsRecord: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    code: string;
                                    branchId: string | null;
                                    notes: string | null;
                                    editsCount: number;
                                    operationId: string | null;
                                    appointmentId: string | null;
                                    labOrderId: string | null;
                                    radiologyOrderId: string | null;
                                    patientId: string;
                                    source: import("@/generated/prisma/enums").VitalSignsSource;
                                    weight: import("@prisma/client-runtime-utils").Decimal | null;
                                    recordedAt: Date;
                                    temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                    heartRate: number | null;
                                    respiratoryRate: number | null;
                                    oxygenSaturation: number | null;
                                    bloodPressure: string | null;
                                    painScore: number | null;
                                    bodyConditionScore: number | null;
                                    capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                    mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                    correctsId: string | null;
                                    recordedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    correction: {
                                        id: string;
                                        code: string;
                                        recordedAt: Date;
                                    } | null;
                                } | null;
                                orderId: string;
                                fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                fastingHours: number | null;
                                medications: string[];
                                ivFluids24h: boolean | null;
                            } | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            message: string;
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
    "lab-tests": {
        ":id": {
            invoice: {
                pay: {
                    post: {
                        body: {
                            insurance?: {
                                excludedLineRefs?: string[] | undefined;
                                apply?: boolean | undefined;
                            } | undefined;
                            itemId?: string | undefined;
                            paymentMethod: "CASH" | "CARD" | "TRANSFER";
                            amountPaid: number;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                discount: import("@prisma/client-runtime-utils").Decimal;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                vatRate: import("@prisma/client-runtime-utils").Decimal;
                                currencyCode: string;
                                code: string;
                                status: import("@/generated/prisma/enums").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                                vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                paidAt: Date | null;
                                appointmentId: string | null;
                                labOrderId: string | null;
                                subtotal: import("@prisma/client-runtime-utils").Decimal;
                                amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                membershipId: string | null;
                                refundedAt: Date | null;
                                refundReason: string | null;
                                membershipAdjustments: {
                                    id: string;
                                    amount: import("@prisma/client-runtime-utils").Decimal;
                                    lineRef: string;
                                    benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                    unitsConsumed: number;
                                }[];
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
                            };
                            422: {
                                readonly message: "لا توجد تحاليل في هذا الطلب";
                            } | {
                                readonly message: "الفاتورة مسدَّدة بالفعل";
                            } | {
                                readonly message: "هذا التحليل مسدَّد مسبقًا";
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
    "lab-tests": {
        items: {
            ":itemId": {
                priors: {
                    get: {
                        body: {};
                        params: {
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                service: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                createdAt: Date;
                                report: string | null;
                                order: {
                                    id: string;
                                    createdAt: Date;
                                    code: string;
                                };
                                results: {
                                    value: string | null;
                                    name: string;
                                    id: string;
                                    order: number;
                                    notes: string | null;
                                    section: string | null;
                                    unit: string | null;
                                    refLow: import("@prisma/client-runtime-utils").Decimal | null;
                                    refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                                    parameterId: string | null;
                                    numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                                    flag: import("@/generated/prisma/enums").LabResultFlag;
                                }[];
                                completedAt: Date | null;
                                orderId: string;
                                reviewedAt: Date | null;
                            }[];
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                readonly message: "التحليل غير موجود";
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
    "lab-tests": {
        ":id": {
            comments: {
                post: {
                    body: {
                        mentionedStaffIds?: string[] | undefined;
                        body: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            comments: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                body: string;
                                author: {
                                    name: string;
                                    id: string;
                                };
                                mentions: {
                                    staff: {
                                        name: string;
                                        id: string;
                                    };
                                }[];
                            }[];
                            branch: {
                                name: string;
                                id: string;
                            };
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                            };
                            patient: {
                                animalType: {
                                    id: string;
                                    arName: string;
                                };
                                animalStrain: {
                                    id: string;
                                    arName: string;
                                } | null;
                                name: string;
                                id: string;
                                code: string;
                                gender: import("@/generated/prisma/enums").Gender;
                                age: number | null;
                            };
                            appointment: {
                                id: string;
                                code: string;
                                startsAt: Date;
                            } | null;
                            invoice: {
                                discount: import("@prisma/client-runtime-utils").Decimal;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                vatRate: import("@prisma/client-runtime-utils").Decimal;
                                currencyCode: string;
                                code: string;
                                status: import("@/generated/prisma/enums").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                                vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                paidAt: Date | null;
                                appointmentId: string | null;
                                labOrderId: string | null;
                                subtotal: import("@prisma/client-runtime-utils").Decimal;
                                amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                membershipId: string | null;
                                refundedAt: Date | null;
                                refundReason: string | null;
                                membershipAdjustments: {
                                    id: string;
                                    amount: import("@prisma/client-runtime-utils").Decimal;
                                    lineRef: string;
                                    benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                    unitsConsumed: number;
                                }[];
                            } | null;
                            priority: import("@/generated/prisma/enums").TaskPriority | null;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            code: string;
                            branchId: string;
                            notes: string | null;
                            items: {
                                service: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                report: string | null;
                                status: LabTestStatus;
                                serviceId: string;
                                results: {
                                    value: string | null;
                                    name: string;
                                    id: string;
                                    order: number;
                                    notes: string | null;
                                    section: string | null;
                                    unit: string | null;
                                    refLow: import("@prisma/client-runtime-utils").Decimal | null;
                                    refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                                    parameterId: string | null;
                                    numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                                    flag: import("@/generated/prisma/enums").LabResultFlag;
                                }[];
                                paidAt: Date | null;
                                rejectionReason: string | null;
                                completedAt: Date | null;
                                orderId: string;
                                priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                sampleStage: import("@/generated/prisma/enums").LabSampleStage;
                                scheduledAt: Date | null;
                                reviewedAt: Date | null;
                                rejectedAt: Date | null;
                                assignedTo: {
                                    name: string;
                                    id: string;
                                } | null;
                                reviewedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                rejectedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                reportMentions: {
                                    staff: {
                                        name: string;
                                        id: string;
                                    };
                                }[];
                                sampleCollection: {
                                    id: string;
                                    attempts: number | null;
                                    itemId: string;
                                    tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                                    drawSite: string | null;
                                    volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                    collectedAt: Date | null;
                                    quality: import("@/generated/prisma/enums").LabSampleQuality | null;
                                    collectionNotes: string | null;
                                    analyzerId: string | null;
                                    analyzerName: string | null;
                                    handedOverAt: Date | null;
                                    labelsPrinted: number | null;
                                    collectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                } | null;
                            }[];
                            appointmentId: string | null;
                            inpatientStayId: string | null;
                            patientId: string;
                            ownerId: string;
                            activity: {
                                type: import("@/generated/prisma/enums").LabActivityType;
                                id: string;
                                createdAt: Date;
                                detail: string | null;
                                itemId: string | null;
                                author: {
                                    name: string;
                                    id: string;
                                } | null;
                            }[];
                            isUrgent: boolean;
                            qcReviewedAt: Date | null;
                            qcRules: string[];
                            requestedBy: {
                                name: string;
                                id: string;
                                phone: string | null;
                            } | null;
                            qcReviewedBy: {
                                name: string;
                                id: string;
                            } | null;
                            preAnalytical: {
                                id: string;
                                vitalsRecordId: string | null;
                                vitalsRecord: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    code: string;
                                    branchId: string | null;
                                    notes: string | null;
                                    editsCount: number;
                                    operationId: string | null;
                                    appointmentId: string | null;
                                    labOrderId: string | null;
                                    radiologyOrderId: string | null;
                                    patientId: string;
                                    source: import("@/generated/prisma/enums").VitalSignsSource;
                                    weight: import("@prisma/client-runtime-utils").Decimal | null;
                                    recordedAt: Date;
                                    temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                    heartRate: number | null;
                                    respiratoryRate: number | null;
                                    oxygenSaturation: number | null;
                                    bloodPressure: string | null;
                                    painScore: number | null;
                                    bodyConditionScore: number | null;
                                    capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                    mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                    correctsId: string | null;
                                    recordedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    correction: {
                                        id: string;
                                        code: string;
                                        recordedAt: Date;
                                    } | null;
                                } | null;
                                orderId: string;
                                fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                fastingHours: number | null;
                                medications: string[];
                                ivFluids24h: boolean | null;
                            } | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            message: string;
                        };
                        422: {
                            readonly message: "اكتب التعليق";
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
    "lab-tests": {
        ":id": {
            priority: {
                patch: {
                    body: {
                        priority: "MEDIUM" | "LOW" | "HIGH" | "URGENT" | null;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            comments: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                body: string;
                                author: {
                                    name: string;
                                    id: string;
                                };
                                mentions: {
                                    staff: {
                                        name: string;
                                        id: string;
                                    };
                                }[];
                            }[];
                            branch: {
                                name: string;
                                id: string;
                            };
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                            };
                            patient: {
                                animalType: {
                                    id: string;
                                    arName: string;
                                };
                                animalStrain: {
                                    id: string;
                                    arName: string;
                                } | null;
                                name: string;
                                id: string;
                                code: string;
                                gender: import("@/generated/prisma/enums").Gender;
                                age: number | null;
                            };
                            appointment: {
                                id: string;
                                code: string;
                                startsAt: Date;
                            } | null;
                            invoice: {
                                discount: import("@prisma/client-runtime-utils").Decimal;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                vatRate: import("@prisma/client-runtime-utils").Decimal;
                                currencyCode: string;
                                code: string;
                                status: import("@/generated/prisma/enums").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                                vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                paidAt: Date | null;
                                appointmentId: string | null;
                                labOrderId: string | null;
                                subtotal: import("@prisma/client-runtime-utils").Decimal;
                                amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                membershipId: string | null;
                                refundedAt: Date | null;
                                refundReason: string | null;
                                membershipAdjustments: {
                                    id: string;
                                    amount: import("@prisma/client-runtime-utils").Decimal;
                                    lineRef: string;
                                    benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                    unitsConsumed: number;
                                }[];
                            } | null;
                            priority: import("@/generated/prisma/enums").TaskPriority | null;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            code: string;
                            branchId: string;
                            notes: string | null;
                            items: {
                                service: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                report: string | null;
                                status: LabTestStatus;
                                serviceId: string;
                                results: {
                                    value: string | null;
                                    name: string;
                                    id: string;
                                    order: number;
                                    notes: string | null;
                                    section: string | null;
                                    unit: string | null;
                                    refLow: import("@prisma/client-runtime-utils").Decimal | null;
                                    refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                                    parameterId: string | null;
                                    numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                                    flag: import("@/generated/prisma/enums").LabResultFlag;
                                }[];
                                paidAt: Date | null;
                                rejectionReason: string | null;
                                completedAt: Date | null;
                                orderId: string;
                                priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                sampleStage: import("@/generated/prisma/enums").LabSampleStage;
                                scheduledAt: Date | null;
                                reviewedAt: Date | null;
                                rejectedAt: Date | null;
                                assignedTo: {
                                    name: string;
                                    id: string;
                                } | null;
                                reviewedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                rejectedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                reportMentions: {
                                    staff: {
                                        name: string;
                                        id: string;
                                    };
                                }[];
                                sampleCollection: {
                                    id: string;
                                    attempts: number | null;
                                    itemId: string;
                                    tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                                    drawSite: string | null;
                                    volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                    collectedAt: Date | null;
                                    quality: import("@/generated/prisma/enums").LabSampleQuality | null;
                                    collectionNotes: string | null;
                                    analyzerId: string | null;
                                    analyzerName: string | null;
                                    handedOverAt: Date | null;
                                    labelsPrinted: number | null;
                                    collectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                } | null;
                            }[];
                            appointmentId: string | null;
                            inpatientStayId: string | null;
                            patientId: string;
                            ownerId: string;
                            activity: {
                                type: import("@/generated/prisma/enums").LabActivityType;
                                id: string;
                                createdAt: Date;
                                detail: string | null;
                                itemId: string | null;
                                author: {
                                    name: string;
                                    id: string;
                                } | null;
                            }[];
                            isUrgent: boolean;
                            qcReviewedAt: Date | null;
                            qcRules: string[];
                            requestedBy: {
                                name: string;
                                id: string;
                                phone: string | null;
                            } | null;
                            qcReviewedBy: {
                                name: string;
                                id: string;
                            } | null;
                            preAnalytical: {
                                id: string;
                                vitalsRecordId: string | null;
                                vitalsRecord: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    code: string;
                                    branchId: string | null;
                                    notes: string | null;
                                    editsCount: number;
                                    operationId: string | null;
                                    appointmentId: string | null;
                                    labOrderId: string | null;
                                    radiologyOrderId: string | null;
                                    patientId: string;
                                    source: import("@/generated/prisma/enums").VitalSignsSource;
                                    weight: import("@prisma/client-runtime-utils").Decimal | null;
                                    recordedAt: Date;
                                    temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                    heartRate: number | null;
                                    respiratoryRate: number | null;
                                    oxygenSaturation: number | null;
                                    bloodPressure: string | null;
                                    painScore: number | null;
                                    bodyConditionScore: number | null;
                                    capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                    mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                    correctsId: string | null;
                                    recordedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    correction: {
                                        id: string;
                                        code: string;
                                        recordedAt: Date;
                                    } | null;
                                } | null;
                                orderId: string;
                                fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                fastingHours: number | null;
                                medications: string[];
                                ivFluids24h: boolean | null;
                            } | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            message: string;
                        };
                        422: {
                            readonly message: "لا يمكن تغيير الأولوية بعد بدء سحب العيّنة";
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
    "lab-tests": {
        ":id": {
            confirm: {
                post: {
                    body: {
                        priority?: "MEDIUM" | "LOW" | "HIGH" | "URGENT" | null | undefined;
                        notes?: string | null | undefined;
                        assignedToId?: string | null | undefined;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            comments: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                body: string;
                                author: {
                                    name: string;
                                    id: string;
                                };
                                mentions: {
                                    staff: {
                                        name: string;
                                        id: string;
                                    };
                                }[];
                            }[];
                            branch: {
                                name: string;
                                id: string;
                            };
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                            };
                            patient: {
                                animalType: {
                                    id: string;
                                    arName: string;
                                };
                                animalStrain: {
                                    id: string;
                                    arName: string;
                                } | null;
                                name: string;
                                id: string;
                                code: string;
                                gender: import("@/generated/prisma/enums").Gender;
                                age: number | null;
                            };
                            appointment: {
                                id: string;
                                code: string;
                                startsAt: Date;
                            } | null;
                            invoice: {
                                discount: import("@prisma/client-runtime-utils").Decimal;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                vatRate: import("@prisma/client-runtime-utils").Decimal;
                                currencyCode: string;
                                code: string;
                                status: import("@/generated/prisma/enums").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                                vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                paidAt: Date | null;
                                appointmentId: string | null;
                                labOrderId: string | null;
                                subtotal: import("@prisma/client-runtime-utils").Decimal;
                                amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                membershipId: string | null;
                                refundedAt: Date | null;
                                refundReason: string | null;
                                membershipAdjustments: {
                                    id: string;
                                    amount: import("@prisma/client-runtime-utils").Decimal;
                                    lineRef: string;
                                    benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                    unitsConsumed: number;
                                }[];
                            } | null;
                            priority: import("@/generated/prisma/enums").TaskPriority | null;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            code: string;
                            branchId: string;
                            notes: string | null;
                            items: {
                                service: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                report: string | null;
                                status: LabTestStatus;
                                serviceId: string;
                                results: {
                                    value: string | null;
                                    name: string;
                                    id: string;
                                    order: number;
                                    notes: string | null;
                                    section: string | null;
                                    unit: string | null;
                                    refLow: import("@prisma/client-runtime-utils").Decimal | null;
                                    refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                                    parameterId: string | null;
                                    numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                                    flag: import("@/generated/prisma/enums").LabResultFlag;
                                }[];
                                paidAt: Date | null;
                                rejectionReason: string | null;
                                completedAt: Date | null;
                                orderId: string;
                                priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                sampleStage: import("@/generated/prisma/enums").LabSampleStage;
                                scheduledAt: Date | null;
                                reviewedAt: Date | null;
                                rejectedAt: Date | null;
                                assignedTo: {
                                    name: string;
                                    id: string;
                                } | null;
                                reviewedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                rejectedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                reportMentions: {
                                    staff: {
                                        name: string;
                                        id: string;
                                    };
                                }[];
                                sampleCollection: {
                                    id: string;
                                    attempts: number | null;
                                    itemId: string;
                                    tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                                    drawSite: string | null;
                                    volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                    collectedAt: Date | null;
                                    quality: import("@/generated/prisma/enums").LabSampleQuality | null;
                                    collectionNotes: string | null;
                                    analyzerId: string | null;
                                    analyzerName: string | null;
                                    handedOverAt: Date | null;
                                    labelsPrinted: number | null;
                                    collectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                } | null;
                            }[];
                            appointmentId: string | null;
                            inpatientStayId: string | null;
                            patientId: string;
                            ownerId: string;
                            activity: {
                                type: import("@/generated/prisma/enums").LabActivityType;
                                id: string;
                                createdAt: Date;
                                detail: string | null;
                                itemId: string | null;
                                author: {
                                    name: string;
                                    id: string;
                                } | null;
                            }[];
                            isUrgent: boolean;
                            qcReviewedAt: Date | null;
                            qcRules: string[];
                            requestedBy: {
                                name: string;
                                id: string;
                                phone: string | null;
                            } | null;
                            qcReviewedBy: {
                                name: string;
                                id: string;
                            } | null;
                            preAnalytical: {
                                id: string;
                                vitalsRecordId: string | null;
                                vitalsRecord: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    code: string;
                                    branchId: string | null;
                                    notes: string | null;
                                    editsCount: number;
                                    operationId: string | null;
                                    appointmentId: string | null;
                                    labOrderId: string | null;
                                    radiologyOrderId: string | null;
                                    patientId: string;
                                    source: import("@/generated/prisma/enums").VitalSignsSource;
                                    weight: import("@prisma/client-runtime-utils").Decimal | null;
                                    recordedAt: Date;
                                    temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                    heartRate: number | null;
                                    respiratoryRate: number | null;
                                    oxygenSaturation: number | null;
                                    bloodPressure: string | null;
                                    painScore: number | null;
                                    bodyConditionScore: number | null;
                                    capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                    mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                    correctsId: string | null;
                                    recordedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    correction: {
                                        id: string;
                                        code: string;
                                        recordedAt: Date;
                                    } | null;
                                } | null;
                                orderId: string;
                                fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                fastingHours: number | null;
                                medications: string[];
                                ivFluids24h: boolean | null;
                            } | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            message: string;
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
    "lab-tests": {
        ":id": {
            "qc-review": {
                post: {
                    body: {
                        rules: string[];
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            comments: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                body: string;
                                author: {
                                    name: string;
                                    id: string;
                                };
                                mentions: {
                                    staff: {
                                        name: string;
                                        id: string;
                                    };
                                }[];
                            }[];
                            branch: {
                                name: string;
                                id: string;
                            };
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                            };
                            patient: {
                                animalType: {
                                    id: string;
                                    arName: string;
                                };
                                animalStrain: {
                                    id: string;
                                    arName: string;
                                } | null;
                                name: string;
                                id: string;
                                code: string;
                                gender: import("@/generated/prisma/enums").Gender;
                                age: number | null;
                            };
                            appointment: {
                                id: string;
                                code: string;
                                startsAt: Date;
                            } | null;
                            invoice: {
                                discount: import("@prisma/client-runtime-utils").Decimal;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                vatRate: import("@prisma/client-runtime-utils").Decimal;
                                currencyCode: string;
                                code: string;
                                status: import("@/generated/prisma/enums").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                                vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                paidAt: Date | null;
                                appointmentId: string | null;
                                labOrderId: string | null;
                                subtotal: import("@prisma/client-runtime-utils").Decimal;
                                amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                membershipId: string | null;
                                refundedAt: Date | null;
                                refundReason: string | null;
                                membershipAdjustments: {
                                    id: string;
                                    amount: import("@prisma/client-runtime-utils").Decimal;
                                    lineRef: string;
                                    benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                    unitsConsumed: number;
                                }[];
                            } | null;
                            priority: import("@/generated/prisma/enums").TaskPriority | null;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            code: string;
                            branchId: string;
                            notes: string | null;
                            items: {
                                service: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                report: string | null;
                                status: LabTestStatus;
                                serviceId: string;
                                results: {
                                    value: string | null;
                                    name: string;
                                    id: string;
                                    order: number;
                                    notes: string | null;
                                    section: string | null;
                                    unit: string | null;
                                    refLow: import("@prisma/client-runtime-utils").Decimal | null;
                                    refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                                    parameterId: string | null;
                                    numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                                    flag: import("@/generated/prisma/enums").LabResultFlag;
                                }[];
                                paidAt: Date | null;
                                rejectionReason: string | null;
                                completedAt: Date | null;
                                orderId: string;
                                priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                sampleStage: import("@/generated/prisma/enums").LabSampleStage;
                                scheduledAt: Date | null;
                                reviewedAt: Date | null;
                                rejectedAt: Date | null;
                                assignedTo: {
                                    name: string;
                                    id: string;
                                } | null;
                                reviewedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                rejectedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                reportMentions: {
                                    staff: {
                                        name: string;
                                        id: string;
                                    };
                                }[];
                                sampleCollection: {
                                    id: string;
                                    attempts: number | null;
                                    itemId: string;
                                    tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                                    drawSite: string | null;
                                    volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                    collectedAt: Date | null;
                                    quality: import("@/generated/prisma/enums").LabSampleQuality | null;
                                    collectionNotes: string | null;
                                    analyzerId: string | null;
                                    analyzerName: string | null;
                                    handedOverAt: Date | null;
                                    labelsPrinted: number | null;
                                    collectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                } | null;
                            }[];
                            appointmentId: string | null;
                            inpatientStayId: string | null;
                            patientId: string;
                            ownerId: string;
                            activity: {
                                type: import("@/generated/prisma/enums").LabActivityType;
                                id: string;
                                createdAt: Date;
                                detail: string | null;
                                itemId: string | null;
                                author: {
                                    name: string;
                                    id: string;
                                } | null;
                            }[];
                            isUrgent: boolean;
                            qcReviewedAt: Date | null;
                            qcRules: string[];
                            requestedBy: {
                                name: string;
                                id: string;
                                phone: string | null;
                            } | null;
                            qcReviewedBy: {
                                name: string;
                                id: string;
                            } | null;
                            preAnalytical: {
                                id: string;
                                vitalsRecordId: string | null;
                                vitalsRecord: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    code: string;
                                    branchId: string | null;
                                    notes: string | null;
                                    editsCount: number;
                                    operationId: string | null;
                                    appointmentId: string | null;
                                    labOrderId: string | null;
                                    radiologyOrderId: string | null;
                                    patientId: string;
                                    source: import("@/generated/prisma/enums").VitalSignsSource;
                                    weight: import("@prisma/client-runtime-utils").Decimal | null;
                                    recordedAt: Date;
                                    temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                    heartRate: number | null;
                                    respiratoryRate: number | null;
                                    oxygenSaturation: number | null;
                                    bloodPressure: string | null;
                                    painScore: number | null;
                                    bodyConditionScore: number | null;
                                    capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                    mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                    correctsId: string | null;
                                    recordedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    correction: {
                                        id: string;
                                        code: string;
                                        recordedAt: Date;
                                    } | null;
                                } | null;
                                orderId: string;
                                fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                fastingHours: number | null;
                                medications: string[];
                                ivFluids24h: boolean | null;
                            } | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            message: string;
                        };
                        422: {
                            readonly message: "لا توجد نتائج لمراجعتها بعد";
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
    "lab-tests": {
        ":id": {
            decline: {
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
                            success: boolean;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            message: string;
                        };
                        422: {
                            readonly message: "رفض الطلب متاح في الطابور فقط";
                        } | {
                            readonly message: "اكتب سبب رفض الطلب";
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
    "lab-tests": {
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
                        success: boolean;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    404: {
                        message: string;
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
