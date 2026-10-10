import type { ElementType } from "react";

export type SelectOption<TValue extends string> = {
	value: TValue;
	label: string;
	icon: ElementType;
	priority?: number;
	iconClassName?: string;
	badgeClassName?: string;
};

export type DeadlinePreset = "today" | "tomorrow" | "afterWeek";
