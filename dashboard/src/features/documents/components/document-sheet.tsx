import { zodResolver } from "@hookform/resolvers/zod";
import { IconLink, IconLoader2, IconUpload, IconX } from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useEffect, useRef, useState } from "react";
import { Controller, type Resolver, type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { DateField } from "@/components/common/date-field";
import { FieldLabel } from "@/components/common/field-label";
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
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
	ACCEPTED_FILE_TYPES,
	MAX_FILE_SIZE_BYTES,
} from "@/features/appointments/data/add-document-modal";
import { useUploadFile } from "@/features/appointments/hooks/use-upload-file";
import { trimFileName } from "@/features/dashboard/utils/file";
import { DOCUMENT_CATEGORIES } from "@/features/documents/data/categories";
import { useCreateClinicDocument } from "@/features/documents/hooks/use-create-clinic-document";
import { useUpdateClinicDocument } from "@/features/documents/hooks/use-update-clinic-document";
import { useBranches } from "@/features/settings/branches/hooks/use-branches";
import { useFormProgress } from "@/hooks/use-form-progress";
import { useI18n } from "@/hooks/use-i18n";
import {
	type ClinicDocumentFormInput,
	type ClinicDocumentFormValues,
	type ClinicDocumentResponse,
	clinicDocumentFormSchema,
} from "@sanad/contracts/runtime/server/clinic-documents/clinic-documents.type";

// Radix يحجز "" لمسح الاختيار، فلا يصلح قيمةً لعنصر — سنتينل يُترجَم إلى null
const ALL_BRANCHES = "__all__";

const stripExtension = (name: string) => {
	const dot = name.lastIndexOf(".");
	return dot <= 0 ? name : name.slice(0, dot);
};

// عمود DATE يعود ISO؛ DateField يريد "yyyy-MM-dd"
const toIsoDay = (value: Date | string | null): string => {
	if (!value) return "";
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

const emptyValues: ClinicDocumentFormInput = {
	category: "LICENSE",
	kind: "FILE",
	title: "",
	description: "",
	branchId: "",
	issuedAt: "",
	expiresAt: "",
	url: "",
	mimeType: null,
	sizeBytes: null,
};

export function DocumentSheet({
	open,
	onClose,
	document,
}: {
	open: boolean;
	onClose: () => void;
	/** موجود = وضع التعديل (بيانات وصفية فقط)، غائب = إضافة جديدة */
	document?: ClinicDocumentResponse | null;
}) {
	const { t, isRtl } = useI18n();
	const isEdit = !!document;
	const { branches } = useBranches();
	const { uploadFile, isPending: isUploading } = useUploadFile();
	const { createDocument, isPending: isCreating } = useCreateClinicDocument();
	const { updateDocument, isPending: isUpdating } = useUpdateClinicDocument();
	const [file, setFile] = useState<File | null>(null);
	const [continueAdding, setContinueAdding] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const pending = isUploading || isCreating || isUpdating;

	const {
		register,
		handleSubmit,
		control,
		reset,
		watch,
		setValue,
		formState: { errors },
	} = useForm<ClinicDocumentFormInput>({
		resolver: zodResolver(clinicDocumentFormSchema) as Resolver<ClinicDocumentFormInput>,
		defaultValues: emptyValues,
	});

	const values = watch();
	const formProgress = useFormProgress({ schema: clinicDocumentFormSchema, values });
	const kind = values.kind;

	// إعادة التعبئة عند الفتح: التعديل يحمّل السجل، والإضافة تبدأ نظيفة
	useEffect(() => {
		if (!open) return;
		setFile(null);
		reset(
			document
				? {
						category: document.category,
						kind: document.kind,
						title: document.title,
						description: document.description ?? "",
						branchId: document.branchId ?? "",
						issuedAt: toIsoDay(document.issuedAt),
						expiresAt: toIsoDay(document.expiresAt),
						url: document.url,
						mimeType: document.mimeType,
						sizeBytes: document.sizeBytes,
					}
				: emptyValues,
		);
	}, [open, document, reset]);

	const onPickFile = (picked: File | null) => {
		if (!picked) return;
		if (picked.size > MAX_FILE_SIZE_BYTES) {
			toast.error(t("documents.sheet.fileTooLarge"));
			return;
		}
		setFile(picked);
		// اسم الملف عنوانٌ افتراضي معقول، ولا يدهس عنوانًا كتبه المستخدم
		if (!watch("title").trim()) setValue("title", stripExtension(picked.name));
		// يرضي التحقق قبل الرفع؛ يُستبدل بمفتاح التخزين الحقيقي عند الإرسال
		setValue("url", picked.name, { shouldValidate: true });
	};

	const onSubmit: SubmitHandler<ClinicDocumentFormInput> = async (data) => {
		const parsed = data as unknown as ClinicDocumentFormValues;

		try {
			if (isEdit && document) {
				await updateDocument(document.id, parsed);
				onClose();
				return;
			}

			// الرفع يسبق الإنشاء: بلا مفتاح تخزين لا معنى للسجل
			let payload = parsed;
			if (parsed.kind === "FILE") {
				if (!file) {
					toast.error(t("documents.sheet.fileRequired"));
					return;
				}
				const uploaded = await uploadFile(file);
				payload = {
					...parsed,
					url: uploaded.url,
					mimeType: uploaded.mimeType,
					sizeBytes: uploaded.size,
				};
			}

			await createDocument(payload);
			reset(emptyValues);
			setFile(null);
			if (!continueAdding) onClose();
		} catch (err) {
			if (err instanceof Error) toast.error(err.message || t("documents.sheet.saveFailed"));
		}
	};

	useHotkey("Mod+Enter", () => handleSubmit(onSubmit)(), { enabled: open });

	return (
		<Sheet
			open={open}
			onOpenChange={(next) => {
				if (!next) onClose();
			}}
		>
			<SheetContent
				side={isRtl ? "left" : "right"}
				showCloseButton={false}
				className="flex w-full flex-col gap-0 p-0 shadow-xl sm:max-w-[560px]!"
			>
				<FormHeader
					title={isEdit ? t("documents.sheet.editTitle") : t("documents.sheet.addTitle")}
					identity={isEdit ? { name: document.title } : null}
					progress={isEdit ? null : formProgress}
					onClose={onClose}
				/>

				<form
					id="clinic-document-form"
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4"
				>
					{/* ─── الملف أو الرابط (الإضافة فقط) ─── */}
					{!isEdit && (
						<div className="flex flex-col gap-1.5">
							<FieldLabel required>
								<Label className="font-medium text-sm">
									{kind === "FILE" ? t("documents.sheet.file") : t("documents.sheet.link")}
								</Label>
							</FieldLabel>

							<div className="flex items-center gap-2">
								{kind === "FILE" ? (
									<>
										<button
											type="button"
											onClick={() => fileInputRef.current?.click()}
											disabled={pending}
											aria-invalid={!!errors.url}
											className="flex h-9 flex-1 items-center gap-2 rounded-[4px] border border-input border-dashed px-3 text-muted-foreground text-xs transition-colors hover:bg-muted/40 aria-invalid:border-destructive disabled:opacity-50"
										>
											<IconUpload className="size-4 shrink-0" />
											<span className="truncate">
												{file ? trimFileName(file.name) : t("documents.sheet.pickFile")}
											</span>
										</button>
										<input
											ref={fileInputRef}
											type="file"
											accept={ACCEPTED_FILE_TYPES}
											className="sr-only"
											onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
										/>
									</>
								) : (
									// عنوان URL نصّ لاتيني دائمًا — جزيرة LTR داخل الصفحة العربية
									<Input
										placeholder={t("documents.sheet.linkPlaceholder")}
										dir="ltr"
										disabled={pending}
										aria-invalid={!!errors.url}
										className="h-9 flex-1 text-xs"
										{...register("url")}
									/>
								)}

								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="size-9 shrink-0"
									disabled={pending}
									aria-label={
										kind === "FILE"
											? t("documents.sheet.switchToLink")
											: t("documents.sheet.switchToFile")
									}
									onClick={() => {
										setFile(null);
										setValue("url", "");
										setValue("mimeType", null);
										setValue("sizeBytes", null);
										setValue("kind", kind === "FILE" ? "LINK" : "FILE");
									}}
								>
									{kind === "FILE" ? (
										<IconLink className="size-4" />
									) : (
										<IconUpload className="size-4" />
									)}
								</Button>
							</div>
							<FieldError errors={[errors.url]} />
						</div>
					)}

					{/* ─── العنوان ─── */}
					<div className="flex flex-col gap-1.5">
						<FieldLabel required>
							<Label className="font-medium text-sm">{t("documents.sheet.title")}</Label>
						</FieldLabel>
						<Field data-invalid={!!errors.title}>
							<Input
								placeholder={t("documents.sheet.titlePlaceholder")}
								className="text-sm"
								aria-invalid={!!errors.title}
								disabled={pending}
								{...register("title")}
							/>
							<FieldError errors={[errors.title]} />
						</Field>
					</div>

					{/* ─── التصنيف + الفرع ─── */}
					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1.5">
							<FieldLabel required>
								<Label className="font-medium text-sm">{t("documents.sheet.category")}</Label>
							</FieldLabel>
							<Controller
								name="category"
								control={control}
								render={({ field }) => (
									<Field data-invalid={!!errors.category}>
										<Select
											value={field.value}
											onValueChange={field.onChange}
											disabled={pending}
										>
											<SelectTrigger
												className="w-full text-sm"
												aria-invalid={!!errors.category}
											>
												<SelectValue placeholder={t("documents.sheet.categoryPlaceholder")} />
											</SelectTrigger>
											{/* popper إلزامي — الوضع الافتراضي يخرج خارج الشاشة في RTL */}
											<SelectContent
												position="popper"
												dir={isRtl ? "rtl" : "ltr"}
											>
												{DOCUMENT_CATEGORIES.map((entry) => (
													<SelectItem
														key={entry.id}
														value={entry.id}
													>
														{t(entry.labelKey)}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FieldError errors={[errors.category]} />
									</Field>
								)}
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label className="font-medium text-sm">{t("documents.sheet.branch")}</Label>
							<Controller
								name="branchId"
								control={control}
								render={({ field }) => (
									<Select
										value={field.value ? field.value : ALL_BRANCHES}
										onValueChange={(v) => field.onChange(v === ALL_BRANCHES ? "" : v)}
										disabled={pending}
									>
										<SelectTrigger className="w-full text-sm">
											<SelectValue />
										</SelectTrigger>
										<SelectContent
											position="popper"
											dir={isRtl ? "rtl" : "ltr"}
										>
											<SelectItem value={ALL_BRANCHES}>
												{t("documents.table.allBranches")}
											</SelectItem>
											{branches.map((branch) => (
												<SelectItem
													key={branch.id}
													value={branch.id}
												>
													{branch.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
						</div>
					</div>

					{/* ─── تاريخ الإصدار + الانتهاء ─── */}
					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1.5">
							<Label className="font-medium text-sm">{t("documents.sheet.issuedAt")}</Label>
							<Controller
								name="issuedAt"
								control={control}
								render={({ field }) => (
									<DateField
										value={field.value ?? ""}
										onChange={field.onChange}
										placeholder={t("documents.sheet.pickDate")}
										triggerDisabled={pending}
									/>
								)}
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label className="font-medium text-sm">{t("documents.sheet.expiresAt")}</Label>
							<Controller
								name="expiresAt"
								control={control}
								render={({ field }) => (
									<Field data-invalid={!!errors.expiresAt}>
										<DateField
											value={field.value ?? ""}
											onChange={field.onChange}
											placeholder={t("documents.sheet.noExpiry")}
											invalid={!!errors.expiresAt}
											triggerDisabled={pending}
										/>
										<FieldError errors={[errors.expiresAt]} />
									</Field>
								)}
							/>
						</div>
					</div>

					{/* ─── ملاحظات ─── */}
					<div className="flex flex-col gap-1.5">
						<Label className="font-medium text-sm">{t("documents.sheet.notes")}</Label>
						<Field data-invalid={!!errors.description}>
							<Textarea
								rows={3}
								placeholder={t("documents.sheet.notesPlaceholder")}
								className="text-sm"
								disabled={pending}
								{...register("description")}
							/>
							<FieldError errors={[errors.description]} />
						</Field>
					</div>
				</form>

				<FormFooter
					continueAdding={isEdit ? undefined : continueAdding}
					onContinueAddingChange={isEdit ? undefined : setContinueAdding}
					disabled={pending}
				>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onClose}
						disabled={pending}
					>
						<IconX className="size-4" />
						{t("documents.sheet.cancel")}
					</Button>
					<Button
						type="submit"
						form="clinic-document-form"
						size="sm"
						disabled={pending}
					>
						{pending && <IconLoader2 className="size-4 animate-spin" />}
						{isEdit ? t("documents.sheet.save") : t("documents.sheet.submit")}
					</Button>
				</FormFooter>
			</SheetContent>
		</Sheet>
	);
}
