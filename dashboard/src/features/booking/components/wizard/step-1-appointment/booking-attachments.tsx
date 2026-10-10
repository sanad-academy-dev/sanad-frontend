import {
	IconAlertCircle,
	IconCloudUpload,
	IconFile,
	IconPhoto,
	IconTrash,
	IconUpload,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	type FileMetadata,
	type FileWithPreview,
	formatBytes,
	useFileUpload,
} from "@/hooks/use-file-upload";
import { cn } from "@/lib/utils";

const MAX_FILES = 10;
const MAX_SIZE = 10 * 1024 * 1024;
const ACCEPT = "image/png,image/jpeg,application/pdf";

type BookingAttachmentsProps = {
	files: FileWithPreview[];
	onChange: (files: FileWithPreview[]) => void;
	disabled?: boolean;
};

const getFileIcon = (f: File | FileMetadata) => {
	const type = f.type;
	if (type.startsWith("image/")) return <IconPhoto className="size-4" />;
	return <IconFile className="size-4" />;
};

const getFileTypeLabel = (f: File | FileMetadata) => {
	const type = f.type;
	if (type.startsWith("image/")) return "صورة";
	if (type.includes("pdf")) return "PDF";
	return "ملف";
};

export const BookingAttachments = ({ files, onChange, disabled }: BookingAttachmentsProps) => {
	const [
		{ isDragging, errors },
		{
			removeFile,
			clearFiles,
			handleDragEnter,
			handleDragLeave,
			handleDragOver,
			handleDrop,
			openFileDialog,
			getInputProps,
		},
	] = useFileUpload({
		maxFiles: MAX_FILES,
		maxSize: MAX_SIZE,
		accept: ACCEPT,
		multiple: true,
		onFilesChange: onChange,
	});

	return (
		<div className="flex w-full flex-col gap-3">
			<div className="text-sm font-medium text-foreground">مرفقات (صور، تقارير سابقة)</div>

			{/* biome-ignore lint/a11y/useSemanticElements: drop zone can't be a button because it contains interactive children */}
			<div
				role="button"
				tabIndex={disabled ? -1 : 0}
				aria-disabled={disabled}
				aria-label="منطقة رفع الملفات"
				onClick={openFileDialog}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						openFileDialog();
					}
				}}
				className={cn(
					"relative rounded-xl border border-dashed p-6 text-center transition-colors",
					isDragging
						? "border-primary bg-primary/5"
						: "border-border hover:border-muted-foreground/50",
					disabled && "pointer-events-none opacity-60",
				)}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
			>
				<input
					{...getInputProps()}
					className="sr-only"
					disabled={disabled}
				/>

				<div className="flex flex-col items-center gap-3">
					<div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
						<IconUpload className="size-5" />
					</div>
					<div className="space-y-1">
						<p className="text-sm">اضغط لرفع الملفات أو اسحبها هنا </p>
						<p className="text-xs text-muted-foreground">
							PNG, JPG, PDF حتى {formatBytes(MAX_SIZE)} • حد أقصى {MAX_FILES} ملفات
						</p>
					</div>
				</div>
			</div>

			{files.length > 0 && (
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between">
						<h4 className="text-xs font-medium text-muted-foreground">
							الملفات ({files.length})
						</h4>
						<div className="flex gap-2">
							<Button
								type="button"
								onClick={openFileDialog}
								variant="outline"
								size="sm"
								disabled={disabled}
							>
								<IconCloudUpload className="size-4" />
								إضافة
							</Button>
							<Button
								type="button"
								onClick={clearFiles}
								variant="outline"
								size="sm"
								disabled={disabled}
							>
								<IconTrash className="size-4" />
								حذف الكل
							</Button>
						</div>
					</div>

					<div className="rounded-xl border">
						<Table>
							<TableHeader>
								<TableRow className="text-xs">
									<TableHead className="h-9">الاسم</TableHead>
									<TableHead className="h-9">النوع</TableHead>
									<TableHead className="h-9">الحجم</TableHead>
									<TableHead className="h-9 w-[60px]" />
								</TableRow>
							</TableHeader>
							<TableBody>
								{files.map((item) => (
									<TableRow key={item.id}>
										<TableCell className="py-2">
											<div className="flex items-center gap-2">
												<div className="flex size-7 items-center justify-center text-muted-foreground">
													{getFileIcon(item.file)}
												</div>
												<p className="truncate text-sm font-medium">{item.file.name}</p>
											</div>
										</TableCell>
										<TableCell className="py-2">
											<Badge variant="secondary">{getFileTypeLabel(item.file)}</Badge>
										</TableCell>
										<TableCell className="py-2 text-sm text-muted-foreground">
											{formatBytes(item.file.size)}
										</TableCell>
										<TableCell className="py-2">
											<Button
												type="button"
												onClick={() => removeFile(item.id)}
												variant="ghost"
												size="icon"
												className="size-8"
												disabled={disabled}
											>
												<IconTrash className="size-3.5" />
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			)}

			{errors.length > 0 && (
				<div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
					<IconAlertCircle className="mt-0.5 size-4 shrink-0" />
					<div className="flex flex-col gap-0.5">
						{errors.map((e, i) => (
							<p key={i}>{e}</p>
						))}
					</div>
				</div>
			)}
		</div>
	);
};
