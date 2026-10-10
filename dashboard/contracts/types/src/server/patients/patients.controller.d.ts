import Elysia from "elysia";
/**
 * [RBAC P5] Reference conversion: `requireClinic` → `requirePermission`.
 *
 * Before this, every route here was reachable by ANY authenticated clinic member — the
 * macro checked a session and a tenant, and nothing else. That was true of 76 of the app's
 * 88 non-accounting controllers.
 *
 * `patients` is granted at `ALL` only: `Patient` carries no `branchId`, so the registry
 * deliberately declares no narrower scope for it rather than offering the operator a
 * restriction no query can apply.
 */
export declare const patientsController: Elysia<"/patients", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "patients.create": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            gender: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MALE">, import("@sinclair/typebox").TLiteral<"FEMALE">, import("@sinclair/typebox").TLiteral<"UNKNOWN">]>;
            animalTypeId: import("@sinclair/typebox").TString;
            animalStrainId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            ownerId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            age: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            birthDate: import("@sinclair/typebox").TString;
            weight: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "patients.update": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            gender: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MALE">, import("@sinclair/typebox").TLiteral<"FEMALE">, import("@sinclair/typebox").TLiteral<"UNKNOWN">]>>;
            animalTypeId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            animalStrainId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            ownerId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            age: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            birthDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            weight: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "patients.transferOwnership": import("@sinclair/typebox").TObject<{
            ownerId: import("@sinclair/typebox").TString;
            comment: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
    };
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
        readonly requirePermission: {
            resource: string;
            action: string;
            minimumScope?: import("../../lib/rbac/rbac-registry").PermissionScope;
        };
    }>;
    macroFn: {
        readonly requirePermission: (options: {
            resource: string;
            action: string;
            minimumScope?: import("../../lib/rbac/rbac-registry").PermissionScope;
        }) => {
            readonly resolve: ({ request }: {
                request: Request;
            }) => Promise<import("elysia").ElysiaCustomStatusResponse<401, {
                readonly message: "غير مصرح";
            }, 401> | import("elysia").ElysiaCustomStatusResponse<403, {
                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
            }, 403> | import("elysia").ElysiaCustomStatusResponse<403, {
                readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
            }, 403> | {
                clinicId: string;
                userId: string;
                staffId: string | null;
                branchId: string | null;
                isSuperAdmin: boolean;
                scopeKind: string;
                scopeBranchId: string | null;
                scopeStaffId: string | null;
            }>;
        };
    };
    parser: {};
    response: {};
}, {
    patients: {};
} & {
    patients: {
        get: {
            body: {};
            params: {};
            query: {
                ownerId?: string | undefined;
            };
            headers: {};
            response: {
                200: {
                    animalType: {
                        id: string;
                        arName: string;
                        enName: string;
                    };
                    animalStrain: {
                        id: string;
                        arName: string;
                        enName: string;
                    } | null;
                    owner: {
                        name: string;
                        id: string;
                        email: string | null;
                        phone: string;
                        code: string;
                    } | null;
                    name: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    code: string;
                    gender: import("./patients.type").Gender;
                    age: number | null;
                    notes: string | null;
                    active: boolean;
                    editsCount: number;
                    birthDate: Date | null;
                    weight: number | null;
                }[];
                401: {
                    readonly message: "غير مصرح";
                };
                403: {
                    readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                } | {
                    readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
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
    patients: {
        post: {
            body: {
                age?: number | null | undefined;
                notes?: string | null | undefined;
                active?: boolean | undefined;
                ownerId?: string | undefined;
                animalStrainId?: string | null | undefined;
                weight?: number | null | undefined;
                name: string;
                gender: "MALE" | "FEMALE" | "UNKNOWN";
                animalTypeId: string;
                birthDate: string;
            };
            params: {};
            query: {};
            headers: {};
            response: {
                201: {
                    animalType: {
                        id: string;
                        arName: string;
                        enName: string;
                    };
                    animalStrain: {
                        id: string;
                        arName: string;
                        enName: string;
                    } | null;
                    owner: {
                        name: string;
                        id: string;
                        email: string | null;
                        phone: string;
                        code: string;
                    } | null;
                    name: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    code: string;
                    gender: import("./patients.type").Gender;
                    age: number | null;
                    notes: string | null;
                    active: boolean;
                    editsCount: number;
                    birthDate: Date | null;
                    weight: number | null;
                };
                401: {
                    readonly message: "غير مصرح";
                };
                403: {
                    readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                } | {
                    readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
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
    patients: {
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
                            enName: string;
                        };
                        animalStrain: {
                            id: string;
                            arName: string;
                            enName: string;
                        } | null;
                        owner: {
                            name: string;
                            id: string;
                            email: string | null;
                            phone: string;
                            code: string;
                        } | null;
                        name: string;
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        code: string;
                        gender: import("./patients.type").Gender;
                        age: number | null;
                        notes: string | null;
                        active: boolean;
                        editsCount: number;
                        birthDate: Date | null;
                        weight: number | null;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                    } | {
                        readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
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
} & {
    patients: {
        ":id": {
            patch: {
                body: {
                    name?: string | undefined;
                    gender?: "MALE" | "FEMALE" | "UNKNOWN" | undefined;
                    age?: number | null | undefined;
                    notes?: string | null | undefined;
                    active?: boolean | undefined;
                    animalTypeId?: string | undefined;
                    ownerId?: string | undefined;
                    animalStrainId?: string | null | undefined;
                    birthDate?: string | null | undefined;
                    weight?: number | null | undefined;
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
                            enName: string;
                        };
                        animalStrain: {
                            id: string;
                            arName: string;
                            enName: string;
                        } | null;
                        owner: {
                            name: string;
                            id: string;
                            email: string | null;
                            phone: string;
                            code: string;
                        } | null;
                        name: string;
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        code: string;
                        gender: import("./patients.type").Gender;
                        age: number | null;
                        notes: string | null;
                        active: boolean;
                        editsCount: number;
                        birthDate: Date | null;
                        weight: number | null;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                    } | {
                        readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
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
} & {
    patients: {
        ":id": {
            "transfer-ownership": {
                patch: {
                    body: {
                        comment?: string | undefined;
                        ownerId: string;
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
                                enName: string;
                            };
                            animalStrain: {
                                id: string;
                                arName: string;
                                enName: string;
                            } | null;
                            owner: {
                                name: string;
                                id: string;
                                email: string | null;
                                phone: string;
                                code: string;
                            } | null;
                            name: string;
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            code: string;
                            gender: import("./patients.type").Gender;
                            age: number | null;
                            notes: string | null;
                            active: boolean;
                            editsCount: number;
                            birthDate: Date | null;
                            weight: number | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                        } | {
                            readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                        };
                        404: {
                            readonly message: "الطفل غير موجود";
                        } | {
                            readonly message: "وليّ الأمر غير موجود";
                        };
                        409: {
                            readonly message: "يوجد طفل بنفس الاسم لدى وليّ الأمر الجديد";
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
    patients: {
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
                            type: import("../../../generated/prisma/enums").PatientActivityType;
                            id: string;
                            createdAt: Date;
                            metadata: import("@prisma/client/runtime/client").JsonValue;
                            body: string | null;
                            author: {
                                name: string;
                                id: string;
                            };
                        }[];
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                        } | {
                            readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
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
    patients: {
        ":id": {
            history: {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: import("./patients.type").PatientHistoryEntry[];
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                        } | {
                            readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
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
    patients: {
        ":id": {
            delete: {
                body: {};
                params: {
                    id: string;
                };
                query: {};
                headers: {};
                response: {
                    204: "No Content";
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                    } | {
                        readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
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
