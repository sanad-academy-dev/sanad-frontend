import Elysia from "elysia";
/**
 * مجموعة وحدة التجميل.
 *
 * أُنشئت مجموعةً منذ أول متحكّم لا بعد الاصطدام: سلسلة `‎.use()‎` العليا في
 * `src/server/index.ts` عند سقف عمق الاستنتاج (TS2589 يظهر مؤشِّرًا إلى
 * `app.ts`)، والتعليق هناك يطلب صراحةً ضمّ الوحدة التالية إلى مجموعة بدل إطالة
 * السلسلة. متحكّمات الوحدة الثلاثة تدخل هنا بحلقة واحدة في السلسلة العليا.
 */
export declare const groomingServer: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "groomingDefinitions.upsertDefinition": import("@sinclair/typebox").TObject<{
            kind: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"BATH">, import("@sinclair/typebox").TLiteral<"FULL_GROOM">, import("@sinclair/typebox").TLiteral<"TIDY_UP">, import("@sinclair/typebox").TLiteral<"DESHED">, import("@sinclair/typebox").TLiteral<"NAIL_TRIM">, import("@sinclair/typebox").TLiteral<"EAR_CLEAN">, import("@sinclair/typebox").TLiteral<"ANAL_GLANDS">, import("@sinclair/typebox").TLiteral<"TEETH_BRUSH">, import("@sinclair/typebox").TLiteral<"DEMATTING">, import("@sinclair/typebox").TLiteral<"SHAVE_DOWN">, import("@sinclair/typebox").TLiteral<"MEDICATED_BATH">, import("@sinclair/typebox").TLiteral<"PARASITE_DIP">, import("@sinclair/typebox").TLiteral<"WOUND_CARE_CLIP">, import("@sinclair/typebox").TLiteral<"SPA_ADDON">, import("@sinclair/typebox").TLiteral<"OTHER">]>;
            lane: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"COSMETIC">, import("@sinclair/typebox").TLiteral<"MEDICAL">]>>;
            requiresVetOrder: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            isAddOn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            basePrice: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            baseDurationMin: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            dryingMinutes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            speciesScope: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            requiresStation: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "groomingDefinitions.replacePriceRules": import("@sinclair/typebox").TObject<{
            rules: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                animalTypeId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                animalStrainId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                sizeBand: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"TOY">, import("@sinclair/typebox").TLiteral<"SMALL">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"LARGE">, import("@sinclair/typebox").TLiteral<"GIANT">]>]>>;
                coatType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LONG_THICK">, import("@sinclair/typebox").TLiteral<"SHORT_THICK">, import("@sinclair/typebox").TLiteral<"LIGHT">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"DOUBLE_COAT">, import("@sinclair/typebox").TLiteral<"NONE">]>]>>;
                price: import("@sinclair/typebox").TNumber;
                durationMin: import("@sinclair/typebox").TInteger;
                dryingMinutes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            }>>;
        }>;
        readonly "groomingDefinitions.upsertModifier": import("@sinclair/typebox").TObject<{
            code: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MATTING">, import("@sinclair/typebox").TLiteral<"SHAVE_DOWN">, import("@sinclair/typebox").TLiteral<"BEHAVIOR">, import("@sinclair/typebox").TLiteral<"SENIOR">, import("@sinclair/typebox").TLiteral<"FLEA">, import("@sinclair/typebox").TLiteral<"SECOND_PET">, import("@sinclair/typebox").TLiteral<"EXPRESS">, import("@sinclair/typebox").TLiteral<"OUT_OF_HOURS">]>;
            labelAr: import("@sinclair/typebox").TString;
            calc: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PERCENT">, import("@sinclair/typebox").TLiteral<"FIXED">, import("@sinclair/typebox").TLiteral<"PER_MINUTE">]>;
            value: import("@sinclair/typebox").TNumber;
            autoAppliesFrom: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            requiresOwnerApproval: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "groomingDefinitions.upsertCapacity": import("@sinclair/typebox").TObject<{
            stations: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            dryerSlots: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            maxPetsPerDay: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            maxHeatSensitiveConcurrent: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            dropOffWindowMin: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            requireDepositPercent: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            seniorAgeYears: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            quoteReapprovalPercent: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        readonly "groomingDefinitions.quotePreview": import("@sinclair/typebox").TObject<{
            definitionIds: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
            pet: import("@sinclair/typebox").TObject<{
                animalTypeId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                animalStrainId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                sizeBand: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"TOY">, import("@sinclair/typebox").TLiteral<"SMALL">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"LARGE">, import("@sinclair/typebox").TLiteral<"GIANT">]>]>>;
                coatType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LONG_THICK">, import("@sinclair/typebox").TLiteral<"SHORT_THICK">, import("@sinclair/typebox").TLiteral<"LIGHT">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"DOUBLE_COAT">, import("@sinclair/typebox").TLiteral<"NONE">]>]>>;
                weightKg: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            }>;
        }>;
    };
    error: {};
} & {
    typebox: {
        readonly "grooming.create": import("@sinclair/typebox").TObject<{
            patientId: import("@sinclair/typebox").TString;
            branchId: import("@sinclair/typebox").TString;
            groomerId: import("@sinclair/typebox").TString;
            assistantId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            stationId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            scheduledAt: import("@sinclair/typebox").TString;
            dropOffAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            definitionIds: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
            lane: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"COSMETIC">, import("@sinclair/typebox").TLiteral<"MEDICAL">]>>;
            sedationPlanned: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            vetOrderStaffId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            vetOrderNote: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "grooming.transition": import("@sinclair/typebox").TObject<{
            to: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"SCHEDULED">, import("@sinclair/typebox").TLiteral<"CHECK_IN">, import("@sinclair/typebox").TLiteral<"INTAKE">, import("@sinclair/typebox").TLiteral<"IN_PROGRESS">, import("@sinclair/typebox").TLiteral<"FINISHING">, import("@sinclair/typebox").TLiteral<"READY">, import("@sinclair/typebox").TLiteral<"PICKED_UP">, import("@sinclair/typebox").TLiteral<"COMPLETED">, import("@sinclair/typebox").TLiteral<"CANCELLED">, import("@sinclair/typebox").TLiteral<"NO_SHOW">, import("@sinclair/typebox").TLiteral<"ESCALATED">]>;
            overrideReason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            cancelKind: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"OWNER_CANCELLED">, import("@sinclair/typebox").TLiteral<"CLINIC_CANCELLED">, import("@sinclair/typebox").TLiteral<"NO_SHOW">, import("@sinclair/typebox").TLiteral<"HEALTH_REFUSAL">, import("@sinclair/typebox").TLiteral<"BEHAVIOR_REFUSAL">]>]>>;
            cancelReason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "grooming.dryingMethod": import("@sinclair/typebox").TObject<{
            method: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"HAND_ROOM_TEMP">, import("@sinclair/typebox").TLiteral<"FAN_ONLY">, import("@sinclair/typebox").TLiteral<"CAGE_UNHEATED">, import("@sinclair/typebox").TLiteral<"FORCED_AIR">, import("@sinclair/typebox").TLiteral<"CAGE_HEATED">]>;
        }>;
        readonly "grooming.intake": import("@sinclair/typebox").TObject<{
            weightKg: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            temperatureC: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            mattingGrade: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NONE">, import("@sinclair/typebox").TLiteral<"LIGHT">, import("@sinclair/typebox").TLiteral<"MODERATE">, import("@sinclair/typebox").TLiteral<"SEVERE">, import("@sinclair/typebox").TLiteral<"PELTED">]>;
            coatCondition: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"HEALTHY">, import("@sinclair/typebox").TLiteral<"DRY">, import("@sinclair/typebox").TLiteral<"GREASY">, import("@sinclair/typebox").TLiteral<"DANDRUFF">, import("@sinclair/typebox").TLiteral<"SHEDDING_HEAVY">, import("@sinclair/typebox").TLiteral<"DAMAGED">]>>;
            parasiteFinding: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NONE">, import("@sinclair/typebox").TLiteral<"FLEAS">, import("@sinclair/typebox").TLiteral<"TICKS">, import("@sinclair/typebox").TLiteral<"LICE">, import("@sinclair/typebox").TLiteral<"MITES_SUSPECTED">, import("@sinclair/typebox").TLiteral<"MULTIPLE">]>>;
            skinFindings: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            earCondition: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NORMAL">, import("@sinclair/typebox").TLiteral<"WAXY">, import("@sinclair/typebox").TLiteral<"REDNESS">, import("@sinclair/typebox").TLiteral<"ODOR">, import("@sinclair/typebox").TLiteral<"DISCHARGE">, import("@sinclair/typebox").TLiteral<"PAINFUL">]>>;
            nailCondition: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NORMAL">, import("@sinclair/typebox").TLiteral<"OVERGROWN">, import("@sinclair/typebox").TLiteral<"SPLIT">, import("@sinclair/typebox").TLiteral<"INGROWN">, import("@sinclair/typebox").TLiteral<"MISSING">]>>;
            dentalNote: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            behaviorScore: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"GREEN">, import("@sinclair/typebox").TLiteral<"YELLOW">, import("@sinclair/typebox").TLiteral<"RED">]>;
            muzzleUsed: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            belongings: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "grooming.parasiteProtocol": import("@sinclair/typebox").TObject<{
            treated: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            ownerNotified: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            isolated: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "grooming.photo": import("@sinclair/typebox").TObject<{
            kind: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"BEFORE">, import("@sinclair/typebox").TLiteral<"AFTER">, import("@sinclair/typebox").TLiteral<"CONDITION">, import("@sinclair/typebox").TLiteral<"INCIDENT">]>;
            url: import("@sinclair/typebox").TString;
            caption: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            bodyZone: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "grooming.itemPerformed": import("@sinclair/typebox").TObject<{
            performed: import("@sinclair/typebox").TBoolean;
        }>;
        readonly "grooming.payInvoice": import("@sinclair/typebox").TObject<{
            amountPaid: import("@sinclair/typebox").TNumber;
            paymentMethod: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"CASH">, import("@sinclair/typebox").TLiteral<"CARD">, import("@sinclair/typebox").TLiteral<"TRANSFER">]>;
        }>;
        readonly "grooming.product": import("@sinclair/typebox").TObject<{
            inventoryItemId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            nameSnapshot: import("@sinclair/typebox").TString;
            priceSnapshot: import("@sinclair/typebox").TNumber;
            quantity: import("@sinclair/typebox").TNumber;
            billable: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            dilution: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            contactTimeMin: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            bodyZones: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        }>;
        readonly "grooming.finding": import("@sinclair/typebox").TObject<{
            category: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"SKIN">, import("@sinclair/typebox").TLiteral<"EARS">, import("@sinclair/typebox").TLiteral<"EYES">, import("@sinclair/typebox").TLiteral<"NAILS">, import("@sinclair/typebox").TLiteral<"DENTAL">, import("@sinclair/typebox").TLiteral<"LUMP">, import("@sinclair/typebox").TLiteral<"PARASITE">, import("@sinclair/typebox").TLiteral<"WEIGHT">, import("@sinclair/typebox").TLiteral<"PAIN">, import("@sinclair/typebox").TLiteral<"BEHAVIOR">, import("@sinclair/typebox").TLiteral<"OTHER">]>;
            severity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"INFO">, import("@sinclair/typebox").TLiteral<"ATTENTION">, import("@sinclair/typebox").TLiteral<"URGENT">]>>;
            bodyZone: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            note: import("@sinclair/typebox").TString;
            photoId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "grooming.linkFinding": import("@sinclair/typebox").TObject<{
            referralAppointmentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            labOrderId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            dismissedReason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "grooming.incident": import("@sinclair/typebox").TObject<{
            kind: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"CLIPPER_BURN">, import("@sinclair/typebox").TLiteral<"NICK_CUT">, import("@sinclair/typebox").TLiteral<"QUICKED_NAIL">, import("@sinclair/typebox").TLiteral<"HEAT_STRESS">, import("@sinclair/typebox").TLiteral<"MEDICAL_EVENT">, import("@sinclair/typebox").TLiteral<"ESCAPE">, import("@sinclair/typebox").TLiteral<"BITE_TO_STAFF">, import("@sinclair/typebox").TLiteral<"EQUIPMENT_FAILURE">, import("@sinclair/typebox").TLiteral<"OTHER">]>;
            severity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MINOR">, import("@sinclair/typebox").TLiteral<"MODERATE">, import("@sinclair/typebox").TLiteral<"MAJOR">]>>;
            description: import("@sinclair/typebox").TString;
            actionTaken: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            photoId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "grooming.resolveIncident": import("@sinclair/typebox").TObject<{
            vetAssessedByStaffId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            vetAssessmentNote: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            ownerNotified: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            followUpAppointmentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "grooming.reportCard": import("@sinclair/typebox").TObject<{
            summary: import("@sinclair/typebox").TString;
            moodScore: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"CALM">, import("@sinclair/typebox").TLiteral<"HAPPY">, import("@sinclair/typebox").TLiteral<"ANXIOUS">, import("@sinclair/typebox").TLiteral<"STRESSED">, import("@sinclair/typebox").TLiteral<"AGGRESSIVE">]>>;
            recommendedIntervalWeeks: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            channel: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"WHATSAPP">, import("@sinclair/typebox").TLiteral<"EMAIL">, import("@sinclair/typebox").TLiteral<"SMS">, import("@sinclair/typebox").TLiteral<"IN_APP">, import("@sinclair/typebox").TLiteral<"PRINTED">]>]>>;
        }>;
        readonly "grooming.profile": import("@sinclair/typebox").TObject<{
            preferredGroomerId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            sizeBand: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"TOY">, import("@sinclair/typebox").TLiteral<"SMALL">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"LARGE">, import("@sinclair/typebox").TLiteral<"GIANT">]>]>>;
            coatType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LONG_THICK">, import("@sinclair/typebox").TLiteral<"SHORT_THICK">, import("@sinclair/typebox").TLiteral<"LIGHT">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"DOUBLE_COAT">, import("@sinclair/typebox").TLiteral<"NONE">]>]>>;
            shampooItemId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            sensitivities: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            behaviorScore: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"GREEN">, import("@sinclair/typebox").TLiteral<"YELLOW">, import("@sinclair/typebox").TLiteral<"RED">]>>;
            muzzleRequired: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            requiresTwoHandlers: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            handlingNotes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            heatDryProhibited: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            heatDryProhibitedReason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            groomIntervalWeeks: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            customPrice: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            customDurationMin: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
    };
    error: {};
}, {
    schema: {};
    standaloneSchema: {};
    macro: {};
    macroFn: {};
    parser: {};
    response: {};
} & {
    schema: {};
    standaloneSchema: {};
    macro: Partial<{
        readonly requireClinic: boolean;
    }>;
    macroFn: {
        readonly requireClinic: {
            readonly resolve: ({ request }: {
                body: unknown;
                query: Record<string, string>;
                params: {};
                headers: Record<string, string | undefined>;
                cookie: Record<string, import("elysia").Cookie<unknown>>;
                server: import("elysia/universal/server").Server | null;
                redirect: import("elysia").redirect;
                set: {
                    headers: import("elysia").HTTPHeaders;
                    status?: number | keyof import("elysia").StatusMap;
                    redirect?: string;
                    cookie?: Record<string, import("elysia/cookies").ElysiaCookie>;
                };
                path: string;
                route: string;
                request: Request;
                store: {};
                status: <const Code extends number | keyof import("elysia").StatusMap, const T = Code extends 200 | 100 | 101 | 102 | 103 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 300 | 301 | 302 | 303 | 304 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 420 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 ? {
                    readonly 100: "Continue";
                    readonly 101: "Switching Protocols";
                    readonly 102: "Processing";
                    readonly 103: "Early Hints";
                    readonly 200: "OK";
                    readonly 201: "Created";
                    readonly 202: "Accepted";
                    readonly 203: "Non-Authoritative Information";
                    readonly 204: "No Content";
                    readonly 205: "Reset Content";
                    readonly 206: "Partial Content";
                    readonly 207: "Multi-Status";
                    readonly 208: "Already Reported";
                    readonly 300: "Multiple Choices";
                    readonly 301: "Moved Permanently";
                    readonly 302: "Found";
                    readonly 303: "See Other";
                    readonly 304: "Not Modified";
                    readonly 307: "Temporary Redirect";
                    readonly 308: "Permanent Redirect";
                    readonly 400: "Bad Request";
                    readonly 401: "Unauthorized";
                    readonly 402: "Payment Required";
                    readonly 403: "Forbidden";
                    readonly 404: "Not Found";
                    readonly 405: "Method Not Allowed";
                    readonly 406: "Not Acceptable";
                    readonly 407: "Proxy Authentication Required";
                    readonly 408: "Request Timeout";
                    readonly 409: "Conflict";
                    readonly 410: "Gone";
                    readonly 411: "Length Required";
                    readonly 412: "Precondition Failed";
                    readonly 413: "Payload Too Large";
                    readonly 414: "URI Too Long";
                    readonly 415: "Unsupported Media Type";
                    readonly 416: "Range Not Satisfiable";
                    readonly 417: "Expectation Failed";
                    readonly 418: "I'm a teapot";
                    readonly 420: "Enhance Your Calm";
                    readonly 421: "Misdirected Request";
                    readonly 422: "Unprocessable Content";
                    readonly 423: "Locked";
                    readonly 424: "Failed Dependency";
                    readonly 425: "Too Early";
                    readonly 426: "Upgrade Required";
                    readonly 428: "Precondition Required";
                    readonly 429: "Too Many Requests";
                    readonly 431: "Request Header Fields Too Large";
                    readonly 451: "Unavailable For Legal Reasons";
                    readonly 500: "Internal Server Error";
                    readonly 501: "Not Implemented";
                    readonly 502: "Bad Gateway";
                    readonly 503: "Service Unavailable";
                    readonly 504: "Gateway Timeout";
                    readonly 505: "HTTP Version Not Supported";
                    readonly 506: "Variant Also Negotiates";
                    readonly 507: "Insufficient Storage";
                    readonly 508: "Loop Detected";
                    readonly 510: "Not Extended";
                    readonly 511: "Network Authentication Required";
                }[Code] : Code>(code: Code, response?: T) => import("elysia").ElysiaCustomStatusResponse<Code, T, Code extends "Continue" | "Switching Protocols" | "Processing" | "Early Hints" | "OK" | "Created" | "Accepted" | "Non-Authoritative Information" | "No Content" | "Reset Content" | "Partial Content" | "Multi-Status" | "Already Reported" | "Multiple Choices" | "Moved Permanently" | "Found" | "See Other" | "Not Modified" | "Temporary Redirect" | "Permanent Redirect" | "Bad Request" | "Unauthorized" | "Payment Required" | "Forbidden" | "Not Found" | "Method Not Allowed" | "Not Acceptable" | "Proxy Authentication Required" | "Request Timeout" | "Conflict" | "Gone" | "Length Required" | "Precondition Failed" | "Payload Too Large" | "URI Too Long" | "Unsupported Media Type" | "Range Not Satisfiable" | "Expectation Failed" | "I'm a teapot" | "Enhance Your Calm" | "Misdirected Request" | "Unprocessable Content" | "Locked" | "Failed Dependency" | "Too Early" | "Upgrade Required" | "Precondition Required" | "Too Many Requests" | "Request Header Fields Too Large" | "Unavailable For Legal Reasons" | "Internal Server Error" | "Not Implemented" | "Bad Gateway" | "Service Unavailable" | "Gateway Timeout" | "HTTP Version Not Supported" | "Variant Also Negotiates" | "Insufficient Storage" | "Loop Detected" | "Not Extended" | "Network Authentication Required" ? {
                    readonly Continue: 100;
                    readonly "Switching Protocols": 101;
                    readonly Processing: 102;
                    readonly "Early Hints": 103;
                    readonly OK: 200;
                    readonly Created: 201;
                    readonly Accepted: 202;
                    readonly "Non-Authoritative Information": 203;
                    readonly "No Content": 204;
                    readonly "Reset Content": 205;
                    readonly "Partial Content": 206;
                    readonly "Multi-Status": 207;
                    readonly "Already Reported": 208;
                    readonly "Multiple Choices": 300;
                    readonly "Moved Permanently": 301;
                    readonly Found: 302;
                    readonly "See Other": 303;
                    readonly "Not Modified": 304;
                    readonly "Temporary Redirect": 307;
                    readonly "Permanent Redirect": 308;
                    readonly "Bad Request": 400;
                    readonly Unauthorized: 401;
                    readonly "Payment Required": 402;
                    readonly Forbidden: 403;
                    readonly "Not Found": 404;
                    readonly "Method Not Allowed": 405;
                    readonly "Not Acceptable": 406;
                    readonly "Proxy Authentication Required": 407;
                    readonly "Request Timeout": 408;
                    readonly Conflict: 409;
                    readonly Gone: 410;
                    readonly "Length Required": 411;
                    readonly "Precondition Failed": 412;
                    readonly "Payload Too Large": 413;
                    readonly "URI Too Long": 414;
                    readonly "Unsupported Media Type": 415;
                    readonly "Range Not Satisfiable": 416;
                    readonly "Expectation Failed": 417;
                    readonly "I'm a teapot": 418;
                    readonly "Enhance Your Calm": 420;
                    readonly "Misdirected Request": 421;
                    readonly "Unprocessable Content": 422;
                    readonly Locked: 423;
                    readonly "Failed Dependency": 424;
                    readonly "Too Early": 425;
                    readonly "Upgrade Required": 426;
                    readonly "Precondition Required": 428;
                    readonly "Too Many Requests": 429;
                    readonly "Request Header Fields Too Large": 431;
                    readonly "Unavailable For Legal Reasons": 451;
                    readonly "Internal Server Error": 500;
                    readonly "Not Implemented": 501;
                    readonly "Bad Gateway": 502;
                    readonly "Service Unavailable": 503;
                    readonly "Gateway Timeout": 504;
                    readonly "HTTP Version Not Supported": 505;
                    readonly "Variant Also Negotiates": 506;
                    readonly "Insufficient Storage": 507;
                    readonly "Loop Detected": 508;
                    readonly "Not Extended": 510;
                    readonly "Network Authentication Required": 511;
                }[Code] : Code>;
            }) => Promise<import("elysia").ElysiaCustomStatusResponse<401, {
                readonly message: "غير مصرح";
            }, 401> | import("elysia").ElysiaCustomStatusResponse<403, {
                readonly message: "لا تملك صلاحية عرض التجميل";
            }, 403> | {
                clinicId: string;
                isAdmin: boolean;
                permissions: string[];
            }>;
        };
    };
    parser: {};
    response: {};
} & {
    schema: {};
    standaloneSchema: {};
    macro: Partial<{
        readonly requireClinic: boolean;
    }>;
    macroFn: {
        readonly requireClinic: {
            readonly resolve: ({ request }: {
                body: unknown;
                query: Record<string, string>;
                params: {};
                headers: Record<string, string | undefined>;
                cookie: Record<string, import("elysia").Cookie<unknown>>;
                server: import("elysia/universal/server").Server | null;
                redirect: import("elysia").redirect;
                set: {
                    headers: import("elysia").HTTPHeaders;
                    status?: number | keyof import("elysia").StatusMap;
                    redirect?: string;
                    cookie?: Record<string, import("elysia/cookies").ElysiaCookie>;
                };
                path: string;
                route: string;
                request: Request;
                store: {};
                status: <const Code extends number | keyof import("elysia").StatusMap, const T = Code extends 200 | 100 | 101 | 102 | 103 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 300 | 301 | 302 | 303 | 304 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 420 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 ? {
                    readonly 100: "Continue";
                    readonly 101: "Switching Protocols";
                    readonly 102: "Processing";
                    readonly 103: "Early Hints";
                    readonly 200: "OK";
                    readonly 201: "Created";
                    readonly 202: "Accepted";
                    readonly 203: "Non-Authoritative Information";
                    readonly 204: "No Content";
                    readonly 205: "Reset Content";
                    readonly 206: "Partial Content";
                    readonly 207: "Multi-Status";
                    readonly 208: "Already Reported";
                    readonly 300: "Multiple Choices";
                    readonly 301: "Moved Permanently";
                    readonly 302: "Found";
                    readonly 303: "See Other";
                    readonly 304: "Not Modified";
                    readonly 307: "Temporary Redirect";
                    readonly 308: "Permanent Redirect";
                    readonly 400: "Bad Request";
                    readonly 401: "Unauthorized";
                    readonly 402: "Payment Required";
                    readonly 403: "Forbidden";
                    readonly 404: "Not Found";
                    readonly 405: "Method Not Allowed";
                    readonly 406: "Not Acceptable";
                    readonly 407: "Proxy Authentication Required";
                    readonly 408: "Request Timeout";
                    readonly 409: "Conflict";
                    readonly 410: "Gone";
                    readonly 411: "Length Required";
                    readonly 412: "Precondition Failed";
                    readonly 413: "Payload Too Large";
                    readonly 414: "URI Too Long";
                    readonly 415: "Unsupported Media Type";
                    readonly 416: "Range Not Satisfiable";
                    readonly 417: "Expectation Failed";
                    readonly 418: "I'm a teapot";
                    readonly 420: "Enhance Your Calm";
                    readonly 421: "Misdirected Request";
                    readonly 422: "Unprocessable Content";
                    readonly 423: "Locked";
                    readonly 424: "Failed Dependency";
                    readonly 425: "Too Early";
                    readonly 426: "Upgrade Required";
                    readonly 428: "Precondition Required";
                    readonly 429: "Too Many Requests";
                    readonly 431: "Request Header Fields Too Large";
                    readonly 451: "Unavailable For Legal Reasons";
                    readonly 500: "Internal Server Error";
                    readonly 501: "Not Implemented";
                    readonly 502: "Bad Gateway";
                    readonly 503: "Service Unavailable";
                    readonly 504: "Gateway Timeout";
                    readonly 505: "HTTP Version Not Supported";
                    readonly 506: "Variant Also Negotiates";
                    readonly 507: "Insufficient Storage";
                    readonly 508: "Loop Detected";
                    readonly 510: "Not Extended";
                    readonly 511: "Network Authentication Required";
                }[Code] : Code>(code: Code, response?: T) => import("elysia").ElysiaCustomStatusResponse<Code, T, Code extends "Continue" | "Switching Protocols" | "Processing" | "Early Hints" | "OK" | "Created" | "Accepted" | "Non-Authoritative Information" | "No Content" | "Reset Content" | "Partial Content" | "Multi-Status" | "Already Reported" | "Multiple Choices" | "Moved Permanently" | "Found" | "See Other" | "Not Modified" | "Temporary Redirect" | "Permanent Redirect" | "Bad Request" | "Unauthorized" | "Payment Required" | "Forbidden" | "Not Found" | "Method Not Allowed" | "Not Acceptable" | "Proxy Authentication Required" | "Request Timeout" | "Conflict" | "Gone" | "Length Required" | "Precondition Failed" | "Payload Too Large" | "URI Too Long" | "Unsupported Media Type" | "Range Not Satisfiable" | "Expectation Failed" | "I'm a teapot" | "Enhance Your Calm" | "Misdirected Request" | "Unprocessable Content" | "Locked" | "Failed Dependency" | "Too Early" | "Upgrade Required" | "Precondition Required" | "Too Many Requests" | "Request Header Fields Too Large" | "Unavailable For Legal Reasons" | "Internal Server Error" | "Not Implemented" | "Bad Gateway" | "Service Unavailable" | "Gateway Timeout" | "HTTP Version Not Supported" | "Variant Also Negotiates" | "Insufficient Storage" | "Loop Detected" | "Not Extended" | "Network Authentication Required" ? {
                    readonly Continue: 100;
                    readonly "Switching Protocols": 101;
                    readonly Processing: 102;
                    readonly "Early Hints": 103;
                    readonly OK: 200;
                    readonly Created: 201;
                    readonly Accepted: 202;
                    readonly "Non-Authoritative Information": 203;
                    readonly "No Content": 204;
                    readonly "Reset Content": 205;
                    readonly "Partial Content": 206;
                    readonly "Multi-Status": 207;
                    readonly "Already Reported": 208;
                    readonly "Multiple Choices": 300;
                    readonly "Moved Permanently": 301;
                    readonly Found: 302;
                    readonly "See Other": 303;
                    readonly "Not Modified": 304;
                    readonly "Temporary Redirect": 307;
                    readonly "Permanent Redirect": 308;
                    readonly "Bad Request": 400;
                    readonly Unauthorized: 401;
                    readonly "Payment Required": 402;
                    readonly Forbidden: 403;
                    readonly "Not Found": 404;
                    readonly "Method Not Allowed": 405;
                    readonly "Not Acceptable": 406;
                    readonly "Proxy Authentication Required": 407;
                    readonly "Request Timeout": 408;
                    readonly Conflict: 409;
                    readonly Gone: 410;
                    readonly "Length Required": 411;
                    readonly "Precondition Failed": 412;
                    readonly "Payload Too Large": 413;
                    readonly "URI Too Long": 414;
                    readonly "Unsupported Media Type": 415;
                    readonly "Range Not Satisfiable": 416;
                    readonly "Expectation Failed": 417;
                    readonly "I'm a teapot": 418;
                    readonly "Enhance Your Calm": 420;
                    readonly "Misdirected Request": 421;
                    readonly "Unprocessable Content": 422;
                    readonly Locked: 423;
                    readonly "Failed Dependency": 424;
                    readonly "Too Early": 425;
                    readonly "Upgrade Required": 426;
                    readonly "Precondition Required": 428;
                    readonly "Too Many Requests": 429;
                    readonly "Request Header Fields Too Large": 431;
                    readonly "Unavailable For Legal Reasons": 451;
                    readonly "Internal Server Error": 500;
                    readonly "Not Implemented": 501;
                    readonly "Bad Gateway": 502;
                    readonly "Service Unavailable": 503;
                    readonly "Gateway Timeout": 504;
                    readonly "HTTP Version Not Supported": 505;
                    readonly "Variant Also Negotiates": 506;
                    readonly "Insufficient Storage": 507;
                    readonly "Loop Detected": 508;
                    readonly "Not Extended": 510;
                    readonly "Network Authentication Required": 511;
                }[Code] : Code>;
            }) => Promise<import("elysia").ElysiaCustomStatusResponse<401, {
                readonly message: "غير مصرح";
            }, 401> | import("elysia").ElysiaCustomStatusResponse<403, {
                readonly message: "لا تملك صلاحية عرض التجميل";
            }, 403> | {
                clinicId: string;
                isAdmin: boolean;
                permissions: string[];
                userId: string;
            }>;
        };
    };
    parser: {};
    response: {};
}, {
    "grooming-definitions": {};
} & {
    "grooming-definitions": {
        templates: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: import("../grooming-definitions/grooming-definitions.type").GroomingTemplateResponse[];
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض التجميل";
                    };
                };
            };
        };
    };
} & {
    "grooming-definitions": {
        service: {
            ":serviceId": {
                get: {
                    body: {};
                    params: {
                        serviceId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            active: boolean;
                            serviceId: string;
                            kind: import("../../../generated/prisma/enums").GroomingServiceKind;
                            dryingMinutes: number;
                            lane: import("../../../generated/prisma/enums").GroomingLane;
                            requiresVetOrder: boolean;
                            isAddOn: boolean;
                            basePrice: import("@prisma/client-runtime-utils").Decimal;
                            baseDurationMin: number;
                            speciesScope: string[];
                            requiresStation: boolean;
                            priceRules: {
                                id: string;
                                createdAt: Date;
                                animalTypeId: string | null;
                                animalStrainId: string | null;
                                price: import("@prisma/client-runtime-utils").Decimal;
                                definitionId: string;
                                sizeBand: import("../../../generated/prisma/enums").GroomingSizeBand | null;
                                coatType: import("../animal-strains/animal-strains.type").HairType | null;
                                durationMin: number;
                                dryingMinutes: number | null;
                            }[];
                        } | null;
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض التجميل";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    "grooming-definitions": {
        service: {
            ":serviceId": {
                put: {
                    body: {
                        active?: boolean | undefined;
                        dryingMinutes?: number | undefined;
                        lane?: "MEDICAL" | "COSMETIC" | undefined;
                        requiresVetOrder?: boolean | undefined;
                        isAddOn?: boolean | undefined;
                        basePrice?: number | undefined;
                        baseDurationMin?: number | undefined;
                        speciesScope?: string[] | undefined;
                        requiresStation?: boolean | undefined;
                        kind: "OTHER" | "BATH" | "FULL_GROOM" | "TIDY_UP" | "DESHED" | "NAIL_TRIM" | "EAR_CLEAN" | "ANAL_GLANDS" | "TEETH_BRUSH" | "DEMATTING" | "SHAVE_DOWN" | "MEDICATED_BATH" | "PARASITE_DIP" | "WOUND_CARE_CLIP" | "SPA_ADDON";
                    };
                    params: {
                        serviceId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            active: boolean;
                            serviceId: string;
                            kind: import("../../../generated/prisma/enums").GroomingServiceKind;
                            dryingMinutes: number;
                            lane: import("../../../generated/prisma/enums").GroomingLane;
                            requiresVetOrder: boolean;
                            isAddOn: boolean;
                            basePrice: import("@prisma/client-runtime-utils").Decimal;
                            baseDurationMin: number;
                            speciesScope: string[];
                            requiresStation: boolean;
                            priceRules: {
                                id: string;
                                createdAt: Date;
                                animalTypeId: string | null;
                                animalStrainId: string | null;
                                price: import("@prisma/client-runtime-utils").Decimal;
                                definitionId: string;
                                sizeBand: import("../../../generated/prisma/enums").GroomingSizeBand | null;
                                coatType: import("../animal-strains/animal-strains.type").HairType | null;
                                durationMin: number;
                                dryingMinutes: number | null;
                            }[];
                        };
                        400: {
                            readonly message: "هذه الدورة ليست ضمن فئة التجميل";
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض التجميل";
                        } | {
                            readonly message: "لا تملك صلاحية تعديل كتالوج التجميل";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    "grooming-definitions": {
        ":definitionId": {
            "price-rules": {
                get: {
                    body: {};
                    params: {
                        definitionId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            createdAt: Date;
                            animalTypeId: string | null;
                            animalStrainId: string | null;
                            price: import("@prisma/client-runtime-utils").Decimal;
                            definitionId: string;
                            sizeBand: import("../../../generated/prisma/enums").GroomingSizeBand | null;
                            coatType: import("../animal-strains/animal-strains.type").HairType | null;
                            durationMin: number;
                            dryingMinutes: number | null;
                        }[];
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض التجميل";
                        };
                        404: {
                            readonly message: "تعريف دورة التجميل غير موجود";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    "grooming-definitions": {
        ":definitionId": {
            "price-rules": {
                put: {
                    body: {
                        rules: {
                            animalTypeId?: string | null | undefined;
                            animalStrainId?: string | null | undefined;
                            sizeBand?: "MEDIUM" | "SMALL" | "LARGE" | "TOY" | "GIANT" | null | undefined;
                            coatType?: "NONE" | "LONG_THICK" | "SHORT_THICK" | "LIGHT" | "MEDIUM" | "DOUBLE_COAT" | null | undefined;
                            dryingMinutes?: number | null | undefined;
                            price: number;
                            durationMin: number;
                        }[];
                    };
                    params: {
                        definitionId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            createdAt: Date;
                            animalTypeId: string | null;
                            animalStrainId: string | null;
                            price: import("@prisma/client-runtime-utils").Decimal;
                            definitionId: string;
                            sizeBand: import("../../../generated/prisma/enums").GroomingSizeBand | null;
                            coatType: import("../animal-strains/animal-strains.type").HairType | null;
                            durationMin: number;
                            dryingMinutes: number | null;
                        }[];
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض التجميل";
                        } | {
                            readonly message: "لا تملك صلاحية تعديل أسعار التجميل";
                        };
                        404: {
                            readonly message: "تعريف دورة التجميل غير موجود";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    "grooming-definitions": {
        modifiers: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        value: import("@prisma/client-runtime-utils").Decimal;
                        id: string;
                        code: import("../../../generated/prisma/enums").GroomingModifierCode;
                        active: boolean;
                        labelAr: string;
                        calc: import("../../../generated/prisma/enums").GroomingModifierCalc;
                        autoAppliesFrom: number | null;
                        requiresOwnerApproval: boolean;
                    }[];
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض التجميل";
                    };
                };
            };
        };
    };
} & {
    "grooming-definitions": {
        modifiers: {
            put: {
                body: {
                    active?: boolean | undefined;
                    autoAppliesFrom?: number | null | undefined;
                    requiresOwnerApproval?: boolean | undefined;
                    value: number;
                    code: "SHAVE_DOWN" | "MATTING" | "BEHAVIOR" | "SENIOR" | "FLEA" | "SECOND_PET" | "EXPRESS" | "OUT_OF_HOURS";
                    labelAr: string;
                    calc: "PERCENT" | "FIXED" | "PER_MINUTE";
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        value: import("@prisma/client-runtime-utils").Decimal;
                        id: string;
                        code: import("../../../generated/prisma/enums").GroomingModifierCode;
                        active: boolean;
                        labelAr: string;
                        calc: import("../../../generated/prisma/enums").GroomingModifierCalc;
                        autoAppliesFrom: number | null;
                        requiresOwnerApproval: boolean;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض التجميل";
                    } | {
                        readonly message: "لا تملك صلاحية تعديل رسوم التجميل";
                    };
                    422: {
                        type: "validation";
                        on: string;
                        summary?: string;
                        message?: string;
                        found?: unknown;
                        property?: string;
                        expected?: string;
                    };
                };
            };
        };
    };
} & {
    "grooming-definitions": {
        capacity: {
            ":branchId": {
                get: {
                    body: {};
                    params: {
                        branchId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            branchId: string;
                            stations: number;
                            dryerSlots: number;
                            maxPetsPerDay: number | null;
                            maxHeatSensitiveConcurrent: number;
                            dropOffWindowMin: number;
                            requireDepositPercent: import("@prisma/client-runtime-utils").Decimal | null;
                            seniorAgeYears: number;
                            quoteReapprovalPercent: import("@prisma/client-runtime-utils").Decimal;
                        } | null;
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض التجميل";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    "grooming-definitions": {
        capacity: {
            ":branchId": {
                put: {
                    body: {
                        stations?: number | undefined;
                        dryerSlots?: number | undefined;
                        maxPetsPerDay?: number | null | undefined;
                        maxHeatSensitiveConcurrent?: number | undefined;
                        dropOffWindowMin?: number | undefined;
                        requireDepositPercent?: number | null | undefined;
                        seniorAgeYears?: number | undefined;
                        quoteReapprovalPercent?: number | undefined;
                    };
                    params: {
                        branchId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            clinicId: string;
                            branchId: string;
                            stations: number;
                            dryerSlots: number;
                            maxPetsPerDay: number | null;
                            maxHeatSensitiveConcurrent: number;
                            dropOffWindowMin: number;
                            requireDepositPercent: import("@prisma/client-runtime-utils").Decimal | null;
                            seniorAgeYears: number;
                            quoteReapprovalPercent: import("@prisma/client-runtime-utils").Decimal;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض التجميل";
                        } | {
                            readonly message: "لا تملك صلاحية تعديل إعدادات التجميل";
                        };
                        404: {
                            readonly message: "الفرع غير موجود";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    "grooming-definitions": {
        "quote-preview": {
            post: {
                body: {
                    definitionIds: string[];
                    pet: {
                        animalTypeId?: string | null | undefined;
                        animalStrainId?: string | null | undefined;
                        sizeBand?: "MEDIUM" | "SMALL" | "LARGE" | "TOY" | "GIANT" | null | undefined;
                        coatType?: "NONE" | "LONG_THICK" | "SHORT_THICK" | "LIGHT" | "MEDIUM" | "DOUBLE_COAT" | null | undefined;
                        weightKg?: number | null | undefined;
                    };
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: import("./grooming-pricing.service").GroomingQuote;
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض التجميل";
                    };
                    404: {
                        readonly message: "لا توجد تعريفات تجميل مطابقة";
                    };
                    422: {
                        type: "validation";
                        on: string;
                        summary?: string;
                        message?: string;
                        found?: unknown;
                        property?: string;
                        expected?: string;
                    };
                };
            };
        };
    };
} & {
    grooming: {};
} & {
    grooming: {
        get: {
            body: {};
            params: {};
            query: {};
            headers: {};
            response: {
                200: {
                    owner: {
                        name: string;
                        id: string;
                        phone: string;
                    };
                    patient: {
                        animalType: {
                            arName: string;
                        };
                        animalStrain: {
                            arName: string;
                            isBrachycephalic: boolean;
                        } | null;
                        name: string;
                        id: string;
                        code: string;
                    };
                    id: string;
                    _count: {
                        findings: number;
                        incidents: number;
                    };
                    code: string;
                    status: import("../../../generated/prisma/enums").GroomingStatus;
                    scheduledAt: Date;
                    stage: import("../../../generated/prisma/enums").GroomingStage | null;
                    lane: import("../../../generated/prisma/enums").GroomingLane;
                    estimatedDurationMin: number;
                    promisedReadyAt: Date | null;
                    readyAt: Date | null;
                    quoteTotal: import("@prisma/client-runtime-utils").Decimal;
                    sedationPlanned: boolean;
                    dryingMethod: import("../../../generated/prisma/enums").GroomingDryingMethod | null;
                    groomer: {
                        user: {
                            name: string;
                        } | null;
                        id: string;
                    };
                    station: {
                        name: string;
                        id: string;
                    } | null;
                    intake: {
                        mattingGrade: import("../../../generated/prisma/enums").MattingGrade;
                        parasiteFinding: import("../../../generated/prisma/enums").ParasiteFinding;
                        behaviorScore: import("../../../generated/prisma/enums").GroomingBehaviorScore;
                        heatDryProhibitedSnapshot: boolean;
                    } | null;
                }[];
                401: {
                    readonly message: "غير مصرح";
                };
                403: {
                    readonly message: "لا تملك صلاحية عرض التجميل";
                };
            };
        };
    };
} & {
    grooming: {
        stats: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        today: number;
                        inCustody: number;
                        ready: number;
                        overdue: number;
                        openIncidents: number;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض التجميل";
                    };
                };
            };
        };
    };
} & {
    grooming: {
        due: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: import("./grooming.type").GroomingDueRow[];
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض التجميل";
                    };
                };
            };
        };
    };
} & {
    grooming: {
        ":id": {
            get: {
                body: {};
                params: {
                    id: string;
                };
                query: {};
                headers: {};
                response: {
                    200: {
                        owner: {
                            name: string;
                            id: string;
                            phone: string;
                        };
                        patient: {
                            animalType: {
                                arName: string;
                            };
                            animalStrain: {
                                arName: string;
                                isBrachycephalic: boolean;
                            } | null;
                            name: string;
                            id: string;
                            code: string;
                        };
                        invoice: {
                            discount: import("@prisma/client-runtime-utils").Decimal;
                            id: string;
                            vatRate: import("@prisma/client-runtime-utils").Decimal;
                            currencyCode: string;
                            code: string;
                            status: import("../invoices/invoices.type").InvoiceStatus;
                            total: import("@prisma/client-runtime-utils").Decimal;
                            vatAmount: import("@prisma/client-runtime-utils").Decimal;
                            paymentMethod: import("../invoices/invoices.type").PaymentMethod | null;
                            paidAt: Date | null;
                            subtotal: import("@prisma/client-runtime-utils").Decimal;
                            amountPaid: import("@prisma/client-runtime-utils").Decimal;
                        } | null;
                        id: string;
                        createdAt: Date;
                        _count: {
                            findings: number;
                            incidents: number;
                        };
                        code: string;
                        branchId: string;
                        status: import("../../../generated/prisma/enums").GroomingStatus;
                        items: {
                            id: string;
                            notes: string | null;
                            serviceId: string | null;
                            quantity: number;
                            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                            durationSnapshot: number;
                            nameSnapshot: string;
                            definitionId: string | null;
                            performed: boolean;
                            laneSnapshot: import("../../../generated/prisma/enums").GroomingLane;
                            dryingSnapshot: number;
                            priceLevelSnapshot: string | null;
                            matchedRuleId: string | null;
                        }[];
                        products: {
                            id: string;
                            quantity: import("@prisma/client-runtime-utils").Decimal;
                            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                            inventoryItemId: string | null;
                            nameSnapshot: string;
                            issuedAt: Date | null;
                            billable: boolean;
                            dilution: string | null;
                            contactTimeMin: number | null;
                            bodyZones: string[];
                        }[];
                        appointmentId: string | null;
                        cancelReason: string | null;
                        startedAt: Date | null;
                        completedAt: Date | null;
                        scheduledAt: Date;
                        stage: import("../../../generated/prisma/enums").GroomingStage | null;
                        photos: {
                            url: string;
                            id: string;
                            createdAt: Date;
                            kind: import("../../../generated/prisma/enums").GroomingPhotoKind;
                            caption: string | null;
                            bodyZone: string | null;
                        }[];
                        lane: import("../../../generated/prisma/enums").GroomingLane;
                        estimatedDurationMin: number;
                        adjustments: {
                            id: string;
                            reason: string | null;
                            amount: import("@prisma/client-runtime-utils").Decimal;
                            source: import("../../../generated/prisma/enums").GroomingAdjustmentSource;
                            modifierCode: import("../../../generated/prisma/enums").GroomingModifierCode;
                            labelSnapshot: string;
                            approvedByOwnerAt: Date | null;
                        }[];
                        cancelKind: import("../../../generated/prisma/enums").GroomingCancelKind | null;
                        findings: {
                            id: string;
                            createdAt: Date;
                            labOrderId: string | null;
                            category: import("../../../generated/prisma/enums").GroomingFindingCategory;
                            severity: import("../../../generated/prisma/enums").GroomingFindingSeverity;
                            note: string;
                            bodyZone: string | null;
                            photoId: string | null;
                            acknowledgedAt: Date | null;
                            referralAppointmentId: string | null;
                            dismissedReason: string | null;
                        }[];
                        promisedReadyAt: Date | null;
                        readyAt: Date | null;
                        quoteTotal: import("@prisma/client-runtime-utils").Decimal;
                        sedationPlanned: boolean;
                        dryingMethod: import("../../../generated/prisma/enums").GroomingDryingMethod | null;
                        groomer: {
                            user: {
                                name: string;
                            } | null;
                            id: string;
                        };
                        station: {
                            name: string;
                            id: string;
                        } | null;
                        intake: {
                            id: string;
                            notes: string | null;
                            earCondition: import("../../../generated/prisma/enums").EarCondition;
                            weightKg: import("@prisma/client-runtime-utils").Decimal | null;
                            temperatureC: import("@prisma/client-runtime-utils").Decimal | null;
                            mattingGrade: import("../../../generated/prisma/enums").MattingGrade;
                            coatCondition: import("../../../generated/prisma/enums").CoatCondition;
                            parasiteFinding: import("../../../generated/prisma/enums").ParasiteFinding;
                            skinFindings: string[];
                            nailCondition: import("../../../generated/prisma/enums").NailCondition;
                            dentalNote: string | null;
                            behaviorScore: import("../../../generated/prisma/enums").GroomingBehaviorScore;
                            muzzleUsed: boolean;
                            rabiesValidUntil: Date | null;
                            vaccinationOverrideReason: string | null;
                            shaveDownRecommended: boolean;
                            shaveDownApprovedAt: Date | null;
                            heatDryProhibitedSnapshot: boolean;
                            heatDryReasonsSnapshot: string[];
                            parasiteTreatedAt: Date | null;
                            parasiteOwnerNotifiedAt: Date | null;
                            isolationAcknowledgedAt: Date | null;
                            belongings: string[];
                            performedAt: Date;
                        } | null;
                        assistantId: string | null;
                        vetOrderStaffId: string | null;
                        vetOrderNote: string | null;
                        dropOffAt: Date | null;
                        checkedInAt: Date | null;
                        dryingStartedAt: Date | null;
                        pickedUpAt: Date | null;
                        quoteSubtotal: import("@prisma/client-runtime-utils").Decimal;
                        quoteAdjustments: import("@prisma/client-runtime-utils").Decimal;
                        bookedQuoteTotal: import("@prisma/client-runtime-utils").Decimal;
                        ownerApprovedQuoteAt: Date | null;
                        incidents: {
                            id: string;
                            createdAt: Date;
                            description: string;
                            resolvedAt: Date | null;
                            kind: import("../../../generated/prisma/enums").GroomingIncidentKind;
                            severity: import("../../../generated/prisma/enums").GroomingIncidentSeverity;
                            followUpAppointmentId: string | null;
                            actionTaken: string | null;
                            ownerNotifiedAt: Date | null;
                            vetAssessedByStaffId: string | null;
                            vetAssessmentNote: string | null;
                        }[];
                        reportCard: {
                            id: string;
                            summary: string;
                            sentAt: Date | null;
                            moodScore: import("../../../generated/prisma/enums").GroomingMoodScore;
                            recommendedIntervalWeeks: number | null;
                            nextRecommendedAt: Date | null;
                            publicToken: string;
                            channel: import("../../../generated/prisma/enums").ReportCardChannel | null;
                            rebookedSessionId: string | null;
                        } | null;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: "لا تملك صلاحية عرض التجميل";
                    };
                    404: {
                        readonly message: "جلسة التجميل غير موجودة";
                    };
                    422: {
                        type: "validation";
                        on: string;
                        summary?: string;
                        message?: string;
                        found?: unknown;
                        property?: string;
                        expected?: string;
                    };
                };
            };
        };
    };
} & {
    grooming: {
        ":id": {
            activity: {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: import("./grooming.type").GroomingActivityResponse[];
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض التجميل";
                        };
                        404: {
                            readonly message: "جلسة التجميل غير موجودة";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    grooming: {
        post: {
            body: {
                lane?: "MEDICAL" | "COSMETIC" | undefined;
                sedationPlanned?: boolean | undefined;
                assistantId?: string | null | undefined;
                stationId?: string | null | undefined;
                vetOrderStaffId?: string | null | undefined;
                vetOrderNote?: string | null | undefined;
                dropOffAt?: string | null | undefined;
                branchId: string;
                patientId: string;
                scheduledAt: string;
                groomerId: string;
                definitionIds: string[];
            };
            params: {};
            query: {};
            headers: {};
            response: {
                200: {
                    owner: {
                        name: string;
                        id: string;
                        phone: string;
                    };
                    patient: {
                        animalType: {
                            arName: string;
                        };
                        animalStrain: {
                            arName: string;
                            isBrachycephalic: boolean;
                        } | null;
                        name: string;
                        id: string;
                        code: string;
                    };
                    invoice: {
                        discount: import("@prisma/client-runtime-utils").Decimal;
                        id: string;
                        vatRate: import("@prisma/client-runtime-utils").Decimal;
                        currencyCode: string;
                        code: string;
                        status: import("../invoices/invoices.type").InvoiceStatus;
                        total: import("@prisma/client-runtime-utils").Decimal;
                        vatAmount: import("@prisma/client-runtime-utils").Decimal;
                        paymentMethod: import("../invoices/invoices.type").PaymentMethod | null;
                        paidAt: Date | null;
                        subtotal: import("@prisma/client-runtime-utils").Decimal;
                        amountPaid: import("@prisma/client-runtime-utils").Decimal;
                    } | null;
                    id: string;
                    createdAt: Date;
                    _count: {
                        findings: number;
                        incidents: number;
                    };
                    code: string;
                    branchId: string;
                    status: import("../../../generated/prisma/enums").GroomingStatus;
                    items: {
                        id: string;
                        notes: string | null;
                        serviceId: string | null;
                        quantity: number;
                        priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                        durationSnapshot: number;
                        nameSnapshot: string;
                        definitionId: string | null;
                        performed: boolean;
                        laneSnapshot: import("../../../generated/prisma/enums").GroomingLane;
                        dryingSnapshot: number;
                        priceLevelSnapshot: string | null;
                        matchedRuleId: string | null;
                    }[];
                    products: {
                        id: string;
                        quantity: import("@prisma/client-runtime-utils").Decimal;
                        priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                        inventoryItemId: string | null;
                        nameSnapshot: string;
                        issuedAt: Date | null;
                        billable: boolean;
                        dilution: string | null;
                        contactTimeMin: number | null;
                        bodyZones: string[];
                    }[];
                    appointmentId: string | null;
                    cancelReason: string | null;
                    startedAt: Date | null;
                    completedAt: Date | null;
                    scheduledAt: Date;
                    stage: import("../../../generated/prisma/enums").GroomingStage | null;
                    photos: {
                        url: string;
                        id: string;
                        createdAt: Date;
                        kind: import("../../../generated/prisma/enums").GroomingPhotoKind;
                        caption: string | null;
                        bodyZone: string | null;
                    }[];
                    lane: import("../../../generated/prisma/enums").GroomingLane;
                    estimatedDurationMin: number;
                    adjustments: {
                        id: string;
                        reason: string | null;
                        amount: import("@prisma/client-runtime-utils").Decimal;
                        source: import("../../../generated/prisma/enums").GroomingAdjustmentSource;
                        modifierCode: import("../../../generated/prisma/enums").GroomingModifierCode;
                        labelSnapshot: string;
                        approvedByOwnerAt: Date | null;
                    }[];
                    cancelKind: import("../../../generated/prisma/enums").GroomingCancelKind | null;
                    findings: {
                        id: string;
                        createdAt: Date;
                        labOrderId: string | null;
                        category: import("../../../generated/prisma/enums").GroomingFindingCategory;
                        severity: import("../../../generated/prisma/enums").GroomingFindingSeverity;
                        note: string;
                        bodyZone: string | null;
                        photoId: string | null;
                        acknowledgedAt: Date | null;
                        referralAppointmentId: string | null;
                        dismissedReason: string | null;
                    }[];
                    promisedReadyAt: Date | null;
                    readyAt: Date | null;
                    quoteTotal: import("@prisma/client-runtime-utils").Decimal;
                    sedationPlanned: boolean;
                    dryingMethod: import("../../../generated/prisma/enums").GroomingDryingMethod | null;
                    groomer: {
                        user: {
                            name: string;
                        } | null;
                        id: string;
                    };
                    station: {
                        name: string;
                        id: string;
                    } | null;
                    intake: {
                        id: string;
                        notes: string | null;
                        earCondition: import("../../../generated/prisma/enums").EarCondition;
                        weightKg: import("@prisma/client-runtime-utils").Decimal | null;
                        temperatureC: import("@prisma/client-runtime-utils").Decimal | null;
                        mattingGrade: import("../../../generated/prisma/enums").MattingGrade;
                        coatCondition: import("../../../generated/prisma/enums").CoatCondition;
                        parasiteFinding: import("../../../generated/prisma/enums").ParasiteFinding;
                        skinFindings: string[];
                        nailCondition: import("../../../generated/prisma/enums").NailCondition;
                        dentalNote: string | null;
                        behaviorScore: import("../../../generated/prisma/enums").GroomingBehaviorScore;
                        muzzleUsed: boolean;
                        rabiesValidUntil: Date | null;
                        vaccinationOverrideReason: string | null;
                        shaveDownRecommended: boolean;
                        shaveDownApprovedAt: Date | null;
                        heatDryProhibitedSnapshot: boolean;
                        heatDryReasonsSnapshot: string[];
                        parasiteTreatedAt: Date | null;
                        parasiteOwnerNotifiedAt: Date | null;
                        isolationAcknowledgedAt: Date | null;
                        belongings: string[];
                        performedAt: Date;
                    } | null;
                    assistantId: string | null;
                    vetOrderStaffId: string | null;
                    vetOrderNote: string | null;
                    dropOffAt: Date | null;
                    checkedInAt: Date | null;
                    dryingStartedAt: Date | null;
                    pickedUpAt: Date | null;
                    quoteSubtotal: import("@prisma/client-runtime-utils").Decimal;
                    quoteAdjustments: import("@prisma/client-runtime-utils").Decimal;
                    bookedQuoteTotal: import("@prisma/client-runtime-utils").Decimal;
                    ownerApprovedQuoteAt: Date | null;
                    incidents: {
                        id: string;
                        createdAt: Date;
                        description: string;
                        resolvedAt: Date | null;
                        kind: import("../../../generated/prisma/enums").GroomingIncidentKind;
                        severity: import("../../../generated/prisma/enums").GroomingIncidentSeverity;
                        followUpAppointmentId: string | null;
                        actionTaken: string | null;
                        ownerNotifiedAt: Date | null;
                        vetAssessedByStaffId: string | null;
                        vetAssessmentNote: string | null;
                    }[];
                    reportCard: {
                        id: string;
                        summary: string;
                        sentAt: Date | null;
                        moodScore: import("../../../generated/prisma/enums").GroomingMoodScore;
                        recommendedIntervalWeeks: number | null;
                        nextRecommendedAt: Date | null;
                        publicToken: string;
                        channel: import("../../../generated/prisma/enums").ReportCardChannel | null;
                        rebookedSessionId: string | null;
                    } | null;
                };
                400: {
                    readonly message: "الطفل غير موجود أو بلا وليّ أمر مسجَّل";
                };
                401: {
                    readonly message: "غير مصرح";
                };
                403: {
                    readonly message: "لا تملك صلاحية عرض التجميل";
                } | {
                    readonly message: "لا تملك صلاحية إنشاء جلسة تجميل";
                };
                409: {
                    readonly message: string;
                    readonly gate: import("./grooming.workflow").GroomingGate | null;
                };
                422: {
                    type: "validation";
                    on: string;
                    summary?: string;
                    message?: string;
                    found?: unknown;
                    property?: string;
                    expected?: string;
                };
            };
        };
    };
} & {
    grooming: {
        ":id": {
            status: {
                post: {
                    body: {
                        cancelReason?: string | null | undefined;
                        overrideReason?: string | null | undefined;
                        cancelKind?: "NO_SHOW" | "OWNER_CANCELLED" | "CLINIC_CANCELLED" | "HEALTH_REFUSAL" | "BEHAVIOR_REFUSAL" | null | undefined;
                        to: "CANCELLED" | "IN_PROGRESS" | "COMPLETED" | "SCHEDULED" | "CHECK_IN" | "NO_SHOW" | "INTAKE" | "FINISHING" | "READY" | "PICKED_UP" | "ESCALATED";
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                            };
                            patient: {
                                animalType: {
                                    arName: string;
                                };
                                animalStrain: {
                                    arName: string;
                                    isBrachycephalic: boolean;
                                } | null;
                                name: string;
                                id: string;
                                code: string;
                            };
                            invoice: {
                                discount: import("@prisma/client-runtime-utils").Decimal;
                                id: string;
                                vatRate: import("@prisma/client-runtime-utils").Decimal;
                                currencyCode: string;
                                code: string;
                                status: import("../invoices/invoices.type").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                                vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                paymentMethod: import("../invoices/invoices.type").PaymentMethod | null;
                                paidAt: Date | null;
                                subtotal: import("@prisma/client-runtime-utils").Decimal;
                                amountPaid: import("@prisma/client-runtime-utils").Decimal;
                            } | null;
                            id: string;
                            createdAt: Date;
                            _count: {
                                findings: number;
                                incidents: number;
                            };
                            code: string;
                            branchId: string;
                            status: import("../../../generated/prisma/enums").GroomingStatus;
                            items: {
                                id: string;
                                notes: string | null;
                                serviceId: string | null;
                                quantity: number;
                                priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                durationSnapshot: number;
                                nameSnapshot: string;
                                definitionId: string | null;
                                performed: boolean;
                                laneSnapshot: import("../../../generated/prisma/enums").GroomingLane;
                                dryingSnapshot: number;
                                priceLevelSnapshot: string | null;
                                matchedRuleId: string | null;
                            }[];
                            products: {
                                id: string;
                                quantity: import("@prisma/client-runtime-utils").Decimal;
                                priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                inventoryItemId: string | null;
                                nameSnapshot: string;
                                issuedAt: Date | null;
                                billable: boolean;
                                dilution: string | null;
                                contactTimeMin: number | null;
                                bodyZones: string[];
                            }[];
                            appointmentId: string | null;
                            cancelReason: string | null;
                            startedAt: Date | null;
                            completedAt: Date | null;
                            scheduledAt: Date;
                            stage: import("../../../generated/prisma/enums").GroomingStage | null;
                            photos: {
                                url: string;
                                id: string;
                                createdAt: Date;
                                kind: import("../../../generated/prisma/enums").GroomingPhotoKind;
                                caption: string | null;
                                bodyZone: string | null;
                            }[];
                            lane: import("../../../generated/prisma/enums").GroomingLane;
                            estimatedDurationMin: number;
                            adjustments: {
                                id: string;
                                reason: string | null;
                                amount: import("@prisma/client-runtime-utils").Decimal;
                                source: import("../../../generated/prisma/enums").GroomingAdjustmentSource;
                                modifierCode: import("../../../generated/prisma/enums").GroomingModifierCode;
                                labelSnapshot: string;
                                approvedByOwnerAt: Date | null;
                            }[];
                            cancelKind: import("../../../generated/prisma/enums").GroomingCancelKind | null;
                            findings: {
                                id: string;
                                createdAt: Date;
                                labOrderId: string | null;
                                category: import("../../../generated/prisma/enums").GroomingFindingCategory;
                                severity: import("../../../generated/prisma/enums").GroomingFindingSeverity;
                                note: string;
                                bodyZone: string | null;
                                photoId: string | null;
                                acknowledgedAt: Date | null;
                                referralAppointmentId: string | null;
                                dismissedReason: string | null;
                            }[];
                            promisedReadyAt: Date | null;
                            readyAt: Date | null;
                            quoteTotal: import("@prisma/client-runtime-utils").Decimal;
                            sedationPlanned: boolean;
                            dryingMethod: import("../../../generated/prisma/enums").GroomingDryingMethod | null;
                            groomer: {
                                user: {
                                    name: string;
                                } | null;
                                id: string;
                            };
                            station: {
                                name: string;
                                id: string;
                            } | null;
                            intake: {
                                id: string;
                                notes: string | null;
                                earCondition: import("../../../generated/prisma/enums").EarCondition;
                                weightKg: import("@prisma/client-runtime-utils").Decimal | null;
                                temperatureC: import("@prisma/client-runtime-utils").Decimal | null;
                                mattingGrade: import("../../../generated/prisma/enums").MattingGrade;
                                coatCondition: import("../../../generated/prisma/enums").CoatCondition;
                                parasiteFinding: import("../../../generated/prisma/enums").ParasiteFinding;
                                skinFindings: string[];
                                nailCondition: import("../../../generated/prisma/enums").NailCondition;
                                dentalNote: string | null;
                                behaviorScore: import("../../../generated/prisma/enums").GroomingBehaviorScore;
                                muzzleUsed: boolean;
                                rabiesValidUntil: Date | null;
                                vaccinationOverrideReason: string | null;
                                shaveDownRecommended: boolean;
                                shaveDownApprovedAt: Date | null;
                                heatDryProhibitedSnapshot: boolean;
                                heatDryReasonsSnapshot: string[];
                                parasiteTreatedAt: Date | null;
                                parasiteOwnerNotifiedAt: Date | null;
                                isolationAcknowledgedAt: Date | null;
                                belongings: string[];
                                performedAt: Date;
                            } | null;
                            assistantId: string | null;
                            vetOrderStaffId: string | null;
                            vetOrderNote: string | null;
                            dropOffAt: Date | null;
                            checkedInAt: Date | null;
                            dryingStartedAt: Date | null;
                            pickedUpAt: Date | null;
                            quoteSubtotal: import("@prisma/client-runtime-utils").Decimal;
                            quoteAdjustments: import("@prisma/client-runtime-utils").Decimal;
                            bookedQuoteTotal: import("@prisma/client-runtime-utils").Decimal;
                            ownerApprovedQuoteAt: Date | null;
                            incidents: {
                                id: string;
                                createdAt: Date;
                                description: string;
                                resolvedAt: Date | null;
                                kind: import("../../../generated/prisma/enums").GroomingIncidentKind;
                                severity: import("../../../generated/prisma/enums").GroomingIncidentSeverity;
                                followUpAppointmentId: string | null;
                                actionTaken: string | null;
                                ownerNotifiedAt: Date | null;
                                vetAssessedByStaffId: string | null;
                                vetAssessmentNote: string | null;
                            }[];
                            reportCard: {
                                id: string;
                                summary: string;
                                sentAt: Date | null;
                                moodScore: import("../../../generated/prisma/enums").GroomingMoodScore;
                                recommendedIntervalWeeks: number | null;
                                nextRecommendedAt: Date | null;
                                publicToken: string;
                                channel: import("../../../generated/prisma/enums").ReportCardChannel | null;
                                rebookedSessionId: string | null;
                            } | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض التجميل";
                        } | {
                            readonly message: "لا تملك صلاحية تعديل جلسات التجميل";
                        };
                        409: {
                            readonly message: string;
                            readonly gate: import("./grooming.workflow").GroomingGate | null;
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    grooming: {
        ":id": {
            "drying-method": {
                post: {
                    body: {
                        method: "HAND_ROOM_TEMP" | "FAN_ONLY" | "CAGE_UNHEATED" | "FORCED_AIR" | "CAGE_HEATED";
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                            };
                            patient: {
                                animalType: {
                                    arName: string;
                                };
                                animalStrain: {
                                    arName: string;
                                    isBrachycephalic: boolean;
                                } | null;
                                name: string;
                                id: string;
                                code: string;
                            };
                            invoice: {
                                discount: import("@prisma/client-runtime-utils").Decimal;
                                id: string;
                                vatRate: import("@prisma/client-runtime-utils").Decimal;
                                currencyCode: string;
                                code: string;
                                status: import("../invoices/invoices.type").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                                vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                paymentMethod: import("../invoices/invoices.type").PaymentMethod | null;
                                paidAt: Date | null;
                                subtotal: import("@prisma/client-runtime-utils").Decimal;
                                amountPaid: import("@prisma/client-runtime-utils").Decimal;
                            } | null;
                            id: string;
                            createdAt: Date;
                            _count: {
                                findings: number;
                                incidents: number;
                            };
                            code: string;
                            branchId: string;
                            status: import("../../../generated/prisma/enums").GroomingStatus;
                            items: {
                                id: string;
                                notes: string | null;
                                serviceId: string | null;
                                quantity: number;
                                priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                durationSnapshot: number;
                                nameSnapshot: string;
                                definitionId: string | null;
                                performed: boolean;
                                laneSnapshot: import("../../../generated/prisma/enums").GroomingLane;
                                dryingSnapshot: number;
                                priceLevelSnapshot: string | null;
                                matchedRuleId: string | null;
                            }[];
                            products: {
                                id: string;
                                quantity: import("@prisma/client-runtime-utils").Decimal;
                                priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                inventoryItemId: string | null;
                                nameSnapshot: string;
                                issuedAt: Date | null;
                                billable: boolean;
                                dilution: string | null;
                                contactTimeMin: number | null;
                                bodyZones: string[];
                            }[];
                            appointmentId: string | null;
                            cancelReason: string | null;
                            startedAt: Date | null;
                            completedAt: Date | null;
                            scheduledAt: Date;
                            stage: import("../../../generated/prisma/enums").GroomingStage | null;
                            photos: {
                                url: string;
                                id: string;
                                createdAt: Date;
                                kind: import("../../../generated/prisma/enums").GroomingPhotoKind;
                                caption: string | null;
                                bodyZone: string | null;
                            }[];
                            lane: import("../../../generated/prisma/enums").GroomingLane;
                            estimatedDurationMin: number;
                            adjustments: {
                                id: string;
                                reason: string | null;
                                amount: import("@prisma/client-runtime-utils").Decimal;
                                source: import("../../../generated/prisma/enums").GroomingAdjustmentSource;
                                modifierCode: import("../../../generated/prisma/enums").GroomingModifierCode;
                                labelSnapshot: string;
                                approvedByOwnerAt: Date | null;
                            }[];
                            cancelKind: import("../../../generated/prisma/enums").GroomingCancelKind | null;
                            findings: {
                                id: string;
                                createdAt: Date;
                                labOrderId: string | null;
                                category: import("../../../generated/prisma/enums").GroomingFindingCategory;
                                severity: import("../../../generated/prisma/enums").GroomingFindingSeverity;
                                note: string;
                                bodyZone: string | null;
                                photoId: string | null;
                                acknowledgedAt: Date | null;
                                referralAppointmentId: string | null;
                                dismissedReason: string | null;
                            }[];
                            promisedReadyAt: Date | null;
                            readyAt: Date | null;
                            quoteTotal: import("@prisma/client-runtime-utils").Decimal;
                            sedationPlanned: boolean;
                            dryingMethod: import("../../../generated/prisma/enums").GroomingDryingMethod | null;
                            groomer: {
                                user: {
                                    name: string;
                                } | null;
                                id: string;
                            };
                            station: {
                                name: string;
                                id: string;
                            } | null;
                            intake: {
                                id: string;
                                notes: string | null;
                                earCondition: import("../../../generated/prisma/enums").EarCondition;
                                weightKg: import("@prisma/client-runtime-utils").Decimal | null;
                                temperatureC: import("@prisma/client-runtime-utils").Decimal | null;
                                mattingGrade: import("../../../generated/prisma/enums").MattingGrade;
                                coatCondition: import("../../../generated/prisma/enums").CoatCondition;
                                parasiteFinding: import("../../../generated/prisma/enums").ParasiteFinding;
                                skinFindings: string[];
                                nailCondition: import("../../../generated/prisma/enums").NailCondition;
                                dentalNote: string | null;
                                behaviorScore: import("../../../generated/prisma/enums").GroomingBehaviorScore;
                                muzzleUsed: boolean;
                                rabiesValidUntil: Date | null;
                                vaccinationOverrideReason: string | null;
                                shaveDownRecommended: boolean;
                                shaveDownApprovedAt: Date | null;
                                heatDryProhibitedSnapshot: boolean;
                                heatDryReasonsSnapshot: string[];
                                parasiteTreatedAt: Date | null;
                                parasiteOwnerNotifiedAt: Date | null;
                                isolationAcknowledgedAt: Date | null;
                                belongings: string[];
                                performedAt: Date;
                            } | null;
                            assistantId: string | null;
                            vetOrderStaffId: string | null;
                            vetOrderNote: string | null;
                            dropOffAt: Date | null;
                            checkedInAt: Date | null;
                            dryingStartedAt: Date | null;
                            pickedUpAt: Date | null;
                            quoteSubtotal: import("@prisma/client-runtime-utils").Decimal;
                            quoteAdjustments: import("@prisma/client-runtime-utils").Decimal;
                            bookedQuoteTotal: import("@prisma/client-runtime-utils").Decimal;
                            ownerApprovedQuoteAt: Date | null;
                            incidents: {
                                id: string;
                                createdAt: Date;
                                description: string;
                                resolvedAt: Date | null;
                                kind: import("../../../generated/prisma/enums").GroomingIncidentKind;
                                severity: import("../../../generated/prisma/enums").GroomingIncidentSeverity;
                                followUpAppointmentId: string | null;
                                actionTaken: string | null;
                                ownerNotifiedAt: Date | null;
                                vetAssessedByStaffId: string | null;
                                vetAssessmentNote: string | null;
                            }[];
                            reportCard: {
                                id: string;
                                summary: string;
                                sentAt: Date | null;
                                moodScore: import("../../../generated/prisma/enums").GroomingMoodScore;
                                recommendedIntervalWeeks: number | null;
                                nextRecommendedAt: Date | null;
                                publicToken: string;
                                channel: import("../../../generated/prisma/enums").ReportCardChannel | null;
                                rebookedSessionId: string | null;
                            } | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض التجميل";
                        } | {
                            readonly message: "لا تملك صلاحية تعديل جلسات التجميل";
                        };
                        409: {
                            readonly message: string;
                            readonly gate: import("./grooming.workflow").GroomingGate | null;
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    grooming: {
        ":id": {
            intake: {
                post: {
                    body: {
                        notes?: string | null | undefined;
                        earCondition?: "NORMAL" | "DISCHARGE" | "WAXY" | "REDNESS" | "ODOR" | "PAINFUL" | undefined;
                        weightKg?: number | null | undefined;
                        temperatureC?: number | null | undefined;
                        coatCondition?: "HEALTHY" | "DRY" | "GREASY" | "DANDRUFF" | "SHEDDING_HEAVY" | "DAMAGED" | undefined;
                        parasiteFinding?: "NONE" | "FLEAS" | "TICKS" | "LICE" | "MITES_SUSPECTED" | "MULTIPLE" | undefined;
                        skinFindings?: string[] | undefined;
                        nailCondition?: "NORMAL" | "OVERGROWN" | "SPLIT" | "INGROWN" | "MISSING" | undefined;
                        dentalNote?: string | null | undefined;
                        muzzleUsed?: boolean | undefined;
                        belongings?: string[] | undefined;
                        mattingGrade: "NONE" | "LIGHT" | "MODERATE" | "SEVERE" | "PELTED";
                        behaviorScore: "RED" | "YELLOW" | "GREEN";
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            intake: {
                                id: string;
                                notes: string | null;
                                earCondition: import("../../../generated/prisma/enums").EarCondition;
                                weightKg: import("@prisma/client-runtime-utils").Decimal | null;
                                temperatureC: import("@prisma/client-runtime-utils").Decimal | null;
                                mattingGrade: import("../../../generated/prisma/enums").MattingGrade;
                                coatCondition: import("../../../generated/prisma/enums").CoatCondition;
                                parasiteFinding: import("../../../generated/prisma/enums").ParasiteFinding;
                                skinFindings: string[];
                                nailCondition: import("../../../generated/prisma/enums").NailCondition;
                                dentalNote: string | null;
                                behaviorScore: import("../../../generated/prisma/enums").GroomingBehaviorScore;
                                muzzleUsed: boolean;
                                rabiesValidUntil: Date | null;
                                vaccinationOverrideReason: string | null;
                                shaveDownRecommended: boolean;
                                shaveDownApprovedAt: Date | null;
                                heatDryProhibitedSnapshot: boolean;
                                heatDryReasonsSnapshot: string[];
                                parasiteTreatedAt: Date | null;
                                parasiteOwnerNotifiedAt: Date | null;
                                isolationAcknowledgedAt: Date | null;
                                belongings: string[];
                                performedAt: Date;
                            };
                            quoteTotal: number;
                            needsReapproval: boolean;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض التجميل";
                        } | {
                            readonly message: "لا تملك صلاحية تسجيل الفحص القبلي";
                        };
                        409: {
                            readonly message: string;
                            readonly gate: import("./grooming.workflow").GroomingGate | null;
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    grooming: {
        ":id": {
            quote: {
                approve: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                };
                                patient: {
                                    animalType: {
                                        arName: string;
                                    };
                                    animalStrain: {
                                        arName: string;
                                        isBrachycephalic: boolean;
                                    } | null;
                                    name: string;
                                    id: string;
                                    code: string;
                                };
                                invoice: {
                                    discount: import("@prisma/client-runtime-utils").Decimal;
                                    id: string;
                                    vatRate: import("@prisma/client-runtime-utils").Decimal;
                                    currencyCode: string;
                                    code: string;
                                    status: import("../invoices/invoices.type").InvoiceStatus;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentMethod: import("../invoices/invoices.type").PaymentMethod | null;
                                    paidAt: Date | null;
                                    subtotal: import("@prisma/client-runtime-utils").Decimal;
                                    amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                } | null;
                                id: string;
                                createdAt: Date;
                                _count: {
                                    findings: number;
                                    incidents: number;
                                };
                                code: string;
                                branchId: string;
                                status: import("../../../generated/prisma/enums").GroomingStatus;
                                items: {
                                    id: string;
                                    notes: string | null;
                                    serviceId: string | null;
                                    quantity: number;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    durationSnapshot: number;
                                    nameSnapshot: string;
                                    definitionId: string | null;
                                    performed: boolean;
                                    laneSnapshot: import("../../../generated/prisma/enums").GroomingLane;
                                    dryingSnapshot: number;
                                    priceLevelSnapshot: string | null;
                                    matchedRuleId: string | null;
                                }[];
                                products: {
                                    id: string;
                                    quantity: import("@prisma/client-runtime-utils").Decimal;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    inventoryItemId: string | null;
                                    nameSnapshot: string;
                                    issuedAt: Date | null;
                                    billable: boolean;
                                    dilution: string | null;
                                    contactTimeMin: number | null;
                                    bodyZones: string[];
                                }[];
                                appointmentId: string | null;
                                cancelReason: string | null;
                                startedAt: Date | null;
                                completedAt: Date | null;
                                scheduledAt: Date;
                                stage: import("../../../generated/prisma/enums").GroomingStage | null;
                                photos: {
                                    url: string;
                                    id: string;
                                    createdAt: Date;
                                    kind: import("../../../generated/prisma/enums").GroomingPhotoKind;
                                    caption: string | null;
                                    bodyZone: string | null;
                                }[];
                                lane: import("../../../generated/prisma/enums").GroomingLane;
                                estimatedDurationMin: number;
                                adjustments: {
                                    id: string;
                                    reason: string | null;
                                    amount: import("@prisma/client-runtime-utils").Decimal;
                                    source: import("../../../generated/prisma/enums").GroomingAdjustmentSource;
                                    modifierCode: import("../../../generated/prisma/enums").GroomingModifierCode;
                                    labelSnapshot: string;
                                    approvedByOwnerAt: Date | null;
                                }[];
                                cancelKind: import("../../../generated/prisma/enums").GroomingCancelKind | null;
                                findings: {
                                    id: string;
                                    createdAt: Date;
                                    labOrderId: string | null;
                                    category: import("../../../generated/prisma/enums").GroomingFindingCategory;
                                    severity: import("../../../generated/prisma/enums").GroomingFindingSeverity;
                                    note: string;
                                    bodyZone: string | null;
                                    photoId: string | null;
                                    acknowledgedAt: Date | null;
                                    referralAppointmentId: string | null;
                                    dismissedReason: string | null;
                                }[];
                                promisedReadyAt: Date | null;
                                readyAt: Date | null;
                                quoteTotal: import("@prisma/client-runtime-utils").Decimal;
                                sedationPlanned: boolean;
                                dryingMethod: import("../../../generated/prisma/enums").GroomingDryingMethod | null;
                                groomer: {
                                    user: {
                                        name: string;
                                    } | null;
                                    id: string;
                                };
                                station: {
                                    name: string;
                                    id: string;
                                } | null;
                                intake: {
                                    id: string;
                                    notes: string | null;
                                    earCondition: import("../../../generated/prisma/enums").EarCondition;
                                    weightKg: import("@prisma/client-runtime-utils").Decimal | null;
                                    temperatureC: import("@prisma/client-runtime-utils").Decimal | null;
                                    mattingGrade: import("../../../generated/prisma/enums").MattingGrade;
                                    coatCondition: import("../../../generated/prisma/enums").CoatCondition;
                                    parasiteFinding: import("../../../generated/prisma/enums").ParasiteFinding;
                                    skinFindings: string[];
                                    nailCondition: import("../../../generated/prisma/enums").NailCondition;
                                    dentalNote: string | null;
                                    behaviorScore: import("../../../generated/prisma/enums").GroomingBehaviorScore;
                                    muzzleUsed: boolean;
                                    rabiesValidUntil: Date | null;
                                    vaccinationOverrideReason: string | null;
                                    shaveDownRecommended: boolean;
                                    shaveDownApprovedAt: Date | null;
                                    heatDryProhibitedSnapshot: boolean;
                                    heatDryReasonsSnapshot: string[];
                                    parasiteTreatedAt: Date | null;
                                    parasiteOwnerNotifiedAt: Date | null;
                                    isolationAcknowledgedAt: Date | null;
                                    belongings: string[];
                                    performedAt: Date;
                                } | null;
                                assistantId: string | null;
                                vetOrderStaffId: string | null;
                                vetOrderNote: string | null;
                                dropOffAt: Date | null;
                                checkedInAt: Date | null;
                                dryingStartedAt: Date | null;
                                pickedUpAt: Date | null;
                                quoteSubtotal: import("@prisma/client-runtime-utils").Decimal;
                                quoteAdjustments: import("@prisma/client-runtime-utils").Decimal;
                                bookedQuoteTotal: import("@prisma/client-runtime-utils").Decimal;
                                ownerApprovedQuoteAt: Date | null;
                                incidents: {
                                    id: string;
                                    createdAt: Date;
                                    description: string;
                                    resolvedAt: Date | null;
                                    kind: import("../../../generated/prisma/enums").GroomingIncidentKind;
                                    severity: import("../../../generated/prisma/enums").GroomingIncidentSeverity;
                                    followUpAppointmentId: string | null;
                                    actionTaken: string | null;
                                    ownerNotifiedAt: Date | null;
                                    vetAssessedByStaffId: string | null;
                                    vetAssessmentNote: string | null;
                                }[];
                                reportCard: {
                                    id: string;
                                    summary: string;
                                    sentAt: Date | null;
                                    moodScore: import("../../../generated/prisma/enums").GroomingMoodScore;
                                    recommendedIntervalWeeks: number | null;
                                    nextRecommendedAt: Date | null;
                                    publicToken: string;
                                    channel: import("../../../generated/prisma/enums").ReportCardChannel | null;
                                    rebookedSessionId: string | null;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: "لا تملك صلاحية عرض التجميل";
                            } | {
                                readonly message: "لا تملك صلاحية إقرار التسعيرة";
                            };
                            409: {
                                readonly message: string;
                                readonly gate: import("./grooming.workflow").GroomingGate | null;
                            };
                            422: {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    grooming: {
        ":id": {
            "shave-down": {
                approve: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                };
                                patient: {
                                    animalType: {
                                        arName: string;
                                    };
                                    animalStrain: {
                                        arName: string;
                                        isBrachycephalic: boolean;
                                    } | null;
                                    name: string;
                                    id: string;
                                    code: string;
                                };
                                invoice: {
                                    discount: import("@prisma/client-runtime-utils").Decimal;
                                    id: string;
                                    vatRate: import("@prisma/client-runtime-utils").Decimal;
                                    currencyCode: string;
                                    code: string;
                                    status: import("../invoices/invoices.type").InvoiceStatus;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentMethod: import("../invoices/invoices.type").PaymentMethod | null;
                                    paidAt: Date | null;
                                    subtotal: import("@prisma/client-runtime-utils").Decimal;
                                    amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                } | null;
                                id: string;
                                createdAt: Date;
                                _count: {
                                    findings: number;
                                    incidents: number;
                                };
                                code: string;
                                branchId: string;
                                status: import("../../../generated/prisma/enums").GroomingStatus;
                                items: {
                                    id: string;
                                    notes: string | null;
                                    serviceId: string | null;
                                    quantity: number;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    durationSnapshot: number;
                                    nameSnapshot: string;
                                    definitionId: string | null;
                                    performed: boolean;
                                    laneSnapshot: import("../../../generated/prisma/enums").GroomingLane;
                                    dryingSnapshot: number;
                                    priceLevelSnapshot: string | null;
                                    matchedRuleId: string | null;
                                }[];
                                products: {
                                    id: string;
                                    quantity: import("@prisma/client-runtime-utils").Decimal;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    inventoryItemId: string | null;
                                    nameSnapshot: string;
                                    issuedAt: Date | null;
                                    billable: boolean;
                                    dilution: string | null;
                                    contactTimeMin: number | null;
                                    bodyZones: string[];
                                }[];
                                appointmentId: string | null;
                                cancelReason: string | null;
                                startedAt: Date | null;
                                completedAt: Date | null;
                                scheduledAt: Date;
                                stage: import("../../../generated/prisma/enums").GroomingStage | null;
                                photos: {
                                    url: string;
                                    id: string;
                                    createdAt: Date;
                                    kind: import("../../../generated/prisma/enums").GroomingPhotoKind;
                                    caption: string | null;
                                    bodyZone: string | null;
                                }[];
                                lane: import("../../../generated/prisma/enums").GroomingLane;
                                estimatedDurationMin: number;
                                adjustments: {
                                    id: string;
                                    reason: string | null;
                                    amount: import("@prisma/client-runtime-utils").Decimal;
                                    source: import("../../../generated/prisma/enums").GroomingAdjustmentSource;
                                    modifierCode: import("../../../generated/prisma/enums").GroomingModifierCode;
                                    labelSnapshot: string;
                                    approvedByOwnerAt: Date | null;
                                }[];
                                cancelKind: import("../../../generated/prisma/enums").GroomingCancelKind | null;
                                findings: {
                                    id: string;
                                    createdAt: Date;
                                    labOrderId: string | null;
                                    category: import("../../../generated/prisma/enums").GroomingFindingCategory;
                                    severity: import("../../../generated/prisma/enums").GroomingFindingSeverity;
                                    note: string;
                                    bodyZone: string | null;
                                    photoId: string | null;
                                    acknowledgedAt: Date | null;
                                    referralAppointmentId: string | null;
                                    dismissedReason: string | null;
                                }[];
                                promisedReadyAt: Date | null;
                                readyAt: Date | null;
                                quoteTotal: import("@prisma/client-runtime-utils").Decimal;
                                sedationPlanned: boolean;
                                dryingMethod: import("../../../generated/prisma/enums").GroomingDryingMethod | null;
                                groomer: {
                                    user: {
                                        name: string;
                                    } | null;
                                    id: string;
                                };
                                station: {
                                    name: string;
                                    id: string;
                                } | null;
                                intake: {
                                    id: string;
                                    notes: string | null;
                                    earCondition: import("../../../generated/prisma/enums").EarCondition;
                                    weightKg: import("@prisma/client-runtime-utils").Decimal | null;
                                    temperatureC: import("@prisma/client-runtime-utils").Decimal | null;
                                    mattingGrade: import("../../../generated/prisma/enums").MattingGrade;
                                    coatCondition: import("../../../generated/prisma/enums").CoatCondition;
                                    parasiteFinding: import("../../../generated/prisma/enums").ParasiteFinding;
                                    skinFindings: string[];
                                    nailCondition: import("../../../generated/prisma/enums").NailCondition;
                                    dentalNote: string | null;
                                    behaviorScore: import("../../../generated/prisma/enums").GroomingBehaviorScore;
                                    muzzleUsed: boolean;
                                    rabiesValidUntil: Date | null;
                                    vaccinationOverrideReason: string | null;
                                    shaveDownRecommended: boolean;
                                    shaveDownApprovedAt: Date | null;
                                    heatDryProhibitedSnapshot: boolean;
                                    heatDryReasonsSnapshot: string[];
                                    parasiteTreatedAt: Date | null;
                                    parasiteOwnerNotifiedAt: Date | null;
                                    isolationAcknowledgedAt: Date | null;
                                    belongings: string[];
                                    performedAt: Date;
                                } | null;
                                assistantId: string | null;
                                vetOrderStaffId: string | null;
                                vetOrderNote: string | null;
                                dropOffAt: Date | null;
                                checkedInAt: Date | null;
                                dryingStartedAt: Date | null;
                                pickedUpAt: Date | null;
                                quoteSubtotal: import("@prisma/client-runtime-utils").Decimal;
                                quoteAdjustments: import("@prisma/client-runtime-utils").Decimal;
                                bookedQuoteTotal: import("@prisma/client-runtime-utils").Decimal;
                                ownerApprovedQuoteAt: Date | null;
                                incidents: {
                                    id: string;
                                    createdAt: Date;
                                    description: string;
                                    resolvedAt: Date | null;
                                    kind: import("../../../generated/prisma/enums").GroomingIncidentKind;
                                    severity: import("../../../generated/prisma/enums").GroomingIncidentSeverity;
                                    followUpAppointmentId: string | null;
                                    actionTaken: string | null;
                                    ownerNotifiedAt: Date | null;
                                    vetAssessedByStaffId: string | null;
                                    vetAssessmentNote: string | null;
                                }[];
                                reportCard: {
                                    id: string;
                                    summary: string;
                                    sentAt: Date | null;
                                    moodScore: import("../../../generated/prisma/enums").GroomingMoodScore;
                                    recommendedIntervalWeeks: number | null;
                                    nextRecommendedAt: Date | null;
                                    publicToken: string;
                                    channel: import("../../../generated/prisma/enums").ReportCardChannel | null;
                                    rebookedSessionId: string | null;
                                } | null;
                            } | null;
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: "لا تملك صلاحية عرض التجميل";
                            } | {
                                readonly message: "لا تملك صلاحية إقرار الحلاقة";
                            };
                            409: {
                                readonly message: string;
                                readonly gate: import("./grooming.workflow").GroomingGate | null;
                            };
                            422: {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    grooming: {
        ":id": {
            "parasite-protocol": {
                post: {
                    body: {
                        treated?: boolean | undefined;
                        ownerNotified?: boolean | undefined;
                        isolated?: boolean | undefined;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                            };
                            patient: {
                                animalType: {
                                    arName: string;
                                };
                                animalStrain: {
                                    arName: string;
                                    isBrachycephalic: boolean;
                                } | null;
                                name: string;
                                id: string;
                                code: string;
                            };
                            invoice: {
                                discount: import("@prisma/client-runtime-utils").Decimal;
                                id: string;
                                vatRate: import("@prisma/client-runtime-utils").Decimal;
                                currencyCode: string;
                                code: string;
                                status: import("../invoices/invoices.type").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                                vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                paymentMethod: import("../invoices/invoices.type").PaymentMethod | null;
                                paidAt: Date | null;
                                subtotal: import("@prisma/client-runtime-utils").Decimal;
                                amountPaid: import("@prisma/client-runtime-utils").Decimal;
                            } | null;
                            id: string;
                            createdAt: Date;
                            _count: {
                                findings: number;
                                incidents: number;
                            };
                            code: string;
                            branchId: string;
                            status: import("../../../generated/prisma/enums").GroomingStatus;
                            items: {
                                id: string;
                                notes: string | null;
                                serviceId: string | null;
                                quantity: number;
                                priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                durationSnapshot: number;
                                nameSnapshot: string;
                                definitionId: string | null;
                                performed: boolean;
                                laneSnapshot: import("../../../generated/prisma/enums").GroomingLane;
                                dryingSnapshot: number;
                                priceLevelSnapshot: string | null;
                                matchedRuleId: string | null;
                            }[];
                            products: {
                                id: string;
                                quantity: import("@prisma/client-runtime-utils").Decimal;
                                priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                inventoryItemId: string | null;
                                nameSnapshot: string;
                                issuedAt: Date | null;
                                billable: boolean;
                                dilution: string | null;
                                contactTimeMin: number | null;
                                bodyZones: string[];
                            }[];
                            appointmentId: string | null;
                            cancelReason: string | null;
                            startedAt: Date | null;
                            completedAt: Date | null;
                            scheduledAt: Date;
                            stage: import("../../../generated/prisma/enums").GroomingStage | null;
                            photos: {
                                url: string;
                                id: string;
                                createdAt: Date;
                                kind: import("../../../generated/prisma/enums").GroomingPhotoKind;
                                caption: string | null;
                                bodyZone: string | null;
                            }[];
                            lane: import("../../../generated/prisma/enums").GroomingLane;
                            estimatedDurationMin: number;
                            adjustments: {
                                id: string;
                                reason: string | null;
                                amount: import("@prisma/client-runtime-utils").Decimal;
                                source: import("../../../generated/prisma/enums").GroomingAdjustmentSource;
                                modifierCode: import("../../../generated/prisma/enums").GroomingModifierCode;
                                labelSnapshot: string;
                                approvedByOwnerAt: Date | null;
                            }[];
                            cancelKind: import("../../../generated/prisma/enums").GroomingCancelKind | null;
                            findings: {
                                id: string;
                                createdAt: Date;
                                labOrderId: string | null;
                                category: import("../../../generated/prisma/enums").GroomingFindingCategory;
                                severity: import("../../../generated/prisma/enums").GroomingFindingSeverity;
                                note: string;
                                bodyZone: string | null;
                                photoId: string | null;
                                acknowledgedAt: Date | null;
                                referralAppointmentId: string | null;
                                dismissedReason: string | null;
                            }[];
                            promisedReadyAt: Date | null;
                            readyAt: Date | null;
                            quoteTotal: import("@prisma/client-runtime-utils").Decimal;
                            sedationPlanned: boolean;
                            dryingMethod: import("../../../generated/prisma/enums").GroomingDryingMethod | null;
                            groomer: {
                                user: {
                                    name: string;
                                } | null;
                                id: string;
                            };
                            station: {
                                name: string;
                                id: string;
                            } | null;
                            intake: {
                                id: string;
                                notes: string | null;
                                earCondition: import("../../../generated/prisma/enums").EarCondition;
                                weightKg: import("@prisma/client-runtime-utils").Decimal | null;
                                temperatureC: import("@prisma/client-runtime-utils").Decimal | null;
                                mattingGrade: import("../../../generated/prisma/enums").MattingGrade;
                                coatCondition: import("../../../generated/prisma/enums").CoatCondition;
                                parasiteFinding: import("../../../generated/prisma/enums").ParasiteFinding;
                                skinFindings: string[];
                                nailCondition: import("../../../generated/prisma/enums").NailCondition;
                                dentalNote: string | null;
                                behaviorScore: import("../../../generated/prisma/enums").GroomingBehaviorScore;
                                muzzleUsed: boolean;
                                rabiesValidUntil: Date | null;
                                vaccinationOverrideReason: string | null;
                                shaveDownRecommended: boolean;
                                shaveDownApprovedAt: Date | null;
                                heatDryProhibitedSnapshot: boolean;
                                heatDryReasonsSnapshot: string[];
                                parasiteTreatedAt: Date | null;
                                parasiteOwnerNotifiedAt: Date | null;
                                isolationAcknowledgedAt: Date | null;
                                belongings: string[];
                                performedAt: Date;
                            } | null;
                            assistantId: string | null;
                            vetOrderStaffId: string | null;
                            vetOrderNote: string | null;
                            dropOffAt: Date | null;
                            checkedInAt: Date | null;
                            dryingStartedAt: Date | null;
                            pickedUpAt: Date | null;
                            quoteSubtotal: import("@prisma/client-runtime-utils").Decimal;
                            quoteAdjustments: import("@prisma/client-runtime-utils").Decimal;
                            bookedQuoteTotal: import("@prisma/client-runtime-utils").Decimal;
                            ownerApprovedQuoteAt: Date | null;
                            incidents: {
                                id: string;
                                createdAt: Date;
                                description: string;
                                resolvedAt: Date | null;
                                kind: import("../../../generated/prisma/enums").GroomingIncidentKind;
                                severity: import("../../../generated/prisma/enums").GroomingIncidentSeverity;
                                followUpAppointmentId: string | null;
                                actionTaken: string | null;
                                ownerNotifiedAt: Date | null;
                                vetAssessedByStaffId: string | null;
                                vetAssessmentNote: string | null;
                            }[];
                            reportCard: {
                                id: string;
                                summary: string;
                                sentAt: Date | null;
                                moodScore: import("../../../generated/prisma/enums").GroomingMoodScore;
                                recommendedIntervalWeeks: number | null;
                                nextRecommendedAt: Date | null;
                                publicToken: string;
                                channel: import("../../../generated/prisma/enums").ReportCardChannel | null;
                                rebookedSessionId: string | null;
                            } | null;
                        } | null;
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض التجميل";
                        } | {
                            readonly message: "لا تملك صلاحية تعديل جلسات التجميل";
                        };
                        409: {
                            readonly message: string;
                            readonly gate: import("./grooming.workflow").GroomingGate | null;
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    grooming: {
        ":id": {
            photos: {
                post: {
                    body: {
                        caption?: string | null | undefined;
                        bodyZone?: string | null | undefined;
                        url: string;
                        kind: "BEFORE" | "AFTER" | "CONDITION" | "INCIDENT";
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            url: string;
                            id: string;
                            createdAt: Date;
                            kind: import("../../../generated/prisma/enums").GroomingPhotoKind;
                            caption: string | null;
                            bodyZone: string | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض التجميل";
                        } | {
                            readonly message: "لا تملك صلاحية إضافة صور";
                        };
                        404: {
                            readonly message: "جلسة التجميل غير موجودة";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    grooming: {
        ":id": {
            products: {
                post: {
                    body: {
                        inventoryItemId?: string | null | undefined;
                        billable?: boolean | undefined;
                        dilution?: string | null | undefined;
                        contactTimeMin?: number | null | undefined;
                        bodyZones?: string[] | undefined;
                        quantity: number;
                        priceSnapshot: number;
                        nameSnapshot: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            quantity: import("@prisma/client-runtime-utils").Decimal;
                            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                            inventoryItemId: string | null;
                            nameSnapshot: string;
                            issuedAt: Date | null;
                            billable: boolean;
                            dilution: string | null;
                            contactTimeMin: number | null;
                            bodyZones: string[];
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض التجميل";
                        } | {
                            readonly message: "لا تملك صلاحية إضافة مستهلكات";
                        };
                        404: {
                            readonly message: "جلسة التجميل غير موجودة";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    grooming: {
        ":id": {
            findings: {
                post: {
                    body: {
                        severity?: "URGENT" | "INFO" | "ATTENTION" | undefined;
                        bodyZone?: string | null | undefined;
                        photoId?: string | null | undefined;
                        category: "DENTAL" | "OTHER" | "BEHAVIOR" | "SKIN" | "EARS" | "EYES" | "NAILS" | "LUMP" | "PARASITE" | "WEIGHT" | "PAIN";
                        note: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            createdAt: Date;
                            labOrderId: string | null;
                            category: import("../../../generated/prisma/enums").GroomingFindingCategory;
                            severity: import("../../../generated/prisma/enums").GroomingFindingSeverity;
                            note: string;
                            bodyZone: string | null;
                            photoId: string | null;
                            acknowledgedAt: Date | null;
                            referralAppointmentId: string | null;
                            dismissedReason: string | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض التجميل";
                        } | {
                            readonly message: "لا تملك صلاحية تسجيل الملاحظات";
                        };
                        404: {
                            readonly message: "جلسة التجميل غير موجودة";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    grooming: {
        findings: {
            ":findingId": {
                link: {
                    post: {
                        body: {
                            labOrderId?: string | null | undefined;
                            referralAppointmentId?: string | null | undefined;
                            dismissedReason?: string | null | undefined;
                        };
                        params: {
                            findingId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                createdAt: Date;
                                labOrderId: string | null;
                                category: import("../../../generated/prisma/enums").GroomingFindingCategory;
                                severity: import("../../../generated/prisma/enums").GroomingFindingSeverity;
                                note: string;
                                bodyZone: string | null;
                                photoId: string | null;
                                acknowledgedAt: Date | null;
                                referralAppointmentId: string | null;
                                dismissedReason: string | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: "لا تملك صلاحية عرض التجميل";
                            } | {
                                readonly message: "لا تملك صلاحية تصعيد الملاحظات";
                            };
                            409: {
                                readonly message: string;
                                readonly gate: import("./grooming.workflow").GroomingGate | null;
                            };
                            422: {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    grooming: {
        ":id": {
            incidents: {
                post: {
                    body: {
                        severity?: "MODERATE" | "MINOR" | "MAJOR" | undefined;
                        photoId?: string | null | undefined;
                        actionTaken?: string | null | undefined;
                        description: string;
                        kind: "OTHER" | "CLIPPER_BURN" | "NICK_CUT" | "QUICKED_NAIL" | "HEAT_STRESS" | "MEDICAL_EVENT" | "ESCAPE" | "BITE_TO_STAFF" | "EQUIPMENT_FAILURE";
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            createdAt: Date;
                            description: string;
                            resolvedAt: Date | null;
                            kind: import("../../../generated/prisma/enums").GroomingIncidentKind;
                            severity: import("../../../generated/prisma/enums").GroomingIncidentSeverity;
                            followUpAppointmentId: string | null;
                            actionTaken: string | null;
                            ownerNotifiedAt: Date | null;
                            vetAssessedByStaffId: string | null;
                            vetAssessmentNote: string | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض التجميل";
                        } | {
                            readonly message: "لا تملك صلاحية الإبلاغ عن حادثة";
                        };
                        404: {
                            readonly message: "جلسة التجميل غير موجودة";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    grooming: {
        incidents: {
            ":incidentId": {
                resolve: {
                    post: {
                        body: {
                            followUpAppointmentId?: string | null | undefined;
                            vetAssessedByStaffId?: string | null | undefined;
                            vetAssessmentNote?: string | null | undefined;
                            ownerNotified?: boolean | undefined;
                        };
                        params: {
                            incidentId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                createdAt: Date;
                                description: string;
                                resolvedAt: Date | null;
                                kind: import("../../../generated/prisma/enums").GroomingIncidentKind;
                                severity: import("../../../generated/prisma/enums").GroomingIncidentSeverity;
                                followUpAppointmentId: string | null;
                                actionTaken: string | null;
                                ownerNotifiedAt: Date | null;
                                vetAssessedByStaffId: string | null;
                                vetAssessmentNote: string | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: "لا تملك صلاحية عرض التجميل";
                            } | {
                                readonly message: "لا تملك صلاحية إغلاق الحوادث";
                            };
                            409: {
                                readonly message: string;
                                readonly gate: import("./grooming.workflow").GroomingGate | null;
                            };
                            422: {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    grooming: {
        ":id": {
            items: {
                ":itemId": {
                    performed: {
                        post: {
                            body: {
                                performed: boolean;
                            };
                            params: {
                                id: string;
                                itemId: string;
                            };
                            query: {};
                            headers: {};
                            response: {
                                200: {
                                    id: string;
                                    notes: string | null;
                                    serviceId: string | null;
                                    quantity: number;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    durationSnapshot: number;
                                    nameSnapshot: string;
                                    definitionId: string | null;
                                    performed: boolean;
                                    laneSnapshot: import("../../../generated/prisma/enums").GroomingLane;
                                    dryingSnapshot: number;
                                    priceLevelSnapshot: string | null;
                                    matchedRuleId: string | null;
                                };
                                401: {
                                    readonly message: "غير مصرح";
                                };
                                403: {
                                    readonly message: "لا تملك صلاحية عرض التجميل";
                                } | {
                                    readonly message: "لا تملك صلاحية تعديل بنود الجلسة";
                                };
                                409: {
                                    readonly message: string;
                                    readonly gate: import("./grooming.workflow").GroomingGate | null;
                                };
                                422: {
                                    type: "validation";
                                    on: string;
                                    summary?: string;
                                    message?: string;
                                    found?: unknown;
                                    property?: string;
                                    expected?: string;
                                };
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    grooming: {
        ":id": {
            invoice: {
                post: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            discount: import("@prisma/client-runtime-utils").Decimal;
                            id: string;
                            vatRate: import("@prisma/client-runtime-utils").Decimal;
                            currencyCode: string;
                            code: string;
                            status: import("../invoices/invoices.type").InvoiceStatus;
                            total: import("@prisma/client-runtime-utils").Decimal;
                            vatAmount: import("@prisma/client-runtime-utils").Decimal;
                            paymentMethod: import("../invoices/invoices.type").PaymentMethod | null;
                            paidAt: Date | null;
                            subtotal: import("@prisma/client-runtime-utils").Decimal;
                            amountPaid: import("@prisma/client-runtime-utils").Decimal;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض التجميل";
                        } | {
                            readonly message: "لا تملك صلاحية إصدار الفاتورة";
                        };
                        409: {
                            readonly message: string;
                            readonly gate: import("./grooming.workflow").GroomingGate | null;
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    grooming: {
        ":id": {
            invoice: {
                pay: {
                    post: {
                        body: {
                            paymentMethod: "CASH" | "CARD" | "TRANSFER";
                            amountPaid: number;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                discount: import("@prisma/client-runtime-utils").Decimal;
                                id: string;
                                vatRate: import("@prisma/client-runtime-utils").Decimal;
                                currencyCode: string;
                                code: string;
                                status: import("../invoices/invoices.type").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                                vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                paymentMethod: import("../invoices/invoices.type").PaymentMethod | null;
                                paidAt: Date | null;
                                subtotal: import("@prisma/client-runtime-utils").Decimal;
                                amountPaid: import("@prisma/client-runtime-utils").Decimal;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: "لا تملك صلاحية عرض التجميل";
                            } | {
                                readonly message: "لا تملك صلاحية تحصيل الفاتورة";
                            };
                            404: {
                                readonly message: "جلسة التجميل غير موجودة";
                            };
                            422: {
                                readonly message: "لا دورات على الجلسة";
                            } | {
                                readonly message: "الفاتورة مسدَّدة بالفعل";
                            } | {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    grooming: {
        ":id": {
            "report-card": {
                post: {
                    body: {
                        moodScore?: "CALM" | "HAPPY" | "ANXIOUS" | "STRESSED" | "AGGRESSIVE" | undefined;
                        recommendedIntervalWeeks?: number | null | undefined;
                        channel?: "WHATSAPP" | "EMAIL" | "SMS" | "IN_APP" | "PRINTED" | null | undefined;
                        summary: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            summary: string;
                            sentAt: Date | null;
                            moodScore: import("../../../generated/prisma/enums").GroomingMoodScore;
                            recommendedIntervalWeeks: number | null;
                            nextRecommendedAt: Date | null;
                            publicToken: string;
                            channel: import("../../../generated/prisma/enums").ReportCardChannel | null;
                            rebookedSessionId: string | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض التجميل";
                        } | {
                            readonly message: "لا تملك صلاحية إصدار تقرير الجلسة";
                        };
                        409: {
                            readonly message: string;
                            readonly gate: import("./grooming.workflow").GroomingGate | null;
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    grooming: {
        profile: {
            ":patientId": {
                get: {
                    body: {};
                    params: {
                        patientId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            notes: string | null;
                            patientId: string;
                            sizeBand: import("../../../generated/prisma/enums").GroomingSizeBand | null;
                            coatType: import("../animal-strains/animal-strains.type").HairType | null;
                            behaviorScore: import("../../../generated/prisma/enums").GroomingBehaviorScore;
                            preferredGroomerId: string | null;
                            clipperPlan: import("@prisma/client/runtime/client").JsonValue;
                            shampooItemId: string | null;
                            sensitivities: string[];
                            muzzleRequired: boolean;
                            requiresTwoHandlers: boolean;
                            handlingNotes: string | null;
                            heatDryProhibited: boolean;
                            heatDryProhibitedReason: string | null;
                            groomIntervalWeeks: number | null;
                            lastGroomedAt: Date | null;
                            nextGroomDueAt: Date | null;
                            customPrice: import("@prisma/client-runtime-utils").Decimal | null;
                            customDurationMin: number | null;
                        } | null;
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض التجميل";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    grooming: {
        profile: {
            ":patientId": {
                put: {
                    body: {
                        notes?: string | null | undefined;
                        sizeBand?: "MEDIUM" | "SMALL" | "LARGE" | "TOY" | "GIANT" | null | undefined;
                        coatType?: "NONE" | "LONG_THICK" | "SHORT_THICK" | "LIGHT" | "MEDIUM" | "DOUBLE_COAT" | null | undefined;
                        behaviorScore?: "RED" | "YELLOW" | "GREEN" | undefined;
                        preferredGroomerId?: string | null | undefined;
                        shampooItemId?: string | null | undefined;
                        sensitivities?: string[] | undefined;
                        muzzleRequired?: boolean | undefined;
                        requiresTwoHandlers?: boolean | undefined;
                        handlingNotes?: string | null | undefined;
                        heatDryProhibited?: boolean | undefined;
                        heatDryProhibitedReason?: string | null | undefined;
                        groomIntervalWeeks?: number | null | undefined;
                        customPrice?: number | null | undefined;
                        customDurationMin?: number | null | undefined;
                    };
                    params: {
                        patientId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            notes: string | null;
                            patientId: string;
                            sizeBand: import("../../../generated/prisma/enums").GroomingSizeBand | null;
                            coatType: import("../animal-strains/animal-strains.type").HairType | null;
                            behaviorScore: import("../../../generated/prisma/enums").GroomingBehaviorScore;
                            preferredGroomerId: string | null;
                            clipperPlan: import("@prisma/client/runtime/client").JsonValue;
                            shampooItemId: string | null;
                            sensitivities: string[];
                            muzzleRequired: boolean;
                            requiresTwoHandlers: boolean;
                            handlingNotes: string | null;
                            heatDryProhibited: boolean;
                            heatDryProhibitedReason: string | null;
                            groomIntervalWeeks: number | null;
                            lastGroomedAt: Date | null;
                            nextGroomDueAt: Date | null;
                            customPrice: import("@prisma/client-runtime-utils").Decimal | null;
                            customDurationMin: number | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا تملك صلاحية عرض التجميل";
                        } | {
                            readonly message: "لا تملك صلاحية تعديل كرت التجميل";
                        };
                        404: {
                            readonly message: "الطفل غير موجود";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    public: {
        grooming: {
            "report-card": {
                ":token": {
                    get: {
                        body: unknown;
                        params: {
                            token: string;
                        } & {};
                        query: unknown;
                        headers: unknown;
                        response: {
                            200: {
                                session: {
                                    patient: {
                                        name: string;
                                    };
                                    code: string;
                                    items: {
                                        nameSnapshot: string;
                                        performed: boolean;
                                    }[];
                                    completedAt: Date | null;
                                    photos: {
                                        url: string;
                                        kind: import("../../../generated/prisma/enums").GroomingPhotoKind;
                                        caption: string | null;
                                    }[];
                                    findings: {
                                        category: import("../../../generated/prisma/enums").GroomingFindingCategory;
                                        severity: import("../../../generated/prisma/enums").GroomingFindingSeverity;
                                        note: string;
                                    }[];
                                };
                                summary: string;
                                moodScore: import("../../../generated/prisma/enums").GroomingMoodScore;
                                nextRecommendedAt: Date | null;
                            };
                            404: {
                                readonly message: "التقرير غير موجود";
                            };
                            422: {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
}, {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
}, {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
} & {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
}>;
