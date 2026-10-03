import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ControlledSubstancePlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    inventoryItemId: t.String(),
    scheduleClass: __nullable__(
      t.String({
        description: `تصنيف الجدول الرقابي (مثل «جدول ٢») — يبقى فارغًا حتى تصل حزمة الجدولة`,
      }),
    ),
    source: t.Union([t.Literal("CLINIC"), t.Literal("SCHEDULE_PACK")], {
      additionalProperties: false,
      description: `من أين عُرف أن هذه المادة مراقبة.
**هذا العمود هو نقطة الاتّصال مع O-PH-1.** الطبقة الأولى من الكتالوج لا تصلح
مصدرًا: صفّان من ١٣٦٥ يحملان \`legalStatus = "Controlled"\` في سجل الغذاء والدواء
السعودي، و٢٤ في السجل الأسترالي وهي جدولة أستراليّة بلا أثر قانوني هنا
(BRD §2.3). فحتى يصل جدول الجدولة الرقابي، تُعلّم العيادة موادّها بنفسها —
و\`source\` يُبقي الفرق ظاهرًا في البيانات لا في وثيقة جانبية.`,
    }),
    active: t.Boolean(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `[PH4.1] وسم مادة مراقبة داخل عيادة — BRD §8.2.`,
  },
);

export const ControlledSubstanceRelations = t.Object(
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
    inventoryItem: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        name: t.String(),
        category: t.Union(
          [
            t.Literal("ANTIBIOTIC"),
            t.Literal("ANTI_INFLAMMATORY"),
            t.Literal("VACCINE"),
            t.Literal("HORMONE"),
            t.Literal("SUPPLEMENT"),
            t.Literal("CRUSTACEAN"),
            t.Literal("SURGICAL_TOOLS"),
            t.Literal("SUPPLIES"),
          ],
          { additionalProperties: false },
        ),
        stock: t.Integer(),
        reorderPoint: t.Integer(),
        productionDate: __nullable__(t.Date()),
        expiryDate: __nullable__(t.Date()),
        price: t.Number(),
        unitCost: __nullable__(t.Number()),
        valuationRate: t.Number(),
        maxQuantity: __nullable__(t.Integer()),
        sku: __nullable__(t.String()),
        barcode: __nullable__(t.String()),
        supplier: __nullable__(t.String()),
        location: __nullable__(t.String()),
        notes: __nullable__(t.String()),
        tracksBatches: t.Boolean(),
        itemTaxTemplateId: __nullable__(t.String()),
        catalogProductId: __nullable__(t.String()),
        active: t.Boolean(),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        editsCount: t.Integer(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `[PH4.1] وسم مادة مراقبة داخل عيادة — BRD §8.2.`,
  },
);

export const ControlledSubstancePlainInputCreate = t.Object(
  {
    scheduleClass: t.Optional(
      __nullable__(
        t.String({
          description: `تصنيف الجدول الرقابي (مثل «جدول ٢») — يبقى فارغًا حتى تصل حزمة الجدولة`,
        }),
      ),
    ),
    source: t.Optional(
      t.Union([t.Literal("CLINIC"), t.Literal("SCHEDULE_PACK")], {
        additionalProperties: false,
        description: `من أين عُرف أن هذه المادة مراقبة.
**هذا العمود هو نقطة الاتّصال مع O-PH-1.** الطبقة الأولى من الكتالوج لا تصلح
مصدرًا: صفّان من ١٣٦٥ يحملان \`legalStatus = "Controlled"\` في سجل الغذاء والدواء
السعودي، و٢٤ في السجل الأسترالي وهي جدولة أستراليّة بلا أثر قانوني هنا
(BRD §2.3). فحتى يصل جدول الجدولة الرقابي، تُعلّم العيادة موادّها بنفسها —
و\`source\` يُبقي الفرق ظاهرًا في البيانات لا في وثيقة جانبية.`,
      }),
    ),
    active: t.Optional(t.Boolean()),
  },
  {
    additionalProperties: false,
    description: `[PH4.1] وسم مادة مراقبة داخل عيادة — BRD §8.2.`,
  },
);

export const ControlledSubstancePlainInputUpdate = t.Object(
  {
    scheduleClass: t.Optional(
      __nullable__(
        t.String({
          description: `تصنيف الجدول الرقابي (مثل «جدول ٢») — يبقى فارغًا حتى تصل حزمة الجدولة`,
        }),
      ),
    ),
    source: t.Optional(
      t.Union([t.Literal("CLINIC"), t.Literal("SCHEDULE_PACK")], {
        additionalProperties: false,
        description: `من أين عُرف أن هذه المادة مراقبة.
**هذا العمود هو نقطة الاتّصال مع O-PH-1.** الطبقة الأولى من الكتالوج لا تصلح
مصدرًا: صفّان من ١٣٦٥ يحملان \`legalStatus = "Controlled"\` في سجل الغذاء والدواء
السعودي، و٢٤ في السجل الأسترالي وهي جدولة أستراليّة بلا أثر قانوني هنا
(BRD §2.3). فحتى يصل جدول الجدولة الرقابي، تُعلّم العيادة موادّها بنفسها —
و\`source\` يُبقي الفرق ظاهرًا في البيانات لا في وثيقة جانبية.`,
      }),
    ),
    active: t.Optional(t.Boolean()),
  },
  {
    additionalProperties: false,
    description: `[PH4.1] وسم مادة مراقبة داخل عيادة — BRD §8.2.`,
  },
);

export const ControlledSubstanceRelationsInputCreate = t.Object(
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
    inventoryItem: t.Object(
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
    description: `[PH4.1] وسم مادة مراقبة داخل عيادة — BRD §8.2.`,
  },
);

export const ControlledSubstanceRelationsInputUpdate = t.Partial(
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
      inventoryItem: t.Object(
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
      description: `[PH4.1] وسم مادة مراقبة داخل عيادة — BRD §8.2.`,
    },
  ),
);

export const ControlledSubstanceWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          inventoryItemId: t.String(),
          scheduleClass: t.String({
            description: `تصنيف الجدول الرقابي (مثل «جدول ٢») — يبقى فارغًا حتى تصل حزمة الجدولة`,
          }),
          source: t.Union([t.Literal("CLINIC"), t.Literal("SCHEDULE_PACK")], {
            additionalProperties: false,
            description: `من أين عُرف أن هذه المادة مراقبة.
**هذا العمود هو نقطة الاتّصال مع O-PH-1.** الطبقة الأولى من الكتالوج لا تصلح
مصدرًا: صفّان من ١٣٦٥ يحملان \`legalStatus = "Controlled"\` في سجل الغذاء والدواء
السعودي، و٢٤ في السجل الأسترالي وهي جدولة أستراليّة بلا أثر قانوني هنا
(BRD §2.3). فحتى يصل جدول الجدولة الرقابي، تُعلّم العيادة موادّها بنفسها —
و\`source\` يُبقي الفرق ظاهرًا في البيانات لا في وثيقة جانبية.`,
          }),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[PH4.1] وسم مادة مراقبة داخل عيادة — BRD §8.2.`,
        },
      ),
    { $id: "ControlledSubstance" },
  ),
);

export const ControlledSubstanceWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_inventoryItemId: t.Object(
                { clinicId: t.String(), inventoryItemId: t.String() },
                { additionalProperties: false },
              ),
            },
            {
              additionalProperties: false,
              description: `[PH4.1] وسم مادة مراقبة داخل عيادة — BRD §8.2.`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              clinicId_inventoryItemId: t.Object(
                { clinicId: t.String(), inventoryItemId: t.String() },
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
              inventoryItemId: t.String(),
              scheduleClass: t.String({
                description: `تصنيف الجدول الرقابي (مثل «جدول ٢») — يبقى فارغًا حتى تصل حزمة الجدولة`,
              }),
              source: t.Union(
                [t.Literal("CLINIC"), t.Literal("SCHEDULE_PACK")],
                {
                  additionalProperties: false,
                  description: `من أين عُرف أن هذه المادة مراقبة.
**هذا العمود هو نقطة الاتّصال مع O-PH-1.** الطبقة الأولى من الكتالوج لا تصلح
مصدرًا: صفّان من ١٣٦٥ يحملان \`legalStatus = "Controlled"\` في سجل الغذاء والدواء
السعودي، و٢٤ في السجل الأسترالي وهي جدولة أستراليّة بلا أثر قانوني هنا
(BRD §2.3). فحتى يصل جدول الجدولة الرقابي، تُعلّم العيادة موادّها بنفسها —
و\`source\` يُبقي الفرق ظاهرًا في البيانات لا في وثيقة جانبية.`,
                },
              ),
              active: t.Boolean(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ControlledSubstance" },
);

export const ControlledSubstanceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      inventoryItemId: t.Boolean(),
      scheduleClass: t.Boolean(),
      source: t.Boolean(),
      active: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      inventoryItem: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[PH4.1] وسم مادة مراقبة داخل عيادة — BRD §8.2.`,
    },
  ),
);

export const ControlledSubstanceInclude = t.Partial(
  t.Object(
    {
      source: t.Boolean(),
      clinic: t.Boolean(),
      inventoryItem: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[PH4.1] وسم مادة مراقبة داخل عيادة — BRD §8.2.`,
    },
  ),
);

export const ControlledSubstanceOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      inventoryItemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      scheduleClass: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      active: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `[PH4.1] وسم مادة مراقبة داخل عيادة — BRD §8.2.`,
    },
  ),
);

export const ControlledSubstance = t.Composite(
  [ControlledSubstancePlain, ControlledSubstanceRelations],
  { additionalProperties: false },
);

export const ControlledSubstanceInputCreate = t.Composite(
  [
    ControlledSubstancePlainInputCreate,
    ControlledSubstanceRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const ControlledSubstanceInputUpdate = t.Composite(
  [
    ControlledSubstancePlainInputUpdate,
    ControlledSubstanceRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
