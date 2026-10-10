import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClinicalNoteAddendumPlain = t.Object(
  {
    id: t.String(),
    noteId: t.String(),
    text: t.String(),
    authoredById: __nullable__(t.String()),
    createdAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `التصحيح بعد التوثيق يُلحَق ولا يُكتب فوقه — نمط \`RadiologyReportAddendum\` نفسه.`,
  },
);

export const ClinicalNoteAddendumRelations = t.Object(
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
    authoredBy: __nullable__(
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
    description: `التصحيح بعد التوثيق يُلحَق ولا يُكتب فوقه — نمط \`RadiologyReportAddendum\` نفسه.`,
  },
);

export const ClinicalNoteAddendumPlainInputCreate = t.Object(
  { text: t.String() },
  {
    additionalProperties: false,
    description: `التصحيح بعد التوثيق يُلحَق ولا يُكتب فوقه — نمط \`RadiologyReportAddendum\` نفسه.`,
  },
);

export const ClinicalNoteAddendumPlainInputUpdate = t.Object(
  { text: t.Optional(t.String()) },
  {
    additionalProperties: false,
    description: `التصحيح بعد التوثيق يُلحَق ولا يُكتب فوقه — نمط \`RadiologyReportAddendum\` نفسه.`,
  },
);

export const ClinicalNoteAddendumRelationsInputCreate = t.Object(
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
    authoredBy: t.Optional(
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
    description: `التصحيح بعد التوثيق يُلحَق ولا يُكتب فوقه — نمط \`RadiologyReportAddendum\` نفسه.`,
  },
);

export const ClinicalNoteAddendumRelationsInputUpdate = t.Partial(
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
      authoredBy: t.Partial(
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
      description: `التصحيح بعد التوثيق يُلحَق ولا يُكتب فوقه — نمط \`RadiologyReportAddendum\` نفسه.`,
    },
  ),
);

export const ClinicalNoteAddendumWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          noteId: t.String(),
          text: t.String(),
          authoredById: t.String(),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `التصحيح بعد التوثيق يُلحَق ولا يُكتب فوقه — نمط \`RadiologyReportAddendum\` نفسه.`,
        },
      ),
    { $id: "ClinicalNoteAddendum" },
  ),
);

export const ClinicalNoteAddendumWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `التصحيح بعد التوثيق يُلحَق ولا يُكتب فوقه — نمط \`RadiologyReportAddendum\` نفسه.`,
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
              text: t.String(),
              authoredById: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ClinicalNoteAddendum" },
);

export const ClinicalNoteAddendumSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      noteId: t.Boolean(),
      text: t.Boolean(),
      authoredById: t.Boolean(),
      createdAt: t.Boolean(),
      note: t.Boolean(),
      authoredBy: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `التصحيح بعد التوثيق يُلحَق ولا يُكتب فوقه — نمط \`RadiologyReportAddendum\` نفسه.`,
    },
  ),
);

export const ClinicalNoteAddendumInclude = t.Partial(
  t.Object(
    { note: t.Boolean(), authoredBy: t.Boolean(), _count: t.Boolean() },
    {
      additionalProperties: false,
      description: `التصحيح بعد التوثيق يُلحَق ولا يُكتب فوقه — نمط \`RadiologyReportAddendum\` نفسه.`,
    },
  ),
);

export const ClinicalNoteAddendumOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      noteId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      text: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      authoredById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `التصحيح بعد التوثيق يُلحَق ولا يُكتب فوقه — نمط \`RadiologyReportAddendum\` نفسه.`,
    },
  ),
);

export const ClinicalNoteAddendum = t.Composite(
  [ClinicalNoteAddendumPlain, ClinicalNoteAddendumRelations],
  { additionalProperties: false },
);

export const ClinicalNoteAddendumInputCreate = t.Composite(
  [
    ClinicalNoteAddendumPlainInputCreate,
    ClinicalNoteAddendumRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const ClinicalNoteAddendumInputUpdate = t.Composite(
  [
    ClinicalNoteAddendumPlainInputUpdate,
    ClinicalNoteAddendumRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
