import { IconInfoCircle } from "@tabler/icons-react";

import { RequiredMark } from "@/components/common/required-mark";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export type BudgetState = {
	startsAt: string;
	endsAt: string;
	budgetKind: "DAILY" | "LIFETIME";
	budgetAmount: string;
};

const currency = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export function durationDays(startsAt: string, endsAt: string): number | null {
	if (!startsAt || !endsAt) return null;
	const start = new Date(`${startsAt}T00:00:00.000Z`).getTime();
	const end = new Date(`${endsAt}T00:00:00.000Z`).getTime();
	if (Number.isNaN(start) || Number.isNaN(end) || end < start) return null;
	return Math.round((end - start) / 86_400_000) + 1;
}

/**
 * [MK6.1] الخطوة الثالثة — «الجدول والميزانية».
 *
 * **الحقول هنا غير مرسومة في Figma (الفجوة G1).** التصميم سمّى الخطوة ورسم
 * «طريقة الدفع» و«الملخّص» فقط، فلا مصدر للمدّة ولا للميزانية اللتين يعرضهما
 * الجدول والملخّص. هذه أقلّ مجموعة حقول تجعل الخطوة عاملة: نافذة زمنية، ونوع
 * ميزانية، ومبلغ.
 *
 * **الملخّص يقول الحقيقة تحت القرار D1 (الفجوة G2).** التصميم يعرض أربعة سطور
 * (مجموع فرعي · ميزانية · رسوم · إجمالي) بأرقام لا تتّسق حسابيًّا. ونحن لا نبيع
 * وسائط ولا نُحصّل شيئًا، فسطر «الرسوم» سيكون صفرًا دائمًا — وعرض رسمٍ لا يُحصَّل
 * كذبٌ في فاتورة. نعرض بدلًا منه ما يمكن اشتقاقه فعلًا: المبلغ اليومي × المدّة =
 * إجمالي ما ستُنفقه المنصّة، مع سطر صريح يقول إن الدفع يتمّ لدى المنصّة.
 */
export function StepBudget({
	value,
	onChange,
	disabled,
}: {
	value: BudgetState;
	onChange: (next: BudgetState) => void;
	disabled?: boolean;
}) {
	const days = durationDays(value.startsAt, value.endsAt);
	const amount = Number(value.budgetAmount) || 0;
	const total = value.budgetKind === "DAILY" && days ? amount * days : amount;

	return (
		<div className="flex flex-col gap-4">
			<div>
				<h3 className="mb-2 font-medium text-sm">الجدولة</h3>
				<div className="grid grid-cols-2 gap-3">
					<div className="flex flex-col gap-1.5">
						<span className="flex items-center gap-1 text-xs">
							تاريخ البداية
							<RequiredMark />
						</span>
						<Input
							type="date"
							dir="ltr"
							disabled={disabled}
							value={value.startsAt}
							onChange={(e) => onChange({ ...value, startsAt: e.target.value })}
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<span className="flex items-center gap-1 text-xs">
							تاريخ النهاية
							<RequiredMark />
						</span>
						<Input
							type="date"
							dir="ltr"
							disabled={disabled}
							min={value.startsAt || undefined}
							value={value.endsAt}
							onChange={(e) => onChange({ ...value, endsAt: e.target.value })}
						/>
					</div>
				</div>

				<p className="mt-1.5 text-muted-foreground text-xs">
					{days ? `المدة: ${days} يوم` : "حدّد التاريخين لحساب المدة"}
				</p>
			</div>

			<div>
				<h3 className="mb-2 font-medium text-sm">الميزانية</h3>
				<div className="grid grid-cols-2 gap-3">
					<div className="flex flex-col gap-1.5">
						<span className="flex items-center gap-1 text-xs">
							نوع الميزانية
							<RequiredMark />
						</span>
						<Select
							value={value.budgetKind}
							onValueChange={(v) =>
								onChange({ ...value, budgetKind: v as BudgetState["budgetKind"] })
							}
							disabled={disabled}
						>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
							{/* الافتراضي item-aligned يخرج خارج الشاشة في RTL */}
							<SelectContent position="popper">
								<SelectItem value="DAILY">يومية</SelectItem>
								<SelectItem value="LIFETIME">إجمالية للحملة</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col gap-1.5">
						<span className="flex items-center gap-1 text-xs">
							{value.budgetKind === "DAILY" ? "المبلغ اليومي" : "المبلغ الإجمالي"}
							<RequiredMark />
						</span>
						<Input
							type="number"
							min={1}
							dir="ltr"
							disabled={disabled}
							value={value.budgetAmount}
							onChange={(e) => onChange({ ...value, budgetAmount: e.target.value })}
							placeholder="0"
						/>
					</div>
				</div>
			</div>

			<div>
				<h3 className="mb-2 font-medium text-sm">الملخّص</h3>
				<dl className="rounded-[4px] border text-sm">
					<Row label={value.budgetKind === "DAILY" ? "المبلغ اليومي" : "المبلغ الإجمالي"}>
						{amount ? `${currency.format(amount)} ر.س` : "—"}
					</Row>
					<Row label="المدة">{days ? `${days} يوم` : "—"}</Row>
					<Row
						label="الإجمالي المتوقّع"
						emphasis
					>
						{total ? `${currency.format(total)} ر.س` : "—"}
					</Row>
				</dl>

				{/* بديل قسم «طريقة الدفع» المرسوم: لا بطاقة تُحفظ ولا مبلغ يُحصَّل هنا (D1) */}
				<p className="mt-2 flex items-start gap-1.5 rounded-[4px] bg-muted/50 p-2.5 text-muted-foreground text-xs leading-relaxed">
					<IconInfoCircle className="mt-0.5 size-3.5 shrink-0" />
					<span>
						الدفع يتمّ لدى منصّة الإعلان نفسها بوسيلة الدفع المسجّلة في حسابك هناك. لا يحفظ النظام
						بطاقة ولا يُحصّل أي مبلغ — الميزانية أعلاه هي ما ستُنفقه المنصّة.
					</span>
				</p>
			</div>
		</div>
	);
}

function Row({
	label,
	emphasis,
	children,
}: {
	label: string;
	emphasis?: boolean;
	children: React.ReactNode;
}) {
	return (
		<div className="flex items-center justify-between border-b px-3 py-2 last:border-b-0">
			<dt className="text-muted-foreground text-xs">{label}</dt>
			<dd
				dir="ltr"
				className={emphasis ? "font-semibold text-sm" : "text-sm"}
			>
				{children}
			</dd>
		</div>
	);
}
