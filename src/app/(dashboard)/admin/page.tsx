import { Metadata } from "next";
import Dashboard from "./_components/dashboard";

export const metadata: Metadata = {
  title: "Dashboard - POS Realtime",
};

export default function AdminDashboardPage() {
  return <Dashboard />;
}
