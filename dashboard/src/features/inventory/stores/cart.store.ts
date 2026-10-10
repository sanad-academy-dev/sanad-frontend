import { create } from "zustand";

import type { InventoryResponse } from "@/server/inventory/inventory.type";

export interface CartItem {
	id: string; // inventoryItemId
	name: string;
	code: string;
	unitPrice: number;
	quantity: number;
	maxStock: number;
}

export interface SelectedRef {
	id: string;
	name: string;
}

export interface CartSnapshot {
	items: CartItem[];
	discount: number;
	discountCode: string | null;
	customer: SelectedRef | null;
	patient: SelectedRef | null;
}

interface CartStore extends CartSnapshot {
	addProduct: (product: InventoryResponse) => void;
	increment: (id: string) => void;
	decrement: (id: string) => void;
	remove: (id: string) => void;
	setDiscount: (value: number) => void;
	setDiscountCode: (code: string | null) => void;
	setCustomer: (customer: SelectedRef | null) => void;
	setPatient: (patient: SelectedRef | null) => void;
	clear: () => void;
	/** يعيد محتوى السلة (للتراجع عن الحذف) */
	restore: (snapshot: CartSnapshot) => void;
}

export const useCartStore = create<CartStore>()((set) => ({
	items: [],
	discount: 0,
	discountCode: null,
	customer: null,
	patient: null,
	addProduct: (product) =>
		set((state) => {
			const existing = state.items.find((it) => it.id === product.id);
			const price = Number(product.price);
			if (existing) {
				// تجاوز المخزون مسموح (يظهر تحذير) — لا نُقيّد الزيادة بالحد الأقصى
				return {
					items: state.items.map((it) =>
						it.id === product.id ? { ...it, quantity: it.quantity + 1 } : it,
					),
				};
			}
			if (product.stock <= 0) return state;
			return {
				items: [
					...state.items,
					{
						id: product.id,
						name: product.name,
						code: product.code,
						unitPrice: price,
						quantity: 1,
						maxStock: product.stock,
					},
				],
			};
		}),
	increment: (id) =>
		set((state) => ({
			items: state.items.map((it) =>
				it.id === id ? { ...it, quantity: it.quantity + 1 } : it,
			),
		})),
	decrement: (id) =>
		set((state) => ({
			items: state.items
				.map((it) => (it.id === id ? { ...it, quantity: it.quantity - 1 } : it))
				.filter((it) => it.quantity > 0),
		})),
	remove: (id) => set((state) => ({ items: state.items.filter((it) => it.id !== id) })),
	setDiscount: (value) => set({ discount: Math.max(0, value) }),
	setDiscountCode: (code) => set({ discountCode: code }),
	setCustomer: (customer) => set({ customer }),
	setPatient: (patient) => set({ patient }),
	clear: () =>
		set({ items: [], discount: 0, discountCode: null, customer: null, patient: null }),
	restore: (snapshot) => set(snapshot),
}));
