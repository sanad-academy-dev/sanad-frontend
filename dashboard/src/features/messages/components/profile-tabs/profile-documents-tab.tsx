import { IconDownload, IconEye, IconFileTypePdf } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import type { SharedDocument } from "@/features/messages/types/messages.type";

export function ProfileDocumentsTab({ documents }: { documents: SharedDocument[] }) {
	return (
		<div className="px-3 py-3">
			<h3 className="pb-2 text-[12px] font-medium text-foreground">المستندات المشتركة</h3>

			{documents.length === 0 ? (
				<p className="py-8 text-center text-[12px] text-muted-foreground">
					لا توجد مستندات مشتركة
				</p>
			) : (
				<ul className="flex flex-col gap-1.5">
					{documents.map((doc) => (
						<li
							key={doc.id}
							className="flex items-center gap-2 rounded-[4px] border px-2 py-2"
						>
							<IconFileTypePdf className="size-6 shrink-0 text-destructive" />

							<span className="flex min-w-0 flex-1 flex-col gap-0.5">
								<span className="truncate text-[13px] font-semibold text-foreground">
									{doc.name}
								</span>
								<span className="truncate text-[11px] text-muted-foreground">
									{doc.sizeLabel} • {doc.dateLabel}
								</span>
							</span>

							{/* الإجراءات في جهة النهاية (يسار) */}
							<span className="flex shrink-0 items-center gap-0.5 text-muted-foreground">
								<Button
									asChild
									variant="ghost"
									size="icon-xs"
									aria-label={`تنزيل ${doc.name}`}
								>
									<a
										href={doc.url}
										download={doc.name}
									>
										<IconDownload className="size-3.5" />
									</a>
								</Button>
								<Button
									asChild
									variant="ghost"
									size="icon-xs"
									aria-label={`معاينة ${doc.name}`}
								>
									<a
										href={doc.url}
										target="_blank"
										rel="noopener noreferrer"
									>
										<IconEye className="size-3.5" />
									</a>
								</Button>
							</span>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
