import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ChecklistTemplatePlain = t.Object(
  {
    id: t.String(),
    clinicId: __nullable__(t.String()),
    scope: t.Union(
      [
        t.Literal("OPERATION_SIGN_IN"),
        t.Literal("OPERATION_TIME_OUT"),
        t.Literal("OPERATION_SIGN_OUT"),
        t.Literal("OPERATION_MINOR_COMBINED"),
      ],
      { additionalProperties: false },
    ),
    tier: __nullable__(
      t.Union(
        [t.Literal("MINOR"), t.Literal("INTERMEDIATE"), t.Literal("MAJOR")],
        { additionalProperties: false },
      ),
    ),
    nameAr: t.String(),
    nameEn: __nullable__(t.String()),
    version: t.Integer(),
    active: t.Boolean(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const ChecklistTemplateRelations = t.Object(
  {
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
    items: t.Array(
      t.Object(
        {
          id: t.String(),
          templateId: t.String(),
          order: t.Integer(),
          textAr: t.String(),
          textEn: __nullable__(t.String()),
          required: t.Boolean(),
          responseType: t.Union(
            [
              t.Literal("CONFIRM"),
              t.Literal("YES_NO_NA"),
              t.Literal("TEXT"),
              t.Literal("NUMBER"),
            ],
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const ChecklistTemplatePlainInputCreate = t.Object(
  {
    scope: t.Union(
      [
        t.Literal("OPERATION_SIGN_IN"),
        t.Literal("OPERATION_TIME_OUT"),
        t.Literal("OPERATION_SIGN_OUT"),
        t.Literal("OPERATION_MINOR_COMBINED"),
      ],
      { additionalProperties: false },
    ),
    tier: t.Optional(
      __nullable__(
        t.Union(
          [t.Literal("MINOR"), t.Literal("INTERMEDIATE"), t.Literal("MAJOR")],
          { additionalProperties: false },
        ),
      ),
    ),
    nameAr: t.String(),
    nameEn: t.Optional(__nullable__(t.String())),
    version: t.Optional(t.Integer()),
    active: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const ChecklistTemplatePlainInputUpdate = t.Object(
  {
    scope: t.Optional(
      t.Union(
        [
          t.Literal("OPERATION_SIGN_IN"),
          t.Literal("OPERATION_TIME_OUT"),
          t.Literal("OPERATION_SIGN_OUT"),
          t.Literal("OPERATION_MINOR_COMBINED"),
        ],
        { additionalProperties: false },
      ),
    ),
    tier: t.Optional(
      __nullable__(
        t.Union(
          [t.Literal("MINOR"), t.Literal("INTERMEDIATE"), t.Literal("MAJOR")],
          { additionalProperties: false },
        ),
      ),
    ),
    nameAr: t.Optional(t.String()),
    nameEn: t.Optional(__nullable__(t.String())),
    version: t.Optional(t.Integer()),
    active: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const ChecklistTemplateRelationsInputCreate = t.Object(
  {
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
  },
  { additionalProperties: false },
);

export const ChecklistTemplateRelationsInputUpdate = t.Partial(
  t.Object(
    {
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
    },
    { additionalProperties: false },
  ),
);

export const ChecklistTemplateWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          scope: t.Union(
            [
              t.Literal("OPERATION_SIGN_IN"),
              t.Literal("OPERATION_TIME_OUT"),
              t.Literal("OPERATION_SIGN_OUT"),
              t.Literal("OPERATION_MINOR_COMBINED"),
            ],
            { additionalProperties: false },
          ),
          tier: t.Union(
            [t.Literal("MINOR"), t.Literal("INTERMEDIATE"), t.Literal("MAJOR")],
            { additionalProperties: false },
          ),
          nameAr: t.String(),
          nameEn: t.String(),
          version: t.Integer(),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "ChecklistTemplate" },
  ),
);

export const ChecklistTemplateWhereUnique = t.Recursive(
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
              scope: t.Union(
                [
                  t.Literal("OPERATION_SIGN_IN"),
                  t.Literal("OPERATION_TIME_OUT"),
                  t.Literal("OPERATION_SIGN_OUT"),
                  t.Literal("OPERATION_MINOR_COMBINED"),
                ],
                { additionalProperties: false },
              ),
              tier: t.Union(
                [
                  t.Literal("MINOR"),
                  t.Literal("INTERMEDIATE"),
                  t.Literal("MAJOR"),
                ],
                { additionalProperties: false },
              ),
              nameAr: t.String(),
              nameEn: t.String(),
              version: t.Integer(),
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
  { $id: "ChecklistTemplate" },
);

export const ChecklistTemplateSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      scope: t.Boolean(),
      tier: t.Boolean(),
      nameAr: t.Boolean(),
      nameEn: t.Boolean(),
      version: t.Boolean(),
      active: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      items: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ChecklistTemplateInclude = t.Partial(
  t.Object(
    {
      scope: t.Boolean(),
      tier: t.Boolean(),
      clinic: t.Boolean(),
      items: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ChecklistTemplateOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      nameAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      nameEn: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      version: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
    { additionalProperties: false },
  ),
);

export const ChecklistTemplate = t.Composite(
  [ChecklistTemplatePlain, ChecklistTemplateRelations],
  { additionalProperties: false },
);

export const ChecklistTemplateInputCreate = t.Composite(
  [ChecklistTemplatePlainInputCreate, ChecklistTemplateRelationsInputCreate],
  { additionalProperties: false },
);

export const ChecklistTemplateInputUpdate = t.Composite(
  [ChecklistTemplatePlainInputUpdate, ChecklistTemplateRelationsInputUpdate],
  { additionalProperties: false },
);
