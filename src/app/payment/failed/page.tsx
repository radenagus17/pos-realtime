import { Metadata } from "next";
import Failed from "./_components/failed";

export const metadata: Metadata = {
  title: "Payment Failed | POS Realtime",
};

export default function FailedPage() {
  return <Failed />;
}
