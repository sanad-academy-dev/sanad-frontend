import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const StaffPlain = t.Object(
  {
    id: t.String(),
    code: t.String(),
    clinicId: t.String(),
    userId: __nullable__(t.String()),
    roleId: t.String(),
    branchId: t.String(),
    name: t.String(),
    gender: __nullable__(
      t.Union([t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")], {
        additionalProperties: false,
      }),
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
);

export const StaffRelations = t.Object(
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
    user: __nullable__(
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
    branch: t.Object(
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
    primarySpecialization: __nullable__(
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
    ),
    secondarySpecialization: __nullable__(
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
    schedulingSettings: __nullable__(
      t.Object(
        {
          id: t.String(),
          staffId: t.String(),
          shift: __nullable__(
            t.Union(
              [t.Literal("MORNING"), t.Literal("EVENING"), t.Literal("BOTH")],
              { additionalProperties: false },
            ),
          ),
          morningStartMinute: __nullable__(t.Integer()),
          morningEndMinute: __nullable__(t.Integer()),
          eveningStartMinute: __nullable__(t.Integer()),
          eveningEndMinute: __nullable__(t.Integer()),
          onlineBookingEnabled: t.Boolean(),
          inClinicAppointmentsEnabled: t.Boolean(),
          mobileClinicAppointmentsEnabled: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    workingHours: t.Array(
      t.Object(
        {
          id: t.String(),
          staffId: t.String(),
          weekday: t.Union(
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
          isWorking: t.Boolean(),
          startMinute: __nullable__(t.Integer()),
          endMinute: __nullable__(t.Integer()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    services: t.Array(
      t.Object(
        {
          id: t.String(),
          staffId: t.String(),
          serviceId: t.String(),
          isActive: t.Boolean(),
          usageCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    consultationTypes: t.Array(
      t.Object(
        {
          id: t.String(),
          staffId: t.String(),
          consultationTypeId: t.String(),
          isActive: t.Boolean(),
          usageCount: t.Integer(),
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
    substituteFor: t.Array(
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
    documents: t.Array(
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
    compensation: __nullable__(
      t.Object(
        {
          id: t.String(),
          staffId: t.String(),
          baseSalary: t.Number(),
          iban: __nullable__(t.String()),
          bankName: __nullable__(t.String()),
          defaultPaymentMethod: t.Union(
            [t.Literal("TRANSFER"), t.Literal("CASH"), t.Literal("CHECK")],
            { additionalProperties: false },
          ),
          effectiveFrom: __nullable__(t.Date()),
          notes: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    payrollLines: t.Array(
      t.Object(
        {
          id: t.String(),
          runId: t.String(),
          staffId: t.String(),
          staffName: t.String(),
          staffCode: t.String(),
          baseSalary: t.Number(),
          allowancesTotal: t.Number(),
          overtimeHoursSuggested: t.Number(),
          overtimeHoursOverride: __nullable__(t.Number()),
          paymentMethodSuggested: t.Union(
            [t.Literal("TRANSFER"), t.Literal("CASH"), t.Literal("CHECK")],
            { additionalProperties: false },
          ),
          paymentMethodOverride: __nullable__(
            t.Union(
              [t.Literal("TRANSFER"), t.Literal("CASH"), t.Literal("CHECK")],
              { additionalProperties: false },
            ),
          ),
          note: __nullable__(t.String()),
          overtimePay: t.Number(),
          leaveDeduction: t.Number(),
          grossEarnings: t.Number(),
          gosiBase: t.Number(),
          employeeGosi: t.Number(),
          companyGosi: t.Number(),
          netPay: t.Number(),
          companyCost: t.Number(),
          issues: __nullable__(t.Any()),
          excluded: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    noteMentions: t.Array(
      t.Object(
        {
          id: t.String(),
          noteId: t.String(),
          staffId: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    labReportMentions: t.Array(
      t.Object(
        {
          id: t.String(),
          itemId: t.String(),
          staffId: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    labCommentMentions: t.Array(
      t.Object(
        {
          id: t.String(),
          commentId: t.String(),
          staffId: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    radiologyCommentMentions: t.Array(
      t.Object(
        {
          id: t.String(),
          commentId: t.String(),
          staffId: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    radiologyAddendumMentions: t.Array(
      t.Object(
        {
          id: t.String(),
          addendumId: t.String(),
          staffId: t.String(),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `إشارة إلى موظّف داخل ملحق — يُخطَر بها في صندوق الوارد`,
        },
      ),
      { additionalProperties: false },
    ),
    taskActivityMentions: t.Array(
      t.Object(
        {
          id: t.String(),
          activityId: t.String(),
          staffId: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
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
    courseTrainerRoles: t.Array(
      t.Object(
        {
          id: t.String(),
          courseId: t.String(),
          staffId: t.String(),
          order: t.Integer(),
          createdAt: t.Date(),
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
    operationTeamMemberships: t.Array(
      t.Object(
        {
          id: t.String(),
          caseId: t.String(),
          staffId: t.String(),
          role: t.Union(
            [
              t.Literal("PRIMARY_SURGEON"),
              t.Literal("ASSISTANT_SURGEON"),
              t.Literal("ANESTHETIST"),
              t.Literal("ANESTHESIA_TECH"),
              t.Literal("SCRUB_NURSE"),
              t.Literal("CIRCULATOR"),
              t.Literal("OBSERVER"),
            ],
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    witnessedOperationConsents: t.Array(
      t.Object(
        {
          id: t.String(),
          caseId: t.String(),
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
          textSnapshot: t.String(),
          estimateLow: __nullable__(t.Number()),
          estimateHigh: __nullable__(t.Number()),
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
          signedAt: __nullable__(t.Date()),
          revokedAt: __nullable__(t.Date()),
          revokeReason: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    witnessedPatientConsents: t.Array(
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
    signedPatientConsents: t.Array(
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
    operationAssessments: t.Array(
      t.Object(
        {
          id: t.String(),
          caseId: t.String(),
          asaClass: __nullable__(t.Integer()),
          asaEmergency: t.Boolean(),
          lastFoodAt: __nullable__(t.Date()),
          lastWaterAt: __nullable__(t.Date()),
          fastingVerified: t.Boolean(),
          vitalsRecordId: __nullable__(t.String()),
          physicalFindings: __nullable__(t.String()),
          airwayAssessment: __nullable__(t.String()),
          medications: __nullable__(t.String()),
          allergies: __nullable__(t.String()),
          bloodworkReviewed: t.Boolean(),
          imagingReviewed: t.Boolean(),
          labOrderId: __nullable__(t.String()),
          radiologyOrderId: __nullable__(t.String()),
          riskNotes: __nullable__(t.String()),
          premedPlan: __nullable__(t.String()),
          assessedById: __nullable__(t.String()),
          assessedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    anesthesiaRecords: t.Array(
      t.Object(
        {
          id: t.String(),
          caseId: t.String(),
          planned: t.Union(
            [
              t.Literal("NONE"),
              t.Literal("ANXIOLYSIS"),
              t.Literal("SEDATION"),
              t.Literal("GENERAL_ANESTHESIA"),
            ],
            { additionalProperties: false },
          ),
          actual: __nullable__(
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
          airway: __nullable__(t.String()),
          ettSize: __nullable__(t.String()),
          circuit: __nullable__(t.String()),
          ivAccess: __nullable__(t.String()),
          monitoringIntervalMin: t.Integer(),
          premedAt: __nullable__(t.Date()),
          inductionAt: __nullable__(t.Date()),
          incisionAt: __nullable__(t.Date()),
          closureAt: __nullable__(t.Date()),
          endAnesthesiaAt: __nullable__(t.Date()),
          extubationAt: __nullable__(t.Date()),
          anesthetistStaffId: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    signedOperationNotes: t.Array(
      t.Object(
        {
          id: t.String(),
          caseId: t.String(),
          proceduresPerformed: __nullable__(t.String()),
          findings: __nullable__(t.String()),
          technique: __nullable__(t.String()),
          estimatedBloodLossMl: __nullable__(t.Integer()),
          complicationsNarrative: __nullable__(t.String()),
          closureDetails: __nullable__(t.String()),
          drainsPlaced: __nullable__(t.String()),
          signedById: __nullable__(t.String()),
          signedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    operationCommentMentions: t.Array(
      t.Object(
        {
          id: t.String(),
          commentId: t.String(),
          staffId: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    vaccinationsAdministered: t.Array(
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
    nutritionPlansPrescribed: t.Array(
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
    nutritionRechecksPerformed: t.Array(
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
    mobileShiftsOpened: t.Array(
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
    groomingSessionsAsGroomer: t.Array(
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
    groomingSessionsAsAssistant: t.Array(
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
    groomingSessionsAsVet: t.Array(
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
    groomingProfilesPreferred: t.Array(
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
    inpatientStaysAttending: t.Array(
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
  },
  { additionalProperties: false },
);

export const StaffPlainInputCreate = t.Object(
  {
    code: t.String(),
    name: t.String(),
    gender: t.Optional(
      __nullable__(
        t.Union(
          [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
          { additionalProperties: false },
        ),
      ),
    ),
    prefix: t.Optional(
      __nullable__(
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
    ),
    age: t.Optional(__nullable__(t.Integer())),
    licenseNumber: t.Optional(__nullable__(t.String())),
    email: t.String(),
    phone: t.Optional(__nullable__(t.String())),
    country: t.Optional(__nullable__(t.String())),
    city: t.Optional(__nullable__(t.String())),
    address: t.Optional(__nullable__(t.String())),
    notes: t.Optional(__nullable__(t.String())),
    bio: t.Optional(__nullable__(t.String())),
    educationalQualification: t.Optional(__nullable__(t.String())),
    nationality: t.Optional(__nullable__(t.String())),
    avatar: t.Optional(__nullable__(t.String())),
    employmentType: t.Optional(
      __nullable__(
        t.Union([t.Literal("FULL_TIME"), t.Literal("PART_TIME")], {
          additionalProperties: false,
        }),
      ),
    ),
    hireDate: t.Optional(__nullable__(t.Date())),
    isSaudi: t.Optional(t.Boolean()),
    status: t.Optional(
      t.Union(
        [t.Literal("PENDING"), t.Literal("ACTIVE"), t.Literal("INACTIVE")],
        { additionalProperties: false },
      ),
    ),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const StaffPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    name: t.Optional(t.String()),
    gender: t.Optional(
      __nullable__(
        t.Union(
          [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
          { additionalProperties: false },
        ),
      ),
    ),
    prefix: t.Optional(
      __nullable__(
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
    ),
    age: t.Optional(__nullable__(t.Integer())),
    licenseNumber: t.Optional(__nullable__(t.String())),
    email: t.Optional(t.String()),
    phone: t.Optional(__nullable__(t.String())),
    country: t.Optional(__nullable__(t.String())),
    city: t.Optional(__nullable__(t.String())),
    address: t.Optional(__nullable__(t.String())),
    notes: t.Optional(__nullable__(t.String())),
    bio: t.Optional(__nullable__(t.String())),
    educationalQualification: t.Optional(__nullable__(t.String())),
    nationality: t.Optional(__nullable__(t.String())),
    avatar: t.Optional(__nullable__(t.String())),
    employmentType: t.Optional(
      __nullable__(
        t.Union([t.Literal("FULL_TIME"), t.Literal("PART_TIME")], {
          additionalProperties: false,
        }),
      ),
    ),
    hireDate: t.Optional(__nullable__(t.Date())),
    isSaudi: t.Optional(t.Boolean()),
    status: t.Optional(
      t.Union(
        [t.Literal("PENDING"), t.Literal("ACTIVE"), t.Literal("INACTIVE")],
        { additionalProperties: false },
      ),
    ),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const StaffRelationsInputCreate = t.Object(
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
    user: t.Optional(
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
    branch: t.Object(
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
    primarySpecialization: t.Optional(
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
    secondarySpecialization: t.Optional(
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
    workingHours: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
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
    substituteFor: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
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
    documents: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    compensation: t.Optional(
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
    payrollLines: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    noteMentions: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    labReportMentions: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    labCommentMentions: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    radiologyCommentMentions: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    radiologyAddendumMentions: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    taskActivityMentions: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
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
    courseTrainerRoles: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
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
    operationTeamMemberships: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    witnessedOperationConsents: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    witnessedPatientConsents: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    signedPatientConsents: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    operationAssessments: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    anesthesiaRecords: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    signedOperationNotes: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    operationCommentMentions: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    vaccinationsAdministered: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    nutritionPlansPrescribed: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    nutritionRechecksPerformed: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
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
    mobileShiftsOpened: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
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
    groomingSessionsAsGroomer: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    groomingSessionsAsAssistant: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    groomingSessionsAsVet: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    groomingProfilesPreferred: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    inpatientStaysAttending: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
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

export const StaffRelationsInputUpdate = t.Partial(
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
      user: t.Partial(
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
      branch: t.Object(
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
      primarySpecialization: t.Partial(
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
      secondarySpecialization: t.Partial(
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
      workingHours: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
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
      substituteFor: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
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
      documents: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      compensation: t.Partial(
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
      payrollLines: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      noteMentions: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      labReportMentions: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      labCommentMentions: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      radiologyCommentMentions: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      radiologyAddendumMentions: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      taskActivityMentions: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
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
      courseTrainerRoles: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
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
      operationTeamMemberships: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      witnessedOperationConsents: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      witnessedPatientConsents: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      signedPatientConsents: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      operationAssessments: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      anesthesiaRecords: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      signedOperationNotes: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      operationCommentMentions: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      vaccinationsAdministered: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      nutritionPlansPrescribed: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      nutritionRechecksPerformed: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
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
      mobileShiftsOpened: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
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
      groomingSessionsAsGroomer: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      groomingSessionsAsAssistant: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      groomingSessionsAsVet: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      groomingProfilesPreferred: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      inpatientStaysAttending: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
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

export const StaffWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          userId: t.String(),
          roleId: t.String(),
          branchId: t.String(),
          name: t.String(),
          gender: t.Union(
            [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
            { additionalProperties: false },
          ),
          prefix: t.Union(
            [
              t.Literal("MR"),
              t.Literal("MRS"),
              t.Literal("MS"),
              t.Literal("DR"),
              t.Literal("PROF"),
            ],
            { additionalProperties: false },
          ),
          age: t.Integer(),
          licenseNumber: t.String(),
          email: t.String(),
          phone: t.String(),
          country: t.String(),
          city: t.String(),
          address: t.String(),
          notes: t.String(),
          bio: t.String(),
          educationalQualification: t.String(),
          nationality: t.String(),
          avatar: t.String(),
          primarySpecializationId: t.String(),
          secondarySpecializationId: t.String(),
          employmentType: t.Union(
            [t.Literal("FULL_TIME"), t.Literal("PART_TIME")],
            { additionalProperties: false },
          ),
          hireDate: t.Date(),
          isSaudi: t.Boolean(),
          status: t.Union(
            [t.Literal("PENDING"), t.Literal("ACTIVE"), t.Literal("INACTIVE")],
            { additionalProperties: false },
          ),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Staff" },
  ),
);

export const StaffWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              code: t.String(),
              clinicId_email: t.Object(
                { clinicId: t.String(), email: t.String() },
                { additionalProperties: false },
              ),
            },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({ code: t.String() }),
            t.Object({
              clinicId_email: t.Object(
                { clinicId: t.String(), email: t.String() },
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
              code: t.String(),
              clinicId: t.String(),
              userId: t.String(),
              roleId: t.String(),
              branchId: t.String(),
              name: t.String(),
              gender: t.Union(
                [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
                { additionalProperties: false },
              ),
              prefix: t.Union(
                [
                  t.Literal("MR"),
                  t.Literal("MRS"),
                  t.Literal("MS"),
                  t.Literal("DR"),
                  t.Literal("PROF"),
                ],
                { additionalProperties: false },
              ),
              age: t.Integer(),
              licenseNumber: t.String(),
              email: t.String(),
              phone: t.String(),
              country: t.String(),
              city: t.String(),
              address: t.String(),
              notes: t.String(),
              bio: t.String(),
              educationalQualification: t.String(),
              nationality: t.String(),
              avatar: t.String(),
              primarySpecializationId: t.String(),
              secondarySpecializationId: t.String(),
              employmentType: t.Union(
                [t.Literal("FULL_TIME"), t.Literal("PART_TIME")],
                { additionalProperties: false },
              ),
              hireDate: t.Date(),
              isSaudi: t.Boolean(),
              status: t.Union(
                [
                  t.Literal("PENDING"),
                  t.Literal("ACTIVE"),
                  t.Literal("INACTIVE"),
                ],
                { additionalProperties: false },
              ),
              active: t.Boolean(),
              isDeleted: t.Boolean(),
              deletedAt: t.Date(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Staff" },
);

export const StaffSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      userId: t.Boolean(),
      roleId: t.Boolean(),
      branchId: t.Boolean(),
      name: t.Boolean(),
      gender: t.Boolean(),
      prefix: t.Boolean(),
      age: t.Boolean(),
      licenseNumber: t.Boolean(),
      email: t.Boolean(),
      phone: t.Boolean(),
      country: t.Boolean(),
      city: t.Boolean(),
      address: t.Boolean(),
      notes: t.Boolean(),
      bio: t.Boolean(),
      educationalQualification: t.Boolean(),
      nationality: t.Boolean(),
      avatar: t.Boolean(),
      primarySpecializationId: t.Boolean(),
      secondarySpecializationId: t.Boolean(),
      employmentType: t.Boolean(),
      hireDate: t.Boolean(),
      isSaudi: t.Boolean(),
      status: t.Boolean(),
      active: t.Boolean(),
      isDeleted: t.Boolean(),
      deletedAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      user: t.Boolean(),
      role: t.Boolean(),
      roleAssignments: t.Boolean(),
      branch: t.Boolean(),
      primarySpecialization: t.Boolean(),
      secondarySpecialization: t.Boolean(),
      invites: t.Boolean(),
      schedulingSettings: t.Boolean(),
      workingHours: t.Boolean(),
      services: t.Boolean(),
      consultationTypes: t.Boolean(),
      appointments: t.Boolean(),
      attendances: t.Boolean(),
      shiftAssignments: t.Boolean(),
      leaveRequests: t.Boolean(),
      substituteFor: t.Boolean(),
      compensatoryEntries: t.Boolean(),
      documents: t.Boolean(),
      compensation: t.Boolean(),
      payrollLines: t.Boolean(),
      noteMentions: t.Boolean(),
      labReportMentions: t.Boolean(),
      labCommentMentions: t.Boolean(),
      radiologyCommentMentions: t.Boolean(),
      radiologyAddendumMentions: t.Boolean(),
      taskActivityMentions: t.Boolean(),
      expenses: t.Boolean(),
      eosSettlements: t.Boolean(),
      courseAssignments: t.Boolean(),
      courseCertificates: t.Boolean(),
      courseTrainerRoles: t.Boolean(),
      courseReviews: t.Boolean(),
      quizAssignments: t.Boolean(),
      operationTeamMemberships: t.Boolean(),
      witnessedOperationConsents: t.Boolean(),
      witnessedPatientConsents: t.Boolean(),
      signedPatientConsents: t.Boolean(),
      operationAssessments: t.Boolean(),
      anesthesiaRecords: t.Boolean(),
      signedOperationNotes: t.Boolean(),
      operationCommentMentions: t.Boolean(),
      vaccinationsAdministered: t.Boolean(),
      nutritionPlansPrescribed: t.Boolean(),
      nutritionRechecksPerformed: t.Boolean(),
      mobileUnitCrew: t.Boolean(),
      mobileShiftsOpened: t.Boolean(),
      mobileVisitServices: t.Boolean(),
      groomingSessionsAsGroomer: t.Boolean(),
      groomingSessionsAsAssistant: t.Boolean(),
      groomingSessionsAsVet: t.Boolean(),
      groomingProfilesPreferred: t.Boolean(),
      inpatientStaysAttending: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const StaffInclude = t.Partial(
  t.Object(
    {
      gender: t.Boolean(),
      prefix: t.Boolean(),
      employmentType: t.Boolean(),
      status: t.Boolean(),
      clinic: t.Boolean(),
      user: t.Boolean(),
      role: t.Boolean(),
      roleAssignments: t.Boolean(),
      branch: t.Boolean(),
      primarySpecialization: t.Boolean(),
      secondarySpecialization: t.Boolean(),
      invites: t.Boolean(),
      schedulingSettings: t.Boolean(),
      workingHours: t.Boolean(),
      services: t.Boolean(),
      consultationTypes: t.Boolean(),
      appointments: t.Boolean(),
      attendances: t.Boolean(),
      shiftAssignments: t.Boolean(),
      leaveRequests: t.Boolean(),
      substituteFor: t.Boolean(),
      compensatoryEntries: t.Boolean(),
      documents: t.Boolean(),
      compensation: t.Boolean(),
      payrollLines: t.Boolean(),
      noteMentions: t.Boolean(),
      labReportMentions: t.Boolean(),
      labCommentMentions: t.Boolean(),
      radiologyCommentMentions: t.Boolean(),
      radiologyAddendumMentions: t.Boolean(),
      taskActivityMentions: t.Boolean(),
      expenses: t.Boolean(),
      eosSettlements: t.Boolean(),
      courseAssignments: t.Boolean(),
      courseCertificates: t.Boolean(),
      courseTrainerRoles: t.Boolean(),
      courseReviews: t.Boolean(),
      quizAssignments: t.Boolean(),
      operationTeamMemberships: t.Boolean(),
      witnessedOperationConsents: t.Boolean(),
      witnessedPatientConsents: t.Boolean(),
      signedPatientConsents: t.Boolean(),
      operationAssessments: t.Boolean(),
      anesthesiaRecords: t.Boolean(),
      signedOperationNotes: t.Boolean(),
      operationCommentMentions: t.Boolean(),
      vaccinationsAdministered: t.Boolean(),
      nutritionPlansPrescribed: t.Boolean(),
      nutritionRechecksPerformed: t.Boolean(),
      mobileUnitCrew: t.Boolean(),
      mobileShiftsOpened: t.Boolean(),
      mobileVisitServices: t.Boolean(),
      groomingSessionsAsGroomer: t.Boolean(),
      groomingSessionsAsAssistant: t.Boolean(),
      groomingSessionsAsVet: t.Boolean(),
      groomingProfilesPreferred: t.Boolean(),
      inpatientStaysAttending: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const StaffOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      code: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      roleId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      branchId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      age: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      licenseNumber: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      email: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      phone: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      country: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      city: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      address: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      bio: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      educationalQualification: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      nationality: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      avatar: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      primarySpecializationId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      secondarySpecializationId: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      hireDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isSaudi: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      active: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDeleted: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      deletedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Staff = t.Composite([StaffPlain, StaffRelations], {
  additionalProperties: false,
});

export const StaffInputCreate = t.Composite(
  [StaffPlainInputCreate, StaffRelationsInputCreate],
  { additionalProperties: false },
);

export const StaffInputUpdate = t.Composite(
  [StaffPlainInputUpdate, StaffRelationsInputUpdate],
  { additionalProperties: false },
);
