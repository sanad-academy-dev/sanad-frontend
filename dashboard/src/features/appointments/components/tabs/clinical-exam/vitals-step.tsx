import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Controller, type UseFormReturn } from "react-hook-form";

import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { VitalsPicker } from "@/features/services/vital-signs/components/vitals-picker";
import { cn } from "@/lib/utils";
import type {
	ExamCondition,
	VitalsFormInput,
} from "@/server/clinical-exams/clinical-exams.type";
import type { VitalSignsRecordResponse } from "@/server/vital-signs/vital-signs.type";

import { AIInfoBanner } from "./ai-info-banner";
import { step2InfoMessage } from "./mock-ai-suggestions";

// ── Condition cycling select ───────────────────────────────────────────────────

const CONDITION_LABELS: Record<ExamCondition, string> = {
	NORMAL: "طبيعي",
	ABNORMAL: "غير طبيعي",
	NOT_EXAMINED: "لم يفحص",
};
const CONDITION_ORDER: ExamCondition[] = ["NORMAL", "ABNORMAL", "NOT_EXAMINED"];

interface CyclingSelectProps {
	value: ExamCondition | null | undefined;
	onChange: (v: ExamCondition) => void;
	disabled?: boolean;
}

function CyclingSelect({ value, onChange, disabled }: CyclingSelectProps) {
	const current = value ?? "NORMAL";
	const idx = CONDITION_ORDER.indexOf(current);

	const prev = () => {
		const i = (idx - 1 + CONDITION_ORDER.length) % CONDITION_ORDER.length;
		onChange(CONDITION_ORDER[i] ?? "NORMAL");
	};
	const next = () => {
		const i = (idx + 1) % CONDITION_ORDER.length;
		onChange(CONDITION_ORDER[i] ?? "NORMAL");
	};

	return (
		<div
			className={cn(
				"flex items-center justify-between rounded-md border border-input bg-background px-3 py-2.5",
				disabled && "cursor-not-allowed opacity-50",
			)}
		>
			<button
				type="button"
				onClick={prev}
				disabled={disabled}
				className="text-muted-foreground hover:text-foreground disabled:cursor-not-allowed"
				aria-label="السابق"
			>
				<IconChevronRight className="size-4" />
			</button>
			<span className="text-sm font-medium">{CONDITION_LABELS[current]}</span>
			<button
				type="button"
				onClick={next}
				disabled={disabled}
				className="text-muted-foreground hover:text-foreground disabled:cursor-not-allowed"
				aria-label="التالي"
			>
				<IconChevronLeft className="size-4" />
			</button>
		</div>
	);
}

// ── VitalsStep ─────────────────────────────────────────────────────────────────

interface VitalsStepProps {
	form: UseFormReturn<VitalsFormInput>;
	/** لربط لقطة العلامات الحيوية بهذه الزيارة */
	appointmentId: string;
	patientId: string;
	/** اللقطة المرتبطة حاليًا — تُقرأ من الفحص لا من نسخة محليّة في النموذج */
	attachedVitals?: VitalSignsRecordResponse | null;
	disabled?: boolean;
	isCompleted?: boolean;
}

type ConditionField = keyof Pick<
	VitalsFormInput,
	| "hydration"
	| "skinCondition"
	| "hairCondition"
	| "eyeCondition"
	| "boneCondition"
	| "respiratorySystem"
	| "digestiveSystem"
	| "nervousSystem"
	| "earCondition"
>;

const CONDITION_FIELDS: { name: ConditionField; label: string }[] = [
	{ name: "hydration", label: "الترطيب" },
	{ name: "skinCondition", label: "حالة الجلد" },
	{ name: "hairCondition", label: "حالة الشعر" },
	{ name: "eyeCondition", label: "حالة العيون" },
	{ name: "boneCondition", label: "حالة العظام" },
	{ name: "respiratorySystem", label: "حالة الجهاز التنفسي" },
	{ name: "digestiveSystem", label: "حالة الجهاز الهضمي" },
	{ name: "nervousSystem", label: "حالة الجهاز العصبي" },
	{ name: "earCondition", label: "حالة الأذن" },
];

export function VitalsStep({
	form,
	appointmentId,
	patientId,
	attachedVitals,
	disabled = false,
	isCompleted = false,
}: VitalsStepProps) {
	const { control } = form;

	return (
		<div className="flex flex-col gap-6">
			{!isCompleted && <AIInfoBanner message={step2InfoMessage} />}

			{/*
			  القياسات لم تعد حقولًا في هذا النموذج: الخطوة تربط سجلًا يملكه الطفل،
			  فيظهر آخر قياس تلقائيًا مع عمره ويصلح الاختيار من السجل أو قياس جديد.
			  المربوط يبقى ثابتًا مهما سُجّل بعده (docs/vital-signs-plan.md §4).
			*/}
			<VitalsPicker
				patientId={patientId}
				target={{ type: "VISIT", id: appointmentId }}
				attached={attachedVitals}
				profile="FULL"
				frozen={isCompleted || disabled}
			/>

			{/* فحوصات الحالة — نتائج فحص سريري تخصّ الزيارة، لا قياسات قابلة للرسم */}
			{[0, 3, 6].map((start) => (
				<div
					key={start}
					className="grid grid-cols-1 gap-4 md:grid-cols-3"
				>
					{CONDITION_FIELDS.slice(start, start + 3).map((f) => (
						<ConditionSelect
							key={f.name}
							control={control}
							name={f.name}
							label={f.label}
							disabled={disabled}
						/>
					))}
				</div>
			))}
		</div>
	);
}

// ── Shared field wrappers ──────────────────────────────────────────────────────

interface ConditionSelectProps {
	control: UseFormReturn<VitalsFormInput>["control"];
	name: ConditionField;
	label: string;
	disabled?: boolean;
}

function ConditionSelect({ control, name, label, disabled }: ConditionSelectProps) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field }) => (
				<Field>
					<Label>{label}</Label>
					<CyclingSelect
						value={field.value as ExamCondition | null | undefined}
						onChange={field.onChange}
						disabled={disabled}
					/>
				</Field>
			)}
		/>
	);
}
