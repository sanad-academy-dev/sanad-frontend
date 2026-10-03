import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OperationCasePlain = t.Object(
  {
    id: t.String(),
    code: t.String(),
    clinicId: t.String(),
    branchId: t.String(),
    patientId: t.String(),
    ownerId: t.String(),
    appointmentId: __nullable__(t.String()),
    status: t.Union(
      [
        t.Literal("SCHEDULED"),
        t.Literal("PREP"),
        t.Literal("ANESTHESIA"),
        t.Literal("SURGERY"),
        t.Literal("RECOVERY"),
        t.Literal("DISCHARGE"),
        t.Literal("FOLLOW_UP"),
        t.Literal("COMPLETED"),
        t.Literal("CANCELLED"),
      ],
      { additionalProperties: false },
    ),
    stage: __nullable__(
      t.Union(
        [
          t.Literal("CONSENT"),
          t.Literal("FASTING_CHECK"),
          t.Literal("ASSESSMENT"),
          t.Literal("PREMED"),
          t.Literal("SIGN_IN"),
          t.Literal("INDUCTION"),
          t.Literal("MAINTENANCE"),
          t.Literal("TIME_OUT"),
          t.Literal("IN_PROGRESS"),
          t.Literal("CLOSING"),
          t.Literal("SIGN_OUT"),
          t.Literal("MONITORING"),
          t.Literal("READY_FOR_DISCHARGE"),
        ],
        { additionalProperties: false },
      ),
    ),
    tier: t.Union(
      [t.Literal("MINOR"), t.Literal("INTERMEDIATE"), t.Literal("MAJOR")],
      { additionalProperties: false },
    ),
    tierOverrideReason: __nullable__(t.String()),
    urgency: t.Union(
      [
        t.Literal("IMMEDIATE"),
        t.Literal("URGENT"),
        t.Literal("EXPEDITED"),
        t.Literal("ELECTIVE"),
      ],
      { additionalProperties: false },
    ),
    plannedAnesthesia: t.Union(
      [
        t.Literal("NONE"),
        t.Literal("ANXIOLYSIS"),
        t.Literal("SEDATION"),
        t.Literal("GENERAL_ANESTHESIA"),
      ],
      { additionalProperties: false },
    ),
    scheduledAt: __nullable__(t.Date()),
    estimatedDurationMin: t.Integer(),
    ssiSurveillanceUntil: __nullable__(t.Date()),
    roomId: __nullable__(t.String()),
    diagnosis: __nullable__(t.String()),
    clinicalSummary: __nullable__(t.String()),
    cancelKind: __nullable__(
      t.Union(
        [t.Literal("OWNER"), t.Literal("CLINIC"), t.Literal("CLINICAL")],
        { additionalProperties: false },
      ),
    ),
    cancelReason: __nullable__(t.String()),
    isDeleted: t.Boolean(),
    deletedAt: __nullable__(t.Date()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const OperationCaseRelations = t.Object(
  {
    clinic: t.Object(
      {
        id: t.String(),
        name: t.String(),
        slug: __nullable__(t.String()),
        plan: t.Union(
          [t.Literal("FREE"), t.Literal("BASIC"), t.Literal("PRO")],
          { additionalProperties: false },
        ),
        trialEndsAt: __nullable__(t.Date()),
        onboardingCompleted: t.Boolean(),
        rbacVersion: t.Integer({
          description: `[RBAC P4] يُرفَع عند أيّ كتابة على دور أو منحة أو إسناد. الجلسة تحمل النسخة التي
بُنيت منها لقطتُها، فتُعيد بناءها ذاتيًا عند الاختلاف بدل حذف الجلسات وإخراج المستخدم.`,
        }),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    branch: t.Object(
      {
        id: t.String(),
        branchCode: t.String(),
        clinicId: t.String(),
        name: t.String(),
        icon: __nullable__(t.String()),
        type: t.Union([t.Literal("PRIMARY"), t.Literal("SUB")], {
          additionalProperties: false,
        }),
        managerId: __nullable__(t.String()),
        email: __nullable__(t.String()),
        city: __nullable__(t.String()),
        phone: __nullable__(t.String()),
        address: __nullable__(t.String()),
        active: t.Boolean(),
        emergencyNotifications: t.Boolean(),
        settings: __nullable__(t.Any()),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    patient: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        ownerId: __nullable__(t.String()),
        name: t.String(),
        nameNormalized: t.String(),
        gender: t.Union(
          [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
          { additionalProperties: false },
        ),
        animalTypeId: t.String(),
        animalStrainId: __nullable__(t.String()),
        age: __nullable__(t.Number()),
        birthDate: __nullable__(t.Date()),
        weight: __nullable__(t.Number()),
        microchipNumber: __nullable__(t.String()),
        coat: __nullable__(t.String()),
        notes: __nullable__(t.String()),
        active: t.Boolean(),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        editsCount: t.Integer(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    owner: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        name: t.String(),
        phone: t.String(),
        phoneE164: __nullable__(t.String()),
        email: __nullable__(t.String()),
        gender: __nullable__(
          t.Union(
            [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
            { additionalProperties: false },
          ),
        ),
        ownerType: t.Union(
          [
            t.Literal("ALL"),
            t.Literal("VIP"),
            t.Literal("LOYALTY"),
            t.Literal("NEW"),
            t.Literal("CURRENT"),
          ],
          { additionalProperties: false },
        ),
        relationship: __nullable__(
          t.Union(
            [
              t.Literal("OWNER"),
              t.Literal("GUARDIAN"),
              t.Literal("DELEGATE"),
              t.Literal("EMERGENCY"),
            ],
            { additionalProperties: false },
          ),
        ),
        country: __nullable__(t.String()),
        city: __nullable__(t.String()),
        address: __nullable__(t.String()),
        notes: __nullable__(t.String()),
        active: t.Boolean(),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        editsCount: t.Integer(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    appointment: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          branchId: t.String(),
          ownerId: t.String(),
          patientId: t.String(),
          staffId: t.String(),
          roomId: __nullable__(t.String()),
          startsAt: t.Date(),
          durationMinutes: t.Integer(),
          location: t.Union(
            [
              t.Literal("IN_CLINIC"),
              t.Literal("REMOTE"),
              t.Literal("HOME_VISIT"),
              t.Literal("MOBILE_CLINIC"),
            ],
            { additionalProperties: false },
          ),
          status: t.Union(
            [
              t.Literal("SCHEDULED"),
              t.Literal("WAITING"),
              t.Literal("CHECK_IN"),
              t.Literal("IN_SERVICE"),
              t.Literal("HOSPITALIZED"),
              t.Literal("AWAITING_PAYMENT"),
              t.Literal("DONE"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          queueStatus: __nullable__(
            t.Union(
              [
                t.Literal("ON_HOLD"),
                t.Literal("NO_SHOW"),
                t.Literal("CONFIRMED"),
              ],
              { additionalProperties: false },
            ),
          ),
          priority: __nullable__(
            t.Union(
              [
                t.Literal("LOW"),
                t.Literal("MEDIUM"),
                t.Literal("HIGH"),
                t.Literal("URGENT"),
              ],
              { additionalProperties: false },
            ),
          ),
          isEmergency: t.Boolean({
            description: `[E0] يبقى كما هو، ويصبح **إسقاطًا** لا مدخلًا حين تُفعَّل طبقة الطوارئ على الفرع:
\`isEmergency = triageCategory ∈ {RED, ORANGE}\` تُكتب في نفس معاملة التقييم. نفس
سابقة \`isUrgent ⇔ priority === URGENT\` في التحاليل والأشعة. مع الطبقة مُطفأة يبقى
مفتاحًا يدويًّا كما كان، فكل مستهلك قائم (ترتيب الطابور، الشارة، صفّ الإنذار،
الوكيل، معالج الحجز) يعمل بلا تعديل سطر واحد.`,
          }),
          triageCategory: __nullable__(
            t.Union(
              [
                t.Literal("RED"),
                t.Literal("ORANGE"),
                t.Literal("YELLOW"),
                t.Literal("GREEN"),
                t.Literal("BLUE"),
              ],
              {
                additionalProperties: false,
                description: `فئات قائمة الفرز البيطرية (VTL — Ruys et al. 2012) المشتقّة من مقياس مانشستر.
الأهداف الزمنية لكل فئة في \`emergency.rules.ts\` لا هنا: العتبة التي تقرّر من
يُرى أوّلًا تُراجَع في طلب دمج ويوقّعها إنسان، ولا تُحرَّر من شاشة إعدادات.`,
              },
            ),
          ),
          arrivedAt: __nullable__(
            t.Date({
              description: `[E0] وقت الوصول الفعلي — لا وقت الموعد. \`startsAt\` هو ما كان مجدولًا، وهذا ما
حدث. كل هدف انتظار وكل مقياس «من الباب إلى الطبيب» يُقاس من هنا، ولا يُشتقّ من
\`startsAt\` لأن مريض الطوارئ يصل قبل موعده أو بلا موعد أصلًا.`,
            }),
          ),
          reason: __nullable__(t.String()),
          symptoms: __nullable__(t.String()),
          clinicalNotes: __nullable__(t.String()),
          consultationTypeId: __nullable__(t.String()),
          serviceAddressId: __nullable__(t.String()),
          consultationFeeSnapshot: __nullable__(t.Number()),
          consultationPaidAt: __nullable__(t.Date()),
          whatsappReminderEnabled: t.Boolean(),
          images: t.Array(t.String(), { additionalProperties: false }),
          recurringGroupId: __nullable__(t.String()),
          recurringIndex: __nullable__(t.Integer()),
          recurringTotal: __nullable__(t.Integer()),
          repeatUnit: __nullable__(
            t.Union(
              [
                t.Literal("DAY"),
                t.Literal("WEEK"),
                t.Literal("TWO_WEEKS"),
                t.Literal("MONTH"),
                t.Literal("YEAR"),
              ],
              { additionalProperties: false },
            ),
          ),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    room: __nullable__(
      t.Object(
        {
          id: t.String(),
          branchId: t.String(),
          clinicId: t.String(),
          name: t.String(),
          type: t.Union(
            [
              t.Literal("EXAMINATION"),
              t.Literal("LABORATORY"),
              t.Literal("WAITING"),
              t.Literal("OPERATING"),
              t.Literal("VACCINATION"),
              t.Literal("ICU"),
              t.Literal("GROOMING"),
              t.Literal("WARD"),
              t.Literal("ISOLATION"),
            ],
            { additionalProperties: false },
          ),
          capacity: t.Integer(),
          managerId: __nullable__(t.String()),
          availableDevices: t.Array(t.String(), {
            additionalProperties: false,
          }),
          abilities: t.Array(t.String(), { additionalProperties: false }),
          notes: __nullable__(t.String()),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    procedures: t.Array(
      t.Object(
        {
          id: t.String(),
          caseId: t.String(),
          serviceId: t.String(),
          nameSnapshot: t.String(),
          priceSnapshot: t.Number(),
          tierSnapshot: t.Union(
            [t.Literal("MINOR"), t.Literal("INTERMEDIATE"), t.Literal("MAJOR")],
            { additionalProperties: false },
          ),
          anesthesiaSnapshot: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("ANXIOLYSIS"),
              t.Literal("SEDATION"),
              t.Literal("GENERAL_ANESTHESIA"),
            ],
            { additionalProperties: false },
          ),
          laterality: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("LEFT"),
              t.Literal("RIGHT"),
              t.Literal("BILATERAL"),
            ],
            { additionalProperties: false },
          ),
          site: __nullable__(t.String()),
          woundClass: __nullable__(
            t.Union(
              [
                t.Literal("CLEAN"),
                t.Literal("CLEAN_CONTAMINATED"),
                t.Literal("CONTAMINATED"),
                t.Literal("DIRTY"),
              ],
              { additionalProperties: false },
            ),
          ),
          performed: t.Boolean(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    team: t.Array(
      t.Object(
        {
          id: t.String(),
          caseId: t.String(),
          staffId: t.String(),
          role: t.Union(
            [
              t.Literal("PRIMARY_SURGEON"),
              t.Literal("ASSISTANT_SURGEON"),
              t.Literal("ANESTHETIST"),
              t.Literal("ANESTHESIA_TECH"),
              t.Literal("SCRUB_NURSE"),
              t.Literal("CIRCULATOR"),
              t.Literal("OBSERVER"),
            ],
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    activity: t.Array(
      t.Object(
        {
          id: t.String(),
          caseId: t.String(),
          type: t.Union(
            [
              t.Literal("CREATED"),
              t.Literal("STATUS_CHANGED"),
              t.Literal("STAGE_CHANGED"),
              t.Literal("SCHEDULE_CHANGED"),
              t.Literal("TEAM_CHANGED"),
              t.Literal("URGENCY_CHANGED"),
              t.Literal("GATE_OVERRIDDEN"),
              t.Literal("CANCELLED"),
              t.Literal("NOTE"),
              t.Literal("CONSENT_SIGNED"),
              t.Literal("CONSENT_REVOKED"),
              t.Literal("ASSESSMENT_UPDATED"),
              t.Literal("CHECKLIST_COMPLETED"),
              t.Literal("NOTE_SIGNED"),
            ],
            { additionalProperties: false },
          ),
          detail: __nullable__(t.String()),
          authorUserId: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    consents: t.Array(
      t.Object(
        {
          id: t.String(),
          caseId: t.String(),
          type: t.Union(
            [
              t.Literal("SURGICAL"),
              t.Literal("ANESTHESIA"),
              t.Literal("BLOOD_PRODUCTS"),
              t.Literal("EUTHANASIA"),
              t.Literal("FINANCIAL_ESTIMATE"),
              t.Literal("HIGH_RISK_SURGICAL"),
              t.Literal("HOSPITALIZATION"),
              t.Literal("DISCHARGE_HEALTHY"),
              t.Literal("DISCHARGE_HOME_TREATMENT"),
              t.Literal("DISCHARGE_AGAINST_ADVICE"),
              t.Literal("BOARDING"),
              t.Literal("GROOMING"),
              t.Literal("EMERGENCY_TREATMENT"),
            ],
            { additionalProperties: false },
          ),
          textSnapshot: t.String(),
          estimateLow: __nullable__(t.Number()),
          estimateHigh: __nullable__(t.Number()),
          signerName: __nullable__(t.String()),
          signerRelationship: __nullable__(t.String()),
          signatureMethod: __nullable__(
            t.Union(
              [
                t.Literal("DRAWN"),
                t.Literal("TYPED"),
                t.Literal("UPLOADED"),
                t.Literal("VERBAL_WITNESSED"),
              ],
              { additionalProperties: false },
            ),
          ),
          signatureUrl: __nullable__(t.String()),
          witnessStaffId: __nullable__(t.String()),
          signedAt: __nullable__(t.Date()),
          revokedAt: __nullable__(t.Date()),
          revokeReason: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    assessment: __nullable__(
      t.Object(
        {
          id: t.String(),
          caseId: t.String(),
          asaClass: __nullable__(t.Integer()),
          asaEmergency: t.Boolean(),
          lastFoodAt: __nullable__(t.Date()),
          lastWaterAt: __nullable__(t.Date()),
          fastingVerified: t.Boolean(),
          vitalsRecordId: __nullable__(t.String()),
          physicalFindings: __nullable__(t.String()),
          airwayAssessment: __nullable__(t.String()),
          medications: __nullable__(t.String()),
          allergies: __nullable__(t.String()),
          bloodworkReviewed: t.Boolean(),
          imagingReviewed: t.Boolean(),
          labOrderId: __nullable__(t.String()),
          radiologyOrderId: __nullable__(t.String()),
          riskNotes: __nullable__(t.String()),
          premedPlan: __nullable__(t.String()),
          assessedById: __nullable__(t.String()),
          assessedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    checklistRuns: t.Array(
      t.Object(
        {
          id: t.String(),
          caseId: t.String(),
          scope: t.Union(
            [
              t.Literal("OPERATION_SIGN_IN"),
              t.Literal("OPERATION_TIME_OUT"),
              t.Literal("OPERATION_SIGN_OUT"),
              t.Literal("OPERATION_MINOR_COMBINED"),
            ],
            { additionalProperties: false },
          ),
          templateId: t.String(),
          templateVersion: t.Integer(),
          startedById: __nullable__(t.String()),
          completedAt: __nullable__(t.Date()),
          completedById: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    anesthesia: __nullable__(
      t.Object(
        {
          id: t.String(),
          caseId: t.String(),
          planned: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("ANXIOLYSIS"),
              t.Literal("SEDATION"),
              t.Literal("GENERAL_ANESTHESIA"),
            ],
            { additionalProperties: false },
          ),
          actual: __nullable__(
            t.Union(
              [
                t.Literal("NONE"),
                t.Literal("ANXIOLYSIS"),
                t.Literal("SEDATION"),
                t.Literal("GENERAL_ANESTHESIA"),
              ],
              { additionalProperties: false },
            ),
          ),
          airway: __nullable__(t.String()),
          ettSize: __nullable__(t.String()),
          circuit: __nullable__(t.String()),
          ivAccess: __nullable__(t.String()),
          monitoringIntervalMin: t.Integer(),
          premedAt: __nullable__(t.Date()),
          inductionAt: __nullable__(t.Date()),
          incisionAt: __nullable__(t.Date()),
          closureAt: __nullable__(t.Date()),
          endAnesthesiaAt: __nullable__(t.Date()),
          extubationAt: __nullable__(t.Date()),
          anesthetistStaffId: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    note: __nullable__(
      t.Object(
        {
          id: t.String(),
          caseId: t.String(),
          proceduresPerformed: __nullable__(t.String()),
          findings: __nullable__(t.String()),
          technique: __nullable__(t.String()),
          estimatedBloodLossMl: __nullable__(t.Integer()),
          complicationsNarrative: __nullable__(t.String()),
          closureDetails: __nullable__(t.String()),
          drainsPlaced: __nullable__(t.String()),
          signedById: __nullable__(t.String()),
          signedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    counts: t.Array(
      t.Object(
        {
          id: t.String(),
          caseId: t.String(),
          type: t.Union(
            [t.Literal("SPONGE"), t.Literal("NEEDLE"), t.Literal("INSTRUMENT")],
            { additionalProperties: false },
          ),
          initialCount: __nullable__(t.Integer()),
          finalCount: __nullable__(t.Integer()),
          reconciled: t.Boolean(),
          discrepancyNote: __nullable__(t.String()),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    implants: t.Array(
      t.Object(
        {
          id: t.String(),
          caseId: t.String(),
          name: t.String(),
          manufacturer: __nullable__(t.String()),
          lotNumber: __nullable__(t.String()),
          serialNumber: __nullable__(t.String()),
          udi: __nullable__(t.String()),
          site: __nullable__(t.String()),
          inventoryItemId: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    specimens: t.Array(
      t.Object(
        {
          id: t.String(),
          caseId: t.String(),
          label: t.String(),
          description: __nullable__(t.String()),
          containerCount: t.Integer(),
          sentToLabAt: __nullable__(t.Date()),
          labOrderId: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    vitalSignsRecords: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          branchId: __nullable__(t.String()),
          patientId: t.String(),
          recordedAt: t.Date(),
          source: t.Union(
            [
              t.Literal("MANUAL"),
              t.Literal("VISIT"),
              t.Literal("LAB"),
              t.Literal("RADIOLOGY"),
              t.Literal("OPERATION"),
              t.Literal("GROOMING"),
              t.Literal("INPATIENT"),
              t.Literal("TRIAGE"),
            ],
            { additionalProperties: false },
          ),
          recordedById: __nullable__(t.String()),
          appointmentId: __nullable__(t.String()),
          labOrderId: __nullable__(t.String()),
          radiologyOrderId: __nullable__(t.String()),
          operationId: __nullable__(t.String()),
          inpatientStayId: __nullable__(t.String()),
          weight: __nullable__(t.Number()),
          temperature: __nullable__(t.Number()),
          heartRate: __nullable__(t.Integer()),
          respiratoryRate: __nullable__(t.Integer()),
          oxygenSaturation: __nullable__(t.Integer()),
          bloodPressure: __nullable__(t.String()),
          painScore: __nullable__(t.Integer()),
          bodyConditionScore: __nullable__(t.Integer()),
          capillaryRefillSec: __nullable__(t.Number()),
          mucousMembrane: __nullable__(
            t.Union(
              [
                t.Literal("PINK"),
                t.Literal("PALE"),
                t.Literal("CYANOTIC"),
                t.Literal("ICTERIC"),
                t.Literal("CONGESTED"),
                t.Literal("MUDDY"),
              ],
              { additionalProperties: false },
            ),
          ),
          notes: __nullable__(t.String()),
          correctsId: __nullable__(t.String()),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    recoveryAssessments: t.Array(
      t.Object(
        {
          id: t.String(),
          caseId: t.String(),
          at: t.Date(),
          score: __nullable__(t.Integer()),
          painScale: __nullable__(
            t.Union(
              [
                t.Literal("GLASGOW_CMPS"),
                t.Literal("NRS"),
                t.Literal("VAS"),
                t.Literal("FLACC"),
                t.Literal("OTHER"),
              ],
              { additionalProperties: false },
            ),
          ),
          painScore: __nullable__(t.Integer()),
          notes: __nullable__(t.String()),
          assessedById: t.String(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    postOpOrders: t.Array(
      t.Object(
        {
          id: t.String(),
          caseId: t.String(),
          kind: t.Union(
            [
              t.Literal("MEDICATION"),
              t.Literal("MONITORING"),
              t.Literal("FEEDING"),
              t.Literal("ACTIVITY"),
              t.Literal("WOUND_CARE"),
              t.Literal("FOLLOW_UP"),
              t.Literal("SUTURE_REMOVAL"),
            ],
            { additionalProperties: false },
          ),
          inventoryItemId: __nullable__(t.String()),
          instructions: t.String(),
          dueAt: __nullable__(t.Date()),
          followUpAppointmentId: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    consumables: t.Array(
      t.Object(
        {
          id: t.String(),
          caseId: t.String(),
          inventoryItemId: __nullable__(t.String()),
          nameSnapshot: t.String(),
          quantity: t.Integer(),
          priceSnapshot: t.Number(),
          type: t.Union(
            [t.Literal("KIT"), t.Literal("BURNED"), t.Literal("ADDITIONAL")],
            { additionalProperties: false },
          ),
          countedQuantity: __nullable__(t.Integer()),
          countNote: __nullable__(t.String()),
          issuedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    invoice: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          appointmentId: __nullable__(t.String()),
          labOrderId: __nullable__(t.String()),
          radiologyOrderId: __nullable__(t.String()),
          operationId: __nullable__(t.String()),
          groomingSessionId: __nullable__(t.String()),
          inpatientStayId: __nullable__(t.String()),
          subtotal: t.Number(),
          vatRate: t.Number(),
          vatAmount: t.Number(),
          taxTemplateId: __nullable__(t.String()),
          discount: t.Number(),
          total: t.Number(),
          amountPaid: t.Number(),
          currencyCode: t.String(),
          membershipId: __nullable__(t.String()),
          insurerShare: __nullable__(t.Number()),
          copayShare: __nullable__(t.Number()),
          status: t.Union(
            [
              t.Literal("PENDING"),
              t.Literal("PARTIAL"),
              t.Literal("PAID"),
              t.Literal("VOIDED"),
              t.Literal("REFUNDED"),
            ],
            { additionalProperties: false },
          ),
          paymentMethod: __nullable__(
            t.Union(
              [t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")],
              { additionalProperties: false },
            ),
          ),
          paidAt: __nullable__(t.Date()),
          refundedAt: __nullable__(t.Date()),
          refundReason: __nullable__(t.String()),
          refundedById: __nullable__(t.String()),
          stripePaymentIntentId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    inboxItems: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          kind: t.Union([t.Literal("NOTIFICATION"), t.Literal("APPROVAL")], {
            additionalProperties: false,
          }),
          type: t.Union(
            [
              t.Literal("MEMBERSHIP"),
              t.Literal("INSURANCE"),
              t.Literal("LEAD"),
              t.Literal("DEAL"),
              t.Literal("APPOINTMENT_CANCELLED"),
              t.Literal("APPOINTMENT_NEW"),
              t.Literal("APPOINTMENT_PENDING"),
              t.Literal("APPOINTMENT_CONFIRMED"),
              t.Literal("INVOICE"),
              t.Literal("TASK"),
              t.Literal("SYSTEM"),
              t.Literal("LAB"),
              t.Literal("RADIOLOGY"),
              t.Literal("CARE"),
              t.Literal("STOCK"),
              t.Literal("MENTION"),
              t.Literal("OPERATION"),
              t.Literal("VACCINATION"),
              t.Literal("GROOMING"),
              t.Literal("INPATIENT"),
              t.Literal("TRIAGE"),
            ],
            { additionalProperties: false },
          ),
          title: t.String(),
          importance: t.Union(
            [t.Literal("LOW"), t.Literal("NORMAL"), t.Literal("HIGH")],
            { additionalProperties: false },
          ),
          status: t.Union(
            [t.Literal("DRAFT"), t.Literal("OPEN"), t.Literal("RESOLVED")],
            { additionalProperties: false },
          ),
          approvalStatus: __nullable__(
            t.Union(
              [
                t.Literal("PENDING"),
                t.Literal("ACCEPTED"),
                t.Literal("REJECTED"),
              ],
              { additionalProperties: false },
            ),
          ),
          patientId: __nullable__(t.String()),
          ownerId: __nullable__(t.String()),
          staffId: __nullable__(t.String()),
          appointmentId: __nullable__(t.String()),
          taskId: __nullable__(t.String()),
          conversationId: __nullable__(t.String()),
          operationId: __nullable__(t.String()),
          groomingSessionId: __nullable__(t.String()),
          leadId: __nullable__(t.String()),
          dealId: __nullable__(t.String()),
          inpatientStayId: __nullable__(t.String()),
          recipientUserId: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    complications: t.Array(
      t.Object(
        {
          id: t.String(),
          caseId: t.String(),
          phase: t.Union(
            [
              t.Literal("INTRA_OP"),
              t.Literal("RECOVERY"),
              t.Literal("POST_OP"),
            ],
            { additionalProperties: false },
          ),
          clavienDindoGrade: __nullable__(
            t.Union(
              [
                t.Literal("GRADE_I"),
                t.Literal("GRADE_II"),
                t.Literal("GRADE_IIIA"),
                t.Literal("GRADE_IIIB"),
                t.Literal("GRADE_IVA"),
                t.Literal("GRADE_IVB"),
                t.Literal("GRADE_V"),
              ],
              { additionalProperties: false },
            ),
          ),
          isSSI: t.Boolean(),
          kind: t.String(),
          occurredAt: t.Date(),
          detail: __nullable__(t.String()),
          reportedById: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    comments: t.Array(
      t.Object(
        {
          id: t.String(),
          caseId: t.String(),
          authorUserId: t.String(),
          body: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    sopRun: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          templateId: t.String(),
          templateVersion: t.Integer(),
          domain: t.Union(
            [t.Literal("LAB"), t.Literal("RADIOLOGY"), t.Literal("OPERATION")],
            { additionalProperties: false },
          ),
          labItemId: __nullable__(t.String()),
          radiologyItemId: __nullable__(t.String()),
          operationCaseId: __nullable__(t.String()),
          startedById: __nullable__(t.String()),
          completedAt: __nullable__(t.Date()),
          completedById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    patientConsents: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          patientId: t.String(),
          ownerId: t.String(),
          templateId: __nullable__(t.String()),
          templateKey: t.String(),
          templateVersion: t.Integer(),
          type: t.Union(
            [
              t.Literal("SURGICAL"),
              t.Literal("ANESTHESIA"),
              t.Literal("BLOOD_PRODUCTS"),
              t.Literal("EUTHANASIA"),
              t.Literal("FINANCIAL_ESTIMATE"),
              t.Literal("HIGH_RISK_SURGICAL"),
              t.Literal("HOSPITALIZATION"),
              t.Literal("DISCHARGE_HEALTHY"),
              t.Literal("DISCHARGE_HOME_TREATMENT"),
              t.Literal("DISCHARGE_AGAINST_ADVICE"),
              t.Literal("BOARDING"),
              t.Literal("GROOMING"),
              t.Literal("EMERGENCY_TREATMENT"),
            ],
            { additionalProperties: false },
          ),
          locale: t.Union(
            [t.Literal("AR"), t.Literal("EN"), t.Literal("BOTH")],
            { additionalProperties: false },
          ),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("AWAITING_SIGNATURE"),
              t.Literal("SIGNED"),
              t.Literal("REVOKED"),
            ],
            { additionalProperties: false },
          ),
          operationCaseId: __nullable__(t.String()),
          appointmentId: __nullable__(t.String()),
          inpatientStayId: __nullable__(t.String()),
          fieldValues: t.Any(),
          textSnapshot: t.String(),
          signerName: __nullable__(t.String()),
          signerRelationship: __nullable__(t.String()),
          signatureMethod: __nullable__(
            t.Union(
              [
                t.Literal("DRAWN"),
                t.Literal("TYPED"),
                t.Literal("UPLOADED"),
                t.Literal("VERBAL_WITNESSED"),
              ],
              { additionalProperties: false },
            ),
          ),
          signatureUrl: __nullable__(t.String()),
          witnessStaffId: __nullable__(t.String()),
          signedByStaffId: __nullable__(t.String()),
          signedAt: __nullable__(t.Date()),
          revokedAt: __nullable__(t.Date()),
          revokeReason: __nullable__(t.String()),
          sourceScanUrl: __nullable__(t.String()),
          extractedByAi: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    inpatientStays: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String({ description: `IP-XXXX` }),
          clinicId: t.String(),
          branchId: t.String({
            description: `إلزامي: الحيوان المنوَّم موجود فيزيائيًا في فرع واحد`,
          }),
          patientId: t.String(),
          ownerId: t.String(),
          kind: t.Union(
            [
              t.Literal("MEDICAL"),
              t.Literal("SURGICAL"),
              t.Literal("ICU"),
              t.Literal("ISOLATION"),
              t.Literal("BOARDING"),
            ],
            {
              additionalProperties: false,
              description: `نوع الإقامة — يقرّر البوابات الإلزامية وقواعد الإسكان لا شكل السجل.`,
            },
          ),
          status: t.Union(
            [
              t.Literal("REQUESTED"),
              t.Literal("ADMITTED"),
              t.Literal("IN_CARE"),
              t.Literal("DISCHARGE_PENDING"),
              t.Literal("DISCHARGED"),
              t.Literal("CANCELLED"),
            ],
            {
              additionalProperties: false,
              description: `حالات الإقامة. المسار خطّي قصير عمدًا: الإقامة ليست سير عمل بمراحل، بل مدّة
زمنية لها بداية ونهاية وما بينهما رعاية متكرّرة.`,
            },
          ),
          acuity: t.Union(
            [
              t.Literal("LOW"),
              t.Literal("MEDIUM"),
              t.Literal("HIGH"),
              t.Literal("CRITICAL"),
            ],
            {
              additionalProperties: false,
              description: `درجة الحرجية — يدوية في الإصدار الأول (القرار D7). حسابها آليًا من العلامات
الحيوية ممكن لاحقًا وبيانات اللوحة تكفيه، لكن رقمًا محسوبًا يُعرض كأنه حكم
سريري قبل أن يُعاير على أنواع الحيوانات خطرٌ لا فائدة.`,
            },
          ),
          attendingStaffId: t.String({
            description: `الطبيب المعالج — إليه تُصعَّد الإنذارات الحرجة`,
          }),
          admittedById: __nullable__(t.String()),
          appointmentId: __nullable__(
            t.String({
              description: `أبواب الدخول — كلاهما اختياري، فالدخول المباشر (طوارئ) لا يمرّ بأيّهما`,
            }),
          ),
          operationCaseId: __nullable__(t.String()),
          presentingComplaint: __nullable__(t.String()),
          admissionDiagnosis: __nullable__(t.String()),
          isolationReason: __nullable__(t.String()),
          admissionWeightRecordId: __nullable__(
            t.String({
              description: `وزن الدخول كسجل علامات حيوية لا كرقم — الجرعة تُحسب منه، ومصدر الوزن الوحيد
المقبول في هذا النظام هو \`VitalSignsRecord\` (نفس قاعدة \`Prescription\`).`,
            }),
          ),
          monitoringIntervalMinutes: t.Integer({
            description: `دورية قياس العلامات الحيوية بالدقائق — أساس بند «القياس مستحق» في محرّك الاستحقاق`,
          }),
          dailyRateServiceId: __nullable__(
            t.String({
              description: `سعر اليوم — خدمة من كتالوج العيادة، وسعرها مُثبَّت لحظة الدخول فلا يتغيّر
أثر تعديل الكتالوج على إقامة جارية.`,
            }),
          ),
          dailyRateSnapshot: __nullable__(t.Number()),
          requestedAt: t.Date({
            description: `وقت كتابة الطلب. الطلب يسبق الدخول، فـ\`admittedAt\` تبقى فارغة حتى الإسكان
ولا تُقرأ كبداية للإقامة قبله — مدّة الإقامة تُحسب من الدخول لا من الطلب.`,
          }),
          admittedAt: __nullable__(t.Date()),
          expectedDischargeAt: __nullable__(t.Date()),
          dischargedAt: __nullable__(t.Date()),
          dischargeKind: __nullable__(
            t.Union(
              [
                t.Literal("ROUTINE"),
                t.Literal("AGAINST_MEDICAL_ADVICE"),
                t.Literal("TRANSFERRED"),
                t.Literal("DIED"),
                t.Literal("EUTHANIZED"),
              ],
              {
                additionalProperties: false,
                description: `طريقة انتهاء الإقامة. ليست تفصيلًا إحصائيًا: النافق والمُيسَّر موته يتجاوزان
بوابات الأوامر (لا معنى لطلب إيقاف مضادّ حيوي على حيوان نفق) ويستلزمان سببًا.`,
              },
            ),
          ),
          dischargedById: __nullable__(t.String()),
          dischargeSummaryAr: __nullable__(t.String()),
          dischargeInstructionsAr: __nullable__(t.String()),
          cancelReasonAr: __nullable__(t.String()),
          nextDueAt: __nullable__(
            t.Date({
              description: `كاش أقرب استحقاق عبر كل أوامر الإقامة — نفس فكرة \`VaccinationRecord.nextDueAt\`:
«من يحتاج شيئًا الآن؟» يصير مسحًا مفهرسًا بدل حساب لكل إقامة على حدة.
يُعاد حسابه في كل كتابة تحرّكه، ولا يُقرأ قطّ كمصدر حقيقة للعرض التفصيلي.`,
            }),
          ),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `الإقامة — التجميعة الجذر للوحدة.`,
        },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const OperationCasePlainInputCreate = t.Object(
  {
    code: t.String(),
    status: t.Optional(
      t.Union(
        [
          t.Literal("SCHEDULED"),
          t.Literal("PREP"),
          t.Literal("ANESTHESIA"),
          t.Literal("SURGERY"),
          t.Literal("RECOVERY"),
          t.Literal("DISCHARGE"),
          t.Literal("FOLLOW_UP"),
          t.Literal("COMPLETED"),
          t.Literal("CANCELLED"),
        ],
        { additionalProperties: false },
      ),
    ),
    stage: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("CONSENT"),
            t.Literal("FASTING_CHECK"),
            t.Literal("ASSESSMENT"),
            t.Literal("PREMED"),
            t.Literal("SIGN_IN"),
            t.Literal("INDUCTION"),
            t.Literal("MAINTENANCE"),
            t.Literal("TIME_OUT"),
            t.Literal("IN_PROGRESS"),
            t.Literal("CLOSING"),
            t.Literal("SIGN_OUT"),
            t.Literal("MONITORING"),
            t.Literal("READY_FOR_DISCHARGE"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    tier: t.Union(
      [t.Literal("MINOR"), t.Literal("INTERMEDIATE"), t.Literal("MAJOR")],
      { additionalProperties: false },
    ),
    tierOverrideReason: t.Optional(__nullable__(t.String())),
    urgency: t.Optional(
      t.Union(
        [
          t.Literal("IMMEDIATE"),
          t.Literal("URGENT"),
          t.Literal("EXPEDITED"),
          t.Literal("ELECTIVE"),
        ],
        { additionalProperties: false },
      ),
    ),
    plannedAnesthesia: t.Optional(
      t.Union(
        [
          t.Literal("NONE"),
          t.Literal("ANXIOLYSIS"),
          t.Literal("SEDATION"),
          t.Literal("GENERAL_ANESTHESIA"),
        ],
        { additionalProperties: false },
      ),
    ),
    scheduledAt: t.Optional(__nullable__(t.Date())),
    estimatedDurationMin: t.Optional(t.Integer()),
    ssiSurveillanceUntil: t.Optional(__nullable__(t.Date())),
    diagnosis: t.Optional(__nullable__(t.String())),
    clinicalSummary: t.Optional(__nullable__(t.String())),
    cancelKind: t.Optional(
      __nullable__(
        t.Union(
          [t.Literal("OWNER"), t.Literal("CLINIC"), t.Literal("CLINICAL")],
          { additionalProperties: false },
        ),
      ),
    ),
    cancelReason: t.Optional(__nullable__(t.String())),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const OperationCasePlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    status: t.Optional(
      t.Union(
        [
          t.Literal("SCHEDULED"),
          t.Literal("PREP"),
          t.Literal("ANESTHESIA"),
          t.Literal("SURGERY"),
          t.Literal("RECOVERY"),
          t.Literal("DISCHARGE"),
          t.Literal("FOLLOW_UP"),
          t.Literal("COMPLETED"),
          t.Literal("CANCELLED"),
        ],
        { additionalProperties: false },
      ),
    ),
    stage: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("CONSENT"),
            t.Literal("FASTING_CHECK"),
            t.Literal("ASSESSMENT"),
            t.Literal("PREMED"),
            t.Literal("SIGN_IN"),
            t.Literal("INDUCTION"),
            t.Literal("MAINTENANCE"),
            t.Literal("TIME_OUT"),
            t.Literal("IN_PROGRESS"),
            t.Literal("CLOSING"),
            t.Literal("SIGN_OUT"),
            t.Literal("MONITORING"),
            t.Literal("READY_FOR_DISCHARGE"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    tier: t.Optional(
      t.Union(
        [t.Literal("MINOR"), t.Literal("INTERMEDIATE"), t.Literal("MAJOR")],
        { additionalProperties: false },
      ),
    ),
    tierOverrideReason: t.Optional(__nullable__(t.String())),
    urgency: t.Optional(
      t.Union(
        [
          t.Literal("IMMEDIATE"),
          t.Literal("URGENT"),
          t.Literal("EXPEDITED"),
          t.Literal("ELECTIVE"),
        ],
        { additionalProperties: false },
      ),
    ),
    plannedAnesthesia: t.Optional(
      t.Union(
        [
          t.Literal("NONE"),
          t.Literal("ANXIOLYSIS"),
          t.Literal("SEDATION"),
          t.Literal("GENERAL_ANESTHESIA"),
        ],
        { additionalProperties: false },
      ),
    ),
    scheduledAt: t.Optional(__nullable__(t.Date())),
    estimatedDurationMin: t.Optional(t.Integer()),
    ssiSurveillanceUntil: t.Optional(__nullable__(t.Date())),
    diagnosis: t.Optional(__nullable__(t.String())),
    clinicalSummary: t.Optional(__nullable__(t.String())),
    cancelKind: t.Optional(
      __nullable__(
        t.Union(
          [t.Literal("OWNER"), t.Literal("CLINIC"), t.Literal("CLINICAL")],
          { additionalProperties: false },
        ),
      ),
    ),
    cancelReason: t.Optional(__nullable__(t.String())),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const OperationCaseRelationsInputCreate = t.Object(
  {
    clinic: t.Object(
      {
        connect: t.Object(
          {
            id: t.String({ additionalProperties: false }),
          },
          { additionalProperties: false },
        ),
      },
      { additionalProperties: false },
    ),
    branch: t.Object(
      {
        connect: t.Object(
          {
            id: t.String({ additionalProperties: false }),
          },
          { additionalProperties: false },
        ),
      },
      { additionalProperties: false },
    ),
    patient: t.Object(
      {
        connect: t.Object(
          {
            id: t.String({ additionalProperties: false }),
          },
          { additionalProperties: false },
        ),
      },
      { additionalProperties: false },
    ),
    owner: t.Object(
      {
        connect: t.Object(
          {
            id: t.String({ additionalProperties: false }),
          },
          { additionalProperties: false },
        ),
      },
      { additionalProperties: false },
    ),
    appointment: t.Optional(
      t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    room: t.Optional(
      t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    procedures: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    team: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    activity: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    consents: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    assessment: t.Optional(
      t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    checklistRuns: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    anesthesia: t.Optional(
      t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    note: t.Optional(
      t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    counts: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    implants: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    specimens: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    vitalSignsRecords: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    recoveryAssessments: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    postOpOrders: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    consumables: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    invoice: t.Optional(
      t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    inboxItems: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    complications: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    comments: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    sopRun: t.Optional(
      t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    patientConsents: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    inpatientStays: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const OperationCaseRelationsInputUpdate = t.Partial(
  t.Object(
    {
      clinic: t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
      branch: t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
      patient: t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
      owner: t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
      appointment: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
      ),
      room: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
      ),
      procedures: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      team: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      activity: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      consents: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      assessment: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
      ),
      checklistRuns: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      anesthesia: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
      ),
      note: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
      ),
      counts: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      implants: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      specimens: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      vitalSignsRecords: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      recoveryAssessments: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      postOpOrders: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      consumables: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      invoice: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
      ),
      inboxItems: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      complications: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      comments: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      sopRun: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
      ),
      patientConsents: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      inpatientStays: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
    },
    { additionalProperties: false },
  ),
);

export const OperationCaseWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          branchId: t.String(),
          patientId: t.String(),
          ownerId: t.String(),
          appointmentId: t.String(),
          status: t.Union(
            [
              t.Literal("SCHEDULED"),
              t.Literal("PREP"),
              t.Literal("ANESTHESIA"),
              t.Literal("SURGERY"),
              t.Literal("RECOVERY"),
              t.Literal("DISCHARGE"),
              t.Literal("FOLLOW_UP"),
              t.Literal("COMPLETED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          stage: t.Union(
            [
              t.Literal("CONSENT"),
              t.Literal("FASTING_CHECK"),
              t.Literal("ASSESSMENT"),
              t.Literal("PREMED"),
              t.Literal("SIGN_IN"),
              t.Literal("INDUCTION"),
              t.Literal("MAINTENANCE"),
              t.Literal("TIME_OUT"),
              t.Literal("IN_PROGRESS"),
              t.Literal("CLOSING"),
              t.Literal("SIGN_OUT"),
              t.Literal("MONITORING"),
              t.Literal("READY_FOR_DISCHARGE"),
            ],
            { additionalProperties: false },
          ),
          tier: t.Union(
            [t.Literal("MINOR"), t.Literal("INTERMEDIATE"), t.Literal("MAJOR")],
            { additionalProperties: false },
          ),
          tierOverrideReason: t.String(),
          urgency: t.Union(
            [
              t.Literal("IMMEDIATE"),
              t.Literal("URGENT"),
              t.Literal("EXPEDITED"),
              t.Literal("ELECTIVE"),
            ],
            { additionalProperties: false },
          ),
          plannedAnesthesia: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("ANXIOLYSIS"),
              t.Literal("SEDATION"),
              t.Literal("GENERAL_ANESTHESIA"),
            ],
            { additionalProperties: false },
          ),
          scheduledAt: t.Date(),
          estimatedDurationMin: t.Integer(),
          ssiSurveillanceUntil: t.Date(),
          roomId: t.String(),
          diagnosis: t.String(),
          clinicalSummary: t.String(),
          cancelKind: t.Union(
            [t.Literal("OWNER"), t.Literal("CLINIC"), t.Literal("CLINICAL")],
            { additionalProperties: false },
          ),
          cancelReason: t.String(),
          isDeleted: t.Boolean(),
          deletedAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "OperationCase" },
  ),
);

export const OperationCaseWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), code: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ code: t.String() })],
          { additionalProperties: false },
        ),
        t.Partial(
          t.Object({
            AND: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            NOT: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            OR: t.Array(Self, { additionalProperties: false }),
          }),
          { additionalProperties: false },
        ),
        t.Partial(
          t.Object(
            {
              id: t.String(),
              code: t.String(),
              clinicId: t.String(),
              branchId: t.String(),
              patientId: t.String(),
              ownerId: t.String(),
              appointmentId: t.String(),
              status: t.Union(
                [
                  t.Literal("SCHEDULED"),
                  t.Literal("PREP"),
                  t.Literal("ANESTHESIA"),
                  t.Literal("SURGERY"),
                  t.Literal("RECOVERY"),
                  t.Literal("DISCHARGE"),
                  t.Literal("FOLLOW_UP"),
                  t.Literal("COMPLETED"),
                  t.Literal("CANCELLED"),
                ],
                { additionalProperties: false },
              ),
              stage: t.Union(
                [
                  t.Literal("CONSENT"),
                  t.Literal("FASTING_CHECK"),
                  t.Literal("ASSESSMENT"),
                  t.Literal("PREMED"),
                  t.Literal("SIGN_IN"),
                  t.Literal("INDUCTION"),
                  t.Literal("MAINTENANCE"),
                  t.Literal("TIME_OUT"),
                  t.Literal("IN_PROGRESS"),
                  t.Literal("CLOSING"),
                  t.Literal("SIGN_OUT"),
                  t.Literal("MONITORING"),
                  t.Literal("READY_FOR_DISCHARGE"),
                ],
                { additionalProperties: false },
              ),
              tier: t.Union(
                [
                  t.Literal("MINOR"),
                  t.Literal("INTERMEDIATE"),
                  t.Literal("MAJOR"),
                ],
                { additionalProperties: false },
              ),
              tierOverrideReason: t.String(),
              urgency: t.Union(
                [
                  t.Literal("IMMEDIATE"),
                  t.Literal("URGENT"),
                  t.Literal("EXPEDITED"),
                  t.Literal("ELECTIVE"),
                ],
                { additionalProperties: false },
              ),
              plannedAnesthesia: t.Union(
                [
                  t.Literal("NONE"),
                  t.Literal("ANXIOLYSIS"),
                  t.Literal("SEDATION"),
                  t.Literal("GENERAL_ANESTHESIA"),
                ],
                { additionalProperties: false },
              ),
              scheduledAt: t.Date(),
              estimatedDurationMin: t.Integer(),
              ssiSurveillanceUntil: t.Date(),
              roomId: t.String(),
              diagnosis: t.String(),
              clinicalSummary: t.String(),
              cancelKind: t.Union(
                [
                  t.Literal("OWNER"),
                  t.Literal("CLINIC"),
                  t.Literal("CLINICAL"),
                ],
                { additionalProperties: false },
              ),
              cancelReason: t.String(),
              isDeleted: t.Boolean(),
              deletedAt: t.Date(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "OperationCase" },
);

export const OperationCaseSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      branchId: t.Boolean(),
      patientId: t.Boolean(),
      ownerId: t.Boolean(),
      appointmentId: t.Boolean(),
      status: t.Boolean(),
      stage: t.Boolean(),
      tier: t.Boolean(),
      tierOverrideReason: t.Boolean(),
      urgency: t.Boolean(),
      plannedAnesthesia: t.Boolean(),
      scheduledAt: t.Boolean(),
      estimatedDurationMin: t.Boolean(),
      ssiSurveillanceUntil: t.Boolean(),
      roomId: t.Boolean(),
      diagnosis: t.Boolean(),
      clinicalSummary: t.Boolean(),
      cancelKind: t.Boolean(),
      cancelReason: t.Boolean(),
      isDeleted: t.Boolean(),
      deletedAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      branch: t.Boolean(),
      patient: t.Boolean(),
      owner: t.Boolean(),
      appointment: t.Boolean(),
      room: t.Boolean(),
      procedures: t.Boolean(),
      team: t.Boolean(),
      activity: t.Boolean(),
      consents: t.Boolean(),
      assessment: t.Boolean(),
      checklistRuns: t.Boolean(),
      anesthesia: t.Boolean(),
      note: t.Boolean(),
      counts: t.Boolean(),
      implants: t.Boolean(),
      specimens: t.Boolean(),
      vitalSignsRecords: t.Boolean(),
      recoveryAssessments: t.Boolean(),
      postOpOrders: t.Boolean(),
      consumables: t.Boolean(),
      invoice: t.Boolean(),
      inboxItems: t.Boolean(),
      complications: t.Boolean(),
      comments: t.Boolean(),
      sopRun: t.Boolean(),
      patientConsents: t.Boolean(),
      inpatientStays: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OperationCaseInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      stage: t.Boolean(),
      tier: t.Boolean(),
      urgency: t.Boolean(),
      plannedAnesthesia: t.Boolean(),
      cancelKind: t.Boolean(),
      clinic: t.Boolean(),
      branch: t.Boolean(),
      patient: t.Boolean(),
      owner: t.Boolean(),
      appointment: t.Boolean(),
      room: t.Boolean(),
      procedures: t.Boolean(),
      team: t.Boolean(),
      activity: t.Boolean(),
      consents: t.Boolean(),
      assessment: t.Boolean(),
      checklistRuns: t.Boolean(),
      anesthesia: t.Boolean(),
      note: t.Boolean(),
      counts: t.Boolean(),
      implants: t.Boolean(),
      specimens: t.Boolean(),
      vitalSignsRecords: t.Boolean(),
      recoveryAssessments: t.Boolean(),
      postOpOrders: t.Boolean(),
      consumables: t.Boolean(),
      invoice: t.Boolean(),
      inboxItems: t.Boolean(),
      complications: t.Boolean(),
      comments: t.Boolean(),
      sopRun: t.Boolean(),
      patientConsents: t.Boolean(),
      inpatientStays: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OperationCaseOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      code: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      branchId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      patientId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ownerId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      appointmentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      tierOverrideReason: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      scheduledAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      estimatedDurationMin: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ssiSurveillanceUntil: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      roomId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      diagnosis: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicalSummary: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      cancelReason: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDeleted: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      deletedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const OperationCase = t.Composite(
  [OperationCasePlain, OperationCaseRelations],
  { additionalProperties: false },
);

export const OperationCaseInputCreate = t.Composite(
  [OperationCasePlainInputCreate, OperationCaseRelationsInputCreate],
  { additionalProperties: false },
);

export const OperationCaseInputUpdate = t.Composite(
  [OperationCasePlainInputUpdate, OperationCaseRelationsInputUpdate],
  { additionalProperties: false },
);
