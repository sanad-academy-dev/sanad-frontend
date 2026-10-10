import type { ComponentProps, ComponentType } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// أيقونة التصفية من التصميم (16×16، fill)
const FilterIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		viewBox="0 0 16 16"
		fill="none"
		className={className}
		aria-hidden="true"
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M14.25 3C14.4489 3 14.6397 3.07902 14.7803 3.21967C14.921 3.36032 15 3.55109 15 3.75C15 3.94891 14.921 4.13968 14.7803 4.28033C14.6397 4.42098 14.4489 4.5 14.25 4.5H1.75C1.55109 4.5 1.36032 4.42098 1.21967 4.28033C1.07902 4.13968 1 3.94891 1 3.75C1 3.55109 1.07902 3.36032 1.21967 3.21967C1.36032 3.07902 1.55109 3 1.75 3H14.25ZM4 8C4 7.80109 4.07902 7.61032 4.21967 7.46967C4.36032 7.32902 4.55109 7.25 4.75 7.25H11.25C11.4489 7.25 11.6397 7.32902 11.7803 7.46967C11.921 7.61032 12 7.80109 12 8C12 8.19891 11.921 8.38968 11.7803 8.53033C11.6397 8.67098 11.4489 8.75 11.25 8.75H4.75C4.55109 8.75 4.36032 8.67098 4.21967 8.53033C4.07902 8.38968 4 8.19891 4 8ZM6.75 11.5C6.55109 11.5 6.36032 11.579 6.21967 11.7197C6.07902 11.8603 6 12.0511 6 12.25C6 12.4489 6.07902 12.6397 6.21967 12.7803C6.36032 12.921 6.55109 13 6.75 13H9.25C9.44891 13 9.63968 12.921 9.78033 12.7803C9.92098 12.6397 10 12.4489 10 12.25C10 12.0511 9.92098 11.8603 9.78033 11.7197C9.63968 11.579 9.44891 11.5 9.25 11.5H6.75Z"
			fill="currentColor"
		/>
	</svg>
);

// مجموعة تصفية واحدة = قائمة فرعية داخل «التصفية»
export type FilterGroup = {
	key: string;
	label: string;
	Icon: ComponentType<{ className?: string }>;
	options: { value: string; label: string }[];
	selected: string[];
	onToggle: (value: string) => void;
	emptyLabel?: string;
};

export function FiltersMenu({
	groups,
	size = "xs",
	className,
}: {
	groups: FilterGroup[];
	size?: ComponentProps<typeof Button>["size"];
	className?: string;
}) {
	const selectedCount = groups.reduce((n, g) => n + g.selected.length, 0);

	return (
		// محتوى القائمة يُطبع في body خارج شجرة الصفحة، وRadix لا يقرأ dir من الـ DOM — لذا يُمرَّر صراحةً
		<DropdownMenu dir="rtl">
			<DropdownMenuTrigger asChild>
				<Button
					type="button"
					variant="outline"
					size={size}
					className={cn("gap-1.5 px-2", className)}
				>
					<FilterIcon className="size-4 text-muted-foreground" />
					<span className="text-[12px] font-medium">التصفية</span>
					{selectedCount > 0 && (
						<span className="rounded-full bg-primary/10 px-1.5 text-[10px] font-medium text-primary">
							{selectedCount}
						</span>
					)}
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="start"
				className="w-60 p-1"
			>
				{groups.map(({ key, label, Icon, options, selected, onToggle, emptyLabel }) => (
					<DropdownMenuSub key={key}>
						<DropdownMenuSubTrigger className="gap-2 p-2.5">
							<Icon className="size-4 text-muted-foreground" />
							<span className="truncate text-xs font-medium text-muted-foreground">
								{label}
							</span>
							{selected.length > 0 && (
								<span className="text-[10px] font-medium text-primary">{selected.length}</span>
							)}
						</DropdownMenuSubTrigger>

						<DropdownMenuSubContent className="w-56">
							{options.length === 0 ? (
								<div className="px-2.5 py-2 text-[12px] text-muted-foreground">
									{emptyLabel ?? "لا توجد خيارات"}
								</div>
							) : (
								options.map((o) => (
									<DropdownMenuItem
										key={o.value}
										// منع إغلاق القائمة عند كل تبديل — التصفية متعدّدة الاختيار
										onSelect={(e) => {
											e.preventDefault();
											onToggle(o.value);
										}}
										className="h-8 gap-2 rounded-[6px] p-2.5"
									>
										<Checkbox
											checked={selected.includes(o.value)}
											tabIndex={-1}
											className="pointer-events-none"
										/>
										<span className="truncate text-[12px] font-medium">{o.label}</span>
									</DropdownMenuItem>
								))
							)}
						</DropdownMenuSubContent>
					</DropdownMenuSub>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
