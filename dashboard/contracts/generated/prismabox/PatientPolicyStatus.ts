import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PatientPolicyStatus = t.Union(
  [
    t.Literal("ACTIVE"),
    t.Literal("EXPIRED"),
    t.Literal("SUSPENDED"),
    t.Literal("CANCELLED"),
  ],
  { additionalProperties: false },
);
