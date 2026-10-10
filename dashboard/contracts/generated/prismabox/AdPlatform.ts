import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AdPlatform = t.Union(
  [
    t.Literal("FACEBOOK"),
    t.Literal("INSTAGRAM"),
    t.Literal("LINKEDIN"),
    t.Literal("TIKTOK"),
    t.Literal("X"),
    t.Literal("PINTEREST"),
    t.Literal("SNAPCHAT"),
  ],
  { additionalProperties: false },
);
