import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PetOwnerRequestPlain = t.Object(
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
);

export const PetOwnerRequestRelations = t.Object(
  {
    account: t.Object(
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
    owner: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        name: t.String(),
        phone: t.String(),
        phoneE164: __nullable__(t.String()),
        email: __nullable__(t.String()),
        gender: __nullable__(
          t.Union(
            [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
            { additionalProperties: false },
          ),
        ),
        ownerType: t.Union(
          [
            t.Literal("ALL"),
            t.Literal("VIP"),
            t.Literal("LOYALTY"),
            t.Literal("NEW"),
            t.Literal("CURRENT"),
          ],
          { additionalProperties: false },
        ),
        relationship: __nullable__(
          t.Union(
            [
              t.Literal("OWNER"),
              t.Literal("GUARDIAN"),
              t.Literal("DELEGATE"),
              t.Literal("EMERGENCY"),
            ],
            { additionalProperties: false },
          ),
        ),
        country: __nullable__(t.String()),
        city: __nullable__(t.String()),
        address: __nullable__(t.String()),
        notes: __nullable__(t.String()),
        active: t.Boolean(),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        editsCount: t.Integer(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    patient: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          ownerId: __nullable__(t.String()),
          name: t.String(),
          nameNormalized: t.String(),
          gender: t.Union(
            [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
            { additionalProperties: false },
          ),
          animalTypeId: t.String(),
          animalStrainId: __nullable__(t.String()),
          age: __nullable__(t.Number()),
          birthDate: __nullable__(t.Date()),
          weight: __nullable__(t.Number()),
          microchipNumber: __nullable__(t.String()),
          coat: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    handledBy: __nullable__(
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
);

export const PetOwnerRequestPlainInputCreate = t.Object(
  {
    code: t.String(),
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
    body: t.Optional(__nullable__(t.String())),
    status: t.Optional(
      t.Union(
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
    ),
    handledAt: t.Optional(__nullable__(t.Date())),
    declineReason: t.Optional(__nullable__(t.String())),
    reply: t.Optional(
      __nullable__(
        t.String({
          description: `*
* ردّ العيادة كما يقرؤه المالك — منفصل عن سبب الرفض.`,
        }),
      ),
    ),
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
);

export const PetOwnerRequestPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    kind: t.Optional(
      t.Union(
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
    ),
    body: t.Optional(__nullable__(t.String())),
    status: t.Optional(
      t.Union(
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
    ),
    handledAt: t.Optional(__nullable__(t.Date())),
    declineReason: t.Optional(__nullable__(t.String())),
    reply: t.Optional(
      __nullable__(
        t.String({
          description: `*
* ردّ العيادة كما يقرؤه المالك — منفصل عن سبب الرفض.`,
        }),
      ),
    ),
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
);

export const PetOwnerRequestRelationsInputCreate = t.Object(
  {
    account: t.Object(
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
    owner: t.Object(
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
    patient: t.Optional(
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
    handledBy: t.Optional(
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
);

export const PetOwnerRequestRelationsInputUpdate = t.Partial(
  t.Object(
    {
      account: t.Object(
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
      owner: t.Object(
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
      patient: t.Partial(
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
      handledBy: t.Partial(
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
);

export const PetOwnerRequestWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          code: t.String(),
          accountId: t.String(),
          clinicId: t.String(),
          ownerId: t.String(),
          patientId: t.String(),
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
          body: t.String(),
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
          handledById: t.String(),
          handledAt: t.Date(),
          declineReason: t.String(),
          reply: t.String({
            description: `*
* ردّ العيادة كما يقرؤه المالك — منفصل عن سبب الرفض.`,
          }),
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
    { $id: "PetOwnerRequest" },
  ),
);

export const PetOwnerRequestWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), code: t.String() },
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
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ code: t.String() })],
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
              code: t.String(),
              accountId: t.String(),
              clinicId: t.String(),
              ownerId: t.String(),
              patientId: t.String(),
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
              body: t.String(),
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
              handledById: t.String(),
              handledAt: t.Date(),
              declineReason: t.String(),
              reply: t.String({
                description: `*
* ردّ العيادة كما يقرؤه المالك — منفصل عن سبب الرفض.`,
              }),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PetOwnerRequest" },
);

export const PetOwnerRequestSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      accountId: t.Boolean(),
      clinicId: t.Boolean(),
      ownerId: t.Boolean(),
      patientId: t.Boolean(),
      kind: t.Boolean(),
      body: t.Boolean(),
      status: t.Boolean(),
      handledById: t.Boolean(),
      handledAt: t.Boolean(),
      declineReason: t.Boolean(),
      reply: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      account: t.Boolean(),
      clinic: t.Boolean(),
      owner: t.Boolean(),
      patient: t.Boolean(),
      handledBy: t.Boolean(),
      _count: t.Boolean(),
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
);

export const PetOwnerRequestInclude = t.Partial(
  t.Object(
    {
      kind: t.Boolean(),
      status: t.Boolean(),
      account: t.Boolean(),
      clinic: t.Boolean(),
      owner: t.Boolean(),
      patient: t.Boolean(),
      handledBy: t.Boolean(),
      _count: t.Boolean(),
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
);

export const PetOwnerRequestOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      code: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      accountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ownerId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      patientId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      body: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      handledById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      handledAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      declineReason: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reply: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
);

export const PetOwnerRequest = t.Composite(
  [PetOwnerRequestPlain, PetOwnerRequestRelations],
  { additionalProperties: false },
);

export const PetOwnerRequestInputCreate = t.Composite(
  [PetOwnerRequestPlainInputCreate, PetOwnerRequestRelationsInputCreate],
  { additionalProperties: false },
);

export const PetOwnerRequestInputUpdate = t.Composite(
  [PetOwnerRequestPlainInputUpdate, PetOwnerRequestRelationsInputUpdate],
  { additionalProperties: false },
);
