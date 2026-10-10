// باركود Code128-B مرسوم كـ SVG — دون أي اعتمادية خارجية.
// الترميز قياسي: بداية B ثم البيانات ثم خانة التحقق (mod 103) ثم الإيقاف.

/** أنماط العرض لكل رمز في Code128 (ستة أعداد: عرض الشرائط بالتناوب أسود/أبيض) */
const CODE128_PATTERNS = [
	"212222",
	"222122",
	"222221",
	"121223",
	"121322",
	"131222",
	"122213",
	"122312",
	"132212",
	"221213",
	"221312",
	"231212",
	"112232",
	"122132",
	"122231",
	"113222",
	"123122",
	"123221",
	"223211",
	"221132",
	"221231",
	"213212",
	"223112",
	"312131",
	"311222",
	"321122",
	"321221",
	"312212",
	"322112",
	"322211",
	"212123",
	"212321",
	"232121",
	"111323",
	"131123",
	"131321",
	"112313",
	"132113",
	"132311",
	"211313",
	"231113",
	"231311",
	"112133",
	"112331",
	"132131",
	"113123",
	"113321",
	"133121",
	"313121",
	"211331",
	"231131",
	"213113",
	"213311",
	"213131",
	"311123",
	"311321",
	"331121",
	"312113",
	"312311",
	"332111",
	"314111",
	"221411",
	"431111",
	"111224",
	"111422",
	"121124",
	"121421",
	"141122",
	"141221",
	"112214",
	"112412",
	"122114",
	"122411",
	"142112",
	"142211",
	"241211",
	"221114",
	"413111",
	"241112",
	"134111",
	"111242",
	"121142",
	"121241",
	"114212",
	"124112",
	"124211",
	"411212",
	"421112",
	"421211",
	"212141",
	"214121",
	"412121",
	"111143",
	"111341",
	"131141",
	"114113",
	"114311",
	"411113",
	"411311",
	"113141",
	"114131",
	"311141",
	"411131",
	"211412",
	"211214",
	"211232",
	"233111",
	"200000",
] as const;

const START_B = 104;
const STOP = 106;

/** يحوّل النص إلى قائمة أعراض الشرائط (1 = وحدة عرض) */
export function encodeCode128B(value: string): number[] {
	const codes: number[] = [START_B];
	let checksum = START_B;

	for (let i = 0; i < value.length; i++) {
		const charCode = value.charCodeAt(i);
		// Code128-B يغطي ASCII 32..126؛ أي محرف خارجها يُستبدل بمسافة
		const code = charCode >= 32 && charCode <= 126 ? charCode - 32 : 0;
		codes.push(code);
		checksum += code * (i + 1);
	}

	codes.push(checksum % 103);
	codes.push(STOP);
	return codes;
}

export function LabBarcode({
	value,
	height = 56,
	moduleWidth = 2,
	className,
	/** النص المقروء تحت الشرائط (HRI) — معياري على ملصقات المختبر */
	showText = true,
}: {
	value: string;
	height?: number;
	moduleWidth?: number;
	className?: string;
	showText?: boolean;
}) {
	const codes = encodeCode128B(value);

	// نبني المستطيلات السوداء: كل نمط يتناوب أسود/أبيض بدءًا بالأسود
	const bars: { x: number; width: number }[] = [];
	let x = 0;
	for (const code of codes) {
		const pattern = CODE128_PATTERNS[code] ?? CODE128_PATTERNS[0];
		for (let i = 0; i < pattern.length; i++) {
			const width = Number(pattern[i]) * moduleWidth;
			if (i % 2 === 0) bars.push({ x, width });
			x += width;
		}
	}
	const totalWidth = x;
	// مساحة النص المقروء أسفل الشرائط
	const textHeight = showText ? Math.max(10, Math.round(height * 0.22)) : 0;
	const barsHeight = height - textHeight;

	return (
		// الشرائط ترسم بإحداثيات مطلقة فلا يعكسها اتجاه الصفحة RTL
		<svg
			className={className}
			width="100%"
			height={height}
			viewBox={`0 0 ${totalWidth} ${height}`}
			preserveAspectRatio="xMidYMid meet"
			role="img"
			aria-label={`باركود ${value}`}
		>
			<title>{value}</title>
			<rect
				width={totalWidth}
				height={height}
				fill="#fff"
			/>
			{bars.map((bar) => (
				<rect
					key={`${bar.x}-${bar.width}`}
					x={bar.x}
					y={0}
					width={bar.width}
					height={barsHeight}
					fill="#000"
				/>
			))}
			{showText && (
				<text
					x={totalWidth / 2}
					y={height - 1}
					textAnchor="middle"
					fontSize={textHeight}
					fontFamily="monospace"
					letterSpacing={moduleWidth}
					fill="#000"
				>
					{value}
				</text>
			)}
		</svg>
	);
}
