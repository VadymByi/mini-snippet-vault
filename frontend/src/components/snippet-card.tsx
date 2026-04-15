"use client";

import { ISnippet } from "@/types/snippet";
import { useRouter } from "next/navigation";
import {
  Edit3,
  FileText,
  Hash,
  Link as LinkIcon,
  Terminal,
  Trash2,
} from "lucide-react";

interface SnippetCardProps {
  snippet: ISnippet;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  onTagClick: (tag: string) => void;
}

export function SnippetCard({
  snippet,
  onDelete,
  isDeleting,
  onTagClick,
}: SnippetCardProps) {
  const router = useRouter();

  // TYPE STYLES MAPPER
  const getTypeStyles = (type: string) => {
    switch (type) {
      case "command":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "link":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      default:
        return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  // CARD NAVIGATION HANDLER
  const handleCardClick = () => {
    router.push(`/snippets/${snippet._id}`);
  };

  return (
    // CARD CONTAINER
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div className="flex flex-col h-full">
        {/* HEADER: TYPE BADGE + ACTIONS */}
        <div className="flex items-start justify-between mb-4">
          {/* TYPE BADGE */}
          <div
            className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getTypeStyles(
              snippet.type,
            )}`}
          >
            <span className="flex items-center gap-1">
              {snippet.type === "command" && <Terminal size={12} />}
              {snippet.type === "note" && <FileText size={12} />}
              {snippet.type === "link" && <LinkIcon size={12} />}
              {snippet.type}
            </span>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
            {/* EDIT BUTTON */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/snippets/${snippet._id}?edit=true`);
              }}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer"
              title="Edit"
            >
              <Edit3 size={18} />
            </button>

            {/* DELETE BUTTON */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("Are you sure you want to remove this snippet?")) {
                  onDelete(snippet._id);
                }
              }}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-50 cursor-pointer"
              disabled={isDeleting}
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">
          {snippet.title}
        </h2>

        {/* CODE CONTENT */}
        <div className="relative mb-4 grow overflow-hidden rounded-xl bg-slate-900 p-4">
          <pre className="text-slate-100 text-[11px] overflow-x-auto font-mono leading-relaxed pointer-events-none">
            <code>{snippet.content}</code>
          </pre>
        </div>

        {/* TAGS */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {snippet.tags.map((tag) => (
            <button
              key={tag}
              onClick={(e) => {
                e.stopPropagation();
                onTagClick(tag);
              }}
              className="flex items-center gap-0.5 text-slate-600 text-[10px] font-black uppercase px-2 py-1 bg-slate-100 rounded-md border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 transition-all cursor-pointer"
            >
              <Hash size={10} className="text-slate-400" />
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
