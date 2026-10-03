import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InventoryItemPlain = t.Object(
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
);

export const InventoryItemRelations = t.Object(
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
    itemTaxTemplate: __nullable__(
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
    ),
    catalogProduct: __nullable__(
      t.Object(
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
      ),
    ),
    saleItems: t.Array(
      t.Object(
        {
          id: t.String(),
          saleId: t.String(),
          inventoryItemId: __nullable__(t.String()),
          name: t.String(),
          unitPrice: t.Number(),
          quantity: t.Integer(),
          lineTotal: t.Number(),
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
    bins: t.Array(
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
    purchaseOrderItems: t.Array(
      t.Object(
        {
          id: t.String(),
          purchaseOrderId: t.String(),
          itemId: t.String(),
          qtyOrdered: t.Integer(),
          qtyReceived: t.Integer(),
          unitCost: t.Number(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    batches: t.Array(
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
    comments: t.Array(
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
    carePlanMedications: t.Array(
      t.Object(
        {
          id: t.String(),
          carePlanId: t.String(),
          inventoryItemId: __nullable__(t.String()),
          nameSnapshot: t.String(),
          priceSnapshot: t.Number(),
          quantity: t.Integer(),
          freeQuantity: t.Integer(),
          fullyFree: t.Boolean(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    carePlanVisitMedications: t.Array(
      t.Object(
        {
          id: t.String(),
          carePlanVisitId: t.String(),
          inventoryItemId: __nullable__(t.String()),
          nameSnapshot: t.String(),
          priceSnapshot: t.Number(),
          quantity: t.Integer(),
          freeQuantity: t.Integer(),
          fullyFree: t.Boolean(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    carePlanEnrollmentVisitMedications: t.Array(
      t.Object(
        {
          id: t.String(),
          enrollmentVisitId: t.String(),
          inventoryItemId: __nullable__(t.String()),
          nameSnapshot: t.String(),
          priceSnapshot: t.Number(),
          quantity: t.Integer(),
          freeQuantity: t.Integer(),
          fullyFree: t.Boolean(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    appointmentProducts: t.Array(
      t.Object(
        {
          id: t.String(),
          appointmentId: t.String(),
          inventoryItemId: __nullable__(t.String()),
          nameSnapshot: t.String(),
          priceSnapshot: t.Number(),
          quantity: t.Integer(),
          freeQuantity: t.Integer(),
          fullyFree: t.Boolean(),
          issuedAt: __nullable__(t.Date()),
          paidAt: __nullable__(t.Date()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    operationKitItems: t.Array(
      t.Object(
        {
          id: t.String(),
          definitionId: t.String(),
          inventoryItemId: t.String(),
          quantity: t.Integer(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    anesthesiaEvents: t.Array(
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
    operationImplants: t.Array(
      t.Object(
        {
          id: t.String(),
          caseId: t.String(),
          name: t.String(),
          manufacturer: __nullable__(t.String()),
          lotNumber: __nullable__(t.String()),
          serialNumber: __nullable__(t.String()),
          udi: __nullable__(t.String()),
          site: __nullable__(t.String()),
          inventoryItemId: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    postOpOrders: t.Array(
      t.Object(
        {
          id: t.String(),
          caseId: t.String(),
          kind: t.Union(
            [
              t.Literal("MEDICATION"),
              t.Literal("MONITORING"),
              t.Literal("FEEDING"),
              t.Literal("ACTIVITY"),
              t.Literal("WOUND_CARE"),
              t.Literal("FOLLOW_UP"),
              t.Literal("SUTURE_REMOVAL"),
            ],
            { additionalProperties: false },
          ),
          inventoryItemId: __nullable__(t.String()),
          instructions: t.String(),
          dueAt: __nullable__(t.Date()),
          followUpAppointmentId: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    operationConsumables: t.Array(
      t.Object(
        {
          id: t.String(),
          caseId: t.String(),
          inventoryItemId: __nullable__(t.String()),
          nameSnapshot: t.String(),
          quantity: t.Integer(),
          priceSnapshot: t.Number(),
          type: t.Union(
            [t.Literal("KIT"), t.Literal("BURNED"), t.Literal("ADDITIONAL")],
            { additionalProperties: false },
          ),
          countedQuantity: __nullable__(t.Integer()),
          countNote: __nullable__(t.String()),
          issuedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
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
    groomingProducts: t.Array(
      t.Object(
        {
          id: t.String(),
          sessionId: t.String(),
          inventoryItemId: __nullable__(t.String()),
          nameSnapshot: t.String(),
          priceSnapshot: t.Number(),
          quantity: t.Number(),
          billable: t.Boolean(),
          dilution: __nullable__(t.String()),
          contactTimeMin: __nullable__(t.Integer()),
          bodyZones: t.Array(t.String(), { additionalProperties: false }),
          issuedAt: __nullable__(t.Date()),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `مستهلكات الجلسة — تُخصم من المخزون مرّة واحدة عند مغادرة عمود التشطيب.
حقول البروتوكول (التخفيف وزمن التلامس) ليست ملاحظة حرّة: الحمّام الدوائي
علاجٌ موضعي له جرعة، ولا يُقرأ أثره بعد شهر بغير تسجيلها.`,
        },
      ),
      { additionalProperties: false },
    ),
    groomingProfilesShampoo: t.Array(
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
    controlledSubstance: t.Array(
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

export const InventoryItemPlainInputCreate = t.Object(
  {
    code: t.String(),
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
    stock: t.Optional(t.Integer()),
    reorderPoint: t.Optional(t.Integer()),
    productionDate: t.Optional(__nullable__(t.Date())),
    expiryDate: t.Optional(__nullable__(t.Date())),
    price: t.Number(),
    unitCost: t.Optional(__nullable__(t.Number())),
    valuationRate: t.Optional(t.Number()),
    maxQuantity: t.Optional(__nullable__(t.Integer())),
    sku: t.Optional(__nullable__(t.String())),
    barcode: t.Optional(__nullable__(t.String())),
    supplier: t.Optional(__nullable__(t.String())),
    location: t.Optional(__nullable__(t.String())),
    notes: t.Optional(__nullable__(t.String())),
    tracksBatches: t.Optional(t.Boolean()),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const InventoryItemPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    name: t.Optional(t.String()),
    category: t.Optional(
      t.Union(
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
    ),
    stock: t.Optional(t.Integer()),
    reorderPoint: t.Optional(t.Integer()),
    productionDate: t.Optional(__nullable__(t.Date())),
    expiryDate: t.Optional(__nullable__(t.Date())),
    price: t.Optional(t.Number()),
    unitCost: t.Optional(__nullable__(t.Number())),
    valuationRate: t.Optional(t.Number()),
    maxQuantity: t.Optional(__nullable__(t.Integer())),
    sku: t.Optional(__nullable__(t.String())),
    barcode: t.Optional(__nullable__(t.String())),
    supplier: t.Optional(__nullable__(t.String())),
    location: t.Optional(__nullable__(t.String())),
    notes: t.Optional(__nullable__(t.String())),
    tracksBatches: t.Optional(t.Boolean()),
    active: t.Optional(t.Boolean()),
    isDeleted: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
    editsCount: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const InventoryItemRelationsInputCreate = t.Object(
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
    itemTaxTemplate: t.Optional(
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
    catalogProduct: t.Optional(
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
    saleItems: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
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
    bins: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    purchaseOrderItems: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    batches: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    comments: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    carePlanMedications: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    carePlanVisitMedications: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    carePlanEnrollmentVisitMedications: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    appointmentProducts: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    operationKitItems: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    anesthesiaEvents: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    operationImplants: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    postOpOrders: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    operationConsumables: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
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
    groomingProducts: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    groomingProfilesShampoo: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
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
    controlledSubstance: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
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

export const InventoryItemRelationsInputUpdate = t.Partial(
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
      itemTaxTemplate: t.Partial(
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
      catalogProduct: t.Partial(
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
      saleItems: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
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
      bins: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      purchaseOrderItems: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      batches: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      comments: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      carePlanMedications: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      carePlanVisitMedications: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      carePlanEnrollmentVisitMedications: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      appointmentProducts: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      operationKitItems: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      anesthesiaEvents: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      operationImplants: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      postOpOrders: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      operationConsumables: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
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
      groomingProducts: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      groomingProfilesShampoo: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
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
      controlledSubstance: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
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

export const InventoryItemWhere = t.Partial(
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
          productionDate: t.Date(),
          expiryDate: t.Date(),
          price: t.Number(),
          unitCost: t.Number(),
          valuationRate: t.Number(),
          maxQuantity: t.Integer(),
          sku: t.String(),
          barcode: t.String(),
          supplier: t.String(),
          location: t.String(),
          notes: t.String(),
          tracksBatches: t.Boolean(),
          itemTaxTemplateId: t.String(),
          catalogProductId: t.String(),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: t.Date(),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "InventoryItem" },
  ),
);

export const InventoryItemWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), code: t.String() },
            { additionalProperties: false },
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
              productionDate: t.Date(),
              expiryDate: t.Date(),
              price: t.Number(),
              unitCost: t.Number(),
              valuationRate: t.Number(),
              maxQuantity: t.Integer(),
              sku: t.String(),
              barcode: t.String(),
              supplier: t.String(),
              location: t.String(),
              notes: t.String(),
              tracksBatches: t.Boolean(),
              itemTaxTemplateId: t.String(),
              catalogProductId: t.String(),
              active: t.Boolean(),
              isDeleted: t.Boolean(),
              deletedAt: t.Date(),
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
  { $id: "InventoryItem" },
);

export const InventoryItemSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      name: t.Boolean(),
      category: t.Boolean(),
      stock: t.Boolean(),
      reorderPoint: t.Boolean(),
      productionDate: t.Boolean(),
      expiryDate: t.Boolean(),
      price: t.Boolean(),
      unitCost: t.Boolean(),
      valuationRate: t.Boolean(),
      maxQuantity: t.Boolean(),
      sku: t.Boolean(),
      barcode: t.Boolean(),
      supplier: t.Boolean(),
      location: t.Boolean(),
      notes: t.Boolean(),
      tracksBatches: t.Boolean(),
      itemTaxTemplateId: t.Boolean(),
      catalogProductId: t.Boolean(),
      active: t.Boolean(),
      isDeleted: t.Boolean(),
      deletedAt: t.Boolean(),
      editsCount: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      itemTaxTemplate: t.Boolean(),
      catalogProduct: t.Boolean(),
      saleItems: t.Boolean(),
      stockLedgerEntries: t.Boolean(),
      bins: t.Boolean(),
      purchaseOrderItems: t.Boolean(),
      batches: t.Boolean(),
      comments: t.Boolean(),
      carePlanMedications: t.Boolean(),
      carePlanVisitMedications: t.Boolean(),
      carePlanEnrollmentVisitMedications: t.Boolean(),
      appointmentProducts: t.Boolean(),
      operationKitItems: t.Boolean(),
      anesthesiaEvents: t.Boolean(),
      operationImplants: t.Boolean(),
      postOpOrders: t.Boolean(),
      operationConsumables: t.Boolean(),
      vaccines: t.Boolean(),
      vaccinationRecords: t.Boolean(),
      dietFoods: t.Boolean(),
      groomingProducts: t.Boolean(),
      groomingProfilesShampoo: t.Boolean(),
      prescriptionItems: t.Boolean(),
      controlledSubstance: t.Boolean(),
      controlledRegister: t.Boolean(),
      batchDisposals: t.Boolean(),
      inpatientOrders: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const InventoryItemInclude = t.Partial(
  t.Object(
    {
      category: t.Boolean(),
      clinic: t.Boolean(),
      itemTaxTemplate: t.Boolean(),
      catalogProduct: t.Boolean(),
      saleItems: t.Boolean(),
      stockLedgerEntries: t.Boolean(),
      bins: t.Boolean(),
      purchaseOrderItems: t.Boolean(),
      batches: t.Boolean(),
      comments: t.Boolean(),
      carePlanMedications: t.Boolean(),
      carePlanVisitMedications: t.Boolean(),
      carePlanEnrollmentVisitMedications: t.Boolean(),
      appointmentProducts: t.Boolean(),
      operationKitItems: t.Boolean(),
      anesthesiaEvents: t.Boolean(),
      operationImplants: t.Boolean(),
      postOpOrders: t.Boolean(),
      operationConsumables: t.Boolean(),
      vaccines: t.Boolean(),
      vaccinationRecords: t.Boolean(),
      dietFoods: t.Boolean(),
      groomingProducts: t.Boolean(),
      groomingProfilesShampoo: t.Boolean(),
      prescriptionItems: t.Boolean(),
      controlledSubstance: t.Boolean(),
      controlledRegister: t.Boolean(),
      batchDisposals: t.Boolean(),
      inpatientOrders: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const InventoryItemOrderBy = t.Partial(
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
      stock: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reorderPoint: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      productionDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      expiryDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      price: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      unitCost: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      valuationRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      maxQuantity: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sku: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      barcode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      supplier: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      location: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      tracksBatches: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      itemTaxTemplateId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      catalogProductId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const InventoryItem = t.Composite(
  [InventoryItemPlain, InventoryItemRelations],
  { additionalProperties: false },
);

export const InventoryItemInputCreate = t.Composite(
  [InventoryItemPlainInputCreate, InventoryItemRelationsInputCreate],
  { additionalProperties: false },
);

export const InventoryItemInputUpdate = t.Composite(
  [InventoryItemPlainInputUpdate, InventoryItemRelationsInputUpdate],
  { additionalProperties: false },
);
