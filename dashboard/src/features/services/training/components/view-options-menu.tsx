import {
	ViewOptionsMenu as BaseViewOptionsMenu,
	ViewGridIcon,
	ViewListIcon,
} from "@/components/common/view-options-menu";

// خيارا العرض — الترتيب هو ترتيب DOM في RTL: «جدول» يمينًا و«قائمة» يسارًا
const VIEW_OPTIONS = [
	{ value: "list" as const, label: "جدول", Icon: ViewListIcon },
	{ value: "grid" as const, label: "قائمة", Icon: ViewGridIcon },
];

export type CoursesView = (typeof VIEW_OPTIONS)[number]["value"];

export function ViewOptionsMenu({
	view,
	onViewChange,
	oldestFirst,
	onOldestFirstChange,
}: {
	view: CoursesView;
	onViewChange: (view: CoursesView) => void;
	oldestFirst: boolean;
	onOldestFirstChange: (oldestFirst: boolean) => void;
}) {
	return (
		<BaseViewOptionsMenu
			options={VIEW_OPTIONS}
			view={view}
			onViewChange={onViewChange}
			oldestFirst={oldestFirst}
			onOldestFirstChange={onOldestFirstChange}
		/>
	);
}
