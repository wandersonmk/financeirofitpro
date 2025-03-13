
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
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-3.5",
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className={cn("w-full bg-secondary/80 rounded-full overflow-hidden shadow-inner", sizeVariants[size])}>
        <motion.div
          className={cn("h-full rounded-full", colorVariants[color])}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ 
            duration: 0.8, 
            ease: [0.34, 1.56, 0.64, 1],
            delay: 0.1
          }}
        />
      </div>
      {showText && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          <span className="font-medium">{percent.toFixed(0)}%</span>
        </div>
      )}
    </div>
  );
};
