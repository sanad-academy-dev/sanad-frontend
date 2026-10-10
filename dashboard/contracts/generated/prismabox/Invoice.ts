import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InvoicePlain = t.Object(
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
      t.Union([t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")], {
        additionalProperties: false,
      }),
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
);

export const InvoiceRelations = t.Object(
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
    refundedBy: __nullable__(
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
    labOrder: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          branchId: t.String(),
          patientId: t.String(),
          ownerId: t.String(),
          appointmentId: __nullable__(t.String()),
          inpatientStayId: __nullable__(
            t.String({
              description: `*
* [IP2] طُلب من داخل إقامة تنويم. عمود قياسيّ بلا علاقة Prisma عن قصد: العلاقة
* تُضاف طرفين، وطرفها الثاني يوسّع رسم أنواع \`InpatientStay\` الضخم أصلًا حتى
* يتجاوز سقف عمق TypeScript (نفس ما وقع عند إضافة نماذج التنويم أول مرّة).
* الاستعلام هنا دائمًا «طلبات هذه الإقامة»، وهو استعلام مستقلّ لا تضمين متداخل.`,
            }),
          ),
          requestedById: __nullable__(t.String()),
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
          isUrgent: t.Boolean(),
          notes: __nullable__(t.String()),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          qcReviewedAt: __nullable__(t.Date()),
          qcReviewedById: __nullable__(t.String()),
          qcRules: t.Array(t.String(), { additionalProperties: false }),
          releasedToOwnerAt: __nullable__(
            t.Date({
              description: `*
* [D6] نشر النتيجة لمالك الحيوان — القرار السريري الذي يفتح بوّابة التطبيق.
* النتيجة **لا تصل تطبيق المالك** حتى يُملأ هذا الحقل. القيمة الفارغة هي الحالة
* الطبيعية لا النقص: قيمةٌ خارج المدى المرجعي تُقرأ كارثةً وهي طبيعية لنوعها،
* وأخرى تبدو سليمة يعرف الطبيب وحده أنها تستدعي إعادة. فالنشر فعلُ طبيبٍ يُسجَّل
* باسمه ووقته، لا أثرٌ جانبيّ لاكتمال التحليل.`,
            }),
          ),
          releasedByStaffId: __nullable__(t.String()),
          releaseSummary: __nullable__(
            t.String({
              description: `*
* ملخّصٌ بلغة المالك يكتبه الطبيب عند النشر — لا يُعرض التقرير الخام.`,
            }),
          ),
        },
        { additionalProperties: false },
      ),
    ),
    radiologyOrder: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          branchId: t.String(),
          patientId: t.String(),
          ownerId: t.String(),
          appointmentId: __nullable__(t.String()),
          inpatientStayId: __nullable__(
            t.String({
              description: `*
* [IP2] طُلب من داخل إقامة تنويم. عمود قياسيّ بلا علاقة Prisma عن قصد: العلاقة
* تُضاف طرفين، وطرفها الثاني يوسّع رسم أنواع \`InpatientStay\` الضخم أصلًا حتى
* يتجاوز سقف عمق TypeScript (نفس ما وقع عند إضافة نماذج التنويم أول مرّة).
* الاستعلام هنا دائمًا «طلبات هذه الإقامة»، وهو استعلام مستقلّ لا تضمين متداخل.`,
            }),
          ),
          requestedById: __nullable__(t.String()),
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
          isUrgent: t.Boolean(),
          clinicalInfo: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          releasedToOwnerAt: __nullable__(
            t.Date({
              description: `*
* [D6] نشر النتيجة لمالك الحيوان — انظر الشرح على \`LabTestOrder.releasedToOwnerAt\`.`,
            }),
          ),
          releasedByStaffId: __nullable__(t.String()),
          releaseSummary: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
    ),
    operationCase: __nullable__(
      t.Object(
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
      ),
    ),
    taxTemplate: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          title: t.String(),
          isDefault: t.Boolean(),
          disabled: t.Boolean(),
          taxCategoryId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    membership: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          ownerId: t.String(),
          planId: t.String(),
          subscriptionId: t.String({
            description: `الاشتراك المحاسبي الحامل للفوترة (MI-C2) — واحد لواحد`,
          }),
          status: t.Union(
            [
              t.Literal("PENDING_PAYMENT"),
              t.Literal("ACTIVE"),
              t.Literal("PAST_DUE"),
              t.Literal("LAPSED"),
              t.Literal("CANCELLED"),
              t.Literal("EXPIRED"),
            ],
            {
              additionalProperties: false,
              description: `§5.2 — CANCELLED وEXPIRED نهائيتان دومًا؛ LAPSED نهائية بعد انقضاء فترتها فقط
(قرار المالك MI-P1 س5: داخل الفترة تبقى غير نهائية لأنها قابلة للإحياء بالدفع).`,
            },
          ),
          currentPeriodStart: t.Date(),
          currentPeriodEnd: t.Date(),
          feeSnapshot: t.Number(),
          intervalSnapshot: t.Union(
            [
              t.Literal("DAY"),
              t.Literal("WEEK"),
              t.Literal("MONTH"),
              t.Literal("YEAR"),
            ],
            { additionalProperties: false },
          ),
          intervalCountSnapshot: t.Integer(),
          graceDaysSnapshot: t.Integer(),
          autoRenewSnapshot: t.Boolean(),
          scheduledPlanId: __nullable__(
            t.String({
              description: `BR-M5.4.2: تبديل الخطة المجدول — يُطبَّق عند التدوير التالي ثم يُصفَّر`,
            }),
          ),
          cancelledAt: __nullable__(t.Date()),
          cancelReason: __nullable__(t.String()),
          cancelledByUserId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `عضوية مالك — FR-M5.1. اللقطات (AR-M2) تجمّد شروط الخطة وقت التسجيل؛ تعديل الخطة
لا يمسّها إلا عند تدوير الفترة (BR-M5.4.1). تفرُّد BR-M5.1.1 (عضوية واحدة غير
نهائية لكل مالك) يُفرَض في معاملة التسجيل التسلسلية — فهرس جزئي شرطي لا يُعبَّر
عنه في برزما ولا يمرّ من فحص انجراف الهجرات (قاعدة 8).`,
        },
      ),
    ),
    groomingSession: __nullable__(
      t.Object(
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
      ),
    ),
    inpatientStay: __nullable__(
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
    ),
    taxes: t.Array(
      t.Object(
        {
          id: t.String(),
          invoiceId: t.String(),
          idx: t.Integer(),
          chargeType: t.Union(
            [
              t.Literal("ACTUAL"),
              t.Literal("ON_NET_TOTAL"),
              t.Literal("ON_PREVIOUS_ROW_AMOUNT"),
              t.Literal("ON_PREVIOUS_ROW_TOTAL"),
              t.Literal("ON_ITEM_QUANTITY"),
            ],
            { additionalProperties: false },
          ),
          accountHeadId: t.String(),
          rate: t.Number(),
          taxAmount: t.Number(),
          total: t.Number(),
          rowId: __nullable__(t.Integer()),
          description: t.String(),
          includedInPrintRate: t.Boolean(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    membershipAdjustments: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          invoiceId: t.String(),
          idx: t.Integer(),
          lineRef: t.String(),
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
          membershipId: t.String(),
          benefitId: t.String(),
          serviceId: __nullable__(t.String()),
          amount: t.Number(),
          unitsConsumed: t.Integer(),
          entitlementId: __nullable__(t.String()),
          periodStart: __nullable__(t.Date()),
          periodEnd: __nullable__(t.Date()),
          consumedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[MI-P2] BR-M6.7 — أثر تسوية العضوية على فاتورة العيادة: صف لكل تخفيض طُبّق على سطر،
بمرجع لقطة الميزة والفترة. المراجع النصية (membershipId/benefitId/entitlementId) بلا
FK عمدًا — سابقة sourceBenefitId: الأثر التدقيقي لا يجوز أن يُجرّ بحذف مصدره.
unitsConsumed هي «نية» الاستهلاك (BR-M5.3.1) — تُلتزم عند PAID بختم consumedAt.`,
        },
      ),
      { additionalProperties: false },
    ),
    claim: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          documentNo: __nullable__(t.String()),
          invoiceId: t.String(),
          policyId: t.String(),
          insurerId: t.String(),
          patientId: t.String(),
          ownerId: t.String(),
          policyNumberSnapshot: t.String(),
          serviceDate: t.Date(),
          claimedAmount: t.Number(),
          approvedAmount: __nullable__(t.Number()),
          settledAmount: t.Number(),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("APPROVED"),
              t.Literal("PARTIALLY_APPROVED"),
              t.Literal("REJECTED"),
              t.Literal("SETTLED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          coverageSnapshot: t.Any(),
          submittedAt: __nullable__(t.Date()),
          adjudicatedAt: __nullable__(t.Date()),
          rejectionReason: __nullable__(t.String()),
          insurerReference: __nullable__(t.String()),
          rejectionResolution: __nullable__(
            t.Union([t.Literal("REBILL_OWNER"), t.Literal("WRITE_OFF")], {
              additionalProperties: false,
            }),
          ),
          resolutionJournalEntryId: __nullable__(t.String()),
          resolvedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const InvoicePlainInputCreate = t.Object(
  {
    code: t.String(),
    subtotal: t.Number(),
    vatRate: t.Number(),
    vatAmount: t.Number(),
    discount: t.Optional(t.Number()),
    total: t.Number(),
    currencyCode: t.Optional(t.String()),
    insurerShare: t.Optional(__nullable__(t.Number())),
    copayShare: t.Optional(__nullable__(t.Number())),
    status: t.Optional(
      t.Union(
        [
          t.Literal("PENDING"),
          t.Literal("PARTIAL"),
          t.Literal("PAID"),
          t.Literal("VOIDED"),
          t.Literal("REFUNDED"),
        ],
        { additionalProperties: false },
      ),
    ),
    paymentMethod: t.Optional(
      __nullable__(
        t.Union([t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")], {
          additionalProperties: false,
        }),
      ),
    ),
    paidAt: t.Optional(__nullable__(t.Date())),
    refundedAt: t.Optional(__nullable__(t.Date())),
    refundReason: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const InvoicePlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    subtotal: t.Optional(t.Number()),
    vatRate: t.Optional(t.Number()),
    vatAmount: t.Optional(t.Number()),
    discount: t.Optional(t.Number()),
    total: t.Optional(t.Number()),
    currencyCode: t.Optional(t.String()),
    insurerShare: t.Optional(__nullable__(t.Number())),
    copayShare: t.Optional(__nullable__(t.Number())),
    status: t.Optional(
      t.Union(
        [
          t.Literal("PENDING"),
          t.Literal("PARTIAL"),
          t.Literal("PAID"),
          t.Literal("VOIDED"),
          t.Literal("REFUNDED"),
        ],
        { additionalProperties: false },
      ),
    ),
    paymentMethod: t.Optional(
      __nullable__(
        t.Union([t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")], {
          additionalProperties: false,
        }),
      ),
    ),
    paidAt: t.Optional(__nullable__(t.Date())),
    refundedAt: t.Optional(__nullable__(t.Date())),
    refundReason: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const InvoiceRelationsInputCreate = t.Object(
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
    refundedBy: t.Optional(
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
    labOrder: t.Optional(
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
    radiologyOrder: t.Optional(
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
    operationCase: t.Optional(
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
    taxTemplate: t.Optional(
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
    membership: t.Optional(
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
    groomingSession: t.Optional(
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
    inpatientStay: t.Optional(
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
    taxes: t.Optional(
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
    membershipAdjustments: t.Optional(
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
    claim: t.Optional(
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

export const InvoiceRelationsInputUpdate = t.Partial(
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
      refundedBy: t.Partial(
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
      labOrder: t.Partial(
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
      radiologyOrder: t.Partial(
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
      operationCase: t.Partial(
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
      taxTemplate: t.Partial(
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
      membership: t.Partial(
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
      groomingSession: t.Partial(
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
      inpatientStay: t.Partial(
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
      taxes: t.Partial(
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
      membershipAdjustments: t.Partial(
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
      claim: t.Partial(
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

export const InvoiceWhere = t.Partial(
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
          appointmentId: t.String(),
          labOrderId: t.String(),
          radiologyOrderId: t.String(),
          operationId: t.String(),
          groomingSessionId: t.String(),
          inpatientStayId: t.String(),
          subtotal: t.Number(),
          vatRate: t.Number(),
          vatAmount: t.Number(),
          taxTemplateId: t.String(),
          discount: t.Number(),
          total: t.Number(),
          amountPaid: t.Number(),
          currencyCode: t.String(),
          membershipId: t.String(),
          insurerShare: t.Number(),
          copayShare: t.Number(),
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
          paymentMethod: t.Union(
            [t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")],
            { additionalProperties: false },
          ),
          paidAt: t.Date(),
          refundedAt: t.Date(),
          refundReason: t.String(),
          refundedById: t.String(),
          stripePaymentIntentId: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Invoice" },
  ),
);

export const InvoiceWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              code: t.String(),
              appointmentId: t.String(),
              labOrderId: t.String(),
              radiologyOrderId: t.String(),
              operationId: t.String(),
              groomingSessionId: t.String(),
              inpatientStayId: t.String(),
            },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({ code: t.String() }),
            t.Object({ appointmentId: t.String() }),
            t.Object({ labOrderId: t.String() }),
            t.Object({ radiologyOrderId: t.String() }),
            t.Object({ operationId: t.String() }),
            t.Object({ groomingSessionId: t.String() }),
            t.Object({ inpatientStayId: t.String() }),
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
              code: t.String(),
              clinicId: t.String(),
              appointmentId: t.String(),
              labOrderId: t.String(),
              radiologyOrderId: t.String(),
              operationId: t.String(),
              groomingSessionId: t.String(),
              inpatientStayId: t.String(),
              subtotal: t.Number(),
              vatRate: t.Number(),
              vatAmount: t.Number(),
              taxTemplateId: t.String(),
              discount: t.Number(),
              total: t.Number(),
              amountPaid: t.Number(),
              currencyCode: t.String(),
              membershipId: t.String(),
              insurerShare: t.Number(),
              copayShare: t.Number(),
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
              paymentMethod: t.Union(
                [t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")],
                { additionalProperties: false },
              ),
              paidAt: t.Date(),
              refundedAt: t.Date(),
              refundReason: t.String(),
              refundedById: t.String(),
              stripePaymentIntentId: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Invoice" },
);

export const InvoiceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      appointmentId: t.Boolean(),
      labOrderId: t.Boolean(),
      radiologyOrderId: t.Boolean(),
      operationId: t.Boolean(),
      groomingSessionId: t.Boolean(),
      inpatientStayId: t.Boolean(),
      subtotal: t.Boolean(),
      vatRate: t.Boolean(),
      vatAmount: t.Boolean(),
      taxTemplateId: t.Boolean(),
      discount: t.Boolean(),
      total: t.Boolean(),
      amountPaid: t.Boolean(),
      currencyCode: t.Boolean(),
      membershipId: t.Boolean(),
      insurerShare: t.Boolean(),
      copayShare: t.Boolean(),
      status: t.Boolean(),
      paymentMethod: t.Boolean(),
      paidAt: t.Boolean(),
      refundedAt: t.Boolean(),
      refundReason: t.Boolean(),
      refundedById: t.Boolean(),
      stripePaymentIntentId: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      refundedBy: t.Boolean(),
      appointment: t.Boolean(),
      labOrder: t.Boolean(),
      radiologyOrder: t.Boolean(),
      operationCase: t.Boolean(),
      taxTemplate: t.Boolean(),
      membership: t.Boolean(),
      groomingSession: t.Boolean(),
      inpatientStay: t.Boolean(),
      taxes: t.Boolean(),
      membershipAdjustments: t.Boolean(),
      claim: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const InvoiceInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      paymentMethod: t.Boolean(),
      clinic: t.Boolean(),
      refundedBy: t.Boolean(),
      appointment: t.Boolean(),
      labOrder: t.Boolean(),
      radiologyOrder: t.Boolean(),
      operationCase: t.Boolean(),
      taxTemplate: t.Boolean(),
      membership: t.Boolean(),
      groomingSession: t.Boolean(),
      inpatientStay: t.Boolean(),
      taxes: t.Boolean(),
      membershipAdjustments: t.Boolean(),
      claim: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const InvoiceOrderBy = t.Partial(
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
      appointmentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      labOrderId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      radiologyOrderId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      operationId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      groomingSessionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      inpatientStayId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      subtotal: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      vatRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      vatAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      taxTemplateId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      discount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      total: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      amountPaid: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      currencyCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      membershipId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      insurerShare: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      copayShare: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      paidAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      refundedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      refundReason: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      refundedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      stripePaymentIntentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Invoice = t.Composite([InvoicePlain, InvoiceRelations], {
  additionalProperties: false,
});

export const InvoiceInputCreate = t.Composite(
  [InvoicePlainInputCreate, InvoiceRelationsInputCreate],
  { additionalProperties: false },
);

export const InvoiceInputUpdate = t.Composite(
  [InvoicePlainInputUpdate, InvoiceRelationsInputUpdate],
  { additionalProperties: false },
);
