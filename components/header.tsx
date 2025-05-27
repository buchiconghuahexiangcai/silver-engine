import { MessageCircle } from "lucide-react";
import { HistoryDrawer } from "@/components/history-drawer";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 h-14 flex items-center max-w-3xl">
        <div className="flex items-center gap-2">
          <MessageCircle size={24} className="text-[#07C160]" />
          <h1 className="text-xl font-bold">吵架包赢</h1>
        </div>
        <div className="ml-auto flex items-center">
          <span className="text-xs text-muted-foreground mr-2">Win Arguments Guaranteed</span>
          <HistoryDrawer />
        </div>
      </div>
    </header>
  );
}