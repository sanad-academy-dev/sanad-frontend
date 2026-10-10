import { IconCalendarPlus, IconStethoscope } from "@tabler/icons-react";

type BookingWizardEmptyProps = {
	reason: "no-service" | "no-staff";
};

export const BookingWizardEmpty = ({ reason }: BookingWizardEmptyProps) => {
	const Icon = reason === "no-service" ? IconCalendarPlus : IconStethoscope;
	const title =
		reason === "no-service" ? "اختر الدورة لعرض الزيارات" : "اختر المدرّب لبدء الحجز";
	const subtitle =
		reason === "no-service"
			? "اختر نوع الدورة من الفلاتر على اليمين"
			: "اختر مدرّبًا من القائمة على اليمين لعرض الزيارات المتاحة";

	return (
		<div className="flex h-full min-h-[500px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/30 p-8 text-center">
			<div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
				<Icon className="size-7" />
			</div>
			<h3 className="text-base font-semibold text-foreground">{title}</h3>
			<p className="max-w-xs text-sm text-muted-foreground">{subtitle}</p>
		</div>
	);
};
