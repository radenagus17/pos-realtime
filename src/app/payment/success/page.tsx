import { Metadata } from "next";
import Success from "./_components/success";

export const metadata: Metadata = {
  title: "Payment Success | POS Realtime",
};

export default function SuccessPage() {
  return <Success />;
}
