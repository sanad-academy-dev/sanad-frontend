import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	CreateSupplierFormInput,
	SupplierResponse,
} from "@/server/suppliers/suppliers.type";

export const useCreateSupplier = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (data: CreateSupplierFormInput): Promise<SupplierResponse> => {
			const res = await api.suppliers.post({
				logo: data.logo || undefined,
				legalName: data.legalName,
				type: data.type,
				commercialReg: data.commercialReg || undefined,
				supplierCode: data.supplierCode || undefined,
				description: data.description || undefined,
				categories: data.categories,
				products: data.products,
				leadTimeDays: data.leadTimeDays,
				minOrderQty: data.minOrderQty,
				supportsReturns: data.supportsReturns,
				returnPolicy: data.returnPolicy || undefined,
				contactName: data.contactName,
				contactTitle: data.contactTitle || undefined,
				phone: data.phone,
				email: data.email || undefined,
				website: data.website || undefined,
				country: data.country || undefined,
				city: data.city || undefined,
				address: data.address || undefined,
				mapUrl: data.mapUrl || undefined,
			});
			if (res.error) {
				const msg = (res.error.value as { message?: string })?.message || "فشل إضافة المورد";
				throw new Error(msg);
			}
			return res.data as SupplierResponse;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["suppliers"] });
		},
	});

	const createSupplier = (data: CreateSupplierFormInput): Promise<SupplierResponse> => {
		const promise = mutateAsync(data);
		toast.promise(promise, {
			loading: "جارٍ إضافة المورد...",
			success: (supplier: SupplierResponse) => `تم إضافة المورد (${supplier.legalName}) بنجاح`,
			error: (err: Error) => err.message || "فشل إضافة المورد",
		});
		return promise;
	};

	return { createSupplier, isPending };
};
