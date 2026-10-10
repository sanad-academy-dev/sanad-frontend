import { IconCheck, IconPhoto, IconUpload } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useUploadFile } from "@/features/appointments/hooks/use-upload-file";
import {
	COVER_COLORS,
	colorCoverKey,
	coverColor,
	resolveCover,
} from "@/features/services/training/utils/cover";
import { cn } from "@/lib/utils";

type Tab = "gallery" | "upload";

// منتقي غلاف الدورة — Popover بنفس فكرة المرجع (Add thumbnail): تبويبات «المعرض» (لون خالص)
// و«رفع» (صورة)، مع أزرار إزالة/إلغاء/حفظ. يُخزَّن اللون كـ "color:#HEX" والصورة كمفتاح S3.
export function CoverPicker({
	value,
	onChange,
	disabled,
	triggerLabel = "إضافة غلاف",
}: {
	value: string | null;
	onChange: (coverKey: string | null) => void;
	disabled?: boolean;
	triggerLabel?: string;
}) {
	const { uploadFile, isPending: isUploading } = useUploadFile();
	const [open, setOpen] = useState(false);
	const [tab, setTab] = useState<Tab>("gallery");
	// مسودّة الاختيار — تُلتزم فقط عند «حفظ»
	const [draft, setDraft] = useState<string | null>(value);

	// عند الفتح نزامن المسودّة مع القيمة الحالية ونختار التبويب المناسب
	const openChange = (next: boolean) => {
		if (next) {
			setDraft(value);
			setTab(value && !coverColor(value) ? "upload" : "gallery");
		}
		setOpen(next);
	};

	const commit = () => {
		onChange(draft);
		setOpen(false);
	};
	const remove = () => {
		onChange(null);
		setOpen(false);
	};

	const handleUpload = async (file: File | undefined) => {
		if (!file) return;
		try {
			const uploaded = await uploadFile(file);
			setDraft(uploaded.url);
		} catch {
			toast.error("تعذّر رفع الصورة");
		}
	};

	const draftResolved = resolveCover(draft);

	return (
		<Popover
			open={open}
			onOpenChange={openChange}
		>
			<PopoverTrigger asChild>
				<button
					type="button"
					disabled={disabled}
					className="flex h-[26px] items-center gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-[7px] text-[12px] font-medium text-[#08090A] disabled:opacity-50"
				>
					<IconPhoto className="size-4 text-[#9B9B9D]" />
					{triggerLabel}
				</button>
			</PopoverTrigger>

			<PopoverContent
				align="end"
				dir="rtl"
				className="w-[360px] rounded-[10px] border-[0.75px] border-[#E5E5E5] p-0"
			>
				{/* التبويبات */}
				<div className="flex items-center gap-4 border-b border-[#E5E5E5] px-3 pt-2.5">
					{(
						[
							{ key: "gallery", label: "المعرض" },
							{ key: "upload", label: "رفع" },
						] as const
					).map((t) => (
						<button
							key={t.key}
							type="button"
							onClick={() => setTab(t.key)}
							className={cn(
								"-mb-px border-b-2 pb-2 text-[12px] font-semibold transition-colors",
								tab === t.key
									? "border-primary text-[#08090A]"
									: "border-transparent text-[#9B9B9D] hover:text-[#6B6B67]",
							)}
						>
							{t.label}
						</button>
					))}
				</div>

				{/* الجسم */}
				<div className="max-h-[300px] overflow-y-auto p-3">
					{tab === "gallery" ? (
						<div className="flex flex-col gap-2">
							<span className="text-[11px] font-semibold text-[#6B6B67]">لون خالص</span>
							<div className="grid grid-cols-5 gap-2">
								{COVER_COLORS.map((c) => {
									const selected = draft === colorCoverKey(c);
									return (
										<button
											key={c}
											type="button"
											onClick={() => setDraft(colorCoverKey(c))}
											aria-label={c}
											className="flex h-11 items-center justify-center rounded-[6px] ring-offset-1 transition-transform hover:scale-[1.03]"
											style={{ backgroundColor: c }}
										>
											{selected && <IconCheck className="size-4 primarydrop-shadow" />}
										</button>
									);
								})}
							</div>
						</div>
					) : (
						<div className="flex flex-col gap-3">
							{/* معاينة الصورة المرفوعة */}
							{draftResolved?.type === "image" && (
								<img
									src={draftResolved.url}
									alt="غلاف"
									className="h-24 w-full rounded-[6px] object-cover"
								/>
							)}
							<label className="flex h-24 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[6px] border border-dashed border-[#D4D4DE] text-[#9B9B9D] hover:bg-muted">
								<IconUpload className="size-5" />
								<span className="text-[11px]">
									{isUploading ? "جارٍ الرفع..." : "اسحب صورة أو اضغط للرفع"}
								</span>
								<input
									type="file"
									hidden
									accept="image/jpeg,image/png,image/webp"
									disabled={isUploading}
									onChange={(e) => handleUpload(e.target.files?.[0])}
								/>
							</label>
						</div>
					)}
				</div>

				{/* التذييل — إزالة يمين، إلغاء/حفظ يسار (تدفّق RTL) */}
				<div className="flex items-center justify-between border-t border-[#E5E5E5] px-3 py-2.5">
					<button
						type="button"
						onClick={remove}
						disabled={!value}
						className="text-[11px] font-medium text-primary disabled:opacity-40"
					>
						إزالة الغلاف
					</button>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => setOpen(false)}
							className="flex h-[27px] items-center rounded-[6px] border-[0.75px] border-[#E5E5E5] px-3 text-[11px] font-medium text-[#08090A] hover:bg-muted"
						>
							إلغاء
						</button>
						<button
							type="button"
							onClick={commit}
							disabled={isUploading}
							className="flex h-[27px] items-center rounded-[6px] bg-primary px-3 text-[11px] font-semibold primaryhover:bg-primary/90 disabled:opacity-50"
						>
							حفظ
						</button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
