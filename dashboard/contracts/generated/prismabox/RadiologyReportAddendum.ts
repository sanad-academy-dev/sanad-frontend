import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RadiologyReportAddendumPlain = t.Object(
  {
    id: t.String(),
    reportId: t.String(),
    text: t.String(),
    authoredById: __nullable__(t.String()),
    createdAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `ملحق تقرير — التقرير المعتمد لا يُعدَّل، فالتصحيح أو الإضافة بعده تُلحَق
كسطر مستقل مؤرَّخ وموقَّع. هذا مطلب توثيقي: الأصل يبقى كما اعتُمد.`,
  },
);

export const RadiologyReportAddendumRelations = t.Object(
  {
    report: t.Object(
      {
        id: t.String(),
        itemId: t.String(),
        technique: __nullable__(t.String()),
        comparison: __nullable__(t.String()),
        findings: __nullable__(t.String()),
        impression: __nullable__(t.String()),
        recommendations: __nullable__(t.String()),
        criticalFinding: t.Boolean(),
        criticalNotifiedAt: __nullable__(t.Date()),
        criticalNotifiedTo: __nullable__(t.String()),
        criticalNotifiedToId: __nullable__(t.String()),
        aiDrafted: t.Boolean(),
        authoredById: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
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
    mentions: t.Array(
      t.Object(
        {
          id: t.String(),
          addendumId: t.String(),
          staffId: t.String(),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `إشارة إلى موظّف داخل ملحق — يُخطَر بها في صندوق الوارد`,
        },
      ),
      { additionalProperties: false },
    ),
    attachments: t.Array(
      t.Object(
        {
          id: t.String(),
          addendumId: t.String(),
          fileKey: t.String(),
          fileName: t.String(),
          mimeType: __nullable__(t.String()),
          sizeBytes: __nullable__(t.Integer()),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `ملف مرفق بملحق التقرير (تقرير خارجي، صورة، استشارة)`,
        },
      ),
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `ملحق تقرير — التقرير المعتمد لا يُعدَّل، فالتصحيح أو الإضافة بعده تُلحَق
كسطر مستقل مؤرَّخ وموقَّع. هذا مطلب توثيقي: الأصل يبقى كما اعتُمد.`,
  },
);

export const RadiologyReportAddendumPlainInputCreate = t.Object(
  { text: t.String() },
  {
    additionalProperties: false,
    description: `ملحق تقرير — التقرير المعتمد لا يُعدَّل، فالتصحيح أو الإضافة بعده تُلحَق
كسطر مستقل مؤرَّخ وموقَّع. هذا مطلب توثيقي: الأصل يبقى كما اعتُمد.`,
  },
);

export const RadiologyReportAddendumPlainInputUpdate = t.Object(
  { text: t.Optional(t.String()) },
  {
    additionalProperties: false,
    description: `ملحق تقرير — التقرير المعتمد لا يُعدَّل، فالتصحيح أو الإضافة بعده تُلحَق
كسطر مستقل مؤرَّخ وموقَّع. هذا مطلب توثيقي: الأصل يبقى كما اعتُمد.`,
  },
);

export const RadiologyReportAddendumRelationsInputCreate = t.Object(
  {
    report: t.Object(
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
    mentions: t.Optional(
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
    attachments: t.Optional(
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
  {
    additionalProperties: false,
    description: `ملحق تقرير — التقرير المعتمد لا يُعدَّل، فالتصحيح أو الإضافة بعده تُلحَق
كسطر مستقل مؤرَّخ وموقَّع. هذا مطلب توثيقي: الأصل يبقى كما اعتُمد.`,
  },
);

export const RadiologyReportAddendumRelationsInputUpdate = t.Partial(
  t.Object(
    {
      report: t.Object(
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
      mentions: t.Partial(
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
      attachments: t.Partial(
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
    {
      additionalProperties: false,
      description: `ملحق تقرير — التقرير المعتمد لا يُعدَّل، فالتصحيح أو الإضافة بعده تُلحَق
كسطر مستقل مؤرَّخ وموقَّع. هذا مطلب توثيقي: الأصل يبقى كما اعتُمد.`,
    },
  ),
);

export const RadiologyReportAddendumWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          reportId: t.String(),
          text: t.String(),
          authoredById: t.String(),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `ملحق تقرير — التقرير المعتمد لا يُعدَّل، فالتصحيح أو الإضافة بعده تُلحَق
كسطر مستقل مؤرَّخ وموقَّع. هذا مطلب توثيقي: الأصل يبقى كما اعتُمد.`,
        },
      ),
    { $id: "RadiologyReportAddendum" },
  ),
);

export const RadiologyReportAddendumWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `ملحق تقرير — التقرير المعتمد لا يُعدَّل، فالتصحيح أو الإضافة بعده تُلحَق
كسطر مستقل مؤرَّخ وموقَّع. هذا مطلب توثيقي: الأصل يبقى كما اعتُمد.`,
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
              reportId: t.String(),
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
  { $id: "RadiologyReportAddendum" },
);

export const RadiologyReportAddendumSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      reportId: t.Boolean(),
      text: t.Boolean(),
      authoredById: t.Boolean(),
      createdAt: t.Boolean(),
      report: t.Boolean(),
      authoredBy: t.Boolean(),
      mentions: t.Boolean(),
      attachments: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `ملحق تقرير — التقرير المعتمد لا يُعدَّل، فالتصحيح أو الإضافة بعده تُلحَق
كسطر مستقل مؤرَّخ وموقَّع. هذا مطلب توثيقي: الأصل يبقى كما اعتُمد.`,
    },
  ),
);

export const RadiologyReportAddendumInclude = t.Partial(
  t.Object(
    {
      report: t.Boolean(),
      authoredBy: t.Boolean(),
      mentions: t.Boolean(),
      attachments: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `ملحق تقرير — التقرير المعتمد لا يُعدَّل، فالتصحيح أو الإضافة بعده تُلحَق
كسطر مستقل مؤرَّخ وموقَّع. هذا مطلب توثيقي: الأصل يبقى كما اعتُمد.`,
    },
  ),
);

export const RadiologyReportAddendumOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reportId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `ملحق تقرير — التقرير المعتمد لا يُعدَّل، فالتصحيح أو الإضافة بعده تُلحَق
كسطر مستقل مؤرَّخ وموقَّع. هذا مطلب توثيقي: الأصل يبقى كما اعتُمد.`,
    },
  ),
);

export const RadiologyReportAddendum = t.Composite(
  [RadiologyReportAddendumPlain, RadiologyReportAddendumRelations],
  { additionalProperties: false },
);

export const RadiologyReportAddendumInputCreate = t.Composite(
  [
    RadiologyReportAddendumPlainInputCreate,
    RadiologyReportAddendumRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const RadiologyReportAddendumInputUpdate = t.Composite(
  [
    RadiologyReportAddendumPlainInputUpdate,
    RadiologyReportAddendumRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
