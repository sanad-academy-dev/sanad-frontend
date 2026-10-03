import {
	IconArrowsDiagonal,
	IconArrowsDiagonalMinimize2,
	IconBan,
	IconBriefcase,
	IconChevronLeft,
	IconCircleCheck,
	IconCircleOff,
	IconCopy,
	IconDots,
	IconMail,
	IconPhone,
	IconSend,
	IconStethoscope,
	IconTrash,
	IconUserCheck,
	IconUserOff,
	IconX,
} from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { arSA } from "date-fns/locale";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeleteStaffDialog } from "@/features/services/staff/components/delete-staff-dialog";
import { DisableStaffDialog } from "@/features/services/staff/components/disable-staff-dialog";
import { InviteStaffDialog } from "@/features/services/staff/components/invite-staff-dialog";
import { AnnouncementsTab } from "@/features/services/staff/components/tabs/announcements-tab";
import { DocumentsTab } from "@/features/services/staff/components/tabs/documents-tab";
import { OverviewTab } from "@/features/services/staff/components/tabs/overview-tab";
import { SettingsTab } from "@/features/services/staff/components/tabs/settings-tab";
import { useAnnouncementsStore } from "@/features/services/staff/stores/announcements.store";
import type { StaffSheetProps } from "@/features/services/staff/types/staff-sheet.types";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import { type StaffResponse, StaffStatus } from "@sanad/contracts/runtime/server/staff/staff.type";

function StaffAvatar({ name }: { name: string }) {
	const initials = name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
	return (
		<div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary primarytext-[10px] font-semibold">
			{initials}
		</div>
	);
}

function getLastLogin(staff: StaffResponse): string {
	const last = staff.user?.sessions?.[0]?.createdAt;
	if (!last) return "—";
	return formatDistanceToNow(new Date(last), { addSuffix: true, locale: arSA });
}

export function StaffSheet({ staff, open, onClose }: StaffSheetProps) {
	const { isRtl } = useI18n();
	const side = isRtl ? "left" : "right";

	const [disableTarget, setDisableTarget] = useState<StaffResponse | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<StaffResponse | null>(null);
	const [inviteTarget, setInviteTarget] = useState<StaffResponse | null>(null);
	const [expanded, setExpanded] = useState(false);

	// عدد الإعلانات الموجّهة لهذا الموظف (مرسلة إليه مباشرةً أو منشورة للجميع)
	const announcements = useAnnouncementsStore((s) => s.announcements);
	const announcementsCount = staff
		? announcements.filter((a) => a.recipientCount === 0 || a.recipientIds.includes(staff.id))
				.length
		: 0;

	const copyPhone = () => {
		if (!staff?.phone) return;
		navigator.clipboard.writeText(staff.phone);
		toast.success("تم النسخ");
	};

	return (
		<>
			<Sheet
				open={open}
				onOpenChange={(isOpen) => {
					if (!isOpen) onClose();
				}}
			>
				<SheetContent
					side={side}
					showCloseButton={false}
					className={cn(
						"gap-0 transition-[width,max-width] duration-200",
						expanded
							? "w-[91vw]! max-w-[91vw]! sm:w-[91vw]! sm:max-w-[91vw]!"
							: "w-[60vw]! max-w-[60vw]! sm:w-[60vw]! sm:max-w-[60vw]!",
					)}
					dir="rtl"
				>
					<SheetHeader className="p-0">
						<div className="flex items-center gap-2 justify-between px-4 py-2 border-b">
							<SheetTitle className="flex items-center gap-2 font-bold text-lg">
								<p>الموظفين</p>
								<IconChevronLeft className="size-4" />
								{staff && (
									<>
										<StaffAvatar name={staff.name} />
										<p>{staff.name}</p>
										<span className="text-xs text-muted-foreground tabular-nums font-normal">
											{staff.code}
										</span>
									</>
								)}
							</SheetTitle>

							<div className="flex items-center gap-1">
								<DropdownMenu dir="rtl">
									<DropdownMenuTrigger asChild>
										<Button
											size="icon"
											variant="ghost"
											className="size-8"
										>
											<IconDots className="size-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="start">
										<DropdownMenuItem
											className="gap-2"
											onSelect={() => staff && setDisableTarget(staff)}
										>
											<IconBan className="size-4" />
											تعطيل
										</DropdownMenuItem>
										{staff?.status === StaffStatus.PENDING && (
											<DropdownMenuItem
												className="gap-2"
												onSelect={() => setInviteTarget(staff)}
											>
												<IconSend className="size-4" />
												إعادة إرسال الدعوة
											</DropdownMenuItem>
										)}
										<DropdownMenuSeparator />
										<DropdownMenuItem
											className="text-destructive gap-2"
											onSelect={() => staff && setDeleteTarget(staff)}
										>
											<IconTrash className="size-4" />
											حذف
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>

								<Button
									size="icon"
									variant="ghost"
									className="size-8"
									onClick={() => setExpanded((v) => !v)}
									aria-label={expanded ? "تصغير" : "توسيع"}
								>
									{expanded ? (
										<IconArrowsDiagonalMinimize2 className="size-4" />
									) : (
										<IconArrowsDiagonal className="size-4" />
									)}
								</Button>

								<Button
									size="icon"
									variant="ghost"
									className="size-8"
									onClick={onClose}
								>
									<IconX className="size-4" />
								</Button>
							</div>
						</div>
					</SheetHeader>

					<Tabs
						defaultValue="overview"
						className="justify-end flex-1 gap-0 flex flex-col overflow-hidden"
					>
						<div className="px-3 py-2">
							<TabsList className="w-full justify-end">
								<TabsTrigger
									className="flex-none px-2.5 py-2"
									value="settings"
								>
									الإعدادات
								</TabsTrigger>
								<TabsTrigger
									className="flex-none px-2.5 py-2"
									value="documents"
								>
									المستندات
									<span className="ms-1 inline-flex h-4 min-w-4 items-center justify-center rounded bg-muted px-1 text-[10px] font-medium tabular-nums text-muted-foreground">
										0
									</span>
								</TabsTrigger>
								<TabsTrigger
									className="flex-none px-2.5 py-2"
									value="announcements"
								>
									الإعلانات
									{announcementsCount > 0 && (
										<span className="ms-1 inline-flex h-4 min-w-4 items-center justify-center rounded bg-muted px-1 text-[10px] font-medium tabular-nums text-muted-foreground">
											{announcementsCount}
										</span>
									)}
								</TabsTrigger>
								<TabsTrigger
									className="flex-none px-2.5 py-2"
									value="overview"
								>
									نظرة عامة
								</TabsTrigger>
							</TabsList>
						</div>

						<Separator />

						<div className="grid grid-cols-7 h-full overflow-hidden">
							<div
								className="col-span-2 border-s p-4 flex flex-col gap-6 overflow-y-auto"
								dir="rtl"
							>
								{/* معلومات التواصل */}
								<div className="flex flex-col gap-3">
									<p className="font-semibold text-sm">معلومات التواصل</p>

									{staff?.email && (
										<div className="flex items-center justify-between gap-2">
											<div className="flex items-center gap-1.5 min-w-0">
												<IconMail className="size-4 text-muted-foreground shrink-0" />
												<span
													className="text-sm truncate"
													dir="ltr"
												>
													{staff.email}
												</span>
											</div>

											<Button
												asChild
												size="xs"
												variant="outline"
												className="h-7 text-xs shrink-0"
											>
												<a href={`mailto:${staff.email}`}>إرسال رسالة</a>
											</Button>
										</div>
									)}

									{staff?.phone && (
										<div className="flex items-center justify-between gap-2">
											<div className="flex items-center gap-1.5">
												<IconPhone className="size-4 text-muted-foreground shrink-0" />
												<span
													className="text-sm tabular-nums"
													dir="ltr"
												>
													{staff.phone}
												</span>
											</div>

											<Button
												size="xs"
												variant="outline"
												className="h-7 text-xs"
												onClick={copyPhone}
											>
												<IconCopy className="size-3" />
												نسخ
											</Button>
										</div>
									)}
								</div>

								{/* التفاصيل */}
								<div className="flex flex-col gap-3">
									<p className="font-semibold text-sm">التفاصيل</p>

									{/* active flag — with optional "إرسال تذكير" when not active */}
									<div className="flex justify-start items-center gap-2">
										<div className="flex items-center gap-1.5">
											{staff?.active ? (
												<IconCircleCheck className="size-4 text-muted-foreground" />
											) : (
												<IconCircleOff className="size-4 text-muted-foreground" />
											)}
											<span className="text-sm">{staff?.active ? "مفعل" : "غير مفعل"}</span>
										</div>

										{!staff?.active && staff?.status === StaffStatus.PENDING ? (
											<Button
												size="xs"
												variant="outline"
												className="h-7 text-xs"
												onClick={() => setInviteTarget(staff)}
											>
												<IconSend className="size-3" />
												إرسال تذكير
											</Button>
										) : (
											<span />
										)}
									</div>

									{/* status */}
									<div className="flex items-center justify-start gap-1.5">
										{staff?.status === StaffStatus.ACTIVE ? (
											<IconUserCheck className="size-4 text-muted-foreground" />
										) : (
											<IconUserOff className="size-4 text-muted-foreground" />
										)}
										<span className="text-sm">
											{staff?.status === StaffStatus.ACTIVE
												? "نشط"
												: staff?.status === StaffStatus.PENDING
													? "معلق"
													: "غير نشط"}
										</span>
									</div>

									{/* role */}
									{staff?.role?.name && (
										<div className="flex items-center justify-start gap-1.5">
											<IconBriefcase className="size-4 text-muted-foreground" />
											<span className="text-sm">{staff.role.name}</span>
										</div>
									)}

									{/* primary specialization */}
									{staff?.primarySpecialization?.name && (
										<div className="flex items-center justify-start gap-1.5">
											<IconStethoscope className="size-4 text-muted-foreground" />
											<span className="text-sm">{staff.primarySpecialization.name}</span>
										</div>
									)}

									{/* secondary specialization */}
									{staff?.secondarySpecialization?.name && (
										<div className="flex items-center justify-start gap-1.5">
											<IconStethoscope className="size-4 text-muted-foreground" />
											<span className="text-sm">{staff.secondarySpecialization.name}</span>
										</div>
									)}
								</div>

								{/* Dates */}
								<div className="flex flex-col gap-3">
									{staff?.createdAt && (
										<div className="flex items-center justify-between gap-2">
											<span className="font-semibold text-sm">تاريخ التعين</span>
											<span
												className="text-sm tabular-nums"
												dir="ltr"
											>
												{new Date(staff.createdAt).toLocaleDateString("en-GB")}
											</span>
										</div>
									)}

									{staff && (
										<div className="flex items-center justify-between gap-2">
											<span className="font-semibold text-sm">آخر تسجيل دخول</span>
											<span className="text-sm">{getLastLogin(staff)}</span>
										</div>
									)}
								</div>
							</div>

							<div className="col-span-5 overflow-y-auto">
								<OverviewTab staffId={staff?.id ?? ""} />
								<AnnouncementsTab staffId={staff?.id ?? ""} />
								<DocumentsTab staffId={staff?.id ?? ""} />
								<SettingsTab staffId={staff?.id ?? ""} />
							</div>
						</div>
					</Tabs>
				</SheetContent>
			</Sheet>

			<DisableStaffDialog
				staff={disableTarget}
				onClose={() => setDisableTarget(null)}
			/>
			<DeleteStaffDialog
				staff={deleteTarget}
				onClose={() => setDeleteTarget(null)}
			/>
			<InviteStaffDialog
				staff={inviteTarget}
				onClose={() => setInviteTarget(null)}
			/>
		</>
	);
}
