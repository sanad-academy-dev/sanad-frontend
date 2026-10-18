import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { type ToasterProps, toast } from "sonner";

import { backendFetch } from "@/lib/backend-fetch";
import type { ShiftAssignmentResponse, ShiftType } from "@/server/shifts/shifts.type";

const STORAGE_KEY = "sanad_student_shifts_records";

function getStoredShifts(): ShiftAssignmentResponse[] {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}

function saveStoredShifts(records: ShiftAssignmentResponse[]) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
	} catch {
		// ignore
	}
}

export function useStudentShifts(start: Date, end: Date) {
	const startKey = format(start, "yyyy-MM-dd");
	const endKey = format(end, "yyyy-MM-dd");

	const { data, isLoading } = useQuery<ShiftAssignmentResponse[]>({
		queryKey: ["student-shifts", startKey, endKey],
		queryFn: async () => {
			try {
				const res = await backendFetch(`/api/shifts/students?start=${startKey}&end=${endKey}`);
				if (res.ok) {
					const backendData = await res.json();
					if (Array.isArray(backendData)) {
						const current = getStoredShifts();
						const map = new Map<string, ShiftAssignmentResponse>();
						for (const item of current) {
							map.set(`${item.staffId}-${String(item.date).slice(0, 10)}`, item);
						}
						for (const item of backendData) {
							map.set(`${item.staffId}-${String(item.date).slice(0, 10)}`, item);
						}
						saveStoredShifts(Array.from(map.values()));
						return backendData as ShiftAssignmentResponse[];
					}
				}
			} catch (e) {
				console.warn("Backend student shifts fetch failed, using local cache:", e);
			}

			// Local fallback
			const all = getStoredShifts();
			return all.filter((r) => {
				const d = (
					typeof r.date === "string" ? r.date : new Date(r.date).toISOString()
				).slice(0, 10);
				return d >= startKey && d <= endKey;
			});
		},
		staleTime: 1000 * 30,
	});

	return { shifts: data ?? [], isLoading };
}

type UpsertStudentShiftArgs = {
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

export function useUpsertStudentShift() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (args: UpsertStudentShiftArgs) => {
			const dayStr = args.date.slice(0, 10);
			let record: ShiftAssignmentResponse | null = null;

			try {
				const res = await backendFetch("/api/shifts/students", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						staffId: args.staffId,
						date: dayStr,
						type: args.type,
						startMinute: args.startMinute ?? null,
						endMinute: args.endMinute ?? null,
						hours: args.hours ?? 8,
						notes: args.notes ?? null,
					}),
				});

				if (res.ok) {
					record = await res.json();
				}
			} catch (e) {
				console.warn("Backend student shift upsert failed, saving locally:", e);
			}

			// Save to local cache as well
			const all = getStoredShifts();
			const idx = all.findIndex((r) => {
				const rDate = (
					typeof r.date === "string" ? r.date : new Date(r.date).toISOString()
				).slice(0, 10);
				return r.staffId === args.staffId && rDate === dayStr;
			});

			const existing = idx >= 0 ? all[idx] : undefined;
			const localRecord: ShiftAssignmentResponse = record ?? {
				id: existing?.id ?? `std-shift-${args.staffId}-${dayStr}`,
				clinicId: "students",
				staffId: args.staffId,
				date: dayStr as unknown as Date,
				type: args.type,
				startMinute: args.startMinute !== undefined ? args.startMinute : (existing?.startMinute ?? null),
				endMinute: args.endMinute !== undefined ? args.endMinute : (existing?.endMinute ?? null),
				hours: args.hours ?? existing?.hours ?? 8,
				notes: args.notes ?? existing?.notes ?? null,
				createdAt: existing?.createdAt ?? new Date(),
				updatedAt: new Date(),
			};

			if (idx >= 0) {
				all[idx] = localRecord;
			} else {
				all.push(localRecord);
			}
			saveStoredShifts(all);

			return localRecord;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["student-shifts"] });
		},
	});

	const upsert = async (args: UpsertStudentShiftArgs, opts?: UpsertOptions) =>
		toast.promise(mutation.mutateAsync(args), {
			loading: "جارٍ جدولة مناوبة الطالب...",
			success: opts?.successMessage ?? "تم جدولة مناوبة الطالب بنجاح",
			error: (err: Error) => err.message || "فشل الجدولة",
			position: opts?.position,
		});

	return {
		upsert,
		upsertAsync: mutation.mutateAsync,
		isPending: mutation.isPending,
	};
}

export function useDeleteStudentShift() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ staffId, date }: { staffId: string; date: string }) => {
			const dayStr = date.slice(0, 10);

			try {
				await backendFetch(`/api/shifts/students?staffId=${staffId}&date=${dayStr}`, {
					method: "DELETE",
				});
			} catch (e) {
				console.warn("Backend student shift delete failed, updating local cache:", e);
			}

			const all = getStoredShifts();
			const filtered = all.filter((r) => {
				const rDate = (
					typeof r.date === "string" ? r.date : new Date(r.date).toISOString()
				).slice(0, 10);
				return !(r.staffId === staffId && rDate === dayStr);
			});
			saveStoredShifts(filtered);
			return { success: true };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["student-shifts"] });
		},
	});

	return {
		remove: mutation.mutate,
		removeAsync: mutation.mutateAsync,
		isPending: mutation.isPending,
	};
}
