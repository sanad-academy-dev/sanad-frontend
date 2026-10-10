import Elysia from "elysia";
export declare const publicController: Elysia<"/public", {
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
}, {
    public: {
        clinic: {
            ":slug": {
                get: {
                    body: unknown;
                    params: {
                        slug: string;
                    };
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("./public.type").PublicClinicResponse;
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
} & {
    public: {
        clinic: {
            ":slug": {
                staff: {
                    get: {
                        body: unknown;
                        params: {
                            slug: string;
                        };
                        query: unknown;
                        headers: unknown;
                        response: {
                            200: import("./public.type").PublicClinicStaffResponse[];
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
    public: {
        clinic: {
            ":slug": {
                services: {
                    get: {
                        body: unknown;
                        params: {
                            slug: string;
                        };
                        query: unknown;
                        headers: unknown;
                        response: {
                            200: import("./public.type").PublicClinicService[];
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
    public: {
        clinic: {
            ":slug": {
                categories: {
                    get: {
                        body: unknown;
                        params: {
                            slug: string;
                        };
                        query: unknown;
                        headers: unknown;
                        response: {
                            200: import("./public.type").PublicClinicCategory[];
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
    public: {
        clinic: {
            ":slug": {
                "animal-types": {
                    get: {
                        body: unknown;
                        params: {
                            slug: string;
                        };
                        query: unknown;
                        headers: unknown;
                        response: {
                            200: import("./public.type").PublicAnimalType[];
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
    public: {
        clinic: {
            ":slug": {
                staff: {
                    ":staffId": {
                        slots: {
                            get: {
                                body: unknown;
                                params: {
                                    slug: string;
                                    staffId: string;
                                };
                                query: {
                                    to: string;
                                    from: string;
                                    serviceId: string;
                                };
                                headers: unknown;
                                response: {
                                    200: import("./public.type").PublicSlotRangeResponse;
                                    400: {
                                        readonly message: "تاريخ غير صالح";
                                    } | {
                                        readonly message: "نطاق التاريخ غير صالح";
                                    };
                                    404: {
                                        readonly message: "المدرّب أو الدورة غير متاحة للحجز";
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
