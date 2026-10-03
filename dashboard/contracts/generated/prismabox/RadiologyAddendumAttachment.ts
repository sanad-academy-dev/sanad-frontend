import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RadiologyAddendumAttachmentPlain = t.Object(
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
);

export const RadiologyAddendumAttachmentRelations = t.Object(
  {
    addendum: t.Object(
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
    ),
  },
  {
    additionalProperties: false,
    description: `ملف مرفق بملحق التقرير (تقرير خارجي، صورة، استشارة)`,
  },
);

export const RadiologyAddendumAttachmentPlainInputCreate = t.Object(
  {
    fileKey: t.String(),
    fileName: t.String(),
    mimeType: t.Optional(__nullable__(t.String())),
    sizeBytes: t.Optional(__nullable__(t.Integer())),
  },
  {
    additionalProperties: false,
    description: `ملف مرفق بملحق التقرير (تقرير خارجي، صورة، استشارة)`,
  },
);

export const RadiologyAddendumAttachmentPlainInputUpdate = t.Object(
  {
    fileKey: t.Optional(t.String()),
    fileName: t.Optional(t.String()),
    mimeType: t.Optional(__nullable__(t.String())),
    sizeBytes: t.Optional(__nullable__(t.Integer())),
  },
  {
    additionalProperties: false,
    description: `ملف مرفق بملحق التقرير (تقرير خارجي، صورة، استشارة)`,
  },
);

export const RadiologyAddendumAttachmentRelationsInputCreate = t.Object(
  {
    addendum: t.Object(
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
    description: `ملف مرفق بملحق التقرير (تقرير خارجي، صورة، استشارة)`,
  },
);

export const RadiologyAddendumAttachmentRelationsInputUpdate = t.Partial(
  t.Object(
    {
      addendum: t.Object(
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
      description: `ملف مرفق بملحق التقرير (تقرير خارجي، صورة، استشارة)`,
    },
  ),
);

export const RadiologyAddendumAttachmentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          addendumId: t.String(),
          fileKey: t.String(),
          fileName: t.String(),
          mimeType: t.String(),
          sizeBytes: t.Integer(),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `ملف مرفق بملحق التقرير (تقرير خارجي، صورة، استشارة)`,
        },
      ),
    { $id: "RadiologyAddendumAttachment" },
  ),
);

export const RadiologyAddendumAttachmentWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `ملف مرفق بملحق التقرير (تقرير خارجي، صورة، استشارة)`,
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
              addendumId: t.String(),
              fileKey: t.String(),
              fileName: t.String(),
              mimeType: t.String(),
              sizeBytes: t.Integer(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "RadiologyAddendumAttachment" },
);

export const RadiologyAddendumAttachmentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      addendumId: t.Boolean(),
      fileKey: t.Boolean(),
      fileName: t.Boolean(),
      mimeType: t.Boolean(),
      sizeBytes: t.Boolean(),
      createdAt: t.Boolean(),
      addendum: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `ملف مرفق بملحق التقرير (تقرير خارجي، صورة، استشارة)`,
    },
  ),
);

export const RadiologyAddendumAttachmentInclude = t.Partial(
  t.Object(
    { addendum: t.Boolean(), _count: t.Boolean() },
    {
      additionalProperties: false,
      description: `ملف مرفق بملحق التقرير (تقرير خارجي، صورة، استشارة)`,
    },
  ),
);

export const RadiologyAddendumAttachmentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      addendumId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fileKey: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fileName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      mimeType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sizeBytes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `ملف مرفق بملحق التقرير (تقرير خارجي، صورة، استشارة)`,
    },
  ),
);

export const RadiologyAddendumAttachment = t.Composite(
  [RadiologyAddendumAttachmentPlain, RadiologyAddendumAttachmentRelations],
  { additionalProperties: false },
);

export const RadiologyAddendumAttachmentInputCreate = t.Composite(
  [
    RadiologyAddendumAttachmentPlainInputCreate,
    RadiologyAddendumAttachmentRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const RadiologyAddendumAttachmentInputUpdate = t.Composite(
  [
    RadiologyAddendumAttachmentPlainInputUpdate,
    RadiologyAddendumAttachmentRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
