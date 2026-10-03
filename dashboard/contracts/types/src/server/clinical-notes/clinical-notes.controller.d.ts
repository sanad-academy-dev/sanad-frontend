import Elysia from "elysia";
export declare const clinicalNotesController: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "clinicalNotes.create": import("@sinclair/typebox").TObject<{
            patientId: import("@sinclair/typebox").TString;
            appointmentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            templateId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            vitalsRecordId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            answers: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TUnknown>>;
            diagnoses: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                text: import("@sinclair/typebox").TString;
                kind: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DIFFERENTIAL">, import("@sinclair/typebox").TLiteral<"WORKING">, import("@sinclair/typebox").TLiteral<"FINAL">]>;
                severity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MILD">, import("@sinclair/typebox").TLiteral<"MODERATE">, import("@sinclair/typebox").TLiteral<"SEVERE">, import("@sinclair/typebox").TLiteral<"CRITICAL">]>]>>;
                code: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                codeSystem: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            }>>>;
        }>;
        readonly "clinicalNotes.update": import("@sinclair/typebox").TObject<{
            answers: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TUnknown>>;
            vitalsRecordId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            diagnoses: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                text: import("@sinclair/typebox").TString;
                kind: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DIFFERENTIAL">, import("@sinclair/typebox").TLiteral<"WORKING">, import("@sinclair/typebox").TLiteral<"FINAL">]>;
                severity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MILD">, import("@sinclair/typebox").TLiteral<"MODERATE">, import("@sinclair/typebox").TLiteral<"SEVERE">, import("@sinclair/typebox").TLiteral<"CRITICAL">]>]>>;
                code: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                codeSystem: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            }>>>;
        }>;
        readonly "clinicalNotes.addendum": import("@sinclair/typebox").TObject<{
            text: import("@sinclair/typebox").TString;
        }>;
        readonly "clinicalNotes.upsertTemplate": import("@sinclair/typebox").TObject<{
            key: import("@sinclair/typebox").TString;
            titleAr: import("@sinclair/typebox").TString;
            titleEn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            presentingComplaint: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            animalTypeId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            blocks: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnknown>;
            isDefault: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
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
    "exam-templates": {
        get: {
            body: {};
            params: {};
            query: {};
            headers: {};
            response: {
                200: {
                    version: number;
                    key: string;
                    id: string;
                    clinicId: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    _count: {
                        notes: number;
                    };
                    isDefault: boolean;
                    active: boolean;
                    animalTypeId: string | null;
                    presentingComplaint: string | null;
                    blocks: import("@prisma/client/runtime/client").JsonValue;
                    titleAr: string;
                    titleEn: string | null;
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
    "exam-templates": {
        resolve: {
            get: {
                body: {};
                params: {};
                query: {
                    animalTypeId?: string | undefined;
                    consultationTypeId?: string | undefined;
                    complaint?: string | undefined;
                };
                headers: {};
                response: {
                    200: {
                        version: number;
                        key: string;
                        id: string;
                        clinicId: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                        _count: {
                            notes: number;
                        };
                        isDefault: boolean;
                        active: boolean;
                        animalTypeId: string | null;
                        presentingComplaint: string | null;
                        blocks: import("@prisma/client/runtime/client").JsonValue;
                        titleAr: string;
                        titleEn: string | null;
                    } | null;
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
} & {
    "exam-templates": {
        post: {
            body: {
                isDefault?: boolean | undefined;
                active?: boolean | undefined;
                animalTypeId?: string | null | undefined;
                presentingComplaint?: string | null | undefined;
                titleEn?: string | null | undefined;
                key: string;
                blocks: unknown[];
                titleAr: string;
            };
            params: {};
            query: {};
            headers: {};
            response: {
                200: {
                    version: number;
                    key: string;
                    id: string;
                    clinicId: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    _count: {
                        notes: number;
                    };
                    isDefault: boolean;
                    active: boolean;
                    animalTypeId: string | null;
                    presentingComplaint: string | null;
                    blocks: import("@prisma/client/runtime/client").JsonValue;
                    titleAr: string;
                    titleEn: string | null;
                };
                400: {
                    readonly message: string;
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
            "clinical-notes": {
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
                            createdAt: Date;
                            updatedAt: Date;
                            templateId: string | null;
                            plan: string | null;
                            status: import("@/server/clinical-notes/clinical-notes.type").ClinicalNoteStatus;
                            appointmentId: string | null;
                            patientId: string;
                            authorUserId: string;
                            author: {
                                name: string;
                                id: string;
                            };
                            template: {
                                version: number;
                                key: string;
                                id: string;
                                blocks: import("@prisma/client/runtime/client").JsonValue;
                            } | null;
                            vitalsRecordId: string | null;
                            answers: import("@prisma/client/runtime/client").JsonValue;
                            diagnoses: {
                                text: string;
                                id: string;
                                code: string | null;
                                idx: number;
                                kind: import("@/server/clinical-notes/clinical-notes.type").DiagnosisKind;
                                severity: import("@/server/clinical-notes/clinical-notes.type").DiagnosisSeverity | null;
                                codeSystem: string | null;
                            }[];
                            templateKey: string | null;
                            templateVersion: number | null;
                            subjective: string | null;
                            objective: string | null;
                            assessment: string | null;
                            finalizedAt: Date | null;
                            finalizedById: string | null;
                            finalizedBy: {
                                name: string;
                                id: string;
                            } | null;
                            addenda: {
                                text: string;
                                id: string;
                                createdAt: Date;
                                authoredById: string | null;
                                authoredBy: {
                                    name: string;
                                    id: string;
                                } | null;
                            }[];
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
        };
    };
} & {
    appointments: {
        ":id": {
            "clinical-notes": {
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
                            createdAt: Date;
                            updatedAt: Date;
                            templateId: string | null;
                            plan: string | null;
                            status: import("@/server/clinical-notes/clinical-notes.type").ClinicalNoteStatus;
                            appointmentId: string | null;
                            patientId: string;
                            authorUserId: string;
                            author: {
                                name: string;
                                id: string;
                            };
                            template: {
                                version: number;
                                key: string;
                                id: string;
                                blocks: import("@prisma/client/runtime/client").JsonValue;
                            } | null;
                            vitalsRecordId: string | null;
                            answers: import("@prisma/client/runtime/client").JsonValue;
                            diagnoses: {
                                text: string;
                                id: string;
                                code: string | null;
                                idx: number;
                                kind: import("@/server/clinical-notes/clinical-notes.type").DiagnosisKind;
                                severity: import("@/server/clinical-notes/clinical-notes.type").DiagnosisSeverity | null;
                                codeSystem: string | null;
                            }[];
                            templateKey: string | null;
                            templateVersion: number | null;
                            subjective: string | null;
                            objective: string | null;
                            assessment: string | null;
                            finalizedAt: Date | null;
                            finalizedById: string | null;
                            finalizedBy: {
                                name: string;
                                id: string;
                            } | null;
                            addenda: {
                                text: string;
                                id: string;
                                createdAt: Date;
                                authoredById: string | null;
                                authoredBy: {
                                    name: string;
                                    id: string;
                                } | null;
                            }[];
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
        };
    };
} & {
    "clinical-notes": {
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
                        createdAt: Date;
                        updatedAt: Date;
                        templateId: string | null;
                        plan: string | null;
                        status: import("@/server/clinical-notes/clinical-notes.type").ClinicalNoteStatus;
                        appointmentId: string | null;
                        patientId: string;
                        authorUserId: string;
                        author: {
                            name: string;
                            id: string;
                        };
                        template: {
                            version: number;
                            key: string;
                            id: string;
                            blocks: import("@prisma/client/runtime/client").JsonValue;
                        } | null;
                        vitalsRecordId: string | null;
                        answers: import("@prisma/client/runtime/client").JsonValue;
                        diagnoses: {
                            text: string;
                            id: string;
                            code: string | null;
                            idx: number;
                            kind: import("@/server/clinical-notes/clinical-notes.type").DiagnosisKind;
                            severity: import("@/server/clinical-notes/clinical-notes.type").DiagnosisSeverity | null;
                            codeSystem: string | null;
                        }[];
                        templateKey: string | null;
                        templateVersion: number | null;
                        subjective: string | null;
                        objective: string | null;
                        assessment: string | null;
                        finalizedAt: Date | null;
                        finalizedById: string | null;
                        finalizedBy: {
                            name: string;
                            id: string;
                        } | null;
                        addenda: {
                            text: string;
                            id: string;
                            createdAt: Date;
                            authoredById: string | null;
                            authoredBy: {
                                name: string;
                                id: string;
                            } | null;
                        }[];
                    };
                    400: {
                        readonly message: string;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                    } | {
                        readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                    } | {
                        readonly message: string;
                    };
                    404: {
                        readonly message: string;
                    };
                    409: {
                        readonly message: string;
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
    "clinical-notes": {
        post: {
            body: {
                templateId?: string | null | undefined;
                appointmentId?: string | null | undefined;
                vitalsRecordId?: string | null | undefined;
                answers?: {} | undefined;
                diagnoses?: {
                    code?: string | null | undefined;
                    severity?: "MILD" | "MODERATE" | "SEVERE" | "CRITICAL" | null | undefined;
                    codeSystem?: string | null | undefined;
                    text: string;
                    kind: "DIFFERENTIAL" | "WORKING" | "FINAL";
                }[] | undefined;
                patientId: string;
            };
            params: {};
            query: {};
            headers: {};
            response: {
                200: {
                    id: string;
                    clinicId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    templateId: string | null;
                    plan: string | null;
                    status: import("@/server/clinical-notes/clinical-notes.type").ClinicalNoteStatus;
                    appointmentId: string | null;
                    patientId: string;
                    authorUserId: string;
                    author: {
                        name: string;
                        id: string;
                    };
                    template: {
                        version: number;
                        key: string;
                        id: string;
                        blocks: import("@prisma/client/runtime/client").JsonValue;
                    } | null;
                    vitalsRecordId: string | null;
                    answers: import("@prisma/client/runtime/client").JsonValue;
                    diagnoses: {
                        text: string;
                        id: string;
                        code: string | null;
                        idx: number;
                        kind: import("@/server/clinical-notes/clinical-notes.type").DiagnosisKind;
                        severity: import("@/server/clinical-notes/clinical-notes.type").DiagnosisSeverity | null;
                        codeSystem: string | null;
                    }[];
                    templateKey: string | null;
                    templateVersion: number | null;
                    subjective: string | null;
                    objective: string | null;
                    assessment: string | null;
                    finalizedAt: Date | null;
                    finalizedById: string | null;
                    finalizedBy: {
                        name: string;
                        id: string;
                    } | null;
                    addenda: {
                        text: string;
                        id: string;
                        createdAt: Date;
                        authoredById: string | null;
                        authoredBy: {
                            name: string;
                            id: string;
                        } | null;
                    }[];
                };
                400: {
                    readonly message: string;
                } | {
                    readonly message: string;
                };
                401: {
                    readonly message: "غير مصرح";
                };
                403: {
                    readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                } | {
                    readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                } | {
                    readonly message: string;
                };
                404: {
                    readonly message: string;
                };
                409: {
                    readonly message: string;
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
    "clinical-notes": {
        ":id": {
            patch: {
                body: {
                    vitalsRecordId?: string | null | undefined;
                    answers?: {} | undefined;
                    diagnoses?: {
                        code?: string | null | undefined;
                        severity?: "MILD" | "MODERATE" | "SEVERE" | "CRITICAL" | null | undefined;
                        codeSystem?: string | null | undefined;
                        text: string;
                        kind: "DIFFERENTIAL" | "WORKING" | "FINAL";
                    }[] | undefined;
                };
                params: {
                    id: string;
                };
                query: {};
                headers: {};
                response: {
                    200: {
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        templateId: string | null;
                        plan: string | null;
                        status: import("@/server/clinical-notes/clinical-notes.type").ClinicalNoteStatus;
                        appointmentId: string | null;
                        patientId: string;
                        authorUserId: string;
                        author: {
                            name: string;
                            id: string;
                        };
                        template: {
                            version: number;
                            key: string;
                            id: string;
                            blocks: import("@prisma/client/runtime/client").JsonValue;
                        } | null;
                        vitalsRecordId: string | null;
                        answers: import("@prisma/client/runtime/client").JsonValue;
                        diagnoses: {
                            text: string;
                            id: string;
                            code: string | null;
                            idx: number;
                            kind: import("@/server/clinical-notes/clinical-notes.type").DiagnosisKind;
                            severity: import("@/server/clinical-notes/clinical-notes.type").DiagnosisSeverity | null;
                            codeSystem: string | null;
                        }[];
                        templateKey: string | null;
                        templateVersion: number | null;
                        subjective: string | null;
                        objective: string | null;
                        assessment: string | null;
                        finalizedAt: Date | null;
                        finalizedById: string | null;
                        finalizedBy: {
                            name: string;
                            id: string;
                        } | null;
                        addenda: {
                            text: string;
                            id: string;
                            createdAt: Date;
                            authoredById: string | null;
                            authoredBy: {
                                name: string;
                                id: string;
                            } | null;
                        }[];
                    };
                    400: {
                        readonly message: string;
                    } | {
                        readonly message: string;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                    } | {
                        readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                    } | {
                        readonly message: string;
                    };
                    404: {
                        readonly message: string;
                    };
                    409: {
                        readonly message: string;
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
    "clinical-notes": {
        ":id": {
            finalize: {
                post: {
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
                            createdAt: Date;
                            updatedAt: Date;
                            templateId: string | null;
                            plan: string | null;
                            status: import("@/server/clinical-notes/clinical-notes.type").ClinicalNoteStatus;
                            appointmentId: string | null;
                            patientId: string;
                            authorUserId: string;
                            author: {
                                name: string;
                                id: string;
                            };
                            template: {
                                version: number;
                                key: string;
                                id: string;
                                blocks: import("@prisma/client/runtime/client").JsonValue;
                            } | null;
                            vitalsRecordId: string | null;
                            answers: import("@prisma/client/runtime/client").JsonValue;
                            diagnoses: {
                                text: string;
                                id: string;
                                code: string | null;
                                idx: number;
                                kind: import("@/server/clinical-notes/clinical-notes.type").DiagnosisKind;
                                severity: import("@/server/clinical-notes/clinical-notes.type").DiagnosisSeverity | null;
                                codeSystem: string | null;
                            }[];
                            templateKey: string | null;
                            templateVersion: number | null;
                            subjective: string | null;
                            objective: string | null;
                            assessment: string | null;
                            finalizedAt: Date | null;
                            finalizedById: string | null;
                            finalizedBy: {
                                name: string;
                                id: string;
                            } | null;
                            addenda: {
                                text: string;
                                id: string;
                                createdAt: Date;
                                authoredById: string | null;
                                authoredBy: {
                                    name: string;
                                    id: string;
                                } | null;
                            }[];
                        };
                        400: {
                            readonly message: string;
                        } | {
                            readonly message: `\u0644\u0627 \u064A\u0645\u0643\u0646 \u0627\u0644\u062A\u0648\u062B\u064A\u0642 \u2014 \u062D\u0642\u0648\u0644 \u0625\u0644\u0632\u0627\u0645\u064A\u0629 \u0646\u0627\u0642\u0635\u0629: ${string}`;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                        } | {
                            readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                        } | {
                            readonly message: string;
                        };
                        404: {
                            readonly message: string;
                        };
                        409: {
                            readonly message: string;
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
    "clinical-notes": {
        ":id": {
            addenda: {
                post: {
                    body: {
                        text: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            templateId: string | null;
                            plan: string | null;
                            status: import("@/server/clinical-notes/clinical-notes.type").ClinicalNoteStatus;
                            appointmentId: string | null;
                            patientId: string;
                            authorUserId: string;
                            author: {
                                name: string;
                                id: string;
                            };
                            template: {
                                version: number;
                                key: string;
                                id: string;
                                blocks: import("@prisma/client/runtime/client").JsonValue;
                            } | null;
                            vitalsRecordId: string | null;
                            answers: import("@prisma/client/runtime/client").JsonValue;
                            diagnoses: {
                                text: string;
                                id: string;
                                code: string | null;
                                idx: number;
                                kind: import("@/server/clinical-notes/clinical-notes.type").DiagnosisKind;
                                severity: import("@/server/clinical-notes/clinical-notes.type").DiagnosisSeverity | null;
                                codeSystem: string | null;
                            }[];
                            templateKey: string | null;
                            templateVersion: number | null;
                            subjective: string | null;
                            objective: string | null;
                            assessment: string | null;
                            finalizedAt: Date | null;
                            finalizedById: string | null;
                            finalizedBy: {
                                name: string;
                                id: string;
                            } | null;
                            addenda: {
                                text: string;
                                id: string;
                                createdAt: Date;
                                authoredById: string | null;
                                authoredBy: {
                                    name: string;
                                    id: string;
                                } | null;
                            }[];
                        };
                        400: {
                            readonly message: string;
                        } | {
                            readonly message: string;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                        } | {
                            readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                        } | {
                            readonly message: string;
                        };
                        404: {
                            readonly message: string;
                        };
                        409: {
                            readonly message: string;
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
