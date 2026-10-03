import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { MobileDispatchStage } from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import type { MobileVisitResponse } from "@/server/mobile-clinics/mobile-visits/mobile-visits.type";

const EMPTY: MobileVisitResponse[] = [];

const errMsg = (e: unknown, fallback: string) =>
	(e as { value?: { message?: string } })?.value?.message || fallback;

/** اليوم بصيغة YYYY-MM-DD بالتوقيت المحلّي — لا ISO، فـ`toISOString` يقفز يومًا قبل الفجر. */
export const toDayKey = (date: Date): string => {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
};

export const useDispatchBoard = (date: string) => {
	const { data, isLoading } = useQuery<MobileVisitResponse[]>({
		queryKey: ["mobile-dispatch-board", date],
		queryFn: async () => {
			const res = await api["mobile-visits"].board.get({ query: { date } });
			if (res.error) throw new Error("فشل جلب لوحة الإرسال");
			return res.data as MobileVisitResponse[];
		},
		staleTime: 1000 * 30,
	});

	return { visits: Array.isArray(data) ? data : EMPTY, isLoading };
};

export const useDispatchMutations = (date: string) => {
	const queryClient = useQueryClient();

	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: ["mobile-dispatch-board", date] });
		queryClient.invalidateQueries({ queryKey: ["mobile-fleet-live"] });
		queryClient.invalidateQueries({ queryKey: ["appointments"] });
	};

	const assignMut = useMutation({
		mutationFn: async (vars: { visitId: string; mobileUnitId: string; sequence?: number }) => {
			const res = await api["mobile-visits"]({ id: vars.visitId }).assign.post({
				mobileUnitId: vars.mobileUnitId,
				sequence: vars.sequence,
			});
			if (res.error) throw new Error(errMsg(res.error, "فشل إسناد الزيارة"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const unassignMut = useMutation({
		mutationFn: async (visitId: string) => {
			const res = await api["mobile-visits"]({ id: visitId }).unassign.post();
			if (res.error) throw new Error(errMsg(res.error, "فشل إلغاء الإسناد"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const stageMut = useMutation({
		mutationFn: async (vars: {
			visitId: string;
			stage: MobileDispatchStage;
			reason?: string;
			note?: string;
		}) => {
			const res = await api["mobile-visits"]({ id: vars.visitId }).stage.patch({
				stage: vars.stage,
				// biome-ignore lint/suspicious/noExplicitAny: enum عبر Treaty
				reason: vars.reason as any,
				note: vars.note,
			});
			if (res.error) throw new Error(errMsg(res.error, "فشل تغيير مرحلة الزيارة"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const reorderMut = useMutation({
		mutationFn: async (vars: { mobileUnitId: string; orderedVisitIds: string[] }) => {
			const res = await api["mobile-visits"].reorder.post(vars);
			if (res.error) throw new Error(errMsg(res.error, "فشل ترتيب المسار"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const assign = (visitId: string, mobileUnitId: string, sequence?: number) => {
		const p = assignMut.mutateAsync({ visitId, mobileUnitId, sequence });
		toast.promise(p, {
			loading: "جارٍ الإسناد...",
			success: "تم إسناد الزيارة",
			error: (e: Error) => e.message || "فشل إسناد الزيارة",
		});
		return p;
	};

	const unassign = (visitId: string) => {
		const p = unassignMut.mutateAsync(visitId);
		toast.promise(p, {
			loading: "جارٍ إلغاء الإسناد...",
			success: "أُعيدت الزيارة إلى غير المسنَدة",
			error: (e: Error) => e.message || "فشل إلغاء الإسناد",
		});
		return p;
	};

	const changeStage = (
		visitId: string,
		stage: MobileDispatchStage,
		extra?: { reason?: string; note?: string },
	) => {
		const p = stageMut.mutateAsync({ visitId, stage, ...extra });
		toast.promise(p, {
			loading: "جارٍ تحديث المرحلة...",
			success: "تم تحديث المرحلة",
			error: (e: Error) => e.message || "فشل تغيير مرحلة الزيارة",
		});
		return p;
	};

	// بلا toast: إعادة الترتيب تحدث بالسحب مرارًا، وإشعارٌ لكل حركة ضجيج
	const reorder = (mobileUnitId: string, orderedVisitIds: string[]) =>
		reorderMut.mutateAsync({ mobileUnitId, orderedVisitIds }).catch((e: Error) => {
			toast.error(e.message || "فشل ترتيب المسار");
		});

	return {
		assign,
		unassign,
		changeStage,
		reorder,
		isMutating:
			assignMut.isPending ||
			unassignMut.isPending ||
			stageMut.isPending ||
			reorderMut.isPending,
	};
};
