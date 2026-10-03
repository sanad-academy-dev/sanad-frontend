import Elysia from "elysia";
export declare const quizAttemptsController: Elysia<"/quiz-attempts", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "quizAttempts.start": import("@sinclair/typebox").TObject<{
            assignmentId: import("@sinclair/typebox").TString;
        }>;
        readonly "quizAttempts.startByQuiz": import("@sinclair/typebox").TObject<{
            quizId: import("@sinclair/typebox").TString;
        }>;
        readonly "quizAttempts.submit": import("@sinclair/typebox").TObject<{
            answers: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                questionId: import("@sinclair/typebox").TString;
                selectedOptions: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TInteger>>;
                answerText: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            }>>;
        }>;
        readonly "quizAttempts.grade": import("@sinclair/typebox").TObject<{
            grades: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                questionId: import("@sinclair/typebox").TString;
                awardedPoints: import("@sinclair/typebox").TInteger;
            }>>;
        }>;
        readonly "quizAttempts.aiSuggest": import("@sinclair/typebox").TObject<{
            attemptId: import("@sinclair/typebox").TString;
            questionId: import("@sinclair/typebox").TString;
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
    "quiz-attempts": {};
} & {
    "quiz-attempts": {
        start: {
            post: {
                body: {
                    assignmentId: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: null;
                    201: {
                        attempt: {
                            id: string;
                            attemptNo: number;
                            startedAt: Date | string;
                        };
                        quiz: {
                            id: string;
                            title: string;
                            passMark: number;
                            timeLimitMinutes: number | null;
                            showAnswers: boolean;
                        };
                        questions: import("./quiz-attempts.type").PlayerQuestion[];
                    };
                    400: {
                        readonly message: "الاختبار غير منشور";
                    } | {
                        readonly message: "استنفدت عدد المحاولات المسموح";
                    } | {
                        readonly message: "انتهى وقت الاختبار";
                    } | {
                        readonly message: "سؤال لا ينتمي إلى هذا الاختبار";
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لست الموظف المُعيَّن لهذا الاختبار";
                    };
                    404: {
                        readonly message: "غير موجود";
                    } | {
                        readonly message: "لست مُعيَّناً على هذا الاختبار";
                    };
                    409: {
                        readonly message: "تم تسليم هذه المحاولة مسبقًا";
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
    "quiz-attempts": {
        "start-by-quiz": {
            post: {
                body: {
                    quizId: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: null;
                    201: {
                        attempt: {
                            id: string;
                            attemptNo: number;
                            startedAt: Date | string;
                        };
                        quiz: {
                            id: string;
                            title: string;
                            passMark: number;
                            timeLimitMinutes: number | null;
                            showAnswers: boolean;
                        };
                        questions: import("./quiz-attempts.type").PlayerQuestion[];
                    };
                    400: {
                        readonly message: "الاختبار غير منشور";
                    } | {
                        readonly message: "استنفدت عدد المحاولات المسموح";
                    } | {
                        readonly message: "انتهى وقت الاختبار";
                    } | {
                        readonly message: "سؤال لا ينتمي إلى هذا الاختبار";
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لست الموظف المُعيَّن لهذا الاختبار";
                    };
                    404: {
                        readonly message: "غير موجود";
                    } | {
                        readonly message: "لست مُعيَّناً على هذا الاختبار";
                    };
                    409: {
                        readonly message: "تم تسليم هذه المحاولة مسبقًا";
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
    "quiz-attempts": {
        "my-result": {
            get: {
                body: {};
                params: {};
                query: {
                    quizId: string;
                };
                headers: {};
                response: {
                    200: import("./quiz-attempts.type").AttemptResultResponse;
                    401: {
                        readonly message: "غير مصرح";
                    };
                    404: {
                        readonly message: "لا توجد نتيجة بعد";
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
    "quiz-attempts": {
        get: {
            body: {};
            params: {};
            query: {
                assignmentId: string;
            };
            headers: {};
            response: {
                200: import("./quiz-attempts.type").AttemptListItemResponse[];
                401: {
                    readonly message: "غير مصرح";
                };
                404: {
                    readonly message: "التعيين غير موجود";
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
    "quiz-attempts": {
        ":id": {
            play: {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: import("./quiz-attempts.type").PlayerAttemptResponse | null;
                        400: {
                            readonly message: "الاختبار غير منشور";
                        } | {
                            readonly message: "استنفدت عدد المحاولات المسموح";
                        } | {
                            readonly message: "انتهى وقت الاختبار";
                        } | {
                            readonly message: "سؤال لا ينتمي إلى هذا الاختبار";
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لست الموظف المُعيَّن لهذا الاختبار";
                        };
                        404: {
                            readonly message: "غير موجود";
                        } | {
                            readonly message: "لست مُعيَّناً على هذا الاختبار";
                        };
                        409: {
                            readonly message: "تم تسليم هذه المحاولة مسبقًا";
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
    "quiz-attempts": {
        ":id": {
            submit: {
                post: {
                    body: {
                        answers: {
                            selectedOptions?: number[] | undefined;
                            answerText?: string | undefined;
                            questionId: string;
                        }[];
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: import("./quiz-attempts.type").AttemptResultResponse | null;
                        400: {
                            readonly message: "الاختبار غير منشور";
                        } | {
                            readonly message: "استنفدت عدد المحاولات المسموح";
                        } | {
                            readonly message: "انتهى وقت الاختبار";
                        } | {
                            readonly message: "سؤال لا ينتمي إلى هذا الاختبار";
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لست الموظف المُعيَّن لهذا الاختبار";
                        };
                        404: {
                            readonly message: "غير موجود";
                        } | {
                            readonly message: "لست مُعيَّناً على هذا الاختبار";
                        };
                        409: {
                            readonly message: "تم تسليم هذه المحاولة مسبقًا";
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
    "quiz-attempts": {
        ":id": {
            result: {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: import("./quiz-attempts.type").AttemptResultResponse;
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "المحاولة غير موجودة";
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
    "quiz-attempts": {
        roster: {
            get: {
                body: {};
                params: {};
                query: {
                    quizId: string;
                };
                headers: {};
                response: {
                    200: import("./quiz-attempts.type").QuizRosterRowResponse[];
                    401: {
                        readonly message: "غير مصرح";
                    };
                    404: {
                        readonly message: "الاختبار غير موجود";
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
    "quiz-attempts": {
        ":id": {
            grading: {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: import("./quiz-attempts.type").GradingResponse;
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "المحاولة غير موجودة";
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
    "quiz-attempts": {
        ":id": {
            grade: {
                post: {
                    body: {
                        grades: {
                            questionId: string;
                            awardedPoints: number;
                        }[];
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: import("./quiz-attempts.type").GradingResponse;
                        400: {
                            readonly message: "سؤال لا ينتمي إلى هذا الاختبار";
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "المحاولة غير موجودة";
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
    "quiz-attempts": {
        "ai-suggest": {
            post: {
                body: {
                    questionId: string;
                    attemptId: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: import("./quiz-attempts.type").AiSuggestResponse;
                    400: {
                        readonly message: "سؤال لا ينتمي إلى هذا الاختبار";
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    404: {
                        readonly message: "المحاولة غير موجودة";
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
                        readonly message: "مزوّد الذكاء الاصطناعي غير مهيأ";
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
