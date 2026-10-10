import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingSessionPlain = t.Object(
  {
    id: t.String(),
    code: t.String(),
    clinicId: t.String(),
    branchId: t.String(),
    patientId: t.String(),
    ownerId: t.String(),
    appointmentId: __nullable__(t.String()),
    groomerId: t.String(),
    assistantId: __nullable__(t.String()),
    stationId: __nullable__(t.String()),
    lane: t.Union([t.Literal("COSMETIC"), t.Literal("MEDICAL")], {
      additionalProperties: false,
      description: `مسار الجلسة — تجميلي أم طبي. يقرّر أي البوابات إلزامية وأي اللوحات تظهر (§3).`,
    }),
    status: t.Union(
      [
        t.Literal("SCHEDULED"),
        t.Literal("CHECK_IN"),
        t.Literal("INTAKE"),
        t.Literal("IN_PROGRESS"),
        t.Literal("FINISHING"),
        t.Literal("READY"),
        t.Literal("PICKED_UP"),
        t.Literal("COMPLETED"),
        t.Literal("CANCELLED"),
        t.Literal("NO_SHOW"),
        t.Literal("ESCALATED"),
      ],
      {
        additionalProperties: false,
        description: `أعمدة لوحة التجميل (§6.1).`,
      },
    ),
    stage: __nullable__(
      t.Union(
        [
          t.Literal("QUOTE_APPROVAL"),
          t.Literal("BATH"),
          t.Literal("DRYING"),
          t.Literal("CLIP"),
          t.Literal("SCISSOR"),
          t.Literal("NAILS_EARS"),
          t.Literal("FINISH_CHECK"),
          t.Literal("PHOTOS"),
        ],
        {
          additionalProperties: false,
          description: `المرحلة الفرعية داخل الجلسة — تقود لوحة العمل.`,
        },
      ),
    ),
    vetOrderStaffId: __nullable__(t.String()),
    vetOrderNote: __nullable__(t.String()),
    sedationPlanned: t.Boolean(),
    scheduledAt: t.Date(),
    dropOffAt: __nullable__(t.Date()),
    estimatedDurationMin: t.Integer(),
    estimatedDryingMin: t.Integer(),
    promisedReadyAt: __nullable__(t.Date()),
    checkedInAt: __nullable__(t.Date()),
    startedAt: __nullable__(t.Date()),
    dryingStartedAt: __nullable__(t.Date()),
    readyAt: __nullable__(t.Date()),
    pickedUpAt: __nullable__(t.Date()),
    completedAt: __nullable__(t.Date()),
    dryingMethod: __nullable__(
      t.Union(
        [
          t.Literal("HAND_ROOM_TEMP"),
          t.Literal("FAN_ONLY"),
          t.Literal("CAGE_UNHEATED"),
          t.Literal("FORCED_AIR"),
          t.Literal("CAGE_HEATED"),
        ],
        {
          additionalProperties: false,
          description: `طريقة التجفيف — البوابة G5 ترفض CAGE_HEATED للحيوانات الممنوعة من الحرارة،
بلا أي مسار تجاوز. المرجع: إرشادات AAHA وصناعة التجميل حول قصيري الخطم.`,
        },
      ),
    ),
    quoteSubtotal: t.Number(),
    quoteAdjustments: t.Number(),
    quoteTotal: t.Number(),
    bookedQuoteTotal: t.Number(),
    ownerApprovedQuoteAt: __nullable__(t.Date()),
    cancelKind: __nullable__(
      t.Union(
        [
          t.Literal("OWNER_CANCELLED"),
          t.Literal("CLINIC_CANCELLED"),
          t.Literal("NO_SHOW"),
          t.Literal("HEALTH_REFUSAL"),
          t.Literal("BEHAVIOR_REFUSAL"),
        ],
        {
          additionalProperties: false,
          description: `سبب إنهاء الجلسة قبل أوانها`,
        },
      ),
    ),
    cancelReason: __nullable__(t.String()),
    isDeleted: t.Boolean(),
    deletedAt: __nullable__(t.Date()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `جلسة التجميل — الكيان المركزي. مسار واحد لكل الجلسات، والمسار (lane) يقرّر
أي البوابات إلزامية لا أي الأعمدة تظهر (الخطة §4.3، §6).`,
  },
);

export const GroomingSessionRelations = t.Object(
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
    groomer: t.Object(
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
    assistant: __nullable__(
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
    vetOrderBy: __nullable__(
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
    station: __nullable__(
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
    items: t.Array(
      t.Object(
        {
          id: t.String(),
          sessionId: t.String(),
          definitionId: __nullable__(t.String()),
          serviceId: __nullable__(t.String()),
          nameSnapshot: t.String(),
          laneSnapshot: t.Union([t.Literal("COSMETIC"), t.Literal("MEDICAL")], {
            additionalProperties: false,
            description: `مسار الجلسة — تجميلي أم طبي. يقرّر أي البوابات إلزامية وأي اللوحات تظهر (§3).`,
          }),
          priceSnapshot: t.Number(),
          durationSnapshot: t.Integer(),
          dryingSnapshot: t.Integer(),
          priceLevelSnapshot: __nullable__(t.String()),
          matchedRuleId: __nullable__(t.String()),
          quantity: t.Integer(),
          performed: t.Boolean(),
          performedByStaffId: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `بند خدمة داخل الجلسة — لقطات وقت الإضافة: الكتالوج يتغيّر والجلسة لا`,
        },
      ),
      { additionalProperties: false },
    ),
    adjustments: t.Array(
      t.Object(
        {
          id: t.String(),
          sessionId: t.String(),
          modifierCode: t.Union(
            [
              t.Literal("MATTING"),
              t.Literal("SHAVE_DOWN"),
              t.Literal("BEHAVIOR"),
              t.Literal("SENIOR"),
              t.Literal("FLEA"),
              t.Literal("SECOND_PET"),
              t.Literal("EXPRESS"),
              t.Literal("OUT_OF_HOURS"),
            ],
            {
              additionalProperties: false,
              description: `رموز الرسوم/الخصوم المشروطة (§5).`,
            },
          ),
          labelSnapshot: t.String(),
          amount: t.Number(),
          source: t.Union(
            [
              t.Literal("AUTO_INTAKE"),
              t.Literal("MANUAL"),
              t.Literal("PACKAGE"),
              t.Literal("OVERRIDE"),
            ],
            {
              additionalProperties: false,
              description: `مصدر الرسم المطبَّق — يُحفظ على الصفّ لا يُستنتج، فيبقى «لماذا هذا المبلغ؟» مقروءًا`,
            },
          ),
          reason: __nullable__(t.String()),
          appliedByStaffId: __nullable__(t.String()),
          approvedByOwnerAt: __nullable__(t.Date()),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `رسم أو خصم مطبَّق، بمصدره وسببه. صفّ مستقل لكل تطبيق عمدًا: مجموعٌ واحد
يخفي لماذا تغيّر الرقم، وهذا بالضبط ما يولّد شكوى «الفاتورة المفاجئة».`,
        },
      ),
      { additionalProperties: false },
    ),
    intake: __nullable__(
      t.Object(
        {
          id: t.String(),
          sessionId: t.String(),
          weightKg: __nullable__(t.Number()),
          temperatureC: __nullable__(t.Number()),
          vitalSignsRecordId: __nullable__(t.String()),
          mattingGrade: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("LIGHT"),
              t.Literal("MODERATE"),
              t.Literal("SEVERE"),
              t.Literal("PELTED"),
            ],
            {
              additionalProperties: false,
              description: `درجة تعقّد الفرو — سلّم 0–4 المتعارف عليه في الصناعة.`,
            },
          ),
          coatCondition: t.Union(
            [
              t.Literal("HEALTHY"),
              t.Literal("DRY"),
              t.Literal("GREASY"),
              t.Literal("DANDRUFF"),
              t.Literal("SHEDDING_HEAVY"),
              t.Literal("DAMAGED"),
            ],
            { additionalProperties: false },
          ),
          parasiteFinding: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("FLEAS"),
              t.Literal("TICKS"),
              t.Literal("LICE"),
              t.Literal("MITES_SUSPECTED"),
              t.Literal("MULTIPLE"),
            ],
            {
              additionalProperties: false,
              description: `نتيجة فحص الطفيليات — أي قيمة غير NONE تُفعّل بروتوكول G7.`,
            },
          ),
          skinFindings: t.Array(t.String(), { additionalProperties: false }),
          earCondition: t.Union(
            [
              t.Literal("NORMAL"),
              t.Literal("WAXY"),
              t.Literal("REDNESS"),
              t.Literal("ODOR"),
              t.Literal("DISCHARGE"),
              t.Literal("PAINFUL"),
            ],
            { additionalProperties: false },
          ),
          nailCondition: t.Union(
            [
              t.Literal("NORMAL"),
              t.Literal("OVERGROWN"),
              t.Literal("SPLIT"),
              t.Literal("INGROWN"),
              t.Literal("MISSING"),
            ],
            { additionalProperties: false },
          ),
          dentalNote: __nullable__(t.String()),
          behaviorScore: t.Union(
            [t.Literal("GREEN"), t.Literal("YELLOW"), t.Literal("RED")],
            {
              additionalProperties: false,
              description: `تقييم سلوك التعامل — إشارة مرور.`,
            },
          ),
          muzzleUsed: t.Boolean(),
          rabiesValidUntil: __nullable__(t.Date()),
          vaccinationOverrideReason: __nullable__(t.String()),
          shaveDownRecommended: t.Boolean(),
          shaveDownApprovedAt: __nullable__(t.Date()),
          shaveDownApprovedBy: __nullable__(t.String()),
          heatDryProhibitedSnapshot: t.Boolean(),
          heatDryReasonsSnapshot: t.Array(t.String(), {
            additionalProperties: false,
          }),
          parasiteTreatedAt: __nullable__(t.Date()),
          parasiteOwnerNotifiedAt: __nullable__(t.Date()),
          isolationAcknowledgedAt: __nullable__(t.Date()),
          belongings: t.Array(t.String(), { additionalProperties: false }),
          notes: __nullable__(t.String()),
          performedByStaffId: __nullable__(t.String()),
          performedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `الفحص القبلي — بوابة الدخول إلى العمل، ومصدر معظم الرسوم والملاحظات (§4.4)`,
        },
      ),
    ),
    photos: t.Array(
      t.Object(
        {
          id: t.String(),
          sessionId: t.String(),
          kind: t.Union(
            [
              t.Literal("BEFORE"),
              t.Literal("AFTER"),
              t.Literal("CONDITION"),
              t.Literal("INCIDENT"),
            ],
            { additionalProperties: false },
          ),
          url: t.String(),
          caption: __nullable__(t.String()),
          bodyZone: __nullable__(t.String()),
          createdByUserId: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    products: t.Array(
      t.Object(
        {
          id: t.String(),
          sessionId: t.String(),
          inventoryItemId: __nullable__(t.String()),
          nameSnapshot: t.String(),
          priceSnapshot: t.Number(),
          quantity: t.Number(),
          billable: t.Boolean(),
          dilution: __nullable__(t.String()),
          contactTimeMin: __nullable__(t.Integer()),
          bodyZones: t.Array(t.String(), { additionalProperties: false }),
          issuedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `مستهلكات الجلسة — تُخصم من المخزون مرّة واحدة عند مغادرة عمود التشطيب.
حقول البروتوكول (التخفيف وزمن التلامس) ليست ملاحظة حرّة: الحمّام الدوائي
علاجٌ موضعي له جرعة، ولا يُقرأ أثره بعد شهر بغير تسجيلها.`,
        },
      ),
      { additionalProperties: false },
    ),
    incidents: t.Array(
      t.Object(
        {
          id: t.String(),
          sessionId: t.String(),
          kind: t.Union(
            [
              t.Literal("CLIPPER_BURN"),
              t.Literal("NICK_CUT"),
              t.Literal("QUICKED_NAIL"),
              t.Literal("HEAT_STRESS"),
              t.Literal("MEDICAL_EVENT"),
              t.Literal("ESCAPE"),
              t.Literal("BITE_TO_STAFF"),
              t.Literal("EQUIPMENT_FAILURE"),
              t.Literal("OTHER"),
            ],
            {
              additionalProperties: false,
              description: `نوع الحادثة — الإبلاغ إلزامي والسجل إلحاقي (البوابة G10)`,
            },
          ),
          severity: t.Union(
            [t.Literal("MINOR"), t.Literal("MODERATE"), t.Literal("MAJOR")],
            { additionalProperties: false },
          ),
          description: t.String(),
          actionTaken: __nullable__(t.String()),
          photoId: __nullable__(t.String()),
          ownerNotifiedAt: __nullable__(t.Date()),
          ownerNotifiedByStaffId: __nullable__(t.String()),
          vetAssessedByStaffId: __nullable__(t.String()),
          vetAssessmentNote: __nullable__(t.String()),
          followUpAppointmentId: __nullable__(t.String()),
          resolvedAt: __nullable__(t.Date()),
          createdByStaffId: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `حادثة داخل الجلسة — البوابة G10 تمنع الإقفال قبل تقييم الطبيب وإبلاغ المالك.
لا تُعدَّل في مكانها ولا تُحذف: حادثة مطموسة بلا أثر هي مسؤولية مدفونة.`,
        },
      ),
      { additionalProperties: false },
    ),
    findings: t.Array(
      t.Object(
        {
          id: t.String(),
          sessionId: t.String(),
          patientId: t.String(),
          clinicId: t.String(),
          category: t.Union(
            [
              t.Literal("SKIN"),
              t.Literal("EARS"),
              t.Literal("EYES"),
              t.Literal("NAILS"),
              t.Literal("DENTAL"),
              t.Literal("LUMP"),
              t.Literal("PARASITE"),
              t.Literal("WEIGHT"),
              t.Literal("PAIN"),
              t.Literal("BEHAVIOR"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          bodyZone: __nullable__(t.String()),
          severity: t.Union(
            [t.Literal("INFO"), t.Literal("ATTENTION"), t.Literal("URGENT")],
            { additionalProperties: false },
          ),
          note: t.String(),
          photoId: __nullable__(t.String()),
          acknowledgedByStaffId: __nullable__(t.String()),
          acknowledgedAt: __nullable__(t.Date()),
          referralAppointmentId: __nullable__(t.String()),
          labOrderId: __nullable__(t.String()),
          dismissedReason: __nullable__(t.String()),
          createdByStaffId: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `الجسر السريري (§8) — السبب الذي يجعل التجميل جزءًا من نظام بيطري لا صالونًا.
المُجمِّل يمرّ بيده على كامل الحيوان كل أربعة إلى ثمانية أسابيع؛ ما يراه كان
يتبخّر، وهنا يصير سطرًا في السجل الطبي وربما زيارة.`,
        },
      ),
      { additionalProperties: false },
    ),
    reportCard: __nullable__(
      t.Object(
        {
          id: t.String(),
          sessionId: t.String(),
          summary: t.String(),
          moodScore: t.Union(
            [
              t.Literal("CALM"),
              t.Literal("HAPPY"),
              t.Literal("ANXIOUS"),
              t.Literal("STRESSED"),
              t.Literal("AGGRESSIVE"),
            ],
            { additionalProperties: false },
          ),
          recommendedIntervalWeeks: __nullable__(t.Integer()),
          nextRecommendedAt: __nullable__(t.Date()),
          publicToken: t.String(),
          sentAt: __nullable__(t.Date()),
          channel: __nullable__(
            t.Union(
              [
                t.Literal("WHATSAPP"),
                t.Literal("EMAIL"),
                t.Literal("SMS"),
                t.Literal("IN_APP"),
                t.Literal("PRINTED"),
              ],
              { additionalProperties: false },
            ),
          ),
          rebookedAppointmentId: __nullable__(t.String()),
          rebookedSessionId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `تقرير الجلسة للمالك — صور قبل/بعد وما جرى وموعد الاستحقاق القادم، برابط
عام لا يكشف غير هذه الجلسة. إعادة الحجز منه تُسجَّل ليصير معدّل العودة قياسًا.`,
        },
      ),
    ),
    activity: t.Array(
      t.Object(
        {
          id: t.String(),
          sessionId: t.String(),
          type: t.Union(
            [
              t.Literal("CREATED"),
              t.Literal("STATUS_CHANGED"),
              t.Literal("STAGE_CHANGED"),
              t.Literal("GATE_OVERRIDDEN"),
              t.Literal("QUOTE_RECALCULATED"),
              t.Literal("QUOTE_APPROVED"),
              t.Literal("LANE_ESCALATED"),
              t.Literal("INTAKE_RECORDED"),
              t.Literal("ITEM_CHANGED"),
              t.Literal("PRODUCT_ISSUED"),
              t.Literal("PHOTO_ADDED"),
              t.Literal("FINDING_ADDED"),
              t.Literal("FINDING_ESCALATED"),
              t.Literal("INCIDENT_REPORTED"),
              t.Literal("INCIDENT_RESOLVED"),
              t.Literal("REPORT_CARD_SENT"),
              t.Literal("INVOICE_ISSUED"),
              t.Literal("INVOICE_PAID"),
              t.Literal("COMMENT"),
            ],
            {
              additionalProperties: false,
              description: `نوع حدث في سجل نشاط الجلسة — السجل إلحاقي لا يُعدَّل ولا يُحذف`,
            },
          ),
          detail: __nullable__(t.String()),
          gate: __nullable__(t.String()),
          authorUserId: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `سجل نشاط الجلسة — إلحاقي فقط، لا يُعدَّل ولا يُحذف. كل تجاوز بوابة يهبط هنا.`,
        },
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
  },
  {
    additionalProperties: false,
    description: `جلسة التجميل — الكيان المركزي. مسار واحد لكل الجلسات، والمسار (lane) يقرّر
أي البوابات إلزامية لا أي الأعمدة تظهر (الخطة §4.3، §6).`,
  },
);

export const GroomingSessionPlainInputCreate = t.Object(
  {
    code: t.String(),
    lane: t.Optional(
      t.Union([t.Literal("COSMETIC"), t.Literal("MEDICAL")], {
        additionalProperties: false,
        description: `مسار الجلسة — تجميلي أم طبي. يقرّر أي البوابات إلزامية وأي اللوحات تظهر (§3).`,
      }),
    ),
    status: t.Optional(
      t.Union(
        [
          t.Literal("SCHEDULED"),
          t.Literal("CHECK_IN"),
          t.Literal("INTAKE"),
          t.Literal("IN_PROGRESS"),
          t.Literal("FINISHING"),
          t.Literal("READY"),
          t.Literal("PICKED_UP"),
          t.Literal("COMPLETED"),
          t.Literal("CANCELLED"),
          t.Literal("NO_SHOW"),
          t.Literal("ESCALATED"),
        ],
        {
          additionalProperties: false,
          description: `أعمدة لوحة التجميل (§6.1).`,
        },
      ),
    ),
    stage: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("QUOTE_APPROVAL"),
            t.Literal("BATH"),
            t.Literal("DRYING"),
            t.Literal("CLIP"),
            t.Literal("SCISSOR"),
            t.Literal("NAILS_EARS"),
            t.Literal("FINISH_CHECK"),
            t.Literal("PHOTOS"),
          ],
          {
            additionalProperties: false,
            description: `المرحلة الفرعية داخل الجلسة — تقود لوحة العمل.`,
          },
        ),
      ),
    ),
    vetOrderNote: t.Optional(__nullable__(t.String())),
    sedationPlanned: t.Optional(t.Boolean()),
    scheduledAt: t.Date(),
    dropOffAt: t.Optional(__nullable__(t.Date())),
    estimatedDurationMin: t.Optional(t.Integer()),
    estimatedDryingMin: t.Optional(t.Integer()),
    promisedReadyAt: t.Optional(__nullable__(t.Date())),
    checkedInAt: t.Optional(__nullable__(t.Date())),
    startedAt: t.Optional(__nullable__(t.Date())),
    dryingStartedAt: t.Optional(__nullable__(t.Date())),
    readyAt: t.Optional(__nullable__(t.Date())),
    pickedUpAt: t.Optional(__nullable__(t.Date())),
    completedAt: t.Optional(__nullable__(t.Date())),
    dryingMethod: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("HAND_ROOM_TEMP"),
            t.Literal("FAN_ONLY"),
            t.Literal("CAGE_UNHEATED"),
            t.Literal("FORCED_AIR"),
            t.Literal("CAGE_HEATED"),
          ],
          {
            additionalProperties: false,
            description: `طريقة التجفيف — البوابة G5 ترفض CAGE_HEATED للحيوانات الممنوعة من الحرارة،
بلا أي مسار تجاوز. المرجع: إرشادات AAHA وصناعة التجميل حول قصيري الخطم.`,
          },
        ),
      ),
    ),
    quoteSubtotal: t.Optional(t.Number()),
    quoteAdjustments: t.Optional(t.Number()),
    quoteTotal: t.Optional(t.Number()),
    bookedQuoteTotal: t.Optional(t.Number()),
    ownerApprovedQuoteAt: t.Optional(__nullable__(t.Date())),
    cancelKind: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("OWNER_CANCELLED"),
            t.Literal("CLINIC_CANCELLED"),
            t.Literal("NO_SHOW"),
            t.Literal("HEALTH_REFUSAL"),
            t.Literal("BEHAVIOR_REFUSAL"),
          ],
          {
            additionalProperties: false,
            description: `سبب إنهاء الجلسة قبل أوانها`,
          },
        ),
      ),
    ),
    cancelReason: t.Optional(__nullable__(t.String())),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `جلسة التجميل — الكيان المركزي. مسار واحد لكل الجلسات، والمسار (lane) يقرّر
أي البوابات إلزامية لا أي الأعمدة تظهر (الخطة §4.3، §6).`,
  },
);

export const GroomingSessionPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    lane: t.Optional(
      t.Union([t.Literal("COSMETIC"), t.Literal("MEDICAL")], {
        additionalProperties: false,
        description: `مسار الجلسة — تجميلي أم طبي. يقرّر أي البوابات إلزامية وأي اللوحات تظهر (§3).`,
      }),
    ),
    status: t.Optional(
      t.Union(
        [
          t.Literal("SCHEDULED"),
          t.Literal("CHECK_IN"),
          t.Literal("INTAKE"),
          t.Literal("IN_PROGRESS"),
          t.Literal("FINISHING"),
          t.Literal("READY"),
          t.Literal("PICKED_UP"),
          t.Literal("COMPLETED"),
          t.Literal("CANCELLED"),
          t.Literal("NO_SHOW"),
          t.Literal("ESCALATED"),
        ],
        {
          additionalProperties: false,
          description: `أعمدة لوحة التجميل (§6.1).`,
        },
      ),
    ),
    stage: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("QUOTE_APPROVAL"),
            t.Literal("BATH"),
            t.Literal("DRYING"),
            t.Literal("CLIP"),
            t.Literal("SCISSOR"),
            t.Literal("NAILS_EARS"),
            t.Literal("FINISH_CHECK"),
            t.Literal("PHOTOS"),
          ],
          {
            additionalProperties: false,
            description: `المرحلة الفرعية داخل الجلسة — تقود لوحة العمل.`,
          },
        ),
      ),
    ),
    vetOrderNote: t.Optional(__nullable__(t.String())),
    sedationPlanned: t.Optional(t.Boolean()),
    scheduledAt: t.Optional(t.Date()),
    dropOffAt: t.Optional(__nullable__(t.Date())),
    estimatedDurationMin: t.Optional(t.Integer()),
    estimatedDryingMin: t.Optional(t.Integer()),
    promisedReadyAt: t.Optional(__nullable__(t.Date())),
    checkedInAt: t.Optional(__nullable__(t.Date())),
    startedAt: t.Optional(__nullable__(t.Date())),
    dryingStartedAt: t.Optional(__nullable__(t.Date())),
    readyAt: t.Optional(__nullable__(t.Date())),
    pickedUpAt: t.Optional(__nullable__(t.Date())),
    completedAt: t.Optional(__nullable__(t.Date())),
    dryingMethod: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("HAND_ROOM_TEMP"),
            t.Literal("FAN_ONLY"),
            t.Literal("CAGE_UNHEATED"),
            t.Literal("FORCED_AIR"),
            t.Literal("CAGE_HEATED"),
          ],
          {
            additionalProperties: false,
            description: `طريقة التجفيف — البوابة G5 ترفض CAGE_HEATED للحيوانات الممنوعة من الحرارة،
بلا أي مسار تجاوز. المرجع: إرشادات AAHA وصناعة التجميل حول قصيري الخطم.`,
          },
        ),
      ),
    ),
    quoteSubtotal: t.Optional(t.Number()),
    quoteAdjustments: t.Optional(t.Number()),
    quoteTotal: t.Optional(t.Number()),
    bookedQuoteTotal: t.Optional(t.Number()),
    ownerApprovedQuoteAt: t.Optional(__nullable__(t.Date())),
    cancelKind: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("OWNER_CANCELLED"),
            t.Literal("CLINIC_CANCELLED"),
            t.Literal("NO_SHOW"),
            t.Literal("HEALTH_REFUSAL"),
            t.Literal("BEHAVIOR_REFUSAL"),
          ],
          {
            additionalProperties: false,
            description: `سبب إنهاء الجلسة قبل أوانها`,
          },
        ),
      ),
    ),
    cancelReason: t.Optional(__nullable__(t.String())),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `جلسة التجميل — الكيان المركزي. مسار واحد لكل الجلسات، والمسار (lane) يقرّر
أي البوابات إلزامية لا أي الأعمدة تظهر (الخطة §4.3، §6).`,
  },
);

export const GroomingSessionRelationsInputCreate = t.Object(
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
    groomer: t.Object(
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
    assistant: t.Optional(
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
    vetOrderBy: t.Optional(
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
    station: t.Optional(
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
    items: t.Optional(
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
    adjustments: t.Optional(
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
    intake: t.Optional(
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
    photos: t.Optional(
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
    products: t.Optional(
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
    incidents: t.Optional(
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
    findings: t.Optional(
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
    reportCard: t.Optional(
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
  },
  {
    additionalProperties: false,
    description: `جلسة التجميل — الكيان المركزي. مسار واحد لكل الجلسات، والمسار (lane) يقرّر
أي البوابات إلزامية لا أي الأعمدة تظهر (الخطة §4.3، §6).`,
  },
);

export const GroomingSessionRelationsInputUpdate = t.Partial(
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
      groomer: t.Object(
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
      assistant: t.Partial(
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
      vetOrderBy: t.Partial(
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
      station: t.Partial(
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
      items: t.Partial(
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
      adjustments: t.Partial(
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
      intake: t.Partial(
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
      photos: t.Partial(
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
      products: t.Partial(
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
      incidents: t.Partial(
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
      findings: t.Partial(
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
      reportCard: t.Partial(
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
    },
    {
      additionalProperties: false,
      description: `جلسة التجميل — الكيان المركزي. مسار واحد لكل الجلسات، والمسار (lane) يقرّر
أي البوابات إلزامية لا أي الأعمدة تظهر (الخطة §4.3، §6).`,
    },
  ),
);

export const GroomingSessionWhere = t.Partial(
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
          groomerId: t.String(),
          assistantId: t.String(),
          stationId: t.String(),
          lane: t.Union([t.Literal("COSMETIC"), t.Literal("MEDICAL")], {
            additionalProperties: false,
            description: `مسار الجلسة — تجميلي أم طبي. يقرّر أي البوابات إلزامية وأي اللوحات تظهر (§3).`,
          }),
          status: t.Union(
            [
              t.Literal("SCHEDULED"),
              t.Literal("CHECK_IN"),
              t.Literal("INTAKE"),
              t.Literal("IN_PROGRESS"),
              t.Literal("FINISHING"),
              t.Literal("READY"),
              t.Literal("PICKED_UP"),
              t.Literal("COMPLETED"),
              t.Literal("CANCELLED"),
              t.Literal("NO_SHOW"),
              t.Literal("ESCALATED"),
            ],
            {
              additionalProperties: false,
              description: `أعمدة لوحة التجميل (§6.1).`,
            },
          ),
          stage: t.Union(
            [
              t.Literal("QUOTE_APPROVAL"),
              t.Literal("BATH"),
              t.Literal("DRYING"),
              t.Literal("CLIP"),
              t.Literal("SCISSOR"),
              t.Literal("NAILS_EARS"),
              t.Literal("FINISH_CHECK"),
              t.Literal("PHOTOS"),
            ],
            {
              additionalProperties: false,
              description: `المرحلة الفرعية داخل الجلسة — تقود لوحة العمل.`,
            },
          ),
          vetOrderStaffId: t.String(),
          vetOrderNote: t.String(),
          sedationPlanned: t.Boolean(),
          scheduledAt: t.Date(),
          dropOffAt: t.Date(),
          estimatedDurationMin: t.Integer(),
          estimatedDryingMin: t.Integer(),
          promisedReadyAt: t.Date(),
          checkedInAt: t.Date(),
          startedAt: t.Date(),
          dryingStartedAt: t.Date(),
          readyAt: t.Date(),
          pickedUpAt: t.Date(),
          completedAt: t.Date(),
          dryingMethod: t.Union(
            [
              t.Literal("HAND_ROOM_TEMP"),
              t.Literal("FAN_ONLY"),
              t.Literal("CAGE_UNHEATED"),
              t.Literal("FORCED_AIR"),
              t.Literal("CAGE_HEATED"),
            ],
            {
              additionalProperties: false,
              description: `طريقة التجفيف — البوابة G5 ترفض CAGE_HEATED للحيوانات الممنوعة من الحرارة،
بلا أي مسار تجاوز. المرجع: إرشادات AAHA وصناعة التجميل حول قصيري الخطم.`,
            },
          ),
          quoteSubtotal: t.Number(),
          quoteAdjustments: t.Number(),
          quoteTotal: t.Number(),
          bookedQuoteTotal: t.Number(),
          ownerApprovedQuoteAt: t.Date(),
          cancelKind: t.Union(
            [
              t.Literal("OWNER_CANCELLED"),
              t.Literal("CLINIC_CANCELLED"),
              t.Literal("NO_SHOW"),
              t.Literal("HEALTH_REFUSAL"),
              t.Literal("BEHAVIOR_REFUSAL"),
            ],
            {
              additionalProperties: false,
              description: `سبب إنهاء الجلسة قبل أوانها`,
            },
          ),
          cancelReason: t.String(),
          isDeleted: t.Boolean(),
          deletedAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `جلسة التجميل — الكيان المركزي. مسار واحد لكل الجلسات، والمسار (lane) يقرّر
أي البوابات إلزامية لا أي الأعمدة تظهر (الخطة §4.3، §6).`,
        },
      ),
    { $id: "GroomingSession" },
  ),
);

export const GroomingSessionWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), code: t.String() },
            {
              additionalProperties: false,
              description: `جلسة التجميل — الكيان المركزي. مسار واحد لكل الجلسات، والمسار (lane) يقرّر
أي البوابات إلزامية لا أي الأعمدة تظهر (الخطة §4.3، §6).`,
            },
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
              groomerId: t.String(),
              assistantId: t.String(),
              stationId: t.String(),
              lane: t.Union([t.Literal("COSMETIC"), t.Literal("MEDICAL")], {
                additionalProperties: false,
                description: `مسار الجلسة — تجميلي أم طبي. يقرّر أي البوابات إلزامية وأي اللوحات تظهر (§3).`,
              }),
              status: t.Union(
                [
                  t.Literal("SCHEDULED"),
                  t.Literal("CHECK_IN"),
                  t.Literal("INTAKE"),
                  t.Literal("IN_PROGRESS"),
                  t.Literal("FINISHING"),
                  t.Literal("READY"),
                  t.Literal("PICKED_UP"),
                  t.Literal("COMPLETED"),
                  t.Literal("CANCELLED"),
                  t.Literal("NO_SHOW"),
                  t.Literal("ESCALATED"),
                ],
                {
                  additionalProperties: false,
                  description: `أعمدة لوحة التجميل (§6.1).`,
                },
              ),
              stage: t.Union(
                [
                  t.Literal("QUOTE_APPROVAL"),
                  t.Literal("BATH"),
                  t.Literal("DRYING"),
                  t.Literal("CLIP"),
                  t.Literal("SCISSOR"),
                  t.Literal("NAILS_EARS"),
                  t.Literal("FINISH_CHECK"),
                  t.Literal("PHOTOS"),
                ],
                {
                  additionalProperties: false,
                  description: `المرحلة الفرعية داخل الجلسة — تقود لوحة العمل.`,
                },
              ),
              vetOrderStaffId: t.String(),
              vetOrderNote: t.String(),
              sedationPlanned: t.Boolean(),
              scheduledAt: t.Date(),
              dropOffAt: t.Date(),
              estimatedDurationMin: t.Integer(),
              estimatedDryingMin: t.Integer(),
              promisedReadyAt: t.Date(),
              checkedInAt: t.Date(),
              startedAt: t.Date(),
              dryingStartedAt: t.Date(),
              readyAt: t.Date(),
              pickedUpAt: t.Date(),
              completedAt: t.Date(),
              dryingMethod: t.Union(
                [
                  t.Literal("HAND_ROOM_TEMP"),
                  t.Literal("FAN_ONLY"),
                  t.Literal("CAGE_UNHEATED"),
                  t.Literal("FORCED_AIR"),
                  t.Literal("CAGE_HEATED"),
                ],
                {
                  additionalProperties: false,
                  description: `طريقة التجفيف — البوابة G5 ترفض CAGE_HEATED للحيوانات الممنوعة من الحرارة،
بلا أي مسار تجاوز. المرجع: إرشادات AAHA وصناعة التجميل حول قصيري الخطم.`,
                },
              ),
              quoteSubtotal: t.Number(),
              quoteAdjustments: t.Number(),
              quoteTotal: t.Number(),
              bookedQuoteTotal: t.Number(),
              ownerApprovedQuoteAt: t.Date(),
              cancelKind: t.Union(
                [
                  t.Literal("OWNER_CANCELLED"),
                  t.Literal("CLINIC_CANCELLED"),
                  t.Literal("NO_SHOW"),
                  t.Literal("HEALTH_REFUSAL"),
                  t.Literal("BEHAVIOR_REFUSAL"),
                ],
                {
                  additionalProperties: false,
                  description: `سبب إنهاء الجلسة قبل أوانها`,
                },
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
  { $id: "GroomingSession" },
);

export const GroomingSessionSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      branchId: t.Boolean(),
      patientId: t.Boolean(),
      ownerId: t.Boolean(),
      appointmentId: t.Boolean(),
      groomerId: t.Boolean(),
      assistantId: t.Boolean(),
      stationId: t.Boolean(),
      lane: t.Boolean(),
      status: t.Boolean(),
      stage: t.Boolean(),
      vetOrderStaffId: t.Boolean(),
      vetOrderNote: t.Boolean(),
      sedationPlanned: t.Boolean(),
      scheduledAt: t.Boolean(),
      dropOffAt: t.Boolean(),
      estimatedDurationMin: t.Boolean(),
      estimatedDryingMin: t.Boolean(),
      promisedReadyAt: t.Boolean(),
      checkedInAt: t.Boolean(),
      startedAt: t.Boolean(),
      dryingStartedAt: t.Boolean(),
      readyAt: t.Boolean(),
      pickedUpAt: t.Boolean(),
      completedAt: t.Boolean(),
      dryingMethod: t.Boolean(),
      quoteSubtotal: t.Boolean(),
      quoteAdjustments: t.Boolean(),
      quoteTotal: t.Boolean(),
      bookedQuoteTotal: t.Boolean(),
      ownerApprovedQuoteAt: t.Boolean(),
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
      groomer: t.Boolean(),
      assistant: t.Boolean(),
      vetOrderBy: t.Boolean(),
      station: t.Boolean(),
      items: t.Boolean(),
      adjustments: t.Boolean(),
      intake: t.Boolean(),
      photos: t.Boolean(),
      products: t.Boolean(),
      incidents: t.Boolean(),
      findings: t.Boolean(),
      reportCard: t.Boolean(),
      activity: t.Boolean(),
      invoice: t.Boolean(),
      inboxItems: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `جلسة التجميل — الكيان المركزي. مسار واحد لكل الجلسات، والمسار (lane) يقرّر
أي البوابات إلزامية لا أي الأعمدة تظهر (الخطة §4.3، §6).`,
    },
  ),
);

export const GroomingSessionInclude = t.Partial(
  t.Object(
    {
      lane: t.Boolean(),
      status: t.Boolean(),
      stage: t.Boolean(),
      dryingMethod: t.Boolean(),
      cancelKind: t.Boolean(),
      clinic: t.Boolean(),
      branch: t.Boolean(),
      patient: t.Boolean(),
      owner: t.Boolean(),
      appointment: t.Boolean(),
      groomer: t.Boolean(),
      assistant: t.Boolean(),
      vetOrderBy: t.Boolean(),
      station: t.Boolean(),
      items: t.Boolean(),
      adjustments: t.Boolean(),
      intake: t.Boolean(),
      photos: t.Boolean(),
      products: t.Boolean(),
      incidents: t.Boolean(),
      findings: t.Boolean(),
      reportCard: t.Boolean(),
      activity: t.Boolean(),
      invoice: t.Boolean(),
      inboxItems: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `جلسة التجميل — الكيان المركزي. مسار واحد لكل الجلسات، والمسار (lane) يقرّر
أي البوابات إلزامية لا أي الأعمدة تظهر (الخطة §4.3، §6).`,
    },
  ),
);

export const GroomingSessionOrderBy = t.Partial(
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
      groomerId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      assistantId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      stationId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      vetOrderStaffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      vetOrderNote: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sedationPlanned: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      scheduledAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dropOffAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      estimatedDurationMin: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      estimatedDryingMin: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      promisedReadyAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      checkedInAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      startedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dryingStartedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      readyAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      pickedUpAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      completedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      quoteSubtotal: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      quoteAdjustments: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      quoteTotal: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      bookedQuoteTotal: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ownerApprovedQuoteAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
    {
      additionalProperties: false,
      description: `جلسة التجميل — الكيان المركزي. مسار واحد لكل الجلسات، والمسار (lane) يقرّر
أي البوابات إلزامية لا أي الأعمدة تظهر (الخطة §4.3، §6).`,
    },
  ),
);

export const GroomingSession = t.Composite(
  [GroomingSessionPlain, GroomingSessionRelations],
  { additionalProperties: false },
);

export const GroomingSessionInputCreate = t.Composite(
  [GroomingSessionPlainInputCreate, GroomingSessionRelationsInputCreate],
  { additionalProperties: false },
);

export const GroomingSessionInputUpdate = t.Composite(
  [GroomingSessionPlainInputUpdate, GroomingSessionRelationsInputUpdate],
  { additionalProperties: false },
);
