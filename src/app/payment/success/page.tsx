import type { Metadata } from "next";
import Success from "./_components/success";

export const metadata: Metadata = {
	title: "Payment Success | Qassa",
};

export default function SuccessPage() {
	return <Success />;
}
