import React from 'react';
import { Search, Globe, Plus, Download, CheckSquare, Receipt, Sparkles } from 'lucide-react';
import { Language, ActiveTab } from '../types';
import { translations } from '../utils/i18n';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeTab: ActiveTab;
  onOpenTaskModal: () => void;
  onOpenTxModal: () => void;
  onOpenExportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  searchQuery,
  onSearchChange,
  activeTab,
  onOpenTaskModal,
  onOpenTxModal,
  onOpenExportModal,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-4 md:px-8 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-none tracking-tight text-slate-900 dark:text-white">
            {t.appTitle}
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t.tagline}
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 max-w-md mx-auto hidden sm:flex">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-900"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Quick Add Buttons */}
        <button
          onClick={onOpenTaskModal}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 transition"
          title={t.addTask}
        >
          <CheckSquare className="h-3.5 w-3.5" />
          <span className="hidden md:inline">{t.addTask}</span>
        </button>

        <button
          onClick={onOpenTxModal}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          title={t.addTransaction}
        >
          <Receipt className="h-3.5 w-3.5" />
          <span className="hidden md:inline">{t.addTransaction}</span>
        </button>

        {/* Data & Backup */}
        <button
          onClick={onOpenExportModal}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition dark:text-slate-400 dark:hover:bg-slate-800"
          title={t.exportData}
        >
          <Download className="h-4 w-4" />
        </button>

        {/* Language Switcher */}
        <button
          onClick={() => onLanguageChange(language === 'fr' ? 'en' : 'fr')}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          title="Changer de langue / Change language"
        >
          <Globe className="h-3.5 w-3.5 text-indigo-500" />
          <span>{language.toUpperCase()}</span>
        </button>
      </div>
    </header>
  );
};
