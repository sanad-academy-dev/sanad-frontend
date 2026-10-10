import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { OperationStatus } from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import type {
	CreateOperationFormValues,
	OperationScheduleConflict,
} from "@/server/operations/operations.type";

const serverMessage = (error: { value?: unknown } | null, fallback: string) => {
	const data = error?.value as
		| { message?: string; conflicts?: OperationScheduleConflict[] }
		| undefined;
	if (data?.conflicts?.length) {
		const codes = data.conflicts.map((c) => c.caseCode).join("، ");
		return `${data.message ?? fallback}: ${codes}`;
	}
	return data?.message ?? fallback;
};

const invalidateOperations = (queryClient: ReturnType<typeof useQueryClient>) => {
	void queryClient.invalidateQueries({ queryKey: ["operations"] });
};

/** إنشاء حالة عملية جديدة */
export const useCreateOperation = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (values: CreateOperationFormValues) => {
			const res = await api.operations.post({
				patientId: values.patientId,
				appointmentId: values.appointmentId ?? null,
				procedures: values.procedures.map((p) => ({
					serviceId: p.serviceId,
					laterality: p.laterality,
					site: p.site ?? null,
				})),
				surgeonStaffId: values.surgeonStaffId,
				anesthetistStaffId: values.anesthetistStaffId ?? null,
				urgency: values.urgency,
				scheduledAt: values.scheduledAt || null,
				estimatedDurationMin: values.estimatedDurationMin,
				roomId: values.roomId ?? null,
				diagnosis: values.diagnosis ?? null,
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر إنشاء العملية"));
			return res.data;
		},
		onSuccess: () => invalidateOperations(queryClient),
	});

	const createOperation = (values: CreateOperationFormValues) => {
		const p = mutation.mutateAsync(values);
		toast.promise(p, {
			loading: "جارٍ إنشاء الحالة...",
			success: "أُنشئت حالة العملية",
			error: (err: Error) => err.message || "فشل إنشاء العملية",
		});
		return p;
	};

	return { createOperation, isPending: mutation.isPending };
};

/**
 * نقل حالة العملية — الخادم يفرض الانتقالات والبوابات؛ رسالة 422 العربية
 * تُعرض كما هي (رفض السحب يشرح نفسه: «لا يمكن النقل قبل...»)
 */
export const useMoveOperation = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (args: {
			id: string;
			to: OperationStatus;
			overrideReason?: string;
			cancelKind?: "OWNER" | "CLINIC" | "CLINICAL";
			cancelReason?: string;
		}) => {
			const res = await api.operations({ id: args.id }).status.patch({
				status: args.to,
				overrideReason: args.overrideReason,
				cancelKind: args.cancelKind,
				cancelReason: args.cancelReason,
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر نقل العملية"));
			return res.data;
		},
		onSettled: () => invalidateOperations(queryClient),
	});

	const moveOperation = (args: Parameters<typeof mutation.mutateAsync>[0]) => {
		const p = mutation.mutateAsync(args);
		p.catch((err: Error) => {
			toast.error(err.message || "تعذّر نقل العملية");
		});
		return p;
	};

	return { moveOperation, isPending: mutation.isPending };
};

/** تقدّم المرحلة خطوة داخل الحالة — الخادم يفرض بوابة الوقفة الآمنة (G5) */
export const useAdvanceStage = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (args: { id: string; direction: "next" | "previous" }) => {
			const res = await api
				.operations({ id: args.id })
				.stage.patch({ direction: args.direction });
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر تقدّم المرحلة"));
			return res.data;
		},
		onSettled: (_data, _error, variables) => {
			// المرحلة لا تحرّك أعمدة اللوحة — تُعاد الحالة المفتوحة وحدها فورًا
			void queryClient.invalidateQueries({ queryKey: ["operations"], refetchType: "none" });
			void queryClient.invalidateQueries({
				queryKey: ["operations", "case", variables.id],
			});
		},
	});

	const advanceStage = (args: Parameters<typeof mutation.mutateAsync>[0]) => {
		const p = mutation.mutateAsync(args);
		p.catch((err: Error) => {
			toast.error(err.message || "تعذّر تقدّم المرحلة");
		});
		return p;
	};

	return { advanceStage, isPending: mutation.isPending };
};
