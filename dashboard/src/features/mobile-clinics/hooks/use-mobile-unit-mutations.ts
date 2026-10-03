import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { MobileUnitStatus } from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import type {
	AddCrewMemberFormInput,
	CreateMobileUnitFormInput,
	MobileUnitResponse,
	PairDeviceFormInput,
	PairedDeviceWithQrResponse,
	UpdateMobileUnitFormInput,
} from "@/server/mobile-clinics/mobile-units/mobile-units.type";

const errMsg = (e: unknown, fallback: string) =>
	(e as { value?: { message?: string } })?.value?.message || fallback;

export const useMobileUnitMutations = (unitId?: string) => {
	const queryClient = useQueryClient();

	// المستودعات تُبطَّل أيضًا: إنشاء مركبة ينشئ مستودعًا، وحذفها يعطّله — فشاشات المخزون
	// المفتوحة في تبويب آخر تعرض قائمة قديمة ما لم تُبطَّل هنا.
	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: ["mobile-units"] });
		queryClient.invalidateQueries({ queryKey: ["warehouses"] });
		if (unitId) {
			queryClient.invalidateQueries({ queryKey: ["mobile-unit", unitId] });
			queryClient.invalidateQueries({ queryKey: ["mobile-unit-crew", unitId] });
			queryClient.invalidateQueries({ queryKey: ["mobile-unit-activity", unitId] });
			queryClient.invalidateQueries({ queryKey: ["mobile-unit-devices", unitId] });
		}
	};

	const createMut = useMutation({
		mutationFn: async (data: CreateMobileUnitFormInput): Promise<MobileUnitResponse> => {
			const res = await api["mobile-units"].post(data);
			if (res.error) throw new Error(errMsg(res.error, "فشل إنشاء الوحدة المتنقلة"));
			return res.data as MobileUnitResponse;
		},
		onSuccess: invalidate,
	});

	const updateMut = useMutation({
		mutationFn: async (vars: {
			id: string;
			data: UpdateMobileUnitFormInput;
		}): Promise<MobileUnitResponse> => {
			const res = await api["mobile-units"]({ id: vars.id }).patch(vars.data);
			if (res.error) throw new Error(errMsg(res.error, "فشل تعديل الوحدة المتنقلة"));
			return res.data as MobileUnitResponse;
		},
		onSuccess: invalidate,
	});

	const setActiveMut = useMutation({
		mutationFn: async (vars: { id: string; active: boolean }): Promise<MobileUnitResponse> => {
			const target = api["mobile-units"]({ id: vars.id });
			const res = vars.active ? await target.enable.post() : await target.disable.post();
			if (res.error)
				throw new Error(
					errMsg(res.error, vars.active ? "فشل تفعيل الوحدة" : "فشل إيقاف الوحدة"),
				);
			return res.data as MobileUnitResponse;
		},
		onSuccess: invalidate,
	});

	const setStatusMut = useMutation({
		mutationFn: async (vars: {
			id: string;
			status: MobileUnitStatus;
		}): Promise<MobileUnitResponse> => {
			const res = await api["mobile-units"]({ id: vars.id }).status.patch({
				status: vars.status,
			});
			if (res.error) throw new Error(errMsg(res.error, "فشل تغيير حالة الوحدة"));
			return res.data as MobileUnitResponse;
		},
		onSuccess: invalidate,
	});

	const deleteMut = useMutation({
		mutationFn: async (id: string) => {
			const res = await api["mobile-units"]({ id }).delete();
			if (res.error) throw new Error(errMsg(res.error, "فشل حذف الوحدة المتنقلة"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const addCrewMut = useMutation({
		mutationFn: async (vars: { id: string; data: AddCrewMemberFormInput }) => {
			const res = await api["mobile-units"]({ id: vars.id }).crew.post(vars.data);
			if (res.error) throw new Error(errMsg(res.error, "فشل إضافة عضو الطاقم"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const removeCrewMut = useMutation({
		mutationFn: async (vars: { id: string; crewId: string }) => {
			const res = await api["mobile-units"]({ id: vars.id })
				.crew({ crewId: vars.crewId })
				.delete();
			if (res.error) throw new Error(errMsg(res.error, "فشل إزالة عضو الطاقم"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const pairDeviceMut = useMutation({
		mutationFn: async (vars: {
			id: string;
			data: PairDeviceFormInput;
		}): Promise<PairedDeviceWithQrResponse> => {
			const res = await api["mobile-units"]({ id: vars.id }).devices.post(vars.data);
			if (res.error) throw new Error(errMsg(res.error, "فشل اقتران الجهاز"));
			return res.data as PairedDeviceWithQrResponse;
		},
		onSuccess: invalidate,
	});

	const revokeDeviceMut = useMutation({
		mutationFn: async (vars: { id: string; deviceId: string }) => {
			const res = await api["mobile-units"]({ id: vars.id })
				.devices({ deviceId: vars.deviceId })
				.revoke.post();
			if (res.error) throw new Error(errMsg(res.error, "فشل إبطال الجهاز"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	/**
	 * لا `toast.promise` هنا خلافًا لبقيّة الطفرات: نجاح الاقتران يعرض الرمز الخام مرّة
	 * واحدة في نافذة، وإشعارٌ عابر بجانبه يوحي بأنّ العملية انتهت فيُغلقها المستخدم قبل
	 * نسخ الرمز — والرمز لا يُسترجَع. الخطأ وحده يُعرض كإشعار.
	 */
	const pairDevice = async (id: string, data: PairDeviceFormInput) => {
		try {
			return await pairDeviceMut.mutateAsync({ id, data });
		} catch (e) {
			toast.error((e as Error).message || "فشل اقتران الجهاز");
			throw e;
		}
	};

	const revokeDevice = (id: string, deviceId: string) => {
		const p = revokeDeviceMut.mutateAsync({ id, deviceId });
		toast.promise(p, {
			loading: "جارٍ إبطال الجهاز...",
			success: "تم إبطال الجهاز — سيُرفض عند أول طلب",
			error: (e: Error) => e.message || "فشل إبطال الجهاز",
		});
		return p;
	};

	const createUnit = (data: CreateMobileUnitFormInput) => {
		const p = createMut.mutateAsync(data);
		toast.promise(p, {
			loading: "جارٍ إنشاء الوحدة...",
			success: (u) => `تم إنشاء الوحدة (${u.code}) ومستودعها`,
			error: (e: Error) => e.message || "فشل إنشاء الوحدة المتنقلة",
		});
		return p;
	};

	const updateUnit = (id: string, data: UpdateMobileUnitFormInput) => {
		const p = updateMut.mutateAsync({ id, data });
		toast.promise(p, {
			loading: "جارٍ حفظ التعديلات...",
			success: "تم حفظ التعديلات",
			error: (e: Error) => e.message || "فشل تعديل الوحدة المتنقلة",
		});
		return p;
	};

	const setUnitActive = (id: string, active: boolean) => {
		const p = setActiveMut.mutateAsync({ id, active });
		toast.promise(p, {
			loading: active ? "جارٍ تفعيل الوحدة..." : "جارٍ إيقاف الوحدة...",
			success: active ? "تم تفعيل الوحدة" : "تم إيقاف الوحدة — سيُقفل تطبيقها لدى الطاقم",
			error: (e: Error) => e.message || "فشل تغيير حالة التفعيل",
		});
		return p;
	};

	const setUnitStatus = (id: string, status: MobileUnitStatus) => {
		const p = setStatusMut.mutateAsync({ id, status });
		toast.promise(p, {
			loading: "جارٍ تحديث الحالة...",
			success: "تم تحديث حالة الوحدة",
			error: (e: Error) => e.message || "فشل تغيير حالة الوحدة",
		});
		return p;
	};

	const deleteUnit = (id: string) => {
		const p = deleteMut.mutateAsync(id);
		toast.promise(p, {
			loading: "جارٍ حذف الوحدة...",
			success: "تم حذف الوحدة",
			error: (e: Error) => e.message || "فشل حذف الوحدة المتنقلة",
		});
		return p;
	};

	const addCrewMember = (id: string, data: AddCrewMemberFormInput) => {
		const p = addCrewMut.mutateAsync({ id, data });
		toast.promise(p, {
			loading: "جارٍ إضافة عضو الطاقم...",
			success: "تمت إضافة عضو الطاقم",
			error: (e: Error) => e.message || "فشل إضافة عضو الطاقم",
		});
		return p;
	};

	const removeCrewMember = (id: string, crewId: string) => {
		const p = removeCrewMut.mutateAsync({ id, crewId });
		toast.promise(p, {
			loading: "جارٍ إزالة عضو الطاقم...",
			success: "تمت إزالة عضو الطاقم",
			error: (e: Error) => e.message || "فشل إزالة عضو الطاقم",
		});
		return p;
	};

	return {
		createUnit,
		updateUnit,
		setUnitActive,
		setUnitStatus,
		deleteUnit,
		addCrewMember,
		removeCrewMember,
		pairDevice,
		revokeDevice,
		isPairingDevice: pairDeviceMut.isPending,
		isRevokingDevice: revokeDeviceMut.isPending,
		isCreating: createMut.isPending,
		isUpdating: updateMut.isPending,
		isTogglingActive: setActiveMut.isPending,
		isDeleting: deleteMut.isPending,
		isMutatingCrew: addCrewMut.isPending || removeCrewMut.isPending,
	};
};
