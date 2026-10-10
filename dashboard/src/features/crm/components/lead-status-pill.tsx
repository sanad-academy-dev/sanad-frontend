import { cn } from "@/lib/utils";

/**
 * [CRM-P1] §2.1 — the status colour is a DESIGN-TOKEN KEY, never a hex value (§17.2 row 2,
 * and CLAUDE.md rule 1 forbids hardcoded colours outright). The eight tokens live in
 * `src/styles.css`; this map is the one place a token key becomes classes, so a new token
 * is added here and nowhere else.
 *
 * Tailwind cannot see `bg-${token}`, so the classes are written out — a dynamic string
 * would be silently purged from the bundle and every pill would render unstyled.
 */
const TOKEN_CLASS: Record<string, string> = {
	"chart-1": "bg-chart-1/12 text-chart-1 border-chart-1/25",
	"chart-2": "bg-chart-2/12 text-chart-2 border-chart-2/25",
	"chart-3": "bg-chart-3/12 text-chart-3 border-chart-3/25",
	"chart-4": "bg-chart-4/12 text-chart-4 border-chart-4/25",
	"chart-5": "bg-chart-5/12 text-chart-5 border-chart-5/25",
	"chart-6": "bg-chart-6/12 text-chart-6 border-chart-6/25",
	"chart-7": "bg-chart-7/12 text-chart-7 border-chart-7/25",
	"chart-8": "bg-chart-8/12 text-chart-8 border-chart-8/25",
};

/** An unknown token must still render legibly rather than vanish. */
const FALLBACK_CLASS = "bg-muted text-muted-foreground border-border";

export const statusTokenClass = (color: string | null | undefined): string =>
	(color && TOKEN_CLASS[color]) || FALLBACK_CLASS;

export const LeadStatusPill = ({
	name,
	color,
	className,
}: {
	name: string;
	color?: string | null;
	className?: string;
}) => (
	<span
		className={cn(
			"inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold",
			statusTokenClass(color),
			className,
		)}
	>
		{name}
	</span>
);
