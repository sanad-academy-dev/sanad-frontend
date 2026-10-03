import { IconChevronDown, IconChevronLeft, IconLock } from "@tabler/icons-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PERMISSIONS } from "@/lib/permissions";
import type { PermissionSection, ViewLevel } from "../types/permissions.types";

const PERMISSION_SECTIONS: PermissionSection[] = [
	{
		id: "patients_owners",
		label: "الأطفال وأولياء الأمور",
		viewLimitedKey: PERMISSIONS.PATIENTS_OWNERS_VIEW_LIMITED,
		viewFullKey: PERMISSIONS.PATIENTS_OWNERS_VIEW_FULL,
		toggles: [
			{ key: PERMISSIONS.PATIENTS_OWNERS_CREATE, label: "إضافة طفل / وليّ أمر" },
			{ key: PERMISSIONS.PATIENTS_OWNERS_EDIT, label: "تعديل طفل / وليّ أمر" },
			{ key: PERMISSIONS.PATIENTS_OWNERS_DELETE, label: "حذف طفل / وليّ أمر" },
		],
	},
	{
		id: "appointments",
		label: "الزيارات",
		viewLimitedKey: PERMISSIONS.APPOINTMENTS_VIEW_LIMITED,
		viewFullKey: PERMISSIONS.APPOINTMENTS_VIEW_FULL,
		toggles: [
			{ key: PERMISSIONS.APPOINTMENTS_CREATE, label: "إضافة زيارة" },
			{ key: PERMISSIONS.APPOINTMENTS_EDIT, label: "تعديل زيارة" },
			{ key: PERMISSIONS.APPOINTMENTS_DELETE, label: "حذف زيارة" },
			{ key: PERMISSIONS.APPOINTMENTS_SEND_REMINDERS, label: "إرسال تذكيرات الزيارة" },
		],
	},
	{
		id: "staff",
		label: "الموظفين",
		viewLimitedKey: PERMISSIONS.STAFF_VIEW_LIMITED,
		viewFullKey: PERMISSIONS.STAFF_VIEW_FULL,
		toggles: [
			{ key: PERMISSIONS.STAFF_CREATE, label: "إضافة موظف" },
			{ key: PERMISSIONS.STAFF_EDIT, label: "تعديل موظف" },
			{ key: PERMISSIONS.STAFF_DELETE, label: "حذف موظف" },
			{ key: PERMISSIONS.STAFF_INVITE, label: "إرسال دعوة" },
		],
	},
	{
		id: "tasks",
		label: "المهام",
		viewLimitedKey: PERMISSIONS.TASKS_VIEW_LIMITED,
		viewFullKey: PERMISSIONS.TASKS_VIEW_FULL,
		toggles: [
			{ key: PERMISSIONS.TASKS_CREATE, label: "إضافة مهمة" },
			{ key: PERMISSIONS.TASKS_EDIT, label: "تعديل مهمة" },
			{ key: PERMISSIONS.TASKS_DELETE, label: "حذف مهمة" },
			{ key: PERMISSIONS.TASKS_ASSIGN, label: "إسناد مهمة" },
		],
	},
	{
		id: "finance_invoices",
		label: "المالية — الفواتير",
		viewLimitedKey: PERMISSIONS.FINANCE_INVOICES_VIEW_LIMITED,
		viewFullKey: PERMISSIONS.FINANCE_INVOICES_VIEW_FULL,
		toggles: [],
	},
	{
		id: "finance_discounts",
		label: "المالية — الخصومات",
		viewLimitedKey: PERMISSIONS.FINANCE_DISCOUNTS_VIEW_LIMITED,
		viewFullKey: PERMISSIONS.FINANCE_DISCOUNTS_VIEW_FULL,
		toggles: [],
	},
	{
		id: "finance_care_plans",
		label: "المالية — خطط الرعاية والاشتراكات",
		viewLimitedKey: PERMISSIONS.FINANCE_CARE_PLANS_VIEW_LIMITED,
		viewFullKey: PERMISSIONS.FINANCE_CARE_PLANS_VIEW_FULL,
		toggles: [],
	},
	{
		id: "finance_expenses",
		label: "المالية — المصروفات",
		viewLimitedKey: PERMISSIONS.FINANCE_EXPENSES_VIEW_LIMITED,
		viewFullKey: PERMISSIONS.FINANCE_EXPENSES_VIEW_FULL,
		toggles: [],
	},
	{
		id: "documents",
		label: "المستندات",
		// «محدود» = مستندات فرع المستخدم والمستندات العامّة، «كامل» = كل مستندات الأكاديمية
		viewLimitedKey: PERMISSIONS.DOCUMENTS_VIEW_LIMITED,
		viewFullKey: PERMISSIONS.DOCUMENTS_VIEW_FULL,
		toggles: [
			{ key: PERMISSIONS.DOCUMENTS_CREATE, label: "رفع مستند" },
			{ key: PERMISSIONS.DOCUMENTS_EDIT, label: "تعديل مستند" },
			{ key: PERMISSIONS.DOCUMENTS_DELETE, label: "حذف مستند" },
		],
	},
	{
		id: "mobile_clinics",
		label: "الأكاديميات المتنقلة",
		// «محدود» = وحدات فرع المستخدم، «كامل» = كل وحدات الأكاديمية
		viewLimitedKey: PERMISSIONS.MOBILE_CLINICS_VIEW_LIMITED,
		viewFullKey: PERMISSIONS.MOBILE_CLINICS_VIEW_FULL,
		toggles: [
			{ key: PERMISSIONS.MOBILE_CLINICS_CREATE, label: "إضافة وحدة متنقلة" },
			{ key: PERMISSIONS.MOBILE_CLINICS_EDIT, label: "تعديل وحدة متنقلة" },
			{ key: PERMISSIONS.MOBILE_CLINICS_DELETE, label: "حذف وحدة متنقلة" },
			{ key: PERMISSIONS.MOBILE_CLINICS_DISPATCH, label: "إسناد الزيارات وترتيب المسار" },
			{
				key: PERMISSIONS.MOBILE_CLINICS_MANAGE_DEVICES,
				label: "إدارة أجهزة المركبات ورموزها",
			},
		],
	},
	{
		id: "inbox",
		label: "الوارد",
		viewLimitedKey: "inbox.view_limited",
		viewFullKey: "inbox.view_full",
		toggles: [],
		comingSoon: true,
	},
	{
		id: "inventory",
		label: "المخزون",
		viewLimitedKey: "inventory.view_limited",
		viewFullKey: "inventory.view_full",
		toggles: [],
		comingSoon: true,
	},
	{
		id: "grooming",
		label: "التجميل",
		viewLimitedKey: "grooming.view_limited",
		viewFullKey: "grooming.view_full",
		toggles: [],
		comingSoon: true,
	},
	{
		id: "pos",
		label: "نقاط البيع",
		viewLimitedKey: "pos.view_limited",
		viewFullKey: "pos.view_full",
		toggles: [],
		comingSoon: true,
	},
];

type Props = {
	permissions: string[];
	onChange: (permissions: string[]) => void;
	disabled?: boolean;
};

export const PermissionsEditor = ({ permissions, onChange, disabled }: Props) => {
	const getViewLevel = (section: PermissionSection): ViewLevel => {
		if (permissions.includes(section.viewFullKey)) return "full";
		if (permissions.includes(section.viewLimitedKey)) return "limited";
		return "none";
	};

	const setViewLevel = (section: PermissionSection, level: ViewLevel) => {
		const next = permissions.filter(
			(p) => p !== section.viewLimitedKey && p !== section.viewFullKey,
		);
		if (level === "limited") next.push(section.viewLimitedKey);
		if (level === "full") next.push(section.viewFullKey);
		onChange(next);
	};

	const togglePermission = (key: string, enabled: boolean) => {
		if (enabled) {
			onChange([...permissions, key]);
		} else {
			onChange(permissions.filter((p) => p !== key));
		}
	};

	return (
		<div className="flex flex-col gap-2">
			{PERMISSION_SECTIONS.map((section) => (
				<SectionRow
					key={section.id}
					section={section}
					viewLevel={getViewLevel(section)}
					permissions={permissions}
					onViewChange={(level) => setViewLevel(section, level)}
					onToggle={togglePermission}
					disabled={disabled}
				/>
			))}
		</div>
	);
};

type SectionRowProps = {
	section: PermissionSection;
	viewLevel: ViewLevel;
	permissions: string[];
	onViewChange: (level: ViewLevel) => void;
	onToggle: (key: string, enabled: boolean) => void;
	disabled?: boolean;
};

const SectionRow = ({
	section,
	viewLevel,
	permissions,
	onViewChange,
	onToggle,
	disabled,
}: SectionRowProps) => {
	const [open, setOpen] = useState(false);

	if (section.comingSoon) {
		return (
			<div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
				<span className="text-sm font-medium text-foreground">{section.label}</span>
				<Badge
					variant="secondary"
					className="text-xs"
				>
					متاح قريباً
				</Badge>
			</div>
		);
	}

	return (
		<div className="rounded-lg border border-border">
			<button
				type="button"
				className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/30 transition-colors"
				onClick={() => setOpen((o) => !o)}
				disabled={disabled}
			>
				<span>{section.label}</span>
				{open ? (
					<IconChevronDown className="size-4 text-muted-foreground" />
				) : (
					<IconChevronLeft className="size-4 text-muted-foreground" />
				)}
			</button>

			{open && (
				<div className="border-t border-border px-4 py-3 flex flex-col gap-3">
					<div className="flex items-center justify-between">
						<Label className="text-sm text-muted-foreground">مستوى العرض</Label>
						<Select
							value={viewLevel}
							onValueChange={(v) => onViewChange(v as ViewLevel)}
							disabled={disabled}
						>
							<SelectTrigger className="w-[160px] h-8 text-sm">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="none">
									<span className="flex items-center gap-2">
										<IconLock className="size-3.5" />
										لا يوجد وصول
									</span>
								</SelectItem>
								<SelectItem value="limited">عرض محدود</SelectItem>
								<SelectItem value="full">عرض كامل</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{section.toggles.map((toggle) => (
						<div
							key={toggle.key}
							className="flex items-center justify-between"
						>
							<Label className="text-sm">{toggle.label}</Label>
							<Switch
								checked={permissions.includes(toggle.key)}
								onCheckedChange={(checked) => onToggle(toggle.key, checked)}
								disabled={disabled}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
