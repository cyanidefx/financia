import styles from '../styles/ExpenseCard.module.css';

export default function ExpenseCard({ expense }) {
  return (
    <div className={styles.card}>
      <h3>{expense.title}</h3>
      <p>Amount: ₹{expense.amount}</p>
      <p>Category: {expense.category}</p>
      <p>Date: {new Date(expense.date).toLocaleDateString()}</p>
      <p>Notes: {expense.notes}</p>
    </div>
  );
}
