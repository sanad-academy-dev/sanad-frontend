import type { ReportLabel } from "@/server/reports/reports.type";
/**
 * The report catalogue — the single source of truth for *which* reports exist.
 *
 * Reports are authored by developers, not by users: a report is a catalogue entry here plus
 * a builder in `builders/`. Nothing in the UI can create, rename or delete one, which is why
 * this file (not a database table) is the registry. It is imported by BOTH sides — the
 * server validates `:reportId` against it, the client renders the list and the widget grid
 * from it — so a report can never drift between the two.
 *
 * To add a report:
 *   1. add an entry below (ids are kebab-case and permanent — they are URLs),
 *   2. add a builder in `builders/<id>.builder.ts` returning a payload keyed by these widget
 *      keys,
 *   3. register the builder in `reports.dao.ts`.
 * `reports.catalog.test.ts` fails the build if the three ever disagree.
 */
/** Grid width of a widget inside the report page — two half widgets share a row. */
export type ReportWidgetSpan = "full" | "half";
export type ReportWidgetDef = {
    /** Matches the key the builder writes into `widgets`. */
    key: string;
    title: ReportLabel;
    span: ReportWidgetSpan;
};
export type ReportCategoryId = "operations" | "clinical" | "financial" | "inventory" | "hr";
export type ReportDef = {
    id: string;
    title: ReportLabel;
    description: ReportLabel;
    category: ReportCategoryId;
    /**
     * Permission resource checked with `canView(resource)`. Reports that surface money or
     * personnel data reuse the resource of the module they read from, so a role that cannot
     * open the module cannot read it through a report either. `undefined` ⇒ no extra gate.
     */
    gate?: string;
    /** ISO day this definition last changed — maintained by whoever edits the entry. */
    updatedAt: string;
    widgets: readonly ReportWidgetDef[];
};
export declare const REPORT_CATEGORIES: readonly {
    id: ReportCategoryId;
    label: ReportLabel;
}[];
/**
 * `as const` here exists only to derive {@link ReportId} from the literal ids — it is
 * immediately re-exported through `ReportDef[]` below so consumers see the declared shape
 * (with its optional `gate`) rather than ten divergent literal object types.
 */
declare const CATALOG: readonly [{
    readonly id: "clinic-overview";
    readonly title: {
        readonly ar: "الأداء العام للأكاديمية";
        readonly en: "Clinic Performance Overview";
    };
    readonly description: {
        readonly ar: "الزيارات والإيراد المحصّل وتوزيع الحالات وحمل الفروع في نطاق واحد.";
        readonly en: "Visits, collected revenue, case mix and branch load in one window.";
    };
    readonly category: "operations";
    readonly updatedAt: "2026-08-12";
    readonly widgets: readonly [{
        readonly key: "visitsTrend";
        readonly title: {
            readonly ar: "حركة الزيارات";
            readonly en: "Visit trend";
        };
        readonly span: "full";
    }, {
        readonly key: "revenueTrend";
        readonly title: {
            readonly ar: "الإيراد المحصّل";
            readonly en: "Collected revenue";
        };
        readonly span: "half";
    }, {
        readonly key: "appointmentStatus";
        readonly title: {
            readonly ar: "توزيع حالات الجلسات";
            readonly en: "Appointment status mix";
        };
        readonly span: "half";
    }, {
        readonly key: "branchLoad";
        readonly title: {
            readonly ar: "الزيارات حسب الفرع";
            readonly en: "Visits by branch";
        };
        readonly span: "half";
    }, {
        readonly key: "topServices";
        readonly title: {
            readonly ar: "أكثر الدورات طلبًا";
            readonly en: "Most requested services";
        };
        readonly span: "half";
    }];
}, {
    readonly id: "appointments";
    readonly title: {
        readonly ar: "تقرير الجلسات";
        readonly en: "Appointments Report";
    };
    readonly description: {
        readonly ar: "حجم الجلسات وحالاتها وساعات الذروة وأداء المدرّبين ونسبة عدم الحضور.";
        readonly en: "Volume, statuses, peak hours, doctor performance and no-show rate.";
    };
    readonly category: "operations";
    readonly updatedAt: "2026-08-12";
    readonly widgets: readonly [{
        readonly key: "volumeTrend";
        readonly title: {
            readonly ar: "حجم الجلسات";
            readonly en: "Appointment volume";
        };
        readonly span: "full";
    }, {
        readonly key: "statusMix";
        readonly title: {
            readonly ar: "توزيع الحالات";
            readonly en: "Status mix";
        };
        readonly span: "half";
    }, {
        readonly key: "byHour";
        readonly title: {
            readonly ar: "ساعات الذروة";
            readonly en: "Peak hours";
        };
        readonly span: "half";
    }, {
        readonly key: "byDoctor";
        readonly title: {
            readonly ar: "الجلسات حسب المدرّب";
            readonly en: "By doctor";
        };
        readonly span: "half";
    }, {
        readonly key: "byLocation";
        readonly title: {
            readonly ar: "نوع الزيارة";
            readonly en: "Visit location";
        };
        readonly span: "half";
    }, {
        readonly key: "doctorTable";
        readonly title: {
            readonly ar: "أداء المدرّبين";
            readonly en: "Doctor performance";
        };
        readonly span: "full";
    }];
}, {
    readonly id: "emergency";
    readonly title: {
        readonly ar: "تقرير الطوارئ والفرز";
        readonly en: "Emergency & Triage Report";
    };
    readonly description: {
        readonly ar: "حركة صالة الطوارئ: الوصول، زمن الباب إلى الفرز وإلى المدرّب، الالتزام بأهداف الانتظار، ومعدّل تغيير اللون المقترح.";
        readonly en: "ER flow: arrivals, door-to-triage and door-to-doctor times, wait-target compliance, and the triage override rate.";
    };
    readonly category: "operations";
    readonly gate: "emergency";
    readonly updatedAt: "2026-09-03";
    readonly widgets: readonly [{
        readonly key: "categoryMix";
        readonly title: {
            readonly ar: "توزيع ألوان الفرز";
            readonly en: "Triage colour mix";
        };
        readonly span: "half";
    }, {
        readonly key: "bySource";
        readonly title: {
            readonly ar: "مصدر الوصول";
            readonly en: "Arrival source";
        };
        readonly span: "half";
    }, {
        readonly key: "byHour";
        readonly title: {
            readonly ar: "الوصول حسب الساعة";
            readonly en: "Arrivals by hour";
        };
        readonly span: "full";
    }, {
        readonly key: "doorToDoctorByCategory";
        readonly title: {
            readonly ar: "من الباب إلى المدرّب حسب اللون";
            readonly en: "Door-to-doctor by colour";
        };
        readonly span: "half";
    }, {
        readonly key: "dispositions";
        readonly title: {
            readonly ar: "مآل الحالات";
            readonly en: "Dispositions";
        };
        readonly span: "half";
    }];
}, {
    readonly id: "inpatients";
    readonly title: {
        readonly ar: "تقرير التنويم";
        readonly en: "Inpatients Report";
    };
    readonly description: {
        readonly ar: "حركة العنبر: الإدخالات والخروج، متوسّط مدّة الإقامة، الالتزام بالجرعات، وإشغال الأقفاص.";
        readonly en: "Ward flow: admissions and discharges, average length of stay, dose compliance and cage occupancy.";
    };
    readonly category: "operations";
    readonly gate: "inpatients";
    readonly updatedAt: "2026-09-01";
    readonly widgets: readonly [{
        readonly key: "flowTrend";
        readonly title: {
            readonly ar: "الإدخالات والخروج";
            readonly en: "Admissions & discharges";
        };
        readonly span: "full";
    }, {
        readonly key: "kindMix";
        readonly title: {
            readonly ar: "نوع التنويم";
            readonly en: "Stay kind";
        };
        readonly span: "half";
    }, {
        readonly key: "acuityMix";
        readonly title: {
            readonly ar: "درجة الحرجية";
            readonly en: "Acuity";
        };
        readonly span: "half";
    }, {
        readonly key: "speciesMix";
        readonly title: {
            readonly ar: "الأنواع";
            readonly en: "Species";
        };
        readonly span: "half";
    }, {
        readonly key: "outcomes";
        readonly title: {
            readonly ar: "طرق الخروج";
            readonly en: "Discharge outcomes";
        };
        readonly span: "half";
    }];
}, {
    readonly id: "revenue";
    readonly title: {
        readonly ar: "الإيرادات والتحصيل";
        readonly en: "Revenue & Collection";
    };
    readonly description: {
        readonly ar: "المفوتر مقابل المحصّل، حالة الفواتير، طرق الدفع، ومصادر الإيراد.";
        readonly en: "Invoiced vs collected, invoice status, payment methods and revenue sources.";
    };
    readonly category: "financial";
    readonly gate: "finance_invoices";
    readonly updatedAt: "2026-08-12";
    readonly widgets: readonly [{
        readonly key: "revenueTrend";
        readonly title: {
            readonly ar: "المفوتر مقابل المحصّل";
            readonly en: "Invoiced vs collected";
        };
        readonly span: "full";
    }, {
        readonly key: "statusMix";
        readonly title: {
            readonly ar: "حالة الفواتير";
            readonly en: "Invoice status";
        };
        readonly span: "half";
    }, {
        readonly key: "paymentMix";
        readonly title: {
            readonly ar: "طرق الدفع";
            readonly en: "Payment methods";
        };
        readonly span: "half";
    }, {
        readonly key: "bySource";
        readonly title: {
            readonly ar: "مصدر الفاتورة";
            readonly en: "Invoice source";
        };
        readonly span: "half";
    }, {
        readonly key: "posTrend";
        readonly title: {
            readonly ar: "مبيعات نقطة البيع";
            readonly en: "Point-of-sale revenue";
        };
        readonly span: "half";
    }, {
        readonly key: "topServices";
        readonly title: {
            readonly ar: "أعلى الدورات إيرادًا";
            readonly en: "Top services by revenue";
        };
        readonly span: "full";
    }];
}, {
    readonly id: "patients";
    readonly title: {
        readonly ar: "الأطفال وأولياء الأمور";
        readonly en: "Patients & Owners";
    };
    readonly description: {
        readonly ar: "نمو قاعدة الأطفال وتوزيعها حسب النوع والسلالة والجنس، وأنشط أولياء الأمور.";
        readonly en: "Patient base growth by species, breed and sex, plus the most active owners.";
    };
    readonly category: "clinical";
    readonly gate: "patients_owners";
    readonly updatedAt: "2026-08-12";
    readonly widgets: readonly [{
        readonly key: "newPatientsTrend";
        readonly title: {
            readonly ar: "التسجيلات الجديدة";
            readonly en: "New registrations";
        };
        readonly span: "full";
    }, {
        readonly key: "byAnimalType";
        readonly title: {
            readonly ar: "حسب النوع";
            readonly en: "By species";
        };
        readonly span: "half";
    }, {
        readonly key: "byGender";
        readonly title: {
            readonly ar: "حسب الجنس";
            readonly en: "By sex";
        };
        readonly span: "half";
    }, {
        readonly key: "topStrains";
        readonly title: {
            readonly ar: "أكثر السلالات";
            readonly en: "Top breeds";
        };
        readonly span: "half";
    }, {
        readonly key: "visitsPerPatient";
        readonly title: {
            readonly ar: "كثافة الزيارات";
            readonly en: "Visit density";
        };
        readonly span: "half";
    }, {
        readonly key: "topOwners";
        readonly title: {
            readonly ar: "أنشط أولياء الأمور";
            readonly en: "Most active owners";
        };
        readonly span: "full";
    }];
}, {
    readonly id: "inventory";
    readonly title: {
        readonly ar: "المخزون والاستهلاك";
        readonly en: "Stock & Consumption";
    };
    readonly description: {
        readonly ar: "قيمة المخزون حسب الفئة، حركة الوارد والصادر، الأصناف تحت الحد وقرب الانتهاء.";
        readonly en: "Stock value by category, in/out movement, below-reorder and expiring items.";
    };
    readonly category: "inventory";
    readonly gate: "inventory";
    readonly updatedAt: "2026-08-12";
    readonly widgets: readonly [{
        readonly key: "movementTrend";
        readonly title: {
            readonly ar: "حركة المخزون";
            readonly en: "Stock movement";
        };
        readonly span: "full";
    }, {
        readonly key: "valueByCategory";
        readonly title: {
            readonly ar: "القيمة حسب الفئة";
            readonly en: "Value by category";
        };
        readonly span: "half";
    }, {
        readonly key: "stockValue";
        readonly title: {
            readonly ar: "قيمة المخزون";
            readonly en: "Stock value";
        };
        readonly span: "half";
    }, {
        readonly key: "topConsumed";
        readonly title: {
            readonly ar: "الأكثر صرفًا";
            readonly en: "Most consumed";
        };
        readonly span: "half";
    }, {
        readonly key: "lowStock";
        readonly title: {
            readonly ar: "تحت نقطة الطلب";
            readonly en: "Below reorder point";
        };
        readonly span: "half";
    }, {
        readonly key: "expiring";
        readonly title: {
            readonly ar: "قرب انتهاء الصلاحية";
            readonly en: "Expiring soon";
        };
        readonly span: "full";
    }];
}, {
    readonly id: "staff";
    readonly title: {
        readonly ar: "الحضور والانصراف";
        readonly en: "Attendance & Workforce";
    };
    readonly description: {
        readonly ar: "نسبة الالتزام بالحضور، الغياب والتأخير، وساعات العمل لكل موظف.";
        readonly en: "Attendance compliance, absence and lateness, and hours worked per employee.";
    };
    readonly category: "hr";
    readonly gate: "staff";
    readonly updatedAt: "2026-08-12";
    readonly widgets: readonly [{
        readonly key: "attendanceTrend";
        readonly title: {
            readonly ar: "نسبة الحضور والانصراف";
            readonly en: "Attendance trend";
        };
        readonly span: "full";
    }, {
        readonly key: "statusMix";
        readonly title: {
            readonly ar: "توزيع الحضور";
            readonly en: "Attendance mix";
        };
        readonly span: "half";
    }, {
        readonly key: "totalHours";
        readonly title: {
            readonly ar: "إحصائيات الدوام";
            readonly en: "Working hours";
        };
        readonly span: "half";
    }, {
        readonly key: "hoursByStaff";
        readonly title: {
            readonly ar: "ساعات العمل حسب الموظف";
            readonly en: "Hours by employee";
        };
        readonly span: "half";
    }, {
        readonly key: "leaveMix";
        readonly title: {
            readonly ar: "طلبات الإجازة";
            readonly en: "Leave requests";
        };
        readonly span: "half";
    }, {
        readonly key: "staffTable";
        readonly title: {
            readonly ar: "سجل الموظفين";
            readonly en: "Employee register";
        };
        readonly span: "full";
    }];
}, {
    readonly id: "diagnostics";
    readonly title: {
        readonly ar: "التحاليل والأشعة";
        readonly en: "Lab & Radiology";
    };
    readonly description: {
        readonly ar: "حجم الطلبات وحالات البنود وأنواع التصوير ومتوسط زمن إنجاز الفحص.";
        readonly en: "Order volume, item statuses, imaging modalities and average turnaround time.";
    };
    readonly category: "clinical";
    readonly updatedAt: "2026-08-12";
    readonly widgets: readonly [{
        readonly key: "ordersTrend";
        readonly title: {
            readonly ar: "حجم الطلبات";
            readonly en: "Order volume";
        };
        readonly span: "full";
    }, {
        readonly key: "labStatus";
        readonly title: {
            readonly ar: "حالة التحاليل";
            readonly en: "Lab status";
        };
        readonly span: "half";
    }, {
        readonly key: "radiologyStatus";
        readonly title: {
            readonly ar: "حالة الأشعة";
            readonly en: "Radiology status";
        };
        readonly span: "half";
    }, {
        readonly key: "byModality";
        readonly title: {
            readonly ar: "أنواع التصوير";
            readonly en: "Modalities";
        };
        readonly span: "half";
    }, {
        readonly key: "turnaround";
        readonly title: {
            readonly ar: "زمن الإنجاز";
            readonly en: "Turnaround time";
        };
        readonly span: "half";
    }, {
        readonly key: "topTests";
        readonly title: {
            readonly ar: "أكثر الفحوصات طلبًا";
            readonly en: "Most requested tests";
        };
        readonly span: "full";
    }];
}, {
    readonly id: "vaccinations";
    readonly title: {
        readonly ar: "تغطية التطعيم";
        readonly en: "Vaccination Coverage";
    };
    readonly description: {
        readonly ar: "الجرعات المُعطاة وتغطية كل مرض وتتبّع الدُفعات، مع قائمة المتأخّرين الآن.";
        readonly en: "Doses given, per-disease coverage and lot traceability, with who is overdue now.";
    };
    readonly category: "clinical";
    readonly updatedAt: "2026-08-17";
    readonly widgets: readonly [{
        readonly key: "dosesTrend";
        readonly title: {
            readonly ar: "حجم الجرعات";
            readonly en: "Dose volume";
        };
        readonly span: "full";
    }, {
        readonly key: "antigenCoverage";
        readonly title: {
            readonly ar: "التغطية لكل مرض";
            readonly en: "Coverage by disease";
        };
        readonly span: "half";
    }, {
        readonly key: "speciesMix";
        readonly title: {
            readonly ar: "توزيع الأنواع";
            readonly en: "Species mix";
        };
        readonly span: "half";
    }, {
        readonly key: "topVaccines";
        readonly title: {
            readonly ar: "أكثر اللقاحات استخدامًا";
            readonly en: "Most used vaccines";
        };
        readonly span: "half";
    }, {
        readonly key: "traceability";
        readonly title: {
            readonly ar: "تتبّع الدُفعات";
            readonly en: "Lot traceability";
        };
        readonly span: "half";
    }, {
        readonly key: "reactionMix";
        readonly title: {
            readonly ar: "التفاعلات العكسية";
            readonly en: "Adverse reactions";
        };
        readonly span: "half";
    }, {
        readonly key: "overdueList";
        readonly title: {
            readonly ar: "المتأخّرون والمستحقّون الآن";
            readonly en: "Overdue and due now";
        };
        readonly span: "full";
    }];
}, {
    readonly id: "operations-surgical";
    readonly title: {
        readonly ar: "العمليات الجراحية";
        readonly en: "Surgical Operations";
    };
    readonly description: {
        readonly ar: "الحالات ودرجاتها ودرجة الاستعجال ومعدل الإلغاء والمضاعفات المسجّلة.";
        readonly en: "Cases by tier and urgency, cancellation rate and recorded complications.";
    };
    readonly category: "clinical";
    readonly updatedAt: "2026-08-12";
    readonly widgets: readonly [{
        readonly key: "casesTrend";
        readonly title: {
            readonly ar: "حجم الحالات";
            readonly en: "Case volume";
        };
        readonly span: "full";
    }, {
        readonly key: "statusMix";
        readonly title: {
            readonly ar: "حالة العمليات";
            readonly en: "Case status";
        };
        readonly span: "half";
    }, {
        readonly key: "tierMix";
        readonly title: {
            readonly ar: "درجة العملية";
            readonly en: "Case tier";
        };
        readonly span: "half";
    }, {
        readonly key: "urgencyMix";
        readonly title: {
            readonly ar: "درجة الاستعجال";
            readonly en: "Urgency";
        };
        readonly span: "half";
    }, {
        readonly key: "complications";
        readonly title: {
            readonly ar: "المضاعفات";
            readonly en: "Complications";
        };
        readonly span: "half";
    }, {
        readonly key: "topProcedures";
        readonly title: {
            readonly ar: "أكثر الإجراءات";
            readonly en: "Most performed procedures";
        };
        readonly span: "full";
    }];
}, {
    readonly id: "expenses";
    readonly title: {
        readonly ar: "المصروفات";
        readonly en: "Expenses";
    };
    readonly description: {
        readonly ar: "المصروفات حسب الحالة والفئة والفرع والمصدر، وأعلى بنود الصرف.";
        readonly en: "Spend by status, category, branch and source, plus the largest line items.";
    };
    readonly category: "financial";
    readonly gate: "finance_expenses";
    readonly updatedAt: "2026-08-12";
    readonly widgets: readonly [{
        readonly key: "trend";
        readonly title: {
            readonly ar: "حركة المصروفات";
            readonly en: "Expense trend";
        };
        readonly span: "full";
    }, {
        readonly key: "statusMix";
        readonly title: {
            readonly ar: "حالة المصروفات";
            readonly en: "Status mix";
        };
        readonly span: "half";
    }, {
        readonly key: "bySource";
        readonly title: {
            readonly ar: "مصدر المصروف";
            readonly en: "Expense source";
        };
        readonly span: "half";
    }, {
        readonly key: "byCategory";
        readonly title: {
            readonly ar: "حسب الفئة";
            readonly en: "By category";
        };
        readonly span: "half";
    }, {
        readonly key: "byBranch";
        readonly title: {
            readonly ar: "حسب الفرع";
            readonly en: "By branch";
        };
        readonly span: "half";
    }, {
        readonly key: "topExpenses";
        readonly title: {
            readonly ar: "أعلى المصروفات";
            readonly en: "Largest expenses";
        };
        readonly span: "full";
    }];
}, {
    readonly id: "training";
    readonly title: {
        readonly ar: "التدريب والتأهيل";
        readonly en: "Training & Development";
    };
    readonly description: {
        readonly ar: "تعيينات الدورات ونسب الإكمال وأداء المتدرّبين والشهادات الصادرة.";
        readonly en: "Course assignments, completion rates, trainee performance and certificates.";
    };
    readonly category: "hr";
    readonly gate: "staff";
    readonly updatedAt: "2026-08-12";
    readonly widgets: readonly [{
        readonly key: "assignmentsTrend";
        readonly title: {
            readonly ar: "حركة التعيينات";
            readonly en: "Assignment trend";
        };
        readonly span: "full";
    }, {
        readonly key: "statusMix";
        readonly title: {
            readonly ar: "حالة التعيينات";
            readonly en: "Assignment status";
        };
        readonly span: "half";
    }, {
        readonly key: "completionRate";
        readonly title: {
            readonly ar: "نسبة الإكمال";
            readonly en: "Completion rate";
        };
        readonly span: "half";
    }, {
        readonly key: "byCourseType";
        readonly title: {
            readonly ar: "نوع الدورة";
            readonly en: "Course type";
        };
        readonly span: "half";
    }, {
        readonly key: "topStaff";
        readonly title: {
            readonly ar: "أنشط المتدرّبين";
            readonly en: "Top trainees";
        };
        readonly span: "half";
    }, {
        readonly key: "byCourse";
        readonly title: {
            readonly ar: "الدورات";
            readonly en: "Courses";
        };
        readonly span: "full";
    }];
}];
export type ReportId = (typeof CATALOG)[number]["id"];
export declare const REPORT_CATALOG: readonly ReportDef[];
export declare const REPORT_IDS: ReportId[];
export declare const isReportId: (value: string) => value is ReportId;
export declare const findReport: (id: string) => ReportDef | undefined;
export {};
