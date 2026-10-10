export const hexToHue = (hex: string) => {
	const normalizedHex = hex.replace("#", "");

	if (normalizedHex.length !== 6) {
		return 0;
	}

	const r = Number.parseInt(normalizedHex.slice(0, 2), 16) / 255;
	const g = Number.parseInt(normalizedHex.slice(2, 4), 16) / 255;
	const b = Number.parseInt(normalizedHex.slice(4, 6), 16) / 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const delta = max - min;

	if (delta === 0) {
		return 0;
	}

	let hue = 0;

	switch (max) {
		case r:
			hue = ((g - b) / delta) % 6;
			break;
		case g:
			hue = (b - r) / delta + 2;
			break;
		default:
			hue = (r - g) / delta + 4;
	}

	hue *= 60;

	return hue < 0 ? hue + 360 : hue;
};
