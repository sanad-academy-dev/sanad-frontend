import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { PaymentMethod } from "@/generated/prisma/enums";
import { api } from "@/lib/api";

/**
 * [P12.15] Data hooks for the POS shift — the custody half of §16.
 *
 * These live under `features/accounting` rather than `features/inventory` even though the
 * open/close buttons sit inside the till: a shift is an accounting document (it posts a
 * write-off JE on close), and the POS Register tab in the accounting hub reads the same
 * endpoints. One home means the two surfaces cannot drift into disagreeing about what a
 * shift is.
 *
 * EVERY SHIFT MUTATION INVALIDATES `["accounting"]` AND `["sales"]`. Closing a shift can post
 * a difference to the ledger, and opening one changes which shift subsequent sales attach to
 * — so both trees are stale afterwards, and refreshing only the one you were looking at is
 * how a cashier ends up counting against yesterday's expectation.
 */

const SHIFT_KEY = ["accounting", "pos-shift"] as const;

const messageOf = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

const useShiftInvalidator = () => {
	const queryClient = useQueryClient();
	return () => {
		queryClient.invalidateQueries({ queryKey: ["accounting"] });
		queryClient.invalidateQueries({ queryKey: ["sales"] });
	};
};

/* ── POS profiles (the master a shift opens against) ──────────────────────────────────── */

export const usePosProfiles = () => {
	const { data, isLoading } = useQuery({
		queryKey: [...SHIFT_KEY, "profiles"],
		queryFn: async () => {
			const { data, error } = await api.accounting["pos-shifts"].profiles.get();
			if (error) throw new Error("تعذّر تحميل ملفات نقطة البيع");
			return data;
		},
		staleTime: 1000 * 60,
	});
	return { profiles: data ?? [], isLoading };
};

export type CreatePosProfileInput = {
	name: string;
	warehouseId?: string | null;
	writeOffLimit: string;
	writeOffAccountId?: string | null;
	disabled?: boolean;
	userIds?: string[];
};

export const useCreatePosProfile = () => {
	const invalidate = useShiftInvalidator();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: CreatePosProfileInput) => {
			const { data, error } = await api.accounting["pos-shifts"].profiles.post(input);
			if (error) throw new Error(messageOf(error, "تعذّر إنشاء ملف نقطة البيع"));
			return data;
		},
		onSettled: invalidate,
	});
	const createProfile = (input: CreatePosProfileInput) =>
		toast.promise(mutateAsync(input), {
			loading: "جارٍ إنشاء الملف…",
			success: "أُنشئ ملف نقطة البيع",
			error: (error: Error) => error.message,
		});
	return { createProfile, isPending };
};

/* ── the cashier's own open shift ─────────────────────────────────────────────────────── */

/**
 * The shift THIS cashier has open, or null. The till asks on every load, so it is the one
 * query here that must not be stale — a cashier who reopened the tab after closing must not
 * see a "close" button for a shift that no longer exists.
 */
export const useCurrentShift = () => {
	const { data, isLoading } = useQuery({
		queryKey: [...SHIFT_KEY, "current"],
		queryFn: async () => {
			const { data, error } = await api.accounting["pos-shifts"].current.get();
			if (error) throw new Error("تعذّر قراءة حالة الوردية");
			return data;
		},
		staleTime: 0,
	});
	return { shift: data ?? null, isLoading };
};

export const useOpenShift = () => {
	const invalidate = useShiftInvalidator();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: {
			profileId: string;
			balances: { paymentMethod: PaymentMethod; amount: string }[];
		}) => {
			const { data, error } = await api.accounting["pos-shifts"].open.post(input);
			if (error) throw new Error(messageOf(error, "تعذّر فتح الوردية"));
			return data;
		},
		onSettled: invalidate,
	});
	const openShift = (input: {
		profileId: string;
		balances: { paymentMethod: PaymentMethod; amount: string }[];
	}) => {
		const promise = mutateAsync(input);
		toast.promise(promise, {
			loading: "جارٍ فتح الوردية…",
			success: "فُتحت الوردية — المبيعات من الآن تُنسب إليها",
			error: (error: Error) => error.message,
		});
		return promise;
	};
	return { openShift, isPending };
};

/**
 * What the drawer should hold, per method. Fetched only when the close dialog is open —
 * `enabled` on the id — because it is the answer to the count, and a query that runs while
 * the cashier is still selling would be showing an expectation that is already out of date.
 */
export const useShiftExpectation = (openingId: string | null) => {
	const { data, isLoading } = useQuery({
		queryKey: [...SHIFT_KEY, "expectation", openingId ?? ""],
		queryFn: async () => {
			const { data, error } = await api.accounting["pos-shifts"]({
				id: openingId as string,
			}).expectation.get();
			if (error) throw new Error("تعذّر حساب المتوقَّع في الدرج");
			return data;
		},
		enabled: Boolean(openingId),
		staleTime: 0,
	});
	return { expectation: data ?? [], isLoading };
};

export const useCloseShift = () => {
	const invalidate = useShiftInvalidator();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: {
			openingId: string;
			counted: { paymentMethod: PaymentMethod; countedAmount: string }[];
		}) => {
			const { data, error } = await api.accounting["pos-shifts"]({
				id: input.openingId,
			}).close.post({ counted: input.counted });
			if (error) throw new Error(messageOf(error, "تعذّر إقفال الوردية"));
			return data;
		},
		onSettled: invalidate,
	});
	const closeShift = (input: {
		openingId: string;
		counted: { paymentMethod: PaymentMethod; countedAmount: string }[];
	}) => {
		const promise = mutateAsync(input);
		toast.promise(promise, {
			loading: "جارٍ إقفال الوردية…",
			// الفرق صفرًا خبر جيّد يستحقّ أن يُقال صراحةً، لا أن يُستنتج من غياب رسالة
			success: (result) =>
				Number(result.totalDifference) === 0
					? "أُقفلت الوردية — الدرج مطابق تمامًا"
					: `أُقفلت الوردية بفارق ${result.totalDifference}`,
			error: (error: Error) => error.message,
		});
		return promise;
	};
	return { closeShift, isPending };
};
