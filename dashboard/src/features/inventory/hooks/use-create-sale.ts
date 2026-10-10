import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	CreateSaleFormInput,
	PaymentMethod,
	SaleResponse,
} from "@/server/sales/sales.type";

// تنشئ فاتورة بحالة "انتظار الدفع" (PENDING) — لا يُخصم المخزون بعد
export const useCreateSale = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (data: CreateSaleFormInput): Promise<SaleResponse> => {
			const res = await api.sales.post({
				items: data.items,
				discount: data.discount,
				discountCode: data.discountCode || undefined,
				// [P12B.3] الطرف بدل النسبة: الخادم يحلّ الضريبة من قالب، والطرف مُدخَل
				// لمطابقة القواعد. لم يعد للمتصفّح أن يُملي نسبة ضريبة.
				partyId: data.partyId ?? null,
				paymentMethod: data.paymentMethod,
				customerName: data.customerName || undefined,
				customerPhone: data.customerPhone || undefined,
				notes: data.notes || undefined,
				fulfillment: data.fulfillment,
			});
			if (res.error) {
				const msg = (res.error.value as { message?: string })?.message || "فشل إنشاء الفاتورة";
				throw new Error(msg);
			}
			return res.data as SaleResponse;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["sales"] });
		},
	});

	const createSale = (data: CreateSaleFormInput): Promise<SaleResponse> => {
		const promise = mutateAsync(data);
		toast.promise(promise, {
			loading: "جارٍ إنشاء الفاتورة...",
			success: (sale) => `تم إنشاء الفاتورة (${sale.code})`,
			error: (err: Error) => err.message || "فشل إنشاء الفاتورة",
		});
		return promise;
	};

	return { createSale, isPending };
};

// تدفع فاتورة معلّقة (PENDING → PAID) وتخصم المخزون
export const usePaySale = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (vars: {
			saleId: string;
			paymentMethod?: PaymentMethod;
		}): Promise<SaleResponse> => {
			const res = await api.sales({ id: vars.saleId }).pay.post({
				paymentMethod: vars.paymentMethod,
			});
			if (res.error) {
				const msg = (res.error.value as { message?: string })?.message || "فشل دفع الفاتورة";
				throw new Error(msg);
			}
			return res.data as SaleResponse;
		},
		onSuccess: () => {
			// الفاتورة دُفعت + المخزون نقص
			queryClient.invalidateQueries({ queryKey: ["sales"] });
			queryClient.invalidateQueries({ queryKey: ["inventory"] });
			queryClient.invalidateQueries({ queryKey: ["stock-overview"] });
		},
	});

	// يرمي عند الخطأ؛ التوست المخصّص (حسب وسيلة الدفع) يُعرض من المكوّن
	return { paySale: mutateAsync, isPending };
};

/**
 * [P12B.2] ترجع فاتورة مدفوعة (PAID → REFUNDED) وتعيد الأصناف للمخزون.
 *
 * نفس مفاتيح الإبطال التي يستعملها الدفع، لأن الأثر هو الأثر نفسه معكوسًا: الكميات
 * تتحرّك، فبطاقات المخزون ونظرته العامّة تتقادم كلتاهما.
 */
export const useRefundSale = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (vars: { saleId: string; reason: string }): Promise<SaleResponse> => {
			const res = await api.sales({ id: vars.saleId }).refund.post({ reason: vars.reason });
			if (res.error) {
				const msg = (res.error.value as { message?: string })?.message || "فشل إرجاع الفاتورة";
				throw new Error(msg);
			}
			return res.data as SaleResponse;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["sales"] });
			queryClient.invalidateQueries({ queryKey: ["inventory"] });
			queryClient.invalidateQueries({ queryKey: ["stock-overview"] });
		},
	});

	const refundSale = (saleId: string, reason: string): Promise<SaleResponse> => {
		const promise = mutateAsync({ saleId, reason });
		toast.promise(promise, {
			loading: "جارٍ إرجاع الفاتورة...",
			success: (sale) => `تم إرجاع الفاتورة (${sale.code}) وإعادة الأصناف للمخزون`,
			error: (err: Error) => err.message || "فشل إرجاع الفاتورة",
		});
		return promise;
	};

	return { refundSale, isPending };
};
