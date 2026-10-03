import Elysia from "elysia";
export declare const staffController: Elysia<"/staff", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "staff.create": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            email: import("@sinclair/typebox").TString;
            phone: import("@sinclair/typebox").TString;
            roleId: import("@sinclair/typebox").TString;
            branchId: import("@sinclair/typebox").TString;
            licenseNumber: import("@sinclair/typebox").TString;
            employmentType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"FULL_TIME">, import("@sinclair/typebox").TLiteral<"PART_TIME">]>>;
            gender: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MALE">, import("@sinclair/typebox").TLiteral<"FEMALE">, import("@sinclair/typebox").TLiteral<"UNKNOWN">]>>;
            prefix: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MR">, import("@sinclair/typebox").TLiteral<"MRS">, import("@sinclair/typebox").TLiteral<"MS">, import("@sinclair/typebox").TLiteral<"DR">, import("@sinclair/typebox").TLiteral<"PROF">]>>;
            age: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            primarySpecializationId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            secondarySpecializationId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            country: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            city: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            address: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "staff.update": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            roleId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            branchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            licenseNumber: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            employmentType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"FULL_TIME">, import("@sinclair/typebox").TLiteral<"PART_TIME">]>]>>;
            hireDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            gender: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MALE">, import("@sinclair/typebox").TLiteral<"FEMALE">, import("@sinclair/typebox").TLiteral<"UNKNOWN">]>]>>;
            prefix: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MR">, import("@sinclair/typebox").TLiteral<"MRS">, import("@sinclair/typebox").TLiteral<"MS">, import("@sinclair/typebox").TLiteral<"DR">, import("@sinclair/typebox").TLiteral<"PROF">]>]>>;
            age: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            phone: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            primarySpecializationId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            secondarySpecializationId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            country: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            city: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            address: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            bio: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            educationalQualification: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            nationality: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PENDING">, import("@sinclair/typebox").TLiteral<"ACTIVE">, import("@sinclair/typebox").TLiteral<"INACTIVE">]>>;
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
    staff: {};
} & {
    staff: {
        get: {
            body: {};
            params: {};
            query: {};
            headers: {};
            response: {
                200: {
                    clinic: {
                        name: string;
                        id: string;
                    };
                    branch: {
                        name: string;
                        id: string;
                    };
                    user: {
                        name: string;
                        id: string;
                        email: string;
                        sessions: {
                            createdAt: Date;
                        }[];
                    } | null;
                    name: string;
                    address: string | null;
                    prefix: import("./staff.type").StaffPrefix | null;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    phone: string | null;
                    licenseNumber: string | null;
                    city: string | null;
                    code: string;
                    invites: {
                        id: string;
                        expiresAt: Date;
                        accepted: boolean;
                    }[];
                    schedulingSettings: {
                        shift: import("../staff-scheduling/staff-scheduling.type").StaffShift | null;
                        morningStartMinute: number | null;
                        morningEndMinute: number | null;
                        eveningStartMinute: number | null;
                        eveningEndMinute: number | null;
                    } | null;
                    gender: import("./staff.type").Gender | null;
                    age: number | null;
                    country: string | null;
                    notes: string | null;
                    bio: string | null;
                    educationalQualification: string | null;
                    nationality: string | null;
                    avatar: string | null;
                    employmentType: import("./staff.type").EmploymentType | null;
                    hireDate: Date | null;
                    status: import("./staff.type").StaffStatus;
                    active: boolean;
                    role: {
                        name: string;
                        id: string;
                    };
                    primarySpecialization: {
                        level: import("../../../generated/prisma/enums").SpecializationLevel;
                        name: string;
                        id: string;
                    } | null;
                    secondarySpecialization: {
                        level: import("../../../generated/prisma/enums").SpecializationLevel;
                        name: string;
                        id: string;
                    } | null;
                }[];
                401: {
                    readonly message: "غير مصرح";
                };
            };
        };
    };
} & {
    staff: {
        post: {
            body: {
                address?: string | null | undefined;
                prefix?: "MR" | "MRS" | "MS" | "DR" | "PROF" | undefined;
                city?: string | null | undefined;
                gender?: "MALE" | "FEMALE" | "UNKNOWN" | undefined;
                age?: number | null | undefined;
                country?: string | null | undefined;
                notes?: string | null | undefined;
                primarySpecializationId?: string | null | undefined;
                secondarySpecializationId?: string | null | undefined;
                employmentType?: "FULL_TIME" | "PART_TIME" | undefined;
                name: string;
                email: string;
                phone: string;
                licenseNumber: string;
                roleId: string;
                branchId: string;
            };
            params: {};
            query: {};
            headers: {};
            response: {
                201: {
                    clinic: {
                        name: string;
                        id: string;
                    };
                    branch: {
                        name: string;
                        id: string;
                    };
                    user: {
                        name: string;
                        id: string;
                        email: string;
                        sessions: {
                            createdAt: Date;
                        }[];
                    } | null;
                    name: string;
                    address: string | null;
                    prefix: import("./staff.type").StaffPrefix | null;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    phone: string | null;
                    licenseNumber: string | null;
                    city: string | null;
                    code: string;
                    invites: {
                        id: string;
                        expiresAt: Date;
                        accepted: boolean;
                    }[];
                    schedulingSettings: {
                        shift: import("../staff-scheduling/staff-scheduling.type").StaffShift | null;
                        morningStartMinute: number | null;
                        morningEndMinute: number | null;
                        eveningStartMinute: number | null;
                        eveningEndMinute: number | null;
                    } | null;
                    gender: import("./staff.type").Gender | null;
                    age: number | null;
                    country: string | null;
                    notes: string | null;
                    bio: string | null;
                    educationalQualification: string | null;
                    nationality: string | null;
                    avatar: string | null;
                    employmentType: import("./staff.type").EmploymentType | null;
                    hireDate: Date | null;
                    status: import("./staff.type").StaffStatus;
                    active: boolean;
                    role: {
                        name: string;
                        id: string;
                    };
                    primarySpecialization: {
                        level: import("../../../generated/prisma/enums").SpecializationLevel;
                        name: string;
                        id: string;
                    } | null;
                    secondarySpecialization: {
                        level: import("../../../generated/prisma/enums").SpecializationLevel;
                        name: string;
                        id: string;
                    } | null;
                };
                401: {
                    readonly message: "غير مصرح";
                };
                409: {
                    readonly message: "هذا البريد الإلكتروني لديه حساب بالفعل";
                } | {
                    readonly message: "هذا البريد الإلكتروني مسجل لموظف آخر في الأكاديمية";
                } | {
                    readonly message: "تم إرسال دعوة إلى هذا البريد الإلكتروني بالفعل";
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
    staff: {
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
                        clinic: {
                            name: string;
                            id: string;
                        };
                        branch: {
                            name: string;
                            id: string;
                        };
                        user: {
                            name: string;
                            id: string;
                            email: string;
                            sessions: {
                                createdAt: Date;
                            }[];
                        } | null;
                        name: string;
                        address: string | null;
                        prefix: import("./staff.type").StaffPrefix | null;
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        phone: string | null;
                        licenseNumber: string | null;
                        city: string | null;
                        code: string;
                        invites: {
                            id: string;
                            expiresAt: Date;
                            accepted: boolean;
                        }[];
                        schedulingSettings: {
                            shift: import("../staff-scheduling/staff-scheduling.type").StaffShift | null;
                            morningStartMinute: number | null;
                            morningEndMinute: number | null;
                            eveningStartMinute: number | null;
                            eveningEndMinute: number | null;
                        } | null;
                        gender: import("./staff.type").Gender | null;
                        age: number | null;
                        country: string | null;
                        notes: string | null;
                        bio: string | null;
                        educationalQualification: string | null;
                        nationality: string | null;
                        avatar: string | null;
                        employmentType: import("./staff.type").EmploymentType | null;
                        hireDate: Date | null;
                        status: import("./staff.type").StaffStatus;
                        active: boolean;
                        role: {
                            name: string;
                            id: string;
                        };
                        primarySpecialization: {
                            level: import("../../../generated/prisma/enums").SpecializationLevel;
                            name: string;
                            id: string;
                        } | null;
                        secondarySpecialization: {
                            level: import("../../../generated/prisma/enums").SpecializationLevel;
                            name: string;
                            id: string;
                        } | null;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    404: {
                        readonly message: "الموظف غير موجود";
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
    staff: {
        ":id": {
            patch: {
                body: {
                    name?: string | undefined;
                    address?: string | null | undefined;
                    prefix?: "MR" | "MRS" | "MS" | "DR" | "PROF" | null | undefined;
                    phone?: string | null | undefined;
                    licenseNumber?: string | null | undefined;
                    city?: string | null | undefined;
                    roleId?: string | undefined;
                    branchId?: string | undefined;
                    gender?: "MALE" | "FEMALE" | "UNKNOWN" | null | undefined;
                    age?: number | null | undefined;
                    country?: string | null | undefined;
                    notes?: string | null | undefined;
                    bio?: string | null | undefined;
                    educationalQualification?: string | null | undefined;
                    nationality?: string | null | undefined;
                    primarySpecializationId?: string | null | undefined;
                    secondarySpecializationId?: string | null | undefined;
                    employmentType?: "FULL_TIME" | "PART_TIME" | null | undefined;
                    hireDate?: string | null | undefined;
                    status?: "PENDING" | "ACTIVE" | "INACTIVE" | undefined;
                    active?: boolean | undefined;
                };
                params: {
                    id: string;
                };
                query: {};
                headers: {};
                response: {
                    200: {
                        clinic: {
                            name: string;
                            id: string;
                        };
                        branch: {
                            name: string;
                            id: string;
                        };
                        user: {
                            name: string;
                            id: string;
                            email: string;
                            sessions: {
                                createdAt: Date;
                            }[];
                        } | null;
                        name: string;
                        address: string | null;
                        prefix: import("./staff.type").StaffPrefix | null;
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        phone: string | null;
                        licenseNumber: string | null;
                        city: string | null;
                        code: string;
                        invites: {
                            id: string;
                            expiresAt: Date;
                            accepted: boolean;
                        }[];
                        schedulingSettings: {
                            shift: import("../staff-scheduling/staff-scheduling.type").StaffShift | null;
                            morningStartMinute: number | null;
                            morningEndMinute: number | null;
                            eveningStartMinute: number | null;
                            eveningEndMinute: number | null;
                        } | null;
                        gender: import("./staff.type").Gender | null;
                        age: number | null;
                        country: string | null;
                        notes: string | null;
                        bio: string | null;
                        educationalQualification: string | null;
                        nationality: string | null;
                        avatar: string | null;
                        employmentType: import("./staff.type").EmploymentType | null;
                        hireDate: Date | null;
                        status: import("./staff.type").StaffStatus;
                        active: boolean;
                        role: {
                            name: string;
                            id: string;
                        };
                        primarySpecialization: {
                            level: import("../../../generated/prisma/enums").SpecializationLevel;
                            name: string;
                            id: string;
                        } | null;
                        secondarySpecialization: {
                            level: import("../../../generated/prisma/enums").SpecializationLevel;
                            name: string;
                            id: string;
                        } | null;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    404: {
                        readonly message: "الموظف غير موجود";
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
    staff: {
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
                        deleted: boolean;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    404: {
                        readonly message: "الموظف غير موجود";
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
    staff: {
        ":id": {
            invite: {
                ensure: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                token: string;
                                expiresAt: Date;
                                link: string;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: "ليس لديك صلاحية لتنفيذ هذا الإجراء";
                            };
                            404: {
                                readonly message: "الموظف غير موجود";
                            };
                            409: {
                                readonly message: "هذا الموظف قد فعّل حسابه بالفعل";
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
