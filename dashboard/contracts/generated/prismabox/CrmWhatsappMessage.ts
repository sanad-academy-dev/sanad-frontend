import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CrmWhatsappMessagePlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    referenceType: __nullable__(
      t.Union([t.Literal("LEAD"), t.Literal("DEAL")], {
        additionalProperties: false,
        description: `*
* §8.1 — one polymorphic pattern for every activity and the status log.`,
      }),
    ),
    referenceId: __nullable__(t.String()),
    direction: t.Union([t.Literal("OUTBOUND"), t.Literal("INBOUND")], {
      additionalProperties: false,
      description: `[CRM-P4] §9.2 — اتجاه الرسالة. الوارد يصل بالسحب من طابور المزوّد (§17.2 صفّ ١٨).`,
    }),
    chatId: t.String({
      description: `صيغة المزوّد \`<digits>@c.us\` كما أُرسلت أو وردت — لا تُشتقّ عند القراءة`,
    }),
    phoneNormalized: __nullable__(
      t.String({
        description: `الرقم المُطبَّع للمطابقة مع \`crm_lead.mobileNormalized\` وأخواته`,
      }),
    ),
    body: t.String(),
    providerMessageId: __nullable__(
      t.String({
        description: `\`idMessage\` من المزوّد — مفتاح المطابقة حين يصل تحديث الحالة لاحقًا`,
      }),
    ),
    status: __nullable__(
      t.Union(
        [
          t.Literal("SENT"),
          t.Literal("DELIVERED"),
          t.Literal("READ"),
          t.Literal("FAILED"),
        ],
        {
          additionalProperties: false,
          description: `[CRM-P4] §9.2 — حالة رسالة واتساب. **أربعة أعضاء، لا اثنان** (§17.2 صفّ ١٦).
يخالف \`CrmEmailStatus\` عمدًا: بوّابة Green API تُبلّغ sent/delivered/read/failed عبر
خطّاف \`outgoingMessageStatus\`، وGmail SMTP لا تُبلّغ شيئًا. العدد المختلف نتيجةُ
اختلاف الناقلَين، لا تناقضٌ يُصلَح بتوحيدهما.`,
        },
      ),
    ),
    failureReason: __nullable__(t.String()),
    sentByUserId: __nullable__(t.String()),
    at: t.Date(),
  },
  {
    additionalProperties: false,
    description: `[CRM-P4] §9.2 — سجلّ رسائل واتساب، بنمط §8.1 متعدّد الأشكال كسجلّ البريد.`,
  },
);

export const CrmWhatsappMessageRelations = t.Object(
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
    sentBy: __nullable__(
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
  },
  {
    additionalProperties: false,
    description: `[CRM-P4] §9.2 — سجلّ رسائل واتساب، بنمط §8.1 متعدّد الأشكال كسجلّ البريد.`,
  },
);

export const CrmWhatsappMessagePlainInputCreate = t.Object(
  {
    referenceType: t.Optional(
      __nullable__(
        t.Union([t.Literal("LEAD"), t.Literal("DEAL")], {
          additionalProperties: false,
          description: `*
* §8.1 — one polymorphic pattern for every activity and the status log.`,
        }),
      ),
    ),
    direction: t.Union([t.Literal("OUTBOUND"), t.Literal("INBOUND")], {
      additionalProperties: false,
      description: `[CRM-P4] §9.2 — اتجاه الرسالة. الوارد يصل بالسحب من طابور المزوّد (§17.2 صفّ ١٨).`,
    }),
    phoneNormalized: t.Optional(
      __nullable__(
        t.String({
          description: `الرقم المُطبَّع للمطابقة مع \`crm_lead.mobileNormalized\` وأخواته`,
        }),
      ),
    ),
    body: t.String(),
    status: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("SENT"),
            t.Literal("DELIVERED"),
            t.Literal("READ"),
            t.Literal("FAILED"),
          ],
          {
            additionalProperties: false,
            description: `[CRM-P4] §9.2 — حالة رسالة واتساب. **أربعة أعضاء، لا اثنان** (§17.2 صفّ ١٦).
يخالف \`CrmEmailStatus\` عمدًا: بوّابة Green API تُبلّغ sent/delivered/read/failed عبر
خطّاف \`outgoingMessageStatus\`، وGmail SMTP لا تُبلّغ شيئًا. العدد المختلف نتيجةُ
اختلاف الناقلَين، لا تناقضٌ يُصلَح بتوحيدهما.`,
          },
        ),
      ),
    ),
    failureReason: t.Optional(__nullable__(t.String())),
    at: t.Optional(t.Date()),
  },
  {
    additionalProperties: false,
    description: `[CRM-P4] §9.2 — سجلّ رسائل واتساب، بنمط §8.1 متعدّد الأشكال كسجلّ البريد.`,
  },
);

export const CrmWhatsappMessagePlainInputUpdate = t.Object(
  {
    referenceType: t.Optional(
      __nullable__(
        t.Union([t.Literal("LEAD"), t.Literal("DEAL")], {
          additionalProperties: false,
          description: `*
* §8.1 — one polymorphic pattern for every activity and the status log.`,
        }),
      ),
    ),
    direction: t.Optional(
      t.Union([t.Literal("OUTBOUND"), t.Literal("INBOUND")], {
        additionalProperties: false,
        description: `[CRM-P4] §9.2 — اتجاه الرسالة. الوارد يصل بالسحب من طابور المزوّد (§17.2 صفّ ١٨).`,
      }),
    ),
    phoneNormalized: t.Optional(
      __nullable__(
        t.String({
          description: `الرقم المُطبَّع للمطابقة مع \`crm_lead.mobileNormalized\` وأخواته`,
        }),
      ),
    ),
    body: t.Optional(t.String()),
    status: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("SENT"),
            t.Literal("DELIVERED"),
            t.Literal("READ"),
            t.Literal("FAILED"),
          ],
          {
            additionalProperties: false,
            description: `[CRM-P4] §9.2 — حالة رسالة واتساب. **أربعة أعضاء، لا اثنان** (§17.2 صفّ ١٦).
يخالف \`CrmEmailStatus\` عمدًا: بوّابة Green API تُبلّغ sent/delivered/read/failed عبر
خطّاف \`outgoingMessageStatus\`، وGmail SMTP لا تُبلّغ شيئًا. العدد المختلف نتيجةُ
اختلاف الناقلَين، لا تناقضٌ يُصلَح بتوحيدهما.`,
          },
        ),
      ),
    ),
    failureReason: t.Optional(__nullable__(t.String())),
    at: t.Optional(t.Date()),
  },
  {
    additionalProperties: false,
    description: `[CRM-P4] §9.2 — سجلّ رسائل واتساب، بنمط §8.1 متعدّد الأشكال كسجلّ البريد.`,
  },
);

export const CrmWhatsappMessageRelationsInputCreate = t.Object(
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
    sentBy: t.Optional(
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
  },
  {
    additionalProperties: false,
    description: `[CRM-P4] §9.2 — سجلّ رسائل واتساب، بنمط §8.1 متعدّد الأشكال كسجلّ البريد.`,
  },
);

export const CrmWhatsappMessageRelationsInputUpdate = t.Partial(
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
      sentBy: t.Partial(
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
    },
    {
      additionalProperties: false,
      description: `[CRM-P4] §9.2 — سجلّ رسائل واتساب، بنمط §8.1 متعدّد الأشكال كسجلّ البريد.`,
    },
  ),
);

export const CrmWhatsappMessageWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          referenceType: t.Union([t.Literal("LEAD"), t.Literal("DEAL")], {
            additionalProperties: false,
            description: `*
* §8.1 — one polymorphic pattern for every activity and the status log.`,
          }),
          referenceId: t.String(),
          direction: t.Union([t.Literal("OUTBOUND"), t.Literal("INBOUND")], {
            additionalProperties: false,
            description: `[CRM-P4] §9.2 — اتجاه الرسالة. الوارد يصل بالسحب من طابور المزوّد (§17.2 صفّ ١٨).`,
          }),
          chatId: t.String({
            description: `صيغة المزوّد \`<digits>@c.us\` كما أُرسلت أو وردت — لا تُشتقّ عند القراءة`,
          }),
          phoneNormalized: t.String({
            description: `الرقم المُطبَّع للمطابقة مع \`crm_lead.mobileNormalized\` وأخواته`,
          }),
          body: t.String(),
          providerMessageId: t.String({
            description: `\`idMessage\` من المزوّد — مفتاح المطابقة حين يصل تحديث الحالة لاحقًا`,
          }),
          status: t.Union(
            [
              t.Literal("SENT"),
              t.Literal("DELIVERED"),
              t.Literal("READ"),
              t.Literal("FAILED"),
            ],
            {
              additionalProperties: false,
              description: `[CRM-P4] §9.2 — حالة رسالة واتساب. **أربعة أعضاء، لا اثنان** (§17.2 صفّ ١٦).
يخالف \`CrmEmailStatus\` عمدًا: بوّابة Green API تُبلّغ sent/delivered/read/failed عبر
خطّاف \`outgoingMessageStatus\`، وGmail SMTP لا تُبلّغ شيئًا. العدد المختلف نتيجةُ
اختلاف الناقلَين، لا تناقضٌ يُصلَح بتوحيدهما.`,
            },
          ),
          failureReason: t.String(),
          sentByUserId: t.String(),
          at: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[CRM-P4] §9.2 — سجلّ رسائل واتساب، بنمط §8.1 متعدّد الأشكال كسجلّ البريد.`,
        },
      ),
    { $id: "CrmWhatsappMessage" },
  ),
);

export const CrmWhatsappMessageWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `[CRM-P4] §9.2 — سجلّ رسائل واتساب، بنمط §8.1 متعدّد الأشكال كسجلّ البريد.`,
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
              referenceType: t.Union([t.Literal("LEAD"), t.Literal("DEAL")], {
                additionalProperties: false,
                description: `*
* §8.1 — one polymorphic pattern for every activity and the status log.`,
              }),
              referenceId: t.String(),
              direction: t.Union(
                [t.Literal("OUTBOUND"), t.Literal("INBOUND")],
                {
                  additionalProperties: false,
                  description: `[CRM-P4] §9.2 — اتجاه الرسالة. الوارد يصل بالسحب من طابور المزوّد (§17.2 صفّ ١٨).`,
                },
              ),
              chatId: t.String({
                description: `صيغة المزوّد \`<digits>@c.us\` كما أُرسلت أو وردت — لا تُشتقّ عند القراءة`,
              }),
              phoneNormalized: t.String({
                description: `الرقم المُطبَّع للمطابقة مع \`crm_lead.mobileNormalized\` وأخواته`,
              }),
              body: t.String(),
              providerMessageId: t.String({
                description: `\`idMessage\` من المزوّد — مفتاح المطابقة حين يصل تحديث الحالة لاحقًا`,
              }),
              status: t.Union(
                [
                  t.Literal("SENT"),
                  t.Literal("DELIVERED"),
                  t.Literal("READ"),
                  t.Literal("FAILED"),
                ],
                {
                  additionalProperties: false,
                  description: `[CRM-P4] §9.2 — حالة رسالة واتساب. **أربعة أعضاء، لا اثنان** (§17.2 صفّ ١٦).
يخالف \`CrmEmailStatus\` عمدًا: بوّابة Green API تُبلّغ sent/delivered/read/failed عبر
خطّاف \`outgoingMessageStatus\`، وGmail SMTP لا تُبلّغ شيئًا. العدد المختلف نتيجةُ
اختلاف الناقلَين، لا تناقضٌ يُصلَح بتوحيدهما.`,
                },
              ),
              failureReason: t.String(),
              sentByUserId: t.String(),
              at: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "CrmWhatsappMessage" },
);

export const CrmWhatsappMessageSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      referenceType: t.Boolean(),
      referenceId: t.Boolean(),
      direction: t.Boolean(),
      chatId: t.Boolean(),
      phoneNormalized: t.Boolean(),
      body: t.Boolean(),
      providerMessageId: t.Boolean(),
      status: t.Boolean(),
      failureReason: t.Boolean(),
      sentByUserId: t.Boolean(),
      at: t.Boolean(),
      clinic: t.Boolean(),
      sentBy: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[CRM-P4] §9.2 — سجلّ رسائل واتساب، بنمط §8.1 متعدّد الأشكال كسجلّ البريد.`,
    },
  ),
);

export const CrmWhatsappMessageInclude = t.Partial(
  t.Object(
    {
      referenceType: t.Boolean(),
      direction: t.Boolean(),
      status: t.Boolean(),
      clinic: t.Boolean(),
      sentBy: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[CRM-P4] §9.2 — سجلّ رسائل واتساب، بنمط §8.1 متعدّد الأشكال كسجلّ البريد.`,
    },
  ),
);

export const CrmWhatsappMessageOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      referenceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      chatId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      phoneNormalized: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      body: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      providerMessageId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      failureReason: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sentByUserId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      at: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `[CRM-P4] §9.2 — سجلّ رسائل واتساب، بنمط §8.1 متعدّد الأشكال كسجلّ البريد.`,
    },
  ),
);

export const CrmWhatsappMessage = t.Composite(
  [CrmWhatsappMessagePlain, CrmWhatsappMessageRelations],
  { additionalProperties: false },
);

export const CrmWhatsappMessageInputCreate = t.Composite(
  [CrmWhatsappMessagePlainInputCreate, CrmWhatsappMessageRelationsInputCreate],
  { additionalProperties: false },
);

export const CrmWhatsappMessageInputUpdate = t.Composite(
  [CrmWhatsappMessagePlainInputUpdate, CrmWhatsappMessageRelationsInputUpdate],
  { additionalProperties: false },
);
