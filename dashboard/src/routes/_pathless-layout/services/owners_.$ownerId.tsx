import {
	IconAlertCircle,
	IconAlertTriangle,
	IconBan,
	IconBrandWhatsapp,
	IconCalendarCheck,
	IconChevronLeft,
	IconCoins,
	IconCopy,
	IconCreditCard,
	IconDeviceMobile,
	IconDots,
	IconEdit,
	IconExternalLink,
	IconFileText,
	IconHeartHandshake,
	IconMail,
	IconMapPin,
	IconPhone,
	IconPhoneCall,
	IconPlus,
	IconSchool,
	IconShieldCheck,
	IconTrash,
	IconUser,
	IconUserCheck,
	IconUsers,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { InitialsAvatar } from "@/components/common/initials-avatar";
import { Spinner } from "@/components/common/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OwnerMembershipBadge } from "@/features/accounting/memberships/components/owner-membership-badge";
import { formatAmount } from "@/features/accounting/utils/format-amount";
import { OwnerPointsChip } from "@/features/loyalty/components/owner-points-chip";
import { useOwnerLoyaltySummary } from "@/features/loyalty/hooks/use-loyalty-ledger";
import { AddPatientDialog } from "@/features/services/owners/components/add-patient-dialog";
import { DeleteOwnerDialog } from "@/features/services/owners/components/delete-owner-dialog";
import { DisableOwnerDialog } from "@/features/services/owners/components/disable-owner-dialog";
import { OwnerSheet } from "@/features/services/owners/components/owner-sheet";
import { PortalPasswordDialog } from "@/features/services/owners/components/portal-password-dialog";
import { useOwner } from "@/features/services/owners/hooks/use-owner";
import { usePatients } from "@/features/services/patients/hooks/use-patients";
import { getSession } from "@/functions/get-session";
import { usePageHeaderTakeover } from "@/hooks/use-page-header-takeover";
import { api } from "@/lib/api";
import { PERMISSIONS } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import type { OwnerRelationship, OwnerResponse } from "@/server/owners/owners.type";

export const Route = createFileRoute("/_pathless-layout/services/owners_/$ownerId")({
	component: OwnerDetailPage,
	beforeLoad: async () => {
		const { session } = await getSession();
		if (session?.session?.role === "MEMBER") {
			let perms: string[] = [];
			try {
				perms = JSON.parse(session.session.permissions ?? "[]");
			} catch {
				perms = [];
			}
			const canView =
				perms.includes(PERMISSIONS.PATIENTS_OWNERS_VIEW_LIMITED) ||
				perms.includes(PERMISSIONS.PATIENTS_OWNERS_VIEW_FULL);
			if (!canView) throw redirect({ to: "/dashboard" });
		}
	},
});

function formatRelationship(rel?: string | null): string {
	if (!rel) return "ولي أمر";
	const u = rel.toUpperCase().trim();
	if (u === "FATHER" || rel === "أب") return "الأب";
	if (u === "MOTHER" || rel === "أم") return "الأم";
	if (u === "GUARDIAN" || rel.includes("وصي") || rel.includes("كفيل")) return "وصي / كفيل";
	if (u === "DELEGATE" || rel === "مفوض") return "مفوض";
	if (u === "BROTHER" || rel === "أخ") return "الأخ";
	if (u === "SISTER" || rel === "أخت") return "الأخت";
	if (u === "GRANDFATHER" || rel === "جد") return "الجد";
	if (u === "GRANDMOTHER" || rel === "جدة") return "الجدة";
	if (u === "UNCLE" || rel === "عم" || rel === "خال") return "العم / الخال";
	if (u === "EMERGENCY") return "جهة اتصال للطوارئ";
	return rel;
}

function InfoField({
	label,
	icon,
	children,
	action,
}: {
	label: string;
	icon: React.ReactNode;
	children: React.ReactNode;
	action?: React.ReactNode;
}) {
	return (
		<div className="flex flex-col justify-between gap-1.5 rounded-xl border border-border/70 bg-card p-3.5 shadow-2xs">
			<div className="flex items-center justify-between gap-2 text-muted-foreground">
				<div className="flex items-center gap-1.5">
					<span className="size-3.5 shrink-0 flex items-center justify-center text-muted-foreground/80">{icon}</span>
					<p className="text-xs font-medium">{label}</p>
				</div>
				{action && <div className="shrink-0">{action}</div>}
			</div>
			<div className="text-sm font-semibold text-foreground pt-0.5">{children}</div>
		</div>
	);
}

function OwnerDetailPage() {
	const { ownerId } = Route.useParams();
	const navigate = useNavigate();
	const { owner, isLoading, refetch } = useOwner(ownerId);
	const { patients: allPatients, refetch: refetchPatients } = usePatients();

	// الاستعلام عن الرصيد المالي المفتوح لولي الأمر
	const { data: balanceData } = useQuery({
		queryKey: ["accounting", "party-open-balance", "Owner", ownerId ?? ""],
		enabled: Boolean(ownerId),
		staleTime: 1000 * 15,
		retry: false,
		queryFn: async () => {
			const { data, error } = await api.accounting
				.parties({ partyType: "Owner" })({ partyId: ownerId as string })
				["open-balance"].get();
			if (error) return null;
			return data;
		},
	});

	// الاستعلام عن نقاط الولاء
	const { summary: loyaltySummary } = useOwnerLoyaltySummary(ownerId);

	const [editingOwner, setEditingOwner] = useState<OwnerResponse | null>(null);
	const [disablingOwner, setDisablingOwner] = useState<OwnerResponse | null>(null);
	const [deletingOwner, setDeletingOwner] = useState<OwnerResponse | null>(null);
	const [portalOwner, setPortalOwner] = useState<OwnerResponse | null>(null);
	const [addPatientOpen, setAddPatientOpen] = useState(false);

	// فتحة الهيدر العلوي الموحد
	const setTitleSuppressed = usePageHeaderTakeover((state) => state.setTitleSuppressed);
	const [slot, setSlot] = useState<HTMLElement | null>(null);

	useEffect(() => {
		setSlot(document.getElementById("page-header-slot"));
	}, []);

	useEffect(() => {
		setTitleSuppressed(true);
		return () => setTitleSuppressed(false);
	}, [setTitleSuppressed]);

	const copyText = (text: string, label: string) => {
		if (!text) return;
		navigator.clipboard.writeText(text);
		toast.success(`تم نسخ ${label}`);
	};

	// الطلاب المرتبطين بولي الأمر
	const linkedPatients = useMemo(() => {
		if (!owner) return [];
		return allPatients.filter((p) => {
			if (p.owner?.id === owner.id) return true;
			if (p.guardians?.some((g) => g.owner?.id === owner.id)) return true;
			if (owner.patients?.some((op) => op.id === p.id)) return true;
			return false;
		});
	}, [allPatients, owner]);

	if (isLoading) {
		return (
			<div className="flex flex-1 items-center justify-center min-h-[400px]">
				<Spinner />
			</div>
		);
	}

	if (!owner) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center" dir="rtl">
				<IconAlertTriangle className="size-10 text-amber-500" />
				<h2 className="text-lg font-bold">لم يتم العثور على وليّ الأمر</h2>
				<p className="text-sm text-muted-foreground">وليّ الأمر المطلوب غير موجود أو تم حذفه من النظام.</p>
				<Button asChild variant="outline" className="mt-2">
					<Link to="/services/owners">العودة لقائمة أولياء الأمور</Link>
				</Button>
			</div>
		);
	}

	const cleanPhone = (owner.phone || "").replace(/\D/g, "");
	const fullAddress =
		owner.address ||
		[owner.city, owner.country].filter(Boolean).join("، ") ||
		"غير مسجل";

	// جهة اتصال الطوارئ لولي الأمر مع دعم البيانات السابقة للطلاب كخيار احتياطي
	const emergencyContactName = owner.emergencyContactName || linkedPatients.find((p) => p.emergencyContactName)?.emergencyContactName;
	const emergencyContactPhone = owner.emergencyContactPhone || linkedPatients.find((p) => p.emergencyContactPhone)?.emergencyContactPhone;

	const headerContent = (
		<div className="flex items-center gap-2" dir="rtl">
			<Link
				to="/services/owners"
				className="whitespace-nowrap text-xs font-semibold text-foreground hover:underline"
			>
				أولياء الأمور
			</Link>
			<IconChevronLeft className="size-3 shrink-0 text-muted-foreground ltr:rotate-180" />
			<span className="whitespace-nowrap text-xs font-bold text-foreground">
				{owner.name}
			</span>

			<span className="h-4 w-px bg-border shrink-0" />

			{/* أزرار الإجراءات في الهيدر */}
			<div className="flex items-center gap-1.5">
				{/* <Button
					size="sm"
					variant="outline"
					className="h-7 text-xs gap-1.5"
					onClick={() => setEditingOwner(owner)}
				>
					<IconEdit className="size-3.5" />
					<span>تعديل</span>
				</Button> */}

				<DropdownMenu dir="rtl">
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="size-7 text-muted-foreground hover:text-foreground"
						>
							<IconDots className="size-3.5" />
						</Button>
					</DropdownMenuTrigger>
					
					<DropdownMenuContent align="start">
						<DropdownMenuItem
							className="gap-2 text-xs"
							onSelect={() => setPortalOwner(owner)}
						>
							<IconDeviceMobile className="size-3.5" />
							كلمة مرور التطبيق
						</DropdownMenuItem>
						<DropdownMenuItem
							className="gap-2 text-xs"
							onSelect={() => setDisablingOwner(owner)}
						>
							<IconBan className="size-3.5" />
							{owner.active ? "تعطيل الحساب" : "تفعيل الحساب"}
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="gap-2 text-xs text-destructive"
							onSelect={() => setDeletingOwner(owner)}
						>
							<IconTrash className="size-3.5" />
							حذف وليّ الأمر
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);

	return (
		<div className="flex flex-1 flex-col overflow-y-auto p-4 lg:p-6 gap-5 bg-background" dir="rtl">
			{slot && createPortal(headerContent, slot)}

			{/* ── بطاقة هوية ولي الأمر والترويسة ── */}
			<div className="rounded-2xl border border-border/80 bg-gradient-to-b from-card to-card/70 p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 relative">
				<div className="flex items-start sm:items-center gap-4 min-w-0">
					<div className="relative shrink-0">
						<InitialsAvatar
							name={owner.name}
							className="size-16 rounded-2xl bg-primary text-primary-foreground font-bold text-xl shadow-xs ring-4 ring-primary/10"
						/>
						<span
							className={cn(
								"absolute -bottom-1 -left-1 size-4 rounded-full border-2 border-card",
								owner.active ? "bg-emerald-500" : "bg-muted-foreground/50",
							)}
							title={owner.active ? "نشط" : "غير نشط"}
						/>
					</div>

					<div className="flex flex-col gap-2 min-w-0">
						<div className="flex items-center gap-2 flex-wrap">
							<h1 className="font-bold text-xl text-foreground tracking-tight">
								{owner.name}
							</h1>
							<span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-muted text-muted-foreground font-semibold">
								{owner.code}
							</span>
							<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
								{formatRelationship(owner.relationship)}
							</span>
							<Badge
								variant={owner.active ? "secondary" : "outline"}
								className={cn(
									"text-[11px] font-semibold",
									owner.active
										? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
										: "text-muted-foreground",
								)}
							>
								{owner.active ? "نشط" : "غير نشط"}
							</Badge>
						</div>

						<div className="text-xs text-muted-foreground flex items-center gap-3 flex-wrap">
							<span className="flex items-center gap-1.5">
								<IconCalendarCheck className="size-3.5 text-muted-foreground/80 shrink-0" />
								<span>تاريخ التسجيل:</span>
								<span className="font-medium text-foreground">
									{owner.createdAt
										? new Date(owner.createdAt).toLocaleDateString("ar-EG", {
												year: "numeric",
												month: "long",
												day: "numeric",
											})
										: "—"}
								</span>
							</span>
							<span className="text-border/80">•</span>
							<span className="flex items-center gap-1.5">
								<IconSchool className="size-3.5 text-primary/80 shrink-0" />
								<span>عدد الطلاب المسجلين:</span>
								<span className="font-semibold text-primary">
									{linkedPatients.length} طالب
								</span>
							</span>
							{owner.phone && (
								<>
									<span className="text-border/80">•</span>
									<span className="flex items-center gap-1.5 font-mono" dir="ltr">
										<IconPhone className="size-3 text-muted-foreground/80 shrink-0" />
										<span>{owner.phone}</span>
									</span>
								</>
							)}
						</div>
					</div>
				</div>

				{/* الإجراءات السريعة */}
				<div className="flex items-center gap-2 shrink-0 self-start md:self-center flex-wrap">
					{owner.phone && (
						<>
							<Button
								size="sm"
								variant="outline"
								className="h-9 gap-1.5 text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950/30 font-medium"
								onClick={() => window.open(`https://wa.me/${cleanPhone}`, "_blank")}
							>
								<IconBrandWhatsapp className="size-4" />
								<span>واتساب</span>
							</Button>
							<Button
								size="sm"
								variant="outline"
								className="h-9 gap-1.5 text-xs font-medium"
								onClick={() => window.open(`tel:${owner.phone}`, "_self")}
							>
								<IconPhone className="size-4 text-primary" />
								<span>اتصال</span>
							</Button>
						</>
					)}
					<Button
						size="sm"
						variant="default"
						className="h-9 gap-1.5 text-xs font-medium"
						onClick={() => setEditingOwner(owner)}
					>
						<IconEdit className="size-4" />
						<span>تعديل البيانات</span>
					</Button>
				</div>
			</div>

			{/* ── شريط الرصيد والمالية والنقاط ── */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
				{/* 1. الطلاب التابعين */}
				<div className="rounded-2xl border border-border/80 bg-card p-4 md:p-5 flex items-center justify-between shadow-2xs hover:border-primary/40 transition-all">
					<div className="flex items-center gap-3.5">
						<div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
							<IconUsers className="size-6" />
						</div>
						<div className="flex flex-col">
							<span className="text-xs text-muted-foreground font-medium">الطلاب التابعين</span>
							<div className="flex items-baseline gap-1.5 mt-0.5">
								<span className="text-xl font-bold text-foreground font-mono">{linkedPatients.length}</span>
								<span className="text-xs text-muted-foreground font-medium">طالب مسجل</span>
							</div>
						</div>
					</div>
					<Button
						size="sm"
						variant="outline"
						className="h-8 text-xs gap-1.5 font-medium border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40"
						onClick={() => setAddPatientOpen(true)}
					>
						<IconPlus className="size-3.5" />
						<span>إضافة طالب</span>
					</Button>
				</div>

				{/* 2. الرصيد المالي الحالي */}
				<div className="rounded-2xl border border-border/80 bg-card p-4 md:p-5 flex items-center justify-between shadow-2xs hover:border-primary/40 transition-all">
					<div className="flex items-center gap-3.5 min-w-0">
						<div
							className={cn(
								"size-12 rounded-xl flex items-center justify-center shrink-0",
								balanceData && Number(balanceData.outstanding) > 0
									? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
									: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
							)}
						>
							<IconCreditCard className="size-6" />
						</div>
						<div className="flex flex-col min-w-0">
							<span className="text-xs text-muted-foreground font-medium">الرصيد المالي الحالي</span>
							<div className="flex items-center gap-2 mt-0.5 flex-wrap">
								{balanceData && Number(balanceData.outstanding) > 0 ? (
									<>
										<span className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono tabular-nums">
											{formatAmount(balanceData.outstanding)}
										</span>
										<span className="text-xs text-muted-foreground font-medium">ج.م</span>
										<Badge
											variant="outline"
											className="text-[10px] bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 font-medium"
										>
											مستحق السداد
										</Badge>
									</>
								) : (
									<>
										<span className="text-xl font-bold text-foreground font-mono tabular-nums">0.00</span>
										<span className="text-xs text-muted-foreground font-medium">ج.م</span>
										<Badge
											variant="outline"
											className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 font-medium"
										>
											خالٍ من المديونية
										</Badge>
									</>
								)}
							</div>
						</div>
					</div>
					<OwnerMembershipBadge ownerId={owner.id} />
				</div>

				{/* 3. نقاط الولاء وحساب التطبيق */}
				<div className="rounded-2xl border border-border/80 bg-card p-4 md:p-5 flex items-center justify-between shadow-2xs hover:border-primary/40 transition-all">
					<div className="flex items-center gap-3.5">
						<div className="size-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
							<IconCoins className="size-6" />
						</div>
						<div className="flex flex-col">
							<span className="text-xs text-muted-foreground font-medium">نقاط الولاء والمكافآت</span>
							<div className="flex items-baseline gap-1.5 mt-0.5">
								<span className="text-xl font-bold text-foreground font-mono">
									{loyaltySummary?.balance ?? 0}
								</span>
								<span className="text-xs text-muted-foreground font-medium">نقطة</span>
								<OwnerPointsChip ownerId={owner.id} />
							</div>
						</div>
					</div>
					<Button
						size="sm"
						variant="outline"
						className="h-8 text-xs gap-1.5 font-medium"
						onClick={() => setPortalOwner(owner)}
					>
						<IconDeviceMobile className="size-3.5 text-muted-foreground" />
						<span>حساب التطبيق</span>
					</Button>
				</div>
			</div>

			{/* ── شبكة البيانات والتفاصيل الرئيسية ── */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
				{/* العمود الجانبي: بيانات الاتصال والتواصل + الطوارئ + الحساب */}
				<div className="lg:col-span-5 flex flex-col gap-4">
					{/* بيانات التواصل */}
					<Card className="border-border/70 shadow-2xs">
						<CardHeader className="pb-3 pt-4 px-4">
							<CardTitle className="text-sm font-bold flex items-center gap-2">
								<IconPhone className="size-4 text-emerald-600" />
								<span>بيانات الاتصال والتواصل</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="px-4 pb-4 flex flex-col gap-3">
							<InfoField
								label="رقم الهاتف"
								icon={<IconPhone className="size-3.5" />}
								action={
									owner.phone ? (
										<button
											type="button"
											onClick={() => copyText(owner.phone!, "رقم الهاتف")}
											className="text-muted-foreground hover:text-foreground text-xs flex items-center gap-1 cursor-pointer"
										>
											<IconCopy className="size-3" />
											<span>نسخ</span>
										</button>
									) : undefined
								}
							>
								{owner.phone ? (
									<a
										href={`tel:${owner.phone}`}
										className="font-mono tabular-nums text-xs font-bold text-primary hover:underline"
										dir="ltr"
									>
										{owner.phone}
									</a>
								) : (
									<span className="text-muted-foreground text-xs font-normal">غير مسجل</span>
								)}
							</InfoField>

							<InfoField
								label="البريد الإلكتروني"
								icon={<IconMail className="size-3.5" />}
								action={
									owner.email ? (
										<button
											type="button"
											onClick={() => copyText(owner.email!, "البريد الإلكتروني")}
											className="text-muted-foreground hover:text-foreground text-xs flex items-center gap-1 cursor-pointer"
										>
											<IconCopy className="size-3" />
											<span>نسخ</span>
										</button>
									) : undefined
								}
							>
								{owner.email ? (
									<a
										href={`mailto:${owner.email}`}
										className="text-xs font-medium text-primary hover:underline truncate block"
										dir="ltr"
										title={owner.email}
									>
										{owner.email}
									</a>
								) : (
									<span className="text-muted-foreground text-xs font-normal">غير مسجل</span>
								)}
							</InfoField>

							<InfoField
								label="العنوان ومكان الإقامة"
								icon={<IconMapPin className="size-3.5" />}
							>
								<span className="text-xs font-medium truncate block" title={fullAddress}>
									{fullAddress}
								</span>
							</InfoField>

							<InfoField
								label="الجنس"
								icon={<IconUser className="size-3.5" />}
							>
								<span className="text-xs font-medium">
									{owner.gender === "FEMALE" ? "أنثى" : owner.gender === "MALE" ? "ذكر" : "غير محدد"}
								</span>
							</InfoField>
						</CardContent>
					</Card>

					{/* جهة الاتصال في حالات الطوارئ */}
					<Card className="border-border/70 shadow-2xs">
						<CardHeader className="pb-3 pt-4 px-4 flex flex-row items-center justify-between">
							<CardTitle className="text-sm font-bold flex items-center gap-2">
								<IconHeartHandshake className="size-4 text-rose-600" />
								<span>جهة الاتصال في حالات الطوارئ</span>
							</CardTitle>
							<Button
								size="sm"
								variant="ghost"
								className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 gap-1 font-medium"
								onClick={() => setEditingOwner(owner)}
							>
								<IconEdit className="size-3" />
								<span>تعديل</span>
							</Button>
						</CardHeader>
						<CardContent className="px-4 pb-4">
							{emergencyContactName || emergencyContactPhone ? (
								<div className="flex flex-col gap-3">
									<InfoField
										label="اسم جهة الطوارئ"
										icon={<IconHeartHandshake className="size-3.5" />}
									>
										<span className="text-xs font-semibold">
											{emergencyContactName || "غير محدد"}
										</span>
									</InfoField>

									<InfoField
										label="رقم هاتف الطوارئ"
										icon={<IconPhoneCall className="size-3.5" />}
										action={
											emergencyContactPhone ? (
												<button
													type="button"
													onClick={() => copyText(emergencyContactPhone, "رقم هاتف الطوارئ")}
													className="text-muted-foreground hover:text-foreground text-xs flex items-center gap-1 cursor-pointer"
												>
													<IconCopy className="size-3" />
													<span>نسخ</span>
												</button>
											) : undefined
										}
									>
										{emergencyContactPhone ? (
											<a
												href={`tel:${emergencyContactPhone}`}
												className="font-mono tabular-nums text-xs font-bold text-rose-600 hover:underline"
												dir="ltr"
											>
												{emergencyContactPhone}
											</a>
										) : (
											<span className="text-muted-foreground text-xs font-normal">غير مسجل</span>
										)}
									</InfoField>
								</div>
							) : (
								<div className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground bg-muted/10 flex flex-col items-center gap-2">
									<span>لا توجد جهة اتصال بديلة للطوارئ مسجلة لوليّ الأمر</span>
									<Button
										size="sm"
										variant="outline"
										className="h-7 text-xs border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800"
										onClick={() => setEditingOwner(owner)}
									>
										+ إضافة جهة طوارئ
									</Button>
								</div>
							)}
						</CardContent>
					</Card>

					{/* ملاحظات ولي الأمر */}
					{owner.notes && (
						<Card className="border-border/70 shadow-2xs">
							<CardHeader className="pb-3 pt-4 px-4">
								<CardTitle className="text-sm font-bold flex items-center gap-2">
									<IconFileText className="size-4 text-amber-600" />
									<span>ملاحظات ولي الأمر</span>
								</CardTitle>
							</CardHeader>
							<CardContent className="px-4 pb-4">
								<div className="rounded-lg border p-3 text-xs text-foreground bg-muted/20 whitespace-pre-wrap leading-relaxed">
									{owner.notes}
								</div>
							</CardContent>
						</Card>
					)}
				</div>

				{/* العمود الرئيسي: جدول وبطاقات الطلاب المسجلين تحت ولي الأمر */}
				<div className="lg:col-span-7 flex flex-col gap-4">
					<Card className="border-border/70 shadow-2xs">
						<CardHeader className="pb-3 pt-4 px-4 flex flex-row items-center justify-between">
							<div className="flex items-center gap-2">
								<IconSchool className="size-4.5 text-primary" />
								<CardTitle className="text-base font-bold">الطلاب التابعين لولي الأمر</CardTitle>
								<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
									{linkedPatients.length}
								</span>
							</div>

							<Button
								size="sm"
								className="gap-1.5 text-xs h-8"
								onClick={() => setAddPatientOpen(true)}
							>
								<IconPlus className="size-3.5" />
								<span>إضافة طالب جديد</span>
							</Button>
						</CardHeader>

						<CardContent className="px-4 pb-4">
							{linkedPatients.length === 0 ? (
								<div className="rounded-xl border border-dashed p-8 flex flex-col items-center justify-center text-center gap-3 bg-muted/10">
									<div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
										<IconUsers className="size-6" />
									</div>
									<div className="flex flex-col gap-1 max-w-sm">
										<h4 className="font-bold text-sm text-foreground">لا يوجد طلاب مسجلون حالياً</h4>
										<p className="text-xs text-muted-foreground leading-relaxed">
											لم يتم ربط أي طلاب بولي الأمر هذا حتى الآن. يمكنك إضافة طالب جديد وربطه تلقائياً.
										</p>
									</div>
									<Button
										size="sm"
										className="gap-1.5 mt-2"
										onClick={() => setAddPatientOpen(true)}
									>
										<IconPlus className="size-3.5" />
										<span>إضافة طالب جديد</span>
									</Button>
								</div>
							) : (
								<div className="flex flex-col gap-2.5">
									{linkedPatients.map((student) => {
										const isFemale = student.gender === "FEMALE";
										return (
											<div
												key={student.id}
												className="flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-card hover:border-primary/50 hover:bg-muted/30 transition-all gap-3"
											>
												<div className="flex items-center gap-3 min-w-0">
													<div
														className={cn(
															"size-9 rounded-full flex items-center justify-center border font-bold text-xs shrink-0",
															isFemale
																? "bg-pink-50 border-pink-200 text-pink-600 dark:bg-pink-950/40 dark:text-pink-300"
																: "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300",
														)}
													>
														{student.name.slice(0, 1)}
													</div>

													<div className="flex flex-col min-w-0">
														<div className="flex items-center gap-2">
															<Link
																to="/services/patients/$patientId"
																params={{ patientId: student.id }}
																className="font-bold text-xs text-foreground hover:text-primary transition-colors truncate"
															>
																{student.name}
															</Link>
															<span className="font-mono text-[10px] text-muted-foreground">
																{student.code || "PT-0000"}
															</span>
														</div>

														<div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-0.5 flex-wrap">
															{student.classroom && (
																<span className="inline-flex items-center px-1.5 py-0.2 rounded bg-muted text-[10px]">
																	فصل: {student.classroom}
																</span>
															)}
															{student.bloodType && (
																<span className="inline-flex items-center px-1.5 py-0.2 rounded bg-rose-50 text-rose-600 dark:bg-rose-950/30 text-[10px]">
																	{student.bloodType}
																</span>
															)}
															<span className="text-[10px]">
																{student.active ? "نشط" : "معلق"}
															</span>
														</div>
													</div>
												</div>

												<Button
													asChild
													size="sm"
													variant="ghost"
													className="h-8 gap-1 text-xs text-primary hover:text-primary hover:bg-primary/10 shrink-0"
												>
													<Link
														to="/services/patients/$patientId"
														params={{ patientId: student.id }}
													>
														<span>عرض الملف</span>
														<IconExternalLink className="size-3.5" />
													</Link>
												</Button>
											</div>
										);
									})}
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>

			{/* حوارات التعديل والإجراءات */}
			<OwnerSheet
				open={!!editingOwner}
				onClose={() => {
					setEditingOwner(null);
					refetch();
				}}
				owner={editingOwner}
			/>

			<DisableOwnerDialog
				owner={disablingOwner}
				onClose={() => setDisablingOwner(null)}
			/>

			<DeleteOwnerDialog
				owner={deletingOwner}
				onClose={() => {
					setDeletingOwner(null);
					navigate({ to: "/services/owners" });
				}}
			/>

			<PortalPasswordDialog
				owner={portalOwner}
				open={Boolean(portalOwner)}
				onOpenChange={(next) => !next && setPortalOwner(null)}
			/>

			<AddPatientDialog
				open={addPatientOpen}
				onClose={() => setAddPatientOpen(false)}
				defaultOwnerId={owner.id}
				defaultGuardianName={owner.name}
				defaultGuardianPhone={owner.phone}
				defaultGuardianEmail={owner.email ?? undefined}
				onSuccess={() => {
					setAddPatientOpen(false);
					refetch();
					refetchPatients();
					toast.success("تم إضافة الطالب بنجاح");
				}}
			/>
		</div>
	);
}
