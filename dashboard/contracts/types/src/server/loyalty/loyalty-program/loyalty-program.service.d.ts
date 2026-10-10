/**
 * [LY-P0] الدورة — تجمع بين استعلامات الـ DAO وقواعد §3/§4 الخالصة.
 *
 * البوابة §0.3 تُفحص في **كل** مسار، لا في القراءات وحدها: وحدةٌ مطفأة يجب ألّا تُخدَم
 * إطلاقًا. أمسكت جولة CRM-P6 مسارًا واحدًا نسي هذه البوابة (§17.2 صفّ ٢٥) — فتُستدعى
 * هنا في الدورة، حيث لا يمكن لمسارٍ أن يتخطّاها بالسهو.
 */
export declare function assertLoyaltyEnabled(clinicId: string): Promise<void>;
export declare function createProgram(clinicId: string, input: {
    name: string;
    earnRate: number;
    redemptionRate: number;
    minRedemptionPoints: number;
    maxRedemptionPercent: number;
    pointsValidityMonths: number;
    membershipMultiplier?: number;
    active?: boolean;
}): Promise<{
    id: string;
}>;
export declare function updateProgram(clinicId: string, id: string, input: Record<string, unknown> & {
    active?: boolean;
}): Promise<{
    id: string;
}>;
export declare function deleteProgram(clinicId: string, id: string): Promise<{
    ok: boolean;
}>;
export declare function createTier(clinicId: string, programId: string, input: {
    name: string;
    minSpend: number;
    earnMultiplier?: number;
    order?: number;
    colorToken: string;
    active?: boolean;
}): Promise<{
    id: string;
}>;
export declare function updateTier(clinicId: string, id: string, input: Partial<{
    name: string;
    minSpend: number;
    earnMultiplier: number;
    order: number;
    colorToken: string;
    active: boolean;
}>): Promise<{
    id: string;
}>;
export declare function deleteTier(clinicId: string, id: string): Promise<{
    ok: boolean;
}>;
