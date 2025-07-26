import { AuthStoreProvider } from "@/providers/auth-store-provider";
import { GlobalStateProvider } from "@/providers/global-state-provider";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { cookies } from "next/headers";

export default async function RootProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookiesStore = await cookies();
  const profile = JSON.parse(cookiesStore.get("user_profile")?.value ?? "{}");

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <GlobalStateProvider>
        <AuthStoreProvider profile={profile}>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </AuthStoreProvider>
      </GlobalStateProvider>
    </ThemeProvider>
  );
}
