import { IconInfoCircle } from "@tabler/icons-react";

// بطاقة إحصائية — حسب التصميم: القيمة والتسمية كلٌّ في نصفه ومتوسّطة فيه (margin: 0 auto)
function JobStatCard({ title, value }: { title: string; value: string }) {
	return (
		<div className="flex h-[45px] flex-1 items-center justify-between gap-3 rounded-[4px] border border-[#E5E5E5] bg-white p-3">
			{/* ترتيب DOM في RTL: مجموعة التسمية يمينًا (الأيقونة على يسار النص)، والقيمة يسارًا */}
			<span className="mx-auto flex items-center gap-2 text-[12px] font-medium leading-[18px] text-[#08090A]">
				{title}
				<IconInfoCircle
					className="size-[10px] shrink-0 text-[#08090A]"
					stroke={0.833}
				/>
			</span>
			<span className="mx-auto text-[14px] font-bold leading-[21px] text-[#08090A] tabular-nums">
				{value}
			</span>
		</div>
	);
}

// شريط البطاقات الإحصائية — يُستخدم في قائمة الوظائف وفي صفحة الوظيفة
export function JobStatsRow({ stats }: { stats: { title: string; value: string }[] }) {
	return (
		<div className="flex items-center gap-3 p-3">
			{stats.map((s) => (
				<JobStatCard
					key={s.title}
					title={s.title}
					value={s.value}
				/>
			))}
		</div>
	);
}
