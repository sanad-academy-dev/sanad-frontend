import Elysia from "elysia";
/**
 * [MC4.3][MC5.1] إسناد الزيارات المتنقلة وتحريك مراحلها.
 *
 * الإسناد وإعادة الترتيب وتغيير المرحلة من لوحة التحكّم كلّها تحت `mobile_clinics.dispatch`:
 * هذه أفعال منسّق الحركة اليومية، وهي منفصلة عن `edit` الذي يخصّ بيانات المركبة نفسها.
 */
export declare const mobileVisitsController: Elysia<"/mobile-visits", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "mobileVisits.address.create": import("@sinclair/typebox").TObject<{
            ownerId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            line1: import("@sinclair/typebox").TString;
            label: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            district: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            city: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            landmark: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            accessNotes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            lat: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            lng: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        readonly "mobileVisits.attach": import("@sinclair/typebox").TObject<{
            appointmentId: import("@sinclair/typebox").TString;
            serviceAddressId: import("@sinclair/typebox").TString;
        }>;
        readonly "mobileVisits.assign": import("@sinclair/typebox").TObject<{
            mobileUnitId: import("@sinclair/typebox").TString;
            sequence: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            windowStart: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            windowEnd: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "mobileVisits.stage": import("@sinclair/typebox").TObject<{
            stage: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PENDING">, import("@sinclair/typebox").TLiteral<"ASSIGNED">, import("@sinclair/typebox").TLiteral<"EN_ROUTE">, import("@sinclair/typebox").TLiteral<"ARRIVED">, import("@sinclair/typebox").TLiteral<"IN_SERVICE">, import("@sinclair/typebox").TLiteral<"COMPLETED">, import("@sinclair/typebox").TLiteral<"FAILED">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>;
            reason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NO_ANSWER">, import("@sinclair/typebox").TLiteral<"ADDRESS_NOT_FOUND">, import("@sinclair/typebox").TLiteral<"ACCESS_DENIED">, import("@sinclair/typebox").TLiteral<"PET_UNAVAILABLE">, import("@sinclair/typebox").TLiteral<"OWNER_CANCELLED">, import("@sinclair/typebox").TLiteral<"VEHICLE_ISSUE">, import("@sinclair/typebox").TLiteral<"WEATHER">, import("@sinclair/typebox").TLiteral<"OTHER">]>>;
            note: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            lat: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            lng: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            at: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "mobileVisits.reorder": import("@sinclair/typebox").TObject<{
            mobileUnitId: import("@sinclair/typebox").TString;
            orderedVisitIds: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
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
                readonly message: "لا تملك صلاحية عرض الأكاديميات المتنقلة";
            }, 403> | {
                clinicId: string;
                userId: string;
                canDispatch: boolean;
            }>;
        };
    };
    parser: {};
    response: {};
}, {
    "mobile-visits": {};
} & {
    "mobile-visits": {
        board: {
            get: {
                body: {};
                params: {};
                query: {
                    date?: string | undefined;
                };
                headers: {};
                response: {
                    200: {
                        appointment: {
                            staff: {
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
                                    arName: string;
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
                                id: string;
                            }[];
                            status: import("../../../../generated/prisma/enums").AppointmentStatus;
                            startsAt: Date;
                            durationMinutes: number;
                        };
                        mobileUnit: {
                            name: string;
                            id: string;
                            code: string;
                            status: import("../mobile-units/mobile-units.type").MobileUnitStatus;
                        } | null;
                        serviceAddress: {
                            id: string;
                            city: string | null;
                            isDefault: boolean;
                            label: string | null;
                            district: string | null;
                            lat: import("@prisma/client-runtime-utils").Decimal | null;
                            lng: import("@prisma/client-runtime-utils").Decimal | null;
                            landmark: string | null;
                            line1: string;
                            accessNotes: string | null;
                        };
                        id: string;
                        appointmentId: string;
                        arrivedAt: Date | null;
                        mobileUnitId: string | null;
                        shiftId: string | null;
                        sequence: number | null;
                        windowStart: Date | null;
                        windowEnd: Date | null;
                        etaAt: Date | null;
                        dispatchStage: import("./mobile-visits.type").MobileDispatchStage;
                        enRouteAt: Date | null;
                        departedAt: Date | null;
                        arrivalDriftM: number | null;
                        distanceKm: import("@prisma/client-runtime-utils").Decimal | null;
                        travelMinutes: number | null;
                        travelFee: import("@prisma/client-runtime-utils").Decimal | null;
                        failureReason: import("./mobile-visits.type").MobileVisitFailureReason | null;
                        failureNote: string | null;
                        trackingToken: string;
                    }[];
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض الأكاديميات المتنقلة";
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
    "mobile-visits": {
        "by-appointment": {
            ":appointmentId": {
                get: {
                    body: {};
                    params: {
                        appointmentId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            appointment: {
                                staff: {
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
                                        arName: string;
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
                                    id: string;
                                }[];
                                status: import("../../../../generated/prisma/enums").AppointmentStatus;
                                startsAt: Date;
                                durationMinutes: number;
                            };
                            mobileUnit: {
                                name: string;
                                id: string;
                                code: string;
                                status: import("../mobile-units/mobile-units.type").MobileUnitStatus;
                            } | null;
                            serviceAddress: {
                                id: string;
                                city: string | null;
                                isDefault: boolean;
                                label: string | null;
                                district: string | null;
                                lat: import("@prisma/client-runtime-utils").Decimal | null;
                                lng: import("@prisma/client-runtime-utils").Decimal | null;
                                landmark: string | null;
                                line1: string;
                                accessNotes: string | null;
                            };
                            id: string;
                            appointmentId: string;
                            arrivedAt: Date | null;
                            mobileUnitId: string | null;
                            shiftId: string | null;
                            sequence: number | null;
                            windowStart: Date | null;
                            windowEnd: Date | null;
                            etaAt: Date | null;
                            dispatchStage: import("./mobile-visits.type").MobileDispatchStage;
                            enRouteAt: Date | null;
                            departedAt: Date | null;
                            arrivalDriftM: number | null;
                            distanceKm: import("@prisma/client-runtime-utils").Decimal | null;
                            travelMinutes: number | null;
                            travelFee: import("@prisma/client-runtime-utils").Decimal | null;
                            failureReason: import("./mobile-visits.type").MobileVisitFailureReason | null;
                            failureNote: string | null;
                            trackingToken: string;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض الأكاديميات المتنقلة";
                        };
                        404: {
                            readonly message: "لا توجد زيارة متنقلة مرتبطة";
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
    "mobile-visits": {
        addresses: {
            ":ownerId": {
                get: {
                    body: {};
                    params: {
                        ownerId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            city: string | null;
                            isDefault: boolean;
                            label: string | null;
                            district: string | null;
                            lat: import("@prisma/client-runtime-utils").Decimal | null;
                            lng: import("@prisma/client-runtime-utils").Decimal | null;
                            landmark: string | null;
                            line1: string;
                            accessNotes: string | null;
                        }[];
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض الأكاديميات المتنقلة";
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
    "mobile-visits": {
        addresses: {
            post: {
                body: {
                    city?: string | undefined;
                    ownerId?: string | undefined;
                    label?: string | undefined;
                    district?: string | undefined;
                    lat?: number | undefined;
                    lng?: number | undefined;
                    landmark?: string | undefined;
                    accessNotes?: string | undefined;
                    line1: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        id: string;
                        city: string | null;
                        isDefault: boolean;
                        label: string | null;
                        district: string | null;
                        lat: import("@prisma/client-runtime-utils").Decimal | null;
                        lng: import("@prisma/client-runtime-utils").Decimal | null;
                        landmark: string | null;
                        line1: string;
                        accessNotes: string | null;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض الأكاديميات المتنقلة";
                    } | {
                        readonly message: "لا تملك صلاحية إدارة الزيارات المتنقلة";
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
    "mobile-visits": {
        attach: {
            post: {
                body: {
                    appointmentId: string;
                    serviceAddressId: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        appointment: {
                            staff: {
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
                                    arName: string;
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
                                id: string;
                            }[];
                            status: import("../../../../generated/prisma/enums").AppointmentStatus;
                            startsAt: Date;
                            durationMinutes: number;
                        };
                        mobileUnit: {
                            name: string;
                            id: string;
                            code: string;
                            status: import("../mobile-units/mobile-units.type").MobileUnitStatus;
                        } | null;
                        serviceAddress: {
                            id: string;
                            city: string | null;
                            isDefault: boolean;
                            label: string | null;
                            district: string | null;
                            lat: import("@prisma/client-runtime-utils").Decimal | null;
                            lng: import("@prisma/client-runtime-utils").Decimal | null;
                            landmark: string | null;
                            line1: string;
                            accessNotes: string | null;
                        };
                        id: string;
                        appointmentId: string;
                        arrivedAt: Date | null;
                        mobileUnitId: string | null;
                        shiftId: string | null;
                        sequence: number | null;
                        windowStart: Date | null;
                        windowEnd: Date | null;
                        etaAt: Date | null;
                        dispatchStage: import("./mobile-visits.type").MobileDispatchStage;
                        enRouteAt: Date | null;
                        departedAt: Date | null;
                        arrivalDriftM: number | null;
                        distanceKm: import("@prisma/client-runtime-utils").Decimal | null;
                        travelMinutes: number | null;
                        travelFee: import("@prisma/client-runtime-utils").Decimal | null;
                        failureReason: import("./mobile-visits.type").MobileVisitFailureReason | null;
                        failureNote: string | null;
                        trackingToken: string;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض الأكاديميات المتنقلة";
                    } | {
                        readonly message: "لا تملك صلاحية إدارة الزيارات المتنقلة";
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
    "mobile-visits": {
        ":id": {
            assign: {
                post: {
                    body: {
                        sequence?: number | undefined;
                        windowStart?: string | undefined;
                        windowEnd?: string | undefined;
                        mobileUnitId: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            appointment: {
                                staff: {
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
                                        arName: string;
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
                                    id: string;
                                }[];
                                status: import("../../../../generated/prisma/enums").AppointmentStatus;
                                startsAt: Date;
                                durationMinutes: number;
                            };
                            mobileUnit: {
                                name: string;
                                id: string;
                                code: string;
                                status: import("../mobile-units/mobile-units.type").MobileUnitStatus;
                            } | null;
                            serviceAddress: {
                                id: string;
                                city: string | null;
                                isDefault: boolean;
                                label: string | null;
                                district: string | null;
                                lat: import("@prisma/client-runtime-utils").Decimal | null;
                                lng: import("@prisma/client-runtime-utils").Decimal | null;
                                landmark: string | null;
                                line1: string;
                                accessNotes: string | null;
                            };
                            id: string;
                            appointmentId: string;
                            arrivedAt: Date | null;
                            mobileUnitId: string | null;
                            shiftId: string | null;
                            sequence: number | null;
                            windowStart: Date | null;
                            windowEnd: Date | null;
                            etaAt: Date | null;
                            dispatchStage: import("./mobile-visits.type").MobileDispatchStage;
                            enRouteAt: Date | null;
                            departedAt: Date | null;
                            arrivalDriftM: number | null;
                            distanceKm: import("@prisma/client-runtime-utils").Decimal | null;
                            travelMinutes: number | null;
                            travelFee: import("@prisma/client-runtime-utils").Decimal | null;
                            failureReason: import("./mobile-visits.type").MobileVisitFailureReason | null;
                            failureNote: string | null;
                            trackingToken: string;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض الأكاديميات المتنقلة";
                        } | {
                            readonly message: "لا تملك صلاحية إسناد الزيارات";
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
    "mobile-visits": {
        ":id": {
            unassign: {
                post: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            appointment: {
                                staff: {
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
                                        arName: string;
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
                                    id: string;
                                }[];
                                status: import("../../../../generated/prisma/enums").AppointmentStatus;
                                startsAt: Date;
                                durationMinutes: number;
                            };
                            mobileUnit: {
                                name: string;
                                id: string;
                                code: string;
                                status: import("../mobile-units/mobile-units.type").MobileUnitStatus;
                            } | null;
                            serviceAddress: {
                                id: string;
                                city: string | null;
                                isDefault: boolean;
                                label: string | null;
                                district: string | null;
                                lat: import("@prisma/client-runtime-utils").Decimal | null;
                                lng: import("@prisma/client-runtime-utils").Decimal | null;
                                landmark: string | null;
                                line1: string;
                                accessNotes: string | null;
                            };
                            id: string;
                            appointmentId: string;
                            arrivedAt: Date | null;
                            mobileUnitId: string | null;
                            shiftId: string | null;
                            sequence: number | null;
                            windowStart: Date | null;
                            windowEnd: Date | null;
                            etaAt: Date | null;
                            dispatchStage: import("./mobile-visits.type").MobileDispatchStage;
                            enRouteAt: Date | null;
                            departedAt: Date | null;
                            arrivalDriftM: number | null;
                            distanceKm: import("@prisma/client-runtime-utils").Decimal | null;
                            travelMinutes: number | null;
                            travelFee: import("@prisma/client-runtime-utils").Decimal | null;
                            failureReason: import("./mobile-visits.type").MobileVisitFailureReason | null;
                            failureNote: string | null;
                            trackingToken: string;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض الأكاديميات المتنقلة";
                        } | {
                            readonly message: "لا تملك صلاحية إسناد الزيارات";
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
    "mobile-visits": {
        ":id": {
            stage: {
                patch: {
                    body: {
                        at?: string | undefined;
                        reason?: "ACCESS_DENIED" | "OTHER" | "OWNER_CANCELLED" | "NO_ANSWER" | "ADDRESS_NOT_FOUND" | "PET_UNAVAILABLE" | "VEHICLE_ISSUE" | "WEATHER" | undefined;
                        note?: string | undefined;
                        lat?: number | undefined;
                        lng?: number | undefined;
                        stage: "PENDING" | "CANCELLED" | "COMPLETED" | "FAILED" | "IN_SERVICE" | "ASSIGNED" | "EN_ROUTE" | "ARRIVED";
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            appointment: {
                                staff: {
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
                                        arName: string;
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
                                    id: string;
                                }[];
                                status: import("../../../../generated/prisma/enums").AppointmentStatus;
                                startsAt: Date;
                                durationMinutes: number;
                            };
                            mobileUnit: {
                                name: string;
                                id: string;
                                code: string;
                                status: import("../mobile-units/mobile-units.type").MobileUnitStatus;
                            } | null;
                            serviceAddress: {
                                id: string;
                                city: string | null;
                                isDefault: boolean;
                                label: string | null;
                                district: string | null;
                                lat: import("@prisma/client-runtime-utils").Decimal | null;
                                lng: import("@prisma/client-runtime-utils").Decimal | null;
                                landmark: string | null;
                                line1: string;
                                accessNotes: string | null;
                            };
                            id: string;
                            appointmentId: string;
                            arrivedAt: Date | null;
                            mobileUnitId: string | null;
                            shiftId: string | null;
                            sequence: number | null;
                            windowStart: Date | null;
                            windowEnd: Date | null;
                            etaAt: Date | null;
                            dispatchStage: import("./mobile-visits.type").MobileDispatchStage;
                            enRouteAt: Date | null;
                            departedAt: Date | null;
                            arrivalDriftM: number | null;
                            distanceKm: import("@prisma/client-runtime-utils").Decimal | null;
                            travelMinutes: number | null;
                            travelFee: import("@prisma/client-runtime-utils").Decimal | null;
                            failureReason: import("./mobile-visits.type").MobileVisitFailureReason | null;
                            failureNote: string | null;
                            trackingToken: string;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض الأكاديميات المتنقلة";
                        } | {
                            readonly message: "لا تملك صلاحية تغيير مرحلة الزيارة";
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
    "mobile-visits": {
        reorder: {
            post: {
                body: {
                    mobileUnitId: string;
                    orderedVisitIds: string[];
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        success: true;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض الأكاديميات المتنقلة";
                    } | {
                        readonly message: "لا تملك صلاحية ترتيب المسار";
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
    "mobile-visits": {
        ":id": {
            eta: {
                post: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            etaAt: string;
                            travelMinutes: number;
                        } | null;
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض الأكاديميات المتنقلة";
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
