import {
	IconDots,
	IconInbox,
	IconMapPin,
	IconPhone,
	IconTruck,
	IconUser,
} from "@tabler/icons-react";
import { useState } from "react";

import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConvertRequestDialog } from "@/features/mobile-clinics/components/convert-request-dialog";
import { RejectRequestDialog } from "@/features/mobile-clinics/components/reject-request-dialog";
import {
	PREFERRED_WINDOW_LABELS,
	REQUEST_STATUS_COLORS,
	REQUEST_STATUS_LABELS,
} from "@/features/mobile-clinics/data/request-meta";
import {
	useMobileRequestMutations,
	useMobileRequests,
} from "@/features/mobile-clinics/hooks/use-mobile-requests";
import type { MobileBookingRequestStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import type { MobileRequestResponse } from "@/server/mobile-clinics/mobile-requests/mobile-requests.dao";

const dateFmt = new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium", timeStyle: "short" });

const FILTERS: { value: MobileBookingRequestStatus | "ALL"; label: string }[] = [
	{ value: "NEW", label: "جديدة" },
	{ value: "CONTACTED", label: "تم الاتصال" },
	{ value: "SCHEDULED", label: "محوَّلة" },
	{ value: "ALL", label: "الكل" },
];

/**
 * [MC7.4] طابور الفرز.
 *
 * التحويل هو الفعل الرئيسي، والرفض يحتاج سببًا مكتوبًا — طلبٌ مرفوض بلا سبب يعود بعد
 * أسبوع ولا أحد يعرف لماذا رُفض أوّل مرّة.
 */
export function RequestsQueue() {
	const [filter, setFilter] = useState<MobileBookingRequestStatus | "ALL">("NEW");
	const { requests, isLoading } = useMobileRequests(filter === "ALL" ? undefined : filter);
	const { setStatus } = useMobileRequestMutations();
	const [converting, setConverting] = useState<MobileRequestResponse | null>(null);
	const [rejecting, setRejecting] = useState<MobileRequestResponse | null>(null);

	return (
		<>
			<ConvertRequestDialog
				request={converting}
				onClose={() => setConverting(null)}
			/>

			<RejectRequestDialog
				request={rejecting}
				onClose={() => setRejecting(null)}
			/>

			<div className="flex min-h-0 flex-1 flex-col">
				<div className="flex items-center gap-1 border-b px-4 py-2">
					{FILTERS.map((option) => (
						<Button
							key={option.value}
							variant={filter === option.value ? "secondary" : "ghost"}
							size="sm"
							className="h-7 text-xs"
							onClick={() => setFilter(option.value)}
						>
							{option.label}
						</Button>
					))}
					<div className="flex-1" />
					<span className="text-xs text-muted-foreground tabular-nums">
						{requests.length} طلب
					</span>
				</div>

				{isLoading ? (
					<div className="flex flex-1 items-center justify-center">
						<Spinner />
					</div>
				) : requests.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-2">
						<IconInbox className="size-10 text-muted-foreground" />
						<span className="text-sm text-muted-foreground">
							لا توجد طلبات في هذا التصنيف.
						</span>
					</div>
				) : (
					<div className="grid min-h-0 flex-1 auto-rows-min content-start items-start gap-3 overflow-y-auto p-3 md:grid-cols-2 xl:grid-cols-3">
						{requests.map((request) => (
							<article
								key={request.id}
								className="flex flex-col gap-2 rounded-[4px] border p-3"
							>
								<header className="flex items-start gap-2">
									<div className="flex min-w-0 flex-1 flex-col">
										<span className="truncate text-sm font-medium">{request.ownerName}</span>
										<span
											dir="ltr"
											className="text-start font-mono text-[11px] text-muted-foreground"
										>
											{request.code}
										</span>
									</div>
									<span
										className={cn(
											"shrink-0 rounded-[4px] border px-1.5 py-0.5 text-[10px] font-medium",
											REQUEST_STATUS_COLORS[request.status],
										)}
									>
										{REQUEST_STATUS_LABELS[request.status]}
									</span>
								</header>

								<div className="flex flex-col gap-1 text-[11px] text-muted-foreground">
									<span className="inline-flex items-center gap-1.5">
										<IconPhone className="size-3 shrink-0" />
										{/* رقم الهاتف جزيرة LTR داخل صفحة RTL */}
										<span dir="ltr">{request.phone}</span>
									</span>
									<span className="inline-flex items-start gap-1.5">
										<IconMapPin className="mt-0.5 size-3 shrink-0" />
										<span className="line-clamp-2">
											{request.addressLine}
											{request.landmark ? ` — ${request.landmark}` : ""}
										</span>
									</span>
									{request.petName && (
										<span className="inline-flex items-center gap-1.5">
											<IconUser className="size-3 shrink-0" />
											<span className="truncate text-foreground">{request.petName}</span>
											{request.animalType && (
												<span className="shrink-0 text-muted-foreground">
													({request.animalType.arName})
												</span>
											)}
										</span>
									)}
								</div>

								{request.zone ? (
									<span className="inline-flex w-fit items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
										ضمن نطاق {request.zone.name}
									</span>
								) : request.lat !== null ? (
									// خارج النطاق ليس رفضًا — الدبّوس قد يكون خاطئًا، والقرار للمنسّق
									<span className="inline-flex w-fit items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-700">
										خارج نطاقات الدورة
									</span>
								) : (
									<span className="inline-flex w-fit items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
										بلا موقع على الخريطة
									</span>
								)}

								<footer className="flex flex-col gap-2 border-t pt-2">
									<span className="text-[10px] text-muted-foreground tabular-nums">
										{dateFmt.format(new Date(request.createdAt))}
										{request.preferredWindow
											? ` — يفضّل ${PREFERRED_WINDOW_LABELS[request.preferredWindow]}`
											: ""}
									</span>

									{request.status !== "SCHEDULED" && (
										<div className="flex items-center gap-2">
											<Button
												size="sm"
												className="h-7 flex-1 text-xs"
												onClick={() => setConverting(request)}
											>
												<IconTruck className="size-3.5" />
												تحويل إلى زيارة
											</Button>
											<DropdownMenu dir="rtl">
												<DropdownMenuTrigger asChild>
													<Button
														variant="outline"
														size="icon"
														className="size-7 shrink-0"
														aria-label="إجراءات أخرى"
													>
														<IconDots className="size-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="start">
													<DropdownMenuItem onClick={() => setStatus(request.id, "CONTACTED")}>
														وضع علامة «تم الاتصال»
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														className="text-destructive"
														onClick={() => setRejecting(request)}
													>
														رفض الطلب
													</DropdownMenuItem>
													<DropdownMenuItem
														className="text-destructive"
														onClick={() => setStatus(request.id, "SPAM")}
													>
														وضع علامة «غير جادّ»
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									)}
								</footer>
							</article>
						))}
					</div>
				)}
			</div>
		</>
	);
}
