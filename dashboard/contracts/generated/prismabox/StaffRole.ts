import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const StaffRolePlain = t.Object(
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
);

export const StaffRoleRelations = t.Object(
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
    staff: t.Array(
      t.Object(
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
      { additionalProperties: false },
    ),
    grants: t.Array(
      t.Object(
        {
          id: t.String(),
          roleId: t.String(),
          permissionId: t.String(),
          scope: t.Union(
            [t.Literal("ALL"), t.Literal("BRANCH"), t.Literal("OWN")],
            {
              additionalProperties: false,
              description: `[RBAC P1] اتّساع المنحة. يحلّ محلّ ثنائيّة view_limited/view_full:
ALL = كل العيادة، BRANCH = فرع الفاعل، OWN = سجلّاته هو فقط.`,
            },
          ),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[RBAC P1] المنحة: دورٌ يملك صلاحيةً **عند نطاق**. النطاق في المنحة لا في المفتاح،
فيحلّ محلّ ثنائيّات \`view_limited\`/\`view_full\` التي كان معنى «المحدود» فيها يُعاد
اختراعه في كل وحدة.`,
        },
      ),
      { additionalProperties: false },
    ),
    assignments: t.Array(
      t.Object(
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
      ),
      { additionalProperties: false },
    ),
    coursesTargeting: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          name: t.String(),
          department: t.String(),
          targetRoleId: __nullable__(t.String()),
          type: t.Union(
            [
              t.Literal("INTERNAL"),
              t.Literal("WORKSHOP"),
              t.Literal("ONLINE"),
              t.Literal("CERTIFICATION"),
              t.Literal("CONFERENCE"),
            ],
            { additionalProperties: false },
          ),
          description: __nullable__(t.String()),
          coverKey: __nullable__(t.String()),
          status: t.Union(
            [t.Literal("DRAFT"), t.Literal("PUBLISHED"), t.Literal("ARCHIVED")],
            { additionalProperties: false },
          ),
          category: __nullable__(t.String()),
          priority: t.Union([t.Literal("URGENT"), t.Literal("NORMAL")], {
            additionalProperties: false,
          }),
          estimatedDurationWeeks: __nullable__(t.Integer()),
          language: t.Union([t.Literal("AR"), t.Literal("EN")], {
            additionalProperties: false,
          }),
          orderMode: t.Union([t.Literal("SEQUENTIAL"), t.Literal("FREE")], {
            additionalProperties: false,
          }),
          trainingCost: __nullable__(t.Integer()),
          institution: __nullable__(t.String()),
          locationMode: __nullable__(
            t.Union(
              [t.Literal("ONSITE"), t.Literal("ONLINE"), t.Literal("HYBRID")],
              { additionalProperties: false },
            ),
          ),
          startDate: __nullable__(t.Date()),
          dueDate: __nullable__(t.Date()),
          timezone: __nullable__(t.String()),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    quizzesTargeting: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          title: t.String(),
          description: __nullable__(t.String()),
          targetRoleId: __nullable__(t.String()),
          coverKey: __nullable__(t.String()),
          status: t.Union(
            [t.Literal("DRAFT"), t.Literal("PUBLISHED"), t.Literal("ARCHIVED")],
            { additionalProperties: false },
          ),
          passMark: t.Integer(),
          timeLimitMinutes: __nullable__(t.Integer()),
          maxAttempts: __nullable__(t.Integer()),
          shuffleQuestions: t.Boolean(),
          showAnswers: t.Boolean(),
          gamificationPoints: t.Integer(),
          editsCount: t.Integer(),
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

export const StaffRolePlainInputCreate = t.Object(
  {
    name: t.String(),
    description: t.Optional(__nullable__(t.String())),
    isSuperAdmin: t.Optional(
      t.Boolean({
        description: `[RBAC D4] يتجاوز كل فحوص الصلاحيات. يُقيَّم قبل أيّ بحث في السجلّ، فلا يمكن
لإدخال خاطئ في سجلّ الموارد أن يقفل الباب على مدير النظام (درس P12A).`,
      }),
    ),
    isSystem: t.Optional(
      t.Boolean({
        description: `دور مُدمَج تُنشئه التهيئة الأولى — لا يُحذف ولا يُعاد تسميته. يحلّ محلّ مقارنة
الاسم العربي «مدير النظام» التي كانت تحرس الدور نصًّا.`,
      }),
    ),
    permissions: t.Array(
      t.String({
        description: `[RBAC] العمود القديم — منح مسطَّحة بلا نطاق. يبقى خلال الترحيل مصدرًا للتعبئة
الرجعية فقط، ويُسقَط في P7 بعد التحقّق من \`role_permission\`.`,
      }),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const StaffRolePlainInputUpdate = t.Object(
  {
    name: t.Optional(t.String()),
    description: t.Optional(__nullable__(t.String())),
    isSuperAdmin: t.Optional(
      t.Boolean({
        description: `[RBAC D4] يتجاوز كل فحوص الصلاحيات. يُقيَّم قبل أيّ بحث في السجلّ، فلا يمكن
لإدخال خاطئ في سجلّ الموارد أن يقفل الباب على مدير النظام (درس P12A).`,
      }),
    ),
    isSystem: t.Optional(
      t.Boolean({
        description: `دور مُدمَج تُنشئه التهيئة الأولى — لا يُحذف ولا يُعاد تسميته. يحلّ محلّ مقارنة
الاسم العربي «مدير النظام» التي كانت تحرس الدور نصًّا.`,
      }),
    ),
    permissions: t.Optional(
      t.Array(
        t.String({
          description: `[RBAC] العمود القديم — منح مسطَّحة بلا نطاق. يبقى خلال الترحيل مصدرًا للتعبئة
الرجعية فقط، ويُسقَط في P7 بعد التحقّق من \`role_permission\`.`,
        }),
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const StaffRoleRelationsInputCreate = t.Object(
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
    staff: t.Optional(
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
    grants: t.Optional(
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
    coursesTargeting: t.Optional(
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
    quizzesTargeting: t.Optional(
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

export const StaffRoleRelationsInputUpdate = t.Partial(
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
      staff: t.Partial(
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
      grants: t.Partial(
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
      coursesTargeting: t.Partial(
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
      quizzesTargeting: t.Partial(
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

export const StaffRoleWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          name: t.String(),
          description: t.String(),
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
    { $id: "StaffRole" },
  ),
);

export const StaffRoleWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_name: t.Object(
                { clinicId: t.String(), name: t.String() },
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
              clinicId_name: t.Object(
                { clinicId: t.String(), name: t.String() },
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
              name: t.String(),
              description: t.String(),
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
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "StaffRole" },
);

export const StaffRoleSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      name: t.Boolean(),
      description: t.Boolean(),
      isSuperAdmin: t.Boolean(),
      isSystem: t.Boolean(),
      permissions: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      staff: t.Boolean(),
      grants: t.Boolean(),
      assignments: t.Boolean(),
      coursesTargeting: t.Boolean(),
      quizzesTargeting: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const StaffRoleInclude = t.Partial(
  t.Object(
    {
      clinic: t.Boolean(),
      staff: t.Boolean(),
      grants: t.Boolean(),
      assignments: t.Boolean(),
      coursesTargeting: t.Boolean(),
      quizzesTargeting: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const StaffRoleOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isSuperAdmin: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isSystem: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      permissions: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const StaffRole = t.Composite([StaffRolePlain, StaffRoleRelations], {
  additionalProperties: false,
});

export const StaffRoleInputCreate = t.Composite(
  [StaffRolePlainInputCreate, StaffRoleRelationsInputCreate],
  { additionalProperties: false },
);

export const StaffRoleInputUpdate = t.Composite(
  [StaffRolePlainInputUpdate, StaffRoleRelationsInputUpdate],
  { additionalProperties: false },
);
