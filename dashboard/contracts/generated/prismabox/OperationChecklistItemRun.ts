import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OperationChecklistItemRunPlain = t.Object(
  {
    id: t.String(),
    runId: t.String(),
    order: t.Integer(),
    textSnapshot: t.String(),
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

export const OperationChecklistItemRunRelations = t.Object(
  {
    run: t.Object(
      {
        id: t.String(),
        caseId: t.String(),
        scope: t.Union(
          [
            t.Literal("OPERATION_SIGN_IN"),
            t.Literal("OPERATION_TIME_OUT"),
            t.Literal("OPERATION_SIGN_OUT"),
            t.Literal("OPERATION_MINOR_COMBINED"),
          ],
          { additionalProperties: false },
        ),
        templateId: t.String(),
        templateVersion: t.Integer(),
        startedById: __nullable__(t.String()),
        completedAt: __nullable__(t.Date()),
        completedById: __nullable__(t.String()),
        createdAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const OperationChecklistItemRunPlainInputCreate = t.Object(
  {
    order: t.Integer(),
    textSnapshot: t.String(),
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

export const OperationChecklistItemRunPlainInputUpdate = t.Object(
  {
    order: t.Optional(t.Integer()),
    textSnapshot: t.Optional(t.String()),
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

export const OperationChecklistItemRunRelationsInputCreate = t.Object(
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
  },
  { additionalProperties: false },
);

export const OperationChecklistItemRunRelationsInputUpdate = t.Partial(
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
    },
    { additionalProperties: false },
  ),
);

export const OperationChecklistItemRunWhere = t.Partial(
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
          textSnapshot: t.String(),
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
    { $id: "OperationChecklistItemRun" },
  ),
);

export const OperationChecklistItemRunWhereUnique = t.Recursive(
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
              textSnapshot: t.String(),
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
  { $id: "OperationChecklistItemRun" },
);

export const OperationChecklistItemRunSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      runId: t.Boolean(),
      order: t.Boolean(),
      textSnapshot: t.Boolean(),
      required: t.Boolean(),
      responseType: t.Boolean(),
      response: t.Boolean(),
      valueText: t.Boolean(),
      valueNumber: t.Boolean(),
      respondedById: t.Boolean(),
      respondedAt: t.Boolean(),
      run: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OperationChecklistItemRunInclude = t.Partial(
  t.Object(
    {
      responseType: t.Boolean(),
      response: t.Boolean(),
      run: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OperationChecklistItemRunOrderBy = t.Partial(
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
      textSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const OperationChecklistItemRun = t.Composite(
  [OperationChecklistItemRunPlain, OperationChecklistItemRunRelations],
  { additionalProperties: false },
);

export const OperationChecklistItemRunInputCreate = t.Composite(
  [
    OperationChecklistItemRunPlainInputCreate,
    OperationChecklistItemRunRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const OperationChecklistItemRunInputUpdate = t.Composite(
  [
    OperationChecklistItemRunPlainInputUpdate,
    OperationChecklistItemRunRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
