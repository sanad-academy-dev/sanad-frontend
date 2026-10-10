import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SopRunStepPlain = t.Object(
  {
    id: t.String(),
    runId: t.String(),
    order: t.Integer(),
    sectionTitle: t.String(),
    textSnapshot: t.String(),
    ownerRole: __nullable__(t.String()),
    duration: __nullable__(t.String()),
    critical: t.Boolean(),
    required: t.Boolean(),
    responseType: t.Union(
      [
        t.Literal("CONFIRM"),
        t.Literal("YES_NO_NA"),
        t.Literal("TEXT"),
        t.Literal("NUMBER"),
      ],
      { additionalProperties: false },
    ),
    response: __nullable__(
      t.Union(
        [
          t.Literal("CONFIRMED"),
          t.Literal("YES"),
          t.Literal("NO"),
          t.Literal("NA"),
        ],
        { additionalProperties: false },
      ),
    ),
    valueText: __nullable__(t.String()),
    valueNumber: __nullable__(t.Number()),
    respondedById: __nullable__(t.String()),
    respondedAt: __nullable__(t.Date()),
  },
  { additionalProperties: false },
);

export const SopRunStepRelations = t.Object(
  {
    run: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        templateId: t.String(),
        templateVersion: t.Integer(),
        domain: t.Union(
          [t.Literal("LAB"), t.Literal("RADIOLOGY"), t.Literal("OPERATION")],
          { additionalProperties: false },
        ),
        labItemId: __nullable__(t.String()),
        radiologyItemId: __nullable__(t.String()),
        operationCaseId: __nullable__(t.String()),
        startedById: __nullable__(t.String()),
        completedAt: __nullable__(t.Date()),
        completedById: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    respondedBy: __nullable__(
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

export const SopRunStepPlainInputCreate = t.Object(
  {
    order: t.Integer(),
    sectionTitle: t.String(),
    textSnapshot: t.String(),
    ownerRole: t.Optional(__nullable__(t.String())),
    duration: t.Optional(__nullable__(t.String())),
    critical: t.Optional(t.Boolean()),
    required: t.Optional(t.Boolean()),
    responseType: t.Optional(
      t.Union(
        [
          t.Literal("CONFIRM"),
          t.Literal("YES_NO_NA"),
          t.Literal("TEXT"),
          t.Literal("NUMBER"),
        ],
        { additionalProperties: false },
      ),
    ),
    response: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("CONFIRMED"),
            t.Literal("YES"),
            t.Literal("NO"),
            t.Literal("NA"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    valueText: t.Optional(__nullable__(t.String())),
    valueNumber: t.Optional(__nullable__(t.Number())),
    respondedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const SopRunStepPlainInputUpdate = t.Object(
  {
    order: t.Optional(t.Integer()),
    sectionTitle: t.Optional(t.String()),
    textSnapshot: t.Optional(t.String()),
    ownerRole: t.Optional(__nullable__(t.String())),
    duration: t.Optional(__nullable__(t.String())),
    critical: t.Optional(t.Boolean()),
    required: t.Optional(t.Boolean()),
    responseType: t.Optional(
      t.Union(
        [
          t.Literal("CONFIRM"),
          t.Literal("YES_NO_NA"),
          t.Literal("TEXT"),
          t.Literal("NUMBER"),
        ],
        { additionalProperties: false },
      ),
    ),
    response: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("CONFIRMED"),
            t.Literal("YES"),
            t.Literal("NO"),
            t.Literal("NA"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    valueText: t.Optional(__nullable__(t.String())),
    valueNumber: t.Optional(__nullable__(t.Number())),
    respondedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const SopRunStepRelationsInputCreate = t.Object(
  {
    run: t.Object(
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
    respondedBy: t.Optional(
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

export const SopRunStepRelationsInputUpdate = t.Partial(
  t.Object(
    {
      run: t.Object(
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
      respondedBy: t.Partial(
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

export const SopRunStepWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          runId: t.String(),
          order: t.Integer(),
          sectionTitle: t.String(),
          textSnapshot: t.String(),
          ownerRole: t.String(),
          duration: t.String(),
          critical: t.Boolean(),
          required: t.Boolean(),
          responseType: t.Union(
            [
              t.Literal("CONFIRM"),
              t.Literal("YES_NO_NA"),
              t.Literal("TEXT"),
              t.Literal("NUMBER"),
            ],
            { additionalProperties: false },
          ),
          response: t.Union(
            [
              t.Literal("CONFIRMED"),
              t.Literal("YES"),
              t.Literal("NO"),
              t.Literal("NA"),
            ],
            { additionalProperties: false },
          ),
          valueText: t.String(),
          valueNumber: t.Number(),
          respondedById: t.String(),
          respondedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "SopRunStep" },
  ),
);

export const SopRunStepWhereUnique = t.Recursive(
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
              runId: t.String(),
              order: t.Integer(),
              sectionTitle: t.String(),
              textSnapshot: t.String(),
              ownerRole: t.String(),
              duration: t.String(),
              critical: t.Boolean(),
              required: t.Boolean(),
              responseType: t.Union(
                [
                  t.Literal("CONFIRM"),
                  t.Literal("YES_NO_NA"),
                  t.Literal("TEXT"),
                  t.Literal("NUMBER"),
                ],
                { additionalProperties: false },
              ),
              response: t.Union(
                [
                  t.Literal("CONFIRMED"),
                  t.Literal("YES"),
                  t.Literal("NO"),
                  t.Literal("NA"),
                ],
                { additionalProperties: false },
              ),
              valueText: t.String(),
              valueNumber: t.Number(),
              respondedById: t.String(),
              respondedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "SopRunStep" },
);

export const SopRunStepSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      runId: t.Boolean(),
      order: t.Boolean(),
      sectionTitle: t.Boolean(),
      textSnapshot: t.Boolean(),
      ownerRole: t.Boolean(),
      duration: t.Boolean(),
      critical: t.Boolean(),
      required: t.Boolean(),
      responseType: t.Boolean(),
      response: t.Boolean(),
      valueText: t.Boolean(),
      valueNumber: t.Boolean(),
      respondedById: t.Boolean(),
      respondedAt: t.Boolean(),
      run: t.Boolean(),
      respondedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const SopRunStepInclude = t.Partial(
  t.Object(
    {
      responseType: t.Boolean(),
      response: t.Boolean(),
      run: t.Boolean(),
      respondedBy: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const SopRunStepOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      runId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      order: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sectionTitle: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      textSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ownerRole: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      duration: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      critical: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      required: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      valueText: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      valueNumber: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      respondedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      respondedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const SopRunStep = t.Composite([SopRunStepPlain, SopRunStepRelations], {
  additionalProperties: false,
});

export const SopRunStepInputCreate = t.Composite(
  [SopRunStepPlainInputCreate, SopRunStepRelationsInputCreate],
  { additionalProperties: false },
);

export const SopRunStepInputUpdate = t.Composite(
  [SopRunStepPlainInputUpdate, SopRunStepRelationsInputUpdate],
  { additionalProperties: false },
);
