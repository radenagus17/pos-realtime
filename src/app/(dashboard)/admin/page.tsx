import type { Metadata } from "next";
import Dashboard from "./_components/dashboard";

export const metadata: Metadata = {
	title: "Dashboard - Qassa",
};

export default function AdminDashboardPage() {
	return <Dashboard />;
}
