import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	CreateVoucherDemoFormInput,
	UpdateVoucherDemoFormInput,
	VoucherDemoRecord,
} from "@/server/accounting/voucher-demo/voucher-demo.type";

/**
 * [P0.2 UI] Data hooks for the demo voucher lifecycle.
 *
 * Every mutation invalidates the list, because a lifecycle action changes more than the row
 * it targets: submitting assigns a document number, and amending creates a *second* row.
 */

const QUERY_KEY = ["accounting", "voucher-demo"] as const;

const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

export const useVoucherDemoList = () => {
	const { data, isLoading, refetch } = useQuery<VoucherDemoRecord[]>({
		queryKey: QUERY_KEY,
		queryFn: async () => {
			const { data, error } = await api.accounting["voucher-demo"].get({ query: {} });
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل المستندات"));
			return data as VoucherDemoRecord[];
		},
		staleTime: 1000 * 30,
	});

	return { vouchers: data ?? [], isLoading, refetch };
};

export const useVoucherDemoActions = () => {
	const queryClient = useQueryClient();
	const invalidate = () => queryClient.invalidateQueries({ queryKey: QUERY_KEY });

	const createMutation = useMutation({
		mutationFn: async (input: CreateVoucherDemoFormInput) => {
			const { data, error } = await api.accounting["voucher-demo"].post(input);
			if (error) throw new Error(errorMessage(error, "تعذّر إنشاء المستند"));
			return data as VoucherDemoRecord;
		},
		onSuccess: invalidate,
	});

	const updateMutation = useMutation({
		mutationFn: async ({
			id,
			changes,
		}: {
			id: string;
			changes: UpdateVoucherDemoFormInput;
		}) => {
			const { data, error } = await api.accounting["voucher-demo"]({ id }).patch(changes);
			if (error) throw new Error(errorMessage(error, "تعذّر تعديل المستند"));
			return data as VoucherDemoRecord;
		},
		onSuccess: invalidate,
	});

	const submitMutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await api.accounting["voucher-demo"]({ id }).submit.post();
			if (error) throw new Error(errorMessage(error, "تعذّر ترحيل المستند"));
			return data as VoucherDemoRecord;
		},
		onSuccess: invalidate,
	});

	const cancelMutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await api.accounting["voucher-demo"]({ id }).cancel.post();
			if (error) throw new Error(errorMessage(error, "تعذّر إلغاء المستند"));
			return data as VoucherDemoRecord;
		},
		onSuccess: invalidate,
	});

	const amendMutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await api.accounting["voucher-demo"]({ id }).amend.post();
			if (error) throw new Error(errorMessage(error, "تعذّر إنشاء نسخة معدَّلة"));
			return data as VoucherDemoRecord;
		},
		onSuccess: invalidate,
	});

	const createVoucher = (input: CreateVoucherDemoFormInput) =>
		toast.promise(createMutation.mutateAsync(input), {
			loading: "جارٍ إنشاء المسودة...",
			success: "تم إنشاء المسودة",
			error: (e: Error) => e.message,
		});

	const updateVoucher = (id: string, changes: UpdateVoucherDemoFormInput) =>
		toast.promise(updateMutation.mutateAsync({ id, changes }), {
			loading: "جارٍ حفظ التعديل...",
			success: "تم حفظ التعديل",
			error: (e: Error) => e.message,
		});

	const submitVoucher = (id: string) =>
		toast.promise(submitMutation.mutateAsync(id), {
			loading: "جارٍ الترحيل...",
			success: (voucher) => `تم الترحيل برقم ${voucher.documentNo ?? ""}`,
			error: (e: Error) => e.message,
		});

	const cancelVoucher = (id: string) =>
		toast.promise(cancelMutation.mutateAsync(id), {
			loading: "جارٍ الإلغاء...",
			success: "تم إلغاء المستند",
			error: (e: Error) => e.message,
		});

	const amendVoucher = (id: string) =>
		toast.promise(amendMutation.mutateAsync(id), {
			loading: "جارٍ إنشاء نسخة معدَّلة...",
			success: "تم إنشاء مسودة جديدة معدَّلة عن المستند الملغى",
			error: (e: Error) => e.message,
		});

	const isPending =
		createMutation.isPending ||
		updateMutation.isPending ||
		submitMutation.isPending ||
		cancelMutation.isPending ||
		amendMutation.isPending;

	return {
		createVoucher,
		updateVoucher,
		submitVoucher,
		cancelVoucher,
		amendVoucher,
		isPending,
	};
};
