import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { EosSettlementResponse } from "@/server/end-of-service/end-of-service.type";

const EOS_KEY = ["end-of-service"];

const errorMessage = (error: unknown, fallback: string) => {
	const value = (error as { value?: { message?: string } })?.value;
	return typeof value?.message === "string" ? value.message : fallback;
};

export const useEosSettlements = () => {
	const { data, isLoading } = useQuery({
		queryKey: EOS_KEY,
		queryFn: async () => {
			const res = await api["end-of-service"].get();
			if (res.error) throw new Error("تعذّر جلب التسويات");
			return res.data as EosSettlementResponse[];
		},
		staleTime: 1000 * 60,
	});
	return { settlements: data ?? [], isLoading };
};

// مدخلات الحفظ = مخرجات الحاسبة كما هي، فلا يُعاد اشتقاق شيء على الخادم
export type SaveEosInput = {
	staffId: string;
	reason: "END_OF_CONTRACT" | "EMPLOYER_TERMINATION" | "RESIGNATION" | "SPECIAL";
	monthlyWage: number;
	startDate: string;
	endDate: string;
	serviceYears: number;
	serviceMonths: number;
	serviceDays: number;
	firstFiveMonths: number;
	beyondFiveMonths: number;
	fullAward: number;
	factor: number;
	finalAmount: number;
	notes?: string | null;
};

export const useEosMutations = () => {
	const queryClient = useQueryClient();
	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: EOS_KEY });
		// التسوية المعتمدة تُرحَّل كمصروف، فالمالية تحتاج تحديثًا
		queryClient.invalidateQueries({ queryKey: ["expenses"] });
	};

	const create = useMutation({
		mutationFn: async (input: SaveEosInput) => {
			const res = await api["end-of-service"].post(input);
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر حفظ التسوية"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const approve = useMutation({
		mutationFn: async (id: string) => {
			const res = await api["end-of-service"]({ id }).approve.post();
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر اعتماد التسوية"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	return {
		create,
		approve,
		// حفظ ثم اعتماد في خطوة واحدة — الاعتماد هو ما يُرحّلها للمالية
		saveAndApprove: (input: SaveEosInput) =>
			toast.promise(
				(async () => {
					const created = await create.mutateAsync(input);
					await approve.mutateAsync((created as { id: string }).id);
					return created;
				})(),
				{
					loading: "جارٍ حفظ التسوية...",
					success: "تم حفظ التسوية واعتمادها — ظهرت في المالية كمصروف",
					error: (e: Error) => e.message,
				},
			),
	};
};
