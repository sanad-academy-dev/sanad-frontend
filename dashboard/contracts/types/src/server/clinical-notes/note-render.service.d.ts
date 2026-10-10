import { type ExamBlock, type NoteAnswers } from "@/server/clinical-notes/clinical-notes.type";
/**
 * [S2] تصيير الملاحظة: (كتل القالب + الإجابات) → النصوص الأربعة.
 *
 * دالّة صرفة — بلا قاعدة بيانات وبلا ساعة وبلا عشوائية. هذا ليس تفضيلًا أسلوبيًا:
 * القاعدة ١٤ تقصر السويّة السريعة على ما لا يمسّ قاعدة البيانات، وهذا الملفّ يحمل
 * المنطق الحقيقي للوحدة — فبقاؤه صرفًا هو ما يجعله مغطًّى في كل دفعة لا عند بوّابة
 * الطور وحدها.
 *
 * ولماذا يُخزَّن النصّ أصلًا ما دامت `answers` موجودة: النصّ هو السجلّ القانوني
 * ويُجمَّد عند التوثيق (§5)، والإجابات هي البنية القابلة للاستعلام. تعديل القالب
 * لاحقًا يغيّر ما تُصيّره هذه الدالّة اليوم، ولا يجوز أن يغيّر ما وقّعه مدرّبٌ أمس.
 */
/** قياس مُصاغ مسبقًا يُدرج في قسم O. */
export type RenderedVital = {
    labelAr: string;
    value: string;
};
export type RenderedNote = {
    subjective: string | null;
    objective: string | null;
    assessment: string | null;
    plan: string | null;
};
/**
 * القياسات تصل مُصاغةً من الخارج بدل أن تُقرأ هنا: وحدة العلامات الحيوية تملك
 * وحداتها وتنسيقها، ونسخُها إلى هنا يخلق مصدرًا ثانيًا يفترق. وإدراجها في النصّ
 * ضروري رغم ذلك — لو بقيت إشارةً فقط لفقد السجلُّ المُجمَّد أرقامه حين يُصحَّح
 * القياس لاحقًا بسجلّ جديد.
 */
export type RenderOptions = {
    vitals?: readonly RenderedVital[];
    /** أسطر التشخيص المُصاغة — تُضاف إلى قسم A تحت النصّ الحرّ */
    diagnosisLines?: readonly string[];
};
export declare function renderNote(blocks: readonly ExamBlock[], answers: NoteAnswers, options?: RenderOptions): RenderedNote;
/**
 * الإجابات الإلزامية الناقصة — بمعرّف الكتلة وعنوانها.
 *
 * تُستدعى عند التوثيق لا عند الحفظ: المسوّدة يجب أن تُحفظ ناقصةً (المدرّب يُقاطَع
 * في منتصف الفحص)، أمّا التوثيق فقفلٌ لا رجعة فيه.
 */
export declare function missingRequiredBlocks(blocks: readonly ExamBlock[], answers: NoteAnswers): {
    id: string;
    labelAr: string;
}[];
