import React, { useState } from 'react';
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Trash2, 
  Tag, 
  Calendar,
  PieChart
} from 'lucide-react';
import { Transaction, TransactionType, Language } from '../types';
import { translations } from '../utils/i18n';

interface FinancesViewProps {
  transactions: Transaction[];
  language: Language;
  onAddTransaction: () => void;
  onDeleteTransaction: (id: string) => void;
}

export const FinancesView: React.FC<FinancesViewProps> = ({
  transactions,
  language,
  onAddTransaction,
  onDeleteTransaction,
}) => {
  const t = translations[language];
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const totalIncome = transactions
    .filter((tr) => tr.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((tr) => tr.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const categories = Array.from(new Set(transactions.map((tr) => tr.category)));

  // Category breakdown for expenses
  const expenseByCategory = transactions
    .filter((tr) => tr.type === 'expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

  const filteredTransactions = transactions.filter((tr) => {
    const matchesType = filterType === 'all' || tr.type === filterType;
    const matchesCategory = selectedCategory === 'all' || tr.category === selectedCategory;
    return matchesType && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.finances}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'fr'
              ? 'Suivi rigoureux des flux financiers et analyse des postes de dépenses'
              : 'Detailed tracking of financial flows and expense distribution'}
          </p>
        </div>

        <button
          onClick={onAddTransaction}
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>{t.addTransaction}</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Net Cashflow */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t.netBalance}
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {netBalance.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US', {
              style: 'currency',
              currency: 'EUR',
            })}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {netBalance >= 0
              ? (language === 'fr' ? 'Trésorerie positive et saine' : 'Healthy positive balance')
              : (language === 'fr' ? 'Attention au déficit budgétaire' : 'Budget deficit warning')}
          </p>
        </div>

        {/* Total Income */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t.totalIncome}
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <ArrowDownRight className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
            +{totalIncome.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US', {
              style: 'currency',
              currency: 'EUR',
            })}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {transactions.filter((tr) => tr.type === 'income').length} {language === 'fr' ? 'entrées comptabilisées' : 'recorded incomes'}
          </p>
        </div>

        {/* Total Expenses */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t.totalExpense}
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold tracking-tight text-rose-600 dark:text-rose-400">
            -{totalExpense.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US', {
              style: 'currency',
              currency: 'EUR',
            })}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {transactions.filter((tr) => tr.type === 'expense').length} {language === 'fr' ? 'dépenses enregistrées' : 'recorded expenses'}
          </p>
        </div>
      </div>

      {/* Expense categories breakdown */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <PieChart className="h-4 w-4 text-indigo-500" />
          {language === 'fr' ? 'Répartition des dépenses par catégorie' : 'Expenses Breakdown by Category'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(expenseByCategory).map(([cat, amount]) => {
            const pct = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
            return (
              <div
                key={cat}
                className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">{cat}</span>
                  <span className="text-slate-900 dark:text-white font-bold">
                    {amount.toFixed(2)}€ ({pct}%)
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden dark:bg-slate-700">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transactions list */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-slate-200 gap-3 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {language === 'fr' ? 'Historique des transactions' : 'Transaction History'}
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Type */}
            <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
              <button
                onClick={() => setFilterType('all')}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  filterType === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-white'
                    : 'text-slate-500'
                }`}
              >
                {language === 'fr' ? 'Tous' : 'All'}
              </button>
              <button
                onClick={() => setFilterType('income')}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  filterType === 'income'
                    ? 'bg-white text-emerald-600 shadow-2xs dark:bg-slate-700 dark:text-emerald-400'
                    : 'text-slate-500'
                }`}
              >
                {t.typeIncome}
              </button>
              <button
                onClick={() => setFilterType('expense')}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  filterType === 'expense'
                    ? 'bg-white text-rose-600 shadow-2xs dark:bg-slate-700 dark:text-rose-400'
                    : 'text-slate-500'
                }`}
              >
                {t.typeExpense}
              </button>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="all">{t.allCategories}</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 hover:bg-slate-50/70 transition dark:hover:bg-slate-800/40"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    tx.type === 'income'
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                      : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                  }`}
                >
                  {tx.type === 'income' ? (
                    <ArrowDownRight className="h-5 w-5" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5" />
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {tx.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                    <span className="font-medium text-slate-500 dark:text-slate-400">{tx.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {tx.date}
                    </span>
                    {tx.notes && (
                      <>
                        <span>•</span>
                        <span className="italic text-slate-400 truncate max-w-xs">{tx.notes}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-extrabold ${
                    tx.type === 'income'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {tx.type === 'income' ? '+' : '-'}
                  {tx.amount.toFixed(2)}€
                </span>

                <button
                  onClick={() => {
                    if (window.confirm(t.confirmDelete)) {
                      onDeleteTransaction(tx.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition dark:hover:text-rose-400"
                  title={t.delete}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredTransactions.length === 0 && (
            <div className="p-8 text-center text-sm text-slate-400">
              {t.noData}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
