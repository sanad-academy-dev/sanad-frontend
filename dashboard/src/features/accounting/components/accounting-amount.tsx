import { formatAmount } from "@/features/accounting/utils/format-amount";
import { cn } from "@/lib/utils";

/**
 * THE money cell for accounting tables (pre-M3 audit F7).
 *
 * It existed three times — sales invoices, purchase invoices, payment entries — byte for
 * byte identical. That is not merely duplication: it is WHY the reconciliation and
 * payment-reports tables ended up printing raw server strings like «1150.000000000». Those
 * screens were written later, had nothing to import, and so rendered money by hand. A shared
 * component is what makes "use the standard" a one-line import instead of a copy.
 *
 * THE NUMBER IS FORCED LTR AND THE CURRENCY IS NOT. Arabic reads right to left, digits do
 * not, and a money figure that inherits the page's RTL flow renders its groups in the wrong
 * order. `dir="ltr"` on the wrapper fixes the box while the browser's bidi handling keeps
 * «ر.س» reading correctly beside it.
 *
 * IT FORMATS BY DEFAULT. Passing a raw `Decimal(21,9)` string was the actual defect on two
 * screens, so `value` goes through `formatAmount` (exact, bigint-based, no JS float touches
 * it — contract C2) unless the caller has already formatted it and says so with
 * `preformatted`. The safe thing is what happens when you do nothing.
 */
export const AccountingAmount = ({
	value,
	muted,
	preformatted = false,
	className,
}: {
	value: string | number | null | undefined;
	/** secondary figures (an already-settled balance, a zero) read quieter */
	muted?: boolean;
	/** the caller already ran `formatAmount`/`formatMoney` — do not format twice */
	preformatted?: boolean;
	className?: string;
}) => (
	<span
		className={cn(
			"inline-flex items-baseline justify-end gap-1 font-medium text-xs",
			muted ? "text-muted-foreground" : "text-foreground",
			className,
		)}
		dir="ltr"
	>
		<span className="tabular-nums">{preformatted ? (value ?? "") : formatAmount(value)}</span>
		<span className="text-[10px] text-muted-foreground">ر.س</span>
	</span>
);
