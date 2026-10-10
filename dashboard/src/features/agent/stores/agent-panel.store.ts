import { create } from "zustand";

import type { ActionPreset } from "@/features/agent/types/preset.types";

interface AgentPanelStore {
	isOpen: boolean;
	// الأمر الجاهز المُختار حاليًا لتعبئته في المُحرّر (null = وضع الدردشة الحر)
	activePreset: ActionPreset | null;
	open: () => void;
	close: () => void;
	toggle: () => void;
	selectPreset: (preset: ActionPreset) => void;
	clearPreset: () => void;
}

export const useAgentPanelStore = create<AgentPanelStore>()((set) => ({
	isOpen: false,
	activePreset: null,
	open: () => set({ isOpen: true }),
	close: () => set({ isOpen: false }),
	toggle: () => set((state) => ({ isOpen: !state.isOpen })),
	selectPreset: (preset) => set({ activePreset: preset }),
	clearPreset: () => set({ activePreset: null }),
}));
