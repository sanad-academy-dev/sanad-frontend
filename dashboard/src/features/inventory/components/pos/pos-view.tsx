import { CartPanel } from "@/features/inventory/components/pos/cart-panel";
import { PosShiftBar } from "@/features/inventory/components/pos/pos-shift-bar";
import { ProductGrid } from "@/features/inventory/components/pos/product-grid";

// نقطة البيع: شريط الوردية أعلى الشاشة، ثم شبكة المنتجات على اليمين والسلة على اليسار (RTL)
export function POSView() {
	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<PosShiftBar />
			<div className="flex min-h-0 flex-1 overflow-hidden">
				<ProductGrid />
				<CartPanel />
			</div>
		</div>
	);
}
