import { type AiShiftOptions, type AiShiftPlan, type ShiftType } from "@/server/shifts/shifts.type";
export type AiShiftContext = {
    days: string[];
    staff: {
        id: string;
        name: string;
        role: string | null;
    }[];
    existing: {
        staffId: string;
        date: string;
        type: ShiftType;
    }[];
    leaves: {
        staffId: string;
        from: string;
        to: string;
    }[];
};
export declare function generateShiftPlan(ctx: AiShiftContext, options?: AiShiftOptions): Promise<AiShiftPlan>;
