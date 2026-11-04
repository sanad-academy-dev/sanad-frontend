import { useQuery } from "@tanstack/react-query";
import { backendFetch } from "@/lib/backend-fetch";
import type {
	ClassroomResponse,
	ClassroomStatsResponse,
} from "@/server/classrooms/classrooms.type";

interface ClassroomPage {
	items: ClassroomResponse[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

export const useClassrooms = (search?: string, page?: number, pageSize?: number) => {
	const { data, isLoading, refetch } = useQuery<ClassroomPage | ClassroomResponse[]>({
		queryKey: ["classrooms", search, page, pageSize],
		queryFn: async () => {
			const params = new URLSearchParams();
			if (search) params.set("search", search);
			if (page) params.set("page", String(page));
			if (pageSize) params.set("pageSize", String(pageSize));
			const queryParam = params.toString() ? `?${params.toString()}` : "";
			const res = await backendFetch(`/api/classrooms${queryParam}`);
			if (!res.ok) throw new Error("فشل جلب قائمة الفصول");
			return res.json();
		},
		staleTime: 1000 * 60 * 2,
	});

	const classrooms = Array.isArray(data) ? data : (data?.items ?? []);

	return {
		classrooms,
		total: Array.isArray(data) ? classrooms.length : (data?.total ?? classrooms.length),
		page: Array.isArray(data) ? 1 : (data?.page ?? 1),
		pageSize: Array.isArray(data) ? classrooms.length : (data?.pageSize ?? classrooms.length),
		totalPages: Array.isArray(data) ? 1 : (data?.totalPages ?? 1),
		isLoading,
		refetch,
	};
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
			"رياض الأطفال",
			"المرحلة الابتدائية",
			"المرحلة المتوسطة",
			"المرحلة الثانوية",
			"برمجة",
			"ذكاء اصطناعي",
		],
		isLoading,
		refetch,
	};
};

export const useAcademicStageOptions = () => {
	const { data, isLoading, refetch } = useQuery<Array<{ name: string; isActive: boolean }>>({
		queryKey: ["academic-stages"],
		queryFn: async () => {
			const res = await backendFetch("/api/classrooms/academic-stages");
			if (!res.ok) throw new Error("Failed to load academic stages");
			return res.json();
		},
		staleTime: 1000 * 60 * 5,
	});

	return {
		academicStages: (data ?? []).filter((stage) => stage.isActive).map((stage) => stage.name),
		isLoading,
		refetch,
	};
};
