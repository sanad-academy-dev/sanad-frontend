import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type ToasterProps, toast } from "sonner";

import { api } from "@/lib/api";
import type { ShiftType } from "@/server/shifts/shifts.type";

type UpsertArgs = {
	staffId: string;
	date: string; // yyyy-MM-dd
	type: ShiftType;
	startMinute?: number | null;
	endMinute?: number | null;
	hours?: number;
	notes?: string | null;
};

type UpsertOptions = {
	successMessage?: string;
	position?: ToasterProps["position"];
};

export const useUpsertShift = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({
			staffId,
			date,
			type,
			startMinute,
			endMinute,
			hours,
			notes,
		}: UpsertArgs) => {
			const res = await api.shifts.post({
				staffId,
				date,
				type,
				startMinute,
				endMinute,
				hours,
				notes,
			});
			if (res.error) throw new Error("فشل جدولة المناوبة");
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["shifts"] });
		},
	});

	const upsert = async (args: UpsertArgs, opts?: UpsertOptions) =>
		toast.promise(mutation.mutateAsync(args), {
			loading: "جارٍ الجدولة...",
			success: opts?.successMessage ?? "تم جدولة المناوبة",
			error: (err: Error) => err.message || "فشل الجدولة",
			position: opts?.position,
		});

	// نسخة بدون توست — للاستخدام داخل عمليات مجمّعة
	const upsertAsync = (args: UpsertArgs) => mutation.mutateAsync(args);

	return { upsert, upsertAsync, isPending: mutation.isPending };
};
