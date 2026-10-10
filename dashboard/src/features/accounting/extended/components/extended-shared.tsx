import type { ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

/**
 * [P12.14] The pieces every Extended tab needs, written once.
 *
 * Seven tabs shipped in one task, each a list plus one action. Copying a loading skeleton, an
 * empty state and a table shell seven times is how the seventh ends up subtly different from
 * the first — and the difference always lands on the tab nobody demoed.
 *
 * The empty state takes a SENTENCE, not a word: «لا بيانات» tells an owner nothing about
 * whether the feature is broken, unconfigured, or simply quiet this month.
 */

export const TabShell = ({ children }: { children: ReactNode }) => (
	<div className="min-h-0 flex-1 overflow-auto border-t">{children}</div>
);

export const TabIntro = ({ title, hint }: { title: string; hint: string }) => (
	<div className="border-b bg-muted/30 px-4 py-2.5">
		<p className="font-medium text-sm">{title}</p>
		<p className="text-muted-foreground text-xs">{hint}</p>
	</div>
);

export const LoadingRows = ({ columns }: { columns: number }) => (
	<>
		{[0, 1, 2].map((row) => (
			<TableRow key={row}>
				{Array.from({ length: columns }, (_, index) => (
					<TableCell key={`${row}-${index}`}>
						<Skeleton className="h-4 w-full" />
					</TableCell>
				))}
			</TableRow>
		))}
	</>
);

export const EmptyRow = ({ columns, message }: { columns: number; message: string }) => (
	<TableRow>
		<TableCell
			colSpan={columns}
			className="py-10 text-center text-muted-foreground text-sm"
		>
			{message}
		</TableCell>
	</TableRow>
);

/** table + header + body, with the loading and empty states already wired */
export const DataTable = <T,>({
	headers,
	rows,
	isLoading,
	emptyMessage,
	renderRow,
	rowKey,
}: {
	headers: { label: string; className?: string }[];
	rows: T[];
	isLoading: boolean;
	emptyMessage: string;
	renderRow: (row: T) => ReactNode;
	rowKey: (row: T) => string;
}) => (
	<Table>
		<TableHeader>
			<TableRow>
				{headers.map((header) => (
					<TableHead
						key={header.label}
						className={header.className}
					>
						{header.label}
					</TableHead>
				))}
			</TableRow>
		</TableHeader>
		<TableBody>
			{isLoading ? (
				<LoadingRows columns={headers.length} />
			) : rows.length === 0 ? (
				<EmptyRow
					columns={headers.length}
					message={emptyMessage}
				/>
			) : (
				rows.map((row) => <TableRow key={rowKey(row)}>{renderRow(row)}</TableRow>)
			)}
		</TableBody>
	</Table>
);
