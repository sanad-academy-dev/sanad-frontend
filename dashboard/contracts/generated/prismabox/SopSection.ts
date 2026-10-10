import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SopSectionPlain = t.Object(
  {
    id: t.String(),
    templateId: t.String(),
    order: t.Integer(),
    titleAr: t.String(),
    titleEn: __nullable__(t.String()),
  },
  { additionalProperties: false },
);

export const SopSectionRelations = t.Object(
  {
    template: t.Object(
      {
        id: t.String(),
        clinicId: __nullable__(t.String()),
        domain: t.Union(
          [t.Literal("LAB"), t.Literal("RADIOLOGY"), t.Literal("OPERATION")],
          { additionalProperties: false },
        ),
        serviceId: t.String(),
        titleAr: t.String(),
        titleEn: __nullable__(t.String()),
        reference: __nullable__(t.String()),
        version: t.Integer(),
        active: t.Boolean(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    steps: t.Array(
      t.Object(
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
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const SopSectionPlainInputCreate = t.Object(
  {
    order: t.Integer(),
    titleAr: t.String(),
    titleEn: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const SopSectionPlainInputUpdate = t.Object(
  {
    order: t.Optional(t.Integer()),
    titleAr: t.Optional(t.String()),
    titleEn: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const SopSectionRelationsInputCreate = t.Object(
  {
    template: t.Object(
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
    steps: t.Optional(
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

export const SopSectionRelationsInputUpdate = t.Partial(
  t.Object(
    {
      template: t.Object(
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
      steps: t.Partial(
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

export const SopSectionWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          templateId: t.String(),
          order: t.Integer(),
          titleAr: t.String(),
          titleEn: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "SopSection" },
  ),
);

export const SopSectionWhereUnique = t.Recursive(
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
              templateId: t.String(),
              order: t.Integer(),
              titleAr: t.String(),
              titleEn: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "SopSection" },
);

export const SopSectionSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      templateId: t.Boolean(),
      order: t.Boolean(),
      titleAr: t.Boolean(),
      titleEn: t.Boolean(),
      template: t.Boolean(),
      steps: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const SopSectionInclude = t.Partial(
  t.Object(
    { template: t.Boolean(), steps: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const SopSectionOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      templateId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      order: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      titleAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      titleEn: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const SopSection = t.Composite([SopSectionPlain, SopSectionRelations], {
  additionalProperties: false,
});

export const SopSectionInputCreate = t.Composite(
  [SopSectionPlainInputCreate, SopSectionRelationsInputCreate],
  { additionalProperties: false },
);

export const SopSectionInputUpdate = t.Composite(
  [SopSectionPlainInputUpdate, SopSectionRelationsInputUpdate],
  { additionalProperties: false },
);
