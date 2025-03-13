
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
    const matchesCategory = !filterCategory || filterCategory === "all" || income.category === filterCategory;

    return matchesSearch && matchesMonth && matchesCategory;
  });
