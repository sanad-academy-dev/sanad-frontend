import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RegistrationRequestStatus = t.Union(
  [
    t.Literal("QUEUE"),
    t.Literal("SHORTLIST"),
    t.Literal("INTERVIEW"),
    t.Literal("ACCEPTED"),
    t.Literal("AWAITING_PAYMENT"),
    t.Literal("REJECTED"),
    t.Literal("DUPLICATE"),
    t.Literal("IN_EVALUATION"),
    t.Literal("WAITLIST"),
    t.Literal("EVALUATION"),
    t.Literal("REVIEW"),
    t.Literal("AWAITING_REPLY"),
  ],
  { additionalProperties: false },
);
