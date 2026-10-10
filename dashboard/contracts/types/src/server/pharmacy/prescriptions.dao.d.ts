import { type CreatePrescriptionInput, type CreatePrescriptionItemInput } from "@/server/pharmacy/prescriptions.type";
export declare const prescriptionsDao: {
    list(clinicId: string, filters?: {
        status?: "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED";
        patientId?: string;
        appointmentId?: string;
        inpatientStayId?: string;
        prescriberId?: string;
        search?: string;
    }): Promise<{
        patient: {
            name: string;
            id: string;
            code: string;
        };
        id: string;
        createdAt: Date;
        _count: {
            items: number;
        };
        code: string;
        status: import("@/generated/prisma/client").PrescriptionStatus;
        issuedAt: Date | null;
        prescriber: {
            name: string;
            id: string;
        } | null;
    }[]>;
    /**
     * عدّادات الشاشة العليا. استعلام تجميع واحد لا أربعة: الشاشة تعرض الأربعة معًا
     * دائمًا، وأربع رحلات لقاعدة البيانات لعرض صفّ واحد إسرافٌ يظهر على كل فتح.
     */
    summary(clinicId: string): Promise<{
        draft: number;
        active: number;
        completed: number;
        cancelled: number;
    }>;
    /**
     * أصناف المخزون الصالحة للوصف — **كلّها**، مربوطةً بالكتالوج أو لا.
     *
     * كان المرشِّح هنا `catalogProductId: { not: null }`، فأخفى **كل** أصناف أكاديمية
     * لم يربط أحدٌ مخزونها بالسجل الرقابي بعد — قائمة فارغة بلا سبب معروض. والربط
     * عمل يدوي لاحق، فاشتراطُه شرطًا للوصف يمنع المدرّب من وصف مضادّ حيوي يملكه.
     *
     * الصنف غير المربوط يبقى موصوفًا بجرعة **يدوية**: لا `genericKey` يعني لا نشرة
     * ولا تركيز ولا مانع استعمال — وهذا ما يقوله `doseSource: MANUAL` صراحةً. أمّا
     * حجبُه فيمنع الوصف ولا يمنع الخطأ.
     *
     * نقطة مستقلّة لا توسيع لقائمة المخزون: تلك تخدم عشرات الشاشات، وإضافة حقول
     * الكتالوج إليها تُثقل كل واحدة منها بما لا تستعمله.
     */
    drugOptions(clinicId: string, search?: string): Promise<{
        name: string;
        id: string;
        stock: number;
        catalogProductId: string | null;
        catalogProduct: {
            tradeName: string;
            genericName: string;
            genericKey: string;
            strength: string | null;
            strengthUnit: string | null;
            dosageForm: string | null;
        } | null;
    }[]>;
    get(clinicId: string, id: string): Promise<{
        patient: {
            name: string;
            id: string;
            code: string;
        };
        id: string;
        createdAt: Date;
        code: string;
        status: import("@/generated/prisma/client").PrescriptionStatus;
        items: {
            id: string;
            idx: number;
            dispenseEvents: {
                quantity: number;
            }[];
            route: string | null;
            frequency: string | null;
            quantity: import("@prisma/client-runtime-utils").Decimal;
            durationDays: number | null;
            inventoryItemId: string | null;
            catalogProductId: string | null;
            nameSnapshot: string;
            doseAmount: import("@prisma/client-runtime-utils").Decimal | null;
            doseUnit: string | null;
            doseSource: import("@/generated/prisma/client").DoseSource;
            overrideReasonAr: string | null;
            prn: boolean;
            instructionsAr: string;
            quantityUnit: string;
            refillsAllowed: number;
            refillsUsed: number;
        }[];
        cancelledAt: Date | null;
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        cancelReasonAr: string | null;
        notesAr: string | null;
        issuedAt: Date | null;
        prescriberId: string | null;
        weightKgSnapshot: import("@prisma/client-runtime-utils").Decimal | null;
        weightRecordedAt: Date | null;
        prescriber: {
            name: string;
            id: string;
        } | null;
    } | null>;
    /**
     * تُنشأ مسوّدة دائمًا (BR-P4.1.1). الرمز `RX-XXXX` يُولَّد هنا لا عند الإصدار:
     * المدرّب يحتاج مرجعًا يذكره قبل أن تصير الوصفة صادرة.
     *
     * لقطة الوزن تُؤخذ الآن — لا عند الإصدار: الجرعات تُحسب أثناء التحرير، فوزنٌ
     * يتغيّر بينهما يجعل الأرقام المكتوبة غير قابلة للمراجعة.
     */
    create(input: CreatePrescriptionInput & {
        prescriberId: string | null;
    }): Promise<{
        patient: {
            name: string;
            id: string;
            code: string;
        };
        id: string;
        createdAt: Date;
        code: string;
        status: import("@/generated/prisma/client").PrescriptionStatus;
        items: {
            id: string;
            idx: number;
            dispenseEvents: {
                quantity: number;
            }[];
            route: string | null;
            frequency: string | null;
            quantity: import("@prisma/client-runtime-utils").Decimal;
            durationDays: number | null;
            inventoryItemId: string | null;
            catalogProductId: string | null;
            nameSnapshot: string;
            doseAmount: import("@prisma/client-runtime-utils").Decimal | null;
            doseUnit: string | null;
            doseSource: import("@/generated/prisma/client").DoseSource;
            overrideReasonAr: string | null;
            prn: boolean;
            instructionsAr: string;
            quantityUnit: string;
            refillsAllowed: number;
            refillsUsed: number;
        }[];
        cancelledAt: Date | null;
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        cancelReasonAr: string | null;
        notesAr: string | null;
        issuedAt: Date | null;
        prescriberId: string | null;
        weightKgSnapshot: import("@prisma/client-runtime-utils").Decimal | null;
        weightRecordedAt: Date | null;
        prescriber: {
            name: string;
            id: string;
        } | null;
    }>;
    addItem(clinicId: string, prescriptionId: string, input: CreatePrescriptionItemInput): Promise<{
        id: string;
        idx: number;
        dispenseEvents: {
            quantity: number;
        }[];
        route: string | null;
        frequency: string | null;
        quantity: import("@prisma/client-runtime-utils").Decimal;
        durationDays: number | null;
        inventoryItemId: string | null;
        catalogProductId: string | null;
        nameSnapshot: string;
        doseAmount: import("@prisma/client-runtime-utils").Decimal | null;
        doseUnit: string | null;
        doseSource: import("@/generated/prisma/client").DoseSource;
        overrideReasonAr: string | null;
        prn: boolean;
        instructionsAr: string;
        quantityUnit: string;
        refillsAllowed: number;
        refillsUsed: number;
    }>;
    updateItem(clinicId: string, prescriptionId: string, itemId: string, input: Partial<CreatePrescriptionItemInput>): Promise<{
        id: string;
        idx: number;
        dispenseEvents: {
            quantity: number;
        }[];
        route: string | null;
        frequency: string | null;
        quantity: import("@prisma/client-runtime-utils").Decimal;
        durationDays: number | null;
        inventoryItemId: string | null;
        catalogProductId: string | null;
        nameSnapshot: string;
        doseAmount: import("@prisma/client-runtime-utils").Decimal | null;
        doseUnit: string | null;
        doseSource: import("@/generated/prisma/client").DoseSource;
        overrideReasonAr: string | null;
        prn: boolean;
        instructionsAr: string;
        quantityUnit: string;
        refillsAllowed: number;
        refillsUsed: number;
    }>;
    removeItem(clinicId: string, prescriptionId: string, itemId: string): Promise<void>;
    /**
     * الإصدار: مسوّدة ← صادرة. وصفة بلا بنود تُرفض — مستندٌ فارغ صادر لا معنى له،
     * ووجوده يُربك طابور الصرف بصفٍّ لا شيء فيه ليُصرف.
     */
    issue(clinicId: string, prescriptionId: string): Promise<{
        patient: {
            name: string;
            id: string;
            code: string;
        };
        id: string;
        createdAt: Date;
        code: string;
        status: import("@/generated/prisma/client").PrescriptionStatus;
        items: {
            id: string;
            idx: number;
            dispenseEvents: {
                quantity: number;
            }[];
            route: string | null;
            frequency: string | null;
            quantity: import("@prisma/client-runtime-utils").Decimal;
            durationDays: number | null;
            inventoryItemId: string | null;
            catalogProductId: string | null;
            nameSnapshot: string;
            doseAmount: import("@prisma/client-runtime-utils").Decimal | null;
            doseUnit: string | null;
            doseSource: import("@/generated/prisma/client").DoseSource;
            overrideReasonAr: string | null;
            prn: boolean;
            instructionsAr: string;
            quantityUnit: string;
            refillsAllowed: number;
            refillsUsed: number;
        }[];
        cancelledAt: Date | null;
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        cancelReasonAr: string | null;
        notesAr: string | null;
        issuedAt: Date | null;
        prescriberId: string | null;
        weightKgSnapshot: import("@prisma/client-runtime-utils").Decimal | null;
        weightRecordedAt: Date | null;
        prescriber: {
            name: string;
            id: string;
        } | null;
    }>;
    /**
     * الإلغاء يُلحِق ولا يحذف (BR-P4.1.2): ما صُرف يبقى مصروفًا، وسجل المواد
     * المراقبة لا يُمسّ. الوصفة الملغاة تختفي من طابور الصرف لا من التاريخ.
     */
    cancel(clinicId: string, prescriptionId: string, reasonAr: string): Promise<{
        patient: {
            name: string;
            id: string;
            code: string;
        };
        id: string;
        createdAt: Date;
        code: string;
        status: import("@/generated/prisma/client").PrescriptionStatus;
        items: {
            id: string;
            idx: number;
            dispenseEvents: {
                quantity: number;
            }[];
            route: string | null;
            frequency: string | null;
            quantity: import("@prisma/client-runtime-utils").Decimal;
            durationDays: number | null;
            inventoryItemId: string | null;
            catalogProductId: string | null;
            nameSnapshot: string;
            doseAmount: import("@prisma/client-runtime-utils").Decimal | null;
            doseUnit: string | null;
            doseSource: import("@/generated/prisma/client").DoseSource;
            overrideReasonAr: string | null;
            prn: boolean;
            instructionsAr: string;
            quantityUnit: string;
            refillsAllowed: number;
            refillsUsed: number;
        }[];
        cancelledAt: Date | null;
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        cancelReasonAr: string | null;
        notesAr: string | null;
        issuedAt: Date | null;
        prescriberId: string | null;
        weightKgSnapshot: import("@prisma/client-runtime-utils").Decimal | null;
        weightRecordedAt: Date | null;
        prescriber: {
            name: string;
            id: string;
        } | null;
    }>;
    /**
     * سياق حساب الجرعة لطفل ومادة — كل ما يحتاجه المحرّك النقيّ في استعلام واحد.
     *
     * ثلاث حقائق منفصلة عمدًا، ولا تُدمج في «وُجد/لم يوجد»: هل نوع الطفل مربوط
     * بمحور الكتالوج، وهل للمادة نشرة أصلًا، وهل لهذا النوع صفّ جرعة. كلٌّ منها
     * ينتج رسالة مختلفة للمدرّب (BRD §5.3).
     */
    doseContext(clinicId: string, patientId: string, genericKey: string, route?: string): Promise<{
        speciesMapped: boolean;
        species: import("@/generated/prisma/client").CatalogSpecies | null;
        monographExistsForDrug: boolean;
        monograph: {
            id: string;
            genericName: string;
            genericNameAr: string | null;
            summaryAr: string | null;
        } | null;
        monographDose: {
            route: string | null;
            frequency: string | null;
            doseUnit: string | null;
            contraindicated: boolean;
            doseMin: import("@prisma/client-runtime-utils").Decimal | null;
            doseMax: import("@prisma/client-runtime-utils").Decimal | null;
            durationNote: string | null;
            warningAr: string | null;
        } | null;
        weightKg: import("@prisma/client-runtime-utils").Decimal | null;
        weightRecordedAt: Date | null;
        catalogProduct: {
            tradeName: string;
            strength: string | null;
            strengthUnit: string | null;
            dosageForm: string | null;
            routeOfAdministration: string | null;
            packageSize: string | null;
            packageUnit: string | null;
            withdrawalPeriod: string | null;
            therapeuticClassCode: string | null;
        } | null;
        duplicateTherapy: import("@/server/pharmacy/safety.rules").DuplicateTherapyWarning | null;
        withdrawal: import("@/server/pharmacy/safety.rules").WithdrawalDisclosure;
    }>;
};
