import { useCallback } from "react";

import { useSession } from "@/lib/auth/client";
import { formatCurrency } from "@/lib/format-currency";

/**
 * منسّق العملة الموحّد لكل شاشات المال.
 *
 * العملة تأتي من جلسة الأكاديمية النشطة (`currencyCode` حقل جلسة في `lib/auth`)،
 * تطبيقًا لـ ADR-0001: العملة تفضيل عرض، والمبالغ مخزّنة بعملة الأكاديمية بلا تحويل.
 * أي شاشة تعرض مبلغًا يجب أن تمرّ من هنا بدل تثبيت رمز عملة في النص.
 */
export function useCurrency() {
	const { data: session } = useSession();
	const currencyCode = session?.session?.currencyCode ?? "SAR";

	const format = useCallback(
		(amount: { toString(): string } | number | string | null | undefined) =>
			formatCurrency(Number(amount ?? 0) || 0, currencyCode),
		[currencyCode],
	);

	return { format, currencyCode };
}
