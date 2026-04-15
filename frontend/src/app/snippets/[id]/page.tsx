"use client";

import { useSnippetDetails } from "@/hooks/use-snippet-details";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  Edit3,
  Calendar,
  Hash,
  Terminal,
  FileText,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { EditSnippetForm } from "@/components/edit-snippet-form";

export default function SnippetDetailsPage() {
  // ROUTING & QUERY PARAMS
  const searchParams = useSearchParams();
  const router = useRouter();

  // DATA FETCHING
  const { snippet, isLoading, isError, deleteSnippet, isDeleting } =
    useSnippetDetails();

  // EDIT MODE (URL-DRIVEN STATE)
  const isEditing = searchParams.get("edit") === "true";

  // HANDLERS
  const handleToggleEdit = (value: boolean) => {
    if (value) {
      router.push(`?edit=true`);
    } else {
      router.push(`?`);
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this snippet?")) {
      deleteSnippet();
    }
  };

  // LOADING STATE
  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );

  // ERROR STATE
  if (isError || !snippet)
    return (
      <div className="text-center p-20 text-rose-500 font-bold bg-slate-50 min-h-screen">
        Snippet not found.
      </div>
    );

  return (
    <main className="min-h-screen bg-[#f8fafc] py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold"
          >
            <ArrowLeft size={18} /> Back to Vault
          </Link>

          {/* ACTION BUTTONS */}
          {!isEditing && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-rose-600 font-bold hover:border-rose-300 hover:bg-rose-50 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Trash2 size={18} />
                )}
                Delete
              </button>

              <button
                onClick={() => handleToggleEdit(true)}
                className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-xl text-white font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 cursor-pointer"
              >
                <Edit3 size={18} /> Edit Snippet
              </button>
            </div>
          )}
        </div>

        {/* EDIT MODE */}
        {isEditing ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
            <h1 className="text-2xl font-black text-slate-900 mb-8">
              Edit Mode
            </h1>

            <EditSnippetForm
              snippet={snippet}
              onCancel={() => handleToggleEdit(false)}
              onSuccess={() => handleToggleEdit(false)}
            />
          </div>
        ) : (
          /* VIEW MODE */
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              {/* META INFO */}
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest">
                    {snippet.type}
                  </span>

                  <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                    <Calendar size={14} />
                    {new Date(snippet.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
                  {snippet.title}
                </h1>

                {/* TAGS */}
                <div className="flex flex-wrap gap-2">
                  {snippet.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 text-xs font-bold shadow-sm"
                    >
                      <Hash size={12} className="text-slate-400" /> {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-8 bg-slate-900 relative">
                <div className="absolute right-6 top-6 text-slate-500">
                  {snippet.type === "command" ? (
                    <Terminal size={24} />
                  ) : (
                    <FileText size={24} />
                  )}
                </div>

                <pre className="text-indigo-300 font-mono text-sm sm:text-base leading-relaxed overflow-x-auto">
                  <code>{snippet.content}</code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
