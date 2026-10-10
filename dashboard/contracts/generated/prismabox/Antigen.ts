import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AntigenPlain = t.Object(
  {
    code: t.String(),
    nameEn: t.String(),
    nameAr: t.String(),
    noteAr: __nullable__(t.String()),
    order: t.Integer(),
    immunityOnsetDays: t.Integer(),
  },
  { additionalProperties: false },
);

export const AntigenRelations = t.Object(
  {
    vaccines: t.Array(
      t.Object(
        { id: t.String(), vaccineId: t.String(), antigenCode: t.String() },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    protocolDoses: t.Array(
      t.Object(
        {
          id: t.String(),
          protocolId: t.String(),
          order: t.Integer(),
          antigenCode: t.String(),
          label: t.String(),
          kind: t.Union(
            [
              t.Literal("PRIMARY"),
              t.Literal("BOOSTER"),
              t.Literal("ANNUAL"),
              t.Literal("CATCH_UP"),
            ],
            { additionalProperties: false },
          ),
          ageWeeksMin: __nullable__(t.Integer()),
          ageWeeksMax: __nullable__(t.Integer()),
          intervalDaysFromPrev: __nullable__(t.Integer()),
          boosterIntervalDays: __nullable__(t.Integer()),
          notes: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const AntigenPlainInputCreate = t.Object(
  {
    nameEn: t.String(),
    nameAr: t.String(),
    noteAr: t.Optional(__nullable__(t.String())),
    order: t.Optional(t.Integer()),
    immunityOnsetDays: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const AntigenPlainInputUpdate = t.Object(
  {
    nameEn: t.Optional(t.String()),
    nameAr: t.Optional(t.String()),
    noteAr: t.Optional(__nullable__(t.String())),
    order: t.Optional(t.Integer()),
    immunityOnsetDays: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const AntigenRelationsInputCreate = t.Object(
  {
    vaccines: t.Optional(
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
    protocolDoses: t.Optional(
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

export const AntigenRelationsInputUpdate = t.Partial(
  t.Object(
    {
      vaccines: t.Partial(
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
      protocolDoses: t.Partial(
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

export const AntigenWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          code: t.String(),
          nameEn: t.String(),
          nameAr: t.String(),
          noteAr: t.String(),
          order: t.Integer(),
          immunityOnsetDays: t.Integer(),
        },
        { additionalProperties: false },
      ),
    { $id: "Antigen" },
  ),
);

export const AntigenWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object({ code: t.String() }, { additionalProperties: false }),
          { additionalProperties: false },
        ),
        t.Union([t.Object({ code: t.String() })], {
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
              code: t.String(),
              nameEn: t.String(),
              nameAr: t.String(),
              noteAr: t.String(),
              order: t.Integer(),
              immunityOnsetDays: t.Integer(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Antigen" },
);

export const AntigenSelect = t.Partial(
  t.Object(
    {
      code: t.Boolean(),
      nameEn: t.Boolean(),
      nameAr: t.Boolean(),
      noteAr: t.Boolean(),
      order: t.Boolean(),
      immunityOnsetDays: t.Boolean(),
      vaccines: t.Boolean(),
      protocolDoses: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AntigenInclude = t.Partial(
  t.Object(
    { vaccines: t.Boolean(), protocolDoses: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const AntigenOrderBy = t.Partial(
  t.Object(
    {
      code: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      nameEn: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      nameAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      noteAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      order: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      immunityOnsetDays: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Antigen = t.Composite([AntigenPlain, AntigenRelations], {
  additionalProperties: false,
});

export const AntigenInputCreate = t.Composite(
  [AntigenPlainInputCreate, AntigenRelationsInputCreate],
  { additionalProperties: false },
);

export const AntigenInputUpdate = t.Composite(
  [AntigenPlainInputUpdate, AntigenRelationsInputUpdate],
  { additionalProperties: false },
);
