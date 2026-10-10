import { ExpenseCard } from "@/features/finance/expenses/components/expense-card";
import type {
	ExpenseCardAction,
	ExpenseRecord,
} from "@/features/finance/expenses/data/expense-records";

export function ExpensesGrid({
	records,
	onOpen,
	onDelete,
	onAction,
	onOpenRejection,
}: {
	records: ExpenseRecord[];
	onOpen: (id: string) => void;
	onDelete?: (id: string) => void;
	onAction?: (id: string, kind: ExpenseCardAction["kind"]) => void;
	onOpenRejection?: (id: string) => void;
}) {
	return (
		<div
			className="grid flex-1 grid-cols-1 content-start gap-3 overflow-y-auto p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
			dir="rtl"
		>
			{records.map((record) => (
				<ExpenseCard
					key={record.id}
					record={record}
					onOpen={onOpen}
					onDelete={onDelete}
					onAction={onAction}
					onOpenRejection={onOpenRejection}
				/>
			))}
		</div>
	);
}
