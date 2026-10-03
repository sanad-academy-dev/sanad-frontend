import {
	IconCash,
	IconCertificate,
	IconDots,
	IconFileText,
	IconLicense,
	IconShieldCheck,
	IconWritingSign,
} from "@tabler/icons-react";
import type { ComponentType } from "react";

import { ClinicDocumentCategory } from "@sanad/contracts/runtime/server/clinic-documents/clinic-documents.type";

type CategoryMeta = {
	id: ClinicDocumentCategory;
	/** مفتاح الترجمة — التسمية تُقرأ عبر t() لا من هنا */
	labelKey: `documents.categories.${ClinicDocumentCategory}`;
	icon: ComponentType<{ className?: string }>;
};

// ترتيب العرض مقصود: ما يخضع لتاريخ انتهاء ورقابة جهة رسمية أولًا.
export const DOCUMENT_CATEGORIES: CategoryMeta[] = [
	{
		id: ClinicDocumentCategory.LICENSE,
		labelKey: "documents.categories.LICENSE",
		icon: IconLicense,
	},
	{
		id: ClinicDocumentCategory.REGISTRATION,
		labelKey: "documents.categories.REGISTRATION",
		icon: IconCertificate,
	},
	{
		id: ClinicDocumentCategory.CONTRACT,
		labelKey: "documents.categories.CONTRACT",
		icon: IconWritingSign,
	},
	{
		id: ClinicDocumentCategory.INSURANCE,
		labelKey: "documents.categories.INSURANCE",
		icon: IconShieldCheck,
	},
	{
		id: ClinicDocumentCategory.POLICY,
		labelKey: "documents.categories.POLICY",
		icon: IconFileText,
	},
	{
		id: ClinicDocumentCategory.FINANCIAL,
		labelKey: "documents.categories.FINANCIAL",
		icon: IconCash,
	},
	{ id: ClinicDocumentCategory.OTHER, labelKey: "documents.categories.OTHER", icon: IconDots },
];

const BY_ID = new Map(DOCUMENT_CATEGORIES.map((entry) => [entry.id, entry]));

export const categoryMeta = (id: ClinicDocumentCategory): CategoryMeta =>
	BY_ID.get(id) ?? DOCUMENT_CATEGORIES[DOCUMENT_CATEGORIES.length - 1];
