import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api";

// التحقق من رمز PIN للدخول لوضع الكشك
export const useKiosk = () => {
	const verifyMutation = useMutation({
		mutationFn: async (pin: string) => {
			const res = await api.kiosk.verify.post({ pin });
			if (res.error) {
				const message =
					(res.error.value as { message?: string })?.message ?? "رمز PIN غير صحيح";
				throw new Error(message);
			}
			return res.data;
		},
	});

	return {
		verifyPin: verifyMutation.mutateAsync,
		isVerifying: verifyMutation.isPending,
	};
};
