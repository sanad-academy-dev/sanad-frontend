import { createFileRoute } from "@tanstack/react-router";

import { VoucherDemoPage } from "@/features/accounting/voucher-demo/components/voucher-demo-page";

export const Route = createFileRoute("/_pathless-layout/management/accounting/vouchers")({
	component: VoucherDemoPage,
});
