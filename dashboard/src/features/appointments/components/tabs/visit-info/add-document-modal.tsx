import { zodResolver } from "@hookform/resolvers/zod";
import { IconLink, IconPaperclip, IconPlus, IconUpload, IconX } from "@tabler/icons-react";
import { type ReactNode, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { FormHeader } from "@/components/common/form-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
	FileUpload,
	FileUploadDropzone,
	FileUploadItem,
	FileUploadItemDelete,
	FileUploadItemPreview,
	FileUploadList,
	FileUploadTrigger,
} from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	ACCEPTED_FILE_TYPES,
	MAX_FILE_SIZE_BYTES,
} from "@/features/appointments/data/add-document-modal";
import { useCreateAppointmentDocument } from "@/features/appointments/hooks/use-create-appointment-document";
import { useUploadFile } from "@/features/appointments/hooks/use-upload-file";
import { formatFileSize, trimFileName } from "@/features/dashboard/utils/file";
import { useFormProgress } from "@/hooks/use-form-progress";

const formSchema = z.discriminatedUnion("kind", [
	z.object({
		kind: z.literal("FILE"),
		title: z.string({ error: "العنوان مطلوب" }).trim().min(1, "العنوان مطلوب").max(120),
		file: z.instanceof(File, { message: "الملف مطلوب" }),
	}),
	z.object({
		kind: z.literal("LINK"),
		title: z.string({ error: "العنوان مطلوب" }).trim().min(1, "العنوان مطلوب").max(120),
		url: z
			.url({ error: "الرابط غير صالح" })
			.refine((u) => /^https?:\/\//i.test(u), "الرابط يجب أن يبدأ بـ http أو https"),
	}),
]);

type FormValues = z.infer<typeof formSchema>;

const stripExtension = (name: string) => {
	const dot = name.lastIndexOf(".");
	return dot <= 0 ? name : name.slice(0, dot);
};

interface AddDocumentModalProps {
	appointmentId: string;
	trigger?: ReactNode;
}

export function AddDocumentModal({ appointmentId, trigger }: AddDocumentModalProps) {
	const [open, setOpen] = useState(false);
	const { createDocument, isPending: isCreating } =
		useCreateAppointmentDocument(appointmentId);
	const { uploadFile, isPending: isUploading } = useUploadFile();
	const isPending = isCreating || isUploading;

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		mode: "onChange",
		defaultValues: { kind: "FILE", title: "" } as FormValues,
	});

	const values = form.watch();
	const formProgress = useFormProgress({ schema: formSchema, values });

	const kind = values.kind;

	const handleTabChange = (next: string) => {
		const newKind = next === "LINK" ? "LINK" : "FILE";
		if (newKind === kind) return;
		const currentTitle = form.getValues("title");
		form.reset({ kind: newKind, title: currentTitle } as FormValues);
	};

	const handleOpenChange = (next: boolean) => {
		setOpen(next);
		if (!next) {
			form.reset({ kind: "FILE", title: "" } as FormValues);
		}
	};

	const onSubmit = async (data: FormValues) => {
		try {
			if (data.kind === "FILE") {
				const uploaded = await uploadFile(data.file);
				await createDocument({
					kind: "FILE",
					title: data.title,
					url: uploaded.url,
					mimeType: uploaded.mimeType,
					sizeBytes: uploaded.size,
				});
			} else {
				await createDocument({
					kind: "LINK",
					title: data.title,
					url: data.url,
				});
			}
			handleOpenChange(false);
		} catch (err) {
			if (err instanceof Error && data.kind === "FILE") {
				toast.error(err.message || "فشل رفع الملف");
			}
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={handleOpenChange}
		>
			<DialogTrigger asChild>
				{trigger ?? (
					<Button
						size="sm"
						variant="ghost"
						className="gap-1 text-xs"
					>
						<IconPlus className="size-3.5" />
						أضف مستندًا أو رابطًا
					</Button>
				)}
			</DialogTrigger>

			<DialogContent
				dir="rtl"
				showCloseButton={false}
				className="gap-0 p-0 sm:max-w-md"
			>
				<FormHeader
					variant="dialog"
					title="إضافة مستند أو رابط"
					progress={formProgress}
					onClose={() => handleOpenChange(false)}
				/>

				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-4 p-4"
				>
					<Tabs
						value={kind}
						onValueChange={handleTabChange}
					>
						<TabsList className="w-full">
							<TabsTrigger
								value="FILE"
								className="flex-1 gap-1.5"
							>
								<IconUpload className="size-3.5" />
								ملف
							</TabsTrigger>
							<TabsTrigger
								value="LINK"
								className="flex-1 gap-1.5"
							>
								<IconLink className="size-3.5" />
								رابط
							</TabsTrigger>
						</TabsList>
					</Tabs>

					<Field data-invalid={!!form.formState.errors.title}>
						<FieldLabel htmlFor="document-title">العنوان</FieldLabel>
						<Input
							id="document-title"
							placeholder="مثال: تحليل دم"
							aria-invalid={!!form.formState.errors.title}
							disabled={isPending}
							{...form.register("title")}
						/>
						<FieldError errors={[form.formState.errors.title]} />
					</Field>

					{kind === "FILE" ? (
						<Controller
							control={form.control}
							name="file"
							render={({ field, fieldState }) => (
								<Field data-invalid={!!fieldState.error}>
									<FieldLabel>الملف</FieldLabel>
									<FileUpload
										dir="rtl"
										value={field.value ? [field.value] : []}
										onValueChange={(files) => {
											const next = files[0];
											field.onChange(next ?? undefined);
											if (next && !form.getValues("title").trim()) {
												form.setValue("title", stripExtension(next.name), {
													shouldValidate: true,
												});
											}
										}}
										accept={ACCEPTED_FILE_TYPES}
										maxFiles={1}
										maxSize={MAX_FILE_SIZE_BYTES}
										disabled={isPending}
										onFileReject={(file, message) => {
											toast(message, { description: file.name });
										}}
									>
										{field.value ? (
											<FileUploadList>
												<FileUploadItem
													value={field.value}
													className="min-w-0 gap-3"
												>
													<div className="flex min-w-0 w-full items-center gap-3">
														<FileUploadItemPreview className="size-10 rounded-md" />
														<div className="min-w-0 flex-1">
															<span
																className="block truncate text-sm font-medium"
																dir="ltr"
															>
																{trimFileName(field.value.name)}
															</span>
															<span
																className="block truncate text-xs text-muted-foreground"
																dir="ltr"
															>
																{formatFileSize(field.value.size)}
															</span>
														</div>
														<FileUploadItemDelete asChild>
															<Button
																type="button"
																variant="ghost"
																size="icon"
																className="size-8 shrink-0"
																aria-label="إزالة الملف"
																onClick={() => field.onChange(undefined)}
															>
																<IconX className="size-4" />
															</Button>
														</FileUploadItemDelete>
													</div>
												</FileUploadItem>
											</FileUploadList>
										) : (
											<FileUploadDropzone className="flex h-28 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border border-dashed text-muted-foreground">
												<IconPaperclip className="size-5" />
												<span className="text-xs">اسحب الملف هنا أو</span>
												<FileUploadTrigger asChild>
													<Button
														type="button"
														variant="link"
														size="sm"
														className="h-auto p-0 text-xs"
													>
														اختر ملفًا
													</Button>
												</FileUploadTrigger>
											</FileUploadDropzone>
										)}
									</FileUpload>
									<FieldError errors={[fieldState.error]} />
								</Field>
							)}
						/>
					) : (
						<Controller
							control={form.control}
							name="url"
							render={({ field, fieldState }) => (
								<Field data-invalid={!!fieldState.error}>
									<FieldLabel htmlFor="document-url">الرابط</FieldLabel>
									<Input
										id="document-url"
										placeholder="https://..."
										type="url"
										dir="ltr"
										aria-invalid={!!fieldState.error}
										disabled={isPending}
										value={field.value ?? ""}
										onChange={field.onChange}
										onBlur={field.onBlur}
										name={field.name}
										ref={field.ref}
									/>
									<FieldError errors={[fieldState.error]} />
								</Field>
							)}
						/>
					)}

					<div className="flex items-center justify-end gap-2 border-t px-4 py-2">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => handleOpenChange(false)}
							disabled={isPending}
						>
							إلغاء
						</Button>
						<Button
							type="submit"
							size="sm"
							disabled={isPending || !form.formState.isValid}
						>
							حفظ
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
