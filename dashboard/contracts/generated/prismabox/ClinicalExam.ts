import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClinicalExamPlain = t.Object(
  {
    id: t.String(),
    appointmentId: t.String(),
    startedAt: __nullable__(t.Date()),
    completedAt: __nullable__(t.Date()),
    currentStep: t.Integer(),
    chiefComplaint: __nullable__(t.String()),
    duration: __nullable__(t.String()),
    presentIllnessHistory: __nullable__(t.String()),
    ownerNotes: __nullable__(t.String()),
    symptoms: t.Array(
      t.Union(
        [
          t.Literal("VOMITING"),
          t.Literal("DIARRHEA"),
          t.Literal("COUGH"),
          t.Literal("SNEEZING"),
          t.Literal("LETHARGY"),
        ],
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    urination: __nullable__(
      t.Union(
        [
          t.Literal("NORMAL"),
          t.Literal("INCREASED"),
          t.Literal("DECREASED"),
          t.Literal("ABSENT"),
        ],
        { additionalProperties: false },
      ),
    ),
    defecation: __nullable__(
      t.Union(
        [
          t.Literal("NORMAL"),
          t.Literal("INCREASED"),
          t.Literal("DECREASED"),
          t.Literal("ABSENT"),
        ],
        { additionalProperties: false },
      ),
    ),
    appetite: __nullable__(
      t.Union(
        [
          t.Literal("NORMAL"),
          t.Literal("INCREASED"),
          t.Literal("DECREASED"),
          t.Literal("ABSENT"),
        ],
        { additionalProperties: false },
      ),
    ),
    waterIntake: __nullable__(
      t.Union(
        [
          t.Literal("NORMAL"),
          t.Literal("INCREASED"),
          t.Literal("DECREASED"),
          t.Literal("ABSENT"),
        ],
        { additionalProperties: false },
      ),
    ),
    vitalsRecordId: __nullable__(t.String()),
    weight: __nullable__(t.Number()),
    temperature: __nullable__(t.Number()),
    heartRate: __nullable__(t.Number()),
    respiratoryRate: __nullable__(t.Number()),
    oxygenSaturation: __nullable__(t.Number()),
    bloodPressure: __nullable__(t.String()),
    painScore: __nullable__(t.Number()),
    bodyConditionScore: __nullable__(t.Number()),
    hydration: __nullable__(
      t.Union(
        [t.Literal("NORMAL"), t.Literal("ABNORMAL"), t.Literal("NOT_EXAMINED")],
        { additionalProperties: false },
      ),
    ),
    skinCondition: __nullable__(
      t.Union(
        [t.Literal("NORMAL"), t.Literal("ABNORMAL"), t.Literal("NOT_EXAMINED")],
        { additionalProperties: false },
      ),
    ),
    hairCondition: __nullable__(
      t.Union(
        [t.Literal("NORMAL"), t.Literal("ABNORMAL"), t.Literal("NOT_EXAMINED")],
        { additionalProperties: false },
      ),
    ),
    eyeCondition: __nullable__(
      t.Union(
        [t.Literal("NORMAL"), t.Literal("ABNORMAL"), t.Literal("NOT_EXAMINED")],
        { additionalProperties: false },
      ),
    ),
    boneCondition: __nullable__(
      t.Union(
        [t.Literal("NORMAL"), t.Literal("ABNORMAL"), t.Literal("NOT_EXAMINED")],
        { additionalProperties: false },
      ),
    ),
    respiratorySystem: __nullable__(
      t.Union(
        [t.Literal("NORMAL"), t.Literal("ABNORMAL"), t.Literal("NOT_EXAMINED")],
        { additionalProperties: false },
      ),
    ),
    digestiveSystem: __nullable__(
      t.Union(
        [t.Literal("NORMAL"), t.Literal("ABNORMAL"), t.Literal("NOT_EXAMINED")],
        { additionalProperties: false },
      ),
    ),
    nervousSystem: __nullable__(
      t.Union(
        [t.Literal("NORMAL"), t.Literal("ABNORMAL"), t.Literal("NOT_EXAMINED")],
        { additionalProperties: false },
      ),
    ),
    earCondition: __nullable__(
      t.Union(
        [t.Literal("NORMAL"), t.Literal("ABNORMAL"), t.Literal("NOT_EXAMINED")],
        { additionalProperties: false },
      ),
    ),
    checklistPatientData: t.Boolean(),
    checklistChiefComplaint: t.Boolean(),
    checklistSymptomDuration: t.Boolean(),
    checklistDiet: t.Boolean(),
    checklistVaccinations: t.Boolean(),
    checklistPreviousTreatments: t.Boolean(),
    checklistTemperature: t.Boolean(),
    checklistHeartRate: t.Boolean(),
    checklistBloodPressure: t.Boolean(),
    checklistHydration: t.Boolean(),
    checklistBehavior: t.Boolean(),
    checklistAppetite: t.Boolean(),
    checklistOxygen: t.Boolean(),
    checklistSkin: t.Boolean(),
    checklistSeverity: t.Boolean(),
    checklistAppearance: t.Boolean(),
    checklistRespiration: t.Boolean(),
    checklistDigestive: t.Boolean(),
    checklistNervous: t.Boolean(),
    checklistEar: t.Boolean(),
    checklistVomiting: t.Boolean(),
    checklistConsciousness: t.Boolean(),
    checklistDiagnosis: t.Boolean(),
    checklistUltrasound: t.Boolean(),
    checklistReferral: t.Boolean(),
    checklistXray: t.Boolean(),
    checklistFollowup: t.Boolean(),
    preliminaryDiagnosis: __nullable__(t.String()),
    severity: __nullable__(
      t.Union(
        [
          t.Literal("MILD"),
          t.Literal("MODERATE"),
          t.Literal("SEVERE"),
          t.Literal("CRITICAL"),
        ],
        { additionalProperties: false },
      ),
    ),
    diagnosisDescription: __nullable__(t.String()),
    dietPlan: __nullable__(t.String()),
    monitoringPlan: __nullable__(t.String()),
    vaccinationReviewedAt: __nullable__(t.Date()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const ClinicalExamRelations = t.Object(
  {
    appointment: t.Object(
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
    vitalsRecord: __nullable__(
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
    ),
  },
  { additionalProperties: false },
);

export const ClinicalExamPlainInputCreate = t.Object(
  {
    startedAt: t.Optional(__nullable__(t.Date())),
    completedAt: t.Optional(__nullable__(t.Date())),
    currentStep: t.Optional(t.Integer()),
    chiefComplaint: t.Optional(__nullable__(t.String())),
    duration: t.Optional(__nullable__(t.String())),
    presentIllnessHistory: t.Optional(__nullable__(t.String())),
    ownerNotes: t.Optional(__nullable__(t.String())),
    symptoms: t.Array(
      t.Union(
        [
          t.Literal("VOMITING"),
          t.Literal("DIARRHEA"),
          t.Literal("COUGH"),
          t.Literal("SNEEZING"),
          t.Literal("LETHARGY"),
        ],
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    urination: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("NORMAL"),
            t.Literal("INCREASED"),
            t.Literal("DECREASED"),
            t.Literal("ABSENT"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    defecation: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("NORMAL"),
            t.Literal("INCREASED"),
            t.Literal("DECREASED"),
            t.Literal("ABSENT"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    appetite: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("NORMAL"),
            t.Literal("INCREASED"),
            t.Literal("DECREASED"),
            t.Literal("ABSENT"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    waterIntake: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("NORMAL"),
            t.Literal("INCREASED"),
            t.Literal("DECREASED"),
            t.Literal("ABSENT"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    weight: t.Optional(__nullable__(t.Number())),
    temperature: t.Optional(__nullable__(t.Number())),
    heartRate: t.Optional(__nullable__(t.Number())),
    respiratoryRate: t.Optional(__nullable__(t.Number())),
    oxygenSaturation: t.Optional(__nullable__(t.Number())),
    bloodPressure: t.Optional(__nullable__(t.String())),
    painScore: t.Optional(__nullable__(t.Number())),
    bodyConditionScore: t.Optional(__nullable__(t.Number())),
    hydration: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("NORMAL"),
            t.Literal("ABNORMAL"),
            t.Literal("NOT_EXAMINED"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    skinCondition: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("NORMAL"),
            t.Literal("ABNORMAL"),
            t.Literal("NOT_EXAMINED"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    hairCondition: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("NORMAL"),
            t.Literal("ABNORMAL"),
            t.Literal("NOT_EXAMINED"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    eyeCondition: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("NORMAL"),
            t.Literal("ABNORMAL"),
            t.Literal("NOT_EXAMINED"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    boneCondition: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("NORMAL"),
            t.Literal("ABNORMAL"),
            t.Literal("NOT_EXAMINED"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    respiratorySystem: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("NORMAL"),
            t.Literal("ABNORMAL"),
            t.Literal("NOT_EXAMINED"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    digestiveSystem: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("NORMAL"),
            t.Literal("ABNORMAL"),
            t.Literal("NOT_EXAMINED"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    nervousSystem: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("NORMAL"),
            t.Literal("ABNORMAL"),
            t.Literal("NOT_EXAMINED"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    earCondition: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("NORMAL"),
            t.Literal("ABNORMAL"),
            t.Literal("NOT_EXAMINED"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    checklistPatientData: t.Optional(t.Boolean()),
    checklistChiefComplaint: t.Optional(t.Boolean()),
    checklistSymptomDuration: t.Optional(t.Boolean()),
    checklistDiet: t.Optional(t.Boolean()),
    checklistVaccinations: t.Optional(t.Boolean()),
    checklistPreviousTreatments: t.Optional(t.Boolean()),
    checklistTemperature: t.Optional(t.Boolean()),
    checklistHeartRate: t.Optional(t.Boolean()),
    checklistBloodPressure: t.Optional(t.Boolean()),
    checklistHydration: t.Optional(t.Boolean()),
    checklistBehavior: t.Optional(t.Boolean()),
    checklistAppetite: t.Optional(t.Boolean()),
    checklistOxygen: t.Optional(t.Boolean()),
    checklistSkin: t.Optional(t.Boolean()),
    checklistSeverity: t.Optional(t.Boolean()),
    checklistAppearance: t.Optional(t.Boolean()),
    checklistRespiration: t.Optional(t.Boolean()),
    checklistDigestive: t.Optional(t.Boolean()),
    checklistNervous: t.Optional(t.Boolean()),
    checklistEar: t.Optional(t.Boolean()),
    checklistVomiting: t.Optional(t.Boolean()),
    checklistConsciousness: t.Optional(t.Boolean()),
    checklistDiagnosis: t.Optional(t.Boolean()),
    checklistUltrasound: t.Optional(t.Boolean()),
    checklistReferral: t.Optional(t.Boolean()),
    checklistXray: t.Optional(t.Boolean()),
    checklistFollowup: t.Optional(t.Boolean()),
    preliminaryDiagnosis: t.Optional(__nullable__(t.String())),
    severity: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("MILD"),
            t.Literal("MODERATE"),
            t.Literal("SEVERE"),
            t.Literal("CRITICAL"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    diagnosisDescription: t.Optional(__nullable__(t.String())),
    dietPlan: t.Optional(__nullable__(t.String())),
    monitoringPlan: t.Optional(__nullable__(t.String())),
    vaccinationReviewedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const ClinicalExamPlainInputUpdate = t.Object(
  {
    startedAt: t.Optional(__nullable__(t.Date())),
    completedAt: t.Optional(__nullable__(t.Date())),
    currentStep: t.Optional(t.Integer()),
    chiefComplaint: t.Optional(__nullable__(t.String())),
    duration: t.Optional(__nullable__(t.String())),
    presentIllnessHistory: t.Optional(__nullable__(t.String())),
    ownerNotes: t.Optional(__nullable__(t.String())),
    symptoms: t.Optional(
      t.Array(
        t.Union(
          [
            t.Literal("VOMITING"),
            t.Literal("DIARRHEA"),
            t.Literal("COUGH"),
            t.Literal("SNEEZING"),
            t.Literal("LETHARGY"),
          ],
          { additionalProperties: false },
        ),
        { additionalProperties: false },
      ),
    ),
    urination: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("NORMAL"),
            t.Literal("INCREASED"),
            t.Literal("DECREASED"),
            t.Literal("ABSENT"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    defecation: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("NORMAL"),
            t.Literal("INCREASED"),
            t.Literal("DECREASED"),
            t.Literal("ABSENT"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    appetite: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("NORMAL"),
            t.Literal("INCREASED"),
            t.Literal("DECREASED"),
            t.Literal("ABSENT"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    waterIntake: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("NORMAL"),
            t.Literal("INCREASED"),
            t.Literal("DECREASED"),
            t.Literal("ABSENT"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    weight: t.Optional(__nullable__(t.Number())),
    temperature: t.Optional(__nullable__(t.Number())),
    heartRate: t.Optional(__nullable__(t.Number())),
    respiratoryRate: t.Optional(__nullable__(t.Number())),
    oxygenSaturation: t.Optional(__nullable__(t.Number())),
    bloodPressure: t.Optional(__nullable__(t.String())),
    painScore: t.Optional(__nullable__(t.Number())),
    bodyConditionScore: t.Optional(__nullable__(t.Number())),
    hydration: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("NORMAL"),
            t.Literal("ABNORMAL"),
            t.Literal("NOT_EXAMINED"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    skinCondition: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("NORMAL"),
            t.Literal("ABNORMAL"),
            t.Literal("NOT_EXAMINED"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    hairCondition: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("NORMAL"),
            t.Literal("ABNORMAL"),
            t.Literal("NOT_EXAMINED"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    eyeCondition: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("NORMAL"),
            t.Literal("ABNORMAL"),
            t.Literal("NOT_EXAMINED"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    boneCondition: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("NORMAL"),
            t.Literal("ABNORMAL"),
            t.Literal("NOT_EXAMINED"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    respiratorySystem: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("NORMAL"),
            t.Literal("ABNORMAL"),
            t.Literal("NOT_EXAMINED"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    digestiveSystem: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("NORMAL"),
            t.Literal("ABNORMAL"),
            t.Literal("NOT_EXAMINED"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    nervousSystem: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("NORMAL"),
            t.Literal("ABNORMAL"),
            t.Literal("NOT_EXAMINED"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    earCondition: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("NORMAL"),
            t.Literal("ABNORMAL"),
            t.Literal("NOT_EXAMINED"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    checklistPatientData: t.Optional(t.Boolean()),
    checklistChiefComplaint: t.Optional(t.Boolean()),
    checklistSymptomDuration: t.Optional(t.Boolean()),
    checklistDiet: t.Optional(t.Boolean()),
    checklistVaccinations: t.Optional(t.Boolean()),
    checklistPreviousTreatments: t.Optional(t.Boolean()),
    checklistTemperature: t.Optional(t.Boolean()),
    checklistHeartRate: t.Optional(t.Boolean()),
    checklistBloodPressure: t.Optional(t.Boolean()),
    checklistHydration: t.Optional(t.Boolean()),
    checklistBehavior: t.Optional(t.Boolean()),
    checklistAppetite: t.Optional(t.Boolean()),
    checklistOxygen: t.Optional(t.Boolean()),
    checklistSkin: t.Optional(t.Boolean()),
    checklistSeverity: t.Optional(t.Boolean()),
    checklistAppearance: t.Optional(t.Boolean()),
    checklistRespiration: t.Optional(t.Boolean()),
    checklistDigestive: t.Optional(t.Boolean()),
    checklistNervous: t.Optional(t.Boolean()),
    checklistEar: t.Optional(t.Boolean()),
    checklistVomiting: t.Optional(t.Boolean()),
    checklistConsciousness: t.Optional(t.Boolean()),
    checklistDiagnosis: t.Optional(t.Boolean()),
    checklistUltrasound: t.Optional(t.Boolean()),
    checklistReferral: t.Optional(t.Boolean()),
    checklistXray: t.Optional(t.Boolean()),
    checklistFollowup: t.Optional(t.Boolean()),
    preliminaryDiagnosis: t.Optional(__nullable__(t.String())),
    severity: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("MILD"),
            t.Literal("MODERATE"),
            t.Literal("SEVERE"),
            t.Literal("CRITICAL"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    diagnosisDescription: t.Optional(__nullable__(t.String())),
    dietPlan: t.Optional(__nullable__(t.String())),
    monitoringPlan: t.Optional(__nullable__(t.String())),
    vaccinationReviewedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const ClinicalExamRelationsInputCreate = t.Object(
  {
    appointment: t.Object(
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
    vitalsRecord: t.Optional(
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
  },
  { additionalProperties: false },
);

export const ClinicalExamRelationsInputUpdate = t.Partial(
  t.Object(
    {
      appointment: t.Object(
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
      vitalsRecord: t.Partial(
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
    },
    { additionalProperties: false },
  ),
);

export const ClinicalExamWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          appointmentId: t.String(),
          startedAt: t.Date(),
          completedAt: t.Date(),
          currentStep: t.Integer(),
          chiefComplaint: t.String(),
          duration: t.String(),
          presentIllnessHistory: t.String(),
          ownerNotes: t.String(),
          symptoms: t.Array(
            t.Union(
              [
                t.Literal("VOMITING"),
                t.Literal("DIARRHEA"),
                t.Literal("COUGH"),
                t.Literal("SNEEZING"),
                t.Literal("LETHARGY"),
              ],
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
          urination: t.Union(
            [
              t.Literal("NORMAL"),
              t.Literal("INCREASED"),
              t.Literal("DECREASED"),
              t.Literal("ABSENT"),
            ],
            { additionalProperties: false },
          ),
          defecation: t.Union(
            [
              t.Literal("NORMAL"),
              t.Literal("INCREASED"),
              t.Literal("DECREASED"),
              t.Literal("ABSENT"),
            ],
            { additionalProperties: false },
          ),
          appetite: t.Union(
            [
              t.Literal("NORMAL"),
              t.Literal("INCREASED"),
              t.Literal("DECREASED"),
              t.Literal("ABSENT"),
            ],
            { additionalProperties: false },
          ),
          waterIntake: t.Union(
            [
              t.Literal("NORMAL"),
              t.Literal("INCREASED"),
              t.Literal("DECREASED"),
              t.Literal("ABSENT"),
            ],
            { additionalProperties: false },
          ),
          vitalsRecordId: t.String(),
          weight: t.Number(),
          temperature: t.Number(),
          heartRate: t.Number(),
          respiratoryRate: t.Number(),
          oxygenSaturation: t.Number(),
          bloodPressure: t.String(),
          painScore: t.Number(),
          bodyConditionScore: t.Number(),
          hydration: t.Union(
            [
              t.Literal("NORMAL"),
              t.Literal("ABNORMAL"),
              t.Literal("NOT_EXAMINED"),
            ],
            { additionalProperties: false },
          ),
          skinCondition: t.Union(
            [
              t.Literal("NORMAL"),
              t.Literal("ABNORMAL"),
              t.Literal("NOT_EXAMINED"),
            ],
            { additionalProperties: false },
          ),
          hairCondition: t.Union(
            [
              t.Literal("NORMAL"),
              t.Literal("ABNORMAL"),
              t.Literal("NOT_EXAMINED"),
            ],
            { additionalProperties: false },
          ),
          eyeCondition: t.Union(
            [
              t.Literal("NORMAL"),
              t.Literal("ABNORMAL"),
              t.Literal("NOT_EXAMINED"),
            ],
            { additionalProperties: false },
          ),
          boneCondition: t.Union(
            [
              t.Literal("NORMAL"),
              t.Literal("ABNORMAL"),
              t.Literal("NOT_EXAMINED"),
            ],
            { additionalProperties: false },
          ),
          respiratorySystem: t.Union(
            [
              t.Literal("NORMAL"),
              t.Literal("ABNORMAL"),
              t.Literal("NOT_EXAMINED"),
            ],
            { additionalProperties: false },
          ),
          digestiveSystem: t.Union(
            [
              t.Literal("NORMAL"),
              t.Literal("ABNORMAL"),
              t.Literal("NOT_EXAMINED"),
            ],
            { additionalProperties: false },
          ),
          nervousSystem: t.Union(
            [
              t.Literal("NORMAL"),
              t.Literal("ABNORMAL"),
              t.Literal("NOT_EXAMINED"),
            ],
            { additionalProperties: false },
          ),
          earCondition: t.Union(
            [
              t.Literal("NORMAL"),
              t.Literal("ABNORMAL"),
              t.Literal("NOT_EXAMINED"),
            ],
            { additionalProperties: false },
          ),
          checklistPatientData: t.Boolean(),
          checklistChiefComplaint: t.Boolean(),
          checklistSymptomDuration: t.Boolean(),
          checklistDiet: t.Boolean(),
          checklistVaccinations: t.Boolean(),
          checklistPreviousTreatments: t.Boolean(),
          checklistTemperature: t.Boolean(),
          checklistHeartRate: t.Boolean(),
          checklistBloodPressure: t.Boolean(),
          checklistHydration: t.Boolean(),
          checklistBehavior: t.Boolean(),
          checklistAppetite: t.Boolean(),
          checklistOxygen: t.Boolean(),
          checklistSkin: t.Boolean(),
          checklistSeverity: t.Boolean(),
          checklistAppearance: t.Boolean(),
          checklistRespiration: t.Boolean(),
          checklistDigestive: t.Boolean(),
          checklistNervous: t.Boolean(),
          checklistEar: t.Boolean(),
          checklistVomiting: t.Boolean(),
          checklistConsciousness: t.Boolean(),
          checklistDiagnosis: t.Boolean(),
          checklistUltrasound: t.Boolean(),
          checklistReferral: t.Boolean(),
          checklistXray: t.Boolean(),
          checklistFollowup: t.Boolean(),
          preliminaryDiagnosis: t.String(),
          severity: t.Union(
            [
              t.Literal("MILD"),
              t.Literal("MODERATE"),
              t.Literal("SEVERE"),
              t.Literal("CRITICAL"),
            ],
            { additionalProperties: false },
          ),
          diagnosisDescription: t.String(),
          dietPlan: t.String(),
          monitoringPlan: t.String(),
          vaccinationReviewedAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "ClinicalExam" },
  ),
);

export const ClinicalExamWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), appointmentId: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({ appointmentId: t.String() }),
          ],
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
              appointmentId: t.String(),
              startedAt: t.Date(),
              completedAt: t.Date(),
              currentStep: t.Integer(),
              chiefComplaint: t.String(),
              duration: t.String(),
              presentIllnessHistory: t.String(),
              ownerNotes: t.String(),
              symptoms: t.Array(
                t.Union(
                  [
                    t.Literal("VOMITING"),
                    t.Literal("DIARRHEA"),
                    t.Literal("COUGH"),
                    t.Literal("SNEEZING"),
                    t.Literal("LETHARGY"),
                  ],
                  { additionalProperties: false },
                ),
                { additionalProperties: false },
              ),
              urination: t.Union(
                [
                  t.Literal("NORMAL"),
                  t.Literal("INCREASED"),
                  t.Literal("DECREASED"),
                  t.Literal("ABSENT"),
                ],
                { additionalProperties: false },
              ),
              defecation: t.Union(
                [
                  t.Literal("NORMAL"),
                  t.Literal("INCREASED"),
                  t.Literal("DECREASED"),
                  t.Literal("ABSENT"),
                ],
                { additionalProperties: false },
              ),
              appetite: t.Union(
                [
                  t.Literal("NORMAL"),
                  t.Literal("INCREASED"),
                  t.Literal("DECREASED"),
                  t.Literal("ABSENT"),
                ],
                { additionalProperties: false },
              ),
              waterIntake: t.Union(
                [
                  t.Literal("NORMAL"),
                  t.Literal("INCREASED"),
                  t.Literal("DECREASED"),
                  t.Literal("ABSENT"),
                ],
                { additionalProperties: false },
              ),
              vitalsRecordId: t.String(),
              weight: t.Number(),
              temperature: t.Number(),
              heartRate: t.Number(),
              respiratoryRate: t.Number(),
              oxygenSaturation: t.Number(),
              bloodPressure: t.String(),
              painScore: t.Number(),
              bodyConditionScore: t.Number(),
              hydration: t.Union(
                [
                  t.Literal("NORMAL"),
                  t.Literal("ABNORMAL"),
                  t.Literal("NOT_EXAMINED"),
                ],
                { additionalProperties: false },
              ),
              skinCondition: t.Union(
                [
                  t.Literal("NORMAL"),
                  t.Literal("ABNORMAL"),
                  t.Literal("NOT_EXAMINED"),
                ],
                { additionalProperties: false },
              ),
              hairCondition: t.Union(
                [
                  t.Literal("NORMAL"),
                  t.Literal("ABNORMAL"),
                  t.Literal("NOT_EXAMINED"),
                ],
                { additionalProperties: false },
              ),
              eyeCondition: t.Union(
                [
                  t.Literal("NORMAL"),
                  t.Literal("ABNORMAL"),
                  t.Literal("NOT_EXAMINED"),
                ],
                { additionalProperties: false },
              ),
              boneCondition: t.Union(
                [
                  t.Literal("NORMAL"),
                  t.Literal("ABNORMAL"),
                  t.Literal("NOT_EXAMINED"),
                ],
                { additionalProperties: false },
              ),
              respiratorySystem: t.Union(
                [
                  t.Literal("NORMAL"),
                  t.Literal("ABNORMAL"),
                  t.Literal("NOT_EXAMINED"),
                ],
                { additionalProperties: false },
              ),
              digestiveSystem: t.Union(
                [
                  t.Literal("NORMAL"),
                  t.Literal("ABNORMAL"),
                  t.Literal("NOT_EXAMINED"),
                ],
                { additionalProperties: false },
              ),
              nervousSystem: t.Union(
                [
                  t.Literal("NORMAL"),
                  t.Literal("ABNORMAL"),
                  t.Literal("NOT_EXAMINED"),
                ],
                { additionalProperties: false },
              ),
              earCondition: t.Union(
                [
                  t.Literal("NORMAL"),
                  t.Literal("ABNORMAL"),
                  t.Literal("NOT_EXAMINED"),
                ],
                { additionalProperties: false },
              ),
              checklistPatientData: t.Boolean(),
              checklistChiefComplaint: t.Boolean(),
              checklistSymptomDuration: t.Boolean(),
              checklistDiet: t.Boolean(),
              checklistVaccinations: t.Boolean(),
              checklistPreviousTreatments: t.Boolean(),
              checklistTemperature: t.Boolean(),
              checklistHeartRate: t.Boolean(),
              checklistBloodPressure: t.Boolean(),
              checklistHydration: t.Boolean(),
              checklistBehavior: t.Boolean(),
              checklistAppetite: t.Boolean(),
              checklistOxygen: t.Boolean(),
              checklistSkin: t.Boolean(),
              checklistSeverity: t.Boolean(),
              checklistAppearance: t.Boolean(),
              checklistRespiration: t.Boolean(),
              checklistDigestive: t.Boolean(),
              checklistNervous: t.Boolean(),
              checklistEar: t.Boolean(),
              checklistVomiting: t.Boolean(),
              checklistConsciousness: t.Boolean(),
              checklistDiagnosis: t.Boolean(),
              checklistUltrasound: t.Boolean(),
              checklistReferral: t.Boolean(),
              checklistXray: t.Boolean(),
              checklistFollowup: t.Boolean(),
              preliminaryDiagnosis: t.String(),
              severity: t.Union(
                [
                  t.Literal("MILD"),
                  t.Literal("MODERATE"),
                  t.Literal("SEVERE"),
                  t.Literal("CRITICAL"),
                ],
                { additionalProperties: false },
              ),
              diagnosisDescription: t.String(),
              dietPlan: t.String(),
              monitoringPlan: t.String(),
              vaccinationReviewedAt: t.Date(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ClinicalExam" },
);

export const ClinicalExamSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      appointmentId: t.Boolean(),
      startedAt: t.Boolean(),
      completedAt: t.Boolean(),
      currentStep: t.Boolean(),
      chiefComplaint: t.Boolean(),
      duration: t.Boolean(),
      presentIllnessHistory: t.Boolean(),
      ownerNotes: t.Boolean(),
      symptoms: t.Boolean(),
      urination: t.Boolean(),
      defecation: t.Boolean(),
      appetite: t.Boolean(),
      waterIntake: t.Boolean(),
      vitalsRecordId: t.Boolean(),
      weight: t.Boolean(),
      temperature: t.Boolean(),
      heartRate: t.Boolean(),
      respiratoryRate: t.Boolean(),
      oxygenSaturation: t.Boolean(),
      bloodPressure: t.Boolean(),
      painScore: t.Boolean(),
      bodyConditionScore: t.Boolean(),
      hydration: t.Boolean(),
      skinCondition: t.Boolean(),
      hairCondition: t.Boolean(),
      eyeCondition: t.Boolean(),
      boneCondition: t.Boolean(),
      respiratorySystem: t.Boolean(),
      digestiveSystem: t.Boolean(),
      nervousSystem: t.Boolean(),
      earCondition: t.Boolean(),
      checklistPatientData: t.Boolean(),
      checklistChiefComplaint: t.Boolean(),
      checklistSymptomDuration: t.Boolean(),
      checklistDiet: t.Boolean(),
      checklistVaccinations: t.Boolean(),
      checklistPreviousTreatments: t.Boolean(),
      checklistTemperature: t.Boolean(),
      checklistHeartRate: t.Boolean(),
      checklistBloodPressure: t.Boolean(),
      checklistHydration: t.Boolean(),
      checklistBehavior: t.Boolean(),
      checklistAppetite: t.Boolean(),
      checklistOxygen: t.Boolean(),
      checklistSkin: t.Boolean(),
      checklistSeverity: t.Boolean(),
      checklistAppearance: t.Boolean(),
      checklistRespiration: t.Boolean(),
      checklistDigestive: t.Boolean(),
      checklistNervous: t.Boolean(),
      checklistEar: t.Boolean(),
      checklistVomiting: t.Boolean(),
      checklistConsciousness: t.Boolean(),
      checklistDiagnosis: t.Boolean(),
      checklistUltrasound: t.Boolean(),
      checklistReferral: t.Boolean(),
      checklistXray: t.Boolean(),
      checklistFollowup: t.Boolean(),
      preliminaryDiagnosis: t.Boolean(),
      severity: t.Boolean(),
      diagnosisDescription: t.Boolean(),
      dietPlan: t.Boolean(),
      monitoringPlan: t.Boolean(),
      vaccinationReviewedAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      appointment: t.Boolean(),
      vitalsRecord: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ClinicalExamInclude = t.Partial(
  t.Object(
    {
      symptoms: t.Boolean(),
      urination: t.Boolean(),
      defecation: t.Boolean(),
      appetite: t.Boolean(),
      waterIntake: t.Boolean(),
      hydration: t.Boolean(),
      skinCondition: t.Boolean(),
      hairCondition: t.Boolean(),
      eyeCondition: t.Boolean(),
      boneCondition: t.Boolean(),
      respiratorySystem: t.Boolean(),
      digestiveSystem: t.Boolean(),
      nervousSystem: t.Boolean(),
      earCondition: t.Boolean(),
      severity: t.Boolean(),
      appointment: t.Boolean(),
      vitalsRecord: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ClinicalExamOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      appointmentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      startedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      completedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      currentStep: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      chiefComplaint: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      duration: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      presentIllnessHistory: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ownerNotes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      vitalsRecordId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      weight: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      temperature: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      heartRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      respiratoryRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      oxygenSaturation: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      bloodPressure: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      painScore: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      bodyConditionScore: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checklistPatientData: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checklistChiefComplaint: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checklistSymptomDuration: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checklistDiet: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checklistVaccinations: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checklistPreviousTreatments: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      checklistTemperature: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checklistHeartRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checklistBloodPressure: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checklistHydration: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checklistBehavior: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checklistAppetite: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checklistOxygen: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checklistSkin: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checklistSeverity: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checklistAppearance: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checklistRespiration: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checklistDigestive: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checklistNervous: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checklistEar: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checklistVomiting: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checklistConsciousness: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checklistDiagnosis: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checklistUltrasound: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checklistReferral: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checklistXray: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checklistFollowup: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      preliminaryDiagnosis: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      diagnosisDescription: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dietPlan: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      monitoringPlan: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      vaccinationReviewedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const ClinicalExam = t.Composite(
  [ClinicalExamPlain, ClinicalExamRelations],
  { additionalProperties: false },
);

export const ClinicalExamInputCreate = t.Composite(
  [ClinicalExamPlainInputCreate, ClinicalExamRelationsInputCreate],
  { additionalProperties: false },
);

export const ClinicalExamInputUpdate = t.Composite(
  [ClinicalExamPlainInputUpdate, ClinicalExamRelationsInputUpdate],
  { additionalProperties: false },
);
