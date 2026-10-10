import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SopTemplatePlain = t.Object(
  {
    id: t.String(),
    clinicId: __nullable__(t.String()),
    domain: t.Union(
      [t.Literal("LAB"), t.Literal("RADIOLOGY"), t.Literal("OPERATION")],
      { additionalProperties: false },
    ),
    serviceId: t.String(),
    titleAr: t.String(),
    titleEn: __nullable__(t.String()),
    reference: __nullable__(t.String()),
    version: t.Integer(),
    active: t.Boolean(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const SopTemplateRelations = t.Object(
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
    sections: t.Array(
      t.Object(
        {
          id: t.String(),
          templateId: t.String(),
          order: t.Integer(),
          titleAr: t.String(),
          titleEn: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    runs: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          templateId: t.String(),
          templateVersion: t.Integer(),
          domain: t.Union(
            [t.Literal("LAB"), t.Literal("RADIOLOGY"), t.Literal("OPERATION")],
            { additionalProperties: false },
          ),
          labItemId: __nullable__(t.String()),
          radiologyItemId: __nullable__(t.String()),
          operationCaseId: __nullable__(t.String()),
          startedById: __nullable__(t.String()),
          completedAt: __nullable__(t.Date()),
          completedById: __nullable__(t.String()),
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

export const SopTemplatePlainInputCreate = t.Object(
  {
    domain: t.Union(
      [t.Literal("LAB"), t.Literal("RADIOLOGY"), t.Literal("OPERATION")],
      { additionalProperties: false },
    ),
    titleAr: t.String(),
    titleEn: t.Optional(__nullable__(t.String())),
    reference: t.Optional(__nullable__(t.String())),
    version: t.Optional(t.Integer()),
    active: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const SopTemplatePlainInputUpdate = t.Object(
  {
    domain: t.Optional(
      t.Union(
        [t.Literal("LAB"), t.Literal("RADIOLOGY"), t.Literal("OPERATION")],
        { additionalProperties: false },
      ),
    ),
    titleAr: t.Optional(t.String()),
    titleEn: t.Optional(__nullable__(t.String())),
    reference: t.Optional(__nullable__(t.String())),
    version: t.Optional(t.Integer()),
    active: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const SopTemplateRelationsInputCreate = t.Object(
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
    sections: t.Optional(
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
    runs: t.Optional(
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

export const SopTemplateRelationsInputUpdate = t.Partial(
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
      sections: t.Partial(
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
      runs: t.Partial(
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

export const SopTemplateWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          domain: t.Union(
            [t.Literal("LAB"), t.Literal("RADIOLOGY"), t.Literal("OPERATION")],
            { additionalProperties: false },
          ),
          serviceId: t.String(),
          titleAr: t.String(),
          titleEn: t.String(),
          reference: t.String(),
          version: t.Integer(),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "SopTemplate" },
  ),
);

export const SopTemplateWhereUnique = t.Recursive(
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
              domain: t.Union(
                [
                  t.Literal("LAB"),
                  t.Literal("RADIOLOGY"),
                  t.Literal("OPERATION"),
                ],
                { additionalProperties: false },
              ),
              serviceId: t.String(),
              titleAr: t.String(),
              titleEn: t.String(),
              reference: t.String(),
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
  { $id: "SopTemplate" },
);

export const SopTemplateSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      domain: t.Boolean(),
      serviceId: t.Boolean(),
      titleAr: t.Boolean(),
      titleEn: t.Boolean(),
      reference: t.Boolean(),
      version: t.Boolean(),
      active: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      service: t.Boolean(),
      sections: t.Boolean(),
      runs: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const SopTemplateInclude = t.Partial(
  t.Object(
    {
      domain: t.Boolean(),
      clinic: t.Boolean(),
      service: t.Boolean(),
      sections: t.Boolean(),
      runs: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const SopTemplateOrderBy = t.Partial(
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
      titleAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      titleEn: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reference: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const SopTemplate = t.Composite(
  [SopTemplatePlain, SopTemplateRelations],
  { additionalProperties: false },
);

export const SopTemplateInputCreate = t.Composite(
  [SopTemplatePlainInputCreate, SopTemplateRelationsInputCreate],
  { additionalProperties: false },
);

export const SopTemplateInputUpdate = t.Composite(
  [SopTemplatePlainInputUpdate, SopTemplateRelationsInputUpdate],
  { additionalProperties: false },
);
