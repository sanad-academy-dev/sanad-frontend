import Elysia from "elysia";
export declare const prescriptionsController: Elysia<"/prescriptions", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
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
}, {
    schema: {};
    standaloneSchema: {};
    macro: Partial<{
        readonly requirePharmacy: boolean;
    }>;
    macroFn: {
        /**
         * جلسة + أكاديمية + **راية الوحدة**. الراية تُفحص في الماكرو لا في كل معالج:
         * وحدة مطفأة يجب أن تكون خاملة تمامًا (BRD §0.3)، ونقطةٌ واحدة تُنسى تكفي
         * لنقض ذلك. الردّ 404 لا 403 — «غير مفعّلة» ليست «ممنوعة».
         */
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
