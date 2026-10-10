import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { SopDomain } from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import type {
	ResolvedSopResponse,
	SopLibraryRowResponse,
	SopTemplateFormValues,
} from "@/server/sops/sops.type";

const EMPTY_ROWS: SopLibraryRowResponse[] = [];

const serverMessage = (error: { value?: unknown } | null, fallback: string) => {
	const data = error?.value as { message?: string } | undefined;
	return data?.message ?? fallback;
};

/** مكتبة البروتوكولات لوحدة كاملة — كل عناصرها مع ملخّص قالبها الفعّال */
export const useSopLibrary = (domain: SopDomain) => {
	const { data, isLoading } = useQuery<SopLibraryRowResponse[]>({
		queryKey: ["sop-library", domain],
		queryFn: async () => {
			const res = await api.sops.library.get({ query: { domain } });
			if (res.error) throw new Error("فشل جلب مكتبة البروتوكولات");
			return res.data as SopLibraryRowResponse[];
		},
	});

	return { rows: data ?? EMPTY_ROWS, isLoading };
};

/** القالب الفعّال لدورة مع بيان مصدره — يُستدعى من لوحة إعدادات العنصر */
export const useServiceSop = (serviceId: string | null) => {
	const { data, isLoading } = useQuery<ResolvedSopResponse>({
		queryKey: ["sop-service", serviceId],
		enabled: Boolean(serviceId),
		queryFn: async () => {
			const res = await api.sops.service({ serviceId: serviceId as string }).get();
			if (res.error) throw new Error("فشل جلب بروتوكول الدورة");
			return res.data as ResolvedSopResponse;
		},
	});

	return { resolved: data ?? null, isLoading };
};

/** حفظ نسخة أكاديمية من البروتوكول — نسخة جديدة دائمًا والتاريخ مصون */
export const useSaveSopTemplate = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: SopTemplateFormValues) => {
			const res = await api.sops.templates.post(input);
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر حفظ البروتوكول"));
			return res.data;
		},
		onSuccess: (_data, variables) => {
			void queryClient.invalidateQueries({ queryKey: ["sop-library", variables.domain] });
			void queryClient.invalidateQueries({ queryKey: ["sop-service", variables.serviceId] });
		},
	});

	const saveSop = (input: SopTemplateFormValues) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ الحفظ...",
			success: "حُفظت نسخة جديدة من البروتوكول",
			error: (err: Error) => err.message || "فشل حفظ البروتوكول",
		});
		return p;
	};

	return { saveSop, isPending: mutation.isPending };
};

/** إلغاء تخصيص الأكاديمية — يعود قالب النظام أو القالب الموروث */
export const useRevertSopToSystem = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ serviceId }: { serviceId: string; domain: SopDomain }) => {
			const res = await api.sops.service({ serviceId }).delete();
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر إلغاء التخصيص"));
			return res.data;
		},
		onSuccess: (_data, variables) => {
			void queryClient.invalidateQueries({ queryKey: ["sop-library", variables.domain] });
			void queryClient.invalidateQueries({ queryKey: ["sop-service", variables.serviceId] });
		},
	});

	const revertSop = (input: { serviceId: string; domain: SopDomain }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ الإلغاء...",
			success: "أُلغي التخصيص وعاد بروتوكول النظام",
			error: (err: Error) => err.message || "فشل إلغاء التخصيص",
		});
		return p;
	};

	return { revertSop, isPending: mutation.isPending };
};
