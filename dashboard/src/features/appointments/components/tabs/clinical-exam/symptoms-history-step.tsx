import { IconMicrophone } from "@tabler/icons-react";
import { Controller, type UseFormReturn } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError } from "@/components/ui/field";
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
import { cn } from "@/lib/utils";
import type {
	ClinicalSymptom,
	SymptomsHistoryFormInput,
} from "@/server/clinical-exams/clinical-exams.type";

import { AISuggestionsBanner } from "./ai-suggestions-banner";
import { step1Suggestions } from "./mock-ai-suggestions";

const SYMPTOM_OPTIONS: { value: ClinicalSymptom; label: string }[] = [
	{ value: "VOMITING", label: "قيء" },
	{ value: "DIARRHEA", label: "إسهال" },
	{ value: "COUGH", label: "سعال" },
	{ value: "SNEEZING", label: "عطس" },
	{ value: "LETHARGY", label: "خمول" },
];

const LEVEL_OPTIONS = [
	{ value: "NORMAL", label: "طبيعي" },
	{ value: "INCREASED", label: "زيادة" },
	{ value: "DECREASED", label: "نقص" },
	{ value: "ABSENT", label: "غياب" },
] as const;

interface SymptomsHistoryStepProps {
	form: UseFormReturn<SymptomsHistoryFormInput>;
	disabled?: boolean;
	isCompleted?: boolean;
}

export function SymptomsHistoryStep({
	form,
	disabled = false,
	isCompleted = false,
}: SymptomsHistoryStepProps) {
	const {
		register,
		control,
		formState: { errors },
	} = form;

	return (
		<div className="flex flex-col gap-6">
			{!isCompleted && (
				<AISuggestionsBanner
					form={form}
					suggestions={step1Suggestions}
					headerText="اقتراح AI: بناءً على الإستبيان الطبي، نقترح:"
					subLabel="الإقتراحات الإستبيان الطبي AI:"
				/>
			)}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Field data-invalid={!!errors.chiefComplaint}>
					<Label htmlFor="chiefComplaint">
						الشكوى الرئيسية <span className="text-destructive">*</span>
					</Label>
					<Input
						id="chiefComplaint"
						placeholder="عدم تناول طعام"
						aria-invalid={!!errors.chiefComplaint}
						disabled={disabled}
						{...register("chiefComplaint")}
					/>
					<FieldError errors={[errors.chiefComplaint]} />
				</Field>

				<Field>
					<Label htmlFor="duration">المدة الزمنية</Label>
					<Input
						id="duration"
						placeholder="مثال: 3 أيام"
						disabled={disabled}
						{...register("duration")}
					/>
				</Field>
			</div>

			<TextareaWithMic
				id="presentIllnessHistory"
				label="تاريخ المرض الحالي"
				placeholder="وصف تفصيلي للأعراض وتطورها..."
				register={register("presentIllnessHistory")}
				disabled={disabled}
			/>

			<TextareaWithMic
				id="ownerNotes"
				label="ملاحظات وليّ الأمر"
				placeholder="ما لاحظه وليّ الأمر على الطفل..."
				register={register("ownerNotes")}
				disabled={disabled}
			/>

			<Controller
				control={control}
				name="symptoms"
				render={({ field }) => {
					const selected = new Set(field.value ?? []);
					const toggle = (value: ClinicalSymptom) => {
						const next = new Set(selected);
						if (next.has(value)) next.delete(value);
						else next.add(value);
						field.onChange(Array.from(next));
					};

					return (
						<Field>
							<Label>الأعراض السريرية</Label>
							<div className="flex flex-row-reverse flex-wrap gap-2">
								{SYMPTOM_OPTIONS.map((opt) => {
									const isChecked = selected.has(opt.value);
									return (
										<button
											type="button"
											key={opt.value}
											aria-pressed={isChecked}
											onClick={() => toggle(opt.value)}
											disabled={disabled}
											className={cn(
												"flex flex-1 cursor-pointer items-center justify-between gap-2 rounded-md border px-3 py-2.5 text-sm transition-colors",
												"min-w-[120px] outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
												isChecked
													? "border-primary/40 bg-primary/5"
													: "border-input hover:bg-accent/50",
												disabled && "cursor-not-allowed opacity-50",
											)}
										>
											<span>{opt.label}</span>
											<Checkbox
												checked={isChecked}
												disabled={disabled}
												tabIndex={-1}
												className="pointer-events-none"
											/>
										</button>
									);
								})}
							</div>
						</Field>
					);
				}}
			/>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<LevelSelect
					name="urination"
					label="التبول"
					control={control}
					disabled={disabled}
				/>
				<LevelSelect
					name="defecation"
					label="التبرز"
					control={control}
					disabled={disabled}
				/>
				<LevelSelect
					name="appetite"
					label="الشهية"
					control={control}
					disabled={disabled}
				/>
				<LevelSelect
					name="waterIntake"
					label="شرب الماء"
					control={control}
					disabled={disabled}
				/>
			</div>
		</div>
	);
}

interface TextareaWithMicProps {
	id: string;
	label: string;
	placeholder: string;
	register: ReturnType<UseFormReturn<SymptomsHistoryFormInput>["register"]>;
	disabled?: boolean;
}

function TextareaWithMic({
	id,
	label,
	placeholder,
	register,
	disabled,
}: TextareaWithMicProps) {
	return (
		<Field>
			<div className="flex items-center justify-between">
				<Label htmlFor={id}>{label}</Label>
				<button
					type="button"
					aria-label="إدخال صوتي (قريباً)"
					title="قريباً"
					disabled
					className="cursor-not-allowed text-primary opacity-60"
				>
					<IconMicrophone className="size-4" />
				</button>
			</div>
			<Textarea
				id={id}
				placeholder={placeholder}
				className="min-h-28 resize-none"
				disabled={disabled}
				{...register}
			/>
		</Field>
	);
}

type LevelFieldName = "urination" | "defecation" | "appetite" | "waterIntake";

interface LevelSelectProps {
	name: LevelFieldName;
	label: string;
	control: UseFormReturn<SymptomsHistoryFormInput>["control"];
	disabled?: boolean;
}

function LevelSelect({ name, label, control, disabled }: LevelSelectProps) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field }) => (
				<Field>
					<Label htmlFor={name}>{label}</Label>
					<Select
						value={field.value ?? undefined}
						onValueChange={field.onChange}
						disabled={disabled}
						dir="rtl"
					>
						<SelectTrigger
							id={name}
							className="w-full"
						>
							<SelectValue placeholder="اختر..." />
						</SelectTrigger>
						<SelectContent>
							{LEVEL_OPTIONS.map((opt) => (
								<SelectItem
									key={opt.value}
									value={opt.value}
								>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>
			)}
		/>
	);
}
