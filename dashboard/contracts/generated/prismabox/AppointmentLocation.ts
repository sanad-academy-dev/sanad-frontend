import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AppointmentLocation = t.Union(
  [
    t.Literal("IN_CLINIC"),
    t.Literal("REMOTE"),
    t.Literal("HOME_VISIT"),
    t.Literal("MOBILE_CLINIC"),
  ],
  { additionalProperties: false },
);
