import { type CollisionDetection, pointerWithin, rectIntersection } from "@dnd-kit/core";
import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import {
	KanbanBoard,
	KanbanCard,
	KanbanCards,
	KanbanHeader,
	KanbanProvider,
} from "@/components/kanban";
import { formatAmount } from "@/features/accounting/utils/format-amount";
import { statusTokenClass } from "@/features/crm/components/lead-status-pill";
import { LostReasonDialog } from "@/features/crm/components/lost-reason-dialog";
import { SlaBadge } from "@/features/crm/components/sla-badge";
import { useChangeDealStatus } from "@/features/crm/hooks/use-crm-deals";
import { useCrmDealStatuses } from "@/features/crm/hooks/use-crm-masters";
import { cn } from "@/lib/utils";
import type { CrmDealListResponse } from "@/server/crm/crm-deals/crm-deals.type";

/**
 * [CRM-P2] §11.2 — the deals board. Columns are the STATUS MASTERS in `order`, never an
 * enum, so an editable pipeline reshapes the board without a deploy (§2).
 *
 * Two column kinds are special, and both are refused LOCALLY so the user is not sent to the
 * server to be told no:
 *   · LOST — held until the BR-C3.3 reason dialog is confirmed; cancelling snaps back
 *   · WON  — never reachable by drag (BR-C4.1). Winning must resolve the Owner in the same
 *            transaction, which a drag cannot do; the card snaps back and the toast names
 *            «كسب الصفقة» on the deal page.
 */

const collisionDetection: CollisionDetection = (args) => {
	const pointerCollisions = pointerWithin(args);
	return pointerCollisions.length > 0 ? pointerCollisions : rectIntersection(args);
};

type DealCard = { id: string; name: string; column: string; deal: CrmDealListResponse };

/** A move waiting on the LOST reason dialog. */
type PendingLost = { card: DealCard; toStatusId: string; fromStatusId: string } | null;

export const DealsKanban = ({ deals }: { deals: CrmDealListResponse[] }) => {
	const { statuses } = useCrmDealStatuses();
	const { changeStatus, isChangingStatus } = useChangeDealStatus();
	const [data, setData] = useState<DealCard[]>([]);
	const [pendingLost, setPendingLost] = useState<PendingLost>(null);
	/** Last committed column per card — the reference the drag handler diffs against. */
	const lastKnownColumns = useRef<Map<string, string>>(new Map());

	const serverCards = useMemo<DealCard[]>(
		() =>
			deals.map((deal) => ({
				id: deal.id,
				name: deal.fullName,
				column: deal.statusId,
				deal,
			})),
		[deals],
	);

	useEffect(() => {
		lastKnownColumns.current = new Map(serverCards.map((card) => [card.id, card.column]));
		setData(serverCards);
	}, [serverCards]);

	const columns = useMemo(
		() =>
			[...statuses]
				.filter((status) => status.active)
				.sort((a, b) => a.order - b.order)
				.map((status) => ({
					id: status.id,
					name: status.name,
					color: status.color,
					kind: status.kind,
					count: data.filter((card) => card.column === status.id).length,
				})),
		[statuses, data],
	);

	const commit = (dealId: string, statusId: string, extra?: Record<string, unknown>) => {
		lastKnownColumns.current.set(dealId, statusId);
		void changeStatus({ id: dealId, statusId, ...extra } as never);
	};

	const revert = (card: DealCard, toColumn: string) => {
		setData((current) =>
			current.map((item) => (item.id === card.id ? { ...item, column: toColumn } : item)),
		);
	};

	const handleDataChange = (next: DealCard[]) => {
		setData(next);
		for (const card of next) {
			const previous = lastKnownColumns.current.get(card.id);
			if (!previous || previous === card.column) continue;

			const target = columns.find((column) => column.id === card.column);
			if (target?.kind === "WON") {
				revert(card, previous);
				lastKnownColumns.current.set(card.id, previous);
				toast.error("افتح الصفقة واستخدم «كسب الصفقة» — الفوز يحسم وليّ الأمر (BR-C4.1)");
				continue;
			}
			if (target?.kind === "LOST") {
				setPendingLost({ card, toStatusId: card.column, fromStatusId: previous });
				continue;
			}
			commit(card.id, card.column);
		}
	};

	return (
		<div className="min-h-0 flex-1 overflow-x-auto px-4">
			<KanbanProvider
				className={cn(
					"h-full",
					columns.length === 1 ? "auto-cols-[20rem]" : "auto-cols-[minmax(18rem,1fr)]",
				)}
				collisionDetection={collisionDetection}
				columns={columns}
				data={data}
				onDataChange={handleDataChange}
			>
				{(column) => (
					<KanbanBoard
						key={column.id}
						id={column.id}
						className="bg-muted/40"
					>
						<KanbanHeader className="flex items-center gap-2 px-1 py-2">
							<span
								className={cn("size-2 rounded-full border", statusTokenClass(column.color))}
								aria-hidden
							/>
							<span className="text-[12px] font-semibold">{column.name}</span>
							<span className="ms-auto text-[11px] text-muted-foreground">{column.count}</span>
						</KanbanHeader>
						<KanbanCards id={column.id}>
							{(item: DealCard) => (
								<KanbanCard
									key={item.id}
									id={item.id}
									name={item.name}
									column={item.column}
									className="border-0 bg-transparent p-0 shadow-none"
								>
									<Link
										to="/crm/deals/$dealId"
										params={{ dealId: item.id }}
										className="block rounded-md border bg-card p-3 text-start transition-colors hover:bg-accent"
									>
										<p className="text-[12px] font-semibold">{item.deal.fullName}</p>
										<p className="mt-1 text-[11px] text-muted-foreground">
											{formatAmount(String(item.deal.dealValue))} ·{" "}
											{Number(item.deal.probability)}٪
										</p>
										<div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
											<span>{formatAmount(String(item.deal.expectedValue))}</span>
											<span className="ms-auto">
												{item.deal.ownerUser?.name ?? "غير مُسنَد"}
											</span>
										</div>
										{/* §10.4 — نظير بطاقة العميل المحتمل */}
										<SlaBadge
											className="mt-2"
											responseBy={item.deal.responseBy}
											firstRespondedAt={item.deal.firstRespondedAt}
										/>
									</Link>
								</KanbanCard>
							)}
						</KanbanCards>
					</KanbanBoard>
				)}
			</KanbanProvider>

			<LostReasonDialog
				open={!!pendingLost}
				leadName={pendingLost?.card.deal.fullName ?? ""}
				isSubmitting={isChangingStatus}
				onConfirm={(input) => {
					if (!pendingLost) return;
					commit(pendingLost.card.id, pendingLost.toStatusId, input);
					setPendingLost(null);
				}}
				onCancel={() => {
					if (pendingLost) revert(pendingLost.card, pendingLost.fromStatusId);
					setPendingLost(null);
				}}
			/>
		</div>
	);
};
