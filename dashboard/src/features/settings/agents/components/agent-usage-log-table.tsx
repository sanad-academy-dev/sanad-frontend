import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type UsageRow = {
	id: string;
	user: string;
	timestamp: string;
	agent: string;
	command: string;
	cost: string;
};

// بيانات تجريبية لحين ربط الخادم
const ROWS: UsageRow[] = Array.from({ length: 7 }, (_, i) => ({
	id: String(i),
	user: "أحمد محمد",
	timestamp: "10 يوليو 2026، 10:42 مساءً",
	agent: "المساعد العام",
	command: "تشخيص زيارة",
	cost: "10 ر.س",
}));

// جدول "سجل الاستخدام" — آخر العمليات المنفّذة بواسطة الوكلاء (frame 4170)
export const AgentUsageLogTable = () => (
	<div className="overflow-x-auto rounded-md border">
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>المستخدم</TableHead>
					<TableHead>التوقيت</TableHead>
					<TableHead>الوكيل</TableHead>
					<TableHead>الأمر</TableHead>
					<TableHead>التكلفة</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{ROWS.map((row) => (
					<TableRow key={row.id}>
						<TableCell>
							<span className="flex items-center gap-2">
								<span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
									{row.user.slice(0, 2)}
								</span>
								{row.user}
							</span>
						</TableCell>
						<TableCell className="text-muted-foreground">{row.timestamp}</TableCell>
						<TableCell>
							<span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
								{row.agent}
							</span>
						</TableCell>
						<TableCell>{row.command}</TableCell>
						<TableCell className="font-medium">{row.cost}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	</div>
);
