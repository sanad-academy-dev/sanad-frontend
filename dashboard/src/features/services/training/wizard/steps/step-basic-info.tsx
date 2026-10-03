import { zodResolver } from "@hookform/resolvers/zod";
import { IconInfoCircle, IconPhotoPlus, IconX } from "@tabler/icons-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxTrigger,
	ComboboxValue,
} from "@/components/ui/combobox";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useStaffRoles } from "@/features/settings/roles-permissions/hooks/use-staff-roles";
import { useI18n } from "@/hooks/use-i18n";
import { getFileUrl } from "@/lib/file-url";
import { cn } from "@/lib/utils";
import {
	type CourseDetailResponse,
	type CreateCourseFormInput,
	createCourseSchema,
} from "@sanad/contracts/runtime/server/training/training.type";
import { COURSE_TYPE_OPTIONS } from "../../data/training";
import { useUploadMedia } from "../../hooks/use-upload-media";

const PRIORITY_OPTIONS = [
	{ value: "URGENT", label: "عاجل" },
	{ value: "NORMAL", label: "غير عاجل" },
] as const;

const LANGUAGE_OPTIONS = [
	{ value: "AR", label: "العربية" },
	{ value: "EN", label: "الإنجليزية" },
] as const;

// نتيجة حفظ الخطوة الأولى: معرّف الدورة (جديد أو قائم) أو null عند فشل التحقق
export type Step1Handle = { submit: () => Promise<string | null> };

function Label({ text, required }: { text: string; required?: boolean }) {
	return (
		<div className="flex items-center gap-1.5">
			<span className="text-[12px] font-medium text-[#08090A]">{text}</span>
			{required && (
				<span className="rounded bg-[#DC2626]/[0.06] px-1 py-px text-[9px] font-medium text-[#DC2626]">
					مطلوب
				</span>
			)}
			<IconInfoCircle className="size-3 text-[#C4C4CC]" />
		</div>
	);
}

export const StepBasicInfo = forwardRef<
	Step1Handle,
	{
		course: CourseDetailResponse | undefined;
		onValidityChange: (valid: boolean) => void;
		onSave: (
			values: CreateCourseFormInput & { coverKey?: string | null },
		) => Promise<string | null>;
	}
>(({ course, onValidityChange, onSave }, ref) => {
	const dir = useI18n().isRtl ? "rtl" : "ltr";
	const { roles, isLoading: rolesLoading } = useStaffRoles();
	const { upload, progress, isUploading } = useUploadMedia();
	const [coverKey, setCoverKey] = useState<string | null>(course?.coverKey ?? null);

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors, isValid },
	} = useForm<CreateCourseFormInput>({
		resolver: zodResolver(createCourseSchema),
		mode: "onChange",
		defaultValues: {
			name: "",
			targetRoleId: "",
			type: undefined,
			description: "",
			category: "",
			priority: "NORMAL",
			language: "AR",
		},
	});

	// عند تحميل دورة قائمة (تعديل مسودة) نملأ النموذج مرة واحدة عند تغيّر معرّف الدورة فقط
	// biome-ignore lint/correctness/useExhaustiveDependencies: إعادة التعيين مقصودة عند تحميل الدورة فقط لا عند كل تغيّر حقل
	useEffect(() => {
		if (!course) return;
		reset({
			name: course.name,
			targetRoleId: course.targetRoleId ?? "",
			type: course.type,
			description: course.description ?? "",
			category: course.category ?? "",
			priority: course.priority,
			estimatedDurationWeeks: course.estimatedDurationWeeks ?? undefined,
			language: course.language,
		});
		setCoverKey(course.coverKey ?? null);
	}, [course?.id]);

	useEffect(() => {
		onValidityChange(isValid);
	}, [isValid, onValidityChange]);

	useImperativeHandle(ref, () => ({
		submit: () =>
			new Promise<string | null>((resolve) => {
				void handleSubmit(
					async (values) => resolve(await onSave({ ...values, coverKey })),
					() => resolve(null),
				)();
			}),
	}));

	const handleCover = async (file: File | undefined) => {
		if (!file) return;
		try {
			const { key } = await upload(file);
			setCoverKey(key);
		} catch {
			// رسالة الخطأ تظهر من الخطاف؛ نُبقي الحقل كما هو
		}
	};

	return (
		<div className="mx-auto flex w-full max-w-[720px] flex-col gap-5 py-6">
			<div className="flex items-center gap-2">
				<span className="text-[13px] font-bold text-[#08090A]">المعلومات الأساسية</span>
				<span className="h-px flex-1 bg-[#E7E7EE]" />
			</div>

			{/* المعرّف + اسم الدورة */}
			<div className="flex items-start gap-3">
				<div className="flex w-[130px] shrink-0 flex-col gap-1.5">
					<span className="text-[12px] font-medium text-[#08090A]">المعرّف تلقائي</span>
					<Input
						readOnly
						value={course?.code ?? "PR-XX"}
						className="h-10 bg-[#9B9B9D]/[0.07] text-[13px] text-[#6B6B67]"
					/>
				</div>
				<Field
					className="flex-1 gap-1.5"
					data-invalid={!!errors.name}
				>
					<Label
						text="اسم الدورة التدريبية"
						required
					/>
					<Input
						placeholder="مثال: بروتوكول التخدير الطبي المتقدم"
						className="h-10 text-[13px]"
						aria-invalid={!!errors.name}
						{...register("name")}
					/>
					<FieldError errors={[errors.name]} />
				</Field>
			</div>

			{/* القسم المستهدف — combobox لدور وظيفي (targetRoleId) */}
			<Controller
				name="targetRoleId"
				control={control}
				render={({ field }) => (
					<Field
						className="gap-1.5"
						data-invalid={!!errors.targetRoleId}
					>
						<Label
							text="القسم المستهدف"
							required
						/>
						<Combobox
							value={field.value ?? ""}
							onValueChange={(v) => field.onChange(typeof v === "string" ? v : "")}
						>
							<ComboboxTrigger
								disabled={rolesLoading}
								aria-invalid={!!errors.targetRoleId}
								className="flex h-10 w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 text-[13px] aria-[invalid=true]:border-destructive"
							>
								<ComboboxValue
									placeholder="اختر القسم..."
									className="truncate"
								>
									{roles.find((r) => r.id === field.value)?.name}
								</ComboboxValue>
							</ComboboxTrigger>
							<ComboboxContent dir={dir}>
								<ComboboxList>
									{roles.length === 0 ? (
										<ComboboxEmpty>لا توجد أقسام</ComboboxEmpty>
									) : (
										roles.map((r) => (
											<ComboboxItem
												key={r.id}
												value={r.id}
											>
												{r.name}
											</ComboboxItem>
										))
									)}
								</ComboboxList>
							</ComboboxContent>
						</Combobox>
						<FieldError errors={[errors.targetRoleId]} />
					</Field>
				)}
			/>

			{/* نوع الدورة */}
			<Controller
				name="type"
				control={control}
				render={({ field }) => (
					<Field
						className="gap-1.5"
						data-invalid={!!errors.type}
					>
						<Label
							text="نوع الدورة"
							required
						/>
						<Select
							dir="rtl"
							value={field.value}
							onValueChange={field.onChange}
						>
							<SelectTrigger
								className="h-10! w-full text-[13px]"
								aria-invalid={!!errors.type}
							>
								<SelectValue placeholder="اختر..." />
							</SelectTrigger>
							<SelectContent>
								{COURSE_TYPE_OPTIONS.map((opt) => (
									<SelectItem
										key={opt.value}
										value={opt.value}
									>
										{opt.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FieldError errors={[errors.type]} />
					</Field>
				)}
			/>

			{/* التصنيف + الأولوية */}
			<div className="flex items-start gap-3">
				<Field className="flex-1 gap-1.5">
					<Label text="التصنيف" />
					<Input
						placeholder="مثال: السلامة، الجودة..."
						className="h-10 text-[13px]"
						{...register("category")}
					/>
				</Field>
				<Controller
					name="priority"
					control={control}
					render={({ field }) => (
						<Field className="flex-1 gap-1.5">
							<Label text="الأولوية" />
							<Select
								dir="rtl"
								value={field.value}
								onValueChange={field.onChange}
							>
								<SelectTrigger className="h-10! w-full text-[13px]">
									<SelectValue placeholder="اختر..." />
								</SelectTrigger>
								<SelectContent>
									{PRIORITY_OPTIONS.map((opt) => (
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

			{/* المدة المتوقعة + اللغة */}
			<div className="flex items-start gap-3">
				<Field className="flex-1 gap-1.5">
					<Label text="المدة المتوقعة (أسابيع)" />
					<Input
						type="number"
						min={0}
						placeholder="مثال: 4"
						className="h-10 text-[13px]"
						{...register("estimatedDurationWeeks", {
							setValueAs: (v) => (v === "" || v == null ? undefined : Number(v)),
						})}
					/>
				</Field>
				<Controller
					name="language"
					control={control}
					render={({ field }) => (
						<Field className="flex-1 gap-1.5">
							<Label text="اللغة" />
							<Select
								dir="rtl"
								value={field.value}
								onValueChange={field.onChange}
							>
								<SelectTrigger className="h-10! w-full text-[13px]">
									<SelectValue placeholder="اختر..." />
								</SelectTrigger>
								<SelectContent>
									{LANGUAGE_OPTIONS.map((opt) => (
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

			{/* الوصف */}
			<Field className="gap-1.5">
				<Label text="وصف الدورة" />
				<Textarea
					placeholder="أضف وصفًا موجزًا للدورة..."
					className="min-h-[88px] text-[13px]"
					{...register("description")}
				/>
			</Field>

			{/* صورة الغلاف */}
			<Field className="gap-1.5">
				<Label text="صورة الغلاف" />
				{coverKey ? (
					<div className="relative h-[150px] w-full overflow-hidden rounded-xl border border-[#E7E7EE]">
						<img
							src={getFileUrl(coverKey) ?? ""}
							alt="غلاف الدورة"
							className="size-full object-cover"
						/>
						<Button
							type="button"
							variant="secondary"
							size="icon-sm"
							onClick={() => setCoverKey(null)}
							aria-label="إزالة الغلاف"
							className="absolute end-2 top-2 rounded-full"
						>
							<IconX className="size-4" />
						</Button>
					</div>
				) : (
					<label
						className={cn(
							"flex h-[150px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#D4D4DE] bg-white text-center transition-colors hover:border-primary/60",
							isUploading && "pointer-events-none opacity-70",
						)}
					>
						<IconPhotoPlus className="size-7 text-[#9B9B9D]" />
						<span className="text-[12px] font-medium text-[#6B6B67]">
							{isUploading ? "جارٍ الرفع..." : "اسحب صورة أو اضغط للرفع"}
						</span>
						{isUploading && (
							<Progress
								value={progress}
								className="h-1 w-40"
							/>
						)}
						<input
							type="file"
							hidden
							accept="image/jpeg,image/png,image/webp"
							onChange={(e) => handleCover(e.target.files?.[0])}
						/>
					</label>
				)}
			</Field>
		</div>
	);
});

StepBasicInfo.displayName = "StepBasicInfo";
