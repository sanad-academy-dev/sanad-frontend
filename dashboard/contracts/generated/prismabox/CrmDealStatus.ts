import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CrmDealStatusPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    name: t.String(),
    color: t.String(),
    order: t.Integer(),
    kind: t.Union([t.Literal("OPEN"), t.Literal("WON"), t.Literal("LOST")], {
      additionalProperties: false,
    }),
    defaultProbability: t.Number(),
    active: t.Boolean(),
    isDeleted: t.Boolean(),
    deletedAt: __nullable__(t.Date()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const CrmDealStatusRelations = t.Object(
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
    deals: t.Array(
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
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const CrmDealStatusPlainInputCreate = t.Object(
  {
    name: t.String(),
    color: t.String(),
    order: t.Optional(t.Integer()),
    kind: t.Union([t.Literal("OPEN"), t.Literal("WON"), t.Literal("LOST")], {
      additionalProperties: false,
    }),
    defaultProbability: t.Optional(t.Number()),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const CrmDealStatusPlainInputUpdate = t.Object(
  {
    name: t.Optional(t.String()),
    color: t.Optional(t.String()),
    order: t.Optional(t.Integer()),
    kind: t.Optional(
      t.Union([t.Literal("OPEN"), t.Literal("WON"), t.Literal("LOST")], {
        additionalProperties: false,
      }),
    ),
    defaultProbability: t.Optional(t.Number()),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const CrmDealStatusRelationsInputCreate = t.Object(
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
    deals: t.Optional(
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

export const CrmDealStatusRelationsInputUpdate = t.Partial(
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
      deals: t.Partial(
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

export const CrmDealStatusWhere = t.Partial(
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
            [t.Literal("OPEN"), t.Literal("WON"), t.Literal("LOST")],
            { additionalProperties: false },
          ),
          defaultProbability: t.Number(),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "CrmDealStatus" },
  ),
);

export const CrmDealStatusWhereUnique = t.Recursive(
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
                [t.Literal("OPEN"), t.Literal("WON"), t.Literal("LOST")],
                { additionalProperties: false },
              ),
              defaultProbability: t.Number(),
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
  { $id: "CrmDealStatus" },
);

export const CrmDealStatusSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      name: t.Boolean(),
      color: t.Boolean(),
      order: t.Boolean(),
      kind: t.Boolean(),
      defaultProbability: t.Boolean(),
      active: t.Boolean(),
      isDeleted: t.Boolean(),
      deletedAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      deals: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CrmDealStatusInclude = t.Partial(
  t.Object(
    {
      kind: t.Boolean(),
      clinic: t.Boolean(),
      deals: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CrmDealStatusOrderBy = t.Partial(
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
      defaultProbability: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const CrmDealStatus = t.Composite(
  [CrmDealStatusPlain, CrmDealStatusRelations],
  { additionalProperties: false },
);

export const CrmDealStatusInputCreate = t.Composite(
  [CrmDealStatusPlainInputCreate, CrmDealStatusRelationsInputCreate],
  { additionalProperties: false },
);

export const CrmDealStatusInputUpdate = t.Composite(
  [CrmDealStatusPlainInputUpdate, CrmDealStatusRelationsInputUpdate],
  { additionalProperties: false },
);
