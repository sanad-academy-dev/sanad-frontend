import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MobileBookingRequestStatus = t.Union(
  [
    t.Literal("NEW"),
    t.Literal("CONTACTED"),
    t.Literal("SCHEDULED"),
    t.Literal("REJECTED"),
    t.Literal("SPAM"),
  ],
  { additionalProperties: false },
);
