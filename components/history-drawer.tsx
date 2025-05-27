"use client";

import { useState } from "react";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { History, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArgumentHistory, 
  getArgumentHistory, 
  clearArgumentHistory 
} from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

export function HistoryDrawer() {
  const [history, setHistory] = useState<ArgumentHistory[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const loadHistory = () => {
    const historyData = getArgumentHistory();
    setHistory(historyData);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      loadHistory();
    }
  };

  const handleClearHistory = () => {
    clearArgumentHistory();
    setHistory([]);
    toast({
      title: "历史记录已清空",
      description: "所有吵架记录已被删除",
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: zhCN
      });
    } catch (e) {
      return "未知时间";
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="ml-2">
          <History className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex justify-between items-center">
            <span>历史记录</span>
            {history.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-destructive" 
                onClick={handleClearHistory}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                清空
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4 max-h-[calc(100vh-10rem)] overflow-y-auto pb-20">
          {history.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <p>暂无历史记录</p>
            </div>
          ) : (
            history.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex justify-between">
                    <span className="truncate flex-1">
                      对方说: {item.opponentWords.slice(0, 20)}
                      {item.opponentWords.length > 20 ? "..." : ""}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                      {formatDate(item.timestamp)}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="text-xs text-muted-foreground mb-1">
                    强度: {item.intensity}
                  </p>
                  <p className="truncate">{item.responses[0]}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        <div className="absolute bottom-4 right-4">
          <SheetClose asChild>
            <Button className="bg-[#07C160] hover:bg-[#06AD54]">关闭</Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}