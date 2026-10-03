import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PermissionScope = t.Union(
  [t.Literal("ALL"), t.Literal("BRANCH"), t.Literal("OWN")],
  {
    additionalProperties: false,
    description: `[RBAC P1] اتّساع المنحة. يحلّ محلّ ثنائيّة view_limited/view_full:
ALL = كل العيادة، BRANCH = فرع الفاعل، OWN = سجلّاته هو فقط.`,
  },
);
