import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

/**
 * رسالة الخطأ من الخادم بنصّها.
 *
 * `String(error.value)` على كائن يُنتج «[object Object]» — وهو ما كان يظهر للمدرّب
 * عند فشل إضافة دواء بدل سبب الرفض الحقيقي. الخادم يردّ `{ message }` لأخطاء
 * المجال، و`{ summary }` لأخطاء تحقّق Elysia (422)، فيُقرأ الاثنان.
 */
function apiMessage(value: unknown, fallback: string): string {
	if (typeof value === "string" && value.trim()) return value;
	if (value && typeof value === "object") {
		const v = value as Record<string, unknown>;
		if (typeof v.message === "string" && v.message.trim()) return v.message;
		if (typeof v.summary === "string" && v.summary.trim()) return v.summary;
	}
	return fallback;
}
/** مفاتيح الاستعلام في مكان واحد — الإبطال بعد الطفرات يلمس الشجرة كلها */
export const pharmacyKeys = {
	all: ["pharmacy"] as const,
	settings: () => [...pharmacyKeys.all, "settings"] as const,
	summary: () => [...pharmacyKeys.all, "summary"] as const,
	prescriptions: (filters?: Record<string, unknown>) =>
		[...pharmacyKeys.all, "prescriptions", filters ?? {}] as const,
	prescription: (id: string) => [...pharmacyKeys.all, "prescription", id] as const,
	counterSales: () => [...pharmacyKeys.all, "counter-sales"] as const,
	doseContext: (filters?: Record<string, unknown>) =>
		[...pharmacyKeys.all, "dose-context", filters ?? {}] as const,
	drugOptions: (search?: string) =>
		[...pharmacyKeys.all, "drug-options", search ?? ""] as const,
	batches: (filters?: Record<string, unknown>) =>
		[...pharmacyKeys.all, "batches", filters ?? {}] as const,
	remaining: (itemId: string) => [...pharmacyKeys.all, "remaining", itemId] as const,
	formulary: (filters?: Record<string, unknown>) =>
		[...pharmacyKeys.all, "formulary", filters ?? {}] as const,
	monograph: (id: string) => [...pharmacyKeys.all, "monograph", id] as const,
	controlled: () => [...pharmacyKeys.all, "controlled"] as const,
	reports: (kind: string, filters?: Record<string, unknown>) =>
		[...pharmacyKeys.all, "reports", kind, filters ?? {}] as const,
};

/**
 * إعدادات الوحدة — تُقرأ أولًا لأن كل شيء آخر خلف الراية. ردّ 404 من بقية النقاط
 * يعني «الوحدة مطفأة» لا «عطل»، والشاشة تعرض ذلك بدل رسالة خطأ عامّة.
 */
export const usePharmacySettings = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: pharmacyKeys.settings(),
		queryFn: async () => {
			const { data, error } = await api["pharmacy-settings"].get();
			// رسالة الخادم أولًا، وإلا رمز الحالة. النصّ العامّ وحده كان يُخفي السبب:
			// ظهر «تعذّر تحميل إعدادات الصيدلية» مرّتين على الشاشة — عنوانًا ورسالةً —
			// بينما كان السبب الحقيقي أن جدول الإعدادات لم يكن قد رُحِّل بعد.
			if (error)
				throw new Error(
					typeof error.value === "object" && error.value && "message" in error.value
						? String((error.value as { message: unknown }).message)
						: `تعذّر تحميل إعدادات الصيدلية (${error.status})`,
				);
			return data;
		},
		staleTime: 1000 * 60 * 5,
	});

	// `error` يُصدَّر كي تميّز الشاشة الفشل عن الانتظار — بدونه يدور الهيكل بلا نهاية
	return { settings: data ?? null, isLoading, error, enabled: data?.enabled ?? false };
};

/** تعديل إعدادات الوحدة — للمدير وحده (الخادم يردّ 403 لغيره) */
export const useUpdatePharmacySettings = () => {
	const qc = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (body: {
			enabled?: boolean;
			requireWitnessOnWaste?: boolean;
			defaultLabelCopies?: number;
			fefoSuggestion?: boolean;
			controlledRegisterEnabled?: boolean;
		}) => {
			const { data, error } = await api["pharmacy-settings"].patch(body);
			if (error) throw new Error(apiMessage(error.value, "تعذّر حفظ الإعدادات"));
			return data;
		},
		// الشجرة كلها: إطفاء الوحدة يجعل كل نقطة أخرى تردّ 404، فقائمة قديمة في
		// الذاكرة المؤقتة تُظهر وصفات لوحدة صارت مطفأة
		onSuccess: () => qc.invalidateQueries({ queryKey: pharmacyKeys.all }),
	});

	return {
		update: (body: Parameters<typeof mutation.mutateAsync>[0]) =>
			toast.promise(mutation.mutateAsync(body), {
				loading: "جارٍ الحفظ...",
				success: "حُفظت الإعدادات",
				error: (e: Error) => e.message,
			}),
		isPending: mutation.isPending,
	};
};

export const usePrescriptions = (
	filters: {
		status?: "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED";
		patientId?: string;
		search?: string;
	},
	/** الوحدة مطفأة ⇒ لا نداء أصلًا: النقطة تردّ 404 وهو ليس خطأً يستحق العرض */
	enabled = true,
) => {
	const { data, isLoading, refetch } = useQuery({
		enabled,
		queryKey: pharmacyKeys.prescriptions(filters),
		queryFn: async () => {
			const { data, error } = await api.prescriptions.get({ query: filters });
			if (error) throw new Error("تعذّر تحميل الوصفات");
			return data;
		},
	});

	return { prescriptions: data ?? [], isLoading, refetch };
};

/** وصفات طفل بعينه — تبويب الأدوية في ملفّه (§11.5) */
export const usePatientPrescriptions = (patientId: string, enabled = true) => {
	const { data, isLoading } = useQuery({
		enabled: enabled && !!patientId,
		queryKey: pharmacyKeys.prescriptions({ patientId }),
		queryFn: async () => {
			const { data, error } = await api.prescriptions.get({ query: { patientId } });
			if (error) throw new Error("تعذّر تحميل الوصفات");
			return data;
		},
	});
	return { prescriptions: data ?? [], isLoading };
};
/** عدّادات الشاشة العليا — استعلام تجميع واحد في الخادم لا أربعة */
export const usePrescriptionsSummary = (enabled = true) => {
	const { data, isLoading } = useQuery({
		enabled,
		queryKey: pharmacyKeys.summary(),
		queryFn: async () => {
			const { data, error } = await api.prescriptions.summary.get();
			if (error) throw new Error("تعذّر تحميل العدّادات");
			return data;
		},
	});

	// أصفار حتى يصل الردّ: الشاشة تعرض أربع بطاقات دائمًا، وظهورها فارغةً ثم
	// امتلاؤها أهدأ من اختفائها وعودتها
	return {
		summary: data ?? { draft: 0, active: 0, completed: 0, cancelled: 0 },
		isLoading,
	};
};
export const usePrescription = (id: string | null) => {
	const { data, isLoading } = useQuery({
		queryKey: pharmacyKeys.prescription(id ?? ""),
		enabled: !!id,
		queryFn: async () => {
			const { data, error } = await api.prescriptions({ id: id as string }).get();
			if (error) throw new Error("تعذّر تحميل الوصفة");
			return data;
		},
	});

	return { prescription: data ?? null, isLoading };
};

/**
 * سياق الجرعة. **لا يُستدعى إلا بمفتاح مادة فعّالة**: بدونه لا شيء يُحسب، ونداءٌ
 * فارغ كان سيُعيد رفضًا يبدو خطأً في الشاشة.
 */
export const useDoseContext = (params: {
	patientId?: string;
	genericKey?: string;
	route?: string;
	frequencyCode?: string;
	durationDays?: number;
}) => {
	const ready = !!params.patientId && !!params.genericKey;

	const { data, isLoading } = useQuery({
		queryKey: pharmacyKeys.doseContext(params),
		enabled: ready,
		queryFn: async () => {
			const { data, error } = await api.prescriptions["dose-context"].get({
				query: {
					patientId: params.patientId as string,
					genericKey: params.genericKey as string,
					...(params.route ? { route: params.route } : {}),
					...(params.frequencyCode ? { frequencyCode: params.frequencyCode } : {}),
					...(params.durationDays ? { durationDays: params.durationDays } : {}),
				},
			});
			if (error) throw new Error("تعذّر حساب الجرعة");
			return data;
		},
	});

	return { context: data ?? null, isLoading };
};

export const useDispenseBatches = (params: { itemId?: string; warehouseId?: string }) => {
	const ready = !!params.itemId && !!params.warehouseId;

	const { data, isLoading } = useQuery({
		queryKey: pharmacyKeys.batches(params),
		enabled: ready,
		queryFn: async () => {
			const { data, error } = await api.dispense.batches.get({
				query: { itemId: params.itemId as string, warehouseId: params.warehouseId as string },
			});
			if (error) throw new Error("تعذّر تحميل الدفعات");
			return data;
		},
	});

	return { batches: data ?? [], isLoading };
};

/** أصناف المخزون القابلة للوصف — المربوطة بمستحضر مسجَّل وحدها */
export const useDrugOptions = (search?: string) => {
	const { data, isLoading } = useQuery({
		queryKey: pharmacyKeys.drugOptions(search),
		queryFn: async () => {
			const { data, error } = await api.prescriptions["drug-options"].get({
				query: search ? { search } : {},
			});
			if (error) throw new Error("تعذّر تحميل الأدوية");
			return data;
		},
		staleTime: 1000 * 60 * 5,
	});

	return { options: data ?? [], isLoading };
};

/**
 * وصفة هذه الزيارة — واحدة لكل زيارة عمليًّا.
 *
 * تُقرأ ولا تُنشأ هنا: إنشاؤها عند مجرّد فتح تبويب الخطة العلاجية كان سيملأ
 * قاعدة البيانات بمسوّدات فارغة لكل زيارة فُتحت ولم يُوصف فيها شيء. الإنشاء
 * يقع عند إضافة أول دواء (`addItem` أدناه).
 */
export const useContextPrescription = (
	ctx: { appointmentId?: string; inpatientStayId?: string },
	enabled = true,
) => {
	// شكل واحد بحقلين اختياريين لا اتحاد شكلين: الاتحاد يُسقط استنتاج Treaty
	// للاستجابة إلى `any`، فتضيع أنواع بنود الوصفة عند القارئ
	const key: { appointmentId?: string; inpatientStayId?: string } = ctx.inpatientStayId
		? { inpatientStayId: ctx.inpatientStayId }
		: { appointmentId: ctx.appointmentId };
	const { data, isLoading } = useQuery({
		enabled: enabled && Boolean(ctx.appointmentId || ctx.inpatientStayId),
		queryKey: pharmacyKeys.prescriptions(key),
		queryFn: async () => {
			const { data, error } = await api.prescriptions.get({ query: key });
			if (error) throw new Error("تعذّر تحميل الوصفة");
			// وصفة الإقامة قد تتعدّد عبر أيامها — الأحدث هي المفتوحة الآن
			const first = data?.[0];
			if (!first) return null;
			// القائمة مختصرة بلا بنود — التفاصيل تحتاج قراءة المستند نفسه
			const detail = await api.prescriptions({ id: first.id }).get();
			if (detail.error) throw new Error("تعذّر تحميل الوصفة");
			return detail.data;
		},
	});

	return { prescription: data ?? null, isLoading };
};

/** توافق: الزيارة حالة خاصّة من السياق */
export const useAppointmentPrescription = (appointmentId: string, enabled = true) =>
	useContextPrescription({ appointmentId }, enabled);
/**
 * صياغة تعليمات الاستعمال آليًّا.
 *
 * **إعادة صياغة لا اشتقاق**: الأرقام تُرسل محسوبةً من الخطة ويُعاد نصّ حولها.
 * والنتيجة اقتراح يملأ حقلًا يبقى للمدرّب — لا شيء يُحفظ خلفه.
 */
export const useDraftSig = () => {
	const mutation = useMutation({
		mutationFn: async (body: {
			drugName: string;
			doseText?: string;
			measuredText?: string;
			routeLabel?: string;
			frequencyLabel?: string;
			durationDays?: number;
			speciesLabel?: string;
			warnings?: string[];
		}) => {
			const { data, error } = await api.prescriptions["draft-sig"].post(body);
			if (error)
				throw new Error(
					typeof error.value === "object" && error.value && "message" in error.value
						? String((error.value as { message: unknown }).message)
						: "تعذّرت الصياغة الآلية",
				);
			return data.text;
		},
	});

	return { draftSig: mutation.mutateAsync, isDrafting: mutation.isPending };
};
// ── الطبقة الثانية: تأليف النشرات وتغطيتها (§3، §11.3) ──────────────────────

export const useFormulary = (search?: string) => {
	const { data, isLoading } = useQuery({
		queryKey: pharmacyKeys.formulary({ search }),
		queryFn: async () => {
			const { data, error } = await api.formulary.get({ query: search ? { search } : {} });
			if (error) throw new Error("تعذّر تحميل النشرات");
			return data;
		},
	});
	return { monographs: data ?? [], isLoading };
};

export const useMonograph = (id: string | null) => {
	const { data, isLoading } = useQuery({
		enabled: !!id,
		queryKey: pharmacyKeys.monograph(id ?? ""),
		queryFn: async () => {
			const { data, error } = await api.formulary({ id: id as string }).get();
			if (error) throw new Error("تعذّر تحميل النشرة");
			return data;
		},
	});
	return { monograph: data ?? null, isLoading };
};

/** ما ينقص تأليفه، مرتَّبًا بما تستعمله الأكاديمية فعلًا (§7.6) */
export const useFormularyCoverage = (enabled = true) => {
	const { data, isLoading } = useQuery({
		enabled,
		queryKey: [...pharmacyKeys.formulary(), "coverage"],
		queryFn: async () => {
			const { data, error } = await api.formulary.coverage.get();
			if (error) throw new Error("تعذّر تحميل التغطية");
			return data;
		},
	});
	return { coverage: data ?? null, isLoading };
};

export const useFormularyMutations = () => {
	const qc = useQueryClient();
	const invalidate = () => qc.invalidateQueries({ queryKey: pharmacyKeys.all });

	const saveMonograph = useMutation({
		mutationFn: async (body: {
			genericKey: string;
			genericName: string;
			genericNameAr?: string;
			summaryAr?: string;
			sourceCitation: string;
			reviewedBy?: string;
		}) => {
			const { data, error } = await api.formulary.post(body);
			if (error) throw new Error(apiMessage(error.value, "تعذّر الحفظ"));
			return data;
		},
		onSuccess: invalidate,
	});

	const saveDose = useMutation({
		mutationFn: async (body: {
			monographId: string;
			species: string;
			contraindicated?: boolean;
			doseMin?: string;
			doseMax?: string;
			doseUnit?: string;
			route?: string;
			frequency?: string;
			warningAr?: string;
		}) => {
			// biome-ignore lint/suspicious/noExplicitAny: النوع المولَّد يضيّق `species` إلى enum
			const { data, error } = await api.formulary.doses.post(body as any);
			if (error) throw new Error(apiMessage(error.value, "تعذّر الحفظ"));
			return data;
		},
		onSuccess: invalidate,
	});

	return {
		saveMonograph: (b: Parameters<typeof saveMonograph.mutateAsync>[0]) =>
			toast.promise(saveMonograph.mutateAsync(b), {
				loading: "جارٍ الحفظ...",
				success: "حُفظت النشرة",
				error: (e: Error) => e.message,
			}),
		saveDose: (b: Parameters<typeof saveDose.mutateAsync>[0]) =>
			toast.promise(saveDose.mutateAsync(b), {
				loading: "جارٍ الحفظ...",
				success: "حُفظت الجرعة",
				error: (e: Error) => e.message,
			}),
		isPending: saveMonograph.isPending || saveDose.isPending,
	};
};

// ── سجل المواد المراقبة (§8، §11.4) ─────────────────────────────────────────

export const useControlledSubstances = (enabled = true) => {
	const { data, isLoading, error } = useQuery({
		enabled,
		queryKey: pharmacyKeys.controlled(),
		queryFn: async () => {
			const { data, error } = await api.controlled.substances.get();
			if (error)
				throw new Error(
					typeof error.value === "object" && error.value && "message" in error.value
						? String((error.value as { message: unknown }).message)
						: "تعذّر تحميل السجل",
				);
			return data;
		},
	});
	return { substances: data ?? [], isLoading, error };
};

export const useControlledLedger = (inventoryItemId: string | null) => {
	const { data, isLoading } = useQuery({
		enabled: !!inventoryItemId,
		queryKey: [...pharmacyKeys.controlled(), "ledger", inventoryItemId],
		queryFn: async () => {
			const { data, error } = await api.controlled.ledger.get({
				query: { inventoryItemId: inventoryItemId as string },
			});
			if (error) throw new Error("تعذّر تحميل الحركات");
			return data;
		},
	});
	return { ledger: data ?? [], isLoading };
};

// ── كاونتر الصيدلية [PH16] ───────────────────────────────────────────────────

export const useCounterSales = (enabled = true) => {
	const { data, isLoading } = useQuery({
		enabled,
		queryKey: pharmacyKeys.counterSales(),
		queryFn: async () => {
			const { data, error } = await api.dispense["counter-sales"].get();
			if (error) throw new Error("تعذّر تحميل مبيعات الكاونتر");
			return data;
		},
	});
	return { sales: data ?? [], isLoading };
};

export const useDispenseCounterSale = () => {
	const qc = useQueryClient();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (saleId: string) => {
			const { data, error } = await api.dispense["counter-sales"]({
				id: saleId,
			}).dispense.post();
			if (error) throw new Error(apiMessage(error.value, "تعذّر صرف الفاتورة"));
			return data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: pharmacyKeys.all });
			qc.invalidateQueries({ queryKey: ["sales"] });
			qc.invalidateQueries({ queryKey: ["inventory"] });
		},
	});
	return { dispenseSale: mutateAsync, isPending };
};

// ── التقارير (§12) ──────────────────────────────────────────────────────────

// خطّاف لكل تقرير: معامل تمييزٍ واحد كان يُرجِع اتّحاد الأنواع الثلاثة، فلا يضيق
// النوع عند أي استدعاء ويحسب المستهلك أن كل الحقول متاحة في كل تقرير.
export const useDispensingReport = (enabled = true) => {
	const { data, isLoading } = useQuery({
		enabled,
		queryKey: pharmacyKeys.reports("dispensing"),
		queryFn: async () => {
			const r = await api["pharmacy-reports"].dispensing.get({ query: {} });
			if (r.error) throw new Error("تعذّر تحميل التقرير");
			return r.data;
		},
	});
	return { report: data, isLoading };
};

export const useOverridesReport = (enabled = true) => {
	const { data, isLoading } = useQuery({
		enabled,
		queryKey: pharmacyKeys.reports("overrides"),
		queryFn: async () => {
			const r = await api["pharmacy-reports"].overrides.get({ query: {} });
			if (r.error) throw new Error("تعذّر تحميل التقرير");
			return r.data;
		},
	});
	return { report: data, isLoading };
};

// ── المواد المنتهية والإتلاف [PH17] ─────────────────────────────────────────

export const useExpiredReport = (enabled = true) => {
	const { data, isLoading } = useQuery({
		enabled,
		queryKey: pharmacyKeys.reports("expired"),
		queryFn: async () => {
			const r = await api["pharmacy-reports"].expired.get();
			if (r.error) throw new Error("تعذّر تحميل المواد المنتهية");
			return r.data;
		},
	});
	return { expired: data ?? [], isLoading };
};

/** مستخدمو الأكاديمية الصالحون شهودًا على الإتلاف — مستخدمون حقيقيّون لا أسماء حرّة */
export const useWitnessCandidates = (enabled = true) => {
	const { data, isLoading } = useQuery({
		enabled,
		queryKey: [...pharmacyKeys.all, "witness-candidates"] as const,
		queryFn: async () => {
			const r = await api["pharmacy-reports"]["witness-candidates"].get();
			if (r.error) throw new Error("تعذّر تحميل قائمة الشهود");
			return r.data;
		},
	});
	return { candidates: data ?? [], isLoading };
};

export const useDisposeBatch = () => {
	const qc = useQueryClient();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: {
			batchId: string;
			qty: number;
			reasonAr: string;
			witnessIds: string[];
		}) => {
			const { batchId, ...body } = input;
			const r = await api["pharmacy-reports"].expired({ batchId }).dispose.post(body);
			if (r.error) throw new Error(apiMessage(r.error.value, "تعذّر إتلاف الدفعة"));
			return r.data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: pharmacyKeys.all });
			qc.invalidateQueries({ queryKey: ["inventory"] });
			qc.invalidateQueries({ queryKey: ["stock-overview"] });
		},
	});
	return { disposeBatch: mutateAsync, isPending };
};

export const useExpiringReport = (enabled = true) => {
	const { data, isLoading } = useQuery({
		enabled,
		queryKey: pharmacyKeys.reports("expiring"),
		queryFn: async () => {
			const r = await api["pharmacy-reports"].expiring.get();
			if (r.error) throw new Error("تعذّر تحميل التقرير");
			return r.data;
		},
	});
	return { report: data, isLoading };
};
export const usePharmacyMutations = () => {
	const qc = useQueryClient();
	const invalidate = () => qc.invalidateQueries({ queryKey: pharmacyKeys.all });

	const createPrescription = useMutation({
		mutationFn: async (body: {
			patientId: string;
			appointmentId?: string;
			notesAr?: string;
		}) => {
			const { data, error } = await api.prescriptions.post(body);
			if (error) throw new Error(apiMessage(error.value, "تعذّر إنشاء الوصفة"));
			return data;
		},
		onSuccess: invalidate,
	});

	const issuePrescription = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await api.prescriptions({ id }).issue.post();
			if (error) throw new Error(apiMessage(error.value, "تعذّر إصدار الوصفة"));
			return data;
		},
		onSuccess: invalidate,
	});

	/**
	 * إضافة دواء — **تُنشئ مسوّدة الوصفة عند أول دواء** إن لم تكن موجودة.
	 *
	 * المدرّب لا يجب أن يُطالَب بـ«إنشاء وصفة» ثم «إضافة دواء»: خطوتان لشيء واحد.
	 * ولا تُنشأ عند فتح الشاشة، وإلا امتلأت قاعدة البيانات بمسوّدات فارغة لكل
	 * زيارة فُتحت ولم يُوصف فيها شيء.
	 */
	const addItemMutation = useMutation({
		mutationFn: async (payload: {
			appointmentId?: string;
			inpatientStayId?: string;
			patientId: string;
			prescriptionId: string | null;
			inventoryItemId: string;
			catalogProductId: string | null;
			nameSnapshot: string;
			doseAmount?: string;
			doseUnit?: string;
			route?: string;
			frequency?: string;
			durationDays?: number;
			quantity: string;
			quantityUnit: string;
			instructionsAr: string;
			doseSource?: "CALCULATED" | "MANUAL" | "OVERRIDE";
			overrideReasonAr?: string;
		}) => {
			let id = payload.prescriptionId;
			if (!id) {
				const created = await api.prescriptions.post({
					patientId: payload.patientId,
					...(payload.appointmentId ? { appointmentId: payload.appointmentId } : {}),
					...(payload.inpatientStayId ? { inpatientStayId: payload.inpatientStayId } : {}),
				});
				if (created.error)
					throw new Error(apiMessage(created.error.value, "تعذّر إنشاء الوصفة"));
				id = created.data.id;
			}

			const { data, error } = await api.prescriptions({ id }).items.post({
				nameSnapshot: payload.nameSnapshot,
				inventoryItemId: payload.inventoryItemId,
				...(payload.catalogProductId ? { catalogProductId: payload.catalogProductId } : {}),
				...(payload.doseAmount ? { doseAmount: payload.doseAmount } : {}),
				...(payload.doseUnit ? { doseUnit: payload.doseUnit } : {}),
				...(payload.route ? { route: payload.route } : {}),
				...(payload.frequency ? { frequency: payload.frequency } : {}),
				...(payload.durationDays ? { durationDays: payload.durationDays } : {}),
				quantity: payload.quantity,
				quantityUnit: payload.quantityUnit,
				instructionsAr: payload.instructionsAr,
				...(payload.overrideReasonAr ? { overrideReasonAr: payload.overrideReasonAr } : {}),
			});
			if (error) throw new Error(apiMessage(error.value, "تعذّر إضافة الدواء"));
			return data;
		},
		onSuccess: invalidate,
	});

	const removeItemMutation = useMutation({
		mutationFn: async (payload: { prescriptionId: string; itemId: string }) => {
			const { error } = await api
				.prescriptions({ id: payload.prescriptionId })
				.items({ itemId: payload.itemId })
				.delete();
			if (error) throw new Error(apiMessage(error.value, "تعذّر حذف البند"));
			return true;
		},
		onSuccess: invalidate,
	});
	const dispenseItem = useMutation({
		mutationFn: async (body: {
			prescriptionItemId: string;
			warehouseId: string;
			quantity: number;
			batchId?: string;
			notesAr?: string;
		}) => {
			const { data, error } = await api.dispense.post(body);
			if (error) throw new Error(apiMessage(error.value, "تعذّر صرف الدواء"));
			return data;
		},
		onSuccess: invalidate,
	});

	return {
		createPrescription: (body: Parameters<typeof createPrescription.mutateAsync>[0]) =>
			toast.promise(createPrescription.mutateAsync(body), {
				loading: "جارٍ إنشاء الوصفة...",
				success: "أُنشئت الوصفة",
				error: (e: Error) => e.message,
			}),
		issuePrescription: (id: string) =>
			toast.promise(issuePrescription.mutateAsync(id), {
				loading: "جارٍ إصدار الوصفة...",
				success: "صدرت الوصفة",
				error: (e: Error) => e.message,
			}),
		addItem: (body: Parameters<typeof addItemMutation.mutateAsync>[0]) =>
			toast.promise(addItemMutation.mutateAsync(body), {
				loading: "جارٍ الإضافة...",
				success: "أُضيف الدواء",
				error: (e: Error) => e.message,
			}),
		removeItem: (body: Parameters<typeof removeItemMutation.mutateAsync>[0]) =>
			toast.promise(removeItemMutation.mutateAsync(body), {
				loading: "جارٍ الحذف...",
				success: "حُذف البند",
				error: (e: Error) => e.message,
			}),
		dispenseItem: (body: Parameters<typeof dispenseItem.mutateAsync>[0]) =>
			toast.promise(dispenseItem.mutateAsync(body), {
				loading: "جارٍ الصرف...",
				success: "تمّ الصرف",
				error: (e: Error) => e.message,
			}),
		isPending:
			createPrescription.isPending ||
			issuePrescription.isPending ||
			dispenseItem.isPending ||
			addItemMutation.isPending ||
			removeItemMutation.isPending,
	};
};
