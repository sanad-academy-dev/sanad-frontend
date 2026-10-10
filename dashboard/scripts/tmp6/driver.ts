/**
 * ينشئ سائقًا حقيقيًّا لتطبيق المركبة، ويصدر له رمز اقتران جديدًا.
 *
 * التطبيق يطلب اعتمادين لا واحدًا: جلسة موظّف (بريد/كلمة مرور) **و** رمز المركبة.
 * لذلك لا يكفي إنشاء مستخدم — يجب أن يكون موظّفًا في العيادة، ومؤهّلًا للزيارات
 * المتنقلة، وعضوًا في طاقم المركبة.
 *
 * قابل للإعادة: إعادة التشغيل تُصدر رمزًا جديدًا وتُبطل القديم.
 */
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateVanToken } from "@/server/mobile-clinics/mobile-auth.macro";

const DRIVER = {
	email: "driver@elite.test",
	password: "devpassword123",
	name: "سائق المركبة",
};

// العيادة الهدف: نفس عيادة مستخدم التطوير التي تملك المركبة
const dev = await db.user.findUniqueOrThrow({
	where: { email: "dev@elite.test" },
	select: { id: true },
});
const devMembership = await db.clinicUser.findFirstOrThrow({
	where: { userId: dev.id },
	orderBy: { createdAt: "asc" },
	select: { clinicId: true },
});
const clinicId = devMembership.clinicId;

const unit = await db.mobileUnit.findFirstOrThrow({
	where: { clinicId, isDeleted: false },
	select: { id: true, code: true, name: true, branchId: true },
});

// ── 1) المستخدم ─────────────────────────────────────────────────────────
let user = await db.user.findUnique({ where: { email: DRIVER.email } });
if (!user) {
	await auth.api.signUpEmail({
		body: { email: DRIVER.email, password: DRIVER.password, name: DRIVER.name },
	});
	user = await db.user.findUniqueOrThrow({ where: { email: DRIVER.email } });
	await db.user.update({ where: { id: user.id }, data: { emailVerified: true } });

	/**
	 * خطّاف `user.create.after` في better-auth ينشئ للمستخدم الجديد **عيادةً خاصّة به**
	 * ويجعله مديرها. لو تُركت، لصارت هي العيادة النشطة عند تسجيل الدخول، ولرفض
	 * `requireVanSession` كل طلب: المركبة في عيادة أخرى.
	 */
	const auto = await db.clinicUser.findMany({
		where: { userId: user.id },
		select: { id: true, clinicId: true },
	});
	for (const membership of auto) {
		if (membership.clinicId === clinicId) continue;
		await db.staff.deleteMany({ where: { clinicId: membership.clinicId, userId: user.id } });
		await db.clinicUser.delete({ where: { id: membership.id } });
		await db.clinic.delete({ where: { id: membership.clinicId } }).catch(() => null);
	}
	console.log("USER        : أُنشئ", DRIVER.email);
} else {
	console.log("USER        : موجود مسبقًا", DRIVER.email);
}

// ── 2) عضوية العيادة الصحيحة ────────────────────────────────────────────
const existingMembership = await db.clinicUser.findFirst({
	where: { userId: user.id, clinicId },
	select: { id: true },
});
if (!existingMembership) {
	await db.clinicUser.create({ data: { userId: user.id, clinicId, role: "MEMBER" } });
}

// الجلسات القائمة تحمل العيادة القديمة — تُحذف ليُعاد حسمها عند الدخول التالي
await db.session.deleteMany({ where: { userId: user.id } });

// ── 3) سجلّ موظّف في العيادة ────────────────────────────────────────────
let staff = await db.staff.findFirst({
	where: { clinicId, userId: user.id },
	select: { id: true },
});
if (!staff) {
	const role = await db.staffRole.findFirstOrThrow({
		where: { clinicId },
		select: { id: true },
	});
	const stamp = `${Date.now()}`.slice(-6);
	staff = await db.staff.create({
		data: {
			clinicId,
			code: `DRV-${stamp}`,
			userId: user.id,
			roleId: role.id,
			branchId: unit.branchId,
			name: DRIVER.name,
			email: DRIVER.email,
			status: "ACTIVE",
			active: true,
		},
		select: { id: true },
	});
}

// ── 4) مؤهّل للزيارات المتنقلة + عضو في الطاقم ─────────────────────────
await db.staffSchedulingSettings.upsert({
	where: { staffId: staff.id },
	create: { staffId: staff.id, mobileClinicAppointmentsEnabled: true },
	update: { mobileClinicAppointmentsEnabled: true },
});

const inCrew = await db.mobileUnitCrew.findFirst({
	where: { mobileUnitId: unit.id, staffId: staff.id },
	select: { id: true },
});
if (!inCrew) {
	await db.mobileUnitCrew.create({
		data: { clinicId, mobileUnitId: unit.id, staffId: staff.id, role: "DRIVER" },
	});
}

// ── 5) رمز اقتران جديد ─────────────────────────────────────────────────
// القديم يُبطل لا يُحذف: الإبطال أثرٌ مرئي في سجلّ الأجهزة، والحذف يمحو الأثر.
await db.mobileUnitDevice.updateMany({
	where: { mobileUnitId: unit.id, revokedAt: null, label: "هاتف السائق" },
	data: { revokedAt: new Date(), revokedById: dev.id },
});

const token = generateVanToken();
await db.mobileUnitDevice.create({
	data: {
		clinicId,
		mobileUnitId: unit.id,
		label: "هاتف السائق",
		tokenHash: token.tokenHash,
		tokenPrefix: token.tokenPrefix,
		createdById: dev.id,
	},
	select: { id: true },
});

console.log("STAFF       :", DRIVER.name, "(DRIVER في", unit.code + ")");
console.log("VAN         :", unit.code, "—", unit.name);
console.log("");
console.log("  البريد     :", DRIVER.email);
console.log("  كلمة المرور:", DRIVER.password);
console.log("  رمز المركبة:", token.raw);
process.exit(0);
