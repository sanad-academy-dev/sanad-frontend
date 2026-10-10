import { IconSparkles } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { cn } from "@/lib/utils";
import type {
	ConsentBlock,
	ConsentFieldDef,
	ConsentOptionDef,
} from "@/server/patient-consents/consent-template.type";
import type { ConsentFieldValues } from "@/server/patient-consents/patient-consents.type";

// عرض كتل القالب كنموذج إدخال. الكتل نفسها تُصيَّر في الخادم إلى المستند
// المطبوع، فلا يوجد تعريفان للنموذج الواحد يفترقان مع الوقت.

const INPUT_TYPE: Record<string, string> = {
	number: "number",
	percent: "number",
	money: "number",
	date: "date",
	time: "time",
	phone: "tel",
	email: "email",
};

const asString = (v: ConsentFieldValues[string]): string => {
	if (v == null) return "";
	if (Array.isArray(v)) return v.join("، ");
	if (typeof v === "boolean") return v ? "نعم" : "لا";
	return v;
};

const asArray = (v: ConsentFieldValues[string]): string[] =>
	Array.isArray(v) ? v : v ? [String(v)] : [];

// سعر قائمة الأكاديمية يسبق السعر المكتوب في النموذج الورقي الأصلي
const optionLabel = (o: ConsentOptionDef, prices?: Record<string, string>): string => {
	const price =
		(o.priceServiceCode ? prices?.[o.priceServiceCode] : undefined) ?? o.priceFallback;
	return price ? `${o.labelAr} — ${price}` : o.labelAr;
};

type FieldProps = {
	field: ConsentFieldDef;
	value: ConsentFieldValues[string];
	onChange: (value: string) => void;
	disabled?: boolean;
	/** يُظهر زر «صِغ لي» على الحقول التي تقبل مسودّة من الذكاء الاصطناعي */
	onAiDraft?: (field: ConsentFieldDef) => void;
	aiPending?: boolean;
	/** الحقل جاء من السجل لا من يد الموظّف — يُعلَّم ليراجعه لا ليعيد كتابته */
	autofilled?: boolean;
	/** أسماء طاقم الأكاديمية — خيارات حقول `staff` */
	staffNames?: string[];
};

const ConsentField = ({
	field,
	value,
	onChange,
	disabled,
	onAiDraft,
	aiPending,
	autofilled,
	staffNames,
}: FieldProps) => {
	const text = asString(value);
	const isLong = field.type === "textarea";
	const isStaff = field.type === "staff";

	/**
	 * قيمة محفوظة لا تطابق أحدًا في الطاقم اليوم تبقى خيارًا قائمًا — الموظّف قد
	 * يكون غادر الأكاديمية أو أُعيدت تسميته بعد التوقيع، ونموذجٌ موقَّع لا يُفرَّغ
	 * حقله لأنّ القائمة تغيّرت. كذلك تُقبل الأسماء التي عبّأها `case.surgeon`.
	 */
	const staffOptions =
		isStaff && text && !staffNames?.includes(text)
			? [text, ...(staffNames ?? [])]
			: (staffNames ?? []);

	return (
		<div className="flex flex-col gap-1.5">
			<div className="flex items-center gap-1.5">
				<Label className="text-sm font-medium">
					{field.labelAr}
					{field.required && <span className="text-destructive"> *</span>}
				</Label>
				{autofilled && !!text && (
					<Badge
						variant="outline"
						className="h-4 px-1 text-[9px] font-normal text-muted-foreground"
					>
						مُعبّأ آليًا
					</Badge>
				)}
				{field.aiDraft && onAiDraft && !disabled && (
					<Button
						type="button"
						size="sm"
						variant="ghost"
						className="ms-auto h-5 gap-1 px-1.5 text-[10px]"
						disabled={aiPending}
						onClick={() => onAiDraft(field)}
					>
						<IconSparkles className="size-3" />
						صِغ لي
					</Button>
				)}
			</div>
			{isStaff ? (
				<Select
					value={text}
					disabled={disabled}
					onValueChange={onChange}
				>
					<SelectTrigger className="h-9 w-full text-sm">
						<SelectValue placeholder={field.placeholderAr ?? "اختر المدرّب"} />
					</SelectTrigger>
					{/* position="popper" إلزامي — الافتراضي يخرج عن الشاشة في RTL */}
					<SelectContent
						position="popper"
						dir="rtl"
					>
						{staffOptions.length === 0 ? (
							<div className="px-2 py-1.5 text-muted-foreground text-xs">
								لا يوجد مدرّبين في الطاقم
							</div>
						) : (
							staffOptions.map((name) => (
								<SelectItem
									key={name}
									value={name}
								>
									{name}
								</SelectItem>
							))
						)}
					</SelectContent>
				</Select>
			) : isLong ? (
				<Textarea
					rows={3}
					className="text-sm"
					value={text}
					disabled={disabled}
					placeholder={field.placeholderAr}
					onChange={(e) => onChange(e.target.value)}
				/>
			) : (
				<Input
					className="h-9 text-sm"
					type={INPUT_TYPE[field.type] ?? "text"}
					value={text}
					disabled={disabled}
					placeholder={field.placeholderAr}
					onChange={(e) => onChange(e.target.value)}
				/>
			)}
		</div>
	);
};

export type ConsentBlockFieldsProps = {
	blocks: ConsentBlock[];
	values: ConsentFieldValues;
	onChange: (key: string, value: ConsentFieldValues[string]) => void;
	disabled?: boolean;
	onAiDraft?: (field: ConsentFieldDef) => void;
	aiPendingKey?: string | null;
	/** مفاتيح الحقول التي عُبّئت آليًا — للتمييز البصري فقط */
	autofilledKeys?: Set<string>;
	/** أسعار البنود المسعَّرة من قائمة أسعار الأكاديمية */
	prices?: Record<string, string>;
};

export const ConsentBlockFields = ({
	blocks,
	values,
	onChange,
	disabled,
	onAiDraft,
	aiPendingKey,
	autofilledKeys,
	prices,
}: ConsentBlockFieldsProps) => {
	// نداء واحد للطاقم يخدم كل حقول `staff` في القالب — react-query يوحّد الطلب
	// مع نداء الورقة نفسها، فلا طلب إضافي على الشبكة.
	const { staff } = useStaff();
	const staffNames = staff.map((member) => member.name);

	return (
		<div className="flex flex-col gap-4">
			{blocks.map((block, index) => {
				// المفتاح: الكتل ثابتة الترتيب داخل نسخة القالب الواحدة
				const key = `${block.kind}-${index}`;

				switch (block.kind) {
					case "heading":
						return (
							<h4
								key={key}
								className="border-b pb-1.5 text-base font-semibold"
							>
								{block.ar}
							</h4>
						);

					case "paragraph":
						return (
							<p
								key={key}
								className="text-sm leading-7 text-muted-foreground"
							>
								{block.ar}
							</p>
						);

					case "fields":
					case "clinicUse":
						return (
							<div
								key={key}
								className={cn(
									"grid gap-3 sm:grid-cols-2",
									block.kind === "clinicUse" && "rounded-[4px] border bg-muted/30 p-3",
								)}
							>
								{block.kind === "clinicUse" && (
									<p className="text-sm font-semibold sm:col-span-2">{block.ar}</p>
								)}
								{block.fields.map((field) => (
									<ConsentField
										key={field.key}
										field={field}
										value={values[field.key]}
										disabled={disabled}
										onChange={(v) => onChange(field.key, v)}
										onAiDraft={onAiDraft}
										aiPending={aiPendingKey === field.key}
										autofilled={autofilledKeys?.has(field.key)}
										staffNames={staffNames}
									/>
								))}
							</div>
						);

					case "choice":
						return (
							<div
								key={key}
								className="flex flex-col gap-2"
							>
								<Label className="text-sm font-medium">
									{block.labelAr}
									{block.required && <span className="text-destructive"> *</span>}
								</Label>
								<RadioGroup
									dir="rtl"
									disabled={disabled}
									value={asString(values[block.key])}
									onValueChange={(v) => onChange(block.key, v)}
									className="gap-2"
								>
									{block.options.map((option) => (
										<Label
											key={option.value}
											className="flex cursor-pointer items-start gap-2.5 rounded-[4px] border p-3 text-sm font-normal leading-7 has-[button[data-state=checked]]:border-primary has-[button[data-state=checked]]:bg-primary/5"
										>
											<RadioGroupItem
												value={option.value}
												className="mt-0.5 shrink-0"
											/>
											<span>{optionLabel(option, prices)}</span>
										</Label>
									))}
								</RadioGroup>
							</div>
						);

					case "checklist": {
						const chosen = asArray(values[block.key]);
						return (
							<div
								key={key}
								className="flex flex-col gap-2"
							>
								<Label className="text-sm font-medium">{block.labelAr}</Label>
								<div className="flex flex-col gap-2">
									{block.options.map((option) => (
										<Label
											key={option.value}
											className="flex cursor-pointer items-start gap-2.5 rounded-[4px] border p-3 text-sm font-normal leading-7 has-[button[data-state=checked]]:border-primary has-[button[data-state=checked]]:bg-primary/5"
										>
											<Checkbox
												className="mt-0.5 shrink-0"
												disabled={disabled}
												checked={chosen.includes(option.value)}
												onCheckedChange={(checked) =>
													onChange(
														block.key,
														checked
															? [...chosen, option.value]
															: chosen.filter((v) => v !== option.value),
													)
												}
											/>
											<span>{optionLabel(option, prices)}</span>
										</Label>
									))}
								</div>
							</div>
						);
					}

					case "initial":
						return (
							<div
								key={key}
								className="flex flex-col gap-1.5 rounded-[4px] border bg-muted/30 p-3"
							>
								<p className="text-sm leading-7">{block.ar}</p>
								<Input
									className="h-9 w-36 text-sm"
									placeholder="الأحرف الأولى"
									disabled={disabled}
									value={asString(values[block.key])}
									onChange={(e) => onChange(block.key, e.target.value)}
								/>
							</div>
						);
					default:
						// الأنواع مستوفاة أعلاه؛ هذا لمسار تنفيذ لا يقع — قالب قديم بكتلة لا نعرفها
						return null;
				}
			})}
		</div>
	);
};
