import { ClassroomDialog, type ClassroomDialogProps } from "./classroom-dialog";

export { ClassroomDialog };
export type ClassroomSheetProps = ClassroomDialogProps;

/**
 * تم استبدال الـ Sheet بـ Dialog موحد للمنصة طبقاً لتصميم المنصة المطلوب.
 * يتم الإبقاء على تصدير ClassroomSheet لضمان التوافق التام مع أي استدعاءات سابقة.
 */
export const ClassroomSheet = ClassroomDialog;
