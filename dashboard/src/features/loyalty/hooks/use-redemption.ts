import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

/**
 * [LY-P2] §10.4 — هل يُرسَم ضابط الاستبدال، وإن لم يُرسَم فلماذا.
 *
 * يُستدعى **حتى بلا وليّ أمر**: غياب وليّ الأمر ليس سببًا للصمت بل هو الحالة التي يجب أن تُقال
 * («اربط العميل لاستخدام النقاط»). ولذلك وليّ الأمر مُعامِل استعلام لا جزء من المسار.
 *
 * والفشل صامتٌ عمدًا (`null`): من لا يملك صلاحية دفتر النقاط يُردّ ٤٠٣، وشاشة الدفع
 * شاشةٌ عامّة لا تسقط لأنّ قارئها لا يرى وحدةً اختيارية.
 */
export const useRedemptionCapability = (
	ownerId: string | null | undefined,
	enabled = true,
) => {
	const { data } = useQuery({
		queryKey: ["loyalty", "redemption", ownerId ?? null],
		enabled,
		retry: false,
		staleTime: 1000 * 15,
		queryFn: async () => {
			const { data, error } = await api.loyalty.redemption.get({
				query: ownerId ? { ownerId } : {},
			});
			if (error) return null;
			return data;
		},
	});
	return { capability: data ?? null };
};

/**
 * [LY-P2] §10.4 — أثر الاستبدال على فاتورة أكاديمية قائمة، من الخادم لا من حساب الشاشة.
 *
 * `enabled` عند نقاطٍ موجبة فقط: بلا استبدال لا سبب لطلبٍ إضافي على كل فتحِ حوار.
 * والخطأ يُعاد نصًّا عربيًا (`refusal`) لا يُرمى: رفضُ قاعدةٍ في §6.2 معلومةٌ يعرضها
 * الضابط تحت الحقل، لا انهيارُ حوار الدفع.
 */
export const useInvoiceLoyaltyPreview = (
	invoiceId: string | null | undefined,
	redeemPoints: number,
) => {
	const { data } = useQuery({
		queryKey: ["loyalty", "invoice-preview", invoiceId ?? null, redeemPoints],
		enabled: Boolean(invoiceId) && redeemPoints > 0,
		retry: false,
		queryFn: async () => {
			const { data, error } = await api.loyalty
				.invoices({ id: invoiceId as string })
				["redemption-preview"].post({ redeemPoints });
			if (error) {
				const message = (error.value as { message?: string })?.message;
				return { preview: null, refusal: message || "تعذّر حساب خصم النقاط" };
			}
			return { preview: data, refusal: null };
		},
	});
	return { preview: data?.preview ?? null, refusal: data?.refusal ?? null };
};
