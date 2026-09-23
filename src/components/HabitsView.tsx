import React, { useState } from 'react';
import { Plus, Flame, Check, Trash2, Calendar, Target } from 'lucide-react';
import { Habit, Language } from '../types';
import { translations } from '../utils/i18n';

interface HabitsViewProps {
  habits: Habit[];
  language: Language;
  onToggleHabitDate: (habitId: string, date: string) => void;
  onAddHabit: (habit: Omit<Habit, 'id' | 'completedDates'>) => void;
  onDeleteHabit: (id: string) => void;
}

export const HabitsView: React.FC<HabitsViewProps> = ({
  habits,
  language,
  onToggleHabitDate,
  onAddHabit,
  onDeleteHabit,
}) => {
  const t = translations[language];
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekdays' | 'weekly'>('daily');
  const [targetDays, setTargetDays] = useState(7);
  const [color, setColor] = useState('indigo');

  // Generate last 7 days dates array
  const last7Days: { dateStr: string; dayLabel: string; isToday: boolean }[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      weekday: 'short',
      day: 'numeric',
    });
    last7Days.push({
      dateStr,
      dayLabel,
      isToday: i === 0,
    });
  }

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddHabit({
      title: title.trim(),
      frequency,
      targetDaysPerWeek: targetDays,
      color,
    });
    setTitle('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.habits}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'fr'
              ? 'Construisez des routines solides par la répétition quotidienne'
              : 'Build lasting habits through daily focus and consistency'}
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>{showAddForm ? t.cancel : t.addHabit}</span>
        </button>
      </div>

      {/* Add Habit inline form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateHabit}
          className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 space-y-4 dark:border-indigo-900/50 dark:bg-indigo-950/20"
        >
          <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
            {t.addHabit}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.title}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={language === 'fr' ? 'Ex: 30 minutes de lecture quotidienne' : 'E.g. 30 mins daily reading'}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'fr' ? 'Fréquence' : 'Frequency'}
              </label>
              <select
                value={frequency}
                onChange={(e) => {
                  const val = e.target.value as 'daily' | 'weekdays' | 'weekly';
                  setFrequency(val);
                  setTargetDays(val === 'daily' ? 7 : val === 'weekdays' ? 5 : 3);
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                <option value="daily">{language === 'fr' ? 'Tous les jours (7j/7)' : 'Every day (7d/7)'}</option>
                <option value="weekdays">{language === 'fr' ? 'Jours ouvrés (5j/7)' : 'Weekdays (5d/7)'}</option>
                <option value="weekly">{language === 'fr' ? 'Hebdomadaire (3j/7)' : 'Weekly (3d/7)'}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-indigo-700"
            >
              {t.save}
            </button>
          </div>
        </form>
      )}

      {/* Habit Matrix */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-800/40">
                <th className="py-3 px-4 min-w-[200px]">{language === 'fr' ? 'Habitude' : 'Habit'}</th>
                {last7Days.map((d) => (
                  <th
                    key={d.dateStr}
                    className={`py-3 px-2 text-center min-w-[48px] ${
                      d.isToday ? 'text-indigo-600 font-extrabold dark:text-indigo-400' : ''
                    }`}
                  >
                    {d.dayLabel}
                  </th>
                ))}
                <th className="py-3 px-4 text-center">{language === 'fr' ? 'Série' : 'Streak'}</th>
                <th className="py-3 px-4 text-right">{language === 'fr' ? 'Actions' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {habits.map((habit) => {
                const completedCount = habit.completedDates.length;
                return (
                  <tr key={habit.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {habit.title}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {habit.frequency === 'daily'
                          ? (language === 'fr' ? 'Tous les jours' : 'Daily')
                          : habit.frequency === 'weekdays'
                          ? (language === 'fr' ? 'Du lundi au vendredi' : 'Weekdays')
                          : (language === 'fr' ? 'Hebdomadaire' : 'Weekly')}
                      </div>
                    </td>

                    {/* 7 Days checkboxes */}
                    {last7Days.map((d) => {
                      const isDone = habit.completedDates.includes(d.dateStr);
                      return (
                        <td key={d.dateStr} className="py-3.5 px-2 text-center">
                          <button
                            onClick={() => onToggleHabitDate(habit.id, d.dateStr)}
                            className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border transition ${
                              isDone
                                ? 'border-emerald-500 bg-emerald-500 text-white shadow-xs'
                                : 'border-slate-200 bg-white hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800'
                            }`}
                          >
                            {isDone && <Check className="h-4 w-4" />}
                          </button>
                        </td>
                      );
                    })}

                    {/* Streak Count */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                        <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        {completedCount}j
                      </span>
                    </td>

                    {/* Delete button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          if (window.confirm(t.confirmDelete)) {
                            onDeleteHabit(habit.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {habits.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-xs text-slate-400">
                    {t.noData}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
