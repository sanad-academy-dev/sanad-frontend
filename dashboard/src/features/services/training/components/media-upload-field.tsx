import { IconFile, IconUpload, IconX } from "@tabler/icons-react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * حقل رفع الوسائط بثلاث حالات (Figma node 4571-480203):
 * فارغ ← جارٍ الرفع مع نسبة التقدّم ← شريحة الملف المرفوع.
 * مكوّن عرضي بحت — منطق الرفع في `useUploadMedia`.
 */
export function MediaUploadField({
	fileName,
	progress,
	isUploading,
	placeholder,
	accept,
	disabled,
	onPick,
	onClear,
}: {
	fileName: string;
	progress: number;
	isUploading: boolean;
	placeholder: string;
	accept?: string;
	disabled?: boolean;
	onPick: (file: File | undefined) => void;
	onClear: () => void;
}) {
	const fileRef = useRef<HTMLInputElement>(null);
	const hasFile = !!fileName || isUploading;

	return (
		<>
			<div
				className={cn(
					"flex h-[34px] w-full items-center rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white ps-3 pe-[7px]",
					!hasFile && !disabled && "cursor-pointer",
				)}
			>
				{hasFile ? (
					/* شريحة الملف — في RTL: الأيقونة والاسم يمينًا وزر الإزالة يسارًا */
					<div className="relative flex h-[25px] w-full items-center justify-between overflow-hidden rounded-[4px] bg-[#6366F1]/[0.12] px-[4.5px] py-[1.5px]">
						{/* تعبئة التقدّم خلف المحتوى */}
						{isUploading && (
							<span
								className="absolute inset-y-0 start-0 bg-[#6366F1]/[0.2] transition-[width] duration-150"
								style={{ width: `${progress}%` }}
							/>
						)}

						<div className="relative flex min-w-0 items-center gap-px">
							<IconFile className="size-[11px] shrink-0 text-[#6366F1]" />
							<span className="truncate text-[8px] font-medium leading-[9px] text-[#6366F1]">
								{fileName || "بدون اسم"}
							</span>
							{isUploading && (
								<span className="ms-1 shrink-0 text-[8px] font-medium leading-[9px] text-[#6366F1] tabular-nums">
									{progress}%
								</span>
							)}
						</div>

						<button
							type="button"
							onClick={onClear}
							aria-label={isUploading ? "إلغاء الرفع" : "إزالة الملف"}
							className="relative flex size-2.5 shrink-0 items-center justify-center text-[#6366F1]"
						>
							<IconX className="size-2.5" />
						</button>
					</div>
				) : (
					/* السحب والإفلات على الزر نفسه ليبقى العنصر تفاعليًا ومتاحًا للوحة المفاتيح */
					<button
						type="button"
						onClick={() => fileRef.current?.click()}
						disabled={disabled}
						onDragOver={(e) => e.preventDefault()}
						onDrop={(e) => {
							e.preventDefault();
							if (!disabled) onPick(e.dataTransfer.files?.[0]);
						}}
						className="flex w-full items-center justify-between text-[11px] font-light text-[#08090A]"
					>
						<span className="truncate">{placeholder}</span>
						<IconUpload className="size-4 shrink-0" />
					</button>
				)}
			</div>

			<input
				ref={fileRef}
				type="file"
				hidden
				accept={accept}
				onChange={(e) => {
					onPick(e.target.files?.[0]);
					// تصفير القيمة حتى يعمل اختيار نفس الملف مرة أخرى بعد الإزالة
					e.target.value = "";
				}}
			/>
		</>
	);
}
