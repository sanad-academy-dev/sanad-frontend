import { useQuery } from "@tanstack/react-query";

import type { MobileUnitStatus } from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import type {
	EligibleStaffResponse,
	MobileUnitActivityResponse,
	MobileUnitCrewResponse,
	MobileUnitDetailResponse,
	MobileUnitDeviceResponse,
	MobileUnitResponse,
} from "@/server/mobile-clinics/mobile-units/mobile-units.type";

// مرجع ثابت — مصفوفة جديدة كل render تكسر مقارنات الاعتماديات في useEffect/useMemo
const EMPTY_UNITS: MobileUnitResponse[] = [];
const EMPTY_CREW: MobileUnitCrewResponse[] = [];
const EMPTY_ACTIVITY: MobileUnitActivityResponse[] = [];
const EMPTY_STAFF: EligibleStaffResponse[] = [];
const EMPTY_DEVICES: MobileUnitDeviceResponse[] = [];

export type MobileUnitsFilters = {
	branchId?: string;
	status?: MobileUnitStatus;
	scope?: "active" | "all";
	search?: string;
};

export const mobileUnitsKeys = {
	list: (filters: MobileUnitsFilters) => ["mobile-units", filters] as const,
	detail: (id: string) => ["mobile-unit", id] as const,
	crew: (id: string) => ["mobile-unit-crew", id] as const,
	activity: (id: string) => ["mobile-unit-activity", id] as const,
	devices: (id: string) => ["mobile-unit-devices", id] as const,
	eligibleStaff: (branchId?: string) => ["mobile-unit-eligible-staff", branchId] as const,
};

export const useMobileUnits = (filters: MobileUnitsFilters = {}) => {
	const { data, isLoading, refetch } = useQuery<MobileUnitResponse[]>({
		queryKey: mobileUnitsKeys.list(filters),
		queryFn: async () => {
			const res = await api["mobile-units"].get({ query: filters });
			if (res.error) throw new Error("فشل جلب الوحدات المتنقلة");
			return res.data as MobileUnitResponse[];
		},
		staleTime: 1000 * 60,
	});

	return { units: Array.isArray(data) ? data : EMPTY_UNITS, isLoading, refetch };
};

export const useMobileUnit = (id: string | null) => {
	const { data, isLoading } = useQuery<MobileUnitDetailResponse>({
		queryKey: mobileUnitsKeys.detail(id ?? ""),
		enabled: Boolean(id),
		queryFn: async () => {
			const res = await api["mobile-units"]({ id: id as string }).get();
			if (res.error) throw new Error("فشل جلب بيانات الوحدة");
			return res.data as MobileUnitDetailResponse;
		},
	});

	return { unit: data ?? null, isLoading };
};

export const useMobileUnitCrew = (id: string | null) => {
	const { data, isLoading } = useQuery<MobileUnitCrewResponse[]>({
		queryKey: mobileUnitsKeys.crew(id ?? ""),
		enabled: Boolean(id),
		queryFn: async () => {
			const res = await api["mobile-units"]({ id: id as string }).crew.get();
			if (res.error) throw new Error("فشل جلب طاقم الوحدة");
			return res.data as MobileUnitCrewResponse[];
		},
	});

	return { crew: Array.isArray(data) ? data : EMPTY_CREW, isLoading };
};

export const useMobileUnitActivity = (id: string | null) => {
	const { data, isLoading } = useQuery<MobileUnitActivityResponse[]>({
		queryKey: mobileUnitsKeys.activity(id ?? ""),
		enabled: Boolean(id),
		queryFn: async () => {
			const res = await api["mobile-units"]({ id: id as string }).activity.get();
			if (res.error) throw new Error("فشل جلب سجل الوحدة");
			return res.data as MobileUnitActivityResponse[];
		},
	});

	return { activity: Array.isArray(data) ? data : EMPTY_ACTIVITY, isLoading };
};

/**
 * [MC2.3] أجهزة المركبة المقترنة. الاستجابة لا تحمل الرمز ولا تجزئته — البادئة فقط،
 * فلا فائدة من اعتراض هذا الطلب.
 */
export const useMobileUnitDevices = (id: string | null, enabled = true) => {
	const { data, isLoading } = useQuery<MobileUnitDeviceResponse[]>({
		queryKey: mobileUnitsKeys.devices(id ?? ""),
		enabled: Boolean(id) && enabled,
		queryFn: async () => {
			const res = await api["mobile-units"]({ id: id as string }).devices.get();
			if (res.error) throw new Error("فشل جلب أجهزة الوحدة");
			return res.data as MobileUnitDeviceResponse[];
		},
	});

	return { devices: Array.isArray(data) ? data : EMPTY_DEVICES, isLoading };
};

/**
 * [MC1.4] المرشّحون للطاقم — الخادم يرشّحهم بـ
 * `schedulingSettings.mobileClinicAppointmentsEnabled`، فقائمة فارغة هنا تعني عادةً أنّ
 * أحدًا لم يُفعَّل بعد لزيارات الأكاديمية المتنقلة، لا أنّ الأكاديمية بلا موظفين.
 */
export const useEligibleStaff = (branchId?: string, enabled = true) => {
	const { data, isLoading } = useQuery<EligibleStaffResponse[]>({
		queryKey: mobileUnitsKeys.eligibleStaff(branchId),
		enabled,
		queryFn: async () => {
			const res = await api["mobile-units"]["eligible-staff"].get({
				query: branchId ? { branchId } : {},
			});
			if (res.error) throw new Error("فشل جلب الموظفين المؤهّلين");
			return res.data as EligibleStaffResponse[];
		},
		staleTime: 1000 * 60 * 5,
	});

	return { staff: Array.isArray(data) ? data : EMPTY_STAFF, isLoading };
};
