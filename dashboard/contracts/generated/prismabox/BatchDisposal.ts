import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const BatchDisposalPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    batchId: t.String(),
    itemId: t.String(),
    warehouseId: t.String(),
    qty: t.Integer(),
    reasonAr: t.String(),
    performedById: __nullable__(t.String()),
    createdAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `[PH17] إتلاف دفعة منتهية — واقعة موثَّقة بمنفّذ وشاهدٍ أو أكثر.
الإتلاف حدث يُسأل عنه لاحقًا («من أتلف ٢٠ أمبولة كيتامين ومن رأى ذلك؟»)، فلا يُختزل
في حركة مخزون بملاحظة نصّية. الشهود مستخدمون حقيقيّون في العيادة لا أسماء مكتوبة،
وعددهم مفتوح: مادة مراقبة قد تُلزم بشاهدين. حركة المخزون تحمل \`voucherId\` = هذا الصفّ.`,
  },
);

export const BatchDisposalRelations = t.Object(
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
    batch: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        itemId: t.String(),
        warehouseId: t.String(),
        batchNo: t.String(),
        expiryDate: __nullable__(t.Date()),
        productionDate: __nullable__(t.Date()),
        qty: t.Integer(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    item: t.Object(
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
    performedBy: __nullable__(
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
    witnesses: t.Array(
      t.Object(
        { id: t.String(), disposalId: t.String(), userId: t.String() },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `[PH17] إتلاف دفعة منتهية — واقعة موثَّقة بمنفّذ وشاهدٍ أو أكثر.
الإتلاف حدث يُسأل عنه لاحقًا («من أتلف ٢٠ أمبولة كيتامين ومن رأى ذلك؟»)، فلا يُختزل
في حركة مخزون بملاحظة نصّية. الشهود مستخدمون حقيقيّون في العيادة لا أسماء مكتوبة،
وعددهم مفتوح: مادة مراقبة قد تُلزم بشاهدين. حركة المخزون تحمل \`voucherId\` = هذا الصفّ.`,
  },
);

export const BatchDisposalPlainInputCreate = t.Object(
  { qty: t.Integer(), reasonAr: t.String() },
  {
    additionalProperties: false,
    description: `[PH17] إتلاف دفعة منتهية — واقعة موثَّقة بمنفّذ وشاهدٍ أو أكثر.
الإتلاف حدث يُسأل عنه لاحقًا («من أتلف ٢٠ أمبولة كيتامين ومن رأى ذلك؟»)، فلا يُختزل
في حركة مخزون بملاحظة نصّية. الشهود مستخدمون حقيقيّون في العيادة لا أسماء مكتوبة،
وعددهم مفتوح: مادة مراقبة قد تُلزم بشاهدين. حركة المخزون تحمل \`voucherId\` = هذا الصفّ.`,
  },
);

export const BatchDisposalPlainInputUpdate = t.Object(
  { qty: t.Optional(t.Integer()), reasonAr: t.Optional(t.String()) },
  {
    additionalProperties: false,
    description: `[PH17] إتلاف دفعة منتهية — واقعة موثَّقة بمنفّذ وشاهدٍ أو أكثر.
الإتلاف حدث يُسأل عنه لاحقًا («من أتلف ٢٠ أمبولة كيتامين ومن رأى ذلك؟»)، فلا يُختزل
في حركة مخزون بملاحظة نصّية. الشهود مستخدمون حقيقيّون في العيادة لا أسماء مكتوبة،
وعددهم مفتوح: مادة مراقبة قد تُلزم بشاهدين. حركة المخزون تحمل \`voucherId\` = هذا الصفّ.`,
  },
);

export const BatchDisposalRelationsInputCreate = t.Object(
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
    batch: t.Object(
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
    item: t.Object(
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
    performedBy: t.Optional(
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
    witnesses: t.Optional(
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
    description: `[PH17] إتلاف دفعة منتهية — واقعة موثَّقة بمنفّذ وشاهدٍ أو أكثر.
الإتلاف حدث يُسأل عنه لاحقًا («من أتلف ٢٠ أمبولة كيتامين ومن رأى ذلك؟»)، فلا يُختزل
في حركة مخزون بملاحظة نصّية. الشهود مستخدمون حقيقيّون في العيادة لا أسماء مكتوبة،
وعددهم مفتوح: مادة مراقبة قد تُلزم بشاهدين. حركة المخزون تحمل \`voucherId\` = هذا الصفّ.`,
  },
);

export const BatchDisposalRelationsInputUpdate = t.Partial(
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
      batch: t.Object(
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
      item: t.Object(
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
      performedBy: t.Partial(
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
      witnesses: t.Partial(
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
      description: `[PH17] إتلاف دفعة منتهية — واقعة موثَّقة بمنفّذ وشاهدٍ أو أكثر.
الإتلاف حدث يُسأل عنه لاحقًا («من أتلف ٢٠ أمبولة كيتامين ومن رأى ذلك؟»)، فلا يُختزل
في حركة مخزون بملاحظة نصّية. الشهود مستخدمون حقيقيّون في العيادة لا أسماء مكتوبة،
وعددهم مفتوح: مادة مراقبة قد تُلزم بشاهدين. حركة المخزون تحمل \`voucherId\` = هذا الصفّ.`,
    },
  ),
);

export const BatchDisposalWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          batchId: t.String(),
          itemId: t.String(),
          warehouseId: t.String(),
          qty: t.Integer(),
          reasonAr: t.String(),
          performedById: t.String(),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[PH17] إتلاف دفعة منتهية — واقعة موثَّقة بمنفّذ وشاهدٍ أو أكثر.
الإتلاف حدث يُسأل عنه لاحقًا («من أتلف ٢٠ أمبولة كيتامين ومن رأى ذلك؟»)، فلا يُختزل
في حركة مخزون بملاحظة نصّية. الشهود مستخدمون حقيقيّون في العيادة لا أسماء مكتوبة،
وعددهم مفتوح: مادة مراقبة قد تُلزم بشاهدين. حركة المخزون تحمل \`voucherId\` = هذا الصفّ.`,
        },
      ),
    { $id: "BatchDisposal" },
  ),
);

export const BatchDisposalWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `[PH17] إتلاف دفعة منتهية — واقعة موثَّقة بمنفّذ وشاهدٍ أو أكثر.
الإتلاف حدث يُسأل عنه لاحقًا («من أتلف ٢٠ أمبولة كيتامين ومن رأى ذلك؟»)، فلا يُختزل
في حركة مخزون بملاحظة نصّية. الشهود مستخدمون حقيقيّون في العيادة لا أسماء مكتوبة،
وعددهم مفتوح: مادة مراقبة قد تُلزم بشاهدين. حركة المخزون تحمل \`voucherId\` = هذا الصفّ.`,
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
              batchId: t.String(),
              itemId: t.String(),
              warehouseId: t.String(),
              qty: t.Integer(),
              reasonAr: t.String(),
              performedById: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "BatchDisposal" },
);

export const BatchDisposalSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      batchId: t.Boolean(),
      itemId: t.Boolean(),
      warehouseId: t.Boolean(),
      qty: t.Boolean(),
      reasonAr: t.Boolean(),
      performedById: t.Boolean(),
      createdAt: t.Boolean(),
      clinic: t.Boolean(),
      batch: t.Boolean(),
      item: t.Boolean(),
      performedBy: t.Boolean(),
      witnesses: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[PH17] إتلاف دفعة منتهية — واقعة موثَّقة بمنفّذ وشاهدٍ أو أكثر.
الإتلاف حدث يُسأل عنه لاحقًا («من أتلف ٢٠ أمبولة كيتامين ومن رأى ذلك؟»)، فلا يُختزل
في حركة مخزون بملاحظة نصّية. الشهود مستخدمون حقيقيّون في العيادة لا أسماء مكتوبة،
وعددهم مفتوح: مادة مراقبة قد تُلزم بشاهدين. حركة المخزون تحمل \`voucherId\` = هذا الصفّ.`,
    },
  ),
);

export const BatchDisposalInclude = t.Partial(
  t.Object(
    {
      clinic: t.Boolean(),
      batch: t.Boolean(),
      item: t.Boolean(),
      performedBy: t.Boolean(),
      witnesses: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[PH17] إتلاف دفعة منتهية — واقعة موثَّقة بمنفّذ وشاهدٍ أو أكثر.
الإتلاف حدث يُسأل عنه لاحقًا («من أتلف ٢٠ أمبولة كيتامين ومن رأى ذلك؟»)، فلا يُختزل
في حركة مخزون بملاحظة نصّية. الشهود مستخدمون حقيقيّون في العيادة لا أسماء مكتوبة،
وعددهم مفتوح: مادة مراقبة قد تُلزم بشاهدين. حركة المخزون تحمل \`voucherId\` = هذا الصفّ.`,
    },
  ),
);

export const BatchDisposalOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      batchId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      itemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      warehouseId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      qty: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reasonAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      performedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `[PH17] إتلاف دفعة منتهية — واقعة موثَّقة بمنفّذ وشاهدٍ أو أكثر.
الإتلاف حدث يُسأل عنه لاحقًا («من أتلف ٢٠ أمبولة كيتامين ومن رأى ذلك؟»)، فلا يُختزل
في حركة مخزون بملاحظة نصّية. الشهود مستخدمون حقيقيّون في العيادة لا أسماء مكتوبة،
وعددهم مفتوح: مادة مراقبة قد تُلزم بشاهدين. حركة المخزون تحمل \`voucherId\` = هذا الصفّ.`,
    },
  ),
);

export const BatchDisposal = t.Composite(
  [BatchDisposalPlain, BatchDisposalRelations],
  { additionalProperties: false },
);

export const BatchDisposalInputCreate = t.Composite(
  [BatchDisposalPlainInputCreate, BatchDisposalRelationsInputCreate],
  { additionalProperties: false },
);

export const BatchDisposalInputUpdate = t.Composite(
  [BatchDisposalPlainInputUpdate, BatchDisposalRelationsInputUpdate],
  { additionalProperties: false },
);
