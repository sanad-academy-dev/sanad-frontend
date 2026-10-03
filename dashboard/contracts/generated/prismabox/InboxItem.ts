import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InboxItemPlain = t.Object(
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
        [t.Literal("PENDING"), t.Literal("ACCEPTED"), t.Literal("REJECTED")],
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
);

export const InboxItemRelations = t.Object(
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
    patient: __nullable__(
      t.Object(
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
    ),
    owner: __nullable__(
      t.Object(
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
    task: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          code: t.String(),
          title: t.String(),
          content: __nullable__(t.String()),
          type: t.Union(
            [
              t.Literal("ADMINISTRATIVE"),
              t.Literal("PHARMACEUTICALS"),
              t.Literal("INVENTORY"),
              t.Literal("FINANCE"),
              t.Literal("LABORATORY"),
              t.Literal("COSMETICS"),
              t.Literal("MEDICAL"),
            ],
            { additionalProperties: false },
          ),
          status: t.Union(
            [
              t.Literal("PENDING"),
              t.Literal("NOT_YET_STARTED"),
              t.Literal("IN_PROGRESS"),
              t.Literal("COMPLETED"),
              t.Literal("CANCELLED"),
              t.Literal("DUPLICATE"),
              t.Literal("QUEUE"),
            ],
            { additionalProperties: false },
          ),
          priority: t.Union(
            [
              t.Literal("LOW"),
              t.Literal("MEDIUM"),
              t.Literal("HIGH"),
              t.Literal("URGENT"),
            ],
            { additionalProperties: false },
          ),
          createdById: __nullable__(t.String()),
          deadline: __nullable__(t.Date()),
          images: t.Array(t.String(), { additionalProperties: false }),
          declinedAt: __nullable__(t.Date()),
          declineReason: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    conversation: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          kind: t.Union([t.Literal("DIRECT"), t.Literal("GROUP")], {
            additionalProperties: false,
          }),
          title: __nullable__(t.String()),
          createdById: t.String(),
          lastMessageAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    operation: __nullable__(
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
    lead: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          firstName: t.String(),
          lastName: __nullable__(t.String()),
          fullName: t.String({
            description: `مشتقّ من الجزأين (BR-C3.1) — يُخزَّن ليُبحَث ويُرتَّب عليه بلا حساب في كل استعلام`,
          }),
          gender: __nullable__(
            t.Union(
              [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
              { additionalProperties: false },
            ),
          ),
          mobile: t.String(),
          mobileNormalized: __nullable__(
            t.String({
              description: `[CRM-P1 Q2] الشكل القابل للمقارنة وحده — يُشتقّ بـ\`normalizePhone\` من
\`src/lib/validation/phone.ts\` (النسخة المرجعية تحت lib/، لا نظيرتها في
vaccination-reminder التي تُخرج شكلًا مختلفًا). \`mobile\` يبقى كما أدخله المستخدم،
تمامًا كما يفعل \`Owner.phone\`. لا قيد فريد: BR-C3.2 تحذير لا رفض.`,
            }),
          ),
          phone: __nullable__(t.String()),
          email: __nullable__(t.String()),
          city: __nullable__(t.String()),
          address: __nullable__(t.String()),
          petSpecies: __nullable__(t.String()),
          petCount: __nullable__(t.Integer()),
          petNotes: __nullable__(t.String()),
          statusId: t.String(),
          sourceId: __nullable__(t.String()),
          ownerUserId: __nullable__(t.String()),
          communicationStatus: __nullable__(t.String()),
          lostReasonId: __nullable__(t.String()),
          lostNotes: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          convertedDealId: __nullable__(
            t.String({
              description: `[CRM-P2] §5 — التحويل. §3.1 يذكرهما، وCRM-P1 لم يشحنهما لأن §15 يضع «أعمدة التحويل»
في P2. \`convertedDealId\` بلا علاقة صريحة: الصفقة تحمل \`leadId\` وهي الجهة المالكة
للعلاقة، وعمودٌ ثانٍ بعلاقةٍ معاكسة يخلق دورةً في المخطَّط بلا فائدة.`,
            }),
          ),
          convertedAt: __nullable__(t.Date()),
          slaPolicyId: __nullable__(
            t.String({
              description: `[CRM-P5] §10 — نفس الحقول الخمسة التي حملتها الصفقة منذ CRM-P2 فارغة. السياسة
تنطبق على العميل المحتمل أو الصفقة أو كليهما (§10.1)، فلا معنى لعمودٍ على أحدهما.
\`slaPolicyId\` **لقطة** لا علاقة حيّة: تعديل السياسة بعد انطباقها لا يُحرّك موعدًا
قائمًا، وحذفها لا يمحو تاريخ الاستجابة.`,
            }),
          ),
          responseBy: __nullable__(t.Date()),
          firstRespondedAt: __nullable__(t.Date()),
          firstResponseDuration: __nullable__(t.Integer()),
          slaStatus: __nullable__(
            t.Union(
              [t.Literal("DUE"), t.Literal("FULFILLED"), t.Literal("FAILED")],
              {
                additionalProperties: false,
                description: `[CRM-P2] §10.3 — حالة اتفاقية مستوى الخدمة. العمود يُشحن فارغًا الآن؛ المحرّك في CRM-P5.`,
              },
            ),
          ),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false, description: `§3.1 — العميل المحتمل.` },
      ),
    ),
    deal: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          leadId: __nullable__(
            t.String({ description: `أصل الصفقة حين جاءت من عميل محتمل (§5)` }),
          ),
          ownerId: __nullable__(
            t.String({
              description: `مالكٌ قائم في elite-vet حين كان الشخص معروفًا مسبقًا (BR-C5.3)`,
            }),
          ),
          sourceId: __nullable__(
            t.String({
              description: `مصدر الصفقة — لقطةٌ تُنسخ عند التحويل وتبقى قابلة للتحرير (§5، §17.2 صفّ ٩).
عمودٌ على الصفقة لا قراءةً عبر \`leadId\`: قمع §12 يجمع بالمصدر، و\`leadId\` قابل
للإفراغ (\`SetNull\`)، فقراءةٌ عبره تفقد المصدر متى حُذف العميل المحتمل.`,
            }),
          ),
          firstName: t.String(),
          lastName: __nullable__(t.String()),
          fullName: t.String(),
          gender: __nullable__(
            t.Union(
              [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
              { additionalProperties: false },
            ),
          ),
          mobile: t.String(),
          mobileNormalized: __nullable__(
            t.String({
              description: `الشكل القابل للمقارنة — نفس اشتقاق العميل المحتمل (\`@/lib/validation/phone\`)`,
            }),
          ),
          phone: __nullable__(t.String()),
          email: __nullable__(t.String()),
          city: __nullable__(t.String()),
          address: __nullable__(t.String()),
          petSpecies: __nullable__(t.String()),
          petCount: __nullable__(t.Integer()),
          petNotes: __nullable__(t.String()),
          statusId: t.String(),
          probability: t.Number({
            description: `نسبة النجاح؛ تُملأ افتراضًا من الحالة (§2) ما لم يتجاوزها المستخدم (BR-C4.2)`,
          }),
          probabilityOverridden: t.Boolean({
            description: `BR-C4.2 — الانحراف المقصود عن النظام المرجعي: هذا العلم يمنع إعادة الافتراض الصامت`,
          }),
          expectedCloseDate: __nullable__(t.Date()),
          closedDate: __nullable__(
            t.Date({
              description: `يُختم تلقائيًّا عند دخول حالة من نوع WON (§4.1)`,
            }),
          ),
          dealValue: t.Number({
            description: `Σ سطور المنتجات حين توجد، وإلّا يدويّ (BR-C6.1)`,
          }),
          expectedValue: t.Number({
            description: `dealValue × probability ÷ 100 — يُعاد حسابه عند تغيّر أيٍّ منهما (BR-C4.2)`,
          }),
          wonOwnerId: __nullable__(
            t.String({
              description: `المالك الذي حُسم إليه الفوز (§7.2) — يُختم داخل معاملة الفوز`,
            }),
          ),
          lostReasonId: __nullable__(t.String()),
          lostNotes: __nullable__(t.String()),
          slaPolicyId: __nullable__(
            t.String({
              description: `§10 — حقول اتفاقية مستوى الخدمة، فارغة حتى CRM-P5 يبني المحرّك`,
            }),
          ),
          responseBy: __nullable__(t.Date()),
          firstRespondedAt: __nullable__(t.Date()),
          firstResponseDuration: __nullable__(t.Integer()),
          slaStatus: __nullable__(
            t.Union(
              [t.Literal("DUE"), t.Literal("FULFILLED"), t.Literal("FAILED")],
              {
                additionalProperties: false,
                description: `[CRM-P2] §10.3 — حالة اتفاقية مستوى الخدمة. العمود يُشحن فارغًا الآن؛ المحرّك في CRM-P5.`,
              },
            ),
          ),
          ownerUserId: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[CRM-P2] §4.1 — الصفقة. تُنشأ من التحويل (§5) أو مباشرةً، ولا تصير «مكسوبة» إلا عبر
مسار §7 داخل المعاملة نفسها (BR-C4.1).`,
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
    activity: t.Array(
      t.Object(
        {
          id: t.String(),
          itemId: t.String(),
          authorUserId: t.String(),
          type: t.Union(
            [
              t.Literal("CREATED"),
              t.Literal("COMMENT"),
              t.Literal("ACCEPTED"),
              t.Literal("REJECTED"),
              t.Literal("STATUS_CHANGED"),
            ],
            { additionalProperties: false },
          ),
          body: __nullable__(t.String()),
          metadata: __nullable__(t.Any()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    reads: t.Array(
      t.Object(
        {
          id: t.String(),
          itemId: t.String(),
          userId: t.String(),
          readAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const InboxItemPlainInputCreate = t.Object(
  {
    kind: t.Optional(
      t.Union([t.Literal("NOTIFICATION"), t.Literal("APPROVAL")], {
        additionalProperties: false,
      }),
    ),
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
    importance: t.Optional(
      t.Union([t.Literal("LOW"), t.Literal("NORMAL"), t.Literal("HIGH")], {
        additionalProperties: false,
      }),
    ),
    status: t.Optional(
      t.Union([t.Literal("DRAFT"), t.Literal("OPEN"), t.Literal("RESOLVED")], {
        additionalProperties: false,
      }),
    ),
    approvalStatus: t.Optional(
      __nullable__(
        t.Union(
          [t.Literal("PENDING"), t.Literal("ACCEPTED"), t.Literal("REJECTED")],
          { additionalProperties: false },
        ),
      ),
    ),
  },
  { additionalProperties: false },
);

export const InboxItemPlainInputUpdate = t.Object(
  {
    kind: t.Optional(
      t.Union([t.Literal("NOTIFICATION"), t.Literal("APPROVAL")], {
        additionalProperties: false,
      }),
    ),
    type: t.Optional(
      t.Union(
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
    ),
    title: t.Optional(t.String()),
    importance: t.Optional(
      t.Union([t.Literal("LOW"), t.Literal("NORMAL"), t.Literal("HIGH")], {
        additionalProperties: false,
      }),
    ),
    status: t.Optional(
      t.Union([t.Literal("DRAFT"), t.Literal("OPEN"), t.Literal("RESOLVED")], {
        additionalProperties: false,
      }),
    ),
    approvalStatus: t.Optional(
      __nullable__(
        t.Union(
          [t.Literal("PENDING"), t.Literal("ACCEPTED"), t.Literal("REJECTED")],
          { additionalProperties: false },
        ),
      ),
    ),
  },
  { additionalProperties: false },
);

export const InboxItemRelationsInputCreate = t.Object(
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
    patient: t.Optional(
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
    owner: t.Optional(
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
    task: t.Optional(
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
    conversation: t.Optional(
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
    operation: t.Optional(
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
    lead: t.Optional(
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
    deal: t.Optional(
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
    reads: t.Optional(
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

export const InboxItemRelationsInputUpdate = t.Partial(
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
      patient: t.Partial(
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
      owner: t.Partial(
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
      task: t.Partial(
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
      conversation: t.Partial(
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
      operation: t.Partial(
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
      lead: t.Partial(
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
      deal: t.Partial(
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
      reads: t.Partial(
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

export const InboxItemWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
          approvalStatus: t.Union(
            [
              t.Literal("PENDING"),
              t.Literal("ACCEPTED"),
              t.Literal("REJECTED"),
            ],
            { additionalProperties: false },
          ),
          patientId: t.String(),
          ownerId: t.String(),
          staffId: t.String(),
          appointmentId: t.String(),
          taskId: t.String(),
          conversationId: t.String(),
          operationId: t.String(),
          groomingSessionId: t.String(),
          leadId: t.String(),
          dealId: t.String(),
          inpatientStayId: t.String(),
          recipientUserId: t.String(),
          createdById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "InboxItem" },
  ),
);

export const InboxItemWhereUnique = t.Recursive(
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
              clinicId: t.String(),
              kind: t.Union(
                [t.Literal("NOTIFICATION"), t.Literal("APPROVAL")],
                { additionalProperties: false },
              ),
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
              approvalStatus: t.Union(
                [
                  t.Literal("PENDING"),
                  t.Literal("ACCEPTED"),
                  t.Literal("REJECTED"),
                ],
                { additionalProperties: false },
              ),
              patientId: t.String(),
              ownerId: t.String(),
              staffId: t.String(),
              appointmentId: t.String(),
              taskId: t.String(),
              conversationId: t.String(),
              operationId: t.String(),
              groomingSessionId: t.String(),
              leadId: t.String(),
              dealId: t.String(),
              inpatientStayId: t.String(),
              recipientUserId: t.String(),
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
  { $id: "InboxItem" },
);

export const InboxItemSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      kind: t.Boolean(),
      type: t.Boolean(),
      title: t.Boolean(),
      importance: t.Boolean(),
      status: t.Boolean(),
      approvalStatus: t.Boolean(),
      patientId: t.Boolean(),
      ownerId: t.Boolean(),
      staffId: t.Boolean(),
      appointmentId: t.Boolean(),
      taskId: t.Boolean(),
      conversationId: t.Boolean(),
      operationId: t.Boolean(),
      groomingSessionId: t.Boolean(),
      leadId: t.Boolean(),
      dealId: t.Boolean(),
      inpatientStayId: t.Boolean(),
      recipientUserId: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      patient: t.Boolean(),
      owner: t.Boolean(),
      appointment: t.Boolean(),
      task: t.Boolean(),
      conversation: t.Boolean(),
      operation: t.Boolean(),
      groomingSession: t.Boolean(),
      lead: t.Boolean(),
      deal: t.Boolean(),
      inpatientStay: t.Boolean(),
      createdBy: t.Boolean(),
      activity: t.Boolean(),
      reads: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const InboxItemInclude = t.Partial(
  t.Object(
    {
      kind: t.Boolean(),
      type: t.Boolean(),
      importance: t.Boolean(),
      status: t.Boolean(),
      approvalStatus: t.Boolean(),
      clinic: t.Boolean(),
      patient: t.Boolean(),
      owner: t.Boolean(),
      appointment: t.Boolean(),
      task: t.Boolean(),
      conversation: t.Boolean(),
      operation: t.Boolean(),
      groomingSession: t.Boolean(),
      lead: t.Boolean(),
      deal: t.Boolean(),
      inpatientStay: t.Boolean(),
      createdBy: t.Boolean(),
      activity: t.Boolean(),
      reads: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const InboxItemOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      title: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      patientId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ownerId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      staffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      appointmentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      taskId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      conversationId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      operationId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      groomingSessionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      leadId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dealId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      inpatientStayId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      recipientUserId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const InboxItem = t.Composite([InboxItemPlain, InboxItemRelations], {
  additionalProperties: false,
});

export const InboxItemInputCreate = t.Composite(
  [InboxItemPlainInputCreate, InboxItemRelationsInputCreate],
  { additionalProperties: false },
);

export const InboxItemInputUpdate = t.Composite(
  [InboxItemPlainInputUpdate, InboxItemRelationsInputUpdate],
  { additionalProperties: false },
);
