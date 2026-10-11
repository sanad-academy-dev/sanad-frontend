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
				title: "إجمالي الأطفال",
				value: total,
				tooltip: "إجمالي الأطفال المسجلين في الأكاديمية",
			},
			{
				title: "الأطفال النشطين",
				value: active,
				tooltip: "عدد الأطفال النشطين حاليًا",
			},
			{
				title: "ذكور",
				value: male,
				tooltip: "إجمالي عدد الأطفال الذكور",
			},
			{
				title: "إناث",
				value: female,
				tooltip: "إجمالي عدد الأطفال الإناث",
			},
			{
				title: "مرتبط بوليّ أمر",
				value: withOwner,
				tooltip: "الأطفال المرتبطين بملف ولي أمر",
			},
		];
	}, [patients]);
}
