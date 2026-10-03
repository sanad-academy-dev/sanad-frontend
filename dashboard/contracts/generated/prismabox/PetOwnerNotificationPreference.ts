import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PetOwnerNotificationPreferencePlain = t.Object(
  {
    id: t.String(),
    accountId: t.String(),
    category: t.Union(
      [
        t.Literal("APPOINTMENT"),
        t.Literal("REMINDER_DUE"),
        t.Literal("RESULTS"),
        t.Literal("BILLING"),
        t.Literal("CHAT"),
        t.Literal("MARKETING"),
      ],
      { additionalProperties: false },
    ),
    push: t.Boolean(),
    email: t.Boolean(),
    sms: t.Boolean(),
    whatsapp: t.Boolean(),
  },
  { additionalProperties: false },
);

export const PetOwnerNotificationPreferenceRelations = t.Object(
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

export const PetOwnerNotificationPreferencePlainInputCreate = t.Object(
  {
    category: t.Union(
      [
        t.Literal("APPOINTMENT"),
        t.Literal("REMINDER_DUE"),
        t.Literal("RESULTS"),
        t.Literal("BILLING"),
        t.Literal("CHAT"),
        t.Literal("MARKETING"),
      ],
      { additionalProperties: false },
    ),
    push: t.Optional(t.Boolean()),
    email: t.Optional(t.Boolean()),
    sms: t.Optional(t.Boolean()),
    whatsapp: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const PetOwnerNotificationPreferencePlainInputUpdate = t.Object(
  {
    category: t.Optional(
      t.Union(
        [
          t.Literal("APPOINTMENT"),
          t.Literal("REMINDER_DUE"),
          t.Literal("RESULTS"),
          t.Literal("BILLING"),
          t.Literal("CHAT"),
          t.Literal("MARKETING"),
        ],
        { additionalProperties: false },
      ),
    ),
    push: t.Optional(t.Boolean()),
    email: t.Optional(t.Boolean()),
    sms: t.Optional(t.Boolean()),
    whatsapp: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const PetOwnerNotificationPreferenceRelationsInputCreate = t.Object(
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

export const PetOwnerNotificationPreferenceRelationsInputUpdate = t.Partial(
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

export const PetOwnerNotificationPreferenceWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          accountId: t.String(),
          category: t.Union(
            [
              t.Literal("APPOINTMENT"),
              t.Literal("REMINDER_DUE"),
              t.Literal("RESULTS"),
              t.Literal("BILLING"),
              t.Literal("CHAT"),
              t.Literal("MARKETING"),
            ],
            { additionalProperties: false },
          ),
          push: t.Boolean(),
          email: t.Boolean(),
          sms: t.Boolean(),
          whatsapp: t.Boolean(),
        },
        { additionalProperties: false },
      ),
    { $id: "PetOwnerNotificationPreference" },
  ),
);

export const PetOwnerNotificationPreferenceWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              accountId_category: t.Object(
                {
                  accountId: t.String(),
                  category: t.Union(
                    [
                      t.Literal("APPOINTMENT"),
                      t.Literal("REMINDER_DUE"),
                      t.Literal("RESULTS"),
                      t.Literal("BILLING"),
                      t.Literal("CHAT"),
                      t.Literal("MARKETING"),
                    ],
                    { additionalProperties: false },
                  ),
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
              accountId_category: t.Object(
                {
                  accountId: t.String(),
                  category: t.Union(
                    [
                      t.Literal("APPOINTMENT"),
                      t.Literal("REMINDER_DUE"),
                      t.Literal("RESULTS"),
                      t.Literal("BILLING"),
                      t.Literal("CHAT"),
                      t.Literal("MARKETING"),
                    ],
                    { additionalProperties: false },
                  ),
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
              category: t.Union(
                [
                  t.Literal("APPOINTMENT"),
                  t.Literal("REMINDER_DUE"),
                  t.Literal("RESULTS"),
                  t.Literal("BILLING"),
                  t.Literal("CHAT"),
                  t.Literal("MARKETING"),
                ],
                { additionalProperties: false },
              ),
              push: t.Boolean(),
              email: t.Boolean(),
              sms: t.Boolean(),
              whatsapp: t.Boolean(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PetOwnerNotificationPreference" },
);

export const PetOwnerNotificationPreferenceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      accountId: t.Boolean(),
      category: t.Boolean(),
      push: t.Boolean(),
      email: t.Boolean(),
      sms: t.Boolean(),
      whatsapp: t.Boolean(),
      account: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PetOwnerNotificationPreferenceInclude = t.Partial(
  t.Object(
    { category: t.Boolean(), account: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const PetOwnerNotificationPreferenceOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      accountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      push: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      email: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sms: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      whatsapp: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const PetOwnerNotificationPreference = t.Composite(
  [
    PetOwnerNotificationPreferencePlain,
    PetOwnerNotificationPreferenceRelations,
  ],
  { additionalProperties: false },
);

export const PetOwnerNotificationPreferenceInputCreate = t.Composite(
  [
    PetOwnerNotificationPreferencePlainInputCreate,
    PetOwnerNotificationPreferenceRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const PetOwnerNotificationPreferenceInputUpdate = t.Composite(
  [
    PetOwnerNotificationPreferencePlainInputUpdate,
    PetOwnerNotificationPreferenceRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
