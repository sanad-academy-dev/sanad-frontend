import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ExpensePlain = t.Object(
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
        [t.Literal("ONE_DAY"), t.Literal("TWO_DAYS"), t.Literal("THREE_DAYS")],
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
    reviewRecipientIds: t.Array(t.String(), { additionalProperties: false }),
    reviewSentAt: __nullable__(t.Date()),
    editsCount: t.Integer(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const ExpenseRelations = t.Object(
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
    requester: t.Object(
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
    decidedBy: __nullable__(
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
    branch: __nullable__(
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
    ),
    supplier: __nullable__(
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
    ),
    staff: __nullable__(
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
    ),
    deduction: __nullable__(
      t.Object(
        {
          id: t.String(),
          lineId: t.String(),
          type: t.Union(
            [
              t.Literal("ADVANCE"),
              t.Literal("LOAN_INSTALLMENT"),
              t.Literal("PENALTY"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          amount: t.Number(),
          note: __nullable__(t.String()),
          sourceExpenseId: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    attachments: t.Array(
      t.Object(
        {
          id: t.String(),
          expenseId: t.String(),
          kind: t.Union([t.Literal("LINK"), t.Literal("DOCUMENT")], {
            additionalProperties: false,
          }),
          label: t.String(),
          url: t.String(),
          sizeBytes: __nullable__(t.Integer()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    steps: t.Array(
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
  },
  { additionalProperties: false },
);

export const ExpensePlainInputCreate = t.Object(
  {
    code: t.String(),
    name: t.String(),
    status: t.Optional(
      t.Union(
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
    ),
    amount: t.Number(),
    source: t.Optional(
      t.Union(
        [
          t.Literal("MANUAL"),
          t.Literal("PAYROLL_RUN"),
          t.Literal("END_OF_SERVICE"),
          t.Literal("PURCHASE_ORDER"),
        ],
        { additionalProperties: false },
      ),
    ),
    expenseDate: t.Optional(__nullable__(t.Date())),
    recoverFromPayroll: t.Optional(t.Boolean()),
    paymentMethod: t.Optional(
      __nullable__(
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
    ),
    categoryLabel: t.Optional(__nullable__(t.String())),
    departmentLabel: t.Optional(__nullable__(t.String())),
    notes: t.Optional(__nullable__(t.String())),
    reminderEnabled: t.Optional(t.Boolean()),
    reminderOffset: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("ONE_DAY"),
            t.Literal("TWO_DAYS"),
            t.Literal("THREE_DAYS"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    rejectionReason: t.Optional(__nullable__(t.String())),
    cancelReason: t.Optional(__nullable__(t.String())),
    signed: t.Optional(t.Boolean()),
    signatureName: t.Optional(__nullable__(t.String())),
    decisionAt: t.Optional(__nullable__(t.Date())),
    reviewSubject: t.Optional(__nullable__(t.String())),
    reviewBody: t.Optional(__nullable__(t.String())),
    reviewRecipientIds: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
    reviewSentAt: t.Optional(__nullable__(t.Date())),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const ExpensePlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    name: t.Optional(t.String()),
    status: t.Optional(
      t.Union(
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
    ),
    amount: t.Optional(t.Number()),
    source: t.Optional(
      t.Union(
        [
          t.Literal("MANUAL"),
          t.Literal("PAYROLL_RUN"),
          t.Literal("END_OF_SERVICE"),
          t.Literal("PURCHASE_ORDER"),
        ],
        { additionalProperties: false },
      ),
    ),
    expenseDate: t.Optional(__nullable__(t.Date())),
    recoverFromPayroll: t.Optional(t.Boolean()),
    paymentMethod: t.Optional(
      __nullable__(
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
    ),
    categoryLabel: t.Optional(__nullable__(t.String())),
    departmentLabel: t.Optional(__nullable__(t.String())),
    notes: t.Optional(__nullable__(t.String())),
    reminderEnabled: t.Optional(t.Boolean()),
    reminderOffset: t.Optional(
      __nullable__(
        t.Union(
          [
            t.Literal("ONE_DAY"),
            t.Literal("TWO_DAYS"),
            t.Literal("THREE_DAYS"),
          ],
          { additionalProperties: false },
        ),
      ),
    ),
    rejectionReason: t.Optional(__nullable__(t.String())),
    cancelReason: t.Optional(__nullable__(t.String())),
    signed: t.Optional(t.Boolean()),
    signatureName: t.Optional(__nullable__(t.String())),
    decisionAt: t.Optional(__nullable__(t.Date())),
    reviewSubject: t.Optional(__nullable__(t.String())),
    reviewBody: t.Optional(__nullable__(t.String())),
    reviewRecipientIds: t.Optional(
      t.Array(t.String(), { additionalProperties: false }),
    ),
    reviewSentAt: t.Optional(__nullable__(t.Date())),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const ExpenseRelationsInputCreate = t.Object(
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
    requester: t.Object(
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
    decidedBy: t.Optional(
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
    branch: t.Optional(
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
    supplier: t.Optional(
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
    staff: t.Optional(
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
    deduction: t.Optional(
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
    attachments: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    steps: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
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

export const ExpenseRelationsInputUpdate = t.Partial(
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
      requester: t.Object(
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
      decidedBy: t.Partial(
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
      branch: t.Partial(
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
      supplier: t.Partial(
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
      staff: t.Partial(
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
      deduction: t.Partial(
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
      attachments: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      steps: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
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

export const ExpenseWhere = t.Partial(
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
          sourceId: t.String(),
          expenseDate: t.Date(),
          staffId: t.String(),
          recoverFromPayroll: t.Boolean(),
          paymentMethod: t.Union(
            [
              t.Literal("CASH"),
              t.Literal("BANK_TRANSFER"),
              t.Literal("CARD"),
              t.Literal("CHEQUE"),
              t.Literal("TREASURY"),
            ],
            { additionalProperties: false },
          ),
          categoryLabel: t.String(),
          departmentLabel: t.String(),
          branchId: t.String(),
          requesterId: t.String(),
          supplierId: t.String(),
          notes: t.String(),
          reminderEnabled: t.Boolean(),
          reminderOffset: t.Union(
            [
              t.Literal("ONE_DAY"),
              t.Literal("TWO_DAYS"),
              t.Literal("THREE_DAYS"),
            ],
            { additionalProperties: false },
          ),
          rejectionReason: t.String(),
          cancelReason: t.String(),
          signed: t.Boolean(),
          signatureName: t.String(),
          decisionAt: t.Date(),
          decidedById: t.String(),
          reviewSubject: t.String(),
          reviewBody: t.String(),
          reviewRecipientIds: t.Array(t.String(), {
            additionalProperties: false,
          }),
          reviewSentAt: t.Date(),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Expense" },
  ),
);

export const ExpenseWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              code: t.String(),
              source_sourceId: t.Object(
                {
                  source: t.Union(
                    [
                      t.Literal("MANUAL"),
                      t.Literal("PAYROLL_RUN"),
                      t.Literal("END_OF_SERVICE"),
                      t.Literal("PURCHASE_ORDER"),
                    ],
                    { additionalProperties: false },
                  ),
                  sourceId: t.String(),
                },
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
              source_sourceId: t.Object(
                {
                  source: t.Union(
                    [
                      t.Literal("MANUAL"),
                      t.Literal("PAYROLL_RUN"),
                      t.Literal("END_OF_SERVICE"),
                      t.Literal("PURCHASE_ORDER"),
                    ],
                    { additionalProperties: false },
                  ),
                  sourceId: t.String(),
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
              sourceId: t.String(),
              expenseDate: t.Date(),
              staffId: t.String(),
              recoverFromPayroll: t.Boolean(),
              paymentMethod: t.Union(
                [
                  t.Literal("CASH"),
                  t.Literal("BANK_TRANSFER"),
                  t.Literal("CARD"),
                  t.Literal("CHEQUE"),
                  t.Literal("TREASURY"),
                ],
                { additionalProperties: false },
              ),
              categoryLabel: t.String(),
              departmentLabel: t.String(),
              branchId: t.String(),
              requesterId: t.String(),
              supplierId: t.String(),
              notes: t.String(),
              reminderEnabled: t.Boolean(),
              reminderOffset: t.Union(
                [
                  t.Literal("ONE_DAY"),
                  t.Literal("TWO_DAYS"),
                  t.Literal("THREE_DAYS"),
                ],
                { additionalProperties: false },
              ),
              rejectionReason: t.String(),
              cancelReason: t.String(),
              signed: t.Boolean(),
              signatureName: t.String(),
              decisionAt: t.Date(),
              decidedById: t.String(),
              reviewSubject: t.String(),
              reviewBody: t.String(),
              reviewRecipientIds: t.Array(t.String(), {
                additionalProperties: false,
              }),
              reviewSentAt: t.Date(),
              editsCount: t.Integer(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Expense" },
);

export const ExpenseSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      name: t.Boolean(),
      status: t.Boolean(),
      amount: t.Boolean(),
      source: t.Boolean(),
      sourceId: t.Boolean(),
      expenseDate: t.Boolean(),
      staffId: t.Boolean(),
      recoverFromPayroll: t.Boolean(),
      paymentMethod: t.Boolean(),
      categoryLabel: t.Boolean(),
      departmentLabel: t.Boolean(),
      branchId: t.Boolean(),
      requesterId: t.Boolean(),
      supplierId: t.Boolean(),
      notes: t.Boolean(),
      reminderEnabled: t.Boolean(),
      reminderOffset: t.Boolean(),
      rejectionReason: t.Boolean(),
      cancelReason: t.Boolean(),
      signed: t.Boolean(),
      signatureName: t.Boolean(),
      decisionAt: t.Boolean(),
      decidedById: t.Boolean(),
      reviewSubject: t.Boolean(),
      reviewBody: t.Boolean(),
      reviewRecipientIds: t.Boolean(),
      reviewSentAt: t.Boolean(),
      editsCount: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      requester: t.Boolean(),
      decidedBy: t.Boolean(),
      branch: t.Boolean(),
      supplier: t.Boolean(),
      staff: t.Boolean(),
      deduction: t.Boolean(),
      attachments: t.Boolean(),
      steps: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ExpenseInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      source: t.Boolean(),
      paymentMethod: t.Boolean(),
      reminderOffset: t.Boolean(),
      clinic: t.Boolean(),
      requester: t.Boolean(),
      decidedBy: t.Boolean(),
      branch: t.Boolean(),
      supplier: t.Boolean(),
      staff: t.Boolean(),
      deduction: t.Boolean(),
      attachments: t.Boolean(),
      steps: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ExpenseOrderBy = t.Partial(
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
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      amount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sourceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      expenseDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      staffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      recoverFromPayroll: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      categoryLabel: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      departmentLabel: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      branchId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      requesterId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      supplierId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reminderEnabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rejectionReason: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      cancelReason: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      signed: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      signatureName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      decisionAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      decidedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reviewSubject: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reviewBody: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reviewRecipientIds: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reviewSentAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      editsCount: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Expense = t.Composite([ExpensePlain, ExpenseRelations], {
  additionalProperties: false,
});

export const ExpenseInputCreate = t.Composite(
  [ExpensePlainInputCreate, ExpenseRelationsInputCreate],
  { additionalProperties: false },
);

export const ExpenseInputUpdate = t.Composite(
  [ExpensePlainInputUpdate, ExpenseRelationsInputUpdate],
  { additionalProperties: false },
);
