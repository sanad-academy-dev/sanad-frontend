/**
 * Accounting's CSV entry point — now a thin re-export of the app's one encoder (`@/lib/csv`).
 *
 * It used to own its own `cell()`, identical to three other copies elsewhere in the app and
 * carrying the same formula-injection defect (pre-M3 audit F9). The encoder moved to
 * `src/lib/csv.ts` where it is shared and tested; this file stays so the twenty-odd
 * accounting screens that import `downloadCsv`/`isoDay` from here keep working, and so the
 * module has one obvious place to look.
 */

export { csvCell, downloadCsv, isoDay, toCsv } from "@/lib/csv";
