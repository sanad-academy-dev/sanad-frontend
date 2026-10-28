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
	IconX,
	IconAlertCircle,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useClassrooms } from "@/features/services/classrooms/hooks/use-classrooms";

interface RoomPickerPopoverProps {
	value: string;
	onChange: (roomName: string) => void;
	appointmentDate: string;
	onOpenAppointmentPicker?: () => void;
	className?: string;
}

export interface RoomItem {
	id: string;
	name: string;
	isBooked: boolean;
}

// قائمة القاعات والمعامل التقنية بالأكاديمية (شاملة مطابقة للتصميم والاحتياج)
export const DEFAULT_ACADEMY_ROOMS: RoomItem[] = [
	{ id: "room-1", name: "غرفة فحص", isBooked: true },
	{ id: "room-2", name: "غرفة الطوارئ", isBooked: false },
	{ id: "room-3", name: "معمل البرمجة والذكاء الاصطناعي", isBooked: false },
	{ id: "room-4", name: "قاعة الروبوتيكس والابتكار", isBooked: false },
	{ id: "room-5", name: "مختبر تحليل البيانات", isBooked: false },
	{ id: "room-6", name: "قاعة التقييم والقبول الأكاديمي", isBooked: false },
	{ id: "room-7", name: "غرفة المقابلات والاستشارات", isBooked: false },
	{ id: "room-8", name: "قاعة ريادة الأعمال وتطوير الألعاب", isBooked: false },
	{ id: "room-9", name: "غرفة الأنشطة والمشاريع", isBooked: false },
	{ id: "room-10", name: "قاعة المحاضرات الكبرى", isBooked: false },
	{ id: "room-11", name: "معمل الأمن السيبراني والشبكات", isBooked: false },
	{ id: "room-12", name: "قاعة ورش العمل التفاعلية", isBooked: false },
];

export function RoomPickerPopover({
	value,
	onChange,
	appointmentDate,
	onOpenAppointmentPicker,
	className,
}: RoomPickerPopoverProps) {
	const [open, setOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [warningRoom, setWarningRoom] = useState<RoomItem | null>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const popoverContentRef = useRef<HTMLDivElement>(null);

	// ربط القاعات مع فصول وقاعات النظام المعتمدة
	const { classrooms = [], isLoading } = useClassrooms();

	// التحقق من شرط التسلسل: هل تم اختيار موعد أولاً؟
	const isAppointmentSelected =
		Boolean(appointmentDate) && appointmentDate !== "تاريخ الموعد";

	// دمج قاعات النظام مع القائمة المعتمدة لضمان وجود خيارات كافية وقابلة للتمرير دائماً
	const roomsList: RoomItem[] = useMemo(() => {
		if (classrooms && classrooms.length > 0) {
			const sysRooms: RoomItem[] = classrooms.map((c, idx) => ({
				id: c.id,
				name: c.name || `قاعة ${c.roomNumber || idx + 1}`,
				isBooked: idx === 0,
			}));
			const names = new Set(sysRooms.map((r) => r.name));
			const merged = [...sysRooms];
			for (const r of DEFAULT_ACADEMY_ROOMS) {
				if (!names.has(r.name)) {
					merged.push(r);
				}
			}
			return merged;
		}
		return DEFAULT_ACADEMY_ROOMS;
	}, [classrooms]);

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
	const handleSelectRoom = (room: RoomItem, force = false) => {
		if (room.isBooked && !force) {
			// إظهار التنبيه: هذه الغرفة محجوزة في نفس الوقت
			setWarningRoom(room);
			return;
		}

		onChange(room.name);
		setWarningRoom(null);
		setOpen(false);
	};

	const handleReset = () => {
		onChange("الغرفة");
		setWarningRoom(null);
		setOpen(false);
	};

	const isCustomSelected = value && value !== "الغرفة";

	return (
		<Popover
			open={open}
			onOpenChange={(isOpen) => {
				setOpen(isOpen);
				if (!isOpen) {
					setWarningRoom(null);
					setSearchQuery("");
				}
			}}
		>
			<PopoverTrigger asChild>
				<button
					type="button"
					className={cn(
						"h-6.5 px-2 rounded-md border text-[10.5px] font-medium flex items-center gap-1 transition-colors cursor-pointer",
						isCustomSelected
							? "border-[#4F6BF5]/40 bg-[#4F6BF5]/10 text-[#4F6BF5] font-semibold"
							: "border-border/80 bg-background hover:bg-muted text-foreground",
						!isAppointmentSelected && "opacity-80",
						className,
					)}
				>
					<span>{value || "الغرفة"}</span>
					<IconMapPin className="size-3 text-muted-foreground/80" />
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

						{/* شريط التحذير إذا كانت الغرفة محجوزة (مطابق تماماً لصورة المستخدم 8dc33446) */}
						{warningRoom && (
							<div className="bg-[#FFFDF5] dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 rounded-lg p-2 flex items-center justify-between text-xs mb-1.5 animate-in fade-in">
								<div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-200 font-semibold text-[11px]">
									<span>هذه الغرفة محجوزة في نفس الوقت.</span>
								</div>
								<div className="flex items-center gap-2">
									<button
										type="button"
										onClick={() => handleSelectRoom(warningRoom, true)}
										className="text-amber-900 dark:text-amber-300 font-bold hover:underline cursor-pointer text-[11px]"
									>
										متابعة
									</button>
									<button
										type="button"
										onClick={() => setWarningRoom(null)}
										className="text-muted-foreground hover:text-foreground cursor-pointer"
										title="إلغاء"
									>
										<IconX className="size-3.5" />
									</button>
								</div>
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
							className="max-h-56 overflow-y-auto overscroll-contain space-y-0.5 p-0.5 select-none [scrollbar-width:thin] [scrollbar-color:hsl(var(--muted-foreground)/0.3)_transparent]"
						>
							{isLoading ? (
								<div className="py-5 text-center text-xs text-muted-foreground">
									جاري تحميل الغرف من النظام...
								</div>
							) : filteredRooms.length > 0 ? (
								filteredRooms.map((room) => {
									const isSelected = value === room.name;

									return (
										<button
											key={room.id}
											type="button"
											onClick={() => handleSelectRoom(room)}
											className={cn(
												"w-full flex items-center justify-between p-1.5 rounded-lg text-right transition-colors cursor-pointer group",
												isSelected ? "bg-muted/90" : "hover:bg-muted/60",
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
