import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const VaccinationRecordPlain = t.Object(
  {
    id: t.String(),
    code: t.String(),
    clinicId: t.String(),
    patientId: t.String(),
    vaccineId: t.String(),
    appointmentId: __nullable__(t.String()),
    branchId: __nullable__(t.String()),
    administeredById: __nullable__(t.String()),
    administeredAt: t.Date(),
    doseNumber: t.Integer(),
    doseKind: t.Union(
      [
        t.Literal("PRIMARY"),
        t.Literal("BOOSTER"),
        t.Literal("ANNUAL"),
        t.Literal("CATCH_UP"),
      ],
      { additionalProperties: false },
    ),
    route: t.Union(
      [
        t.Literal("SUBCUTANEOUS"),
        t.Literal("INTRAMUSCULAR"),
        t.Literal("INTRANASAL"),
        t.Literal("ORAL"),
        t.Literal("INTRADERMAL"),
        t.Literal("TOPICAL"),
        t.Literal("OTHER"),
      ],
      { additionalProperties: false },
    ),
    site: __nullable__(
      t.Union(
        [
          t.Literal("LEFT_SHOULDER"),
          t.Literal("RIGHT_SHOULDER"),
          t.Literal("LEFT_HIND_LIMB"),
          t.Literal("RIGHT_HIND_LIMB"),
          t.Literal("INTERSCAPULAR"),
          t.Literal("LEFT_FLANK"),
          t.Literal("RIGHT_FLANK"),
          t.Literal("NASAL"),
          t.Literal("ORAL"),
          t.Literal("OTHER"),
        ],
        { additionalProperties: false },
      ),
    ),
    doseVolumeMl: __nullable__(t.Number()),
    batchId: __nullable__(t.String()),
    batchNo: __nullable__(t.String()),
    batchExpiryDate: __nullable__(t.Date()),
    inventoryItemId: __nullable__(t.String()),
    warehouseId: __nullable__(t.String()),
    vaccineNameSnapshot: t.String(),
    manufacturerSnapshot: __nullable__(t.String()),
    adverseReaction: t.Union(
      [
        t.Literal("NONE"),
        t.Literal("MILD"),
        t.Literal("MODERATE"),
        t.Literal("SEVERE"),
        t.Literal("ANAPHYLACTIC"),
      ],
      { additionalProperties: false },
    ),
    adverseReactionNotes: __nullable__(t.String()),
    notes: __nullable__(t.String()),
    immunityOnsetDaysSnapshot: __nullable__(t.Integer()),
    protectiveFromAt: __nullable__(t.Date()),
    boosterIntervalDaysSnapshot: __nullable__(t.Integer()),
    protectiveUntilAt: __nullable__(t.Date()),
    nextDueAt: __nullable__(t.Date()),
    protocolDoseId: __nullable__(t.String()),
    carePlanEnrollmentVisitId: __nullable__(t.String()),
    isVoided: t.Boolean(),
    voidedAt: __nullable__(t.Date()),
    voidedById: __nullable__(t.String()),
    voidReason: __nullable__(t.String()),
    createdById: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const VaccinationRecordRelations = t.Object(
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
    vaccine: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        name: t.String(),
        nameEn: __nullable__(t.String()),
        kind: t.Union(
          [
            t.Literal("MODIFIED_LIVE"),
            t.Literal("KILLED"),
            t.Literal("RECOMBINANT"),
            t.Literal("TOXOID"),
            t.Literal("SUBUNIT"),
            t.Literal("OTHER"),
          ],
          { additionalProperties: false },
        ),
        manufacturerName: __nullable__(t.String()),
        catalogProductId: __nullable__(t.String()),
        inventoryItemId: __nullable__(t.String()),
        primarySeriesDoses: t.Integer(),
        primarySeriesIntervalDays: __nullable__(t.Integer()),
        boosterIntervalDays: __nullable__(t.Integer()),
        immunityOnsetDays: t.Integer(),
        defaultRoute: t.Union(
          [
            t.Literal("SUBCUTANEOUS"),
            t.Literal("INTRAMUSCULAR"),
            t.Literal("INTRANASAL"),
            t.Literal("ORAL"),
            t.Literal("INTRADERMAL"),
            t.Literal("TOPICAL"),
            t.Literal("OTHER"),
          ],
          { additionalProperties: false },
        ),
        defaultSite: __nullable__(
          t.Union(
            [
              t.Literal("LEFT_SHOULDER"),
              t.Literal("RIGHT_SHOULDER"),
              t.Literal("LEFT_HIND_LIMB"),
              t.Literal("RIGHT_HIND_LIMB"),
              t.Literal("INTERSCAPULAR"),
              t.Literal("LEFT_FLANK"),
              t.Literal("RIGHT_FLANK"),
              t.Literal("NASAL"),
              t.Literal("ORAL"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
        ),
        defaultDoseVolumeMl: __nullable__(t.Number()),
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
    branch: __nullable__(
      t.Object(
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
    ),
    administeredBy: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          userId: __nullable__(t.String()),
          roleId: t.String(),
          branchId: t.String(),
          name: t.String(),
          gender: __nullable__(
            t.Union(
              [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
              { additionalProperties: false },
            ),
          ),
          prefix: __nullable__(
            t.Union(
              [
                t.Literal("MR"),
                t.Literal("MRS"),
                t.Literal("MS"),
                t.Literal("DR"),
                t.Literal("PROF"),
              ],
              { additionalProperties: false },
            ),
          ),
          age: __nullable__(t.Integer()),
          licenseNumber: __nullable__(t.String()),
          email: t.String(),
          phone: __nullable__(t.String()),
          country: __nullable__(t.String()),
          city: __nullable__(t.String()),
          address: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          bio: __nullable__(t.String()),
          educationalQualification: __nullable__(t.String()),
          nationality: __nullable__(t.String()),
          avatar: __nullable__(t.String()),
          primarySpecializationId: __nullable__(t.String()),
          secondarySpecializationId: __nullable__(t.String()),
          employmentType: __nullable__(
            t.Union([t.Literal("FULL_TIME"), t.Literal("PART_TIME")], {
              additionalProperties: false,
            }),
          ),
          hireDate: __nullable__(t.Date()),
          isSaudi: t.Boolean(),
          status: t.Union(
            [t.Literal("PENDING"), t.Literal("ACTIVE"), t.Literal("INACTIVE")],
            { additionalProperties: false },
          ),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    batch: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          itemId: t.String(),
          warehouseId: t.String(),
          batchNo: t.String(),
          expiryDate: __nullable__(t.Date()),
          productionDate: __nullable__(t.Date()),
          qty: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    inventoryItem: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          name: t.String(),
          category: t.Union(
            [
              t.Literal("ANTIBIOTIC"),
              t.Literal("ANTI_INFLAMMATORY"),
              t.Literal("VACCINE"),
              t.Literal("HORMONE"),
              t.Literal("SUPPLEMENT"),
              t.Literal("CRUSTACEAN"),
              t.Literal("SURGICAL_TOOLS"),
              t.Literal("SUPPLIES"),
            ],
            { additionalProperties: false },
          ),
          stock: t.Integer(),
          reorderPoint: t.Integer(),
          productionDate: __nullable__(t.Date()),
          expiryDate: __nullable__(t.Date()),
          price: t.Number(),
          unitCost: __nullable__(t.Number()),
          valuationRate: t.Number(),
          maxQuantity: __nullable__(t.Integer()),
          sku: __nullable__(t.String()),
          barcode: __nullable__(t.String()),
          supplier: __nullable__(t.String()),
          location: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          tracksBatches: t.Boolean(),
          itemTaxTemplateId: __nullable__(t.String()),
          catalogProductId: __nullable__(t.String()),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    protocolDose: __nullable__(
      t.Object(
        {
          id: t.String(),
          protocolId: t.String(),
          order: t.Integer(),
          antigenCode: t.String(),
          label: t.String(),
          kind: t.Union(
            [
              t.Literal("PRIMARY"),
              t.Literal("BOOSTER"),
              t.Literal("ANNUAL"),
              t.Literal("CATCH_UP"),
            ],
            { additionalProperties: false },
          ),
          ageWeeksMin: __nullable__(t.Integer()),
          ageWeeksMax: __nullable__(t.Integer()),
          intervalDaysFromPrev: __nullable__(t.Integer()),
          boosterIntervalDays: __nullable__(t.Integer()),
          notes: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    carePlanEnrollmentVisit: __nullable__(
      t.Object(
        {
          id: t.String(),
          enrollmentId: t.String(),
          order: t.Integer(),
          serviceId: __nullable__(t.String()),
          serviceName: t.String(),
          consultationTypeId: __nullable__(t.String()),
          consultationTypeName: __nullable__(t.String()),
          scheduledAt: t.Date(),
          status: t.Union(
            [
              t.Literal("PENDING"),
              t.Literal("COMPLETED"),
              t.Literal("SKIPPED"),
            ],
            { additionalProperties: false },
          ),
          completedAt: __nullable__(t.Date()),
          appointmentId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    createdBy: __nullable__(
      t.Object(
        {
          id: t.String(),
          name: t.String(),
          email: t.String(),
          emailVerified: t.Boolean(),
          image: __nullable__(t.String()),
          phone: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    voidedBy: __nullable__(
      t.Object(
        {
          id: t.String(),
          name: t.String(),
          email: t.String(),
          emailVerified: t.Boolean(),
          image: __nullable__(t.String()),
          phone: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const VaccinationRecordPlainInputCreate = t.Object(
  {
    code: t.String(),
    administeredAt: t.Date(),
    doseNumber: t.Optional(t.Integer()),
    doseKind: t.Optional(
      t.Union(
        [
          t.Literal("PRIMARY"),
          t.Literal("BOOSTER"),
          t.Literal("ANNUAL"),
          t.Literal("CATCH_UP"),
        ],
        { additionalProperties: false },
      ),
    ),
    route: t.Union(
      [
        t.Literal("SUBCUTANEOUS"),
        t.Literal("INTRAMUSCULAR"),
        t.Literal("INTRANASAL"),
        t.Literal("ORAL"),
        t.Literal("INTRADERMAL"),
        t.Literal("TOPICAL"),
        t.Literal("OTHER"),
      ],
      { additionalProperties: false },
    ),
    site: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("LEFT_SHOULDER"),
            t.Literal("RIGHT_SHOULDER"),
            t.Literal("LEFT_HIND_LIMB"),
            t.Literal("RIGHT_HIND_LIMB"),
            t.Literal("INTERSCAPULAR"),
            t.Literal("LEFT_FLANK"),
            t.Literal("RIGHT_FLANK"),
            t.Literal("NASAL"),
            t.Literal("ORAL"),
            t.Literal("OTHER"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    doseVolumeMl: t.Optional(__nullable__(t.Number())),
    batchNo: t.Optional(__nullable__(t.String())),
    batchExpiryDate: t.Optional(__nullable__(t.Date())),
    vaccineNameSnapshot: t.String(),
    manufacturerSnapshot: t.Optional(__nullable__(t.String())),
    adverseReaction: t.Optional(
      t.Union(
        [
          t.Literal("NONE"),
          t.Literal("MILD"),
          t.Literal("MODERATE"),
          t.Literal("SEVERE"),
          t.Literal("ANAPHYLACTIC"),
        ],
        { additionalProperties: false },
      ),
    ),
    adverseReactionNotes: t.Optional(__nullable__(t.String())),
    notes: t.Optional(__nullable__(t.String())),
    immunityOnsetDaysSnapshot: t.Optional(__nullable__(t.Integer())),
    protectiveFromAt: t.Optional(__nullable__(t.Date())),
    boosterIntervalDaysSnapshot: t.Optional(__nullable__(t.Integer())),
    protectiveUntilAt: t.Optional(__nullable__(t.Date())),
    nextDueAt: t.Optional(__nullable__(t.Date())),
    isVoided: t.Optional(t.Boolean()),
    voidedAt: t.Optional(__nullable__(t.Date())),
    voidReason: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const VaccinationRecordPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    administeredAt: t.Optional(t.Date()),
    doseNumber: t.Optional(t.Integer()),
    doseKind: t.Optional(
      t.Union(
        [
          t.Literal("PRIMARY"),
          t.Literal("BOOSTER"),
          t.Literal("ANNUAL"),
          t.Literal("CATCH_UP"),
        ],
        { additionalProperties: false },
      ),
    ),
    route: t.Optional(
      t.Union(
        [
          t.Literal("SUBCUTANEOUS"),
          t.Literal("INTRAMUSCULAR"),
          t.Literal("INTRANASAL"),
          t.Literal("ORAL"),
          t.Literal("INTRADERMAL"),
          t.Literal("TOPICAL"),
          t.Literal("OTHER"),
        ],
        { additionalProperties: false },
      ),
    ),
    site: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("LEFT_SHOULDER"),
            t.Literal("RIGHT_SHOULDER"),
            t.Literal("LEFT_HIND_LIMB"),
            t.Literal("RIGHT_HIND_LIMB"),
            t.Literal("INTERSCAPULAR"),
            t.Literal("LEFT_FLANK"),
            t.Literal("RIGHT_FLANK"),
            t.Literal("NASAL"),
            t.Literal("ORAL"),
            t.Literal("OTHER"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    doseVolumeMl: t.Optional(__nullable__(t.Number())),
    batchNo: t.Optional(__nullable__(t.String())),
    batchExpiryDate: t.Optional(__nullable__(t.Date())),
    vaccineNameSnapshot: t.Optional(t.String()),
    manufacturerSnapshot: t.Optional(__nullable__(t.String())),
    adverseReaction: t.Optional(
      t.Union(
        [
          t.Literal("NONE"),
          t.Literal("MILD"),
          t.Literal("MODERATE"),
          t.Literal("SEVERE"),
          t.Literal("ANAPHYLACTIC"),
        ],
        { additionalProperties: false },
      ),
    ),
    adverseReactionNotes: t.Optional(__nullable__(t.String())),
    notes: t.Optional(__nullable__(t.String())),
    immunityOnsetDaysSnapshot: t.Optional(__nullable__(t.Integer())),
    protectiveFromAt: t.Optional(__nullable__(t.Date())),
    boosterIntervalDaysSnapshot: t.Optional(__nullable__(t.Integer())),
    protectiveUntilAt: t.Optional(__nullable__(t.Date())),
    nextDueAt: t.Optional(__nullable__(t.Date())),
    isVoided: t.Optional(t.Boolean()),
    voidedAt: t.Optional(__nullable__(t.Date())),
    voidReason: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const VaccinationRecordRelationsInputCreate = t.Object(
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
    vaccine: t.Object(
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
    branch: t.Optional(
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
    administeredBy: t.Optional(
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
    batch: t.Optional(
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
    inventoryItem: t.Optional(
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
    protocolDose: t.Optional(
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
    carePlanEnrollmentVisit: t.Optional(
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
    createdBy: t.Optional(
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
    voidedBy: t.Optional(
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

export const VaccinationRecordRelationsInputUpdate = t.Partial(
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
      vaccine: t.Object(
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
      branch: t.Partial(
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
      administeredBy: t.Partial(
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
      batch: t.Partial(
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
      inventoryItem: t.Partial(
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
      protocolDose: t.Partial(
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
      carePlanEnrollmentVisit: t.Partial(
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
      createdBy: t.Partial(
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
      voidedBy: t.Partial(
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

export const VaccinationRecordWhere = t.Partial(
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
          patientId: t.String(),
          vaccineId: t.String(),
          appointmentId: t.String(),
          branchId: t.String(),
          administeredById: t.String(),
          administeredAt: t.Date(),
          doseNumber: t.Integer(),
          doseKind: t.Union(
            [
              t.Literal("PRIMARY"),
              t.Literal("BOOSTER"),
              t.Literal("ANNUAL"),
              t.Literal("CATCH_UP"),
            ],
            { additionalProperties: false },
          ),
          route: t.Union(
            [
              t.Literal("SUBCUTANEOUS"),
              t.Literal("INTRAMUSCULAR"),
              t.Literal("INTRANASAL"),
              t.Literal("ORAL"),
              t.Literal("INTRADERMAL"),
              t.Literal("TOPICAL"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          site: t.Union(
            [
              t.Literal("LEFT_SHOULDER"),
              t.Literal("RIGHT_SHOULDER"),
              t.Literal("LEFT_HIND_LIMB"),
              t.Literal("RIGHT_HIND_LIMB"),
              t.Literal("INTERSCAPULAR"),
              t.Literal("LEFT_FLANK"),
              t.Literal("RIGHT_FLANK"),
              t.Literal("NASAL"),
              t.Literal("ORAL"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          doseVolumeMl: t.Number(),
          batchId: t.String(),
          batchNo: t.String(),
          batchExpiryDate: t.Date(),
          inventoryItemId: t.String(),
          warehouseId: t.String(),
          vaccineNameSnapshot: t.String(),
          manufacturerSnapshot: t.String(),
          adverseReaction: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("MILD"),
              t.Literal("MODERATE"),
              t.Literal("SEVERE"),
              t.Literal("ANAPHYLACTIC"),
            ],
            { additionalProperties: false },
          ),
          adverseReactionNotes: t.String(),
          notes: t.String(),
          immunityOnsetDaysSnapshot: t.Integer(),
          protectiveFromAt: t.Date(),
          boosterIntervalDaysSnapshot: t.Integer(),
          protectiveUntilAt: t.Date(),
          nextDueAt: t.Date(),
          protocolDoseId: t.String(),
          carePlanEnrollmentVisitId: t.String(),
          isVoided: t.Boolean(),
          voidedAt: t.Date(),
          voidedById: t.String(),
          voidReason: t.String(),
          createdById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "VaccinationRecord" },
  ),
);

export const VaccinationRecordWhereUnique = t.Recursive(
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
              patientId: t.String(),
              vaccineId: t.String(),
              appointmentId: t.String(),
              branchId: t.String(),
              administeredById: t.String(),
              administeredAt: t.Date(),
              doseNumber: t.Integer(),
              doseKind: t.Union(
                [
                  t.Literal("PRIMARY"),
                  t.Literal("BOOSTER"),
                  t.Literal("ANNUAL"),
                  t.Literal("CATCH_UP"),
                ],
                { additionalProperties: false },
              ),
              route: t.Union(
                [
                  t.Literal("SUBCUTANEOUS"),
                  t.Literal("INTRAMUSCULAR"),
                  t.Literal("INTRANASAL"),
                  t.Literal("ORAL"),
                  t.Literal("INTRADERMAL"),
                  t.Literal("TOPICAL"),
                  t.Literal("OTHER"),
                ],
                { additionalProperties: false },
              ),
              site: t.Union(
                [
                  t.Literal("LEFT_SHOULDER"),
                  t.Literal("RIGHT_SHOULDER"),
                  t.Literal("LEFT_HIND_LIMB"),
                  t.Literal("RIGHT_HIND_LIMB"),
                  t.Literal("INTERSCAPULAR"),
                  t.Literal("LEFT_FLANK"),
                  t.Literal("RIGHT_FLANK"),
                  t.Literal("NASAL"),
                  t.Literal("ORAL"),
                  t.Literal("OTHER"),
                ],
                { additionalProperties: false },
              ),
              doseVolumeMl: t.Number(),
              batchId: t.String(),
              batchNo: t.String(),
              batchExpiryDate: t.Date(),
              inventoryItemId: t.String(),
              warehouseId: t.String(),
              vaccineNameSnapshot: t.String(),
              manufacturerSnapshot: t.String(),
              adverseReaction: t.Union(
                [
                  t.Literal("NONE"),
                  t.Literal("MILD"),
                  t.Literal("MODERATE"),
                  t.Literal("SEVERE"),
                  t.Literal("ANAPHYLACTIC"),
                ],
                { additionalProperties: false },
              ),
              adverseReactionNotes: t.String(),
              notes: t.String(),
              immunityOnsetDaysSnapshot: t.Integer(),
              protectiveFromAt: t.Date(),
              boosterIntervalDaysSnapshot: t.Integer(),
              protectiveUntilAt: t.Date(),
              nextDueAt: t.Date(),
              protocolDoseId: t.String(),
              carePlanEnrollmentVisitId: t.String(),
              isVoided: t.Boolean(),
              voidedAt: t.Date(),
              voidedById: t.String(),
              voidReason: t.String(),
              createdById: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "VaccinationRecord" },
);

export const VaccinationRecordSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      patientId: t.Boolean(),
      vaccineId: t.Boolean(),
      appointmentId: t.Boolean(),
      branchId: t.Boolean(),
      administeredById: t.Boolean(),
      administeredAt: t.Boolean(),
      doseNumber: t.Boolean(),
      doseKind: t.Boolean(),
      route: t.Boolean(),
      site: t.Boolean(),
      doseVolumeMl: t.Boolean(),
      batchId: t.Boolean(),
      batchNo: t.Boolean(),
      batchExpiryDate: t.Boolean(),
      inventoryItemId: t.Boolean(),
      warehouseId: t.Boolean(),
      vaccineNameSnapshot: t.Boolean(),
      manufacturerSnapshot: t.Boolean(),
      adverseReaction: t.Boolean(),
      adverseReactionNotes: t.Boolean(),
      notes: t.Boolean(),
      immunityOnsetDaysSnapshot: t.Boolean(),
      protectiveFromAt: t.Boolean(),
      boosterIntervalDaysSnapshot: t.Boolean(),
      protectiveUntilAt: t.Boolean(),
      nextDueAt: t.Boolean(),
      protocolDoseId: t.Boolean(),
      carePlanEnrollmentVisitId: t.Boolean(),
      isVoided: t.Boolean(),
      voidedAt: t.Boolean(),
      voidedById: t.Boolean(),
      voidReason: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      patient: t.Boolean(),
      vaccine: t.Boolean(),
      appointment: t.Boolean(),
      branch: t.Boolean(),
      administeredBy: t.Boolean(),
      batch: t.Boolean(),
      inventoryItem: t.Boolean(),
      protocolDose: t.Boolean(),
      carePlanEnrollmentVisit: t.Boolean(),
      createdBy: t.Boolean(),
      voidedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const VaccinationRecordInclude = t.Partial(
  t.Object(
    {
      doseKind: t.Boolean(),
      route: t.Boolean(),
      site: t.Boolean(),
      adverseReaction: t.Boolean(),
      clinic: t.Boolean(),
      patient: t.Boolean(),
      vaccine: t.Boolean(),
      appointment: t.Boolean(),
      branch: t.Boolean(),
      administeredBy: t.Boolean(),
      batch: t.Boolean(),
      inventoryItem: t.Boolean(),
      protocolDose: t.Boolean(),
      carePlanEnrollmentVisit: t.Boolean(),
      createdBy: t.Boolean(),
      voidedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const VaccinationRecordOrderBy = t.Partial(
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
      patientId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      vaccineId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      appointmentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      branchId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      administeredById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      administeredAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      doseNumber: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      doseVolumeMl: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      batchId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      batchNo: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      batchExpiryDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      inventoryItemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      warehouseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      vaccineNameSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      manufacturerSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      adverseReactionNotes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      immunityOnsetDaysSnapshot: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      protectiveFromAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      boosterIntervalDaysSnapshot: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      protectiveUntilAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      nextDueAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      protocolDoseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      carePlanEnrollmentVisitId: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      isVoided: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      voidedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      voidedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      voidReason: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdById: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const VaccinationRecord = t.Composite(
  [VaccinationRecordPlain, VaccinationRecordRelations],
  { additionalProperties: false },
);

export const VaccinationRecordInputCreate = t.Composite(
  [VaccinationRecordPlainInputCreate, VaccinationRecordRelationsInputCreate],
  { additionalProperties: false },
);

export const VaccinationRecordInputUpdate = t.Composite(
  [VaccinationRecordPlainInputUpdate, VaccinationRecordRelationsInputUpdate],
  { additionalProperties: false },
);
