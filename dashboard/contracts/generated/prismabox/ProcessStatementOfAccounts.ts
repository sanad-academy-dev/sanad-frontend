import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ProcessStatementOfAccountsPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    title: t.String(),
    reportType: t.Union(
      [t.Literal("PARTY_LEDGER"), t.Literal("RECEIVABLE_AGEING")],
      { additionalProperties: false },
    ),
    frequency: t.Union(
      [
        t.Literal("MANUAL"),
        t.Literal("WEEKLY"),
        t.Literal("MONTHLY"),
        t.Literal("QUARTERLY"),
      ],
      { additionalProperties: false },
    ),
    fromDate: __nullable__(
      t.Date({
        description: `نافذة ثابتة اختيارية؛ فارغة ⇒ تُشتقّ من التكرار عند كل إرسال`,
      }),
    ),
    toDate: __nullable__(t.Date()),
    subject: __nullable__(t.String()),
    bodyText: __nullable__(t.String()),
    ccEmails: t.Array(t.String(), { additionalProperties: false }),
    enabled: t.Boolean(),
    lastSentAt: __nullable__(t.Date()),
    createdById: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `[P12.7] FR-17.4 — تهيئة محفوظة لإرسال كشوف الحساب دوريًا إلى العملاء.`,
  },
);

export const ProcessStatementOfAccountsRelations = t.Object(
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
    customers: t.Array(
      t.Object(
        {
          id: t.String(),
          psoaId: t.String(),
          partyType: t.String(),
          partyId: t.String(),
          email: __nullable__(
            t.String({
              description: `بريد المُرسَل إليه — فارغ ⇒ يُقرأ من سجلّ الطرف عند الإرسال`,
            }),
          ),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `[P12.7] FR-17.4 — تهيئة محفوظة لإرسال كشوف الحساب دوريًا إلى العملاء.`,
  },
);

export const ProcessStatementOfAccountsPlainInputCreate = t.Object(
  {
    title: t.String(),
    reportType: t.Optional(
      t.Union([t.Literal("PARTY_LEDGER"), t.Literal("RECEIVABLE_AGEING")], {
        additionalProperties: false,
      }),
    ),
    frequency: t.Optional(
      t.Union(
        [
          t.Literal("MANUAL"),
          t.Literal("WEEKLY"),
          t.Literal("MONTHLY"),
          t.Literal("QUARTERLY"),
        ],
        { additionalProperties: false },
      ),
    ),
    fromDate: t.Optional(
      __nullable__(
        t.Date({
          description: `نافذة ثابتة اختيارية؛ فارغة ⇒ تُشتقّ من التكرار عند كل إرسال`,
        }),
      ),
    ),
    toDate: t.Optional(__nullable__(t.Date())),
    subject: t.Optional(__nullable__(t.String())),
    bodyText: t.Optional(__nullable__(t.String())),
    ccEmails: t.Array(t.String(), { additionalProperties: false }),
    enabled: t.Optional(t.Boolean()),
    lastSentAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `[P12.7] FR-17.4 — تهيئة محفوظة لإرسال كشوف الحساب دوريًا إلى العملاء.`,
  },
);

export const ProcessStatementOfAccountsPlainInputUpdate = t.Object(
  {
    title: t.Optional(t.String()),
    reportType: t.Optional(
      t.Union([t.Literal("PARTY_LEDGER"), t.Literal("RECEIVABLE_AGEING")], {
        additionalProperties: false,
      }),
    ),
    frequency: t.Optional(
      t.Union(
        [
          t.Literal("MANUAL"),
          t.Literal("WEEKLY"),
          t.Literal("MONTHLY"),
          t.Literal("QUARTERLY"),
        ],
        { additionalProperties: false },
      ),
    ),
    fromDate: t.Optional(
      __nullable__(
        t.Date({
          description: `نافذة ثابتة اختيارية؛ فارغة ⇒ تُشتقّ من التكرار عند كل إرسال`,
        }),
      ),
    ),
    toDate: t.Optional(__nullable__(t.Date())),
    subject: t.Optional(__nullable__(t.String())),
    bodyText: t.Optional(__nullable__(t.String())),
    ccEmails: t.Optional(t.Array(t.String(), { additionalProperties: false })),
    enabled: t.Optional(t.Boolean()),
    lastSentAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `[P12.7] FR-17.4 — تهيئة محفوظة لإرسال كشوف الحساب دوريًا إلى العملاء.`,
  },
);

export const ProcessStatementOfAccountsRelationsInputCreate = t.Object(
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
    customers: t.Optional(
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
  {
    additionalProperties: false,
    description: `[P12.7] FR-17.4 — تهيئة محفوظة لإرسال كشوف الحساب دوريًا إلى العملاء.`,
  },
);

export const ProcessStatementOfAccountsRelationsInputUpdate = t.Partial(
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
      customers: t.Partial(
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
    {
      additionalProperties: false,
      description: `[P12.7] FR-17.4 — تهيئة محفوظة لإرسال كشوف الحساب دوريًا إلى العملاء.`,
    },
  ),
);

export const ProcessStatementOfAccountsWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          title: t.String(),
          reportType: t.Union(
            [t.Literal("PARTY_LEDGER"), t.Literal("RECEIVABLE_AGEING")],
            { additionalProperties: false },
          ),
          frequency: t.Union(
            [
              t.Literal("MANUAL"),
              t.Literal("WEEKLY"),
              t.Literal("MONTHLY"),
              t.Literal("QUARTERLY"),
            ],
            { additionalProperties: false },
          ),
          fromDate: t.Date({
            description: `نافذة ثابتة اختيارية؛ فارغة ⇒ تُشتقّ من التكرار عند كل إرسال`,
          }),
          toDate: t.Date(),
          subject: t.String(),
          bodyText: t.String(),
          ccEmails: t.Array(t.String(), { additionalProperties: false }),
          enabled: t.Boolean(),
          lastSentAt: t.Date(),
          createdById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[P12.7] FR-17.4 — تهيئة محفوظة لإرسال كشوف الحساب دوريًا إلى العملاء.`,
        },
      ),
    { $id: "ProcessStatementOfAccounts" },
  ),
);

export const ProcessStatementOfAccountsWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_title: t.Object(
                { clinicId: t.String(), title: t.String() },
                { additionalProperties: false },
              ),
            },
            {
              additionalProperties: false,
              description: `[P12.7] FR-17.4 — تهيئة محفوظة لإرسال كشوف الحساب دوريًا إلى العملاء.`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              clinicId_title: t.Object(
                { clinicId: t.String(), title: t.String() },
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
              title: t.String(),
              reportType: t.Union(
                [t.Literal("PARTY_LEDGER"), t.Literal("RECEIVABLE_AGEING")],
                { additionalProperties: false },
              ),
              frequency: t.Union(
                [
                  t.Literal("MANUAL"),
                  t.Literal("WEEKLY"),
                  t.Literal("MONTHLY"),
                  t.Literal("QUARTERLY"),
                ],
                { additionalProperties: false },
              ),
              fromDate: t.Date({
                description: `نافذة ثابتة اختيارية؛ فارغة ⇒ تُشتقّ من التكرار عند كل إرسال`,
              }),
              toDate: t.Date(),
              subject: t.String(),
              bodyText: t.String(),
              ccEmails: t.Array(t.String(), { additionalProperties: false }),
              enabled: t.Boolean(),
              lastSentAt: t.Date(),
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
  { $id: "ProcessStatementOfAccounts" },
);

export const ProcessStatementOfAccountsSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      title: t.Boolean(),
      reportType: t.Boolean(),
      frequency: t.Boolean(),
      fromDate: t.Boolean(),
      toDate: t.Boolean(),
      subject: t.Boolean(),
      bodyText: t.Boolean(),
      ccEmails: t.Boolean(),
      enabled: t.Boolean(),
      lastSentAt: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      customers: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[P12.7] FR-17.4 — تهيئة محفوظة لإرسال كشوف الحساب دوريًا إلى العملاء.`,
    },
  ),
);

export const ProcessStatementOfAccountsInclude = t.Partial(
  t.Object(
    {
      reportType: t.Boolean(),
      frequency: t.Boolean(),
      clinic: t.Boolean(),
      customers: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[P12.7] FR-17.4 — تهيئة محفوظة لإرسال كشوف الحساب دوريًا إلى العملاء.`,
    },
  ),
);

export const ProcessStatementOfAccountsOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      title: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fromDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      toDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      subject: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      bodyText: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ccEmails: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      enabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lastSentAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
    {
      additionalProperties: false,
      description: `[P12.7] FR-17.4 — تهيئة محفوظة لإرسال كشوف الحساب دوريًا إلى العملاء.`,
    },
  ),
);

export const ProcessStatementOfAccounts = t.Composite(
  [ProcessStatementOfAccountsPlain, ProcessStatementOfAccountsRelations],
  { additionalProperties: false },
);

export const ProcessStatementOfAccountsInputCreate = t.Composite(
  [
    ProcessStatementOfAccountsPlainInputCreate,
    ProcessStatementOfAccountsRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const ProcessStatementOfAccountsInputUpdate = t.Composite(
  [
    ProcessStatementOfAccountsPlainInputUpdate,
    ProcessStatementOfAccountsRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
