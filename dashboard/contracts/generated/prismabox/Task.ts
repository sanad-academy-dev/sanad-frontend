import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TaskPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    code: t.String(),
    title: t.String(),
    content: __nullable__(t.String()),
    type: t.Union(
      [
        t.Literal("ADMINISTRATIVE"),
        t.Literal("PHARMACEUTICALS"),
        t.Literal("INVENTORY"),
        t.Literal("FINANCE"),
        t.Literal("LABORATORY"),
        t.Literal("COSMETICS"),
        t.Literal("MEDICAL"),
      ],
      { additionalProperties: false },
    ),
    status: t.Union(
      [
        t.Literal("PENDING"),
        t.Literal("NOT_YET_STARTED"),
        t.Literal("IN_PROGRESS"),
        t.Literal("COMPLETED"),
        t.Literal("CANCELLED"),
        t.Literal("DUPLICATE"),
        t.Literal("QUEUE"),
      ],
      { additionalProperties: false },
    ),
    priority: t.Union(
      [
        t.Literal("LOW"),
        t.Literal("MEDIUM"),
        t.Literal("HIGH"),
        t.Literal("URGENT"),
      ],
      { additionalProperties: false },
    ),
    createdById: __nullable__(t.String()),
    deadline: __nullable__(t.Date()),
    images: t.Array(t.String(), { additionalProperties: false }),
    declinedAt: __nullable__(t.Date()),
    declineReason: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const TaskRelations = t.Object(
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
    assignees: t.Array(
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
      { additionalProperties: false },
    ),
    createdBy: __nullable__(
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
    subtasks: t.Array(
      t.Object(
        {
          id: t.String(),
          taskId: t.String(),
          title: t.String(),
          isCompleted: t.Boolean(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    activity: t.Array(
      t.Object(
        {
          id: t.String(),
          taskId: t.String(),
          authorUserId: t.String(),
          type: t.Union(
            [
              t.Literal("STATUS_CHANGED"),
              t.Literal("COMMENT"),
              t.Literal("TASK_ACCEPTED"),
              t.Literal("TASK_DECLINED"),
            ],
            { additionalProperties: false },
          ),
          body: __nullable__(t.String()),
          metadata: __nullable__(t.Any()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    inboxItems: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          kind: t.Union([t.Literal("NOTIFICATION"), t.Literal("APPROVAL")], {
            additionalProperties: false,
          }),
          type: t.Union(
            [
              t.Literal("MEMBERSHIP"),
              t.Literal("INSURANCE"),
              t.Literal("LEAD"),
              t.Literal("DEAL"),
              t.Literal("APPOINTMENT_CANCELLED"),
              t.Literal("APPOINTMENT_NEW"),
              t.Literal("APPOINTMENT_PENDING"),
              t.Literal("APPOINTMENT_CONFIRMED"),
              t.Literal("INVOICE"),
              t.Literal("TASK"),
              t.Literal("SYSTEM"),
              t.Literal("LAB"),
              t.Literal("RADIOLOGY"),
              t.Literal("CARE"),
              t.Literal("STOCK"),
              t.Literal("MENTION"),
              t.Literal("OPERATION"),
              t.Literal("VACCINATION"),
              t.Literal("GROOMING"),
              t.Literal("INPATIENT"),
              t.Literal("TRIAGE"),
            ],
            { additionalProperties: false },
          ),
          title: t.String(),
          importance: t.Union(
            [t.Literal("LOW"), t.Literal("NORMAL"), t.Literal("HIGH")],
            { additionalProperties: false },
          ),
          status: t.Union(
            [t.Literal("DRAFT"), t.Literal("OPEN"), t.Literal("RESOLVED")],
            { additionalProperties: false },
          ),
          approvalStatus: __nullable__(
            t.Union(
              [
                t.Literal("PENDING"),
                t.Literal("ACCEPTED"),
                t.Literal("REJECTED"),
              ],
              { additionalProperties: false },
            ),
          ),
          patientId: __nullable__(t.String()),
          ownerId: __nullable__(t.String()),
          staffId: __nullable__(t.String()),
          appointmentId: __nullable__(t.String()),
          taskId: __nullable__(t.String()),
          conversationId: __nullable__(t.String()),
          operationId: __nullable__(t.String()),
          groomingSessionId: __nullable__(t.String()),
          leadId: __nullable__(t.String()),
          dealId: __nullable__(t.String()),
          inpatientStayId: __nullable__(t.String()),
          recipientUserId: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const TaskPlainInputCreate = t.Object(
  {
    code: t.String(),
    title: t.String(),
    content: t.Optional(__nullable__(t.String())),
    type: t.Union(
      [
        t.Literal("ADMINISTRATIVE"),
        t.Literal("PHARMACEUTICALS"),
        t.Literal("INVENTORY"),
        t.Literal("FINANCE"),
        t.Literal("LABORATORY"),
        t.Literal("COSMETICS"),
        t.Literal("MEDICAL"),
      ],
      { additionalProperties: false },
    ),
    status: t.Optional(
      t.Union(
        [
          t.Literal("PENDING"),
          t.Literal("NOT_YET_STARTED"),
          t.Literal("IN_PROGRESS"),
          t.Literal("COMPLETED"),
          t.Literal("CANCELLED"),
          t.Literal("DUPLICATE"),
          t.Literal("QUEUE"),
        ],
        { additionalProperties: false },
      ),
    ),
    priority: t.Union(
      [
        t.Literal("LOW"),
        t.Literal("MEDIUM"),
        t.Literal("HIGH"),
        t.Literal("URGENT"),
      ],
      { additionalProperties: false },
    ),
    deadline: t.Optional(__nullable__(t.Date())),
    images: t.Array(t.String(), { additionalProperties: false }),
    declinedAt: t.Optional(__nullable__(t.Date())),
    declineReason: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const TaskPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    title: t.Optional(t.String()),
    content: t.Optional(__nullable__(t.String())),
    type: t.Optional(
      t.Union(
        [
          t.Literal("ADMINISTRATIVE"),
          t.Literal("PHARMACEUTICALS"),
          t.Literal("INVENTORY"),
          t.Literal("FINANCE"),
          t.Literal("LABORATORY"),
          t.Literal("COSMETICS"),
          t.Literal("MEDICAL"),
        ],
        { additionalProperties: false },
      ),
    ),
    status: t.Optional(
      t.Union(
        [
          t.Literal("PENDING"),
          t.Literal("NOT_YET_STARTED"),
          t.Literal("IN_PROGRESS"),
          t.Literal("COMPLETED"),
          t.Literal("CANCELLED"),
          t.Literal("DUPLICATE"),
          t.Literal("QUEUE"),
        ],
        { additionalProperties: false },
      ),
    ),
    priority: t.Optional(
      t.Union(
        [
          t.Literal("LOW"),
          t.Literal("MEDIUM"),
          t.Literal("HIGH"),
          t.Literal("URGENT"),
        ],
        { additionalProperties: false },
      ),
    ),
    deadline: t.Optional(__nullable__(t.Date())),
    images: t.Optional(t.Array(t.String(), { additionalProperties: false })),
    declinedAt: t.Optional(__nullable__(t.Date())),
    declineReason: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const TaskRelationsInputCreate = t.Object(
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
    assignees: t.Optional(
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
    createdBy: t.Optional(
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
    subtasks: t.Optional(
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
    activity: t.Optional(
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
    inboxItems: t.Optional(
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
  { additionalProperties: false },
);

export const TaskRelationsInputUpdate = t.Partial(
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
      assignees: t.Partial(
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
      createdBy: t.Partial(
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
      subtasks: t.Partial(
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
      activity: t.Partial(
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
      inboxItems: t.Partial(
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
    { additionalProperties: false },
  ),
);

export const TaskWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          code: t.String(),
          title: t.String(),
          content: t.String(),
          type: t.Union(
            [
              t.Literal("ADMINISTRATIVE"),
              t.Literal("PHARMACEUTICALS"),
              t.Literal("INVENTORY"),
              t.Literal("FINANCE"),
              t.Literal("LABORATORY"),
              t.Literal("COSMETICS"),
              t.Literal("MEDICAL"),
            ],
            { additionalProperties: false },
          ),
          status: t.Union(
            [
              t.Literal("PENDING"),
              t.Literal("NOT_YET_STARTED"),
              t.Literal("IN_PROGRESS"),
              t.Literal("COMPLETED"),
              t.Literal("CANCELLED"),
              t.Literal("DUPLICATE"),
              t.Literal("QUEUE"),
            ],
            { additionalProperties: false },
          ),
          priority: t.Union(
            [
              t.Literal("LOW"),
              t.Literal("MEDIUM"),
              t.Literal("HIGH"),
              t.Literal("URGENT"),
            ],
            { additionalProperties: false },
          ),
          createdById: t.String(),
          deadline: t.Date(),
          images: t.Array(t.String(), { additionalProperties: false }),
          declinedAt: t.Date(),
          declineReason: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Task" },
  ),
);

export const TaskWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), code: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ code: t.String() })],
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
              code: t.String(),
              title: t.String(),
              content: t.String(),
              type: t.Union(
                [
                  t.Literal("ADMINISTRATIVE"),
                  t.Literal("PHARMACEUTICALS"),
                  t.Literal("INVENTORY"),
                  t.Literal("FINANCE"),
                  t.Literal("LABORATORY"),
                  t.Literal("COSMETICS"),
                  t.Literal("MEDICAL"),
                ],
                { additionalProperties: false },
              ),
              status: t.Union(
                [
                  t.Literal("PENDING"),
                  t.Literal("NOT_YET_STARTED"),
                  t.Literal("IN_PROGRESS"),
                  t.Literal("COMPLETED"),
                  t.Literal("CANCELLED"),
                  t.Literal("DUPLICATE"),
                  t.Literal("QUEUE"),
                ],
                { additionalProperties: false },
              ),
              priority: t.Union(
                [
                  t.Literal("LOW"),
                  t.Literal("MEDIUM"),
                  t.Literal("HIGH"),
                  t.Literal("URGENT"),
                ],
                { additionalProperties: false },
              ),
              createdById: t.String(),
              deadline: t.Date(),
              images: t.Array(t.String(), { additionalProperties: false }),
              declinedAt: t.Date(),
              declineReason: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Task" },
);

export const TaskSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      code: t.Boolean(),
      title: t.Boolean(),
      content: t.Boolean(),
      type: t.Boolean(),
      status: t.Boolean(),
      priority: t.Boolean(),
      createdById: t.Boolean(),
      deadline: t.Boolean(),
      images: t.Boolean(),
      declinedAt: t.Boolean(),
      declineReason: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      assignees: t.Boolean(),
      createdBy: t.Boolean(),
      subtasks: t.Boolean(),
      activity: t.Boolean(),
      inboxItems: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const TaskInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      status: t.Boolean(),
      priority: t.Boolean(),
      clinic: t.Boolean(),
      assignees: t.Boolean(),
      createdBy: t.Boolean(),
      subtasks: t.Boolean(),
      activity: t.Boolean(),
      inboxItems: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const TaskOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      code: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      title: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      content: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      deadline: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      images: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      declinedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      declineReason: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Task = t.Composite([TaskPlain, TaskRelations], {
  additionalProperties: false,
});

export const TaskInputCreate = t.Composite(
  [TaskPlainInputCreate, TaskRelationsInputCreate],
  { additionalProperties: false },
);

export const TaskInputUpdate = t.Composite(
  [TaskPlainInputUpdate, TaskRelationsInputUpdate],
  { additionalProperties: false },
);
