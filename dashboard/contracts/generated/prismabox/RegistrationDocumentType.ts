import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RegistrationDocumentType = t.Union(
  [
    t.Literal("BIRTH_CERTIFICATE"),
    t.Literal("VACCINATION_CARD"),
    t.Literal("GUARDIAN_ID"),
    t.Literal("MEDICAL_REPORT"),
    t.Literal("OTHER"),
  ],
  { additionalProperties: false },
);
