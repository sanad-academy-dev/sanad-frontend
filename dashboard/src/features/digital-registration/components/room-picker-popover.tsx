import { useState, useMemo, useRef, useEffect } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
	IconCalendar,
	IconCheck,
	IconMapPin,
	IconAlertCircle,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useBranches } from "@/features/settings/branches/hooks/use-branches";
import { useRooms } from "@/features/settings/branches/hooks/use-rooms";
import { backendFetch } from "@/lib/backend-fetch";

interface RoomPickerPopoverProps {
	value: string;
	onChange: (roomName: string, roomId?: string, branchId?: string) => void;
	appointmentDate: string;
	/** الموعد الحالي في إعادة الجدولة لا يحجب غرفته عن نفسه. */
	excludeAppointmentId?: string | null;
	onOpenAppointmentPicker?: () => void;
	className?: string;
}

export interface RoomItem {
	id: string;
	name: string;
	isBooked: boolean;
}

export function RoomPickerPopover({
	value,
	onChange,
	appointmentDate,
	excludeAppointmentId,
	onOpenAppointmentPicker,
	className,
}: RoomPickerPopoverProps) {
	const [open, setOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [busyRoomIds, setBusyRoomIds] = useState<Set<string>>(new Set());
	const [availabilityState, setAvailabilityState] = useState<"idle" | "loading" | "ready" | "error">("idle");
	const [availabilityRetry, setAvailabilityRetry] = useState(0);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const popoverContentRef = useRef<HTMLDivElement>(null);

	const { branches, isLoading: isLoadingBranches } = useBranches();
	const activeBranchId = branches[0]?.id;
	const { rooms, isLoading: isLoadingRooms } = useRooms(activeBranchId);
	const isLoading = isLoadingBranches || isLoadingRooms;

	// التحقق من شرط التسلسل: هل تم اختيار موعد أولاً؟
	const isAppointmentSelected =
		Boolean(appointmentDate) && appointmentDate !== "تاريخ الموعد";

	const roomIdsKey = useMemo(() => rooms.map((room) => room.id).sort().join(","), [rooms]);

	// لا تُعرض الغرف كمتاحة بمجرد أنها نشطة: نفحص حجزها في وقت الموعد نفسه.
	// يبقى فحص الباك عند الحفظ هو الحاسم لحماية سباق الحجز المتزامن.
	useEffect(() => {
		if (!isAppointmentSelected || !roomIdsKey) {
			setBusyRoomIds(new Set());
			setAvailabilityState("idle");
			return;
		}

		let cancelled = false;
		setAvailabilityState("loading");
		const query = new URLSearchParams({ startsAt: appointmentDate, roomIds: roomIdsKey });
		if (excludeAppointmentId) query.set("excludeAppointmentId", excludeAppointmentId);
		backendFetch(`/api/digital-registration/room-availability?${query}`)
			.then(async (response) => {
				if (!response.ok) throw new Error("room availability failed");
				const data = await response.json() as { busyRoomIds?: string[] };
				if (cancelled) return;
				setBusyRoomIds(new Set(data.busyRoomIds || []));
				setAvailabilityState("ready");
			})
			.catch(() => {
				if (!cancelled) setAvailabilityState("error");
			});

		return () => { cancelled = true; };
	}, [appointmentDate, availabilityRetry, excludeAppointmentId, isAppointmentSelected, roomIdsKey]);

	// الغرف تأتي من إعدادات الفروع فقط؛ لا نعرض أسماء تجريبية يمكن أن تفشل عند الحفظ.
	const roomsList: RoomItem[] = useMemo(() => {
		return rooms.map((room) => ({ id: room.id, name: room.name, isBooked: busyRoomIds.has(room.id) }));
	}, [busyRoomIds, rooms]);

	// تصفية القاعات بالبحث
	const filteredRooms = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return roomsList;
		return roomsList.filter((r) => r.name.toLowerCase().includes(q));
	}, [roomsList, searchQuery]);

	// معالجة التمرير بعجلة الماوس بشكل أصلي (Native Wheel Listener)
	// يحل جذرياً مشكلة اعتراض Radix Dialog لحدث wheel عندما يكون البوبوفر داخل الـ Portal
	// ويدعم مضاعف الأسطر لنظام Windows (deltaMode === 1) لضمان حركة سلسة وحيوية
	useEffect(() => {
		const scrollEl = scrollContainerRef.current;
		const popoverEl = popoverContentRef.current;
		if (!open || !scrollEl) return;

		const handleNativeWheel = (e: WheelEvent) => {
			// إيقاف تسلسل الحدث فوراً لمنع react-remove-scroll على مستوى document من إلغاء الحدث
			e.stopPropagation();

			const { scrollTop, scrollHeight, clientHeight } = scrollEl;
			const maxScroll = scrollHeight - clientHeight;
			if (maxScroll <= 0) return;

			// حساب delta الحقيقي بناءً على وضع عجلة الماوس (Lines vs Pixels)
			let delta = e.deltaY;
			if (e.deltaMode === 1) {
				// DOM_DELTA_LINE: شائع جداً في Windows (1 أو 3 أسطر)
				delta *= 36;
			} else if (e.deltaMode === 2) {
				delta *= clientHeight;
			}

			const targetScrollTop = Math.max(0, Math.min(maxScroll, scrollTop + delta));
			if (targetScrollTop !== scrollTop) {
				e.preventDefault();
				scrollEl.scrollTop = targetScrollTop;
			}
		};

		scrollEl.addEventListener("wheel", handleNativeWheel, { passive: false });
		popoverEl?.addEventListener("wheel", handleNativeWheel, { passive: false });

		return () => {
			scrollEl.removeEventListener("wheel", handleNativeWheel);
			popoverEl?.removeEventListener("wheel", handleNativeWheel);
		};
	}, [open, filteredRooms]);

	// معالجة اختيار الغرفة
	const handleSelectRoom = (room: RoomItem) => {
		if (availabilityState !== "ready" || room.isBooked) return;
		onChange(room.name, room.id, activeBranchId);
		setOpen(false);
	};

	const handleReset = () => {
		onChange("الغرفة", undefined, undefined);
		setOpen(false);
	};

	const isCustomSelected = value && value !== "الغرفة";

	return (
		<Popover
			open={open}
			onOpenChange={(isOpen) => {
				setOpen(isOpen);
				if (!isOpen) setSearchQuery("");
			}}
		>
			<PopoverTrigger asChild>
				<button
					type="button"
					title={value || "الغرفة"}
					className={cn(
						"h-6.5 px-2 rounded-md border text-[10.5px] font-medium flex items-center gap-1 transition-colors cursor-pointer min-w-0 whitespace-nowrap overflow-hidden",
						isCustomSelected
							? "border-[#4F6BF5]/40 bg-[#4F6BF5]/10 text-[#4F6BF5] font-semibold"
							: "border-border/80 bg-background hover:bg-muted text-foreground",
						!isAppointmentSelected && "opacity-80",
						className,
					)}
				>
					<span className="truncate min-w-0 flex-1 text-right whitespace-nowrap overflow-hidden text-ellipsis">
						{value || "الغرفة"}
					</span>
					<IconMapPin className="size-3 text-muted-foreground/80 shrink-0" />
				</button>
			</PopoverTrigger>

			<PopoverContent
				ref={popoverContentRef}
				side="top"
				align="start"
				sideOffset={8}
				data-radix-scroll-lock-ignore
				className="z-[99] w-72 p-2 bg-popover text-popover-foreground border border-border/80 shadow-2xl rounded-xl select-none"
				dir="rtl"
			>
				{/* ─── شرط التسلسل (Sequence): التحقق من تحديد الموعد أولاً ───── */}
				{!isAppointmentSelected ? (
					<div className="p-3 text-center space-y-2">
						<div className="flex items-center justify-center text-amber-500">
							<IconAlertCircle className="size-8 stroke-[1.5]" />
						</div>
						<div className="space-y-1">
							<p className="text-xs font-bold text-foreground">
								تحديد الموعد مطلوب أولاً
							</p>
							<p className="text-[11px] text-muted-foreground leading-relaxed">
								يجب اختيار تاريخ ووقت الموعد أولاً لتتمكن من فحص إتاحة الغرف وحجزها بدون تعارض.
							</p>
						</div>
						<button
							type="button"
							onClick={() => {
								setOpen(false);
								onOpenAppointmentPicker?.();
							}}
							className="w-full h-7 mt-1 rounded-md bg-[#5B50E5] hover:bg-[#4E43D8] text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
						>
							<IconCalendar className="size-3.5" />
							<span>تحديد تاريخ الموعد الآن</span>
						</button>
					</div>
				) : (
					/* ─── في حال تم تحديد الموعد: عرض قائمة الغرف المطابقة للتصميم ─ */
					<>
						{/* ترويسة البحث */}
						<div className="pb-1.5 mb-1.5 border-b border-border/60">
							<Input
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="اختر الغرفة..."
								className="h-7 text-xs bg-transparent border-0 shadow-none focus-visible:ring-0 px-1 text-right placeholder:text-muted-foreground/70"
								autoFocus
							/>
						</div>

						{availabilityState === "loading" && (
							<p className="px-1 pb-1.5 text-[10.5px] text-muted-foreground">جارِ التحقق من إتاحة الغرف…</p>
						)}
						{availabilityState === "error" && (
							<div className="mb-1.5 flex items-center justify-between gap-2 rounded-md bg-amber-50 px-2 py-1.5 text-[10.5px] text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
								<span>تعذر التحقق من إتاحة الغرف.</span>
								<button type="button" onClick={() => setAvailabilityRetry((value) => value + 1)} className="font-bold hover:underline">إعادة المحاولة</button>
							</div>
						)}

						{/* قائمة الغرف مع دعم كامل للـ Scroll بعجلة الماوس وشريط تمرير أنيق */}
						<div
							ref={scrollContainerRef}
							data-radix-scroll-lock-ignore
							style={{ overscrollBehavior: "contain" }}
							onWheel={(e) => {
								e.stopPropagation();
								const el = e.currentTarget;
								const maxScroll = el.scrollHeight - el.clientHeight;
								if (maxScroll <= 0) return;
								let delta = e.deltaY;
								if (e.deltaMode === 1) delta *= 36;
								else if (e.deltaMode === 2) delta *= el.clientHeight;
								const target = Math.max(0, Math.min(maxScroll, el.scrollTop + delta));
								if (target !== el.scrollTop) {
									el.scrollTop = target;
								}
							}}
							className="max-h-56 overflow-y-auto overscroll-contain space-y-0.5 p-0.5 select-none scrollbar-thin"
						>
							{isLoading ? (
								<div className="py-5 text-center text-xs text-muted-foreground">
									جاري تحميل الغرف من النظام...
								</div>
							) : filteredRooms.length > 0 ? (
								filteredRooms.map((room) => {
									const isSelected = value === room.name;
									const disabled = availabilityState !== "ready" || room.isBooked;

									return (
										<button
											key={room.id}
											type="button"
											disabled={disabled}
											onClick={() => handleSelectRoom(room)}
											title={room.isBooked ? "الغرفة محجوزة في هذا الوقت" : availabilityState !== "ready" ? "بانتظار التحقق من الإتاحة" : undefined}
											className={cn(
												"w-full flex items-center justify-between p-1.5 rounded-lg text-right transition-colors group",
												disabled ? "cursor-not-allowed opacity-55" : "cursor-pointer",
												isSelected ? "bg-muted/90" : !disabled && "hover:bg-muted/60",
											)}
										>
											{/* اليمين: مربع الاختيار المستدير + اسم الغرفة */}
											<div className="flex items-center gap-2 min-w-0">
												<div
													className={cn(
														"size-4 rounded border flex items-center justify-center transition-colors shrink-0",
														isSelected
															? "border-[#4F6BF5] bg-[#4F6BF5] text-white"
															: "border-border/80 bg-background group-hover:border-primary/50",
													)}
												>
													{isSelected && (
														<IconCheck className="size-3 stroke-[3]" />
													)}
												</div>
												<span
													className={cn(
														"text-xs truncate transition-colors",
														isSelected
															? "font-bold text-foreground"
															: "text-foreground",
													)}
												>
													{room.name}
												</span>
											</div>

											{/* الشمال: شارة محجوزة إن كانت محجوزة */}
											{room.isBooked && (
												<span className="px-1.5 py-0.5 rounded text-[9.5px] font-medium bg-[#FFEDD5] text-[#C2410C] dark:bg-orange-950 dark:text-orange-300 shrink-0">
													محجوزة
												</span>
											)}
										</button>
									);
								})
							) : (
								<div className="py-5 text-center text-xs text-muted-foreground">
									لا توجد قاعة بهذا الاسم
								</div>
							)}
						</div>

						{/* خيار إلغاء التعيين */}
						{value !== "الغرفة" && (
							<div className="p-1 mt-1 border-t border-border/50 bg-muted/20">
								<button
									type="button"
									onClick={handleReset}
									className="w-full py-1 text-center text-[10.5px] text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors cursor-pointer"
								>
									بدون غرفة (إلغاء التعيين)
								</button>
							</div>
						)}
					</>
				)}
			</PopoverContent>
		</Popover>
	);
}
