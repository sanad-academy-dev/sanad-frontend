import { useCallback } from "react";

import type { AccountingStatusAppearance } from "@/features/accounting/utils/accounting-status";
import { useI18n } from "@/hooks/use-i18n";

/**
 * [P13.5] Translate a status appearance, with its Arabic string as the fallback.
 *
 * WHY A FALLBACK RATHER THAN A BARE `t(key)`. Status badges are the most-read strings in the
 * module; if a key were ever missing, `t()` renders the KEY itself — an operator would see
 * «accounting.salesInvoice.status.paid» where the word «مدفوعة» belongs. Passing the Arabic
 * as i18next's defaultValue makes the conversion non-breaking by construction: the worst case
 * is exactly the string the screen showed before, never a raw key. The [P13.5] parity test is
 * what keeps that fallback from quietly becoming load-bearing.
 *
 * Returned as a CALLBACK rather than a computed string because every caller uses it inside a
 * table cell or a `.map`, where a hook cannot be called per row.
 */
export const useStatusLabel = () => {
	const { t } = useI18n();
	return useCallback(
		(appearance: AccountingStatusAppearance & { label?: string }) =>
			t(appearance.labelKey, { defaultValue: appearance.label ?? appearance.labelKey }),
		[t],
	);
};
