import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ExamBlock, NoteAnswerValue } from "@/server/clinical-notes/clinical-notes.type";

/**
 * [S4] كتلة واحدة كحقل إدخال.
 *
 * الشكل يتبع القالب لا الشيفرة — وهذا هو الفرق كلّه عن المعالج ذي الخطوات الأربع:
 * إضافة بند إلى قائمة البروتوكول كانت هجرة قاعدة بيانات، وصارت صفّ بيانات.
 */

const CONDITIONS = [
	{ value: "NORMAL", labelAr: "طبيعي" },
	{ value: "ABNORMAL", labelAr: "غير طبيعي" },
	{ value: "NOT_EXAMINED", labelAr: "لم يُفحص" },
];

export const NoteBlockField = ({
	block,
	value,
	readOnly,
	vitalsSummary,
	onChange,
}: {
	block: ExamBlock;
	value: NoteAnswerValue | undefined;
	readOnly: boolean;
	/** نصّ القياس المرتبط — تكتبه وحدة العلامات الحيوية لا هذه الشاشة */
	vitalsSummary?: string | null;
	onChange: (value: NoteAnswerValue) => void;
}) => {
	const asRecord = (): Record<string, string | boolean> =>
		typeof value === "object" && value !== null && !Array.isArray(value)
			? (value as Record<string, string | boolean>)
			: {};

	const label = (
		<Label className="text-xs">
			{block.labelAr}
			{block.required && <span className="text-destructive"> *</span>}
		</Label>
	);

	if (block.kind === "vitalsRef") {
		return (
			<div className="space-y-1">
				{label}
				{/* للقراءة فقط دائمًا: القياس يُكتب في وحدة العلامات الحيوية، والملاحظة
				    تشير إليه ولا تعيد التقاطه. */}
				<p className="rounded-[4px] border bg-muted/40 px-3 py-2 text-xs">
					{vitalsSummary || "لا قياس مرتبط بهذه الزيارة بعد"}
				</p>
			</div>
		);
	}

	if (block.kind === "prose") {
		return (
			<div className="space-y-1">
				{label}
				<Textarea
					rows={3}
					placeholder={block.placeholderAr}
					value={typeof value === "string" ? value : ""}
					disabled={readOnly}
					onChange={(event) => onChange(event.target.value)}
				/>
			</div>
		);
	}

	if (block.kind === "select") {
		return (
			<div className="space-y-1">
				{label}
				<Select
					value={typeof value === "string" ? value : ""}
					disabled={readOnly}
					onValueChange={onChange}
				>
					<SelectTrigger className="h-8 w-full">
						<SelectValue placeholder="اختر..." />
					</SelectTrigger>
					<SelectContent position="popper">
						{block.options.map((option) => (
							<SelectItem
								key={option.value}
								value={option.value}
							>
								{option.labelAr}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		);
	}

	if (block.kind === "multiselect") {
		const selected = Array.isArray(value) ? value : [];
		return (
			<div className="space-y-1">
				{label}
				<div className="flex flex-wrap gap-3">
					{block.options.map((option) => (
						<div
							key={option.value}
							className="flex items-center gap-2"
						>
							<Checkbox
								id={`${block.id}-${option.value}`}
								checked={selected.includes(option.value)}
								disabled={readOnly}
								onCheckedChange={(checked) =>
									onChange(
										checked === true
											? [...selected, option.value]
											: selected.filter((item) => item !== option.value),
									)
								}
							/>
							<Label
								htmlFor={`${block.id}-${option.value}`}
								className="font-normal text-xs"
							>
								{option.labelAr}
							</Label>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (block.kind === "scale") {
		return (
			<div className="space-y-1">
				{label}
				<Input
					type="number"
					min={block.min}
					max={block.max}
					className="h-8 w-28"
					value={typeof value === "number" ? value : ""}
					disabled={readOnly}
					onChange={(event) =>
						onChange(event.target.value === "" ? "" : Number(event.target.value))
					}
				/>
				<p className="text-muted-foreground text-xs">
					من {block.min} إلى {block.max}
				</p>
			</div>
		);
	}

	if (block.kind === "bodySystems") {
		const record = asRecord();
		return (
			<div className="space-y-2">
				{label}
				<div className="grid grid-cols-1 gap-2 md:grid-cols-2">
					{block.systems.map((system) => (
						<div
							key={system.key}
							className="flex items-center justify-between gap-2"
						>
							<span className="text-xs">{system.labelAr}</span>
							<Select
								value={
									typeof record[system.key] === "string" ? String(record[system.key]) : ""
								}
								disabled={readOnly}
								onValueChange={(next) => onChange({ ...record, [system.key]: next })}
							>
								<SelectTrigger className="h-8 w-40">
									<SelectValue placeholder="اختر..." />
								</SelectTrigger>
								<SelectContent position="popper">
									{CONDITIONS.map((condition) => (
										<SelectItem
											key={condition.value}
											value={condition.value}
										>
											{condition.labelAr}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (block.kind === "checklist") {
		const record = asRecord();
		const done = block.items.filter((item) => record[item.key] === true).length;
		return (
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					{label}
					<span className="text-muted-foreground text-xs">
						{done}/{block.items.length}
					</span>
				</div>
				<div className="grid grid-cols-1 gap-2 md:grid-cols-2">
					{block.items.map((item) => (
						<div
							key={item.key}
							className="flex items-center gap-2"
						>
							<Checkbox
								id={`${block.id}-${item.key}`}
								checked={record[item.key] === true}
								disabled={readOnly}
								onCheckedChange={(checked) =>
									onChange({ ...record, [item.key]: checked === true })
								}
							/>
							<Label
								htmlFor={`${block.id}-${item.key}`}
								className="font-normal text-xs"
							>
								{item.labelAr}
							</Label>
						</div>
					))}
				</div>
			</div>
		);
	}

	return null;
};
