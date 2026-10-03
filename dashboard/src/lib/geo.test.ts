import { describe, expect, it } from "vitest";

import {
	boundingBox,
	coarsenPoint,
	DEFAULT_ROAD_FACTOR,
	estimateEtaMinutes,
	type GeoPoint,
	haversineKm,
	isValidCoordinate,
	pointInCircle,
	pointInPolygon,
	simplifyTrail,
	trailDistanceKm,
} from "@/lib/geo";

// نقاط مرجعية حقيقية — التأكيدات تقارن بمسافات معروفة لا بمخرجات الدالّة نفسها.
const RIYADH: GeoPoint = { lat: 24.7136, lng: 46.6753 };
const JEDDAH: GeoPoint = { lat: 21.4858, lng: 39.1925 };
const DAMMAM: GeoPoint = { lat: 26.4207, lng: 50.0888 };

describe("haversineKm", () => {
	it("returns zero for the same point", () => {
		expect(haversineKm(RIYADH, RIYADH)).toBe(0);
	});

	it("matches the Riyadh→Jeddah great-circle distance (~845 km)", () => {
		expect(haversineKm(RIYADH, JEDDAH)).toBeCloseTo(845.1, 1);
	});

	it("matches the Riyadh→Dammam great-circle distance (~391 km)", () => {
		expect(haversineKm(RIYADH, DAMMAM)).toBeCloseTo(391.5, 1);
	});

	it("agrees with the spherical law of cosines — an independent formula", () => {
		// تحقّق متقاطع بصيغة مختلفة رياضيًّا على النموذج الكروي نفسه: يكشف خطأً في اشتقاق
		// هافرسين، ولا يكتفي بمقارنة الدالّة بمخرجاتها.
		const lawOfCosinesKm = (a: GeoPoint, b: GeoPoint) => {
			const rad = (d: number) => (d * Math.PI) / 180;
			return (
				6371.0088 *
				Math.acos(
					Math.sin(rad(a.lat)) * Math.sin(rad(b.lat)) +
						Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.cos(rad(b.lng - a.lng)),
				)
			);
		};

		for (const [from, to] of [
			[RIYADH, JEDDAH],
			[RIYADH, DAMMAM],
			[JEDDAH, DAMMAM],
		] as const) {
			expect(haversineKm(from, to)).toBeCloseTo(lawOfCosinesKm(from, to), 6);
		}
	});

	it("is symmetric", () => {
		expect(haversineKm(RIYADH, JEDDAH)).toBeCloseTo(haversineKm(JEDDAH, RIYADH), 9);
	});

	it("resolves short urban distances — one degree of latitude is ~110.6 km", () => {
		const northOfRiyadh = { lat: RIYADH.lat + 1, lng: RIYADH.lng };
		expect(haversineKm(RIYADH, northOfRiyadh)).toBeCloseTo(111.19, 1);
	});

	it("handles antipodal points without NaN from floating-point drift", () => {
		const distance = haversineKm({ lat: 0, lng: 0 }, { lat: 0, lng: 180 });
		expect(Number.isFinite(distance)).toBe(true);
		expect(distance).toBeCloseTo(20015, 0);
	});
});

describe("pointInCircle", () => {
	const center = RIYADH;

	it("accepts a point well inside the radius", () => {
		expect(pointInCircle({ lat: 24.72, lng: 46.68 }, center, 5)).toBe(true);
	});

	it("rejects a point well outside the radius", () => {
		expect(pointInCircle(JEDDAH, center, 100)).toBe(false);
	});

	it("treats the boundary as inside", () => {
		// نقطة على بعد درجة عرض واحدة تمامًا ≈ 111.19 كم.
		const onEdge = { lat: center.lat + 1, lng: center.lng };
		expect(pointInCircle(onEdge, center, haversineKm(center, onEdge))).toBe(true);
	});

	it("rejects everything for a zero or negative radius", () => {
		expect(pointInCircle(center, center, 0)).toBe(false);
		expect(pointInCircle(center, center, -5)).toBe(false);
	});
});

describe("pointInPolygon", () => {
	// مربّع بسيط حول الرياض، بترتيب عقارب الساعة عكسيًّا.
	const square: GeoPoint[] = [
		{ lat: 24.6, lng: 46.6 },
		{ lat: 24.6, lng: 46.8 },
		{ lat: 24.8, lng: 46.8 },
		{ lat: 24.8, lng: 46.6 },
	];

	it("accepts an interior point", () => {
		expect(pointInPolygon({ lat: 24.7, lng: 46.7 }, square)).toBe(true);
	});

	it("rejects an exterior point on every side", () => {
		expect(pointInPolygon({ lat: 24.5, lng: 46.7 }, square)).toBe(false);
		expect(pointInPolygon({ lat: 24.9, lng: 46.7 }, square)).toBe(false);
		expect(pointInPolygon({ lat: 24.7, lng: 46.5 }, square)).toBe(false);
		expect(pointInPolygon({ lat: 24.7, lng: 46.9 }, square)).toBe(false);
	});

	it("gives the same answer for an explicitly closed ring", () => {
		const closed = [...square, square[0]];
		expect(pointInPolygon({ lat: 24.7, lng: 46.7 }, closed)).toBe(true);
		expect(pointInPolygon({ lat: 24.5, lng: 46.7 }, closed)).toBe(false);
	});

	it("handles a concave ring — the notch is outside", () => {
		// شكل حرف L: الربع العلوي الأيمن مقتطع.
		const lShape: GeoPoint[] = [
			{ lat: 0, lng: 0 },
			{ lat: 0, lng: 10 },
			{ lat: 5, lng: 10 },
			{ lat: 5, lng: 5 },
			{ lat: 10, lng: 5 },
			{ lat: 10, lng: 0 },
		];
		expect(pointInPolygon({ lat: 2, lng: 2 }, lShape)).toBe(true);
		expect(pointInPolygon({ lat: 8, lng: 2 }, lShape)).toBe(true);
		expect(pointInPolygon({ lat: 8, lng: 8 }, lShape)).toBe(false);
	});

	it("rejects degenerate rings of fewer than three points", () => {
		expect(pointInPolygon({ lat: 0, lng: 0 }, [])).toBe(false);
		expect(pointInPolygon({ lat: 0, lng: 0 }, [{ lat: 0, lng: 0 }])).toBe(false);
		expect(
			pointInPolygon({ lat: 0, lng: 0 }, [
				{ lat: 0, lng: 0 },
				{ lat: 1, lng: 1 },
			]),
		).toBe(false);
	});
});

describe("boundingBox", () => {
	it("always contains the circle it describes", () => {
		const box = boundingBox(RIYADH, 10);
		expect(box.minLat).toBeLessThan(RIYADH.lat);
		expect(box.maxLat).toBeGreaterThan(RIYADH.lat);
		expect(box.minLng).toBeLessThan(RIYADH.lng);
		expect(box.maxLng).toBeGreaterThan(RIYADH.lng);
	});

	it("never excludes a point the exact circle check accepts", () => {
		// هذا هو الثابت الذي تقوم عليه التصفية المسبقة كلّها: كل نقطة يقبلها `pointInCircle`
		// يجب أن تقع داخل الصندوق. يُفحص بمسحٍ كثيف يتجاوز حدود الصندوق — لا ببناء نقاطٍ
		// «على المحيط» بثوابت مكتوبة في الاختبار، لأنّ أيّ ثابت يخالف الكرة التي يقيس عليها
		// هافرسين يُنتج نقاطًا خارج الدائرة فعليًّا، فيمرّ الاختبار وهو لا يفحص شيئًا.
		const centers: GeoPoint[] = [
			RIYADH,
			{ lat: 0, lng: 0.5 },
			{ lat: 60, lng: 10 },
			{ lat: -33.86, lng: 151.2 },
		];

		let acceptedTotal = 0;

		for (const center of centers) {
			for (const radiusKm of [1, 25, 200]) {
				const box = boundingBox(center, radiusKm);

				// امتداد المسح أوسع من الصندوق بمرّة ونصف ليشمل نقاطًا مرفوضة أيضًا.
				const latSpan = (radiusKm / 110) * 1.5;
				const lngSpan = latSpan / Math.cos((center.lat * Math.PI) / 180);

				for (let i = -12; i <= 12; i++) {
					for (let j = -12; j <= 12; j++) {
						const point: GeoPoint = {
							lat: center.lat + (latSpan * i) / 12,
							lng: center.lng + (lngSpan * j) / 12,
						};
						if (Math.abs(point.lat) > 90 || Math.abs(point.lng) > 180) continue;
						if (!pointInCircle(point, center, radiusKm)) continue;

						acceptedTotal++;
						expect(point.lat).toBeGreaterThanOrEqual(box.minLat);
						expect(point.lat).toBeLessThanOrEqual(box.maxLat);
						expect(point.lng).toBeGreaterThanOrEqual(box.minLng);
						expect(point.lng).toBeLessThanOrEqual(box.maxLng);
					}
				}
			}
		}

		// حارس ضدّ المرور الفارغ: لو لم يقبل الفحص الدقيق أيّ نقطة لما فحصنا الثابت أصلًا.
		expect(acceptedTotal).toBeGreaterThan(1000);
	});

	it("widens longitude with latitude — the same radius spans more degrees near the pole", () => {
		const nearEquator = boundingBox({ lat: 0, lng: 0 }, 50);
		const farNorth = boundingBox({ lat: 60, lng: 0 }, 50);
		expect(farNorth.maxLng - farNorth.minLng).toBeGreaterThan(
			nearEquator.maxLng - nearEquator.minLng,
		);
	});

	it("falls back to the full longitude range at the pole", () => {
		const box = boundingBox({ lat: 89.99, lng: 0 }, 100);
		expect(box.minLng).toBe(-180);
		expect(box.maxLng).toBe(180);
	});

	it("falls back to the full longitude range rather than wrapping the antimeridian", () => {
		const box = boundingBox({ lat: 0, lng: 179.5 }, 200);
		expect(box.minLng).toBe(-180);
		expect(box.maxLng).toBe(180);
	});

	it("clamps latitude to the valid range", () => {
		const box = boundingBox({ lat: 89, lng: 0 }, 1000);
		expect(box.maxLat).toBe(90);
	});

	it("collapses to the centre for a zero radius", () => {
		const box = boundingBox(RIYADH, 0);
		expect(box.minLat).toBeCloseTo(RIYADH.lat, 9);
		expect(box.maxLat).toBeCloseTo(RIYADH.lat, 9);
		expect(box.minLng).toBeCloseTo(RIYADH.lng, 9);
		expect(box.maxLng).toBeCloseTo(RIYADH.lng, 9);
	});
});

describe("simplifyTrail", () => {
	it("returns short trails untouched", () => {
		expect(simplifyTrail([], 10)).toEqual([]);
		expect(simplifyTrail([RIYADH], 10)).toEqual([RIYADH]);
		expect(simplifyTrail([RIYADH, JEDDAH], 10)).toEqual([RIYADH, JEDDAH]);
	});

	it("collapses a straight line to its endpoints", () => {
		const straight: GeoPoint[] = Array.from({ length: 20 }, (_, i) => ({
			lat: 24.7,
			lng: 46.6 + i * 0.001,
		}));

		const simplified = simplifyTrail(straight, 10);
		expect(simplified).toHaveLength(2);
		expect(simplified[0]).toEqual(straight[0]);
		expect(simplified[1]).toEqual(straight[straight.length - 1]);
	});

	it("keeps a genuine corner", () => {
		// انعطاف قدره ~0.01 درجة عرض ≈ 1.1 كم — أبعد بكثير من سماحيّة 50 م.
		const corner: GeoPoint[] = [
			{ lat: 24.7, lng: 46.6 },
			{ lat: 24.71, lng: 46.61 },
			{ lat: 24.7, lng: 46.62 },
		];

		expect(simplifyTrail(corner, 50)).toEqual(corner);
	});

	it("drops a wobble smaller than the tolerance", () => {
		// انحراف ~0.000045 درجة ≈ 5 م، دون سماحيّة 50 م.
		const wobble: GeoPoint[] = [
			{ lat: 24.7, lng: 46.6 },
			{ lat: 24.700045, lng: 46.605 },
			{ lat: 24.7, lng: 46.61 },
		];

		expect(simplifyTrail(wobble, 50)).toHaveLength(2);
	});

	it("always preserves the first and last points", () => {
		const trail: GeoPoint[] = Array.from({ length: 100 }, (_, i) => ({
			lat: 24.7 + Math.sin(i / 7) * 0.0001,
			lng: 46.6 + i * 0.0005,
		}));

		const simplified = simplifyTrail(trail, 100);
		expect(simplified[0]).toEqual(trail[0]);
		expect(simplified[simplified.length - 1]).toEqual(trail[trail.length - 1]);
	});

	it("preserves original order and never invents points", () => {
		const trail: GeoPoint[] = Array.from({ length: 50 }, (_, i) => ({
			lat: 24.7 + Math.sin(i / 3) * 0.002,
			lng: 46.6 + i * 0.001,
		}));

		const simplified = simplifyTrail(trail, 30);
		expect(simplified.length).toBeLessThanOrEqual(trail.length);
		for (const point of simplified) expect(trail).toContainEqual(point);

		const indices = simplified.map((p) => trail.indexOf(p));
		expect(indices).toEqual([...indices].sort((a, b) => a - b));
	});

	it("keeps more points as the tolerance tightens", () => {
		const trail: GeoPoint[] = Array.from({ length: 200 }, (_, i) => ({
			lat: 24.7 + Math.sin(i / 5) * 0.001,
			lng: 46.6 + i * 0.0002,
		}));

		expect(simplifyTrail(trail, 5).length).toBeGreaterThan(simplifyTrail(trail, 200).length);
	});

	it("returns the trail unchanged for a non-positive tolerance", () => {
		const trail: GeoPoint[] = [RIYADH, DAMMAM, JEDDAH];
		expect(simplifyTrail(trail, 0)).toEqual(trail);
		expect(simplifyTrail(trail, -1)).toEqual(trail);
	});

	it("handles a full shift's worth of pings without exhausting the call stack", () => {
		// وردية ١٠ ساعات بنبضة كلّ ١٥ ثانية ≈ ٢٤٠٠ نقطة (خطة الوحدة §3.2). المسار هنا
		// رتيب صعودًا — أسوأ حالة عمقٍ في Douglas–Peucker.
		const trail: GeoPoint[] = Array.from({ length: 2400 }, (_, i) => ({
			lat: 24.7 + i * 0.0001,
			lng: 46.6 + (i % 2) * 0.0002,
		}));

		expect(() => simplifyTrail(trail, 10)).not.toThrow();
	});
});

describe("estimateEtaMinutes", () => {
	it("applies the road factor to the straight-line distance", () => {
		const straightKm = haversineKm(RIYADH, DAMMAM);
		const expected = Math.round(((straightKm * DEFAULT_ROAD_FACTOR) / 80) * 60);
		expect(estimateEtaMinutes(RIYADH, DAMMAM, 80)).toBe(expected);
	});

	it("honours an explicit road factor", () => {
		const direct = estimateEtaMinutes(RIYADH, DAMMAM, 80, 1) as number;
		const detoured = estimateEtaMinutes(RIYADH, DAMMAM, 80, 2) as number;
		// النتيجة مقرَّبة إلى دقيقة كاملة، فالضِعف قد يزيغ بدقيقة واحدة عن ضِعف المقرَّب.
		expect(Math.abs(detoured - direct * 2)).toBeLessThanOrEqual(1);
	});

	it("returns zero minutes for a stop the van is already at", () => {
		expect(estimateEtaMinutes(RIYADH, RIYADH, 40)).toBe(0);
	});

	it("returns null rather than Infinity for an invalid speed", () => {
		expect(estimateEtaMinutes(RIYADH, DAMMAM, 0)).toBeNull();
		expect(estimateEtaMinutes(RIYADH, DAMMAM, -10)).toBeNull();
	});

	it("returns null for a non-positive road factor", () => {
		expect(estimateEtaMinutes(RIYADH, DAMMAM, 80, 0)).toBeNull();
	});

	it("is slower for a slower van", () => {
		const fast = estimateEtaMinutes(RIYADH, DAMMAM, 100) as number;
		const slow = estimateEtaMinutes(RIYADH, DAMMAM, 50) as number;
		expect(slow).toBeGreaterThan(fast);
	});
});

describe("isValidCoordinate", () => {
	it("يقبل موقعًا حقيقيًّا", () => {
		expect(isValidCoordinate(RIYADH)).toBe(true);
		expect(isValidCoordinate({ lat: -33.86, lng: 151.2 })).toBe(true);
	});

	// أشيع حمولة «لا إشارة»؛ قبولها يضع مركبةً في خليج غينيا على الخريطة
	it("يرفض النقطة (0,0)", () => {
		expect(isValidCoordinate({ lat: 0, lng: 0 })).toBe(false);
	});

	it("يقبل صفرًا في محور واحد — الاستواء وغرينتش موقعان حقيقيّان", () => {
		expect(isValidCoordinate({ lat: 0, lng: 46.6753 })).toBe(true);
		expect(isValidCoordinate({ lat: 24.7136, lng: 0 })).toBe(true);
	});

	it("يرفض العدم وغير الأرقام وNaN وما خرج عن المدى", () => {
		expect(isValidCoordinate(null)).toBe(false);
		expect(isValidCoordinate(undefined)).toBe(false);
		expect(isValidCoordinate({})).toBe(false);
		expect(isValidCoordinate({ lat: 24 })).toBe(false);
		expect(isValidCoordinate({ lat: Number.NaN, lng: 46 })).toBe(false);
		expect(isValidCoordinate({ lat: 24, lng: Number.POSITIVE_INFINITY })).toBe(false);
		expect(isValidCoordinate({ lat: 91, lng: 46 })).toBe(false);
		expect(isValidCoordinate({ lat: -91, lng: 46 })).toBe(false);
		expect(isValidCoordinate({ lat: 24, lng: 181 })).toBe(false);
		expect(isValidCoordinate({ lat: 24, lng: -181 })).toBe(false);
		expect(isValidCoordinate({ lat: "24" as unknown as number, lng: 46 })).toBe(false);
	});
});

describe("trailDistanceKm", () => {
	it("صفر لأقلّ من نقطتين", () => {
		expect(trailDistanceKm([])).toBe(0);
		expect(trailDistanceKm([RIYADH])).toBe(0);
	});

	it("يجمع الأضلاع المتتالية", () => {
		const a = RIYADH;
		const b = { lat: a.lat, lng: a.lng + 0.03 };
		const c = { lat: b.lat + 0.03, lng: b.lng };
		const expected = haversineKm(a, b) + haversineKm(b, c);
		expect(trailDistanceKm([a, b, c])).toBeCloseTo(expected, 3);
	});

	/**
	 * الحالة التي تبرّر العتبة: مركبة واقفة ساعتين ونصفًا بإشارة مرتجفة. بلا إسقاط
	 * القفزات الصغيرة تُسجَّل كيلومترات لم تُقطع في تقرير الوردية.
	 */
	it("يُسقط ارتجاف الوقوف بدل أن يراكمه كيلومترات وهميّة", () => {
		const jitter = Array.from({ length: 600 }, (_, i) => ({
			lat: RIYADH.lat + Math.sin(i) * 0.00004,
			lng: RIYADH.lng + Math.cos(i) * 0.00004,
		}));
		expect(trailDistanceKm([RIYADH, ...jitter])).toBe(0);
	});

	it("يحتسب تحرّكًا حقيقيًّا مكوَّنًا من خطوات صغيرة", () => {
		// خطوات ~22 مترًا: فوق العتبة، فتُحتسب كلّها
		const steps = Array.from({ length: 100 }, (_, i) => ({
			lat: RIYADH.lat,
			lng: RIYADH.lng + i * 0.0002,
		}));
		const straight = haversineKm(steps[0], steps[steps.length - 1]);
		expect(trailDistanceKm(steps)).toBeCloseTo(straight, 1);
	});

	it("يحترم عتبة يمرّرها المستدعي", () => {
		const steps = Array.from({ length: 20 }, (_, i) => ({
			lat: RIYADH.lat,
			lng: RIYADH.lng + i * 0.0002,
		}));
		expect(trailDistanceKm(steps, 0)).toBeGreaterThan(trailDistanceKm(steps, 10_000));
		expect(trailDistanceKm(steps, 10_000)).toBe(0);
	});
});

describe("coarsenPoint", () => {
	it("يخشّن إلى ثلاث خانات (~١١٠ م) افتراضيًّا", () => {
		expect(coarsenPoint({ lat: 24.713612, lng: 46.675297 })).toEqual({
			lat: 24.714,
			lng: 46.675,
		});
	});

	// الغرض أمني لا تجميلي: الناتج يجب أن يبقى بعيدًا بما يكفي عن الأصل
	it("لا يكشف موقعًا أدقّ من ~١٦٠ مترًا عن الأصل", () => {
		const exact = { lat: 24.713612, lng: 46.675297 };
		expect(haversineKm(exact, coarsenPoint(exact)) * 1000).toBeLessThan(160);
	});

	it("يحترم دقّة يمرّرها المستدعي", () => {
		expect(coarsenPoint({ lat: 24.713612, lng: 46.675297 }, 1)).toEqual({
			lat: 24.7,
			lng: 46.7,
		});
	});

	it("يعمل عبر خطّ الاستواء وخطّ غرينتش", () => {
		const result = coarsenPoint({ lat: -0.000412, lng: -0.000871 });
		expect(Math.abs(result.lat)).toBe(0);
		expect(result.lng).toBe(-0.001);
	});
});
