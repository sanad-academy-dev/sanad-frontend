import type { CandidateProfile } from "@/features/services/staff/types/jobs.types";

// مهارات المرشّحين كما في التصميم — عيّنة لوظيفة جراح عظام
const SKILLS_POOL = [
	"جراحة المفاصل",
	"جراحة العظام",
	"علاج الكسور",
	"تقييم الإصابات",
	"قراءة الأشعة",
	"التدريب والإشراف",
	"تشخيص طبي",
	"رعاية الأطفال",
	"طب الطوارئ",
	"التخدير والإفاقة",
] as const;

const EDUCATION_POOL = [
	"بكالوريوس طب جراحة",
	"ماجستير جراحة عظام",
	"بكالوريوس طب بيطري",
	"دبلوم تطفل بيطري",
] as const;

// المستندات المرفقة بالطلب — نفس ملفات التصميم وأنواعها
const DOCUMENT_TEMPLATES = [
	{ name: "السيرة الذاتية.pdf", kind: "pdf" },
	{ name: "الهوية الوطنية.jpg", kind: "image" },
	{ name: "شهادة التخرج.pdf", kind: "pdf" },
	{ name: "خطاب التوصية.pdf", kind: "pdf" },
] as const;

const MONTHS = [
	"يناير",
	"فبراير",
	"مارس",
	"أبريل",
	"مايو",
	"يونيو",
	"يوليو",
	"أغسطس",
	"سبتمبر",
	"أكتوبر",
	"نوفمبر",
	"ديسمبر",
] as const;

const seedOf = (key: string) => [...key].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);

const arabicNumber = (n: number) =>
	n.toLocaleString("ar-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ملف المرشّح — عيّنة ثابتة مشتقّة من معرّفه واسمه حتى يبقى ثابتًا عبر كل الشاشات
export function candidateProfile(id: string, name: string): CandidateProfile {
	const seed = seedOf(`${id}-${name}`);
	const phoneTail = ((seed * 7919) % 10_000_000).toString().padStart(7, "0");

	return {
		phone: `+966 5${phoneTail.slice(0, 1)} ${phoneTail.slice(1, 4)} ${phoneTail.slice(4)}`,
		email: `applicant.${seed % 10_000}@email.com`,
		education: EDUCATION_POOL[seed % EDUCATION_POOL.length],
		skills: Array.from(
			{ length: 6 + (seed % 3) },
			(_, i) => SKILLS_POOL[(seed + i) % SKILLS_POOL.length],
		),
		documents: DOCUMENT_TEMPLATES.map((doc, i) => {
			const day = 1 + ((seed + i * 5) % 28);
			const month = MONTHS[(seed + i) % MONTHS.length];
			return {
				id: `${id}-doc-${i}`,
				name: doc.name,
				kind: doc.kind,
				size: `${arabicNumber(1 + ((seed + i * 13) % 40) + (i % 4) / 4)} ميجا`,
				uploadedAt: `${day} ${month} 2026 02:30 مساءً`,
			};
		}),
	};
}
