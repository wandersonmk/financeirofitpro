
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  color?: "primary" | "income" | "expense" | "tithe" | "goal";
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export const ProgressBar = ({
  value,
  max,
  className,
  color = "primary",
  showText = true,
  size = "md",
}: ProgressBarProps) => {
  const percent = Math.min(Math.max(0, (value / max) * 100), 100);
  
  const colorVariants = {
    primary: "bg-primary",
    income: "bg-finance-income",
    expense: "bg-finance-expense",
    tithe: "bg-finance-tithe",
    goal: "bg-finance-goal",
  };

  const sizeVariants = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className={cn("w-full space-y-1", className)}>
      <div className={cn("w-full bg-secondary rounded-full overflow-hidden", sizeVariants[size])}>
        <motion.div
          className={cn("h-full rounded-full", colorVariants[color])}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      {showText && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          <span>{percent.toFixed(0)}%</span>
        </div>
      )}
    </div>
  );
};
