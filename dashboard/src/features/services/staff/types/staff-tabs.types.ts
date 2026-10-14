// تبويبات وحدة الموارد البشرية المعروضة في الهيدر العلوي
export type StaffModuleTab =
	| "employees"
	| "shifts"
	| "payroll"
	| "jobs";

export const STAFF_MODULE_TABS: {
	value: StaffModuleTab;
	label: string;
	disabled: boolean;
}[] = [
	{ value: "employees", label: "الموظفين", disabled: false },
	{ value: "shifts", label: "المناوبات", disabled: false },
	{ value: "payroll", label: "مسير الرواتب", disabled: false },
	{ value: "jobs", label: "الوظائف", disabled: false },
];
