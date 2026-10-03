import { IconPercentage, IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";

export function DiscountsEmpty({ onCreate }: { onCreate: () => void }) {
	return (
		<div
			className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center"
			dir="rtl"
		>
			<div className="relative flex size-24 items-center justify-center rounded-full bg-primary/10">
				<IconPercentage
					className="size-12 text-primary"
					stroke={1.5}
				/>
			</div>

			<div className="max-w-md space-y-1.5">
				<h2 className="text-lg font-bold text-foreground">لا يوجد أي خصومات حتى الآن</h2>
				<p className="text-sm text-muted-foreground">
					ابدأ بإنشاء أول خصم أو كوبون لظهوره هنا، وتقديم عروض مميّزة لعملائك لزيادة الحجوزات
					والمبيعات.
				</p>
			</div>

			<Button onClick={onCreate}>
				<IconPlus className="size-4" />
				إضافة أول خصم
				<Kbd className="text-white">N ثم D</Kbd>
			</Button>
		</div>
	);
}
