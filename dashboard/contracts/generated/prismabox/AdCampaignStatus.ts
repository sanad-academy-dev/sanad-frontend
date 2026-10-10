import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AdCampaignStatus = t.Union(
  [
    t.Literal("DRAFT"),
    t.Literal("PENDING"),
    t.Literal("SCHEDULED"),
    t.Literal("ACTIVE"),
    t.Literal("PAUSED"),
    t.Literal("COMPLETED"),
    t.Literal("FAILED"),
  ],
  { additionalProperties: false },
);
