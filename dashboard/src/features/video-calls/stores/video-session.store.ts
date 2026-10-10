import { create } from "zustand";

// خيارات ما قبل الانضمام (شاشة الاستعداد) — تُمرَّر إلى صفحة الجلسة عند البدء
interface VideoSessionStore {
	audioEnabled: boolean;
	videoEnabled: boolean;
	audioDeviceId: string | null;
	videoDeviceId: string | null;
	setAudioEnabled: (audioEnabled: boolean) => void;
	setVideoEnabled: (videoEnabled: boolean) => void;
	setAudioDeviceId: (audioDeviceId: string | null) => void;
	setVideoDeviceId: (videoDeviceId: string | null) => void;
}

export const useVideoSessionStore = create<VideoSessionStore>()((set) => ({
	audioEnabled: true,
	videoEnabled: true,
	audioDeviceId: null,
	videoDeviceId: null,
	setAudioEnabled: (audioEnabled) => set({ audioEnabled }),
	setVideoEnabled: (videoEnabled) => set({ videoEnabled }),
	setAudioDeviceId: (audioDeviceId) => set({ audioDeviceId }),
	setVideoDeviceId: (videoDeviceId) => set({ videoDeviceId }),
}));
