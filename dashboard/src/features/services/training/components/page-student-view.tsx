/**
 * PageStudentView — وضع الطالب (عرض قراءة فقط)
 *
 * يعرض محتوى الصفحة الذي أنشأه المدرس:
 * - بدون أشرطة أدوات (Toolbar) أو قوائم تحرير (Slash Menu) أو مقابض سحب (Drag Handles)
 * - يدعم الفهرس التفاعلي (Table of Contents) للتنقل السلس بين العناوين
 * - دعم كامل للغة العربية والـ RTL مع خط متناسق
 */
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { backendUrl } from "@/lib/backend-fetch";
import { type PageDocument, pageKey } from "../hooks/use-page-editor";
import { PageEditor } from "./page-editor";

export interface PageStudentViewProps {
	/** معرّف الصفحة لتحميل المحتوى تلقائياً */
	pageId: string;
	/** عنوان مسبق اختياري */
	initialTitle?: string;
	/** يُستدعى عند الضغط على رجوع إن وُجد */
	onBack?: () => void;
}

async function fetchStudentPage(id: string): Promise<PageDocument> {
	const res = await fetch(backendUrl(`/api/training/pages/${id}`), {
		credentials: "include",
	});
	if (!res.ok) throw new Error("تعذّر تحميل الصفحة");
	return res.json();
}

export function PageStudentView({ pageId, initialTitle, onBack }: PageStudentViewProps) {
	const {
		data: page,
		isLoading,
		error,
	} = useQuery<PageDocument>({
		queryKey: pageKey(pageId),
		queryFn: () => fetchStudentPage(pageId),
		enabled: !!pageId,
		staleTime: 5 * 60_000,
	});

	if (isLoading) {
		return (
			<div className="flex h-full min-h-[350px] items-center justify-center">
				<div className="flex flex-col items-center gap-3 text-muted-foreground">
					<Spinner className="size-6 text-purple-600" />
					<span className="text-sm">جاري تحميل الدرس...</span>
				</div>
			</div>
		);
	}

	if (error || !page) {
		return (
			<div className="flex h-full min-h-[250px] items-center justify-center text-sm text-muted-foreground">
				تعذّر تحميل محتوى الصفحة أو أنها غير متاحة حالياً.
			</div>
		);
	}

	return (
		<div className="h-full w-full bg-background">
			<PageEditor
				pageId={page.id}
				initialTitle={page.title || initialTitle}
				initialContent={page.content ?? undefined}
				editable={false}
				onBack={onBack}
			/>
		</div>
	);
}
