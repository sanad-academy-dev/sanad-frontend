import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingBehaviorScore = t.Union(
  [t.Literal("GREEN"), t.Literal("YELLOW"), t.Literal("RED")],
  {
    additionalProperties: false,
    description: `تقييم سلوك التعامل — إشارة مرور.`,
  },
);
