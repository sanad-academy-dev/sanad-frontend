import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import {
	type ConsentType,
	OperationLaterality,
	type OperationStatus,
	OperationUrgency,
	SedationLevel,
} from "@/generated/prisma/enums";

// ── حالات العمليات الجراحية — الأنواع المشتركة بين الخادم والواجهة ──────────
// الخطة الحاكمة: docs/operations-module-plan.md §4.2، §7

// ترتيب مستويات التخدير تصاعديًا — تخدير الحالة = أعلى مستويات إجراءاتها
export const SEDATION_ORDER = [
	SedationLevel.NONE,
	SedationLevel.ANXIOLYSIS,
	SedationLevel.SEDATION,
	SedationLevel.GENERAL_ANESTHESIA,
] as const;

export const maxSedationLevel = (levels: readonly SedationLevel[]): SedationLevel => {
	let max: SedationLevel = SedationLevel.NONE;
	for (const level of levels) {
		if (SEDATION_ORDER.indexOf(level) > SEDATION_ORDER.indexOf(max)) max = level;
	}
	return max;
};

export const OPERATION_LATERALITY_LABELS: Record<OperationLaterality, string> = {
	[OperationLaterality.NONE]: "لا ينطبق",
	[OperationLaterality.LEFT]: "يسار",
	[OperationLaterality.RIGHT]: "يمين",
	[OperationLaterality.BILATERAL]: "الجهتان",
};

// ── أشكال الاستعلام (select) والأنواع المشتقة ──────────────────────────────

// بطاقة اللوحة — كل ما تعرضه بطاقة العملية في العمود
const caseCardSelect = {
	id: true,
	code: true,
	status: true,
	stage: true,
	tier: true,
	urgency: true,
	plannedAnesthesia: true,
	scheduledAt: true,
	estimatedDurationMin: true,
	createdAt: true,
	patient: { select: { id: true, code: true, name: true, gender: true, age: true } },
	owner: { select: { id: true, name: true, phone: true } },
	room: { select: { id: true, name: true } },
	procedures: {
		select: { id: true, nameSnapshot: true, laterality: true, site: true },
	},
	team: {
		select: { id: true, role: true, staff: { select: { id: true, name: true } } },
	},
	_count: { select: { comments: true } },
} as const;

export type OperationCaseCardResponse = Prisma.OperationCaseGetPayload<{
	select: typeof caseCardSelect;
}>;

export const caseCardSelectShape = caseCardSelect;

// التفاصيل الكاملة — لوحة الحالة: النظرة العامة والتحضير وقوائم التحقق
const caseDetailSelect = {
	...caseCardSelect,
	branchId: true,
	branch: { select: { name: true } },
	// لقطات الأسعار تلزم جدول بنود الفاتورة — تبويب الفاتورة (نمط الأشعة)
	procedures: {
		select: {
			id: true,
			// يلزم لحلّ بروتوكول العمل القياسي للإجراء الأساسي
			serviceId: true,
			nameSnapshot: true,
			laterality: true,
			site: true,
			priceSnapshot: true,
			performed: true,
		},
	},
	appointmentId: true,
	diagnosis: true,
	clinicalSummary: true,
	tierOverrideReason: true,
	cancelKind: true,
	cancelReason: true,
	updatedAt: true,
	consents: {
		select: {
			id: true,
			type: true,
			textSnapshot: true,
			estimateLow: true,
			estimateHigh: true,
			signerName: true,
			signerRelationship: true,
			signatureMethod: true,
			signatureUrl: true,
			witnessStaff: { select: { id: true, name: true } },
			signedAt: true,
			revokedAt: true,
			revokeReason: true,
			createdAt: true,
		},
		orderBy: { createdAt: "asc" },
	},
	assessment: {
		select: {
			id: true,
			asaClass: true,
			asaEmergency: true,
			lastFoodAt: true,
			lastWaterAt: true,
			fastingVerified: true,
			vitalsRecordId: true,
			physicalFindings: true,
			airwayAssessment: true,
			medications: true,
			allergies: true,
			bloodworkReviewed: true,
			imagingReviewed: true,
			riskNotes: true,
			premedPlan: true,
			assessedBy: { select: { id: true, name: true } },
			assessedAt: true,
		},
	},
	checklistRuns: {
		select: {
			id: true,
			scope: true,
			templateId: true,
			templateVersion: true,
			completedAt: true,
			items: {
				select: {
					id: true,
					order: true,
					textSnapshot: true,
					required: true,
					responseType: true,
					response: true,
					valueText: true,
					respondedAt: true,
				},
				orderBy: { order: "asc" },
			},
		},
	},
	anesthesia: {
		select: {
			id: true,
			planned: true,
			actual: true,
			airway: true,
			ettSize: true,
			circuit: true,
			ivAccess: true,
			monitoringIntervalMin: true,
			premedAt: true,
			inductionAt: true,
			incisionAt: true,
			closureAt: true,
			endAnesthesiaAt: true,
			extubationAt: true,
			notes: true,
			anesthetistStaff: { select: { id: true, name: true } },
			events: {
				select: {
					id: true,
					at: true,
					kind: true,
					agentName: true,
					dose: true,
					doseUnit: true,
					route: true,
					detail: true,
					recordedBy: { select: { id: true, name: true } },
				},
				orderBy: { at: "asc" },
			},
		},
	},
	note: {
		select: {
			id: true,
			proceduresPerformed: true,
			findings: true,
			technique: true,
			estimatedBloodLossMl: true,
			complicationsNarrative: true,
			closureDetails: true,
			drainsPlaced: true,
			signedBy: { select: { id: true, name: true } },
			signedAt: true,
		},
	},
	counts: {
		select: {
			id: true,
			type: true,
			initialCount: true,
			finalCount: true,
			reconciled: true,
			discrepancyNote: true,
		},
	},
	implants: {
		select: {
			id: true,
			name: true,
			manufacturer: true,
			lotNumber: true,
			serialNumber: true,
			udi: true,
			site: true,
		},
		orderBy: { createdAt: "asc" },
	},
	specimens: {
		select: {
			id: true,
			label: true,
			description: true,
			containerCount: true,
			sentToLabAt: true,
			labOrderId: true,
		},
		orderBy: { createdAt: "asc" },
	},
	consumables: {
		select: {
			id: true,
			inventoryItemId: true,
			nameSnapshot: true,
			quantity: true,
			priceSnapshot: true,
			type: true,
			countedQuantity: true,
			countNote: true,
			issuedAt: true,
		},
		orderBy: { createdAt: "asc" },
	},
	invoice: {
		select: {
			id: true,
			code: true,
			subtotal: true,
			vatRate: true,
			vatAmount: true,
			discount: true,
			total: true,
			amountPaid: true,
			status: true,
			paymentMethod: true,
			paidAt: true,
		},
	},
	complications: {
		select: {
			id: true,
			phase: true,
			clavienDindoGrade: true,
			isSSI: true,
			kind: true,
			occurredAt: true,
			detail: true,
			reportedBy: { select: { id: true, name: true } },
		},
		orderBy: { occurredAt: "desc" },
	},
	comments: {
		select: {
			id: true,
			body: true,
			createdAt: true,
			author: { select: { id: true, name: true } },
			mentions: { select: { staff: { select: { id: true, name: true } } } },
		},
		orderBy: { createdAt: "asc" },
	},
	ssiSurveillanceUntil: true,
	recoveryAssessments: {
		select: {
			id: true,
			at: true,
			score: true,
			painScale: true,
			painScore: true,
			notes: true,
			assessedBy: { select: { id: true, name: true } },
		},
		orderBy: { at: "desc" },
		take: 30,
	},
	postOpOrders: {
		select: {
			id: true,
			kind: true,
			instructions: true,
			dueAt: true,
			followUpAppointmentId: true,
			createdAt: true,
		},
		orderBy: { createdAt: "asc" },
	},
	// سلسلة القياسات أثناء العملية — لرسم ورقة التخدير
	vitalSignsRecords: {
		select: {
			id: true,
			recordedAt: true,
			temperature: true,
			heartRate: true,
			respiratoryRate: true,
			oxygenSaturation: true,
			bloodPressure: true,
		},
		where: { isDeleted: false },
		orderBy: { recordedAt: "asc" },
		take: 100,
	},
	activity: {
		select: {
			id: true,
			type: true,
			detail: true,
			createdAt: true,
			author: { select: { id: true, name: true } },
		},
		orderBy: { createdAt: "desc" },
		take: 30,
	},
} as const;

export type OperationCaseDetailResponse = Prisma.OperationCaseGetPayload<{
	select: typeof caseDetailSelect;
}>;

export const caseDetailSelectShape = caseDetailSelect;

/** إحصاءات اللوحة — تجميع محسوب، لا يقابله مخطط Prisma واحد */
export type OperationsStatsResponse = {
	total: number;
	byStatus: Partial<Record<OperationStatus, number>>;
	/** الحالات النشطة فورية أو عاجلة */
	urgent: number;
	/** حالات نشطة بلا موعد */
	unscheduled: number;
};

/** مؤشرات العمليات (§9) — تجاميع محسوبة على نافذة زمنية، لا مخطط Prisma واحدًا يقابلها */
export type OperationsMetricsResponse = {
	rangeDays: number;
	totalCases: number;
	completedCases: number;
	cancelledCases: number;
	cancellationByKind: Partial<Record<"OWNER" | "CLINIC" | "CLINICAL", number>>;
	casesByTier: Partial<Record<"MINOR" | "INTERMEDIATE" | "MAJOR", number>>;
	/** نسبة قوائم التحقق المكتملة إلى المتوقعة على الحالات المكتملة (S1) */
	checklistCompletionRatePct: number | null;
	/** تجاوزات بوابات الأمان — قائمة المراجعة (break-glass، S21) */
	gateOverrides: {
		count: number;
		entries: {
			caseCode: string;
			detail: string | null;
			at: Date | string;
			authorName: string | null;
		}[];
	};
	/** حالات تخدير عام مكتملة أُعطي فيها مضاد وقائي قبل الشق (S9) */
	abxProphylaxisRatePct: number | null;
	/** صفوف عدّ بفرق موثَّق (S10) */
	countDiscrepancies: number;
	complications: {
		total: number;
		ssi: number;
		mortality: number;
		byGrade: Partial<Record<string, number>>;
	};
	/** نسبة الحالات المكتملة التي سُجّلت لها مضاعفة */
	complicationRatePct: number | null;
	/** متوسط فرق المدة الفعلية (شق→إغلاق) عن المقدّرة بالدقائق — يغذّي تقديرات أدق */
	avgDurationDeltaMin: number | null;
};

/** تعارض جدولة — يُعاد مع 409 ليعرض المتعارضات بالرمز والوقت */
export type OperationScheduleConflict = {
	kind: "room" | "staff";
	caseCode: string;
	scheduledAt: Date | string;
};

// ── مخطط نموذج الإنشاء (Zod — مصدر الحقيقة لنموذج الواجهة) ─────────────────

export const createOperationSchema = z.object({
	patientId: z.string({ error: "الطفل مطلوب" }).min(1, "الطفل مطلوب"),
	appointmentId: z.string().nullable().optional(),
	procedures: z
		.array(
			z.object({
				serviceId: z.string().min(1),
				laterality: z.enum(OperationLaterality).optional(),
				site: z.string().nullable().optional(),
			}),
		)
		.min(1, "أضف إجراءً واحدًا على الأقل"),
	surgeonStaffId: z.string({ error: "الجرّاح الأساسي مطلوب" }).min(1, "الجرّاح الأساسي مطلوب"),
	anesthetistStaffId: z.string().nullable().optional(),
	urgency: z.enum(OperationUrgency).default(OperationUrgency.ELECTIVE),
	scheduledAt: z.string().nullable().optional(),
	estimatedDurationMin: z.coerce
		.number({ error: "المدة يجب أن تكون رقمًا" })
		.int("المدة عدد صحيح بالدقائق")
		.min(15, "المدة 15 دقيقة على الأقل")
		.default(60),
	roomId: z.string().nullable().optional(),
	diagnosis: z.string().nullable().optional(),
});

export type CreateOperationFormInput = z.input<typeof createOperationSchema>;
export type CreateOperationFormValues = z.output<typeof createOperationSchema>;

// ── مخطط نموذج تقييم ما قبل التخدير (OP2) ──────────────────────────────────

export const assessmentSchema = z.object({
	asaClass: z.coerce
		.number()
		.int()
		.min(1, "درجة ASA بين 1 و5")
		.max(5, "درجة ASA بين 1 و5")
		.nullable()
		.optional(),
	asaEmergency: z.boolean().default(false),
	lastFoodAt: z.string().nullable().optional(),
	lastWaterAt: z.string().nullable().optional(),
	fastingVerified: z.boolean().default(false),
	physicalFindings: z.string().nullable().optional(),
	airwayAssessment: z.string().nullable().optional(),
	medications: z.string().nullable().optional(),
	allergies: z.string().nullable().optional(),
	bloodworkReviewed: z.boolean().default(false),
	imagingReviewed: z.boolean().default(false),
	riskNotes: z.string().nullable().optional(),
	premedPlan: z.string().nullable().optional(),
});

export type AssessmentFormInput = z.input<typeof assessmentSchema>;
export type AssessmentFormValues = z.output<typeof assessmentSchema>;

export const CONSENT_TYPE_LABELS: Record<ConsentType, string> = {
	SURGICAL: "موافقة جراحية",
	ANESTHESIA: "موافقة تخدير",
	// [E3] موافقة العلاج الإسعافي — شفهية/هاتفية بشاهد، تُوثَّق بعد الاستقرار
	EMERGENCY_TREATMENT: "موافقة علاج إسعافي",
	BLOOD_PRODUCTS: "نقل دم ومشتقاته",
	EUTHANASIA: "قتل رحيم",
	FINANCIAL_ESTIMATE: "موافقة مالية",
	// نماذج على مستوى الطفل (src/server/patient-consents) — تُعرض ولا تُنشأ داخل حالة عملية
	HIGH_RISK_SURGICAL: "موافقة جراحية بالغة الخطورة",
	HOSPITALIZATION: "موافقة تنويم",
	DISCHARGE_HEALTHY: "خروج حالة سليمة",
	DISCHARGE_HOME_TREATMENT: "استكمال العلاج بالمنزل",
	DISCHARGE_AGAINST_ADVICE: "إخراج على مسؤولية وليّ الأمر",
	BOARDING: "تسجيل إقامة",
	GROOMING: "إقرار تجميل",
};

/**
 * أنواع الموافقات التي تُنشأ داخل حالة عملية. بقية الأنواع (التنويم،
 * الخروج، الفندقة) نماذج على مستوى الطفل ولا معنى لعرضها في قائمة الجراحة.
 */
export const OPERATION_CONSENT_TYPES = [
	"SURGICAL",
	"ANESTHESIA",
	"BLOOD_PRODUCTS",
	"EUTHANASIA",
	"FINANCIAL_ESTIMATE",
] as const satisfies readonly ConsentType[];

export type OperationConsentType = (typeof OPERATION_CONSENT_TYPES)[number];

export const SIGNATURE_METHOD_LABELS = {
	DRAWN: "توقيع مرسوم",
	TYPED: "اسم مكتوب",
	UPLOADED: "مستند مرفوع",
	VERBAL_WITNESSED: "شفهية بشاهد",
} as const;

// النص الافتراضي لكل نوع موافقة — لقطة قابلة للتحرير قبل التوقيع (S16)
export const DEFAULT_CONSENT_TEXTS: Record<OperationConsentType, string> = {
	SURGICAL:
		"أُقرّ بموافقتي على إجراء العملية الجراحية الموضّحة لحالة الطفل المذكور، وقد شُرحت لي طبيعة الإجراء وفوائده ومخاطره المحتملة والبدائل المتاحة، وأتيحت لي فرصة طرح الأسئلة.",
	ANESTHESIA:
		"أُقرّ بموافقتي على إخضاع الطفل للتخدير أو التهدئة اللازمة للإجراء، وقد شُرحت لي مخاطر التخدير المحتملة وإجراءات المراقبة المتّبعة أثناءه وبعده.",
	BLOOD_PRODUCTS:
		"أُوافق على نقل الدم أو مشتقاته للطفل إذا استدعت الحالة ذلك أثناء الإجراء أو بعده.",
	EUTHANASIA:
		"أُقرّ بموافقتي على القتل الرحيم للطفل المذكور، وقد شُرحت لي الحالة والبدائل المتاحة.",
	FINANCIAL_ESTIMATE:
		"اطّلعت على النطاق التقديري لتكلفة الإجراء وأُوافق على المضيّ وفقه، وأُدرك أن التكلفة النهائية قد تتغيّر ضمن هذا النطاق بحسب مجريات الإجراء.",
};

// ── أنواع مدخلات الـ DAO (مشتقة من Prisma) ─────────────────────────────────

export type CreateOperationCaseInput = Pick<
	Prisma.OperationCaseUncheckedCreateInput,
	"clinicId" | "patientId" | "urgency" | "estimatedDurationMin"
> &
	Partial<
		Pick<
			Prisma.OperationCaseUncheckedCreateInput,
			"appointmentId" | "scheduledAt" | "roomId" | "diagnosis"
		>
	> & {
		procedures: {
			serviceId: string;
			laterality?: OperationLaterality;
			site?: string | null;
		}[];
		surgeonStaffId: string;
		anesthetistStaffId?: string | null;
		userId: string;
	};

// ── حالة سداد الحالة — نفس دلالات الأشعة فتتطابق الشارات عبر الوحدات ────────

export type OperationPaymentStatus = "PAID" | "UNPAID" | "UNBILLED";

export const operationPaymentStatus = (c: {
	invoice: { status: string; paidAt: Date | string | null } | null;
}): OperationPaymentStatus => {
	const invoice = c.invoice;
	if (!invoice || invoice.status === "VOIDED") return "UNBILLED";
	return invoice.status === "PAID" || invoice.paidAt ? "PAID" : "UNPAID";
};

export const OPERATION_PAYMENT_META: Record<
	OperationPaymentStatus,
	{ label: string; className: string }
> = {
	PAID: { label: "مدفوع", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
	UNPAID: { label: "غير مدفوع", className: "border-red-200 bg-red-50 text-red-700" },
	UNBILLED: { label: "غير مفوتر", className: "border-red-200 bg-red-50 text-red-700" },
};
