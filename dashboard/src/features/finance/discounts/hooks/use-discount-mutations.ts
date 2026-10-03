import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { DiscountStatus } from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import type { DiscountFormValues, DiscountResponse } from "@/server/discounts/discounts.type";

// حمولة تُرسَل للـ API — التواريخ كسلاسل ISO
export type DiscountPayload = Omit<DiscountFormValues, "validFrom" | "validTo"> & {
	validFrom: string | null;
	validTo: string | null;
};

// تحويل قيم النموذج (Date) إلى الحمولة المتوقّعة من الخادم
export const toDiscountPayload = (data: DiscountFormValues): DiscountPayload => ({
	name: data.name,
	couponCode: data.couponCode,
	type: data.type,
	value: data.value,
	validFrom: data.validFrom ? data.validFrom.toISOString() : null,
	validTo: data.validTo ? data.validTo.toISOString() : null,
	usageLimit: data.usageLimit,
	perCustomerLimit: data.perCustomerLimit,
	customerType: data.customerType,
	serviceIds: data.serviceIds,
	notes: data.notes?.trim() ? data.notes : null,
});

// بناء حمولة إنشاء من خصم موجود (لإجراء "تكرار") مع كود كوبون فريد
export const responseToPayload = (discount: DiscountResponse): DiscountPayload => ({
	name: `${discount.name} (نسخة)`,
	couponCode: `${discount.couponCode}-COPY`,
	type: discount.type,
	value: Number(discount.value),
	validFrom: discount.validFrom ? new Date(discount.validFrom).toISOString() : null,
	validTo: discount.validTo ? new Date(discount.validTo).toISOString() : null,
	usageLimit: discount.usageLimit,
	perCustomerLimit: discount.perCustomerLimit,
	customerType: discount.customerType,
	serviceIds: discount.services.map((s) => s.id),
	notes: discount.notes,
});

const errorMessage = (error: unknown, fallback: string): string => {
	const v = (error as { value?: { message?: string } })?.value;
	return v?.message ?? fallback;
};

export const useDiscountMutations = () => {
	const queryClient = useQueryClient();

	const invalidate = () => {
		void queryClient.invalidateQueries({ queryKey: ["discounts"] });
	};

	const createMutation = useMutation({
		mutationFn: async (payload: DiscountPayload) => {
			const res = await api.discounts.post(payload);
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر إنشاء الخصم"));
			return res.data as DiscountResponse;
		},
		onSuccess: invalidate,
	});

	const updateMutation = useMutation({
		mutationFn: async ({ id, payload }: { id: string; payload: DiscountPayload }) => {
			const res = await api.discounts({ id }).patch(payload);
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر تحديث الخصم"));
			return res.data as DiscountResponse;
		},
		onSuccess: invalidate,
	});

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await api.discounts({ id }).delete();
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر حذف الخصم"));
			return res.data as DiscountResponse;
		},
		onSuccess: invalidate,
	});

	const statusMutation = useMutation({
		mutationFn: async ({ id, status }: { id: string; status: DiscountStatus }) => {
			const res = await api.discounts({ id }).status.patch({ status });
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر تحديث حالة الخصم"));
			return res.data as DiscountResponse;
		},
		onSuccess: invalidate,
	});

	const create = (payload: DiscountPayload) => {
		const promise = createMutation.mutateAsync(payload);
		toast.promise(promise, {
			loading: "جارٍ إنشاء الخصم...",
			success: "تم إنشاء الخصم بنجاح",
			error: (err: Error) => err.message || "فشل إنشاء الخصم",
		});
		return promise;
	};

	const update = (id: string, payload: DiscountPayload) => {
		const promise = updateMutation.mutateAsync({ id, payload });
		toast.promise(promise, {
			loading: "جارٍ تحديث الخصم...",
			success: "تم تحديث الخصم بنجاح",
			error: (err: Error) => err.message || "فشل تحديث الخصم",
		});
		return promise;
	};

	const remove = (id: string) => {
		const promise = deleteMutation.mutateAsync(id);
		toast.promise(promise, {
			loading: "جارٍ حذف الخصم...",
			success: "تم حذف الخصم بنجاح",
			error: (err: Error) => err.message || "فشل حذف الخصم",
		});
		return promise;
	};

	const setStatus = (id: string, status: DiscountStatus) => {
		const promise = statusMutation.mutateAsync({ id, status });
		toast.promise(promise, {
			loading: "جارٍ تحديث الحالة...",
			success: "تم تحديث الحالة بنجاح",
			error: (err: Error) => err.message || "فشل تحديث الحالة",
		});
		return promise;
	};

	return {
		create,
		update,
		remove,
		setStatus,
		isCreating: createMutation.isPending,
		isUpdating: updateMutation.isPending,
		isSaving: createMutation.isPending || updateMutation.isPending,
		isDeleting: deleteMutation.isPending,
		isSettingStatus: statusMutation.isPending,
	};
};
