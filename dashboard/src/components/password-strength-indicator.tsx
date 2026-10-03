import { FieldDescription } from "@/components/ui/field";
import { cn } from "@/lib/utils";

const PASSWORD_STRENGTH_STYLES = [
	{ activeClassName: "bg-red-500", key: "weak", widthClassName: "w-1/4" },
	{ activeClassName: "bg-orange-500", key: "fair", widthClassName: "w-2/4" },
	{ activeClassName: "bg-blue-500", key: "good", widthClassName: "w-3/4" },
	{ activeClassName: "bg-green-500", key: "strong", widthClassName: "w-full" },
] as const;

type PasswordStrengthLabelKey = (typeof PASSWORD_STRENGTH_STYLES)[number]["key"];

export type PasswordStrengthIndicatorProps = {
	password: string;
	label: string;
	labels: Record<PasswordStrengthLabelKey, string>;
	className?: string;
	hideWhenEmpty?: boolean;
};

const getPasswordStrengthStage = (password: string) => {
	if (!password) {
		return 0;
	}

	let score = 0;

	if (password.length >= 8) {
		score += 1;
	}

	if (password.length >= 10) {
		score += 1;
	}

	if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
		score += 1;
	}

	if (/\d/.test(password)) {
		score += 1;
	}

	if (/[^A-Za-z0-9]/.test(password)) {
		score += 1;
	}

	if (score <= 1) {
		return 1;
	}

	if (score <= 2) {
		return 2;
	}

	if (score <= 4) {
		return 3;
	}

	return 4;
};

export const PasswordStrengthIndicator = ({
	password,
	label,
	labels,
	className,
	hideWhenEmpty = true,
}: PasswordStrengthIndicatorProps) => {
	const stage = getPasswordStrengthStage(password);

	if (hideWhenEmpty && stage === 0) {
		return null;
	}

	const strengthStyle = stage > 0 ? PASSWORD_STRENGTH_STYLES[stage - 1] : null;

	return (
		<div className={cn("space-y-2", className)}>
			<div
				className="h-1.5 w-full rounded-full bg-muted"
				aria-hidden="true"
			>
				<div
					className={cn(
						"h-full rounded-full transition-all duration-300",
						strengthStyle?.activeClassName,
						strengthStyle?.widthClassName,
					)}
				/>
			</div>
			<FieldDescription
				aria-live="polite"
				className="mt-0"
			>
				{label}: {strengthStyle ? labels[strengthStyle.key] : null}
			</FieldDescription>
		</div>
	);
};
