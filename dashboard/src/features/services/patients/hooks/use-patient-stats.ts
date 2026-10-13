import { useMemo } from "react";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import type { PatientResponse } from "@/server/patients/patients.type";

export function usePatientStats(patients: PatientResponse[]): StatItem[] {
	return useMemo(() => {
		const total = patients.length;
		const active = patients.filter((p) => p.active).length;
		const male = patients.filter((p) => p.gender === "MALE").length;
		const female = patients.filter((p) => p.gender === "FEMALE").length;
		const withOwner = patients.filter((p) => Boolean(p.owner)).length;

		return [
			{
				title: "إجمالي الطلاب",
				value: total,
				tooltip: "إجمالي الطلاب المسجلين في الأكاديمية",
			},
			{
				title: "الطلاب النشطين",
				value: active,
				tooltip: "عدد الطلاب النشطين حاليًا",
			},
			{
				title: "ذكور",
				value: male,
				tooltip: "إجمالي عدد الطلاب الذكور",
			},
			{
				title: "إناث",
				value: female,
				tooltip: "إجمالي عدد الطالبات",
			},
			{
				title: "مرتبط بوليّ أمر",
				value: withOwner,
				tooltip: "الطلاب المرتبطين بملف ولي أمر",
			},
		];
	}, [patients]);
}
