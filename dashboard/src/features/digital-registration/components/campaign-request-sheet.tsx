import { useState, useRef, useCallback, useEffect } from "react";
import {
	IconCalendar,
	IconCopy,
	IconExternalLink,
	IconHourglass,
	IconUser,
	IconUserCircle,
	IconX,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { CampaignRequestItem } from "../types/campaign-request.types";
import { AddRequestDialog } from "./add-request-sheet";
import { FillAssessmentDrawer } from "./details/fill-assessment-drawer";
import { AssessmentDetailsDrawer } from "./details/assessment-details-drawer";

// Phase 2 Detail Components
import { RequestGuardianSidebar } from "./details/request-guardian-sidebar";
import { RequestHeaderActions } from "./details/request-header-actions";
import { RequestChildDataCard } from "./details/request-child-data-card";
import { RequestLifecycleStepper } from "./details/request-lifecycle-stepper";
import { RequestDocumentsSection } from "./details/request-documents-section";
import { RequestActivityComments } from "./details/request-activity-comments";
import {
	useDigitalRegistrationCapabilities,
	useEnrollAcceptedStudent,
} from "../hooks/use-digital-registration";

// Phase 4 Action Modals Suite
import { QueueRequestDialog } from "./modals/queue-request-dialog";
import { ShortlistRequestDialog } from "./modals/shortlist-request-dialog";
import { WaitlistRequestDialog } from "./modals/waitlist-request-dialog";
import { RescheduleRequestDialog } from "./modals/reschedule-request-dialog";
import { AwaitingPaymentDialog } from "./modals/awaiting-payment-dialog";
import { RejectRequestDialog } from "./modals/reject-request-dialog";
import { ReferRequestDialog } from "./modals/refer-request-dialog";
import { DeleteRequestDialog } from "./modals/delete-request-dialog";
import { AssignSubscriptionDialog } from "./modals/assign-subscription-dialog";
import { CashPaymentDrawer } from "./modals/cash-payment-drawer";
import { PaymentReceiptDrawer } from "./modals/payment-receipt-drawer";
import { RequestStatusTransitionDialog, type RequestTransitionTarget } from "./modals/request-status-transition-dialog";
import { StudentRequestPrintModal } from "./print/student-request-print-modal";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";
import type { RegistrationPaymentReceiptData } from "../types/campaign-request.types";
import {
	buildReceiptFromRequest,
	resolveClinicCurrencySymbol,
} from "../utils/payment-helpers";
import {
	formatAppointmentDate,
	formatAppointmentTime,
	DEFAULT_CLINIC_TIMEZONE,
} from "../utils/date-format";

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
	/** الدراور الأولي المراد فتحه مباشرة عند فتح اللوحة (مثل: عند السحب والإفلات المشروط). */
	initialDrawer?: ActiveActionDrawer;
	onRequestUpdate?: (updated: Partial<CampaignRequestItem> & { id: string }) => void;
}

export type ActiveActionDrawer = "queue" | "shortlist" | "waitlist" | "reschedule" | "awaiting-payment" | "cash-payment" | "payment-receipt" | "reject" | "refer" | "delete" | "edit" | "status" | "subscription" | "fill-assessment" | "view-assessment" | null;

function isNestedDrawerOrOverlayTarget(target: HTMLElement | null): boolean {
	return Boolean(
		target?.closest('[data-slot="sheet-content"]') ||
			target?.closest('[data-slot="reschedule-drawer"]') ||
			target?.closest('[data-slot="awaiting-payment-drawer"]') ||
			target?.closest('[data-slot="cash-payment-drawer"]') ||
			target?.closest('[data-slot="payment-receipt-drawer"]') ||
			target?.closest('[data-slot="subscription-drawer"]') ||
			target?.closest('[data-slot="fill-assessment-drawer"]') ||
			target?.closest('[data-slot="assessment-details-drawer"]') ||
			target?.closest('[role="dialog"]') ||
			target?.closest('[role="menu"]') ||
			target?.closest('[data-radix-portal]') ||
			target?.closest('[data-radix-popper-content-wrapper]'),
	);
}

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
	initialDrawer = null,
	onRequestUpdate,
}: CampaignRequestSheetProps) {
	const { capabilities } = useDigitalRegistrationCapabilities(campaignId);
	const enrollStudentMutation = useEnrollAcceptedStudent(campaignId);
	const { clinicInfo } = useClinicInfo();
	const clinicTimezone = clinicInfo?.timezone || DEFAULT_CLINIC_TIMEZONE;
	// Active drawer state - guarantees only ONE action modal/drawer is ever open at a time
	const [activeDrawer, setActiveDrawer] = useState<ActiveActionDrawer>(null);
	const [activeReceipt, setActiveReceipt] = useState<RegistrationPaymentReceiptData | null>(null);
	const [statusTransitionTarget, setStatusTransitionTarget] = useState<RequestTransitionTarget | null>(null);
	const [rescheduleInitialStaffId, setRescheduleInitialStaffId] = useState<string | null>(null);
	const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const lastDrawerClosedAtRef = useRef<number>(0);
	const returnToAwaitingPaymentRef = useRef<boolean>(false);

	const currencySymbol = resolveClinicCurrencySymbol(clinicInfo?.currencyCode);

	const handleCloseDrawer = useCallback(() => {
		lastDrawerClosedAtRef.current = Date.now();
		returnToAwaitingPaymentRef.current = false;
		setActiveDrawer(null);
		setRescheduleInitialStaffId(null);
	}, []);
	const handleActionCompleted = useCallback(() => {
		handleCloseDrawer();
		onOpenChange(false);
	}, [handleCloseDrawer, onOpenChange]);
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
			initialDrawer &&
			request?.id &&
			autoOpenedRescheduleForRef.current !== `${request.id}-${initialDrawer}`
		) {
			autoOpenedRescheduleForRef.current = `${request.id}-${initialDrawer}`;
			if (initialDrawer === "reschedule") {
				openReschedule();
			} else {
				setActiveDrawer(initialDrawer);
			}
		} else if (
			openRescheduleOnOpen &&
			request?.id &&
			autoOpenedRescheduleForRef.current !== request.id
		) {
			autoOpenedRescheduleForRef.current = request.id;
			openReschedule();
		}
	}, [open, openReschedule, openRescheduleOnOpen, initialDrawer, request?.id]);

	const isAnyDrawerOpen = activeDrawer !== null || isPrintDialogOpen;

	if (!request) return null;

	const handleStatusChange = (req: CampaignRequestItem, newStatus: CampaignRequestItem["status"]) => {
		onStatusChange?.(req, newStatus);
	};

	const handleEnrollStudent = () => {
		if (!request || enrollStudentMutation.isPending) return;
		enrollStudentMutation.mutate(
			{ requestId: request.id },
			{
				onSuccess: (res: any) => {
					onRequestUpdate?.({
						id: request.id,
						convertedPatientId: res.patientId,
						convertedPatientCode: res.studentCode,
						convertedOwnerId: res.ownerId,
						convertedOwnerCode: res.ownerCode,
					});
					toast.success(
						res.alreadyEnrolled
							? "الطالب مضاف بالفعل إلى قائمة الطلاب"
							: `تمت إضافة الطالب لقائمة الطلاب بنجاح (${res.studentCode})`,
					);
				},
				onError: (err: any) => {
					toast.error(err?.message || "تعذر إضافة الطالب لقائمة الطلاب");
				},
			},
		);
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
						// قوائم الإسناد والموعد واللوحات الفرعية تُعرض في Portal؛ لا تعاملها كخروج من التفاصيل.
						if (isNestedDrawerOrOverlayTarget(target)) {
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
						if (isNestedDrawerOrOverlayTarget(target)) {
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
						onOpenCashPayment={() => setActiveDrawer("cash-payment")}
						onEnrollStudent={handleEnrollStudent}
						isEnrollingStudent={enrollStudentMutation.isPending}
						capabilities={capabilities}
						onOpenEdit={() => setActiveDrawer("edit")}
						onOpenRefer={() => setActiveDrawer("refer")}
						onOpenPrint={() => setIsPrintDialogOpen(true)}
						onMoveToQueue={() => setActiveDrawer("queue")}
						onMoveToAwaitingPayment={() => setActiveDrawer("awaiting-payment")}
						onMarkDuplicate={() => openStatusTransition("DUPLICATE")}
						isExpanded={isExpanded}
						onToggleExpand={() => setIsExpanded((prev) => !prev)}
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
									onOpenAssignPlan={() => setActiveDrawer("subscription")}
									onOpenCashPayment={() => setActiveDrawer("cash-payment")}
									onOpenViewReceipt={() => {
										const receipt =
											activeReceipt && activeReceipt.requestId === request.id
												? activeReceipt
												: buildReceiptFromRequest(
														request,
														currencySymbol,
														clinicInfo?.name,
												  );
										if (receipt) {
											setActiveReceipt(receipt);
											setActiveDrawer("payment-receipt");
										}
									}}
									onOpenFillAssessment={() => setActiveDrawer("fill-assessment")}
									onOpenViewAssessment={() => setActiveDrawer("view-assessment")}
									isExpanded={isExpanded}
								/>

								{/* 5. بانر الطلب المكرر */}
								{request.status === "DUPLICATE" && (
									<div
										className="flex flex-col gap-2 rounded-lg border border-amber-200 bg-amber-50/70 dark:bg-amber-950/30 dark:border-amber-800 p-3 shadow-2xs"
										dir="rtl"
									>
										<div className="flex items-center justify-between gap-2">
											<div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200">
												<IconCopy className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
												<span>تم تصنيف هذا السجل كطلب مكرر</span>
											</div>
											<Badge variant="outline" className="text-xs bg-amber-100 text-amber-900 border-amber-300 font-bold px-2 py-0.5">
												مكرر
											</Badge>
										</div>
										<p className="text-[11px] text-muted-foreground leading-relaxed">
											تم تعليق هذا الطلب لاحتوائه على نفس بيانات طالب مسجل مسبقاً لمنع ازدواجية السجلات.
										</p>
										{capabilities.canChangeStatus && (
											<div className="flex items-center justify-end pt-1">
												<Button
													size="sm"
													variant="outline"
													onClick={() => setActiveDrawer("queue")}
													className="h-7 text-xs border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 font-medium cursor-pointer"
												>
													إلغاء التكرار وإعادة الطلب للطابور
												</Button>
											</div>
										)}
									</div>
								)}

								{/* مسار الطلب (بروتوكول القبول الأفقي بـ 5 محطات) */}
								<RequestLifecycleStepper
									request={request}
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
								onRequestUpdate={onRequestUpdate}
							/>
						</div>
					</div>

					{/* لوحات الإجراءات متصلة مباشرة بالحاوية الأصلية لضمان عمل تمرير الماوس بالـ wheel بدون أي حجب */}
					<RejectRequestDialog
						key={`reject-${request.id}`}
						request={request}
						open={activeDrawer === "reject"}
						onOpenChange={(isOpen) => (isOpen ? setActiveDrawer("reject") : handleCloseDrawer())}
						campaignId={campaignId}
						onSuccess={handleActionCompleted}
						isExpanded={isExpanded}
					/>

					<QueueRequestDialog
						key={`queue-${request.id}`}
						request={request}
						open={activeDrawer === "queue"}
						onOpenChange={(isOpen) => (isOpen ? setActiveDrawer("queue") : handleCloseDrawer())}
						campaignId={campaignId}
						onSuccess={handleActionCompleted}
						isExpanded={isExpanded}
					/>

					<ShortlistRequestDialog
						key={`shortlist-${request.id}`}
						request={request}
						open={activeDrawer === "shortlist"}
						onOpenChange={(isOpen) => (isOpen ? setActiveDrawer("shortlist") : handleCloseDrawer())}
						campaignId={campaignId}
						onSuccess={handleActionCompleted}
						isExpanded={isExpanded}
					/>

					<WaitlistRequestDialog
						key={`waitlist-${request.id}`}
						request={request}
						open={activeDrawer === "waitlist"}
						onOpenChange={(isOpen) => (isOpen ? setActiveDrawer("waitlist") : handleCloseDrawer())}
						campaignId={campaignId}
						onSuccess={handleActionCompleted}
						isExpanded={isExpanded}
					/>

					<RescheduleRequestDialog
						key={`reschedule-${request.id}`}
						request={request}
						open={activeDrawer === "reschedule"}
						onOpenChange={(isOpen) => (isOpen ? setActiveDrawer("reschedule") : handleCloseDrawer())}
						campaignId={campaignId}
						initialStaffId={rescheduleInitialStaffId}
						onSuccess={handleActionCompleted}
						isExpanded={isExpanded}
					/>

					<AwaitingPaymentDialog
						key={`awaiting-payment-${request.id}`}
						request={request}
						open={activeDrawer === "awaiting-payment"}
						onOpenChange={(isOpen) => (isOpen ? setActiveDrawer("awaiting-payment") : handleCloseDrawer())}
						campaignId={campaignId}
						onSuccess={handleActionCompleted}
						onRequestUpdate={onRequestUpdate}
						onOpenAssignPlan={() => {
							returnToAwaitingPaymentRef.current = true;
							setActiveDrawer("subscription");
						}}
						isExpanded={isExpanded}
					/>

					<ReferRequestDialog
						key={`refer-${request.id}`}
						request={request}
						open={activeDrawer === "refer"}
						onOpenChange={(isOpen) => (isOpen ? setActiveDrawer("refer") : handleCloseDrawer())}
						campaignId={campaignId}
						onSuccess={handleActionCompleted}
						isExpanded={isExpanded}
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
						isExpanded={isExpanded}
					/>

					<AssignSubscriptionDialog
						key={`subscription-${request.id}`}
						request={request}
						open={activeDrawer === "subscription"}
						onOpenChange={(isOpen) => (isOpen ? setActiveDrawer("subscription") : handleCloseDrawer())}
						campaignId={campaignId}
						onSuccess={(assignedPlan, updatedReq) => {
							if (assignedPlan && onRequestUpdate) {
								onRequestUpdate({
									id: request.id,
									subscriptionPlanId: assignedPlan.id,
									subscriptionPlanName: assignedPlan.name,
									subscriptionAmount: assignedPlan.price,
									...(updatedReq?.paymentToken
										? {
												paymentToken: updatedReq.paymentToken,
												paymentTokenExpiresAt: updatedReq.paymentTokenExpiresAt,
										  }
										: {}),
								});
							}
							if (returnToAwaitingPaymentRef.current) {
								returnToAwaitingPaymentRef.current = false;
								setActiveDrawer("awaiting-payment");
							} else {
								handleCloseDrawer();
							}
						}}
						isExpanded={isExpanded}
					/>

					<CashPaymentDrawer
						key={`cash-payment-${request.id}`}
						request={request}
						open={activeDrawer === "cash-payment"}
						onOpenChange={(isOpen) => (isOpen ? setActiveDrawer("cash-payment") : handleCloseDrawer())}
						campaignId={campaignId}
						isExpanded={isExpanded}
						onOpenAssignPlan={() => setActiveDrawer("subscription")}
						onPaymentSuccess={(receipt) => {
							setActiveReceipt(receipt);
							onRequestUpdate?.({
								id: request.id,
								status: "ACCEPTED",
								statusLabel: "مقبول",
								statusVariant: "default",
								column: "accepted",
								paidAt: receipt.paidAt,
								paymentReference: receipt.paymentReference,
								paymentGateway: receipt.paymentGateway,
								paymentMethodType: receipt.paymentMethodType,
								paymentNotes: JSON.stringify({
									expectedAmount: receipt.amount,
									cashReceived: receipt.cashReceived,
									changeAmount: receipt.changeAmount,
									discountAmount: receipt.discountAmount,
									collectedBy: receipt.collectedBy,
									notes: receipt.notes,
								}),
								convertedPatientCode: receipt.studentCode || request.convertedPatientCode,
							});
							setActiveDrawer("payment-receipt");
						}}
					/>

					<PaymentReceiptDrawer
						key={`payment-receipt-${request.id}`}
						receipt={
							activeReceipt && activeReceipt.requestId === request.id
								? activeReceipt
								: buildReceiptFromRequest(request, currencySymbol, clinicInfo?.name)
						}
						open={activeDrawer === "payment-receipt"}
						onOpenChange={(isOpen) => {
							if (isOpen) {
								setActiveDrawer("payment-receipt");
							} else {
								handleCloseDrawer();
							}
						}}
						isExpanded={isExpanded}
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
						onAccept={(req) => {
							onAccept?.(req);
							handleActionCompleted();
						}}
						onSuccess={handleActionCompleted}
						isExpanded={isExpanded}
					/>

					{/* لوحة التقييم الأولي الجانبية (28vw) المفتوحة بجانب تفاصيل الطلب */}
					<FillAssessmentDrawer
						key={`fill-assessment-${request.id}`}
						request={request}
						open={activeDrawer === "fill-assessment"}
						onOpenChange={(isOpen) => (isOpen ? setActiveDrawer("fill-assessment") : handleCloseDrawer())}
						campaignId={campaignId}
						isExpanded={isExpanded}
						onSuccess={handleActionCompleted}
					/>

					{/* دراور تقرير ونتائج التقييم الأولي (28vw) المفتوح بجانب تفاصيل الطلب */}
					<AssessmentDetailsDrawer
						key={`view-assessment-${request.id}`}
						request={request}
						open={activeDrawer === "view-assessment"}
						onOpenChange={(isOpen) => (isOpen ? setActiveDrawer("view-assessment") : handleCloseDrawer())}
						campaignId={campaignId}
						isExpanded={isExpanded}
					/>
				</SheetContent>
			</Sheet>

			{/* نافذة تعديل بيانات الطلب باستخدام فورم التسجيل المعتمدة الشاملة */}
			<AddRequestDialog
				initialData={request}
				open={activeDrawer === "edit"}
				onClose={handleCloseDrawer}
				campaignId={campaignId}
				onSuccess={(updated) => {
					if (updated && onRequestUpdate) {
						onRequestUpdate(updated);
					}
					handleCloseDrawer();
				}}
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
