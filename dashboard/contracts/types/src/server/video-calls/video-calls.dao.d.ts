import type { AppointmentQuestionnaireResponse } from "@/server/video-calls/video-calls.type";
export declare const videoCallsDao: {
    findAppointmentByRoom(room: string): Promise<{
        id: string;
        status: import("@/generated/prisma/client").AppointmentStatus;
        location: import("@/generated/prisma/client").AppointmentLocation;
    } | null>;
    getQuestionnaire(appointmentId: string): Promise<AppointmentQuestionnaireResponse | null>;
    saveQuestionnaire(appointmentId: string, answers: Record<string, boolean>): Promise<AppointmentQuestionnaireResponse>;
    completePayment(appointmentId: string): Promise<void>;
};
