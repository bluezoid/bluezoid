import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: "blue" | "vibrant";
}

export function GradientText({ children, className, variant = "vibrant" }: GradientTextProps) {
  return (
    <span className={cn(variant === "vibrant" ? "gradient-bz-text-vibrant" : "gradient-bz-text", className)}>
      {children}
    </span>
  );
}
