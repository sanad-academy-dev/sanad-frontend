import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const LabTestParameterPlain = t.Object(
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
);

export const LabTestParameterRelations = t.Object(
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
    service: t.Object(
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
    ),
    results: t.Array(
      t.Object(
        {
          id: t.String(),
          itemId: t.String(),
          parameterId: __nullable__(t.String()),
          section: __nullable__(t.String()),
          name: t.String(),
          unit: __nullable__(t.String()),
          refLow: __nullable__(t.Number()),
          refHigh: __nullable__(t.Number()),
          value: __nullable__(t.String()),
          numericValue: __nullable__(t.Number()),
          flag: t.Union(
            [t.Literal("NORMAL"), t.Literal("LOW"), t.Literal("HIGH")],
            { additionalProperties: false },
          ),
          notes: __nullable__(t.String()),
          order: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const LabTestParameterPlainInputCreate = t.Object(
  {
    section: t.Optional(__nullable__(t.String())),
    name: t.String(),
    unit: t.Optional(__nullable__(t.String())),
    type: t.Optional(
      t.Union([t.Literal("NUMERIC"), t.Literal("TEXT")], {
        additionalProperties: false,
      }),
    ),
    refLow: t.Optional(__nullable__(t.Number())),
    refHigh: t.Optional(__nullable__(t.Number())),
    order: t.Optional(t.Integer()),
    active: t.Optional(t.Boolean()),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const LabTestParameterPlainInputUpdate = t.Object(
  {
    section: t.Optional(__nullable__(t.String())),
    name: t.Optional(t.String()),
    unit: t.Optional(__nullable__(t.String())),
    type: t.Optional(
      t.Union([t.Literal("NUMERIC"), t.Literal("TEXT")], {
        additionalProperties: false,
      }),
    ),
    refLow: t.Optional(__nullable__(t.Number())),
    refHigh: t.Optional(__nullable__(t.Number())),
    order: t.Optional(t.Integer()),
    active: t.Optional(t.Boolean()),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const LabTestParameterRelationsInputCreate = t.Object(
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
    service: t.Object(
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
    results: t.Optional(
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

export const LabTestParameterRelationsInputUpdate = t.Partial(
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
      service: t.Object(
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
      results: t.Partial(
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

export const LabTestParameterWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          serviceId: t.String(),
          section: t.String(),
          name: t.String(),
          unit: t.String(),
          type: t.Union([t.Literal("NUMERIC"), t.Literal("TEXT")], {
            additionalProperties: false,
          }),
          refLow: t.Number(),
          refHigh: t.Number(),
          order: t.Integer(),
          active: t.Boolean(),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "LabTestParameter" },
  ),
);

export const LabTestParameterWhereUnique = t.Recursive(
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
              serviceId: t.String(),
              section: t.String(),
              name: t.String(),
              unit: t.String(),
              type: t.Union([t.Literal("NUMERIC"), t.Literal("TEXT")], {
                additionalProperties: false,
              }),
              refLow: t.Number(),
              refHigh: t.Number(),
              order: t.Integer(),
              active: t.Boolean(),
              editsCount: t.Integer(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "LabTestParameter" },
);

export const LabTestParameterSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      serviceId: t.Boolean(),
      section: t.Boolean(),
      name: t.Boolean(),
      unit: t.Boolean(),
      type: t.Boolean(),
      refLow: t.Boolean(),
      refHigh: t.Boolean(),
      order: t.Boolean(),
      active: t.Boolean(),
      editsCount: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      service: t.Boolean(),
      results: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const LabTestParameterInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      clinic: t.Boolean(),
      service: t.Boolean(),
      results: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const LabTestParameterOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      serviceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      section: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      unit: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      refLow: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      refHigh: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      order: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      active: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      editsCount: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const LabTestParameter = t.Composite(
  [LabTestParameterPlain, LabTestParameterRelations],
  { additionalProperties: false },
);

export const LabTestParameterInputCreate = t.Composite(
  [LabTestParameterPlainInputCreate, LabTestParameterRelationsInputCreate],
  { additionalProperties: false },
);

export const LabTestParameterInputUpdate = t.Composite(
  [LabTestParameterPlainInputUpdate, LabTestParameterRelationsInputUpdate],
  { additionalProperties: false },
);
