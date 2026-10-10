import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PetOwnerAccountPlain = t.Object(
  {
    id: t.String(),
    phoneE164: t.String(),
    passwordHash: t.String({
      description: `*
* كلمة المرور مُجزّأة بـscrypt (\`salt:hash\`) لا مخزَّنة.
* تولّدها العيادة وتسلّمها للمالك، ولذلك \`mustChangePassword\` افتراضه \`true\`:
* كلمة مرور يعرفها موظّف الاستقبال ليست سرًّا بين المالك والنظام حتى يغيّرها.`,
    }),
    mustChangePassword: t.Boolean(),
    passwordSetAt: t.Date(),
    name: __nullable__(t.String()),
    email: __nullable__(t.String()),
    locale: t.String(),
    status: t.Union([t.Literal("ACTIVE"), t.Literal("SUSPENDED")], {
      additionalProperties: false,
    }),
    failedAttempts: t.Integer({
      description: `*
* حماية من التخمين: تُصفَّر عند نجاح الدخول.`,
    }),
    lockedUntil: __nullable__(t.Date()),
    lastSignInAt: __nullable__(t.Date()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `*
* حساب المالك — **عالمي لا مرتبط بعيادة**.
* \`Owner\` مُقيَّد بـ(clinicId, phone)، فالإنسان الواحد المتعامل مع ثلاث عيادات ثلاثة
* صفوف. وتسجيل الدخول شخصٌ لا صفّ — ولذلك هذا الجدول يقوم على الهاتف وحده، ويرتبط
* بصفوف \`Owner\` عبر \`PetOwnerClinicLink\`.`,
  },
);

export const PetOwnerAccountRelations = t.Object(
  {
    links: t.Array(
      t.Object(
        {
          id: t.String(),
          accountId: t.String(),
          ownerId: t.String(),
          clinicId: t.String(),
          source: t.Union(
            [t.Literal("PHONE_MATCH"), t.Literal("STAFF_ISSUED")],
            {
              additionalProperties: false,
              description: `*
* كيف نشأ الربط بين حساب المالك وسجلّه في عيادة بعينها.`,
            },
          ),
          hiddenByOwner: t.Boolean({
            description: `*
* المالك أخفى العيادة من تطبيقه — لا يقطع الربط ولا يمسّ سجلّه لديها.`,
          }),
          revokedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    sessions: t.Array(
      t.Object(
        {
          id: t.String(),
          accountId: t.String(),
          tokenHash: t.String(),
          tokenPrefix: t.String(),
          userAgent: __nullable__(t.String()),
          expiresAt: t.Date(),
          revokedAt: __nullable__(t.Date()),
          lastSeenAt: t.Date(),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `*
* جلسة جهاز واحد.
* الرمز الخام لا يُخزَّن: يُحفظ \`sha256\` منه، فتسريب قاعدة البيانات لا يُنتج جلسات
* صالحة. و\`tokenPrefix\` للعرض في شاشة «الأجهزة» فقط.`,
        },
      ),
      { additionalProperties: false },
    ),
    preferences: t.Array(
      t.Object(
        {
          id: t.String(),
          accountId: t.String(),
          category: t.Union(
            [
              t.Literal("APPOINTMENT"),
              t.Literal("REMINDER_DUE"),
              t.Literal("RESULTS"),
              t.Literal("BILLING"),
              t.Literal("CHAT"),
              t.Literal("MARKETING"),
            ],
            { additionalProperties: false },
          ),
          push: t.Boolean(),
          email: t.Boolean(),
          sms: t.Boolean(),
          whatsapp: t.Boolean(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    reads: t.Array(
      t.Object(
        {
          id: t.String(),
          accountId: t.String(),
          key: t.String({
            description: `*
* مفتاح مستقرّ يُشتقّ من مصدر التنبيه — مثال: «vacc:<recordId>».`,
          }),
          readAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    devices: t.Array(
      t.Object(
        {
          id: t.String(),
          accountId: t.String(),
          platform: t.Union(
            [t.Literal("IOS"), t.Literal("ANDROID"), t.Literal("WEB")],
            {
              additionalProperties: false,
              description: `*
* تفضيلات التنبيه لكل فئة × قناة. صفٌّ واحد لكل فئة، يُنشأ عند أوّل تعديل.`,
            },
          ),
          expoPushToken: __nullable__(t.String()),
          appVersion: __nullable__(t.String()),
          osVersion: __nullable__(t.String()),
          pushEnabled: t.Boolean(),
          lastSeenAt: t.Date(),
          revokedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `*
* جهاز مسجَّل لاستقبال الإشعارات.
* \`expoPushToken\` فريد عالميًّا لا لكل حساب: الرمز يخصّ **التثبيت** لا الشخص، فلو
* سجّل مالكٌ آخر دخوله على الهاتف نفسه وجب أن ينتقل الرمز إليه — وإلّا وصلت تنبيهات
* الأوّل إلى الثاني.`,
        },
      ),
      { additionalProperties: false },
    ),
    ownerRequests: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          accountId: t.String(),
          clinicId: t.String(),
          ownerId: t.String(),
          patientId: __nullable__(t.String()),
          kind: t.Union(
            [
              t.Literal("REFILL"),
              t.Literal("RECORDS"),
              t.Literal("CERTIFICATE"),
              t.Literal("CALLBACK"),
              t.Literal("QUESTION"),
              t.Literal("CANCEL_APPOINTMENT"),
            ],
            { additionalProperties: false },
          ),
          body: __nullable__(t.String()),
          status: t.Union(
            [
              t.Literal("NEW"),
              t.Literal("IN_REVIEW"),
              t.Literal("APPROVED"),
              t.Literal("DECLINED"),
              t.Literal("FULFILLED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          handledById: __nullable__(t.String()),
          handledAt: __nullable__(t.Date()),
          declineReason: __nullable__(t.String()),
          reply: __nullable__(
            t.String({
              description: `*
* ردّ العيادة كما يقرؤه المالك — منفصل عن سبب الرفض.`,
            }),
          ),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `*
* ما قرأه المالك من التنبيهات.
* التنبيهات **مشتقّة** من السجلّات (جرعة مستحقّة، موعد قادم، فاتورة غير مدفوعة) ولا
* تُخزَّن صفوفًا — فلا يوجد ما يُعلَّم عليه «مقروء». هذا الجدول يحفظ المفتاح الثابت
* للتنبيه المشتقّ وحده، فيبقى الاشتقاق مصدر الحقيقة وتبقى حالة القراءة للمالك.
*
* [PP] طلبٌ مكتوب من مالك عبر التطبيق — تجديد دواء، تقرير، شهادة، سؤال، طلب اتصال.
* جدولٌ مستقلّ لا إعادة استعمال لـ\`MobileBookingRequest\`: ذاك طابور الزيارات المنزلية،
* وحشرُ طلب تجديدِ دواءٍ فيه يُفسد الطابور الذي تعمل عليه المركبات كل يوم.
* \`ownerId\` مطلوب: الطلب من حسابٍ موثَّق دائمًا، فلا مطابقة أرقام هنا ولا طلبٌ يتيم.`,
        },
      ),
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `*
* حساب المالك — **عالمي لا مرتبط بعيادة**.
* \`Owner\` مُقيَّد بـ(clinicId, phone)، فالإنسان الواحد المتعامل مع ثلاث عيادات ثلاثة
* صفوف. وتسجيل الدخول شخصٌ لا صفّ — ولذلك هذا الجدول يقوم على الهاتف وحده، ويرتبط
* بصفوف \`Owner\` عبر \`PetOwnerClinicLink\`.`,
  },
);

export const PetOwnerAccountPlainInputCreate = t.Object(
  {
    phoneE164: t.String(),
    passwordHash: t.String({
      description: `*
* كلمة المرور مُجزّأة بـscrypt (\`salt:hash\`) لا مخزَّنة.
* تولّدها العيادة وتسلّمها للمالك، ولذلك \`mustChangePassword\` افتراضه \`true\`:
* كلمة مرور يعرفها موظّف الاستقبال ليست سرًّا بين المالك والنظام حتى يغيّرها.`,
    }),
    mustChangePassword: t.Optional(t.Boolean()),
    passwordSetAt: t.Optional(t.Date()),
    name: t.Optional(__nullable__(t.String())),
    email: t.Optional(__nullable__(t.String())),
    locale: t.Optional(t.String()),
    status: t.Optional(
      t.Union([t.Literal("ACTIVE"), t.Literal("SUSPENDED")], {
        additionalProperties: false,
      }),
    ),
    failedAttempts: t.Optional(
      t.Integer({
        description: `*
* حماية من التخمين: تُصفَّر عند نجاح الدخول.`,
      }),
    ),
    lockedUntil: t.Optional(__nullable__(t.Date())),
    lastSignInAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `*
* حساب المالك — **عالمي لا مرتبط بعيادة**.
* \`Owner\` مُقيَّد بـ(clinicId, phone)، فالإنسان الواحد المتعامل مع ثلاث عيادات ثلاثة
* صفوف. وتسجيل الدخول شخصٌ لا صفّ — ولذلك هذا الجدول يقوم على الهاتف وحده، ويرتبط
* بصفوف \`Owner\` عبر \`PetOwnerClinicLink\`.`,
  },
);

export const PetOwnerAccountPlainInputUpdate = t.Object(
  {
    phoneE164: t.Optional(t.String()),
    passwordHash: t.Optional(
      t.String({
        description: `*
* كلمة المرور مُجزّأة بـscrypt (\`salt:hash\`) لا مخزَّنة.
* تولّدها العيادة وتسلّمها للمالك، ولذلك \`mustChangePassword\` افتراضه \`true\`:
* كلمة مرور يعرفها موظّف الاستقبال ليست سرًّا بين المالك والنظام حتى يغيّرها.`,
      }),
    ),
    mustChangePassword: t.Optional(t.Boolean()),
    passwordSetAt: t.Optional(t.Date()),
    name: t.Optional(__nullable__(t.String())),
    email: t.Optional(__nullable__(t.String())),
    locale: t.Optional(t.String()),
    status: t.Optional(
      t.Union([t.Literal("ACTIVE"), t.Literal("SUSPENDED")], {
        additionalProperties: false,
      }),
    ),
    failedAttempts: t.Optional(
      t.Integer({
        description: `*
* حماية من التخمين: تُصفَّر عند نجاح الدخول.`,
      }),
    ),
    lockedUntil: t.Optional(__nullable__(t.Date())),
    lastSignInAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `*
* حساب المالك — **عالمي لا مرتبط بعيادة**.
* \`Owner\` مُقيَّد بـ(clinicId, phone)، فالإنسان الواحد المتعامل مع ثلاث عيادات ثلاثة
* صفوف. وتسجيل الدخول شخصٌ لا صفّ — ولذلك هذا الجدول يقوم على الهاتف وحده، ويرتبط
* بصفوف \`Owner\` عبر \`PetOwnerClinicLink\`.`,
  },
);

export const PetOwnerAccountRelationsInputCreate = t.Object(
  {
    links: t.Optional(
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
    sessions: t.Optional(
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
    preferences: t.Optional(
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
    reads: t.Optional(
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
    devices: t.Optional(
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
    ownerRequests: t.Optional(
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
    description: `*
* حساب المالك — **عالمي لا مرتبط بعيادة**.
* \`Owner\` مُقيَّد بـ(clinicId, phone)، فالإنسان الواحد المتعامل مع ثلاث عيادات ثلاثة
* صفوف. وتسجيل الدخول شخصٌ لا صفّ — ولذلك هذا الجدول يقوم على الهاتف وحده، ويرتبط
* بصفوف \`Owner\` عبر \`PetOwnerClinicLink\`.`,
  },
);

export const PetOwnerAccountRelationsInputUpdate = t.Partial(
  t.Object(
    {
      links: t.Partial(
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
      sessions: t.Partial(
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
      preferences: t.Partial(
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
      reads: t.Partial(
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
      devices: t.Partial(
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
      ownerRequests: t.Partial(
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
      description: `*
* حساب المالك — **عالمي لا مرتبط بعيادة**.
* \`Owner\` مُقيَّد بـ(clinicId, phone)، فالإنسان الواحد المتعامل مع ثلاث عيادات ثلاثة
* صفوف. وتسجيل الدخول شخصٌ لا صفّ — ولذلك هذا الجدول يقوم على الهاتف وحده، ويرتبط
* بصفوف \`Owner\` عبر \`PetOwnerClinicLink\`.`,
    },
  ),
);

export const PetOwnerAccountWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          phoneE164: t.String(),
          passwordHash: t.String({
            description: `*
* كلمة المرور مُجزّأة بـscrypt (\`salt:hash\`) لا مخزَّنة.
* تولّدها العيادة وتسلّمها للمالك، ولذلك \`mustChangePassword\` افتراضه \`true\`:
* كلمة مرور يعرفها موظّف الاستقبال ليست سرًّا بين المالك والنظام حتى يغيّرها.`,
          }),
          mustChangePassword: t.Boolean(),
          passwordSetAt: t.Date(),
          name: t.String(),
          email: t.String(),
          locale: t.String(),
          status: t.Union([t.Literal("ACTIVE"), t.Literal("SUSPENDED")], {
            additionalProperties: false,
          }),
          failedAttempts: t.Integer({
            description: `*
* حماية من التخمين: تُصفَّر عند نجاح الدخول.`,
          }),
          lockedUntil: t.Date(),
          lastSignInAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `*
* حساب المالك — **عالمي لا مرتبط بعيادة**.
* \`Owner\` مُقيَّد بـ(clinicId, phone)، فالإنسان الواحد المتعامل مع ثلاث عيادات ثلاثة
* صفوف. وتسجيل الدخول شخصٌ لا صفّ — ولذلك هذا الجدول يقوم على الهاتف وحده، ويرتبط
* بصفوف \`Owner\` عبر \`PetOwnerClinicLink\`.`,
        },
      ),
    { $id: "PetOwnerAccount" },
  ),
);

export const PetOwnerAccountWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), phoneE164: t.String() },
            {
              additionalProperties: false,
              description: `*
* حساب المالك — **عالمي لا مرتبط بعيادة**.
* \`Owner\` مُقيَّد بـ(clinicId, phone)، فالإنسان الواحد المتعامل مع ثلاث عيادات ثلاثة
* صفوف. وتسجيل الدخول شخصٌ لا صفّ — ولذلك هذا الجدول يقوم على الهاتف وحده، ويرتبط
* بصفوف \`Owner\` عبر \`PetOwnerClinicLink\`.`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ phoneE164: t.String() })],
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
              phoneE164: t.String(),
              passwordHash: t.String({
                description: `*
* كلمة المرور مُجزّأة بـscrypt (\`salt:hash\`) لا مخزَّنة.
* تولّدها العيادة وتسلّمها للمالك، ولذلك \`mustChangePassword\` افتراضه \`true\`:
* كلمة مرور يعرفها موظّف الاستقبال ليست سرًّا بين المالك والنظام حتى يغيّرها.`,
              }),
              mustChangePassword: t.Boolean(),
              passwordSetAt: t.Date(),
              name: t.String(),
              email: t.String(),
              locale: t.String(),
              status: t.Union([t.Literal("ACTIVE"), t.Literal("SUSPENDED")], {
                additionalProperties: false,
              }),
              failedAttempts: t.Integer({
                description: `*
* حماية من التخمين: تُصفَّر عند نجاح الدخول.`,
              }),
              lockedUntil: t.Date(),
              lastSignInAt: t.Date(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PetOwnerAccount" },
);

export const PetOwnerAccountSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      phoneE164: t.Boolean(),
      passwordHash: t.Boolean(),
      mustChangePassword: t.Boolean(),
      passwordSetAt: t.Boolean(),
      name: t.Boolean(),
      email: t.Boolean(),
      locale: t.Boolean(),
      status: t.Boolean(),
      failedAttempts: t.Boolean(),
      lockedUntil: t.Boolean(),
      lastSignInAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      links: t.Boolean(),
      sessions: t.Boolean(),
      preferences: t.Boolean(),
      reads: t.Boolean(),
      devices: t.Boolean(),
      ownerRequests: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `*
* حساب المالك — **عالمي لا مرتبط بعيادة**.
* \`Owner\` مُقيَّد بـ(clinicId, phone)، فالإنسان الواحد المتعامل مع ثلاث عيادات ثلاثة
* صفوف. وتسجيل الدخول شخصٌ لا صفّ — ولذلك هذا الجدول يقوم على الهاتف وحده، ويرتبط
* بصفوف \`Owner\` عبر \`PetOwnerClinicLink\`.`,
    },
  ),
);

export const PetOwnerAccountInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      links: t.Boolean(),
      sessions: t.Boolean(),
      preferences: t.Boolean(),
      reads: t.Boolean(),
      devices: t.Boolean(),
      ownerRequests: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `*
* حساب المالك — **عالمي لا مرتبط بعيادة**.
* \`Owner\` مُقيَّد بـ(clinicId, phone)، فالإنسان الواحد المتعامل مع ثلاث عيادات ثلاثة
* صفوف. وتسجيل الدخول شخصٌ لا صفّ — ولذلك هذا الجدول يقوم على الهاتف وحده، ويرتبط
* بصفوف \`Owner\` عبر \`PetOwnerClinicLink\`.`,
    },
  ),
);

export const PetOwnerAccountOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      phoneE164: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      passwordHash: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      mustChangePassword: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      passwordSetAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      email: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      locale: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      failedAttempts: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lockedUntil: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lastSignInAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `*
* حساب المالك — **عالمي لا مرتبط بعيادة**.
* \`Owner\` مُقيَّد بـ(clinicId, phone)، فالإنسان الواحد المتعامل مع ثلاث عيادات ثلاثة
* صفوف. وتسجيل الدخول شخصٌ لا صفّ — ولذلك هذا الجدول يقوم على الهاتف وحده، ويرتبط
* بصفوف \`Owner\` عبر \`PetOwnerClinicLink\`.`,
    },
  ),
);

export const PetOwnerAccount = t.Composite(
  [PetOwnerAccountPlain, PetOwnerAccountRelations],
  { additionalProperties: false },
);

export const PetOwnerAccountInputCreate = t.Composite(
  [PetOwnerAccountPlainInputCreate, PetOwnerAccountRelationsInputCreate],
  { additionalProperties: false },
);

export const PetOwnerAccountInputUpdate = t.Composite(
  [PetOwnerAccountPlainInputUpdate, PetOwnerAccountRelationsInputUpdate],
  { additionalProperties: false },
);
