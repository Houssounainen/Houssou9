import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Flame, 
  AlertCircle, 
  ArrowRight,
  Plus,
  Calendar,
  Sparkles,
  Check
} from 'lucide-react';
import { Task, Transaction, Habit, Note, Language, ActiveTab } from '../types';
import { translations } from '../utils/i18n';

interface DashboardViewProps {
  tasks: Task[];
  transactions: Transaction[];
  habits: Habit[];
  notes: Note[];
  language: Language;
  onNavigate: (tab: ActiveTab) => void;
  onToggleTask: (id: string) => void;
  onToggleHabit: (habitId: string) => void;
  onOpenTaskModal: () => void;
  onOpenTxModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  transactions,
  habits,
  notes,
  language,
  onNavigate,
  onToggleTask,
  onToggleHabit,
  onOpenTaskModal,
  onOpenTxModal,
}) => {
  const t = translations[language];
  const today = new Date().toISOString().split('T')[0];

  // Calculated metrics
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const pendingTasks = tasks.filter((t) => t.status !== 'done');
  const urgentTasks = pendingTasks.filter((t) => t.priority === 'urgent' || t.priority === 'high');

  const totalIncome = transactions
    .filter((tr) => tr.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((tr) => tr.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netBalance = totalIncome - totalExpense;

  // Habits completed today
  const habitsDoneToday = habits.filter((h) => h.completedDates.includes(today)).length;
  const habitCompletionRate = habits.length > 0 ? Math.round((habitsDoneToday / habits.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>{language === 'fr' ? 'Espace de pilotage' : 'Command Center'}</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'fr' ? 'Organiser, maîtriser et progresser' : 'Organize, master and achieve'}
            </h2>
            <p className="mt-1 text-sm text-indigo-100 max-w-xl">
              {language === 'fr'
                ? 'Retrouvez toutes vos activités, finances et routines en un seul endroit pour piloter efficacement vos journées.'
                : 'Manage your tasks, finances, and habits in one streamlined workspace to achieve daily clarity.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenTaskModal}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-indigo-900 shadow-md hover:bg-indigo-50 transition"
            >
              <Plus className="h-4 w-4 text-indigo-600" />
              <span>{t.addTask}</span>
            </button>
            <button
              onClick={onOpenTxModal}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-500/30 border border-white/20 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md hover:bg-indigo-500/40 transition"
            >
              <TrendingUp className="h-4 w-4" />
              <span>{t.addTransaction}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Balance Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t.netBalance}
            </span>
            <div className={`p-2 rounded-xl ${netBalance >= 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'}`}>
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {netBalance.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US', {
              style: 'currency',
              currency: 'EUR',
            })}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 text-emerald-600 font-semibold dark:text-emerald-400">
              +{totalIncome.toFixed(0)}€ {language === 'fr' ? 'entrées' : 'in'}
            </span>
            <span className="flex items-center gap-1 text-rose-500 font-semibold dark:text-rose-400">
              -{totalExpense.toFixed(0)}€ {language === 'fr' ? 'sorties' : 'out'}
            </span>
          </div>
        </div>

        {/* Tasks KPI Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t.tasks}
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {completedTasks}
            </span>
            <span className="text-xs text-slate-400">/ {tasks.length} {t.statusDone.toLowerCase()}</span>
          </div>
          <div className="mt-2">
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                style={{ width: `${tasks.length ? (completedTasks / tasks.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Habits KPI Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t.habits}
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {habitsDoneToday}
            </span>
            <span className="text-xs text-slate-400">/ {habits.length} {language === 'fr' ? 'validées' : 'done today'}</span>
          </div>
          <p className="mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
            {habitCompletionRate}% {language === 'fr' ? 'de réussite aujourd\'hui' : 'completed today'}
          </p>
        </div>

        {/* Urgent Priorities Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t.urgentTasks}
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold tracking-tight text-rose-600 dark:text-rose-400">
            {urgentTasks.length}
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {urgentTasks.length > 0 
              ? (language === 'fr' ? 'Nécessite votre attention immédiate' : 'Requires immediate focus')
              : (language === 'fr' ? 'Toutes les urgences sont traitées' : 'No critical items pending')}
          </p>
        </div>
      </div>

      {/* Main Grid: Priority Tasks + Daily Habits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Action Tasks (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-500" />
              {language === 'fr' ? 'Tâches prioritaires à traiter' : 'High Priority Tasks'}
            </h3>
            <button
              onClick={() => onNavigate('tasks')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              <span>{language === 'fr' ? 'Voir tout le Kanban' : 'View Kanban'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-2 divide-y divide-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:divide-slate-800">
            {pendingTasks.slice(0, 5).map((task) => {
              const isUrgent = task.priority === 'urgent' || task.priority === 'high';
              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition dark:hover:bg-slate-800/50"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-slate-300 text-white hover:border-indigo-600 transition dark:border-slate-600"
                    >
                      {task.status === 'done' && <Check className="h-3.5 w-3.5 bg-indigo-600 rounded text-white" />}
                    </button>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-medium text-slate-400">
                          {task.category}
                        </span>
                        {task.dueDate && (
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            • <Calendar className="h-3 w-3" /> {task.dueDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        task.priority === 'urgent'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : task.priority === 'high'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              );
            })}

            {pendingTasks.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-400">
                {language === 'fr' ? '🎉 Aucune tâche en attente ! Bravo.' : '🎉 All caught up! No pending tasks.'}
              </div>
            )}
          </div>

          {/* Quick Notes preview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === 'fr' ? 'Mémo stratégique épinglé' : 'Pinned Strategic Memo'}
              </h4>
              <button
                onClick={() => onNavigate('notes')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                {language === 'fr' ? 'Tous les mémos' : 'All memos'}
              </button>
            </div>
            {notes.length > 0 ? (
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800">
                <h5 className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
                  {notes[0].title}
                </h5>
                <p className="mt-2 text-xs text-slate-600 line-clamp-3 whitespace-pre-line leading-relaxed dark:text-slate-300">
                  {notes[0].content}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Daily Habits Checklist (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-500" />
              {language === 'fr' ? 'Habitudes du jour' : 'Daily Habits'}
            </h3>
            <button
              onClick={() => onNavigate('habits')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              {language === 'fr' ? 'Gérer' : 'Manage'}
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 dark:border-slate-800 dark:bg-slate-900">
            {habits.map((habit) => {
              const isDone = habit.completedDates.includes(today);
              return (
                <div
                  key={habit.id}
                  onClick={() => onToggleHabit(habit.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition select-none ${
                    isDone
                      ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-950/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-lg border transition ${
                        isDone
                          ? 'border-emerald-500 bg-emerald-500 text-white shadow-xs'
                          : 'border-slate-300 bg-white text-transparent dark:border-slate-700 dark:bg-slate-800'
                      }`}
                    >
                      <Check className="h-4 w-4" />
                    </div>
                    <div>
                      <span
                        className={`text-xs font-semibold ${
                          isDone
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {habit.title}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-slate-400">
                    {habit.completedDates.length}j
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Financial Glance */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === 'fr' ? 'Dernières transactions' : 'Recent Transactions'}
              </h4>
              <button
                onClick={() => onNavigate('finances')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                {language === 'fr' ? 'Voir tout' : 'View all'}
              </button>
            </div>
            <div className="space-y-2.5">
              {transactions.slice(0, 3).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between text-xs">
                  <div className="truncate pr-2">
                    <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {tx.title}
                    </div>
                    <div className="text-[11px] text-slate-400">{tx.date}</div>
                  </div>
                  <div
                    className={`font-bold shrink-0 ${
                      tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}
                    {tx.amount.toFixed(2)}€
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
