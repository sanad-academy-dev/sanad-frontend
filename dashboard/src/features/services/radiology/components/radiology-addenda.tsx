import { IconFile, IconPaperclip, IconPlus, IconX } from "@tabler/icons-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	MentionTextarea,
	type MentionUser,
} from "@/features/appointments/components/tabs/visit-info/mention-textarea";
import {
	useAddRadiologyAddendum,
	useRadiologyAddenda,
} from "@/features/services/radiology/hooks/use-radiology-extras";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { RadiologyStatus } from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import { backendUrl } from "@/lib/backend-fetch";
import type { RadiologyItemResponse } from "@/server/radiology/radiology.type";

// ملحقات التقرير المعتمد. التقرير الأصل لا يُعدَّل بعد الاعتماد — التصحيح
// أو الإضافة تُلحق سطرًا مؤرَّخًا موقَّعًا، ومعه مرفقات وإشارات لزملاء.

type PendingFile = {
	fileKey: string;
	fileName: string;
	mimeType: string | null;
	sizeBytes: number | null;
};

const stamp = (value: Date | string) =>
	new Intl.DateTimeFormat("ar-EG", {
		dateStyle: "medium",
		timeStyle: "short",
		calendar: "gregory",
	}).format(new Date(value));

const sizeLabel = (bytes: number | null | undefined) => {
	if (!bytes) return "";
	if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} ك.ب`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} م.ب`;
};

/** رابط تنزيل المرفق — محلي مباشرةً، وS3 عبر رابط موقَّع قصير العمر */
const attachmentHref = (fileKey: string) =>
	fileKey.startsWith("/uploads/")
		? fileKey
		: backendUrl(`/api/uploads/serve?key=${encodeURIComponent(fileKey)}`);

export function RadiologyAddenda({ item }: { item: RadiologyItemResponse }) {
	const { addenda } = useRadiologyAddenda(item.id);
	const { addAddendum, isPending } = useAddRadiologyAddendum();
	const { staff } = useStaff();
	// لا يُعرض للإشارة إلا موظّف له حساب مستخدم — الإشارة إلى موظّف بلا حساب
	// لا تصل أحدًا، فإخفاؤه أصدق من إشارة صامتة
	const mentionables = useMemo<MentionUser[]>(
		() => staff.filter((s) => s.user?.id).map((s) => ({ id: s.id, name: s.name })),
		[staff],
	);

	const [composing, setComposing] = useState(false);
	const [text, setText] = useState("");
	const [mentionedStaffIds, setMentionedStaffIds] = useState<string[]>([]);
	const [files, setFiles] = useState<PendingFile[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	// الإلحاق بعد الاعتماد فقط — قبله التقرير نفسه ما زال قابلًا للتحرير
	const canAppend = item.status === RadiologyStatus.COMPLETED;
	if (!canAppend && addenda.length === 0) return null;

	const handleFiles = async (list: FileList | null) => {
		if (!list || list.length === 0) return;
		setIsUploading(true);
		try {
			for (const file of [...list]) {
				const res = await api.uploads.direct.post({ file });
				if (res.error) {
					const message = (res.error.value as { message?: string } | undefined)?.message;
					toast.error(message || `تعذّر رفع ${file.name}`);
					continue;
				}
				setFiles((prev) => [
					...prev,
					{
						fileKey: res.data.key,
						fileName: res.data.name,
						mimeType: res.data.mimeType ?? null,
						sizeBytes: res.data.size ?? null,
					},
				]);
			}
		} finally {
			setIsUploading(false);
			// إعادة الضبط حتى يُقبل اختيار الملف نفسه مرة أخرى
			if (inputRef.current) inputRef.current.value = "";
		}
	};

	const reset = () => {
		setComposing(false);
		setText("");
		setMentionedStaffIds([]);
		setFiles([]);
	};

	const submit = async () => {
		const value = text.trim();
		if (!value && files.length === 0) return;
		try {
			await addAddendum({
				itemId: item.id,
				text: value,
				mentionedStaffIds,
				attachments: files,
			});
		} catch {
			return; // التوست يعرض السبب — يبقى المحتوى لإعادة المحاولة
		}
		reset();
	};

	const isBusy = isPending || isUploading;

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between gap-2">
				<p className="text-xs font-semibold text-muted-foreground">
					ملحقات التقرير
					{addenda.length > 0 && <span className="ms-1 tabular-nums">({addenda.length})</span>}
				</p>
				{canAppend && !composing && (
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="h-7 gap-1.5 text-[11px]"
						onClick={() => setComposing(true)}
					>
						<IconPlus className="size-3.5" />
						إضافة ملحق
					</Button>
				)}
			</div>

			{addenda.map((addendum, index) => (
				<div
					key={addendum.id}
					className="flex flex-col gap-1.5 rounded-md border-s-2 border-s-amber-400 bg-amber-50/40 p-2.5"
				>
					<p className="text-[11px] font-semibold text-amber-800">
						ملحق {index + 1} — {stamp(addendum.createdAt)}
						{addendum.authoredBy ? ` · ${addendum.authoredBy.name}` : ""}
					</p>
					{addendum.text && (
						<p className="whitespace-pre-wrap text-sm leading-relaxed">{addendum.text}</p>
					)}

					{addendum.mentions.length > 0 && (
						<div className="flex flex-wrap gap-1">
							{addendum.mentions.map((mention) => (
								<Badge
									key={mention.staff.id}
									variant="secondary"
									className="rounded-sm text-[10px]"
								>
									@{mention.staff.name}
								</Badge>
							))}
						</div>
					)}

					{addendum.attachments.length > 0 && (
						<div className="flex flex-wrap gap-1.5">
							{addendum.attachments.map((file) => (
								<a
									key={file.id}
									href={attachmentHref(file.fileKey)}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-1.5 rounded-[4px] border bg-background px-2 py-1 text-[11px] hover:bg-muted"
								>
									<IconFile className="size-3.5 shrink-0 text-muted-foreground" />
									<span className="max-w-40 truncate">{file.fileName}</span>
									{file.sizeBytes && (
										<span className="shrink-0 text-muted-foreground">
											{sizeLabel(file.sizeBytes)}
										</span>
									)}
								</a>
							))}
						</div>
					)}
				</div>
			))}

			{composing && (
				<div className="flex flex-col gap-2 rounded-md border p-2.5">
					<MentionTextarea
						value={text}
						onChange={setText}
						users={mentionables}
						onMentionsChange={setMentionedStaffIds}
						disabled={isBusy}
						placeholder="نص الملحق — تصحيح أو إضافة على التقرير المعتمد. اكتب @ للإشارة إلى زميل."
						className="min-h-24 text-sm"
					/>

					{files.length > 0 && (
						<div className="flex flex-wrap gap-1.5">
							{files.map((file) => (
								<span
									key={file.fileKey}
									className="flex items-center gap-1.5 rounded-[4px] border bg-muted/40 px-2 py-1 text-[11px]"
								>
									<IconFile className="size-3.5 shrink-0 text-muted-foreground" />
									<span className="max-w-40 truncate">{file.fileName}</span>
									<button
										type="button"
										aria-label={`إزالة ${file.fileName}`}
										onClick={() =>
											setFiles((prev) => prev.filter((f) => f.fileKey !== file.fileKey))
										}
										className="text-muted-foreground hover:text-red-600"
									>
										<IconX className="size-3" />
									</button>
								</span>
							))}
						</div>
					)}

					<input
						ref={inputRef}
						type="file"
						multiple
						accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
						className="hidden"
						onChange={(e) => void handleFiles(e.target.files)}
					/>

					<div className="flex items-center justify-between gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="h-7 gap-1.5 text-[11px]"
							disabled={isBusy}
							onClick={() => inputRef.current?.click()}
						>
							<IconPaperclip className="size-3.5" />
							{isUploading ? "جارٍ الرفع..." : "إرفاق ملف"}
						</Button>
						<div className="flex items-center gap-2">
							<Button
								type="button"
								variant="outline"
								size="sm"
								disabled={isBusy}
								onClick={reset}
							>
								إلغاء
							</Button>
							<Button
								type="button"
								size="sm"
								disabled={isBusy || (!text.trim() && files.length === 0)}
								onClick={() => void submit()}
							>
								إضافة الملحق
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
