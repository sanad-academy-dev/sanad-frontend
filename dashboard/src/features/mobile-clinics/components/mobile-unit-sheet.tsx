import { zodResolver } from "@hookform/resolvers/zod";
import {
	IconAlertTriangle,
	IconBuildingWarehouse,
	IconCopy,
	IconDeviceMobile,
	IconPlus,
	IconTrash,
	IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { Controller, type Resolver, type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { InitialsAvatar } from "@/components/common/initials-avatar";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	MOBILE_UNIT_CREW_ROLE_LABELS,
	MOBILE_UNIT_CREW_ROLE_OPTIONS,
	MOBILE_UNIT_STATUS_META,
	MOBILE_UNIT_STATUS_OPTIONS,
} from "@/features/mobile-clinics/data/status-meta";
import { useMobileUnitMutations } from "@/features/mobile-clinics/hooks/use-mobile-unit-mutations";
import {
	useEligibleStaff,
	useMobileUnit,
	useMobileUnitActivity,
	useMobileUnitDevices,
} from "@/features/mobile-clinics/hooks/use-mobile-units";
import type { MobileUnitStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import {
	type AddCrewMemberFormInput,
	addCrewMemberSchema,
	type PairDeviceFormInput,
	pairDeviceSchema,
} from "@sanad/contracts/runtime/server/mobile-clinics/mobile-units/mobile-units.type";

const dateTimeFmt = new Intl.DateTimeFormat("ar-EG", {
	dateStyle: "medium",
	timeStyle: "short",
});

interface MobileUnitSheetProps {
	unitId: string | null;
	onClose: () => void;
}

export function MobileUnitSheet({ unitId, onClose }: MobileUnitSheetProps) {
	const { unit, isLoading } = useMobileUnit(unitId);

	return (
		<Sheet
			open={Boolean(unitId)}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<SheetContent
				side="left"
				showCloseButton={false}
				className="flex w-full flex-col gap-0 p-0 sm:max-w-[560px]!"
			>
				{/* رأس موحّد: border-b px-4 py-2 */}
				<div className="flex items-center gap-2 border-b px-4 py-2">
					<div className="flex min-w-0 flex-1 flex-col">
						<SheetTitle className="truncate text-sm font-semibold">
							{unit?.name ?? "الوحدة المتنقلة"}
						</SheetTitle>
						{unit && (
							<span
								dir="ltr"
								className="text-start font-mono text-[11px] text-muted-foreground"
							>
								{unit.code}
								{unit.plateNumber ? ` · ${unit.plateNumber}` : ""}
							</span>
						)}
					</div>
					<Button
						variant="ghost"
						size="icon"
						className="size-8"
						onClick={onClose}
						aria-label="إغلاق"
					>
						<IconX className="size-4" />
					</Button>
				</div>

				{isLoading || !unit ? (
					<div className="flex flex-1 items-center justify-center">
						<Spinner />
					</div>
				) : (
					<Tabs
						/* Radix يفرض dir="ltr" على جذر التبويبات ما لم يُمرَّر — وهو يقلب
						   محتوى كل تبويب داخل لوحة RTL. نفس ما يفعله payroll-report-sheet. */
						dir="rtl"
						defaultValue="overview"
						className="flex min-h-0 flex-1 flex-col gap-0"
					>
						<TabsList className="mx-4 mt-3 w-fit">
							<TabsTrigger value="overview">نظرة عامة</TabsTrigger>
							<TabsTrigger value="crew">الطاقم</TabsTrigger>
							<TabsTrigger value="devices">الأجهزة</TabsTrigger>
							<TabsTrigger value="activity">السجل</TabsTrigger>
						</TabsList>

						<TabsContent
							value="overview"
							className="min-h-0 flex-1 overflow-y-auto px-4 py-4"
						>
							<OverviewTab unitId={unit.id} />
						</TabsContent>

						<TabsContent
							value="crew"
							className="min-h-0 flex-1 overflow-y-auto px-4 py-4"
						>
							<CrewTab
								unitId={unit.id}
								branchId={unit.branchId}
							/>
						</TabsContent>

						<TabsContent
							value="devices"
							className="min-h-0 flex-1 overflow-y-auto px-4 py-4"
						>
							<DevicesTab unitId={unit.id} />
						</TabsContent>

						<TabsContent
							value="activity"
							className="min-h-0 flex-1 overflow-y-auto px-4 py-4"
						>
							<ActivityTab unitId={unit.id} />
						</TabsContent>
					</Tabs>
				)}
			</SheetContent>
		</Sheet>
	);
}

// ─── Overview ────────────────────────────────────────────

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
	<div className="flex items-center justify-between gap-3 py-2">
		<span className="text-xs text-muted-foreground">{label}</span>
		<span className="text-sm">{value}</span>
	</div>
);

function OverviewTab({ unitId }: { unitId: string }) {
	const { unit } = useMobileUnit(unitId);
	const { setUnitActive, setUnitStatus, isTogglingActive } = useMobileUnitMutations(unitId);
	if (!unit) return null;

	const meta = MOBILE_UNIT_STATUS_META[unit.status];
	const StatusIcon = meta.icon;

	return (
		<div className="flex flex-col gap-4">
			{!unit.active && (
				<div className="flex items-start gap-2 rounded-[4px] border border-destructive/30 bg-destructive/5 p-3">
					<IconAlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
					<div className="flex flex-col gap-0.5">
						<span className="text-sm font-medium text-destructive">الوحدة موقوفة إداريًّا</span>
						<span className="text-xs text-muted-foreground">
							تطبيق المركبة مقفل لدى الطاقم، ولا يمكن إسناد زيارات إليها.
						</span>
					</div>
				</div>
			)}

			<div className="rounded-[4px] border">
				<div className="flex items-center justify-between border-b px-3 py-2">
					<span className="text-xs font-semibold text-muted-foreground">الحالة التشغيلية</span>
					<span className={cn("inline-flex items-center gap-1.5 text-sm", meta.color)}>
						<StatusIcon className="size-4" />
						{meta.label}
					</span>
				</div>
				<div className="px-3 py-2">
					<Select
						dir="rtl"
						value={unit.status}
						onValueChange={(value) => setUnitStatus(unit.id, value as MobileUnitStatus)}
						disabled={!unit.active}
					>
						<SelectTrigger className="w-full text-sm">
							<SelectValue />
						</SelectTrigger>
						<SelectContent position="popper">
							{MOBILE_UNIT_STATUS_OPTIONS.map((option) => (
								<SelectItem
									key={option.value}
									value={option.value}
								>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="divide-y rounded-[4px] border px-3">
				<Row
					label="الفرع الأمّ"
					value={unit.branch?.name ?? "—"}
				/>
				<Row
					label="المستودع"
					value={
						<span className="inline-flex items-center gap-1.5">
							<IconBuildingWarehouse className="size-4 text-muted-foreground" />
							{unit.warehouse?.name ?? "—"}
						</span>
					}
				/>
				<Row
					label="المركبة"
					value={
						[unit.vehicleMake, unit.vehicleModel, unit.year].filter(Boolean).join(" ") || "—"
					}
				/>
				<Row
					label="اللون"
					value={unit.color ?? "—"}
				/>
				<Row
					label="آخر موقع"
					value={
						unit.lastLocationAt ? dateTimeFmt.format(new Date(unit.lastLocationAt)) : "لا يوجد"
					}
				/>
			</div>

			{unit.notes && (
				<div className="rounded-[4px] border p-3">
					<span className="text-xs font-semibold text-muted-foreground">ملاحظات</span>
					<p className="mt-1 whitespace-pre-wrap text-sm">{unit.notes}</p>
				</div>
			)}

			<Button
				variant={unit.active ? "outline" : "default"}
				size="sm"
				className={cn("self-start", unit.active && "text-destructive")}
				disabled={isTogglingActive}
				onClick={() => setUnitActive(unit.id, !unit.active)}
			>
				{unit.active ? "إيقاف الوحدة" : "تفعيل الوحدة"}
			</Button>
		</div>
	);
}

// ─── Crew [MC1.4] ────────────────────────────────────────

function CrewTab({ unitId, branchId }: { unitId: string; branchId: string }) {
	const { unit } = useMobileUnit(unitId);
	const { staff, isLoading: staffLoading } = useEligibleStaff(branchId);
	const { addCrewMember, removeCrewMember, isMutatingCrew } = useMobileUnitMutations(unitId);

	const {
		handleSubmit,
		control,
		reset,
		formState: { errors, isValid },
	} = useForm<AddCrewMemberFormInput>({
		resolver: zodResolver(addCrewMemberSchema) as Resolver<AddCrewMemberFormInput>,
		mode: "onChange",
		defaultValues: { isPrimary: false },
	});

	const crew = unit?.crew ?? [];
	const assigned = new Set(crew.map((member) => member.staffId));
	const candidates = staff.filter((member) => !assigned.has(member.id));

	const onSubmit: SubmitHandler<AddCrewMemberFormInput> = async (data) => {
		await addCrewMember(unitId, data);
		reset({ isPrimary: false });
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2 rounded-[4px] border p-3">
				<span className="text-xs font-semibold text-muted-foreground">إضافة عضو للطاقم</span>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-2"
				>
					<Controller
						name="staffId"
						control={control}
						render={({ field }) => (
							<Field data-invalid={!!errors.staffId}>
								<Select
									dir="rtl"
									value={field.value || undefined}
									onValueChange={field.onChange}
									disabled={isMutatingCrew || staffLoading || candidates.length === 0}
								>
									<SelectTrigger
										className="w-full text-sm"
										aria-invalid={!!errors.staffId}
									>
										<SelectValue placeholder="اختر موظفًا" />
									</SelectTrigger>
									<SelectContent position="popper">
										{candidates.map((member) => (
											<SelectItem
												key={member.id}
												value={member.id}
											>
												{member.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FieldError errors={[errors.staffId]} />
							</Field>
						)}
					/>

					<Controller
						name="role"
						control={control}
						render={({ field }) => (
							<Field data-invalid={!!errors.role}>
								<Select
									dir="rtl"
									value={field.value || undefined}
									onValueChange={field.onChange}
									disabled={isMutatingCrew}
								>
									<SelectTrigger
										className="w-full text-sm"
										aria-invalid={!!errors.role}
									>
										<SelectValue placeholder="الدور" />
									</SelectTrigger>
									<SelectContent position="popper">
										{MOBILE_UNIT_CREW_ROLE_OPTIONS.map((option) => (
											<SelectItem
												key={option.value}
												value={option.value}
											>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FieldError errors={[errors.role]} />
							</Field>
						)}
					/>

					<Button
						type="submit"
						size="sm"
						className="self-start"
						disabled={!isValid || isMutatingCrew}
					>
						<IconPlus className="size-3.5" />
						إضافة للطاقم
					</Button>
				</form>

				{/* الخادم يرشّح بـ mobileClinicAppointmentsEnabled، فالقائمة الفارغة سببها غالبًا
				    أنّ أحدًا لم يُفعَّل بعد — لا أنّ الأكاديمية بلا موظفين. */}
				{!staffLoading && candidates.length === 0 && (
					<span className="text-xs text-muted-foreground">
						لا يوجد موظفون مؤهّلون متاحون. فعّل «استقبال زيارات في أكاديمية متنقلة» من إعدادات جدولة
						الموظف أولًا.
					</span>
				)}
			</div>

			<div className="flex flex-col gap-2">
				{crew.length === 0 ? (
					<span className="py-6 text-center text-sm text-muted-foreground">
						لا يوجد أعضاء في الطاقم بعد.
					</span>
				) : (
					crew.map((member) => (
						<div
							key={member.id}
							className="flex items-center gap-3 rounded-[4px] border px-3 py-2"
						>
							<InitialsAvatar
								name={member.staff.name}
								className="size-8"
							/>
							<div className="flex min-w-0 flex-1 flex-col">
								<span className="truncate text-sm font-medium">{member.staff.name}</span>
								<span className="text-xs text-muted-foreground">
									{MOBILE_UNIT_CREW_ROLE_LABELS[member.role]}
									{member.isPrimary ? " · أساسي" : ""}
								</span>
							</div>
							<Button
								variant="ghost"
								size="icon"
								className="size-8 text-destructive"
								disabled={isMutatingCrew}
								onClick={() => removeCrewMember(unitId, member.id)}
								aria-label="إزالة من الطاقم"
							>
								<IconTrash className="size-4" />
							</Button>
						</div>
					))
				)}
			</div>
		</div>
	);
}

// ─── Devices [MC2.3] ─────────────────────────────────────

function DevicesTab({ unitId }: { unitId: string }) {
	const { devices, isLoading } = useMobileUnitDevices(unitId);
	const { pairDevice, revokeDevice, isPairingDevice, isRevokingDevice } =
		useMobileUnitMutations(unitId);

	// الرمز الخام يعيش في حالة المكوّن فقط، ويضيع بمجرّد إغلاق النافذة — كما يضيع من
	// الخادم لحظة إنشائه.
	const [issued, setIssued] = useState<{
		label: string;
		token: string;
		qrDataUri: string;
	} | null>(null);
	const [copied, setCopied] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm<PairDeviceFormInput>({
		resolver: zodResolver(pairDeviceSchema),
		mode: "onChange",
		defaultValues: { label: "" },
	});

	const onSubmit: SubmitHandler<PairDeviceFormInput> = async (data) => {
		const device = await pairDevice(unitId, { label: data.label.trim() });
		setIssued({ label: device.label, token: device.token, qrDataUri: device.qrDataUri });
		setCopied(false);
		reset({ label: "" });
	};

	const copyToken = async () => {
		if (!issued) return;
		try {
			await navigator.clipboard.writeText(issued.token);
			setCopied(true);
		} catch {
			toast.error("تعذّر النسخ — حدّد الرمز وانسخه يدويًا");
		}
	};

	return (
		<div className="flex flex-col gap-4">
			<Dialog
				open={Boolean(issued)}
				onOpenChange={(open) => {
					if (!open) setIssued(null);
				}}
			>
				<DialogContent
					className="max-h-[85vh] sm:max-w-[460px]"
					dir="rtl"
				>
					<DialogHeader>
						<DialogTitle className="text-sm font-semibold">
							رمز الجهاز «{issued?.label}»
						</DialogTitle>
					</DialogHeader>

					<div className="flex flex-col gap-3">
						<div className="flex items-start gap-2 rounded-[4px] border border-amber-500/30 bg-amber-500/5 p-3">
							<IconAlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
							<span className="text-xs text-muted-foreground">
								هذا الرمز يُعرض <strong className="text-foreground">مرّة واحدة فقط</strong> ولا
								يمكن استرجاعه. انسخه الآن وأدخله في تطبيق المركبة. إن فُقد، أبطل الجهاز وأصدر
								رمزًا جديدًا.
							</span>
						</div>

						{/*
						  [O4] رمز QR يُولَّد على الخادم ويصل صورةً جاهزة (data URI)، فلا مكتبة QR
						  في حزمة العميل. الطاقم يمسحه بكاميرا التطبيق بدل كتابة ٤٣–٦٤ محرفًا
						  يدويًّا من شاشة لن تُعرض ثانية. النصّ تحته يبقى: المسح قد يتعذّر.
						*/}
						{issued?.qrDataUri ? (
							<div className="flex justify-center rounded-[4px] border bg-white p-3">
								<img
									src={issued.qrDataUri}
									alt="رمز QR لاقتران الجهاز"
									className="size-44"
									// الصورة سرّ: لا تُرسل إلى أي مُحلِّل ولا تُحفظ بالسحب
									draggable={false}
								/>
							</div>
						) : null}

						{/* جزيرة LTR: الرمز base64url ولا يصحّ أن ينعكس */}
						<code
							dir="ltr"
							className="block max-h-32 overflow-y-auto rounded-[4px] border bg-muted p-3 text-start font-mono text-xs break-all select-all"
						>
							{issued?.token}
						</code>

						<Button
							size="sm"
							variant={copied ? "outline" : "default"}
							className="self-start"
							onClick={copyToken}
						>
							<IconCopy className="size-3.5" />
							{copied ? "تم النسخ" : "نسخ الرمز"}
						</Button>
					</div>

					<div className="flex justify-start border-t px-0 pt-3">
						<Button
							size="sm"
							variant="outline"
							onClick={() => setIssued(null)}
						>
							تم — أغلق
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			<div className="flex flex-col gap-2 rounded-[4px] border p-3">
				<span className="text-xs font-semibold text-muted-foreground">اقتران جهاز جديد</span>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-2"
				>
					<Field data-invalid={!!errors.label}>
						<Input
							placeholder="مثال: آيباد الوحدة ٣"
							className="text-sm"
							aria-invalid={!!errors.label}
							disabled={isPairingDevice}
							maxLength={80}
							{...register("label")}
						/>
						<FieldError errors={[errors.label]} />
					</Field>
					<Button
						type="submit"
						size="sm"
						className="self-start"
						disabled={!isValid || isPairingDevice}
					>
						<IconDeviceMobile className="size-3.5" />
						إصدار رمز اقتران
					</Button>
				</form>
			</div>

			{isLoading ? (
				<div className="flex justify-center py-6">
					<Spinner />
				</div>
			) : devices.length === 0 ? (
				<span className="py-6 text-center text-sm text-muted-foreground">
					لا توجد أجهزة مقترنة بعد.
				</span>
			) : (
				<div className="flex flex-col gap-2">
					{devices.map((device) => {
						const revoked = Boolean(device.revokedAt);
						return (
							<div
								key={device.id}
								className={cn(
									"flex items-center gap-3 rounded-[4px] border px-3 py-2",
									revoked && "opacity-60",
								)}
							>
								<div className="flex min-w-0 flex-1 flex-col gap-0.5">
									<div className="flex items-center gap-2">
										<span className="truncate text-sm font-medium">{device.label}</span>
										{revoked && (
											<span className="rounded-md bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
												مُبطَل
											</span>
										)}
									</div>
									<span
										dir="ltr"
										className="text-start font-mono text-[11px] text-muted-foreground"
									>
										{device.tokenPrefix}••••
										{device.platform ? ` · ${device.platform}` : ""}
										{device.appVersion ? ` · v${device.appVersion}` : ""}
									</span>
									<span className="text-[11px] text-muted-foreground">
										{device.lastSeenAt
											? `آخر ظهور: ${dateTimeFmt.format(new Date(device.lastSeenAt))}`
											: "لم يتصل بعد"}
									</span>
								</div>
								{!revoked && (
									<Button
										variant="ghost"
										size="icon"
										className="size-8 text-destructive"
										disabled={isRevokingDevice}
										onClick={() => revokeDevice(unitId, device.id)}
										aria-label="إبطال الجهاز"
									>
										<IconTrash className="size-4" />
									</Button>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

// ─── Activity ────────────────────────────────────────────

const ACTIVITY_LABELS: Record<string, string> = {
	CREATED: "أُنشئت الوحدة",
	UPDATED: "عُدّلت بيانات الوحدة",
	ENABLED: "فُعّلت الوحدة",
	DISABLED: "أُوقفت الوحدة",
	DELETED: "حُذفت الوحدة",
	STATUS_CHANGED: "تغيّرت الحالة التشغيلية",
	CREW_ADDED: "أُضيف عضو للطاقم",
	CREW_REMOVED: "أُزيل عضو من الطاقم",
	DEVICE_PAIRED: "رُبط جهاز بالمركبة",
	DEVICE_REVOKED: "أُبطل جهاز المركبة",
	SHIFT_STARTED: "بدأت وردية",
	SHIFT_ENDED: "انتهت وردية",
	STOCK_RECEIVED: "استلمت الوحدة مخزونًا",
	VISIT_ASSIGNED: "أُسندت زيارة",
	VISIT_UNASSIGNED: "أُلغي إسناد زيارة",
};

function ActivityTab({ unitId }: { unitId: string }) {
	const { activity, isLoading } = useMobileUnitActivity(unitId);

	if (isLoading) {
		return (
			<div className="flex justify-center py-8">
				<Spinner />
			</div>
		);
	}

	if (activity.length === 0) {
		return (
			<span className="block py-6 text-center text-sm text-muted-foreground">
				لا يوجد نشاط مسجّل.
			</span>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			{activity.map((entry) => (
				<div
					key={entry.id}
					className="flex flex-col gap-0.5 rounded-[4px] border px-3 py-2"
				>
					<span className="text-sm">{ACTIVITY_LABELS[entry.type] ?? entry.type}</span>
					{entry.body && <span className="text-xs text-muted-foreground">{entry.body}</span>}
					<span className="text-[11px] text-muted-foreground tabular-nums">
						{dateTimeFmt.format(new Date(entry.createdAt))}
						{entry.author?.name ? ` · ${entry.author.name}` : ""}
					</span>
				</div>
			))}
		</div>
	);
}
