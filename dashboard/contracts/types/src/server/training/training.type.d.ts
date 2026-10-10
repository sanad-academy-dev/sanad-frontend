import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { CourseLanguage, CourseType, LessonType } from "@/generated/prisma/enums";
export { AssignmentSource, AssignmentStatus, AutoAssignEntity, ContentStatus, CourseContentType, CourseLanguage, CourseLocationMode, CourseOrderMode, CoursePriority, CourseStatus, CourseType, LessonMediaSource, LessonType, ReEnrollMode, } from "@/generated/prisma/enums";
export declare const createCourseSchema: z.ZodObject<{
    name: z.ZodString;
    targetRoleId: z.ZodString;
    type: z.ZodEnum<{
        readonly INTERNAL: "INTERNAL";
        readonly WORKSHOP: "WORKSHOP";
        readonly ONLINE: "ONLINE";
        readonly CERTIFICATION: "CERTIFICATION";
        readonly CONFERENCE: "CONFERENCE";
    }>;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodEnum<{
        readonly URGENT: "URGENT";
        readonly NORMAL: "NORMAL";
    }>>;
    estimatedDurationWeeks: z.ZodOptional<z.ZodNumber>;
    language: z.ZodOptional<z.ZodEnum<{
        readonly AR: "AR";
        readonly EN: "EN";
    }>>;
    department: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateCourseFormInput = z.infer<typeof createCourseSchema>;
export declare const completionSettingsSchema: z.ZodObject<{
    certificateEnabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    certReferencePattern: z.ZodOptional<z.ZodString>;
    certValidityDays: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    certSignatureName: z.ZodOptional<z.ZodString>;
    certPassMark: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    reEnrollMode: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        readonly NONE: "NONE";
        readonly AFTER_COMPLETION: "AFTER_COMPLETION";
        readonly BEFORE_EXPIRY: "BEFORE_EXPIRY";
    }>>>;
    reEnrollDays: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    gamificationPoints: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    reviewEnabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type CompletionSettingsFormInput = z.infer<typeof completionSettingsSchema>;
export declare const createLevelSchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
export type CreateLevelFormInput = z.infer<typeof createLevelSchema>;
export declare const MEDIA_LESSON_TYPES: LessonType[];
export declare const REQUIRE_LESSON_MEDIA = false;
export declare const QUIZ_ANSWER_TYPES: readonly ["SINGLE", "MULTIPLE", "TEXT"];
export type QuizAnswerType = (typeof QUIZ_ANSWER_TYPES)[number];
export declare const quizOptionSchema: z.ZodObject<{
    text: z.ZodString;
    correct: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export declare const quizQuestionSchema: z.ZodObject<{
    text: z.ZodString;
    answerType: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        TEXT: "TEXT";
        MULTIPLE: "MULTIPLE";
        SINGLE: "SINGLE";
    }>>>;
    options: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        text: z.ZodString;
        correct: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$strip>>>>;
    answerText: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const quizContentSchema: z.ZodObject<{
    questions: z.ZodArray<z.ZodObject<{
        text: z.ZodString;
        answerType: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            TEXT: "TEXT";
            MULTIPLE: "MULTIPLE";
            SINGLE: "SINGLE";
        }>>>;
        options: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
            text: z.ZodString;
            correct: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        }, z.core.$strip>>>>;
        answerText: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type QuizContent = z.infer<typeof quizContentSchema>;
export type QuizQuestionInput = z.input<typeof quizQuestionSchema>;
export declare function parseQuizContent(content: string | null | undefined): QuizContent["questions"];
export declare const createLessonSchema: z.ZodObject<{
    title: z.ZodString;
    type: z.ZodEnum<{
        readonly TEXT: "TEXT";
        readonly VIDEO: "VIDEO";
        readonly DOCUMENT: "DOCUMENT";
        readonly QUIZ: "QUIZ";
        readonly SURVEY: "SURVEY";
        readonly AUDIO: "AUDIO";
    }>;
    description: z.ZodOptional<z.ZodString>;
    mediaSource: z.ZodOptional<z.ZodEnum<{
        readonly DEVICE: "DEVICE";
        readonly URL: "URL";
    }>>;
    mediaKey: z.ZodOptional<z.ZodString>;
    mediaUrl: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    hours: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    minutes: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    seconds: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    questions: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        text: z.ZodString;
        answerType: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            TEXT: "TEXT";
            MULTIPLE: "MULTIPLE";
            SINGLE: "SINGLE";
        }>>>;
        options: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
            text: z.ZodString;
            correct: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        }, z.core.$strip>>>>;
        answerText: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>>>>;
}, z.core.$strip>;
export type CreateLessonFormInput = z.input<typeof createLessonSchema>;
export type LessonFormValues = z.output<typeof createLessonSchema>;
export declare const createUnitSchema: z.ZodObject<{
    title: z.ZodString;
}, z.core.$strip>;
export type CreateUnitFormInput = z.infer<typeof createUnitSchema>;
type CourseMetaFields = Partial<Pick<Prisma.CourseUncheckedCreateInput, "description" | "coverKey" | "status" | "targetRoleId" | "category" | "priority" | "estimatedDurationWeeks" | "language" | "orderMode" | "startDate" | "dueDate" | "timezone" | "trainingCost" | "institution" | "locationMode">>;
export type CreateCourseInput = Pick<Prisma.CourseUncheckedCreateInput, "clinicId" | "name" | "type"> & Partial<Pick<Prisma.CourseUncheckedCreateInput, "department">> & CourseMetaFields;
export type UpdateCourseInput = Partial<Pick<Prisma.CourseUncheckedCreateInput, "name" | "department" | "type">> & CourseMetaFields;
export type CreateLevelInput = Pick<Prisma.CourseLevelUncheckedCreateInput, "courseId" | "name">;
export type CreateUnitInput = Pick<Prisma.CourseUnitUncheckedCreateInput, "courseId" | "title"> & Partial<Pick<Prisma.CourseUnitUncheckedCreateInput, "levelId" | "contentType" | "status">> & {
    lessons?: RestoredLessonInput[];
};
export type UpdateUnitInput = Partial<Pick<Prisma.CourseUnitUncheckedCreateInput, "title" | "levelId" | "contentType" | "status">>;
export type ReorderContentInput = {
    unitId: string;
    levelId: string | null;
    position: number;
};
export type CompletionSettingsInput = Partial<Omit<Prisma.CourseCompletionSettingsUncheckedCreateInput, "id" | "courseId" | "createdAt" | "updatedAt">>;
export type RestoredLessonInput = Pick<Prisma.CourseLessonUncheckedCreateInput, "title"> & Required<Pick<Prisma.CourseLessonUncheckedCreateInput, "type">> & LessonOptionalFields;
type LessonOptionalFields = Partial<Pick<Prisma.CourseLessonUncheckedCreateInput, "description" | "mediaSource" | "mediaKey" | "mediaUrl" | "durationSeconds" | "content">>;
export type CreateLessonInput = Pick<Prisma.CourseLessonUncheckedCreateInput, "unitId" | "title"> & Partial<Pick<Prisma.CourseLessonUncheckedCreateInput, "type">> & LessonOptionalFields;
export type CreateLessonPayload = Pick<Prisma.CourseLessonUncheckedCreateInput, "unitId" | "title"> & Required<Pick<Prisma.CourseLessonUncheckedCreateInput, "type">> & LessonOptionalFields;
export type UpdateLessonInput = Partial<Omit<CreateLessonInput, "unitId">>;
export type UpdateLessonPayload = Partial<Omit<CreateLessonPayload, "unitId">>;
declare const lessonSelect: {
    readonly id: true;
    readonly unitId: true;
    readonly title: true;
    readonly type: true;
    readonly order: true;
    readonly description: true;
    readonly mediaSource: true;
    readonly mediaKey: true;
    readonly mediaUrl: true;
    readonly durationSeconds: true;
    readonly content: true;
    readonly editsCount: true;
    readonly createdAt: true;
};
declare const unitSelect: {
    readonly id: true;
    readonly courseId: true;
    readonly levelId: true;
    readonly title: true;
    readonly contentType: true;
    readonly status: true;
    readonly order: true;
    readonly updatedAt: true;
    readonly lessons: {
        readonly select: {
            readonly id: true;
            readonly unitId: true;
            readonly title: true;
            readonly type: true;
            readonly order: true;
            readonly description: true;
            readonly mediaSource: true;
            readonly mediaKey: true;
            readonly mediaUrl: true;
            readonly durationSeconds: true;
            readonly content: true;
            readonly editsCount: true;
            readonly createdAt: true;
        };
    };
};
declare const levelSelect: {
    readonly id: true;
    readonly courseId: true;
    readonly name: true;
    readonly order: true;
};
declare const courseSelect: {
    readonly id: true;
    readonly code: true;
    readonly name: true;
    readonly department: true;
    readonly targetRoleId: true;
    readonly type: true;
    readonly description: true;
    readonly coverKey: true;
    readonly status: true;
    readonly category: true;
    readonly priority: true;
    readonly estimatedDurationWeeks: true;
    readonly language: true;
    readonly orderMode: true;
    readonly startDate: true;
    readonly dueDate: true;
    readonly timezone: true;
    readonly trainingCost: true;
    readonly institution: true;
    readonly locationMode: true;
    readonly editsCount: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly targetRole: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
declare const completionSettingsSelect: {
    readonly id: true;
    readonly courseId: true;
    readonly certificateEnabled: true;
    readonly certReferencePattern: true;
    readonly certValidityDays: true;
    readonly certSignatureName: true;
    readonly certPassMark: true;
    readonly reEnrollMode: true;
    readonly reEnrollDays: true;
    readonly gamificationPoints: true;
    readonly reviewEnabled: true;
};
export type LessonResponse = Prisma.CourseLessonGetPayload<{
    select: typeof lessonSelect;
}>;
export type UnitResponse = Prisma.CourseUnitGetPayload<{
    select: typeof unitSelect;
}>;
export type LevelResponse = Prisma.CourseLevelGetPayload<{
    select: typeof levelSelect;
}>;
export type CourseResponse = Prisma.CourseGetPayload<{
    select: typeof courseSelect;
}>;
export type CompletionSettingsResponse = Prisma.CourseCompletionSettingsGetPayload<{
    select: typeof completionSettingsSelect;
}>;
export type CourseDetailResponse = Prisma.CourseGetPayload<{
    select: typeof courseSelect & {
        units: {
            select: typeof unitSelect;
        };
        levels: {
            select: typeof levelSelect;
        };
        completionSettings: {
            select: typeof completionSettingsSelect;
        };
        trainers: {
            select: {
                staffId: true;
                staff: {
                    select: {
                        name: true;
                    };
                };
            };
        };
    };
}>;
export type CourseAssigneePreview = {
    id: string;
    name: string;
    avatar: string | null;
};
export type CourseListItemResponse = CourseResponse & {
    contentCount: number;
    assignedCount: number;
    completionPct: number;
    assignees: CourseAssigneePreview[];
    trainers: CourseAssigneePreview[];
    avgRating: number | null;
    reviewCount: number;
};
export type CourseStatsResponse = {
    totalCourses: number;
    assignedStaff: number;
    completedAssignments: number;
    inProgressAssignments: number;
};
export declare const setTrainersSchema: z.ZodObject<{
    staffIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type SetTrainersFormInput = z.infer<typeof setTrainersSchema>;
export declare const createReviewSchema: z.ZodObject<{
    rating: z.ZodCoercedNumber<unknown>;
    comment: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateReviewFormInput = z.infer<typeof createReviewSchema>;
export declare const trainingSelects: {
    lessonSelect: {
        readonly id: true;
        readonly unitId: true;
        readonly title: true;
        readonly type: true;
        readonly order: true;
        readonly description: true;
        readonly mediaSource: true;
        readonly mediaKey: true;
        readonly mediaUrl: true;
        readonly durationSeconds: true;
        readonly content: true;
        readonly editsCount: true;
        readonly createdAt: true;
    };
    unitSelect: {
        readonly id: true;
        readonly courseId: true;
        readonly levelId: true;
        readonly title: true;
        readonly contentType: true;
        readonly status: true;
        readonly order: true;
        readonly updatedAt: true;
        readonly lessons: {
            readonly select: {
                readonly id: true;
                readonly unitId: true;
                readonly title: true;
                readonly type: true;
                readonly order: true;
                readonly description: true;
                readonly mediaSource: true;
                readonly mediaKey: true;
                readonly mediaUrl: true;
                readonly durationSeconds: true;
                readonly content: true;
                readonly editsCount: true;
                readonly createdAt: true;
            };
        };
    };
    levelSelect: {
        readonly id: true;
        readonly courseId: true;
        readonly name: true;
        readonly order: true;
    };
    courseSelect: {
        readonly id: true;
        readonly code: true;
        readonly name: true;
        readonly department: true;
        readonly targetRoleId: true;
        readonly type: true;
        readonly description: true;
        readonly coverKey: true;
        readonly status: true;
        readonly category: true;
        readonly priority: true;
        readonly estimatedDurationWeeks: true;
        readonly language: true;
        readonly orderMode: true;
        readonly startDate: true;
        readonly dueDate: true;
        readonly timezone: true;
        readonly trainingCost: true;
        readonly institution: true;
        readonly locationMode: true;
        readonly editsCount: true;
        readonly createdAt: true;
        readonly updatedAt: true;
        readonly targetRole: {
            readonly select: {
                readonly id: true;
                readonly name: true;
            };
        };
    };
    completionSettingsSelect: {
        readonly id: true;
        readonly courseId: true;
        readonly certificateEnabled: true;
        readonly certReferencePattern: true;
        readonly certValidityDays: true;
        readonly certSignatureName: true;
        readonly certPassMark: true;
        readonly reEnrollMode: true;
        readonly reEnrollDays: true;
        readonly gamificationPoints: true;
        readonly reviewEnabled: true;
    };
};
export declare const aiAnswerSchema: z.ZodObject<{
    question: z.ZodString;
    answer: z.ZodString;
}, z.core.$strip>;
export declare const aiQuestionsResultSchema: z.ZodObject<{
    questions: z.ZodCatch<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type AiQuestionsResult = z.infer<typeof aiQuestionsResultSchema>;
export declare const AI_DIFFICULTY: readonly ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
export declare const AI_DEPTH: readonly ["BRIEF", "BALANCED", "DETAILED"];
export type AiGenerateOptions = {
    levelCount?: number;
    difficulty?: (typeof AI_DIFFICULTY)[number];
    language?: CourseLanguage;
    courseType?: CourseType;
    includeQuizzes?: boolean;
    depth?: (typeof AI_DEPTH)[number];
    suggestMedia?: boolean;
};
export declare const aiCourseSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodCatch<z.ZodString>;
    type: z.ZodCatch<z.ZodEnum<{
        readonly INTERNAL: "INTERNAL";
        readonly WORKSHOP: "WORKSHOP";
        readonly ONLINE: "ONLINE";
        readonly CERTIFICATION: "CERTIFICATION";
        readonly CONFERENCE: "CONFERENCE";
    }>>;
    category: z.ZodCatch<z.ZodString>;
    language: z.ZodCatch<z.ZodEnum<{
        readonly AR: "AR";
        readonly EN: "EN";
    }>>;
    estimatedDurationWeeks: z.ZodCatch<z.ZodCoercedNumber<unknown>>;
    levels: z.ZodCatch<z.ZodArray<z.ZodObject<{
        name: z.ZodCatch<z.ZodString>;
        units: z.ZodCatch<z.ZodArray<z.ZodObject<{
            title: z.ZodCatch<z.ZodString>;
            contentType: z.ZodCatch<z.ZodEnum<{
                readonly PAGE: "PAGE";
                readonly LESSON: "LESSON";
                readonly QUIZ: "QUIZ";
            }>>;
            lessons: z.ZodCatch<z.ZodArray<z.ZodObject<{
                title: z.ZodCatch<z.ZodString>;
                type: z.ZodCatch<z.ZodEnum<{
                    readonly TEXT: "TEXT";
                    readonly VIDEO: "VIDEO";
                    readonly DOCUMENT: "DOCUMENT";
                    readonly QUIZ: "QUIZ";
                    readonly SURVEY: "SURVEY";
                    readonly AUDIO: "AUDIO";
                }>>;
                content: z.ZodCatch<z.ZodString>;
                questions: z.ZodCatch<z.ZodArray<z.ZodObject<{
                    text: z.ZodCatch<z.ZodString>;
                    answerType: z.ZodCatch<z.ZodEnum<{
                        TEXT: "TEXT";
                        MULTIPLE: "MULTIPLE";
                        SINGLE: "SINGLE";
                    }>>;
                    options: z.ZodCatch<z.ZodArray<z.ZodObject<{
                        text: z.ZodCatch<z.ZodString>;
                        correct: z.ZodCatch<z.ZodBoolean>;
                    }, z.core.$strip>>>;
                    answerText: z.ZodCatch<z.ZodString>;
                }, z.core.$strip>>>;
                resources: z.ZodCatch<z.ZodArray<z.ZodObject<{
                    title: z.ZodCatch<z.ZodString>;
                    url: z.ZodCatch<z.ZodString>;
                }, z.core.$strip>>>;
            }, z.core.$strip>>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type AiCoursePreview = z.infer<typeof aiCourseSchema>;
export type AiCourseLevel = AiCoursePreview["levels"][number];
export type AiCourseUnit = AiCourseLevel["units"][number];
