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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">回复建议</h2>
      {responses.map((response, index) => (
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
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
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
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
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