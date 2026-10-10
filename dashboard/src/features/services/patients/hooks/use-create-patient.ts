import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { CreatePatientFormInput, PatientResponse } from "@/server/patients/patients.type";

export const useCreatePatient = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (data: CreatePatientFormInput): Promise<PatientResponse> => {
			const res = await api.patients.post({
				name: data.name,
				gender: data.gender,
				animalTypeId: data.animalTypeId,
				animalStrainId: data.animalStrainId ?? undefined,
				ownerId: data.ownerId,
				// كان مفقودًا من الحمولة: الحقل موجود في النموذج منذ إضافته، لكن هذه
				// الدالة تعدّد الحقول يدويًا فسقط منها — فكان تاريخ الميلاد يُكتب في
				// الشاشة ولا يصل الخادم أبدًا. جعلُه إلزاميًا هو ما كشف السقوط.
				birthDate: data.birthDate,
				age: data.age ?? undefined,
				weight: data.weight ?? undefined,
				notes: data.notes ?? undefined,
				active: data.active,
			});
			if (res.error) {
				const msg = (res.error.value as { message?: string })?.message || "فشل إضافة الطفل";
				throw new Error(msg);
			}
			return res.data as PatientResponse;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["patients"] });
		},
	});

	const createPatient = (data: CreatePatientFormInput): Promise<PatientResponse> => {
		const promise = mutateAsync(data);
		toast.promise(promise, {
			loading: "جارٍ إضافة الطفل...",
			success: "تمت إضافة الطفل بنجاح",
			error: (err: Error) => err.message || "فشل إضافة الطفل",
		});
		return promise;
	};

	return { createPatient, isPending };
};
