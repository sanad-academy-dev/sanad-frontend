import { InboxApprovalsList } from "@/features/inbox/components/inbox-approvals-list";
import { InboxDetail } from "@/features/inbox/components/inbox-detail";
import { InboxDetailHeader } from "@/features/inbox/components/inbox-detail-header";
import { InboxDetailsPanel } from "@/features/inbox/components/inbox-details-panel";
import { InboxEmpty } from "@/features/inbox/components/inbox-empty";
import { InboxHeader } from "@/features/inbox/components/inbox-header";
import { InboxList } from "@/features/inbox/components/inbox-list";
import { useInbox } from "@/features/inbox/hooks/use-inbox";

export function InboxPage() {
	const {
		activeTab,
		groups,
		approvalGroups,
		selected,
		selectedApproval,
		selectedId,
		activeCategory,
		searchQuery,
		select,
		setCategory,
	} = useInbox();

	const isApprovals = activeTab === "approvals";
	const hasSearch = searchQuery.trim().length > 0;
	// العنصر المحدد الحالي حسب التبويب (إشعار أو موافقة)
	const hasSelection = isApprovals ? !!selectedApproval : !!selected;

	return (
		<div
			className="flex h-full min-h-0 flex-1"
			dir="rtl"
		>
			{/* شريط الوارد في هيدر النظام (تبويبات + أزرار) عبر portal */}
			<InboxHeader />

			{/* شريط التفاصيل في القسم الأوسط من الهيدر (عند التحديد) */}
			{isApprovals && selectedApproval ? (
				<InboxDetailHeader
					itemId={selectedApproval.id}
					title={selectedApproval.title}
					patient={selectedApproval.patient}
					isApproval
				/>
			) : null}
			{!isApprovals && selected ? (
				<InboxDetailHeader
					itemId={selected.id}
					title={selected.title}
					patient={selected.patient}
				/>
			) : null}

			{/* اليمين: القائمة (إشعارات أو موافقات حسب التبويب) */}
			{isApprovals ? (
				<InboxApprovalsList
					groups={approvalGroups}
					selectedId={selectedId}
					onSelect={select}
					hasSearch={hasSearch}
				/>
			) : (
				<InboxList
					groups={groups}
					activeCategory={activeCategory}
					selectedId={selectedId}
					onSelect={select}
					onCategoryChange={setCategory}
					hasSearch={hasSearch}
				/>
			)}

			{/* الوسط: تفاصيل العنصر المحدد أو حالة فارغة */}
			{isApprovals ? (
				selectedApproval ? (
					<InboxApprovalDetail title={selectedApproval.title} />
				) : (
					<InboxEmpty
						title="لا توجد موافقة محددة"
						description="اختر عنصرًا من القائمة لعرض تفاصيله"
					/>
				)
			) : selected ? (
				<InboxDetail notification={selected} />
			) : (
				<InboxEmpty />
			)}

			{/* اليسار: لوحة التفاصيل (للإشعارات فقط عند وجود تحديد) */}
			{!isApprovals && hasSelection && selected ? (
				<InboxDetailsPanel notification={selected} />
			) : null}
		</div>
	);
}

// تفاصيل مبسّطة للموافقة (العنوان فقط حاليًا)
function InboxApprovalDetail({ title }: { title: string }) {
	return (
		<div className="flex h-full min-w-0 flex-1 flex-col">
			<div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
				<p className="text-[15px] leading-relaxed font-medium text-foreground">{title}</p>
			</div>
		</div>
	);
}
