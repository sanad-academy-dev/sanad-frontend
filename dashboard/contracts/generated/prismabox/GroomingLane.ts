import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingLane = t.Union(
  [t.Literal("COSMETIC"), t.Literal("MEDICAL")],
  {
    additionalProperties: false,
    description: `مسار الجلسة — تجميلي أم طبي. يقرّر أي البوابات إلزامية وأي اللوحات تظهر (§3).`,
  },
);
