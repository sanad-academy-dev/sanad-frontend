export interface ConfirmDiscardProps {
	onConfirm: () => void;
	onDiscard: () => void;
	disabled: boolean;
	confirmDisabled: boolean;
}
