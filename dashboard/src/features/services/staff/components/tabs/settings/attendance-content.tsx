import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { StaffTabProps } from "@/features/services/staff/types/tabs.types";

/** Section header: bold title on the right, muted subtitle underneath. */
function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
	return (
		<div className="flex flex-col gap-1 px-1">
			<p className="text-sm font-semibold">{title}</p>
			<p className="text-xs text-muted-foreground">{subtitle}</p>
		</div>
	);
}

function Card({ children }: { children: ReactNode }) {
	return <div className="divide-y rounded-lg border">{children}</div>;
}

function Row({
	title,
	description,
	trailing,
}: {
	title: string;
	description: string;
	trailing: ReactNode;
}) {
	return (
		<div className="flex items-center justify-between gap-3 px-3 py-2.5">
			<div className="flex min-w-0 flex-col">
				<span className="truncate text-sm font-semibold text-foreground">{title}</span>
				<span className="truncate text-xs text-muted-foreground">{description}</span>
			</div>
			<div className="flex shrink-0 items-center gap-2">{trailing}</div>
		</div>
	);
}

function ComingSoonBadge() {
	return (
		<Badge
			variant="outline"
			className="text-muted-foreground"
		>
			متاح قريبًا
		</Badge>
	);
}

/** A read-only inline "label: value" chip used inside the policy rows. */
function ValueChip({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs">
			<span className="font-medium tabular-nums">{value}</span>
			<span className="text-muted-foreground">{label}</span>
		</div>
	);
}

export function AttendanceContent(_props: StaffTabProps) {
	return (
		<div
			className="flex flex-col gap-6"
			dir="rtl"
		>
			{/* تسجيل الحضور والانصراف */}
			<div className="flex flex-col gap-2">
				<SectionHeader
					title="الحضور والانصراف"
					subtitle="حدد كيفية تسجيل الحضور والانصراف"
				/>
				<Card>
					<Row
						title="تسجيل الحضور والانصراف بـ PIN Code"
						description="السماح للموظف بتسجيل الدخول باستخدام رمز الـ PIN Code"
						trailing={
							<>
								<Input
									readOnly
									value="23123"
									className="h-8 w-24 text-center tabular-nums"
									dir="ltr"
								/>
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="h-8"
								>
									نسخ الرابط
								</Button>
								<Switch defaultChecked />
							</>
						}
					/>
					<Row
						title="تسجيل الحضور والانصراف بالبصمة"
						description="السماح للموظف بتسجيل الدخول باستخدام البصمة"
						trailing={<ComingSoonBadge />}
					/>
					<Row
						title="تسجيل الحضور والانصراف QR Code"
						description="السماح للموظف بتسجيل الدخول باستخدام رمز QR"
						trailing={<ComingSoonBadge />}
					/>
					<Row
						title="تسجيل الحضور والانصراف GPS"
						description="السماح للموظف بتسجيل الدخول عبر تحديد الموقع"
						trailing={<ComingSoonBadge />}
					/>
					<Row
						title="تسجيل الحضور بالتعرف على الوجه"
						description="السماح للموظف بتسجيل الدخول عبر التعرف على الوجه"
						trailing={<ComingSoonBadge />}
					/>
				</Card>
			</div>

			{/* السياسات */}
			<div className="flex flex-col gap-2">
				<SectionHeader
					title="السياسات"
					subtitle="حدد سياسات الحضور والانصراف والإجازات"
				/>
				<Card>
					<Row
						title="تعين فترة سماح على التأخير"
						description="السماح للموظف بتسجيل الدخول خلال فترة سماح محددة بعد بداية المناوبة"
						trailing={
							<>
								<ValueChip
									label="فترة السماح:"
									value="10 دقائق"
								/>
								<Switch defaultChecked />
							</>
						}
					/>
					<Row
						title="عدد مرات السماح بالتأخير"
						description="عدد مرات التأخير المسموح بها قبل تطبيق سياسة الخصم"
						trailing={
							<>
								<ValueChip
									label="مرات التأخير:"
									value="03 مرة"
								/>
								<Switch defaultChecked />
							</>
						}
					/>
					<Row
						title="السماح بطلب أجازة في الفترة التجريبية"
						description="السماح للموظف بتقديم طلبات إجازة أثناء الفترة التجريبية"
						trailing={<Switch />}
					/>
					<Row
						title="السماح بترحيل الإجازات"
						description="السماح بترحيل رصيد الإجازات الثانوية غير المستدورة"
						trailing={<Switch />}
					/>
					<Row
						title="احتساب التأخير على الراتب"
						description="خصم قيمة التأخير من راتب الموظف تلقائيًا"
						trailing={<Switch />}
					/>
				</Card>
			</div>
		</div>
	);
}
