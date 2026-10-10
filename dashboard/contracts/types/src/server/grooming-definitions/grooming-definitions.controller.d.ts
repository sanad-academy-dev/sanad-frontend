import Elysia from "elysia";
/**
 * كتالوج التجميل: التعريفات ومصفوفة التسعير والرسوم وسعة الفروع.
 *
 * الكتابة على الكتالوج تتطلب `grooming.edit` لا `grooming.create` — الإنشاء يخصّ
 * الجلسات، والكتالوج إعداد أكاديمية يعدّله مسؤول. الحارس في المسار يخفي الشاشة
 * فقط؛ هذه الفحوص هي ما يؤمّنها فعلًا.
 */
export declare const groomingDefinitionsController: Elysia<"/grooming-definitions", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "groomingDefinitions.upsertDefinition": import("@sinclair/typebox").TObject<{
            kind: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"BATH">, import("@sinclair/typebox").TLiteral<"FULL_GROOM">, import("@sinclair/typebox").TLiteral<"TIDY_UP">, import("@sinclair/typebox").TLiteral<"DESHED">, import("@sinclair/typebox").TLiteral<"NAIL_TRIM">, import("@sinclair/typebox").TLiteral<"EAR_CLEAN">, import("@sinclair/typebox").TLiteral<"ANAL_GLANDS">, import("@sinclair/typebox").TLiteral<"TEETH_BRUSH">, import("@sinclair/typebox").TLiteral<"DEMATTING">, import("@sinclair/typebox").TLiteral<"SHAVE_DOWN">, import("@sinclair/typebox").TLiteral<"MEDICATED_BATH">, import("@sinclair/typebox").TLiteral<"PARASITE_DIP">, import("@sinclair/typebox").TLiteral<"WOUND_CARE_CLIP">, import("@sinclair/typebox").TLiteral<"SPA_ADDON">, import("@sinclair/typebox").TLiteral<"OTHER">]>;
            lane: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"COSMETIC">, import("@sinclair/typebox").TLiteral<"MEDICAL">]>>;
            requiresVetOrder: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            isAddOn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            basePrice: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            baseDurationMin: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            dryingMinutes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            speciesScope: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            requiresStation: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "groomingDefinitions.replacePriceRules": import("@sinclair/typebox").TObject<{
            rules: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                animalTypeId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                animalStrainId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                sizeBand: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"TOY">, import("@sinclair/typebox").TLiteral<"SMALL">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"LARGE">, import("@sinclair/typebox").TLiteral<"GIANT">]>]>>;
                coatType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LONG_THICK">, import("@sinclair/typebox").TLiteral<"SHORT_THICK">, import("@sinclair/typebox").TLiteral<"LIGHT">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"DOUBLE_COAT">, import("@sinclair/typebox").TLiteral<"NONE">]>]>>;
                price: import("@sinclair/typebox").TNumber;
                durationMin: import("@sinclair/typebox").TInteger;
                dryingMinutes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            }>>;
        }>;
        readonly "groomingDefinitions.upsertModifier": import("@sinclair/typebox").TObject<{
            code: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MATTING">, import("@sinclair/typebox").TLiteral<"SHAVE_DOWN">, import("@sinclair/typebox").TLiteral<"BEHAVIOR">, import("@sinclair/typebox").TLiteral<"SENIOR">, import("@sinclair/typebox").TLiteral<"FLEA">, import("@sinclair/typebox").TLiteral<"SECOND_PET">, import("@sinclair/typebox").TLiteral<"EXPRESS">, import("@sinclair/typebox").TLiteral<"OUT_OF_HOURS">]>;
            labelAr: import("@sinclair/typebox").TString;
            calc: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PERCENT">, import("@sinclair/typebox").TLiteral<"FIXED">, import("@sinclair/typebox").TLiteral<"PER_MINUTE">]>;
            value: import("@sinclair/typebox").TNumber;
            autoAppliesFrom: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            requiresOwnerApproval: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "groomingDefinitions.upsertCapacity": import("@sinclair/typebox").TObject<{
            stations: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            dryerSlots: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            maxPetsPerDay: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            maxHeatSensitiveConcurrent: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            dropOffWindowMin: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            requireDepositPercent: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            seniorAgeYears: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            quoteReapprovalPercent: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        readonly "groomingDefinitions.quotePreview": import("@sinclair/typebox").TObject<{
            definitionIds: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
            pet: import("@sinclair/typebox").TObject<{
                animalTypeId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                animalStrainId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                sizeBand: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"TOY">, import("@sinclair/typebox").TLiteral<"SMALL">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"LARGE">, import("@sinclair/typebox").TLiteral<"GIANT">]>]>>;
                coatType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LONG_THICK">, import("@sinclair/typebox").TLiteral<"SHORT_THICK">, import("@sinclair/typebox").TLiteral<"LIGHT">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"DOUBLE_COAT">, import("@sinclair/typebox").TLiteral<"NONE">]>]>>;
                weightKg: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            }>;
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
                readonly message: "لا تملك صلاحية عرض التجميل";
            }, 403> | {
                clinicId: string;
                isAdmin: boolean;
                permissions: string[];
            }>;
        };
    };
    parser: {};
    response: {};
}, {
    "grooming-definitions": {};
} & {
    "grooming-definitions": {
        templates: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: import("./grooming-definitions.type").GroomingTemplateResponse[];
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض التجميل";
                    };
                };
            };
        };
    };
} & {
    "grooming-definitions": {
        service: {
            ":serviceId": {
                get: {
                    body: {};
                    params: {
                        serviceId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            active: boolean;
                            serviceId: string;
                            kind: import("../../../generated/prisma/enums").GroomingServiceKind;
                            dryingMinutes: number;
                            lane: import("../../../generated/prisma/enums").GroomingLane;
                            requiresVetOrder: boolean;
                            isAddOn: boolean;
                            basePrice: import("@prisma/client-runtime-utils").Decimal;
                            baseDurationMin: number;
                            speciesScope: string[];
                            requiresStation: boolean;
                            priceRules: {
                                id: string;
                                createdAt: Date;
                                animalTypeId: string | null;
                                animalStrainId: string | null;
                                price: import("@prisma/client-runtime-utils").Decimal;
                                definitionId: string;
                                sizeBand: import("../../../generated/prisma/enums").GroomingSizeBand | null;
                                coatType: import("../animal-strains/animal-strains.type").HairType | null;
                                durationMin: number;
                                dryingMinutes: number | null;
                            }[];
                        } | null;
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض التجميل";
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
    "grooming-definitions": {
        service: {
            ":serviceId": {
                put: {
                    body: {
                        active?: boolean | undefined;
                        dryingMinutes?: number | undefined;
                        lane?: "MEDICAL" | "COSMETIC" | undefined;
                        requiresVetOrder?: boolean | undefined;
                        isAddOn?: boolean | undefined;
                        basePrice?: number | undefined;
                        baseDurationMin?: number | undefined;
                        speciesScope?: string[] | undefined;
                        requiresStation?: boolean | undefined;
                        kind: "OTHER" | "BATH" | "FULL_GROOM" | "TIDY_UP" | "DESHED" | "NAIL_TRIM" | "EAR_CLEAN" | "ANAL_GLANDS" | "TEETH_BRUSH" | "DEMATTING" | "SHAVE_DOWN" | "MEDICATED_BATH" | "PARASITE_DIP" | "WOUND_CARE_CLIP" | "SPA_ADDON";
                    };
                    params: {
                        serviceId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            active: boolean;
                            serviceId: string;
                            kind: import("../../../generated/prisma/enums").GroomingServiceKind;
                            dryingMinutes: number;
                            lane: import("../../../generated/prisma/enums").GroomingLane;
                            requiresVetOrder: boolean;
                            isAddOn: boolean;
                            basePrice: import("@prisma/client-runtime-utils").Decimal;
                            baseDurationMin: number;
                            speciesScope: string[];
                            requiresStation: boolean;
                            priceRules: {
                                id: string;
                                createdAt: Date;
                                animalTypeId: string | null;
                                animalStrainId: string | null;
                                price: import("@prisma/client-runtime-utils").Decimal;
                                definitionId: string;
                                sizeBand: import("../../../generated/prisma/enums").GroomingSizeBand | null;
                                coatType: import("../animal-strains/animal-strains.type").HairType | null;
                                durationMin: number;
                                dryingMinutes: number | null;
                            }[];
                        };
                        400: {
                            readonly message: "هذه الدورة ليست ضمن فئة التجميل";
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض التجميل";
                        } | {
                            readonly message: "لا تملك صلاحية تعديل كتالوج التجميل";
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
    "grooming-definitions": {
        ":definitionId": {
            "price-rules": {
                get: {
                    body: {};
                    params: {
                        definitionId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            createdAt: Date;
                            animalTypeId: string | null;
                            animalStrainId: string | null;
                            price: import("@prisma/client-runtime-utils").Decimal;
                            definitionId: string;
                            sizeBand: import("../../../generated/prisma/enums").GroomingSizeBand | null;
                            coatType: import("../animal-strains/animal-strains.type").HairType | null;
                            durationMin: number;
                            dryingMinutes: number | null;
                        }[];
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض التجميل";
                        };
                        404: {
                            readonly message: "تعريف دورة التجميل غير موجود";
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
    "grooming-definitions": {
        ":definitionId": {
            "price-rules": {
                put: {
                    body: {
                        rules: {
                            animalTypeId?: string | null | undefined;
                            animalStrainId?: string | null | undefined;
                            sizeBand?: "MEDIUM" | "SMALL" | "LARGE" | "TOY" | "GIANT" | null | undefined;
                            coatType?: "NONE" | "LONG_THICK" | "SHORT_THICK" | "LIGHT" | "MEDIUM" | "DOUBLE_COAT" | null | undefined;
                            dryingMinutes?: number | null | undefined;
                            price: number;
                            durationMin: number;
                        }[];
                    };
                    params: {
                        definitionId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            createdAt: Date;
                            animalTypeId: string | null;
                            animalStrainId: string | null;
                            price: import("@prisma/client-runtime-utils").Decimal;
                            definitionId: string;
                            sizeBand: import("../../../generated/prisma/enums").GroomingSizeBand | null;
                            coatType: import("../animal-strains/animal-strains.type").HairType | null;
                            durationMin: number;
                            dryingMinutes: number | null;
                        }[];
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض التجميل";
                        } | {
                            readonly message: "لا تملك صلاحية تعديل أسعار التجميل";
                        };
                        404: {
                            readonly message: "تعريف دورة التجميل غير موجود";
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
    "grooming-definitions": {
        modifiers: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        value: import("@prisma/client-runtime-utils").Decimal;
                        id: string;
                        code: import("../../../generated/prisma/enums").GroomingModifierCode;
                        active: boolean;
                        labelAr: string;
                        calc: import("../../../generated/prisma/enums").GroomingModifierCalc;
                        autoAppliesFrom: number | null;
                        requiresOwnerApproval: boolean;
                    }[];
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض التجميل";
                    };
                };
            };
        };
    };
} & {
    "grooming-definitions": {
        modifiers: {
            put: {
                body: {
                    active?: boolean | undefined;
                    autoAppliesFrom?: number | null | undefined;
                    requiresOwnerApproval?: boolean | undefined;
                    value: number;
                    code: "SHAVE_DOWN" | "MATTING" | "BEHAVIOR" | "SENIOR" | "FLEA" | "SECOND_PET" | "EXPRESS" | "OUT_OF_HOURS";
                    labelAr: string;
                    calc: "PERCENT" | "FIXED" | "PER_MINUTE";
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        value: import("@prisma/client-runtime-utils").Decimal;
                        id: string;
                        code: import("../../../generated/prisma/enums").GroomingModifierCode;
                        active: boolean;
                        labelAr: string;
                        calc: import("../../../generated/prisma/enums").GroomingModifierCalc;
                        autoAppliesFrom: number | null;
                        requiresOwnerApproval: boolean;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض التجميل";
                    } | {
                        readonly message: "لا تملك صلاحية تعديل رسوم التجميل";
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
    "grooming-definitions": {
        capacity: {
            ":branchId": {
                get: {
                    body: {};
                    params: {
                        branchId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            branchId: string;
                            stations: number;
                            dryerSlots: number;
                            maxPetsPerDay: number | null;
                            maxHeatSensitiveConcurrent: number;
                            dropOffWindowMin: number;
                            requireDepositPercent: import("@prisma/client-runtime-utils").Decimal | null;
                            seniorAgeYears: number;
                            quoteReapprovalPercent: import("@prisma/client-runtime-utils").Decimal;
                        } | null;
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض التجميل";
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
    "grooming-definitions": {
        capacity: {
            ":branchId": {
                put: {
                    body: {
                        stations?: number | undefined;
                        dryerSlots?: number | undefined;
                        maxPetsPerDay?: number | null | undefined;
                        maxHeatSensitiveConcurrent?: number | undefined;
                        dropOffWindowMin?: number | undefined;
                        requireDepositPercent?: number | null | undefined;
                        seniorAgeYears?: number | undefined;
                        quoteReapprovalPercent?: number | undefined;
                    };
                    params: {
                        branchId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            branchId: string;
                            stations: number;
                            dryerSlots: number;
                            maxPetsPerDay: number | null;
                            maxHeatSensitiveConcurrent: number;
                            dropOffWindowMin: number;
                            requireDepositPercent: import("@prisma/client-runtime-utils").Decimal | null;
                            seniorAgeYears: number;
                            quoteReapprovalPercent: import("@prisma/client-runtime-utils").Decimal;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض التجميل";
                        } | {
                            readonly message: "لا تملك صلاحية تعديل إعدادات التجميل";
                        };
                        404: {
                            readonly message: "الفرع غير موجود";
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
    "grooming-definitions": {
        "quote-preview": {
            post: {
                body: {
                    definitionIds: string[];
                    pet: {
                        animalTypeId?: string | null | undefined;
                        animalStrainId?: string | null | undefined;
                        sizeBand?: "MEDIUM" | "SMALL" | "LARGE" | "TOY" | "GIANT" | null | undefined;
                        coatType?: "NONE" | "LONG_THICK" | "SHORT_THICK" | "LIGHT" | "MEDIUM" | "DOUBLE_COAT" | null | undefined;
                        weightKg?: number | null | undefined;
                    };
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: import("@/server/grooming/grooming-pricing.service").GroomingQuote;
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض التجميل";
                    };
                    404: {
                        readonly message: "لا توجد تعريفات تجميل مطابقة";
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
