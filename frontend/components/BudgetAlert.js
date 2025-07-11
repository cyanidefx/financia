export default function BudgetAlert({ budgets, expenses }) {
    const alerts = budgets.map(budget => {
      const spent = expenses
        .filter(exp => exp.category === budget.category && new Date(exp.date).getMonth() + 1 === budget.month)
        .reduce((acc, exp) => acc + exp.amount, 0);
  
      if (spent > budget.limit) {
        return `⚠️ Budget exceeded for ${budget.category}! Limit: ₹${budget.limit}, Spent: ₹${spent}`;
      }
      return null;
    }).filter(Boolean);
  
    return (
      <div>
        {alerts.map((msg, idx) => (
          <p key={idx} style={{ color: 'red' }}>{msg}</p>
        ))}
      </div>
    );
  }
  