import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const LabSampleCollectionPlain = t.Object(
  {
    id: t.String(),
    itemId: t.String(),
    tubeType: __nullable__(
      t.Union(
        [
          t.Literal("EDTA"),
          t.Literal("SST"),
          t.Literal("CITRATE"),
          t.Literal("HEPARIN"),
          t.Literal("URINE"),
          t.Literal("SWAB"),
        ],
        { additionalProperties: false },
      ),
    ),
    collectedById: __nullable__(t.String()),
    drawSite: __nullable__(t.String()),
    volumeMl: __nullable__(t.Number()),
    attempts: __nullable__(t.Integer()),
    collectedAt: __nullable__(t.Date()),
    quality: __nullable__(
      t.Union(
        [
          t.Literal("EXCELLENT"),
          t.Literal("GOOD"),
          t.Literal("ACCEPTABLE"),
          t.Literal("REJECTED"),
        ],
        { additionalProperties: false },
      ),
    ),
    collectionNotes: __nullable__(t.String()),
    analyzerId: __nullable__(t.String()),
    analyzerName: __nullable__(t.String()),
    handedOverAt: __nullable__(t.Date()),
    labelsPrinted: __nullable__(t.Integer()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const LabSampleCollectionRelations = t.Object(
  {
    item: t.Object(
      {
        id: t.String(),
        orderId: t.String(),
        serviceId: t.String(),
        priceSnapshot: t.Number(),
        status: t.Union(
          [
            t.Literal("QUEUE"),
            t.Literal("SCHEDULED"),
            t.Literal("SAMPLE_COLLECTION"),
            t.Literal("IN_LAB"),
            t.Literal("UNDER_REVIEW"),
            t.Literal("COMPLETED"),
            t.Literal("CANCELLED"),
          ],
          { additionalProperties: false },
        ),
        sampleStage: t.Union(
          [
            t.Literal("NOT_COLLECTED"),
            t.Literal("COLLECTED"),
            t.Literal("QUALITY_CHECK"),
            t.Literal("LABEL_PRINT"),
            t.Literal("ANALYZER_ASSIGNMENT"),
            t.Literal("HANDOVER_SUMMARY"),
            t.Literal("ANALYZING"),
            t.Literal("RESULTS_READY"),
          ],
          { additionalProperties: false },
        ),
        assignedToId: __nullable__(t.String()),
        scheduledAt: __nullable__(t.Date()),
        report: __nullable__(t.String()),
        reviewedById: __nullable__(t.String()),
        reviewedAt: __nullable__(t.Date()),
        rejectedById: __nullable__(t.String()),
        rejectedAt: __nullable__(t.Date()),
        rejectionReason: __nullable__(t.String()),
        completedAt: __nullable__(t.Date()),
        paidAt: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    collectedBy: __nullable__(
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
  { additionalProperties: false },
);

export const LabSampleCollectionPlainInputCreate = t.Object(
  {
    tubeType: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("EDTA"),
            t.Literal("SST"),
            t.Literal("CITRATE"),
            t.Literal("HEPARIN"),
            t.Literal("URINE"),
            t.Literal("SWAB"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    drawSite: t.Optional(__nullable__(t.String())),
    volumeMl: t.Optional(__nullable__(t.Number())),
    attempts: t.Optional(__nullable__(t.Integer())),
    collectedAt: t.Optional(__nullable__(t.Date())),
    quality: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("EXCELLENT"),
            t.Literal("GOOD"),
            t.Literal("ACCEPTABLE"),
            t.Literal("REJECTED"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    collectionNotes: t.Optional(__nullable__(t.String())),
    analyzerName: t.Optional(__nullable__(t.String())),
    handedOverAt: t.Optional(__nullable__(t.Date())),
    labelsPrinted: t.Optional(__nullable__(t.Integer())),
  },
  { additionalProperties: false },
);

export const LabSampleCollectionPlainInputUpdate = t.Object(
  {
    tubeType: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("EDTA"),
            t.Literal("SST"),
            t.Literal("CITRATE"),
            t.Literal("HEPARIN"),
            t.Literal("URINE"),
            t.Literal("SWAB"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    drawSite: t.Optional(__nullable__(t.String())),
    volumeMl: t.Optional(__nullable__(t.Number())),
    attempts: t.Optional(__nullable__(t.Integer())),
    collectedAt: t.Optional(__nullable__(t.Date())),
    quality: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("EXCELLENT"),
            t.Literal("GOOD"),
            t.Literal("ACCEPTABLE"),
            t.Literal("REJECTED"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    collectionNotes: t.Optional(__nullable__(t.String())),
    analyzerName: t.Optional(__nullable__(t.String())),
    handedOverAt: t.Optional(__nullable__(t.Date())),
    labelsPrinted: t.Optional(__nullable__(t.Integer())),
  },
  { additionalProperties: false },
);

export const LabSampleCollectionRelationsInputCreate = t.Object(
  {
    item: t.Object(
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
    collectedBy: t.Optional(
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
  { additionalProperties: false },
);

export const LabSampleCollectionRelationsInputUpdate = t.Partial(
  t.Object(
    {
      item: t.Object(
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
      collectedBy: t.Partial(
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
    { additionalProperties: false },
  ),
);

export const LabSampleCollectionWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          itemId: t.String(),
          tubeType: t.Union(
            [
              t.Literal("EDTA"),
              t.Literal("SST"),
              t.Literal("CITRATE"),
              t.Literal("HEPARIN"),
              t.Literal("URINE"),
              t.Literal("SWAB"),
            ],
            { additionalProperties: false },
          ),
          collectedById: t.String(),
          drawSite: t.String(),
          volumeMl: t.Number(),
          attempts: t.Integer(),
          collectedAt: t.Date(),
          quality: t.Union(
            [
              t.Literal("EXCELLENT"),
              t.Literal("GOOD"),
              t.Literal("ACCEPTABLE"),
              t.Literal("REJECTED"),
            ],
            { additionalProperties: false },
          ),
          collectionNotes: t.String(),
          analyzerId: t.String(),
          analyzerName: t.String(),
          handedOverAt: t.Date(),
          labelsPrinted: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "LabSampleCollection" },
  ),
);

export const LabSampleCollectionWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), itemId: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ itemId: t.String() })],
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
              itemId: t.String(),
              tubeType: t.Union(
                [
                  t.Literal("EDTA"),
                  t.Literal("SST"),
                  t.Literal("CITRATE"),
                  t.Literal("HEPARIN"),
                  t.Literal("URINE"),
                  t.Literal("SWAB"),
                ],
                { additionalProperties: false },
              ),
              collectedById: t.String(),
              drawSite: t.String(),
              volumeMl: t.Number(),
              attempts: t.Integer(),
              collectedAt: t.Date(),
              quality: t.Union(
                [
                  t.Literal("EXCELLENT"),
                  t.Literal("GOOD"),
                  t.Literal("ACCEPTABLE"),
                  t.Literal("REJECTED"),
                ],
                { additionalProperties: false },
              ),
              collectionNotes: t.String(),
              analyzerId: t.String(),
              analyzerName: t.String(),
              handedOverAt: t.Date(),
              labelsPrinted: t.Integer(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "LabSampleCollection" },
);

export const LabSampleCollectionSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      itemId: t.Boolean(),
      tubeType: t.Boolean(),
      collectedById: t.Boolean(),
      drawSite: t.Boolean(),
      volumeMl: t.Boolean(),
      attempts: t.Boolean(),
      collectedAt: t.Boolean(),
      quality: t.Boolean(),
      collectionNotes: t.Boolean(),
      analyzerId: t.Boolean(),
      analyzerName: t.Boolean(),
      handedOverAt: t.Boolean(),
      labelsPrinted: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      item: t.Boolean(),
      collectedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const LabSampleCollectionInclude = t.Partial(
  t.Object(
    {
      tubeType: t.Boolean(),
      quality: t.Boolean(),
      item: t.Boolean(),
      collectedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const LabSampleCollectionOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      itemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      collectedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      drawSite: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      volumeMl: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      attempts: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      collectedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      collectionNotes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      analyzerId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      analyzerName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      handedOverAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      labelsPrinted: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const LabSampleCollection = t.Composite(
  [LabSampleCollectionPlain, LabSampleCollectionRelations],
  { additionalProperties: false },
);

export const LabSampleCollectionInputCreate = t.Composite(
  [
    LabSampleCollectionPlainInputCreate,
    LabSampleCollectionRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const LabSampleCollectionInputUpdate = t.Composite(
  [
    LabSampleCollectionPlainInputUpdate,
    LabSampleCollectionRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
