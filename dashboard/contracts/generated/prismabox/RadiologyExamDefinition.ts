import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RadiologyExamDefinitionPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    serviceId: t.String(),
    modality: t.Union(
      [
        t.Literal("XRAY"),
        t.Literal("CT"),
        t.Literal("MRI"),
        t.Literal("ULTRASOUND"),
        t.Literal("FLUOROSCOPY"),
        t.Literal("MAMMOGRAPHY"),
        t.Literal("NUCLEAR"),
        t.Literal("PET"),
        t.Literal("DENTAL"),
        t.Literal("OTHER"),
      ],
      { additionalProperties: false },
    ),
    bodyPart: __nullable__(t.String()),
    defaultViews: t.Array(t.String(), { additionalProperties: false }),
    lateralityRequired: t.Boolean(),
    contrastDefault: t.Boolean(),
    sedationDefault: t.Union(
      [
        t.Literal("NONE"),
        t.Literal("ANXIOLYSIS"),
        t.Literal("SEDATION"),
        t.Literal("GENERAL_ANESTHESIA"),
      ],
      { additionalProperties: false },
    ),
    prepNotes: __nullable__(t.String()),
    active: t.Boolean(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const RadiologyExamDefinitionRelations = t.Object(
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
  },
  { additionalProperties: false },
);

export const RadiologyExamDefinitionPlainInputCreate = t.Object(
  {
    modality: t.Optional(
      t.Union(
        [
          t.Literal("XRAY"),
          t.Literal("CT"),
          t.Literal("MRI"),
          t.Literal("ULTRASOUND"),
          t.Literal("FLUOROSCOPY"),
          t.Literal("MAMMOGRAPHY"),
          t.Literal("NUCLEAR"),
          t.Literal("PET"),
          t.Literal("DENTAL"),
          t.Literal("OTHER"),
        ],
        { additionalProperties: false },
      ),
    ),
    bodyPart: t.Optional(__nullable__(t.String())),
    defaultViews: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
    lateralityRequired: t.Optional(t.Boolean()),
    contrastDefault: t.Optional(t.Boolean()),
    sedationDefault: t.Optional(
      t.Union(
        [
          t.Literal("NONE"),
          t.Literal("ANXIOLYSIS"),
          t.Literal("SEDATION"),
          t.Literal("GENERAL_ANESTHESIA"),
        ],
        { additionalProperties: false },
      ),
    ),
    prepNotes: t.Optional(__nullable__(t.String())),
    active: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const RadiologyExamDefinitionPlainInputUpdate = t.Object(
  {
    modality: t.Optional(
      t.Union(
        [
          t.Literal("XRAY"),
          t.Literal("CT"),
          t.Literal("MRI"),
          t.Literal("ULTRASOUND"),
          t.Literal("FLUOROSCOPY"),
          t.Literal("MAMMOGRAPHY"),
          t.Literal("NUCLEAR"),
          t.Literal("PET"),
          t.Literal("DENTAL"),
          t.Literal("OTHER"),
        ],
        { additionalProperties: false },
      ),
    ),
    bodyPart: t.Optional(__nullable__(t.String())),
    defaultViews: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
    lateralityRequired: t.Optional(t.Boolean()),
    contrastDefault: t.Optional(t.Boolean()),
    sedationDefault: t.Optional(
      t.Union(
        [
          t.Literal("NONE"),
          t.Literal("ANXIOLYSIS"),
          t.Literal("SEDATION"),
          t.Literal("GENERAL_ANESTHESIA"),
        ],
        { additionalProperties: false },
      ),
    ),
    prepNotes: t.Optional(__nullable__(t.String())),
    active: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const RadiologyExamDefinitionRelationsInputCreate = t.Object(
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
  },
  { additionalProperties: false },
);

export const RadiologyExamDefinitionRelationsInputUpdate = t.Partial(
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
    },
    { additionalProperties: false },
  ),
);

export const RadiologyExamDefinitionWhere = t.Partial(
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
          modality: t.Union(
            [
              t.Literal("XRAY"),
              t.Literal("CT"),
              t.Literal("MRI"),
              t.Literal("ULTRASOUND"),
              t.Literal("FLUOROSCOPY"),
              t.Literal("MAMMOGRAPHY"),
              t.Literal("NUCLEAR"),
              t.Literal("PET"),
              t.Literal("DENTAL"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          bodyPart: t.String(),
          defaultViews: t.Array(t.String(), { additionalProperties: false }),
          lateralityRequired: t.Boolean(),
          contrastDefault: t.Boolean(),
          sedationDefault: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("ANXIOLYSIS"),
              t.Literal("SEDATION"),
              t.Literal("GENERAL_ANESTHESIA"),
            ],
            { additionalProperties: false },
          ),
          prepNotes: t.String(),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "RadiologyExamDefinition" },
  ),
);

export const RadiologyExamDefinitionWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_serviceId: t.Object(
                { clinicId: t.String(), serviceId: t.String() },
                { additionalProperties: false },
              ),
            },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              clinicId_serviceId: t.Object(
                { clinicId: t.String(), serviceId: t.String() },
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
              serviceId: t.String(),
              modality: t.Union(
                [
                  t.Literal("XRAY"),
                  t.Literal("CT"),
                  t.Literal("MRI"),
                  t.Literal("ULTRASOUND"),
                  t.Literal("FLUOROSCOPY"),
                  t.Literal("MAMMOGRAPHY"),
                  t.Literal("NUCLEAR"),
                  t.Literal("PET"),
                  t.Literal("DENTAL"),
                  t.Literal("OTHER"),
                ],
                { additionalProperties: false },
              ),
              bodyPart: t.String(),
              defaultViews: t.Array(t.String(), {
                additionalProperties: false,
              }),
              lateralityRequired: t.Boolean(),
              contrastDefault: t.Boolean(),
              sedationDefault: t.Union(
                [
                  t.Literal("NONE"),
                  t.Literal("ANXIOLYSIS"),
                  t.Literal("SEDATION"),
                  t.Literal("GENERAL_ANESTHESIA"),
                ],
                { additionalProperties: false },
              ),
              prepNotes: t.String(),
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
  { $id: "RadiologyExamDefinition" },
);

export const RadiologyExamDefinitionSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      serviceId: t.Boolean(),
      modality: t.Boolean(),
      bodyPart: t.Boolean(),
      defaultViews: t.Boolean(),
      lateralityRequired: t.Boolean(),
      contrastDefault: t.Boolean(),
      sedationDefault: t.Boolean(),
      prepNotes: t.Boolean(),
      active: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      service: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RadiologyExamDefinitionInclude = t.Partial(
  t.Object(
    {
      modality: t.Boolean(),
      sedationDefault: t.Boolean(),
      clinic: t.Boolean(),
      service: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RadiologyExamDefinitionOrderBy = t.Partial(
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
      bodyPart: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      defaultViews: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lateralityRequired: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      contrastDefault: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      prepNotes: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const RadiologyExamDefinition = t.Composite(
  [RadiologyExamDefinitionPlain, RadiologyExamDefinitionRelations],
  { additionalProperties: false },
);

export const RadiologyExamDefinitionInputCreate = t.Composite(
  [
    RadiologyExamDefinitionPlainInputCreate,
    RadiologyExamDefinitionRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const RadiologyExamDefinitionInputUpdate = t.Composite(
  [
    RadiologyExamDefinitionPlainInputUpdate,
    RadiologyExamDefinitionRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
