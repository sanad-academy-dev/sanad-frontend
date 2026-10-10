import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PetOwnerNotificationReadPlain = t.Object(
  {
    id: t.String(),
    accountId: t.String(),
    key: t.String({
      description: `*
* مفتاح مستقرّ يُشتقّ من مصدر التنبيه — مثال: «vacc:<recordId>».`,
    }),
    readAt: t.Date(),
  },
  { additionalProperties: false },
);

export const PetOwnerNotificationReadRelations = t.Object(
  {
    account: t.Object(
      {
        id: t.String(),
        phoneE164: t.String(),
        passwordHash: t.String({
          description: `*
* كلمة المرور مُجزّأة بـscrypt (\`salt:hash\`) لا مخزَّنة.
* تولّدها العيادة وتسلّمها للمالك، ولذلك \`mustChangePassword\` افتراضه \`true\`:
* كلمة مرور يعرفها موظّف الاستقبال ليست سرًّا بين المالك والنظام حتى يغيّرها.`,
        }),
        mustChangePassword: t.Boolean(),
        passwordSetAt: t.Date(),
        name: __nullable__(t.String()),
        email: __nullable__(t.String()),
        locale: t.String(),
        status: t.Union([t.Literal("ACTIVE"), t.Literal("SUSPENDED")], {
          additionalProperties: false,
        }),
        failedAttempts: t.Integer({
          description: `*
* حماية من التخمين: تُصفَّر عند نجاح الدخول.`,
        }),
        lockedUntil: __nullable__(t.Date()),
        lastSignInAt: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      {
        additionalProperties: false,
        description: `*
* حساب المالك — **عالمي لا مرتبط بعيادة**.
* \`Owner\` مُقيَّد بـ(clinicId, phone)، فالإنسان الواحد المتعامل مع ثلاث عيادات ثلاثة
* صفوف. وتسجيل الدخول شخصٌ لا صفّ — ولذلك هذا الجدول يقوم على الهاتف وحده، ويرتبط
* بصفوف \`Owner\` عبر \`PetOwnerClinicLink\`.`,
      },
    ),
  },
  { additionalProperties: false },
);

export const PetOwnerNotificationReadPlainInputCreate = t.Object(
  {
    key: t.String({
      description: `*
* مفتاح مستقرّ يُشتقّ من مصدر التنبيه — مثال: «vacc:<recordId>».`,
    }),
    readAt: t.Optional(t.Date()),
  },
  { additionalProperties: false },
);

export const PetOwnerNotificationReadPlainInputUpdate = t.Object(
  {
    key: t.Optional(
      t.String({
        description: `*
* مفتاح مستقرّ يُشتقّ من مصدر التنبيه — مثال: «vacc:<recordId>».`,
      }),
    ),
    readAt: t.Optional(t.Date()),
  },
  { additionalProperties: false },
);

export const PetOwnerNotificationReadRelationsInputCreate = t.Object(
  {
    account: t.Object(
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

export const PetOwnerNotificationReadRelationsInputUpdate = t.Partial(
  t.Object(
    {
      account: t.Object(
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

export const PetOwnerNotificationReadWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          accountId: t.String(),
          key: t.String({
            description: `*
* مفتاح مستقرّ يُشتقّ من مصدر التنبيه — مثال: «vacc:<recordId>».`,
          }),
          readAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "PetOwnerNotificationRead" },
  ),
);

export const PetOwnerNotificationReadWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              accountId_key: t.Object(
                {
                  accountId: t.String(),
                  key: t.String({
                    description: `*
* مفتاح مستقرّ يُشتقّ من مصدر التنبيه — مثال: «vacc:<recordId>».`,
                  }),
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
              accountId_key: t.Object(
                {
                  accountId: t.String(),
                  key: t.String({
                    description: `*
* مفتاح مستقرّ يُشتقّ من مصدر التنبيه — مثال: «vacc:<recordId>».`,
                  }),
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
              accountId: t.String(),
              key: t.String({
                description: `*
* مفتاح مستقرّ يُشتقّ من مصدر التنبيه — مثال: «vacc:<recordId>».`,
              }),
              readAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PetOwnerNotificationRead" },
);

export const PetOwnerNotificationReadSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      accountId: t.Boolean(),
      key: t.Boolean(),
      readAt: t.Boolean(),
      account: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PetOwnerNotificationReadInclude = t.Partial(
  t.Object(
    { account: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const PetOwnerNotificationReadOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      accountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      key: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      readAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const PetOwnerNotificationRead = t.Composite(
  [PetOwnerNotificationReadPlain, PetOwnerNotificationReadRelations],
  { additionalProperties: false },
);

export const PetOwnerNotificationReadInputCreate = t.Composite(
  [
    PetOwnerNotificationReadPlainInputCreate,
    PetOwnerNotificationReadRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const PetOwnerNotificationReadInputUpdate = t.Composite(
  [
    PetOwnerNotificationReadPlainInputUpdate,
    PetOwnerNotificationReadRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
