import { IconArrowsSort, IconLayoutGrid } from "@tabler/icons-react";
import type { ReactNode } from "react";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useInbox } from "@/features/inbox/hooks/use-inbox";
import {
	INBOX_DISPLAY_PROPERTIES,
	INBOX_SORT_OPTIONS,
	type InboxSort,
} from "@/features/inbox/types/inbox.type";
import { cn } from "@/lib/utils";

// صف: عنوان (وأيقونة) على اليمين، عنصر تحكم على اليسار
function SettingRow({
	label,
	icon,
	control,
}: {
	label: ReactNode;
	icon?: ReactNode;
	control: ReactNode;
}) {
	return (
		<div className="flex items-center justify-between gap-2">
			<span className="flex items-center gap-1.5 text-[11px] font-medium text-foreground">
				{label}
				{icon}
			</span>
			{control}
		</div>
	);
}

// محتوى قائمة إعدادات عرض الوارد (الترتيب / الإظهار / خصائص العرض)
export function InboxSettingsMenu() {
	const {
		sort,
		showRead,
		showUnread,
		displayProperties,
		setSort,
		setShowRead,
		setShowUnread,
		toggleDisplayProperty,
	} = useInbox();

	return (
		<div
			className="flex w-[260px] flex-col gap-3 p-1"
			dir="rtl"
		>
			{/* الترتيب */}
			<SettingRow
				label="الترتيب"
				icon={<IconArrowsSort className="size-3 text-muted-foreground" />}
				control={
					<Select
						value={sort}
						onValueChange={(v) => setSort(v as InboxSort)}
					>
						<SelectTrigger
							size="sm"
							className="h-[26px] w-[126px] text-[11px]"
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{INBOX_SORT_OPTIONS.map((opt) => (
								<SelectItem
									key={opt.value}
									value={opt.value}
									className="text-[11px]"
								>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				}
			/>

			<div className="h-px w-full bg-border" />

			{/* إظهار المقروء / غير المقروء */}
			<SettingRow
				label="إظهار المقروء"
				control={
					<Switch
						size="sm"
						checked={showRead}
						onCheckedChange={setShowRead}
					/>
				}
			/>
			<SettingRow
				label="إظهار غير المقروء"
				control={
					<Switch
						size="sm"
						checked={showUnread}
						onCheckedChange={setShowUnread}
					/>
				}
			/>

			<div className="h-px w-full bg-border" />

			{/* خصائص العرض */}
			<div className="flex flex-col gap-2">
				<span className="flex items-center justify-start gap-1.5 text-[11px] font-medium text-foreground">
					<IconLayoutGrid className="size-3 text-muted-foreground" />
					خصائص العرض
				</span>

				{/* رقائق قابلة للتبديل */}
				<div className="flex flex-wrap items-center justify-end gap-1">
					{INBOX_DISPLAY_PROPERTIES.map((prop) => {
						const isActive = displayProperties.includes(prop.value);
						return (
							<button
								key={prop.value}
								type="button"
								onClick={() => toggleDisplayProperty(prop.value)}
								className={cn(
									"rounded-[4px] border-[0.75px] px-2 py-1 text-[10px] font-medium transition-colors",
									isActive
										? "border-primary/40 bg-primary/10 text-primary"
										: "border-border text-muted-foreground hover:bg-muted",
								)}
							>
								{prop.label}
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
