import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CrmLeadStatusPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    name: t.String(),
    color: t.String(),
    order: t.Integer(),
    kind: t.Union(
      [t.Literal("OPEN"), t.Literal("CONVERTED"), t.Literal("LOST")],
      { additionalProperties: false },
    ),
    active: t.Boolean(),
    isDeleted: t.Boolean(),
    deletedAt: __nullable__(t.Date()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const CrmLeadStatusRelations = t.Object(
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
    crmLeads: t.Array(
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
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const CrmLeadStatusPlainInputCreate = t.Object(
  {
    name: t.String(),
    color: t.String(),
    order: t.Optional(t.Integer()),
    kind: t.Union(
      [t.Literal("OPEN"), t.Literal("CONVERTED"), t.Literal("LOST")],
      { additionalProperties: false },
    ),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const CrmLeadStatusPlainInputUpdate = t.Object(
  {
    name: t.Optional(t.String()),
    color: t.Optional(t.String()),
    order: t.Optional(t.Integer()),
    kind: t.Optional(
      t.Union([t.Literal("OPEN"), t.Literal("CONVERTED"), t.Literal("LOST")], {
        additionalProperties: false,
      }),
    ),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const CrmLeadStatusRelationsInputCreate = t.Object(
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
    crmLeads: t.Optional(
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

export const CrmLeadStatusRelationsInputUpdate = t.Partial(
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
      crmLeads: t.Partial(
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

export const CrmLeadStatusWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          name: t.String(),
          color: t.String(),
          order: t.Integer(),
          kind: t.Union(
            [t.Literal("OPEN"), t.Literal("CONVERTED"), t.Literal("LOST")],
            { additionalProperties: false },
          ),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "CrmLeadStatus" },
  ),
);

export const CrmLeadStatusWhereUnique = t.Recursive(
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
              name: t.String(),
              color: t.String(),
              order: t.Integer(),
              kind: t.Union(
                [t.Literal("OPEN"), t.Literal("CONVERTED"), t.Literal("LOST")],
                { additionalProperties: false },
              ),
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
  { $id: "CrmLeadStatus" },
);

export const CrmLeadStatusSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      name: t.Boolean(),
      color: t.Boolean(),
      order: t.Boolean(),
      kind: t.Boolean(),
      active: t.Boolean(),
      isDeleted: t.Boolean(),
      deletedAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      crmLeads: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CrmLeadStatusInclude = t.Partial(
  t.Object(
    {
      kind: t.Boolean(),
      clinic: t.Boolean(),
      crmLeads: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CrmLeadStatusOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      color: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      order: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
    { additionalProperties: false },
  ),
);

export const CrmLeadStatus = t.Composite(
  [CrmLeadStatusPlain, CrmLeadStatusRelations],
  { additionalProperties: false },
);

export const CrmLeadStatusInputCreate = t.Composite(
  [CrmLeadStatusPlainInputCreate, CrmLeadStatusRelationsInputCreate],
  { additionalProperties: false },
);

export const CrmLeadStatusInputUpdate = t.Composite(
  [CrmLeadStatusPlainInputUpdate, CrmLeadStatusRelationsInputUpdate],
  { additionalProperties: false },
);
