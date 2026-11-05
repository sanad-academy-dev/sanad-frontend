import {
	IconArrowLeft,
	IconBrandWhatsapp,
	IconBuilding,
	IconCheck,
	IconChevronDown,
	IconDownload,
	IconLink,
	IconLoader2,
	IconLock,
	IconMail,
	IconPhoto,
	IconQrcode,
	IconShare,
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
	useStaffCandidates,
	useUpdateGeneralAccess,
	useUpdateMemberAccess,
} from "../hooks/use-digital-registration";

// Subtle avatar colors matching the Figma/Notion/Linear reference design
const AVATAR_COLORS = [
	"bg-[#EDE9FE] text-[#6D28D9] dark:bg-[#4C1D95]/40 dark:text-[#C4B5FD]", // TI Purple
	"bg-[#E0F2FE] text-[#0369A1] dark:bg-[#0C4A6E]/40 dark:text-[#7DD3FC]", // Sky Blue
	"bg-[#FCE7F3] text-[#BE185D] dark:bg-[#831843]/40 dark:text-[#F472B6]", // Soft Pink
	"bg-[#CCFBF1] text-[#0F766E] dark:bg-[#134E4A]/40 dark:text-[#5EEAD4]", // Teal
	"bg-[#FEF3C7] text-[#B45309] dark:bg-[#78350F]/40 dark:text-[#FCD34D]", // Amber
];

function getInitials(name?: string | null): string {
	if (!name) return "U";
	const clean = name
		.trim()
		.replace(/^(د\.|أ\.|م\.|مهندس|دكتور)\s*/i, "")
		.split(/\s+/);
	if (clean.length === 0 || !clean[0]) return "U";
	if (clean.length === 1) return clean[0].slice(0, 2).toUpperCase();
	return `${clean[0][0]}${clean[1][0]}`.toUpperCase();
}

interface CampaignShareDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	campaignId?: string;
	campaignName?: string;
	initialFocusInvite?: boolean;
}

export function CampaignShareDialog({
	open,
	onOpenChange,
	campaignId,
	campaignName = "Digital Registration",
	initialFocusInvite = false,
}: CampaignShareDialogProps) {
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
	const { data: shareData, isLoading } = useRegistrationShareAccess(campaignId);
	const inviteMutation = useInviteCollaborator();
	const updateAccessMutation = useUpdateMemberAccess();
	const updateGeneralAccessMutation = useUpdateGeneralAccess();

	// Clean canonical URL without dirty search/filters
	const cleanDashboardUrl =
		typeof window !== "undefined"
			? `${window.location.origin}${window.location.pathname}`
			: "https://sanad.app/digital-registration";

	// Local form state
	const [inviteQuery, setInviteQuery] = useState("");
	const [selectedRole, setSelectedRole] = useState<"can_edit" | "can_view">("can_edit");
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [generalAccessLevel, setGeneralAccessLevel] = useState<"everyone_view" | "restricted">(
		shareData?.generalAccess?.level || "everyone_view",
	);
	const [qrUrl, setQrUrl] = useState<string | null>(null);
	const [showQr, setShowQr] = useState(false);

	// Synchronize generalAccessLevel when backend data loads
	useEffect(() => {
		if (shareData?.generalAccess?.level) {
			setGeneralAccessLevel(shareData.generalAccess.level);
		}
	}, [shareData?.generalAccess?.level]);

	useEffect(() => {
		if (open && typeof window !== "undefined") {
			QRCode.toDataURL(cleanDashboardUrl, {
				width: 480,
				margin: 1,
				color: {
					dark: "#0F172A",
					light: "#FFFFFF",
				},
			})
				.then(setQrUrl)
				.catch(() => {});
		}
	}, [open, cleanDashboardUrl]);

	// General access change handler (persisted to DB)
	const handleGeneralAccessChange = async (newLevel: "everyone_view" | "restricted") => {
		setGeneralAccessLevel(newLevel);
		try {
			await updateGeneralAccessMutation.mutateAsync({ level: newLevel, campaignId });
			toast.success("تم تحديث إعداد الوصول العام بنجاح!");
		} catch (err: any) {
			toast.error(err.message || "فشل تعديل إعداد الوصول العام");
			setGeneralAccessLevel(shareData?.generalAccess?.level || "everyone_view");
		}
	};

	// Download QR Code image
	const handleDownloadQr = () => {
		if (!qrUrl) return;
		const a = document.createElement("a");
		a.href = qrUrl;
		a.download = `sanad-digital-registration-qr.png`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		toast.success("QR Code downloaded successfully!");
	};

	// Check if native system share is supported
	const hasNativeShare =
		typeof navigator !== "undefined" && typeof navigator.share === "function";

	// Copy QR Image directly to clipboard (for desktop apps/chats)
	const handleCopyQrImage = async () => {
		if (!qrUrl) return;
		try {
			const res = await fetch(qrUrl);
			const blob = await res.blob();
			if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
				const item = new ClipboardItem({ "image/png": blob });
				await navigator.clipboard.write([item]);
				toast.success(
					"تم نسخ صورة الـ QR كصورة إلى الحافظة! يمكنك لصقها مباشرة في أي محادثة أو مستند.",
				);
				return;
			}
			await navigator.clipboard.writeText(cleanDashboardUrl);
			toast.success("تم نسخ الرابط إلى الحافظة!");
		} catch {
			await navigator.clipboard.writeText(cleanDashboardUrl);
			toast.success("تم نسخ الرابط إلى الحافظة!");
		}
	};

	// Share on WhatsApp Web / App
	const handleShareWhatsApp = () => {
		const text = encodeURIComponent(
			`رابط لوحة التسجيل الرقمي (${clinicName}):\n${cleanDashboardUrl}`,
		);
		window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
	};

	// Share via Email
	const handleShareEmail = () => {
		const subject = encodeURIComponent(`رابط لوحة التسجيل الرقمي - ${clinicName}`);
		const body = encodeURIComponent(
			`مرحباً،\n\nيمكنك الوصول إلى لوحة التسجيل الرقمي عبر الرابط التالي:\n${cleanDashboardUrl}\n\nتحياتنا،\n${clinicName}`,
		);
		window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
	};

	// Native system share fallback
	const handleNativeShare = async () => {
		if (typeof navigator !== "undefined" && navigator.share) {
			try {
				if (qrUrl && navigator.canShare) {
					const res = await fetch(qrUrl);
					const blob = await res.blob();
					const file = new File([blob], "sanad-digital-registration-qr.png", {
						type: "image/png",
					});
					if (navigator.canShare({ files: [file] })) {
						await navigator.share({
							title: `لوحة التسجيل الرقمي - ${clinicName}`,
							text: "Scan this QR code to access the registration board:",
							url: cleanDashboardUrl,
							files: [file],
						});
						return;
					}
				}
				await navigator.share({
					title: `لوحة التسجيل الرقمي - ${clinicName}`,
					text: "Access the digital registration board:",
					url: cleanDashboardUrl,
				});
			} catch (err: any) {
				if (err.name !== "AbortError") {
					await navigator.clipboard.writeText(cleanDashboardUrl);
					toast.success("تم نسخ الرابط إلى الحافظة!");
				}
			}
		} else {
			await navigator.clipboard.writeText(cleanDashboardUrl);
			toast.success("تم نسخ الرابط إلى الحافظة!");
		}
	};

	// Staff autocomplete candidates
	const { data: candidates = [] } = useStaffCandidates(inviteQuery);

	const filteredCandidates = useMemo(() => {
		if (!inviteQuery.trim()) return candidates.slice(0, 5);
		const q = inviteQuery.toLowerCase();
		return candidates.filter(
			(c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q),
		);
	}, [candidates, inviteQuery]);

	// Copy dashboard link handler
	const handleCopyLink = () => {
		navigator.clipboard.writeText(cleanDashboardUrl);
		toast.success("Link copied to clipboard!");
	};

	// Invite collaborator handler
	const handleInvite = async () => {
		const identifier = inviteQuery.trim();
		if (!identifier) {
			toast.error("Please enter a name or email");
			return;
		}

		try {
			await inviteMutation.mutateAsync({
				identifier,
				accessLevel: selectedRole,
				campaignId,
			});
			toast.success("Invite sent successfully!");
			setInviteQuery("");
			setShowSuggestions(false);
		} catch (err: any) {
			toast.error(err.message || "Failed to invite collaborator");
		}
	};

	// Update or remove member access handler
	const handleUpdateMember = async (
		memberId: string,
		level: "can_edit" | "can_view" | "remove",
	) => {
		try {
			await updateAccessMutation.mutateAsync({
				memberId,
				accessLevel: level,
			});
			if (level === "remove") {
				toast.success("Member removed");
			} else {
				toast.success("Access updated");
			}
		} catch (err: any) {
			toast.error(err.message || "Failed to update access");
		}
	};

	const clinicName = shareData?.clinicName || "Personal";
	const currentUser = shareData?.currentUser;
	const members = shareData?.members || [];
	const canManage = shareData?.canManage !== false;

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				showCloseButton={false}
				dir="ltr"
				className="!fixed !left-1/2 !right-auto !top-1/2 !-translate-x-1/2 rtl:!-translate-x-1/2 !-translate-y-1/2 w-[94vw] sm:max-w-[580px] md:max-w-[620px] p-6 sm:p-7 rounded-2xl gap-5 border border-gray-200 dark:border-zinc-800 shadow-2xl bg-white dark:bg-zinc-900 text-left font-sans"
			>
				{/* Header: Share and X on the exact same horizontal level */}
				<div className="flex items-center justify-between">
					<DialogTitle className="text-[17px] font-bold text-gray-900 dark:text-zinc-100 tracking-tight">
						Share
					</DialogTitle>
					<button
						type="button"
						onClick={() => onOpenChange(false)}
						className="text-gray-400 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer rounded-md p-1 -mr-1"
						aria-label="Close"
					>
						<IconX className="size-4" />
					</button>
				</div>

				{/* Invite Row */}
				{canManage ? (
					<div className="relative flex items-center gap-2">
						<div className="relative flex-1">
							<Input
								ref={inviteInputRef}
								value={inviteQuery}
								onChange={(e) => {
									setInviteQuery(e.target.value);
									setShowSuggestions(true);
								}}
								onFocus={() => setShowSuggestions(true)}
								placeholder="Add people by name or email"
								className="h-9 text-[13px] px-3 rounded-lg border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 focus-visible:ring-1 focus-visible:ring-blue-500 placeholder:text-gray-400"
							/>

							{/* Autocomplete dropdown for academy staff */}
							{showSuggestions && filteredCandidates.length > 0 && (
								<>
									<div
										className="fixed inset-0 z-40"
										onClick={() => setShowSuggestions(false)}
									/>
									<div className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl py-1.5 max-h-52 overflow-y-auto">
										<div className="px-3 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
											Suggested Staff
										</div>
										{filteredCandidates.map((c) => (
											<button
												key={c.id}
												type="button"
												className="w-full px-3 py-2 text-left flex items-center gap-2.5 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-xs"
												onClick={() => {
													setInviteQuery(c.email || c.name);
													setShowSuggestions(false);
												}}
											>
												<div className="size-7 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-semibold text-[11px] shrink-0">
													{getInitials(c.name)}
												</div>
												<div className="flex flex-col min-w-0">
													<span className="font-semibold text-gray-900 dark:text-zinc-100 truncate">
														{c.name}
													</span>
													<span className="text-[11px] text-gray-500 truncate">{c.email}</span>
												</div>
											</button>
										))}
									</div>
								</>
							)}
						</div>

						{/* Role Select: Can edit / Can view */}
						<DropdownMenu dir="ltr">
							<DropdownMenuTrigger asChild>
								<Button
									type="button"
									variant="outline"
									className="h-9 px-3 gap-1.5 text-[13px] font-normal border-gray-200 dark:border-zinc-700 rounded-lg shrink-0 text-gray-700 dark:text-zinc-200 bg-white dark:bg-zinc-800/80 cursor-pointer shadow-none"
								>
									<span>{selectedRole === "can_edit" ? "Can edit" : "Can view"}</span>
									<IconChevronDown className="size-3.5 text-gray-400" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="w-36 text-xs"
							>
								<DropdownMenuItem
									onClick={() => setSelectedRole("can_edit")}
									className="cursor-pointer justify-between"
								>
									<span>Can edit</span>
									{selectedRole === "can_edit" && (
										<IconCheck className="size-3.5 text-blue-600" />
									)}
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => setSelectedRole("can_view")}
									className="cursor-pointer justify-between"
								>
									<span>Can view</span>
									{selectedRole === "can_view" && (
										<IconCheck className="size-3.5 text-blue-600" />
									)}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						{/* Invite Button */}
						<Button
							type="button"
							disabled={inviteMutation.isPending || !inviteQuery.trim()}
							onClick={handleInvite}
							className="h-9 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-[13px] rounded-lg shrink-0 shadow-none cursor-pointer transition-colors"
						>
							{inviteMutation.isPending ? (
								<IconLoader2 className="size-4 animate-spin" />
							) : (
								"Invite"
							)}
						</Button>
					</div>
				) : (
					<div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/80 text-[12px] text-gray-500 dark:text-zinc-400">
						<IconLock className="size-3.5 text-gray-400 shrink-0" />
						<span>
							View-only access — only academy administrators can invite or manage members.
						</span>
					</div>
				)}

				{/* PEOPLE WITH ACCESS Section */}
				<div className="flex flex-col gap-2.5">
					<span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 select-none">
						PEOPLE WITH ACCESS
					</span>

					{/* Current User Row */}
					{currentUser && (
						<div className="flex items-center justify-between py-1">
							<div className="flex items-center gap-3 min-w-0">
								<div className="size-8 rounded-full bg-[#EDE9FE] text-[#6D28D9] dark:bg-[#4C1D95]/40 dark:text-[#C4B5FD] flex items-center justify-center font-semibold text-[12px] shrink-0 select-none">
									{getInitials(currentUser.name)}
								</div>
								<div className="flex flex-col min-w-0">
									<div className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-900 dark:text-zinc-100 truncate">
										<span>{currentUser.name}</span>
										<span className="text-gray-500 font-normal">(you)</span>
									</div>
									<div className="text-[12px] text-gray-500 truncate">
										{currentUser.email} · {currentUser.title || "Project lead"}
									</div>
								</div>
							</div>
							<span className="text-[13px] text-gray-500 font-normal shrink-0">
								Full access
							</span>
						</div>
					)}

					{/* Other Members */}
					{members.map((member, idx) => {
						const colorClass = AVATAR_COLORS[(idx + 1) % AVATAR_COLORS.length];
						return (
							<div
								key={member.id}
								className="flex items-center justify-between py-1"
							>
								<div className="flex items-center gap-3 min-w-0">
									<div
										className={cn(
											"size-8 rounded-full flex items-center justify-center font-semibold text-[12px] shrink-0 select-none",
											colorClass,
										)}
									>
										{getInitials(member.name)}
									</div>
									<div className="flex flex-col min-w-0">
										<div className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-900 dark:text-zinc-100 truncate">
											<span>{member.name}</span>
											{member.isPending && (
												<span className="text-[10px] bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 px-1.5 py-0.5 rounded font-medium">
													Pending
												</span>
											)}
										</div>
										<div className="text-[12px] text-gray-500 truncate">
											{member.email} · {member.title || "Collaborator"}
										</div>
									</div>
								</div>

								{/* Access Level Dropdown */}
								<DropdownMenu dir="ltr">
									<DropdownMenuTrigger asChild>
										<button
											type="button"
											className="flex items-center gap-1 text-[13px] text-gray-500 hover:text-gray-800 dark:hover:text-zinc-200 cursor-pointer transition-colors p-1 rounded"
										>
											<span>
												{member.accessLevel === "can_edit" ? "Can edit" : "Can view"}
											</span>
											<IconChevronDown className="size-3 text-gray-400" />
										</button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="end"
										className="w-36 text-xs"
									>
										<DropdownMenuItem
											onClick={() => handleUpdateMember(member.id, "can_edit")}
											className="cursor-pointer justify-between"
										>
											<span>Can edit</span>
											{member.accessLevel === "can_edit" && (
												<IconCheck className="size-3.5 text-blue-600" />
											)}
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => handleUpdateMember(member.id, "can_view")}
											className="cursor-pointer justify-between"
										>
											<span>Can view</span>
											{member.accessLevel === "can_view" && (
												<IconCheck className="size-3.5 text-blue-600" />
											)}
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={() => handleUpdateMember(member.id, "remove")}
											className="cursor-pointer text-destructive focus:text-destructive gap-1.5"
										>
											<IconTrash className="size-3.5" />
											<span>Remove access</span>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						);
					})}
				</div>

				{/* Divider between People with access and General access */}
				<div className="-mx-6 sm:-mx-7 border-b border-gray-200 dark:border-zinc-700" />

				{/* GENERAL ACCESS Section */}
				<div className="flex flex-col gap-2">
					<span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 select-none">
						GENERAL ACCESS
					</span>

					<div className="flex items-center justify-between py-1">
						<div className="flex items-center gap-3 min-w-0">
							{/* Building Icon Container */}
							<div className="size-9 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-500 shrink-0">
								<IconBuilding className="size-5 text-gray-600 dark:text-zinc-400" />
							</div>
							<div className="flex flex-col min-w-0 text-left">
								<DropdownMenu dir="ltr">
									<DropdownMenuTrigger asChild>
										<button
											type="button"
											className="flex items-center gap-1 text-[14px] font-semibold text-gray-900 dark:text-zinc-100 hover:text-blue-600 cursor-pointer text-left transition-colors"
										>
											<span>
												{generalAccessLevel === "everyone_view"
													? `Everyone at ${clinicName}`
													: "Restricted"}
											</span>
											<IconChevronDown className="size-3.5 text-gray-500" />
										</button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="start"
										className="w-56 text-xs"
									>
										<DropdownMenuItem
											onClick={() => handleGeneralAccessChange("everyone_view")}
											className="cursor-pointer justify-between py-2"
										>
											<div className="flex flex-col text-left">
												<span className="font-semibold text-gray-900 dark:text-zinc-100">{`Everyone at ${clinicName}`}</span>
												<span className="text-[11px] text-gray-500">
													Anyone in the workspace can view and comment
												</span>
											</div>
											{generalAccessLevel === "everyone_view" && (
												<IconCheck className="size-3.5 text-blue-600" />
											)}
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => handleGeneralAccessChange("restricted")}
											className="cursor-pointer justify-between py-2"
										>
											<div className="flex flex-col text-left">
												<span className="font-semibold text-gray-900 dark:text-zinc-100">
													Restricted
												</span>
												<span className="text-[11px] text-gray-500">
													Only people with access can open
												</span>
											</div>
											{generalAccessLevel === "restricted" && (
												<IconCheck className="size-3.5 text-blue-600" />
											)}
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>

								<span className="text-[12px] text-gray-500">
									{generalAccessLevel === "everyone_view"
										? "Anyone in the workspace can view and comment."
										: "Only people added can access."}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Divider between General access and Footer */}
				<div className="-mx-6 sm:-mx-7 border-b border-gray-200 dark:border-zinc-700" />

				{/* Footer */}
				<div className="flex items-center justify-between pt-0.5">
					<div className="flex items-center gap-2">
						{/* Copy link button */}
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={handleCopyLink}
							className="h-9 px-3.5 gap-2 text-[13px] font-medium rounded-lg border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-200 cursor-pointer shadow-none"
						>
							<IconLink className="size-4 text-gray-600 dark:text-zinc-400" />
							<span>Copy link</span>
						</Button>

						{/* QR Code button */}
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => setShowQr(true)}
							className="h-9 px-3.5 gap-2 text-[13px] font-medium rounded-lg border-gray-200 dark:border-zinc-700 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 text-[#6366F1] dark:text-[#818CF8] cursor-pointer shadow-none"
						>
							<IconQrcode className="size-4 text-[#6366F1] dark:text-[#818CF8]" />
							<span className="font-semibold">QR Code</span>
						</Button>
					</div>

					<Button
						type="button"
						size="sm"
						onClick={() => onOpenChange(false)}
						className="h-9 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-[13px] rounded-lg cursor-pointer shadow-none transition-colors"
					>
						Done
					</Button>
				</div>

				{/* Centered QR Code Overlay (Centered, Download & Share capable) */}
				{showQr && (
					<div className="absolute inset-0 z-50 bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-7 flex flex-col justify-between animate-in fade-in-0 duration-150">
						{/* Header: Title and X on the exact same level */}
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<button
									type="button"
									onClick={() => setShowQr(false)}
									className="p-1 text-gray-500 hover:text-gray-900 dark:hover:text-zinc-100 rounded-md transition-colors cursor-pointer"
									aria-label="Back"
								>
									<IconArrowLeft className="size-4" />
								</button>
								<DialogTitle className="text-[17px] font-bold text-gray-900 dark:text-zinc-100 tracking-tight">
									QR Code
								</DialogTitle>
							</div>
							<button
								type="button"
								onClick={() => {
									setShowQr(false);
									onOpenChange(false);
								}}
								className="text-gray-400 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer rounded-md p-1 -mr-1"
								aria-label="Close"
							>
								<IconX className="size-4" />
							</button>
						</div>

						{/* Dead-Center QR Presentation */}
						<div className="flex flex-col items-center justify-center my-auto py-2 text-center">
							<div className="p-3.5 rounded-2xl bg-white border border-gray-100 shadow-lg">
								{qrUrl ? (
									<img
										src={qrUrl}
										alt="Digital Registration QR Code"
										className="size-44 object-contain rounded-lg"
									/>
								) : (
									<div className="size-44 flex items-center justify-center">
										<IconLoader2 className="size-8 animate-spin text-muted-foreground" />
									</div>
								)}
							</div>
							<h3 className="mt-4 text-[15px] font-bold text-gray-900 dark:text-zinc-100">
								Scan to Open Digital Registration
							</h3>
							<p className="mt-1 text-xs text-gray-500 max-w-[300px] leading-relaxed">
								Scan this QR code with any mobile device camera to open this board directly.
							</p>
						</div>

						{/* Horizontal divider */}
						<div className="-mx-6 sm:-mx-7 border-b border-gray-200 dark:border-zinc-700" />

						{/* Footer Actions: Download, Share, and Back */}
						<div className="flex items-center justify-between pt-0.5">
							<div className="flex items-center gap-2">
								{/* Download Button */}
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={handleDownloadQr}
									className="h-9 px-3.5 gap-2 text-[13px] font-medium rounded-lg border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-200 cursor-pointer shadow-none"
								>
									<IconDownload className="size-4 text-gray-600 dark:text-zinc-400" />
									<span>Download</span>
								</Button>

								{/* Share Dropdown Button (Optimized for Desktop & Mobile) */}
								<DropdownMenu dir="ltr">
									<DropdownMenuTrigger asChild>
										<Button
											type="button"
											variant="outline"
											size="sm"
											className="h-9 px-3.5 gap-1.5 text-[13px] font-medium rounded-lg border-gray-200 dark:border-zinc-700 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 text-[#6366F1] dark:text-[#818CF8] cursor-pointer shadow-none"
										>
											<IconShare className="size-4 text-[#6366F1] dark:text-[#818CF8]" />
											<span className="font-semibold">Share</span>
											<IconChevronDown className="size-3.5 opacity-70" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="start"
										className="w-60 text-xs p-1.5 shadow-xl"
									>
										<DropdownMenuItem
											onClick={handleCopyQrImage}
											className="cursor-pointer gap-2 py-2"
										>
											<IconPhoto className="size-4 text-purple-600 shrink-0" />
											<div className="flex flex-col text-left">
												<span className="font-semibold text-gray-900 dark:text-zinc-100">
													Copy QR image
												</span>
												<span className="text-[10.5px] text-gray-500">
													Paste image directly into chats
												</span>
											</div>
										</DropdownMenuItem>

										<DropdownMenuItem
											onClick={handleCopyLink}
											className="cursor-pointer gap-2 py-2"
										>
											<IconLink className="size-4 text-blue-600 shrink-0" />
											<div className="flex flex-col text-left">
												<span className="font-semibold text-gray-900 dark:text-zinc-100">
													Copy link
												</span>
												<span className="text-[10.5px] text-gray-500">
													Clean direct dashboard link
												</span>
											</div>
										</DropdownMenuItem>

										<DropdownMenuSeparator />

										<DropdownMenuItem
											onClick={handleShareWhatsApp}
											className="cursor-pointer gap-2 py-2"
										>
											<IconBrandWhatsapp className="size-4 text-emerald-600 shrink-0" />
											<span className="font-medium text-gray-800 dark:text-zinc-200">
												Share on WhatsApp
											</span>
										</DropdownMenuItem>

										<DropdownMenuItem
											onClick={handleShareEmail}
											className="cursor-pointer gap-2 py-2"
										>
											<IconMail className="size-4 text-amber-600 shrink-0" />
											<span className="font-medium text-gray-800 dark:text-zinc-200">
												Share via Email
											</span>
										</DropdownMenuItem>

										{hasNativeShare && (
											<>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													onClick={handleNativeShare}
													className="cursor-pointer gap-2 py-2"
												>
													<IconShare className="size-4 text-indigo-600 shrink-0" />
													<span className="font-medium text-gray-800 dark:text-zinc-200">
														More options (System share)...
													</span>
												</DropdownMenuItem>
											</>
										)}
									</DropdownMenuContent>
								</DropdownMenu>
							</div>

							<Button
								type="button"
								size="sm"
								onClick={() => setShowQr(false)}
								className="h-9 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-[13px] rounded-lg cursor-pointer shadow-none transition-colors"
							>
								Back
							</Button>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
