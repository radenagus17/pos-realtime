import type { Metadata } from "next";
import Failed from "./_components/failed";

export const metadata: Metadata = {
	title: "Payment Failed | Qassa",
};

export default function FailedPage() {
	return <Failed />;
}
