import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	PatientResponse,
	UpdatePatientInput,
} from "@sanad/contracts/runtime/server/patients/patients.type";

export type PatientAutosaveInput = Omit<UpdatePatientInput, "ownerId" | "birthDate"> & {
	birthDate?: string | null;
};

function applyOptimisticUpdate(
	patient: PatientResponse,
	input: PatientAutosaveInput,
): PatientResponse {
	const {
		ownerIds: _ownerIds,
		guardians: _guardians,
		guardianRelationships: _guardianRelationships,
		birthDate,
		...rest
	} = input;

	return {
		...patient,
		...rest,
		birthDate:
			birthDate === undefined
				? patient.birthDate
				: birthDate || null,
	};
}

export const useAutosavePatient = (patientId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (data: PatientAutosaveInput) => {
			const res = await api.patients({ id: patientId }).patch(data);
			if (res.error) {
				const message =
					(res.error.value as { message?: string } | undefined)?.message ?? "فشل الحفظ";
				throw new Error(message);
			}
			return res.data as PatientResponse;
		},
		onMutate: async (input) => {
			await queryClient.cancelQueries({ queryKey: ["patients"], exact: true });
			await queryClient.cancelQueries({ queryKey: ["patients", patientId], exact: true });

			const previousList = queryClient.getQueryData<PatientResponse[]>(["patients"]);
			const previousSingle =
				queryClient.getQueryData<PatientResponse>(["patients", patientId]) ||
				previousList?.find((row) => row.id === patientId);

			// تحديث كاش الطالب الفردي بشكل متفائل
			queryClient.setQueryData<PatientResponse>(["patients", patientId], (old) => {
				const base = old || previousSingle;
				if (!base) return undefined;
				return applyOptimisticUpdate(base, input);
			});

			// تحديث كاش قائمة الطلاب بشكل متفائل
			if (previousList) {
				queryClient.setQueryData<PatientResponse[]>(
					["patients"],
					previousList.map((row) =>
						row.id === patientId ? applyOptimisticUpdate(row, input) : row,
					),
				);
			}

			return { previousList, previousSingle };
		},
		onSuccess: (updated) => {
			if (updated) {
				queryClient.setQueryData(["patients", patientId], updated);
				queryClient.setQueryData<PatientResponse[]>(["patients"], (old) =>
					old ? old.map((p) => (p.id === patientId ? updated : p)) : [updated],
				);
			}
			toast.success("تم حفظ التعديل بنجاح");
		},
		onError: (err: Error, _input, ctx) => {
			if (ctx?.previousList) queryClient.setQueryData(["patients"], ctx.previousList);
			if (ctx?.previousSingle) queryClient.setQueryData(["patients", patientId], ctx.previousSingle);
			toast.error(err.message || "فشل الحفظ");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["patients"], exact: true });
			queryClient.invalidateQueries({ queryKey: ["patients", patientId], exact: true });
		},
	});

	return { autosave: mutation.mutate, isPending: mutation.isPending };
};
