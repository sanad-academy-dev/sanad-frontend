import type { Prisma } from "@/generated/prisma/client";
import { AppointmentStatus, ArrivalSource, ArrivalStatus, DispositionKind, EmergencyStability, type Gender, type InpatientAcuity, type InpatientStayKind, TriageCategory } from "@/generated/prisma/enums";
import { RED_FAST_WALK_PATH, RED_FAST_WALK_REASON } from "@/server/emergency/emergency.workflow";
import type { BranchScope } from "@/server/rbac/rbac.macro";
export declare const emergencyDao: {
    listArrivals(clinicId: string, scope: BranchScope, filters?: {
        view?: "active" | "all" | "history";
        q?: string;
    }): Promise<{
        owner: {
            name: string;
            id: string;
            phone: string;
        } | null;
        patient: {
            animalType: {
                id: string;
                arName: string;
            };
            name: string;
            id: string;
            code: string;
            birthDate: Date | null;
        } | null;
        appointment: {
            id: string;
            code: string;
            status: AppointmentStatus;
            triageCategory: TriageCategory | null;
            arrivedAt: Date | null;
        } | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        code: string;
        branchId: string;
        status: ArrivalStatus;
        source: ArrivalSource;
        createdBy: {
            name: string;
            id: string;
        } | null;
        arrivedAt: Date | null;
        presentingComplaint: string;
        expectedAt: Date | null;
        provisionalLabel: string | null;
        leftReason: string | null;
        stability: EmergencyStability | null;
        lastReassessedAt: Date | null;
        dispositionKind: DispositionKind | null;
        dispositionAt: Date | null;
        dispositionNotes: string | null;
        transferDestination: string | null;
        dispositionBy: {
            name: string;
            id: string;
        } | null;
    }[]>;
    findArrival(id: string, clinicId: string): Promise<{
        owner: {
            name: string;
            id: string;
            phone: string;
        } | null;
        patient: {
            animalType: {
                id: string;
                arName: string;
            };
            name: string;
            id: string;
            code: string;
            birthDate: Date | null;
        } | null;
        appointment: {
            id: string;
            code: string;
            status: AppointmentStatus;
            triageCategory: TriageCategory | null;
            arrivedAt: Date | null;
        } | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        code: string;
        branchId: string;
        status: ArrivalStatus;
        source: ArrivalSource;
        createdBy: {
            name: string;
            id: string;
        } | null;
        arrivedAt: Date | null;
        presentingComplaint: string;
        expectedAt: Date | null;
        provisionalLabel: string | null;
        leftReason: string | null;
        stability: EmergencyStability | null;
        lastReassessedAt: Date | null;
        dispositionKind: DispositionKind | null;
        dispositionAt: Date | null;
        dispositionNotes: string | null;
        transferDestination: string | null;
        dispositionBy: {
            name: string;
            id: string;
        } | null;
    } | null>;
    createArrival(input: {
        clinicId: string;
        branchId: string;
        source: ArrivalSource;
        patientId?: string | null;
        ownerId?: string | null;
        provisionalLabel?: string | null;
        presentingComplaint: string;
        expectedAt?: Date | null;
        arrivedAt?: Date | null;
        createdById?: string | null;
    }): Promise<{
        owner: {
            name: string;
            id: string;
            phone: string;
        } | null;
        patient: {
            animalType: {
                id: string;
                arName: string;
            };
            name: string;
            id: string;
            code: string;
            birthDate: Date | null;
        } | null;
        appointment: {
            id: string;
            code: string;
            status: AppointmentStatus;
            triageCategory: TriageCategory | null;
            arrivedAt: Date | null;
        } | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        code: string;
        branchId: string;
        status: ArrivalStatus;
        source: ArrivalSource;
        createdBy: {
            name: string;
            id: string;
        } | null;
        arrivedAt: Date | null;
        presentingComplaint: string;
        expectedAt: Date | null;
        provisionalLabel: string | null;
        leftReason: string | null;
        stability: EmergencyStability | null;
        lastReassessedAt: Date | null;
        dispositionKind: DispositionKind | null;
        dispositionAt: Date | null;
        dispositionNotes: string | null;
        transferDestination: string | null;
        dispositionBy: {
            name: string;
            id: string;
        } | null;
    }>;
    transitionArrival(input: {
        id: string;
        clinicId: string;
        to: ArrivalStatus;
        reason?: string | null;
    }): Promise<{
        owner: {
            name: string;
            id: string;
            phone: string;
        } | null;
        patient: {
            animalType: {
                id: string;
                arName: string;
            };
            name: string;
            id: string;
            code: string;
            birthDate: Date | null;
        } | null;
        appointment: {
            id: string;
            code: string;
            status: AppointmentStatus;
            triageCategory: TriageCategory | null;
            arrivedAt: Date | null;
        } | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        code: string;
        branchId: string;
        status: ArrivalStatus;
        source: ArrivalSource;
        createdBy: {
            name: string;
            id: string;
        } | null;
        arrivedAt: Date | null;
        presentingComplaint: string;
        expectedAt: Date | null;
        provisionalLabel: string | null;
        leftReason: string | null;
        stability: EmergencyStability | null;
        lastReassessedAt: Date | null;
        dispositionKind: DispositionKind | null;
        dispositionAt: Date | null;
        dispositionNotes: string | null;
        transferDestination: string | null;
        dispositionBy: {
            name: string;
            id: string;
        } | null;
    }>;
    /**
     * الفرز — **معاملة واحدة** تحوّل الوصول إلى زيارة وتكتب التقييم.
     *
     * ترتيب الخطوات مقصود ومشروح في §3.2 من الخطة. أهمّها أن كل انتقال حالة يمرّ
     * عبر تحديثٍ يكتب صفّ `STATUS_CHANGED` — فالمسار السريع للأحمر **يمشي** آلة
     * الزيارات ولا يلتفّ حولها، ويبقى في السجلّ لماذا قطع هذا الطفل الطابور.
     */
    assess(input: {
        clinicId: string;
        userId: string;
        arrivalId?: string | null;
        appointmentId?: string | null;
        discriminators: string[];
        category?: TriageCategory | null;
        overrideReason?: string | null;
        notes?: string | null;
        patientId?: string | null;
        staffId?: string | null;
        /** [E5] استقرار الحالة — يُشتقّ من اللون عند أوّل فرز إن غاب */
        stability?: EmergencyStability | null;
        /** [E5.1] معرّف قياس أنشأته وحدة العلامات الحيوية — يُربط ولا يُنشأ هنا */
        vitalsRecordId?: string | null;
    }): Promise<{
        assessment: {
            id: string;
            notes: string | null;
            appointmentId: string;
            patientId: string | null;
            category: TriageCategory;
            vitalsRecord: {
                id: string;
                code: string;
                recordedAt: Date;
                temperature: import("@prisma/client-runtime-utils").Decimal | null;
                heartRate: number | null;
                respiratoryRate: number | null;
                oxygenSaturation: number | null;
                painScore: number | null;
                capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
            } | null;
            assessedAt: Date;
            proposedCategory: TriageCategory;
            overrideReason: string | null;
            discriminators: string[];
            attScore: number | null;
            supersedesId: string | null;
            assessedBy: {
                name: string;
                id: string;
            };
        };
        appointmentId: string;
        category: TriageCategory;
        proposed: TriageCategory;
        escalated: boolean;
        previousCategory: TriageCategory | null;
        fastWalk: boolean;
        fastWalked: boolean;
    }>;
    /**
     * تحويل الوصول إلى زيارة — الخطوة التي تسلّم إلى آلة الزيارات.
     *
     * الزيارة تولد `WAITING` وهي حالة ميلاد مشروعة أصلًا (`CREATABLE_STATUSES`)،
     * فلا نخترع حالة ولا نلتفّ على المصفوفة.
     */
    listBoard(clinicId: string, scope: BranchScope, now?: Date): Promise<{
        appointments: {
            stage: "EN_ROUTE" | "DISPOSED" | "UNTRIAGED" | "TRIAGED_WAITING" | "IN_TREATMENT";
            reassessmentOverdue: boolean;
            minutesToReassess: number | null;
            progress: {
                vitals: number;
                exam: "NONE" | "COMPLETED" | "STARTED";
                note: import("@/generated/prisma/enums").ClinicalNoteStatus;
                labs: number;
                radiology: number;
                prescriptions: number;
            };
            staff: {
                name: string;
                id: string;
            };
            owner: {
                name: string;
                id: string;
                phone: string;
            };
            patient: {
                animalType: {
                    arName: string;
                };
                name: string;
                id: string;
                code: string;
                alerts: {
                    id: string;
                    kind: import("@/generated/prisma/enums").PatientAlertKind;
                    severity: import("@/generated/prisma/enums").AlertSeverity;
                    label: string;
                }[];
            };
            clinicalExam: {
                startedAt: Date | null;
                completedAt: Date | null;
            } | null;
            emergencyArrival: {
                id: string;
                status: ArrivalStatus;
                presentingComplaint: string;
                stability: EmergencyStability | null;
                lastReassessedAt: Date | null;
                dispositionKind: DispositionKind | null;
            } | null;
            id: string;
            _count: {
                labTestOrders: number;
                radiologyOrders: number;
                vitalSignsRecords: number;
                prescriptions: number;
            };
            code: string;
            reason: string | null;
            triageAssessments: {
                id: string;
                category: TriageCategory;
                assessedAt: Date;
                discriminators: string[];
                attScore: number | null;
            }[];
            branchId: string;
            status: AppointmentStatus;
            startsAt: Date;
            isEmergency: boolean;
            triageCategory: TriageCategory | null;
            arrivedAt: Date | null;
            soapNotes: {
                status: import("@/generated/prisma/enums").ClinicalNoteStatus;
            }[];
        }[];
        breaches: import("@/server/emergency/triage-breach.service").BreachSummary;
    }>;
    /**
     * إحصائيات شريط اللوحة — **حالة اللحظة لا حالة نطاق زمني**.
     *
     * «كم ينتظر الآن؟» سؤال عن الآن، وحصره في نافذة ماضية يُفرغه من معناه. نفس
     * تمييز تقرير التنويم والتطعيم: الشريط للّحظة، والتقرير للنطاق.
     */
    stats(clinicId: string, scope: BranchScope, now?: Date): Promise<{
        waiting: number;
        untriaged: number;
        critical: number;
        breached: number;
        imminent: number;
        longestWaitMinutes: number;
        inTreatment: number;
        reassessOverdue: number;
        readyForDecision: number;
    }>;
    /**
     * قرار مآل حالة الطوارئ. يُقفل الحلقة ويسلّم إلى الوحدة التالية.
     *
     * ── الترتيب مقصود ولا يُقلب ──────────────────────────────────────────────
     *
     * ١. **التسليم أوّلًا** (طلب التنويم، حالة العملية): كلٌّ منهما يحمل بواباته ويرفض
     *    بأسبابه (إقامة قائمة، جرّاح غير نشط). لا يُكتب شيء على الحلقة قبل أن ينجح،
     *    وإلّا صار عندنا حلقةٌ «صدر قرارها» بلا إقامة ولا حالة — وهو الأسوأ لأنه صامت.
     * ٢. **آلة الزيارات عبر بابها هي** (`appointmentsDao.updateStatus`): بوابة اكتمال
     *    الفحص تُنفَّذ هناك لا هنا، فلا نسخة ثانية منها تفترق عن الأصل. الاستثناء
     *    الوحيد النفوق والقتل الرحيم: يُختَم الفحص بالمآل قبل الطرق (القرار ١).
     * ٣. **الحلقة أخيرًا**، في معاملة واحدة مع صفّ النشاط.
     *
     * ما يبقى مكشوفًا: نجاحُ التسليم ثم فشلُ كتابة الحلقة يترك إقامةً بلا قرار مسجَّل.
     * الوحدات المستقبِلة تفتح معاملاتها هي فلا تُدمَج. مقبول ومذكور، لا مُخفى.
     */
    dispose(input: {
        clinicId: string;
        userId: string;
        appointmentId: string;
        kind: DispositionKind;
        notes?: string | null;
        transferDestination?: string | null;
        admit?: {
            kind?: InpatientStayKind | null;
            acuity?: InpatientAcuity | null;
            attendingStaffId?: string | null;
        } | null;
        surgery?: {
            procedureServiceId: string;
            surgeonStaffId: string;
            estimatedDurationMin?: number | null;
        } | null;
    }): Promise<{
        inpatientStayId?: string;
        operationCaseId?: string;
        episode: {
            owner: {
                name: string;
                id: string;
                phone: string;
            } | null;
            patient: {
                animalType: {
                    id: string;
                    arName: string;
                };
                name: string;
                id: string;
                code: string;
                birthDate: Date | null;
            } | null;
            appointment: {
                id: string;
                code: string;
                status: AppointmentStatus;
                triageCategory: TriageCategory | null;
                arrivedAt: Date | null;
            } | null;
            id: string;
            clinicId: string;
            createdAt: Date;
            code: string;
            branchId: string;
            status: ArrivalStatus;
            source: ArrivalSource;
            createdBy: {
                name: string;
                id: string;
            } | null;
            arrivedAt: Date | null;
            presentingComplaint: string;
            expectedAt: Date | null;
            provisionalLabel: string | null;
            leftReason: string | null;
            stability: EmergencyStability | null;
            lastReassessedAt: Date | null;
            dispositionKind: DispositionKind | null;
            dispositionAt: Date | null;
            dispositionNotes: string | null;
            transferDestination: string | null;
            dispositionBy: {
                name: string;
                id: string;
            } | null;
        };
        appointmentId: string;
        kind: DispositionKind;
    }>;
    /**
     * [E5.4] تسجيل طفل لسجلّ وصولٍ مجهول، وربطه به.
     *
     * الخطوة التي وعد بها القرار D2 ولم تُبنَ، فكان الفرز يردّ «سجّل الطفل قبل الفرز»
     * بلا أن يدلّ على طريق: الشاشة تقبل طفلًا مجهولًا عند الباب ثم تقف.
     *
     * وليّ الأمر اختياري: بلا وليّ أمرٍ يُنسَب الطفل إلى وليّ أمر الشوارد (D2)، لأن الزيارة
     * تحتاج جهةً تُفوتَر عليها ولا تحتاج أن تكون شخصًا حقيقيًّا.
     */
    registerArrivalPatient(input: {
        clinicId: string;
        arrivalId: string;
        name: string;
        gender: Gender;
        animalTypeId: string;
        birthDate: string;
        ownerId?: string | null;
        weight?: number | null;
        notes?: string | null;
    }): Promise<{
        owner: {
            name: string;
            id: string;
            phone: string;
        } | null;
        patient: {
            animalType: {
                id: string;
                arName: string;
            };
            name: string;
            id: string;
            code: string;
            birthDate: Date | null;
        } | null;
        appointment: {
            id: string;
            code: string;
            status: AppointmentStatus;
            triageCategory: TriageCategory | null;
            arrivedAt: Date | null;
        } | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        code: string;
        branchId: string;
        status: ArrivalStatus;
        source: ArrivalSource;
        createdBy: {
            name: string;
            id: string;
        } | null;
        arrivedAt: Date | null;
        presentingComplaint: string;
        expectedAt: Date | null;
        provisionalLabel: string | null;
        leftReason: string | null;
        stability: EmergencyStability | null;
        lastReassessedAt: Date | null;
        dispositionKind: DispositionKind | null;
        dispositionAt: Date | null;
        dispositionNotes: string | null;
        transferDestination: string | null;
        dispositionBy: {
            name: string;
            id: string;
        } | null;
    }>;
    /**
     * [E5.5] بدء العلاج — نقل الحالة المفروزة إلى «جاري الدورة».
     *
     * كانت الفجوة الصامتة في اللوحة: الأحمر يمشي وحده عند الفرز (D5)، أمّا البرتقالي
     * وما دونه فيبقى في «مفروز — بانتظار المدرّب» بلا زرّ، فلا سبيل إلى «قيد العلاج»
     * إلّا مغادرة الشاشة إلى لوحة الجلسات. والقرار نفسه يشترط `IN_SERVICE`، فكان
     * الطريق مسدودًا من الطرفين.
     *
     * يمشي المسار خطوةً خطوة كالمشي السريع: كل انتقال مشروع في `ALLOWED_TRANSITIONS`
     * ويكتب صفّ `STATUS_CHANGED` بسببه.
     */
    startTreatment(input: {
        clinicId: string;
        userId: string;
        appointmentId: string;
    }): Promise<{
        id: string;
        status: AppointmentStatus;
    }>;
    listAssessments(appointmentId: string, clinicId: string): Promise<{
        id: string;
        notes: string | null;
        appointmentId: string;
        patientId: string | null;
        category: TriageCategory;
        vitalsRecord: {
            id: string;
            code: string;
            recordedAt: Date;
            temperature: import("@prisma/client-runtime-utils").Decimal | null;
            heartRate: number | null;
            respiratoryRate: number | null;
            oxygenSaturation: number | null;
            painScore: number | null;
            capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
            mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
        } | null;
        assessedAt: Date;
        proposedCategory: TriageCategory;
        overrideReason: string | null;
        discriminators: string[];
        attScore: number | null;
        supersedesId: string | null;
        assessedBy: {
            name: string;
            id: string;
        };
    }[]>;
    listPatientAlerts(patientId: string, clinicId: string): Promise<{
        id: string;
        createdAt: Date;
        notes: string | null;
        active: boolean;
        patientId: string;
        kind: import("@/generated/prisma/enums").PatientAlertKind;
        recordedBy: {
            name: string;
            id: string;
        } | null;
        severity: import("@/generated/prisma/enums").AlertSeverity;
        label: string;
    }[]>;
    createPatientAlert(input: {
        clinicId: string;
        patientId: string;
        kind: Prisma.PatientAlertCreateInput["kind"];
        label: string;
        severity?: Prisma.PatientAlertCreateInput["severity"];
        notes?: string | null;
        recordedById?: string | null;
    }): Promise<{
        id: string;
        createdAt: Date;
        notes: string | null;
        active: boolean;
        patientId: string;
        kind: import("@/generated/prisma/enums").PatientAlertKind;
        recordedBy: {
            name: string;
            id: string;
        } | null;
        severity: import("@/generated/prisma/enums").AlertSeverity;
        label: string;
    }>;
    /**
     * الإبطال لا الحذف — تنبيه سلامة سُجِّل ثم رُفع يبقى أثره.
     *
     * حساسيةٌ حُذفت بلا أثر تجعل السؤال «هل كانت مسجَّلة يوم صُرف الدواء؟» بلا جواب.
     */
    deactivatePatientAlert(id: string, clinicId: string): Promise<{
        id: string;
        createdAt: Date;
        notes: string | null;
        active: boolean;
        patientId: string;
        kind: import("@/generated/prisma/enums").PatientAlertKind;
        recordedBy: {
            name: string;
            id: string;
        } | null;
        severity: import("@/generated/prisma/enums").AlertSeverity;
        label: string;
    } | null>;
};
export { RED_FAST_WALK_PATH, RED_FAST_WALK_REASON };
