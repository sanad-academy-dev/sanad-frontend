import {
	IconChevronDown,
	IconDots,
	IconEdit,
	IconFolder,
	IconFolderOpen,
	IconPlaylistAdd,
	IconToggleLeft,
	IconTrash,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AccountTreeNode } from "@/features/accounting/chart-of-accounts/data/build-account-tree";
import type { AccountRootType } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import type { LedgerAccountResponse } from "@/server/accounting/account/account.type";

const ROOT_TYPE_LABEL: Record<AccountRootType, string> = {
	ASSET: "أصول",
	LIABILITY: "خصوم",
	INCOME: "إيرادات",
	EXPENSE: "مصروفات",
	EQUITY: "حقوق ملكية",
};

export type AccountRowHandlers = {
	expanded: Set<string>;
	onToggle: (id: string) => void;
	onAddChild: (parent: LedgerAccountResponse) => void;
	onEdit: (account: LedgerAccountResponse) => void;
	onToggleDisabled: (account: LedgerAccountResponse) => void;
	onDelete: (account: LedgerAccountResponse) => void;
};

const AccountRow = ({
	node,
	handlers,
}: {
	node: AccountTreeNode;
	handlers: AccountRowHandlers;
}) => {
	const isExpanded = handlers.expanded.has(node.id);

	return (
		<>
			<div
				className={cn(
					"flex items-center gap-2 border-b py-2 pe-2 hover:bg-accent/50",
					node.disabled && "opacity-50",
				)}
				// logical inline-start indent by depth (RTL-safe)
				style={{ paddingInlineStart: node.depth * 20 + 8 }}
			>
				{node.isGroup ? (
					<button
						type="button"
						onClick={() => handlers.onToggle(node.id)}
						className="flex size-5 shrink-0 items-center justify-center text-muted-foreground"
						aria-label={isExpanded ? "طيّ" : "توسيع"}
					>
						<IconChevronDown
							className={cn(
								"size-4 transition-transform",
								// collapsed disclosure points inward from the start edge
								!isExpanded && "-rotate-90 rtl:rotate-90",
							)}
						/>
					</button>
				) : (
					<span className="size-5 shrink-0" />
				)}

				{node.isGroup ? (
					isExpanded ? (
						<IconFolderOpen className="size-4 shrink-0 text-primary" />
					) : (
						<IconFolder className="size-4 shrink-0 text-primary" />
					)
				) : (
					<span className="size-4 shrink-0" />
				)}

				{node.accountNumber && (
					<span
						dir="ltr"
						className="shrink-0 font-mono text-xs text-muted-foreground"
					>
						{node.accountNumber}
					</span>
				)}
				<span className={cn("truncate text-sm", node.isGroup && "font-medium")}>
					{node.accountName}
				</span>

				<div className="ms-auto flex shrink-0 items-center gap-1.5">
					<Badge
						variant="outline"
						className="text-[10px]"
					>
						{ROOT_TYPE_LABEL[node.rootType]}
					</Badge>
					{node.freezeAccount && (
						<Badge
							variant="secondary"
							className="text-[10px]"
						>
							مجمّد
						</Badge>
					)}
					{node.disabled && (
						<Badge
							variant="destructive"
							className="text-[10px]"
						>
							معطّل
						</Badge>
					)}

					<DropdownMenu dir="rtl">
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon-xs"
								aria-label="إجراءات"
							>
								<IconDots className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{node.isGroup && (
								<DropdownMenuItem onClick={() => handlers.onAddChild(node)}>
									<IconPlaylistAdd className="size-4" /> إضافة حساب فرعي
								</DropdownMenuItem>
							)}
							<DropdownMenuItem onClick={() => handlers.onEdit(node)}>
								<IconEdit className="size-4" /> تعديل
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handlers.onToggleDisabled(node)}>
								<IconToggleLeft className="size-4" /> {node.disabled ? "تفعيل" : "تعطيل"}
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								variant="destructive"
								onClick={() => handlers.onDelete(node)}
							>
								<IconTrash className="size-4" /> حذف
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{node.isGroup &&
				isExpanded &&
				node.children.map((child) => (
					<AccountRow
						key={child.id}
						node={child}
						handlers={handlers}
					/>
				))}
		</>
	);
};

export const AccountTree = ({
	roots,
	handlers,
}: {
	roots: AccountTreeNode[];
	handlers: AccountRowHandlers;
}) => {
	return (
		<div className="border-t">
			{roots.map((root) => (
				<AccountRow
					key={root.id}
					node={root}
					handlers={handlers}
				/>
			))}
		</div>
	);
};
