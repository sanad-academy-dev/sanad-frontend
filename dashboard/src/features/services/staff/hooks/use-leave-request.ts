import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	LeaveRequestResponse,
	SendLeaveEmailFormInput,
} from "@/server/leave-requests/leave-requests.type";

// جلب قائمة طلبات الإجازات
export const useLeaveRequests = () => {
	const { data, isLoading, refetch, isFetching } = useQuery<LeaveRequestResponse[]>({
		queryKey: ["leave-requests"],
		queryFn: async () => {
			const res = await api["leave-requests"].get();
			if (res.error) throw new Error("فشل تحميل الطلبات");
			return res.data as LeaveRequestResponse[];
		},
	});
	return { requests: data ?? [], isLoading, refetch, isFetching };
};

// جلب طلب إجازة واحد
export const useLeaveRequest = (id: string | null) => {
	const { data, isLoading } = useQuery<LeaveRequestResponse>({
		queryKey: ["leave-requests", id],
		enabled: !!id,
		queryFn: async () => {
			const res = await api["leave-requests"]({ id: id as string }).get();
			if (res.error) throw new Error("فشل تحميل الطلب");
			return res.data as LeaveRequestResponse;
		},
	});
	return { request: data, isLoading };
};

// اعتماد/رفض طلب إجازة
export const useLeaveRequestActions = (id: string | null) => {
	const queryClient = useQueryClient();

	const onSuccess = () => {
		queryClient.invalidateQueries({ queryKey: ["leave-requests"] });
		queryClient.invalidateQueries({ queryKey: ["attendance"] });
	};

	const approveMutation = useMutation({
		mutationFn: async () => {
			const res = await api["leave-requests"]({ id: id as string }).approve.post();
			if (res.error) throw new Error("فشل الاعتماد");
			return res.data;
		},
		onSuccess,
	});

	const rejectMutation = useMutation({
		mutationFn: async () => {
			const res = await api["leave-requests"]({ id: id as string }).reject.post();
			if (res.error) throw new Error("فشل الرفض");
			return res.data;
		},
		onSuccess,
	});

	const sendEmailMutation = useMutation({
		mutationFn: async (input: SendLeaveEmailFormInput) => {
			const res = await api["leave-requests"]({ id: id as string })["send-email"].post(input);
			if (res.error) throw new Error("فشل إرسال البريد");
			return res.data;
		},
		onSuccess,
	});

	// silent: يكتم التوست الافتراضي (يُستخدم عند عرض توست مخصّص من المكوّن)
	const approve = (opts?: { silent?: boolean }) => {
		const promise = approveMutation.mutateAsync();
		if (!opts?.silent) {
			toast.promise(promise, {
				loading: "جارٍ الاعتماد...",
				success: "تم اعتماد طلب الإجازة",
				error: (err: Error) => err.message || "فشل الاعتماد",
				position: "bottom-left",
			});
		}
		return promise;
	};

	// silent: يكتم التوست الافتراضي (يُستخدم عند عرض توست مخصّص من المكوّن)
	const reject = (opts?: { silent?: boolean }) => {
		const promise = rejectMutation.mutateAsync();
		if (!opts?.silent) {
			toast.promise(promise, {
				loading: "جارٍ الرفض...",
				success: "تم رفض طلب الإجازة",
				error: (err: Error) => err.message || "فشل الرفض",
				position: "bottom-left",
			});
		}
		return promise;
	};

	// الإشعار يُعرض من المكوّن (توست مخصّص) لتوفّر اسم الموظف
	const sendEmail = (input: SendLeaveEmailFormInput) => sendEmailMutation.mutateAsync(input);

	return {
		approve,
		reject,
		sendEmail,
		isPending: approveMutation.isPending || rejectMutation.isPending,
		isSending: sendEmailMutation.isPending,
	};
};
