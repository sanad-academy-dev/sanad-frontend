import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ConsentTemplatePlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    key: t.String(),
    type: t.Union(
      [
        t.Literal("SURGICAL"),
        t.Literal("ANESTHESIA"),
        t.Literal("BLOOD_PRODUCTS"),
        t.Literal("EUTHANASIA"),
        t.Literal("FINANCIAL_ESTIMATE"),
        t.Literal("HIGH_RISK_SURGICAL"),
        t.Literal("HOSPITALIZATION"),
        t.Literal("DISCHARGE_HEALTHY"),
        t.Literal("DISCHARGE_HOME_TREATMENT"),
        t.Literal("DISCHARGE_AGAINST_ADVICE"),
        t.Literal("BOARDING"),
        t.Literal("GROOMING"),
        t.Literal("EMERGENCY_TREATMENT"),
      ],
      { additionalProperties: false },
    ),
    version: t.Integer(),
    titleAr: t.String(),
    titleEn: t.String(),
    defaultLocale: t.Union(
      [t.Literal("AR"), t.Literal("EN"), t.Literal("BOTH")],
      { additionalProperties: false },
    ),
    speciesKey: __nullable__(t.String()),
    blocks: t.Any(),
    active: t.Boolean(),
    isDefault: t.Boolean(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const ConsentTemplateRelations = t.Object(
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
    consents: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          patientId: t.String(),
          ownerId: t.String(),
          templateId: __nullable__(t.String()),
          templateKey: t.String(),
          templateVersion: t.Integer(),
          type: t.Union(
            [
              t.Literal("SURGICAL"),
              t.Literal("ANESTHESIA"),
              t.Literal("BLOOD_PRODUCTS"),
              t.Literal("EUTHANASIA"),
              t.Literal("FINANCIAL_ESTIMATE"),
              t.Literal("HIGH_RISK_SURGICAL"),
              t.Literal("HOSPITALIZATION"),
              t.Literal("DISCHARGE_HEALTHY"),
              t.Literal("DISCHARGE_HOME_TREATMENT"),
              t.Literal("DISCHARGE_AGAINST_ADVICE"),
              t.Literal("BOARDING"),
              t.Literal("GROOMING"),
              t.Literal("EMERGENCY_TREATMENT"),
            ],
            { additionalProperties: false },
          ),
          locale: t.Union(
            [t.Literal("AR"), t.Literal("EN"), t.Literal("BOTH")],
            { additionalProperties: false },
          ),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("AWAITING_SIGNATURE"),
              t.Literal("SIGNED"),
              t.Literal("REVOKED"),
            ],
            { additionalProperties: false },
          ),
          operationCaseId: __nullable__(t.String()),
          appointmentId: __nullable__(t.String()),
          inpatientStayId: __nullable__(t.String()),
          fieldValues: t.Any(),
          textSnapshot: t.String(),
          signerName: __nullable__(t.String()),
          signerRelationship: __nullable__(t.String()),
          signatureMethod: __nullable__(
            t.Union(
              [
                t.Literal("DRAWN"),
                t.Literal("TYPED"),
                t.Literal("UPLOADED"),
                t.Literal("VERBAL_WITNESSED"),
              ],
              { additionalProperties: false },
            ),
          ),
          signatureUrl: __nullable__(t.String()),
          witnessStaffId: __nullable__(t.String()),
          signedByStaffId: __nullable__(t.String()),
          signedAt: __nullable__(t.Date()),
          revokedAt: __nullable__(t.Date()),
          revokeReason: __nullable__(t.String()),
          sourceScanUrl: __nullable__(t.String()),
          extractedByAi: t.Boolean(),
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

export const ConsentTemplatePlainInputCreate = t.Object(
  {
    key: t.String(),
    type: t.Union(
      [
        t.Literal("SURGICAL"),
        t.Literal("ANESTHESIA"),
        t.Literal("BLOOD_PRODUCTS"),
        t.Literal("EUTHANASIA"),
        t.Literal("FINANCIAL_ESTIMATE"),
        t.Literal("HIGH_RISK_SURGICAL"),
        t.Literal("HOSPITALIZATION"),
        t.Literal("DISCHARGE_HEALTHY"),
        t.Literal("DISCHARGE_HOME_TREATMENT"),
        t.Literal("DISCHARGE_AGAINST_ADVICE"),
        t.Literal("BOARDING"),
        t.Literal("GROOMING"),
        t.Literal("EMERGENCY_TREATMENT"),
      ],
      { additionalProperties: false },
    ),
    version: t.Optional(t.Integer()),
    titleAr: t.String(),
    titleEn: t.String(),
    defaultLocale: t.Optional(
      t.Union([t.Literal("AR"), t.Literal("EN"), t.Literal("BOTH")], {
        additionalProperties: false,
      }),
    ),
    speciesKey: t.Optional(__nullable__(t.String())),
    blocks: t.Any(),
    active: t.Optional(t.Boolean()),
    isDefault: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const ConsentTemplatePlainInputUpdate = t.Object(
  {
    key: t.Optional(t.String()),
    type: t.Optional(
      t.Union(
        [
          t.Literal("SURGICAL"),
          t.Literal("ANESTHESIA"),
          t.Literal("BLOOD_PRODUCTS"),
          t.Literal("EUTHANASIA"),
          t.Literal("FINANCIAL_ESTIMATE"),
          t.Literal("HIGH_RISK_SURGICAL"),
          t.Literal("HOSPITALIZATION"),
          t.Literal("DISCHARGE_HEALTHY"),
          t.Literal("DISCHARGE_HOME_TREATMENT"),
          t.Literal("DISCHARGE_AGAINST_ADVICE"),
          t.Literal("BOARDING"),
          t.Literal("GROOMING"),
          t.Literal("EMERGENCY_TREATMENT"),
        ],
        { additionalProperties: false },
      ),
    ),
    version: t.Optional(t.Integer()),
    titleAr: t.Optional(t.String()),
    titleEn: t.Optional(t.String()),
    defaultLocale: t.Optional(
      t.Union([t.Literal("AR"), t.Literal("EN"), t.Literal("BOTH")], {
        additionalProperties: false,
      }),
    ),
    speciesKey: t.Optional(__nullable__(t.String())),
    blocks: t.Optional(t.Any()),
    active: t.Optional(t.Boolean()),
    isDefault: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const ConsentTemplateRelationsInputCreate = t.Object(
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
    consents: t.Optional(
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

export const ConsentTemplateRelationsInputUpdate = t.Partial(
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
      consents: t.Partial(
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

export const ConsentTemplateWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          key: t.String(),
          type: t.Union(
            [
              t.Literal("SURGICAL"),
              t.Literal("ANESTHESIA"),
              t.Literal("BLOOD_PRODUCTS"),
              t.Literal("EUTHANASIA"),
              t.Literal("FINANCIAL_ESTIMATE"),
              t.Literal("HIGH_RISK_SURGICAL"),
              t.Literal("HOSPITALIZATION"),
              t.Literal("DISCHARGE_HEALTHY"),
              t.Literal("DISCHARGE_HOME_TREATMENT"),
              t.Literal("DISCHARGE_AGAINST_ADVICE"),
              t.Literal("BOARDING"),
              t.Literal("GROOMING"),
              t.Literal("EMERGENCY_TREATMENT"),
            ],
            { additionalProperties: false },
          ),
          version: t.Integer(),
          titleAr: t.String(),
          titleEn: t.String(),
          defaultLocale: t.Union(
            [t.Literal("AR"), t.Literal("EN"), t.Literal("BOTH")],
            { additionalProperties: false },
          ),
          speciesKey: t.String(),
          blocks: t.Any(),
          active: t.Boolean(),
          isDefault: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "ConsentTemplate" },
  ),
);

export const ConsentTemplateWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_key_version: t.Object(
                { clinicId: t.String(), key: t.String(), version: t.Integer() },
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
              clinicId_key_version: t.Object(
                { clinicId: t.String(), key: t.String(), version: t.Integer() },
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
              key: t.String(),
              type: t.Union(
                [
                  t.Literal("SURGICAL"),
                  t.Literal("ANESTHESIA"),
                  t.Literal("BLOOD_PRODUCTS"),
                  t.Literal("EUTHANASIA"),
                  t.Literal("FINANCIAL_ESTIMATE"),
                  t.Literal("HIGH_RISK_SURGICAL"),
                  t.Literal("HOSPITALIZATION"),
                  t.Literal("DISCHARGE_HEALTHY"),
                  t.Literal("DISCHARGE_HOME_TREATMENT"),
                  t.Literal("DISCHARGE_AGAINST_ADVICE"),
                  t.Literal("BOARDING"),
                  t.Literal("GROOMING"),
                  t.Literal("EMERGENCY_TREATMENT"),
                ],
                { additionalProperties: false },
              ),
              version: t.Integer(),
              titleAr: t.String(),
              titleEn: t.String(),
              defaultLocale: t.Union(
                [t.Literal("AR"), t.Literal("EN"), t.Literal("BOTH")],
                { additionalProperties: false },
              ),
              speciesKey: t.String(),
              blocks: t.Any(),
              active: t.Boolean(),
              isDefault: t.Boolean(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ConsentTemplate" },
);

export const ConsentTemplateSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      key: t.Boolean(),
      type: t.Boolean(),
      version: t.Boolean(),
      titleAr: t.Boolean(),
      titleEn: t.Boolean(),
      defaultLocale: t.Boolean(),
      speciesKey: t.Boolean(),
      blocks: t.Boolean(),
      active: t.Boolean(),
      isDefault: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      consents: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ConsentTemplateInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      defaultLocale: t.Boolean(),
      clinic: t.Boolean(),
      consents: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ConsentTemplateOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      key: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      version: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      titleAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      titleEn: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      speciesKey: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      blocks: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      active: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDefault: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const ConsentTemplate = t.Composite(
  [ConsentTemplatePlain, ConsentTemplateRelations],
  { additionalProperties: false },
);

export const ConsentTemplateInputCreate = t.Composite(
  [ConsentTemplatePlainInputCreate, ConsentTemplateRelationsInputCreate],
  { additionalProperties: false },
);

export const ConsentTemplateInputUpdate = t.Composite(
  [ConsentTemplatePlainInputUpdate, ConsentTemplateRelationsInputUpdate],
  { additionalProperties: false },
);
