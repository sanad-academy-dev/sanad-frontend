import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RadiologyInstancePlain = t.Object(
  {
    id: t.String(),
    seriesId: t.String(),
    sopUid: t.String(),
    instanceNumber: __nullable__(t.Integer()),
    kind: t.Union([t.Literal("DICOM"), t.Literal("IMAGE")], {
      additionalProperties: false,
    }),
    fileKey: t.String(),
    fileName: __nullable__(t.String()),
    sizeBytes: __nullable__(t.Integer()),
    mimeType: __nullable__(t.String()),
    transferSyntax: __nullable__(t.String()),
    rows: __nullable__(t.Integer()),
    columns: __nullable__(t.Integer()),
    frames: __nullable__(t.Integer()),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const RadiologyInstanceRelations = t.Object(
  {
    series: t.Object(
      {
        id: t.String(),
        studyId: t.String(),
        seriesUid: t.String(),
        seriesNumber: __nullable__(t.Integer()),
        modalityCode: __nullable__(t.String()),
        description: __nullable__(t.String()),
        bodyPart: __nullable__(t.String()),
        createdAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const RadiologyInstancePlainInputCreate = t.Object(
  {
    instanceNumber: t.Optional(__nullable__(t.Integer())),
    kind: t.Optional(
      t.Union([t.Literal("DICOM"), t.Literal("IMAGE")], {
        additionalProperties: false,
      }),
    ),
    fileKey: t.String(),
    fileName: t.Optional(__nullable__(t.String())),
    sizeBytes: t.Optional(__nullable__(t.Integer())),
    mimeType: t.Optional(__nullable__(t.String())),
    transferSyntax: t.Optional(__nullable__(t.String())),
    rows: t.Optional(__nullable__(t.Integer())),
    columns: t.Optional(__nullable__(t.Integer())),
    frames: t.Optional(__nullable__(t.Integer())),
  },
  { additionalProperties: false },
);

export const RadiologyInstancePlainInputUpdate = t.Object(
  {
    instanceNumber: t.Optional(__nullable__(t.Integer())),
    kind: t.Optional(
      t.Union([t.Literal("DICOM"), t.Literal("IMAGE")], {
        additionalProperties: false,
      }),
    ),
    fileKey: t.Optional(t.String()),
    fileName: t.Optional(__nullable__(t.String())),
    sizeBytes: t.Optional(__nullable__(t.Integer())),
    mimeType: t.Optional(__nullable__(t.String())),
    transferSyntax: t.Optional(__nullable__(t.String())),
    rows: t.Optional(__nullable__(t.Integer())),
    columns: t.Optional(__nullable__(t.Integer())),
    frames: t.Optional(__nullable__(t.Integer())),
  },
  { additionalProperties: false },
);

export const RadiologyInstanceRelationsInputCreate = t.Object(
  {
    series: t.Object(
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

export const RadiologyInstanceRelationsInputUpdate = t.Partial(
  t.Object(
    {
      series: t.Object(
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

export const RadiologyInstanceWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          seriesId: t.String(),
          sopUid: t.String(),
          instanceNumber: t.Integer(),
          kind: t.Union([t.Literal("DICOM"), t.Literal("IMAGE")], {
            additionalProperties: false,
          }),
          fileKey: t.String(),
          fileName: t.String(),
          sizeBytes: t.Integer(),
          mimeType: t.String(),
          transferSyntax: t.String(),
          rows: t.Integer(),
          columns: t.Integer(),
          frames: t.Integer(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "RadiologyInstance" },
  ),
);

export const RadiologyInstanceWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), sopUid: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ sopUid: t.String() })],
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
              seriesId: t.String(),
              sopUid: t.String(),
              instanceNumber: t.Integer(),
              kind: t.Union([t.Literal("DICOM"), t.Literal("IMAGE")], {
                additionalProperties: false,
              }),
              fileKey: t.String(),
              fileName: t.String(),
              sizeBytes: t.Integer(),
              mimeType: t.String(),
              transferSyntax: t.String(),
              rows: t.Integer(),
              columns: t.Integer(),
              frames: t.Integer(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "RadiologyInstance" },
);

export const RadiologyInstanceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      seriesId: t.Boolean(),
      sopUid: t.Boolean(),
      instanceNumber: t.Boolean(),
      kind: t.Boolean(),
      fileKey: t.Boolean(),
      fileName: t.Boolean(),
      sizeBytes: t.Boolean(),
      mimeType: t.Boolean(),
      transferSyntax: t.Boolean(),
      rows: t.Boolean(),
      columns: t.Boolean(),
      frames: t.Boolean(),
      createdAt: t.Boolean(),
      series: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RadiologyInstanceInclude = t.Partial(
  t.Object(
    { kind: t.Boolean(), series: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const RadiologyInstanceOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      seriesId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sopUid: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      instanceNumber: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fileKey: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fileName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sizeBytes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      mimeType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      transferSyntax: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rows: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      columns: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      frames: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const RadiologyInstance = t.Composite(
  [RadiologyInstancePlain, RadiologyInstanceRelations],
  { additionalProperties: false },
);

export const RadiologyInstanceInputCreate = t.Composite(
  [RadiologyInstancePlainInputCreate, RadiologyInstanceRelationsInputCreate],
  { additionalProperties: false },
);

export const RadiologyInstanceInputUpdate = t.Composite(
  [RadiologyInstancePlainInputUpdate, RadiologyInstanceRelationsInputUpdate],
  { additionalProperties: false },
);
