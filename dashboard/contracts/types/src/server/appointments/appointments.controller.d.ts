import Elysia from "elysia";
export declare const appointmentsController: Elysia<"/appointments", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "appointments.create": import("@sinclair/typebox").TObject<{
            ownerId: import("@sinclair/typebox").TString;
            patientId: import("@sinclair/typebox").TString;
            staffId: import("@sinclair/typebox").TString;
            serviceIds: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
            startsAt: import("@sinclair/typebox").TString;
            roomId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            branchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            location: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"IN_CLINIC">, import("@sinclair/typebox").TLiteral<"REMOTE">, import("@sinclair/typebox").TLiteral<"HOME_VISIT">, import("@sinclair/typebox").TLiteral<"MOBILE_CLINIC">]>>;
            status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"SCHEDULED">, import("@sinclair/typebox").TLiteral<"WAITING">]>>;
            priority: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LOW">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"HIGH">, import("@sinclair/typebox").TLiteral<"URGENT">]>]>>;
            isEmergency: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            consultationTypeId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            clinicalNotes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            whatsappReminderEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            images: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            repeatCount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            repeatUnit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DAY">, import("@sinclair/typebox").TLiteral<"WEEK">, import("@sinclair/typebox").TLiteral<"TWO_WEEKS">, import("@sinclair/typebox").TLiteral<"MONTH">, import("@sinclair/typebox").TLiteral<"YEAR">]>>;
            enrollmentVisitId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "appointments.slotsQuery": import("@sinclair/typebox").TObject<{
            staffId: import("@sinclair/typebox").TString;
            date: import("@sinclair/typebox").TString;
            durationMinutes: import("@sinclair/typebox").TNumber;
            excludeAppointmentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "appointments.staffByServicesQuery": import("@sinclair/typebox").TObject<{
            serviceIds: import("@sinclair/typebox").TString;
        }>;
        readonly "appointments.updateStatus": import("@sinclair/typebox").TObject<{
            status: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"SCHEDULED">, import("@sinclair/typebox").TLiteral<"WAITING">, import("@sinclair/typebox").TLiteral<"CHECK_IN">, import("@sinclair/typebox").TLiteral<"IN_SERVICE">, import("@sinclair/typebox").TLiteral<"HOSPITALIZED">, import("@sinclair/typebox").TLiteral<"AWAITING_PAYMENT">, import("@sinclair/typebox").TLiteral<"DONE">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>;
        }>;
        readonly "appointments.listQuery": import("@sinclair/typebox").TObject<{
            period: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"day">, import("@sinclair/typebox").TLiteral<"week">, import("@sinclair/typebox").TLiteral<"all">]>>;
            view: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"all">, import("@sinclair/typebox").TLiteral<"for-me">]>>;
        }>;
        readonly "appointments.updateReason": import("@sinclair/typebox").TObject<{
            reason: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>;
        }>;
        readonly "appointments.updateLocation": import("@sinclair/typebox").TObject<{
            location: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"IN_CLINIC">, import("@sinclair/typebox").TLiteral<"REMOTE">, import("@sinclair/typebox").TLiteral<"HOME_VISIT">, import("@sinclair/typebox").TLiteral<"MOBILE_CLINIC">]>;
        }>;
        readonly "appointments.createComment": import("@sinclair/typebox").TObject<{
            body: import("@sinclair/typebox").TString;
        }>;
        readonly "appointments.createInternalNote": import("@sinclair/typebox").TObject<{
            body: import("@sinclair/typebox").TString;
            mentionedStaffIds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        }>;
        readonly "appointments.updateInternalNote": import("@sinclair/typebox").TObject<{
            body: import("@sinclair/typebox").TString;
        }>;
        readonly "appointments.updateQueueStatus": import("@sinclair/typebox").TObject<{
            queueStatus: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ON_HOLD">, import("@sinclair/typebox").TLiteral<"NO_SHOW">, import("@sinclair/typebox").TLiteral<"CONFIRMED">]>]>;
        }>;
        readonly "appointments.createDocument": import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
            kind: import("@sinclair/typebox").TLiteral<"FILE">;
            title: import("@sinclair/typebox").TString;
            url: import("@sinclair/typebox").TString;
            mimeType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            sizeBytes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
        }>, import("@sinclair/typebox").TObject<{
            kind: import("@sinclair/typebox").TLiteral<"LINK">;
            title: import("@sinclair/typebox").TString;
            url: import("@sinclair/typebox").TString;
        }>]>;
        readonly "appointments.addService": import("@sinclair/typebox").TObject<{
            serviceId: import("@sinclair/typebox").TString;
            quantity: import("@sinclair/typebox").TNumber;
            priceSnapshot: import("@sinclair/typebox").TNumber;
            durationSnapshot: import("@sinclair/typebox").TNumber;
        }>;
        readonly "appointments.updateService": import("@sinclair/typebox").TObject<{
            quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            priceSnapshot: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            durationSnapshot: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        readonly "appointments.addProduct": import("@sinclair/typebox").TObject<{
            inventoryItemId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            nameSnapshot: import("@sinclair/typebox").TString;
            priceSnapshot: import("@sinclair/typebox").TNumber;
            quantity: import("@sinclair/typebox").TInteger;
            freeQuantity: import("@sinclair/typebox").TInteger;
            fullyFree: import("@sinclair/typebox").TBoolean;
        }>;
        readonly "appointments.updateProduct": import("@sinclair/typebox").TObject<{
            quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            freeQuantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            fullyFree: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            priceSnapshot: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        readonly "appointments.reschedule": import("@sinclair/typebox").TObject<{
            startsAt: import("@sinclair/typebox").TString;
            comment: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "appointments.refer": import("@sinclair/typebox").TObject<{
            staffId: import("@sinclair/typebox").TString;
            comment: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "appointments.updateRepeatUnit": import("@sinclair/typebox").TObject<{
            repeatUnit: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DAY">, import("@sinclair/typebox").TLiteral<"WEEK">, import("@sinclair/typebox").TLiteral<"TWO_WEEKS">, import("@sinclair/typebox").TLiteral<"MONTH">, import("@sinclair/typebox").TLiteral<"YEAR">]>;
            repeatCount: import("@sinclair/typebox").TInteger;
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
    appointments: {};
} & {
    appointments: {
        "critical-alerts": {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        patient: {
                            animalType: {
                                enName: string;
                            };
                            name: string;
                            id: string;
                        };
                        id: string;
                        reason: string | null;
                        startsAt: Date;
                    }[];
                    401: {
                        readonly message: "غير مصرح";
                    };
                };
            };
        };
    };
} & {
    appointments: {
        dashboard: {
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
                        staff: {
                            name: string;
                            prefix: import("../staff/staff.type").StaffPrefix | null;
                            id: string;
                        };
                        owner: {
                            name: string;
                            id: string;
                        };
                        patient: {
                            animalType: {
                                enName: string;
                            };
                            name: string;
                            id: string;
                        };
                        id: string;
                        code: string;
                        reason: string | null;
                        services: {
                            service: {
                                name: string;
                            };
                        }[];
                        status: import("../../../generated/prisma/enums").AppointmentStatus;
                        startsAt: Date;
                        durationMinutes: number;
                        queueStatus: import("../../../generated/prisma/enums").QueueStatus | null;
                        isEmergency: boolean;
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
    appointments: {
        list: {
            get: {
                body: {};
                params: {};
                query: {
                    period?: "week" | "day" | "all" | undefined;
                    view?: "all" | "for-me" | undefined;
                };
                headers: {};
                response: {
                    200: {
                        staff: {
                            name: string;
                            prefix: import("../staff/staff.type").StaffPrefix | null;
                        };
                        owner: {
                            name: string;
                            id: string;
                        };
                        patient: {
                            name: string;
                        };
                        clinicalExam: {
                            completedAt: Date | null;
                        } | null;
                        priority: import("../../../generated/prisma/enums").TaskPriority | null;
                        id: string;
                        updatedAt: Date;
                        _count: {
                            activity: number;
                        };
                        code: string;
                        reason: string | null;
                        services: {
                            service: {
                                name: string;
                            };
                        }[];
                        branchId: string;
                        status: import("../../../generated/prisma/enums").AppointmentStatus;
                        patientId: string;
                        activity: {
                            createdAt: Date;
                        }[];
                        startsAt: Date;
                        durationMinutes: number;
                        queueStatus: import("../../../generated/prisma/enums").QueueStatus | null;
                        isEmergency: boolean;
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
    appointments: {
        post: {
            body: {
                priority?: "MEDIUM" | "LOW" | "HIGH" | "URGENT" | null | undefined;
                clinicalNotes?: string | null | undefined;
                branchId?: string | undefined;
                status?: "WAITING" | "SCHEDULED" | undefined;
                consultationTypeId?: string | null | undefined;
                roomId?: string | null | undefined;
                location?: "IN_CLINIC" | "REMOTE" | "HOME_VISIT" | "MOBILE_CLINIC" | undefined;
                isEmergency?: boolean | undefined;
                whatsappReminderEnabled?: boolean | undefined;
                images?: string[] | undefined;
                repeatUnit?: "YEAR" | "MONTH" | "WEEK" | "DAY" | "TWO_WEEKS" | undefined;
                repeatCount?: number | undefined;
                enrollmentVisitId?: string | undefined;
                staffId: string;
                patientId: string;
                ownerId: string;
                startsAt: string;
                serviceIds: string[];
            };
            params: {};
            query: {};
            headers: {};
            response: {
                201: {
                    appointments: import("./appointments.type").AppointmentResponse[];
                    skippedDates: Date[];
                    roomConflicts: {
                        id: string;
                        code: string;
                        startsAt: Date;
                        durationMinutes: number;
                    }[];
                };
                400: {
                    readonly message: "لا يوجد فرع متاح";
                };
                401: {
                    readonly message: "غير مصرح";
                };
                409: {
                    readonly message: string;
                    readonly conflicts: {
                        id: string;
                        code: string;
                        startsAt: Date;
                    }[];
                };
                422: {
                    readonly message: string;
                    readonly kind: "BRANCH_MISMATCH" | "OWNER_MISMATCH" | "PATIENTS_MISSING" | "ROOM_MISMATCH" | "STAFF_MISSING" | "STAFF_SERVICES" | "EXAM_INCOMPLETE" | "INVALID_TRANSITION" | "PAYMENT_PENDING" | "TERMINAL_STATUS" | "LOCATION_LOCKED" | "LOCATION_NOTICE" | "SERVICE_OR_CONSULTATION_REQUIRED";
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
} & {
    appointments: {
        slots: {
            get: {
                body: {};
                params: {};
                query: {
                    excludeAppointmentId?: string | undefined;
                    date: string;
                    staffId: string;
                    durationMinutes: number;
                };
                headers: {};
                response: {
                    200: import("./appointments.type").AppointmentSlot[];
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
    appointments: {
        "staff-by-services": {
            get: {
                body: {};
                params: {};
                query: {
                    serviceIds: string;
                };
                headers: {};
                response: {
                    200: {
                        name: string;
                        prefix: import("../staff/staff.type").StaffPrefix | null;
                        id: string;
                        code: string;
                        role: {
                            name: string;
                            id: string;
                        };
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
    appointments: {
        "staff-for-booking": {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        name: string;
                        prefix: import("../staff/staff.type").StaffPrefix | null;
                        id: string;
                        code: string;
                        services: {
                            serviceId: string;
                        }[];
                        role: {
                            name: string;
                            id: string;
                        };
                    }[];
                    401: {
                        readonly message: "غير مصرح";
                    };
                };
            };
        };
    };
} & {
    appointments: {
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
                        room: {
                            type: import("../rooms/rooms.type").RoomType;
                            name: string;
                            id: string;
                        } | null;
                        consultationType: {
                            name: string;
                            id: string;
                        } | null;
                        staff: {
                            name: string;
                            prefix: import("../staff/staff.type").StaffPrefix | null;
                            id: string;
                        };
                        owner: {
                            name: string;
                            id: string;
                            phone: string;
                            code: string;
                        };
                        patient: {
                            name: string;
                            id: string;
                            code: string;
                        };
                        clinicalExam: {
                            completedAt: Date | null;
                        } | null;
                        invoice: {
                            id: string;
                            code: string;
                            status: import("../invoices/invoices.type").InvoiceStatus;
                            total: import("@prisma/client-runtime-utils").Decimal;
                        } | null;
                        priority: import("../../../generated/prisma/enums").TaskPriority | null;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        code: string;
                        reason: string | null;
                        services: {
                            service: {
                                name: string;
                                id: string;
                            };
                            id: string;
                            quantity: number;
                            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                            durationSnapshot: number;
                        }[];
                        clinicalNotes: string | null;
                        branchId: string;
                        status: import("../../../generated/prisma/enums").AppointmentStatus;
                        staffId: string;
                        ownerId: string;
                        startsAt: Date;
                        symptoms: string | null;
                        roomId: string | null;
                        durationMinutes: number;
                        location: import("../../../generated/prisma/enums").AppointmentLocation;
                        queueStatus: import("../../../generated/prisma/enums").QueueStatus | null;
                        isEmergency: boolean;
                        consultationFeeSnapshot: import("@prisma/client-runtime-utils").Decimal | null;
                        consultationPaidAt: Date | null;
                        whatsappReminderEnabled: boolean;
                        images: string[];
                        recurringGroupId: string | null;
                        recurringIndex: number | null;
                        recurringTotal: number | null;
                        repeatUnit: import("./appointments.type").RepeatUnit | null;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    404: {
                        readonly message: "الزيارة غير موجودة";
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
    appointments: {
        ":id": {
            status: {
                patch: {
                    body: {
                        status: "CANCELLED" | "WAITING" | "SCHEDULED" | "CHECK_IN" | "IN_SERVICE" | "HOSPITALIZED" | "AWAITING_PAYMENT" | "DONE";
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            staff: {
                                name: string;
                                prefix: import("../staff/staff.type").StaffPrefix | null;
                            };
                            owner: {
                                name: string;
                                id: string;
                            };
                            patient: {
                                name: string;
                            };
                            clinicalExam: {
                                completedAt: Date | null;
                            } | null;
                            priority: import("../../../generated/prisma/enums").TaskPriority | null;
                            id: string;
                            updatedAt: Date;
                            _count: {
                                activity: number;
                            };
                            code: string;
                            reason: string | null;
                            services: {
                                service: {
                                    name: string;
                                };
                            }[];
                            branchId: string;
                            status: import("../../../generated/prisma/enums").AppointmentStatus;
                            patientId: string;
                            activity: {
                                createdAt: Date;
                            }[];
                            startsAt: Date;
                            durationMinutes: number;
                            queueStatus: import("../../../generated/prisma/enums").QueueStatus | null;
                            isEmergency: boolean;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الزيارة غير موجودة";
                        };
                        422: {
                            readonly message: string;
                            readonly kind: "BRANCH_MISMATCH" | "OWNER_MISMATCH" | "PATIENTS_MISSING" | "ROOM_MISMATCH" | "STAFF_MISSING" | "STAFF_SERVICES" | "EXAM_INCOMPLETE" | "INVALID_TRANSITION" | "PAYMENT_PENDING" | "TERMINAL_STATUS" | "LOCATION_LOCKED" | "LOCATION_NOTICE" | "SERVICE_OR_CONSULTATION_REQUIRED";
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
    appointments: {
        ":id": {
            reschedule: {
                patch: {
                    body: {
                        comment?: string | undefined;
                        startsAt: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            room: {
                                type: import("../rooms/rooms.type").RoomType;
                                name: string;
                                id: string;
                            } | null;
                            consultationType: {
                                name: string;
                                id: string;
                            } | null;
                            staff: {
                                name: string;
                                prefix: import("../staff/staff.type").StaffPrefix | null;
                                id: string;
                            };
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                                code: string;
                            };
                            patient: {
                                name: string;
                                id: string;
                                code: string;
                            };
                            clinicalExam: {
                                completedAt: Date | null;
                            } | null;
                            invoice: {
                                id: string;
                                code: string;
                                status: import("../invoices/invoices.type").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                            } | null;
                            priority: import("../../../generated/prisma/enums").TaskPriority | null;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            code: string;
                            reason: string | null;
                            services: {
                                service: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                quantity: number;
                                priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                durationSnapshot: number;
                            }[];
                            clinicalNotes: string | null;
                            branchId: string;
                            status: import("../../../generated/prisma/enums").AppointmentStatus;
                            staffId: string;
                            ownerId: string;
                            startsAt: Date;
                            symptoms: string | null;
                            roomId: string | null;
                            durationMinutes: number;
                            location: import("../../../generated/prisma/enums").AppointmentLocation;
                            queueStatus: import("../../../generated/prisma/enums").QueueStatus | null;
                            isEmergency: boolean;
                            consultationFeeSnapshot: import("@prisma/client-runtime-utils").Decimal | null;
                            consultationPaidAt: Date | null;
                            whatsappReminderEnabled: boolean;
                            images: string[];
                            recurringGroupId: string | null;
                            recurringIndex: number | null;
                            recurringTotal: number | null;
                            repeatUnit: import("./appointments.type").RepeatUnit | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الزيارة غير موجودة";
                        };
                        409: {
                            readonly message: "لا يمكن إعادة جدولة زيارة منتهية أو ملغاة";
                        } | {
                            readonly message: string;
                            readonly conflicts: {
                                id: string;
                                code: string;
                                startsAt: Date;
                            }[];
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
    appointments: {
        ":id": {
            refer: {
                patch: {
                    body: {
                        comment?: string | undefined;
                        staffId: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            room: {
                                type: import("../rooms/rooms.type").RoomType;
                                name: string;
                                id: string;
                            } | null;
                            consultationType: {
                                name: string;
                                id: string;
                            } | null;
                            staff: {
                                name: string;
                                prefix: import("../staff/staff.type").StaffPrefix | null;
                                id: string;
                            };
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                                code: string;
                            };
                            patient: {
                                name: string;
                                id: string;
                                code: string;
                            };
                            clinicalExam: {
                                completedAt: Date | null;
                            } | null;
                            invoice: {
                                id: string;
                                code: string;
                                status: import("../invoices/invoices.type").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                            } | null;
                            priority: import("../../../generated/prisma/enums").TaskPriority | null;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            code: string;
                            reason: string | null;
                            services: {
                                service: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                quantity: number;
                                priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                durationSnapshot: number;
                            }[];
                            clinicalNotes: string | null;
                            branchId: string;
                            status: import("../../../generated/prisma/enums").AppointmentStatus;
                            staffId: string;
                            ownerId: string;
                            startsAt: Date;
                            symptoms: string | null;
                            roomId: string | null;
                            durationMinutes: number;
                            location: import("../../../generated/prisma/enums").AppointmentLocation;
                            queueStatus: import("../../../generated/prisma/enums").QueueStatus | null;
                            isEmergency: boolean;
                            consultationFeeSnapshot: import("@prisma/client-runtime-utils").Decimal | null;
                            consultationPaidAt: Date | null;
                            whatsappReminderEnabled: boolean;
                            images: string[];
                            recurringGroupId: string | null;
                            recurringIndex: number | null;
                            recurringTotal: number | null;
                            repeatUnit: import("./appointments.type").RepeatUnit | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الزيارة غير موجودة";
                        } | {
                            readonly message: "المدرّب غير موجود";
                        };
                        409: {
                            readonly message: "لا يمكن إحالة الزيارة بعد انتهائها";
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
    appointments: {
        ":id": {
            reason: {
                patch: {
                    body: {
                        reason: string | null;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            room: {
                                type: import("../rooms/rooms.type").RoomType;
                                name: string;
                                id: string;
                            } | null;
                            consultationType: {
                                name: string;
                                id: string;
                            } | null;
                            staff: {
                                name: string;
                                prefix: import("../staff/staff.type").StaffPrefix | null;
                                id: string;
                            };
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                                code: string;
                            };
                            patient: {
                                name: string;
                                id: string;
                                code: string;
                            };
                            clinicalExam: {
                                completedAt: Date | null;
                            } | null;
                            invoice: {
                                id: string;
                                code: string;
                                status: import("../invoices/invoices.type").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                            } | null;
                            priority: import("../../../generated/prisma/enums").TaskPriority | null;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            code: string;
                            reason: string | null;
                            services: {
                                service: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                quantity: number;
                                priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                durationSnapshot: number;
                            }[];
                            clinicalNotes: string | null;
                            branchId: string;
                            status: import("../../../generated/prisma/enums").AppointmentStatus;
                            staffId: string;
                            ownerId: string;
                            startsAt: Date;
                            symptoms: string | null;
                            roomId: string | null;
                            durationMinutes: number;
                            location: import("../../../generated/prisma/enums").AppointmentLocation;
                            queueStatus: import("../../../generated/prisma/enums").QueueStatus | null;
                            isEmergency: boolean;
                            consultationFeeSnapshot: import("@prisma/client-runtime-utils").Decimal | null;
                            consultationPaidAt: Date | null;
                            whatsappReminderEnabled: boolean;
                            images: string[];
                            recurringGroupId: string | null;
                            recurringIndex: number | null;
                            recurringTotal: number | null;
                            repeatUnit: import("./appointments.type").RepeatUnit | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الزيارة غير موجودة";
                        };
                        409: {
                            readonly message: "لا يمكن تعديل زيارة منتهية أو ملغاة";
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
    appointments: {
        ":id": {
            location: {
                patch: {
                    body: {
                        location: "IN_CLINIC" | "REMOTE" | "HOME_VISIT" | "MOBILE_CLINIC";
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            room: {
                                type: import("../rooms/rooms.type").RoomType;
                                name: string;
                                id: string;
                            } | null;
                            consultationType: {
                                name: string;
                                id: string;
                            } | null;
                            staff: {
                                name: string;
                                prefix: import("../staff/staff.type").StaffPrefix | null;
                                id: string;
                            };
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                                code: string;
                            };
                            patient: {
                                name: string;
                                id: string;
                                code: string;
                            };
                            clinicalExam: {
                                completedAt: Date | null;
                            } | null;
                            invoice: {
                                id: string;
                                code: string;
                                status: import("../invoices/invoices.type").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                            } | null;
                            priority: import("../../../generated/prisma/enums").TaskPriority | null;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            code: string;
                            reason: string | null;
                            services: {
                                service: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                quantity: number;
                                priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                durationSnapshot: number;
                            }[];
                            clinicalNotes: string | null;
                            branchId: string;
                            status: import("../../../generated/prisma/enums").AppointmentStatus;
                            staffId: string;
                            ownerId: string;
                            startsAt: Date;
                            symptoms: string | null;
                            roomId: string | null;
                            durationMinutes: number;
                            location: import("../../../generated/prisma/enums").AppointmentLocation;
                            queueStatus: import("../../../generated/prisma/enums").QueueStatus | null;
                            isEmergency: boolean;
                            consultationFeeSnapshot: import("@prisma/client-runtime-utils").Decimal | null;
                            consultationPaidAt: Date | null;
                            whatsappReminderEnabled: boolean;
                            images: string[];
                            recurringGroupId: string | null;
                            recurringIndex: number | null;
                            recurringTotal: number | null;
                            repeatUnit: import("./appointments.type").RepeatUnit | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الزيارة غير موجودة";
                        };
                        409: {
                            readonly message: string;
                            readonly kind: "BRANCH_MISMATCH" | "OWNER_MISMATCH" | "PATIENTS_MISSING" | "ROOM_MISMATCH" | "STAFF_MISSING" | "STAFF_SERVICES" | "EXAM_INCOMPLETE" | "INVALID_TRANSITION" | "PAYMENT_PENDING" | "TERMINAL_STATUS" | "LOCATION_LOCKED" | "LOCATION_NOTICE" | "SERVICE_OR_CONSULTATION_REQUIRED";
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
    appointments: {
        ":id": {
            "queue-status": {
                patch: {
                    body: {
                        queueStatus: "ON_HOLD" | "NO_SHOW" | "CONFIRMED" | null;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            room: {
                                type: import("../rooms/rooms.type").RoomType;
                                name: string;
                                id: string;
                            } | null;
                            consultationType: {
                                name: string;
                                id: string;
                            } | null;
                            staff: {
                                name: string;
                                prefix: import("../staff/staff.type").StaffPrefix | null;
                                id: string;
                            };
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                                code: string;
                            };
                            patient: {
                                name: string;
                                id: string;
                                code: string;
                            };
                            clinicalExam: {
                                completedAt: Date | null;
                            } | null;
                            invoice: {
                                id: string;
                                code: string;
                                status: import("../invoices/invoices.type").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                            } | null;
                            priority: import("../../../generated/prisma/enums").TaskPriority | null;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            code: string;
                            reason: string | null;
                            services: {
                                service: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                quantity: number;
                                priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                durationSnapshot: number;
                            }[];
                            clinicalNotes: string | null;
                            branchId: string;
                            status: import("../../../generated/prisma/enums").AppointmentStatus;
                            staffId: string;
                            ownerId: string;
                            startsAt: Date;
                            symptoms: string | null;
                            roomId: string | null;
                            durationMinutes: number;
                            location: import("../../../generated/prisma/enums").AppointmentLocation;
                            queueStatus: import("../../../generated/prisma/enums").QueueStatus | null;
                            isEmergency: boolean;
                            consultationFeeSnapshot: import("@prisma/client-runtime-utils").Decimal | null;
                            consultationPaidAt: Date | null;
                            whatsappReminderEnabled: boolean;
                            images: string[];
                            recurringGroupId: string | null;
                            recurringIndex: number | null;
                            recurringTotal: number | null;
                            repeatUnit: import("./appointments.type").RepeatUnit | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الزيارة غير موجودة";
                        };
                        422: {
                            readonly message: string;
                            readonly kind: "BRANCH_MISMATCH" | "OWNER_MISMATCH" | "PATIENTS_MISSING" | "ROOM_MISMATCH" | "STAFF_MISSING" | "STAFF_SERVICES" | "EXAM_INCOMPLETE" | "INVALID_TRANSITION" | "PAYMENT_PENDING" | "TERMINAL_STATUS" | "LOCATION_LOCKED" | "LOCATION_NOTICE" | "SERVICE_OR_CONSULTATION_REQUIRED";
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
    appointments: {
        ":id": {
            activity: {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            type: import("../../../generated/prisma/enums").AppointmentActivityType;
                            id: string;
                            createdAt: Date;
                            metadata: import("@prisma/client/runtime/client").JsonValue;
                            body: string | null;
                            appointmentId: string;
                            author: {
                                name: string;
                                id: string;
                            };
                        }[];
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الزيارة غير موجودة";
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
    appointments: {
        ":id": {
            "follow-ups": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            staff: {
                                name: string;
                                prefix: import("../staff/staff.type").StaffPrefix | null;
                                id: string;
                            };
                            id: string;
                            code: string;
                            reason: string | null;
                            services: {
                                service: {
                                    name: string;
                                };
                            }[];
                            status: import("../../../generated/prisma/enums").AppointmentStatus;
                            startsAt: Date;
                            durationMinutes: number;
                        }[];
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الزيارة غير موجودة";
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
    appointments: {
        ":id": {
            comments: {
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
                        201: {
                            type: import("../../../generated/prisma/enums").AppointmentActivityType;
                            id: string;
                            createdAt: Date;
                            metadata: import("@prisma/client/runtime/client").JsonValue;
                            body: string | null;
                            appointmentId: string;
                            author: {
                                name: string;
                                id: string;
                            };
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الزيارة غير موجودة";
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
    appointments: {
        ":id": {
            "internal-notes": {
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
                            updatedAt: Date;
                            body: string;
                            appointmentId: string;
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
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الزيارة غير موجودة";
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
    appointments: {
        ":id": {
            "internal-notes": {
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
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            body: string;
                            appointmentId: string;
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
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الزيارة غير موجودة";
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
    appointments: {
        ":id": {
            "internal-notes": {
                ":noteId": {
                    patch: {
                        body: {
                            body: string;
                        };
                        params: {
                            id: string;
                            noteId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                body: string;
                                appointmentId: string;
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
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: "لا يمكنك تعديل ملاحظة شخص آخر";
                            };
                            404: {
                                readonly message: "الملاحظة غير موجودة";
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
    appointments: {
        ":id": {
            "internal-notes": {
                ":noteId": {
                    delete: {
                        body: {};
                        params: {
                            id: string;
                            noteId: string;
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
                                readonly message: "لا يمكنك حذف ملاحظة شخص آخر";
                            };
                            404: {
                                readonly message: "الملاحظة غير موجودة";
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
    appointments: {
        ":id": {
            documents: {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            url: string;
                            id: string;
                            createdAt: Date;
                            title: string;
                            appointmentId: string;
                            kind: import("../clinic-documents/clinic-documents.type").DocumentKind;
                            author: {
                                name: string;
                                id: string;
                            };
                            mimeType: string | null;
                            sizeBytes: number | null;
                        }[];
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الزيارة غير موجودة";
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
    appointments: {
        ":id": {
            documents: {
                post: {
                    body: {
                        mimeType?: string | null | undefined;
                        sizeBytes?: number | null | undefined;
                        url: string;
                        title: string;
                        kind: "FILE";
                    } | {
                        url: string;
                        title: string;
                        kind: "LINK";
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            url: string;
                            id: string;
                            createdAt: Date;
                            title: string;
                            appointmentId: string;
                            kind: import("../clinic-documents/clinic-documents.type").DocumentKind;
                            author: {
                                name: string;
                                id: string;
                            };
                            mimeType: string | null;
                            sizeBytes: number | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الزيارة غير موجودة";
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
    appointments: {
        ":id": {
            documents: {
                ":documentId": {
                    delete: {
                        body: {};
                        params: {
                            id: string;
                            documentId: string;
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
                            404: {
                                readonly message: "المستند غير موجود";
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
    appointments: {
        ":id": {
            services: {
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
                                level: import("../../../generated/prisma/enums").ServiceLevel;
                                name: string;
                                id: string;
                                parentId: string | null;
                            };
                            id: string;
                            serviceId: string;
                            paidAt: Date | null;
                            appointmentId: string;
                            quantity: number;
                            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                            durationSnapshot: number;
                        }[];
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الزيارة غير موجودة";
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
    appointments: {
        ":id": {
            services: {
                post: {
                    body: {
                        serviceId: string;
                        quantity: number;
                        priceSnapshot: number;
                        durationSnapshot: number;
                    };
                    params: {
                        id: string;
                    };
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
                            id: string;
                            serviceId: string;
                            paidAt: Date | null;
                            appointmentId: string;
                            quantity: number;
                            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                            durationSnapshot: number;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الزيارة غير موجودة";
                        };
                        409: {
                            readonly message: "الدورة مضافة مسبقًا";
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
    appointments: {
        ":id": {
            services: {
                ":serviceRowId": {
                    patch: {
                        body: {
                            quantity?: number | undefined;
                            priceSnapshot?: number | undefined;
                            durationSnapshot?: number | undefined;
                        };
                        params: {
                            id: string;
                            serviceRowId: string;
                        };
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
                                id: string;
                                serviceId: string;
                                paidAt: Date | null;
                                appointmentId: string;
                                quantity: number;
                                priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                durationSnapshot: number;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                readonly message: "الدورة غير موجودة";
                            };
                            409: {
                                readonly message: "لا يمكن تعديل الفاتورة بعد الدفع";
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
    appointments: {
        recurring: {
            ":groupId": {
                "repeat-unit": {
                    patch: {
                        body: {
                            repeatUnit: "YEAR" | "MONTH" | "WEEK" | "DAY" | "TWO_WEEKS";
                            repeatCount: number;
                        };
                        params: {
                            groupId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                updated: number;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                readonly message: "المجموعة غير موجودة";
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
    appointments: {
        ":id": {
            services: {
                ":serviceRowId": {
                    delete: {
                        body: {};
                        params: {
                            id: string;
                            serviceRowId: string;
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
                            404: {
                                readonly message: "الدورة غير موجودة";
                            };
                            409: {
                                readonly message: "لا يمكن تعديل الفاتورة بعد الدفع";
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
    appointments: {
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
                            createdAt: Date;
                            paidAt: Date | null;
                            appointmentId: string;
                            quantity: number;
                            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                            inventoryItemId: string | null;
                            nameSnapshot: string;
                            freeQuantity: number;
                            fullyFree: boolean;
                            issuedAt: Date | null;
                        }[];
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الزيارة غير موجودة";
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
    appointments: {
        ":id": {
            products: {
                post: {
                    body: {
                        inventoryItemId?: string | null | undefined;
                        quantity: number;
                        priceSnapshot: number;
                        nameSnapshot: string;
                        freeQuantity: number;
                        fullyFree: boolean;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            id: string;
                            createdAt: Date;
                            paidAt: Date | null;
                            appointmentId: string;
                            quantity: number;
                            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                            inventoryItemId: string | null;
                            nameSnapshot: string;
                            freeQuantity: number;
                            fullyFree: boolean;
                            issuedAt: Date | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الزيارة غير موجودة";
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
    appointments: {
        ":id": {
            products: {
                ":productRowId": {
                    patch: {
                        body: {
                            quantity?: number | undefined;
                            priceSnapshot?: number | undefined;
                            freeQuantity?: number | undefined;
                            fullyFree?: boolean | undefined;
                        };
                        params: {
                            id: string;
                            productRowId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                createdAt: Date;
                                paidAt: Date | null;
                                appointmentId: string;
                                quantity: number;
                                priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                inventoryItemId: string | null;
                                nameSnapshot: string;
                                freeQuantity: number;
                                fullyFree: boolean;
                                issuedAt: Date | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                readonly message: "الصنف غير موجود";
                            };
                            409: {
                                readonly message: "لا يمكن تعديل الفاتورة بعد الدفع";
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
    appointments: {
        ":id": {
            products: {
                ":productRowId": {
                    delete: {
                        body: {};
                        params: {
                            id: string;
                            productRowId: string;
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
                            404: {
                                readonly message: "الصنف غير موجود";
                            };
                            409: {
                                readonly message: "لا يمكن تعديل الفاتورة بعد الدفع";
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
