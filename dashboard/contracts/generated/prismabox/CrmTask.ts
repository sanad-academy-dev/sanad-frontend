import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CrmTaskPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    referenceType: t.Union([t.Literal("LEAD"), t.Literal("DEAL")], {
      additionalProperties: false,
      description: `*
* §8.1 — one polymorphic pattern for every activity and the status log.`,
    }),
    referenceId: t.String(),
    title: t.String(),
    description: __nullable__(t.String()),
    priority: t.Union(
      [t.Literal("LOW"), t.Literal("MEDIUM"), t.Literal("HIGH")],
      { additionalProperties: false },
    ),
    status: t.Union(
      [
        t.Literal("BACKLOG"),
        t.Literal("TODO"),
        t.Literal("IN_PROGRESS"),
        t.Literal("DONE"),
        t.Literal("CANCELLED"),
      ],
      { additionalProperties: false },
    ),
    dueAt: __nullable__(t.Date()),
    overdueNotifiedAt: __nullable__(
      t.Date({
        description: `[CRM-P6] §8.2 — لحظة إرسال إشعار التأخّر، ووظيفتها **منع الثاني**: المهمة المتأخّرة
تبقى متأخّرة كل ليلة، وبلا هذا العمود يصير التذكير اليوميّ إزعاجًا يُتجاهَل — وأوّل
ما يُتجاهَل هو ما كان يجب أن يُقرأ. نفس مذهب \`slaStatus\` في §10.4.`,
      }),
    ),
    assignedToUserId: __nullable__(t.String()),
    isDeleted: t.Boolean(),
    deletedAt: __nullable__(t.Date()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `§8.2 — مهمة. الاسم \`CrmTask\` لأنّ \`Task\` مأخوذ لمهام العيادة العامة، وهما كيانان
مختلفان: هذه مربوطة بعميل محتمل/صفقة عبر نمط §8.1.`,
  },
);

export const CrmTaskRelations = t.Object(
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
    assignedTo: __nullable__(
      t.Object(
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
    ),
  },
  {
    additionalProperties: false,
    description: `§8.2 — مهمة. الاسم \`CrmTask\` لأنّ \`Task\` مأخوذ لمهام العيادة العامة، وهما كيانان
مختلفان: هذه مربوطة بعميل محتمل/صفقة عبر نمط §8.1.`,
  },
);

export const CrmTaskPlainInputCreate = t.Object(
  {
    referenceType: t.Union([t.Literal("LEAD"), t.Literal("DEAL")], {
      additionalProperties: false,
      description: `*
* §8.1 — one polymorphic pattern for every activity and the status log.`,
    }),
    title: t.String(),
    description: t.Optional(__nullable__(t.String())),
    priority: t.Optional(
      t.Union([t.Literal("LOW"), t.Literal("MEDIUM"), t.Literal("HIGH")], {
        additionalProperties: false,
      }),
    ),
    status: t.Optional(
      t.Union(
        [
          t.Literal("BACKLOG"),
          t.Literal("TODO"),
          t.Literal("IN_PROGRESS"),
          t.Literal("DONE"),
          t.Literal("CANCELLED"),
        ],
        { additionalProperties: false },
      ),
    ),
    dueAt: t.Optional(__nullable__(t.Date())),
    overdueNotifiedAt: t.Optional(
      __nullable__(
        t.Date({
          description: `[CRM-P6] §8.2 — لحظة إرسال إشعار التأخّر، ووظيفتها **منع الثاني**: المهمة المتأخّرة
تبقى متأخّرة كل ليلة، وبلا هذا العمود يصير التذكير اليوميّ إزعاجًا يُتجاهَل — وأوّل
ما يُتجاهَل هو ما كان يجب أن يُقرأ. نفس مذهب \`slaStatus\` في §10.4.`,
        }),
      ),
    ),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `§8.2 — مهمة. الاسم \`CrmTask\` لأنّ \`Task\` مأخوذ لمهام العيادة العامة، وهما كيانان
مختلفان: هذه مربوطة بعميل محتمل/صفقة عبر نمط §8.1.`,
  },
);

export const CrmTaskPlainInputUpdate = t.Object(
  {
    referenceType: t.Optional(
      t.Union([t.Literal("LEAD"), t.Literal("DEAL")], {
        additionalProperties: false,
        description: `*
* §8.1 — one polymorphic pattern for every activity and the status log.`,
      }),
    ),
    title: t.Optional(t.String()),
    description: t.Optional(__nullable__(t.String())),
    priority: t.Optional(
      t.Union([t.Literal("LOW"), t.Literal("MEDIUM"), t.Literal("HIGH")], {
        additionalProperties: false,
      }),
    ),
    status: t.Optional(
      t.Union(
        [
          t.Literal("BACKLOG"),
          t.Literal("TODO"),
          t.Literal("IN_PROGRESS"),
          t.Literal("DONE"),
          t.Literal("CANCELLED"),
        ],
        { additionalProperties: false },
      ),
    ),
    dueAt: t.Optional(__nullable__(t.Date())),
    overdueNotifiedAt: t.Optional(
      __nullable__(
        t.Date({
          description: `[CRM-P6] §8.2 — لحظة إرسال إشعار التأخّر، ووظيفتها **منع الثاني**: المهمة المتأخّرة
تبقى متأخّرة كل ليلة، وبلا هذا العمود يصير التذكير اليوميّ إزعاجًا يُتجاهَل — وأوّل
ما يُتجاهَل هو ما كان يجب أن يُقرأ. نفس مذهب \`slaStatus\` في §10.4.`,
        }),
      ),
    ),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `§8.2 — مهمة. الاسم \`CrmTask\` لأنّ \`Task\` مأخوذ لمهام العيادة العامة، وهما كيانان
مختلفان: هذه مربوطة بعميل محتمل/صفقة عبر نمط §8.1.`,
  },
);

export const CrmTaskRelationsInputCreate = t.Object(
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
    assignedTo: t.Optional(
      t.Object(
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
    ),
  },
  {
    additionalProperties: false,
    description: `§8.2 — مهمة. الاسم \`CrmTask\` لأنّ \`Task\` مأخوذ لمهام العيادة العامة، وهما كيانان
مختلفان: هذه مربوطة بعميل محتمل/صفقة عبر نمط §8.1.`,
  },
);

export const CrmTaskRelationsInputUpdate = t.Partial(
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
      assignedTo: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
      ),
    },
    {
      additionalProperties: false,
      description: `§8.2 — مهمة. الاسم \`CrmTask\` لأنّ \`Task\` مأخوذ لمهام العيادة العامة، وهما كيانان
مختلفان: هذه مربوطة بعميل محتمل/صفقة عبر نمط §8.1.`,
    },
  ),
);

export const CrmTaskWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          referenceType: t.Union([t.Literal("LEAD"), t.Literal("DEAL")], {
            additionalProperties: false,
            description: `*
* §8.1 — one polymorphic pattern for every activity and the status log.`,
          }),
          referenceId: t.String(),
          title: t.String(),
          description: t.String(),
          priority: t.Union(
            [t.Literal("LOW"), t.Literal("MEDIUM"), t.Literal("HIGH")],
            { additionalProperties: false },
          ),
          status: t.Union(
            [
              t.Literal("BACKLOG"),
              t.Literal("TODO"),
              t.Literal("IN_PROGRESS"),
              t.Literal("DONE"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          dueAt: t.Date(),
          overdueNotifiedAt: t.Date({
            description: `[CRM-P6] §8.2 — لحظة إرسال إشعار التأخّر، ووظيفتها **منع الثاني**: المهمة المتأخّرة
تبقى متأخّرة كل ليلة، وبلا هذا العمود يصير التذكير اليوميّ إزعاجًا يُتجاهَل — وأوّل
ما يُتجاهَل هو ما كان يجب أن يُقرأ. نفس مذهب \`slaStatus\` في §10.4.`,
          }),
          assignedToUserId: t.String(),
          isDeleted: t.Boolean(),
          deletedAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `§8.2 — مهمة. الاسم \`CrmTask\` لأنّ \`Task\` مأخوذ لمهام العيادة العامة، وهما كيانان
مختلفان: هذه مربوطة بعميل محتمل/صفقة عبر نمط §8.1.`,
        },
      ),
    { $id: "CrmTask" },
  ),
);

export const CrmTaskWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `§8.2 — مهمة. الاسم \`CrmTask\` لأنّ \`Task\` مأخوذ لمهام العيادة العامة، وهما كيانان
مختلفان: هذه مربوطة بعميل محتمل/صفقة عبر نمط §8.1.`,
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
              referenceType: t.Union([t.Literal("LEAD"), t.Literal("DEAL")], {
                additionalProperties: false,
                description: `*
* §8.1 — one polymorphic pattern for every activity and the status log.`,
              }),
              referenceId: t.String(),
              title: t.String(),
              description: t.String(),
              priority: t.Union(
                [t.Literal("LOW"), t.Literal("MEDIUM"), t.Literal("HIGH")],
                { additionalProperties: false },
              ),
              status: t.Union(
                [
                  t.Literal("BACKLOG"),
                  t.Literal("TODO"),
                  t.Literal("IN_PROGRESS"),
                  t.Literal("DONE"),
                  t.Literal("CANCELLED"),
                ],
                { additionalProperties: false },
              ),
              dueAt: t.Date(),
              overdueNotifiedAt: t.Date({
                description: `[CRM-P6] §8.2 — لحظة إرسال إشعار التأخّر، ووظيفتها **منع الثاني**: المهمة المتأخّرة
تبقى متأخّرة كل ليلة، وبلا هذا العمود يصير التذكير اليوميّ إزعاجًا يُتجاهَل — وأوّل
ما يُتجاهَل هو ما كان يجب أن يُقرأ. نفس مذهب \`slaStatus\` في §10.4.`,
              }),
              assignedToUserId: t.String(),
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
  { $id: "CrmTask" },
);

export const CrmTaskSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      referenceType: t.Boolean(),
      referenceId: t.Boolean(),
      title: t.Boolean(),
      description: t.Boolean(),
      priority: t.Boolean(),
      status: t.Boolean(),
      dueAt: t.Boolean(),
      overdueNotifiedAt: t.Boolean(),
      assignedToUserId: t.Boolean(),
      isDeleted: t.Boolean(),
      deletedAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      assignedTo: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `§8.2 — مهمة. الاسم \`CrmTask\` لأنّ \`Task\` مأخوذ لمهام العيادة العامة، وهما كيانان
مختلفان: هذه مربوطة بعميل محتمل/صفقة عبر نمط §8.1.`,
    },
  ),
);

export const CrmTaskInclude = t.Partial(
  t.Object(
    {
      referenceType: t.Boolean(),
      priority: t.Boolean(),
      status: t.Boolean(),
      clinic: t.Boolean(),
      assignedTo: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `§8.2 — مهمة. الاسم \`CrmTask\` لأنّ \`Task\` مأخوذ لمهام العيادة العامة، وهما كيانان
مختلفان: هذه مربوطة بعميل محتمل/صفقة عبر نمط §8.1.`,
    },
  ),
);

export const CrmTaskOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      referenceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      title: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dueAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      overdueNotifiedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      assignedToUserId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `§8.2 — مهمة. الاسم \`CrmTask\` لأنّ \`Task\` مأخوذ لمهام العيادة العامة، وهما كيانان
مختلفان: هذه مربوطة بعميل محتمل/صفقة عبر نمط §8.1.`,
    },
  ),
);

export const CrmTask = t.Composite([CrmTaskPlain, CrmTaskRelations], {
  additionalProperties: false,
});

export const CrmTaskInputCreate = t.Composite(
  [CrmTaskPlainInputCreate, CrmTaskRelationsInputCreate],
  { additionalProperties: false },
);

export const CrmTaskInputUpdate = t.Composite(
  [CrmTaskPlainInputUpdate, CrmTaskRelationsInputUpdate],
  { additionalProperties: false },
);
