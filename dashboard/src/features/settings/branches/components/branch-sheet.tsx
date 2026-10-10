import {
	IconChevronLeft,
	IconCopy,
	IconMailFast,
	IconMapPin,
	IconPhone,
	IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoomsTab } from "@/features/settings/branches/components/tabs/rooms-tab";
import { SettingsTab } from "@/features/settings/branches/components/tabs/settings-tab";
import type { BranchSheetProps } from "@/features/settings/branches/types/branch-sheet.types";
import { useI18n } from "@/hooks/use-i18n";

export function BranchSheet({ branch, open, onClose }: BranchSheetProps) {
	const { isRtl } = useI18n();
	const side = isRtl ? "left" : "right";

	return (
		<Sheet
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<SheetContent
				side={side}
				showCloseButton={false}
				className="max-w-2/3! w-full gap-0"
			>
				<SheetHeader className="p-0">
					<div className="flex items-center gap-2 justify-between px-4 py-2 border-b">
						<SheetTitle className="flex items-center gap-2 font-bold text-lg">
							<p>الفروع والقاعات</p>
							<IconChevronLeft className="size-4" />
							<IconMapPin className="size-6 text-[#A3A8B0] bg-[#F5F5F6] rounded-[4px] p-1" />
							<p>{branch?.name}</p>
						</SheetTitle>

						<div className="flex items-center gap-2">
							<Button
								size="sm"
								variant="outline"
								className="text-red-500"
							>
								<IconX className="size-4 text-red-500" />
								<p>حذف الفرع</p>
							</Button>

							<Button
								size="xs"
								variant="outline"
								className="text-red-500"
							>
								<IconX className="size-4 text-red-500" />
								<p>تعطيل الفرع</p>
							</Button>

							<Button
								size="sm"
								variant="ghost"
							>
								<IconX />
							</Button>
						</div>
					</div>
				</SheetHeader>

				<Tabs
					defaultValue="rooms"
					className="justify-end flex-1 gap-0 flex flex-col overflow-hidden"
				>
					<div className="px-3 py-2">
						<TabsList className="w-full justify-end">
							<TabsTrigger
								className="flex-none px-2.5 py-2"
								value="settings"
							>
								إعدادات
							</TabsTrigger>
							<TabsTrigger
								className="flex-none px-2.5 py-2"
								value="stats"
							>
								الإحصائيات
							</TabsTrigger>
							<TabsTrigger
								className="flex-none px-2.5 py-2"
								value="activity"
							>
								النشاط 123
							</TabsTrigger>
							<TabsTrigger
								className="flex-none px-2.5 py-2"
								value="rooms"
							>
								القاعات والمرافق
							</TabsTrigger>
						</TabsList>
					</div>

					<Separator />

					<div className="grid grid-cols-7 h-full">
						<div
							className="col-span-2 border-s p-3 flex flex-col gap-5"
							dir="rtl"
						>
							<p className="font-semibold text-sm">التفاصيل</p>

							<div className="flex flex-col gap-3">
								<div className="flex items-center gap-2 ">
									<IconMapPin className="size-4 text-muted-foreground" />
									<Badge
										variant={branch?.type === "PRIMARY" ? "primary" : "secondary"}
										className="gap-1 h-6 text-xs"
									>
										{branch?.type === "PRIMARY" ? "رئيسي" : "فرعي"}
									</Badge>
								</div>

								{branch?.manager && (
									<div className="flex items-center justify-between gap-2">
										<div className="flex items-center gap-1.5">
											<Avatar className="size-5">
												<AvatarImage src={branch.manager.image ?? undefined} />
												<AvatarFallback className="text-[10px] bg-violet-500 text-white">
													{branch.manager.name?.slice(0, 2)}
												</AvatarFallback>
											</Avatar>
											<span className="text-sm font-medium">{branch.manager.name}</span>
										</div>

										<Button
											size="xs"
											variant="outline"
											className="h-7 text-xs gap-1"
										>
											<IconMailFast className="size-3" />
											إرسال رسالة
										</Button>
									</div>
								)}
							</div>

							<div className="flex flex-col gap-3">
								{branch?.phone && (
									<div className="flex items-center justify-between gap-2">
										<div className="flex items-center gap-1.5">
											<span
												className="text-sm tabular-nums"
												dir="ltr"
											>
												{branch.phone}
											</span>
											<IconPhone className="size-4 text-muted-foreground" />
										</div>

										<Button
											size="xs"
											variant="outline"
											className="h-7 text-xs gap-1"
											onClick={() => {
												navigator.clipboard.writeText(branch.phone as string);
												toast.success("تم النسخ");
											}}
										>
											<IconCopy className="size-3" />
											نسخ
										</Button>
									</div>
								)}

								{branch?.manager?.phone && (
									<div className="flex items-center justify-between gap-2">
										<div className="flex items-center gap-1.5">
											<IconPhone className="size-4 text-muted-foreground" />
											<span
												className="text-sm tabular-nums"
												dir="ltr"
											>
												{branch.manager.phone}
											</span>
										</div>

										<Button
											size="xs"
											variant="outline"
											className="h-7 text-xs gap-1"
											onClick={() => {
												navigator.clipboard.writeText(branch.manager?.phone as string);
												toast.success("تم النسخ");
											}}
										>
											<IconCopy className="size-3" />
											نسخ
										</Button>
									</div>
								)}

								{branch?.createdAt && (
									<div className="flex flex-col  gap-0.5 mt-2">
										<span className="text-xs text-muted-foreground">تاريخ الإنشاء</span>
										<span className="text-sm tabular-nums">
											{new Date(branch.createdAt).toLocaleDateString("ar-SA")}
										</span>
									</div>
								)}
							</div>
						</div>

						<div className="col-span-5">
							<RoomsTab branchId={branch?.id ?? ""} />

							{/* Activity */}
							<TabsContent
								value="activity"
								className="m-0 p-3"
							>
								<p>activity</p>
							</TabsContent>

							{/* Stats */}
							<TabsContent
								value="stats"
								className="m-0 p-3"
							>
								<p>stats</p>
							</TabsContent>

							{/* Settings */}
							<SettingsTab branchId={branch?.id ?? ""} />
						</div>
					</div>
				</Tabs>
			</SheetContent>
		</Sheet>
	);
}
