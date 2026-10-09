import { Sheet, SheetContent } from "@/components/ui/sheet";
import { FormHeader } from "@/components/common/form-header";
import { FormFooter } from "@/components/common/form-footer";
import { FieldLabel } from "@/components/common/field-label";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function AddCampaignSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onClose();
	};

	return (
		<Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
			<SheetContent side="left" showCloseButton={false} className="w-full sm:max-w-xl! gap-0 flex flex-col p-0">
				<FormHeader title="حملة جديدة" onClose={onClose} />
				
				<div className="flex-1 overflow-y-auto">
					<form id="add-campaign-form" onSubmit={handleSubmit} className="flex flex-col gap-0" dir="rtl">
						<div className="px-4 pt-4 pb-2">
							<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
								معلومات الحملة
							</p>
						</div>

						<div className="flex flex-col gap-4 px-4 pb-6">
							{/* اسم الحملة */}
							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label className="text-sm font-medium">اسم الحملة</Label>
								</FieldLabel>
								<Select defaultValue="">
									<SelectTrigger className="w-full text-right text-sm" dir="rtl">
										<SelectValue placeholder="يُرجى تعبئة اسم الحملة" />
									</SelectTrigger>
									<SelectContent dir="rtl">
										<SelectItem value="حملة التسجيل - الفصل الأول" className="text-right">حملة التسجيل - الفصل الأول</SelectItem>
										<SelectItem value="حملة التسجيل المبكر" className="text-right">حملة التسجيل المبكر</SelectItem>
										<SelectItem value="حملة الفصل الدراسي" className="text-right">حملة الفصل الدراسي</SelectItem>
										<SelectItem value="حملة البرنامج الصيفي" className="text-right">حملة البرنامج الصيفي</SelectItem>
										<SelectItem value="يوم مفتوح" className="text-right">يوم مفتوح</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* الفئة العمرية */}
							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label className="text-sm font-medium">الفئة العمرية</Label>
								</FieldLabel>
								<Select defaultValue="">
									<SelectTrigger className="w-full text-right text-sm" dir="rtl">
										<SelectValue placeholder="اختر..." />
									</SelectTrigger>
									<SelectContent dir="rtl">
										<SelectItem value="2-3" className="text-right">2-3 سنوات</SelectItem>
										<SelectItem value="3-4" className="text-right">3-4 سنوات</SelectItem>
										<SelectItem value="4-5" className="text-right">4-5 سنوات</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* الفصل المستهدف */}
							<div className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium">الفصل المستهدف</Label>
								<Select defaultValue="">
									<SelectTrigger className="w-full text-right text-sm" dir="rtl">
										<SelectValue placeholder="اختر..." />
									</SelectTrigger>
									<SelectContent dir="rtl">
										<SelectItem value="النجوم" className="text-right">النجوم</SelectItem>
										<SelectItem value="القمر" className="text-right">القمر</SelectItem>
										<SelectItem value="الشمس" className="text-right">الشمس</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* تاريخ البدء */}
							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label className="text-sm font-medium">تاريخ البدء</Label>
								</FieldLabel>
								<Input type="date" className="text-sm" />
							</div>

							{/* تاريخ الانتهاء */}
							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label className="text-sm font-medium">تاريخ الانتهاء</Label>
								</FieldLabel>
								<Input type="date" className="text-sm" />
							</div>

							{/* المقاعد المتاحة */}
							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label className="text-sm font-medium">المقاعد المتاحة</Label>
								</FieldLabel>
								<Select defaultValue="">
									<SelectTrigger className="w-full text-right text-sm" dir="rtl">
										<SelectValue placeholder="اختر..." />
									</SelectTrigger>
									<SelectContent dir="rtl">
										<SelectItem value="15" className="text-right">15</SelectItem>
										<SelectItem value="20" className="text-right">20</SelectItem>
										<SelectItem value="25" className="text-right">25</SelectItem>
										<SelectItem value="30" className="text-right">30</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* المتطلبات */}
							<div className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium">المتطلبات</Label>
								<Textarea placeholder="شهادة ميلاد، صورة هوية ولي الأمر، شهادة تطعيم..." className="text-sm min-h-24 resize-none" />
							</div>
						</div>
					</form>
				</div>
				
				<FormFooter continueAdding={false} onContinueAddingChange={() => {}} disabled={false}>
					<Button type="button" variant="outline" size="sm" onClick={onClose}>
						إلغاء
					</Button>
					<Button type="submit" form="add-campaign-form" size="sm">
						إنشاء الحملة
					</Button>
				</FormFooter>
			</SheetContent>
		</Sheet>
	);
}
