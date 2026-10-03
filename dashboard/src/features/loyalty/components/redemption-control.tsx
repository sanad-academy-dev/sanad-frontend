import { IconCoins } from "@tabler/icons-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRedemptionCapability } from "@/features/loyalty/hooks/use-redemption";

/**
 * [LY-P2] §10.4 — ضابط استبدال النقاط عند مقعد الدفع (شاشة الفاتورة ونقطة البيع).
 *
 * **لا يختفي صامتًا أبدًا وهو ذو صلة.** ثلاث حالات وثلاث رسائل:
 *   • الوحدة مطفأة أو لا برنامج فعّال ⇒ لا شيء — الأكاديمية لا تشغّل الولاء أصلًا، وسطرٌ
 *     يشرح غياب ميزة لم تُشترَ هو ضجيج على كل فاتورة.
 *   • الوحدة تعمل والمستند بلا طرف ⇒ «اربط العميل لاستخدام النقاط» (BR-L6.5). هذه هي
 *     الحالة التي سمّتها §10.4 بالاسم، والاختفاء فيها يجعل الكاشير يظنّ الميزة معطوبة.
 *   • رصيدٌ دون الحدّ الأدنى ⇒ يُعرض الرصيد والحدّ، لا حقلُ إدخالٍ يرفض عند الضغط.
 *
 * والرقم المعروض هو **الرصيد القابل للاستبدال** لا مجموع الدفتر: النقاط المنتهية لا
 * تُنفَق، وعرضُها هنا وعدٌ يُخلَف عند أول محاولة.
 *
 * الخصم الناتج لا يُحسب هنا: يأتي من الخادم مع التسعيرة (`discountLabel`)، لأنّ الشاشة
 * التي تحسب لنفسها هي بالضبط العيب الذي أصلحه [P12B.3] في نسبة الضريبة.
 */
export const RedemptionControl = ({
	ownerId,
	value,
	onChange,
	discountLabel,
	disabled,
	enabled = true,
}: {
	ownerId: string | null | undefined;
	value: number;
	onChange: (points: number) => void;
	/** الخصم الناتج كما حسبه الخادم — نصًّا جاهزًا، أو null قبل وصول التسعيرة */
	discountLabel?: string | null;
	disabled?: boolean;
	enabled?: boolean;
}) => {
	const { capability } = useRedemptionCapability(ownerId, enabled);
	if (!capability) return null;

	if (!capability.available) {
		if (capability.reason === "module-off") return null;
		return (
			<div className="flex items-center gap-2 rounded-md border border-dashed px-3 py-2 text-muted-foreground text-xs">
				<IconCoins className="size-4 shrink-0" />
				<span>اربط العميل لاستخدام النقاط</span>
			</div>
		);
	}

	const { balance, minRedemptionPoints, redemptionRate, maxRedemptionPercent } = capability;

	if (balance < minRedemptionPoints) {
		return (
			<div className="flex items-center gap-2 rounded-md border border-dashed px-3 py-2 text-muted-foreground text-xs">
				<IconCoins className="size-4 shrink-0" />
				<span>
					الرصيد {balance.toLocaleString("ar-EG")} نقطة — الحدّ الأدنى للاستبدال{" "}
					{minRedemptionPoints.toLocaleString("ar-EG")}
				</span>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-1.5 rounded-md border border-chart-4/25 bg-chart-4/5 px-3 py-2">
			<div className="flex items-center gap-2">
				<IconCoins className="size-4 shrink-0 text-chart-4" />
				<Label
					className="font-medium text-sm"
					htmlFor="loyalty-redeem-points"
				>
					استبدال نقاط
				</Label>
				<span className="text-muted-foreground text-xs tabular-nums">
					الرصيد {balance.toLocaleString("ar-EG")}
				</span>
			</div>
			<div className="flex items-center gap-2">
				<Input
					id="loyalty-redeem-points"
					type="number"
					inputMode="numeric"
					min={0}
					max={balance}
					step={1}
					className="h-8 w-28 text-sm"
					disabled={disabled}
					value={value || ""}
					placeholder="0"
					onChange={(e) => onChange(Math.max(0, Math.floor(Number(e.target.value) || 0)))}
				/>
				<span className="text-muted-foreground text-xs">
					{discountLabel ? `خصم ${discountLabel}` : `${redemptionRate} لكل نقطة`}
				</span>
			</div>
			<p className="text-[11px] text-muted-foreground">
				لا يتجاوز الاستبدال {maxRedemptionPercent}% من صافي الفاتورة
			</p>
		</div>
	);
};
