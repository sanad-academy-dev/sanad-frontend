import { hexToHue } from "@/features/dashboard/utils/customize-sheet";

export const presetColors = ["#0B4642", "#1E40AF", "#7C3AED", "#BE185D", "#B45309"];

export const presetOptions = presetColors.map((color) => ({
	color,
	hue: hexToHue(color),
}));
