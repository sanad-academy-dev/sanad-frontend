import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { type LearnerStaffResponse } from "@/server/course-assignments/course-assignments.type";
export { AssignmentSource, AssignmentStatus } from "@/generated/prisma/enums";
export declare const assignQuizLearnersSchema: z.ZodObject<{
    quizId: z.ZodString;
    staffIds: z.ZodArray<z.ZodString>;
    source: z.ZodOptional<z.ZodEnum<{
        readonly MANUAL: "MANUAL";
        readonly AUTO: "AUTO";
        readonly ENROLL_ALL: "ENROLL_ALL";
    }>>;
    startDate: z.ZodOptional<z.ZodString>;
    dueDate: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AssignQuizLearnersFormInput = z.infer<typeof assignQuizLearnersSchema>;
export type CreateQuizAssignmentInput = Pick<Prisma.QuizAssignmentUncheckedCreateInput, "clinicId" | "quizId" | "staffId"> & Partial<Pick<Prisma.QuizAssignmentUncheckedCreateInput, "source" | "startDate" | "dueDate" | "cycle">>;
declare const quizAssignmentSelect: {
    readonly id: true;
    readonly code: true;
    readonly quizId: true;
    readonly staffId: true;
    readonly cycle: true;
    readonly source: true;
    readonly status: true;
    readonly assignedAt: true;
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
    readonly _count: {
        readonly select: {
            readonly attempts: true;
        };
    };
};
export type QuizAssignmentResponse = Prisma.QuizAssignmentGetPayload<{
    select: typeof quizAssignmentSelect;
}>;
export type EligibleQuizLearnerResponse = LearnerStaffResponse & {
    assigned: boolean;
};
export declare const quizAssignmentSelects: {
    quizAssignmentSelect: {
        readonly id: true;
        readonly code: true;
        readonly quizId: true;
        readonly staffId: true;
        readonly cycle: true;
        readonly source: true;
        readonly status: true;
        readonly assignedAt: true;
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
        readonly _count: {
            readonly select: {
                readonly attempts: true;
            };
        };
    };
};
