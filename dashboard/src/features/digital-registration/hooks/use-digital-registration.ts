import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { backendFetch } from "@/lib/backend-fetch";
import type { Campaign, CampaignSummaryStats } from "../types/campaign.types";
import type { CampaignRequestItem, RegistrationCommentItem, RequestNotificationItem } from "../types/campaign-request.types";

const CAMPAIGNS_QUERY_KEY = ["digital-registration", "campaigns"];
const SUMMARY_QUERY_KEY = ["digital-registration", "summary"];
const WORKSPACE_QUERY_KEY = ["digital-registration", "workspace"];

export type RegistrationReviewer = {
	/** معرّف المستخدم: يُخزَّن في assignedStaffId داخل طلب التسجيل. */
	id: string;
	userId: string;
	/** معرّف Staff: يُستخدم حصراً لحجز الموعد في التقويم. */
	staffId: string;
	name: string;
	image?: string | null;
	role: string;
	title?: string | null;
	phone?: string | null;
	isSystemManager?: boolean;
};

/** مراجعو التسجيل المؤهلون للحجز: مدير بسجل Staff أو عضو فريق can_edit فقط. */
export function useRegistrationReviewers() {
	return useQuery<RegistrationReviewer[]>({
		queryKey: ["digital-registration", "reviewers"],
		queryFn: async () => {
			const res = await backendFetch("/api/digital-registration/reviewers");
			if (!res.ok) throw new Error("فشل جلب قائمة المراجعين");
			return res.json();
		},
		staleTime: 1000 * 60,
	});
}

/** The dashboard has one registration board per clinic; the legacy campaign id stays internal. */
export function useRegistrationWorkspace() {
	return useQuery<{ id: string }>({
		queryKey: WORKSPACE_QUERY_KEY,
		queryFn: async () => {
			const res = await backendFetch("/api/digital-registration/workspace");
			if (!res.ok) throw new Error("فشل تجهيز لوحة التسجيل الرقمي");
			return res.json();
		},
		staleTime: 1000 * 60 * 5,
	});
}

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
export function useCampaignRequests(campaignId: string, sortBy?: string) {
	return useQuery<CampaignRequestItem[]>({
		queryKey: ["digital-registration", "requests", campaignId, sortBy],
		queryFn: async () => {
			const url = sortBy ? `/api/digital-registration/requests?sortBy=${encodeURIComponent(sortBy)}` : "/api/digital-registration/requests";
			const res = await backendFetch(url);
			if (!res.ok) throw new Error("فشل جلب طلبات الحملة");
			return res.json();
		},
		enabled: !!campaignId,
		staleTime: 1000 * 30,
		refetchInterval: 1000 * 30,
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
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "notifications"] });
			queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: SUMMARY_QUERY_KEY });
		},
	});
}

// ─── إضافة تعليق داخلي ─────────────────────────────────────────────────────────
export function useAddRequestComment(campaignId: string, defaultRequestId?: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: string | { requestId: string; content: string }) => {
			const requestId = typeof payload === "string" ? defaultRequestId : payload.requestId;
			const content = typeof payload === "string" ? payload : payload.content;
			if (!requestId) throw new Error("معرف الطلب غير متوفر لإضافة التعليق");
			if (!content?.trim()) throw new Error("محتوى التعليق لا يمكن أن يكون فارغاً");
			const res = await backendFetch(`/api/digital-registration/requests/${requestId}/comments`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content: content.trim() }),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل إضافة التعليق");
			}
			return res.json() as Promise<RegistrationCommentItem>;
		},
		onSuccess: (_newComment, payload) => {
			const reqId = typeof payload === "string" ? defaultRequestId : payload.requestId;
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "requests", campaignId] });
			if (reqId) {
				queryClient.invalidateQueries({ queryKey: ["digital-registration", "request", reqId] });
			}
		},
	});
}

// ─── حذف تعليق داخلي ──────────────────────────────────────────────────────────
export function useDeleteRequestComment(campaignId: string, _defaultRequestId?: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (commentId: string) => {
			const res = await backendFetch(`/api/digital-registration/comments/${commentId}`, {
				method: "DELETE",
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل حذف التعليق");
			}
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
			proposedTrack?: string | null;
			bloodType?: string | null;
			allergies?: string | null;
			hasChronicDiseases?: boolean;
			chronicDiseases?: string | null;
			guardianName: string;
			guardianPhone: string;
			guardianEmail?: string | null;
			guardianNationalId?: string | null;
			source?: "WEBSITE" | "DIRECT_LINK" | "REFERRAL" | "SOCIAL" | "OTHER";
			interviewMode?: "IN_CLINIC" | "REMOTE";
			existingPatientId?: string | null;
			existingOwnerId?: string | null;
			learningMode?: string | null;
			preferredShift?: string | null;
			experienceLevel?: string | null;
			priority?: string | null;
			initialStatus?: "QUEUE" | "SHORTLIST" | "WAITLIST" | "INTERVIEW" | "AWAITING_PAYMENT" | "DUPLICATE";
			status?: string | null;
			columnStatus?: string | null;
			appointmentDate?: string | null;
			reviewerId?: string | null;
			reviewerName?: string | null;
			roomId?: string | null;
			roomName?: string | null;
			notes?: string | null;
			notifyWhatsapp?: boolean;
			links?: Array<{ id?: string; title?: string; url: string }>;
			documents?: Array<{
				id?: string;
				title: string;
				fileUrl: string;
				fileSize?: string;
				type?: string;
			}>;
		}) => {
			let res: Response;
			try {
				res = await backendFetch(`/api/digital-registration/requests`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				});
			} catch (error) {
				if (error instanceof TypeError) {
					throw new Error("تعذر الاتصال بخادم النظام. تأكد من تشغيل خدمة الباك ثم أعد المحاولة.");
				}
				throw error;
			}
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
			queryClient.invalidateQueries({ queryKey: ["patients"] });
			queryClient.invalidateQueries({ queryKey: ["owners"] });
			queryClient.invalidateQueries({ queryKey: ["appointments"] });
		},
	});
}

// ─── حذف طلب تسجيل نهائياً ──────────────────────────────────────────────────
export function useDeleteRegistrationRequest(campaignId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (requestId: string) => {
			const res = await backendFetch(`/api/digital-registration/requests/${requestId}`, {
				method: "DELETE",
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل حذف طلب التسجيل");
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
				proposedTrack: string | null;
				bloodType: string | null;
				allergies: string | null;
				hasChronicDiseases: boolean;
				chronicDiseases: string | null;
				guardianName: string;
				guardianPhone: string;
				guardianEmail: string | null;
				guardianNationalId: string | null;
				learningMode: string | null;
				preferredShift: string | null;
				experienceLevel: string | null;
				priority: string | null;
				appointmentDate: string | null;
				appointmentIsoDate: string | null;
				assignedStaffId: string | null;
				reviewerId: string | null;
				reviewerName: string | null;
				roomId: string | null;
				roomName: string | null;
				notes: string | null;
				notifyWhatsapp: boolean;
				links: Array<{ id?: string; title?: string; url: string }>;
				documents: Array<{
					id?: string;
					title: string;
					fileUrl: string;
					fileSize?: string;
					type?: string;
				}>;
			}>;
		}) => {
			let res: Response;
			try {
				res = await backendFetch(`/api/digital-registration/requests/${requestId}`, {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				});
			} catch (error) {
				// لا نعرض رسالة المتصفح العامة Failed to fetch؛ فهي غالباً تعني أن API غير متاح.
				if (error instanceof TypeError) {
					throw new Error("تعذر الاتصال بخادم النظام. تأكد من تشغيل خدمة الباك ثم أعد المحاولة.");
				}
				throw error;
			}
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل تعديل بيانات طلب التسجيل");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "requests", campaignId] });
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "campaign", campaignId] });
			queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: SUMMARY_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: ["patients"] });
			queryClient.invalidateQueries({ queryKey: ["owners"] });
			queryClient.invalidateQueries({ queryKey: ["appointments"] });
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
				roomId?: string;
				roomName?: string;
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
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "notifications"] });
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




// ─── Phase 1: Action Hooks ───────────────────────────────────────────────────

export function useShortlistRequest(campaignId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			requestId,
			data,
		}: {
			requestId: string;
			data: {
				targetClass?: string | null;
				priority?: string | null;
				assignedStaffId?: string | null;
				customMessage?: string;
				notifyEmail?: boolean;
			};
		}) => {
			const res = await backendFetch(`/api/digital-registration/requests/${requestId}/shortlist`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل تسجيل الطالب بالقائمة المختصرة");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "requests", campaignId] });
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "summary"] });
		},
	});
}

export function useWaitlistRequest(campaignId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			requestId,
			data,
		}: {
			requestId: string;
			data: {
				assignedStaffId?: string | null;
				priority?: string | null;
				reason?: string;
				subject?: string;
				customMessage?: string;
				notifyEmail?: boolean;
			};
		}) => {
			const res = await backendFetch(`/api/digital-registration/requests/${requestId}/waitlist`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل إدراج الطالب في قائمة الانتظار");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "requests", campaignId] });
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "summary"] });
		},
	});
}

export function useAwaitingPaymentRequest(campaignId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			requestId,
			data,
		}: {
			requestId: string;
			data: {
				subscriptionPlanId?: string | null;
				subscriptionPlanName?: string | null;
				subscriptionAmount?: number | null;
				includeMeals?: boolean;
				enableDailyStipend?: boolean;
				priority?: string | null;
				assignedStaffId?: string | null;
				subject?: string;
				customMessage?: string;
				notifyEmail?: boolean;
				notes?: string;
			};
		}) => {
			const res = await backendFetch(`/api/digital-registration/requests/${requestId}/awaiting-payment`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل نقل الطلب إلى بانتظار الدفع");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "requests", campaignId] });
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "summary"] });
		},
	});
}

export function useRescheduleRequest(campaignId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			requestId,
			data,
		}: {
			requestId: string;
			data: {
				reason: string;
				customReason?: string;
				newAppointmentDate: string;
				staffId?: string | null;
				interviewMode?: "IN_CLINIC" | "REMOTE";
				roomId?: string | null;
				subject?: string;
				customMessage?: string;
				notifyEmail?: boolean;
			};
		}) => {
			const res = await backendFetch(`/api/digital-registration/requests/${requestId}/reschedule`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل إعادة جدولة الموعد");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "requests", campaignId] });
			queryClient.invalidateQueries({ queryKey: ["appointments"] });
		},
	});
}

export function useRejectRequest(campaignId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			requestId,
			data,
		}: {
			requestId: string;
			data: {
				reason: string;
				notes?: string;
				subject?: string;
				customMessage?: string;
				notifyEmail?: boolean;
			};
		}) => {
			const res = await backendFetch(`/api/digital-registration/requests/${requestId}/reject`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل إرسال قرار الرفض");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "requests"] });
			if (campaignId) {
				queryClient.invalidateQueries({ queryKey: ["digital-registration", "requests", campaignId] });
				queryClient.invalidateQueries({ queryKey: ["digital-registration", "campaign", campaignId] });
			}
			queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: SUMMARY_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: ["appointments"] });
		},
	});
}

export function useReferRequest(campaignId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			requestId,
			data,
		}: {
			requestId: string;
			data: {
				referredToStaffId: string;
				reason: string;
				notifyEmail?: boolean;
				notifyGuardian?: boolean;
				customMessage?: string;
				subject?: string;
			};
		}) => {
			const res = await backendFetch(`/api/digital-registration/requests/${requestId}/refer`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل إحالة الطالب");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "requests", campaignId] });
		},
	});
}


export function useDeleteRequestWithReason(campaignId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			requestId,
			data,
		}: {
			requestId: string;
			data: {
				reason?: string;
				notes?: string;
				notifyEmail?: boolean;
			};
		}) => {
			const res = await backendFetch(`/api/digital-registration/requests/${requestId}/delete-with-reason`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل حذف طلب التسجيل");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "requests"] });
			if (campaignId) {
				queryClient.invalidateQueries({ queryKey: ["digital-registration", "requests", campaignId] });
				queryClient.invalidateQueries({ queryKey: ["digital-registration", "campaign", campaignId] });
			}
			queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: SUMMARY_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: ["appointments"] });
		},
	});
}

export function useQuickUpdateRequest(campaignId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			requestId,
			data,
		}: {
			requestId: string;
			data: {
				proposedTrack?: string | null;
				targetClass?: string | null;
				interviewDurationMinutes?: number;
				subscriptionPlanId?: string | null;
				subscriptionPlanName?: string | null;
				subscriptionAmount?: number | null;
				includeMeals?: boolean;
				enableDailyStipend?: boolean;
				allergies?: string | null;
				allergiesList?: unknown;
				medications?: unknown;
				assignedStaffId?: string | null;
				notes?: string | null;
				attendanceProbability?: number;
			};
		}) => {
			const res = await backendFetch(`/api/digital-registration/requests/${requestId}/quick-update`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل التحديث السريع للطلب");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "requests", campaignId] });
		},
	});
}

export function useAssignReviewer(campaignId: string = "") {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ requestId, staffId }: { requestId: string; staffId: string }) => {
			const res = await backendFetch(`/api/digital-registration/requests/${requestId}/assign-reviewer`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ staffId }),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل تعيين المراجع");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["digital-registration", "requests", campaignId] });
		},
	});
}


// ─── ميزة المشاركة والوصول للوحة التسجيل (Share Modal) ────────────────────────

export type {
	ShareAccessAuditEntry,
	ShareAccessLevel,
	ShareAccessMember,
	ShareAccessResponse,
	ShareGeneralAccess,
	StaffCandidate,
	UpdateMemberAccessResult,
} from "../types/campaign-share.types";

const SHARE_ACCESS_QUERY_KEY = ["digital-registration", "share-access"];
const SHARE_ACCESS_AUDIT_QUERY_KEY = ["digital-registration", "share-access", "audit"];

export function useRegistrationShareAccess(_campaignId?: string) {
	return useQuery<import("../types/campaign-share.types").ShareAccessResponse>({
		// إدارة الوصول تخص مساحة التسجيل الواحدة، لذلك لا نجزئ الـ cache بحسب حملة.
		queryKey: SHARE_ACCESS_QUERY_KEY,
		queryFn: async () => {
			const res = await backendFetch("/api/digital-registration/share-access");
			if (!res.ok) throw new Error("فشل جلب بيانات مشاركة اللوحة");
			return res.json();
		},
		staleTime: 1000 * 60,
	});
}

export function useStaffCandidates(search?: string, enabled = true) {
	return useQuery<import("../types/campaign-share.types").StaffCandidate[]>({
		queryKey: ["digital-registration", "staff-candidates", search],
		enabled,
		queryFn: async () => {
			const url = search
				? `/api/digital-registration/staff-candidates?search=${encodeURIComponent(search)}`
				: "/api/digital-registration/staff-candidates";
			const res = await backendFetch(url);
			if (!res.ok) throw new Error("فشل جلب قائمة موظفي الأكاديمية");
			return res.json();
		},
		staleTime: 1000 * 30,
	});
}

export function useRegistrationShareAccessAudit(enabled = true) {
	return useQuery<import("../types/campaign-share.types").ShareAccessAuditEntry[]>({
		queryKey: SHARE_ACCESS_AUDIT_QUERY_KEY,
		enabled,
		queryFn: async () => {
			const res = await backendFetch("/api/digital-registration/share-access/audit?limit=20");
			if (!res.ok) throw new Error("فشل جلب سجل تدقيق صلاحيات التسجيل");
			return res.json();
		},
		staleTime: 1000 * 30,
	});
}

export function useInviteCollaborator() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: { staffId: string; accessLevel: "can_edit" | "can_view" }) => {
			const res = await backendFetch("/api/digital-registration/share-access/invite", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشلت إضافة الموظف إلى فريق التسجيل");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: SHARE_ACCESS_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: SHARE_ACCESS_AUDIT_QUERY_KEY });
		},
	});
}

export function useUpdateMemberAccess() {
	const queryClient = useQueryClient();
	return useMutation<
		import("../types/campaign-share.types").UpdateMemberAccessResult,
		Error,
		{ memberId: string; accessLevel: "can_edit" | "can_view" | "remove" }
	>({
		mutationFn: async ({
			memberId,
			accessLevel,
		}: {
			memberId: string;
			accessLevel: "can_edit" | "can_view" | "remove";
		}) => {
			const res = await backendFetch(`/api/digital-registration/share-access/${memberId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ accessLevel }),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل تعديل صلاحية العضو");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: SHARE_ACCESS_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: SHARE_ACCESS_AUDIT_QUERY_KEY });
		},
	});
}

export function useUpdateGeneralAccess() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			level,
		}: {
			level: "restricted";
		}) => {
			const res = await backendFetch("/api/digital-registration/share-access/general", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ level }),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل تعديل الوصول العام");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: SHARE_ACCESS_QUERY_KEY });
		},
	});
}

export { useDigitalRegistrationCapabilities } from "./use-digital-registration-capabilities";
