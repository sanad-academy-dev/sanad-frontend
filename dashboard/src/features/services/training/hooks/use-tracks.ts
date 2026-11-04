import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { backendFetch } from "@/lib/backend-fetch";
import type { TrackRow } from "../components/tracks-view";

export interface TrackStats {
	totalTracks: number;
	totalStudents: number;
	pendingTracks: number;
	completedTracks: number;
	totalRevenue: number;
}

interface TrackPage {
	items: TrackRow[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

export interface CreateTrackInput {
	name: string;
	code?: string;
	category?: string;
	coursesCount?: number;
	locationMode?: "ONLINE" | "IN_PERSON" | "HYBRID";
	locationLabel?: string;
	duration?: string;
	price?: number;
	status?: "ACTIVE" | "PENDING" | "COMPLETED" | "DRAFT";
	description?: string;
	notes?: string;
	academicStage?: string;
	ageGroup?: string;
	selectedIcon?: string;
	selectedColor?: string;
}

export interface UpdateTrackInput extends Partial<CreateTrackInput> {}

export const useTracks = (
	search?: string,
	page?: number,
	pageSize?: number,
	includeStudents = false,
	enabled = true,
) => {
	const { data, isLoading, refetch } = useQuery<TrackPage | TrackRow[]>({
		queryKey: ["tracks", search, page, pageSize, includeStudents],
		queryFn: async () => {
			const params = new URLSearchParams();
			if (search) params.set("search", search);
			if (page) params.set("page", String(page));
			if (pageSize) params.set("pageSize", String(pageSize));
			if (includeStudents) params.set("includeStudents", "true");
			const queryParam = params.toString() ? `?${params.toString()}` : "";
			const res = await backendFetch(`/api/tracks${queryParam}`);
			if (!res.ok) throw new Error("فشل جلب قائمة المسارات التدريبية");
			return res.json();
		},
		enabled,
		staleTime: 1000 * 60 * 2,
	});

	const tracks = Array.isArray(data) ? data : (data?.items ?? []);

	return {
		tracks,
		total: Array.isArray(data) ? tracks.length : (data?.total ?? tracks.length),
		page: Array.isArray(data) ? 1 : (data?.page ?? 1),
		pageSize: Array.isArray(data) ? tracks.length : (data?.pageSize ?? tracks.length),
		totalPages: Array.isArray(data) ? 1 : (data?.totalPages ?? 1),
		isLoading,
		refetch,
	};
};

export const useTrackStats = () => {
	const { data, isLoading, refetch } = useQuery<TrackStats>({
		queryKey: ["tracks", "stats"],
		queryFn: async () => {
			const res = await backendFetch("/api/tracks/stats");
			if (!res.ok) throw new Error("فشل جلب إحصائيات المسارات");
			return res.json();
		},
		staleTime: 1000 * 60 * 2,
	});

	return {
		stats: data ?? {
			totalTracks: 0,
			totalStudents: 0,
			pendingTracks: 0,
			completedTracks: 0,
			totalRevenue: 0,
		},
		isLoading,
		refetch,
	};
};

export const useTrack = (id?: string, enabled = true) => {
	const { data, isLoading, refetch } = useQuery<TrackRow | null>({
		queryKey: ["tracks", id],
		queryFn: async () => {
			if (!id) return null;
			const res = await backendFetch(`/api/tracks/${id}`);
			if (!res.ok) throw new Error("فشل جلب بيانات المسار");
			return res.json();
		},
		enabled: Boolean(id) && enabled,
	});

	return { track: data ?? null, isLoading, refetch };
};

export const useCreateTrack = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateTrackInput) => {
			const res = await backendFetch("/api/tracks", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل إنشاء المسار التدريبي");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tracks"] });
			toast.success("تم إنشاء المسار التدريبي وحفظه في قاعدة البيانات بنجاح");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

export const useUpdateTrack = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, data }: { id: string; data: UpdateTrackInput }) => {
			const res = await backendFetch(`/api/tracks/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل تحديث بيانات المسار");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tracks"] });
			toast.success("تم تحديث المسار التدريبي بنجاح");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

export const useDeleteTrack = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const res = await backendFetch(`/api/tracks/${id}`, {
				method: "DELETE",
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل حذف المسار");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tracks"] });
			toast.success("تم حذف المسار بنجاح");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

export const useAssignTrackStudent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			trackId,
			studentId,
			notes,
		}: {
			trackId: string;
			studentId: string;
			notes?: string;
		}) => {
			const res = await backendFetch(`/api/tracks/${trackId}/assign`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ studentId, notes }),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل تسجيل الطالب في المسار");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tracks"] });
			toast.success("تم تسجيل الطالب في المسار التدريبي بنجاح");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

export const useAssignTrackStaff = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, staffIds }: { id: string; staffIds: string[] }) => {
			const res = await backendFetch(`/api/tracks/${id}/staff`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ staffIds }),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل تعيين الموظفين في المسار");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tracks"] });
			toast.success("تم تعيين الموظفين في المسار بنجاح");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};

export const useAssignTrackStudents = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, studentIds }: { id: string; studentIds: string[] }) => {
			const res = await backendFetch(`/api/tracks/${id}/students`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ studentIds }),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل تسجيل الطلاب في المسار");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tracks"] });
			queryClient.invalidateQueries({ queryKey: ["track-stats"] });
			toast.success("تم تسجيل الطلاب في المسار بنجاح");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};
