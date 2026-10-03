import {
	IconAlertOctagon,
	IconBox,
	IconBuilding,
	IconChevronLeft,
	IconChevronRight,
	IconSettings,
	IconTrash,
	IconUsers,
} from "@tabler/icons-react";
import { type ReactNode, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";
import {
	SchedulingContent,
	ServicesContent,
} from "@/features/services/staff/components/tabs/scheduling-tab";
import { AttendanceContent } from "@/features/services/staff/components/tabs/settings/attendance-content";
import { PayrollContent } from "@/features/services/staff/components/tabs/settings/payroll-content";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { useStaffServices } from "@/features/services/staff/hooks/use-staff-services";
import type { StaffTabProps } from "@/features/services/staff/types/tabs.types";
import { cn } from "@/lib/utils";

/** Which settings sub-view is drilled into; `null` = the root list. */
type SettingsView = "scheduling" | "attendance" | "services" | "payroll";

function SectionLabel({ children }: { children: ReactNode }) {
	return <p className="px-1 text-[11px] font-medium text-muted-foreground">{children}</p>;
}

function SettingsCard({ children }: { children: ReactNode }) {
	return <div className="divide-y rounded-lg border">{children}</div>;
}

function RowShell({
	icon,
	title,
	description,
	trailing,
	onClick,
}: {
	icon: ReactNode;
	title: string;
	description: ReactNode;
	trailing: ReactNode;
	onClick?: () => void;
}) {
	const content = (
		<>
			<div className="flex min-w-0 items-center gap-3">
				<span className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground">
					{icon}
				</span>
				<div className="flex min-w-0 flex-col">
					<span className="truncate text-sm font-semibold text-foreground">{title}</span>
					<span className="truncate text-xs text-muted-foreground">{description}</span>
				</div>
			</div>
			<div className="flex shrink-0 items-center gap-2">{trailing}</div>
		</>
	);

	if (onClick) {
		return (
			<button
				type="button"
				onClick={onClick}
				className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-start transition-colors hover:bg-muted/50"
			>
				{content}
			</button>
		);
	}

	return (
		<div className="flex w-full items-center justify-between gap-3 px-3 py-2.5">{content}</div>
	);
}

/** A read-only meta line (e.g. "مفعل • دوام كامل • مدرّب") followed by a chevron. */
function MetaChevron({ meta }: { meta: string }) {
	return (
		<>
			<span className="text-xs text-muted-foreground">{meta}</span>
			<IconChevronLeft className="size-4 text-muted-foreground" />
		</>
	);
}

/** Header shown at the top of a drilled-in sub-view: a back button + title. */
function DrillHeader({ title, onBack }: { title: string; onBack: () => void }) {
	return (
		<div className="flex items-center gap-2">
			<Button
				type="button"
				variant="ghost"
				size="icon"
				className="size-8"
				onClick={onBack}
				aria-label="رجوع"
			>
				<IconChevronRight className="size-4" />
			</Button>
			<span className="text-sm font-semibold">{title}</span>
		</div>
	);
}

export function SettingsTab({ staffId }: StaffTabProps) {
	const { staff: allStaff } = useStaff();
	const staff = allStaff.find((s) => s.id === staffId);
	const { services } = useStaffServices(staffId);

	const [view, setView] = useState<SettingsView | null>(null);

	const activeServicesCount = services.filter((s) => s.isActive).length;
	const branchName = staff?.branch?.name ?? "—";
	const isActive = staff?.active ?? true;

	if (view === "scheduling") {
		return (
			<TabsContent
				value="settings"
				className="m-0 flex flex-col gap-4 p-4"
				dir="rtl"
			>
				<DrillHeader
					title="الجدولة"
					onBack={() => setView(null)}
				/>
				<SchedulingContent staffId={staffId} />
			</TabsContent>
		);
	}

	if (view === "attendance") {
		return (
			<TabsContent
				value="settings"
				className="m-0 flex flex-col gap-4 p-4"
				dir="rtl"
			>
				<DrillHeader
					title="الحضور والانصراف"
					onBack={() => setView(null)}
				/>
				<AttendanceContent staffId={staffId} />
			</TabsContent>
		);
	}

	if (view === "services") {
		return (
			<TabsContent
				value="settings"
				className="m-0 flex flex-col gap-4 p-4"
				dir="rtl"
			>
				<DrillHeader
					title="الدورات"
					onBack={() => setView(null)}
				/>
				<ServicesContent staffId={staffId} />
			</TabsContent>
		);
	}

	if (view === "payroll") {
		return (
			<TabsContent
				value="settings"
				className="m-0 flex flex-col gap-4 p-4"
				dir="rtl"
			>
				<DrillHeader
					title="الرواتب"
					onBack={() => setView(null)}
				/>
				<PayrollContent staffId={staffId} />
			</TabsContent>
		);
	}

	return (
		<TabsContent
			value="settings"
			className="m-0 flex flex-col gap-6 p-4"
			dir="rtl"
		>
			{/* الحساب — قدرات وإعدادات الموظف */}
			<div className="flex flex-col gap-2">
				<SectionLabel>الحساب</SectionLabel>
				<SettingsCard>
					<RowShell
						icon={<IconSettings className="size-4" />}
						title="عام"
						description="تحكم في قدرات الموظف داخل الأكاديمية/ المستشفي"
						trailing={<MetaChevron meta="مفعل • دوام كامل • مدرّب" />}
						onClick={() => {}}
					/>
					<RowShell
						icon={<IconUsers className="size-4" />}
						title="الجدولة"
						description="أدر في أيام عمل وساعات عمل ومناوبات ووقت استراحة الموظف"
						trailing={<MetaChevron meta="6 أيام عمل • 8 ساعات يوميًا" />}
						onClick={() => setView("scheduling")}
					/>
					<RowShell
						icon={<IconUsers className="size-4" />}
						title="الحضور والانصراف"
						description="أدر في حضور وانصراف الموظف، والإجازات، وسياسات التأخير والعمل الإضافي."
						trailing={
							<MetaChevron meta="دوام كلي • الشفت الصباحي • PIN Code • فترة سماح 15 دقيقة" />
						}
						onClick={() => setView("attendance")}
					/>
					<RowShell
						icon={<IconUsers className="size-4" />}
						title="الرواتب"
						description="حدد الراتب الأساسي والبدلات الثابتة وبيانات الصرف"
						trailing={<MetaChevron meta="الراتب والبدلات وبيانات الصرف" />}
						onClick={() => setView("payroll")}
					/>
					<RowShell
						icon={<IconBox className="size-4" />}
						title="الدورات"
						description="أضف الدورات التي يقدمها الموظف"
						trailing={<MetaChevron meta={`${activeServicesCount} دورات مفعلة`} />}
						onClick={() => setView("services")}
					/>
				</SettingsCard>
			</div>

			{/* الحساب — إجراءات على حساب الموظف */}
			<div className="flex flex-col gap-2">
				<SectionLabel>الحساب</SectionLabel>
				<SettingsCard>
					<RowShell
						icon={<IconBuilding className="size-4" />}
						title="تعين بالفرع"
						description="حدد الفرع الذي يعمل فيه الموظف."
						trailing={
							<Select
								dir="rtl"
								value={staff?.branch?.id}
							>
								<SelectTrigger
									size="sm"
									className="h-8"
								>
									<SelectValue placeholder={branchName} />
								</SelectTrigger>
								<SelectContent>
									{staff?.branch ? (
										<SelectItem value={staff.branch.id}>{staff.branch.name}</SelectItem>
									) : null}
								</SelectContent>
							</Select>
						}
					/>
					<RowShell
						icon={<IconAlertOctagon className="size-4" />}
						title="حالة الموظف"
						description={
							<span className="flex items-center gap-1.5">
								{isActive ? "مفعل" : "غير مفعل"}
								<span
									className={cn(
										"size-1.5 rounded-full",
										isActive ? "bg-emerald-500" : "bg-muted-foreground/40",
									)}
								/>
							</span>
						}
						trailing={
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="h-8 text-destructive hover:text-destructive"
							>
								{isActive ? "تعطيل" : "تفعيل"}
							</Button>
						}
					/>
					<RowShell
						icon={<IconTrash className="size-4" />}
						title="حذف الموظف"
						description="بمجرد حذف الموظف، سيدخل الأرشفة ويمكن استعادته من هناك قبل مرور 30 يوم من تاريخه قبل الحذف النهائي."
						trailing={
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="h-8 text-destructive hover:text-destructive"
							>
								حذف
							</Button>
						}
					/>
				</SettingsCard>
			</div>
		</TabsContent>
	);
}
