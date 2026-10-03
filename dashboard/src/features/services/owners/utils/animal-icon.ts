import {
	IconCat,
	IconDog,
	IconFeather,
	IconFish,
	IconHorse,
	IconPaw,
} from "@tabler/icons-react";
import type { ComponentType, SVGAttributes } from "react";

type IconComponent = ComponentType<SVGAttributes<SVGElement> & { className?: string }>;

const ANIMAL_ICON_MAP: Array<{ keywords: string[]; icon: IconComponent }> = [
	{ keywords: ["dog"], icon: IconDog },
	{ keywords: ["cat"], icon: IconCat },
	{ keywords: ["bird", "parrot", "cockatiel"], icon: IconFeather },
	{ keywords: ["fish"], icon: IconFish },
	{ keywords: ["horse", "pony"], icon: IconHorse },
];

export function getAnimalIcon(enName: string | null | undefined): IconComponent {
	if (!enName) return IconPaw;
	const lower = enName.toLowerCase();
	for (const { keywords, icon } of ANIMAL_ICON_MAP) {
		if (keywords.some((k) => lower.includes(k))) return icon;
	}
	return IconPaw;
}
