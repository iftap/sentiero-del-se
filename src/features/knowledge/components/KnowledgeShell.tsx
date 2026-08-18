"use client";

import React, { useState, useTransition } from "react";
import {
  createFolderAction,
  createNoteAction,
  createConceptAction,
  createResourceAction,
} from "@/features/knowledge/actions";
import { formatEnglishDate } from "@/lib/utils";
import {
  Folder,
  FileText,
  Lightbulb,
  Link as LinkIcon,
  Plus,
  X,
  BookOpen,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface KnowledgeShellProps {
  folders: any[];
}

export function KnowledgeShell({ folders }: KnowledgeShellProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(
    folders[0]?.id || null
  );
  const [activeTab, setActiveTab] = useState<"notes" | "concepts" | "resources">("notes");
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isPending, startTransition] = useTransition();

  // Selected folder data
  const selectedFolder = folders.find((f) => f.id === selectedFolderId);

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    startTransition(async () => {
      const f = await createFolderAction(newFolderName);
      setNewFolderName("");
      setShowNewFolderModal(false);
      setSelectedFolderId(f.id);
    });
  };

  const handleCreateItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFolderId) return;

    const fd = new FormData(e.currentTarget);
    const title = fd.get("title") as string;

    startTransition(async () => {
      if (activeTab === "notes") {
        await createNoteAction(selectedFolderId, title, fd.get("content") as string);
      } else if (activeTab === "concepts") {
        await createConceptAction(selectedFolderId, {
          title,
          explanation: fd.get("explanation") as string,
          examples: fd.get("examples") as string,
        });
      } else if (activeTab === "resources") {
        await createResourceAction(selectedFolderId, title, fd.get("url") as string);
      }
      setShowNewItemModal(false);
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
      {/* Left Column: Folders Sidebar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-medium text-[var(--text-primary)]">
            Knowledge Folders
          </h2>
          <button
            onClick={() => setShowNewFolderModal(true)}
            className="p-1 rounded text-[var(--accent-blue)] hover:bg-[var(--bg-subtle)]"
            title="New folder"
          >
            <Plus size={16} />
          </button>
        </div>

        {folders.length === 0 ? (
          <div className="p-4 rounded-xl glass-card text-center text-xs font-sans text-[var(--text-muted)]">
            No folders created.
          </div>
        ) : (
          <div className="space-y-1.5">
            {folders.map((folder) => {
              const isSelected = folder.id === selectedFolderId;
              const itemCount =
                folder.notes.length + folder.concepts.length + folder.resources.length;
              return (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all text-xs font-sans",
                    isSelected
                      ? "bg-[var(--accent-blue-bg)] text-[var(--accent-blue)] font-medium border border-[var(--accent-blue)]/20"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]"
                  )}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Folder size={15} />
                    <span className="truncate">{folder.name}</span>
                  </div>
                  <span className="font-mono text-[10px] opacity-60 shrink-0">
                    {itemCount}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Right 3 Columns: Folder Contents & Content Panes */}
      <div className="md:col-span-3 space-y-6">
        {selectedFolder ? (
          <>
            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
              <div>
                <span className="section-label">Active Knowledge Folder</span>
                <h3 className="font-serif text-2xl font-medium text-[var(--text-primary)] mt-0.5">
                  {selectedFolder.name}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                {/* Content Tabs */}
                <div className="flex items-center bg-[var(--bg-subtle)] p-1 rounded-xl text-xs font-sans">
                  <button
                    onClick={() => setActiveTab("notes")}
                    className={cn(
                      "px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5",
                      activeTab === "notes"
                        ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm font-medium"
                        : "text-[var(--text-muted)]"
                    )}
                  >
                    <FileText size={13} />
                    <span>Notes ({selectedFolder.notes.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("concepts")}
                    className={cn(
                      "px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5",
                      activeTab === "concepts"
                        ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm font-medium"
                        : "text-[var(--text-muted)]"
                    )}
                  >
                    <Lightbulb size={13} />
                    <span>Concepts ({selectedFolder.concepts.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("resources")}
                    className={cn(
                      "px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5",
                      activeTab === "resources"
                        ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm font-medium"
                        : "text-[var(--text-muted)]"
                    )}
                  >
                    <LinkIcon size={13} />
                    <span>Resources ({selectedFolder.resources.length})</span>
                  </button>
                </div>

                <button
                  onClick={() => setShowNewItemModal(true)}
                  className="btn-primary text-xs"
                >
                  <Plus size={13} />
                  <span>
                    New {activeTab === "notes" ? "Note" : activeTab === "concepts" ? "Concept" : "Resource"}
                  </span>
                </button>
              </div>
            </div>

            {/* Notes Tab Content */}
            {activeTab === "notes" && (
              <div className="space-y-4">
                {selectedFolder.notes.length === 0 ? (
                  <div className="p-8 text-center glass-card rounded-2xl text-xs font-sans text-[var(--text-muted)]">
                    No rich notes in this folder yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedFolder.notes.map((note: any) => (
                      <div
                        key={note.id}
                        className="p-5 rounded-2xl glass-card space-y-2 hover:border-[var(--border-strong)] transition-all"
                      >
                        <h4 className="font-serif text-base font-medium text-[var(--text-primary)]">
                          {note.title}
                        </h4>
                        <p className="font-sans text-xs text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed line-clamp-4">
                          {note.content}
                        </p>
                        <p className="font-mono text-[10px] text-[var(--text-ghost)] pt-2 border-t border-[var(--border-subtle)]">
                          {formatEnglishDate(new Date(note.createdAt))}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Concepts Tab Content */}
            {activeTab === "concepts" && (
              <div className="space-y-4">
                {selectedFolder.concepts.length === 0 ? (
                  <div className="p-8 text-center glass-card rounded-2xl text-xs font-sans text-[var(--text-muted)]">
                    No concepts or mental models logged in this folder yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {selectedFolder.concepts.map((concept: any) => (
                      <div
                        key={concept.id}
                        className="p-6 rounded-2xl glass-card space-y-3"
                      >
                        <div className="flex items-center gap-2">
                          <Lightbulb size={16} className="text-[var(--accent-blue)]" />
                          <h4 className="font-serif text-lg font-medium text-[var(--text-primary)]">
                            {concept.title}
                          </h4>
                        </div>
                        {concept.explanation && (
                          <p className="font-sans text-xs text-[var(--text-secondary)] leading-relaxed">
                            {concept.explanation}
                          </p>
                        )}
                        {concept.examples && (
                          <div className="p-3 rounded-xl bg-[var(--bg-subtle)] text-xs font-sans text-[var(--text-muted)] border border-[var(--border-subtle)]">
                            <strong className="font-medium text-[var(--text-primary)]">Example: </strong>
                            {concept.examples}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Resources Tab Content */}
            {activeTab === "resources" && (
              <div className="space-y-3">
                {selectedFolder.resources.length === 0 ? (
                  <div className="p-8 text-center glass-card rounded-2xl text-xs font-sans text-[var(--text-muted)]">
                    No reference links or resources in this folder yet.
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--border-subtle)] glass-card rounded-2xl p-4">
                    {selectedFolder.resources.map((res: any) => (
                      <div
                        key={res.id}
                        className="py-3 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <LinkIcon size={15} className="text-[var(--accent-blue)]" />
                          <span className="font-sans text-sm font-medium text-[var(--text-primary)]">
                            {res.title}
                          </span>
                        </div>
                        {res.url && (
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-sans text-[var(--accent-blue)] hover:underline flex items-center gap-1 shrink-0"
                          >
                            <span>Open Link</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="empty-state glass-card rounded-2xl">
            <Folder size={32} className="text-[var(--text-muted)]" />
            <h3 className="font-serif text-lg text-[var(--text-primary)]">
              Create your first Knowledge folder
            </h3>
            <p className="font-sans text-xs text-[var(--text-muted)] max-w-sm">
              Organize notes, mental concepts, and reference resources in a clean second brain.
            </p>
            <button
              onClick={() => setShowNewFolderModal(true)}
              className="btn-primary text-xs mt-2"
            >
              New Folder
            </button>
          </div>
        )}
      </div>

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-sm glass-card-heavy rounded-2xl border border-[var(--border-strong)] p-6 space-y-4 shadow-[var(--shadow-elevated)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <h3 className="font-serif text-lg font-medium text-[var(--text-primary)]">
                Create Knowledge Folder
              </h3>
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="p-1 text-[var(--text-muted)]"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateFolder} className="space-y-3">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name (e.g. Systems Architecture)..."
                className="form-input text-xs"
                required
              />
              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(false)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="btn-primary text-xs">
                  Save Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Item Modal */}
      {showNewItemModal && selectedFolderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-lg glass-card-heavy rounded-2xl border border-[var(--border-strong)] p-6 space-y-4 shadow-[var(--shadow-elevated)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="font-serif text-lg font-medium text-[var(--text-primary)]">
                Add {activeTab === "notes" ? "Note" : activeTab === "concepts" ? "Concept" : "Resource"}
              </h3>
              <button
                onClick={() => setShowNewItemModal(false)}
                className="p-1 text-[var(--text-muted)]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-3">
              <input
                name="title"
                type="text"
                placeholder="Title..."
                className="form-input text-sm"
                required
              />

              {activeTab === "notes" && (
                <textarea
                  name="content"
                  placeholder="Rich notes content..."
                  className="form-input text-xs resize-none"
                  rows={4}
                />
              )}

              {activeTab === "concepts" && (
                <>
                  <textarea
                    name="explanation"
                    placeholder="Explanation of concept / idea..."
                    className="form-input text-xs resize-none"
                    rows={3}
                  />
                  <input
                    name="examples"
                    type="text"
                    placeholder="Examples..."
                    className="form-input text-xs"
                  />
                </>
              )}

              {activeTab === "resources" && (
                <input
                  name="url"
                  type="url"
                  placeholder="URL link (https://...)..."
                  className="form-input text-xs"
                />
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setShowNewItemModal(false)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="btn-primary text-xs">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
