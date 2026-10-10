import type { Prisma } from "@/generated/prisma/client";
import type { InvoiceStatus, PaymentMethod } from "@/generated/prisma/enums";
import type { PaymentScope } from "@/server/invoices/invoice-sections";

export type { InvoiceStatus, PaymentMethod };

const invoiceSelect = {
	id: true,
	code: true,
	clinicId: true,
	appointmentId: true,
	subtotal: true,
	vatRate: true,
	vatAmount: true,
	discount: true,
	total: true,
	amountPaid: true,
	status: true,
	// [MI-P2] العضوية المطبَّقة على الفاتورة — بدون العمود نفسه كانت الاستجابة تحمل
	// صفوف التسوية ولا تحمل هوية العضوية (undefined لا null)
	membershipId: true,
	paymentMethod: true,
	paidAt: true,
	// [P12B.1] أثر الردّ يُعرَض مع الفاتورة: الحالة وحدها لا تقول متى ولا لماذا
	refundedAt: true,
	refundReason: true,
	createdAt: true,
	updatedAt: true,
	// [MI-P2] صفوف تسوية العضوية (BR-M6.7): شاشة الدفع تعرضها لتفسير الفارق بين
	// مجموع البنود والإجمالي بعد مزايا العضوية
	membershipAdjustments: {
		select: {
			id: true,
			lineRef: true,
			benefitType: true,
			amount: true,
			unitsConsumed: true,
		},
		orderBy: { idx: "asc" },
	},
} satisfies Prisma.InvoiceSelect;

export const invoiceSelectShape = invoiceSelect;

export type InvoiceResponse = Prisma.InvoiceGetPayload<{
	select: typeof invoiceSelect;
}>;

export type PayInvoiceInput = {
	paymentMethod: PaymentMethod;
	amountPaid: number;
	/**
	 * قسم الفاتورة المراد سداده. عند تمرير قسم بعينه يحسب الخادم مستحقّه بنفسه
	 * ويتجاهل `amountPaid` — فلا يمكن للعميل أن يسدّد قسمًا بمبلغ لا يخصّه.
	 * غيابه (أو "ALL") يبقي السلوك القديم: دفعة حرّة بالمبلغ المُرسل.
	 */
	scope?: PaymentScope;
	/** [MI-P4] §9.1/BR-I9.1.2 — تأكيد المطالبة بعد معاينة القسمة؛ التخفيض بأسطر مستثناة فقط */
	insurance?: { apply?: boolean; excludedLineRefs?: string[] };
	/**
	 * [LY-P2] §6.1 — النقاط المطلوب استبدالها، **فعلٌ مقصود عند الكاونتر لا تطبيقٌ تلقائي**.
	 * غيابها يجعل التسعير مطابقًا بتًّا لما قبل الوحدة (BR-L8.4).
	 */
	redeemPoints?: number | null;
};

const invoiceListItemSelect = {
	id: true,
	code: true,
	status: true,
	subtotal: true,
	vatRate: true,
	vatAmount: true,
	discount: true,
	total: true,
	amountPaid: true,
	paymentMethod: true,
	paidAt: true,
	refundedAt: true,
	refundReason: true,
	createdAt: true,
	appointment: {
		select: {
			id: true,
			code: true,
			startsAt: true,
			consultationFeeSnapshot: true,
			consultationType: { select: { id: true, name: true } },
			owner: { select: { id: true, name: true } },
			patient: { select: { id: true, name: true } },
			services: {
				select: {
					id: true,
					quantity: true,
					priceSnapshot: true,
					paidAt: true,
					service: {
						select: {
							name: true,
							parent: { select: { parent: { select: { name: true } } } },
						},
					},
				},
			},
		},
	},
	// الفاتورة تتبع زيارةً أو طلب تحاليل أو طلب أشعة — واحد منها موجود دائمًا
	labOrder: {
		select: {
			id: true,
			code: true,
			createdAt: true,
			owner: { select: { id: true, name: true } },
			patient: { select: { id: true, name: true } },
			items: {
				select: {
					id: true,
					priceSnapshot: true,
					service: {
						select: {
							name: true,
							parent: { select: { parent: { select: { name: true } } } },
						},
					},
				},
			},
		},
	},
	radiologyOrder: {
		select: {
			id: true,
			code: true,
			createdAt: true,
			owner: { select: { id: true, name: true } },
			patient: { select: { id: true, name: true } },
			items: {
				select: {
					id: true,
					priceSnapshot: true,
					service: {
						select: {
							name: true,
							parent: { select: { parent: { select: { name: true } } } },
						},
					},
				},
			},
		},
	},
} satisfies Prisma.InvoiceSelect;

export const invoiceListItemSelectShape = invoiceListItemSelect;

export type InvoiceListItemResponse = Prisma.InvoiceGetPayload<{
	select: typeof invoiceListItemSelect;
}>;

// ── عرض موحّد لمصدر الفاتورة (زيارة أو طلب تحاليل) ─────────────────────────
// الجداول والحوارات المالية تقرأ من هنا بدل التفرّع على مصدر كل فاتورة.

export type InvoiceSource = "APPOINTMENT" | "LAB" | "RADIOLOGY";

export type InvoiceLine = {
	id: string;
	name: string;
	category: string | null;
	quantity: number;
	priceSnapshot: string;
	paidAt: Date | null;
};

export type InvoiceSubject = {
	source: InvoiceSource;
	/** رقم الحجز (الزيارة) أو طلب التحاليل — يُعرض في عمود «رقم المعرف/ الحجز» */
	sourceCode: string | null;
	ownerName: string;
	patientName: string;
	date: Date | null;
	lines: InvoiceLine[];
	consultationFee: string | null;
	consultationName: string | null;
};

const UNKNOWN = "—";

/** يُطبّع الفاتورة إلى شكل واحد مهما كان مصدرها */
export const invoiceSubject = (invoice: {
	createdAt: Date;
	appointment: InvoiceListItemResponse["appointment"];
	labOrder: InvoiceListItemResponse["labOrder"];
	radiologyOrder?: InvoiceListItemResponse["radiologyOrder"];
}): InvoiceSubject => {
	const { appointment, labOrder, radiologyOrder } = invoice;

	if (appointment) {
		return {
			source: "APPOINTMENT",
			sourceCode: appointment.code,
			ownerName: appointment.owner.name,
			patientName: appointment.patient.name,
			date: appointment.startsAt,
			lines: appointment.services.map((svc) => ({
				id: svc.id,
				name: svc.service.name,
				category: svc.service.parent?.parent?.name ?? null,
				quantity: svc.quantity,
				priceSnapshot: String(svc.priceSnapshot),
				paidAt: svc.paidAt,
			})),
			consultationFee:
				appointment.consultationFeeSnapshot != null
					? String(appointment.consultationFeeSnapshot)
					: null,
			consultationName: appointment.consultationType?.name ?? null,
		};
	}

	if (labOrder) {
		// بنود فاتورة التحاليل هي تحاليل الطلب — كمية كل تحليل واحد دائمًا،
		// وسدادها جماعي (الفاتورة كلها) فلا paidAt لكل بند
		return {
			source: "LAB",
			sourceCode: labOrder.code,
			ownerName: labOrder.owner.name,
			patientName: labOrder.patient.name,
			date: labOrder.createdAt,
			lines: labOrder.items.map((item) => ({
				id: item.id,
				name: item.service.name,
				category: item.service.parent?.parent?.name ?? null,
				quantity: 1,
				priceSnapshot: String(item.priceSnapshot),
				paidAt: null,
			})),
			consultationFee: null,
			consultationName: null,
		};
	}

	if (radiologyOrder) {
		// بنود فاتورة الأشعة هي فحوصات الطلب — كمية كل فحص واحد دائمًا،
		// وسدادها جماعي (الفاتورة كلها) فلا paidAt لكل بند
		return {
			source: "RADIOLOGY",
			sourceCode: radiologyOrder.code,
			ownerName: radiologyOrder.owner.name,
			patientName: radiologyOrder.patient.name,
			date: radiologyOrder.createdAt,
			lines: radiologyOrder.items.map((item) => ({
				id: item.id,
				name: item.service.name,
				category: item.service.parent?.parent?.name ?? null,
				quantity: 1,
				priceSnapshot: String(item.priceSnapshot),
				paidAt: null,
			})),
			consultationFee: null,
			consultationName: null,
		};
	}

	// فاتورة يتيمة (حُذف مصدرها) — تُعرض بمجاميعها دون بنود بدل أن تُسقط الجدول
	return {
		source: "APPOINTMENT",
		sourceCode: null,
		ownerName: UNKNOWN,
		patientName: UNKNOWN,
		date: invoice.createdAt,
		lines: [],
		consultationFee: null,
		consultationName: null,
	};
};

export type InvoiceStatsResponse = {
	total: number;
	/** إجمالي الإيراد = فواتير الجلسات + مبيعات نقاط البيع */
	revenue: number;
	/** تفصيل المصدر — يجعل الرقم قابلًا للتفسير بدل أن يكون مجموعًا مبهمًا */
	invoiceRevenue: number;
	salesRevenue: number;
	pending: number;
	paid: number;
	overdue: number;
};
