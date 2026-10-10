import {
	IconCopy,
	IconDots,
	IconEdit,
	IconEye,
	IconStar,
	IconTrash,
	IconUserPlus,
} from "@tabler/icons-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { CarePlanListItemResponse } from "@/server/care-plans/care-plans.type";

const formatMoney = (value: CarePlanListItemResponse["price"]) =>
	`${Number(value).toLocaleString("ar-SA")} ر.س`;

function CarePlanRow({
	plan,
	onView,
	onEdit,
	onEnroll,
	onDuplicate,
	onDelete,
	onToggleStatus,
}: {
	plan: CarePlanListItemResponse;
	onView: (plan: CarePlanListItemResponse) => void;
	onEdit: (plan: CarePlanListItemResponse) => void;
	onEnroll: (plan: CarePlanListItemResponse) => void;
	onDuplicate: (plan: CarePlanListItemResponse) => void;
	onDelete: (plan: CarePlanListItemResponse) => void;
	onToggleStatus: (plan: CarePlanListItemResponse) => void;
}) {
	const rating = plan.ratingCount > 0 ? plan.ratingSum / plan.ratingCount : null;

	return (
		<TableRow
			onClick={() => onView(plan)}
			className="cursor-pointer"
		>
			<TableCell>
				<div className="flex flex-col">
					<span className="font-medium">{plan.name}</span>
					<span className="text-xs text-muted-foreground tabular-nums">{plan.code}</span>
				</div>
			</TableCell>
			<TableCell className="text-muted-foreground">{plan.type}</TableCell>
			<TableCell className="tabular-nums font-medium">{formatMoney(plan.price)}</TableCell>
			<TableCell className="tabular-nums text-muted-foreground">{plan.visitsCount}</TableCell>
			<TableCell className="tabular-nums text-muted-foreground">
				{plan.durationDays} يوم
			</TableCell>
			<TableCell className="tabular-nums text-muted-foreground">
				{plan.subscribersCount}
			</TableCell>
			<TableCell className="tabular-nums text-muted-foreground">{plan.usageCount}</TableCell>
			<TableCell className="text-muted-foreground">
				{plan.includedServices.length === 0
					? "الجميع"
					: plan.includedServices.length === 1
						? plan.includedServices[0]
						: `${plan.includedServices.length} دورات`}
			</TableCell>
			<TableCell onClick={(e) => e.stopPropagation()}>
				<Switch
					checked={plan.status === "ACTIVE"}
					onCheckedChange={() => onToggleStatus(plan)}
				/>
			</TableCell>
			<TableCell>
				{rating ? (
					<span className="flex items-center gap-1 tabular-nums">
						<IconStar className="size-3.5 fill-amber-400 text-amber-400" />
						{rating.toFixed(1)} ({plan.ratingCount})
					</span>
				) : (
					<span className="text-muted-foreground">لا يوجد تقييم</span>
				)}
			</TableCell>
			<TableCell
				className="text-center"
				onClick={(e) => e.stopPropagation()}
			>
				<DropdownMenu dir="rtl">
					<DropdownMenuTrigger asChild>
						<button
							type="button"
							className="flex size-7 items-center justify-center rounded-md hover:bg-muted"
						>
							<IconDots className="size-3.5" />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="w-36"
					>
						<DropdownMenuItem onClick={() => onView(plan)}>
							<IconEye className="size-3.5" />
							فتح
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => onEdit(plan)}>
							<IconEdit className="size-3.5" />
							تعديل
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => onEnroll(plan)}>
							<IconUserPlus className="size-3.5" />
							استخدام
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => onDuplicate(plan)}>
							<IconCopy className="size-3.5" />
							استنساخ
						</DropdownMenuItem>
						<DropdownMenuItem
							variant="destructive"
							onClick={() => onDelete(plan)}
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

export function CarePlansTable({
	plans,
	onView,
	onEdit,
	onEnroll,
	onDuplicate,
	onDelete,
	onToggleStatus,
}: {
	plans: CarePlanListItemResponse[];
	onView: (plan: CarePlanListItemResponse) => void;
	onEdit: (plan: CarePlanListItemResponse) => void;
	onEnroll: (plan: CarePlanListItemResponse) => void;
	onDuplicate: (plan: CarePlanListItemResponse) => void;
	onDelete: (plan: CarePlanListItemResponse) => void;
	onToggleStatus: (plan: CarePlanListItemResponse) => void;
}) {
	return (
		<div
			className="flex-1 overflow-auto"
			dir="rtl"
		>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>اسم الخطة / المعرّف</TableHead>
						<TableHead>النوع</TableHead>
						<TableHead>السعر</TableHead>
						<TableHead># الزيارات</TableHead>
						<TableHead>المدة</TableHead>
						<TableHead># المشتركين</TableHead>
						<TableHead># الاستخدام</TableHead>
						<TableHead>الدورات المشمولة</TableHead>
						<TableHead>حالة</TableHead>
						<TableHead>التقييم</TableHead>
						<TableHead className="text-center">الإجراءات</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{plans.map((plan) => (
						<CarePlanRow
							key={plan.id}
							plan={plan}
							onView={onView}
							onEdit={onEdit}
							onEnroll={onEnroll}
							onDuplicate={onDuplicate}
							onDelete={onDelete}
							onToggleStatus={onToggleStatus}
						/>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
