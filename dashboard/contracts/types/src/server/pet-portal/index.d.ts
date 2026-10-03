import Elysia from "elysia";
/**
 * [PP1] جذر تركيب بوّابة وليّ الأمر.
 *
 * يُسجَّل بـ`.use()` **واحدة**، على سنّة `mobileClinicsServer` و`accountingServer`.
 * السبب مكتوب في رأس `src/server/index.ts`: سلسلة مسطّحة من `.use()` تدفع نوع Elysia
 * المركَّب إلى سقف عمق التوليد في TypeScript، والخطأ يظهر عندها في `app.ts` لا في
 * الوحدة التي أضافته.
 */
export declare const petPortalServer: Elysia<"", {
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
    macro: {};
    macroFn: {};
    parser: {};
    response: {};
} & {
    schema: {};
    standaloneSchema: {};
    macro: Partial<{
        readonly requirePetOwner: boolean;
    }>;
    macroFn: {
        readonly requirePetOwner: {
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
            }) => Promise<import("./pet-auth.macro").PetOwnerScope | import("elysia").ElysiaCustomStatusResponse<401, {
                readonly message: "غير مصرح";
            }, 401> | import("elysia").ElysiaCustomStatusResponse<403, {
                readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                readonly code: "ACCOUNT_SUSPENDED";
            }, 403> | import("elysia").ElysiaCustomStatusResponse<401, {
                readonly message: "انتهت الجلسة";
            }, 401>>;
        };
    };
    parser: {};
    response: {};
}, {
    pet: {};
} & {
    pet: {
        auth: {
            "sign-in": {
                post: {
                    body: {
                        phone: string;
                        password: string;
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            token: string;
                            mustChangePassword: boolean;
                            name: string | null;
                        };
                        401: {
                            readonly message: "رقم الجوال أو كلمة المرور غير صحيحة";
                        };
                        403: {
                            readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                        };
                        422: {
                            readonly message: "رقم جوال غير صالح";
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
                            readonly message: "تم قفل الحساب مؤقتًا بعد محاولات كثيرة. حاول بعد ربع ساعة.";
                        };
                    };
                };
            };
        };
    };
} & {
    pet: {
        auth: {
            "sign-out": {
                post: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            ok: boolean;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        } | {
                            readonly message: "انتهت الجلسة";
                        };
                        403: {
                            readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                            readonly code: "ACCOUNT_SUSPENDED";
                        };
                    };
                };
            };
        };
    };
} & {
    pet: {
        auth: {
            "change-password": {
                post: {
                    body: {
                        password: string;
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            ok: boolean;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        } | {
                            readonly message: "انتهت الجلسة";
                        };
                        403: {
                            readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                            readonly code: "ACCOUNT_SUSPENDED";
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
    pet: {
        me: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        account: {
                            id: string;
                            phoneE164: string;
                            name: string | null;
                            email: string | null;
                            locale: string;
                            avatarUrl: string | null;
                            marketingOptIn: boolean;
                            consentVersion: string | null;
                            deletionScheduledAt: string | null;
                            mustChangePassword: boolean;
                        } | null;
                        links: {
                            linkId: string;
                            clinicId: string;
                            clinicName: string;
                            clinicSlug: string | null;
                            logoUrl: string | null;
                            phone: string | null;
                            city: string | null;
                            source: import("../../../generated/prisma/enums").PetOwnerLinkSource;
                            hidden: boolean;
                            ownerCode: string;
                            petCount: number;
                            directBooking: boolean;
                        }[];
                        unreadMessages: number;
                        unreadNotifications: number;
                        dueCount: number;
                        unpaidCount: number;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    } | {
                        readonly message: "انتهت الجلسة";
                    };
                    403: {
                        readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                        readonly code: "ACCOUNT_SUSPENDED";
                    };
                };
            };
        };
    };
} & {
    pet: {
        pets: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        pets: {
                            id: string;
                            clinicId: string;
                            clinicName: string;
                            code: string;
                            name: string;
                            gender: import("../staff/staff.type").Gender;
                            animalType: string;
                            animalStrain: string | null;
                            birthDate: string | null;
                            weightKg: number | null;
                            microchipNumber: string | null;
                            coat: string | null;
                            photoUrl: string | null;
                            linkedPatientIds: string[];
                        }[];
                        suggestions: never[];
                    };
                    401: {
                        readonly message: "غير مصرح";
                    } | {
                        readonly message: "انتهت الجلسة";
                    };
                    403: {
                        readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                        readonly code: "ACCOUNT_SUSPENDED";
                    };
                };
            };
        };
    };
} & {
    pet: {
        appointments: {
            get: {
                body: {};
                params: {};
                query: {
                    scope?: "upcoming" | "past" | undefined;
                };
                headers: {};
                response: {
                    200: {
                        items: {
                            id: string;
                            clinicId: string;
                            clinicName: string;
                            branchName: string;
                            petId: string;
                            petName: string;
                            petPhotoUrl: string | null;
                            doctorName: string | null;
                            serviceName: string;
                            startsAt: string;
                            endsAt: string;
                            status: import("../../../generated/prisma/enums").AppointmentStatus;
                            location: import("../../../generated/prisma/enums").AppointmentLocation;
                            canCancel: boolean;
                            canReschedule: boolean;
                            canCheckIn: boolean;
                            trackingAvailable: boolean;
                            callRoom: string | null;
                            invoiceId: string | null;
                        }[];
                    };
                    401: {
                        readonly message: "غير مصرح";
                    } | {
                        readonly message: "انتهت الجلسة";
                    };
                    403: {
                        readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                        readonly code: "ACCOUNT_SUSPENDED";
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
    pet: {
        home: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        account: {
                            id: string;
                            phoneE164: string;
                            name: string | null;
                            email: string | null;
                            locale: string;
                            avatarUrl: string | null;
                            marketingOptIn: boolean;
                            consentVersion: string | null;
                            deletionScheduledAt: string | null;
                            mustChangePassword: boolean;
                        } | null;
                        clinics: {
                            linkId: string;
                            clinicId: string;
                            clinicName: string;
                            clinicSlug: string | null;
                            logoUrl: string | null;
                            phone: string | null;
                            city: string | null;
                            source: import("../../../generated/prisma/enums").PetOwnerLinkSource;
                            hidden: boolean;
                            ownerCode: string;
                            petCount: number;
                            directBooking: boolean;
                        }[];
                        pets: {
                            id: string;
                            clinicId: string;
                            clinicName: string;
                            code: string;
                            name: string;
                            gender: import("../staff/staff.type").Gender;
                            animalType: string;
                            animalStrain: string | null;
                            birthDate: string | null;
                            weightKg: number | null;
                            microchipNumber: string | null;
                            coat: string | null;
                            photoUrl: string | null;
                            linkedPatientIds: string[];
                        }[];
                        nextAppointment: {
                            id: string;
                            clinicId: string;
                            clinicName: string;
                            branchName: string;
                            petId: string;
                            petName: string;
                            petPhotoUrl: string | null;
                            doctorName: string | null;
                            serviceName: string;
                            startsAt: string;
                            endsAt: string;
                            status: import("../../../generated/prisma/enums").AppointmentStatus;
                            location: import("../../../generated/prisma/enums").AppointmentLocation;
                            canCancel: boolean;
                            canReschedule: boolean;
                            canCheckIn: boolean;
                            trackingAvailable: boolean;
                            callRoom: string | null;
                            invoiceId: string | null;
                        };
                        due: ({
                            id: string;
                            kind: "VACCINATION";
                            petId: string;
                            petName: string;
                            petPhotoUrl: string | null;
                            clinicName: string;
                            title: string;
                            dueAt: string | null;
                            ageUnknown: boolean;
                        } | {
                            id: string;
                            kind: "CARE_PLAN_VISIT";
                            petId: string;
                            petName: string;
                            petPhotoUrl: string | null;
                            clinicName: string;
                            title: string;
                            dueAt: string;
                            ageUnknown: boolean;
                        })[];
                        unpaidTotal: number;
                        unpaidCount: number;
                        currencyCode: string;
                        unreadMessages: number;
                        unreadNotifications: number;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    } | {
                        readonly message: "انتهت الجلسة";
                    };
                    403: {
                        readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                        readonly code: "ACCOUNT_SUSPENDED";
                    };
                };
            };
        };
    };
} & {
    pet: {
        clinics: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        items: {
                            linkId: string;
                            clinicId: string;
                            clinicName: string;
                            clinicSlug: string | null;
                            logoUrl: string | null;
                            phone: string | null;
                            city: string | null;
                            source: import("../../../generated/prisma/enums").PetOwnerLinkSource;
                            hidden: boolean;
                            ownerCode: string;
                            petCount: number;
                            directBooking: boolean;
                        }[];
                    };
                    401: {
                        readonly message: "غير مصرح";
                    } | {
                        readonly message: "انتهت الجلسة";
                    };
                    403: {
                        readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                        readonly code: "ACCOUNT_SUSPENDED";
                    };
                };
            };
        };
    };
} & {
    pet: {
        pets: {
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
                            clinicId: string;
                            clinicName: string;
                            code: string;
                            name: string;
                            gender: import("../staff/staff.type").Gender;
                            animalType: string;
                            animalStrain: string | null;
                            birthDate: string | null;
                            weightKg: number | null;
                            microchipNumber: string | null;
                            coat: string | null;
                            photoUrl: string | null;
                            linkedPatientIds: string[];
                        };
                        401: {
                            readonly message: "غير مصرح";
                        } | {
                            readonly message: "انتهت الجلسة";
                        };
                        403: {
                            readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                            readonly code: "ACCOUNT_SUSPENDED";
                        };
                        404: {
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
        };
    };
} & {
    pet: {
        pets: {
            ":id": {
                vaccinations: {
                    get: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                records: {
                                    id: string;
                                    vaccineName: string;
                                    doseNumber: number;
                                    givenAt: string;
                                    nextDueAt: string | null;
                                    batchNumber: string | null;
                                    administeredBy: string | null;
                                }[];
                                due: {
                                    id: string;
                                    vaccineName: string;
                                    doseNumber: number | null;
                                    dueAt: string | null;
                                    ageUnknown: boolean;
                                }[];
                                certificateUrl: string | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            } | {
                                readonly message: "انتهت الجلسة";
                            };
                            403: {
                                readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                                readonly code: "ACCOUNT_SUSPENDED";
                            };
                            404: {
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
            };
        };
    };
} & {
    pet: {
        pets: {
            ":id": {
                weights: {
                    get: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                items: {
                                    recordedAt: string;
                                    weightKg: number;
                                    source: "CLINIC";
                                }[];
                            };
                            401: {
                                readonly message: "غير مصرح";
                            } | {
                                readonly message: "انتهت الجلسة";
                            };
                            403: {
                                readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                                readonly code: "ACCOUNT_SUSPENDED";
                            };
                            404: {
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
            };
        };
    };
} & {
    pet: {
        pets: {
            ":id": {
                timeline: {
                    get: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                items: ({
                                    id: string;
                                    kind: "APPOINTMENT";
                                    title: string;
                                    subtitle: string | null;
                                    occurredAt: string;
                                    clinicName: string;
                                    href: string;
                                } | {
                                    id: string;
                                    kind: "VACCINATION";
                                    title: string;
                                    subtitle: string | null;
                                    occurredAt: string;
                                    clinicName: string;
                                    href: string;
                                } | {
                                    id: string;
                                    kind: "VITALS";
                                    title: string;
                                    subtitle: string | null;
                                    occurredAt: string;
                                    clinicName: string;
                                    href: string;
                                } | {
                                    id: string;
                                    kind: "CARE_PLAN";
                                    title: string;
                                    subtitle: string;
                                    occurredAt: string;
                                    clinicName: string;
                                    href: string;
                                } | {
                                    id: string;
                                    kind: "GROOMING";
                                    title: string;
                                    subtitle: string;
                                    occurredAt: string;
                                    clinicName: string;
                                    href: string;
                                })[];
                            };
                            401: {
                                readonly message: "غير مصرح";
                            } | {
                                readonly message: "انتهت الجلسة";
                            };
                            403: {
                                readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                                readonly code: "ACCOUNT_SUSPENDED";
                            };
                            404: {
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
            };
        };
    };
} & {
    pet: {
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
                            appointment: {
                                id: string;
                                clinicId: string;
                                clinicName: string;
                                branchName: string;
                                petId: string;
                                petName: string;
                                petPhotoUrl: string | null;
                                doctorName: string | null;
                                serviceName: string;
                                startsAt: string;
                                endsAt: string;
                                status: import("../../../generated/prisma/enums").AppointmentStatus;
                                location: import("../../../generated/prisma/enums").AppointmentLocation;
                                canCancel: boolean;
                                canReschedule: boolean;
                                canCheckIn: boolean;
                                trackingAvailable: boolean;
                                callRoom: string | null;
                                invoiceId: string | null;
                            };
                            summary: null;
                            invoice: {
                                id: string;
                                code: string;
                                total: number;
                                amountPaid: number;
                                currencyCode: string;
                                status: import("../invoices/invoices.type").InvoiceStatus;
                            } | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        } | {
                            readonly message: "انتهت الجلسة";
                        };
                        403: {
                            readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                            readonly code: "ACCOUNT_SUSPENDED";
                        };
                        404: {
                            readonly message: "الموعد غير موجود";
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
    pet: {
        invoices: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        items: {
                            id: string;
                            code: string;
                            clinicId: string;
                            clinicName: string;
                            petName: string | null;
                            issuedAt: string;
                            subtotal: number;
                            vatAmount: number;
                            discount: number;
                            total: number;
                            amountPaid: number;
                            currencyCode: string;
                            status: import("../invoices/invoices.type").InvoiceStatus;
                            canPay: boolean;
                        }[];
                    };
                    401: {
                        readonly message: "غير مصرح";
                    } | {
                        readonly message: "انتهت الجلسة";
                    };
                    403: {
                        readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                        readonly code: "ACCOUNT_SUSPENDED";
                    };
                };
            };
        };
    };
} & {
    pet: {
        appointments: {
            ":id": {
                tracking: {
                    get: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                stage: import("../mobile-clinics/mobile-visits/mobile-visits.type").MobileDispatchStage;
                                stageLabel: string;
                                finished: boolean;
                                etaAt: string | null;
                                windowStart: string | null;
                                windowEnd: string | null;
                                arrivedAt: string | null;
                                lat: number | null;
                                lng: number | null;
                                clinicName: string;
                                petName: string;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            } | {
                                readonly message: "انتهت الجلسة";
                            };
                            403: {
                                readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                                readonly code: "ACCOUNT_SUSPENDED";
                            };
                            404: {
                                readonly message: "لا تتبّع لهذه الزيارة";
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
    pet: {
        results: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        items: ({
                            id: string;
                            kind: "LAB";
                            title: string;
                            petId: string;
                            petName: string;
                            clinicName: string;
                            releasedAt: string;
                            summary: string | null;
                            fileUrl: string | null;
                        } | {
                            id: string;
                            kind: "RADIOLOGY";
                            title: string;
                            petId: string;
                            petName: string;
                            clinicName: string;
                            releasedAt: string;
                            summary: string | null;
                            fileUrl: string | null;
                        })[];
                    };
                    401: {
                        readonly message: "غير مصرح";
                    } | {
                        readonly message: "انتهت الجلسة";
                    };
                    403: {
                        readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                        readonly code: "ACCOUNT_SUSPENDED";
                    };
                };
            };
        };
    };
} & {
    pet: {
        threads: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        items: never[];
                    };
                    401: {
                        readonly message: "غير مصرح";
                    } | {
                        readonly message: "انتهت الجلسة";
                    };
                    403: {
                        readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                        readonly code: "ACCOUNT_SUSPENDED";
                    };
                };
            };
        };
    };
} & {
    pet: {
        requests: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        items: {
                            id: string;
                            kind: import("../../../generated/prisma/enums").PetOwnerRequestKind;
                            status: import("../../../generated/prisma/enums").PetOwnerRequestStatus;
                            clinicName: string;
                            petName: string | null;
                            body: string | null;
                            createdAt: string;
                            handledAt: string | null;
                            declineReason: string | null;
                        }[];
                    };
                    401: {
                        readonly message: "غير مصرح";
                    } | {
                        readonly message: "انتهت الجلسة";
                    };
                    403: {
                        readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                        readonly code: "ACCOUNT_SUSPENDED";
                    };
                };
            };
        };
    };
} & {
    pet: {
        notifications: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        items: {
                            readAt: string | null;
                            id: string;
                            category: "APPOINTMENT" | "REMINDER_DUE" | "BILLING";
                            title: string;
                            body: string;
                            createdAt: string;
                            href: string | null;
                        }[];
                    };
                    401: {
                        readonly message: "غير مصرح";
                    } | {
                        readonly message: "انتهت الجلسة";
                    };
                    403: {
                        readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                        readonly code: "ACCOUNT_SUSPENDED";
                    };
                };
            };
        };
    };
} & {
    pet: {
        notifications: {
            read: {
                post: {
                    body: {
                        ids: string[];
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            ok: true;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        } | {
                            readonly message: "انتهت الجلسة";
                        };
                        403: {
                            readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                            readonly code: "ACCOUNT_SUSPENDED";
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
    pet: {
        notifications: {
            preferences: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            items: {
                                category: "APPOINTMENT" | "REMINDER_DUE" | "BILLING" | "RESULTS" | "CHAT" | "MARKETING";
                                push: boolean;
                                email: boolean;
                                sms: boolean;
                                whatsapp: boolean;
                            }[];
                        };
                        401: {
                            readonly message: "غير مصرح";
                        } | {
                            readonly message: "انتهت الجلسة";
                        };
                        403: {
                            readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                            readonly code: "ACCOUNT_SUSPENDED";
                        };
                    };
                };
            };
        };
    };
} & {
    pet: {
        notifications: {
            preferences: {
                patch: {
                    body: {
                        items: {
                            push: boolean;
                            email: boolean;
                            category: string;
                            whatsapp: boolean;
                            sms: boolean;
                        }[];
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            ok: true;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        } | {
                            readonly message: "انتهت الجلسة";
                        };
                        403: {
                            readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                            readonly code: "ACCOUNT_SUSPENDED";
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
    pet: {
        me: {
            patch: {
                body: {
                    name?: string | undefined;
                    email?: string | null | undefined;
                    locale?: string | undefined;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        ok: true;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    } | {
                        readonly message: "انتهت الجلسة";
                    };
                    403: {
                        readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                        readonly code: "ACCOUNT_SUSPENDED";
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
    pet: {
        clinics: {
            ":id": {
                patch: {
                    body: {
                        hidden: boolean;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            items: {
                                linkId: string;
                                clinicId: string;
                                clinicName: string;
                                clinicSlug: string | null;
                                logoUrl: string | null;
                                phone: string | null;
                                city: string | null;
                                source: import("../../../generated/prisma/enums").PetOwnerLinkSource;
                                hidden: boolean;
                                ownerCode: string;
                                petCount: number;
                                directBooking: boolean;
                            }[];
                        };
                        401: {
                            readonly message: "غير مصرح";
                        } | {
                            readonly message: "انتهت الجلسة";
                        };
                        403: {
                            readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                            readonly code: "ACCOUNT_SUSPENDED";
                        };
                        404: {
                            readonly message: "الربط غير موجود";
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
    pet: {
        clinics: {
            claim: {
                post: {
                    body: {
                        code: string;
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            items: {
                                linkId: string;
                                clinicId: string;
                                clinicName: string;
                                clinicSlug: string | null;
                                logoUrl: string | null;
                                phone: string | null;
                                city: string | null;
                                source: import("../../../generated/prisma/enums").PetOwnerLinkSource;
                                hidden: boolean;
                                ownerCode: string;
                                petCount: number;
                                directBooking: boolean;
                            }[];
                        };
                        401: {
                            readonly message: "غير مصرح";
                        } | {
                            readonly message: "انتهت الجلسة";
                        };
                        403: {
                            readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                            readonly code: "ACCOUNT_SUSPENDED";
                        };
                        404: {
                            readonly message: "لم نجد وليّ أمرًا بهذا الرمز";
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
    pet: {
        appointments: {
            ":id": {
                cancel: {
                    post: {
                        body: {
                            reason?: string | undefined;
                        } | null;
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                ok: boolean;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            } | {
                                readonly message: "انتهت الجلسة";
                            };
                            403: {
                                readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                                readonly code: "ACCOUNT_SUSPENDED";
                            };
                            404: {
                                readonly message: "الموعد غير موجود";
                            };
                            409: {
                                readonly message: "الموعد انتهى";
                            } | {
                                readonly message: "لا يمكن الإلغاء قبل الموعد بأقل من ساعتين — اتّصل بالأكاديمية";
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
    pet: {
        appointments: {
            ":id": {
                "check-in": {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                ok: boolean;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            } | {
                                readonly message: "انتهت الجلسة";
                            };
                            403: {
                                readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                                readonly code: "ACCOUNT_SUSPENDED";
                            };
                            404: {
                                readonly message: "الموعد غير موجود";
                            };
                            409: {
                                readonly message: "تسجيل الوصول متاح قبل الموعد بنصف ساعة وبعده بنصف ساعة";
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
    pet: {
        devices: {
            post: {
                body: {
                    appVersion?: string | null | undefined;
                    expoPushToken?: string | undefined;
                    osVersion?: string | null | undefined;
                    platform: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        ok: true;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    } | {
                        readonly message: "انتهت الجلسة";
                    };
                    403: {
                        readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                        readonly code: "ACCOUNT_SUSPENDED";
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
    pet: {
        auth: {
            sessions: {
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
                                ok: boolean;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            } | {
                                readonly message: "انتهت الجلسة";
                            };
                            403: {
                                readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                                readonly code: "ACCOUNT_SUSPENDED";
                            };
                            404: {
                                readonly message: "الجلسة غير موجودة";
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
    pet: {
        auth: {
            "sign-out-all": {
                post: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            ok: true;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        } | {
                            readonly message: "انتهت الجلسة";
                        };
                        403: {
                            readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                            readonly code: "ACCOUNT_SUSPENDED";
                        };
                    };
                };
            };
        };
    };
} & {
    pet: {
        invoices: {
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
                            invoice: {
                                id: string;
                                code: string;
                                clinicId: string;
                                clinicName: string;
                                petName: string | null;
                                issuedAt: string;
                                subtotal: number;
                                vatAmount: number;
                                discount: number;
                                total: number;
                                amountPaid: number;
                                currencyCode: string;
                                status: import("../invoices/invoices.type").InvoiceStatus;
                                canPay: boolean;
                            };
                            lines: {
                                name: string;
                                quantity: number;
                                price: number;
                            }[];
                        };
                        401: {
                            readonly message: "غير مصرح";
                        } | {
                            readonly message: "انتهت الجلسة";
                        };
                        403: {
                            readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                            readonly code: "ACCOUNT_SUSPENDED";
                        };
                        404: {
                            readonly message: "الفاتورة غير موجودة";
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
    pet: {
        me: {
            delete: {
                post: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            ok: true;
                            deletionAt: string;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        } | {
                            readonly message: "انتهت الجلسة";
                        };
                        403: {
                            readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                            readonly code: "ACCOUNT_SUSPENDED";
                        };
                    };
                };
            };
        };
    };
} & {
    pet: {
        requests: {
            post: {
                body: {
                    body?: string | undefined;
                    petId?: string | undefined;
                    clinicId: string;
                    kind: "REFILL" | "RECORDS" | "CERTIFICATE" | "CALLBACK" | "QUESTION" | "CANCEL_APPOINTMENT";
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        id: string;
                        kind: import("../../../generated/prisma/enums").PetOwnerRequestKind;
                        status: import("../../../generated/prisma/enums").PetOwnerRequestStatus;
                        clinicName: string;
                        petName: string | null;
                        body: string | null;
                        createdAt: string;
                        handledAt: string | null;
                        declineReason: string | null;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    } | {
                        readonly message: "انتهت الجلسة";
                    };
                    403: {
                        readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                        readonly code: "ACCOUNT_SUSPENDED";
                    } | {
                        readonly message: "لا سجلّ لك لدى هذه الأكاديمية";
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
    pet: {
        me: {
            export: {
                post: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            generatedAt: string;
                            account: {
                                id: string;
                                phoneE164: string;
                                name: string | null;
                                email: string | null;
                                locale: string;
                                avatarUrl: string | null;
                                marketingOptIn: boolean;
                                consentVersion: string | null;
                                deletionScheduledAt: string | null;
                                mustChangePassword: boolean;
                            } | null;
                            clinics: {
                                linkId: string;
                                clinicId: string;
                                clinicName: string;
                                clinicSlug: string | null;
                                logoUrl: string | null;
                                phone: string | null;
                                city: string | null;
                                source: import("../../../generated/prisma/enums").PetOwnerLinkSource;
                                hidden: boolean;
                                ownerCode: string;
                                petCount: number;
                                directBooking: boolean;
                            }[];
                            pets: {
                                id: string;
                                clinicId: string;
                                clinicName: string;
                                code: string;
                                name: string;
                                gender: import("../staff/staff.type").Gender;
                                animalType: string;
                                animalStrain: string | null;
                                birthDate: string | null;
                                weightKg: number | null;
                                microchipNumber: string | null;
                                coat: string | null;
                                photoUrl: string | null;
                                linkedPatientIds: string[];
                            }[];
                            appointments: {
                                id: string;
                                clinicId: string;
                                clinicName: string;
                                branchName: string;
                                petId: string;
                                petName: string;
                                petPhotoUrl: string | null;
                                doctorName: string | null;
                                serviceName: string;
                                startsAt: string;
                                endsAt: string;
                                status: import("../../../generated/prisma/enums").AppointmentStatus;
                                location: import("../../../generated/prisma/enums").AppointmentLocation;
                                canCancel: boolean;
                                canReschedule: boolean;
                                canCheckIn: boolean;
                                trackingAvailable: boolean;
                                callRoom: string | null;
                                invoiceId: string | null;
                            }[];
                            invoices: {
                                id: string;
                                code: string;
                                clinicId: string;
                                clinicName: string;
                                petName: string | null;
                                issuedAt: string;
                                subtotal: number;
                                vatAmount: number;
                                discount: number;
                                total: number;
                                amountPaid: number;
                                currencyCode: string;
                                status: import("../invoices/invoices.type").InvoiceStatus;
                                canPay: boolean;
                            }[];
                            timelines: {
                                petId: string;
                                petName: string;
                                entries: ({
                                    id: string;
                                    kind: "APPOINTMENT";
                                    title: string;
                                    subtitle: string | null;
                                    occurredAt: string;
                                    clinicName: string;
                                    href: string;
                                } | {
                                    id: string;
                                    kind: "VACCINATION";
                                    title: string;
                                    subtitle: string | null;
                                    occurredAt: string;
                                    clinicName: string;
                                    href: string;
                                } | {
                                    id: string;
                                    kind: "VITALS";
                                    title: string;
                                    subtitle: string | null;
                                    occurredAt: string;
                                    clinicName: string;
                                    href: string;
                                } | {
                                    id: string;
                                    kind: "CARE_PLAN";
                                    title: string;
                                    subtitle: string;
                                    occurredAt: string;
                                    clinicName: string;
                                    href: string;
                                } | {
                                    id: string;
                                    kind: "GROOMING";
                                    title: string;
                                    subtitle: string;
                                    occurredAt: string;
                                    clinicName: string;
                                    href: string;
                                })[];
                            }[];
                        };
                        401: {
                            readonly message: "غير مصرح";
                        } | {
                            readonly message: "انتهت الجلسة";
                        };
                        403: {
                            readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                            readonly code: "ACCOUNT_SUSPENDED";
                        };
                    };
                };
            };
        };
    };
} & {
    pet: {
        invoices: {
            ":id": {
                pay: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            401: {
                                readonly message: "غير مصرح";
                            } | {
                                readonly message: "انتهت الجلسة";
                            };
                            403: {
                                readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                                readonly code: "ACCOUNT_SUSPENDED";
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
                            503: {
                                readonly message: "الدفع من التطبيق غير مفعّل بعد — الدفع في الأكاديمية أو عبر التحويل.";
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    pet: {
        payments: {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        401: {
                            readonly message: "غير مصرح";
                        } | {
                            readonly message: "انتهت الجلسة";
                        };
                        403: {
                            readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                            readonly code: "ACCOUNT_SUSPENDED";
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
                        503: {
                            readonly message: "الدفع من التطبيق غير مفعّل بعد.";
                        };
                    };
                };
            };
        };
    };
} & {
    pet: {
        pets: {
            link: {
                post: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        401: {
                            readonly message: "غير مصرح";
                        } | {
                            readonly message: "انتهت الجلسة";
                        };
                        403: {
                            readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                            readonly code: "ACCOUNT_SUSPENDED";
                        };
                        503: {
                            readonly message: "ربط سجلّات الطفل بين الأكاديميات غير متاح بعد.";
                        };
                    };
                };
            };
        };
    };
} & {
    pet: {
        threads: {
            ":id": {
                messages: {
                    get: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                items: never[];
                            };
                            401: {
                                readonly message: "غير مصرح";
                            } | {
                                readonly message: "انتهت الجلسة";
                            };
                            403: {
                                readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                                readonly code: "ACCOUNT_SUSPENDED";
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
    pet: {
        threads: {
            ":id": {
                messages: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            401: {
                                readonly message: "غير مصرح";
                            } | {
                                readonly message: "انتهت الجلسة";
                            };
                            403: {
                                readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                                readonly code: "ACCOUNT_SUSPENDED";
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
                            503: {
                                readonly message: "المحادثة مع الأكاديمية غير مفعّلة بعد — اتّصل بالأكاديمية مباشرة.";
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    pet: {
        auth: {
            sessions: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            items: {
                                id: string;
                                platform: "IOS" | "ANDROID" | "WEB";
                                appVersion: null;
                                osVersion: null;
                                lastSeenAt: string;
                                current: boolean;
                            }[];
                        };
                        401: {
                            readonly message: "غير مصرح";
                        } | {
                            readonly message: "انتهت الجلسة";
                        };
                        403: {
                            readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                            readonly code: "ACCOUNT_SUSPENDED";
                        };
                    };
                };
            };
        };
    };
} & {
    pet: {
        clinics: {
            ":id": {
                options: {
                    get: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                services: {
                                    id: string;
                                    name: string;
                                    durationMinutes: number;
                                    price: number | null;
                                    currencyCode: string;
                                }[];
                                doctors: {
                                    id: string;
                                    name: string;
                                    specialization: string | null;
                                    avatarUrl: string | null;
                                }[];
                                directBooking: boolean;
                                depositAmount: number | null;
                                currencyCode: string;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            } | {
                                readonly message: "انتهت الجلسة";
                            };
                            403: {
                                readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                                readonly code: "ACCOUNT_SUSPENDED";
                            };
                            404: {
                                readonly message: "الأكاديمية غير متاحة للحجز";
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
    pet: {
        booking: {
            slots: {
                get: {
                    body: {};
                    params: {};
                    query: {
                        doctorId?: string | undefined;
                        date: string;
                        clinicId: string;
                        serviceId: string;
                    };
                    headers: {};
                    response: {
                        200: {
                            date: string;
                            slots: {
                                startsAt: string;
                                startMinute: number;
                                doctorId: string;
                                doctorName: string;
                            }[];
                        };
                        401: {
                            readonly message: "غير مصرح";
                        } | {
                            readonly message: "انتهت الجلسة";
                        };
                        403: {
                            readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                            readonly code: "ACCOUNT_SUSPENDED";
                        };
                        404: {
                            readonly message: "الدورة أو الأكاديمية غير متاحة";
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
    pet: {
        booking: {
            post: {
                body: {
                    reason?: string | undefined;
                    clinicId: string;
                    serviceId: string;
                    startsAt: string;
                    petId: string;
                    doctorId: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        outcome: "BOOKED";
                        appointmentId: string;
                        requestId: null;
                        startsAt: string;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    } | {
                        readonly message: "انتهت الجلسة";
                    };
                    403: {
                        readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                        readonly code: "ACCOUNT_SUSPENDED";
                    };
                    409: {
                        readonly message: "لم يعد هذا الموعد متاحًا — اختر موعدًا آخر";
                    };
                    422: {
                        readonly message: "تعذّر إتمام الحجز — راجع اختياراتك";
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
    pet: {
        records: {
            ":kind": {
                ":id": {
                    get: {
                        body: {};
                        params: {
                            id: string;
                            kind: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("./pet-record.service").RecordDetail;
                            401: {
                                readonly message: "غير مصرح";
                            } | {
                                readonly message: "انتهت الجلسة";
                            };
                            403: {
                                readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                                readonly code: "ACCOUNT_SUSPENDED";
                            };
                            404: {
                                readonly message: "نوع السجلّ غير معروف";
                            } | {
                                readonly message: "السجلّ غير موجود";
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
    pet: {
        "mobile-visits": {
            request: {
                post: {
                    body: {
                        notes?: string | undefined;
                        district?: string | undefined;
                        landmark?: string | undefined;
                        serviceIds?: string[] | undefined;
                        preferredWindow?: "MORNING" | "EVENING" | "ANY" | "AFTERNOON" | undefined;
                        petId?: string | undefined;
                        clinicId: string;
                        addressLine: string;
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            code: string;
                            requestId: string;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        } | {
                            readonly message: "انتهت الجلسة";
                        };
                        403: {
                            readonly message: "الحساب موقوف. تواصل مع أكاديميتك.";
                            readonly code: "ACCOUNT_SUSPENDED";
                        } | {
                            readonly message: "لا سجلّ لك لدى هذه الأكاديمية";
                        };
                        409: {
                            readonly message: "هذه الأكاديمية لا تستقبل زيارات منزلية حاليًا";
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
