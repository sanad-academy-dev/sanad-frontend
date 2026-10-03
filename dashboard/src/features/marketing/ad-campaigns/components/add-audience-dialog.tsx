import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { RequiredMark } from "@/components/common/required-mark";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCreateAdAudience } from "@/features/marketing/ad-campaigns/hooks/use-ad-audiences";
import { useI18n } from "@/hooks/use-i18n";
import {
	type CreateAdAudienceFormInput,
	createAdAudienceSchema,
} from "@sanad/contracts/runtime/server/ad-audiences/ad-audiences.type";

/**
 * [MK5.3] «إضافة جمهور جديد» — **غير مرسومة في Figma** (الفجوة G3).
 *
 * التصميم رسم الزرّ ولم يرسم وجهته. الحقول هنا مشتقّة من بطاقة الجمهور نفسها:
 * ما تعرضه البطاقة هو ما يُدخَل، لا أكثر. حقل لا تعرضه البطاقة يُدخِله المستخدم
 * ثم لا يراه بعدها أبدًا.
 *
 * القوائم (المواقع/اللغات/الاهتمامات) تُدخَل مفصولة بفواصل: مُدخل وسوم كامل
 * مكوّنٌ جديد في نظام التصميم، وبناؤه قبل أن يرسمه أحد يخالف قاعدة «أعد الاستخدام
 * قبل أن تبني». يُستبدل بمُدخل الوسوم يوم يصل تصميمه.
 */
const splitList = (value: string) =>
	value
		.split(/[,،\n]/u)
		.map((part) => part.trim())
		.filter(Boolean);

export function AddAudienceDialog({
	open,
	onOpenChange,
	onCreated,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCreated?: (audienceId: string) => void;
}) {
	const { isRtl } = useI18n();
	const { createAudience, isPending } = useCreateAdAudience();

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<CreateAdAudienceFormInput>({
		resolver: zodResolver(createAdAudienceSchema),
		defaultValues: {
			name: "",
			ageMin: 25,
			ageMax: 45,
			locations: [],
			languages: [],
			interests: [],
		},
	});

	const submit = handleSubmit(async (values) => {
		const created = await createAudience(values);
		onCreated?.(created.id);
		reset();
		onOpenChange(false);
	});

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				if (!next) reset();
				onOpenChange(next);
			}}
		>
			{/* محتوى Radix في portal — الاتجاه يُمرَّر صراحةً */}
			<DialogContent dir={isRtl ? "rtl" : "ltr"}>
				<DialogHeader>
					<DialogTitle>إضافة جمهور جديد</DialogTitle>
					<DialogDescription>
						عرّف الشريحة التي تريد الوصول إليها. تُحفظ لإعادة استخدامها في حملات أخرى.
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={submit}
					className="flex flex-col gap-3"
				>
					<Field data-invalid={!!errors.name}>
						<span className="flex items-center gap-1 text-xs">
							اسم الجمهور
							<RequiredMark />
						</span>
						<Input
							aria-invalid={!!errors.name}
							disabled={isPending}
							placeholder="مثل: أصحاب القطط في الرياض"
							{...register("name")}
						/>
						<FieldError errors={[errors.name]} />
					</Field>

					<div className="grid grid-cols-2 gap-3">
						<Field data-invalid={!!errors.ageMin}>
							<span className="text-xs">أقل عمر</span>
							<Input
								type="number"
								min={13}
								max={65}
								aria-invalid={!!errors.ageMin}
								disabled={isPending}
								{...register("ageMin", { valueAsNumber: true })}
							/>
							<FieldError errors={[errors.ageMin]} />
						</Field>

						<Field data-invalid={!!errors.ageMax}>
							<span className="text-xs">أكبر عمر</span>
							<Input
								type="number"
								min={13}
								max={65}
								aria-invalid={!!errors.ageMax}
								disabled={isPending}
								{...register("ageMax", { valueAsNumber: true })}
							/>
							<FieldError errors={[errors.ageMax]} />
						</Field>
					</div>

					<Controller
						name="locations"
						control={control}
						render={({ field }) => (
							<Field data-invalid={!!errors.locations}>
								<span className="flex items-center gap-1 text-xs">
									المواقع
									<RequiredMark />
								</span>
								<Input
									disabled={isPending}
									placeholder="الرياض، جدة"
									defaultValue={field.value.join("، ")}
									onChange={(e) => field.onChange(splitList(e.target.value))}
								/>
								<FieldError errors={[errors.locations as { message?: string } | undefined]} />
							</Field>
						)}
					/>

					<Controller
						name="languages"
						control={control}
						render={({ field }) => (
							<Field>
								<span className="text-xs">اللغات</span>
								<Input
									disabled={isPending}
									placeholder="العربية، الإنجليزية"
									defaultValue={field.value.join("، ")}
									onChange={(e) => field.onChange(splitList(e.target.value))}
								/>
							</Field>
						)}
					/>

					<Controller
						name="interests"
						control={control}
						render={({ field }) => (
							<Field>
								<span className="text-xs">الاهتمامات</span>
								<Input
									disabled={isPending}
									placeholder="تربية الأطفال الأليفة، القطط"
									defaultValue={field.value.join("، ")}
									onChange={(e) => field.onChange(splitList(e.target.value))}
								/>
							</Field>
						)}
					/>

					{/* التذييل الموحّد: الأزرار في اليسار، حشوة px-4 py-2 وحدّ علوي */}
					<div className="-mx-6 -mb-6 mt-2 flex items-center gap-2 border-t px-4 py-2">
						<Button
							type="submit"
							size="sm"
							disabled={isPending}
						>
							حفظ الجمهور
						</Button>
						<Button
							type="button"
							size="sm"
							variant="outline"
							disabled={isPending}
							onClick={() => onOpenChange(false)}
						>
							إلغاء
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
