import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ChecklistTemplateItemPlain = t.Object(
  {
    id: t.String(),
    templateId: t.String(),
    order: t.Integer(),
    textAr: t.String(),
    textEn: __nullable__(t.String()),
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
  },
  { additionalProperties: false },
);

export const ChecklistTemplateItemRelations = t.Object(
  {
    template: t.Object(
      {
        id: t.String(),
        clinicId: __nullable__(t.String()),
        scope: t.Union(
          [
            t.Literal("OPERATION_SIGN_IN"),
            t.Literal("OPERATION_TIME_OUT"),
            t.Literal("OPERATION_SIGN_OUT"),
            t.Literal("OPERATION_MINOR_COMBINED"),
          ],
          { additionalProperties: false },
        ),
        tier: __nullable__(
          t.Union(
            [t.Literal("MINOR"), t.Literal("INTERMEDIATE"), t.Literal("MAJOR")],
            { additionalProperties: false },
          ),
        ),
        nameAr: t.String(),
        nameEn: __nullable__(t.String()),
        version: t.Integer(),
        active: t.Boolean(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const ChecklistTemplateItemPlainInputCreate = t.Object(
  {
    order: t.Integer(),
    textAr: t.String(),
    textEn: t.Optional(__nullable__(t.String())),
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
  },
  { additionalProperties: false },
);

export const ChecklistTemplateItemPlainInputUpdate = t.Object(
  {
    order: t.Optional(t.Integer()),
    textAr: t.Optional(t.String()),
    textEn: t.Optional(__nullable__(t.String())),
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
  },
  { additionalProperties: false },
);

export const ChecklistTemplateItemRelationsInputCreate = t.Object(
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
  },
  { additionalProperties: false },
);

export const ChecklistTemplateItemRelationsInputUpdate = t.Partial(
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
    },
    { additionalProperties: false },
  ),
);

export const ChecklistTemplateItemWhere = t.Partial(
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
          textAr: t.String(),
          textEn: t.String(),
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
        },
        { additionalProperties: false },
      ),
    { $id: "ChecklistTemplateItem" },
  ),
);

export const ChecklistTemplateItemWhereUnique = t.Recursive(
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
              textAr: t.String(),
              textEn: t.String(),
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
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ChecklistTemplateItem" },
);

export const ChecklistTemplateItemSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      templateId: t.Boolean(),
      order: t.Boolean(),
      textAr: t.Boolean(),
      textEn: t.Boolean(),
      required: t.Boolean(),
      responseType: t.Boolean(),
      template: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ChecklistTemplateItemInclude = t.Partial(
  t.Object(
    { responseType: t.Boolean(), template: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const ChecklistTemplateItemOrderBy = t.Partial(
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
      textAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      textEn: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      required: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const ChecklistTemplateItem = t.Composite(
  [ChecklistTemplateItemPlain, ChecklistTemplateItemRelations],
  { additionalProperties: false },
);

export const ChecklistTemplateItemInputCreate = t.Composite(
  [
    ChecklistTemplateItemPlainInputCreate,
    ChecklistTemplateItemRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const ChecklistTemplateItemInputUpdate = t.Composite(
  [
    ChecklistTemplateItemPlainInputUpdate,
    ChecklistTemplateItemRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
