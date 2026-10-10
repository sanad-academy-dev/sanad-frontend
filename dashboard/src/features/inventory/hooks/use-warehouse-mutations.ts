import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	CreateWarehouseFormInput,
	UpdateWarehouseFormInput,
	WarehouseResponse,
} from "@/server/stock/stock.type";

const errMsg = (e: unknown, fallback: string) =>
	(e as { value?: { message?: string } })?.value?.message || fallback;

export const useWarehouseMutations = () => {
	const queryClient = useQueryClient();

	// تظهر فورًا في كل الشاشات التي تقرأ المستودعات (الحركات/التحويل/الشراء/الجرد)
	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: ["warehouses"] });
		queryClient.invalidateQueries({ queryKey: ["warehouse-bins"] });
		queryClient.invalidateQueries({ queryKey: ["stock-overview"] });
	};

	const createMut = useMutation({
		mutationFn: async (data: CreateWarehouseFormInput): Promise<WarehouseResponse> => {
			const res = await api.stock.warehouses.post(data);
			if (res.error) throw new Error(errMsg(res.error, "فشل إنشاء المستودع"));
			return res.data as WarehouseResponse;
		},
		onSuccess: invalidate,
	});

	const updateMut = useMutation({
		mutationFn: async (vars: {
			id: string;
			data: UpdateWarehouseFormInput;
		}): Promise<WarehouseResponse> => {
			const res = await api.stock.warehouses({ id: vars.id }).patch(vars.data);
			if (res.error) throw new Error(errMsg(res.error, "فشل تعديل المستودع"));
			return res.data as WarehouseResponse;
		},
		onSuccess: invalidate,
	});

	const disableMut = useMutation({
		mutationFn: async (id: string) => {
			const res = await api.stock.warehouses({ id }).disable.post();
			if (res.error) throw new Error(errMsg(res.error, "فشل حذف المستودع"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const createWarehouse = (data: CreateWarehouseFormInput) => {
		const p = createMut.mutateAsync(data);
		toast.promise(p, {
			loading: "جارٍ إنشاء المستودع...",
			success: (w) => `تم إنشاء المستودع (${w.code})`,
			error: (e: Error) => e.message || "فشل إنشاء المستودع",
		});
		return p;
	};

	const updateWarehouse = (id: string, data: UpdateWarehouseFormInput) => {
		const p = updateMut.mutateAsync({ id, data });
		toast.promise(p, {
			loading: "جارٍ حفظ التعديل...",
			success: "تم تحديث المستودع",
			error: (e: Error) => e.message || "فشل تعديل المستودع",
		});
		return p;
	};

	const disableWarehouse = (id: string) => {
		const p = disableMut.mutateAsync(id);
		toast.promise(p, {
			loading: "جارٍ حذف المستودع...",
			success: "تم حذف المستودع",
			error: (e: Error) => e.message || "فشل حذف المستودع",
		});
		return p;
	};

	return {
		createWarehouse,
		updateWarehouse,
		disableWarehouse,
		isCreating: createMut.isPending,
		isUpdating: updateMut.isPending,
	};
};
