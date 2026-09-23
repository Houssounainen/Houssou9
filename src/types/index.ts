export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  category: string;
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
  estimatedMinutes?: number;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  notes?: string;
}

export interface BudgetGoal {
  category: string;
  monthlyLimit: number;
}

export interface Habit {
  id: string;
  title: string;
  frequency: 'daily' | 'weekdays' | 'weekly';
  targetDaysPerWeek: number;
  icon?: string;
  completedDates: string[]; // YYYY-MM-DD
  color: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  updatedAt: string;
}

export type ActiveTab = 'dashboard' | 'tasks' | 'finances' | 'habits' | 'notes';
export type Language = 'fr' | 'en';
