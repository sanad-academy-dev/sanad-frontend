export function getSizeLabel(weightMax: number | null): string | null {
	if (weightMax === null) return null;
	if (weightMax <= 10) return "صغير";
	if (weightMax <= 25) return "متوسط";
	return "كبير";
}

export function formatRange(min: number | null, max: number | null, unit: string): string {
	if (min === null && max === null) return "—";
	if (min !== null && max !== null) return `${min} - ${max} ${unit}`;
	if (min !== null) return `${min}+ ${unit}`;
	return `حتى ${max} ${unit}`;
}

export function parseCommaSeparatedValues(value: string): string[] {
	return value
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean);
}

export function toOptionalNumber(value: string): number | undefined {
	return value === "" ? undefined : Number(value);
}
