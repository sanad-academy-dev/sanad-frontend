import { type CollisionDetection, pointerWithin, rectIntersection } from "@dnd-kit/core";
import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

import {
	KanbanBoard,
	KanbanCard,
	KanbanCards,
	KanbanHeader,
	KanbanProvider,
} from "@/components/kanban";
import { statusTokenClass } from "@/features/crm/components/lead-status-pill";
import { LostReasonDialog } from "@/features/crm/components/lost-reason-dialog";
import { SlaBadge } from "@/features/crm/components/sla-badge";
import { useChangeLeadStatus } from "@/features/crm/hooks/use-crm-leads";
import { useCrmLeadStatuses } from "@/features/crm/hooks/use-crm-masters";
import { cn } from "@/lib/utils";
import type { CrmLeadListResponse } from "@/server/crm/crm-leads/crm-leads.type";

/**
 * [CRM-P1] §11.2 — the kanban. Columns are the STATUS MASTERS in `order`, never an enum, so
 * an editable pipeline reshapes the board without a deploy (§2).
 *
 * Dropping on a LOST-kind column opens the BR-C3.3 reason dialog first and only commits on
 * confirm; cancelling snaps the card back. Reuses the shared `@/components/kanban` board the
 * tasks screen already uses rather than introducing a second drag implementation.
 */

const collisionDetection: CollisionDetection = (args) => {
	const pointerCollisions = pointerWithin(args);
	return pointerCollisions.length > 0 ? pointerCollisions : rectIntersection(args);
};

type LeadCard = { id: string; name: string; column: string; lead: CrmLeadListResponse };

/** A move waiting on the LOST reason dialog. */
type PendingLost = { card: LeadCard; toStatusId: string; fromStatusId: string } | null;

export const LeadsKanban = ({ leads }: { leads: CrmLeadListResponse[] }) => {
	const { statuses } = useCrmLeadStatuses();
	const { changeStatus, isChangingStatus } = useChangeLeadStatus();
	const [data, setData] = useState<LeadCard[]>([]);
	const [pendingLost, setPendingLost] = useState<PendingLost>(null);
	/** Last committed column per card — the reference the drag handler diffs against. */
	const lastKnownColumns = useRef<Map<string, string>>(new Map());

	const serverCards = useMemo<LeadCard[]>(
		() =>
			leads.map((lead) => ({
				id: lead.id,
				name: lead.fullName,
				column: lead.statusId,
				lead,
			})),
		[leads],
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

	const commit = (leadId: string, statusId: string, extra?: Record<string, unknown>) => {
		lastKnownColumns.current.set(leadId, statusId);
		void changeStatus({ id: leadId, statusId, ...extra } as never);
	};

	const revert = (card: LeadCard, toColumn: string) => {
		setData((current) =>
			current.map((item) => (item.id === card.id ? { ...item, column: toColumn } : item)),
		);
	};

	const handleDataChange = (next: LeadCard[]) => {
		setData(next);
		for (const card of next) {
			const previous = lastKnownColumns.current.get(card.id);
			if (!previous || previous === card.column) continue;

			const target = columns.find((column) => column.id === card.column);
			// BR-C3.5 — CONVERTED is produced by the conversion action (CRM-P2), never by a drag.
			// Refuse locally so the user is not sent to the server to be told no.
			if (target?.kind === "CONVERTED") {
				revert(card, previous);
				lastKnownColumns.current.set(card.id, previous);
				continue;
			}
			// BR-C3.3 — hold the move until a reason is supplied.
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
							{(item: LeadCard) => (
								<KanbanCard
									key={item.id}
									id={item.id}
									name={item.name}
									column={item.column}
									className="border-0 bg-transparent p-0 shadow-none"
								>
									<Link
										to="/crm/leads/$leadId"
										params={{ leadId: item.id }}
										className="block rounded-md border bg-card p-3 text-start transition-colors hover:bg-accent"
									>
										<p className="text-[12px] font-semibold">{item.lead.fullName}</p>
										{/* the mobile is the one field reception always has (§3.1) */}
										<p
											dir="ltr"
											className="mt-1 text-start text-[11px] text-muted-foreground"
										>
											{item.lead.mobile}
										</p>
										<div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
											<span>{item.lead.source?.name ?? "—"}</span>
											<span className="ms-auto">
												{item.lead.ownerUser?.name ?? "غير مُسنَد"}
											</span>
										</div>
										{/* §10.4 — الشارة على البطاقة كما على الصفّ: لوحةٌ لا تُظهرها تخفي
										    المتأخّر عن العين تحديدًا حيث يُتابَع العمل يوميًّا */}
										<SlaBadge
											className="mt-2"
											responseBy={item.lead.responseBy}
											firstRespondedAt={item.lead.firstRespondedAt}
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
				leadName={pendingLost?.card.lead.fullName ?? ""}
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
