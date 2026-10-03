import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClinicalNoteDiagnosisPlain = t.Object(
  {
    id: t.String(),
    noteId: t.String(),
    idx: t.Integer(),
    text: t.String(),
    code: __nullable__(t.String()),
    codeSystem: __nullable__(
      t.String({ description: `VENOM | SNOMED — يبقى فارغًا في هذه الخطة` }),
    ),
    kind: t.Union(
      [t.Literal("DIFFERENTIAL"), t.Literal("WORKING"), t.Literal("FINAL")],
      { additionalProperties: false },
    ),
    severity: __nullable__(
      t.Union(
        [
          t.Literal("MILD"),
          t.Literal("MODERATE"),
          t.Literal("SEVERE"),
          t.Literal("CRITICAL"),
        ],
        { additionalProperties: false },
      ),
    ),
    createdAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `التقييم «A» قائمةٌ لا سطر: تفريقي ← عامل ← نهائي.
يُشحن هذا الجدول الآن رغم أن كتالوج الترميز (VeNom/SNOMED) خارج نطاق الخطة —
لأن شحنه لاحقًا يعني ترحيل الملاحظات مرّتين، وشحنه عمودًا نصيًّا يعيد بناء القيد
نفسه الذي وُجدت الخطة لإزالته. \`code\` يبقى فارغًا حتى يصل الكتالوج.`,
  },
);

export const ClinicalNoteDiagnosisRelations = t.Object(
  {
    note: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        patientId: t.String({
          description: `مالك السجل هو الحيوان لا الموعد — ولهذا يبقى السجل حين يُحذف الموعد`,
        }),
        appointmentId: __nullable__(
          t.String({
            description: `null = ملاحظة بلا زيارة: استشارة هاتفية، فرز مراجع، أو رأي طبيب ثانٍ
(القرار §11-A). الموعد الواحد يحتمل أكثر من ملاحظة.`,
          }),
        ),
        templateId: __nullable__(
          t.String({
            description: `لقطة القالب — يبقى \`templateKey\`/\`templateVersion\` مقروءَين حتى لو حُذف الصف`,
          }),
        ),
        templateKey: __nullable__(t.String()),
        templateVersion: __nullable__(t.Integer()),
        authorUserId: t.String(),
        status: t.Union(
          [t.Literal("DRAFT"), t.Literal("FINAL"), t.Literal("AMENDED")],
          { additionalProperties: false },
        ),
        subjective: __nullable__(
          t.String({
            description: `النصّ المُركَّب — ما يقرأه إنسان. يُجمَّد عند التوثيق، ولا يتغيّر إذا عُدّل
القالب لاحقًا. هي نفس غريزة \`Invoice.priceSnapshot\`.`,
          }),
        ),
        objective: __nullable__(t.String()),
        assessment: __nullable__(t.String()),
        plan: __nullable__(t.String()),
        answers: t.Any({
          description: `{ [blockId]: value } — البنية القابلة للاستعلام، وهي ما تقرأه التقارير`,
        }),
        vitalsRecordId: __nullable__(
          t.String({
            description: `يُشار إلى القياس ولا يُعاد التقاطه — وحدة العلامات الحيوية تبقى الكاتب الوحيد`,
          }),
        ),
        finalizedAt: __nullable__(t.Date()),
        finalizedById: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      {
        additionalProperties: false,
        description: `ملاحظة سريرية واحدة — مسوَّدة تُكتب بحرّية، ثم تُوثَّق فلا تُعدَّل بعدها أبدًا.`,
      },
    ),
  },
  {
    additionalProperties: false,
    description: `التقييم «A» قائمةٌ لا سطر: تفريقي ← عامل ← نهائي.
يُشحن هذا الجدول الآن رغم أن كتالوج الترميز (VeNom/SNOMED) خارج نطاق الخطة —
لأن شحنه لاحقًا يعني ترحيل الملاحظات مرّتين، وشحنه عمودًا نصيًّا يعيد بناء القيد
نفسه الذي وُجدت الخطة لإزالته. \`code\` يبقى فارغًا حتى يصل الكتالوج.`,
  },
);

export const ClinicalNoteDiagnosisPlainInputCreate = t.Object(
  {
    idx: t.Integer(),
    text: t.String(),
    code: t.Optional(__nullable__(t.String())),
    codeSystem: t.Optional(
      __nullable__(
        t.String({ description: `VENOM | SNOMED — يبقى فارغًا في هذه الخطة` }),
      ),
    ),
    kind: t.Union(
      [t.Literal("DIFFERENTIAL"), t.Literal("WORKING"), t.Literal("FINAL")],
      { additionalProperties: false },
    ),
    severity: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("MILD"),
            t.Literal("MODERATE"),
            t.Literal("SEVERE"),
            t.Literal("CRITICAL"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `التقييم «A» قائمةٌ لا سطر: تفريقي ← عامل ← نهائي.
يُشحن هذا الجدول الآن رغم أن كتالوج الترميز (VeNom/SNOMED) خارج نطاق الخطة —
لأن شحنه لاحقًا يعني ترحيل الملاحظات مرّتين، وشحنه عمودًا نصيًّا يعيد بناء القيد
نفسه الذي وُجدت الخطة لإزالته. \`code\` يبقى فارغًا حتى يصل الكتالوج.`,
  },
);

export const ClinicalNoteDiagnosisPlainInputUpdate = t.Object(
  {
    idx: t.Optional(t.Integer()),
    text: t.Optional(t.String()),
    code: t.Optional(__nullable__(t.String())),
    codeSystem: t.Optional(
      __nullable__(
        t.String({ description: `VENOM | SNOMED — يبقى فارغًا في هذه الخطة` }),
      ),
    ),
    kind: t.Optional(
      t.Union(
        [t.Literal("DIFFERENTIAL"), t.Literal("WORKING"), t.Literal("FINAL")],
        { additionalProperties: false },
      ),
    ),
    severity: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("MILD"),
            t.Literal("MODERATE"),
            t.Literal("SEVERE"),
            t.Literal("CRITICAL"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `التقييم «A» قائمةٌ لا سطر: تفريقي ← عامل ← نهائي.
يُشحن هذا الجدول الآن رغم أن كتالوج الترميز (VeNom/SNOMED) خارج نطاق الخطة —
لأن شحنه لاحقًا يعني ترحيل الملاحظات مرّتين، وشحنه عمودًا نصيًّا يعيد بناء القيد
نفسه الذي وُجدت الخطة لإزالته. \`code\` يبقى فارغًا حتى يصل الكتالوج.`,
  },
);

export const ClinicalNoteDiagnosisRelationsInputCreate = t.Object(
  {
    note: t.Object(
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
    description: `التقييم «A» قائمةٌ لا سطر: تفريقي ← عامل ← نهائي.
يُشحن هذا الجدول الآن رغم أن كتالوج الترميز (VeNom/SNOMED) خارج نطاق الخطة —
لأن شحنه لاحقًا يعني ترحيل الملاحظات مرّتين، وشحنه عمودًا نصيًّا يعيد بناء القيد
نفسه الذي وُجدت الخطة لإزالته. \`code\` يبقى فارغًا حتى يصل الكتالوج.`,
  },
);

export const ClinicalNoteDiagnosisRelationsInputUpdate = t.Partial(
  t.Object(
    {
      note: t.Object(
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
      description: `التقييم «A» قائمةٌ لا سطر: تفريقي ← عامل ← نهائي.
يُشحن هذا الجدول الآن رغم أن كتالوج الترميز (VeNom/SNOMED) خارج نطاق الخطة —
لأن شحنه لاحقًا يعني ترحيل الملاحظات مرّتين، وشحنه عمودًا نصيًّا يعيد بناء القيد
نفسه الذي وُجدت الخطة لإزالته. \`code\` يبقى فارغًا حتى يصل الكتالوج.`,
    },
  ),
);

export const ClinicalNoteDiagnosisWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          noteId: t.String(),
          idx: t.Integer(),
          text: t.String(),
          code: t.String(),
          codeSystem: t.String({
            description: `VENOM | SNOMED — يبقى فارغًا في هذه الخطة`,
          }),
          kind: t.Union(
            [
              t.Literal("DIFFERENTIAL"),
              t.Literal("WORKING"),
              t.Literal("FINAL"),
            ],
            { additionalProperties: false },
          ),
          severity: t.Union(
            [
              t.Literal("MILD"),
              t.Literal("MODERATE"),
              t.Literal("SEVERE"),
              t.Literal("CRITICAL"),
            ],
            { additionalProperties: false },
          ),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `التقييم «A» قائمةٌ لا سطر: تفريقي ← عامل ← نهائي.
يُشحن هذا الجدول الآن رغم أن كتالوج الترميز (VeNom/SNOMED) خارج نطاق الخطة —
لأن شحنه لاحقًا يعني ترحيل الملاحظات مرّتين، وشحنه عمودًا نصيًّا يعيد بناء القيد
نفسه الذي وُجدت الخطة لإزالته. \`code\` يبقى فارغًا حتى يصل الكتالوج.`,
        },
      ),
    { $id: "ClinicalNoteDiagnosis" },
  ),
);

export const ClinicalNoteDiagnosisWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `التقييم «A» قائمةٌ لا سطر: تفريقي ← عامل ← نهائي.
يُشحن هذا الجدول الآن رغم أن كتالوج الترميز (VeNom/SNOMED) خارج نطاق الخطة —
لأن شحنه لاحقًا يعني ترحيل الملاحظات مرّتين، وشحنه عمودًا نصيًّا يعيد بناء القيد
نفسه الذي وُجدت الخطة لإزالته. \`code\` يبقى فارغًا حتى يصل الكتالوج.`,
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
              noteId: t.String(),
              idx: t.Integer(),
              text: t.String(),
              code: t.String(),
              codeSystem: t.String({
                description: `VENOM | SNOMED — يبقى فارغًا في هذه الخطة`,
              }),
              kind: t.Union(
                [
                  t.Literal("DIFFERENTIAL"),
                  t.Literal("WORKING"),
                  t.Literal("FINAL"),
                ],
                { additionalProperties: false },
              ),
              severity: t.Union(
                [
                  t.Literal("MILD"),
                  t.Literal("MODERATE"),
                  t.Literal("SEVERE"),
                  t.Literal("CRITICAL"),
                ],
                { additionalProperties: false },
              ),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ClinicalNoteDiagnosis" },
);

export const ClinicalNoteDiagnosisSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      noteId: t.Boolean(),
      idx: t.Boolean(),
      text: t.Boolean(),
      code: t.Boolean(),
      codeSystem: t.Boolean(),
      kind: t.Boolean(),
      severity: t.Boolean(),
      createdAt: t.Boolean(),
      note: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `التقييم «A» قائمةٌ لا سطر: تفريقي ← عامل ← نهائي.
يُشحن هذا الجدول الآن رغم أن كتالوج الترميز (VeNom/SNOMED) خارج نطاق الخطة —
لأن شحنه لاحقًا يعني ترحيل الملاحظات مرّتين، وشحنه عمودًا نصيًّا يعيد بناء القيد
نفسه الذي وُجدت الخطة لإزالته. \`code\` يبقى فارغًا حتى يصل الكتالوج.`,
    },
  ),
);

export const ClinicalNoteDiagnosisInclude = t.Partial(
  t.Object(
    {
      kind: t.Boolean(),
      severity: t.Boolean(),
      note: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `التقييم «A» قائمةٌ لا سطر: تفريقي ← عامل ← نهائي.
يُشحن هذا الجدول الآن رغم أن كتالوج الترميز (VeNom/SNOMED) خارج نطاق الخطة —
لأن شحنه لاحقًا يعني ترحيل الملاحظات مرّتين، وشحنه عمودًا نصيًّا يعيد بناء القيد
نفسه الذي وُجدت الخطة لإزالته. \`code\` يبقى فارغًا حتى يصل الكتالوج.`,
    },
  ),
);

export const ClinicalNoteDiagnosisOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      noteId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      idx: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      text: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      code: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      codeSystem: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `التقييم «A» قائمةٌ لا سطر: تفريقي ← عامل ← نهائي.
يُشحن هذا الجدول الآن رغم أن كتالوج الترميز (VeNom/SNOMED) خارج نطاق الخطة —
لأن شحنه لاحقًا يعني ترحيل الملاحظات مرّتين، وشحنه عمودًا نصيًّا يعيد بناء القيد
نفسه الذي وُجدت الخطة لإزالته. \`code\` يبقى فارغًا حتى يصل الكتالوج.`,
    },
  ),
);

export const ClinicalNoteDiagnosis = t.Composite(
  [ClinicalNoteDiagnosisPlain, ClinicalNoteDiagnosisRelations],
  { additionalProperties: false },
);

export const ClinicalNoteDiagnosisInputCreate = t.Composite(
  [
    ClinicalNoteDiagnosisPlainInputCreate,
    ClinicalNoteDiagnosisRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const ClinicalNoteDiagnosisInputUpdate = t.Composite(
  [
    ClinicalNoteDiagnosisPlainInputUpdate,
    ClinicalNoteDiagnosisRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
