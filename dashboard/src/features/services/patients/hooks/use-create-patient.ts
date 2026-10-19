import type {
	CreatePatientFormInput,
	PatientResponse,
} from "@sanad/contracts/runtime/server/patients/patients.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";

export const useCreatePatient = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (data: CreatePatientFormInput): Promise<PatientResponse> => {
			const res = await api.patients.post({
				name: data.name,
				gender: data.gender,
				ownerId: data.ownerId?.trim() || undefined,
				guardianName: data.guardianName?.trim() || undefined,
				guardianRelationship: data.guardianRelationship?.trim() || undefined,
				guardianPhone: data.guardianPhone?.trim() || undefined,
				guardianEmail: data.guardianEmail?.trim() || undefined,
				emergencyContactPhone: data.emergencyContactPhone?.trim() || undefined,
				emergencyContactName: data.emergencyContactName?.trim() || undefined,
				age:
					data.age != null && !Number.isNaN(Number(data.age)) ? Number(data.age) : undefined,
				birthDate: data.birthDate,
				nationalId: data.nationalId?.trim() || undefined,
				classroom: data.classroom?.trim() || undefined,
				bloodType: data.bloodType?.trim() || undefined,
				developmentStatus: data.developmentStatus || undefined,
				allergies: data.allergies?.trim() || undefined,
				pocketMoneyEnabled: data.pocketMoneyEnabled ?? true,
				transportation: data.transportation?.trim() || undefined,
				feeType: data.feeType?.trim() || undefined,
				healthConditions: data.healthConditions?.trim() || undefined,
				previousNursery: data.previousNursery?.trim() || undefined,
				level: data.level?.trim() || undefined,
				learningMethod: data.learningMethod?.trim() || undefined,
				preferredShift: data.preferredShift?.trim() || undefined,
				address: data.address?.trim() || undefined,
				weight:
					data.weight != null && !Number.isNaN(Number(data.weight))
						? Number(data.weight)
						: undefined,
				notes: data.notes?.trim() || undefined,
				active: data.active ?? true,
				status: data.status || "ACTIVE",
				// biome-ignore lint/suspicious/noExplicitAny: eden contracts type definition is narrower than backend schema
			} as any);
			if (res.error) {
				const msg = (res.error.value as { message?: string })?.message || "فشل إضافة الطالب";
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
			loading: "جارٍ إضافة الطالب...",
			success: "تمت إضافة الطالب بنجاح",
			error: (err: Error) => err.message || "فشل إضافة الطالب",
		});
		return promise;
	};

	return { createPatient, isPending };
};
