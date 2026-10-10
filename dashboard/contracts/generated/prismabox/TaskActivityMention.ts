import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TaskActivityMentionPlain = t.Object(
  {
    id: t.String(),
    activityId: t.String(),
    staffId: t.String(),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const TaskActivityMentionRelations = t.Object(
  {
    activity: t.Object(
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
    staff: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        userId: __nullable__(t.String()),
        roleId: t.String(),
        branchId: t.String(),
        name: t.String(),
        gender: __nullable__(
          t.Union(
            [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
            { additionalProperties: false },
          ),
        ),
        prefix: __nullable__(
          t.Union(
            [
              t.Literal("MR"),
              t.Literal("MRS"),
              t.Literal("MS"),
              t.Literal("DR"),
              t.Literal("PROF"),
            ],
            { additionalProperties: false },
          ),
        ),
        age: __nullable__(t.Integer()),
        licenseNumber: __nullable__(t.String()),
        email: t.String(),
        phone: __nullable__(t.String()),
        country: __nullable__(t.String()),
        city: __nullable__(t.String()),
        address: __nullable__(t.String()),
        notes: __nullable__(t.String()),
        bio: __nullable__(t.String()),
        educationalQualification: __nullable__(t.String()),
        nationality: __nullable__(t.String()),
        avatar: __nullable__(t.String()),
        primarySpecializationId: __nullable__(t.String()),
        secondarySpecializationId: __nullable__(t.String()),
        employmentType: __nullable__(
          t.Union([t.Literal("FULL_TIME"), t.Literal("PART_TIME")], {
            additionalProperties: false,
          }),
        ),
        hireDate: __nullable__(t.Date()),
        isSaudi: t.Boolean(),
        status: t.Union(
          [t.Literal("PENDING"), t.Literal("ACTIVE"), t.Literal("INACTIVE")],
          { additionalProperties: false },
        ),
        active: t.Boolean(),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const TaskActivityMentionPlainInputCreate = t.Object(
  {},
  { additionalProperties: false },
);

export const TaskActivityMentionPlainInputUpdate = t.Object(
  {},
  { additionalProperties: false },
);

export const TaskActivityMentionRelationsInputCreate = t.Object(
  {
    activity: t.Object(
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
    staff: t.Object(
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

export const TaskActivityMentionRelationsInputUpdate = t.Partial(
  t.Object(
    {
      activity: t.Object(
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
      staff: t.Object(
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

export const TaskActivityMentionWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          activityId: t.String(),
          staffId: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "TaskActivityMention" },
  ),
);

export const TaskActivityMentionWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              activityId_staffId: t.Object(
                { activityId: t.String(), staffId: t.String() },
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
              activityId_staffId: t.Object(
                { activityId: t.String(), staffId: t.String() },
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
              activityId: t.String(),
              staffId: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "TaskActivityMention" },
);

export const TaskActivityMentionSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      activityId: t.Boolean(),
      staffId: t.Boolean(),
      createdAt: t.Boolean(),
      activity: t.Boolean(),
      staff: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const TaskActivityMentionInclude = t.Partial(
  t.Object(
    { activity: t.Boolean(), staff: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const TaskActivityMentionOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      activityId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      staffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const TaskActivityMention = t.Composite(
  [TaskActivityMentionPlain, TaskActivityMentionRelations],
  { additionalProperties: false },
);

export const TaskActivityMentionInputCreate = t.Composite(
  [
    TaskActivityMentionPlainInputCreate,
    TaskActivityMentionRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const TaskActivityMentionInputUpdate = t.Composite(
  [
    TaskActivityMentionPlainInputUpdate,
    TaskActivityMentionRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
