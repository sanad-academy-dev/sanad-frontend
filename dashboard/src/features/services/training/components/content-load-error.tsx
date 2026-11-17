import { Button } from "@/components/ui/button";

interface ContentLoadErrorProps {
	message: string;
	onRetry: () => void;
}

export function ContentLoadError({ message, onRetry }: ContentLoadErrorProps) {
	return (
		<div
			className="flex min-h-52 flex-col items-center justify-center gap-3 px-4 py-12 text-center"
			role="alert"
		>
			<p className="text-sm font-semibold text-foreground">تعذّر تحميل المحتوى</p>
			<p className="max-w-md text-xs text-muted-foreground">{message}</p>
			<Button
				type="button"
				variant="outline"
				size="sm"
				onClick={onRetry}
			>
				إعادة المحاولة
			</Button>
		</div>
	);
}
