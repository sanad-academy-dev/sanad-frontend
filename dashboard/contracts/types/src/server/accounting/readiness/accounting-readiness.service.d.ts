/**
 * [P12C.2] "Is this clinic ready to post?" — contract KL-7.
 *
 * WHAT THIS IS NOT. It is not new posting logic and it does not configure anything. Every
 * step it reports was ALREADY reachable from the product — «شجرة الحسابات» has
 * «تطبيق الشجرة القياسية», «السنوات المالية» has a create sheet, «إعدادات الشركة» edits the
 * §4.1 defaults, and the adapter legs and flags live on «الحوكمة ← المحولات». KL-7's finding
 * was that nothing ORDERS those steps, nothing says which are done, and most gaps announce
 * themselves only at the moment of posting as an Arabic error naming a screen. That is a
 * guidance gap, not a capability gap, and this reads state to close it.
 *
 * WHAT IS REPORTED VS WHAT IS PROVISIONED (owner, 2026-08-19). Two of the five items are
 * guaranteed rather than asked for: a fiscal year covering today and a default sales tax
 * template, both created by `provisionClinicFirstRun` on onboarding AND on the demo seed.
 * They are derivable, not business decisions an owner should have to make before their first
 * document, so they appear here already satisfied — but they still APPEAR, because a person
 * can disable or delete either one afterwards and the panel must then say so.
 *
 * The three that are genuinely the owner's to decide — the chart of accounts, the §4.1
 * posting defaults, and the adapter legs — are the ones this exists to surface.
 *
 * SEVERITY IS NOT DECORATION. `blocking` means no document can post at all; a `warning` means
 * some specific flow will refuse later. Reporting an optional leg as a blocker would train
 * the owner to ignore the panel, which is worse than not having one.
 */
export type ReadinessSeverity = "blocking" | "warning";
export type ReadinessItem = {
    key: string;
    /** Arabic label — what the owner is looking for */
    label: string;
    /** why it matters, in the operator's terms, not the schema's */
    detail: string;
    done: boolean;
    severity: ReadinessSeverity;
    /**
     * The button's wording. The ROUTE is deliberately not here: routes are a UI concern and
     * the contract is law for UI, so the tab maps `key` to a typed `<Link to>`. A string
     * path from the server would have to be cast past TanStack's route typing, which is the
     * kind of cast that survives a route rename and breaks silently.
     */
    fixLabel: string;
};
export type AccountingReadiness = {
    ready: boolean;
    /** true when nothing BLOCKING is outstanding — a clinic can post, warnings and all */
    canPost: boolean;
    doneCount: number;
    totalCount: number;
    items: ReadinessItem[];
};
export declare function getAccountingReadiness(clinicId: string): Promise<AccountingReadiness>;
