import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PosProfileUserPlain = t.Object(
  { id: t.String(), profileId: t.String(), userId: t.String() },
  {
    additionalProperties: false,
    description: `من يجوز له فتح وردية على هذا الملف. قائمة فارغة = الجميع (لا نُغلق بابًا بلا طلب).`,
  },
);

export const PosProfileUserRelations = t.Object(
  {
    profile: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        name: t.String(),
        warehouseId: __nullable__(t.String()),
        writeOffLimit: t.Number({
          description: `فرق النقد الذي يُقبل شطبه تلقائيًا عند الإقفال؛ ما فوقه يحتاج قرارًا`,
        }),
        writeOffAccountId: __nullable__(
          t.String({
            description: `حساب فروق النقد (زيادة/عجز الدرج) — بلا حساب يُرفض الإقفال بفارق`,
          }),
        ),
        disabled: t.Boolean(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      {
        additionalProperties: false,
        description: `ملف نقطة بيع: الإعدادات التي تحكم طاولة الكاشير في هذه العيادة.`,
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
  {
    additionalProperties: false,
    description: `من يجوز له فتح وردية على هذا الملف. قائمة فارغة = الجميع (لا نُغلق بابًا بلا طلب).`,
  },
);

export const PosProfileUserPlainInputCreate = t.Object(
  {},
  {
    additionalProperties: false,
    description: `من يجوز له فتح وردية على هذا الملف. قائمة فارغة = الجميع (لا نُغلق بابًا بلا طلب).`,
  },
);

export const PosProfileUserPlainInputUpdate = t.Object(
  {},
  {
    additionalProperties: false,
    description: `من يجوز له فتح وردية على هذا الملف. قائمة فارغة = الجميع (لا نُغلق بابًا بلا طلب).`,
  },
);

export const PosProfileUserRelationsInputCreate = t.Object(
  {
    profile: t.Object(
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
  {
    additionalProperties: false,
    description: `من يجوز له فتح وردية على هذا الملف. قائمة فارغة = الجميع (لا نُغلق بابًا بلا طلب).`,
  },
);

export const PosProfileUserRelationsInputUpdate = t.Partial(
  t.Object(
    {
      profile: t.Object(
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
    {
      additionalProperties: false,
      description: `من يجوز له فتح وردية على هذا الملف. قائمة فارغة = الجميع (لا نُغلق بابًا بلا طلب).`,
    },
  ),
);

export const PosProfileUserWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          profileId: t.String(),
          userId: t.String(),
        },
        {
          additionalProperties: false,
          description: `من يجوز له فتح وردية على هذا الملف. قائمة فارغة = الجميع (لا نُغلق بابًا بلا طلب).`,
        },
      ),
    { $id: "PosProfileUser" },
  ),
);

export const PosProfileUserWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              profileId_userId: t.Object(
                { profileId: t.String(), userId: t.String() },
                { additionalProperties: false },
              ),
            },
            {
              additionalProperties: false,
              description: `من يجوز له فتح وردية على هذا الملف. قائمة فارغة = الجميع (لا نُغلق بابًا بلا طلب).`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              profileId_userId: t.Object(
                { profileId: t.String(), userId: t.String() },
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
            { id: t.String(), profileId: t.String(), userId: t.String() },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PosProfileUser" },
);

export const PosProfileUserSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      profileId: t.Boolean(),
      userId: t.Boolean(),
      profile: t.Boolean(),
      user: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `من يجوز له فتح وردية على هذا الملف. قائمة فارغة = الجميع (لا نُغلق بابًا بلا طلب).`,
    },
  ),
);

export const PosProfileUserInclude = t.Partial(
  t.Object(
    { profile: t.Boolean(), user: t.Boolean(), _count: t.Boolean() },
    {
      additionalProperties: false,
      description: `من يجوز له فتح وردية على هذا الملف. قائمة فارغة = الجميع (لا نُغلق بابًا بلا طلب).`,
    },
  ),
);

export const PosProfileUserOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      profileId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `من يجوز له فتح وردية على هذا الملف. قائمة فارغة = الجميع (لا نُغلق بابًا بلا طلب).`,
    },
  ),
);

export const PosProfileUser = t.Composite(
  [PosProfileUserPlain, PosProfileUserRelations],
  { additionalProperties: false },
);

export const PosProfileUserInputCreate = t.Composite(
  [PosProfileUserPlainInputCreate, PosProfileUserRelationsInputCreate],
  { additionalProperties: false },
);

export const PosProfileUserInputUpdate = t.Composite(
  [PosProfileUserPlainInputUpdate, PosProfileUserRelationsInputUpdate],
  { additionalProperties: false },
);
