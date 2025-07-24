import { DarkModeToggle } from "@/components/common/dark-mode";
import { Coffee } from "lucide-react";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="relative bg-muted flex min-h-svh flex-col justify-center items-center gap-6 p-6 md:p-10">
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="bg-teal-500 flex p-2 items-center justify-center rounded-md">
            <Coffee className="size-4" />
          </div>
          POS Realtime
        </div>
        {children}
      </div>
    </main>
  );
}
