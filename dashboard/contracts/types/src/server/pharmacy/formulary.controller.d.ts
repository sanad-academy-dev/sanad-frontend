import Elysia from "elysia";
/**
 * [PH6.1] تأليف النشرات الدوائية — الطبقة الثانية، BRD_Pharmacy_Module.md §3.
 *
 * هذه هي الشاشة التي تجعل محرّك الجرعة ينطق: الطبقة الثانية تُشحن **فارغة تمامًا**
 * (صفر صفوف، بالتصميم — §2.2)، فبدونها يبقى المحرّك صحيحًا وصامتًا إلى الأبد.
 *
 * ── ما لا يوجد هنا، عمدًا ─────────────────────────────────────────────────────
 * **لا استيراد، ولا توليد، ولا مساعدة ذكاء اصطناعي — في أي مرحلة** (§3.4، §0.4).
 * الصفوف تُدخَل من مرجع دوائي معتمد (BSAVA أو Plumb) بيد مدرّب مرخَّص، و
 * `sourceCitation` إلزامي في المخطط ويبقى إلزاميًّا في الواجهة. جرعة ملفَّقة في نظام
 * سريري حادثةُ سلامة طفل، لا عيب جودة بيانات.
 *
 * الطبقة الثانية **عالمية** كالأولى (§3.5): جرعة القطّ لا تختلف باختلاف الأكاديمية.
 * لذلك الحارس صلاحية سلطة سريرية (`pharmacy.formulary_edit`) لا ملكية أكاديمية.
 */
export declare const formularyController: Elysia<"/formulary", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
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
}, {
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
}>;
