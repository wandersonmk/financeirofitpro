
import { useState } from "react";
import { motion } from "framer-motion";
import { format, addDays, isFuture, isPast, isToday } from "date-fns";
import { pt } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/shared/CurrencyInput";
import { FinanceCard } from "../ui/FinanceCard";
import { EmptyState } from "../shared/EmptyState";
import { Switch } from "@/components/ui/switch";
import { 
  PlusCircle, 
  Calendar, 
  CreditCard, 
  Search, 
  Pencil, 
  Trash2, 
  Tag,
  FilterX,
  TrendingDown,
  CheckCircle2,
  XCircle,
  AlertCircle, 
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";

// Mock categories
const mockCategories = [
  { id: 1, name: "Moradia" },
  { id: 2, name: "Alimentação" },
  { id: 3, name: "Transporte" },
  { id: 4, name: "Saúde" },
  { id: 5, name: "Educação" },
  { id: 6, name: "Lazer" },
  { id: 7, name: "Outras" },
];

// Mock expense data
const mockExpenseData = [
  { 
    id: 1, 
    description: "Aluguel", 
    amount: 1200, 
    date: new Date(2023, 4, 5), 
    dueDate: addDays(new Date(), -5), 
    category: "Moradia", 
    isPaid: true, 
    isRecurring: true 
  },
  { 
    id: 2, 
    description: "Supermercado", 
    amount: 500, 
    date: new Date(2023, 4, 10), 
    dueDate: addDays(new Date(), 2), 
    category: "Alimentação", 
    isPaid: false, 
    isRecurring: false 
  },
  { 
    id: 3, 
    description: "Internet", 
    amount: 100, 
    date: new Date(2023, 4, 15), 
    dueDate: addDays(new Date(), 10), 
    category: "Moradia", 
    isPaid: false, 
    isRecurring: true 
  },
];

interface Expense {
  id: number;
  description: string;
  amount: number;
  date: Date;
  dueDate: Date;
  category: string;
  isPaid: boolean;
  isRecurring: boolean;
}

export const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenseData);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // New expense form state
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [category, setCategory] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState<Date | undefined>(new Date());
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "paid" | "pending">("all");

  // Format dates
  const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: pt });
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Clear form
  const clearForm = () => {
    setDescription("");
    setAmount(0);
    setDate(new Date());
    setDueDate(new Date());
    setCategory("");
    setIsPaid(false);
    setIsRecurring(false);
    setEditingExpense(null);
  };

  // Open add dialog
  const openAddDialog = () => {
    clearForm();
    setIsAddDialogOpen(true);
  };

  // Open edit dialog
  const openEditDialog = (expense: Expense) => {
    setEditingExpense(expense);
    setDescription(expense.description);
    setAmount(expense.amount);
    setDate(expense.date);
    setDueDate(expense.dueDate);
    setCategory(expense.category);
    setIsPaid(expense.isPaid);
    setIsRecurring(expense.isRecurring);
    setIsAddDialogOpen(true);
  };

  // Handle save
  const handleSave = () => {
    if (!description || amount <= 0 || !date || !dueDate || !category) {
      // Handle validation error
      console.error("Please fill in all fields");
      return;
    }

    if (editingExpense) {
      // Update existing
      setExpenses(
        expenses.map((exp) =>
          exp.id === editingExpense.id
            ? { 
                ...exp, 
                description, 
                amount, 
                date: date!, 
                dueDate: dueDate!, 
                category, 
                isPaid, 
                isRecurring 
              }
            : exp
        )
      );
    } else {
      // Add new
      const newExpense: Expense = {
        id: Math.max(0, ...expenses.map((e) => e.id)) + 1,
        description,
        amount,
        date: date!,
        dueDate: dueDate!,
        category,
        isPaid,
        isRecurring,
      };
      setExpenses([...expenses, newExpense]);
    }

    setIsAddDialogOpen(false);
    clearForm();
  };

  // Handle delete
  const handleDelete = (id: number) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  // Toggle paid status
  const togglePaidStatus = (id: number) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === id ? { ...expense, isPaid: !expense.isPaid } : expense
      )
    );
  };

  // Filter expenses
  const filteredExpenses = expenses.filter((expense) => {
    // Search term
    const matchesSearch = expense.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) || 
      expense.category.toLowerCase().includes(searchTerm.toLowerCase());

    // Month filter (for due date)
    const matchesMonth = !filterMonth || 
      (expense.dueDate.getMonth() === filterMonth.getMonth() && 
       expense.dueDate.getFullYear() === filterMonth.getFullYear());

    // Category filter
    const matchesCategory = !filterCategory || expense.category === filterCategory;

    // Status filter
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "paid" && expense.isPaid) ||
      (filterStatus === "pending" && !expense.isPaid);

    return matchesSearch && matchesMonth && matchesCategory && matchesStatus;
  });

  // Calculate totals
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const paidExpenses = filteredExpenses
    .filter((expense) => expense.isPaid)
    .reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = filteredExpenses
    .filter((expense) => !expense.isPaid)
    .reduce((sum, expense) => sum + expense.amount, 0);

  // Get due status
  const getDueStatus = (dueDate: Date, isPaid: boolean) => {
    if (isPaid) return "paid";
    if (isPast(dueDate) && !isToday(dueDate)) return "overdue";
    if (isToday(dueDate)) return "due-today";
    
    const daysUntilDue = Math.ceil(
      (dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysUntilDue <= 3) return "due-soon";
    return "upcoming";
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setFilterMonth(undefined);
    setFilterCategory("");
    setFilterStatus("all");
  };

  // Check if any filter is active
  const isFilterActive = searchTerm || filterMonth || filterCategory || filterStatus !== "all";

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Despesas</h1>
          <p className="text-muted-foreground">
            Gerencie seus gastos e pagamentos
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Despesa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingExpense ? "Editar Despesa" : "Adicionar Nova Despesa"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  placeholder="Ex: Aluguel"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Valor</Label>
                <CurrencyInput
                  id="amount"
                  value={amount}
                  onChange={setAmount}
                  placeholder="R$ 0,00"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Data</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {date
                          ? format(date, "dd/MM/yyyy")
                          : "Selecione uma data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label>Data de Vencimento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dueDate
                          ? format(dueDate, "dd/MM/yyyy")
                          : "Selecione uma data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto">
                      <CalendarComponent
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is-paid"
                    checked={isPaid}
                    onCheckedChange={setIsPaid}
                  />
                  <Label htmlFor="is-paid">Já pago</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is-recurring"
                    checked={isRecurring}
                    onCheckedChange={setIsRecurring}
                  />
                  <Label htmlFor="is-recurring">Despesa recorrente</Label>
                </div>
              </div>
              <div className="grid gap-2 pt-2">
                <Button onClick={handleSave}>
                  {editingExpense ? "Atualizar" : "Adicionar"} Despesa
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FinanceCard variant="expense" className="h-full">
            <div className="flex flex-col h-full">
              <div className="mb-2">
                <TrendingDown className="h-5 w-5 text-finance-expense" />
              </div>
              <div className="flex-1 mb-2">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Total de Despesas
                </h2>
                <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {filteredExpenses.length} despesas registradas
              </p>
            </div>
          </FinanceCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <FinanceCard className="h-full">
            <div className="grid grid-cols-2 h-full gap-4">
              <div>
                <div className="mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <h2 className="text-sm font-medium text-muted-foreground">
                  Pagas
                </h2>
                <p className="text-xl font-bold mt-1">{formatCurrency(paidExpenses)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {filteredExpenses.filter(e => e.isPaid).length} despesas
                </p>
              </div>
              <div>
                <div className="mb-2">
                  <XCircle className="h-5 w-5 text-amber-500" />
                </div>
                <h2 className="text-sm font-medium text-muted-foreground">
                  Pendentes
                </h2>
                <p className="text-xl font-bold mt-1">{formatCurrency(pendingExpenses)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {filteredExpenses.filter(e => !e.isPaid).length} despesas
                </p>
              </div>
            </div>
          </FinanceCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <FinanceCard className="h-full" glassEffect={false}>
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-muted-foreground mb-3">
                Filtros
              </h2>

              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar despesa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      {filterMonth
                        ? format(filterMonth, "MMM yyyy", { locale: pt })
                        : "Mês"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto">
                    <CalendarComponent
                      mode="single"
                      selected={filterMonth}
                      onSelect={setFilterMonth}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <Tag className="mr-2 h-4 w-4" />
                    <span className="truncate">
                      {filterCategory || "Categoria"}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    {mockCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Select value={filterStatus} onValueChange={(val: "all" | "paid" | "pending") => setFilterStatus(val)}>
                <SelectTrigger>
                  <span className="truncate">
                    {filterStatus === "all" ? "Todos os status" : 
                     filterStatus === "paid" ? "Pagas" : "Pendentes"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="paid">Pagas</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                </SelectContent>
              </Select>

              {isFilterActive && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="w-full mt-1"
                >
                  <FilterX className="mr-2 h-4 w-4" />
                  Limpar Filtros
                </Button>
              )}
            </div>
          </FinanceCard>
        </motion.div>
      </div>

      {/* Expense List */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Despesas Registradas</h2>

        {filteredExpenses.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {filteredExpenses.map((expense, index) => {
              const dueStatus = getDueStatus(expense.dueDate, expense.isPaid);
              
              return (
                <FinanceCard
                  key={expense.id}
                  variant="expense"
                  className="animate-on-enter"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="font-medium">{expense.description}</h3>
                        {expense.isRecurring && (
                          <Badge variant="outline" className="ml-2">
                            Recorrente
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-secondary">
                          {expense.category}
                        </span>
                        <div className={`
                          flex items-center text-xs px-2 py-0.5 rounded-full
                          ${dueStatus === 'overdue' ? 'bg-red-100 text-finance-expense' : 
                            dueStatus === 'due-today' ? 'bg-amber-100 text-amber-700' :
                            dueStatus === 'due-soon' ? 'bg-amber-50 text-amber-600' : 
                            dueStatus === 'paid' ? 'bg-green-50 text-green-700' :
                            'bg-blue-50 text-blue-700'}
                        `}>
                          {dueStatus === 'overdue' ? (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          ) : dueStatus === 'paid' ? (
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                          ) : (
                            <Calendar className="h-3 w-3 mr-1" />
                          )}
                          {dueStatus === 'overdue' ? 'Atrasada' : 
                            dueStatus === 'due-today' ? 'Vence hoje' :
                            dueStatus === 'due-soon' ? 'Vence em breve' : 
                            dueStatus === 'paid' ? 'Paga' :
                            format(expense.dueDate, "dd/MM/yyyy")}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">
                        {formatCurrency(expense.amount)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={expense.isPaid ? "outline" : "default"}
                        size="sm"
                        onClick={() => togglePaidStatus(expense.id)}
                      >
                        {expense.isPaid ? (
                          <>
                            <XCircle className="h-4 w-4 mr-1" />
                            Marcar não pago
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Marcar pago
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(expense)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(expense.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </FinanceCard>
              );
            })}
          </motion.div>
        ) : (
          <EmptyState
            icon={<CreditCard />}
            title="Nenhuma despesa encontrada"
            description={
              isFilterActive
                ? "Tente remover alguns filtros para ver mais resultados."
                : "Comece adicionando sua primeira despesa."
            }
            action={
              !isFilterActive && (
                <Button onClick={openAddDialog}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nova Despesa
                </Button>
              )
            }
          />
        )}
      </div>
    </div>
  );
};
