import Elysia from "elysia";
export declare const payrollController: Elysia<"/payroll", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "payroll.run.create": import("@sinclair/typebox").TObject<{
            periodYear: import("@sinclair/typebox").TInteger;
            periodMonth: import("@sinclair/typebox").TInteger;
            type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"REGULAR">, import("@sinclair/typebox").TLiteral<"OFF_CYCLE">]>>;
            scope: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ALL">, import("@sinclair/typebox").TLiteral<"BRANCH">, import("@sinclair/typebox").TLiteral<"DEPARTMENT">, import("@sinclair/typebox").TLiteral<"CONTRACT">, import("@sinclair/typebox").TLiteral<"SPECIFIC">]>>;
            scopeBranchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            scopeRoleId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            payDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "payroll.run.offCycle": import("@sinclair/typebox").TObject<{
            periodYear: import("@sinclair/typebox").TInteger;
            periodMonth: import("@sinclair/typebox").TInteger;
            payDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            reason: import("@sinclair/typebox").TString;
            lines: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                staffId: import("@sinclair/typebox").TString;
                type: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ALLOWANCE">, import("@sinclair/typebox").TLiteral<"BONUS">, import("@sinclair/typebox").TLiteral<"COMMISSION">, import("@sinclair/typebox").TLiteral<"EXPENSE_REIMBURSEMENT">]>;
                amount: import("@sinclair/typebox").TNumber;
                note: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            }>>;
        }>;
        readonly "payroll.run.calculate": import("@sinclair/typebox").TObject<{
            confirmRemovals: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "payroll.line.update": import("@sinclair/typebox").TObject<{
            overtimeHoursOverride: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            paymentMethodOverride: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"TRANSFER">, import("@sinclair/typebox").TLiteral<"CASH">, import("@sinclair/typebox").TLiteral<"CHECK">]>]>>;
            note: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            excluded: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "payroll.earning.create": import("@sinclair/typebox").TObject<{
            type: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ALLOWANCE">, import("@sinclair/typebox").TLiteral<"BONUS">, import("@sinclair/typebox").TLiteral<"COMMISSION">, import("@sinclair/typebox").TLiteral<"EXPENSE_REIMBURSEMENT">]>;
            amount: import("@sinclair/typebox").TNumber;
            note: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
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
    payroll: {};
} & {
    payroll: {
        runs: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        type: import("./payroll.type").PayrollRunType;
                        id: string;
                        createdAt: Date;
                        _count: {
                            lines: number;
                        };
                        code: string;
                        scope: import("./payroll.type").PayrollScope;
                        status: import("./payroll.type").PayrollRunStatus;
                        scopeBranchId: string | null;
                        approvedAt: Date | null;
                        periodYear: number;
                        periodMonth: number;
                        payDate: Date | null;
                        scopeRoleId: string | null;
                        totalGross: import("@prisma/client-runtime-utils").Decimal | null;
                        totalEmployeeGosi: import("@prisma/client-runtime-utils").Decimal | null;
                        totalCompanyGosi: import("@prisma/client-runtime-utils").Decimal | null;
                        totalNet: import("@prisma/client-runtime-utils").Decimal | null;
                        totalCompanyCost: import("@prisma/client-runtime-utils").Decimal | null;
                    }[];
                    401: {
                        readonly message: "غير مصرح";
                    };
                };
            };
        };
    };
} & {
    payroll: {
        preview: {
            get: {
                body: {};
                params: {};
                query: {
                    year: string;
                    month: string;
                };
                headers: {};
                response: {
                    200: {
                        staffId: string;
                        totalHours: number;
                        overtimeHours: number;
                        paymentMethod: import("./payroll.type").PayrollPaymentMethod;
                        isActive: boolean;
                        hasCompensation: boolean;
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
    payroll: {
        runs: {
            period: {
                get: {
                    body: {};
                    params: {};
                    query: {
                        year: string;
                        month: string;
                    };
                    headers: {};
                    response: {
                        200: {
                            type: import("./payroll.type").PayrollRunType;
                            id: string;
                            createdAt: Date;
                            _count: {
                                lines: number;
                            };
                            code: string;
                            scope: import("./payroll.type").PayrollScope;
                            status: import("./payroll.type").PayrollRunStatus;
                            scopeBranchId: string | null;
                            approvedAt: Date | null;
                            periodYear: number;
                            periodMonth: number;
                            payDate: Date | null;
                            scopeRoleId: string | null;
                            totalGross: import("@prisma/client-runtime-utils").Decimal | null;
                            totalEmployeeGosi: import("@prisma/client-runtime-utils").Decimal | null;
                            totalCompanyGosi: import("@prisma/client-runtime-utils").Decimal | null;
                            totalNet: import("@prisma/client-runtime-utils").Decimal | null;
                            totalCompanyCost: import("@prisma/client-runtime-utils").Decimal | null;
                        } | null;
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
    };
} & {
    payroll: {
        runs: {
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
                            type: import("./payroll.type").PayrollRunType;
                            id: string;
                            createdAt: Date;
                            _count: {
                                lines: number;
                            };
                            code: string;
                            scope: import("./payroll.type").PayrollScope;
                            status: import("./payroll.type").PayrollRunStatus;
                            lines: {
                                issues: import("@prisma/client/runtime/client").JsonValue;
                                id: string;
                                staffId: string;
                                note: string | null;
                                staffName: string;
                                staffCode: string;
                                baseSalary: import("@prisma/client-runtime-utils").Decimal;
                                allowancesTotal: import("@prisma/client-runtime-utils").Decimal;
                                overtimeHoursSuggested: import("@prisma/client-runtime-utils").Decimal;
                                overtimeHoursOverride: import("@prisma/client-runtime-utils").Decimal | null;
                                paymentMethodSuggested: import("./payroll.type").PayrollPaymentMethod;
                                paymentMethodOverride: import("./payroll.type").PayrollPaymentMethod | null;
                                overtimePay: import("@prisma/client-runtime-utils").Decimal;
                                leaveDeduction: import("@prisma/client-runtime-utils").Decimal;
                                grossEarnings: import("@prisma/client-runtime-utils").Decimal;
                                gosiBase: import("@prisma/client-runtime-utils").Decimal;
                                employeeGosi: import("@prisma/client-runtime-utils").Decimal;
                                companyGosi: import("@prisma/client-runtime-utils").Decimal;
                                netPay: import("@prisma/client-runtime-utils").Decimal;
                                companyCost: import("@prisma/client-runtime-utils").Decimal;
                                excluded: boolean;
                                earnings: {
                                    type: import("./payroll.type").PayrollEarningType;
                                    id: string;
                                    amount: import("@prisma/client-runtime-utils").Decimal;
                                    note: string | null;
                                }[];
                            }[];
                            distribution: import("@prisma/client/runtime/client").JsonValue;
                            scopeBranchId: string | null;
                            approvedAt: Date | null;
                            periodYear: number;
                            periodMonth: number;
                            payDate: Date | null;
                            scopeRoleId: string | null;
                            totalGross: import("@prisma/client-runtime-utils").Decimal | null;
                            totalEmployeeGosi: import("@prisma/client-runtime-utils").Decimal | null;
                            totalCompanyGosi: import("@prisma/client-runtime-utils").Decimal | null;
                            totalNet: import("@prisma/client-runtime-utils").Decimal | null;
                            totalCompanyCost: import("@prisma/client-runtime-utils").Decimal | null;
                            approvalSteps: {
                                id: string;
                                title: string;
                                comment: string | null;
                                order: number;
                                state: import("./payroll.type").PayrollApprovalState;
                                actedAt: Date | null;
                                approver: {
                                    name: string;
                                    id: string;
                                } | null;
                            }[];
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "المسير غير موجود";
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
    payroll: {
        runs: {
            ":id": {
                "previous-nets": {
                    get: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                [k: string]: number;
                            } | null;
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                readonly message: "المسير غير موجود";
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
    payroll: {
        runs: {
            ":id": {
                leaves: {
                    get: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                types: {
                                    slug: string;
                                    name: string;
                                }[];
                                rows: {
                                    staffId: string;
                                    staffName: string;
                                    leaves: {
                                        slug: string;
                                        name: string;
                                        payPercent: number;
                                        periodDays: number;
                                        remaining: number | null;
                                        entitlementDays: number | null;
                                    }[];
                                }[];
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                readonly message: "المسير غير موجود";
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
    payroll: {
        runs: {
            post: {
                body: {
                    type?: "REGULAR" | "OFF_CYCLE" | undefined;
                    scope?: "ALL" | "BRANCH" | "CONTRACT" | "DEPARTMENT" | "SPECIFIC" | undefined;
                    scopeBranchId?: string | null | undefined;
                    payDate?: string | null | undefined;
                    scopeRoleId?: string | null | undefined;
                    periodYear: number;
                    periodMonth: number;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        type: import("./payroll.type").PayrollRunType;
                        id: string;
                        clinicId: string;
                        createdById: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        code: string;
                        scope: import("./payroll.type").PayrollScope;
                        status: import("./payroll.type").PayrollRunStatus;
                        cancelledAt: Date | null;
                        paidAt: Date | null;
                        distribution: import("@prisma/client/runtime/client").JsonValue | null;
                        scopeBranchId: string | null;
                        approvedAt: Date | null;
                        periodYear: number;
                        periodMonth: number;
                        payDate: Date | null;
                        scopeRoleId: string | null;
                        totalGross: import("@prisma/client-runtime-utils").Decimal | null;
                        totalEmployeeGosi: import("@prisma/client-runtime-utils").Decimal | null;
                        totalCompanyGosi: import("@prisma/client-runtime-utils").Decimal | null;
                        totalNet: import("@prisma/client-runtime-utils").Decimal | null;
                        totalCompanyCost: import("@prisma/client-runtime-utils").Decimal | null;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    409: {
                        readonly message: string;
                    };
                    422: {
                        readonly message: string;
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
    payroll: {
        runs: {
            "off-cycle": {
                post: {
                    body: {
                        payDate?: string | null | undefined;
                        reason: string;
                        lines: {
                            note?: string | null | undefined;
                            type: "ALLOWANCE" | "BONUS" | "COMMISSION" | "EXPENSE_REIMBURSEMENT";
                            staffId: string;
                            amount: number;
                        }[];
                        periodYear: number;
                        periodMonth: number;
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            type: import("./payroll.type").PayrollRunType;
                            id: string;
                            createdAt: Date;
                            _count: {
                                lines: number;
                            };
                            code: string;
                            scope: import("./payroll.type").PayrollScope;
                            status: import("./payroll.type").PayrollRunStatus;
                            scopeBranchId: string | null;
                            approvedAt: Date | null;
                            periodYear: number;
                            periodMonth: number;
                            payDate: Date | null;
                            scopeRoleId: string | null;
                            totalGross: import("@prisma/client-runtime-utils").Decimal | null;
                            totalEmployeeGosi: import("@prisma/client-runtime-utils").Decimal | null;
                            totalCompanyGosi: import("@prisma/client-runtime-utils").Decimal | null;
                            totalNet: import("@prisma/client-runtime-utils").Decimal | null;
                            totalCompanyCost: import("@prisma/client-runtime-utils").Decimal | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        422: {
                            readonly message: "بعض الموظفين غير موجودين في هذه الأكاديمية";
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
    payroll: {
        runs: {
            ":id": {
                calculate: {
                    post: {
                        body: {
                            confirmRemovals?: boolean | undefined;
                        } | null;
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                status: "NEEDS_CONFIRMATION";
                                removals: import("@/server/payroll/payroll.dao").PendingRemoval[];
                            } | {
                                status: "CALCULATED";
                                lineCount: number;
                                removedCount: number;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            409: {
                                readonly message: string;
                            };
                            422: {
                                readonly message: string;
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
    };
} & {
    payroll: {
        runs: {
            ":id": {
                approve: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                type: import("./payroll.type").PayrollRunType;
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                scope: import("./payroll.type").PayrollScope;
                                status: import("./payroll.type").PayrollRunStatus;
                                cancelledAt: Date | null;
                                paidAt: Date | null;
                                distribution: import("@prisma/client/runtime/client").JsonValue | null;
                                scopeBranchId: string | null;
                                approvedAt: Date | null;
                                periodYear: number;
                                periodMonth: number;
                                payDate: Date | null;
                                scopeRoleId: string | null;
                                totalGross: import("@prisma/client-runtime-utils").Decimal | null;
                                totalEmployeeGosi: import("@prisma/client-runtime-utils").Decimal | null;
                                totalCompanyGosi: import("@prisma/client-runtime-utils").Decimal | null;
                                totalNet: import("@prisma/client-runtime-utils").Decimal | null;
                                totalCompanyCost: import("@prisma/client-runtime-utils").Decimal | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                readonly message: "المسير غير موجود";
                            };
                            409: {
                                readonly message: string;
                            };
                            422: {
                                readonly message: string;
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
    };
} & {
    payroll: {
        runs: {
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
                            200: {
                                type: import("./payroll.type").PayrollRunType;
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                scope: import("./payroll.type").PayrollScope;
                                status: import("./payroll.type").PayrollRunStatus;
                                cancelledAt: Date | null;
                                paidAt: Date | null;
                                distribution: import("@prisma/client/runtime/client").JsonValue | null;
                                scopeBranchId: string | null;
                                approvedAt: Date | null;
                                periodYear: number;
                                periodMonth: number;
                                payDate: Date | null;
                                scopeRoleId: string | null;
                                totalGross: import("@prisma/client-runtime-utils").Decimal | null;
                                totalEmployeeGosi: import("@prisma/client-runtime-utils").Decimal | null;
                                totalCompanyGosi: import("@prisma/client-runtime-utils").Decimal | null;
                                totalNet: import("@prisma/client-runtime-utils").Decimal | null;
                                totalCompanyCost: import("@prisma/client-runtime-utils").Decimal | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            422: {
                                readonly message: "لا يمكن صرف مسير غير معتمد";
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
    };
} & {
    payroll: {
        runs: {
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
                                type: import("./payroll.type").PayrollRunType;
                                id: string;
                                clinicId: string;
                                createdById: string | null;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                scope: import("./payroll.type").PayrollScope;
                                status: import("./payroll.type").PayrollRunStatus;
                                cancelledAt: Date | null;
                                paidAt: Date | null;
                                distribution: import("@prisma/client/runtime/client").JsonValue | null;
                                scopeBranchId: string | null;
                                approvedAt: Date | null;
                                periodYear: number;
                                periodMonth: number;
                                payDate: Date | null;
                                scopeRoleId: string | null;
                                totalGross: import("@prisma/client-runtime-utils").Decimal | null;
                                totalEmployeeGosi: import("@prisma/client-runtime-utils").Decimal | null;
                                totalCompanyGosi: import("@prisma/client-runtime-utils").Decimal | null;
                                totalNet: import("@prisma/client-runtime-utils").Decimal | null;
                                totalCompanyCost: import("@prisma/client-runtime-utils").Decimal | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            422: {
                                readonly message: "لا يمكن إلغاء هذا المسير";
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
    };
} & {
    payroll: {
        lines: {
            ":lineId": {
                patch: {
                    body: {
                        note?: string | null | undefined;
                        overtimeHoursOverride?: number | null | undefined;
                        paymentMethodOverride?: "CASH" | "TRANSFER" | "CHECK" | null | undefined;
                        excluded?: boolean | undefined;
                    };
                    params: {
                        lineId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            issues: import("@prisma/client/runtime/client").JsonValue | null;
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            staffId: string;
                            note: string | null;
                            runId: string;
                            staffName: string;
                            staffCode: string;
                            baseSalary: import("@prisma/client-runtime-utils").Decimal;
                            allowancesTotal: import("@prisma/client-runtime-utils").Decimal;
                            overtimeHoursSuggested: import("@prisma/client-runtime-utils").Decimal;
                            overtimeHoursOverride: import("@prisma/client-runtime-utils").Decimal | null;
                            paymentMethodSuggested: import("./payroll.type").PayrollPaymentMethod;
                            paymentMethodOverride: import("./payroll.type").PayrollPaymentMethod | null;
                            overtimePay: import("@prisma/client-runtime-utils").Decimal;
                            leaveDeduction: import("@prisma/client-runtime-utils").Decimal;
                            grossEarnings: import("@prisma/client-runtime-utils").Decimal;
                            gosiBase: import("@prisma/client-runtime-utils").Decimal;
                            employeeGosi: import("@prisma/client-runtime-utils").Decimal;
                            companyGosi: import("@prisma/client-runtime-utils").Decimal;
                            netPay: import("@prisma/client-runtime-utils").Decimal;
                            companyCost: import("@prisma/client-runtime-utils").Decimal;
                            excluded: boolean;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "السطر غير موجود";
                        };
                        409: {
                            readonly message: string;
                        };
                        422: {
                            readonly message: string;
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
    payroll: {
        lines: {
            ":lineId": {
                override: {
                    ":field": {
                        delete: {
                            body: {};
                            params: {
                                field: "paymentMethod" | "overtimeHours";
                                lineId: string;
                            };
                            query: {};
                            headers: {};
                            response: {
                                200: {
                                    issues: import("@prisma/client/runtime/client").JsonValue | null;
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    staffId: string;
                                    note: string | null;
                                    runId: string;
                                    staffName: string;
                                    staffCode: string;
                                    baseSalary: import("@prisma/client-runtime-utils").Decimal;
                                    allowancesTotal: import("@prisma/client-runtime-utils").Decimal;
                                    overtimeHoursSuggested: import("@prisma/client-runtime-utils").Decimal;
                                    overtimeHoursOverride: import("@prisma/client-runtime-utils").Decimal | null;
                                    paymentMethodSuggested: import("./payroll.type").PayrollPaymentMethod;
                                    paymentMethodOverride: import("./payroll.type").PayrollPaymentMethod | null;
                                    overtimePay: import("@prisma/client-runtime-utils").Decimal;
                                    leaveDeduction: import("@prisma/client-runtime-utils").Decimal;
                                    grossEarnings: import("@prisma/client-runtime-utils").Decimal;
                                    gosiBase: import("@prisma/client-runtime-utils").Decimal;
                                    employeeGosi: import("@prisma/client-runtime-utils").Decimal;
                                    companyGosi: import("@prisma/client-runtime-utils").Decimal;
                                    netPay: import("@prisma/client-runtime-utils").Decimal;
                                    companyCost: import("@prisma/client-runtime-utils").Decimal;
                                    excluded: boolean;
                                };
                                401: {
                                    readonly message: "غير مصرح";
                                };
                                404: {
                                    readonly message: "السطر غير موجود";
                                };
                                409: {
                                    readonly message: string;
                                };
                                422: {
                                    readonly message: string;
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
        };
    };
} & {
    payroll: {
        lines: {
            ":lineId": {
                earnings: {
                    post: {
                        body: {
                            note?: string | null | undefined;
                            type: "ALLOWANCE" | "BONUS" | "COMMISSION" | "EXPENSE_REIMBURSEMENT";
                            amount: number;
                        };
                        params: {
                            lineId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                type: import("./payroll.type").PayrollEarningType;
                                id: string;
                                createdAt: Date;
                                amount: import("@prisma/client-runtime-utils").Decimal;
                                note: string | null;
                                lineId: string;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                readonly message: "السطر غير موجود";
                            };
                            409: {
                                readonly message: string;
                            };
                            422: {
                                readonly message: string;
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
    };
} & {
    payroll: {
        earnings: {
            ":earningId": {
                delete: {
                    body: {};
                    params: {
                        earningId: string;
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
                            readonly message: "الاستحقاق غير موجود";
                        };
                        409: {
                            readonly message: string;
                        };
                        422: {
                            readonly message: string;
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
