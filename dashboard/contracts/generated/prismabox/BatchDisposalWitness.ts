import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const BatchDisposalWitnessPlain = t.Object(
  { id: t.String(), disposalId: t.String(), userId: t.String() },
  { additionalProperties: false },
);

export const BatchDisposalWitnessRelations = t.Object(
  {
    disposal: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        batchId: t.String(),
        itemId: t.String(),
        warehouseId: t.String(),
        qty: t.Integer(),
        reasonAr: t.String(),
        performedById: __nullable__(t.String()),
        createdAt: t.Date(),
      },
      {
        additionalProperties: false,
        description: `[PH17] إتلاف دفعة منتهية — واقعة موثَّقة بمنفّذ وشاهدٍ أو أكثر.
الإتلاف حدث يُسأل عنه لاحقًا («من أتلف ٢٠ أمبولة كيتامين ومن رأى ذلك؟»)، فلا يُختزل
في حركة مخزون بملاحظة نصّية. الشهود مستخدمون حقيقيّون في العيادة لا أسماء مكتوبة،
وعددهم مفتوح: مادة مراقبة قد تُلزم بشاهدين. حركة المخزون تحمل \`voucherId\` = هذا الصفّ.`,
      },
    ),
    user: t.Object(
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
  },
  { additionalProperties: false },
);

export const BatchDisposalWitnessPlainInputCreate = t.Object(
  {},
  { additionalProperties: false },
);

export const BatchDisposalWitnessPlainInputUpdate = t.Object(
  {},
  { additionalProperties: false },
);

export const BatchDisposalWitnessRelationsInputCreate = t.Object(
  {
    disposal: t.Object(
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
    user: t.Object(
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

export const BatchDisposalWitnessRelationsInputUpdate = t.Partial(
  t.Object(
    {
      disposal: t.Object(
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
      user: t.Object(
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

export const BatchDisposalWitnessWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          disposalId: t.String(),
          userId: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "BatchDisposalWitness" },
  ),
);

export const BatchDisposalWitnessWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              disposalId_userId: t.Object(
                { disposalId: t.String(), userId: t.String() },
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
              disposalId_userId: t.Object(
                { disposalId: t.String(), userId: t.String() },
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
            { id: t.String(), disposalId: t.String(), userId: t.String() },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "BatchDisposalWitness" },
);

export const BatchDisposalWitnessSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      disposalId: t.Boolean(),
      userId: t.Boolean(),
      disposal: t.Boolean(),
      user: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const BatchDisposalWitnessInclude = t.Partial(
  t.Object(
    { disposal: t.Boolean(), user: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const BatchDisposalWitnessOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      disposalId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const BatchDisposalWitness = t.Composite(
  [BatchDisposalWitnessPlain, BatchDisposalWitnessRelations],
  { additionalProperties: false },
);

export const BatchDisposalWitnessInputCreate = t.Composite(
  [
    BatchDisposalWitnessPlainInputCreate,
    BatchDisposalWitnessRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const BatchDisposalWitnessInputUpdate = t.Composite(
  [
    BatchDisposalWitnessPlainInputUpdate,
    BatchDisposalWitnessRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
