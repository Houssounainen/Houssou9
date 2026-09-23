import React, { useState } from 'react';
import { Plus, Pin, Trash2, Tag, Calendar, Edit3 } from 'lucide-react';
import { Note, Language } from '../types';
import { translations } from '../utils/i18n';

interface NotesViewProps {
  notes: Note[];
  language: Language;
  onAddNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
  searchQuery: string;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  language,
  onAddNote,
  onDeleteNote,
  onTogglePin,
  searchQuery,
}) => {
  const t = translations[language];
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [pinned, setPinned] = useState(false);

  const filteredNotes = notes.filter((n) => {
    return (
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((tg) => tg.trim())
      .filter(Boolean);

    onAddNote({
      title: title.trim(),
      content: content.trim(),
      tags,
      pinned,
    });

    setTitle('');
    setContent('');
    setTagsInput('');
    setPinned(false);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.notes}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'fr'
              ? 'Conservez vos réflexions, procédures, comptes-rendus et mémos stratégiques'
              : 'Keep your strategic memos, notes, summaries and thoughts organized'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>{t.addNote}</span>
        </button>
      </div>

      {/* Add Note Modal/Form */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              {t.addNote}
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.title}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={language === 'fr' ? 'Titre de la note ou mémo' : 'Memo or note title'}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'fr' ? 'Contenu' : 'Content'}
                </label>
                <textarea
                  required
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={language === 'fr' ? 'Rédigez vos notes ici...' : 'Write notes here...'}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'fr' ? 'Tags (séparés par des virgules)' : 'Tags (separated by commas)'}
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Organisation, Idées, Réunion"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="pinCheck" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {language === 'fr' ? 'Épingler en haut' : 'Pin to top'}
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedNotes.map((note) => (
          <div
            key={note.id}
            className={`flex flex-col justify-between rounded-2xl border p-5 transition shadow-2xs hover:shadow-md ${
              note.pinned
                ? 'border-indigo-200 bg-indigo-50/30 dark:border-indigo-900/60 dark:bg-indigo-950/20'
                : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {note.title}
                </h4>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onTogglePin(note.id)}
                    className={`p-1 rounded-lg transition ${
                      note.pinned
                        ? 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-300'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                    title={note.pinned ? 'Détacher' : 'Épingler'}
                  >
                    <Pin className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(t.confirmDelete)) {
                        onDeleteNote(note.id);
                      }
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition"
                    title={t.delete}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-600 leading-relaxed whitespace-pre-line dark:text-slate-300">
                {note.content}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
              <div className="flex flex-wrap gap-1">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <span>{note.updatedAt}</span>
            </div>
          </div>
        ))}

        {sortedNotes.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-slate-400">
            {t.noData}
          </div>
        )}
      </div>
    </div>
  );
};
