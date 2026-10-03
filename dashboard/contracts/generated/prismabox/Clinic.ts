import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClinicPlain = t.Object(
  {
    id: t.String(),
    name: t.String(),
    slug: __nullable__(t.String()),
    plan: t.Union([t.Literal("FREE"), t.Literal("BASIC"), t.Literal("PRO")], {
      additionalProperties: false,
    }),
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
);

export const ClinicRelations = t.Object(
  {
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
    invites: t.Array(
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
    tasks: t.Array(
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
    inboxItems: t.Array(
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
    crmEmailTemplates: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          name: t.String(),
          subject: t.String(),
          body: t.String({
            description: `نصّ القالب بمتغيّراته الحرفية — يُخزَّن كما كتبه المستخدم، ويُحَلّ عند الإرسال`,
          }),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[CRM-P3] §9.1 — قالب بريد عربي. المتغيّرات \`{{...}}\` تُحَلّ من الكيان عند الإنشاء.`,
        },
      ),
      { additionalProperties: false },
    ),
    crmEmailMessages: t.Array(
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
    crmWhatsappMessages: t.Array(
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
    settings: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          name: __nullable__(t.String()),
          logo: __nullable__(t.String()),
          email: __nullable__(t.String()),
          phone: __nullable__(t.String()),
          licenseNumber: __nullable__(t.String()),
          taxRegistryNumber: __nullable__(t.String()),
          website: __nullable__(t.String()),
          city: __nullable__(t.String()),
          address: __nullable__(t.String()),
          description: __nullable__(t.String()),
          countryCode: __nullable__(t.String()),
          timezone: t.String(),
          calendarType: t.Union([t.Literal("GREGORIAN"), t.Literal("HIJRI")], {
            additionalProperties: false,
          }),
          timeFormat: t.Union([t.Literal("H12"), t.Literal("H24")], {
            additionalProperties: false,
          }),
          vatRate: t.Number(),
          currencyCode: t.String(),
          attendanceEnabled: t.Boolean(),
          kioskEnabled: t.Boolean(),
          kioskPin: __nullable__(t.String()),
          isVerified: t.Boolean(),
        },
        { additionalProperties: false },
      ),
    ),
    protocols: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          avma: t.Boolean(),
          soapNotes: t.Boolean(),
          avmaMedicine: t.Boolean(),
          fecava: t.Boolean(),
          wsava: t.Boolean(),
          esccap: t.Boolean(),
          operationPaymentGate: t.Boolean(),
          operationCountsForMinor: t.Boolean(),
          operationRecoveryScoreMin: t.Integer(),
        },
        { additionalProperties: false },
      ),
    ),
    notificationSettings: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          emailEnabled: t.Boolean(),
          customerFollowUp: t.Boolean(),
          systemUpdates: t.Boolean(),
          emailBookings: t.Boolean(),
          emailAppointmentUpdates: t.Boolean(),
          emailAppointmentCancellations: t.Boolean(),
          emailReminderApprovalEnabled: t.Boolean(),
          emailReminderApprovalHours: t.Integer(),
          emailReminderFollowUpEnabled: t.Boolean(),
          emailReminderFollowUpHours: t.Integer(),
          emailReminderPaymentEnabled: t.Boolean(),
          emailReminderPaymentHours: t.Integer(),
          emailReminderCommentsEnabled: t.Boolean(),
          emailInvoices: t.Boolean(),
          emailFormRequest: t.Boolean(),
          emailFormFollowUp: t.Boolean(),
          emailTreatmentFollowUp: t.Boolean(),
          vaccinationDueEnabled: t.Boolean(),
          vaccinationDueLeadDays: t.Integer(),
        },
        { additionalProperties: false },
      ),
    ),
    schedulingSettings: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          schedulingEnabled: t.Boolean(),
          workDays: t.Array(
            t.Union(
              [
                t.Literal("SUNDAY"),
                t.Literal("MONDAY"),
                t.Literal("TUESDAY"),
                t.Literal("WEDNESDAY"),
                t.Literal("THURSDAY"),
                t.Literal("FRIDAY"),
                t.Literal("SATURDAY"),
              ],
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
          shiftsEnabled: t.Boolean(),
          morningStartMinute: t.Integer(),
          morningEndMinute: t.Integer(),
          eveningStartMinute: t.Integer(),
          eveningEndMinute: t.Integer(),
          bookingRulesEnabled: t.Boolean(),
          appointmentBookingEnabled: t.Boolean(),
          onlineBookingEnabled: t.Boolean(),
          doubleBookingEnabled: t.Boolean(),
          appointmentBufferEnabled: t.Boolean(),
          appointmentBufferMinutes: t.Integer(),
          confirmationTimeoutEnabled: t.Boolean(),
          confirmationTimeoutHours: t.Union(
            [t.Literal("H12"), t.Literal("H24")],
            { additionalProperties: false },
          ),
          minimumBookingNoticeEnabled: t.Boolean(),
          minimumBookingNoticeHours: t.Union(
            [t.Literal("H12"), t.Literal("H24")],
            { additionalProperties: false },
          ),
          rescheduleNoticeEnabled: t.Boolean(),
          rescheduleNoticeHours: t.Union([t.Literal("H12"), t.Literal("H24")], {
            additionalProperties: false,
          }),
        },
        { additionalProperties: false },
      ),
    ),
    payrollSettings: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          gosiSaudiEmployeeRate: t.Number(),
          gosiSaudiCompanyRate: t.Number(),
          gosiNonSaudiEmployeeRate: t.Number(),
          gosiNonSaudiCompanyRate: t.Number(),
          gosiCeiling: t.Number(),
          overtimeBase: t.Union([t.Literal("BASIC"), t.Literal("TOTAL")], {
            additionalProperties: false,
          }),
          overtimeMultiplier: t.Number(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    leaveTypes: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          slug: t.String(),
          name: t.String(),
          entitlementDays: __nullable__(t.Integer()),
          payPercent: t.Number(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    payrollRuns: t.Array(
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
    eosSettlements: t.Array(
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
    agentSettings: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          generalAssistantEnabled: t.Boolean(),
          webSearchEnabled: t.Boolean(),
          mcpEnabled: t.Boolean(),
          enabledGuardrails: t.Array(t.String(), {
            additionalProperties: false,
          }),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
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
    services: t.Array(
      t.Object(
        {
          id: t.String(),
          name: t.String(),
          level: t.Union(
            [
              t.Literal("CATEGORY"),
              t.Literal("SUBCATEGORY"),
              t.Literal("ITEM"),
            ],
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
      { additionalProperties: false },
    ),
    serviceConfigs: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          serviceId: t.String(),
          price: __nullable__(t.Number()),
          duration: __nullable__(t.Integer()),
          isActive: t.Boolean(),
          itemTaxTemplateId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    serviceUsages: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          serviceId: t.String(),
          usedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    branches: t.Array(
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
    branchUsers: t.Array(
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
    rooms: t.Array(
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
    specializations: t.Array(
      t.Object(
        {
          id: t.String(),
          name: t.String(),
          description: __nullable__(t.String()),
          level: t.Union([t.Literal("CATEGORY"), t.Literal("SUBCATEGORY")], {
            additionalProperties: false,
          }),
          parentId: __nullable__(t.String()),
          isDefault: t.Boolean(),
          isActive: t.Boolean(),
          clinicId: __nullable__(t.String()),
          order: t.Integer(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    consultationTypes: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: __nullable__(t.String()),
          name: t.String(),
          isDefault: t.Boolean(),
          active: t.Boolean(),
          order: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    consultationTypeConfigs: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          consultationTypeId: t.String(),
          price: __nullable__(t.Number()),
          examTemplateId: __nullable__(
            t.String({
              description: `قالب الفحص الافتراضي لهذا الكشف. null = لا تخصيص، فيسقط الترشيح إلى القالب
العامّ (GENERAL_V1) كما كان. الموضع هنا لا على \`ConsultationType\` نفسه لأن
أنواع الكشف قد تكون عالمية (\`clinicId = null\`)، والقالب مِلك عيادة بعينها —
وهذا الجدول هو بالضبط «إعداد هذه العيادة لهذا النوع».
SetNull لا Cascade: حذف قالب لا يجوز أن يحذف تسعيرة الكشف معه.`,
            }),
          ),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    staffRoles: t.Array(
      t.Object(
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
      { additionalProperties: false },
    ),
    roleAssignments: t.Array(
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
    permissionAuditLogs: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          actorId: __nullable__(
            t.String({ description: `null = النظام (مهمة خلفية أو ترحيل)` }),
          ),
          action: t.String({
            description: `"role.grant" | "role.revoke" | "staff.assign" | "role.super_admin" …`,
          }),
          roleId: __nullable__(t.String()),
          staffId: __nullable__(t.String()),
          before: __nullable__(t.Any()),
          after: __nullable__(t.Any()),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[RBAC P1] سجلّ تدقيق كل تغيير على السلطة: منح، سحب، إسناد دور، رفع/خفض مدير النظام.
لا يوجد اليوم أيّ سجلّ لتغيّرات الصلاحيات في المخطط — فمن رفع نفسه مديرًا لا يترك أثرًا.`,
        },
      ),
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
    attendances: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          staffId: t.String(),
          date: t.Date(),
          checkIn: __nullable__(t.Date()),
          checkOut: __nullable__(t.Date()),
          status: t.Union(
            [
              t.Literal("PRESENT"),
              t.Literal("ABSENT"),
              t.Literal("LATE"),
              t.Literal("LEAVE"),
              t.Literal("MISSION"),
              t.Literal("OVERTIME"),
            ],
            { additionalProperties: false },
          ),
          hours: t.Number(),
          notes: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    shiftAssignments: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          staffId: t.String(),
          date: t.Date(),
          type: t.Union(
            [t.Literal("MORNING"), t.Literal("EVENING"), t.Literal("NIGHT")],
            { additionalProperties: false },
          ),
          startMinute: __nullable__(t.Integer()),
          endMinute: __nullable__(t.Integer()),
          hours: t.Number(),
          notes: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    leaveRequests: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          staffId: t.String(),
          code: t.String(),
          type: t.String(),
          startDate: t.Date(),
          endDate: t.Date(),
          days: t.Integer(),
          notes: __nullable__(t.String()),
          substituteStaffId: __nullable__(t.String()),
          status: t.Union(
            [
              t.Literal("PENDING"),
              t.Literal("APPROVED"),
              t.Literal("REJECTED"),
            ],
            { additionalProperties: false },
          ),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    compensatoryEntries: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          staffId: t.String(),
          minutes: t.Integer(),
          source: t.String(),
          reason: __nullable__(t.String()),
          date: t.Date(),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    animalTypes: t.Array(
      t.Object(
        {
          id: t.String(),
          code: __nullable__(t.String()),
          arName: t.String(),
          enName: t.String(),
          isDefault: t.Boolean(),
          clinicId: __nullable__(t.String()),
          createdAt: t.Date(),
          species: __nullable__(
            t.Union(
              [
                t.Literal("DOG"),
                t.Literal("CAT"),
                t.Literal("HORSE"),
                t.Literal("CATTLE"),
                t.Literal("SHEEP"),
                t.Literal("GOAT"),
                t.Literal("CAMEL"),
                t.Literal("POULTRY"),
                t.Literal("RABBIT"),
                t.Literal("SWINE"),
                t.Literal("FISH"),
                t.Literal("BEE"),
              ],
              { additionalProperties: false },
            ),
          ),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    strains: t.Array(
      t.Object(
        {
          id: t.String(),
          code: __nullable__(t.String()),
          arName: t.String(),
          enName: t.String(),
          animalTypeId: t.String(),
          avgWeightMin: __nullable__(t.Integer()),
          avgWeightMax: __nullable__(t.Integer()),
          avgAgeMin: __nullable__(t.Integer()),
          avgAgeMax: __nullable__(t.Integer()),
          originCountry: __nullable__(t.String()),
          hairType: __nullable__(
            t.Union(
              [
                t.Literal("LONG_THICK"),
                t.Literal("SHORT_THICK"),
                t.Literal("LIGHT"),
                t.Literal("MEDIUM"),
                t.Literal("DOUBLE_COAT"),
                t.Literal("NONE"),
              ],
              { additionalProperties: false },
            ),
          ),
          activityLevel: __nullable__(
            t.Union(
              [t.Literal("LOW"), t.Literal("MEDIUM"), t.Literal("HIGH")],
              { additionalProperties: false },
            ),
          ),
          groomingNeeds: __nullable__(
            t.Union(
              [t.Literal("LOW"), t.Literal("MEDIUM"), t.Literal("HIGH")],
              { additionalProperties: false },
            ),
          ),
          isBrachycephalic: t.Boolean(),
          commonDiseases: t.Array(t.String(), { additionalProperties: false }),
          isDefault: t.Boolean(),
          clinicId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    owners: t.Array(
      t.Object(
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
      { additionalProperties: false },
    ),
    patients: t.Array(
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
      { additionalProperties: false },
    ),
    appointments: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          branchId: t.String(),
          ownerId: t.String(),
          patientId: t.String(),
          staffId: t.String(),
          roomId: __nullable__(t.String()),
          startsAt: t.Date(),
          durationMinutes: t.Integer(),
          location: t.Union(
            [
              t.Literal("IN_CLINIC"),
              t.Literal("REMOTE"),
              t.Literal("HOME_VISIT"),
              t.Literal("MOBILE_CLINIC"),
            ],
            { additionalProperties: false },
          ),
          status: t.Union(
            [
              t.Literal("SCHEDULED"),
              t.Literal("WAITING"),
              t.Literal("CHECK_IN"),
              t.Literal("IN_SERVICE"),
              t.Literal("HOSPITALIZED"),
              t.Literal("AWAITING_PAYMENT"),
              t.Literal("DONE"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          queueStatus: __nullable__(
            t.Union(
              [
                t.Literal("ON_HOLD"),
                t.Literal("NO_SHOW"),
                t.Literal("CONFIRMED"),
              ],
              { additionalProperties: false },
            ),
          ),
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
          isEmergency: t.Boolean({
            description: `[E0] يبقى كما هو، ويصبح **إسقاطًا** لا مدخلًا حين تُفعَّل طبقة الطوارئ على الفرع:
\`isEmergency = triageCategory ∈ {RED, ORANGE}\` تُكتب في نفس معاملة التقييم. نفس
سابقة \`isUrgent ⇔ priority === URGENT\` في التحاليل والأشعة. مع الطبقة مُطفأة يبقى
مفتاحًا يدويًّا كما كان، فكل مستهلك قائم (ترتيب الطابور، الشارة، صفّ الإنذار،
الوكيل، معالج الحجز) يعمل بلا تعديل سطر واحد.`,
          }),
          triageCategory: __nullable__(
            t.Union(
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
          ),
          arrivedAt: __nullable__(
            t.Date({
              description: `[E0] وقت الوصول الفعلي — لا وقت الموعد. \`startsAt\` هو ما كان مجدولًا، وهذا ما
حدث. كل هدف انتظار وكل مقياس «من الباب إلى الطبيب» يُقاس من هنا، ولا يُشتقّ من
\`startsAt\` لأن مريض الطوارئ يصل قبل موعده أو بلا موعد أصلًا.`,
            }),
          ),
          reason: __nullable__(t.String()),
          symptoms: __nullable__(t.String()),
          clinicalNotes: __nullable__(t.String()),
          consultationTypeId: __nullable__(t.String()),
          serviceAddressId: __nullable__(t.String()),
          consultationFeeSnapshot: __nullable__(t.Number()),
          consultationPaidAt: __nullable__(t.Date()),
          whatsappReminderEnabled: t.Boolean(),
          images: t.Array(t.String(), { additionalProperties: false }),
          recurringGroupId: __nullable__(t.String()),
          recurringIndex: __nullable__(t.Integer()),
          recurringTotal: __nullable__(t.Integer()),
          repeatUnit: __nullable__(
            t.Union(
              [
                t.Literal("DAY"),
                t.Literal("WEEK"),
                t.Literal("TWO_WEEKS"),
                t.Literal("MONTH"),
                t.Literal("YEAR"),
              ],
              { additionalProperties: false },
            ),
          ),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    invoices: t.Array(
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
    inventoryItems: t.Array(
      t.Object(
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
      { additionalProperties: false },
    ),
    suppliers: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          logo: __nullable__(t.String()),
          legalName: t.String(),
          type: t.String(),
          commercialReg: __nullable__(t.String()),
          supplierCode: __nullable__(t.String()),
          description: __nullable__(t.String()),
          rating: __nullable__(t.Number()),
          categories: t.Array(t.String(), { additionalProperties: false }),
          products: t.Array(t.String(), { additionalProperties: false }),
          leadTimeDays: __nullable__(t.Integer()),
          minOrderQty: __nullable__(t.Integer()),
          supportsReturns: t.Boolean(),
          returnPolicy: __nullable__(t.String()),
          contactName: t.String(),
          contactTitle: __nullable__(t.String()),
          phone: t.String(),
          email: __nullable__(t.String()),
          website: __nullable__(t.String()),
          country: __nullable__(t.String()),
          city: __nullable__(t.String()),
          address: __nullable__(t.String()),
          mapUrl: __nullable__(t.String()),
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
    insurers: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          name: t.String(),
          phone: __nullable__(t.String()),
          email: __nullable__(t.String()),
          contactPerson: __nullable__(t.String()),
          address: __nullable__(t.String()),
          settlementDays: t.Integer(),
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
    insuranceProducts: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          insurerId: t.String(),
          name: t.String(),
          coveragePercentDefault: t.Number(),
          annualCap: __nullable__(t.Number()),
          perClaimCap: __nullable__(t.Number()),
          deductibleFixed: t.Number(),
          deductiblePercent: t.Number(),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    patientPolicies: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          patientId: t.String(),
          productId: t.String(),
          policyNumber: t.String(),
          policyStart: t.Date(),
          policyEnd: t.Date(),
          status: t.Union(
            [
              t.Literal("ACTIVE"),
              t.Literal("EXPIRED"),
              t.Literal("SUSPENDED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          capConsumed: t.Number(),
          notes: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    insuranceClaims: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          documentNo: __nullable__(t.String()),
          invoiceId: t.String(),
          policyId: t.String(),
          insurerId: t.String(),
          patientId: t.String(),
          ownerId: t.String(),
          policyNumberSnapshot: t.String(),
          serviceDate: t.Date(),
          claimedAmount: t.Number(),
          approvedAmount: __nullable__(t.Number()),
          settledAmount: t.Number(),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("APPROVED"),
              t.Literal("PARTIALLY_APPROVED"),
              t.Literal("REJECTED"),
              t.Literal("SETTLED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          coverageSnapshot: t.Any(),
          submittedAt: __nullable__(t.Date()),
          adjudicatedAt: __nullable__(t.Date()),
          rejectionReason: __nullable__(t.String()),
          insurerReference: __nullable__(t.String()),
          rejectionResolution: __nullable__(
            t.Union([t.Literal("REBILL_OWNER"), t.Literal("WRITE_OFF")], {
              additionalProperties: false,
            }),
          ),
          resolutionJournalEntryId: __nullable__(t.String()),
          resolvedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    crmSettings: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          enableCrmModule: t.Boolean(),
          crmDefaultSlaPolicyId: __nullable__(
            t.String({
              description: `§10 — [CRM-P5] صار علاقةً حقيقية كما وعد تعليق CRM-P0: الجدول موجود الآن.
\`SetNull\` لا \`Restrict\`: حذف سياسةٍ يترك العيادة بلا سياسةٍ افتراضية، وهي حالة
صحيحة (§10.1 «أوّل سياسةٍ فعّالة مطابِقة» تعمل بلا افتراضيّ أصلًا).`,
            }),
          ),
          crmWhatsappProvider: t.Union(
            [t.Literal("MANUAL"), t.Literal("GREEN_API")],
            { additionalProperties: false },
          ),
          crmEmailFromName: __nullable__(t.String()),
          waInstanceIdSealed: __nullable__(
            t.String({
              description: `[CRM-P4] بيانات اعتماد Green API — **مشفَّرة عند الراحة** بصيغة \`v1.<nonce>.<ct>\`
عبر \`@/lib/crypto/secret-box\` (§17.2 صفّ ١٩). لا تُعاد إلى العميل أبدًا، ولو مشفَّرة.`,
            }),
          ),
          waApiTokenSealed: __nullable__(t.String()),
          waConnectionState: __nullable__(
            t.String({
              description: `آخر حالة اتصالٍ معروفة من \`stateInstanceChanged\` — تُعرض ولا يُبنى عليها منطق إرسال`,
            }),
          ),
          waCheckedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    crmLeadStatuses: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          name: t.String(),
          color: t.String(),
          order: t.Integer(),
          kind: t.Union(
            [t.Literal("OPEN"), t.Literal("CONVERTED"), t.Literal("LOST")],
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
    crmDealStatuses: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          name: t.String(),
          color: t.String(),
          order: t.Integer(),
          kind: t.Union(
            [t.Literal("OPEN"), t.Literal("WON"), t.Literal("LOST")],
            { additionalProperties: false },
          ),
          defaultProbability: t.Number(),
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
    crmLeadSources: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          name: t.String(),
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
    crmLostReasons: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          name: t.String(),
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
    crmIndustries: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          name: t.String(),
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
    crmSlaPolicies: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          name: t.String(),
          appliesTo: t.Union(
            [t.Literal("LEAD"), t.Literal("DEAL"), t.Literal("BOTH")],
            {
              additionalProperties: false,
              description: `[CRM-P5] §10.1 — على أيّ كيانٍ تنطبق السياسة.`,
            },
          ),
          firstResponseMinutes: t.Integer({
            description: `الهدف بالدقائق، محسوبًا على **وقت العمل** لا الساعة الجدارية (§17.2 صفّ ٢٢).`,
          }),
          order: t.Integer(),
          isActive: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[CRM-P5] §10.1 — سياسة استجابةٍ أولى واحدة، مسطَّحة عمدًا.
النظام المرجعيّ يحمل مصفوفة أولويّات (هدفٌ لكل أولوية × كل مصدر). v1 يسطّحها إلى
**هدفٍ واحد للسياسة** + تجاوزات اختيارية لكل مصدر في صفوفٍ ابنة، لأنّ المصفوفة
الكاملة بلا محرّك دوراتٍ متجدّدة (§10.5، مؤجَّل [P2]) تكون تعقيدًا بلا ثمرة.
**الاختيار: أوّل سياسةٍ فعّالة مطابِقة تنطبق عند الإنشاء** (قاعدة النظام المرجعيّ).
«مطابِقة» = بلا صفوف مصادر (تنطبق على الكلّ) أو أنّ مصدر السجلّ ضمن صفوفها.
و\`order\` يفضّ التعادل صراحةً: بلا ترتيبٍ ثابت تصير «الأولى» رهنَ ترتيب الاستعلام.`,
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
    loyaltySettings: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          enableLoyaltyModule: t.Boolean({
            description: `§0.3 — وعد الوحدة المركزي. مطفأ ⇒ لا أثر ملحوظ في أيّ مكان.`,
          }),
          loyaltyTierWindowMonths: t.Integer({
            description: `§4 — النافذة المتدحرجة التي يُحسب عليها الإنفاق المؤهِّل للمستوى (BR-L4.1)`,
          }),
          loyaltyExpiryNoticeDays: t.Integer({
            description: `§13 — «تنتهي قريبًا»: كم يومًا قبل الانتهاء تُعدّ النقاط وشيكة (§10.3، §11.4)`,
          }),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[LY-P0] §13 — إعدادات الوحدة، جدولٌ **مكتوب الأعمدة** خاص بالنطاق.
ولماذا ليست في سجلّ \`AccountsSetting\`: ذلك السجلّ محكومٌ بصلاحية
\`accounting.accounts_settings.write\`، فوضع مفتاح وحدةٍ أماميّة فيه كان سيوجب على مدير
الاستقبال صلاحيةً محاسبية ليفعّل وحدةً ليست محاسبية. هذا هو حلّ CRM-P0 نفسه، وهو ما
تفعله كل وحدة غير محاسبية في المستودع (ثمانية جداول \`Clinic*Settings\`).`,
        },
      ),
    ),
    loyaltyPrograms: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          name: t.String(),
          earnRate: t.Number({
            description: `نقاط تُمنح لكل وحدة عملة من الإنفاق المؤهِّل — الكسور طبيعية هنا (§3)`,
          }),
          redemptionRate: t.Number({
            description: `قيمة النقطة الواحدة بالعملة عند الاستبدال (§3)`,
          }),
          minRedemptionPoints: t.Integer({
            description: `الحدّ الأدنى الذي يُرفض الاستبدال دونه (BR-L6.2)`,
          }),
          maxRedemptionPercent: t.Number({
            description: `سقف ما يجوز أن تدفعه النقاط من فاتورةٍ واحدة، نسبةً مئوية (BR-L6.2)`,
          }),
          pointsValidityMonths: t.Integer({
            description: `أشهر صلاحية النقاط المكتسبة (§7، BR-L7.1)`,
          }),
          membershipMultiplier: t.Number({
            description: `مضاعِفٌ يُطبَّق حين يحمل المالك عضويةً فعّالة وقت الدفع (BR-L5.4) — قراءةٌ لا اقتران`,
          }),
          roundingMode: t.Union([t.Literal("FLOOR")], {
            additionalProperties: false,
            description: `[LY-P0] §5.5/BR-L5.5 — معالجة كسور النقاط.
**عضوٌ واحد عمدًا.** §3 يُدرج \`roundingMode\` حقلًا، وBR-L5.5 يقرّر أنّه **ثابت لا
قابل للضبط** في v1 («عبءُ دعمٍ بلا قيمة تجارية»). عمودٌ باتحادٍ مفتوح كان سيَعِد
بخيارٍ يرفض المنتج تقديمه؛ واتحادٌ بعضوٍ واحد يجعل «ثابت في v1» **ضمانة قاعدة
بيانات** لا عُرفًا تتذكّره الشيفرة — وهي نفس حجّة CRM §17.2 صفّ ٥ حين قُسِم اتحادٌ
واحد إلى اثنين ليصير الشرط المُقوَّس ضمانةً. إضافة عضوٍ ثانٍ لاحقًا هجرةٌ واعية.`,
          }),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[LY-P0] §3 — برنامج النقاط.
BR-L3.1: **برنامجٌ فعّالٌ واحد لكل عيادة.** لا يُفرض بقيدٍ جزئي في المخطط لأنّ
Prisma لا يُعبّر عن \`WHERE\`ات الفهارس الجزئية؛ يُفرض في الخدمة برفضٍ عربيّ، ويُختبر.
BR-L3.2: البرنامج **مصدرُ لقطةٍ لا سلطةٌ حيّة** — كل صفّ كسبٍ واستبدالٍ سيخزّن
المعدّلات التي استعملها (LY-P1/P2)، فتعديل البرنامج لا يمسّ نقاطًا مُنحت ولا خصومًا
أُعطيت. نفس انضباط لقطات مزايا العضوية وتغطية التأمين.`,
        },
      ),
      { additionalProperties: false },
    ),
    loyaltyTiers: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          programId: t.String(),
          name: t.String(),
          minSpend: t.Number({
            description: `إنفاق النافذة المتدحرجة الذي يؤهّل لهذا المستوى (BR-L4.1)`,
          }),
          earnMultiplier: t.Number({
            description: `مضاعِف الكسب — سلطة المستوى الوحيدة (BR-L4.2)`,
          }),
          order: t.Integer(),
          colorToken: t.String(),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[LY-P0] §4 — مستوى داخل برنامج.
BR-L4.1: المستوى **مشتقّ لا مُسنَد** — لا عمود مستوى على المالك ولا زرّ «اجعله ذهبيًا».
وهذا الجدول يحمل تعريف المستوى وحده؛ الاشتقاق يصل في LY-P3.
BR-L4.2: سلطته الوحيدة \`earnMultiplier\` — لا خصومات ولا خدمات مجانية ولا أولوية.
\`order\` لا «position» (سابقة CRM §17.2 صفّ ١)، و\`colorToken\` **مفتاح رمز تصميم** من
قائمةٍ مغلقة لا قيمة hex (سابقة CRM §17.2 صفّ ٢: لا لون واجهة مخزَّن في قاعدة
البيانات في المستودع كلّه، وقاعدة CLAUDE.md الأولى تمنع الألوان الصريحة).`,
        },
      ),
      { additionalProperties: false },
    ),
    loyaltyLedger: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          ownerId: t.String(),
          programId: t.String({
            description: `لقطةُ مرجع: البرنامج الذي حكم هذه الحركة. \`Restrict\` — لا يُحذف برنامجٌ له حركات
(BR-L3.3)، والحذف الناعم هو الطريق.`,
          }),
          kind: t.Union(
            [
              t.Literal("EARN"),
              t.Literal("REDEEM"),
              t.Literal("EXPIRY"),
              t.Literal("REVERSAL"),
              t.Literal("REDEMPTION_RESTORE"),
              t.Literal("ADJUSTMENT"),
            ],
            {
              additionalProperties: false,
              description: `[LY-P1] §9 — نوع حركة النقاط.`,
            },
          ),
          points: t.Integer({
            description: `**موقَّعة**: الكسب موجب، والاستبدال والانتهاء والعكس سالبة. الرصيد مجموعها.`,
          }),
          pointsConsumed: t.Integer({
            description: `على صفوف الكسب وحدها: كم استُهلك منها (FIFO، §6.4). يبدأ صفرًا ولا يتجاوز \`points\`.`,
          }),
          earnRateSnapshot: __nullable__(
            t.Number({
              description: `BR-L3.2 — المعدّلات كما كانت لحظة الحركة، لا كما هي اليوم. تعديل البرنامج لا يمسّ
نقاطًا مُنحت ولا خصومًا أُعطيت — نفس انضباط لقطات مزايا العضوية وتغطية التأمين.`,
            }),
          ),
          redemptionRateSnapshot: __nullable__(t.Number()),
          multiplierSnapshot: __nullable__(
            t.Number({
              description: `المضاعِف الفعليّ المطبَّق (المستوى × العضوية) — يُفسّر الرقم بعد أشهر`,
            }),
          ),
          earnBaseAmount: __nullable__(
            t.Number({
              description: `الأساس الذي حُسب عليه الكسب: صافي المالك قبل الضريبة (BR-L5.2)`,
            }),
          ),
          sourceType: t.Union(
            [
              t.Literal("CLINIC_INVOICE"),
              t.Literal("POS_SALE"),
              t.Literal("MANUAL"),
            ],
            {
              additionalProperties: false,
              description: `[LY-P1] §9 — مصدر الحركة.`,
            },
          ),
          sourceId: t.String({
            description: `معرّف المستند المصدر — أو \`cuid()\` مستقلّ لصفوف التسوية اليدوية`,
          }),
          earnedAt: t.Date(),
          expiresAt: __nullable__(
            t.Date({
              description: `على صفوف الكسب وحدها: \`earnedAt + program.pointsValidityMonths\` (BR-L7.1)`,
            }),
          ),
          note: __nullable__(
            t.String({
              description: `إلزاميّ على التسوية اليدوية (BR-L9.2) — منحةٌ بلا سبب لا تُراجَع`,
            }),
          ),
          createdByUserId: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[LY-P1] §9.1 — دفتر النقاط.
**لا عمود رصيد في أيّ مكان (BR-L9.1).** الرصيد مجموع الصفوف، تمامًا كما يُشتقّ مستحقّ
الطرف من \`payment_ledger_entry\`. عمودُ رصيدٍ مخزَّن مصدرُ حقيقةٍ ثانٍ، ولهذا المستودع
قراراتٌ مكتوبة ضدّه بعينه.
**والدفتر يُضاف إليه فقط (BR-L9.3):** لا صفّ يُعدَّل ولا يُحذف؛ التصحيح صفٌّ جديد.
الاستثناء الوحيد \`pointsConsumed\` على صفوف الكسب — وهو ليس تعديلًا للواقعة بل عدّاد
استهلاكٍ يخصّ ترتيب FIFO في §6.4، ويُكتب بتحديثٍ شرطيّ ذرّي كما تفعل استحقاقات
العضوية (\`membership-pricing.service.ts\`).`,
        },
      ),
      { additionalProperties: false },
    ),
    loyaltyRedemptions: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          ownerId: t.String(),
          programId: t.String(),
          sourceType: t.Union(
            [
              t.Literal("CLINIC_INVOICE"),
              t.Literal("POS_SALE"),
              t.Literal("MANUAL"),
            ],
            {
              additionalProperties: false,
              description: `[LY-P1] §9 — مصدر الحركة.`,
            },
          ),
          sourceId: t.String(),
          points: t.Integer({
            description: `النقاط المطلوب استبدالها — موجبة دائمًا؛ الإشارة تُوضَع على صفّ الدفتر لا هنا`,
          }),
          discountAmount: t.Number({
            description: `الخصم الناتج قبل الضريبة (BR-M6.4 خطوة ٤) — بعد سقف \`maxRedemptionPercent\``,
          }),
          redemptionRateSnapshot: t.Number({
            description: `BR-L3.2 — معدّل الاستبدال لحظة التسعير، لا كما صار بعدها`,
          }),
          consumedAt: __nullable__(
            t.Date({
              description: `\`null\` = نيّةٌ لم تقع. تُملأ داخل معاملة الدفع وحدها (BR-L6.3 خطوة ٢).`,
            }),
          ),
          createdByUserId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[LY-P2] **نيّة استبدال** على مستند واحد (BR-L6.3). صفٌّ واحد لكل مستند: يُكتب عند
التسعير ولا يستهلك شيئًا، ويُلتزم داخل معاملة الدفع فيكتب صفّ REDEEM في الدفتر.
لماذا جدولٌ مستقلّ لا صفّ REDEEM مباشرةً: الدفتر إلحاقيّ ونهائيّ (BR-L9.3) — صفٌّ فيه
يعني «وقع». والنيّة قد لا تقع أبدًا: فاتورة تُسعَّر ثم تُهجَر، أو تُعاد تسعيرها بنقاط
أقلّ. كتابةُ النيّة في الدفتر كانت ستجعل رصيدًا معلّقًا على مستندات لم تُدفع.`,
        },
      ),
      { additionalProperties: false },
    ),
    loyaltyOwnerTiers: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          ownerId: t.String(),
          programId: t.String(),
          tierId: __nullable__(
            t.String({
              description: `\`null\` = لا مستوى مؤهَّل بعد (BR-L4.4: برنامجٌ بلا مستويات شرعيّ)`,
            }),
          ),
          qualifyingSpend: t.Number({
            description: `إنفاق النافذة المتدحرجة وقت الحساب — يُفسّر «لماذا هذا المستوى» بلا إعادة اشتقاق`,
          }),
          windowMonths: t.Integer(),
          computedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[LY-P3] **لقطة** مستوى المالك — كاشٌ تكتبه المهمّة اليومية، لا مصدرَ حقيقة.
BR-L4.1 يقول إنّ المستوى **مشتقّ لا مُسنَد**، وهذا الجدول لا ينقض ذلك: كلّ قراءة
تخصّ مالكًا بعينه تشتقّ المستوى من الدفتر عند القراءة، ولا تسأل هذا الصفّ قطّ. وجوده
لغرضٍ واحد لا تستطيع القراءة تقديمه: التصفية والتجميع عبر آلاف المُلّاك في تقارير
§11 بلا استعلامٍ لكلّ مالك — نفس الدور الذي يؤدّيه \`slaStatus\` في CRM-P5 و\`nextDueAt\`
في التنويم.
ولا عمود «اجعل هذا المالك ذهبيًا»: لا \`tierId\` يُكتب بيد، ولا مسار يكتبه إلّا إعادةُ
الحساب. صفٌّ متقادم يعني كاشًا متأخّرًا، لا مالكًا في مستوى خاطئ.`,
        },
      ),
      { additionalProperties: false },
    ),
    crmLeads: t.Array(
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
    crmStatusChangeLogs: t.Array(
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
    crmNotes: t.Array(
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
    crmTasks: t.Array(
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
    crmComments: t.Array(
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
    crmDeals: t.Array(
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
    crmDealProducts: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          dealId: t.String(),
          itemType: t.Union(
            [
              t.Literal("SERVICE"),
              t.Literal("MEMBERSHIP_PLAN"),
              t.Literal("FREE_TEXT"),
            ],
            {
              additionalProperties: false,
              description: `[CRM-P2] §6.1 — نوع سطر المنتج في الصفقة.`,
            },
          ),
          itemId: __nullable__(
            t.String({
              description: `مُعرّف الخدمة أو باقة العضوية حسب النوع؛ فارغ لسطر النصّ الحرّ`,
            }),
          ),
          label: t.String(),
          qty: t.Number(),
          unitPrice: t.Number(),
          lineTotal: t.Number(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[CRM-P2] §6.1 — سطور عرض السعر. أسعارٌ **تقديرية** (BR-C6.2): لا نداء لمَعبر التسعير،
ولا ضريبة، ولا محرّك منافع (§0.4). \`label\` لقطةٌ لأن الخدمة قد يتغيّر اسمها لاحقًا.`,
        },
      ),
      { additionalProperties: false },
    ),
    sales: t.Array(
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
    warehouses: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          branchId: __nullable__(t.String()),
          name: t.String(),
          isDefault: t.Boolean(),
          isMobile: t.Boolean(),
          active: t.Boolean(),
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
    stockBins: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          itemId: t.String(),
          warehouseId: t.String(),
          qty: t.Integer(),
          updatedAt: t.Date(),
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
    stockBatches: t.Array(
      t.Object(
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
      { additionalProperties: false },
    ),
    onboardingProfile: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          specialtyType: __nullable__(
            t.Union(
              [
                t.Literal("VET_CLINIC"),
                t.Literal("VET_HOSPITAL"),
                t.Literal("GROOMING_CENTER"),
                t.Literal("MOBILE_SERVICES"),
                t.Literal("SPECIALIZED_SURGERY"),
                t.Literal("MULTI_SERVICES"),
              ],
              { additionalProperties: false },
            ),
          ),
          mainGoal: __nullable__(
            t.Union(
              [
                t.Literal("APPOINTMENTS_MANAGEMENT"),
                t.Literal("PATIENTS_MANAGEMENT"),
                t.Literal("INVENTORY_MANAGEMENT"),
                t.Literal("BILLING_MANAGEMENT"),
                t.Literal("REVENUE_IMPROVEMENT"),
                t.Literal("WORKFLOW_AUTOMATION"),
                t.Literal("PAPERWORK_REDUCTION"),
                t.Literal("CUSTOMER_EXPERIENCE"),
              ],
              { additionalProperties: false },
            ),
          ),
          clinicSize: __nullable__(
            t.Union(
              [
                t.Literal("SOLO"),
                t.Literal("SMALL"),
                t.Literal("MEDIUM"),
                t.Literal("MEDICAL_CENTER"),
                t.Literal("HOSPITAL"),
              ],
              { additionalProperties: false },
            ),
          ),
          animalTypes: t.Array(t.String(), { additionalProperties: false }),
          monthlyVisits: __nullable__(
            t.Union(
              [
                t.Literal("UNDER_50"),
                t.Literal("RANGE_50_100"),
                t.Literal("RANGE_101_250"),
                t.Literal("OVER_1000"),
              ],
              { additionalProperties: false },
            ),
          ),
          monthlyPatients: __nullable__(
            t.Union(
              [
                t.Literal("UNDER_50"),
                t.Literal("RANGE_50_100"),
                t.Literal("RANGE_101_250"),
                t.Literal("OVER_1000"),
              ],
              { additionalProperties: false },
            ),
          ),
          multiBranch: __nullable__(t.Boolean()),
          serviceDelivery: __nullable__(
            t.Union(
              [
                t.Literal("IN_CLINIC"),
                t.Literal("REMOTE"),
                t.Literal("MOBILE_CLINIC"),
                t.Literal("ALL"),
              ],
              { additionalProperties: false },
            ),
          ),
          referralSource: __nullable__(
            t.Union(
              [
                t.Literal("FRIEND"),
                t.Literal("GOOGLE"),
                t.Literal("TWITTER"),
                t.Literal("LINKEDIN"),
                t.Literal("BLOG"),
                t.Literal("NEWSLETTER"),
                t.Literal("PODCAST"),
                t.Literal("OTHER"),
              ],
              { additionalProperties: false },
            ),
          ),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    discounts: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          couponCode: t.String(),
          name: t.String(),
          type: t.Union([t.Literal("PERCENTAGE"), t.Literal("FIXED")], {
            additionalProperties: false,
          }),
          value: t.Number(),
          validFrom: __nullable__(t.Date()),
          validTo: __nullable__(t.Date()),
          usageLimit: t.Integer(),
          perCustomerLimit: t.Integer(),
          customerType: t.Union(
            [
              t.Literal("ALL"),
              t.Literal("VIP"),
              t.Literal("LOYALTY"),
              t.Literal("NEW"),
              t.Literal("CURRENT"),
            ],
            { additionalProperties: false },
          ),
          usedCount: t.Integer(),
          status: t.Union(
            [
              t.Literal("ACTIVE"),
              t.Literal("INACTIVE"),
              t.Literal("EXPIRED"),
              t.Literal("SCHEDULED"),
            ],
            { additionalProperties: false },
          ),
          notes: __nullable__(t.String()),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    carePlans: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          name: t.String(),
          serviceId: t.String(),
          animalTypeId: t.String(),
          animalStrainId: t.String(),
          notes: __nullable__(t.String()),
          visitDurationMins: __nullable__(t.Integer()),
          price: t.Number(),
          durationDays: t.Integer(),
          status: t.Union([t.Literal("ACTIVE"), t.Literal("INACTIVE")], {
            additionalProperties: false,
          }),
          usageCount: t.Integer(),
          subscribersCount: t.Integer(),
          ratingSum: t.Integer(),
          ratingCount: t.Integer(),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    carePlanEnrollments: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          carePlanId: t.String(),
          patientId: t.String(),
          priceSnapshot: t.Number(),
          status: t.Union(
            [
              t.Literal("ACTIVE"),
              t.Literal("COMPLETED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          startedAt: t.Date(),
          completedAt: __nullable__(t.Date()),
          notes: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    membershipPlans: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          name: t.String(),
          description: __nullable__(t.String()),
          tierRank: t.Integer(),
          billingInterval: t.Union(
            [
              t.Literal("DAY"),
              t.Literal("WEEK"),
              t.Literal("MONTH"),
              t.Literal("YEAR"),
            ],
            { additionalProperties: false },
          ),
          intervalCount: t.Integer(),
          fee: t.Number(),
          enrollmentFee: t.Number(),
          deferRevenue: t.Boolean(),
          maxPatients: __nullable__(t.Integer()),
          autoRenew: t.Boolean(),
          graceDays: t.Integer(),
          status: t.Union([t.Literal("ACTIVE"), t.Literal("INACTIVE")], {
            additionalProperties: false,
          }),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `خطة العضوية — FR-M4.1. billingInterval يعيد استخدام SubscriptionInterval قصدًا
(لا union نصي — قاعدة الأنواع)، ويُقصَر على MONTH|YEAR في طبقتي الموديل والخدمة.`,
        },
      ),
      { additionalProperties: false },
    ),
    memberships: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          ownerId: t.String(),
          planId: t.String(),
          subscriptionId: t.String({
            description: `الاشتراك المحاسبي الحامل للفوترة (MI-C2) — واحد لواحد`,
          }),
          status: t.Union(
            [
              t.Literal("PENDING_PAYMENT"),
              t.Literal("ACTIVE"),
              t.Literal("PAST_DUE"),
              t.Literal("LAPSED"),
              t.Literal("CANCELLED"),
              t.Literal("EXPIRED"),
            ],
            {
              additionalProperties: false,
              description: `§5.2 — CANCELLED وEXPIRED نهائيتان دومًا؛ LAPSED نهائية بعد انقضاء فترتها فقط
(قرار المالك MI-P1 س5: داخل الفترة تبقى غير نهائية لأنها قابلة للإحياء بالدفع).`,
            },
          ),
          currentPeriodStart: t.Date(),
          currentPeriodEnd: t.Date(),
          feeSnapshot: t.Number(),
          intervalSnapshot: t.Union(
            [
              t.Literal("DAY"),
              t.Literal("WEEK"),
              t.Literal("MONTH"),
              t.Literal("YEAR"),
            ],
            { additionalProperties: false },
          ),
          intervalCountSnapshot: t.Integer(),
          graceDaysSnapshot: t.Integer(),
          autoRenewSnapshot: t.Boolean(),
          scheduledPlanId: __nullable__(
            t.String({
              description: `BR-M5.4.2: تبديل الخطة المجدول — يُطبَّق عند التدوير التالي ثم يُصفَّر`,
            }),
          ),
          cancelledAt: __nullable__(t.Date()),
          cancelReason: __nullable__(t.String()),
          cancelledByUserId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `عضوية مالك — FR-M5.1. اللقطات (AR-M2) تجمّد شروط الخطة وقت التسجيل؛ تعديل الخطة
لا يمسّها إلا عند تدوير الفترة (BR-M5.4.1). تفرُّد BR-M5.1.1 (عضوية واحدة غير
نهائية لكل مالك) يُفرَض في معاملة التسجيل التسلسلية — فهرس جزئي شرطي لا يُعبَّر
عنه في برزما ولا يمرّ من فحص انجراف الهجرات (قاعدة 8).`,
        },
      ),
      { additionalProperties: false },
    ),
    invoiceMembershipAdjustments: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          invoiceId: t.String(),
          idx: t.Integer(),
          lineRef: t.String(),
          benefitType: t.Union(
            [
              t.Literal("SERVICE_DISCOUNT"),
              t.Literal("PRODUCT_DISCOUNT"),
              t.Literal("INCLUDED_UNITS"),
              t.Literal("PRIORITY_BOOKING"),
              t.Literal("PERK"),
            ],
            { additionalProperties: false },
          ),
          membershipId: t.String(),
          benefitId: t.String(),
          serviceId: __nullable__(t.String()),
          amount: t.Number(),
          unitsConsumed: t.Integer(),
          entitlementId: __nullable__(t.String()),
          periodStart: __nullable__(t.Date()),
          periodEnd: __nullable__(t.Date()),
          consumedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[MI-P2] BR-M6.7 — أثر تسوية العضوية على فاتورة العيادة: صف لكل تخفيض طُبّق على سطر،
بمرجع لقطة الميزة والفترة. المراجع النصية (membershipId/benefitId/entitlementId) بلا
FK عمدًا — سابقة sourceBenefitId: الأثر التدقيقي لا يجوز أن يُجرّ بحذف مصدره.
unitsConsumed هي «نية» الاستهلاك (BR-M5.3.1) — تُلتزم عند PAID بختم consumedAt.`,
        },
      ),
      { additionalProperties: false },
    ),
    saleMembershipAdjustments: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          saleId: t.String(),
          idx: t.Integer(),
          lineRef: t.String(),
          benefitType: t.Union(
            [
              t.Literal("SERVICE_DISCOUNT"),
              t.Literal("PRODUCT_DISCOUNT"),
              t.Literal("INCLUDED_UNITS"),
              t.Literal("PRIORITY_BOOKING"),
              t.Literal("PERK"),
            ],
            { additionalProperties: false },
          ),
          membershipId: t.String(),
          benefitId: t.String(),
          amount: t.Number(),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[MI-P2] نظيرتها لبيع نقطة البيع — خصومات منتجات فقط (لا استهلاك وحدات: الوحدات
المشمولة خدماتٌ ولا تظهر في السلة).`,
        },
      ),
      { additionalProperties: false },
    ),
    expenses: t.Array(
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
    courses: t.Array(
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
    courseAssignments: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          courseId: t.String(),
          staffId: t.String(),
          cycle: t.Integer(),
          source: t.Union(
            [t.Literal("MANUAL"), t.Literal("AUTO"), t.Literal("ENROLL_ALL")],
            { additionalProperties: false },
          ),
          status: t.Union(
            [
              t.Literal("ASSIGNED"),
              t.Literal("IN_PROGRESS"),
              t.Literal("COMPLETED"),
            ],
            { additionalProperties: false },
          ),
          progress: t.Integer(),
          assignedAt: t.Date(),
          startedAt: __nullable__(t.Date()),
          completedAt: __nullable__(t.Date()),
          startDate: __nullable__(t.Date()),
          dueDate: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    courseAutoAssignRules: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          courseId: t.String(),
          entityType: t.Union(
            [
              t.Literal("BRANCH"),
              t.Literal("ROLE"),
              t.Literal("SPECIALIZATION"),
            ],
            { additionalProperties: false },
          ),
          entityId: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    courseCertificates: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          courseId: t.String(),
          staffId: t.String(),
          assignmentId: t.String(),
          referenceNumber: t.String(),
          issuedAt: t.Date(),
          validUntil: __nullable__(t.Date()),
          signatureName: __nullable__(t.String()),
          passMark: __nullable__(t.Integer()),
          pdfKey: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    courseReviews: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          courseId: t.String(),
          staffId: t.String(),
          assignmentId: t.String(),
          rating: t.Integer(),
          comment: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    labTestParameters: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          serviceId: t.String(),
          section: __nullable__(t.String()),
          name: t.String(),
          unit: __nullable__(t.String()),
          type: t.Union([t.Literal("NUMERIC"), t.Literal("TEXT")], {
            additionalProperties: false,
          }),
          refLow: __nullable__(t.Number()),
          refHigh: __nullable__(t.Number()),
          order: t.Integer(),
          active: t.Boolean(),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    labTestOrders: t.Array(
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
    quizzes: t.Array(
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
    quizAssignments: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          quizId: t.String(),
          staffId: t.String(),
          cycle: t.Integer(),
          source: t.Union(
            [t.Literal("MANUAL"), t.Literal("AUTO"), t.Literal("ENROLL_ALL")],
            { additionalProperties: false },
          ),
          status: t.Union(
            [
              t.Literal("ASSIGNED"),
              t.Literal("IN_PROGRESS"),
              t.Literal("COMPLETED"),
            ],
            { additionalProperties: false },
          ),
          assignedAt: t.Date(),
          startDate: __nullable__(t.Date()),
          dueDate: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    accountingSettings: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          defaultCurrencyCode: __nullable__(t.String()),
          defaultReceivableAccountId: __nullable__(t.String()),
          defaultPayableAccountId: __nullable__(t.String()),
          defaultIncomeAccountId: __nullable__(t.String()),
          defaultExpenseAccountId: __nullable__(t.String()),
          defaultCashAccountId: __nullable__(t.String()),
          defaultBankAccountId: __nullable__(t.String()),
          roundOffAccountId: __nullable__(t.String()),
          roundOffForOpeningAccountId: __nullable__(t.String()),
          writeOffAccountId: __nullable__(t.String()),
          exchangeGainLossAccountId: __nullable__(t.String()),
          unrealizedExchangeGainLossAccountId: __nullable__(t.String()),
          unrealizedProfitLossAccountId: __nullable__(t.String()),
          defaultDiscountAccountId: __nullable__(t.String()),
          defaultDeferredRevenueAccountId: __nullable__(t.String()),
          defaultDeferredExpenseAccountId: __nullable__(t.String()),
          defaultAdvanceReceivedAccountId: __nullable__(t.String()),
          defaultAdvancePaidAccountId: __nullable__(t.String()),
          roundOffCostCenterId: __nullable__(t.String()),
          defaultCostCenterId: __nullable__(t.String()),
          defaultFinanceBookId: __nullable__(t.String()),
          defaultPaymentTermsTemplateId: __nullable__(t.String()),
          creditLimit: __nullable__(t.Number()),
          bypassCreditLimitCheck: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    accountsSettings: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          key: t.String(),
          value: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    accountingJobs: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          jobType: t.String(),
          status: t.Union(
            [
              t.Literal("QUEUED"),
              t.Literal("IN_PROGRESS"),
              t.Literal("COMPLETED"),
              t.Literal("FAILED"),
            ],
            { additionalProperties: false },
          ),
          idempotencyKey: t.String(),
          payload: __nullable__(t.Any()),
          voucherType: __nullable__(t.String()),
          voucherId: __nullable__(t.String()),
          attempts: t.Integer(),
          errorMessage: __nullable__(t.String()),
          startedAt: __nullable__(t.Date()),
          finishedAt: __nullable__(t.Date()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    namingSeries: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          doctype: t.String(),
          prefix: t.String(),
          year: t.Integer(),
          counter: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    voucherDemos: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          documentNo: __nullable__(t.String()),
          docstatus: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          postingDate: t.Date(),
          amendedFromId: __nullable__(t.String()),
          title: t.String(),
          amount: t.Number(),
          dim1: __nullable__(t.String()),
          dim2: __nullable__(t.String()),
          dim3: __nullable__(t.String()),
          dim4: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          submittedAt: __nullable__(t.Date()),
          submittedById: __nullable__(t.String()),
          cancelledAt: __nullable__(t.Date()),
          cancelledById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    ledgerAccounts: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          accountName: t.String(),
          accountNumber: __nullable__(t.String()),
          parentAccountId: __nullable__(t.String()),
          isGroup: t.Boolean(),
          rootType: t.Union(
            [
              t.Literal("ASSET"),
              t.Literal("LIABILITY"),
              t.Literal("INCOME"),
              t.Literal("EXPENSE"),
              t.Literal("EQUITY"),
            ],
            { additionalProperties: false },
          ),
          reportType: t.Union(
            [t.Literal("BALANCE_SHEET"), t.Literal("PROFIT_AND_LOSS")],
            { additionalProperties: false },
          ),
          accountType: __nullable__(
            t.Union(
              [
                t.Literal("BANK"),
                t.Literal("CASH"),
                t.Literal("RECEIVABLE"),
                t.Literal("PAYABLE"),
                t.Literal("TAX"),
                t.Literal("STOCK"),
                t.Literal("FIXED_ASSET"),
                t.Literal("ACCUMULATED_DEPRECIATION"),
                t.Literal("DEPRECIATION"),
                t.Literal("EXPENSE_ACCOUNT"),
                t.Literal("INCOME_ACCOUNT"),
                t.Literal("CHARGEABLE"),
                t.Literal("ROUND_OFF"),
                t.Literal("ROUND_OFF_FOR_OPENING"),
                t.Literal("TEMPORARY"),
                t.Literal("EQUITY"),
                t.Literal("DIRECT_INCOME"),
                t.Literal("INDIRECT_INCOME"),
                t.Literal("DIRECT_EXPENSE"),
                t.Literal("INDIRECT_EXPENSE"),
                t.Literal("COST_OF_GOODS_SOLD"),
                t.Literal("CURRENT_ASSET"),
                t.Literal("CURRENT_LIABILITY"),
                t.Literal("CAPITAL_WORK_IN_PROGRESS"),
                t.Literal("ASSET_RECEIVED_BUT_NOT_BILLED"),
                t.Literal("STOCK_RECEIVED_BUT_NOT_BILLED"),
                t.Literal("SERVICE_RECEIVED_BUT_NOT_BILLED"),
                t.Literal("STOCK_ADJUSTMENT"),
              ],
              { additionalProperties: false },
            ),
          ),
          accountCurrencyCode: t.String(),
          taxRate: __nullable__(t.Number()),
          balanceMustBe: t.Union(
            [t.Literal("NONE"), t.Literal("DEBIT"), t.Literal("CREDIT")],
            { additionalProperties: false },
          ),
          freezeAccount: t.Boolean(),
          disabled: t.Boolean(),
          lft: t.Integer(),
          rgt: t.Integer(),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    fiscalYears: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          year: t.String(),
          yearStartDate: t.Date(),
          yearEndDate: t.Date(),
          isShortYear: t.Boolean(),
          disabled: t.Boolean(),
          autoCreated: t.Boolean(),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    accountingPeriods: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          periodName: t.String(),
          startDate: t.Date(),
          endDate: t.Date(),
          docstatus: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          amendedFromId: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          submittedAt: __nullable__(t.Date()),
          submittedById: __nullable__(t.String()),
          cancelledAt: __nullable__(t.Date()),
          cancelledById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    periodClosingVouchers: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          documentNo: __nullable__(t.String()),
          docstatus: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          postingDate: t.Date(),
          amendedFromId: __nullable__(t.String()),
          fiscalYear: t.String(),
          periodStartDate: t.Date(),
          periodEndDate: t.Date(),
          closingAccountHeadId: t.String(),
          remarks: __nullable__(t.String()),
          granularByDimensions: t.Boolean(),
          gleProcessingStatus: t.Union(
            [
              t.Literal("QUEUED"),
              t.Literal("IN_PROGRESS"),
              t.Literal("COMPLETED"),
              t.Literal("FAILED"),
            ],
            { additionalProperties: false },
          ),
          errorMessage: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          submittedAt: __nullable__(t.Date()),
          submittedById: __nullable__(t.String()),
          cancelledAt: __nullable__(t.Date()),
          cancelledById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    budgets: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          docstatus: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          amendedFromId: __nullable__(t.String()),
          fiscalYear: t.String(),
          budgetAgainst: t.Union(
            [t.Literal("COST_CENTER"), t.Literal("PROJECT")],
            { additionalProperties: false },
          ),
          costCenterId: __nullable__(t.String()),
          project: __nullable__(t.String()),
          monthlyDistributionId: __nullable__(t.String()),
          applicableOnBookingActualExpenses: t.Boolean(),
          actionIfAnnualExceeded: t.Union(
            [t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")],
            { additionalProperties: false },
          ),
          actionIfAccumulatedMonthlyExceeded: t.Union(
            [t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")],
            { additionalProperties: false },
          ),
          applicableOnMaterialRequest: t.Boolean(),
          actionIfAnnualExceededOnMr: t.Union(
            [t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")],
            { additionalProperties: false },
          ),
          actionIfAccumulatedMonthlyExceededOnMr: t.Union(
            [t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")],
            { additionalProperties: false },
          ),
          applicableOnPurchaseOrder: t.Boolean(),
          actionIfAnnualExceededOnPo: t.Union(
            [t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")],
            { additionalProperties: false },
          ),
          actionIfAccumulatedMonthlyExceededOnPo: t.Union(
            [t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")],
            { additionalProperties: false },
          ),
          createdById: __nullable__(t.String()),
          submittedAt: __nullable__(t.Date()),
          submittedById: __nullable__(t.String()),
          cancelledAt: __nullable__(t.Date()),
          cancelledById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    accountingDimensionFilters: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          dimensionId: t.String(),
          allowOnly: t.Boolean(),
          disabled: t.Boolean(),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    banks: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          bankName: t.String(),
          swiftNumber: __nullable__(t.String()),
          website: __nullable__(t.String()),
          disabled: t.Boolean(),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    bankAccounts: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          bankId: t.String(),
          accountName: t.String(),
          isCompanyAccount: t.Boolean(),
          glAccountId: __nullable__(t.String()),
          accountType: __nullable__(t.String()),
          accountSubtype: __nullable__(t.String()),
          iban: __nullable__(t.String()),
          branchCode: __nullable__(t.String()),
          bankAccountNo: __nullable__(t.String()),
          partyType: __nullable__(t.String()),
          partyId: __nullable__(t.String()),
          integrationId: __nullable__(t.String()),
          disabled: t.Boolean(),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    bankTransactions: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          documentNo: __nullable__(t.String()),
          docstatus: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          postingDate: t.Date(),
          amendedFromId: __nullable__(t.String()),
          bankAccountId: t.String(),
          deposit: t.Number(),
          withdrawal: t.Number(),
          currencyCode: t.String(),
          description: __nullable__(t.String()),
          referenceNumber: __nullable__(t.String()),
          transactionId: __nullable__(t.String()),
          status: t.Union(
            [
              t.Literal("PENDING"),
              t.Literal("UNRECONCILED"),
              t.Literal("RECONCILED"),
              t.Literal("SETTLED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          partyType: __nullable__(t.String()),
          partyId: __nullable__(t.String()),
          allocatedAmount: t.Number(),
          unallocatedAmount: t.Number(),
          pairedTransactionId: __nullable__(t.String()),
          importId: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          submittedAt: __nullable__(t.Date()),
          submittedById: __nullable__(t.String()),
          cancelledAt: __nullable__(t.Date()),
          cancelledById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    bankImportMappings: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          bankId: __nullable__(t.String()),
          templateName: t.String(),
          config: t.Any(),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    bankStatementImports: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          bankAccountId: t.String(),
          mappingId: __nullable__(t.String()),
          fileName: t.String(),
          totalRows: t.Integer(),
          importedRows: t.Integer(),
          duplicateRows: t.Integer(),
          errorRows: t.Integer(),
          errors: __nullable__(t.Any()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    bankTransactionRules: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          ruleName: t.String(),
          priority: t.Integer(),
          disabled: t.Boolean(),
          descriptionContains: __nullable__(t.String()),
          direction: t.Union(
            [t.Literal("ANY"), t.Literal("DEPOSIT"), t.Literal("WITHDRAWAL")],
            { additionalProperties: false },
          ),
          minAmount: __nullable__(t.Number()),
          maxAmount: __nullable__(t.Number()),
          bankAccountId: __nullable__(t.String()),
          contraAccountId: t.String(),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    adapterPostings: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          adapterKey: t.String(),
          sourceId: t.String(),
          sourceCode: t.String(),
          postingDate: t.Date(),
          amount: t.Number(),
          valueAccountIds: t.Array(t.String(), { additionalProperties: false }),
          postedAt: t.Date(),
          reversedAt: __nullable__(t.Date()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    monthlyDistributions: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          distributionName: t.String(),
          fiscalYear: t.String(),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    accountClosingBalances: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          periodClosingVoucherId: t.String(),
          closingDate: t.Date(),
          accountId: t.String(),
          partyType: __nullable__(t.String()),
          partyId: __nullable__(t.String()),
          costCenterId: __nullable__(t.String()),
          dim1: __nullable__(t.String()),
          dim2: __nullable__(t.String()),
          dim3: __nullable__(t.String()),
          dim4: __nullable__(t.String()),
          debit: t.Number(),
          credit: t.Number(),
          debitInAccountCurrency: t.Number(),
          creditInAccountCurrency: t.Number(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    costCenters: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          costCenterName: t.String(),
          costCenterNumber: __nullable__(t.String()),
          parentCostCenterId: __nullable__(t.String()),
          isGroup: t.Boolean(),
          disabled: t.Boolean(),
          lft: t.Integer(),
          rgt: t.Integer(),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    costCenterAllocations: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          documentNo: __nullable__(t.String()),
          docstatus: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          amendedFromId: __nullable__(t.String()),
          mainCostCenterId: t.String(),
          validFrom: t.Date(),
          createdById: __nullable__(t.String()),
          submittedAt: __nullable__(t.Date()),
          submittedById: __nullable__(t.String()),
          cancelledAt: __nullable__(t.Date()),
          cancelledById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    modesOfPayment: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          modeOfPaymentName: t.String(),
          type: t.Union(
            [
              t.Literal("CASH"),
              t.Literal("BANK"),
              t.Literal("GENERAL"),
              t.Literal("PHONE"),
            ],
            { additionalProperties: false },
          ),
          enabled: t.Boolean(),
          defaultAccountId: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    currencyExchanges: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          date: t.Date(),
          fromCurrencyCode: t.String(),
          toCurrencyCode: t.String(),
          exchangeRate: t.Number(),
          forBuying: t.Boolean(),
          forSelling: t.Boolean(),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    exchangeRateRevaluations: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          documentNo: __nullable__(t.String()),
          docstatus: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          postingDate: t.Date(),
          amendedFromId: __nullable__(t.String()),
          roundingLossAllowance: t.Number(),
          totalGainLoss: t.Number(),
          journalEntryId: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          submittedAt: __nullable__(t.Date()),
          submittedById: __nullable__(t.String()),
          cancelledAt: __nullable__(t.Date()),
          cancelledById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    accountingDimensions: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          slot: t.Integer(),
          dimensionName: t.String(),
          referenceDoctype: __nullable__(t.String()),
          disabled: t.Boolean(),
          mandatoryForBalanceSheet: t.Boolean(),
          mandatoryForProfitAndLoss: t.Boolean(),
          defaultDimensionValue: __nullable__(t.String()),
          autoPostBalancingEntry: t.Boolean(),
          offsettingAccountId: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    financeBooks: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          financeBookName: t.String(),
          disabled: t.Boolean(),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    glEntries: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          postingDate: t.Date(),
          transactionDate: __nullable__(t.Date()),
          fiscalYear: t.String(),
          accountId: t.String(),
          accountCurrencyCode: t.String(),
          debit: t.Number(),
          credit: t.Number(),
          debitInAccountCurrency: t.Number(),
          creditInAccountCurrency: t.Number(),
          transactionCurrencyCode: __nullable__(t.String()),
          transactionExchangeRate: __nullable__(t.Number()),
          debitInTransactionCurrency: t.Number(),
          creditInTransactionCurrency: t.Number(),
          partyType: __nullable__(t.String()),
          partyId: __nullable__(t.String()),
          against: __nullable__(t.String()),
          voucherType: t.String(),
          voucherSubtype: __nullable__(t.String()),
          voucherId: t.String(),
          voucherNo: t.String(),
          voucherDetailNo: __nullable__(t.String()),
          againstVoucherType: __nullable__(t.String()),
          againstVoucherId: __nullable__(t.String()),
          costCenterId: __nullable__(t.String()),
          projectId: __nullable__(t.String()),
          financeBookId: __nullable__(t.String()),
          dim1: __nullable__(t.String()),
          dim2: __nullable__(t.String()),
          dim3: __nullable__(t.String()),
          dim4: __nullable__(t.String()),
          isOpening: t.Boolean(),
          isAdvance: t.Boolean(),
          isCancelled: t.Boolean(),
          dueDate: __nullable__(t.Date()),
          remarks: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    journalEntries: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          documentNo: __nullable__(t.String()),
          docstatus: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          postingDate: t.Date(),
          amendedFromId: __nullable__(t.String()),
          voucherType: t.String(),
          chequeNo: __nullable__(t.String()),
          chequeDate: __nullable__(t.Date()),
          remark: __nullable__(t.String()),
          multiCurrency: t.Boolean(),
          isSystemGenerated: t.Boolean(),
          totalDebit: t.Number(),
          totalCredit: t.Number(),
          dim1: __nullable__(t.String()),
          dim2: __nullable__(t.String()),
          dim3: __nullable__(t.String()),
          dim4: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          submittedAt: __nullable__(t.Date()),
          submittedById: __nullable__(t.String()),
          cancelledAt: __nullable__(t.Date()),
          cancelledById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    journalEntryTemplates: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          templateTitle: t.String(),
          voucherType: t.String(),
          accountIds: t.Array(t.String(), { additionalProperties: false }),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    partyAccounts: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          partyType: t.String(),
          partyId: t.String(),
          accountId: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    partyCreditLimits: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          partyType: t.String(),
          partyId: t.String(),
          creditLimit: t.Number(),
          bypassCreditLimitCheck: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    partyAccountingConfigs: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          partyType: t.String(),
          partyId: t.String(),
          defaultCurrencyCode: __nullable__(t.String()),
          paymentTermsTemplateId: __nullable__(t.String()),
          isFrozen: t.Boolean(),
          disabled: t.Boolean(),
          isInternal: t.Boolean(),
          representsCompany: __nullable__(t.String()),
          taxWithholdingCategoryId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    paymentLedgerEntries: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          postingDate: t.Date(),
          dueDate: __nullable__(t.Date()),
          accountType: t.Union(
            [
              t.Literal("BANK"),
              t.Literal("CASH"),
              t.Literal("RECEIVABLE"),
              t.Literal("PAYABLE"),
              t.Literal("TAX"),
              t.Literal("STOCK"),
              t.Literal("FIXED_ASSET"),
              t.Literal("ACCUMULATED_DEPRECIATION"),
              t.Literal("DEPRECIATION"),
              t.Literal("EXPENSE_ACCOUNT"),
              t.Literal("INCOME_ACCOUNT"),
              t.Literal("CHARGEABLE"),
              t.Literal("ROUND_OFF"),
              t.Literal("ROUND_OFF_FOR_OPENING"),
              t.Literal("TEMPORARY"),
              t.Literal("EQUITY"),
              t.Literal("DIRECT_INCOME"),
              t.Literal("INDIRECT_INCOME"),
              t.Literal("DIRECT_EXPENSE"),
              t.Literal("INDIRECT_EXPENSE"),
              t.Literal("COST_OF_GOODS_SOLD"),
              t.Literal("CURRENT_ASSET"),
              t.Literal("CURRENT_LIABILITY"),
              t.Literal("CAPITAL_WORK_IN_PROGRESS"),
              t.Literal("ASSET_RECEIVED_BUT_NOT_BILLED"),
              t.Literal("STOCK_RECEIVED_BUT_NOT_BILLED"),
              t.Literal("SERVICE_RECEIVED_BUT_NOT_BILLED"),
              t.Literal("STOCK_ADJUSTMENT"),
            ],
            { additionalProperties: false },
          ),
          accountId: t.String(),
          accountCurrencyCode: t.String(),
          partyType: t.String(),
          partyId: t.String(),
          voucherType: t.String(),
          voucherId: t.String(),
          voucherNo: t.String(),
          voucherDetailNo: __nullable__(t.String()),
          againstVoucherType: t.String(),
          againstVoucherId: t.String(),
          againstVoucherNo: __nullable__(t.String()),
          amount: t.Number(),
          amountInAccountCurrency: t.Number(),
          delinked: t.Boolean(),
          costCenterId: __nullable__(t.String()),
          projectId: __nullable__(t.String()),
          financeBookId: __nullable__(t.String()),
          remarks: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    advancePaymentLedgerEntries: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          postingDate: t.Date(),
          accountId: t.String({
            description: `the advance account itself — a plain liability/asset, so it carries NO party on the GL`,
          }),
          accountCurrencyCode: t.String(),
          partyType: t.String({
            description: `the party the advance belongs to (C6) — the fact BR-4.3.3 will not let the GL row hold`,
          }),
          partyId: t.String(),
          voucherType: t.String(),
          voucherId: t.String(),
          voucherNo: t.String(),
          againstVoucherType: t.String({
            description: `self while the advance is open; the invoice once released`,
          }),
          againstVoucherId: t.String(),
          againstVoucherNo: __nullable__(t.String()),
          amount: t.Number(),
          amountInAccountCurrency: t.Number(),
          delinked: t.Boolean(),
          costCenterId: __nullable__(t.String()),
          remarks: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[P12.6] FR-11.3 — the advance sub-ledger.
WHY A SECOND LEDGER EXISTS AT ALL. When \`book_advance_payments_in_separate_party_account\`
is on, an unallocated payment lands in «دفعات مقدمة مقبوضة/مدفوعة» — a plain liability or
asset, NOT a receivable. BR-4.3.3 therefore FORBIDS a party on that GL row, and §5.2
derives the payment ledger only for RECEIVABLE/PAYABLE accounts, so the party's claim
would be invisible to every advance-aware surface. This table is where the party, the
amount and the allocation target live for exactly that case — which is the reason ERPNext
has it too.
IT IS NOT A SECOND SOURCE OF TRUTH FOR OUTSTANDING. An advance in a separate account is
not a receivable until it is released; the moment it IS released, the release entry posts
a real AR/AP leg and the PLE derives from it as usual. The two ledgers describe different
states of the same money, never the same state twice.
Sign convention mirrors §5.2: a customer advance received is NEGATIVE (the party holds a
credit), a supplier advance paid is POSITIVE. \`delinked\` follows the same discipline as
the payment ledger — rows are neutralized and re-inserted, never edited in place (AR-2).`,
        },
      ),
      { additionalProperties: false },
    ),
    paymentTerms: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          paymentTermName: t.String(),
          invoicePortion: t.Number(),
          dueDateBasedOn: t.Union(
            [
              t.Literal("DAYS_AFTER_INVOICE_DATE"),
              t.Literal("DAYS_AFTER_INVOICE_MONTH_END"),
              t.Literal("MONTHS_AFTER_INVOICE_MONTH_END"),
            ],
            { additionalProperties: false },
          ),
          creditDays: t.Integer(),
          creditMonths: t.Integer(),
          modeOfPaymentId: __nullable__(t.String()),
          discountType: t.Union(
            [t.Literal("PERCENTAGE"), t.Literal("AMOUNT")],
            { additionalProperties: false },
          ),
          discount: t.Number(),
          discountValidityBasedOn: t.Union(
            [
              t.Literal("DAYS_AFTER_INVOICE_DATE"),
              t.Literal("DAYS_AFTER_INVOICE_MONTH_END"),
              t.Literal("MONTHS_AFTER_INVOICE_MONTH_END"),
            ],
            { additionalProperties: false },
          ),
          discountValidity: t.Integer(),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    paymentTermsTemplates: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          templateName: t.String(),
          allocatePaymentBasedOnPaymentTerms: t.Boolean(),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    taxCategories: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          title: t.String(),
          disabled: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    salesTaxTemplates: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          title: t.String(),
          isDefault: t.Boolean(),
          disabled: t.Boolean(),
          taxCategoryId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    purchaseTaxTemplates: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          title: t.String(),
          isDefault: t.Boolean(),
          disabled: t.Boolean(),
          taxCategoryId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    itemTaxTemplates: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          title: t.String(),
          disabled: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    taxRules: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          taxType: t.String(),
          salesTaxTemplateId: __nullable__(t.String()),
          purchaseTaxTemplateId: __nullable__(t.String()),
          partyType: __nullable__(t.String()),
          partyId: __nullable__(t.String()),
          itemId: __nullable__(t.String()),
          itemCategory: __nullable__(t.String()),
          taxCategoryId: __nullable__(t.String()),
          fromDate: __nullable__(t.Date()),
          toDate: __nullable__(t.Date()),
          priority: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    itemWiseTaxDetails: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          voucherType: t.String(),
          voucherId: t.String(),
          itemRowId: t.String(),
          taxRowId: t.String(),
          rate: t.Number(),
          amount: t.Number(),
          taxableAmount: t.Number(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    salesInvoices: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          documentNo: __nullable__(t.String()),
          docstatus: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("UNPAID"),
              t.Literal("PAID"),
              t.Literal("PARTLY_PAID"),
              t.Literal("OVERDUE"),
              t.Literal("RETURN"),
              t.Literal("CREDIT_NOTE_ISSUED"),
              t.Literal("INTERNAL_TRANSFER"),
              t.Literal("CONSOLIDATED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          amendedFromId: __nullable__(t.String()),
          postingDate: t.Date(),
          postingTime: __nullable__(t.String()),
          setPostingTime: t.Boolean(),
          dueDate: __nullable__(t.Date()),
          partyType: t.String(),
          partyId: t.String(),
          currencyCode: t.String(),
          conversionRate: t.Number(),
          debitToId: t.String(),
          partyAccountCurrencyCode: __nullable__(t.String()),
          isReturn: t.Boolean(),
          returnAgainstId: __nullable__(t.String()),
          updateOutstandingForSelf: t.Boolean(),
          isDebitNote: t.Boolean(),
          isPos: t.Boolean(),
          updateStock: t.Boolean(),
          isOpening: t.Boolean(),
          isConsolidated: t.Boolean(),
          isInternalCustomer: t.Boolean(),
          representsCompany: __nullable__(t.String()),
          unrealizedProfitLossAccountId: __nullable__(t.String()),
          poNo: __nullable__(t.String()),
          poDate: __nullable__(t.Date()),
          taxesAndChargesTemplateId: __nullable__(t.String()),
          taxCategoryId: __nullable__(t.String()),
          applyDiscountOn: t.Union(
            [t.Literal("GRAND_TOTAL"), t.Literal("NET_TOTAL")],
            { additionalProperties: false },
          ),
          additionalDiscountPercentage: t.Number(),
          discountAmount: t.Number(),
          isCashOrNonTradeDiscount: t.Boolean(),
          additionalDiscountAccountId: __nullable__(t.String()),
          total: t.Number(),
          netTotal: t.Number(),
          totalTaxesAndCharges: t.Number(),
          grandTotal: t.Number(),
          roundingAdjustment: t.Number(),
          roundedTotal: t.Number(),
          disableRoundedTotal: t.Boolean(),
          inWords: __nullable__(t.String()),
          outstandingAmount: t.Number(),
          allocateAdvancesAutomatically: t.Boolean(),
          onlyIncludeAllocatedPayments: t.Boolean(),
          totalAdvance: t.Number(),
          writeOffAmount: t.Number(),
          writeOffAccountId: __nullable__(t.String()),
          writeOffCostCenterId: __nullable__(t.String()),
          writeOffOutstandingAmountAutomatically: t.Boolean(),
          paymentTermsTemplateId: __nullable__(t.String()),
          ignoreDefaultPaymentTermsTemplate: t.Boolean(),
          costCenterId: __nullable__(t.String()),
          projectId: __nullable__(t.String()),
          dim1: __nullable__(t.String()),
          dim2: __nullable__(t.String()),
          dim3: __nullable__(t.String()),
          dim4: __nullable__(t.String()),
          remarks: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          submittedAt: __nullable__(t.Date()),
          submittedById: __nullable__(t.String()),
          cancelledAt: __nullable__(t.Date()),
          cancelledById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    paymentSchedules: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          parentType: t.String(),
          parentId: t.String(),
          idx: t.Integer(),
          paymentTermId: __nullable__(t.String()),
          description: __nullable__(t.String()),
          dueDate: t.Date(),
          invoicePortion: t.Number(),
          paymentAmount: t.Number(),
          outstanding: t.Number(),
          discountType: __nullable__(
            t.Union([t.Literal("PERCENTAGE"), t.Literal("AMOUNT")], {
              additionalProperties: false,
            }),
          ),
          discount: t.Number(),
          discountDate: __nullable__(t.Date()),
          modeOfPaymentId: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    purchaseInvoices: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          documentNo: __nullable__(t.String()),
          docstatus: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("UNPAID"),
              t.Literal("PAID"),
              t.Literal("PARTLY_PAID"),
              t.Literal("OVERDUE"),
              t.Literal("RETURN"),
              t.Literal("DEBIT_NOTE_ISSUED"),
              t.Literal("INTERNAL_TRANSFER"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          amendedFromId: __nullable__(t.String()),
          postingDate: t.Date(),
          dueDate: __nullable__(t.Date()),
          partyType: t.String(),
          partyId: t.String(),
          currencyCode: t.String(),
          conversionRate: t.Number(),
          creditToId: t.String(),
          partyAccountCurrencyCode: __nullable__(t.String()),
          billNo: __nullable__(t.String()),
          billDate: __nullable__(t.Date()),
          onHold: t.Boolean(),
          releaseDate: __nullable__(t.Date()),
          holdComment: __nullable__(t.String()),
          isPaid: t.Boolean(),
          modeOfPaymentId: __nullable__(t.String()),
          cashBankAccountId: __nullable__(t.String()),
          paidAmount: t.Number(),
          isReturn: t.Boolean(),
          returnAgainstId: __nullable__(t.String()),
          updateOutstandingForSelf: t.Boolean(),
          isOpening: t.Boolean(),
          isInternalSupplier: t.Boolean(),
          unrealizedProfitLossAccountId: __nullable__(t.String()),
          taxesAndChargesTemplateId: __nullable__(t.String()),
          taxCategoryId: __nullable__(t.String()),
          applyTds: t.Boolean(),
          taxWithholdingCategoryId: __nullable__(t.String()),
          taxWithholdingAmount: t.Number(),
          applyDiscountOn: t.Union(
            [t.Literal("GRAND_TOTAL"), t.Literal("NET_TOTAL")],
            { additionalProperties: false },
          ),
          additionalDiscountPercentage: t.Number(),
          discountAmount: t.Number(),
          isCashOrNonTradeDiscount: t.Boolean(),
          additionalDiscountAccountId: __nullable__(t.String()),
          total: t.Number(),
          netTotal: t.Number(),
          totalTaxesAndCharges: t.Number(),
          grandTotal: t.Number(),
          roundingAdjustment: t.Number(),
          roundedTotal: t.Number(),
          disableRoundedTotal: t.Boolean(),
          inWords: __nullable__(t.String()),
          outstandingAmount: t.Number(),
          allocateAdvancesAutomatically: t.Boolean(),
          totalAdvance: t.Number(),
          writeOffAmount: t.Number(),
          writeOffAccountId: __nullable__(t.String()),
          writeOffCostCenterId: __nullable__(t.String()),
          paymentTermsTemplateId: __nullable__(t.String()),
          ignoreDefaultPaymentTermsTemplate: t.Boolean(),
          costCenterId: __nullable__(t.String()),
          projectId: __nullable__(t.String()),
          dim1: __nullable__(t.String()),
          dim2: __nullable__(t.String()),
          dim3: __nullable__(t.String()),
          dim4: __nullable__(t.String()),
          remarks: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          submittedAt: __nullable__(t.Date()),
          submittedById: __nullable__(t.String()),
          cancelledAt: __nullable__(t.Date()),
          cancelledById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    paymentEntries: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          documentNo: __nullable__(t.String()),
          docstatus: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          amendedFromId: __nullable__(t.String()),
          paymentType: t.Union(
            [
              t.Literal("RECEIVE"),
              t.Literal("PAY"),
              t.Literal("INTERNAL_TRANSFER"),
            ],
            { additionalProperties: false },
          ),
          postingDate: t.Date(),
          partyType: __nullable__(t.String()),
          partyId: __nullable__(t.String()),
          modeOfPaymentId: __nullable__(t.String()),
          paidFromId: t.String(),
          paidFromAccountCurrencyCode: __nullable__(t.String()),
          paidToId: t.String(),
          paidToAccountCurrencyCode: __nullable__(t.String()),
          paidAmount: t.Number(),
          sourceExchangeRate: t.Number(),
          basePaidAmount: t.Number(),
          receivedAmount: t.Number(),
          targetExchangeRate: t.Number(),
          baseReceivedAmount: t.Number(),
          totalAllocatedAmount: t.Number(),
          unallocatedAmount: t.Number(),
          differenceAmount: t.Number(),
          referenceNo: __nullable__(t.String()),
          referenceDate: __nullable__(t.Date()),
          clearanceDate: __nullable__(t.Date()),
          isOpening: t.Boolean(),
          bookAdvanceInSeparateAccount: t.Boolean({
            description: `[P12.6] FR-11.3 — snapshot of \`book_advance_payments_in_separate_party_account\` taken
when the draft was created. Snapshotted, not read live: a flag toggled between draft
and submit would post the advance somewhere other than where the operator was told,
and the document must record the regime it was written under.`,
          }),
          costCenterId: __nullable__(t.String()),
          projectId: __nullable__(t.String()),
          dim1: __nullable__(t.String()),
          dim2: __nullable__(t.String()),
          dim3: __nullable__(t.String()),
          dim4: __nullable__(t.String()),
          inWords: __nullable__(t.String()),
          remarks: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          submittedAt: __nullable__(t.Date()),
          submittedById: __nullable__(t.String()),
          cancelledAt: __nullable__(t.Date()),
          cancelledById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    unreconcilePayments: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          voucherType: t.String({
            description: `*
* the payment/credit whose allocations were broken`,
          }),
          voucherId: t.String(),
          remarks: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    userInboxSettings: t.Array(
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
    radiologyExamDefinitions: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          serviceId: t.String(),
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
          defaultViews: t.Array(t.String(), { additionalProperties: false }),
          lateralityRequired: t.Boolean(),
          contrastDefault: t.Boolean(),
          sedationDefault: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("ANXIOLYSIS"),
              t.Literal("SEDATION"),
              t.Literal("GENERAL_ANESTHESIA"),
            ],
            { additionalProperties: false },
          ),
          prepNotes: __nullable__(t.String()),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    radiologyReportTemplates: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          name: t.String(),
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
          serviceId: __nullable__(t.String()),
          technique: __nullable__(t.String()),
          comparison: __nullable__(t.String()),
          findings: __nullable__(t.String()),
          impression: __nullable__(t.String()),
          recommendations: __nullable__(t.String()),
          isDefault: t.Boolean({
            description: `القالب الافتراضي يُقترح تلقائيًا عند فتح محرّر تقرير مطابق`,
          }),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `قالب تقرير جاهز — يملأ أقسام التقرير بنقرة بدل إعادة كتابة النص الطبيعي
في كل فحص. يُربط بخدمة بعينها أو بطريقة تصوير كاملة (serviceId فارغ).`,
        },
      ),
      { additionalProperties: false },
    ),
    radiologyOrders: t.Array(
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
    vitalSignsRecords: t.Array(
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
    conversations: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          kind: t.Union([t.Literal("DIRECT"), t.Literal("GROUP")], {
            additionalProperties: false,
          }),
          title: __nullable__(t.String()),
          createdById: t.String(),
          lastMessageAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    operationDefinitions: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          serviceId: t.String(),
          defaultTier: t.Union(
            [t.Literal("MINOR"), t.Literal("INTERMEDIATE"), t.Literal("MAJOR")],
            { additionalProperties: false },
          ),
          defaultAnesthesia: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("ANXIOLYSIS"),
              t.Literal("SEDATION"),
              t.Literal("GENERAL_ANESTHESIA"),
            ],
            { additionalProperties: false },
          ),
          defaultWoundClass: __nullable__(
            t.Union(
              [
                t.Literal("CLEAN"),
                t.Literal("CLEAN_CONTAMINATED"),
                t.Literal("CONTAMINATED"),
                t.Literal("DIRTY"),
              ],
              { additionalProperties: false },
            ),
          ),
          requiresLaterality: t.Boolean(),
          bodySystem: __nullable__(t.String()),
          codes: __nullable__(t.Any()),
          specializationId: __nullable__(t.String()),
          prepNotes: __nullable__(t.String()),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    checklistTemplates: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: __nullable__(t.String()),
          scope: t.Union(
            [
              t.Literal("OPERATION_SIGN_IN"),
              t.Literal("OPERATION_TIME_OUT"),
              t.Literal("OPERATION_SIGN_OUT"),
              t.Literal("OPERATION_MINOR_COMBINED"),
            ],
            { additionalProperties: false },
          ),
          tier: __nullable__(
            t.Union(
              [
                t.Literal("MINOR"),
                t.Literal("INTERMEDIATE"),
                t.Literal("MAJOR"),
              ],
              { additionalProperties: false },
            ),
          ),
          nameAr: t.String(),
          nameEn: __nullable__(t.String()),
          version: t.Integer(),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    operationCases: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          branchId: t.String(),
          patientId: t.String(),
          ownerId: t.String(),
          appointmentId: __nullable__(t.String()),
          status: t.Union(
            [
              t.Literal("SCHEDULED"),
              t.Literal("PREP"),
              t.Literal("ANESTHESIA"),
              t.Literal("SURGERY"),
              t.Literal("RECOVERY"),
              t.Literal("DISCHARGE"),
              t.Literal("FOLLOW_UP"),
              t.Literal("COMPLETED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          stage: __nullable__(
            t.Union(
              [
                t.Literal("CONSENT"),
                t.Literal("FASTING_CHECK"),
                t.Literal("ASSESSMENT"),
                t.Literal("PREMED"),
                t.Literal("SIGN_IN"),
                t.Literal("INDUCTION"),
                t.Literal("MAINTENANCE"),
                t.Literal("TIME_OUT"),
                t.Literal("IN_PROGRESS"),
                t.Literal("CLOSING"),
                t.Literal("SIGN_OUT"),
                t.Literal("MONITORING"),
                t.Literal("READY_FOR_DISCHARGE"),
              ],
              { additionalProperties: false },
            ),
          ),
          tier: t.Union(
            [t.Literal("MINOR"), t.Literal("INTERMEDIATE"), t.Literal("MAJOR")],
            { additionalProperties: false },
          ),
          tierOverrideReason: __nullable__(t.String()),
          urgency: t.Union(
            [
              t.Literal("IMMEDIATE"),
              t.Literal("URGENT"),
              t.Literal("EXPEDITED"),
              t.Literal("ELECTIVE"),
            ],
            { additionalProperties: false },
          ),
          plannedAnesthesia: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("ANXIOLYSIS"),
              t.Literal("SEDATION"),
              t.Literal("GENERAL_ANESTHESIA"),
            ],
            { additionalProperties: false },
          ),
          scheduledAt: __nullable__(t.Date()),
          estimatedDurationMin: t.Integer(),
          ssiSurveillanceUntil: __nullable__(t.Date()),
          roomId: __nullable__(t.String()),
          diagnosis: __nullable__(t.String()),
          clinicalSummary: __nullable__(t.String()),
          cancelKind: __nullable__(
            t.Union(
              [t.Literal("OWNER"), t.Literal("CLINIC"), t.Literal("CLINICAL")],
              { additionalProperties: false },
            ),
          ),
          cancelReason: __nullable__(t.String()),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    drugStandards: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          standardId: t.String(),
          enabled: t.Boolean(),
          enabledAt: __nullable__(t.Date()),
          enabledById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    sopTemplates: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: __nullable__(t.String()),
          domain: t.Union(
            [t.Literal("LAB"), t.Literal("RADIOLOGY"), t.Literal("OPERATION")],
            { additionalProperties: false },
          ),
          serviceId: t.String(),
          titleAr: t.String(),
          titleEn: __nullable__(t.String()),
          reference: __nullable__(t.String()),
          version: t.Integer(),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    sopRuns: t.Array(
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
    clinicDocuments: t.Array(
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
    vaccines: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          name: t.String(),
          nameEn: __nullable__(t.String()),
          kind: t.Union(
            [
              t.Literal("MODIFIED_LIVE"),
              t.Literal("KILLED"),
              t.Literal("RECOMBINANT"),
              t.Literal("TOXOID"),
              t.Literal("SUBUNIT"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          manufacturerName: __nullable__(t.String()),
          catalogProductId: __nullable__(t.String()),
          inventoryItemId: __nullable__(t.String()),
          primarySeriesDoses: t.Integer(),
          primarySeriesIntervalDays: __nullable__(t.Integer()),
          boosterIntervalDays: __nullable__(t.Integer()),
          immunityOnsetDays: t.Integer(),
          defaultRoute: t.Union(
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
          defaultSite: __nullable__(
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
          defaultDoseVolumeMl: __nullable__(t.Number()),
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
      { additionalProperties: false },
    ),
    vaccinationProtocols: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: __nullable__(t.String()),
          name: t.String(),
          nameEn: __nullable__(t.String()),
          species: t.Union(
            [
              t.Literal("DOG"),
              t.Literal("CAT"),
              t.Literal("HORSE"),
              t.Literal("CATTLE"),
              t.Literal("SHEEP"),
              t.Literal("GOAT"),
              t.Literal("CAMEL"),
              t.Literal("POULTRY"),
              t.Literal("RABBIT"),
              t.Literal("SWINE"),
              t.Literal("FISH"),
              t.Literal("BEE"),
            ],
            { additionalProperties: false },
          ),
          animalTypeId: __nullable__(t.String()),
          animalStrainId: __nullable__(t.String()),
          isCore: t.Boolean(),
          isDefault: t.Boolean(),
          active: t.Boolean(),
          notes: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    vaccinationRecords: t.Array(
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
    deferredSchedule: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          type: t.Union([t.Literal("REVENUE"), t.Literal("EXPENSE")], {
            additionalProperties: false,
          }),
          salesInvoiceItemId: __nullable__(t.String()),
          purchaseInvoiceItemId: __nullable__(t.String()),
          periodEndDate: t.Date({
            description: `آخر يوم في الفترة المعترَف بها — المفتاح الزمني للفريدة`,
          }),
          amount: t.Number(),
          journalEntryId: __nullable__(
            t.String({
              description: `القيد الذي حمل الاعتراف: مباشر إلى الأستاذ أو عبر قيد يومية (§19 علم الإعداد)`,
            }),
          ),
          postedAt: t.Date(),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    deferredRuns: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          type: __nullable__(
            t.Union([t.Literal("REVENUE"), t.Literal("EXPENSE")], {
              additionalProperties: false,
            }),
          ),
          periodStartDate: t.Date(),
          periodEndDate: t.Date(),
          entriesCreated: t.Integer(),
          amountPosted: t.Number(),
          status: t.String(),
          errorMessage: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    taxWithholdingCategories: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          title: t.String(),
          basis: t.Union([t.Literal("GROSS"), t.Literal("NET")], {
            additionalProperties: false,
          }),
          taxOnExcessAmount: t.Boolean({
            description: `الضريبة على ما تجاوز العتبة فقط، لا على المبلغ كاملًا`,
          }),
          roundOffTaxAmount: t.Boolean(),
          disableSingleThreshold: t.Boolean(),
          disableCumulativeThreshold: t.Boolean(),
          disabled: t.Boolean(),
          accountId: __nullable__(
            t.String({
              description: `حساب الالتزام الذي يُقيَّد عليه المبلغ المستقطَع (دائن على فاتورة الشراء)`,
            }),
          ),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `فئة استقطاع: نِسَبها بنوافذ تاريخية، وحسابها لكل شركة، وسلوك عتباتها.`,
        },
      ),
      { additionalProperties: false },
    ),
    taxWithholdingEntries: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          categoryId: t.String(),
          partyType: t.String(),
          partyId: t.String(),
          voucherType: t.String(),
          voucherId: t.String(),
          voucherNo: t.String(),
          postingDate: t.Date(),
          taxableAmount: t.Number({
            description: `المبلغ الذي طُبِّقت عليه النسبة (قد يكون الزائد عن العتبة وحده)`,
          }),
          rate: t.Number(),
          taxAmount: t.Number(),
          certificateNo: __nullable__(
            t.String({
              description: `رقم الشهادة يُدخله المستخدم لاحقًا حين تصدرها الجهة`,
            }),
          ),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `أثر استقطاع فعليّ على مستند — مصدر تقرير الاستقطاع وأساس شهادة الخصم.`,
        },
      ),
      { additionalProperties: false },
    ),
    posProfiles: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          name: t.String(),
          warehouseId: __nullable__(t.String()),
          writeOffLimit: t.Number({
            description: `فرق النقد الذي يُقبل شطبه تلقائيًا عند الإقفال؛ ما فوقه يحتاج قرارًا`,
          }),
          writeOffAccountId: __nullable__(
            t.String({
              description: `حساب فروق النقد (زيادة/عجز الدرج) — بلا حساب يُرفض الإقفال بفارق`,
            }),
          ),
          disabled: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `ملف نقطة بيع: الإعدادات التي تحكم طاولة الكاشير في هذه العيادة.`,
        },
      ),
      { additionalProperties: false },
    ),
    posOpeningEntries: t.Array(
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
    posClosingEntries: t.Array(
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
    dunningTypes: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          title: t.String(),
          rateOfInterest: t.Number(),
          dunningFee: t.Number(),
          letterBody: __nullable__(t.String()),
          incomeAccountId: __nullable__(
            t.String({
              description: `حساب الإيراد الذي يستقبل الرسوم والفائدة عند التحصيل`,
            }),
          ),
          disabled: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `نوع مطالبة: الرسوم والفائدة الافتراضية ونصّ الخطاب. النصّ عربي فقط اليوم (قاعدة 5).`,
        },
      ),
      { additionalProperties: false },
    ),
    dunnings: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          typeId: __nullable__(t.String()),
          partyType: t.String(),
          partyId: t.String(),
          postingDate: t.Date(),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("UNRESOLVED"),
              t.Literal("RESOLVED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          rateOfInterest: t.Number(),
          dunningFee: t.Number(),
          totalOutstanding: t.Number({
            description: `مجموع أصل المتأخّرات وقت الإصدار — لقطة، لا يُعاد حسابها`,
          }),
          totalInterest: t.Number(),
          dunningAmount: t.Number({
            description: `الفائدة + الرسم = ما تطالب به المطالبة زيادةً على الأصل`,
          }),
          journalEntryId: __nullable__(
            t.String({
              description: `قيد الفائدة والرسم المُرحَّل عند اعتماد المطالبة — منه تُحصَّل عبر سند قبض عادي`,
            }),
          ),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `مطالبة على طرف: تجمع فواتيره المتأخّرة وتضيف الفائدة والرسم.`,
        },
      ),
      { additionalProperties: false },
    ),
    subscriptions: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          partyType: t.String(),
          partyId: t.String(),
          status: t.Union(
            [
              t.Literal("TRIALING"),
              t.Literal("ACTIVE"),
              t.Literal("PAST_DUE"),
              t.Literal("UNPAID"),
              t.Literal("CANCELLED"),
              t.Literal("COMPLETED"),
            ],
            { additionalProperties: false },
          ),
          interval: t.Union(
            [
              t.Literal("DAY"),
              t.Literal("WEEK"),
              t.Literal("MONTH"),
              t.Literal("YEAR"),
            ],
            { additionalProperties: false },
          ),
          intervalCount: t.Integer(),
          startDate: t.Date(),
          endDate: __nullable__(t.Date()),
          trialEndDate: __nullable__(t.Date()),
          lastInvoicedPeriodEnd: __nullable__(
            t.Date({
              description: `آخر فترة وُلِّدت لها فاتورة — مفتاح عدم التكرار الزمني`,
            }),
          ),
          generateInvoiceAtPeriodStart: t.Boolean({
            description: `مقدَّم أو مؤخَّر: هل تُصدر الفاتورة في بداية الفترة أم نهايتها`,
          }),
          daysUntilDue: t.Integer(),
          submitGeneratedInvoice: t.Boolean({
            description: `تُرحَّل الفاتورة المولَّدة تلقائيًا أم تبقى مسودّة لمراجعة بشرية`,
          }),
          taxTemplateId: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `اشتراك: طرف + خطط + دورة فوترة. مهمة يومية تُولّد فواتير الفترات المستحقّة.`,
        },
      ),
      { additionalProperties: false },
    ),
    statementConfigs: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          title: t.String(),
          reportType: t.Union(
            [t.Literal("PARTY_LEDGER"), t.Literal("RECEIVABLE_AGEING")],
            { additionalProperties: false },
          ),
          frequency: t.Union(
            [
              t.Literal("MANUAL"),
              t.Literal("WEEKLY"),
              t.Literal("MONTHLY"),
              t.Literal("QUARTERLY"),
            ],
            { additionalProperties: false },
          ),
          fromDate: __nullable__(
            t.Date({
              description: `نافذة ثابتة اختيارية؛ فارغة ⇒ تُشتقّ من التكرار عند كل إرسال`,
            }),
          ),
          toDate: __nullable__(t.Date()),
          subject: __nullable__(t.String()),
          bodyText: __nullable__(t.String()),
          ccEmails: t.Array(t.String(), { additionalProperties: false }),
          enabled: t.Boolean(),
          lastSentAt: __nullable__(t.Date()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[P12.7] FR-17.4 — تهيئة محفوظة لإرسال كشوف الحساب دوريًا إلى العملاء.`,
        },
      ),
      { additionalProperties: false },
    ),
    reposts: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          status: t.Union(
            [
              t.Literal("QUEUED"),
              t.Literal("IN_PROGRESS"),
              t.Literal("COMPLETED"),
              t.Literal("FAILED"),
            ],
            { additionalProperties: false },
          ),
          reason: t.String({
            description: `سبب إعادة الترحيل — يظهر في السجلّ ويُطالَب به لأن إعادة الترحيل حدث استثنائي`,
          }),
          errorMessage: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          completedAt: __nullable__(t.Date()),
        },
        {
          additionalProperties: false,
          description: `[P12.9] FR-6.9 — أداة إعادة ترحيل الدفتر: تعكس قيود مستند مُرحَّل ثم تُعيد بناءها.`,
        },
      ),
      { additionalProperties: false },
    ),
    consentTemplates: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          key: t.String(),
          type: t.Union(
            [
              t.Literal("SURGICAL"),
              t.Literal("ANESTHESIA"),
              t.Literal("BLOOD_PRODUCTS"),
              t.Literal("EUTHANASIA"),
              t.Literal("FINANCIAL_ESTIMATE"),
              t.Literal("HIGH_RISK_SURGICAL"),
              t.Literal("HOSPITALIZATION"),
              t.Literal("DISCHARGE_HEALTHY"),
              t.Literal("DISCHARGE_HOME_TREATMENT"),
              t.Literal("DISCHARGE_AGAINST_ADVICE"),
              t.Literal("BOARDING"),
              t.Literal("GROOMING"),
              t.Literal("EMERGENCY_TREATMENT"),
            ],
            { additionalProperties: false },
          ),
          version: t.Integer(),
          titleAr: t.String(),
          titleEn: t.String(),
          defaultLocale: t.Union(
            [t.Literal("AR"), t.Literal("EN"), t.Literal("BOTH")],
            { additionalProperties: false },
          ),
          speciesKey: __nullable__(t.String()),
          blocks: t.Any(),
          active: t.Boolean(),
          isDefault: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    patientConsents: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          patientId: t.String(),
          ownerId: t.String(),
          templateId: __nullable__(t.String()),
          templateKey: t.String(),
          templateVersion: t.Integer(),
          type: t.Union(
            [
              t.Literal("SURGICAL"),
              t.Literal("ANESTHESIA"),
              t.Literal("BLOOD_PRODUCTS"),
              t.Literal("EUTHANASIA"),
              t.Literal("FINANCIAL_ESTIMATE"),
              t.Literal("HIGH_RISK_SURGICAL"),
              t.Literal("HOSPITALIZATION"),
              t.Literal("DISCHARGE_HEALTHY"),
              t.Literal("DISCHARGE_HOME_TREATMENT"),
              t.Literal("DISCHARGE_AGAINST_ADVICE"),
              t.Literal("BOARDING"),
              t.Literal("GROOMING"),
              t.Literal("EMERGENCY_TREATMENT"),
            ],
            { additionalProperties: false },
          ),
          locale: t.Union(
            [t.Literal("AR"), t.Literal("EN"), t.Literal("BOTH")],
            { additionalProperties: false },
          ),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("AWAITING_SIGNATURE"),
              t.Literal("SIGNED"),
              t.Literal("REVOKED"),
            ],
            { additionalProperties: false },
          ),
          operationCaseId: __nullable__(t.String()),
          appointmentId: __nullable__(t.String()),
          inpatientStayId: __nullable__(t.String()),
          fieldValues: t.Any(),
          textSnapshot: t.String(),
          signerName: __nullable__(t.String()),
          signerRelationship: __nullable__(t.String()),
          signatureMethod: __nullable__(
            t.Union(
              [
                t.Literal("DRAWN"),
                t.Literal("TYPED"),
                t.Literal("UPLOADED"),
                t.Literal("VERBAL_WITNESSED"),
              ],
              { additionalProperties: false },
            ),
          ),
          signatureUrl: __nullable__(t.String()),
          witnessStaffId: __nullable__(t.String()),
          signedByStaffId: __nullable__(t.String()),
          signedAt: __nullable__(t.Date()),
          revokedAt: __nullable__(t.Date()),
          revokeReason: __nullable__(t.String()),
          sourceScanUrl: __nullable__(t.String()),
          extractedByAi: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    mobileUnits: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          branchId: t.String(),
          warehouseId: t.String(),
          name: t.String(),
          plateNumber: __nullable__(t.String()),
          vehicleMake: __nullable__(t.String()),
          vehicleModel: __nullable__(t.String()),
          year: __nullable__(t.Integer()),
          color: __nullable__(t.String()),
          photo: __nullable__(t.String()),
          status: t.Union(
            [
              t.Literal("OFFLINE"),
              t.Literal("AVAILABLE"),
              t.Literal("EN_ROUTE"),
              t.Literal("ON_SITE"),
              t.Literal("RETURNING"),
              t.Literal("ON_BREAK"),
              t.Literal("OUT_OF_SERVICE"),
            ],
            { additionalProperties: false },
          ),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          lastLat: __nullable__(t.Number()),
          lastLng: __nullable__(t.Number()),
          lastLocationAt: __nullable__(t.Date()),
          lastSpeedKph: __nullable__(t.Number()),
          lastHeading: __nullable__(t.Integer()),
          lastBatteryPct: __nullable__(t.Integer()),
          settings: __nullable__(t.Any()),
          notes: __nullable__(t.String()),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    mobileUnitCrew: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          mobileUnitId: t.String(),
          staffId: t.String(),
          role: t.Union(
            [
              t.Literal("DRIVER"),
              t.Literal("VET"),
              t.Literal("TECHNICIAN"),
              t.Literal("GROOMER"),
              t.Literal("ASSISTANT"),
            ],
            { additionalProperties: false },
          ),
          isPrimary: t.Boolean(),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    mobileUnitActivity: t.Array(
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
    mobileUnitDevices: t.Array(
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
    mobileUnitShifts: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          mobileUnitId: t.String(),
          openedByStaffId: t.String(),
          startedAt: t.Date(),
          endedAt: __nullable__(t.Date()),
          odometerStart: __nullable__(t.Integer()),
          odometerEnd: __nullable__(t.Integer()),
          startLat: __nullable__(t.Number()),
          startLng: __nullable__(t.Number()),
          distanceKm: __nullable__(t.Number()),
          notes: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    mobileUnitLocations: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          mobileUnitId: t.String(),
          shiftId: __nullable__(t.String()),
          lat: t.Number(),
          lng: t.Number(),
          accuracyM: __nullable__(t.Integer()),
          speedKph: __nullable__(t.Number()),
          heading: __nullable__(t.Integer()),
          altitudeM: __nullable__(t.Integer()),
          batteryPct: __nullable__(t.Integer()),
          isMoving: t.Boolean(),
          isCharging: __nullable__(t.Boolean()),
          recordedAt: t.Date(),
          receivedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    serviceAddresses: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          ownerId: __nullable__(t.String()),
          label: __nullable__(t.String()),
          line1: t.String(),
          district: __nullable__(t.String()),
          city: __nullable__(t.String()),
          landmark: __nullable__(t.String()),
          lat: __nullable__(t.Number()),
          lng: __nullable__(t.Number()),
          geocodeSource: __nullable__(
            t.Union(
              [
                t.Literal("MANUAL_PIN"),
                t.Literal("NOMINATIM"),
                t.Literal("DEVICE_GPS"),
              ],
              { additionalProperties: false },
            ),
          ),
          accessNotes: __nullable__(t.String()),
          isDefault: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    mobileVisits: t.Array(
      t.Object(
        {
          id: t.String(),
          appointmentId: t.String(),
          clinicId: t.String(),
          mobileUnitId: __nullable__(t.String()),
          shiftId: __nullable__(t.String()),
          serviceAddressId: t.String(),
          sequence: __nullable__(t.Integer()),
          windowStart: __nullable__(t.Date()),
          windowEnd: __nullable__(t.Date()),
          etaAt: __nullable__(t.Date()),
          dispatchStage: t.Union(
            [
              t.Literal("PENDING"),
              t.Literal("ASSIGNED"),
              t.Literal("EN_ROUTE"),
              t.Literal("ARRIVED"),
              t.Literal("IN_SERVICE"),
              t.Literal("COMPLETED"),
              t.Literal("FAILED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          enRouteAt: __nullable__(t.Date()),
          arrivedAt: __nullable__(t.Date()),
          departedAt: __nullable__(t.Date()),
          arrivalLat: __nullable__(t.Number()),
          arrivalLng: __nullable__(t.Number()),
          arrivalDriftM: __nullable__(t.Integer()),
          distanceKm: __nullable__(t.Number()),
          travelMinutes: __nullable__(t.Integer()),
          travelFee: __nullable__(t.Number()),
          failureReason: __nullable__(
            t.Union(
              [
                t.Literal("NO_ANSWER"),
                t.Literal("ADDRESS_NOT_FOUND"),
                t.Literal("ACCESS_DENIED"),
                t.Literal("PET_UNAVAILABLE"),
                t.Literal("OWNER_CANCELLED"),
                t.Literal("VEHICLE_ISSUE"),
                t.Literal("WEATHER"),
                t.Literal("OTHER"),
              ],
              { additionalProperties: false },
            ),
          ),
          failureNote: __nullable__(t.String()),
          signatureUrl: __nullable__(t.String()),
          photos: t.Array(t.String(), { additionalProperties: false }),
          trackingToken: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    mobileServiceCatalog: t.Array(
      t.Object(
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
      ),
      { additionalProperties: false },
    ),
    mobileUnitServices: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          mobileUnitId: t.String(),
          serviceId: t.String(),
          price: __nullable__(
            t.Number({
              description: `تجاوز سعر الكتالوج لهذه المركبة تحديدًا؛ null ⇒ سعر الكتالوج`,
            }),
          ),
          duration: __nullable__(
            t.Integer({
              description: `تجاوز المدّة بالدقائق؛ null ⇒ مدّة الكتالوج`,
            }),
          ),
          isActive: t.Boolean(),
          notes: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[MC10.2] ما نُفِّذ فعلًا في الزيارة المتنقلة — سجلّ ميداني مستقلّ عن
\`AppointmentService\`.
لماذا لا يكفي \`AppointmentService\`؟ لأنّه يجيب عن سؤال «بماذا حُجزت الزيارة؟» لا عن
«ماذا جرى في الموقع؟». الفرق بينهما هو عمل الطاقم: خدمة تُلغى لأنّ الحيوان لم يحتجها،
وأخرى تُضاف لأنّ المالك طلبها عند الباب. دمج الاثنين في جدول واحد يمحو هذا الفرق —
ومعه القدرة على مراجعة ما فعله السائق أو تسعير عمل المركبة على حدة.
السطور تُزامَن إلى \`AppointmentService\` عند COMPLETED فتركب الفاتورة والترحيل
المحاسبي كما هي — سجلٌّ منفصل لا مسار فوترة ثانٍ.
ما تستطيع **هذه المركبة** تقديمه من كتالوج العيادة المتنقلة.
طبقةٌ فوق \`MobileServiceCatalog\` لا بديلٌ عنه، والسبب أن الكتالوج يجيب سؤالين
لا مركبة فيهما أصلًا: نموذج الحجز العام يعرض الخدمات قبل إسناد أي مركبة، وتحويل
طلب إلى زيارة قد يجري بلا مركبة (مسار \`PENDING\` الذي يقوم عليه العرض والالتقاط).
فلو صار الكتالوج نفسه لكل مركبة لما بقي مصدرٌ للسعر في هاتين الحالتين.
**غياب الصفوف يعني السماح بالكل.** مركبةٌ بلا قائمة تقدّم كل ما في كتالوج العيادة —
فالتقييد قرار يُتخذ لا حالة افتراضية، ولا تفقد مركبة قائمة قدرتها يوم الترحيل.`,
        },
      ),
      { additionalProperties: false },
    ),
    mobileVisitServices: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          mobileVisitId: t.String(),
          serviceId: t.String(),
          quantity: t.Integer(),
          priceSnapshot: t.Number(),
          durationSnapshot: t.Integer(),
          source: t.Union([t.Literal("SCHEDULED"), t.Literal("FIELD")], {
            additionalProperties: false,
            description: `من أين جاء سطر الخدمة: كان على الموعد قبل الانطلاق، أم أضافه الطاقم في الموقع.
التمييز هو ما يجعل تقرير «ما زاد عن المجدول» ممكنًا أصلًا.`,
          }),
          performedAt: t.Date(),
          performedByStaffId: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    mobileBookingRequests: t.Array(
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
    serviceZones: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          name: t.String(),
          color: __nullable__(t.String()),
          shape: t.Union([t.Literal("CIRCLE"), t.Literal("POLYGON")], {
            additionalProperties: false,
          }),
          centerLat: __nullable__(t.Number()),
          centerLng: __nullable__(t.Number()),
          radiusKm: __nullable__(t.Number()),
          polygon: __nullable__(t.Any()),
          travelFee: __nullable__(t.Number()),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    dietFoods: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          seedKey: __nullable__(t.String()),
          name: t.String(),
          nameEn: __nullable__(t.String()),
          brand: __nullable__(t.String()),
          form: t.Union(
            [
              t.Literal("DRY"),
              t.Literal("WET"),
              t.Literal("RAW"),
              t.Literal("HOME_COOKED"),
              t.Literal("TREAT"),
              t.Literal("SUPPLEMENT"),
            ],
            { additionalProperties: false },
          ),
          kind: t.Union(
            [
              t.Literal("MAINTENANCE"),
              t.Literal("THERAPEUTIC"),
              t.Literal("TREAT"),
              t.Literal("SUPPLEMENT"),
            ],
            { additionalProperties: false },
          ),
          metabolizableEnergyKcalPerKg: t.Number(),
          householdUnit: t.Union(
            [
              t.Literal("GRAM"),
              t.Literal("CUP"),
              t.Literal("CAN"),
              t.Literal("SCOOP"),
              t.Literal("PIECE"),
            ],
            { additionalProperties: false },
          ),
          householdUnitGrams: __nullable__(t.Number()),
          proteinPercentDm: __nullable__(t.Number()),
          fatPercentDm: __nullable__(t.Number()),
          fiberPercentDm: __nullable__(t.Number()),
          moisturePercent: __nullable__(t.Number()),
          sodiumPercentDm: __nullable__(t.Number()),
          phosphorusPercentDm: __nullable__(t.Number()),
          species: t.Array(
            t.Union(
              [
                t.Literal("DOG"),
                t.Literal("CAT"),
                t.Literal("HORSE"),
                t.Literal("CATTLE"),
                t.Literal("SHEEP"),
                t.Literal("GOAT"),
                t.Literal("CAMEL"),
                t.Literal("POULTRY"),
                t.Literal("RABBIT"),
                t.Literal("SWINE"),
                t.Literal("FISH"),
                t.Literal("BEE"),
              ],
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
          indications: t.Array(t.String(), { additionalProperties: false }),
          lifeStages: t.Array(
            t.Union(
              [
                t.Literal("GROWTH_UNDER_4M"),
                t.Literal("GROWTH_OVER_4M"),
                t.Literal("ADULT"),
                t.Literal("SENIOR"),
              ],
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
          inventoryItemId: __nullable__(t.String()),
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
      { additionalProperties: false },
    ),
    nutritionPlans: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          patientId: t.String(),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("ACTIVE"),
              t.Literal("COMPLETED"),
              t.Literal("DISCONTINUED"),
            ],
            { additionalProperties: false },
          ),
          goal: t.Union(
            [
              t.Literal("MAINTENANCE"),
              t.Literal("WEIGHT_LOSS"),
              t.Literal("WEIGHT_GAIN"),
              t.Literal("GROWTH"),
              t.Literal("GESTATION"),
              t.Literal("LACTATION"),
              t.Literal("RECOVERY"),
            ],
            { additionalProperties: false },
          ),
          appointmentId: __nullable__(t.String()),
          prescriberId: __nullable__(t.String()),
          assessedAt: t.Date(),
          currentWeightKg: t.Number(),
          bodyConditionScore: __nullable__(t.Integer()),
          muscleConditionScore: __nullable__(
            t.Union(
              [
                t.Literal("NORMAL"),
                t.Literal("MILD_LOSS"),
                t.Literal("MODERATE_LOSS"),
                t.Literal("SEVERE_LOSS"),
              ],
              { additionalProperties: false },
            ),
          ),
          idealWeightKg: __nullable__(t.Number()),
          idealWeightSource: __nullable__(t.String()),
          lifeStage: t.Union(
            [
              t.Literal("GROWTH_UNDER_4M"),
              t.Literal("GROWTH_OVER_4M"),
              t.Literal("ADULT"),
              t.Literal("SENIOR"),
            ],
            { additionalProperties: false },
          ),
          activity: t.Union(
            [
              t.Literal("INACTIVE"),
              t.Literal("LOW"),
              t.Literal("MODERATE"),
              t.Literal("HIGH"),
              t.Literal("WORK_LIGHT"),
              t.Literal("WORK_MODERATE"),
              t.Literal("WORK_HEAVY"),
            ],
            { additionalProperties: false },
          ),
          isNeutered: t.Boolean(),
          riskFactors: t.Array(t.String(), { additionalProperties: false }),
          medicalConditions: t.Array(t.String(), {
            additionalProperties: false,
          }),
          feedingMethod: t.Union(
            [
              t.Literal("MEAL_FED"),
              t.Literal("FREE_CHOICE"),
              t.Literal("COMBINATION"),
            ],
            { additionalProperties: false },
          ),
          mealsPerDay: t.Integer(),
          currentDietSummary: __nullable__(t.String()),
          treatsSummary: __nullable__(t.String()),
          tableFoodSummary: __nullable__(t.String()),
          supplementsSummary: __nullable__(t.String()),
          medicationFoodSummary: __nullable__(t.String()),
          waterSource: __nullable__(t.String()),
          environmentNotes: __nullable__(t.String()),
          currentTreatCaloriePercent: __nullable__(t.Number()),
          calculationWeightKg: t.Number(),
          rerKcal: t.Number(),
          derFactor: t.Number(),
          derFactorSource: t.String(),
          derKcal: t.Number(),
          treatKcalAllowance: t.Number(),
          targetWeeklyRatePercent: __nullable__(t.Number()),
          estimatedWeeks: __nullable__(t.Integer()),
          recheckIntervalDays: t.Integer(),
          nextRecheckAt: __nullable__(t.Date()),
          feedingInstructions: __nullable__(t.String()),
          clinicalNotes: __nullable__(t.String()),
          transitionDays: __nullable__(t.Integer()),
          draftedByAi: t.Boolean(),
          startedAt: __nullable__(t.Date()),
          completedAt: __nullable__(t.Date()),
          discontinuedAt: __nullable__(t.Date()),
          discontinueReason: __nullable__(t.String()),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    nutritionRechecks: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          planId: t.String(),
          recheckedAt: t.Date(),
          performedById: __nullable__(t.String()),
          weightKg: t.Number(),
          bodyConditionScore: __nullable__(t.Integer()),
          muscleConditionScore: __nullable__(
            t.Union(
              [
                t.Literal("NORMAL"),
                t.Literal("MILD_LOSS"),
                t.Literal("MODERATE_LOSS"),
                t.Literal("SEVERE_LOSS"),
              ],
              { additionalProperties: false },
            ),
          ),
          weightChangeKg: __nullable__(t.Number()),
          weeklyRatePercent: __nullable__(t.Number()),
          outcome: __nullable__(
            t.Union(
              [
                t.Literal("ON_TRACK"),
                t.Literal("TOO_FAST"),
                t.Literal("TOO_SLOW"),
                t.Literal("STALLED"),
                t.Literal("REVERSED"),
                t.Literal("GOAL_REACHED"),
              ],
              { additionalProperties: false },
            ),
          ),
          ownerAdherence: __nullable__(t.Integer()),
          adjustmentPercent: __nullable__(t.Number()),
          newDerKcal: __nullable__(t.Number()),
          adjustmentReason: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          nextRecheckAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    groomingDefinitions: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          serviceId: t.String(),
          kind: t.Union(
            [
              t.Literal("BATH"),
              t.Literal("FULL_GROOM"),
              t.Literal("TIDY_UP"),
              t.Literal("DESHED"),
              t.Literal("NAIL_TRIM"),
              t.Literal("EAR_CLEAN"),
              t.Literal("ANAL_GLANDS"),
              t.Literal("TEETH_BRUSH"),
              t.Literal("DEMATTING"),
              t.Literal("SHAVE_DOWN"),
              t.Literal("MEDICATED_BATH"),
              t.Literal("PARASITE_DIP"),
              t.Literal("WOUND_CARE_CLIP"),
              t.Literal("SPA_ADDON"),
              t.Literal("OTHER"),
            ],
            {
              additionalProperties: false,
              description: `نوع خدمة التجميل — يقود الأيقونة والافتراضات لا المنطق.`,
            },
          ),
          lane: t.Union([t.Literal("COSMETIC"), t.Literal("MEDICAL")], {
            additionalProperties: false,
            description: `مسار الجلسة — تجميلي أم طبي. يقرّر أي البوابات إلزامية وأي اللوحات تظهر (§3).`,
          }),
          requiresVetOrder: t.Boolean(),
          isAddOn: t.Boolean(),
          basePrice: t.Number(),
          baseDurationMin: t.Integer(),
          dryingMinutes: t.Integer(),
          speciesScope: t.Array(t.String(), { additionalProperties: false }),
          requiresStation: t.Boolean(),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `تعريف خدمة تجميل — طبقة فوق عقدة ITEM في شجرة الخدمات، تمامًا كما يفعل
OperationProcedureDefinition. الشجرة تبقى عمود التسعير والصلاحيات، والجدول
هنا يحمل دلالات المجال.`,
        },
      ),
      { additionalProperties: false },
    ),
    groomingPriceRules: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          definitionId: t.String(),
          animalTypeId: __nullable__(t.String()),
          animalStrainId: __nullable__(t.String()),
          sizeBand: __nullable__(
            t.Union(
              [
                t.Literal("TOY"),
                t.Literal("SMALL"),
                t.Literal("MEDIUM"),
                t.Literal("LARGE"),
                t.Literal("GIANT"),
              ],
              {
                additionalProperties: false,
                description: `شريحة الحجم — تُشتق من وزن المريض ويتجاوزها كرت التجميل (القرار D4).`,
              },
            ),
          ),
          coatType: __nullable__(
            t.Union(
              [
                t.Literal("LONG_THICK"),
                t.Literal("SHORT_THICK"),
                t.Literal("LIGHT"),
                t.Literal("MEDIUM"),
                t.Literal("DOUBLE_COAT"),
                t.Literal("NONE"),
              ],
              { additionalProperties: false },
            ),
          ),
          price: t.Number(),
          durationMin: t.Integer(),
          dryingMinutes: __nullable__(t.Integer()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `صفّ في مصفوفة السعر/المدة (§5). الأخصّ يفوز، وسُلَّم الحلّ مذكور في
grooming-pricing.service.ts ومختبَر رتبةً رتبة. الأعمدة الاختيارية هي أبعاد
المطابقة: NULL تعني «لا يقيّد هذا البعد».`,
        },
      ),
      { additionalProperties: false },
    ),
    groomingModifiers: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          code: t.Union(
            [
              t.Literal("MATTING"),
              t.Literal("SHAVE_DOWN"),
              t.Literal("BEHAVIOR"),
              t.Literal("SENIOR"),
              t.Literal("FLEA"),
              t.Literal("SECOND_PET"),
              t.Literal("EXPRESS"),
              t.Literal("OUT_OF_HOURS"),
            ],
            {
              additionalProperties: false,
              description: `رموز الرسوم/الخصوم المشروطة (§5).`,
            },
          ),
          labelAr: t.String(),
          calc: t.Union(
            [t.Literal("PERCENT"), t.Literal("FIXED"), t.Literal("PER_MINUTE")],
            { additionalProperties: false, description: `طريقة حساب الرسم.` },
          ),
          value: t.Number(),
          autoAppliesFrom: __nullable__(t.Integer()),
          requiresOwnerApproval: t.Boolean(),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `رسم أو خصم مشروط يُطبَّق فوق سعر المصفوفة. كل تطبيق يُسجَّل لاحقًا كصفّ
GroomingSessionAdjustment مستقل (GR1) فيبقى «لماذا هذا المبلغ؟» مقروءًا.`,
        },
      ),
      { additionalProperties: false },
    ),
    groomingCapacity: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          branchId: t.String(),
          stations: t.Integer(),
          dryerSlots: t.Integer(),
          maxPetsPerDay: __nullable__(t.Integer()),
          maxHeatSensitiveConcurrent: t.Integer(),
          dropOffWindowMin: t.Integer(),
          requireDepositPercent: __nullable__(t.Number()),
          seniorAgeYears: t.Integer(),
          quoteReapprovalPercent: t.Number(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `سعة التجميل لكل فرع (§7). القيد ثلاثي: دقائق المُجمِّل، والمحطة، وفتحات
التجفيف — والأخيرة هي عنق الزجاجة الحقيقي الذي لا تنمذجه أنظمة الصالونات.`,
        },
      ),
      { additionalProperties: false },
    ),
    groomingProfiles: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          patientId: t.String(),
          preferredGroomerId: __nullable__(t.String()),
          sizeBand: __nullable__(
            t.Union(
              [
                t.Literal("TOY"),
                t.Literal("SMALL"),
                t.Literal("MEDIUM"),
                t.Literal("LARGE"),
                t.Literal("GIANT"),
              ],
              {
                additionalProperties: false,
                description: `شريحة الحجم — تُشتق من وزن المريض ويتجاوزها كرت التجميل (القرار D4).`,
              },
            ),
          ),
          coatType: __nullable__(
            t.Union(
              [
                t.Literal("LONG_THICK"),
                t.Literal("SHORT_THICK"),
                t.Literal("LIGHT"),
                t.Literal("MEDIUM"),
                t.Literal("DOUBLE_COAT"),
                t.Literal("NONE"),
              ],
              { additionalProperties: false },
            ),
          ),
          clipperPlan: __nullable__(t.Any()),
          shampooItemId: __nullable__(t.String()),
          sensitivities: t.Array(t.String(), { additionalProperties: false }),
          behaviorScore: t.Union(
            [t.Literal("GREEN"), t.Literal("YELLOW"), t.Literal("RED")],
            {
              additionalProperties: false,
              description: `تقييم سلوك التعامل — إشارة مرور.`,
            },
          ),
          muzzleRequired: t.Boolean(),
          requiresTwoHandlers: t.Boolean(),
          handlingNotes: __nullable__(t.String()),
          heatDryProhibited: t.Boolean(),
          heatDryProhibitedReason: __nullable__(t.String()),
          groomIntervalWeeks: __nullable__(t.Integer()),
          lastGroomedAt: __nullable__(t.Date()),
          nextGroomDueAt: __nullable__(t.Date()),
          customPrice: __nullable__(t.Number()),
          customDurationMin: __nullable__(t.Integer()),
          notes: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `كرت التجميل — الوثيقة التي يقوم عليها عمل الصالون فعلًا، ويُثريها السجلّ الطبي.
صفّ واحد لكل مريض، يعيش سنوات ويُعدَّل مرارًا (الخطة §4.2).`,
        },
      ),
      { additionalProperties: false },
    ),
    groomingSessions: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          branchId: t.String(),
          patientId: t.String(),
          ownerId: t.String(),
          appointmentId: __nullable__(t.String()),
          groomerId: t.String(),
          assistantId: __nullable__(t.String()),
          stationId: __nullable__(t.String()),
          lane: t.Union([t.Literal("COSMETIC"), t.Literal("MEDICAL")], {
            additionalProperties: false,
            description: `مسار الجلسة — تجميلي أم طبي. يقرّر أي البوابات إلزامية وأي اللوحات تظهر (§3).`,
          }),
          status: t.Union(
            [
              t.Literal("SCHEDULED"),
              t.Literal("CHECK_IN"),
              t.Literal("INTAKE"),
              t.Literal("IN_PROGRESS"),
              t.Literal("FINISHING"),
              t.Literal("READY"),
              t.Literal("PICKED_UP"),
              t.Literal("COMPLETED"),
              t.Literal("CANCELLED"),
              t.Literal("NO_SHOW"),
              t.Literal("ESCALATED"),
            ],
            {
              additionalProperties: false,
              description: `أعمدة لوحة التجميل (§6.1).`,
            },
          ),
          stage: __nullable__(
            t.Union(
              [
                t.Literal("QUOTE_APPROVAL"),
                t.Literal("BATH"),
                t.Literal("DRYING"),
                t.Literal("CLIP"),
                t.Literal("SCISSOR"),
                t.Literal("NAILS_EARS"),
                t.Literal("FINISH_CHECK"),
                t.Literal("PHOTOS"),
              ],
              {
                additionalProperties: false,
                description: `المرحلة الفرعية داخل الجلسة — تقود لوحة العمل.`,
              },
            ),
          ),
          vetOrderStaffId: __nullable__(t.String()),
          vetOrderNote: __nullable__(t.String()),
          sedationPlanned: t.Boolean(),
          scheduledAt: t.Date(),
          dropOffAt: __nullable__(t.Date()),
          estimatedDurationMin: t.Integer(),
          estimatedDryingMin: t.Integer(),
          promisedReadyAt: __nullable__(t.Date()),
          checkedInAt: __nullable__(t.Date()),
          startedAt: __nullable__(t.Date()),
          dryingStartedAt: __nullable__(t.Date()),
          readyAt: __nullable__(t.Date()),
          pickedUpAt: __nullable__(t.Date()),
          completedAt: __nullable__(t.Date()),
          dryingMethod: __nullable__(
            t.Union(
              [
                t.Literal("HAND_ROOM_TEMP"),
                t.Literal("FAN_ONLY"),
                t.Literal("CAGE_UNHEATED"),
                t.Literal("FORCED_AIR"),
                t.Literal("CAGE_HEATED"),
              ],
              {
                additionalProperties: false,
                description: `طريقة التجفيف — البوابة G5 ترفض CAGE_HEATED للحيوانات الممنوعة من الحرارة،
بلا أي مسار تجاوز. المرجع: إرشادات AAHA وصناعة التجميل حول قصيري الخطم.`,
              },
            ),
          ),
          quoteSubtotal: t.Number(),
          quoteAdjustments: t.Number(),
          quoteTotal: t.Number(),
          bookedQuoteTotal: t.Number(),
          ownerApprovedQuoteAt: __nullable__(t.Date()),
          cancelKind: __nullable__(
            t.Union(
              [
                t.Literal("OWNER_CANCELLED"),
                t.Literal("CLINIC_CANCELLED"),
                t.Literal("NO_SHOW"),
                t.Literal("HEALTH_REFUSAL"),
                t.Literal("BEHAVIOR_REFUSAL"),
              ],
              {
                additionalProperties: false,
                description: `سبب إنهاء الجلسة قبل أوانها`,
              },
            ),
          ),
          cancelReason: __nullable__(t.String()),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `جلسة التجميل — الكيان المركزي. مسار واحد لكل الجلسات، والمسار (lane) يقرّر
أي البوابات إلزامية لا أي الأعمدة تظهر (الخطة §4.3، §6).`,
        },
      ),
      { additionalProperties: false },
    ),
    groomingFindings: t.Array(
      t.Object(
        {
          id: t.String(),
          sessionId: t.String(),
          patientId: t.String(),
          clinicId: t.String(),
          category: t.Union(
            [
              t.Literal("SKIN"),
              t.Literal("EARS"),
              t.Literal("EYES"),
              t.Literal("NAILS"),
              t.Literal("DENTAL"),
              t.Literal("LUMP"),
              t.Literal("PARASITE"),
              t.Literal("WEIGHT"),
              t.Literal("PAIN"),
              t.Literal("BEHAVIOR"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          bodyZone: __nullable__(t.String()),
          severity: t.Union(
            [t.Literal("INFO"), t.Literal("ATTENTION"), t.Literal("URGENT")],
            { additionalProperties: false },
          ),
          note: t.String(),
          photoId: __nullable__(t.String()),
          acknowledgedByStaffId: __nullable__(t.String()),
          acknowledgedAt: __nullable__(t.Date()),
          referralAppointmentId: __nullable__(t.String()),
          labOrderId: __nullable__(t.String()),
          dismissedReason: __nullable__(t.String()),
          createdByStaffId: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `الجسر السريري (§8) — السبب الذي يجعل التجميل جزءًا من نظام بيطري لا صالونًا.
المُجمِّل يمرّ بيده على كامل الحيوان كل أربعة إلى ثمانية أسابيع؛ ما يراه كان
يتبخّر، وهنا يصير سطرًا في السجل الطبي وربما زيارة.`,
        },
      ),
      { additionalProperties: false },
    ),
    adCampaigns: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          branchId: __nullable__(t.String()),
          name: t.String(),
          platform: t.Union(
            [
              t.Literal("FACEBOOK"),
              t.Literal("INSTAGRAM"),
              t.Literal("LINKEDIN"),
              t.Literal("TIKTOK"),
              t.Literal("X"),
              t.Literal("PINTEREST"),
              t.Literal("SNAPCHAT"),
            ],
            { additionalProperties: false },
          ),
          objective: t.Union(
            [
              t.Literal("BRAND_AWARENESS"),
              t.Literal("LEAD_GENERATION"),
              t.Literal("STORE_VISITS"),
              t.Literal("CUSTOMER_FEEDBACK"),
              t.Literal("SALES"),
              t.Literal("PRODUCT_AWARENESS"),
            ],
            {
              additionalProperties: false,
              description: `أهداف الحملة الستة كما في التصميم (شاشة 538697)`,
            },
          ),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("PENDING"),
              t.Literal("SCHEDULED"),
              t.Literal("ACTIVE"),
              t.Literal("PAUSED"),
              t.Literal("COMPLETED"),
              t.Literal("FAILED"),
            ],
            { additionalProperties: false },
          ),
          socialAccountId: __nullable__(t.String()),
          audienceId: __nullable__(t.String()),
          startsAt: __nullable__(t.Date()),
          endsAt: __nullable__(t.Date()),
          durationDays: __nullable__(t.Integer()),
          budgetAmount: __nullable__(t.Number()),
          budgetKind: __nullable__(
            t.Union([t.Literal("DAILY"), t.Literal("LIFETIME")], {
              additionalProperties: false,
            }),
          ),
          currency: t.String(),
          feeAmount: __nullable__(t.Number()),
          totalAmount: __nullable__(t.Number()),
          externalId: __nullable__(t.String()),
          externalError: __nullable__(t.String()),
          launchedAt: __nullable__(t.Date()),
          createdByUserId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `الحملة الاعلانية — الكيان الجذر. تبقى \`DRAFT\` حتى الإطلاق، وتحت D1 لا يترتّب
على الإطلاق أيّ إنفاق داخل النظام.`,
        },
      ),
      { additionalProperties: false },
    ),
    adAudiences: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          name: t.String(),
          ageMin: __nullable__(t.Integer()),
          ageMax: __nullable__(t.Integer()),
          locations: t.Array(t.String(), { additionalProperties: false }),
          languages: t.Array(t.String(), { additionalProperties: false }),
          interests: t.Array(t.String(), { additionalProperties: false }),
          estimatedReach: __nullable__(t.Integer()),
          isAiSuggested: t.Boolean(),
          aiRationale: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `جمهور محفوظ. \`aiRationale\` هو ما يجعل «لماذا هذا موصى به؟» شرحًا حقيقيًا لا
زخرفة — يُخزَّن الآن وإن كانت لوحته غير مرسومة بعد (G3).`,
        },
      ),
      { additionalProperties: false },
    ),
    adCopyTemplates: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: __nullable__(t.String()),
          category: t.Union(
            [
              t.Literal("SEO"),
              t.Literal("PAID_ADS"),
              t.Literal("SALES"),
              t.Literal("SOCIAL"),
              t.Literal("EMAIL"),
            ],
            {
              additionalProperties: false,
              description: `تبويبات مكتبة القوالب (شاشة 540226)`,
            },
          ),
          title: t.String(),
          body: t.String(),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `قوالب نصّ الإعلان. \`clinicId = null\` يعني قالبًا عامًّا مبذورًا للجميع.`,
        },
      ),
      { additionalProperties: false },
    ),
    marketingSocialAccounts: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          platform: t.Union(
            [
              t.Literal("FACEBOOK"),
              t.Literal("INSTAGRAM"),
              t.Literal("LINKEDIN"),
              t.Literal("TIKTOK"),
              t.Literal("X"),
              t.Literal("PINTEREST"),
              t.Literal("SNAPCHAT"),
            ],
            { additionalProperties: false },
          ),
          externalId: t.String(),
          name: t.String(),
          accessToken: __nullable__(t.String()),
          connectedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `حساب/صفحة منصّة مرتبطة بالعيادة. \`accessToken\` يبقى فارغًا تحت D1 — لا رمز
وصول يُطلب ما دمنا لا ننشر نيابةً عن أحد.`,
        },
      ),
      { additionalProperties: false },
    ),
    petOwnerLinks: t.Array(
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
    pharmacySettings: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          enabled: t.Boolean({
            description: `راية الوحدة (BRD §0.3). مطفأة افتراضيًا: الوعد المركزي للوحدة أن إطفاءها
يعني «لا تغيير ملحوظ في أي مكان»، وهو ما تُثبته اختبارات الخمول في كل مرحلة.`,
          }),
          requireWitnessOnWaste: t.Boolean({
            description: `شاهد إلزامي على إتلاف مادة مراقبة (BRD §8.3). التوقيع المنفرد على الإتلاف
هو طريق التسريب الكلاسيكي، وإغلاقه هو سبب وجود السجل أصلًا.`,
          }),
          defaultLabelCopies: t.Integer({
            description: `عدد نسخ الملصق المطبوعة لكل صنف مصروف (BRD §9).`,
          }),
          fefoSuggestion: t.Boolean({
            description: `اقتراح أقرب صلاحية أولًا (FEFO) عند اختيار الدفعة. اقتراح لا إلزام
(BR-P7.3.3): قد يكون للطبيب سبب، والسجل يُظهر الدفعة التي خرجت فعلًا.`,
          }),
          blockExpiredDispense: t.Boolean({
            description: `منع صرف دفعة منتهية الصلاحية (BR-P7.3.4). موجود كعمود ليشرح نفسه في الشاشة،
لا ليُطفأ: الواجهة تعرضه معطّلًا مع سبب. صرف دواء منتهٍ ليس تفضيلًا للعيادة.`,
          }),
          controlledRegisterEnabled: t.Boolean({
            description: `تفعيل سجل المواد المراقبة (BRD §8). يبقى مطفأً حتى يُحسم O-PH-1 — مصدر
جدول الجدولة الرقابي — لأن \`legalStatus\` في الطبقة الأولى لا يصلح مصدرًا:
صفّان اثنان من ١٣٦٥ في سجل الغذاء والدواء (BRD §2.3).`,
          }),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[PH0.2] إعدادات الصيدلية لكل عيادة — نمط \`ClinicPayrollSettings\` و
\`ClinicSchedulingSettings\` (نموذج مُصنَّف لكل مجال، لا حقيبة مفاتيح عامّة:
لا يوجد سجلّ مفاتيح خارج \`AccountsSetting\` المحاسبي، فلا يُخترع واحد).`,
        },
      ),
    ),
    prescriptions: t.Array(
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
    dispenseEvents: t.Array(
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
    controlledSubstances: t.Array(
      t.Object(
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
      ),
      { additionalProperties: false },
    ),
    batchDisposals: t.Array(
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
    cages: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          branchId: t.String(),
          roomId: t.String(),
          name: t.String({
            description: `اسم/رقم القفص كما هو مكتوب على بابه`,
          }),
          sizeClass: __nullable__(
            t.Union(
              [
                t.Literal("SMALL"),
                t.Literal("MEDIUM"),
                t.Literal("LARGE"),
                t.Literal("WALK_IN"),
              ],
              {
                additionalProperties: false,
                description: `حجم القفص — يُستعمل لاقتراح الإسكان لا لمنعه. حيوان كبير في قفص صغير خطأ
يستحقّ تحذيرًا، لكنّه أحيانًا الخيار الوحيد المتاح ليلة الطوارئ.`,
              },
            ),
          ),
          notes: __nullable__(t.String()),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `قفص/سرير داخل غرفة. الغرفة وحدها لا تكفي: \`Room.capacity\` رقمٌ مجرّد لا يعرف
أيّ حيوان في أيّ موضع، ولا يسمح بنقلٍ موثَّق ولا بقاعدة عزل.`,
        },
      ),
      { additionalProperties: false },
    ),
    inpatientStays: t.Array(
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
    emergencyArrivals: t.Array(
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
    patientAlerts: t.Array(
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
    controlledRegister: t.Array(
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
    petOwnerRequests: t.Array(
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
    examTemplates: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: __nullable__(
            t.String({
              description: `null = قالب نظام تراه كل العيادات. الكاتب الوحيد لهذا الفرع هو الهجرات:
واجهة القوالب تملأ \`clinicId\` من الجلسة دائمًا، فلا تستطيع عيادة أن تُنشئ
قالب نظام. ولذلك لا قيد فرادة على صفوف النظام — Postgres يعدّ الـNULLات
متمايزة، و\`@@unique\` أدناه يغطّي قوالب العيادات وحدها. القيد الحقيقي على
صفوف النظام هو أن هجرة البذر وحدها تكتبها، وهي تُدرج بشرط عدم الوجود.`,
            }),
          ),
          key: t.String({
            description: `مفتاح ثابت مدى حياة القالب: GENERAL_V1 · VOMITING_V1 · DERM_V1`,
          }),
          version: t.Integer(),
          titleAr: t.String(),
          titleEn: __nullable__(t.String()),
          presentingComplaint: __nullable__(
            t.String({
              description: `الشكوى التي يبحث بها الطبيب عن القالب — «قيء» · «عرج»`,
            }),
          ),
          animalTypeId: __nullable__(
            t.String({
              description: `null = كل الأنواع. مفتاح أجنبي لا نصّ (القرار §11-B): القوالب بيانات تديرها
العيادة، والنصّ المكتوب خطأً يطابق لا شيء بصمت.`,
            }),
          ),
          blocks: t.Any({
            description: `ExamBlock[] — الوصف في §4 من الخطة، ويُتحقَّق منه بـTypeBox عند الكتابة.
كل كتلة تحمل قسمها S|O|A|P — وهذا وحده ما يجعله قالب SOAP لا بانيَ نماذج.`,
          }),
          isDefault: t.Boolean({
            description: `يُقترح تلقائيًا لهذه الشكوى/النوع (نمط \`RadiologyReportTemplate\`)`,
          }),
          active: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `قالب فحص لكل شكوى — نظامي (\`clinicId = null\`) أو خاصّ بعيادة، ومُصدَّر.`,
        },
      ),
      { additionalProperties: false },
    ),
    clinicalNotes: t.Array(
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
    scheduledJobs: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          jobType: t.String({
            description: `مفتاح المعالِج في سجلّ المُجدوِل — نصّ لا تعداد، كي تُسجِّل الوحداتُ
معالجاتِها بلا ترحيلٍ في كل مرّة (نفس عُرف \`AccountingJob.jobType\`).`,
          }),
          status: t.Union(
            [
              t.Literal("QUEUED"),
              t.Literal("IN_PROGRESS"),
              t.Literal("COMPLETED"),
              t.Literal("FAILED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          payload: __nullable__(t.Any()),
          idempotencyKey: t.String({
            description: `الفرادة هي الميزة كلّها: \`(clinicId, jobType, idempotencyKey)\` فريد، فإدراج
نفس العمل مرّتين يعيد الصفّ القائم بدل خلق ثانٍ. cron كل خمس دقائق على مِفتاحٍ
يوميّ ⇒ وظيفة واحدة في اليوم.`,
          }),
          scheduledFor: t.Date({
            description: `لا يُلتقط قبل هذه اللحظة — به تُبنى التأجيلات وساعات الهدوء`,
          }),
          attempts: t.Integer(),
          maxAttempts: t.Integer(),
          startedAt: __nullable__(t.Date()),
          finishedAt: __nullable__(t.Date()),
          errorMessage: __nullable__(t.String()),
          result: __nullable__(
            t.Any({
              description: `ملخّص ما فعله التشغيل — يُقرأ في شاشة المراقبة بلا فتح السجلّات`,
            }),
          ),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `وحدة عملٍ مؤجَّلة. الصفُّ **هو** الطابور: لا Redis ولا عامل منفصل في هذه
الحزمة (\`docs/deployment.md\`: عملية Nitro واحدة على خادم واحد)، والحالة في
قاعدة البيانات تنجو من إعادة التشغيل بينما طابور الذاكرة لا ينجو.
نفس فكرة \`AccountingJob\` [P0.5] وبنفس دلالات المطالبة الذرّية — ومُعمَّمة عمدًا
خارج المحاسبة لأن التذكيرات والاستدعاء والصيانة كلها تحتاج المِرفق ذاته. لم
يُوسَّع \`AccountingJob\` نفسه لأن حراس المحاسبة (BRD AR-7) يفترضون أن كل صفٍّ فيه
قيدٌ محاسبيّ، والتذكير ليس كذلك.`,
        },
      ),
      { additionalProperties: false },
    ),
    reminderRules: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
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
          name: t.String(),
          active: t.Boolean({
            description: `مُطفأة افتراضيًّا: وحدةٌ تبدأ بإرسال رسائل لمالكين حقيقيّين لحظةَ الترحيل
ليست ميزةً بل حادثة.`,
          }),
          offsetHours: t.Integer({
            description: `كم **ساعة قبل** الاستحقاق تُدرَج الرسالة. صفر = يوم الاستحقاق. السالب = بعده
(للاستدعاء المتأخّر: «تأخّرت ٧ أيام»).`,
          }),
          repeatAfterDays: __nullable__(
            t.Integer({
              description: `تذكيرٌ ثانٍ بعد N يومًا إن بقي السبب قائمًا (لم يُحجز موعد). \`null\` = مرّة واحدة.`,
            }),
          ),
          maxSends: t.Integer({
            description: `السقف الكلّي لعدد الرسائل لنفس السبب — الحدّ الذي يفصل التذكير عن الإزعاج`,
          }),
          channels: t.Array(
            t.Union(
              [
                t.Literal("INBOX"),
                t.Literal("EMAIL"),
                t.Literal("WHATSAPP"),
                t.Literal("SMS"),
                t.Literal("PUSH"),
              ],
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
          subjectTemplate: __nullable__(t.String()),
          bodyTemplate: t.String({
            description: `نصّ بعلامات {{...}} — يُحلّ بدالّة خالصة مُختبَرة (\`reminder-template.ts\`)`,
          }),
          quietHoursStart: __nullable__(
            t.Integer({
              description: `ساعات الهدوء بالدقائق من منتصف الليل بتوقيت العيادة. رسالةٌ تقع داخلها
تُؤجَّل إلى نهايتها لا تُلغى.`,
            }),
          ),
          quietHoursEnd: __nullable__(t.Integer()),
          horizonDays: t.Integer({
            description: `مدى الاستباق للمحرّكات التي تقبله (التطعيمات/التجميل) — بالأيام`,
          }),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `قاعدةٌ واحدة: متى نُذكِّر، بأيّ قنوات، وبأيّ نصّ.
وهي أيضًا الوجهة التي **يجب** أن تُشير إليها مفاتيح شاشة الإعدادات: قبل هذه
الوحدة كانت \`ClinicNotificationSettings.emailReminder*Enabled\` تُكتب ولا يقرؤها
أيّ مسار خادم — أي أن العيادة تُشغّل «تذكير قبل ٢٤ ساعة» ولا يحدث شيء أبدًا.`,
        },
      ),
      { additionalProperties: false },
    ),
    notificationOutbox: t.Array(
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

export const ClinicPlainInputCreate = t.Object(
  {
    name: t.String(),
    slug: t.Optional(__nullable__(t.String())),
    plan: t.Optional(
      t.Union([t.Literal("FREE"), t.Literal("BASIC"), t.Literal("PRO")], {
        additionalProperties: false,
      }),
    ),
    trialEndsAt: t.Optional(__nullable__(t.Date())),
    onboardingCompleted: t.Optional(t.Boolean()),
    rbacVersion: t.Optional(
      t.Integer({
        description: `[RBAC P4] يُرفَع عند أيّ كتابة على دور أو منحة أو إسناد. الجلسة تحمل النسخة التي
بُنيت منها لقطتُها، فتُعيد بناءها ذاتيًا عند الاختلاف بدل حذف الجلسات وإخراج المستخدم.`,
      }),
    ),
  },
  { additionalProperties: false },
);

export const ClinicPlainInputUpdate = t.Object(
  {
    name: t.Optional(t.String()),
    slug: t.Optional(__nullable__(t.String())),
    plan: t.Optional(
      t.Union([t.Literal("FREE"), t.Literal("BASIC"), t.Literal("PRO")], {
        additionalProperties: false,
      }),
    ),
    trialEndsAt: t.Optional(__nullable__(t.Date())),
    onboardingCompleted: t.Optional(t.Boolean()),
    rbacVersion: t.Optional(
      t.Integer({
        description: `[RBAC P4] يُرفَع عند أيّ كتابة على دور أو منحة أو إسناد. الجلسة تحمل النسخة التي
بُنيت منها لقطتُها، فتُعيد بناءها ذاتيًا عند الاختلاف بدل حذف الجلسات وإخراج المستخدم.`,
      }),
    ),
  },
  { additionalProperties: false },
);

export const ClinicRelationsInputCreate = t.Object(
  {
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
    invites: t.Optional(
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
    tasks: t.Optional(
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
    inboxItems: t.Optional(
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
    crmEmailTemplates: t.Optional(
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
    crmEmailMessages: t.Optional(
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
    crmWhatsappMessages: t.Optional(
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
    settings: t.Optional(
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
    protocols: t.Optional(
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
    notificationSettings: t.Optional(
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
    schedulingSettings: t.Optional(
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
    payrollSettings: t.Optional(
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
    leaveTypes: t.Optional(
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
    payrollRuns: t.Optional(
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
    eosSettlements: t.Optional(
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
    agentSettings: t.Optional(
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
    services: t.Optional(
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
    serviceConfigs: t.Optional(
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
    serviceUsages: t.Optional(
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
    branches: t.Optional(
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
    branchUsers: t.Optional(
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
    rooms: t.Optional(
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
    specializations: t.Optional(
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
    consultationTypes: t.Optional(
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
    consultationTypeConfigs: t.Optional(
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
    staffRoles: t.Optional(
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
    roleAssignments: t.Optional(
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
    permissionAuditLogs: t.Optional(
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
    attendances: t.Optional(
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
    shiftAssignments: t.Optional(
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
    leaveRequests: t.Optional(
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
    compensatoryEntries: t.Optional(
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
    animalTypes: t.Optional(
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
    strains: t.Optional(
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
    owners: t.Optional(
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
    patients: t.Optional(
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
    appointments: t.Optional(
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
    invoices: t.Optional(
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
    inventoryItems: t.Optional(
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
    suppliers: t.Optional(
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
    insurers: t.Optional(
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
    insuranceProducts: t.Optional(
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
    patientPolicies: t.Optional(
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
    insuranceClaims: t.Optional(
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
    crmSettings: t.Optional(
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
    crmLeadStatuses: t.Optional(
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
    crmDealStatuses: t.Optional(
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
    crmLeadSources: t.Optional(
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
    crmLostReasons: t.Optional(
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
    crmIndustries: t.Optional(
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
    crmSlaPolicies: t.Optional(
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
    loyaltySettings: t.Optional(
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
    loyaltyPrograms: t.Optional(
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
    loyaltyTiers: t.Optional(
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
    loyaltyLedger: t.Optional(
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
    loyaltyRedemptions: t.Optional(
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
    loyaltyOwnerTiers: t.Optional(
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
    crmLeads: t.Optional(
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
    crmStatusChangeLogs: t.Optional(
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
    crmNotes: t.Optional(
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
    crmTasks: t.Optional(
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
    crmComments: t.Optional(
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
    crmDeals: t.Optional(
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
    crmDealProducts: t.Optional(
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
    sales: t.Optional(
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
    warehouses: t.Optional(
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
    stockBins: t.Optional(
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
    stockBatches: t.Optional(
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
    onboardingProfile: t.Optional(
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
    discounts: t.Optional(
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
    carePlans: t.Optional(
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
    carePlanEnrollments: t.Optional(
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
    membershipPlans: t.Optional(
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
    memberships: t.Optional(
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
    invoiceMembershipAdjustments: t.Optional(
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
    saleMembershipAdjustments: t.Optional(
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
    expenses: t.Optional(
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
    courses: t.Optional(
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
    courseAssignments: t.Optional(
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
    courseAutoAssignRules: t.Optional(
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
    courseCertificates: t.Optional(
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
    courseReviews: t.Optional(
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
    labTestParameters: t.Optional(
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
    labTestOrders: t.Optional(
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
    quizzes: t.Optional(
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
    quizAssignments: t.Optional(
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
    accountingSettings: t.Optional(
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
    accountsSettings: t.Optional(
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
    accountingJobs: t.Optional(
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
    namingSeries: t.Optional(
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
    voucherDemos: t.Optional(
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
    ledgerAccounts: t.Optional(
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
    fiscalYears: t.Optional(
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
    accountingPeriods: t.Optional(
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
    periodClosingVouchers: t.Optional(
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
    budgets: t.Optional(
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
    accountingDimensionFilters: t.Optional(
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
    banks: t.Optional(
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
    bankAccounts: t.Optional(
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
    bankTransactions: t.Optional(
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
    bankImportMappings: t.Optional(
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
    bankStatementImports: t.Optional(
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
    bankTransactionRules: t.Optional(
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
    adapterPostings: t.Optional(
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
    monthlyDistributions: t.Optional(
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
    accountClosingBalances: t.Optional(
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
    costCenters: t.Optional(
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
    costCenterAllocations: t.Optional(
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
    modesOfPayment: t.Optional(
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
    currencyExchanges: t.Optional(
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
    exchangeRateRevaluations: t.Optional(
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
    accountingDimensions: t.Optional(
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
    financeBooks: t.Optional(
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
    glEntries: t.Optional(
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
    journalEntries: t.Optional(
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
    journalEntryTemplates: t.Optional(
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
    partyAccounts: t.Optional(
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
    partyCreditLimits: t.Optional(
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
    partyAccountingConfigs: t.Optional(
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
    paymentLedgerEntries: t.Optional(
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
    advancePaymentLedgerEntries: t.Optional(
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
    paymentTerms: t.Optional(
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
    paymentTermsTemplates: t.Optional(
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
    taxCategories: t.Optional(
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
    salesTaxTemplates: t.Optional(
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
    purchaseTaxTemplates: t.Optional(
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
    itemTaxTemplates: t.Optional(
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
    taxRules: t.Optional(
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
    itemWiseTaxDetails: t.Optional(
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
    salesInvoices: t.Optional(
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
    paymentSchedules: t.Optional(
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
    purchaseInvoices: t.Optional(
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
    paymentEntries: t.Optional(
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
    unreconcilePayments: t.Optional(
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
    userInboxSettings: t.Optional(
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
    radiologyExamDefinitions: t.Optional(
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
    radiologyReportTemplates: t.Optional(
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
    radiologyOrders: t.Optional(
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
    vitalSignsRecords: t.Optional(
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
    conversations: t.Optional(
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
    operationDefinitions: t.Optional(
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
    checklistTemplates: t.Optional(
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
    operationCases: t.Optional(
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
    drugStandards: t.Optional(
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
    sopTemplates: t.Optional(
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
    sopRuns: t.Optional(
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
    clinicDocuments: t.Optional(
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
    vaccines: t.Optional(
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
    vaccinationProtocols: t.Optional(
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
    vaccinationRecords: t.Optional(
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
    deferredSchedule: t.Optional(
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
    deferredRuns: t.Optional(
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
    taxWithholdingCategories: t.Optional(
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
    taxWithholdingEntries: t.Optional(
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
    posProfiles: t.Optional(
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
    posOpeningEntries: t.Optional(
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
    posClosingEntries: t.Optional(
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
    dunningTypes: t.Optional(
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
    dunnings: t.Optional(
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
    subscriptions: t.Optional(
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
    statementConfigs: t.Optional(
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
    reposts: t.Optional(
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
    consentTemplates: t.Optional(
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
    patientConsents: t.Optional(
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
    mobileUnits: t.Optional(
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
    mobileUnitCrew: t.Optional(
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
    mobileUnitActivity: t.Optional(
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
    mobileUnitDevices: t.Optional(
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
    mobileUnitShifts: t.Optional(
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
    mobileUnitLocations: t.Optional(
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
    serviceAddresses: t.Optional(
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
    mobileVisits: t.Optional(
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
    mobileServiceCatalog: t.Optional(
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
    mobileUnitServices: t.Optional(
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
    mobileVisitServices: t.Optional(
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
    mobileBookingRequests: t.Optional(
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
    serviceZones: t.Optional(
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
    dietFoods: t.Optional(
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
    nutritionPlans: t.Optional(
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
    nutritionRechecks: t.Optional(
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
    groomingDefinitions: t.Optional(
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
    groomingPriceRules: t.Optional(
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
    groomingModifiers: t.Optional(
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
    groomingCapacity: t.Optional(
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
    groomingProfiles: t.Optional(
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
    groomingSessions: t.Optional(
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
    groomingFindings: t.Optional(
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
    adCampaigns: t.Optional(
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
    adAudiences: t.Optional(
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
    adCopyTemplates: t.Optional(
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
    marketingSocialAccounts: t.Optional(
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
    petOwnerLinks: t.Optional(
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
    pharmacySettings: t.Optional(
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
    prescriptions: t.Optional(
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
    dispenseEvents: t.Optional(
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
    controlledSubstances: t.Optional(
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
    batchDisposals: t.Optional(
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
    cages: t.Optional(
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
    inpatientStays: t.Optional(
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
    emergencyArrivals: t.Optional(
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
    patientAlerts: t.Optional(
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
    controlledRegister: t.Optional(
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
    petOwnerRequests: t.Optional(
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
    examTemplates: t.Optional(
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
    clinicalNotes: t.Optional(
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
    scheduledJobs: t.Optional(
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
    reminderRules: t.Optional(
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
    notificationOutbox: t.Optional(
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

export const ClinicRelationsInputUpdate = t.Partial(
  t.Object(
    {
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
      invites: t.Partial(
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
      tasks: t.Partial(
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
      inboxItems: t.Partial(
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
      crmEmailTemplates: t.Partial(
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
      crmEmailMessages: t.Partial(
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
      crmWhatsappMessages: t.Partial(
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
      settings: t.Partial(
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
      protocols: t.Partial(
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
      notificationSettings: t.Partial(
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
      schedulingSettings: t.Partial(
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
      payrollSettings: t.Partial(
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
      leaveTypes: t.Partial(
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
      payrollRuns: t.Partial(
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
      eosSettlements: t.Partial(
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
      agentSettings: t.Partial(
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
      services: t.Partial(
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
      serviceConfigs: t.Partial(
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
      serviceUsages: t.Partial(
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
      branches: t.Partial(
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
      branchUsers: t.Partial(
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
      rooms: t.Partial(
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
      specializations: t.Partial(
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
      consultationTypes: t.Partial(
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
      consultationTypeConfigs: t.Partial(
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
      staffRoles: t.Partial(
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
      roleAssignments: t.Partial(
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
      permissionAuditLogs: t.Partial(
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
      attendances: t.Partial(
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
      shiftAssignments: t.Partial(
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
      leaveRequests: t.Partial(
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
      compensatoryEntries: t.Partial(
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
      animalTypes: t.Partial(
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
      strains: t.Partial(
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
      owners: t.Partial(
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
      patients: t.Partial(
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
      appointments: t.Partial(
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
      invoices: t.Partial(
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
      inventoryItems: t.Partial(
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
      suppliers: t.Partial(
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
      insurers: t.Partial(
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
      insuranceProducts: t.Partial(
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
      patientPolicies: t.Partial(
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
      insuranceClaims: t.Partial(
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
      crmSettings: t.Partial(
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
      crmLeadStatuses: t.Partial(
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
      crmDealStatuses: t.Partial(
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
      crmLeadSources: t.Partial(
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
      crmLostReasons: t.Partial(
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
      crmIndustries: t.Partial(
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
      crmSlaPolicies: t.Partial(
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
      loyaltySettings: t.Partial(
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
      loyaltyPrograms: t.Partial(
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
      loyaltyTiers: t.Partial(
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
      loyaltyLedger: t.Partial(
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
      loyaltyRedemptions: t.Partial(
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
      loyaltyOwnerTiers: t.Partial(
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
      crmLeads: t.Partial(
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
      crmStatusChangeLogs: t.Partial(
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
      crmNotes: t.Partial(
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
      crmTasks: t.Partial(
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
      crmComments: t.Partial(
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
      crmDeals: t.Partial(
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
      crmDealProducts: t.Partial(
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
      sales: t.Partial(
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
      warehouses: t.Partial(
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
      stockBins: t.Partial(
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
      stockBatches: t.Partial(
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
      onboardingProfile: t.Partial(
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
      discounts: t.Partial(
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
      carePlans: t.Partial(
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
      carePlanEnrollments: t.Partial(
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
      membershipPlans: t.Partial(
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
      memberships: t.Partial(
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
      invoiceMembershipAdjustments: t.Partial(
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
      saleMembershipAdjustments: t.Partial(
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
      expenses: t.Partial(
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
      courses: t.Partial(
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
      courseAssignments: t.Partial(
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
      courseAutoAssignRules: t.Partial(
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
      courseCertificates: t.Partial(
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
      courseReviews: t.Partial(
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
      labTestParameters: t.Partial(
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
      labTestOrders: t.Partial(
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
      quizzes: t.Partial(
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
      quizAssignments: t.Partial(
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
      accountingSettings: t.Partial(
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
      accountsSettings: t.Partial(
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
      accountingJobs: t.Partial(
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
      namingSeries: t.Partial(
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
      voucherDemos: t.Partial(
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
      ledgerAccounts: t.Partial(
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
      fiscalYears: t.Partial(
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
      accountingPeriods: t.Partial(
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
      periodClosingVouchers: t.Partial(
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
      budgets: t.Partial(
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
      accountingDimensionFilters: t.Partial(
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
      banks: t.Partial(
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
      bankAccounts: t.Partial(
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
      bankTransactions: t.Partial(
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
      bankImportMappings: t.Partial(
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
      bankStatementImports: t.Partial(
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
      bankTransactionRules: t.Partial(
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
      adapterPostings: t.Partial(
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
      monthlyDistributions: t.Partial(
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
      accountClosingBalances: t.Partial(
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
      costCenters: t.Partial(
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
      costCenterAllocations: t.Partial(
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
      modesOfPayment: t.Partial(
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
      currencyExchanges: t.Partial(
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
      exchangeRateRevaluations: t.Partial(
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
      accountingDimensions: t.Partial(
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
      financeBooks: t.Partial(
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
      glEntries: t.Partial(
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
      journalEntries: t.Partial(
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
      journalEntryTemplates: t.Partial(
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
      partyAccounts: t.Partial(
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
      partyCreditLimits: t.Partial(
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
      partyAccountingConfigs: t.Partial(
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
      paymentLedgerEntries: t.Partial(
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
      advancePaymentLedgerEntries: t.Partial(
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
      paymentTerms: t.Partial(
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
      paymentTermsTemplates: t.Partial(
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
      taxCategories: t.Partial(
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
      salesTaxTemplates: t.Partial(
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
      purchaseTaxTemplates: t.Partial(
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
      itemTaxTemplates: t.Partial(
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
      taxRules: t.Partial(
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
      itemWiseTaxDetails: t.Partial(
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
      salesInvoices: t.Partial(
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
      paymentSchedules: t.Partial(
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
      purchaseInvoices: t.Partial(
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
      paymentEntries: t.Partial(
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
      unreconcilePayments: t.Partial(
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
      userInboxSettings: t.Partial(
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
      radiologyExamDefinitions: t.Partial(
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
      radiologyReportTemplates: t.Partial(
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
      radiologyOrders: t.Partial(
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
      vitalSignsRecords: t.Partial(
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
      conversations: t.Partial(
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
      operationDefinitions: t.Partial(
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
      checklistTemplates: t.Partial(
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
      operationCases: t.Partial(
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
      drugStandards: t.Partial(
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
      sopTemplates: t.Partial(
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
      sopRuns: t.Partial(
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
      clinicDocuments: t.Partial(
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
      vaccines: t.Partial(
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
      vaccinationProtocols: t.Partial(
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
      vaccinationRecords: t.Partial(
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
      deferredSchedule: t.Partial(
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
      deferredRuns: t.Partial(
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
      taxWithholdingCategories: t.Partial(
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
      taxWithholdingEntries: t.Partial(
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
      posProfiles: t.Partial(
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
      posOpeningEntries: t.Partial(
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
      posClosingEntries: t.Partial(
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
      dunningTypes: t.Partial(
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
      dunnings: t.Partial(
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
      subscriptions: t.Partial(
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
      statementConfigs: t.Partial(
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
      reposts: t.Partial(
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
      consentTemplates: t.Partial(
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
      patientConsents: t.Partial(
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
      mobileUnits: t.Partial(
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
      mobileUnitCrew: t.Partial(
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
      mobileUnitActivity: t.Partial(
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
      mobileUnitDevices: t.Partial(
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
      mobileUnitShifts: t.Partial(
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
      mobileUnitLocations: t.Partial(
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
      serviceAddresses: t.Partial(
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
      mobileVisits: t.Partial(
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
      mobileServiceCatalog: t.Partial(
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
      mobileUnitServices: t.Partial(
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
      mobileVisitServices: t.Partial(
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
      mobileBookingRequests: t.Partial(
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
      serviceZones: t.Partial(
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
      dietFoods: t.Partial(
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
      nutritionPlans: t.Partial(
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
      nutritionRechecks: t.Partial(
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
      groomingDefinitions: t.Partial(
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
      groomingPriceRules: t.Partial(
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
      groomingModifiers: t.Partial(
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
      groomingCapacity: t.Partial(
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
      groomingProfiles: t.Partial(
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
      groomingSessions: t.Partial(
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
      groomingFindings: t.Partial(
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
      adCampaigns: t.Partial(
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
      adAudiences: t.Partial(
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
      adCopyTemplates: t.Partial(
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
      marketingSocialAccounts: t.Partial(
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
      petOwnerLinks: t.Partial(
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
      pharmacySettings: t.Partial(
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
      prescriptions: t.Partial(
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
      dispenseEvents: t.Partial(
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
      controlledSubstances: t.Partial(
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
      batchDisposals: t.Partial(
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
      cages: t.Partial(
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
      inpatientStays: t.Partial(
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
      emergencyArrivals: t.Partial(
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
      patientAlerts: t.Partial(
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
      controlledRegister: t.Partial(
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
      petOwnerRequests: t.Partial(
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
      examTemplates: t.Partial(
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
      clinicalNotes: t.Partial(
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
      scheduledJobs: t.Partial(
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
      reminderRules: t.Partial(
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
      notificationOutbox: t.Partial(
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

export const ClinicWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          name: t.String(),
          slug: t.String(),
          plan: t.Union(
            [t.Literal("FREE"), t.Literal("BASIC"), t.Literal("PRO")],
            { additionalProperties: false },
          ),
          trialEndsAt: t.Date(),
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
    { $id: "Clinic" },
  ),
);

export const ClinicWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), slug: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ slug: t.String() })],
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
              slug: t.String(),
              plan: t.Union(
                [t.Literal("FREE"), t.Literal("BASIC"), t.Literal("PRO")],
                { additionalProperties: false },
              ),
              trialEndsAt: t.Date(),
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
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Clinic" },
);

export const ClinicSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      name: t.Boolean(),
      slug: t.Boolean(),
      plan: t.Boolean(),
      trialEndsAt: t.Boolean(),
      onboardingCompleted: t.Boolean(),
      rbacVersion: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinicUsers: t.Boolean(),
      invites: t.Boolean(),
      sessions: t.Boolean(),
      tasks: t.Boolean(),
      inboxItems: t.Boolean(),
      crmEmailTemplates: t.Boolean(),
      crmEmailMessages: t.Boolean(),
      crmWhatsappMessages: t.Boolean(),
      settings: t.Boolean(),
      protocols: t.Boolean(),
      notificationSettings: t.Boolean(),
      schedulingSettings: t.Boolean(),
      payrollSettings: t.Boolean(),
      leaveTypes: t.Boolean(),
      payrollRuns: t.Boolean(),
      eosSettlements: t.Boolean(),
      agentSettings: t.Boolean(),
      agentConversations: t.Boolean(),
      services: t.Boolean(),
      serviceConfigs: t.Boolean(),
      serviceUsages: t.Boolean(),
      branches: t.Boolean(),
      branchUsers: t.Boolean(),
      rooms: t.Boolean(),
      specializations: t.Boolean(),
      consultationTypes: t.Boolean(),
      consultationTypeConfigs: t.Boolean(),
      staffRoles: t.Boolean(),
      roleAssignments: t.Boolean(),
      permissionAuditLogs: t.Boolean(),
      staff: t.Boolean(),
      attendances: t.Boolean(),
      shiftAssignments: t.Boolean(),
      leaveRequests: t.Boolean(),
      compensatoryEntries: t.Boolean(),
      animalTypes: t.Boolean(),
      strains: t.Boolean(),
      owners: t.Boolean(),
      patients: t.Boolean(),
      appointments: t.Boolean(),
      invoices: t.Boolean(),
      inventoryItems: t.Boolean(),
      suppliers: t.Boolean(),
      insurers: t.Boolean(),
      insuranceProducts: t.Boolean(),
      patientPolicies: t.Boolean(),
      insuranceClaims: t.Boolean(),
      crmSettings: t.Boolean(),
      crmLeadStatuses: t.Boolean(),
      crmDealStatuses: t.Boolean(),
      crmLeadSources: t.Boolean(),
      crmLostReasons: t.Boolean(),
      crmIndustries: t.Boolean(),
      crmSlaPolicies: t.Boolean(),
      crmSavedViews: t.Boolean(),
      loyaltySettings: t.Boolean(),
      loyaltyPrograms: t.Boolean(),
      loyaltyTiers: t.Boolean(),
      loyaltyLedger: t.Boolean(),
      loyaltyRedemptions: t.Boolean(),
      loyaltyOwnerTiers: t.Boolean(),
      crmLeads: t.Boolean(),
      crmStatusChangeLogs: t.Boolean(),
      crmNotes: t.Boolean(),
      crmTasks: t.Boolean(),
      crmComments: t.Boolean(),
      crmDeals: t.Boolean(),
      crmDealProducts: t.Boolean(),
      sales: t.Boolean(),
      stockLedgerEntries: t.Boolean(),
      warehouses: t.Boolean(),
      stockBins: t.Boolean(),
      purchaseOrders: t.Boolean(),
      stockBatches: t.Boolean(),
      onboardingProfile: t.Boolean(),
      discounts: t.Boolean(),
      carePlans: t.Boolean(),
      carePlanEnrollments: t.Boolean(),
      membershipPlans: t.Boolean(),
      memberships: t.Boolean(),
      invoiceMembershipAdjustments: t.Boolean(),
      saleMembershipAdjustments: t.Boolean(),
      expenses: t.Boolean(),
      courses: t.Boolean(),
      courseAssignments: t.Boolean(),
      courseAutoAssignRules: t.Boolean(),
      courseCertificates: t.Boolean(),
      courseReviews: t.Boolean(),
      labTestParameters: t.Boolean(),
      labTestOrders: t.Boolean(),
      quizzes: t.Boolean(),
      quizAssignments: t.Boolean(),
      accountingSettings: t.Boolean(),
      accountsSettings: t.Boolean(),
      accountingJobs: t.Boolean(),
      namingSeries: t.Boolean(),
      voucherDemos: t.Boolean(),
      ledgerAccounts: t.Boolean(),
      fiscalYears: t.Boolean(),
      accountingPeriods: t.Boolean(),
      periodClosingVouchers: t.Boolean(),
      budgets: t.Boolean(),
      accountingDimensionFilters: t.Boolean(),
      banks: t.Boolean(),
      bankAccounts: t.Boolean(),
      bankTransactions: t.Boolean(),
      bankImportMappings: t.Boolean(),
      bankStatementImports: t.Boolean(),
      bankTransactionRules: t.Boolean(),
      adapterPostings: t.Boolean(),
      monthlyDistributions: t.Boolean(),
      accountClosingBalances: t.Boolean(),
      costCenters: t.Boolean(),
      costCenterAllocations: t.Boolean(),
      modesOfPayment: t.Boolean(),
      currencyExchanges: t.Boolean(),
      exchangeRateRevaluations: t.Boolean(),
      accountingDimensions: t.Boolean(),
      financeBooks: t.Boolean(),
      glEntries: t.Boolean(),
      journalEntries: t.Boolean(),
      journalEntryTemplates: t.Boolean(),
      partyAccounts: t.Boolean(),
      partyCreditLimits: t.Boolean(),
      partyAccountingConfigs: t.Boolean(),
      paymentLedgerEntries: t.Boolean(),
      advancePaymentLedgerEntries: t.Boolean(),
      paymentTerms: t.Boolean(),
      paymentTermsTemplates: t.Boolean(),
      taxCategories: t.Boolean(),
      salesTaxTemplates: t.Boolean(),
      purchaseTaxTemplates: t.Boolean(),
      itemTaxTemplates: t.Boolean(),
      taxRules: t.Boolean(),
      itemWiseTaxDetails: t.Boolean(),
      salesInvoices: t.Boolean(),
      paymentSchedules: t.Boolean(),
      purchaseInvoices: t.Boolean(),
      paymentEntries: t.Boolean(),
      unreconcilePayments: t.Boolean(),
      userInboxSettings: t.Boolean(),
      radiologyExamDefinitions: t.Boolean(),
      radiologyReportTemplates: t.Boolean(),
      radiologyOrders: t.Boolean(),
      vitalSignsRecords: t.Boolean(),
      conversations: t.Boolean(),
      operationDefinitions: t.Boolean(),
      checklistTemplates: t.Boolean(),
      operationCases: t.Boolean(),
      drugStandards: t.Boolean(),
      sopTemplates: t.Boolean(),
      sopRuns: t.Boolean(),
      clinicDocuments: t.Boolean(),
      vaccines: t.Boolean(),
      vaccinationProtocols: t.Boolean(),
      vaccinationRecords: t.Boolean(),
      deferredSchedule: t.Boolean(),
      deferredRuns: t.Boolean(),
      taxWithholdingCategories: t.Boolean(),
      taxWithholdingEntries: t.Boolean(),
      posProfiles: t.Boolean(),
      posOpeningEntries: t.Boolean(),
      posClosingEntries: t.Boolean(),
      dunningTypes: t.Boolean(),
      dunnings: t.Boolean(),
      subscriptions: t.Boolean(),
      statementConfigs: t.Boolean(),
      reposts: t.Boolean(),
      consentTemplates: t.Boolean(),
      patientConsents: t.Boolean(),
      mobileUnits: t.Boolean(),
      mobileUnitCrew: t.Boolean(),
      mobileUnitActivity: t.Boolean(),
      mobileUnitDevices: t.Boolean(),
      mobileUnitShifts: t.Boolean(),
      mobileUnitLocations: t.Boolean(),
      serviceAddresses: t.Boolean(),
      mobileVisits: t.Boolean(),
      mobileServiceCatalog: t.Boolean(),
      mobileUnitServices: t.Boolean(),
      mobileVisitServices: t.Boolean(),
      mobileBookingRequests: t.Boolean(),
      serviceZones: t.Boolean(),
      dietFoods: t.Boolean(),
      nutritionPlans: t.Boolean(),
      nutritionRechecks: t.Boolean(),
      groomingDefinitions: t.Boolean(),
      groomingPriceRules: t.Boolean(),
      groomingModifiers: t.Boolean(),
      groomingCapacity: t.Boolean(),
      groomingProfiles: t.Boolean(),
      groomingSessions: t.Boolean(),
      groomingFindings: t.Boolean(),
      adCampaigns: t.Boolean(),
      adAudiences: t.Boolean(),
      adCopyTemplates: t.Boolean(),
      marketingSocialAccounts: t.Boolean(),
      petOwnerLinks: t.Boolean(),
      pharmacySettings: t.Boolean(),
      prescriptions: t.Boolean(),
      dispenseEvents: t.Boolean(),
      controlledSubstances: t.Boolean(),
      batchDisposals: t.Boolean(),
      cages: t.Boolean(),
      inpatientStays: t.Boolean(),
      emergencyArrivals: t.Boolean(),
      triageAssessments: t.Boolean(),
      patientAlerts: t.Boolean(),
      controlledRegister: t.Boolean(),
      petOwnerRequests: t.Boolean(),
      examTemplates: t.Boolean(),
      clinicalNotes: t.Boolean(),
      scheduledJobs: t.Boolean(),
      reminderRules: t.Boolean(),
      notificationOutbox: t.Boolean(),
      recallContacts: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ClinicInclude = t.Partial(
  t.Object(
    {
      plan: t.Boolean(),
      clinicUsers: t.Boolean(),
      invites: t.Boolean(),
      sessions: t.Boolean(),
      tasks: t.Boolean(),
      inboxItems: t.Boolean(),
      crmEmailTemplates: t.Boolean(),
      crmEmailMessages: t.Boolean(),
      crmWhatsappMessages: t.Boolean(),
      settings: t.Boolean(),
      protocols: t.Boolean(),
      notificationSettings: t.Boolean(),
      schedulingSettings: t.Boolean(),
      payrollSettings: t.Boolean(),
      leaveTypes: t.Boolean(),
      payrollRuns: t.Boolean(),
      eosSettlements: t.Boolean(),
      agentSettings: t.Boolean(),
      agentConversations: t.Boolean(),
      services: t.Boolean(),
      serviceConfigs: t.Boolean(),
      serviceUsages: t.Boolean(),
      branches: t.Boolean(),
      branchUsers: t.Boolean(),
      rooms: t.Boolean(),
      specializations: t.Boolean(),
      consultationTypes: t.Boolean(),
      consultationTypeConfigs: t.Boolean(),
      staffRoles: t.Boolean(),
      roleAssignments: t.Boolean(),
      permissionAuditLogs: t.Boolean(),
      staff: t.Boolean(),
      attendances: t.Boolean(),
      shiftAssignments: t.Boolean(),
      leaveRequests: t.Boolean(),
      compensatoryEntries: t.Boolean(),
      animalTypes: t.Boolean(),
      strains: t.Boolean(),
      owners: t.Boolean(),
      patients: t.Boolean(),
      appointments: t.Boolean(),
      invoices: t.Boolean(),
      inventoryItems: t.Boolean(),
      suppliers: t.Boolean(),
      insurers: t.Boolean(),
      insuranceProducts: t.Boolean(),
      patientPolicies: t.Boolean(),
      insuranceClaims: t.Boolean(),
      crmSettings: t.Boolean(),
      crmLeadStatuses: t.Boolean(),
      crmDealStatuses: t.Boolean(),
      crmLeadSources: t.Boolean(),
      crmLostReasons: t.Boolean(),
      crmIndustries: t.Boolean(),
      crmSlaPolicies: t.Boolean(),
      crmSavedViews: t.Boolean(),
      loyaltySettings: t.Boolean(),
      loyaltyPrograms: t.Boolean(),
      loyaltyTiers: t.Boolean(),
      loyaltyLedger: t.Boolean(),
      loyaltyRedemptions: t.Boolean(),
      loyaltyOwnerTiers: t.Boolean(),
      crmLeads: t.Boolean(),
      crmStatusChangeLogs: t.Boolean(),
      crmNotes: t.Boolean(),
      crmTasks: t.Boolean(),
      crmComments: t.Boolean(),
      crmDeals: t.Boolean(),
      crmDealProducts: t.Boolean(),
      sales: t.Boolean(),
      stockLedgerEntries: t.Boolean(),
      warehouses: t.Boolean(),
      stockBins: t.Boolean(),
      purchaseOrders: t.Boolean(),
      stockBatches: t.Boolean(),
      onboardingProfile: t.Boolean(),
      discounts: t.Boolean(),
      carePlans: t.Boolean(),
      carePlanEnrollments: t.Boolean(),
      membershipPlans: t.Boolean(),
      memberships: t.Boolean(),
      invoiceMembershipAdjustments: t.Boolean(),
      saleMembershipAdjustments: t.Boolean(),
      expenses: t.Boolean(),
      courses: t.Boolean(),
      courseAssignments: t.Boolean(),
      courseAutoAssignRules: t.Boolean(),
      courseCertificates: t.Boolean(),
      courseReviews: t.Boolean(),
      labTestParameters: t.Boolean(),
      labTestOrders: t.Boolean(),
      quizzes: t.Boolean(),
      quizAssignments: t.Boolean(),
      accountingSettings: t.Boolean(),
      accountsSettings: t.Boolean(),
      accountingJobs: t.Boolean(),
      namingSeries: t.Boolean(),
      voucherDemos: t.Boolean(),
      ledgerAccounts: t.Boolean(),
      fiscalYears: t.Boolean(),
      accountingPeriods: t.Boolean(),
      periodClosingVouchers: t.Boolean(),
      budgets: t.Boolean(),
      accountingDimensionFilters: t.Boolean(),
      banks: t.Boolean(),
      bankAccounts: t.Boolean(),
      bankTransactions: t.Boolean(),
      bankImportMappings: t.Boolean(),
      bankStatementImports: t.Boolean(),
      bankTransactionRules: t.Boolean(),
      adapterPostings: t.Boolean(),
      monthlyDistributions: t.Boolean(),
      accountClosingBalances: t.Boolean(),
      costCenters: t.Boolean(),
      costCenterAllocations: t.Boolean(),
      modesOfPayment: t.Boolean(),
      currencyExchanges: t.Boolean(),
      exchangeRateRevaluations: t.Boolean(),
      accountingDimensions: t.Boolean(),
      financeBooks: t.Boolean(),
      glEntries: t.Boolean(),
      journalEntries: t.Boolean(),
      journalEntryTemplates: t.Boolean(),
      partyAccounts: t.Boolean(),
      partyCreditLimits: t.Boolean(),
      partyAccountingConfigs: t.Boolean(),
      paymentLedgerEntries: t.Boolean(),
      advancePaymentLedgerEntries: t.Boolean(),
      paymentTerms: t.Boolean(),
      paymentTermsTemplates: t.Boolean(),
      taxCategories: t.Boolean(),
      salesTaxTemplates: t.Boolean(),
      purchaseTaxTemplates: t.Boolean(),
      itemTaxTemplates: t.Boolean(),
      taxRules: t.Boolean(),
      itemWiseTaxDetails: t.Boolean(),
      salesInvoices: t.Boolean(),
      paymentSchedules: t.Boolean(),
      purchaseInvoices: t.Boolean(),
      paymentEntries: t.Boolean(),
      unreconcilePayments: t.Boolean(),
      userInboxSettings: t.Boolean(),
      radiologyExamDefinitions: t.Boolean(),
      radiologyReportTemplates: t.Boolean(),
      radiologyOrders: t.Boolean(),
      vitalSignsRecords: t.Boolean(),
      conversations: t.Boolean(),
      operationDefinitions: t.Boolean(),
      checklistTemplates: t.Boolean(),
      operationCases: t.Boolean(),
      drugStandards: t.Boolean(),
      sopTemplates: t.Boolean(),
      sopRuns: t.Boolean(),
      clinicDocuments: t.Boolean(),
      vaccines: t.Boolean(),
      vaccinationProtocols: t.Boolean(),
      vaccinationRecords: t.Boolean(),
      deferredSchedule: t.Boolean(),
      deferredRuns: t.Boolean(),
      taxWithholdingCategories: t.Boolean(),
      taxWithholdingEntries: t.Boolean(),
      posProfiles: t.Boolean(),
      posOpeningEntries: t.Boolean(),
      posClosingEntries: t.Boolean(),
      dunningTypes: t.Boolean(),
      dunnings: t.Boolean(),
      subscriptions: t.Boolean(),
      statementConfigs: t.Boolean(),
      reposts: t.Boolean(),
      consentTemplates: t.Boolean(),
      patientConsents: t.Boolean(),
      mobileUnits: t.Boolean(),
      mobileUnitCrew: t.Boolean(),
      mobileUnitActivity: t.Boolean(),
      mobileUnitDevices: t.Boolean(),
      mobileUnitShifts: t.Boolean(),
      mobileUnitLocations: t.Boolean(),
      serviceAddresses: t.Boolean(),
      mobileVisits: t.Boolean(),
      mobileServiceCatalog: t.Boolean(),
      mobileUnitServices: t.Boolean(),
      mobileVisitServices: t.Boolean(),
      mobileBookingRequests: t.Boolean(),
      serviceZones: t.Boolean(),
      dietFoods: t.Boolean(),
      nutritionPlans: t.Boolean(),
      nutritionRechecks: t.Boolean(),
      groomingDefinitions: t.Boolean(),
      groomingPriceRules: t.Boolean(),
      groomingModifiers: t.Boolean(),
      groomingCapacity: t.Boolean(),
      groomingProfiles: t.Boolean(),
      groomingSessions: t.Boolean(),
      groomingFindings: t.Boolean(),
      adCampaigns: t.Boolean(),
      adAudiences: t.Boolean(),
      adCopyTemplates: t.Boolean(),
      marketingSocialAccounts: t.Boolean(),
      petOwnerLinks: t.Boolean(),
      pharmacySettings: t.Boolean(),
      prescriptions: t.Boolean(),
      dispenseEvents: t.Boolean(),
      controlledSubstances: t.Boolean(),
      batchDisposals: t.Boolean(),
      cages: t.Boolean(),
      inpatientStays: t.Boolean(),
      emergencyArrivals: t.Boolean(),
      triageAssessments: t.Boolean(),
      patientAlerts: t.Boolean(),
      controlledRegister: t.Boolean(),
      petOwnerRequests: t.Boolean(),
      examTemplates: t.Boolean(),
      clinicalNotes: t.Boolean(),
      scheduledJobs: t.Boolean(),
      reminderRules: t.Boolean(),
      notificationOutbox: t.Boolean(),
      recallContacts: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ClinicOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      slug: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      trialEndsAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      onboardingCompleted: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rbacVersion: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Clinic = t.Composite([ClinicPlain, ClinicRelations], {
  additionalProperties: false,
});

export const ClinicInputCreate = t.Composite(
  [ClinicPlainInputCreate, ClinicRelationsInputCreate],
  { additionalProperties: false },
);

export const ClinicInputUpdate = t.Composite(
  [ClinicPlainInputUpdate, ClinicRelationsInputUpdate],
  { additionalProperties: false },
);
