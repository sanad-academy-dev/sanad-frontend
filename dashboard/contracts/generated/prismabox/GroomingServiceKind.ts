import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingServiceKind = t.Union(
  [
    t.Literal("BATH"),
    t.Literal("FULL_GROOM"),
    t.Literal("TIDY_UP"),
    t.Literal("DESHED"),
    t.Literal("NAIL_TRIM"),
    t.Literal("EAR_CLEAN"),
    t.Literal("ANAL_GLANDS"),
    t.Literal("TEETH_BRUSH"),
    t.Literal("DEMATTING"),
    t.Literal("SHAVE_DOWN"),
    t.Literal("MEDICATED_BATH"),
    t.Literal("PARASITE_DIP"),
    t.Literal("WOUND_CARE_CLIP"),
    t.Literal("SPA_ADDON"),
    t.Literal("OTHER"),
  ],
  {
    additionalProperties: false,
    description: `نوع خدمة التجميل — يقود الأيقونة والافتراضات لا المنطق.`,
  },
);
