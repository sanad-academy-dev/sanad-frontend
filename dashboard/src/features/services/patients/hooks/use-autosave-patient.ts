import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { PatientResponse, UpdatePatientInput } from "@/server/patients/patients.type";

// نوع النقل لا نوع الـ DAO: `birthDate` يسافر نصًّا (YYYY-MM-DD) بينما نوع Prisma
// يقبل `Date | string`. تثبيت النص هنا يمنع تسرّب كائن Date إلى الطلب وإلى الكاش.
export type PatientAutosaveInput = Omit<UpdatePatientInput, "ownerId" | "birthDate"> & {
	birthDate?: string | null;
};

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
			await queryClient.cancelQueries({ queryKey: ["patients"] });
			const previous = queryClient.getQueryData<PatientResponse[]>(["patients"]);
			if (previous) {
				queryClient.setQueryData<PatientResponse[]>(
					["patients"],
					previous.map((row) =>
						row.id === patientId
							? {
									...row,
									...input,
									// الكاش يحمل Date؛ الإدخال نص — التحويل صريح كي لا يتسرّب
									// نص إلى حقل تاريخ فينكسر التنسيق عند العرض
									birthDate:
										input.birthDate === undefined
											? row.birthDate
											: input.birthDate
												? new Date(input.birthDate)
												: null,
								}
							: row,
					),
				);
			}
			return { previous };
		},
		onError: (err: Error, _input, ctx) => {
			if (ctx?.previous) queryClient.setQueryData(["patients"], ctx.previous);
			toast.error(err.message || "فشل الحفظ");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["patients"] });
		},
	});

	return { autosave: mutation.mutate, isPending: mutation.isPending };
};
