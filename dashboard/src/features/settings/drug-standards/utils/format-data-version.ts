/**
 * `DrugStandard.dataVersion` is a plain `"YYYY-MM-DD"` string on the server, but
 * Eden Treaty's JSON revival turns date-shaped strings into `Date` objects on the
 * client — the static type says `string` while the runtime value is a `Date`.
 *
 * Rendering that raw crashes the page ("Objects are not valid as a React child"),
 * and interpolating it into a translation prints the full
 * "Wed Aug 12 2026 03:00:00 GMT+0300 (Arabian Standard Time)". Every display path
 * goes through here instead.
 */
export function formatDataVersion(value: string | Date | null | undefined): string {
	if (value == null) return "—";
	if (value instanceof Date) {
		return Number.isNaN(value.getTime()) ? "—" : value.toISOString().slice(0, 10);
	}
	// already the wire format; keep only the day part if a full ISO string arrives
	return String(value).slice(0, 10);
}
