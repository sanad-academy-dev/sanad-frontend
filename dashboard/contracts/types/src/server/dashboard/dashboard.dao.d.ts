import type { DashboardAppointmentKpisResponse, DashboardDayCount, DashboardDistributionDatum, DashboardDistributionResponse, DashboardStaffWorkloadDatum, DashboardStatsResponse, DashboardUpcomingAppointment, DashboardVolumeResponse, DashboardWeeklyCaseDatum } from "@/server/dashboard/dashboard.type";
export declare const dashboardDao: {
    getStats(clinicId: string): Promise<DashboardStatsResponse>;
    getWeeklyCases(clinicId: string): Promise<DashboardWeeklyCaseDatum[]>;
    getPatientDistribution(clinicId: string): Promise<DashboardDistributionDatum[]>;
    getServiceDistribution(clinicId: string): Promise<DashboardDistributionDatum[]>;
    getDistribution(clinicId: string): Promise<DashboardDistributionResponse>;
    getVolume(clinicId: string, range?: {
        from: Date;
        to: Date;
    }): Promise<DashboardVolumeResponse>;
    getDayCounts(clinicId: string, range: {
        from: Date;
        to: Date;
    }, tzOffsetMinutes?: number): Promise<DashboardDayCount[]>;
    getUpcoming(clinicId: string, limit?: number): Promise<DashboardUpcomingAppointment[]>;
    getStaffWorkload(clinicId: string): Promise<DashboardStaffWorkloadDatum[]>;
    getAppointmentKpis(clinicId: string): Promise<DashboardAppointmentKpisResponse>;
};
