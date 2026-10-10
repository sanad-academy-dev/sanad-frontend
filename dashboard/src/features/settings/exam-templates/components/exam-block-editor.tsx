import { IconChevronDown, IconChevronUp, IconPlus, IconTrash } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
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
import {
	emptyBlock,
	KIND_HINTS,
	KIND_LABELS,
	SECTION_LABELS,
} from "@/features/settings/exam-templates/data/block-kinds";
import {
	EXAM_BLOCK_KINDS,
	type ExamBlock,
	type ExamBlockKind,
	SOAP_SECTIONS,
	type SoapSection,
} from "@sanad/contracts/runtime/server/clinical-notes/clinical-notes.type";

/**
 * [S3] محرّر كتلة واحدة.
 *
 * المعرّف قابل للتحرير ومعروض دائمًا لا مخفيًّا: هو مفتاح `answers`، وتغييره على
 * قالبٍ استُعمل ييتّم كل إجابة مخزّنة. إخفاؤه كان سيجعل الأثر غير مرئي تمامًا.
 */
export const ExamBlockEditor = ({
	block,
	index,
	total,
	disabled,
	onChange,
	onRemove,
	onMove,
}: {
	block: ExamBlock;
	index: number;
	total: number;
	disabled?: boolean;
	onChange: (next: ExamBlock) => void;
	onRemove: () => void;
	onMove: (direction: -1 | 1) => void;
}) => {
	const patch = (fields: Partial<ExamBlock>) => onChange({ ...block, ...fields } as ExamBlock);

	const changeKind = (kind: ExamBlockKind) => {
		// تبديل النوع يُعيد بناء الحقول الخاصّة به ويُبقي المعرّف والقسم والعنوان
		const fresh = emptyBlock(kind, block.section, block.id);
		onChange({ ...fresh, labelAr: block.labelAr, required: block.required } as ExamBlock);
	};

	return (
		<div className="rounded-[4px] border p-3">
			<div className="flex items-center gap-2">
				<span className="text-muted-foreground text-xs">{index + 1}</span>
				<Input
					className="h-8 flex-1"
					placeholder="عنوان الكتلة — «الشكوى الرئيسية»"
					value={block.labelAr}
					disabled={disabled}
					onChange={(event) => patch({ labelAr: event.target.value })}
				/>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="size-8"
					disabled={disabled || index === 0}
					aria-label="تحريك لأعلى"
					onClick={() => onMove(-1)}
				>
					<IconChevronUp className="size-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="size-8"
					disabled={disabled || index === total - 1}
					aria-label="تحريك لأسفل"
					onClick={() => onMove(1)}
				>
					<IconChevronDown className="size-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="size-8 text-destructive"
					disabled={disabled}
					aria-label="حذف الكتلة"
					onClick={onRemove}
				>
					<IconTrash className="size-4" />
				</Button>
			</div>

			<div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
				<div className="space-y-1">
					<Label className="text-xs">القسم</Label>
					<Select
						value={block.section}
						disabled={disabled}
						onValueChange={(value) => patch({ section: value as SoapSection })}
					>
						<SelectTrigger className="h-8 w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent position="popper">
							{SOAP_SECTIONS.map((section) => (
								<SelectItem
									key={section}
									value={section}
								>
									{SECTION_LABELS[section]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-1">
					<Label className="text-xs">النوع</Label>
					<Select
						value={block.kind}
						disabled={disabled}
						onValueChange={(value) => changeKind(value as ExamBlockKind)}
					>
						<SelectTrigger className="h-8 w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent position="popper">
							{EXAM_BLOCK_KINDS.map((kind) => (
								<SelectItem
									key={kind}
									value={kind}
								>
									{KIND_LABELS[kind]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-1">
					<Label className="text-xs">المعرّف</Label>
					<Input
						className="h-8 font-mono text-xs"
						dir="ltr"
						value={block.id}
						disabled={disabled}
						onChange={(event) => patch({ id: event.target.value })}
					/>
				</div>
			</div>

			<p className="mt-2 text-muted-foreground text-xs">{KIND_HINTS[block.kind]}</p>

			<KindFields
				block={block}
				disabled={disabled}
				onChange={onChange}
			/>

			<div className="mt-3 flex items-center gap-2">
				<Checkbox
					id={`${block.id}-required`}
					checked={block.required ?? false}
					disabled={disabled || block.kind === "vitalsRef"}
					onCheckedChange={(checked) => patch({ required: checked === true })}
				/>
				<Label
					htmlFor={`${block.id}-required`}
					className="text-xs font-normal"
				>
					إلزامية — تمنع التوثيق ما لم تُملأ
				</Label>
			</div>
		</div>
	);
};

/** الحقول الخاصّة بكل نوع. `prose` و`vitalsRef` لا يحتاجان شيئًا. */
const KindFields = ({
	block,
	disabled,
	onChange,
}: {
	block: ExamBlock;
	disabled?: boolean;
	onChange: (next: ExamBlock) => void;
}) => {
	if (block.kind === "prose") {
		return (
			<Input
				className="mt-3 h-8"
				placeholder="نصّ إرشادي داخل الحقل (اختياري)"
				value={block.placeholderAr ?? ""}
				disabled={disabled}
				onChange={(event) => onChange({ ...block, placeholderAr: event.target.value })}
			/>
		);
	}

	if (block.kind === "scale") {
		return (
			<div className="mt-3 flex items-center gap-3">
				<div className="space-y-1">
					<Label className="text-xs">الأدنى</Label>
					<Input
						type="number"
						className="h-8 w-24"
						value={block.min}
						disabled={disabled}
						onChange={(event) => onChange({ ...block, min: Number(event.target.value) || 0 })}
					/>
				</div>
				<div className="space-y-1">
					<Label className="text-xs">الأعلى</Label>
					<Input
						type="number"
						className="h-8 w-24"
						value={block.max}
						disabled={disabled}
						onChange={(event) => onChange({ ...block, max: Number(event.target.value) || 0 })}
					/>
				</div>
			</div>
		);
	}

	if (block.kind === "select" || block.kind === "multiselect") {
		return (
			<KeyedRows
				label="الخيارات"
				disabled={disabled}
				rows={block.options.map((option) => ({ key: option.value, labelAr: option.labelAr }))}
				onChange={(rows) =>
					onChange({
						...block,
						options: rows.map((row) => ({ value: row.key, labelAr: row.labelAr })),
					})
				}
			/>
		);
	}

	if (block.kind === "checklist") {
		return (
			<KeyedRows
				label="البنود"
				disabled={disabled}
				rows={block.items}
				onChange={(rows) => onChange({ ...block, items: rows })}
			/>
		);
	}

	if (block.kind === "bodySystems") {
		return (
			<KeyedRows
				label="الأجهزة"
				disabled={disabled}
				rows={block.systems}
				onChange={(rows) => onChange({ ...block, systems: rows })}
			/>
		);
	}

	return null;
};

/**
 * صفوف «مفتاح + اسم» — يخدم الخيارات والبنود والأجهزة معًا. الثلاثة شكل واحد،
 * فبناء ثلاثة محرّرات متطابقة كان سيضاعف السطح بلا مقابل.
 */
const KeyedRows = ({
	label,
	rows,
	disabled,
	onChange,
}: {
	label: string;
	rows: readonly { key: string; labelAr: string }[];
	disabled?: boolean;
	onChange: (rows: { key: string; labelAr: string }[]) => void;
}) => {
	const update = (index: number, patch: Partial<{ key: string; labelAr: string }>) =>
		onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));

	return (
		<div className="mt-3 space-y-2">
			<div className="flex items-center justify-between">
				<Label className="text-xs">{label}</Label>
				<Button
					type="button"
					variant="outline"
					size="sm"
					disabled={disabled}
					onClick={() => onChange([...rows, { key: `item_${rows.length + 1}`, labelAr: "" }])}
				>
					<IconPlus className="size-3.5" />
					إضافة
				</Button>
			</div>

			{rows.map((row, index) => (
				<div
					key={`${label}-${index}`}
					className="flex items-center gap-2"
				>
					<Input
						className="h-8 w-40 font-mono text-xs"
						dir="ltr"
						value={row.key}
						disabled={disabled}
						onChange={(event) => update(index, { key: event.target.value })}
					/>
					<Input
						className="h-8 flex-1"
						placeholder="الاسم المعروض"
						value={row.labelAr}
						disabled={disabled}
						onChange={(event) => update(index, { labelAr: event.target.value })}
					/>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="size-8 text-destructive"
						disabled={disabled || rows.length === 1}
						aria-label="حذف"
						onClick={() => onChange(rows.filter((_, i) => i !== index))}
					>
						<IconTrash className="size-4" />
					</Button>
				</div>
			))}
		</div>
	);
};
