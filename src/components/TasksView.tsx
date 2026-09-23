import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  MoreVertical, 
  Trash2, 
  Edit3,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Task, TaskStatus, Priority, Language } from '../types';
import { translations } from '../utils/i18n';

interface TasksViewProps {
  tasks: Task[];
  language: Language;
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: TaskStatus) => void;
  searchQuery: string;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  language,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onUpdateStatus,
  searchQuery,
}) => {
  const t = translations[language];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const categories = Array.from(new Set(tasks.map((task) => task.category)));

  const columns: { id: TaskStatus; title: string; color: string }[] = [
    { id: 'todo', title: t.statusTodo, color: 'bg-slate-500' },
    { id: 'in_progress', title: t.statusInProgress, color: 'bg-indigo-500' },
    { id: 'review', title: t.statusReview, color: 'bg-amber-500' },
    { id: 'done', title: t.statusDone, color: 'bg-emerald-500' },
  ];

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      task.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;

    return matchesSearch && matchesCategory && matchesPriority;
  });

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300';
      case 'high':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300';
      case 'medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300';
      case 'low':
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const getNextStatus = (current: TaskStatus): TaskStatus => {
    if (current === 'todo') return 'in_progress';
    if (current === 'in_progress') return 'review';
    if (current === 'review') return 'done';
    return 'todo';
  };

  const getPrevStatus = (current: TaskStatus): TaskStatus => {
    if (current === 'done') return 'review';
    if (current === 'review') return 'in_progress';
    if (current === 'in_progress') return 'todo';
    return 'done';
  };

  return (
    <div className="space-y-6">
      {/* Top action bar & filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.tasks}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {filteredTasks.length} {language === 'fr' ? 'tâches affichées' : 'tasks displayed'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">{t.allCategories}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">{t.allPriorities}</option>
            <option value="urgent">{t.priorityUrgent}</option>
            <option value="high">{t.priorityHigh}</option>
            <option value="medium">{t.priorityMedium}</option>
            <option value="low">{t.priorityLow}</option>
          </select>

          {/* Add Task Button */}
          <button
            onClick={onAddTask}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
          >
            <Plus className="h-4 w-4" />
            <span>{t.addTask}</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => {
          const colTasks = filteredTasks.filter((task) => task.status === column.id);

          return (
            <div
              key={column.id}
              className="flex flex-col rounded-2xl bg-slate-100/70 p-3.5 border border-slate-200/60 dark:bg-slate-900/40 dark:border-slate-800 min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${column.color}`} />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {column.title}
                  </span>
                </div>
                <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-slate-600 shadow-2xs dark:bg-slate-800 dark:text-slate-400">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div className="flex-1 space-y-2.5 overflow-y-auto pt-1">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="group relative rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs transition hover:shadow-md hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getPriorityBadge(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                        <button
                          onClick={() => onEditTask(task)}
                          className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                          title={t.edit}
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(t.confirmDelete)) {
                              onDeleteTask(task.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                          title={t.delete}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="mt-2 text-xs font-bold text-slate-900 dark:text-white leading-snug">
                      {task.title}
                    </h4>

                    {task.description && (
                      <p className="mt-1 text-[11px] text-slate-500 line-clamp-2 dark:text-slate-400">
                        {task.description}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">
                        {task.category}
                      </span>
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {task.dueDate}
                        </span>
                      )}
                    </div>

                    {/* Move status buttons */}
                    <div className="mt-2.5 flex items-center justify-between pt-1 border-t border-slate-50 dark:border-slate-800/60">
                      <button
                        onClick={() => onUpdateStatus(task.id, getPrevStatus(task.status))}
                        className="p-1 text-slate-400 hover:text-indigo-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                        title={language === 'fr' ? 'Étape précédente' : 'Previous stage'}
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => onUpdateStatus(task.id, getNextStatus(task.status))}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                      >
                        <span>{language === 'fr' ? 'Avancer' : 'Advance'}</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-400 dark:border-slate-800">
                    {language === 'fr' ? 'Vide' : 'Empty'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
