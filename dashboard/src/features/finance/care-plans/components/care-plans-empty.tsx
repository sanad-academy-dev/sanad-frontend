import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";

export function CarePlansEmpty({ onCreate }: { onCreate: () => void }) {
	return (
		<div
			className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center"
			dir="rtl"
		>
			<img
				src="/illustrations/care-plans-empty.svg"
				alt=""
				className="h-[287px] w-[410px]"
			/>

			<div className="max-w-md space-y-1.5">
				<h2 className="text-lg font-bold text-foreground">لا يوجد أي خطط رعايه حتى الآن</h2>
				<p className="text-sm text-muted-foreground">
					ابدأ بإنشاء أول خطة ليظهر هنا، وتعين خطط لعملائك لزيادة الحجوزات والمبيعات
				</p>
			</div>

			<Button onClick={onCreate}>
				<IconPlus className="size-4" />
				إضافة أول خطة
				<Kbd className="text-white">N ثم D</Kbd>
			</Button>
		</div>
	);
}
