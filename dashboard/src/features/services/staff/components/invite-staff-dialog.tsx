import { IconCheck, IconChevronLeft, IconCopy, IconRefresh } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useEnsureStaffInvite } from "@/features/services/staff/hooks/use-ensure-staff-invite";
import type { StaffResponse } from "@/server/staff/staff.type";

const PREFIX_LABELS: Record<string, string> = {
	MR: "السيد",
	MRS: "السيدة",
	MS: "الآنسة",
	DR: "د.",
	PROF: "أ.د.",
};

function StaffAvatar({ name }: { name: string }) {
	const initials = name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
	return (
		<div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary primarytext-xs font-semibold">
			{initials}
		</div>
	);
}

function truncateLink(link: string) {
	if (link.length <= 48) return link;
	const front = link.slice(0, 38);
	const back = link.slice(-6);
	return `${front}…${back}`;
}

interface InviteStaffDialogProps {
	staff: StaffResponse | null;
	onClose: () => void;
}

export function InviteStaffDialog({ staff, onClose }: InviteStaffDialogProps) {
	const [copied, setCopied] = useState(false);
	const { data, isLoading, isError, error, refetch, isRefetching } = useEnsureStaffInvite(
		staff?.id,
	);

	const errStatus = (error as { status?: number } | null)?.status;
	const isAlreadyActive = errStatus === 409;
	const link = data?.link;

	const handleCopy = async () => {
		if (!link) return;
		await navigator.clipboard.writeText(link);
		setCopied(true);
		toast.success("تم نسخ الرابط");
		setTimeout(() => setCopied(false), 1500);
	};

	const salutation = (() => {
		if (!staff) return "";
		const prefix = staff.prefix ? PREFIX_LABELS[staff.prefix] : "";
		return prefix ? `${prefix} ${staff.name}` : staff.name;
	})();

	return (
		<Dialog
			open={!!staff}
			onOpenChange={(open) => !open && onClose()}
		>
			<DialogContent
				className="sm:max-w-xl! p-0 gap-0"
				dir="rtl"
			>
				<DialogHeader className="px-4 py-3 border-b flex-row items-center gap-2 space-y-0">
					<DialogTitle className="text-primary font-semibold text-sm">
						أرسل دعوة إلى {staff?.code}
					</DialogTitle>
					{staff && (
						<>
							<IconChevronLeft className="size-3.5 text-muted-foreground" />
							<div className="flex items-center gap-1.5">
								<StaffAvatar name={staff.name} />
								<span className="text-sm font-medium">{staff.name}</span>
							</div>
						</>
					)}
				</DialogHeader>

				<DialogDescription className="sr-only">إرسال دعوة تسجيل للموظف</DialogDescription>

				<div className="px-5 py-5 flex flex-col gap-4">
					{isAlreadyActive ? (
						<div className="rounded-lg border border-emerald-400/40 bg-emerald-50/60 dark:bg-emerald-950/20 p-4 text-sm text-foreground leading-relaxed">
							هذا الموظف قد فعّل حسابه بالفعل ولا يحتاج إلى دعوة جديدة.
						</div>
					) : isError ? (
						<div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 flex flex-col gap-3">
							<p className="text-sm text-foreground">تعذّر إنشاء رابط الدعوة</p>
							<Button
								variant="outline"
								size="sm"
								onClick={() => refetch()}
								disabled={isRefetching}
								className="self-start gap-2"
							>
								<IconRefresh className="size-3.5" />
								إعادة المحاولة
							</Button>
						</div>
					) : (
						<>
							<p className="text-sm text-foreground leading-relaxed">
								<span className="text-muted-foreground">مرحباً</span>{" "}
								<span className="font-medium">{salutation}.</span>
								<br />
								تم تسجيلك في نظام إيليت فيت لمتابعة مرضاك والتواصل مع العملاء. انقر على الرابط
								لاستكمال بيانات حسابك، وتفعيل تسجيل الدخول.
							</p>

							<div className="rounded-lg border bg-muted/40 px-3 py-2 flex items-center gap-2">
								{isLoading || !link ? (
									<Skeleton className="h-5 flex-1" />
								) : (
									<span
										className="flex-1 text-sm text-foreground tabular-nums truncate"
										dir="ltr"
									>
										{truncateLink(link)}
									</span>
								)}
								<Button
									variant="ghost"
									size="icon"
									className="size-7"
									onClick={handleCopy}
									disabled={!link}
									aria-label="نسخ الرابط"
								>
									{copied ? (
										<IconCheck className="size-3.5 text-emerald-600" />
									) : (
										<IconCopy className="size-3.5" />
									)}
								</Button>
							</div>
						</>
					)}
				</div>

				<div className="px-5 py-4 border-t flex gap-3 items-center justify-end">
					{isAlreadyActive ? (
						<Button
							variant="outline"
							onClick={onClose}
						>
							إغلاق
						</Button>
					) : (
						<>
							<label
								htmlFor="invite-channel-whatsapp"
								className="flex items-center gap-2 select-none opacity-60"
							>
								<span className="text-sm text-muted-foreground">إرسال عبر الواتساب</span>
								<Switch
									id="invite-channel-whatsapp"
									checked={false}
									disabled
								/>
							</label>
							<label
								htmlFor="invite-channel-email"
								className="flex items-center gap-2 select-none opacity-60"
							>
								<span className="text-sm text-muted-foreground">
									إرسال عبر البريد الإلكتروني
								</span>
								<Switch
									id="invite-channel-email"
									checked={false}
									disabled
								/>
							</label>
							<Button
								disabled
								className="gap-2 flex"
							>
								<span>أرسل الدعوة</span>
								<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-white/30 bg-white/10 px-1.5 font-mono text-[10px] opacity-60">
									<span>⌘</span>
									<span>↵</span>
								</kbd>
							</Button>
						</>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
