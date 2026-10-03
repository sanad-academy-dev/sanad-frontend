import { IconExternalLink, IconLink } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import type { SharedLink } from "@/features/messages/types/messages.type";

export function ProfileLinksTab({ links }: { links: SharedLink[] }) {
	return (
		<div className="px-3 py-3">
			<h3 className="pb-2 text-[12px] font-medium text-foreground">الروابط المشتركة</h3>

			{links.length === 0 ? (
				<p className="py-8 text-center text-[12px] text-muted-foreground">
					لا توجد روابط مشتركة
				</p>
			) : (
				<ul className="flex flex-col gap-1.5">
					{links.map((link) => (
						<li
							key={link.id}
							className="flex items-center gap-2 rounded-[4px] border px-2 py-2"
						>
							<IconExternalLink className="size-4 shrink-0 text-muted-foreground" />

							<span className="flex min-w-0 flex-1 flex-col gap-0.5">
								<span className="truncate text-[13px] font-semibold text-foreground">
									{link.title}
								</span>
								<span className="truncate text-[11px] text-muted-foreground">{link.url}</span>
							</span>

							<Button
								type="button"
								variant="outline"
								size="icon-sm"
								aria-label={`فتح ${link.title}`}
								className="shrink-0 text-muted-foreground"
							>
								<IconLink className="size-3.5" />
							</Button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
