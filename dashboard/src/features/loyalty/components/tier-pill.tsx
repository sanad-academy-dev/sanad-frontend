import { cn } from "@/lib/utils";

/**
 * [LY-P0] §4 — لون المستوى **مفتاح رمز تصميم**، لا قيمة hex (§17.2 صفّ ٢ من CRM،
 * وقاعدة CLAUDE.md الأولى). هذا الملفّ هو الموضع الوحيد الذي يصير فيه المفتاح أصنافًا،
 * فرمزٌ جديد يُضاف هنا ولا شيء غيره.
 *
 * Tailwind لا يرى `bg-${token}`، فالأصناف مكتوبة كاملة — سلسلةٌ ديناميكية كانت ستُقتطع
 * من الحزمة بصمت فتُرسم كل الشارات بلا لون.
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

/** رمزٌ غير معروف يجب أن يُرسم مقروءًا لا أن يختفي. */
const FALLBACK_CLASS = "bg-muted text-muted-foreground border-border";

export const tierTokenClass = (token: string | null | undefined): string =>
	(token && TOKEN_CLASS[token]) || FALLBACK_CLASS;

export const TierPill = ({
	name,
	colorToken,
	className,
}: {
	name: string;
	colorToken?: string | null;
	className?: string;
}) => (
	<span
		className={cn(
			"inline-flex items-center rounded-full border px-2 py-0.5 font-semibold text-[11px]",
			tierTokenClass(colorToken),
			className,
		)}
	>
		{name}
	</span>
);
