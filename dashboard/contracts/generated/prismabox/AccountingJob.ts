import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AccountingJobPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    jobType: t.String(),
    status: t.Union(
      [
        t.Literal("QUEUED"),
        t.Literal("IN_PROGRESS"),
        t.Literal("COMPLETED"),
        t.Literal("FAILED"),
      ],
      { additionalProperties: false },
    ),
    idempotencyKey: t.String(),
    payload: __nullable__(t.Any()),
    voucherType: __nullable__(t.String()),
    voucherId: __nullable__(t.String()),
    attempts: t.Integer(),
    errorMessage: __nullable__(t.String()),
    startedAt: __nullable__(t.Date()),
    finishedAt: __nullable__(t.Date()),
    createdById: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const AccountingJobRelations = t.Object(
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

export const AccountingJobPlainInputCreate = t.Object(
  {
    jobType: t.String(),
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
    idempotencyKey: t.String(),
    payload: t.Optional(__nullable__(t.Any())),
    voucherType: t.Optional(__nullable__(t.String())),
    attempts: t.Optional(t.Integer()),
    errorMessage: t.Optional(__nullable__(t.String())),
    startedAt: t.Optional(__nullable__(t.Date())),
    finishedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const AccountingJobPlainInputUpdate = t.Object(
  {
    jobType: t.Optional(t.String()),
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
    idempotencyKey: t.Optional(t.String()),
    payload: t.Optional(__nullable__(t.Any())),
    voucherType: t.Optional(__nullable__(t.String())),
    attempts: t.Optional(t.Integer()),
    errorMessage: t.Optional(__nullable__(t.String())),
    startedAt: t.Optional(__nullable__(t.Date())),
    finishedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const AccountingJobRelationsInputCreate = t.Object(
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

export const AccountingJobRelationsInputUpdate = t.Partial(
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

export const AccountingJobWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          jobType: t.String(),
          status: t.Union(
            [
              t.Literal("QUEUED"),
              t.Literal("IN_PROGRESS"),
              t.Literal("COMPLETED"),
              t.Literal("FAILED"),
            ],
            { additionalProperties: false },
          ),
          idempotencyKey: t.String(),
          payload: t.Any(),
          voucherType: t.String(),
          voucherId: t.String(),
          attempts: t.Integer(),
          errorMessage: t.String(),
          startedAt: t.Date(),
          finishedAt: t.Date(),
          createdById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "AccountingJob" },
  ),
);

export const AccountingJobWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_jobType_idempotencyKey: t.Object(
                {
                  clinicId: t.String(),
                  jobType: t.String(),
                  idempotencyKey: t.String(),
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
              clinicId_jobType_idempotencyKey: t.Object(
                {
                  clinicId: t.String(),
                  jobType: t.String(),
                  idempotencyKey: t.String(),
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
              jobType: t.String(),
              status: t.Union(
                [
                  t.Literal("QUEUED"),
                  t.Literal("IN_PROGRESS"),
                  t.Literal("COMPLETED"),
                  t.Literal("FAILED"),
                ],
                { additionalProperties: false },
              ),
              idempotencyKey: t.String(),
              payload: t.Any(),
              voucherType: t.String(),
              voucherId: t.String(),
              attempts: t.Integer(),
              errorMessage: t.String(),
              startedAt: t.Date(),
              finishedAt: t.Date(),
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
  { $id: "AccountingJob" },
);

export const AccountingJobSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      jobType: t.Boolean(),
      status: t.Boolean(),
      idempotencyKey: t.Boolean(),
      payload: t.Boolean(),
      voucherType: t.Boolean(),
      voucherId: t.Boolean(),
      attempts: t.Boolean(),
      errorMessage: t.Boolean(),
      startedAt: t.Boolean(),
      finishedAt: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AccountingJobInclude = t.Partial(
  t.Object(
    { status: t.Boolean(), clinic: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const AccountingJobOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      jobType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      idempotencyKey: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      payload: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      voucherType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      voucherId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      attempts: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      errorMessage: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      startedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      finishedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const AccountingJob = t.Composite(
  [AccountingJobPlain, AccountingJobRelations],
  { additionalProperties: false },
);

export const AccountingJobInputCreate = t.Composite(
  [AccountingJobPlainInputCreate, AccountingJobRelationsInputCreate],
  { additionalProperties: false },
);

export const AccountingJobInputUpdate = t.Composite(
  [AccountingJobPlainInputUpdate, AccountingJobRelationsInputUpdate],
  { additionalProperties: false },
);
