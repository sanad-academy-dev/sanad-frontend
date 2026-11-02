import {
	IconDownload,
	IconEye,
	IconFileText,
	IconLink,
} from "@tabler/icons-react";

import { getFileUrl } from "@/lib/file-url";
import type { CampaignRequestItem } from "../../types/campaign-request.types";

interface RequestDocumentsSectionProps {
	request: CampaignRequestItem;
}

export function RequestDocumentsSection({ request }: RequestDocumentsSectionProps) {
	const rawDocs = request.documents?.items || [];
	const documents = rawDocs;
	const links = (request.links || []).filter((link) => /^https?:\/\//i.test(link.url));

	return (
		<div
			className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 space-y-1.5 font-sans shadow-2xs"
			dir="rtl"
		>
			<div className="flex items-center justify-between">
				<h4 className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
					<IconFileText className="size-3.5 text-primary" />
					<span>المستندات والروابط</span>
				</h4>

				<span className="text-[10px] text-muted-foreground">أضف المستندات عند تعديل الطلب</span>
			</div>

			<div className="space-y-1.5">
				{documents.length === 0 && links.length === 0 && (
					<p className="px-1 py-2 text-[10px] text-muted-foreground">لا توجد مستندات أو روابط مرفقة.</p>
				)}
				{documents.map((doc: any, idx) => {
					const resolvedUrl = doc.fileUrl
						? doc.fileUrl.startsWith("http") || doc.fileUrl === "#"
							? doc.fileUrl
							: getFileUrl(doc.fileUrl)
						: undefined;

					return (
						<div
							key={doc.id || idx}
							className="flex items-center justify-between gap-2 p-1.5 rounded border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 text-xs"
						>
							<div className="flex items-center gap-2 min-w-0">
								<div className="size-6 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
									<IconFileText className="size-3 text-zinc-500" />
								</div>
								<div className="min-w-0">
									<p className="font-semibold text-zinc-800 dark:text-zinc-200 text-[10.5px] truncate">
										{doc.title || "مستند رسمي"}
									</p>
									<span className="text-[9px] text-muted-foreground block font-mono">
										{doc.fileSize || "2 يونيو 2026 02:30 مساءً"}
									</span>
								</div>
							</div>

							<div className="flex items-center gap-0.5 shrink-0">
								<button
									type="button"
									onClick={() => resolvedUrl && window.open(resolvedUrl, "_blank", "noopener,noreferrer")}
									className="size-6 rounded flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
									title="معاينة"
								>
									<IconEye className="size-3" />
								</button>
								<button
									type="button"
									onClick={() => resolvedUrl && window.open(resolvedUrl, "_blank", "noopener,noreferrer")}
									className="size-6 rounded flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
									title="تنزيل"
								>
									<IconDownload className="size-3" />
								</button>
							</div>
						</div>
					);
				})}

				{links.map((link, idx) => (
					<div
						key={link.id || idx}
						className="flex items-center justify-between gap-2 p-1.5 rounded border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 text-xs"
					>
						<div className="flex items-center gap-2 min-w-0">
							<div className="size-6 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
								<IconLink className="size-3 text-blue-500" />
							</div>
							<div className="min-w-0">
								<p className="font-semibold text-zinc-800 dark:text-zinc-200 text-[10.5px] truncate">
									{link.title || link.url}
								</p>
								<span className="text-[9px] text-muted-foreground block truncate font-mono" dir="ltr">
									{link.url}
								</span>
							</div>
						</div>

						<a
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							className="size-6 rounded flex items-center justify-center text-zinc-400 hover:text-primary hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors shrink-0"
							title="فتح الرابط"
						>
							<IconEye className="size-3" />
						</a>
					</div>
				))}
			</div>
		</div>
	);
}
