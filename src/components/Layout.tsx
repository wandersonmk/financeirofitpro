
import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Home,
  PiggyBank,
  DollarSign,
  CreditCard,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { path: "/income", label: "Entradas", icon: <DollarSign className="w-5 h-5" /> },
    { path: "/expenses", label: "Despesas", icon: <CreditCard className="w-5 h-5" /> },
    { path: "/goals", label: "Objetivos", icon: <PiggyBank className="w-5 h-5" /> },
    { path: "/reports", label: "Relatórios", icon: <BarChart3 className="w-5 h-5" /> },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-indigo-50/30">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-sm border-b border-border h-16 flex items-center px-4">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
              FinançasPro
            </span>
          </Link>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            className="hover-lift"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden pt-16 glass"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.nav
              className="flex flex-col p-4 space-y-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            >
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                    location.pathname === item.path
                      ? "bg-primary/10 text-primary font-medium shadow-sm"
                      : "text-foreground hover:bg-secondary"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-screen">
        <aside className="w-64 border-r border-border glass-sm fixed top-0 bottom-0 left-0 py-8 px-4 overflow-y-auto">
          <div className="flex flex-col h-full">
            <Link to="/" className="flex items-center px-2 mb-8">
              <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                FinançasPro
              </span>
            </Link>
            
            <nav className="flex-1 space-y-1.5">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                    location.pathname === item.path
                      ? "bg-primary/10 text-primary font-medium shadow-sm"
                      : "text-foreground hover:bg-secondary hover:shadow-sm"
                  )}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.icon}
                  </motion.div>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            
            <div className="mt-auto pt-4 px-2 text-xs text-muted-foreground">
              <p>FinançasPro © {new Date().getFullYear()}</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 ml-64">
          <div className="container max-w-6xl py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Main Content */}
      <main className="lg:hidden pt-16 min-h-screen">
        <div className="container max-w-6xl py-6 px-4">
          {children}
        </div>
      </main>
    </div>
  );
};
