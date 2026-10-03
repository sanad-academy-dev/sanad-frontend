/**
 * [P5-UI-fix] Display formatting for accounting amounts and dates.
 *
 * The legacy invoices table formats money as `1,150 ر.س` and dates as `06/08/2026`; the
 * accounting screens must read identically. But that table gets there via
 * `Number(value).toLocaleString()`, and contract C2 forbids a JS float touching an amount —
 * a `Decimal(21,9)` ledger figure loses exactness the moment it becomes a `number`.
 *
 * So the grouping is done on the STRING, digit by digit, with the fraction rounded through
 * `bigint`. Same output as the reference, no float in the path.
 */

import { fromNano, toNano } from "@/features/accounting/utils/amount-strings";

const NANO = 1_000_000_000n;

/** Group the integer part in threes: "1150" → "1,150". */
function groupDigits(digits: string): string {
	let out = "";
	for (let i = 0; i < digits.length; i++) {
		if (i > 0 && (digits.length - i) % 3 === 0) out += ",";
		out += digits[i];
	}
	return out;
}

/**
 * Round a nano-unit magnitude to `dp` decimals, half-up, and render it.
 * Trailing zeros are dropped so whole amounts read `1,150` not `1,150.00` — matching the
 * reference's `maximumFractionDigits: 2` behavior.
 */
function renderNano(nano: bigint, dp: number): string {
	const negative = nano < 0n;
	const abs = negative ? -nano : nano;

	const scale = 10n ** BigInt(9 - dp);
	// half-up at the cut point
	const rounded = (abs + scale / 2n) / scale;
	const unit = 10n ** BigInt(dp);
	const whole = rounded / unit;
	const frac = (rounded % unit).toString().padStart(dp, "0").replace(/0+$/, "");

	const magnitude = frac
		? `${groupDigits(whole.toString())}.${frac}`
		: groupDigits(whole.toString());
	return negative && rounded !== 0n ? `-${magnitude}` : magnitude;
}

/**
 * A ledger amount as a grouped display string, no currency suffix.
 * `"1150.000000000"` → `"1,150"` · `"1234.5"` → `"1,234.5"`
 */
export function formatAmount(value: string | number | null | undefined, dp = 2): string {
	if (value == null) return "0";
	const raw = typeof value === "number" ? String(value) : value.trim();
	if (raw === "") return "0";

	const negative = raw.startsWith("-");
	// sign carried locally so the unparseable-input check below sees the magnitude
	const nano = toNano(negative ? raw.slice(1) : raw);
	if (nano === 0n && !/^-?0*(\.0*)?$/.test(raw)) {
		// unparseable (scientific notation, stray characters) — show it rather than a false 0
		return raw;
	}
	return renderNano(negative ? -nano : nano, dp);
}

/** A ledger amount with the currency suffix, as the reference renders it: `1,150 ر.س`. */
export function formatMoney(
	value: string | number | null | undefined,
	currencySymbol = "ر.س",
): string {
	return `${formatAmount(value)} ${currencySymbol}`;
}

/** `true` when the amount is greater than zero — for "does this row still owe?" checks. */
export function isPositiveAmount(value: string | number | null | undefined): boolean {
	if (value == null) return false;
	const raw = typeof value === "number" ? String(value) : value.trim();
	if (raw.startsWith("-")) return false;
	return toNano(raw) > 0n;
}

/** Σ of ledger amount strings, exact. Re-exported so screens need one import for totals. */
export { fromNano, NANO, toNano };

/**
 * Dates as the reference renders them — `06/08/2026`, Latin digits, day-first.
 * Built from the ISO parts rather than `toLocaleDateString` so the output never shifts with
 * the viewer's locale (the reference pins Latin digits deliberately).
 *
 * `postingDate` / `dueDate` are DATE columns: they serialize as UTC midnight. Reading them
 * back through `getDate()` would render the previous day for any viewer west of UTC — a
 * posting date that silently moves is worse than an ugly one. So an ISO string is sliced
 * literally, and only a real `Date` object falls back to the local getters.
 */
const ISO_DATE_PREFIX = /^(\d{4})-(\d{2})-(\d{2})/;

export function formatDisplayDate(date: string | Date | null | undefined): string {
	if (!date) return "—";

	if (typeof date === "string") {
		const iso = ISO_DATE_PREFIX.exec(date);
		if (iso) {
			const [, year, month, day] = iso;
			return `${day}/${month}/${year}`;
		}
	}

	const d = typeof date === "string" ? new Date(date) : date;
	if (Number.isNaN(d.getTime())) return "—";
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}
