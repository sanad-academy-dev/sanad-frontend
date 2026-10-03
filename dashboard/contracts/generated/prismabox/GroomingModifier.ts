import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingModifierPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    code: t.Union(
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
    labelAr: t.String(),
    calc: t.Union(
      [t.Literal("PERCENT"), t.Literal("FIXED"), t.Literal("PER_MINUTE")],
      { additionalProperties: false, description: `طريقة حساب الرسم.` },
    ),
    value: t.Number(),
    autoAppliesFrom: __nullable__(t.Integer()),
    requiresOwnerApproval: t.Boolean(),
    active: t.Boolean(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `رسم أو خصم مشروط يُطبَّق فوق سعر المصفوفة. كل تطبيق يُسجَّل لاحقًا كصفّ
GroomingSessionAdjustment مستقل (GR1) فيبقى «لماذا هذا المبلغ؟» مقروءًا.`,
  },
);

export const GroomingModifierRelations = t.Object(
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
  },
  {
    additionalProperties: false,
    description: `رسم أو خصم مشروط يُطبَّق فوق سعر المصفوفة. كل تطبيق يُسجَّل لاحقًا كصفّ
GroomingSessionAdjustment مستقل (GR1) فيبقى «لماذا هذا المبلغ؟» مقروءًا.`,
  },
);

export const GroomingModifierPlainInputCreate = t.Object(
  {
    code: t.Union(
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
    labelAr: t.String(),
    calc: t.Union(
      [t.Literal("PERCENT"), t.Literal("FIXED"), t.Literal("PER_MINUTE")],
      { additionalProperties: false, description: `طريقة حساب الرسم.` },
    ),
    value: t.Number(),
    autoAppliesFrom: t.Optional(__nullable__(t.Integer())),
    requiresOwnerApproval: t.Optional(t.Boolean()),
    active: t.Optional(t.Boolean()),
  },
  {
    additionalProperties: false,
    description: `رسم أو خصم مشروط يُطبَّق فوق سعر المصفوفة. كل تطبيق يُسجَّل لاحقًا كصفّ
GroomingSessionAdjustment مستقل (GR1) فيبقى «لماذا هذا المبلغ؟» مقروءًا.`,
  },
);

export const GroomingModifierPlainInputUpdate = t.Object(
  {
    code: t.Optional(
      t.Union(
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
    ),
    labelAr: t.Optional(t.String()),
    calc: t.Optional(
      t.Union(
        [t.Literal("PERCENT"), t.Literal("FIXED"), t.Literal("PER_MINUTE")],
        { additionalProperties: false, description: `طريقة حساب الرسم.` },
      ),
    ),
    value: t.Optional(t.Number()),
    autoAppliesFrom: t.Optional(__nullable__(t.Integer())),
    requiresOwnerApproval: t.Optional(t.Boolean()),
    active: t.Optional(t.Boolean()),
  },
  {
    additionalProperties: false,
    description: `رسم أو خصم مشروط يُطبَّق فوق سعر المصفوفة. كل تطبيق يُسجَّل لاحقًا كصفّ
GroomingSessionAdjustment مستقل (GR1) فيبقى «لماذا هذا المبلغ؟» مقروءًا.`,
  },
);

export const GroomingModifierRelationsInputCreate = t.Object(
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
  },
  {
    additionalProperties: false,
    description: `رسم أو خصم مشروط يُطبَّق فوق سعر المصفوفة. كل تطبيق يُسجَّل لاحقًا كصفّ
GroomingSessionAdjustment مستقل (GR1) فيبقى «لماذا هذا المبلغ؟» مقروءًا.`,
  },
);

export const GroomingModifierRelationsInputUpdate = t.Partial(
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
    },
    {
      additionalProperties: false,
      description: `رسم أو خصم مشروط يُطبَّق فوق سعر المصفوفة. كل تطبيق يُسجَّل لاحقًا كصفّ
GroomingSessionAdjustment مستقل (GR1) فيبقى «لماذا هذا المبلغ؟» مقروءًا.`,
    },
  ),
);

export const GroomingModifierWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          code: t.Union(
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
          labelAr: t.String(),
          calc: t.Union(
            [t.Literal("PERCENT"), t.Literal("FIXED"), t.Literal("PER_MINUTE")],
            { additionalProperties: false, description: `طريقة حساب الرسم.` },
          ),
          value: t.Number(),
          autoAppliesFrom: t.Integer(),
          requiresOwnerApproval: t.Boolean(),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `رسم أو خصم مشروط يُطبَّق فوق سعر المصفوفة. كل تطبيق يُسجَّل لاحقًا كصفّ
GroomingSessionAdjustment مستقل (GR1) فيبقى «لماذا هذا المبلغ؟» مقروءًا.`,
        },
      ),
    { $id: "GroomingModifier" },
  ),
);

export const GroomingModifierWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_code: t.Object(
                {
                  clinicId: t.String(),
                  code: t.Union(
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
                },
                { additionalProperties: false },
              ),
            },
            {
              additionalProperties: false,
              description: `رسم أو خصم مشروط يُطبَّق فوق سعر المصفوفة. كل تطبيق يُسجَّل لاحقًا كصفّ
GroomingSessionAdjustment مستقل (GR1) فيبقى «لماذا هذا المبلغ؟» مقروءًا.`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              clinicId_code: t.Object(
                {
                  clinicId: t.String(),
                  code: t.Union(
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
                },
                { additionalProperties: false },
              ),
            }),
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
              clinicId: t.String(),
              code: t.Union(
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
              labelAr: t.String(),
              calc: t.Union(
                [
                  t.Literal("PERCENT"),
                  t.Literal("FIXED"),
                  t.Literal("PER_MINUTE"),
                ],
                {
                  additionalProperties: false,
                  description: `طريقة حساب الرسم.`,
                },
              ),
              value: t.Number(),
              autoAppliesFrom: t.Integer(),
              requiresOwnerApproval: t.Boolean(),
              active: t.Boolean(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "GroomingModifier" },
);

export const GroomingModifierSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      code: t.Boolean(),
      labelAr: t.Boolean(),
      calc: t.Boolean(),
      value: t.Boolean(),
      autoAppliesFrom: t.Boolean(),
      requiresOwnerApproval: t.Boolean(),
      active: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `رسم أو خصم مشروط يُطبَّق فوق سعر المصفوفة. كل تطبيق يُسجَّل لاحقًا كصفّ
GroomingSessionAdjustment مستقل (GR1) فيبقى «لماذا هذا المبلغ؟» مقروءًا.`,
    },
  ),
);

export const GroomingModifierInclude = t.Partial(
  t.Object(
    {
      code: t.Boolean(),
      calc: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `رسم أو خصم مشروط يُطبَّق فوق سعر المصفوفة. كل تطبيق يُسجَّل لاحقًا كصفّ
GroomingSessionAdjustment مستقل (GR1) فيبقى «لماذا هذا المبلغ؟» مقروءًا.`,
    },
  ),
);

export const GroomingModifierOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      labelAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      value: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      autoAppliesFrom: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      requiresOwnerApproval: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      active: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `رسم أو خصم مشروط يُطبَّق فوق سعر المصفوفة. كل تطبيق يُسجَّل لاحقًا كصفّ
GroomingSessionAdjustment مستقل (GR1) فيبقى «لماذا هذا المبلغ؟» مقروءًا.`,
    },
  ),
);

export const GroomingModifier = t.Composite(
  [GroomingModifierPlain, GroomingModifierRelations],
  { additionalProperties: false },
);

export const GroomingModifierInputCreate = t.Composite(
  [GroomingModifierPlainInputCreate, GroomingModifierRelationsInputCreate],
  { additionalProperties: false },
);

export const GroomingModifierInputUpdate = t.Composite(
  [GroomingModifierPlainInputUpdate, GroomingModifierRelationsInputUpdate],
  { additionalProperties: false },
);
