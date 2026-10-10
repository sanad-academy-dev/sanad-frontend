import type { Prisma } from "@/generated/prisma/client";
import type { MobileDispatchStage } from "@/generated/prisma/enums";
import type { PetOwnerScope } from "@/server/pet-portal/pet-auth.macro";
/**
 * [PP1] استعلامات بوّابة وليّ الأمر.
 *
 * ── القاعدة الوحيدة التي لا تُخرق ─────────────────────────────────────────
 *
 * **كل دالّة تقرأ بيانات تأخذ `scope` أوّل وسيط لها، وتُرشِّح عليه.** لا استثناء، ولا
 * «المعرّف جاء من الجلسة أصلًا». السبب أن هذه أوّل واجهة في النظام يصل إليها شخصٌ من
 * خارج الأكاديمية: خطأ ترشيح واحد هنا لا يعني عرضًا خاطئًا بل سجلًّا طبّيًّا لوليّ أمرٍ آخر
 * في يد شخصٍ لا يعرفه.
 *
 * ولهذا لا تُمرَّر `accountId` وحدها: `Owner` مقيَّد بأكاديمية، فالترشيح الصحيح على
 * `ownerIds` — ومَن يمرّر `accountId` سيكتب `where` خاطئًا لا محالة.
 */
/** أعمدة الطفل المسموح عرضها للوليّ أمر — لا ملاحظات داخلية ولا معرّفات موظّفين. */
declare const petSelect: {
    readonly id: true;
    readonly code: true;
    readonly name: true;
    readonly gender: true;
    readonly birthDate: true;
    readonly weight: true;
    readonly microchipNumber: true;
    readonly coat: true;
    readonly clinicId: true;
    readonly animalType: {
        readonly select: {
            readonly arName: true;
        };
    };
    readonly animalStrain: {
        readonly select: {
            readonly arName: true;
        };
    };
    readonly clinic: {
        readonly select: {
            readonly name: true;
        };
    };
};
export type PetPortalPet = Prisma.PatientGetPayload<{
    select: typeof petSelect;
}>;
declare const appointmentSelect: {
    readonly id: true;
    readonly startsAt: true;
    readonly durationMinutes: true;
    readonly status: true;
    readonly reason: true;
    readonly location: true;
    readonly clinicId: true;
    readonly clinic: {
        readonly select: {
            readonly name: true;
        };
    };
    readonly branch: {
        readonly select: {
            readonly name: true;
        };
    };
    readonly patient: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly staff: {
        readonly select: {
            readonly user: {
                readonly select: {
                    readonly name: true;
                };
            };
        };
    };
    readonly services: {
        readonly select: {
            readonly service: {
                readonly select: {
                    readonly name: true;
                };
            };
        };
        readonly take: 1;
    };
    readonly mobileVisit: {
        readonly select: {
            readonly id: true;
        };
    };
    readonly invoice: {
        readonly select: {
            readonly id: true;
        };
    };
};
export type PetPortalAppointment = Prisma.AppointmentGetPayload<{
    select: typeof appointmentSelect;
}>;
export declare const petPortalDao: {
    /**
     * تسجيل الدخول برقم الجوّال وكلمة المرور.
     *
     * الردّ موحَّد لكل أسباب الفشل («رقم الجوّال أو كلمة المرور غير صحيحة»): التمييز
     * بين «لا حساب بهذا الرقم» و«الكلمة خاطئة» يمنح المهاجم عدّادَ أرقامٍ صالحة مجّانًا.
     */
    signIn(phoneE164: string, password: string, userAgent: string | null): Promise<{
        ok: false;
        reason: "INVALID";
        until?: undefined;
        token?: undefined;
        mustChangePassword?: undefined;
        name?: undefined;
    } | {
        ok: false;
        reason: "SUSPENDED";
        until?: undefined;
        token?: undefined;
        mustChangePassword?: undefined;
        name?: undefined;
    } | {
        ok: false;
        reason: "LOCKED";
        until: Date;
        token?: undefined;
        mustChangePassword?: undefined;
        name?: undefined;
    } | {
        ok: true;
        token: string;
        mustChangePassword: boolean;
        name: string | null;
        reason?: undefined;
        until?: undefined;
    }>;
    /**
     * يربط الحساب بكل صفّ `Owner` يحمل الرقم نفسه.
     *
     * هذه هي ميزة «أكاديمياتي» كلّها، وهي تسقط من قيدٍ قائم في قاعدة البيانات لا من شيفرة
     * جديدة: `Owner` فريد بـ(clinicId, phoneE164)، فالمطابقة على الرقم تُعطي صفًّا واحدًا
     * لكل أكاديمية بالضبط.
     */
    syncLinks(accountId: string, phoneE164: string): Promise<number>;
    signOut(rawTokenHash: string): Promise<void>;
    /**
     * تغيير كلمة المرور.
     *
     * يُبطل **كل** جلسات الحساب عدا الحالية: تغيير الكلمة يعني غالبًا أن القديمة صارت
     * معروفة لغير صاحبها، وترك جلساتها قائمة يُفرغ التغيير من معناه.
     */
    changePassword(accountId: string, currentTokenHash: string, next: string): Promise<void>;
    me(scope: PetOwnerScope): Promise<{
        /**
         * حقولٌ لا وجود لها في المخطّط بعد تُعاد بقيمٍ صريحة لا محذوفة.
         *
         * التطبيق يتحقّق من شكل الاستجابة بـzod، وحقلٌ مفقود يُفشل التحقّق فيسقط
         * النداء كلّه — بينما `null` يمرّ ويعرض التطبيق حالته الفارغة. الموافقة
         * التسويقية وحذف الحساب ميزتان قادمتان ([PP11])، والصورة الرمزية لا عمود لها.
         */
        account: {
            id: string;
            phoneE164: string;
            name: string | null;
            email: string | null;
            locale: string;
            avatarUrl: string | null;
            marketingOptIn: boolean;
            consentVersion: string | null;
            deletionScheduledAt: string | null;
            mustChangePassword: boolean;
        } | null;
        /**
         * `links` لا `clinics` — اسم العقد كما يتوقّعه التطبيق.
         *
         * والعدّادات صفرٌ **صادق** لا مُلفَّق: المحادثات والتنبيهات ومحرّك الاستحقاق
         * لم تُوصل ببوّابة وليّ الأمر بعد. إعادةُ رقمٍ مخمَّن هنا كانت ستُظهر شارةً حمراء
         * على أيقونةٍ لا يفتح خلفها شيء.
         */
        links: {
            linkId: string;
            clinicId: string;
            clinicName: string;
            clinicSlug: string | null;
            logoUrl: string | null;
            phone: string | null;
            city: string | null;
            source: import("@/generated/prisma/enums").PetOwnerLinkSource;
            hidden: boolean;
            ownerCode: string;
            petCount: number;
            /**
             * `false` افتراضًا — الحجز يصير **طلبًا تؤكّده الأكاديمية** لا حجزًا مباشرًا.
             *
             * هذا هو الافتراض الأسلم (سؤال Q3 في الخطة): أكاديمية تكتشف جلسات ظهرت في
             * تقويمها بلا علمها تُطفئ الميزة كلّها. الفتح يصير إعدادًا لكل أكاديمية حين
             * تطلبه.
             */
            directBooking: boolean;
        }[];
        unreadMessages: number;
        unreadNotifications: number;
        dueCount: number;
        unpaidCount: number;
    }>;
    /**
     * الأطفال — **مسطّحة لا كما يعيدها Prisma**.
     *
     * الاستجابة عقدٌ مع التطبيق لا انعكاسًا لشكل الجداول: `animalType.arName` يصير
     * `animalType` نصًّا، و`weight` يصير `weightKg` باسمه الصريح. تسريب شكل Prisma إلى
     * الشبكة يربط شاشات التطبيق بمخطّط قاعدة البيانات، فيصير تغيير عمودٍ داخلي كسرًا
     * في تطبيق منشور على هواتف الناس.
     */
    pets(scope: PetOwnerScope): Promise<{
        id: string;
        clinicId: string;
        clinicName: string;
        code: string;
        name: string;
        gender: import("@/generated/prisma/enums").Gender;
        animalType: string;
        animalStrain: string | null;
        birthDate: string | null;
        weightKg: number | null;
        microchipNumber: string | null;
        coat: string | null;
        photoUrl: string | null;
        linkedPatientIds: string[];
    }[]>;
    appointments(scope: PetOwnerScope, upcoming: boolean): Promise<{
        id: string;
        clinicId: string;
        clinicName: string;
        branchName: string;
        petId: string;
        petName: string;
        petPhotoUrl: string | null;
        doctorName: string | null;
        serviceName: string;
        startsAt: string;
        endsAt: string;
        status: import("@/generated/prisma/enums").AppointmentStatus;
        location: import("@/generated/prisma/enums").AppointmentLocation;
        /**
         * الصلاحيات تُحسب في الخادم لا في التطبيق.
         *
         * زرٌّ يظهر ثم يُرفض عند الضغط أسوأ من زرٍّ غائب. والقاعدة هنا مبدئية
         * ومقصودة التحفّظ: الإلغاء والتعديل قبل الموعد بساعتين، وتسجيل الوصول في
         * نافذة نصف ساعة حوله. سياسة الأكاديمية لكل حالة تأتي لاحقًا.
         */
        canCancel: boolean;
        canReschedule: boolean;
        canCheckIn: boolean;
        trackingAvailable: boolean;
        callRoom: string | null;
        invoiceId: string | null;
    }[]>;
    /** طفل واحد — **مُرشَّح على النطاق**، فمعرّف طفل غيره يعيد `null` لا سجلًّا. */
    pet(scope: PetOwnerScope, patientId: string): Promise<{
        id: string;
        clinicId: string;
        clinicName: string;
        code: string;
        name: string;
        gender: import("@/generated/prisma/enums").Gender;
        animalType: string;
        animalStrain: string | null;
        birthDate: string | null;
        weightKg: number | null;
        microchipNumber: string | null;
        coat: string | null;
        photoUrl: string | null;
        linkedPatientIds: string[];
    } | null>;
    /**
     * تطعيمات طفل.
     *
     * `ageUnknown` يأتي من الخادم ولا يُحسب في التطبيق: غياب تاريخ الميلاد يعني أن موعد
     * الجرعة **لا يمكن حسابه**، لا أنه بعيد. تلفيق تاريخ هنا يجعل وليّ الأمر يطمئنّ لموعد
     * لا وجود له (D9).
     */
    vaccinations(scope: PetOwnerScope, patientId: string): Promise<{
        records: {
            id: string;
            vaccineName: string;
            doseNumber: number;
            givenAt: string;
            nextDueAt: string | null;
            batchNumber: string | null;
            administeredBy: string | null;
        }[];
        /**
         * المستحقّ يُشتقّ من الجرعات المسجَّلة التي لها موعد تالٍ — لا من محرّك
         * الاستحقاق الكامل (بروتوكولات، أعمار، أنواع)، فذلك لم يُوصل بالبوّابة بعد.
         * ما يظهر صحيح، وما لا يظهر ليس نفيًا لوجوده.
         */
        due: {
            id: string;
            vaccineName: string;
            doseNumber: number | null;
            dueAt: string | null;
            ageUnknown: boolean;
        }[];
        certificateUrl: string | null;
    } | null>;
    /** الأوزان — من العلامات الحيوية المسجَّلة في الأكاديمية. */
    weights(scope: PetOwnerScope, patientId: string): Promise<{
        recordedAt: string;
        weightKg: number;
        source: "CLINIC";
    }[] | null>;
    /**
     * السجل الزمني — الجلسات والتطعيمات فقط في هذه المرحلة.
     *
     * النتائج المخبرية والأشعّة **مستثناة عمدًا**: عرضها يتطلّب بوّابة النشر
     * (`releasedToOwnerAt`) التي لم تُبنَ، وإظهارها قبلها يعني وصول نتيجة إلى وليّ الأمر
     * قبل أن يقرأها المدرّب (D6).
     */
    /**
     * السجلّ الكامل للطفل.
     *
     * ── ما يظهر، وما لا يظهر، ولماذا ────────────────────────────────────
     *
     * كان السجلّ موعدًا وتطعيمًا لا غير، بينما الأكاديمية تحمل عنه أكثر من ذلك بكثير.
     * أُضيفت هنا **القياسات وخطط الرعاية وجلسات التجميل**: كلّها وقائع عن الطفل
     * يعرفها وليّ أمره أصلًا أو يستطيع أن يعرفها بسؤال، ولا يضرّه أن يقرأها بنفسه.
     *
     * **والتحاليل والأشعة تبقى خارجه عمدًا** — لا لأنها ناقصة تقنيًّا بل لأن إطلاق
     * نتيجةٍ إلى وليّ أمر قبل أن يقرأها مدرّب قرارٌ سريري لا عرضيّ: قيمةٌ خارج المدى تُقرأ
     * كارثةً وهي طبيعية لنوعها، وأخرى طبيعية الشكل يعرف المدرّب وحده أنها تستدعي
     * إعادة. ولا يوجد في المخطّط بعد عمود «أُطلقت للوليّ أمر» ولا فعلٌ يُطلقها ([D6])،
     * فالغياب هنا هو السلوك الصحيح حتى تُبنى البوّابة — لا نقصٌ يُسدّ بإظهار الكلّ.
     *
     * السقف مئة لكل مصدر: «الكامل» يعني ألّا يُقتطع سجلّ طفلٍ حقيقي، لا أن يُسحب
     * كلّ شيء بلا حدّ إلى هاتف.
     */
    timeline(scope: PetOwnerScope, patientId: string): Promise<({
        id: string;
        kind: "APPOINTMENT";
        /**
         * سبب الزيارة أوّلًا — هو ما يحمل معنى الزيارة، والدورة تفصيلٌ فيها.
         * وكانت الدورة تسبقه، فتظهر زيارةُ كشفٍ باسم تحليلٍ طُلب أثناءها.
         */
        title: string;
        subtitle: string | null;
        occurredAt: string;
        clinicName: string;
        href: string;
    } | {
        id: string;
        kind: "VACCINATION";
        title: string;
        subtitle: string | null;
        occurredAt: string;
        clinicName: string;
        href: string;
    } | {
        id: string;
        kind: "VITALS";
        title: string;
        /**
         * القياسات كلّها اختيارية في المخطّط، فيُبنى السطر ممّا سُجِّل فعلًا.
         * سردُ حقول فارغة يجعل كل قياس يبدو ناقصًا وهو تامّ لسياقه.
         */
        subtitle: string | null;
        occurredAt: string;
        clinicName: string;
        href: string;
    } | {
        id: string;
        kind: "CARE_PLAN";
        title: string;
        subtitle: string;
        occurredAt: string;
        clinicName: string;
        href: string;
    } | {
        id: string;
        kind: "GROOMING";
        title: string;
        subtitle: string;
        occurredAt: string;
        clinicName: string;
        href: string;
    })[] | null>;
    /** موعد واحد بتفاصيله. */
    appointment(scope: PetOwnerScope, appointmentId: string): Promise<{
        appointment: {
            id: string;
            clinicId: string;
            clinicName: string;
            branchName: string;
            petId: string;
            petName: string;
            petPhotoUrl: string | null;
            doctorName: string | null;
            serviceName: string;
            startsAt: string;
            endsAt: string;
            status: import("@/generated/prisma/enums").AppointmentStatus;
            location: import("@/generated/prisma/enums").AppointmentLocation;
            /**
             * الصلاحيات تُحسب في الخادم لا في التطبيق.
             *
             * زرٌّ يظهر ثم يُرفض عند الضغط أسوأ من زرٍّ غائب. والقاعدة هنا مبدئية
             * ومقصودة التحفّظ: الإلغاء والتعديل قبل الموعد بساعتين، وتسجيل الوصول في
             * نافذة نصف ساعة حوله. سياسة الأكاديمية لكل حالة تأتي لاحقًا.
             */
            canCancel: boolean;
            canReschedule: boolean;
            canCheckIn: boolean;
            trackingAvailable: boolean;
            callRoom: string | null;
            invoiceId: string | null;
        };
        summary: null;
        invoice: {
            id: string;
            code: string;
            total: number;
            amountPaid: number;
            currencyCode: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
        } | null;
    } | null>;
    /**
     * تتبّع الزيارة المنزلية.
     *
     * ── الخصوصية منقولة عن `/track/:token` حرفًا بحرف ─────────────────────
     *
     * صفحة التتبّع العامّة وضعت القواعد بعناية، وتكرارها هنا بأقلّ صرامة كان سيفتح
     * الثغرة نفسها من باب آخر:
     *   • **الموقع مُخشَّن** إلى ثلاث خانات (~١١٠ م): يكفي لتحريك علامة على طريق، ولا
     *     يكفي لتحديد البيت الذي تقف أمامه المركبة.
     *   • **يصمت فور انتهاء الزيارة** — رابطٌ أو جلسة لا يتحوّلان إلى تتبّع دائم لمركبة.
     *   • لا أسماء طاقم، ولا محطّات أخرى، ولا معرّفات داخلية.
     */
    tracking(scope: PetOwnerScope, appointmentId: string): Promise<{
        stage: MobileDispatchStage;
        stageLabel: string;
        finished: boolean;
        etaAt: string | null;
        windowStart: string | null;
        windowEnd: string | null;
        arrivedAt: string | null;
        lat: number | null;
        lng: number | null;
        clinicName: string;
        petName: string;
    } | null>;
    /** الفواتير المرتبطة بجلسات وليّ الأمر. */
    /**
     * [D6] النتائج **المنشورة** — وهي وحدها ما يصل تطبيق وليّ الأمر.
     *
     * الترشيح على `releasedToOwnerAt` لا على «اكتملت»: الاكتمال حدثٌ مخبري، والنشر
     * حكمٌ سريري سجّله مدرّبٌ باسمه (انظر `results-release.service.ts`). وكانت هذه
     * الدالّة تُرجع `[]` ثابتة لأن العمود لم يكن موجودًا أصلًا.
     *
     * ويُعرض **ملخّص النشر** لا التقرير الخام: الموجودات والانطباع كُتبا لمدرّب، ونقلهما
     * إلى وليّ الأمر ليس شفافية بل تحميلٌ له عبء تفسير لا يملكه.
     */
    releasedResults(scope: PetOwnerScope): Promise<({
        id: string;
        kind: "LAB";
        title: string;
        petId: string;
        petName: string;
        clinicName: string;
        releasedAt: string;
        summary: string | null;
        fileUrl: string | null;
    } | {
        id: string;
        kind: "RADIOLOGY";
        title: string;
        petId: string;
        petName: string;
        clinicName: string;
        releasedAt: string;
        summary: string | null;
        fileUrl: string | null;
    })[]>;
    invoices(scope: PetOwnerScope): Promise<{
        id: string;
        code: string;
        clinicId: string;
        clinicName: string;
        petName: string | null;
        issuedAt: string;
        subtotal: number;
        vatAmount: number;
        discount: number;
        total: number;
        amountPaid: number;
        currencyCode: string;
        status: import("@/generated/prisma/enums").InvoiceStatus;
        canPay: boolean;
    }[]>;
    unpaidInvoices(scope: PetOwnerScope): Promise<{
        count: number;
        total: number;
        currencyCode: string;
    }>;
};
export {};
