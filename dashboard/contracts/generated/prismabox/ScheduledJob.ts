import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ScheduledJobPlain = t.Object(
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
);

export const ScheduledJobRelations = t.Object(
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
);

export const ScheduledJobPlainInputCreate = t.Object(
  {
    jobType: t.String({
      description: `مفتاح المعالِج في سجلّ المُجدوِل — نصّ لا تعداد، كي تُسجِّل الوحداتُ
معالجاتِها بلا ترحيلٍ في كل مرّة (نفس عُرف \`AccountingJob.jobType\`).`,
    }),
    status: t.Optional(
      t.Union(
        [
          t.Literal("QUEUED"),
          t.Literal("IN_PROGRESS"),
          t.Literal("COMPLETED"),
          t.Literal("FAILED"),
          t.Literal("CANCELLED"),
        ],
        { additionalProperties: false },
      ),
    ),
    payload: t.Optional(__nullable__(t.Any())),
    idempotencyKey: t.String({
      description: `الفرادة هي الميزة كلّها: \`(clinicId, jobType, idempotencyKey)\` فريد، فإدراج
نفس العمل مرّتين يعيد الصفّ القائم بدل خلق ثانٍ. cron كل خمس دقائق على مِفتاحٍ
يوميّ ⇒ وظيفة واحدة في اليوم.`,
    }),
    scheduledFor: t.Optional(
      t.Date({
        description: `لا يُلتقط قبل هذه اللحظة — به تُبنى التأجيلات وساعات الهدوء`,
      }),
    ),
    attempts: t.Optional(t.Integer()),
    maxAttempts: t.Optional(t.Integer()),
    startedAt: t.Optional(__nullable__(t.Date())),
    finishedAt: t.Optional(__nullable__(t.Date())),
    errorMessage: t.Optional(__nullable__(t.String())),
    result: t.Optional(
      __nullable__(
        t.Any({
          description: `ملخّص ما فعله التشغيل — يُقرأ في شاشة المراقبة بلا فتح السجلّات`,
        }),
      ),
    ),
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
);

export const ScheduledJobPlainInputUpdate = t.Object(
  {
    jobType: t.Optional(
      t.String({
        description: `مفتاح المعالِج في سجلّ المُجدوِل — نصّ لا تعداد، كي تُسجِّل الوحداتُ
معالجاتِها بلا ترحيلٍ في كل مرّة (نفس عُرف \`AccountingJob.jobType\`).`,
      }),
    ),
    status: t.Optional(
      t.Union(
        [
          t.Literal("QUEUED"),
          t.Literal("IN_PROGRESS"),
          t.Literal("COMPLETED"),
          t.Literal("FAILED"),
          t.Literal("CANCELLED"),
        ],
        { additionalProperties: false },
      ),
    ),
    payload: t.Optional(__nullable__(t.Any())),
    idempotencyKey: t.Optional(
      t.String({
        description: `الفرادة هي الميزة كلّها: \`(clinicId, jobType, idempotencyKey)\` فريد، فإدراج
نفس العمل مرّتين يعيد الصفّ القائم بدل خلق ثانٍ. cron كل خمس دقائق على مِفتاحٍ
يوميّ ⇒ وظيفة واحدة في اليوم.`,
      }),
    ),
    scheduledFor: t.Optional(
      t.Date({
        description: `لا يُلتقط قبل هذه اللحظة — به تُبنى التأجيلات وساعات الهدوء`,
      }),
    ),
    attempts: t.Optional(t.Integer()),
    maxAttempts: t.Optional(t.Integer()),
    startedAt: t.Optional(__nullable__(t.Date())),
    finishedAt: t.Optional(__nullable__(t.Date())),
    errorMessage: t.Optional(__nullable__(t.String())),
    result: t.Optional(
      __nullable__(
        t.Any({
          description: `ملخّص ما فعله التشغيل — يُقرأ في شاشة المراقبة بلا فتح السجلّات`,
        }),
      ),
    ),
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
);

export const ScheduledJobRelationsInputCreate = t.Object(
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
);

export const ScheduledJobRelationsInputUpdate = t.Partial(
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
);

export const ScheduledJobWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
          payload: t.Any(),
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
          startedAt: t.Date(),
          finishedAt: t.Date(),
          errorMessage: t.String(),
          result: t.Any({
            description: `ملخّص ما فعله التشغيل — يُقرأ في شاشة المراقبة بلا فتح السجلّات`,
          }),
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
    { $id: "ScheduledJob" },
  ),
);

export const ScheduledJobWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_jobType_idempotencyKey: t.Object(
                {
                  clinicId: t.String(),
                  jobType: t.String({
                    description: `مفتاح المعالِج في سجلّ المُجدوِل — نصّ لا تعداد، كي تُسجِّل الوحداتُ
معالجاتِها بلا ترحيلٍ في كل مرّة (نفس عُرف \`AccountingJob.jobType\`).`,
                  }),
                  idempotencyKey: t.String({
                    description: `الفرادة هي الميزة كلّها: \`(clinicId, jobType, idempotencyKey)\` فريد، فإدراج
نفس العمل مرّتين يعيد الصفّ القائم بدل خلق ثانٍ. cron كل خمس دقائق على مِفتاحٍ
يوميّ ⇒ وظيفة واحدة في اليوم.`,
                  }),
                },
                { additionalProperties: false },
              ),
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
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              clinicId_jobType_idempotencyKey: t.Object(
                {
                  clinicId: t.String(),
                  jobType: t.String({
                    description: `مفتاح المعالِج في سجلّ المُجدوِل — نصّ لا تعداد، كي تُسجِّل الوحداتُ
معالجاتِها بلا ترحيلٍ في كل مرّة (نفس عُرف \`AccountingJob.jobType\`).`,
                  }),
                  idempotencyKey: t.String({
                    description: `الفرادة هي الميزة كلّها: \`(clinicId, jobType, idempotencyKey)\` فريد، فإدراج
نفس العمل مرّتين يعيد الصفّ القائم بدل خلق ثانٍ. cron كل خمس دقائق على مِفتاحٍ
يوميّ ⇒ وظيفة واحدة في اليوم.`,
                  }),
                },
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
              payload: t.Any(),
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
              startedAt: t.Date(),
              finishedAt: t.Date(),
              errorMessage: t.String(),
              result: t.Any({
                description: `ملخّص ما فعله التشغيل — يُقرأ في شاشة المراقبة بلا فتح السجلّات`,
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
  { $id: "ScheduledJob" },
);

export const ScheduledJobSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      jobType: t.Boolean(),
      status: t.Boolean(),
      payload: t.Boolean(),
      idempotencyKey: t.Boolean(),
      scheduledFor: t.Boolean(),
      attempts: t.Boolean(),
      maxAttempts: t.Boolean(),
      startedAt: t.Boolean(),
      finishedAt: t.Boolean(),
      errorMessage: t.Boolean(),
      result: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
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
);

export const ScheduledJobInclude = t.Partial(
  t.Object(
    { status: t.Boolean(), clinic: t.Boolean(), _count: t.Boolean() },
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
);

export const ScheduledJobOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      jobType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      payload: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      idempotencyKey: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      scheduledFor: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      attempts: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      maxAttempts: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      startedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      finishedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      errorMessage: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      result: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `وحدة عملٍ مؤجَّلة. الصفُّ **هو** الطابور: لا Redis ولا عامل منفصل في هذه
الحزمة (\`docs/deployment.md\`: عملية Nitro واحدة على خادم واحد)، والحالة في
قاعدة البيانات تنجو من إعادة التشغيل بينما طابور الذاكرة لا ينجو.
نفس فكرة \`AccountingJob\` [P0.5] وبنفس دلالات المطالبة الذرّية — ومُعمَّمة عمدًا
خارج المحاسبة لأن التذكيرات والاستدعاء والصيانة كلها تحتاج المِرفق ذاته. لم
يُوسَّع \`AccountingJob\` نفسه لأن حراس المحاسبة (BRD AR-7) يفترضون أن كل صفٍّ فيه
قيدٌ محاسبيّ، والتذكير ليس كذلك.`,
    },
  ),
);

export const ScheduledJob = t.Composite(
  [ScheduledJobPlain, ScheduledJobRelations],
  { additionalProperties: false },
);

export const ScheduledJobInputCreate = t.Composite(
  [ScheduledJobPlainInputCreate, ScheduledJobRelationsInputCreate],
  { additionalProperties: false },
);

export const ScheduledJobInputUpdate = t.Composite(
  [ScheduledJobPlainInputUpdate, ScheduledJobRelationsInputUpdate],
  { additionalProperties: false },
);
