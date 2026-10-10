import type { Prisma } from "@/generated/prisma/client";
import type { InvoiceStatus, PaymentMethod } from "@/generated/prisma/enums";
import type { PaymentScope } from "@/server/invoices/invoice-sections";
export type { InvoiceStatus, PaymentMethod };
declare const invoiceSelect: {
    id: true;
    code: true;
    clinicId: true;
    appointmentId: true;
    subtotal: true;
    vatRate: true;
    vatAmount: true;
    discount: true;
    total: true;
    amountPaid: true;
    status: true;
    membershipId: true;
    paymentMethod: true;
    paidAt: true;
    refundedAt: true;
    refundReason: true;
    createdAt: true;
    updatedAt: true;
    membershipAdjustments: {
        select: {
            id: true;
            lineRef: true;
            benefitType: true;
            amount: true;
            unitsConsumed: true;
        };
        orderBy: {
            idx: "asc";
        };
    };
};
export declare const invoiceSelectShape: {
    id: true;
    code: true;
    clinicId: true;
    appointmentId: true;
    subtotal: true;
    vatRate: true;
    vatAmount: true;
    discount: true;
    total: true;
    amountPaid: true;
    status: true;
    membershipId: true;
    paymentMethod: true;
    paidAt: true;
    refundedAt: true;
    refundReason: true;
    createdAt: true;
    updatedAt: true;
    membershipAdjustments: {
        select: {
            id: true;
            lineRef: true;
            benefitType: true;
            amount: true;
            unitsConsumed: true;
        };
        orderBy: {
            idx: "asc";
        };
    };
};
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
    insurance?: {
        apply?: boolean;
        excludedLineRefs?: string[];
    };
    /**
     * [LY-P2] §6.1 — النقاط المطلوب استبدالها، **فعلٌ مقصود عند الكاونتر لا تطبيقٌ تلقائي**.
     * غيابها يجعل التسعير مطابقًا بتًّا لما قبل الوحدة (BR-L8.4).
     */
    redeemPoints?: number | null;
};
declare const invoiceListItemSelect: {
    id: true;
    code: true;
    status: true;
    subtotal: true;
    vatRate: true;
    vatAmount: true;
    discount: true;
    total: true;
    amountPaid: true;
    paymentMethod: true;
    paidAt: true;
    refundedAt: true;
    refundReason: true;
    createdAt: true;
    appointment: {
        select: {
            id: true;
            code: true;
            startsAt: true;
            consultationFeeSnapshot: true;
            consultationType: {
                select: {
                    id: true;
                    name: true;
                };
            };
            owner: {
                select: {
                    id: true;
                    name: true;
                };
            };
            patient: {
                select: {
                    id: true;
                    name: true;
                };
            };
            services: {
                select: {
                    id: true;
                    quantity: true;
                    priceSnapshot: true;
                    paidAt: true;
                    service: {
                        select: {
                            name: true;
                            parent: {
                                select: {
                                    parent: {
                                        select: {
                                            name: true;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
    };
    labOrder: {
        select: {
            id: true;
            code: true;
            createdAt: true;
            owner: {
                select: {
                    id: true;
                    name: true;
                };
            };
            patient: {
                select: {
                    id: true;
                    name: true;
                };
            };
            items: {
                select: {
                    id: true;
                    priceSnapshot: true;
                    service: {
                        select: {
                            name: true;
                            parent: {
                                select: {
                                    parent: {
                                        select: {
                                            name: true;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
    };
    radiologyOrder: {
        select: {
            id: true;
            code: true;
            createdAt: true;
            owner: {
                select: {
                    id: true;
                    name: true;
                };
            };
            patient: {
                select: {
                    id: true;
                    name: true;
                };
            };
            items: {
                select: {
                    id: true;
                    priceSnapshot: true;
                    service: {
                        select: {
                            name: true;
                            parent: {
                                select: {
                                    parent: {
                                        select: {
                                            name: true;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
    };
};
export declare const invoiceListItemSelectShape: {
    id: true;
    code: true;
    status: true;
    subtotal: true;
    vatRate: true;
    vatAmount: true;
    discount: true;
    total: true;
    amountPaid: true;
    paymentMethod: true;
    paidAt: true;
    refundedAt: true;
    refundReason: true;
    createdAt: true;
    appointment: {
        select: {
            id: true;
            code: true;
            startsAt: true;
            consultationFeeSnapshot: true;
            consultationType: {
                select: {
                    id: true;
                    name: true;
                };
            };
            owner: {
                select: {
                    id: true;
                    name: true;
                };
            };
            patient: {
                select: {
                    id: true;
                    name: true;
                };
            };
            services: {
                select: {
                    id: true;
                    quantity: true;
                    priceSnapshot: true;
                    paidAt: true;
                    service: {
                        select: {
                            name: true;
                            parent: {
                                select: {
                                    parent: {
                                        select: {
                                            name: true;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
    };
    labOrder: {
        select: {
            id: true;
            code: true;
            createdAt: true;
            owner: {
                select: {
                    id: true;
                    name: true;
                };
            };
            patient: {
                select: {
                    id: true;
                    name: true;
                };
            };
            items: {
                select: {
                    id: true;
                    priceSnapshot: true;
                    service: {
                        select: {
                            name: true;
                            parent: {
                                select: {
                                    parent: {
                                        select: {
                                            name: true;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
    };
    radiologyOrder: {
        select: {
            id: true;
            code: true;
            createdAt: true;
            owner: {
                select: {
                    id: true;
                    name: true;
                };
            };
            patient: {
                select: {
                    id: true;
                    name: true;
                };
            };
            items: {
                select: {
                    id: true;
                    priceSnapshot: true;
                    service: {
                        select: {
                            name: true;
                            parent: {
                                select: {
                                    parent: {
                                        select: {
                                            name: true;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
    };
};
export type InvoiceListItemResponse = Prisma.InvoiceGetPayload<{
    select: typeof invoiceListItemSelect;
}>;
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
/** يُطبّع الفاتورة إلى شكل واحد مهما كان مصدرها */
export declare const invoiceSubject: (invoice: {
    createdAt: Date;
    appointment: InvoiceListItemResponse["appointment"];
    labOrder: InvoiceListItemResponse["labOrder"];
    radiologyOrder?: InvoiceListItemResponse["radiologyOrder"];
}) => InvoiceSubject;
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
