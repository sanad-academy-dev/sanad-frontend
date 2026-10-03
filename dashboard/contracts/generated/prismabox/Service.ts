import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ServicePlain = t.Object(
  {
    id: t.String(),
    name: t.String(),
    level: t.Union(
      [t.Literal("CATEGORY"), t.Literal("SUBCATEGORY"), t.Literal("ITEM")],
      { additionalProperties: false },
    ),
    parentId: __nullable__(t.String()),
    isDefault: t.Boolean(),
    clinicId: __nullable__(t.String()),
    order: t.Integer(),
    isLabCategory: t.Boolean(),
    isRadiologyCategory: t.Boolean(),
    isOperationCategory: t.Boolean(),
    isGroomingCategory: t.Boolean(),
    consentCode: __nullable__(t.String()),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const ServiceRelations = t.Object(
  {
    parent: __nullable__(
      t.Object(
        {
          id: t.String(),
          name: t.String(),
          level: t.Union(
            [
              t.Literal("CATEGORY"),
              t.Literal("SUBCATEGORY"),
              t.Literal("ITEM"),
            ],
            { additionalProperties: false },
          ),
          parentId: __nullable__(t.String()),
          isDefault: t.Boolean(),
          clinicId: __nullable__(t.String()),
          order: t.Integer(),
          isLabCategory: t.Boolean(),
          isRadiologyCategory: t.Boolean(),
          isOperationCategory: t.Boolean(),
          isGroomingCategory: t.Boolean(),
          consentCode: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    children: t.Array(
      t.Object(
        {
          id: t.String(),
          name: t.String(),
          level: t.Union(
            [
              t.Literal("CATEGORY"),
              t.Literal("SUBCATEGORY"),
              t.Literal("ITEM"),
            ],
            { additionalProperties: false },
          ),
          parentId: __nullable__(t.String()),
          isDefault: t.Boolean(),
          clinicId: __nullable__(t.String()),
          order: t.Integer(),
          isLabCategory: t.Boolean(),
          isRadiologyCategory: t.Boolean(),
          isOperationCategory: t.Boolean(),
          isGroomingCategory: t.Boolean(),
          consentCode: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    membershipPlanBenefits: t.Array(
      t.Object(
        {
          id: t.String(),
          planId: t.String(),
          idx: t.Integer(),
          benefitType: t.Union(
            [
              t.Literal("SERVICE_DISCOUNT"),
              t.Literal("PRODUCT_DISCOUNT"),
              t.Literal("INCLUDED_UNITS"),
              t.Literal("PRIORITY_BOOKING"),
              t.Literal("PERK"),
            ],
            { additionalProperties: false },
          ),
          serviceId: __nullable__(t.String()),
          discountPercent: __nullable__(t.Number()),
          discountAmount: __nullable__(t.Number()),
          unitsPerPeriod: __nullable__(t.Integer()),
          labelAr: __nullable__(t.String()),
        },
        {
          additionalProperties: false,
          description: `صف ميزة — FR-M4.2. قاعدة BR-M4.2.1 (أي الحقول لأي نوع) تُفرَض في الموديل والخدمة؛
القاعدة العلائقية لا تستطيع التعبير عنها.`,
        },
      ),
      { additionalProperties: false },
    ),
    membershipBenefits: t.Array(
      t.Object(
        {
          id: t.String(),
          membershipId: t.String(),
          sourceBenefitId: __nullable__(t.String()),
          idx: t.Integer(),
          supersededAt: __nullable__(
            t.Date({
              description: `BR-M5.4.1: عند تدوير الفترة تُنشأ لقطات جديدة ويُختم القديم هنا بدل حذفه —
الحذف كان سيجرّ استحقاقات الفترات الماضية معه (cascade). null = اللقطة الحالية.`,
            }),
          ),
          benefitType: t.Union(
            [
              t.Literal("SERVICE_DISCOUNT"),
              t.Literal("PRODUCT_DISCOUNT"),
              t.Literal("INCLUDED_UNITS"),
              t.Literal("PRIORITY_BOOKING"),
              t.Literal("PERK"),
            ],
            { additionalProperties: false },
          ),
          serviceId: __nullable__(t.String()),
          discountPercent: __nullable__(t.Number()),
          discountAmount: __nullable__(t.Number()),
          unitsPerPeriod: __nullable__(t.Integer()),
          labelAr: __nullable__(t.String()),
        },
        {
          additionalProperties: false,
          description: `لقطة ميزة (AR-M2) — نسخة صفوف الخطة وقت التسجيل/التدوير. sourceBenefitId مرجع
معلوماتي فقط (لا FK — صف الخطة قد يُحذف باستبدال كامل ولا يجوز أن يجرّ اللقطة).`,
        },
      ),
      { additionalProperties: false },
    ),
    insuranceCoverageRows: t.Array(
      t.Object(
        {
          id: t.String(),
          productId: t.String(),
          idx: t.Integer(),
          serviceId: t.String(),
          coveragePercent: t.Number(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    clinic: __nullable__(
      t.Object(
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
    ),
    configs: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          serviceId: t.String(),
          price: __nullable__(t.Number()),
          duration: __nullable__(t.Integer()),
          isActive: t.Boolean(),
          itemTaxTemplateId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    usages: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          serviceId: t.String(),
          usedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    staffServices: t.Array(
      t.Object(
        {
          id: t.String(),
          staffId: t.String(),
          serviceId: t.String(),
          isActive: t.Boolean(),
          usageCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    appointments: t.Array(
      t.Object(
        {
          id: t.String(),
          appointmentId: t.String(),
          serviceId: t.String(),
          quantity: t.Integer(),
          priceSnapshot: t.Number(),
          durationSnapshot: t.Integer(),
          paidAt: __nullable__(t.Date()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    discounts: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          couponCode: t.String(),
          name: t.String(),
          type: t.Union([t.Literal("PERCENTAGE"), t.Literal("FIXED")], {
            additionalProperties: false,
          }),
          value: t.Number(),
          validFrom: __nullable__(t.Date()),
          validTo: __nullable__(t.Date()),
          usageLimit: t.Integer(),
          perCustomerLimit: t.Integer(),
          customerType: t.Union(
            [
              t.Literal("ALL"),
              t.Literal("VIP"),
              t.Literal("LOYALTY"),
              t.Literal("NEW"),
              t.Literal("CURRENT"),
            ],
            { additionalProperties: false },
          ),
          usedCount: t.Integer(),
          status: t.Union(
            [
              t.Literal("ACTIVE"),
              t.Literal("INACTIVE"),
              t.Literal("EXPIRED"),
              t.Literal("SCHEDULED"),
            ],
            { additionalProperties: false },
          ),
          notes: __nullable__(t.String()),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    carePlans: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          name: t.String(),
          serviceId: t.String(),
          animalTypeId: t.String(),
          animalStrainId: t.String(),
          notes: __nullable__(t.String()),
          visitDurationMins: __nullable__(t.Integer()),
          price: t.Number(),
          durationDays: t.Integer(),
          status: t.Union([t.Literal("ACTIVE"), t.Literal("INACTIVE")], {
            additionalProperties: false,
          }),
          usageCount: t.Integer(),
          subscribersCount: t.Integer(),
          ratingSum: t.Integer(),
          ratingCount: t.Integer(),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    carePlanVisits: t.Array(
      t.Object(
        {
          id: t.String(),
          carePlanId: t.String(),
          order: t.Integer(),
          serviceId: __nullable__(t.String()),
          consultationTypeId: __nullable__(t.String()),
          durationMins: __nullable__(t.Integer()),
          details: __nullable__(t.String()),
          intervalUnit: t.Union([t.Literal("DAY"), t.Literal("WEEK")], {
            additionalProperties: false,
          }),
          intervalValue: t.Integer(),
          vaccinationProtocolDoseId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    labParameters: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          serviceId: t.String(),
          section: __nullable__(t.String()),
          name: t.String(),
          unit: __nullable__(t.String()),
          type: t.Union([t.Literal("NUMERIC"), t.Literal("TEXT")], {
            additionalProperties: false,
          }),
          refLow: __nullable__(t.Number()),
          refHigh: __nullable__(t.Number()),
          order: t.Integer(),
          active: t.Boolean(),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    labTestItems: t.Array(
      t.Object(
        {
          id: t.String(),
          orderId: t.String(),
          serviceId: t.String(),
          priceSnapshot: t.Number(),
          status: t.Union(
            [
              t.Literal("QUEUE"),
              t.Literal("SCHEDULED"),
              t.Literal("SAMPLE_COLLECTION"),
              t.Literal("IN_LAB"),
              t.Literal("UNDER_REVIEW"),
              t.Literal("COMPLETED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          sampleStage: t.Union(
            [
              t.Literal("NOT_COLLECTED"),
              t.Literal("COLLECTED"),
              t.Literal("QUALITY_CHECK"),
              t.Literal("LABEL_PRINT"),
              t.Literal("ANALYZER_ASSIGNMENT"),
              t.Literal("HANDOVER_SUMMARY"),
              t.Literal("ANALYZING"),
              t.Literal("RESULTS_READY"),
            ],
            { additionalProperties: false },
          ),
          assignedToId: __nullable__(t.String()),
          scheduledAt: __nullable__(t.Date()),
          report: __nullable__(t.String()),
          reviewedById: __nullable__(t.String()),
          reviewedAt: __nullable__(t.Date()),
          rejectedById: __nullable__(t.String()),
          rejectedAt: __nullable__(t.Date()),
          rejectionReason: __nullable__(t.String()),
          completedAt: __nullable__(t.Date()),
          paidAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    radiologyDefinitions: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          serviceId: t.String(),
          modality: t.Union(
            [
              t.Literal("XRAY"),
              t.Literal("CT"),
              t.Literal("MRI"),
              t.Literal("ULTRASOUND"),
              t.Literal("FLUOROSCOPY"),
              t.Literal("MAMMOGRAPHY"),
              t.Literal("NUCLEAR"),
              t.Literal("PET"),
              t.Literal("DENTAL"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          bodyPart: __nullable__(t.String()),
          defaultViews: t.Array(t.String(), { additionalProperties: false }),
          lateralityRequired: t.Boolean(),
          contrastDefault: t.Boolean(),
          sedationDefault: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("ANXIOLYSIS"),
              t.Literal("SEDATION"),
              t.Literal("GENERAL_ANESTHESIA"),
            ],
            { additionalProperties: false },
          ),
          prepNotes: __nullable__(t.String()),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    radiologyReportTemplates: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          name: t.String(),
          modality: __nullable__(
            t.Union(
              [
                t.Literal("XRAY"),
                t.Literal("CT"),
                t.Literal("MRI"),
                t.Literal("ULTRASOUND"),
                t.Literal("FLUOROSCOPY"),
                t.Literal("MAMMOGRAPHY"),
                t.Literal("NUCLEAR"),
                t.Literal("PET"),
                t.Literal("DENTAL"),
                t.Literal("OTHER"),
              ],
              { additionalProperties: false },
            ),
          ),
          serviceId: __nullable__(t.String()),
          technique: __nullable__(t.String()),
          comparison: __nullable__(t.String()),
          findings: __nullable__(t.String()),
          impression: __nullable__(t.String()),
          recommendations: __nullable__(t.String()),
          isDefault: t.Boolean({
            description: `القالب الافتراضي يُقترح تلقائيًا عند فتح محرّر تقرير مطابق`,
          }),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `قالب تقرير جاهز — يملأ أقسام التقرير بنقرة بدل إعادة كتابة النص الطبيعي
في كل فحص. يُربط بخدمة بعينها أو بطريقة تصوير كاملة (serviceId فارغ).`,
        },
      ),
      { additionalProperties: false },
    ),
    radiologyItems: t.Array(
      t.Object(
        {
          id: t.String(),
          orderId: t.String(),
          serviceId: t.String(),
          accession: t.String(),
          priceSnapshot: t.Number(),
          status: t.Union(
            [
              t.Literal("QUEUE"),
              t.Literal("SCHEDULED"),
              t.Literal("PREPARATION"),
              t.Literal("IMAGING"),
              t.Literal("REPORTING"),
              t.Literal("UNDER_REVIEW"),
              t.Literal("COMPLETED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          stage: t.Union(
            [
              t.Literal("SAFETY_SCREENING"),
              t.Literal("PATIENT_PREP"),
              t.Literal("ROOM_ASSIGNMENT"),
              t.Literal("READY_CHECK"),
              t.Literal("ACQUISITION"),
              t.Literal("IMAGE_UPLOAD"),
              t.Literal("IMAGE_QC"),
            ],
            { additionalProperties: false },
          ),
          modality: t.Union(
            [
              t.Literal("XRAY"),
              t.Literal("CT"),
              t.Literal("MRI"),
              t.Literal("ULTRASOUND"),
              t.Literal("FLUOROSCOPY"),
              t.Literal("MAMMOGRAPHY"),
              t.Literal("NUCLEAR"),
              t.Literal("PET"),
              t.Literal("DENTAL"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          bodyPart: __nullable__(t.String()),
          laterality: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("LEFT"),
              t.Literal("RIGHT"),
              t.Literal("BILATERAL"),
            ],
            { additionalProperties: false },
          ),
          views: t.Array(t.String(), { additionalProperties: false }),
          withContrast: t.Boolean(),
          assignedToId: __nullable__(t.String()),
          scheduledAt: __nullable__(t.Date()),
          reviewedById: __nullable__(t.String()),
          reviewedAt: __nullable__(t.Date()),
          rejectedById: __nullable__(t.String()),
          rejectedAt: __nullable__(t.Date()),
          rejectionReason: __nullable__(t.String()),
          completedAt: __nullable__(t.Date()),
          paidAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    operationDefinitions: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          serviceId: t.String(),
          defaultTier: t.Union(
            [t.Literal("MINOR"), t.Literal("INTERMEDIATE"), t.Literal("MAJOR")],
            { additionalProperties: false },
          ),
          defaultAnesthesia: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("ANXIOLYSIS"),
              t.Literal("SEDATION"),
              t.Literal("GENERAL_ANESTHESIA"),
            ],
            { additionalProperties: false },
          ),
          defaultWoundClass: __nullable__(
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
          requiresLaterality: t.Boolean(),
          bodySystem: __nullable__(t.String()),
          codes: __nullable__(t.Any()),
          specializationId: __nullable__(t.String()),
          prepNotes: __nullable__(t.String()),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    operationItems: t.Array(
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
    sopTemplates: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: __nullable__(t.String()),
          domain: t.Union(
            [t.Literal("LAB"), t.Literal("RADIOLOGY"), t.Literal("OPERATION")],
            { additionalProperties: false },
          ),
          serviceId: t.String(),
          titleAr: t.String(),
          titleEn: __nullable__(t.String()),
          reference: __nullable__(t.String()),
          version: t.Integer(),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    groomingDefinitions: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          serviceId: t.String(),
          kind: t.Union(
            [
              t.Literal("BATH"),
              t.Literal("FULL_GROOM"),
              t.Literal("TIDY_UP"),
              t.Literal("DESHED"),
              t.Literal("NAIL_TRIM"),
              t.Literal("EAR_CLEAN"),
              t.Literal("ANAL_GLANDS"),
              t.Literal("TEETH_BRUSH"),
              t.Literal("DEMATTING"),
              t.Literal("SHAVE_DOWN"),
              t.Literal("MEDICATED_BATH"),
              t.Literal("PARASITE_DIP"),
              t.Literal("WOUND_CARE_CLIP"),
              t.Literal("SPA_ADDON"),
              t.Literal("OTHER"),
            ],
            {
              additionalProperties: false,
              description: `نوع خدمة التجميل — يقود الأيقونة والافتراضات لا المنطق.`,
            },
          ),
          lane: t.Union([t.Literal("COSMETIC"), t.Literal("MEDICAL")], {
            additionalProperties: false,
            description: `مسار الجلسة — تجميلي أم طبي. يقرّر أي البوابات إلزامية وأي اللوحات تظهر (§3).`,
          }),
          requiresVetOrder: t.Boolean(),
          isAddOn: t.Boolean(),
          basePrice: t.Number(),
          baseDurationMin: t.Integer(),
          dryingMinutes: t.Integer(),
          speciesScope: t.Array(t.String(), { additionalProperties: false }),
          requiresStation: t.Boolean(),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `تعريف خدمة تجميل — طبقة فوق عقدة ITEM في شجرة الخدمات، تمامًا كما يفعل
OperationProcedureDefinition. الشجرة تبقى عمود التسعير والصلاحيات، والجدول
هنا يحمل دلالات المجال.`,
        },
      ),
      { additionalProperties: false },
    ),
    mobileCatalogEntries: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          serviceId: t.String(),
          price: __nullable__(t.Number()),
          duration: __nullable__(t.Integer()),
          isActive: t.Boolean(),
          notes: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[MC10.1] سجلّ الخدمات المسموح بها للعيادة المتنقلة — لكل عيادة على حدة.
لماذا جدول مستقلّ لا علَمٌ على \`ClinicServiceConfig\`؟ لأنّ الخدمة نفسها تُسعَّر وتستغرق
وقتًا مختلفًا في الموقع عنها في العيادة: الانتقال والتجهيز الميداني يرفعان الكلفة
والمدّة. علَمٌ واحد كان سيفرض سعرًا واحدًا على القناتين، وفصلهما لاحقًا يعني ترحيلًا
وتصحيح بيانات تاريخية.
\`price\`/\`duration\` فارغتان تعنيان «خذ ما في \`ClinicServiceConfig\`» — لا صفرًا. الفارق
جوهري: «بلا سعر خاصّ» ليست «مجّانًا».`,
        },
      ),
      { additionalProperties: false },
    ),
    mobileUnitServices: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          mobileUnitId: t.String(),
          serviceId: t.String(),
          price: __nullable__(
            t.Number({
              description: `تجاوز سعر الكتالوج لهذه المركبة تحديدًا؛ null ⇒ سعر الكتالوج`,
            }),
          ),
          duration: __nullable__(
            t.Integer({
              description: `تجاوز المدّة بالدقائق؛ null ⇒ مدّة الكتالوج`,
            }),
          ),
          isActive: t.Boolean(),
          notes: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[MC10.2] ما نُفِّذ فعلًا في الزيارة المتنقلة — سجلّ ميداني مستقلّ عن
\`AppointmentService\`.
لماذا لا يكفي \`AppointmentService\`؟ لأنّه يجيب عن سؤال «بماذا حُجزت الزيارة؟» لا عن
«ماذا جرى في الموقع؟». الفرق بينهما هو عمل الطاقم: خدمة تُلغى لأنّ الحيوان لم يحتجها،
وأخرى تُضاف لأنّ المالك طلبها عند الباب. دمج الاثنين في جدول واحد يمحو هذا الفرق —
ومعه القدرة على مراجعة ما فعله السائق أو تسعير عمل المركبة على حدة.
السطور تُزامَن إلى \`AppointmentService\` عند COMPLETED فتركب الفاتورة والترحيل
المحاسبي كما هي — سجلٌّ منفصل لا مسار فوترة ثانٍ.
ما تستطيع **هذه المركبة** تقديمه من كتالوج العيادة المتنقلة.
طبقةٌ فوق \`MobileServiceCatalog\` لا بديلٌ عنه، والسبب أن الكتالوج يجيب سؤالين
لا مركبة فيهما أصلًا: نموذج الحجز العام يعرض الخدمات قبل إسناد أي مركبة، وتحويل
طلب إلى زيارة قد يجري بلا مركبة (مسار \`PENDING\` الذي يقوم عليه العرض والالتقاط).
فلو صار الكتالوج نفسه لكل مركبة لما بقي مصدرٌ للسعر في هاتين الحالتين.
**غياب الصفوف يعني السماح بالكل.** مركبةٌ بلا قائمة تقدّم كل ما في كتالوج العيادة —
فالتقييد قرار يُتخذ لا حالة افتراضية، ولا تفقد مركبة قائمة قدرتها يوم الترحيل.`,
        },
      ),
      { additionalProperties: false },
    ),
    mobileVisitServices: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          mobileVisitId: t.String(),
          serviceId: t.String(),
          quantity: t.Integer(),
          priceSnapshot: t.Number(),
          durationSnapshot: t.Integer(),
          source: t.Union([t.Literal("SCHEDULED"), t.Literal("FIELD")], {
            additionalProperties: false,
            description: `من أين جاء سطر الخدمة: كان على الموعد قبل الانطلاق، أم أضافه الطاقم في الموقع.
التمييز هو ما يجعل تقرير «ما زاد عن المجدول» ممكنًا أصلًا.`,
          }),
          performedAt: t.Date(),
          performedByStaffId: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    inpatientDailyRates: t.Array(
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

export const ServicePlainInputCreate = t.Object(
  {
    name: t.String(),
    level: t.Union(
      [t.Literal("CATEGORY"), t.Literal("SUBCATEGORY"), t.Literal("ITEM")],
      { additionalProperties: false },
    ),
    isDefault: t.Optional(t.Boolean()),
    order: t.Optional(t.Integer()),
    isLabCategory: t.Optional(t.Boolean()),
    isRadiologyCategory: t.Optional(t.Boolean()),
    isOperationCategory: t.Optional(t.Boolean()),
    isGroomingCategory: t.Optional(t.Boolean()),
    consentCode: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const ServicePlainInputUpdate = t.Object(
  {
    name: t.Optional(t.String()),
    level: t.Optional(
      t.Union(
        [t.Literal("CATEGORY"), t.Literal("SUBCATEGORY"), t.Literal("ITEM")],
        { additionalProperties: false },
      ),
    ),
    isDefault: t.Optional(t.Boolean()),
    order: t.Optional(t.Integer()),
    isLabCategory: t.Optional(t.Boolean()),
    isRadiologyCategory: t.Optional(t.Boolean()),
    isOperationCategory: t.Optional(t.Boolean()),
    isGroomingCategory: t.Optional(t.Boolean()),
    consentCode: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const ServiceRelationsInputCreate = t.Object(
  {
    parent: t.Optional(
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
    children: t.Optional(
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
    membershipPlanBenefits: t.Optional(
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
    membershipBenefits: t.Optional(
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
    insuranceCoverageRows: t.Optional(
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
    clinic: t.Optional(
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
    configs: t.Optional(
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
    usages: t.Optional(
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
    staffServices: t.Optional(
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
    appointments: t.Optional(
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
    discounts: t.Optional(
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
    carePlans: t.Optional(
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
    carePlanVisits: t.Optional(
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
    labParameters: t.Optional(
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
    labTestItems: t.Optional(
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
    radiologyDefinitions: t.Optional(
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
    radiologyReportTemplates: t.Optional(
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
    radiologyItems: t.Optional(
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
    operationDefinitions: t.Optional(
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
    operationItems: t.Optional(
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
    sopTemplates: t.Optional(
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
    groomingDefinitions: t.Optional(
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
    mobileCatalogEntries: t.Optional(
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
    mobileUnitServices: t.Optional(
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
    mobileVisitServices: t.Optional(
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
    inpatientDailyRates: t.Optional(
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

export const ServiceRelationsInputUpdate = t.Partial(
  t.Object(
    {
      parent: t.Partial(
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
      children: t.Partial(
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
      membershipPlanBenefits: t.Partial(
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
      membershipBenefits: t.Partial(
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
      insuranceCoverageRows: t.Partial(
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
      clinic: t.Partial(
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
      configs: t.Partial(
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
      usages: t.Partial(
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
      staffServices: t.Partial(
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
      appointments: t.Partial(
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
      discounts: t.Partial(
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
      carePlans: t.Partial(
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
      carePlanVisits: t.Partial(
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
      labParameters: t.Partial(
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
      labTestItems: t.Partial(
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
      radiologyDefinitions: t.Partial(
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
      radiologyReportTemplates: t.Partial(
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
      radiologyItems: t.Partial(
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
      operationDefinitions: t.Partial(
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
      operationItems: t.Partial(
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
      sopTemplates: t.Partial(
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
      groomingDefinitions: t.Partial(
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
      mobileCatalogEntries: t.Partial(
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
      mobileUnitServices: t.Partial(
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
      mobileVisitServices: t.Partial(
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
      inpatientDailyRates: t.Partial(
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

export const ServiceWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          name: t.String(),
          level: t.Union(
            [
              t.Literal("CATEGORY"),
              t.Literal("SUBCATEGORY"),
              t.Literal("ITEM"),
            ],
            { additionalProperties: false },
          ),
          parentId: t.String(),
          isDefault: t.Boolean(),
          clinicId: t.String(),
          order: t.Integer(),
          isLabCategory: t.Boolean(),
          isRadiologyCategory: t.Boolean(),
          isOperationCategory: t.Boolean(),
          isGroomingCategory: t.Boolean(),
          consentCode: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Service" },
  ),
);

export const ServiceWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object({ id: t.String() }, { additionalProperties: false }),
          { additionalProperties: false },
        ),
        t.Union([t.Object({ id: t.String() })], {
          additionalProperties: false,
        }),
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
              name: t.String(),
              level: t.Union(
                [
                  t.Literal("CATEGORY"),
                  t.Literal("SUBCATEGORY"),
                  t.Literal("ITEM"),
                ],
                { additionalProperties: false },
              ),
              parentId: t.String(),
              isDefault: t.Boolean(),
              clinicId: t.String(),
              order: t.Integer(),
              isLabCategory: t.Boolean(),
              isRadiologyCategory: t.Boolean(),
              isOperationCategory: t.Boolean(),
              isGroomingCategory: t.Boolean(),
              consentCode: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Service" },
);

export const ServiceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      name: t.Boolean(),
      level: t.Boolean(),
      parentId: t.Boolean(),
      isDefault: t.Boolean(),
      clinicId: t.Boolean(),
      order: t.Boolean(),
      isLabCategory: t.Boolean(),
      isRadiologyCategory: t.Boolean(),
      isOperationCategory: t.Boolean(),
      isGroomingCategory: t.Boolean(),
      consentCode: t.Boolean(),
      createdAt: t.Boolean(),
      parent: t.Boolean(),
      children: t.Boolean(),
      membershipPlanBenefits: t.Boolean(),
      membershipBenefits: t.Boolean(),
      insuranceCoverageRows: t.Boolean(),
      clinic: t.Boolean(),
      configs: t.Boolean(),
      usages: t.Boolean(),
      staffServices: t.Boolean(),
      appointments: t.Boolean(),
      discounts: t.Boolean(),
      carePlans: t.Boolean(),
      carePlanVisits: t.Boolean(),
      labParameters: t.Boolean(),
      labTestItems: t.Boolean(),
      radiologyDefinitions: t.Boolean(),
      radiologyReportTemplates: t.Boolean(),
      radiologyItems: t.Boolean(),
      operationDefinitions: t.Boolean(),
      operationItems: t.Boolean(),
      sopTemplates: t.Boolean(),
      groomingDefinitions: t.Boolean(),
      mobileCatalogEntries: t.Boolean(),
      mobileUnitServices: t.Boolean(),
      mobileVisitServices: t.Boolean(),
      inpatientDailyRates: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ServiceInclude = t.Partial(
  t.Object(
    {
      level: t.Boolean(),
      parent: t.Boolean(),
      children: t.Boolean(),
      membershipPlanBenefits: t.Boolean(),
      membershipBenefits: t.Boolean(),
      insuranceCoverageRows: t.Boolean(),
      clinic: t.Boolean(),
      configs: t.Boolean(),
      usages: t.Boolean(),
      staffServices: t.Boolean(),
      appointments: t.Boolean(),
      discounts: t.Boolean(),
      carePlans: t.Boolean(),
      carePlanVisits: t.Boolean(),
      labParameters: t.Boolean(),
      labTestItems: t.Boolean(),
      radiologyDefinitions: t.Boolean(),
      radiologyReportTemplates: t.Boolean(),
      radiologyItems: t.Boolean(),
      operationDefinitions: t.Boolean(),
      operationItems: t.Boolean(),
      sopTemplates: t.Boolean(),
      groomingDefinitions: t.Boolean(),
      mobileCatalogEntries: t.Boolean(),
      mobileUnitServices: t.Boolean(),
      mobileVisitServices: t.Boolean(),
      inpatientDailyRates: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ServiceOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      parentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDefault: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      order: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isLabCategory: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isRadiologyCategory: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isOperationCategory: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isGroomingCategory: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      consentCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Service = t.Composite([ServicePlain, ServiceRelations], {
  additionalProperties: false,
});

export const ServiceInputCreate = t.Composite(
  [ServicePlainInputCreate, ServiceRelationsInputCreate],
  { additionalProperties: false },
);

export const ServiceInputUpdate = t.Composite(
  [ServicePlainInputUpdate, ServiceRelationsInputUpdate],
  { additionalProperties: false },
);
