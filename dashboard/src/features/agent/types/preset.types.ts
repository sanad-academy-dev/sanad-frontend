// أنواع الأوامر الجاهزة على جهة العميل — مطابقة لشكل الخادم في
// src/server/agent/actions/action.type.ts (تُبقى متزامنة يدويًا لتفادي استيراد الخادم في الحزمة).

export type SubAgentKey = "general" | "hr" | "visits" | "inventory" | "workflow" | "reports";

// slot-time: منتقي موعد كنموذج الحجز الفعلي — تاريخ + الأوقات المتاحة للمدرّب المختار
export type PromptSlotKind = "text" | "select" | "enum" | "date" | "slot-time";

export type PromptSegment =
	| { type: "text"; text: string }
	| {
			type: "slot";
			field: string;
			kind: PromptSlotKind;
			placeholder: string;
			source?: string;
	  };

export type ActionPreset = {
	key: string;
	subAgent: SubAgentKey;
	kind: "read" | "write";
	title: string;
	description: string;
	contexts: string[];
	template: PromptSegment[];
};

export type SubAgentGroup = {
	key: SubAgentKey;
	title: string;
	presets: ActionPreset[];
};

export type PresetsResponse = {
	presets: ActionPreset[];
	subAgents: SubAgentGroup[];
};

// قيم الفراغات التي عبّأها المستخدم في القالب: field -> { value, label }
export type SlotValues = Record<string, { value: string; label: string }>;
