import type { Prisma } from "@/generated/prisma/client";
import type { MobileDispatchStage } from "@/generated/prisma/enums";
import { type AssignVisitFormInput, type MobileVisitResponse, type ServiceAddressFormInput, type ServiceAddressResponse, type StageChangeFormInput } from "@/server/mobile-clinics/mobile-visits/mobile-visits.type";
export declare const mobileVisitsDao: {
    addressesForOwner(clinicId: string, ownerId: string): Promise<ServiceAddressResponse[]>;
    createAddress(clinicId: string, ownerId: string | null, input: ServiceAddressFormInput): Promise<ServiceAddressResponse>;
    byId(id: string, clinicId: string): Promise<MobileVisitResponse | null>;
    byAppointment(appointmentId: string, clinicId: string): Promise<MobileVisitResponse | null>;
    /**
     * [MC4.3] تحويل زيارة قائمة إلى زيارة متنقلة، أو قراءتها إن كانت كذلك.
     *
     * الزيارة تبقى `Appointment`؛ هذا يُنشئ الامتداد ويضبط `location` في معاملة واحدة —
     * زيارةٌ موقعها MOBILE_CLINIC بلا امتداد سجلٌّ لا تعرف الشاشات كيف تعرضه.
     */
    attachToAppointment(clinicId: string, appointmentId: string, serviceAddressId: string): Promise<MobileVisitResponse>;
    /** [MC4.3] إسناد زيارة إلى مركبة (أو إعادة إسنادها). */
    assign(id: string, clinicId: string, userId: string | null, input: AssignVisitFormInput): Promise<MobileVisitResponse>;
    /** إلغاء الإسناد — تعود الزيارة إلى القائمة غير المسنَدة بلا فقدان عنوانها. */
    unassign(id: string, clinicId: string, userId: string | null): Promise<MobileVisitResponse>;
    /**
     * [MC4.3] تغيير المرحلة — القلب النابض للزيارة الميدانية.
     *
     * كل شيء في معاملة واحدة: المرحلة، وطوابعها الزمنية، وإثبات الوصول، وحالة الزيارة
     * الأمّ. الفصل بينها يُنتج زيارةً «وصلت» وحالتها «مجدولة» — وهو بالضبط التناقض الذي
     * وُجد `mobile-visit.workflow.ts` ليمنعه.
     */
    changeStage(id: string, clinicId: string, userId: string | null, input: StageChangeFormInput): Promise<MobileVisitResponse>;
    /** محطّات مركبة في يوم — يقرأها تطبيق المركبة ولوحة الإرسال. */
    listForUnit(clinicId: string, mobileUnitId: string, from: Date, to: Date): Prisma.PrismaPromise<{
        appointment: {
            staff: {
                name: string;
                id: string;
            };
            owner: {
                name: string;
                id: string;
                phone: string;
            };
            patient: {
                animalType: {
                    arName: string;
                };
                name: string;
                id: string;
            };
            id: string;
            code: string;
            reason: string | null;
            services: {
                service: {
                    name: string;
                };
                id: string;
            }[];
            status: import("@/generated/prisma/enums").AppointmentStatus;
            startsAt: Date;
            durationMinutes: number;
        };
        mobileUnit: {
            name: string;
            id: string;
            code: string;
            status: import("@/generated/prisma/enums").MobileUnitStatus;
        } | null;
        serviceAddress: {
            id: string;
            city: string | null;
            isDefault: boolean;
            label: string | null;
            district: string | null;
            lat: import("@prisma/client-runtime-utils").Decimal | null;
            lng: import("@prisma/client-runtime-utils").Decimal | null;
            landmark: string | null;
            line1: string;
            accessNotes: string | null;
        };
        id: string;
        appointmentId: string;
        arrivedAt: Date | null;
        mobileUnitId: string | null;
        shiftId: string | null;
        sequence: number | null;
        windowStart: Date | null;
        windowEnd: Date | null;
        etaAt: Date | null;
        dispatchStage: MobileDispatchStage;
        enRouteAt: Date | null;
        departedAt: Date | null;
        arrivalDriftM: number | null;
        distanceKm: import("@prisma/client-runtime-utils").Decimal | null;
        travelMinutes: number | null;
        travelFee: import("@prisma/client-runtime-utils").Decimal | null;
        failureReason: import("@/generated/prisma/enums").MobileVisitFailureReason | null;
        failureNote: string | null;
        trackingToken: string;
    }[]>;
    /** لوحة الإسناد: كل زيارات اليوم مع غير المسنَدة. */
    board(clinicId: string, from: Date, to: Date): Prisma.PrismaPromise<{
        appointment: {
            staff: {
                name: string;
                id: string;
            };
            owner: {
                name: string;
                id: string;
                phone: string;
            };
            patient: {
                animalType: {
                    arName: string;
                };
                name: string;
                id: string;
            };
            id: string;
            code: string;
            reason: string | null;
            services: {
                service: {
                    name: string;
                };
                id: string;
            }[];
            status: import("@/generated/prisma/enums").AppointmentStatus;
            startsAt: Date;
            durationMinutes: number;
        };
        mobileUnit: {
            name: string;
            id: string;
            code: string;
            status: import("@/generated/prisma/enums").MobileUnitStatus;
        } | null;
        serviceAddress: {
            id: string;
            city: string | null;
            isDefault: boolean;
            label: string | null;
            district: string | null;
            lat: import("@prisma/client-runtime-utils").Decimal | null;
            lng: import("@prisma/client-runtime-utils").Decimal | null;
            landmark: string | null;
            line1: string;
            accessNotes: string | null;
        };
        id: string;
        appointmentId: string;
        arrivedAt: Date | null;
        mobileUnitId: string | null;
        shiftId: string | null;
        sequence: number | null;
        windowStart: Date | null;
        windowEnd: Date | null;
        etaAt: Date | null;
        dispatchStage: MobileDispatchStage;
        enRouteAt: Date | null;
        departedAt: Date | null;
        arrivalDriftM: number | null;
        distanceKm: import("@prisma/client-runtime-utils").Decimal | null;
        travelMinutes: number | null;
        travelFee: import("@prisma/client-runtime-utils").Decimal | null;
        failureReason: import("@/generated/prisma/enums").MobileVisitFailureReason | null;
        failureNote: string | null;
        trackingToken: string;
    }[]>;
    /**
     * [MC4.3] إعادة ترتيب محطّات مركبة.
     *
     * تُكتب كلّها في معاملة واحدة: ترتيبٌ نصفه قديم ونصفه جديد يعني مسارًا لا يعرف السائق
     * أيّه يتبع.
     */
    reorder(clinicId: string, mobileUnitId: string, orderedVisitIds: string[]): Promise<{
        success: true;
    }>;
    /** [MC8.3] تقدير زمن الوصول من موقع المركبة الحالي. */
    refreshEta(id: string, clinicId: string): Promise<{
        etaAt: string;
        travelMinutes: number;
    } | null>;
};
