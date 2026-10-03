import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CagePlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    branchId: t.String(),
    roomId: t.String(),
    name: t.String({ description: `اسم/رقم القفص كما هو مكتوب على بابه` }),
    sizeClass: __nullable__(
      t.Union(
        [
          t.Literal("SMALL"),
          t.Literal("MEDIUM"),
          t.Literal("LARGE"),
          t.Literal("WALK_IN"),
        ],
        {
          additionalProperties: false,
          description: `حجم القفص — يُستعمل لاقتراح الإسكان لا لمنعه. حيوان كبير في قفص صغير خطأ
يستحقّ تحذيرًا، لكنّه أحيانًا الخيار الوحيد المتاح ليلة الطوارئ.`,
        },
      ),
    ),
    notes: __nullable__(t.String()),
    active: t.Boolean(),
    isDeleted: t.Boolean(),
    deletedAt: __nullable__(t.Date()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `قفص/سرير داخل غرفة. الغرفة وحدها لا تكفي: \`Room.capacity\` رقمٌ مجرّد لا يعرف
أيّ حيوان في أيّ موضع، ولا يسمح بنقلٍ موثَّق ولا بقاعدة عزل.`,
  },
);

export const CageRelations = t.Object(
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
    branch: t.Object(
      {
        id: t.String(),
        branchCode: t.String(),
        clinicId: t.String(),
        name: t.String(),
        icon: __nullable__(t.String()),
        type: t.Union([t.Literal("PRIMARY"), t.Literal("SUB")], {
          additionalProperties: false,
        }),
        managerId: __nullable__(t.String()),
        email: __nullable__(t.String()),
        city: __nullable__(t.String()),
        phone: __nullable__(t.String()),
        address: __nullable__(t.String()),
        active: t.Boolean(),
        emergencyNotifications: t.Boolean(),
        settings: __nullable__(t.Any()),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    room: t.Object(
      {
        id: t.String(),
        branchId: t.String(),
        clinicId: t.String(),
        name: t.String(),
        type: t.Union(
          [
            t.Literal("EXAMINATION"),
            t.Literal("LABORATORY"),
            t.Literal("WAITING"),
            t.Literal("OPERATING"),
            t.Literal("VACCINATION"),
            t.Literal("ICU"),
            t.Literal("GROOMING"),
            t.Literal("WARD"),
            t.Literal("ISOLATION"),
          ],
          { additionalProperties: false },
        ),
        capacity: t.Integer(),
        managerId: __nullable__(t.String()),
        availableDevices: t.Array(t.String(), { additionalProperties: false }),
        abilities: t.Array(t.String(), { additionalProperties: false }),
        notes: __nullable__(t.String()),
        active: t.Boolean(),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    assignments: t.Array(
      t.Object(
        {
          id: t.String(),
          stayId: t.String(),
          cageId: t.String(),
          assignedAt: t.Date(),
          releasedAt: __nullable__(t.Date()),
          movedById: __nullable__(t.String()),
          reason: __nullable__(
            t.String({
              description: `سبب النقل — يُطلب عند النقل لا عند الإسكان الأول`,
            }),
          ),
        },
        {
          additionalProperties: false,
          description: `إسكان الإقامة في قفص — سجل مُلحَق: كل نقل صفٌّ جديد، والسابق يُغلق بـ
\`releasedAt\`. الإشغال الحالي = الصفوف بلا \`releasedAt\`.
لماذا سجل لا عمود \`cageId\` على الإقامة؟ لأن «أين كان الحيوان الثلاثاء الماضي؟»
سؤال يُطرح فعلًا — عند تتبّع عدوى مثلًا — وعمودٌ يُكتب فوقه يمحو الجواب.`,
        },
      ),
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `قفص/سرير داخل غرفة. الغرفة وحدها لا تكفي: \`Room.capacity\` رقمٌ مجرّد لا يعرف
أيّ حيوان في أيّ موضع، ولا يسمح بنقلٍ موثَّق ولا بقاعدة عزل.`,
  },
);

export const CagePlainInputCreate = t.Object(
  {
    name: t.String({ description: `اسم/رقم القفص كما هو مكتوب على بابه` }),
    sizeClass: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("SMALL"),
            t.Literal("MEDIUM"),
            t.Literal("LARGE"),
            t.Literal("WALK_IN"),
          ],
          {
            additionalProperties: false,
            description: `حجم القفص — يُستعمل لاقتراح الإسكان لا لمنعه. حيوان كبير في قفص صغير خطأ
يستحقّ تحذيرًا، لكنّه أحيانًا الخيار الوحيد المتاح ليلة الطوارئ.`,
          },
        ),
      ),
    ),
    notes: t.Optional(__nullable__(t.String())),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `قفص/سرير داخل غرفة. الغرفة وحدها لا تكفي: \`Room.capacity\` رقمٌ مجرّد لا يعرف
أيّ حيوان في أيّ موضع، ولا يسمح بنقلٍ موثَّق ولا بقاعدة عزل.`,
  },
);

export const CagePlainInputUpdate = t.Object(
  {
    name: t.Optional(
      t.String({ description: `اسم/رقم القفص كما هو مكتوب على بابه` }),
    ),
    sizeClass: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("SMALL"),
            t.Literal("MEDIUM"),
            t.Literal("LARGE"),
            t.Literal("WALK_IN"),
          ],
          {
            additionalProperties: false,
            description: `حجم القفص — يُستعمل لاقتراح الإسكان لا لمنعه. حيوان كبير في قفص صغير خطأ
يستحقّ تحذيرًا، لكنّه أحيانًا الخيار الوحيد المتاح ليلة الطوارئ.`,
          },
        ),
      ),
    ),
    notes: t.Optional(__nullable__(t.String())),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `قفص/سرير داخل غرفة. الغرفة وحدها لا تكفي: \`Room.capacity\` رقمٌ مجرّد لا يعرف
أيّ حيوان في أيّ موضع، ولا يسمح بنقلٍ موثَّق ولا بقاعدة عزل.`,
  },
);

export const CageRelationsInputCreate = t.Object(
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
    branch: t.Object(
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
    room: t.Object(
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
    assignments: t.Optional(
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
    description: `قفص/سرير داخل غرفة. الغرفة وحدها لا تكفي: \`Room.capacity\` رقمٌ مجرّد لا يعرف
أيّ حيوان في أيّ موضع، ولا يسمح بنقلٍ موثَّق ولا بقاعدة عزل.`,
  },
);

export const CageRelationsInputUpdate = t.Partial(
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
      branch: t.Object(
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
      room: t.Object(
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
      assignments: t.Partial(
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
      description: `قفص/سرير داخل غرفة. الغرفة وحدها لا تكفي: \`Room.capacity\` رقمٌ مجرّد لا يعرف
أيّ حيوان في أيّ موضع، ولا يسمح بنقلٍ موثَّق ولا بقاعدة عزل.`,
    },
  ),
);

export const CageWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          branchId: t.String(),
          roomId: t.String(),
          name: t.String({
            description: `اسم/رقم القفص كما هو مكتوب على بابه`,
          }),
          sizeClass: t.Union(
            [
              t.Literal("SMALL"),
              t.Literal("MEDIUM"),
              t.Literal("LARGE"),
              t.Literal("WALK_IN"),
            ],
            {
              additionalProperties: false,
              description: `حجم القفص — يُستعمل لاقتراح الإسكان لا لمنعه. حيوان كبير في قفص صغير خطأ
يستحقّ تحذيرًا، لكنّه أحيانًا الخيار الوحيد المتاح ليلة الطوارئ.`,
            },
          ),
          notes: t.String(),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `قفص/سرير داخل غرفة. الغرفة وحدها لا تكفي: \`Room.capacity\` رقمٌ مجرّد لا يعرف
أيّ حيوان في أيّ موضع، ولا يسمح بنقلٍ موثَّق ولا بقاعدة عزل.`,
        },
      ),
    { $id: "Cage" },
  ),
);

export const CageWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              roomId_name: t.Object(
                {
                  roomId: t.String(),
                  name: t.String({
                    description: `اسم/رقم القفص كما هو مكتوب على بابه`,
                  }),
                },
                { additionalProperties: false },
              ),
            },
            {
              additionalProperties: false,
              description: `قفص/سرير داخل غرفة. الغرفة وحدها لا تكفي: \`Room.capacity\` رقمٌ مجرّد لا يعرف
أيّ حيوان في أيّ موضع، ولا يسمح بنقلٍ موثَّق ولا بقاعدة عزل.`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              roomId_name: t.Object(
                {
                  roomId: t.String(),
                  name: t.String({
                    description: `اسم/رقم القفص كما هو مكتوب على بابه`,
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
              clinicId: t.String(),
              branchId: t.String(),
              roomId: t.String(),
              name: t.String({
                description: `اسم/رقم القفص كما هو مكتوب على بابه`,
              }),
              sizeClass: t.Union(
                [
                  t.Literal("SMALL"),
                  t.Literal("MEDIUM"),
                  t.Literal("LARGE"),
                  t.Literal("WALK_IN"),
                ],
                {
                  additionalProperties: false,
                  description: `حجم القفص — يُستعمل لاقتراح الإسكان لا لمنعه. حيوان كبير في قفص صغير خطأ
يستحقّ تحذيرًا، لكنّه أحيانًا الخيار الوحيد المتاح ليلة الطوارئ.`,
                },
              ),
              notes: t.String(),
              active: t.Boolean(),
              isDeleted: t.Boolean(),
              deletedAt: t.Date(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Cage" },
);

export const CageSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      branchId: t.Boolean(),
      roomId: t.Boolean(),
      name: t.Boolean(),
      sizeClass: t.Boolean(),
      notes: t.Boolean(),
      active: t.Boolean(),
      isDeleted: t.Boolean(),
      deletedAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      branch: t.Boolean(),
      room: t.Boolean(),
      assignments: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `قفص/سرير داخل غرفة. الغرفة وحدها لا تكفي: \`Room.capacity\` رقمٌ مجرّد لا يعرف
أيّ حيوان في أيّ موضع، ولا يسمح بنقلٍ موثَّق ولا بقاعدة عزل.`,
    },
  ),
);

export const CageInclude = t.Partial(
  t.Object(
    {
      sizeClass: t.Boolean(),
      clinic: t.Boolean(),
      branch: t.Boolean(),
      room: t.Boolean(),
      assignments: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `قفص/سرير داخل غرفة. الغرفة وحدها لا تكفي: \`Room.capacity\` رقمٌ مجرّد لا يعرف
أيّ حيوان في أيّ موضع، ولا يسمح بنقلٍ موثَّق ولا بقاعدة عزل.`,
    },
  ),
);

export const CageOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      branchId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      roomId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      active: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDeleted: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      deletedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `قفص/سرير داخل غرفة. الغرفة وحدها لا تكفي: \`Room.capacity\` رقمٌ مجرّد لا يعرف
أيّ حيوان في أيّ موضع، ولا يسمح بنقلٍ موثَّق ولا بقاعدة عزل.`,
    },
  ),
);

export const Cage = t.Composite([CagePlain, CageRelations], {
  additionalProperties: false,
});

export const CageInputCreate = t.Composite(
  [CagePlainInputCreate, CageRelationsInputCreate],
  { additionalProperties: false },
);

export const CageInputUpdate = t.Composite(
  [CagePlainInputUpdate, CageRelationsInputUpdate],
  { additionalProperties: false },
);
