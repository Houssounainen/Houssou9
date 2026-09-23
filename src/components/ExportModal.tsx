import React, { useRef } from 'react';
import { X, Download, Upload, RotateCcw, CheckCircle } from 'lucide-react';
import { Task, Transaction, Habit, Note, Language } from '../types';
import { translations } from '../utils/i18n';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  transactions: Transaction[];
  habits: Habit[];
  notes: Note[];
  onImportData: (data: {
    tasks?: Task[];
    transactions?: Transaction[];
    habits?: Habit[];
    notes?: Note[];
  }) => void;
  onResetData: () => void;
  language: Language;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  tasks,
  transactions,
  habits,
  notes,
  onImportData,
  onResetData,
  language,
}) => {
  const t = translations[language];
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    const backupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      tasks,
      transactions,
      habits,
      notes,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `houssou9_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        onImportData(json);
        alert(t.importSuccess);
        onClose();
      } catch (err) {
        alert(language === 'fr' ? 'Fichier JSON invalide' : 'Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {t.exportData}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed dark:text-slate-400">
            {language === 'fr'
              ? 'Toutes vos données sont stockées de façon sécurisée localement. Vous pouvez exporter une copie de sauvegarde ou restaurer vos éléments.'
              : 'All your data is safely stored locally. You can export a full backup or restore your entries.'}
          </p>

          <div className="rounded-xl bg-slate-50 p-3 text-xs space-y-1.5 dark:bg-slate-800">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>{t.tasks}:</span>
              <span className="font-bold">{tasks.length}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>{t.finances}:</span>
              <span className="font-bold">{transactions.length}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>{t.habits}:</span>
              <span className="font-bold">{habits.length}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>{t.notes}:</span>
              <span className="font-bold">{notes.length}</span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleExportJSON}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 px-4 text-xs font-bold text-white hover:bg-indigo-700 transition"
            >
              <Download className="h-4 w-4" />
              <span>{language === 'fr' ? 'Télécharger la sauvegarde JSON' : 'Download JSON Backup'}</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-2.5 px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <Upload className="h-4 w-4" />
              <span>{language === 'fr' ? 'Restaurer depuis un fichier' : 'Restore from JSON File'}</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />

            <button
              onClick={() => {
                if (window.confirm(language === 'fr' ? 'Réinitialiser toutes les données aux valeurs de démonstration ?' : 'Reset all data to demo values?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/60 py-2.5 px-4 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300"
            >
              <RotateCcw className="h-4 w-4" />
              <span>{language === 'fr' ? 'Réinitialiser aux valeurs de base' : 'Reset to default data'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
