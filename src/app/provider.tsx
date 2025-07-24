import { GlobalStateProvider } from "@/providers/global-state-provider";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

export default function RootProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <GlobalStateProvider>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </GlobalStateProvider>
    </ThemeProvider>
  );
}
