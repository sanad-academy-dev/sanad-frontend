import type { ReactNode } from "react";

export const SettingsPageWrapper = ({ children }: { children: ReactNode }) => (
	<div className="mx-auto flex h-full w-full max-w-4xl flex-col gap-8 px-6 pb-8">
		{children}
	</div>
);
