import { IconMicrophone } from "@tabler/icons-react";
import { Controller, type UseFormReturn } from "react-hook-form";

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
import type { DiagnosisFormInput } from "@/server/clinical-exams/clinical-exams.type";

import { AISuggestionsBanner } from "./ai-suggestions-banner";
import { step3Suggestions } from "./mock-ai-suggestions";

const SEVERITY_OPTIONS = [
	{ value: "MILD", label: "خفيف" },
	{ value: "MODERATE", label: "متوسطة" },
	{ value: "SEVERE", label: "شديد" },
	{ value: "CRITICAL", label: "حرج" },
] as const;

interface DiagnosisStepProps {
	form: UseFormReturn<DiagnosisFormInput>;
	disabled?: boolean;
	isCompleted?: boolean;
}

export function DiagnosisStep({
	form,
	disabled = false,
	isCompleted = false,
}: DiagnosisStepProps) {
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
					suggestions={step3Suggestions}
					headerText="تشخيص AI: بناءً على الأعراض والتاريخ الطبي، والعلامات الحيوية، السلالة، التشخيص الأولي هو:"
					subLabel="اقتراح التشخيص رفيق AI:"
				/>
			)}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Field data-invalid={!!errors.preliminaryDiagnosis}>
					<Label htmlFor="preliminaryDiagnosis">
						التشخيص البدئي <span className="text-destructive">*</span>
					</Label>
					<Input
						id="preliminaryDiagnosis"
						placeholder="عدم تناول طعام"
						aria-invalid={!!errors.preliminaryDiagnosis}
						disabled={disabled}
						{...register("preliminaryDiagnosis")}
					/>
					<FieldError errors={[errors.preliminaryDiagnosis]} />
				</Field>

				<Controller
					control={control}
					name="severity"
					render={({ field }) => (
						<Field>
							<Label>درجة الخطورة</Label>
							<Select
								value={field.value ?? undefined}
								onValueChange={field.onChange}
								disabled={disabled}
								dir="rtl"
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="اختر..." />
								</SelectTrigger>
								<SelectContent>
									{SEVERITY_OPTIONS.map((opt) => (
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
			</div>

			<Field>
				<div className="flex items-center justify-between">
					<Label htmlFor="diagnosisDescription">وصف التشخيص التفصيلي</Label>
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
					id="diagnosisDescription"
					placeholder="أضف تشخيص تفصيلي..."
					className="min-h-36 resize-none"
					disabled={disabled}
					{...register("diagnosisDescription")}
				/>
			</Field>
		</div>
	);
}
