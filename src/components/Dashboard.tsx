
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ChevronLeft, 
  ChevronDown, 
  Clock, 
  Target 
} from "lucide-react";
import { FinanceCard } from "./ui/FinanceCard";
import { ProgressBar } from "./ui/ProgressBar";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Mock data until we have a real data source
const mockData = {
  totalIncome: 5000,
  totalExpenses: 3200,
  tithe: 500,
  balance: 1800,
  incomeTransactions: [
    { id: 1, description: "Salário", amount: 4500, date: new Date(), category: "Trabalho" },
    { id: 2, description: "Freelance", amount: 500, date: new Date(), category: "Projetos" },
  ],
  expenseTransactions: [
    { id: 1, description: "Aluguel", amount: 1200, date: new Date(), dueDate: new Date(2023, 5, 15), status: "pending", category: "Moradia" },
    { id: 2, description: "Supermercado", amount: 800, date: new Date(), dueDate: new Date(2023, 5, 10), status: "paid", category: "Alimentação" },
    { id: 3, description: "Internet", amount: 100, date: new Date(), dueDate: new Date(2023, 5, 20), status: "pending", category: "Serviços" },
    { id: 4, description: "Energia", amount: 200, date: new Date(), dueDate: new Date(2023, 5, 18), status: "pending", category: "Serviços" },
  ],
  goals: [
    { id: 1, title: "Reserva de emergência", targetAmount: 10000, currentAmount: 3000, deadline: new Date(2023, 11, 31) },
    { id: 2, title: "Férias", targetAmount: 5000, currentAmount: 1500, deadline: new Date(2023, 8, 30) },
  ],
  monthlyComparison: [
    { month: "Janeiro", income: 4800, expenses: 3100 },
    { month: "Fevereiro", income: 4900, expenses: 3300 },
    { month: "Março", income: 4700, expenses: 3000 },
    { month: "Abril", income: 5100, expenses: 3400 },
    { month: "Maio", income: 5000, expenses: 3200 },
  ]
};

export const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState("maio");
  
  // Calculate the due date status
  const getDueStatus = (dueDate: Date) => {
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue < 0) return "overdue";
    if (daysUntilDue <= 3) return "due-soon";
    return "upcoming";
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            {format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: pt })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>
          <Select defaultValue={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="Selecione o mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="janeiro">Janeiro</SelectItem>
              <SelectItem value="fevereiro">Fevereiro</SelectItem>
              <SelectItem value="março">Março</SelectItem>
              <SelectItem value="abril">Abril</SelectItem>
              <SelectItem value="maio">Maio</SelectItem>
              <SelectItem value="junho">Junho</SelectItem>
              <SelectItem value="julho">Julho</SelectItem>
              <SelectItem value="agosto">Agosto</SelectItem>
              <SelectItem value="setembro">Setembro</SelectItem>
              <SelectItem value="outubro">Outubro</SelectItem>
              <SelectItem value="novembro">Novembro</SelectItem>
              <SelectItem value="dezembro">Dezembro</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-9">
            Próximo
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </header>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <FinanceCard variant="income" className="h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-full bg-green-100">
                <TrendingUp className="h-5 w-5 text-finance-income" />
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Entradas Totais</p>
            <h3 className="text-2xl font-bold mt-1">
              {formatCurrency(mockData.totalIncome)}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Mês de {selectedMonth}</p>
          </FinanceCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <FinanceCard variant="expense" className="h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-full bg-red-100">
                <TrendingDown className="h-5 w-5 text-finance-expense" />
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Despesas Totais</p>
            <h3 className="text-2xl font-bold mt-1">
              {formatCurrency(mockData.totalExpenses)}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Mês de {selectedMonth}</p>
          </FinanceCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <FinanceCard variant="tithe" className="h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-full bg-purple-100">
                <DollarSign className="h-5 w-5 text-finance-tithe" />
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Dízimo (10%)</p>
            <h3 className="text-2xl font-bold mt-1">
              {formatCurrency(mockData.tithe)}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Mês de {selectedMonth}</p>
          </FinanceCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <FinanceCard className="h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-full bg-blue-100">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Saldo Geral</p>
            <h3 className="text-2xl font-bold mt-1">
              {formatCurrency(mockData.balance)}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Mês de {selectedMonth}</p>
          </FinanceCard>
        </motion.div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <motion.div 
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          {/* Upcoming Expenses */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Despesas Próximas</h2>
              <Link to="/expenses">
                <Button variant="ghost" size="sm">
                  Ver todas
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="space-y-3">
              {mockData.expenseTransactions
                .filter(expense => expense.status === "pending")
                .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
                .slice(0, 3)
                .map(expense => {
                  const dueStatus = getDueStatus(expense.dueDate);
                  
                  return (
                    <FinanceCard 
                      key={expense.id} 
                      variant="expense"
                      className="animate-on-enter"
                      hoverEffect
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{expense.description}</h3>
                          <div className="flex items-center mt-1">
                            <div className={`
                              flex items-center text-xs mr-3
                              ${dueStatus === 'overdue' ? 'text-finance-expense' : 
                                dueStatus === 'due-soon' ? 'text-amber-500' : 
                                'text-muted-foreground'}
                            `}>
                              <Clock className="h-3 w-3 mr-1" />
                              <span>
                                {dueStatus === 'overdue' ? 'Atrasado' : 
                                  dueStatus === 'due-soon' ? 'Próximo vencimento' : 
                                  format(expense.dueDate, "dd/MM/yyyy")}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-secondary">
                              {expense.category}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">{formatCurrency(expense.amount)}</div>
                        </div>
                      </div>
                    </FinanceCard>
                  );
                })}
                
              {mockData.expenseTransactions.filter(expense => expense.status === "pending").length === 0 && (
                <FinanceCard>
                  <p className="text-center text-muted-foreground py-4">
                    Nenhuma despesa pendente
                  </p>
                </FinanceCard>
              )}
            </div>
          </div>
          
          {/* Recent Income */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Entradas Recentes</h2>
              <Link to="/income">
                <Button variant="ghost" size="sm">
                  Ver todas
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="space-y-3">
              {mockData.incomeTransactions.slice(0, 3).map(income => (
                <FinanceCard 
                  key={income.id} 
                  variant="income"
                  className="animate-on-enter"
                  hoverEffect
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{income.description}</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-muted-foreground mr-3">
                          {format(income.date, "dd/MM/yyyy")}
                        </span>
                        <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-secondary">
                          {income.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">{formatCurrency(income.amount)}</div>
                      <div className="text-xs text-finance-tithe">
                        Dízimo: {formatCurrency(income.amount * 0.1)}
                      </div>
                    </div>
                  </div>
                </FinanceCard>
              ))}
              
              {mockData.incomeTransactions.length === 0 && (
                <FinanceCard>
                  <p className="text-center text-muted-foreground py-4">
                    Nenhuma entrada registrada
                  </p>
                </FinanceCard>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Financial Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Objetivos Financeiros</h2>
            <Link to="/goals">
              <Button variant="ghost" size="sm">
                Ver todos
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {mockData.goals.map((goal, index) => (
              <FinanceCard 
                key={goal.id} 
                variant="goal"
                className="animate-on-enter"
                hoverEffect
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium">{goal.title}</h3>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Target className="h-3 w-3 mr-1" />
                    {format(goal.deadline, "dd/MM/yyyy")}
                  </div>
                </div>
                
                <ProgressBar 
                  value={goal.currentAmount}
                  max={goal.targetAmount}
                  color="goal"
                />
                
                <div className="mt-2 text-xs text-right text-muted-foreground">
                  Objetivo: {formatCurrency(goal.targetAmount)}
                </div>
              </FinanceCard>
            ))}
            
            {mockData.goals.length === 0 && (
              <FinanceCard className="py-10">
                <p className="text-center text-muted-foreground">
                  Nenhum objetivo cadastrado
                </p>
              </FinanceCard>
            )}
            
            <Link to="/goals/new">
              <Button className="w-full mt-2">
                Adicionar Novo Objetivo
              </Button>
            </Link>
          </div>
          
          {/* Monthly Comparison */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Comparativo Mensal</h2>
            <FinanceCard>
              <div className="space-y-3">
                {mockData.monthlyComparison.slice(-3).map((month, index) => (
                  <div key={month.month} className="animate-on-enter">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{month.month}</span>
                      <span className="text-sm">
                        {formatCurrency(month.income - month.expenses)}
                      </span>
                    </div>
                    <div className="relative pt-1">
                      <div className="flex h-2 overflow-hidden text-xs rounded-full bg-secondary">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(month.expenses / month.income) * 100}%` }}
                          transition={{ duration: 1, delay: 0.1 * index }}
                          className="flex flex-col text-center whitespace-nowrap text-white justify-center bg-finance-expense"
                        />
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span className="text-finance-income">
                          Entradas: {formatCurrency(month.income)}
                        </span>
                        <span className="text-finance-expense">
                          Despesas: {formatCurrency(month.expenses)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </FinanceCard>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
