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
import { Textarea } from "@/components/ui/textarea";
import { useGroomingMutations } from "@/features/care/grooming/hooks/use-grooming";
import { GroomingMoodScore } from "@/generated/prisma/enums";
import {
	GROOMING_MOOD_LABELS,
	type GroomingReportCardFormInput,
	type GroomingSessionDetail,
	groomingReportCardSchema,
} from "@sanad/contracts/runtime/server/grooming/grooming.type";

/**
 * تقرير الجلسة للوليّ أمر — الوثيقة التي تُغلق العهدة.
 *
 * إصداره شرطُ إقفال الجلسة، ولم يكن له نموذج: المتطلَّب كان يُعرض ولا يُستوفى.
 * التكرار الموصى به يكتب موعد التجميل القادم على كرت الطفل، فتظهر الجلسة في
 * قائمة الاستحقاق بدل أن تُنسى حتى يعود الفرو متعقّدًا.
 */
export function GroomingReportCardForm({ session }: { session: GroomingSessionDetail }) {
	const { sendReportCard, isPending } = useGroomingMutations();
	const card = session.reportCard;

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<GroomingReportCardFormInput>({
		resolver: zodResolver(groomingReportCardSchema),
		defaultValues: {
			summary: card?.summary ?? "",
			moodScore: card?.moodScore ?? GroomingMoodScore.CALM,
			recommendedIntervalWeeks: card?.recommendedIntervalWeeks ?? undefined,
		},
	});

	const onSubmit = handleSubmit((values) => {
		void sendReportCard({
			id: session.id,
			body: values as Record<string, unknown>,
		}).catch(() => {});
	});

	return (
		<form
			onSubmit={onSubmit}
			className="flex flex-col gap-3"
		>
			<Field data-invalid={!!errors.summary}>
				<span className="text-muted-foreground text-xs">ملخّص الجلسة للوليّ أمر</span>
				<Textarea
					rows={3}
					disabled={isPending}
					placeholder="ما نُفّذ، وكيف تعامل الطفل، وما يُنصح به قبل الجلسة القادمة"
					aria-invalid={!!errors.summary}
					{...register("summary")}
				/>
				<FieldError errors={[errors.summary]} />
			</Field>

			<div className="grid grid-cols-2 gap-3">
				<Controller
					name="moodScore"
					control={control}
					render={({ field }) => (
						<Field data-invalid={!!errors.moodScore}>
							<span className="text-muted-foreground text-xs">مزاج الطفل</span>
							<Select
								value={field.value}
								onValueChange={field.onChange}
								disabled={isPending}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent position="popper">
									{Object.values(GroomingMoodScore).map((mood) => (
										<SelectItem
											key={mood}
											value={mood}
										>
											{GROOMING_MOOD_LABELS[mood]}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FieldError errors={[errors.moodScore]} />
						</Field>
					)}
				/>

				<Field data-invalid={!!errors.recommendedIntervalWeeks}>
					<span className="text-muted-foreground text-xs">التكرار الموصى به (أسابيع)</span>
					<Input
						type="number"
						min={1}
						max={52}
						disabled={isPending}
						aria-invalid={!!errors.recommendedIntervalWeeks}
						{...register("recommendedIntervalWeeks")}
					/>
					<FieldError errors={[errors.recommendedIntervalWeeks]} />
				</Field>
			</div>

			<Button
				type="submit"
				size="sm"
				className="self-start"
				disabled={isPending}
			>
				{card ? "تحديث التقرير" : "إصدار التقرير"}
			</Button>
		</form>
	);
}
