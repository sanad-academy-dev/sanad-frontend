import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RadiologySeriesPlain = t.Object(
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
);

export const RadiologySeriesRelations = t.Object(
  {
    study: t.Object(
      {
        id: t.String(),
        itemId: t.String(),
        studyUid: t.String(),
        description: __nullable__(t.String()),
        studyDate: __nullable__(t.Date()),
        modality: __nullable__(
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
        uploadedById: __nullable__(t.String()),
        createdAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    instances: t.Array(
      t.Object(
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
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const RadiologySeriesPlainInputCreate = t.Object(
  {
    seriesNumber: t.Optional(__nullable__(t.Integer())),
    modalityCode: t.Optional(__nullable__(t.String())),
    description: t.Optional(__nullable__(t.String())),
    bodyPart: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const RadiologySeriesPlainInputUpdate = t.Object(
  {
    seriesNumber: t.Optional(__nullable__(t.Integer())),
    modalityCode: t.Optional(__nullable__(t.String())),
    description: t.Optional(__nullable__(t.String())),
    bodyPart: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const RadiologySeriesRelationsInputCreate = t.Object(
  {
    study: t.Object(
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
    instances: t.Optional(
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

export const RadiologySeriesRelationsInputUpdate = t.Partial(
  t.Object(
    {
      study: t.Object(
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
      instances: t.Partial(
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

export const RadiologySeriesWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          studyId: t.String(),
          seriesUid: t.String(),
          seriesNumber: t.Integer(),
          modalityCode: t.String(),
          description: t.String(),
          bodyPart: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "RadiologySeries" },
  ),
);

export const RadiologySeriesWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), seriesUid: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ seriesUid: t.String() })],
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
              studyId: t.String(),
              seriesUid: t.String(),
              seriesNumber: t.Integer(),
              modalityCode: t.String(),
              description: t.String(),
              bodyPart: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "RadiologySeries" },
);

export const RadiologySeriesSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      studyId: t.Boolean(),
      seriesUid: t.Boolean(),
      seriesNumber: t.Boolean(),
      modalityCode: t.Boolean(),
      description: t.Boolean(),
      bodyPart: t.Boolean(),
      createdAt: t.Boolean(),
      study: t.Boolean(),
      instances: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RadiologySeriesInclude = t.Partial(
  t.Object(
    { study: t.Boolean(), instances: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const RadiologySeriesOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      studyId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      seriesUid: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      seriesNumber: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      modalityCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      bodyPart: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const RadiologySeries = t.Composite(
  [RadiologySeriesPlain, RadiologySeriesRelations],
  { additionalProperties: false },
);

export const RadiologySeriesInputCreate = t.Composite(
  [RadiologySeriesPlainInputCreate, RadiologySeriesRelationsInputCreate],
  { additionalProperties: false },
);

export const RadiologySeriesInputUpdate = t.Composite(
  [RadiologySeriesPlainInputUpdate, RadiologySeriesRelationsInputUpdate],
  { additionalProperties: false },
);
