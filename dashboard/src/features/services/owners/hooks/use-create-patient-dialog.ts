import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { CreatePatientFormInput, PatientResponse } from "@/server/patients/patients.type";

/**
 * مخطّط النموذج بلا وليّ الأمر — الحوار يُنشئ الطفل تحت وليّ أمر يعرفه سياقه.
 *
 * مشتقّ من نوع النموذج لا من `CreatePatientInput`: النموذج هو ما يملأه المستخدم
 * فعلًا، وفيه `birthDate` نصّ كما يصل من `<input type="date">` ويُرسَل. الاشتقاق من
 * نوع Prisma كان يجعل الحقل `string | Date` ويطلب تحويلًا لا معنى له هنا.
 */
type CreatePatientDialogInput = Omit<CreatePatientFormInput, "ownerId">;

export const useCreatePatientDialog = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (data: CreatePatientDialogInput): Promise<PatientResponse> => {
			const res = await api.patients.post({
				name: data.name,
				gender: data.gender,
				animalTypeId: data.animalTypeId,
				animalStrainId: data.animalStrainId ?? undefined,
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

	const createPatient = (data: CreatePatientDialogInput): Promise<PatientResponse> => {
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
