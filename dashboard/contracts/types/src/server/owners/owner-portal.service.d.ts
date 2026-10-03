/**
 * [PP1] إصدار اعتمادات تطبيق وليّ الأمر من جهة الأكاديمية.
 *
 * الموظّف يضغط زرًّا، فيحصل على كلمة مرور يقرؤها على وليّ الأمر أو يطبعها له. لا رسالة
 * نصّية ولا بريد — لا يوجد في النظام ناقلٌ لأيّهما، والتسليم اليدوي قناة قائمة اليوم.
 *
 * **الحساب عالمي والأكاديمية محلّية.** وليّ الأمر المتعامل مع ثلاث أكاديميات له حسابٌ واحد
 * بكلمة مرور واحدة؛ أي أكاديمية منها تستطيع إصدار كلمة جديدة له، وكلّها تُصيب الحساب
 * نفسه. هذا مقصود — البديل ثلاث كلمات لثلاث أكاديميات، وهو ما يجعل التطبيق بلا معنى.
 */
type IssueResult = {
    ok: true;
    data: {
        password: string;
        phoneE164: string;
        ownerName: string;
        /** true ⇒ أُنشئ الحساب الآن. false ⇒ كان موجودًا وأُبدلت كلمته. */
        created: boolean;
        /** عدد الأكاديميات التي صار الحساب مرتبطًا بها بعد الإصدار. */
        linkedClinics: number;
    };
} | {
    ok: false;
    reason: "NOT_FOUND" | "INVALID_PHONE";
};
export declare function issuePortalPassword(ownerId: string, clinicId: string): Promise<IssueResult>;
/** حالة الحساب كما تُعرض في سجلّ وليّ الأمر — بلا أي أثر لكلمة المرور. */
export declare function portalStatus(ownerId: string, clinicId: string): Promise<{
    hasAccount: boolean;
    phoneE164: null;
    reason: "NOT_FOUND";
    lastSignInAt?: undefined;
    mustChangePassword?: undefined;
    passwordSetAt?: undefined;
    suspended?: undefined;
    linkedClinics?: undefined;
    activeDevices?: undefined;
} | {
    hasAccount: boolean;
    phoneE164: null;
    reason: "INVALID_PHONE";
    lastSignInAt?: undefined;
    mustChangePassword?: undefined;
    passwordSetAt?: undefined;
    suspended?: undefined;
    linkedClinics?: undefined;
    activeDevices?: undefined;
} | {
    hasAccount: boolean;
    phoneE164: string;
    lastSignInAt: Date | null;
    mustChangePassword: boolean | null;
    passwordSetAt: Date | null;
    suspended: boolean;
    linkedClinics: number;
    activeDevices: number;
    reason?: undefined;
}>;
export {};
