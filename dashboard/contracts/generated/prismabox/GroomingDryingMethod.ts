import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingDryingMethod = t.Union(
  [
    t.Literal("HAND_ROOM_TEMP"),
    t.Literal("FAN_ONLY"),
    t.Literal("CAGE_UNHEATED"),
    t.Literal("FORCED_AIR"),
    t.Literal("CAGE_HEATED"),
  ],
  {
    additionalProperties: false,
    description: `طريقة التجفيف — البوابة G5 ترفض CAGE_HEATED للحيوانات الممنوعة من الحرارة،
بلا أي مسار تجاوز. المرجع: إرشادات AAHA وصناعة التجميل حول قصيري الخطم.`,
  },
);
