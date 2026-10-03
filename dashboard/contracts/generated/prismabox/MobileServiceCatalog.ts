import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MobileServiceCatalogPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    serviceId: t.String(),
    price: __nullable__(t.Number()),
    duration: __nullable__(t.Integer()),
    isActive: t.Boolean(),
    notes: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `[MC10.1] سجلّ الخدمات المسموح بها للعيادة المتنقلة — لكل عيادة على حدة.
لماذا جدول مستقلّ لا علَمٌ على \`ClinicServiceConfig\`؟ لأنّ الخدمة نفسها تُسعَّر وتستغرق
وقتًا مختلفًا في الموقع عنها في العيادة: الانتقال والتجهيز الميداني يرفعان الكلفة
والمدّة. علَمٌ واحد كان سيفرض سعرًا واحدًا على القناتين، وفصلهما لاحقًا يعني ترحيلًا
وتصحيح بيانات تاريخية.
\`price\`/\`duration\` فارغتان تعنيان «خذ ما في \`ClinicServiceConfig\`» — لا صفرًا. الفارق
جوهري: «بلا سعر خاصّ» ليست «مجّانًا».`,
  },
);

export const MobileServiceCatalogRelations = t.Object(
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
    service: t.Object(
      {
        id: t.String(),
        name: t.String(),
        level: t.Union(
          [t.Literal("CATEGORY"), t.Literal("SUBCATEGORY"), t.Literal("ITEM")],
          { additionalProperties: false },
        ),
        parentId: __nullable__(t.String()),
        isDefault: t.Boolean(),
        clinicId: __nullable__(t.String()),
        order: t.Integer(),
        isLabCategory: t.Boolean(),
        isRadiologyCategory: t.Boolean(),
        isOperationCategory: t.Boolean(),
        isGroomingCategory: t.Boolean(),
        consentCode: __nullable__(t.String()),
        createdAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `[MC10.1] سجلّ الخدمات المسموح بها للعيادة المتنقلة — لكل عيادة على حدة.
لماذا جدول مستقلّ لا علَمٌ على \`ClinicServiceConfig\`؟ لأنّ الخدمة نفسها تُسعَّر وتستغرق
وقتًا مختلفًا في الموقع عنها في العيادة: الانتقال والتجهيز الميداني يرفعان الكلفة
والمدّة. علَمٌ واحد كان سيفرض سعرًا واحدًا على القناتين، وفصلهما لاحقًا يعني ترحيلًا
وتصحيح بيانات تاريخية.
\`price\`/\`duration\` فارغتان تعنيان «خذ ما في \`ClinicServiceConfig\`» — لا صفرًا. الفارق
جوهري: «بلا سعر خاصّ» ليست «مجّانًا».`,
  },
);

export const MobileServiceCatalogPlainInputCreate = t.Object(
  {
    price: t.Optional(__nullable__(t.Number())),
    duration: t.Optional(__nullable__(t.Integer())),
    isActive: t.Optional(t.Boolean()),
    notes: t.Optional(__nullable__(t.String())),
  },
  {
    additionalProperties: false,
    description: `[MC10.1] سجلّ الخدمات المسموح بها للعيادة المتنقلة — لكل عيادة على حدة.
لماذا جدول مستقلّ لا علَمٌ على \`ClinicServiceConfig\`؟ لأنّ الخدمة نفسها تُسعَّر وتستغرق
وقتًا مختلفًا في الموقع عنها في العيادة: الانتقال والتجهيز الميداني يرفعان الكلفة
والمدّة. علَمٌ واحد كان سيفرض سعرًا واحدًا على القناتين، وفصلهما لاحقًا يعني ترحيلًا
وتصحيح بيانات تاريخية.
\`price\`/\`duration\` فارغتان تعنيان «خذ ما في \`ClinicServiceConfig\`» — لا صفرًا. الفارق
جوهري: «بلا سعر خاصّ» ليست «مجّانًا».`,
  },
);

export const MobileServiceCatalogPlainInputUpdate = t.Object(
  {
    price: t.Optional(__nullable__(t.Number())),
    duration: t.Optional(__nullable__(t.Integer())),
    isActive: t.Optional(t.Boolean()),
    notes: t.Optional(__nullable__(t.String())),
  },
  {
    additionalProperties: false,
    description: `[MC10.1] سجلّ الخدمات المسموح بها للعيادة المتنقلة — لكل عيادة على حدة.
لماذا جدول مستقلّ لا علَمٌ على \`ClinicServiceConfig\`؟ لأنّ الخدمة نفسها تُسعَّر وتستغرق
وقتًا مختلفًا في الموقع عنها في العيادة: الانتقال والتجهيز الميداني يرفعان الكلفة
والمدّة. علَمٌ واحد كان سيفرض سعرًا واحدًا على القناتين، وفصلهما لاحقًا يعني ترحيلًا
وتصحيح بيانات تاريخية.
\`price\`/\`duration\` فارغتان تعنيان «خذ ما في \`ClinicServiceConfig\`» — لا صفرًا. الفارق
جوهري: «بلا سعر خاصّ» ليست «مجّانًا».`,
  },
);

export const MobileServiceCatalogRelationsInputCreate = t.Object(
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
    service: t.Object(
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
    description: `[MC10.1] سجلّ الخدمات المسموح بها للعيادة المتنقلة — لكل عيادة على حدة.
لماذا جدول مستقلّ لا علَمٌ على \`ClinicServiceConfig\`؟ لأنّ الخدمة نفسها تُسعَّر وتستغرق
وقتًا مختلفًا في الموقع عنها في العيادة: الانتقال والتجهيز الميداني يرفعان الكلفة
والمدّة. علَمٌ واحد كان سيفرض سعرًا واحدًا على القناتين، وفصلهما لاحقًا يعني ترحيلًا
وتصحيح بيانات تاريخية.
\`price\`/\`duration\` فارغتان تعنيان «خذ ما في \`ClinicServiceConfig\`» — لا صفرًا. الفارق
جوهري: «بلا سعر خاصّ» ليست «مجّانًا».`,
  },
);

export const MobileServiceCatalogRelationsInputUpdate = t.Partial(
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
      service: t.Object(
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
      description: `[MC10.1] سجلّ الخدمات المسموح بها للعيادة المتنقلة — لكل عيادة على حدة.
لماذا جدول مستقلّ لا علَمٌ على \`ClinicServiceConfig\`؟ لأنّ الخدمة نفسها تُسعَّر وتستغرق
وقتًا مختلفًا في الموقع عنها في العيادة: الانتقال والتجهيز الميداني يرفعان الكلفة
والمدّة. علَمٌ واحد كان سيفرض سعرًا واحدًا على القناتين، وفصلهما لاحقًا يعني ترحيلًا
وتصحيح بيانات تاريخية.
\`price\`/\`duration\` فارغتان تعنيان «خذ ما في \`ClinicServiceConfig\`» — لا صفرًا. الفارق
جوهري: «بلا سعر خاصّ» ليست «مجّانًا».`,
    },
  ),
);

export const MobileServiceCatalogWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          serviceId: t.String(),
          price: t.Number(),
          duration: t.Integer(),
          isActive: t.Boolean(),
          notes: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[MC10.1] سجلّ الخدمات المسموح بها للعيادة المتنقلة — لكل عيادة على حدة.
لماذا جدول مستقلّ لا علَمٌ على \`ClinicServiceConfig\`؟ لأنّ الخدمة نفسها تُسعَّر وتستغرق
وقتًا مختلفًا في الموقع عنها في العيادة: الانتقال والتجهيز الميداني يرفعان الكلفة
والمدّة. علَمٌ واحد كان سيفرض سعرًا واحدًا على القناتين، وفصلهما لاحقًا يعني ترحيلًا
وتصحيح بيانات تاريخية.
\`price\`/\`duration\` فارغتان تعنيان «خذ ما في \`ClinicServiceConfig\`» — لا صفرًا. الفارق
جوهري: «بلا سعر خاصّ» ليست «مجّانًا».`,
        },
      ),
    { $id: "MobileServiceCatalog" },
  ),
);

export const MobileServiceCatalogWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_serviceId: t.Object(
                { clinicId: t.String(), serviceId: t.String() },
                { additionalProperties: false },
              ),
            },
            {
              additionalProperties: false,
              description: `[MC10.1] سجلّ الخدمات المسموح بها للعيادة المتنقلة — لكل عيادة على حدة.
لماذا جدول مستقلّ لا علَمٌ على \`ClinicServiceConfig\`؟ لأنّ الخدمة نفسها تُسعَّر وتستغرق
وقتًا مختلفًا في الموقع عنها في العيادة: الانتقال والتجهيز الميداني يرفعان الكلفة
والمدّة. علَمٌ واحد كان سيفرض سعرًا واحدًا على القناتين، وفصلهما لاحقًا يعني ترحيلًا
وتصحيح بيانات تاريخية.
\`price\`/\`duration\` فارغتان تعنيان «خذ ما في \`ClinicServiceConfig\`» — لا صفرًا. الفارق
جوهري: «بلا سعر خاصّ» ليست «مجّانًا».`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              clinicId_serviceId: t.Object(
                { clinicId: t.String(), serviceId: t.String() },
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
              serviceId: t.String(),
              price: t.Number(),
              duration: t.Integer(),
              isActive: t.Boolean(),
              notes: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "MobileServiceCatalog" },
);

export const MobileServiceCatalogSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      serviceId: t.Boolean(),
      price: t.Boolean(),
      duration: t.Boolean(),
      isActive: t.Boolean(),
      notes: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      service: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[MC10.1] سجلّ الخدمات المسموح بها للعيادة المتنقلة — لكل عيادة على حدة.
لماذا جدول مستقلّ لا علَمٌ على \`ClinicServiceConfig\`؟ لأنّ الخدمة نفسها تُسعَّر وتستغرق
وقتًا مختلفًا في الموقع عنها في العيادة: الانتقال والتجهيز الميداني يرفعان الكلفة
والمدّة. علَمٌ واحد كان سيفرض سعرًا واحدًا على القناتين، وفصلهما لاحقًا يعني ترحيلًا
وتصحيح بيانات تاريخية.
\`price\`/\`duration\` فارغتان تعنيان «خذ ما في \`ClinicServiceConfig\`» — لا صفرًا. الفارق
جوهري: «بلا سعر خاصّ» ليست «مجّانًا».`,
    },
  ),
);

export const MobileServiceCatalogInclude = t.Partial(
  t.Object(
    { clinic: t.Boolean(), service: t.Boolean(), _count: t.Boolean() },
    {
      additionalProperties: false,
      description: `[MC10.1] سجلّ الخدمات المسموح بها للعيادة المتنقلة — لكل عيادة على حدة.
لماذا جدول مستقلّ لا علَمٌ على \`ClinicServiceConfig\`؟ لأنّ الخدمة نفسها تُسعَّر وتستغرق
وقتًا مختلفًا في الموقع عنها في العيادة: الانتقال والتجهيز الميداني يرفعان الكلفة
والمدّة. علَمٌ واحد كان سيفرض سعرًا واحدًا على القناتين، وفصلهما لاحقًا يعني ترحيلًا
وتصحيح بيانات تاريخية.
\`price\`/\`duration\` فارغتان تعنيان «خذ ما في \`ClinicServiceConfig\`» — لا صفرًا. الفارق
جوهري: «بلا سعر خاصّ» ليست «مجّانًا».`,
    },
  ),
);

export const MobileServiceCatalogOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      serviceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      price: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      duration: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isActive: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `[MC10.1] سجلّ الخدمات المسموح بها للعيادة المتنقلة — لكل عيادة على حدة.
لماذا جدول مستقلّ لا علَمٌ على \`ClinicServiceConfig\`؟ لأنّ الخدمة نفسها تُسعَّر وتستغرق
وقتًا مختلفًا في الموقع عنها في العيادة: الانتقال والتجهيز الميداني يرفعان الكلفة
والمدّة. علَمٌ واحد كان سيفرض سعرًا واحدًا على القناتين، وفصلهما لاحقًا يعني ترحيلًا
وتصحيح بيانات تاريخية.
\`price\`/\`duration\` فارغتان تعنيان «خذ ما في \`ClinicServiceConfig\`» — لا صفرًا. الفارق
جوهري: «بلا سعر خاصّ» ليست «مجّانًا».`,
    },
  ),
);

export const MobileServiceCatalog = t.Composite(
  [MobileServiceCatalogPlain, MobileServiceCatalogRelations],
  { additionalProperties: false },
);

export const MobileServiceCatalogInputCreate = t.Composite(
  [
    MobileServiceCatalogPlainInputCreate,
    MobileServiceCatalogRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const MobileServiceCatalogInputUpdate = t.Composite(
  [
    MobileServiceCatalogPlainInputUpdate,
    MobileServiceCatalogRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
