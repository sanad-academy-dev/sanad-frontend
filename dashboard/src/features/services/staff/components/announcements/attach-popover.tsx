// قائمة "إرفاق ملف" — إضافة رابط أو رفع مستند (سحب/إفلات) مطابق لتصميم Figma
import {
	IconCloudUpload,
	IconFile,
	IconFileText,
	IconLink,
	IconUpload,
	IconX,
} from "@tabler/icons-react";
import { useRef, useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function AttachPopover() {
	const [open, setOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	// مستند
	const [docMode, setDocMode] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const [isDragging, setIsDragging] = useState(false);

	// رابط
	const [linkMode, setLinkMode] = useState(false);
	const [link, setLink] = useState<string | null>(null);
	const [linkDraft, setLinkDraft] = useState("");

	const handleFiles = (files: FileList | null) => {
		if (files?.[0]) setFile(files[0]);
	};

	const removeFile = () => setFile(null);
	const removeLink = () => {
		setLink(null);
		setLinkMode(false);
		setLinkDraft("");
	};
	const saveLink = () => {
		const value = linkDraft.trim();
		if (value) setLink(value);
	};

	// شريحة مضغوطة تحلّ محل زر "إرفاق ملف" (الاسم = PopoverTrigger + زر إزالة)
	const triggerChip = (text: string, Icon: typeof IconFile, onRemove: () => void) => (
		<div className="box-border flex h-[23px] w-[171px] shrink-0 items-center rounded-[4px] border-[0.75px] border-[#E5E5E5] p-1">
			<div className="flex w-full items-center justify-between rounded-[4px] bg-[rgba(99,102,241,0.12)] px-[4.5px] py-[1.5px]">
				<PopoverTrigger asChild>
					<button
						type="button"
						className="flex flex-1 items-center gap-1 overflow-hidden"
					>
						<span className="truncate text-[8px] font-medium text-[#6366F1]">{text}</span>
						<Icon className="size-[10px] shrink-0 text-[#6366F1]" />
					</button>
				</PopoverTrigger>
				<button
					type="button"
					onClick={onRemove}
					className="shrink-0"
					aria-label="إزالة"
				>
					<IconX className="size-[10px] text-[#6366F1]" />
				</button>
			</div>
		</div>
	);

	// شريحة داخل القائمة
	const chip = (text: string, Icon: typeof IconFile, onRemove: () => void) => (
		<div className="box-border w-full rounded-[4px] border-[0.75px] border-[#E5E5E5] p-1">
			<div className="flex w-full items-center justify-between rounded-[4px] bg-[rgba(99,102,241,0.12)] px-[4.5px] py-[1.5px]">
				<span className="flex items-center gap-1 overflow-hidden">
					<span className="truncate text-[8px] font-medium text-[#6366F1]">{text}</span>
					<Icon className="size-[10px] shrink-0 text-[#6366F1]" />
				</span>
				<button
					type="button"
					onClick={onRemove}
					className="shrink-0"
					aria-label="إزالة"
				>
					<IconX className="size-[10px] text-[#6366F1]" />
				</button>
			</div>
		</div>
	);

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			{file ? (
				triggerChip(file.name || "بدون اسم", IconFile, removeFile)
			) : link ? (
				triggerChip(link, IconLink, removeLink)
			) : (
				<PopoverTrigger asChild>
					<button
						type="button"
						className={cn(
							"flex h-[23px] items-center gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[5px] text-[10px] font-medium text-[#08090A] transition-colors hover:bg-[#F9FAFB]",
							open && "bg-[#F9FAFB]",
						)}
					>
						<IconCloudUpload className="size-[11px]" />
						<span>إرفاق ملف</span>
					</button>
				</PopoverTrigger>
			)}

			<PopoverContent
				align="start"
				dir="rtl"
				className="w-[177px] rounded-[4px] border border-[#E5E5E5] p-0 shadow-[0px_4px_12px_rgba(0,0,0,0.12)]"
			>
				<div className="flex flex-col gap-[10px] px-2 py-3">
					{/* إضافة رابط → إدخال الرابط → شريحة الرابط */}
					{!linkMode ? (
						<button
							type="button"
							onClick={() => setLinkMode(true)}
							className="flex items-center justify-start gap-[6px] rounded-[4px] px-2 py-[6px] text-[12px] font-bold text-[#08090A] transition-colors hover:bg-[#F2F2F2]"
						>
							<IconLink className="size-[15px]" />
							<span>إضافة رابط</span>
						</button>
					) : link ? (
						chip(link, IconLink, removeLink)
					) : (
						<div className="box-border w-full rounded-[4px] border-[0.75px] border-[#E5E5E5] p-1">
							<input
								type="url"
								value={linkDraft}
								onChange={(e) => setLinkDraft(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										saveLink();
									}
								}}
								onBlur={saveLink}
								placeholder="ألصق الرابط هنا..."
								className="w-full bg-transparent text-right text-[10px] text-[#08090A] outline-none placeholder:text-[#9B9B9D]"
							/>
						</div>
					)}

					{/* إضافة مستند → منطقة رفع → شريحة الملف */}
					{!docMode ? (
						<button
							type="button"
							onClick={() => setDocMode(true)}
							className="flex items-center justify-start gap-[6px] rounded-[4px] px-2 py-[6px] text-[12px] font-bold text-[#08090A] transition-colors hover:bg-[#F2F2F2]"
						>
							<IconFileText className="size-[15px]" />
							<span>إضافة مستند</span>
						</button>
					) : file ? (
						chip(file.name || "بدون اسم", IconFile, removeFile)
					) : (
						<button
							type="button"
							onClick={() => inputRef.current?.click()}
							onDragOver={(e) => {
								e.preventDefault();
								setIsDragging(true);
							}}
							onDragLeave={() => setIsDragging(false)}
							onDrop={(e) => {
								e.preventDefault();
								setIsDragging(false);
								handleFiles(e.dataTransfer.files);
							}}
							className={cn(
								"box-border flex w-full items-center justify-between gap-[5px] rounded-[4px] border-[0.75px] border-[#E5E5E5] p-1 transition-colors",
								isDragging && "border-[#6366F1] bg-[#6366F1]/[0.06]",
							)}
						>
							<span className="text-right text-[8px] font-light text-[#08090A]">
								اسحب وأفلت أو الضغط على الأيقونة للتحميل
							</span>
							<IconUpload className="size-[15px] shrink-0 text-[#08090A]" />
							<input
								ref={inputRef}
								type="file"
								className="hidden"
								onChange={(e) => handleFiles(e.target.files)}
							/>
						</button>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
