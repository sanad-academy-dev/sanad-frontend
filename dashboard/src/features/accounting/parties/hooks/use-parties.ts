import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	PartyListRow,
	PartyTypeKey,
	UpdatePartyAccountingFormInput,
} from "@/server/accounting/party/party.type";

/** [P3.1] Data hooks for «حسابات الأطراف» (BRD §4.10). */

const QUERY_KEY = ["accounting", "parties"] as const;

const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

export const useParties = () => {
	const { data, isLoading } = useQuery<PartyListRow[]>({
		queryKey: QUERY_KEY,
		queryFn: async () => {
			const { data, error } = await api.accounting.parties.get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل الأطراف"));
			return data as PartyListRow[];
		},
		staleTime: 1000 * 30,
	});
	return { parties: data ?? [], isLoading };
};

export const usePartyActions = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async ({
			partyType,
			partyId,
			input,
		}: {
			partyType: PartyTypeKey;
			partyId: string;
			input: UpdatePartyAccountingFormInput;
		}) => {
			const { data, error } = await api.accounting
				.parties({ partyType })({ partyId })
				.patch(input);
			if (error) throw new Error(errorMessage(error, "فشل حفظ إعدادات الطرف"));
			return data;
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
	});

	const update = (
		partyType: PartyTypeKey,
		partyId: string,
		input: UpdatePartyAccountingFormInput,
	) =>
		toast.promise(mutateAsync({ partyType, partyId, input }), {
			loading: "جارٍ الحفظ...",
			success: "تم حفظ إعدادات الطرف",
			error: (e: Error) => e.message || "فشل حفظ إعدادات الطرف",
		});

	return { update, isSaving: isPending };
};

/** [P3.4] Open vouchers of a party — the JE «تسوية مقابل» picker source. */
export type PartyOpenVoucher = {
	voucherType: string;
	voucherId: string;
	voucherNo: string | null;
	outstanding: string;
};

export const usePartyOpenVouchers = (
	partyType: PartyTypeKey | null | undefined,
	partyId: string | null | undefined,
) => {
	const { data, isLoading } = useQuery<PartyOpenVoucher[]>({
		queryKey: ["accounting", "parties", "open-vouchers", partyType, partyId],
		enabled: !!partyType && !!partyId,
		queryFn: async () => {
			const { data, error } = await api.accounting
				.parties({ partyType: partyType as string })({ partyId: partyId as string })
				["open-vouchers"].get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل المستندات المفتوحة"));
			return data as PartyOpenVoucher[];
		},
		staleTime: 1000 * 15,
	});
	return { openVouchers: data ?? [], isLoading };
};
