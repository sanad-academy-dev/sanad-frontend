/**
 * [P0.2] Pure classifier for Postgres serialization failures — no DB/env imports so it is
 * unit-testable in isolation. Under Serializable isolation Postgres ABORTS conflicting
 * transactions (SQLSTATE 40001) rather than blocking; Prisma surfaces this as error code
 * `P2034` ("write conflict or deadlock"). These are transient — the caller should retry,
 * not return a 500.
 */
export declare function isSerializationFailure(err: unknown): boolean;
