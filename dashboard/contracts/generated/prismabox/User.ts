import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const UserPlain = t.Object(
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
);

export const UserRelations = t.Object(
  {
    sessions: t.Array(
      t.Object(
        {
          id: t.String(),
          expiresAt: t.Date(),
          token: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          ipAddress: __nullable__(t.String()),
          userAgent: __nullable__(t.String()),
          userId: t.String(),
          activeClinicId: __nullable__(t.String()),
          role: __nullable__(t.String()),
          permissions: __nullable__(t.String()),
          rbacVersion: __nullable__(t.Integer()),
          currencyCode: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    accounts: t.Array(
      t.Object(
        {
          id: t.String(),
          accountId: t.String(),
          providerId: t.String(),
          userId: t.String(),
          accessToken: __nullable__(t.String()),
          refreshToken: __nullable__(t.String()),
          idToken: __nullable__(t.String()),
          accessTokenExpiresAt: __nullable__(t.Date()),
          refreshTokenExpiresAt: __nullable__(t.Date()),
          scope: __nullable__(t.String()),
          password: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    clinicUsers: t.Array(
      t.Object(
        {
          id: t.String(),
          userId: t.String(),
          clinicId: t.String(),
          role: t.Union([t.Literal("ADMIN"), t.Literal("MEMBER")], {
            additionalProperties: false,
          }),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    invitesSent: t.Array(
      t.Object(
        {
          id: t.String(),
          email: t.String(),
          clinicId: t.String(),
          role: t.Union([t.Literal("ADMIN"), t.Literal("MEMBER")], {
            additionalProperties: false,
          }),
          token: t.String(),
          expiresAt: t.Date(),
          accepted: t.Boolean(),
          invitedById: t.String(),
          staffId: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    assignedTasks: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          code: t.String(),
          title: t.String(),
          content: __nullable__(t.String()),
          type: t.Union(
            [
              t.Literal("ADMINISTRATIVE"),
              t.Literal("PHARMACEUTICALS"),
              t.Literal("INVENTORY"),
              t.Literal("FINANCE"),
              t.Literal("LABORATORY"),
              t.Literal("COSMETICS"),
              t.Literal("MEDICAL"),
            ],
            { additionalProperties: false },
          ),
          status: t.Union(
            [
              t.Literal("PENDING"),
              t.Literal("NOT_YET_STARTED"),
              t.Literal("IN_PROGRESS"),
              t.Literal("COMPLETED"),
              t.Literal("CANCELLED"),
              t.Literal("DUPLICATE"),
              t.Literal("QUEUE"),
            ],
            { additionalProperties: false },
          ),
          priority: t.Union(
            [
              t.Literal("LOW"),
              t.Literal("MEDIUM"),
              t.Literal("HIGH"),
              t.Literal("URGENT"),
            ],
            { additionalProperties: false },
          ),
          createdById: __nullable__(t.String()),
          deadline: __nullable__(t.Date()),
          images: t.Array(t.String(), { additionalProperties: false }),
          declinedAt: __nullable__(t.Date()),
          declineReason: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    createdTasks: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          code: t.String(),
          title: t.String(),
          content: __nullable__(t.String()),
          type: t.Union(
            [
              t.Literal("ADMINISTRATIVE"),
              t.Literal("PHARMACEUTICALS"),
              t.Literal("INVENTORY"),
              t.Literal("FINANCE"),
              t.Literal("LABORATORY"),
              t.Literal("COSMETICS"),
              t.Literal("MEDICAL"),
            ],
            { additionalProperties: false },
          ),
          status: t.Union(
            [
              t.Literal("PENDING"),
              t.Literal("NOT_YET_STARTED"),
              t.Literal("IN_PROGRESS"),
              t.Literal("COMPLETED"),
              t.Literal("CANCELLED"),
              t.Literal("DUPLICATE"),
              t.Literal("QUEUE"),
            ],
            { additionalProperties: false },
          ),
          priority: t.Union(
            [
              t.Literal("LOW"),
              t.Literal("MEDIUM"),
              t.Literal("HIGH"),
              t.Literal("URGENT"),
            ],
            { additionalProperties: false },
          ),
          createdById: __nullable__(t.String()),
          deadline: __nullable__(t.Date()),
          images: t.Array(t.String(), { additionalProperties: false }),
          declinedAt: __nullable__(t.Date()),
          declineReason: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    crmOwnedLeads: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          firstName: t.String(),
          lastName: __nullable__(t.String()),
          fullName: t.String({
            description: `مشتقّ من الجزأين (BR-C3.1) — يُخزَّن ليُبحَث ويُرتَّب عليه بلا حساب في كل استعلام`,
          }),
          gender: __nullable__(
            t.Union(
              [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
              { additionalProperties: false },
            ),
          ),
          mobile: t.String(),
          mobileNormalized: __nullable__(
            t.String({
              description: `[CRM-P1 Q2] الشكل القابل للمقارنة وحده — يُشتقّ بـ\`normalizePhone\` من
\`src/lib/validation/phone.ts\` (النسخة المرجعية تحت lib/، لا نظيرتها في
vaccination-reminder التي تُخرج شكلًا مختلفًا). \`mobile\` يبقى كما أدخله المستخدم،
تمامًا كما يفعل \`Owner.phone\`. لا قيد فريد: BR-C3.2 تحذير لا رفض.`,
            }),
          ),
          phone: __nullable__(t.String()),
          email: __nullable__(t.String()),
          city: __nullable__(t.String()),
          address: __nullable__(t.String()),
          petSpecies: __nullable__(t.String()),
          petCount: __nullable__(t.Integer()),
          petNotes: __nullable__(t.String()),
          statusId: t.String(),
          sourceId: __nullable__(t.String()),
          ownerUserId: __nullable__(t.String()),
          communicationStatus: __nullable__(t.String()),
          lostReasonId: __nullable__(t.String()),
          lostNotes: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          convertedDealId: __nullable__(
            t.String({
              description: `[CRM-P2] §5 — التحويل. §3.1 يذكرهما، وCRM-P1 لم يشحنهما لأن §15 يضع «أعمدة التحويل»
في P2. \`convertedDealId\` بلا علاقة صريحة: الصفقة تحمل \`leadId\` وهي الجهة المالكة
للعلاقة، وعمودٌ ثانٍ بعلاقةٍ معاكسة يخلق دورةً في المخطَّط بلا فائدة.`,
            }),
          ),
          convertedAt: __nullable__(t.Date()),
          slaPolicyId: __nullable__(
            t.String({
              description: `[CRM-P5] §10 — نفس الحقول الخمسة التي حملتها الصفقة منذ CRM-P2 فارغة. السياسة
تنطبق على العميل المحتمل أو الصفقة أو كليهما (§10.1)، فلا معنى لعمودٍ على أحدهما.
\`slaPolicyId\` **لقطة** لا علاقة حيّة: تعديل السياسة بعد انطباقها لا يُحرّك موعدًا
قائمًا، وحذفها لا يمحو تاريخ الاستجابة.`,
            }),
          ),
          responseBy: __nullable__(t.Date()),
          firstRespondedAt: __nullable__(t.Date()),
          firstResponseDuration: __nullable__(t.Integer()),
          slaStatus: __nullable__(
            t.Union(
              [t.Literal("DUE"), t.Literal("FULFILLED"), t.Literal("FAILED")],
              {
                additionalProperties: false,
                description: `[CRM-P2] §10.3 — حالة اتفاقية مستوى الخدمة. العمود يُشحن فارغًا الآن؛ المحرّك في CRM-P5.`,
              },
            ),
          ),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false, description: `§3.1 — العميل المحتمل.` },
      ),
      { additionalProperties: false },
    ),
    crmStatusChanges: t.Array(
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
          fromStatusId: __nullable__(t.String()),
          toStatusId: t.String(),
          durationInPrevious: __nullable__(
            t.Integer({
              description: `الثواني التي قضاها المستند في حالته السابقة؛ null لأول تسجيل (لا سابقة له)`,
            }),
          ),
          byUserId: __nullable__(t.String()),
          at: t.Date(),
        },
        {
          additionalProperties: false,
          description: `BR-C3.4 — كل انتقال حالة يُسجَّل ومعه مدة البقاء في الحالة السابقة: وقود تقارير
السرعة في §12. جدول واحد يخدم العملاء المحتملين والصفقات عبر نمط §8.1.`,
        },
      ),
      { additionalProperties: false },
    ),
    crmAuthoredNotes: t.Array(
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
          title: __nullable__(t.String()),
          content: t.String(),
          authorUserId: __nullable__(t.String()),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `§8.2 — ملاحظة على عميل محتمل أو صفقة.`,
        },
      ),
      { additionalProperties: false },
    ),
    crmEmailsSent: t.Array(
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
          templateId: __nullable__(
            t.String({
              description: `القالب المستعمَل إن وُجد؛ \`SetNull\` فحذف قالبٍ لا يمحو سجلّ ما أُرسل به`,
            }),
          ),
          toAddress: t.String(),
          subject: t.String(),
          body: t.String(),
          replyTo: __nullable__(
            t.String({
              description: `عنوان الردّ الذي ضُبِط فعلًا (§17.2 صفّ ١٣) — يُخزَّن لأن إعدادات العيادة قد تتغيّر،
فالسجلّ يقول أين كانت الردود تذهب وقتها، لا أين تذهب اليوم`,
            }),
          ),
          status: t.Union([t.Literal("SENT"), t.Literal("FAILED")], {
            additionalProperties: false,
            description: `[CRM-P3] §9.1 — حالة رسالة البريد. عضوان فقط، وهذا مقصود (قرار المالك، §17.2 صفّ ١٢).
النقل الحالي (Gmail SMTP عبر nodemailer) يحسم عند **قبول** الخادم للرسالة، لا عند
تسليمها: لا تقارير فتح، ولا إيصالات تسليم، ولا خطّاف ارتداد — الارتدادات تعود بريدًا
إلى الصندوق المُرسِل ولا يقرؤه شيء هنا. فأيّ عضوٍ ثالث (DELIVERED/OPENED) سيكون حالةً
لا يستطيع النظام معرفتها. لا تُضِف عضوًا هنا قبل أن يتغيّر النقل نفسه.`,
          }),
          failureReason: __nullable__(
            t.String({
              description: `رسالة خطأ SMTP حين FAILED — تُعرض للمستخدم كما هي، فهي التشخيص الوحيد المتاح`,
            }),
          ),
          sentByUserId: __nullable__(t.String()),
          sentAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[CRM-P3] §9.1 — سجلّ الرسائل الصادرة، بنمط §8.1 متعدّد الأشكال ليخدم العميل المحتمل
والصفقة معًا. هذا **أوّل** حفظٍ لبريدٍ صادر في المستودع: المواضع الأربعة القائمة
(المصروفات، الإجازات، كشف الحساب، رمز الدخول) لا تسجّل شيئًا.
المُرسَل يُخزَّن **بعد** حلّ المتغيّرات: القالب قد يتغيّر لاحقًا، وسجلٌّ يعيد التوليد
من قالبٍ مُعدَّل يعرض نصًّا لم يُرسَل قط.`,
        },
      ),
      { additionalProperties: false },
    ),
    crmWhatsappSent: t.Array(
      t.Object(
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
      ),
      { additionalProperties: false },
    ),
    crmSavedViews: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          userId: t.String(),
          entity: t.Union([t.Literal("LEAD"), t.Literal("DEAL")], {
            additionalProperties: false,
            description: `*
* §8.1 — one polymorphic pattern for every activity and the status log.`,
          }),
          name: t.String(),
          filters: t.Any({
            description: `\`{ statusId?, sourceId?, ownerUserId?, from?, to?, search? }\` — شكل مرشّحات الشاشة`,
          }),
          sort: __nullable__(
            t.Any({ description: `\`{ field, direction }\`` }),
          ),
          visibleColumns: t.Array(t.String(), { additionalProperties: false }),
          layout: t.Union([t.Literal("LIST"), t.Literal("KANBAN")], {
            additionalProperties: false,
            description: `[CRM-P5] §11.2 — الشكل الذي يفتح به العرض المحفوظ.`,
          }),
          isPinned: t.Boolean(),
          isPublic: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[CRM-P5] §11.3 — عرضٌ محفوظ لكلّ مستخدم.
النطاق مقصوص عن محرّك العروض المرجعيّ: لا \`group_by\` في v1. والحقول المرنة تُخزَّن
\`Json\` لا أعمدةً: المرشّحات تتبع شاشتها وتتغيّر معها، وعمودٌ لكل مرشّح كان سيجعل كلّ
مرشّحٍ جديد هجرةً.
**\`isPublic\` محروس** (§17.2 صفّ ٢٣): الخاصّ حرٌّ لكلّ عضو، والنشر يحتاج
\`crm_settings.edit\` — لأنّ العرض المنشور حالةٌ مشتركة تظهر على شاشات الزملاء.`,
        },
      ),
      { additionalProperties: false },
    ),
    crmAssignedTasks: t.Array(
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
          title: t.String(),
          description: __nullable__(t.String()),
          priority: t.Union(
            [t.Literal("LOW"), t.Literal("MEDIUM"), t.Literal("HIGH")],
            { additionalProperties: false },
          ),
          status: t.Union(
            [
              t.Literal("BACKLOG"),
              t.Literal("TODO"),
              t.Literal("IN_PROGRESS"),
              t.Literal("DONE"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          dueAt: __nullable__(t.Date()),
          overdueNotifiedAt: __nullable__(
            t.Date({
              description: `[CRM-P6] §8.2 — لحظة إرسال إشعار التأخّر، ووظيفتها **منع الثاني**: المهمة المتأخّرة
تبقى متأخّرة كل ليلة، وبلا هذا العمود يصير التذكير اليوميّ إزعاجًا يُتجاهَل — وأوّل
ما يُتجاهَل هو ما كان يجب أن يُقرأ. نفس مذهب \`slaStatus\` في §10.4.`,
            }),
          ),
          assignedToUserId: __nullable__(t.String()),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `§8.2 — مهمة. الاسم \`CrmTask\` لأنّ \`Task\` مأخوذ لمهام العيادة العامة، وهما كيانان
مختلفان: هذه مربوطة بعميل محتمل/صفقة عبر نمط §8.1.`,
        },
      ),
      { additionalProperties: false },
    ),
    crmAuthoredComments: t.Array(
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
          content: t.String(),
          mentionedUserIds: t.Array(t.String(), {
            additionalProperties: false,
          }),
          authorUserId: __nullable__(t.String()),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `§8.2 — تعليق مع إشارات. المُشار إليهم يُخزَّنون على الصف نفسه (لا جدول وصل): القراءة
دائمًا مع التعليق، والكتابة مرّة واحدة، ولا استعلام ثانٍ في الخيط الزمني.`,
        },
      ),
      { additionalProperties: false },
    ),
    crmOwnedDeals: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          leadId: __nullable__(
            t.String({ description: `أصل الصفقة حين جاءت من عميل محتمل (§5)` }),
          ),
          ownerId: __nullable__(
            t.String({
              description: `مالكٌ قائم في elite-vet حين كان الشخص معروفًا مسبقًا (BR-C5.3)`,
            }),
          ),
          sourceId: __nullable__(
            t.String({
              description: `مصدر الصفقة — لقطةٌ تُنسخ عند التحويل وتبقى قابلة للتحرير (§5، §17.2 صفّ ٩).
عمودٌ على الصفقة لا قراءةً عبر \`leadId\`: قمع §12 يجمع بالمصدر، و\`leadId\` قابل
للإفراغ (\`SetNull\`)، فقراءةٌ عبره تفقد المصدر متى حُذف العميل المحتمل.`,
            }),
          ),
          firstName: t.String(),
          lastName: __nullable__(t.String()),
          fullName: t.String(),
          gender: __nullable__(
            t.Union(
              [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
              { additionalProperties: false },
            ),
          ),
          mobile: t.String(),
          mobileNormalized: __nullable__(
            t.String({
              description: `الشكل القابل للمقارنة — نفس اشتقاق العميل المحتمل (\`@/lib/validation/phone\`)`,
            }),
          ),
          phone: __nullable__(t.String()),
          email: __nullable__(t.String()),
          city: __nullable__(t.String()),
          address: __nullable__(t.String()),
          petSpecies: __nullable__(t.String()),
          petCount: __nullable__(t.Integer()),
          petNotes: __nullable__(t.String()),
          statusId: t.String(),
          probability: t.Number({
            description: `نسبة النجاح؛ تُملأ افتراضًا من الحالة (§2) ما لم يتجاوزها المستخدم (BR-C4.2)`,
          }),
          probabilityOverridden: t.Boolean({
            description: `BR-C4.2 — الانحراف المقصود عن النظام المرجعي: هذا العلم يمنع إعادة الافتراض الصامت`,
          }),
          expectedCloseDate: __nullable__(t.Date()),
          closedDate: __nullable__(
            t.Date({
              description: `يُختم تلقائيًّا عند دخول حالة من نوع WON (§4.1)`,
            }),
          ),
          dealValue: t.Number({
            description: `Σ سطور المنتجات حين توجد، وإلّا يدويّ (BR-C6.1)`,
          }),
          expectedValue: t.Number({
            description: `dealValue × probability ÷ 100 — يُعاد حسابه عند تغيّر أيٍّ منهما (BR-C4.2)`,
          }),
          wonOwnerId: __nullable__(
            t.String({
              description: `المالك الذي حُسم إليه الفوز (§7.2) — يُختم داخل معاملة الفوز`,
            }),
          ),
          lostReasonId: __nullable__(t.String()),
          lostNotes: __nullable__(t.String()),
          slaPolicyId: __nullable__(
            t.String({
              description: `§10 — حقول اتفاقية مستوى الخدمة، فارغة حتى CRM-P5 يبني المحرّك`,
            }),
          ),
          responseBy: __nullable__(t.Date()),
          firstRespondedAt: __nullable__(t.Date()),
          firstResponseDuration: __nullable__(t.Integer()),
          slaStatus: __nullable__(
            t.Union(
              [t.Literal("DUE"), t.Literal("FULFILLED"), t.Literal("FAILED")],
              {
                additionalProperties: false,
                description: `[CRM-P2] §10.3 — حالة اتفاقية مستوى الخدمة. العمود يُشحن فارغًا الآن؛ المحرّك في CRM-P5.`,
              },
            ),
          ),
          ownerUserId: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[CRM-P2] §4.1 — الصفقة. تُنشأ من التحويل (§5) أو مباشرةً، ولا تصير «مكسوبة» إلا عبر
مسار §7 داخل المعاملة نفسها (BR-C4.1).`,
        },
      ),
      { additionalProperties: false },
    ),
    managedBranches: t.Array(
      t.Object(
        {
          id: t.String(),
          branchCode: t.String(),
          clinicId: t.String(),
          name: t.String(),
          icon: __nullable__(t.String()),
          type: t.Union([t.Literal("PRIMARY"), t.Literal("SUB")], {
            additionalProperties: false,
          }),
          managerId: __nullable__(t.String()),
          email: __nullable__(t.String()),
          city: __nullable__(t.String()),
          phone: __nullable__(t.String()),
          address: __nullable__(t.String()),
          active: t.Boolean(),
          emergencyNotifications: t.Boolean(),
          settings: __nullable__(t.Any()),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    managerOfBranches: t.Array(
      t.Object(
        {
          id: t.String(),
          branchCode: t.String(),
          clinicId: t.String(),
          name: t.String(),
          icon: __nullable__(t.String()),
          type: t.Union([t.Literal("PRIMARY"), t.Literal("SUB")], {
            additionalProperties: false,
          }),
          managerId: __nullable__(t.String()),
          email: __nullable__(t.String()),
          city: __nullable__(t.String()),
          phone: __nullable__(t.String()),
          address: __nullable__(t.String()),
          active: t.Boolean(),
          emergencyNotifications: t.Boolean(),
          settings: __nullable__(t.Any()),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    managedRooms: t.Array(
      t.Object(
        {
          id: t.String(),
          branchId: t.String(),
          clinicId: t.String(),
          name: t.String(),
          type: t.Union(
            [
              t.Literal("EXAMINATION"),
              t.Literal("LABORATORY"),
              t.Literal("WAITING"),
              t.Literal("OPERATING"),
              t.Literal("VACCINATION"),
              t.Literal("ICU"),
              t.Literal("GROOMING"),
              t.Literal("WARD"),
              t.Literal("ISOLATION"),
            ],
            { additionalProperties: false },
          ),
          capacity: t.Integer(),
          managerId: __nullable__(t.String()),
          availableDevices: t.Array(t.String(), {
            additionalProperties: false,
          }),
          abilities: t.Array(t.String(), { additionalProperties: false }),
          notes: __nullable__(t.String()),
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
    branchMemberships: t.Array(
      t.Object(
        {
          id: t.String(),
          branchId: t.String(),
          clinicId: t.String(),
          userId: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    staffProfiles: t.Array(
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
    authoredInternalNotes: t.Array(
      t.Object(
        {
          id: t.String(),
          appointmentId: t.String(),
          authorUserId: t.String(),
          body: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    authoredAppointmentEvents: t.Array(
      t.Object(
        {
          id: t.String(),
          appointmentId: t.String(),
          authorUserId: t.String(),
          type: t.Union(
            [
              t.Literal("CREATED"),
              t.Literal("STATUS_CHANGED"),
              t.Literal("COMMENT"),
              t.Literal("DOCUMENT_ADDED"),
              t.Literal("DOCUMENT_REMOVED"),
              t.Literal("RESCHEDULED"),
              t.Literal("OWNER_REASSIGNED"),
              t.Literal("STAFF_REASSIGNED"),
              t.Literal("EXAM_STARTED"),
              t.Literal("EXAM_COMPLETED"),
            ],
            { additionalProperties: false },
          ),
          body: __nullable__(t.String()),
          metadata: __nullable__(t.Any()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    authoredMobileUnitEvents: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          mobileUnitId: t.String(),
          authorUserId: __nullable__(t.String()),
          type: t.Union(
            [
              t.Literal("CREATED"),
              t.Literal("UPDATED"),
              t.Literal("ENABLED"),
              t.Literal("DISABLED"),
              t.Literal("DELETED"),
              t.Literal("STATUS_CHANGED"),
              t.Literal("CREW_ADDED"),
              t.Literal("CREW_REMOVED"),
              t.Literal("DEVICE_PAIRED"),
              t.Literal("DEVICE_REVOKED"),
              t.Literal("SHIFT_STARTED"),
              t.Literal("SHIFT_ENDED"),
              t.Literal("STOCK_RECEIVED"),
              t.Literal("VISIT_ASSIGNED"),
              t.Literal("VISIT_UNASSIGNED"),
            ],
            { additionalProperties: false },
          ),
          body: __nullable__(t.String()),
          metadata: __nullable__(t.Any()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    pairedMobileUnitDevices: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          mobileUnitId: t.String(),
          tokenHash: t.String(),
          tokenPrefix: t.String(),
          label: t.String(),
          platform: __nullable__(t.String()),
          appVersion: __nullable__(t.String()),
          deviceId: __nullable__(t.String()),
          lastSeenAt: __nullable__(t.Date()),
          pairedAt: t.Date(),
          revokedAt: __nullable__(t.Date()),
          createdById: t.String(),
          revokedById: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    handledMobileRequests: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          ownerName: t.String(),
          phone: t.String(),
          email: __nullable__(t.String()),
          ownerId: __nullable__(t.String()),
          addressLine: t.String(),
          district: __nullable__(t.String()),
          city: __nullable__(t.String()),
          lat: __nullable__(t.Number()),
          lng: __nullable__(t.Number()),
          landmark: __nullable__(t.String()),
          animalTypeId: __nullable__(t.String()),
          petName: __nullable__(t.String()),
          petNotes: __nullable__(t.String()),
          serviceIds: t.Array(t.String(), { additionalProperties: false }),
          preferredDate: __nullable__(t.Date()),
          preferredWindow: __nullable__(
            t.Union(
              [
                t.Literal("MORNING"),
                t.Literal("AFTERNOON"),
                t.Literal("EVENING"),
                t.Literal("ANY"),
              ],
              { additionalProperties: false },
            ),
          ),
          notes: __nullable__(t.String()),
          attachments: t.Array(t.String(), { additionalProperties: false }),
          status: t.Union(
            [
              t.Literal("NEW"),
              t.Literal("CONTACTED"),
              t.Literal("SCHEDULED"),
              t.Literal("REJECTED"),
              t.Literal("SPAM"),
            ],
            { additionalProperties: false },
          ),
          zoneId: __nullable__(t.String()),
          appointmentId: __nullable__(t.String()),
          handledById: __nullable__(t.String()),
          handledAt: __nullable__(t.Date()),
          rejectionReason: __nullable__(t.String()),
          ipHash: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    revokedMobileUnitDevices: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          mobileUnitId: t.String(),
          tokenHash: t.String(),
          tokenPrefix: t.String(),
          label: t.String(),
          platform: __nullable__(t.String()),
          appVersion: __nullable__(t.String()),
          deviceId: __nullable__(t.String()),
          lastSeenAt: __nullable__(t.Date()),
          pairedAt: t.Date(),
          revokedAt: __nullable__(t.Date()),
          createdById: t.String(),
          revokedById: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    authoredPatientEvents: t.Array(
      t.Object(
        {
          id: t.String(),
          patientId: t.String(),
          authorUserId: t.String(),
          type: t.Union(
            [t.Literal("OWNERSHIP_TRANSFERRED"), t.Literal("GROOMING_FINDING")],
            { additionalProperties: false },
          ),
          body: __nullable__(t.String()),
          metadata: __nullable__(t.Any()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    authoredAppointmentDocuments: t.Array(
      t.Object(
        {
          id: t.String(),
          appointmentId: t.String(),
          authorUserId: t.String(),
          title: t.String(),
          kind: t.Union([t.Literal("FILE"), t.Literal("LINK")], {
            additionalProperties: false,
          }),
          url: t.String(),
          mimeType: __nullable__(t.String()),
          sizeBytes: __nullable__(t.Integer()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    authoredStaffDocuments: t.Array(
      t.Object(
        {
          id: t.String(),
          staffId: t.String(),
          authorUserId: t.String(),
          category: t.Union(
            [
              t.Literal("DOCUMENT"),
              t.Literal("CERTIFICATE"),
              t.Literal("IMAGE"),
            ],
            { additionalProperties: false },
          ),
          title: t.String(),
          kind: t.Union([t.Literal("FILE"), t.Literal("LINK")], {
            additionalProperties: false,
          }),
          url: t.String(),
          mimeType: __nullable__(t.String()),
          sizeBytes: __nullable__(t.Integer()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    authoredClinicDocuments: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          branchId: __nullable__(t.String()),
          authorUserId: t.String(),
          category: t.Union(
            [
              t.Literal("LICENSE"),
              t.Literal("REGISTRATION"),
              t.Literal("CONTRACT"),
              t.Literal("INSURANCE"),
              t.Literal("POLICY"),
              t.Literal("FINANCIAL"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          title: t.String(),
          description: __nullable__(t.String()),
          kind: t.Union([t.Literal("FILE"), t.Literal("LINK")], {
            additionalProperties: false,
          }),
          url: t.String(),
          mimeType: __nullable__(t.String()),
          sizeBytes: __nullable__(t.Integer()),
          issuedAt: __nullable__(t.Date()),
          expiresAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    stockLedgerEntries: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          itemId: t.String(),
          warehouseId: t.String(),
          batchId: __nullable__(t.String()),
          qtyChange: t.Integer(),
          balanceQty: t.Integer(),
          inRate: __nullable__(t.Number()),
          valuationRate: __nullable__(t.Number()),
          voucherType: t.Union(
            [
              t.Literal("OPENING"),
              t.Literal("RECEIPT"),
              t.Literal("ISSUE"),
              t.Literal("SALE"),
              t.Literal("SALE_RETURN"),
              t.Literal("ADJUSTMENT"),
              t.Literal("TRANSFER"),
              t.Literal("CARE_PLAN"),
              t.Literal("VACCINATION"),
              t.Literal("MOBILE_CLINIC"),
              t.Literal("PHARMACY_DISPENSE"),
              t.Literal("INPATIENT_ADMINISTRATION"),
            ],
            { additionalProperties: false },
          ),
          voucherId: __nullable__(t.String()),
          note: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    purchaseOrders: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          supplierId: t.String(),
          warehouseId: t.String(),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("ORDERED"),
              t.Literal("PARTIALLY_RECEIVED"),
              t.Literal("RECEIVED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          notes: __nullable__(t.String()),
          expectedAt: __nullable__(t.Date()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    authoredProductComments: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          itemId: t.String(),
          authorId: t.String(),
          body: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    authoredTaskActivity: t.Array(
      t.Object(
        {
          id: t.String(),
          taskId: t.String(),
          authorUserId: t.String(),
          type: t.Union(
            [
              t.Literal("STATUS_CHANGED"),
              t.Literal("COMMENT"),
              t.Literal("TASK_ACCEPTED"),
              t.Literal("TASK_DECLINED"),
            ],
            { additionalProperties: false },
          ),
          body: __nullable__(t.String()),
          metadata: __nullable__(t.Any()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    createdInboxItems: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          kind: t.Union([t.Literal("NOTIFICATION"), t.Literal("APPROVAL")], {
            additionalProperties: false,
          }),
          type: t.Union(
            [
              t.Literal("MEMBERSHIP"),
              t.Literal("INSURANCE"),
              t.Literal("LEAD"),
              t.Literal("DEAL"),
              t.Literal("APPOINTMENT_CANCELLED"),
              t.Literal("APPOINTMENT_NEW"),
              t.Literal("APPOINTMENT_PENDING"),
              t.Literal("APPOINTMENT_CONFIRMED"),
              t.Literal("INVOICE"),
              t.Literal("TASK"),
              t.Literal("SYSTEM"),
              t.Literal("LAB"),
              t.Literal("RADIOLOGY"),
              t.Literal("CARE"),
              t.Literal("STOCK"),
              t.Literal("MENTION"),
              t.Literal("OPERATION"),
              t.Literal("VACCINATION"),
              t.Literal("GROOMING"),
              t.Literal("INPATIENT"),
              t.Literal("TRIAGE"),
            ],
            { additionalProperties: false },
          ),
          title: t.String(),
          importance: t.Union(
            [t.Literal("LOW"), t.Literal("NORMAL"), t.Literal("HIGH")],
            { additionalProperties: false },
          ),
          status: t.Union(
            [t.Literal("DRAFT"), t.Literal("OPEN"), t.Literal("RESOLVED")],
            { additionalProperties: false },
          ),
          approvalStatus: __nullable__(
            t.Union(
              [
                t.Literal("PENDING"),
                t.Literal("ACCEPTED"),
                t.Literal("REJECTED"),
              ],
              { additionalProperties: false },
            ),
          ),
          patientId: __nullable__(t.String()),
          ownerId: __nullable__(t.String()),
          staffId: __nullable__(t.String()),
          appointmentId: __nullable__(t.String()),
          taskId: __nullable__(t.String()),
          conversationId: __nullable__(t.String()),
          operationId: __nullable__(t.String()),
          groomingSessionId: __nullable__(t.String()),
          leadId: __nullable__(t.String()),
          dealId: __nullable__(t.String()),
          inpatientStayId: __nullable__(t.String()),
          recipientUserId: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    authoredInboxActivity: t.Array(
      t.Object(
        {
          id: t.String(),
          itemId: t.String(),
          authorUserId: t.String(),
          type: t.Union(
            [
              t.Literal("CREATED"),
              t.Literal("COMMENT"),
              t.Literal("ACCEPTED"),
              t.Literal("REJECTED"),
              t.Literal("STATUS_CHANGED"),
            ],
            { additionalProperties: false },
          ),
          body: __nullable__(t.String()),
          metadata: __nullable__(t.Any()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    inboxReads: t.Array(
      t.Object(
        {
          id: t.String(),
          itemId: t.String(),
          userId: t.String(),
          readAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    inboxSettings: t.Array(
      t.Object(
        {
          id: t.String(),
          userId: t.String(),
          clinicId: t.String(),
          liveEnabled: t.Boolean(),
          toastEnabled: t.Boolean(),
          soundEnabled: t.Boolean(),
          soundName: t.Union(
            [
              t.Literal("CHIME"),
              t.Literal("PING"),
              t.Literal("MARIMBA"),
              t.Literal("KNOCK"),
            ],
            { additionalProperties: false },
          ),
          soundVolume: t.Integer(),
          desktopEnabled: t.Boolean(),
          onlyHighImportance: t.Boolean(),
          typeAppointments: t.Boolean(),
          typeLab: t.Boolean(),
          typeRadiology: t.Boolean(),
          typeTasks: t.Boolean(),
          typeStock: t.Boolean(),
          typeInvoices: t.Boolean(),
          typeMentions: t.Boolean(),
          typeApprovals: t.Boolean(),
          typeSystem: t.Boolean(),
          typeInpatients: t.Boolean(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    requestedExpenses: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          name: t.String(),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("PENDING_REVIEW"),
              t.Literal("APPROVED"),
              t.Literal("REJECTED"),
              t.Literal("PAID"),
              t.Literal("CANCELED"),
            ],
            { additionalProperties: false },
          ),
          amount: t.Number(),
          source: t.Union(
            [
              t.Literal("MANUAL"),
              t.Literal("PAYROLL_RUN"),
              t.Literal("END_OF_SERVICE"),
              t.Literal("PURCHASE_ORDER"),
            ],
            { additionalProperties: false },
          ),
          sourceId: __nullable__(t.String()),
          expenseDate: __nullable__(t.Date()),
          staffId: __nullable__(t.String()),
          recoverFromPayroll: t.Boolean(),
          paymentMethod: __nullable__(
            t.Union(
              [
                t.Literal("CASH"),
                t.Literal("BANK_TRANSFER"),
                t.Literal("CARD"),
                t.Literal("CHEQUE"),
                t.Literal("TREASURY"),
              ],
              { additionalProperties: false },
            ),
          ),
          categoryLabel: __nullable__(t.String()),
          departmentLabel: __nullable__(t.String()),
          branchId: __nullable__(t.String()),
          requesterId: t.String(),
          supplierId: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          reminderEnabled: t.Boolean(),
          reminderOffset: __nullable__(
            t.Union(
              [
                t.Literal("ONE_DAY"),
                t.Literal("TWO_DAYS"),
                t.Literal("THREE_DAYS"),
              ],
              { additionalProperties: false },
            ),
          ),
          rejectionReason: __nullable__(t.String()),
          cancelReason: __nullable__(t.String()),
          signed: t.Boolean(),
          signatureName: __nullable__(t.String()),
          decisionAt: __nullable__(t.Date()),
          decidedById: __nullable__(t.String()),
          reviewSubject: __nullable__(t.String()),
          reviewBody: __nullable__(t.String()),
          reviewRecipientIds: t.Array(t.String(), {
            additionalProperties: false,
          }),
          reviewSentAt: __nullable__(t.Date()),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    decidedExpenses: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          name: t.String(),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("PENDING_REVIEW"),
              t.Literal("APPROVED"),
              t.Literal("REJECTED"),
              t.Literal("PAID"),
              t.Literal("CANCELED"),
            ],
            { additionalProperties: false },
          ),
          amount: t.Number(),
          source: t.Union(
            [
              t.Literal("MANUAL"),
              t.Literal("PAYROLL_RUN"),
              t.Literal("END_OF_SERVICE"),
              t.Literal("PURCHASE_ORDER"),
            ],
            { additionalProperties: false },
          ),
          sourceId: __nullable__(t.String()),
          expenseDate: __nullable__(t.Date()),
          staffId: __nullable__(t.String()),
          recoverFromPayroll: t.Boolean(),
          paymentMethod: __nullable__(
            t.Union(
              [
                t.Literal("CASH"),
                t.Literal("BANK_TRANSFER"),
                t.Literal("CARD"),
                t.Literal("CHEQUE"),
                t.Literal("TREASURY"),
              ],
              { additionalProperties: false },
            ),
          ),
          categoryLabel: __nullable__(t.String()),
          departmentLabel: __nullable__(t.String()),
          branchId: __nullable__(t.String()),
          requesterId: t.String(),
          supplierId: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          reminderEnabled: t.Boolean(),
          reminderOffset: __nullable__(
            t.Union(
              [
                t.Literal("ONE_DAY"),
                t.Literal("TWO_DAYS"),
                t.Literal("THREE_DAYS"),
              ],
              { additionalProperties: false },
            ),
          ),
          rejectionReason: __nullable__(t.String()),
          cancelReason: __nullable__(t.String()),
          signed: t.Boolean(),
          signatureName: __nullable__(t.String()),
          decisionAt: __nullable__(t.Date()),
          decidedById: __nullable__(t.String()),
          reviewSubject: __nullable__(t.String()),
          reviewBody: __nullable__(t.String()),
          reviewRecipientIds: t.Array(t.String(), {
            additionalProperties: false,
          }),
          reviewSentAt: __nullable__(t.Date()),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    refundedInvoices: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          appointmentId: __nullable__(t.String()),
          labOrderId: __nullable__(t.String()),
          radiologyOrderId: __nullable__(t.String()),
          operationId: __nullable__(t.String()),
          groomingSessionId: __nullable__(t.String()),
          inpatientStayId: __nullable__(t.String()),
          subtotal: t.Number(),
          vatRate: t.Number(),
          vatAmount: t.Number(),
          taxTemplateId: __nullable__(t.String()),
          discount: t.Number(),
          total: t.Number(),
          amountPaid: t.Number(),
          currencyCode: t.String(),
          membershipId: __nullable__(t.String()),
          insurerShare: __nullable__(t.Number()),
          copayShare: __nullable__(t.Number()),
          status: t.Union(
            [
              t.Literal("PENDING"),
              t.Literal("PARTIAL"),
              t.Literal("PAID"),
              t.Literal("VOIDED"),
              t.Literal("REFUNDED"),
            ],
            { additionalProperties: false },
          ),
          paymentMethod: __nullable__(
            t.Union(
              [t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")],
              { additionalProperties: false },
            ),
          ),
          paidAt: __nullable__(t.Date()),
          refundedAt: __nullable__(t.Date()),
          refundReason: __nullable__(t.String()),
          refundedById: __nullable__(t.String()),
          stripePaymentIntentId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    refundedSales: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          status: t.Union(
            [t.Literal("PENDING"), t.Literal("PAID"), t.Literal("REFUNDED")],
            { additionalProperties: false },
          ),
          subtotal: t.Number(),
          discount: t.Number(),
          discountCode: __nullable__(t.String()),
          netTotal: t.Number(),
          taxRate: t.Number(),
          taxAmount: t.Number(),
          total: t.Number(),
          taxTemplateId: __nullable__(t.String()),
          cogsAmount: t.Number(),
          paymentMethod: t.Union(
            [t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")],
            { additionalProperties: false },
          ),
          createdById: __nullable__(t.String()),
          posOpeningEntryId: __nullable__(t.String()),
          membershipId: __nullable__(t.String()),
          customerName: __nullable__(t.String()),
          customerPhone: __nullable__(t.String()),
          ownerId: __nullable__(
            t.String({
              description: `[LY-P1] المالك المختار على الكاشير — يُحفظ الآن بعد أن كان يُمرَّر للتسعير ويُرمى.
\`partyId\` كان يصل \`priceSale\` (قالب الضريبة) و\`membership.ownerId\` (خصم العضوية)
ثمّ لا يُكتب في أيّ عمود، فبيعٌ لمالكٍ غير عضو كان يفقد هويّته تمامًا. وذلك يجعل
كسب النقاط على نقطة البيع مستحيلًا (BR-L5.2 «نفس القاعدة بلا بُعد تأمين»)،
والاستبدال في LY-P2 كذلك (BR-L6.5 يشترط طرفًا مربوطًا). §17.2 صفّ ٧.
\`SetNull\` لا \`Cascade\`: حذف مالكٍ لا يجوز أن يمحو بيعًا — البيع واقعةٌ محاسبية.`,
            }),
          ),
          notes: __nullable__(t.String()),
          paidAt: __nullable__(t.Date()),
          fulfillment: t.Union(
            [t.Literal("AT_PAYMENT"), t.Literal("ON_DISPENSE")],
            { additionalProperties: false },
          ),
          dispensedAt: __nullable__(t.Date()),
          dispensedById: __nullable__(t.String()),
          refundedAt: __nullable__(t.Date()),
          refundReason: __nullable__(t.String()),
          refundedById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    expenseStepActions: t.Array(
      t.Object(
        {
          id: t.String(),
          expenseId: t.String(),
          type: t.Union(
            [
              t.Literal("CREATED"),
              t.Literal("SENT_FOR_REVIEW"),
              t.Literal("MANAGER_REVIEW"),
              t.Literal("FINANCE_APPROVAL"),
              t.Literal("DISBURSEMENT"),
            ],
            { additionalProperties: false },
          ),
          state: t.Union(
            [
              t.Literal("PENDING"),
              t.Literal("SENT"),
              t.Literal("APPROVED"),
              t.Literal("REJECTED"),
              t.Literal("DONE"),
            ],
            { additionalProperties: false },
          ),
          order: t.Integer(),
          actorId: __nullable__(t.String()),
          actedAt: __nullable__(t.Date()),
          comment: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    payrollRunsCreated: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          type: t.Union([t.Literal("REGULAR"), t.Literal("OFF_CYCLE")], {
            additionalProperties: false,
          }),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("CALCULATED"),
              t.Literal("PENDING_APPROVAL"),
              t.Literal("APPROVED"),
              t.Literal("PAID"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          periodYear: t.Integer(),
          periodMonth: t.Integer(),
          payDate: __nullable__(t.Date()),
          scope: t.Union(
            [
              t.Literal("ALL"),
              t.Literal("BRANCH"),
              t.Literal("DEPARTMENT"),
              t.Literal("CONTRACT"),
              t.Literal("SPECIFIC"),
            ],
            { additionalProperties: false },
          ),
          scopeBranchId: __nullable__(t.String()),
          scopeRoleId: __nullable__(t.String()),
          totalGross: __nullable__(t.Number()),
          totalEmployeeGosi: __nullable__(t.Number()),
          totalCompanyGosi: __nullable__(t.Number()),
          totalNet: __nullable__(t.Number()),
          totalCompanyCost: __nullable__(t.Number()),
          distribution: __nullable__(t.Any()),
          approvedAt: __nullable__(t.Date()),
          paidAt: __nullable__(t.Date()),
          cancelledAt: __nullable__(t.Date()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    eosSettlementsCreated: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          staffId: t.String(),
          staffName: t.String(),
          staffCode: t.String(),
          reason: t.Union(
            [
              t.Literal("END_OF_CONTRACT"),
              t.Literal("EMPLOYER_TERMINATION"),
              t.Literal("RESIGNATION"),
              t.Literal("SPECIAL"),
            ],
            { additionalProperties: false },
          ),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("APPROVED"),
              t.Literal("PAID"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          monthlyWage: t.Number(),
          startDate: t.Date(),
          endDate: t.Date(),
          serviceYears: t.Integer(),
          serviceMonths: t.Integer(),
          serviceDays: t.Integer(),
          firstFiveMonths: t.Number(),
          beyondFiveMonths: t.Number(),
          fullAward: t.Number(),
          factor: t.Number(),
          finalAmount: t.Number(),
          notes: __nullable__(t.String()),
          approvedAt: __nullable__(t.Date()),
          paidAt: __nullable__(t.Date()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    payrollApprovals: t.Array(
      t.Object(
        {
          id: t.String(),
          runId: t.String(),
          order: t.Integer(),
          title: t.String(),
          state: t.Union(
            [
              t.Literal("PENDING"),
              t.Literal("APPROVED"),
              t.Literal("REJECTED"),
            ],
            { additionalProperties: false },
          ),
          approverId: __nullable__(t.String()),
          actedAt: __nullable__(t.Date()),
          comment: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    agentConversations: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          userId: t.String(),
          title: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    requestedLabTests: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          branchId: t.String(),
          patientId: t.String(),
          ownerId: t.String(),
          appointmentId: __nullable__(t.String()),
          inpatientStayId: __nullable__(
            t.String({
              description: `*
* [IP2] طُلب من داخل إقامة تنويم. عمود قياسيّ بلا علاقة Prisma عن قصد: العلاقة
* تُضاف طرفين، وطرفها الثاني يوسّع رسم أنواع \`InpatientStay\` الضخم أصلًا حتى
* يتجاوز سقف عمق TypeScript (نفس ما وقع عند إضافة نماذج التنويم أول مرّة).
* الاستعلام هنا دائمًا «طلبات هذه الإقامة»، وهو استعلام مستقلّ لا تضمين متداخل.`,
            }),
          ),
          requestedById: __nullable__(t.String()),
          priority: __nullable__(
            t.Union(
              [
                t.Literal("LOW"),
                t.Literal("MEDIUM"),
                t.Literal("HIGH"),
                t.Literal("URGENT"),
              ],
              { additionalProperties: false },
            ),
          ),
          isUrgent: t.Boolean(),
          notes: __nullable__(t.String()),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          qcReviewedAt: __nullable__(t.Date()),
          qcReviewedById: __nullable__(t.String()),
          qcRules: t.Array(t.String(), { additionalProperties: false }),
          releasedToOwnerAt: __nullable__(
            t.Date({
              description: `*
* [D6] نشر النتيجة لمالك الحيوان — القرار السريري الذي يفتح بوّابة التطبيق.
* النتيجة **لا تصل تطبيق المالك** حتى يُملأ هذا الحقل. القيمة الفارغة هي الحالة
* الطبيعية لا النقص: قيمةٌ خارج المدى المرجعي تُقرأ كارثةً وهي طبيعية لنوعها،
* وأخرى تبدو سليمة يعرف الطبيب وحده أنها تستدعي إعادة. فالنشر فعلُ طبيبٍ يُسجَّل
* باسمه ووقته، لا أثرٌ جانبيّ لاكتمال التحليل.`,
            }),
          ),
          releasedByStaffId: __nullable__(t.String()),
          releaseSummary: __nullable__(
            t.String({
              description: `*
* ملخّصٌ بلغة المالك يكتبه الطبيب عند النشر — لا يُعرض التقرير الخام.`,
            }),
          ),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    qcReviewedLabTests: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          branchId: t.String(),
          patientId: t.String(),
          ownerId: t.String(),
          appointmentId: __nullable__(t.String()),
          inpatientStayId: __nullable__(
            t.String({
              description: `*
* [IP2] طُلب من داخل إقامة تنويم. عمود قياسيّ بلا علاقة Prisma عن قصد: العلاقة
* تُضاف طرفين، وطرفها الثاني يوسّع رسم أنواع \`InpatientStay\` الضخم أصلًا حتى
* يتجاوز سقف عمق TypeScript (نفس ما وقع عند إضافة نماذج التنويم أول مرّة).
* الاستعلام هنا دائمًا «طلبات هذه الإقامة»، وهو استعلام مستقلّ لا تضمين متداخل.`,
            }),
          ),
          requestedById: __nullable__(t.String()),
          priority: __nullable__(
            t.Union(
              [
                t.Literal("LOW"),
                t.Literal("MEDIUM"),
                t.Literal("HIGH"),
                t.Literal("URGENT"),
              ],
              { additionalProperties: false },
            ),
          ),
          isUrgent: t.Boolean(),
          notes: __nullable__(t.String()),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          qcReviewedAt: __nullable__(t.Date()),
          qcReviewedById: __nullable__(t.String()),
          qcRules: t.Array(t.String(), { additionalProperties: false }),
          releasedToOwnerAt: __nullable__(
            t.Date({
              description: `*
* [D6] نشر النتيجة لمالك الحيوان — القرار السريري الذي يفتح بوّابة التطبيق.
* النتيجة **لا تصل تطبيق المالك** حتى يُملأ هذا الحقل. القيمة الفارغة هي الحالة
* الطبيعية لا النقص: قيمةٌ خارج المدى المرجعي تُقرأ كارثةً وهي طبيعية لنوعها،
* وأخرى تبدو سليمة يعرف الطبيب وحده أنها تستدعي إعادة. فالنشر فعلُ طبيبٍ يُسجَّل
* باسمه ووقته، لا أثرٌ جانبيّ لاكتمال التحليل.`,
            }),
          ),
          releasedByStaffId: __nullable__(t.String()),
          releaseSummary: __nullable__(
            t.String({
              description: `*
* ملخّصٌ بلغة المالك يكتبه الطبيب عند النشر — لا يُعرض التقرير الخام.`,
            }),
          ),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    assignedLabTests: t.Array(
      t.Object(
        {
          id: t.String(),
          orderId: t.String(),
          serviceId: t.String(),
          priceSnapshot: t.Number(),
          status: t.Union(
            [
              t.Literal("QUEUE"),
              t.Literal("SCHEDULED"),
              t.Literal("SAMPLE_COLLECTION"),
              t.Literal("IN_LAB"),
              t.Literal("UNDER_REVIEW"),
              t.Literal("COMPLETED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          sampleStage: t.Union(
            [
              t.Literal("NOT_COLLECTED"),
              t.Literal("COLLECTED"),
              t.Literal("QUALITY_CHECK"),
              t.Literal("LABEL_PRINT"),
              t.Literal("ANALYZER_ASSIGNMENT"),
              t.Literal("HANDOVER_SUMMARY"),
              t.Literal("ANALYZING"),
              t.Literal("RESULTS_READY"),
            ],
            { additionalProperties: false },
          ),
          assignedToId: __nullable__(t.String()),
          scheduledAt: __nullable__(t.Date()),
          report: __nullable__(t.String()),
          reviewedById: __nullable__(t.String()),
          reviewedAt: __nullable__(t.Date()),
          rejectedById: __nullable__(t.String()),
          rejectedAt: __nullable__(t.Date()),
          rejectionReason: __nullable__(t.String()),
          completedAt: __nullable__(t.Date()),
          paidAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    reviewedLabTests: t.Array(
      t.Object(
        {
          id: t.String(),
          orderId: t.String(),
          serviceId: t.String(),
          priceSnapshot: t.Number(),
          status: t.Union(
            [
              t.Literal("QUEUE"),
              t.Literal("SCHEDULED"),
              t.Literal("SAMPLE_COLLECTION"),
              t.Literal("IN_LAB"),
              t.Literal("UNDER_REVIEW"),
              t.Literal("COMPLETED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          sampleStage: t.Union(
            [
              t.Literal("NOT_COLLECTED"),
              t.Literal("COLLECTED"),
              t.Literal("QUALITY_CHECK"),
              t.Literal("LABEL_PRINT"),
              t.Literal("ANALYZER_ASSIGNMENT"),
              t.Literal("HANDOVER_SUMMARY"),
              t.Literal("ANALYZING"),
              t.Literal("RESULTS_READY"),
            ],
            { additionalProperties: false },
          ),
          assignedToId: __nullable__(t.String()),
          scheduledAt: __nullable__(t.Date()),
          report: __nullable__(t.String()),
          reviewedById: __nullable__(t.String()),
          reviewedAt: __nullable__(t.Date()),
          rejectedById: __nullable__(t.String()),
          rejectedAt: __nullable__(t.Date()),
          rejectionReason: __nullable__(t.String()),
          completedAt: __nullable__(t.Date()),
          paidAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    rejectedLabTests: t.Array(
      t.Object(
        {
          id: t.String(),
          orderId: t.String(),
          serviceId: t.String(),
          priceSnapshot: t.Number(),
          status: t.Union(
            [
              t.Literal("QUEUE"),
              t.Literal("SCHEDULED"),
              t.Literal("SAMPLE_COLLECTION"),
              t.Literal("IN_LAB"),
              t.Literal("UNDER_REVIEW"),
              t.Literal("COMPLETED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          sampleStage: t.Union(
            [
              t.Literal("NOT_COLLECTED"),
              t.Literal("COLLECTED"),
              t.Literal("QUALITY_CHECK"),
              t.Literal("LABEL_PRINT"),
              t.Literal("ANALYZER_ASSIGNMENT"),
              t.Literal("HANDOVER_SUMMARY"),
              t.Literal("ANALYZING"),
              t.Literal("RESULTS_READY"),
            ],
            { additionalProperties: false },
          ),
          assignedToId: __nullable__(t.String()),
          scheduledAt: __nullable__(t.Date()),
          report: __nullable__(t.String()),
          reviewedById: __nullable__(t.String()),
          reviewedAt: __nullable__(t.Date()),
          rejectedById: __nullable__(t.String()),
          rejectedAt: __nullable__(t.Date()),
          rejectionReason: __nullable__(t.String()),
          completedAt: __nullable__(t.Date()),
          paidAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    collectedLabSamples: t.Array(
      t.Object(
        {
          id: t.String(),
          itemId: t.String(),
          tubeType: __nullable__(
            t.Union(
              [
                t.Literal("EDTA"),
                t.Literal("SST"),
                t.Literal("CITRATE"),
                t.Literal("HEPARIN"),
                t.Literal("URINE"),
                t.Literal("SWAB"),
              ],
              { additionalProperties: false },
            ),
          ),
          collectedById: __nullable__(t.String()),
          drawSite: __nullable__(t.String()),
          volumeMl: __nullable__(t.Number()),
          attempts: __nullable__(t.Integer()),
          collectedAt: __nullable__(t.Date()),
          quality: __nullable__(
            t.Union(
              [
                t.Literal("EXCELLENT"),
                t.Literal("GOOD"),
                t.Literal("ACCEPTABLE"),
                t.Literal("REJECTED"),
              ],
              { additionalProperties: false },
            ),
          ),
          collectionNotes: __nullable__(t.String()),
          analyzerId: __nullable__(t.String()),
          analyzerName: __nullable__(t.String()),
          handedOverAt: __nullable__(t.Date()),
          labelsPrinted: __nullable__(t.Integer()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    authoredLabActivity: t.Array(
      t.Object(
        {
          id: t.String(),
          orderId: t.String(),
          itemId: __nullable__(t.String()),
          type: t.Union(
            [
              t.Literal("CREATED"),
              t.Literal("STATUS_CHANGED"),
              t.Literal("STAGE_CHANGED"),
              t.Literal("ASSIGNED"),
              t.Literal("SAMPLE_COLLECTED"),
              t.Literal("RESULTS_SAVED"),
              t.Literal("SENT_TO_REVIEW"),
              t.Literal("QC_REVIEWED"),
              t.Literal("APPROVED"),
              t.Literal("REJECTED"),
              t.Literal("DECLINED"),
              t.Literal("INVOICE_PAID"),
            ],
            { additionalProperties: false },
          ),
          detail: __nullable__(t.String()),
          authorUserId: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    authoredLabComments: t.Array(
      t.Object(
        {
          id: t.String(),
          orderId: t.String(),
          authorUserId: t.String(),
          body: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    requestedRadiologyOrders: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          branchId: t.String(),
          patientId: t.String(),
          ownerId: t.String(),
          appointmentId: __nullable__(t.String()),
          inpatientStayId: __nullable__(
            t.String({
              description: `*
* [IP2] طُلب من داخل إقامة تنويم. عمود قياسيّ بلا علاقة Prisma عن قصد: العلاقة
* تُضاف طرفين، وطرفها الثاني يوسّع رسم أنواع \`InpatientStay\` الضخم أصلًا حتى
* يتجاوز سقف عمق TypeScript (نفس ما وقع عند إضافة نماذج التنويم أول مرّة).
* الاستعلام هنا دائمًا «طلبات هذه الإقامة»، وهو استعلام مستقلّ لا تضمين متداخل.`,
            }),
          ),
          requestedById: __nullable__(t.String()),
          priority: __nullable__(
            t.Union(
              [
                t.Literal("LOW"),
                t.Literal("MEDIUM"),
                t.Literal("HIGH"),
                t.Literal("URGENT"),
              ],
              { additionalProperties: false },
            ),
          ),
          isUrgent: t.Boolean(),
          clinicalInfo: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          releasedToOwnerAt: __nullable__(
            t.Date({
              description: `*
* [D6] نشر النتيجة لمالك الحيوان — انظر الشرح على \`LabTestOrder.releasedToOwnerAt\`.`,
            }),
          ),
          releasedByStaffId: __nullable__(t.String()),
          releaseSummary: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    assignedRadiologyExams: t.Array(
      t.Object(
        {
          id: t.String(),
          orderId: t.String(),
          serviceId: t.String(),
          accession: t.String(),
          priceSnapshot: t.Number(),
          status: t.Union(
            [
              t.Literal("QUEUE"),
              t.Literal("SCHEDULED"),
              t.Literal("PREPARATION"),
              t.Literal("IMAGING"),
              t.Literal("REPORTING"),
              t.Literal("UNDER_REVIEW"),
              t.Literal("COMPLETED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          stage: t.Union(
            [
              t.Literal("SAFETY_SCREENING"),
              t.Literal("PATIENT_PREP"),
              t.Literal("ROOM_ASSIGNMENT"),
              t.Literal("READY_CHECK"),
              t.Literal("ACQUISITION"),
              t.Literal("IMAGE_UPLOAD"),
              t.Literal("IMAGE_QC"),
            ],
            { additionalProperties: false },
          ),
          modality: t.Union(
            [
              t.Literal("XRAY"),
              t.Literal("CT"),
              t.Literal("MRI"),
              t.Literal("ULTRASOUND"),
              t.Literal("FLUOROSCOPY"),
              t.Literal("MAMMOGRAPHY"),
              t.Literal("NUCLEAR"),
              t.Literal("PET"),
              t.Literal("DENTAL"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          bodyPart: __nullable__(t.String()),
          laterality: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("LEFT"),
              t.Literal("RIGHT"),
              t.Literal("BILATERAL"),
            ],
            { additionalProperties: false },
          ),
          views: t.Array(t.String(), { additionalProperties: false }),
          withContrast: t.Boolean(),
          assignedToId: __nullable__(t.String()),
          scheduledAt: __nullable__(t.Date()),
          reviewedById: __nullable__(t.String()),
          reviewedAt: __nullable__(t.Date()),
          rejectedById: __nullable__(t.String()),
          rejectedAt: __nullable__(t.Date()),
          rejectionReason: __nullable__(t.String()),
          completedAt: __nullable__(t.Date()),
          paidAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    reviewedRadiologyExams: t.Array(
      t.Object(
        {
          id: t.String(),
          orderId: t.String(),
          serviceId: t.String(),
          accession: t.String(),
          priceSnapshot: t.Number(),
          status: t.Union(
            [
              t.Literal("QUEUE"),
              t.Literal("SCHEDULED"),
              t.Literal("PREPARATION"),
              t.Literal("IMAGING"),
              t.Literal("REPORTING"),
              t.Literal("UNDER_REVIEW"),
              t.Literal("COMPLETED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          stage: t.Union(
            [
              t.Literal("SAFETY_SCREENING"),
              t.Literal("PATIENT_PREP"),
              t.Literal("ROOM_ASSIGNMENT"),
              t.Literal("READY_CHECK"),
              t.Literal("ACQUISITION"),
              t.Literal("IMAGE_UPLOAD"),
              t.Literal("IMAGE_QC"),
            ],
            { additionalProperties: false },
          ),
          modality: t.Union(
            [
              t.Literal("XRAY"),
              t.Literal("CT"),
              t.Literal("MRI"),
              t.Literal("ULTRASOUND"),
              t.Literal("FLUOROSCOPY"),
              t.Literal("MAMMOGRAPHY"),
              t.Literal("NUCLEAR"),
              t.Literal("PET"),
              t.Literal("DENTAL"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          bodyPart: __nullable__(t.String()),
          laterality: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("LEFT"),
              t.Literal("RIGHT"),
              t.Literal("BILATERAL"),
            ],
            { additionalProperties: false },
          ),
          views: t.Array(t.String(), { additionalProperties: false }),
          withContrast: t.Boolean(),
          assignedToId: __nullable__(t.String()),
          scheduledAt: __nullable__(t.Date()),
          reviewedById: __nullable__(t.String()),
          reviewedAt: __nullable__(t.Date()),
          rejectedById: __nullable__(t.String()),
          rejectedAt: __nullable__(t.Date()),
          rejectionReason: __nullable__(t.String()),
          completedAt: __nullable__(t.Date()),
          paidAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    rejectedRadiologyExams: t.Array(
      t.Object(
        {
          id: t.String(),
          orderId: t.String(),
          serviceId: t.String(),
          accession: t.String(),
          priceSnapshot: t.Number(),
          status: t.Union(
            [
              t.Literal("QUEUE"),
              t.Literal("SCHEDULED"),
              t.Literal("PREPARATION"),
              t.Literal("IMAGING"),
              t.Literal("REPORTING"),
              t.Literal("UNDER_REVIEW"),
              t.Literal("COMPLETED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          stage: t.Union(
            [
              t.Literal("SAFETY_SCREENING"),
              t.Literal("PATIENT_PREP"),
              t.Literal("ROOM_ASSIGNMENT"),
              t.Literal("READY_CHECK"),
              t.Literal("ACQUISITION"),
              t.Literal("IMAGE_UPLOAD"),
              t.Literal("IMAGE_QC"),
            ],
            { additionalProperties: false },
          ),
          modality: t.Union(
            [
              t.Literal("XRAY"),
              t.Literal("CT"),
              t.Literal("MRI"),
              t.Literal("ULTRASOUND"),
              t.Literal("FLUOROSCOPY"),
              t.Literal("MAMMOGRAPHY"),
              t.Literal("NUCLEAR"),
              t.Literal("PET"),
              t.Literal("DENTAL"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          bodyPart: __nullable__(t.String()),
          laterality: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("LEFT"),
              t.Literal("RIGHT"),
              t.Literal("BILATERAL"),
            ],
            { additionalProperties: false },
          ),
          views: t.Array(t.String(), { additionalProperties: false }),
          withContrast: t.Boolean(),
          assignedToId: __nullable__(t.String()),
          scheduledAt: __nullable__(t.Date()),
          reviewedById: __nullable__(t.String()),
          reviewedAt: __nullable__(t.Date()),
          rejectedById: __nullable__(t.String()),
          rejectedAt: __nullable__(t.Date()),
          rejectionReason: __nullable__(t.String()),
          completedAt: __nullable__(t.Date()),
          paidAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    performedRadiologyExams: t.Array(
      t.Object(
        {
          id: t.String(),
          itemId: t.String(),
          machineId: __nullable__(t.String()),
          machineName: __nullable__(t.String()),
          roomName: __nullable__(t.String()),
          positioning: __nullable__(t.String()),
          sedationUsed: __nullable__(
            t.Union(
              [
                t.Literal("NONE"),
                t.Literal("ANXIOLYSIS"),
                t.Literal("SEDATION"),
                t.Literal("GENERAL_ANESTHESIA"),
              ],
              { additionalProperties: false },
            ),
          ),
          sedationAgent: __nullable__(t.String()),
          readyAt: __nullable__(t.Date()),
          performedById: __nullable__(t.String()),
          startedAt: __nullable__(t.Date()),
          finishedAt: __nullable__(t.Date()),
          viewsPerformed: t.Array(t.String(), { additionalProperties: false }),
          exposuresCount: __nullable__(t.Integer()),
          retakeCount: __nullable__(t.Integer()),
          kvp: __nullable__(t.Number()),
          mas: __nullable__(t.Number()),
          doseDap: __nullable__(t.Number()),
          ctdiVol: __nullable__(t.Number()),
          dlp: __nullable__(t.Number()),
          contrastUsed: __nullable__(t.Boolean()),
          contrastAgent: __nullable__(t.String()),
          contrastRoute: __nullable__(
            t.Union(
              [
                t.Literal("IV"),
                t.Literal("ORAL"),
                t.Literal("RECTAL"),
                t.Literal("INTRA_ARTICULAR"),
                t.Literal("OTHER"),
              ],
              { additionalProperties: false },
            ),
          ),
          contrastVolumeMl: __nullable__(t.Number()),
          contrastLot: __nullable__(t.String()),
          imageQuality: __nullable__(
            t.Union(
              [
                t.Literal("DIAGNOSTIC"),
                t.Literal("LIMITED"),
                t.Literal("NON_DIAGNOSTIC"),
              ],
              { additionalProperties: false },
            ),
          ),
          qcNotes: __nullable__(t.String()),
          executionNotes: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    uploadedRadiologyStudies: t.Array(
      t.Object(
        {
          id: t.String(),
          itemId: t.String(),
          studyUid: t.String(),
          description: __nullable__(t.String()),
          studyDate: __nullable__(t.Date()),
          modality: __nullable__(
            t.Union(
              [
                t.Literal("XRAY"),
                t.Literal("CT"),
                t.Literal("MRI"),
                t.Literal("ULTRASOUND"),
                t.Literal("FLUOROSCOPY"),
                t.Literal("MAMMOGRAPHY"),
                t.Literal("NUCLEAR"),
                t.Literal("PET"),
                t.Literal("DENTAL"),
                t.Literal("OTHER"),
              ],
              { additionalProperties: false },
            ),
          ),
          uploadedById: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    authoredRadiologyReports: t.Array(
      t.Object(
        {
          id: t.String(),
          itemId: t.String(),
          technique: __nullable__(t.String()),
          comparison: __nullable__(t.String()),
          findings: __nullable__(t.String()),
          impression: __nullable__(t.String()),
          recommendations: __nullable__(t.String()),
          criticalFinding: t.Boolean(),
          criticalNotifiedAt: __nullable__(t.Date()),
          criticalNotifiedTo: __nullable__(t.String()),
          criticalNotifiedToId: __nullable__(t.String()),
          aiDrafted: t.Boolean(),
          authoredById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    criticalRadiologyNotices: t.Array(
      t.Object(
        {
          id: t.String(),
          itemId: t.String(),
          technique: __nullable__(t.String()),
          comparison: __nullable__(t.String()),
          findings: __nullable__(t.String()),
          impression: __nullable__(t.String()),
          recommendations: __nullable__(t.String()),
          criticalFinding: t.Boolean(),
          criticalNotifiedAt: __nullable__(t.Date()),
          criticalNotifiedTo: __nullable__(t.String()),
          criticalNotifiedToId: __nullable__(t.String()),
          aiDrafted: t.Boolean(),
          authoredById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    authoredRadiologyAddenda: t.Array(
      t.Object(
        {
          id: t.String(),
          reportId: t.String(),
          text: t.String(),
          authoredById: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `ملحق تقرير — التقرير المعتمد لا يُعدَّل، فالتصحيح أو الإضافة بعده تُلحَق
كسطر مستقل مؤرَّخ وموقَّع. هذا مطلب توثيقي: الأصل يبقى كما اعتُمد.`,
        },
      ),
      { additionalProperties: false },
    ),
    authoredRadiologyComments: t.Array(
      t.Object(
        {
          id: t.String(),
          orderId: t.String(),
          authorUserId: t.String(),
          body: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `تعليق على طلب أشعة — نقاش الفريق حول الطلب، كتعليقات التحاليل`,
        },
      ),
      { additionalProperties: false },
    ),
    authoredRadiologyActivity: t.Array(
      t.Object(
        {
          id: t.String(),
          orderId: t.String(),
          itemId: __nullable__(t.String()),
          type: t.Union(
            [
              t.Literal("CREATED"),
              t.Literal("STATUS_CHANGED"),
              t.Literal("STAGE_CHANGED"),
              t.Literal("ASSIGNED"),
              t.Literal("SAFETY_COMPLETED"),
              t.Literal("MACHINE_ASSIGNED"),
              t.Literal("IMAGES_UPLOADED"),
              t.Literal("REPORT_SAVED"),
              t.Literal("SENT_TO_REVIEW"),
              t.Literal("APPROVED"),
              t.Literal("REJECTED"),
              t.Literal("DECLINED"),
              t.Literal("CRITICAL_FLAGGED"),
              t.Literal("INVOICE_PAID"),
              t.Literal("RESCHEDULED"),
              t.Literal("ADDENDUM_ADDED"),
            ],
            { additionalProperties: false },
          ),
          detail: __nullable__(t.String()),
          authorUserId: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    authoredOperationActivity: t.Array(
      t.Object(
        {
          id: t.String(),
          caseId: t.String(),
          type: t.Union(
            [
              t.Literal("CREATED"),
              t.Literal("STATUS_CHANGED"),
              t.Literal("STAGE_CHANGED"),
              t.Literal("SCHEDULE_CHANGED"),
              t.Literal("TEAM_CHANGED"),
              t.Literal("URGENCY_CHANGED"),
              t.Literal("GATE_OVERRIDDEN"),
              t.Literal("CANCELLED"),
              t.Literal("NOTE"),
              t.Literal("CONSENT_SIGNED"),
              t.Literal("CONSENT_REVOKED"),
              t.Literal("ASSESSMENT_UPDATED"),
              t.Literal("CHECKLIST_COMPLETED"),
              t.Literal("NOTE_SIGNED"),
            ],
            { additionalProperties: false },
          ),
          detail: __nullable__(t.String()),
          authorUserId: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    recordedAnesthesiaEvents: t.Array(
      t.Object(
        {
          id: t.String(),
          recordId: t.String(),
          at: t.Date(),
          kind: t.Union(
            [
              t.Literal("DRUG"),
              t.Literal("ABX_PROPHYLAXIS"),
              t.Literal("FLUID"),
              t.Literal("POSITION"),
              t.Literal("EVENT"),
              t.Literal("NOTE"),
            ],
            { additionalProperties: false },
          ),
          inventoryItemId: __nullable__(t.String()),
          agentName: __nullable__(t.String()),
          dose: __nullable__(t.Number()),
          doseUnit: __nullable__(t.String()),
          route: __nullable__(
            t.Union(
              [
                t.Literal("IV"),
                t.Literal("IM"),
                t.Literal("SC"),
                t.Literal("PO"),
                t.Literal("INHALATION"),
                t.Literal("TOPICAL"),
                t.Literal("EPIDURAL"),
                t.Literal("OTHER"),
              ],
              { additionalProperties: false },
            ),
          ),
          detail: __nullable__(t.String()),
          recordedById: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    recoveryAssessments: t.Array(
      t.Object(
        {
          id: t.String(),
          caseId: t.String(),
          at: t.Date(),
          score: __nullable__(t.Integer()),
          painScale: __nullable__(
            t.Union(
              [
                t.Literal("GLASGOW_CMPS"),
                t.Literal("NRS"),
                t.Literal("VAS"),
                t.Literal("FLACC"),
                t.Literal("OTHER"),
              ],
              { additionalProperties: false },
            ),
          ),
          painScore: __nullable__(t.Integer()),
          notes: __nullable__(t.String()),
          assessedById: t.String(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    reportedComplications: t.Array(
      t.Object(
        {
          id: t.String(),
          caseId: t.String(),
          phase: t.Union(
            [
              t.Literal("INTRA_OP"),
              t.Literal("RECOVERY"),
              t.Literal("POST_OP"),
            ],
            { additionalProperties: false },
          ),
          clavienDindoGrade: __nullable__(
            t.Union(
              [
                t.Literal("GRADE_I"),
                t.Literal("GRADE_II"),
                t.Literal("GRADE_IIIA"),
                t.Literal("GRADE_IIIB"),
                t.Literal("GRADE_IVA"),
                t.Literal("GRADE_IVB"),
                t.Literal("GRADE_V"),
              ],
              { additionalProperties: false },
            ),
          ),
          isSSI: t.Boolean(),
          kind: t.String(),
          occurredAt: t.Date(),
          detail: __nullable__(t.String()),
          reportedById: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    authoredOperationComments: t.Array(
      t.Object(
        {
          id: t.String(),
          caseId: t.String(),
          authorUserId: t.String(),
          body: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    recordedVitalSigns: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          branchId: __nullable__(t.String()),
          patientId: t.String(),
          recordedAt: t.Date(),
          source: t.Union(
            [
              t.Literal("MANUAL"),
              t.Literal("VISIT"),
              t.Literal("LAB"),
              t.Literal("RADIOLOGY"),
              t.Literal("OPERATION"),
              t.Literal("GROOMING"),
              t.Literal("INPATIENT"),
              t.Literal("TRIAGE"),
            ],
            { additionalProperties: false },
          ),
          recordedById: __nullable__(t.String()),
          appointmentId: __nullable__(t.String()),
          labOrderId: __nullable__(t.String()),
          radiologyOrderId: __nullable__(t.String()),
          operationId: __nullable__(t.String()),
          inpatientStayId: __nullable__(t.String()),
          weight: __nullable__(t.Number()),
          temperature: __nullable__(t.Number()),
          heartRate: __nullable__(t.Integer()),
          respiratoryRate: __nullable__(t.Integer()),
          oxygenSaturation: __nullable__(t.Integer()),
          bloodPressure: __nullable__(t.String()),
          painScore: __nullable__(t.Integer()),
          bodyConditionScore: __nullable__(t.Integer()),
          capillaryRefillSec: __nullable__(t.Number()),
          mucousMembrane: __nullable__(
            t.Union(
              [
                t.Literal("PINK"),
                t.Literal("PALE"),
                t.Literal("CYANOTIC"),
                t.Literal("ICTERIC"),
                t.Literal("CONGESTED"),
                t.Literal("MUDDY"),
              ],
              { additionalProperties: false },
            ),
          ),
          notes: __nullable__(t.String()),
          correctsId: __nullable__(t.String()),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    conversationMemberships: t.Array(
      t.Object(
        {
          id: t.String(),
          conversationId: t.String(),
          userId: t.String(),
          pinned: t.Boolean(),
          muted: t.Boolean(),
          lastReadAt: t.Date(),
          joinedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    authoredChatMessages: t.Array(
      t.Object(
        {
          id: t.String(),
          conversationId: t.String(),
          authorId: t.String(),
          body: t.String(),
          attachmentName: __nullable__(t.String()),
          attachmentMime: __nullable__(t.String()),
          attachmentSize: __nullable__(t.Integer()),
          attachmentData: __nullable__(t.Uint8Array()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    startedSopRuns: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          templateId: t.String(),
          templateVersion: t.Integer(),
          domain: t.Union(
            [t.Literal("LAB"), t.Literal("RADIOLOGY"), t.Literal("OPERATION")],
            { additionalProperties: false },
          ),
          labItemId: __nullable__(t.String()),
          radiologyItemId: __nullable__(t.String()),
          operationCaseId: __nullable__(t.String()),
          startedById: __nullable__(t.String()),
          completedAt: __nullable__(t.Date()),
          completedById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    completedSopRuns: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          templateId: t.String(),
          templateVersion: t.Integer(),
          domain: t.Union(
            [t.Literal("LAB"), t.Literal("RADIOLOGY"), t.Literal("OPERATION")],
            { additionalProperties: false },
          ),
          labItemId: __nullable__(t.String()),
          radiologyItemId: __nullable__(t.String()),
          operationCaseId: __nullable__(t.String()),
          startedById: __nullable__(t.String()),
          completedAt: __nullable__(t.Date()),
          completedById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    respondedSopSteps: t.Array(
      t.Object(
        {
          id: t.String(),
          runId: t.String(),
          order: t.Integer(),
          sectionTitle: t.String(),
          textSnapshot: t.String(),
          ownerRole: __nullable__(t.String()),
          duration: __nullable__(t.String()),
          critical: t.Boolean(),
          required: t.Boolean(),
          responseType: t.Union(
            [
              t.Literal("CONFIRM"),
              t.Literal("YES_NO_NA"),
              t.Literal("TEXT"),
              t.Literal("NUMBER"),
            ],
            { additionalProperties: false },
          ),
          response: __nullable__(
            t.Union(
              [
                t.Literal("CONFIRMED"),
                t.Literal("YES"),
                t.Literal("NO"),
                t.Literal("NA"),
              ],
              { additionalProperties: false },
            ),
          ),
          valueText: __nullable__(t.String()),
          valueNumber: __nullable__(t.Number()),
          respondedById: __nullable__(t.String()),
          respondedAt: __nullable__(t.Date()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    createdVaccinationRecords: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          patientId: t.String(),
          vaccineId: t.String(),
          appointmentId: __nullable__(t.String()),
          branchId: __nullable__(t.String()),
          administeredById: __nullable__(t.String()),
          administeredAt: t.Date(),
          doseNumber: t.Integer(),
          doseKind: t.Union(
            [
              t.Literal("PRIMARY"),
              t.Literal("BOOSTER"),
              t.Literal("ANNUAL"),
              t.Literal("CATCH_UP"),
            ],
            { additionalProperties: false },
          ),
          route: t.Union(
            [
              t.Literal("SUBCUTANEOUS"),
              t.Literal("INTRAMUSCULAR"),
              t.Literal("INTRANASAL"),
              t.Literal("ORAL"),
              t.Literal("INTRADERMAL"),
              t.Literal("TOPICAL"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          site: __nullable__(
            t.Union(
              [
                t.Literal("LEFT_SHOULDER"),
                t.Literal("RIGHT_SHOULDER"),
                t.Literal("LEFT_HIND_LIMB"),
                t.Literal("RIGHT_HIND_LIMB"),
                t.Literal("INTERSCAPULAR"),
                t.Literal("LEFT_FLANK"),
                t.Literal("RIGHT_FLANK"),
                t.Literal("NASAL"),
                t.Literal("ORAL"),
                t.Literal("OTHER"),
              ],
              { additionalProperties: false },
            ),
          ),
          doseVolumeMl: __nullable__(t.Number()),
          batchId: __nullable__(t.String()),
          batchNo: __nullable__(t.String()),
          batchExpiryDate: __nullable__(t.Date()),
          inventoryItemId: __nullable__(t.String()),
          warehouseId: __nullable__(t.String()),
          vaccineNameSnapshot: t.String(),
          manufacturerSnapshot: __nullable__(t.String()),
          adverseReaction: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("MILD"),
              t.Literal("MODERATE"),
              t.Literal("SEVERE"),
              t.Literal("ANAPHYLACTIC"),
            ],
            { additionalProperties: false },
          ),
          adverseReactionNotes: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          immunityOnsetDaysSnapshot: __nullable__(t.Integer()),
          protectiveFromAt: __nullable__(t.Date()),
          boosterIntervalDaysSnapshot: __nullable__(t.Integer()),
          protectiveUntilAt: __nullable__(t.Date()),
          nextDueAt: __nullable__(t.Date()),
          protocolDoseId: __nullable__(t.String()),
          carePlanEnrollmentVisitId: __nullable__(t.String()),
          isVoided: t.Boolean(),
          voidedAt: __nullable__(t.Date()),
          voidedById: __nullable__(t.String()),
          voidReason: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    voidedVaccinationRecords: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          patientId: t.String(),
          vaccineId: t.String(),
          appointmentId: __nullable__(t.String()),
          branchId: __nullable__(t.String()),
          administeredById: __nullable__(t.String()),
          administeredAt: t.Date(),
          doseNumber: t.Integer(),
          doseKind: t.Union(
            [
              t.Literal("PRIMARY"),
              t.Literal("BOOSTER"),
              t.Literal("ANNUAL"),
              t.Literal("CATCH_UP"),
            ],
            { additionalProperties: false },
          ),
          route: t.Union(
            [
              t.Literal("SUBCUTANEOUS"),
              t.Literal("INTRAMUSCULAR"),
              t.Literal("INTRANASAL"),
              t.Literal("ORAL"),
              t.Literal("INTRADERMAL"),
              t.Literal("TOPICAL"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          site: __nullable__(
            t.Union(
              [
                t.Literal("LEFT_SHOULDER"),
                t.Literal("RIGHT_SHOULDER"),
                t.Literal("LEFT_HIND_LIMB"),
                t.Literal("RIGHT_HIND_LIMB"),
                t.Literal("INTERSCAPULAR"),
                t.Literal("LEFT_FLANK"),
                t.Literal("RIGHT_FLANK"),
                t.Literal("NASAL"),
                t.Literal("ORAL"),
                t.Literal("OTHER"),
              ],
              { additionalProperties: false },
            ),
          ),
          doseVolumeMl: __nullable__(t.Number()),
          batchId: __nullable__(t.String()),
          batchNo: __nullable__(t.String()),
          batchExpiryDate: __nullable__(t.Date()),
          inventoryItemId: __nullable__(t.String()),
          warehouseId: __nullable__(t.String()),
          vaccineNameSnapshot: t.String(),
          manufacturerSnapshot: __nullable__(t.String()),
          adverseReaction: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("MILD"),
              t.Literal("MODERATE"),
              t.Literal("SEVERE"),
              t.Literal("ANAPHYLACTIC"),
            ],
            { additionalProperties: false },
          ),
          adverseReactionNotes: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          immunityOnsetDaysSnapshot: __nullable__(t.Integer()),
          protectiveFromAt: __nullable__(t.Date()),
          boosterIntervalDaysSnapshot: __nullable__(t.Integer()),
          protectiveUntilAt: __nullable__(t.Date()),
          nextDueAt: __nullable__(t.Date()),
          protocolDoseId: __nullable__(t.String()),
          carePlanEnrollmentVisitId: __nullable__(t.String()),
          isVoided: t.Boolean(),
          voidedAt: __nullable__(t.Date()),
          voidedById: __nullable__(t.String()),
          voidReason: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    posSales: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          status: t.Union(
            [t.Literal("PENDING"), t.Literal("PAID"), t.Literal("REFUNDED")],
            { additionalProperties: false },
          ),
          subtotal: t.Number(),
          discount: t.Number(),
          discountCode: __nullable__(t.String()),
          netTotal: t.Number(),
          taxRate: t.Number(),
          taxAmount: t.Number(),
          total: t.Number(),
          taxTemplateId: __nullable__(t.String()),
          cogsAmount: t.Number(),
          paymentMethod: t.Union(
            [t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")],
            { additionalProperties: false },
          ),
          createdById: __nullable__(t.String()),
          posOpeningEntryId: __nullable__(t.String()),
          membershipId: __nullable__(t.String()),
          customerName: __nullable__(t.String()),
          customerPhone: __nullable__(t.String()),
          ownerId: __nullable__(
            t.String({
              description: `[LY-P1] المالك المختار على الكاشير — يُحفظ الآن بعد أن كان يُمرَّر للتسعير ويُرمى.
\`partyId\` كان يصل \`priceSale\` (قالب الضريبة) و\`membership.ownerId\` (خصم العضوية)
ثمّ لا يُكتب في أيّ عمود، فبيعٌ لمالكٍ غير عضو كان يفقد هويّته تمامًا. وذلك يجعل
كسب النقاط على نقطة البيع مستحيلًا (BR-L5.2 «نفس القاعدة بلا بُعد تأمين»)،
والاستبدال في LY-P2 كذلك (BR-L6.5 يشترط طرفًا مربوطًا). §17.2 صفّ ٧.
\`SetNull\` لا \`Cascade\`: حذف مالكٍ لا يجوز أن يمحو بيعًا — البيع واقعةٌ محاسبية.`,
            }),
          ),
          notes: __nullable__(t.String()),
          paidAt: __nullable__(t.Date()),
          fulfillment: t.Union(
            [t.Literal("AT_PAYMENT"), t.Literal("ON_DISPENSE")],
            { additionalProperties: false },
          ),
          dispensedAt: __nullable__(t.Date()),
          dispensedById: __nullable__(t.String()),
          refundedAt: __nullable__(t.Date()),
          refundReason: __nullable__(t.String()),
          refundedById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    posProfileAccess: t.Array(
      t.Object(
        { id: t.String(), profileId: t.String(), userId: t.String() },
        {
          additionalProperties: false,
          description: `من يجوز له فتح وردية على هذا الملف. قائمة فارغة = الجميع (لا نُغلق بابًا بلا طلب).`,
        },
      ),
      { additionalProperties: false },
    ),
    posShiftsOpened: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          profileId: t.String(),
          cashierUserId: t.String(),
          openedAt: t.Date(),
          status: t.Union([t.Literal("OPEN"), t.Literal("CLOSED")], {
            additionalProperties: false,
          }),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `فتح وردية: الكاشير ورصيد الدرج الافتتاحي لكل وسيلة دفع.`,
        },
      ),
      { additionalProperties: false },
    ),
    posShiftsClosed: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          openingId: t.String(),
          closedAt: t.Date(),
          closedById: __nullable__(t.String()),
          totalDifference: t.Number({
            description: `مجموع الفروق (معدود − متوقَّع) عبر الوسائل؛ موجب = زيادة في الدرج`,
          }),
          journalEntryId: __nullable__(
            t.String({ description: `القيد الذي حمل الفرق، إن وُجد فرق` }),
          ),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `إقفال وردية: المتوقَّع مقابل المعدود لكل وسيلة، والفرق يُرحَّل.`,
        },
      ),
      { additionalProperties: false },
    ),
    prescriptionsWritten: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          patientId: t.String(),
          appointmentId: __nullable__(t.String()),
          inpatientStayId: __nullable__(
            t.String({
              description: `[IP3] وُصفت من داخل إقامة تنويم: تُصرف بلا سداد وتُحاسَب على فاتورة الإقامة،
وصرفُها هو ما يُنشئ أمر ورقة العلاج. عمود قياسيّ بلا علاقة Prisma عن قصد —
نفس سبب \`LabTestOrder.inpatientStayId\`.`,
            }),
          ),
          prescriberId: __nullable__(t.String()),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("ACTIVE"),
              t.Literal("COMPLETED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          weightKgSnapshot: __nullable__(
            t.Number({
              description: `لقطة الوزن التي حُسبت عليها الجرعات، مع وقت قياسه. الوزن يتغيّر، والوصفة
المطبوعة لا؛ فبدون اللقطة تصير مراجعة جرعة قديمة مستحيلة. المصدر
\`VitalSignsRecord\` وحده — لا \`Patient.weight\` (§5.2).`,
            }),
          ),
          weightRecordedAt: __nullable__(t.Date()),
          notesAr: __nullable__(t.String()),
          issuedAt: __nullable__(t.Date()),
          cancelledAt: __nullable__(t.Date()),
          cancelReasonAr: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[PH1] وصفة طبية — BRD_Pharmacy_Module.md §4.`,
        },
      ),
      { additionalProperties: false },
    ),
    dispensedEvents: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          prescriptionItemId: t.String(),
          dispensedById: __nullable__(t.String()),
          warehouseId: t.String(),
          quantity: t.Integer({
            description: `**بوحدات المخزون، صحيح** — لا \`Decimal\` كما في \`prescription_item.quantity\`.
دفتر المخزون كلّه \`Int\` (\`stock_ledger_entry.qtyChange\`، \`stock_batch.qty\`)،
وكسرُ ذلك هنا يعني رصيدًا لا يطابق الدفتر. والكمّية الموصوفة قد تكون كسرية
(٢٫٥ مل) بينما المصروف عبوات كاملة — وهما رقمان مختلفان بحقّ، فلا يُحوَّل
أحدهما إلى الآخر بتقريب صامت: الصيدلي يُدخل ما سلّمه فعلًا.`,
          }),
          batchId: __nullable__(
            t.String({
              description: `لقطة الدفعة — تبقى ولو حُذف صفّ الدفعة لاحقًا. الملصق يطبع ما خرج فعلًا (§9.3)`,
            }),
          ),
          batchNoSnapshot: __nullable__(t.String()),
          expiryDateSnapshot: __nullable__(t.Date()),
          isRefill: t.Boolean(),
          notesAr: __nullable__(t.String()),
          priceSnapshot: __nullable__(
            t.Number({
              description: `[IP3] سعر الوحدة لحظة الصرف. مسار الزيارة يأخذ لقطته في \`appointment_product\`؛
المصروف على إقامة تنويم لا صفّ له هناك، فاللقطة هنا كي تُقرأ فاتورة الإقامة
ما صُرف بسعر يومه لا بسعر الكتالوج يوم الخروج.`,
            }),
          ),
          dispensedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[PH3.1] واقعة صرف — BRD_Pharmacy_Module.md §7.
**صفٌّ لكل واقعة، لا راية على البند.** \`appointment_product\` استعمل \`issuedAt\`
كحارس ضدّ الخصم المزدوج، وهو يكفي لصرفٍ يقع مرّة واحدة. الصرف هنا جزئيّ ومتكرّر
(إعادة صرف)، فالراية لا تكفي: الحارس هو وجود الصفّ نفسه، والمجموع يُقرأ من
الصفوف لا من عمود يُحدَّث (BR-P7.3.1، BR-P7.3.2).`,
        },
      ),
      { additionalProperties: false },
    ),
    controlledPerformed: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          inventoryItemId: t.String(),
          movementType: t.Union(
            [
              t.Literal("RECEIPT"),
              t.Literal("DISPENSE"),
              t.Literal("WASTE"),
              t.Literal("ADJUSTMENT"),
              t.Literal("TRANSFER"),
            ],
            { additionalProperties: false },
          ),
          quantity: t.Integer({
            description: `موجب للإدخال وسالب للإخراج — التوقيع في الرقم لا في نوع الحركة، فيبقى
المجموع الجاري قابلًا للحساب بجمع واحد`,
          }),
          balanceAfter: t.Integer({
            description: `الرصيد بعد هذه الحركة — يُحفظ ولا يُحسب لاحقًا: صفٌّ يُدرَج بأثر رجعي
(تاريخ سابق) لا يجوز أن يعيد كتابة أرصدة صفوف موقَّعة قبله`,
          }),
          dispenseEventId: __nullable__(t.String()),
          patientId: __nullable__(t.String()),
          prescriberId: __nullable__(t.String()),
          performedById: __nullable__(t.String()),
          witnessId: __nullable__(
            t.String({
              description: `شاهد الإتلاف — يجب أن يختلف عن المنفِّذ (BRD §8.3). التوقيع المنفرد على
الإتلاف هو طريق التسريب الكلاسيكي، وإغلاقه سبب وجود السجل أصلًا.`,
            }),
          ),
          reasonAr: __nullable__(t.String()),
          occurredAt: t.Date({
            description: `وقت الحدث الفعلي — قد يُؤرَّخ للخلف`,
          }),
          recordedAt: t.Date({
            description: `وقت التسجيل — لا يُؤرَّخ للخلف أبدًا. الفارق بينهما هو ما يكشف التسجيل المتأخّر`,
          }),
        },
        {
          additionalProperties: false,
          description: `[PH4.2] سجل العهدة — **إلحاقيّ بحت** (BRD §8.1).
لا مسار تعديل ولا مسار حذف: التصحيح صفٌّ معاكس جديد، تمامًا كما تعامل وحدة
المحاسبة مستندًا مُرحَّلًا. سجلٌّ يمكن تعديله ليس سجل عهدة — هو مسوّدة تدّعي أنّها
سجل، والفرق هو كل قيمة السجل.`,
        },
      ),
      { additionalProperties: false },
    ),
    controlledWitnessed: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          inventoryItemId: t.String(),
          movementType: t.Union(
            [
              t.Literal("RECEIPT"),
              t.Literal("DISPENSE"),
              t.Literal("WASTE"),
              t.Literal("ADJUSTMENT"),
              t.Literal("TRANSFER"),
            ],
            { additionalProperties: false },
          ),
          quantity: t.Integer({
            description: `موجب للإدخال وسالب للإخراج — التوقيع في الرقم لا في نوع الحركة، فيبقى
المجموع الجاري قابلًا للحساب بجمع واحد`,
          }),
          balanceAfter: t.Integer({
            description: `الرصيد بعد هذه الحركة — يُحفظ ولا يُحسب لاحقًا: صفٌّ يُدرَج بأثر رجعي
(تاريخ سابق) لا يجوز أن يعيد كتابة أرصدة صفوف موقَّعة قبله`,
          }),
          dispenseEventId: __nullable__(t.String()),
          patientId: __nullable__(t.String()),
          prescriberId: __nullable__(t.String()),
          performedById: __nullable__(t.String()),
          witnessId: __nullable__(
            t.String({
              description: `شاهد الإتلاف — يجب أن يختلف عن المنفِّذ (BRD §8.3). التوقيع المنفرد على
الإتلاف هو طريق التسريب الكلاسيكي، وإغلاقه سبب وجود السجل أصلًا.`,
            }),
          ),
          reasonAr: __nullable__(t.String()),
          occurredAt: t.Date({
            description: `وقت الحدث الفعلي — قد يُؤرَّخ للخلف`,
          }),
          recordedAt: t.Date({
            description: `وقت التسجيل — لا يُؤرَّخ للخلف أبدًا. الفارق بينهما هو ما يكشف التسجيل المتأخّر`,
          }),
        },
        {
          additionalProperties: false,
          description: `[PH4.2] سجل العهدة — **إلحاقيّ بحت** (BRD §8.1).
لا مسار تعديل ولا مسار حذف: التصحيح صفٌّ معاكس جديد، تمامًا كما تعامل وحدة
المحاسبة مستندًا مُرحَّلًا. سجلٌّ يمكن تعديله ليس سجل عهدة — هو مسوّدة تدّعي أنّها
سجل، والفرق هو كل قيمة السجل.`,
        },
      ),
      { additionalProperties: false },
    ),
    batchDisposalsPerformed: t.Array(
      t.Object(
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
      ),
      { additionalProperties: false },
    ),
    batchDisposalsWitnessed: t.Array(
      t.Object(
        { id: t.String(), disposalId: t.String(), userId: t.String() },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    cageMoves: t.Array(
      t.Object(
        {
          id: t.String(),
          stayId: t.String(),
          cageId: t.String(),
          assignedAt: t.Date(),
          releasedAt: __nullable__(t.Date()),
          movedById: __nullable__(t.String()),
          reason: __nullable__(
            t.String({
              description: `سبب النقل — يُطلب عند النقل لا عند الإسكان الأول`,
            }),
          ),
        },
        {
          additionalProperties: false,
          description: `إسكان الإقامة في قفص — سجل مُلحَق: كل نقل صفٌّ جديد، والسابق يُغلق بـ
\`releasedAt\`. الإشغال الحالي = الصفوف بلا \`releasedAt\`.
لماذا سجل لا عمود \`cageId\` على الإقامة؟ لأن «أين كان الحيوان الثلاثاء الماضي؟»
سؤال يُطرح فعلًا — عند تتبّع عدوى مثلًا — وعمودٌ يُكتب فوقه يمحو الجواب.`,
        },
      ),
      { additionalProperties: false },
    ),
    inpatientAdmissions: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String({ description: `IP-XXXX` }),
          clinicId: t.String(),
          branchId: t.String({
            description: `إلزامي: الحيوان المنوَّم موجود فيزيائيًا في فرع واحد`,
          }),
          patientId: t.String(),
          ownerId: t.String(),
          kind: t.Union(
            [
              t.Literal("MEDICAL"),
              t.Literal("SURGICAL"),
              t.Literal("ICU"),
              t.Literal("ISOLATION"),
              t.Literal("BOARDING"),
            ],
            {
              additionalProperties: false,
              description: `نوع الإقامة — يقرّر البوابات الإلزامية وقواعد الإسكان لا شكل السجل.`,
            },
          ),
          status: t.Union(
            [
              t.Literal("REQUESTED"),
              t.Literal("ADMITTED"),
              t.Literal("IN_CARE"),
              t.Literal("DISCHARGE_PENDING"),
              t.Literal("DISCHARGED"),
              t.Literal("CANCELLED"),
            ],
            {
              additionalProperties: false,
              description: `حالات الإقامة. المسار خطّي قصير عمدًا: الإقامة ليست سير عمل بمراحل، بل مدّة
زمنية لها بداية ونهاية وما بينهما رعاية متكرّرة.`,
            },
          ),
          acuity: t.Union(
            [
              t.Literal("LOW"),
              t.Literal("MEDIUM"),
              t.Literal("HIGH"),
              t.Literal("CRITICAL"),
            ],
            {
              additionalProperties: false,
              description: `درجة الحرجية — يدوية في الإصدار الأول (القرار D7). حسابها آليًا من العلامات
الحيوية ممكن لاحقًا وبيانات اللوحة تكفيه، لكن رقمًا محسوبًا يُعرض كأنه حكم
سريري قبل أن يُعاير على أنواع الحيوانات خطرٌ لا فائدة.`,
            },
          ),
          attendingStaffId: t.String({
            description: `الطبيب المعالج — إليه تُصعَّد الإنذارات الحرجة`,
          }),
          admittedById: __nullable__(t.String()),
          appointmentId: __nullable__(
            t.String({
              description: `أبواب الدخول — كلاهما اختياري، فالدخول المباشر (طوارئ) لا يمرّ بأيّهما`,
            }),
          ),
          operationCaseId: __nullable__(t.String()),
          presentingComplaint: __nullable__(t.String()),
          admissionDiagnosis: __nullable__(t.String()),
          isolationReason: __nullable__(t.String()),
          admissionWeightRecordId: __nullable__(
            t.String({
              description: `وزن الدخول كسجل علامات حيوية لا كرقم — الجرعة تُحسب منه، ومصدر الوزن الوحيد
المقبول في هذا النظام هو \`VitalSignsRecord\` (نفس قاعدة \`Prescription\`).`,
            }),
          ),
          monitoringIntervalMinutes: t.Integer({
            description: `دورية قياس العلامات الحيوية بالدقائق — أساس بند «القياس مستحق» في محرّك الاستحقاق`,
          }),
          dailyRateServiceId: __nullable__(
            t.String({
              description: `سعر اليوم — خدمة من كتالوج العيادة، وسعرها مُثبَّت لحظة الدخول فلا يتغيّر
أثر تعديل الكتالوج على إقامة جارية.`,
            }),
          ),
          dailyRateSnapshot: __nullable__(t.Number()),
          requestedAt: t.Date({
            description: `وقت كتابة الطلب. الطلب يسبق الدخول، فـ\`admittedAt\` تبقى فارغة حتى الإسكان
ولا تُقرأ كبداية للإقامة قبله — مدّة الإقامة تُحسب من الدخول لا من الطلب.`,
          }),
          admittedAt: __nullable__(t.Date()),
          expectedDischargeAt: __nullable__(t.Date()),
          dischargedAt: __nullable__(t.Date()),
          dischargeKind: __nullable__(
            t.Union(
              [
                t.Literal("ROUTINE"),
                t.Literal("AGAINST_MEDICAL_ADVICE"),
                t.Literal("TRANSFERRED"),
                t.Literal("DIED"),
                t.Literal("EUTHANIZED"),
              ],
              {
                additionalProperties: false,
                description: `طريقة انتهاء الإقامة. ليست تفصيلًا إحصائيًا: النافق والمُيسَّر موته يتجاوزان
بوابات الأوامر (لا معنى لطلب إيقاف مضادّ حيوي على حيوان نفق) ويستلزمان سببًا.`,
              },
            ),
          ),
          dischargedById: __nullable__(t.String()),
          dischargeSummaryAr: __nullable__(t.String()),
          dischargeInstructionsAr: __nullable__(t.String()),
          cancelReasonAr: __nullable__(t.String()),
          nextDueAt: __nullable__(
            t.Date({
              description: `كاش أقرب استحقاق عبر كل أوامر الإقامة — نفس فكرة \`VaccinationRecord.nextDueAt\`:
«من يحتاج شيئًا الآن؟» يصير مسحًا مفهرسًا بدل حساب لكل إقامة على حدة.
يُعاد حسابه في كل كتابة تحرّكه، ولا يُقرأ قطّ كمصدر حقيقة للعرض التفصيلي.`,
            }),
          ),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `الإقامة — التجميعة الجذر للوحدة.`,
        },
      ),
      { additionalProperties: false },
    ),
    inpatientDischarges: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String({ description: `IP-XXXX` }),
          clinicId: t.String(),
          branchId: t.String({
            description: `إلزامي: الحيوان المنوَّم موجود فيزيائيًا في فرع واحد`,
          }),
          patientId: t.String(),
          ownerId: t.String(),
          kind: t.Union(
            [
              t.Literal("MEDICAL"),
              t.Literal("SURGICAL"),
              t.Literal("ICU"),
              t.Literal("ISOLATION"),
              t.Literal("BOARDING"),
            ],
            {
              additionalProperties: false,
              description: `نوع الإقامة — يقرّر البوابات الإلزامية وقواعد الإسكان لا شكل السجل.`,
            },
          ),
          status: t.Union(
            [
              t.Literal("REQUESTED"),
              t.Literal("ADMITTED"),
              t.Literal("IN_CARE"),
              t.Literal("DISCHARGE_PENDING"),
              t.Literal("DISCHARGED"),
              t.Literal("CANCELLED"),
            ],
            {
              additionalProperties: false,
              description: `حالات الإقامة. المسار خطّي قصير عمدًا: الإقامة ليست سير عمل بمراحل، بل مدّة
زمنية لها بداية ونهاية وما بينهما رعاية متكرّرة.`,
            },
          ),
          acuity: t.Union(
            [
              t.Literal("LOW"),
              t.Literal("MEDIUM"),
              t.Literal("HIGH"),
              t.Literal("CRITICAL"),
            ],
            {
              additionalProperties: false,
              description: `درجة الحرجية — يدوية في الإصدار الأول (القرار D7). حسابها آليًا من العلامات
الحيوية ممكن لاحقًا وبيانات اللوحة تكفيه، لكن رقمًا محسوبًا يُعرض كأنه حكم
سريري قبل أن يُعاير على أنواع الحيوانات خطرٌ لا فائدة.`,
            },
          ),
          attendingStaffId: t.String({
            description: `الطبيب المعالج — إليه تُصعَّد الإنذارات الحرجة`,
          }),
          admittedById: __nullable__(t.String()),
          appointmentId: __nullable__(
            t.String({
              description: `أبواب الدخول — كلاهما اختياري، فالدخول المباشر (طوارئ) لا يمرّ بأيّهما`,
            }),
          ),
          operationCaseId: __nullable__(t.String()),
          presentingComplaint: __nullable__(t.String()),
          admissionDiagnosis: __nullable__(t.String()),
          isolationReason: __nullable__(t.String()),
          admissionWeightRecordId: __nullable__(
            t.String({
              description: `وزن الدخول كسجل علامات حيوية لا كرقم — الجرعة تُحسب منه، ومصدر الوزن الوحيد
المقبول في هذا النظام هو \`VitalSignsRecord\` (نفس قاعدة \`Prescription\`).`,
            }),
          ),
          monitoringIntervalMinutes: t.Integer({
            description: `دورية قياس العلامات الحيوية بالدقائق — أساس بند «القياس مستحق» في محرّك الاستحقاق`,
          }),
          dailyRateServiceId: __nullable__(
            t.String({
              description: `سعر اليوم — خدمة من كتالوج العيادة، وسعرها مُثبَّت لحظة الدخول فلا يتغيّر
أثر تعديل الكتالوج على إقامة جارية.`,
            }),
          ),
          dailyRateSnapshot: __nullable__(t.Number()),
          requestedAt: t.Date({
            description: `وقت كتابة الطلب. الطلب يسبق الدخول، فـ\`admittedAt\` تبقى فارغة حتى الإسكان
ولا تُقرأ كبداية للإقامة قبله — مدّة الإقامة تُحسب من الدخول لا من الطلب.`,
          }),
          admittedAt: __nullable__(t.Date()),
          expectedDischargeAt: __nullable__(t.Date()),
          dischargedAt: __nullable__(t.Date()),
          dischargeKind: __nullable__(
            t.Union(
              [
                t.Literal("ROUTINE"),
                t.Literal("AGAINST_MEDICAL_ADVICE"),
                t.Literal("TRANSFERRED"),
                t.Literal("DIED"),
                t.Literal("EUTHANIZED"),
              ],
              {
                additionalProperties: false,
                description: `طريقة انتهاء الإقامة. ليست تفصيلًا إحصائيًا: النافق والمُيسَّر موته يتجاوزان
بوابات الأوامر (لا معنى لطلب إيقاف مضادّ حيوي على حيوان نفق) ويستلزمان سببًا.`,
              },
            ),
          ),
          dischargedById: __nullable__(t.String()),
          dischargeSummaryAr: __nullable__(t.String()),
          dischargeInstructionsAr: __nullable__(t.String()),
          cancelReasonAr: __nullable__(t.String()),
          nextDueAt: __nullable__(
            t.Date({
              description: `كاش أقرب استحقاق عبر كل أوامر الإقامة — نفس فكرة \`VaccinationRecord.nextDueAt\`:
«من يحتاج شيئًا الآن؟» يصير مسحًا مفهرسًا بدل حساب لكل إقامة على حدة.
يُعاد حسابه في كل كتابة تحرّكه، ولا يُقرأ قطّ كمصدر حقيقة للعرض التفصيلي.`,
            }),
          ),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `الإقامة — التجميعة الجذر للوحدة.`,
        },
      ),
      { additionalProperties: false },
    ),
    inpatientOrdersPrescribed: t.Array(
      t.Object(
        {
          id: t.String(),
          stayId: t.String(),
          idx: t.Integer(),
          kind: t.Union(
            [
              t.Literal("MEDICATION"),
              t.Literal("FLUID"),
              t.Literal("MONITORING"),
              t.Literal("FEEDING"),
              t.Literal("ACTIVITY"),
              t.Literal("WOUND_CARE"),
              t.Literal("LAB"),
              t.Literal("IMAGING"),
              t.Literal("OTHER"),
            ],
            {
              additionalProperties: false,
              description: `نوع الأمر الطبي. متطابق عمدًا مع \`PostOpOrderKind\` في مواضعه المشتركة، فتحويل
أوامر ما بعد العملية إلى أوامر تنويم يبقى ترجمةً واحدة لواحد.`,
            },
          ),
          status: t.Union(
            [
              t.Literal("ACTIVE"),
              t.Literal("PAUSED"),
              t.Literal("COMPLETED"),
              t.Literal("DISCONTINUED"),
            ],
            { additionalProperties: false },
          ),
          inventoryItemId: __nullable__(
            t.String({
              description: `أحد ثلاثة مصادر للمادة: صنف مخزون، أو منتج كتالوج، أو نصّ حرّ. الاسم مُثبَّت
دائمًا فلا يتغيّر ما هو مكتوب على السجل بتعديل الكتالوج.`,
            }),
          ),
          catalogProductId: __nullable__(t.String()),
          nameSnapshot: t.String(),
          prescriptionItemId: __nullable__(
            t.String({
              description: `[IP3] بند الوصفة الذي صُرف فأنشأ هذا الأمر. حين يُضبط: المخزون خُصم في
الصيدلية لحظة الصرف، فإعطاء الجرعة لا يخصم ثانيةً ولا يُسعِّر. عمود قياسيّ.`,
            }),
          ),
          doseAmount: __nullable__(t.Number()),
          doseUnit: __nullable__(t.String()),
          route: __nullable__(
            t.Union(
              [
                t.Literal("IV"),
                t.Literal("IM"),
                t.Literal("SC"),
                t.Literal("PO"),
                t.Literal("INHALATION"),
                t.Literal("TOPICAL"),
                t.Literal("EPIDURAL"),
                t.Literal("OTHER"),
              ],
              { additionalProperties: false },
            ),
          ),
          rateMlPerHour: __nullable__(t.Number()),
          doseSource: __nullable__(
            t.Union(
              [
                t.Literal("CALCULATED"),
                t.Literal("MANUAL"),
                t.Literal("OVERRIDE"),
              ],
              {
                additionalProperties: false,
                description: `مصدر الجرعة المكتوبة — يُحفظ دائمًا ويُعرض على البند. الفرق بين «حسبها النظام»
و«كتبها الطبيب» و«تجاوز المدى الموثّق» ليس بيانات وصفية: هو ما يجعل سجل
التجاوزات (§12.3) ممكنًا أصلًا.`,
              },
            ),
          ),
          overrideReasonAr: __nullable__(t.String()),
          scheduleIntervalHours: __nullable__(
            t.Integer({
              description: `الجدولة: إمّا كل N ساعة، أو أوقات محدّدة من اليوم، أو عند اللزوم (بلا صفوف).
الثلاثة يتبادلن: \`prn\` صحيحة تُلغي التوليد المسبق أصلًا.`,
            }),
          ),
          scheduleTimes: t.Array(
            t.String({ description: `"08:00" بتوقيت العيادة` }),
            { additionalProperties: false },
          ),
          prn: t.Boolean(),
          startAt: t.Date(),
          endAt: __nullable__(t.Date()),
          instructionsAr: __nullable__(t.String()),
          orderedById: __nullable__(t.String()),
          discontinuedById: __nullable__(t.String()),
          discontinuedAt: __nullable__(t.Date()),
          discontinueReasonAr: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `أمر طبي قائم على الإقامة. الحقول الدوائية مطابقة لـ\`PrescriptionItem\` عمدًا:
نفس محرّك الجرعة يتحقّق منها، ونفس مصدر الوزن، ونفس تصنيف التجاوز.`,
        },
      ),
      { additionalProperties: false },
    ),
    inpatientOrdersDiscontinued: t.Array(
      t.Object(
        {
          id: t.String(),
          stayId: t.String(),
          idx: t.Integer(),
          kind: t.Union(
            [
              t.Literal("MEDICATION"),
              t.Literal("FLUID"),
              t.Literal("MONITORING"),
              t.Literal("FEEDING"),
              t.Literal("ACTIVITY"),
              t.Literal("WOUND_CARE"),
              t.Literal("LAB"),
              t.Literal("IMAGING"),
              t.Literal("OTHER"),
            ],
            {
              additionalProperties: false,
              description: `نوع الأمر الطبي. متطابق عمدًا مع \`PostOpOrderKind\` في مواضعه المشتركة، فتحويل
أوامر ما بعد العملية إلى أوامر تنويم يبقى ترجمةً واحدة لواحد.`,
            },
          ),
          status: t.Union(
            [
              t.Literal("ACTIVE"),
              t.Literal("PAUSED"),
              t.Literal("COMPLETED"),
              t.Literal("DISCONTINUED"),
            ],
            { additionalProperties: false },
          ),
          inventoryItemId: __nullable__(
            t.String({
              description: `أحد ثلاثة مصادر للمادة: صنف مخزون، أو منتج كتالوج، أو نصّ حرّ. الاسم مُثبَّت
دائمًا فلا يتغيّر ما هو مكتوب على السجل بتعديل الكتالوج.`,
            }),
          ),
          catalogProductId: __nullable__(t.String()),
          nameSnapshot: t.String(),
          prescriptionItemId: __nullable__(
            t.String({
              description: `[IP3] بند الوصفة الذي صُرف فأنشأ هذا الأمر. حين يُضبط: المخزون خُصم في
الصيدلية لحظة الصرف، فإعطاء الجرعة لا يخصم ثانيةً ولا يُسعِّر. عمود قياسيّ.`,
            }),
          ),
          doseAmount: __nullable__(t.Number()),
          doseUnit: __nullable__(t.String()),
          route: __nullable__(
            t.Union(
              [
                t.Literal("IV"),
                t.Literal("IM"),
                t.Literal("SC"),
                t.Literal("PO"),
                t.Literal("INHALATION"),
                t.Literal("TOPICAL"),
                t.Literal("EPIDURAL"),
                t.Literal("OTHER"),
              ],
              { additionalProperties: false },
            ),
          ),
          rateMlPerHour: __nullable__(t.Number()),
          doseSource: __nullable__(
            t.Union(
              [
                t.Literal("CALCULATED"),
                t.Literal("MANUAL"),
                t.Literal("OVERRIDE"),
              ],
              {
                additionalProperties: false,
                description: `مصدر الجرعة المكتوبة — يُحفظ دائمًا ويُعرض على البند. الفرق بين «حسبها النظام»
و«كتبها الطبيب» و«تجاوز المدى الموثّق» ليس بيانات وصفية: هو ما يجعل سجل
التجاوزات (§12.3) ممكنًا أصلًا.`,
              },
            ),
          ),
          overrideReasonAr: __nullable__(t.String()),
          scheduleIntervalHours: __nullable__(
            t.Integer({
              description: `الجدولة: إمّا كل N ساعة، أو أوقات محدّدة من اليوم، أو عند اللزوم (بلا صفوف).
الثلاثة يتبادلن: \`prn\` صحيحة تُلغي التوليد المسبق أصلًا.`,
            }),
          ),
          scheduleTimes: t.Array(
            t.String({ description: `"08:00" بتوقيت العيادة` }),
            { additionalProperties: false },
          ),
          prn: t.Boolean(),
          startAt: t.Date(),
          endAt: __nullable__(t.Date()),
          instructionsAr: __nullable__(t.String()),
          orderedById: __nullable__(t.String()),
          discontinuedById: __nullable__(t.String()),
          discontinuedAt: __nullable__(t.Date()),
          discontinueReasonAr: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `أمر طبي قائم على الإقامة. الحقول الدوائية مطابقة لـ\`PrescriptionItem\` عمدًا:
نفس محرّك الجرعة يتحقّق منها، ونفس مصدر الوزن، ونفس تصنيف التجاوز.`,
        },
      ),
      { additionalProperties: false },
    ),
    inpatientAdministrationsGiven: t.Array(
      t.Object(
        {
          id: t.String(),
          stayId: t.String(),
          orderId: t.String(),
          dueAt: t.Date(),
          status: t.Union(
            [
              t.Literal("PENDING"),
              t.Literal("GIVEN"),
              t.Literal("SKIPPED"),
              t.Literal("HELD"),
            ],
            {
              additionalProperties: false,
              description: `حالة صفّ الإعطاء الواحد. لا قيمة MISSED هنا عمدًا: الفائت اشتقاق من
(\`dueAt\` + المهلة < الآن) على صفٍّ ما زال PENDING. تخزينه يحتاج وظيفةً دوريّة
تكتبه — ولا مجدول في هذا المستودع — فيصبح الحقل كذبةً كلما نام النظام.`,
            },
          ),
          givenAt: __nullable__(t.Date()),
          performedById: __nullable__(t.String()),
          witnessId: __nullable__(
            t.String({
              description: `الشاهد — إلزامي للمواد المراقَبة، ويجب أن يختلف عن المنفّذ (قاعدة سجل المراقَبة)`,
            }),
          ),
          doseGivenAmount: __nullable__(t.Number()),
          doseGivenUnit: __nullable__(t.String()),
          stockQuantity: __nullable__(
            t.Integer({
              description: `الكمّية المخصومة من المخزون بوحدات المخزون — عدد صحيح عمدًا كما في
\`DispenseEvent.quantity\`: الجرعة السريرية (٢٥٠ مجم) والوحدة المخزنية
(أمبولة) رقمان مختلفان، وخلطُهما يجعل الصيدلية تختلف مع الدفتر إلى الأبد.
null = لم يُخصم مخزون (مراقبة، تغذية، صنف غير مرتبط).`,
            }),
          ),
          warehouseId: __nullable__(t.String()),
          priceSnapshot: __nullable__(
            t.Number({
              description: `سعر الوحدة لحظة الإعطاء — الفوترة تقرأه ولا تعود إلى الكتالوج`,
            }),
          ),
          batchId: __nullable__(
            t.String({
              description: `لقطة الدفعة كما في \`DispenseEvent\`: الدفعة قد تُحذف أو يتغيّر رقمها، وما
دخل جسم الحيوان لا يتغيّر.`,
            }),
          ),
          batchNoSnapshot: __nullable__(t.String()),
          expiryDateSnapshot: __nullable__(t.Date()),
          vitalSignsRecordId: __nullable__(
            t.String({
              description: `أوامر المراقبة تنتهي بقياس — الصفّ يربط السجل الذي أُنشئ عند تنفيذه`,
            }),
          ),
          eatenFraction: __nullable__(
            t.Number({
              description: `حقول ورقة الرعاية المهيكلة — تُملأ لأوامر التغذية والملاحظة، لا للدواء.
مهيكلة لا نصّية لأنها ما يُرسم منه اتجاه: «لم يأكل منذ يومين» لا يُقرأ من ملاحظات.
0.00–1.00 من الوجبة المقدَّمة`,
            }),
          ),
          urination: __nullable__(t.Boolean()),
          defecation: __nullable__(t.Boolean()),
          vomiting: __nullable__(t.Boolean()),
          notesAr: __nullable__(t.String()),
          skipReasonAr: __nullable__(t.String()),
          correctsId: __nullable__(
            t.String({
              description: `سلسلة التصحيح — نفس آلية \`VitalSignsRecord.correctsId\``,
            }),
          ),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `صفّ التنفيذ الواحد — «الجرعة الثامنة مساءً» سطرًا قائمًا بذاته.
هذا هو جوهر الوحدة: ورقة العلاج التي تُملأ على القفص. الصفوف تُولَّد مقدَّمًا من
جدول الأمر، فتظهر في القائمة قبل موعدها، وتُعلَّم عند التنفيذ. صفٌّ حالته GIVEN
لا يُعدَّل أبدًا — التصحيح صفٌّ جديد يشير إليه، تمامًا كسجل العلامات الحيوية.`,
        },
      ),
      { additionalProperties: false },
    ),
    inpatientAdministrationsWitnessed: t.Array(
      t.Object(
        {
          id: t.String(),
          stayId: t.String(),
          orderId: t.String(),
          dueAt: t.Date(),
          status: t.Union(
            [
              t.Literal("PENDING"),
              t.Literal("GIVEN"),
              t.Literal("SKIPPED"),
              t.Literal("HELD"),
            ],
            {
              additionalProperties: false,
              description: `حالة صفّ الإعطاء الواحد. لا قيمة MISSED هنا عمدًا: الفائت اشتقاق من
(\`dueAt\` + المهلة < الآن) على صفٍّ ما زال PENDING. تخزينه يحتاج وظيفةً دوريّة
تكتبه — ولا مجدول في هذا المستودع — فيصبح الحقل كذبةً كلما نام النظام.`,
            },
          ),
          givenAt: __nullable__(t.Date()),
          performedById: __nullable__(t.String()),
          witnessId: __nullable__(
            t.String({
              description: `الشاهد — إلزامي للمواد المراقَبة، ويجب أن يختلف عن المنفّذ (قاعدة سجل المراقَبة)`,
            }),
          ),
          doseGivenAmount: __nullable__(t.Number()),
          doseGivenUnit: __nullable__(t.String()),
          stockQuantity: __nullable__(
            t.Integer({
              description: `الكمّية المخصومة من المخزون بوحدات المخزون — عدد صحيح عمدًا كما في
\`DispenseEvent.quantity\`: الجرعة السريرية (٢٥٠ مجم) والوحدة المخزنية
(أمبولة) رقمان مختلفان، وخلطُهما يجعل الصيدلية تختلف مع الدفتر إلى الأبد.
null = لم يُخصم مخزون (مراقبة، تغذية، صنف غير مرتبط).`,
            }),
          ),
          warehouseId: __nullable__(t.String()),
          priceSnapshot: __nullable__(
            t.Number({
              description: `سعر الوحدة لحظة الإعطاء — الفوترة تقرأه ولا تعود إلى الكتالوج`,
            }),
          ),
          batchId: __nullable__(
            t.String({
              description: `لقطة الدفعة كما في \`DispenseEvent\`: الدفعة قد تُحذف أو يتغيّر رقمها، وما
دخل جسم الحيوان لا يتغيّر.`,
            }),
          ),
          batchNoSnapshot: __nullable__(t.String()),
          expiryDateSnapshot: __nullable__(t.Date()),
          vitalSignsRecordId: __nullable__(
            t.String({
              description: `أوامر المراقبة تنتهي بقياس — الصفّ يربط السجل الذي أُنشئ عند تنفيذه`,
            }),
          ),
          eatenFraction: __nullable__(
            t.Number({
              description: `حقول ورقة الرعاية المهيكلة — تُملأ لأوامر التغذية والملاحظة، لا للدواء.
مهيكلة لا نصّية لأنها ما يُرسم منه اتجاه: «لم يأكل منذ يومين» لا يُقرأ من ملاحظات.
0.00–1.00 من الوجبة المقدَّمة`,
            }),
          ),
          urination: __nullable__(t.Boolean()),
          defecation: __nullable__(t.Boolean()),
          vomiting: __nullable__(t.Boolean()),
          notesAr: __nullable__(t.String()),
          skipReasonAr: __nullable__(t.String()),
          correctsId: __nullable__(
            t.String({
              description: `سلسلة التصحيح — نفس آلية \`VitalSignsRecord.correctsId\``,
            }),
          ),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `صفّ التنفيذ الواحد — «الجرعة الثامنة مساءً» سطرًا قائمًا بذاته.
هذا هو جوهر الوحدة: ورقة العلاج التي تُملأ على القفص. الصفوف تُولَّد مقدَّمًا من
جدول الأمر، فتظهر في القائمة قبل موعدها، وتُعلَّم عند التنفيذ. صفٌّ حالته GIVEN
لا يُعدَّل أبدًا — التصحيح صفٌّ جديد يشير إليه، تمامًا كسجل العلامات الحيوية.`,
        },
      ),
      { additionalProperties: false },
    ),
    authoredInpatientActivity: t.Array(
      t.Object(
        {
          id: t.String(),
          stayId: t.String(),
          authorUserId: __nullable__(t.String()),
          type: t.Union(
            [
              t.Literal("ADMITTED"),
              t.Literal("STATUS_CHANGED"),
              t.Literal("CAGE_ASSIGNED"),
              t.Literal("CAGE_MOVED"),
              t.Literal("ACUITY_CHANGED"),
              t.Literal("ATTENDING_CHANGED"),
              t.Literal("ORDER_CREATED"),
              t.Literal("ORDER_DISCONTINUED"),
              t.Literal("ADMINISTRATION"),
              t.Literal("VITALS_RECORDED"),
              t.Literal("ALERT"),
              t.Literal("NOTE"),
              t.Literal("HANDOVER"),
              t.Literal("COMPLICATION"),
              t.Literal("INVOICE_PAID"),
              t.Literal("DISCHARGED"),
            ],
            { additionalProperties: false },
          ),
          body: __nullable__(t.String()),
          metadata: __nullable__(t.Any()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    createdEmergencyArrivals: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String({ description: `ER-XXXX عبر generateUniqueCode` }),
          clinicId: t.String(),
          branchId: t.String(),
          status: t.Union(
            [
              t.Literal("EN_ROUTE"),
              t.Literal("ARRIVED"),
              t.Literal("TRIAGED"),
              t.Literal("DISPOSED"),
              t.Literal("LEFT_WITHOUT_TRIAGE"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          source: t.Union(
            [
              t.Literal("WALK_IN"),
              t.Literal("PHONE"),
              t.Literal("PUBLIC_BOOKING"),
              t.Literal("PET_PORTAL"),
              t.Literal("AGENT"),
              t.Literal("REFERRAL"),
              t.Literal("MOBILE_REQUEST"),
              t.Literal("SCHEDULED_VISIT"),
            ],
            { additionalProperties: false },
          ),
          expectedAt: __nullable__(
            t.Date({
              description: `«في الطريق»: الوصول المتوقّع. يبقى للمقارنة بعد الوصول الفعلي`,
            }),
          ),
          arrivedAt: __nullable__(t.Date()),
          patientId: __nullable__(
            t.String({
              description: `المريض والمالك — فارغان لحيوان مجهول (كلب شارد، حيوان أحضره غريب). القرار
D2: الفراغ هنا مسموح، أمّا التحويل إلى زيارة فيشترط تسجيل المريض أوّلًا.`,
            }),
          ),
          ownerId: __nullable__(t.String()),
          provisionalLabel: __nullable__(
            t.String({
              description: `وصف مؤقّت لحيوان مجهول: «كلب بنّي، ذكر، ~20 كجم، أُحضر من طريق الملك فهد»`,
            }),
          ),
          presentingComplaint: t.String(),
          appointmentId: __nullable__(
            t.String({
              description: `الزيارة التي تحوّل إليها الوصول عند الفرز — فارغة قبله، وتبقى فارغة لمن غادر`,
            }),
          ),
          createdById: __nullable__(t.String()),
          leftReason: __nullable__(
            t.String({
              description: `سبب المغادرة قبل الفرز أو الإلغاء — مسجَّل دائمًا، فالرقم بلا سبب لا يُحسَّن`,
            }),
          ),
          stability: __nullable__(
            t.Union(
              [
                t.Literal("STABLE"),
                t.Literal("UNSTABLE"),
                t.Literal("CRITICAL"),
              ],
              {
                additionalProperties: false,
                description: `[E5] استقرار الحالة كما قدّره آخر تقييم — يُغيّر «جاهز للقرار» على اللوحة.`,
              },
            ),
          ),
          lastReassessedAt: __nullable__(
            t.Date({
              description: `آخر تقييم (فرز أو إعادة فرز) — منه يُحسب تأخّر إعادة التقييم حسب إيقاع اللون`,
            }),
          ),
          dispositionKind: __nullable__(
            t.Union(
              [
                t.Literal("DISCHARGED"),
                t.Literal("ADMITTED"),
                t.Literal("TO_SURGERY"),
                t.Literal("TRANSFERRED"),
                t.Literal("LEFT_AGAINST_ADVICE"),
                t.Literal("DIED"),
                t.Literal("EUTHANIZED"),
              ],
              {
                additionalProperties: false,
                description: `[E5] مآل حالة الطوارئ — القرار الذي يُقفل الحلقة ويسلّم إلى الوحدة التالية.
كل قيمة تسلّم إلى شيء قائم: الإدخال يكتب **طلب** تنويم (لا إسكانًا — الفصل الذي
اختارته وحدة التنويم بين قرار الطبيب وفعل العنبر)، والجراحة تفتح حالة عملية
بالإلحاح الموروث، والخروج يُكمل مسار الزيارة العادي إلى الدفع.`,
              },
            ),
          ),
          dispositionAt: __nullable__(t.Date()),
          dispositionById: __nullable__(t.String()),
          dispositionNotes: __nullable__(t.String()),
          transferDestination: __nullable__(
            t.String({
              description: `وجهة التحويل — إلزامية حين \`dispositionKind = TRANSFERRED\``,
            }),
          ),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `وصول إلى الطوارئ — **الباب الوحيد الذي لا تملكه آلة الزيارات**.
الزيارة تشترط طبيبًا ووقتًا ومدّة، وثلاثتها مجهولة لحيوان دهسته سيارة في
الثانية فجرًا. هذا السجلّ يحمل تلك الفجوة حتى يسدّها الفرز، فلا نضطرّ إلى
تلفيق طبيب وموعد لنفتح ملفًّا — ولا إلى جعل \`staffId\` اختياريًّا في نموذج
تقرؤه كل شاشة في التطبيق.`,
        },
      ),
      { additionalProperties: false },
    ),
    emergencyDispositions: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String({ description: `ER-XXXX عبر generateUniqueCode` }),
          clinicId: t.String(),
          branchId: t.String(),
          status: t.Union(
            [
              t.Literal("EN_ROUTE"),
              t.Literal("ARRIVED"),
              t.Literal("TRIAGED"),
              t.Literal("DISPOSED"),
              t.Literal("LEFT_WITHOUT_TRIAGE"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          source: t.Union(
            [
              t.Literal("WALK_IN"),
              t.Literal("PHONE"),
              t.Literal("PUBLIC_BOOKING"),
              t.Literal("PET_PORTAL"),
              t.Literal("AGENT"),
              t.Literal("REFERRAL"),
              t.Literal("MOBILE_REQUEST"),
              t.Literal("SCHEDULED_VISIT"),
            ],
            { additionalProperties: false },
          ),
          expectedAt: __nullable__(
            t.Date({
              description: `«في الطريق»: الوصول المتوقّع. يبقى للمقارنة بعد الوصول الفعلي`,
            }),
          ),
          arrivedAt: __nullable__(t.Date()),
          patientId: __nullable__(
            t.String({
              description: `المريض والمالك — فارغان لحيوان مجهول (كلب شارد، حيوان أحضره غريب). القرار
D2: الفراغ هنا مسموح، أمّا التحويل إلى زيارة فيشترط تسجيل المريض أوّلًا.`,
            }),
          ),
          ownerId: __nullable__(t.String()),
          provisionalLabel: __nullable__(
            t.String({
              description: `وصف مؤقّت لحيوان مجهول: «كلب بنّي، ذكر، ~20 كجم، أُحضر من طريق الملك فهد»`,
            }),
          ),
          presentingComplaint: t.String(),
          appointmentId: __nullable__(
            t.String({
              description: `الزيارة التي تحوّل إليها الوصول عند الفرز — فارغة قبله، وتبقى فارغة لمن غادر`,
            }),
          ),
          createdById: __nullable__(t.String()),
          leftReason: __nullable__(
            t.String({
              description: `سبب المغادرة قبل الفرز أو الإلغاء — مسجَّل دائمًا، فالرقم بلا سبب لا يُحسَّن`,
            }),
          ),
          stability: __nullable__(
            t.Union(
              [
                t.Literal("STABLE"),
                t.Literal("UNSTABLE"),
                t.Literal("CRITICAL"),
              ],
              {
                additionalProperties: false,
                description: `[E5] استقرار الحالة كما قدّره آخر تقييم — يُغيّر «جاهز للقرار» على اللوحة.`,
              },
            ),
          ),
          lastReassessedAt: __nullable__(
            t.Date({
              description: `آخر تقييم (فرز أو إعادة فرز) — منه يُحسب تأخّر إعادة التقييم حسب إيقاع اللون`,
            }),
          ),
          dispositionKind: __nullable__(
            t.Union(
              [
                t.Literal("DISCHARGED"),
                t.Literal("ADMITTED"),
                t.Literal("TO_SURGERY"),
                t.Literal("TRANSFERRED"),
                t.Literal("LEFT_AGAINST_ADVICE"),
                t.Literal("DIED"),
                t.Literal("EUTHANIZED"),
              ],
              {
                additionalProperties: false,
                description: `[E5] مآل حالة الطوارئ — القرار الذي يُقفل الحلقة ويسلّم إلى الوحدة التالية.
كل قيمة تسلّم إلى شيء قائم: الإدخال يكتب **طلب** تنويم (لا إسكانًا — الفصل الذي
اختارته وحدة التنويم بين قرار الطبيب وفعل العنبر)، والجراحة تفتح حالة عملية
بالإلحاح الموروث، والخروج يُكمل مسار الزيارة العادي إلى الدفع.`,
              },
            ),
          ),
          dispositionAt: __nullable__(t.Date()),
          dispositionById: __nullable__(t.String()),
          dispositionNotes: __nullable__(t.String()),
          transferDestination: __nullable__(
            t.String({
              description: `وجهة التحويل — إلزامية حين \`dispositionKind = TRANSFERRED\``,
            }),
          ),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `وصول إلى الطوارئ — **الباب الوحيد الذي لا تملكه آلة الزيارات**.
الزيارة تشترط طبيبًا ووقتًا ومدّة، وثلاثتها مجهولة لحيوان دهسته سيارة في
الثانية فجرًا. هذا السجلّ يحمل تلك الفجوة حتى يسدّها الفرز، فلا نضطرّ إلى
تلفيق طبيب وموعد لنفتح ملفًّا — ولا إلى جعل \`staffId\` اختياريًّا في نموذج
تقرؤه كل شاشة في التطبيق.`,
        },
      ),
      { additionalProperties: false },
    ),
    triageAssessments: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          branchId: t.String(),
          appointmentId: t.String(),
          patientId: __nullable__(
            t.String({
              description: `فارغ لحيوان مجهول لم يُسجَّل بعد (القرار D2)`,
            }),
          ),
          proposedCategory: t.Union(
            [
              t.Literal("RED"),
              t.Literal("ORANGE"),
              t.Literal("YELLOW"),
              t.Literal("GREEN"),
              t.Literal("BLUE"),
            ],
            {
              additionalProperties: false,
              description: `فئات قائمة الفرز البيطرية (VTL — Ruys et al. 2012) المشتقّة من مقياس مانشستر.
الأهداف الزمنية لكل فئة في \`emergency.rules.ts\` لا هنا: العتبة التي تقرّر من
يُرى أوّلًا تُراجَع في طلب دمج ويوقّعها إنسان، ولا تُحرَّر من شاشة إعدادات.`,
            },
          ),
          category: t.Union(
            [
              t.Literal("RED"),
              t.Literal("ORANGE"),
              t.Literal("YELLOW"),
              t.Literal("GREEN"),
              t.Literal("BLUE"),
            ],
            {
              additionalProperties: false,
              description: `فئات قائمة الفرز البيطرية (VTL — Ruys et al. 2012) المشتقّة من مقياس مانشستر.
الأهداف الزمنية لكل فئة في \`emergency.rules.ts\` لا هنا: العتبة التي تقرّر من
يُرى أوّلًا تُراجَع في طلب دمج ويوقّعها إنسان، ولا تُحرَّر من شاشة إعدادات.`,
            },
          ),
          overrideReason: __nullable__(t.String()),
          discriminators: t.Array(
            t.String({
              description: `أكواد مُميِّزات VTL المُختارة — المرجع في \`triage-discriminators.data.ts\``,
            }),
            { additionalProperties: false },
          ),
          attScore: __nullable__(
            t.Integer({
              description: `درجة ATT (0–18). \`null\` حين لا تكتمل محاورها — لا تُلفَّق درجة من محور ناقص،
فدرجةٌ ملفَّقة تُقرأ كتنبّؤ بالنجاة وهي ليست كذلك.`,
            }),
          ),
          vitalsRecordId: __nullable__(t.String()),
          supersedesId: __nullable__(
            t.String({ description: `سلسلة إعادة الفرز` }),
          ),
          assessedById: t.String(),
          assessedAt: t.Date(),
          notes: __nullable__(t.String()),
        },
        {
          additionalProperties: false,
          description: `تقييم فرز واحد — **صفٌّ يُضاف ولا يُعدَّل أبدًا** (درس \`InpatientAdministration\`
و\`AnesthesiaEvent\`).
الفرز سلسلة لا حدث: الحيوان يتدهور في غرفة الانتظار، وإعادة الفرز هي ما يلتقط
ذلك. فالتقييم الجديد يشير إلى الذي حلّ محلّه (\`supersedesId\`) بدل أن يكتب فوقه،
ويبقى الأصل شاهدًا على ما كان معلومًا في تلك اللحظة.`,
        },
      ),
      { additionalProperties: false },
    ),
    recordedPatientAlerts: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          patientId: t.String(),
          kind: t.Union(
            [
              t.Literal("ALLERGY"),
              t.Literal("CHRONIC_CONDITION"),
              t.Literal("BITE_RISK"),
              t.Literal("CODE_STATUS"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          label: t.String({
            description: `ALLERGY: المادة · CHRONIC_CONDITION: الحالة · CODE_STATUS: DNR/CPR · BITE_RISK: السلوك`,
          }),
          severity: t.Union(
            [t.Literal("MILD"), t.Literal("MODERATE"), t.Literal("SEVERE")],
            { additionalProperties: false },
          ),
          notes: __nullable__(t.String()),
          active: t.Boolean(),
          recordedById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `تنبيه سلامة على مستوى **المريض** — لا على مستوى مستند.
اليوم لا وجود لهذا: الحساسية نصٌّ حرّ في تقييم ما قبل التخدير
(\`operations.dao.ts\`) وخانةٌ في إقرار الفندقة، ولا شيء منهما تقرؤه الصيدلية ولا
شاشة الفرز. ونظامٌ يصرف موادّ مراقبة وحساسياتُه نصٌّ حرّ في نموذج تخدير له ثغرة
سلامة قائمة بذاتها، مستقلّة تمامًا عن الطوارئ.`,
        },
      ),
      { additionalProperties: false },
    ),
    handledPetOwnerRequests: t.Array(
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
    authoredClinicalNotes: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          patientId: t.String({
            description: `مالك السجل هو الحيوان لا الموعد — ولهذا يبقى السجل حين يُحذف الموعد`,
          }),
          appointmentId: __nullable__(
            t.String({
              description: `null = ملاحظة بلا زيارة: استشارة هاتفية، فرز مراجع، أو رأي طبيب ثانٍ
(القرار §11-A). الموعد الواحد يحتمل أكثر من ملاحظة.`,
            }),
          ),
          templateId: __nullable__(
            t.String({
              description: `لقطة القالب — يبقى \`templateKey\`/\`templateVersion\` مقروءَين حتى لو حُذف الصف`,
            }),
          ),
          templateKey: __nullable__(t.String()),
          templateVersion: __nullable__(t.Integer()),
          authorUserId: t.String(),
          status: t.Union(
            [t.Literal("DRAFT"), t.Literal("FINAL"), t.Literal("AMENDED")],
            { additionalProperties: false },
          ),
          subjective: __nullable__(
            t.String({
              description: `النصّ المُركَّب — ما يقرأه إنسان. يُجمَّد عند التوثيق، ولا يتغيّر إذا عُدّل
القالب لاحقًا. هي نفس غريزة \`Invoice.priceSnapshot\`.`,
            }),
          ),
          objective: __nullable__(t.String()),
          assessment: __nullable__(t.String()),
          plan: __nullable__(t.String()),
          answers: t.Any({
            description: `{ [blockId]: value } — البنية القابلة للاستعلام، وهي ما تقرأه التقارير`,
          }),
          vitalsRecordId: __nullable__(
            t.String({
              description: `يُشار إلى القياس ولا يُعاد التقاطه — وحدة العلامات الحيوية تبقى الكاتب الوحيد`,
            }),
          ),
          finalizedAt: __nullable__(t.Date()),
          finalizedById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `ملاحظة سريرية واحدة — مسوَّدة تُكتب بحرّية، ثم تُوثَّق فلا تُعدَّل بعدها أبدًا.`,
        },
      ),
      { additionalProperties: false },
    ),
    finalizedClinicalNotes: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          patientId: t.String({
            description: `مالك السجل هو الحيوان لا الموعد — ولهذا يبقى السجل حين يُحذف الموعد`,
          }),
          appointmentId: __nullable__(
            t.String({
              description: `null = ملاحظة بلا زيارة: استشارة هاتفية، فرز مراجع، أو رأي طبيب ثانٍ
(القرار §11-A). الموعد الواحد يحتمل أكثر من ملاحظة.`,
            }),
          ),
          templateId: __nullable__(
            t.String({
              description: `لقطة القالب — يبقى \`templateKey\`/\`templateVersion\` مقروءَين حتى لو حُذف الصف`,
            }),
          ),
          templateKey: __nullable__(t.String()),
          templateVersion: __nullable__(t.Integer()),
          authorUserId: t.String(),
          status: t.Union(
            [t.Literal("DRAFT"), t.Literal("FINAL"), t.Literal("AMENDED")],
            { additionalProperties: false },
          ),
          subjective: __nullable__(
            t.String({
              description: `النصّ المُركَّب — ما يقرأه إنسان. يُجمَّد عند التوثيق، ولا يتغيّر إذا عُدّل
القالب لاحقًا. هي نفس غريزة \`Invoice.priceSnapshot\`.`,
            }),
          ),
          objective: __nullable__(t.String()),
          assessment: __nullable__(t.String()),
          plan: __nullable__(t.String()),
          answers: t.Any({
            description: `{ [blockId]: value } — البنية القابلة للاستعلام، وهي ما تقرأه التقارير`,
          }),
          vitalsRecordId: __nullable__(
            t.String({
              description: `يُشار إلى القياس ولا يُعاد التقاطه — وحدة العلامات الحيوية تبقى الكاتب الوحيد`,
            }),
          ),
          finalizedAt: __nullable__(t.Date()),
          finalizedById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `ملاحظة سريرية واحدة — مسوَّدة تُكتب بحرّية، ثم تُوثَّق فلا تُعدَّل بعدها أبدًا.`,
        },
      ),
      { additionalProperties: false },
    ),
    clinicalNoteAddenda: t.Array(
      t.Object(
        {
          id: t.String(),
          noteId: t.String(),
          text: t.String(),
          authoredById: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `التصحيح بعد التوثيق يُلحَق ولا يُكتب فوقه — نمط \`RadiologyReportAddendum\` نفسه.`,
        },
      ),
      { additionalProperties: false },
    ),
    reminderOutbox: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          channel: t.Union(
            [
              t.Literal("INBOX"),
              t.Literal("EMAIL"),
              t.Literal("WHATSAPP"),
              t.Literal("SMS"),
              t.Literal("PUSH"),
            ],
            { additionalProperties: false },
          ),
          status: t.Union(
            [
              t.Literal("QUEUED"),
              t.Literal("SENDING"),
              t.Literal("SENT"),
              t.Literal("FAILED"),
              t.Literal("SKIPPED"),
              t.Literal("CANCELLED"),
              t.Literal("AWAITING_MANUAL"),
            ],
            { additionalProperties: false },
          ),
          recipientKind: t.Union(
            [t.Literal("OWNER"), t.Literal("USER"), t.Literal("CLINIC")],
            { additionalProperties: false },
          ),
          ownerId: __nullable__(t.String()),
          recipientUserId: __nullable__(t.String()),
          toAddress: __nullable__(
            t.String({
              description: `عنوان التسليم وقت الإدراج (بريد أو رقم E.164) — لقطة: تغيير رقم المالك
لاحقًا يجب ألّا يُعيد كتابة إلى أين ذهبت رسالةُ الأمس`,
            }),
          ),
          subject: __nullable__(t.String()),
          body: t.String(),
          trigger: __nullable__(
            t.Union(
              [
                t.Literal("VACCINATION_DUE"),
                t.Literal("GROOMING_DUE"),
                t.Literal("NUTRITION_RECHECK_DUE"),
                t.Literal("APPOINTMENT_UPCOMING"),
                t.Literal("APPOINTMENT_NO_SHOW"),
                t.Literal("CARE_PLAN_VISIT_DUE"),
                t.Literal("INVOICE_OVERDUE"),
                t.Literal("MEMBERSHIP_RENEWAL"),
                t.Literal("POST_OP_FOLLOW_UP"),
              ],
              {
                additionalProperties: false,
                description: `سببُ التذكير. كلٌّ منها مربوطٌ بمحرّك استحقاق **قائم بالفعل** — لا يعيد أيٌّ
منها حساب موعدٍ من جديد، وهذا شرطٌ لا تفصيل: نسخةٌ ثانية من منطق الجدولة تختلف
عن الأولى حتمًا، فيصير التذكير يقول غير ما تقوله الشاشة.`,
              },
            ),
          ),
          ruleId: __nullable__(t.String()),
          patientId: __nullable__(t.String()),
          appointmentId: __nullable__(t.String()),
          dedupeKey: t.String(),
          scheduledFor: t.Date(),
          attempts: t.Integer(),
          maxAttempts: t.Integer(),
          sentAt: __nullable__(t.Date()),
          failedAt: __nullable__(t.Date()),
          lastError: __nullable__(t.String()),
          manualLink: __nullable__(
            t.String({
              description: `مزوّد واتساب MANUAL: رابط wa.me الجاهز. وجودُه يعني أن الإرسال فعلٌ بشريّ
موثَّق، لا وعدٌ بإرسالٍ آليّ لا يحدث.`,
            }),
          ),
          manualSentById: __nullable__(
            t.String({
              description: `من ضغط الرابط — به يصير الإرسال اليدويّ حدثًا مسجَّلًا لا افتراضًا`,
            }),
          ),
          metadata: __nullable__(t.Any()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `رسالةٌ صادرة واحدة، بقناةٍ واحدة، لمستلِمٍ واحد.
**\`dedupeKey\` هو العمود الحامل.** صيغته
\`{trigger}:{subjectId}:{بصمة الاستحقاق}\` — مثلًا
\`VACCINATION_DUE:pat_123:RABIES:2026-10-01\`. وفرادتُه على مستوى العيادة هي ما
يجعل المُجدوِل عديمَ الأثر عند التكرار: أوّلُ إدراجٍ يفوز، وما بعده يُهمَل بهدوء.
بدونه كان كل تشغيل cron يُنشئ رسالةً جديدة للسبب نفسه.
والجسد **لقطة** لا قالبٌ يُحلّ عند الإرسال: تعديل القالب غدًا يجب ألّا يغيّر ما
أُرسل أمس (نفس منطق \`VaccinationRecord.vaccineNameSnapshot\`).`,
        },
      ),
      { additionalProperties: false },
    ),
    recallContacts: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          ownerId: t.String(),
          patientId: __nullable__(t.String()),
          trigger: t.Union(
            [
              t.Literal("VACCINATION_DUE"),
              t.Literal("GROOMING_DUE"),
              t.Literal("NUTRITION_RECHECK_DUE"),
              t.Literal("APPOINTMENT_UPCOMING"),
              t.Literal("APPOINTMENT_NO_SHOW"),
              t.Literal("CARE_PLAN_VISIT_DUE"),
              t.Literal("INVOICE_OVERDUE"),
              t.Literal("MEMBERSHIP_RENEWAL"),
              t.Literal("POST_OP_FOLLOW_UP"),
            ],
            {
              additionalProperties: false,
              description: `سببُ التذكير. كلٌّ منها مربوطٌ بمحرّك استحقاق **قائم بالفعل** — لا يعيد أيٌّ
منها حساب موعدٍ من جديد، وهذا شرطٌ لا تفصيل: نسخةٌ ثانية من منطق الجدولة تختلف
عن الأولى حتمًا، فيصير التذكير يقول غير ما تقوله الشاشة.`,
            },
          ),
          dedupeKey: t.String({
            description: `نفس بصمة \`NotificationOutbox.dedupeKey\` — بها يُربط التواصل باستحقاقٍ بعينه
ويُكتم من قائمة العمل ما عولج فعلًا`,
          }),
          channel: t.Union(
            [
              t.Literal("PHONE"),
              t.Literal("WHATSAPP"),
              t.Literal("EMAIL"),
              t.Literal("SMS"),
              t.Literal("IN_PERSON"),
              t.Literal("INBOX"),
            ],
            { additionalProperties: false },
          ),
          outcome: t.Union(
            [
              t.Literal("BOOKED"),
              t.Literal("NO_ANSWER"),
              t.Literal("CALLBACK_REQUESTED"),
              t.Literal("DECLINED"),
              t.Literal("WRONG_NUMBER"),
              t.Literal("SNOOZED"),
              t.Literal("INFORMED"),
            ],
            { additionalProperties: false },
          ),
          notes: __nullable__(t.String()),
          snoozedUntil: __nullable__(
            t.Date({
              description: `تأجيلٌ صريح — قائمة اليوم تتخطّاه حتى هذا التاريخ`,
            }),
          ),
          bookedAppointmentId: __nullable__(
            t.String({
              description: `الموعد الذي أُغلق به الاستدعاء حين \`outcome = BOOKED\``,
            }),
          ),
          contactedById: __nullable__(t.String()),
          contactedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `«كلّمنا هذا المالك». الصفّ الذي لم يكن موجودًا قبل هذه الوحدة إطلاقًا — ولا
\`lastContactedAt\` ولا عدّاد محاولات ولا تأجيل. أثرُ غيابه ملموس: قائمة استدعاءٍ
يعمل عليها موظّفان فيُكلَّم المالك مرّتين، ونسبة الالتزام (المقياس الذي تبيعه
أنظمة الاستدعاء التجارية) غير قابلة للحساب أصلًا.`,
        },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const UserPlainInputCreate = t.Object(
  {
    name: t.String(),
    email: t.String(),
    emailVerified: t.Boolean(),
    image: t.Optional(__nullable__(t.String())),
    phone: t.Optional(__nullable__(t.String())),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const UserPlainInputUpdate = t.Object(
  {
    name: t.Optional(t.String()),
    email: t.Optional(t.String()),
    emailVerified: t.Optional(t.Boolean()),
    image: t.Optional(__nullable__(t.String())),
    phone: t.Optional(__nullable__(t.String())),
    createdAt: t.Optional(t.Date()),
    updatedAt: t.Optional(t.Date()),
  },
  { additionalProperties: false },
);

export const UserRelationsInputCreate = t.Object(
  {
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
    accounts: t.Optional(
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
    clinicUsers: t.Optional(
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
    invitesSent: t.Optional(
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
    assignedTasks: t.Optional(
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
    createdTasks: t.Optional(
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
    crmOwnedLeads: t.Optional(
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
    crmStatusChanges: t.Optional(
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
    crmAuthoredNotes: t.Optional(
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
    crmEmailsSent: t.Optional(
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
    crmWhatsappSent: t.Optional(
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
    crmSavedViews: t.Optional(
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
    crmAssignedTasks: t.Optional(
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
    crmAuthoredComments: t.Optional(
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
    crmOwnedDeals: t.Optional(
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
    managedBranches: t.Optional(
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
    managerOfBranches: t.Optional(
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
    managedRooms: t.Optional(
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
    branchMemberships: t.Optional(
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
    staffProfiles: t.Optional(
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
    authoredInternalNotes: t.Optional(
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
    authoredAppointmentEvents: t.Optional(
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
    authoredMobileUnitEvents: t.Optional(
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
    pairedMobileUnitDevices: t.Optional(
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
    handledMobileRequests: t.Optional(
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
    revokedMobileUnitDevices: t.Optional(
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
    authoredPatientEvents: t.Optional(
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
    authoredAppointmentDocuments: t.Optional(
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
    authoredStaffDocuments: t.Optional(
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
    authoredClinicDocuments: t.Optional(
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
    stockLedgerEntries: t.Optional(
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
    purchaseOrders: t.Optional(
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
    authoredProductComments: t.Optional(
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
    authoredTaskActivity: t.Optional(
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
    createdInboxItems: t.Optional(
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
    authoredInboxActivity: t.Optional(
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
    inboxReads: t.Optional(
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
    inboxSettings: t.Optional(
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
    requestedExpenses: t.Optional(
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
    decidedExpenses: t.Optional(
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
    refundedInvoices: t.Optional(
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
    refundedSales: t.Optional(
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
    expenseStepActions: t.Optional(
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
    payrollRunsCreated: t.Optional(
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
    eosSettlementsCreated: t.Optional(
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
    payrollApprovals: t.Optional(
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
    agentConversations: t.Optional(
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
    requestedLabTests: t.Optional(
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
    qcReviewedLabTests: t.Optional(
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
    assignedLabTests: t.Optional(
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
    reviewedLabTests: t.Optional(
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
    rejectedLabTests: t.Optional(
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
    collectedLabSamples: t.Optional(
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
    authoredLabActivity: t.Optional(
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
    authoredLabComments: t.Optional(
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
    requestedRadiologyOrders: t.Optional(
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
    assignedRadiologyExams: t.Optional(
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
    reviewedRadiologyExams: t.Optional(
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
    rejectedRadiologyExams: t.Optional(
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
    performedRadiologyExams: t.Optional(
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
    uploadedRadiologyStudies: t.Optional(
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
    authoredRadiologyReports: t.Optional(
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
    criticalRadiologyNotices: t.Optional(
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
    authoredRadiologyAddenda: t.Optional(
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
    authoredRadiologyComments: t.Optional(
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
    authoredRadiologyActivity: t.Optional(
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
    authoredOperationActivity: t.Optional(
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
    recordedAnesthesiaEvents: t.Optional(
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
    recoveryAssessments: t.Optional(
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
    reportedComplications: t.Optional(
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
    authoredOperationComments: t.Optional(
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
    recordedVitalSigns: t.Optional(
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
    conversationMemberships: t.Optional(
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
    authoredChatMessages: t.Optional(
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
    startedSopRuns: t.Optional(
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
    completedSopRuns: t.Optional(
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
    respondedSopSteps: t.Optional(
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
    createdVaccinationRecords: t.Optional(
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
    voidedVaccinationRecords: t.Optional(
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
    posSales: t.Optional(
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
    posProfileAccess: t.Optional(
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
    posShiftsOpened: t.Optional(
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
    posShiftsClosed: t.Optional(
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
    prescriptionsWritten: t.Optional(
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
    dispensedEvents: t.Optional(
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
    controlledPerformed: t.Optional(
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
    controlledWitnessed: t.Optional(
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
    batchDisposalsPerformed: t.Optional(
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
    batchDisposalsWitnessed: t.Optional(
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
    cageMoves: t.Optional(
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
    inpatientAdmissions: t.Optional(
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
    inpatientDischarges: t.Optional(
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
    inpatientOrdersPrescribed: t.Optional(
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
    inpatientOrdersDiscontinued: t.Optional(
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
    inpatientAdministrationsGiven: t.Optional(
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
    inpatientAdministrationsWitnessed: t.Optional(
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
    authoredInpatientActivity: t.Optional(
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
    createdEmergencyArrivals: t.Optional(
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
    emergencyDispositions: t.Optional(
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
    triageAssessments: t.Optional(
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
    recordedPatientAlerts: t.Optional(
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
    handledPetOwnerRequests: t.Optional(
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
    authoredClinicalNotes: t.Optional(
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
    finalizedClinicalNotes: t.Optional(
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
    clinicalNoteAddenda: t.Optional(
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
    reminderOutbox: t.Optional(
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
    recallContacts: t.Optional(
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

export const UserRelationsInputUpdate = t.Partial(
  t.Object(
    {
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
      accounts: t.Partial(
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
      clinicUsers: t.Partial(
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
      invitesSent: t.Partial(
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
      assignedTasks: t.Partial(
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
      createdTasks: t.Partial(
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
      crmOwnedLeads: t.Partial(
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
      crmStatusChanges: t.Partial(
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
      crmAuthoredNotes: t.Partial(
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
      crmEmailsSent: t.Partial(
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
      crmWhatsappSent: t.Partial(
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
      crmSavedViews: t.Partial(
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
      crmAssignedTasks: t.Partial(
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
      crmAuthoredComments: t.Partial(
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
      crmOwnedDeals: t.Partial(
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
      managedBranches: t.Partial(
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
      managerOfBranches: t.Partial(
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
      managedRooms: t.Partial(
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
      branchMemberships: t.Partial(
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
      staffProfiles: t.Partial(
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
      authoredInternalNotes: t.Partial(
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
      authoredAppointmentEvents: t.Partial(
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
      authoredMobileUnitEvents: t.Partial(
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
      pairedMobileUnitDevices: t.Partial(
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
      handledMobileRequests: t.Partial(
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
      revokedMobileUnitDevices: t.Partial(
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
      authoredPatientEvents: t.Partial(
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
      authoredAppointmentDocuments: t.Partial(
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
      authoredStaffDocuments: t.Partial(
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
      authoredClinicDocuments: t.Partial(
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
      stockLedgerEntries: t.Partial(
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
      purchaseOrders: t.Partial(
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
      authoredProductComments: t.Partial(
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
      authoredTaskActivity: t.Partial(
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
      createdInboxItems: t.Partial(
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
      authoredInboxActivity: t.Partial(
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
      inboxReads: t.Partial(
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
      inboxSettings: t.Partial(
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
      requestedExpenses: t.Partial(
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
      decidedExpenses: t.Partial(
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
      refundedInvoices: t.Partial(
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
      refundedSales: t.Partial(
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
      expenseStepActions: t.Partial(
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
      payrollRunsCreated: t.Partial(
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
      eosSettlementsCreated: t.Partial(
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
      payrollApprovals: t.Partial(
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
      agentConversations: t.Partial(
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
      requestedLabTests: t.Partial(
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
      qcReviewedLabTests: t.Partial(
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
      assignedLabTests: t.Partial(
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
      reviewedLabTests: t.Partial(
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
      rejectedLabTests: t.Partial(
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
      collectedLabSamples: t.Partial(
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
      authoredLabActivity: t.Partial(
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
      authoredLabComments: t.Partial(
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
      requestedRadiologyOrders: t.Partial(
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
      assignedRadiologyExams: t.Partial(
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
      reviewedRadiologyExams: t.Partial(
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
      rejectedRadiologyExams: t.Partial(
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
      performedRadiologyExams: t.Partial(
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
      uploadedRadiologyStudies: t.Partial(
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
      authoredRadiologyReports: t.Partial(
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
      criticalRadiologyNotices: t.Partial(
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
      authoredRadiologyAddenda: t.Partial(
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
      authoredRadiologyComments: t.Partial(
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
      authoredRadiologyActivity: t.Partial(
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
      authoredOperationActivity: t.Partial(
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
      recordedAnesthesiaEvents: t.Partial(
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
      recoveryAssessments: t.Partial(
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
      reportedComplications: t.Partial(
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
      authoredOperationComments: t.Partial(
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
      recordedVitalSigns: t.Partial(
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
      conversationMemberships: t.Partial(
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
      authoredChatMessages: t.Partial(
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
      startedSopRuns: t.Partial(
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
      completedSopRuns: t.Partial(
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
      respondedSopSteps: t.Partial(
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
      createdVaccinationRecords: t.Partial(
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
      voidedVaccinationRecords: t.Partial(
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
      posSales: t.Partial(
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
      posProfileAccess: t.Partial(
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
      posShiftsOpened: t.Partial(
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
      posShiftsClosed: t.Partial(
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
      prescriptionsWritten: t.Partial(
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
      dispensedEvents: t.Partial(
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
      controlledPerformed: t.Partial(
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
      controlledWitnessed: t.Partial(
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
      batchDisposalsPerformed: t.Partial(
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
      batchDisposalsWitnessed: t.Partial(
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
      cageMoves: t.Partial(
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
      inpatientAdmissions: t.Partial(
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
      inpatientDischarges: t.Partial(
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
      inpatientOrdersPrescribed: t.Partial(
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
      inpatientOrdersDiscontinued: t.Partial(
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
      inpatientAdministrationsGiven: t.Partial(
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
      inpatientAdministrationsWitnessed: t.Partial(
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
      authoredInpatientActivity: t.Partial(
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
      createdEmergencyArrivals: t.Partial(
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
      emergencyDispositions: t.Partial(
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
      triageAssessments: t.Partial(
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
      recordedPatientAlerts: t.Partial(
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
      handledPetOwnerRequests: t.Partial(
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
      authoredClinicalNotes: t.Partial(
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
      finalizedClinicalNotes: t.Partial(
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
      clinicalNoteAddenda: t.Partial(
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
      reminderOutbox: t.Partial(
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
      recallContacts: t.Partial(
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

export const UserWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          name: t.String(),
          email: t.String(),
          emailVerified: t.Boolean(),
          image: t.String(),
          phone: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "User" },
  ),
);

export const UserWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), email: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ email: t.String() })],
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
              name: t.String(),
              email: t.String(),
              emailVerified: t.Boolean(),
              image: t.String(),
              phone: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "User" },
);

export const UserSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      name: t.Boolean(),
      email: t.Boolean(),
      emailVerified: t.Boolean(),
      image: t.Boolean(),
      phone: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      sessions: t.Boolean(),
      accounts: t.Boolean(),
      clinicUsers: t.Boolean(),
      invitesSent: t.Boolean(),
      assignedTasks: t.Boolean(),
      createdTasks: t.Boolean(),
      crmOwnedLeads: t.Boolean(),
      crmStatusChanges: t.Boolean(),
      crmAuthoredNotes: t.Boolean(),
      crmEmailsSent: t.Boolean(),
      crmWhatsappSent: t.Boolean(),
      crmSavedViews: t.Boolean(),
      crmAssignedTasks: t.Boolean(),
      crmAuthoredComments: t.Boolean(),
      crmOwnedDeals: t.Boolean(),
      managedBranches: t.Boolean(),
      managerOfBranches: t.Boolean(),
      managedRooms: t.Boolean(),
      branchMemberships: t.Boolean(),
      staffProfiles: t.Boolean(),
      authoredInternalNotes: t.Boolean(),
      authoredAppointmentEvents: t.Boolean(),
      authoredMobileUnitEvents: t.Boolean(),
      pairedMobileUnitDevices: t.Boolean(),
      handledMobileRequests: t.Boolean(),
      revokedMobileUnitDevices: t.Boolean(),
      authoredPatientEvents: t.Boolean(),
      authoredAppointmentDocuments: t.Boolean(),
      authoredStaffDocuments: t.Boolean(),
      authoredClinicDocuments: t.Boolean(),
      stockLedgerEntries: t.Boolean(),
      purchaseOrders: t.Boolean(),
      authoredProductComments: t.Boolean(),
      authoredTaskActivity: t.Boolean(),
      createdInboxItems: t.Boolean(),
      authoredInboxActivity: t.Boolean(),
      inboxReads: t.Boolean(),
      inboxSettings: t.Boolean(),
      requestedExpenses: t.Boolean(),
      decidedExpenses: t.Boolean(),
      refundedInvoices: t.Boolean(),
      refundedSales: t.Boolean(),
      expenseStepActions: t.Boolean(),
      payrollRunsCreated: t.Boolean(),
      eosSettlementsCreated: t.Boolean(),
      payrollApprovals: t.Boolean(),
      agentConversations: t.Boolean(),
      requestedLabTests: t.Boolean(),
      qcReviewedLabTests: t.Boolean(),
      assignedLabTests: t.Boolean(),
      reviewedLabTests: t.Boolean(),
      rejectedLabTests: t.Boolean(),
      collectedLabSamples: t.Boolean(),
      authoredLabActivity: t.Boolean(),
      authoredLabComments: t.Boolean(),
      requestedRadiologyOrders: t.Boolean(),
      assignedRadiologyExams: t.Boolean(),
      reviewedRadiologyExams: t.Boolean(),
      rejectedRadiologyExams: t.Boolean(),
      performedRadiologyExams: t.Boolean(),
      uploadedRadiologyStudies: t.Boolean(),
      authoredRadiologyReports: t.Boolean(),
      criticalRadiologyNotices: t.Boolean(),
      authoredRadiologyAddenda: t.Boolean(),
      authoredRadiologyComments: t.Boolean(),
      authoredRadiologyActivity: t.Boolean(),
      authoredOperationActivity: t.Boolean(),
      recordedAnesthesiaEvents: t.Boolean(),
      recoveryAssessments: t.Boolean(),
      reportedComplications: t.Boolean(),
      authoredOperationComments: t.Boolean(),
      recordedVitalSigns: t.Boolean(),
      conversationMemberships: t.Boolean(),
      authoredChatMessages: t.Boolean(),
      startedSopRuns: t.Boolean(),
      completedSopRuns: t.Boolean(),
      respondedSopSteps: t.Boolean(),
      createdVaccinationRecords: t.Boolean(),
      voidedVaccinationRecords: t.Boolean(),
      posSales: t.Boolean(),
      posProfileAccess: t.Boolean(),
      posShiftsOpened: t.Boolean(),
      posShiftsClosed: t.Boolean(),
      prescriptionsWritten: t.Boolean(),
      dispensedEvents: t.Boolean(),
      controlledPerformed: t.Boolean(),
      controlledWitnessed: t.Boolean(),
      batchDisposalsPerformed: t.Boolean(),
      batchDisposalsWitnessed: t.Boolean(),
      cageMoves: t.Boolean(),
      inpatientAdmissions: t.Boolean(),
      inpatientDischarges: t.Boolean(),
      inpatientOrdersPrescribed: t.Boolean(),
      inpatientOrdersDiscontinued: t.Boolean(),
      inpatientAdministrationsGiven: t.Boolean(),
      inpatientAdministrationsWitnessed: t.Boolean(),
      authoredInpatientActivity: t.Boolean(),
      createdEmergencyArrivals: t.Boolean(),
      emergencyDispositions: t.Boolean(),
      triageAssessments: t.Boolean(),
      recordedPatientAlerts: t.Boolean(),
      handledPetOwnerRequests: t.Boolean(),
      authoredClinicalNotes: t.Boolean(),
      finalizedClinicalNotes: t.Boolean(),
      clinicalNoteAddenda: t.Boolean(),
      reminderOutbox: t.Boolean(),
      recallContacts: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const UserInclude = t.Partial(
  t.Object(
    {
      sessions: t.Boolean(),
      accounts: t.Boolean(),
      clinicUsers: t.Boolean(),
      invitesSent: t.Boolean(),
      assignedTasks: t.Boolean(),
      createdTasks: t.Boolean(),
      crmOwnedLeads: t.Boolean(),
      crmStatusChanges: t.Boolean(),
      crmAuthoredNotes: t.Boolean(),
      crmEmailsSent: t.Boolean(),
      crmWhatsappSent: t.Boolean(),
      crmSavedViews: t.Boolean(),
      crmAssignedTasks: t.Boolean(),
      crmAuthoredComments: t.Boolean(),
      crmOwnedDeals: t.Boolean(),
      managedBranches: t.Boolean(),
      managerOfBranches: t.Boolean(),
      managedRooms: t.Boolean(),
      branchMemberships: t.Boolean(),
      staffProfiles: t.Boolean(),
      authoredInternalNotes: t.Boolean(),
      authoredAppointmentEvents: t.Boolean(),
      authoredMobileUnitEvents: t.Boolean(),
      pairedMobileUnitDevices: t.Boolean(),
      handledMobileRequests: t.Boolean(),
      revokedMobileUnitDevices: t.Boolean(),
      authoredPatientEvents: t.Boolean(),
      authoredAppointmentDocuments: t.Boolean(),
      authoredStaffDocuments: t.Boolean(),
      authoredClinicDocuments: t.Boolean(),
      stockLedgerEntries: t.Boolean(),
      purchaseOrders: t.Boolean(),
      authoredProductComments: t.Boolean(),
      authoredTaskActivity: t.Boolean(),
      createdInboxItems: t.Boolean(),
      authoredInboxActivity: t.Boolean(),
      inboxReads: t.Boolean(),
      inboxSettings: t.Boolean(),
      requestedExpenses: t.Boolean(),
      decidedExpenses: t.Boolean(),
      refundedInvoices: t.Boolean(),
      refundedSales: t.Boolean(),
      expenseStepActions: t.Boolean(),
      payrollRunsCreated: t.Boolean(),
      eosSettlementsCreated: t.Boolean(),
      payrollApprovals: t.Boolean(),
      agentConversations: t.Boolean(),
      requestedLabTests: t.Boolean(),
      qcReviewedLabTests: t.Boolean(),
      assignedLabTests: t.Boolean(),
      reviewedLabTests: t.Boolean(),
      rejectedLabTests: t.Boolean(),
      collectedLabSamples: t.Boolean(),
      authoredLabActivity: t.Boolean(),
      authoredLabComments: t.Boolean(),
      requestedRadiologyOrders: t.Boolean(),
      assignedRadiologyExams: t.Boolean(),
      reviewedRadiologyExams: t.Boolean(),
      rejectedRadiologyExams: t.Boolean(),
      performedRadiologyExams: t.Boolean(),
      uploadedRadiologyStudies: t.Boolean(),
      authoredRadiologyReports: t.Boolean(),
      criticalRadiologyNotices: t.Boolean(),
      authoredRadiologyAddenda: t.Boolean(),
      authoredRadiologyComments: t.Boolean(),
      authoredRadiologyActivity: t.Boolean(),
      authoredOperationActivity: t.Boolean(),
      recordedAnesthesiaEvents: t.Boolean(),
      recoveryAssessments: t.Boolean(),
      reportedComplications: t.Boolean(),
      authoredOperationComments: t.Boolean(),
      recordedVitalSigns: t.Boolean(),
      conversationMemberships: t.Boolean(),
      authoredChatMessages: t.Boolean(),
      startedSopRuns: t.Boolean(),
      completedSopRuns: t.Boolean(),
      respondedSopSteps: t.Boolean(),
      createdVaccinationRecords: t.Boolean(),
      voidedVaccinationRecords: t.Boolean(),
      posSales: t.Boolean(),
      posProfileAccess: t.Boolean(),
      posShiftsOpened: t.Boolean(),
      posShiftsClosed: t.Boolean(),
      prescriptionsWritten: t.Boolean(),
      dispensedEvents: t.Boolean(),
      controlledPerformed: t.Boolean(),
      controlledWitnessed: t.Boolean(),
      batchDisposalsPerformed: t.Boolean(),
      batchDisposalsWitnessed: t.Boolean(),
      cageMoves: t.Boolean(),
      inpatientAdmissions: t.Boolean(),
      inpatientDischarges: t.Boolean(),
      inpatientOrdersPrescribed: t.Boolean(),
      inpatientOrdersDiscontinued: t.Boolean(),
      inpatientAdministrationsGiven: t.Boolean(),
      inpatientAdministrationsWitnessed: t.Boolean(),
      authoredInpatientActivity: t.Boolean(),
      createdEmergencyArrivals: t.Boolean(),
      emergencyDispositions: t.Boolean(),
      triageAssessments: t.Boolean(),
      recordedPatientAlerts: t.Boolean(),
      handledPetOwnerRequests: t.Boolean(),
      authoredClinicalNotes: t.Boolean(),
      finalizedClinicalNotes: t.Boolean(),
      clinicalNoteAddenda: t.Boolean(),
      reminderOutbox: t.Boolean(),
      recallContacts: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const UserOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      email: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      emailVerified: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      image: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      phone: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const User = t.Composite([UserPlain, UserRelations], {
  additionalProperties: false,
});

export const UserInputCreate = t.Composite(
  [UserPlainInputCreate, UserRelationsInputCreate],
  { additionalProperties: false },
);

export const UserInputUpdate = t.Composite(
  [UserPlainInputUpdate, UserRelationsInputUpdate],
  { additionalProperties: false },
);
