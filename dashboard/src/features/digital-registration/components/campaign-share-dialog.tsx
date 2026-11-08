import {
	IconArrowRight,
	IconCheck,
	IconChevronDown,
	IconCopy,
	IconDownload,
	IconHistory,
	IconLink,
	IconLoader2,
	IconLock,
	IconQrcode,
	IconScan,
	IconTrash,
	IconX,
} from "@tabler/icons-react";
import QRCode from "qrcode";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
	useInviteCollaborator,
	useRegistrationShareAccess,
	useRegistrationShareAccessAudit,
	useStaffCandidates,
	useUpdateMemberAccess,
} from "../hooks/use-digital-registration";
import { useDigitalRegistrationCapabilities } from "../hooks/use-digital-registration-capabilities";
import type {
	ShareAccessMember,
	ShareAccessAuditEntry,
	StaffCandidate,
} from "../types/campaign-share.types";

// Subtle avatar colors matching the Figma/Notion/Linear reference design
const AVATAR_COLORS = [
	"bg-[#EDE9FE] text-[#6D28D9] dark:bg-[#4C1D95]/40 dark:text-[#C4B5FD]", // TI Purple
	"bg-[#E0F2FE] text-[#0369A1] dark:bg-[#0C4A6E]/40 dark:text-[#7DD3FC]", // Sky Blue
	"bg-[#FCE7F3] text-[#BE185D] dark:bg-[#831843]/40 dark:text-[#F472B6]", // Soft Pink
	"bg-[#CCFBF1] text-[#0F766E] dark:bg-[#134E4A]/40 dark:text-[#5EEAD4]", // Teal
	"bg-[#FEF3C7] text-[#B45309] dark:bg-[#78350F]/40 dark:text-[#FCD34D]", // Amber
];

function getInitials(name?: string | null): string {
	if (!name) return "م";
	const clean = name
		.trim()
		.replace(/^(د\.|أ\.|م\.|مهندس|دكتور|أستاذ)\s*/i, "")
		.split(/\s+/);
	if (clean.length === 0 || !clean[0]) return "م";
	if (clean.length === 1) return clean[0].slice(0, 2).toUpperCase();
	return `${clean[0][0]}${clean[1][0]}`.toUpperCase();
}

function getErrorMessage(error: unknown, fallback: string): string {
	return error instanceof Error && error.message ? error.message : fallback;
}

function getAccessLevelLabel(accessLevel: unknown): string {
	if (accessLevel === "can_edit") return "يمكنه التعديل";
	if (accessLevel === "can_view") return "عرض فقط";
	return "";
}

function getAuditDescription(entry: ShareAccessAuditEntry): string {
	const target = entry.targetName || entry.targetEmail || "الموظف";
	const accessLevel = getAccessLevelLabel(entry.after?.accessLevel);

	switch (entry.action) {
		case "member.added":
			return `أضاف ${target}${accessLevel ? ` — ${accessLevel}` : ""}`;
		case "member.access_changed":
			return `غيّر صلاحية ${target}${accessLevel ? ` إلى ${accessLevel}` : ""}`;
		case "member.removed":
			return `أزال وصول ${target}`;
	}
}

function formatAuditDate(value: string): string {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	return new Intl.DateTimeFormat("ar-EG", {
		day: "numeric",
		month: "short",
		hour: "numeric",
		minute: "2-digit",
	}).format(date);
}

interface CampaignShareDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialFocusInvite?: boolean;
	campaignCode?: string;
}

export function CampaignShareDialog({
	open,
	onOpenChange,
	initialFocusInvite = false,
	campaignCode,
}: CampaignShareDialogProps) {
	const { capabilities, isLoading: isCapabilitiesLoading } = useDigitalRegistrationCapabilities();
	const canManage = Boolean(capabilities?.canManageTeam);

	const [copiedLink, setCopiedLink] = useState(false);
	const [showQrModal, setShowQrModal] = useState(false);

	useEffect(() => {
		if (!open) {
			setShowQrModal(false);
		}
	}, [open]);
	const [qrDataUrl, setQrDataUrl] = useState<string>("");

	const boardUrl = useMemo(() => {
		if (typeof window !== "undefined") {
			return `${window.location.origin}/digital-registration`;
		}
		return "https://dashboard.sanad.app/digital-registration";
	}, []);

	useEffect(() => {
		if (boardUrl) {
			QRCode.toDataURL(boardUrl, {
				width: 320,
				margin: 2,
				color: {
					dark: "#1e1b4b",
					light: "#ffffff",
				},
			})
				.then((url) => setQrDataUrl(url))
				.catch((err) => console.error("Failed to generate QR code", err));
		}
	}, [boardUrl]);

	const handleCopyLink = () => {
		if (!canManage) {
			toast.error("صلاحيتك الحالية تتيح العرض فقط، ولا تملك صلاحية مشاركة اللوحة");
			return;
		}
		navigator.clipboard.writeText(boardUrl);
		setCopiedLink(true);
		toast.success("تم نسخ رابط لوحة التسجيل الرقمي بنجاح لمشاركته مع الموظفين");
		setTimeout(() => setCopiedLink(false), 2000);
	};

	const handleDownloadQr = () => {
		if (!canManage) {
			toast.error("صلاحيتك الحالية تتيح العرض فقط، ولا تملك صلاحية مشاركة رمز QR");
			return;
		}
		if (!qrDataUrl) return;
		const a = document.createElement("a");
		a.href = qrDataUrl;
		a.download = "sanad-registration-board-qr.png";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		toast.success("تم بدء تحميل رمز QR الخاص بلوحة الموظفين بنجاح");
	};
	const inviteInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (open && initialFocusInvite) {
			const timer = setTimeout(() => {
				inviteInputRef.current?.focus();
			}, 120);
			return () => clearTimeout(timer);
		}
	}, [open, initialFocusInvite]);

	// Queries and mutations
	const { data: shareData, isLoading: isShareLoading } = useRegistrationShareAccess();
	const inviteMutation = useInviteCollaborator();
	const updateAccessMutation = useUpdateMemberAccess();
	const isLoading = isShareLoading || isCapabilitiesLoading;
	const currentUser = shareData?.currentUser;
	const members = shareData?.members || [];
	const {
		data: auditEntries = [],
		isLoading: isAuditLoading,
		isError: isAuditError,
	} = useRegistrationShareAccessAudit(canManage && open);

	// Local form state
	const [inviteQuery, setInviteQuery] = useState("");
	const [selectedStaff, setSelectedStaff] = useState<StaffCandidate | null>(null);
	const [selectedRole, setSelectedRole] = useState<"can_edit" | "can_view">("can_edit");
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [memberToRemove, setMemberToRemove] = useState<ShareAccessMember | null>(null);

	// Staff autocomplete candidates
	const { data: candidates = [], isLoading: isCandidatesLoading } = useStaffCandidates(
		inviteQuery,
		canManage && showSuggestions,
	);

	const filteredCandidates = useMemo(() => {
		const unassignedCandidates = candidates.filter(
			(candidate) =>
				!members.some(
					(member) => member.email.toLowerCase() === candidate.email.toLowerCase(),
				),
		);
		if (!inviteQuery.trim()) return unassignedCandidates.slice(0, 5);
		const q = inviteQuery.toLowerCase();
		return unassignedCandidates.filter(
			(c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q),
		);
	}, [candidates, inviteQuery, members]);

	// Add eligible staff member to digital registration team handler
	const handleAddStaff = async () => {
		if (!capabilities.canManageTeam) return;
		if (!selectedStaff?.staffId) {
			toast.error("يرجى اختيار موظف من القائمة");
			return;
		}

		try {
			const res = await inviteMutation.mutateAsync({
				staffId: selectedStaff.staffId,
				accessLevel: selectedRole,
			});
			if (res?.alreadyExisted) {
				toast.success("تم تحديث صلاحية الموظف في فريق التسجيل الرقمي");
			} else {
				toast.success("تمت إضافة الموظف إلى فريق التسجيل بنجاح");
			}
			setInviteQuery("");
			setSelectedStaff(null);
			setShowSuggestions(false);
		} catch (error: unknown) {
			toast.error(getErrorMessage(error, "فشلت إضافة الموظف إلى فريق التسجيل"));
		}
	};

	// Update member access level handler
	const handleUpdateRole = async (memberId: string, level: "can_edit" | "can_view") => {
		if (!capabilities.canManageTeam) return;
		try {
			await updateAccessMutation.mutateAsync({
				memberId,
				accessLevel: level,
			});
			toast.success("تم تحديث صلاحية الموظف");
		} catch (error: unknown) {
			toast.error(getErrorMessage(error, "فشل تحديث الصلاحية"));
		}
	};

	// الإزالة إجراء حساس لكل عضو، لذلك لا ينفذ مباشرة من القائمة.
	const handleInitiateRemove = (member: ShareAccessMember) => {
		if (!capabilities.canManageTeam) return;
		if (member.accessLevel === "full") return;
		setMemberToRemove(member);
	};

	// Execute member removal
	const executeRemoveMember = async (member: ShareAccessMember) => {
		if (!capabilities.canManageTeam) return;
		try {
			const res = await updateAccessMutation.mutateAsync({
				memberId: member.id,
				accessLevel: "remove",
			});

			if (member.isPending) {
				if (res?.inviteRevoked) {
					toast.success("تم إلغاء الدعوة المعلقة وإزالة وصول الموظف إلى التسجيل الرقمي.");
				} else if (res?.warning) {
					toast.warning(res.warning);
				} else {
					toast.success("تمت إزالة صلاحية الموظف من التسجيل الرقمي.");
				}
			} else {
				toast.success("تمت إزالة صلاحية الموظف من التسجيل الرقمي.");
			}
		} catch (error: unknown) {
			toast.error(getErrorMessage(error, "فشلت إزالة العضو من فريق التسجيل"));
		} finally {
			setMemberToRemove(null);
		}
	};

	return (
		<>
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) setShowQrModal(false);
				onOpenChange(isOpen);
			}}
		>
			<DialogContent
				showCloseButton={false}
				dir="rtl"
				className="flex flex-col w-[94vw] sm:max-w-[560px] md:max-w-[600px] max-h-[86vh] overflow-y-auto p-4 sm:p-5 rounded-2xl gap-3.5 border border-gray-200 dark:border-zinc-800 shadow-2xl bg-white dark:bg-zinc-900 text-right font-sans"
			>
				{/* Header: Title and Close button */}
				<div className="flex items-center justify-between">
					<DialogTitle className="text-[16px] font-bold text-gray-900 dark:text-zinc-100 tracking-tight">
						فريق التسجيل الرقمي
					</DialogTitle>
					<button
						type="button"
						onClick={() => onOpenChange(false)}
						className="text-gray-400 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer rounded-md p-1 -ml-1"
						aria-label="إغلاق"
					>
						<IconX className="size-4" />
					</button>
				</div>

				{/* Description note */}
				<p className="text-[12px] text-gray-500 dark:text-zinc-400 leading-relaxed -mt-1.5">
					يستطيع مدير النظام إضافة موظفين محددين ومنحهم صلاحية العرض أو التعديل.
				</p>

				{/* إضافة موظف إلى فريق التسجيل */}
				{canManage ? (
					<div className="flex flex-col gap-1">
						<span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider select-none">
							إضافة موظف إلى فريق التسجيل
						</span>
						<div className="relative flex items-center gap-2">
							<div className="relative flex-1">
								<Input
									ref={inviteInputRef}
									value={inviteQuery}
									onChange={(e) => {
										setInviteQuery(e.target.value);
										setSelectedStaff(null);
										setShowSuggestions(true);
									}}
									onFocus={() => setShowSuggestions(true)}
									placeholder="ابحث عن موظف بالاسم أو البريد"
									className="h-8.5 text-[12px] px-2.5 rounded-lg border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 focus-visible:ring-1 focus-visible:ring-blue-500 placeholder:text-gray-400 text-right"
									dir="rtl"
								/>

								{/* قائمة اقتراحات موظفي الأكاديمية المؤهلين */}
								{showSuggestions && (
									<>
										<button
											type="button"
											aria-label="إغلاق قائمة الموظفين"
											className="fixed inset-0 z-40 cursor-default border-0 bg-transparent p-0"
											onClick={() => setShowSuggestions(false)}
										/>
										<div className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl py-1.5 max-h-56 overflow-y-auto">
											<div className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right border-b border-gray-100 dark:border-zinc-800">
												موظفو الأكاديمية المؤهلون
											</div>
											{isCandidatesLoading ? (
												<div className="flex items-center justify-center gap-2 px-3 py-3 text-xs text-gray-500">
													<IconLoader2 className="size-3.5 animate-spin" />
													جارٍ تحميل الموظفين المؤهلين...
												</div>
											) : filteredCandidates.length > 0 ? (
												filteredCandidates.map((c) => (
													<button
														key={c.staffId || c.id}
														type="button"
														className="w-full px-3 py-2 text-right flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-xs"
														onClick={() => {
															setSelectedStaff(c);
															setInviteQuery(c.name || c.email);
															setShowSuggestions(false);
														}}
													>
														<div className="flex items-center gap-2.5 min-w-0">
															<div className="size-7 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-semibold text-[11px] shrink-0">
																{getInitials(c.name)}
															</div>
															<div className="flex flex-col min-w-0 text-right">
																<span className="font-semibold text-gray-900 dark:text-zinc-100 truncate">
																	{c.name}
																</span>
																<span className="text-[11px] text-gray-500 truncate">{c.email}</span>
															</div>
														</div>
														{c.title && (
															<span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-500 shrink-0">
																{c.title}
															</span>
														)}
													</button>
												))
											) : (
												<div className="px-3 py-3 text-center text-xs text-gray-500">
													لا يوجد موظفون نشطون مرتبطون بحسابات دخول يمكن إضافتهم
												</div>
											)}
										</div>
									</>
								)}
							</div>

							{/* Role Select: Can edit / Can view */}
							<DropdownMenu dir="rtl">
								<DropdownMenuTrigger asChild>
									<Button
										type="button"
										variant="outline"
										className="h-8.5 px-2.5 gap-1 text-[12px] font-normal border-gray-200 dark:border-zinc-700 rounded-lg shrink-0 text-gray-700 dark:text-zinc-200 bg-white dark:bg-zinc-800/80 cursor-pointer shadow-none"
									>
										<span>{selectedRole === "can_edit" ? "يمكنه التعديل" : "عرض فقط"}</span>
										<IconChevronDown className="size-3.5 text-gray-400" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="w-36 text-xs text-right"
								>
									<DropdownMenuItem
										onClick={() => setSelectedRole("can_edit")}
										className="cursor-pointer justify-between"
									>
										<span>يمكنه التعديل</span>
										{selectedRole === "can_edit" && (
											<IconCheck className="size-3.5 text-blue-600" />
										)}
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => setSelectedRole("can_view")}
										className="cursor-pointer justify-between"
									>
										<span>عرض فقط</span>
										{selectedRole === "can_view" && (
											<IconCheck className="size-3.5 text-blue-600" />
										)}
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>

							{/* Add Button */}
							<Button
								type="button"
								disabled={inviteMutation.isPending || !selectedStaff}
								onClick={handleAddStaff}
								className="h-8.5 px-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-[12px] rounded-lg shrink-0 shadow-none cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{inviteMutation.isPending ? (
									<IconLoader2 className="size-4 animate-spin" />
								) : (
									"إضافة"
								)}
							</Button>
						</div>
					</div>
				) : (
					<div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/80 text-[12px] text-gray-500 dark:text-zinc-400 text-right">
						<IconLock className="size-3.5 text-gray-400 shrink-0" />
						<span>
							صلاحية عرض فقط — مدير النظام وحده يملك صلاحية إضافة موظفين وإدارة فريق التسجيل.
						</span>
					</div>
				)}

				{/* الموظفون المصرح لهم Section */}
				<div className="flex flex-col gap-2">
					<span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 select-none">
						الموظفون المصرح لهم
					</span>

					{/* Current User Row */}
					{currentUser && (
						<div className="flex items-center justify-between py-0.5">
							<div className="flex items-center gap-2.5 min-w-0">
								<div className="size-7 rounded-full bg-[#EDE9FE] text-[#6D28D9] dark:bg-[#4C1D95]/40 dark:text-[#C4B5FD] flex items-center justify-center font-semibold text-[11px] shrink-0 select-none">
									{getInitials(currentUser.name)}
								</div>
								<div className="flex flex-col min-w-0">
									<div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-gray-900 dark:text-zinc-100 truncate">
										<span>{currentUser.name}</span>
										<span className="text-gray-500 font-normal">(أنت)</span>
									</div>
									<div className="text-[11px] text-gray-500 truncate">
										{currentUser.email} · {currentUser.title || "مدير النظام"}
									</div>
								</div>
							</div>
									<span className="text-[12px] text-gray-500 font-normal shrink-0">
								{currentUser.accessLevel === "full"
									? "كامل الصلاحيات"
									: currentUser.accessLevel === "can_edit"
										? "يمكنك التعديل"
										: "عرض فقط"}
							</span>
						</div>
					)}

					{/* Other Members */}
					{isLoading ? (
						<div className="flex items-center justify-center gap-2 py-5 text-xs text-gray-500 dark:text-zinc-400">
							<IconLoader2 className="size-3.5 animate-spin" />
							جارٍ تحميل فريق التسجيل...
						</div>
					) : members.length > 0 ? (
						members.map((member, idx) => {
							const colorClass = AVATAR_COLORS[(idx + 1) % AVATAR_COLORS.length];
							return (
								<div
									key={member.id}
									className="flex items-center justify-between py-0.5"
								>
									<div className="flex items-center gap-2.5 min-w-0">
										<div
											className={cn(
											"size-7 rounded-full flex items-center justify-center font-semibold text-[11px] shrink-0 select-none",
												colorClass,
											)}
										>
											{getInitials(member.name)}
										</div>
										<div className="flex flex-col min-w-0">
										<div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-gray-900 dark:text-zinc-100 truncate">
												<span>{member.name}</span>
												{member.isPending && (
													<span className="text-[10px] bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 px-1.5 py-0.5 rounded font-medium">
														دعوة معلقة
													</span>
												)}
											</div>
										<div className="text-[11px] text-gray-500 truncate">
												{member.email} · {member.title || "عضو فريق"}
											</div>
										</div>
									</div>

									{/* Access Level Dropdown */}
									{canManage && member.accessLevel !== "full" ? (
										<DropdownMenu dir="rtl">
											<DropdownMenuTrigger asChild>
												<button
													type="button"
											className="flex items-center gap-1 text-[12px] text-gray-500 hover:text-gray-800 dark:hover:text-zinc-200 cursor-pointer transition-colors p-1 rounded"
												>
													<span>
														{member.accessLevel === "can_edit" ? "يمكنه التعديل" : "عرض فقط"}
													</span>
													<IconChevronDown className="size-3 text-gray-400" />
												</button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="w-40 text-xs text-right"
											>
												<DropdownMenuItem
													onClick={() => handleUpdateRole(member.id, "can_edit")}
													className="cursor-pointer justify-between"
												>
													<span>يمكنه التعديل</span>
													{member.accessLevel === "can_edit" && (
														<IconCheck className="size-3.5 text-blue-600" />
													)}
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => handleUpdateRole(member.id, "can_view")}
													className="cursor-pointer justify-between"
												>
													<span>عرض فقط</span>
													{member.accessLevel === "can_view" && (
														<IconCheck className="size-3.5 text-blue-600" />
													)}
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													onClick={() => handleInitiateRemove(member)}
													className="cursor-pointer text-destructive focus:text-destructive justify-between"
												>
													<span>{member.isPending ? "إلغاء الدعوة المعلقة" : "إزالة الموظف"}</span>
													<IconTrash className="size-3.5" />
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									) : (
										<span className="text-[12px] text-gray-500 shrink-0">
											{member.accessLevel === "full"
												? "كامل الصلاحيات"
												: member.accessLevel === "can_edit"
													? "يمكنه التعديل"
													: "عرض فقط"}
										</span>
									)}
								</div>
							);
						})
					) : (
						<div className="py-4 px-3 text-center text-xs text-gray-500 dark:text-zinc-400 border border-dashed border-gray-200 dark:border-zinc-800 rounded-lg">
							لم تتم إضافة أي موظفين إلى فريق التسجيل الرقمي بعد.
						</div>
					)}
				</div>

				{/* سجل تدقيق الوصول: مدير النظام فقط */}
				{canManage && (
					<div className="flex flex-col gap-2 border-t border-gray-200 pt-3 dark:border-zinc-800">
						<div className="flex items-center gap-2 text-right">
							<IconHistory className="size-4 text-gray-500 dark:text-zinc-400" />
							<span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
								سجل تغييرات الوصول
							</span>
						</div>
						{isAuditLoading ? (
							<div className="flex items-center justify-center gap-2 py-3 text-xs text-gray-500 dark:text-zinc-400">
								<IconLoader2 className="size-3.5 animate-spin" />
								جارٍ تحميل سجل التغييرات...
							</div>
						) : isAuditError ? (
							<p className="py-2 text-xs text-amber-700 dark:text-amber-300">
								تعذر تحميل سجل التغييرات حالياً.
							</p>
						) : auditEntries.length > 0 ? (
							<div className="max-h-32 overflow-y-auto divide-y divide-gray-100 rounded-lg border border-gray-100 dark:divide-zinc-800 dark:border-zinc-800">
								{auditEntries.map((entry) => (
									<div key={entry.id} className="px-3 py-2 text-right">
										<p className="text-[12px] font-medium text-gray-700 dark:text-zinc-200">
											{getAuditDescription(entry)}
										</p>
										<p className="mt-0.5 text-[11px] text-gray-500 dark:text-zinc-400">
											بواسطة {entry.actorName || "مدير النظام"} · {formatAuditDate(entry.createdAt)}
										</p>
									</div>
								))}
							</div>
						) : (
							<p className="py-2 text-xs text-gray-500 dark:text-zinc-400">
								لا توجد تغييرات وصول مسجلة حتى الآن.
							</p>
						)}
					</div>
				)}

				{/* Divider */}
				<div className="-mx-4 sm:-mx-5 border-b border-gray-200 dark:border-zinc-800" />

				{/* قسم وصول فريق التسجيل الرقمي (Restricted by design) */}
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between py-1">
						<div className="flex items-center gap-3 min-w-0">
							<div className="size-8 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-500 shrink-0">
								<IconLock className="size-4 text-gray-600 dark:text-zinc-400" />
							</div>
							<div className="flex flex-col min-w-0 text-right">
								<span className="text-[13px] font-semibold text-gray-900 dark:text-zinc-100">
									وصول فريق التسجيل الرقمي
								</span>
								<span className="text-[11px] text-gray-500 dark:text-zinc-400">
									الوصول مقصور على الموظفين المحددين من مدير النظام.
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Divider */}
				<div className="-mx-4 sm:-mx-5 border-b border-gray-200 dark:border-zinc-800" />

				{/* Footer: Copy Link & QR Code on the right (start in RTL), and Close button on the left (end in RTL) */}
				<div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
					{/* Right Side (start in RTL): Copy link & QR Code for Admins / Managers only */}
					{canManage ? (
						<div className="flex items-center gap-2">
							{/* Copy link */}
							<button
								type="button"
								onClick={handleCopyLink}
								className="h-8 px-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-200 text-[12px] font-medium flex items-center gap-1.5 cursor-pointer shadow-none transition-colors"
								title="نسخ رابط لوحة التسجيل الرقمي لمشاركته مع الموظفين المصرح لهم"
							>
								{copiedLink ? (
									<IconCheck className="size-3.5 text-emerald-600" />
								) : (
									<IconLink className="size-3.5 text-gray-500" />
								)}
								<span>{copiedLink ? "Copied!" : "Copy link"}</span>
							</button>

							{/* QR Code */}
							<button
								type="button"
								onClick={() => setShowQrModal(true)}
								className="h-8 px-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 hover:bg-purple-50/70 dark:hover:bg-purple-950/40 text-gray-800 dark:text-zinc-200 text-[12px] font-medium flex items-center gap-1.5 cursor-pointer shadow-none transition-colors group"
								title="عرض وتحميل رمز QR للوحة التسجيل لمسحه من قِبل الموظفين"
							>
								<IconQrcode className="size-4 text-[#6D28D9] dark:text-[#A78BFA] transition-transform group-hover:scale-110" />
								<span className="text-[#6D28D9] dark:text-[#A78BFA] font-medium">QR Code</span>
							</button>
						</div>
					) : (
						<div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-zinc-500 select-none">
							<IconLock className="size-3.5" />
							<span>مشاركة اللوحة متاحة لمدير النظام فقط</span>
						</div>
					)}

					{/* Left Side (end in RTL): إغلاق */}
					<Button
						type="button"
						size="sm"
						onClick={() => onOpenChange(false)}
						className="h-8.5 px-5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-[12px] rounded-lg cursor-pointer shadow-none transition-colors"
					>
						إغلاق
					</Button>
				</div>
			</DialogContent>
		</Dialog>

		{/* تأكيد إلغاء الدعوة المعلقة */}
		<Dialog
			open={!!memberToRemove}
			onOpenChange={(isOpen) => !isOpen && setMemberToRemove(null)}
		>
			<DialogContent
				dir="rtl"
				className="!fixed !left-1/2 !right-auto !top-1/2 !-translate-x-1/2 rtl:!-translate-x-1/2 !-translate-y-1/2 w-[90vw] sm:max-w-[420px] p-5 rounded-2xl gap-4 border border-gray-200 dark:border-zinc-800 shadow-2xl bg-white dark:bg-zinc-900 text-right font-sans z-60"
			>
				<div className="flex flex-col gap-2">
					<DialogTitle className="text-[16px] font-bold text-gray-900 dark:text-zinc-100">
						{memberToRemove?.isPending ? "تأكيد إلغاء الدعوة المعلقة" : "تأكيد إزالة الموظف"}
					</DialogTitle>
					<p className="text-[13px] text-gray-500 dark:text-zinc-400 leading-relaxed">
						{memberToRemove?.isPending
							? "سيتم إلغاء دعوة الموظف المعلقة وإزالة وصوله إلى التسجيل الرقمي."
							: "سيتم إزالة وصول الموظف إلى التسجيل الرقمي، ولن يتم حذف حسابه أو ملفه الوظيفي."}
					</p>
				</div>

				<div className="flex items-center justify-end gap-2 pt-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => setMemberToRemove(null)}
						disabled={updateAccessMutation.isPending}
						className="h-8.5 px-3 text-xs cursor-pointer"
					>
						تراجع
					</Button>
					<Button
						type="button"
						variant="destructive"
						size="sm"
						disabled={updateAccessMutation.isPending}
						onClick={() => memberToRemove && executeRemoveMember(memberToRemove)}
						className="h-8.5 px-3.5 text-xs font-semibold cursor-pointer"
					>
						{updateAccessMutation.isPending ? (
							<IconLoader2 className="size-3.5 animate-spin" />
						) : (
							memberToRemove?.isPending ? "إلغاء الدعوة وإزالة الوصول" : "إزالة الوصول"
						)}
					</Button>
				</div>
			</DialogContent>
		</Dialog>

		{/* نافذة عرض وتحميل رمز QR للوحة التسجيل الرقمي للموظفين (Modal on top of Share) */}
		<Dialog open={showQrModal} onOpenChange={setShowQrModal}>
			<DialogContent
				showCloseButton={false}
				dir="rtl"
				className="flex flex-col w-[92vw] sm:max-w-[370px] p-4 sm:p-4.5 rounded-2xl gap-3 border border-gray-200 dark:border-zinc-800 shadow-2xl bg-white dark:bg-zinc-900 text-right font-sans overflow-hidden z-70"
			>
				{/* Header: Title and single clean close button */}
				<div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-zinc-800/80 w-full min-w-0">
					<div className="flex items-center gap-2.5 min-w-0">
						<div className="size-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-[#6D28D9] dark:text-[#C4B5FD] flex items-center justify-center border border-purple-100/80 dark:border-purple-900/40 shrink-0">
							<IconQrcode className="size-4.5" />
						</div>
						<div className="flex flex-col text-start min-w-0">
							<DialogTitle className="text-[14.5px] font-bold text-gray-900 dark:text-zinc-100 truncate">
								رمز الاستجابة السريعة (QR Code)
							</DialogTitle>
							<span className="text-[10.5px] text-gray-400 dark:text-zinc-500 font-normal truncate">
								لوحة التسجيل الرقمي لفريق العمل
							</span>
						</div>
					</div>
					<button
						type="button"
						onClick={() => setShowQrModal(false)}
						className="text-gray-400 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
						aria-label="إغلاق"
					>
						<IconX className="size-4" />
					</button>
				</div>

				{/* QR Code Showcase Card */}
				<div className="flex flex-col items-center justify-center p-3 bg-gray-50/80 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-800 gap-2.5 w-full">
					{qrDataUrl ? (
						<div className="p-2.5 bg-white dark:bg-white rounded-xl shadow-2xs border border-gray-200/80 dark:border-zinc-200 transition-transform hover:scale-[1.01] shrink-0">
							<img
								src={qrDataUrl}
								alt="Digital Registration Board QR Code"
								className="size-36 sm:size-40 object-contain select-none"
							/>
						</div>
					) : (
						<div className="size-40 flex items-center justify-center text-xs text-gray-400">
							<IconLoader2 className="size-5 animate-spin text-[#6D28D9]" />
						</div>
					)}

					<div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-zinc-400 font-medium text-center">
						<IconScan className="size-3.5 text-[#6D28D9] dark:text-[#A78BFA] shrink-0" />
						<span>امسح الرمز لفتح اللوحة بحسابك المصرح له</span>
					</div>
				</div>

				{/* URL Pill with direct Copy Action */}
				<div className="flex items-center gap-2 w-full min-w-0 bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 shadow-2xs">
					<IconLink className="size-3.5 text-gray-400 shrink-0" />
					<span
						className="text-[11px] font-mono text-gray-700 dark:text-zinc-300 truncate min-w-0 flex-1 text-left select-all"
						dir="ltr"
						title={boardUrl}
					>
						{boardUrl}
					</span>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={handleCopyLink}
						className="h-6.5 px-2 text-[10.5px] font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-md shrink-0 gap-1 cursor-pointer"
					>
						{copiedLink ? (
							<>
								<IconCheck className="size-3 text-emerald-600" />
								<span className="text-emerald-600 font-semibold">تم النسخ</span>
							</>
						) : (
							<>
								<IconCopy className="size-3" />
								<span>نسخ</span>
							</>
						)}
					</Button>
				</div>

				{/* Footer Actions */}
				<div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-100 dark:border-zinc-800 w-full">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => setShowQrModal(false)}
						className="h-8 px-3.5 text-xs font-medium cursor-pointer rounded-lg border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300"
					>
						إغلاق
					</Button>

					<Button
						type="button"
						size="sm"
						onClick={handleDownloadQr}
						disabled={!qrDataUrl}
						className="h-8 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-xs gap-1.5 rounded-lg cursor-pointer transition-colors shadow-none"
					>
						<IconDownload className="size-3.5" />
						<span>تحميل الرمز (PNG)</span>
					</Button>
				</div>
			</DialogContent>
		</Dialog>

		</>
	);
}
