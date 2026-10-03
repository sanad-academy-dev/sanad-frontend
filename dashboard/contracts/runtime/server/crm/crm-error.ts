/**
 * [CRM-P0] رفضٌ من قواعد وحدة إدارة العملاء — رسالته عربية وموجَّهة للمستخدم.
 *
 * لماذا صنفٌ لا `Error` عاديًا: المتحكّم لا يلتقط كل خطأ ويحوّله إلى ٤٠٠. التقاطٌ شامل
 * كان سيبتلع عيبًا حقيقيًا (انتهاك قيد، خطأ برمجي) ويقدّمه للمستخدم كرفضِ قاعدةٍ عربي،
 * فيختفي الـ 500 الذي يجب أن يُرصَد. الصنف يفصل «رفضٌ مقصود» عن «عطلٌ غير متوقَّع».
 *
 * الاسم مُدرَج في `CLIENT_ERROR_NAMES` داخل `src/server/app.ts`، فيصل نصّه كما هو بـ٤٠٠
 * (يحرس ذلك `domain-error-reachability.audit.test.ts`).
 */
export class CrmError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "CrmError";
	}
}
