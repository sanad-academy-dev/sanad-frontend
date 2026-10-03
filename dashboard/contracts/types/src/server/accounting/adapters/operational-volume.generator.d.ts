/**
 * [P12A.2d] Dev-only DETERMINISTIC operational-volume generator (design doc §6): a year
 * of clinic invoices + expenses with a realistic status mix, spread over 12 months, from
 * a seeded RNG — re-runs with the same (seed, year) are byte-comparable, and CI runs the
 * SAME core at a smaller volume. NEVER wired into the demo seeds; the CLI wrapper is
 * `bun run db:generate:operational-volume`.
 *
 * Status mix: ~55% PAID · 15% PARTIAL · 15% PENDING · 10% VOIDED (never paid) ·
 * 5% VOIDED-after-payment (paidAt set — the adapter never posts them because eligibility
 * is status PAID, but they exercise the report's source-side filters).
 */
/** tiny deterministic PRNG — no Math.random anywhere (rule: comparable re-runs) */
export declare function mulberry32(seed: number): () => number;
export type GenerateVolumeOptions = {
    clinicId: string;
    invoices?: number;
    year?: number;
    seed?: number;
    /** expenses per month (default 15) */
    expensesPerMonth?: number;
};
/**
 * [P12A-fix5] The summary reports what was actually INSERTED, never what was requested.
 * `Invoice.code` is globally unique, so a second clinic (or a re-run) generating the same
 * `GEN{seed}-{year}` prefix made `createMany({ skipDuplicates: true })` drop every row
 * while the CLI still printed «invoices: 3000» — the owner's adapter run then posted
 * nothing, with no error anywhere. Requested and inserted are now both reported and the
 * code prefix is namespaced per clinic so the collision cannot recur in the first place.
 */
export type GenerateVolumeSummary = {
    /** rows actually written */
    invoices: number;
    invoicesRequested: number;
    /** rows dropped as duplicates — nonzero means a prior run already planted them */
    invoicesSkipped: number;
    /** planned status mix; meaningful only for the rows that were inserted */
    byStatus: Record<string, number>;
    expenses: number;
    expensesRequested: number;
    expensesSkipped: number;
    requesterId: string;
    codePrefix: string;
};
export declare function generateOperationalVolume(options: GenerateVolumeOptions): Promise<GenerateVolumeSummary>;
