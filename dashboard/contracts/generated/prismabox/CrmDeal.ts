import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CrmDealPlain = t.Object(
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
      t.Union([t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")], {
        additionalProperties: false,
      }),
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
      t.Union([t.Literal("DUE"), t.Literal("FULFILLED"), t.Literal("FAILED")], {
        additionalProperties: false,
        description: `[CRM-P2] §10.3 — حالة اتفاقية مستوى الخدمة. العمود يُشحن فارغًا الآن؛ المحرّك في CRM-P5.`,
      }),
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
);

export const CrmDealRelations = t.Object(
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
    wonOwner: __nullable__(
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
    status: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        name: t.String(),
        color: t.String(),
        order: t.Integer(),
        kind: t.Union(
          [t.Literal("OPEN"), t.Literal("WON"), t.Literal("LOST")],
          { additionalProperties: false },
        ),
        defaultProbability: t.Number(),
        active: t.Boolean(),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    lostReason: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          name: t.String(),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    source: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          name: t.String(),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    ownerUser: __nullable__(
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
    products: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          dealId: t.String(),
          itemType: t.Union(
            [
              t.Literal("SERVICE"),
              t.Literal("MEMBERSHIP_PLAN"),
              t.Literal("FREE_TEXT"),
            ],
            {
              additionalProperties: false,
              description: `[CRM-P2] §6.1 — نوع سطر المنتج في الصفقة.`,
            },
          ),
          itemId: __nullable__(
            t.String({
              description: `مُعرّف الخدمة أو باقة العضوية حسب النوع؛ فارغ لسطر النصّ الحرّ`,
            }),
          ),
          label: t.String(),
          qty: t.Number(),
          unitPrice: t.Number(),
          lineTotal: t.Number(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[CRM-P2] §6.1 — سطور عرض السعر. أسعارٌ **تقديرية** (BR-C6.2): لا نداء لمَعبر التسعير،
ولا ضريبة، ولا محرّك منافع (§0.4). \`label\` لقطةٌ لأن الخدمة قد يتغيّر اسمها لاحقًا.`,
        },
      ),
      { additionalProperties: false },
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
    description: `[CRM-P2] §4.1 — الصفقة. تُنشأ من التحويل (§5) أو مباشرةً، ولا تصير «مكسوبة» إلا عبر
مسار §7 داخل المعاملة نفسها (BR-C4.1).`,
  },
);

export const CrmDealPlainInputCreate = t.Object(
  {
    code: t.String(),
    firstName: t.String(),
    lastName: t.Optional(__nullable__(t.String())),
    fullName: t.String(),
    gender: t.Optional(
      __nullable__(
        t.Union(
          [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
          { additionalProperties: false },
        ),
      ),
    ),
    mobile: t.String(),
    mobileNormalized: t.Optional(
      __nullable__(
        t.String({
          description: `الشكل القابل للمقارنة — نفس اشتقاق العميل المحتمل (\`@/lib/validation/phone\`)`,
        }),
      ),
    ),
    phone: t.Optional(__nullable__(t.String())),
    email: t.Optional(__nullable__(t.String())),
    city: t.Optional(__nullable__(t.String())),
    address: t.Optional(__nullable__(t.String())),
    petSpecies: t.Optional(__nullable__(t.String())),
    petCount: t.Optional(__nullable__(t.Integer())),
    petNotes: t.Optional(__nullable__(t.String())),
    probability: t.Optional(
      t.Number({
        description: `نسبة النجاح؛ تُملأ افتراضًا من الحالة (§2) ما لم يتجاوزها المستخدم (BR-C4.2)`,
      }),
    ),
    probabilityOverridden: t.Optional(
      t.Boolean({
        description: `BR-C4.2 — الانحراف المقصود عن النظام المرجعي: هذا العلم يمنع إعادة الافتراض الصامت`,
      }),
    ),
    expectedCloseDate: t.Optional(__nullable__(t.Date())),
    closedDate: t.Optional(
      __nullable__(
        t.Date({
          description: `يُختم تلقائيًّا عند دخول حالة من نوع WON (§4.1)`,
        }),
      ),
    ),
    dealValue: t.Optional(
      t.Number({
        description: `Σ سطور المنتجات حين توجد، وإلّا يدويّ (BR-C6.1)`,
      }),
    ),
    expectedValue: t.Optional(
      t.Number({
        description: `dealValue × probability ÷ 100 — يُعاد حسابه عند تغيّر أيٍّ منهما (BR-C4.2)`,
      }),
    ),
    lostNotes: t.Optional(__nullable__(t.String())),
    responseBy: t.Optional(__nullable__(t.Date())),
    firstRespondedAt: t.Optional(__nullable__(t.Date())),
    firstResponseDuration: t.Optional(__nullable__(t.Integer())),
    slaStatus: t.Optional(
      __nullable__(
        t.Union(
          [t.Literal("DUE"), t.Literal("FULFILLED"), t.Literal("FAILED")],
          {
            additionalProperties: false,
            description: `[CRM-P2] §10.3 — حالة اتفاقية مستوى الخدمة. العمود يُشحن فارغًا الآن؛ المحرّك في CRM-P5.`,
          },
        ),
      ),
    ),
    notes: t.Optional(__nullable__(t.String())),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `[CRM-P2] §4.1 — الصفقة. تُنشأ من التحويل (§5) أو مباشرةً، ولا تصير «مكسوبة» إلا عبر
مسار §7 داخل المعاملة نفسها (BR-C4.1).`,
  },
);

export const CrmDealPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    firstName: t.Optional(t.String()),
    lastName: t.Optional(__nullable__(t.String())),
    fullName: t.Optional(t.String()),
    gender: t.Optional(
      __nullable__(
        t.Union(
          [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
          { additionalProperties: false },
        ),
      ),
    ),
    mobile: t.Optional(t.String()),
    mobileNormalized: t.Optional(
      __nullable__(
        t.String({
          description: `الشكل القابل للمقارنة — نفس اشتقاق العميل المحتمل (\`@/lib/validation/phone\`)`,
        }),
      ),
    ),
    phone: t.Optional(__nullable__(t.String())),
    email: t.Optional(__nullable__(t.String())),
    city: t.Optional(__nullable__(t.String())),
    address: t.Optional(__nullable__(t.String())),
    petSpecies: t.Optional(__nullable__(t.String())),
    petCount: t.Optional(__nullable__(t.Integer())),
    petNotes: t.Optional(__nullable__(t.String())),
    probability: t.Optional(
      t.Number({
        description: `نسبة النجاح؛ تُملأ افتراضًا من الحالة (§2) ما لم يتجاوزها المستخدم (BR-C4.2)`,
      }),
    ),
    probabilityOverridden: t.Optional(
      t.Boolean({
        description: `BR-C4.2 — الانحراف المقصود عن النظام المرجعي: هذا العلم يمنع إعادة الافتراض الصامت`,
      }),
    ),
    expectedCloseDate: t.Optional(__nullable__(t.Date())),
    closedDate: t.Optional(
      __nullable__(
        t.Date({
          description: `يُختم تلقائيًّا عند دخول حالة من نوع WON (§4.1)`,
        }),
      ),
    ),
    dealValue: t.Optional(
      t.Number({
        description: `Σ سطور المنتجات حين توجد، وإلّا يدويّ (BR-C6.1)`,
      }),
    ),
    expectedValue: t.Optional(
      t.Number({
        description: `dealValue × probability ÷ 100 — يُعاد حسابه عند تغيّر أيٍّ منهما (BR-C4.2)`,
      }),
    ),
    lostNotes: t.Optional(__nullable__(t.String())),
    responseBy: t.Optional(__nullable__(t.Date())),
    firstRespondedAt: t.Optional(__nullable__(t.Date())),
    firstResponseDuration: t.Optional(__nullable__(t.Integer())),
    slaStatus: t.Optional(
      __nullable__(
        t.Union(
          [t.Literal("DUE"), t.Literal("FULFILLED"), t.Literal("FAILED")],
          {
            additionalProperties: false,
            description: `[CRM-P2] §10.3 — حالة اتفاقية مستوى الخدمة. العمود يُشحن فارغًا الآن؛ المحرّك في CRM-P5.`,
          },
        ),
      ),
    ),
    notes: t.Optional(__nullable__(t.String())),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `[CRM-P2] §4.1 — الصفقة. تُنشأ من التحويل (§5) أو مباشرةً، ولا تصير «مكسوبة» إلا عبر
مسار §7 داخل المعاملة نفسها (BR-C4.1).`,
  },
);

export const CrmDealRelationsInputCreate = t.Object(
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
    wonOwner: t.Optional(
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
    status: t.Object(
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
    lostReason: t.Optional(
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
    source: t.Optional(
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
    ownerUser: t.Optional(
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
    description: `[CRM-P2] §4.1 — الصفقة. تُنشأ من التحويل (§5) أو مباشرةً، ولا تصير «مكسوبة» إلا عبر
مسار §7 داخل المعاملة نفسها (BR-C4.1).`,
  },
);

export const CrmDealRelationsInputUpdate = t.Partial(
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
      wonOwner: t.Partial(
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
      status: t.Object(
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
      lostReason: t.Partial(
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
      source: t.Partial(
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
      ownerUser: t.Partial(
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
      description: `[CRM-P2] §4.1 — الصفقة. تُنشأ من التحويل (§5) أو مباشرةً، ولا تصير «مكسوبة» إلا عبر
مسار §7 داخل المعاملة نفسها (BR-C4.1).`,
    },
  ),
);

export const CrmDealWhere = t.Partial(
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
          leadId: t.String({
            description: `أصل الصفقة حين جاءت من عميل محتمل (§5)`,
          }),
          ownerId: t.String({
            description: `مالكٌ قائم في elite-vet حين كان الشخص معروفًا مسبقًا (BR-C5.3)`,
          }),
          sourceId: t.String({
            description: `مصدر الصفقة — لقطةٌ تُنسخ عند التحويل وتبقى قابلة للتحرير (§5، §17.2 صفّ ٩).
عمودٌ على الصفقة لا قراءةً عبر \`leadId\`: قمع §12 يجمع بالمصدر، و\`leadId\` قابل
للإفراغ (\`SetNull\`)، فقراءةٌ عبره تفقد المصدر متى حُذف العميل المحتمل.`,
          }),
          firstName: t.String(),
          lastName: t.String(),
          fullName: t.String(),
          gender: t.Union(
            [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
            { additionalProperties: false },
          ),
          mobile: t.String(),
          mobileNormalized: t.String({
            description: `الشكل القابل للمقارنة — نفس اشتقاق العميل المحتمل (\`@/lib/validation/phone\`)`,
          }),
          phone: t.String(),
          email: t.String(),
          city: t.String(),
          address: t.String(),
          petSpecies: t.String(),
          petCount: t.Integer(),
          petNotes: t.String(),
          statusId: t.String(),
          probability: t.Number({
            description: `نسبة النجاح؛ تُملأ افتراضًا من الحالة (§2) ما لم يتجاوزها المستخدم (BR-C4.2)`,
          }),
          probabilityOverridden: t.Boolean({
            description: `BR-C4.2 — الانحراف المقصود عن النظام المرجعي: هذا العلم يمنع إعادة الافتراض الصامت`,
          }),
          expectedCloseDate: t.Date(),
          closedDate: t.Date({
            description: `يُختم تلقائيًّا عند دخول حالة من نوع WON (§4.1)`,
          }),
          dealValue: t.Number({
            description: `Σ سطور المنتجات حين توجد، وإلّا يدويّ (BR-C6.1)`,
          }),
          expectedValue: t.Number({
            description: `dealValue × probability ÷ 100 — يُعاد حسابه عند تغيّر أيٍّ منهما (BR-C4.2)`,
          }),
          wonOwnerId: t.String({
            description: `المالك الذي حُسم إليه الفوز (§7.2) — يُختم داخل معاملة الفوز`,
          }),
          lostReasonId: t.String(),
          lostNotes: t.String(),
          slaPolicyId: t.String({
            description: `§10 — حقول اتفاقية مستوى الخدمة، فارغة حتى CRM-P5 يبني المحرّك`,
          }),
          responseBy: t.Date(),
          firstRespondedAt: t.Date(),
          firstResponseDuration: t.Integer(),
          slaStatus: t.Union(
            [t.Literal("DUE"), t.Literal("FULFILLED"), t.Literal("FAILED")],
            {
              additionalProperties: false,
              description: `[CRM-P2] §10.3 — حالة اتفاقية مستوى الخدمة. العمود يُشحن فارغًا الآن؛ المحرّك في CRM-P5.`,
            },
          ),
          ownerUserId: t.String(),
          notes: t.String(),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[CRM-P2] §4.1 — الصفقة. تُنشأ من التحويل (§5) أو مباشرةً، ولا تصير «مكسوبة» إلا عبر
مسار §7 داخل المعاملة نفسها (BR-C4.1).`,
        },
      ),
    { $id: "CrmDeal" },
  ),
);

export const CrmDealWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), code: t.String() },
            {
              additionalProperties: false,
              description: `[CRM-P2] §4.1 — الصفقة. تُنشأ من التحويل (§5) أو مباشرةً، ولا تصير «مكسوبة» إلا عبر
مسار §7 داخل المعاملة نفسها (BR-C4.1).`,
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
              leadId: t.String({
                description: `أصل الصفقة حين جاءت من عميل محتمل (§5)`,
              }),
              ownerId: t.String({
                description: `مالكٌ قائم في elite-vet حين كان الشخص معروفًا مسبقًا (BR-C5.3)`,
              }),
              sourceId: t.String({
                description: `مصدر الصفقة — لقطةٌ تُنسخ عند التحويل وتبقى قابلة للتحرير (§5، §17.2 صفّ ٩).
عمودٌ على الصفقة لا قراءةً عبر \`leadId\`: قمع §12 يجمع بالمصدر، و\`leadId\` قابل
للإفراغ (\`SetNull\`)، فقراءةٌ عبره تفقد المصدر متى حُذف العميل المحتمل.`,
              }),
              firstName: t.String(),
              lastName: t.String(),
              fullName: t.String(),
              gender: t.Union(
                [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
                { additionalProperties: false },
              ),
              mobile: t.String(),
              mobileNormalized: t.String({
                description: `الشكل القابل للمقارنة — نفس اشتقاق العميل المحتمل (\`@/lib/validation/phone\`)`,
              }),
              phone: t.String(),
              email: t.String(),
              city: t.String(),
              address: t.String(),
              petSpecies: t.String(),
              petCount: t.Integer(),
              petNotes: t.String(),
              statusId: t.String(),
              probability: t.Number({
                description: `نسبة النجاح؛ تُملأ افتراضًا من الحالة (§2) ما لم يتجاوزها المستخدم (BR-C4.2)`,
              }),
              probabilityOverridden: t.Boolean({
                description: `BR-C4.2 — الانحراف المقصود عن النظام المرجعي: هذا العلم يمنع إعادة الافتراض الصامت`,
              }),
              expectedCloseDate: t.Date(),
              closedDate: t.Date({
                description: `يُختم تلقائيًّا عند دخول حالة من نوع WON (§4.1)`,
              }),
              dealValue: t.Number({
                description: `Σ سطور المنتجات حين توجد، وإلّا يدويّ (BR-C6.1)`,
              }),
              expectedValue: t.Number({
                description: `dealValue × probability ÷ 100 — يُعاد حسابه عند تغيّر أيٍّ منهما (BR-C4.2)`,
              }),
              wonOwnerId: t.String({
                description: `المالك الذي حُسم إليه الفوز (§7.2) — يُختم داخل معاملة الفوز`,
              }),
              lostReasonId: t.String(),
              lostNotes: t.String(),
              slaPolicyId: t.String({
                description: `§10 — حقول اتفاقية مستوى الخدمة، فارغة حتى CRM-P5 يبني المحرّك`,
              }),
              responseBy: t.Date(),
              firstRespondedAt: t.Date(),
              firstResponseDuration: t.Integer(),
              slaStatus: t.Union(
                [t.Literal("DUE"), t.Literal("FULFILLED"), t.Literal("FAILED")],
                {
                  additionalProperties: false,
                  description: `[CRM-P2] §10.3 — حالة اتفاقية مستوى الخدمة. العمود يُشحن فارغًا الآن؛ المحرّك في CRM-P5.`,
                },
              ),
              ownerUserId: t.String(),
              notes: t.String(),
              active: t.Boolean(),
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
  { $id: "CrmDeal" },
);

export const CrmDealSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      leadId: t.Boolean(),
      ownerId: t.Boolean(),
      sourceId: t.Boolean(),
      firstName: t.Boolean(),
      lastName: t.Boolean(),
      fullName: t.Boolean(),
      gender: t.Boolean(),
      mobile: t.Boolean(),
      mobileNormalized: t.Boolean(),
      phone: t.Boolean(),
      email: t.Boolean(),
      city: t.Boolean(),
      address: t.Boolean(),
      petSpecies: t.Boolean(),
      petCount: t.Boolean(),
      petNotes: t.Boolean(),
      statusId: t.Boolean(),
      probability: t.Boolean(),
      probabilityOverridden: t.Boolean(),
      expectedCloseDate: t.Boolean(),
      closedDate: t.Boolean(),
      dealValue: t.Boolean(),
      expectedValue: t.Boolean(),
      wonOwnerId: t.Boolean(),
      lostReasonId: t.Boolean(),
      lostNotes: t.Boolean(),
      slaPolicyId: t.Boolean(),
      responseBy: t.Boolean(),
      firstRespondedAt: t.Boolean(),
      firstResponseDuration: t.Boolean(),
      slaStatus: t.Boolean(),
      ownerUserId: t.Boolean(),
      notes: t.Boolean(),
      active: t.Boolean(),
      isDeleted: t.Boolean(),
      deletedAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      lead: t.Boolean(),
      owner: t.Boolean(),
      wonOwner: t.Boolean(),
      status: t.Boolean(),
      lostReason: t.Boolean(),
      source: t.Boolean(),
      ownerUser: t.Boolean(),
      products: t.Boolean(),
      inboxItems: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[CRM-P2] §4.1 — الصفقة. تُنشأ من التحويل (§5) أو مباشرةً، ولا تصير «مكسوبة» إلا عبر
مسار §7 داخل المعاملة نفسها (BR-C4.1).`,
    },
  ),
);

export const CrmDealInclude = t.Partial(
  t.Object(
    {
      gender: t.Boolean(),
      slaStatus: t.Boolean(),
      clinic: t.Boolean(),
      lead: t.Boolean(),
      owner: t.Boolean(),
      wonOwner: t.Boolean(),
      status: t.Boolean(),
      lostReason: t.Boolean(),
      source: t.Boolean(),
      ownerUser: t.Boolean(),
      products: t.Boolean(),
      inboxItems: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[CRM-P2] §4.1 — الصفقة. تُنشأ من التحويل (§5) أو مباشرةً، ولا تصير «مكسوبة» إلا عبر
مسار §7 داخل المعاملة نفسها (BR-C4.1).`,
    },
  ),
);

export const CrmDealOrderBy = t.Partial(
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
      leadId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ownerId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sourceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      firstName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lastName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fullName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      mobile: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      mobileNormalized: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      phone: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      email: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      city: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      address: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      petSpecies: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      petCount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      petNotes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      statusId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      probability: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      probabilityOverridden: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      expectedCloseDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      closedDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dealValue: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      expectedValue: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      wonOwnerId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lostReasonId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lostNotes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      slaPolicyId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      responseBy: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      firstRespondedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      firstResponseDuration: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ownerUserId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      active: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `[CRM-P2] §4.1 — الصفقة. تُنشأ من التحويل (§5) أو مباشرةً، ولا تصير «مكسوبة» إلا عبر
مسار §7 داخل المعاملة نفسها (BR-C4.1).`,
    },
  ),
);

export const CrmDeal = t.Composite([CrmDealPlain, CrmDealRelations], {
  additionalProperties: false,
});

export const CrmDealInputCreate = t.Composite(
  [CrmDealPlainInputCreate, CrmDealRelationsInputCreate],
  { additionalProperties: false },
);

export const CrmDealInputUpdate = t.Composite(
  [CrmDealPlainInputUpdate, CrmDealRelationsInputUpdate],
  { additionalProperties: false },
);
