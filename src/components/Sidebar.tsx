import React from 'react';
import { LayoutDashboard, CheckSquare, Wallet, Flame, FileText, ChevronRight } from 'lucide-react';
import { ActiveTab, Language } from '../types';
import { translations } from '../utils/i18n';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  language: Language;
  counts: {
    tasksCount: number;
    habitsStreak: number;
    notesCount: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  language,
  counts,
}) => {
  const t = translations[language];

  const navigation = [
    {
      id: 'dashboard' as ActiveTab,
      label: t.dashboard,
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'tasks' as ActiveTab,
      label: t.tasks,
      icon: CheckSquare,
      badge: counts.tasksCount > 0 ? counts.tasksCount : null,
    },
    {
      id: 'finances' as ActiveTab,
      label: t.finances,
      icon: Wallet,
      badge: null,
    },
    {
      id: 'habits' as ActiveTab,
      label: t.habits,
      icon: Flame,
      badge: counts.habitsStreak > 0 ? `${counts.habitsStreak}j` : null,
    },
    {
      id: 'notes' as ActiveTab,
      label: t.notes,
      icon: FileText,
      badge: counts.notesCount > 0 ? counts.notesCount : null,
    },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-slate-200 bg-white p-3 md:p-4 dark:border-slate-800 dark:bg-slate-900 flex md:flex-col justify-between overflow-x-auto md:overflow-visible">
      <div className="flex md:flex-col gap-1 w-full">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2 hidden md:block">
          Navigation
        </div>
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs dark:bg-indigo-950/60 dark:text-indigo-300'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`h-4 w-4 ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    isActive
                      ? 'bg-indigo-200 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-200'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quote / Philosophy Box */}
      <div className="hidden md:block mt-8 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 to-purple-50/30 p-4 dark:border-indigo-900/30 dark:from-indigo-950/20 dark:to-purple-950/10">
        <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-300">
          « Afin de mieux gérer »
        </p>
        <p className="mt-1 text-[11px] text-slate-500 leading-relaxed dark:text-slate-400">
          {language === 'fr'
            ? 'La clé de l\'excellence réside dans la régularité et la vision claire de vos priorités.'
            : 'The key to excellence lies in consistency and a clear view of your priorities.'}
        </p>
      </div>
    </aside>
  );
};
