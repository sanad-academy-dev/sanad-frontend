import { create } from "zustand";
import { persist } from "zustand/middleware";

// Fixed lightness/chroma for each chart color slot.
// Only the hue is user-controlled; all 5 colors are derived from it.
const CHART_PRESETS = [
	{ l: 0.809, c: 0.105 },
	{ l: 0.623, c: 0.214 },
	{ l: 0.546, c: 0.245 },
	{ l: 0.488, c: 0.243 },
	{ l: 0.424, c: 0.199 },
] as const;

export const DEFAULT_CHART_HUE = 251.813;

export function deriveChartColors(hue: number): [string, string, string, string, string] {
	return CHART_PRESETS.map(({ l, c }) => `oklch(${l} ${c} ${hue})`) as [
		string,
		string,
		string,
		string,
		string,
	];
}

export type CardId =
	| "card-1"
	| "card-2"
	| "card-3"
	| "card-4"
	| "card-5"
	| "card-6"
	| "card-7"
	| "card-8"
	| "card-9"
	| "card-11"
	| "card-12"
	| "card-13";

export interface CardLayout {
	id: CardId;
	order: number;
	expanded: boolean;
	hidden: boolean;
}

const createDefaultCards = (): CardLayout[] => [
	{ id: "card-1", order: 0, expanded: false, hidden: false },
	{ id: "card-2", order: 1, expanded: false, hidden: false },
	{ id: "card-3", order: 2, expanded: false, hidden: false },
	{ id: "card-4", order: 3, expanded: false, hidden: false },
	{ id: "card-5", order: 4, expanded: false, hidden: false },
	{ id: "card-6", order: 5, expanded: false, hidden: false },
	{ id: "card-7", order: 6, expanded: false, hidden: false },
	{ id: "card-8", order: 7, expanded: false, hidden: false },
	{ id: "card-9", order: 8, expanded: false, hidden: false },
	{ id: "card-11", order: 9, expanded: false, hidden: false },
	{ id: "card-12", order: 10, expanded: false, hidden: false },
	{ id: "card-13", order: 11, expanded: false, hidden: false },
];

const normalizeCards = (cards?: Partial<CardLayout>[]) => {
	const cardsById = new Map(cards?.map((card) => [card.id, card]));

	return createDefaultCards().map((defaultCard) => {
		const savedCard = cardsById.get(defaultCard.id);

		return {
			...defaultCard,
			...savedCard,
			hidden: savedCard?.hidden ?? false,
		};
	});
};

interface DashboardPreferencesStore {
	/** Hue angle (0–360) for all chart colors. */
	chartHue: number;
	cards: CardLayout[];
	setChartHue: (hue: number) => void;
	resetChartHue: () => void;
	toggleCardExpanded: (id: CardId) => void;
	toggleCardHidden: (id: CardId) => void;
	reorderCards: (fromOrder: number, toOrder: number) => void;
	resetLayout: () => void;
}

export const useDashboardPreferences = create<DashboardPreferencesStore>()(
	persist(
		(set) => ({
			chartHue: DEFAULT_CHART_HUE,
			cards: createDefaultCards(),

			setChartHue: (hue) => set({ chartHue: hue }),

			resetChartHue: () => set({ chartHue: DEFAULT_CHART_HUE }),

			toggleCardExpanded: (id) =>
				set((state) => ({
					cards: state.cards.map((card) =>
						card.id === id ? { ...card, expanded: !card.expanded } : card,
					),
				})),

			toggleCardHidden: (id) =>
				set((state) => ({
					cards: state.cards.map((card) =>
						card.id === id ? { ...card, hidden: !card.hidden } : card,
					),
				})),

			reorderCards: (fromOrder, toOrder) =>
				set((state) => {
					const cards = [...state.cards].sort((a, b) => a.order - b.order);
					const fromIdx = cards.findIndex((c) => c.order === fromOrder);
					const toIdx = cards.findIndex((c) => c.order === toOrder);
					if (fromIdx === -1 || toIdx === -1) return state;

					const updated = [...cards];
					const [moved] = updated.splice(fromIdx, 1);
					updated.splice(toIdx, 0, moved);

					return {
						cards: updated.map((card, i) => ({ ...card, order: i })),
					};
				}),

			resetLayout: () => set({ cards: createDefaultCards() }),
		}),
		{
			name: "elite-vet-dashboard-preferences",
			merge: (persistedState, currentState) => {
				const typedPersistedState = persistedState as Partial<DashboardPreferencesStore>;

				return {
					...currentState,
					...typedPersistedState,
					cards: normalizeCards(typedPersistedState?.cards),
				};
			},
		},
	),
);
