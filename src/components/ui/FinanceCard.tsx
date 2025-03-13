
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface FinanceCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "income" | "expense" | "tithe" | "goal";
  glassEffect?: boolean;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const FinanceCard = ({
  children,
  className,
  variant = "default",
  glassEffect = true,
  onClick,
  hoverEffect = false,
}: FinanceCardProps) => {
  const variants = {
    default: "",
    income: "border-l-4 border-l-finance-income",
    expense: "border-l-4 border-l-finance-expense",
    tithe: "border-l-4 border-l-finance-tithe",
    goal: "border-l-4 border-l-finance-goal",
  };

  return (
    <motion.div
      whileHover={hoverEffect ? { y: -4, boxShadow: "0 12px 30px rgba(0, 0, 0, 0.08)" } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-xl p-5 transition-all duration-300",
        glassEffect ? "glass" : "bg-white border border-border",
        variants[variant],
        hoverEffect && "hover:shadow-lg hover:scale-[1.01] cursor-pointer",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

