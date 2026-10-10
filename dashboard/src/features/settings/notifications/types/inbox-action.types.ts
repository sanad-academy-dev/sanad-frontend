import type { InboxSettingsResponse } from "@/server/inbox-settings/inbox-settings.type";

export type InboxSoundActionProps = Pick<
	InboxSettingsResponse,
	"soundEnabled" | "soundName" | "soundVolume"
> & {
	isPending: boolean;
	onEnabledChange: (checked: boolean) => void;
	onSoundChange: (soundName: InboxSettingsResponse["soundName"]) => void;
};

export type InboxVolumeActionProps = Pick<
	InboxSettingsResponse,
	"soundEnabled" | "soundVolume"
> & {
	isPending: boolean;
	onVolumeChange: (volume: number) => void;
};

export type InboxDesktopActionProps = Pick<InboxSettingsResponse, "desktopEnabled"> & {
	isPending: boolean;
	onEnabledChange: (checked: boolean) => void;
};
