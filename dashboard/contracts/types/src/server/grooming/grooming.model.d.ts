import Elysia from "elysia";
export declare const groomingModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
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
}, {}, {
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
}>;
