export type ViewLevel = "none" | "limited" | "full";

export type PermissionToggle = {
	key: string;
	label: string;
};

export type PermissionSection = {
	id: string;
	label: string;
	viewLimitedKey: string;
	viewFullKey: string;
	toggles: PermissionToggle[];
	comingSoon?: boolean;
};
