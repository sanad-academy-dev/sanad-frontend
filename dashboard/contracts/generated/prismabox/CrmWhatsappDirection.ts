import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CrmWhatsappDirection = t.Union(
  [t.Literal("OUTBOUND"), t.Literal("INBOUND")],
  {
    additionalProperties: false,
    description: `[CRM-P4] §9.2 — اتجاه الرسالة. الوارد يصل بالسحب من طابور المزوّد (§17.2 صفّ ١٨).`,
  },
);
