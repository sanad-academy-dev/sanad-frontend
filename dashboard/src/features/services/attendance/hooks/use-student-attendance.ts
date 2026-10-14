import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { type ToasterProps, toast } from "sonner";

import { backendFetch } from "@/lib/backend-fetch";
import type { AttendanceResponse, AttendanceStatus } from "@/server/attendance/attendance.type";

const STORAGE_KEY = "sanad_student_attendance_records";

function getStoredRecords(): AttendanceResponse[] {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}

function saveStoredRecords(records: AttendanceResponse[]) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
	} catch {
		// ignore
	}
}

export function useStudentAttendance(start: Date, end: Date) {
	const startKey = format(start, "yyyy-MM-dd");
	const endKey = format(end, "yyyy-MM-dd");

	const { data, isLoading } = useQuery<AttendanceResponse[]>({
		queryKey: ["student-attendance", startKey, endKey],
		queryFn: async () => {
			try {
				const res = await backendFetch(`/api/attendance/students?start=${startKey}&end=${endKey}`);
				if (res.ok) {
					const backendData = await res.json();
					if (Array.isArray(backendData)) {
						// Merge into local cache
						const current = getStoredRecords();
						const map = new Map<string, AttendanceResponse>();
						for (const item of current) {
							map.set(`${item.staffId}-${String(item.date).slice(0, 10)}`, item);
						}
						for (const item of backendData) {
							map.set(`${item.staffId}-${String(item.date).slice(0, 10)}`, item);
						}
						saveStoredRecords(Array.from(map.values()));
						return backendData as AttendanceResponse[];
					}
				}
			} catch (e) {
				console.warn("Backend student attendance fetch failed, using local cache:", e);
			}

			// Local fallback
			const all = getStoredRecords();
			return all.filter((r) => {
				const d = (
					typeof r.date === "string" ? r.date : new Date(r.date).toISOString()
				).slice(0, 10);
				return d >= startKey && d <= endKey;
			});
		},
		staleTime: 1000 * 30,
	});

	return { records: data ?? [], isLoading };
}

type UpsertArgs = {
	staffId: string;
	date: string;
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

export function useUpsertStudentAttendance() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (args: UpsertArgs) => {
			const dayStr = args.date.slice(0, 10);
			let record: AttendanceResponse | null = null;

			try {
				const res = await backendFetch("/api/attendance/students", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						staffId: args.staffId,
						date: dayStr,
						status: args.status,
						hours: args.hours ?? 0,
						checkIn: args.checkIn ?? null,
						checkOut: args.checkOut ?? null,
						notes: args.notes ?? null,
					}),
				});

				if (res.ok) {
					record = await res.json();
				}
			} catch (e) {
				console.warn("Backend student attendance upsert failed, saving locally:", e);
			}

			// حفظ السجل محليًا أيضًا لضمان سرعة الاستجابة وعدم فقدان البيانات
			const all = getStoredRecords();
			const idx = all.findIndex((r) => {
				const rDate = (
					typeof r.date === "string" ? r.date : new Date(r.date).toISOString()
				).slice(0, 10);
				return r.staffId === args.staffId && rDate === dayStr;
			});

			const existing = idx >= 0 ? all[idx] : undefined;
			const localRecord: AttendanceResponse = record ?? {
				id: existing?.id ?? `std-att-${args.staffId}-${dayStr}`,
				staffId: args.staffId,
				date: dayStr as unknown as Date,
				checkIn:
					args.checkIn !== undefined
						? (args.checkIn as unknown as Date) ?? null
						: (existing?.checkIn ?? null),
				checkOut:
					args.checkOut !== undefined
						? (args.checkOut as unknown as Date) ?? null
						: (existing?.checkOut ?? null),
				status: args.status,
				hours: args.hours ?? existing?.hours ?? 0,
				notes: args.notes !== undefined ? args.notes : (existing?.notes ?? null),
			};

			if (idx >= 0) {
				all[idx] = localRecord;
			} else {
				all.push(localRecord);
			}

			saveStoredRecords(all);
			return localRecord;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["student-attendance"] });
		},
	});

	const upsert = async (args: UpsertArgs, opts?: UpsertOptions) =>
		toast.promise(mutation.mutateAsync(args), {
			loading: "جارٍ التسجيل...",
			success: opts?.successMessage ?? "تم تسجيل الحالة",
			error: (err: Error) => err.message || "فشل التسجيل",
			position: opts?.position,
		});

	return {
		upsert,
		upsertAsync: mutation.mutateAsync,
		isPending: mutation.isPending,
	};
}
