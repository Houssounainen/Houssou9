import { Task, Transaction, Habit, Note } from '../types';

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const dayBefore = new Date(Date.now() - 172800000).toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't-1',
    title: 'Finaliser le plan de développement Q4',
    description: 'Identifier les priorités stratégiques et définir les livrables clés pour le trimestre.',
    status: 'in_progress',
    priority: 'high',
    category: 'Stratégie',
    dueDate: tomorrow,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    estimatedMinutes: 90,
  },
  {
    id: 't-2',
    title: 'Audit des dépenses mensuelles',
    description: 'Passer en revue les abonnements et optimiser les coûts récurrents.',
    status: 'todo',
    priority: 'medium',
    category: 'Finance',
    dueDate: nextWeek,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    estimatedMinutes: 45,
  },
  {
    id: 't-3',
    title: 'Préparer la réunion de synchronisation hebdomadaire',
    description: 'Ordre du jour, compte-rendu des avancées et blocages éventuels.',
    status: 'todo',
    priority: 'urgent',
    category: 'Gestion',
    dueDate: today,
    createdAt: new Date().toISOString(),
    estimatedMinutes: 30,
  },
  {
    id: 't-4',
    title: 'Automatiser la sauvegarde des données Houssou9',
    description: 'Configurer l\'export automatique en JSON et vérifier la cohérence des modèles.',
    status: 'review',
    priority: 'high',
    category: 'Technique',
    dueDate: tomorrow,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    estimatedMinutes: 60,
  },
  {
    id: 't-5',
    title: 'Renouveler le certificat SSL et domaine',
    description: 'Vérification DNS et confirmation du prélèvement.',
    status: 'done',
    priority: 'medium',
    category: 'Technique',
    dueDate: yesterday,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    completedAt: yesterday,
    estimatedMinutes: 20,
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tr-1',
    title: 'Facturation Client - Prestation Conseil',
    amount: 3200,
    type: 'income',
    category: 'Prestations',
    date: yesterday,
    notes: 'Virement reçu avec succès',
  },
  {
    id: 'tr-2',
    title: 'Abonnement Cloud & Serveurs',
    amount: 89.90,
    type: 'expense',
    category: 'Outils & Logiciels',
    date: today,
    notes: 'Hébergement haute disponibilité',
  },
  {
    id: 'tr-3',
    title: 'Fournitures de bureau & Matériel ergonomique',
    amount: 145.50,
    type: 'expense',
    category: 'Équipement',
    date: dayBefore,
    notes: 'Support écran et carnet de notes',
  },
  {
    id: 'tr-4',
    title: 'Formation continue en gestion de projet',
    amount: 250.00,
    type: 'expense',
    category: 'Formation',
    date: dayBefore,
    notes: 'Certification méthodologies agiles',
  },
  {
    id: 'tr-5',
    title: 'Rétribution atelier partenaire',
    amount: 750,
    type: 'income',
    category: 'Partenariats',
    date: today,
    notes: 'Animation session stratégique',
  },
];

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'h-1',
    title: 'Revue matinale des priorités',
    frequency: 'daily',
    targetDaysPerWeek: 7,
    completedDates: [dayBefore, yesterday, today],
    color: 'indigo',
  },
  {
    id: 'h-2',
    title: 'Veille technologique & lecture (30 min)',
    frequency: 'weekdays',
    targetDaysPerWeek: 5,
    completedDates: [dayBefore, today],
    color: 'emerald',
  },
  {
    id: 'h-3',
    title: 'Activité sportive / marche active',
    frequency: 'daily',
    targetDaysPerWeek: 5,
    completedDates: [yesterday, today],
    color: 'amber',
  },
  {
    id: 'h-4',
    title: 'Clôture de journée et bilan zéro-inbox',
    frequency: 'weekdays',
    targetDaysPerWeek: 5,
    completedDates: [dayBefore, yesterday],
    color: 'violet',
  },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'n-1',
    title: 'Principes directeurs de gestion (Houssou9)',
    content: `1. Clarté avant vitesse : Définir avec précision l'objectif avant de passer à l'action.
2. Suivi rigoureux : Mesurer chaque semaine les entrées, sorties et avancements.
3. Simplification continue : Éliminer le superflu pour se concentrer sur l'essentiel.
4. Règle des 2 minutes : Si une tâche prend moins de 2 minutes, l'exécuter immédiatement.`,
    tags: ['Organisation', 'Vision', 'Règles'],
    pinned: true,
    updatedAt: today,
  },
  {
    id: 'n-2',
    title: 'Idées d\'améliorations et de fonctionnalités',
    content: `- Module de calcul du retour sur investissement (ROI) par projet
- Export PDF synthétique pour réunions de fin de mois
- Mode concentration chronométré (technique Pomodoro)`,
    tags: ['Idées', 'Futur'],
    pinned: false,
    updatedAt: yesterday,
  },
];
