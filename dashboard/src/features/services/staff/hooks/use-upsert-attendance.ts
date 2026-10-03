import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type ToasterProps, toast } from "sonner";

import { api } from "@/lib/api";
import type { AttendanceStatus } from "@/server/attendance/attendance.type";

type UpsertArgs = {
	staffId: string;
	date: string; // yyyy-MM-dd
	status: AttendanceStatus;
	hours?: number;
	checkIn?: string | null;
	checkOut?: string | null;
	notes?: string | null;
};

type UpsertOptions = {
	successMessage?: string;
	position?: ToasterProps["position"];
};

export const useUpsertAttendance = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({
			staffId,
			date,
			status,
			hours,
			checkIn,
			checkOut,
			notes,
		}: UpsertArgs) => {
			const res = await api.attendance.post({
				staffId,
				date,
				status,
				hours,
				checkIn,
				checkOut,
				notes,
			});
			if (res.error) throw new Error("فشل تسجيل الحضور");
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["attendance"] });
		},
	});

	const upsert = async (args: UpsertArgs, opts?: UpsertOptions) =>
		toast.promise(mutation.mutateAsync(args), {
			loading: "جارٍ التسجيل...",
			success: opts?.successMessage ?? "تم تسجيل الحالة",
			error: (err: Error) => err.message || "فشل التسجيل",
			position: opts?.position,
		});

	// نسخة بدون توست — للاستخدام داخل عمليات مجمّعة (مثل تسجيل غياب لمدى تواريخ)
	const upsertAsync = (args: UpsertArgs) => mutation.mutateAsync(args);

	return { upsert, upsertAsync, isPending: mutation.isPending };
};
