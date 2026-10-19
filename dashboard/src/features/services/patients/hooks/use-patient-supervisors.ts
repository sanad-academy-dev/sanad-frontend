import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { backendFetch } from "@/lib/backend-fetch";
import type { PatientSupervisorResponse } from "@/server/patients/patients.type";

export const patientSupervisorsKey = (patientId: string) => ["patient-supervisors", patientId];

export function usePatientSupervisors(patientId: string) {
	const queryClient = useQueryClient();

	const { data, isLoading, error, refetch } = useQuery<PatientSupervisorResponse[]>({
		queryKey: patientSupervisorsKey(patientId),
		enabled: !!patientId,
		staleTime: 1000 * 60 * 2,
		queryFn: async () => {
			const res = await backendFetch(`api/patients/${patientId}/supervisors`);
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل تحميل مسؤولي الطالب");
			}
			return (await res.json()) as PatientSupervisorResponse[];
		},
	});

	const assignMutation = useMutation({
		mutationFn: async ({ staffId, role }: { staffId: string; role?: string }) => {
			const res = await backendFetch(`api/patients/${patientId}/supervisors`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ staffId, role }),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل تعيين المسؤول");
			}
			return (await res.json()) as PatientSupervisorResponse[];
		},
		onSuccess: (updated) => {
			queryClient.setQueryData(patientSupervisorsKey(patientId), updated);
			queryClient.invalidateQueries({ queryKey: patientSupervisorsKey(patientId) });
		},
	});

	const removeMutation = useMutation({
		mutationFn: async (staffId: string) => {
			const res = await backendFetch(`api/patients/${patientId}/supervisors/${staffId}`, {
				method: "DELETE",
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل إزالة المسؤول");
			}
			return (await res.json()) as PatientSupervisorResponse[];
		},
		onSuccess: (updated) => {
			queryClient.setQueryData(patientSupervisorsKey(patientId), updated);
			queryClient.invalidateQueries({ queryKey: patientSupervisorsKey(patientId) });
		},
	});

	const assignSupervisor = async (staffId: string, role?: string, staffName?: string) => {
		try {
			await assignMutation.mutateAsync({ staffId, role });
			toast.success(`تم تعيين ${staffName || "الموظف"} كمسؤول بنجاح`);
		} catch (err: any) {
			toast.error(err.message || "تعذر تعيين المسؤول");
		}
	};

	const removeSupervisor = async (staffId: string, staffName?: string) => {
		try {
			await removeMutation.mutateAsync(staffId);
			toast.success(`تم إزالة ${staffName || "المسؤول"} بنجاح`);
		} catch (err: any) {
			toast.error(err.message || "تعذر إزالة المسؤول");
		}
	};

	return {
		supervisors: data ?? [],
		isLoading,
		error,
		refetch,
		assignSupervisor,
		removeSupervisor,
		isAssigning: assignMutation.isPending,
		isRemoving: removeMutation.isPending,
	};
}
