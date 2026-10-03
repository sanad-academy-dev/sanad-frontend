import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PetOwnerClinicLinkPlain = t.Object(
  {
    id: t.String(),
    accountId: t.String(),
    ownerId: t.String(),
    clinicId: t.String(),
    source: t.Union([t.Literal("PHONE_MATCH"), t.Literal("STAFF_ISSUED")], {
      additionalProperties: false,
      description: `*
* كيف نشأ الربط بين حساب المالك وسجلّه في عيادة بعينها.`,
    }),
    hiddenByOwner: t.Boolean({
      description: `*
* المالك أخفى العيادة من تطبيقه — لا يقطع الربط ولا يمسّ سجلّه لديها.`,
    }),
    revokedAt: __nullable__(t.Date()),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const PetOwnerClinicLinkRelations = t.Object(
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
    owner: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        name: t.String(),
        phone: t.String(),
        phoneE164: __nullable__(t.String()),
        email: __nullable__(t.String()),
        gender: __nullable__(
          t.Union(
            [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
            { additionalProperties: false },
          ),
        ),
        ownerType: t.Union(
          [
            t.Literal("ALL"),
            t.Literal("VIP"),
            t.Literal("LOYALTY"),
            t.Literal("NEW"),
            t.Literal("CURRENT"),
          ],
          { additionalProperties: false },
        ),
        relationship: __nullable__(
          t.Union(
            [
              t.Literal("OWNER"),
              t.Literal("GUARDIAN"),
              t.Literal("DELEGATE"),
              t.Literal("EMERGENCY"),
            ],
            { additionalProperties: false },
          ),
        ),
        country: __nullable__(t.String()),
        city: __nullable__(t.String()),
        address: __nullable__(t.String()),
        notes: __nullable__(t.String()),
        active: t.Boolean(),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        editsCount: t.Integer(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
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

export const PetOwnerClinicLinkPlainInputCreate = t.Object(
  {
    source: t.Optional(
      t.Union([t.Literal("PHONE_MATCH"), t.Literal("STAFF_ISSUED")], {
        additionalProperties: false,
        description: `*
* كيف نشأ الربط بين حساب المالك وسجلّه في عيادة بعينها.`,
      }),
    ),
    hiddenByOwner: t.Optional(
      t.Boolean({
        description: `*
* المالك أخفى العيادة من تطبيقه — لا يقطع الربط ولا يمسّ سجلّه لديها.`,
      }),
    ),
    revokedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const PetOwnerClinicLinkPlainInputUpdate = t.Object(
  {
    source: t.Optional(
      t.Union([t.Literal("PHONE_MATCH"), t.Literal("STAFF_ISSUED")], {
        additionalProperties: false,
        description: `*
* كيف نشأ الربط بين حساب المالك وسجلّه في عيادة بعينها.`,
      }),
    ),
    hiddenByOwner: t.Optional(
      t.Boolean({
        description: `*
* المالك أخفى العيادة من تطبيقه — لا يقطع الربط ولا يمسّ سجلّه لديها.`,
      }),
    ),
    revokedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const PetOwnerClinicLinkRelationsInputCreate = t.Object(
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
    owner: t.Object(
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

export const PetOwnerClinicLinkRelationsInputUpdate = t.Partial(
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
      owner: t.Object(
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

export const PetOwnerClinicLinkWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          accountId: t.String(),
          ownerId: t.String(),
          clinicId: t.String(),
          source: t.Union(
            [t.Literal("PHONE_MATCH"), t.Literal("STAFF_ISSUED")],
            {
              additionalProperties: false,
              description: `*
* كيف نشأ الربط بين حساب المالك وسجلّه في عيادة بعينها.`,
            },
          ),
          hiddenByOwner: t.Boolean({
            description: `*
* المالك أخفى العيادة من تطبيقه — لا يقطع الربط ولا يمسّ سجلّه لديها.`,
          }),
          revokedAt: t.Date(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "PetOwnerClinicLink" },
  ),
);

export const PetOwnerClinicLinkWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              accountId_ownerId: t.Object(
                { accountId: t.String(), ownerId: t.String() },
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
              accountId_ownerId: t.Object(
                { accountId: t.String(), ownerId: t.String() },
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
              ownerId: t.String(),
              clinicId: t.String(),
              source: t.Union(
                [t.Literal("PHONE_MATCH"), t.Literal("STAFF_ISSUED")],
                {
                  additionalProperties: false,
                  description: `*
* كيف نشأ الربط بين حساب المالك وسجلّه في عيادة بعينها.`,
                },
              ),
              hiddenByOwner: t.Boolean({
                description: `*
* المالك أخفى العيادة من تطبيقه — لا يقطع الربط ولا يمسّ سجلّه لديها.`,
              }),
              revokedAt: t.Date(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PetOwnerClinicLink" },
);

export const PetOwnerClinicLinkSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      accountId: t.Boolean(),
      ownerId: t.Boolean(),
      clinicId: t.Boolean(),
      source: t.Boolean(),
      hiddenByOwner: t.Boolean(),
      revokedAt: t.Boolean(),
      createdAt: t.Boolean(),
      account: t.Boolean(),
      owner: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PetOwnerClinicLinkInclude = t.Partial(
  t.Object(
    {
      source: t.Boolean(),
      account: t.Boolean(),
      owner: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PetOwnerClinicLinkOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      accountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ownerId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      hiddenByOwner: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      revokedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const PetOwnerClinicLink = t.Composite(
  [PetOwnerClinicLinkPlain, PetOwnerClinicLinkRelations],
  { additionalProperties: false },
);

export const PetOwnerClinicLinkInputCreate = t.Composite(
  [PetOwnerClinicLinkPlainInputCreate, PetOwnerClinicLinkRelationsInputCreate],
  { additionalProperties: false },
);

export const PetOwnerClinicLinkInputUpdate = t.Composite(
  [PetOwnerClinicLinkPlainInputUpdate, PetOwnerClinicLinkRelationsInputUpdate],
  { additionalProperties: false },
);
