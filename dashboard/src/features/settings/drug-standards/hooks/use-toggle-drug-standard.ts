import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DRUG_STANDARDS_QUERY_KEY } from "@/features/settings/drug-standards/hooks/use-drug-standards";
import { api } from "@/lib/api";

export const useToggleDrugStandard = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async ({ standardId, enabled }: { standardId: string; enabled: boolean }) => {
			// biome-ignore lint/suspicious/noExplicitAny: Eden Treaty uses function-call syntax for dynamic path segments — no typed alternative
			const res = await (api["drug-catalog"].standards as any)({ id: standardId }).patch({
				enabled,
			});
			if (res.error) throw new Error("فشل تحديث حالة المعيار");
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: DRUG_STANDARDS_QUERY_KEY });
			// the catalog picker filters by enabled standards
			queryClient.invalidateQueries({ queryKey: ["drug-catalog"] });
		},
	});

	const toggleStandard = (standardId: string, enabled: boolean) =>
		toast.promise(mutateAsync({ standardId, enabled }), {
			loading: enabled ? "جارٍ تفعيل المعيار..." : "جارٍ تعطيل المعيار...",
			success: enabled ? "تم تفعيل المعيار" : "تم تعطيل المعيار",
			error: (err: Error) => err.message || "فشل تحديث حالة المعيار",
		});

	return { toggleStandard, isPending };
};
