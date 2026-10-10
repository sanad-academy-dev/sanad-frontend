import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SopStepPlain = t.Object(
  {
    id: t.String(),
    sectionId: t.String(),
    order: t.Integer(),
    textAr: t.String(),
    textEn: __nullable__(t.String()),
    ownerRole: __nullable__(t.String()),
    duration: __nullable__(t.String()),
    critical: t.Boolean(),
    required: t.Boolean(),
    note: __nullable__(t.String()),
    responseType: t.Union(
      [
        t.Literal("CONFIRM"),
        t.Literal("YES_NO_NA"),
        t.Literal("TEXT"),
        t.Literal("NUMBER"),
      ],
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const SopStepRelations = t.Object(
  {
    section: t.Object(
      {
        id: t.String(),
        templateId: t.String(),
        order: t.Integer(),
        titleAr: t.String(),
        titleEn: __nullable__(t.String()),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const SopStepPlainInputCreate = t.Object(
  {
    order: t.Integer(),
    textAr: t.String(),
    textEn: t.Optional(__nullable__(t.String())),
    ownerRole: t.Optional(__nullable__(t.String())),
    duration: t.Optional(__nullable__(t.String())),
    critical: t.Optional(t.Boolean()),
    required: t.Optional(t.Boolean()),
    note: t.Optional(__nullable__(t.String())),
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
  },
  { additionalProperties: false },
);

export const SopStepPlainInputUpdate = t.Object(
  {
    order: t.Optional(t.Integer()),
    textAr: t.Optional(t.String()),
    textEn: t.Optional(__nullable__(t.String())),
    ownerRole: t.Optional(__nullable__(t.String())),
    duration: t.Optional(__nullable__(t.String())),
    critical: t.Optional(t.Boolean()),
    required: t.Optional(t.Boolean()),
    note: t.Optional(__nullable__(t.String())),
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
  },
  { additionalProperties: false },
);

export const SopStepRelationsInputCreate = t.Object(
  {
    section: t.Object(
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

export const SopStepRelationsInputUpdate = t.Partial(
  t.Object(
    {
      section: t.Object(
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

export const SopStepWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          sectionId: t.String(),
          order: t.Integer(),
          textAr: t.String(),
          textEn: t.String(),
          ownerRole: t.String(),
          duration: t.String(),
          critical: t.Boolean(),
          required: t.Boolean(),
          note: t.String(),
          responseType: t.Union(
            [
              t.Literal("CONFIRM"),
              t.Literal("YES_NO_NA"),
              t.Literal("TEXT"),
              t.Literal("NUMBER"),
            ],
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    { $id: "SopStep" },
  ),
);

export const SopStepWhereUnique = t.Recursive(
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
              sectionId: t.String(),
              order: t.Integer(),
              textAr: t.String(),
              textEn: t.String(),
              ownerRole: t.String(),
              duration: t.String(),
              critical: t.Boolean(),
              required: t.Boolean(),
              note: t.String(),
              responseType: t.Union(
                [
                  t.Literal("CONFIRM"),
                  t.Literal("YES_NO_NA"),
                  t.Literal("TEXT"),
                  t.Literal("NUMBER"),
                ],
                { additionalProperties: false },
              ),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "SopStep" },
);

export const SopStepSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      sectionId: t.Boolean(),
      order: t.Boolean(),
      textAr: t.Boolean(),
      textEn: t.Boolean(),
      ownerRole: t.Boolean(),
      duration: t.Boolean(),
      critical: t.Boolean(),
      required: t.Boolean(),
      note: t.Boolean(),
      responseType: t.Boolean(),
      section: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const SopStepInclude = t.Partial(
  t.Object(
    { responseType: t.Boolean(), section: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const SopStepOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sectionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      order: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      textAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      textEn: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      note: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const SopStep = t.Composite([SopStepPlain, SopStepRelations], {
  additionalProperties: false,
});

export const SopStepInputCreate = t.Composite(
  [SopStepPlainInputCreate, SopStepRelationsInputCreate],
  { additionalProperties: false },
);

export const SopStepInputUpdate = t.Composite(
  [SopStepPlainInputUpdate, SopStepRelationsInputUpdate],
  { additionalProperties: false },
);
