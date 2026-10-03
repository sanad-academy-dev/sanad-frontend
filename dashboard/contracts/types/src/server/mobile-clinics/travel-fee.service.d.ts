import type { Prisma } from "@/generated/prisma/client";
/**
 * [O3] معرّف عقدة دورة «رسوم التنقل» العامّة، المُنشأة في ترحيل
 * `20260818180000_mobile_clinics_travel_fee_service`.
 *
 * معرّف ثابت لا مطابقة بالاسم: إعادة تسمية العقدة من شاشة الدورات — وهي تصرّف مشروع
 * تمامًا — تكسر أي بحث بالاسم بصمت، فتتوقّف فوترة التنقّل دون أن يلاحظ أحد. المنطق نفسه
 * وراء `isLabCategory` وأخواتها في `Service`.
 */
export declare const TRAVEL_FEE_SERVICE_ID = "svc_travel_fee";
/**
 * يُدرج رسم التنقّل سطرًا في دورات الزيارة، فيركب الفاتورة القائمة ويرث محوّل الترحيل
 * المحاسبي دون عمل إضافي (§10) — لا مستند فوترة ثانيًا للزيارات المتنقلة.
 *
 * `priceSnapshot` لقطة كبقيّة الأسطر: السعر المتّفق عليه وقت الجدولة، لا السعر الحالي.
 * `durationSnapshot = 0` لأنّ الرسم ليس دورة سريريّة تستهلك وقتًا في الأكاديمية؛ زمن الطريق
 * محسوب في `travelMinutes` على الزيارة لا هنا، وحشوه هنا يضخّم مدّة الموعد زورًا.
 *
 * يُتجاهل الرسم المعدوم أو غير الموجب: سطرٌ بصفر ريال يشوّش الفاتورة على وليّ الأمر بلا فائدة.
 * والإدراج محميّ بـ `@@unique([appointmentId, serviceId])`، فإعادة المحاولة لا تُكرّره.
 */
export declare function attachTravelFeeLine(tx: Prisma.TransactionClient, appointmentId: string, travelFee: Prisma.Decimal | null): Promise<void>;
