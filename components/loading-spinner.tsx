"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "default", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-5 w-5",
    lg: "h-8 w-8",
  };

  return (
    <Loader2 
      className={cn("animate-spin", sizeClasses[size], className)} 
    />
  );
}