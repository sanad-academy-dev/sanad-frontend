import type { PsoaFrequency } from "@/generated/prisma/enums";
export type StatementPeriod = {
    fromDate: Date;
    toDate: Date;
};
export declare function statementPeriod(frequency: PsoaFrequency, asOf: Date): StatementPeriod;
