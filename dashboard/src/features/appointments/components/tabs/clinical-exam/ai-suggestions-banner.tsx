import { IconSparkles, IconX } from "@tabler/icons-react";
import { useState } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";

import type { AISuggestion } from "./mock-ai-suggestions";

interface AISuggestionsBannerProps<T extends FieldValues> {
	form: UseFormReturn<T>;
	suggestions: AISuggestion<T>[];
	headerText: string;
	subLabel: string;
}

export function AISuggestionsBanner<T extends FieldValues>({
	form,
	suggestions,
	headerText,
	subLabel,
}: AISuggestionsBannerProps<T>) {
	const [dismissed, setDismissed] = useState(false);

	if (dismissed || suggestions.length === 0) return null;

	const applyOne = (suggestion: AISuggestion<T>) => {
		// biome-ignore lint/suspicious/noExplicitAny: discriminated union — field/value correlation enforced at construction
		form.setValue(suggestion.field, suggestion.value as any, { shouldDirty: true });
	};

	const applyAll = () => {
		for (const s of suggestions) applyOne(s);
		setDismissed(true);
	};

	return (
		<div className="flex flex-col gap-3 rounded-lg border border-amber-200 bg-amber-50/60 p-3">
			<div className="flex items-start justify-between gap-2">
				<div className="flex items-center gap-1.5 text-amber-700">
					<IconSparkles className="size-4 shrink-0" />
					<span className="text-sm font-medium">{headerText}</span>
				</div>
				<button
					type="button"
					onClick={() => setDismissed(true)}
					aria-label="تجاهل"
					className="text-amber-700/70 hover:text-amber-700"
				>
					<IconX className="size-4" />
				</button>
			</div>

			<div className="text-xs font-semibold text-amber-800">{subLabel}</div>

			<div className="flex flex-wrap items-center gap-2">
				<Button
					type="button"
					size="sm"
					variant="outline"
					onClick={applyAll}
					className="h-7 border-amber-300 bg-background px-3 text-xs hover:bg-amber-100"
				>
					تطبيق
				</Button>
				{suggestions.map((s) => (
					<button
						key={`${String(s.field)}-${s.label}`}
						type="button"
						onClick={() => applyOne(s)}
						className="rounded-md bg-amber-100/70 px-2.5 py-1 text-xs text-amber-800 hover:bg-amber-200/70"
					>
						{s.label}
					</button>
				))}
			</div>
		</div>
	);
}
