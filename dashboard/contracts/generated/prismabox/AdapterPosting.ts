import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AdapterPostingPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    adapterKey: t.String(),
    sourceId: t.String(),
    sourceCode: t.String(),
    postingDate: t.Date(),
    amount: t.Number(),
    valueAccountIds: t.Array(t.String(), { additionalProperties: false }),
    postedAt: t.Date(),
    reversedAt: __nullable__(t.Date()),
    createdById: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const AdapterPostingRelations = t.Object(
  {
    clinic: t.Object(
      {
        id: t.String(),
        name: t.String(),
        slug: __nullable__(t.String()),
        plan: t.Union(
          [t.Literal("FREE"), t.Literal("BASIC"), t.Literal("PRO")],
          { additionalProperties: false },
        ),
        trialEndsAt: __nullable__(t.Date()),
        onboardingCompleted: t.Boolean(),
        rbacVersion: t.Integer({
          description: `[RBAC P4] يُرفَع عند أيّ كتابة على دور أو منحة أو إسناد. الجلسة تحمل النسخة التي
بُنيت منها لقطتُها، فتُعيد بناءها ذاتيًا عند الاختلاف بدل حذف الجلسات وإخراج المستخدم.`,
        }),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const AdapterPostingPlainInputCreate = t.Object(
  {
    adapterKey: t.String(),
    sourceCode: t.String(),
    postingDate: t.Date(),
    amount: t.Number(),
    valueAccountIds: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
    postedAt: t.Optional(t.Date()),
    reversedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const AdapterPostingPlainInputUpdate = t.Object(
  {
    adapterKey: t.Optional(t.String()),
    sourceCode: t.Optional(t.String()),
    postingDate: t.Optional(t.Date()),
    amount: t.Optional(t.Number()),
    valueAccountIds: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
    postedAt: t.Optional(t.Date()),
    reversedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const AdapterPostingRelationsInputCreate = t.Object(
  {
    clinic: t.Object(
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

export const AdapterPostingRelationsInputUpdate = t.Partial(
  t.Object(
    {
      clinic: t.Object(
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

export const AdapterPostingWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          adapterKey: t.String(),
          sourceId: t.String(),
          sourceCode: t.String(),
          postingDate: t.Date(),
          amount: t.Number(),
          valueAccountIds: t.Array(t.String(), { additionalProperties: false }),
          postedAt: t.Date(),
          reversedAt: t.Date(),
          createdById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "AdapterPosting" },
  ),
);

export const AdapterPostingWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_adapterKey_sourceId: t.Object(
                {
                  clinicId: t.String(),
                  adapterKey: t.String(),
                  sourceId: t.String(),
                },
                { additionalProperties: false },
              ),
            },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              clinicId_adapterKey_sourceId: t.Object(
                {
                  clinicId: t.String(),
                  adapterKey: t.String(),
                  sourceId: t.String(),
                },
                { additionalProperties: false },
              ),
            }),
          ],
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
              clinicId: t.String(),
              adapterKey: t.String(),
              sourceId: t.String(),
              sourceCode: t.String(),
              postingDate: t.Date(),
              amount: t.Number(),
              valueAccountIds: t.Array(t.String(), {
                additionalProperties: false,
              }),
              postedAt: t.Date(),
              reversedAt: t.Date(),
              createdById: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "AdapterPosting" },
);

export const AdapterPostingSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      adapterKey: t.Boolean(),
      sourceId: t.Boolean(),
      sourceCode: t.Boolean(),
      postingDate: t.Boolean(),
      amount: t.Boolean(),
      valueAccountIds: t.Boolean(),
      postedAt: t.Boolean(),
      reversedAt: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AdapterPostingInclude = t.Partial(
  t.Object(
    { clinic: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const AdapterPostingOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      adapterKey: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sourceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sourceCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      postingDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      amount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      valueAccountIds: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      postedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reversedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdById: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const AdapterPosting = t.Composite(
  [AdapterPostingPlain, AdapterPostingRelations],
  { additionalProperties: false },
);

export const AdapterPostingInputCreate = t.Composite(
  [AdapterPostingPlainInputCreate, AdapterPostingRelationsInputCreate],
  { additionalProperties: false },
);

export const AdapterPostingInputUpdate = t.Composite(
  [AdapterPostingPlainInputUpdate, AdapterPostingRelationsInputUpdate],
  { additionalProperties: false },
);
