import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InjectionSite = t.Union(
  [
    t.Literal("LEFT_SHOULDER"),
    t.Literal("RIGHT_SHOULDER"),
    t.Literal("LEFT_HIND_LIMB"),
    t.Literal("RIGHT_HIND_LIMB"),
    t.Literal("INTERSCAPULAR"),
    t.Literal("LEFT_FLANK"),
    t.Literal("RIGHT_FLANK"),
    t.Literal("NASAL"),
    t.Literal("ORAL"),
    t.Literal("OTHER"),
  ],
  { additionalProperties: false },
);
