import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

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
			const all = getStoredRecords();
			return all.filter((r) => {
				const d = (
					typeof r.date === "string" ? r.date : new Date(r.date).toISOString()
				).slice(0, 10);
				return d >= startKey && d <= endKey;
			});
		},
		staleTime: 0,
	});

	return { records: data ?? [], isLoading };
}

export function useUpsertStudentAttendance() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (args: {
			staffId: string;
			date: string;
			status: AttendanceStatus;
			hours?: number;
			checkIn?: string | null;
			checkOut?: string | null;
			notes?: string | null;
		}) => {
			const all = getStoredRecords();
			const dayStr = args.date.slice(0, 10);
			const idx = all.findIndex((r) => {
				const rDate = (
					typeof r.date === "string" ? r.date : new Date(r.date).toISOString()
				).slice(0, 10);
				return r.staffId === args.staffId && rDate === dayStr;
			});

			const newRecord: AttendanceResponse = {
				id: `std-att-${args.staffId}-${dayStr}`,
				clinicId: "students",
				staffId: args.staffId,
				date: dayStr as unknown as Date,
				checkIn: (args.checkIn as unknown as Date) ?? null,
				checkOut: (args.checkOut as unknown as Date) ?? null,
				status: args.status,
				hours: args.hours ?? 0,
				notes: args.notes ?? null,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			if (idx >= 0) {
				all[idx] = { ...all[idx], ...newRecord };
			} else {
				all.push(newRecord);
			}

			saveStoredRecords(all);
			return newRecord;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["student-attendance"] });
		},
	});

	return {
		upsert: mutation.mutate,
		upsertAsync: mutation.mutateAsync,
		isPending: mutation.isPending,
	};
}
