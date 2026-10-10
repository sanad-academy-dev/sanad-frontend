import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const StaffDocumentCategory = t.Union(
  [t.Literal("DOCUMENT"), t.Literal("CERTIFICATE"), t.Literal("IMAGE")],
  { additionalProperties: false },
);
