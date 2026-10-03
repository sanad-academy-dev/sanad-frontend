import type { ReactNode } from "react";

export interface AddAnimalSheetProps {
	open: boolean;
	onClose: () => void;
}

export interface FieldLabelProps {
	children: ReactNode;
	required?: boolean;
}
