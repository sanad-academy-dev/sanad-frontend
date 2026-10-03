import {
	IconChevronDown,
	IconCopy,
	IconDots,
	IconPencil,
	IconTrash,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	CUSTOMER_TYPE_LABEL,
	DISCOUNT_STATUS_CONFIG,
	TOGGLEABLE_STATUSES,
} from "@/features/finance/discounts/data/discounts";
import type { DiscountStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import type { DiscountResponse } from "@/server/discounts/discounts.type";

const formatMoney = (value: string | number) => {
	const n = typeof value === "string" ? Number(value) : value;
	return Number.isFinite(n) ? n.toLocaleString("ar-SA", { maximumFractionDigits: 2 }) : "0";
};

const formatDate = (date: string | Date) =>
	new Intl.DateTimeFormat("ar-SA", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(new Date(date));

const formatValue = (d: DiscountResponse) =>
	d.type === "PERCENTAGE"
		? `${formatMoney(String(d.value))}%`
		: `${formatMoney(String(d.value))} ر.س`;

interface DiscountsTableProps {
	discounts: DiscountResponse[];
	isLoading: boolean;
	onEdit: (discount: DiscountResponse) => void;
	onDuplicate: (discount: DiscountResponse) => void;
	onDelete: (discount: DiscountResponse) => void;
	onStatusChange: (discount: DiscountResponse, status: DiscountStatus) => void;
}

function StatusCell({
	discount,
	onStatusChange,
}: {
	discount: DiscountResponse;
	onStatusChange: (discount: DiscountResponse, status: DiscountStatus) => void;
}) {
	const config = DISCOUNT_STATUS_CONFIG[discount.status];
	return (
		<DropdownMenu dir="rtl">
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className={cn(
						"inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs select-none",
						config.pillClass,
					)}
				>
					<span className={cn("size-1.5 shrink-0 rounded-full", config.dotClass)} />
					<span>{config.label}</span>
					<IconChevronDown className="size-2.5 opacity-50" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="w-36"
			>
				{TOGGLEABLE_STATUSES.map((status) => (
					<DropdownMenuItem
						key={status}
						disabled={status === discount.status}
						onClick={() => onStatusChange(discount, status)}
					>
						<span
							className={cn(
								"size-1.5 shrink-0 rounded-full",
								DISCOUNT_STATUS_CONFIG[status].dotClass,
							)}
						/>
						{DISCOUNT_STATUS_CONFIG[status].label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function UsageProgress({ discount }: { discount: DiscountResponse }) {
	const limit = discount.usageLimit;
	const pct = limit > 0 ? Math.min(100, (discount.usedCount / limit) * 100) : 0;
	return (
		<div className="flex items-center gap-2">
			<span className="tabular-nums text-xs text-muted-foreground">
				{discount.usedCount}/{limit > 0 ? limit : "∞"}
			</span>
			<div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
				<div
					className="h-full rounded-full bg-primary"
					style={{ width: `${pct}%` }}
				/>
			</div>
		</div>
	);
}

function DiscountRow({
	discount,
	onEdit,
	onDuplicate,
	onDelete,
	onStatusChange,
}: {
	discount: DiscountResponse;
} & Pick<DiscountsTableProps, "onEdit" | "onDuplicate" | "onDelete" | "onStatusChange">) {
	const copyCode = () => {
		void navigator.clipboard.writeText(discount.couponCode);
		toast.success("تم نسخ كود الخصم");
	};

	const servicesLabel =
		discount.services.length === 0
			? "الجميع"
			: discount.services.length === 1
				? discount.services[0].name
				: `${discount.services.length} دورات`;

	return (
		<TableRow
			onClick={() => onEdit(discount)}
			className="cursor-pointer"
		>
			<TableCell>
				<div className="flex flex-col">
					<span className="font-medium">{discount.name}</span>
					<span className="text-xs text-muted-foreground tabular-nums">{discount.code}</span>
				</div>
			</TableCell>
			<TableCell>
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						copyCode();
					}}
					className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs hover:bg-muted/60"
				>
					<IconCopy className="size-3" />
					<span className="tabular-nums">{discount.couponCode}</span>
				</button>
			</TableCell>
			<TableCell className="tabular-nums font-medium">{formatValue(discount)}</TableCell>
			<TableCell className="text-muted-foreground">
				{CUSTOMER_TYPE_LABEL[discount.customerType]}
			</TableCell>
			<TableCell>
				<UsageProgress discount={discount} />
			</TableCell>
			<TableCell className="text-muted-foreground">{servicesLabel}</TableCell>
			<TableCell className="text-muted-foreground tabular-nums">
				{discount.validTo ? formatDate(discount.validTo) : "غير محدود"}
			</TableCell>
			<TableCell onClick={(e) => e.stopPropagation()}>
				<StatusCell
					discount={discount}
					onStatusChange={onStatusChange}
				/>
			</TableCell>
			<TableCell
				className="text-center"
				onClick={(e) => e.stopPropagation()}
			>
				<DropdownMenu dir="rtl">
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="size-7"
						>
							<IconDots className="size-3.5" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="w-36"
					>
						<DropdownMenuItem onClick={() => onEdit(discount)}>
							<IconPencil className="size-3.5" />
							تعديل
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => onDuplicate(discount)}>
							<IconCopy className="size-3.5" />
							تكرار
						</DropdownMenuItem>
						<DropdownMenuItem
							variant="destructive"
							onClick={() => onDelete(discount)}
						>
							<IconTrash className="size-3.5" />
							حذف
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
}

export function DiscountsTable({
	discounts,
	isLoading,
	onEdit,
	onDuplicate,
	onDelete,
	onStatusChange,
}: DiscountsTableProps) {
	return (
		<div
			className="flex-1 overflow-auto"
			dir="rtl"
		>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>اسم / المعرّف</TableHead>
						<TableHead>كود الخصم</TableHead>
						<TableHead>قيمة/نوع الخصم</TableHead>
						<TableHead>نوع العملاء</TableHead>
						<TableHead>تقدم الاستخدام</TableHead>
						<TableHead>الدورات المشمولة</TableHead>
						<TableHead>صالح حتى</TableHead>
						<TableHead>الحالة</TableHead>
						<TableHead className="text-center">الإجراءات</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{isLoading &&
						Array.from({ length: 6 }).map((_, i) => (
							<TableRow key={i}>
								{Array.from({ length: 9 }).map((_, j) => (
									<TableCell key={j}>
										<Skeleton className="h-4 w-full" />
									</TableCell>
								))}
							</TableRow>
						))}

					{!isLoading &&
						discounts.map((discount) => (
							<DiscountRow
								key={discount.id}
								discount={discount}
								onEdit={onEdit}
								onDuplicate={onDuplicate}
								onDelete={onDelete}
								onStatusChange={onStatusChange}
							/>
						))}
				</TableBody>
			</Table>
		</div>
	);
}
