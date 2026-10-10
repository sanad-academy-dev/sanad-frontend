import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { MobileBookingRequestStatus } from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import type { MobileRequestResponse } from "@/server/mobile-clinics/mobile-requests/mobile-requests.dao";

const EMPTY: MobileRequestResponse[] = [];

const errMsg = (e: unknown, fallback: string) =>
	(e as { value?: { message?: string } })?.value?.message || fallback;

export const useMobileRequests = (status?: MobileBookingRequestStatus) => {
	const { data, isLoading } = useQuery<MobileRequestResponse[]>({
		queryKey: ["mobile-requests", status ?? "all"],
		queryFn: async () => {
			const res = await api["mobile-requests"].get({ query: status ? { status } : {} });
			if (res.error) throw new Error("فشل جلب الطلبات");
			return res.data as MobileRequestResponse[];
		},
		/**
		 * البثّ اللحظي هو ما يحدّث هذا الطابور الآن (`mobile.request.*` في
		 * `use-fleet-stream`)، لا الاستطلاع.
		 *
		 * والاستطلاع باقٍ **شبكةَ أمان** بفاصل أطول: الناقل داخل العملية الواحدة، فإعادة
		 * تشغيل الخادم أو انقطاع SSE يفقد الأحداث التي مرّت أثناء الانقطاع — والمتصفّح
		 * يعيد الاتصال ولا يعيد ما فات. خمس دقائق تكفي لالتقاط ذلك بلا أن تُعيد الشاشة
		 * إلى الاستطلاع كآلية أساسية.
		 */
		refetchInterval: 300_000,
	});

	return { requests: Array.isArray(data) ? data : EMPTY, isLoading };
};

export const useMobileRequestMutations = () => {
	const queryClient = useQueryClient();
	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: ["mobile-requests"] });
		queryClient.invalidateQueries({ queryKey: ["mobile-dispatch-board"] });
	};

	const statusMut = useMutation({
		mutationFn: async (vars: {
			id: string;
			status: MobileBookingRequestStatus;
			rejectionReason?: string;
		}) => {
			const res = await api["mobile-requests"]({ id: vars.id }).status.patch({
				status: vars.status,
				rejectionReason: vars.rejectionReason,
			});
			if (res.error) throw new Error(errMsg(res.error, "فشل تحديث حالة الطلب"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const convertMut = useMutation({
		mutationFn: async (vars: {
			id: string;
			branchId: string;
			staffId: string;
			startsAt: string;
			durationMinutes: number;
			mobileUnitId?: string;
		}) => {
			const { id, ...body } = vars;
			const res = await api["mobile-requests"]({ id }).convert.post(body);
			if (res.error) throw new Error(errMsg(res.error, "فشل تحويل الطلب إلى زيارة"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const setStatus = (
		id: string,
		status: MobileBookingRequestStatus,
		rejectionReason?: string,
	) => {
		const p = statusMut.mutateAsync({ id, status, rejectionReason });
		toast.promise(p, {
			loading: "جارٍ التحديث...",
			success: "تم تحديث الطلب",
			error: (e: Error) => e.message || "فشل تحديث حالة الطلب",
		});
		return p;
	};

	const convert = (vars: {
		id: string;
		branchId: string;
		staffId: string;
		startsAt: string;
		durationMinutes: number;
		mobileUnitId?: string;
	}) => {
		const p = convertMut.mutateAsync(vars);
		toast.promise(p, {
			loading: "جارٍ تحويل الطلب...",
			success: "تم إنشاء الزيارة من الطلب",
			error: (e: Error) => e.message || "فشل تحويل الطلب إلى زيارة",
		});
		return p;
	};

	return { setStatus, convert, isMutating: statusMut.isPending || convertMut.isPending };
};
