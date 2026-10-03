import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { AdPlatform } from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import type { MarketingAccountResponse } from "@/server/marketing-accounts/marketing-accounts.type";

export const useMarketingAccounts = (platform?: AdPlatform, enabled = true) => {
	const { data, isLoading } = useQuery<MarketingAccountResponse[]>({
		queryKey: ["marketing-accounts", platform ?? "all"],
		enabled,
		queryFn: async () => {
			const res = await api["marketing-accounts"].get({
				query: platform ? { platform } : {},
			});
			if (res.error) throw new Error("فشل تحميل صفحات المنصّات");
			return res.data as MarketingAccountResponse[];
		},
		staleTime: 1000 * 60 * 5,
	});

	return { accounts: data ?? [], isLoading };
};

/**
 * يهيّئ الصفحة الافتراضية للمنصّة عند فتح المعالج. تحت D1 لا يوجد ربط OAuth، والحقل
 * «حساب فيسبوك» مرسوم ومطلوب — فبلا هذه الخطوة تفتح القائمة فارغة ويعلق المستخدم
 * أمام حقل إلزامي بلا خيارات.
 */
export const useEnsureDefaultAccount = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (platform: "FACEBOOK" | "INSTAGRAM") => {
			const res = await api["marketing-accounts"]["ensure-default"].post({ platform });
			if (res.error) throw new Error("تعذّر تهيئة صفحة المنصّة");
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["marketing-accounts"] });
		},
	});

	return { ensureDefault: mutation.mutateAsync, isPending: mutation.isPending };
};
