import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { AdCampaignStatus } from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import type {
	AdCampaignDetail,
	AdCreativeFormInput,
	CreateAdCampaignFormInput,
} from "@/server/ad-campaigns/ad-campaigns.type";

const errorMessage = (error: { value?: unknown } | null, fallback: string) => {
	const value = error?.value as { message?: string } | undefined;
	return value?.message ?? fallback;
};

export const useCreateAdCampaign = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: CreateAdCampaignFormInput) => {
			const res = await api["ad-campaigns"].post(input);
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر إنشاء الحملة"));
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["ad-campaigns"] });
		},
	});

	// `toast.promise` يعيد مقبض الإشعار لا نتيجة الطلب. المعالج يحتاج معرّف الحملة
	// المنشأة كي يحفظ نصّها بعدها مباشرة، فنُمسك الوعد أولًا ونمرّره للإشعار ثم
	// نعيده — إعادة ناتج `toast.promise` تُسلّم المتصل رقمًا يظنّه حملة.
	const createCampaign = (input: CreateAdCampaignFormInput) => {
		const promise = mutation.mutateAsync(input);
		toast.promise(promise, {
			loading: "جارٍ إنشاء الحملة...",
			success: "تم إنشاء الحملة",
			error: (err: Error) => err.message || "فشل إنشاء الحملة",
		});
		return promise;
	};

	return { createCampaign, isPending: mutation.isPending };
};

export const useUpdateAdCampaignStatus = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ id, status }: { id: string; status: AdCampaignStatus }) => {
			const res = await api["ad-campaigns"]({ id }).status.patch({ status });
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر تغيير حالة الحملة"));
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["ad-campaigns"] });
		},
	});

	const updateStatus = async (id: string, status: AdCampaignStatus) =>
		toast.promise(mutation.mutateAsync({ id, status }), {
			loading: "جارٍ تحديث الحالة...",
			success: "تم تحديث حالة الحملة",
			error: (err: Error) => err.message || "فشل تحديث الحالة",
		});

	return { updateStatus, isPending: mutation.isPending };
};

export const useDeleteAdCampaign = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await api["ad-campaigns"]({ id }).delete();
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر حذف الحملة"));
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["ad-campaigns"] });
		},
	});

	const deleteCampaign = async (id: string) =>
		toast.promise(mutation.mutateAsync(id), {
			loading: "جارٍ حذف الحملة...",
			success: "تم حذف الحملة",
			error: (err: Error) => err.message || "فشل حذف الحملة",
		});

	return { deleteCampaign, isPending: mutation.isPending };
};

export const useSaveAdCreative = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ id, ...body }: { id: string } & AdCreativeFormInput) => {
			const res = await api["ad-campaigns"]({ id }).creative.put(body);
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر حفظ نص الإعلان"));
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["ad-campaigns"] });
		},
	});

	return { saveCreative: mutation.mutateAsync, isPending: mutation.isPending };
};

export const useSetAdCampaignSchedule = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({
			id,
			...body
		}: {
			id: string;
			startsAt: string;
			endsAt: string;
			budgetKind: "DAILY" | "LIFETIME";
			budgetAmount: number;
			currency?: string;
		}) => {
			const res = await api["ad-campaigns"]({ id }).schedule.patch(body);
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر حفظ الجدولة والميزانية"));
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["ad-campaigns"] });
		},
	});

	return { setSchedule: mutation.mutateAsync, isPending: mutation.isPending };
};

export const useLaunchAdCampaign = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await api["ad-campaigns"]({ id }).launch.post();
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر إطلاق الحملة"));
			return res.data as { summary: string };
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["ad-campaigns"] });
		},
	});

	return {
		launch: mutation.mutateAsync,
		isPending: mutation.isPending,
		error: mutation.error as Error | null,
	};
};

export const useAdCampaignDetail = (id: string | null) => {
	const { data, isLoading } = useQuery<AdCampaignDetail>({
		queryKey: ["ad-campaigns", "detail", id],
		enabled: !!id,
		queryFn: async () => {
			const res = await api["ad-campaigns"]({ id: id as string }).get();
			if (res.error) throw new Error("فشل تحميل الحملة");
			return res.data as AdCampaignDetail;
		},
	});

	return { campaign: data, isLoading };
};

export const useUpdateAdCampaign = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({
			id,
			...body
		}: { id: string } & Partial<{
			name: string;
			objective: string;
			socialAccountId: string | null;
			audienceId: string | null;
			branchId: string | null;
		}>) => {
			const res = await api["ad-campaigns"]({ id }).patch(body as never);
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر تحديث الحملة"));
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["ad-campaigns"] });
		},
	});

	return { updateCampaign: mutation.mutateAsync, isPending: mutation.isPending };
};
