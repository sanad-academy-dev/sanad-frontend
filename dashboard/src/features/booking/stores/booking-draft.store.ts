import { create } from "zustand";
import { persist } from "zustand/middleware";

const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type BookingDraftFields = {
	consultationTypeId: string;
	reason: string;
	symptoms: string;
	clinicalNotes: string;
	whatsappReminderEnabled: boolean;
	isEmergency: boolean;
	ownerName: string;
	ownerPhone: string;
	ownerEmail: string;
	patientName: string;
	patientAnimalTypeId: string;
};

type BookingDraftStore = BookingDraftFields & {
	lastUpdatedAt: number | null;
	setField: <K extends keyof BookingDraftFields>(key: K, value: BookingDraftFields[K]) => void;
	reset: () => void;
};

const defaults: BookingDraftFields = {
	consultationTypeId: "",
	reason: "",
	symptoms: "",
	clinicalNotes: "",
	whatsappReminderEnabled: true,
	isEmergency: false,
	ownerName: "",
	ownerPhone: "",
	ownerEmail: "",
	patientName: "",
	patientAnimalTypeId: "",
};

const stores = new Map<string, ReturnType<typeof createDraftStore>>();

const createDraftStore = (clinicSlug: string) =>
	create<BookingDraftStore>()(
		persist(
			(set) => ({
				...defaults,
				lastUpdatedAt: null,
				setField: (key, value) =>
					set((state) => ({ ...state, [key]: value, lastUpdatedAt: Date.now() })),
				reset: () => set({ ...defaults, lastUpdatedAt: null }),
			}),
			{
				name: `elite-vet-booking-draft:${clinicSlug}`,
				merge: (persistedState, currentState) => {
					const persisted = persistedState as Partial<BookingDraftStore> | undefined;
					if (!persisted?.lastUpdatedAt) return currentState;
					if (Date.now() - persisted.lastUpdatedAt > DRAFT_TTL_MS) return currentState;
					return { ...currentState, ...persisted };
				},
			},
		),
	);

export const useBookingDraftStore = (clinicSlug: string) => {
	let store = stores.get(clinicSlug);
	if (!store) {
		store = createDraftStore(clinicSlug);
		stores.set(clinicSlug, store);
	}
	return store();
};
