import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";

/**
 * [PP1] اعتمادات تطبيق وليّ الأمر من شاشة الأكاديمية.
 *
 * **لا `toast.promise` هنا** خلافًا لبقيّة طفرات هذه الوحدة: النتيجة كلمة مرور تُعرض
 * **مرّة واحدة** في نافذة يقرؤها الموظّف على وليّ الأمر. التنبيه العابر يختفي بعد ثوانٍ،
 * وكلمة المرور لا تُسترجَع — المخزَّن تجزئتها لا هي — فاختفاؤها يعني إصدار كلمة أخرى
 * وإبطال الأولى في يد وليّ الأمر.
 */

export const PORTAL_STATUS_KEY = (ownerId: string) => ["owner-portal", ownerId] as const;

export const usePortalStatus = (ownerId: string | null, enabled = true) =>
	useQuery({
		queryKey: PORTAL_STATUS_KEY(ownerId ?? ""),
		enabled: Boolean(ownerId) && enabled,
		queryFn: async () => {
			const res = await api.owners({ id: ownerId as string }).portal.get();
			if (res.error) throw new Error("تعذّر قراءة حالة حساب التطبيق");
			return res.data;
		},
	});

export const useIssuePortalPassword = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (ownerId: string) => {
			const res = await api.owners({ id: ownerId }).portal.password.post();
			if (res.error) {
				// رسالة الخادم العربية تُعرض كما هي — هي التي تشرح للموظّف ما يصلحه
				// (رقم غير صالح مثلًا)، والصياغة العامّة تُضيّع ذلك.
				const message = (res.error.value as { message?: string })?.message;
				throw new Error(message || "تعذّر إنشاء كلمة المرور");
			}
			return res.data;
		},
		onSuccess: (_data, ownerId) => {
			void queryClient.invalidateQueries({ queryKey: PORTAL_STATUS_KEY(ownerId) });
		},
	});
};
