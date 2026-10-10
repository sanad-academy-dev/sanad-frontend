import { PIPELINE_STAGES } from "@/features/services/staff/data/job-pipeline";

// شريط مراحل خط التوظيف — بطاقة لكل مرحلة: التسمية والأيقونة يمينًا، العدّاد يسارًا
export function JobPipelineStrip({ counts }: { counts: number[] }) {
	return (
		<div className="flex items-center gap-1.5 rounded-[4px] bg-[#F5F5F6] p-1.5">
			{PIPELINE_STAGES.map(({ key, label, Icon, color, badge, labelColor }, i) => (
				<div
					key={key}
					className="flex h-[27px] flex-1 items-center justify-between gap-3 rounded-[4px] bg-white p-1.5"
				>
					{/* ترتيب DOM في RTL: الأيقونة أولًا ⇒ يمين التسمية */}
					<span
						className="flex items-center gap-1"
						style={{ color: labelColor }}
					>
						<Icon className="size-3 shrink-0" />
						<span className="whitespace-nowrap text-[10px] font-medium leading-[15px]">
							{label}
						</span>
					</span>

					{/* العدّاد ثم الشريط الملوّن على يساره */}
					<span className="flex items-center">
						<span
							className="h-[7px] w-px rounded-[4px]"
							style={{ backgroundColor: color }}
						/>
						<span
							className="flex h-[15px] items-center rounded-[1.5px] px-1 text-[10px] font-medium leading-[15px] tabular-nums"
							style={{ backgroundColor: badge, color }}
						>
							{counts[i]}
						</span>
					</span>
				</div>
			))}
		</div>
	);
}
