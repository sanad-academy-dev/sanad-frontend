import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { CreateOwnerFormInput, OwnerResponse } from "@/server/owners/owners.type";

export const useCreateOwner = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (data: CreateOwnerFormInput): Promise<OwnerResponse> => {
			const res = await api.owners.post({
				name: data.name,
				phone: data.phone,
				email: data.email,
				gender: data.gender ?? undefined,
				country: data.country ?? undefined,
				city: data.city ?? undefined,
				address: data.address ?? undefined,
				notes: data.notes ?? undefined,
				active: data.active,
				patientIds: data.patientIds ?? undefined,
			});
			if (res.error) {
				const msg = (res.error.value as { message?: string })?.message || "فشل إضافة وليّ الأمر";
				throw new Error(msg);
			}
			return res.data as OwnerResponse;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["owners"] });
		},
	});

	const createOwner = (data: CreateOwnerFormInput): Promise<OwnerResponse> => {
		const promise = mutateAsync(data);
		toast.promise(promise, {
			loading: "جارٍ إضافة وليّ الأمر...",
			success: "تمت إضافة وليّ الأمر بنجاح",
			error: (err: Error) => err.message || "فشل إضافة وليّ الأمر",
		});
		return promise;
	};

	return { createOwner, isPending };
};
