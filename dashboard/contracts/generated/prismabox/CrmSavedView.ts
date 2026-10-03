import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CrmSavedViewPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    userId: t.String(),
    entity: t.Union([t.Literal("LEAD"), t.Literal("DEAL")], {
      additionalProperties: false,
      description: `*
* §8.1 — one polymorphic pattern for every activity and the status log.`,
    }),
    name: t.String(),
    filters: t.Any({
      description: `\`{ statusId?, sourceId?, ownerUserId?, from?, to?, search? }\` — شكل مرشّحات الشاشة`,
    }),
    sort: __nullable__(t.Any({ description: `\`{ field, direction }\`` })),
    visibleColumns: t.Array(t.String(), { additionalProperties: false }),
    layout: t.Union([t.Literal("LIST"), t.Literal("KANBAN")], {
      additionalProperties: false,
      description: `[CRM-P5] §11.2 — الشكل الذي يفتح به العرض المحفوظ.`,
    }),
    isPinned: t.Boolean(),
    isPublic: t.Boolean(),
    isDeleted: t.Boolean(),
    deletedAt: __nullable__(t.Date()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `[CRM-P5] §11.3 — عرضٌ محفوظ لكلّ مستخدم.
النطاق مقصوص عن محرّك العروض المرجعيّ: لا \`group_by\` في v1. والحقول المرنة تُخزَّن
\`Json\` لا أعمدةً: المرشّحات تتبع شاشتها وتتغيّر معها، وعمودٌ لكل مرشّح كان سيجعل كلّ
مرشّحٍ جديد هجرةً.
**\`isPublic\` محروس** (§17.2 صفّ ٢٣): الخاصّ حرٌّ لكلّ عضو، والنشر يحتاج
\`crm_settings.edit\` — لأنّ العرض المنشور حالةٌ مشتركة تظهر على شاشات الزملاء.`,
  },
);

export const CrmSavedViewRelations = t.Object(
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
    description: `[CRM-P5] §11.3 — عرضٌ محفوظ لكلّ مستخدم.
النطاق مقصوص عن محرّك العروض المرجعيّ: لا \`group_by\` في v1. والحقول المرنة تُخزَّن
\`Json\` لا أعمدةً: المرشّحات تتبع شاشتها وتتغيّر معها، وعمودٌ لكل مرشّح كان سيجعل كلّ
مرشّحٍ جديد هجرةً.
**\`isPublic\` محروس** (§17.2 صفّ ٢٣): الخاصّ حرٌّ لكلّ عضو، والنشر يحتاج
\`crm_settings.edit\` — لأنّ العرض المنشور حالةٌ مشتركة تظهر على شاشات الزملاء.`,
  },
);

export const CrmSavedViewPlainInputCreate = t.Object(
  {
    entity: t.Union([t.Literal("LEAD"), t.Literal("DEAL")], {
      additionalProperties: false,
      description: `*
* §8.1 — one polymorphic pattern for every activity and the status log.`,
    }),
    name: t.String(),
    filters: t.Optional(
      t.Any({
        description: `\`{ statusId?, sourceId?, ownerUserId?, from?, to?, search? }\` — شكل مرشّحات الشاشة`,
      }),
    ),
    sort: t.Optional(
      __nullable__(t.Any({ description: `\`{ field, direction }\`` })),
    ),
    visibleColumns: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
    layout: t.Optional(
      t.Union([t.Literal("LIST"), t.Literal("KANBAN")], {
        additionalProperties: false,
        description: `[CRM-P5] §11.2 — الشكل الذي يفتح به العرض المحفوظ.`,
      }),
    ),
    isPinned: t.Optional(t.Boolean()),
    isPublic: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `[CRM-P5] §11.3 — عرضٌ محفوظ لكلّ مستخدم.
النطاق مقصوص عن محرّك العروض المرجعيّ: لا \`group_by\` في v1. والحقول المرنة تُخزَّن
\`Json\` لا أعمدةً: المرشّحات تتبع شاشتها وتتغيّر معها، وعمودٌ لكل مرشّح كان سيجعل كلّ
مرشّحٍ جديد هجرةً.
**\`isPublic\` محروس** (§17.2 صفّ ٢٣): الخاصّ حرٌّ لكلّ عضو، والنشر يحتاج
\`crm_settings.edit\` — لأنّ العرض المنشور حالةٌ مشتركة تظهر على شاشات الزملاء.`,
  },
);

export const CrmSavedViewPlainInputUpdate = t.Object(
  {
    entity: t.Optional(
      t.Union([t.Literal("LEAD"), t.Literal("DEAL")], {
        additionalProperties: false,
        description: `*
* §8.1 — one polymorphic pattern for every activity and the status log.`,
      }),
    ),
    name: t.Optional(t.String()),
    filters: t.Optional(
      t.Any({
        description: `\`{ statusId?, sourceId?, ownerUserId?, from?, to?, search? }\` — شكل مرشّحات الشاشة`,
      }),
    ),
    sort: t.Optional(
      __nullable__(t.Any({ description: `\`{ field, direction }\`` })),
    ),
    visibleColumns: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
    layout: t.Optional(
      t.Union([t.Literal("LIST"), t.Literal("KANBAN")], {
        additionalProperties: false,
        description: `[CRM-P5] §11.2 — الشكل الذي يفتح به العرض المحفوظ.`,
      }),
    ),
    isPinned: t.Optional(t.Boolean()),
    isPublic: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `[CRM-P5] §11.3 — عرضٌ محفوظ لكلّ مستخدم.
النطاق مقصوص عن محرّك العروض المرجعيّ: لا \`group_by\` في v1. والحقول المرنة تُخزَّن
\`Json\` لا أعمدةً: المرشّحات تتبع شاشتها وتتغيّر معها، وعمودٌ لكل مرشّح كان سيجعل كلّ
مرشّحٍ جديد هجرةً.
**\`isPublic\` محروس** (§17.2 صفّ ٢٣): الخاصّ حرٌّ لكلّ عضو، والنشر يحتاج
\`crm_settings.edit\` — لأنّ العرض المنشور حالةٌ مشتركة تظهر على شاشات الزملاء.`,
  },
);

export const CrmSavedViewRelationsInputCreate = t.Object(
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
    description: `[CRM-P5] §11.3 — عرضٌ محفوظ لكلّ مستخدم.
النطاق مقصوص عن محرّك العروض المرجعيّ: لا \`group_by\` في v1. والحقول المرنة تُخزَّن
\`Json\` لا أعمدةً: المرشّحات تتبع شاشتها وتتغيّر معها، وعمودٌ لكل مرشّح كان سيجعل كلّ
مرشّحٍ جديد هجرةً.
**\`isPublic\` محروس** (§17.2 صفّ ٢٣): الخاصّ حرٌّ لكلّ عضو، والنشر يحتاج
\`crm_settings.edit\` — لأنّ العرض المنشور حالةٌ مشتركة تظهر على شاشات الزملاء.`,
  },
);

export const CrmSavedViewRelationsInputUpdate = t.Partial(
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
      description: `[CRM-P5] §11.3 — عرضٌ محفوظ لكلّ مستخدم.
النطاق مقصوص عن محرّك العروض المرجعيّ: لا \`group_by\` في v1. والحقول المرنة تُخزَّن
\`Json\` لا أعمدةً: المرشّحات تتبع شاشتها وتتغيّر معها، وعمودٌ لكل مرشّح كان سيجعل كلّ
مرشّحٍ جديد هجرةً.
**\`isPublic\` محروس** (§17.2 صفّ ٢٣): الخاصّ حرٌّ لكلّ عضو، والنشر يحتاج
\`crm_settings.edit\` — لأنّ العرض المنشور حالةٌ مشتركة تظهر على شاشات الزملاء.`,
    },
  ),
);

export const CrmSavedViewWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          userId: t.String(),
          entity: t.Union([t.Literal("LEAD"), t.Literal("DEAL")], {
            additionalProperties: false,
            description: `*
* §8.1 — one polymorphic pattern for every activity and the status log.`,
          }),
          name: t.String(),
          filters: t.Any({
            description: `\`{ statusId?, sourceId?, ownerUserId?, from?, to?, search? }\` — شكل مرشّحات الشاشة`,
          }),
          sort: t.Any({ description: `\`{ field, direction }\`` }),
          visibleColumns: t.Array(t.String(), { additionalProperties: false }),
          layout: t.Union([t.Literal("LIST"), t.Literal("KANBAN")], {
            additionalProperties: false,
            description: `[CRM-P5] §11.2 — الشكل الذي يفتح به العرض المحفوظ.`,
          }),
          isPinned: t.Boolean(),
          isPublic: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[CRM-P5] §11.3 — عرضٌ محفوظ لكلّ مستخدم.
النطاق مقصوص عن محرّك العروض المرجعيّ: لا \`group_by\` في v1. والحقول المرنة تُخزَّن
\`Json\` لا أعمدةً: المرشّحات تتبع شاشتها وتتغيّر معها، وعمودٌ لكل مرشّح كان سيجعل كلّ
مرشّحٍ جديد هجرةً.
**\`isPublic\` محروس** (§17.2 صفّ ٢٣): الخاصّ حرٌّ لكلّ عضو، والنشر يحتاج
\`crm_settings.edit\` — لأنّ العرض المنشور حالةٌ مشتركة تظهر على شاشات الزملاء.`,
        },
      ),
    { $id: "CrmSavedView" },
  ),
);

export const CrmSavedViewWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `[CRM-P5] §11.3 — عرضٌ محفوظ لكلّ مستخدم.
النطاق مقصوص عن محرّك العروض المرجعيّ: لا \`group_by\` في v1. والحقول المرنة تُخزَّن
\`Json\` لا أعمدةً: المرشّحات تتبع شاشتها وتتغيّر معها، وعمودٌ لكل مرشّح كان سيجعل كلّ
مرشّحٍ جديد هجرةً.
**\`isPublic\` محروس** (§17.2 صفّ ٢٣): الخاصّ حرٌّ لكلّ عضو، والنشر يحتاج
\`crm_settings.edit\` — لأنّ العرض المنشور حالةٌ مشتركة تظهر على شاشات الزملاء.`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union([t.Object({ id: t.String() })], {
          additionalProperties: false,
        }),
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
              userId: t.String(),
              entity: t.Union([t.Literal("LEAD"), t.Literal("DEAL")], {
                additionalProperties: false,
                description: `*
* §8.1 — one polymorphic pattern for every activity and the status log.`,
              }),
              name: t.String(),
              filters: t.Any({
                description: `\`{ statusId?, sourceId?, ownerUserId?, from?, to?, search? }\` — شكل مرشّحات الشاشة`,
              }),
              sort: t.Any({ description: `\`{ field, direction }\`` }),
              visibleColumns: t.Array(t.String(), {
                additionalProperties: false,
              }),
              layout: t.Union([t.Literal("LIST"), t.Literal("KANBAN")], {
                additionalProperties: false,
                description: `[CRM-P5] §11.2 — الشكل الذي يفتح به العرض المحفوظ.`,
              }),
              isPinned: t.Boolean(),
              isPublic: t.Boolean(),
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
  { $id: "CrmSavedView" },
);

export const CrmSavedViewSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      userId: t.Boolean(),
      entity: t.Boolean(),
      name: t.Boolean(),
      filters: t.Boolean(),
      sort: t.Boolean(),
      visibleColumns: t.Boolean(),
      layout: t.Boolean(),
      isPinned: t.Boolean(),
      isPublic: t.Boolean(),
      isDeleted: t.Boolean(),
      deletedAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      user: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[CRM-P5] §11.3 — عرضٌ محفوظ لكلّ مستخدم.
النطاق مقصوص عن محرّك العروض المرجعيّ: لا \`group_by\` في v1. والحقول المرنة تُخزَّن
\`Json\` لا أعمدةً: المرشّحات تتبع شاشتها وتتغيّر معها، وعمودٌ لكل مرشّح كان سيجعل كلّ
مرشّحٍ جديد هجرةً.
**\`isPublic\` محروس** (§17.2 صفّ ٢٣): الخاصّ حرٌّ لكلّ عضو، والنشر يحتاج
\`crm_settings.edit\` — لأنّ العرض المنشور حالةٌ مشتركة تظهر على شاشات الزملاء.`,
    },
  ),
);

export const CrmSavedViewInclude = t.Partial(
  t.Object(
    {
      entity: t.Boolean(),
      layout: t.Boolean(),
      clinic: t.Boolean(),
      user: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[CRM-P5] §11.3 — عرضٌ محفوظ لكلّ مستخدم.
النطاق مقصوص عن محرّك العروض المرجعيّ: لا \`group_by\` في v1. والحقول المرنة تُخزَّن
\`Json\` لا أعمدةً: المرشّحات تتبع شاشتها وتتغيّر معها، وعمودٌ لكل مرشّح كان سيجعل كلّ
مرشّحٍ جديد هجرةً.
**\`isPublic\` محروس** (§17.2 صفّ ٢٣): الخاصّ حرٌّ لكلّ عضو، والنشر يحتاج
\`crm_settings.edit\` — لأنّ العرض المنشور حالةٌ مشتركة تظهر على شاشات الزملاء.`,
    },
  ),
);

export const CrmSavedViewOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      filters: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sort: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      visibleColumns: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isPinned: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isPublic: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `[CRM-P5] §11.3 — عرضٌ محفوظ لكلّ مستخدم.
النطاق مقصوص عن محرّك العروض المرجعيّ: لا \`group_by\` في v1. والحقول المرنة تُخزَّن
\`Json\` لا أعمدةً: المرشّحات تتبع شاشتها وتتغيّر معها، وعمودٌ لكل مرشّح كان سيجعل كلّ
مرشّحٍ جديد هجرةً.
**\`isPublic\` محروس** (§17.2 صفّ ٢٣): الخاصّ حرٌّ لكلّ عضو، والنشر يحتاج
\`crm_settings.edit\` — لأنّ العرض المنشور حالةٌ مشتركة تظهر على شاشات الزملاء.`,
    },
  ),
);

export const CrmSavedView = t.Composite(
  [CrmSavedViewPlain, CrmSavedViewRelations],
  { additionalProperties: false },
);

export const CrmSavedViewInputCreate = t.Composite(
  [CrmSavedViewPlainInputCreate, CrmSavedViewRelationsInputCreate],
  { additionalProperties: false },
);

export const CrmSavedViewInputUpdate = t.Composite(
  [CrmSavedViewPlainInputUpdate, CrmSavedViewRelationsInputUpdate],
  { additionalProperties: false },
);
