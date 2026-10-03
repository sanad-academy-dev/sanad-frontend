import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { PaymentMethod } from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import type { PaymentScope } from "@/server/invoices/invoice-sections";
import type { InvoiceResponse } from "@/server/invoices/invoices.type";

export const useInvoice = (appointmentId: string) => {
	const queryClient = useQueryClient();

	const { data: invoice, isLoading } = useQuery<InvoiceResponse | null>({
		queryKey: ["invoice", appointmentId],
		queryFn: async () => {
			const res = await api.appointments({ id: appointmentId }).invoice.get();
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر جلب الفاتورة");
			}
			return (res.data as InvoiceResponse | null) ?? null;
		},
		enabled: !!appointmentId,
		staleTime: 30 * 1000,
	});

	const invalidate = () => {
		void queryClient.invalidateQueries({ queryKey: ["invoice", appointmentId] });
		void queryClient.invalidateQueries({ queryKey: ["appointment", appointmentId] });
		void queryClient.invalidateQueries({ queryKey: ["appointments"] });
		void queryClient.invalidateQueries({
			queryKey: ["appointment-services", appointmentId],
		});
		// الدفع الكامل يخصم المخزون ويضبط issuedAt على الأصناف — حدّث قائمتها لتظهر "مصروف"
		void queryClient.invalidateQueries({
			queryKey: ["appointment-products", appointmentId],
		});
		// وأيضًا قوائم المخزون لأن الأرصدة تغيّرت
		void queryClient.invalidateQueries({ queryKey: ["inventory"] });
		void queryClient.invalidateQueries({
			queryKey: ["appointment-activity", appointmentId],
		});
	};

	const createOrRefreshMutation = useMutation({
		mutationFn: async () => {
			const res = await api.appointments({ id: appointmentId }).invoice.post();
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر إصدار الفاتورة");
			}
			return res.data as InvoiceResponse;
		},
		onSuccess: invalidate,
	});

	const payMutation = useMutation({
		mutationFn: async ({
			paymentMethod,
			amountPaid,
			scope,
			insurance,
			redeemPoints,
		}: {
			paymentMethod: PaymentMethod;
			amountPaid: number;
			scope?: PaymentScope;
			insurance?: { apply: boolean; excludedLineRefs: string[] };
			/** [LY-P2] §6.1 — نقاط يختارها المستخدم عند الدفع؛ غيابها لا يغيّر شيئًا */
			redeemPoints?: number;
		}) => {
			const invoiceId = invoice?.id;
			if (!invoiceId) throw new Error("لم يتم إصدار الفاتورة بعد");
			const res = await api
				.invoices({ id: invoiceId })
				.pay.post({ paymentMethod, amountPaid, scope, insurance, redeemPoints });
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر دفع الفاتورة");
			}
			return res.data as InvoiceResponse;
		},
		onSuccess: invalidate,
	});

	const ensureInvoice = () => createOrRefreshMutation.mutateAsync();

	const payInvoice = (
		paymentMethod: PaymentMethod,
		amountPaid: number,
		scope?: PaymentScope,
		insurance?: { apply: boolean; excludedLineRefs: string[] },
		redeemPoints?: number,
	): Promise<InvoiceResponse> => {
		const promise = payMutation.mutateAsync({
			paymentMethod,
			amountPaid,
			scope,
			insurance,
			redeemPoints,
		});
		toast.promise(promise, {
			loading: "جارٍ الدفع...",
			success: "تم الدفع بنجاح",
			error: (err: Error) => err.message || "فشل الدفع",
		});
		return promise;
	};

	return {
		invoice: invoice ?? null,
		isLoading,
		ensureInvoice,
		isEnsuring: createOrRefreshMutation.isPending,
		payInvoice,
		isPaying: payMutation.isPending,
	};
};
