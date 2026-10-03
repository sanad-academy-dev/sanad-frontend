export declare const loyaltyReportsDao: {
    /** §11.1 — الالتزام القائم، بالنقاط وبالريال وبدِلاء العمر. */
    liability(clinicId: string, now?: Date): Promise<{
        programName: string;
        redemptionRate: string;
        points: number;
        value: string;
        owners: number;
        buckets: {
            key: "due30" | "due90" | "due365" | "later";
            labelAr: string;
            points: number;
            value: string;
        }[];
    } | null>;
    /**
     * §11.3 — توزيع المستويات: كم وليّ أمرًا في كل مستوى، وحصّتهم من الإنفاق.
     *
     * **هنا وحدها تُقرأ لقطة المهمّة** (LY-P3): اشتقاق المستوى لكل وليّ أمرٍ على حدة عبر
     * آلاف أولياء الأمور استعلامٌ لكلٍّ منهم. ولذلك يصل التقرير بختم `computedAt`: تقريرٌ من
     * كاشٍ يجب أن يقول متى حُسب، وإلّا قُرئ كأنّه لحظيّ.
     */
    tierDistribution(clinicId: string): Promise<{
        computedAt: string | null;
        totalOwners: number;
        totalSpend: string;
        rows: {
            tierId: string | null;
            name: string;
            colorToken: string | null;
            owners: number;
            spend: string;
            spendSharePercent: string;
        }[];
    } | null>;
    /** §11.4 — من توشك نقاطهم أن تنتهي خلال N يومًا. */
    expiringSoon(clinicId: string, days: number, now?: Date): Promise<{
        days: number;
        owners: {
            ownerId: string;
            name: string;
            code: string;
            phone: string | null;
            points: number;
            soonestAt: string;
        }[];
    }>;
    /** §11.2 — حركة الفترة ومعدّل الاستبدال. */
    activity(clinicId: string, from: Date, to: Date): Promise<{
        granted: number;
        redeemed: number;
        expired: number;
        reversed: number;
        restored: number;
        adjusted: number;
        redemptionRatePercent: string | null;
        from: string;
        to: string;
    }>;
};
