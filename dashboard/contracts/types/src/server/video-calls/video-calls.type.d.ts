import type { Prisma } from "@/generated/prisma/client";
export type VideoCallTokenResponse = {
    token: string;
    serverUrl: string;
    roomName: string;
};
export type AppointmentQuestionnaireResponse = Prisma.AppointmentQuestionnaireGetPayload<{
    select: {
        answers: true;
        completedAt: true;
    };
}>;
export type QuestionnaireAnswers = Record<string, boolean>;
