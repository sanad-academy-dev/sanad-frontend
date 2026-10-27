import { useQuery } from "@tanstack/react-query";
import { backendFetch } from "@/lib/backend-fetch";
import type { ClassroomResponse, ClassroomStatsResponse } from "@/server/classrooms/classrooms.type";

export const useClassrooms = (search?: string) => {
	const { data, isLoading, refetch } = useQuery<ClassroomResponse[]>({
		queryKey: ["classrooms", search],
		queryFn: async () => {
			const queryParam = search ? `?search=${encodeURIComponent(search)}` : "";
			const res = await backendFetch(`/api/classrooms${queryParam}`);
			if (!res.ok) throw new Error("فشل جلب قائمة الفصول");
			return res.json();
		},
		staleTime: 1000 * 60 * 2,
	});

	return { classrooms: data ?? [], isLoading, refetch };
};

export const useClassroomStats = () => {
	const { data, isLoading } = useQuery<ClassroomStatsResponse>({
		queryKey: ["classrooms", "stats"],
		queryFn: async () => {
			const res = await backendFetch("/api/classrooms/stats");
			if (!res.ok) throw new Error("فشل جلب إحصائيات الفصول");
			return res.json();
		},
		staleTime: 1000 * 60 * 2,
	});

	return {
		stats: data ?? {
			totalClassrooms: 0,
			activeClassrooms: 0,
			totalCapacity: 0,
			enrolledStudents: 0,
		},
		isLoading,
	};
};

export const useClassroom = (id?: string) => {
	const { data, isLoading, refetch } = useQuery<ClassroomResponse | null>({
		queryKey: ["classrooms", id],
		queryFn: async () => {
			if (!id) return null;
			const res = await backendFetch(`/api/classrooms/${id}`);
			if (!res.ok) throw new Error("فشل جلب بيانات الفصل");
			return res.json();
		},
		enabled: Boolean(id),
	});

	return { classroom: data, isLoading, refetch };
};

export const useClassroomClassifications = () => {
	const { data, isLoading, refetch } = useQuery<string[]>({
		queryKey: ["classrooms", "classifications"],
		queryFn: async () => {
			const res = await backendFetch("/api/classrooms/classifications");
			if (!res.ok) throw new Error("فشل جلب تصنيفات الفصول");
			return res.json();
		},
		staleTime: 1000 * 60 * 5,
	});

	return {
		classifications: data ?? [
			"برمجة",
			"ذكاء اصطناعي",
			"روبوتكس",
			"إدارة أعمال",
		],
		isLoading,
		refetch,
	};
};
