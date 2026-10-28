"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  Phone,
  Mail,
  GraduationCap,
  HeartPulse,
  ShieldCheck,
  Send,
  ArrowRight,
  Sparkles,
  UploadCloud,
  FileText,
  FileCheck,
  Trash2,
  Paperclip,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CampaignData {
  id: string;
  name: string;
  code: string;
  academicYear: string;
  status: string;
  targetCount: number;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  requireBirthCert?: boolean;
  requireVaccine?: boolean;
  requireId?: boolean;
  clinicName?: string;
}

interface UploadedDoc {
  type: "BIRTH_CERTIFICATE" | "VACCINATION_CARD" | "GUARDIAN_ID" | "MEDICAL_REPORT";
  title: string;
  fileUrl: string;
  fileName: string;
  fileSize: string;
}

export default function CampaignRegisterPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);

  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [isLoadingCampaign, setIsLoadingCampaign] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Form State - Student
  const [studentName, setStudentName] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "UNKNOWN">("UNKNOWN");
  const [birthDate, setBirthDate] = useState("");
  const [ageLabel, setAgeLabel] = useState("");
  const [targetClass, setTargetClass] = useState("المسار التمهيدي للبرمجة");
  const [bloodType, setBloodType] = useState("");
  const [allergies, setAllergies] = useState("");
  const [hasChronicDiseases, setHasChronicDiseases] = useState(false);
  const [chronicDiseases, setChronicDiseases] = useState("");

  // Form State - Guardian
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [guardianNationalId, setGuardianNationalId] = useState("");
  const [notes, setNotes] = useState("");

  // Form State - Documents
  const [birthCertDoc, setBirthCertDoc] = useState<UploadedDoc | null>(null);
  const [vaccineDoc, setVaccineDoc] = useState<UploadedDoc | null>(null);
  const [guardianIdDoc, setGuardianIdDoc] = useState<UploadedDoc | null>(null);
  const [medicalDoc, setMedicalDoc] = useState<UploadedDoc | null>(null);

  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [uploadErrors, setUploadErrors] = useState<Record<string, string | null>>({});

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedRequestCode, setSubmittedRequestCode] = useState<string | null>(null);
  const [submittedDocsCount, setSubmittedDocsCount] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    async function fetchCampaign() {
      try {
        setIsLoadingCampaign(true);
        setLoadError(null);
        const res = await fetch(`/api/campaigns/${code}`, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || "تعذر تحميل بيانات الحملة");
        }
        if (isMounted) {
          setCampaign(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setLoadError(
            err instanceof Error
              ? err.message
              : "الحملة المطلوبة غير متوفرة حالياً"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingCampaign(false);
        }
      }
    }

    fetchCampaign();
    return () => {
      isMounted = false;
    };
  }, [code]);

  // Handle Document Upload via /api/upload
  const handleFileUpload = async (
    file: File,
    type: "BIRTH_CERTIFICATE" | "VACCINATION_CARD" | "GUARDIAN_ID" | "MEDICAL_REPORT",
    defaultTitle: string
  ) => {
    // Validate file size (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setUploadErrors((prev) => ({
        ...prev,
        [type]: "حجم الملف يتجاوز الحد الأقصى المسموح به (15 ميجابايت).",
      }));
      return;
    }

    // Validate mime type
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      setUploadErrors((prev) => ({
        ...prev,
        [type]: "نوع الملف غير مدعوم. يرجى رفع ملف بصيغة PDF أو صورة (JPG, PNG) أو Word.",
      }));
      return;
    }

    setUploading((prev) => ({ ...prev, [type]: true }));
    setUploadErrors((prev) => ({ ...prev, [type]: null }));

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "فشل رفع الملف إلى الخادم");
      }

      const newDoc: UploadedDoc = {
        type,
        title: `${defaultTitle} - ${studentName.trim() || "المتقدم"} (${file.name})`, fileUrl: data.fileUrl || data.key, fileName: file.name, fileSize: data.fileSize ||`${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      };

      if (type === "BIRTH_CERTIFICATE") setBirthCertDoc(newDoc);
      else if (type === "VACCINATION_CARD") setVaccineDoc(newDoc);
      else if (type === "GUARDIAN_ID") setGuardianIdDoc(newDoc);
      else if (type === "MEDICAL_REPORT") setMedicalDoc(newDoc);
    } catch (err: unknown) {
      setUploadErrors((prev) => ({
        ...prev,
        [type]:
          err instanceof Error
            ? err.message
            : "تعذر رفع الملف، يرجى المحاولة مرة أخرى.",
      }));
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleFileRemove = (
    type: "BIRTH_CERTIFICATE" | "VACCINATION_CARD" | "GUARDIAN_ID" | "MEDICAL_REPORT"
  ) => {
    if (type === "BIRTH_CERTIFICATE") setBirthCertDoc(null);
    else if (type === "VACCINATION_CARD") setVaccineDoc(null);
    else if (type === "GUARDIAN_ID") setGuardianIdDoc(null);
    else if (type === "MEDICAL_REPORT") setMedicalDoc(null);
    setUploadErrors((prev) => ({ ...prev, [type]: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!studentName.trim()) {
      setFormError("يرجى إدخال اسم الطالب");
      return;
    }
    if (!guardianName.trim()) {
      setFormError("يرجى إدخال اسم ولي الأمر");
      return;
    }
    if (!guardianPhone.trim()) {
      setFormError("يرجى إدخال رقم جوال ولي الأمر");
      return;
    }

    // Required Documents Verification based on Campaign Settings
    if (campaign?.requireBirthCert && !birthCertDoc) {
      setFormError("شهادة ميلاد الطالب إلزامية لإتمام التسجيل في هذه الحملة. يرجى إرفاقها أدناه.");
      document.getElementById("documents-section")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (campaign?.requireVaccine && !vaccineDoc) {
      setFormError("كارت التطعيمات للطالب إلزامي لإتمام التسجيل في هذه الحملة. يرجى إرفاقه أدناه.");
      document.getElementById("documents-section")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (campaign?.requireId && !guardianIdDoc) {
      setFormError("صورة هوية ولي الأمر إلزامية لإتمام التسجيل في هذه الحملة. يرجى إرفاقها أدناه.");
      document.getElementById("documents-section")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Prepare Documents Array
    const attachedDocs = [birthCertDoc, vaccineDoc, guardianIdDoc, medicalDoc]
      .filter((d): d is UploadedDoc => Boolean(d))
      .map((d) => ({
        title: d.title,
        fileUrl: d.fileUrl,
        fileSize: d.fileSize,
        type: d.type,
      }));

    setIsSubmitting(true);
    try {
      const payload = {
        source: "DIRECT_LINK",
        studentName: studentName.trim(),
        gender,
        birthDate: birthDate || null,
        ageLabel: ageLabel.trim() || null,
        targetClass: targetClass.trim() || null,
        bloodType: bloodType.trim() || null,
        allergies: allergies.trim() || null,
        hasChronicDiseases,
        chronicDiseases: hasChronicDiseases ? chronicDiseases.trim() || null : null,
        guardianName: guardianName.trim(),
        guardianPhone: guardianPhone.trim(),
        guardianEmail: guardianEmail.trim() || null,
        guardianNationalId: guardianNationalId.trim() || null,
        notes: notes.trim() || null,
        documents: attachedDocs.length > 0 ? attachedDocs : undefined,
      };

      const res = await fetch(`/api/campaigns/${code}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "فشل إرسال طلب التسجيل");
      }

      setSubmittedDocsCount(attachedDocs.length);
      setSubmittedRequestCode(data.requestCode || "تم التسجيل");
    } catch (err: unknown) {
      setFormError(
        err instanceof Error
          ? err.message
          : "حدث خطأ أثناء إرسال الطلب، يرجى إعادة المحاولة."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingCampaign) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">جاري تجهيز بوابة التسجيل الرقمي...</p>
      </div>
    );
  }

  if (loadError || !campaign) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 text-center px-4 max-w-lg mx-auto">
        <div className="size-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertCircle className="size-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">حملة التسجيل غير متوفرة</h1>
          <p className="text-muted-foreground text-sm">
            {loadError || "قد يكون رابط الحملة غير صحيح أو انتهت فترة استقبال الطلبات."}
          </p>
        </div>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/">
            <ArrowRight className="ml-2 size-4" />
            العودة للصفحة الرئيسية
          </Link>
        </Button>
      </div>
    );
  }

  // Success Confirmation State
  if (submittedRequestCode) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-xl bg-card/60 backdrop-blur-xs border border-border/80 rounded-xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-primary to-emerald-500" />

          <div className="size-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="size-10" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
            تم استلام طلب التسجيل بنجاح!
          </h2>

          <p className="text-muted-foreground text-base mb-6 leading-relaxed">
            شكراً لثقتكم بأكاديمية سند. تم قيد طلب انضمام الطالب{""}
            <span className="font-bold text-foreground">{studentName}</span> بنجاح في حملة{""}
            <span className="font-semibold text-primary">{campaign.name}</span>.
          </p>

          <div className="inline-flex flex-col items-center gap-1.5 rounded-xl bg-secondary/80 border border-border p-4 mb-6">
            <span className="text-xs font-semibold text-muted-foreground">رقم متابعة الطلب</span>
            <span className="font-mono text-xl font-black text-primary tracking-wider" dir="ltr">
              {submittedRequestCode}
            </span>
          </div>

          {submittedDocsCount > 0 && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-6">
              <FileCheck className="size-4" />
              تم إرفاق {submittedDocsCount} مستندات رسمية بنجاح وربطها بملف الطالب.
            </div>
          )}

          <div className="space-y-2 text-sm text-muted-foreground bg-primary/5 rounded-xl p-4 mb-8 text-right">
            <div className="font-bold text-foreground flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              الخطوات القادمة:
            </div>
            <p>1. سيقوم فريق القبول والتقييم بمراجعة البيانات والوثائق المرفقة والتواصل معكم عبر الهاتف أو واتساب.</p>
            <p>2. سيتم حجز موعد جلسة الفحص والتقييم الأكاديمي الحضورية أو الافتراضية مع الأكاديمية.</p>
          </div>

          <Button asChild className="w-full h-12 text-base font-bold">
            <Link href="/">العودة إلى موقع سند الرئيسي</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Campaign Header Banner */}
      <div className="bg-card/60 backdrop-blur-xs border border-border/80 rounded-xl p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              بوابة التسجيل الرقمي الرسمية
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {campaign.name}
            </h1>
            <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
              {campaign.description || "سجّل الآن وانضم إلى مسارات التميز الأكاديمي والتقني في أكاديمية سند."}
            </p>
          </div>

          <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-2 text-xs font-semibold text-muted-foreground bg-secondary/60 rounded-xl p-3 border border-border">
            <span>العام الدراسي: <strong className="text-foreground">{campaign.academicYear}</strong></span>
            {campaign.startDate && (
              <span className="flex items-center gap-1">
                <Calendar className="size-3 text-primary" />
                بداية التسجيل: {new Date(campaign.startDate).toLocaleDateString("ar-EG")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {formError && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-semibold flex items-center gap-3">
            <AlertCircle className="size-5 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Section 1: Student Information */}
        <div className="bg-card/60 backdrop-blur-xs border border-border/80 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <GraduationCap className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">بيانات الطالب / الطالبة</h2>
              <p className="text-xs text-muted-foreground">أدخل المعلومات الأساسية للمتقدم</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-bold text-foreground">
                اسم الطالب الكامل <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="مثال: يوسف أحمد السعيد"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full h-12 rounded-xl border border-input bg-background px-4 pr-11 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <User className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">الجنس</label>
              <select
                value={gender}
                onChange={(e) =>
                  setGender(e.target.value as "MALE" | "FEMALE" | "UNKNOWN")
                }
                className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="UNKNOWN">غير محدد</option>
                <option value="MALE">ذكر</option>
                <option value="FEMALE">أنثى</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">تاريخ الميلاد</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">العمر أو الفئة العمرية</label>
              <input
                type="text"
                placeholder="مثال: 9 سنوات"
                value={ageLabel}
                onChange={(e) => setAgeLabel(e.target.value)}
                className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">المسار / البرنامج المطلوب</label>
              <select
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="المسار التمهيدي للبرمجة">المسار التمهيدي للبرمجة</option>
                <option value="مسار الروبوت والذكاء الاصطناعي">مسار الروبوت والذكاء الاصطناعي</option>
                <option value="مسار تصميم وبرمجة الألعاب">مسار تصميم وبرمجة الألعاب</option>
                <option value="مسار ريادة الأعمال التقنية">مسار ريادة الأعمال التقنية</option>
                <option value="برنامج التأسيس الشامل">برنامج التأسيس الشامل</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Guardian Information */}
        <div className="bg-card/60 backdrop-blur-xs border border-border/80 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">بيانات ولي الأمر</h2>
              <p className="text-xs text-muted-foreground">للتواصل والمتابعة وتأكيد الحجز</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">
                اسم ولي الأمر <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="الاسم الكامل"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  className="w-full h-12 rounded-xl border border-input bg-background px-4 pr-11 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <User className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">
                رقم الجوال <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  dir="ltr"
                  placeholder="05XXXXXXXX"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  className="w-full h-12 rounded-xl border border-input bg-background px-4 pr-11 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-right"
                />
                <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  type="email"
                  dir="ltr"
                  placeholder="example@mail.com"
                  value={guardianEmail}
                  onChange={(e) => setGuardianEmail(e.target.value)}
                  className="w-full h-12 rounded-xl border border-input bg-background px-4 pr-11 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-right"
                />
                <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">رقم الهوية الوطنية / الإقامة</label>
              <input
                type="text"
                placeholder="10XXXXXXXX"
                value={guardianNationalId}
                onChange={(e) => setGuardianNationalId(e.target.value)}
                className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Health & Additional Notes (Optional) */}
        <div className="bg-card/60 backdrop-blur-xs border border-border/80 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <HeartPulse className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">المعلومات الصحية وملاحظات (اختياري)</h2>
              <p className="text-xs text-muted-foreground">لتقديم الرعاية والدعم المناسبين للطالب</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">فصيلة الدم</label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="">غير محدد</option>
                <option value="O+">O+</option>
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="AB+">AB+</option>
                <option value="O-">O-</option>
                <option value="A-">A-</option>
                <option value="B-">B-</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">أي حساسيات غذائية أو دوائية؟</label>
              <input
                type="text"
                placeholder="لا يوجد أو حدد الحساسية"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="space-y-3 sm:col-span-2">
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-bold text-foreground">
                <input
                  type="checkbox"
                  checked={hasChronicDiseases}
                  onChange={(e) => setHasChronicDiseases(e.target.checked)}
                  className="size-4 rounded text-primary focus:ring-primary"
                />
                <span>هل يعاني الطالب من أي حالات صحية أو أمراض مزمنة؟</span>
              </label>

              {hasChronicDiseases && (
                <input
                  type="text"
                  placeholder="يرجى توضيح الحالة الصحية لمراعاتها في الأنشطة"
                  value={chronicDiseases}
                  onChange={(e) => setChronicDiseases(e.target.value)}
                  className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-bold text-foreground">ملاحظات إضافية أو رغبات خاصة</label>
              <textarea
                rows={3}
                placeholder="أي ملاحظات تود مشاركتها مع إدارة الأكاديمية..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-input bg-background p-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Document Upload Dropzones (Phase 7) */}
        <div id="documents-section" className="bg-card/60 backdrop-blur-xs border border-border/80 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Paperclip className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">المستندات والوثائق الثبوتية</h2>
                <p className="text-xs text-muted-foreground">
                  ارفع المستندات بصيغة PDF أو صورة واضحة (الحد الأقصى 15 ميجابايت للملف)
                </p>
              </div>
            </div>

            {/* Document Counter Badge */}
            <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground border border-border self-start sm:self-auto">
              المستندات المرفقة:{""}
              <strong className="text-primary font-bold">
                {[birthCertDoc, vaccineDoc, guardianIdDoc, medicalDoc].filter(Boolean).length}
              </strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Slot 1: Birth Certificate */}
            <DocumentDropzoneSlot
              id="birth-cert"
              title="شهادة ميلاد الطالب"
              subtitle="أصل شهادة الميلاد أو صورة واضحة ومقروءة"
              type="BIRTH_CERTIFICATE"
              isRequired={campaign?.requireBirthCert ?? true}
              document={birthCertDoc}
              isUploading={!!uploading["BIRTH_CERTIFICATE"]}
              error={uploadErrors["BIRTH_CERTIFICATE"] || null}
              onUpload={(file) => handleFileUpload(file, "BIRTH_CERTIFICATE", "شهادة الميلاد")}
              onRemove={() => handleFileRemove("BIRTH_CERTIFICATE")}
            />

            {/* Slot 2: Vaccination Record */}
            <DocumentDropzoneSlot
              id="vaccine-card"
              title="كارت التطعيمات"
              subtitle="بطاقة أو سجل التطعيمات الأساسية المعتمد"
              type="VACCINATION_CARD"
              isRequired={campaign?.requireVaccine ?? true}
              document={vaccineDoc}
              isUploading={!!uploading["VACCINATION_CARD"]}
              error={uploadErrors["VACCINATION_CARD"] || null}
              onUpload={(file) => handleFileUpload(file, "VACCINATION_CARD", "كارت التطعيمات")}
              onRemove={() => handleFileRemove("VACCINATION_CARD")}
            />

            {/* Slot 3: Guardian National ID */}
            <DocumentDropzoneSlot
              id="guardian-id"
              title="هوية ولي الأمر"
              subtitle="صورة بطاقة الهوية الوطنية أو الإقامة لولي الأمر"
              type="GUARDIAN_ID"
              isRequired={campaign?.requireId ?? true}
              document={guardianIdDoc}
              isUploading={!!uploading["GUARDIAN_ID"]}
              error={uploadErrors["GUARDIAN_ID"] || null}
              onUpload={(file) => handleFileUpload(file, "GUARDIAN_ID", "هوية ولي الأمر")}
              onRemove={() => handleFileRemove("GUARDIAN_ID")}
            />

            {/* Slot 4: Medical / Additional Reports (Optional) */}
            <DocumentDropzoneSlot
              id="medical-report"
              title="تقارير طبية أو وثائق إضافية"
              subtitle="أي تقرير طبي، كشف نظر، أو شهادة تفوق أكاديمي سابقة"
              type="MEDICAL_REPORT"
              isRequired={false}
              document={medicalDoc}
              isUploading={!!uploading["MEDICAL_REPORT"]}
              error={uploadErrors["MEDICAL_REPORT"] || null}
              onUpload={(file) => handleFileUpload(file, "MEDICAL_REPORT", "تقرير طبي ومستند إضافي")}
              onRemove={() => handleFileRemove("MEDICAL_REPORT")}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSubmitting || Object.values(uploading).some(Boolean)}
            className="w-full sm:w-auto min-w-[240px] h-14 text-base font-extrabold transition-all"
          >
            {isSubmitting ? (
              <>
                جاري إرسال الطلب والمستندات...
                <Loader2 className="mr-2 size-5 animate-spin" />
              </>
            ) : (
              <>
                إرسال طلب التسجيل
                <Send className="mr-2 size-5" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

// ─── Document Dropzone Slot Subcomponent ───────────────────────────────────────

interface DocumentDropzoneSlotProps {
  id: string;
  title: string;
  subtitle: string;
  type: "BIRTH_CERTIFICATE" | "VACCINATION_CARD" | "GUARDIAN_ID" | "MEDICAL_REPORT";
  isRequired: boolean;
  document: UploadedDoc | null;
  isUploading: boolean;
  error: string | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

function DocumentDropzoneSlot({
  id,
  title,
  subtitle,
  isRequired,
  document,
  isUploading,
  error,
  onUpload,
  onRemove,
}: DocumentDropzoneSlotProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
    // reset input so the same file can be re-selected if removed
    e.target.value = "";
  };

  const isPdf =
    document?.fileName.toLowerCase().endsWith(".pdf") ||
    document?.fileUrl.toLowerCase().endsWith(".pdf");

  return (
    <div className="space-y-2">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        id={id}
        accept=".pdf,image/png,image/jpeg,image/webp,image/gif,.doc,.docx"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Header Info */}
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-bold text-foreground cursor-pointer">
          {title}
        </label>
        {isRequired ? (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-destructive/10 text-destructive border border-destructive/20">
            مطلوب
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-secondary text-muted-foreground border border-border">
            اختياري
          </span>
        )}
      </div>

      {/* Upload State Rendering */}
      {isUploading ? (
        <div className="h-32 rounded-xl border border-dashed border-primary/50 bg-primary/5 flex flex-col items-center justify-center gap-2 text-center p-4">
          <Loader2 className="size-6 animate-spin text-primary" />
          <p className="text-xs font-semibold text-foreground">جاري رفع ومعالجة المستند...</p>
          <span className="text-[11px] text-muted-foreground">يرجى الانتظار حتى اكتمال المعالجة</span>
        </div>
      ) : document ? (
        /* Uploaded State Card */
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex items-center justify-between gap-3 transition-all hover:border-emerald-500/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-11 rounded-xl bg-background border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              {isPdf ? <FileText className="size-5" /> : <ImageIcon className="size-5" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-foreground truncate max-w-[200px] sm:max-w-[260px]">
                  {document.fileName}
                </p>
                <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  <CheckCircle2 className="size-3" />
                  تم الرفع
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">{document.fileSize}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive size-9 p-0 rounded-lg"
              title="إلغاء وحذف المستند"
            >
              <Trash2 className="size-4" />
              <span className="sr-only">حذف</span>
            </Button>
          </div>
        </div>
      ) : (
        /* Empty / Dropzone State */
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center p-4 cursor-pointer transition-all ${
            isDragging
              ? "border-primary bg-primary/10 scale-[0.99]"
              : "border-border hover:border-primary/50 hover:bg-secondary/40 bg-card"
          }`}
        >
          <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
            <UploadCloud className="size-4" />
          </div>
          <p className="text-xs font-bold text-foreground">
            انقر لاختيار الملف <span className="font-normal text-muted-foreground">أو اسحبه هنا</span>
          </p>
          <p className="text-[11px] text-muted-foreground mt-1 truncate max-w-[280px]">
            {subtitle}
          </p>
        </div>
      )}

      {/* Inline Error Notice */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-destructive font-medium px-1">
          <AlertCircle className="size-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
