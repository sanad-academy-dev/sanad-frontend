export function filterOptions(options: string[], search: string): string[] {
	if (!search) return options;

	const normalizedSearch = search.toLowerCase();
	return options.filter((option) => option.toLowerCase().includes(normalizedSearch));
}
