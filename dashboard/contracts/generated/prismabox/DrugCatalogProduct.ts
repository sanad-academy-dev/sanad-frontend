import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DrugCatalogProductPlain = t.Object(
  {
    id: t.String(),
    standardId: t.String(),
    registerNumber: t.String(),
    tradeName: t.String(),
    tradeNameAr: __nullable__(t.String()),
    genericName: t.String(),
    genericNameAr: __nullable__(t.String()),
    genericKey: t.String(),
    strength: __nullable__(t.String()),
    strengthUnit: __nullable__(t.String()),
    dosageForm: __nullable__(t.String()),
    routeOfAdministration: __nullable__(t.String()),
    packageType: __nullable__(t.String()),
    packageSize: __nullable__(t.String()),
    packageUnit: __nullable__(t.String()),
    drugType: __nullable__(t.String()),
    subType: __nullable__(t.String()),
    legalStatus: __nullable__(t.String()),
    authorizationStatus: __nullable__(t.String()),
    marketingStatus: __nullable__(t.String()),
    shelfLifeMonths: __nullable__(t.Integer()),
    storageConditions: __nullable__(t.String()),
    manufacturerName: __nullable__(t.String()),
    manufacturerCountry: __nullable__(t.String()),
    marketingCompany: __nullable__(t.String()),
    agentName: __nullable__(t.String()),
    atcVetCode: __nullable__(t.String()),
    distributionArea: __nullable__(t.String()),
    registrationYear: __nullable__(t.Integer()),
    withdrawalPeriod: __nullable__(t.String()),
    targetAnimalsRaw: __nullable__(t.String()),
    allSpecies: t.Boolean(),
    therapeuticClassCode: __nullable__(t.String()),
    searchText: t.String(),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const DrugCatalogProductRelations = t.Object(
  {
    standard: t.Object(
      {
        id: t.String(),
        code: t.String(),
        nameEn: t.String(),
        nameAr: t.String(),
        countryCode: t.String(),
        authorityEn: t.String(),
        authorityAr: t.String(),
        sourceUrl: t.String(),
        dataVersion: t.String(),
        fetchedAt: t.Date(),
        productCount: t.Integer(),
        isActive: t.Boolean(),
        coverageNoteAr: __nullable__(t.String()),
        coverageNoteEn: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    therapeuticClass: __nullable__(
      t.Object(
        {
          code: t.String(),
          nameEn: t.String(),
          nameAr: t.String(),
          source: t.String(),
          order: t.Integer(),
        },
        { additionalProperties: false },
      ),
    ),
    species: t.Array(
      t.Object(
        {
          id: t.String(),
          productId: t.String(),
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
    prescriptionItems: t.Array(
      t.Object(
        {
          id: t.String(),
          prescriptionId: t.String(),
          idx: t.Integer(),
          inventoryItemId: __nullable__(
            t.String({
              description: `أحد ثلاثة يُحلّ: صنف مخزون، أو مستحضر مسجَّل بلا مخزون، أو نصّ حرّ. نفس
تسامح \`appointment_product\` مع الصنف الحرّ — الطبيب قد يصف ما لا تبيعه العيادة.`,
            }),
          ),
          catalogProductId: __nullable__(t.String()),
          nameSnapshot: t.String(),
          doseAmount: __nullable__(t.Number()),
          doseUnit: __nullable__(t.String()),
          route: __nullable__(t.String()),
          frequency: __nullable__(t.String()),
          durationDays: __nullable__(t.Integer()),
          quantity: t.Number({
            description: `ما يستهلكه الصرف والفوترة (BR-P4.2.1)`,
          }),
          quantityUnit: t.String(),
          prn: t.Boolean(),
          instructionsAr: t.String(),
          refillsAllowed: t.Integer(),
          refillsUsed: t.Integer(),
          doseSource: t.Union(
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
          overrideReasonAr: __nullable__(
            t.String({
              description: `سبب تجاوز المدى الموثّق — إلزامي عند \`doseSource = OVERRIDE\` (BR-P6.2).
التجاوز مسموح، والصمت عنه ليس كذلك.`,
            }),
          ),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[PH1] بند وصفة — BRD §4.2.`,
        },
      ),
      { additionalProperties: false },
    ),
    inpatientOrders: t.Array(
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
  },
  { additionalProperties: false },
);

export const DrugCatalogProductPlainInputCreate = t.Object(
  {
    registerNumber: t.String(),
    tradeName: t.String(),
    tradeNameAr: t.Optional(__nullable__(t.String())),
    genericName: t.String(),
    genericNameAr: t.Optional(__nullable__(t.String())),
    genericKey: t.String(),
    strength: t.Optional(__nullable__(t.String())),
    strengthUnit: t.Optional(__nullable__(t.String())),
    dosageForm: t.Optional(__nullable__(t.String())),
    routeOfAdministration: t.Optional(__nullable__(t.String())),
    packageType: t.Optional(__nullable__(t.String())),
    packageSize: t.Optional(__nullable__(t.String())),
    packageUnit: t.Optional(__nullable__(t.String())),
    drugType: t.Optional(__nullable__(t.String())),
    subType: t.Optional(__nullable__(t.String())),
    legalStatus: t.Optional(__nullable__(t.String())),
    authorizationStatus: t.Optional(__nullable__(t.String())),
    marketingStatus: t.Optional(__nullable__(t.String())),
    shelfLifeMonths: t.Optional(__nullable__(t.Integer())),
    storageConditions: t.Optional(__nullable__(t.String())),
    manufacturerName: t.Optional(__nullable__(t.String())),
    manufacturerCountry: t.Optional(__nullable__(t.String())),
    marketingCompany: t.Optional(__nullable__(t.String())),
    agentName: t.Optional(__nullable__(t.String())),
    atcVetCode: t.Optional(__nullable__(t.String())),
    distributionArea: t.Optional(__nullable__(t.String())),
    registrationYear: t.Optional(__nullable__(t.Integer())),
    withdrawalPeriod: t.Optional(__nullable__(t.String())),
    targetAnimalsRaw: t.Optional(__nullable__(t.String())),
    allSpecies: t.Optional(t.Boolean()),
    therapeuticClassCode: t.Optional(__nullable__(t.String())),
    searchText: t.String(),
  },
  { additionalProperties: false },
);

export const DrugCatalogProductPlainInputUpdate = t.Object(
  {
    registerNumber: t.Optional(t.String()),
    tradeName: t.Optional(t.String()),
    tradeNameAr: t.Optional(__nullable__(t.String())),
    genericName: t.Optional(t.String()),
    genericNameAr: t.Optional(__nullable__(t.String())),
    genericKey: t.Optional(t.String()),
    strength: t.Optional(__nullable__(t.String())),
    strengthUnit: t.Optional(__nullable__(t.String())),
    dosageForm: t.Optional(__nullable__(t.String())),
    routeOfAdministration: t.Optional(__nullable__(t.String())),
    packageType: t.Optional(__nullable__(t.String())),
    packageSize: t.Optional(__nullable__(t.String())),
    packageUnit: t.Optional(__nullable__(t.String())),
    drugType: t.Optional(__nullable__(t.String())),
    subType: t.Optional(__nullable__(t.String())),
    legalStatus: t.Optional(__nullable__(t.String())),
    authorizationStatus: t.Optional(__nullable__(t.String())),
    marketingStatus: t.Optional(__nullable__(t.String())),
    shelfLifeMonths: t.Optional(__nullable__(t.Integer())),
    storageConditions: t.Optional(__nullable__(t.String())),
    manufacturerName: t.Optional(__nullable__(t.String())),
    manufacturerCountry: t.Optional(__nullable__(t.String())),
    marketingCompany: t.Optional(__nullable__(t.String())),
    agentName: t.Optional(__nullable__(t.String())),
    atcVetCode: t.Optional(__nullable__(t.String())),
    distributionArea: t.Optional(__nullable__(t.String())),
    registrationYear: t.Optional(__nullable__(t.Integer())),
    withdrawalPeriod: t.Optional(__nullable__(t.String())),
    targetAnimalsRaw: t.Optional(__nullable__(t.String())),
    allSpecies: t.Optional(t.Boolean()),
    therapeuticClassCode: t.Optional(__nullable__(t.String())),
    searchText: t.Optional(t.String()),
  },
  { additionalProperties: false },
);

export const DrugCatalogProductRelationsInputCreate = t.Object(
  {
    standard: t.Object(
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
    therapeuticClass: t.Optional(
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
    species: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
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
    prescriptionItems: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    inpatientOrders: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
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

export const DrugCatalogProductRelationsInputUpdate = t.Partial(
  t.Object(
    {
      standard: t.Object(
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
      therapeuticClass: t.Partial(
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
      species: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
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
      prescriptionItems: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      inpatientOrders: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
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

export const DrugCatalogProductWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          standardId: t.String(),
          registerNumber: t.String(),
          tradeName: t.String(),
          tradeNameAr: t.String(),
          genericName: t.String(),
          genericNameAr: t.String(),
          genericKey: t.String(),
          strength: t.String(),
          strengthUnit: t.String(),
          dosageForm: t.String(),
          routeOfAdministration: t.String(),
          packageType: t.String(),
          packageSize: t.String(),
          packageUnit: t.String(),
          drugType: t.String(),
          subType: t.String(),
          legalStatus: t.String(),
          authorizationStatus: t.String(),
          marketingStatus: t.String(),
          shelfLifeMonths: t.Integer(),
          storageConditions: t.String(),
          manufacturerName: t.String(),
          manufacturerCountry: t.String(),
          marketingCompany: t.String(),
          agentName: t.String(),
          atcVetCode: t.String(),
          distributionArea: t.String(),
          registrationYear: t.Integer(),
          withdrawalPeriod: t.String(),
          targetAnimalsRaw: t.String(),
          allSpecies: t.Boolean(),
          therapeuticClassCode: t.String(),
          searchText: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "DrugCatalogProduct" },
  ),
);

export const DrugCatalogProductWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              standardId_registerNumber: t.Object(
                { standardId: t.String(), registerNumber: t.String() },
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
            t.Object({
              standardId_registerNumber: t.Object(
                { standardId: t.String(), registerNumber: t.String() },
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
              standardId: t.String(),
              registerNumber: t.String(),
              tradeName: t.String(),
              tradeNameAr: t.String(),
              genericName: t.String(),
              genericNameAr: t.String(),
              genericKey: t.String(),
              strength: t.String(),
              strengthUnit: t.String(),
              dosageForm: t.String(),
              routeOfAdministration: t.String(),
              packageType: t.String(),
              packageSize: t.String(),
              packageUnit: t.String(),
              drugType: t.String(),
              subType: t.String(),
              legalStatus: t.String(),
              authorizationStatus: t.String(),
              marketingStatus: t.String(),
              shelfLifeMonths: t.Integer(),
              storageConditions: t.String(),
              manufacturerName: t.String(),
              manufacturerCountry: t.String(),
              marketingCompany: t.String(),
              agentName: t.String(),
              atcVetCode: t.String(),
              distributionArea: t.String(),
              registrationYear: t.Integer(),
              withdrawalPeriod: t.String(),
              targetAnimalsRaw: t.String(),
              allSpecies: t.Boolean(),
              therapeuticClassCode: t.String(),
              searchText: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "DrugCatalogProduct" },
);

export const DrugCatalogProductSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      standardId: t.Boolean(),
      registerNumber: t.Boolean(),
      tradeName: t.Boolean(),
      tradeNameAr: t.Boolean(),
      genericName: t.Boolean(),
      genericNameAr: t.Boolean(),
      genericKey: t.Boolean(),
      strength: t.Boolean(),
      strengthUnit: t.Boolean(),
      dosageForm: t.Boolean(),
      routeOfAdministration: t.Boolean(),
      packageType: t.Boolean(),
      packageSize: t.Boolean(),
      packageUnit: t.Boolean(),
      drugType: t.Boolean(),
      subType: t.Boolean(),
      legalStatus: t.Boolean(),
      authorizationStatus: t.Boolean(),
      marketingStatus: t.Boolean(),
      shelfLifeMonths: t.Boolean(),
      storageConditions: t.Boolean(),
      manufacturerName: t.Boolean(),
      manufacturerCountry: t.Boolean(),
      marketingCompany: t.Boolean(),
      agentName: t.Boolean(),
      atcVetCode: t.Boolean(),
      distributionArea: t.Boolean(),
      registrationYear: t.Boolean(),
      withdrawalPeriod: t.Boolean(),
      targetAnimalsRaw: t.Boolean(),
      allSpecies: t.Boolean(),
      therapeuticClassCode: t.Boolean(),
      searchText: t.Boolean(),
      createdAt: t.Boolean(),
      standard: t.Boolean(),
      therapeuticClass: t.Boolean(),
      species: t.Boolean(),
      inventoryItems: t.Boolean(),
      vaccines: t.Boolean(),
      prescriptionItems: t.Boolean(),
      inpatientOrders: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const DrugCatalogProductInclude = t.Partial(
  t.Object(
    {
      standard: t.Boolean(),
      therapeuticClass: t.Boolean(),
      species: t.Boolean(),
      inventoryItems: t.Boolean(),
      vaccines: t.Boolean(),
      prescriptionItems: t.Boolean(),
      inpatientOrders: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const DrugCatalogProductOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      standardId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      registerNumber: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      tradeName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      tradeNameAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      genericName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      genericNameAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      genericKey: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      strength: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      strengthUnit: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dosageForm: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      routeOfAdministration: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      packageType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      packageSize: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      packageUnit: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      drugType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      subType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      legalStatus: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      authorizationStatus: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      marketingStatus: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      shelfLifeMonths: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      storageConditions: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      manufacturerName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      manufacturerCountry: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      marketingCompany: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      agentName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      atcVetCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      distributionArea: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      registrationYear: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      withdrawalPeriod: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      targetAnimalsRaw: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      allSpecies: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      therapeuticClassCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      searchText: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const DrugCatalogProduct = t.Composite(
  [DrugCatalogProductPlain, DrugCatalogProductRelations],
  { additionalProperties: false },
);

export const DrugCatalogProductInputCreate = t.Composite(
  [DrugCatalogProductPlainInputCreate, DrugCatalogProductRelationsInputCreate],
  { additionalProperties: false },
);

export const DrugCatalogProductInputUpdate = t.Composite(
  [DrugCatalogProductPlainInputUpdate, DrugCatalogProductRelationsInputUpdate],
  { additionalProperties: false },
);
