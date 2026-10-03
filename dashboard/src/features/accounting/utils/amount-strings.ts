/**
 * Exact, float-free arithmetic on amount STRINGS for accounting UIs (contract C2 — no JS
 * float touches an amount, even for display). Values scale to integer nano-units (9 dp).
 */

const NANO = 1_000_000_000n;
const AMOUNT_RE = /^-?\d+(\.\d{1,9})?$/;

export function toNano(raw: string | null | undefined): bigint {
	const value = (raw ?? "").trim();
	if (!AMOUNT_RE.test(value)) return 0n;
	// sign carried separately: BigInt("-1")*NANO + BigInt(frac) would ADD the fraction back
	const negative = value.startsWith("-");
	const [int, frac = ""] = (negative ? value.slice(1) : value).split(".");
	const magnitude = BigInt(int) * NANO + BigInt(frac.padEnd(9, "0"));
	return negative ? -magnitude : magnitude;
}

export function fromNano(total: bigint): string {
	const negative = total < 0n;
	const abs = negative ? -total : total;
	const whole = abs / NANO;
	const frac = (abs % NANO).toString().padStart(9, "0").replace(/0+$/, "");
	const magnitude = frac ? `${whole}.${frac}` : `${whole}`;
	return negative ? `-${magnitude}` : magnitude;
}

export function sumAmountStrings(values: (string | null | undefined)[]): string {
	return fromNano(values.reduce((acc, v) => acc + toNano(v), 0n));
}

/** Σa − Σb as a display string (may be negative). */
export function diffAmountStrings(
	a: (string | null | undefined)[],
	b: (string | null | undefined)[],
): string {
	return fromNano(
		a.reduce((acc, v) => acc + toNano(v), 0n) - b.reduce((acc, v) => acc + toNano(v), 0n),
	);
}
