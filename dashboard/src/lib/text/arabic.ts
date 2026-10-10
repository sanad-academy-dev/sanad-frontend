const TASHKEEL = /[ؐ-ًؚ-ٰٟۖ-ۭ]/g;
const TATWEEL = /ـ/g;
const ARABIC_INDIC_DIGITS: Record<string, string> = {
	"٠": "0",
	"١": "1",
	"٢": "2",
	"٣": "3",
	"٤": "4",
	"٥": "5",
	"٦": "6",
	"٧": "7",
	"٨": "8",
	"٩": "9",
	"۰": "0",
	"۱": "1",
	"۲": "2",
	"۳": "3",
	"۴": "4",
	"۵": "5",
	"۶": "6",
	"۷": "7",
	"۸": "8",
	"۹": "9",
};

const LETTER_FOLD: Record<string, string> = {
	آ: "ا",
	أ: "ا",
	إ: "ا",
	ٱ: "ا",
	ى: "ي",
	ی: "ي",
	ة: "ه",
	ؤ: "و",
	ئ: "ي",
	ء: "",
};

export const normalizeArabicName = (input: string): string => {
	if (!input) return "";
	let s = input.normalize("NFC");
	s = s.replace(TASHKEEL, "");
	s = s.replace(TATWEEL, "");
	s = s.replace(/[٠-٩۰-۹]/g, (ch) => ARABIC_INDIC_DIGITS[ch] ?? ch);
	s = s.replace(/[آأإٱىیةؤئء]/g, (ch) =>
		LETTER_FOLD[ch] !== undefined ? LETTER_FOLD[ch] : ch,
	);
	s = s.replace(/\s+/g, " ").trim();
	return s.toLowerCase();
};
