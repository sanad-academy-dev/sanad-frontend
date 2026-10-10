import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AppointmentStatus = t.Union(
  [
    t.Literal("SCHEDULED"),
    t.Literal("WAITING"),
    t.Literal("CHECK_IN"),
    t.Literal("IN_SERVICE"),
    t.Literal("HOSPITALIZED"),
    t.Literal("AWAITING_PAYMENT"),
    t.Literal("DONE"),
    t.Literal("CANCELLED"),
  ],
  { additionalProperties: false },
);
