import Elysia from "elysia";
/**
 * [RBAC P5] `Owner` carries no `branchId`, so the registry grants this resource at `ALL`
 * only — see the scope audit in `docs/rbac-module-plan.md` §2.
 *
 * `disable` and soft-`delete` both reassign the owner's patients to another owner, so both
 * gate on `delete` rather than `update`: they end a relationship rather than editing one.
 */
export declare const ownersController: Elysia<"/owners", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "owners.create": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            phone: import("@sinclair/typebox").TString;
            email: import("@sinclair/typebox").TString;
            gender: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MALE">, import("@sinclair/typebox").TLiteral<"FEMALE">, import("@sinclair/typebox").TLiteral<"UNKNOWN">]>>;
            ownerType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ALL">, import("@sinclair/typebox").TLiteral<"VIP">, import("@sinclair/typebox").TLiteral<"LOYALTY">, import("@sinclair/typebox").TLiteral<"NEW">, import("@sinclair/typebox").TLiteral<"CURRENT">]>>;
            relationship: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"OWNER">, import("@sinclair/typebox").TLiteral<"GUARDIAN">, import("@sinclair/typebox").TLiteral<"DELEGATE">, import("@sinclair/typebox").TLiteral<"EMERGENCY">]>]>>;
            country: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            city: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            address: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            patientIds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        }>;
        readonly "owners.update": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            phone: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            email: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            gender: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MALE">, import("@sinclair/typebox").TLiteral<"FEMALE">, import("@sinclair/typebox").TLiteral<"UNKNOWN">]>]>>;
            ownerType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ALL">, import("@sinclair/typebox").TLiteral<"VIP">, import("@sinclair/typebox").TLiteral<"LOYALTY">, import("@sinclair/typebox").TLiteral<"NEW">, import("@sinclair/typebox").TLiteral<"CURRENT">]>>;
            relationship: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"OWNER">, import("@sinclair/typebox").TLiteral<"GUARDIAN">, import("@sinclair/typebox").TLiteral<"DELEGATE">, import("@sinclair/typebox").TLiteral<"EMERGENCY">]>]>>;
            country: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            city: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            address: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            patientIds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        }>;
        readonly "owners.disable": import("@sinclair/typebox").TObject<{
            newOwnerId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "owners.delete": import("@sinclair/typebox").TObject<{
            newOwnerId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
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
    owners: {};
} & {
    owners: {
        get: {
            body: {};
            params: {};
            query: {};
            headers: {};
            response: {
                200: {
                    name: string;
                    address: string | null;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string | null;
                    phone: string;
                    city: string | null;
                    code: string;
                    patients: {
                        animalType: {
                            arName: string;
                            enName: string;
                        };
                        id: string;
                    }[];
                    gender: import("./owners.type").Gender | null;
                    country: string | null;
                    notes: string | null;
                    active: boolean;
                    editsCount: number;
                    ownerType: import("./owners.type").OwnerType;
                    relationship: import("./owners.type").OwnerRelationship | null;
                }[];
                401: {
                    readonly message: "غير مصرح";
                };
                403: {
                    readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                } | {
                    readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                };
            };
        };
    };
} & {
    owners: {
        ":id": {
            portal: {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            hasAccount: boolean;
                            phoneE164: null;
                            reason: "NOT_FOUND";
                            lastSignInAt?: undefined;
                            mustChangePassword?: undefined;
                            passwordSetAt?: undefined;
                            suspended?: undefined;
                            linkedClinics?: undefined;
                            activeDevices?: undefined;
                        } | {
                            hasAccount: boolean;
                            phoneE164: null;
                            reason: "INVALID_PHONE";
                            lastSignInAt?: undefined;
                            mustChangePassword?: undefined;
                            passwordSetAt?: undefined;
                            suspended?: undefined;
                            linkedClinics?: undefined;
                            activeDevices?: undefined;
                        } | {
                            hasAccount: boolean;
                            phoneE164: string;
                            lastSignInAt: Date | null;
                            mustChangePassword: boolean | null;
                            passwordSetAt: Date | null;
                            suspended: boolean;
                            linkedClinics: number;
                            activeDevices: number;
                            reason?: undefined;
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
        };
    };
} & {
    owners: {
        ":id": {
            portal: {
                password: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                password: string;
                                phoneE164: string;
                                ownerName: string;
                                created: boolean;
                                linkedClinics: number;
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
                                readonly message: "وليّ الأمر غير موجود";
                            };
                            422: {
                                readonly message: "رقم جوال وليّ الأمر غير صالح أو مكرّر — صحّحه قبل إنشاء حساب التطبيق.";
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
    owners: {
        post: {
            body: {
                address?: string | null | undefined;
                city?: string | null | undefined;
                gender?: "MALE" | "FEMALE" | "UNKNOWN" | undefined;
                country?: string | null | undefined;
                notes?: string | null | undefined;
                active?: boolean | undefined;
                ownerType?: "ALL" | "VIP" | "LOYALTY" | "NEW" | "CURRENT" | undefined;
                relationship?: "OWNER" | "GUARDIAN" | "DELEGATE" | "EMERGENCY" | null | undefined;
                patientIds?: string[] | undefined;
                name: string;
                email: string;
                phone: string;
            };
            params: {};
            query: {};
            headers: {};
            response: {
                201: {
                    name: string;
                    address: string | null;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string | null;
                    phone: string;
                    city: string | null;
                    code: string;
                    patients: {
                        animalType: {
                            arName: string;
                            enName: string;
                        };
                        id: string;
                    }[];
                    gender: import("./owners.type").Gender | null;
                    country: string | null;
                    notes: string | null;
                    active: boolean;
                    editsCount: number;
                    ownerType: import("./owners.type").OwnerType;
                    relationship: import("./owners.type").OwnerRelationship | null;
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
    owners: {
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
                        name: string;
                        address: string | null;
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string | null;
                        phone: string;
                        city: string | null;
                        code: string;
                        patients: {
                            animalType: {
                                arName: string;
                                enName: string;
                            };
                            id: string;
                        }[];
                        gender: import("./owners.type").Gender | null;
                        country: string | null;
                        notes: string | null;
                        active: boolean;
                        editsCount: number;
                        ownerType: import("./owners.type").OwnerType;
                        relationship: import("./owners.type").OwnerRelationship | null;
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
                        readonly message: "وليّ الأمر غير موجود";
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
    owners: {
        ":id": {
            patch: {
                body: {
                    name?: string | undefined;
                    address?: string | null | undefined;
                    email?: string | undefined;
                    phone?: string | undefined;
                    city?: string | null | undefined;
                    gender?: "MALE" | "FEMALE" | "UNKNOWN" | null | undefined;
                    country?: string | null | undefined;
                    notes?: string | null | undefined;
                    active?: boolean | undefined;
                    ownerType?: "ALL" | "VIP" | "LOYALTY" | "NEW" | "CURRENT" | undefined;
                    relationship?: "OWNER" | "GUARDIAN" | "DELEGATE" | "EMERGENCY" | null | undefined;
                    patientIds?: string[] | undefined;
                };
                params: {
                    id: string;
                };
                query: {};
                headers: {};
                response: {
                    200: {
                        name: string;
                        address: string | null;
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string | null;
                        phone: string;
                        city: string | null;
                        code: string;
                        patients: {
                            animalType: {
                                arName: string;
                                enName: string;
                            };
                            id: string;
                        }[];
                        gender: import("./owners.type").Gender | null;
                        country: string | null;
                        notes: string | null;
                        active: boolean;
                        editsCount: number;
                        ownerType: import("./owners.type").OwnerType;
                        relationship: import("./owners.type").OwnerRelationship | null;
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
                        readonly message: "وليّ الأمر غير موجود";
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
    owners: {
        ":id": {
            disable: {
                post: {
                    body: {
                        newOwnerId?: string | undefined;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            name: string;
                            address: string | null;
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            email: string | null;
                            phone: string;
                            city: string | null;
                            code: string;
                            patients: {
                                animalType: {
                                    arName: string;
                                    enName: string;
                                };
                                id: string;
                            }[];
                            gender: import("./owners.type").Gender | null;
                            country: string | null;
                            notes: string | null;
                            active: boolean;
                            editsCount: number;
                            ownerType: import("./owners.type").OwnerType;
                            relationship: import("./owners.type").OwnerRelationship | null;
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
                            readonly message: "وليّ الأمر غير موجود";
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
    owners: {
        ":id": {
            delete: {
                body: {
                    newOwnerId?: string | undefined;
                };
                params: {
                    id: string;
                };
                query: {};
                headers: {};
                response: {
                    200: {
                        success: boolean;
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
                        readonly message: "وليّ الأمر غير موجود";
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
