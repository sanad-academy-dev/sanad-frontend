/** المسارات المعتمدة في الأكاديمية والمطابقة تماماً لـ Dashboard */
export const REGISTRATION_TRACKS = [
  "البرمجة والمنطق",
  "الذكاء الاصطناعي",
  "الروبوتيكس",
  "تطوير الألعاب",
  "تحليل البيانات",
  "ريادة الأعمال",
] as const;

export type RegistrationTrack = (typeof REGISTRATION_TRACKS)[number];
