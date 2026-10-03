import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CageSizeClass = t.Union(
  [
    t.Literal("SMALL"),
    t.Literal("MEDIUM"),
    t.Literal("LARGE"),
    t.Literal("WALK_IN"),
  ],
  {
    additionalProperties: false,
    description: `حجم القفص — يُستعمل لاقتراح الإسكان لا لمنعه. حيوان كبير في قفص صغير خطأ
يستحقّ تحذيرًا، لكنّه أحيانًا الخيار الوحيد المتاح ليلة الطوارئ.`,
  },
);
