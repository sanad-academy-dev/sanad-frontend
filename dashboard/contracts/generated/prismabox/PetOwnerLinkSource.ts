import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PetOwnerLinkSource = t.Union(
  [t.Literal("PHONE_MATCH"), t.Literal("STAFF_ISSUED")],
  {
    additionalProperties: false,
    description: `*
* كيف نشأ الربط بين حساب المالك وسجلّه في عيادة بعينها.`,
  },
);
