import { Metadata } from "next";
import Login from "./_components/login";

export const metadata: Metadata = {
  title: "POS Realtime | Login",
};

export default function LoginPage() {
  return <Login />;
}
