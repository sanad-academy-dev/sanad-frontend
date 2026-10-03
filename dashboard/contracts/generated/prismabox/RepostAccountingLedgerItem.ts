import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RepostAccountingLedgerItemPlain = t.Object(
  {
    id: t.String(),
    repostId: t.String(),
    voucherType: t.String(),
    voucherId: t.String(),
    voucherNo: __nullable__(t.String()),
    status: t.Union(
      [
        t.Literal("QUEUED"),
        t.Literal("IN_PROGRESS"),
        t.Literal("COMPLETED"),
        t.Literal("FAILED"),
      ],
      { additionalProperties: false },
    ),
    errorMessage: __nullable__(t.String()),
    glCountAfter: __nullable__(
      t.Integer({
        description: `عدد قيود الدفتر بعد إعادة البناء — دليل ملموس على أنّ الإعادة فعلت شيئًا`,
      }),
    ),
  },
  { additionalProperties: false },
);

export const RepostAccountingLedgerItemRelations = t.Object(
  {
    repost: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        status: t.Union(
          [
            t.Literal("QUEUED"),
            t.Literal("IN_PROGRESS"),
            t.Literal("COMPLETED"),
            t.Literal("FAILED"),
          ],
          { additionalProperties: false },
        ),
        reason: t.String({
          description: `سبب إعادة الترحيل — يظهر في السجلّ ويُطالَب به لأن إعادة الترحيل حدث استثنائي`,
        }),
        errorMessage: __nullable__(t.String()),
        createdById: __nullable__(t.String()),
        createdAt: t.Date(),
        completedAt: __nullable__(t.Date()),
      },
      {
        additionalProperties: false,
        description: `[P12.9] FR-6.9 — أداة إعادة ترحيل الدفتر: تعكس قيود مستند مُرحَّل ثم تُعيد بناءها.`,
      },
    ),
  },
  { additionalProperties: false },
);

export const RepostAccountingLedgerItemPlainInputCreate = t.Object(
  {
    voucherType: t.String(),
    voucherNo: t.Optional(__nullable__(t.String())),
    status: t.Optional(
      t.Union(
        [
          t.Literal("QUEUED"),
          t.Literal("IN_PROGRESS"),
          t.Literal("COMPLETED"),
          t.Literal("FAILED"),
        ],
        { additionalProperties: false },
      ),
    ),
    errorMessage: t.Optional(__nullable__(t.String())),
    glCountAfter: t.Optional(
      __nullable__(
        t.Integer({
          description: `عدد قيود الدفتر بعد إعادة البناء — دليل ملموس على أنّ الإعادة فعلت شيئًا`,
        }),
      ),
    ),
  },
  { additionalProperties: false },
);

export const RepostAccountingLedgerItemPlainInputUpdate = t.Object(
  {
    voucherType: t.Optional(t.String()),
    voucherNo: t.Optional(__nullable__(t.String())),
    status: t.Optional(
      t.Union(
        [
          t.Literal("QUEUED"),
          t.Literal("IN_PROGRESS"),
          t.Literal("COMPLETED"),
          t.Literal("FAILED"),
        ],
        { additionalProperties: false },
      ),
    ),
    errorMessage: t.Optional(__nullable__(t.String())),
    glCountAfter: t.Optional(
      __nullable__(
        t.Integer({
          description: `عدد قيود الدفتر بعد إعادة البناء — دليل ملموس على أنّ الإعادة فعلت شيئًا`,
        }),
      ),
    ),
  },
  { additionalProperties: false },
);

export const RepostAccountingLedgerItemRelationsInputCreate = t.Object(
  {
    repost: t.Object(
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

export const RepostAccountingLedgerItemRelationsInputUpdate = t.Partial(
  t.Object(
    {
      repost: t.Object(
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

export const RepostAccountingLedgerItemWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          repostId: t.String(),
          voucherType: t.String(),
          voucherId: t.String(),
          voucherNo: t.String(),
          status: t.Union(
            [
              t.Literal("QUEUED"),
              t.Literal("IN_PROGRESS"),
              t.Literal("COMPLETED"),
              t.Literal("FAILED"),
            ],
            { additionalProperties: false },
          ),
          errorMessage: t.String(),
          glCountAfter: t.Integer({
            description: `عدد قيود الدفتر بعد إعادة البناء — دليل ملموس على أنّ الإعادة فعلت شيئًا`,
          }),
        },
        { additionalProperties: false },
      ),
    { $id: "RepostAccountingLedgerItem" },
  ),
);

export const RepostAccountingLedgerItemWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              repostId_voucherType_voucherId: t.Object(
                {
                  repostId: t.String(),
                  voucherType: t.String(),
                  voucherId: t.String(),
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
              repostId_voucherType_voucherId: t.Object(
                {
                  repostId: t.String(),
                  voucherType: t.String(),
                  voucherId: t.String(),
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
              repostId: t.String(),
              voucherType: t.String(),
              voucherId: t.String(),
              voucherNo: t.String(),
              status: t.Union(
                [
                  t.Literal("QUEUED"),
                  t.Literal("IN_PROGRESS"),
                  t.Literal("COMPLETED"),
                  t.Literal("FAILED"),
                ],
                { additionalProperties: false },
              ),
              errorMessage: t.String(),
              glCountAfter: t.Integer({
                description: `عدد قيود الدفتر بعد إعادة البناء — دليل ملموس على أنّ الإعادة فعلت شيئًا`,
              }),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "RepostAccountingLedgerItem" },
);

export const RepostAccountingLedgerItemSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      repostId: t.Boolean(),
      voucherType: t.Boolean(),
      voucherId: t.Boolean(),
      voucherNo: t.Boolean(),
      status: t.Boolean(),
      errorMessage: t.Boolean(),
      glCountAfter: t.Boolean(),
      repost: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RepostAccountingLedgerItemInclude = t.Partial(
  t.Object(
    { status: t.Boolean(), repost: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const RepostAccountingLedgerItemOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      repostId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      voucherType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      voucherId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      voucherNo: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      errorMessage: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      glCountAfter: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const RepostAccountingLedgerItem = t.Composite(
  [RepostAccountingLedgerItemPlain, RepostAccountingLedgerItemRelations],
  { additionalProperties: false },
);

export const RepostAccountingLedgerItemInputCreate = t.Composite(
  [
    RepostAccountingLedgerItemPlainInputCreate,
    RepostAccountingLedgerItemRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const RepostAccountingLedgerItemInputUpdate = t.Composite(
  [
    RepostAccountingLedgerItemPlainInputUpdate,
    RepostAccountingLedgerItemRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
