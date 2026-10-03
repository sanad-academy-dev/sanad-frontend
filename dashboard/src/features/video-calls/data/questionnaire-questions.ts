// أسئلة الاستبيان الطبي الثابتة — يجيب عليها صاحب الطفل بنعم/لا قبل أو أثناء الجلسة.
// المفتاح هو ما يُخزن في عمود الإجابات Json
export const QUESTIONNAIRE_QUESTIONS = [
	{ key: "medications", question: "هل يتناول الطفل أي أدوية حاليًا؟" },
	{ key: "accidents", question: "هل تعرض لأي حوادث مؤخرًا؟" },
	{ key: "allergies", question: "هل لديه حساسية من أي أدوية؟" },
	{ key: "vaccinated", question: "هل تم تطعيمه خلال السنة الماضية؟" },
	{ key: "surgeries", question: "هل سبق أن أُجريت له عمليات جراحية؟" },
] as const;
