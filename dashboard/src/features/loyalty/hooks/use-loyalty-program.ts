import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	LoyaltyProgramResponse,
	LoyaltyTierColorToken,
} from "@/server/loyalty/loyalty-program/loyalty-program.type";

/** [LY-P0] §3/§4 — البرنامج ومستوياته. */

const PROGRAMS_KEY = ["loyalty", "programs"] as const;

const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

/**
 * البوابة §0.3 ترفض بـ٤٠٠ حين تكون الوحدة مطفأة، وهذا ليس عطلًا بل الحالة المتوقّعة —
 * فتُرجَع قائمة فارغة بدل رمي خطأ يملأ الشاشة بتنبيهٍ أحمر عن حالةٍ طبيعية.
 */
export const useLoyaltyPrograms = (enabled: boolean, includeInactive = false) => {
	const { data, isLoading } = useQuery<LoyaltyProgramResponse[]>({
		queryKey: [...PROGRAMS_KEY, includeInactive],
		enabled,
		queryFn: async () => {
			const { data, error } = await api.loyalty.programs.get({ query: { includeInactive } });
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل برامج الولاء"));
			return data as LoyaltyProgramResponse[];
		},
	});
	return { programs: data ?? [], isLoading };
};

type ProgramInput = {
	name: string;
	earnRate: number;
	redemptionRate: number;
	minRedemptionPoints: number;
	maxRedemptionPercent: number;
	pointsValidityMonths: number;
	membershipMultiplier?: number;
	active?: boolean;
};

type TierInput = {
	name: string;
	minSpend: number;
	earnMultiplier?: number;
	order?: number;
	/**
	 * الاتحاد الحرفيّ لا `string`: عمود Prisma نصٌّ عادي، بينما مخطّط TypeBox على الحدّ
	 * اتحادٌ مغلق — فاشتقاق النوع من الاستجابة كان سيوسّعه إلى `string` ويكسر عميل Eden.
	 */
	colorToken: LoyaltyTierColorToken;
	active?: boolean;
};

export const useLoyaltyProgramActions = () => {
	const queryClient = useQueryClient();
	const invalidate = () => queryClient.invalidateQueries({ queryKey: PROGRAMS_KEY });

	const createProgramMutation = useMutation({
		mutationFn: async (input: ProgramInput) => {
			const { data, error } = await api.loyalty.programs.post(input);
			if (error) throw new Error(errorMessage(error, "تعذّرت إضافة البرنامج"));
			return data;
		},
		onSuccess: invalidate,
	});

	const updateProgramMutation = useMutation({
		mutationFn: async ({ id, ...input }: Partial<ProgramInput> & { id: string }) => {
			const { data, error } = await api.loyalty.programs({ id }).patch(input);
			if (error) throw new Error(errorMessage(error, "تعذّر تعديل البرنامج"));
			return data;
		},
		onSuccess: invalidate,
	});

	const removeProgramMutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await api.loyalty.programs({ id }).delete();
			// رسالة الخادم هي الرسالة: رفض BR-L3.3 يقول ما ينقص بالضبط
			if (error) throw new Error(errorMessage(error, "تعذّر حذف البرنامج"));
			return data;
		},
		onSuccess: invalidate,
	});

	const createTierMutation = useMutation({
		mutationFn: async ({ programId, ...input }: TierInput & { programId: string }) => {
			const { data, error } = await api.loyalty.programs({ id: programId }).tiers.post(input);
			if (error) throw new Error(errorMessage(error, "تعذّرت إضافة المستوى"));
			return data;
		},
		onSuccess: invalidate,
	});

	const updateTierMutation = useMutation({
		mutationFn: async ({ id, ...input }: Partial<TierInput> & { id: string }) => {
			const { data, error } = await api.loyalty.tiers({ id }).patch(input);
			if (error) throw new Error(errorMessage(error, "تعذّر تعديل المستوى"));
			return data;
		},
		onSuccess: invalidate,
	});

	const removeTierMutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await api.loyalty.tiers({ id }).delete();
			if (error) throw new Error(errorMessage(error, "تعذّر حذف المستوى"));
			return data;
		},
		onSuccess: invalidate,
	});

	const withToast = <T>(promise: Promise<T>, success: string) =>
		toast.promise(promise, {
			loading: "جارٍ الحفظ...",
			success,
			error: (error: Error) => error.message,
		});

	return {
		createProgram: (input: ProgramInput) =>
			withToast(createProgramMutation.mutateAsync(input), "أُضيف البرنامج"),
		updateProgram: (input: Partial<ProgramInput> & { id: string }) =>
			withToast(updateProgramMutation.mutateAsync(input), "حُفظ البرنامج"),
		removeProgram: (id: string) =>
			toast.promise(removeProgramMutation.mutateAsync(id), {
				loading: "جارٍ الحذف...",
				success: "حُذف البرنامج",
				error: (error: Error) => error.message,
			}),
		createTier: (input: TierInput & { programId: string }) =>
			withToast(createTierMutation.mutateAsync(input), "أُضيف المستوى"),
		updateTier: (input: Partial<TierInput> & { id: string }) =>
			withToast(updateTierMutation.mutateAsync(input), "حُفظ المستوى"),
		removeTier: (id: string) =>
			toast.promise(removeTierMutation.mutateAsync(id), {
				loading: "جارٍ الحذف...",
				success: "حُذف المستوى",
				error: (error: Error) => error.message,
			}),
		isSaving:
			createProgramMutation.isPending ||
			updateProgramMutation.isPending ||
			createTierMutation.isPending ||
			updateTierMutation.isPending,
	};
};
