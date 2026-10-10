import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PermissionAuditLogPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    actorId: __nullable__(
      t.String({ description: `null = النظام (مهمة خلفية أو ترحيل)` }),
    ),
    action: t.String({
      description: `"role.grant" | "role.revoke" | "staff.assign" | "role.super_admin" …`,
    }),
    roleId: __nullable__(t.String()),
    staffId: __nullable__(t.String()),
    before: __nullable__(t.Any()),
    after: __nullable__(t.Any()),
    createdAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `[RBAC P1] سجلّ تدقيق كل تغيير على السلطة: منح، سحب، إسناد دور، رفع/خفض مدير النظام.
لا يوجد اليوم أيّ سجلّ لتغيّرات الصلاحيات في المخطط — فمن رفع نفسه مديرًا لا يترك أثرًا.`,
  },
);

export const PermissionAuditLogRelations = t.Object(
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
  },
  {
    additionalProperties: false,
    description: `[RBAC P1] سجلّ تدقيق كل تغيير على السلطة: منح، سحب، إسناد دور، رفع/خفض مدير النظام.
لا يوجد اليوم أيّ سجلّ لتغيّرات الصلاحيات في المخطط — فمن رفع نفسه مديرًا لا يترك أثرًا.`,
  },
);

export const PermissionAuditLogPlainInputCreate = t.Object(
  {
    action: t.String({
      description: `"role.grant" | "role.revoke" | "staff.assign" | "role.super_admin" …`,
    }),
    before: t.Optional(__nullable__(t.Any())),
    after: t.Optional(__nullable__(t.Any())),
  },
  {
    additionalProperties: false,
    description: `[RBAC P1] سجلّ تدقيق كل تغيير على السلطة: منح، سحب، إسناد دور، رفع/خفض مدير النظام.
لا يوجد اليوم أيّ سجلّ لتغيّرات الصلاحيات في المخطط — فمن رفع نفسه مديرًا لا يترك أثرًا.`,
  },
);

export const PermissionAuditLogPlainInputUpdate = t.Object(
  {
    action: t.Optional(
      t.String({
        description: `"role.grant" | "role.revoke" | "staff.assign" | "role.super_admin" …`,
      }),
    ),
    before: t.Optional(__nullable__(t.Any())),
    after: t.Optional(__nullable__(t.Any())),
  },
  {
    additionalProperties: false,
    description: `[RBAC P1] سجلّ تدقيق كل تغيير على السلطة: منح، سحب، إسناد دور، رفع/خفض مدير النظام.
لا يوجد اليوم أيّ سجلّ لتغيّرات الصلاحيات في المخطط — فمن رفع نفسه مديرًا لا يترك أثرًا.`,
  },
);

export const PermissionAuditLogRelationsInputCreate = t.Object(
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
  },
  {
    additionalProperties: false,
    description: `[RBAC P1] سجلّ تدقيق كل تغيير على السلطة: منح، سحب، إسناد دور، رفع/خفض مدير النظام.
لا يوجد اليوم أيّ سجلّ لتغيّرات الصلاحيات في المخطط — فمن رفع نفسه مديرًا لا يترك أثرًا.`,
  },
);

export const PermissionAuditLogRelationsInputUpdate = t.Partial(
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
    },
    {
      additionalProperties: false,
      description: `[RBAC P1] سجلّ تدقيق كل تغيير على السلطة: منح، سحب، إسناد دور، رفع/خفض مدير النظام.
لا يوجد اليوم أيّ سجلّ لتغيّرات الصلاحيات في المخطط — فمن رفع نفسه مديرًا لا يترك أثرًا.`,
    },
  ),
);

export const PermissionAuditLogWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          actorId: t.String({
            description: `null = النظام (مهمة خلفية أو ترحيل)`,
          }),
          action: t.String({
            description: `"role.grant" | "role.revoke" | "staff.assign" | "role.super_admin" …`,
          }),
          roleId: t.String(),
          staffId: t.String(),
          before: t.Any(),
          after: t.Any(),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[RBAC P1] سجلّ تدقيق كل تغيير على السلطة: منح، سحب، إسناد دور، رفع/خفض مدير النظام.
لا يوجد اليوم أيّ سجلّ لتغيّرات الصلاحيات في المخطط — فمن رفع نفسه مديرًا لا يترك أثرًا.`,
        },
      ),
    { $id: "PermissionAuditLog" },
  ),
);

export const PermissionAuditLogWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `[RBAC P1] سجلّ تدقيق كل تغيير على السلطة: منح، سحب، إسناد دور، رفع/خفض مدير النظام.
لا يوجد اليوم أيّ سجلّ لتغيّرات الصلاحيات في المخطط — فمن رفع نفسه مديرًا لا يترك أثرًا.`,
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
              actorId: t.String({
                description: `null = النظام (مهمة خلفية أو ترحيل)`,
              }),
              action: t.String({
                description: `"role.grant" | "role.revoke" | "staff.assign" | "role.super_admin" …`,
              }),
              roleId: t.String(),
              staffId: t.String(),
              before: t.Any(),
              after: t.Any(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PermissionAuditLog" },
);

export const PermissionAuditLogSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      actorId: t.Boolean(),
      action: t.Boolean(),
      roleId: t.Boolean(),
      staffId: t.Boolean(),
      before: t.Boolean(),
      after: t.Boolean(),
      createdAt: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[RBAC P1] سجلّ تدقيق كل تغيير على السلطة: منح، سحب، إسناد دور، رفع/خفض مدير النظام.
لا يوجد اليوم أيّ سجلّ لتغيّرات الصلاحيات في المخطط — فمن رفع نفسه مديرًا لا يترك أثرًا.`,
    },
  ),
);

export const PermissionAuditLogInclude = t.Partial(
  t.Object(
    { clinic: t.Boolean(), _count: t.Boolean() },
    {
      additionalProperties: false,
      description: `[RBAC P1] سجلّ تدقيق كل تغيير على السلطة: منح، سحب، إسناد دور، رفع/خفض مدير النظام.
لا يوجد اليوم أيّ سجلّ لتغيّرات الصلاحيات في المخطط — فمن رفع نفسه مديرًا لا يترك أثرًا.`,
    },
  ),
);

export const PermissionAuditLogOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      actorId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      action: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      roleId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      staffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      before: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      after: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `[RBAC P1] سجلّ تدقيق كل تغيير على السلطة: منح، سحب، إسناد دور، رفع/خفض مدير النظام.
لا يوجد اليوم أيّ سجلّ لتغيّرات الصلاحيات في المخطط — فمن رفع نفسه مديرًا لا يترك أثرًا.`,
    },
  ),
);

export const PermissionAuditLog = t.Composite(
  [PermissionAuditLogPlain, PermissionAuditLogRelations],
  { additionalProperties: false },
);

export const PermissionAuditLogInputCreate = t.Composite(
  [PermissionAuditLogPlainInputCreate, PermissionAuditLogRelationsInputCreate],
  { additionalProperties: false },
);

export const PermissionAuditLogInputUpdate = t.Composite(
  [PermissionAuditLogPlainInputUpdate, PermissionAuditLogRelationsInputUpdate],
  { additionalProperties: false },
);
