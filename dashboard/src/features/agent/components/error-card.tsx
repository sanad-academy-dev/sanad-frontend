import { IconAlertTriangleFilled } from "@tabler/icons-react";

export type ErrorCardData = {
	title: string; // "تعذّر إضافة الموظف"
	reason: string; // السبب الواضح المُعاد من الأداة
};

// بطاقة فشل الإجراء — تعرض السبب النهائي فقط دون ثرثرة الموديل.
export const ErrorCard = ({ data }: { data: ErrorCardData }) => {
	return (
		<div className="flex w-full flex-col items-end gap-2 rounded-[4px] border border-[#f2c0c0] bg-[#fef5f5] p-3.5">
			<div className="flex w-full items-center gap-2">
				<IconAlertTriangleFilled className="size-4 shrink-0 text-[#dc2626]" />
				<span className="text-[15px] font-semibold text-[#b91c1c]">{data.title}</span>
			</div>
			<p className="w-full text-start text-[14px] leading-relaxed text-[#7f1d1d]">
				{data.reason}
			</p>
		</div>
	);
};
