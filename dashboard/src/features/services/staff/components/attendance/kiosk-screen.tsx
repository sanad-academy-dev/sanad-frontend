import {
	IconCheck,
	IconClock,
	IconHash,
	IconLayoutGrid,
	IconLock,
	IconLogin2,
	IconLogout,
	IconQrcode,
	IconSearch,
	IconUser,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { AttendanceRegisterDialog } from "@/features/services/staff/components/attendance/attendance-register-dialog";
import { KioskPinDialog } from "@/features/services/staff/components/attendance/kiosk-pin-dialog";
import { useAttendance } from "@/features/services/staff/hooks/use-attendance";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { cn } from "@/lib/utils";
import type { AttendanceResponse } from "@/server/attendance/attendance.type";

function initialsOf(name: string) {
	return name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
}

const fmtTime = (iso: string | Date | null) => (iso ? format(new Date(iso), "HH:mm") : "");

type CellState = "present" | "left" | "absent";

// حالة الخلية من سجل اليوم
function cellState(r: AttendanceResponse | undefined): CellState {
	if (r?.checkOut) return "left";
	if (r?.status === "PRESENT" && r.checkIn) return "present";
	return "absent";
}

const FILTERS = [
	{ key: "all", label: "الكل" },
	{ key: "present", label: "حاضر" },
	{ key: "left", label: "انصراف" },
	{ key: "absent", label: "لم يحضر" },
] as const;

// بطاقة إحصائية علوية — كل المحتوى على يمين البوكس (RTL)
function StatCard({ value, label }: { value: string; label: string }) {
	return (
		<div className="flex h-[55px] flex-1 items-center justify-start gap-2 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-3">
			<div className="flex items-center gap-1.5 text-[12px] font-medium text-[#08090A]">
				<span>{label}</span>
				<IconUser className="size-2.5" />
			</div>
			<span className="text-[14px] font-bold text-[#08090A] tabular-nums">{value}</span>
		</div>
	);
}

export function KioskScreen({ open, onExit }: { open: boolean; onExit: () => void }) {
	const { staff } = useStaff();
	const today = useMemo(() => new Date(), []);
	const { records } = useAttendance(today, today);

	const [now, setNow] = useState(() => new Date());
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
	// التبويب النشط: الشبكة / QR Code / إدخال PIN Code
	const [view, setView] = useState<"grid" | "pin" | "qr">("grid");
	const [pinCode, setPinCode] = useState("");
	const [pinError, setPinError] = useState(false);
	const [pinSuccess, setPinSuccess] = useState(false);
	// حوار رمز PIN للخروج من وضع الكشك
	const [exitOpen, setExitOpen] = useState(false);
	// خلية تسجيل الحضور/الانصراف المفتوحة في الحوار
	const [registerCell, setRegisterCell] = useState<{
		staffId: string;
		staffName: string;
		staffCode: string;
		defaultCheckIn?: string;
		defaultCheckOut?: string;
		withCheckout?: boolean;
	} | null>(null);

	// ساعة حيّة في الرأس
	useEffect(() => {
		if (!open) return;
		const t = setInterval(() => setNow(new Date()), 1000 * 30);
		return () => clearInterval(t);
	}, [open]);

	const recordByStaff = useMemo(() => {
		const map = new Map<string, (typeof records)[number]>();
		for (const r of records) map.set(r.staffId, r);
		return map;
	}, [records]);

	const rows = useMemo(() => {
		const q = search.trim().toLowerCase();
		return staff
			.map((s) => ({
				staff: s,
				state: cellState(recordByStaff.get(s.id)),
				record: recordByStaff.get(s.id),
			}))
			.filter(({ staff: s, state }) => {
				if (q && !s.name.toLowerCase().includes(q) && !s.code.toLowerCase().includes(q)) {
					return false;
				}
				if (filter !== "all" && state !== filter) return false;
				return true;
			});
	}, [staff, search, filter, recordByStaff]);

	const stats = useMemo(() => {
		const present = staff.filter(
			(s) => cellState(recordByStaff.get(s.id)) === "present",
		).length;
		const left = staff.filter((s) => cellState(recordByStaff.get(s.id)) === "left").length;
		const leave = records.filter((r) => r.status === "LEAVE").length;
		const absent = staff.length - present - left - leave;
		const compliance = staff.length ? Math.round(((present + left) / staff.length) * 100) : 0;
		return { total: staff.length, present, absent: Math.max(absent, 0), leave, compliance };
	}, [staff, records, recordByStaff]);

	// بحث بالـ PIN Code: يجد الموظف بالكود ويفتح تسجيل الحضور/الانصراف حسب حالته
	const handlePinSearch = () => {
		const q = pinCode.trim().toLowerCase();
		if (!q) return;
		const found = staff.find(
			(s) => s.code.toLowerCase() === q || s.code.toLowerCase().includes(q),
		);
		if (!found) {
			setPinError(true);
			return;
		}
		const record = recordByStaff.get(found.id);
		const st = cellState(record);
		if (st === "left") {
			toast.error("هذا الموظف سجّل حضوره وانصرافه اليوم", { position: "bottom-left" });
			return;
		}
		setPinError(false);
		setPinSuccess(true);
		if (st === "present") {
			setRegisterCell({
				staffId: found.id,
				staffName: found.name,
				staffCode: found.code,
				defaultCheckIn: fmtTime(record?.checkIn ?? null),
				defaultCheckOut: format(new Date(), "HH:mm"),
				withCheckout: true,
			});
		} else {
			setRegisterCell({
				staffId: found.id,
				staffName: found.name,
				staffCode: found.code,
				defaultCheckIn: format(new Date(), "HH:mm"),
			});
		}
	};

	if (!open) return null;

	return (
		<div
			dir="rtl"
			className="fixed inset-0 z-50 flex flex-col bg-[#F5F5F5]"
		>
			{/* الرأس */}
			<header className="flex items-center justify-between border-b border-[#E5E5E5] bg-white px-4 py-2">
				<div className="flex items-center gap-3">
					<span className="flex size-7 items-center justify-center rounded-[4px] bg-[#6366F1]/10 text-[10px] font-bold text-[#6366F1]">
						لوجو
					</span>
					<div className="flex flex-col leading-tight">
						<span className="text-[14px] font-bold text-[#6366F1]">وضع الكشك</span>
						<span className="text-[11px] text-[#9B9B9D]">مركز إليت فيت للطب البيطري</span>
					</div>
					<div className="flex flex-col items-start ps-3 leading-tight">
						<span className="text-[12px] font-bold text-[#6366F1] tabular-nums">
							{format(now, "hh:mm a")}
						</span>
						<span className="text-[11px] text-[#08090A]">
							{format(now, "EEEE، d MMMM yyyy", { locale: arSA })}
						</span>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<div className="flex items-center gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] p-0.5">
						<button
							type="button"
							onClick={() => setView("grid")}
							className={cn(
								"flex items-center gap-1 rounded-[4px] px-2 py-1 text-[11px] font-medium",
								view === "grid" ? "bg-[#6366F1] text-white" : "text-[#6B7280] hover:bg-muted",
							)}
						>
							<IconLayoutGrid className="size-3" />
							الشبكة
						</button>
						<button
							type="button"
							onClick={() => setView("qr")}
							className={cn(
								"flex items-center gap-1 rounded-[4px] px-2 py-1 text-[11px] font-medium",
								view === "qr" ? "bg-[#6366F1] text-white" : "text-[#6B7280] hover:bg-muted",
							)}
						>
							<IconQrcode className="size-3" />
							QR Code
						</button>
						<button
							type="button"
							onClick={() => setView("pin")}
							className={cn(
								"flex items-center gap-1 rounded-[4px] px-2 py-1 text-[11px] font-medium",
								view === "pin" ? "bg-[#6366F1] text-white" : "text-[#6B7280] hover:bg-muted",
							)}
						>
							<IconHash className="size-3" />
							PIN Code
						</button>
					</div>
					<button
						type="button"
						onClick={() => setExitOpen(true)}
						className="flex items-center gap-1.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-2.5 py-1.5 text-[11px] font-medium text-[#08090A] hover:bg-muted"
					>
						<IconLock className="size-3.5" />
						خروج
					</button>
				</div>
			</header>

			{/* شاشة مسح QR (واجهة فقط حاليًا) */}
			{view === "qr" && (
				<div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-4">
					<div className="flex size-44 items-center justify-center rounded-[4px] border-2 border-dashed border-[#E5E5E5] bg-white">
						<IconQrcode className="size-24 text-[#9B9B9D]" />
					</div>
					<div className="flex flex-col items-center gap-1">
						<span className="text-[14px] font-bold text-[#08090A]">مسح رمز QR</span>
						<span className="text-[11px] text-[#9B9B9D]">
							امسح رمز QR الخاص بك للتسجيل السريع
						</span>
					</div>
					<span className="rounded-full bg-[#6366F1]/10 px-3 py-1 text-[11px] font-medium text-[#6366F1]">
						قريباً
					</span>
				</div>
			)}

			{/* صفحة إدخال PIN Code */}
			{view === "pin" && (
				<div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-4">
					<div className="flex size-10 items-center justify-center rounded-full bg-[#6366F1]/10">
						<IconHash className="size-5 text-[#6366F1]" />
					</div>
					<div className="flex flex-col items-center gap-1">
						<span className="text-[14px] font-bold text-[#08090A]">تسجيل بـ PIN Code</span>
						<span className="text-[11px] text-[#9B9B9D]">
							أدخل رقم PIN Code الخاص بك للتسجيل السريع
						</span>
					</div>
					<div className="flex w-full max-w-[340px] flex-col gap-2">
						<span className="text-right text-[11px] font-medium text-[#08090A]">
							رمز PIN Code
						</span>
						<div className="relative">
							<input
								value={pinCode}
								onChange={(e) => {
									setPinCode(e.target.value);
									setPinError(false);
									setPinSuccess(false);
								}}
								onKeyDown={(e) => e.key === "Enter" && handlePinSearch()}
								placeholder="مثال: 12344"
								className={cn(
									"h-9 w-full rounded-[4px] border-[0.75px] bg-white px-3 text-right text-[12px] text-[#08090A] outline-none placeholder:text-[#08090A]/40",
									pinSuccess ? "pl-9" : "",
									pinError ? "border-[#DC2626]" : "border-[#E5E5E5]",
								)}
							/>
							{pinSuccess && (
								<span className="absolute left-2 top-1/2 flex size-3.5 -translate-y-1/2 items-center justify-center rounded-full bg-[#16A34A]">
									<IconCheck className="size-2.5 text-white" />
								</span>
							)}
						</div>
						{pinError && (
							<span className="text-right text-[11px] font-medium text-[#EF4444]">
								الرمز خطأ، حاول مرة أخري ادخال الرمز الصحيح
							</span>
						)}
						<button
							type="button"
							onClick={handlePinSearch}
							disabled={!pinCode.trim()}
							className="h-9 w-full rounded-[4px] bg-[#6366F1] text-[12px] font-medium primaryhover:bg-[#6366F1]/90 disabled:bg-[#F0F0F0] disabled:text-[#9B9B9D]"
						>
							بحث
						</button>
						<span className="text-center text-[10px] text-[#9B9B9D]">
							سيتم تحديد إجراء الحضور أو الانصراف تلقائياً بناءً على حالة الموظف
						</span>
					</div>
				</div>
			)}

			{/* الإحصائيات */}
			{view === "grid" && (
				<>
					<div className="flex gap-2 px-4 pt-3">
						<StatCard
							value={`${stats.total}`}
							label="# الموظفين"
						/>
						<StatCard
							value={`${stats.present}`}
							label="# حاضرين"
						/>
						<StatCard
							value={`${stats.absent}`}
							label="# غائبين"
						/>
						<StatCard
							value={`${stats.leave}`}
							label="# في أجازة"
						/>
						<StatCard
							value={`${stats.compliance}%`}
							label="معدل الالتزام بالدوام"
						/>
					</div>

					{/* الفلتر + البحث */}
					<div className="flex items-center gap-3 px-4 py-3">
						<div className="relative flex-1">
							<IconSearch className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#9B9B9D]" />
							<input
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="ابحث بالاسم أو الرقم..."
								className="h-9 w-full rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white pr-9 pl-3 text-right text-[12px] text-[#08090A] outline-none placeholder:text-[#9B9B9D]"
							/>
						</div>
						<div className="flex items-center gap-1">
							{FILTERS.map((f) => (
								<button
									key={f.key}
									type="button"
									onClick={() => setFilter(f.key)}
									className={cn(
										"rounded-[4px] px-3 py-1.5 text-[12px] font-medium",
										filter === f.key
											? "bg-[#08090A] text-white"
											: "text-[#6B7280] hover:bg-muted",
									)}
								>
									{f.label}
								</button>
							))}
						</div>
					</div>

					{/* الشبكة */}
					<div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
						<div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
							{rows.map(({ staff: s, state, record }) => (
								<div
									key={s.id}
									className="flex flex-col items-center gap-2 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white p-3"
								>
									<span className="flex size-11 items-center justify-center rounded-full bg-[#6366F1] text-[13px] font-bold text-white">
										{initialsOf(s.name)}
									</span>
									<div className="flex flex-col items-center gap-0.5">
										<span className="text-[13px] font-bold text-[#08090A]">{s.name}</span>
										<span className="text-[10px] text-[#9B9B9D]">
											{s.role?.name ?? "—"} · {s.code}
										</span>
									</div>

									{/* الحالة */}
									{state === "absent" ? (
										<span className="flex items-center gap-1 text-[10px] font-medium text-[#EF4444]">
											لم يحضر
											<IconClock className="size-2.5" />
										</span>
									) : (
										<span className="flex items-center gap-[3px] rounded-[4px] bg-[#16A34A]/[0.08] px-1.5 py-[1.5px] text-[9px] font-medium text-[#16A34A]">
											{state === "left"
												? `انصرف ${fmtTime(record?.checkOut ?? null)}`
												: `حاضر منذ ${fmtTime(record?.checkIn ?? null)}`}
											<IconClock className="size-2" />
										</span>
									)}

									{/* الإجراء */}
									{state === "present" ? (
										<button
											type="button"
											onClick={() =>
												setRegisterCell({
													staffId: s.id,
													staffName: s.name,
													staffCode: s.code,
													defaultCheckIn: fmtTime(record?.checkIn ?? null),
													// وقت الانصراف = لحظة الضغط
													defaultCheckOut: format(new Date(), "HH:mm"),
													withCheckout: true,
												})
											}
											className="flex h-8 w-full items-center justify-center gap-1.5 rounded-[4px] border border-[#6366F1] bg-white text-[11px] font-semibold text-[#6366F1] hover:bg-[#6366F1]/5"
										>
											<IconLogout className="size-3" />
											تسجيل انصراف
										</button>
									) : state === "absent" ? (
										<button
											type="button"
											onClick={() =>
												setRegisterCell({
													staffId: s.id,
													staffName: s.name,
													staffCode: s.code,
													// وقت الحضور = لحظة الضغط
													defaultCheckIn: format(new Date(), "HH:mm"),
												})
											}
											className="flex h-8 w-full items-center justify-center gap-1.5 rounded-[4px] border-[0.75px] border-[#16A34A]/40 text-[12px] font-medium text-[#16A34A] hover:bg-[#16A34A]/5"
										>
											<IconLogin2 className="size-3.5" />
											تسجيل حضور
										</button>
									) : (
										<div className="flex h-8 w-full items-center justify-center rounded-[4px] bg-[#F5F5F5] text-[12px] font-medium text-[#9B9B9D]">
											اكتمل الدوام
										</div>
									)}
								</div>
							))}
							{rows.length === 0 && (
								<div className="col-span-full py-16 text-center text-sm text-muted-foreground">
									لا يوجد موظفين مطابقين
								</div>
							)}
						</div>
					</div>
				</>
			)}

			{/* حوار تسجيل الحضور/الانصراف */}
			<AttendanceRegisterDialog
				open={!!registerCell}
				staffId={registerCell?.staffId ?? null}
				staffName={registerCell?.staffName ?? null}
				staffCode={registerCell?.staffCode ?? null}
				date={today}
				defaultCheckInTime={registerCell?.defaultCheckIn}
				defaultCheckOutTime={registerCell?.defaultCheckOut}
				defaultShowCheckOut={registerCell?.withCheckout}
				onClose={() => {
					setRegisterCell(null);
					setPinCode("");
					setPinSuccess(false);
				}}
			/>

			{/* حوار رمز PIN للخروج من وضع الكشك */}
			<KioskPinDialog
				open={exitOpen}
				onClose={() => setExitOpen(false)}
				onUnlocked={onExit}
				title="رمز الخروج"
				subtitle="أدخل رمز PIN للخروج من وضع الكشك"
				successMessage="تم تسجيل خروج بنجاح من وضع الكشك"
			/>
		</div>
	);
}
