import { IconHomeMove, IconMapPinFilled, IconPhoneCheck } from "@tabler/icons-react";

import { AppointmentLocation } from "@/generated/prisma/enums";

// خيارات مكان الزيارة — تُستخدم في نافذة الحجز ولوحة تفاصيل الزيارة
//
// [MC4.2] `MOBILE_CLINIC` غائب عمدًا: اختياره يستلزم عنوان دورة ومركبة، وهما حقلان
// لا تعرضهما هذه النافذة بعد. يُضاف في [MC4.4] مع الحقول التي يتطلّبها — إضافته الآن
// تُنتج زيارةً متنقلة بلا عنوان، وهي سجلٌّ لا يمكن إسناده إلى أحد.
export const LOCATION_OPTIONS = [
	{ value: AppointmentLocation.IN_CLINIC, label: "في الأكاديمية", icon: IconMapPinFilled },
	{ value: AppointmentLocation.REMOTE, label: "عن بعد", icon: IconPhoneCheck },
	{ value: AppointmentLocation.HOME_VISIT, label: "زيارة منزلية", icon: IconHomeMove },
] as const;
