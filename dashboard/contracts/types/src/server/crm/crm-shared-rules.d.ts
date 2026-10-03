/**
 * [CRM-P2] Rules shared by leads and deals. They live here rather than in either entity's
 * rules file because BR-C3.3 and its deal twin are the SAME rule with the SAME Arabic
 * message — two copies would drift the moment one is reworded.
 */
/** BR-C3.3 — the single wording, so lead and deal refusals are never two different strings. */
export declare const LOST_REASON_REQUIRED = "\u0633\u0628\u0628 \u0627\u0644\u0641\u0642\u062F \u0645\u0637\u0644\u0648\u0628 \u0639\u0646\u062F \u0627\u0644\u0646\u0642\u0644 \u0625\u0644\u0649 \u062D\u0627\u0644\u0629 \u00AB\u0645\u0641\u0642\u0648\u062F\u00BB (BR-C3.3)";
/**
 * BR-C3.3 for both entities. Takes a BOOLEAN rather than a status kind because the two
 * enums (`CrmLeadStatusKind`, `CrmDealStatusKind`) are distinct types that happen to share
 * the `LOST` member — asking the caller "is this a lost kind?" keeps one rule without
 * widening either enum or casting between them.
 */
export declare function assertLostReasonRequired(isLostKind: boolean, lostReasonId: string | null | undefined): void;
/**
 * BR-C3.4 — seconds spent in the previous status. `null` for the first ever record: zero
 * would claim «moved instantly», which is a different fact from «had no previous status».
 * Negative clock skew clamps to zero rather than poisoning a velocity average.
 */
export declare function durationInPreviousSeconds(previousAt: Date | null | undefined, now: Date): number | null;
