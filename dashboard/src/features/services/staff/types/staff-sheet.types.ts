import type { StaffResponse } from "@/server/staff/staff.type";

export interface StaffSheetProps {
	staff: StaffResponse | null;
	open: boolean;
	onClose: () => void;
}
