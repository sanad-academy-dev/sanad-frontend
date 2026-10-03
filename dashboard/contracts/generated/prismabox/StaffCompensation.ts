import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const StaffCompensationPlain = t.Object(
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
);

export const StaffCompensationRelations = t.Object(
  {
    staff: t.Object(
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
    allowances: t.Array(
      t.Object(
        {
          id: t.String(),
          compensationId: t.String(),
          type: t.Union(
            [
              t.Literal("HOUSING"),
              t.Literal("TRANSPORT"),
              t.Literal("FOOD"),
              t.Literal("PHONE"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          amount: t.Number(),
          note: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const StaffCompensationPlainInputCreate = t.Object(
  {
    baseSalary: t.Number(),
    iban: t.Optional(__nullable__(t.String())),
    bankName: t.Optional(__nullable__(t.String())),
    defaultPaymentMethod: t.Optional(
      t.Union([t.Literal("TRANSFER"), t.Literal("CASH"), t.Literal("CHECK")], {
        additionalProperties: false,
      }),
    ),
    effectiveFrom: t.Optional(__nullable__(t.Date())),
    notes: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const StaffCompensationPlainInputUpdate = t.Object(
  {
    baseSalary: t.Optional(t.Number()),
    iban: t.Optional(__nullable__(t.String())),
    bankName: t.Optional(__nullable__(t.String())),
    defaultPaymentMethod: t.Optional(
      t.Union([t.Literal("TRANSFER"), t.Literal("CASH"), t.Literal("CHECK")], {
        additionalProperties: false,
      }),
    ),
    effectiveFrom: t.Optional(__nullable__(t.Date())),
    notes: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const StaffCompensationRelationsInputCreate = t.Object(
  {
    staff: t.Object(
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
    allowances: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
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

export const StaffCompensationRelationsInputUpdate = t.Partial(
  t.Object(
    {
      staff: t.Object(
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
      allowances: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
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

export const StaffCompensationWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          staffId: t.String(),
          baseSalary: t.Number(),
          iban: t.String(),
          bankName: t.String(),
          defaultPaymentMethod: t.Union(
            [t.Literal("TRANSFER"), t.Literal("CASH"), t.Literal("CHECK")],
            { additionalProperties: false },
          ),
          effectiveFrom: t.Date(),
          notes: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "StaffCompensation" },
  ),
);

export const StaffCompensationWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), staffId: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ staffId: t.String() })],
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
              staffId: t.String(),
              baseSalary: t.Number(),
              iban: t.String(),
              bankName: t.String(),
              defaultPaymentMethod: t.Union(
                [t.Literal("TRANSFER"), t.Literal("CASH"), t.Literal("CHECK")],
                { additionalProperties: false },
              ),
              effectiveFrom: t.Date(),
              notes: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "StaffCompensation" },
);

export const StaffCompensationSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      staffId: t.Boolean(),
      baseSalary: t.Boolean(),
      iban: t.Boolean(),
      bankName: t.Boolean(),
      defaultPaymentMethod: t.Boolean(),
      effectiveFrom: t.Boolean(),
      notes: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      staff: t.Boolean(),
      allowances: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const StaffCompensationInclude = t.Partial(
  t.Object(
    {
      defaultPaymentMethod: t.Boolean(),
      staff: t.Boolean(),
      allowances: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const StaffCompensationOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      staffId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      baseSalary: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      iban: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      bankName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      effectiveFrom: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const StaffCompensation = t.Composite(
  [StaffCompensationPlain, StaffCompensationRelations],
  { additionalProperties: false },
);

export const StaffCompensationInputCreate = t.Composite(
  [StaffCompensationPlainInputCreate, StaffCompensationRelationsInputCreate],
  { additionalProperties: false },
);

export const StaffCompensationInputUpdate = t.Composite(
  [StaffCompensationPlainInputUpdate, StaffCompensationRelationsInputUpdate],
  { additionalProperties: false },
);
