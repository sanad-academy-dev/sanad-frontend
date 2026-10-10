import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CarePlanStatus } from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import type {
	CarePlanResponse,
	CreateCarePlanInput,
	UpdateCarePlanInput,
} from "@/server/care-plans/care-plans.type";

const errorMessage = (error: unknown, fallback: string): string => {
	const v = (error as { value?: { message?: string } })?.value;
	return v?.message ?? fallback;
};

export const useCarePlanMutations = () => {
	const queryClient = useQueryClient();

	const invalidate = () => {
		void queryClient.invalidateQueries({ queryKey: ["care-plans"] });
	};

	const createMutation = useMutation({
		mutationFn: async (payload: CreateCarePlanInput) => {
			const res = await api["care-plans"].post(payload);
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر إنشاء الخطة"));
			return res.data as CarePlanResponse;
		},
		onSuccess: invalidate,
	});

	const updateMutation = useMutation({
		mutationFn: async ({ id, payload }: { id: string; payload: UpdateCarePlanInput }) => {
			const res = await api["care-plans"]({ id }).patch(payload);
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر تحديث الخطة"));
			return res.data as CarePlanResponse;
		},
		onSuccess: invalidate,
	});

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await api["care-plans"]({ id }).delete();
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر حذف الخطة"));
			return res.data as CarePlanResponse;
		},
		onSuccess: invalidate,
	});

	const statusMutation = useMutation({
		mutationFn: async ({ id, status }: { id: string; status: CarePlanStatus }) => {
			const res = await api["care-plans"]({ id }).status.patch({ status });
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر تحديث حالة الخطة"));
			return res.data as CarePlanResponse;
		},
		onSuccess: invalidate,
	});

	const duplicateMutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await api["care-plans"]({ id }).duplicate.post();
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر استنساخ الخطة"));
			return res.data as CarePlanResponse;
		},
		onSuccess: invalidate,
	});

	const create = (payload: CreateCarePlanInput) => {
		const promise = createMutation.mutateAsync(payload);
		toast.promise(promise, {
			loading: "جارٍ إنشاء الخطة...",
			success: "تم إنشاء الخطة بنجاح",
			error: (err: Error) => err.message || "فشل إنشاء الخطة",
		});
		return promise;
	};

	const update = (id: string, payload: UpdateCarePlanInput) => {
		const promise = updateMutation.mutateAsync({ id, payload });
		toast.promise(promise, {
			loading: "جارٍ تحديث الخطة...",
			success: "تم تحديث الخطة بنجاح",
			error: (err: Error) => err.message || "فشل تحديث الخطة",
		});
		return promise;
	};

	const remove = (id: string, name?: string) => {
		const promise = deleteMutation.mutateAsync(id);
		toast.promise(promise, {
			loading: "جارٍ حذف الخطة...",
			success: name ? `تم حذف الخطة (${name}) بنجاح` : "تم حذف الخطة بنجاح",
			error: (err: Error) => err.message || "فشل حذف الخطة",
		});
		return promise;
	};

	const setStatus = (id: string, status: CarePlanStatus, name?: string) => {
		const promise = statusMutation.mutateAsync({ id, status });
		toast.promise(promise, {
			loading: "جارٍ تحديث الحالة...",
			success: () =>
				name
					? status === "INACTIVE"
						? `تم تعطيل الخطة (${name}) من الاختيارات بنجاح`
						: `تم تفعيل الخطة (${name}) بنجاح`
					: "تم تحديث الحالة بنجاح",
			error: (err: Error) => err.message || "فشل تحديث حالة الخطة",
		});
		return promise;
	};

	const duplicate = (id: string) => {
		const promise = duplicateMutation.mutateAsync(id);
		toast.promise(promise, {
			loading: "جارٍ استنساخ الخطة...",
			success: "تم استنساخ الخطة بنجاح",
			error: (err: Error) => err.message || "فشل استنساخ الخطة",
		});
		return promise;
	};

	return {
		create,
		update,
		remove,
		setStatus,
		duplicate,
		isCreating: createMutation.isPending,
		isUpdating: updateMutation.isPending,
		isSaving: createMutation.isPending || updateMutation.isPending,
		isDeleting: deleteMutation.isPending,
		isSettingStatus: statusMutation.isPending,
		isDuplicating: duplicateMutation.isPending,
	};
};
