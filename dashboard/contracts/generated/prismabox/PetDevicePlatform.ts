import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PetDevicePlatform = t.Union(
  [t.Literal("IOS"), t.Literal("ANDROID"), t.Literal("WEB")],
  {
    additionalProperties: false,
    description: `*
* تفضيلات التنبيه لكل فئة × قناة. صفٌّ واحد لكل فئة، يُنشأ عند أوّل تعديل.`,
  },
);
