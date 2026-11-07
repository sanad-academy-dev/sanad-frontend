import {
	IconDownload,
	IconEye,
	IconFileText,
	IconLink,
	IconPlus,
} from "@tabler/icons-react";

import { getFileUrl } from "@/lib/file-url";
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import { useDigitalRegistrationCapabilities } from "../../hooks/use-digital-registration";

interface RequestDocumentsSectionProps {
	request: CampaignRequestItem;
	campaignId?: string;
	onOpenAddDocument?: () => void;
}

function formatUploadedAt(uploadedAt?: string): string | null {
	if (!uploadedAt) return null;
	try {
		const d = new Date(uploadedAt);
		if (Number.isNaN(d.getTime())) return null;
		return new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
			day: "numeric",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			timeZone: "Africa/Cairo",
		}).format(d);
	} catch {
		return null;
	}
}

async function handleDownload(url: string, filename: string) {
	try {
		const res = await fetch(url);
		if (!res.ok) throw new Error("فشل تحميل الملف");
		const blob = await res.blob();
		const blobUrl = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = blobUrl;
		a.download = filename || "document";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(blobUrl);
	} catch {
		const a = document.createElement("a");
		a.href = url;
		a.download = filename || "document";
		a.target = "_blank";
		a.rel = "noopener noreferrer";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}
}

export function RequestDocumentsSection({
	request,
	campaignId,
	onOpenAddDocument,
}: RequestDocumentsSectionProps) {
	const { capabilities } = useDigitalRegistrationCapabilities(campaignId);
	const rawDocs = request.documents?.items || [];
	const documents = rawDocs;
	const links = (request.links || []).filter((link) => /^https?:\/\//i.test(link.url));

	return (
		<div className="space-y-1.5 font-sans" dir="rtl">
			<div className="flex items-center justify-between">
				<h3 className="text-[13.5px] font-bold text-zinc-900 dark:text-zinc-100">
					المستندات والروابط
				</h3>
				{capabilities.canEdit && onOpenAddDocument && (
					<button
						type="button"
						onClick={onOpenAddDocument}
						className="inline-flex items-center gap-1 h-6.5 px-2.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer shadow-2xs"
					>
						<IconPlus className="size-3 text-zinc-500" />
						<span>أضف مستندًا أو رابطًا...</span>
					</button>
				)}
			</div>

			<div className="space-y-2">
				{documents.length === 0 && links.length === 0 && (
					<div className="text-center py-3 text-[11px] text-zinc-400 dark:text-zinc-500 bg-white dark:bg-zinc-900 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
						لا توجد مستندات أو روابط مرفقة.
					</div>
				)}
				{documents.map((doc: any, idx) => {
					const resolvedUrl = capabilities.canDownloadDocuments && doc.fileUrl
						? doc.fileUrl.startsWith("http") || doc.fileUrl === "#"
							? doc.fileUrl
							: getFileUrl(doc.fileUrl)
						: undefined;

					return (
						<div
							key={doc.id || idx}
							className="flex items-center justify-between gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs shadow-2xs"
						>
							{/* يمين: اسم المستند والأيقونة */}
							<div className="flex items-center gap-2 min-w-0">
								<span className="font-bold text-zinc-900 dark:text-zinc-100 text-xs truncate">
									{doc.title || "مستند رسمي"}
								</span>
								<IconFileText className="size-4 text-zinc-600 dark:text-zinc-300 shrink-0" />
							</div>

							{/* يسار: تاريخ ووقت الرفع وأزرار المعاينة والتحميل */}
							<div className="flex items-center gap-2 shrink-0">
								<span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-sans">
									{doc.fileSize || formatUploadedAt(doc.uploadedAt) || "مستند مرفق"}
								</span>

								{capabilities.canDownloadDocuments ? (
									<div className="flex items-center gap-1">
										<button
											type="button"
											onClick={() => resolvedUrl && window.open(resolvedUrl, "_blank", "noopener,noreferrer")}
											className="size-6 rounded flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
											title="معاينة"
										>
											<IconEye className="size-3.5" />
										</button>
										<button
											type="button"
											onClick={() => resolvedUrl && handleDownload(resolvedUrl, doc.title || "document")}
											className="size-6 rounded flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
											title="تنزيل"
										>
											<IconDownload className="size-3.5" />
										</button>
									</div>
								) : (
									<span className="text-[10px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded font-medium select-none">
										مرفوع
									</span>
								)}
							</div>
						</div>
					);
				})}

				{links.map((link, idx) => (
					<div
						key={link.id || idx}
						className="flex items-center justify-between gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs shadow-2xs"
					>
						<div className="flex items-center gap-2 min-w-0">
							<span className="font-bold text-zinc-900 dark:text-zinc-100 text-xs truncate">
								{link.title || link.url}
							</span>
							<IconLink className="size-4 text-blue-500 shrink-0" />
						</div>

						<div className="flex items-center gap-2 shrink-0">
							<span className="text-[11px] text-muted-foreground font-mono" dir="ltr">
								{link.url}
							</span>
							<a
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								className="size-6 rounded flex items-center justify-center text-zinc-400 hover:text-primary hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
								title="فتح الرابط"
							>
								<IconEye className="size-3.5" />
							</a>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
