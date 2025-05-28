"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ResponseDisplay } from "@/components/response-display";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { saveArgumentToHistory } from "@/lib/storage";

export function ArgumentForm() {
  const [opponentWords, setOpponentWords] = useState("");
  const [intensity, setIntensity] = useState([5]);
  const [responses, setResponses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!opponentWords.trim()) {
      toast({
        title: "请输入对方的话",
        description: "你需要告诉我对方说了什么才能帮你回击",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResponses([]);
    
    try {
      const response = await fetch("/api/generate-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          opponentWords,
          intensity: intensity[0],
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "无法生成回复");
      }

      if (!data.responses || !Array.isArray(data.responses) || data.responses.length === 0) {
        throw new Error("API返回的响应格式不正确");
      }

      setResponses(data.responses);
      
      // Save to history
      saveArgumentToHistory({
        opponentWords,
        intensity: intensity[0],
        responses: data.responses,
        timestamp: new Date().toISOString(),
      });
      
    } catch (error) {
      console.error("Error generating responses:", error);
      toast({
        title: "生成失败",
        description: error instanceof Error ? error.message : "无法生成回应，请稍后再试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="opponentWords" className="text-sm font-medium">
              对方的话
            </label>
            <Textarea
              id="opponentWords"
              placeholder="输入对方说的话..."
              value={opponentWords}
              onChange={(e) => setOpponentWords(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="intensity" className="text-sm font-medium">
              语气强烈程度: {intensity[0]}
            </label>
            <Slider
              id="intensity"
              min={1}
              max={10}
              step={1}
              value={intensity}
              onValueChange={setIntensity}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>温和</span>
              <span>强烈</span>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-[#07C160] hover:bg-[#06AD54]"
            disabled={isLoading || !opponentWords.trim()}
          >
            {isLoading ? <LoadingSpinner /> : "开始吵架"}
          </Button>
        </form>
      </Card>

      {isLoading && (
        <div className="text-center py-10">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">正在生成精彩回复...</p>
        </div>
      )}

      {responses.length > 0 && <ResponseDisplay responses={responses} />}
    </div>
  );
}