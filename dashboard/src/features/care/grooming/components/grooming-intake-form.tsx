import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useGroomingMutations } from "@/features/care/grooming/hooks/use-grooming";
import {
	CoatCondition,
	EarCondition,
	GroomingBehaviorScore,
	MattingGrade,
	NailCondition,
	ParasiteFinding,
} from "@/generated/prisma/enums";
import {
	COAT_CONDITION_LABELS,
	EAR_CONDITION_LABELS,
	type GroomingIntakeFormInput,
	type GroomingSessionDetail,
	groomingIntakeSchema,
	NAIL_CONDITION_LABELS,
} from "@sanad/contracts/runtime/server/grooming/grooming.type";
import {
	GROOMING_BEHAVIOR_LABELS,
	MATTING_GRADE_LABELS,
	PARASITE_FINDING_LABELS,
} from "@sanad/contracts/runtime/server/grooming/grooming.workflow";

/**
 * نموذج الفحص القبلي — مصدرُ معظم رسوم الجلسة وبواباتها.
 *
 * حفظه يعيد حساب التسعيرة على الخادم: درجة التعقّد والسلوك والطفيليات كلّها
 * مُدخلات في المحرّك، فالرقم الذي يظهر بعد الحفظ هو الرقم الحقيقي لا تقديرًا.
 */
export function GroomingIntakeForm({ session }: { session: GroomingSessionDetail }) {
	const { recordIntake, isPending } = useGroomingMutations();
	const intake = session.intake;

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<GroomingIntakeFormInput>({
		resolver: zodResolver(groomingIntakeSchema),
		defaultValues: {
			weightKg: intake?.weightKg != null ? Number(intake.weightKg) : undefined,
			temperatureC: intake?.temperatureC != null ? Number(intake.temperatureC) : undefined,
			mattingGrade: intake?.mattingGrade ?? MattingGrade.NONE,
			coatCondition: intake?.coatCondition ?? CoatCondition.HEALTHY,
			parasiteFinding: intake?.parasiteFinding ?? ParasiteFinding.NONE,
			earCondition: intake?.earCondition ?? EarCondition.NORMAL,
			nailCondition: intake?.nailCondition ?? NailCondition.NORMAL,
			behaviorScore: intake?.behaviorScore ?? GroomingBehaviorScore.GREEN,
			muzzleUsed: intake?.muzzleUsed ?? false,
			dentalNote: intake?.dentalNote ?? "",
			notes: intake?.notes ?? "",
			skinFindings: [],
			belongings: [],
		},
	});

	const onSubmit = handleSubmit((values) => {
		void recordIntake({ id: session.id, body: values as Record<string, unknown> }).catch(
			() => {},
		);
	});

	return (
		<form
			onSubmit={onSubmit}
			className="flex flex-col gap-3"
		>
			<div className="grid grid-cols-2 gap-3">
				<Field data-invalid={!!errors.weightKg}>
					<span className="text-muted-foreground text-xs">الوزن (كجم)</span>
					<Input
						type="number"
						step="0.1"
						disabled={isPending}
						aria-invalid={!!errors.weightKg}
						{...register("weightKg")}
					/>
					<FieldError errors={[errors.weightKg]} />
				</Field>
				<Field data-invalid={!!errors.temperatureC}>
					<span className="text-muted-foreground text-xs">الحرارة (°م)</span>
					<Input
						type="number"
						step="0.1"
						disabled={isPending}
						{...register("temperatureC")}
					/>
					<FieldError errors={[errors.temperatureC]} />
				</Field>
			</div>

			<EnumField
				control={control}
				name="mattingGrade"
				label="درجة تعقّد الفرو"
				labels={MATTING_GRADE_LABELS}
				disabled={isPending}
				error={errors.mattingGrade}
			/>
			<EnumField
				control={control}
				name="parasiteFinding"
				label="فحص الطفيليات"
				labels={PARASITE_FINDING_LABELS}
				disabled={isPending}
				error={errors.parasiteFinding}
			/>
			<EnumField
				control={control}
				name="behaviorScore"
				label="تقييم السلوك"
				labels={GROOMING_BEHAVIOR_LABELS}
				disabled={isPending}
				error={errors.behaviorScore}
			/>
			<EnumField
				control={control}
				name="coatCondition"
				label="حالة الفرو"
				labels={COAT_CONDITION_LABELS}
				disabled={isPending}
				error={errors.coatCondition}
			/>
			<EnumField
				control={control}
				name="earCondition"
				label="حالة الأذن"
				labels={EAR_CONDITION_LABELS}
				disabled={isPending}
				error={errors.earCondition}
			/>
			<EnumField
				control={control}
				name="nailCondition"
				label="حالة الأظافر"
				labels={NAIL_CONDITION_LABELS}
				disabled={isPending}
				error={errors.nailCondition}
			/>

			<Controller
				name="muzzleUsed"
				control={control}
				render={({ field }) => (
					<div className="flex items-center justify-between">
						<span className="text-sm">استُخدمت كمّامة</span>
						<Switch
							checked={!!field.value}
							onCheckedChange={field.onChange}
							disabled={isPending}
						/>
					</div>
				)}
			/>

			<Field>
				<span className="text-muted-foreground text-xs">ملاحظات</span>
				<Textarea
					rows={3}
					disabled={isPending}
					{...register("notes")}
				/>
			</Field>

			<Button
				type="submit"
				size="sm"
				disabled={isPending}
			>
				حفظ الفحص القبلي وإعادة التسعير
			</Button>
		</form>
	);
}

/** حقل تعداد مع تسمياته العربية — position="popper" إلزامي وإلا خرجت القائمة عن الشاشة في RTL */
function EnumField<T extends string>({
	control,
	name,
	label,
	labels,
	disabled,
	error,
}: {
	// biome-ignore lint/suspicious/noExplicitAny: react-hook-form control is generic over the form shape
	control: any;
	name: string;
	label: string;
	labels: Record<T, string>;
	disabled: boolean;
	error?: { message?: string };
}) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field }) => (
				<Field data-invalid={!!error}>
					<span className="text-muted-foreground text-xs">{label}</span>
					<Select
						value={field.value}
						onValueChange={field.onChange}
						disabled={disabled}
					>
						<SelectTrigger aria-invalid={!!error}>
							<SelectValue placeholder={label} />
						</SelectTrigger>
						<SelectContent position="popper">
							{(Object.entries(labels) as [T, string][]).map(([value, text]) => (
								<SelectItem
									key={value}
									value={value}
								>
									{text}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FieldError errors={[error]} />
				</Field>
			)}
		/>
	);
}
