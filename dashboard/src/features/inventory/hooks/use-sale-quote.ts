import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

type QuoteItem = {
	/** لازم لقالب ضريبة الصنف — بدونه تختلف نسبة الشاشة عن نسبة الدفع */
	inventoryItemId?: string | null;
	name: string;
	unitPrice: number;
	quantity: number;
};

/**
 * [P12B.3] تسعير السلة من الخادم.
 *
 * الشاشة كانت تحسب الضريبة بنفسها: `const TAX_RATE = 15` وحسابٌ محلّي وملصق «(15%)».
 * فكانت تعرض رقمًا صادف أن يطابق ما يحسبه الخادم — حتى تختلف نسبة أكاديمية عن 15، فتعرض
 * الشاشة رقمًا والفاتورة رقمًا آخر. الآن المصدر واحد: محرّك §8 نفسه على الخادم.
 *
 * `enabled` عند وجود أصناف فقط: سلة فارغة لا تُسعَّر، والخادم يرفض `minItems: 1`.
 */
export const useSaleQuote = (params: {
	items: QuoteItem[];
	discount: number;
	partyId?: string | null;
	/** [LY-P2] النقاط المطلوب استبدالها — تدخل نفس المقعد فتعرض الشاشة ما سيحسبه الحفظ */
	redeemPoints?: number;
}) => {
	const { items, discount, partyId, redeemPoints } = params;

	const { data, isLoading, error } = useQuery({
		// المفتاح يحمل السلة كاملة — أي تغيّر في صنف أو كمية أو خصم يعيد التسعير
		queryKey: ["sales", "quote", items, discount, partyId ?? null, redeemPoints ?? 0],
		enabled: items.length > 0,
		queryFn: async () => {
			const res = await api.sales.quote.post({ items, discount, partyId, redeemPoints });
			if (res.error) {
				const message = (res.error.value as { message?: string })?.message;
				throw new Error(message || "تعذّر تسعير الفاتورة");
			}
			return res.data;
		},
		// لا إعادة محاولة: أشيع خطأ هنا هو «لا قالب ضريبة»، وهو إعداد ناقص لا عُطل عابر
		retry: false,
		staleTime: 1000 * 30,
	});

	return {
		quote: data ?? null,
		isQuoting: isLoading,
		quoteError: error instanceof Error ? error.message : null,
	};
};
