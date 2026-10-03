import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	CreatePurchaseOrderFormInput,
	PurchaseOrderResponse,
	ReceivePurchaseOrderFormInput,
} from "@/server/purchasing/purchasing.type";

const errMsg = (e: unknown, fallback: string) =>
	(e as { value?: { message?: string } })?.value?.message || fallback;

export const usePurchaseOrderMutations = () => {
	const queryClient = useQueryClient();

	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
		queryClient.invalidateQueries({ queryKey: ["inventory"] });
		queryClient.invalidateQueries({ queryKey: ["stock-overview"] });
		queryClient.invalidateQueries({ queryKey: ["stock-ledger"] });
	};

	const createMut = useMutation({
		mutationFn: async (data: CreatePurchaseOrderFormInput): Promise<PurchaseOrderResponse> => {
			const res = await api.purchasing.post({
				supplierId: data.supplierId,
				warehouseId: data.warehouseId,
				expectedAt: data.expectedAt || undefined,
				notes: data.notes || undefined,
				lines: data.lines,
			});
			if (res.error) throw new Error(errMsg(res.error, "فشل إنشاء أمر الشراء"));
			return res.data as PurchaseOrderResponse;
		},
		onSuccess: invalidate,
	});

	const receiveMut = useMutation({
		mutationFn: async (vars: {
			id: string;
			data: ReceivePurchaseOrderFormInput;
		}): Promise<PurchaseOrderResponse> => {
			const res = await api.purchasing({ id: vars.id }).receive.post(vars.data);
			if (res.error) throw new Error(errMsg(res.error, "فشل استلام أمر الشراء"));
			return res.data as PurchaseOrderResponse;
		},
		onSuccess: invalidate,
	});

	const cancelMut = useMutation({
		mutationFn: async (id: string): Promise<PurchaseOrderResponse> => {
			const res = await api.purchasing({ id }).cancel.post();
			if (res.error) throw new Error(errMsg(res.error, "فشل إلغاء أمر الشراء"));
			return res.data as PurchaseOrderResponse;
		},
		onSuccess: invalidate,
	});

	const createPurchaseOrder = (data: CreatePurchaseOrderFormInput) => {
		const p = createMut.mutateAsync(data);
		toast.promise(p, {
			loading: "جارٍ إنشاء أمر الشراء...",
			success: (po) => `تم إنشاء أمر الشراء (${po.code})`,
			error: (e: Error) => e.message || "فشل إنشاء أمر الشراء",
		});
		return p;
	};

	const receivePurchaseOrder = (id: string, data: ReceivePurchaseOrderFormInput) => {
		const p = receiveMut.mutateAsync({ id, data });
		toast.promise(p, {
			loading: "جارٍ تسجيل الاستلام...",
			success: (po) =>
				po.status === "RECEIVED" ? "تم استلام الأمر بالكامل" : "تم تسجيل الاستلام الجزئي",
			error: (e: Error) => e.message || "فشل استلام أمر الشراء",
		});
		return p;
	};

	const cancelPurchaseOrder = (id: string) => {
		const p = cancelMut.mutateAsync(id);
		toast.promise(p, {
			loading: "جارٍ إلغاء أمر الشراء...",
			success: "تم إلغاء أمر الشراء",
			error: (e: Error) => e.message || "فشل إلغاء أمر الشراء",
		});
		return p;
	};

	return {
		createPurchaseOrder,
		// إنشاء بدون toast افتراضي — للحالات التي تعرض رسالتها الخاصة
		createPurchaseOrderAsync: createMut.mutateAsync,
		receivePurchaseOrder,
		cancelPurchaseOrder,
		isCreating: createMut.isPending,
		isReceiving: receiveMut.isPending,
		isCancelling: cancelMut.isPending,
	};
};
