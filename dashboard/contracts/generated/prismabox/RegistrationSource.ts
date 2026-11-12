import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RegistrationSource = t.Union(
  [
    t.Literal("WEBSITE"),
    t.Literal("DIRECT_LINK"),
    t.Literal("REFERRAL"),
    t.Literal("SOCIAL"),
    t.Literal("OTHER"),
  ],
  { additionalProperties: false },
);
