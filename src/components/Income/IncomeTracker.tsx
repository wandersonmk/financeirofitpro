
import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/shared/CurrencyInput";
import { FinanceCard } from "../ui/FinanceCard";
import { EmptyState } from "../shared/EmptyState";
import { 
  PlusCircle, 
  Calendar, 
  DollarSign, 
  Search, 
  ArrowUpRight, 
  Pencil, 
  Trash2, 
  Tag,
  FilterX 
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

// Mock data for now
const mockCategories = [
  { id: 1, name: "Salário" },
  { id: 2, name: "Freelance" },
  { id: 3, name: "Investimentos" },
  { id: 4, name: "Outras Rendas" },
];

// Mock income data
const mockIncomeData = [
  { id: 1, description: "Salário Mensal", amount: 3500, date: new Date(2023, 4, 5), category: "Salário" },
  { id: 2, description: "Projeto de Website", amount: 1200, date: new Date(2023, 4, 15), category: "Freelance" },
  { id: 3, description: "Dividendos", amount: 300, date: new Date(2023, 4, 20), category: "Investimentos" },
];

interface Income {
  id: number;
  description: string;
  amount: number;
  date: Date;
  category: string;
}

export const IncomeTracker = () => {
  const [incomes, setIncomes] = useState<Income[]>(mockIncomeData);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  // New income form state
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [category, setCategory] = useState("");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState<Date | undefined>(new Date());
  const [filterCategory, setFilterCategory] = useState("");

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
    setCategory("");
    setEditingIncome(null);
  };

  // Open add dialog
  const openAddDialog = () => {
    clearForm();
    setIsAddDialogOpen(true);
  };

  // Open edit dialog
  const openEditDialog = (income: Income) => {
    setEditingIncome(income);
    setDescription(income.description);
    setAmount(income.amount);
    setDate(income.date);
    setCategory(income.category);
    setIsAddDialogOpen(true);
  };

  // Handle save
  const handleSave = () => {
    if (!description || amount <= 0 || !date || !category) {
      // Handle validation error
      console.error("Please fill in all fields");
      return;
    }

    if (editingIncome) {
      // Update existing
      setIncomes(
        incomes.map((inc) =>
          inc.id === editingIncome.id
            ? { ...inc, description, amount, date: date!, category }
            : inc
        )
      );
    } else {
      // Add new
      const newIncome: Income = {
        id: Math.max(0, ...incomes.map((i) => i.id)) + 1,
        description,
        amount,
        date: date!,
        category,
      };
      setIncomes([...incomes, newIncome]);
    }

    setIsAddDialogOpen(false);
    clearForm();
  };

  // Handle delete
  const handleDelete = (id: number) => {
    setIncomes(incomes.filter((income) => income.id !== id));
  };

  // Filter incomes
  const filteredIncomes = incomes.filter((income) => {
    // Search term
    const matchesSearch = income.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) || 
      income.category.toLowerCase().includes(searchTerm.toLowerCase());

    // Month filter
    const matchesMonth = !filterMonth || 
      (income.date.getMonth() === filterMonth.getMonth() && 
       income.date.getFullYear() === filterMonth.getFullYear());

    // Category filter
    const matchesCategory = !filterCategory || income.category === filterCategory;

    return matchesSearch && matchesMonth && matchesCategory;
  });

  // Calculate total income
  const totalIncome = filteredIncomes.reduce((sum, income) => sum + income.amount, 0);
  
  // Calculate total tithe
  const totalTithe = totalIncome * 0.1;

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setFilterMonth(undefined);
    setFilterCategory("");
  };

  // Check if any filter is active
  const isFilterActive = searchTerm || filterMonth || filterCategory;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Entradas Financeiras</h1>
          <p className="text-muted-foreground">
            Gerencie seus ganhos e cálculo de dízimo
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Entrada
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingIncome ? "Editar Entrada" : "Adicionar Nova Entrada"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  placeholder="Ex: Salário Mensal"
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
              <div className="grid gap-2 pt-2">
                <Button onClick={handleSave}>
                  {editingIncome ? "Atualizar" : "Adicionar"} Entrada
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
          <FinanceCard variant="income" className="h-full">
            <div className="flex flex-col h-full">
              <div className="mb-2">
                <ArrowUpRight className="h-5 w-5 text-finance-income" />
              </div>
              <div className="flex-1 mb-2">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Total de Entradas
                </h2>
                <p className="text-2xl font-bold">{formatCurrency(totalIncome)}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {filteredIncomes.length} entradas registradas
              </p>
            </div>
          </FinanceCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <FinanceCard variant="tithe" className="h-full">
            <div className="flex flex-col h-full">
              <div className="mb-2">
                <DollarSign className="h-5 w-5 text-finance-tithe" />
              </div>
              <div className="flex-1 mb-2">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Dízimo (10%)
                </h2>
                <p className="text-2xl font-bold">{formatCurrency(totalTithe)}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Baseado no total de entradas
              </p>
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
                  placeholder="Buscar entrada..."
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

      {/* Income List */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Entradas Registradas</h2>

        {filteredIncomes.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {filteredIncomes.map((income, index) => (
              <FinanceCard
                key={income.id}
                variant="income"
                className="animate-on-enter"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="font-medium">{income.description}</h3>
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-secondary text-muted-foreground">
                        {income.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(income.date)}
                    </p>
                  </div>
                  <div className="flex flex-col sm:items-end">
                    <div className="text-lg font-semibold">
                      {formatCurrency(income.amount)}
                    </div>
                    <div className="text-sm text-finance-tithe mt-1">
                      Dízimo: {formatCurrency(income.amount * 0.1)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(income)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(income.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              </FinanceCard>
            ))}
          </motion.div>
        ) : (
          <EmptyState
            icon={<DollarSign />}
            title="Nenhuma entrada encontrada"
            description={
              isFilterActive
                ? "Tente remover alguns filtros para ver mais resultados."
                : "Comece adicionando sua primeira entrada financeira."
            }
            action={
              !isFilterActive && (
                <Button onClick={openAddDialog}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nova Entrada
                </Button>
              )
            }
          />
        )}
      </div>
    </div>
  );
};
