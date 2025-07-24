import { DarkModeToggle } from "@/components/common/dark-mode";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Button>Band</Button>
      <DarkModeToggle />
    </main>
  );
}
