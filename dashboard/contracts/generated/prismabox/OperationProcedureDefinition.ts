import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OperationProcedureDefinitionPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    serviceId: t.String(),
    defaultTier: t.Union(
      [t.Literal("MINOR"), t.Literal("INTERMEDIATE"), t.Literal("MAJOR")],
      { additionalProperties: false },
    ),
    defaultAnesthesia: t.Union(
      [
        t.Literal("NONE"),
        t.Literal("ANXIOLYSIS"),
        t.Literal("SEDATION"),
        t.Literal("GENERAL_ANESTHESIA"),
      ],
      { additionalProperties: false },
    ),
    defaultWoundClass: __nullable__(
      t.Union(
        [
          t.Literal("CLEAN"),
          t.Literal("CLEAN_CONTAMINATED"),
          t.Literal("CONTAMINATED"),
          t.Literal("DIRTY"),
        ],
        { additionalProperties: false },
      ),
    ),
    requiresLaterality: t.Boolean(),
    bodySystem: __nullable__(t.String()),
    codes: __nullable__(t.Any()),
    specializationId: __nullable__(t.String()),
    prepNotes: __nullable__(t.String()),
    active: t.Boolean(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const OperationProcedureDefinitionRelations = t.Object(
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
    specialization: __nullable__(
      t.Object(
        {
          id: t.String(),
          name: t.String(),
          description: __nullable__(t.String()),
          level: t.Union([t.Literal("CATEGORY"), t.Literal("SUBCATEGORY")], {
            additionalProperties: false,
          }),
          parentId: __nullable__(t.String()),
          isDefault: t.Boolean(),
          isActive: t.Boolean(),
          clinicId: __nullable__(t.String()),
          order: t.Integer(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    kitItems: t.Array(
      t.Object(
        {
          id: t.String(),
          definitionId: t.String(),
          inventoryItemId: t.String(),
          quantity: t.Integer(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const OperationProcedureDefinitionPlainInputCreate = t.Object(
  {
    defaultTier: t.Optional(
      t.Union(
        [t.Literal("MINOR"), t.Literal("INTERMEDIATE"), t.Literal("MAJOR")],
        { additionalProperties: false },
      ),
    ),
    defaultAnesthesia: t.Optional(
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
    defaultWoundClass: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("CLEAN"),
            t.Literal("CLEAN_CONTAMINATED"),
            t.Literal("CONTAMINATED"),
            t.Literal("DIRTY"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    requiresLaterality: t.Optional(t.Boolean()),
    bodySystem: t.Optional(__nullable__(t.String())),
    codes: t.Optional(__nullable__(t.Any())),
    prepNotes: t.Optional(__nullable__(t.String())),
    active: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const OperationProcedureDefinitionPlainInputUpdate = t.Object(
  {
    defaultTier: t.Optional(
      t.Union(
        [t.Literal("MINOR"), t.Literal("INTERMEDIATE"), t.Literal("MAJOR")],
        { additionalProperties: false },
      ),
    ),
    defaultAnesthesia: t.Optional(
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
    defaultWoundClass: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("CLEAN"),
            t.Literal("CLEAN_CONTAMINATED"),
            t.Literal("CONTAMINATED"),
            t.Literal("DIRTY"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    requiresLaterality: t.Optional(t.Boolean()),
    bodySystem: t.Optional(__nullable__(t.String())),
    codes: t.Optional(__nullable__(t.Any())),
    prepNotes: t.Optional(__nullable__(t.String())),
    active: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const OperationProcedureDefinitionRelationsInputCreate = t.Object(
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
    specialization: t.Optional(
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
    kitItems: t.Optional(
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

export const OperationProcedureDefinitionRelationsInputUpdate = t.Partial(
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
      specialization: t.Partial(
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
      kitItems: t.Partial(
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

export const OperationProcedureDefinitionWhere = t.Partial(
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
          defaultTier: t.Union(
            [t.Literal("MINOR"), t.Literal("INTERMEDIATE"), t.Literal("MAJOR")],
            { additionalProperties: false },
          ),
          defaultAnesthesia: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("ANXIOLYSIS"),
              t.Literal("SEDATION"),
              t.Literal("GENERAL_ANESTHESIA"),
            ],
            { additionalProperties: false },
          ),
          defaultWoundClass: t.Union(
            [
              t.Literal("CLEAN"),
              t.Literal("CLEAN_CONTAMINATED"),
              t.Literal("CONTAMINATED"),
              t.Literal("DIRTY"),
            ],
            { additionalProperties: false },
          ),
          requiresLaterality: t.Boolean(),
          bodySystem: t.String(),
          codes: t.Any(),
          specializationId: t.String(),
          prepNotes: t.String(),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "OperationProcedureDefinition" },
  ),
);

export const OperationProcedureDefinitionWhereUnique = t.Recursive(
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
              defaultTier: t.Union(
                [
                  t.Literal("MINOR"),
                  t.Literal("INTERMEDIATE"),
                  t.Literal("MAJOR"),
                ],
                { additionalProperties: false },
              ),
              defaultAnesthesia: t.Union(
                [
                  t.Literal("NONE"),
                  t.Literal("ANXIOLYSIS"),
                  t.Literal("SEDATION"),
                  t.Literal("GENERAL_ANESTHESIA"),
                ],
                { additionalProperties: false },
              ),
              defaultWoundClass: t.Union(
                [
                  t.Literal("CLEAN"),
                  t.Literal("CLEAN_CONTAMINATED"),
                  t.Literal("CONTAMINATED"),
                  t.Literal("DIRTY"),
                ],
                { additionalProperties: false },
              ),
              requiresLaterality: t.Boolean(),
              bodySystem: t.String(),
              codes: t.Any(),
              specializationId: t.String(),
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
  { $id: "OperationProcedureDefinition" },
);

export const OperationProcedureDefinitionSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      serviceId: t.Boolean(),
      defaultTier: t.Boolean(),
      defaultAnesthesia: t.Boolean(),
      defaultWoundClass: t.Boolean(),
      requiresLaterality: t.Boolean(),
      bodySystem: t.Boolean(),
      codes: t.Boolean(),
      specializationId: t.Boolean(),
      prepNotes: t.Boolean(),
      active: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      service: t.Boolean(),
      specialization: t.Boolean(),
      kitItems: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OperationProcedureDefinitionInclude = t.Partial(
  t.Object(
    {
      defaultTier: t.Boolean(),
      defaultAnesthesia: t.Boolean(),
      defaultWoundClass: t.Boolean(),
      clinic: t.Boolean(),
      service: t.Boolean(),
      specialization: t.Boolean(),
      kitItems: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OperationProcedureDefinitionOrderBy = t.Partial(
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
      requiresLaterality: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      bodySystem: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      codes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      specializationId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const OperationProcedureDefinition = t.Composite(
  [OperationProcedureDefinitionPlain, OperationProcedureDefinitionRelations],
  { additionalProperties: false },
);

export const OperationProcedureDefinitionInputCreate = t.Composite(
  [
    OperationProcedureDefinitionPlainInputCreate,
    OperationProcedureDefinitionRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const OperationProcedureDefinitionInputUpdate = t.Composite(
  [
    OperationProcedureDefinitionPlainInputUpdate,
    OperationProcedureDefinitionRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
