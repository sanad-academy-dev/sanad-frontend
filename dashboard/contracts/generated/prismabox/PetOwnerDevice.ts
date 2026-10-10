import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PetOwnerDevicePlain = t.Object(
  {
    id: t.String(),
    accountId: t.String(),
    platform: t.Union(
      [t.Literal("IOS"), t.Literal("ANDROID"), t.Literal("WEB")],
      {
        additionalProperties: false,
        description: `*
* تفضيلات التنبيه لكل فئة × قناة. صفٌّ واحد لكل فئة، يُنشأ عند أوّل تعديل.`,
      },
    ),
    expoPushToken: __nullable__(t.String()),
    appVersion: __nullable__(t.String()),
    osVersion: __nullable__(t.String()),
    pushEnabled: t.Boolean(),
    lastSeenAt: t.Date(),
    revokedAt: __nullable__(t.Date()),
    createdAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `*
* جهاز مسجَّل لاستقبال الإشعارات.
* \`expoPushToken\` فريد عالميًّا لا لكل حساب: الرمز يخصّ **التثبيت** لا الشخص، فلو
* سجّل مالكٌ آخر دخوله على الهاتف نفسه وجب أن ينتقل الرمز إليه — وإلّا وصلت تنبيهات
* الأوّل إلى الثاني.`,
  },
);

export const PetOwnerDeviceRelations = t.Object(
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
  {
    additionalProperties: false,
    description: `*
* جهاز مسجَّل لاستقبال الإشعارات.
* \`expoPushToken\` فريد عالميًّا لا لكل حساب: الرمز يخصّ **التثبيت** لا الشخص، فلو
* سجّل مالكٌ آخر دخوله على الهاتف نفسه وجب أن ينتقل الرمز إليه — وإلّا وصلت تنبيهات
* الأوّل إلى الثاني.`,
  },
);

export const PetOwnerDevicePlainInputCreate = t.Object(
  {
    platform: t.Union(
      [t.Literal("IOS"), t.Literal("ANDROID"), t.Literal("WEB")],
      {
        additionalProperties: false,
        description: `*
* تفضيلات التنبيه لكل فئة × قناة. صفٌّ واحد لكل فئة، يُنشأ عند أوّل تعديل.`,
      },
    ),
    expoPushToken: t.Optional(__nullable__(t.String())),
    appVersion: t.Optional(__nullable__(t.String())),
    osVersion: t.Optional(__nullable__(t.String())),
    pushEnabled: t.Optional(t.Boolean()),
    lastSeenAt: t.Optional(t.Date()),
    revokedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `*
* جهاز مسجَّل لاستقبال الإشعارات.
* \`expoPushToken\` فريد عالميًّا لا لكل حساب: الرمز يخصّ **التثبيت** لا الشخص، فلو
* سجّل مالكٌ آخر دخوله على الهاتف نفسه وجب أن ينتقل الرمز إليه — وإلّا وصلت تنبيهات
* الأوّل إلى الثاني.`,
  },
);

export const PetOwnerDevicePlainInputUpdate = t.Object(
  {
    platform: t.Optional(
      t.Union([t.Literal("IOS"), t.Literal("ANDROID"), t.Literal("WEB")], {
        additionalProperties: false,
        description: `*
* تفضيلات التنبيه لكل فئة × قناة. صفٌّ واحد لكل فئة، يُنشأ عند أوّل تعديل.`,
      }),
    ),
    expoPushToken: t.Optional(__nullable__(t.String())),
    appVersion: t.Optional(__nullable__(t.String())),
    osVersion: t.Optional(__nullable__(t.String())),
    pushEnabled: t.Optional(t.Boolean()),
    lastSeenAt: t.Optional(t.Date()),
    revokedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `*
* جهاز مسجَّل لاستقبال الإشعارات.
* \`expoPushToken\` فريد عالميًّا لا لكل حساب: الرمز يخصّ **التثبيت** لا الشخص، فلو
* سجّل مالكٌ آخر دخوله على الهاتف نفسه وجب أن ينتقل الرمز إليه — وإلّا وصلت تنبيهات
* الأوّل إلى الثاني.`,
  },
);

export const PetOwnerDeviceRelationsInputCreate = t.Object(
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
  {
    additionalProperties: false,
    description: `*
* جهاز مسجَّل لاستقبال الإشعارات.
* \`expoPushToken\` فريد عالميًّا لا لكل حساب: الرمز يخصّ **التثبيت** لا الشخص، فلو
* سجّل مالكٌ آخر دخوله على الهاتف نفسه وجب أن ينتقل الرمز إليه — وإلّا وصلت تنبيهات
* الأوّل إلى الثاني.`,
  },
);

export const PetOwnerDeviceRelationsInputUpdate = t.Partial(
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
    {
      additionalProperties: false,
      description: `*
* جهاز مسجَّل لاستقبال الإشعارات.
* \`expoPushToken\` فريد عالميًّا لا لكل حساب: الرمز يخصّ **التثبيت** لا الشخص، فلو
* سجّل مالكٌ آخر دخوله على الهاتف نفسه وجب أن ينتقل الرمز إليه — وإلّا وصلت تنبيهات
* الأوّل إلى الثاني.`,
    },
  ),
);

export const PetOwnerDeviceWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          accountId: t.String(),
          platform: t.Union(
            [t.Literal("IOS"), t.Literal("ANDROID"), t.Literal("WEB")],
            {
              additionalProperties: false,
              description: `*
* تفضيلات التنبيه لكل فئة × قناة. صفٌّ واحد لكل فئة، يُنشأ عند أوّل تعديل.`,
            },
          ),
          expoPushToken: t.String(),
          appVersion: t.String(),
          osVersion: t.String(),
          pushEnabled: t.Boolean(),
          lastSeenAt: t.Date(),
          revokedAt: t.Date(),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `*
* جهاز مسجَّل لاستقبال الإشعارات.
* \`expoPushToken\` فريد عالميًّا لا لكل حساب: الرمز يخصّ **التثبيت** لا الشخص، فلو
* سجّل مالكٌ آخر دخوله على الهاتف نفسه وجب أن ينتقل الرمز إليه — وإلّا وصلت تنبيهات
* الأوّل إلى الثاني.`,
        },
      ),
    { $id: "PetOwnerDevice" },
  ),
);

export const PetOwnerDeviceWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), expoPushToken: t.String() },
            {
              additionalProperties: false,
              description: `*
* جهاز مسجَّل لاستقبال الإشعارات.
* \`expoPushToken\` فريد عالميًّا لا لكل حساب: الرمز يخصّ **التثبيت** لا الشخص، فلو
* سجّل مالكٌ آخر دخوله على الهاتف نفسه وجب أن ينتقل الرمز إليه — وإلّا وصلت تنبيهات
* الأوّل إلى الثاني.`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({ expoPushToken: t.String() }),
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
              platform: t.Union(
                [t.Literal("IOS"), t.Literal("ANDROID"), t.Literal("WEB")],
                {
                  additionalProperties: false,
                  description: `*
* تفضيلات التنبيه لكل فئة × قناة. صفٌّ واحد لكل فئة، يُنشأ عند أوّل تعديل.`,
                },
              ),
              expoPushToken: t.String(),
              appVersion: t.String(),
              osVersion: t.String(),
              pushEnabled: t.Boolean(),
              lastSeenAt: t.Date(),
              revokedAt: t.Date(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PetOwnerDevice" },
);

export const PetOwnerDeviceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      accountId: t.Boolean(),
      platform: t.Boolean(),
      expoPushToken: t.Boolean(),
      appVersion: t.Boolean(),
      osVersion: t.Boolean(),
      pushEnabled: t.Boolean(),
      lastSeenAt: t.Boolean(),
      revokedAt: t.Boolean(),
      createdAt: t.Boolean(),
      account: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `*
* جهاز مسجَّل لاستقبال الإشعارات.
* \`expoPushToken\` فريد عالميًّا لا لكل حساب: الرمز يخصّ **التثبيت** لا الشخص، فلو
* سجّل مالكٌ آخر دخوله على الهاتف نفسه وجب أن ينتقل الرمز إليه — وإلّا وصلت تنبيهات
* الأوّل إلى الثاني.`,
    },
  ),
);

export const PetOwnerDeviceInclude = t.Partial(
  t.Object(
    { platform: t.Boolean(), account: t.Boolean(), _count: t.Boolean() },
    {
      additionalProperties: false,
      description: `*
* جهاز مسجَّل لاستقبال الإشعارات.
* \`expoPushToken\` فريد عالميًّا لا لكل حساب: الرمز يخصّ **التثبيت** لا الشخص، فلو
* سجّل مالكٌ آخر دخوله على الهاتف نفسه وجب أن ينتقل الرمز إليه — وإلّا وصلت تنبيهات
* الأوّل إلى الثاني.`,
    },
  ),
);

export const PetOwnerDeviceOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      accountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      expoPushToken: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      appVersion: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      osVersion: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      pushEnabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lastSeenAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      revokedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `*
* جهاز مسجَّل لاستقبال الإشعارات.
* \`expoPushToken\` فريد عالميًّا لا لكل حساب: الرمز يخصّ **التثبيت** لا الشخص، فلو
* سجّل مالكٌ آخر دخوله على الهاتف نفسه وجب أن ينتقل الرمز إليه — وإلّا وصلت تنبيهات
* الأوّل إلى الثاني.`,
    },
  ),
);

export const PetOwnerDevice = t.Composite(
  [PetOwnerDevicePlain, PetOwnerDeviceRelations],
  { additionalProperties: false },
);

export const PetOwnerDeviceInputCreate = t.Composite(
  [PetOwnerDevicePlainInputCreate, PetOwnerDeviceRelationsInputCreate],
  { additionalProperties: false },
);

export const PetOwnerDeviceInputUpdate = t.Composite(
  [PetOwnerDevicePlainInputUpdate, PetOwnerDeviceRelationsInputUpdate],
  { additionalProperties: false },
);
