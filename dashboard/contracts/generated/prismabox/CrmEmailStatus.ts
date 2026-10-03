import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CrmEmailStatus = t.Union(
  [t.Literal("SENT"), t.Literal("FAILED")],
  {
    additionalProperties: false,
    description: `[CRM-P3] §9.1 — حالة رسالة البريد. عضوان فقط، وهذا مقصود (قرار المالك، §17.2 صفّ ١٢).
النقل الحالي (Gmail SMTP عبر nodemailer) يحسم عند **قبول** الخادم للرسالة، لا عند
تسليمها: لا تقارير فتح، ولا إيصالات تسليم، ولا خطّاف ارتداد — الارتدادات تعود بريدًا
إلى الصندوق المُرسِل ولا يقرؤه شيء هنا. فأيّ عضوٍ ثالث (DELIVERED/OPENED) سيكون حالةً
لا يستطيع النظام معرفتها. لا تُضِف عضوًا هنا قبل أن يتغيّر النقل نفسه.`,
  },
);
