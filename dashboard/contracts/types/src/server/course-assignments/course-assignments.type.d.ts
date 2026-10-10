import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
export { AssignmentSource, AssignmentStatus, AutoAssignEntity, } from "@/generated/prisma/enums";
export declare const assignLearnersSchema: z.ZodObject<{
    courseId: z.ZodString;
    staffIds: z.ZodArray<z.ZodString>;
    source: z.ZodOptional<z.ZodEnum<{
        readonly MANUAL: "MANUAL";
        readonly AUTO: "AUTO";
        readonly ENROLL_ALL: "ENROLL_ALL";
    }>>;
}, z.core.$strip>;
export type AssignLearnersFormInput = z.infer<typeof assignLearnersSchema>;
export declare const assignTimeSchema: z.ZodObject<{
    startDate: z.ZodOptional<z.ZodString>;
    dueDate: z.ZodOptional<z.ZodString>;
    timezone: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AssignTimeFormInput = z.infer<typeof assignTimeSchema>;
export declare const autoAssignRuleSchema: z.ZodObject<{
    entityType: z.ZodEnum<{
        readonly BRANCH: "BRANCH";
        readonly ROLE: "ROLE";
        readonly SPECIALIZATION: "SPECIALIZATION";
    }>;
    entityId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type AutoAssignRuleFormInput = z.infer<typeof autoAssignRuleSchema>;
export declare const saveAutoAssignRulesSchema: z.ZodObject<{
    courseId: z.ZodString;
    rules: z.ZodArray<z.ZodObject<{
        entityType: z.ZodEnum<{
            readonly BRANCH: "BRANCH";
            readonly ROLE: "ROLE";
            readonly SPECIALIZATION: "SPECIALIZATION";
        }>;
        entityId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type SaveAutoAssignRulesFormInput = z.infer<typeof saveAutoAssignRulesSchema>;
export type CreateAssignmentInput = Pick<Prisma.CourseAssignmentUncheckedCreateInput, "clinicId" | "courseId" | "staffId"> & Partial<Pick<Prisma.CourseAssignmentUncheckedCreateInput, "source" | "startDate" | "dueDate" | "cycle">>;
declare const learnerStaffSelect: {
    readonly id: true;
    readonly name: true;
    readonly code: true;
    readonly avatar: true;
    readonly branch: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly role: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly primarySpecialization: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly secondarySpecialization: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
declare const assignmentSelect: {
    readonly id: true;
    readonly code: true;
    readonly courseId: true;
    readonly staffId: true;
    readonly cycle: true;
    readonly source: true;
    readonly status: true;
    readonly progress: true;
    readonly assignedAt: true;
    readonly startedAt: true;
    readonly completedAt: true;
    readonly startDate: true;
    readonly dueDate: true;
    readonly staff: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly code: true;
            readonly avatar: true;
            readonly branch: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
            readonly role: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
            readonly primarySpecialization: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
            readonly secondarySpecialization: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
    };
};
declare const autoAssignRuleSelect: {
    readonly id: true;
    readonly courseId: true;
    readonly entityType: true;
    readonly entityId: true;
};
export type LearnerStaffResponse = Prisma.StaffGetPayload<{
    select: typeof learnerStaffSelect;
}>;
export type AssignmentResponse = Prisma.CourseAssignmentGetPayload<{
    select: typeof assignmentSelect;
}>;
export type AutoAssignRuleResponse = Prisma.CourseAutoAssignRuleGetPayload<{
    select: typeof autoAssignRuleSelect;
}>;
export type EligibleLearnerResponse = LearnerStaffResponse & {
    assigned: boolean;
};
export declare const assignmentSelects: {
    learnerStaffSelect: {
        readonly id: true;
        readonly name: true;
        readonly code: true;
        readonly avatar: true;
        readonly branch: {
            readonly select: {
                readonly id: true;
                readonly name: true;
            };
        };
        readonly role: {
            readonly select: {
                readonly id: true;
                readonly name: true;
            };
        };
        readonly primarySpecialization: {
            readonly select: {
                readonly id: true;
                readonly name: true;
            };
        };
        readonly secondarySpecialization: {
            readonly select: {
                readonly id: true;
                readonly name: true;
            };
        };
    };
    assignmentSelect: {
        readonly id: true;
        readonly code: true;
        readonly courseId: true;
        readonly staffId: true;
        readonly cycle: true;
        readonly source: true;
        readonly status: true;
        readonly progress: true;
        readonly assignedAt: true;
        readonly startedAt: true;
        readonly completedAt: true;
        readonly startDate: true;
        readonly dueDate: true;
        readonly staff: {
            readonly select: {
                readonly id: true;
                readonly name: true;
                readonly code: true;
                readonly avatar: true;
                readonly branch: {
                    readonly select: {
                        readonly id: true;
                        readonly name: true;
                    };
                };
                readonly role: {
                    readonly select: {
                        readonly id: true;
                        readonly name: true;
                    };
                };
                readonly primarySpecialization: {
                    readonly select: {
                        readonly id: true;
                        readonly name: true;
                    };
                };
                readonly secondarySpecialization: {
                    readonly select: {
                        readonly id: true;
                        readonly name: true;
                    };
                };
            };
        };
    };
    autoAssignRuleSelect: {
        readonly id: true;
        readonly courseId: true;
        readonly entityType: true;
        readonly entityId: true;
    };
};
