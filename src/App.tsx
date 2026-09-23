import React, { useState, useEffect } from 'react';
import { 
  Task, 
  Transaction, 
  Habit, 
  Note, 
  ActiveTab, 
  Language, 
  TaskStatus 
} from './types';
import { 
  INITIAL_TASKS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_HABITS, 
  INITIAL_NOTES 
} from './data/initialData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { TasksView } from './components/TasksView';
import { FinancesView } from './components/FinancesView';
import { HabitsView } from './components/HabitsView';
import { NotesView } from './components/NotesView';
import { TaskModal } from './components/TaskModal';
import { TransactionModal } from './components/TransactionModal';
import { ExportModal } from './components/ExportModal';

export function App() {
  // Persistence state
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('houssou9_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('houssou9_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('houssou9_habits');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('houssou9_notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('houssou9_lang');
    return saved === 'en' ? 'en' : 'fr';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('houssou9_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('houssou9_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('houssou9_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('houssou9_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('houssou9_lang', language);
  }, [language]);

  // Tasks actions
  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id
            ? { ...t, ...taskData, completedAt: taskData.status === 'done' ? (t.completedAt || new Date().toISOString()) : undefined }
            : t
        )
      );
      setEditingTask(null);
    } else {
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
        completedAt: taskData.status === 'done' ? new Date().toISOString() : undefined,
      };
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdateTaskStatus = (id: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: newStatus,
              completedAt: newStatus === 'done' ? new Date().toISOString() : undefined,
            }
          : t
      )
    );
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === 'done' ? 'todo' : 'done',
              completedAt: t.status === 'done' ? undefined : new Date().toISOString(),
            }
          : t
      )
    );
  };

  // Finances actions
  const handleSaveTransaction = (txData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tr) => tr.id !== id));
  };

  // Habits actions
  const handleToggleHabitDate = (habitId: string, dateStr: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const exists = h.completedDates.includes(dateStr);
        return {
          ...h,
          completedDates: exists
            ? h.completedDates.filter((d) => d !== dateStr)
            : [...h.completedDates, dateStr],
        };
      })
    );
  };

  const handleToggleHabitToday = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    handleToggleHabitDate(habitId, today);
  };

  const handleAddHabit = (habitData: Omit<Habit, 'id' | 'completedDates'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: `h-${Date.now()}`,
      completedDates: [],
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const handleDeleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  // Notes actions
  const handleAddNote = (noteData: Omit<Note, 'id' | 'updatedAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: `n-${Date.now()}`,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleTogglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  // Import / Reset actions
  const handleImportData = (data: {
    tasks?: Task[];
    transactions?: Transaction[];
    habits?: Habit[];
    notes?: Note[];
  }) => {
    if (data.tasks) setTasks(data.tasks);
    if (data.transactions) setTransactions(data.transactions);
    if (data.habits) setHabits(data.habits);
    if (data.notes) setNotes(data.notes);
  };

  const handleResetData = () => {
    setTasks(INITIAL_TASKS);
    setTransactions(INITIAL_TRANSACTIONS);
    setHabits(INITIAL_HABITS);
    setNotes(INITIAL_NOTES);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-slate-50 dark:bg-slate-950 font-sans">
      <Header
        language={language}
        onLanguageChange={setLanguage}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onOpenTaskModal={() => {
          setEditingTask(null);
          setIsTaskModalOpen(true);
        }}
        onOpenTxModal={() => setIsTxModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          language={language}
          counts={{
            tasksCount: tasks.filter((t) => t.status !== 'done').length,
            habitsStreak: habits.reduce((acc, h) => Math.max(acc, h.completedDates.length), 0),
            notesCount: notes.length,
          }}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            {activeTab === 'dashboard' && (
              <DashboardView
                tasks={tasks}
                transactions={transactions}
                habits={habits}
                notes={notes}
                language={language}
                onNavigate={setActiveTab}
                onToggleTask={handleToggleTask}
                onToggleHabit={handleToggleHabitToday}
                onOpenTaskModal={() => {
                  setEditingTask(null);
                  setIsTaskModalOpen(true);
                }}
                onOpenTxModal={() => setIsTxModalOpen(true)}
              />
            )}

            {activeTab === 'tasks' && (
              <TasksView
                tasks={tasks}
                language={language}
                onAddTask={() => {
                  setEditingTask(null);
                  setIsTaskModalOpen(true);
                }}
                onEditTask={(task) => {
                  setEditingTask(task);
                  setIsTaskModalOpen(true);
                }}
                onDeleteTask={handleDeleteTask}
                onUpdateStatus={handleUpdateTaskStatus}
                searchQuery={searchQuery}
              />
            )}

            {activeTab === 'finances' && (
              <FinancesView
                transactions={transactions}
                language={language}
                onAddTransaction={() => setIsTxModalOpen(true)}
                onDeleteTransaction={handleDeleteTransaction}
              />
            )}

            {activeTab === 'habits' && (
              <HabitsView
                habits={habits}
                language={language}
                onToggleHabitDate={handleToggleHabitDate}
                onAddHabit={handleAddHabit}
                onDeleteHabit={handleDeleteHabit}
              />
            )}

            {activeTab === 'notes' && (
              <NotesView
                notes={notes}
                language={language}
                onAddNote={handleAddNote}
                onDeleteNote={handleDeleteNote}
                onTogglePin={handleTogglePin}
                searchQuery={searchQuery}
              />
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        initialTask={editingTask}
        language={language}
      />

      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSave={handleSaveTransaction}
        language={language}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        tasks={tasks}
        transactions={transactions}
        habits={habits}
        notes={notes}
        onImportData={handleImportData}
        onResetData={handleResetData}
        language={language}
      />
    </div>
  );
}

export default App;
