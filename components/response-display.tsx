"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, ThumbsUp } from "lucide-react";
import { motion } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ResponseDisplayProps {
  responses: string[];
}

export function ResponseDisplay({ responses }: ResponseDisplayProps) {
  const [copied, setCopied] = useState<Record<number, boolean>>({});
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  // 过滤掉空响应
  const validResponses = responses.filter(resp => resp.trim().length > 0);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [index]: true });
    setTimeout(() => {
      setCopied({ ...copied, [index]: false });
    }, 2000);
  };

  const toggleLike = (index: number) => {
    setLiked({ ...liked, [index]: !liked[index] });
  };

  // 如果没有有效响应，显示错误信息
  if (validResponses.length === 0) {
    return (
      <div className="p-4 border rounded-md bg-muted">
        <p className="text-center text-muted-foreground">无法生成回复，请尝试不同的输入。</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">回复建议</h2>
      {validResponses.map((response, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.15 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex justify-between">
                <span>回复 {index + 1}</span>
                <div className="flex items-center gap-2">
                  <Button 
                    className={cn(
                      "h-8 w-8",
                      "hover:bg-accent hover:text-accent-foreground" // ghost variant
                    )}
                    onClick={() => toggleLike(index)}
                  >
                    <ThumbsUp 
                      className={cn(
                        "h-4 w-4", 
                        liked[index] ? "fill-current text-[#07C160]" : "text-muted-foreground"
                      )} 
                    />
                  </Button>
                  <Button
                    className={cn(
                      "h-8 w-8",
                      "hover:bg-accent hover:text-accent-foreground" // ghost variant
                    )}
                    onClick={() => copyToClipboard(response, index)}
                  >
                    {copied[index] ? (
                      <Check className="h-4 w-4 text-[#07C160]" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{response}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}