import { useLocalParticipant, useParticipantPermissions } from "@livekit/components-react";
import { useEffect } from "react";

import { Spinner } from "@/components/common/spinner";
import { SessionCall } from "@/features/video-calls/components/session-call";

// بوابة قاعة الانتظار للضيف: شاشة انتظار حتى يقبله المضيف، وعند القبول
// تُفعَّل أجهزته تلقائيًا ويرى نفس واجهة مكالمة المدرّب (بلا لوحة جانبية).
// يجب أن تكون داخل LiveKitRoom
export const GuestCallGate = ({ onLeave }: { onLeave: () => void }) => {
	const { localParticipant } = useLocalParticipant();
	const permissions = useParticipantPermissions({ participant: localParticipant });
	const isAdmitted = !!permissions?.canPublish;

	useEffect(() => {
		if (!isAdmitted) return;
		void localParticipant.setMicrophoneEnabled(true);
		void localParticipant.setCameraEnabled(true);
	}, [isAdmitted, localParticipant]);

	if (!isAdmitted) {
		return (
			<div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
				<Spinner />
				<p className="text-sm font-medium">تم إشعار المدرّب بطلب انضمامك</p>
				<p className="text-xs text-muted-foreground">بانتظار الموافقة للدخول إلى الجلسة...</p>
			</div>
		);
	}

	return (
		<SessionCall
			inviteLink={null}
			isHost={false}
			onLeave={onLeave}
		/>
	);
};
