import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PermissionPlain = t.Object(
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
);

export const PermissionRelations = t.Object(
  {
    roles: t.Array(
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
  },
  {
    additionalProperties: false,
    description: `[RBAC P1] كتالوج الصلاحيات — مرآةٌ لسجلّ الموارد في \`src/lib/rbac/rbac-registry.ts\`،
تُزامَن بترحيل ولا تُحرَّر يدويًا. وجودها كجدول يمنح تكامل المفاتيح الأجنبية والتقارير،
بينما يبقى الكود هو المرجع المُلزِم (القرار D2).`,
  },
);

export const PermissionPlainInputCreate = t.Object(
  {
    key: t.String({ description: `"patients.read"` }),
    resource: t.String({ description: `"patients"` }),
    action: t.String({ description: `"read"` }),
    labelAr: t.String(),
    labelEn: t.String(),
    group: t.String({ description: `مجموعة السجلّ — أقسام محرّر الأدوار` }),
    scopable: t.Optional(
      t.Boolean({
        description: `هل للنطاقات الأضيق (BRANCH/OWN) معنًى على هذا المورد`,
      }),
    ),
  },
  {
    additionalProperties: false,
    description: `[RBAC P1] كتالوج الصلاحيات — مرآةٌ لسجلّ الموارد في \`src/lib/rbac/rbac-registry.ts\`،
تُزامَن بترحيل ولا تُحرَّر يدويًا. وجودها كجدول يمنح تكامل المفاتيح الأجنبية والتقارير،
بينما يبقى الكود هو المرجع المُلزِم (القرار D2).`,
  },
);

export const PermissionPlainInputUpdate = t.Object(
  {
    key: t.Optional(t.String({ description: `"patients.read"` })),
    resource: t.Optional(t.String({ description: `"patients"` })),
    action: t.Optional(t.String({ description: `"read"` })),
    labelAr: t.Optional(t.String()),
    labelEn: t.Optional(t.String()),
    group: t.Optional(
      t.String({ description: `مجموعة السجلّ — أقسام محرّر الأدوار` }),
    ),
    scopable: t.Optional(
      t.Boolean({
        description: `هل للنطاقات الأضيق (BRANCH/OWN) معنًى على هذا المورد`,
      }),
    ),
  },
  {
    additionalProperties: false,
    description: `[RBAC P1] كتالوج الصلاحيات — مرآةٌ لسجلّ الموارد في \`src/lib/rbac/rbac-registry.ts\`،
تُزامَن بترحيل ولا تُحرَّر يدويًا. وجودها كجدول يمنح تكامل المفاتيح الأجنبية والتقارير،
بينما يبقى الكود هو المرجع المُلزِم (القرار D2).`,
  },
);

export const PermissionRelationsInputCreate = t.Object(
  {
    roles: t.Optional(
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
    description: `[RBAC P1] كتالوج الصلاحيات — مرآةٌ لسجلّ الموارد في \`src/lib/rbac/rbac-registry.ts\`،
تُزامَن بترحيل ولا تُحرَّر يدويًا. وجودها كجدول يمنح تكامل المفاتيح الأجنبية والتقارير،
بينما يبقى الكود هو المرجع المُلزِم (القرار D2).`,
  },
);

export const PermissionRelationsInputUpdate = t.Partial(
  t.Object(
    {
      roles: t.Partial(
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
      description: `[RBAC P1] كتالوج الصلاحيات — مرآةٌ لسجلّ الموارد في \`src/lib/rbac/rbac-registry.ts\`،
تُزامَن بترحيل ولا تُحرَّر يدويًا. وجودها كجدول يمنح تكامل المفاتيح الأجنبية والتقارير،
بينما يبقى الكود هو المرجع المُلزِم (القرار D2).`,
    },
  ),
);

export const PermissionWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          key: t.String({ description: `"patients.read"` }),
          resource: t.String({ description: `"patients"` }),
          action: t.String({ description: `"read"` }),
          labelAr: t.String(),
          labelEn: t.String(),
          group: t.String({
            description: `مجموعة السجلّ — أقسام محرّر الأدوار`,
          }),
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
    { $id: "Permission" },
  ),
);

export const PermissionWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              key: t.String({ description: `"patients.read"` }),
            },
            {
              additionalProperties: false,
              description: `[RBAC P1] كتالوج الصلاحيات — مرآةٌ لسجلّ الموارد في \`src/lib/rbac/rbac-registry.ts\`،
تُزامَن بترحيل ولا تُحرَّر يدويًا. وجودها كجدول يمنح تكامل المفاتيح الأجنبية والتقارير،
بينما يبقى الكود هو المرجع المُلزِم (القرار D2).`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({ key: t.String({ description: `"patients.read"` }) }),
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
              key: t.String({ description: `"patients.read"` }),
              resource: t.String({ description: `"patients"` }),
              action: t.String({ description: `"read"` }),
              labelAr: t.String(),
              labelEn: t.String(),
              group: t.String({
                description: `مجموعة السجلّ — أقسام محرّر الأدوار`,
              }),
              scopable: t.Boolean({
                description: `هل للنطاقات الأضيق (BRANCH/OWN) معنًى على هذا المورد`,
              }),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Permission" },
);

export const PermissionSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      key: t.Boolean(),
      resource: t.Boolean(),
      action: t.Boolean(),
      labelAr: t.Boolean(),
      labelEn: t.Boolean(),
      group: t.Boolean(),
      scopable: t.Boolean(),
      roles: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[RBAC P1] كتالوج الصلاحيات — مرآةٌ لسجلّ الموارد في \`src/lib/rbac/rbac-registry.ts\`،
تُزامَن بترحيل ولا تُحرَّر يدويًا. وجودها كجدول يمنح تكامل المفاتيح الأجنبية والتقارير،
بينما يبقى الكود هو المرجع المُلزِم (القرار D2).`,
    },
  ),
);

export const PermissionInclude = t.Partial(
  t.Object(
    { roles: t.Boolean(), _count: t.Boolean() },
    {
      additionalProperties: false,
      description: `[RBAC P1] كتالوج الصلاحيات — مرآةٌ لسجلّ الموارد في \`src/lib/rbac/rbac-registry.ts\`،
تُزامَن بترحيل ولا تُحرَّر يدويًا. وجودها كجدول يمنح تكامل المفاتيح الأجنبية والتقارير،
بينما يبقى الكود هو المرجع المُلزِم (القرار D2).`,
    },
  ),
);

export const PermissionOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      key: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      resource: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      action: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      labelAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      labelEn: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      group: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      scopable: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `[RBAC P1] كتالوج الصلاحيات — مرآةٌ لسجلّ الموارد في \`src/lib/rbac/rbac-registry.ts\`،
تُزامَن بترحيل ولا تُحرَّر يدويًا. وجودها كجدول يمنح تكامل المفاتيح الأجنبية والتقارير،
بينما يبقى الكود هو المرجع المُلزِم (القرار D2).`,
    },
  ),
);

export const Permission = t.Composite([PermissionPlain, PermissionRelations], {
  additionalProperties: false,
});

export const PermissionInputCreate = t.Composite(
  [PermissionPlainInputCreate, PermissionRelationsInputCreate],
  { additionalProperties: false },
);

export const PermissionInputUpdate = t.Composite(
  [PermissionPlainInputUpdate, PermissionRelationsInputUpdate],
  { additionalProperties: false },
);
