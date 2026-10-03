import { InboxApprovalItem } from "@/features/inbox/components/inbox-approval-item";
import { InboxEmpty } from "@/features/inbox/components/inbox-empty";
import type { InboxApprovalGroup } from "@/features/inbox/hooks/use-inbox";

export function InboxApprovalsList({
	groups,
	selectedId,
	onSelect,
	hasSearch = false,
}: {
	groups: InboxApprovalGroup[];
	selectedId: string | null;
	onSelect: (id: string) => void;
	hasSearch?: boolean;
}) {
	// حد واحد فقط على الجانب الملاصق للتفاصيل — الحافة الأخرى يرسمها إطار الصفحة
	return (
		<div className="flex h-full w-[340px] shrink-0 flex-col border-e">
			<div className="min-h-0 flex-1 overflow-y-auto">
				{groups.length === 0 ? (
					<InboxEmpty
						title={hasSearch ? "لا توجد نتائج" : "لا توجد موافقات"}
						description={
							hasSearch ? "لا توجد موافقة تطابق بحثك" : "لا توجد عناصر بانتظار الموافقة حاليًا"
						}
					/>
				) : (
					groups.map((group) => (
						<section key={group.group}>
							<h3 className="px-3 pt-4 pb-1.5 text-[11px] font-medium text-muted-foreground">
								{group.label}
							</h3>
							<ul>
								{group.items.map((approval, index) => (
									<li key={approval.id}>
										<InboxApprovalItem
											approval={approval}
											isActive={approval.id === selectedId}
											isFirst={index === 0}
											onSelect={onSelect}
										/>
									</li>
								))}
							</ul>
						</section>
					))
				)}
			</div>
		</div>
	);
}
