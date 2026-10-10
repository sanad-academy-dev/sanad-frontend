import { IconCircleCheck, IconSparkles } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import type { AdCopySuggestionView } from "@/features/marketing/ad-campaigns/hooks/use-ad-creatives";

/**
 * بطاقة الاقتراح المُولَّد (المكوّن 537670، شاشة 542705).
 *
 * الوسم «65 شخصية · 28 كلمة · عفوي» يأتي من الخادم لا يُحسب هنا: عدّ الكلمات
 * وتسمية النبرة قرارا الدورة التي ولّدت النصّ، وحسابهما ثانيةً في الواجهة يفتح
 * بابًا لرقمين مختلفين لنفس النصّ.
 */
export function AiSuggestionCard({
	suggestion,
	onApply,
	onSimilar,
	isBusy,
}: {
	suggestion: AdCopySuggestionView;
	onApply: () => void;
	onSimilar: () => void;
	isBusy?: boolean;
}) {
	return (
		<div className="rounded-[4px] border p-3 transition-colors hover:bg-muted/40">
			<p className="mb-2 text-[11px] text-muted-foreground">
				{suggestion.charCount} شخصية · {suggestion.wordCount} كلمة · {suggestion.toneLabel}
			</p>

			<p className="mb-3 whitespace-pre-wrap text-sm leading-relaxed">{suggestion.text}</p>

			{/* «تطبيق» أولًا في DOM ⇒ يمينًا في RTL، كما في التصميم */}
			<div className="flex items-center justify-between gap-2">
				<Button
					size="xs"
					onClick={onApply}
					disabled={isBusy}
				>
					<IconCircleCheck className="size-3.5" />
					تطبيق
				</Button>
				<Button
					size="xs"
					variant="ghost"
					className="text-primary"
					onClick={onSimilar}
					disabled={isBusy}
				>
					<IconSparkles className="size-3.5" />
					اقتراحات مشابهة
				</Button>
			</div>
		</div>
	);
}
