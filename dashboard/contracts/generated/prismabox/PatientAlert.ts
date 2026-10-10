import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PatientAlertPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    patientId: t.String(),
    kind: t.Union(
      [
        t.Literal("ALLERGY"),
        t.Literal("CHRONIC_CONDITION"),
        t.Literal("BITE_RISK"),
        t.Literal("CODE_STATUS"),
        t.Literal("OTHER"),
      ],
      { additionalProperties: false },
    ),
    label: t.String({
      description: `ALLERGY: المادة · CHRONIC_CONDITION: الحالة · CODE_STATUS: DNR/CPR · BITE_RISK: السلوك`,
    }),
    severity: t.Union(
      [t.Literal("MILD"), t.Literal("MODERATE"), t.Literal("SEVERE")],
      { additionalProperties: false },
    ),
    notes: __nullable__(t.String()),
    active: t.Boolean(),
    recordedById: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `تنبيه سلامة على مستوى **المريض** — لا على مستوى مستند.
اليوم لا وجود لهذا: الحساسية نصٌّ حرّ في تقييم ما قبل التخدير
(\`operations.dao.ts\`) وخانةٌ في إقرار الفندقة، ولا شيء منهما تقرؤه الصيدلية ولا
شاشة الفرز. ونظامٌ يصرف موادّ مراقبة وحساسياتُه نصٌّ حرّ في نموذج تخدير له ثغرة
سلامة قائمة بذاتها، مستقلّة تمامًا عن الطوارئ.`,
  },
);

export const PatientAlertRelations = t.Object(
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
    patient: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        ownerId: __nullable__(t.String()),
        name: t.String(),
        nameNormalized: t.String(),
        gender: t.Union(
          [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
          { additionalProperties: false },
        ),
        animalTypeId: t.String(),
        animalStrainId: __nullable__(t.String()),
        age: __nullable__(t.Number()),
        birthDate: __nullable__(t.Date()),
        weight: __nullable__(t.Number()),
        microchipNumber: __nullable__(t.String()),
        coat: __nullable__(t.String()),
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
    recordedBy: __nullable__(
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
  },
  {
    additionalProperties: false,
    description: `تنبيه سلامة على مستوى **المريض** — لا على مستوى مستند.
اليوم لا وجود لهذا: الحساسية نصٌّ حرّ في تقييم ما قبل التخدير
(\`operations.dao.ts\`) وخانةٌ في إقرار الفندقة، ولا شيء منهما تقرؤه الصيدلية ولا
شاشة الفرز. ونظامٌ يصرف موادّ مراقبة وحساسياتُه نصٌّ حرّ في نموذج تخدير له ثغرة
سلامة قائمة بذاتها، مستقلّة تمامًا عن الطوارئ.`,
  },
);

export const PatientAlertPlainInputCreate = t.Object(
  {
    kind: t.Union(
      [
        t.Literal("ALLERGY"),
        t.Literal("CHRONIC_CONDITION"),
        t.Literal("BITE_RISK"),
        t.Literal("CODE_STATUS"),
        t.Literal("OTHER"),
      ],
      { additionalProperties: false },
    ),
    label: t.String({
      description: `ALLERGY: المادة · CHRONIC_CONDITION: الحالة · CODE_STATUS: DNR/CPR · BITE_RISK: السلوك`,
    }),
    severity: t.Optional(
      t.Union([t.Literal("MILD"), t.Literal("MODERATE"), t.Literal("SEVERE")], {
        additionalProperties: false,
      }),
    ),
    notes: t.Optional(__nullable__(t.String())),
    active: t.Optional(t.Boolean()),
  },
  {
    additionalProperties: false,
    description: `تنبيه سلامة على مستوى **المريض** — لا على مستوى مستند.
اليوم لا وجود لهذا: الحساسية نصٌّ حرّ في تقييم ما قبل التخدير
(\`operations.dao.ts\`) وخانةٌ في إقرار الفندقة، ولا شيء منهما تقرؤه الصيدلية ولا
شاشة الفرز. ونظامٌ يصرف موادّ مراقبة وحساسياتُه نصٌّ حرّ في نموذج تخدير له ثغرة
سلامة قائمة بذاتها، مستقلّة تمامًا عن الطوارئ.`,
  },
);

export const PatientAlertPlainInputUpdate = t.Object(
  {
    kind: t.Optional(
      t.Union(
        [
          t.Literal("ALLERGY"),
          t.Literal("CHRONIC_CONDITION"),
          t.Literal("BITE_RISK"),
          t.Literal("CODE_STATUS"),
          t.Literal("OTHER"),
        ],
        { additionalProperties: false },
      ),
    ),
    label: t.Optional(
      t.String({
        description: `ALLERGY: المادة · CHRONIC_CONDITION: الحالة · CODE_STATUS: DNR/CPR · BITE_RISK: السلوك`,
      }),
    ),
    severity: t.Optional(
      t.Union([t.Literal("MILD"), t.Literal("MODERATE"), t.Literal("SEVERE")], {
        additionalProperties: false,
      }),
    ),
    notes: t.Optional(__nullable__(t.String())),
    active: t.Optional(t.Boolean()),
  },
  {
    additionalProperties: false,
    description: `تنبيه سلامة على مستوى **المريض** — لا على مستوى مستند.
اليوم لا وجود لهذا: الحساسية نصٌّ حرّ في تقييم ما قبل التخدير
(\`operations.dao.ts\`) وخانةٌ في إقرار الفندقة، ولا شيء منهما تقرؤه الصيدلية ولا
شاشة الفرز. ونظامٌ يصرف موادّ مراقبة وحساسياتُه نصٌّ حرّ في نموذج تخدير له ثغرة
سلامة قائمة بذاتها، مستقلّة تمامًا عن الطوارئ.`,
  },
);

export const PatientAlertRelationsInputCreate = t.Object(
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
    patient: t.Object(
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
    recordedBy: t.Optional(
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
  },
  {
    additionalProperties: false,
    description: `تنبيه سلامة على مستوى **المريض** — لا على مستوى مستند.
اليوم لا وجود لهذا: الحساسية نصٌّ حرّ في تقييم ما قبل التخدير
(\`operations.dao.ts\`) وخانةٌ في إقرار الفندقة، ولا شيء منهما تقرؤه الصيدلية ولا
شاشة الفرز. ونظامٌ يصرف موادّ مراقبة وحساسياتُه نصٌّ حرّ في نموذج تخدير له ثغرة
سلامة قائمة بذاتها، مستقلّة تمامًا عن الطوارئ.`,
  },
);

export const PatientAlertRelationsInputUpdate = t.Partial(
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
      patient: t.Object(
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
      recordedBy: t.Partial(
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
    },
    {
      additionalProperties: false,
      description: `تنبيه سلامة على مستوى **المريض** — لا على مستوى مستند.
اليوم لا وجود لهذا: الحساسية نصٌّ حرّ في تقييم ما قبل التخدير
(\`operations.dao.ts\`) وخانةٌ في إقرار الفندقة، ولا شيء منهما تقرؤه الصيدلية ولا
شاشة الفرز. ونظامٌ يصرف موادّ مراقبة وحساسياتُه نصٌّ حرّ في نموذج تخدير له ثغرة
سلامة قائمة بذاتها، مستقلّة تمامًا عن الطوارئ.`,
    },
  ),
);

export const PatientAlertWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          patientId: t.String(),
          kind: t.Union(
            [
              t.Literal("ALLERGY"),
              t.Literal("CHRONIC_CONDITION"),
              t.Literal("BITE_RISK"),
              t.Literal("CODE_STATUS"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          label: t.String({
            description: `ALLERGY: المادة · CHRONIC_CONDITION: الحالة · CODE_STATUS: DNR/CPR · BITE_RISK: السلوك`,
          }),
          severity: t.Union(
            [t.Literal("MILD"), t.Literal("MODERATE"), t.Literal("SEVERE")],
            { additionalProperties: false },
          ),
          notes: t.String(),
          active: t.Boolean(),
          recordedById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `تنبيه سلامة على مستوى **المريض** — لا على مستوى مستند.
اليوم لا وجود لهذا: الحساسية نصٌّ حرّ في تقييم ما قبل التخدير
(\`operations.dao.ts\`) وخانةٌ في إقرار الفندقة، ولا شيء منهما تقرؤه الصيدلية ولا
شاشة الفرز. ونظامٌ يصرف موادّ مراقبة وحساسياتُه نصٌّ حرّ في نموذج تخدير له ثغرة
سلامة قائمة بذاتها، مستقلّة تمامًا عن الطوارئ.`,
        },
      ),
    { $id: "PatientAlert" },
  ),
);

export const PatientAlertWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `تنبيه سلامة على مستوى **المريض** — لا على مستوى مستند.
اليوم لا وجود لهذا: الحساسية نصٌّ حرّ في تقييم ما قبل التخدير
(\`operations.dao.ts\`) وخانةٌ في إقرار الفندقة، ولا شيء منهما تقرؤه الصيدلية ولا
شاشة الفرز. ونظامٌ يصرف موادّ مراقبة وحساسياتُه نصٌّ حرّ في نموذج تخدير له ثغرة
سلامة قائمة بذاتها، مستقلّة تمامًا عن الطوارئ.`,
            },
          ),
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
              patientId: t.String(),
              kind: t.Union(
                [
                  t.Literal("ALLERGY"),
                  t.Literal("CHRONIC_CONDITION"),
                  t.Literal("BITE_RISK"),
                  t.Literal("CODE_STATUS"),
                  t.Literal("OTHER"),
                ],
                { additionalProperties: false },
              ),
              label: t.String({
                description: `ALLERGY: المادة · CHRONIC_CONDITION: الحالة · CODE_STATUS: DNR/CPR · BITE_RISK: السلوك`,
              }),
              severity: t.Union(
                [t.Literal("MILD"), t.Literal("MODERATE"), t.Literal("SEVERE")],
                { additionalProperties: false },
              ),
              notes: t.String(),
              active: t.Boolean(),
              recordedById: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PatientAlert" },
);

export const PatientAlertSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      patientId: t.Boolean(),
      kind: t.Boolean(),
      label: t.Boolean(),
      severity: t.Boolean(),
      notes: t.Boolean(),
      active: t.Boolean(),
      recordedById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      patient: t.Boolean(),
      recordedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `تنبيه سلامة على مستوى **المريض** — لا على مستوى مستند.
اليوم لا وجود لهذا: الحساسية نصٌّ حرّ في تقييم ما قبل التخدير
(\`operations.dao.ts\`) وخانةٌ في إقرار الفندقة، ولا شيء منهما تقرؤه الصيدلية ولا
شاشة الفرز. ونظامٌ يصرف موادّ مراقبة وحساسياتُه نصٌّ حرّ في نموذج تخدير له ثغرة
سلامة قائمة بذاتها، مستقلّة تمامًا عن الطوارئ.`,
    },
  ),
);

export const PatientAlertInclude = t.Partial(
  t.Object(
    {
      kind: t.Boolean(),
      severity: t.Boolean(),
      clinic: t.Boolean(),
      patient: t.Boolean(),
      recordedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `تنبيه سلامة على مستوى **المريض** — لا على مستوى مستند.
اليوم لا وجود لهذا: الحساسية نصٌّ حرّ في تقييم ما قبل التخدير
(\`operations.dao.ts\`) وخانةٌ في إقرار الفندقة، ولا شيء منهما تقرؤه الصيدلية ولا
شاشة الفرز. ونظامٌ يصرف موادّ مراقبة وحساسياتُه نصٌّ حرّ في نموذج تخدير له ثغرة
سلامة قائمة بذاتها، مستقلّة تمامًا عن الطوارئ.`,
    },
  ),
);

export const PatientAlertOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      patientId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      label: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      active: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      recordedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `تنبيه سلامة على مستوى **المريض** — لا على مستوى مستند.
اليوم لا وجود لهذا: الحساسية نصٌّ حرّ في تقييم ما قبل التخدير
(\`operations.dao.ts\`) وخانةٌ في إقرار الفندقة، ولا شيء منهما تقرؤه الصيدلية ولا
شاشة الفرز. ونظامٌ يصرف موادّ مراقبة وحساسياتُه نصٌّ حرّ في نموذج تخدير له ثغرة
سلامة قائمة بذاتها، مستقلّة تمامًا عن الطوارئ.`,
    },
  ),
);

export const PatientAlert = t.Composite(
  [PatientAlertPlain, PatientAlertRelations],
  { additionalProperties: false },
);

export const PatientAlertInputCreate = t.Composite(
  [PatientAlertPlainInputCreate, PatientAlertRelationsInputCreate],
  { additionalProperties: false },
);

export const PatientAlertInputUpdate = t.Composite(
  [PatientAlertPlainInputUpdate, PatientAlertRelationsInputUpdate],
  { additionalProperties: false },
);
