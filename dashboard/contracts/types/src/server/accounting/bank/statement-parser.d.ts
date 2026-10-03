import { Prisma } from "@/generated/prisma/client";
export type BankImportMappingConfig = {
    /** rows to skip before data starts (header rows) */
    headerRows: number;
    /** CSV only — defaults to comma */
    delimiter?: string;
    /** 0-based column indexes */
    dateColumn: number;
    descriptionColumn: number;
    referenceColumn?: number;
    transactionIdColumn?: number;
    /** either separate debit/credit columns … */
    debitColumn?: number;
    creditColumn?: number;
    /** … or one signed amount column (negative = withdrawal) */
    amountColumn?: number;
    currencyColumn?: number;
    /** e.g. "DD/MM/YYYY" — see SUPPORTED_DATE_FORMATS */
    dateFormat: string;
};
export type ParsedStatementRow = {
    rowNumber: number;
    postingDate: Date;
    description: string | null;
    referenceNumber: string | null;
    transactionId: string;
    /** exactly one of the two is non-zero */
    deposit: string;
    withdrawal: string;
    currencyCode: string | null;
};
export type ParsedStatement = {
    rows: ParsedStatementRow[];
    errors: {
        rowNumber: number;
        message: string;
    }[];
};
export declare const SUPPORTED_DATE_FORMATS: readonly ["YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY", "DD-MM-YYYY", "DD.MM.YYYY"];
/** RFC-4180-ish CSV → cells. Handles quotes, escaped quotes, CRLF and a UTF-8 BOM. */
export declare function parseCsv(text: string, delimiter?: string): string[][];
/** Arabic-indic digits + thousand separators + (parentheses) negatives → Decimal. */
export declare function parseAmount(raw: string): Prisma.Decimal | null;
/** strict date-by-format; returns a UTC-midnight Date or null. */
export declare function parseStatementDate(raw: string, format: string): Date | null;
/** deterministic 32-bit FNV-1a hex fingerprint (no crypto import needed for dedupe) */
export declare function fingerprint(text: string): string;
/** apply a mapping to raw cell rows (CSV or XLSX alike) */
export declare function applyMapping(cells: string[][], config: BankImportMappingConfig): ParsedStatement;
/**
 * FR-14.1 built-in templates. The three Palestinian-bank presets are ⚠ UNVERIFIED
 * generic shapes (owner directive: never guess a real layout as fact) — they exist so
 * the first real statement needs only column-index adjustments, documented in
 * docs/bank-import-mappings.md.
 */
export declare const BANK_IMPORT_PRESETS: Record<string, {
    labelAr: string;
    config: BankImportMappingConfig;
    verified: boolean;
}>;
