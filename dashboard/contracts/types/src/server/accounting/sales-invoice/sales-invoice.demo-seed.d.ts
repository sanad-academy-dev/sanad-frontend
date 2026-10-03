/**
 * [P5.x] Demo data for the owner's manual click-through (phase-exit requirement):
 * everything the invoice form needs to be exercised with real-looking data, created
 * IDEMPOTENTLY (matched by name — rerunning changes nothing):
 *  - accounting defaults completed where missing (SAR, receivable, round-off, income,
 *    cost center) so the first save never dead-ends on configuration;
 *  - a «ض.ق.م 15%» sales tax template;
 *  - a «دفعتان 50/50» payment-terms template (فوري + صافي 30);
 *  - two demo customers (Owner masters).
 */
type SeedSummary = {
    created: string[];
    existing: string[];
};
export declare function seedSalesInvoiceDemo(clinicId: string): Promise<SeedSummary>;
export {};
