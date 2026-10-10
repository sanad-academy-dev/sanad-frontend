import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ReferralSource = t.Union(
  [
    t.Literal("FRIEND"),
    t.Literal("GOOGLE"),
    t.Literal("TWITTER"),
    t.Literal("LINKEDIN"),
    t.Literal("BLOG"),
    t.Literal("NEWSLETTER"),
    t.Literal("PODCAST"),
    t.Literal("OTHER"),
  ],
  { additionalProperties: false },
);
