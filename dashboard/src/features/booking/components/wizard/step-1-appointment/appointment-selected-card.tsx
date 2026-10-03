import { IconCircleCheck } from "@tabler/icons-react";

const AR_WEEKDAY = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const AR_MONTH = [
	"يناير",
	"فبراير",
	"مارس",
	"أبريل",
	"مايو",
	"يونيو",
	"يوليو",
	"أغسطس",
	"سبتمبر",
	"أكتوبر",
	"نوفمبر",
	"ديسمبر",
];

const parseYmd = (ymd: string): Date => {
	const [y, m, d] = ymd.split("-").map((p) => parseInt(p, 10));
	return new Date(y, m - 1, d);
};

const formatTime = (minute: number): string => {
	const h = Math.floor(minute / 60);
	const m = minute % 60;
	return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

type AppointmentSelectedCardProps = {
	date: string;
	startMinute: number;
	staffName: string;
	staffPrefix: boolean;
};

export const AppointmentSelectedCard = ({
	date,
	startMinute,
	staffName,
	staffPrefix,
}: AppointmentSelectedCardProps) => {
	const d = parseYmd(date);
	const weekday = AR_WEEKDAY[d.getDay()];
	const month = AR_MONTH[d.getMonth()];
	const displayName = staffPrefix ? `د. ${staffName}` : staffName;

	return (
		<div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
			<IconCircleCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" />
			<div className="flex flex-col gap-0.5 text-sm">
				<span className="font-semibold text-emerald-700">تم اختيار الزيارة</span>
				<span className="text-foreground">
					{weekday}، {d.getDate()} {month} {d.getFullYear()} - {formatTime(startMinute)}
				</span>
				<span className="text-muted-foreground">مع {displayName}</span>
			</div>
		</div>
	);
};
