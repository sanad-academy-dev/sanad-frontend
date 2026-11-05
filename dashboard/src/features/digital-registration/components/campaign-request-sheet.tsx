import { useState, useRef, useCallback, useEffect } from "react";
import {
	IconCalendar,
	IconCheck,
	IconExternalLink,
	IconUser,
	IconUserCircle,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { CampaignRequestItem } from "../types/campaign-request.types";
import { AddRequestDialog } from "./add-request-sheet";

// Phase 2 Detail Components
import { RequestGuardianSidebar } from "./details/request-guardian-sidebar";
import { RequestHeaderActions } from "./details/request-header-actions";
import { RequestChildDataCard } from "./details/request-child-data-card";
import { RequestLifecycleStepper } from "./details/request-lifecycle-stepper";
import { RequestDocumentsSection } from "./details/request-documents-section";
import { RequestActivityComments } from "./details/request-activity-comments";
import { useDigitalRegistrationCapabilities } from "../hooks/use-digital-registration";

// Phase 4 Action Modals Suite
import { ShortlistRequestDialog } from "./modals/shortlist-request-dialog";
import { WaitlistRequestDialog } from "./modals/waitlist-request-dialog";
import { RescheduleRequestDialog } from "./modals/reschedule-request-dialog";
import { RejectRequestDialog } from "./modals/reject-request-dialog";
import { ReferRequestDialog } from "./modals/refer-request-dialog";
import { DeleteRequestDialog } from "./modals/delete-request-dialog";
import { RequestStatusTransitionDialog, type RequestTransitionTarget } from "./modals/request-status-transition-dialog";
import { StudentRequestPrintModal } from "./print/student-request-print-modal";

interface CampaignRequestSheetProps {
	campaignId?: string;
	request: CampaignRequestItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	isUpdating?: boolean;
	onStatusChange?: (request: CampaignRequestItem, status: CampaignRequestItem["status"]) => void;
	onAccept?: (request: CampaignRequestItem) => void;
	onWaitlist?: (request: CampaignRequestItem) => void;
	onReject?: (request: CampaignRequestItem) => void;
	onDelete?: (request: CampaignRequestItem) => void;
	/** يفتح مسار الجدولة عندما يحاول المستخدم نقل بطاقة غير محجوزة إلى المقابلة. */
	openRescheduleOnOpen?: boolean;
}

export type ActiveActionDrawer = "shortlist" | "waitlist" | "reschedule" | "reject" | "refer" | "delete" | "edit" | "status" | null;

export function CampaignRequestSheet({
	request,
	open,
	onOpenChange,
	campaignId = "",
	isUpdating,
	onStatusChange,
	onAccept,
	onWaitlist,
	onReject,
	onDelete,
	openRescheduleOnOpen = false,
}: CampaignRequestSheetProps) {
	const { capabilities } = useDigitalRegistrationCapabilities(campaignId);
	// Active drawer state - guarantees only ONE action modal/drawer is ever open at a time
	const [activeDrawer, setActiveDrawer] = useState<ActiveActionDrawer>(null);
	const [statusTransitionTarget, setStatusTransitionTarget] = useState<RequestTransitionTarget | null>(null);
	const [rescheduleInitialStaffId, setRescheduleInitialStaffId] = useState<string | null>(null);
	const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const lastDrawerClosedAtRef = useRef<number>(0);

	const handleCloseDrawer = useCallback(() => {
		lastDrawerClosedAtRef.current = Date.now();
		setActiveDrawer(null);
		setRescheduleInitialStaffId(null);
	}, []);
	const openReschedule = useCallback((staffId?: string) => {
		setRescheduleInitialStaffId(staffId || null);
		setActiveDrawer("reschedule");
	}, []);
	const openStatusTransition = (target: RequestTransitionTarget) => {
		setStatusTransitionTarget(target);
		setActiveDrawer("status");
	};
	const autoOpenedRescheduleForRef = useRef<string | null>(null);

	useEffect(() => {
		if (!open) {
			autoOpenedRescheduleForRef.current = null;
			return;
		}
		if (
			openRescheduleOnOpen &&
			request?.id &&
			autoOpenedRescheduleForRef.current !== request.id
		) {
			autoOpenedRescheduleForRef.current = request.id;
			openReschedule();
		}
	}, [open, openReschedule, openRescheduleOnOpen, request?.id]);

	const isAnyDrawerOpen = activeDrawer !== null || isPrintDialogOpen;

	if (!request) return null;

	const handleStatusChange = (newStatus: CampaignRequestItem["status"]) => {
		onStatusChange?.(request, newStatus);
	};

	const handleStepClick = (stepId: string) => {
		if (stepId === "shortlist") {
			setActiveDrawer("shortlist");
		} else if (stepId === "waitlist") {
			setActiveDrawer("waitlist");
		} else if (stepId === "interview") {
			openReschedule();
		} else if (stepId === "rejected") {
			setActiveDrawer("reject");
		} else if (stepId === "accepted" && onAccept) {
			onAccept(request);
		} else {
			toast.info(`المحطة المختارة: ${stepId}`);
		}
	};

	return (
		<>
			<Sheet open={open} onOpenChange={onOpenChange}>
				<SheetContent
					side="left"
					dir="rtl"
					showOverlay={true}
					overlayClassName="z-40 bg-black/40"
					showCloseButton={false}
					onPointerDownOutside={(e) => {
						const target = e.target as HTMLElement | null;
						const isNestedOverlay = Boolean(
							target?.closest('[data-slot="sheet-content"]') ||
							target?.closest('[role="dialog"]') ||
							target?.closest('[role="menu"]') ||
							target?.closest('[data-radix-portal]') ||
							target?.closest('[data-radix-popper-content-wrapper]'),
						);
						// قوائم الإسناد والموعد واللوحات الفرعية تُعرض في Portal؛ لا تعاملها كخروج من التفاصيل.
						if (isNestedOverlay) {
							e.preventDefault();
							return;
						}
						const isRecentlyClosed = Date.now() - lastDrawerClosedAtRef.current < 700;
						if (isAnyDrawerOpen || isRecentlyClosed) {
							e.preventDefault();
							if (isAnyDrawerOpen) handleCloseDrawer();
							return;
						}
					}}
					onFocusOutside={(e) => e.preventDefault()}
					onInteractOutside={(e) => {
						const target = e.target as HTMLElement | null;
						const isNestedOverlay = Boolean(
							target?.closest('[data-slot="sheet-content"]') ||
							target?.closest('[role="dialog"]') ||
							target?.closest('[role="menu"]') ||
							target?.closest('[data-radix-portal]') ||
							target?.closest('[data-radix-popper-content-wrapper]'),
						);
						if (isNestedOverlay) {
							e.preventDefault();
							return;
						}
						const isRecentlyClosed = Date.now() - lastDrawerClosedAtRef.current < 700;
						if (isAnyDrawerOpen || isRecentlyClosed) {
							e.preventDefault();
							return;
						}
					}}
					className={cn(
						"w-full flex flex-col p-0 gap-0! sm:max-w-none! overflow-hidden bg-background border-zinc-200 dark:border-zinc-800 shadow-2xl transition-all duration-200 print:w-full print:max-w-none print:shadow-none print:border-none print:overflow-visible z-50",
						isExpanded
							? "sm:w-[65vw]! md:w-[65vw]! lg:w-[65vw]!"
							: "sm:w-[60vw]! md:w-[60vw]! lg:w-[60vw]!"
					)}
				>
					{/* الترويسة العلوية مع مسار التنقل والأزرار والقائمة السريعة */}
					<RequestHeaderActions
						request={request}
						onClose={() => onOpenChange(false)}
						onOpenShortlist={() => setActiveDrawer("shortlist")}
						onOpenWaitlist={() => setActiveDrawer("waitlist")}
							onOpenSchedule={openReschedule}
							onOpenReschedule={openReschedule}
						onOpenReject={() => setActiveDrawer("reject")}
						onOpenDelete={() => setActiveDrawer("delete")}
						onAcceptDirect={onAccept ? () => openStatusTransition("ACCEPTED") : undefined}
						onOpenEdit={() => setActiveDrawer("edit")}
						onOpenRefer={() => setActiveDrawer("refer")}
						onOpenPrint={() => setIsPrintDialogOpen(true)}
						onMoveToQueue={() => openStatusTransition("QUEUE")}
						onMoveToAwaitingPayment={() => openStatusTransition("AWAITING_PAYMENT")}
						onMarkDuplicate={() => openStatusTransition("DUPLICATE")}
						isExpanded={isExpanded}
						onToggleExpand={() => setIsExpanded((prev) => !prev)}
						isReadOnly={!capabilities.canEdit}
					/>

					{/* الحاوية الرئيسية للتمرير الموحد للعمودين معاً كصفحة واحدة متكاملة */}
					<div className="flex-1 overflow-y-auto min-h-0 bg-background" dir="rtl">
						<div className="flex min-h-full flex-col items-stretch lg:flex-row">

							{/* العمود الرئيسي (بيانات الطالب الموحدة، المسار، المستندات، والنشاط) 72% - يميناً في RTL */}
							<div className="w-full lg:w-[72%] flex-1 px-3.5 md:px-4 pb-3.5 md:pb-4 pt-3.5 space-y-3 min-w-0" dir="rtl">
								{/* بيانات الطالب: البوكس الموحد الشامل من الاسم حتى الاشتراك */}
								<RequestChildDataCard
									request={request}
									campaignId={campaignId}
									onStatusChange={capabilities.canChangeStatus ? handleStatusChange : undefined}
									onOpenReschedule={capabilities.canSchedule ? openReschedule : undefined}
								/>

								{/* بانر اعتماد القبول والتحويل للسجلات الرسمية إن تم القبول */}
								{request.convertedPatientId && (
									<div
										className="flex flex-col gap-2 rounded-lg border border-emerald-200 bg-emerald-50/80 dark:bg-emerald-950/30 dark:border-emerald-800 p-3 shadow-2xs"
										dir="rtl"
									>
										<div className="flex items-center justify-between gap-2">
											<div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
												<IconCheck className="size-4 shrink-0 text-emerald-600" />
												<span>تم اعتماد الطالب وإنشاء السجلات في المنظومة الأكاديمية</span>
											</div>
											{request.convertedPatientCode && (
												<Badge
													variant="outline"
													className="font-mono text-[11px] bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/50 dark:text-emerald-200 font-bold px-2"
												>
													{request.convertedPatientCode}
												</Badge>
											)}
										</div>

										<p className="text-[11px] text-muted-foreground leading-relaxed">
											تم ترحيل بيانات الطالب وولي الأمر تلقائياً. يمكنك الانتقال المباشر لملفاتهما في الأقسام الرسمية:
										</p>

										<div className="flex items-center gap-2 pt-1 flex-wrap">
											<Button
												asChild
												size="sm"
												variant="outline"
												className="h-7 text-xs bg-white dark:bg-card border-emerald-300 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:text-emerald-300 gap-1.5 font-semibold"
											>
												<Link to="/services/patients">
													<IconUser className="size-3.5" />
													فتح ملف الطالب الأكاديمي
													<IconExternalLink className="size-3" />
												</Link>
											</Button>

											{request.convertedOwnerId && (
												<Button
													asChild
													size="sm"
													variant="outline"
													className="h-7 text-xs bg-white dark:bg-card border-emerald-300 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:text-emerald-300 gap-1.5 font-semibold"
												>
													<Link to="/services/owners">
														<IconUserCircle className="size-3.5" />
														فتح ملف ولي الأمر
														<IconExternalLink className="size-3" />
													</Link>
												</Button>
											)}
										</div>
									</div>
								)}

								{/* كارت موعد الفحص والتقييم الرسمي المجدول */}
								{request.assessmentAppointment && (
									<div
										className="flex flex-col gap-2 rounded-lg border border-purple-200 bg-purple-50/70 dark:bg-purple-950/30 dark:border-purple-800 p-3 shadow-2xs"
										dir="rtl"
									>
										<div className="flex items-center justify-between gap-2">
											<div className="flex items-center gap-1.5 text-xs font-bold text-purple-800 dark:text-purple-300">
												<IconCalendar className="size-4 shrink-0 text-purple-600" />
												<span>موعد جلسة التقييم والمقابلة المقررة</span>
											</div>
											<Badge
												variant="outline"
												className="font-mono text-[11px] bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/50 dark:text-purple-200 font-bold px-2"
											>
												{request.assessmentAppointment.code}
											</Badge>
										</div>

										<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
											<div>
												<span className="text-muted-foreground block text-[11px]">التاريخ والوقت:</span>
												<span className="font-semibold text-foreground">
													{new Date(request.assessmentAppointment.startsAt).toLocaleDateString("ar-EG", {
														weekday: "long",
														year: "numeric",
														month: "long",
														day: "numeric",
													})}{" "}
													-{" "}
													{new Date(request.assessmentAppointment.startsAt).toLocaleTimeString("ar-EG", {
														hour: "2-digit",
														minute: "2-digit",
													})}
												</span>
											</div>

											<div>
												<span className="text-muted-foreground block text-[11px]">المراجع المسؤول:</span>
												<span className="font-semibold text-foreground">
													{request.assessmentAppointment.staffName || "فريق التقييم العام"}
												</span>
											</div>
										</div>
									</div>
								)}

								{/* مسار الطلب (بروتوكول القبول الأفقي بـ 7 محطات) */}
								<RequestLifecycleStepper
									request={request}
									onStepClick={handleStepClick}
								/>

								{/* المستندات والروابط المرفقة */}
								<RequestDocumentsSection
									request={request}
									campaignId={campaignId}
									onOpenAddDocument={capabilities.canEdit ? () => setActiveDrawer("edit") : undefined}
								/>

								{/* سجل النشاط وصندوق التعليقات الغني */}
								<RequestActivityComments
									request={request}
									campaignId={campaignId}
								/>
							</div>

							{/* العمود الجانبي (بيانات ولي الأمر، المراجع، الإحالة، تاريخ التقديم) - يساراً في RTL */}
							<RequestGuardianSidebar
								request={request}
								onOpenReschedule={openReschedule}
								onOpenReferDialog={() => setActiveDrawer("refer")}
							/>
						</div>
					</div>
				</SheetContent>
			</Sheet>

			{/* حزمة نوافذ الإجراءات الست الموحدة (Modals Suite) - تفتح نافذة واحدة فقط وتغلق أي نافذة أخرى تلقائياً */}
			<ShortlistRequestDialog
				key={`shortlist-${request.id}`}
				request={request}
				open={activeDrawer === "shortlist"}
				onOpenChange={(isOpen) => (isOpen ? setActiveDrawer("shortlist") : handleCloseDrawer())}
				campaignId={campaignId}
			/>

			<WaitlistRequestDialog
				key={`waitlist-${request.id}`}
				request={request}
				open={activeDrawer === "waitlist"}
				onOpenChange={(isOpen) => (isOpen ? setActiveDrawer("waitlist") : handleCloseDrawer())}
				campaignId={campaignId}
			/>

			<RescheduleRequestDialog
				key={`reschedule-${request.id}`}
				request={request}
				open={activeDrawer === "reschedule"}
				onOpenChange={(isOpen) => (isOpen ? setActiveDrawer("reschedule") : handleCloseDrawer())}
				campaignId={campaignId}
				initialStaffId={rescheduleInitialStaffId}
			/>

			<RejectRequestDialog
				key={`reject-${request.id}`}
				request={request}
				open={activeDrawer === "reject"}
				onOpenChange={(isOpen) => (isOpen ? setActiveDrawer("reject") : handleCloseDrawer())}
				campaignId={campaignId}
			/>

			<ReferRequestDialog
				key={`refer-${request.id}`}
				request={request}
				open={activeDrawer === "refer"}
				onOpenChange={(isOpen) => (isOpen ? setActiveDrawer("refer") : handleCloseDrawer())}
				campaignId={campaignId}
			/>

			<DeleteRequestDialog
				key={`delete-${request.id}`}
				request={request}
				open={activeDrawer === "delete"}
				onOpenChange={(isOpen) => (isOpen ? setActiveDrawer("delete") : handleCloseDrawer())}
				campaignId={campaignId}
				onDeletedSuccess={() => {
					onOpenChange(false);
					onDelete?.(request);
				}}
			/>

			<RequestStatusTransitionDialog
				request={request}
				target={statusTransitionTarget}
				open={activeDrawer === "status"}
				onOpenChange={(isOpen) => {
					if (!isOpen) {
						setStatusTransitionTarget(null);
						handleCloseDrawer();
					}
				}}
				campaignId={campaignId}
				onAccept={onAccept}
			/>

			{/* نافذة تعديل بيانات الطلب باستخدام فورم التسجيل المعتمدة الشاملة */}
			<AddRequestDialog
				initialData={request}
				open={activeDrawer === "edit"}
				onClose={handleCloseDrawer}
				campaignId={campaignId}
			/>

			{/* نافذة معاينة وطباعة استمارة الطالب الرسمية الشاملة */}
			<StudentRequestPrintModal
				request={request}
				open={isPrintDialogOpen}
				onOpenChange={setIsPrintDialogOpen}
			/>
		</>
	);
}
