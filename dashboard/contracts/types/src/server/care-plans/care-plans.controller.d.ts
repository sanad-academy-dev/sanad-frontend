import Elysia from "elysia";
export declare const carePlansController: Elysia<"/care-plans", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "care-plans.create": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            serviceId: import("@sinclair/typebox").TString;
            animalTypeId: import("@sinclair/typebox").TString;
            animalStrainId: import("@sinclair/typebox").TString;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            visitDurationMins: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            price: import("@sinclair/typebox").TNumber;
            visits: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                serviceId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                consultationTypeId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                durationMins: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
                details: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                intervalUnit: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DAY">, import("@sinclair/typebox").TLiteral<"WEEK">]>;
                intervalValue: import("@sinclair/typebox").TInteger;
                vaccinationProtocolDoseId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                medications: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                    inventoryItemId: import("@sinclair/typebox").TString;
                    quantity: import("@sinclair/typebox").TInteger;
                    freeQuantity: import("@sinclair/typebox").TInteger;
                    fullyFree: import("@sinclair/typebox").TBoolean;
                }>>;
            }>>>;
            medications: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                inventoryItemId: import("@sinclair/typebox").TString;
                quantity: import("@sinclair/typebox").TInteger;
                freeQuantity: import("@sinclair/typebox").TInteger;
                fullyFree: import("@sinclair/typebox").TBoolean;
            }>>>;
        }>;
        readonly "care-plans.update": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            serviceId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            animalTypeId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            animalStrainId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            visitDurationMins: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            visits: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                serviceId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                consultationTypeId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                durationMins: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
                details: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                intervalUnit: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DAY">, import("@sinclair/typebox").TLiteral<"WEEK">]>;
                intervalValue: import("@sinclair/typebox").TInteger;
                vaccinationProtocolDoseId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                medications: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                    inventoryItemId: import("@sinclair/typebox").TString;
                    quantity: import("@sinclair/typebox").TInteger;
                    freeQuantity: import("@sinclair/typebox").TInteger;
                    fullyFree: import("@sinclair/typebox").TBoolean;
                }>>;
            }>>>;
            medications: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                inventoryItemId: import("@sinclair/typebox").TString;
                quantity: import("@sinclair/typebox").TInteger;
                freeQuantity: import("@sinclair/typebox").TInteger;
                fullyFree: import("@sinclair/typebox").TBoolean;
            }>>>;
        }>;
        readonly "care-plans.setStatus": import("@sinclair/typebox").TObject<{
            status: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ACTIVE">, import("@sinclair/typebox").TLiteral<"INACTIVE">]>;
        }>;
        readonly "care-plans.enroll": import("@sinclair/typebox").TObject<{
            patientId: import("@sinclair/typebox").TString;
            startedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            sourceAppointmentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
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
    "care-plans": {};
} & {
    "care-plans": {
        get: {
            body: {};
            params: {};
            query: {};
            headers: {};
            response: {
                200: import("./care-plans.type").CarePlanListItemResponse[];
                401: {
                    readonly message: "غير مصرح";
                };
            };
        };
    };
} & {
    "care-plans": {
        stats: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: import("./care-plans.type").CarePlanStatsResponse;
                    401: {
                        readonly message: "غير مصرح";
                    };
                };
            };
        };
    };
} & {
    "care-plans": {
        enrollments: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: import("./care-plans.type").CarePlanEnrollmentListItemResponse[];
                    401: {
                        readonly message: "غير مصرح";
                    };
                };
            };
        };
    };
} & {
    "care-plans": {
        enrollments: {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: import("./care-plans.type").CarePlanEnrollmentListItemResponse;
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الاشتراك غير موجود";
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
    "care-plans": {
        enrollments: {
            ":id": {
                cancel: {
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
                                    ownerId: string | null;
                                };
                                carePlan: {
                                    name: string;
                                    id: string;
                                    code: string;
                                };
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                notes: string | null;
                                status: import("./care-plans.type").CarePlanEnrollmentStatus;
                                startedAt: Date;
                                completedAt: Date | null;
                                visits: {
                                    appointment: {
                                        staff: {
                                            name: string;
                                            prefix: import("../staff/staff.type").StaffPrefix | null;
                                            id: string;
                                        };
                                        invoice: {
                                            id: string;
                                            status: import("../invoices/invoices.type").InvoiceStatus;
                                            total: import("@prisma/client-runtime-utils").Decimal;
                                        } | null;
                                        id: string;
                                        code: string;
                                        status: import("../../../generated/prisma/enums").AppointmentStatus;
                                        startsAt: Date;
                                    } | null;
                                    id: string;
                                    order: number;
                                    status: import("./care-plans.type").CarePlanEnrollmentVisitStatus;
                                    serviceId: string | null;
                                    appointmentId: string | null;
                                    completedAt: Date | null;
                                    consultationTypeId: string | null;
                                    medications: {
                                        id: string;
                                        quantity: number;
                                        priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                        inventoryItemId: string | null;
                                        nameSnapshot: string;
                                        freeQuantity: number;
                                        fullyFree: boolean;
                                    }[];
                                    scheduledAt: Date;
                                    serviceName: string;
                                    consultationTypeName: string | null;
                                }[];
                                priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                readonly message: "الاشتراك غير موجود";
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
    "care-plans": {
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
                        service: {
                            name: string;
                            id: string;
                            parentId: string | null;
                        };
                        animalType: {
                            id: string;
                            arName: string;
                            enName: string;
                        };
                        animalStrain: {
                            id: string;
                            arName: string;
                            enName: string;
                        };
                        name: string;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        code: string;
                        notes: string | null;
                        status: import("./care-plans.type").CarePlanStatus;
                        editsCount: number;
                        price: import("@prisma/client-runtime-utils").Decimal;
                        visits: {
                            service: {
                                name: string;
                                id: string;
                            } | null;
                            consultationType: {
                                name: string;
                                id: string;
                            } | null;
                            vaccinationProtocolDose: {
                                id: string;
                                label: string;
                                protocolId: string;
                                antigenCode: string;
                            } | null;
                            id: string;
                            order: number;
                            serviceId: string | null;
                            details: string | null;
                            consultationTypeId: string | null;
                            medications: {
                                id: string;
                                quantity: number;
                                priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                inventoryItemId: string | null;
                                nameSnapshot: string;
                                freeQuantity: number;
                                fullyFree: boolean;
                            }[];
                            durationMins: number | null;
                            intervalUnit: import("./care-plans.type").CarePlanIntervalUnit;
                            intervalValue: number;
                            vaccinationProtocolDoseId: string | null;
                        }[];
                        medications: {
                            id: string;
                            quantity: number;
                            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                            inventoryItemId: string | null;
                            nameSnapshot: string;
                            freeQuantity: number;
                            fullyFree: boolean;
                        }[];
                        visitDurationMins: number | null;
                        durationDays: number;
                        usageCount: number;
                        subscribersCount: number;
                        ratingSum: number;
                        ratingCount: number;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    404: {
                        readonly message: "الخطة غير موجودة";
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
    "care-plans": {
        post: {
            body: {
                notes?: string | null | undefined;
                visits?: {
                    serviceId?: string | null | undefined;
                    details?: string | null | undefined;
                    consultationTypeId?: string | null | undefined;
                    durationMins?: number | null | undefined;
                    vaccinationProtocolDoseId?: string | null | undefined;
                    medications: {
                        quantity: number;
                        inventoryItemId: string;
                        freeQuantity: number;
                        fullyFree: boolean;
                    }[];
                    intervalUnit: "WEEK" | "DAY";
                    intervalValue: number;
                }[] | undefined;
                medications?: {
                    quantity: number;
                    inventoryItemId: string;
                    freeQuantity: number;
                    fullyFree: boolean;
                }[] | undefined;
                visitDurationMins?: number | null | undefined;
                name: string;
                serviceId: string;
                animalTypeId: string;
                animalStrainId: string;
                price: number;
            };
            params: {};
            query: {};
            headers: {};
            response: {
                201: "not-found" | {
                    service: {
                        name: string;
                        id: string;
                        parentId: string | null;
                    };
                    animalType: {
                        id: string;
                        arName: string;
                        enName: string;
                    };
                    animalStrain: {
                        id: string;
                        arName: string;
                        enName: string;
                    };
                    name: string;
                    id: string;
                    clinicId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    code: string;
                    notes: string | null;
                    status: import("./care-plans.type").CarePlanStatus;
                    editsCount: number;
                    price: import("@prisma/client-runtime-utils").Decimal;
                    visits: {
                        service: {
                            name: string;
                            id: string;
                        } | null;
                        consultationType: {
                            name: string;
                            id: string;
                        } | null;
                        id: string;
                    }[];
                    visitDurationMins: number | null;
                    durationDays: number;
                    usageCount: number;
                    subscribersCount: number;
                    ratingSum: number;
                    ratingCount: number;
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
    "care-plans": {
        ":id": {
            patch: {
                body: {
                    name?: string | undefined;
                    notes?: string | null | undefined;
                    serviceId?: string | undefined;
                    animalTypeId?: string | undefined;
                    animalStrainId?: string | undefined;
                    price?: number | undefined;
                    visits?: {
                        serviceId?: string | null | undefined;
                        details?: string | null | undefined;
                        consultationTypeId?: string | null | undefined;
                        durationMins?: number | null | undefined;
                        vaccinationProtocolDoseId?: string | null | undefined;
                        medications: {
                            quantity: number;
                            inventoryItemId: string;
                            freeQuantity: number;
                            fullyFree: boolean;
                        }[];
                        intervalUnit: "WEEK" | "DAY";
                        intervalValue: number;
                    }[] | undefined;
                    medications?: {
                        quantity: number;
                        inventoryItemId: string;
                        freeQuantity: number;
                        fullyFree: boolean;
                    }[] | undefined;
                    visitDurationMins?: number | null | undefined;
                };
                params: {
                    id: string;
                };
                query: {};
                headers: {};
                response: {
                    200: {
                        service: {
                            name: string;
                            id: string;
                            parentId: string | null;
                        };
                        animalType: {
                            id: string;
                            arName: string;
                            enName: string;
                        };
                        animalStrain: {
                            id: string;
                            arName: string;
                            enName: string;
                        };
                        name: string;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        code: string;
                        notes: string | null;
                        status: import("./care-plans.type").CarePlanStatus;
                        editsCount: number;
                        price: import("@prisma/client-runtime-utils").Decimal;
                        visits: {
                            service: {
                                name: string;
                                id: string;
                            } | null;
                            consultationType: {
                                name: string;
                                id: string;
                            } | null;
                            id: string;
                        }[];
                        visitDurationMins: number | null;
                        durationDays: number;
                        usageCount: number;
                        subscribersCount: number;
                        ratingSum: number;
                        ratingCount: number;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    404: {
                        readonly message: "الخطة غير موجودة";
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
    "care-plans": {
        ":id": {
            status: {
                patch: {
                    body: {
                        status: "ACTIVE" | "INACTIVE";
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            service: {
                                name: string;
                                id: string;
                                parentId: string | null;
                            };
                            animalType: {
                                id: string;
                                arName: string;
                                enName: string;
                            };
                            animalStrain: {
                                id: string;
                                arName: string;
                                enName: string;
                            };
                            name: string;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            code: string;
                            notes: string | null;
                            status: import("./care-plans.type").CarePlanStatus;
                            editsCount: number;
                            price: import("@prisma/client-runtime-utils").Decimal;
                            visits: {
                                service: {
                                    name: string;
                                    id: string;
                                } | null;
                                consultationType: {
                                    name: string;
                                    id: string;
                                } | null;
                                id: string;
                            }[];
                            visitDurationMins: number | null;
                            durationDays: number;
                            usageCount: number;
                            subscribersCount: number;
                            ratingSum: number;
                            ratingCount: number;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الخطة غير موجودة";
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
    "care-plans": {
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
                        201: {
                            service: {
                                name: string;
                                id: string;
                                parentId: string | null;
                            };
                            animalType: {
                                id: string;
                                arName: string;
                                enName: string;
                            };
                            animalStrain: {
                                id: string;
                                arName: string;
                                enName: string;
                            };
                            name: string;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            code: string;
                            notes: string | null;
                            status: import("./care-plans.type").CarePlanStatus;
                            editsCount: number;
                            price: import("@prisma/client-runtime-utils").Decimal;
                            visits: {
                                service: {
                                    name: string;
                                    id: string;
                                } | null;
                                consultationType: {
                                    name: string;
                                    id: string;
                                } | null;
                                id: string;
                            }[];
                            visitDurationMins: number | null;
                            durationDays: number;
                            usageCount: number;
                            subscribersCount: number;
                            ratingSum: number;
                            ratingCount: number;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الخطة غير موجودة";
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
    "care-plans": {
        ":id": {
            enroll: {
                post: {
                    body: {
                        notes?: string | null | undefined;
                        startedAt?: string | undefined;
                        sourceAppointmentId?: string | undefined;
                        patientId: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            patient: {
                                name: string;
                                id: string;
                                code: string;
                                ownerId: string | null;
                            };
                            carePlan: {
                                name: string;
                                id: string;
                                code: string;
                            };
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            code: string;
                            notes: string | null;
                            status: import("./care-plans.type").CarePlanEnrollmentStatus;
                            startedAt: Date;
                            completedAt: Date | null;
                            visits: {
                                appointment: {
                                    staff: {
                                        name: string;
                                        prefix: import("../staff/staff.type").StaffPrefix | null;
                                        id: string;
                                    };
                                    invoice: {
                                        id: string;
                                        status: import("../invoices/invoices.type").InvoiceStatus;
                                        total: import("@prisma/client-runtime-utils").Decimal;
                                    } | null;
                                    id: string;
                                    code: string;
                                    status: import("../../../generated/prisma/enums").AppointmentStatus;
                                    startsAt: Date;
                                } | null;
                                id: string;
                                order: number;
                                status: import("./care-plans.type").CarePlanEnrollmentVisitStatus;
                                serviceId: string | null;
                                appointmentId: string | null;
                                completedAt: Date | null;
                                consultationTypeId: string | null;
                                medications: {
                                    id: string;
                                    quantity: number;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    inventoryItemId: string | null;
                                    nameSnapshot: string;
                                    freeQuantity: number;
                                    fullyFree: boolean;
                                }[];
                                scheduledAt: Date;
                                serviceName: string;
                                consultationTypeName: string | null;
                            }[];
                            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الخطة غير موجودة";
                        } | {
                            readonly message: "الطفل غير موجود";
                        };
                        422: {
                            readonly message: "يجب أن يكون للطفل وليّ أمر مسجّل قبل الاشتراك";
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
    "care-plans": {
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
                        service: {
                            name: string;
                            id: string;
                            parentId: string | null;
                        };
                        animalType: {
                            id: string;
                            arName: string;
                            enName: string;
                        };
                        animalStrain: {
                            id: string;
                            arName: string;
                            enName: string;
                        };
                        name: string;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        code: string;
                        notes: string | null;
                        status: import("./care-plans.type").CarePlanStatus;
                        editsCount: number;
                        price: import("@prisma/client-runtime-utils").Decimal;
                        visits: {
                            service: {
                                name: string;
                                id: string;
                            } | null;
                            consultationType: {
                                name: string;
                                id: string;
                            } | null;
                            id: string;
                        }[];
                        visitDurationMins: number | null;
                        durationDays: number;
                        usageCount: number;
                        subscribersCount: number;
                        ratingSum: number;
                        ratingCount: number;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    404: {
                        readonly message: "الخطة غير موجودة";
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
