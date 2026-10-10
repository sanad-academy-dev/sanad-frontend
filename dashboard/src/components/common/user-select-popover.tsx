import { IconCheck, IconChevronDown, IconUser, IconX } from "@tabler/icons-react";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/**
 * اختيار مستخدم واحد من الفريق — نفس نمط «اختيار مسؤول» في المصروفات:
 * زر يفتح قائمة بالأفاتار والاسم وعلامة اختيار. يُعيد المعرّف والاسم معًا
 * حتى يحفظ المستدعي لقطة الاسم مع المرجع.
 */
export function UserSelectPopover({
	users,
	value,
	onChange,
	placeholder = "اختر المسؤول...",
	disabled,
	className,
}: {
	users: { id: string; name: string }[];
	/** معرّف المستخدم المختار، أو null */
	value: string | null;
	onChange: (user: { id: string; name: string } | null) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
}) {
	const [open, setOpen] = useState(false);
	const selected = users.find((u) => u.id === value) ?? null;

	return (
		<div className={cn("flex items-center gap-1.5", className)}>
			<Popover
				open={open}
				onOpenChange={setOpen}
			>
				<PopoverTrigger asChild>
					<Button
						type="button"
						variant="outline"
						disabled={disabled}
						className="min-w-0 flex-1 justify-between gap-2 font-normal"
					>
						<span className="flex min-w-0 items-center gap-2">
							{selected ? (
								<>
									<Avatar
										size="sm"
										className="size-6"
									>
										<AvatarFallback className="text-[10px]">
											{selected.name.charAt(0)}
										</AvatarFallback>
									</Avatar>
									<span className="truncate">{selected.name}</span>
								</>
							) : (
								<>
									<IconUser className="size-4 text-muted-foreground" />
									<span className="text-muted-foreground">{placeholder}</span>
								</>
							)}
						</span>
						<IconChevronDown className="size-4 shrink-0 text-muted-foreground" />
					</Button>
				</PopoverTrigger>
				<PopoverContent
					align="end"
					dir="rtl"
					className="w-72 p-1"
				>
					<div className="border-b px-2 py-1.5">
						<span className="text-xs text-muted-foreground">{placeholder}</span>
					</div>
					{users.length === 0 ? (
						<p className="px-2 py-3 text-center text-xs text-muted-foreground">
							لا يوجد مستخدمون
						</p>
					) : (
						<div className="max-h-64 overflow-y-auto">
							{users.map((user) => {
								const checked = user.id === value;
								return (
									<button
										key={user.id}
										type="button"
										onClick={() => {
											onChange(checked ? null : user);
											setOpen(false);
										}}
										className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent"
									>
										<span className="flex min-w-0 items-center gap-2">
											<Avatar
												size="sm"
												className="size-6"
											>
												<AvatarFallback className="text-[10px]">
													{user.name.charAt(0)}
												</AvatarFallback>
											</Avatar>
											<span className="truncate">{user.name}</span>
										</span>
										{checked && <IconCheck className="size-4 text-primary" />}
									</button>
								);
							})}
						</div>
					)}
				</PopoverContent>
			</Popover>

			{selected && (
				<Button
					type="button"
					size="icon"
					variant="ghost"
					aria-label="إزالة الاختيار"
					disabled={disabled}
					className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
					onClick={() => onChange(null)}
				>
					<IconX className="size-3.5" />
				</Button>
			)}
		</div>
	);
}
