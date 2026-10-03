/**
 * [MC0.2] الأدوات الجغرافية لوحدة الأكاديميات المتنقلة (خطة الوحدة §8).
 *
 * دوالّ نقيّة بلا أي اعتماد خارجي وبلا PostGIS: نطاق الأسطول عشر مركبات، وفحص الدائرة
 * حسابٌ بسيط، فإضافة امتداد مكاني لقاعدة البيانات تكلفة تشغيلية بلا مقابل عند هذا الحجم.
 * `boundingBox` هي البديل: تسمح لـ Postgres بالتصفية المسبقة بـ `lat/lng BETWEEN` قبل
 * الفحص الدقيق، فلا حاجة إلى فهرس مكاني.
 *
 * كل الإحداثيات بالدرجات العشرية (WGS84)، وكل المسافات بالكيلومترات ما لم يُذكر خلاف ذلك.
 */

/** نقطة جغرافية بالدرجات العشرية. */
export type GeoPoint = { lat: number; lng: number };

/** صندوق إحاطة بالدرجات، للتصفية المسبقة في SQL. */
export type GeoBoundingBox = {
	minLat: number;
	maxLat: number;
	minLng: number;
	maxLng: number;
};

/** نصف قطر الأرض المتوسّط (IUGG) بالكيلومتر. */
const EARTH_RADIUS_KM = 6371.0088;

/** طول درجة عرض واحدة بالكيلومتر — ثابت عمليًّا على خطوط العرض كافّة. */
const KM_PER_DEGREE_LAT = 110.574;

/** طول درجة طول واحدة عند خط الاستواء بالكيلومتر؛ يُضرب في cos(lat) لخطوط العرض الأخرى. */
const KM_PER_DEGREE_LNG_AT_EQUATOR = 111.32;

/**
 * طول الدرجة على **الكرة نفسها** التي يستخدمها `haversineKm` (πR/180 ≈ 111.195).
 *
 * الثابتان أعلاه قيمتان إهليلجيّتان واقعيّتان، وهما المناسبتان لحساب مسافة تقريبيّة
 * بالمتر (`perpendicularDistanceM`). أمّا `boundingBox` فوظيفته التصفية المسبقة لـ
 * `pointInCircle`، ولا بدّ أن يتّفق مع الكرة التي يقيس عليها هافرسين تحديدًا: لو اختلف
 * التقديران في طول الدرجة، أسقط الصندوقُ نقطةً كان الفحصُ الدقيق ليقبلها. قياسًا: عند
 * خطّ الاستواء يعطي 111.32 صندوقًا أضيق من الدائرة الحقيقية.
 */
const KM_PER_DEGREE_SPHERE = (Math.PI * EARTH_RADIUS_KM) / 180;

/**
 * توسيع الصندوق ٠٫١٪ ليبقى خطأ الفاصلة العائمة في الجهة الآمنة: صندوق أوسع من اللازم
 * يكلّف فحصًا دقيقًا إضافيًّا، وصندوق أضيق يُسقط صفوفًا بصمت.
 */
const BBOX_PADDING = 1.001;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * المسافة على سطح الكرة بين نقطتين بالكيلومتر (صيغة هافرسين).
 *
 * الخطأ مقابل النموذج الإهليلجي (Vincenty) أقل من ٠٫٥٪، وهو أدقّ بكثير ممّا يحتاجه
 * حساب المسافة المقطوعة أو مطابقة النطاق أو انحراف الوصول.
 */
export const haversineKm = (a: GeoPoint, b: GeoPoint): number => {
	const dLat = toRadians(b.lat - a.lat);
	const dLng = toRadians(b.lng - a.lng);
	const lat1 = toRadians(a.lat);
	const lat2 = toRadians(b.lat);

	const h =
		Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

	// clamp يحمي من خطأ الفاصلة العائمة الذي قد يدفع h فوق 1 عند النقاط المتطابقة تقريبًا.
	return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(clamp(h, 0, 1)));
};

/**
 * هل تقع النقطة داخل نطاق دائري؟ الحدّ نفسه (المسافة = نصف القطر) يُعدّ داخلًا.
 *
 * هذا هو الفحص الدقيق لنطاق `ServiceZone` من نوع `CIRCLE`.
 */
export const pointInCircle = (
	point: GeoPoint,
	center: GeoPoint,
	radiusKm: number,
): boolean => {
	if (!(radiusKm > 0)) return false;
	return haversineKm(point, center) <= radiusKm;
};

/**
 * هل تقع النقطة داخل مضلّع؟ خوارزمية «عدّ التقاطعات» (ray casting) بإسقاط مستوٍ —
 * دقيق تمامًا عند أحجام النطاقات الحضرية التي تعنينا.
 *
 * الحلقة تُقبل مغلقة (النقطة الأخيرة = الأولى) أو مفتوحة. النتيجة على الحافّة تمامًا غير
 * مضمونة (طبيعة الخوارزمية)؛ نطاقات الدورة تُرسم بهامش، فهذا لا يهمّ عمليًّا.
 */
export const pointInPolygon = (point: GeoPoint, ring: GeoPoint[]): boolean => {
	if (ring.length < 3) return false;

	let inside = false;
	for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
		const a = ring[i];
		const b = ring[j];

		// هل تعبر الحافّة الخطَّ الأفقيَّ المارَّ بالنقطة؟ ثم أين تعبره أفقيًّا؟
		const crossesRay = a.lat > point.lat !== b.lat > point.lat;
		if (!crossesRay) continue;

		const lngAtLat = ((b.lng - a.lng) * (point.lat - a.lat)) / (b.lat - a.lat) + a.lng;
		if (point.lng < lngAtLat) inside = !inside;
	}

	return inside;
};

/**
 * صندوق الإحاطة لدائرة، للتصفية المسبقة في SQL قبل `pointInCircle`.
 *
 * الصندوق **أوسع** من الدائرة دائمًا، فهو لا يُسقط نتيجة صحيحة أبدًا — الفحص الدقيق بعده
 * هو صاحب القرار. مُثبَّت عند القطبين (حيث cos(lat) → 0) وعند خطّ التاريخ: إذا تجاوز
 * المدى ما يمكن التعبير عنه بمجال واحد، يُعاد المدى الكامل بدل قيم ملتفّة تكسر `BETWEEN`.
 */
export const boundingBox = (center: GeoPoint, radiusKm: number): GeoBoundingBox => {
	const safeRadius = Math.max(0, radiusKm);
	const latDelta = (safeRadius / KM_PER_DEGREE_SPHERE) * BBOX_PADDING;

	const minLat = clamp(center.lat - latDelta, -90, 90);
	const maxLat = clamp(center.lat + latDelta, -90, 90);

	// درجة الطول تقصُر كلّما ابتعدنا عن خطّ الاستواء، فأوسع امتدادٍ بالدرجات يقع عند
	// حافّة الصندوق **الأبعد** عن الاستواء. استخدام خطّ العرض الأقرب إلى الاستواء (أو
	// خطّ عرض المركز) يُنتج صندوقًا أضيق من الدائرة عند تلك الحافّة، فيُسقط نقاطًا يقبلها
	// الفحص الدقيق — وهو بالضبط ما يجب ألّا تفعله التصفية المسبقة.
	const widestLat = Math.min(90, Math.max(Math.abs(minLat), Math.abs(maxLat)));
	const cosWidestLat = Math.cos(toRadians(widestLat));

	// قرب القطب، أو حين تلتفّ الدائرة حول الأرض، لا يوجد مجال طولٍ واحد يصفها.
	if (cosWidestLat <= 0 || latDelta / cosWidestLat >= 180) {
		return { minLat, maxLat, minLng: -180, maxLng: 180 };
	}

	// latDelta يحمل التوسيع أصلًا، فالقسمة على cos تنقله إلى محور الطول.
	const lngDelta = latDelta / cosWidestLat;
	const minLng = center.lng - lngDelta;
	const maxLng = center.lng + lngDelta;

	// عبور خطّ التاريخ يُنتج مجالًا ملتفًّا لا يعبّر عنه `BETWEEN`؛ الاتّساع هو التصرّف الآمن.
	if (minLng < -180 || maxLng > 180) {
		return { minLat, maxLat, minLng: -180, maxLng: 180 };
	}

	return { minLat, maxLat, minLng, maxLng };
};

/**
 * المسافة العموديّة بالمتر من نقطة إلى القطعة المستقيمة (a, b).
 *
 * إسقاط مستوٍ متساوي المستطيلات حول متوسّط خطّ العرض — على مسافات القطعة الواحدة
 * (مئات الأمتار) الفرق عن الحساب الكروي مهمل.
 */
const perpendicularDistanceM = (point: GeoPoint, a: GeoPoint, b: GeoPoint): number => {
	const meanLat = toRadians((a.lat + b.lat) / 2);
	const mPerDegreeLat = KM_PER_DEGREE_LAT * 1000;
	const mPerDegreeLng = KM_PER_DEGREE_LNG_AT_EQUATOR * 1000 * Math.cos(meanLat);

	const px = (point.lng - a.lng) * mPerDegreeLng;
	const py = (point.lat - a.lat) * mPerDegreeLat;
	const bx = (b.lng - a.lng) * mPerDegreeLng;
	const by = (b.lat - a.lat) * mPerDegreeLat;

	const segmentLengthSq = bx * bx + by * by;
	// القطعة منهارة إلى نقطة: المسافة العموديّة تصير مسافة مباشرة.
	if (segmentLengthSq === 0) return Math.hypot(px, py);

	// |cross product| / |segment| — المسافة إلى الخطّ اللانهائي المارّ بـ a و b، وهو
	// المطلوب في Douglas–Peucker (النقطتان الطرفيّتان محفوظتان دائمًا).
	return Math.abs(px * by - py * bx) / Math.sqrt(segmentLengthSq);
};

/**
 * تبسيط مسار GPS بخوارزمية Douglas–Peucker: تُحذف النقاط التي تبعد عن الخطّ الواصل أقلَّ
 * من `toleranceM`، وتُحفظ النقطتان الطرفيّتان وكلُّ منعطف حقيقي.
 *
 * مستدورة في موضعين: مهمّة الاحتفاظ ([MC3.6]) التي تُخفّض كثافة النبضات الخام، ورسم
 * المسار على الخريطة حيث بثّ ٢٤٠٠ نقطة لليوم إلى المتصفّح هدرٌ خالص.
 *
 * التنفيذ تكراري بمكدّس صريح لا استدعاءً ذاتيًّا: مسار وردية كامل يبلغ آلاف النقاط،
 * وأسوأ حالة في Douglas–Peucker عمقها O(n) — أي تجاوز لمكدّس الاستدعاءات.
 */
export const simplifyTrail = <T extends GeoPoint>(points: T[], toleranceM: number): T[] => {
	if (points.length <= 2 || !(toleranceM > 0)) return [...points];

	const keep = new Array<boolean>(points.length).fill(false);
	keep[0] = true;
	keep[points.length - 1] = true;

	const stack: Array<[number, number]> = [[0, points.length - 1]];

	while (stack.length > 0) {
		const [start, end] = stack.pop() as [number, number];
		if (end - start < 2) continue;

		let farthestIndex = -1;
		let farthestDistance = toleranceM;

		for (let i = start + 1; i < end; i++) {
			const distance = perpendicularDistanceM(points[i], points[start], points[end]);
			if (distance > farthestDistance) {
				farthestDistance = distance;
				farthestIndex = i;
			}
		}

		// لا نقطة تتجاوز السماحيّة ⇒ القطعة كلّها تُمثَّل بطرفيها.
		if (farthestIndex === -1) continue;

		keep[farthestIndex] = true;
		stack.push([start, farthestIndex], [farthestIndex, end]);
	}

	return points.filter((_, index) => keep[index]);
};

/**
 * معامل الطريق الافتراضي: نسبة مسافة الطريق الفعليّة إلى المسافة المستقيمة في نسيج
 * حضري نمطي.
 */
export const DEFAULT_ROAD_FACTOR = 1.3;

/**
 * تقدير زمن الوصول بالدقائق: مسافة مستقيمة × معامل طريق ÷ سرعة متوسّطة.
 *
 * تقدير صادق لا أكثر — لا يعرف الطرق ولا الازدحام ولا الاتجاهات الإجباريّة. يُستبدل بـ
 * OSRM في [MC8.3] **خلف التوقيع نفسه**، فلا يتغيّر أي مستدعٍ.
 *
 * تُعاد `null` عند سرعة غير صالحة (صفر أو سالبة) بدل `Infinity`: زمن وصول مجهول يُعرض
 * كـ «غير متاح»، أمّا رقم لانهائي فيتسرّب إلى الواجهة ويصير «NaN دقيقة».
 */
export const estimateEtaMinutes = (
	from: GeoPoint,
	to: GeoPoint,
	avgSpeedKph: number,
	roadFactor: number = DEFAULT_ROAD_FACTOR,
): number | null => {
	if (!(avgSpeedKph > 0) || !(roadFactor > 0)) return null;

	const roadKm = haversineKm(from, to) * roadFactor;
	return Math.round((roadKm / avgSpeedKph) * 60);
};

/**
 * [MC3.2] هل الإحداثي صالح؟
 *
 * يرفض ما يصل فعلًا من الأجهزة: قيمة فارغة تحوّلت إلى صفر، أو NaN من تحليل فاشل، أو قيمة
 * خارج المدى من حمولة تالفة. النقطة (0, 0) مرفوضة تحديدًا لأنّها تقع في خليج غينيا، وهي
 * أشيع تعبير عن «لا إشارة» — قبولها يضع مركبةً في المحيط الأطلسي على الخريطة.
 *
 * الصفر في أحد المحورين وحده مقبول: خط الاستواء وخطّ غرينتش موقعان حقيقيّان.
 */
export const isValidCoordinate = (
	point: Partial<GeoPoint> | null | undefined,
): point is GeoPoint => {
	if (!point) return false;
	const { lat, lng } = point;
	if (typeof lat !== "number" || typeof lng !== "number") return false;
	if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
	if (lat < -90 || lat > 90) return false;
	if (lng < -180 || lng > 180) return false;
	if (lat === 0 && lng === 0) return false;
	return true;
};

/**
 * [MC3.2] المسافة المقطوعة على امتداد مسار، بالكيلومتر.
 *
 * `minSegmentM` يُسقط القفزات دون العتبة قبل الجمع، وليس هذا تحسينًا: مركبة واقفة بإشارة
 * مرتجفة تُنتج سيلًا متّصلًا من قراءات تبعد ٣–٨ أمتار، فتتراكم كيلومترات وهميّة في تقرير
 * الوردية. النقطة المرجعية تتقدّم فقط عند تجاوز العتبة، فلا يضيع تحرّكٌ حقيقي بخطوات صغيرة.
 */
export const trailDistanceKm = (points: GeoPoint[], minSegmentM = 15): number => {
	if (points.length < 2) return 0;

	let total = 0;
	let anchor = points[0];

	for (let i = 1; i < points.length; i++) {
		const segmentM = haversineKm(anchor, points[i]) * 1000;
		if (segmentM < minSegmentM) continue;
		total += segmentM;
		anchor = points[i];
	}

	return total / 1000;
};

/**
 * [MC8.4] تخشين الموقع قبل مغادرته إلى طرف عام.
 *
 * صفحة تتبّع وليّ الأمر تقول «المركبة تقترب» لا «المركبة أمام هذا الباب». ثلاث خانات عشرية
 * ≈ ١١٠ مترًا: تكفي لتحريك علامة على طريق، ولا تكفي لتحديد البيت الذي يقف أمامه الطاقم.
 */
export const coarsenPoint = (point: GeoPoint, decimals = 3): GeoPoint => {
	const factor = 10 ** decimals;
	return {
		lat: Math.round(point.lat * factor) / factor,
		lng: Math.round(point.lng * factor) / factor,
	};
};
