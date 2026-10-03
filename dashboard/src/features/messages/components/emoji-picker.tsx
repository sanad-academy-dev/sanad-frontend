import { IconSearch } from "@tabler/icons-react";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * منتقي رموز تعبيرية كامل بلا مكتبات خارجية: فئات + بحث ثنائي اللغة +
 * «الأخيرة» محفوظة في localStorage. الرموز يونيكود خالص فلا أصول ولا شبكات.
 */

type EmojiEntry = { e: string; k: string };
type EmojiCategory = { id: string; label: string; icon: string; items: EmojiEntry[] };

const EMOJI_CATEGORIES: EmojiCategory[] = [
	{
		id: "smileys",
		label: "الوجوه",
		icon: "😀",
		items: [
			{ e: "😀", k: "grin smile happy ابتسامة سعيد" },
			{ e: "😃", k: "smile happy joy فرح" },
			{ e: "😄", k: "laugh smile ضحك" },
			{ e: "😁", k: "beam grin ابتسامة عريضة" },
			{ e: "😆", k: "laugh haha قهقهة" },
			{ e: "😅", k: "sweat laugh ضحك عرق" },
			{ e: "😂", k: "joy tears lol ضحك دموع" },
			{ e: "🤣", k: "rofl lol ضحك شديد" },
			{ e: "🙂", k: "slight smile ابتسامة خفيفة" },
			{ e: "😉", k: "wink غمزة" },
			{ e: "😊", k: "blush smile خجل ابتسامة" },
			{ e: "😇", k: "angel halo ملاك" },
			{ e: "😍", k: "love heart eyes حب اعجاب" },
			{ e: "🤩", k: "star struck wow انبهار" },
			{ e: "😘", k: "kiss قبلة" },
			{ e: "😋", k: "yum tasty لذيذ" },
			{ e: "😜", k: "wink tongue مزاح" },
			{ e: "🤪", k: "crazy جنون" },
			{ e: "🤔", k: "think hmm تفكير" },
			{ e: "🤨", k: "raised eyebrow شك" },
			{ e: "😐", k: "neutral محايد" },
			{ e: "😶", k: "no mouth صمت" },
			{ e: "🙄", k: "eye roll ملل" },
			{ e: "😏", k: "smirk مكر" },
			{ e: "😌", k: "relieved ارتياح" },
			{ e: "😴", k: "sleep نوم" },
			{ e: "🤒", k: "sick fever مرض حمى" },
			{ e: "🤕", k: "injured bandage اصابة" },
			{ e: "🤢", k: "nausea غثيان" },
			{ e: "🤧", k: "sneeze عطس" },
			{ e: "😷", k: "mask sick كمامة" },
			{ e: "🥴", k: "woozy دوخة" },
			{ e: "😵", k: "dizzy اغماء" },
			{ e: "🥺", k: "pleading رجاء" },
			{ e: "😢", k: "cry sad حزن بكاء" },
			{ e: "😭", k: "sob cry بكاء شديد" },
			{ e: "😤", k: "frustrated احباط" },
			{ e: "😠", k: "angry غضب" },
			{ e: "😡", k: "rage غضب شديد" },
			{ e: "🤯", k: "mind blown انفجار ذهول" },
			{ e: "😱", k: "scream fear صراخ خوف" },
			{ e: "😨", k: "fearful خوف" },
			{ e: "😰", k: "anxious قلق" },
			{ e: "🤗", k: "hug عناق" },
			{ e: "🤫", k: "shush سر هدوء" },
			{ e: "🤥", k: "lying كذب" },
			{ e: "😎", k: "cool sunglasses رائع نظارة" },
			{ e: "🥳", k: "party celebrate احتفال" },
		],
	},
	{
		id: "gestures",
		label: "الإيماءات",
		icon: "👍",
		items: [
			{ e: "👍", k: "thumbs up like موافق تمام" },
			{ e: "👎", k: "thumbs down dislike رفض" },
			{ e: "👌", k: "ok perfect تمام" },
			{ e: "✌️", k: "victory peace نصر سلام" },
			{ e: "🤞", k: "fingers crossed حظ تمني" },
			{ e: "🤟", k: "love you حب" },
			{ e: "🤙", k: "call me اتصل" },
			{ e: "👈", k: "point left يسار اشارة" },
			{ e: "👉", k: "point right يمين اشارة" },
			{ e: "👆", k: "point up فوق" },
			{ e: "👇", k: "point down تحت" },
			{ e: "☝️", k: "index up تنبيه" },
			{ e: "✋", k: "hand stop توقف يد" },
			{ e: "🤚", k: "raised hand يد" },
			{ e: "🖐️", k: "hand fingers يد" },
			{ e: "👋", k: "wave hello bye تحية وداع" },
			{ e: "🤝", k: "handshake deal اتفاق مصافحة" },
			{ e: "🙏", k: "please thanks pray شكرا رجاء دعاء" },
			{ e: "👏", k: "clap applause تصفيق" },
			{ e: "🙌", k: "raised hands celebrate يدين احتفال" },
			{ e: "💪", k: "muscle strong قوة عضلات" },
			{ e: "✍️", k: "writing كتابة" },
			{ e: "🫡", k: "salute تحية عسكرية" },
			{ e: "🤲", k: "palms up دعاء" },
		],
	},
	{
		id: "animals",
		label: "الأطفال",
		icon: "🐱",
		items: [
			{ e: "🐶", k: "dog puppy كلب جرو" },
			{ e: "🐱", k: "cat kitten قطة" },
			{ e: "🐭", k: "mouse فأر" },
			{ e: "🐹", k: "hamster همستر" },
			{ e: "🐰", k: "rabbit bunny أرنب" },
			{ e: "🦊", k: "fox ثعلب" },
			{ e: "🐻", k: "bear دب" },
			{ e: "🐼", k: "panda باندا" },
			{ e: "🐨", k: "koala كوالا" },
			{ e: "🐯", k: "tiger نمر" },
			{ e: "🦁", k: "lion أسد" },
			{ e: "🐮", k: "cow بقرة" },
			{ e: "🐷", k: "pig خنزير" },
			{ e: "🐸", k: "frog ضفدع" },
			{ e: "🐵", k: "monkey قرد" },
			{ e: "🐔", k: "chicken دجاجة" },
			{ e: "🐧", k: "penguin بطريق" },
			{ e: "🐦", k: "bird عصفور طائر" },
			{ e: "🦜", k: "parrot ببغاء" },
			{ e: "🦅", k: "eagle نسر صقر" },
			{ e: "🦉", k: "owl بومة" },
			{ e: "🐴", k: "horse حصان" },
			{ e: "🦄", k: "unicorn يونيكورن" },
			{ e: "🐝", k: "bee نحلة" },
			{ e: "🐢", k: "turtle سلحفاة" },
			{ e: "🐍", k: "snake ثعبان" },
			{ e: "🦎", k: "lizard سحلية" },
			{ e: "🐠", k: "fish سمكة" },
			{ e: "🐬", k: "dolphin دولفين" },
			{ e: "🐳", k: "whale حوت" },
			{ e: "🐾", k: "paw prints مخالب أثر" },
			{ e: "🦴", k: "bone عظمة" },
		],
	},
	{
		id: "medical",
		label: "طبي",
		icon: "🩺",
		items: [
			{ e: "🩺", k: "stethoscope سماعة مدرّب فحص" },
			{ e: "💉", k: "syringe injection حقنة تطعيم" },
			{ e: "💊", k: "pill medicine دواء حبوب" },
			{ e: "🩹", k: "bandage ضمادة" },
			{ e: "🩻", k: "xray أشعة" },
			{ e: "🧪", k: "test tube lab تحليل مختبر" },
			{ e: "🔬", k: "microscope مجهر مختبر" },
			{ e: "🧬", k: "dna جينات" },
			{ e: "🌡️", k: "thermometer حرارة" },
			{ e: "🏥", k: "hospital مستشفى أكاديمية" },
			{ e: "🚑", k: "ambulance اسعاف" },
			{ e: "🧼", k: "soap تعقيم صابون" },
			{ e: "🧤", k: "gloves قفازات" },
			{ e: "😷", k: "mask كمامة" },
			{ e: "❤️‍🩹", k: "healing heart تعافي" },
			{ e: "🫀", k: "heart organ قلب" },
			{ e: "🦷", k: "tooth سن أسنان" },
			{ e: "🩸", k: "blood دم" },
		],
	},
	{
		id: "food",
		label: "طعام",
		icon: "🍕",
		items: [
			{ e: "☕", k: "coffee قهوة" },
			{ e: "🍵", k: "tea شاي" },
			{ e: "🥤", k: "drink مشروب" },
			{ e: "💧", k: "water drop ماء قطرة" },
			{ e: "🍎", k: "apple تفاحة" },
			{ e: "🍌", k: "banana موز" },
			{ e: "🍇", k: "grapes عنب" },
			{ e: "🍉", k: "watermelon بطيخ" },
			{ e: "🍓", k: "strawberry فراولة" },
			{ e: "🥗", k: "salad سلطة" },
			{ e: "🍕", k: "pizza بيتزا" },
			{ e: "🍔", k: "burger برجر" },
			{ e: "🌯", k: "wrap شاورما" },
			{ e: "🍗", k: "chicken دجاج" },
			{ e: "🍚", k: "rice رز" },
			{ e: "🍰", k: "cake كيك حلى" },
			{ e: "🍪", k: "cookie بسكويت" },
			{ e: "🍫", k: "chocolate شوكولاتة" },
			{ e: "🍯", k: "honey عسل" },
			{ e: "🥛", k: "milk حليب" },
		],
	},
	{
		id: "activity",
		label: "أنشطة",
		icon: "⚽",
		items: [
			{ e: "⚽", k: "football soccer كرة قدم" },
			{ e: "🏀", k: "basketball سلة" },
			{ e: "🎾", k: "tennis تنس" },
			{ e: "🏆", k: "trophy win كأس فوز" },
			{ e: "🥇", k: "gold medal ذهبية ميدالية" },
			{ e: "🎯", k: "target هدف" },
			{ e: "🎮", k: "game العاب" },
			{ e: "🎲", k: "dice نرد" },
			{ e: "🎵", k: "music موسيقى" },
			{ e: "🎤", k: "mic غناء" },
			{ e: "🎬", k: "movie فيلم" },
			{ e: "📚", k: "books كتب دراسة" },
			{ e: "🎨", k: "art فن رسم" },
			{ e: "✈️", k: "plane travel سفر طائرة" },
			{ e: "🚗", k: "car سيارة" },
			{ e: "🏃", k: "run جري" },
			{ e: "🚶", k: "walk مشي" },
			{ e: "🛌", k: "rest سرير راحة" },
		],
	},
	{
		id: "objects",
		label: "أدوات",
		icon: "💼",
		items: [
			{ e: "💼", k: "briefcase work عمل حقيبة" },
			{ e: "📅", k: "calendar تقويم موعد" },
			{ e: "⏰", k: "alarm clock منبه وقت" },
			{ e: "⏳", k: "hourglass wait انتظار" },
			{ e: "📌", k: "pin تثبيت دبوس" },
			{ e: "📎", k: "paperclip مرفق مشبك" },
			{ e: "📝", k: "memo note ملاحظة كتابة" },
			{ e: "✏️", k: "pencil قلم" },
			{ e: "📄", k: "document مستند ورقة" },
			{ e: "📊", k: "chart تقرير رسم بياني" },
			{ e: "📈", k: "chart up ارتفاع نمو" },
			{ e: "📉", k: "chart down انخفاض" },
			{ e: "💰", k: "money مال فلوس" },
			{ e: "💳", k: "card بطاقة دفع" },
			{ e: "🧾", k: "receipt invoice فاتورة ايصال" },
			{ e: "📦", k: "package box صندوق شحنة" },
			{ e: "🔑", k: "key مفتاح" },
			{ e: "🔒", k: "lock قفل" },
			{ e: "💡", k: "idea bulb فكرة" },
			{ e: "🔋", k: "battery بطارية" },
			{ e: "💻", k: "laptop كمبيوتر" },
			{ e: "📱", k: "phone جوال هاتف" },
			{ e: "📞", k: "call اتصال" },
			{ e: "📧", k: "email بريد ايميل" },
			{ e: "🔍", k: "search بحث" },
			{ e: "⚙️", k: "settings اعدادات" },
			{ e: "🛒", k: "cart تسوق عربة" },
		],
	},
	{
		id: "symbols",
		label: "رموز",
		icon: "❤️",
		items: [
			{ e: "❤️", k: "red heart حب قلب احمر" },
			{ e: "🧡", k: "orange heart قلب برتقالي" },
			{ e: "💛", k: "yellow heart قلب اصفر" },
			{ e: "💚", k: "green heart قلب اخضر" },
			{ e: "💙", k: "blue heart قلب ازرق" },
			{ e: "💜", k: "purple heart قلب بنفسجي" },
			{ e: "🖤", k: "black heart قلب اسود" },
			{ e: "💔", k: "broken heart قلب مكسور" },
			{ e: "💯", k: "hundred مئة كامل" },
			{ e: "✅", k: "check done صح تم" },
			{ e: "❌", k: "cross wrong خطأ" },
			{ e: "❗", k: "exclamation تعجب مهم" },
			{ e: "❓", k: "question سؤال" },
			{ e: "⚠️", k: "warning تحذير" },
			{ e: "🚫", k: "forbidden ممنوع" },
			{ e: "🔴", k: "red circle احمر" },
			{ e: "🟢", k: "green circle اخضر" },
			{ e: "⭐", k: "star نجمة" },
			{ e: "✨", k: "sparkles لمعان" },
			{ e: "🔥", k: "fire نار حماس" },
			{ e: "⚡", k: "lightning برق سرعة" },
			{ e: "🎉", k: "party tada احتفال مبروك" },
			{ e: "🎊", k: "confetti احتفال" },
			{ e: "🎁", k: "gift هدية" },
			{ e: "🏁", k: "finish نهاية علم" },
			{ e: "♻️", k: "recycle تدوير" },
			{ e: "➕", k: "plus زائد اضافة" },
			{ e: "➖", k: "minus ناقص" },
			{ e: "🔔", k: "bell notification جرس اشعار" },
			{ e: "🔕", k: "mute bell كتم" },
			{ e: "💤", k: "zzz sleep نوم" },
			{ e: "🕐", k: "clock ساعة وقت" },
		],
	},
];

const RECENTS_KEY = "elite-vet-chat-recent-emojis";
const RECENTS_MAX = 16;

const loadRecents = (): string[] => {
	try {
		const raw = localStorage.getItem(RECENTS_KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		return Array.isArray(parsed) ? parsed.slice(0, RECENTS_MAX) : [];
	} catch {
		return [];
	}
};

export function EmojiPicker({ onPick }: { onPick: (emoji: string) => void }) {
	const [query, setQuery] = useState("");
	const [recents, setRecents] = useState<string[]>(loadRecents);
	const scrollRef = useRef<HTMLDivElement>(null);
	const searchRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		searchRef.current?.focus();
	}, []);

	const pick = (emoji: string) => {
		const next = [emoji, ...recents.filter((r) => r !== emoji)].slice(0, RECENTS_MAX);
		setRecents(next);
		try {
			localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
		} catch {}
		onPick(emoji);
	};

	const needle = query.trim().toLowerCase();
	const results = useMemo(() => {
		if (!needle) return null;
		return EMOJI_CATEGORIES.flatMap((c) =>
			c.items.filter((item) => item.k.toLowerCase().includes(needle)),
		);
	}, [needle]);

	const scrollToCategory = (id: string) => {
		scrollRef.current
			?.querySelector(`[data-emoji-cat="${id}"]`)
			?.scrollIntoView({ block: "start", behavior: "smooth" });
	};

	const grid = (items: { e: string; k?: string }[], keyPrefix: string) => (
		<div className="grid grid-cols-8">
			{items.map((item, i) => (
				<button
					key={`${keyPrefix}-${item.e}-${i}`}
					type="button"
					title={item.k}
					onClick={() => pick(item.e)}
					className="flex size-8 items-center justify-center rounded-[4px] text-[18px] leading-none transition-colors hover:bg-muted"
				>
					{item.e}
				</button>
			))}
		</div>
	);

	return (
		<div
			dir="rtl"
			className="flex w-[292px] flex-col"
		>
			{/* البحث */}
			<div className="flex items-center gap-1.5 border-b px-2.5 py-2">
				<IconSearch className="size-3.5 shrink-0 text-muted-foreground" />
				<input
					ref={searchRef}
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="ابحث عن رمز..."
					className="h-6 min-w-0 flex-1 bg-transparent text-[12px] text-foreground outline-none placeholder:text-muted-foreground"
				/>
			</div>

			{/* شريط الفئات */}
			{!needle && (
				<div className="flex items-center justify-between border-b px-2 py-1">
					{EMOJI_CATEGORIES.map((cat) => (
						<button
							key={cat.id}
							type="button"
							title={cat.label}
							aria-label={cat.label}
							onClick={() => scrollToCategory(cat.id)}
							className="flex size-7 items-center justify-center rounded-[4px] text-[15px] leading-none opacity-70 transition-all hover:bg-muted hover:opacity-100"
						>
							{cat.icon}
						</button>
					))}
				</div>
			)}

			{/* الشبكة */}
			<div
				ref={scrollRef}
				className="h-64 overflow-y-auto p-2"
			>
				{needle ? (
					results && results.length > 0 ? (
						grid(results, "search")
					) : (
						<p className="py-8 text-center text-[12px] text-muted-foreground">
							لا يوجد رمز مطابق
						</p>
					)
				) : (
					<>
						{recents.length > 0 && (
							<section className="pb-1">
								<h4 className="pb-1 text-[10px] font-medium text-muted-foreground">الأخيرة</h4>
								{grid(
									recents.map((e) => ({ e })),
									"recent",
								)}
							</section>
						)}
						{EMOJI_CATEGORIES.map((cat) => (
							<section
								key={cat.id}
								data-emoji-cat={cat.id}
								className="pb-1"
							>
								<h4 className="pb-1 text-[10px] font-medium text-muted-foreground">
									{cat.label}
								</h4>
								{grid(cat.items, cat.id)}
							</section>
						))}
					</>
				)}
			</div>
		</div>
	);
}
