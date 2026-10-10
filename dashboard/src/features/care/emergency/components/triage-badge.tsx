import {
	formatWait,
	TRIAGE_TONES,
	WAIT_STATE_CLASS,
	type WaitState,
} from "@/features/care/emergency/utils/triage-display";
import type { TriageCategory } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { TRIAGE_CATEGORY_SHORT, TRIAGE_RULES } from "@sanad/contracts/runtime/server/emergency/emergency.rules";

/**
 * [E2] شارة لون الفرز.
 *
 * اللون **ونصّه معًا** دائمًا — لا شارة لونها وحده معناها (انظر التعليل في
 * `triage-display.ts`: عمى الألوان يصيب رجلًا من كل اثني عشر).
 */
export const TriageBadge = ({
	category,
	className,
}: {
	category: TriageCategory;
	className?: string;
}) => (
	<span
		className={cn(
			"inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-medium text-[11px] leading-none",
			TRIAGE_TONES[category].badge,
			className,
		)}
	>
		{TRIAGE_CATEGORY_SHORT[category]}
	</span>
);

/** ساعة الانتظار — الرقم مقابل هدف اللون */
export const WaitClock = ({
	minutes,
	state,
	category,
	className,
}: {
	minutes: number | null;
	state: WaitState;
	category: TriageCategory | null;
	className?: string;
}) => {
	const target = category ? TRIAGE_RULES[category].targetMinutes : null;
	return (
		<span
			className={cn("tabular-nums text-xs", WAIT_STATE_CLASS[state], className)}
			title={target == null ? undefined : `الهدف ${target} دقيقة`}
		>
			{formatWait(minutes)}
			{target != null && target > 0 ? (
				<span className="text-muted-foreground"> / {target} د</span>
			) : null}
		</span>
	);
};
