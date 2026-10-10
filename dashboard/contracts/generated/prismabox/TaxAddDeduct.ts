import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TaxAddDeduct = t.Union([t.Literal("ADD"), t.Literal("DEDUCT")], {
  additionalProperties: false,
});
