import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RolePermissionPlain = t.Object(
  {
    id: t.String(),
    roleId: t.String(),
    permissionId: t.String(),
    scope: t.Union([t.Literal("ALL"), t.Literal("BRANCH"), t.Literal("OWN")], {
      additionalProperties: false,
      description: `[RBAC P1] اتّساع المنحة. يحلّ محلّ ثنائيّة view_limited/view_full:
ALL = كل العيادة، BRANCH = فرع الفاعل، OWN = سجلّاته هو فقط.`,
    }),
    createdAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `[RBAC P1] المنحة: دورٌ يملك صلاحيةً **عند نطاق**. النطاق في المنحة لا في المفتاح،
فيحلّ محلّ ثنائيّات \`view_limited\`/\`view_full\` التي كان معنى «المحدود» فيها يُعاد
اختراعه في كل وحدة.`,
  },
);

export const RolePermissionRelations = t.Object(
  {
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
    permission: t.Object(
      {
        id: t.String(),
        key: t.String({ description: `"patients.read"` }),
        resource: t.String({ description: `"patients"` }),
        action: t.String({ description: `"read"` }),
        labelAr: t.String(),
        labelEn: t.String(),
        group: t.String({ description: `مجموعة السجلّ — أقسام محرّر الأدوار` }),
        scopable: t.Boolean({
          description: `هل للنطاقات الأضيق (BRANCH/OWN) معنًى على هذا المورد`,
        }),
      },
      {
        additionalProperties: false,
        description: `[RBAC P1] كتالوج الصلاحيات — مرآةٌ لسجلّ الموارد في \`src/lib/rbac/rbac-registry.ts\`،
تُزامَن بترحيل ولا تُحرَّر يدويًا. وجودها كجدول يمنح تكامل المفاتيح الأجنبية والتقارير،
بينما يبقى الكود هو المرجع المُلزِم (القرار D2).`,
      },
    ),
  },
  {
    additionalProperties: false,
    description: `[RBAC P1] المنحة: دورٌ يملك صلاحيةً **عند نطاق**. النطاق في المنحة لا في المفتاح،
فيحلّ محلّ ثنائيّات \`view_limited\`/\`view_full\` التي كان معنى «المحدود» فيها يُعاد
اختراعه في كل وحدة.`,
  },
);

export const RolePermissionPlainInputCreate = t.Object(
  {
    scope: t.Optional(
      t.Union([t.Literal("ALL"), t.Literal("BRANCH"), t.Literal("OWN")], {
        additionalProperties: false,
        description: `[RBAC P1] اتّساع المنحة. يحلّ محلّ ثنائيّة view_limited/view_full:
ALL = كل العيادة، BRANCH = فرع الفاعل، OWN = سجلّاته هو فقط.`,
      }),
    ),
  },
  {
    additionalProperties: false,
    description: `[RBAC P1] المنحة: دورٌ يملك صلاحيةً **عند نطاق**. النطاق في المنحة لا في المفتاح،
فيحلّ محلّ ثنائيّات \`view_limited\`/\`view_full\` التي كان معنى «المحدود» فيها يُعاد
اختراعه في كل وحدة.`,
  },
);

export const RolePermissionPlainInputUpdate = t.Object(
  {
    scope: t.Optional(
      t.Union([t.Literal("ALL"), t.Literal("BRANCH"), t.Literal("OWN")], {
        additionalProperties: false,
        description: `[RBAC P1] اتّساع المنحة. يحلّ محلّ ثنائيّة view_limited/view_full:
ALL = كل العيادة، BRANCH = فرع الفاعل، OWN = سجلّاته هو فقط.`,
      }),
    ),
  },
  {
    additionalProperties: false,
    description: `[RBAC P1] المنحة: دورٌ يملك صلاحيةً **عند نطاق**. النطاق في المنحة لا في المفتاح،
فيحلّ محلّ ثنائيّات \`view_limited\`/\`view_full\` التي كان معنى «المحدود» فيها يُعاد
اختراعه في كل وحدة.`,
  },
);

export const RolePermissionRelationsInputCreate = t.Object(
  {
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
    permission: t.Object(
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
    description: `[RBAC P1] المنحة: دورٌ يملك صلاحيةً **عند نطاق**. النطاق في المنحة لا في المفتاح،
فيحلّ محلّ ثنائيّات \`view_limited\`/\`view_full\` التي كان معنى «المحدود» فيها يُعاد
اختراعه في كل وحدة.`,
  },
);

export const RolePermissionRelationsInputUpdate = t.Partial(
  t.Object(
    {
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
      permission: t.Object(
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
      description: `[RBAC P1] المنحة: دورٌ يملك صلاحيةً **عند نطاق**. النطاق في المنحة لا في المفتاح،
فيحلّ محلّ ثنائيّات \`view_limited\`/\`view_full\` التي كان معنى «المحدود» فيها يُعاد
اختراعه في كل وحدة.`,
    },
  ),
);

export const RolePermissionWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
    { $id: "RolePermission" },
  ),
);

export const RolePermissionWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              roleId_permissionId: t.Object(
                { roleId: t.String(), permissionId: t.String() },
                { additionalProperties: false },
              ),
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
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              roleId_permissionId: t.Object(
                { roleId: t.String(), permissionId: t.String() },
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
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "RolePermission" },
);

export const RolePermissionSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      roleId: t.Boolean(),
      permissionId: t.Boolean(),
      scope: t.Boolean(),
      createdAt: t.Boolean(),
      role: t.Boolean(),
      permission: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[RBAC P1] المنحة: دورٌ يملك صلاحيةً **عند نطاق**. النطاق في المنحة لا في المفتاح،
فيحلّ محلّ ثنائيّات \`view_limited\`/\`view_full\` التي كان معنى «المحدود» فيها يُعاد
اختراعه في كل وحدة.`,
    },
  ),
);

export const RolePermissionInclude = t.Partial(
  t.Object(
    {
      scope: t.Boolean(),
      role: t.Boolean(),
      permission: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[RBAC P1] المنحة: دورٌ يملك صلاحيةً **عند نطاق**. النطاق في المنحة لا في المفتاح،
فيحلّ محلّ ثنائيّات \`view_limited\`/\`view_full\` التي كان معنى «المحدود» فيها يُعاد
اختراعه في كل وحدة.`,
    },
  ),
);

export const RolePermissionOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      roleId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      permissionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `[RBAC P1] المنحة: دورٌ يملك صلاحيةً **عند نطاق**. النطاق في المنحة لا في المفتاح،
فيحلّ محلّ ثنائيّات \`view_limited\`/\`view_full\` التي كان معنى «المحدود» فيها يُعاد
اختراعه في كل وحدة.`,
    },
  ),
);

export const RolePermission = t.Composite(
  [RolePermissionPlain, RolePermissionRelations],
  { additionalProperties: false },
);

export const RolePermissionInputCreate = t.Composite(
  [RolePermissionPlainInputCreate, RolePermissionRelationsInputCreate],
  { additionalProperties: false },
);

export const RolePermissionInputUpdate = t.Composite(
  [RolePermissionPlainInputUpdate, RolePermissionRelationsInputUpdate],
  { additionalProperties: false },
);
