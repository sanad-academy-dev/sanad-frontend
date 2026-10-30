import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { backendFetch } from "@/lib/backend-fetch";
import type {
	CreateClassroomInput,
	UpdateClassroomInput,
} from "@/server/classrooms/classrooms.type";

export const useCreateClassroom = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateClassroomInput) => {
			const res = await backendFetch("/api/classrooms", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل إضافة الفصل");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["classrooms"] });
			toast.success("تم إضافة الفصل بنجاح");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

export const useUpdateClassroom = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, data }: { id: string; data: UpdateClassroomInput }) => {
			const res = await backendFetch(`/api/classrooms/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل تحديث بيانات الفصل");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["classrooms"] });
			toast.success("تم تحديث الفصل بنجاح");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

export const useDeleteClassroom = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (args: string | { id: string; targetClassroomId?: string }) => {
			const id = typeof args === "string" ? args : args.id;
			const targetClassroomId = typeof args === "string" ? undefined : args.targetClassroomId;

			const res = await backendFetch(`/api/classrooms/${id}`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ targetClassroomId }),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل حذف الفصل");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["classrooms"] });
			queryClient.invalidateQueries({ queryKey: ["classroom-stats"] });
			queryClient.invalidateQueries({ queryKey: ["patients"] });
			toast.success("تم حذف الفصل بنجاح");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

export const useAssignClassroomStaff = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, staffIds }: { id: string; staffIds: string[] }) => {
			const res = await backendFetch(`/api/classrooms/${id}/staff`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ staffIds }),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل تعيين المعلمين للفصل");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["classrooms"] });
			toast.success("تم تحديث مشرفي ومعلمي الفصل بنجاح");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

export const useAssignClassroomStudents = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, studentIds }: { id: string; studentIds: string[] }) => {
			const res = await backendFetch(`/api/classrooms/${id}/students`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ studentIds }),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل تسجيل الطلاب في الفصل");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["classrooms"] });
			queryClient.invalidateQueries({ queryKey: ["patients"] });
			toast.success("تم تسجيل الطلاب في الفصل بنجاح");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

export const useAddClassroomClassification = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (name: string) => {
			const res = await backendFetch("/api/classrooms/classifications", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name }),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل إضافة التصنيف");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["classrooms", "classifications"] });
			toast.success("تم إضافة التصنيف وحفظه بنجاح");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

export const useDeleteClassroomClassification = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (name: string) => {
			const res = await backendFetch(
				`/api/classrooms/classifications/${encodeURIComponent(name)}`,
				{
					method: "DELETE",
				},
			);
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل إزالة التصنيف");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["classrooms", "classifications"] });
			toast.success("تم إزالة التصنيف بنجاح");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};
