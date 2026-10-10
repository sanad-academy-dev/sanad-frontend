import type { InboxSoundName } from "@/generated/prisma/enums";

// نغمات التنبيه مُولَّدة في المتصفّح عبر Web Audio — لا ملفات صوتية في الحزمة
// ولا طلبات شبكة، وتعمل دون اتصال. كل نغمة سلسلة نوتات قصيرة.

type Note = {
	freq: number; // بالهرتز
	start: number; // ثانية، نسبةً لبداية التشغيل
	duration: number; // ثانية
	type: OscillatorType;
	gain: number; // 0..1 نسبةً لمستوى الصوت الرئيسي
};

const SOUND_NOTES: Record<InboxSoundName, Note[]> = {
	// نغمتان صاعدتان ناعمتان (A5 → D6) — التنبيه الافتراضي
	CHIME: [
		{ freq: 880, start: 0, duration: 0.18, type: "sine", gain: 1 },
		{ freq: 1174.66, start: 0.11, duration: 0.34, type: "sine", gain: 0.85 },
	],
	// نبضة واحدة عالية وقصيرة (G6)
	PING: [{ freq: 1568, start: 0, duration: 0.16, type: "sine", gain: 0.9 }],
	// ثلاث نوتات سريعة (C5 → E5 → G5) بطابع خشبي
	MARIMBA: [
		{ freq: 523.25, start: 0, duration: 0.14, type: "triangle", gain: 0.9 },
		{ freq: 659.25, start: 0.08, duration: 0.14, type: "triangle", gain: 0.8 },
		{ freq: 783.99, start: 0.16, duration: 0.26, type: "triangle", gain: 0.7 },
	],
	// طرقتان خافضتان قصيرتان
	KNOCK: [
		{ freq: 180, start: 0, duration: 0.09, type: "sine", gain: 1 },
		{ freq: 150, start: 0.13, duration: 0.11, type: "sine", gain: 0.8 },
	],
};

export const INBOX_SOUND_LABELS: Record<InboxSoundName, string> = {
	CHIME: "جرس",
	PING: "نبضة",
	MARIMBA: "ماريمبا",
	KNOCK: "طرق",
};

// سقف الصوت الرئيسي — يبقي أعلى مستوى (100) مسموعًا دون أن يكون حادًّا
const MASTER_GAIN = 0.22;

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
	if (typeof window === "undefined") return null;
	const Ctor = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
	if (!Ctor) return null;
	if (!audioContext) audioContext = new Ctor();
	return audioContext;
}

/**
 * يشغّل نغمة تنبيه الوارد. لا يرمي أبدًا — فشل الصوت يجب ألّا يمنع بقيّة التنبيه.
 * @param volume 0..100
 */
export function playInboxSound(name: InboxSoundName, volume: number): void {
	try {
		const ctx = getAudioContext();
		if (!ctx || volume <= 0) return;

		// سياسة التشغيل التلقائي تُعلّق السياق حتى أوّل تفاعل من المستخدم
		if (ctx.state === "suspended") void ctx.resume();

		const level = (Math.min(100, Math.max(0, volume)) / 100) * MASTER_GAIN;
		const now = ctx.currentTime;

		for (const note of SOUND_NOTES[name]) {
			const oscillator = ctx.createOscillator();
			const envelope = ctx.createGain();
			oscillator.type = note.type;
			oscillator.frequency.value = note.freq;

			const startAt = now + note.start;
			const peak = level * note.gain;
			// صعود سريع ثم انحدار أُسّي — يمنع طقطقة بداية/نهاية الموجة
			envelope.gain.setValueAtTime(0.0001, startAt);
			envelope.gain.exponentialRampToValueAtTime(peak, startAt + 0.012);
			envelope.gain.exponentialRampToValueAtTime(0.0001, startAt + note.duration);

			oscillator.connect(envelope).connect(ctx.destination);
			oscillator.start(startAt);
			oscillator.stop(startAt + note.duration + 0.02);
		}
	} catch {
		// متصفّح بلا Web Audio أو سياق مرفوض — تجاهل بصمت
	}
}
