import {
	IconBuildingStore,
	IconCalendarPlus,
	IconCurrencyDollar,
	IconDiscount2,
	IconFilePlus,
	IconPackage,
	IconPlus,
	IconReceiptDollarFilled,
	IconSearch,
	IconStethoscope,
	IconUserPlus,
	IconUsersPlus,
	IconVideo,
} from "@tabler/icons-react";
import {
	createFileRoute,
	Outlet,
	redirect,
	useLocation,
	useMatch,
	useNavigate,
	useRouterState,
} from "@tanstack/react-router";
import type { ComponentType } from "react";
import { useState } from "react";
import {
	HEADER_ICON_BUTTON,
	HEADER_ICON_SMALL_GLYPH,
} from "@/components/common/header-icon-button";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Breadcrumb, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { AgentLauncherButton } from "@/features/agent/components/agent-launcher-button";
import { AgentPanel } from "@/features/agent/components/agent-panel";
import { AddAppointmentModal } from "@/features/appointments/components/add-appointment-modal";
import { CreateCarePlanSheet } from "@/features/finance/care-plans/components/create-care-plan-sheet";
import { AddDiscountSheet } from "@/features/finance/discounts/components/add-discount-sheet";
import { CreateExpenseSheet } from "@/features/finance/expenses/components/create-expense-sheet";
import { useInboxStream } from "@/features/inbox/hooks/use-inbox-stream";
import { AddProductSheet } from "@/features/inventory/components/add-product-sheet";
import { useChatEvents } from "@/features/messages/hooks/use-chat-events";
import { AddOwnerSheet } from "@/features/services/owners/components/add-owner-sheet";
import { AddPatientSheet } from "@/features/services/patients/components/add-patient-sheet";
import { AddStaffSheet } from "@/features/services/staff/components/add-staff-sheet";
import { FloatingCallWindow } from "@/features/video-calls/components/floating-call-window";
import { getOnboardingStatus } from "@/functions/get-onboarding-status";
import { useI18n } from "@/hooks/use-i18n";
import { usePageHeaderTakeover } from "@/hooks/use-page-header-takeover";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_pathless-layout")({
	component: RouteComponent,
	ssr: false,
	beforeLoad: async () => {
		const { session, onboardingCompleted } = await getOnboardingStatus();
		if (!session) {
			throw redirect({ to: "/login" });
		}
		if (!onboardingCompleted) {
			throw redirect({ to: "/onboarding" });
		}
	},
});

function PageSkeleton() {
	return (
		<div className="flex flex-col gap-4 p-4">
			<div className="flex items-center justify-between">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-8 w-24" />
			</div>
			<div className="overflow-hidden rounded-md border">
				<div className="flex gap-6 border-b bg-muted/50 px-4 py-3">
					{Array.from({ length: 5 }).map((_, i) => (
						<Skeleton
							key={i}
							className="h-4 w-20"
						/>
					))}
				</div>
				{Array.from({ length: 8 }).map((_, i) => (
					<div
						key={i}
						className="flex items-center gap-4 border-b px-4 py-3 last:border-0"
					>
						<Skeleton className="h-4 w-1/4" />
						<Skeleton className="h-4 w-1/3" />
						<Skeleton className="h-4 w-1/5" />
						<Skeleton className="ms-auto h-4 w-1/6" />
					</div>
				))}
			</div>
		</div>
	);
}

// أنواع اللوحات/النوافذ التي تُفتح داخل الصفحة من قائمة الإضافة السريعة
type QuickAddSheet =
	| "appointment"
	| "patient"
	| "owner"
	| "staff"
	| "product"
	| "expense"
	| "discount"
	| "care-plan";

// عناصر قائمة "إضافة سريعة" في الهيدر — "branch" ينتقل لصفحة بدل فتح لوحة
type QuickAddItem = {
	key: QuickAddSheet | "branch";
	labelKey: string;
	icon: ComponentType<{ className?: string }>;
};

const QUICK_ADD_ITEMS: QuickAddItem[] = [
	{ key: "appointment", labelKey: "quickAdd.items.appointment", icon: IconCalendarPlus },
	{ key: "patient", labelKey: "quickAdd.items.patient", icon: IconStethoscope },
	{ key: "owner", labelKey: "quickAdd.items.owner", icon: IconUserPlus },
	{ key: "staff", labelKey: "quickAdd.items.staff", icon: IconUsersPlus },
	{ key: "product", labelKey: "quickAdd.items.product", icon: IconPackage },
	{ key: "expense", labelKey: "quickAdd.items.expense", icon: IconCurrencyDollar },
	{ key: "discount", labelKey: "quickAdd.items.discount", icon: IconDiscount2 },
	{ key: "care-plan", labelKey: "quickAdd.items.carePlan", icon: IconFilePlus },
	{ key: "branch", labelKey: "quickAdd.items.branch", icon: IconBuildingStore },
];

function RouteComponent() {
	const isLoading = useRouterState({ select: (s) => s.isLoading });
	const inSettings = useMatch({
		from: "/_pathless-layout/management/settings",
		shouldThrow: false,
	});
	const { pathname } = useLocation();
	const { t, isRtl } = useI18n();
	const navigate = useNavigate();

	// اللوحة/النافذة المفتوحة حاليًا من قائمة الإضافة السريعة (واحدة في كل مرة)
	const [quickAdd, setQuickAdd] = useState<QuickAddSheet | null>(null);
	const closeQuickAdd = () => setQuickAdd(null);

	const { takeover, titleSuppressed } = usePageHeaderTakeover();

	// قناة «الرسائل» اللحظية تعيش مع التخطيط كله — توست وإشعارات خارج الوحدة
	useChatEvents();
	// قناة الوارد اللحظية — تُفتح مرّة واحدة لكل جلسة داخل المنطقة المحميّة
	useInboxStream();

	const pageTitle = (() => {
		// صفحة ترسم مسارها بنفسها (تفاصيل تقرير مثلًا) — لا نضيف عنوانًا مشتقًا بجانبه
		if (titleSuppressed) return "";
		const lastSegment = pathname.split("/").filter(Boolean).pop() ?? "";
		const camelKey = lastSegment.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
		const key = `sidebar.items.${camelKey}`;
		const resolved = t(key);
		// مفتاح مفقود (مثل معرّف صفحة تفصيلية) يعيد المفتاح نفسه — نُخفيه بدل عرض نص خام
		return resolved === key ? "" : resolved;
	})();

	return (
		<SidebarProvider>
			{/* الطباعة (تصدير PDF من التقارير) تُخرج المحتوى وحده — بلا شريط جانبي ولا رأس */}
			<AppSidebar className="print:hidden" />

			<SidebarInset className="flex h-svh flex-col overflow-hidden rounded-[4px]! md:h-[calc(100svh-1rem)] print:h-auto print:overflow-visible">
				{/* صفحة تستولي على الرأس (تفاصيل الوظيفة مثلًا) ترسم رأسها بنفسها */}
				{!takeover && (
					<header className="z-30 flex h-10 shrink-0 items-center justify-between gap-2 overflow-hidden border-b border-sidebar-border bg-background px-3 backdrop-blur supports-backdrop-filter:bg-background/80 print:hidden">
						<div className="flex items-center gap-1.5 pr-2">
							<Breadcrumb>
								<BreadcrumbList>
									<BreadcrumbPage className="text-base font-semibold">
										{pageTitle}
									</BreadcrumbPage>
								</BreadcrumbList>
							</Breadcrumb>
							{/* فتحة للصفحات لحقن محتوى في الهيدر (مثل تبويبات المخزون) */}
							<div
								id="page-header-slot"
								className="flex items-center"
							/>
						</div>
						{/* القسم الأوسط: فتحة لحقن محتوى ممتد (مثل شريط تفاصيل الوارد) */}
						<div
							id="page-header-center-slot"
							className="flex min-w-0 flex-1 items-stretch self-stretch"
						/>
						{/* ترتيب DOM في RTL: أوّل عنصر يمينًا — بصريًا من اليسار: [+] [بحث] [فاتورة] [فيديو] */}
						<div className="flex items-center gap-1.5">
							<AgentLauncherButton />
							<Button
								type="button"
								variant="outline"
								size="icon-sm"
								className={cn(HEADER_ICON_BUTTON, HEADER_ICON_SMALL_GLYPH)}
								aria-label={t("common.actions.video")}
								onClick={() => navigate({ to: "/video-call" })}
							>
								<IconVideo />
							</Button>
							<Button
								type="button"
								variant="outline"
								size="icon-sm"
								className={cn(HEADER_ICON_BUTTON, HEADER_ICON_SMALL_GLYPH)}
								aria-label={t("common.actions.invoice")}
							>
								<IconReceiptDollarFilled />
							</Button>
							<Button
								type="button"
								variant="outline"
								size="icon-sm"
								className={HEADER_ICON_BUTTON}
								aria-label={t("common.actions.search")}
							>
								<IconSearch />
							</Button>
							<DropdownMenu dir={isRtl ? "rtl" : "ltr"}>
								<DropdownMenuTrigger asChild>
									<Button
										type="button"
										variant="outline"
										size="icon-sm"
										className={cn(
											HEADER_ICON_BUTTON,
											"border-primary text-primary hover:bg-primary/10 hover:text-primary",
										)}
										aria-label={t("common.actions.add")}
									>
										<IconPlus />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="w-56"
								>
									<DropdownMenuLabel>{t("quickAdd.title")}</DropdownMenuLabel>
									<DropdownMenuSeparator />
									{QUICK_ADD_ITEMS.map((item) => (
										<DropdownMenuItem
											key={item.key}
											className="gap-2"
											onSelect={() =>
												item.key === "branch"
													? navigate({ to: "/add-branch" })
													: setQuickAdd(item.key)
											}
										>
											<item.icon className="size-4 text-muted-foreground" />
											{t(item.labelKey)}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</header>
				)}

				<div
					className={cn(
						"flex min-h-0 flex-1 flex-col gap-2 print:overflow-visible",
						inSettings ? "overflow-hidden" : "overflow-x-hidden overflow-y-auto",
					)}
				>
					{isLoading && !inSettings ? <PageSkeleton /> : <Outlet />}
				</div>
			</SidebarInset>

			<AgentPanel />
			{/* نافذة المكالمة العائمة — تصمد عبر التنقل بين الصفحات */}
			<FloatingCallWindow />
			{/* لوحات ونوافذ الإضافة السريعة — يُفتح واحد فقط في كل مرة حسب الاختيار من قائمة "+" */}
			<AddAppointmentModal
				open={quickAdd === "appointment"}
				onOpenChange={(open) => (open ? setQuickAdd("appointment") : closeQuickAdd())}
			/>
			<AddPatientSheet
				open={quickAdd === "patient"}
				onClose={closeQuickAdd}
			/>
			<AddOwnerSheet
				open={quickAdd === "owner"}
				onClose={closeQuickAdd}
			/>
			<AddStaffSheet
				open={quickAdd === "staff"}
				onClose={closeQuickAdd}
			/>
			<AddProductSheet
				open={quickAdd === "product"}
				onClose={closeQuickAdd}
			/>
			<CreateExpenseSheet
				open={quickAdd === "expense"}
				onOpenChange={(open) => (open ? setQuickAdd("expense") : closeQuickAdd())}
			/>
			<AddDiscountSheet
				open={quickAdd === "discount"}
				onOpenChange={(open) => (open ? setQuickAdd("discount") : closeQuickAdd())}
			/>
			<CreateCarePlanSheet
				open={quickAdd === "care-plan"}
				onOpenChange={(open) => (open ? setQuickAdd("care-plan") : closeQuickAdd())}
			/>
		</SidebarProvider>
	);
}
