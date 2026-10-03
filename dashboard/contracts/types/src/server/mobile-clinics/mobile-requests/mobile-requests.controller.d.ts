import Elysia from "elysia";
export declare const mobileRequestsController: Elysia<"/mobile-requests", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
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
                readonly message: "لا تملك صلاحية عرض الطلبات";
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
    "mobile-requests": {
        public: {
            ":slug": {
                availability: {
                    get: {
                        body: unknown;
                        params: {
                            slug: string;
                        } & {};
                        query: unknown;
                        headers: unknown;
                        response: {
                            200: {
                                clinicName: string;
                                accepting: boolean;
                                animalTypes: {
                                    id: string;
                                    arName: string;
                                }[];
                                zones: string[];
                                services: ({
                                    id: string;
                                    name: string;
                                    categoryName: string | null;
                                    price: string | null;
                                    duration: number | null;
                                } & {
                                    price: string;
                                })[];
                            };
                            404: {
                                readonly message: "الأكاديمية غير موجودة";
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
    "mobile-requests": {
        public: {
            ":slug": {
                post: {
                    body: {
                        email?: string | undefined;
                        city?: string | undefined;
                        notes?: string | undefined;
                        animalTypeId?: string | undefined;
                        district?: string | undefined;
                        lat?: number | undefined;
                        lng?: number | undefined;
                        landmark?: string | undefined;
                        petName?: string | undefined;
                        petNotes?: string | undefined;
                        serviceIds?: string[] | undefined;
                        preferredDate?: string | undefined;
                        preferredWindow?: "MORNING" | "EVENING" | "ANY" | "AFTERNOON" | undefined;
                        phone: string;
                        ownerName: string;
                        addressLine: string;
                    };
                    params: {
                        slug: string;
                    } & {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: {
                            code: string;
                        };
                        404: {
                            readonly message: "الأكاديمية غير موجودة";
                        };
                        422: {
                            readonly message: "بعض الدورات المختارة غير متاحة للأكاديمية المتنقلة";
                        } | {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                        429: {
                            readonly message: "محاولات كثيرة. حاول لاحقًا.";
                        } | {
                            readonly message: "تم إرسال طلبات كثيرة من هذا الجهاز.";
                        };
                    };
                };
            };
        };
    };
} & {
    "mobile-requests": {
        get: {
            body: {};
            params: {};
            query: {
                status?: "NEW" | "REJECTED" | "SCHEDULED" | "CONTACTED" | "SPAM" | undefined;
            };
            headers: {};
            response: {
                200: {
                    animalType: {
                        id: string;
                        arName: string;
                    } | null;
                    attachments: string[];
                    id: string;
                    createdAt: Date;
                    email: string | null;
                    phone: string;
                    city: string | null;
                    code: string;
                    notes: string | null;
                    status: import("./mobile-requests.type").MobileBookingRequestStatus;
                    appointmentId: string | null;
                    ownerId: string | null;
                    rejectionReason: string | null;
                    ownerName: string;
                    addressLine: string;
                    district: string | null;
                    lat: import("@prisma/client-runtime-utils").Decimal | null;
                    lng: import("@prisma/client-runtime-utils").Decimal | null;
                    landmark: string | null;
                    petName: string | null;
                    petNotes: string | null;
                    serviceIds: string[];
                    preferredDate: Date | null;
                    preferredWindow: import("./mobile-requests.type").PreferredWindow | null;
                    handledAt: Date | null;
                    handledBy: {
                        name: string;
                        id: string;
                    } | null;
                    zone: {
                        name: string;
                        id: string;
                        travelFee: import("@prisma/client-runtime-utils").Decimal | null;
                    } | null;
                }[];
                401: {
                    readonly message: "غير مصرح";
                };
                403: {
                    readonly message: "لا تملك صلاحية عرض الطلبات";
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
    "mobile-requests": {
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
                        animalType: {
                            id: string;
                            arName: string;
                        } | null;
                        attachments: string[];
                        id: string;
                        createdAt: Date;
                        email: string | null;
                        phone: string;
                        city: string | null;
                        code: string;
                        notes: string | null;
                        status: import("./mobile-requests.type").MobileBookingRequestStatus;
                        appointmentId: string | null;
                        ownerId: string | null;
                        rejectionReason: string | null;
                        ownerName: string;
                        addressLine: string;
                        district: string | null;
                        lat: import("@prisma/client-runtime-utils").Decimal | null;
                        lng: import("@prisma/client-runtime-utils").Decimal | null;
                        landmark: string | null;
                        petName: string | null;
                        petNotes: string | null;
                        serviceIds: string[];
                        preferredDate: Date | null;
                        preferredWindow: import("./mobile-requests.type").PreferredWindow | null;
                        handledAt: Date | null;
                        handledBy: {
                            name: string;
                            id: string;
                        } | null;
                        zone: {
                            name: string;
                            id: string;
                            travelFee: import("@prisma/client-runtime-utils").Decimal | null;
                        } | null;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض الطلبات";
                    };
                    404: {
                        readonly message: "الطلب غير موجود";
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
    "mobile-requests": {
        ":id": {
            status: {
                patch: {
                    body: {
                        rejectionReason?: string | undefined;
                        status: "NEW" | "REJECTED" | "SCHEDULED" | "CONTACTED" | "SPAM";
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            animalType: {
                                id: string;
                                arName: string;
                            } | null;
                            attachments: string[];
                            id: string;
                            createdAt: Date;
                            email: string | null;
                            phone: string;
                            city: string | null;
                            code: string;
                            notes: string | null;
                            status: import("./mobile-requests.type").MobileBookingRequestStatus;
                            appointmentId: string | null;
                            ownerId: string | null;
                            rejectionReason: string | null;
                            ownerName: string;
                            addressLine: string;
                            district: string | null;
                            lat: import("@prisma/client-runtime-utils").Decimal | null;
                            lng: import("@prisma/client-runtime-utils").Decimal | null;
                            landmark: string | null;
                            petName: string | null;
                            petNotes: string | null;
                            serviceIds: string[];
                            preferredDate: Date | null;
                            preferredWindow: import("./mobile-requests.type").PreferredWindow | null;
                            handledAt: Date | null;
                            handledBy: {
                                name: string;
                                id: string;
                            } | null;
                            zone: {
                                name: string;
                                id: string;
                                travelFee: import("@prisma/client-runtime-utils").Decimal | null;
                            } | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض الطلبات";
                        } | {
                            readonly message: "لا تملك صلاحية فرز الطلبات";
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
    "mobile-requests": {
        ":id": {
            convert: {
                post: {
                    body: {
                        mobileUnitId?: string | undefined;
                        windowStart?: string | undefined;
                        windowEnd?: string | undefined;
                        branchId: string;
                        staffId: string;
                        startsAt: string;
                        durationMinutes: number;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            appointmentId: string;
                            visitId: string;
                            trackingToken: string;
                            requestCode: string;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض الطلبات";
                        } | {
                            readonly message: "لا تملك صلاحية تحويل الطلبات";
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
}>;
