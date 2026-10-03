import { IconHelpCircle, IconSparkles } from "@tabler/icons-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

export type AudienceCardData = {
	name: string;
	ageMin: number | null;
	ageMax: number | null;
	locations: string[];
	languages: string[];
	estimatedReach: number | null;
	isAiSuggested: boolean;
	aiRationale: string | null;
};

/**
 * بطاقة الجمهور (المكوّن 537714، شاشة 545755).
 *
 * «الوصول المتوقع» يبقى شرطة تحت القرار D1: الرقم تحسبه المنصّة من مخزونها
 * الإعلاني ولا نملك منه شيئًا قبل الربط. رقمٌ نخترعه سيبدو قياسًا وستُبنى عليه
 * ميزانية — والتلميح يقول لماذا هو فارغ بدل أن يترك المستخدم يظنّه عطلًا.
 */
export function AudienceCard({
	audience,
	selected,
	onSelect,
}: {
	audience: AudienceCardData;
	selected?: boolean;
	onSelect?: () => void;
}) {
	const { isRtl } = useI18n();

	const ageLabel =
		audience.ageMin !== null && audience.ageMax !== null
			? `${audience.ageMin} – ${audience.ageMax}`
			: "—";

	return (
		// الجذر عنصر عادي لا زرّ: «لماذا هذا موصى به؟» زرٌّ بذاته، وزرٌّ داخل زرّ
		// HTML غير صالح ويكسر التنقّل بلوحة المفاتيح. زرّ الاختيار يغطّي البطاقة
		// كطبقة تحت المحتوى، ويعلوه زرّ الشرح وحده.
		<div
			className={cn(
				"relative rounded-[4px] border p-3 transition-colors",
				onSelect && "hover:bg-muted/50",
				selected && "border-primary bg-primary/5",
			)}
		>
			{onSelect && (
				<button
					type="button"
					onClick={onSelect}
					aria-label={`اختيار الجمهور ${audience.name}`}
					className="absolute inset-0 z-0 rounded-[4px]"
				/>
			)}

			<div className="pointer-events-none relative z-10 mb-2 flex items-center gap-2">
				<span className="min-w-0 flex-1 truncate font-medium text-sm">{audience.name}</span>

				{audience.isAiSuggested && (
					<span className="flex shrink-0 items-center gap-1 rounded-[4px] bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
						<IconSparkles className="size-3" />
						مقترح
					</span>
				)}

				{audience.aiRationale && (
					<Popover>
						<PopoverTrigger
							type="button"
							// الصفّ كلّه `pointer-events-none` ليمرّ النقر إلى زرّ الاختيار
							// تحته؛ هذا الزرّ وحده يستعيدها فيلتقط نقرته دون غيرها
							className="pointer-events-auto flex shrink-0 items-center gap-1 text-[11px] text-primary hover:underline"
						>
							<IconHelpCircle className="size-3.5" />
							لماذا هذا موصى به؟
						</PopoverTrigger>
						<PopoverContent
							dir={isRtl ? "rtl" : "ltr"}
							align="end"
							className="pointer-events-auto w-72 p-3"
						>
							<p className="mb-1 font-medium text-xs">لماذا هذا موصى به؟</p>
							<p className="text-muted-foreground text-xs leading-relaxed">
								{audience.aiRationale}
							</p>
						</PopoverContent>
					</Popover>
				)}
			</div>

			<dl className="pointer-events-none relative z-10 grid grid-cols-4 gap-2 text-xs">
				<Field label="العمر">{ageLabel}</Field>
				<Field label="الموقع">{audience.locations[0] ?? "—"}</Field>
				<Field label="اللغة">{audience.languages[0] ?? "—"}</Field>
				<Field
					label="الوصول المتوقع"
					hint="تحسبه المنصّة عند رفع الحملة إلى مدير الإعلانات — لا يُقدَّر هنا"
				>
					{audience.estimatedReach !== null
						? new Intl.NumberFormat("en-US").format(audience.estimatedReach)
						: "—"}
				</Field>
			</dl>
		</div>
	);
}

function Field({
	label,
	hint,
	children,
}: {
	label: string;
	hint?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="min-w-0">
			<dt
				className="truncate text-[10px] text-muted-foreground"
				title={hint}
			>
				{label}
			</dt>
			<dd className="truncate font-medium">{children}</dd>
		</div>
	);
}
