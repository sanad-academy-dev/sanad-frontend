import { zodResolver } from "@hookform/resolvers/zod";
import { IconInfoCircle } from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useAnimalTypes } from "@/features/settings/animals/hooks/use-animal-types";
import { useCreateAnimalStrain } from "@/features/settings/animals/hooks/use-create-animal-strain";
import type {
	AddAnimalSheetProps,
	FieldLabelProps,
} from "@/features/settings/animals/types/add-animal-sheet.types";
import {
	parseCommaSeparatedValues,
	toOptionalNumber,
} from "@/features/settings/animals/utils/animal-formatters";
import { useFormProgress } from "@/hooks/use-form-progress";
import {
	ACTIVITY_LEVEL_LABELS,
	type ActivityLevel,
	type CreateAnimalStrainFormInput,
	createAnimalStrainSchema,
	GROOMING_NEEDS_LABELS,
	type GroomingNeeds,
	HAIR_TYPE_LABELS,
	type HairType,
} from "@sanad/contracts/runtime/server/animal-strains/animal-strains.type";

function FieldLabel({ children, required }: FieldLabelProps) {
	return (
		<div className="flex items-center gap-1.5">
			{children}
			{required && (
				<span className="text-xs text-destructive bg-destructive/10 rounded px-1 py-0.5 font-medium leading-none">
					مطلوب
				</span>
			)}
			{required && <IconInfoCircle className="size-3.5 text-muted-foreground/40 shrink-0" />}
		</div>
	);
}

export function AddAnimalSheet({ open, onClose }: AddAnimalSheetProps) {
	const { animalTypes, isLoading: typesLoading } = useAnimalTypes();
	const { createStrain, isPending } = useCreateAnimalStrain();

	const {
		register,
		handleSubmit,
		control,
		reset,
		watch,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(createAnimalStrainSchema),
		defaultValues: { commonDiseases: [] as string[] },
	});

	const [commonDiseasesText, setCommonDiseasesText] = useState("");
	const [createMore, setCreateMore] = useState(false);

	const values = watch();

	const formProgress = useFormProgress({ schema: createAnimalStrainSchema, values });

	const onSubmit = async (data: CreateAnimalStrainFormInput & Record<string, unknown>) => {
		const commonDiseases = parseCommaSeparatedValues(commonDiseasesText);
		await createStrain({ ...(data as CreateAnimalStrainFormInput), commonDiseases });
		if (createMore) {
			reset({ commonDiseases: [] });
			setCommonDiseasesText("");
		} else {
			onClose();
			reset({ commonDiseases: [] });
			setCommonDiseasesText("");
		}
	};

	useHotkey("Mod+Enter", () => handleSubmit(onSubmit)(), { enabled: open });

	return (
		<Sheet
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<SheetContent
				side="left"
				showCloseButton={false}
				className="w-full sm:max-w-xl! gap-0 flex flex-col p-0"
				onInteractOutside={onClose}
			>
				<FormHeader
					title="إضافة سلالة جديدة"
					progress={formProgress}
					onClose={onClose}
				/>

				{/* Scrollable form */}
				<div className="flex-1 overflow-y-auto">
					<form
						id="add-animal-form"
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-0"
						dir="rtl"
					>
						<div className="px-4 pt-4 pb-2">
							<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
								معلومات السلالة
							</p>
						</div>

						<div className="flex flex-col gap-4 px-4 pb-4">
							{/* Names */}
							<div className="grid grid-cols-2 gap-3">
								<div className="flex flex-col gap-1.5">
									<FieldLabel required>
										<Label
											className="text-sm font-medium"
											htmlFor="ar-name"
										>
											اسم بالعربي
										</Label>
									</FieldLabel>
									<Field data-invalid={!!errors.arName}>
										<Input
											id="ar-name"
											placeholder="مثال: قط سيرازي"
											className="text-sm"
											aria-invalid={!!errors.arName}
											{...register("arName")}
											disabled={isPending}
										/>
										<FieldError errors={[errors.arName]} />
									</Field>
								</div>

								<div className="flex flex-col gap-1.5">
									<FieldLabel required>
										<Label
											className="text-sm font-medium"
											htmlFor="en-name"
										>
											اسم بالإنجليزي
										</Label>
									</FieldLabel>
									<Field data-invalid={!!errors.enName}>
										<Input
											id="en-name"
											placeholder="مثال: Persian cat"
											className="text-sm"
											dir="ltr"
											aria-invalid={!!errors.enName}
											{...register("enName")}
											disabled={isPending}
										/>
										<FieldError errors={[errors.enName]} />
									</Field>
								</div>
							</div>

							{/* Animal Type */}
							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label className="text-sm font-medium">التصنيف</Label>
								</FieldLabel>
								<Controller
									name="animalTypeId"
									control={control}
									render={({ field }) => (
										<Field data-invalid={!!errors.animalTypeId}>
											<Select
												value={field.value}
												onValueChange={field.onChange}
												disabled={isPending || typesLoading}
												dir="rtl"
											>
												<SelectTrigger
													aria-invalid={!!errors.animalTypeId}
													className="w-full text-right"
												>
													<SelectValue placeholder="اختر التصنيف..." />
												</SelectTrigger>
												<SelectContent dir="rtl">
													{animalTypes.map((type) => (
														<SelectItem
															key={type.id}
															value={type.id}
															className="text-right"
														>
															{type.arName}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FieldError errors={[errors.animalTypeId]} />
										</Field>
									)}
								/>
							</div>

							{/* Average Weight */}
							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label className="text-sm font-medium">متوسط الوزن</Label>
								</FieldLabel>
								<div className="grid grid-cols-2 gap-3">
									<Field data-invalid={!!errors.avgWeightMin}>
										<Input
											id="weight-min"
											type="number"
											min={0}
											placeholder="من: 10 كيلو"
											className="text-sm"
											aria-invalid={!!errors.avgWeightMin}
											{...register("avgWeightMin", { setValueAs: toOptionalNumber })}
											disabled={isPending}
										/>
										<FieldError errors={[errors.avgWeightMin]} />
									</Field>
									<Field data-invalid={!!errors.avgWeightMax}>
										<Input
											id="weight-max"
											type="number"
											min={0}
											placeholder="إلى: 10 كيلو"
											className="text-sm"
											aria-invalid={!!errors.avgWeightMax}
											{...register("avgWeightMax", { setValueAs: toOptionalNumber })}
											disabled={isPending}
										/>
										<FieldError errors={[errors.avgWeightMax]} />
									</Field>
								</div>
							</div>

							{/* Average Age */}
							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label className="text-sm font-medium">متوسط العمر</Label>
								</FieldLabel>
								<div className="grid grid-cols-2 gap-3">
									<Field data-invalid={!!errors.avgAgeMin}>
										<Input
											id="age-min"
											type="number"
											min={0}
											placeholder="من: 10 سنوات"
											className="text-sm"
											aria-invalid={!!errors.avgAgeMin}
											{...register("avgAgeMin", { setValueAs: toOptionalNumber })}
											disabled={isPending}
										/>
										<FieldError errors={[errors.avgAgeMin]} />
									</Field>
									<Field data-invalid={!!errors.avgAgeMax}>
										<Input
											id="age-max"
											type="number"
											min={0}
											placeholder="إلى: 10 سنوات"
											className="text-sm"
											aria-invalid={!!errors.avgAgeMax}
											{...register("avgAgeMax", { setValueAs: toOptionalNumber })}
											disabled={isPending}
										/>
										<FieldError errors={[errors.avgAgeMax]} />
									</Field>
								</div>
							</div>

							{/* Origin */}
							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label
										className="text-sm font-medium"
										htmlFor="origin-country"
									>
										الأصل
									</Label>
								</FieldLabel>
								<Field data-invalid={!!errors.originCountry}>
									<Input
										id="origin-country"
										placeholder="مثال: اسكتلندا"
										className="text-sm"
										aria-invalid={!!errors.originCountry}
										{...register("originCountry")}
										disabled={isPending}
									/>
									<FieldError errors={[errors.originCountry]} />
								</Field>
							</div>

							{/* Hair Type */}
							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label className="text-sm font-medium">نوع الشعر / الريش</Label>
								</FieldLabel>
								<Controller
									name="hairType"
									control={control}
									render={({ field }) => (
										<Field data-invalid={!!errors.hairType}>
											<Select
												value={field.value ?? ""}
												onValueChange={field.onChange}
												disabled={isPending}
												dir="rtl"
											>
												<SelectTrigger
													aria-invalid={!!errors.hairType}
													className="w-full text-right text-sm"
												>
													<SelectValue placeholder="اختر..." />
												</SelectTrigger>
												<SelectContent dir="rtl">
													{(Object.keys(HAIR_TYPE_LABELS) as HairType[]).map((key) => (
														<SelectItem
															key={key}
															value={key}
															className="text-right"
														>
															{HAIR_TYPE_LABELS[key].ar}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FieldError errors={[errors.hairType]} />
										</Field>
									)}
								/>
							</div>

							{/* Activity Level */}
							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label className="text-sm font-medium">مستوى النشاط</Label>
								</FieldLabel>
								<Controller
									name="activityLevel"
									control={control}
									render={({ field }) => (
										<Field data-invalid={!!errors.activityLevel}>
											<Select
												value={field.value ?? ""}
												onValueChange={field.onChange}
												disabled={isPending}
												dir="rtl"
											>
												<SelectTrigger
													aria-invalid={!!errors.activityLevel}
													className="w-full text-right text-sm"
												>
													<SelectValue placeholder="اختر..." />
												</SelectTrigger>
												<SelectContent dir="rtl">
													{(Object.keys(ACTIVITY_LEVEL_LABELS) as ActivityLevel[]).map(
														(key) => (
															<SelectItem
																key={key}
																value={key}
																className="text-right"
															>
																{ACTIVITY_LEVEL_LABELS[key].ar}
															</SelectItem>
														),
													)}
												</SelectContent>
											</Select>
											<FieldError errors={[errors.activityLevel]} />
										</Field>
									)}
								/>
							</div>

							{/* Grooming Needs */}
							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label className="text-sm font-medium">احتياج التجميل</Label>
								</FieldLabel>
								<Controller
									name="groomingNeeds"
									control={control}
									render={({ field }) => (
										<Field data-invalid={!!errors.groomingNeeds}>
											<Select
												value={field.value ?? ""}
												onValueChange={field.onChange}
												disabled={isPending}
												dir="rtl"
											>
												<SelectTrigger
													aria-invalid={!!errors.groomingNeeds}
													className="w-full text-right text-sm"
												>
													<SelectValue placeholder="اختر..." />
												</SelectTrigger>
												<SelectContent dir="rtl">
													{(Object.keys(GROOMING_NEEDS_LABELS) as GroomingNeeds[]).map(
														(key) => (
															<SelectItem
																key={key}
																value={key}
																className="text-right"
															>
																{GROOMING_NEEDS_LABELS[key].ar}
															</SelectItem>
														),
													)}
												</SelectContent>
											</Select>
											<FieldError errors={[errors.groomingNeeds]} />
										</Field>
									)}
								/>
							</div>
						</div>

						<Separator />

						{/* Common Diseases */}
						<div className="px-4 pt-4 pb-2">
							<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
								الأمراض الشائعة
							</p>
						</div>
						<div className="px-4 pb-6">
							<Textarea
								placeholder="افصل بفاصلة مثال: خلل التسنج الورك، إعتام عدسة العين"
								className="text-sm min-h-24 resize-none"
								value={commonDiseasesText}
								onChange={(e) => setCommonDiseasesText(e.target.value)}
								disabled={isPending}
							/>
						</div>
					</form>
				</div>

				{/* Footer */}
				<FormFooter
					continueAdding={createMore}
					onContinueAddingChange={setCreateMore}
					disabled={isPending}
				>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onClose}
						disabled={isPending}
					>
						إلغاء
					</Button>
					<Button
						type="submit"
						form="add-animal-form"
						size="sm"
						disabled={isPending}
					>
						أضف السلالة
					</Button>
				</FormFooter>
			</SheetContent>
		</Sheet>
	);
}
