import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PetOwnerSessionPlain = t.Object(
  {
    id: t.String(),
    accountId: t.String(),
    tokenHash: t.String(),
    tokenPrefix: t.String(),
    userAgent: __nullable__(t.String()),
    expiresAt: t.Date(),
    revokedAt: __nullable__(t.Date()),
    lastSeenAt: t.Date(),
    createdAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `*
* جلسة جهاز واحد.
* الرمز الخام لا يُخزَّن: يُحفظ \`sha256\` منه، فتسريب قاعدة البيانات لا يُنتج جلسات
* صالحة. و\`tokenPrefix\` للعرض في شاشة «الأجهزة» فقط.`,
  },
);

export const PetOwnerSessionRelations = t.Object(
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
* جلسة جهاز واحد.
* الرمز الخام لا يُخزَّن: يُحفظ \`sha256\` منه، فتسريب قاعدة البيانات لا يُنتج جلسات
* صالحة. و\`tokenPrefix\` للعرض في شاشة «الأجهزة» فقط.`,
  },
);

export const PetOwnerSessionPlainInputCreate = t.Object(
  {
    tokenHash: t.String(),
    tokenPrefix: t.String(),
    userAgent: t.Optional(__nullable__(t.String())),
    expiresAt: t.Date(),
    revokedAt: t.Optional(__nullable__(t.Date())),
    lastSeenAt: t.Optional(t.Date()),
  },
  {
    additionalProperties: false,
    description: `*
* جلسة جهاز واحد.
* الرمز الخام لا يُخزَّن: يُحفظ \`sha256\` منه، فتسريب قاعدة البيانات لا يُنتج جلسات
* صالحة. و\`tokenPrefix\` للعرض في شاشة «الأجهزة» فقط.`,
  },
);

export const PetOwnerSessionPlainInputUpdate = t.Object(
  {
    tokenHash: t.Optional(t.String()),
    tokenPrefix: t.Optional(t.String()),
    userAgent: t.Optional(__nullable__(t.String())),
    expiresAt: t.Optional(t.Date()),
    revokedAt: t.Optional(__nullable__(t.Date())),
    lastSeenAt: t.Optional(t.Date()),
  },
  {
    additionalProperties: false,
    description: `*
* جلسة جهاز واحد.
* الرمز الخام لا يُخزَّن: يُحفظ \`sha256\` منه، فتسريب قاعدة البيانات لا يُنتج جلسات
* صالحة. و\`tokenPrefix\` للعرض في شاشة «الأجهزة» فقط.`,
  },
);

export const PetOwnerSessionRelationsInputCreate = t.Object(
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
* جلسة جهاز واحد.
* الرمز الخام لا يُخزَّن: يُحفظ \`sha256\` منه، فتسريب قاعدة البيانات لا يُنتج جلسات
* صالحة. و\`tokenPrefix\` للعرض في شاشة «الأجهزة» فقط.`,
  },
);

export const PetOwnerSessionRelationsInputUpdate = t.Partial(
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
* جلسة جهاز واحد.
* الرمز الخام لا يُخزَّن: يُحفظ \`sha256\` منه، فتسريب قاعدة البيانات لا يُنتج جلسات
* صالحة. و\`tokenPrefix\` للعرض في شاشة «الأجهزة» فقط.`,
    },
  ),
);

export const PetOwnerSessionWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          accountId: t.String(),
          tokenHash: t.String(),
          tokenPrefix: t.String(),
          userAgent: t.String(),
          expiresAt: t.Date(),
          revokedAt: t.Date(),
          lastSeenAt: t.Date(),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `*
* جلسة جهاز واحد.
* الرمز الخام لا يُخزَّن: يُحفظ \`sha256\` منه، فتسريب قاعدة البيانات لا يُنتج جلسات
* صالحة. و\`tokenPrefix\` للعرض في شاشة «الأجهزة» فقط.`,
        },
      ),
    { $id: "PetOwnerSession" },
  ),
);

export const PetOwnerSessionWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), tokenHash: t.String() },
            {
              additionalProperties: false,
              description: `*
* جلسة جهاز واحد.
* الرمز الخام لا يُخزَّن: يُحفظ \`sha256\` منه، فتسريب قاعدة البيانات لا يُنتج جلسات
* صالحة. و\`tokenPrefix\` للعرض في شاشة «الأجهزة» فقط.`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ tokenHash: t.String() })],
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
              tokenHash: t.String(),
              tokenPrefix: t.String(),
              userAgent: t.String(),
              expiresAt: t.Date(),
              revokedAt: t.Date(),
              lastSeenAt: t.Date(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PetOwnerSession" },
);

export const PetOwnerSessionSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      accountId: t.Boolean(),
      tokenHash: t.Boolean(),
      tokenPrefix: t.Boolean(),
      userAgent: t.Boolean(),
      expiresAt: t.Boolean(),
      revokedAt: t.Boolean(),
      lastSeenAt: t.Boolean(),
      createdAt: t.Boolean(),
      account: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `*
* جلسة جهاز واحد.
* الرمز الخام لا يُخزَّن: يُحفظ \`sha256\` منه، فتسريب قاعدة البيانات لا يُنتج جلسات
* صالحة. و\`tokenPrefix\` للعرض في شاشة «الأجهزة» فقط.`,
    },
  ),
);

export const PetOwnerSessionInclude = t.Partial(
  t.Object(
    { account: t.Boolean(), _count: t.Boolean() },
    {
      additionalProperties: false,
      description: `*
* جلسة جهاز واحد.
* الرمز الخام لا يُخزَّن: يُحفظ \`sha256\` منه، فتسريب قاعدة البيانات لا يُنتج جلسات
* صالحة. و\`tokenPrefix\` للعرض في شاشة «الأجهزة» فقط.`,
    },
  ),
);

export const PetOwnerSessionOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      accountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      tokenHash: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      tokenPrefix: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      userAgent: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      expiresAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      revokedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lastSeenAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `*
* جلسة جهاز واحد.
* الرمز الخام لا يُخزَّن: يُحفظ \`sha256\` منه، فتسريب قاعدة البيانات لا يُنتج جلسات
* صالحة. و\`tokenPrefix\` للعرض في شاشة «الأجهزة» فقط.`,
    },
  ),
);

export const PetOwnerSession = t.Composite(
  [PetOwnerSessionPlain, PetOwnerSessionRelations],
  { additionalProperties: false },
);

export const PetOwnerSessionInputCreate = t.Composite(
  [PetOwnerSessionPlainInputCreate, PetOwnerSessionRelationsInputCreate],
  { additionalProperties: false },
);

export const PetOwnerSessionInputUpdate = t.Composite(
  [PetOwnerSessionPlainInputUpdate, PetOwnerSessionRelationsInputUpdate],
  { additionalProperties: false },
);
