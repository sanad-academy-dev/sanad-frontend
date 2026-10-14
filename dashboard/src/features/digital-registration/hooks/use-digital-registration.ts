import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { backendFetch } from "@/lib/backend-fetch";
import type { Campaign, CampaignSummaryStats } from "../types/campaign.types";
import type { CampaignRequestItem, RequestNotificationItem } from "../types/campaign-request.types";

const CAMPAIGNS_QUERY_KEY = ["digital-registration", "campaigns"];
const SUMMARY_QUERY_KEY = ["digital-registration", "summary"];

// ─── جلب ملخص الإحصائيات ───────────────────────────────────────────────────────
export function useCampaignsSummary() {
	return useQuery<CampaignSummaryStats>({
		queryKey: SUMMARY_QUERY_KEY,
		queryFn: async () => {
			const res = await backendFetch("/api/digital-registration/campaigns/summary");
			if (!res.ok) throw new Error("فشل جلب إحصائيات التسجيل الرقمي");
			return res.json();
		},
		staleTime: 1000 * 60,
	});
}

// ─── جلب قائمة الحملات ─────────────────────────────────────────────────────────
export function useCampaigns() {
	return useQuery<Campaign[]>({
		queryKey: CAMPAIGNS_QUERY_KEY,
		queryFn: async () => {
			const res = await backendFetch("/api/digital-registration/campaigns");
			if (!res.ok) throw new Error("فشل جلب حملات التسجيل");
			return res.json();
		},
		staleTime: 1000 * 60,
	});
}

// ─── جلب تفاصيل حملة معينة ────────────────────────────────────────────────────
export function useCampaignDetails(campaignId: string) {
	return useQuery<Campaign>({
		queryKey: ["digital-registration", "campaign", campaignId],
		queryFn: async () => {
			const res = await backendFetch(`/api/digital-registration/campaigns/${campaignId}`);
			if (!res.ok) throw new Error("فشل جلب تفاصيل الحملة");
			return res.json();
		},
		enabled: !!campaignId,
		staleTime: 1000 * 60,
	});
}

// ─── إنشاء حملة جديدة ──────────────────────────────────────────────────────────
export function useCreateCampaign() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: Partial<Campaign>) => {
			const res = await backendFetch("/api/digital-registration/campaigns", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل إنشاء الحملة");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: SUMMARY_QUERY_KEY });
		},
	});
}

// ─── تعديل حملة ────────────────────────────────────────────────────────────────
export function useUpdateCampaign() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, data }: { id: string; data: Partial<Campaign> }) => {
			const res = await backendFetch(`/api/digital-registration/campaigns/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل تعديل الحملة");
			}
			return res.json();
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: SUMMARY_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "campaign", variables.id] });
		},
	});
}

// ─── حذف حملة ────────────────────────────────────────────────────────────────
export function useDeleteCampaign() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await backendFetch(`/api/digital-registration/campaigns/${id}`, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error("فشل حذف الحملة");
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: SUMMARY_QUERY_KEY });
		},
	});
}

// ─── جلب طلبات الحملة (للكانبان) ────────────────────────────────────────────────
export function useCampaignRequests(campaignId: string) {
	return useQuery<CampaignRequestItem[]>({
		queryKey: ["digital-registration", "requests", campaignId],
		queryFn: async () => {
			const res = await backendFetch(`/api/digital-registration/campaigns/${campaignId}/requests`);
			if (!res.ok) throw new Error("فشل جلب طلبات الحملة");
			return res.json();
		},
		enabled: !!campaignId,
		staleTime: 1000 * 30,
	});
}

// ─── تحديث حالة الطلب في الكانبان / اتخاذ القرار ───────────────────────────────
export function useUpdateRequestStatus(campaignId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			requestId,
			status,
			note,
		}: {
			requestId: string;
			status: string;
			note?: string;
		}) => {
			const res = await backendFetch(`/api/digital-registration/requests/${requestId}/status`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status, note }),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل تحديث حالة الطلب");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "requests", campaignId] });
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "campaign", campaignId] });
			queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: SUMMARY_QUERY_KEY });
		},
	});
}

// ─── إضافة تعليق داخلي ─────────────────────────────────────────────────────────
export function useAddRequestComment(campaignId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ requestId, content }: { requestId: string; content: string }) => {
			const res = await backendFetch(`/api/digital-registration/requests/${requestId}/comments`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content }),
			});
			if (!res.ok) throw new Error("فشل إضافة التعليق");
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "requests", campaignId] });
		},
	});
}

// ─── حذف تعليق داخلي ──────────────────────────────────────────────────────────
export function useDeleteRequestComment(campaignId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (commentId: string) => {
			const res = await backendFetch(`/api/digital-registration/comments/${commentId}`, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error("فشل حذف التعليق");
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "requests", campaignId] });
		},
	});
}

// ─── إنشاء طلب تسجيل يدوي جديد من الداشبورد ──────────────────────────────────
export function useCreateRequest(campaignId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: {
			campaignId: string;
			studentName: string;
			gender: "MALE" | "FEMALE" | "UNKNOWN";
			birthDate?: string | null;
			ageLabel?: string | null;
			targetClass?: string | null;
			bloodType?: string | null;
			allergies?: string | null;
			hasChronicDiseases?: boolean;
			chronicDiseases?: string | null;
			guardianName: string;
			guardianPhone: string;
			guardianEmail?: string | null;
			guardianNationalId?: string | null;
			source?: "WEBSITE" | "DIRECT_LINK" | "REFERRAL" | "SOCIAL" | "OTHER";
		}) => {
			const res = await backendFetch(`/api/digital-registration/requests`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل تسجيل طلب الطالب");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "requests", campaignId] });
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "campaign", campaignId] });
			queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: SUMMARY_QUERY_KEY });
		},
	});
}

// ─── تعديل بيانات طلب تسجيل إدارياً ─────────────────────────────────────────
export function useUpdateRequest(campaignId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			requestId,
			data,
		}: {
			requestId: string;
			data: Partial<{
				studentName: string;
				gender: "MALE" | "FEMALE" | "UNKNOWN";
				birthDate: string | null;
				ageLabel: string | null;
				targetClass: string | null;
				bloodType: string | null;
				allergies: string | null;
				hasChronicDiseases: boolean;
				chronicDiseases: string | null;
				guardianName: string;
				guardianPhone: string;
				guardianEmail: string | null;
				guardianNationalId: string | null;
			}>;
		}) => {
			const res = await backendFetch(`/api/digital-registration/requests/${requestId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل تعديل بيانات طلب التسجيل");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "requests", campaignId] });
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "campaign", campaignId] });
		},
	});
}

// ─── تثبيت موعد جلسة الفحص والتقييم في التقويم ────────────────────────────────
export function useScheduleAssessmentAppointment(campaignId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			requestId,
			data,
		}: {
			requestId: string;
			data: {
				staffId?: string;
				startsAt: string;
				durationMinutes?: number;
				notes?: string;
				branchId?: string;
			};
		}) => {
			const res = await backendFetch(`/api/digital-registration/requests/${requestId}/schedule-assessment`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل تثبيت وحجز موعد الفحص والتقييم");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "requests", campaignId] });
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "campaign", campaignId] });
			queryClient.invalidateQueries({ queryKey: ["appointments"] });
		},
	});
}

// ─── جلب سجل إشعارات طلب معين ────────────────────────────────────────────────
export function useRequestNotifications(requestId: string) {
	return useQuery<RequestNotificationItem[]>({
		queryKey: ["digital-registration", "notifications", requestId],
		queryFn: async () => {
			const res = await backendFetch(`/api/digital-registration/requests/${requestId}/notifications`);
			if (!res.ok) throw new Error("فشل جلب إشعارات المتقدم");
			return res.json();
		},
		enabled: !!requestId,
		staleTime: 1000 * 30, // 30 seconds
	});
}

// ─── تأكيد إرسال رسالة واتساب يدوياً من الشاشة ───────────────────────────────
export function useMarkNotificationSent(campaignId: string, requestId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (outboxId: string) => {
			const res = await backendFetch(
				`/api/digital-registration/requests/${requestId}/notifications/${outboxId}/mark-sent`,
				{
					method: "POST",
				},
			);
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل تأكيد إرسال الإشعار");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "notifications", requestId] });
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "requests", campaignId] });
		},
	});
}



