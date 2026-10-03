import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CrmWhatsappStatus = t.Union(
  [
    t.Literal("SENT"),
    t.Literal("DELIVERED"),
    t.Literal("READ"),
    t.Literal("FAILED"),
  ],
  {
    additionalProperties: false,
    description: `[CRM-P4] §9.2 — حالة رسالة واتساب. **أربعة أعضاء، لا اثنان** (§17.2 صفّ ١٦).
يخالف \`CrmEmailStatus\` عمدًا: بوّابة Green API تُبلّغ sent/delivered/read/failed عبر
خطّاف \`outgoingMessageStatus\`، وGmail SMTP لا تُبلّغ شيئًا. العدد المختلف نتيجةُ
اختلاف الناقلَين، لا تناقضٌ يُصلَح بتوحيدهما.`,
  },
);
