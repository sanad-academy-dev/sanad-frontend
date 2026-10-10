import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const LabTestResultPlain = t.Object(
  {
    id: t.String(),
    itemId: t.String(),
    parameterId: __nullable__(t.String()),
    section: __nullable__(t.String()),
    name: t.String(),
    unit: __nullable__(t.String()),
    refLow: __nullable__(t.Number()),
    refHigh: __nullable__(t.Number()),
    value: __nullable__(t.String()),
    numericValue: __nullable__(t.Number()),
    flag: t.Union([t.Literal("NORMAL"), t.Literal("LOW"), t.Literal("HIGH")], {
      additionalProperties: false,
    }),
    notes: __nullable__(t.String()),
    order: t.Integer(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const LabTestResultRelations = t.Object(
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
    parameter: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          serviceId: t.String(),
          section: __nullable__(t.String()),
          name: t.String(),
          unit: __nullable__(t.String()),
          type: t.Union([t.Literal("NUMERIC"), t.Literal("TEXT")], {
            additionalProperties: false,
          }),
          refLow: __nullable__(t.Number()),
          refHigh: __nullable__(t.Number()),
          order: t.Integer(),
          active: t.Boolean(),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const LabTestResultPlainInputCreate = t.Object(
  {
    section: t.Optional(__nullable__(t.String())),
    name: t.String(),
    unit: t.Optional(__nullable__(t.String())),
    refLow: t.Optional(__nullable__(t.Number())),
    refHigh: t.Optional(__nullable__(t.Number())),
    value: t.Optional(__nullable__(t.String())),
    numericValue: t.Optional(__nullable__(t.Number())),
    flag: t.Optional(
      t.Union([t.Literal("NORMAL"), t.Literal("LOW"), t.Literal("HIGH")], {
        additionalProperties: false,
      }),
    ),
    notes: t.Optional(__nullable__(t.String())),
    order: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const LabTestResultPlainInputUpdate = t.Object(
  {
    section: t.Optional(__nullable__(t.String())),
    name: t.Optional(t.String()),
    unit: t.Optional(__nullable__(t.String())),
    refLow: t.Optional(__nullable__(t.Number())),
    refHigh: t.Optional(__nullable__(t.Number())),
    value: t.Optional(__nullable__(t.String())),
    numericValue: t.Optional(__nullable__(t.Number())),
    flag: t.Optional(
      t.Union([t.Literal("NORMAL"), t.Literal("LOW"), t.Literal("HIGH")], {
        additionalProperties: false,
      }),
    ),
    notes: t.Optional(__nullable__(t.String())),
    order: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const LabTestResultRelationsInputCreate = t.Object(
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
    parameter: t.Optional(
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

export const LabTestResultRelationsInputUpdate = t.Partial(
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
      parameter: t.Partial(
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

export const LabTestResultWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          itemId: t.String(),
          parameterId: t.String(),
          section: t.String(),
          name: t.String(),
          unit: t.String(),
          refLow: t.Number(),
          refHigh: t.Number(),
          value: t.String(),
          numericValue: t.Number(),
          flag: t.Union(
            [t.Literal("NORMAL"), t.Literal("LOW"), t.Literal("HIGH")],
            { additionalProperties: false },
          ),
          notes: t.String(),
          order: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "LabTestResult" },
  ),
);

export const LabTestResultWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object({ id: t.String() }, { additionalProperties: false }),
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
              itemId: t.String(),
              parameterId: t.String(),
              section: t.String(),
              name: t.String(),
              unit: t.String(),
              refLow: t.Number(),
              refHigh: t.Number(),
              value: t.String(),
              numericValue: t.Number(),
              flag: t.Union(
                [t.Literal("NORMAL"), t.Literal("LOW"), t.Literal("HIGH")],
                { additionalProperties: false },
              ),
              notes: t.String(),
              order: t.Integer(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "LabTestResult" },
);

export const LabTestResultSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      itemId: t.Boolean(),
      parameterId: t.Boolean(),
      section: t.Boolean(),
      name: t.Boolean(),
      unit: t.Boolean(),
      refLow: t.Boolean(),
      refHigh: t.Boolean(),
      value: t.Boolean(),
      numericValue: t.Boolean(),
      flag: t.Boolean(),
      notes: t.Boolean(),
      order: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      item: t.Boolean(),
      parameter: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const LabTestResultInclude = t.Partial(
  t.Object(
    {
      flag: t.Boolean(),
      item: t.Boolean(),
      parameter: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const LabTestResultOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      itemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      parameterId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      section: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      unit: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      refLow: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      refHigh: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      value: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      numericValue: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      order: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const LabTestResult = t.Composite(
  [LabTestResultPlain, LabTestResultRelations],
  { additionalProperties: false },
);

export const LabTestResultInputCreate = t.Composite(
  [LabTestResultPlainInputCreate, LabTestResultRelationsInputCreate],
  { additionalProperties: false },
);

export const LabTestResultInputUpdate = t.Composite(
  [LabTestResultPlainInputUpdate, LabTestResultRelationsInputUpdate],
  { additionalProperties: false },
);
