import { Spinner } from "@/components/common/spinner";
import { ClinicalExamTab } from "@/features/appointments/components/tabs/clinical-exam/clinical-exam-tab";
import { ClinicalNoteTab } from "@/features/appointments/components/tabs/clinical-note/clinical-note-tab";
import { useProtocols } from "@/features/settings/protocols/hooks/use-protocols";

/**
 * [S4] أيّ سجلٍّ تعرضه الزيارة — المعالج القديم أم ملاحظة SOAP.
 *
 * `ClinicProtocols.soapNotes` راية موجودة في المخطّط منذ البداية، ويعرضها مفتاحٌ في
 * الإعدادات، **ولا يقرأها شيء**. النيّة أُعلنت ولم تُبنَ قطّ. هنا تفعل الراية شيئًا
 * أخيرًا.
 *
 * والتفريع هنا لا داخل `ClinicalExamTab`: معيار قبول الطور أن يبقى المعالج القديم
 * **كما هو** حين تكون الراية مطفأة، وأضمن طريقة لذلك ألّا نلمس ملفّه أصلًا.
 *
 * وحتى تُحسم الراية نعرض دوّارًا لا المعالج: الوميض من الشاشة القديمة إلى الجديدة
 * أسوأ من انتظار جزء من الثانية، وقد يبدأ المدرّب الكتابة في الشاشة الخطأ.
 */
export const VisitRecordTab = ({ appointmentId }: { appointmentId: string }) => {
	const { protocols, isLoading } = useProtocols();

	if (isLoading) return <Spinner />;

	return protocols?.soapNotes ? (
		<ClinicalNoteTab appointmentId={appointmentId} />
	) : (
		<ClinicalExamTab appointmentId={appointmentId} />
	);
};
