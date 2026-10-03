import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const StaffRoleAssignmentPlain = t.Object(
  {
    id: t.String(),
    staffId: t.String(),
    roleId: t.String(),
    clinicId: t.String({
      description: `مُزال التطبيع لتقييد التفرّد داخل المستأجر`,
    }),
    isPrimary: t.Boolean(),
    assignedById: __nullable__(t.String()),
    assignedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `[RBAC P1 · القرار D1] إسناد الأدوار — موظّف واحد يحمل عدّة أدوار، وصلاحياته الفعلية
**اتّحاد** منحها (الأوسع نطاقًا يفوز). \`Staff.roleId\` يبقى الدور الأساسي كي تستمرّ
استهدافات الرواتب والدورات والاختبارات بلا تعديل.`,
  },
);

export const StaffRoleAssignmentRelations = t.Object(
  {
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
    role: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        name: t.String(),
        description: __nullable__(t.String()),
        isSuperAdmin: t.Boolean({
          description: `[RBAC D4] يتجاوز كل فحوص الصلاحيات. يُقيَّم قبل أيّ بحث في السجلّ، فلا يمكن
لإدخال خاطئ في سجلّ الموارد أن يقفل الباب على مدير النظام (درس P12A).`,
        }),
        isSystem: t.Boolean({
          description: `دور مُدمَج تُنشئه التهيئة الأولى — لا يُحذف ولا يُعاد تسميته. يحلّ محلّ مقارنة
الاسم العربي «مدير النظام» التي كانت تحرس الدور نصًّا.`,
        }),
        permissions: t.Array(
          t.String({
            description: `[RBAC] العمود القديم — منح مسطَّحة بلا نطاق. يبقى خلال الترحيل مصدرًا للتعبئة
الرجعية فقط، ويُسقَط في P7 بعد التحقّق من \`role_permission\`.`,
          }),
          { additionalProperties: false },
        ),
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
  {
    additionalProperties: false,
    description: `[RBAC P1 · القرار D1] إسناد الأدوار — موظّف واحد يحمل عدّة أدوار، وصلاحياته الفعلية
**اتّحاد** منحها (الأوسع نطاقًا يفوز). \`Staff.roleId\` يبقى الدور الأساسي كي تستمرّ
استهدافات الرواتب والدورات والاختبارات بلا تعديل.`,
  },
);

export const StaffRoleAssignmentPlainInputCreate = t.Object(
  { isPrimary: t.Optional(t.Boolean()), assignedAt: t.Optional(t.Date()) },
  {
    additionalProperties: false,
    description: `[RBAC P1 · القرار D1] إسناد الأدوار — موظّف واحد يحمل عدّة أدوار، وصلاحياته الفعلية
**اتّحاد** منحها (الأوسع نطاقًا يفوز). \`Staff.roleId\` يبقى الدور الأساسي كي تستمرّ
استهدافات الرواتب والدورات والاختبارات بلا تعديل.`,
  },
);

export const StaffRoleAssignmentPlainInputUpdate = t.Object(
  { isPrimary: t.Optional(t.Boolean()), assignedAt: t.Optional(t.Date()) },
  {
    additionalProperties: false,
    description: `[RBAC P1 · القرار D1] إسناد الأدوار — موظّف واحد يحمل عدّة أدوار، وصلاحياته الفعلية
**اتّحاد** منحها (الأوسع نطاقًا يفوز). \`Staff.roleId\` يبقى الدور الأساسي كي تستمرّ
استهدافات الرواتب والدورات والاختبارات بلا تعديل.`,
  },
);

export const StaffRoleAssignmentRelationsInputCreate = t.Object(
  {
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
    role: t.Object(
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
  {
    additionalProperties: false,
    description: `[RBAC P1 · القرار D1] إسناد الأدوار — موظّف واحد يحمل عدّة أدوار، وصلاحياته الفعلية
**اتّحاد** منحها (الأوسع نطاقًا يفوز). \`Staff.roleId\` يبقى الدور الأساسي كي تستمرّ
استهدافات الرواتب والدورات والاختبارات بلا تعديل.`,
  },
);

export const StaffRoleAssignmentRelationsInputUpdate = t.Partial(
  t.Object(
    {
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
      role: t.Object(
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
    {
      additionalProperties: false,
      description: `[RBAC P1 · القرار D1] إسناد الأدوار — موظّف واحد يحمل عدّة أدوار، وصلاحياته الفعلية
**اتّحاد** منحها (الأوسع نطاقًا يفوز). \`Staff.roleId\` يبقى الدور الأساسي كي تستمرّ
استهدافات الرواتب والدورات والاختبارات بلا تعديل.`,
    },
  ),
);

export const StaffRoleAssignmentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          staffId: t.String(),
          roleId: t.String(),
          clinicId: t.String({
            description: `مُزال التطبيع لتقييد التفرّد داخل المستأجر`,
          }),
          isPrimary: t.Boolean(),
          assignedById: t.String(),
          assignedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[RBAC P1 · القرار D1] إسناد الأدوار — موظّف واحد يحمل عدّة أدوار، وصلاحياته الفعلية
**اتّحاد** منحها (الأوسع نطاقًا يفوز). \`Staff.roleId\` يبقى الدور الأساسي كي تستمرّ
استهدافات الرواتب والدورات والاختبارات بلا تعديل.`,
        },
      ),
    { $id: "StaffRoleAssignment" },
  ),
);

export const StaffRoleAssignmentWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              staffId_roleId: t.Object(
                { staffId: t.String(), roleId: t.String() },
                { additionalProperties: false },
              ),
            },
            {
              additionalProperties: false,
              description: `[RBAC P1 · القرار D1] إسناد الأدوار — موظّف واحد يحمل عدّة أدوار، وصلاحياته الفعلية
**اتّحاد** منحها (الأوسع نطاقًا يفوز). \`Staff.roleId\` يبقى الدور الأساسي كي تستمرّ
استهدافات الرواتب والدورات والاختبارات بلا تعديل.`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              staffId_roleId: t.Object(
                { staffId: t.String(), roleId: t.String() },
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
              staffId: t.String(),
              roleId: t.String(),
              clinicId: t.String({
                description: `مُزال التطبيع لتقييد التفرّد داخل المستأجر`,
              }),
              isPrimary: t.Boolean(),
              assignedById: t.String(),
              assignedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "StaffRoleAssignment" },
);

export const StaffRoleAssignmentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      staffId: t.Boolean(),
      roleId: t.Boolean(),
      clinicId: t.Boolean(),
      isPrimary: t.Boolean(),
      assignedById: t.Boolean(),
      assignedAt: t.Boolean(),
      staff: t.Boolean(),
      role: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[RBAC P1 · القرار D1] إسناد الأدوار — موظّف واحد يحمل عدّة أدوار، وصلاحياته الفعلية
**اتّحاد** منحها (الأوسع نطاقًا يفوز). \`Staff.roleId\` يبقى الدور الأساسي كي تستمرّ
استهدافات الرواتب والدورات والاختبارات بلا تعديل.`,
    },
  ),
);

export const StaffRoleAssignmentInclude = t.Partial(
  t.Object(
    {
      staff: t.Boolean(),
      role: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[RBAC P1 · القرار D1] إسناد الأدوار — موظّف واحد يحمل عدّة أدوار، وصلاحياته الفعلية
**اتّحاد** منحها (الأوسع نطاقًا يفوز). \`Staff.roleId\` يبقى الدور الأساسي كي تستمرّ
استهدافات الرواتب والدورات والاختبارات بلا تعديل.`,
    },
  ),
);

export const StaffRoleAssignmentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      staffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      roleId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isPrimary: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      assignedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      assignedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `[RBAC P1 · القرار D1] إسناد الأدوار — موظّف واحد يحمل عدّة أدوار، وصلاحياته الفعلية
**اتّحاد** منحها (الأوسع نطاقًا يفوز). \`Staff.roleId\` يبقى الدور الأساسي كي تستمرّ
استهدافات الرواتب والدورات والاختبارات بلا تعديل.`,
    },
  ),
);

export const StaffRoleAssignment = t.Composite(
  [StaffRoleAssignmentPlain, StaffRoleAssignmentRelations],
  { additionalProperties: false },
);

export const StaffRoleAssignmentInputCreate = t.Composite(
  [
    StaffRoleAssignmentPlainInputCreate,
    StaffRoleAssignmentRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const StaffRoleAssignmentInputUpdate = t.Composite(
  [
    StaffRoleAssignmentPlainInputUpdate,
    StaffRoleAssignmentRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
