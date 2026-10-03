import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

export function ExpensesEmpty({ onCreate }: { onCreate: () => void }) {
	return (
		<div
			className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center"
			dir="rtl"
		>
			<img
				src="/illustrations/expenses-empty.svg"
				alt=""
				className="h-61.75 w-84.75"
			/>

			<div className="max-w-md space-y-1.5">
				<h2 className="text-lg font-bold text-foreground">لا يوجد مصروفات حتى الآن</h2>
				<p className="text-sm text-muted-foreground">
					ابدأ بإضافة أول مصروف لتتبع نفقاتك وإدارة مصروفاتك بسهولة من مكان واحد.
				</p>
			</div>

			<Button onClick={onCreate}>
				<IconPlus className="size-4" />
				إنشاء مصروف
			</Button>
		</div>
	);
}
