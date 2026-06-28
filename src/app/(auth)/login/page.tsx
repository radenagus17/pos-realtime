import type { Metadata } from "next";
import Login from "./_components/login";

export const metadata: Metadata = {
	title: "Qassa | Login",
};

export default function LoginPage() {
	return <Login />;
}
