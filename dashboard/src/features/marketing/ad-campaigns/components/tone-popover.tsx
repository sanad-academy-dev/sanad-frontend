import { IconMoodSmile } from "@tabler/icons-react";
import { useId } from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useI18n } from "@/hooks/use-i18n";

export type ToneState = {
	formal: number;
	friendly: number;
	optimist: number;
};

export const DEFAULT_TONE: ToneState = { formal: 50, friendly: 50, optimist: 50 };

/**
 * المؤشّرات الثلاثة في لوحة «اختر الأسلوب» (شاشة 539739).
 *
 * `<input type="range">` أصليًّا لا مكوّن Radix: لا يوجد `slider` في نظام التصميم،
 * وإضافة مكتبة واجهة جديدة لأجل ثلاثة مؤشّرات مخالفة لقاعدة «أعد الاستخدام قبل
 * أن تبني». المُدخل الأصلي يقلب اتجاهه وحده تحت `dir="rtl"`، ويصل بلوحة المفاتيح
 * مجّانًا — وهو ما كان سيحتاج عملًا إضافيًّا في مكوّن مخصّص.
 *
 * طرف القيمة 0 يقع يمينًا في RTL، فالتسمية الأولى في DOM هي تسمية الصفر.
 */
const SLIDERS: { key: keyof ToneState; low: string; high: string }[] = [
	{ key: "formal", low: "غير رسمي", high: "رسمي" },
	{ key: "friendly", low: "ودّي", high: "حازم" },
	{ key: "optimist", low: "متشائم", high: "متفائل" },
];

export function TonePopover({
	tone,
	onChange,
	disabled,
}: {
	tone: ToneState;
	onChange: (tone: ToneState) => void;
	disabled?: boolean;
}) {
	const { isRtl } = useI18n();
	const groupId = useId();

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					size="xs"
					variant="outline"
					disabled={disabled}
				>
					<IconMoodSmile className="size-3.5" />
					اختر الأسلوب
				</Button>
			</PopoverTrigger>
			{/* محتوى Radix في portal خارج شجرة <html dir> — الاتجاه يُمرَّر صراحةً */}
			<PopoverContent
				dir={isRtl ? "rtl" : "ltr"}
				align="end"
				className="w-72 p-3"
			>
				<p className="mb-3 font-medium text-sm">أسلوب المحتوى</p>

				<div className="flex flex-col gap-4">
					{SLIDERS.map((slider) => {
						const id = `${groupId}-${slider.key}`;
						return (
							<div
								key={slider.key}
								className="flex flex-col gap-1.5"
							>
								<input
									id={id}
									type="range"
									min={0}
									max={100}
									step={1}
									value={tone[slider.key]}
									onChange={(e) => onChange({ ...tone, [slider.key]: Number(e.target.value) })}
									aria-label={`${slider.low} إلى ${slider.high}`}
									className="h-1.5 w-full cursor-pointer appearance-none rounded-[4px] bg-muted accent-primary"
								/>
								<div className="flex items-center justify-between text-muted-foreground text-xs">
									{/* الأول في DOM ⇒ يمينًا في RTL ⇒ طرف القيمة 0 */}
									<span>{slider.low}</span>
									<span>{slider.high}</span>
								</div>
							</div>
						);
					})}
				</div>

				<button
					type="button"
					onClick={() => onChange(DEFAULT_TONE)}
					className="mt-3 text-primary text-xs hover:underline"
				>
					إعادة الضبط
				</button>
			</PopoverContent>
		</Popover>
	);
}
