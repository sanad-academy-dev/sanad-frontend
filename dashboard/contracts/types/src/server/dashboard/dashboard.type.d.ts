import type { Prisma } from "@/generated/prisma/client";
export type DashboardStatsResponse = {
    clientsToday: number;
    patientsTotal: number;
    appointmentsToday: number;
    staffTotal: number;
    servicesTotal: number;
};
export type DashboardChartDatum = {
    month: string;
    revenue: number;
};
export type DashboardWeeklyCaseDatum = {
    day: string;
    newCases: number;
    followUps: number;
};
export type DashboardDistributionDatum = {
    key: string;
    label: string;
    value: number;
    fill: string;
};
export type DashboardDistributionResponse = {
    patients: DashboardDistributionDatum[];
    services: DashboardDistributionDatum[];
};
export type DashboardVolumeCell = {
    /** 0 (Sunday) … 6 (Saturday) */
    day: number;
    /** Hour of day, 0–23 */
    hour: number;
    count: number;
};
export type DashboardBusyTime = {
    /** 0 (Sunday) … 6 (Saturday) */
    day: number;
    /** Hour of day, 0–23 */
    hour: number;
    count: number;
};
export type DashboardVolumeResponse = {
    cells: DashboardVolumeCell[];
    /** Highest single-cell count in the window — used to scale the color ramp. */
    max: number;
    /** Top busiest hour slots, already sorted by count desc. */
    busiest: DashboardBusyTime[];
};
export type DashboardDayCount = {
    /** YYYY-MM-DD بتوقيت العميل */
    date: string;
    /** جلسات حضر فيها الطفل فعليًا (من تسجيل الوصول فصاعدًا) */
    visits: number;
    /** جلسات محجوزة لم يصل صاحبها بعد */
    scheduled: number;
};
export type DashboardUpcomingAppointment = Prisma.AppointmentGetPayload<{
    select: {
        id: true;
        startsAt: true;
        durationMinutes: true;
        status: true;
        patient: {
            select: {
                name: true;
                animalType: {
                    select: {
                        enName: true;
                    };
                };
            };
        };
        services: {
            select: {
                service: {
                    select: {
                        name: true;
                    };
                };
            };
        };
    };
}>;
export type DashboardStaffWorkloadDatum = {
    staffId: string;
    name: string;
    roleName: string;
    avatar: string | null;
    /** Appointments booked for today. */
    booked: number;
    /** Capacity (target appointments) for the day. */
    capacity: number;
};
export type DashboardAppointmentKpi = {
    value: number;
    /** Percentage change vs. the previous equivalent period. `null` when no baseline. */
    deltaPct: number | null;
};
export type DashboardAppointmentKpisResponse = {
    total: DashboardAppointmentKpi;
    inProgress: DashboardAppointmentKpi;
    completed: DashboardAppointmentKpi;
    paid: DashboardAppointmentKpi;
};
