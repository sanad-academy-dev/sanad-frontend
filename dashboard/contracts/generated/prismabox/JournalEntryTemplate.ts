import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const JournalEntryTemplatePlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    templateTitle: t.String(),
    voucherType: t.String(),
    accountIds: t.Array(t.String(), { additionalProperties: false }),
    createdById: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const JournalEntryTemplateRelations = t.Object(
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

export const JournalEntryTemplatePlainInputCreate = t.Object(
  {
    templateTitle: t.String(),
    voucherType: t.Optional(t.String()),
    accountIds: t.Array(t.String(), { additionalProperties: false }),
  },
  { additionalProperties: false },
);

export const JournalEntryTemplatePlainInputUpdate = t.Object(
  {
    templateTitle: t.Optional(t.String()),
    voucherType: t.Optional(t.String()),
    accountIds: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
  },
  { additionalProperties: false },
);

export const JournalEntryTemplateRelationsInputCreate = t.Object(
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

export const JournalEntryTemplateRelationsInputUpdate = t.Partial(
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

export const JournalEntryTemplateWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          templateTitle: t.String(),
          voucherType: t.String(),
          accountIds: t.Array(t.String(), { additionalProperties: false }),
          createdById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "JournalEntryTemplate" },
  ),
);

export const JournalEntryTemplateWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_templateTitle: t.Object(
                { clinicId: t.String(), templateTitle: t.String() },
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
              clinicId_templateTitle: t.Object(
                { clinicId: t.String(), templateTitle: t.String() },
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
              templateTitle: t.String(),
              voucherType: t.String(),
              accountIds: t.Array(t.String(), { additionalProperties: false }),
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
  { $id: "JournalEntryTemplate" },
);

export const JournalEntryTemplateSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      templateTitle: t.Boolean(),
      voucherType: t.Boolean(),
      accountIds: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const JournalEntryTemplateInclude = t.Partial(
  t.Object(
    { clinic: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const JournalEntryTemplateOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      templateTitle: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      voucherType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      accountIds: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const JournalEntryTemplate = t.Composite(
  [JournalEntryTemplatePlain, JournalEntryTemplateRelations],
  { additionalProperties: false },
);

export const JournalEntryTemplateInputCreate = t.Composite(
  [
    JournalEntryTemplatePlainInputCreate,
    JournalEntryTemplateRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const JournalEntryTemplateInputUpdate = t.Composite(
  [
    JournalEntryTemplatePlainInputUpdate,
    JournalEntryTemplateRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
