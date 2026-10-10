import Elysia from "elysia";
/**
 * [PH0.4] وحدة الصيدلية والصرف — BRD_Pharmacy_Module.md.
 *
 * نسخة Elysia فرعية من أول يوم، لا `‎.use()‎` مستقلّ في السلسلة العليا: تعليمة رأس
 * `src/server/index.ts` صريحة — «لا تُطِل السلسلة» — والسلسلة العليا اليوم ٧٢ حلقة.
 * الوحدة ستحمل أربعة متحكّمات على الأقل (الإعدادات، الوصفات، الصرف، سجل المواد
 * المراقبة)، فبدء التجميع الآن يعني أن PH1 و PH3 و PH4 لا تمسّ `index.ts` أصلًا.
 *
 * وتنضمّ إلى `clinicalServer` لا كحيلة عدّ بل لأن مكانها هناك: الوصف يحدث داخل
 * الفحص السريري (BRD §11.1)، والجرعة تُحسب من وزن في `VitalSignsRecord` (§5.2).
 */
export declare const pharmacyServer: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "pharmacy-settings.update": import("@sinclair/typebox").TObject<{
            enabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            requireWitnessOnWaste: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            defaultLabelCopies: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            fefoSuggestion: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            controlledRegisterEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
    };
    error: {};
} & {
    typebox: {
        readonly "prescriptions.list": import("@sinclair/typebox").TObject<{
            status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAFT">, import("@sinclair/typebox").TLiteral<"ACTIVE">, import("@sinclair/typebox").TLiteral<"COMPLETED">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>>;
            patientId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            appointmentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            inpatientStayId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            prescriberId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "prescriptions.drugOptions": import("@sinclair/typebox").TObject<{
            search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "prescriptions.draftSig": import("@sinclair/typebox").TObject<{
            drugName: import("@sinclair/typebox").TString;
            doseText: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            measuredText: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            routeLabel: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            frequencyLabel: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            durationDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            speciesLabel: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            warnings: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        }>;
        readonly "prescriptions.create": import("@sinclair/typebox").TObject<{
            patientId: import("@sinclair/typebox").TString;
            appointmentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            inpatientStayId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            notesAr: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "prescriptions.addItem": import("@sinclair/typebox").TObject<{
            nameSnapshot: import("@sinclair/typebox").TString;
            inventoryItemId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            catalogProductId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            doseAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            doseUnit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            route: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            frequency: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            durationDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            quantity: import("@sinclair/typebox").TString;
            quantityUnit: import("@sinclair/typebox").TString;
            prn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            instructionsAr: import("@sinclair/typebox").TString;
            refillsAllowed: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            overrideReasonAr: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "prescriptions.updateItem": import("@sinclair/typebox").TObject<{
            nameSnapshot: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            inventoryItemId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            catalogProductId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            doseAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            doseUnit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            route: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            frequency: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            durationDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            quantityUnit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            prn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            instructionsAr: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            refillsAllowed: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            overrideReasonAr: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "prescriptions.cancel": import("@sinclair/typebox").TObject<{
            reasonAr: import("@sinclair/typebox").TString;
        }>;
        readonly "prescriptions.doseContext": import("@sinclair/typebox").TObject<{
            patientId: import("@sinclair/typebox").TString;
            genericKey: import("@sinclair/typebox").TString;
            route: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            frequencyCode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            durationDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        }>;
    };
    error: {};
} & {
    typebox: {
        readonly "dispense.create": import("@sinclair/typebox").TObject<{
            prescriptionItemId: import("@sinclair/typebox").TString;
            warehouseId: import("@sinclair/typebox").TString;
            quantity: import("@sinclair/typebox").TInteger;
            batchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            notesAr: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "dispense.batches": import("@sinclair/typebox").TObject<{
            itemId: import("@sinclair/typebox").TString;
            warehouseId: import("@sinclair/typebox").TString;
        }>;
    };
    error: {};
} & {
    typebox: {
        readonly "controlled.flag": import("@sinclair/typebox").TObject<{
            inventoryItemId: import("@sinclair/typebox").TString;
            scheduleClass: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "controlled.ledger": import("@sinclair/typebox").TObject<{
            inventoryItemId: import("@sinclair/typebox").TString;
            from: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            to: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "controlled.entry": import("@sinclair/typebox").TObject<{
            inventoryItemId: import("@sinclair/typebox").TString;
            movementType: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"RECEIPT">, import("@sinclair/typebox").TLiteral<"DISPENSE">, import("@sinclair/typebox").TLiteral<"WASTE">, import("@sinclair/typebox").TLiteral<"ADJUSTMENT">, import("@sinclair/typebox").TLiteral<"TRANSFER">]>;
            quantity: import("@sinclair/typebox").TInteger;
            witnessId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            reasonAr: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            occurredAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
    };
    error: {};
} & {
    typebox: {
        readonly "formulary.list": import("@sinclair/typebox").TObject<{
            search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "formulary.upsertMonograph": import("@sinclair/typebox").TObject<{
            genericKey: import("@sinclair/typebox").TString;
            genericName: import("@sinclair/typebox").TString;
            genericNameAr: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            summaryAr: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            summaryEn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            sourceCitation: import("@sinclair/typebox").TString;
            reviewedBy: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "formulary.upsertDose": import("@sinclair/typebox").TObject<{
            monographId: import("@sinclair/typebox").TString;
            species: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DOG">, import("@sinclair/typebox").TLiteral<"CAT">, import("@sinclair/typebox").TLiteral<"HORSE">, import("@sinclair/typebox").TLiteral<"CATTLE">, import("@sinclair/typebox").TLiteral<"SHEEP">, import("@sinclair/typebox").TLiteral<"GOAT">, import("@sinclair/typebox").TLiteral<"CAMEL">, import("@sinclair/typebox").TLiteral<"POULTRY">, import("@sinclair/typebox").TLiteral<"RABBIT">, import("@sinclair/typebox").TLiteral<"SWINE">, import("@sinclair/typebox").TLiteral<"FISH">, import("@sinclair/typebox").TLiteral<"BEE">]>;
            contraindicated: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            doseMin: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            doseMax: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            doseUnit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            route: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            frequency: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            durationNote: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            warningAr: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            warningEn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
    };
    error: {};
} & {
    typebox: {
        readonly "pharmacy-reports.range": import("@sinclair/typebox").TObject<{
            from: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            to: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
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
} & {
    schema: {};
    standaloneSchema: {};
    macro: Partial<{
        readonly requireClinic: boolean;
        readonly requirePharmacyView: boolean;
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
                isAdmin: boolean;
                permissions: string[];
            }>;
        };
        readonly requirePharmacyView: {
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
                readonly message: "لا تملك صلاحية عرض إعدادات الصيدلية";
            }, 403> | {
                clinicId: string;
                userId: string;
                isAdmin: boolean;
                permissions: string[];
            }>;
        };
    };
    parser: {};
    response: {};
} & {
    schema: {};
    standaloneSchema: {};
    macro: Partial<{
        readonly requirePharmacy: boolean;
    }>;
    macroFn: {
        readonly requirePharmacy: {
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
            }, 401> | import("elysia").ElysiaCustomStatusResponse<404, {
                readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
            }, 404> | {
                clinicId: string;
                userId: string;
                isAdmin: boolean;
                permissions: string[];
            }>;
        };
    };
    parser: {};
    response: {};
} & {
    schema: {};
    standaloneSchema: {};
    macro: Partial<{
        readonly requirePharmacy: boolean;
    }>;
    macroFn: {
        readonly requirePharmacy: {
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
            }, 401> | import("elysia").ElysiaCustomStatusResponse<404, {
                readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
            }, 404> | {
                clinicId: string;
                userId: string;
                isAdmin: boolean;
                permissions: string[];
            }>;
        };
    };
    parser: {};
    response: {};
} & {
    schema: {};
    standaloneSchema: {};
    macro: Partial<{
        readonly requireControlled: boolean;
    }>;
    macroFn: {
        readonly requireControlled: {
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
            }, 401> | import("elysia").ElysiaCustomStatusResponse<404, {
                readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
            }, 404> | import("elysia").ElysiaCustomStatusResponse<404, {
                readonly message: "سجل المواد المراقبة غير مفعّل لهذه الأكاديمية";
            }, 404> | {
                clinicId: string;
                userId: string;
                isAdmin: boolean;
                permissions: string[];
                requireWitnessOnWaste: boolean;
            }>;
        };
    };
    parser: {};
    response: {};
} & {
    schema: {};
    standaloneSchema: {};
    macro: Partial<{
        readonly requirePharmacy: boolean;
    }>;
    macroFn: {
        readonly requirePharmacy: {
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
            }, 401> | import("elysia").ElysiaCustomStatusResponse<404, {
                readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
            }, 404> | {
                clinicId: string;
                userId: string;
                isAdmin: boolean;
                permissions: string[];
            }>;
        };
    };
    parser: {};
    response: {};
} & {
    schema: {};
    standaloneSchema: {};
    macro: Partial<{
        readonly requirePharmacy: boolean;
    }>;
    macroFn: {
        readonly requirePharmacy: {
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
            }, 401> | import("elysia").ElysiaCustomStatusResponse<404, {
                readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
            }, 404> | {
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
    "pharmacy-settings": {};
} & {
    "pharmacy-settings": {
        get: {
            body: {};
            params: {};
            query: {};
            headers: {};
            response: {
                200: {
                    enabled: boolean;
                    requireWitnessOnWaste: boolean;
                    defaultLabelCopies: number;
                    fefoSuggestion: boolean;
                    blockExpiredDispense: boolean;
                    controlledRegisterEnabled: boolean;
                };
                401: {
                    readonly message: "غير مصرح";
                };
                403: {
                    readonly message: "لا تملك صلاحية عرض إعدادات الصيدلية";
                };
            };
        };
    };
} & {
    "pharmacy-settings": {
        patch: {
            body: {
                enabled?: boolean | undefined;
                requireWitnessOnWaste?: boolean | undefined;
                defaultLabelCopies?: number | undefined;
                fefoSuggestion?: boolean | undefined;
                controlledRegisterEnabled?: boolean | undefined;
            };
            params: {};
            query: {};
            headers: {};
            response: {
                200: {
                    enabled: boolean;
                    requireWitnessOnWaste: boolean;
                    defaultLabelCopies: number;
                    fefoSuggestion: boolean;
                    blockExpiredDispense: boolean;
                    controlledRegisterEnabled: boolean;
                };
                401: {
                    readonly message: "غير مصرح";
                };
                403: {
                    readonly message: "تعديل إعدادات الصيدلية متاح للمدير فقط";
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
    prescriptions: {};
} & {
    prescriptions: {
        get: {
            body: {};
            params: {};
            query: {
                search?: string | undefined;
                status?: "ACTIVE" | "DRAFT" | "CANCELLED" | "COMPLETED" | undefined;
                appointmentId?: string | undefined;
                inpatientStayId?: string | undefined;
                patientId?: string | undefined;
                prescriberId?: string | undefined;
            };
            headers: {};
            response: {
                200: {
                    patient: {
                        name: string;
                        id: string;
                        code: string;
                    };
                    id: string;
                    createdAt: Date;
                    _count: {
                        items: number;
                    };
                    code: string;
                    status: import("../../../generated/prisma/enums").PrescriptionStatus;
                    issuedAt: Date | null;
                    prescriber: {
                        name: string;
                        id: string;
                    } | null;
                }[];
                401: {
                    readonly message: "غير مصرح";
                };
                403: {
                    readonly message: "لا تملك صلاحية عرض الوصفات";
                };
                404: {
                    readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
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
    prescriptions: {
        "dose-context": {
            get: {
                body: {};
                params: {};
                query: {
                    route?: string | undefined;
                    durationDays?: number | undefined;
                    frequencyCode?: string | undefined;
                    patientId: string;
                    genericKey: string;
                };
                headers: {};
                response: {
                    200: {
                        speciesMapped: boolean;
                        species: import("../drug-catalog/drug-catalog.type").CatalogSpecies | null;
                        monographExistsForDrug: boolean;
                        monograph: {
                            id: string;
                            genericName: string;
                            genericNameAr: string | null;
                            summaryAr: string | null;
                        } | null;
                        weightKg: string | null;
                        weightRecordedAt: Date | null;
                        plan: {
                            dose: {
                                ok: true;
                                mg: string;
                                withinDocumentedRange: boolean;
                                source: "CALCULATED" | "OVERRIDE";
                                documentedRange: {
                                    min: string | null;
                                    max: string | null;
                                };
                                reason?: undefined;
                                message?: undefined;
                            } | {
                                ok: false;
                                reason: import("./dose.rules").DoseRefusalReason;
                                message: string;
                                mg?: undefined;
                                withinDocumentedRange?: undefined;
                                source?: undefined;
                                documentedRange?: undefined;
                            };
                            measured: {
                                ok: true;
                                amount: string;
                                unit: "mL" | "g" | "قرص";
                                display: string;
                                basis: string;
                                reason?: undefined;
                                message?: undefined;
                            } | {
                                ok: false;
                                reason: import("./concentration.rules").ConcentrationRefusalReason;
                                message: string;
                                amount?: undefined;
                                unit?: undefined;
                                display?: undefined;
                                basis?: undefined;
                            } | null;
                            totalQuantity: string | null;
                            suggestedSig: string;
                            warnings: ({
                                kind: "WEIGHT";
                                message: string;
                            } | {
                                kind: "DUPLICATE_THERAPY";
                                message: string;
                            } | {
                                kind: "WITHDRAWAL";
                                message: string;
                            } | {
                                kind: "MONOGRAPH";
                                message: string;
                            })[];
                            suggestions: {
                                routeCode: string | null;
                                frequencyOptions: readonly [{
                                    readonly code: "SID";
                                    readonly labelAr: "مرة واحدة يوميًا";
                                    readonly perDay: {
                                        readonly num: 1;
                                        readonly den: 1;
                                    };
                                    readonly everyHours: 24;
                                }, {
                                    readonly code: "BID";
                                    readonly labelAr: "مرتين يوميًا";
                                    readonly perDay: {
                                        readonly num: 2;
                                        readonly den: 1;
                                    };
                                    readonly everyHours: 12;
                                }, {
                                    readonly code: "TID";
                                    readonly labelAr: "ثلاث مرات يوميًا";
                                    readonly perDay: {
                                        readonly num: 3;
                                        readonly den: 1;
                                    };
                                    readonly everyHours: 8;
                                }, {
                                    readonly code: "QID";
                                    readonly labelAr: "أربع مرات يوميًا";
                                    readonly perDay: {
                                        readonly num: 4;
                                        readonly den: 1;
                                    };
                                    readonly everyHours: 6;
                                }, {
                                    readonly code: "Q48H";
                                    readonly labelAr: "مرة كل يومين";
                                    readonly perDay: {
                                        readonly num: 1;
                                        readonly den: 2;
                                    };
                                    readonly everyHours: 48;
                                }, {
                                    readonly code: "EOD";
                                    readonly labelAr: "يوم بعد يوم";
                                    readonly perDay: {
                                        readonly num: 1;
                                        readonly den: 2;
                                    };
                                    readonly everyHours: 48;
                                }, {
                                    readonly code: "WEEKLY";
                                    readonly labelAr: "مرة أسبوعيًا";
                                    readonly perDay: {
                                        readonly num: 1;
                                        readonly den: 7;
                                    };
                                    readonly everyHours: 168;
                                }, {
                                    readonly code: "ONCE";
                                    readonly labelAr: "جرعة واحدة فقط";
                                    readonly perDay: {
                                        readonly num: 1;
                                        readonly den: 1;
                                    };
                                    readonly everyHours: 0;
                                }, {
                                    readonly code: "PRN";
                                    readonly labelAr: "عند اللزوم";
                                    readonly perDay: null;
                                    readonly everyHours: null;
                                }];
                                routeOptions: readonly [{
                                    readonly code: "PO";
                                    readonly labelAr: "عن طريق الفم";
                                }, {
                                    readonly code: "IV";
                                    readonly labelAr: "وريدي";
                                }, {
                                    readonly code: "IM";
                                    readonly labelAr: "عضلي";
                                }, {
                                    readonly code: "SC";
                                    readonly labelAr: "تحت الجلد";
                                }, {
                                    readonly code: "TOPICAL";
                                    readonly labelAr: "موضعي";
                                }, {
                                    readonly code: "OTIC";
                                    readonly labelAr: "في الأذن";
                                }, {
                                    readonly code: "OPHTH";
                                    readonly labelAr: "في العين";
                                }, {
                                    readonly code: "INTRANASAL";
                                    readonly labelAr: "في الأنف";
                                }, {
                                    readonly code: "IU";
                                    readonly labelAr: "داخل الرحم";
                                }, {
                                    readonly code: "IMAM";
                                    readonly labelAr: "داخل الضرع";
                                }];
                                monographFrequencyText: string | null;
                                monographDurationText: string | null;
                            };
                        };
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية وصف الأدوية";
                    };
                    404: {
                        readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
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
    prescriptions: {
        "drug-options": {
            get: {
                body: {};
                params: {};
                query: {
                    search?: string | undefined;
                };
                headers: {};
                response: {
                    200: {
                        name: string;
                        id: string;
                        stock: number;
                        catalogProductId: string | null;
                        catalogProduct: {
                            tradeName: string;
                            genericName: string;
                            genericKey: string;
                            strength: string | null;
                            strengthUnit: string | null;
                            dosageForm: string | null;
                        } | null;
                    }[];
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية وصف الأدوية";
                    };
                    404: {
                        readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
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
    prescriptions: {
        summary: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        draft: number;
                        active: number;
                        completed: number;
                        cancelled: number;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض الوصفات";
                    };
                    404: {
                        readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
                    };
                };
            };
        };
    };
} & {
    prescriptions: {
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
                        patient: {
                            name: string;
                            id: string;
                            code: string;
                        };
                        id: string;
                        createdAt: Date;
                        code: string;
                        status: import("../../../generated/prisma/enums").PrescriptionStatus;
                        items: {
                            id: string;
                            idx: number;
                            dispenseEvents: {
                                quantity: number;
                            }[];
                            route: string | null;
                            frequency: string | null;
                            quantity: import("@prisma/client-runtime-utils").Decimal;
                            durationDays: number | null;
                            inventoryItemId: string | null;
                            catalogProductId: string | null;
                            nameSnapshot: string;
                            doseAmount: import("@prisma/client-runtime-utils").Decimal | null;
                            doseUnit: string | null;
                            doseSource: import("../../../generated/prisma/enums").DoseSource;
                            overrideReasonAr: string | null;
                            prn: boolean;
                            instructionsAr: string;
                            quantityUnit: string;
                            refillsAllowed: number;
                            refillsUsed: number;
                        }[];
                        cancelledAt: Date | null;
                        appointmentId: string | null;
                        inpatientStayId: string | null;
                        patientId: string;
                        cancelReasonAr: string | null;
                        notesAr: string | null;
                        issuedAt: Date | null;
                        prescriberId: string | null;
                        weightKgSnapshot: import("@prisma/client-runtime-utils").Decimal | null;
                        weightRecordedAt: Date | null;
                        prescriber: {
                            name: string;
                            id: string;
                        } | null;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض الوصفات";
                    };
                    404: {
                        readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
                    } | {
                        readonly message: "الوصفة غير موجودة";
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
    prescriptions: {
        "draft-sig": {
            post: {
                body: {
                    durationDays?: number | undefined;
                    warnings?: string[] | undefined;
                    doseText?: string | undefined;
                    measuredText?: string | undefined;
                    routeLabel?: string | undefined;
                    frequencyLabel?: string | undefined;
                    speciesLabel?: string | undefined;
                    drugName: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        text: string;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية وصف الأدوية";
                    };
                    404: {
                        readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
                    };
                    422: {
                        readonly message: "تعذّرت الصياغة الآلية — اكتب التعليمات يدويًا";
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
    prescriptions: {
        post: {
            body: {
                appointmentId?: string | undefined;
                inpatientStayId?: string | undefined;
                notesAr?: string | undefined;
                patientId: string;
            };
            params: {};
            query: {};
            headers: {};
            response: {
                201: {
                    patient: {
                        name: string;
                        id: string;
                        code: string;
                    };
                    id: string;
                    createdAt: Date;
                    code: string;
                    status: import("../../../generated/prisma/enums").PrescriptionStatus;
                    items: {
                        id: string;
                        idx: number;
                        dispenseEvents: {
                            quantity: number;
                        }[];
                        route: string | null;
                        frequency: string | null;
                        quantity: import("@prisma/client-runtime-utils").Decimal;
                        durationDays: number | null;
                        inventoryItemId: string | null;
                        catalogProductId: string | null;
                        nameSnapshot: string;
                        doseAmount: import("@prisma/client-runtime-utils").Decimal | null;
                        doseUnit: string | null;
                        doseSource: import("../../../generated/prisma/enums").DoseSource;
                        overrideReasonAr: string | null;
                        prn: boolean;
                        instructionsAr: string;
                        quantityUnit: string;
                        refillsAllowed: number;
                        refillsUsed: number;
                    }[];
                    cancelledAt: Date | null;
                    appointmentId: string | null;
                    inpatientStayId: string | null;
                    patientId: string;
                    cancelReasonAr: string | null;
                    notesAr: string | null;
                    issuedAt: Date | null;
                    prescriberId: string | null;
                    weightKgSnapshot: import("@prisma/client-runtime-utils").Decimal | null;
                    weightRecordedAt: Date | null;
                    prescriber: {
                        name: string;
                        id: string;
                    } | null;
                };
                401: {
                    readonly message: "غير مصرح";
                };
                403: {
                    readonly message: "لا تملك صلاحية وصف الأدوية";
                };
                404: {
                    readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
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
    prescriptions: {
        ":id": {
            items: {
                post: {
                    body: {
                        route?: string | undefined;
                        frequency?: string | undefined;
                        durationDays?: number | undefined;
                        inventoryItemId?: string | undefined;
                        catalogProductId?: string | undefined;
                        doseAmount?: string | undefined;
                        doseUnit?: string | undefined;
                        overrideReasonAr?: string | undefined;
                        prn?: boolean | undefined;
                        refillsAllowed?: number | undefined;
                        quantity: string;
                        nameSnapshot: string;
                        instructionsAr: string;
                        quantityUnit: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            id: string;
                            idx: number;
                            dispenseEvents: {
                                quantity: number;
                            }[];
                            route: string | null;
                            frequency: string | null;
                            quantity: import("@prisma/client-runtime-utils").Decimal;
                            durationDays: number | null;
                            inventoryItemId: string | null;
                            catalogProductId: string | null;
                            nameSnapshot: string;
                            doseAmount: import("@prisma/client-runtime-utils").Decimal | null;
                            doseUnit: string | null;
                            doseSource: import("../../../generated/prisma/enums").DoseSource;
                            overrideReasonAr: string | null;
                            prn: boolean;
                            instructionsAr: string;
                            quantityUnit: string;
                            refillsAllowed: number;
                            refillsUsed: number;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية وصف الأدوية";
                        };
                        404: {
                            readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
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
    prescriptions: {
        ":id": {
            items: {
                ":itemId": {
                    patch: {
                        body: {
                            route?: string | undefined;
                            frequency?: string | undefined;
                            quantity?: string | undefined;
                            durationDays?: number | undefined;
                            inventoryItemId?: string | undefined;
                            catalogProductId?: string | undefined;
                            nameSnapshot?: string | undefined;
                            doseAmount?: string | undefined;
                            doseUnit?: string | undefined;
                            overrideReasonAr?: string | undefined;
                            prn?: boolean | undefined;
                            instructionsAr?: string | undefined;
                            quantityUnit?: string | undefined;
                            refillsAllowed?: number | undefined;
                        };
                        params: {
                            id: string;
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                idx: number;
                                dispenseEvents: {
                                    quantity: number;
                                }[];
                                route: string | null;
                                frequency: string | null;
                                quantity: import("@prisma/client-runtime-utils").Decimal;
                                durationDays: number | null;
                                inventoryItemId: string | null;
                                catalogProductId: string | null;
                                nameSnapshot: string;
                                doseAmount: import("@prisma/client-runtime-utils").Decimal | null;
                                doseUnit: string | null;
                                doseSource: import("../../../generated/prisma/enums").DoseSource;
                                overrideReasonAr: string | null;
                                prn: boolean;
                                instructionsAr: string;
                                quantityUnit: string;
                                refillsAllowed: number;
                                refillsUsed: number;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: "لا تملك صلاحية وصف الأدوية";
                            };
                            404: {
                                readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
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
    prescriptions: {
        ":id": {
            items: {
                ":itemId": {
                    delete: {
                        body: {};
                        params: {
                            id: string;
                            itemId: string;
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
                                readonly message: "لا تملك صلاحية وصف الأدوية";
                            };
                            404: {
                                readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
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
    prescriptions: {
        ":id": {
            issue: {
                post: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            patient: {
                                name: string;
                                id: string;
                                code: string;
                            };
                            id: string;
                            createdAt: Date;
                            code: string;
                            status: import("../../../generated/prisma/enums").PrescriptionStatus;
                            items: {
                                id: string;
                                idx: number;
                                dispenseEvents: {
                                    quantity: number;
                                }[];
                                route: string | null;
                                frequency: string | null;
                                quantity: import("@prisma/client-runtime-utils").Decimal;
                                durationDays: number | null;
                                inventoryItemId: string | null;
                                catalogProductId: string | null;
                                nameSnapshot: string;
                                doseAmount: import("@prisma/client-runtime-utils").Decimal | null;
                                doseUnit: string | null;
                                doseSource: import("../../../generated/prisma/enums").DoseSource;
                                overrideReasonAr: string | null;
                                prn: boolean;
                                instructionsAr: string;
                                quantityUnit: string;
                                refillsAllowed: number;
                                refillsUsed: number;
                            }[];
                            cancelledAt: Date | null;
                            appointmentId: string | null;
                            inpatientStayId: string | null;
                            patientId: string;
                            cancelReasonAr: string | null;
                            notesAr: string | null;
                            issuedAt: Date | null;
                            prescriberId: string | null;
                            weightKgSnapshot: import("@prisma/client-runtime-utils").Decimal | null;
                            weightRecordedAt: Date | null;
                            prescriber: {
                                name: string;
                                id: string;
                            } | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية وصف الأدوية";
                        };
                        404: {
                            readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
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
    prescriptions: {
        ":id": {
            cancel: {
                post: {
                    body: {
                        reasonAr: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            patient: {
                                name: string;
                                id: string;
                                code: string;
                            };
                            id: string;
                            createdAt: Date;
                            code: string;
                            status: import("../../../generated/prisma/enums").PrescriptionStatus;
                            items: {
                                id: string;
                                idx: number;
                                dispenseEvents: {
                                    quantity: number;
                                }[];
                                route: string | null;
                                frequency: string | null;
                                quantity: import("@prisma/client-runtime-utils").Decimal;
                                durationDays: number | null;
                                inventoryItemId: string | null;
                                catalogProductId: string | null;
                                nameSnapshot: string;
                                doseAmount: import("@prisma/client-runtime-utils").Decimal | null;
                                doseUnit: string | null;
                                doseSource: import("../../../generated/prisma/enums").DoseSource;
                                overrideReasonAr: string | null;
                                prn: boolean;
                                instructionsAr: string;
                                quantityUnit: string;
                                refillsAllowed: number;
                                refillsUsed: number;
                            }[];
                            cancelledAt: Date | null;
                            appointmentId: string | null;
                            inpatientStayId: string | null;
                            patientId: string;
                            cancelReasonAr: string | null;
                            notesAr: string | null;
                            issuedAt: Date | null;
                            prescriberId: string | null;
                            weightKgSnapshot: import("@prisma/client-runtime-utils").Decimal | null;
                            weightRecordedAt: Date | null;
                            prescriber: {
                                name: string;
                                id: string;
                            } | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية وصف الأدوية";
                        };
                        404: {
                            readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
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
    dispense: {
        batches: {
            get: {
                body: {};
                params: {};
                query: {
                    itemId: string;
                    warehouseId: string;
                };
                headers: {};
                response: {
                    200: {
                        expired: boolean;
                        id: string;
                        qty: number;
                        expiryDate: Date | null;
                        batchNo: string;
                    }[];
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية صرف الأدوية";
                    };
                    404: {
                        readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
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
    dispense: {
        "counter-sales": {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        discount: import("@prisma/client-runtime-utils").Decimal;
                        id: string;
                        createdAt: Date;
                        taxRate: import("@prisma/client-runtime-utils").Decimal;
                        code: string;
                        taxes: {
                            id: string;
                            description: string;
                            idx: number;
                            rate: import("@prisma/client-runtime-utils").Decimal;
                            taxAmount: import("@prisma/client-runtime-utils").Decimal;
                            includedInPrintRate: boolean;
                        }[];
                        taxAmount: import("@prisma/client-runtime-utils").Decimal;
                        notes: string | null;
                        status: import("../sales/sales.type").SaleStatus;
                        items: {
                            name: string;
                            id: string;
                            lineTotal: import("@prisma/client-runtime-utils").Decimal;
                            quantity: number;
                            inventoryItemId: string | null;
                            unitPrice: import("@prisma/client-runtime-utils").Decimal;
                        }[];
                        total: import("@prisma/client-runtime-utils").Decimal;
                        netTotal: import("@prisma/client-runtime-utils").Decimal;
                        paymentMethod: import("../invoices/invoices.type").PaymentMethod;
                        paidAt: Date | null;
                        subtotal: import("@prisma/client-runtime-utils").Decimal;
                        taxTemplateId: string | null;
                        refundedAt: Date | null;
                        refundReason: string | null;
                        cogsAmount: import("@prisma/client-runtime-utils").Decimal;
                        discountCode: string | null;
                        customerName: string | null;
                        customerPhone: string | null;
                        fulfillment: import("../../../generated/prisma/enums").SaleFulfillment;
                        dispensedAt: Date | null;
                    }[];
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض الصيدلية";
                    };
                    404: {
                        readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
                    };
                };
            };
        };
    };
} & {
    dispense: {
        "counter-sales": {
            ":id": {
                dispense: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                discount: import("@prisma/client-runtime-utils").Decimal;
                                id: string;
                                createdAt: Date;
                                taxRate: import("@prisma/client-runtime-utils").Decimal;
                                code: string;
                                taxes: {
                                    id: string;
                                    description: string;
                                    idx: number;
                                    rate: import("@prisma/client-runtime-utils").Decimal;
                                    taxAmount: import("@prisma/client-runtime-utils").Decimal;
                                    includedInPrintRate: boolean;
                                }[];
                                taxAmount: import("@prisma/client-runtime-utils").Decimal;
                                notes: string | null;
                                status: import("../sales/sales.type").SaleStatus;
                                items: {
                                    name: string;
                                    id: string;
                                    lineTotal: import("@prisma/client-runtime-utils").Decimal;
                                    quantity: number;
                                    inventoryItemId: string | null;
                                    unitPrice: import("@prisma/client-runtime-utils").Decimal;
                                }[];
                                total: import("@prisma/client-runtime-utils").Decimal;
                                netTotal: import("@prisma/client-runtime-utils").Decimal;
                                paymentMethod: import("../invoices/invoices.type").PaymentMethod;
                                paidAt: Date | null;
                                subtotal: import("@prisma/client-runtime-utils").Decimal;
                                taxTemplateId: string | null;
                                refundedAt: Date | null;
                                refundReason: string | null;
                                cogsAmount: import("@prisma/client-runtime-utils").Decimal;
                                discountCode: string | null;
                                customerName: string | null;
                                customerPhone: string | null;
                                fulfillment: import("../../../generated/prisma/enums").SaleFulfillment;
                                dispensedAt: Date | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: "لا تملك صلاحية صرف الأدوية";
                            };
                            404: {
                                readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
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
    dispense: {
        remaining: {
            ":itemId": {
                get: {
                    body: {};
                    params: {
                        itemId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            dispensed: number;
                            ceiling: number;
                            remaining: number;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية صرف الأدوية";
                        };
                        404: {
                            readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
                        } | {
                            readonly message: "بند الوصفة غير موجود";
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
    dispense: {
        post: {
            body: {
                batchId?: string | undefined;
                notesAr?: string | undefined;
                warehouseId: string;
                quantity: number;
                prescriptionItemId: string;
            };
            params: {};
            query: {};
            headers: {};
            response: {
                201: {
                    id: string;
                    dispensedAt: Date;
                    quantity: number;
                    batchNoSnapshot: string | null;
                    expiryDateSnapshot: Date | null;
                    isRefill: boolean;
                };
                401: {
                    readonly message: "غير مصرح";
                };
                403: {
                    readonly message: "لا تملك صلاحية صرف الأدوية";
                };
                404: {
                    readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
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
    controlled: {
        substances: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        balance: number;
                        inventoryItem: {
                            name: string;
                            id: string;
                            sku: string | null;
                        };
                        id: string;
                        active: boolean;
                        source: import("../../../generated/prisma/enums").ControlledSource;
                        inventoryItemId: string;
                        scheduleClass: string | null;
                    }[];
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض سجل المواد المراقبة";
                    };
                    404: {
                        readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
                    } | {
                        readonly message: "سجل المواد المراقبة غير مفعّل لهذه الأكاديمية";
                    };
                };
            };
        };
    };
} & {
    controlled: {
        ledger: {
            get: {
                body: {};
                params: {};
                query: {
                    to?: string | undefined;
                    from?: string | undefined;
                    inventoryItemId: string;
                };
                headers: {};
                response: {
                    200: {
                        patient: {
                            name: string;
                            id: string;
                        } | null;
                        id: string;
                        witness: {
                            name: string;
                            id: string;
                        } | null;
                        recordedAt: Date;
                        quantity: number;
                        performedBy: {
                            name: string;
                            id: string;
                        } | null;
                        occurredAt: Date;
                        movementType: import("../../../generated/prisma/enums").ControlledMovementType;
                        balanceAfter: number;
                        reasonAr: string | null;
                    }[];
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض سجل المواد المراقبة";
                    };
                    404: {
                        readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
                    } | {
                        readonly message: "سجل المواد المراقبة غير مفعّل لهذه الأكاديمية";
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
    controlled: {
        substances: {
            post: {
                body: {
                    active?: boolean | undefined;
                    scheduleClass?: string | undefined;
                    inventoryItemId: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        id: string;
                        active: boolean;
                        source: import("../../../generated/prisma/enums").ControlledSource;
                        inventoryItemId: string;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية تسجيل المواد المراقبة";
                    };
                    404: {
                        readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
                    } | {
                        readonly message: "سجل المواد المراقبة غير مفعّل لهذه الأكاديمية";
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
    controlled: {
        entries: {
            post: {
                body: {
                    witnessId?: string | undefined;
                    occurredAt?: string | undefined;
                    reasonAr?: string | undefined;
                    quantity: number;
                    inventoryItemId: string;
                    movementType: "TRANSFER" | "ADJUSTMENT" | "RECEIPT" | "DISPENSE" | "WASTE";
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        id: string;
                        recordedAt: Date;
                        quantity: number;
                        occurredAt: Date;
                        movementType: import("../../../generated/prisma/enums").ControlledMovementType;
                        balanceAfter: number;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية تسجيل المواد المراقبة";
                    };
                    404: {
                        readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
                    } | {
                        readonly message: "سجل المواد المراقبة غير مفعّل لهذه الأكاديمية";
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
    formulary: {
        get: {
            body: {};
            params: {};
            query: {
                search?: string | undefined;
            };
            headers: {};
            response: {
                200: {
                    id: string;
                    _count: {
                        doses: number;
                    };
                    reviewedAt: Date | null;
                    reviewedBy: string | null;
                    genericName: string;
                    genericNameAr: string | null;
                    genericKey: string;
                    sourceCitation: string;
                }[];
                401: {
                    readonly message: "غير مصرح";
                };
                403: {
                    readonly message: "لا تملك صلاحية عرض النشرات الدوائية";
                };
                404: {
                    readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
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
    formulary: {
        coverage: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        stockedGenerics: number;
                        covered: number;
                        missing: any[];
                        totalMonographs: number;
                        totalDoseRows: number;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض النشرات الدوائية";
                    };
                    404: {
                        readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
                    };
                };
            };
        };
    };
} & {
    formulary: {
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
                        id: string;
                        reviewedAt: Date | null;
                        reviewedBy: string | null;
                        genericName: string;
                        genericNameAr: string | null;
                        genericKey: string;
                        summaryAr: string | null;
                        summaryEn: string | null;
                        sourceCitation: string;
                        doses: {
                            id: string;
                            species: import("../drug-catalog/drug-catalog.type").CatalogSpecies;
                            route: string | null;
                            frequency: string | null;
                            doseUnit: string | null;
                            contraindicated: boolean;
                            doseMin: import("@prisma/client-runtime-utils").Decimal | null;
                            doseMax: import("@prisma/client-runtime-utils").Decimal | null;
                            durationNote: string | null;
                            warningAr: string | null;
                            warningEn: string | null;
                        }[];
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض النشرات الدوائية";
                    };
                    404: {
                        readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
                    } | {
                        readonly message: "النشرة غير موجودة";
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
    formulary: {
        post: {
            body: {
                reviewedBy?: string | undefined;
                genericNameAr?: string | undefined;
                summaryAr?: string | undefined;
                summaryEn?: string | undefined;
                genericName: string;
                genericKey: string;
                sourceCitation: string;
            };
            params: {};
            query: {};
            headers: {};
            response: {
                201: {
                    id: string;
                    genericName: string;
                    genericKey: string;
                };
                401: {
                    readonly message: "غير مصرح";
                };
                403: {
                    readonly message: "لا تملك صلاحية تأليف النشرات الدوائية";
                };
                404: {
                    readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
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
    formulary: {
        doses: {
            post: {
                body: {
                    route?: string | undefined;
                    frequency?: string | undefined;
                    doseUnit?: string | undefined;
                    contraindicated?: boolean | undefined;
                    doseMin?: string | undefined;
                    doseMax?: string | undefined;
                    durationNote?: string | undefined;
                    warningAr?: string | undefined;
                    warningEn?: string | undefined;
                    species: "DOG" | "CAT" | "HORSE" | "CATTLE" | "SHEEP" | "GOAT" | "CAMEL" | "POULTRY" | "RABBIT" | "SWINE" | "FISH" | "BEE";
                    monographId: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        id: string;
                        species: import("../drug-catalog/drug-catalog.type").CatalogSpecies;
                        contraindicated: boolean;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية تأليف النشرات الدوائية";
                    };
                    404: {
                        readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
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
    "pharmacy-reports": {
        dispensing: {
            get: {
                body: {};
                params: {};
                query: {
                    to?: string | undefined;
                    from?: string | undefined;
                };
                headers: {};
                response: {
                    200: {
                        totalEvents: number;
                        byDrug: {
                            name: string;
                            quantity: number;
                        }[];
                        byPrescriber: {
                            name: string;
                            quantity: number;
                        }[];
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض تقارير الصيدلية";
                    };
                    404: {
                        readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
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
    "pharmacy-reports": {
        overrides: {
            get: {
                body: {};
                params: {};
                query: {
                    to?: string | undefined;
                    from?: string | undefined;
                };
                headers: {};
                response: {
                    200: {
                        prescription: {
                            patient: {
                                name: string;
                                id: string;
                            };
                            createdAt: Date;
                            code: string;
                            prescriber: {
                                name: string;
                                id: string;
                            } | null;
                        };
                        id: string;
                        nameSnapshot: string;
                        doseAmount: import("@prisma/client-runtime-utils").Decimal | null;
                        doseUnit: string | null;
                        overrideReasonAr: string | null;
                    }[];
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض تقارير الصيدلية";
                    };
                    404: {
                        readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
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
    "pharmacy-reports": {
        expired: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        warehouse: {
                            name: string;
                        };
                        id: string;
                        item: {
                            controlledSubstance: {
                                id: string;
                            }[];
                            name: string;
                            id: string;
                        };
                        qty: number;
                        expiryDate: Date | null;
                        batchNo: string;
                    }[];
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض تقارير الصيدلية";
                    };
                    404: {
                        readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
                    };
                };
            };
        };
    };
} & {
    "pharmacy-reports": {
        "witness-candidates": {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        name: string;
                        id: string;
                    }[];
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض تقارير الصيدلية";
                    };
                    404: {
                        readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
                    };
                };
            };
        };
    };
} & {
    "pharmacy-reports": {
        expired: {
            ":batchId": {
                dispose: {
                    post: {
                        body: {
                            qty: number;
                            reasonAr: string;
                            witnessIds: string[];
                        };
                        params: {
                            batchId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            201: {
                                id: string;
                                createdAt: Date;
                                item: {
                                    name: string;
                                };
                                qty: number;
                                performedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                batch: {
                                    batchNo: string;
                                };
                                reasonAr: string;
                                witnesses: {
                                    user: {
                                        name: string;
                                        id: string;
                                    };
                                }[];
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: "لا تملك صلاحية إتلاف الدفعات";
                            };
                            404: {
                                readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
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
    "pharmacy-reports": {
        expiring: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        expired: boolean;
                        id: string;
                        item: {
                            name: string;
                            id: string;
                        };
                        qty: number;
                        expiryDate: Date | null;
                        batchNo: string;
                    }[];
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض تقارير الصيدلية";
                    };
                    404: {
                        readonly message: "وحدة الصيدلية غير مفعّلة لهذه الأكاديمية";
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
