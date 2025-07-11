import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{
      display: 'flex', justifyContent: 'center', gap: '2rem',
      fontSize: '1.2rem', marginBottom: '2rem'
    }}>
      <Link href="/"><b>Dashboard</b></Link>
      <Link href="/dashboard/budgets">Budgets</Link>
      <Link href="/dashboard/analytics">Analytics</Link>
      <Link href="/dashboard/export-import">Export/Import</Link>
    </nav>
  );
}
