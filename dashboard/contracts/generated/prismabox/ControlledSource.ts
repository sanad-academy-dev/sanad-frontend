import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ControlledSource = t.Union(
  [t.Literal("CLINIC"), t.Literal("SCHEDULE_PACK")],
  {
    additionalProperties: false,
    description: `من أين عُرف أن هذه المادة مراقبة.
**هذا العمود هو نقطة الاتّصال مع O-PH-1.** الطبقة الأولى من الكتالوج لا تصلح
مصدرًا: صفّان من ١٣٦٥ يحملان \`legalStatus = "Controlled"\` في سجل الغذاء والدواء
السعودي، و٢٤ في السجل الأسترالي وهي جدولة أستراليّة بلا أثر قانوني هنا
(BRD §2.3). فحتى يصل جدول الجدولة الرقابي، تُعلّم العيادة موادّها بنفسها —
و\`source\` يُبقي الفرق ظاهرًا في البيانات لا في وثيقة جانبية.`,
  },
);
