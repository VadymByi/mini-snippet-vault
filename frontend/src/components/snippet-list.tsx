"use client";

import { ISnippet } from "@/types/snippet";
import { SnippetCard } from "./snippet-card";

interface SnippetListProps {
  snippets: ISnippet[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
  onTagClick: (tag: string) => void;
  searchQuery: string;
}

export function SnippetList({
  snippets,
  onDelete,
  isDeleting,
  onTagClick,
  searchQuery,
}: SnippetListProps) {
  // EMPTY STATE
  if (snippets.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400">
        {searchQuery
          ? `No snippets found for "${searchQuery}"`
          : "Your vault is empty. Create your first snippet above!"}
      </div>
    );
  }

  return (
    // GRID CONTAINER
    <div className="grid gap-6 md:grid-cols-2">
      {/* SNIPPET CARDS */}
      {snippets.map((snippet) => (
        <SnippetCard
          key={snippet._id}
          snippet={snippet}
          onDelete={onDelete}
          isDeleting={isDeleting}
          onTagClick={onTagClick}
        />
      ))}
    </div>
  );
}
